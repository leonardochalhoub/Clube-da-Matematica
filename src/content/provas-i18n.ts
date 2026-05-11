/**
 * Translations of the exam ("prova") titles.
 *
 * The PT-BR source has 120 individual `titulo` strings of the form
 * "Trim N · Versão M — <topic>". The `<topic>` is the same across the
 * 10 versions of each trim, so we only need to translate the 12 unique
 * topics. The trim/version labels already exist in translations.ts.
 *
 * Use `provaTitulo(trim, versao, locale)` to build the displayed title.
 */
import type { Locale } from '@/lib/i18n/locales'
import { translate } from '@/lib/i18n/translations'

type LocaleMap = Partial<Record<Locale, string>>

/** Theme of each trimester's exams (same for all 10 versions). */
export const PROVA_TEMA_I18N: Record<number, LocaleMap> = {
  1: {
    'pt-BR': 'Funções, afim, quadrática, exp/log',
    en: 'Functions, linear, quadratic, exp/log',
    es: 'Funciones, lineal, cuadrática, exp/log',
  },
  2: {
    'pt-BR': 'Trigonometria e sequências',
    en: 'Trigonometry and sequences',
    es: 'Trigonometría y sucesiones',
  },
  3: {
    'pt-BR': 'Geometria analítica e vetores',
    en: 'Analytic geometry and vectors',
    es: 'Geometría analítica y vectores',
  },
  4: {
    'pt-BR': 'Matrizes, combinatória, probabilidade',
    en: 'Matrices, combinatorics, probability',
    es: 'Matrices, combinatoria, probabilidad',
  },
  5: {
    'pt-BR': 'Limites e continuidade',
    en: 'Limits and continuity',
    es: 'Límites y continuidad',
  },
  6: {
    'pt-BR': 'Derivadas: conceito e regras',
    en: 'Derivatives: concept and rules',
    es: 'Derivadas: concepto y reglas',
  },
  7: {
    'pt-BR': 'Aplicações da derivada',
    en: 'Applications of the derivative',
    es: 'Aplicaciones de la derivada',
  },
  8: {
    'pt-BR': 'Estatística descritiva e probabilidade',
    en: 'Descriptive statistics and probability',
    es: 'Estadística descriptiva y probabilidad',
  },
  9: {
    'pt-BR': 'Cálculo integral',
    en: 'Integral calculus',
    es: 'Cálculo integral',
  },
  10: {
    'pt-BR': 'Equações diferenciais',
    en: 'Differential equations',
    es: 'Ecuaciones diferenciales',
  },
  11: {
    'pt-BR': 'Estatística inferencial e regressão',
    en: 'Inferential statistics and regression',
    es: 'Estadística inferencial y regresión',
  },
  12: {
    'pt-BR': 'Álgebra linear avançada e síntese',
    en: 'Advanced linear algebra and synthesis',
    es: 'Álgebra lineal avanzada y síntesis',
  },
}

/**
 * Build a localized exam title like:
 *   "Term 1 · Version 1 — Functions, linear, quadratic, exp/log"
 *
 * Falls back to the PT-BR `fallback` argument if the locale has no
 * translation for the topic.
 */
export function provaTitulo(
  trim: number,
  versao: number,
  locale: Locale,
  fallback: string,
): string {
  const tema =
    PROVA_TEMA_I18N[trim]?.[locale] ??
    PROVA_TEMA_I18N[trim]?.['pt-BR'] ??
    null
  if (!tema) return fallback
  const trimLabel = translate('em.term.short', locale, 'Trim')
  const verLabel = translate('prova.version.short', locale, 'Versão')
  return `${trimLabel} ${trim} · ${verLabel} ${versao} — ${tema}`
}
