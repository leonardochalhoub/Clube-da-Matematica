#!/usr/bin/env python3
"""
claude-draft.py — gera rascunho de aula MDX via Claude Haiku 4.5 (Anthropic API).

Mesma interface que gemini-draft.py, mas com qualidade muito superior em codigo
estruturado. Custo aproximado: $0.05-0.15 por aula completa.

Uso:
  export ANTHROPIC_API_KEY="sk-ant-..."
  python3 scripts/claude-draft.py \\
    --brief "Lição N — tema. ..." \\
    --reference content/aulas/.../aula-MM.mdx \\
    --book livros/openstax-college-algebra-1.1.md \\
    --out content/aulas/.../aula-NN.mdx

Stdlib only (urllib). Sem dependencias.
Free tier nao existe: usa creditos da conta. ~$0.10/aula.
"""

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

API_URL = "https://api.anthropic.com/v1/messages"
DEFAULT_MODEL = "claude-haiku-4-5"   # ~$0.10 per aula completa
ANTHROPIC_VERSION = "2023-06-01"

CONTEXT_FILE = Path(__file__).resolve().parent.parent / "agents" / "CLUBE_CONTEXT.md"


def load_system_prompt() -> str:
    if not CONTEXT_FILE.exists():
        sys.exit(f"ERRO: contexto base nao encontrado em {CONTEXT_FILE}")
    return CONTEXT_FILE.read_text(encoding="utf-8")


def read_file(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


def build_payload(brief: str, references: list, books: list, model: str, max_tokens: int) -> dict:
    user_blocks = []
    for ref_path in references:
        user_blocks.append(
            f"=== REFERENCIA (aula MDX existente — replicar estrutura, "
            f"PRESERVAR exercicios e fontes ja curados): {ref_path} ===\n\n"
            f"{read_file(ref_path)}\n"
        )
    for book_path in books:
        user_blocks.append(
            f"=== LIVRO-FONTE (capitulo aberto pra grounding de citacoes; "
            f"cite trechos verbatim com link deep — NAO invente paginas): {book_path} ===\n\n"
            f"{read_file(book_path)}\n"
        )
    user_blocks.append(
        f"=== BRIEF DA NOVA AULA ===\n\n{brief}\n\n"
        "Gere a aula completa agora, em MDX puro, comecando pelo frontmatter ---. "
        "NAO envolva em markdown code fence (```). Saida deve ser direto MDX, "
        "comecando com a primeira linha de frontmatter."
    )
    return {
        "model": model,
        "max_tokens": max_tokens,
        "system": load_system_prompt(),
        "messages": [
            {"role": "user", "content": "\n\n".join(user_blocks)},
        ],
    }


def call_anthropic(payload: dict, api_key: str, retries: int = 3) -> str:
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=body,
        headers={
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": ANTHROPIC_VERSION,
        },
        method="POST",
    )
    last_err = None
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=300) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            blocks = data.get("content", [])
            if not blocks:
                raise RuntimeError(f"Resposta sem content: {json.dumps(data)[:500]}")
            usage = data.get("usage", {})
            print(
                f"[claude-draft] usage: in={usage.get('input_tokens', '?')}  "
                f"out={usage.get('output_tokens', '?')}  "
                f"stop_reason={data.get('stop_reason', '?')}",
                file=sys.stderr,
            )
            return "".join(b.get("text", "") for b in blocks if b.get("type") == "text")
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")[:500]
            last_err = f"HTTP {e.code}: {err_body}"
            if (e.code == 429 or e.code >= 500) and attempt < retries:
                wait = 2 ** attempt * 5
                print(f"[retry {attempt}] {e.code}, esperando {wait}s...", file=sys.stderr)
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
    parser.add_argument("--brief", required=True)
    parser.add_argument("--reference", action="append", default=[])
    parser.add_argument("--book", action="append", default=[])
    parser.add_argument("--out")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--max-tokens", type=int, default=32000)
    parser.add_argument("--no-validate", action="store_true")
    parser.add_argument("--no-postfix", action="store_true")
    args = parser.parse_args()

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERRO: defina ANTHROPIC_API_KEY (https://console.anthropic.com/settings/keys)", file=sys.stderr)
        sys.exit(2)

    payload = build_payload(args.brief, args.reference, args.book, args.model, args.max_tokens)
    approx_in = sum(len(c["content"]) for c in payload["messages"]) // 4
    print(f"[claude-draft] modelo={args.model}  ~{approx_in} tokens entrada  "
          f"refs={len(args.reference)}  books={len(args.book)}", file=sys.stderr)

    t0 = time.time()
    out = call_anthropic(payload, api_key)
    dt = time.time() - t0
    print(f"[claude-draft] geracao em {dt:.1f}s", file=sys.stderr)

    if args.out:
        Path(args.out).parent.mkdir(parents=True, exist_ok=True)
        Path(args.out).write_text(out, encoding="utf-8")
        print(f"[claude-draft] gravado em {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(out)
        return

    # Pos-fix opcional
    if not args.no_postfix:
        postfix = Path(__file__).resolve().parent / "post-fix-mdx.py"
        if postfix.exists():
            import subprocess
            print(f"[claude-draft] aplicando post-fix...", file=sys.stderr)
            subprocess.run([sys.executable, str(postfix), args.out], check=False)

    # Validacao
    if not args.no_validate:
        validator = Path(__file__).resolve().parent / "validate-mdx.mjs"
        if validator.exists():
            import subprocess
            r = subprocess.run(["node", str(validator), args.out], capture_output=True, text=True)
            if r.returncode == 0:
                print(f"[claude-draft] {r.stdout.strip()}", file=sys.stderr)
            else:
                print(f"[claude-draft] FALHA NA VALIDACAO MDX:", file=sys.stderr)
                print(r.stderr.strip(), file=sys.stderr)
                sys.exit(3)


if __name__ == "__main__":
    main()
