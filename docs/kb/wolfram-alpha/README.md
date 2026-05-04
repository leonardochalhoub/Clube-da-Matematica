# Wolfram Alpha — Query Knowledge Base

> **Purpose.** Capture the **canonical query syntax** Wolfram Alpha understands across all
> mathematics subdomains, so we can author lesson exercises whose
> **"Resolver no Wolfram"** links actually work end-to-end.
>
> **Source.** `https://www.wolframalpha.com/examples/mathematics/` and all 21 of its
> subcategory pages, fetched 2026-05-04. Examples below are the literal query
> strings Wolfram itself shows in its example boxes — i.e. **guaranteed-parseable input.**
>
> **How to use.** When writing an exercise statement, **mentally translate**
> the question into one of these query shapes. The pipeline at
> `src/components/math/ListaExercicios.tsx` (`latexToWolfram` + `ptToEn`) already
> handles many cases automatically (LaTeX → ASCII, PT → EN), but it is much
> more reliable when the source LaTeX/text already maps onto these shapes.

## Wolfram's official "Could not parse" tips

When Wolfram returns **"Wolfram|Alpha doesn't understand your query"** it shows
this exact list of recovery tips on the page:

> Try the following:
> - Use different phrasing or notations
> - Enter whole words instead of abbreviations
> - Avoid mixing mathematical and other notations
> - Check your spelling
> - **Give your input in English**
>
> Other tips:
> - Wolfram|Alpha answers **specific questions**, not general explanations
>   (e.g. `2 cups of sugar`, not `nutrition information`)
> - Only **objective facts** (e.g. `highest mountain`, not `most beautiful painting`)
> - Only **what is known is known** (e.g. `how many men in Mauritania`, not
>   `how many monsters in Loch Ness`)
> - Only **public information** (e.g. `GDP of France`, not `home phone of Michael Jordan`)

Practical translation for our pipeline:
- **English-only on the wire.** Our `ptToEn` strips PT-BR imperatives and
  converts technical phrases. If you find a PT-BR word still in the query, add
  it to `PT_TO_EN_PHRASES` in `ListaExercicios.tsx`.
- **No mixed notation.** Don't ship `\{x \in \mathbb{N}\}` raw — convert to
  `{x in N}` (set + keyword). The `latexToWolfram` table handles `\in`,
  `\mathbb{...}`, etc.; the recent fix preserves `\{` `\}` as `{` `}` instead
  of stripping them.
- **Whole words.** Prefer `union` over `U`, `intersection` over `n`, `infinity`
  over `inf`.
- **Specific over general.** A query like `solve x^2 + 5x + 6 = 0` works;
  `quadratic equations` doesn't return useful structured data.

## Hard rules Wolfram cares about

1. **English imperative verbs.** `solve`, `factor`, `simplify`, `expand`, `integrate`,
   `differentiate`, `plot`, `lim`, `sum`, `product` — Wolfram will fall back to
   "natural language" if it doesn't see a verb, and that path is fragile.
2. **ASCII operators.** `*`, `/`, `^`, `<=`, `>=`, `!=` — never the Unicode
   versions. Our `latexToWolfram` already swaps `\leq` → `<=` etc.
3. **Set/logic keywords.** `union`, `intersection`, `setminus`, `subset of`, `iff`,
   `implies`, `for all`, `there exists`. Curly-brace literals work too: `{1,2,3} union {4,5}`.
4. **Intervals.** Wolfram's interval support is fragile. Prefer
   `solve x in [3,10] and x in (1,7)` over `[3,10] intersection (1,7)` — the
   latter is sometimes parsed as 2D point intersection. For
   inequality-driven intervals, send the inequality directly: `solve |2x-3|<=5`.
5. **No PT-BR words on the wire.** `ptToEn` strips `Calcule`, `Resolva`,
   `Determine`, etc., and converts `pontos críticos de`, `derivada de`,
   `domínio de`, `integral de` into their English equivalents.
   New PT terms? Extend the table.
6. **Length budget.** We truncate at 400 chars (URL-encoded queries get long fast).

## Files

- [`mathematics-examples.md`](./mathematics-examples.md) — full dump of every
  example query Wolfram lists across all 21 mathematics subcategories,
  organized by topic.
- [`query-cookbook.md`](./query-cookbook.md) — short cookbook of the patterns
  we actually use in lessons (set theory, intervals, calculus, algebra),
  cross-referenced with the source examples.
