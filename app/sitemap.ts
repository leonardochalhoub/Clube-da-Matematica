import type { MetadataRoute } from 'next'
import { publicadosApenas } from '@/lib/content/loader'
import { LOCALES, type Locale } from '@/lib/i18n/locales'
import { caminhoArquivoMdx } from '@/lib/content/loader-i18n'
import { canonicalUrlFor } from '@/lib/seo/urls'
import { SITE_ORIGIN, BASE_PATH } from '@/lib/seo/site'

// Required for `output: 'export'`
export const dynamic = 'force-static'

/**
 * Sitemap with one entry per (caminho, locale) pair where a real
 * translation exists. PT-BR is the source — always emitted. Other locales
 * are emitted only if the MDX file exists on disk (no fallback entries —
 * those would create duplicate-content noise for crawlers).
 *
 * Includes static section pages in all locales (since UI is fully
 * translated, those work in every language).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // --- Home + static section pages, per locale -----------------------
  const STATIC_PATHS: Array<{ path: string; priority: number }> = [
    { path: '', priority: 1.0 }, // home
    { path: 'manifesto', priority: 0.7 },
    { path: 'ensino-medio', priority: 0.9 },
    { path: 'financas', priority: 0.8 },
    { path: 'livros', priority: 0.7 },
    { path: 'provas', priority: 0.8 },
    { path: 'videos', priority: 0.5 },
    { path: 'mapa', priority: 0.6 },
  ]

  const locales = Object.keys(LOCALES) as Locale[]

  // Home + static section pages live at ROOT (/, /financas, …) and translate
  // client-side — they are NOT per-locale routes, so emit each once (no locale
  // prefix). Only lesson URLs are per-locale (handled below).
  const prefix = BASE_PATH ? `${BASE_PATH}/` : '/'
  for (const { path, priority } of STATIC_PATHS) {
    entries.push({
      url: path === '' ? `${SITE_ORIGIN}${BASE_PATH || ''}/` : `${SITE_ORIGIN}${prefix}${path}/`,
      lastModified: new Date('2026-05-11'),
      changeFrequency: 'monthly',
      priority,
    })
  }

  // --- Lessons + other content (filesystem-driven) -------------------
  const todas = publicadosApenas()
  for (const c of todas) {
    const lastMod = c.meta.atualizadoEm ? new Date(c.meta.atualizadoEm) : undefined

    // PT-BR — always emitted (source).
    entries.push({
      url: canonicalUrlFor(c.caminho, 'pt-BR'),
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.8,
    })

    // Translated locales — only if MDX file exists on disk.
    for (const loc of locales) {
      if (loc === 'pt-BR') continue
      const info = LOCALES[loc]
      const file = caminhoArquivoMdx(c.caminho, loc, info.speechLang)
      if (!file) continue
      entries.push({
        url: canonicalUrlFor(c.caminho, loc),
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }

  return entries
}
