/**
 * Sistema de internacionalização do Clube da Matemática.
 *
 * Estratégia:
 *  - Apenas idiomas com voz TTS instalada por padrão na maioria dos OSes
 *    (Windows/Mac/Linux Chrome). Idiomas que exigiriam instalação manual
 *    da voz (Hebrew, Arabic, Hindi) foram removidos pra evitar UX ruim.
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

export interface LocaleInfo {
  code: Locale
  /**
   * URL path segment for this locale. Equals `code` for every locale EXCEPT
   * pt-BR, whose internal key is `pt-BR` (BCP-47-ish, used as manifest key)
   * but whose URL segment is the lowercase `pt-br` — consistent with the other
   * short codes (en, es, …). Use `localeToUrl()`/`urlToLocale()` at the URL
   * boundary; never build URLs from `code` directly.
   */
  urlCode: string
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
  'pt-BR': { code: 'pt-BR', urlCode: 'pt-br', nome: 'Português (Brasil)', bandeira: '🇧🇷', speechLang: 'pt-BR', dir: 'ltr' },
  en:      { code: 'en',    urlCode: 'en',    nome: 'English',             bandeira: '🇺🇸', speechLang: 'en-US', dir: 'ltr' },
  es:      { code: 'es',    urlCode: 'es',    nome: 'Español',             bandeira: '🇪🇸', speechLang: 'es-ES', dir: 'ltr' },
  zh:      { code: 'zh',    urlCode: 'zh',    nome: '中文',                  bandeira: '🇨🇳', speechLang: 'zh-CN', dir: 'ltr' },
  ja:      { code: 'ja',    urlCode: 'ja',    nome: '日本語',                 bandeira: '🇯🇵', speechLang: 'ja-JP', dir: 'ltr' },
  de:      { code: 'de',    urlCode: 'de',    nome: 'Deutsch',             bandeira: '🇩🇪', speechLang: 'de-DE', dir: 'ltr' },
  fr:      { code: 'fr',    urlCode: 'fr',    nome: 'Français',            bandeira: '🇫🇷', speechLang: 'fr-FR', dir: 'ltr' },
  it:      { code: 'it',    urlCode: 'it',    nome: 'Italiano',            bandeira: '🇮🇹', speechLang: 'it-IT', dir: 'ltr' },
  ru:      { code: 'ru',    urlCode: 'ru',    nome: 'Русский',             bandeira: '🇷🇺', speechLang: 'ru-RU', dir: 'ltr' },
  ko:      { code: 'ko',    urlCode: 'ko',    nome: '한국어',                 bandeira: '🇰🇷', speechLang: 'ko-KR', dir: 'ltr' },
  pl:      { code: 'pl',    urlCode: 'pl',    nome: 'Polski',              bandeira: '🇵🇱', speechLang: 'pl-PL', dir: 'ltr' },
}

/** URL segment for a locale (`pt-BR` → `pt-br`, `en` → `en`). */
export function localeToUrl(locale: Locale): string {
  return LOCALES[locale].urlCode
}

/** Build once: reverse map urlCode → Locale. */
const URL_TO_LOCALE: Record<string, Locale> = Object.fromEntries(
  (Object.keys(LOCALES) as Locale[]).map((l) => [LOCALES[l].urlCode, l]),
)

/** Resolve a URL segment back to a Locale (`pt-br` → `pt-BR`). null if unknown. */
export function urlToLocale(segment: string): Locale | null {
  return URL_TO_LOCALE[segment] ?? null
}

/** All URL segments (for stripping/detecting locale prefixes). */
export const LOCALE_URL_CODES: string[] = (Object.keys(LOCALES) as Locale[]).map(
  (l) => LOCALES[l].urlCode,
)

/**
 * Total de idiomas suportados — derivado de LOCALES pra evitar
 * desync com strings hardcoded em UI. Use sempre essa constante.
 */
export const NUM_LOCALES = Object.keys(LOCALES).length

/**
 * Last-resort fallback when `detectLocale()` can't infer the user's
 * locale from localStorage / timezone / navigator.language. English is
 * the widest-reach default. The site is meant to be DYNAMIC: a visitor
 * in Brazil should auto-resolve to pt-BR via timezone detection; this
 * constant only kicks in when every signal fails (no JS, missing Intl
 * support, unknown timezone + unknown browser language).
 */
export const DEFAULT_LOCALE: Locale = 'en'

/**
 * Mapeia país (ISO 3166-1 alpha-2) para idioma local padrão.
 * Usado pra auto-seleção via timezone (Intl.DateTimeFormat) — offline,
 * instantâneo, sem permissões.
 */
export const COUNTRY_TO_LOCALE: Record<string, Locale> = {
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
}

/**
 * Mapa **timezone IANA → código país**. Usado para inferir país do usuário
 * via `Intl.DateTimeFormat().resolvedOptions().timeZone`, o que dá detecção
 * geográfica offline (zero rede, zero permissão de browser, instantâneo).
 *
 * Cobertura: principais zonas dos países onde os locales suportados são
 * dominantes. Para timezones não listadas, cai no fallback (browser lang).
 */
const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  // Brasil — todas as zonas
  'America/Sao_Paulo': 'BR', 'America/Bahia': 'BR', 'America/Belem': 'BR',
  'America/Fortaleza': 'BR', 'America/Maceio': 'BR', 'America/Recife': 'BR',
  'America/Araguaina': 'BR', 'America/Manaus': 'BR', 'America/Cuiaba': 'BR',
  'America/Campo_Grande': 'BR', 'America/Porto_Velho': 'BR',
  'America/Boa_Vista': 'BR', 'America/Rio_Branco': 'BR', 'America/Eirunepe': 'BR',
  'America/Noronha': 'BR', 'America/Santarem': 'BR',
  // Portugal e países africanos lusófonos
  'Europe/Lisbon': 'PT', 'Atlantic/Madeira': 'PT', 'Atlantic/Azores': 'PT',
  'Africa/Luanda': 'AO', 'Africa/Maputo': 'MZ',
  // EUA
  'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US',
  'America/Los_Angeles': 'US', 'America/Phoenix': 'US', 'America/Anchorage': 'US',
  'Pacific/Honolulu': 'US', 'America/Detroit': 'US', 'America/Indianapolis': 'US',
  // Reino Unido / Irlanda / Australia / Nova Zelândia / Canadá / Índia
  'Europe/London': 'GB', 'Europe/Dublin': 'IE',
  'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Brisbane': 'AU',
  'Australia/Perth': 'AU', 'Australia/Adelaide': 'AU',
  'Pacific/Auckland': 'NZ',
  'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA',
  'America/Halifax': 'CA', 'America/St_Johns': 'CA',
  'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN',
  // Países hispanofalantes
  'Europe/Madrid': 'ES', 'Atlantic/Canary': 'ES',
  'America/Mexico_City': 'MX', 'America/Tijuana': 'MX', 'America/Monterrey': 'MX',
  'America/Argentina/Buenos_Aires': 'AR', 'America/Argentina/Cordoba': 'AR',
  'America/Bogota': 'CO', 'America/Santiago': 'CL', 'America/Lima': 'PE',
  'America/Caracas': 'VE',
  // China + variantes
  'Asia/Shanghai': 'CN', 'Asia/Beijing': 'CN', 'Asia/Chongqing': 'CN',
  'Asia/Urumqi': 'CN', 'Asia/Harbin': 'CN',
  'Asia/Taipei': 'TW', 'Asia/Hong_Kong': 'HK', 'Asia/Singapore': 'SG',
  // Japão / Coreia
  'Asia/Tokyo': 'JP', 'Asia/Seoul': 'KR', 'Asia/Pyongyang': 'KP',
  // Alemanha / Áustria / Suíça
  'Europe/Berlin': 'DE', 'Europe/Vienna': 'AT', 'Europe/Zurich': 'CH',
  // França / Bélgica / Luxemburgo
  'Europe/Paris': 'FR', 'Europe/Brussels': 'BE', 'Europe/Luxembourg': 'LU',
  // Itália
  'Europe/Rome': 'IT', 'Europe/Vatican': 'VA', 'Europe/San_Marino': 'SM',
  // Rússia
  'Europe/Moscow': 'RU', 'Europe/Kaliningrad': 'RU',
  'Asia/Yekaterinburg': 'RU', 'Asia/Novosibirsk': 'RU', 'Asia/Krasnoyarsk': 'RU',
  'Asia/Irkutsk': 'RU', 'Asia/Yakutsk': 'RU', 'Asia/Vladivostok': 'RU',
  'Europe/Minsk': 'BY',
  // Polônia
  'Europe/Warsaw': 'PL',
}

/**
 * Tenta inferir o locale via timezone do browser. Retorna `null` se a
 * timezone não bater com nenhum país conhecido (quem está em zona não
 * mapeada, cai no fallback de `navigator.language`).
 */
function localeFromTimezone(): Locale | null {
  if (typeof Intl === 'undefined') return null
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!tz) return null
    const country = TIMEZONE_TO_COUNTRY[tz]
    if (country && country in COUNTRY_TO_LOCALE) return COUNTRY_TO_LOCALE[country]!
    return null
  } catch {
    return null
  }
}

/**
 * Detecta locale baseado em (em ordem de prioridade):
 *  1. localStorage 'clube-locale' — preferência manual prévia.
 *  2. **Timezone do browser** (`Intl.DateTimeFormat`) → país → locale —
 *     detecção geográfica offline, sem permissões. Usuário em São Paulo
 *     vai pra pt-BR; em Madrid vai pra es; em Tóquio vai pra ja.
 *  3. `navigator.language` do browser — fallback se timezone não mapeada.
 *  4. Inglês — último recurso.
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

  // 2. Timezone → país → locale (geo-aware, offline)
  const tzLocale = localeFromTimezone()
  if (tzLocale) return tzLocale

  // 3. Browser language
  const browser = navigator.language || (navigator as { userLanguage?: string }).userLanguage
  if (browser) {
    if (browser in LOCALES) return browser as Locale
    const prefix = browser.split('-')[0]
    if (prefix === 'pt') return 'pt-BR'
    if (prefix && prefix in LOCALES) return prefix as Locale
  }

  // 4. Fallback
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
