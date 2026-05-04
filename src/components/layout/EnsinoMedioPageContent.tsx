'use client'

import Link from 'next/link'
import type { Ano } from '@/content/programa-em'
import { AulasSearch } from './AulasSearch'
import { HashOpener } from './HashOpener'
import { useLocale } from './LocaleProvider'

/**
 * Conteúdo client-side da página /ensino-medio.
 * UI strings PT-BR foram extraídas pra useLocale().t() — i18n via LocaleProvider.
 * Os dados (titulo/resumo/idade/equivalencia dos anos) vêm do data file
 * `programa-em.ts` e ficam em PT-BR (são propriedade de conteúdo, não de UI).
 */
export interface EnsinoMedioPageContentProps {
  programa: Ano[]
  totalLicoes: number
  totalPublicadas: number
  publicadasPorAno: Record<number, number>
  totalPorAno: Record<number, number>
  horasPorTrim: number
  horasPorAno: number
  horasTotais: number
  slugToCaminho: Record<string, string>
}

export function EnsinoMedioPageContent({
  programa,
  totalLicoes,
  totalPublicadas,
  publicadasPorAno,
  totalPorAno,
  horasPorTrim,
  horasPorAno,
  horasTotais,
  slugToCaminho,
}: EnsinoMedioPageContentProps) {
  const { t } = useLocale()
  const studyDetail = t('page.ensinoMedio.stats.studyDetail').replace(
    '{hPorTrim}',
    String(horasPorTrim),
  )

  return (
    <article className="container-clube max-w-5xl py-12 sm:py-16">
      <header className="mb-12">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
          {t('page.ensinoMedio.eyebrow')}
        </p>
        <h1 className="text-display font-extrabold text-clube-teal-deep">
          {t('page.ensinoMedio.title')}
        </h1>
        <p className="mt-6 max-w-prose text-lg leading-relaxed text-clube-mist">
          <strong>{t('page.ensinoMedio.intro1.threeYears')}</strong>{' '}
          {t('page.ensinoMedio.intro1.groupedInto')}{' '}
          <strong>{t('page.ensinoMedio.intro1.classes')}</strong>
          {t('page.ensinoMedio.intro1.middle')}{' '}
          <strong>{t('page.ensinoMedio.intro1.japanLabel')}</strong> (Math I/II/III),{' '}
          <strong>{t('page.ensinoMedio.intro1.germanyLabel')}</strong> (Klasse 10/11/12 Leistungskurs) e{' '}
          <strong>{t('page.ensinoMedio.intro1.singaporeLabel')}</strong> (Sec 4 + JC 1/2 H2 Math).
        </p>
        <p className="mt-4 max-w-prose text-base text-clube-mist/85">
          {t('page.ensinoMedio.intro2.before')}{' '}
          <strong>{t('page.ensinoMedio.intro2.exercises')}</strong>{' '}
          {t('page.ensinoMedio.intro2.middle')}{' '}
          <strong>{t('page.ensinoMedio.intro2.solved')}</strong>{' '}
          {t('page.ensinoMedio.intro2.middle2')}{' '}
          <strong>{t('page.ensinoMedio.intro2.readAloud')}</strong>{' '}
          {t('page.ensinoMedio.intro2.after')}
        </p>
      </header>

      <section className="mb-12 grid gap-3 grid-cols-2 sm:gap-4 sm:grid-cols-4">
        <div className="card-clube !p-4 text-center sm:!p-6">
          <div className="text-2xl font-extrabold text-clube-teal-deep sm:text-3xl">
            {totalLicoes}
          </div>
          <div className="mt-1 text-xs text-clube-mist sm:text-sm">
            {t('page.ensinoMedio.stats.lessonsPlanned')}
          </div>
        </div>
        <div className="card-clube !p-4 text-center sm:!p-6">
          <div className="text-2xl font-extrabold text-clube-leaf sm:text-3xl">
            {totalPublicadas}
          </div>
          <div className="mt-1 text-xs text-clube-mist sm:text-sm">
            {t('page.ensinoMedio.stats.lessonsPublished')}
          </div>
        </div>
        <div className="card-clube !p-4 text-center sm:!p-6">
          <div className="text-2xl font-extrabold text-clube-gold-deep sm:text-3xl">~6.000</div>
          <div className="mt-1 text-xs text-clube-mist sm:text-sm">
            {t('page.ensinoMedio.stats.totalExercises')}
          </div>
        </div>
        <div className="card-clube !p-4 text-center sm:!p-6">
          <div className="text-2xl font-extrabold text-clube-clay sm:text-3xl">
            ~{horasTotais}h
          </div>
          <div className="mt-1 text-xs text-clube-mist sm:text-sm">
            {t('page.ensinoMedio.stats.totalStudy')} ({horasPorAno}{studyDetail})
          </div>
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-clube-mist-soft/40 bg-clube-surface p-5">
        <AulasSearch caminhos={slugToCaminho} />
      </section>

      <section className="mb-10 rounded-xl border border-clube-mist-soft/40 bg-clube-cream-soft p-4 text-sm text-clube-ink/85">
        <p>
          <strong>{t('page.ensinoMedio.workload.before')}</strong>{' '}
          {t('page.ensinoMedio.workload.middle')} {horasPorAno}
          {t('page.ensinoMedio.workload.middle2')}{' '}
          <em>{t('page.ensinoMedio.workload.lesson')}</em>{' '}
          {t('page.ensinoMedio.workload.equiv')}{' '}
          <em>{t('page.ensinoMedio.workload.class')}</em>{' '}
          {t('page.ensinoMedio.workload.groups')}{' '}
          <Link href="/manifesto" className="text-clube-teal">
            {t('page.ensinoMedio.workload.manifesto')}
          </Link>
          .
        </p>
      </section>

      <HashOpener />

      <section className="space-y-3">
        {programa.map((ano) => {
          const publicadas = publicadasPorAno[ano.num] ?? 0
          const total = totalPorAno[ano.num] ?? 0
          const percent = total === 0 ? 0 : Math.round((publicadas / total) * 100)
          return (
            <details
              key={ano.num}
              id={`ano-${ano.num}`}
              className="group rounded-xl border border-clube-mist-soft/40 bg-clube-surface"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 marker:hidden [&::-webkit-details-marker]:hidden">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
                    {t('page.ensinoMedio.year.label')} {ano.num} · {ano.idade}
                  </span>
                  <h2 className="mt-1 text-xl font-extrabold leading-tight text-clube-teal-deep group-open:text-clube-teal">
                    {ano.titulo}
                  </h2>
                  <p className="mt-1 text-sm leading-snug text-clube-mist">
                    {ano.resumo}
                  </p>
                  <p className="mt-2 text-[11px] text-clube-mist/80">
                    <strong className="text-clube-leaf">{publicadas}</strong>{' '}
                    {t('page.ensinoMedio.year.publishedOf')} {total}{' '}
                    {t('page.ensinoMedio.year.lessonsPublished')} ({percent}%)
                    <span className="ml-2 italic text-clube-mist/70">
                      {ano.equivalencia}
                    </span>
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl leading-none text-clube-teal transition-transform group-open:rotate-90"
                >
                  ›
                </span>
              </summary>

              <div className="border-t border-clube-mist-soft/40 px-5 pb-5 pt-4">
                <div className="space-y-2">
                  {ano.trimestres.map((trim) => {
                    const publishedCount = trim.aulas.filter(
                      (l) => l.slug && slugToCaminho[l.slug],
                    ).length
                    return (
                      <details
                        key={trim.num}
                        id={`ano-${ano.num}-trim-${trim.num}`}
                        className="group/trim rounded-lg border border-clube-mist-soft/30 bg-clube-cream-soft/40"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:hidden [&::-webkit-details-marker]:hidden">
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-semibold text-clube-teal-deep">
                              {trim.titulo}
                            </span>
                            <span className="ml-3 text-xs text-clube-mist">
                              {publishedCount}/{trim.aulas.length} ·{' '}
                              ~{horasPorTrim}h
                            </span>
                          </div>
                          <span
                            aria-hidden="true"
                            className="text-base leading-none text-clube-teal transition-transform group-open/trim:rotate-90"
                          >
                            ›
                          </span>
                        </summary>

                        <ol className="divide-y divide-clube-mist-soft/20 px-4 pb-3 pt-1">
                          {trim.aulas.map((licao) => {
                            const caminho = licao.slug
                              ? slugToCaminho[licao.slug]
                              : undefined
                            return (
                              <li key={licao.num} className="py-2">
                                {caminho ? (
                                  <Link
                                    href={`/${caminho}/`}
                                    className="flex items-center gap-3 text-sm no-underline hover:no-underline"
                                  >
                                    <span className="min-w-[2.5rem] font-mono text-[10px] font-bold text-clube-teal-deep">
                                      L{licao.num}
                                    </span>
                                    <span className="flex-1 font-medium text-clube-ink hover:text-clube-teal">
                                      {licao.titulo}
                                    </span>
                                    <span
                                      aria-hidden="true"
                                      className="rounded-full bg-clube-leaf/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-clube-leaf"
                                    >
                                      →
                                    </span>
                                  </Link>
                                ) : (
                                  <div className="flex items-center gap-3 text-sm opacity-60">
                                    <span className="min-w-[2.5rem] font-mono text-[10px] font-bold text-clube-teal-deep">
                                      L{licao.num}
                                    </span>
                                    <span className="flex-1 text-clube-mist">
                                      {licao.titulo}
                                    </span>
                                    <span className="rounded-full bg-clube-mist-soft/40 px-2 py-0.5 text-[10px] font-semibold uppercase text-clube-mist">
                                      {t('materia.status.planned')}
                                    </span>
                                  </div>
                                )}
                              </li>
                            )
                          })}
                        </ol>
                      </details>
                    )
                  })}
                </div>

                <div className="mt-3 text-right">
                  <Link
                    href={`/ensino-medio/ano-${ano.num}/`}
                    className="text-xs text-clube-teal hover:text-clube-teal-deep"
                  >
                    {t('page.ensinoMedio.year.openYear')} {ano.num}{' '}
                    {t('page.ensinoMedio.year.openYearSuffix')}
                  </Link>
                </div>
              </div>
            </details>
          )
        })}
      </section>

      <section className="mt-14 rounded-2xl border-l-4 border-clube-teal bg-clube-cream-soft p-6">
        <h2 className="text-lg font-bold text-clube-teal-deep">
          {t('page.ensinoMedio.philosophy.title')}
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-clube-ink/85">
          <li>
            <strong>{t('page.ensinoMedio.philosophy.bruner.label')}</strong>
            {t('page.ensinoMedio.philosophy.bruner.text')}
          </li>
          <li>
            <strong>{t('page.ensinoMedio.philosophy.vygotsky.label')}</strong>
            {t('page.ensinoMedio.philosophy.vygotsky.text')}
          </li>
          <li>
            <strong>{t('page.ensinoMedio.philosophy.singapore.label')}</strong>
            {t('page.ensinoMedio.philosophy.singapore.text')}
          </li>
          <li>
            <strong>{t('page.ensinoMedio.philosophy.japan.label')}</strong>
            {t('page.ensinoMedio.philosophy.japan.text')}
          </li>
          <li>
            <strong>{t('page.ensinoMedio.philosophy.germany.label')}</strong>
            {t('page.ensinoMedio.philosophy.germany.text')}
          </li>
          <li>
            <strong>{t('page.ensinoMedio.philosophy.brazil.label')}</strong>
            {t('page.ensinoMedio.philosophy.brazil.text')}
          </li>
        </ul>
      </section>

      <footer className="mt-12 rounded-2xl bg-clube-cream-soft p-6 text-sm text-clube-mist">
        <h3 className="text-base font-bold text-clube-teal-deep">
          {t('page.ensinoMedio.contribute.title')}
        </h3>
        <p className="mt-2">
          {t('page.ensinoMedio.contribute.text.before')}{' '}
          <code>content/aulas/ano-N/trim-T/aula-NN.mdx</code>.{' '}
          {t('page.ensinoMedio.contribute.text.middle')}{' '}
          <code>&lt;ListaExercicios seed=&quot;aula-NN&quot;&gt;</code>{' '}
          {t('page.ensinoMedio.contribute.text.after')}
        </p>
      </footer>
    </article>
  )
}
