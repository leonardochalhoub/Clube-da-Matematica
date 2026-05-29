#!/usr/bin/env python3
"""fix-math-in-jsx.py — make cascade-output MDX safe for webpack/acorn.

Inside `solucao={<>...</>}` and `passos={<>...</>}` JSX expression blocks:
  1. Convert `$math$` → `<Eq>{`math`}</Eq>`.
  2. Escape loose `<`/`>` (not part of a known JSX tag) to `&lt;` / `&gt;`,
     but leave `<`/`>` inside backtick template literals (e.g. inside
     `<Eq>{`a > b`}</Eq>`) untouched.

Body_pt prose and bare LaTeX `\sqrt{nested{...}}` style markup are NOT
modified here — those need lesson-specific patching.

Idempotent. Run with `--all` to scan every PT-BR lesson MDX.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


# Match an opening `solucao={<>` or `passos={<>` and the matching `</>}` close.
_JSX_BLOCK_RE = re.compile(
    r"(?P<open>(?:solucao|passos)=\{<>)(?P<body>.*?)(?P<close></>\})",
    re.DOTALL,
)

# Recognized JSX tag names that may legitimately appear inside solucao/passos.
_VALID_TAG_NAMES = r"Eq|ol|ul|li|br|strong|em|sub|sup|p|div|span|a|code|pre"
_OPEN_TAG_RE = re.compile(rf"<(/?(?:{_VALID_TAG_NAMES}))(\s[^>]*)?>")

# Inline $...$ — non-greedy, no nested $ or line breaks.
_INLINE_MATH_RE = re.compile(r"\$([^\$\n]+?)\$")


def _escape_inline_math(body: str) -> str:
    """Step 1: `$math$` → `<Eq>{`math`}</Eq>`.

    Note: any `>`/`<` ends up inside the backtick template literal, which is
    safe for JSX since the parser treats the backtick run as one JS string.
    """
    def _repl(m: re.Match) -> str:
        math = m.group(1).replace("`", r"\`")
        return "<Eq>{`" + math + "`}</Eq>"
    return _INLINE_MATH_RE.sub(_repl, body)


def _escape_loose_angle_brackets(body: str) -> str:
    """Step 2: escape `<`/`>` in prose that aren't part of a known JSX tag.

    CRITICAL: leaves `<`/`>` inside backtick template literals (inside JSX
    expressions like `<Eq>{`a > b`}</Eq>`) untouched — those are JS strings,
    not JSX.
    """
    result: list[str] = []
    i = 0
    backtick_open = "{`"
    backtick_close = "`}"
    while i < len(body):
        # Skip over any `{`…`}` (backtick template literal) as one unit.
        if body[i:i + 2] == backtick_open:
            close = body.find(backtick_close, i + 2)
            if close != -1:
                result.append(body[i : close + 2])
                i = close + 2
                continue
        ch = body[i]
        if ch == "<":
            m = _OPEN_TAG_RE.match(body, i)
            if m:
                result.append(m.group(0))
                i = m.end()
                continue
            # Not a recognized JSX tag — escape this `<`.
            result.append("&lt;")
            i += 1
        elif ch == ">":
            # `>` outside JSX tag context (any recognized tag was already
            # consumed via the regex above).
            result.append("&gt;")
            i += 1
        else:
            result.append(ch)
            i += 1
    return "".join(result)


def _wrap_bare_latex_with_nested_braces(body: str) -> str:
    """Step 1.5: wrap stretches like `\\sqrt{a^{2}-b^{2}}` in `<Eq>{`...`}</Eq>`.

    Walks the body. When it hits a `\\command` outside an existing Eq block,
    consumes the command's body (handling balanced nested `{…}` groups), and
    wraps the whole run in `<Eq>{`…`}</Eq>`.
    """
    cmd_start = re.compile(
        r"\\(frac|sqrt|sin|cos|tan|sec|csc|cot|log|ln|lim|sum|int|prod|mathbb|"
        r"mathcal|mathit|mathbf|vec|hat|bar|left|right|cdot|times|div|pm|mp|"
        r"neq|leq|geq|alpha|beta|gamma|delta|epsilon|theta|lambda|mu|sigma|"
        r"pi|infty|to)"
    )
    out: list[str] = []
    i = 0
    while i < len(body):
        # Skip backtick template literals (existing <Eq>{`...`}</Eq> content).
        if body[i:i + 2] == "{`":
            close = body.find("`}", i + 2)
            if close != -1:
                out.append(body[i : close + 2])
                i = close + 2
                continue
        m = cmd_start.match(body, i)
        if m is None:
            out.append(body[i])
            i += 1
            continue
        # Consume the command + its braced-arg groups (1 or 2).
        end = m.end()
        for _ in range(2):
            if end < len(body) and body[end] == "{":
                depth = 1
                j = end + 1
                while j < len(body) and depth > 0:
                    if body[j] == "{":
                        depth += 1
                    elif body[j] == "}":
                        depth -= 1
                    j += 1
                if depth != 0:
                    break  # malformed — bail
                end = j
            else:
                break
        latex_run = body[i:end].replace("`", r"\`")
        out.append("<Eq>{`" + latex_run + "`}</Eq>")
        i = end
    return "".join(out)


def fix_jsx_block_body(body: str) -> str:
    body = _escape_inline_math(body)
    body = _wrap_bare_latex_with_nested_braces(body)
    body = _escape_loose_angle_brackets(body)
    return body


def fix_body_pt_set_notation(content: str) -> str:
    """Wrap `{N, N, N}` set notation in body_pt prose with `$...$`.

    Heuristic: a `{...}` that's NOT preceded by `<` (so not a JSX expression
    in a tag context), contains digits + commas (so it's a set/sequence), and
    isn't already inside `$...$` — wrap it.
    """
    # Match `{<digits-and-commas-and-spaces-and-ellipsis>}`.
    pattern = re.compile(
        r"(?<![\\\$`<a-zA-Z])\{(-?\d[\d\-,.\s…]*?)\}"
    )

    def _repl(m: re.Match) -> str:
        inside = m.group(1)
        if "," not in inside:
            return m.group(0)
        # Wrap in $...$ so MDX/KaTeX renders it as a set.
        return "$\\{" + inside + "\\}$"
    return pattern.sub(_repl, content)


def fix_file(path: Path) -> tuple[int, int]:
    """Returns (n_blocks_touched, char_delta)."""
    original = path.read_text()
    n_blocks = 0
    char_delta = 0

    def _process(m: re.Match) -> str:
        nonlocal n_blocks, char_delta
        body = m.group("body")
        new_body = fix_jsx_block_body(body)
        if new_body != body:
            n_blocks += 1
            char_delta += abs(len(new_body) - len(body))
        return m.group("open") + new_body + m.group("close")

    fixed = _JSX_BLOCK_RE.sub(_process, original)
    fixed = fix_body_pt_set_notation(fixed)
    if fixed != original:
        path.write_text(fixed)
    return n_blocks, char_delta


def get_all_pt_br_lesson_files() -> list[Path]:
    return sorted(
        p for p in (ROOT / "content" / "aulas").rglob("*.mdx")
        if ".bak" not in p.name and "/i18n/" not in str(p)
    )


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("files", nargs="*", type=Path, help="MDX files to fix")
    p.add_argument("--all", action="store_true",
                   help="apply to every PT-BR lesson MDX under content/aulas/")
    args = p.parse_args()

    files = get_all_pt_br_lesson_files() if args.all else list(args.files)
    if not files:
        print("no files to fix", file=sys.stderr)
        return 1

    total_blocks = 0
    total_changes = 0
    files_touched = 0
    for f in files:
        f = f.resolve() if f.exists() else f
        if not f.exists():
            print(f"  skip (missing): {f}", file=sys.stderr)
            continue
        blocks, changes = fix_file(f)
        if blocks > 0 or changes > 0:
            files_touched += 1
            total_blocks += blocks
            total_changes += changes
            try:
                rel = f.relative_to(ROOT)
            except ValueError:
                rel = f
            print(f"  fixed {rel}: {blocks} blocks, ~{changes} char delta")

    print()
    print(f"=== {files_touched}/{len(files)} files touched · "
          f"{total_blocks} blocks · ~{total_changes} char delta ===")
    return 0


if __name__ == "__main__":
    sys.exit(main())
