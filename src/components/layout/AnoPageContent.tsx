'use client'

import Link from 'next/link'
import { useLocale } from './LocaleProvider'
import {
  anoTitulo as anoTituloI18n,
  anoResumo as anoResumoI18n,
  trimTitulo as trimTituloI18n,
  trimFoco as trimFocoI18n,
  aulaTitulo as aulaTituloI18n,
} from '@/content/programa-em-i18n'
import type {
  Aula,
  MateriaEM,
  Trimestre,
} from '@/content/programa-em'
import { MateriaTabs } from './MateriaTabs'
import { YearSearch } from './YearSearch'

interface AulaPath extends Aula {
  caminho?: string
}

export interface AnoPageContentProps {
  anoNum: number
  /** PT-BR fallbacks lifted from PROGRAMA_EM. */
  anoTituloFallback: string
  anoResumoFallback: string
  idade: string
  equivalencia: string
  trimestres: Trimestre[]
  materias: MateriaEM[]
  indexMaterias: Record<MateriaEM, AulaPath[]>
  allAulasFlat: Array<Aula & { caminho?: string; trimNum: number }>
  totalLicoes: number
  publicadas: number
  horasPorTrimestre: number
  horasPorAno: number
}

export function AnoPageContent({
  anoNum,
  anoTituloFallback,
  anoResumoFallback,
  idade,
  equivalencia,
  trimestres,
  materias,
  indexMaterias,
  allAulasFlat,
  totalLicoes,
  publicadas,
  horasPorTrimestre,
  horasPorAno,
}: AnoPageContentProps) {
  const { t, locale } = useLocale()
  const yearLabel = t('em.year', 'Ano')
  const breadcrumbRoot = t('em.breadcrumb.root', 'Ensino Médio')
  const lAnoTitulo = anoTituloI18n(anoNum, locale, anoTituloFallback)
  const lAnoResumo = anoResumoI18n(anoNum, locale, anoResumoFallback)

  return (
    <article className="container-clube max-w-6xl py-12 sm:py-16">
      <nav aria-label="Trail" className="mb-6 text-sm text-clube-mist">
        <Link
          href="/ensino-medio"
          className="text-clube-teal hover:text-clube-teal-deep"
        >
          {breadcrumbRoot}
        </Link>{' '}
        / {yearLabel} {anoNum}
      </nav>

      {/* TWO-COLUMN HERO */}
      <section className="mb-12 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
            {yearLabel} {anoNum} · {idade.replace(/\banos\b/, t('em.yearsOld'))}
          </p>
          <h1 className="text-display font-extrabold leading-tight text-clube-teal-deep">
            {lAnoTitulo}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-clube-ink/85">
            {lAnoResumo}
          </p>
          <p className="mt-4 text-sm italic text-clube-mist">{equivalencia}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-clube-teal-deep">
            {t('page.ano.cronograma.title')}
          </h2>
          <p className="mt-1 text-sm text-clube-mist">
            <strong>{t('page.ano.cronograma.helper.before')}</strong>{' '}
            {t('page.ano.cronograma.helper.middle')}{' '}
            <strong>{t('page.ano.cronograma.helper.classes')}</strong>{' '}
            {t('page.ano.cronograma.helper.after')}
          </p>
          <div className="mt-4 space-y-3">
            {trimestres.map((trim) => {
              const lTrimTitulo = trimTituloI18n(trim.num, locale, trim.titulo)
              const lTrimFoco = trimFocoI18n(trim.num, locale, trim.foco)
              const lessonsStudy = t('page.ano.cronograma.lessonsStudy')
                .replace('{n}', String(trim.aulas.length))
                .replace('{h}', String(horasPorTrimestre))
              return (
                <Link
                  key={trim.num}
                  href={`/ensino-medio/ano-${anoNum}/trim-${trim.num}/`}
                  className="group block rounded-xl border border-clube-mist-soft/40 bg-clube-surface p-4 no-underline transition-all hover:border-clube-teal hover:shadow-sm hover:no-underline"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-bold text-clube-teal-deep group-hover:text-clube-teal">
                      {lTrimTitulo}
                    </h3>
                    <span className="text-xs text-clube-teal opacity-0 transition-opacity group-hover:opacity-100">
                      {t('page.ano.cronograma.open')}
                    </span>
                  </div>
                  <p className="mt-1 text-xs italic text-clube-mist">
                    {lTrimFoco}
                  </p>
                  <p className="mt-2 text-xs text-clube-mist/85">
                    {lessonsStudy}
                  </p>
                  {trim.agrupamento && trim.agrupamento.length > 0 && (
                    <ul className="mt-3 space-y-1 border-t border-clube-mist-soft/40 pt-3">
                      {trim.agrupamento.map((g) => {
                        const lessonsParen = t(
                          'page.ano.cronograma.lessonsCountParen',
                        ).replace('{n}', String(g.licoesNums.length))
                        return (
                          <li
                            key={g.id}
                            className="flex items-baseline gap-2 text-[11px]"
                          >
                            <span className="rounded-full bg-clube-gold/15 px-2 py-0.5 font-mono uppercase tracking-wider text-clube-gold-deep">
                              ~{g.cargaHoraria}h
                            </span>
                            <span className="text-clube-ink/85">
                              {aulaTituloI18n(g.id, locale, g.titulo)}
                            </span>
                            <span className="ml-auto text-clube-mist/70">
                              {lessonsParen}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <YearSearch aulas={allAulasFlat} anoNum={anoNum} />

      {/* KPI ROW */}
      <section className="mb-12 grid gap-3 grid-cols-2 sm:grid-cols-4">
        <div className="card-clube !p-4 text-center sm:!p-6">
          <div className="text-xl font-extrabold text-clube-teal-deep sm:text-2xl">
            {totalLicoes}
          </div>
          <div className="mt-1 text-xs text-clube-mist">
            {t('page.ano.kpi.lessonsYear')}
          </div>
        </div>
        <div className="card-clube !p-4 text-center sm:!p-6">
          <div className="text-xl font-extrabold text-clube-leaf sm:text-2xl">
            {publicadas}
            <span className="text-clube-mist/70"> / {totalLicoes}</span>
          </div>
          <div className="mt-1 text-xs text-clube-mist">
            {t('page.ano.kpi.lessonsPublished')}
          </div>
        </div>
        <div className="card-clube !p-4 text-center sm:!p-6">
          <div className="text-xl font-extrabold text-clube-gold-deep sm:text-2xl">
            {materias.length}
          </div>
          <div className="mt-1 text-xs text-clube-mist">
            {t('page.ano.kpi.subjectsCovered')}
          </div>
        </div>
        <div className="card-clube !p-4 text-center sm:!p-6">
          <div className="text-xl font-extrabold text-clube-clay sm:text-2xl">
            ~{horasPorAno}h
          </div>
          <div className="mt-1 text-xs text-clube-mist">
            {t('page.ano.kpi.studyYear').replace(
              '{h}',
              String(horasPorTrimestre),
            )}
          </div>
        </div>
      </section>

      {/* MATERIA TABS */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-clube-teal-deep">
          {t('page.ano.materia.title')}
        </h2>
        <MateriaTabs materias={materias} aulasPorMateria={indexMaterias} />
      </section>

      {/* PREV / NEXT */}
      <section className="mt-16 grid gap-3 sm:grid-cols-2">
        {anoNum > 1 && (
          <Link
            href={`/ensino-medio/ano-${anoNum - 1}/`}
            className="card-clube no-underline hover:no-underline"
          >
            <div className="text-xs uppercase tracking-wider text-clube-mist">
              {t('em.nav.previous')}
            </div>
            <div className="mt-1 font-semibold text-clube-teal-deep">
              {yearLabel} {anoNum - 1}
            </div>
          </Link>
        )}
        {anoNum < 3 && (
          <Link
            href={`/ensino-medio/ano-${anoNum + 1}/`}
            className="card-clube no-underline hover:no-underline sm:text-right"
          >
            <div className="text-xs uppercase tracking-wider text-clube-mist">
              {t('em.nav.next')}
            </div>
            <div className="mt-1 font-semibold text-clube-teal-deep">
              {yearLabel} {anoNum + 1}
            </div>
          </Link>
        )}
      </section>
    </article>
  )
}
