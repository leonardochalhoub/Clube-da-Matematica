# Lesson Template — `licao-01-conjuntos-intervalos.mdx` is the standard

> **The only canonical template for every lesson in the curriculum is**
> [`content/aulas/ano-1/trim-1/licao-01-conjuntos-intervalos.mdx`](../../../content/aulas/ano-1/trim-1/licao-01-conjuntos-intervalos.mdx).
>
> This document codifies what makes Lição 1 the standard, so any new lesson
> (or any AI agent / contributor working on existing lessons) can replicate
> the structure without re-deriving it from scratch.
>
> If something here contradicts what the file does, **trust the file**.
> Update this doc + flag the discrepancy.

## Files

- [`anatomy.md`](./anatomy.md) — section-by-section breakdown of Lição 1.
- [`checklist.md`](./checklist.md) — paste-ready checklist a contributor or
  agent runs through before merging a new lesson.
- [`mdx-syntax-traps.md`](./mdx-syntax-traps.md) — the JSX/MDX gotchas that
  silently kill builds (we hit every one of them; documented so nobody else
  has to).
- [`prompt-for-authoring-agent.md`](./prompt-for-authoring-agent.md) — the
  exact briefing to hand a Gemini/Haiku/Groq subagent when you delegate
  authoring of a lesson or part of a lesson.

## ⚠️ Inviolable rule (read first)

**Every single `<Exercicio>` and `<Exemplo>` — without exception — must
have its source.** A `fonte={{ livro, url, secao, exercicio, pagina,
licenca }}` prop on exercises, a `**Fonte.** [Book](url) — licença Y` line
at the end of examples. Books are the ledger; AI never invents content. If
you cannot find an open-licensed source for the topic you want to cover,
pick a different topic. **No exceptions, no "I'll add the source later",
no "this one is obvious". Every exercise. Every example. Always.**

## The four-line summary

1. **5 worked examples**, ordered by ascending difficulty (aplicação →
   intermediário → avançado → modelagem real). Each `<Exemplo>` ends with
   `**Fonte.** [Book §X.Y](url) — licença Y` pointing to its source.
2. **30–80 exercises** in `<ListaExercicios>`, every one with `solucao`
   and `fonte`. **~25% (the gabaritado random pick) additionally have
   `passos`** — a multi-line ordered walkthrough with the *thinking*, not
   just the answer.
3. **Multiple choice everywhere a student would otherwise type.** No text
   `<input>` for answers — the student writes in a paper caderno; the site
   shows answer/solution/passos via buttons.
4. **Books are the ledger.** AI never invents an exercise or example. Every
   `<Exercicio>` and `<Exemplo>` has `fonte={{ livro, url, secao, pagina,
   exercicio, licenca }}` (or a `**Fonte.**` line) pointing to a real open
   book. If you can't source it, don't write it.

## Cross-references

- Rules formally codified in:
  - [`/CLAUDE.md` §3 + Hard rules #7–#9](../../../CLAUDE.md)
  - [`/docs/EDITORIAL-RULES.md` §5–§7](../../EDITORIAL-RULES.md)
- Component docs:
  - [`<Exercicio>` props (`opcoes`, `solucao`, `passos`, `fonte`)](../../../src/components/math/ListaExercicios.tsx)
  - [`<Exemplo>` (use plain `**Fonte.**` line at end)](../../../src/components/math/Callouts.tsx)
  - [`<EquacaoCanonica>` (audio with `audioTexto`)](../../../src/components/math/EquacaoCanonica.tsx)
- Wolfram link generation: [`/docs/kb/wolfram-alpha/`](../wolfram-alpha/README.md)
