import type { MetadataRoute } from 'next'
import { publicadosApenas } from '@/lib/content/loader'
import { canonicalUrlFor } from '@/lib/seo/urls'
import { SITE_ORIGIN, BASE_PATH } from '@/lib/seo/site'

// Required for `output: 'export'`
export const dynamic = 'force-static'

/**
 * Sitemap. PT-BR only (2026-08-06 pivot — see CLAUDE.md §4): the frontend no
 * longer routes translated locales, so emitting their URLs here would just
 * point crawlers at 404s. Static section pages live at root (not per-locale).
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

  // Home + static section pages live at ROOT (/, /financas, …) — emit once.
  const prefix = BASE_PATH ? `${BASE_PATH}/` : '/'
  for (const { path, priority } of STATIC_PATHS) {
    entries.push({
      url: path === '' ? `${SITE_ORIGIN}${BASE_PATH || ''}/` : `${SITE_ORIGIN}${prefix}${path}/`,
      lastModified: new Date('2026-05-11'),
      changeFrequency: 'monthly',
      priority,
    })
  }

  // --- Lessons (filesystem-driven, PT-BR only) ------------------------
  const todas = publicadosApenas()
  for (const c of todas) {
    const lastMod = c.meta.atualizadoEm ? new Date(c.meta.atualizadoEm) : undefined
    entries.push({
      url: canonicalUrlFor(c.caminho, 'pt-BR'),
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  return entries
}
