'use client'

import { createContext, useCallback, useContext, type ReactNode } from 'react'
import { type Locale, DEFAULT_LOCALE } from '@/lib/i18n/locales'
import { translate } from '@/lib/i18n/translations'

interface LocaleContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  /** `t(chave, fallback)` — traduz chave pra locale ativo. */
  t: (key: string, defaultText?: string) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

/**
 * Frontend is PT-BR only (2026-08-06 pivot — see CLAUDE.md §4). No more
 * URL-prefix / timezone / browser-language auto-detection, no language
 * switcher — `locale` is always DEFAULT_LOCALE ('pt-BR'). `setLocale` is
 * kept as a no-op only so the context shape doesn't ripple through every
 * `useLocale()` call site; nothing calls it anymore.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = DEFAULT_LOCALE
  const setLocale = useCallback(() => {}, [])
  const t = useCallback(
    (key: string, defaultText?: string) => translate(key, locale, defaultText),
    [locale],
  )

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    // Fallback gracioso se o componente é usado fora do provider
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: (key, defaultText) => translate(key, DEFAULT_LOCALE, defaultText),
    }
  }
  return ctx
}
