'use client'

import Link from 'next/link'
import { useState, useId } from 'react'
import {
  type Aula,
  type MateriaEM,
  MATERIAS_LABEL,
  MATERIAS_DESCRICAO,
} from '@/content/programa-em'
import { useLocale } from './LocaleProvider'
import { localizedHref } from '@/lib/i18n/href'
import type { Locale } from '@/lib/i18n/locales'
import {
  licaoTitulo,
  licaoTopicos,
} from '@/content/programa-em-licao-i18n.generated'

/** Materia tab labels — translated for the locale switcher. */
const MATERIA_LABEL_I18N: Record<MateriaEM, Partial<Record<Locale, string>>> = {
  funcoes: { 'pt-BR': 'Funções', en: 'Functions', es: 'Funciones' },
  'pre-calculo': { 'pt-BR': 'Pré-Cálculo', en: 'Pre-Calculus', es: 'Pre-Cálculo' },
  trigonometria: { 'pt-BR': 'Trigonometria', en: 'Trigonometry', es: 'Trigonometría' },
  sequencias: { 'pt-BR': 'Sequências', en: 'Sequences', es: 'Sucesiones' },
  'geometria-analitica': { 'pt-BR': 'Geometria Analítica', en: 'Analytic Geometry', es: 'Geometría Analítica' },
  vetores: { 'pt-BR': 'Vetores', en: 'Vectors', es: 'Vectores' },
  matrizes: { 'pt-BR': 'Matrizes', en: 'Matrices', es: 'Matrices' },
  combinatoria: { 'pt-BR': 'Combinatória', en: 'Combinatorics', es: 'Combinatoria' },
  probabilidade: { 'pt-BR': 'Probabilidade', en: 'Probability', es: 'Probabilidad' },
  limites: { 'pt-BR': 'Limites', en: 'Limits', es: 'Límites' },
  derivadas: { 'pt-BR': 'Derivadas', en: 'Derivatives', es: 'Derivadas' },
  'aplicacoes-derivada': { 'pt-BR': 'Aplicações da Derivada', en: 'Applications of the Derivative', es: 'Aplicaciones de la Derivada' },
  'estatistica-descritiva': { 'pt-BR': 'Estatística Descritiva', en: 'Descriptive Statistics', es: 'Estadística Descriptiva' },
  integral: { 'pt-BR': 'Cálculo Integral', en: 'Integral Calculus', es: 'Cálculo Integral' },
  edo: { 'pt-BR': 'Equações Diferenciais', en: 'Differential Equations', es: 'Ecuaciones Diferenciales' },
  inferencia: { 'pt-BR': 'Inferência Estatística', en: 'Statistical Inference', es: 'Inferencia Estadística' },
  'algebra-linear': { 'pt-BR': 'Álgebra Linear', en: 'Linear Algebra', es: 'Álgebra Lineal' },
}

const MATERIA_DESCRICAO_I18N: Record<MateriaEM, Partial<Record<Locale, string>>> = {
  funcoes: {
    'pt-BR': 'Linguagem das funções — domínio, imagem, composição, inversa, classes principais.',
    en: 'The language of functions — domain, range, composition, inverse, main classes.',
    es: 'El lenguaje de las funciones — dominio, imagen, composición, inversa, clases principales.',
  },
  'pre-calculo': {
    'pt-BR': 'Taxa de variação média como porta de entrada do cálculo, sem ε-δ ainda.',
    en: 'Average rate of change as the gateway to calculus, no ε-δ yet.',
    es: 'Tasa de variación media como puerta de entrada al cálculo, sin ε-δ todavía.',
  },
  trigonometria: {
    'pt-BR': 'Razões e funções trigonométricas, identidades, aplicações em medição e modelagem periódica.',
    en: 'Trigonometric ratios and functions, identities, applications in measurement and periodic modeling.',
    es: 'Razones y funciones trigonométricas, identidades, aplicaciones en medición y modelado periódico.',
  },
  sequencias: {
    'pt-BR': 'PA, PG, recorrências e a primeira intuição de limite (1/n → 0).',
    en: 'Arithmetic and geometric progressions, recurrences, and the first intuition of limit (1/n → 0).',
    es: 'PA, PG, recurrencias y la primera intuición de límite (1/n → 0).',
  },
  'geometria-analitica': {
    'pt-BR': 'Pontos, retas, circunferências e cônicas no plano cartesiano.',
    en: 'Points, lines, circles and conics in the Cartesian plane.',
    es: 'Puntos, rectas, circunferencias y cónicas en el plano cartesiano.',
  },
  vetores: {
    'pt-BR': 'Vetores no plano e produto escalar — primeira álgebra geométrica.',
    en: 'Vectors in the plane and the dot product — first geometric algebra.',
    es: 'Vectores en el plano y producto escalar — primera álgebra geométrica.',
  },
  matrizes: {
    'pt-BR': 'Operações matriciais, determinantes, sistemas lineares — antessala da álgebra linear.',
    en: 'Matrix operations, determinants, linear systems — antechamber of linear algebra.',
    es: 'Operaciones matriciales, determinantes, sistemas lineales — antesala del álgebra lineal.',
  },
  combinatoria: {
    'pt-BR': 'Princípio da contagem, permutações, arranjos, combinações.',
    en: 'Counting principle, permutations, arrangements, combinations.',
    es: 'Principio de conteo, permutaciones, arreglos, combinaciones.',
  },
  probabilidade: {
    'pt-BR': 'Probabilidade discreta, eventos, independência condicional.',
    en: 'Discrete probability, events, conditional independence.',
    es: 'Probabilidad discreta, eventos, independencia condicional.',
  },
  limites: {
    'pt-BR': 'ε-δ leve, continuidade — formalização do "para onde tende".',
    en: 'Light ε-δ, continuity — formalization of "what does it approach".',
    es: 'ε-δ ligero, continuidad — formalización del "hacia dónde tiende".',
  },
  derivadas: {
    'pt-BR': 'Definição via limite, regras (cadeia, produto, quociente), derivadas notáveis.',
    en: 'Definition via limit, rules (chain, product, quotient), notable derivatives.',
    es: 'Definición vía límite, reglas (cadena, producto, cociente), derivadas notables.',
  },
  'aplicacoes-derivada': {
    'pt-BR': 'Otimização, taxa relacionada, esboço de gráficos, polinômio de Taylor introdutório.',
    en: 'Optimization, related rates, curve sketching, introductory Taylor polynomial.',
    es: 'Optimización, tasas relacionadas, esbozo de gráficos, polinomio de Taylor introductorio.',
  },
  'estatistica-descritiva': {
    'pt-BR': 'Medidas resumo, distribuições, normal, Teorema Central do Limite intuitivo.',
    en: 'Summary statistics, distributions, normal, intuitive Central Limit Theorem.',
    es: 'Medidas resumen, distribuciones, normal, Teorema Central del Límite intuitivo.',
  },
  integral: {
    'pt-BR': 'Antiderivada, integral definida, TFC, técnicas de integração, aplicações.',
    en: 'Antiderivative, definite integral, FTC, integration techniques, applications.',
    es: 'Antiderivada, integral definida, TFC, técnicas de integración, aplicaciones.',
  },
  edo: {
    'pt-BR': 'EDOs de 1.ª e 2.ª ordem, modelos físicos, métodos numéricos básicos.',
    en: '1st and 2nd order ODEs, physical models, basic numerical methods.',
    es: 'EDOs de 1.er y 2.do orden, modelos físicos, métodos numéricos básicos.',
  },
  inferencia: {
    'pt-BR': 'Intervalos de confiança, testes de hipótese, regressão linear simples.',
    en: 'Confidence intervals, hypothesis tests, simple linear regression.',
    es: 'Intervalos de confianza, pruebas de hipótesis, regresión lineal simple.',
  },
  'algebra-linear': {
    'pt-BR': 'Espaços vetoriais, autovalores, PCA — síntese final do programa.',
    en: 'Vector spaces, eigenvalues, PCA — final synthesis of the program.',
    es: 'Espacios vectoriales, valores propios, PCA — síntesis final del programa.',
  },
}

function materiaLabel(m: MateriaEM, locale: Locale): string {
  return MATERIA_LABEL_I18N[m]?.[locale] ?? MATERIAS_LABEL[m]
}

function materiaDescricao(m: MateriaEM, locale: Locale): string {
  return MATERIA_DESCRICAO_I18N[m]?.[locale] ?? MATERIAS_DESCRICAO[m]
}

interface AulaPath extends Aula {
  /** Caminho completo (ex.: 'aulas/ano-1/trim-1/licao-01-conjuntos-intervalos'). */
  caminho?: string
}

interface MateriaTabsProps {
  /** Matérias presentes neste ano (ordem das tabs). */
  materias: MateriaEM[]
  /** Aulas indexadas por matéria. */
  aulasPorMateria: Record<MateriaEM, AulaPath[]>
}

/**
 * Abas WAI-ARIA-compliant para apresentar matérias dentro de um Ano.
 * Cada tab mostra a lista de aulas daquela matéria; aulas publicadas
 * têm link clicável, planejadas ficam em estado "planejada".
 */
export function MateriaTabs({ materias, aulasPorMateria }: MateriaTabsProps) {
  const { t, locale } = useLocale()
  const [ativa, setAtiva] = useState<MateriaEM>(materias[0]!)
  const groupId = useId()

  if (materias.length === 0) {
    return (
      <p className="rounded-lg bg-clube-cream-soft px-4 py-3 text-sm italic text-clube-mist">
        {t('materia.empty.subjects')}
      </p>
    )
  }

  return (
    <div className="not-prose">
      <div
        role="tablist"
        aria-label={t('materia.tablist.aria')}
        className="flex flex-wrap gap-2 border-b border-clube-mist-soft/40 pb-3"
      >
        {materias.map((m) => {
          const selected = m === ativa
          const tabId = `${groupId}-tab-${m}`
          const panelId = `${groupId}-panel-${m}`
          return (
            <button
              key={m}
              id={tabId}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setAtiva(m)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                  e.preventDefault()
                  const i = materias.indexOf(m)
                  const next =
                    e.key === 'ArrowRight'
                      ? materias[(i + 1) % materias.length]!
                      : materias[(i - 1 + materias.length) % materias.length]!
                  setAtiva(next)
                }
              }}
              className={
                'rounded-full px-4 py-1.5 text-sm font-semibold transition-all ' +
                (selected
                  ? 'bg-clube-teal text-white shadow-sm'
                  : 'border border-clube-mist-soft/60 bg-clube-surface text-clube-ink/85 hover:border-clube-teal hover:text-clube-teal')
              }
            >
              {materiaLabel(m, locale)}
            </button>
          )
        })}
      </div>

      {materias.map((m) => {
        const tabId = `${groupId}-tab-${m}`
        const panelId = `${groupId}-panel-${m}`
        const aulas = aulasPorMateria[m] ?? []
        const isActive = m === ativa
        return (
          <section
            key={m}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isActive}
            className="pt-6"
          >
            <header className="mb-4">
              <h3 className="text-xl font-bold text-clube-teal-deep">
                {materiaLabel(m, locale)}
              </h3>
              <p className="mt-1 text-sm text-clube-mist">
                {materiaDescricao(m, locale)}
              </p>
            </header>

            {aulas.length === 0 ? (
              <p className="rounded-lg bg-clube-cream-soft px-4 py-3 text-sm italic text-clube-mist">
                {t('materia.empty.lessons')}
              </p>
            ) : (
              <ol className="space-y-2">
                {aulas.map((aula) => {
                  const publicada = !!aula.caminho
                  return (
                    <li
                      key={aula.num}
                      className="flex items-start gap-3 rounded-lg border border-clube-mist-soft/30 bg-clube-surface px-3 py-2 text-sm"
                    >
                      <span className="mt-0.5 inline-block min-w-[3rem] rounded-full bg-clube-cream-soft px-2 py-0.5 text-center font-mono text-[10px] font-bold text-clube-teal-deep">
                        {t('materia.lesson.label')} {aula.num}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-clube-ink">
                          {publicada && aula.caminho ? (
                            <Link
                              href={localizedHref(aula.caminho, locale)}
                              className="text-clube-teal hover:text-clube-teal-deep"
                            >
                              {licaoTitulo(aula.num, locale, aula.titulo)} →
                            </Link>
                          ) : (
                            licaoTitulo(aula.num, locale, aula.titulo)
                          )}
                        </div>
                        <div className="text-xs text-clube-mist">
                          {licaoTopicos(aula.num, locale, aula.topicos)}
                        </div>
                      </div>
                      {publicada ? (
                        <span className="rounded-full bg-clube-leaf/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-clube-leaf">
                          {t('materia.status.published')}
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-700">
                          {t('materia.status.planned')}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ol>
            )}
          </section>
        )
      })}
    </div>
  )
}
