# Navigation Redesign Spec — Ensino Médio

**Date:** 2026-05-04  
**Status:** Ready to implement  
**Source:** Design council (conselheira-design) + Engineering council (conselheiro-eng-software) — two-round dialogue

---

## Problem

4 clicks + multiple scrolls to reach any lesson:

1. `/ensino-medio` → click Ano card
2. `/ensino-medio/ano-1` → scroll → click Trimestre card
3. `/ensino-medio/ano-1/trim-1` → scroll → click Lesson
4. Lesson loads

Target: **2 clicks** from `/ensino-medio` to any lesson.

---

## Architecture decisions (council consensus)

### DO: `<details>/<summary>` accordion, not `useState`

Native HTML accordion for zero-JS operation. Brazilian public school students on 3G with script blockers must be able to navigate. `<details>` is keyboard-accessible by default (Enter on `<summary>` toggles), has native `aria-expanded`, no extra wiring required.

Pair with a single thin `<HashOpener />` client component that reads `window.location.hash` on mount and imperatively calls `.setAttribute('open', '')` on the matching `<details>` DOM node. No state, no re-renders, no hydration mismatch.

### DO NOT: redirect sub-pages

Keep `/ensino-medio/ano-N` and `/ensino-medio/ano-N/trim-T` as real static pages. They serve:
- Teacher deep-links and SEO
- The "Avalie-se" CTA with `<Link href="/provas?trim=T">` on the trim page
- `MateriaTabs` subject-based navigation on the ano page

No `permanentRedirect`. No `useSearchParams`. Both cause issues in `output: 'export'` on GitHub Pages.

### Hash URL sync

When user expands a year or trimester in the accordion, write `history.replaceState(null, '', '#ano-1-trim-3')`. Use `replaceState` not `pushState` — accordion expansion must not create history entries. Only navigating to a lesson creates a history entry.

On mount, `<HashOpener />` reads the hash and opens the matching panels.

---

## Priority 1 — Accordion on `/ensino-medio` (core fix)

### File: `src/components/layout/EnsinoMedioPageContent.tsx`

Replace lines 125–164 (the `section.grid.md:grid-cols-3` year card grid) with a nested `<details>/<summary>` accordion.

**Structure:**

```tsx
<section className="space-y-3">
  {programa.map((ano) => (
    <details key={ano.num} id={`ano-${ano.num}`} className="group rounded-xl border border-clube-mist-soft/40 bg-clube-surface">
      <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 marker:hidden">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
            Ano {ano.num} · {ano.idade}
          </span>
          <h2 className="mt-1 text-xl font-extrabold text-clube-teal-deep group-open:text-clube-teal">
            {ano.titulo}
          </h2>
          <p className="mt-1 text-sm text-clube-mist">{ano.resumo}</p>
        </div>
        <span className="shrink-0 text-clube-teal transition-transform group-open:rotate-90">›</span>
      </summary>

      <div className="border-t border-clube-mist-soft/40 px-5 pb-5 pt-4">
        <div className="space-y-2">
          {ano.trimestres.map((trim) => (
            <details key={trim.num} id={`ano-${ano.num}-trim-${trim.num}`} className="rounded-lg border border-clube-mist-soft/30 bg-clube-cream-soft/40">
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 marker:hidden">
                <div>
                  <span className="text-sm font-semibold text-clube-teal-deep">{trim.titulo}</span>
                  <span className="ml-3 text-xs text-clube-mist">{trim.aulas.length} lições · ~{horasPorTrim}h</span>
                </div>
                <span className="text-xs text-clube-teal transition-transform group-open:rotate-90">›</span>
              </summary>

              <ol className="divide-y divide-clube-mist-soft/20 px-4 pb-3 pt-1">
                {trim.aulas.map((licao) => {
                  const caminho = licao.slug ? slugToCaminho[licao.slug] : undefined
                  return (
                    <li key={licao.num} className="py-2">
                      {caminho ? (
                        <Link href={`/${caminho}/`} className="flex items-center gap-3 text-sm no-underline hover:no-underline">
                          <span className="min-w-[3rem] font-mono text-[10px] font-bold text-clube-teal-deep">
                            L{licao.num}
                          </span>
                          <span className="flex-1 font-medium text-clube-ink hover:text-clube-teal">
                            {licao.titulo}
                          </span>
                          <span className="rounded-full bg-clube-leaf/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-clube-leaf">
                            →
                          </span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 text-sm opacity-50">
                          <span className="min-w-[3rem] font-mono text-[10px] font-bold text-clube-teal-deep">
                            L{licao.num}
                          </span>
                          <span className="flex-1 text-clube-mist">{licao.titulo}</span>
                          <span className="rounded-full bg-clube-mist-soft/40 px-2 py-0.5 text-[10px] font-semibold uppercase text-clube-mist">
                            planejada
                          </span>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ol>
            </details>
          ))}
        </div>

        <div className="mt-3 text-right">
          <Link href={`/ensino-medio/ano-${ano.num}/`} className="text-xs text-clube-teal hover:text-clube-teal-deep">
            Ver Ano {ano.num} completo (por matéria) →
          </Link>
        </div>
      </div>
    </details>
  ))}
</section>
```

### New file: `src/components/layout/HashOpener.tsx`

```tsx
'use client'
import { useEffect } from 'react'

export function HashOpener() {
  useEffect(() => {
    const hash = window.location.hash.slice(1) // e.g. "ano-1-trim-3"
    if (!hash) return
    const el = document.getElementById(hash)
    if (el && el.tagName === 'DETAILS') {
      el.setAttribute('open', '')
      // Also open parent <details> if nested
      const parent = el.closest('details:not(#' + hash + ')')
      if (parent) parent.setAttribute('open', '')
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // Write hash on user-driven accordion expand
  useEffect(() => {
    const handler = (e: Event) => {
      const details = e.target as HTMLDetailsElement
      if (details.tagName !== 'DETAILS' || !details.id) return
      if (details.open) {
        history.replaceState(null, '', `#${details.id}`)
      }
    }
    document.addEventListener('toggle', handler, true)
    return () => document.removeEventListener('toggle', handler, true)
  }, [])

  return null
}
```

Add `<HashOpener />` inside `EnsinoMedioPageContent` (it is already `'use client'`, so no new boundary needed).

---

## Priority 2 — Prev/Next lesson navigation in LessonPageShell

### File: `src/content/programa-em.ts` (or wherever `PROGRAMA_EM` is exported)

Add at the bottom:

```typescript
export const LICOES_FLAT = PROGRAMA_EM.flatMap((ano) =>
  ano.trimestres.flatMap((trim) => trim.aulas)
)
```

### File: `app/[categoria]/[...caminho]/page.tsx`

After resolving the current lesson's slug, compute prev/next:

```typescript
import { LICOES_FLAT } from '@/content/programa-em'

// Inside the page component, after slug resolution:
const currentIdx = LICOES_FLAT.findIndex((l) => l.slug === conteudo.meta.slug)
const prevLicao = currentIdx > 0 ? LICOES_FLAT[currentIdx - 1] : null
const nextLicao = currentIdx >= 0 && currentIdx < LICOES_FLAT.length - 1
  ? LICOES_FLAT[currentIdx + 1]
  : null

const prevCaminho = prevLicao?.slug ? slugToCaminho.get(prevLicao.slug) : undefined
const nextCaminho = nextLicao?.slug ? slugToCaminho.get(nextLicao.slug) : undefined
```

Pass `prevLicao`, `nextLicao`, `prevCaminho`, `nextCaminho` as props to `LessonPageShell`.

### File: `src/components/layout/LessonPageShell.tsx`

Add optional props:

```typescript
interface PrevNext {
  num: number
  titulo: string
  caminho?: string
}

// Add to props interface:
prevLicao?: PrevNext
nextLicao?: PrevNext
```

Add at the bottom of the article (before closing `</article>`):

```tsx
{(prevLicao || nextLicao) && (
  <nav className="mt-16 grid gap-3 sm:grid-cols-2 border-t border-clube-mist-soft/40 pt-8">
    {prevLicao?.caminho ? (
      <Link href={`/${prevLicao.caminho}/`} className="card-clube no-underline hover:no-underline">
        <div className="text-xs uppercase tracking-wider text-clube-mist">← Anterior</div>
        <div className="mt-1 text-sm font-semibold text-clube-teal-deep">
          Lição {prevLicao.num} — {prevLicao.titulo}
        </div>
      </Link>
    ) : <div />}
    {nextLicao?.caminho ? (
      <Link href={`/${nextLicao.caminho}/`} className="card-clube no-underline hover:no-underline sm:text-right">
        <div className="text-xs uppercase tracking-wider text-clube-mist">Próxima →</div>
        <div className="mt-1 text-sm font-semibold text-clube-teal-deep">
          Lição {nextLicao.num} — {nextLicao.titulo}
        </div>
      </Link>
    ) : <div />}
  </nav>
)}
```

---

## Priority 3 — Trim page stats → inline string

### File: `app/ensino-medio/[ano]/[trim]/page.tsx`

Delete lines 101–120 (the `section.grid.gap-3.sm:grid-cols-3` stat cards).

Replace with a single line in the `<header>` block (after line 99, inside the header):

```tsx
<p className="mt-3 text-sm text-clube-mist/80">
  {licoes.length} lições &nbsp;·&nbsp; {licoesPublicadas} publicadas &nbsp;·&nbsp; ~{HORAS_POR_TRIMESTRE}h de estudo
</p>
```

---

## Priority 4 — Search cold-start UX

### File: `src/components/layout/AulasSearch.tsx`

In the zero-query state (where `query.trim() === ''` returns empty array), show lesson 1 as a "start here" card.

Find the render logic for the empty-results case and replace with:

```tsx
{query.trim() === '' && (
  <div className="mt-3">
    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-clube-mist">
      Comece aqui
    </p>
    {/* Show first 4 published lessons as chips */}
    <div className="flex flex-wrap gap-2">
      {todasAulas
        .filter((l) => l.slug && caminhos[l.slug])
        .slice(0, 4)
        .map((l) => (
          <Link
            key={l.slug}
            href={`/${caminhos[l.slug!]}/`}
            className="rounded-full border border-clube-teal/30 bg-clube-cream-soft px-3 py-1 text-xs font-medium text-clube-teal no-underline hover:bg-clube-teal hover:text-white"
          >
            Lição {l.num} — {l.titulo}
          </Link>
        ))}
    </div>
  </div>
)}
```

`todasAulas` is already derived from `PROGRAMA_EM` in a `useMemo` inside the component. `caminhos` is the existing prop. No new data source needed.

---

## Priority 5 — Philosophy section below fold

### File: `src/components/layout/EnsinoMedioPageContent.tsx`

Move the `<section className="mt-14 rounded-2xl border-l-4 border-clube-teal ...">` philosophy block (currently rendered before/between year cards) to **after** the accordion section and before the `<footer>`. It is editorial context, not navigation — it should not compete for above-the-fold space.

---

## What stays unchanged

- `/ensino-medio/ano-N/` pages — real pages with `MateriaTabs`, no redirect
- `/ensino-medio/ano-N/trim-T/` pages — real pages with "Avalie-se" CTA, no redirect
- All `/aulas/...` lesson routes — untouched
- All `/[locale]/...` translated routes — untouched
- Build process, `generateStaticParams`, `carregarTodosConteudos` — untouched
- `HORAS_POR_TRIMESTRE` / `HORAS_POR_ANO` constants — untouched

---

## What NOT to do

- Do NOT use `useSearchParams` in the accordion — breaks static export on GitHub Pages
- Do NOT use `permanentRedirect` for ano/trim sub-pages — creates redirect loops in static export
- Do NOT use `history.pushState` for accordion state — creates phantom history entries
- Do NOT add a third-party accordion library — two `<details>` levels require zero external code
- Do NOT delete the sub-pages before verifying no external links point to them

---

## Files to create / modify (summary)

| File | Action |
|---|---|
| `src/components/layout/HashOpener.tsx` | Create new |
| `src/components/layout/EnsinoMedioPageContent.tsx` | Replace year card grid with accordion + add `<HashOpener />` |
| `src/content/programa-em.ts` | Add `LICOES_FLAT` export |
| `app/[categoria]/[...caminho]/page.tsx` | Compute prev/next, pass to shell |
| `src/components/layout/LessonPageShell.tsx` | Add prev/next nav section |
| `app/ensino-medio/[ano]/[trim]/page.tsx` | Remove 3-card stat block, add inline string |
| `src/components/layout/AulasSearch.tsx` | Add zero-query start-here chips |

---

## Engineering notes for implementer

- `PROGRAMA_EM` is in `src/content/programa-em.ts` — check exact path before editing
- `LessonPageShell` is `'use client'` (uses `useLocale()`). Prev/next data comes in as props from the server page — no client-side data fetching needed
- The `slugToCaminho` map is already computed in both `app/ensino-medio/page.tsx` and the lesson page — reuse it
- After changes, run `npm run typecheck` then `NODE_OPTIONS=--max-old-space-size=8192 npm run build` to verify no OOM
- KaTeX equation blocks in lessons can be wide — if adding a sidebar mini-nav to `LessonPageShell` later, do a visual QA pass on equation overflow at the narrower prose width

---

*Generated by design + engineering council dialogue. 2026-05-04.*
