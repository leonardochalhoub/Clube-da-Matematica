'use client'

import { useLocale } from './LocaleProvider'

/**
 * Seção "Filosofia" da home — 3 colunas (Khan / Portas / Caderno).
 * Strings PT-BR foram extraídas pra useLocale().t() — i18n via LocaleProvider.
 * O `app/page.tsx` permanece server e renderiza este shell client.
 */
export function HomePhilosophy() {
  const { t } = useLocale()

  return (
    <section className="border-y border-clube-mist-soft/30 bg-clube-cream-soft py-16">
      <div className="container-clube grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-clube-teal-deep">
            {t('home.philosophy.khan.title')}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-clube-ink/80">
            {t('home.philosophy.khan.body')}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-clube-teal-deep">
            {t('home.philosophy.doors.title')}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-clube-ink/80">
            {t('home.philosophy.doors.body')}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-clube-teal-deep">
            {t('home.philosophy.exercises.title')}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-clube-ink/80">
            {t('home.philosophy.exercises.body')}
          </p>
        </div>
      </div>
    </section>
  )
}
