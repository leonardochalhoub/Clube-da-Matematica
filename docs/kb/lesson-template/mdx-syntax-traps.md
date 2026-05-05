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

## SVG figures with `.map()` — render as empty boxes

The next-mdx-remote/rsc compileMDX path doesn't fully evaluate JSX expressions that use `Array.map()` with computed positions inside `<svg>`. The figure renders with caption visible but the SVG content is empty.

**Bad:**
```mdx
<svg viewBox="0 0 480 220">
{[
  {y:30,label:"[a, b]"},
  {y:75,label:"(a, b)"},
].map((row,i) => (
  <g key={i}>
    <text x="10" y={row.y+5}>{row.label}</text>
    <line x1="180" x2="450" y1={row.y} y2={row.y}/>
  </g>
))}
</svg>
```

**Good — explicit `<g>` blocks, static JSX:**
```mdx
<svg viewBox="0 0 480 220">
<g>
  <text x="10" y="35">[a, b]</text>
  <line x1="180" x2="450" y1="30" y2="30"/>
</g>
<g>
  <text x="10" y="80">(a, b)</text>
  <line x1="180" x2="450" y1="75" y2="75"/>
</g>
</svg>
```

Same lesson — just precompute the `.map()` results and write them out explicitly. No conditional ternaries with computed children either; expand both branches into static JSX.

## `<Equation>{`...`}</Equation>` template-literal children

The `Equation` component expects `children: string` — a plain string. When MDX wraps the template-literal `{`...`}` in JSX expression children, compileMDX-rsc can pass a React element instead of the raw string. Result: empty Equation block above the explanation text.

**Mitigation already in `Equation.tsx`** (extracts string from React children recursively). If you see an Equation rendering empty, check that the component's `latex` extraction handles your case.

## Lesson rendering pipeline — DEFINITIVE

`app/[categoria]/[...caminho]/page.tsx` MUST use `compileMDX` from `next-mdx-remote/rsc` (read MDX from disk per request). NEVER the `carregarMdx` manifest path.

**Why never manifest:** webpack tries to compile the full 956-module chunk graph (120 MDX × all imports) on first dev request. Peaks at ~13.7 GB RAM, OOMs every 15 GB system. Production `next build` handles it (one-shot, more memory available in CI), but dev mode dies.

**If something renders wrong with compileMDX**, the fix is in the MDX source (replace `.map()` with explicit blocks) or the components map — never switch pipelines.

## Discovered 2026-05-05 — compileMDX-rsc props drops + the FIX

**Problem.** When the route file uses `compileMDX` from `next-mdx-remote/rsc`, JSX expression props on components are silently dropped at runtime. Plain string props survive.

| Prop syntax | What survives compileMDX-rsc |
|---|---|
| `prop="text"` (plain string) | ✅ kept |
| `prop={"text"}` (string in expression) | ❌ dropped |
| `prop={`...`}` (template literal) | ❌ dropped |
| `prop={[...]}` (array) | ❌ dropped |
| `prop={{...}}` (object) | ❌ dropped |
| `prop={<>...</>}` (JSX fragment) | ❌ dropped |
| Inline `<Eq>{`...`}</Eq>` inside markdown text | ✅ kept (markdown→JSX path) |

**Symptom.** Exercises render with question text but no "Ver solução" button, no opcoes radios, no source pill, no "Ver passo a passo". Equations render as empty boxes above their explanation. The `<Exercicio>` arrives at `<ListaExercicios>` with only `numero`, `dificuldade`, and resposta string props — every other prop is undefined.

**Fix.** The lesson rendering pipeline MUST use the **webpack manifest path** (`carregarMdx` from `src/lib/content/manifest.ts`), NOT compileMDX. The manifest path goes through `@next/mdx` loader which evaluates JSX expressions correctly at build time.

The `app/[categoria]/[...caminho]/page.tsx` route must do:
```ts
import { carregarMdx } from '@/lib/content/manifest'
// ...
const mod = await carregarMdx(completo)
const MDXContent = mod.default
return <LessonPageShell ...><MDXContent /></LessonPageShell>
```

NOT compileMDX-rsc.

**Memory cost.** Manifest path bundles all 120 MDX entries via webpack `() => import(...)`. In dev this peaks at ~13.7 GB RAM during first-route compile. On a 15 GB system without enough headroom, dev OOMs.

**Two viable workflows:**

1. **Full repo, slow dev, perfect deploy.** Keep the full manifest. `next dev` is heavy (~30s first compile of a lesson, may OOM if memory tight) but `next build` produces a fully-rendered static export that serves in ~1 ms.

2. **Slim manifest while iterating on one lesson.** Temporarily reduce `manifest.ts` to just the lesson(s) you're working on. Webpack only compiles those, dev becomes light, and rendering is identical (since the manifest path is the same). Restore the full manifest before committing.

## Compatibility rules for MDX content (apply to ALL lessons)

These rules apply regardless of which rendering path is active — they keep MDX portable so any future change of pipeline doesn't silently break content.

### `<Equation>` blocks: use `latex="..."` prop, never template-literal children

**Bad:**
```mdx
<Equation explicacao="...">
{`(A \\cup B)^c = A^c \\cap B^c`}
</Equation>
```

**Good:**
```mdx
<Equation explicacao="..." latex="(A \cup B)^c = A^c \cap B^c" />
```

Notes:
- Single backslashes (string-literal) instead of double (template literal).
- Plain string is robust against compileMDX-rsc drops, and reads cleaner.
- Self-closing tag (no body needed).

### SVG figures: never `.map()` returning JSX

The MDX→JSX→RSC pipeline doesn't always carry computed positions through `.map()`. Always expand to explicit `<g>` blocks.

**Bad:**
```mdx
<svg viewBox="0 0 480 220">
{[{y:30,label:"a"},{y:75,label:"b"}].map((row,i)=>(
  <g key={i}><text y={row.y}>{row.label}</text></g>
))}
</svg>
```

**Good:**
```mdx
<svg viewBox="0 0 480 220">
<g><text y="30">a</text></g>
<g><text y="75">b</text></g>
</svg>
```

### Backslash escaping in markdown-blockquote citations

Inside `> "..."` blockquote with `$math$`, the math is opaque to remark-math but markdown still processes the surrounding text. Backslashes inside the math need to be **single** (KaTeX syntax), not double.

**Bad** (renders as literal `m/nmidm e n são inteiros e nneq0`):
```mdx
> "O conjunto é $\\{m/n \\mid m \text{ e } n \text{ são inteiros e } n \\neq 0\\}$"
```

**Good** (renders as proper KaTeX):
```mdx
> "O conjunto é $\lbrace m/n \mid m \text{ e } n \text{ são inteiros e } n \neq 0 \rbrace$"
```

Use `\lbrace` / `\rbrace` instead of `\{` / `\}` to avoid both markdown and JSX escape rules. `\mid`, `\neq`, `\leq`, `\in` etc. always single-backslash inside markdown blockquotes.
