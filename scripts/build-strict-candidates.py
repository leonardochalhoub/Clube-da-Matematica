#!/usr/bin/env python3
"""
Build a strict-mode candidate JSONL for one lesson, using a per-lesson
section whitelist instead of fuzzy topic matching.

The whitelist (LESSON_SECTIONS dict below) maps lesson number → list of
(source_id, section_number) pairs. Only exercises from those specific
sections are included, and statements shorter than 50 chars are dropped
(to avoid context-less fragments).

Output goes to `/tmp/cascade-strict/L<NN>-candidates.jsonl`.

Usage:
    scripts/build-strict-candidates.py 41      # one lesson
    scripts/build-strict-candidates.py --all   # every lesson with a whitelist entry
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CORPUS = REPO_ROOT / "livros" / "_parsed" / "_corpus.jsonl"
OUTPUT_DIR = Path("/tmp/cascade-strict")

# Source-id shortcuts
CA2 = "openstax/college-algebra-2e"
CV1 = "openstax/calculus-volume-1"
CV2 = "openstax/calculus-volume-2"
CV3 = "openstax/calculus-volume-3"
AC = "active-calculus/single"
# New books added 2026-05-29
S2 = "openstax/statistics"             # OpenStax Statistics (Illowsky, Dean) — CC-BY 4.0
OI = "openintro/statistics"            # OpenIntro Statistics (Diez, Çetinkaya-Rundel) — CC-BY-SA 3.0
BZ = "beezer/first-course-linear-algebra"  # Beezer FCLA — GFDL
AX = "axler/linear-algebra-done-right-4e"  # Axler LADR 4e — CC-BY-NC 4.0

# Per-lesson section whitelist. Curated by topic match between the lesson
# title and the section title (using the inventory printed by aggregate-corpus
# stage). Each lesson should pull from sections that are SPECIFICALLY on
# topic, not just keyword-adjacent.
LESSON_SECTIONS: dict[int, list[tuple[str, str]]] = {
    # ===== Year 1, Trim 1: Functions =====
    1: [(CA2, "1.1")],  # Real Numbers: Algebra Essentials → set / interval ex.
    2: [(CA2, "3.1"), (CA2, "3.2"), (CV1, "1.1")],  # functions intro
    3: [(CA2, "4.1"), (CA2, "2.2"), (CA2, "2.5")],  # linear / line equations
    4: [(CA2, "3.3"), (CA2, "5.1"), (CA2, "5.2")],  # quadratic / polynomial
    5: [(CA2, "3.4"), (CA2, "5.6"), (CA2, "5.7")],  # composition / inverse / rational
    6: [(CA2, "6.1"), (CA2, "6.2"), (CV1, "1.5")],  # exponential
    7: [(CA2, "6.3"), (CA2, "6.4"), (CA2, "6.5")],  # logarithm
    8: [(CA2, "6.7"), (CA2, "6.8")],  # exp/log models, growth/decay
    9: [(CV1, "3.4")],  # derivatives as rates of change (preview)
    10: [(CV1, "2.1")],  # A Preview of Calculus (consolidacao)
    # ===== Year 1, Trim 2: Trigonometry + sequences =====
    11: [(CA2, "7.1"), (CA2, "7.2")],  # right triangle trig
    12: [(CA2, "7.3"), (CA2, "7.4")],  # unit circle
    13: [(CA2, "8.1"), (CA2, "8.2")],  # trig functions
    14: [(CA2, "9.1"), (CA2, "9.2"), (CA2, "9.3")],  # trig equations
    15: [(CA2, "10.1"), (CA2, "10.2")],  # laws of sines/cosines
    16: [(CV1, "1.5")],  # sequences placeholder
    17: [(CA2, "13.2")],  # arithmetic sequences/series
    18: [(CA2, "13.3"), (CA2, "13.4")],  # geometric, binomial
    19: [(AC, "1.2"), (CV1, "2.1"), (CV1, "2.2")],  # intuitive limit
    20: [(CV1, "2.1")],  # consolidacao trim-2
    # ===== Year 1, Trim 2: PA and PG (sequences) — corpus had it; old mapping was wrong =====
    17: [(CA2, "9.1"), (CA2, "9.2"), (CA2, "9.4")],  # arithmetic seqs + series
    18: [(CA2, "9.3"), (CA2, "9.6")],                # geometric seqs + binomial
    # ===== Year 1, Trim 3: Analytic geometry, conics, vectors, systems =====
    21: [(CA2, "2.1")],                                            # Rect coord systems, distance
    22: [(CA2, "4.1"), (CA2, "4.2")],                              # Linear functions / modeling
    23: [(CA2, "4.1"), (CA2, "7.1")],                              # Lines + systems 2x2
    24: [(CA2, "8.1")],                                            # Ellipse (covers circles as a=b)
    25: [(CA2, "8.1"), (CA2, "8.2"), (CA2, "8.3")],                # Ellipse / Hyperbola / Parabola
    26: [(CV3, "2.1")],                                            # Vectors in the Plane
    27: [(CV3, "2.3")],                                            # The Dot Product
    28: [(CV3, "2.1"), (CV3, "2.3")],                              # Vector applications (physics)
    29: [(CA2, "7.1"), (CA2, "7.2")],                              # Systems 2x2 + 3x3
    30: [(CA2, "2.1"), (CA2, "8.1"), (CV3, "2.1"), (CA2, "7.1")],  # consolidacao trim-3
    # ===== Year 1, Trim 4: Matrices, determinants, combinatorics, probability =====
    31: [(CA2, "7.5")],                                            # Matrices and Matrix Operations
    32: [(CA2, "7.5")],                                            # Matrix operations
    33: [(CA2, "7.5"), (CA2, "7.7")],                              # Transpose, identity, inverse
    34: [(CA2, "7.8")],                                            # Cramer's Rule uses determinants
    35: [(CA2, "7.6"), (CA2, "7.8")],                              # Gaussian + Cramer
    36: [(CA2, "9.5")],                                            # Counting Principles (PFC)
    37: [(CA2, "9.5")],                                            # Permutations / arrangements
    38: [(CA2, "9.5"), (CA2, "9.6")],                              # Combinations + Binomial Theorem
    39: [(CA2, "9.7")],                                            # Probability
    40: [(CA2, "7.5"), (CA2, "8.1"), (CA2, "9.5"), (CA2, "9.7")],  # consolidacao anual
    # ===== Year 2, Trim 5: Limits =====
    41: [(CV1, "2.5"), (CV1, "2.2"), (CV1, "2.3"), (AC, "1.2"), (AC, "1.7")],
    42: [(CV1, "2.3"), (AC, "1.2")],  # limit laws
    43: [(CV1, "2.4"), (AC, "1.7")],  # continuity
    44: [(CV1, "2.3"), (CV1, "2.2")],  # one-sided limits
    45: [(CV1, "2.3"), (CV1, "2.4")],  # fundamental limits
    46: [(CV1, "2.4")],  # IVT / continuity properties
    47: [(CV1, "4.6")],  # asymptotes
    48: [(CV1, "2.3"), (CV1, "3.5")],  # trig limits
    49: [(CV1, "2.2")],  # limit of sequence
    50: [(CV1, "2.5"), (CV1, "2.4")],  # consolidacao trim-5
    # ===== Year 2, Trim 6: Derivatives =====
    51: [(CV1, "3.1"), (CV1, "3.2"), (AC, "1.3"), (AC, "1.4")],  # derivative definition
    52: [(CV1, "3.3"), (AC, "2.1")],  # rules
    53: [(CV1, "3.6"), (AC, "2.5")],  # chain rule
    54: [(CV1, "3.8"), (AC, "2.7")],  # implicit
    55: [(CV1, "3.5"), (CV1, "3.9")],  # higher-order, trig, exp
    56: [(CV1, "3.7"), (AC, "2.6")],  # inverse derivatives
    57: [(CV1, "4.2"), (AC, "1.8")],  # linear approximation
    58: [(CV1, "4.1"), (AC, "3.1")],  # related rates
    59: [(CV1, "3.2"), (AC, "1.7")],  # differentiability
    60: [(CV1, "3.3"), (CV1, "3.6"), (CV1, "3.5")],  # consolidacao trim-6
    # ===== Year 2, Trim 7: Derivative applications =====
    61: [(CV1, "4.3"), (AC, "3.3")],  # maxima/minima
    62: [(CV1, "4.4")],  # mean value theorem
    63: [(CV1, "4.5"), (AC, "3.3")],  # shape of graph
    64: [(CV1, "4.5"), (AC, "3.4")],  # increasing/decreasing
    65: [(CV1, "4.6")],  # limits at infinity / asymptotes (revisit)
    66: [(CV1, "4.5"), (AC, "1.6")],  # concavity / second derivative
    67: [(CV1, "4.7"), (AC, "3.5"), (AC, "3.6")],  # optimization
    68: [(CV1, "4.8")],  # L'Hôpital
    69: [(CV1, "4.9")],  # Newton-Raphson
    70: [(CV1, "4.3"), (CV1, "4.7"), (CV1, "4.8")],  # consolidacao trim-7
    # ===== Year 2, Trim 8: Descriptive statistics =====
    71: [(S2, "2.P"), (S2, "2.H"), (S2, "2.B")],                    # central tendency
    72: [(S2, "2.P"), (S2, "2.H"), (OI, "2.1")],                    # variance / spread
    73: [(S2, "2.P"), (S2, "2.H"), (OI, "2.1")],                    # quartis / boxplot
    74: [(S2, "4.P"), (S2, "4.H"), (OI, "3.4")],                    # discrete RV
    75: [(S2, "4.P"), (S2, "4.H"), (OI, "4.3")],                    # binomial
    76: [(S2, "6.P"), (S2, "6.H"), (OI, "4.1")],                    # normal
    77: [(S2, "7.P"), (S2, "7.H"), (OI, "5.1")],                    # CLT
    78: [(S2, "12.P"), (S2, "12.H"), (OI, "8.1"), (OI, "8.2")],     # correlation + regression
    79: [(S2, "3.P"), (S2, "3.H"), (OI, "3.2")],                    # Bayes
    80: [(S2, "2.P"), (S2, "4.P"), (S2, "6.P"), (S2, "7.P"), (S2, "12.P")],  # consolidação Trim 8
    # ===== Year 3, Trim 9: Integration =====
    81: [(CV1, "4.10"), (AC, "5.1"), (AC, "5.5")],  # antiderivatives
    82: [(CV1, "5.1"), (CV1, "5.2"), (AC, "4.3")],  # definite integral
    83: [(CV1, "5.3"), (AC, "4.3")],  # FTC
    84: [(CV1, "5.5"), (CV2, "1.5"), (AC, "5.3")],  # substitution
    85: [(CV2, "3.1"), (AC, "5.4")],  # integration by parts
    86: [(CV2, "3.4")],  # partial fractions
    87: [(CV2, "3.2"), (CV2, "3.3")],  # trig integrals
    88: [(CV2, "2.1"), (CV1, "6.1")],  # area between curves
    89: [(CV2, "2.2"), (CV2, "2.3"), (CV1, "6.2"), (CV1, "6.3")],  # volume
    90: [(CV1, "5.3"), (CV1, "5.5"), (CV2, "3.1")],  # consolidacao trim-9
    # ===== Year 3, Trim 10: ODEs =====
    91: [(AC, "7.1"), (CV2, "4.1")],  # ODE intro
    92: [(AC, "7.4"), (CV2, "4.3")],  # separable
    93: [(AC, "7.5"), (CV2, "4.5")],  # linear 1st order
    94: [(AC, "7.6"), (CV2, "4.4")],  # population (logistic)
    95: [(CV2, "4.7")],  # 2nd order linear
    96: [(CV2, "4.2"), (AC, "7.2")],  # direction fields
    97: [(AC, "7.3"), (CV2, "4.6")],  # Euler method
    98: [(CV1, "6.8")],  # exponential decay
    99: [(CV2, "4.5")],  # variation of parameters
    100: [(AC, "7.1"), (AC, "7.4")],  # consolidacao trim-10
    # ===== Year 3, Trim 11: Inferential statistics =====
    101: [(S2, "1.P"), (S2, "1.H"), (OI, "1.3"), (OI, "1.4")],     # sampling
    102: [(S2, "8.P"), (S2, "8.H"), (OI, "5.2")],                  # CI for mean
    103: [(S2, "9.P"), (S2, "9.H"), (OI, "5.3")],                  # hypothesis test structure
    104: [(S2, "9.P"), (S2, "9.H"), (S2, "10.P"), (S2, "10.H")],   # z + t tests
    105: [(S2, "12.P"), (S2, "12.H"), (OI, "8.1"), (OI, "8.2")],   # linear regression
    106: [(S2, "12.P"), (S2, "12.H"), (OI, "9.1")],                # multiple regression
    107: [(S2, "13.P"), (S2, "13.H")],                             # ANOVA one-way
    108: [(S2, "11.P"), (S2, "11.H"), (OI, "6.3"), (OI, "6.4")],   # chi-square
    109: [(S2, "3.P"), (S2, "3.H"), (OI, "3.2")],                  # bayesian intro (using Bayes/conditional)
    110: [(S2, "8.P"), (S2, "9.P"), (S2, "12.P"), (S2, "13.P")],   # consolidação Trim 11
    # ===== Year 3, Trim 12: Linear algebra + synthesis =====
    111: [(CV3, "2.1"), (CV3, "2.2")],  # vectors
    112: [(CV3, "2.3"), (CV3, "2.4")],  # dot/cross
    113: [(CV3, "2.5"), (CV3, "2.6")],  # planes/lines
    # ===== Year 3, Trim 12: Linear Algebra + Black-Scholes synthesis =====
    114: [(AX, "5A"), (AX, "5B"), (BZ, "EE"), (BZ, "PEE")],         # eigenvalues
    115: [(AX, "5D"), (AX, "5C"), (BZ, "SD")],                       # diagonalização
    116: [(AX, "7A"), (AX, "7B"), (BZ, "O"), (BZ, "OD")],            # symmetric/orthog/hermitian
    117: [(AX, "7E"), (AX, "7F"), (AX, "6B"), (AX, "6C")],           # SVD + orthonormal
    118: [(AX, "7E"), (AX, "7F"), (AX, "6B")],                       # PCA via SVD
    119: [(BZ, "LT"), (BZ, "IVLT"), (AX, "5D")],                     # applications / Black-Scholes prereqs
    120: [(AX, "5A"), (AX, "7E"), (BZ, "LT"), (BZ, "EE")],           # workshop final mix
}


def build_for_lesson(num: int) -> int:
    if num not in LESSON_SECTIONS:
        return 0
    allowed = set(LESSON_SECTIONS[num])
    keep = []
    with CORPUS.open() as fh:
        for line in fh:
            row = json.loads(line)
            if (row["source_id"], row["section_number"]) not in allowed:
                continue
            if row.get("statement_len", 0) < 50:
                continue
            keep.append(row)
    keep.sort(
        key=lambda r: (
            r["source_id"],
            r["section_number"],
            int(r["exercise_id"]) if r["exercise_id"].isdigit() else 9999,
        )
    )
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUTPUT_DIR / f"L{num}-candidates.jsonl"
    with out_path.open("w") as fh:
        for r in keep:
            fh.write(json.dumps(r, ensure_ascii=False) + "\n")
    return len(keep)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("lesson", nargs="?", type=int)
    ap.add_argument("--all", action="store_true")
    args = ap.parse_args()
    if args.all:
        for num in sorted(LESSON_SECTIONS):
            n = build_for_lesson(num)
            tag = "OK" if n >= 20 else "LOW" if n > 0 else "EMPTY"
            print(f"  L{num:>3}: {n:>3} candidates [{tag}]")
        return 0
    if args.lesson is None:
        sys.exit("provide a lesson number, or --all")
    n = build_for_lesson(args.lesson)
    print(f"L{args.lesson}: {n} candidates")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
