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

SYSTEM_PROMPT = """Voce e o redator-chefe do Clube da Matematica, escrevendo aulas MDX para o
Ensino Medio brasileiro com rigor editorial inspirado em engenharia mecanica BR+JP+DE+SG.

REGRAS INVIOLAVEIS:
1. Padrao editorial: siga FIELMENTE a estrutura dos arquivos de referencia anexados.
   O Black-Scholes e o template-mae. Toda aula nova replica a sua DNA.

2. Componentes MDX disponiveis (use exatamente esta sintaxe JSX):
   - <EquacaoCanonica formula="..." legenda={<>...</>} audioTexto="..." />
   - <DuasPortas> ... </DuasPortas>
   - <Porta nivel="formal|5|10|15|25|40|pratica" titulo="..."> markdown </Porta>
     Sempre 6-7 portas: formal, 5, 10, 15, 25, 40, pratica.
   - <Definicao titulo="..."> ... </Definicao>
   - <ListaExercicios seed="aula-NN"> ... </ListaExercicios>
   - <Exercicio numero="NN.X" dificuldade="aplicacao|demonstracao|compreensao|modelagem|desafio">
     Enunciado. (Resp: ...)
     </Exercicio>

3. Exercicios: MINIMO 35, ideal 40-50. Divida em blocos:
   - Bloco A - Aplicacao (15-20 ex, calculo direto)
   - Bloco B - Demonstracao (5-8 ex, prova rigorosa)
   - Bloco C - Compreensao + Modelagem (8-12 ex, conceitual e aplicado)
   - Bloco D - Desafios (4-6 ex, vestibular/olimpiada)
   25% dos exercicios devem ter gabarito inline "(Resp: ...)".

4. Matematica: KaTeX inline ($...$). Use \\eps para epsilon, \\delta, \\infty, \\to, \\lim,
   \\frac, \\sum, \\int, etc. Numeros decimais em PT-BR usam virgula com chave dupla:
   $0{,}001$ (nao $0.001$).

5. Fontes ao final em "## Fontes" com links markdown reais ([titulo](url)) para fontes
   abertas (OpenStax, Active Calculus, MIT OCW, arXiv, Khan Academy, papers DOI).
   Se mencionar Premio Nobel, SEMPRE linke para nobelprize.org.

6. Frontmatter YAML obrigatorio: titulo, slug, categoria, subcategoria, descricao,
   ordem, publicado, tags, prerrequisitos, autores, atualizadoEm.

7. Tom: rigor de bacharelado em engenharia, mas porta nivel="5" deve ser realmente
   acessivel para crianca. Sem condescendencia, sem facilitar artificialmente.

8. NAO inclua disclaimers, "como assistente IA", marcadores de meta-discurso. Saida
   limpa, pronta pra commitar. Comece direto pelo frontmatter ---.
"""


def read_file(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


def build_request(brief: str, references: list, model: str, max_tokens: int) -> dict:
    parts = [{"text": SYSTEM_PROMPT}]
    for ref_path in references:
        parts.append({
            "text": f"\n\n=== REFERENCIA: {ref_path} ===\n\n{read_file(ref_path)}"
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
            with urllib.request.urlopen(req, timeout=120) as resp:
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
                print(f"[rate-limit] tentativa {attempt} falhou, esperando {wait}s...", file=sys.stderr)
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
    parser.add_argument("--out", help="Arquivo de saida (default: stdout)")
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"Modelo (default: {DEFAULT_MODEL})")
    parser.add_argument("--max-tokens", type=int, default=16000, help="Max tokens de saida (default: 16000)")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERRO: defina GEMINI_API_KEY (pegue em https://aistudio.google.com/apikey)", file=sys.stderr)
        sys.exit(2)

    if not args.reference:
        print("AVISO: sem --reference, qualidade vai cair muito. Recomendado passar pelo menos 1.", file=sys.stderr)

    payload = build_request(args.brief, args.reference, args.model, args.max_tokens)
    approx_in_tokens = sum(len(p["text"]) for p in payload["contents"][0]["parts"]) // 4
    print(f"[gemini-draft] modelo={args.model}  ~{approx_in_tokens} tokens de entrada  refs={len(args.reference)}", file=sys.stderr)

    t0 = time.time()
    out = call_gemini(payload, api_key, args.model)
    dt = time.time() - t0
    print(f"[gemini-draft] geracao em {dt:.1f}s  ~{len(out)//4} tokens de saida", file=sys.stderr)

    if args.out:
        Path(args.out).parent.mkdir(parents=True, exist_ok=True)
        Path(args.out).write_text(out, encoding="utf-8")
        print(f"[gemini-draft] gravado em {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(out)


if __name__ == "__main__":
    main()
