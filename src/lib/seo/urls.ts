/**
 * URL builders for canonical + hreflang.
 *
 * PT-BR only (2026-08-06 pivot — see CLAUDE.md §4): the frontend serves a
 * single locale, so hreflang collapses to a self-referencing pt-BR entry +
 * x-default. `localesAvailableFor` used to scan content/i18n/ on disk for
 * other locales' MDX files; those files still exist but aren't routed
 * anymore, so it now always returns just pt-BR.
 *
 * `caminho` is the source-relative path like `aulas/ano-1/trim-1/licao-01-conjuntos-intervalos`.
 */
import { localeToUrl, type Locale } from '@/lib/i18n/locales'
import { SITE_ORIGIN, BASE_PATH } from '@/lib/seo/site'

/**
 * Full absolute URL for a (caminho, locale) pair. Always ends with a slash
 * because `trailingSlash: true` in next.config. Every locale (pt-BR included)
 * is prefixed with its URL segment (`pt-br/aulas/…`, `en/aulas/…`).
 */
export function canonicalUrlFor(caminho: string, locale: Locale): string {
  const path = `${localeToUrl(locale)}/${caminho}`
  const prefix = BASE_PATH ? `${BASE_PATH}/` : '/'
  return `${SITE_ORIGIN}${prefix}${path}/`
}

/**
 * Site root URL for a locale. The HOMEPAGE stays at root `/` for every locale
 * (it lives at `app/page.tsx` and translates client-side — it is NOT a
 * per-locale route). Only lesson URLs move under `/<urlCode>/` (see
 * `canonicalUrlFor`). So home is always the site root. Trailing-slash safe.
 */
export function homeUrlFor(_locale: Locale): string {
  return `${SITE_ORIGIN}${BASE_PATH || ''}/`
}

/** PT-BR only — kept as a function so call sites don't need to change. */
export function localesAvailableFor(_caminho: string): Locale[] {
  return ['pt-BR']
}

/** hreflang alternates dict suitable for `metadata.alternates.languages`. */
export function hreflangAlternatesFor(caminho: string): Record<string, string> {
  const url = canonicalUrlFor(caminho, 'pt-BR')
  return { 'pt-BR': url, 'x-default': url }
}

/** hreflang alternates for the SITE HOME (not a lesson). */
export function homeHreflangAlternates(): Record<string, string> {
  const url = homeUrlFor('pt-BR')
  return { 'pt-BR': url, 'x-default': url }
}
