#!/usr/bin/env python3
"""
groq-agent.py — generic Groq agent runner. Mirrors gemini-agent.py but uses
the Groq Cloud API (OpenAI-compatible).

Models on Groq free tier (2026):
  llama-3.3-70b-versatile   — best general quality, 30 req/min
  llama-3.1-8b-instant       — faster, smaller, 30 req/min
  openai/gpt-oss-120b        — alternative
  mixtral-8x7b-32768         — sometimes available

USAGE:

  export GROQ_API_KEY="gsk_..."   # https://console.groq.com/keys
  python3 scripts/groq-agent.py \
    --task "Translate this MDX from PT-BR to en-US." \
    --context content/aulas/ano-1/trim-1/aula-01-conjuntos-intervalos.mdx \
    --system docs/agents/translator-context.md \
    --out /tmp/aula-01-en.mdx

Free tier: 30 req/min, ~14,400 req/day for Llama 3.3, 8K output ctx.
Stdlib only (urllib).
"""

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

API_URL = "https://api.groq.com/openai/v1/chat/completions"
DEFAULT_MODEL = "llama-3.3-70b-versatile"
RATE_LIMIT_MIN = 30  # req/min on free tier


def read_file(path: str | Path) -> str:
    return Path(path).read_text(encoding="utf-8")


def call_groq(system_prompt: str, user_prompt: str, model: str = DEFAULT_MODEL,
              max_tokens: int = 8000, temperature: float = 0.2,
              api_key: str | None = None, retries: int = 3) -> str:
    """Single Groq chat completion. Returns the assistant content string."""
    key = api_key or os.environ.get("GROQ_API_KEY")
    if not key:
        raise RuntimeError("GROQ_API_KEY not set; get one at https://console.groq.com/keys")

    body = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=data,
        # Cloudflare 1010 fix: send a non-Python UA.
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "clube-da-matematica/0.1 (https://github.com/leonardochalhoub/Clube-da-Matematica)",
        },
    )
    last_err: Exception | None = None
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                payload = json.loads(resp.read().decode("utf-8"))
            return payload["choices"][0]["message"]["content"]
        except urllib.error.HTTPError as e:
            body_txt = e.read().decode("utf-8", errors="replace")
            last_err = RuntimeError(f"Groq HTTP {e.code}: {body_txt}")
            if e.code == 429:  # rate limit
                wait = 60 / RATE_LIMIT_MIN * (attempt + 1)
                time.sleep(wait)
                continue
            if e.code >= 500:
                time.sleep(2 * (attempt + 1))
                continue
            raise last_err
        except urllib.error.URLError as e:
            last_err = e
            time.sleep(2 * (attempt + 1))
    raise last_err  # type: ignore[misc]


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--task", required=True, help="user prompt / task description")
    p.add_argument("--context", help="path to a context file (read into the prompt)")
    p.add_argument("--system", help="path to system prompt file")
    p.add_argument("--system-text", help="inline system prompt")
    p.add_argument("--model", default=DEFAULT_MODEL)
    p.add_argument("--max-tokens", type=int, default=8000)
    p.add_argument("--temperature", type=float, default=0.2)
    p.add_argument("--out", help="write output to file instead of stdout")
    args = p.parse_args()

    sys_prompt = ""
    if args.system:
        sys_prompt = read_file(args.system)
    elif args.system_text:
        sys_prompt = args.system_text
    else:
        sys_prompt = "You are a concise, accurate assistant."

    user_prompt = args.task
    if args.context:
        ctx = read_file(args.context)
        user_prompt += "\n\n--- CONTEXT FILE ---\n" + ctx

    out = call_groq(sys_prompt, user_prompt,
                    model=args.model, max_tokens=args.max_tokens,
                    temperature=args.temperature)

    if args.out:
        Path(args.out).write_text(out, encoding="utf-8")
        print(f"✓ wrote {args.out} ({len(out)} chars)", file=sys.stderr)
    else:
        sys.stdout.write(out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
