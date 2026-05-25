# Deterministic Re-Sourcing of Exercise Citations

> **Status (2026-05-24, evening).** Stage 1 infrastructure built and
> validated end-to-end on one lesson. Per-book parsers, corpus
> aggregator, and lesson→exercises matcher all work. **5,019 verifiable
> exercises now indexed** from three open-licensed books. Stages 2 and 3
> (distractor generation + per-lesson MDX rewrites) not yet started.
>
> **Why this exists.** A 2026-05-24 spot-audit of Lição 1 found that
> AI-written `fonte={{ ... exercicio: "ex. N", pagina: N ... }}`
> citations were systematically hallucinated. The cited exercise numbers
> pointed to unrelated PEMDAS problems in OpenStax College Algebra 2e
> §1.1, not the set-builder problems they were attached to. As an
> immediate response we stripped all `exercicio` and `pagina` fields
> from every `fonte` block in `content/` (19,307 across 571 MDX files).
> `exercicio` has been re-allowed in the TypeScript schema, but the
> invariant is now: **only this pipeline may write it.** Human or LLM
> authors must NEVER add `exercicio` by hand.
>
> ## What is in place today
>
> | Piece | Status |
> |---|---|
> | OpenStax HTML parser (`scripts/parse-openstax.py`) | ✓ `--book SLUG` discovers all sections via embedded TOC JSON; `--crawl URL` walks ±1 siblings; per-section UTF-8 fetch, exercise extraction with category tags |
> | Active Calculus parser (`scripts/parse-active-calculus.py`) | ✓ `--all` discovers 44 sections from frontmatter; clean section_title from `<section class='section'>` first heading |
> | Corpus aggregator (`scripts/aggregate-corpus.py`) | ✓ Reads `livros/_parsed/*.jsonl`, emits unified `_corpus.jsonl` + `_index.json` with topic-tag enrichment |
> | Authoring matcher (`scripts/match-exercises-for-lesson.py`) | ✓ Reads lesson MDX frontmatter `tags`, expands PT→EN via a curated dictionary, scores corpus exercises by tag overlap, returns top-N |
> | Indexed corpus | **5,019 exercises**: OpenStax CA2e (2,777), OpenStax Calc Vol 1 (1,793), Active Calculus (449) |
> | End-to-end demo (L41 "limite formal") | ✓ Matcher returns 70 candidates from OpenStax Calc V1 §2.5 "The Precise Definition of a Limit" + 10 from Active Calculus — all topically correct, all source-verifiable |
> | Distractor generation (3 wrong MC options per exercise) | ✗ Not built. Will require Sonnet pass with real exercise text as input |
> | Solution authoring (where book doesn't ship one) | ✗ Not built. Will require Sonnet pass |
> | 25% passos (step-by-step walkthrough) selection + authoring | ✗ Not built |
> | MDX renderer that drops candidates into `<Exercicio>` blocks | ✗ Not built |
> | Lesson MDX rewriting (L01–L120) | ✗ Not started — pipeline ready but the actual content swap hasn't happened |
>
> ## Known limitations of Stage 1
>
> - **Topic matching is coarse.** Match scoring uses keywords extracted from the source book's section title. OpenStax §1.1 in CA2e is titled "Real Numbers: Algebra Essentials" — its 68 exercises cover PEMDAS, real-number classification, AND set-of-numbers exercises, but all share the same section-title tags. L01 (set-builder) gets PEMDAS exercises as top matches because both share the tag `numbers`. Fix path: subsection-level tags (parse the h3 inside each section), or NLP on the exercise statement itself.
> - **PT→EN tag dictionary is hand-curated** (`PT_TO_EN_TAGS` in the matcher CLI). Currently covers ~50 mathematical terms. New lessons with unmapped tags get zero matches — needs an entry for each new curriculum tag.
> - **Source coverage is incomplete.** Three books (CA2e, Calc V1, Active Calculus) cover Years 1–2. Year 3 topics (ODEs, inferential statistics, linear algebra, PCA) need parsers for OpenStax Calculus Vol 2 + Vol 3, OpenStax Statistics / Introductory Statistics 2e, Hammack, MIT OCW 18.06.
> - **Math rendering is raw LaTeX text.** Statements contain `\(...\)`, `\begin{equation*}...\end{equation*}`, etc. — readable but not MDX-ready. Conversion to KaTeX `$...$` is straightforward but not yet implemented.
> - **No author-step CLI yet.** Today's matcher emits candidates; a human (or LLM) still has to (a) pick 30–80, (b) write distractors, (c) write `solucao`, (d) mark 25% with `passos`, (e) format as MDX.

---

## What "deterministic" means here

A citation is **deterministic** if a script can independently reproduce
it from the source book without any LLM in the loop. Concretely:

1. The source book is open-licensed and machine-readable (HTML, LaTeX,
   Markdown, or JSON).
2. We fetch the source ourselves, parse the exercises, and assign them
   stable IDs.
3. Our `<Exercicio>` MDX is generated **from** parsed source — never
   summarized or paraphrased by an LLM that would invent specifics.
4. Every `fonte` field is filled by the parser, not by an LLM.

The cited exercise is then verifiable by anyone with the URL + the
script.

---

## Tiered approach

Different source books expose different surface areas. We attack the
ones that are easiest to parse first; the long tail can be done by
hand or skipped.

### Tier 1 — fully machine-readable (target: ~2,000 exercises)

| Source | Format | Why it's easy |
|---|---|---|
| **OpenStax** (Calc Vol 1/2/3, College Algebra 2e, Statistics, etc.) | Public HTML on `openstax.org/books/<book>/pages/<section>` | Stable URL structure. Exercises in `<section class="exercises">` with numbered `<div data-type="problem">`. CC-BY / CC-BY-NC-SA. |
| **Active Calculus** | Public HTML on `activecalculus.org/single/sec-<chapter>-<section>-<topic>.html` | Stable HTML, exercises in numbered blocks (Activity, Exercise). CC-BY-NC-SA. |
| **Hammack – Book of Proof** | LaTeX source on GitHub (`richardhammack/BookOfProof`) | Compile-time exercise IDs in `\begin{exercise}` blocks. CC-BY-ND. |
| **Stitz–Zeager Precalc** | LaTeX source published with the PDF | Same pattern. CC-BY-NC-SA. |
| **APEX Calculus** | LaTeX source (`apexcalculus/apex-calculus`) | Same pattern. CC-BY-NC. |

For each: write a parser that emits a JSONL with one row per exercise:

```jsonc
{
  "source_id": "openstax/calculus-volume-1",
  "section": "§2.2",
  "section_url": "https://openstax.org/books/calculus-volume-1/pages/2-2-the-limit-of-a-function",
  "exercise_id": "60",         // as printed in the book
  "statement_html": "...",     // the actual problem text
  "answer_html": null,         // optional, when book ships answers
  "topic_tags": ["limits", "piecewise"],
  "license": "CC-BY-NC-SA"
}
```

A normalised corpus across all Tier-1 sources lands in
`livros/_parsed/exercises.jsonl`.

### Tier 2 — semi-structured (target: ~1,500 exercises)

Books that ship PDFs only (Wikilivros, REAMAT, Battaia). Build OCR
+ regex parsers per book. Lower coverage acceptable — pick the
sections we actually need.

### Tier 3 — long tail

Books we cite once or twice (Cauchy, Kyoto Math, ChinaTextbook). Cite
by section only, never by exercise number. No parser; manual quality.

---

## Author workflow after Tier-1 is built

Today an author writing a new lesson opens the Lição 1 template and
writes exercises freehand. After Tier-1:

1. Author writes a YAML manifest declaring which topics the lesson
   covers: `topics: ["set_builder_notation", "interval_notation"]`.
2. A script queries the parsed corpus for exercises whose `topic_tags`
   match and ranks by difficulty calibration.
3. Script outputs MDX `<Exercicio>` blocks with `fonte={{ ... }}`
   pre-filled by the parser (so it's verifiable by construction). The
   statement and answer come from the book — no LLM rewrite.
4. Author selects ~30–80, optionally edits prose for tone, and ships.

The LLM's role shrinks to: tone editing on the doors, writing the
`<EquacaoCanonica>` `audioTexto` narration, and translation. Never
inventing exercises.

---

## Validator (interim — runs against the existing corpus)

Even before the full pipeline ships, a lightweight validator can be
written to flag obviously-wrong citations in the current corpus
(should one ever be added back):

```python
# scripts/validate-fonte.py
# For each fonte={{ url: ... secao: ... }}, fetch the URL,
# check that `secao` actually appears in the page text, and check
# whether the page topic keywords overlap with the exercise statement.
# Flag mismatches.
```

This won't catch every hallucination but would catch the Lição 1 case
(set-builder exercise citing PEMDAS section).

---

## Estimated effort

| Phase | Effort | Outcome |
|---|---|---|
| Tier-1 parsers (5 books) | ~3 weeks | ~2,000 verifiable exercises indexed |
| Authoring CLI that pulls from the index | ~1 week | New lessons cite real exercises by construction |
| Re-source existing L01–L120 from the index | ~4 weeks | All 4,770 exercises swapped for verifiable ones, with prose preserved where it adds pedagogical value |
| Tier-2 OCR parsers (optional) | ~3 weeks | +1,500 exercises |
| Interim validator | ~2 days | Defensive check against future hallucinations |

Total realistic budget: **2 person-months** to put the project back on
the original premise ("books are the ledger") without losing the L1
canonical template or breaking the build.

---

## Until then

The corpus is honest about what it shows. Every citation surfaces
`livro` + `url` + `secao` — those are reliable: someone clicking the
link will land on the right book, the right section, and can confirm
the topic matches. They won't find the specific exercise number we
cited, because we stopped claiming a specific exercise number.

The exercise statements themselves remain — they're paraphrased from
the same general area of the same book. They are pedagogically sound
(the L01 set-builder exercises ARE set-builder exercises; only the
"ex. 5" pointer was wrong). What you lose by removing
`pagina`/`exercicio` is **false precision**, not actual content.
