'use client'

import Link from 'next/link'
import { useLocale } from './LocaleProvider'

/**
 * Conteúdo client-side da página /financas.
 * UI strings PT-BR foram extraídas pra useLocale().t() — i18n via LocaleProvider.
 * Os dados de cada conteúdo (titulo/descricao/subcategoria) vêm do MDX e ficam
 * em PT-BR (são propriedade de conteúdo, não de UI).
 */
export interface FinancasItem {
  slug: string
  caminho: string
  titulo: string
  descricao: string
  subcategoria: string
  usadoEm: string[]
}

export interface FinancasPageContentProps {
  conteudos: FinancasItem[]
}

export function FinancasPageContent({ conteudos }: FinancasPageContentProps) {
  const { t } = useLocale()

  return (
    <article className="container-clube max-w-5xl py-12 sm:py-16">
      <header className="mb-12">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
          {t('page.financas.eyebrow')}
        </p>
        <h1 className="text-display font-extrabold text-clube-teal-deep">
          {t('page.financas.title')}
        </h1>
        <p className="mt-6 max-w-prose text-lg leading-relaxed text-clube-mist">
          {t('page.financas.intro1.before')}{' '}
          <strong>{t('page.financas.intro1.bold')}</strong>{' '}
          {t('page.financas.intro1.after')}
        </p>
        <p className="mt-4 max-w-prose text-base text-clube-mist/85">
          {t('page.financas.intro2.before')}{' '}
          <Link href="/ensino-medio" className="text-clube-teal">
            {t('page.financas.intro2.linkText')}
          </Link>
          {t('page.financas.intro2.middle')}{' '}
          <strong>{t('page.financas.intro2.bold')}</strong>{' '}
          {t('page.financas.intro2.after')}
        </p>
      </header>

      <section className="mb-12 overflow-hidden rounded-2xl border-2 border-clube-gold/30 bg-gradient-to-b from-clube-cream-soft to-clube-surface p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
          {t('page.financas.featured.eyebrow')}
        </p>
        <h2 className="mt-2 text-3xl font-extrabold text-clube-teal-deep">
          {t('page.financas.featured.title')}
        </h2>
        <p className="mt-3 text-clube-mist">
          {t('page.financas.featured.body.before')}{' '}
          <strong>{t('page.financas.featured.body.bold')}</strong>{' '}
          {t('page.financas.featured.body.after')}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/financas-quantitativas/opcoes/black-scholes/"
            className="inline-flex items-center gap-2 rounded-full bg-clube-teal px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-clube-teal-deep hover:no-underline hover:shadow"
          >
            {t('page.financas.featured.openPage')}
            <span aria-hidden>→</span>
          </Link>
          <a
            href="https://www.nobelprize.org/prizes/economic-sciences/1997/summary/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-clube-mist-soft/60 bg-clube-surface px-5 py-2.5 font-semibold text-clube-ink transition-all hover:border-clube-teal hover:text-clube-teal hover:no-underline"
          >
            {t('page.financas.featured.nobel')}
          </a>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-clube-teal-deep">
          {t('page.financas.published.title')}
        </h2>
        {conteudos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-clube-mist-soft p-10 text-center text-clube-mist">
            {t('page.financas.published.empty')}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {conteudos.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.caminho}/`}
                className="card-clube no-underline hover:no-underline"
              >
                <div className="text-xs uppercase tracking-wider text-clube-gold-deep">
                  {item.subcategoria}
                </div>
                <h3 className="mt-1 text-lg font-semibold leading-snug text-clube-teal-deep">
                  {item.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-clube-mist">
                  {item.descricao}
                </p>
                {item.usadoEm.length > 0 && (
                  <div className="mt-3 text-xs text-clube-mist/80">
                    {t('page.financas.published.usedIn')} {item.usadoEm.join(' · ')}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-clube-cream-soft p-6 text-sm text-clube-mist">
        <h3 className="text-base font-bold text-clube-teal-deep">
          {t('page.financas.prereq.title')}
        </h3>
        <p className="mt-2">
          {t('page.financas.prereq.text.before')}{' '}
          <Link
            href="/ensino-medio/ano-3/"
            className="font-semibold text-clube-teal"
          >
            {t('page.financas.prereq.text.linkText')}
          </Link>{' '}
          {t('page.financas.prereq.text.middle')}{' '}
          <em>{t('page.financas.prereq.text.derivative')}</em>,{' '}
          <em>{t('page.financas.prereq.text.integral')}</em>,{' '}
          <em>{t('page.financas.prereq.text.ln')}</em>,{' '}
          <em>{t('page.financas.prereq.text.normal')}</em>
          {t('page.financas.prereq.text.after')}{' '}
          <strong>{t('page.financas.prereq.text.boldNoPre')}</strong>
          {t('page.financas.prereq.text.tail')}
        </p>
      </section>
    </article>
  )
}
