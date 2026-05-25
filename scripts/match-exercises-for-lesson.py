#!/usr/bin/env python3
"""
Authoring CLI — third piece of the deterministic re-sourcing pipeline.

Given a lesson MDX path, read its frontmatter `tags` and find the best
matching exercises from `livros/_parsed/_corpus.jsonl`. Outputs a JSONL
of candidate exercises, ranked by topic-tag overlap with the lesson.

This is the *suggestion* step. The next pipeline stage (not yet built)
takes these suggestions, drops them into an MDX template, generates MC
distractors via an LLM, writes a `solucao` per exercise, and marks 25%
with a `passos` walkthrough.

Usage:
    scripts/match-exercises-for-lesson.py content/aulas/ano-1/trim-1/licao-01-conjuntos-intervalos.mdx
    scripts/match-exercises-for-lesson.py LESSON.mdx --limit 40 --extra-tag set --extra-tag interval
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CORPUS = REPO_ROOT / "livros" / "_parsed" / "_corpus.jsonl"

# Map curriculum-level Portuguese tags onto canonical English keywords
# present in book section titles. Each PT tag may map to multiple EN
# tokens; an exercise scores higher when more of those tokens appear in
# its section_title-derived `topic_tags`.
PT_TO_EN_TAGS: dict[str, list[str]] = {
    # ---- Year 1 ----
    "fundamentos": ["foundations", "basics", "real", "numbers"],
    "conjuntos": ["set", "sets", "numbers", "real"],
    "intervalos": ["interval", "intervals", "inequalities", "absolute"],
    "notação": ["notation"],
    "funcoes": ["function", "functions", "domain", "range"],
    "função": ["function", "functions"],
    "afim": ["linear", "line", "lines", "slope"],
    "quadratica": ["quadratic", "parabola", "polynomial"],
    "parabola": ["parabola", "quadratic"],
    "bhaskara": ["quadratic", "formula", "discriminant"],
    "vertice": ["vertex", "parabola"],
    "discriminante": ["discriminant", "quadratic"],
    "otimizacao": ["optimization", "maxima", "minima"],
    "polinomial": ["polynomial", "polynomials"],
    "crescimento": ["growth", "exponential", "decay", "logistic"],
    "decaimento": ["decay", "exponential"],
    "logistico": ["logistic", "growth", "population"],
    "modelagem": ["modeling", "models", "application"],
    "sir": ["epidemic", "population", "differential"],
    "lei-de-moore": ["exponential", "growth", "technology"],
    "taxa-de-variacao": ["rate", "change", "average", "instantaneous"],
    "derivada-introducao": ["derivative", "introduction", "rate", "change"],
    "bruner": ["pedagogical"],
    "recorrencia": ["recurrence", "recursive", "sequence"],
    "juros": ["interest", "compound", "exponential", "growth"],
    "exponencial": ["exponential", "exp", "growth"],
    "logaritmo": ["logarithm", "logarithmic", "log"],
    "composicao": ["composition", "composite"],
    "inversa": ["inverse", "inverses"],
    "trigonometria": ["trigonometric", "trig", "sine", "cosine", "tangent", "trigonometry"],
    "trigonometricas": ["trigonometric", "trig", "sine", "cosine"],
    "triangulo": ["triangle", "triangles", "law"],
    "sequencias": ["sequence", "sequences", "series"],
    "pa": ["arithmetic", "progression", "sequence"],
    "pg": ["geometric", "progression", "sequence", "series"],
    "geometria-analitica": ["coordinate", "cartesian", "graph", "line"],
    "vetores": ["vector", "vectors", "dot"],
    "matrizes": ["matrix", "matrices", "system"],
    "combinatoria": ["combinations", "permutations", "counting", "binomial"],
    "probabilidade": ["probability", "probabilities"],
    # ---- Year 2 ----
    "limite": ["limit", "limits", "continuity", "continuous"],
    "limites": ["limit", "limits", "continuity", "continuous"],
    "épsilon-delta": ["limit", "limits", "epsilon", "delta", "precise"],
    "continuidade": ["continuity", "continuous", "intermediate"],
    "derivada": ["derivative", "derivatives", "differentiation"],
    "derivadas": ["derivative", "derivatives", "differentiation", "rules"],
    "cadeia": ["chain", "rule"],
    "implicita": ["implicit", "differentiation"],
    "aplicacoes-derivada": ["optimization", "maxima", "minima", "rates", "approximation"],
    "otimizacao": ["optimization", "maxima", "minima"],
    "taylor": ["taylor", "series", "approximation"],
    "estatistica-descritiva": ["statistics", "distribution", "distributions", "normal"],
    # ---- Year 3 ----
    "integral": ["integral", "integration", "antiderivative", "area", "volume"],
    "antiderivada": ["antiderivative", "integration", "fundamental"],
    "tfc": ["fundamental", "theorem", "calculus", "integral"],
    "substituicao": ["substitution", "integration"],
    "partes": ["parts", "integration"],
    "edo": ["differential", "equation", "equations"],
    # ---- Year 2 derivative applications ----
    "derivada-implicita": ["implicit", "differentiation", "chain"],
    "regra-da-cadeia": ["chain", "rule", "composition"],
    "curvas-implicitas": ["implicit", "curves", "differentiation"],
    "tangente": ["tangent", "line", "derivative"],
    "derivada-inversa": ["inverse", "function", "derivative", "differentiation"],
    "arcsin": ["arcsine", "inverse", "trigonometric"],
    "arctan": ["arctangent", "inverse", "trigonometric"],
    "ln": ["logarithm", "natural"],
    "taxas-relacionadas": ["related", "rates", "applications"],
    "diferenciacao-implicita": ["implicit", "differentiation"],
    "concavidade": ["concavity", "concave", "second", "derivative"],
    "inflexao": ["inflection", "concavity"],
    "segunda-derivada": ["second", "derivative", "concavity"],
    "convexidade": ["convex", "concavity"],
    "newton-raphson": ["newton", "method", "approximation", "roots"],
    "raizes": ["root", "roots", "zero"],
    "numerico": ["numerical", "approximation", "method"],
    "iteracao": ["iteration", "iterative"],
    # ---- Year 2 statistics ----
    "estatistica": ["statistics", "distribution", "probability"],
    "media": ["mean", "average", "expected"],
    "mediana": ["median", "central"],
    "moda": ["mode", "central"],
    "variancia": ["variance", "dispersion"],
    "desvio-padrao": ["standard", "deviation", "variance"],
    "dispersao": ["dispersion", "spread", "variance"],
    "quartis": ["quartile", "quartiles", "percentile"],
    "boxplot": ["boxplot", "quartile"],
    "percentil": ["percentile", "quartile"],
    # ---- Year 3 inferential statistics ----
    "estatistica-inferencial": ["inference", "inferential", "confidence", "hypothesis", "p-value"],
    "amostragem": ["sample", "sampling", "estimator"],
    "tcl": ["central", "limit", "theorem", "normal"],
    "intervalo-de-confianca": ["confidence", "interval", "estimation"],
    "t-de-student": ["t-distribution", "student", "test"],
    "teste-de-hipotese": ["hypothesis", "test", "testing", "p-value"],
    "p-valor": ["p-value", "significance", "test"],
    "teste-t": ["t-test", "t-distribution"],
    "teste-z": ["z-test", "z-distribution", "normal"],
    "welch": ["welch", "t-test"],
    "pareado": ["paired", "t-test"],
    "inferencia": ["confidence", "hypothesis", "regression", "anova"],
    "intervalo-confianca": ["confidence", "interval", "estimation"],
    "regressao": ["regression", "linear", "least-squares"],
    "regressao-multipla": ["regression", "multiple", "linear", "least-squares"],
    "ols": ["regression", "least-squares", "linear"],
    "anova": ["anova", "variance", "f-test"],
    "teste-f": ["f-test", "anova", "variance"],
    "qui-quadrado": ["chi-squared", "chi-square", "test", "independence"],
    "tabela-de-contingencia": ["contingency", "table", "chi-squared"],
    "independencia": ["independence", "test"],
    "aderencia": ["goodness", "fit", "chi-squared"],
    "estatistica-bayesiana": ["bayes", "bayesian", "prior", "posterior"],
    "prior": ["prior", "bayes"],
    "posterior": ["posterior", "bayes"],
    "verossimilhanca": ["likelihood", "maximum"],
    # ---- Year 3 linear algebra / synthesis ----
    "algebra-linear": ["vector", "eigenvalue", "matrix", "transformation"],
    "autovalores": ["eigenvalue", "eigenvalues", "eigenvector", "diagonalization"],
    "svd": ["singular", "value", "decomposition", "svd"],
    "pca": ["principal", "component", "pca"],
    "black-scholes": ["option", "pricing", "stochastic", "partial", "differential"],
    "opcoes": ["option", "options", "derivatives", "pricing"],
    "financas-quantitativas": ["finance", "pricing", "option"],
    "nobel": ["nobel", "prize"],
    "consolidacao": ["review", "consolidation"],
    "revisao": ["review", "consolidation"],
    "sintese": ["synthesis", "review", "summary"],
    "workshop": ["workshop", "applied", "project"],
    "encerramento": ["final", "summary", "synthesis"],
}


def load_corpus() -> list[dict]:
    if not CORPUS.is_file():
        sys.exit(
            f"error: {CORPUS} not found. "
            "Run scripts/aggregate-corpus.py first."
        )
    rows = []
    with CORPUS.open(encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def parse_frontmatter_tags(mdx_path: Path) -> list[str]:
    """Extract `tags: [...]` from the MDX YAML frontmatter."""
    src = mdx_path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---", src, re.DOTALL)
    if not m:
        return []
    fm = m.group(1)
    tag_match = re.search(r"^tags:\s*\[(.*?)\]", fm, re.MULTILINE)
    if not tag_match:
        return []
    inner = tag_match.group(1)
    return [t.strip().strip('"').strip("'") for t in inner.split(",") if t.strip()]


def _normalize_tag(tag: str) -> str:
    """Lowercase + strip accents + collapse internal spaces to hyphens."""
    s = unicodedata.normalize("NFD", tag).lower()
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"[\s_]+", "-", s.strip())
    return s


def expand_tags(pt_tags: list[str], extra: list[str]) -> set[str]:
    """Translate PT curriculum tags to canonical EN tokens for matching.

    Normalizes tags first (lowercase, strip accents, hyphenate) so MDX
    frontmatter tags like "quadrática", "PA", "taxa de variação" map onto
    the lowercased dictionary keys.
    """
    out: set[str] = set(extra)
    for raw in pt_tags:
        key = _normalize_tag(raw)
        out.update(PT_TO_EN_TAGS.get(key, [key]))
    return out


def score_exercise(row: dict, expanded_tags: set[str]) -> int:
    """Score = number of expanded tags appearing in the exercise's tags."""
    ex_tags = set(row.get("topic_tags", []))
    return len(ex_tags & expanded_tags)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument(
        "lesson",
        help="Path to lesson MDX file (e.g. content/aulas/ano-1/trim-1/licao-01-*.mdx).",
    )
    p.add_argument(
        "--limit", type=int, default=80,
        help="Max number of candidates to return (default: 80).",
    )
    p.add_argument(
        "--extra-tag", action="append", default=[],
        help="Add an extra topic keyword (can repeat). Useful when frontmatter tags are sparse.",
    )
    p.add_argument(
        "--min-score", type=int, default=1,
        help="Drop candidates whose score is below this (default: 1).",
    )
    p.add_argument(
        "--source", action="append", default=[],
        help="Restrict to one or more source_id prefixes (e.g. 'openstax/college-algebra-2e').",
    )
    p.add_argument(
        "--summary", action="store_true",
        help="Print per-source summary to stderr instead of JSONL.",
    )
    return p.parse_args()


def main() -> int:
    args = parse_args()
    mdx_path = Path(args.lesson)
    if not mdx_path.is_file():
        sys.exit(f"error: {mdx_path} not found.")
    pt_tags = parse_frontmatter_tags(mdx_path)
    expanded = expand_tags(pt_tags, args.extra_tag)
    print(
        f"# lesson: {mdx_path.name}\n"
        f"# frontmatter tags: {pt_tags}\n"
        f"# expanded matching keywords: {sorted(expanded)}",
        file=sys.stderr,
    )
    if not expanded:
        sys.exit(
            "error: no usable tags. Add frontmatter `tags: [...]` or pass --extra-tag."
        )

    corpus = load_corpus()
    if args.source:
        corpus = [r for r in corpus if any(r["source_id"].startswith(s) for s in args.source)]

    scored = [(score_exercise(r, expanded), r) for r in corpus]
    scored = [(s, r) for s, r in scored if s >= args.min_score]
    # Higher score first, then shorter statements (easier) first.
    scored.sort(key=lambda sr: (-sr[0], sr[1].get("statement_len", 9999)))
    top = scored[: args.limit]

    if args.summary:
        print(f"# {len(top)} candidates (out of {len(corpus)} corpus rows)", file=sys.stderr)
        from collections import Counter
        per_src = Counter(r["source_id"] for _, r in top)
        for src, n in per_src.most_common():
            print(f"  {src}: {n}", file=sys.stderr)
        return 0

    for score, row in top:
        row_out = dict(row)
        row_out["match_score"] = score
        json.dump(row_out, sys.stdout, ensure_ascii=False)
        sys.stdout.write("\n")
    print(f"# emitted {len(top)} candidates", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
