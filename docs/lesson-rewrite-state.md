# Lesson rewrite — work-in-progress state

> Snapshot taken when Trim 3 + Trim 4 agents were paused to save tokens.
> Use this to resume work in a future session without re-reading the
> entire chat.

## Mission

Rewrite all lessons (2–120) to match the canonical "Lição 1 standard"
documented at `docs/kb/lesson-template/`. Each lesson must have:
- 7-door `<DuasPortas>` (preserved from existing content)
- `<EquacaoCanonica>` with `audioTexto` (mandatory)
- 3-books `<aside>` header right under `<EquacaoCanonica>`
- `## Exemplos resolvidos` with **EXACTLY 5** `<Exemplo>` blocks (ascending
  difficulty, each ending with `**Fonte.**`, **no `Exemplo N —` prefix in `titulo=`**)
- `<ListaExercicios>` with 30–80 MC exercises, every one with `solucao` +
  `fonte`, ~25% with `passos`
- `## Fontes` bibliography

Hard rules — see `docs/kb/lesson-template/mdx-syntax-traps.md`.

## Status by trimester

### ✅ Trim 1 (lessons 1–10) — DONE

- Lesson 1 — original canonical template (we authored this manually).
- Lessons 2, 3, 4 — Agent A ✓
- Lessons 5, 6, 7 — Agent B ✓
- Lessons 8, 9, 10 — Agent C ✓

### ✅ Trim 2 (lessons 11–20) — DONE

- Lessons 11, 12, 13 — Agent D ✓
- Lessons 14, 15, 16 — Agent E ✓
- Lessons 17, 18, 19, 20 — Agent F ✓ (finished cleanly before pause)

### ⏸ Trim 3 (lessons 21–30) — PARTIAL

| Lesson | Status | Notes |
|---|---|---|
| 21 — plano cartesiano | ✅ done | Agent G2 finished before stop (821 lines, 35 fonte refs, 5 examples) |
| 22 — equação reta | ❌ pending | Original 277 lines, no upgrade |
| 23 — posição relativa retas | ❌ pending | Original 269 lines |
| 24 — circunferência | ✅ done | Agent H2 (886 lines, 35 fonte refs, 5 examples) |
| 25 — cônicas | ❌ pending | Original 311 lines |
| 26 — vetores plano | ❌ pending | Original 305 lines |
| 27 — produto escalar | ✅ done | Agent I2 (905 lines, 35 fonte refs, 5 examples) |
| 28 — vetores física | ❌ pending | Original 301 lines |
| 29 — sistemas lineares | ❌ pending | Original 308 lines |
| 30 — consolidação trim 3 | ❌ pending | Original 273 lines |

### ⏸ Trim 4 (lessons 31–40) — PARTIAL

| Lesson | Status | Notes |
|---|---|---|
| 31 — matrizes intro | ✅ done | Agent J finished (1063 lines, 46 fonte refs) |
| 32 — operações matrizes | ❌ pending | Original 337 lines |
| 33 — transposta inversa | ❌ pending | Original 360 lines |
| 34 — determinantes | ✅ done | Agent K (1090 lines, 46 fonte refs) |
| 35 — sistemas via matrizes | ❌ pending | Original 363 lines |
| 36 — PFC | ❌ pending | Original 319 lines |
| 37 — permutações arranjos | ✅ done | Agent L (1041 lines, 46 fonte refs) |
| 38 — combinações | ❌ pending | Original 378 lines |
| 39 — probabilidade | ❌ pending | Original 387 lines |
| 40 — consolidação anual | ❌ pending | Original 333 lines |

### ⏸ Year 2 (lessons 41–80) — PAUSED, ZERO done

All Trim 5 + Trim 6 agents (M, N, O, P, Q) were stopped before they
wrote any file. **0 of 16 dispatched Year 2 lessons were committed.**
All 40 Year 2 lessons still in original (pre-upgrade) form.

| Batch | Lessons | Status |
|---|---|---|
| Trim 5 (41–50) | all 10 | pending |
| Trim 6 (51–60) | all 10 | pending |
| Trim 7 (61–70) | all 10 | pending |
| Trim 8 (71–80) | all 10 | pending |

### ⏳ Year 3 (lessons 81–120) — Not started

## To resume

**Confirmed done so far (DO NOT RE-DO):**
- Lessons 1–20 (Trim 1 + Trim 2)
- Lessons 21, 24, 27 (Trim 3)
- Lessons 31, 34, 37 (Trim 4)

**Pending (94 lessons total):**
- Trim 3 leftovers: 22, 23, 25, 26, 28, 29, 30 (7 lessons)
- Trim 4 leftovers: 32, 33, 35, 36, 38, 39, 40 (7 lessons)
- Year 2: 41–80 (40 lessons)
- Year 3: 81–120 (40 lessons)

**To resume:** dispatch agents per the suggested batching below. Always
hand each agent the briefing at `docs/kb/lesson-template/prompt-for-authoring-agent.md`
plus topic descriptions from `src/content/programa-em.ts`.

Suggested batching for Trim 3+4 resumption (3 agents, ~5 lessons each):

- **Batch R1:** 22, 23, 25 (Trim 3 mix — retas + cônicas)
- **Batch R2:** 26, 28, 29, 30 (Trim 3 wrap — vetores + sistemas + consolidação)
- **Batch R3:** 32, 33, 35, 36 (Trim 4 first half — matrizes operações + sistemas + PFC)
- **Batch R4:** 38, 39, 40 (Trim 4 wrap — combinações + probabilidade + consolidação)

That's 4 agents to finish Trim 3+4. Or 14 lessons in 5 agents if 3-per is preferred.

## Audit script — run on resume

```bash
for f in 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40; do
  trim=3
  [ $f -ge 31 ] && trim=4
  path=$(ls content/aulas/ano-1/trim-$trim/licao-${f}-*.mdx 2>/dev/null | head -1)
  if [ -n "$path" ]; then
    lines=$(wc -l < "$path")
    has_aside=$(grep -c "Livros que cobrem esta li" "$path")
    has_examples_section=$(grep -c "^## Exemplos resolvidos" "$path")
    n_exemplo=$(grep -c "^<Exemplo " "$path")
    n_fonte=$(grep -c "fonte=" "$path")
    status="❌"
    [ "$has_aside" = "1" ] && [ "$n_exemplo" = "5" ] && [ "$n_fonte" -ge "20" ] && status="✅"
    printf "%s L%-3s | %5d lines | aside:%s examples:%s n_ex:%s fonte:%-3s\n" \
      "$status" "$f" "$lines" "$has_aside" "$has_examples_section" "$n_exemplo" "$n_fonte"
  fi
done
```

## Authoring agent briefing

For each new agent, hand the briefing at
`docs/kb/lesson-template/prompt-for-authoring-agent.md` plus the specific
lesson IDs + topic descriptions from `src/content/programa-em.ts`.

## Recently-fixed bug to remember

The `<Exemplo titulo="Exemplo N — ...">` duplicate-prefix bug. The
component renders `Exemplo — N · titulo` automatically, so titulo MUST
NOT include `Exemplo N —`. Use `titulo="Topic name (level)"` instead.
There's a defensive sweep in `python3 -c '...'` if any agent emits the
bad form — see prior chat log.
