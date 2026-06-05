# Translate a regenerated lesson PT-BR → en-US — agent instructions

**AUTHORIZED.** Translate ONE lesson from its current PT-BR source into en-US,
overwriting the stale en-US file. The PT-BR banks were just re-sourced from the
open-book corpus; the en-US copy must mirror them exactly, in English.

## Inputs (in the spawning prompt)
- SOURCE (PT-BR): `content/aulas/…/licao-NN-….mdx` (or `content/engenharia/…` for Cálculo)
- TARGET (en-US): the same path under `content/i18n/en-US/…` — OVERWRITE it.

## Method
1. Read the SOURCE fully.
2. Write the TARGET as a faithful English translation with the SAME structure,
   same number of `<Exercicio>`, same order, same components.

## Translate (natural language only)
- Frontmatter: `titulo`, `descricao` → English. Keep `atualizadoEm`.
- Door bodies (`<Porta>`), `<EquacaoCanonica>` `legenda` + `audioTexto`, worked
  examples (`<Exemplo>`) prose, exercise `enunciado` (markdown body), `solucao`,
  `passos`, and option `texto` natural-language parts → English.

## Keep VERBATIM (do NOT translate / change)
- Frontmatter: `slug`, `categoria`, `subcategoria`, `ordem`, `publicado`, `tags`,
  `prerrequisitos`, `autores`, `versao`.
- Every `fonte={{ … }}` block — byte-identical (livro/url/secao/exercicio/licenca
  are language-neutral).
- All math: `$…$`, `<Eq>{`…`}</Eq>`, LaTeX, numbers, variable names.
- Component/tag names (Exercicio, Eq, ListaExercicios, Porta, …) and ALL props
  (`numero`, `dificuldade`, `correta`, `seed`, `nivel`, …).
- The `correta: true` flag stays on the SAME option.

## MDX rules (same as authoring — build breaks otherwise)
- Option `texto` is a STRING → math as `$…$` (never `<Eq>` inside the string).
- `<Eq>{`…`}</Eq>` keeps doubled backslashes. Multi-line `<Exercicio>` with blank
  lines around the body. No bare `{ident}` / `<` / `>` in JSX text. Close every tag.
- Component names stay in PT (Exemplo/Exercicio — never Example/Exercise).

## Verify (required)
`node scripts/check-mdx-render.mjs <TARGET>` MUST print `fail=0`, and
`grep -c '<Exercicio' TARGET` == `grep -c '<Exercicio' SOURCE`. Fix until clean.
Report: exercise count match, render result.
