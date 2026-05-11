/**
 * Helpers to build full Next.js `Metadata` objects for lesson and section
 * pages — covering title, description, canonical, hreflang, Open Graph,
 * and Twitter Card.
 */
import type { Metadata } from 'next'
import { LOCALES, type Locale } from '@/lib/i18n/locales'
import {
  SITE_NAME_BY_LOCALE,
  SITE_DESCRIPTION_BY_LOCALE,
  TITLE_TEMPLATE_BY_LOCALE,
  OG_LOCALE_BY_LOCALE,
} from '@/lib/seo/site'
import {
  canonicalUrlFor,
  hreflangAlternatesFor,
  homeUrlFor,
  homeHreflangAlternates,
} from '@/lib/seo/urls'

export interface LessonMetaInput {
  caminho: string
  locale: Locale
  /** Localized title (already in target locale; usually from MDX frontmatter). */
  titulo: string
  /** Localized description (already in target locale). */
  descricao: string
}

/**
 * Build metadata for a lesson page (or any source-content page) in a
 * specific locale.
 */
export function buildLessonMetadata({
  caminho,
  locale,
  titulo,
  descricao,
}: LessonMetaInput): Metadata {
  const canonical = canonicalUrlFor(caminho, locale)
  const alternates = hreflangAlternatesFor(caminho)
  const siteName = SITE_NAME_BY_LOCALE[locale]
  const ogLocale = OG_LOCALE_BY_LOCALE[locale]

  return {
    title: titulo,
    description: descricao,
    alternates: {
      canonical,
      languages: alternates,
    },
    openGraph: {
      title: `${titulo} · ${siteName}`,
      description: descricao,
      url: canonical,
      siteName,
      type: 'article',
      locale: ogLocale,
      alternateLocale: Object.values(OG_LOCALE_BY_LOCALE).filter(
        (l) => l !== ogLocale,
      ),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${titulo} · ${siteName}`,
      description: descricao,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export interface SectionMetaInput {
  /** Path relative to base — e.g. "ensino-medio", "livros", "" for home. */
  path: string
  locale: Locale
  titulo: string
  descricao: string
}

/**
 * Build metadata for a static section page (manifesto, livros, mapa, etc.).
 * Same shape as a lesson but `type: 'website'`.
 */
export function buildSectionMetadata({
  path,
  locale,
  titulo,
  descricao,
}: SectionMetaInput): Metadata {
  const canonical = path === '' ? homeUrlFor(locale) : canonicalUrlFor(path, locale)
  // Static pages exist in every locale (UI is fully translated everywhere).
  const alternates: Record<string, string> = {}
  for (const code of Object.keys(LOCALES) as Locale[]) {
    const info = LOCALES[code]
    alternates[info.speechLang] =
      path === '' ? homeUrlFor(code) : canonicalUrlFor(path, code)
  }
  alternates['x-default'] = path === '' ? homeUrlFor('pt-BR') : canonicalUrlFor(path, 'pt-BR')

  const siteName = SITE_NAME_BY_LOCALE[locale]
  const ogLocale = OG_LOCALE_BY_LOCALE[locale]

  return {
    title: titulo,
    description: descricao,
    alternates: {
      canonical,
      languages: alternates,
    },
    openGraph: {
      title: `${titulo} · ${siteName}`,
      description: descricao,
      url: canonical,
      siteName,
      type: 'website',
      locale: ogLocale,
      alternateLocale: Object.values(OG_LOCALE_BY_LOCALE).filter(
        (l) => l !== ogLocale,
      ),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${titulo} · ${siteName}`,
      description: descricao,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

/** Convenience: home-page metadata. */
export function buildHomeMetadata(locale: Locale): Metadata {
  return buildSectionMetadata({
    path: '',
    locale,
    titulo: SITE_NAME_BY_LOCALE[locale],
    descricao: SITE_DESCRIPTION_BY_LOCALE[locale],
  })
}

export { homeHreflangAlternates, TITLE_TEMPLATE_BY_LOCALE }
