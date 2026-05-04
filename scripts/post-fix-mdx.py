#!/usr/bin/env python3
"""
post-fix-mdx.py — aplica todos os post-fixes conhecidos a um draft MDX
gerado por Gemini, antes de validar.

Idempotente: rodar 2x não muda nada.

Fixes aplicados (em ordem):
1. Strip leading/trailing ```mdx``` code fence (Gemini wraps output)
2. {,} brace-decimal fora de $...$ math → ,
3. {,} brace-decimal dentro de ={<>...</>} JSX expressions → ,
4. <, > em $...$ math dentro de JSX expressions → \\lt, \\gt
5. ASCII number-line arrows <----- e -----> → ←————, ————→ (Unicode)
6. Aspas duplas internas em titulo="..." de <Exemplo> → '
7. </Exemplo> consecutivos duplicados → 1 só
"""

import re
import sys
from pathlib import Path


def apply_fixes(src):
    stats = {}

    # 1. Strip code fence
    new = re.sub(r'^```\w*\s*\n', '', src)
    new = re.sub(r'\n```\s*$', '\n', new)
    stats['fence_stripped'] = (len(src) - len(new)) > 0
    src = new

    # 2. Global {,} outside $...$
    out, in_math, count = [], False, 0
    i = 0
    while i < len(src):
        ch = src[i]
        if ch == '$':
            in_math = not in_math
            out.append(ch); i += 1; continue
        if not in_math and src[i:i+3] == '{,}':
            out.append(','); i += 3; count += 1; continue
        out.append(ch); i += 1
    src = "".join(out)
    stats['braces_outside_math'] = count

    # 3-5. Line-by-line fixes inside ={<>...</>} JSX expressions
    lines = src.splitlines()
    out_lines, inside = [], False
    fixes = {'braces_in_jsx': 0, 'math_lt_gt': 0, 'arrows': 0, 'exemplo_quotes': 0}

    fixes['math_to_eq'] = 0
    for line in lines:
        if "={<>" in line: inside = True
        if inside:
            # 3. {,} -> ,
            if "{,}" in line:
                fixes['braces_in_jsx'] += line.count("{,}")
                line = line.replace("{,}", ",")
            # 4+8. ANY $math$ inside JSX expressions becomes <Eq>{"..."}</Eq>
            # This handles {} braces in math, <, >, &, etc. — JS string is opaque
            def math_to_eq(m):
                content = m.group(1)
                # Escape for JS double-quoted string
                esc = content.replace("\\", "\\\\").replace('"', '\\"')
                fixes['math_to_eq'] += 1
                return f'<Eq>{{"{esc}"}}</Eq>'
            line = re.sub(r'\$([^$]+?)\$', math_to_eq, line)
        if "</>}" in line: inside = False

        # 5. ASCII number-line arrows (anywhere, not just JSX expressions)
        before = line
        line = re.sub(r'<-+', lambda m: '←' + '—' * (len(m.group(0)) - 1), line)
        line = re.sub(r'-+>', lambda m: '—' * (len(m.group(0)) - 1) + '→', line)
        if line != before:
            fixes['arrows'] += 1

        # 6. Inner quotes in <Exemplo titulo="...">
        if line.startswith("<Exemplo "):
            m = re.match(r'<Exemplo\s+titulo="(.*)"\s+numero="(\d+)"\s*>\s*$', line)
            if m and '"' in m.group(1):
                fixes['exemplo_quotes'] += 1
                line = f'<Exemplo titulo="{m.group(1).replace(chr(34), chr(39))}" numero="{m.group(2)}">'

        out_lines.append(line)

    src = "\n".join(out_lines)
    stats.update(fixes)

    # 7. Dedupe consecutive </Exemplo>
    new = re.sub(r"</Exemplo>\s*\n\s*</Exemplo>", "</Exemplo>", src)
    stats['exemplo_dedupe'] = (len(src) - len(new)) > 0
    src = new

    return src + ("\n" if not src.endswith("\n") else ""), stats


def main():
    if len(sys.argv) != 2:
        sys.exit("uso: post-fix-mdx.py <arquivo.mdx>")
    p = Path(sys.argv[1])
    src = p.read_text(encoding="utf-8")
    new, stats = apply_fixes(src)
    p.write_text(new, encoding="utf-8")
    delta = sum(v for v in stats.values() if isinstance(v, int))
    print(f"[post-fix] {p.name}: {stats}", file=sys.stderr)
    if delta == 0 and not any(stats.get(k) for k in ('fence_stripped', 'exemplo_dedupe')):
        print(f"[post-fix] no changes (file already clean)", file=sys.stderr)


if __name__ == "__main__":
    main()
