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
- [ ] **No `Exemplo N —` prefix in `titulo=`** — the component renders the
      number automatically. Use `titulo="Topic name (level)"` not
      `titulo="Exemplo 1 — Topic name (level)"`.
- [ ] `<ListaExercicios seed="licao-NN-slug">` with 30–80 `<Exercicio>` blocks.
- [ ] `## Fontes` bibliography lists every book cited above.

## Per-exercise hygiene — HARD RULES

**The owner has spelled these out repeatedly. Zero tolerance for violations.**

For **every** `<Exercicio>`:

- [ ] **`fonte={{ livro, url, ..., licenca }}` is mandatory.** AI **never** invents exercises or examples — every one is sourced from one of the open-licensed books in `livros/CATALOG.md` (OpenStax, Stitz-Zeager, Hammack, Yoshiwara, Active Calculus, Wikilivros). Prefer URLs that deep-link to the exact page/section/exercise. If you can't find a sourced exercise for a topic, **delete the exercise** — never write one without a citation.
- [ ] **`solucao={<>...</>}` is mandatory.** Every exercise renders a "Ver solução" button. Universal — no exercise without a solution.
- [ ] Has `numero="NN.M"`, `dificuldade=...`.
- [ ] **The student NEVER types into the site — only clicks.** Every exercise must be answerable by clicking. No `<input>` text fields anywhere. The Exercicio component already enforces this. **CRITICAL: "click only" does NOT mean "everything must be multiple choice."** The default click mechanism for a practice exercise is the "Ver solução" button — student attempts on paper, clicks to reveal the worked solution. Pick the right mechanism per exercise:
  - **Pure "Ver solução"** — DEFAULT for practice (~50–60% of a lesson). Compute, derive, find domain, evaluate, integrate — student does the math on paper, clicks to compare reasoning. Author writes only `solucao={<>...</>}` (no `opcoes`, no `resposta`).
  - **`resposta="..."` reveal** (~25–35%) — single-answer items where the result is a discrete number, set, interval, or short symbolic expression. Student clicks "Ver resposta" to confirm just the final value.
  - **Multiple choice** `opcoes={[{texto, correta:true}, {texto}, {texto}, {texto}]}` (~5–10% CAP) — reserved for **conceptual discrimination only**. The four options must reflect *specific common mistakes* (off-by-one, wrong domain restriction, sign error). NEVER use MC for arithmetic drill — it short-circuits the computation.
  - **Demonstração** (`dificuldade="demonstracao"`, ~5–10%) — proofs, "show that", derivations. Only `solucao`.
  - **Never leave an exercise with no `solucao`** — every exercise needs at minimum the Ver solução button to work.

### The MC trap — read this before authoring

It is tempting to default to MC because "the student must click something." That is wrong. In L1 (the canonical template) only **3 of 54 exercises** are MC; **30 are pure Ver solução** caderno-first. If you find yourself authoring 50 MC items, stop — you are pattern-matching on the wrong rule. See [`feedback-no-typing.md`](../../../../.claude/projects/-home-leochalhoub-Clube-da-Matematica/memory/feedback-no-typing.md) for the full explanation. **L2 was first written with 49/50 MC and had to be rebalanced** — don't repeat that mistake.

### When MC is right (the 5–10% that earn it)

A good MC item: correct answer not obvious from glancing; each distractor maps to a specific common mistake; student learns from seeing why wrong options are wrong.

GOOD: "Qual é o domínio máximo de $f(x) = \sqrt{x-3}/(x-5)$? A) $[3, +\infty)$ — esqueceu o denominador. B) $(3, +\infty) \setminus \{5\}$ — usou aberto na raiz. C) $[3, 5) \cup (5, +\infty)$ — correto. D) $\mathbb{R} \setminus \{5\}$ — esqueceu a raiz."

BAD: "Calcule $f(2)$ se $f(x) = 3x+1$. A) 6 B) 7 C) 8 D) 5." → backsolvable in 2 seconds. Should be `resposta="7"` or pure Ver solução.
- [ ] Statement is Wolfram-friendly: short imperative, math in `$...$`, no "expresse a resposta em intervalo" trailing fluff.

For **~25% of exercises** (curated selection — 1 per bloco, varying
difficulties):

- [ ] Has `passos={<>...</>}` with a numbered `<ol>` walkthrough.
- [ ] Each `<li>` has prose that explains the *thinking*, not just the action — the student must understand WHY this step, not just what to do.
- [ ] As many `<li>` as needed to walk through the reasoning fully.
- [ ] Closing `<em>Macete:</em>` / `<em>Atalho mental:</em>` / `<em>Observação:</em>` / `<em>Curiosidade:</em>` paragraph.

## SVG figures inside MDX — HARD RULE

**Never use `.map()` returning JSX inside `<svg>` blocks in MDX.** The next-mdx-remote/rsc compiler doesn't fully evaluate JSX expressions with `.map()` + computed positions, so figures render as empty boxes above their captions.

**Always expand to explicit `<g>` blocks** — one per item. Static JSX only. Same for `<Equation>` content: pass plain string children (no template-literal expressions) when possible, or wrap rich content in raw `<svg>` static markup.

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
