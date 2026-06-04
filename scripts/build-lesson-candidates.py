#!/usr/bin/env python3
"""
build-lesson-candidates.py — authoritative candidate pools for exercise regen.

The tag-overlap matcher (match-exercises-for-lesson.py) is unreliable: stats
section titles carry no topic words ("Chapter 7 Homework") and ambiguous tokens
mis-hit ("linear" matched linear ODEs for the função-afim lesson). This replaces
it with an EXPLICIT lesson -> (source, sections) map, pulling EVERY real exercise
from exactly the right book sections so each pool is on-topic, distinct, and
carries a real per-exercise reference.

Output: /tmp/cand2/<lesson-slug>.jsonl  (one real exercise per line, + `fonte`).

Usage:  python3 scripts/build-lesson-candidates.py
"""
from __future__ import annotations
import json
from pathlib import Path
from collections import defaultdict

REPO = Path(__file__).resolve().parent.parent
CORPUS = REPO / "livros" / "_parsed" / "_corpus.jsonl"
OUT = Path("/tmp/cand2")

LIVRO = {
    "openstax/college-algebra-2e": ("OpenStax College Algebra 2e", "CC-BY 4.0"),
    "openstax/algebra-and-trigonometry-2e": ("OpenStax Algebra and Trigonometry 2e", "CC-BY 4.0"),
    "openstax/calculus-volume-1": ("OpenStax Calculus Volume 1", "CC-BY-NC-SA 4.0"),
    "openstax/calculus-volume-2": ("OpenStax Calculus Volume 2", "CC-BY-NC-SA 4.0"),
    "openstax/calculus-volume-3": ("OpenStax Calculus Volume 3", "CC-BY-NC-SA 4.0"),
    "openstax/statistics": ("OpenStax Introductory Statistics", "CC-BY 4.0"),
    "openintro/statistics": ("OpenIntro Statistics", "CC-BY-SA 3.0"),
    "active-calculus/single": ("Active Calculus", "CC-BY-SA 4.0"),
    "axler/linear-algebra-done-right-4e": ("Axler — Linear Algebra Done Right 4e", "CC-BY-NC 4.0"),
    "beezer/first-course-linear-algebra": ("Beezer — A First Course in Linear Algebra", "GFDL"),
}

CA = "openstax/college-algebra-2e"
AT = "openstax/algebra-and-trigonometry-2e"
C1 = "openstax/calculus-volume-1"
C2 = "openstax/calculus-volume-2"
C3 = "openstax/calculus-volume-3"
ST = "openstax/statistics"
OI = "openintro/statistics"
AC = "active-calculus/single"
AX = "axler/linear-algebra-done-right-4e"
BZ = "beezer/first-course-linear-algebra"

# lesson number -> list of (source_id, [section_numbers])
MAP: dict[int, list[tuple[str, list[str]]]] = {
    # ---- Year 1 ----
    1:  [(CA, ["1.1", "2.7"])],
    2:  [(CA, ["3.1", "3.2"]), (C1, ["1.1"])],
    3:  [(CA, ["4.1", "4.2", "2.2"])],
    4:  [(CA, ["5.1", "2.5"])],
    5:  [(CA, ["3.4", "3.7"])],
    6:  [(CA, ["6.1", "6.2"])],
    7:  [(CA, ["6.3", "6.4", "6.5"])],
    8:  [(CA, ["6.7", "6.6", "6.8"])],
    9:  [(CA, ["3.3"]), (AC, ["1.1", "1.5"])],
    10: [(CA, ["1.1", "3.1", "4.1", "5.1", "6.1"])],
    11: [(AT, ["7.1", "7.2"])],
    12: [(AT, ["7.3", "7.4"])],
    13: [(AT, ["8.1", "8.2", "8.3"])],
    14: [(AT, ["9.5", "9.1", "9.2", "9.3"])],
    15: [(AT, ["10.1", "10.2"])],
    16: [(CA, ["9.1", "9.4"])],
    17: [(CA, ["9.2"])],
    18: [(CA, ["9.3", "9.4"])],
    19: [(C1, ["2.1", "2.2"]), (AC, ["1.2"])],
    20: [(AT, ["7.3", "8.1", "10.1"]), (CA, ["9.2", "9.3"])],
    21: [(CA, ["2.1"])],
    22: [(CA, ["4.1", "2.1"])],
    23: [(CA, ["4.1"]), (C3, ["2.5"])],
    24: [(CA, ["8.1"]), (C2, ["7.5"])],
    25: [(CA, ["8.1", "8.2", "8.3"]), (C2, ["7.5"])],
    26: [(C3, ["2.1"]), (AT, ["10.8"])],
    27: [(C3, ["2.3"])],
    28: [(C3, ["2.1", "2.3", "2.4", "3.4"])],
    29: [(CA, ["7.1", "7.2", "7.6"])],
    30: [(CA, ["2.1", "8.1"]), (C3, ["2.1", "2.3"]), (CA, ["7.1"])],
    31: [(CA, ["7.5"]), (BZ, ["MO"])],
    32: [(CA, ["7.5"]), (BZ, ["MO", "MM"])],
    33: [(CA, ["7.7"]), (BZ, ["MISLE", "MINM"])],
    34: [(CA, ["7.8"]), (BZ, ["DM", "PDM"])],
    35: [(CA, ["7.6", "7.7", "7.8"]), (BZ, ["SSLE", "RREF"])],
    36: [(CA, ["9.5"])],
    37: [(CA, ["9.5"])],
    38: [(CA, ["9.5", "9.6"])],
    39: [(CA, ["9.7"]), (OI, ["3.1", "3.2"])],
    40: [(CA, ["1.1", "4.1", "6.1", "7.1", "9.2"])],
    # ---- Year 2 ----
    41: [(C1, ["2.5"]), (AC, ["1.2"])],
    42: [(C1, ["2.3"])],
    43: [(C1, ["2.4"]), (AC, ["1.7"])],
    44: [(C1, ["2.2", "2.4"])],
    45: [(C1, ["2.3", "3.5"])],
    46: [(C1, ["2.4", "4.4"])],
    47: [(C1, ["4.6"])],
    48: [(C1, ["1.3", "3.5"]), (AC, ["2.2"])],
    49: [(C2, ["5.1"])],
    50: [(C1, ["2.2", "2.3", "2.4", "4.6"])],
    51: [(C1, ["3.1", "3.2"]), (AC, ["1.3", "1.4"])],
    52: [(C1, ["3.3"]), (AC, ["2.1", "2.3"])],
    53: [(C1, ["3.6"]), (AC, ["2.5"])],
    54: [(C1, ["3.8"]), (AC, ["2.7"])],
    55: [(C1, ["3.3"]), (AC, ["1.6"])],
    56: [(C1, ["3.7"]), (AC, ["2.6"])],
    57: [(C1, ["4.2"]), (AC, ["1.8"])],
    58: [(C1, ["4.1"]), (AC, ["3.1"])],
    59: [(C1, ["3.2"]), (AC, ["1.7"])],
    60: [(C1, ["3.1", "3.3", "3.6", "4.1"])],
    61: [(C1, ["4.3"]), (AC, ["3.3"])],
    62: [(C1, ["4.7"]), (AC, ["3.5", "3.6"])],
    63: [(C1, ["4.5", "4.6"])],
    64: [(C1, ["4.8"])],
    65: [(C2, ["6.3", "6.4"]), (AC, ["8.2", "8.4"])],
    66: [(C1, ["4.5"]), (AC, ["1.6"])],
    67: [(C1, ["3.4", "4.7"])],
    68: [(C1, ["3.4"]), (C3, ["3.4"]), (AC, ["1.5"])],
    69: [(C1, ["4.9"])],
    70: [(C1, ["4.3", "4.5", "4.7", "4.8"])],
    71: [(OI, ["2.1"]), (ST, ["2.P"])],
    72: [(OI, ["2.1"]), (ST, ["2.P"])],
    73: [(OI, ["2.1"]), (ST, ["2.P"])],
    74: [(OI, ["3.4"]), (ST, ["4.P"])],
    75: [(OI, ["4.3"]), (ST, ["4.P"])],
    76: [(OI, ["4.1"]), (ST, ["6.P"])],
    77: [(ST, ["7.P"]), (OI, ["5.1"])],
    78: [(OI, ["8.1"]), (ST, ["12.P"])],
    79: [(OI, ["3.2"]), (ST, ["3.P"])],
    80: [(OI, ["2.1", "3.4", "4.1", "5.1"])],
    # ---- Year 3 ----
    81: [(C1, ["4.10"]), (AC, ["5.1"])],
    82: [(C1, ["5.2", "5.1"]), (AC, ["4.3"])],
    83: [(C1, ["5.3"])],
    84: [(C1, ["5.5"]), (AC, ["5.3"])],
    85: [(C2, ["3.1"]), (AC, ["5.4"])],
    86: [(C2, ["3.4"])],
    87: [(C2, ["3.2", "3.3"])],
    88: [(C1, ["6.1"]), (AC, ["6.1"])],
    89: [(C1, ["6.2", "6.3"]), (AC, ["6.2"])],
    90: [(C1, ["4.10", "5.2", "5.3", "5.5"])],
    91: [(C2, ["4.1"]), (AC, ["7.1"])],
    92: [(C2, ["4.3"]), (AC, ["7.4"])],
    93: [(C2, ["4.5"])],
    94: [(C2, ["4.4"]), (AC, ["7.6"])],
    95: [(C3, ["7.1"])],
    96: [(C3, ["7.2", "7.3"])],
    97: [(C3, ["7.3", "7.2"])],
    98: [(C2, ["4.2"]), (AC, ["7.3"])],
    99: [(C2, ["4.3", "4.4"])],
    100: [(C2, ["4.1", "4.3", "4.5"])],
    101: [(OI, ["1.3", "1.4"]), (ST, ["1.P"])],
    102: [(OI, ["5.2", "7.1"]), (ST, ["8.P"])],
    103: [(OI, ["5.3"]), (ST, ["9.P"])],
    104: [(OI, ["7.1", "7.3"]), (ST, ["9.P", "10.P"])],
    105: [(OI, ["8.2"]), (ST, ["12.P"])],
    106: [(OI, ["9.1", "9.2", "9.R"]), (ST, ["12.P"])],
    107: [(OI, ["7.5"]), (ST, ["13.P"])],
    108: [(OI, ["6.3", "6.4"]), (ST, ["11.P"])],
    109: [(OI, ["3.2", "3.1"]), (ST, ["3.P"])],
    110: [(OI, ["5.2", "5.3", "7.1", "8.2"])],
    111: [(AX, ["1B", "1C"]), (BZ, ["VS", "S"])],
    112: [(AX, ["3A", "3B"]), (BZ, ["LT"])],
    113: [(AX, ["3B"]), (BZ, ["ILT", "SLT"])],
    114: [(AX, ["5A", "5B"]), (BZ, ["EE", "PEE"])],
    115: [(AX, ["5D", "5C"]), (BZ, ["SD", "EE"])],
    116: [(AX, ["7A", "7B"]), (BZ, ["O", "OD"])],
    117: [(AX, ["7E", "7F"])],
    118: [(AX, ["7E", "7C"])],
    # 119 (Black-Scholes synthesis): drill the real math BS is built from —
    # normal distribution, exponential models, definite integrals, Taylor series.
    119: [(ST, ["6.P"]), (OI, ["4.1"]), (CA, ["6.7"]), (C1, ["5.2"]), (C2, ["6.3"])],
    # 120 (final workshop): broad capstone spread across the 3 years.
    120: [(CA, ["6.1"]), (C1, ["3.3", "5.5"]), (ST, ["6.P"]), (BZ, ["EE"])],
}


# Ensino Superior — Cálculo 1 (content/engenharia/calculo-1). Keyed by slug.
# l01-l05 already corpus-sourced; l06-l40 are AI-written and need re-sourcing.
CALC1_MAP: dict[str, list[tuple[str, list[str]]]] = {
    "cal1-u1-l06-continuidade": [(C1, ["2.4"]), (AC, ["1.7"])],
    "cal1-u1-l07-tvi": [(C1, ["2.4"]), (AC, ["1.7"])],
    "cal1-u1-l08-weierstrass": [(C1, ["4.3"])],
    "cal1-u1-l09-limites-sequencias": [(C2, ["5.1"])],
    "cal1-u1-l10-workshop": [(C1, ["2.2", "2.3", "2.4", "4.6"])],
    "cal1-u2-l11-derivada-definicao": [(C1, ["3.1", "3.2"]), (AC, ["1.3", "1.4"])],
    "cal1-u2-l12-regras-derivacao": [(C1, ["3.3"]), (AC, ["2.1", "2.3"])],
    "cal1-u2-l13-regra-cadeia": [(C1, ["3.6"]), (AC, ["2.5"])],
    "cal1-u2-l14-derivadas-trig-inversas": [(C1, ["3.5", "3.7"]), (AC, ["2.4", "2.6"])],
    "cal1-u2-l15-derivadas-exp-log": [(C1, ["3.9"])],
    "cal1-u2-l16-derivacao-implicita": [(C1, ["3.8"]), (AC, ["2.7"])],
    "cal1-u2-l17-derivadas-ordem-superior": [(C1, ["3.3"]), (AC, ["1.6"])],
    "cal1-u2-l18-diferenciabilidade-aproximacao": [(C1, ["4.2"]), (AC, ["1.8"])],
    "cal1-u2-l19-taxas-relacionadas": [(C1, ["4.1"]), (AC, ["3.1"])],
    "cal1-u2-l20-workshop": [(C1, ["3.3", "3.6", "4.1"])],
    "cal1-u3-l21-tvm": [(C1, ["4.4"])],
    "cal1-u3-l22-crescimento-decrescimento": [(C1, ["4.5"])],
    "cal1-u3-l23-concavidade-inflexao": [(C1, ["4.5"]), (AC, ["1.6"])],
    "cal1-u3-l24-esboco-graficos": [(C1, ["4.5", "4.6"])],
    "cal1-u3-l25-maximos-minimos-globais": [(C1, ["4.3"]), (AC, ["3.3", "3.5"])],
    "cal1-u3-l26-otimizacao": [(C1, ["4.7"]), (AC, ["3.6"])],
    "cal1-u3-l27-lhopital": [(C1, ["4.8"])],
    "cal1-u3-l28-taylor": [(C2, ["6.3", "6.4"]), (AC, ["8.2", "8.4"])],
    "cal1-u3-l29-newton-raphson": [(C1, ["4.9"])],
    "cal1-u3-l30-workshop": [(C1, ["4.3", "4.5", "4.7", "4.8"])],
    "cal1-u4-l31-somas-riemann": [(C1, ["5.1"])],
    "cal1-u4-l32-propriedades-integral": [(C1, ["5.2"])],
    "cal1-u4-l33-antiderivada-integral-indefinida": [(C1, ["4.10"]), (AC, ["5.1"])],
    "cal1-u4-l34-tfc": [(C1, ["5.3"])],
    "cal1-u4-l35-substituicao": [(C1, ["5.5"]), (AC, ["5.3"])],
    "cal1-u4-l36-area-curvas": [(C1, ["6.1"]), (AC, ["6.1"])],
    "cal1-u4-l37-volumes": [(C1, ["6.2", "6.3"]), (AC, ["6.2"])],
    "cal1-u4-l38-comprimento-arco": [(C1, ["6.4"])],
    "cal1-u4-l39-aplicacoes-fisicas": [(C1, ["6.5"]), (AC, ["6.4"])],
    "cal1-u4-l40-workshop": [(C1, ["5.2", "5.3", "5.5", "6.1"])],
}


def fonte(r: dict) -> str:
    sid = r["source_id"]
    livro, lic = LIVRO.get(sid, (sid, "open"))
    lic = r.get("license") or lic
    parts = [f'livro: "{livro}"', f'url: "{r["section_url"]}"']
    if r.get("section_number"):
        parts.append(f'secao: "§{r["section_number"]}"')
    if r.get("exercise_id"):
        parts.append(f'exercicio: "ex. {r["exercise_id"]}"')
    parts.append(f'licenca: "{lic}"')
    return "fonte={{ " + ", ".join(parts) + " }}"


def main() -> None:
    # index corpus by (source_id, section_number)
    by_sec: dict[tuple[str, str], list[dict]] = defaultdict(list)
    with CORPUS.open(encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            r = json.loads(line)
            by_sec[(r["source_id"], r.get("section_number") or "")].append(r)

    # resolve lesson number -> slug from the content tree
    slug_by_num: dict[int, str] = {}
    for p in (REPO / "content" / "aulas").rglob("licao-*.mdx"):
        try:
            num = int(p.stem.split("-")[1])
        except (IndexError, ValueError):
            continue
        slug_by_num[num] = p.stem

    OUT.mkdir(parents=True, exist_ok=True)
    print(f"{'lesson':<42} {'pool':>5}  sources")
    for num in sorted(MAP):
        slug = slug_by_num.get(num)
        if not slug:
            print(f"  !! no lesson file for number {num}")
            continue
        rows: list[dict] = []
        srcs = []
        for sid, sections in MAP[num]:
            for sec in sections:
                hits = by_sec.get((sid, sec), [])
                rows.extend(hits)
                srcs.append(f"{sid.split('/')[-1]}§{sec}({len(hits)})")
        for r in rows:
            r["fonte"] = fonte(r)
        outp = OUT / f"{slug}.jsonl"
        with outp.open("w", encoding="utf-8") as o:
            for r in rows:
                o.write(json.dumps(r, ensure_ascii=False) + "\n")
        flag = "" if len(rows) >= 30 else "  <-- THIN"
        print(f"  {slug:<40} {len(rows):>5}  {', '.join(srcs)}{flag}")

    # ---- Ensino Superior — Cálculo 1 ----
    print("\n--- Cálculo 1 (Ensino Superior) ---")
    for slug in sorted(CALC1_MAP):
        rows, srcs = [], []
        for sid, sections in CALC1_MAP[slug]:
            for sec in sections:
                hits = by_sec.get((sid, sec), [])
                rows.extend(hits)
                srcs.append(f"{sid.split('/')[-1]}§{sec}({len(hits)})")
        for r in rows:
            r["fonte"] = fonte(r)
        with (OUT / f"{slug}.jsonl").open("w", encoding="utf-8") as o:
            for r in rows:
                o.write(json.dumps(r, ensure_ascii=False) + "\n")
        flag = "" if len(rows) >= 15 else "  <-- THIN"
        print(f"  {slug:<44} {len(rows):>5}  {', '.join(srcs)}{flag}")


if __name__ == "__main__":
    main()
