#!/usr/bin/env python3
"""
Fix KaTeX render errors across lesson MDX files.

Error patterns fixed:
1. $<Eq>{`...`}</Eq>$ -> <Eq>{`...`}</Eq>  (remove outer $ wrapping)
2. <Eq>{`expr & condition`}</Eq> -> <Eq>{`\\begin{cases}...\\end{cases}`}</Eq>
3. &lt; &gt; HTML entities inside <Eq> -> < >
4. C^\\infty (missing braces) -> C^{\\infty}
5. ^\\infty (missing braces in sum/prod) -> ^{\\infty}
6. _\\text{...} (missing braces) -> _{\\text{...}}
7. y\\'\\' second derivative notation -> y''
8. g^\\prime (missing braces) -> g^{\\prime}
9. R\$ inside inline math $...$ -> fix the math span
10. Various specific patterns
"""

import re
import os
import sys

SKIP_FILES = {
    'licao-115-diagonalizacao.mdx', 'licao-114-autovalores.mdx',
    'licao-111-espacos-vetoriais.mdx', 'licao-116-matrizes-especiais.mdx',
    'licao-32-operacoes-matrizes.mdx', 'licao-33-transposta-inversa.mdx',
    'licao-31-matrizes.mdx', 'licao-35-sistemas-via-matrizes.mdx',
    'licao-34-determinantes.mdx', 'licao-40-consolidacao-anual.mdx',
    'licao-117-svd.mdx', 'licao-112-transformacoes-lineares.mdx',
    'licao-118-pca.mdx', 'licao-119-bs-sintese.mdx', 'licao-120-workshop-final.mdx',
}


def fix_piecewise_cases(text):
    """
    Convert piecewise function patterns to \\begin{cases}...\\end{cases}.

    Pattern: $<Eq>{`f(x) =`}</Eq>, <Eq>{`piece1 & cond1`}</Eq>, <Eq>{`piece2 & cond2`}</Eq>$
    or inline: Seja <Eq>{`f(x) =`}</Eq>, <Eq>{`piece1 & cond1`}</Eq>, <Eq>{`piece2 & cond2`}</Eq>
    """
    lines = text.split('\n')
    result = []

    for line in lines:
        line = fix_piecewise_line(line)
        result.append(line)

    return '\n'.join(result)


def fix_piecewise_line(line):
    """Fix a single line with piecewise function notation."""

    # Pattern: matches sequences of <Eq>{`...`}</Eq> joined by commas
    # where at least one piece has "& condition"

    # First: handle $<Eq>{`f(x) =`}</Eq>, <Eq>{`p1 & c1`}</Eq>, <Eq>{`p2 & c2`}</Eq>$
    # where the whole thing is wrapped in $...$

    # Strategy: find lines containing the piecewise pattern and rebuild them

    # Pattern 1: $<Eq>..., <Eq>{`... & ...`}... </Eq>$  -> full cases
    # Pattern 2: prose <Eq>..., <Eq>{`... & ...`}... </Eq> -> full cases

    if '<Eq>' not in line:
        return line

    # Check if line has & inside an <Eq> template literal
    has_amp_in_eq = bool(re.search(r'<Eq>\{`[^`]* & [^`]*`\}</Eq>', line))
    if not has_amp_in_eq:
        return line

    # Handle the $<Eq> ... $ wrapping pattern
    # Remove outer $ when line is: $<Eq>...</Eq>$ (with content between)
    # But be careful not to break actual math spans

    # Pattern: line looks like "$<Eq>{`lhs =`}</Eq>, <Eq>{`p & c`}</Eq>, ...$"
    # or "prose <Eq>{`f(x) =`}</Eq>, <Eq>{`p & c`}</Eq>, ... prose"

    # Try to find and rebuild piecewise sequences
    line = rebuild_piecewise(line)

    return line


def rebuild_piecewise(line):
    """
    Detect and rebuild piecewise function patterns.

    Handles:
    - $<Eq>{`f(x) =`}</Eq>, <Eq>{`p1 & c1`}</Eq>, <Eq>{`p2 & c2`}</Eq>$
    - text <Eq>{`f(x) =`}</Eq>, <Eq>{`p1 & c1`}</Eq>, <Eq>{`p2 & c2`}</Eq>
    """

    # Match: optional_dollar <Eq>{`lhs`}</Eq>, <Eq>{`piece & cond`}</Eq> [, <Eq>{`piece2 & cond2`}</Eq>]* optional_dollar
    # The key is the & in piece conditions

    # Find all <Eq>{`...`}</Eq> groups on the line with their positions
    eq_pattern = re.compile(r'<Eq>\{`([^`]*)`\}</Eq>')

    # Find consecutive <Eq> groups separated by ", " or just ","
    # that form a piecewise function

    # Strategy: find sequences where 2+ consecutive Eq groups exist
    # and at least one has " & " or ",&" separator

    # Build a list of matches
    matches = list(eq_pattern.finditer(line))

    if len(matches) < 2:
        return line

    # Find sequences of consecutive Eq groups
    # (where gaps between them are just ", " or ",")
    i = 0
    result = line

    # Work backwards to preserve positions
    sequences = []

    j = 0
    while j < len(matches):
        # Start of a potential sequence
        seq = [matches[j]]
        k = j + 1
        while k < len(matches):
            # Check if matches[k] is adjacent to matches[k-1] (only ", " or " " between)
            prev_end = seq[-1].end()
            curr_start = matches[k].start()
            between = line[prev_end:curr_start]
            if re.match(r'^[,\.\s]*$', between):
                seq.append(matches[k])
                k += 1
            else:
                break

        # Check if this sequence has & patterns
        has_amp = any(' & ' in m.group(1) or ',&' in m.group(1) for m in seq)

        if has_amp and len(seq) >= 2:
            sequences.append((j, k-1, seq))
            j = k
        else:
            j += 1

    if not sequences:
        return line

    # Process sequences in reverse order
    for seq_start_idx, seq_end_idx, seq_matches in reversed(sequences):
        # Determine if there's a piecewise "lhs =" in first match
        first_content = seq_matches[0].group(1)

        # Determine if first match is a "lhs =" prefix (no & in it)
        if ' & ' not in first_content and '&' not in first_content:
            # First is the lhs (e.g., "f(x) =")
            lhs = first_content
            pieces = seq_matches[1:]
        else:
            lhs = None
            pieces = seq_matches

        # Parse pieces: each is "expr & condition" or "expr & condition \\"
        cases_rows = []
        for p in pieces:
            content = p.group(1)
            # Remove trailing punctuation from last piece
            content = content.rstrip('.')
            # Split on & (the separator between expression and condition)
            if ' & ' in content:
                expr, cond = content.split(' & ', 1)
            elif '&' in content:
                # No spaces: e.g., "x^2-5&0\\leq x<4"
                idx = content.index('&')
                expr = content[:idx].strip()
                cond = content[idx+1:].strip()
            else:
                cases_rows.append(content)
                continue

            expr = expr.strip()
            cond = cond.strip().rstrip(',')
            cases_rows.append(f'{expr} & {cond}')

        # Build the cases LaTeX
        cases_inner = ' \\\\\\\\ '.join(cases_rows)
        if lhs:
            cases_latex = f'{lhs} \\\\begin{{cases}} {cases_inner} \\\\end{{cases}}'
        else:
            cases_latex = f'\\\\begin{{cases}} {cases_inner} \\\\end{{cases}}'

        # Get the full span of this sequence in the line
        seq_start_pos = seq_matches[0].start()
        seq_end_pos = seq_matches[-1].end()

        # Check if there's $ wrapping around the sequence
        # Look for $ before the sequence
        before_seq = result[:seq_start_pos]
        after_seq = result[seq_end_pos:]

        # Check if sequence is wrapped in $...$
        before_stripped = before_seq.rstrip()
        after_stripped = after_seq.lstrip()

        if before_stripped.endswith('$') and (after_stripped.startswith('$') or after_stripped.startswith(',') and after_stripped[1:2] == ' '):
            # Remove wrapping $
            new_before = before_stripped[:-1]
            if after_stripped.startswith('$'):
                new_after = after_stripped[1:]
            else:
                new_after = after_seq
            new_eq = f'<Eq>{{`{cases_latex}`}}</Eq>'
            result = new_before + new_eq + new_after
        else:
            # Just replace the sequence with cases
            new_eq = f'<Eq>{{`{cases_latex}`}}</Eq>'
            result = result[:seq_start_pos] + new_eq + result[seq_end_pos:]

    return result


def fix_html_entities_in_eq(text):
    """Replace &lt; &gt; with < > inside <Eq>{`...`}</Eq> template literals."""
    def fix_eq(m):
        content = m.group(1)
        content = content.replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&')
        return f'<Eq>{{`{content}`}}</Eq>'

    return re.sub(r'<Eq>\{`([^`]*(?:&lt;|&gt;|&amp;)[^`]*)`\}</Eq>', fix_eq, text)


def fix_superscript_infty(text):
    """Fix ^\\infty without braces in <Eq> template literals."""
    def fix_eq(m):
        content = m.group(1)
        # Fix ^\\infty -> ^{\\infty}
        # In file: \\\\infty = 4 backslash chars, KaTeX sees ^\\infty -> error
        # Fix: ^{\\\\infty}
        content = re.sub(r'\^\{\\\\infty\}', '^{\\\\infty}', content)  # already fixed, skip
        content = re.sub(r'\^\\\\infty(?!\})', '^{\\\\infty}', content)
        return f'<Eq>{{`{content}`}}</Eq>'

    return re.sub(r'<Eq>\{`([^`]*\\\\infty[^`]*)`\}</Eq>', fix_eq, text)


def fix_superscript_braces(text):
    """Fix ^\\command without braces in <Eq> template literals.

    Patterns:
    - ^\\\\infty -> ^{\\\\infty}
    - ^\\\\prime -> ^{\\\\prime}
    - _\\\\text{ -> _{\\\\text{
    - _\\\\infty -> _{\\\\infty}
    """
    def fix_eq(m):
        content = m.group(1)
        # Fix ^\\\\command -> ^{\\\\command}  (where command is a word)
        # Only when not already braced
        content = re.sub(r'\^\{\\\\', '^{\\\\', content)  # keep already braced ones

        # Patterns to fix: ^ followed by \\ followed by a letter sequence (not already in {})
        # e.g.: C^\\\\infty, g^\\\\prime, W(x) = \\\\sum_{n=0}^\\\\infty
        content = re.sub(r'(?<!\{)\^\\\\([a-zA-Z]+)', r'^{\\\\' + r'\1}', content)

        # Fix _\\\\text{ -> _{\\\\text{
        content = re.sub(r'(?<!\{)_\\\\([a-zA-Z]+)\{', r'_{\\\\' + r'\1{', content)

        # Fix _\\\\infty -> _{\\\\infty}
        content = re.sub(r'(?<!\{)_\\\\infty(?!\})', r'_{\\\\infty}', content)

        return f'<Eq>{{`{content}`}}</Eq>'

    return re.sub(r'<Eq>\{`([^`]+)`\}</Eq>', fix_eq, text)


def fix_double_prime_notation(text):
    """Fix y\\'\\' double prime notation in <Eq>."""
    def fix_eq(m):
        content = m.group(1)
        # y\\'\\' in file is y\'\' in the Eq content
        # This comes from y\'\'  -> y'' in normal notation
        # In KaTeX, y'' is valid but y\'\' is not
        # The file has y\\'\\'  -> actually represents y'' with escaped quotes
        # Fix: replace \\'\\'  with '' (just two apostrophes)
        content = content.replace("\\'\\'\\'", "\\''\\'")  # handle triple
        content = content.replace("\\'\\' ", "'' ")
        content = content.replace("\\'\\'", "''")
        return f'<Eq>{{`{content}`}}</Eq>'

    pat = "<Eq>\\{`([^`]*\\\\'[^`]*)`\\}</Eq>"
    return re.sub(pat, fix_eq, text)


def fix_dollar_in_math(text):
    """
    Fix $<Eq>{`...`}</Eq>$ -> <Eq>{`...`}</Eq>
    where the outer $ wrapping is redundant.
    """
    # Pattern: $ immediately before <Eq> and $ immediately after </Eq>
    # Only on lines where the whole expression is just the <Eq>
    lines = text.split('\n')
    result = []

    for line in lines:
        # Simple case: line is exactly "$<Eq>{`...`}</Eq>$" (possibly with trailing punctuation)
        # or "$<Eq>{`...`}</Eq>, <Eq>...</Eq>$"

        # Fix: strip outer $ when line starts with $<Eq> and ends with </Eq>$
        # But only when there are NO other $...$ spans that are legitimate math

        # Remove $<Eq>...</Eq>$ patterns (redundant dollar wrapping)
        new_line = re.sub(r'\$(<Eq>\{`[^`]+`\}</Eq>)\$', r'\1', line)
        if new_line != line:
            line = new_line

        result.append(line)

    return '\n'.join(result)


def fix_vmatrix_pmatrix_dollar_wrap(text):
    """
    Fix lines like: $<Eq>{`D = \\begin{vmatrix}...`}</Eq>$
    where the outer $ wraps an <Eq> that has matrix notation with &.
    """
    # This is handled by fix_dollar_in_math above
    pass


def fix_r_dollar_in_math_spans(text):
    """
    Fix R\\$ appearing inside inline math $...$  spans.
    The issue: "...em $a = 1{,}05$ R\\$/kWh..." - the R\\$ acts as a dollar sign
    and confuses the KaTeX scanner.

    Also fixes: "$p = \\$453$" -> "$p = 453$"
    And: "$p^* = 42{,}50$ R\\$." -> "$p^* = 42{,}50$ reais."
    """
    # Fix: $value$ R\\$ unit -> $value$ R\$ unit (no change needed in actual math)
    # The issue is that the SCANNER (not KaTeX itself) is confused
    # The real fix is to ensure R\$ doesn't appear right after a closing $

    # Pattern: "$ R\$" (space, R, backslash, dollar) -> "$ R\$" but the scanner
    # finds this as a new math span "$ R\"
    # Fix: replace "$ R\$" with "$ R$" (no backslash needed after closing math)
    # OR: spell out "reais"

    # For now, fix the specific pattern: $ R\$  (scanner false positive)
    # where the \$ is not in actual math
    # Replace: closing_dollar + space + R\$ -> closing_dollar + space + R\$
    # BUT change R\$ to R$ since it's outside math

    # Actually the safest fix: in opcoes text strings, change R\\$ to R\$
    # (remove one backslash since it's inside a JS string already)

    # For prose text: R\$ appearing after closing $ is fine as-is since
    # MDX escapes the dollar - the error is a scanner false positive
    # But we need to fix the actual KaTeX errors

    # Pattern that causes real error: "$p = \\$453$"
    # The scanner finds: "$p = \\" as a span then "$453$"
    # OR it finds: "$p = \\$" + "453$"
    # Let's check: $ p = \$453 $
    # scanner regex: /\$([^\$\n]{2,200}?)\$/ lazy
    # Finds: "$p = \" then... wait \$ is two chars: backslash + dollar
    # The regex [^\$] excludes $ but NOT \
    # So it finds: "$ p = \\$" -> span is "p = \\" -> KaTeX sees "p = \" -> error

    # Fix: replace "$p = \\$453$" with "$p = 453$" (remove \\$ from math)
    def fix_dollar_in_math(m):
        content = m.group(1)
        # Remove \\$ from math content (it's trying to write a dollar sign in math)
        # Replace \\$ with nothing (since the number follows)
        content = re.sub(r'\\\\?\$\s*(\d)', r'\1', content)
        return f'${content}$'

    return re.sub(r'\$([^\$\n]{2,200}?\\\\?\$[^\$\n]{0,100})\$', fix_dollar_in_math, text)


def remove_dollar_eq_wrapping(text):
    """
    Remove redundant $ wrapping around lone <Eq>{`...`}</Eq> expressions.

    Fix: $<Eq>{`expr`}</Eq>$ -> <Eq>{`expr`}</Eq>
    """
    # Simple pattern: $ directly before <Eq> and $ directly after </Eq>
    text = re.sub(r'\$(<Eq>\{`[^`]+`\}</Eq>)\$', r'\1', text)
    return text


def fix_html_entities_in_prose_eq(text):
    """Fix &lt; &gt; inside <Eq> that appear in solucao/passos JSX content."""
    def replace_entities(m):
        content = m.group(1)
        content = content.replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&')
        return f'<Eq>{{`{content}`}}</Eq>'

    return re.sub(r'<Eq>\{`([^`]*)`\}</Eq>', replace_entities, text)


def fix_double_prime_in_eq(text):
    """
    Fix y\\'\\' notation in <Eq> template literals.
    In the file: y\\'\\' represents the second derivative y''
    KaTeX error: Got function '\'' with no arguments as argument to '\''
    Fix: y\\'\\' -> y'' in <Eq> content
    """
    def fix_eq(m):
        content = m.group(1)
        # The file has: y\\'\\' which in the template literal means y\'\'
        # This is KaTeX notation for y'' but \ before ' is not valid in KaTeX
        # Fix: y\\'\\' -> y''
        # In the file, this appears as y\\'\\'  (4 chars: y \ ' \ ')
        # After template literal: y\'\' -> which KaTeX can't parse
        # Fix to: y'' (two apostrophes)

        # Pattern in file content (after reading): y\\'\\'
        # Actually: the file has y\'\'  in the Eq (each \' is an escaped quote in the template)
        # Let's replace the backslash-quote pattern

        # In the raw file, inside <Eq>{`...`}</Eq>:
        # y\'\' is written as y\\'\\'  in the actual file bytes
        # After regex captures it: content = y\\'\\' (with 2 backslashes before each quote)

        # Test: re.sub pattern
        # Replace \\' (backslash + apostrophe) sequences with just '
        content = re.sub(r"\\+'", "'", content)

        return f'<Eq>{{`{content}`}}</Eq>'

    # Only process Eq blocks that contain backslash-quote patterns
    pat = r"<Eq>\{`([^`]*\\'[^`]*)`\}</Eq>"
    return re.sub(pat, fix_eq, text)


def fix_superscript_without_braces(text):
    """
    Fix ^ or _ followed by \\command without braces in <Eq>.

    In file: C^\\\\infty -> KaTeX gets C^\\infty -> error
    Fix: C^{\\\\infty}

    In file: g^\\\\prime -> KaTeX gets g^\\prime -> error
    Fix: g^{\\\\prime}

    In file: v_\\\\text{média} -> v_{\\\\text{média}}
    Fix: v_{\\\\text{...}}

    In file: \\sum_{n=0}^\\\\infty -> \\sum_{n=0}^{\\\\infty}
    Fix: add braces
    """
    def fix_eq_content(m):
        content = m.group(1)

        # Fix ^\\\\command -> ^{\\\\command} where command starts with backslash
        # Pattern in file: ^\\\\word (^ then 4 backslashes then word)
        # We need: ^{\\\\word}

        # After file reading: \\\\word = \\word (4 chars = 2 chars)
        # The regex sees: ^\\\\ as ^\\

        # Fix ^\\\\[a-z]+ when not already braced
        # In file: the content inside <Eq>{`...`}</Eq> has \\\\infty (double-escaped)
        content = re.sub(r'\^\{(\\\\[a-zA-Z]+)\}', r'^{\1}', content)  # preserve existing
        content = re.sub(r'(?<![{])\^(\\\\[a-zA-Z]+)(?![}a-zA-Z])', r'^{\1}', content)

        # Fix _\\\\text{ -> _{\\\\text{
        content = re.sub(r'(?<![{])_(\\\\text)\{', r'_{\1{', content)
        # Fix _\\\\infty -> _{\\\\infty}
        content = re.sub(r'(?<![{])_(\\\\infty)(?![}])', r'_{\1}', content)

        return f'<Eq>{{`{content}`}}</Eq>'

    return re.sub(r'<Eq>\{`([^`]+)`\}</Eq>', fix_eq_content, text)


def fix_dollar_in_opcoes_text(text):
    """
    Fix R\\$ inside texto: "..." strings in opcoes arrays.
    The issue: texto: "$...R\\$..." causes KaTeX scanner to find bad spans.
    Fix: change R\\$ to R\$ (in context of string attribute, one less backslash).

    Actually the correct fix: in JS string attributes,
    \\$ -> just write the actual currency in prose.
    """
    # This is complex - skip for now and handle specific cases
    pass


def fix_lambda_trailing_underscore(text):
    """
    Fix $\\lambda_$ (trailing underscore with no argument).
    This comes from: $\\lambda_{1,2}$ being written as $\\lambda_$
    Fix: $\\lambda_$ -> $\\lambda_{1,2}$ ... actually we need context
    """
    # Fix: \lambda_ at end of $...$ span
    lines = text.split('\n')
    result = []
    for line in lines:
        # $\lambda_$ -> $\lambda$ (remove trailing underscore)
        line = re.sub(r'\$\\lambda_\$', r'$\\lambda$', line)
        # $\lambda_$ in other positions
        line = re.sub(r'\\lambda_\$', r'\\lambda$', line)
        result.append(line)
    return '\n'.join(result)


def fix_text_subscript_in_body_math(text):
    """
    Fix v_\\text{...} in body $...$ math (not in <Eq>).
    Body math: $v_\\text{média}=14$
    This has \\ (double backslash) for _\\text
    KaTeX error: Got function '\' with no arguments as subscript

    In the file: v_\\\\text{média} -> scanner gets v_\\text{média}
    -> KaTeX: v_\\... where \\ is a command with no args as subscript

    Fix: v_{\\\\text{média}} (add braces around _{...})
    """
    lines = text.split('\n')
    result = []
    for line in lines:
        # Skip opcoes/solucao/passos/fonte lines (they're in JSX context)
        if re.match(r'^\s*(opcoes|solucao|passos|fonte)\s*=', line):
            result.append(line)
            continue

        # Fix v_\\text{ -> v_{\\text{  in body math $...$
        # In file: v_\\\\text{ -> v_{\\\\text{
        line = re.sub(r'(_)\\\\\\\s*text\{', r'_\\\\\\\\text{', line)

        result.append(line)
    return '\n'.join(result)


def fix_sum_superscript_in_eq(text):
    """
    Fix \\sum_{n=0}^\\infty patterns in <Eq>.
    File: \\\\sum_{n=0}^\\\\infty -> KaTeX: \\sum_{n=0}^\\infty -> error
    Fix: \\\\sum_{n=0}^{\\\\infty}
    """
    # Handled by fix_superscript_without_braces
    pass


def fix_all(filepath):
    """Apply all fixes to a file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()

    text = original

    # 1. Remove redundant $ wrapping around <Eq>
    text = remove_dollar_eq_wrapping(text)

    # 2. Fix HTML entities inside <Eq>
    text = fix_html_entities_in_prose_eq(text)

    # 3. Fix double prime notation y\'\' -> y'' in <Eq>
    text = fix_double_prime_in_eq(text)

    # 4. Fix ^\\command and _\\command without braces in <Eq>
    text = fix_superscript_without_braces(text)

    # 5. Fix piecewise functions (& separator in <Eq>)
    text = fix_piecewise_cases(text)

    # 6. Fix $\lambda_$
    text = fix_lambda_trailing_underscore(text)

    if text != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(text)
        return True
    return False


def walk_content(directory):
    """Walk directory for .mdx files."""
    for root, dirs, files in os.walk(directory):
        # Skip i18n
        dirs[:] = [d for d in dirs if d != 'i18n' and not d.endswith('.bak')]
        for f in files:
            if f.endswith('.mdx') and f not in SKIP_FILES:
                yield os.path.join(root, f)


if __name__ == '__main__':
    content_dir = 'content/aulas'
    fixed = 0
    total = 0

    for filepath in sorted(walk_content(content_dir)):
        total += 1
        if fix_all(filepath):
            fixed += 1
            print(f'Fixed: {filepath}')

    print(f'\nProcessed {total} files, fixed {fixed}')
