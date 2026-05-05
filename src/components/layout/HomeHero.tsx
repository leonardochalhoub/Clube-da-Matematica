'use client'

import Link from 'next/link'
import { useLocale } from './LocaleProvider'
import { LOCALES, NUM_LOCALES } from '@/lib/i18n/locales'

interface AnoCard {
  num: number
  titulo: string
  idade: string
  equivalencia: string
  resumo: string
  total: number
  publicadas: number
}

interface HomeHeroProps {
  /** Ano cards rendered on the right column / below text on mobile. */
  anos: AnoCard[]
}

export function HomeHero({ anos }: HomeHeroProps) {
  const { t } = useLocale()
  const features = t('home.stats.features').replace('{n}', String(NUM_LOCALES))
  const bandeiras = Object.values(LOCALES)
    .map((l) => l.bandeira)
    .join(' ')
  const yearLabel = t('page.ensinoMedio.year.label', 'Ano')
  const publishedLabel = t(
    'page.ensinoMedio.year.lessonsPublished',
    'lições publicadas',
  )

  return (
    <section className="relative overflow-hidden border-b border-clube-mist-soft/30 bg-gradient-to-b from-clube-cream to-clube-cream-soft">
      <div className="container-clube py-14 sm:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-14">
          {/* LEFT — narrative */}
          <div className="md:max-w-xl">
            <p className="mb-4 inline-block rounded-full border border-clube-gold-deep/40 bg-clube-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
              {t('home.tagline')}
            </p>
            <h1 className="font-sans text-display font-extrabold leading-tight text-clube-teal-deep">
              {t('home.title.line1')}
              <br />
              <span className="text-clube-teal">{t('home.title.line2')}</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-clube-ink/80 sm:text-lg">
              <strong>{t('home.stats.years')}</strong>
              <br />
              <span className="text-sm sm:text-base">{features}</span>
              <br />
              <span className="text-xs opacity-80 sm:text-sm">{bandeiras}</span>
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/financas"
                className="inline-flex items-center gap-2 rounded-full border border-clube-mist-soft/60 bg-clube-surface px-4 py-2 text-sm font-semibold text-clube-ink transition-all hover:-translate-y-0.5 hover:border-clube-teal hover:text-clube-teal hover:no-underline"
              >
                {t('home.cta.bs')}
              </Link>
              <a
                href="https://leonardochalhoub.github.io/mirante-dos-dados-br/articles/calculo-ensino-medio-internacional.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-clube-gold-deep/50 bg-clube-gold/10 px-4 py-2 text-sm font-semibold text-clube-gold-deep transition-all hover:-translate-y-0.5 hover:bg-clube-gold/20 hover:no-underline"
                aria-label={t('home.cta.pdf')}
              >
                <PdfIcon />
                {t('home.cta.pdf')}
              </a>
            </div>
            <p className="mt-3 text-xs text-clube-mist">
              <Link href="/manifesto" className="hover:text-clube-teal">
                {t('nav.manifesto')} →
              </Link>
            </p>
          </div>

          {/* RIGHT — year cards (stack on mobile under the narrative) */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {anos.map((ano) => {
              const percent =
                ano.total === 0
                  ? 0
                  : Math.round((ano.publicadas / ano.total) * 100)
              return (
                <Link
                  key={ano.num}
                  href={`/ensino-medio/ano-${ano.num}/`}
                  className="group relative block rounded-2xl border-2 border-clube-mist-soft/40 bg-clube-surface p-4 no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:border-clube-teal hover:shadow-md hover:no-underline sm:p-5"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
                      {yearLabel} {ano.num} · {ano.idade}
                    </p>
                    <p className="shrink-0 text-xs tabular-nums text-clube-mist">
                      <span className="font-bold text-clube-leaf">
                        {ano.publicadas}
                      </span>
                      <span className="text-clube-mist/70"> / {ano.total}</span>
                      <span className="ml-1 text-[10px] text-clube-mist/60">
                        ({percent}%)
                      </span>
                    </p>
                  </div>
                  <h2 className="mt-1 text-base font-extrabold leading-tight text-clube-teal-deep group-hover:text-clube-teal sm:text-lg">
                    {ano.titulo}
                  </h2>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-clube-mist sm:text-[13px]">
                    {ano.resumo}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-[10px] italic text-clube-mist/80 sm:text-[11px]">
                      {ano.equivalencia}
                    </p>
                    <span
                      aria-hidden
                      className="shrink-0 text-xs font-semibold text-clube-teal opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
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
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 13h2a1.5 1.5 0 0 1 0 3H9zM9 17v-4" />
      <path d="M14 13v4M14 13h2.5" />
    </svg>
  )
}
