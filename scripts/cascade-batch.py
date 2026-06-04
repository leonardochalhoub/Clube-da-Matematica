#!/usr/bin/env python3
"""cascade-batch.py — run cascade-resource.py for many lessons in parallel.

Spawns N worker threads, each running one cascade-resource.py call. Workers
are I/O bound (LLM API + Ollama HTTP), so threading is enough. The provider
chain handles per-lesson fallback (Cerebras → OpenRouter → Ollama), so if
Cerebras rate-limits one worker, that worker drops to OpenRouter
automatically — no global rate budget needed here.

Usage:
    source .env.local && set -a && set +a  # export keys
    python3 scripts/cascade-batch.py 3 4 5 6 7 8 9 10 --workers 20
    python3 scripts/cascade-batch.py --whitelisted --workers 20    # all 73 whitelisted lessons
    python3 scripts/cascade-batch.py --range 3 20 --workers 12     # L03-L20

Live progress is printed as each lesson finishes.
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
import time
import uuid
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Live monitor (best-effort; agent_monitor sits next to this script).
try:
    import agent_monitor as mon  # type: ignore
except Exception:  # noqa: BLE001
    class _NoMon:
        def __getattr__(self, _):
            return lambda *a, **k: None
    mon = _NoMon()  # type: ignore

# Lessons that build-strict-candidates.py has a section whitelist for.
WHITELISTED = (
    list(range(1, 21))               # 1..20  — functions, trig (15 still broken, others OK)
    + list(range(21, 41))            # 21..40 — analytic geom, conics, vectors, matrices, prob
    + list(range(41, 71))            # 41..70 — limits, derivatives
    + list(range(71, 81))            # 71..80 — descriptive stats (parsed 2026-05-29)
    + list(range(81, 101))           # 81..100 — integration, ODEs
    + list(range(101, 111))          # 101..110 — inferential stats (parsed 2026-05-29)
    + list(range(111, 114))          # 111..113 — vectors / planes
    + list(range(114, 121))          # 114..120 — linear algebra (parsed 2026-05-29)
)
# L15 still has no parsed source (no trig book yet).
SKIP_NO_SOURCE = {15}


def cascade_one(lesson_num: int, provider: str, batch_size: int, candidate_cap: int,
                agent_id: str | None = None, batch_id: str | None = None) -> dict:
    t0 = time.time()
    cmd = [
        sys.executable, "-u", str(ROOT / "scripts" / "cascade-resource.py"),
        str(lesson_num),
        "--provider", provider,
        "--batch-size", str(batch_size),
        "--candidate-cap", str(candidate_cap),
        "--no-translate", "--no-manifest",
    ]
    # Hand the worker the monitor id we pre-queued so its dashboard row
    # promotes queued→running in place (and the batch groups them together).
    env = os.environ.copy()
    if agent_id:
        env["AGENT_MONITOR_ID"] = agent_id
    if batch_id:
        env["AGENT_MONITOR_BATCH"] = batch_id
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=ROOT, env=env)
    elapsed = time.time() - t0
    # extract exercise count + provider used from stdout
    n_ex = "?"
    used = "?"
    for line in r.stdout.splitlines():
        if " returned " in line and " exercises" in line:
            # "cerebras returned 45 exercises"
            parts = line.split()
            for i, w in enumerate(parts):
                if w == "returned" and i + 1 < len(parts):
                    n_ex = parts[i + 1]
                if w in ("cerebras", "openrouter", "ollama", "gemini"):
                    used = w
            break
    # Reconcile the monitor: a worker that crashed before its own fail() hook
    # (or ran with monitoring disabled) won't have closed its row — do it here.
    if agent_id and r.returncode != 0:
        mon.finish_agent(agent_id, "fail", error=(r.stderr or "")[-200:].strip())
    return {
        "lesson": lesson_num,
        "rc": r.returncode,
        "elapsed_s": round(elapsed, 1),
        "exercises": n_ex,
        "provider": used,
        "stderr_tail": (r.stderr or "")[-300:].strip(),
        "stdout_tail": (r.stdout or "")[-300:].strip(),
    }


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("lessons", nargs="*", type=int, help="lesson numbers to cascade")
    p.add_argument("--whitelisted", action="store_true",
                   help="use the full whitelist (73 lessons, minus already-done)")
    p.add_argument("--range", type=int, nargs=2, metavar=("LO", "HI"),
                   help="cascade lessons LO..HI inclusive (filtered to whitelist)")
    p.add_argument("--workers", type=int, default=20)
    p.add_argument("--provider", default="chain")
    p.add_argument("--batch-size", type=int, default=45)
    p.add_argument("--candidate-cap", type=int, default=80)
    p.add_argument("--skip-done", action="store_true", default=False,
                   help="(deprecated; SKIP_NO_SOURCE always applies)")
    args = p.parse_args()

    if args.whitelisted:
        lessons = sorted(set(WHITELISTED))
    elif args.range:
        lo, hi = args.range
        lessons = sorted(n for n in WHITELISTED if lo <= n <= hi)
    else:
        lessons = sorted(set(args.lessons))

    # Always skip lessons with no parsed source
    lessons = [n for n in lessons if n not in SKIP_NO_SOURCE]

    if not lessons:
        print("no lessons to cascade", file=sys.stderr)
        return 1

    print(f"cascade-batch: {len(lessons)} lesson(s), {args.workers} workers, provider={args.provider}, batch={args.batch_size}")
    print(f"lessons: {lessons}")
    print(f"monitor: python3 scripts/agent_monitor.py serve  →  http://localhost:8770")
    print()

    # Pre-queue every lesson in the live monitor so they all appear immediately
    # (status=queued), then each worker promotes its own row to running.
    batch_id = "batch-" + uuid.uuid4().hex[:8]
    agent_ids = {
        n: mon.queue_agent("cascade", f"L{n} re-source", model=args.provider, parent=batch_id)
        for n in lessons
    }

    results: list[dict] = []
    t_start = time.time()
    done = 0
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {
            pool.submit(cascade_one, n, args.provider, args.batch_size,
                        args.candidate_cap, agent_ids.get(n), batch_id): n
            for n in lessons
        }
        for fut in as_completed(futures):
            r = fut.result()
            results.append(r)
            done += 1
            status = "OK" if r["rc"] == 0 else "FAIL"
            elapsed_total = time.time() - t_start
            print(
                f"[{done:3d}/{len(lessons)}] L{r['lesson']:>3}: "
                f"{status:4s}  {r['elapsed_s']:5.1f}s  "
                f"provider={r['provider']:9s}  exercises={r['exercises']:>3}  "
                f"(batch elapsed {elapsed_total:.0f}s)",
                flush=True,
            )
            if r["rc"] != 0:
                print(f"        stderr: {r['stderr_tail'][:200]}", file=sys.stderr, flush=True)

    elapsed_total = time.time() - t_start
    ok = sum(1 for r in results if r["rc"] == 0)
    fail = len(results) - ok
    print()
    print(f"=== summary: {ok} OK / {fail} FAIL in {elapsed_total:.0f}s "
          f"(avg {elapsed_total/len(results):.1f}s/lesson, "
          f"theoretical serial {sum(r['elapsed_s'] for r in results):.0f}s) ===")

    providers_used: dict[str, int] = {}
    for r in results:
        if r["rc"] == 0:
            providers_used[r["provider"]] = providers_used.get(r["provider"], 0) + 1
    if providers_used:
        print("by provider:", dict(sorted(providers_used.items(), key=lambda x: -x[1])))

    if fail:
        print(f"\nfailed lessons: {[r['lesson'] for r in results if r['rc'] != 0]}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
