'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  detectLocale,
  saveLocale,
  LOCALES,
  type Locale,
  DEFAULT_LOCALE,
} from '@/lib/i18n/locales'
import { translate } from '@/lib/i18n/translations'

interface LocaleContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  /** `t(chave, fallback)` — traduz chave pra locale ativo. */
  t: (key: string, defaultText?: string) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  // SSR sempre usa DEFAULT_LOCALE; client troca após hidratação se preferência detectada
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const detected = detectLocale()
    if (detected !== locale) setLocaleState(detected)
    // Aplica RTL/LTR. **Não** mexe em `<html lang>` — esse atributo deve
    // refletir a língua do CONTEÚDO (pt-BR enquanto não houver traduções
    // de MDX), não a UI. Caso contrário o leitor de tela / Web Speech API
    // tenta voz errada sobre texto PT-BR (= "PT com sotaque inglês").
    try {
      const info = LOCALES[detected]
      document.documentElement.dir = info.dir
    } catch {
      /* noop */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    saveLocale(l)
  }, [])

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
