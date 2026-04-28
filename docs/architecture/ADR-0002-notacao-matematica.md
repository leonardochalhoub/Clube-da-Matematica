# ADR-0002 — Notação Matemática

**Data:** 2026-04-28 · **Status:** Aprovado · **Decisor:** dono + conselho

## Decisão

**KaTeX como renderizador único**, server-side via `rehype-katex` no pipeline MDX. Output `htmlAndMathml` (visual + semântico para leitores de tela). Macros globais em `katex-macros.json`. Sem fallback MathJax.

## Por quê KaTeX e não as outras

| Critério | KaTeX | MathJax | Typst | MathML puro |
|---|---|---|---|---|
| Render speed | ✅ ~ms | ❌ lento | ✅ ms | ✅ |
| SSR build-time | ✅ nativo | ⚠️ caro | ⚠️ imaturo | ✅ |
| Cobertura cálculo + finanças | ✅ 100% | ✅ | ✅ | ⚠️ |
| Bundle | ✅ ~95kB | ❌ ~500kB | ⚠️ | ✅ 0 |
| Visual cross-browser | ✅ | ✅ | ✅ | ❌ feio |

KaTeX cobre tudo do escopo previsto (cálculo, EDPs, álgebra linear, probabilidade, finanças quantitativas). Performance + SSR são críticos pro WHY (mobile, rede ruim, indexável). Typst reavaliar em 2027 se `typst.ts` amadurecer.

## Padrões obrigatórios

### Sintaxe MDX
- Inline: `$f(x)$`
- Display: `$$\int_a^b f(x)\,\d x$$`
- Numerada: `\tag{1}` dentro do display

### Convenções (ISO 80000-2)
- Operadores em romano: `\sin`, `\cos`, `\log`, `\ln`, `\d x`, `\e^x`
- Vetores em **negrito**: `\mathbf{v}` (não seta `\vec`)
- Matrizes em maiúsculo negrito: `\mathbf{A}`
- Conjuntos numéricos via macros: `\R`, `\N`, `\Z`, `\Q`, `\C`
- Distribuições: `X \sim \mathcal{N}(\mu, \sigma^2)`
- Esperança/Probabilidade via macros: `\E[X]`, `\Prob(A)`

### Acessibilidade obrigatória
- KaTeX configurado com `output: "htmlAndMathml"`
- Plugin custom: cada fórmula recebe `aria-label` derivado do LaTeX-source
- Display equations envoltas em `<figure role="math">` com `<figcaption>` em prosa descrevendo a fórmula para leitor de tela

### Copy-paste
KaTeX inclui automaticamente o LaTeX-source como texto invisível. Usuário copia a fórmula renderizada e cola como LaTeX em qualquer outro editor — crítico para open source.

## Macros globais

Definidas em `docs/architecture/katex-macros.json`. Importadas no `rehype-katex` config. Toda fórmula do site que usa conjunto, esperança, derivada, norma, etc. **deve** usar a macro — nunca a expansão completa. CI lintaria isso (futuro).

## Consequências

✅ Build rápido · indexável (Google entende fórmulas) · mobile performante · LaTeX copyable · acessível
❌ TikZ / diagramas comutativos exóticos exigem SVG manual ou Excalidraw separado (escopo limitado)
