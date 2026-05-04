'use client'

import { useLocale } from './LocaleProvider'
import { VisitorMap } from './VisitorMap'

/**
 * Conteúdo client-side da página /mapa.
 * Strings PT-BR foram extraídas pra useLocale().t() — i18n via LocaleProvider.
 * O `app/mapa/page.tsx` permanece server (mantém export `metadata`) e renderiza este.
 */
export function MapaPageContent() {
  const { t } = useLocale()

  return (
    <main className="container-clube py-16 sm:py-20">
      <header className="mx-auto mb-10 max-w-3xl text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
          {t('mapa.eyebrow')}
        </p>
        <h1 className="text-hero font-bold text-clube-teal-deep">
          {t('mapa.title')}
        </h1>
        <p className="mt-4 text-base text-clube-ink/80">
          {t('mapa.intro')}
        </p>
        <p className="mt-2 text-sm italic text-clube-mist">
          {t('mapa.curiosity')}
        </p>
      </header>

      <VisitorMap />

      <footer className="mx-auto mt-16 max-w-3xl rounded-2xl border border-clube-mist-soft/40 bg-clube-cream-soft/30 p-6 text-sm text-clube-mist">
        <h2 className="mb-2 text-base font-semibold text-clube-teal-deep">
          {t('mapa.how.title')}
        </h2>
        <ol className="ml-5 list-decimal space-y-1 text-xs">
          <li>
            {t('mapa.how.step1.before')}{' '}
            <code className="rounded bg-clube-cream px-1 py-0.5">ipapi.co</code>{' '}
            {t('mapa.how.step1.after')}
          </li>
          <li>
            {t('mapa.how.step2.before')}{' '}
            <code className="rounded bg-clube-cream px-1 py-0.5">CounterAPI.dev</code>{' '}
            {t('mapa.how.step2.after')} <code>clube-pais-br</code>,{' '}
            <code>clube-pais-de</code>, {t('mapa.how.step2.etc')}
          </li>
          <li>
            {t('mapa.how.step3.before')}{' '}
            <strong className="text-clube-ink/85">
              {t('mapa.how.step3.bold')}
            </strong>
          </li>
          <li>
            {t('mapa.how.step4.before')}
            <code className="rounded bg-clube-cream px-1 py-0.5"> sessionStorage</code>
            {t('mapa.how.step4.after')}
          </li>
        </ol>
      </footer>
    </main>
  )
}
