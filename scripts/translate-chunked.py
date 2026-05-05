#!/usr/bin/env python3
"""
translate-chunked.py — translate ONE MDX lesson to ONE target locale by
splitting at structural boundaries (frontmatter / EquacaoCanonica /
DuasPortas / Exemplos / ListaExercicios sub-ranges / Fontes), translating
each chunk with Gemini Flash, then concatenating.

Avoids the silent output-truncation we hit when sending the whole 1058-line
file in one shot.

USAGE:
  export GEMINI_API_KEY=...
  python3 scripts/translate-chunked.py \\
      --source content/aulas/ano-1/trim-1/licao-01-conjuntos-intervalos.mdx \\
      --locale en-US

Stdlib only.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

LANG = {
    "en-US": "English (US)",
    "es-ES": "Spanish (Castilian)",
    "zh-CN": "Simplified Chinese",
    "ja-JP": "Japanese",
    "de-DE": "German",
    "fr-FR": "French",
    "it-IT": "Italian",
    "ru-RU": "Russian",
    "ko-KR": "Korean",
    "pl-PL": "Polish",
}

LICAO_NAME = {
    "en-US": "Lesson",
    "es-ES": "Lección",
    "zh-CN": "第N课",
    "ja-JP": "第N課",
    "de-DE": "Lektion",
    "fr-FR": "Leçon",
    "it-IT": "Lezione",
    "ru-RU": "Урок",
    "ko-KR": "강",
    "pl-PL": "Lekcja",
}

SYSTEM = """You are a precise machine translator for an MDX (Markdown + JSX + LaTeX) math-curriculum file from a Brazilian high-school textbook.

NEVER translate or modify:
- LaTeX math: anything inside $...$, $$...$$, or <Eq>{`...`}</Eq>
- JSX/component names, prop names, attribute keys
- URLs, slugs, IDs, exercise numbers (e.g. numero="1.7")
- frontmatter keys, "categoria", "subcategoria" values
- code blocks, code spans

ALWAYS translate:
- frontmatter "titulo" and "descricao" values
- prose text, headings (## Examples, ## Sources)
- component children text content
- string-literal prop values that are natural language: titulo="...", legenda text, audioTexto="...", solucao="...", dica="...", passos prose
- "Lição" → target equivalent (e.g. "Lesson" in English)

OUTPUT RULES:
- Return ONLY the translated MDX content, no commentary, no code-fence wrapper.
- Preserve EVERY newline, indentation level, and structural character.
- Keep currency markup "R\\$" untouched.
"""

USER_TEMPLATE = """Translate this MDX chunk from Brazilian Portuguese to {lang}.

Replace "Lição" with "{lesson_word}" where it appears in titles.

CHUNK (return only the translated MDX):

```mdx
{chunk}
```
"""


def call_gemini(system: str, user: str, *, key: str,
                model: str = "gemini-2.5-flash") -> str:
    url = (f"https://generativelanguage.googleapis.com/v1beta/"
           f"models/{model}:generateContent?key={key}")
    body = {
        "system_instruction": {"parts": [{"text": system}]},
        "contents": [{"role": "user", "parts": [{"text": user}]}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 16384},
    }
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={
        "Content-Type": "application/json",
        "User-Agent": "clube-da-matematica/0.1 (https://github.com/leonardochalhoub/Clube-da-Matematica)",
    })
    with urllib.request.urlopen(req, timeout=300) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
    cand = payload["candidates"][0]
    finish = cand.get("finishReason", "?")
    parts = cand.get("content", {}).get("parts", [])
    text = "".join(p.get("text", "") for p in parts)
    return text, finish


def split_chunks(src: str) -> list[tuple[str, str]]:
    """Split MDX at structural boundaries. Returns list of (label, text)."""
    lines = src.split("\n")

    # Find the indices of structural anchors
    anchors: list[tuple[int, str]] = []  # (line_index_0based, label)

    for i, ln in enumerate(lines):
        s = ln.strip()
        if i == 0 and s == "---":
            anchors.append((i, "frontmatter-start"))
        elif s == "</DuasPortas>":
            anchors.append((i + 1, "after-portas"))
        elif s.startswith("## Exemplos") or s.startswith("## Examples"):
            anchors.append((i, "examples-start"))
        elif s.startswith("<ListaExercicios"):
            anchors.append((i, "exercises-start"))
        elif s.startswith("</ListaExercicios>"):
            anchors.append((i + 1, "after-exercises"))
        elif s.startswith("## Fontes") or s.startswith("## Sources"):
            anchors.append((i, "sources-start"))

    # Build chunks based on anchors. We want the file split into:
    # 1. lines [0 .. after-portas)             — frontmatter + EquacaoCanonica + aside + DuasPortas
    # 2. lines [examples-start .. exercises-start) — ## Exemplos + 5 worked examples
    # 3. exercises split into ~3 sub-chunks     — heavy section
    # 4. lines [sources-start .. end)          — ## Fontes
    boundaries = {label: idx for idx, label in anchors}
    n = len(lines)
    after_portas = boundaries.get("after-portas", n)
    examples_start = boundaries.get("examples-start", after_portas)
    exercises_start = boundaries.get("exercises-start", examples_start)
    after_exercises = boundaries.get("after-exercises", n)
    sources_start = boundaries.get("sources-start", after_exercises)

    chunks: list[tuple[str, str]] = []
    chunks.append(("doors", "\n".join(lines[0:after_portas])))
    chunks.append(("examples", "\n".join(lines[examples_start:exercises_start])))

    # Split exercises into 3 roughly-equal sub-chunks at <Exercicio> boundaries.
    ex_lines = lines[exercises_start:after_exercises]
    ex_starts = [i for i, ln in enumerate(ex_lines) if ln.lstrip().startswith("<Exercicio")]
    if len(ex_starts) >= 6:
        third = len(ex_starts) // 3
        cut1 = ex_starts[third]
        cut2 = ex_starts[2 * third]
        chunks.append(("exercises-1", "\n".join(ex_lines[0:cut1])))
        chunks.append(("exercises-2", "\n".join(ex_lines[cut1:cut2])))
        chunks.append(("exercises-3", "\n".join(ex_lines[cut2:])))
    else:
        chunks.append(("exercises", "\n".join(ex_lines)))

    chunks.append(("sources", "\n".join(lines[sources_start:n])))
    return chunks


def strip_fence(text: str) -> str:
    """Remove ```mdx ... ``` wrapper if model added one."""
    text = text.strip()
    m = re.match(r"^```(?:mdx|markdown)?\s*\n(.*?)\n```\s*$", text, re.DOTALL)
    if m:
        return m.group(1)
    return text


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--source", required=True, help="PT-BR MDX source path")
    p.add_argument("--locale", required=True, choices=list(LANG.keys()))
    p.add_argument("--target", help="Override target path (default: content/i18n/<locale>/<rel>)")
    p.add_argument("--sleep", type=float, default=8.0,
                   help="Seconds between chunk calls (RPM throttling)")
    p.add_argument("--dry-run", action="store_true", help="Show chunks only")
    args = p.parse_args()

    src_path = Path(args.source).resolve()
    if not src_path.exists():
        print(f"ERROR: source not found: {src_path}", file=sys.stderr)
        return 1

    src = src_path.read_text(encoding="utf-8")
    chunks = split_chunks(src)

    print(f"Source: {src_path.relative_to(ROOT)}  ({len(src.splitlines())} lines)")
    print(f"Locale: {args.locale}  ({LANG[args.locale]})")
    print(f"Chunks: {len(chunks)}")
    for label, body in chunks:
        print(f"  - {label:14s} {len(body.splitlines()):4d} lines  {len(body):6d} bytes")

    if args.dry_run:
        return 0

    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        print("ERROR: GEMINI_API_KEY not set", file=sys.stderr)
        return 1

    # Resolve target
    if args.target:
        target = Path(args.target).resolve()
    else:
        rel = src_path.relative_to(ROOT / "content")
        target = ROOT / "content" / "i18n" / args.locale / rel

    target.parent.mkdir(parents=True, exist_ok=True)

    translated: list[str] = []
    lang_name = LANG[args.locale]
    lesson_word = LICAO_NAME[args.locale]

    # Disk cache so a 429 mid-run doesn't lose progress.
    cache_dir = ROOT / ".cache" / "translate-chunked" / args.locale / src_path.stem
    cache_dir.mkdir(parents=True, exist_ok=True)

    for i, (label, body) in enumerate(chunks, start=1):
        cached = cache_dir / f"{i:02d}-{label}.mdx"
        if cached.exists() and cached.stat().st_size > 0:
            print(f"  [{i}/{len(chunks)}] {label} → cache hit ({cached.stat().st_size} bytes)", flush=True)
            translated.append(cached.read_text(encoding="utf-8"))
            continue

        prompt = USER_TEMPLATE.format(lang=lang_name, lesson_word=lesson_word, chunk=body)

        attempt = 0
        backoff = 30
        while True:
            attempt += 1
            print(f"  [{i}/{len(chunks)}] {label} → calling Gemini ({len(body.splitlines())} lines, attempt {attempt})…",
                  flush=True)
            t0 = time.time()
            try:
                out, finish = call_gemini(SYSTEM, prompt, key=key)
                break
            except urllib.error.HTTPError as e:
                err_body = e.read().decode("utf-8", errors="replace")[:200]
                if e.code == 429 and attempt < 6:
                    print(f"     429 rate-limit; sleeping {backoff}s and retrying…", file=sys.stderr)
                    time.sleep(backoff)
                    backoff = min(backoff * 2, 180)
                    continue
                if e.code in (500, 503) and attempt < 4:
                    print(f"     {e.code} server error; sleeping {backoff}s and retrying…", file=sys.stderr)
                    time.sleep(backoff)
                    backoff = min(backoff * 2, 120)
                    continue
                print(f"     FAIL HTTP {e.code}: {err_body}", file=sys.stderr)
                return 2
            except Exception as e:
                if attempt < 3:
                    print(f"     {type(e).__name__}: {e}; sleeping 30s and retrying…", file=sys.stderr)
                    time.sleep(30)
                    continue
                print(f"     FAIL {type(e).__name__}: {e}", file=sys.stderr)
                return 2

        out = strip_fence(out)
        dt = time.time() - t0
        print(f"     ok in {dt:.1f}s  finishReason={finish}  {len(out.splitlines())} lines  {len(out)} bytes",
              flush=True)
        if finish == "MAX_TOKENS":
            print(f"     WARN: chunk hit MAX_TOKENS — output may be truncated", file=sys.stderr)
        cached.write_text(out, encoding="utf-8")
        translated.append(out)

        if i < len(chunks):
            time.sleep(args.sleep)

    final = "\n".join(translated)
    # Some chunks have leading/trailing newlines; the join with single \n keeps things tight.
    if not final.endswith("\n"):
        final += "\n"

    target.write_text(final, encoding="utf-8")
    print(f"\nWrote: {target.relative_to(ROOT)}  ({len(final.splitlines())} lines, {len(final)} bytes)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
