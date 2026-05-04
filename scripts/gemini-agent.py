#!/usr/bin/env python3
"""
gemini-agent.py — orquestrador generico de agentes via Gemini 2.5 Flash (free tier).

Carrega prompts de agentes (Claude Code .md format) e executa tarefas no Gemini.
Funciona com:
  - Conselheiros do projeto (.claude/agents/conselheiro-*.md)
  - 60 agentes do agentspec (~/agentspec/plugin/agents/**/*.md)
  - Plugins oficiais (~/.claude/plugins/.../agents/*.md)
  - Qualquer .md com frontmatter { name, description } + corpo

USO:

  # Listar todos os agentes disponiveis
  python3 scripts/gemini-agent.py --list

  # Rodar um agente especifico
  export GEMINI_API_KEY="..."
  python3 scripts/gemini-agent.py \\
    --agent code-reviewer \\
    --task "Revise scripts/gemini-draft.py procurando por bugs e melhorias" \\
    --context scripts/gemini-draft.py

  # Conselheiro com contexto
  python3 scripts/gemini-agent.py \\
    --agent conselheiro-eng-software \\
    --task "Avalie a arquitetura desse script" \\
    --context scripts/gemini-agent.py

  # Salvar saida
  python3 scripts/gemini-agent.py --agent code-reviewer --task "..." --out review.md

Stdlib only. Free tier: 15 req/min, 1500 req/dia, 1M ctx.
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
DEFAULT_MODEL = "gemini-2.5-flash"

REPO_ROOT = Path(__file__).resolve().parent.parent
HOME = Path.home()

SEARCH_PATHS = [
    REPO_ROOT / "agents",
    REPO_ROOT / ".claude" / "agents",
    HOME / ".claude" / "agents",
    HOME / "agentspec" / "plugin" / "agents",
    HOME / ".claude" / "plugins" / "cache" / "agentspec" / "agentspec" / "3.1.0" / "agents",
    HOME / ".claude" / "plugins" / "marketplaces" / "claude-plugins-official" / "plugins",
    HOME / ".claude" / "plugins" / "cache" / "claude-plugins-official",
]

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n(.*)$", re.DOTALL)


def parse_agent(path: Path) -> dict:
    """Parse a .md agent file with YAML frontmatter."""
    raw = path.read_text(encoding="utf-8", errors="replace")
    m = FRONTMATTER_RE.match(raw)
    if not m:
        return {"name": path.stem, "description": "", "body": raw, "path": path}
    fm_block, body = m.group(1), m.group(2)
    fm = {}
    for line in fm_block.splitlines():
        if ":" not in line:
            continue
        k, _, v = line.partition(":")
        fm[k.strip()] = v.strip().strip('"').strip("'")
    return {
        "name": fm.get("name", path.stem),
        "description": fm.get("description", ""),
        "body": body.strip(),
        "path": path,
    }


def discover_agents() -> dict:
    """Walk all search paths, return {name: agent_dict}. Later paths can override earlier."""
    agents = {}
    for root in SEARCH_PATHS:
        if not root.exists():
            continue
        for p in root.rglob("*.md"):
            if p.name.startswith("_") or p.name in ("README.md", "AGENTS.md", "CLAUDE.md", "CHANGELOG.md"):
                continue
            # Aceita apenas se algum ancestral imediato se chamar 'agents'
            if "agents" not in {parent.name for parent in p.parents}:
                continue
            try:
                agent = parse_agent(p)
            except Exception:
                continue
            name = agent["name"]
            if name and name not in agents:
                agents[name] = agent
            stem = p.stem
            if stem and stem != name and stem not in agents:
                agents[stem] = agent
    return agents


def list_agents(agents: dict) -> None:
    by_origin = {}
    for name, a in agents.items():
        origin = "repo" if str(REPO_ROOT) in str(a["path"]) else (
            "agentspec" if "agentspec" in str(a["path"]) else
            "plugins" if "plugins" in str(a["path"]) else
            "user"
        )
        by_origin.setdefault(origin, []).append((name, a["description"][:80]))
    for origin in ("repo", "user", "agentspec", "plugins"):
        items = sorted(set(by_origin.get(origin, [])))
        if not items:
            continue
        print(f"\n=== {origin.upper()} ({len(items)}) ===")
        for name, desc in items:
            print(f"  {name:40s}  {desc}")


def build_request(agent: dict, task: str, contexts: list, model: str, max_tokens: int) -> dict:
    parts = [{
        "text": (
            f"Voce e o agente '{agent['name']}'. Siga rigorosamente seu papel abaixo.\n\n"
            f"=== DEFINICAO DO AGENTE ===\n\n{agent['body']}\n"
        )
    }]
    for ctx_path in contexts:
        p = Path(ctx_path)
        if not p.exists():
            print(f"[aviso] contexto nao encontrado: {ctx_path}", file=sys.stderr)
            continue
        try:
            content = p.read_text(encoding="utf-8", errors="replace")
        except Exception as e:
            print(f"[aviso] nao consegui ler {ctx_path}: {e}", file=sys.stderr)
            continue
        parts.append({"text": f"\n\n=== CONTEXTO: {ctx_path} ===\n\n{content}"})
    parts.append({"text": f"\n\n=== TAREFA ===\n\n{task}\n\nResponda agora."})
    return {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {
            "temperature": 0.5,
            "topP": 0.95,
            "maxOutputTokens": max_tokens,
        },
    }


def call_gemini(payload: dict, api_key: str, model: str, retries: int = 3) -> str:
    url = API_URL.format(model=model, key=api_key)
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
    last_err = None
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=180) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            candidates = data.get("candidates", [])
            if not candidates:
                raise RuntimeError(f"Resposta sem candidates: {json.dumps(data)[:500]}")
            text_parts = candidates[0].get("content", {}).get("parts", [])
            return "".join(p.get("text", "") for p in text_parts)
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")[:500]
            last_err = f"HTTP {e.code}: {err_body}"
            if e.code == 429 and attempt < retries:
                wait = 2 ** attempt * 5
                print(f"[rate-limit] tentativa {attempt}, esperando {wait}s...", file=sys.stderr)
                time.sleep(wait)
                continue
            raise RuntimeError(last_err) from e
        except urllib.error.URLError as e:
            last_err = f"Network: {e.reason}"
            if attempt < retries:
                time.sleep(2 ** attempt)
                continue
            raise RuntimeError(last_err) from e
    raise RuntimeError(last_err or "Falhou")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--list", action="store_true", help="Listar agentes disponiveis e sair")
    parser.add_argument("--agent", help="Nome do agente (ex: code-reviewer, conselheiro-eng-software)")
    parser.add_argument("--task", help="Descricao da tarefa")
    parser.add_argument("--context", action="append", default=[], help="Arquivo de contexto (pode repetir)")
    parser.add_argument("--out", help="Arquivo de saida (default: stdout)")
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"Modelo (default: {DEFAULT_MODEL})")
    parser.add_argument("--max-tokens", type=int, default=16000)
    args = parser.parse_args()

    agents = discover_agents()

    if args.list:
        print(f"Total: {len(agents)} agentes encontrados")
        list_agents(agents)
        return

    if not args.agent or not args.task:
        parser.error("--agent e --task sao obrigatorios (ou use --list)")

    if args.agent not in agents:
        print(f"ERRO: agente '{args.agent}' nao encontrado.", file=sys.stderr)
        candidates = [n for n in agents if args.agent.lower() in n.lower()]
        if candidates:
            print(f"Voce quis dizer: {', '.join(candidates[:5])}", file=sys.stderr)
        else:
            print("Use --list pra ver todos os agentes disponiveis.", file=sys.stderr)
        sys.exit(2)

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERRO: defina GEMINI_API_KEY (https://aistudio.google.com/apikey)", file=sys.stderr)
        sys.exit(2)

    agent = agents[args.agent]
    print(f"[gemini-agent] agente={args.agent}  ({agent['path'].name})", file=sys.stderr)
    print(f"[gemini-agent] modelo={args.model}  contextos={len(args.context)}", file=sys.stderr)

    payload = build_request(agent, args.task, args.context, args.model, args.max_tokens)
    approx_in = sum(len(p["text"]) for p in payload["contents"][0]["parts"]) // 4
    print(f"[gemini-agent] ~{approx_in} tokens de entrada", file=sys.stderr)

    t0 = time.time()
    out = call_gemini(payload, api_key, args.model)
    dt = time.time() - t0
    print(f"[gemini-agent] geracao em {dt:.1f}s  ~{len(out)//4} tokens de saida", file=sys.stderr)

    if args.out:
        Path(args.out).parent.mkdir(parents=True, exist_ok=True)
        Path(args.out).write_text(out, encoding="utf-8")
        print(f"[gemini-agent] gravado em {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(out)


if __name__ == "__main__":
    main()
