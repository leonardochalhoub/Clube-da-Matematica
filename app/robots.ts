import type { MetadataRoute } from 'next'
import { SITE_ORIGIN, BASE_PATH } from '@/lib/seo/site'

// Required for `output: 'export'`
export const dynamic = 'force-static'

/**
 * robots.txt — fully open. Educational OSS content, no private routes.
 * Points crawlers at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${SITE_ORIGIN}${BASE_PATH}/sitemap.xml`,
    host: SITE_ORIGIN,
  }
}
