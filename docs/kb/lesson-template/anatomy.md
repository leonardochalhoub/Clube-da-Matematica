# Anatomy of Lição 1 — section-by-section reference

Every lesson follows **this exact ordering**. The component count and density
of each section may vary by topic, but the sequence and the rule per section
do not.

```
1. Frontmatter (YAML)
2. <EquacaoCanonica> — the equation that defines the lesson
3. <aside> — 3 books that cover this lesson (top-of-page sources)
4. <DuasPortas> — 7 doors (formal + 5 + 10 + 15 + 25 + 40 + prática)
5. ## Exemplos resolvidos — 5 examples, ascending difficulty
6. <ListaExercicios> — 30–80 exercises, 25% with passos
7. ## Fontes — bibliography of EVERY book referenced
```

---

## 1. Frontmatter

YAML block with the metadata schema in [`src/content/schema.ts`](../../../src/content/schema.ts):

```yaml
---
titulo: "Lição N — Title in PT-BR"
slug: "licao-NN-slug"
categoria: "aulas"
subcategoria: "ano-X-trim-Y"
descricao: "One sentence in PT-BR."
ordem: NN
publicado: true
tags: ["topic", "ano-X", "trim-Y"]
prerrequisitos: ["licao-NN-1-slug"]
autores: ["Clube da Matemática"]
atualizadoEm: "2026-MM-DD"
usadoEm: ["1.º ano EM (15 anos)", "Equiv. Math I japonês", ...]
---
```

**Always:** `titulo` starts with `"Lição N — "` (not "Aula"). Source
language is PT-BR. `usadoEm` situates the lesson cross-culturally.

---

## 2. `<EquacaoCanonica>` — the visual hero

The equation that *is* the lesson. Always:

```mdx
<EquacaoCanonica
  formula="\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}"
  legenda={<>Plain prose with <strong>strong</strong> + <Eq>{`\\sqrt{2}`}</Eq>.</>}
  audioTexto="Texto natural em PT-BR para Web Speech API ler."
/>
```

- `formula` is LaTeX **without** `$$` delimiters.
- `legenda` is a JSX fragment (math goes in `<Eq>{`...`}</Eq>` to survive JSX).
- `audioTexto` is **mandatory** — accessibility rule (blind users + page reader).

---

## 3. Books header — `<aside>` with 3 source books

Right under `<EquacaoCanonica>`, before `<DuasPortas>`:

```mdx
<aside className="not-prose my-6 rounded-xl border border-clube-mist-soft/40 bg-clube-cream-soft p-5 text-clube-ink">
  <h3 className="!mt-0 mb-3 text-sm font-semibold uppercase tracking-wider text-clube-mist">
    Livros que cobrem esta lição
  </h3>
  <ul className="space-y-2.5 text-sm leading-relaxed">
    <li>
      <a href="https://..." target="_blank" rel="noopener noreferrer" className="font-semibold text-clube-teal hover:text-clube-teal-deep">
        OpenStax — College Algebra 2e
      </a>
      <span className="text-clube-mist"> · §1.1 Real Numbers · CC-BY 4.0 · </span>
      <em className="text-clube-mist">Conjuntos numéricos, intervalos.</em>
    </li>
    <li> ... </li>
    <li> ... </li>
  </ul>
</aside>
```

**Rule:** exactly **3 books** that cover the lesson topic. They must also
appear later in `## Fontes`. Each book gets:

- Bookname as the link.
- Section reference + license + one-line scope description.

---

## 4. `<DuasPortas>` — the 7 doors

```mdx
<DuasPortas>
  <Porta nivel="formal" titulo="Definição rigorosa">…</Porta>
  <Porta nivel="5"      titulo="For a 5-year-old">…</Porta>
  <Porta nivel="10"     titulo="For a 10-year-old">…</Porta>
  <Porta nivel="15"     titulo="For a 15-year-old">…</Porta>
  <Porta nivel="25"     titulo="For an engineering student">…</Porta>
  <Porta nivel="40"     titulo="For a senior professional">…</Porta>
  <Porta nivel="pratica" titulo="Practical application">…</Porta>
</DuasPortas>
```

Inside each `<Porta>`:

- The **formal** door is the most rigorous. Uses `<Definicao>`, `<Teorema>`,
  `$$...$$` math display blocks, and inline `$x$` math.
- The **5/10/15/25/40** doors are progressive difficulty levels — the
  "porta" you choose tunes the explanation to your level. The 40-year-old
  door is dense and technical; the 5-year-old is simple but never
  infantilizing.
- The **prática** door is real-world examples (4 examples typical: ENEM
  faixa, IR, glicemia faixas, custo de fabricação). Connects abstract math
  to concrete decisions a student/professional makes.

---

## 5. `## Exemplos resolvidos` — exactly 5 worked examples

```mdx
## Exemplos resolvidos

> Cinco exemplos com dificuldade crescente — do mais direto (listar elementos)
> ao modelagem (faixa de operação com exclusão de ponto). Cada exemplo cita
> sua fonte: o problema original vem sempre de um livro aberto.

<Exemplo titulo="Exemplo 1 — Topic (aplicação)" numero="1">
  **Problema:** ...
  **Estratégia:** ...
  **Resolução:**
  1. step
  2. step
  ...
  **Verificação:** ...
  **Fonte.** [Book §X.Y](url) — licença Y.
</Exemplo>
```

**Rules:**
- **Exactly 5 examples.** Not 4, not 10. Three was tested (too few); ten was
  tested (too many — students lose patience).
- **Ascending difficulty:** label each title with the level explicitly in
  parens — `(aplicação)`, `(intermediário)`, `(avançado)`, `(modelagem
  real)`. Lição 1 mix: 1 aplicação · 2 intermediários · 1 avançado · 1
  modelagem.
- **Every example has `**Fonte.**`** at the end — links to the source
  problem, never invented.
- **`titulo=` must NOT include "Exemplo N —" prefix.** The component
  renders the prefix automatically: `<Exemplo titulo="Listando..."
  numero="1">` displays as `Exemplo — 1 · Listando...`. Putting "Exemplo
  1 —" in titulo gives the duplicate `Exemplo — 1 · Exemplo 1 — Listando...`.
- Title text **must NOT contain `$...$`** (MDX attribute parser breaks).
  Use literal Unicode like `|u| ≤ c` instead.

---

## 6. `<ListaExercicios>` — 30–80 exercises

```mdx
<ListaExercicios seed="licao-NN-slug">

> **Lista do caderno.** São N exercícios em K blocos crescentes de dificuldade.
> **Resolva no papel.** Compilada de [book A] (cap. X), [book B] (§Y), etc.

### Bloco A — Topic (NN.1 a NN.10)

<Exercicio numero="NN.1" dificuldade="aplicacao"
  opcoes={[
    { texto: "Right answer", correta: true },
    { texto: "Distractor 1" },
    { texto: "Distractor 2" },
    { texto: "Distractor 3" },
  ]}
  solucao={<>One short paragraph. Math via <Eq>{`\\leq`}</Eq>.</>}
  passos={<>  {/* Only on ~15 of 60 (25% gabaritado) */}
    <ol>
      <li><strong>What's being asked?</strong> ...</li>
      <li><strong>Restate as inequations.</strong> ...</li>
      <li><strong>Solve step.</strong> ...</li>
      <li><strong>Check.</strong> ...</li>
    </ol>
    <p><em>Macete:</em> remember-this-rule.</p>
  </>}
  fonte={{ livro: "OpenStax College Algebra 2e", url: "https://...", secao: "§1.1", exercicio: "ex. 5", licenca: "CC-BY 4.0" }}
>
  Statement of the exercise.
</Exercicio>

<!-- ... 30 to 80 exercises in 5–6 blocos ... -->

</ListaExercicios>
```

**Rules:**
- **30–80 exercises.** Lição 1 has 60. Less than 30 is too thin for a
  trimester pace; more than 80 is fatigue.
- **Difficulty mix per blocos:** ~60% `aplicacao` (drill), ~15%
  `compreensao` (conceitual), ~15% `modelagem` (real-world), ~10%
  `desafio` / `demonstracao` (challenge / proof).
- **Every exercise has `solucao`.** Always shown via "Ver solução" button.
- **Every exercise has `fonte`.** Books-as-ledger rule. `referencia=` is
  legacy — use `fonte={{...}}` for new content.
- **Every short-answer exercise is multiple choice (`opcoes={[...]}`).**
  The component does not render text-input fields anymore (notebook-first).
- **~25% of exercises have `passos`** — chosen for pedagogical breadth
  (cover all blocs, all difficulty levels, key techniques). Lição 1 example
  picks: 1.1 (set-builder reading), 1.7 (interval intersection), 1.13
  (irrational membership), 1.14 (modular inequality), 1.18 (interval ops),
  1.25 (inclusion-exclusion), 1.27 (sqrt(2) demonstration), 1.30 (quadratic
  inequality), 1.34 (modular inequality split), 1.42 (system of
  inequalities), 1.46 (engineering tolerance), 1.50 (piecewise function),
  1.51 (real-world filter), 1.54 (heart-rate calc), 1.57 (Cantor set).

---

## 7. `## Fontes` — full bibliography

At the very bottom, a flat list of every book used in this lesson:

```mdx
## Fontes

> Apenas livros que **alimentaram diretamente** o texto e os exercícios.

- [**OpenStax College Algebra 2e**](https://...) — Year · EN · CC-BY · §1.1, §1.7.
- [**Stitz–Zeager Precalculus**](https://...) — Year · EN · CC-BY-NC-SA · cap. 1.
- [**Hammack — Book of Proof**](https://...) — Year · EN · livre · caps. 1, 3, 6.
- ... etc
```

This MUST include every book referenced in `fonte={{...}}` of any exercise
or `**Fonte.**` of any example, plus the 3 in the books-aside.

---

## Cross-cutting rules

- **MDX-syntax traps:** see [`./mdx-syntax-traps.md`](./mdx-syntax-traps.md).
- **Wolfram-friendly exercise wording:** see
  [`/docs/kb/wolfram-alpha/`](../wolfram-alpha/README.md). Pipeline already
  handles most translations; the rare cases that don't translate cleanly
  should be authored to match a Wolfram-supported form.
- **i18n:** PT-BR is the source. Translations live in `content/i18n/<speechLang>/`
  and translate the body text only — `fonte={{...}}`, slugs, frontmatter,
  and exercise *structure* never change across locales.
- **Audio:** `<EquacaoCanonica>` always has `audioTexto`. Body equations
  (`<Equation>`) get `audioTexto` only for the lesson's hero formula(s).
  The page-wide reader (`<PageAudioReader>`) walks the article and picks up
  these `data-audio-texto` attributes — without them it falls back to a
  LaTeX→PT prose converter.
