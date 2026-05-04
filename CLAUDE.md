# Clube da Matemática — Project Guide for AI Assistants

> **Audience.** Anthropic's Claude (main thread + subagents), Gemini free agents, and any other AI working in this repo. **Read this before doing anything**: it codifies the rules, the editorial pattern, the build pipeline, and the cost discipline.

> **Status.** Living document. Edit it whenever a non-obvious convention changes. Date-stamp the change.

---

## 1. Identity & North Star

**Clube da Matemática** is a Brazilian high-school mathematics curriculum, open-source, free, multilingual, statically deployed to GitHub Pages. Three years (12 trimesters, 120 lessons), culminating in Black-Scholes (lesson 119) and a synthesis workshop (lesson 120).

- **Editorial template (canonical):** `content/aulas/ano-2/trim-6/aula-52-regras-derivacao.mdx` — the 7-door pattern. Black-Scholes (`content/aulas/ano-3/trim-12/aula-119-bs-sintese.mdx`) is the reference for the highest tier. Every new piece of content imitates these.
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
npm run build             # SSG export (must use NODE_OPTIONS=--max-old-space-size=8192)
npm run dev               # local server
npm run test              # vitest
```

**Build memory rule.** `next build` for this repo MUST run with `NODE_OPTIONS=--max-old-space-size=8192` minimum (the GH Actions workflow already sets it). Anything below 7 GB OOMs on 120 MDX × KaTeX × per-locale routes.

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

### MDX sharp edges (will break the build)
- Bare `1{,}5` outside `$...$` → MDX reads `{,}` as JSX expression. Wrap as `$1{,}5$`.
- Bare `<` followed by digit (e.g. `<5s`) → MDX tries to parse JSX tag. Use `<5s` written as `less than 5 s` or `$<5$ s`.
- `$math$` inside `legenda={<>...</>}` → MDX evaluates `{...}` as JSX expression. Use `<Eq>{`...`}</Eq>` with double-escaped backslashes.
- Stray `</content>` from translator agents → strip before commit. There is a sweep script (search history).

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
| Lesson MDX bodies | `content/i18n/<speechLang>/aulas/...` | partial (see inventory below) | **Gemini free** (parallel) |

### Translation pipeline rule
**ALL lesson and audio translations are mechanical work.** They must be done by **Gemini free agents** (`scripts/gemini-agent.py`, `scripts/gemini-draft.py`), not by Claude. Claude only translates if the user explicitly says "translate this with Claude". See `docs/agents/translator-context.md` for the agent context bundle.

### Per-locale build (the OOM fix)
Each `/[locale]/...` page reads its MDX from disk at SSG time and compiles via `compileMDX` from `next-mdx-remote/rsc`. Webpack never bundles translations as chunks (which is what caused the OOM with 1,240 dynamic imports). Try-catch in the page falls back silently to PT-BR if the translated MDX has a parse error.

---

## 5. Cost & Model Tiering

The project follows a strict cost discipline:

```
Free Gemini  →  Claude Haiku  →  Claude Sonnet  →  Claude Opus
   (default)      (default)         (default for       (only with
                                     content work)     user OK)
```

| Task | Tier |
|------|------|
| Translate MDX, audio strings, UI strings | Gemini free |
| Reformat MDX (mass find-replace, fix `{,}`) | Gemini free or Haiku |
| Generate boilerplate, manifest files | Gemini free or Haiku |
| Write a new lesson from scratch | Sonnet (subagent) |
| Refactor architecture, design new pipeline | Sonnet (main thread) |
| Deep multi-step reasoning, hard math proofs | Opus (must ask user first) |

When dispatching parallel agents, **always print progress** in the form `[Gemini agent 03/10] translating ja-JP wave 2`. The user wants to see the parallelism.

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
3. **Mechanical work uses free Gemini** (translations, reformat, boilerplate). Never burn Claude tokens on these.
4. **Print agent progress.** Format `[Gemini 03/10] task description`.
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
4. Build locally: `NODE_OPTIONS=--max-old-space-size=8192 npm run build`.
5. Commit (manually). Do not auto-push if the user is testing locally.

### Translating lesson content
1. **Never use Claude main thread for raw translation.**
2. Use `scripts/gemini-agent.py` with the translator-context bundle (see `docs/agents/translator-context.md`).
3. One Gemini agent per locale, in parallel — respect the 15 req/min rate limit (sleep between batches).
4. Print `[Gemini NN/total] processing aula-XX → es-ES` for visibility.
5. After all agents finish, run `npm run build` locally, commit, push.

### Editing the editorial pattern
The pattern is owned by the user. Do not redefine the 7 doors, the difficulty mix, or the audio rule without explicit authorization. Reference: this file (§3) and `docs/EDITORIAL-RULES.md`.

### Build OOM recovery
If `next build` OOMs, the cause is almost always: too many MDX dynamic imports for webpack to bundle simultaneously. Check whether new code added a static import of every translated MDX. The fix is to move it to filesystem read (see `app/[locale]/[categoria]/[...caminho]/page.tsx` for the working pattern).

---

## 9. Roadmap snapshot (current)

- ✅ 120 lessons in PT-BR with 7 doors + ~4,770 exercises.
- ✅ 1,800 exam questions (12 trimesters × 10 versions × 15 questions) in `provas-data.ts`.
- ✅ UI translated to 11 locales.
- ✅ Per-locale lesson routing (493 static pages).
- ✅ Footer with `version · commit · timestamp`.
- ⏳ MDX translation coverage: ~36% average (worst: pl-PL 21/120, best: en-US/es-ES 50/120). Gemini agents fill this in.
- ⏳ Wolfram Alpha exercise links must use clean symbolic queries (not localized text). Lesson-1 audit pending.
- ⏳ Audio: Spanish locale shows BR flag/voice in some cases (regression from per-locale routes — see issue queue).
- 🔜 Provas i18n.
- 🔜 Future modules: Physics (high-school), Engineering intro.

---

## 10. Where to look first

- **Editorial questions:** `docs/EDITORIAL-RULES.md` + Black-Scholes lesson.
- **Build / deploy / config:** `package.json`, `next.config.ts`, `.github/workflows/deploy.yml`.
- **i18n:** `src/lib/i18n/locales.ts`, `src/lib/i18n/translations.ts`, `src/components/layout/LocaleProvider.tsx`, `src/components/layout/LessonPageShell.tsx`.
- **MDX components:** `src/components/math/`, `mdx-components.tsx`.
- **Gemini orchestration:** `scripts/gemini-agent.py`, `scripts/gemini-draft.py`, `docs/agents/translator-context.md`.
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

> **Last update:** 2026-05-04. If you change a convention, edit this file in the same commit.
