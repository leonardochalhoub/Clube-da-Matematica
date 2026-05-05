/**
 * Build a lesson/content URL prefixed with the active locale.
 *
 * pt-BR is the source — its routes live at `/${caminho}/`.
 * All other locales live at `/${locale}/${caminho}/` and are served by
 * `app/[locale]/[categoria]/[...caminho]/page.tsx`, which falls back to
 * pt-BR MDX when a translation is missing.
 *
 * Pass the bare caminho ("aulas/ano-1/trim-1/licao-01-..."), not a
 * leading slash. Returns the full pathname with trailing slash.
 */
import type { Locale } from './locales'

export function localizedHref(caminho: string, locale: Locale): string {
  const rel = caminho.replace(/^\/+/, '')
  if (locale === 'pt-BR') return `/${rel}/`
  return `/${locale}/${rel}/`
}
