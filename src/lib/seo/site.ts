/**
 * SEO constants — single source of truth for absolute URLs, site name,
 * default descriptions per locale.
 *
 * GitHub Pages hosts the site at a sub-path:
 *   https://leonardochalhoub.github.io/Clube-da-Matematica/
 *
 * `SITE_ORIGIN` is the origin only (no trailing slash).
 * `BASE_PATH` is the GH-Pages prefix (e.g. `/Clube-da-Matematica`), or '' in dev.
 * Full canonical URL = `${SITE_ORIGIN}${BASE_PATH}/${path}/` (trailing slash).
 */
import type { Locale } from '@/lib/i18n/locales'

/**
 * Origin only. When the project moves to a custom domain, change this one
 * constant (and the GH Pages `CNAME`). Everything else derives from it.
 */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://leonardochalhoub.github.io'

/**
 * GitHub Pages sub-path (e.g. `/Clube-da-Matematica`). Empty in dev and
 * when running on a root-level custom domain.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** Brand name in source language. Used in `og:site_name` and title templates. */
export const SITE_NAME_BY_LOCALE: Record<Locale, string> = {
  'pt-BR': 'Clube da Matemática',
  en: 'Math Club',
  es: 'Club de Matemáticas',
  zh: '数学俱乐部',
  ja: '数学クラブ',
  de: 'Mathematik-Klub',
  fr: 'Club de Mathématiques',
  it: 'Club di Matematica',
  ru: 'Математический клуб',
  ko: '수학 클럽',
  pl: 'Klub Matematyczny',
}

/** Default site-level description per locale (used on home + as fallback). */
export const SITE_DESCRIPTION_BY_LOCALE: Record<Locale, string> = {
  'pt-BR':
    'Curso completo de matemática para o Ensino Médio brasileiro — 120 lições, 3 anos, 4.770 exercícios sourceados. Open source, gratuito, em 11 idiomas.',
  en:
    'Complete high-school mathematics curriculum — 120 lessons, 3 years, 4,770 sourced exercises. Open-source, free, in 11 languages. From sets and intervals to Black-Scholes.',
  es:
    'Curso completo de matemáticas de Bachillerato — 120 lecciones, 3 años, 4.770 ejercicios con fuente. Open source, gratuito, en 11 idiomas. De conjuntos e intervalos hasta Black-Scholes.',
  zh: '完整的高中数学课程 — 120讲、3年、4770道有来源的练习题。开源、免费、11种语言。从集合区间到Black-Scholes。',
  ja: '完全な高校数学カリキュラム — 120講、3年間、出典付き4,770問。オープンソース、無料、11言語。集合と区間からBlack-Scholesまで。',
  de:
    'Vollständiger Mathematik-Lehrplan für die Oberstufe — 120 Lektionen, 3 Jahre, 4.770 belegte Übungen. Open Source, kostenlos, in 11 Sprachen. Von Mengen und Intervallen bis Black-Scholes.',
  fr:
    "Programme complet de mathématiques du lycée — 120 leçons, 3 ans, 4 770 exercices sourcés. Open source, gratuit, en 11 langues. Des ensembles et intervalles à Black-Scholes.",
  it:
    'Programma completo di matematica per la Scuola superiore — 120 lezioni, 3 anni, 4.770 esercizi con fonte. Open source, gratuito, in 11 lingue. Da insiemi e intervalli a Black-Scholes.',
  ru:
    'Полный курс математики старшей школы — 120 уроков, 3 года, 4770 упражнений с источниками. Открытый исходный код, бесплатно, на 11 языках. От множеств и интервалов до Black-Scholes.',
  ko: '완전한 고등학교 수학 커리큘럼 — 120강, 3년, 출처가 있는 4,770개 연습 문제. 오픈소스, 무료, 11개 언어. 집합과 구간부터 Black-Scholes까지.',
  pl:
    'Pełny program matematyki liceum — 120 lekcji, 3 lata, 4770 zadań z podanym źródłem. Open source, darmowy, w 11 językach. Od zbiorów i przedziałów do Black-Scholesa.',
}

/** Locale → suffix for lesson titles ("Lesson NN · Math Club" style). */
export const TITLE_TEMPLATE_BY_LOCALE: Record<Locale, string> = {
  'pt-BR': '%s · Clube da Matemática',
  en: '%s · Math Club',
  es: '%s · Club de Matemáticas',
  zh: '%s · 数学俱乐部',
  ja: '%s · 数学クラブ',
  de: '%s · Mathematik-Klub',
  fr: '%s · Club de Mathématiques',
  it: '%s · Club di Matematica',
  ru: '%s · Математический клуб',
  ko: '%s · 수학 클럽',
  pl: '%s · Klub Matematyczny',
}

/** Open Graph locale code (BCP-47-ish with underscore). */
export const OG_LOCALE_BY_LOCALE: Record<Locale, string> = {
  'pt-BR': 'pt_BR',
  en: 'en_US',
  es: 'es_ES',
  zh: 'zh_CN',
  ja: 'ja_JP',
  de: 'de_DE',
  fr: 'fr_FR',
  it: 'it_IT',
  ru: 'ru_RU',
  ko: 'ko_KR',
  pl: 'pl_PL',
}
