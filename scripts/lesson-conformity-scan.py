"""
Comprehensive conformity scan against the L1 canonical template.
Outputs per-lesson metrics + flags + a CSV for further analysis.
"""
import re
import csv
import json
from pathlib import Path
from collections import Counter

# Frontmatter required fields
REQUIRED_FRONTMATTER = [
    'titulo', 'slug', 'categoria', 'subcategoria', 'descricao',
    'ordem', 'publicado', 'tags', 'prerrequisitos', 'autores',
    'atualizadoEm'
]

# 7 doors
EXPECTED_PORTA_NIVEIS = ['formal', '5', '10', '15', '25', '40', 'pratica']

# Difficulty mix target
TARGET_MIX = {
    'aplicacao': (0.45, 0.75),   # 60% ± 15
    'compreensao': (0.05, 0.25),
    'modelagem': (0.05, 0.25),
    'desafio': (0.02, 0.20),
    'demonstracao': (0.02, 0.20),
}

def parse_frontmatter(text):
    m = re.match(r'^---\n(.*?)\n---\n', text, re.DOTALL)
    if not m: return {}
    fm = {}
    for line in m.group(1).split('\n'):
        m2 = re.match(r'^(\w+):\s*(.*)$', line)
        if m2:
            fm[m2.group(1)] = m2.group(2).strip()
    return fm

def count_exercicios(text):
    # Each <Exercicio ...> open tag and </Exercicio> close tag
    opens = len(re.findall(r'<Exercicio[^>]*\s', text)) + len(re.findall(r'<Exercicio\s', text)) + len(re.findall(r'<Exercicio>', text))
    # Simpler: just find <Exercicio that is followed by space or attributes
    opens = len(re.findall(r'<Exercicio[\s>]', text))
    closes = len(re.findall(r'</Exercicio>', text))
    return opens, closes

def count_exemplos(text):
    opens = len(re.findall(r'<Exemplo[\s>]', text))
    closes = len(re.findall(r'</Exemplo>', text))
    return opens, closes

def count_difficulties(text):
    """Count exercises by difficulty"""
    counts = Counter()
    for m in re.finditer(r'<Exercicio[^>]*dificuldade="(\w+)"', text):
        counts[m.group(1)] += 1
    return counts

def has_fonte_in_each_exercicio(text):
    """Returns (with_fonte, total)"""
    blocks = re.split(r'</Exercicio>', text)[:-1]
    total = with_fonte = 0
    for b in blocks:
        if '<Exercicio' in b:
            total += 1
            # Find LAST <Exercicio in this segment, then check up to </Exercicio>
            last = b.rfind('<Exercicio')
            seg = b[last:]
            if 'fonte=' in seg:
                with_fonte += 1
    return with_fonte, total

def has_solucao_in_each(text):
    blocks = re.split(r'</Exercicio>', text)[:-1]
    total = with_solucao = 0
    for b in blocks:
        if '<Exercicio' in b:
            total += 1
            last = b.rfind('<Exercicio')
            seg = b[last:]
            if 'solucao=' in seg:
                with_solucao += 1
    return with_solucao, total

def has_opcoes_in_each(text):
    blocks = re.split(r'</Exercicio>', text)[:-1]
    total = with_opcoes = 0
    for b in blocks:
        if '<Exercicio' in b:
            total += 1
            last = b.rfind('<Exercicio')
            seg = b[last:]
            if 'opcoes=' in seg:
                with_opcoes += 1
    return with_opcoes, total

def count_passos(text):
    return len(re.findall(r'passos={', text))

def detect_portas(text):
    """Extract list of nivel="..." values"""
    return [m.group(1) for m in re.finditer(r'<Porta\s+nivel="([^"]+)"', text)]

def check_audio_texto(text):
    return 'audioTexto' in text

def check_fontes_section(text):
    return bool(re.search(r'^##\s+(Fontes|Referências|Sources)', text, re.MULTILINE))

def check_books_header(text):
    """Looks for a 3-books bibliographic header (in aside or at top)"""
    # Count book references with "CC-BY" or similar license markers near top
    head = text[:3000]
    return head.count('CC-BY') + head.count('CC-PD') + head.count('GNU FDL')

def analyze(path):
    text = Path(path).read_text()
    fm = parse_frontmatter(text)
    ex_opens, ex_closes = count_exercicios(text)
    em_opens, em_closes = count_exemplos(text)
    diffs = count_difficulties(text)
    wf, tot = has_fonte_in_each_exercicio(text)
    ws, _ = has_solucao_in_each(text)
    wo, _ = has_opcoes_in_each(text)
    passos = count_passos(text)
    portas = detect_portas(text)
    
    flags = []
    
    # Structural
    if ex_opens != ex_closes:
        flags.append(f'TAG-IMBALANCE-Exercicio({ex_opens}/{ex_closes})')
    if em_opens != em_closes:
        flags.append(f'TAG-IMBALANCE-Exemplo({em_opens}/{em_closes})')
    
    # Frontmatter
    for f in REQUIRED_FRONTMATTER:
        if f not in fm or not fm[f]:
            flags.append(f'MISSING-FM-{f}')
    
    # 7 doors
    if len(portas) < 7:
        flags.append(f'INCOMPLETE-PORTAS({len(portas)}/7)')
    elif set(portas) != set(EXPECTED_PORTA_NIVEIS):
        missing = set(EXPECTED_PORTA_NIVEIS) - set(portas)
        extra = set(portas) - set(EXPECTED_PORTA_NIVEIS)
        if missing: flags.append(f'PORTAS-MISSING({",".join(sorted(missing))})')
        if extra: flags.append(f'PORTAS-EXTRA({",".join(sorted(extra))})')
    
    # Exercise count
    if ex_opens < 30:
        flags.append(f'FEW-EXERCISES({ex_opens}/30)')
    elif ex_opens > 80:
        flags.append(f'MANY-EXERCISES({ex_opens}/80)')
    
    # Exercises mostly with fonte+solucao+opcoes
    if tot > 0:
        if wf / tot < 0.90:
            flags.append(f'MISSING-FONTE({wf}/{tot})')
        if ws / tot < 0.90:
            flags.append(f'MISSING-SOLUCAO({ws}/{tot})')
        if wo / tot < 0.75:
            flags.append(f'MISSING-OPCOES({wo}/{tot})')
        # Passos coverage ~25%
        passos_pct = passos / tot
        if passos_pct < 0.10:
            flags.append(f'FEW-PASSOS({passos}/~{int(tot*0.25)})')
    
    # Difficulty mix
    total_diff = sum(diffs.values())
    if total_diff > 0:
        for diff, (low, high) in TARGET_MIX.items():
            pct = diffs.get(diff, 0) / total_diff
            if pct < low * 0.6 or pct > high * 1.5:  # 40% tolerance
                flags.append(f'MIX-OFF-{diff}({pct:.0%})')
    
    # Audio + Fontes
    if not check_audio_texto(text):
        flags.append('NO-AUDIO-TEXTO')
    if not check_fontes_section(text):
        flags.append('NO-FONTES-SECTION')
    
    # Books header
    head_books = check_books_header(text)
    if head_books < 2:
        flags.append(f'FEW-BOOKS-HEADER({head_books})')
    
    # Examples
    if em_opens < 3:
        flags.append(f'FEW-EXEMPLOS({em_opens}/5)')
    
    return {
        'path': str(path),
        'slug': fm.get('slug', '?'),
        'titulo': fm.get('titulo', '?'),
        'lines': len(text.split('\n')),
        'exercicios': ex_opens,
        'exemplos': em_opens,
        'portas': len(portas),
        'with_fonte': wf,
        'with_solucao': ws,
        'with_opcoes': wo,
        'passos': passos,
        'pct_passos': round(passos / tot, 2) if tot else 0,
        'aplicacao': diffs.get('aplicacao', 0),
        'compreensao': diffs.get('compreensao', 0),
        'modelagem': diffs.get('modelagem', 0),
        'desafio': diffs.get('desafio', 0),
        'demonstracao': diffs.get('demonstracao', 0),
        'has_audio': check_audio_texto(text),
        'has_fontes_section': check_fontes_section(text),
        'books_header': head_books,
        'n_flags': len(flags),
        'flags': '|'.join(flags),
    }

results = []
for p in sorted(Path('content/aulas').rglob('*.mdx')):
    if '.bak' in p.name or '/i18n/' in str(p): continue
    results.append(analyze(p))

# Sort by ordem (extracted from path)
def get_ordem(r):
    m = re.search(r'licao-(\d+)', r['path'])
    return int(m.group(1)) if m else 999
results.sort(key=get_ordem)

# Write CSV
out_csv = Path('docs/review/lesson-metrics.csv')
out_csv.parent.mkdir(parents=True, exist_ok=True)
with out_csv.open('w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(results[0].keys()))
    w.writeheader()
    w.writerows(results)

# Quick stats
total_lessons = len(results)
clean = sum(1 for r in results if r['n_flags'] == 0)
print(f"Total lessons: {total_lessons}")
print(f"Clean (no flags): {clean}")
print(f"With flags: {total_lessons - clean}")

# Flag frequency
flag_counter = Counter()
for r in results:
    for f in r['flags'].split('|'):
        if f: flag_counter[f.split('(')[0]] += 1
print("\nMost common flags:")
for flag, n in flag_counter.most_common(20):
    print(f"  {n:3d} × {flag}")

print(f"\nMetrics CSV: {out_csv}")
