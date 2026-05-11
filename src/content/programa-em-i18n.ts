/**
 * Translations for the curriculum's structural data (PROGRAMA_EM):
 * year titles, term titles + focuses, and class-group titles.
 *
 * Lesson-level `titulo` / `topicos` are NOT translated here yet — those
 * 240 strings will pull from the translated MDX frontmatter in a future
 * step. For now the trim/year listing pages show:
 *   - UI labels   → translations.ts (this file)
 *   - structural  → this file (year/trim/aula titles + trim focus)
 *   - lesson list → PROGRAMA_EM source PT-BR text (fallback)
 */
import type { Locale } from '@/lib/i18n/locales'

type LocaleMap<T = string> = Partial<Record<Locale, T>>

/** Year-level descriptive blurb (`ano.resumo`). */
export const ANO_RESUMO_I18N: Record<number, LocaleMap> = {
  1: {
    'pt-BR': 'Estabelece a linguagem rigorosa: conjuntos, funções, trigonometria, geometria analítica, vetores, matrizes, combinatória. A última aula de cada trimestre é workshop integrador. A aula 9 ("taxa de variação média") já planta a semente do Cálculo.',
    en: 'Establishes rigorous language: sets, functions, trigonometry, analytic geometry, vectors, matrices, combinatorics. The last lesson of each term is an integrative workshop. Lesson 9 ("average rate of change") already plants the seed of Calculus.',
    es: 'Establece el lenguaje riguroso: conjuntos, funciones, trigonometría, geometría analítica, vectores, matrices, combinatoria. La última lección de cada trimestre es un taller integrador. La lección 9 ("tasa de variación media") ya planta la semilla del Cálculo.',
  },
  2: {
    'pt-BR': 'Aqui o aluno conhece a derivada formalmente. Junto, ganha estatística descritiva e probabilidade — fundamentos para tudo que vem em Mestrado de Engenharia, Economia, Finanças.',
    en: 'Here the student formally meets the derivative. Alongside, they gain descriptive statistics and probability — the foundations for everything that follows in a Master\'s in Engineering, Economics, or Finance.',
    es: 'Aquí el estudiante conoce formalmente la derivada. Junto a ello, obtiene estadística descriptiva y probabilidad — los fundamentos para todo lo que sigue en un Máster de Ingeniería, Economía o Finanzas.',
  },
  3: {
    'pt-BR': 'A síntese: cálculo integral, EDOs (com a ponte para a EDP de Black-Scholes), inferência estatística e álgebra linear introdutória. Quem termina o Ano 3 está pronto para Cálculo I em qualquer engenharia de federal.',
    en: 'The synthesis: integral calculus, ODEs (with the bridge to the Black-Scholes PDE), statistical inference, and introductory linear algebra. Whoever finishes Year 3 is ready for Calculus I in any federal-university engineering program.',
    es: 'La síntesis: cálculo integral, EDOs (con el puente a la EDP de Black-Scholes), inferencia estadística y álgebra lineal introductoria. Quien termina el Año 3 está listo para Cálculo I en cualquier ingeniería de universidad pública.',
  },
}

/** Helper: ano resumo. */
export function anoResumo(num: number, locale: Locale, fallback: string): string {
  return ANO_RESUMO_I18N[num]?.[locale] ?? ANO_RESUMO_I18N[num]?.['pt-BR'] ?? fallback
}

/** Year titles, keyed by ano number (1, 2, 3). */
export const ANO_TITULO_I18N: Record<number, LocaleMap> = {
  1: {
    'pt-BR': 'Ano 1 — Fundamentos',
    en: 'Year 1 — Foundations',
    es: 'Año 1 — Fundamentos',
  },
  2: {
    'pt-BR': 'Ano 2 — Cálculo Diferencial e Probabilidade',
    en: 'Year 2 — Differential Calculus and Probability',
    es: 'Año 2 — Cálculo Diferencial y Probabilidad',
  },
  3: {
    'pt-BR': 'Ano 3 — Integral, EDOs, Inferência, Álgebra Linear',
    en: 'Year 3 — Integral, ODEs, Inference, Linear Algebra',
    es: 'Año 3 — Integral, EDOs, Inferencia, Álgebra Lineal',
  },
}

/** Trim titles, keyed by trim number (1..12). */
export const TRIM_TITULO_I18N: Record<number, LocaleMap> = {
  1: {
    'pt-BR': 'Trimestre 1 — Funções, Conjuntos, Intuição de Mudança',
    en: 'Term 1 — Functions, Sets, Intuition of Change',
    es: 'Trimestre 1 — Funciones, Conjuntos, Intuición del Cambio',
  },
  2: {
    'pt-BR': 'Trimestre 2 — Trigonometria e Sequências',
    en: 'Term 2 — Trigonometry and Sequences',
    es: 'Trimestre 2 — Trigonometría y Sucesiones',
  },
  3: {
    'pt-BR': 'Trimestre 3 — Geometria Analítica e Vetores 2D',
    en: 'Term 3 — Analytic Geometry and 2D Vectors',
    es: 'Trimestre 3 — Geometría Analítica y Vectores 2D',
  },
  4: {
    'pt-BR': 'Trimestre 4 — Matrizes, Determinantes, Combinatória',
    en: 'Term 4 — Matrices, Determinants, Combinatorics',
    es: 'Trimestre 4 — Matrices, Determinantes, Combinatoria',
  },
  5: {
    'pt-BR': 'Trimestre 5 — Limites e Continuidade',
    en: 'Term 5 — Limits and Continuity',
    es: 'Trimestre 5 — Límites y Continuidad',
  },
  6: {
    'pt-BR': 'Trimestre 6 — Derivadas: Conceito e Regras',
    en: 'Term 6 — Derivatives: Concept and Rules',
    es: 'Trimestre 6 — Derivadas: Concepto y Reglas',
  },
  7: {
    'pt-BR': 'Trimestre 7 — Aplicações da Derivada',
    en: 'Term 7 — Applications of the Derivative',
    es: 'Trimestre 7 — Aplicaciones de la Derivada',
  },
  8: {
    'pt-BR': 'Trimestre 8 — Estatística Descritiva e Probabilidade',
    en: 'Term 8 — Descriptive Statistics and Probability',
    es: 'Trimestre 8 — Estadística Descriptiva y Probabilidad',
  },
  9: {
    'pt-BR': 'Trimestre 9 — Cálculo Integral',
    en: 'Term 9 — Integral Calculus',
    es: 'Trimestre 9 — Cálculo Integral',
  },
  10: {
    'pt-BR': 'Trimestre 10 — Equações Diferenciais',
    en: 'Term 10 — Differential Equations',
    es: 'Trimestre 10 — Ecuaciones Diferenciales',
  },
  11: {
    'pt-BR': 'Trimestre 11 — Estatística Inferencial e Regressão',
    en: 'Term 11 — Inferential Statistics and Regression',
    es: 'Trimestre 11 — Estadística Inferencial y Regresión',
  },
  12: {
    'pt-BR': 'Trimestre 12 — Álgebra Linear Avançada e Síntese',
    en: 'Term 12 — Advanced Linear Algebra and Synthesis',
    es: 'Trimestre 12 — Álgebra Lineal Avanzada y Síntesis',
  },
}

/** Trim "foco" (short pitch under the title). */
export const TRIM_FOCO_I18N: Record<number, LocaleMap> = {
  1: {
    'pt-BR': 'Linguagem matemática rigorosa + introdução à taxa de variação como conceito que precede o cálculo.',
    en: 'Rigorous mathematical language + introduction to the rate of change as the concept that precedes calculus.',
    es: 'Lenguaje matemático riguroso + introducción a la tasa de variación como concepto que precede al cálculo.',
  },
  2: {
    'pt-BR': 'Ferramentas trigonométricas + introdução à ideia de limite via sequências.',
    en: 'Trigonometric tools + introduction to the idea of limit via sequences.',
    es: 'Herramientas trigonométricas + introducción a la idea de límite vía sucesiones.',
  },
  3: {
    'pt-BR': 'Linguagem geométrica das funções + vetores como objetos novos.',
    en: 'Geometric language of functions + vectors as new objects.',
    es: 'Lenguaje geométrico de las funciones + vectores como objetos nuevos.',
  },
  4: {
    'pt-BR': 'Estruturas algébricas + ponte para probabilidade.',
    en: 'Algebraic structures + bridge to probability.',
    es: 'Estructuras algebraicas + puente hacia la probabilidad.',
  },
  5: {
    'pt-BR': 'Formalização do conceito de limite, ε-δ leve, continuidade.',
    en: 'Formalization of the limit concept, light ε-δ, continuity.',
    es: 'Formalización del concepto de límite, ε-δ ligero, continuidad.',
  },
  6: {
    'pt-BR': 'Definição via limite, regras (cadeia, produto, quociente), derivadas notáveis.',
    en: 'Definition via limit, rules (chain, product, quotient), notable derivatives.',
    es: 'Definición vía límite, reglas (cadena, producto, cociente), derivadas notables.',
  },
  7: {
    'pt-BR': 'Otimização, taxa relacionada, esboço de gráficos, Taylor introdutório.',
    en: 'Optimization, related rates, curve sketching, introductory Taylor.',
    es: 'Optimización, tasa relacionada, esbozo de gráficos, Taylor introductorio.',
  },
  8: {
    'pt-BR': 'Distribuições, normal, Teorema Central do Limite intuitivo.',
    en: 'Distributions, normal, intuitive Central Limit Theorem.',
    es: 'Distribuciones, normal, Teorema Central del Límite intuitivo.',
  },
  9: {
    'pt-BR': 'Antiderivada, integral definida, TFC, técnicas, aplicações.',
    en: 'Antiderivative, definite integral, FTC, techniques, applications.',
    es: 'Antiderivada, integral definida, TFC, técnicas, aplicaciones.',
  },
  10: {
    'pt-BR': 'EDOs 1.ª e 2.ª ordem, modelos físicos, métodos numéricos básicos.',
    en: '1st and 2nd order ODEs, physical models, basic numerical methods.',
    es: 'EDOs de 1.ª y 2.ª orden, modelos físicos, métodos numéricos básicos.',
  },
  11: {
    'pt-BR': 'Intervalos de confiança, testes de hipótese, regressão linear.',
    en: 'Confidence intervals, hypothesis tests, linear regression.',
    es: 'Intervalos de confianza, pruebas de hipótesis, regresión lineal.',
  },
  12: {
    'pt-BR': 'Espaços vetoriais, autovalores, PCA, integração final do programa.',
    en: 'Vector spaces, eigenvalues, PCA, final integration of the program.',
    es: 'Espacios vectoriales, autovalores, PCA, integración final del programa.',
  },
}

/** Aula titles, keyed by aula id. */
export const AULA_TITULO_I18N: Record<string, LocaleMap> = {
  // Year 1 - Term 1
  'fundamentos-linguagem': {
    'pt-BR': 'Aula A — Fundamentos da linguagem matemática',
    en: 'Class A — Foundations of mathematical language',
    es: 'Clase A — Fundamentos del lenguaje matemático',
  },
  'familias-de-funcoes': {
    'pt-BR': 'Aula B — Famílias de funções elementares',
    en: 'Class B — Families of elementary functions',
    es: 'Clase B — Familias de funciones elementales',
  },
  'exp-log-modelos': {
    'pt-BR': 'Aula C — Exponencial, logaritmo e modelos de crescimento',
    en: 'Class C — Exponential, logarithm and growth models',
    es: 'Clase C — Exponencial, logaritmo y modelos de crecimiento',
  },
  'taxa-variacao-bridge': {
    'pt-BR': 'Aula D — Taxa de variação média (ponte para o Cálculo)',
    en: 'Class D — Average rate of change (bridge to Calculus)',
    es: 'Clase D — Tasa de variación media (puente hacia el Cálculo)',
  },
  // Year 1 - Term 2
  'trig-triangulo': {
    'pt-BR': 'Aula A — Trigonometria do triângulo',
    en: 'Class A — Triangle trigonometry',
    es: 'Clase A — Trigonometría del triángulo',
  },
  'funcoes-trig': {
    'pt-BR': 'Aula B — Funções trigonométricas e equações',
    en: 'Class B — Trigonometric functions and equations',
    es: 'Clase B — Funciones trigonométricas y ecuaciones',
  },
  'sequencias-pa-pg': {
    'pt-BR': 'Aula C — Sequências, PA, PG',
    en: 'Class C — Sequences, arithmetic and geometric progressions',
    es: 'Clase C — Sucesiones, progresiones aritmética y geométrica',
  },
  'limite-intuitivo': {
    'pt-BR': 'Aula D — Limite intuitivo de sequência',
    en: 'Class D — Intuitive limit of a sequence',
    es: 'Clase D — Límite intuitivo de sucesión',
  },
  // Year 1 - Term 3
  'plano-cartesiano': {
    'pt-BR': 'Aula A — Plano cartesiano e retas',
    en: 'Class A — Cartesian plane and lines',
    es: 'Clase A — Plano cartesiano y rectas',
  },
  'circunferencia-conicas': {
    'pt-BR': 'Aula B — Circunferência e cônicas',
    en: 'Class B — Circle and conics',
    es: 'Clase B — Circunferencia y cónicas',
  },
  'vetores-fisica': {
    'pt-BR': 'Aula C — Vetores no plano e produto escalar',
    en: 'Class C — Vectors in the plane and the dot product',
    es: 'Clase C — Vectores en el plano y producto escalar',
  },
  'sistemas-sintese': {
    'pt-BR': 'Aula D — Sistemas lineares + síntese',
    en: 'Class D — Linear systems + synthesis',
    es: 'Clase D — Sistemas lineales + síntesis',
  },
  // Year 1 - Term 4
  'matrizes-estrutura': {
    'pt-BR': 'Aula A — Matrizes: definição e operações',
    en: 'Class A — Matrices: definition and operations',
    es: 'Clase A — Matrices: definición y operaciones',
  },
  'matrizes-determinantes': {
    'pt-BR': 'Aula B — Inversa, determinantes, sistemas',
    en: 'Class B — Inverse, determinants, systems',
    es: 'Clase B — Inversa, determinantes, sistemas',
  },
  'combinatoria': {
    'pt-BR': 'Aula C — Combinatória: PFC, permutação, combinação',
    en: 'Class C — Combinatorics: fundamental counting principle, permutations, combinations',
    es: 'Clase C — Combinatoria: principio fundamental del conteo, permutación, combinación',
  },
  'probabilidade-anual': {
    'pt-BR': 'Aula D — Probabilidade + síntese anual',
    en: 'Class D — Probability + yearly synthesis',
    es: 'Clase D — Probabilidad + síntesis anual',
  },
  // Year 2 - Term 5
  'limite-formal': {
    'pt-BR': 'Aula A — Limite formal e propriedades',
    en: 'Class A — Formal limit and properties',
    es: 'Clase A — Límite formal y propiedades',
  },
  'continuidade-laterais': {
    'pt-BR': 'Aula B — Continuidade e limites laterais',
    en: 'Class B — Continuity and one-sided limits',
    es: 'Clase B — Continuidad y límites laterales',
  },
  'limites-fundamentais': {
    'pt-BR': 'Aula C — Limites fundamentais e TVI',
    en: 'Class C — Fundamental limits and IVT',
    es: 'Clase C — Límites fundamentales y TVI',
  },
  'limite-sequencias-sintese': {
    'pt-BR': 'Aula D — Limite de sequência + síntese',
    en: 'Class D — Limit of a sequence + synthesis',
    es: 'Clase D — Límite de sucesión + síntesis',
  },
  // Year 2 - Term 6
  'derivada-conceito': {
    'pt-BR': 'Aula A — Definição da derivada e regras básicas',
    en: 'Class A — Definition of the derivative and basic rules',
    es: 'Clase A — Definición de la derivada y reglas básicas',
  },
  'derivada-cadeia-implicita': {
    'pt-BR': 'Aula B — Regra da cadeia e derivada implícita',
    en: 'Class B — Chain rule and implicit differentiation',
    es: 'Clase B — Regla de la cadena y derivada implícita',
  },
  'derivadas-superiores': {
    'pt-BR': 'Aula C — Ordem superior, inversa e aproximação linear',
    en: 'Class C — Higher order, inverse and linear approximation',
    es: 'Clase C — Orden superior, inversa y aproximación lineal',
  },
  'taxas-suavidade': {
    'pt-BR': 'Aula D — Taxas relacionadas + suavidade',
    en: 'Class D — Related rates + smoothness',
    es: 'Clase D — Tasas relacionadas + suavidad',
  },
  // Year 2 - Term 7
  'maximos-otimizacao': {
    'pt-BR': 'Aula A — Máximos, mínimos e otimização',
    en: 'Class A — Maxima, minima and optimization',
    es: 'Clase A — Máximos, mínimos y optimización',
  },
  'l-hopital-taylor': {
    'pt-BR': "Aula B — L'Hôpital e Taylor",
    en: "Class B — L'Hôpital and Taylor",
    es: "Clase B — L'Hôpital y Taylor",
  },
  'aplicacoes-economia': {
    'pt-BR': 'Aula C — Análise marginal e cinemática',
    en: 'Class C — Marginal analysis and kinematics',
    es: 'Clase C — Análisis marginal y cinemática',
  },
  'newton-sintese': {
    'pt-BR': 'Aula D — Newton-Raphson + síntese',
    en: 'Class D — Newton-Raphson + synthesis',
    es: 'Clase D — Newton-Raphson + síntesis',
  },
  // Year 2 - Term 8
  'estatistica-descritiva': {
    'pt-BR': 'Aula A — Estatística descritiva',
    en: 'Class A — Descriptive statistics',
    es: 'Clase A — Estadística descriptiva',
  },
  'va-binomial': {
    'pt-BR': 'Aula B — Variável aleatória e distribuição binomial',
    en: 'Class B — Random variable and binomial distribution',
    es: 'Clase B — Variable aleatoria y distribución binomial',
  },
  'normal-tcl': {
    'pt-BR': 'Aula C — Normal e Teorema Central do Limite',
    en: 'Class C — Normal distribution and the Central Limit Theorem',
    es: 'Clase C — Distribución normal y el Teorema del Límite Central',
  },
  'correlacao-bayes': {
    'pt-BR': 'Aula D — Correlação, regressão, Bayes + síntese',
    en: 'Class D — Correlation, regression, Bayes + synthesis',
    es: 'Clase D — Correlación, regresión, Bayes + síntesis',
  },
  // Year 3 - Term 9
  'antiderivada-tfc': {
    'pt-BR': 'Aula A — Antiderivada, integral definida e TFC',
    en: 'Class A — Antiderivative, definite integral and FTC',
    es: 'Clase A — Antiderivada, integral definida y TFC',
  },
  'tecnicas-integracao': {
    'pt-BR': 'Aula B — Substituição, partes, frações parciais',
    en: 'Class B — Substitution, integration by parts, partial fractions',
    es: 'Clase B — Sustitución, integración por partes, fracciones parciales',
  },
  'integrais-trig': {
    'pt-BR': 'Aula C — Integrais trigonométricas',
    en: 'Class C — Trigonometric integrals',
    es: 'Clase C — Integrales trigonométricas',
  },
  'aplicacoes-integral': {
    'pt-BR': 'Aula D — Área, volume + síntese',
    en: 'Class D — Area, volume + synthesis',
    es: 'Clase D — Área, volumen + síntesis',
  },
  // Year 3 - Term 10
  'edo-introducao': {
    'pt-BR': 'Aula A — Introdução e EDOs separáveis/lineares 1ª ordem',
    en: 'Class A — Introduction and 1st-order separable/linear ODEs',
    es: 'Clase A — Introducción y EDOs separables/lineales de 1.er orden',
  },
  'edo-modelos': {
    'pt-BR': 'Aula B — Crescimento, decaimento, Newton',
    en: 'Class B — Growth, decay, Newton',
    es: 'Clase B — Crecimiento, decaimiento, Newton',
  },
  'edo-2-ordem': {
    'pt-BR': 'Aula C — EDOs 2ª ordem: vibrações e RLC',
    en: 'Class C — 2nd-order ODEs: vibrations and RLC',
    es: 'Clase C — EDOs de 2.º orden: vibraciones y RLC',
  },
  'numerico-sintese': {
    'pt-BR': 'Aula D — Método de Euler + síntese',
    en: "Class D — Euler's method + synthesis",
    es: 'Clase D — Método de Euler + síntesis',
  },
  // Year 3 - Term 11
  'amostragem-ic': {
    'pt-BR': 'Aula A — Amostragem e intervalo de confiança',
    en: 'Class A — Sampling and confidence interval',
    es: 'Clase A — Muestreo e intervalo de confianza',
  },
  'teste-hipotese': {
    'pt-BR': 'Aula B — Teste de hipótese (z, t)',
    en: 'Class B — Hypothesis testing (z, t)',
    es: 'Clase B — Prueba de hipótesis (z, t)',
  },
  'regressao-anova': {
    'pt-BR': 'Aula C — Regressão linear simples e múltipla, ANOVA',
    en: 'Class C — Simple and multiple linear regression, ANOVA',
    es: 'Clase C — Regresión lineal simple y múltiple, ANOVA',
  },
  'qui-bayes-sintese': {
    'pt-BR': 'Aula D — Qui-quadrado, Bayes intro + síntese',
    en: 'Class D — Chi-squared, intro to Bayes + synthesis',
    es: 'Clase D — Chi-cuadrado, introducción a Bayes + síntesis',
  },
  // Year 3 - Term 12
  'espacos-vetoriais': {
    'pt-BR': 'Aula A — Espaços vetoriais e transformações',
    en: 'Class A — Vector spaces and transformations',
    es: 'Clase A — Espacios vectoriales y transformaciones',
  },
  'autovalores-diagonalizacao': {
    'pt-BR': 'Aula B — Autovalores, diagonalização, simétricas/ortogonais',
    en: 'Class B — Eigenvalues, diagonalization, symmetric/orthogonal matrices',
    es: 'Clase B — Valores propios, diagonalización, matrices simétricas/ortogonales',
  },
  'svd-pca': {
    'pt-BR': 'Aula C — SVD e PCA',
    en: 'Class C — SVD and PCA',
    es: 'Clase C — SVD y PCA',
  },
  'sintese-final': {
    'pt-BR': 'Aula D — Síntese (Black-Scholes) + Workshop final',
    en: 'Class D — Synthesis (Black-Scholes) + Final workshop',
    es: 'Clase D — Síntesis (Black-Scholes) + Taller final',
  },
}

/** Helper: look up year title for locale, fall back to PT-BR. */
export function anoTitulo(num: number, locale: Locale, fallback: string): string {
  return ANO_TITULO_I18N[num]?.[locale] ?? ANO_TITULO_I18N[num]?.['pt-BR'] ?? fallback
}

/** Helper: trim title. */
export function trimTitulo(num: number, locale: Locale, fallback: string): string {
  return TRIM_TITULO_I18N[num]?.[locale] ?? TRIM_TITULO_I18N[num]?.['pt-BR'] ?? fallback
}

/** Helper: trim focus blurb. */
export function trimFoco(num: number, locale: Locale, fallback: string): string {
  return TRIM_FOCO_I18N[num]?.[locale] ?? TRIM_FOCO_I18N[num]?.['pt-BR'] ?? fallback
}

/** Helper: aula title. Returns fallback if id is not yet translated. */
export function aulaTitulo(id: string, locale: Locale, fallback: string): string {
  return AULA_TITULO_I18N[id]?.[locale] ?? AULA_TITULO_I18N[id]?.['pt-BR'] ?? fallback
}
