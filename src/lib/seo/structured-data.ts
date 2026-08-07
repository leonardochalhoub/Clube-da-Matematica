/**
 * JSON-LD structured data builders. Each function returns a plain JS object
 * meant to be serialized via `<script type="application/ld+json">{JSON.stringify(...)}</script>`.
 *
 * Schema choices for an educational OSS curriculum:
 *  - `Course` per lesson — eligible for Google "Courses" rich result carousel
 *  - `BreadcrumbList` per lesson — gets breadcrumb chip under search result
 *  - `EducationalOrganization` on home — establishes site identity
 *  - `Article` is NOT used (Course supersedes it for educational content)
 */
import { LOCALES, type Locale } from '@/lib/i18n/locales'
import { SITE_NAME_BY_LOCALE, SITE_ORIGIN, BASE_PATH } from '@/lib/seo/site'
import { canonicalUrlFor, homeUrlFor, localesAvailableFor } from '@/lib/seo/urls'

const SITE_LOGO = `${SITE_ORIGIN}${BASE_PATH || ''}/favicon.svg`
const GITHUB_REPO = 'https://github.com/leonardochalhoub/Clube-da-Matematica'

export interface CourseSchemaInput {
  caminho: string
  locale: Locale
  titulo: string
  descricao: string
  /** Frontmatter tags — become `Course.teaches`. */
  tags?: string[]
  /** Frontmatter prerrequisitos — slugs, become `Course.coursePrerequisites`. */
  prerrequisitos?: string[]
  /** Whether this is an "aulas" lesson (Ensino Médio) or another category. */
  isAula?: boolean
}

/** Course schema for a lesson page. */
export function buildCourseSchema({
  caminho,
  locale,
  titulo,
  descricao,
  tags = [],
  prerrequisitos = [],
  isAula = false,
}: CourseSchemaInput): Record<string, unknown> {
  const url = canonicalUrlFor(caminho, locale)
  const info = LOCALES[locale]
  const siteName = SITE_NAME_BY_LOCALE[locale]
  const availableLocales = localesAvailableFor(caminho)

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: titulo,
    description: descricao,
    url,
    inLanguage: info.speechLang,
    availableLanguage: availableLocales.map((l) => LOCALES[l].speechLang),
    teaches: tags,
    educationalLevel: isAula ? 'HighSchool' : 'HigherEducation',
    learningResourceType: 'Lesson',
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    coursePrerequisites:
      prerrequisitos.length > 0
        ? prerrequisitos.map((slug) => ({
            '@type': 'Course',
            name: slug,
          }))
        : undefined,
    provider: {
      '@type': 'EducationalOrganization',
      name: siteName,
      url: homeUrlFor(locale),
      sameAs: [GITHUB_REPO],
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      inLanguage: info.speechLang,
      isAccessibleForFree: true,
    },
  }
}

export interface BreadcrumbItem {
  name: string
  url: string
}

/** BreadcrumbList from an ordered array of crumbs (home → ... → current). */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}

/**
 * Build breadcrumbs for a lesson path like `aulas/ano-1/trim-1/licao-01-...`.
 * Crumbs: Home → Ensino Médio → Ano N → Trim N → Lição NN
 */
export function lessonBreadcrumbs(
  caminho: string,
  locale: Locale,
  lessonTitle: string,
): BreadcrumbItem[] {
  const segs = caminho.split('/')
  const out: BreadcrumbItem[] = []
  out.push({ name: SITE_NAME_BY_LOCALE[locale], url: homeUrlFor(locale) })
  // Year + Term crumbs only for `aulas/ano-N/trim-M/...`
  if (segs[0] === 'aulas' && segs[1]?.startsWith('ano-') && segs[2]?.startsWith('trim-')) {
    const anoNum = segs[1].split('-')[1]
    const trimNum = segs[2].split('-')[1]
    const anoLabels: Record<Locale, string> = {
      'pt-BR': `Ano ${anoNum}`, en: `Year ${anoNum}`, es: `Año ${anoNum}`,
      zh: `第${anoNum}年`, ja: `第${anoNum}年`, de: `Jahr ${anoNum}`,
      fr: `Année ${anoNum}`, it: `Anno ${anoNum}`, ru: `Год ${anoNum}`,
      ko: `${anoNum}년`, pl: `Rok ${anoNum}`,
    }
    const trimLabels: Record<Locale, string> = {
      'pt-BR': `Trim ${trimNum}`, en: `Term ${trimNum}`, es: `Trimestre ${trimNum}`,
      zh: `第${trimNum}学期`, ja: `第${trimNum}学期`, de: `Quartal ${trimNum}`,
      fr: `Trimestre ${trimNum}`, it: `Trimestre ${trimNum}`, ru: `Семестр ${trimNum}`,
      ko: `${trimNum}분기`, pl: `Kwartał ${trimNum}`,
    }
    out.push({
      name: anoLabels[locale],
      url: canonicalUrlFor(`ensino-medio/ano-${anoNum}`, locale),
    })
    out.push({
      name: trimLabels[locale],
      url: canonicalUrlFor(`ensino-medio/ano-${anoNum}/trim-${trimNum}`, locale),
    })
  }
  out.push({ name: lessonTitle, url: canonicalUrlFor(caminho, locale) })
  return out
}

/** Site-wide EducationalOrganization (rendered on home only). */
export function buildOrganizationSchema(locale: Locale): Record<string, unknown> {
  const siteName = SITE_NAME_BY_LOCALE[locale]
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: siteName,
    url: homeUrlFor(locale),
    logo: SITE_LOGO,
    sameAs: [GITHUB_REPO],
    description: 'Open-source mathematics curriculum for Brazilian High School.',
  }
}

/** WebSite schema with SearchAction — eligible for sitelinks search box. */
export function buildWebSiteSchema(locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME_BY_LOCALE[locale],
    url: homeUrlFor(locale),
    inLanguage: LOCALES[locale].speechLang,
  }
}
