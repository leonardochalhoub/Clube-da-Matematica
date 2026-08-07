# Clube da Matemática — Project Guide for AI Assistants

> **Audience.** Anthropic's Claude (main thread + subagents), Gemini free agents, and any other AI working in this repo. **Read this before doing anything**: it codifies the rules, the editorial pattern, the build pipeline, and the cost discipline.

> **Status.** Living document. Edit it whenever a non-obvious convention changes. Date-stamp the change.

---

## 1. Identity & North Star

**Clube da Matemática** is a Brazilian mathematics curriculum spanning **Ensino Médio
(high school) and Ensino Superior (higher education)**, open-source, free, statically
deployed to GitHub Pages. **The live frontend serves PT-BR only** (converged 2026-08-06 —
see §4). Translated content for 10 other languages still exists in the repo but is
paused, not routed on the live site.

- **Ensino Médio** (`content/aulas/`, route `/ensino-medio` + lessons under `/pt-br/aulas/…`):
  three years, 12 trimesters, 120 lessons, culminating in Black-Scholes (lesson 119) + a
  synthesis workshop (lesson 120).
- **Ensino Superior** (`content/engenharia/`, route `/engenharia` = "Ensino Superior" in the
  UI): Cálculo 1–4 with engineering rigor, in construction, same 7-door template.

- **Editorial template (canonical):** `content/aulas/ano-1/trim-1/licao-01-conjuntos-intervalos.mdx` — the **Lesson 1 standard**. Documented in detail at `docs/kb/lesson-template/`. Every new lesson imitates this file: 7 doors + 5 worked examples (ascending difficulty, all sourced) + 30–80 multiple-choice exercises (every one with `solucao` + `fonte`, ~25% with `passos`) + 3 books header + audio reader + bibliography. The earlier templates (Lesson 52 / Black-Scholes) remain valid for advanced lessons but the Lesson 1 standard is the **primary** template now.
- **Exercises are the ledger.** Every exercise (EM done 2026-06-03; ES Cálculo pending) must
  be a REAL exercise taken from the parsed open-book corpus (`livros/_parsed/_corpus.jsonl`),
  carrying `fonte={{ livro, url, secao, exercicio: "ex. N", licenca }}` — source AND a link to
  the exercise itself. Regenerate banks with `scripts/build-lesson-candidates.py` +
  `scripts/REGEN-INSTRUCTIONS.md`; never fabricate. ⚠️ **The Ensino Superior Cálculo banks
  (`content/engenharia/calculo-1/…`) are still AI-written (0 `fonte`) and MUST be re-sourced
  from the corpus** the same way the 120 EM lessons were. See [[project_exercise_resourcing]].
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
- **`/[locale]/[categoria]/[...caminho]`** — ALL lessons, including PT-BR, are served by this one route (`app/[locale]/[categoria]/[...caminho]/page.tsx`). PT-BR's URL segment is `pt-br` (source MDX lives in `content/`, not `content/i18n/`), e.g. `/pt-br/aulas/ano-1/trim-1/licao-01-conjuntos-intervalos/`. There is no separate root-level lesson route — `scripts/gen-redirect-stubs.mjs` emits static redirect stubs from the old bare `/aulas/...` URLs to `/pt-br/aulas/...` for backward compatibility.
- **Since 2026-08-06, `generateStaticParams()` in that route only emits PT-BR params.** Translated locales' MDX still exists in `content/i18n/` but no page is built for them — visiting `/en/aulas/...` etc. now 404s. See §4.
- **All other pages** (home, `/ensino-medio`, `/manifesto`, etc.) live at a single root URL (not per-locale). Their UI text goes through `useLocale().t()`, but `LocaleProvider` now hardcodes `locale = 'pt-BR'` — see §4.

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

The cascade pipeline (Sonnet/Haiku/Cerebras for source + translators) has cost the owner **hours of build-fix work over multiple sessions** and real LLM spend on top. Documented healing totals from a single day (2026-05-29):

- **1,353 corrupted props** healed across i18n files (nested `<Eq>`, escaped backticks, R\$ inside template literals)
- **635 files** missing blank-line separator between JSX block tag and markdown body
- **86 i18n files** had compact `<Exercicio>body</Exercicio>` (one line) that needed multi-line rewrite
- **2,652 body `$\begin{X}…\end{X}$` spans** in 267 files needed conversion to `<Eq>` template-literal form
- **831 `<Eq>{`...\\begin{cases}…\\end{cases}…`}</Eq>` blocks** in 200+ files needed rewrite to comma-joined inline equations (the cases environment broke the locale-route chunk)
- **5 i18n files for L120** (en/es/de/pl/zh) and **10 i18n files for L26** had to be DELETED because they couldn't be healed safely
- **7 PT-BR lessons** had their last `<Exercicio>` truncated mid-body (LLM ran out of tokens before closing tags) and needed manual close-tag insertion
- Plus dozens of one-off ReferenceErrors: `n is not defined`, `PQ is not defined`, `cases is not defined`, `rT is not defined`, `HH is not defined`, `pmatrix is not defined`, `Var is not defined`, `Cov is not defined`, `d is not defined`, `dx is not defined`

**Every single one of these was a Sonnet/Haiku agent emitting MDX that looked plausible but broke the Next.js prerender stringify because the model didn't internalize the JSX-children parsing rules.**

**The rules below are NON-NEGOTIABLE for any agent (Sonnet subagent, Haiku translator, Opus rewriter, Gemini drafter, anyone else) that writes or revises lesson MDX. Read them before you write a single character. Run the rule-12 self-check on every single `<Exercicio>` you emit.**

If you violate any of these and the build breaks, the owner reverts your work and the LLM spend is wasted. Past Sonnet agents have ignored these rules; the cost has been real. **This time, follow them.**

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

### Worked-example gallery — every failure we hit, with the fix

Every entry below is a real bug from cascade output that broke the build. Memorize the patterns.

#### A. Compact `<Exercicio>` (no multi-line, no blank line)
```mdx
WRONG:
<Exercicio numero="34.24" dificuldade="aplicacao">Löse: $\begin{cases} 2x+3y=7 \\ x-y=1 \end{cases}$.</Exercicio>

RIGHT:
<Exercicio numero="34.24" dificuldade="aplicacao"
  opcoes={[
    { texto: "$x=2,\\,y=1$", correta: true },
  ]}
  solucao={<>Por Cramer: <Eq>{`x = D_x/D`}</Eq>, <Eq>{`y = D_y/D`}</Eq>.</>}
  fonte={{ livro: "OpenStax College Algebra 2e", url: "...", secao: "§7.8", licenca: "CC-BY 4.0" }}
>

Resolva por Cramer: <Eq>{`2x+3y=7`}</Eq>, <Eq>{`x-y=1`}</Eq>.

</Exercicio>
```
Failure: `ReferenceError: cases is not defined` at Next.js stringify (chunk N at col X). Reason: MDX parses single-line `<Exercicio>...</Exercicio>` body as JSX children; `{cases}` inside `$\begin{cases}$` is JSX expression with undefined identifier.

#### B. `<Exercicio>` with body but no blank line
```mdx
WRONG:
<Exercicio numero="34.24" dificuldade="aplicacao">
Resolva por Cramer: $\begin{cases}2x+3y=7\\x-y=1\end{cases}$.
</Exercicio>

RIGHT:
<Exercicio numero="34.24" dificuldade="aplicacao">

Resolva por Cramer: <Eq>{`\\begin{cases}2x+3y=7\\\\x-y=1\\end{cases}`}</Eq>.

</Exercicio>
```
Failure: same `cases is not defined`. Reason: without blank line, body still parsed as JSX children. **And** even with blank line, body `$\begin{X}…$` is unsafe because MDX expression-scanner runs before remark-math.

#### C. Bare `{Identifier}` in JSX body / children
```mdx
WRONG:
solucao={<>O vetor unitário de <Eq>{`\\vec v=(3,4)`}</Eq> é 2\overrightarrow{PQ}/5.</>}

RIGHT (math wrapped):
solucao={<>O vetor unitário de <Eq>{`\\vec v=(3,4)`}</Eq> é <Eq>{`2\\overrightarrow{PQ}/5`}</Eq>.</>}

ALSO RIGHT (HTML entities if you really want bare text):
solucao={<>O vetor unitário de <Eq>{`\\vec v=(3,4)`}</Eq> é 2\overrightarrow&#123;PQ&#125;/5.</>}
```
Failure: `ReferenceError: PQ is not defined`. Reason: `\overrightarrow` is plain text in JSX children (the `\` doesn't escape `{` in JSX); `{PQ}` is then a JSX expression.

#### D. Body math with `\command{...}` braces
```mdx
WRONG:
Prior $\mu \sim \mathcal{N}(0,1)$, observe $x_i$ com $n=4$.

RIGHT:
Prior <Eq>{`\\mu \\sim \\mathcal{N}(0,1)`}</Eq>, observe <Eq>{`x_i`}</Eq> com <Eq>{`n=4`}</Eq>.
```
Failure: `ReferenceError: N is not defined`. Reason: MDX expression-scanner grabs `{N}` from inside `\mathcal{N}` before remark-math claims `$…$` as math.

#### E. Super/subscript braces in JSX children
```mdx
WRONG (passos= block):
passos={<>
  <ol>
    <li>Aplique a fórmula: $P(X=k) = C(n,k) p^k (1-p)^{n-k}$.</li>
  </ol>
</>}

RIGHT (math wrapped):
passos={<>
  <ol>
    <li>Aplique a fórmula: <Eq>{`P(X=k) = C(n,k) p^k (1-p)^{n-k}`}</Eq>.</li>
  </ol>
</>}

ALSO RIGHT (paren form, no math rendering but no JSX error):
passos={<>
  <ol>
    <li>Aplique a fórmula: P(X=k) = C(n,k) p^k (1-p)^(n-k).</li>
  </ol>
</>}
```
Failure: `ReferenceError: n is not defined`. Reason: `^{n-k}` after `\` removal becomes `{n-k}` JSX expression; `n` and `k` undefined.

#### F. Comma-separated identifiers as set notation
```mdx
WRONG:
<li>Espaço amostral: {HH, HT, TH, TT}.</li>

RIGHT (math wrapped):
<li>Espaço amostral: <Eq>{`\\{HH, HT, TH, TT\\}`}</Eq>.</li>

ALSO RIGHT (entity escape):
<li>Espaço amostral: &#123;HH, HT, TH, TT&#125;.</li>
```
Failure: `ReferenceError: HH is not defined`. Reason: `{HH, HT, TH, TT}` is JSX expression — comma-expression of identifiers.

#### G. Exponential `e^{-rT}` in JSX children
```mdx
WRONG (passos= block):
passos={<><ol><li>K*e^{-rT}*N(d2) = 50*0,9418 = 47,09.</li></ol></>}

RIGHT (math wrapped):
passos={<><ol><li><Eq>{`K \\cdot e^{-rT} \\cdot N(d_2) = 50 \\cdot 0{,}9418 = 47{,}09`}</Eq>.</li></ol></>}

ALSO RIGHT (paren form):
passos={<><ol><li>K*e^(-rT)*N(d2) = 50*0,9418 = 47,09.</li></ol></>}
```
Failure: `ReferenceError: rT is not defined`. Same class as E.

#### H. Single backslash inside `<Eq>{`...`}</Eq>` template literal
```mdx
WRONG:
<Eq>{`\frac{1}{2}`}</Eq>

RIGHT (double backslash):
<Eq>{`\\frac{1}{2}`}</Eq>
```
Failure: KaTeX renders nothing, or MDX may complain about `\f` (form-feed JS escape). The template literal needs `\\` to deliver `\` to KaTeX.

#### I. `R\$` currency inside template literal
```mdx
WRONG:
solucao={<><Eq>{`\\mathrm{R\\$}\\;1250`}</Eq></>}
solucao={<><Eq>{`Valor: R\$ 50`}</Eq></>}

RIGHT (currency OUTSIDE math):
solucao={<>Valor: R\$ 50 (<Eq>{`50`}</Eq> reais)</>}

ALSO RIGHT (prose only):
solucao={<>Valor: 50 reais</>}
```
Failure: cascade-output scanners read `\$` as escaping the closing `` ` `` and the template literal "leaks" into surrounding JSX, breaking everything downstream.

#### J. HTML entities in JSX
```mdx
WRONG:
solucao={<>Com <Eq>{`d_1=0{,}40`}</Eq>.&lt;/
passos={&lt;&gt;

RIGHT:
solucao={<>Com <Eq>{`d_1=0{,}40`}</Eq>.</>}
passos={<>
```
Failure: `Unexpected character '<' (U+003C) before attribute name` or worse. Reason: entities don't help inside JSX; emit actual characters.

#### K. Escaped backticks
```mdx
WRONG:
<Eq>{\`\\sin x\`}</Eq>

RIGHT:
<Eq>{`\\sin x`}</Eq>
```
Failure: `Could not parse expression with acorn`. Reason: `\``  is not valid JSX-expression syntax.

#### L. Truncated `<Exercicio>` (LLM ran out of tokens)
```mdx
WRONG (file ends here):
<Exercicio numero="75.42"
  dificuldade="desafio"
  opcoes={[…]}
  solucao={<>…</>}
>
Sob que condição $X_1 \sim \text{Bin}(n_1, p)$

RIGHT (always close before stopping):
<Exercicio numero="75.42"
  dificuldade="desafio"
  opcoes={[…]}
  solucao={<>…</>}
>

Sob que condição binomiais somam binomial? Resposta na referência.

</Exercicio>

</ListaExercicios>

## Fontes
- ...
```
Failure: `Expected a closing tag for <Exercicio> (873:1-879:2)`. Reason: LLM token budget exhausted mid-sentence; never closed the tag, the `</ListaExercicios>`, or the `## Fontes` section. **Always close ALL open tags before running out of budget; reduce body length if needed.**

### Required prompt template for invoking Sonnet/Haiku agents

When the owner (or main thread) spawns a Sonnet/Haiku agent to write/translate lesson MDX, the agent prompt MUST include this preamble:

```
You are writing/translating MDX content for the Clube da Matemática repo. Before
emitting any MDX, READ CLAUDE.md §3 "Cascade JSX pitfalls" — specifically the
12 rules and the worked-example gallery (A–L).

Apply rule 12 (self-check) on EVERY single <Exercicio>, <Exemplo>, <Equation>,
<EquacaoCanonica>, <DuasPortas>, <Porta> you emit. Do not stop until every open
tag has a matching close tag.

Hard reminders:
- Multi-line <Exercicio> with blank line before AND after the body
- Every {ident} inside <Eq>{`...`}</Eq> backticks or $...$ math
- Body math with \begin{X}/\command{} → use <Eq> instead
- Double-backslash inside template literals
- Never bare {HH, HT, TH, TT} comma-list in JSX children
- Books are the ledger — fonte= is mandatory; never fabricate
- Close every <Eq>: `}</Eq> NOT `</Eq> (missing-brace = #1 build break)
- NEVER translate component tag names (Exemplo/Exercicio/etc. stay verbatim — no Ejemplo/Ejercicio)
- No bare < or > operators in JSX text — wrap in <Eq> or write in words
- Books are the ledger — fonte= is mandatory; never fabricate

If you can't finish a 30+ exercise list in budget, write FEWER exercises but
CLOSE every tag. Truncated <Exercicio> blocks crash the build.

VERIFY before finishing (REQUIRED): node scripts/check-mdx-build.mjs <file>
must print fail=0. Do NOT use check-rsc-all.mjs — it is lenient and passes
files the real build rejects. See §3 "Translator mistakes that broke the
build (2026-06-02)" for the full checklist.
```

This preamble is non-negotiable. Agents that don't see it have a track record of producing broken output. The cost of the preamble (a few hundred tokens) is negligible compared to the cost of the build-fix iterations it prevents.

### What to do if an agent already produced broken output

If you discover broken MDX from a past Sonnet/Haiku run:

1. **Don't try to write more** — first heal what's there. Run the **build-accurate** check: `node scripts/check-mdx-build.mjs <dir-or-file>` (acorn/`@mdx-js/mdx`, matches `next build`). Do NOT rely on `scripts/check-rsc-all.mjs` — it is lenient and hid 30 broken files in the 2026-06-02 pass.
2. **Categorize the failures** by class (compact form / no blank line / body math with braces / bare {ident} in children / truncated tags). Each class has a sweep that fixes it in bulk — see the commit log around 2026-05-29 for examples.
3. **Push and watch CI.** Don't commit-spam — heal everything you can find locally first, push once.
4. **If a single file keeps failing across multiple builds with the same digest**, the file is likely beyond bulk-heal repair. Delete it (worst case the URL 404s) or rewrite it from scratch with a fresh agent prompted with this section.

---

### ⛔ Translator mistakes that broke the build (2026-06-02) — DO NOT REPEAT

A full en-US translation pass (Haiku + Sonnet + Opus 4.8) produced files that **passed `scripts/check-rsc-all.mjs` but broke `next build`** — 30 of 120 files failed the real compiler. Root cause and the exact recurring defects are below. **Every translator/rewriter agent MUST read this and self-check against it before finishing.**

#### THE VERIFIER TRAP (most important)

- **`scripts/check-rsc-all.mjs` uses `next-mdx-remote` and is LENIENT — it passes files the build rejects. NEVER trust it as proof a file compiles.**
- **`next build` uses `@mdx-js/mdx` + acorn (STRICT).** The build-accurate validator is **`scripts/check-mdx-build.mjs`** (added 2026-06-02). **Always verify translations with `node scripts/check-mdx-build.mjs <file>` — it must print `fail=0`.** A file is not "done" until it passes THIS checker, not the lenient one.
- **Acorn parsing is NOT enough either.** `$\\mathbb{R}$` / `$\\mathcal{N}$` / `$\\bar{C}$` inside a JSX fragment (a `<Porta>` body, `solucao={<>…</>}`, `<li>`, …) PARSES fine but throws `R is not defined` / `N is not defined` at PRERENDER — which is what crashed the en deploy. Verify with **`node scripts/check-mdx-render.mjs <file>`** (it actually renders each lesson; `fail=0` required). Fix by wrapping the brace-math in `<Eq>{`…`}</Eq>` (doubled backslashes). CI runs this render-check before `next build`.
- Acorn reports **one error at a time** and often without a useful line number ("Could not parse expression with acorn"). Fix, re-run, repeat until `fail=0`.

#### The five defect classes that broke the build (with exact fix)

1. **Missing closing brace on inline math — 244 occurrences across 10 files.**
   The single most common defect. A `<Eq>` was written as `` <Eq>{`...`</Eq> `` — the `}` before `</Eq>` is missing.
   - WRONG: `` <Eq>{`|7| = 7 \\leq 13`</Eq> ``
   - RIGHT: `` <Eq>{`|7| = 7 \\leq 13`}</Eq> ``
   - Sweep to detect: `grep -rn '`</Eq>' content/i18n/<locale>` — any hit (backtick directly before `</Eq>`) is ALWAYS this bug. Fix: `perl -i -pe 's/`<\/Eq>/`}<\/Eq>/g'`.

2. **Translated JSX component tag names — 38 occurrences across 19 files.**
   Translators "translated" component names into the target language (Spanish forms leaked into en-US): `</Exemplo>`→`</Ejemplo>`, `</Exercicio>`→`</Ejercicio>`. **Component names are CODE, never translate them.** The real component set (from `mdx-components.tsx`): `Exemplo, Exercicio, Definicao, Teorema, Insight, Cuidado, DuasPortas, Porta, ListaExercicios, Eq, Equation, EquacaoCanonica`. (Note `Teorema`/`Insight` ARE real — don't "fix" those.) Detect: `grep -rnoE '</?(Ejemplo|Ejercicio|Ejercicios|Definición|DosPuertas|Puerta|ListaEjercicios)\b' content/i18n/<locale>`.

3. **Bare `<` or `>` operators in JSX children / props.**
   A `<` or `>` used as a math/comparison operator inside JSX text makes acorn try to parse a tag.
   - WRONG: `<em>a > 1</em>`, `0 < a < 1`, `(DEFF > 1 due to clustering)`, `Since 12.4% < 25%`, `p-value > 0.05`
   - RIGHT: wrap the math — `` <Eq>{`a > 1`}</Eq> `` — or write it in words ("greater than 1", "is less than 25%"), or as a JSX string expression `{'>'}`. This bites hardest inside `legenda={<>...</>}`, `solucao={<>...</>}`, `passos={<>...</>}`, and `<li>` children.

4. **Truncated files (LLM ran out of tokens) — several files.**
   The agent stopped mid-exercise; the file ended without closing `</Exercicio>`, `</ListaExercicios>`, and the `## Fontes`/`## Sources` section. **Always close every open tag before finishing; if low on budget, write SHORTER exercises but NEVER stop mid-tag.** Verify the file ends with the Sources section (`tail -n 5`) and that `<Exercicio` open-count == close-count.

5. **Orphaned / unbalanced structural tags + tool-call artifacts.**
   Missing `<ListaExercicios>` open tag (only the close existed), a duplicate `</ListaExercicios>` + Sources block mid-file leaving later exercises orphaned, and once a literal `</invoke>` tool-call artifact pasted into the MDX. Detect: count `<ListaExercicios` vs `</ListaExercicios` (must be 1 each), `<Exercicio` vs `</Exercicio>` (must match), and `grep -n 'invoke\|antml' <file>` for stray tool tags.

#### Mandatory self-check for ANY agent writing/translating a lesson file

Before declaring a file done, run and confirm ALL of:
```
node scripts/check-mdx-build.mjs <file>          # MUST print fail=0  (NOT check-rsc-all.mjs)
grep -c '<Exercicio' <file>                       # MUST equal the PT-BR source count
grep -c '<Exercicio' <file> == grep -c '</Exercicio>' <file>   # opens == closes
grep -n '`</Eq>' <file>                           # MUST be empty (missing-brace bug)
grep -noE '</?(Ejemplo|Ejercicio)\b' <file>       # MUST be empty (translated tag names)
tail -n 5 <file>                                  # MUST show ## Fontes/## Sources, not a cut-off tag
```
Translators get **`Read` + `Write` + `Bash`** for this verification loop (Bash is required to run the checker; the old "Read+Write only" rule was for blind Haiku bulk runs — for build-critical work the agent MUST verify with Bash).

---

## 4. Internationalization (i18n) — FROZEN 2026-08-06

**The live frontend serves PT-BR only.** Keeping 11 languages of lesson MDX in sync
with an evolving PT-BR source means re-running the LLM translation pipeline on every
content revision — a real, recurring token cost the project can't sustain right now
or in the near future. The owner's decision: converge the frontend to PT-BR, leave
everything already built in the repo untouched (nothing was deleted), and stop
routing/marketing the other languages until there's budget to resume.

**What actually changed (code):**
- `LocaleProvider` (`src/components/layout/LocaleProvider.tsx`) hardcodes
  `locale = 'pt-BR'`. No more URL-prefix parsing, `detectLocale()` (timezone/browser
  auto-detect), or `localStorage` preference. `DEFAULT_LOCALE` in `locales.ts` is now
  `'pt-BR'` (was `'en'`).
- `LocaleSwitcher.tsx` (the header language dropdown) is **deleted**. `Header.tsx` no
  longer renders it.
- `generateStaticParams()` in `app/[locale]/[categoria]/[...caminho]/page.tsx` and its
  `opengraph-image.tsx` sibling only emit PT-BR params now — the "walk
  `content/i18n/<locale>` and emit a route per translated file" loop was removed. Other
  locales' MDX files are untouched on disk; they just don't get a route anymore.
- `.github/workflows/deploy.yml`'s build matrix is down to a single `pt-br` job (was
  `pt-br` + `en`).
- `app/sitemap.ts`, `src/lib/seo/urls.ts` (`hreflangAlternatesFor`,
  `homeHreflangAlternates`, `localesAvailableFor`), and `src/lib/seo/metadata.ts`
  (`buildSectionMetadata`'s alternates loop, `alternateLocale` in Open Graph) were all
  simplified to only ever emit/consider PT-BR — otherwise sitemap/hreflang would point
  crawlers at URLs that 404 now.
- "11 idiomas" / "11 languages" bragging text removed from `app/layout.tsx`,
  `src/lib/seo/site.ts` (`SITE_DESCRIPTION_BY_LOCALE['pt-BR']`),
  `src/lib/seo/structured-data.ts`, `HomeHero.tsx` (flag banner + language count), and
  the `home.stats.features` PT-BR string in `translations.ts`.

**What did NOT change (still in the repo, just unreachable from the live site):**
`content/i18n/<locale>/aulas/...` (10 languages, incl. en-US 120/120),
`src/lib/i18n/translations.ts` (11-locale UI dictionary),
`src/content/audio-translations.generated.ts` (11-locale TTS strings),
`src/lib/i18n/locales.ts`'s `LOCALES`/`detectLocale`/timezone-country maps,
`src/lib/content/loader-i18n.ts` + `manifest.ts` + `scripts/generate-manifest.ts`
(multi-locale webpack bundling logic), the translator subagents
(`.claude/agents/translator-*.md`), and everything documented below in this section.

**To resume a locale:** re-add its matrix entry in `deploy.yml`, restore the
"translated locales" loop in both `generateStaticParams()` functions, restore the
multi-locale logic in `sitemap.ts`/`urls.ts`/`metadata.ts`, and re-add the
`LocaleSwitcher` to `Header.tsx` (or rebuild it — it's small). Everything below this
point describes how the pipeline worked while it was active; it's still accurate for
when this resumes.

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
| Lesson MDX bodies | `content/i18n/<speechLang>/aulas/...` | **en-US ✅ 120/120 (re-synced 2026-05-31) · 9 locales stale vs new PT-BR** | **Claude subagents** — Haiku primary, Sonnet for oversized, Opus 4.8 for the few 1257–1575-line files that truncate |

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

**Translation-specific rows below are paused along with i18n (§4, frozen 2026-08-06).**
The tiering discipline itself (Haiku → Sonnet → Opus, ask before escalating) still
applies to all other work — lesson authoring, refactors, reviews.

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
│   ├── [locale]/[categoria]/...     ALL lessons incl. PT-BR (/pt-br/...); other
│   │                                 locales' generateStaticParams frozen (§4)
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
3. **Translation pipeline is FROZEN (2026-08-06)** — frontend converged to PT-BR only for cost reasons; don't spin up translator subagents or resume locale builds without explicit owner sign-off. When it was active it was Claude-based — Haiku for bulk, Sonnet for oversized, Opus rarely (ask first). See §4.
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

- ✅ **120/120 lessons CLEAN** against the L1 canonical template (100% conformity, 2026-05-30).
- ✅ **PT-BR source perfected (2026-05-31).** Full-corpus copy-edit + math-correctness audit:
  - **932 language fixes** (accents/diacritics, grammar, crase, agreement, awkward phrasing, stray editorial artifacts, English-in-prose).
  - **819 exercise math-correctness fixes** (wrong `correta` flags re-pointed, missing answers added to option sets, body/solução/option mismatches reconciled, duplicates de-duped).
  - **5 cascade-shuffled banks regenerated** (lessons whose entire `<ListaExercicios>` was the wrong topic): **L13** funções trig (was ellipses), **L14** equações trig (was sequences), **L16** sequências (was exp/log), **L112** transformações lineares (was dot/cross products), **L113** núcleo e imagem (was lines/planes) — ~200 new on-topic, book-sourced MC exercises (Beezer, Hefferon, OpenStax A&T, Stitz–Zeager).
  - **Verified:** 120/120 compile (0 FAIL via `scripts/check-rsc-all.mjs`), **5,319 MC exercises with exactly one `correta:true` (0 violations)**.
  - Residual per-exercise oddities (a few corrupt source enunciados, intentional `Confirme` duplicate pairs, textbook-figure exercises) are individually self-consistent and logged; not blocking.
- ✅ **5,319 sourced exercises** (100% with `solucao+fonte`, 100% with MC `opcoes` + single `correta`, ~25% with `passos`).
- ✅ **1,800 exam questions** (12 trimesters × 10 versions × 15 questions) in `provas-data.ts` — **100% with MC** `opcoes` arrays (1,800/1,800 questions have plausible distractors).
- ✅ All 120 lessons stabilized to the Lição 1 canonical template (L14-L120 rewritten 2026-04 → 2026-05; build green).
- ⏸️ **i18n FROZEN 2026-08-06** (§4) — frontend now serves PT-BR only. The bullets below
  are the state the multilingual effort was in when it paused; kept for when it resumes,
  not reflective of what's live today.
  - UI dictionary complete for 11 locales (`translations.ts`); TTS strings complete for 11
    locales (`audio-translations.generated.ts`). Neither is reachable from the UI anymore
    (no switcher, `LocaleProvider` hardcoded to pt-BR).
  - **MDX lesson translations — measured by EXERCISE-SYNC** (per-lesson `<Exercicio` count
    == current PT-BR; file-existence % is NOT the real bar and over-reported coverage
    badly): **only PT-BR and en-US were 100% (120/120)** as of the freeze. All others were
    stale vs the 2026-05-31 PT-BR — exercise counts changed via the math + regen passes, so
    even fully-filed locales were short the new/corrected exercises. Exercise-synced at
    freeze time: es-ES 25/120 · zh-CN 28 · pl-PL 25 · de-DE 22 · fr-FR 21 · it-IT 19 ·
    ko-KR 9 · ru-RU 10 · ja-JP 9.
    - en-US was re-synced via Haiku subagents (primary); the 6 largest files (1257–1575
      lines, where Haiku's 32k cap truncates) were finished with **Opus 4.8
      one-at-a-time** after Sonnet's structured-output step kept failing on them.
    - **Re-sync playbook (for when this resumes):** for each lesson compare
      `grep -c '<Exercicio'` of target vs PT-BR source; re-translate every
      mismatch/missing file (Haiku → Sonnet for >1050 lines → Opus 4.8 for the ~6
      giants); then `scripts/fix-translated-frontmatter.py --only <locale>`; verify
      120/120 exercise-sync + orphan-slug check; then re-add the locale to the CI matrix
      and restore the `generateStaticParams`/sitemap/hreflang loops (§4).
  - Provas i18n was never started (paused with everything else).
- ✅ Footer with `version · commit · timestamp` (currently `0.2.0`).
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

> **Last update:** 2026-08-06. **i18n frozen — frontend converged to PT-BR only** (owner decision: the LLM token cost of keeping 11 languages of lesson MDX in sync with an evolving PT-BR source isn't sustainable now or in the near future). Nothing was deleted — `content/i18n/`, `translations.ts`, `audio-translations.generated.ts`, the translator subagents, and the multi-locale build machinery all stay in the repo as paused inventory. What changed: `LocaleProvider` hardcoded to pt-BR, `LocaleSwitcher` deleted, `generateStaticParams()` (lesson page + OG image) emits PT-BR only, CI matrix down to one `pt-br` job, sitemap/hreflang/Open-Graph alternates collapsed to PT-BR, and "11 idiomas" marketing copy removed from README, homepage, and SEO metadata. Full detail in §4. See also `docs/i18n.md`, `docs/IDENTITY.md` for docs updated in the same pass.
>
> **2026-06-02 (superseded by the freeze above for anything i18n-related):** en-US 120/120 made BUILD-clean (acorn): fixed 30 files the lenient check-rsc-all.mjs had passed but `next build` rejected — 244 missing-brace `<Eq>{`...`}</Eq>`, 38 translated component tags (Ejemplo/Ejercicio), bare </> operators in JSX, truncated/orphaned tags. Added scripts/check-mdx-build.mjs (acorn, build-accurate) as the authoritative verifier; documented all defect classes in §3 "Translator mistakes that broke the build". Earlier 2026-05-31: PT-BR source perfected: 932 language fixes + 819 exercise math-correctness fixes + 5 cascade-shuffled exercise banks regenerated (L13/14/16/112/113); 120/120 compile, 5,319 MC exercises with 0 `correta` violations. en-US re-synced 120/120 to the new PT-BR (last 6 oversized files via Opus 4.8 one-at-a-time). All other locales are now STALE vs the updated PT-BR and need re-sync (compare per-file `<Exercicio` counts). **Orchestration note:** translation/audit waves run as Workflow subagents — they DIE if the launching turn is interrupted, so verify journal *freshness* (mtime), not just result counts, and resume on the remaining set. If you change a convention, edit this file in the same commit.
