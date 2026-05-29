#!/usr/bin/env python3
"""
agent_monitor.py — unified live monitor for every agent this project raises.

Two kinds of "agent" run in this repo, and this module gives them ONE place to
report into and ONE web dashboard to watch them live:

  * "cascade" — Python worker subprocesses (cascade-batch.py → cascade-resource.py)
                hitting Cerebras / Ollama / Gemini / OpenRouter. Fully instrumented:
                phases + real token usage.
  * "claude"  — Claude Code subagents (the Agent/Task tool). Reported via Claude Code
                hooks (PreToolUse "rising up", SubagentStop "going down").

Everything lands in a single SQLite store (WAL mode → many concurrent writers +
one reader is safe). A zero-dependency stdlib HTTP server renders a live dashboard.

No external Python deps — stdlib only (sqlite3, http.server, json, uuid, time).

------------------------------------------------------------------------------
WRITER API (import from another script — every call is best-effort / never raises):

    import agent_monitor as mon
    aid = mon.start_agent("cascade", "L02 generate", model="cerebras/gpt-oss-120b")
    mon.event(aid, "picking 45 exercises", phase="re-source")
    mon.record_usage(aid, tok_in=1200, tok_out=5400, model="cerebras/gpt-oss-120b")
    mon.finish_agent(aid, "ok")            # or "fail", error="..."

  Or attach to an id chosen by the parent (env AGENT_MONITOR_ID / a batch):
    aid = mon.start_agent("cascade", "L02", agent_id=os.environ.get("AGENT_MONITOR_ID"))

------------------------------------------------------------------------------
HOOK CLI (wired into ~/.claude/settings.json — reads hook JSON on stdin):

    python3 scripts/agent_monitor.py hook pre     # PreToolUse  (Agent/Task) → rising
    python3 scripts/agent_monitor.py hook stop     # SubagentStop            → down

------------------------------------------------------------------------------
DASHBOARD:

    python3 scripts/agent_monitor.py serve [--port 8770]
    open http://localhost:8770

MAINTENANCE:

    python3 scripts/agent_monitor.py init          # create the DB
    python3 scripts/agent_monitor.py clear         # wipe all rows (keep schema)
    python3 scripts/agent_monitor.py seed          # insert demo agents (for testing)
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sqlite3
import sys
import time
import uuid
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DB = ROOT / "monitoring" / "agents.db"

# Rough public per-1M-token USD rates. Free providers => 0. Estimates only;
# the dashboard labels cost as "est." Update as pricing changes.
PRICE_PER_M = {
    # provider/model substring : (input_usd_per_M, output_usd_per_M)
    "opus":       (15.0, 75.0),
    "sonnet":     (3.0, 15.0),
    "haiku":      (1.0, 5.0),
    "cerebras":   (0.0, 0.0),
    "gpt-oss":    (0.0, 0.0),
    "gemini":     (0.0, 0.0),
    "ollama":     (0.0, 0.0),
    "qwen":       (0.0, 0.0),
    "openrouter": (0.0, 0.0),
    "nemotron":   (0.0, 0.0),
}


def _db_path() -> Path:
    p = os.environ.get("AGENT_MONITOR_DB")
    return Path(p) if p else DEFAULT_DB


def _connect() -> sqlite3.Connection:
    path = _db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(str(path), timeout=10.0, isolation_level=None)
    con.execute("PRAGMA journal_mode=WAL;")
    con.execute("PRAGMA busy_timeout=5000;")
    con.execute("PRAGMA synchronous=NORMAL;")
    con.row_factory = sqlite3.Row
    return con


def init_db() -> None:
    con = _connect()
    con.executescript(
        """
        CREATE TABLE IF NOT EXISTS agents (
            id          TEXT PRIMARY KEY,
            kind        TEXT NOT NULL,            -- cascade | claude
            label       TEXT NOT NULL,
            agent_name  TEXT,                     -- named-agent / subagent_type (e.g. conselheiro-financas)
            model       TEXT,                     -- provider/model (e.g. claude-sonnet-4-6)
            status      TEXT NOT NULL,            -- running | ok | fail | killed
            phase       TEXT,                     -- latest phase / activity
            parent      TEXT,                     -- batch id / session id (grouping)
            tok_in      INTEGER NOT NULL DEFAULT 0,
            tok_out     INTEGER NOT NULL DEFAULT 0,
            cost_usd    REAL NOT NULL DEFAULT 0,
            started_at  REAL NOT NULL,
            updated_at  REAL NOT NULL,
            ended_at    REAL,
            error       TEXT,
            meta        TEXT                      -- JSON blob
        );
        CREATE TABLE IF NOT EXISTS events (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            agent_id  TEXT NOT NULL,
            ts        REAL NOT NULL,
            level     TEXT NOT NULL DEFAULT 'info',  -- info | ok | warn | error
            phase     TEXT,
            message   TEXT NOT NULL,
            tok_in    INTEGER NOT NULL DEFAULT 0,
            tok_out   INTEGER NOT NULL DEFAULT 0
        );
        CREATE INDEX IF NOT EXISTS idx_events_agent ON events(agent_id, ts);
        CREATE INDEX IF NOT EXISTS idx_agents_started ON agents(started_at);
        """
    )
    # Migration: add agent_name to pre-existing DBs (CREATE TABLE IF NOT EXISTS
    # won't alter an existing table).
    cols = {r[1] for r in con.execute("PRAGMA table_info(agents)").fetchall()}
    if "agent_name" not in cols:
        con.execute("ALTER TABLE agents ADD COLUMN agent_name TEXT")
    con.close()


def _price_for(model: str | None) -> tuple[float, float]:
    if not model:
        return (0.0, 0.0)
    m = model.lower()
    for key, rate in PRICE_PER_M.items():
        if key in m:
            return rate
    return (0.0, 0.0)


def _cost(tok_in: int, tok_out: int, model: str | None) -> float:
    pin, pout = _price_for(model)
    return (tok_in / 1_000_000) * pin + (tok_out / 1_000_000) * pout


# ---------------------------------------------------------------------------
# Writer API — best-effort. Monitoring must NEVER break the pipeline, so every
# public writer swallows its own exceptions (set AGENT_MONITOR_DEBUG=1 to see them).
# ---------------------------------------------------------------------------

def _soft(fn):
    def wrapped(*a, **k):
        try:
            return fn(*a, **k)
        except Exception as e:  # noqa: BLE001
            if os.environ.get("AGENT_MONITOR_DEBUG"):
                print(f"[agent_monitor] {fn.__name__} failed: {e}", file=sys.stderr)
            return None
    return wrapped


@_soft
def start_agent(kind: str, label: str, *, model: str | None = None,
                agent_name: str | None = None,
                parent: str | None = None, meta: dict | None = None,
                agent_id: str | None = None) -> str:
    init_db()
    aid = agent_id or uuid.uuid4().hex[:12]
    now = time.time()
    con = _connect()
    # Upsert: a parent may pre-register the agent as "queued"; worker promotes it.
    con.execute(
        """
        INSERT INTO agents (id, kind, label, agent_name, model, status, phase, parent,
                            started_at, updated_at, meta)
        VALUES (?, ?, ?, ?, ?, 'running', NULL, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            kind=excluded.kind, label=excluded.label,
            agent_name=COALESCE(excluded.agent_name, agents.agent_name),
            model=COALESCE(excluded.model, agents.model),
            status='running', parent=COALESCE(excluded.parent, agents.parent),
            updated_at=excluded.updated_at,
            meta=COALESCE(excluded.meta, agents.meta)
        """,
        (aid, kind, label, agent_name, model, parent, now, now,
         json.dumps(meta) if meta else None),
    )
    con.close()
    return aid


@_soft
def queue_agent(kind: str, label: str, *, model: str | None = None,
                parent: str | None = None, agent_id: str | None = None) -> str:
    """Pre-register an agent as 'queued' so it shows in the dashboard before it
    actually starts running (used by batch parents)."""
    init_db()
    aid = agent_id or uuid.uuid4().hex[:12]
    now = time.time()
    con = _connect()
    con.execute(
        """INSERT OR IGNORE INTO agents
           (id, kind, label, model, status, parent, started_at, updated_at)
           VALUES (?, ?, ?, ?, 'queued', ?, ?, ?)""",
        (aid, kind, label, model, parent, now, now),
    )
    con.close()
    return aid


@_soft
def event(agent_id: str, message: str, *, level: str = "info",
          phase: str | None = None, tok_in: int = 0, tok_out: int = 0) -> None:
    if not agent_id:
        return
    now = time.time()
    con = _connect()
    con.execute(
        "INSERT INTO events (agent_id, ts, level, phase, message, tok_in, tok_out)"
        " VALUES (?, ?, ?, ?, ?, ?, ?)",
        (agent_id, now, level, phase, message, tok_in, tok_out),
    )
    sets = ["updated_at=?"]
    params: list = [now]
    if phase:
        sets.append("phase=?")
        params.append(phase)
    if tok_in or tok_out:
        sets.append("tok_in=tok_in+?")
        sets.append("tok_out=tok_out+?")
        params.extend([tok_in, tok_out])
    params.append(agent_id)
    con.execute(f"UPDATE agents SET {', '.join(sets)} WHERE id=?", params)
    if tok_in or tok_out:
        _recost(con, agent_id)
    con.close()


@_soft
def record_usage(agent_id: str, *, tok_in: int = 0, tok_out: int = 0,
                 model: str | None = None) -> None:
    if not agent_id:
        return
    now = time.time()
    con = _connect()
    if model:
        con.execute("UPDATE agents SET model=? WHERE id=? AND (model IS NULL OR model='')",
                    (model, agent_id))
    con.execute(
        "UPDATE agents SET tok_in=tok_in+?, tok_out=tok_out+?, updated_at=? WHERE id=?",
        (tok_in, tok_out, now, agent_id),
    )
    _recost(con, agent_id)
    con.close()


def _recost(con: sqlite3.Connection, agent_id: str) -> None:
    row = con.execute("SELECT tok_in, tok_out, model FROM agents WHERE id=?",
                       (agent_id,)).fetchone()
    if row:
        con.execute("UPDATE agents SET cost_usd=? WHERE id=?",
                    (_cost(row["tok_in"], row["tok_out"], row["model"]), agent_id))


@_soft
def finish_agent(agent_id: str, status: str = "ok", *, error: str | None = None) -> None:
    if not agent_id:
        return
    now = time.time()
    con = _connect()
    con.execute(
        "UPDATE agents SET status=?, ended_at=?, updated_at=?, error=? WHERE id=?",
        (status, now, now, error, agent_id),
    )
    con.close()


# ---------------------------------------------------------------------------
# Read API (for the dashboard / CLI)
# ---------------------------------------------------------------------------

def get_state() -> dict:
    init_db()
    con = _connect()
    agents = [dict(r) for r in con.execute(
        "SELECT * FROM agents ORDER BY (status IN ('running','queued')) DESC, started_at DESC"
    ).fetchall()]
    # latest activity line per agent
    latest = {}
    for r in con.execute(
        "SELECT agent_id, message, level, ts FROM events e1 "
        "WHERE ts = (SELECT MAX(ts) FROM events e2 WHERE e2.agent_id=e1.agent_id)"
    ).fetchall():
        latest[r["agent_id"]] = {"message": r["message"], "level": r["level"], "ts": r["ts"]}
    con.close()

    now = time.time()
    tot_in = sum(a["tok_in"] for a in agents)
    tot_out = sum(a["tok_out"] for a in agents)
    tot_cost = sum(a["cost_usd"] for a in agents)
    running = sum(1 for a in agents if a["status"] == "running")
    queued = sum(1 for a in agents if a["status"] == "queued")
    failed = sum(1 for a in agents if a["status"] == "fail")
    for a in agents:
        a["last"] = latest.get(a["id"])
        st = a["started_at"]
        a["duration"] = ((a["ended_at"] or now) - st) if st else None
    return {
        "now": now,
        "agents": agents,
        "totals": {
            "agents": len(agents), "running": running, "queued": queued,
            "failed": failed, "tok_in": tot_in, "tok_out": tot_out,
            "cost_usd": tot_cost,
        },
    }


def get_agent(agent_id: str) -> dict:
    init_db()
    con = _connect()
    a = con.execute("SELECT * FROM agents WHERE id=?", (agent_id,)).fetchone()
    evs = [dict(r) for r in con.execute(
        "SELECT * FROM events WHERE agent_id=? ORDER BY ts ASC", (agent_id,)
    ).fetchall()]
    con.close()
    return {"agent": dict(a) if a else None, "events": evs}


# ---------------------------------------------------------------------------
# Claude Code hook handlers (read hook JSON on stdin)
#   PreToolUse  → agent "rising up"   (matcher: Agent / Task)
#   SubagentStop → agent "going down"
# Hook payload shapes vary by Claude Code version; we read defensively.
# ---------------------------------------------------------------------------

def _read_hook_payload(which: str = "?") -> dict:
    try:
        raw = sys.stdin.read()
    except Exception:  # noqa: BLE001
        return {}
    # Capture the raw payload shape (best-effort) so we can verify the field
    # mapping against THIS harness's real hook JSON. Safe to delete the file.
    try:
        dump = _db_path().parent / "hook-payloads.jsonl"
        dump.parent.mkdir(parents=True, exist_ok=True)
        with dump.open("a") as f:
            f.write(json.dumps({"hook": which, "ts": time.time(), "raw": raw}) + "\n")
    except Exception:  # noqa: BLE001
        pass
    try:
        return json.loads(raw) if raw.strip() else {}
    except Exception:  # noqa: BLE001
        return {}


def _hook_session_id(p: dict) -> str | None:
    return p.get("session_id") or p.get("sessionId") or None


def _iso_to_epoch(ts: str | None) -> float | None:
    if not ts:
        return None
    try:
        return datetime.fromisoformat(str(ts).replace("Z", "+00:00")).timestamp()
    except Exception:  # noqa: BLE001
        return None


def _msg_text(message: dict) -> str | None:
    c = message.get("content") if isinstance(message, dict) else None
    if isinstance(c, str):
        return c
    if isinstance(c, list):
        for b in c:
            if isinstance(b, dict) and b.get("type") == "text":
                return b.get("text", "")
            if isinstance(b, str):
                return b
    return None


def _parse_subagent_transcript(path: str | None) -> dict:
    """Read a subagent's own JSONL transcript and extract the real model, total
    token usage (with cache-aware cost), the task prompt (label), and the
    start/end timestamps. The SubagentStop hook payload carries none of this —
    the transcript is the only authoritative source.
    """
    out: dict = {"model": None, "agent_name": None, "tok_in": 0, "tok_out": 0,
                 "cost": 0.0, "label": None, "started_at": None, "ended_at": None}
    if not path or not os.path.exists(path):
        return out
    try:
        with open(path) as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    o = json.loads(line)
                except Exception:  # noqa: BLE001
                    continue
                ts = _iso_to_epoch(o.get("timestamp"))
                if ts is not None:
                    out["started_at"] = ts if out["started_at"] is None else min(out["started_at"], ts)
                    out["ended_at"] = ts if out["ended_at"] is None else max(out["ended_at"], ts)
                if out["agent_name"] is None and o.get("attributionAgent"):
                    out["agent_name"] = o.get("attributionAgent")
                t = o.get("type")
                if t == "user" and out["label"] is None:
                    txt = _msg_text(o.get("message", {}))
                    if txt:
                        # Strip the "You are Claude Sonnet 4.6 " boilerplate prefix
                        # so the label reads as the actual role/task.
                        txt = re.sub(r"^You are Claude \S+ [\d.]+\s+", "", txt.strip())
                        out["label"] = txt.splitlines()[0][:90]
                elif t == "assistant":
                    msg = o.get("message", {}) if isinstance(o.get("message"), dict) else {}
                    m = msg.get("model")
                    if m:
                        out["model"] = m
                    u = msg.get("usage") or {}
                    it = int(u.get("input_tokens") or 0)
                    cc = int(u.get("cache_creation_input_tokens") or 0)
                    cr = int(u.get("cache_read_input_tokens") or 0)
                    ot = int(u.get("output_tokens") or 0)
                    out["tok_in"] += it + cc + cr
                    out["tok_out"] += ot
                    pin, pout = _price_for(m or "")
                    # Anthropic cache pricing: writes ≈1.25× input, reads ≈0.10× input.
                    out["cost"] += (it + cc * 1.25 + cr * 0.10) / 1_000_000 * pin \
                        + ot / 1_000_000 * pout
    except Exception:  # noqa: BLE001
        return out
    out["cost"] = round(out["cost"], 6)
    return out


def hook_pre() -> int:
    """PreToolUse on the Agent/Task tool: a Claude subagent is rising up. Creates
    a live 'running' row keyed by tool_use_id (the only id PreToolUse gives)."""
    try:
        p = _read_hook_payload("pre")
        tool = p.get("tool_name") or p.get("toolName") or ""
        if tool not in ("Task", "Agent"):
            return 0  # not a subagent spawn; ignore
        ti = p.get("tool_input") or p.get("toolInput") or {}
        subtype = ti.get("subagent_type") or ti.get("subagentType") or "agent"
        desc = ti.get("description") or (ti.get("prompt", "")[:60]) or subtype
        aid = p.get("tool_use_id") or p.get("toolUseId") or uuid.uuid4().hex[:12]
        # agent_name = the named agent (subagent_type, e.g. conselheiro-financas);
        # model stays provisional and SubagentStop fills the real LLM from the
        # transcript. We DON'T put subtype in model anymore — name has its own column.
        start_agent("claude", str(desc), agent_name=str(subtype),
                    parent=_hook_session_id(p), agent_id=str(aid),
                    meta={"subagent_type": subtype, "pending": True})
        event(str(aid), f"agent '{subtype}' rising up", phase="running")
    except Exception as e:  # noqa: BLE001
        if os.environ.get("AGENT_MONITOR_DEBUG"):
            print(f"[agent_monitor] hook_pre: {e}", file=sys.stderr)
    return 0


def hook_stop() -> int:
    """SubagentStop: a subagent went down. The payload has agent_id +
    agent_transcript_path but NO tool_use_id and NO token usage. So we:
      1. parse the transcript for real model + tokens + cost + timing,
      2. reconcile with the PreToolUse 'running' row (no shared id → match the
         oldest running claude row in this session, preferring same type),
      3. write one finished row.
    """
    try:
        p = _read_hook_payload("stop")
        agent_id = p.get("agent_id") or p.get("agentId") or uuid.uuid4().hex[:12]
        agent_type = p.get("agent_type") or p.get("agentType") or "agent"
        session = _hook_session_id(p)
        last_msg = p.get("last_assistant_message") or "subagent finished"
        tr = _parse_subagent_transcript(p.get("agent_transcript_path")
                                        or p.get("agentTranscriptPath"))

        init_db()
        con = _connect()
        # The canonical id is the subagent's hex id (matches the transcript
        # filename and what `backfill` uses → no duplicates). Reconcile with the
        # live PreToolUse 'running' row: the two hooks share no id, so match the
        # oldest running claude row in this session (prefer agent_name==agent_type),
        # carry over its rise-time + label + name, then delete it.
        target_id = str(agent_id)
        pre_started = None
        pre_label = None
        pre_name = None
        if session:
            cands = con.execute(
                "SELECT id, agent_name, started_at, label FROM agents WHERE kind='claude' "
                "AND status='running' AND parent=? ORDER BY started_at ASC", (session,)
            ).fetchall()
            match = next((r for r in cands if r["agent_name"] == agent_type), None)
            if match is None and cands:
                match = cands[0]
            if match:
                pre_started = match["started_at"]   # the real "rising up" time
                pre_label = match["label"]
                pre_name = match["agent_name"]
                if match["id"] != target_id:
                    con.execute("DELETE FROM agents WHERE id=?", (match["id"],))
                    con.execute("UPDATE events SET agent_id=? WHERE agent_id=?",
                                (target_id, match["id"]))

        now = time.time()
        model = tr["model"] or "?"            # the real LLM, from the transcript
        name = pre_name or agent_type          # the named agent (subagent_type)
        tin, tout, cost = tr["tok_in"], tr["tok_out"], tr["cost"]
        started = pre_started or tr["started_at"] or now
        ended = tr["ended_at"] or now
        label = pre_label or tr["label"] or agent_type
        con.execute(
            """INSERT INTO agents (id, kind, label, agent_name, model, status, phase, parent,
                   tok_in, tok_out, cost_usd, started_at, updated_at, ended_at)
               VALUES (?, 'claude', ?, ?, ?, 'ok', 'done', ?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET
                   model=excluded.model, agent_name=COALESCE(excluded.agent_name, agents.agent_name),
                   status='ok', phase='done',
                   tok_in=excluded.tok_in, tok_out=excluded.tok_out,
                   cost_usd=excluded.cost_usd, updated_at=excluded.updated_at,
                   ended_at=excluded.ended_at,
                   label=COALESCE(agents.label, excluded.label),
                   started_at=COALESCE(agents.started_at, excluded.started_at)""",
            (target_id, label, name, model, session, tin, tout, cost, started, now, ended),
        )
        con.execute(
            "INSERT INTO events (agent_id, ts, level, phase, message, tok_in, tok_out)"
            " VALUES (?, ?, 'ok', 'done', ?, ?, ?)",
            (target_id, now, str(last_msg)[:200], tin, tout),
        )
        con.close()
    except Exception as e:  # noqa: BLE001
        if os.environ.get("AGENT_MONITOR_DEBUG"):
            print(f"[agent_monitor] hook_stop: {e}", file=sys.stderr)
    return 0


# ---------------------------------------------------------------------------
# Dashboard — stdlib HTTP server + embedded single-page app
# ---------------------------------------------------------------------------

DASHBOARD_HTML = r"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Agent Mission Control · Clube da Matemática</title>
<style>
  :root{
    --bg:#0b0f14; --panel:#121922; --panel2:#0f151d; --line:#1e2a38;
    --txt:#e6edf3; --dim:#7d8da0; --teal:#2dd4bf; --gold:#f5c451;
    --green:#36d399; --red:#f87272; --amber:#fbbd23; --blue:#60a5fa; --violet:#a78bfa;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--txt);
    font:14px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
  header{display:flex;align-items:center;gap:16px;padding:14px 20px;
    border-bottom:1px solid var(--line);background:linear-gradient(180deg,#101722,#0b0f14)}
  header h1{font-size:15px;margin:0;letter-spacing:.5px;font-weight:600}
  header h1 .dot{color:var(--teal)}
  .stats{display:flex;gap:22px;margin-left:auto;flex-wrap:wrap}
  .stat{text-align:right}
  .stat b{display:block;font-size:18px;font-weight:700}
  .stat span{font-size:10px;color:var(--dim);text-transform:uppercase;letter-spacing:.8px}
  .controls{display:flex;gap:8px;padding:10px 20px;border-bottom:1px solid var(--line);
    align-items:center;flex-wrap:wrap;background:var(--panel2)}
  .seg{display:inline-flex;border:1px solid var(--line);border-radius:7px;overflow:hidden}
  .seg button{background:transparent;color:var(--dim);border:0;border-left:1px solid var(--line);
    padding:5px 12px;cursor:pointer;font:inherit;font-size:12px;transition:background .12s,color .12s}
  .seg button:first-child{border-left:0}
  .seg button:hover{background:#16212e;color:var(--txt)}
  .seg button.on{background:var(--teal);color:#04211d;font-weight:700}
  .controls .sel{background:var(--panel);color:var(--txt);border:1px solid var(--line);
    border-radius:7px;padding:5px 10px;font:inherit;font-size:12px;cursor:pointer}
  .controls .live{margin-left:auto;color:var(--dim);font-size:12px;display:flex;
    align-items:center;gap:7px}
  .pulse{width:8px;height:8px;border-radius:50%;background:var(--green);
    box-shadow:0 0 0 0 rgba(54,211,153,.7);animation:p 1.6s infinite}
  @keyframes p{0%{box-shadow:0 0 0 0 rgba(54,211,153,.6)}70%{box-shadow:0 0 0 8px rgba(54,211,153,0)}100%{box-shadow:0 0 0 0 rgba(54,211,153,0)}}
  table{width:100%;border-collapse:collapse}
  thead th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.8px;
    color:var(--dim);padding:9px 12px;border-bottom:1px solid var(--line);position:sticky;top:0;
    background:var(--panel2)}
  thead th.sortable{cursor:pointer;user-select:none}
  thead th.sortable:hover{color:var(--txt)}
  thead th.num{text-align:right}
  .ar{color:var(--teal);margin-left:4px;font-size:11px}
  tbody td{padding:9px 12px;border-bottom:1px solid #131c27;vertical-align:middle}
  tbody tr.agent{cursor:pointer}
  tbody tr.agent:hover{background:#0f1620}
  .pill{display:inline-block;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700}
  .s-running{background:rgba(96,165,250,.16);color:var(--blue)}
  .s-queued{background:rgba(125,141,160,.16);color:var(--dim)}
  .s-ok{background:rgba(54,211,153,.16);color:var(--green)}
  .s-fail{background:rgba(248,114,114,.18);color:var(--red)}
  .s-killed{background:rgba(251,189,35,.16);color:var(--amber)}
  .badge{font-size:10px;padding:1px 7px;border-radius:5px;font-weight:700;letter-spacing:.4px}
  .k-cascade{background:rgba(45,212,191,.14);color:var(--teal)}
  .k-claude{background:rgba(167,139,250,.16);color:var(--violet)}
  .label{font-weight:600}
  .aname{font-size:11px;font-weight:700;color:var(--gold);letter-spacing:.3px;margin-bottom:1px}
  .model{color:var(--dim);font-size:12px}
  .activity{color:var(--dim);font-size:12px;max-width:340px;overflow:hidden;
    text-overflow:ellipsis;white-space:nowrap}
  .activity.l-warn{color:var(--amber)} .activity.l-error{color:var(--red)}
  .activity.l-ok{color:var(--green)}
  .num{text-align:right;font-variant-numeric:tabular-nums}
  .dur{color:var(--gold);font-variant-numeric:tabular-nums}
  .spin{display:inline-block;animation:sp 1s linear infinite}
  @keyframes sp{to{transform:rotate(360deg)}}
  .detail{background:#0a1119}
  .detail td{padding:0}
  .events{padding:6px 18px 12px 40px}
  .ev{display:grid;grid-template-columns:78px 90px 1fr auto;gap:10px;padding:3px 0;
    font-size:12px;border-bottom:1px solid #101820}
  .ev .t{color:var(--dim)} .ev .ph{color:var(--teal)}
  .ev.l-warn .m{color:var(--amber)} .ev.l-error .m{color:var(--red)} .ev.l-ok .m{color:var(--green)}
  .ev .tk{color:var(--dim);text-align:right}
  .empty{padding:60px;text-align:center;color:var(--dim)}
  .err{color:var(--red);font-size:12px;margin-top:3px}
  /* time-series chart */
  .chartwrap{padding:12px 20px 6px;border-bottom:1px solid var(--line);
    background:linear-gradient(180deg,#0e151e,#0b0f14)}
  .charthead{display:flex;align-items:center;gap:14px;margin-bottom:4px}
  .ctitle{font-size:10px;text-transform:uppercase;letter-spacing:.9px;color:var(--dim)}
  .charthead .seg{transform:scale(.92);transform-origin:left}
  .legend{display:flex;gap:13px;flex-wrap:wrap;margin-left:auto;font-size:11px}
  .legend .li{display:flex;align-items:center;gap:5px;color:var(--dim)}
  .legend .sw{width:10px;height:10px;border-radius:2px;display:inline-block}
  .chartrow{position:relative;display:flex;align-items:stretch;height:222px}
  .yaxis{flex:0 0 auto;height:214px}
  #yL{width:70px}
  .yaxis text{fill:var(--dim);font-size:9px}
  .chartscroll{flex:1;overflow:hidden;height:216px;cursor:grab}
  .chartscroll.drag{cursor:grabbing}
  #chart{height:214px;display:block}
  #chart text{fill:var(--dim);font-size:9px}
  #chart .grid{stroke:#18222e;stroke-width:1}
  #chart .gridv{stroke:#141d28;stroke-width:1}
  .axlabel{font-size:9px;text-transform:uppercase;letter-spacing:.5px}
  .ctip{position:absolute;pointer-events:none;background:#0b1219;border:1px solid var(--line);
    border-radius:8px;padding:8px 10px;font-size:12px;color:var(--txt);display:none;z-index:5;
    box-shadow:0 8px 24px rgba(0,0,0,.55);min-width:160px}
  .ctip .tt{color:var(--teal);font-size:10px;margin-bottom:5px;letter-spacing:.4px}
  .ctip .row{display:flex;justify-content:space-between;gap:16px;line-height:1.7}
  .ctip .row .c{display:flex;align-items:center;gap:6px}
  .ctip .tot{border-top:1px solid var(--line);margin-top:4px;padding-top:4px;font-weight:700}
</style></head>
<body>
<header>
  <h1><span class="dot">●</span> AGENT MISSION CONTROL</h1>
  <div class="stats">
    <div class="stat"><b id="st-run">0</b><span>running</span></div>
    <div class="stat"><b id="st-q">0</b><span>queued</span></div>
    <div class="stat"><b id="st-fail" style="color:var(--red)">0</b><span>failed</span></div>
    <div class="stat"><b id="st-tin">0</b><span>tok in</span></div>
    <div class="stat"><b id="st-tout">0</b><span>tok out</span></div>
    <div class="stat"><b id="st-cost" style="color:var(--gold)">$0</b><span>est. cost</span></div>
  </div>
</header>
<div class="chartwrap">
  <div class="charthead">
    <span class="ctitle">activity over time · UTC&minus;3</span>
    <span class="ctitle" style="opacity:.7">each line auto-scaled · drag to pan · hover for values</span>
    <div class="legend" id="legend"></div>
  </div>
  <div class="chartrow" id="chartrow">
    <svg id="yL" class="yaxis"></svg>
    <div class="chartscroll" id="chartscroll"><svg id="chart" preserveAspectRatio="none"></svg></div>
    <div class="ctip" id="ctip"></div>
  </div>
</div>
<div class="controls">
  <div class="seg" id="f-kind">
    <button data-v="all" class="on">all</button>
    <button data-v="cascade">cascade</button>
    <button data-v="claude">claude</button>
  </div>
  <div class="seg" id="f-status">
    <button data-v="all" class="on">all</button>
    <button data-v="active">active</button>
    <button data-v="ok">done</button>
    <button data-v="fail">failed</button>
  </div>
  <select id="f-model" class="sel"><option value="all">all models</option></select>
  <div class="seg" id="f-when">
    <button data-v="all" class="on">all time</button>
    <button data-v="today">today</button>
    <button data-v="yesterday">yesterday</button>
    <button data-v="7d">7 days</button>
  </div>
  <div class="live"><span class="pulse"></span> live · refresh <span id="rt">2s</span></div>
</div>
<table>
  <thead><tr>
    <th class="sortable" data-k="status">status<span class="ar"></span></th>
    <th class="sortable" data-k="kind">kind<span class="ar"></span></th>
    <th class="sortable" data-k="label">agent<span class="ar"></span></th>
    <th class="sortable" data-k="model">model<span class="ar"></span></th>
    <th>activity</th>
    <th class="sortable num" data-k="tok_in">tok in<span class="ar"></span></th>
    <th class="sortable num" data-k="tok_out">tok out<span class="ar"></span></th>
    <th class="sortable num" data-k="cost_usd">est $<span class="ar"></span></th>
    <th class="sortable num" data-k="started_at">started · UTC&minus;3<span class="ar"></span></th>
    <th class="sortable num" data-k="ended_at">ended · UTC&minus;3<span class="ar"></span></th>
    <th class="sortable num" data-k="duration">dur<span class="ar"></span></th>
  </tr></thead>
  <tbody id="rows"></tbody>
</table>
<div class="empty" id="empty">No agents yet. Raise some and they'll appear here live.</div>

<script>
let fKind="all", fStatus="all", fModel="all", fWhen="all", expanded=new Set(), eventsCache={};
let sortKey="started_at", sortDir=-1;   // default: newest first
const STATUS_RANK={running:0,queued:1,ok:2,fail:3,killed:4};
function dayNum(s){return s?Math.floor((s-3*3600)/86400):-1;}  // UTC-3 calendar-day index
function sortVal(a,k){
  if(k==='label')return (a.label||'').toLowerCase();
  if(k==='kind')return a.kind||'';
  if(k==='model')return (a.model||'').toLowerCase();
  if(k==='status')return STATUS_RANK[a.status]??9;
  if(k==='duration')return a.duration==null?-Infinity:a.duration;
  return a[k]||0;   // tok_in, tok_out, cost_usd, started_at, ended_at
}
function fmtN(n){if(n>=1e6)return (n/1e6).toFixed(1)+"M";if(n>=1e3)return (n/1e3).toFixed(1)+"k";return ""+n}
function fmtCost(c){return c>=0.01?"$"+c.toFixed(2):(c>0?"<$0.01":"$0")}
function dur(s){if(s==null)return "—";if(s<60)return s.toFixed(1)+"s";if(s<3600)return Math.floor(s/60)+"m"+Math.floor(s%60)+"s";return Math.floor(s/3600)+"h"+Math.floor((s%3600)/60)+"m"}
// epoch seconds → wall-clock string in UTC-3 (Brasília), browser-tz-independent.
function pad(n){return String(n).padStart(2,"0")}
function utc3(s){return new Date(s*1000-3*3600*1000)}
function fmtDT(s){if(!s)return "—";const d=utc3(s);return `${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`}
function fmtDTm(s){if(!s)return "";const d=utc3(s);return `${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`}
function fmtTime(s){if(!s)return "";const d=utc3(s);return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`}

/* ---- time-series chart: THREE lines — tok in + tok out (left axis, tokens)
   and cost (right axis, $) — horizontally scrollable, hover shows all three.
   Aggregated over the CURRENT filter, so model=opus → opus's three lines. ---- */
let chartState=null;
const CHART_H=214, CHART_T=8, CHART_B=20, CHART_PAD=8;
const C_IN="#60a5fa", C_OUT="#2dd4bf", C_COST="#f5c451";   // tok in / tok out / cost
function buildSeries(list){
  const ag=list.filter(a=>a.started_at);
  if(!ag.length)return null;
  let mn=Infinity,mx=-Infinity; for(const a of ag){mn=Math.min(mn,a.started_at);mx=Math.max(mx,a.started_at);}
  const binSec=3600;                              // 1-hour buckets
  const mn0=Math.floor(mn/binSec)*binSec;         // align to the hour boundary
  const NB=Math.max(2, Math.floor((mx-mn0)/binSec)+1);
  const bins=Array.from({length:NB},(_,i)=>({t:mn0+i*binSec, tin:0, tout:0, cost:0}));
  for(const a of ag){let i=Math.floor((a.started_at-mn0)/binSec); if(i<0)i=0; if(i>=NB)i=NB-1;
    bins[i].tin+=(a.tok_in||0); bins[i].tout+=(a.tok_out||0); bins[i].cost+=(a.cost_usd||0);}
  return {bins,mn:mn0,mx,NB,binSec};
}
function niceMax(v){if(v<=0)return 1;const p=Math.pow(10,Math.floor(Math.log10(v)));const n=v/p;
  return (n<=1?1:n<=2?2:n<=5?5:10)*p;}
// Monotone cubic (Fritsch–Carlson) → smooth curve that never overshoots the
// data, so spiky 0→peak→0 series don't dip below the baseline.
function smoothPath(xs,ys){
  const n=xs.length; if(n===0)return ""; if(n===1)return `M${xs[0]},${ys[0]}`;
  const dx=[],dy=[],m=[];
  for(let i=0;i<n-1;i++){dx[i]=xs[i+1]-xs[i];dy[i]=ys[i+1]-ys[i];m[i]=dy[i]/(dx[i]||1);}
  const t=new Array(n); t[0]=m[0]; t[n-1]=m[n-2];
  for(let i=1;i<n-1;i++) t[i]=(m[i-1]*m[i]<=0)?0:(m[i-1]+m[i])/2;
  for(let i=0;i<n-1;i++){ if(m[i]===0){t[i]=0;t[i+1]=0;}
    else{const a=t[i]/m[i],b=t[i+1]/m[i],h=Math.hypot(a,b); if(h>3){const s=3/h;t[i]=s*a*m[i];t[i+1]=s*b*m[i];}}}
  let d=`M${xs[0].toFixed(1)},${ys[0].toFixed(1)}`;
  for(let i=0;i<n-1;i++){const h=dx[i];
    d+=` C${(xs[i]+h/3).toFixed(1)},${(ys[i]+t[i]*h/3).toFixed(1)} ${(xs[i+1]-h/3).toFixed(1)},${(ys[i+1]-t[i+1]*h/3).toFixed(1)} ${xs[i+1].toFixed(1)},${ys[i+1].toFixed(1)}`;}
  return d;
}
function renderChart(list){
  const scroll=$("chartscroll"), svg=$("chart"), yL=$("yL");
  const s=buildSeries(list);
  if(!s){svg.innerHTML="";yL.innerHTML="";$("legend").innerHTML="";chartState=null;return;}
  let pkIn=0,pkOut=0,pkCost=0;
  for(const b of s.bins){pkIn=Math.max(pkIn,b.tin);pkOut=Math.max(pkOut,b.tout);pkCost=Math.max(pkCost,b.cost);}
  $("legend").innerHTML=
    `<span class="li"><span class="sw" style="background:${C_IN}"></span>tok in</span>`+
    `<span class="li"><span class="sw" style="background:${C_OUT}"></span>tok out</span>`+
    `<span class="li"><span class="sw" style="background:${C_COST}"></span>cost $</span>`;
  const T=CHART_T,B=CHART_B,P=CHART_PAD,pH=CHART_H-T-B, baseY=T+pH;
  const vw=scroll.clientWidth||800, W=Math.max(vw, (s.NB-1)*22+2*P), pW=W-2*P;
  const xOf=i=> s.NB<=1?P+pW/2:P+i/(s.NB-1)*pW;
  const xs=s.bins.map((_,i)=>xOf(i));
  // THREE STACKED LANES — each metric in its own horizontal band so the lines
  // can never overlap; each lane scales to its own peak.
  const GAP=12, laneH=(pH-2*GAP)/3;
  const LANES=[['tin',C_IN,'tok in',pkIn,v=>fmtN(Math.round(v))],
               ['tout',C_OUT,'tok out',pkOut,v=>fmtN(Math.round(v))],
               ['cost',C_COST,'cost $',pkCost,v=>fmtCost(v)]];
  let g=`<defs>`+LANES.map(([k,c])=>
      `<linearGradient id="grad-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity="0.22"/><stop offset="100%" stop-color="${c}" stop-opacity="0"/></linearGradient>`).join('')+`</defs>`;
  // vertical time gridlines + x labels (shared)
  const ticks=Math.min(8,s.NB-1);
  for(let k=0;k<=ticks;k++){const i=Math.round(k/ticks*(s.NB-1)); const x=xOf(i);
    g+=`<line class="gridv" x1="${x.toFixed(1)}" y1="${T}" x2="${x.toFixed(1)}" y2="${baseY}"/>`;
    g+=`<text x="${x.toFixed(1)}" y="${CHART_H-5}" text-anchor="middle">${fmtDTm(s.bins[i].t)}</text>`;}
  let gl="";
  LANES.forEach(([key,color,label,peak,fmt],li)=>{
    const top=T+li*(laneH+GAP), base=top+laneH;
    const y=v=> base-(peak>0?v/peak:0)*laneH;
    g+=`<line class="grid" x1="${P}" y1="${base.toFixed(1)}" x2="${W-P}" y2="${base.toFixed(1)}"/>`;  // lane baseline
    const p=smoothPath(xs,s.bins.map(b=>y(b[key])));
    g+=`<path d="${p} L${xs[xs.length-1].toFixed(1)},${base.toFixed(1)} L${xs[0].toFixed(1)},${base.toFixed(1)} Z" fill="url(#grad-${key})" stroke="none"/>`;
    g+=`<path d="${p}" fill="none" stroke="${color}" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round"/>`;
    // per-lane left axis: name + peak at top, 0 at base
    gl+=`<text class="axlabel" x="66" y="${(top+8).toFixed(1)}" text-anchor="end" fill="${color}">${label}</text>`;
    gl+=`<text x="66" y="${(top+18).toFixed(1)}" text-anchor="end" fill="${color}" opacity="0.85">${fmt(peak)}</text>`;
    gl+=`<text x="66" y="${(base).toFixed(1)}" text-anchor="end" opacity="0.6">0</text>`;
  });
  g+=`<line id="cur" x1="-9" y1="${T}" x2="-9" y2="${baseY}" stroke="var(--txt)" stroke-opacity="0.55" stroke-dasharray="3 3"/>`;
  svg.setAttribute("viewBox",`0 0 ${W} ${CHART_H}`); svg.setAttribute("width",W); svg.setAttribute("height",CHART_H);
  svg.innerHTML=g;
  yL.setAttribute("viewBox",`0 0 70 ${CHART_H}`); yL.innerHTML=gl;
  chartState={s,P,pW,xOf,W};
  if(scroll.dataset.pinned!=="0") scroll.scrollLeft=scroll.scrollWidth;  // pin latest (right)
}
function chartHover(e){
  const cs=chartState; const tip=$("ctip"), svg=$("chart"); if(!cs){tip.style.display="none";return;}
  const sr=svg.getBoundingClientRect();
  const ux=(e.clientX-sr.left)/sr.width*cs.W;          // svg may be panned/wider than viewport
  let i=Math.round((ux-cs.P)/cs.pW*(cs.s.NB-1)); i=Math.max(0,Math.min(cs.s.NB-1,i));
  const b=cs.s.bins[i];
  const cur=document.getElementById("cur"); if(cur){const x=cs.xOf(i);cur.setAttribute("x1",x);cur.setAttribute("x2",x);}
  const row=(c,lab,val,bar)=>`<div class="row"><span class="c"><span class="sw" style="width:${bar?12:9}px;height:${bar?3:9}px;${bar?'':'border-radius:2px;'}background:${c}"></span>${lab}</span><span>${val}</span></div>`;
  tip.innerHTML=`<div class="tt">${fmtDT(b.t)}</div>`+
    row(C_IN,"tok in",fmtN(Math.round(b.tin))||"0")+
    row(C_OUT,"tok out",fmtN(Math.round(b.tout))||"0")+
    row(C_COST,"cost",fmtCost(b.cost),true);
  tip.style.display="block";
  const rr=$("chartrow").getBoundingClientRect(); let tx=e.clientX-rr.left+14;
  if(tx+170>rr.width)tx=e.clientX-rr.left-176; if(tx<0)tx=4; tip.style.left=tx+"px"; tip.style.top="4px";
}
function statusPill(a){
  const map={running:"running",queued:"queued",ok:"ok",fail:"fail",killed:"killed"};
  const ic=a.status==="running"?'<span class="spin">◓</span> ':'';
  return `<span class="pill s-${a.status}">${ic}${map[a.status]||a.status}</span>`;
}
function matches(a){
  if(fKind!=="all" && a.kind!==fKind) return false;
  if(fModel!=="all" && (a.model||"")!==fModel) return false;
  if(fWhen!=="all"){
    const d=dayNum(a.started_at), t=dayNum(Date.now()/1000);
    if(d<0) return false;
    if(fWhen==="today" && d!==t) return false;
    if(fWhen==="yesterday" && d!==t-1) return false;
    if(fWhen==="7d" && d<t-6) return false;
  }
  if(fStatus==="active" && !(a.status==="running"||a.status==="queued")) return false;
  if(fStatus==="ok" && a.status!=="ok") return false;
  if(fStatus==="fail" && !(a.status==="fail"||a.status==="killed")) return false;
  return true;
}
async function loadEvents(id){
  const r=await fetch("/api/agent/"+id); const d=await r.json();
  eventsCache[id]=d.events||[]; render(lastState);
}
function eventsHtml(id){
  const evs=eventsCache[id]; if(!evs) {loadEvents(id);return '<div class="events">loading…</div>';}
  if(!evs.length) return '<div class="events"><span style="color:var(--dim)">no events</span></div>';
  return '<div class="events">'+evs.map(e=>{
    const tk=(e.tok_in||e.tok_out)?`+${fmtN(e.tok_in)||0}/${fmtN(e.tok_out)||0}`:'';
    const t=fmtTime(e.ts);
    return `<div class="ev l-${e.level}"><span class="t">${t}</span>`+
      `<span class="ph">${e.phase||''}</span><span class="m">${esc(e.message)}</span>`+
      `<span class="tk">${tk}</span></div>`;
  }).join('')+'</div>';
}
function esc(s){return (s||"").replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
let lastState={agents:[],totals:{}};
const $=id=>document.getElementById(id);
function syncModelOptions(agents){
  const models=[...new Set(agents.map(a=>a.model).filter(Boolean))].sort();
  const sel=$("f-model");
  const want="all|"+models.join("|");
  if(sel.dataset.sig===want) return;        // unchanged → don't clobber selection
  sel.dataset.sig=want;
  const cur=sel.value;
  sel.innerHTML='<option value="all">all models</option>'+
    models.map(m=>`<option value="${esc(m)}">${esc(m)}</option>`).join('');
  sel.value=[...sel.options].some(o=>o.value===cur)?cur:"all";
  fModel=sel.value;
}
function setArrows(){
  document.querySelectorAll("thead th.sortable").forEach(th=>{
    const s=th.querySelector(".ar");
    s.textContent = th.dataset.k===sortKey ? (sortDir>0?"▲":"▼") : "";
  });
}
function render(state){
  lastState=state;
  syncModelOptions(state.agents||[]);
  const list=(state.agents||[]).filter(matches);
  // Header totals reflect the CURRENT filter, not the whole store.
  const sum=(f)=>list.reduce((s,a)=>s+(a[f]||0),0);
  const cnt=(p)=>list.filter(p).length;
  $("st-run").textContent=cnt(a=>a.status==="running");
  $("st-q").textContent=cnt(a=>a.status==="queued");
  $("st-fail").textContent=cnt(a=>a.status==="fail"||a.status==="killed");
  $("st-tin").textContent=fmtN(sum("tok_in"))||"0";
  $("st-tout").textContent=fmtN(sum("tok_out"))||"0";
  $("st-cost").textContent=fmtCost(sum("cost_usd"));
  // Sort
  list.sort((x,y)=>{const vx=sortVal(x,sortKey),vy=sortVal(y,sortKey);
    return (vx<vy?-1:vx>vy?1:0)*sortDir;});
  setArrows();
  $("empty").style.display=list.length?"none":"block";
  $("rows").innerHTML=list.map(a=>{
    const act=a.last?a.last.message:(a.phase||"");
    const lvl=a.last?a.last.level:"info";
    const open=expanded.has(a.id);
    const name=a.agent_name?`<div class="aname">${esc(a.agent_name)}</div>`:``;
    let html=`<tr class="agent" data-id="${a.id}">`+
      `<td>${statusPill(a)}</td>`+
      `<td><span class="badge k-${a.kind}">${a.kind}</span></td>`+
      `<td>${name}<div class="label">${esc(a.label)}</div>`+(a.error?`<div class="err">${esc(a.error)}</div>`:``)+`</td>`+
      `<td class="model">${esc(a.model||"")}</td>`+
      `<td class="activity l-${lvl}">${esc(act)}</td>`+
      `<td class="num">${fmtN(a.tok_in)||"·"}</td>`+
      `<td class="num">${fmtN(a.tok_out)||"·"}</td>`+
      `<td class="num">${fmtCost(a.cost_usd)}</td>`+
      `<td class="num">${fmtDT(a.started_at)}</td>`+
      `<td class="num">${a.ended_at?fmtDT(a.ended_at):(a.status==="running"?"…":"—")}</td>`+
      `<td class="num dur">${dur(a.duration)}</td></tr>`;
    if(open) html+=`<tr class="detail"><td colspan="11">${eventsHtml(a.id)}</td></tr>`;
    return html;
  }).join('');
  document.querySelectorAll("tr.agent").forEach(tr=>tr.onclick=()=>{
    const id=tr.dataset.id;
    if(expanded.has(id)){expanded.delete(id);} else {expanded.add(id); loadEvents(id);}
    render(lastState);
  });
  // Chart LAST + isolated: a chart error must never blank the table.
  try{renderChart(list);}catch(err){console.error("chart:",err);}
}
async function tick(){
  try{const r=await fetch("/api/state");render(await r.json());}catch(e){}
}
function wire(seg,setter){document.querySelectorAll("#"+seg+" button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("#"+seg+" button").forEach(x=>x.classList.remove("on"));
  b.classList.add("on"); setter(b.dataset.v); render(lastState);
});}
wire("f-kind",v=>fKind=v); wire("f-status",v=>fStatus=v); wire("f-when",v=>fWhen=v);
$("f-model").onchange=e=>{fModel=e.target.value; render(lastState);};
(function(){
  const sc=$("chartscroll"); let drag=false,sx=0,sl=0;
  sc.addEventListener("mousedown",e=>{drag=true;sx=e.clientX;sl=sc.scrollLeft;sc.classList.add("drag");$("ctip").style.display="none";e.preventDefault();});
  addEventListener("mouseup",()=>{if(drag){drag=false;sc.classList.remove("drag");}});
  sc.addEventListener("mousemove",e=>{
    if(drag){ sc.scrollLeft=sl-(e.clientX-sx);
      // "pinned" = stuck to the right edge (latest). Unpin when dragged away.
      sc.dataset.pinned=(sc.scrollWidth-sc.clientWidth-sc.scrollLeft<4)?"1":"0"; return; }
    chartHover(e);
  });
  sc.addEventListener("mouseleave",()=>{if(!drag)$("ctip").style.display="none";});
})();
addEventListener("resize",()=>render(lastState));
// Click a column header to sort; click again to flip direction.
document.querySelectorAll("thead th.sortable").forEach(th=>th.onclick=()=>{
  const k=th.dataset.k;
  if(sortKey===k){sortDir*=-1;}
  else {sortKey=k; sortDir=(k==="label"||k==="kind"||k==="model"||k==="status")?1:-1;}
  render(lastState);
});
tick(); setInterval(tick,2000);
// refresh open events periodically
setInterval(()=>{expanded.forEach(id=>loadEvents(id));},2500);
</script>
</body></html>"""


def serve(port: int = 8770, host: str = "127.0.0.1") -> int:
    from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
    import urllib.parse

    init_db()

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *a):  # quiet
            pass

        def _send(self, code, body, ctype="application/json"):
            data = body.encode() if isinstance(body, str) else body
            self.send_response(code)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(data)

        def do_GET(self):
            path = urllib.parse.urlparse(self.path).path
            try:
                if path == "/" or path == "/index.html":
                    self._send(200, DASHBOARD_HTML, "text/html; charset=utf-8")
                elif path == "/api/state":
                    self._send(200, json.dumps(get_state()))
                elif path.startswith("/api/agent/"):
                    aid = path.rsplit("/", 1)[-1]
                    self._send(200, json.dumps(get_agent(aid)))
                else:
                    self._send(404, json.dumps({"error": "not found"}))
            except Exception as e:  # noqa: BLE001
                self._send(500, json.dumps({"error": str(e)}))

    srv = ThreadingHTTPServer((host, port), Handler)
    print(f"\033[36m●\033[0m Agent Mission Control → \033[1mhttp://{host}:{port}\033[0m")
    print(f"  store: {_db_path()}")
    print("  Ctrl-C to stop.")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nbye.")
    return 0


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def _project_transcript_base() -> Path:
    """~/.claude/projects/<slug>/ where <slug> is the cwd path with / → -."""
    slug = str(ROOT).replace("/", "-")
    return Path.home() / ".claude" / "projects" / slug


def backfill(base: Path | None = None) -> int:
    """Reconstruct past Claude subagents from their on-disk transcripts. Each
    .../subagents/agent-<id>.jsonl becomes one finished 'claude' row keyed by
    <id> (same key live-capture uses → idempotent, safe to re-run)."""
    init_db()
    base = base or _project_transcript_base()
    files = sorted(base.glob("*/subagents/agent-*.jsonl"))
    if not files:
        print(f"no subagent transcripts under {base}")
        return 0
    con = _connect()
    inserted = skipped = empty = 0
    for f in files:
        aid = f.name[len("agent-"):-len(".jsonl")]
        if con.execute("SELECT 1 FROM agents WHERE id=?", (aid,)).fetchone():
            skipped += 1
            continue
        tr = _parse_subagent_transcript(str(f))
        if not tr["tok_out"] and not tr["model"]:
            empty += 1
            continue
        session = f.parent.parent.name
        con.execute(
            """INSERT INTO agents (id, kind, label, agent_name, model, status, phase, parent,
                   tok_in, tok_out, cost_usd, started_at, updated_at, ended_at, meta)
               VALUES (?, 'claude', ?, ?, ?, 'ok', 'done', ?, ?, ?, ?, ?, ?, ?, ?)""",
            (aid, tr["label"] or "subagent", tr["agent_name"], tr["model"] or "?", session,
             tr["tok_in"], tr["tok_out"], tr["cost"],
             tr["started_at"] or None, tr["ended_at"] or None, tr["ended_at"] or None,
             json.dumps({"backfilled": True, "transcript": str(f)})),
        )
        con.execute(
            "INSERT INTO events (agent_id, ts, level, phase, message, tok_in, tok_out)"
            " VALUES (?, ?, 'ok', 'done', 'backfilled from transcript', ?, ?)",
            (aid, tr["ended_at"] or 0, tr["tok_in"], tr["tok_out"]),
        )
        inserted += 1
    con.close()
    print(f"backfill: {inserted} inserted, {skipped} already present, {empty} empty/skipped "
          f"(scanned {len(files)} transcripts under {base})")
    return 0


def _cmd_seed() -> int:
    init_db()
    import random  # only for the demo seeder
    a1 = start_agent("cascade", "L02 generate exercises", model="cerebras/gpt-oss-120b",
                     parent="batch-demo")
    event(a1, "building strict candidates", phase="candidates")
    event(a1, "cerebras picking 45 exercises", phase="re-source")
    record_usage(a1, tok_in=1240, tok_out=5380, model="cerebras/gpt-oss-120b")
    event(a1, "rendered + validated 45 exercises", level="ok", phase="render")
    finish_agent(a1, "ok")
    a2 = start_agent("cascade", "L05 generate exercises", model="ollama/qwen2.5:7b",
                     parent="batch-demo")
    event(a2, "ollama streaming… 3200 tok", phase="re-source", tok_out=3200)
    a3 = start_agent("claude", "translate L41 de-DE", model="haiku")
    event(a3, "subagent 'haiku' rising up", phase="running")
    record_usage(a3, tok_in=8200, tok_out=6100, model="haiku")
    a4 = start_agent("claude", "revise L01 hard math", model="opus")
    record_usage(a4, tok_in=21000, tok_out=14500, model="opus")
    event(a4, "reviewing door 7 derivation", phase="review", level="warn")
    queue_agent("cascade", "L07 generate exercises", model="chain", parent="batch-demo")
    print("seeded demo agents. run:  python3 scripts/agent_monitor.py serve")
    return 0


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd")
    sp = sub.add_parser("serve", help="run the live web dashboard")
    sp.add_argument("--port", type=int, default=int(os.environ.get("AGENT_MONITOR_PORT", "8770")))
    sp.add_argument("--host", default="127.0.0.1")
    hp = sub.add_parser("hook", help="Claude Code hook handler (reads stdin JSON)")
    hp.add_argument("event", choices=["pre", "stop"])
    sub.add_parser("init", help="create the DB")
    sub.add_parser("clear", help="wipe all rows (keep schema)")
    sub.add_parser("seed", help="insert demo agents")
    bf = sub.add_parser("backfill", help="reconstruct past Claude subagents from on-disk transcripts")
    bf.add_argument("--base", help="override the transcript base dir")
    sub.add_parser("state", help="print current state JSON")
    args = p.parse_args(argv)

    if args.cmd == "serve":
        return serve(port=args.port, host=args.host)
    if args.cmd == "hook":
        return hook_pre() if args.event == "pre" else hook_stop()
    if args.cmd == "init":
        init_db(); print(f"initialized {_db_path()}"); return 0
    if args.cmd == "clear":
        init_db(); con = _connect()
        con.execute("DELETE FROM events"); con.execute("DELETE FROM agents"); con.close()
        print("cleared."); return 0
    if args.cmd == "seed":
        return _cmd_seed()
    if args.cmd == "backfill":
        return backfill(Path(args.base) if getattr(args, "base", None) else None)
    if args.cmd == "state":
        print(json.dumps(get_state(), indent=2)); return 0
    p.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
