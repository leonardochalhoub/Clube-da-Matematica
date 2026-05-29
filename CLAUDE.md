# Clube da Matemática — Project Guide for AI Assistants

> **Audience.** Anthropic's Claude (main thread + subagents), Gemini free agents, and any other AI working in this repo. **Read this before doing anything**: it codifies the rules, the editorial pattern, the build pipeline, and the cost discipline.

> **Status.** Living document. Edit it whenever a non-obvious convention changes. Date-stamp the change.

---

## 1. Identity & North Star

**Clube da Matemática** is a Brazilian high-school mathematics curriculum, open-source, free, multilingual, statically deployed to GitHub Pages. Three years (12 trimesters, 120 lessons), culminating in Black-Scholes (lesson 119) and a synthesis workshop (lesson 120).

- **Editorial template (canonical):** `content/aulas/ano-1/trim-1/licao-01-conjuntos-intervalos.mdx` — the **Lesson 1 standard**. Documented in detail at `docs/kb/lesson-template/`. Every new lesson imitates this file: 7 doors + 5 worked examples (ascending difficulty, all sourced) + 30–80 multiple-choice exercises (every one with `solucao` + `fonte`, ~25% with `passos`) + 3 books header + audio reader + bibliography. The earlier templates (Lesson 52 / Black-Scholes) remain valid for advanced lessons but the Lesson 1 standard is the **primary** template now.
- **Mission:** rigorous mathematics + native-language access + zero cost to the student. The repo itself is the product.

---

## 2. Stack & Architecture

### Code
- **Next.js 15** (App Router) with `output: 'export'` → static HTML, deployed via GitHub Actions to GitHub Pages.
- **MDX** for lesson content (`@next/mdx` + `@mdx-js/loader`); per-locale routes use **`next-mdx-remote/rsc`** with filesystem read (no webpack chunks for translations — see §6).
- **KaTeX** for math, **rehype-katex** + **remark-math** plugins.
- **Tailwind CSS** with custom RGB-tuple tokens (clube-teal, clube-cream, clube-mist, clube-gold).
- **TypeScript strict**; **Vitest** for tests.

### Build commands

```bash
npm run typecheck         # tsc --noEmit
npm run validate-content  # frontmatter + zod schema check
npm run build             # SSG export (must use NODE_OPTIONS=--max-old-space-size=13312)
npm run dev               # local server
npm run test              # vitest
```

**Build memory rule.** `next build` for this repo MUST run with `NODE_OPTIONS=--max-old-space-size=13312` (13 GB), set by the `build` script in `package.json` via `cross-env` — that value OVERRIDES any `NODE_OPTIONS` set in the GH Actions workflow env, so edit `package.json` to change it, not just the workflow. Raised from 8192 → 13312 on 2026-05-27: a clean CI build (no `.next` cache) of ~1,835 pages OOM'd at 8 GB after Cálculo 1 (PR #2) added ~445 pages. The public `ubuntu-latest` runner has 16 GB RAM, so 13 GB heap is safe headroom. A warm local cache can mask the OOM — always trust the clean CI build.

### Routing
- **`/[categoria]/[...caminho]`** — root PT-BR lessons (e.g. `/aulas/ano-1/trim-1/aula-01-conjuntos-intervalos`).
- **`/[locale]/[categoria]/[...caminho]`** — translated lessons (e.g. `/en/aulas/...`, `/es/aulas/...`). Filesystem-based, server-rendered via `compileMDX`. See `app/[locale]/[categoria]/[...caminho]/page.tsx`.
- **All other pages** stay on canonical PT-BR URL — UI translates client-side via `useLocale()`.

---

## 3. Editorial Pattern — The 7 Doors

Every lesson MUST follow the canonical structure. **Do not improvise.** Reference: `content/aulas/ano-2/trim-6/aula-52-regras-derivacao.mdx`.

```mdx
---
titulo: "Lição NN — Title in PT-BR"
slug: "aula-NN-slug"
categoria: "aulas"
subcategoria: "ano-X-trim-Y"
descricao: "One-line summary in PT-BR."
ordem: NN
publicado: true
tags: ["topic", "ano-X", "trim-Y"]
prerrequisitos: ["aula-NN-1-slug"]
autores: ["Clube da Matemática"]
atualizadoEm: "2026-MM-DD"
---

<EquacaoCanonica
  formula="LaTeX without delimiters"
  legenda={<>Plain prose with <strong>strong</strong>, <em>em</em>, and <Eq>{`\\inline math`}</Eq>. Never raw $...$ inside JSX legenda.</>}
  audioTexto="Natural-language narration in source-locale (PT-BR for source, target-locale after translation)."
/>

<DuasPortas>
  <Porta nivel="formal" titulo="…">…</Porta>
  <Porta nivel="5"      titulo="For a 5-year-old">…</Porta>
  <Porta nivel="10"     titulo="For a 10-year-old">…</Porta>
  <Porta nivel="15"     titulo="For a 15-year-old teen">…</Porta>
  <Porta nivel="25"     titulo="For an engineering student">…</Porta>
  <Porta nivel="40"     titulo="For a senior professional">…</Porta>
  <Porta nivel="pratica" titulo="Practical application">…</Porta>
</DuasPortas>

<ListaExercicios seed="aula-NN-slug">
  <Exercicio numero="NN.1" dificuldade="aplicacao">…</Exercicio>
  …  (30–50 real exercises, never placeholders)
</ListaExercicios>

## Sources
- [Active Calculus](...) — Boelkins · 2024 · CC-BY-NC-SA. **Primary source.**
- [OpenStax …](...) — CC-BY.
```

### Difficulty mix per `<ListaExercicios>`
- ~60% `aplicacao` (drill)
- ~15% `modelagem` (real problems)
- ~15% `compreensao` (conceptual checks)
- ~10% `desafio` / `demonstracao` (challenge / proof)
- **~25% of all exercises must include `(Resp: X)` inline** for self-correction

### Hard rules
1. **Every equation has prose explanation** beneath it (`explicacao` prop on `<Equation>`).
2. **Every `<EquacaoCanonica>` has `audioTexto`** for the Web Speech API.
3. **Mention of "Nobel" → official link** to `nobelprize.org` (e.g. `https://www.nobelprize.org/prizes/economic-sciences/1997/summary/`). Never just text.
4. **Engineering rigor** (BR + JP + DE + SG style): 30–80 exercises, do not soften, progression aplicação → desafio.
5. **No placeholder exercises.** "Aplicação direta" or "Caso particular" without a real question is a bug.
6. **No emojis in MDX** unless explicitly requested by the user.
7. **Books are the ledger — AI never invents exercises or examples.** Every `<Exercicio>` and `<Exemplo>` MUST have a `fonte={{ livro, url, secao, pagina, exercicio, licenca }}` link to an open-licensed book (Stitz–Zeager, OpenStax, Hammack/Book of Proof, Yoshiwara, Active Calculus, Wikilivros — see `livros/CATALOG.md`). The URL should land on the exact page/section/exercise when the source allows. The only exception is pure mechanical drill ("compute $5 + 7$"). If you can't find a sourced exercise for a topic, **don't write one** — pick a different topic that IS sourced.
8. **No text-input answer fields.** Students solve in their caderno. Single-answer exercises must use `opcoes={[...]}` (multiple choice); proofs/derivations use only the "Ver solução" button. The component no longer renders a `<input>` even when `resposta` is set without `opcoes`, but always author MC for the better UX.
9. **Every exercise has `solucao`.** "Ver solução" is universal — short, correct, with the key reasoning. ~25% additionally have `passos={...}` (line-by-line walkthrough with prose comments) shown via the gold "Ver passo a passo" button.

### MDX sharp edges (will break the build)
- Bare `1{,}5` outside `$...$` → MDX reads `{,}` as JSX expression. Wrap as `$1{,}5$`.
- Bare `<` followed by digit (e.g. `<5s`) → MDX tries to parse JSX tag. Use `<5s` written as `less than 5 s` or `$<5$ s`.
- `$math$` inside `legenda={<>...</>}` → MDX evaluates `{...}` as JSX expression. Use `<Eq>{`...`}</Eq>` with double-escaped backslashes.
- Stray `</content>` from translator agents → strip before commit. There is a sweep script (search history).

### Cascade JSX pitfalls — READ BEFORE WRITING ANY MDX (2026-05-29)

The cascade pipeline (Sonnet/Haiku/Cerebras for source + translators) has produced **1,353 corrupted props in one healing sweep** across i18n files, plus **635 files needing structural fixes** (blank-line insertions), plus dozens of class-of-build-failures in PT-BR source. The cost has been multiple full sessions of whack-a-mole healing. The owner has paid for this and is tired of it.

**The 12 rules below are non-negotiable for any agent (Sonnet subagent, Haiku translator, Opus rewriter, Gemini drafter, anyone else) that writes or revises lesson MDX. Read them before you write a single character.**

#### Structure

1. **`<Exercicio>` MUST be multi-line form**:
   ```mdx
   <Exercicio numero="..." dificuldade="..."
     opcoes={[...]}
     solucao={<>...</>}
     fonte={{...}}
   >

   Enunciado em markdown body.

   </Exercicio>
   ```
   The closing `>` of the open tag is on its own line, then **a blank line**, then the body, then **a blank line**, then `</Exercicio>`. Compact `<Exercicio>body</Exercicio>` (single line) makes MDX parse `{cases}`/`{n}`/`{pmatrix}` as JSX expressions → ReferenceError. (86 i18n files had to be auto-rewritten to multi-line.)

2. **MANDATORY blank line between any JSX block tag and its markdown body.** Without the blank line, the body is parsed as **JSX children**, not markdown. `$\begin{cases}` inside JSX children has `{cases}` evaluated as a JSX expression with undefined identifier `cases`. (635 files were missing this blank line; build crashed at `cases is not defined` on lessons like L34.)

   Wrong (no blank line):
   ```mdx
   <Exercicio numero="34.24" dificuldade="aplicacao">
   Resolva $\begin{cases} 2x + 3y = 7 \\ x - y = 1 \end{cases}$.
   </Exercicio>
   ```
   Right:
   ```mdx
   <Exercicio numero="34.24" dificuldade="aplicacao">

   Resolva $\begin{cases} 2x + 3y = 7 \\ x - y = 1 \end{cases}$.

   </Exercicio>
   ```

3. **Count tag balance before stopping.** `<Exercicio>` opens MUST match `</Exercicio>` closes. Same for `<DuasPortas>` / `<Porta>` / `<ListaExercicios>` / `<>...</>` fragments. LLMs truncate; if you're running out of tokens, **close every open tag first**, then reduce content. The build fails with "Expected a closing tag for `<Exercicio>` (1188:1-1207:2)" when an exercise gets cut mid-body.

#### Math inside JSX

4. **Never put bare `{Identifier}` or `{expr-with-identifier}` anywhere outside `<Eq>{`...`}</Eq>` template literals or `$...$` body math.** Examples that broke the build:
   - `2\overrightarrow{PQ}` in JSX body → `PQ is not defined`
   - `(1-p)^{n-k}` in `<li>` JSX children → `n is not defined` / `k is not defined`
   - `K*e^{-rT}*N(d_2)` in `passos={<><ol>...` → `rT is not defined`
   - `\frac{d}{dx}` in JSX children → `d is not defined` / `dx is not defined`

   Wrap in `<Eq>`: `<Eq>{`2\\overrightarrow{PQ}`}</Eq>`. Or replace braces with parens: `e^(-rT)` works as plain text in JSX children, just won't render via KaTeX (acceptable when the real math is shown via inline `<Eq>` earlier in the same exercise).

5. **Inside `<Eq>{`...`}</Eq>`, double every backslash.** `<Eq>{`\\frac{1}{2}`}</Eq>`, not `<Eq>{`\frac{1}{2}`}</Eq>`. KaTeX consumes one `\` for the command; the template literal needs the other.

6. **Never write `\$` inside `<Eq>{`...`}</Eq>`.** Some scanners read `\` immediately before `` ` `` as escaping the closing backtick, terminating the template literal mid-content. For currency, put it OUTSIDE math: `R\$ 50 (<Eq>{`50`}</Eq> reais)` or `1250 reais` as prose.

7. **Never write escaped backticks `\``** inside JSX expressions. They are not valid syntax; emit literal `` ` `` only.

8. **Body markdown `$math$` is fragile when math contains `\command{...}` or `\begin{X}`.** Even with proper blank lines around the body, the MDX expression-scanner grabs `{cases}` / `{pmatrix}` / `{N}` from `$\begin{cases}…$` / `$\mathcal{N}…$` BEFORE remark-math claims the `$…$` span as math. Result: `ReferenceError: cases is not defined` etc. **2,652 body math spans in 267 files had to be auto-converted.**

   ALWAYS use `<Eq>` form when math has braces:
   - WRONG: `Resolva $\begin{cases}2x+3y=7\\x-y=1\end{cases}$ via Cramer.`
   - RIGHT: `Resolva <Eq>{`\\begin{cases}2x+3y=7\\\\x-y=1\\end{cases}`}</Eq> via Cramer.`

   Single-letter math (`$x$`, `$n=4$`) without braces is usually fine in body.

#### Attributes and strings

9. **No HTML entities in JSX content** (`&lt;`, `&gt;`, `&amp;`, etc.). They reach the parser as literal characters and break tags. Use the actual characters: `<`, `>`, `&`.

10. **Inside `texto: "..."` (and any other JS string attribute), double backslashes and avoid `\$`/`\t` escapes.** `texto: "$\text{não existe}$"` puts a literal TAB in the string because `\t` is JS string escape for TAB. Use `texto: "$\\text{nao existe}$"` (double `\\`, ASCII inside `\text` to avoid KaTeX warnings).

#### Sources (CLAUDE.md hard rule)

11. **Books are the ledger.** Every `<Exercicio>` MUST have `fonte={{ livro, url, secao, ..., licenca }}` pointing to a real open-licensed book in `livros/CATALOG.md`. If you can't find a sourced exercise for the topic, **DROP IT** or reduce count. **Never fabricate exercises.** This rule is repeated from §3 because translator agents have ignored it twice.

12. **Self-check before emitting any MDX.** Mental walkthrough:
    - [ ] Multi-line `<Exercicio>` with blank lines around the body?
    - [ ] Every `{ident}` inside backticks or `$math$`?
    - [ ] Every `\` doubled inside `<Eq>{`...`}</Eq>`?
    - [ ] No `\$` / `\``  / `\<` / `\>` inside JSX expressions?
    - [ ] No HTML entities (`&lt;`, etc.)?
    - [ ] All tags closed?
    - [ ] Every `<Exercicio>` has `fonte={{ ... }}` to a real book?

**When in doubt: use `<Eq>{`...`}</Eq>` over body `$...$`.** The template-literal form is always safe; body math is fragile.

**Reference memory:** `~/.claude/projects/-home-leochalhoub-Clube-da-Matematica/memory/feedback_cascade_jsx_pitfalls.md` has worked examples of each failure mode.

**If you violate any of these and the build breaks, the owner will revert your work.** Review is tough. Write correctly the first time.

---

## 4. Internationalization (i18n)

### Locales (11 total, after Hebrew/Arabic/Hindi removal)

```
pt-BR  source                 (no installed-voice issue; default)
en     en-US ✓
es     es-ES ✓
zh     zh-CN ✓
ja     ja-JP ✓
de     de-DE ✓
fr     fr-FR ✓
it     it-IT ✓
ru     ru-RU ✓
ko     ko-KR ✓
pl     pl-PL ✓
```

Removed: `ar`, `hi`, `he` — gTTS quality bad, Edge-TTS neural blocked by corp Zscaler proxy, Web Speech voices not installed by default on Windows/Linux. Will return when we have a clean TTS solution.

`NUM_LOCALES` is exported from `src/lib/i18n/locales.ts` and is used everywhere — never hardcode the count.

### Three translation layers

| Layer | Where | Status | Tool |
|-------|-------|--------|------|
| UI strings (buttons, headings, navigation) | `src/lib/i18n/translations.ts` | 100% in 11 locales | Claude (already done) |
| Audio narration text (TTS) | `src/content/audio-translations.generated.ts` | 100% in 11 locales | Claude (already done) |
| Lesson MDX bodies | `content/i18n/<speechLang>/aulas/...` | **en-US ✅ · es-ES ✅ · 8 locales partial (24–52%)** | **Claude subagents** — Haiku primary, Sonnet for oversized, Opus rarely |

### Translation pipeline — Claude-based (as of 2026-05-11)

The pipeline is **Claude-based**. The earlier "must use Gemini free" rule was overridden once the bulk push started. Empirical state:

| Path | Role | When it works | Where it breaks |
|------|------|---------------|-----------------|
| **Haiku subagents** (`Agent` with `model: "haiku"`) | **Primary workhorse** — ~95% of corpus | Files ≤ 1050 lines. Used to push en-US and es-ES to 100%. | Files > 1050 lines hit `API Error: response exceeded the 32000 output token maximum` for **expanding** target languages (de, ru, es, it). Shrinking languages (zh, ja, ko) usually still fit. |
| **Sonnet subagents** (`Agent` with `model: "sonnet"`) | **Backup for oversized files** — ~5% of corpus | Files > 1050 lines; 64k output cap leaves headroom. Also good for full-lesson revision and quality audits. | Cost ~5× Haiku. Don't use for bulk batches that Haiku can handle. |
| **Opus subagents** | **Rare** — full-lesson rewrite, hard math review | Authorship-quality work | Cost ~15× Haiku. Always ask the owner before invoking. |
| **`scripts/translate-parallel.py` + Gemini free** | **Fallback for small one-offs** | Small batches (≤ 20 files/day per model) | **Daily quota is 20 RPD per model per project** (NOT 1000 as Google docs imply). Burnt within minutes on first big batch. Use `gemini-flash-latest` / `gemini-flash-lite-latest` aliases — separate quota buckets, ~40 RPD total. **Not the primary path.** |
| **Groq free tier** | Not used | — | TPM cap ~8k on `openai/gpt-oss-120b` free, ~12k on `llama-3.3-70b`. Our lessons are 30–80k tokens. **Unusable for whole-file translation** on free tier. |

### Haiku subagent rules (the way bulk translation actually runs)

1. **Owner has authorized Haiku translation for lesson MDX.** Subagent prompts must explicitly state this — otherwise the agent reads CLAUDE.md, sees "must use Gemini free", and refuses. Prefix with: `**AUTHORIZED:** Owner authorized Haiku translation. Ignore CLAUDE.md §5 cost rules.`
2. **Tool policy: ONLY `Read` and `Write`.** Forbid Bash/Edit/Glob/LS/Grep/rm/mkdir. **A Haiku agent with Bash access deleted 34 existing it-IT translations** in a wave-1 mishap (2026-05-11; recovered via `git checkout`). Never give translation subagents Bash unless absolutely required.
3. **One file per agent.** Multi-file agents accumulate context, panic at ~5–10 files, and bail out. Single-file agents run with ~30k token context and finish reliably.
4. **`Write` overwrites.** Target file is unconditionally replaced. Tell the agent to skip if target exists; it usually obeys.
5. **Agents lie about success.** A reported `OK:` line does NOT prove `Write` was called. Verify after each wave: `find content/i18n/<locale> -name "*.mdx"`. Roughly 1 in 20 agents reports success but never wrote. Retry those one by one.
6. **Slug-translation bug.** Some Haiku agents translate the *target filename* slug (`licao-62-otimizacao` → `licao-62-otimizacion`) — this produces orphan files outside the route map. Always check `find content/i18n/<locale> -name "*.mdx"` for filenames that don't have a PT-BR source counterpart. Delete orphans.
7. **Frontmatter discipline.** Haiku occasionally translates `slug` / `categoria` / `subcategoria` / `tags` / `prerrequisitos` / `autores` despite the rule. Run `python3 scripts/fix-translated-frontmatter.py --only <locale>` after every locale finishes — it rewrites those fields verbatim from the source.
8. **Wave size:** up to 40 parallel Haiku agents is fine and verified. The memory-rule 6-agent cap was for Sonnet (cost) — Haiku is ~5× cheaper, so 40 in parallel is acceptable for batch work.

### `scripts/fix-translated-frontmatter.py`

Defensive post-processor. Reads any translated MDX under `content/i18n/<locale>/...`, finds the corresponding PT-BR source, and rewrites the frontmatter such that:
- `slug`, `categoria`, `subcategoria`, `ordem`, `publicado`, `tags`, `prerrequisitos`, `autores`, `versao` → **copied verbatim from source**
- `titulo`, `descricao`, `usadoEm`, `atualizadoEm` → **kept as translator emitted them**

Idempotent. Run after every locale's translation wave. Output: `N updated, M skipped, 0 errors`.

### Legacy "must use Gemini" rule — superseded

Earlier versions of this file said "ALL lesson translations must be done by Gemini free agents". **That is no longer true.** The current pipeline is Claude-based (Haiku/Sonnet/Opus). Gemini free remains in the toolbox for small one-off mechanical tasks, but it is not the primary path for any translation work. Memory rule `feedback-cheap-models.md` ("mechanical work uses free Gemini") is also superseded for translation specifically — Claude Haiku has proven cleaner, faster, and reliable enough that the owner moved the pipeline to it.

### Per-locale build (the OOM fix)
Each `/[locale]/...` page reads its MDX from disk at SSG time and compiles via `compileMDX` from `next-mdx-remote/rsc`. Webpack never bundles translations as chunks (which is what caused the OOM with 1,240 dynamic imports). Try-catch in the page falls back silently to PT-BR if the translated MDX has a parse error.

---

## 5. Cost & Model Tiering

The project follows a strict cost discipline:

```
Claude Haiku  →  Claude Sonnet  →  Claude Opus           Gemini free (fallback only)
  (default for     (long files,      (rare; ask           (small one-offs,
   bulk + most      hard math,        before using)        when Claude isn't ideal)
   translation)     review)
```

The translation pipeline is **Claude-based**, not Gemini-based. Haiku does ~95% of lesson MDX translation; Sonnet handles files Haiku can't (32k output cap on > 1050-line files in expanding languages); Opus is reserved for revision or pathological cases and only with explicit owner approval. `scripts/translate-parallel.py` + Gemini free-tier remains in the toolbox as a fallback for small batches when Claude isn't the right tool, but it is **not the primary path** for any locale's bulk push.

| Task | Tier |
|------|------|
| Translate MDX (bulk batches) | **Haiku subagents** (one per file, ≤ 40 in parallel) |
| Translate oversized MDX (> 1050 lines into de/ru/es/it) | **Sonnet subagent** (Haiku hits 32k API cap) |
| Translate audio strings, UI strings (small) | Haiku subagent OR Gemini free (either works) |
| Reformat MDX (mass find-replace, fix `{,}`) | Haiku, or Bash sed for trivial regex |
| Generate boilerplate, manifest files | Haiku |
| Write a new lesson from scratch | Sonnet (subagent) |
| Refactor architecture, design new pipeline | Sonnet (main thread) |
| Deep multi-step reasoning, hard math proofs, full-lesson revision | Opus (must ask user first) |

When dispatching parallel agents, **always print progress** in the form `[Haiku 03/40] translating ja-JP licao-12` or `[Sonnet 1/3] revising L01 fr-FR`. The user wants to see the parallelism and which model is running.

---

## 6. Repository layout

```
.
├── app/                              Next.js routes
│   ├── [categoria]/[...caminho]/    PT-BR lessons (root)
│   ├── [locale]/[categoria]/...     Translated lessons (filesystem read)
│   ├── ensino-medio/, financas/, manifesto/, livros/, videos/, provas/, mapa/
│   └── layout.tsx, page.tsx, globals.css
├── content/
│   ├── aulas/ano-X/trim-Y/aula-NN-*.mdx        ← PT-BR sources (canonical)
│   ├── financas-quantitativas/, calculo-1/, metodos-numericos/
│   ├── i18n/<speechLang>/aulas/...             ← Translated MDX
│   └── ../audio-translations.generated.ts
├── src/
│   ├── lib/i18n/locales.ts                     LOCALES + NUM_LOCALES
│   ├── lib/i18n/translations.ts                UI string dictionary
│   ├── lib/content/loader.ts, manifest.ts, loader-i18n.ts
│   ├── lib/content/manifest.generated.ts       (auto)
│   ├── lib/version.generated.ts                (auto, prebuild)
│   ├── content/provas-data.ts                  120 exam versions, 1800 questions
│   ├── content/schema.ts                       Zod schemas
│   ├── components/layout/                      Header, Footer, LessonPageShell, etc.
│   ├── components/math/                        DuasPortas, ListaExercicios, EquacaoCanonica, etc.
│   └── components/brand/Logo.tsx
├── scripts/
│   ├── generate-manifest.ts        (auto-run by build, regenerates content manifest)
│   ├── generate-version.ts         (auto-run by prebuild, stamps Footer)
│   ├── gemini-agent.py             Generic Gemini orchestrator (Claude-Code-format agents)
│   ├── gemini-draft.py             Gemini lesson drafter
│   ├── translate-parallel.py       Multi-locale Gemini translator (workers + fallback chain + retries)
│   ├── fix-translated-frontmatter.py  Defensive post-sweep — locks slug/categoria/tags back to PT-BR
│   └── validate-content.ts         Frontmatter + schema check
├── docs/
│   ├── EDITORIAL-RULES.md          Non-negotiable editorial rules (PT-BR)
│   ├── IDENTITY.md
│   ├── i18n.md
│   ├── v1.5-roadmap.md
│   ├── agents/translator-context.md  ← Context bundle for Gemini translation agents
│   └── kb/rag/                     Project knowledge base (RAG, context engineering)
├── public/                         Static assets (no MP3s anymore — TTS is runtime)
├── mdx-components.tsx              Global MDX → component mapping
├── next.config.ts, tsconfig.json, tailwind.config.ts, package.json
├── README.md                       External-facing project README
└── CLAUDE.md                       (this file) — for AI assistants
```

---

## 7. Memory rules (apply automatically)

Saved in `~/.claude/projects/-home-leochalhoub-Clube-da-Matematica/memory/` and indexed in `MEMORY.md`:

1. **English-only chat.** Reply in English. If the user writes PT-BR, nudge them to switch.
2. **Default model = Sonnet** (subagents and main). Ask before escalating to Opus.
3. **Translation pipeline is Claude-based** — Haiku for bulk, Sonnet for oversized, Opus rarely (ask first). Gemini free is only a fallback for small one-offs. (Memory `feedback-cheap-models.md` superseded for translation.)
4. **Print agent progress.** Format `[Haiku 03/40] task description` (or `[Sonnet 1/3]`, etc. — show which model is running).
5. **Black-Scholes is the editorial template.** All new content imitates its structure.
6. **Nobel mention → nobelprize.org link.**
7. **Engineering rigor in lessons** (30–80 exercises, no soft content, progression to challenge).
8. **No emojis in code/content** unless explicitly requested.
9. **`Lição NN`** title format. PT-BR is the source language; translations sit in `content/i18n/`.
10. **No auto-push** when the user explicitly asks for local-only testing.

---

## 8. Workflow patterns

### Adding a new lesson
1. Read `content/aulas/ano-2/trim-6/aula-52-regras-derivacao.mdx` for shape.
2. Create the MDX file under `content/aulas/ano-X/trim-Y/aula-NN-slug.mdx`.
3. Run `npm run validate-content` to check frontmatter.
4. Build locally: `NODE_OPTIONS=--max-old-space-size=13312 npm run build`.
5. Commit (manually). Do not auto-push if the user is testing locally.

### Translating lesson content (current playbook)
1. **Never use Claude main thread for raw translation** — main thread orchestrates only.
2. For bulk batches with owner authorization: spawn **Haiku subagents**, one per file, ≤ 40 in parallel. Prompt template at §4 "Haiku subagent rules"; key items: explicit `**AUTHORIZED:**` prefix, `Read`+`Write` only (no Bash), single-file scope.
3. After each wave, **verify**: `find content/i18n/<locale> -name "*.mdx" | wc -l` — agents sometimes report `OK` without writing. Retry the missing ones individually.
4. Check for **orphan slug-translated filenames**: `find content/i18n/<locale> -name "*.mdx"` then verify each has a PT-BR source counterpart. Delete orphans.
5. After each locale finishes: `python3 scripts/fix-translated-frontmatter.py --only <locale>` to lock slug-like fields back to PT-BR.
6. For files > 1050 lines that hit Haiku's 32k cap (rare — ~3–5 files per expanding locale): use Sonnet subagent or fall back to Gemini `gemini-flash-lite-latest` (separate quota bucket).
7. For small one-off "fix this one translation" tasks: spawn a single Haiku subagent for that file (preferred), OR `python3 scripts/translate-parallel.py --only <locale> --limit N` with Gemini-lite-latest if you want to stay free. Free tier daily cap is 20 RPD per model; use `-latest` aliases for an extra ~20 RPD bucket.
8. Run `npm run build` after each locale completes to catch MDX parse errors early. Build OOM at 8GB heap means too many translated MDX files — page reads from disk should prevent this (see Build OOM recovery below).

### Editing the editorial pattern
The pattern is owned by the user. Do not redefine the 7 doors, the difficulty mix, or the audio rule without explicit authorization. Reference: this file (§3) and `docs/EDITORIAL-RULES.md`.

### Build OOM recovery
If `next build` OOMs, the cause is almost always: too many MDX dynamic imports for webpack to bundle simultaneously. Check whether new code added a static import of every translated MDX. The fix is to move it to filesystem read (see `app/[locale]/[categoria]/[...caminho]/page.tsx` for the working pattern).

---

## 9. Roadmap snapshot (current)

- ✅ 120 lessons in PT-BR with 7 doors + ~4,770 sourced exercises.
- ✅ All 120 lessons stabilized to the Lição 1 canonical template (L14-L120 rewritten 2026-04 → 2026-05; build green).
- ✅ 1,800 exam questions (12 trimesters × 10 versions × 15 questions) in `provas-data.ts`.
- ✅ UI translated to 11 locales (no MDX bodies).
- ✅ Per-locale lesson routing (1,390 static pages — incl. en/es/zh/ja/de/fr/it/ru/ko/pl prefixes that fall back to PT-BR bodies).
- ✅ Footer with `version · commit · timestamp` (currently `0.2.0`).
- 🟡 **MDX lesson translations in progress**: en-US ✅ (124/124) · es-ES ✅ (124/124) · 8 locales partial (24–52%). Executed via Haiku subagents (primary) with `scripts/fix-translated-frontmatter.py` post-sweep.
- ⏳ Provas i18n → TO-DO.
- ⏳ Wolfram Alpha exercise links must use clean symbolic queries. Lesson-1 audit pending.
- 🔜 Future modules: Physics (high-school), Engineering intro.

---

## 10. Where to look first

- **Editorial questions:** `docs/EDITORIAL-RULES.md` + Black-Scholes lesson.
- **Build / deploy / config:** `package.json`, `next.config.ts`, `.github/workflows/deploy.yml`.
- **i18n:** `src/lib/i18n/locales.ts`, `src/lib/i18n/translations.ts`, `src/components/layout/LocaleProvider.tsx`, `src/components/layout/LessonPageShell.tsx`.
- **MDX components:** `src/components/math/`, `mdx-components.tsx`.
- **Gemini orchestration (small batches only):** `scripts/gemini-agent.py`, `scripts/gemini-draft.py`, `scripts/translate-parallel.py`, `docs/agents/translator-context.md`.
- **Frontmatter post-sweep (always after a translation batch):** `scripts/fix-translated-frontmatter.py --only <locale>`.
- **KB (project-local):** `docs/kb/`.

---

## 11. Tone & writing style for AI-generated content

- Direct, concrete, no fluff. Short sentences when possible.
- Never patronize the reader.
- The 5-year-old door is **simple**, not infantilizing.
- The 40-year-old door is **dense and technical**, not pretentious.
- Cite sources explicitly. Plagiarism = automatic rejection.
- Math notation always in `$...$` or `$$...$$` — never plain text "x squared".
- Currency: `R\$ 50` not `$50` (escape the dollar in MDX math contexts).

---

> **Last update:** 2026-05-11. Translation pipeline reframed as Claude-based (Haiku primary, Sonnet for oversized, Opus rare); Gemini free demoted to fallback. en-US and es-ES brought to 100% lesson MDX coverage. If you change a convention, edit this file in the same commit.
