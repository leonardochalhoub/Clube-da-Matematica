# MDX/JSX syntax traps that silently kill builds

These are the bugs we hit (often multiple times) authoring Lição 1.
Knowing them upfront saves 30+ minutes of bisecting per lesson.

## 1. `<` inside `solucao={<>...</>}` JSX expressions

JSX parses `<` as the start of a tag. Math like `$x < 5$` inside a JSX
fragment body becomes a parse error: `Could not parse expression with acorn`.

**Bad:**
```mdx
solucao={<>"$x < 5$" é estrito.</>}
```

**Good:**
```mdx
solucao={<>"<Eq>{`x < 5`}</Eq>" é estrito.</>}
```

The `<Eq>{`...`}</Eq>` form puts math in a JS template literal, which is
not parsed as JSX text. Backslashes inside the template literal must be
doubled (`\\leq`).

## 2. `\{` and `\}` (set braces) inside JSX expressions

JSX parses `{` as expression delimiter. `$\{1, 2, 3\}$` inside a JSX
fragment body parses `\{` as backslash + JSX-expression-start, evaluates
`{1, 2, 3}` as a comma expression returning `3`, then trips on the closing
`\}`.

Same fix: wrap in `<Eq>`. Inside the template literal, double the
backslashes: `<Eq>{`\\{1, 2, 3\\}`}</Eq>`.

## 3. `$$...$$` math display blocks inside JSX expressions

`$$...$$` only triggers `remark-math` in **plain markdown**. Inside a JSX
expression body, the dollar signs are literal text — and any `\\`, `<`, or
`{...}` inside breaks parsing or renders broken.

**Bad:**
```mdx
passos={<>
  $$ P(q) = \begin{cases} 1{,}80q & \text{se } 0 \leq q \leq 1000 \\ ... \end{cases} $$
</>}
```

**Good:**
```mdx
passos={<>
  <Eq>{`P(q) = \\begin{cases} 1{,}80\\,q & \\text{se } 0 \\leq q \\leq 1000 \\\\ ... \\end{cases}`}</Eq>
</>}
```

## 4. `$...$` inside HTML attributes

The `<Exemplo>`, `<Definicao>`, `<Teorema>` components take a `titulo="..."`
prop. HTML attributes do not invoke `remark-math` — `$...$` is literal text.
And anything weird inside (like `$|u| \leq c$`) confuses the MDX attribute
parser.

**Bad:**
```mdx
<Exemplo titulo="Exemplo 3 — Inequação $|u| \leq c$" numero="3">
```

**Good:**
```mdx
<Exemplo titulo="Exemplo 3 — Inequação |u| ≤ c (intermediário)" numero="3">
```

Use literal Unicode characters (`≤`, `≥`, `∞`, `∪`, `∩`, etc.) for math in
attributes.

## 5. Bare `{,}` in prose

`1{,}5` (the LaTeX way to write `1,5` with no spacing) outside math context
makes MDX read `{,}` as a JSX expression — which is a syntax error.

**Bad:** `O preço é R$ 1{,}80 por litro.`

**Good:** `O preço é R\$ 1,80 por litro.` (use a literal comma; escape `$`
with `\$` to avoid triggering math).

## 6. Bare `<` followed by digit / letter

`<5s` in prose makes MDX try to parse `<5s>` as a JSX tag, fails.

**Bad:** `Tempo de resposta < 5s.`

**Good:** `Tempo de resposta menor que 5 s.` or `Tempo de resposta $< 5$ s.`

## 7. Stray `</content>` from translator agents

Some LLM translation agents leak HTML-ish tokens like `</content>` at the
end of their output. These render as raw text and look broken. Always sweep
for `</content>` and `<content>` after batch translation.

## 8. JSX-fragment children inside React component props that cross client boundary

`next-mdx-remote/rsc`'s `compileMDX` **strips** all JSX expression-attribute
props (`opcoes={[...]}`, `fonte={{...}}`, `solucao={<>...</>}`,
`passos={<>...</>}`). Only string-literal props (`numero="X"`,
`dificuldade="Y"`) survive. This makes exercises render as bare text with
no MC, no solution buttons, no fonte.

**Avoid `compileMDX` for routes that need complex props.** Use the webpack
manifest dynamic import (`carregarMdx(completo)` from
`src/lib/content/manifest.ts`) — webpack compiles MDX statically and
preserves all expression props.

The trade-off: webpack must bundle all 120 lesson MDX files, which forces
`NODE_OPTIONS=--max-old-space-size=8192` (or higher) for builds and dev.

## 9. `data-*` attributes — kebab-case in JSX, but render correctly

```jsx
<section data-audio-texto={audioTexto ?? undefined}>
```

If `audioTexto` is `undefined`, React omits the attribute entirely (good).
If a string, it appears in the DOM as `data-audio-texto="..."` — the
`PageAudioReader` reads it via `el.getAttribute('data-audio-texto')`.

## 10. Webpack OOM on lesson route compilation

Symptom: dev server crashes with V8 heap OOM. Cause: webpack tries to
bundle all 120 MDX files at once when compiling `/[categoria]/[...caminho]`.

Mitigations:
- `NODE_OPTIONS=--max-old-space-size=8192` (or 10240) at minimum.
- `next build` for static export needs the same.
- Once a lesson is compiled in dev, subsequent loads are <1s.
- If memory is tight (<16 GB total RAM), kill VS Code servers / heavy
  processes before running `next dev`.
