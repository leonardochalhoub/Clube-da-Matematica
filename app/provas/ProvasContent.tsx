'use client'

import { ProvaViewer } from '@/components/math/ProvaViewer'
import {
  PROVAS,
  PROVAS_REAIS,
  TOTAL_QUESTOES_REAIS,
} from '@/content/provas-data'
import { useLocale } from '@/components/layout/LocaleProvider'

export default function ProvasContent() {
  const { t } = useLocale()
  const totalProvas = PROVAS.length
  const totalCuradas = PROVAS_REAIS.length
  const trimsCobertos = new Set(PROVAS_REAIS.map((p) => p.trim)).size

  return (
    <article className="container-clube max-w-4xl py-12 sm:py-16">
      <header className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
          {t('page.exams.eyebrow')}
        </p>
        <h1 className="text-display font-extrabold text-clube-teal-deep">
          {t('page.exams.title')}
        </h1>
        <p className="mt-4 max-w-prose text-lg leading-relaxed text-clube-mist">
          {t('page.exams.intro1.before')}{' '}
          <strong>{t('page.exams.intro1.strong1')}</strong>{' '}
          {t('page.exams.intro1.middle')}{' '}
          <strong>{t('page.exams.intro1.strong2')}</strong>{' '}
          {t('page.exams.intro1.after')}
        </p>
        <p className="mt-3 max-w-prose text-base text-clube-mist/85">
          {t('page.exams.intro2.before')} <strong>OpenStax</strong>{' '}
          {t('page.exams.intro2.openstaxList')}{' '}
          <strong>Notes on Diffy Qs</strong>{' '}
          {t('page.exams.intro2.lebl')}{' '}
          <strong>Active Calculus</strong>{' '}
          {t('page.exams.intro2.boelkins')}{' '}
          {t('page.exams.intro2.after')}
        </p>
      </header>

      <section className="mb-10 grid gap-3 sm:grid-cols-4">
        <div className="card-clube text-center">
          <div className="text-2xl font-extrabold text-clube-teal-deep">
            {totalProvas}
          </div>
          <div className="mt-1 text-xs text-clube-mist">
            {t('page.exams.stats.examsInBank')}
          </div>
        </div>
        <div className="card-clube text-center">
          <div className="text-2xl font-extrabold text-clube-leaf">
            {totalCuradas}
          </div>
          <div className="mt-1 text-xs text-clube-mist">
            {t('page.exams.stats.curatedVersions')}
          </div>
        </div>
        <div className="card-clube text-center">
          <div className="text-2xl font-extrabold text-clube-gold-deep">
            {TOTAL_QUESTOES_REAIS}
          </div>
          <div className="mt-1 text-xs text-clube-mist">
            {t('page.exams.stats.realQuestions')}
          </div>
        </div>
        <div className="card-clube text-center">
          <div className="text-2xl font-extrabold text-clube-clay">
            {trimsCobertos}/12
          </div>
          <div className="mt-1 text-xs text-clube-mist">
            {t('page.exams.stats.termsCovered')}
          </div>
        </div>
      </section>

      <ProvaViewer />

      <footer className="mt-16 rounded-2xl bg-clube-cream-soft p-6 text-sm text-clube-mist">
        <h3 className="text-base font-bold text-clube-teal-deep">
          {t('page.exams.howItWorks.title')}
        </h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>{t('page.exams.howItWorks.step1')}</li>
          <li>{t('page.exams.howItWorks.step2')}</li>
          <li>
            {t('page.exams.howItWorks.step3.before')}{' '}
            <em>{t('page.exams.howItWorks.step3.em')}</em>.
          </li>
          <li>{t('page.exams.howItWorks.step4')}</li>
          <li>{t('page.exams.howItWorks.step5')}</li>
        </ol>
        <p className="mt-3 italic">{t('page.exams.howItWorks.note')}</p>
      </footer>
    </article>
  )
}
