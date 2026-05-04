#!/usr/bin/env python3
"""
gemini-draft.py — gera rascunho de aula MDX via Gemini 2.5 Flash (free tier).

Uso basico:
  export GEMINI_API_KEY="..."   # pegue em https://aistudio.google.com/apikey
  python3 scripts/gemini-draft.py \\
    --brief "Aula 51 - derivada por definicao. Trim 6, ano 2." \\
    --reference content/aulas/ano-2/trim-5/aula-41-limite-formal.mdx \\
    --reference content/financas-quantitativas/opcoes/black-scholes.mdx \\
    --out content/aulas/ano-2/trim-6/aula-51-derivada-definicao.mdx

Stdlib only (urllib). Sem dependencias. Free tier: 15 req/min, 1500 req/dia, 1M ctx.
"""

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

API_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "{model}:generateContent?key={key}"
)
DEFAULT_MODEL = "gemini-2.5-flash"

CONTEXT_FILE = Path(__file__).resolve().parent.parent / "agents" / "CLUBE_CONTEXT.md"

def load_system_prompt() -> str:
    """Read the canonical project context. Single source of truth for all agents."""
    if not CONTEXT_FILE.exists():
        sys.exit(f"ERRO: contexto base nao encontrado em {CONTEXT_FILE}")
    return CONTEXT_FILE.read_text(encoding="utf-8")


def read_file(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


def build_request(brief: str, references: list, books: list, model: str, max_tokens: int) -> dict:
    parts = [{"text": load_system_prompt()}]
    for ref_path in references:
        parts.append({
            "text": f"\n\n=== REFERENCIA (aula MDX existente — replicar estrutura, PRESERVAR exercicios e fontes ja curados): {ref_path} ===\n\n{read_file(ref_path)}"
        })
    for book_path in books:
        parts.append({
            "text": f"\n\n=== LIVRO-FONTE (capitulo aberto pra grounding de citacoes; cite trechos verbatim com link deep — NAO invente paginas): {book_path} ===\n\n{read_file(book_path)}"
        })
    parts.append({"text": f"\n\n=== BRIEF DA NOVA AULA ===\n\n{brief}\n\nGere a aula completa agora, em MDX puro, comecando pelo frontmatter ---."})

    return {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {
            "temperature": 0.7,
            "topP": 0.95,
            "maxOutputTokens": max_tokens,
        },
    }


def call_gemini(payload: dict, api_key: str, model: str, retries: int = 3) -> str:
    url = API_URL.format(model=model, key=api_key)
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    last_err = None
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=300) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            candidates = data.get("candidates", [])
            if not candidates:
                raise RuntimeError(f"Resposta sem candidates: {json.dumps(data)[:500]}")
            text_parts = candidates[0].get("content", {}).get("parts", [])
            return "".join(p.get("text", "") for p in text_parts)
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")[:500]
            last_err = f"HTTP {e.code}: {err_body}"
            if (e.code == 429 or e.code >= 500) and attempt < retries:
                wait = 2 ** attempt * 5
                tag = "rate-limit" if e.code == 429 else f"server-{e.code}"
                print(f"[{tag}] tentativa {attempt} falhou, esperando {wait}s...", file=sys.stderr)
                time.sleep(wait)
                continue
            raise RuntimeError(last_err) from e
        except urllib.error.URLError as e:
            last_err = f"Network: {e.reason}"
            if attempt < retries:
                time.sleep(2 ** attempt)
                continue
            raise RuntimeError(last_err) from e
    raise RuntimeError(last_err or "Falhou sem erro especifico")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--brief", required=True, help="Descricao curta da aula a gerar")
    parser.add_argument("--reference", action="append", default=[], help="Arquivo MDX de referencia (pode repetir)")
    parser.add_argument("--book", action="append", default=[], help="Capitulo de livro extraido em livros/ (pode repetir; framing = grounding)")
    parser.add_argument("--out", help="Arquivo de saida (default: stdout)")
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"Modelo (default: {DEFAULT_MODEL})")
    parser.add_argument("--max-tokens", type=int, default=16000, help="Max tokens de saida (default: 16000)")
    parser.add_argument("--no-validate", action="store_true", help="Pula validacao MDX pos-geracao")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERRO: defina GEMINI_API_KEY (pegue em https://aistudio.google.com/apikey)", file=sys.stderr)
        sys.exit(2)

    if not args.reference:
        print("AVISO: sem --reference, qualidade vai cair muito. Recomendado passar pelo menos 1.", file=sys.stderr)

    payload = build_request(args.brief, args.reference, args.book, args.model, args.max_tokens)
    approx_in_tokens = sum(len(p["text"]) for p in payload["contents"][0]["parts"]) // 4
    print(f"[gemini-draft] modelo={args.model}  ~{approx_in_tokens} tokens de entrada  refs={len(args.reference)}  books={len(args.book)}", file=sys.stderr)

    t0 = time.time()
    out = call_gemini(payload, api_key, args.model)
    dt = time.time() - t0
    print(f"[gemini-draft] geracao em {dt:.1f}s  ~{len(out)//4} tokens de saida", file=sys.stderr)

    # Saida: arquivo ou stdout
    if args.out:
        Path(args.out).parent.mkdir(parents=True, exist_ok=True)
        Path(args.out).write_text(out, encoding="utf-8")
        print(f"[gemini-draft] gravado em {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(out)

    # Validacao pos-geracao via @mdx-js/mdx (so faz sentido com --out)
    if args.out and not args.no_validate:
        validator = Path(__file__).resolve().parent / "validate-mdx.mjs"
        if validator.exists():
            import subprocess
            print(f"[gemini-draft] validando MDX...", file=sys.stderr)
            r = subprocess.run(["node", str(validator), args.out], capture_output=True, text=True)
            if r.returncode == 0:
                print(f"[gemini-draft] {r.stdout.strip()}", file=sys.stderr)
            else:
                print(f"[gemini-draft] FALHA NA VALIDACAO MDX:", file=sys.stderr)
                print(r.stderr.strip(), file=sys.stderr)
                print(f"[gemini-draft] draft salvo mesmo assim em {args.out} pra inspecao", file=sys.stderr)
                sys.exit(3)


if __name__ == "__main__":
    main()
