# Cálculo 1 (Ensino Superior) exercise re-source — agent instructions

**AUTHORIZED.** Re-source one Ensino Superior Cálculo lesson from the parsed
open-book corpus. The current exercises are AI-written (bare `<Exercicio
numero={N} fonte="free-text">`, no multiple-choice, fabricated citations like
Stewart/Guidorizzi/Apostol). Replace them with REAL corpus exercises in the
canonical format.

## Read first
1. `scripts/REGEN-INSTRUCTIONS.md` — the full standard (MDX rules, option `texto`
   = `$…$` strings NOT `<Eq>`, difficulty mix, verify step).
2. `content/engenharia/calculo-1/unidade-1/cal1-u1-l05-limites-infinito-assintotas.mdx`
   — the FORMAT REFERENCE (already correct: one `<ListaExercicios seed="…">`
   wrapping `<Exercicio>` blocks with `opcoes`, `solucao={<>…</>}`, `fonte={{…}}`).

## What to do
- Inputs given in the spawning prompt: lesson file, candidate pool
  `/tmp/cand2/<slug>.jsonl`, the lesson number N, and the topic.
- REPLACE the ENTIRE `## Exercícios` section — from the `## Exercícios` heading to
  the END of the file — with:
  - a `## Exercícios` heading, then
  - ONE `<ListaExercicios seed="<slug>"> … </ListaExercicios>` containing ~30
    multiple-choice exercises authored from the pool.
- Keep EVERYTHING before `## Exercícios` (frontmatter, doors, `## Exemplos
  resolvidos`, etc.) byte-identical. Use Edit to replace from `## Exercícios` on.

## Each exercise
- `numero="N.1"`, `"N.2"`, … (N = the lesson number from the prompt).
- 4 `opcoes` — string `texto` using `$…$` math (NOT `<Eq>`), exactly one
  `correta: true`, three plausible distractors.
- `solucao={<>…</>}` short + correct; ~1 in 4 also `passos={<>…</>}`.
- difficulty mix ≈60% aplicacao / 15% modelagem / 15% compreensao / 10% desafio.
- `fonte=` an OBJECT copied VERBATIM from the chosen candidate row's `fonte` field.
  Each exercise from a DISTINCT candidate. NEVER invent a source/URL/section.

## Verify (required)
`node scripts/check-mdx-render.mjs <lesson-file>` MUST print `fail=0`; `<Exercicio`
opens == closes. Fix until clean. Report: count, mix, distinct sources, result.
