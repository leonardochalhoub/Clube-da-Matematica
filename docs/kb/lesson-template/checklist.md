# Pre-merge checklist for any new lesson

Run through this list before opening a PR / merging an authored lesson.
Every item maps to a hard rule in the template. Skip none.

## Structure

- [ ] Frontmatter complete: `titulo` starts with `Lição N —`, `slug` is
      `licao-NN-slug`, `subcategoria` matches `ano-X-trim-Y`, `prerrequisitos`
      lists prior lessons.
- [ ] `<EquacaoCanonica>` with `formula`, `legenda`, and **`audioTexto`**
      (accessibility — never skip).
- [ ] `<aside>` block with **exactly 3 books** that cover the topic, right
      under `<EquacaoCanonica>`.
- [ ] `<DuasPortas>` with all 7 doors filled (formal + 5 + 10 + 15 + 25 +
      40 + prática). Each door has substantive content matching its level.
- [ ] `## Exemplos resolvidos` with **exactly 5 `<Exemplo>` blocks**,
      ascending difficulty, each ending with `**Fonte.** [...](url) — licença Y`.
- [ ] `<ListaExercicios seed="licao-NN-slug">` with 30–80 `<Exercicio>` blocks.
- [ ] `## Fontes` bibliography lists every book cited above.

## Per-exercise hygiene

For **every** `<Exercicio>`:

- [ ] Has `numero="NN.M"`, `dificuldade=...`.
- [ ] Has `solucao={<>...</>}`.
- [ ] Has `fonte={{ livro, url, ..., licenca }}` pointing to a real open
      book — **AI never invents exercises**.
- [ ] If short-answer (single number, set, interval): use `opcoes={[...]}`
      with one correct + 3 distractors that reflect common student mistakes.
      Never leave just `resposta=` without `opcoes`.
- [ ] Statement is Wolfram-friendly: short imperative, math in `$...$`,
      no "expresse a resposta em intervalo" trailing fluff (the regex
      pipeline strips most of these but cleaner statements give cleaner
      links).

For **~25% of exercises** (curated selection — 1 per blocos, varying
difficulties):

- [ ] Has `passos={<>...</>}` with a numbered `<ol>` walkthrough that
      explains the *thinking*, not just the steps. End with one `<em>`
      paragraph ("Macete", "Atalho mental", "Observação", "Curiosidade").

## MDX syntax

See [`./mdx-syntax-traps.md`](./mdx-syntax-traps.md) for full list. Quick checks:

- [ ] No `$x < 5$` / `$\{...\}$` directly inside JSX expression bodies
      (`solucao={<>...}`, `passos={<>...}`, `legenda={<>...}`). Wrap in
      `<Eq>{`...`}</Eq>`.
- [ ] No `$$...$$` blocks inside JSX expression bodies. Use `<Eq>` with the
      whole expression (cases environment included).
- [ ] No `$...$` inside `titulo="..."` of `<Exemplo>` / `<Definicao>` /
      `<Teorema>` (HTML attribute, not parsed). Use Unicode like `|u| ≤ c`.
- [ ] No bare `1{,}5` outside math context (MDX reads `{,}` as JSX
      expression). Wrap as `$1{,}5$` or `1,5` (using Brazilian comma
      directly works in prose).
- [ ] Every `\` in `<Eq>{`...`}</Eq>` template literal is doubled (`\\leq`).
- [ ] OpenStax / Stitz-Zeager / Hammack citations in markdown blockquotes
      (`> "..." — [Book](url)`) use **single** backslashes for math
      (`\{...\}`), not doubled.

## Build + run

- [ ] `npm run typecheck` passes.
- [ ] `npm run validate-content` passes.
- [ ] Lesson page loads on local dev (`http://localhost:PORT/aulas/...`).
- [ ] Visual spot-check: SVGs visible in light + dark mode, MC options
      render, "Ver solução" + "Ver passo a passo" buttons appear and
      expand correctly, "Resolver online" lands on a clean Wolfram query
      (not "Wolfram doesn't understand").

## Accessibility

- [ ] `<EquacaoCanonica>` has `audioTexto`.
- [ ] All key body equations have `audioTexto` (so the page reader uses
      authored prose instead of the LaTeX-to-prose fallback).
- [ ] No `<input type="text">` for student answers — notebook-first rule.
