#!/usr/bin/env python3
"""fix-math-in-jsx.py — convert `$math$` to `<Eq>{`math`}</Eq>` inside JSX expressions.

The cascade-resource.py prompt told the LLM to use `$...$` everywhere, including
inside `solucao={<>...</>}` and `passos={<>...</>}` JSX expression blocks. That
worked for prose but breaks the JSX parser when the math contains `<`, `>`, `{`,
`}` (which JSX treats as tag delimiters). Symptom: webpack build fails with
"Could not parse expression with acorn" pointing at the offending line.

The L01/L41 gold-standard pattern is to wrap inline math in `<Eq>{`...`}</Eq>`
inside JSX expressions. This script converts every `$...$` inside `solucao={<>`
and `passos={<>` blocks to `<Eq>{`...`}</Eq>`, leaving the prose untouched.

Math outside JSX expressions (in body_pt and elsewhere in MDX prose) is NOT
converted — `$...$` is the correct markdown-math syntax there.

Usage:
    python3 scripts/fix-math-in-jsx.py FILE1.mdx FILE2.mdx ...
    python3 scripts/fix-math-in-jsx.py --all   # all changed lesson MDX files (git status)
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent

# Match an opening `solucao={<>` or `passos={<>` and the matching `</>}` close.
# Since JSX fragments don't nest the same way, and these blocks are always
# single-level in the cascade output, a non-greedy DOTALL match is safe.
_BLOCK_RE = re.compile(
    r"(?P<open>(?:solucao|passos)=\{<>)(?P<body>.*?)(?P<close></>\})",
    re.DOTALL,
)

# Match $...$ — non-greedy, no nested $, no line breaks.
# We intentionally don't match $$ ... $$ (block math) because remark-math handles
# those even inside JSX text — and they rarely contain the problematic <, >, {, }.
_INLINE_MATH_RE = re.compile(r"\$([^\$\n]+?)\$")


def convert_block_body(body: str) -> str:
    """Replace every $math$ with <Eq>{`math`}</Eq> in this JSX body."""
    def _replace(m: re.Match) -> str:
        math = m.group(1)
        # Backticks inside template literals would break the surrounding
        # `...` quotes. Escape them. (Extremely rare in practice.)
        math = math.replace("`", r"\`")
        return "<Eq>{`" + math + "`}</Eq>"

    return _INLINE_MATH_RE.sub(_replace, body)


def fix_file(path: Path) -> tuple[int, int]:
    """Returns (n_blocks_touched, n_math_converted)."""
    original = path.read_text()
    n_blocks = 0
    n_math = 0

    def _process_block(m: re.Match) -> str:
        nonlocal n_blocks, n_math
        body = m.group("body")
        # Count original $math$ occurrences in this block
        before = len(_INLINE_MATH_RE.findall(body))
        if before == 0:
            return m.group(0)
        new_body = convert_block_body(body)
        n_blocks += 1
        n_math += before
        return m.group("open") + new_body + m.group("close")

    fixed = _BLOCK_RE.sub(_process_block, original)
    if fixed != original:
        path.write_text(fixed)
    return n_blocks, n_math


def get_modified_lesson_files() -> list[Path]:
    """Return every modified .mdx file under content/aulas/ (PT-BR only)."""
    out = subprocess.check_output(
        ["git", "status", "--porcelain", "content/aulas/"],
        cwd=ROOT,
        text=True,
    )
    paths: list[Path] = []
    for line in out.splitlines():
        # ` M path` or `MM path`
        if not line.strip():
            continue
        rel = line[3:].strip()
        if rel.endswith(".mdx") and "/i18n/" not in rel:
            paths.append(ROOT / rel)
    return paths


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("files", nargs="*", type=Path, help="MDX files to fix")
    p.add_argument("--all", action="store_true",
                   help="apply to every modified PT-BR lesson MDX under content/aulas/")
    args = p.parse_args()

    if args.all:
        files = get_modified_lesson_files()
    else:
        files = list(args.files)

    if not files:
        print("no files to fix", file=sys.stderr)
        return 1

    total_blocks = 0
    total_math = 0
    files_touched = 0
    for f in files:
        f = f.resolve() if f.exists() else f
        if not f.exists():
            print(f"  skip (missing): {f}", file=sys.stderr)
            continue
        blocks, math = fix_file(f)
        if math > 0:
            files_touched += 1
            total_blocks += blocks
            total_math += math
            try:
                rel = f.relative_to(ROOT)
            except ValueError:
                rel = f
            print(f"  fixed {rel}: {blocks} blocks, {math} math expressions")

    print()
    print(f"=== {files_touched}/{len(files)} files touched · "
          f"{total_blocks} blocks · {total_math} math expressions converted ===")
    return 0


if __name__ == "__main__":
    sys.exit(main())
