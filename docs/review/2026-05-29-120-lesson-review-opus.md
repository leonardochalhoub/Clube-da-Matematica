# Opus 4.8 — Independent Review of Sonnet's 120-Lesson Conformity Report

**Date:** 2026-05-29
**Reviewer:** Claude Opus 4.8
**Source under review:** `docs/review/2026-05-29-120-lesson-review.md` (Sonnet 4.6) + `docs/review/lesson-metrics.csv`
**Reference standard:** `content/aulas/ano-1/trim-1/licao-01-conjuntos-intervalos.mdx`
**Owner-facing verdict at bottom.** Read sections in order if you want the reasoning.

---

## TL;DR

Sonnet's review is **mostly correct, but understates two things** and **contains one factual error in its prose**:

1. **Understated SEVERE bucket.** There are realistically **2 SEVERE + 5 trivial-fix** items, not "7 SEVERE". L117 is the only catastrophic one; L110 is a stub that needs real authoring; the other five (L075, L080, L094, L119, L120) are 10-minute fixes (one `## Fontes` block each). Calling them "SEVERE" inflates the work estimate.
2. **Understated MISSING-OPCOES severity.** The Stats II cluster (L101–L109, L114–L116) is **not legitimately proof-only** — those lessons are stuffed with `aplicacao` and `modelagem` exercises that use `resposta="..."` (text-input style) where they should have `opcoes={[...]}` per CLAUDE.md §3 rule 8. This is the largest real authoring debt in the corpus, ~350–400 exercises that need MC alternatives authored. Sonnet flagged the quantity but punted the interpretation to Opus; my answer is: most of these are gaps, not editorial choices.
3. **Factual error in Sonnet's prose: the "L024, L060 — FEW-BOOKS-HEADER" line is wrong.** The CSV correctly does NOT flag L024 or L060 with that flag. The actual `FEW-BOOKS-HEADER`-flagged lessons in the CSV are **L01 and L08**. L01 is the canonical reference. This means the `FEW-BOOKS-HEADER` check itself is a **false-positive generator**: it scans only the first 3000 chars and the canonical books-header `<aside>` legitimately starts past that window in lessons with long `<EquacaoCanonica>` legendas. Discount this flag entirely.

The corpus is **translation-ready conditional on ~6 hours of focused work**, not 8–12 hours as Sonnet estimated. Authorship can begin in parallel with translator wave-1 if the owner is willing to retro-fix L117 and L110 in the translated locales after the fact.

---

## Validation of Sonnet's methodology

### What the scan captures correctly

The 22-column CSV is a solid skeleton: exercise count, exemplos count, portas count, opcoes/fonte/solucao coverage per exercise, passos percentage, difficulty mix, audio presence, fontes-section presence. I re-derived the L117/L110/L075/L080/L119 numbers by reading the files and they match. The structural counts (`<Exercicio>` opens vs. closes, `<Porta nivel="...">` enumeration) are correct.

### What Sonnet missed or got wrong

**1. The `FEW-BOOKS-HEADER` check is broken.** `check_books_header()` in `/tmp/lesson-review.py` line 111 scans only `text[:3000]` for `CC-BY` / `CC-PD` / `GNU FDL` markers. The L1 template's `<aside>` books-header typically sits 700–1500 chars into the file, but with long `<EquacaoCanonica legenda={<>...</>}` blocks the `<aside>` slips past 3000 chars on some files. Net effect:
   - L01 (the canonical reference) is flagged `FEW-BOOKS-HEADER(0)` — false positive.
   - L08 is flagged `FEW-BOOKS-HEADER(1)` — needs verification but likely also a false positive.
   - Sonnet's narrative then incorrectly labels L024 and L060 as the culprits — neither has this flag in the CSV.

   **Action:** ignore the `FEW-BOOKS-HEADER` flag column. Re-run with a higher window (e.g., `text[:6000]` or — better — match `<aside[^>]*>.*?</aside>` non-greedy across the whole file) if you want this metric. For translation-readiness purposes, drop it.

**2. The `MIX-OFF-*` tolerance is uneven.** The script flags `pct < low * 0.6` OR `pct > high * 1.5`. For `desafio`/`demonstracao` (low=2%, high=20%), `0%` is below `2% * 0.6 = 1.2%` → flag. Fine in principle, but it means a topical lesson with no proofs (e.g. L042 "propriedades algébricas dos limites" with proof-as-`compreensao` style) gets flagged. Real reviewer judgment is needed before acting on `MIX-OFF-demonstracao(0%)`-only flags.

**3. The `FEW-PASSOS` bar is set at <10%, not <25%.** Target per CLAUDE.md is ~25%. So a lesson at 11–24% passos coverage shows as CLEAN. Sonnet's report acknowledges this, but the bucket "21 lessons FEW-PASSOS" understates how many lessons are below target. From the CSV, **45 lessons (38%) are below the 20% target** and **75 lessons (63%) are below 25%**. The corpus-wide average is 17.7%. So `FEW-PASSOS` understates the gap by 3×. (Whether the corpus needs to hit 25% is a separate editorial question — see MINOR section below.)

**4. The scan does not check math correctness, prose quality, prerequisite-chain consistency, or cross-lesson references.** It also doesn't verify that `fonte.url` actually resolves to a real page, that `secao` matches the URL anchor, or that the cited book actually contains an exercise like the one shown. Sonnet correctly didn't claim it does, but a translation-readiness review should know what's missing — see "Methodology critique" below.

**5. The scan does not enforce the L1 template's `<Exemplo>` minimum.** Target is 3–5 worked examples. The script's `count_exemplos` returns the count but the flag (line 189–) only triggers on `< 3`. Many lessons have exactly 5 — which is correct — but a few (e.g. L117 with 0) trigger; the CSV `exemplos` column is reliable.

**6. Books-header content quality is not checked.** L1 demands three CC-licensed books. Many lessons have the `<aside>` block but cite only 2 books, or cite books that aren't in `livros/CATALOG.md`. The scan doesn't catch this.

### SEVERE/MINOR/CLEAN bucket spot-check

I verified by direct file read:
- **L117** (claimed catastrophic): **confirmed**. File is 191 lines, ends mid-sentence at "US\$" with no `<ListaExercicios>`, no exemplos, only 4 of 7 portas, no `## Fontes`. (`content/aulas/ano-3/trim-12/licao-117-svd.mdx:188-191`)
- **L110** (claimed 10-exercise stub): **confirmed**. 10 `<Exercicio>` between lines 466–585, no `## Fontes` section. All 10 exercises tagged `aplicacao` (no `compreensao`/`modelagem`/`desafio`/`demonstracao`). (`content/aulas/ano-3/trim-11/licao-110-consolidacao-trim-11.mdx:464-585`)
- **L119** (claimed only missing `## Fontes`): **confirmed**. File ends with `</ListaExercicios>`, no Fontes block. Otherwise complete: 42 exercises with full MC, 7 portas, 5 exemplos. (`content/aulas/ano-3/trim-12/licao-119-bs-sintese.mdx` tail)
- **L075** (claimed only missing `## Fontes`): **confirmed**. (`content/aulas/ano-2/trim-8/licao-75-binomial.mdx` tail)
- **L080** (claimed missing `## Fontes` + MC gap): **confirmed**. 39 exercises, only ~3 with `opcoes`. (`content/aulas/ano-2/trim-8/licao-80-consolidacao-trim-8.mdx`)
- **L052** (claimed CLEAN, my sanity check): **confirmed clean**. 7 portas at lines 54/136/148/163/186/221/251, 5 exemplos, `## Fontes` at line 1105. Sonnet's methodology does not generate false negatives on a representative CLEAN lesson.

**Verdict on methodology:** Sonnet's pipeline is honest and the CSV is trustworthy as the primary artifact. The narrative prose has one error (L024/L060 mis-citation) and one weakness (`FEW-BOOKS-HEADER` false positives), neither of which invalidates the SEVERE list.

---

## Independent assessment of the 7 SEVERE lessons

### L117 — SVD (catastrophic stub) — REAL SEVERE

**Status:** the file is a truncated draft. The cascade ran out of tokens around the porta-15 Netflix paragraph (`190:Netflix tinha matriz de avaliações...10%. O time vencedor BellKor's Pragmatic Chaos melhorou a acurácia em 10% e ganhou US$`). Nothing after that line exists.

**Authorship plan (concrete):**
- **Primary source:** Beezer's *A First Course in Linear Algebra* §SVD ([linear.ups.edu/html/section-SVD.html](http://linear.ups.edu/html/section-SVD.html), GNU FDL) — already cited in the existing books-header. It has a complete proof of existence + worked examples.
- **Secondary source:** Austin's *Understanding Linear Algebra* ch. 7 ([understandinglinearalgebra.org/chap7.html](https://understandinglinearalgebra.org/chap7.html), CC-BY-SA) — strong on geometry of SVD (ellipsoid stretching), image-compression examples.
- **Tertiary:** REAMAT *Álgebra Linear* (UFRGS, CC-BY-SA) — PT-BR exercises on Moore-Penrose pseudoinverse.
- **Already drafted (keep):** portas formal/5/10/15 (up to the truncation), `<EquacaoCanonica>`, books-header `<aside>`. ~135 lines of usable content.
- **Need to author from scratch:**
  - Finish porta-15 (Netflix paragraph) → ~20 lines.
  - Porta-25 (engineering student): power iteration / Lanczos for top-k singular values; numerical stability and condition number κ₂. ~50 lines.
  - Porta-40 (senior professional): SVD as the universal solver — least squares via pseudoinverse, low-rank matrix completion, link to PCA (L118). ~50 lines.
  - Porta-pratica: image compression demo with σᵢ decay; recommender system case (Netflix prize numerics). ~40 lines.
  - 5 `<Exemplo>` blocks: (1) 2×2 hand-computed SVD, (2) 3×2 rank-1 example, (3) Eckart-Young approximation of a rank-3 matrix, (4) pseudoinverse-solve of inconsistent system, (5) image-compression toy (8×8 chess-board → rank-2 approx). ~120 lines.
  - **~35 `<Exercicio>` blocks** drawn from Beezer §SVD problems + Austin §7.3 exercises + REAMAT chapter list. Target distribution: 20 aplicação (compute SVD of 2×2/3×2/diagonal matrices), 5 modelagem (image compression, document-term matrix, recommender), 5 compreensão (relate to spectral theorem, prove σ-uniqueness), 3 desafio (Eckart-Young proof sketch, condition number bound on regression), 2 demonstração (existence of SVD via spectral theorem on AᵀA).
  - `## Fontes` block.

**Time estimate (Opus authorship):** **2.5–3.5 hours** of focused work. The hard part is the 5 Exemplos and the 35 sourced Exercicios — each Exercicio needs a real Beezer/Austin reference with the URL pointing to the page that contains the problem. Don't delegate to Sonnet without intensive review; the cascade already proved it can't author L117 without truncating. **Opus should personally author** this lesson; Sonnet can do the prose for portas 5/10/15 (already drafted) under close review.

### L110 — Consolidação Trim 11 — REAL SEVERE

**Status:** 10 exercises, all `aplicacao`, none with `opcoes`, no `## Fontes`. The portas + exemplos + body are complete (586 lines total). The stub is purely the exercise list + bibliography.

**Authorship plan:**
- **Sources:** the lessons it consolidates (L101–L109) all cite OpenIntro Statistics §5–8 and OpenStax Statistics §8–13. Reuse those.
- **Need ~30 more exercises** (10 → 40 target). Distribution:
  - 18 `aplicacao`: confidence-interval drills (z, t), single-sample hypothesis tests, regression slope/intercept compute, χ² compute, ANOVA F-ratio.
  - 8 `modelagem`: contextualized data problems (OpenIntro §5.4 exercises are excellent for this — medical/social datasets).
  - 6 `compreensao`: type I/II error conceptual questions, regression interpretation, Bayes vs. frequentist contrasts.
  - 4 `desafio`: multiple-testing correction, regression assumptions diagnostic.
  - 2 `demonstracao`: derive t-statistic from N(0,1)/χ² ratio, prove unbiasedness of sample variance.
- All exercises must have `opcoes={[...]}` (MC) — this is a consolidation, not a proofs lesson.
- Existing 10 exercises need MC retro-fitted too.
- Add `## Fontes` block consolidating OpenIntro + OpenStax + Poldrack StatsThinking21.

**Time estimate (Opus):** **1.5–2 hours** to author 30 sourced MC exercises + retro-fit MC for the existing 10 + Fontes block. Delegatable to Sonnet **only if** the Sonnet agent is given (a) the CLAUDE.md §3 preamble, (b) explicit page-level URLs for OpenIntro/OpenStax sections, and (c) a hard "every exercise must have `opcoes`" rule. Even then, Opus should review the resulting MC distractors for plausibility — Sonnet's distractors in past consolidations have been weak.

### L075 — Distribuição binomial — TRIVIAL FIX (mis-bucketed as SEVERE)

**Status:** 42 exercises with full MC + solução + fonte, 7 portas, 5 exemplos, 100% structural conformity. **Only missing the closing `## Fontes` block.**

**Plan:** literally copy the pattern from L076 (Distribuição normal) or L073 (Quartis). The fonte fields already cite OpenIntro §4.3, OpenStax §4.4, Grinstead-Snell §3.1 — list those three as a markdown block.

**Time estimate:** **5–10 minutes**. Delegatable to a single Haiku call.

### L080 — Consolidação Trim 8 — MEDIUM (mis-bucketed within SEVERE)

**Status:** 39 exercises, 36 lack `opcoes`, no `## Fontes`. **Sonnet's "Opus call needed" is the right call but the answer is clear:** this is a consolidation lesson, not a proofs lesson. Per CLAUDE.md §3 rule 8 ("always author MC for the better UX"), the 36 missing-opcoes exercises should gain MC distractors.

**Plan:**
- Add `## Fontes` block (5 min).
- Author MC distractors for 36 exercises (1.5–2 hr if done carefully — distractor quality matters; bad distractors are worse than no MC).

**Time estimate:** **1.5–2 hours**. Delegatable to Sonnet for the MC sweep, with the rule that distractors must be (a) plausible numerically/conceptually, (b) include the canonical wrong-direction error, and (c) NOT be "none of the above"-style filler. Opus must spot-check 10% of the resulting distractors.

### L094 — EDOs populacionais — MINOR (mis-bucketed in SEVERE)

**Status:** Full structure, 45 exercises, 5 exemplos, 7 portas. Missing only `## Fontes` block; passos at 3/45 = 7% (below 10% threshold). The lesson itself is fine.

**Plan:** Add `## Fontes` (5 min). Optionally author 8 more passos blocks (30 min) if the owner wants to hit 25% passos coverage on this lesson specifically.

**Time estimate:** **5–35 minutes** depending on whether passos sweep is done.

### L119 — Black-Scholes revisited — TRIVIAL FIX

**Status:** Same as L075. 42 exercises, full MC + solução + fonte, full structure. **Only missing `## Fontes`.**

**Plan:** Add `## Fontes` block citing Lebl *Notes on Diffy Qs* §4.3 (already cited in fonte fields), Hull *Options Futures and Other Derivatives* (or the open Wilmott introduction if Hull is not open-licensed — verify against `livros/CATALOG.md`), and OpenStax Business Statistics §11.

**Time estimate:** **10 minutes**.

### L120 — Workshop final do Programa — TRIVIAL FIX

**Status:** Same as L075/L119. 40 exercises, full MC, full structure. **Only missing `## Fontes`.**

**Plan:** Add `## Fontes` block as a year-3 retrospective: cite Active Calculus, Axler *Linear Algebra Done Right* (if open-licensed; otherwise Beezer), OpenIntro Statistics, Lebl Diffy Qs.

**Time estimate:** **10 minutes**.

### SEVERE list — recategorized

| Lesson | Sonnet bucket | Opus recategorization | Reason |
|---|---|---|---|
| L117 | CATASTROPHIC | **SEVERE — author** | Real authorial work, ~3h Opus |
| L110 | SEVERE | **SEVERE — author** | Real authorial work, ~2h Opus or close-supervised Sonnet |
| L080 | SEVERE | **MEDIUM — MC sweep** | Delegatable, ~1.5h Sonnet + Opus review |
| L075 | SEVERE | **TRIVIAL** | 10 min, Haiku-grade |
| L094 | SEVERE | **TRIVIAL** | 10 min, Haiku-grade (+ optional passos sweep) |
| L119 | SEVERE | **TRIVIAL** | 10 min, Haiku-grade |
| L120 | SEVERE | **TRIVIAL** | 10 min, Haiku-grade |

**Real Opus authorial load: 2 lessons (~5 hr).** The other 5 are mechanical.

---

## Independent assessment of MINOR issues

### `MISSING-OPCOES` in L101–L109 + L114–L116 — REAL GAP, not editorial choice

I read L107 (ANOVA) and L079 (Bayes aprofundado) carefully. Both are dominated by computational `aplicacao` exercises (e.g. L107.1: "Um experimento compara 3 grupos com 10 observações cada. Determine df_B e df_W." — answer: `df_B = 2, df_W = 27`). These use `resposta="$df_B = 2,\; df_W = 27$"` — a text-input style — instead of `opcoes={[...]}`.

**The Exercicio component (`src/components/math/ListaExercicios.tsx:701–704`) treats `resposta` without `opcoes` as "Ver resposta" button only** (no `<input>` rendered). So this doesn't break the L1 rule against text-input answer fields per se — but it violates CLAUDE.md §3 rule 8's clear preference: *"always author MC for the better UX."*

**The exercises ARE legitimately MC candidates.** Distractors are easy to author:
- L107.1 correct: `df_B = 2, df_W = 27`. Distractors: `df_B = 3, df_W = 27` (off-by-one), `df_B = 2, df_W = 30` (forgot subtract-k), `df_B = 9, df_W = 20` (per-group degrees confusion).
- L079 aplicacao exercises (Bayes drills with prior×likelihood/evidence): same — every wrong path through Bayes (forget normalize, swap prior/posterior, etc.) gives a natural distractor.

**Per-lesson MC gap (sums in CSV):**
- L079: 37 exercises need MC.
- L101: 35. L102: 38. L103: 37. L104: 33. L105: 34. L106: 29. L107: 40. L108: 39. L109: 31. L114: 36. L115: 41. L116: 39.
- Plus L080 (36).
- **Total: ~503 exercises that need MC distractors authored.**

This is the **largest real authoring debt in the corpus.** Sonnet correctly tallied the count but punted the interpretation. **My answer:** these are gaps to fill, not editorial choices. The exception is the ~6–10 `demonstracao` exercises per lesson where "Ver solução" alone is the correct UX. So realistic MC-authoring target is ~440 exercises across 15 lessons.

**Recommendation:** delegatable to Sonnet subagents one lesson at a time, with the CLAUDE.md §3 preamble and a hard distractor-quality rule. Estimated cost: **15 lessons × 30 min/lesson = 7.5 hours of Sonnet time + 1 hour of Opus review** (spot-check 10% of distractors per lesson). This is the single biggest piece of work — but it can run in parallel with L117 authoring.

### `FEW-PASSOS` — editorially fine to leave at ~18% corpus-wide

The CLAUDE.md target is "~25% with passos". Corpus is at 17.7%. **Closing this gap is editorially nice-to-have but not blocking translation.**

Arguments for leaving as-is:
1. `passos` is a deep walk-through with prose comments. Authoring high-quality `passos` is the most expensive work per exercise (often 30+ lines of MDX per block).
2. The 17.7% rate is uniform enough across years; it's not a quality cliff. Lessons at 4–7% are concentrated in Trim 8–11 (Stats/EDOs) where the math is heavier and walkthroughs are correspondingly more useful — but also more expensive.
3. After translation to 10 locales, `passos` blocks must be retranslated; adding 200+ passos blocks now adds 2000+ translation events. Editorially smarter to ship at 18% and let `passos` grow over time.

Arguments for closing the gap:
1. `passos` is exactly the UX feature that distinguishes Clube from a static textbook. Underutilizing it weakens the product.
2. The 25% target is in the L1 rule list. Shipping at 18% says "the rules are guidelines."

**My call:** keep as-is for v1 translation. Open a follow-up tag "passos-sweep-v1.5" and schedule the work for after translation lands. **No blocker.**

### `MIX-OFF-*` flags — mostly real, partially tolerable

The serious cases (zero in multiple categories) are:
- **L011 trig triângulo:** 45/0/0/0/0 split (100% aplicacao). Real concern. Trig in the triangle absolutely admits modelagem (navigation, ramp slopes) and compreensão (when do sine and cosine give the same value?). **Should be rebalanced before translation.** ~1 hour Sonnet work.
- **L012 círculo trigonométrico:** Same shape. ~1 hour Sonnet work.
- **L071 medidas centrais:** 41 aplicacao / 4 compreensao / 0 elsewhere. Real concern; median-vs-mean discussion is rich modelagem territory. ~45 min Sonnet work.

The single-flag cases (e.g. L002 `MIX-OFF-demonstracao(0%)`, L041 `MIX-OFF-desafio(0%)`, L067 `MIX-OFF-modelagem(40%)`) are mostly **acceptable editorial choices**:
- L002 funções is an introductory lesson; demonstrações are too early.
- L041 limite formal ε-δ is dense proof territory; the 5 `demonstracao` exercises already over-deliver and `desafio=0` is fine.
- L067 economia at 40% modelagem is by design — economic analysis IS modelagem; the flag rule (max 25%) is the script being over-strict for an applied lesson.

**Recommendation:** fix L011, L012, L071 (~3 hours combined Sonnet work). Discount the single-flag mix-offs.

### `FEW-BOOKS-HEADER` — discount entirely

False-positive generator. The check window is too small (3000 chars) for the canonical structure. The CSV-flagged L01 IS the canonical reference — it cannot be a real flag. **No action.**

---

## Methodology critique — what a deeper review would catch

Sonnet's scan is structural-only. A pre-translation review should also verify:

1. **`fonte.url` resolution.** Every exercise cites a URL. Are they all live? Are the section anchors (e.g. `#fs-id11713028028`) still valid? A simple `aiohttp`-based sweep with a 5-second-per-URL HEAD check (cached) would surface dead links. **Strong recommendation: run this before translation.** Dead URLs in 10 translated locales become 10× the cleanup work.

2. **Math KaTeX-correctness.** The build green-lights MDX that parses successfully, but rendered KaTeX errors (undefined commands, malformed `\begin{}`) only surface in the browser. A `node --eval` of every `<Eq>` and every body `$math$` against `katex` directly would catch ~5–20 silent KaTeX errors per the patterns from CLAUDE.md §3 (escaped backticks, `\$` inside `<Eq>`, etc.). Worth doing.

3. **Prerequisite-chain consistency.** The frontmatter `prerrequisitos` field cites a previous lesson slug. The script could verify: (a) the cited slug exists, (b) it's earlier in `ordem`, (c) it actually covers the prerequisite topic. L117's `prerrequisitos: ["licao-116-matrizes-especiais"]` is correct, but other lessons may dangle. Quick automated check.

4. **Cross-lesson references.** L120 (workshop final) likely references L01–L119 by number/topic. If any of those references are wrong (e.g. "como vimos na lição 87" but L87 is integrais trigonométricas not what's described), the corpus has internal inconsistency that translation will multiply. `grep -E "lição [0-9]+" content/aulas/` and verify each.

5. **Source diversity per lesson.** L1 demands 3 books in the header `<aside>`. The scan counts books-header license markers (and does it wrong, as discussed). A real check: extract the 3 books from the `<aside>`, verify they're in `livros/CATALOG.md`, verify the 3 are distinct (not 3 OpenStax volumes), and verify each lesson's exercise `fonte.livro` field overlaps with the books-header list. Catches "books-header says A/B/C but exercises all cite D".

6. **Exercise originality and de-duplication.** With 5,111 exercises, some are likely textual near-duplicates of each other (cascade habit). A trivial fuzzy-match (5-gram jaccard) would surface these. Not blocking translation but worth knowing.

7. **Audio narration quality.** Every `<EquacaoCanonica audioTexto="...">` is hand-authored. Are any of these still the cascade-emitted placeholder? Random spot-check 20.

8. **`<Exemplo>` source citation.** L1 rule: every Exemplo has a source. The scan counts Exemplos but not their `fonte` fields. Likely some early-cascade lessons have un-sourced Exemplos.

**Of these, items 1, 2, and 4 should run before translation.** Items 3, 5, 6, 7, 8 are post-translation polish.

---

## Authorship priority queue — Opus ranking

Ordered by (translation-blocking impact) × (1 / ease):

### P0 — Translation blockers, must do before translator wave-1 spawns

1. **L117 SVD — author from scratch.** Opus only. ~3 hr.
2. **L110 Consolidação Trim 11 — author 30 exercises + Fontes.** Opus (or Sonnet under heavy review). ~2 hr.
3. **L075, L094, L119, L120 — add `## Fontes` blocks.** Haiku grade, 4 × 10 min = ~40 min.

**P0 total: ~5.5–6 hr.**

### P1 — Should do before translator wave-1, can do in parallel

4. **L101–L109 + L114–L116 MC sweep** (~440 exercises gaining MC distractors). Sonnet subagents one lesson at a time, with CLAUDE.md §3 preamble. ~15 × 30 min Sonnet + ~1 hr Opus review = ~8.5 hr wallclock (parallel-able to 3–4 hr if running Sonnet agents in parallel).
5. **L080 — MC sweep on 36 exercises + Fontes.** Sonnet, ~1.5 hr + Opus review.
6. **L011, L012, L071 — difficulty rebalance** (each gets 10–15 new modelagem/compreensão/desafio exercises). Sonnet under review, ~3 hr combined.

**P1 total: ~13–15 hr** if all done; ~4–5 hr if just L080 + L011/L012/L071 and the MC sweep deferred.

### P2 — Pre-translation polish

7. **URL liveness sweep** on the 5,111 `fonte.url` values (cron job, async). ~30 min compute + 30 min triage.
8. **KaTeX-parse sweep** on all `<Eq>` and `$...$`. ~1 hr.
9. **Cross-lesson reference sweep.** ~30 min grep + 1 hr triage.

**P2 total: ~3.5 hr.**

### P3 — Post-translation, v1.5 work (not blocking)

10. **`FEW-PASSOS` sweep** to bring corpus to 25% passos coverage. ~21 lessons × 30 min Sonnet = ~10 hr. Defer to v1.5.

### Delegation matrix

| Work | Owner-personally | Opus directly | Sonnet (close review) | Sonnet (loose review) | Haiku |
|---|---|---|---|---|---|
| L117 author | — | ✓ | — | — | — |
| L110 author | — | ✓ | possible | — | — |
| Fontes blocks (L075/L094/L119/L120) | — | — | — | ✓ | ✓ |
| MC sweep (L101–L116) | — | review only | ✓ | — | — |
| L080 MC sweep | — | review only | ✓ | — | — |
| L011/L012/L071 rebalance | — | review only | ✓ | — | — |
| URL sweep | — | run | — | — | — |
| KaTeX sweep | — | run | — | — | — |
| Passos sweep (v1.5) | — | — | ✓ | — | — |

---

## Translation readiness verdict

**Conditional yes.** The corpus is translation-ready after:

### Hard prerequisites (must do before spawning translator wave-1)

1. **L117 authored** to L1 standard (~3 hr Opus).
2. **L110 expanded** from 10 → 35–40 exercises with MC and Fontes (~2 hr).
3. **L075, L094, L119, L120 `## Fontes` blocks added** (~40 min total).
4. **URL liveness check passes** on `fonte.url` values (~1 hr).

**Hard prerequisite total: ~6.5–7 hr.**

### Strong recommendations (should do before wave-1 but not strict blockers)

5. **L101–L109 + L114–L116 MC sweep** (~440 distractors authored). Could ship without this — the lessons would render and read fine, the `resposta` field gets the "Ver resposta" button — but it's a UX-quality gap that multiplies across 10 locales if deferred. Estimated 8 hr Sonnet + 1 hr review; can parallelize.
6. **L080 MC sweep + Fontes.** ~1.5 hr.
7. **L011/L012/L071 difficulty rebalance.** ~3 hr.
8. **KaTeX-parse sweep across corpus.** ~1 hr — high leverage, catches silent render bugs in 10 locales at once.

**Strong-recommendation total: ~12–14 hr if all done.**

### Acceptable to defer

9. `FEW-PASSOS` sweep (corpus at 18% vs. target 25%).
10. `MIX-OFF` single-flag cosmetic fixes outside L011/L012/L071.
11. Cross-lesson reference audit (P2 #9).
12. Exercise de-duplication.
13. Source-diversity audit.

### Minimum bar before spawning translator pipeline

The owner can spawn translation **after items 1–4 above are done** (~7 hr of work). The corpus will then have:
- 0 SEVERE lessons.
- All 120 lessons with structurally complete bodies (7 portas, 3+ exemplos, 30+ exercises, Fontes section, fonte/solucao/MC on every exercise — except the ~503-exercise MC gap, which renders cleanly as "Ver resposta" buttons).
- All `fonte.url` values verified live.

**If the owner can afford another ~12 hr before translation**, items 5–8 should be done — particularly the MC sweep, because re-translating distractors after-the-fact in 10 locales costs more than authoring them once in PT-BR.

### Decision framework for the owner

- **Translation-blocking-only path (~7 hr):** L117 + L110 + 4 Fontes blocks + URL sweep. Ship to translators. Author MC sweep + rebalances post-translation for PT-BR only, leave translated locales with `resposta` fields as-is until v1.5.
- **Full pre-translation path (~20 hr):** Hard prerequisites + MC sweep + L011/L012/L071 + KaTeX sweep. Translators inherit a cleaner corpus; locales are uniformly high-quality.

**Opus recommendation: take the middle road.** Do the hard prerequisites + L080 + L011/L012/L071 + KaTeX sweep (~12 hr) but **defer the L101–L116 MC sweep**. The Stats II / LA cluster has the largest MC gap but its `resposta`-field rendering is acceptable for v1; translators don't need to redo it because retro-fitting MC distractors only changes PT-BR `opcoes={[...]}` JSX which translation pipelines handle additively (the new MC arrays will get translated in a later wave). This gives a clean translator wave-1 within a single day of focused work and pushes the largest cleanup to a parallel track.

---

## Closing assessment

Sonnet's review is solid scaffolding with three weaknesses I want to flag in plain language:

1. The "7 SEVERE" framing inflates the work — only 2 lessons need real authoring.
2. The MC gap in Stats II / LA is the biggest debt and Sonnet correctly counted it but punted on the call. **It's a real gap.**
3. The `FEW-BOOKS-HEADER` flag and its prose attribution are wrong. Discount it.

The corpus is in good shape — 5,111 sourced exercises, 100% solucao+fonte coverage, 100% audio-narration coverage, build green. The translation pipeline can spawn **today** if the owner authors L117 + L110 and adds 4 Fontes blocks (~6 hr).

— Opus 4.8, 2026-05-29
