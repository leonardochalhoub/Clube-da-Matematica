#!/usr/bin/env python3
"""
Strip `pagina` and `exercicio` fields from every `fonte={{ ... }}` block
across the entire content/ tree (PT-BR source + all 10 translated locales).

WHY: AI-generated citations are not reliable at the page/exercise-number
level. A spot-audit of Lição 1 confirmed that fields like
`exercicio: "ex. 5"` cite OpenStax PEMDAS problems that have nothing to do
with the set-builder exercise they're attached to. We keep `livro`, `url`,
`secao`, and `licenca` — those we can defend.

The script is:
  - idempotent (running twice is a no-op);
  - whitespace-preserving (rebuilds the `fonte={{ ... }}` token with the
    same single-line, single-space style used throughout the corpus);
  - safe for both source `content/aulas/**` and translated
    `content/i18n/<locale>/aulas/**`.

Run from repo root:
    python3 scripts/strip-fonte-pagina-exercicio.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CONTENT_ROOT = REPO_ROOT / "content"

# Match a full `fonte={{ ... }}` token. Non-greedy on the inner block so
# we don't span multiple fonte blocks on the same line (rare but possible).
FONTE_RE = re.compile(r"fonte=\{\{\s*(.+?)\s*\}\}")

# Parse `key: value` pairs inside the block. Values are either:
#   - a double-quoted string (with possibly escaped quotes), or
#   - an unquoted integer.
# A trailing comma (or end-of-block) terminates each pair.
PAIR_RE = re.compile(
    r"(\w+)\s*:\s*("
    r'"(?:[^"\\]|\\.)*"'   # quoted string
    r"|\d+"                # unsigned integer
    r")"
    r"\s*(?:,|$)"
)

DROP_KEYS = {"pagina", "exercicio"}


def clean_fonte(match: re.Match[str]) -> str:
    inner = match.group(1)
    pairs = PAIR_RE.findall(inner)
    kept = [(k, v) for k, v in pairs if k not in DROP_KEYS]
    if not kept:
        # Defensive: a fonte block with nothing left is meaningless.
        # Drop the whole prop by returning empty (the caller's surrounding
        # whitespace will collapse on next save). In practice this won't
        # fire because every fonte has at least `livro` + `url`.
        return ""
    parts = [f"{k}: {v}" for k, v in kept]
    return "fonte={{ " + ", ".join(parts) + " }}"


def process_file(path: Path) -> tuple[bool, int]:
    """Returns (changed, fonte_blocks_touched)."""
    src = path.read_text(encoding="utf-8")
    touched = {"n": 0}

    def replace(m: re.Match[str]) -> str:
        cleaned = clean_fonte(m)
        if cleaned != m.group(0):
            touched["n"] += 1
        return cleaned

    new = FONTE_RE.sub(replace, src)
    if new != src:
        path.write_text(new, encoding="utf-8")
        return True, touched["n"]
    return False, 0


def main() -> int:
    if not CONTENT_ROOT.is_dir():
        print(f"error: {CONTENT_ROOT} not found", file=sys.stderr)
        return 2

    mdx_files = sorted(CONTENT_ROOT.rglob("*.mdx"))
    total_files = len(mdx_files)
    changed_files = 0
    changed_blocks = 0

    for path in mdx_files:
        changed, n = process_file(path)
        if changed:
            changed_files += 1
            changed_blocks += n

    print(
        f"scanned {total_files} MDX files · "
        f"{changed_files} files updated · "
        f"{changed_blocks} fonte blocks stripped"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
