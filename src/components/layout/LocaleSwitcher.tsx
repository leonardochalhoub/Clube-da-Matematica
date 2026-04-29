'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from './LocaleProvider'
import { LOCALES, type Locale } from '@/lib/i18n/locales'
import { Flag } from './Flag'

/**
 * Botão de idioma com dropdown. Mostra bandeira + nome no idioma.
 * Funciona acoplado ao ThemeToggle no header.
 */
export function LocaleSwitcher() {
  const { locale, setLocale, t } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [])

  const current = LOCALES[locale]
  const allLocales = Object.values(LOCALES)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('locale.label', 'Idioma') + ': ' + current.nome}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex h-10 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-clube-ink/80 hover:bg-clube-cream-soft hover:text-clube-teal"
      >
        <Flag emoji={current.bandeira} size={20} />
        <span className="hidden sm:inline text-xs font-mono uppercase tracking-wider">
          {current.code}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          aria-hidden
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t('locale.label', 'Idioma')}
          className="absolute right-0 top-full z-50 mt-2 max-h-[60vh] w-56 overflow-y-auto rounded-xl border border-clube-mist-soft/60 bg-clube-surface p-1 shadow-lg"
        >
          {allLocales.map((info) => {
            const ativo = info.code === locale
            return (
              <button
                key={info.code}
                role="option"
                aria-selected={ativo}
                type="button"
                onClick={() => {
                  setLocale(info.code as Locale)
                  setOpen(false)
                }}
                className={
                  'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors ' +
                  (ativo
                    ? 'bg-clube-teal/10 text-clube-teal-deep font-semibold'
                    : 'text-clube-ink/85 hover:bg-clube-cream-soft hover:text-clube-teal')
                }
              >
                <Flag emoji={info.bandeira} size={22} />
                <span className="flex-1 truncate">{info.nome}</span>
                {ativo && (
                  <span aria-hidden className="text-clube-teal">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
