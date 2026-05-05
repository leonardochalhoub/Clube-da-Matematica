#!/usr/bin/env python3
"""
Audit v0 lessons for known MDX build-breaking traps.

Scans every `publicado: false` lesson with `versao: "v0"` for patterns
that are known to break `next build`:

  T1. Bare `\\text{R\\$}` inside `$...$` math — confuses MDX math-boundary
      scanner. Fix: move currency outside math.
  T2. Bare `{x}` JSX expression in prose where x is undeclared (e.g. `{u}`,
      `{rei}`, `{copas}`). Fix: wrap in math `${u}$` or escape `&#123;u&#125;`.
  T3. Bare `<` followed by digit in prose like `<5s`. Fix: wrap in math
      `$<5$ s` or use Unicode "<" entity.
  T4. Bare `{,}` outside math context. Fix: wrap in `$1{,}5$` or use `1,5`.
  T5. Stray `</content>` / `<content>` tokens (translation-pipeline leakage).
"""
from pathlib import Path
import re
import sys

BASE = Path('content/aulas')


def is_in_math(line: str, pos: int) -> bool:
    """Check if `pos` falls inside a $...$ math span on the line."""
    before = line[:pos]
    # Count unescaped $ before position; if odd, we're inside math
    dollars = re.findall(r'(?<!\\)\$', before)
    return len(dollars) % 2 == 1


def scan_lesson(path: Path) -> dict:
    """Return dict of {trap_id: [(line_no, col, snippet), ...]}."""
    text = path.read_text()
    issues = {'T1': [], 'T2': [], 'T3': [], 'T4': [], 'T5': []}

    # Skip frontmatter region from line-by-line scan
    fm_match = re.match(r'^---\n[\s\S]*?\n---\n', text)
    body_start = fm_match.end() if fm_match else 0
    body = text[body_start:]
    body_line_offset = text[:body_start].count('\n')

    in_jsx_block = 0  # track nested JSX expr depth (for context)
    in_code_fence = False
    in_svg = 0

    for i, raw_line in enumerate(body.split('\n')):
        line_no = body_line_offset + i + 1
        line = raw_line

        # Track code fence state
        if line.lstrip().startswith('```'):
            in_code_fence = not in_code_fence
            continue
        if in_code_fence:
            continue

        # Track <svg> blocks
        if '<svg' in line:
            in_svg += line.count('<svg')
        if '</svg>' in line:
            in_svg = max(0, in_svg - line.count('</svg>'))

        # T1: \text{R\$} inside $...$ math — search any occurrence
        for m in re.finditer(r'\\text\{R\\\$\}', line):
            issues['T1'].append((line_no, m.start(), line.strip()[:100]))

        # T2: bare {identifier} where identifier is single lowercase word, in prose context
        # Skip lines that are inside JSX prop expressions or attribute values
        # Heuristic: only consider top-level prose lines (not indented inside a JSX block)
        # A safer detection: look for `{[a-z][a-z]*}` NOT preceded by `=` or `(` or `,`
        # and NOT inside math
        if not in_svg:
            for m in re.finditer(r'(?<![a-zA-Z=])\{([a-z][a-zA-Z0-9_]{0,12})\}', line):
                col = m.start()
                ident = m.group(1)
                # Skip whitelist of common React/JSX vars used legitimately
                if ident in {'children', 'i', 'key', 'true', 'false', 'null', 'undefined'}:
                    continue
                # Skip if inside math
                if is_in_math(line, col):
                    continue
                # Skip if this looks like a JSX attribute value: `prop={val}` — the `={` is checked above
                # Skip if line is inside an opcoes/passos block (heuristic: line starts with `  texto:` or `    "`)
                stripped = line.lstrip()
                if stripped.startswith(('texto:', '"', "'")):
                    continue
                issues['T2'].append((line_no, col, line.strip()[:100]))

        # T3: bare `<` followed by digit/space-digit in prose
        # `<5`, `< 5`, `<x` (where x is alpha not start of tag like `<svg`)
        for m in re.finditer(r'(?<![\w/])<\s*\d', line):
            col = m.start()
            if is_in_math(line, col):
                continue
            issues['T3'].append((line_no, col, line.strip()[:100]))

        # T4: bare {,} outside math — `{,}` in prose
        for m in re.finditer(r'\{,\}', line):
            col = m.start()
            if is_in_math(line, col):
                continue
            issues['T4'].append((line_no, col, line.strip()[:100]))

        # T5: stray content tags
        for m in re.finditer(r'</?content>', line):
            issues['T5'].append((line_no, m.start(), line.strip()[:100]))

    return issues


def main():
    v0_paths = []
    for p in sorted(BASE.glob('ano-*/trim-*/licao-*.mdx')):
        text = p.read_text()
        fm = re.match(r'^---\n([\s\S]*?)\n---', text)
        if not fm:
            continue
        if 'versao: "v0"' not in fm.group(1):
            continue
        v0_paths.append(p)

    print(f'Scanning {len(v0_paths)} v0 lessons...\n')

    summary = {'T1': 0, 'T2': 0, 'T3': 0, 'T4': 0, 'T5': 0}
    clean = []
    flagged = {}

    for p in v0_paths:
        issues = scan_lesson(p)
        total = sum(len(v) for v in issues.values())
        if total == 0:
            clean.append(p)
        else:
            flagged[p] = issues
            for k, v in issues.items():
                summary[k] += len(v)

    print(f'CLEAN (no detected traps): {len(clean)}')
    print(f'FLAGGED: {len(flagged)}')
    print(f'\nTrap totals across all flagged:')
    for k, v in summary.items():
        names = {
            'T1': 'R\\$ inside math',
            'T2': '{ident} JSX expr in prose',
            'T3': '<digit in prose',
            'T4': '{,} outside math',
            'T5': '</content> stray',
        }
        print(f'  {k} ({names[k]}): {v}')

    print('\n--- DETAIL ---')
    for p in sorted(flagged.keys()):
        print(f'\n{p.relative_to(BASE.parent.parent)}:')
        issues = flagged[p]
        for tid, hits in issues.items():
            for line_no, col, snippet in hits[:3]:  # limit to 3 per trap
                print(f'  {tid} L{line_no}:{col}  {snippet}')

    # Write clean list to file for next-step processing
    Path('/tmp/v0-clean.txt').write_text(
        '\n'.join(str(p.relative_to(BASE.parent.parent)) for p in clean)
    )
    print(f'\n→ {len(clean)} clean paths written to /tmp/v0-clean.txt')


if __name__ == '__main__':
    main()
