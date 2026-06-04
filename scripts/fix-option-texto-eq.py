#!/usr/bin/env python3
"""
fix-option-texto-eq.py — option `texto` has TWO valid forms:
  1. STRING:  texto: "$x^2$"            -> renders $...$ as KaTeX
  2. JSX:     texto: <><Eq>{`x^2`}</Eq></>  -> valid ReactNode

Some regen agents wrote `<Eq>{`X`}</Eq>` INSIDE the STRING form
(texto: "<Eq>{`7x^6`}</Eq>"), which renders as literal text. Convert ONLY the
string form to `$X$`. NEVER touch the JSX-fragment form (texto: <>…</>), which is
correct — converting it makes `{...}` a JSX expression (e.g. "h is not defined").
"""
import re
from pathlib import Path

TARGETS = ["content/aulas", "content/engenharia", "content/i18n/en-US"]
EQ = re.compile(r"<Eq>\{`(.*?)`\}</Eq>", re.DOTALL)
# match a double-quoted texto string value, honoring backslash escapes
TEXTO_STR = re.compile(r'texto:\s*"((?:[^"\\]|\\.)*)"')


def _repl(m: re.Match) -> str:
    inner = EQ.sub(r"$\1$", m.group(1))
    return f'texto: "{inner}"'


def fix_line(line: str) -> str:
    if 'texto: "' not in line:
        return line
    return TEXTO_STR.sub(_repl, line)


def main() -> None:
    files = opts = 0
    for t in TARGETS:
        for p in sorted(Path(t).rglob("*.mdx")):
            text = p.read_text(encoding="utf-8")
            out, changed = [], 0
            for line in text.split("\n"):
                nl = fix_line(line)
                if nl != line:
                    changed += 1
                out.append(nl)
            if changed:
                p.write_text("\n".join(out), encoding="utf-8")
                files += 1
                opts += changed
                print(f"  {changed:3d}  {p}")
    print(f"\nfix-option-texto-eq: fixed {opts} string-form option lines in {files} files")


if __name__ == "__main__":
    main()
