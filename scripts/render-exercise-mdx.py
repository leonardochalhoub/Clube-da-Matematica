#!/usr/bin/env python3
"""
Render a single corpus exercise (JSONL row) as an MDX `<Exercicio>` block
ready to be authored further (distractors + solucao + optional passos).

This is the renderer half of the deterministic re-sourcing pipeline.
It does NOT generate distractors or solutions — those require an LLM
pass per exercise. It DOES:

- Convert raw book LaTeX (`\\(...\\)`, `\\begin{equation*}...\\end{equation*}`)
  into MDX-friendly `$...$` / `$$...$$` notation.
- Emit a `fonte={{ ... }}` block with livro + url + secao + exercicio + licenca.
- Leave an `opcoes={[...]}` placeholder with one `correta: true` and three
  TODO distractors for the human/LLM author to fill.
- Leave a `solucao={<>...</>}` placeholder.

Usage:
    cat candidates.jsonl | scripts/render-exercise-mdx.py > exercises.mdx
"""
from __future__ import annotations

import json
import re
import sys

# Per-source book display names (used in `fonte.livro`).
LIVRO_DISPLAY = {
    "openstax/college-algebra-2e": "OpenStax College Algebra 2e",
    "openstax/calculus-volume-1": "OpenStax Calculus Volume 1",
    "openstax/calculus-volume-2": "OpenStax Calculus Volume 2",
    "openstax/calculus-volume-3": "OpenStax Calculus Volume 3",
    "openstax/introductory-statistics-2e": "OpenStax Introductory Statistics 2e",
    "active-calculus/single": "Active Calculus",
}


def latex_html_to_mdx(s: str) -> str:
    """
    Convert raw book LaTeX-in-HTML markup into MDX `$...$` math.

    - `\\(...\\)` and `\\[...\\]` → `$...$` and `$$...$$`
    - `\\begin{equation*}...\\end{equation*}` → `$$...$$`
    - `\\text{,}` and similar trailing comma tweaks → drop
    """
    # `\begin{equation*}...\end{equation*}` → `$$...$$`
    s = re.sub(
        r"\\begin\{equation\*?\}(.*?)\\end\{equation\*?\}",
        r"$$\1$$",
        s,
        flags=re.DOTALL,
    )
    # `\(...\)` → `$...$`  and  `\[...\]` → `$$...$$`
    s = re.sub(r"\\\((.+?)\\\)", r"$\1$", s, flags=re.DOTALL)
    s = re.sub(r"\\\[(.+?)\\\]", r"$$\1$$", s, flags=re.DOTALL)
    # Active Calculus emits `\text{,}` and `\text{.}` as punctuation glue —
    # drop the LaTeX wrapper since MDX prose handles punctuation directly.
    s = re.sub(r"\\text\{([,.;])\}", r"\1", s)
    return s.strip()


def make_fonte(row: dict) -> str:
    livro = LIVRO_DISPLAY.get(row["source_id"], row["source_id"])
    parts = [f'livro: "{livro}"', f'url: "{row["section_url"]}"']
    if row.get("section_number"):
        parts.append(f'secao: "§{row["section_number"]}"')
    if row.get("exercise_id"):
        parts.append(f'exercicio: "ex. {row["exercise_id"]}"')
    if row.get("license"):
        parts.append(f'licenca: "{row["license"]}"')
    return "fonte={{ " + ", ".join(parts) + " }}"


def render_exercise(row: dict, numero: str, dificuldade: str = "aplicacao") -> str:
    statement = latex_html_to_mdx(row["statement"])
    fonte = make_fonte(row)
    out = f"""<Exercicio
  numero="{numero}"
  dificuldade="{dificuldade}"
  opcoes={{[
    {{ texto: "TODO: correct answer", correta: true }},
    {{ texto: "TODO: distractor 1" }},
    {{ texto: "TODO: distractor 2" }},
    {{ texto: "TODO: distractor 3" }},
  ]}}
  solucao={{<>TODO: write a 1–2 sentence solution explaining how to reach the correct answer.</>}}
  {fonte}
>
{statement}
</Exercicio>"""
    return out


def main() -> int:
    n = 0
    for line in sys.stdin:
        line = line.strip()
        if not line.startswith("{"):
            continue
        row = json.loads(line)
        numero = f"X.{n + 1}"
        print(render_exercise(row, numero))
        print()
        n += 1
    print(f"# rendered {n} exercise blocks", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
