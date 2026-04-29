'use client'

import Link from 'next/link'
import { useLocale } from './LocaleProvider'

export function HomeHero() {
  const { t } = useLocale()
  return (
    <section className="relative overflow-hidden border-b border-clube-mist-soft/30 bg-gradient-to-b from-clube-cream to-clube-cream-soft">
      <div className="container-clube py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="mb-4 inline-block rounded-full border border-clube-gold-deep/40 bg-clube-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
            {t('home.tagline')}
          </p>
          <h1 className="font-sans text-display font-extrabold text-clube-teal-deep">
            {t('home.title.line1')}
            <br />
            <span className="text-clube-teal">{t('home.title.line2')}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-clube-ink/80 sm:text-xl">
            <strong>3 · 12 · 120</strong> · 16 🌍 · 6 🚪 · 🔊 ·{' '}
            <strong>40-80</strong> · 🇺🇸🇪🇸🇨🇳🇯🇵🇩🇪🇫🇷🇮🇹🇷🇺🇰🇷🇻🇳🇵🇱🇰🇪🇸🇦🇮🇳🇪🇪
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/ensino-medio"
              className="inline-flex items-center gap-2 rounded-full bg-clube-teal px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-clube-teal-deep hover:no-underline hover:shadow"
            >
              {t('home.cta.start')}
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/financas"
              className="inline-flex items-center gap-2 rounded-full border border-clube-mist-soft/60 bg-clube-surface px-5 py-2.5 font-semibold text-clube-ink transition-all hover:-translate-y-0.5 hover:border-clube-teal hover:text-clube-teal hover:no-underline"
            >
              {t('home.cta.bs')}
            </Link>
            <a
              href="https://leonardochalhoub.github.io/mirante-dos-dados-br/articles/calculo-ensino-medio-internacional.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-clube-gold-deep/50 bg-clube-gold/10 px-5 py-2.5 font-semibold text-clube-gold-deep transition-all hover:-translate-y-0.5 hover:bg-clube-gold/20 hover:no-underline"
              aria-label={t('home.cta.pdf')}
            >
              <PdfIcon />
              {t('home.cta.pdf')}
            </a>
          </div>
          <p className="mt-4 text-xs text-clube-mist">
            <Link href="/manifesto" className="hover:text-clube-teal">
              {t('nav.manifesto')} →
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

function PdfIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 13h2a1.5 1.5 0 0 1 0 3H9zM9 17v-4" />
      <path d="M14 13v4M14 13h2.5" />
    </svg>
  )
}
