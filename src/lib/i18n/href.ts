/**
 * Build a lesson/content URL prefixed with the active locale.
 *
 * ALL locales (pt-BR included) live at `/${urlCode}/${caminho}/` and are served
 * by `app/[locale]/[categoria]/[...caminho]/page.tsx`. pt-BR's URL segment is
 * `pt-br` (its source MDX still lives in `content/`, not `content/i18n`).
 *
 * Pass the bare caminho ("aulas/ano-1/trim-1/licao-01-..."), not a
 * leading slash. Returns the full pathname with trailing slash.
 */
import { localeToUrl, type Locale } from './locales'

export function localizedHref(caminho: string, locale: Locale): string {
  const rel = caminho.replace(/^\/+/, '')
  return `/${localeToUrl(locale)}/${rel}/`
}
