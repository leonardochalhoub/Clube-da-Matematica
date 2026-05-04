# Wolfram Alpha — Query Cookbook for Clube da Matemática

> Practical patterns we use across lessons. Each entry shows:
> - **Lesson scenario** (what the exercise asks).
> - **Bad query** (what naive PT-BR + LaTeX would produce).
> - **Good query** (what Wolfram actually understands — and what our
>   `latexToWolfram` + `ptToEn` pipeline should output).
>
> When in doubt, test the link by clicking it. A working query returns
> structured results; a broken query returns "Wolfram|Alpha doesn't understand
> your query" or natural-language fallback noise.

---

## 1. Set theory & intervals (Trim 1, Lesson 1)

### Set operations on listed sets
- Lesson: `Calcule {1,2,3,4,5} ∩ {4,5,6,7}`.
- Bad: `{1,2,3,4,5} \cap {4,5,6,7}` (Unicode/LaTeX `\cap` is fragile).
- **Good:** `{1, 2, 3, 4, 5} intersection {4, 5, 6, 7}`.
- Wolfram example: `(A union B) intersect C`, `symmetric difference of S and T`.

### Interval intersection
- Lesson: `Calcule [3,10] ∩ (1,7)`.
- Bad: `[3,10] intersection (1,7)` (Wolfram parses brackets as 2D vectors).
- **Good:** `solve x in [3,10] and x in (1,7)`
  or equivalently `solve 3 <= x <= 10 and 1 < x < 7`.
- Why: the inequality form is the canonical Wolfram input for intervals.

### Inequality with absolute value
- Lesson: `Resolva |2x - 3| ≤ 5`.
- **Good:** `solve |2x - 3| <= 5`.
- Wolfram example: `solve x^2 + 4x + 6 = 0` (same `solve` verb).

### De Morgan / set identity check
- Lesson: `Verifique (A ∪ B)^c = A^c ∩ B^c`.
- **Good:** `is (A union B)' = (A') intersect (B')`.
- Wolfram literally lists this query: `is (A union B)'=(A') intersect (B')`.

### Membership
- Lesson: `√2 é racional?`
- **Good:** `Is sqrt(2) an irrational number?`.
- Wolfram example: `Is cbrt(3) an irrational number?`.

### Inclusion–exclusion (counting in unions)
- Lesson: 80% leem A, 40% leem B, 30% leem ambos. Quem lê algum?
- **Good:** `0.8 + 0.4 - 0.3` — Wolfram does percent arithmetic directly.
- Or: `probability of the union of three events` (returns the formula).

---

## 2. Algebra (Trim 1–2)

### Solve polynomial equation
- Lesson: `Resolva x² - 5x + 6 = 0`.
- **Good:** `solve x^2 - 5x + 6 = 0`.
- Wolfram template: `solve x^2 + 4x + 6 = 0`.

### Solve system
- Lesson: `Resolva 2x + y = 5 e x - y = 1`.
- **Good:** `solve 2x + y = 5 and x - y = 1` or `2x+y=5, x-y=1`.

### Solve inequality
- Lesson: `Resolva x² - x - 6 > 0`.
- **Good:** `solve x^2 - x - 6 > 0`.

### Factor polynomial
- Lesson: `Fatore 2x³ - 5x² + 4x - 1`.
- **Good:** `factor 2x^3 - 5x^2 + 4x - 1`.

### Expand
- Lesson: `Expanda (x + y)^5`.
- **Good:** `expand (x + y)^5`.

### Simplify expression
- Lesson: `Simplifique 1/(1+√2)`.
- **Good:** `simplify 1/(1+sqrt(2))` (or just `1/(1+sqrt(2))` — Wolfram rationalizes automatically).

### Domain & range
- Lesson: `Domínio de f(x) = 1/(x²-1)`.
- **Good:** `domain of f(x) = 1/(x^2-1)`.
- Or: `domain and range of y = x^2 + 4x + 3`.

---

## 3. Functions & graphs (Trim 1–4)

### Plot a function
- **Good:** `plot x^3 - 6x^2 + 4x + 12`.
- Range: `plot e^x from x=0 to 10`.
- Multiple: `plot sin x, cos x, tan x`.

### Plot inequality region
- **Good:** `plot x^2+y^2<1 and y>x`.

### Parametric / polar
- **Good:** `parametric plot (cos t, sin 2t), t=0..2pi`.
- **Good:** `polar plot r=1+cos theta`.

### Number line
- **Good:** `number line x^2>5, 0<=x<3`.

### Y-intercept / roots
- **Good:** `y-intercept of y = -4x + 2`.
- **Good:** `roots of x^2 - 5x + 6` (or `solve x^2-5x+6=0`).

---

## 4. Calculus (Trim 5–10)

### Limits
- **Good:** `lim (sin x)/x as x->0`.
- One-sided: `lim x/|x| as x->0+`.
- Infinity: `limit (1+1/n)^n as n->infinity`.

### Derivatives
- **Good:** `derivative of x^4 sin x`.
- Higher order: `second derivative of sin(2x)`.
- Partial: `d/dx x^2 y^4`.

### Integrals
- **Good:** `integrate x^2 sin x dx`.
- Definite: `integrate sin x dx from x=0 to pi`.
- Improper: `int sinx/x dx, x=0..infinity`.

### Critical points / extrema
- **Good:** `inflection points of x+sin(x)`.
- **Good:** `maximize x(1-x)e^x`.
- **Good:** `compute the area between y=|x| and y=x^2-6`.

### Taylor / series
- **Good:** `taylor series sin x`.
- At a point: `series (sin x)/(x-pi) at x=pi to order 10`.

### Sums
- **Good:** `sum j^2, j=1 to 100`.
- Infinite: `sum (3/4)^j, j=0..infinity`.

---

## 5. Trigonometry (Trim 4–7)

### Compute trig value
- **Good:** `sin(pi/5)`, `tan(60 deg)`, `arcsin(1/2)`.

### Trig identity
- **Good:** `expand sin(x+y)`, `expand sin 4x`, `factor sin x + sin y`.

### Solve trig equation
- **Good:** `solve sin x + cos x = 1`.

### Triangle theorems
- **Good:** `Pythagorean theorem a=10, b=24`.
- **Good:** `law of sines a=6cm, b=8cm, alpha=40deg`.

---

## 6. Probability & combinatorics (Trim 6–9)

### Combinations
- **Good:** `30 choose 18`.

### Bernoulli / binomial
- **Good:** `probability of 8 successes in 14 trials with p=.6`.

### Birthday paradox
- **Good:** `birthday paradox 50 people`.

### Distribution properties
- **Good:** `normal distribution, mean=0, sd=2`.
- **Good:** `Poisson distribution`.

### Conditional
- **Good:** `P(A given B) if P(A) = 1/2, P(B) = 1/3, P(A and B) = 1/4`.

---

## 7. Statistics (Trim 7–10)

### Descriptive stats
- **Good:** `mean {21.3, 38.4, 12.7, 41.6}`.
- **Good:** `median {19, 20, 14, 18, 19, 21, 17}`.
- **Good:** `box plot {19, 20, 27, 13, 16, 27, 14, 22}`.

### Regression
- **Good:** `linear fit {1.3, 2.2}, {2.1, 5.8}, {3.7, 10.2}, {4.2, 11.8}`.

### Inference
- **Good:** `t-interval xbar=4.15, s=0.32, n=100`.

---

## 8. Linear algebra (Trim 11)

### Vector operations
- **Good:** `{1/4, -1/2, 1} cross {1/3, 1, -2/3}`.

### Linear independence
- **Good:** `linear independence (1, 3, -2), (2, 1, -3), (-3, 6, 3)`.

### Matrix operations
- **Good:** `{{2, -1}, {1, 3}} . {{1, 2}, {3, 4}}` (dot for multiplication).
- **Good:** `eigenvalues {{4,1},{2,-1}}`.
- **Good:** `row reduce {{2, 1, 0, -3}, {3, -1, 0, 1}}`.

---

## 9. Numbers (any trim)

### Factorize
- **Good:** `factor 70560`.

### Divisors / GCD
- **Good:** `divisors 3600`, `gcd 24, 36, 48, 60`.

### Primes
- **Good:** `primes <= 100`, `1,000,000th prime`.

### Base conversion
- **Good:** `1275 to base 7`, `100011010 base 2`.

### Number type checks
- **Good:** `Is sqrt(2)^sqrt(2) transcendental?`.
- **Good:** `is sqrt(13) irrational?`.

### Continued fraction
- **Good:** `continued fraction sqrt(2)`.

---

## 10. Differential equations (Trim 8–10)

### Linear ODE
- **Good:** `y'' + y = 0`.
- With IC: `y'' + y = 0, y(0)=2, y'(0)=1`.

### Inhomogeneous
- **Good:** `y'' + y = sin t`.

### Numerical
- **Good:** `Runge-Kutta method, dy/dx = -2xy, y(0) = 2, from 1 to 3, h = .25`.

---

## 11. Things that DON'T work (avoid)

- **Pure proof requests.** "Demonstre/Prove/Mostre que…" — Wolfram does not
  prove theorems. Our pipeline already detects these (`eDemonstracao()`) and
  hides the link.
- **Set notation with `\setminus` left as backslash.** Always convert to
  `setminus` keyword.
- **Mixed PT-BR + LaTeX.** "Calcule a derivada de f(x) = ..." should arrive
  at Wolfram as `derivative of x^...` — the verb plus the symbolic part,
  PT artigos stripped.
- **Bracket notation for ordered tuples vs intervals.** `[3, 7]` is ambiguous:
  Wolfram may read it as "vector". Use `solve 3 <= x <= 7` or
  `interval from 3 to 7` for clarity.
- **Curly braces inside text.** MDX template literals need `\\{`, but the
  query that ARRIVES at Wolfram should have plain `{` `}`. The pipeline
  strips chained braces — single-pair is OK (`{1,2,3}` is a set).
- **Unicode operators.** Send ASCII (`*` not `×`, `<=` not `≤`).
  Our pipeline does this conversion; don't fight it.

---

## 12. Pipeline cheat-sheet (`src/components/math/ListaExercicios.tsx`)

The function `wolframUrl(enunciadoTexto)` runs:

1. **`eDemonstracao()`** — if the statement starts with `Demonstre`, `Prove`,
   `Mostre`, return `null` (no Wolfram link rendered).
2. **`nodeToString()`** — pulls the LaTeX out of the MathML `<annotation>`
   tag KaTeX emits, ignoring the visual `katex-html` (which would duplicate).
3. **`latexToWolfram()`** — maps:
   - `\subseteq` → `subset of`, `\cup` → `union`, `\cap` → `intersection`
   - `\leq` → `<=`, `\neq` → `!=`, `\geq` → `>=`
   - `\frac{a}{b}` → `(a)/(b)`
   - `\int_a^b` → `integrate from a to b of`
   - `\sum_{i=1}^n` → `sum from i=1 to n of`
   - Greek letters → spelled out (`\pi` → `pi`, `\alpha` → `alpha`)
4. **`ptToEn()`** — strips PT-BR imperatives, converts technical phrases:
   - `Calcule` / `Resolva` / `Determine` → dropped.
   - `pontos críticos de` → `critical points of`.
   - `derivada de` → `derivative of`.
   - `domínio de` → `domain of`.
   - `de X a Y` → `from X to Y`.
   - `se ... então` → `if ... then`.
5. **Truncate to 400 chars**, URL-encode, append to
   `https://www.wolframalpha.com/input?i=`.

**To extend support for a new pattern:** add the regex to
`LATEX_TO_WOLFRAM` (LaTeX-side) or `PT_TO_EN_PHRASES` (Portuguese-side) in
the same file.
