# Prompt to brief an authoring agent (Gemini / Haiku / Groq / Sonnet subagent)

Use this exact briefing when delegating authoring of a lesson — or part of
a lesson (e.g. "add 5 more passos to lesson 12") — to a cheap agent. Paste
it as the `prompt` parameter when invoking the Agent tool.

## Briefing template

> You are authoring [PART OF / ALL OF] **Lição NN — [TOPIC]** for the Clube
> da Matemática curriculum. The canonical template is
> `content/aulas/ano-1/trim-1/licao-01-conjuntos-intervalos.mdx`. **Read
> it first.** Match its structure section by section.
>
> **Canonical KB:** `docs/kb/lesson-template/anatomy.md` and
> `docs/kb/lesson-template/checklist.md` — read both before writing.
>
> **MDX syntax traps:** `docs/kb/lesson-template/mdx-syntax-traps.md` —
> required reading. The most common build-killers:
> - `$x < 5$` inside `solucao={<>...</>}` → wrap in `<Eq>{`x < 5`}</Eq>`.
> - `$\{1,2,3\}$` inside JSX → wrap in `<Eq>{`\\{1,2,3\\}`}</Eq>`.
> - `$$...$$` blocks inside JSX → wrap in `<Eq>` template literal.
> - `$...$` inside HTML attributes (`titulo=`) → use Unicode `≤`, `∞`, `∪`.
> - Doubled backslashes inside `<Eq>` template literals (`\\leq`).
>
> **Wolfram-friendly statements:** read
> `docs/kb/wolfram-alpha/query-cookbook.md`. Exercise statements should
> translate cleanly to a Wolfram query after our `latexToWolfram` +
> `ptToEn` pipeline runs (in `src/components/math/ListaExercicios.tsx`).
>
> **Books are the ledger.** AI never invents exercises or examples.
> Every `<Exercicio>` and `<Exemplo>` must have a `fonte={{ livro, url,
> secao, exercicio, licenca }}` (or `**Fonte.**` for examples) pointing to
> a real open-licensed book in `livros/CATALOG.md`. If you can't find a
> source for a topic — pick a different topic that IS sourced.
>
> **Hard quotas (do not deviate):**
> - **5 worked examples** in `## Exemplos resolvidos`, ascending difficulty.
> - **30–80 exercises** total in `<ListaExercicios>`. Aim for 60.
> - **Every exercise** has `solucao` + `fonte` + (if short-answer)
>   `opcoes={[...]}`.
> - **~25% of exercises** have `passos={<>...</>}` — multi-step
>   walkthroughs explaining the *thinking*, not just the answer. Choose them
>   for pedagogical breadth (1 per blocos, varying difficulties).
> - **3 books in the `<aside>`** at top of lesson.
> - **All books cited** repeated in `## Fontes` at the bottom.
> - **`audioTexto`** mandatory on `<EquacaoCanonica>`.
>
> **Difficulty mix per `<ListaExercicios>`:**
> - ~60% `aplicacao` (drill)
> - ~15% `compreensao` (conceitual)
> - ~15% `modelagem` (real-world)
> - ~10% `desafio` / `demonstracao` (proof / olímpico)
>
> **No `<input type="text">` anywhere.** Notebook-first: students solve
> on paper. Single-answer questions are multiple choice; longer questions
> show only "Ver solução" / "Ver passo a passo" via `<details>` buttons.
>
> **Tone:** Brazilian engineering school standard. Direct, dense, no
> filler. The 5-year-old door is simple but never patronizing. The
> 40-year-old door is technical but never pretentious. Cite sources
> explicitly — plagiarism is automatic rejection.
>
> When done, run `npm run typecheck && npm run validate-content`. Report
> back: what you authored (counts), and the result of typecheck +
> validation.

## Per-task variants

### Adding `passos` to existing exercises

> Read `content/aulas/ano-X/trim-Y/licao-NN-slug.mdx`. The exercises
> already have `solucao` and `fonte` set. Add `passos={<>...</>}` between
> `solucao` and `fonte` for these specific exercise numbers: [LIST]. Each
> walkthrough should be 4-6 numbered `<li>` steps explaining the
> *thinking*, ending with one `<em>` tip ("Macete", "Atalho mental",
> "Observação", "Curiosidade"). Match the tone of existing passos in lesson
> 1: 1.1, 1.7, 1.13, 1.14, 1.18, 1.25, 1.27. Read those for reference.
>
> **Critical:** every `<` (less-than) and `\{...\}` (set braces) in the
> walkthrough must be wrapped in `<Eq>{`...`}</Eq>` — see
> `docs/kb/lesson-template/mdx-syntax-traps.md`. Run `npm run typecheck`
> after you finish.

### Translating a lesson body to a target locale

> Translate the body content of
> `content/aulas/ano-X/trim-Y/licao-NN-slug.mdx` to [LOCALE], producing
> `content/i18n/<speechLang>/aulas/ano-X/trim-Y/licao-NN-slug.mdx`. Match
> the source MDX exactly except for natural-language strings:
>
> **TRANSLATE:** body prose, `<Porta>` content, `<Definicao>` /
> `<Teorema>` titles & body, `<Exemplo>` body & `**Fonte.**` link text
> (keep URL), exercise statements, `solucao` text, `passos` text,
> `<aside>` book descriptions.
>
> **DO NOT TRANSLATE:** frontmatter (titles can be translated in a
> separate field), `slug`, `categoria`, `subcategoria`, `tags`, KaTeX/LaTeX
> formulas (`$...$`, `$$...$$`, `<Eq>{`...`}</Eq>`), URLs, `<Exercicio>` /
> `<Exemplo>` numerical IDs, prop names, component names.
>
> **Math notation stays as LaTeX.** A French student reading "$x \in
> \mathbb{R}$" reads it the same way as a Brazilian student.
>
> Print progress every 10 exercises: `[YOUR-AGENT-NAME 10/60] translated
> ex 1.10 to es-ES`.
