#!/usr/bin/env python3
"""
fix-dollar-eq.py — heal the `$<Eq>...</Eq>$` render bug.

A `$...$` math span that WRAPS `<Eq>` JSX tags renders as raw text (KaTeX tries
to typeset the literal "<Eq>{...}</Eq>"). This is exactly the lesson-53 defect.

Three line shapes are healed (the whole trimmed line must be `$<Eq>...</Eq>$`):

  1. SINGLE   $<Eq>{`X`}</Eq>$                      -> <Eq>{`X`}</Eq>
  2. CASES    $<Eq>{`f(x) =`}</Eq>, <Eq>{`A & c1`}</Eq>, <Eq>{`B & c2`}</Eq>$
              -> <Eq>{`f(x) = \\begin{cases} A & c1 \\\\ B & c2 \\end{cases}`}</Eq>
     (first fragment is the "LHS =" head; remaining fragments carry `&` -> rows)
  3. SYSTEM   $<Eq>{`2x+y=5`}</Eq>, <Eq>{`x-y=1`}</Eq>$   (no `&`, >1 fragment)
              -> <Eq>{`\\begin{cases} 2x+y=5 \\\\ x-y=1 \\end{cases}`}</Eq>

Only touches lines whose trimmed form starts with `$<Eq>` and ends with `</Eq>$`.
Idempotent. Prints a per-file summary.
"""
import re
import sys
from pathlib import Path

TARGETS = ["content/aulas", "content/engenharia", "content/i18n/en-US"]

# capture the inner template-literal of each <Eq>{`...`}</Eq>
EQ = re.compile(r"<Eq>\{`(.*?)`\}</Eq>", re.DOTALL)
LINE = re.compile(r"^(\s*)\$(<Eq>\{`.*`\}</Eq>(?:\s*,\s*<Eq>\{`.*`\}</Eq>)*)\$\s*$")


# Template-literal escaping: KaTeX `\begin` needs source `\\begin`; the `\\` row
# break needs source `\\\\`. Raw strings give exactly those byte sequences.
BEGIN = r"\\begin{cases} "
END = r" \\end{cases}"
SEP = r" \\\\ "  # four backslashes -> KaTeX row break


def heal_line(indent: str, body: str):
    """Return (healed_line, status). status: 'ok' | 'skip-corrupt'."""
    frags = EQ.findall(body)
    if not frags:
        return None, "none"
    if len(frags) == 1:
        # single Eq: inner already correctly escaped in source — reuse verbatim
        return f"{indent}<Eq>{{`{frags[0]}`}}</Eq>", "ok"

    frags = [f.strip() for f in frags]
    has_amp = any("&" in f for f in frags)
    if has_amp:
        # piecewise: first fragment = head "LHS =" (or relation), rest = rows
        head, rows = frags[0], frags[1:]
        inner = f"{head} {BEGIN}{SEP.join(rows)}{END}"
    elif frags[0].rstrip().endswith("="):
        # corrupted piecewise: a "LHS =" head but the row CONDITIONS were lost
        # in the source (no `&`). Cannot rebuild faithfully -> leave for manual.
        return None, "skip-corrupt"
    else:
        # system of equations: every fragment is a full-equation row
        inner = f"{BEGIN}{SEP.join(frags)}{END}"
    return f"{indent}<Eq>{{`{inner}`}}</Eq>", "ok"


def process(path: Path):
    text = path.read_text(encoding="utf-8")
    out, changed, skipped = [], 0, []
    for i, line in enumerate(text.split("\n"), 1):
        m = LINE.match(line)
        if m:
            healed, status = heal_line(m.group(1), m.group(2))
            if status == "skip-corrupt":
                skipped.append(i)
            elif healed is not None and healed != line:
                out.append(healed)
                changed += 1
                continue
        out.append(line)
    if changed:
        path.write_text("\n".join(out), encoding="utf-8")
    return changed, skipped


def main():
    total_files, total_lines = 0, 0
    skips = []
    for t in TARGETS:
        for p in sorted(Path(t).rglob("*.mdx")):
            n, skipped = process(p)
            if n:
                total_files += 1
                total_lines += n
                print(f"  {n:3d}  {p}")
            for ln in skipped:
                skips.append(f"{p}:{ln}")
    print(f"\nfix-dollar-eq: healed {total_lines} lines in {total_files} files")
    if skips:
        print(f"\nSKIPPED (corrupted piecewise, conditions lost — fix by hand):")
        for s in skips:
            print(f"  {s}")


if __name__ == "__main__":
    main()
