'use client'

import Link from 'next/link'
import { useLocale } from '@/components/layout/LocaleProvider'
import { localizedHref } from '@/lib/i18n/href'
import type { Trimestre, Licao, AulaAgrupada } from '@/content/programa-em'
import {
  anoTitulo,
  trimTitulo,
  trimFoco,
  aulaTitulo,
} from '@/content/programa-em-i18n'
import {
  licaoTitulo,
  licaoTopicos,
} from '@/content/programa-em-licao-i18n.generated'

export interface TrimPageContentProps {
  anoNum: number
  trimNum: number
  /** PT-BR fallbacks from PROGRAMA_EM (used when no i18n entry exists). */
  anoTituloFallback: string
  trimTituloFallback: string
  trimFocoFallback: string
  licoes: Licao[]
  agrupamento: AulaAgrupada[]
  /** Trim object passed through to AulaCard so it can find lessons by num. */
  trimestre: Trimestre
  /** slug → caminho map for clickable published lessons. */
  slugToCaminho: Record<string, string>
  horasPorTrimestre: number
}

export function TrimPageContent({
  anoNum,
  trimNum,
  anoTituloFallback,
  trimTituloFallback,
  trimFocoFallback,
  licoes,
  agrupamento,
  trimestre,
  slugToCaminho,
  horasPorTrimestre,
}: TrimPageContentProps) {
  const { t, locale } = useLocale()

  const slugMap = new Map(Object.entries(slugToCaminho))
  const licoesPublicadas = licoes.filter(
    (l) => l.slug && slugMap.has(l.slug),
  ).length

  const lTermLabel = t('em.term')
  const lYearLabel = t('em.year')
  const lAnoTitulo = anoTitulo(anoNum, locale, anoTituloFallback)
  const lTrimTitulo = trimTitulo(trimNum, locale, trimTituloFallback)
  const lTrimFoco = trimFoco(trimNum, locale, trimFocoFallback)

  return (
    <article className="container-clube max-w-5xl py-12 sm:py-16">
      <nav aria-label="Trail" className="mb-6 text-sm text-clube-mist">
        <Link
          href="/ensino-medio"
          className="text-clube-teal hover:text-clube-teal-deep"
        >
          {t('em.breadcrumb.root')}
        </Link>{' '}
        /{' '}
        <Link
          href={`/ensino-medio/ano-${anoNum}/`}
          className="text-clube-teal hover:text-clube-teal-deep"
        >
          {lYearLabel} {anoNum}
        </Link>{' '}
        / {lTermLabel} {trimNum}
      </nav>

      <header className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
          {lTermLabel} {trimNum} · {lYearLabel} {anoNum}
        </p>
        <h1 className="text-display font-extrabold text-clube-teal-deep">
          {lTrimTitulo}
        </h1>
        <p className="mt-4 max-w-prose text-lg italic text-clube-mist">
          {lTrimFoco}
        </p>
        <p className="mt-3 text-sm text-clube-mist/80">
          {licoes.length} {t('em.lessons.count')} &nbsp;·&nbsp; {licoesPublicadas} {t('em.published.count')}
          &nbsp;·&nbsp; ~{horasPorTrimestre}{t('em.study.hours')}
        </p>
        {locale !== 'pt-BR' && (
          <p className="mt-2 text-xs text-clube-mist/60 italic">
            {/* Subtle UX cue: structure is translated, lesson titles fall back to PT-BR for now. */}
            ({lAnoTitulo})
          </p>
        )}
      </header>

      {agrupamento.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-clube-teal-deep">
            {t('em.classes.heading')}
          </h2>
          <p className="mt-1 text-sm text-clube-mist">
            {t('em.classes.sub')}
          </p>

          <div className="mt-6 space-y-6">
            {agrupamento.map((g, idx) => (
              <AulaCard
                key={g.id}
                aula={g}
                trimestre={trimestre}
                slugMap={slugMap}
                indice={idx}
              />
            ))}
          </div>
        </section>
      )}

      {agrupamento.length === 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-clube-teal-deep">
            {t('em.lessons.heading')}
          </h2>
          <p className="mt-1 text-sm text-clube-mist">
            {t('em.lessons.click')}
          </p>
          <ol className="mt-4 space-y-2">
            {licoes.map((l) => (
              <LicaoLinha key={l.num} licao={l} slugMap={slugMap} />
            ))}
          </ol>
        </section>
      )}

      <section className="mt-12 rounded-2xl border-l-4 border-clube-teal bg-clube-cream-soft p-6">
        <h3 className="text-base font-bold text-clube-teal-deep">
          {t('em.exams.heading')}
        </h3>
        <p
          className="mt-2 text-sm text-clube-ink/85"
          // Mini markdown for **bold** — single replace is safe.
          dangerouslySetInnerHTML={{
            __html: t('em.exams.text').replace(
              /\*\*(.+?)\*\*/g,
              '<strong>$1</strong>',
            ),
          }}
        />
        <div className="mt-4">
          <Link
            href={`/provas?trim=${trimNum}`}
            className="inline-flex items-center gap-2 rounded-full bg-clube-teal px-5 py-2 text-sm font-semibold text-white hover:bg-clube-teal-deep hover:no-underline"
          >
            {t('em.exams.cta')} {t('em.term.short')} {trimNum} →
          </Link>
        </div>
      </section>

      <nav className="mt-10 grid gap-3 sm:grid-cols-2">
        {trimNum > 1 && (
          <Link
            href={`/ensino-medio/ano-${Math.ceil((trimNum - 1) / 4)}/trim-${trimNum - 1}/`}
            className="card-clube no-underline hover:no-underline"
          >
            <div className="text-xs uppercase tracking-wider text-clube-mist">
              {t('em.nav.previous')}
            </div>
            <div className="mt-1 font-semibold text-clube-teal-deep">
              {lTermLabel} {trimNum - 1}
            </div>
          </Link>
        )}
        {trimNum < 12 && (
          <Link
            href={`/ensino-medio/ano-${Math.ceil((trimNum + 1) / 4)}/trim-${trimNum + 1}/`}
            className="card-clube no-underline hover:no-underline sm:text-right"
          >
            <div className="text-xs uppercase tracking-wider text-clube-mist">
              {t('em.nav.next')}
            </div>
            <div className="mt-1 font-semibold text-clube-teal-deep">
              {lTermLabel} {trimNum + 1}
            </div>
          </Link>
        )}
      </nav>
    </article>
  )
}

function AulaCard({
  aula,
  trimestre,
  slugMap,
  indice,
}: {
  aula: AulaAgrupada
  trimestre: Trimestre
  slugMap: Map<string, string>
  indice: number
}) {
  const { t, locale } = useLocale()
  const licoes = aula.licoesNums
    .map((n) => trimestre.aulas.find((l) => l.num === n))
    .filter((l): l is Licao => !!l)

  const cores = ['border-clube-teal', 'border-clube-gold', 'border-clube-leaf', 'border-clube-clay']
  const corBorda = cores[indice % cores.length]

  return (
    <div className={`rounded-2xl border-l-4 ${corBorda} bg-clube-surface p-5 shadow-sm`}>
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-bold text-clube-teal-deep">
          {aulaTitulo(aula.id, locale, aula.titulo)}
        </h3>
        <span className="rounded-full bg-clube-gold/15 px-3 py-1 text-xs font-mono uppercase tracking-wider text-clube-gold-deep">
          ~{aula.cargaHoraria}h · {licoes.length} {t('em.aula.lessons.short')}
        </span>
      </header>
      <ol className="space-y-2">
        {licoes.map((l) => (
          <LicaoLinha key={l.num} licao={l} slugMap={slugMap} />
        ))}
      </ol>
    </div>
  )
}

function LicaoLinha({
  licao,
  slugMap,
}: {
  licao: Licao
  slugMap: Map<string, string>
}) {
  const { t, locale } = useLocale()
  const caminho = licao.slug ? slugMap.get(licao.slug) : undefined
  const titulo = licaoTitulo(licao.num, locale, licao.titulo)
  const topicos = licaoTopicos(licao.num, locale, licao.topicos)
  const Inner = (
    <div className="flex items-start gap-3 text-sm">
      <span className="mt-0.5 inline-block min-w-[3.5rem] rounded-full bg-clube-cream-soft px-2 py-0.5 text-center font-mono text-[10px] font-bold text-clube-teal-deep">
        {t('em.lesson')} {licao.num}
      </span>
      <div className="flex-1">
        <div className="font-semibold text-clube-ink">{titulo}</div>
        <div className="text-xs text-clube-mist">{topicos}</div>
      </div>
      {caminho ? (
        <span className="rounded-full bg-clube-leaf/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-clube-leaf">
          {t('em.lesson.published')}
        </span>
      ) : (
        <span className="rounded-full bg-clube-mist-soft/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-clube-mist">
          {t('em.lesson.planned')}
        </span>
      )}
    </div>
  )

  return (
    <li className="rounded-lg border border-clube-mist-soft/30 bg-clube-cream-soft/30 px-3 py-2">
      {caminho ? (
        <Link
          href={localizedHref(caminho, locale)}
          className="block no-underline hover:no-underline hover:bg-clube-cream-soft -mx-3 -my-2 rounded-lg px-3 py-2"
        >
          {Inner}
        </Link>
      ) : (
        <div className="opacity-70">{Inner}</div>
      )}
    </li>
  )
}
