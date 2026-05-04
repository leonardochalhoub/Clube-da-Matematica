'use client'

import { useLocale } from './LocaleProvider'

/**
 * Banner de patrocínio da Amazing School.
 * Pequeno, elegante; não compete com o conteúdo.
 * Usa identidade visual oficial do projeto Amazing School:
 *   - Emoji 🎓 (graduation cap) + smile complementar
 *   - Gradient violet→blue (paleta Amazing School)
 *   - URL oficial: https://amazing-school-app.vercel.app/
 */
export function AmazingSchoolSponsor() {
  const { t } = useLocale()
  return (
    <a
      href="https://amazing-school-app.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="group not-prose inline-flex items-center gap-2.5 rounded-full border border-violet-400/40 bg-gradient-to-r from-violet-500/10 to-blue-500/10 px-4 py-2 text-xs text-clube-ink/85 no-underline transition-all hover:-translate-y-0.5 hover:border-violet-500/70 hover:from-violet-500/20 hover:to-blue-500/20 hover:no-underline hover:shadow-sm"
      aria-label={t('sponsor.amazing.aria')}
    >
      <span className="text-base leading-none" aria-hidden>🎓</span>
      <SmileIcon />
      <span>
        <span className="text-clube-mist">{t('sponsor.amazing.support')}</span>{' '}
        <strong className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
          Amazing School
        </strong>{' '}
        <span className="text-clube-mist">{t('sponsor.amazing.tagline')}</span>
      </span>
      <span
        aria-hidden
        className="text-violet-500/70 transition-transform group-hover:translate-x-0.5"
      >
        →
      </span>
    </a>
  )
}

function SmileIcon() {
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
      className="text-violet-500"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  )
}
