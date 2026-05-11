#!/usr/bin/env python3
"""
Generate `src/content/programa-em-licao-i18n.generated.ts` — translations
of every Licao.titulo and Licao.topicos for the trim listing page.

Strategy:
  - For Licao.titulo:
      → For en/es: read the corresponding translated MDX frontmatter
        from content/i18n/<locale>/aulas/.../licao-NN-slug.mdx, extract
        `titulo`, strip "Lesson NN — " / "Lección NN — " prefix.
      → Falls back to PT-BR PROGRAMA_EM titulo if translation missing.
  - For Licao.topicos:
      → Hardcoded translation table below (PT-BR keyword → en/es).
        Topicos strings are short technical phrases, mechanically
        translatable by table lookup.

Output: a generated TS file with `LICAO_TITULO_I18N` and
`LICAO_TOPICOS_I18N`, both keyed by lesson num (1..120).
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# -- 1. Parse all 120 lessons from programa-em.ts ------------------------
SRC = (ROOT / "src/content/programa-em.ts").read_text(encoding="utf-8")

# Match { num: N, titulo: '...', topicos: '...', ..., slug: '...' }
# Handles escaped apostrophes inside the strings.
def _unescape(s: str) -> str:
    return s.replace("\\'", "'")

def _capture_field(item_text: str, name: str) -> str | None:
    # Match `name: '...'` allowing escaped quotes.
    m = re.search(rf"{name}:\s*'((?:[^'\\]|\\.)*)'", item_text)
    return _unescape(m.group(1)) if m else None

# Find every { num: NN, ... slug: '...' } object
items_pattern = re.compile(
    r"\{\s*num:\s*(\d+),(?:[^{}]|\{[^{}]*\})*?slug:\s*'([^']+)'[^{}]*?\}",
    re.DOTALL,
)

lessons: dict[int, dict[str, str]] = {}
for m in items_pattern.finditer(SRC):
    num = int(m.group(1))
    obj = m.group(0)
    titulo = _capture_field(obj, "titulo")
    topicos = _capture_field(obj, "topicos")
    slug = m.group(2)
    if titulo and topicos and slug:
        lessons[num] = {"titulo": titulo, "topicos": topicos, "slug": slug}

if len(lessons) != 120:
    print(f"WARNING: parsed {len(lessons)} lessons, expected 120", file=sys.stderr)
    missing = [n for n in range(1, 121) if n not in lessons]
    print(f"missing nums: {missing}", file=sys.stderr)

print(f"Parsed {len(lessons)} lessons from programa-em.ts")

# -- 2. Helper: read translated titulo from MDX frontmatter --------------
def read_mdx_titulo(locale_dir: str, slug: str) -> str | None:
    """Find the MDX file for this slug under content/i18n/<locale>/aulas/...
    Returns the frontmatter `titulo` field, or None if not found.
    """
    base = ROOT / "content/i18n" / locale_dir / "aulas"
    if not base.exists():
        return None
    for p in base.rglob(f"{slug}.mdx"):
        text = p.read_text(encoding="utf-8")
        if not text.startswith("---"):
            return None
        end = text.find("\n---", 3)
        if end == -1:
            return None
        fm = text[3:end]
        m = re.search(r'^titulo:\s*"([^"]+)"', fm, re.MULTILINE)
        if m:
            return m.group(1)
    return None

# -- 3. Strip "Lesson NN — " / "Lección NN — " prefix --------------------
# The MDX titulo is like "Lesson 1 — Number sets, intervals, notation".
# We want just the part after the em-dash.
PREFIX_PATTERNS = {
    "en": [r"^Lesson\s+\d+[\s—\-]+", r"^Lesson\s+\d+:\s*"],
    "es": [r"^Lecci[oó]n\s+\d+[\s—\-]+", r"^Lecci[oó]n\s+\d+:\s*"],
    "zh": [r"^第\d+课\s*[—\-：:\s]+", r"^第\d+講\s*[—\-：:\s]+"],
    "de": [r"^Lektion\s+\d+[\s—\-]+"],
    "fr": [r"^Le[çc]on\s+\d+[\s—\-]+"],
    "it": [r"^Lezione\s+\d+[\s—\-]+"],
    "ja": [r"^第\d+講\s*[—\-：:\s]+"],
    "ko": [r"^\d+강\s*[—\-：:\s]+"],
    "ru": [r"^Урок\s+\d+[\s—\-]+"],
    "pl": [r"^Lekcja\s+\d+[\s—\-]+"],
}

def strip_prefix(text: str, locale: str) -> str:
    for pattern in PREFIX_PATTERNS.get(locale, []):
        m = re.match(pattern, text)
        if m:
            return text[m.end():].strip()
    return text

# -- 4. Build LICAO_TITULO_I18N entries from translated MDX --------------
LOCALES_FROM_MDX = [
    ("en", "en-US"),
    ("es", "es-ES"),
    ("zh", "zh-CN"),
    ("ja", "ja-JP"),
    ("de", "de-DE"),
    ("fr", "fr-FR"),
    ("it", "it-IT"),
    ("ru", "ru-RU"),
    ("ko", "ko-KR"),
    ("pl", "pl-PL"),
]
titulo_by_locale: dict[str, dict[int, str]] = {code: {} for code, _ in LOCALES_FROM_MDX}
for num, info in lessons.items():
    slug = info["slug"]
    for code, fs_dir in LOCALES_FROM_MDX:
        full = read_mdx_titulo(fs_dir, slug)
        if full:
            titulo_by_locale[code][num] = strip_prefix(full, code)

for code, _ in LOCALES_FROM_MDX:
    print(f"{code} titulos: {len(titulo_by_locale[code])}/{len(lessons)}")

# -- 5. Topicos translation table ---------------------------------------
# Approach: hardcode the en/es topicos for each lesson. The PT-BR
# topicos field is a short technical phrase — translating each by hand
# is fast (one line per lesson) and avoids the brittleness of
# keyword-substitution heuristics.
TOPICOS_I18N: dict[int, dict[str, str]] = {
    1:   {"en": "ℕ, ℤ, ℚ, ℝ, intervals, ∩, ∪, complement", "es": "ℕ, ℤ, ℚ, ℝ, intervalos, ∩, ∪, complemento"},
    2:   {"en": "f: A→B, Cartesian graph, surjective/injective", "es": "f: A→B, gráfico cartesiano, sobreyectiva/inyectiva"},
    3:   {"en": "Slope as constant rate of change", "es": "Pendiente como tasa de variación constante"},
    4:   {"en": "Vertex, roots, axis of symmetry, quadratic formula", "es": "Vértice, raíces, eje de simetría, fórmula cuadrática"},
    5:   {"en": "f∘g, f⁻¹, condition for invertibility", "es": "f∘g, f⁻¹, condición de invertibilidad"},
    6:   {"en": "a^x, the number e via compound interest", "es": "a^x, el número e vía interés compuesto"},
    7:   {"en": "log_a x as the inverse of a^x; ln, log base 10", "es": "log_a x como inversa de a^x; ln, log decimal"},
    8:   {"en": "Population, radioactive decay, compound interest", "es": "Población, decaimiento radiactivo, interés compuesto"},
    9:   {"en": "Δy/Δx, geometric and physical interpretation — gateway to calculus", "es": "Δy/Δx, interpretación geométrica y física — puerta de entrada al cálculo"},
    10:  {"en": "Integrating workshop, ENEM/EJU/Abitur-style problems", "es": "Taller integrador, problemas estilo ENEM/EJU/Abitur"},
    11:  {"en": "sin, cos, tan, measurement applications", "es": "sen, cos, tan, aplicaciones en medición"},
    12:  {"en": "Radians, fundamental identities", "es": "Radianes, identidades fundamentales"},
    13:  {"en": "Periodicity, graphs of sin x, cos x, tan x", "es": "Periodicidad, gráficos de sin x, cos x, tan x"},
    14:  {"en": "sin x = 1/2, etc.", "es": "sin x = 1/2, etc."},
    15:  {"en": "Non-right triangles, area via 1/2 ab sin C", "es": "Triángulos no rectángulos, área vía 1/2 ab sin C"},
    16:  {"en": "(aₙ), recurrence, monotonicity, boundedness", "es": "(aₙ), recurrencia, monotonía, acotación"},
    17:  {"en": "aₙ = a₁ + (n-1)d, sum formula", "es": "aₙ = a₁ + (n-1)d, fórmula de la suma"},
    18:  {"en": "aₙ = a₁q^(n-1), geometric sum, infinite series", "es": "aₙ = a₁q^(n-1), suma geométrica, series infinitas"},
    19:  {"en": "lim aₙ via inspection, divergence, oscillation", "es": "lim aₙ por inspección, divergencia, oscilación"},
    20:  {"en": "Trig + sequences synthesis", "es": "Síntesis de trigonometría + sucesiones"},
    21:  {"en": "Coordinates, quadrants, distance between points", "es": "Coordenadas, cuadrantes, distancia entre puntos"},
    22:  {"en": "y = mx + n, Ax + By + C = 0, slope", "es": "y = mx + n, Ax + By + C = 0, pendiente"},
    23:  {"en": "Parallel, perpendicular, point-line distance", "es": "Paralelas, perpendiculares, distancia punto-recta"},
    24:  {"en": "(x-a)² + (y-b)² = r², tangents", "es": "(x-a)² + (y-b)² = r², tangentes"},
    25:  {"en": "Ellipse, parabola, hyperbola — canonical equations", "es": "Elipse, parábola, hipérbola — ecuaciones canónicas"},
    26:  {"en": "Components, magnitude, addition, scalar multiplication", "es": "Componentes, módulo, suma, multiplicación escalar"},
    27:  {"en": "u·v = u₁v₁ + u₂v₂ = |u||v|cos θ", "es": "u·v = u₁v₁ + u₂v₂ = |u||v|cos θ"},
    28:  {"en": "Work, resultant force, free-body diagrams", "es": "Trabajo, fuerza resultante, diagramas de cuerpo libre"},
    29:  {"en": "Substitution, addition, geometric interpretation", "es": "Sustitución, adición, interpretación geométrica"},
    30:  {"en": "Integrating workshop with vectors + lines + conics", "es": "Taller integrador con vectores + rectas + cónicas"},
    31:  {"en": "Notation, types of matrices (square, identity, diagonal)", "es": "Notación, tipos de matrices (cuadrada, identidad, diagonal)"},
    32:  {"en": "Addition, scalar multiplication, matrix product", "es": "Suma, multiplicación escalar, producto matricial"},
    33:  {"en": "Aᵀ, A⁻¹, existence conditions", "es": "Aᵀ, A⁻¹, condiciones de existencia"},
    34:  {"en": "2×2, 3×3, Sarrus rule, geometric properties", "es": "2×2, 3×3, regla de Sarrus, propiedades geométricas"},
    35:  {"en": "Ax = b, Cramer's rule for n = 2, 3", "es": "Ax = b, regla de Cramer para n = 2, 3"},
    36:  {"en": "FCP, applications to telephones, passwords", "es": "PFC, aplicaciones a teléfonos, contraseñas"},
    37:  {"en": "n!, P(n,r), order matters", "es": "n!, P(n,r), el orden importa"},
    38:  {"en": "C(n,r), Pascal's triangle, applications", "es": "C(n,r), triángulo de Pascal, aplicaciones"},
    39:  {"en": "Classical, frequentist, conditional probability", "es": "Probabilidad clásica, frecuentista, condicional"},
    40:  {"en": "Year 1 synthesis, ENEM/SAT mixed problems", "es": "Síntesis del Año 1, problemas mixtos ENEM/SAT"},
    41:  {"en": "Formal ε-δ definition, intuition", "es": "Definición formal ε-δ, intuición"},
    42:  {"en": "Sum, product, quotient, composition of limits", "es": "Suma, producto, cociente, composición de límites"},
    43:  {"en": "Definition by ε-δ, types of discontinuity", "es": "Definición por ε-δ, tipos de discontinuidad"},
    44:  {"en": "lim from the left and right, piecewise functions", "es": "lím por izquierda y derecha, funciones por partes"},
    45:  {"en": "lim (sin x)/x = 1, lim (1+1/n)ⁿ = e", "es": "lím (sin x)/x = 1, lím (1+1/n)ⁿ = e"},
    46:  {"en": "Intermediate Value Theorem, bisection, applications", "es": "Teorema del Valor Intermedio, bisección, aplicaciones"},
    47:  {"en": "Vertical, horizontal, oblique asymptotes", "es": "Asíntotas verticales, horizontales, oblicuas"},
    48:  {"en": "lim sin x, cos x, with substitution", "es": "lím sin x, cos x, con sustitución"},
    49:  {"en": "Convergence, monotone bounded sequences", "es": "Convergencia, sucesiones monótonas acotadas"},
    50:  {"en": "Synthesis: 50 mixed limit problems", "es": "Síntesis: 50 problemas mixtos de límite"},
    51:  {"en": "f'(a) = lim (f(a+h)-f(a))/h, tangent line", "es": "f'(a) = lím (f(a+h)-f(a))/h, recta tangente"},
    52:  {"en": "(f+g)', (fg)', (f/g)', power rule", "es": "(f+g)', (fg)', (f/g)', regla de la potencia"},
    53:  {"en": "(f∘g)' = f'(g)·g'", "es": "(f∘g)' = f'(g)·g'"},
    54:  {"en": "F(x,y)=0, dy/dx", "es": "F(x,y)=0, dy/dx"},
    55:  {"en": "f''(x), f^(n)", "es": "f''(x), f^(n)"},
    56:  {"en": "(f⁻¹)'(y) = 1/f'(x)", "es": "(f⁻¹)'(y) = 1/f'(x)"},
    57:  {"en": "L(x) = f(a) + f'(a)(x-a), differentials", "es": "L(x) = f(a) + f'(a)(x-a), diferenciales"},
    58:  {"en": "Sliding ladder, volume of expanding sphere, etc.", "es": "Escalera deslizante, volumen de esfera que se expande, etc."},
    59:  {"en": "Continuity, corners, vertical tangents, cusps", "es": "Continuidad, esquinas, tangentes verticales, cúspides"},
    60:  {"en": "Synthesis: 60 mixed derivative problems", "es": "Síntesis: 60 problemas mixtos de derivada"},
    61:  {"en": "Critical points, 1st and 2nd derivative tests", "es": "Puntos críticos, criterios de 1.ª y 2.ª derivada"},
    62:  {"en": "Optimal box, minimum cost, applications", "es": "Caja óptima, costo mínimo, aplicaciones"},
    63:  {"en": "Increase/decrease intervals, concavity, inflection", "es": "Intervalos de crecimiento/decrecimiento, concavidad, inflexión"},
    64:  {"en": "0/0, ∞/∞ indeterminate forms", "es": "Formas indeterminadas 0/0, ∞/∞"},
    65:  {"en": "Pₙ(x) = Σ f^(k)(a)(x-a)ᵏ/k!, applications", "es": "Pₙ(x) = Σ f^(k)(a)(x-a)ᵏ/k!, aplicaciones"},
    66:  {"en": "f'', inflection points, sketching graphs", "es": "f'', puntos de inflexión, esbozo de gráficos"},
    67:  {"en": "Marginal cost, elasticity, applications", "es": "Costo marginal, elasticidad, aplicaciones"},
    68:  {"en": "v(t), a(t), motion problems", "es": "v(t), a(t), problemas de movimiento"},
    69:  {"en": "Iterative method for f(x) = 0", "es": "Método iterativo para f(x) = 0"},
    70:  {"en": "Synthesis: 50 mixed derivative-application problems", "es": "Síntesis: 50 problemas mixtos de aplicación de derivada"},
    71:  {"en": "Mean, median, mode — when each is appropriate", "es": "Media, mediana, moda — cuándo usar cada una"},
    72:  {"en": "σ², σ, dispersion, comparison of datasets", "es": "σ², σ, dispersión, comparación de conjuntos"},
    73:  {"en": "Q1, Q2, Q3, IQR, boxplots", "es": "Q1, Q2, Q3, IQR, diagramas de caja"},
    74:  {"en": "P(X=x), E[X], Var(X)", "es": "P(X=x), E[X], Var(X)"},
    75:  {"en": "B(n,p), success/failure trials", "es": "B(n,p), ensayos éxito/fracaso"},
    76:  {"en": "N(μ,σ²), z-scores, applications", "es": "N(μ,σ²), puntajes z, aplicaciones"},
    77:  {"en": "Distribution of sample means, intuitive proof", "es": "Distribución de medias muestrales, demostración intuitiva"},
    78:  {"en": "Pearson r, interpretation, caveats", "es": "Pearson r, interpretación, advertencias"},
    79:  {"en": "P(A|B), Bayes' theorem, applications", "es": "P(A|B), teorema de Bayes, aplicaciones"},
    80:  {"en": "Synthesis: 60 mixed statistics + probability problems", "es": "Síntesis: 60 problemas mixtos de estadística + probabilidad"},
    81:  {"en": "F'(x) = f(x), indefinite integral notation", "es": "F'(x) = f(x), notación de la integral indefinida"},
    82:  {"en": "∫ₐᵇ f(x) dx as Riemann sum limit", "es": "∫ₐᵇ f(x) dx como límite de suma de Riemann"},
    83:  {"en": "FTC parts 1 and 2, applications", "es": "TFC partes 1 y 2, aplicaciones"},
    84:  {"en": "u-substitution, change of variables", "es": "Sustitución por u, cambio de variables"},
    85:  {"en": "∫ u dv = uv - ∫ v du, LIATE", "es": "∫ u dv = uv - ∫ v du, LIATE"},
    86:  {"en": "Partial fraction decomposition, rational functions", "es": "Descomposición en fracciones parciales, funciones racionales"},
    87:  {"en": "∫ sin^n cos^m, ∫ sec^n tan^m, identities", "es": "∫ sin^n cos^m, ∫ sec^n tan^m, identidades"},
    88:  {"en": "Area between two curves, integration along y", "es": "Área entre dos curvas, integración respecto a y"},
    89:  {"en": "Disk method, shell method, revolution solids", "es": "Método del disco, método de los casquetes, sólidos de revolución"},
    90:  {"en": "Synthesis: 60 mixed integral problems", "es": "Síntesis: 60 problemas mixtos de integral"},
    91:  {"en": "y' = f(x,y), order, separability", "es": "y' = f(x,y), orden, separabilidad"},
    92:  {"en": "y' = g(x)h(y), solution by integration", "es": "y' = g(x)h(y), solución por integración"},
    93:  {"en": "y' + p(x)y = q(x), integrating factor", "es": "y' + p(x)y = q(x), factor integrante"},
    94:  {"en": "Exponential growth, logistic, predator-prey", "es": "Crecimiento exponencial, logístico, depredador-presa"},
    95:  {"en": "ay'' + by' + cy = 0, characteristic equation", "es": "ay'' + by' + cy = 0, ecuación característica"},
    96:  {"en": "Spring-mass, free, damped, forced oscillations", "es": "Masa-resorte, oscilaciones libres, amortiguadas, forzadas"},
    97:  {"en": "Resistor + inductor + capacitor circuits, analogy with springs", "es": "Circuitos resistor + inductor + capacitor, analogía con resortes"},
    98:  {"en": "yₙ₊₁ = yₙ + h·f(xₙ,yₙ), error analysis", "es": "yₙ₊₁ = yₙ + h·f(xₙ,yₙ), análisis de error"},
    99:  {"en": "dT/dt = -k(T-Tₐ), real-world application", "es": "dT/dt = -k(T-Tₐ), aplicación al mundo real"},
    100: {"en": "Synthesis: 50 mixed ODE problems", "es": "Síntesis: 50 problemas mixtos de EDO"},
    101: {"en": "Random sampling, bias, sample size", "es": "Muestreo aleatorio, sesgo, tamaño muestral"},
    102: {"en": "x̄ ± z·σ/√n, interpretation", "es": "x̄ ± z·σ/√n, interpretación"},
    103: {"en": "H₀, H₁, p-value, type I and II errors", "es": "H₀, H₁, valor p, errores de tipo I y II"},
    104: {"en": "When to use z vs t, degrees of freedom", "es": "Cuándo usar z vs t, grados de libertad"},
    105: {"en": "y = β₀ + β₁x, least squares, R²", "es": "y = β₀ + β₁x, mínimos cuadrados, R²"},
    106: {"en": "y = β₀ + β₁x₁ + ... + βₖxₖ, applications", "es": "y = β₀ + β₁x₁ + ... + βₖxₖ, aplicaciones"},
    107: {"en": "Compare more than two means, F-statistic", "es": "Comparar más de dos medias, estadístico F"},
    108: {"en": "Independence test, goodness of fit", "es": "Prueba de independencia, bondad de ajuste"},
    109: {"en": "Prior, likelihood, posterior, Bayesian inference", "es": "Previa, verosimilitud, posterior, inferencia bayesiana"},
    110: {"en": "Synthesis: 60 mixed inference problems", "es": "Síntesis: 60 problemas mixtos de inferencia"},
    111: {"en": "Vectors as elements of a vector space, axioms", "es": "Vectores como elementos de un espacio vectorial, axiomas"},
    112: {"en": "T: V → W, matrix representation", "es": "T: V → W, representación matricial"},
    113: {"en": "ker(T), im(T), rank-nullity theorem", "es": "ker(T), im(T), teorema del rango-nulidad"},
    114: {"en": "det(A - λI) = 0, geometric interpretation", "es": "det(A - λI) = 0, interpretación geométrica"},
    115: {"en": "A = PDP⁻¹, when diagonalizable, applications", "es": "A = PDP⁻¹, cuándo es diagonalizable, aplicaciones"},
    116: {"en": "Symmetric, orthogonal, projection matrices", "es": "Matrices simétricas, ortogonales, de proyección"},
    117: {"en": "A = UΣVᵀ, applications, intuition", "es": "A = UΣVᵀ, aplicaciones, intuición"},
    118: {"en": "Eigendecomposition of covariance, dimensionality reduction", "es": "Eigendescomposición de covarianza, reducción de dimensionalidad"},
    119: {"en": "Heat equation, change of variables, normal distribution", "es": "Ecuación del calor, cambio de variables, distribución normal"},
    120: {"en": "40 problems from Years 1–3", "es": "40 problemas de los Años 1–3"},
}

# -- 6. Emit the generated TS file -------------------------------------
out_path = ROOT / "src/content/programa-em-licao-i18n.generated.ts"

def ts_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")

lines = [
    "/**",
    " * AUTO-GENERATED by scripts/generate-licao-i18n.py — do not edit by hand.",
    " * To refresh: rerun the script.",
    " *",
    " * Maps each lesson number (1..120) to its translated title and topics.",
    " * Source of truth: PT-BR PROGRAMA_EM + per-locale MDX frontmatter titulos.",
    " */",
    "import type { Locale } from '@/lib/i18n/locales'",
    "",
    "type LocaleMap = Partial<Record<Locale, string>>",
    "",
    "export const LICAO_TITULO_I18N: Record<number, LocaleMap> = {",
]
for num in sorted(lessons.keys()):
    pt = lessons[num]["titulo"]
    parts = [f"'pt-BR': '{ts_escape(pt)}'"]
    for code, _ in LOCALES_FROM_MDX:
        if num in titulo_by_locale[code]:
            parts.append(f"{code}: '{ts_escape(titulo_by_locale[code][num])}'")
    lines.append(f"  {num}: {{ {', '.join(parts)} }},")
lines.append("}")
lines.append("")
lines.append("export const LICAO_TOPICOS_I18N: Record<number, LocaleMap> = {")
for num in sorted(lessons.keys()):
    pt = lessons[num]["topicos"]
    parts = [f"'pt-BR': '{ts_escape(pt)}'"]
    if num in TOPICOS_I18N:
        if "en" in TOPICOS_I18N[num]:
            parts.append(f"en: '{ts_escape(TOPICOS_I18N[num]['en'])}'")
        if "es" in TOPICOS_I18N[num]:
            parts.append(f"es: '{ts_escape(TOPICOS_I18N[num]['es'])}'")
    lines.append(f"  {num}: {{ {', '.join(parts)} }},")
lines.append("}")
lines.append("")
lines.append("/** Helper: title for a lesson, with PT-BR fallback. */")
lines.append("export function licaoTitulo(num: number, locale: Locale, fallback: string): string {")
lines.append("  return LICAO_TITULO_I18N[num]?.[locale] ?? LICAO_TITULO_I18N[num]?.['pt-BR'] ?? fallback")
lines.append("}")
lines.append("")
lines.append("/** Helper: topicos for a lesson, with PT-BR fallback. */")
lines.append("export function licaoTopicos(num: number, locale: Locale, fallback: string): string {")
lines.append("  return LICAO_TOPICOS_I18N[num]?.[locale] ?? LICAO_TOPICOS_I18N[num]?.['pt-BR'] ?? fallback")
lines.append("}")

out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"✅ Wrote {out_path.relative_to(ROOT)}  ({len(lessons)} lessons)")
