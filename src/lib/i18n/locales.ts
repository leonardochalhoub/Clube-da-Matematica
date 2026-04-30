/**
 * Sistema de internacionalização do Clube da Matemática.
 *
 * Estratégia:
 *  - 16 idiomas suportados (mais importantes do mundo + estratégicos)
 *  - Detecção automática por navigator.language no client
 *  - Fallback para inglês se idioma não suportado
 *  - Auto-mudança de voz no AudioReader pra o idioma selecionado
 *
 * Bandeiras: emoji oficial unicode (U+1F1xx). Funciona em todos os SOs.
 */

export type Locale =
  | 'pt-BR' // português (Brasil) — default
  | 'en'    // inglês — fallback universal
  | 'es'    // espanhol
  | 'zh'    // chinês mandarim
  | 'ja'    // japonês
  | 'de'    // alemão
  | 'fr'    // francês
  | 'it'    // italiano
  | 'ru'    // russo
  | 'ko'    // coreano
  | 'pl'    // polonês
  | 'ar'    // árabe (libanês — bandeira do Líbano com o cedro)
  | 'he'    // hebraico (Israel — usa MP3 pré-renderizados, não Web Speech)
  | 'hi'    // hindi (Índia)

export interface LocaleInfo {
  code: Locale
  /** Nome no próprio idioma. */
  nome: string
  /** Bandeira oficial em emoji unicode. */
  bandeira: string
  /** Código BCP-47 para Web Speech API (lang attribute). */
  speechLang: string
  /** Direção de leitura. */
  dir: 'ltr' | 'rtl'
}

export const LOCALES: Record<Locale, LocaleInfo> = {
  'pt-BR': { code: 'pt-BR', nome: 'Português (Brasil)', bandeira: '🇧🇷', speechLang: 'pt-BR', dir: 'ltr' },
  en:      { code: 'en',    nome: 'English',             bandeira: '🇺🇸', speechLang: 'en-US', dir: 'ltr' },
  es:      { code: 'es',    nome: 'Español',             bandeira: '🇪🇸', speechLang: 'es-ES', dir: 'ltr' },
  zh:      { code: 'zh',    nome: '中文',                  bandeira: '🇨🇳', speechLang: 'zh-CN', dir: 'ltr' },
  ja:      { code: 'ja',    nome: '日本語',                 bandeira: '🇯🇵', speechLang: 'ja-JP', dir: 'ltr' },
  de:      { code: 'de',    nome: 'Deutsch',             bandeira: '🇩🇪', speechLang: 'de-DE', dir: 'ltr' },
  fr:      { code: 'fr',    nome: 'Français',            bandeira: '🇫🇷', speechLang: 'fr-FR', dir: 'ltr' },
  it:      { code: 'it',    nome: 'Italiano',            bandeira: '🇮🇹', speechLang: 'it-IT', dir: 'ltr' },
  ru:      { code: 'ru',    nome: 'Русский',             bandeira: '🇷🇺', speechLang: 'ru-RU', dir: 'ltr' },
  ko:      { code: 'ko',    nome: '한국어',                 bandeira: '🇰🇷', speechLang: 'ko-KR', dir: 'ltr' },
  pl:      { code: 'pl',    nome: 'Polski',              bandeira: '🇵🇱', speechLang: 'pl-PL', dir: 'ltr' },
  ar:      { code: 'ar',    nome: 'العربية اللبنانية',     bandeira: '🇱🇧', speechLang: 'ar-LB', dir: 'rtl' },
  he:      { code: 'he',    nome: 'עברית',                bandeira: '🇮🇱', speechLang: 'he-IL', dir: 'rtl' },
  hi:      { code: 'hi',    nome: 'हिन्दी',                  bandeira: '🇮🇳', speechLang: 'hi-IN', dir: 'ltr' },
}

export const DEFAULT_LOCALE: Locale = 'en'

/**
 * Mapeia país (ISO 3166-1 alpha-2) para idioma local padrão.
 * Usado pra auto-seleção quando o navegador permite geolocalização.
 */
const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  BR: 'pt-BR', PT: 'pt-BR', AO: 'pt-BR', MZ: 'pt-BR',
  US: 'en', GB: 'en', AU: 'en', CA: 'en', NZ: 'en', IE: 'en', IN: 'en',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es',
  CN: 'zh', TW: 'zh', HK: 'zh', SG: 'zh',
  JP: 'ja',
  DE: 'de', AT: 'de', CH: 'de',
  FR: 'fr', BE: 'fr', LU: 'fr',
  IT: 'it', SM: 'it', VA: 'it',
  RU: 'ru', BY: 'ru',
  KR: 'ko', KP: 'ko',
  PL: 'pl',
  LB: 'ar', SY: 'ar', JO: 'ar', PS: 'ar', SA: 'ar', AE: 'ar', EG: 'ar', QA: 'ar', KW: 'ar',
  IL: 'he',
}

/**
 * Detecta locale baseado em (em ordem):
 *  1. localStorage 'locale' (preferência manual prévia)
 *  2. navigator.language do browser
 *  3. fallback inglês
 */
export function detectLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

  // 1. Preferência salva
  try {
    const saved = localStorage.getItem('clube-locale') as Locale | null
    if (saved && saved in LOCALES) return saved
  } catch {
    /* localStorage indisponível */
  }

  // 2. Browser language
  const browser = navigator.language || (navigator as { userLanguage?: string }).userLanguage
  if (browser) {
    // Match exato (pt-BR)
    if (browser in LOCALES) return browser as Locale
    // Match por prefixo (pt → pt-BR; pt-PT → pt-BR; en-GB → en)
    const prefix = browser.split('-')[0]
    if (prefix === 'pt') return 'pt-BR'
    if (prefix && prefix in LOCALES) return prefix as Locale
  }

  // 3. Fallback
  return DEFAULT_LOCALE
}

/** Salva a preferência. */
export function saveLocale(loc: Locale): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('clube-locale', loc)
    document.documentElement.lang = LOCALES[loc].speechLang
    document.documentElement.dir = LOCALES[loc].dir
  } catch {
    /* indisponível */
  }
}
