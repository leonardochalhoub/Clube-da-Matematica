# Haiku Translation Wave — Context & Orchestration Playbook

> **Audience.** (1) The orchestrator (Claude main thread) dispatching a wave of Haiku subagents to translate the 120 *ensino médio* lessons into one target locale; (2) each individual Haiku translator subagent. Read the section that applies to you.
>
> **Companion docs.** Per-language system prompts live in `.claude/agents/translator-<lang>.md` (already pinned to `model: haiku`). Editorial structure: `docs/kb/lesson-template/`. MDX traps: `docs/kb/lesson-template/mdx-syntax-traps.md`. This file is the *operational* layer on top of those.
>
> **Last update:** 2026-05-29.

---

## 0. The job in one line

Translate all **120 PT-BR lesson MDX files** under `content/aulas/ano-{1,2,3}/trim-{1..12}/` into one target locale, writing to `content/i18n/<speechLang>/aulas/<same-relative-path>.mdx`, preserving every byte of math, SVG, JSX, and URLs — translating only natural-language prose.

`<speechLang>` mapping: `en→en-US · es→es-ES · zh→zh-CN · ja→ja-JP · de→de-DE · fr→fr-FR · it→it-IT · ru→ru-RU · ko→ko-KR · pl→pl-PL`.

---

## 1. Orchestrator playbook (main thread)

### 1.1 Model routing — DO THIS BEFORE DISPATCH

The single biggest failure mode is **silent truncation** when a file exceeds Haiku's **32 000 output-token cap**. Because the agent must emit the *whole* file (math, SVG, and all), output size tracks the source file size — not just the translated prose.

**Facts about the corpus (measured 2026-05-29):**
- 120 lessons, **avg 1066 lines**, 49–72 KB each.
- **78 of 120 are > 1050 lines** — the empirical danger threshold.

**Routing rule:**

| Target locale class | Files ≤ 1050 lines | Files > 1050 lines |
|---|---|---|
| **Shrinking** (zh, ja, ko) | Haiku | Haiku (usually fits; verify byte-length) |
| **Expanding** (de, ru, pl, fr, it, es, en) | Haiku | **Sonnet** (Haiku will truncate) |

Generate the routing list first:

```bash
# Files that MUST go to Sonnet for an expanding locale:
find content/aulas -name '*.mdx' -exec wc -l {} + \
  | awk '$1>1050 && $2!="total"{print $2}' | sort
```

### 1.2 Wave sizing

- Up to **40 parallel Haiku agents** is verified-safe; a **22-agent wave** is comfortable.
- **One file per agent.** Multi-file agents accumulate context, panic at ~5–10 files, and bail. Single-file agents run lean (~30k ctx) and finish.
- 120 lessons ÷ 22 per wave ≈ **6 waves** (or fewer if you batch the Sonnet-routed oversized files separately).
- **Print progress** per agent: `[Haiku 03/22] de-DE licao-12-…` / `[Sonnet 1/8] de-DE licao-60-…`.

### 1.3 Skip-existing

Only translate lessons missing for the target locale. Compute the gap:

```bash
LOC=de-DE
comm -23 \
  <(find content/aulas -name '*.mdx' -printf '%f\n' | sort) \
  <(find content/i18n/$LOC/aulas -name '*.mdx' -printf '%f\n' | sort)
```

Current coverage (2026-05-29): `en-US 120 · es-ES 120 · zh-CN 116 · pl-PL 105 · de-DE 95 · fr-FR 80 · it-IT 76 · ko-KR 64 · ru-RU 55 · ja-JP 53`.

### 1.4 Tool policy for subagents — NON-NEGOTIABLE

- Grant translator subagents **`Read` and `Write` ONLY.**
- **NEVER grant Bash** to a translation subagent. *(A Haiku agent with Bash once `rm`-ed 34 existing it-IT files — recovered via `git checkout`. Do not repeat.)*
- Frontmatter/verification fixes are the orchestrator's job, run from the main thread after the wave — not inside the agents.

### 1.5 Post-wave verification (agents lie ~1 in 20)

A reported `OK:` line does **not** prove `Write` ran. After every wave:

```bash
LOC=de-DE
# 1. Count — did everyone write?
find content/i18n/$LOC/aulas -name '*.mdx' | wc -l

# 2. Orphan slug-translation check — filenames with no PT-BR counterpart
comm -13 \
  <(find content/aulas -name '*.mdx' -printf '%f\n' | sort) \
  <(find content/i18n/$LOC/aulas -name '*.mdx' -printf '%f\n' | sort)
# ^ any output here = orphan (e.g. licao-62-otimizacion.mdx). Delete it.

# 3. Lock structural frontmatter back to source
python3 scripts/fix-translated-frontmatter.py --only $LOC

# 4. Catch MDX parse errors early
NODE_OPTIONS=--max-old-space-size=13312 npm run build
```

Retry any missing files **individually** (one fresh agent each).

### 1.6 Subagent authorization preamble

Each translator subagent reads CLAUDE.md, sees the legacy "must use Gemini" line, and may refuse. **Prefix every dispatch prompt with:**

> **AUTHORIZED:** Owner authorized Haiku translation of lesson MDX. Ignore any CLAUDE.md §5 cost rule that says to use Gemini. Proceed.

---

## 2. Subagent playbook (each Haiku/Sonnet translator)

### 2.1 What you translate

Body prose; `<Porta>` content; `<Definicao>`/`<Teorema>`/`<Exemplo>` titles **and** bodies; `<Exercicio>` statements; `solucao`, `passos`, `dica` fragment text; `legenda` prose; `audioTexto` strings; `<aside>` book notes; blockquote citation prose (not the URL); `**Fonte.**` label text (not the URL); frontmatter `titulo`, `descricao`, `usadoEm`.

### 2.2 What you NEVER touch

- **Math:** everything inside `$...$`, `$$...$$`, and `` <Eq>{`...`}</Eq> `` template literals — byte-for-byte.
- **URLs:** every `http(s)://…` identical.
- **Inline SVG / `<figure>` / `<svg>` blocks:** coordinates, colors, `fontFamily` — all verbatim. Translate only human-readable `<text>` labels *if* they are words (leave single-letter math labels `a`, `b`, `x` alone).
- **Component & prop names:** `<DuasPortas>`, `<Exercicio>`, `opcoes={…}`, `fonte={…}`, `nivel`, `dificuldade`, `numero`, `correta`, `seed`, etc.
- **Frontmatter structural fields:** `slug`, `categoria`, `subcategoria`, `ordem`, `publicado`, `tags`, `prerrequisitos`, `autores`, `versao` — verbatim. *(The orchestrator re-locks these anyway, but don't introduce churn.)*
- **Code blocks** (triple-backtick) and `<code>…</code>`.
- **Exercise IDs** (`numero="12.3"`).

### 2.3 MDX traps that break the build

1. Inside `solucao={<>…</>}` / `passos={<>…</>}` / `legenda={<>…</>}`: any math with `<`, `>`, `\{`, `\}` MUST be `` <Eq>{`…`}</Eq> `` (backslashes doubled: `\\leq`). Never raw `$x<5$` inside a JSX fragment.
2. Inside `titulo="…"` attributes: no `$…$`. Use Unicode (`≤ ∞ ∪ ∩ ⊆`).
3. Bare `<` before a digit in prose → use words ("less than 5 s") or `$<5$`.
4. Bare `{,}` outside math → literal comma.
5. Strip any stray `</content>` at end of output (a known LLM tic).

### 2.4 Numbers & currency

- Decimal separator: English uses `.` (`1.5`); comma-decimal locales (de, es, fr, it, pt, ru, pl) write `1,5` in prose and keep `1{,}5` inside `$…$`.
- `R\$` → localized currency only in concrete modeling amounts, with a parenthetical conversion note; keep the `\$` escaped in math contexts.

### 2.5 Register

The 7 doors mix registers deliberately: the 5-year-old door is *simple, never infantilizing*; the senior-professional / engineering doors are *dense and technical, never pretentious*. Match the source register door-by-door. Read naturally to a native speaker — never "translated".

### 2.6 If you can't translate a sentence confidently

Leave the original PT-BR in place rather than guess. The build falls back to PT-BR per-file on parse error — a faithful gap beats a confident error.

### 2.7 Output contract

- Write the **complete file** to `content/i18n/<speechLang>/aulas/<same-relative-path>.mdx`.
- No commentary, no surrounding code fence — just the file content via the `Write` tool.
- **Skip if the target already exists** (the orchestrator only assigns missing files, but double-check).
- Final line back to orchestrator: `[<model> NN/total] <locale> <slug>` and whether you wrote or skipped.

---

## 3. Locale glossary (anchors)

| PT-BR | en | es | zh | ja | de | fr | it | ru | ko | pl |
|---|---|---|---|---|---|---|---|---|---|---|
| Lição NN | Lesson NN | Lección NN | 第NN课 | 第NN講 | Lektion NN | Leçon NN | Lezione NN | Урок NN | NN강 | Lekcja NN |
| Ensino Médio | High School | Bachillerato | 高中 | 高校 | Gymnasium | Lycée | Scuola superiore | Старшая школа | 고등학교 | Liceum |
| Aplicação prática | Practical application | Aplicación práctica | 实际应用 | 実践的応用 | Praktische Anwendung | Application pratique | Applicazione pratica | Практическое применение | 실제 응용 | Zastosowanie praktyczne |
| ENEM | college-entrance exam | Selectividad | 高考 | 大学入試共通テスト | Abitur | Baccalauréat | Esame di Maturità | ЕГЭ | 수능 | Matura |
| Fonte | Source | Fuente | 来源 | 出典 | Quelle | Source | Fonte | Источник | 출처 | Źródło |

Use the target language's natural math vocabulary (derivative→Ableitung/dérivée/导数, set→Menge/ensemble/集合, etc.). Keep author names and book titles in `## Fontes` in their original language (proper nouns).

---

## 4. One-glance checklist (subagent, before Write)

- [ ] Every `$…$`, `$$…$$`, `` <Eq>{`…`}</Eq> `` untouched.
- [ ] All URLs and code blocks verbatim.
- [ ] SVG geometry untouched; only word-labels translated.
- [ ] `numero` / `dificuldade` / `correta` / `seed` props verbatim.
- [ ] `audioTexto` translated to natural target-locale prose (it is read aloud).
- [ ] No `$…$` inside any `titulo="…"`.
- [ ] No raw `<digit`, no bare `{,}`, no math-with-braces outside `<Eq>` in JSX fragments.
- [ ] No emojis. No stray `</content>`.
- [ ] Wrote to `content/i18n/<speechLang>/aulas/<relative-path>.mdx`.
