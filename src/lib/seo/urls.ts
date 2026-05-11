/**
 * URL builders for canonical + hreflang.
 *
 * Routing model (recap):
 *   PT-BR (source/canonical):  https://host/<base>/<caminho>/
 *   Translated locale prefix:  https://host/<base>/<locale>/<caminho>/
 *
 * `caminho` is the source-relative path like `aulas/ano-1/trim-1/licao-01-conjuntos-intervalos`.
 *
 * `hreflang` must point to locales where a real translation file exists on
 * disk. Emitting hreflang for a locale that falls back to PT-BR would tell
 * Google "this URL has a German translation" when in fact `/de/...` ships
 * PT-BR content — duplicate-content penalty. We check the filesystem.
 */
import { LOCALES, type Locale } from '@/lib/i18n/locales'
import { caminhoArquivoMdx } from '@/lib/content/loader-i18n'
import { SITE_ORIGIN, BASE_PATH } from '@/lib/seo/site'

/**
 * Full absolute URL for a (caminho, locale) pair. Always ends with a slash
 * because `trailingSlash: true` in next.config.
 */
export function canonicalUrlFor(caminho: string, locale: Locale): string {
  const path = locale === 'pt-BR' ? caminho : `${locale}/${caminho}`
  const prefix = BASE_PATH ? `${BASE_PATH}/` : '/'
  return `${SITE_ORIGIN}${prefix}${path}/`
}

/** Site root URL for a locale ("/en/", "/", etc). Trailing-slash safe. */
export function homeUrlFor(locale: Locale): string {
  if (locale === 'pt-BR') {
    return `${SITE_ORIGIN}${BASE_PATH || ''}/`
  }
  const prefix = BASE_PATH ? `${BASE_PATH}/` : '/'
  return `${SITE_ORIGIN}${prefix}${locale}/`
}

/**
 * For a given source caminho, return the list of locales where the
 * translation actually exists on disk (PT-BR always included).
 */
export function localesAvailableFor(caminho: string): Locale[] {
  const out: Locale[] = ['pt-BR']
  for (const code of Object.keys(LOCALES) as Locale[]) {
    if (code === 'pt-BR') continue
    const info = LOCALES[code]
    const file = caminhoArquivoMdx(caminho, code, info.speechLang)
    if (file) out.push(code)
  }
  return out
}

/**
 * hreflang alternates dict suitable for `metadata.alternates.languages`.
 * Keys are BCP-47 codes (`pt-BR`, `en-US`, `es-ES`, ...); values are full
 * URLs. Includes `x-default` → PT-BR canonical.
 */
export function hreflangAlternatesFor(caminho: string): Record<string, string> {
  const result: Record<string, string> = {}
  const locales = localesAvailableFor(caminho)
  for (const code of locales) {
    const info = LOCALES[code]
    result[info.speechLang] = canonicalUrlFor(caminho, code)
  }
  // x-default: send unspecified-language users to PT-BR (the source).
  result['x-default'] = canonicalUrlFor(caminho, 'pt-BR')
  return result
}

/** hreflang alternates for the SITE HOME (not a lesson). All locales eligible. */
export function homeHreflangAlternates(): Record<string, string> {
  const result: Record<string, string> = {}
  for (const code of Object.keys(LOCALES) as Locale[]) {
    const info = LOCALES[code]
    result[info.speechLang] = homeUrlFor(code)
  }
  result['x-default'] = homeUrlFor('pt-BR')
  return result
}
