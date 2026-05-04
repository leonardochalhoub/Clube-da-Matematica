/**
 * Programa de Ensino Médio brasileiro otimizado.
 *
 * 3 anos × 4 trimestres × 10 aulas = 120 aulas. Calibrado pelos
 * currículos oficiais de Japão (Math I/II/III), Alemanha
 * (Klasse 10/11/12 Leistungskurs) e Singapura (Sec 4 + JC H2 Math).
 *
 * Cada aula tem `materia` para permitir agrupamento em abas
 * dentro de cada ano (Cálculo, Trigonometria, etc.).
 */

export type MateriaEM =
  | 'funcoes'
  | 'pre-calculo'
  | 'trigonometria'
  | 'sequencias'
  | 'geometria-analitica'
  | 'vetores'
  | 'matrizes'
  | 'combinatoria'
  | 'probabilidade'
  | 'limites'
  | 'derivadas'
  | 'aplicacoes-derivada'
  | 'estatistica-descritiva'
  | 'integral'
  | 'edo'
  | 'inferencia'
  | 'algebra-linear'

export const MATERIAS_LABEL: Record<MateriaEM, string> = {
  funcoes: 'Funções',
  'pre-calculo': 'Pré-Cálculo',
  trigonometria: 'Trigonometria',
  sequencias: 'Sequências',
  'geometria-analitica': 'Geometria Analítica',
  vetores: 'Vetores',
  matrizes: 'Matrizes',
  combinatoria: 'Combinatória',
  probabilidade: 'Probabilidade',
  limites: 'Limites',
  derivadas: 'Derivadas',
  'aplicacoes-derivada': 'Aplicações da Derivada',
  'estatistica-descritiva': 'Estatística Descritiva',
  integral: 'Cálculo Integral',
  edo: 'Equações Diferenciais',
  inferencia: 'Inferência Estatística',
  'algebra-linear': 'Álgebra Linear',
}

export const MATERIAS_DESCRICAO: Record<MateriaEM, string> = {
  funcoes:
    'Linguagem das funções — domínio, imagem, composição, inversa, classes principais.',
  'pre-calculo':
    'Taxa de variação média como porta de entrada do cálculo, sem ε-δ ainda.',
  trigonometria:
    'Razões e funções trigonométricas, identidades, aplicações em medição e modelagem periódica.',
  sequencias:
    'PA, PG, recorrências e a primeira intuição de limite (1/n → 0).',
  'geometria-analitica':
    'Pontos, retas, circunferências e cônicas no plano cartesiano.',
  vetores:
    'Vetores no plano e produto escalar — primeira álgebra geométrica.',
  matrizes:
    'Operações matriciais, determinantes, sistemas lineares — antessala da álgebra linear.',
  combinatoria:
    'Princípio da contagem, permutações, arranjos, combinações.',
  probabilidade:
    'Probabilidade discreta, eventos, independência condicional.',
  limites:
    'ε-δ leve, continuidade — formalização do "para onde tende".',
  derivadas:
    'Definição via limite, regras (cadeia, produto, quociente), derivadas notáveis.',
  'aplicacoes-derivada':
    'Otimização, taxa relacionada, esboço de gráficos, polinômio de Taylor introdutório.',
  'estatistica-descritiva':
    'Medidas resumo, distribuições, normal, Teorema Central do Limite intuitivo.',
  integral:
    'Antiderivada, integral definida, TFC, técnicas de integração, aplicações.',
  edo:
    'EDOs de 1.ª e 2.ª ordem, modelos físicos, métodos numéricos básicos.',
  inferencia:
    'Intervalos de confiança, testes de hipótese, regressão linear simples.',
  'algebra-linear':
    'Espaços vetoriais, autovalores, PCA — síntese final do programa.',
}

/**
 * Vocabulário oficial:
 *   - Lição: unidade pequena (~3h estudo, 1 conceito principal). É o que o
 *     aluno encontra como conteúdo MDX individual no site.
 *   - Aula: agrupamento didático de 3-5 lições temáticas dentro de um
 *     trimestre (~10-15h totais). Representa "uma matéria coberta em sala".
 *   - Trimestre: 8-12 lições agrupadas em 2-3 Aulas. ~30h.
 *   - Ano: 4 trimestres. ~128h.
 *
 * Os arquivos MDX são as **Lições** (mantidos como `aula-NN.mdx` por
 * compatibilidade de URL).
 */
export interface Licao {
  num: number
  titulo: string
  topicos: string
  materia: MateriaEM
  /** Slug do MDX se já publicada. */
  slug?: string
}

/** Compatibilidade: código antigo importa `Aula` mas semanticamente é Lição. */
export type Aula = Licao

export interface AulaAgrupada {
  /** Identificador estável (ex.: "funcoes-elementares"). */
  id: string
  titulo: string
  /** Lições agrupadas (referenciadas por número). */
  licoesNums: number[]
  /** Carga horária estimada (~3h por lição agrupada). */
  cargaHoraria: number
}

export interface Trimestre {
  num: number
  titulo: string
  foco: string
  /** Lições do trimestre (10 por padrão). */
  aulas: Licao[]
  /**
   * Agrupamento opcional em "Aulas" (no sentido didático).
   * Quando presente, a UI exibe as Aulas como nível primário.
   */
  agrupamento?: AulaAgrupada[]
}

/**
 * Carga horária estimada por trimestre (em horas-aula).
 * Calibrada por:
 *  - JP MEXT Math I: ~140h/ano = ~35h/trim
 *  - DE KMK Klasse 10 LK: ~120h/ano = ~30h/trim
 *  - SG MOE E-Math: ~135h/ano = ~33h/trim
 * Média ~32h/trim. Cada lição = ~3h (1h estudo + 2h exercícios).
 */
export const HORAS_POR_TRIMESTRE = 32
export const HORAS_POR_AULA = 3.2 // 32h / 10 aulas
export const HORAS_POR_ANO = HORAS_POR_TRIMESTRE * 4 // 128h/ano
export const HORAS_TOTAIS = HORAS_POR_ANO * 3 // ~384h em 3 anos

export interface Ano {
  num: 1 | 2 | 3
  titulo: string
  idade: string
  equivalencia: string
  resumo: string
  trimestres: Trimestre[]
}

export const PROGRAMA_EM: Ano[] = [
  {
    num: 1,
    titulo: 'Ano 1 — Fundamentos',
    idade: '15 anos',
    equivalencia: 'JP Math I + Math A · DE Klasse 10 · SG Sec 4 (E-Math)',
    resumo:
      'Estabelece a linguagem rigorosa: conjuntos, funções, trigonometria, geometria analítica, vetores, matrizes, combinatória. A última aula de cada trimestre é workshop integrador. A aula 9 ("taxa de variação média") já planta a semente do Cálculo.',
    trimestres: [
      {
        num: 1,
        titulo: 'Trimestre 1 — Funções, Conjuntos, Intuição de Mudança',
        foco:
          'Linguagem matemática rigorosa + introdução à taxa de variação como conceito que precede o cálculo.',
        aulas: [
          { num: 1, titulo: 'Conjuntos, intervalos, notação', topicos: 'ℕ, ℤ, ℚ, ℝ, intervalos, ∩, ∪, complemento', materia: 'funcoes', slug: 'licao-01-conjuntos-intervalos' },
          { num: 2, titulo: 'Funções: definição, domínio, imagem', topicos: 'f: A→B, gráfico cartesiano, sobrejetora/injetora', materia: 'funcoes', slug: 'licao-02-funcoes' },
          { num: 3, titulo: 'Funções afins (1.º grau)', topicos: 'Inclinação como taxa de variação constante', materia: 'funcoes', slug: 'licao-03-afim' },
          { num: 4, titulo: 'Funções quadráticas', topicos: 'Vértice, raízes, eixo de simetria, Bhaskara', materia: 'funcoes', slug: 'licao-04-quadratica' },
          { num: 5, titulo: 'Composição e função inversa', topicos: 'f∘g, f⁻¹, condição de invertibilidade', materia: 'funcoes', slug: 'licao-05-composicao-inversa' },
          { num: 6, titulo: 'Funções exponenciais', topicos: 'a^x, número e via juros compostos', materia: 'funcoes', slug: 'licao-06-exponencial' },
          { num: 7, titulo: 'Funções logarítmicas', topicos: 'log_a x como inversa de a^x; ln, log decimal', materia: 'funcoes', slug: 'licao-07-logaritmo' },
          { num: 8, titulo: 'Crescimento e decaimento', topicos: 'População, decaimento radioativo, juros compostos', materia: 'funcoes', slug: 'licao-08-crescimento' },
          { num: 9, titulo: 'TAXA DE VARIAÇÃO MÉDIA', topicos: 'Δy/Δx, interpretação geométrica e física — porta de entrada do cálculo', materia: 'pre-calculo', slug: 'licao-09-taxa-variacao' },
          { num: 10, titulo: 'Consolidação Trim 1', topicos: 'Workshop integrador, problemas estilo ENEM/EJU/Abitur', materia: 'pre-calculo', slug: 'licao-10-consolidacao-trim-1' },
        ],
        agrupamento: [
          { id: 'fundamentos-linguagem', titulo: 'Aula A — Fundamentos da linguagem matemática', licoesNums: [1, 2], cargaHoraria: 6 },
          { id: 'familias-de-funcoes', titulo: 'Aula B — Famílias de funções elementares', licoesNums: [3, 4, 5], cargaHoraria: 9 },
          { id: 'exp-log-modelos', titulo: 'Aula C — Exponencial, logaritmo e modelos de crescimento', licoesNums: [6, 7, 8], cargaHoraria: 9 },
          { id: 'taxa-variacao-bridge', titulo: 'Aula D — Taxa de variação média (ponte para o Cálculo)', licoesNums: [9, 10], cargaHoraria: 6 },
        ],
      },
      {
        num: 2,
        titulo: 'Trimestre 2 — Trigonometria e Sequências',
        foco:
          'Ferramentas trigonométricas + introdução à ideia de limite via sequências.',
        aulas: [
          { num: 11, titulo: 'Razões trigonométricas no triângulo retângulo', topicos: 'sen, cos, tan, aplicações em medição', materia: 'trigonometria', slug: 'licao-11-trig-triangulo' },
          { num: 12, titulo: 'Círculo trigonométrico', topicos: 'Radianos, identidades fundamentais', materia: 'trigonometria', slug: 'licao-12-circulo-trigonometrico' },
          { num: 13, titulo: 'Funções trigonométricas', topicos: 'Periodicidade, gráficos de sin x, cos x, tan x', materia: 'trigonometria', slug: 'licao-13-funcoes-trigonometricas' },
          { num: 14, titulo: 'Equações e inequações trigonométricas', topicos: 'sin x = 1/2, etc.', materia: 'trigonometria', slug: 'licao-14-equacoes-trigonometricas' },
          { num: 15, titulo: 'Lei dos senos e cossenos', topicos: 'Triângulos não-retângulos, área via 1/2 ab sin C', materia: 'trigonometria', slug: 'licao-15-leis-senos-cossenos' },
          { num: 16, titulo: 'Sequências numéricas', topicos: '(aₙ), recorrência, monotonia, limitação', materia: 'sequencias', slug: 'licao-16-sequencias' },
          { num: 17, titulo: 'Progressões aritméticas (PA)', topicos: 'aₙ = a₁ + (n−1)r, soma de termos', materia: 'sequencias', slug: 'licao-17-pa' },
          { num: 18, titulo: 'Progressões geométricas (PG)', topicos: 'aₙ = a₁q^(n−1), soma finita e infinita', materia: 'sequencias', slug: 'licao-18-pg' },
          { num: 19, titulo: 'LIMITE INTUITIVO DE SEQUÊNCIA', topicos: '"Para onde vai 1/n?" — ponte explícita pra Trim 5', materia: 'sequencias', slug: 'licao-19-limite-intuitivo' },
          { num: 20, titulo: 'Consolidação Trim 2', topicos: 'Problemas integrados', materia: 'sequencias', slug: 'licao-20-consolidacao-trim-2' },
        ],
        agrupamento: [
          { id: 'trig-triangulo', titulo: 'Aula A — Trigonometria do triângulo', licoesNums: [11, 12], cargaHoraria: 6 },
          { id: 'funcoes-trig', titulo: 'Aula B — Funções trigonométricas e equações', licoesNums: [13, 14, 15], cargaHoraria: 9 },
          { id: 'sequencias-pa-pg', titulo: 'Aula C — Sequências, PA, PG', licoesNums: [16, 17, 18], cargaHoraria: 9 },
          { id: 'limite-intuitivo', titulo: 'Aula D — Limite intuitivo de sequência', licoesNums: [19, 20], cargaHoraria: 6 },
        ],
      },
      {
        num: 3,
        titulo: 'Trimestre 3 — Geometria Analítica e Vetores 2D',
        foco:
          'Linguagem geométrica das funções + vetores como objetos novos.',
        aulas: [
          { num: 21, titulo: 'Plano cartesiano: distância, ponto médio', topicos: 'd(P,Q), divisão de segmento', materia: 'geometria-analitica', slug: 'licao-21-plano-cartesiano' },
          { num: 22, titulo: 'Equação da reta', topicos: 'Forma geral, reduzida, paramétrica', materia: 'geometria-analitica', slug: 'licao-22-equacao-reta' },
          { num: 23, titulo: 'Posição relativa de retas', topicos: 'Paralelismo, perpendicularidade, ângulo', materia: 'geometria-analitica', slug: 'licao-23-posicao-relativa-retas' },
          { num: 24, titulo: 'Equação da circunferência', topicos: '(x−a)² + (y−b)² = r²', materia: 'geometria-analitica', slug: 'licao-24-circunferencia' },
          { num: 25, titulo: 'Cônicas: elipse, parábola, hipérbole', topicos: 'Definições por foco-diretriz e equações', materia: 'geometria-analitica', slug: 'licao-25-conicas' },
          { num: 26, titulo: 'Vetores no plano', topicos: 'Representação, soma, produto por escalar', materia: 'vetores', slug: 'licao-26-vetores-plano' },
          { num: 27, titulo: 'Produto escalar', topicos: 'u·v, ângulo entre vetores, projeção', materia: 'vetores', slug: 'licao-27-produto-escalar' },
          { num: 28, titulo: 'Aplicações de vetores em física', topicos: 'Forças, deslocamento, decomposição', materia: 'vetores', slug: 'licao-28-aplicacoes-vetores-fisica' },
          { num: 29, titulo: 'Sistemas lineares 2x2 e 3x3', topicos: 'Substituição, escalonamento básico', materia: 'vetores', slug: 'licao-29-sistemas-lineares' },
          { num: 30, titulo: 'Consolidação Trim 3', topicos: 'Síntese geométrica + analítica', materia: 'vetores', slug: 'licao-30-consolidacao-trim-3' },
        ],
        agrupamento: [
          { id: 'plano-cartesiano', titulo: 'Aula A — Plano cartesiano e retas', licoesNums: [21, 22, 23], cargaHoraria: 9 },
          { id: 'circunferencia-conicas', titulo: 'Aula B — Circunferência e cônicas', licoesNums: [24, 25], cargaHoraria: 6 },
          { id: 'vetores-fisica', titulo: 'Aula C — Vetores no plano e produto escalar', licoesNums: [26, 27, 28], cargaHoraria: 9 },
          { id: 'sistemas-sintese', titulo: 'Aula D — Sistemas lineares + síntese', licoesNums: [29, 30], cargaHoraria: 6 },
        ],
      },
      {
        num: 4,
        titulo: 'Trimestre 4 — Matrizes, Determinantes, Combinatória',
        foco: 'Estruturas algébricas + ponte para probabilidade.',
        aulas: [
          { num: 31, titulo: 'Introdução a matrizes', topicos: 'Notação, dimensões, igualdade', materia: 'matrizes', slug: 'licao-31-matrizes' },
          { num: 32, titulo: 'Operações com matrizes', topicos: 'Soma, escalar, produto matricial', materia: 'matrizes', slug: 'licao-32-operacoes-matrizes' },
          { num: 33, titulo: 'Matriz transposta, identidade, inversa', topicos: 'A^T, I, A⁻¹', materia: 'matrizes', slug: 'licao-33-transposta-inversa' },
          { num: 34, titulo: 'Determinantes 2x2 e 3x3', topicos: 'Sarrus, propriedades', materia: 'matrizes', slug: 'licao-34-determinantes' },
          { num: 35, titulo: 'Resolução de sistemas via matrizes', topicos: 'Cramer, Gauss básico', materia: 'matrizes', slug: 'licao-35-sistemas-via-matrizes' },
          { num: 36, titulo: 'Princípio fundamental da contagem', topicos: 'n₁·n₂·...', materia: 'combinatoria', slug: 'licao-36-pfc' },
          { num: 37, titulo: 'Permutações e arranjos', topicos: 'n!, A(n,p)', materia: 'combinatoria', slug: 'licao-37-permutacoes-arranjos' },
          { num: 38, titulo: 'Combinações', topicos: 'C(n,p), triângulo de Pascal', materia: 'combinatoria', slug: 'licao-38-combinacoes' },
          { num: 39, titulo: 'Probabilidade discreta básica', topicos: 'P(A) = casos favoráveis / casos possíveis', materia: 'probabilidade', slug: 'licao-39-probabilidade' },
          { num: 40, titulo: 'Consolidação anual', topicos: 'Workshop integrador Ano 1', materia: 'probabilidade', slug: 'licao-40-consolidacao-anual' },
        ],
        agrupamento: [
          { id: 'matrizes-estrutura', titulo: 'Aula A — Matrizes: definição e operações', licoesNums: [31, 32], cargaHoraria: 6 },
          { id: 'matrizes-determinantes', titulo: 'Aula B — Inversa, determinantes, sistemas', licoesNums: [33, 34, 35], cargaHoraria: 9 },
          { id: 'combinatoria', titulo: 'Aula C — Combinatória: PFC, permutação, combinação', licoesNums: [36, 37, 38], cargaHoraria: 9 },
          { id: 'probabilidade-anual', titulo: 'Aula D — Probabilidade + síntese anual', licoesNums: [39, 40], cargaHoraria: 6 },
        ],
      },
    ],
  },
  {
    num: 2,
    titulo: 'Ano 2 — Cálculo Diferencial e Probabilidade',
    idade: '16 anos',
    equivalencia: 'JP Math II + Math B · DE Klasse 11 LK · SG JC 1 (H2 Math início)',
    resumo:
      'Aqui o aluno conhece a derivada formalmente. Junto, ganha estatística descritiva e probabilidade — fundamentos para tudo que vem em Mestrado de Engenharia, Economia, Finanças.',
    trimestres: [
      {
        num: 5,
        titulo: 'Trimestre 5 — Limites e Continuidade',
        foco: 'Formalização do conceito de limite, ε-δ leve, continuidade.',
        aulas: [
          { num: 41, titulo: 'Limite formal: definição ε-δ', topicos: 'Cauchy 1821, Weierstrass 1872', materia: 'limites', slug: 'licao-41-limite-formal' },
          { num: 42, titulo: 'Propriedades algébricas de limites', topicos: 'Soma, produto, quociente, composição, confronto', materia: 'limites', slug: 'licao-42-propriedades-limites' },
          { num: 43, titulo: 'Continuidade de funções', topicos: 'Tipos, TVI, Weierstrass', materia: 'limites', slug: 'licao-43-continuidade' },
          { num: 44, titulo: 'Limites laterais e infinitos', topicos: 'Assíntotas verticais e horizontais', materia: 'limites', slug: 'licao-44-limites-laterais' },
          { num: 45, titulo: 'Limites fundamentais e indeterminações', topicos: 'sin x/x, (1+1/n)^n, e^x-1/x', materia: 'limites', slug: 'licao-45-limites-fundamentais' },
          { num: 46, titulo: 'TVI e aplicações', topicos: 'Bisseção, ponto fixo', materia: 'limites', slug: 'licao-46-tvi-tvm' },
          { num: 47, titulo: 'Assíntotas', topicos: 'Vertical, horizontal, oblíqua', materia: 'limites', slug: 'licao-47-assintotas' },
          { num: 48, titulo: 'Limites com funções trigonométricas', topicos: 'Identidades + manipulação', materia: 'limites', slug: 'licao-48-limites-funcoes-trig' },
          { num: 49, titulo: 'Limite formal de sequências', topicos: 'ε-N, monótona limitada, Bolzano-Weierstrass', materia: 'limites', slug: 'licao-49-limite-sequencias' },
          { num: 50, titulo: 'Consolidação Trim 5', topicos: 'Workshop integrador', materia: 'limites', slug: 'licao-50-consolidacao-trim-5' },
        ],
        agrupamento: [
          { id: 'limite-formal', titulo: 'Aula A — Limite formal e propriedades', licoesNums: [41, 42], cargaHoraria: 6 },
          { id: 'continuidade-laterais', titulo: 'Aula B — Continuidade e limites laterais', licoesNums: [43, 44], cargaHoraria: 6 },
          { id: 'limites-fundamentais', titulo: 'Aula C — Limites fundamentais e TVI', licoesNums: [45, 46, 47, 48], cargaHoraria: 12 },
          { id: 'limite-sequencias-sintese', titulo: 'Aula D — Limite de sequência + síntese', licoesNums: [49, 50], cargaHoraria: 6 },
        ],
      },
      {
        num: 6,
        titulo: 'Trimestre 6 — Derivadas: Conceito e Regras',
        foco:
          'Definição via limite, regras (cadeia, produto, quociente), derivadas notáveis.',
        aulas: [
          { num: 51, titulo: 'Derivada: definição via limite', topicos: 'Reta tangente, diferenciabilidade', materia: 'derivadas', slug: 'licao-51-derivada-definicao' },
          { num: 52, titulo: 'Regras de derivação', topicos: 'Soma, produto, quociente, potência', materia: 'derivadas', slug: 'licao-52-regras-derivacao' },
          { num: 53, titulo: 'Regra da cadeia', topicos: '(f∘g)\' = f\'(g)·g\'', materia: 'derivadas', slug: 'licao-53-regra-cadeia' },
          { num: 54, titulo: 'Derivada implícita', topicos: 'F(x,y)=0, dy/dx', materia: 'derivadas', slug: 'licao-54-derivadas-implicitas' },
          { num: 55, titulo: 'Derivadas de ordem superior', topicos: 'f\'\'(x), f^(n)', materia: 'derivadas', slug: 'licao-55-derivadas-superiores' },
          { num: 56, titulo: 'Derivadas de funções inversas', topicos: '(f^-1)\'(y) = 1/f\'(x)', materia: 'derivadas', slug: 'licao-56-derivadas-inversas' },
          { num: 57, titulo: 'Aproximação linear e diferencial', topicos: 'f(x)≈f(a)+f\'(a)(x-a)', materia: 'derivadas', slug: 'licao-57-aproximacao-linear' },
          { num: 58, titulo: 'Taxas relacionadas', topicos: 'dy/dt = f\'(x)·dx/dt', materia: 'derivadas', slug: 'licao-58-taxas-relacionadas' },
          { num: 59, titulo: 'Diferenciabilidade e suavidade', topicos: 'C^k, pontos de bico, cúspides', materia: 'derivadas', slug: 'licao-59-diferenciabilidade' },
          { num: 60, titulo: 'Consolidação Trim 6', topicos: 'Workshop integrador', materia: 'derivadas', slug: 'licao-60-consolidacao-trim-6' },
        ],
        agrupamento: [
          { id: 'derivada-conceito', titulo: 'Aula A — Definição da derivada e regras básicas', licoesNums: [51, 52], cargaHoraria: 6 },
          { id: 'derivada-cadeia-implicita', titulo: 'Aula B — Regra da cadeia e derivada implícita', licoesNums: [53, 54], cargaHoraria: 6 },
          { id: 'derivadas-superiores', titulo: 'Aula C — Ordem superior, inversa e aproximação linear', licoesNums: [55, 56, 57], cargaHoraria: 9 },
          { id: 'taxas-suavidade', titulo: 'Aula D — Taxas relacionadas + suavidade', licoesNums: [58, 59, 60], cargaHoraria: 9 },
        ],
      },
      {
        num: 7,
        titulo: 'Trimestre 7 — Aplicações da Derivada',
        foco:
          'Otimização, taxa relacionada, esboço de gráficos, Taylor introdutório.',
        aulas: [
          { num: 61, titulo: 'Máximos e mínimos', topicos: 'Pontos críticos, teste 1ª e 2ª deriv.', materia: 'aplicacoes-derivada', slug: 'licao-61-maximos-minimos' },
          { num: 62, titulo: 'Otimização aplicada', topicos: 'Problemas reais', materia: 'aplicacoes-derivada', slug: 'licao-62-otimizacao' },
          { num: 63, titulo: 'Esboço de gráficos', topicos: 'Análise sistemática', materia: 'aplicacoes-derivada', slug: 'licao-63-esboco-graficos' },
          { num: 64, titulo: 'Regra de L\'Hôpital', topicos: '0/0, ∞/∞', materia: 'aplicacoes-derivada', slug: 'licao-64-l-hopital' },
          { num: 65, titulo: 'Polinômio de Taylor', topicos: 'Aproximação polinomial', materia: 'aplicacoes-derivada', slug: 'licao-65-taylor' },
          { num: 66, titulo: 'Concavidade e inflexão', topicos: 'f\'\'>0 convexa', materia: 'aplicacoes-derivada', slug: 'licao-66-concavidade' },
          { num: 67, titulo: 'Análise marginal em economia', topicos: 'Custo, receita, lucro marginal', materia: 'aplicacoes-derivada', slug: 'licao-67-economia-derivadas' },
          { num: 68, titulo: 'Movimento e cinemática', topicos: 'v=s\', a=v\'', materia: 'aplicacoes-derivada', slug: 'licao-68-cinematica' },
          { num: 69, titulo: 'Newton-Raphson', topicos: 'Iteração via derivada', materia: 'aplicacoes-derivada', slug: 'licao-69-newton-raphson' },
          { num: 70, titulo: 'Consolidação Trim 7', topicos: 'Workshop integrador', materia: 'aplicacoes-derivada', slug: 'licao-70-consolidacao-trim-7' },
        ],
        agrupamento: [
          { id: 'maximos-otimizacao', titulo: 'Aula A — Máximos, mínimos e otimização', licoesNums: [61, 62, 63], cargaHoraria: 9 },
          { id: 'l-hopital-taylor', titulo: 'Aula B — L\'Hôpital e Taylor', licoesNums: [64, 65, 66], cargaHoraria: 9 },
          { id: 'aplicacoes-economia', titulo: 'Aula C — Análise marginal e cinemática', licoesNums: [67, 68], cargaHoraria: 6 },
          { id: 'newton-sintese', titulo: 'Aula D — Newton-Raphson + síntese', licoesNums: [69, 70], cargaHoraria: 6 },
        ],
      },
      {
        num: 8,
        titulo: 'Trimestre 8 — Estatística Descritiva e Probabilidade',
        foco:
          'Distribuições, normal, Teorema Central do Limite intuitivo.',
        aulas: [
          { num: 71, titulo: 'Medidas centrais: média, mediana, moda', topicos: 'Resumo numérico', materia: 'estatistica-descritiva', slug: 'licao-71-medidas-centrais' },
          { num: 72, titulo: 'Variância e desvio padrão', topicos: 'Dispersão', materia: 'estatistica-descritiva', slug: 'licao-72-variancia' },
          { num: 73, titulo: 'Quartis, percentis, boxplot', topicos: 'IQR, outliers', materia: 'estatistica-descritiva', slug: 'licao-73-quartis' },
          { num: 74, titulo: 'Variável aleatória discreta', topicos: 'E[X], Var[X]', materia: 'estatistica-descritiva', slug: 'licao-74-va-discreta' },
          { num: 75, titulo: 'Distribuição binomial', topicos: 'n ensaios', materia: 'estatistica-descritiva', slug: 'licao-75-binomial' },
          { num: 76, titulo: 'Distribuição normal', topicos: 'Curva sino, 68-95-99,7', materia: 'estatistica-descritiva', slug: 'licao-76-normal' },
          { num: 77, titulo: 'Teorema Central do Limite', topicos: 'Por que normal aparece', materia: 'estatistica-descritiva', slug: 'licao-77-tcl' },
          { num: 78, titulo: 'Correlação e regressão linear', topicos: 'r, OLS', materia: 'estatistica-descritiva', slug: 'licao-78-correlacao' },
          { num: 79, titulo: 'Probabilidade condicional + Bayes (aprofund.)', topicos: 'Diagnóstico, filtro', materia: 'estatistica-descritiva', slug: 'licao-79-bayes-aprofundado' },
          { num: 80, titulo: 'Consolidação Trim 8', topicos: 'Workshop integrador', materia: 'estatistica-descritiva', slug: 'licao-80-consolidacao-trim-8' },
        ],
        agrupamento: [
          { id: 'estatistica-descritiva', titulo: 'Aula A — Estatística descritiva', licoesNums: [71, 72, 73], cargaHoraria: 9 },
          { id: 'va-binomial', titulo: 'Aula B — Variável aleatória e distribuição binomial', licoesNums: [74, 75], cargaHoraria: 6 },
          { id: 'normal-tcl', titulo: 'Aula C — Normal e Teorema Central do Limite', licoesNums: [76, 77], cargaHoraria: 6 },
          { id: 'correlacao-bayes', titulo: 'Aula D — Correlação, regressão, Bayes + síntese', licoesNums: [78, 79, 80], cargaHoraria: 9 },
        ],
      },
    ],
  },
  {
    num: 3,
    titulo: 'Ano 3 — Integral, EDOs, Inferência, Álgebra Linear',
    idade: '17 anos',
    equivalencia: 'JP Math III + Math C · DE Klasse 12 LK · SG JC 2 (H2 Math final)',
    resumo:
      'A síntese: cálculo integral, EDOs (com a ponte para a EDP de Black-Scholes), inferência estatística e álgebra linear introdutória. Quem termina o Ano 3 está pronto para Cálculo I em qualquer engenharia de federal.',
    trimestres: [
      {
        num: 9,
        titulo: 'Trimestre 9 — Cálculo Integral',
        foco:
          'Antiderivada, integral definida, TFC, técnicas, aplicações.',
        aulas: [
          { num: 81, titulo: 'Antiderivada e integral indefinida', topicos: 'F\'=f, constante de integração', materia: 'integral', slug: 'licao-81-antiderivada' },
          { num: 82, titulo: 'Integral definida e área', topicos: 'Soma de Riemann', materia: 'integral', slug: 'licao-82-integral-definida' },
          { num: 83, titulo: 'Teorema Fundamental do Cálculo', topicos: 'TFC1 e TFC2', materia: 'integral', slug: 'licao-83-tfc' },
          { num: 84, titulo: 'Técnica de substituição', topicos: 'u-substitution', materia: 'integral', slug: 'licao-84-substituicao' },
          { num: 85, titulo: 'Integração por partes', topicos: '∫u dv = uv - ∫v du', materia: 'integral', slug: 'licao-85-por-partes' },
          { num: 86, titulo: 'Frações parciais', topicos: 'Decomposição racional', materia: 'integral', slug: 'licao-86-fracoes-parciais' },
          { num: 87, titulo: 'Integrais trigonométricas', topicos: 'Identidades + substituição', materia: 'integral', slug: 'licao-87-integrais-trig' },
          { num: 88, titulo: 'Aplicações: área entre curvas', topicos: '∫(f-g)dx', materia: 'integral', slug: 'licao-88-area-curvas' },
          { num: 89, titulo: 'Aplicações: volume por discos', topicos: 'Sólidos de revolução', materia: 'integral', slug: 'licao-89-volume' },
          { num: 90, titulo: 'Consolidação Trim 9', topicos: 'Workshop integrador', materia: 'integral', slug: 'licao-90-consolidacao-trim-9' },
        ],
        agrupamento: [
          { id: 'antiderivada-tfc', titulo: 'Aula A — Antiderivada, integral definida e TFC', licoesNums: [81, 82, 83], cargaHoraria: 9 },
          { id: 'tecnicas-integracao', titulo: 'Aula B — Substituição, partes, frações parciais', licoesNums: [84, 85, 86], cargaHoraria: 9 },
          { id: 'integrais-trig', titulo: 'Aula C — Integrais trigonométricas', licoesNums: [87], cargaHoraria: 3 },
          { id: 'aplicacoes-integral', titulo: 'Aula D — Área, volume + síntese', licoesNums: [88, 89, 90], cargaHoraria: 9 },
        ],
      },
      {
        num: 10,
        titulo: 'Trimestre 10 — Equações Diferenciais',
        foco:
          'EDOs 1.ª e 2.ª ordem, modelos físicos, métodos numéricos básicos.',
        aulas: [
          { num: 91, titulo: 'Introdução a EDOs', topicos: 'Modelagem, classificação', materia: 'edo', slug: 'licao-91-edo-intro' },
          { num: 92, titulo: 'EDOs separáveis', topicos: 'Integrar lados', materia: 'edo', slug: 'licao-92-edo-separavel' },
          { num: 93, titulo: 'EDOs lineares 1ª ordem', topicos: 'Fator integrante', materia: 'edo', slug: 'licao-93-edo-linear-1' },
          { num: 94, titulo: 'Crescimento exp. e logístico', topicos: 'Populações', materia: 'edo', slug: 'licao-94-edo-populacional' },
          { num: 95, titulo: 'EDOs lineares 2ª ordem coef. constantes', topicos: 'Equação característica', materia: 'edo', slug: 'licao-95-edo-2-ordem' },
          { num: 96, titulo: 'Vibrações: massa-mola', topicos: 'Amortecimento', materia: 'edo', slug: 'licao-96-vibracoes' },
          { num: 97, titulo: 'Circuitos RLC', topicos: 'Análoga vibracional', materia: 'edo', slug: 'licao-97-rlc' },
          { num: 98, titulo: 'Método de Euler (numérico)', topicos: 'Implementação Python', materia: 'edo', slug: 'licao-98-euler-numerico' },
          { num: 99, titulo: 'Lei de Newton resfriamento', topicos: 'Modelo exponencial', materia: 'edo', slug: 'licao-99-newton-resfriamento' },
          { num: 100, titulo: 'Consolidação Trim 10', topicos: 'Workshop integrador', materia: 'edo', slug: 'licao-100-consolidacao-trim-10' },
        ],
        agrupamento: [
          { id: 'edo-introducao', titulo: 'Aula A — Introdução e EDOs separáveis/lineares 1ª ordem', licoesNums: [91, 92, 93], cargaHoraria: 9 },
          { id: 'edo-modelos', titulo: 'Aula B — Crescimento, decaimento, Newton', licoesNums: [94, 99], cargaHoraria: 6 },
          { id: 'edo-2-ordem', titulo: 'Aula C — EDOs 2ª ordem: vibrações e RLC', licoesNums: [95, 96, 97], cargaHoraria: 9 },
          { id: 'numerico-sintese', titulo: 'Aula D — Método de Euler + síntese', licoesNums: [98, 100], cargaHoraria: 6 },
        ],
      },
      {
        num: 11,
        titulo: 'Trimestre 11 — Estatística Inferencial e Regressão',
        foco:
          'Intervalos de confiança, testes de hipótese, regressão linear.',
        aulas: [
          { num: 101, titulo: 'Amostragem e estimação', topicos: 'Estimadores, viés', materia: 'inferencia', slug: 'licao-101-amostragem' },
          { num: 102, titulo: 'Intervalo de confiança para média', topicos: 'IC 95%, 99%', materia: 'inferencia', slug: 'licao-102-ic-media' },
          { num: 103, titulo: 'Teste de hipótese', topicos: 'H0/H1, p-valor', materia: 'inferencia', slug: 'licao-103-teste-hipotese' },
          { num: 104, titulo: 'Teste z e teste t', topicos: 'σ conhecido vs estimado', materia: 'inferencia', slug: 'licao-104-teste-z-t' },
          { num: 105, titulo: 'Regressão linear simples', topicos: 'OLS, R²', materia: 'inferencia', slug: 'licao-105-regressao-simples' },
          { num: 106, titulo: 'Regressão múltipla', topicos: 'Solução matricial', materia: 'inferencia', slug: 'licao-106-regressao-multipla' },
          { num: 107, titulo: 'ANOVA', topicos: 'Comparar grupos', materia: 'inferencia', slug: 'licao-107-anova' },
          { num: 108, titulo: 'Qui-quadrado', topicos: 'Independência, aderência', materia: 'inferencia', slug: 'licao-108-qui-quadrado' },
          { num: 109, titulo: 'Estatística bayesiana intro', topicos: 'Prior, posterior, MAP', materia: 'inferencia', slug: 'licao-109-bayesiana-intro' },
          { num: 110, titulo: 'Consolidação Trim 11', topicos: 'Workshop integrador', materia: 'inferencia', slug: 'licao-110-consolidacao-trim-11' },
        ],
        agrupamento: [
          { id: 'amostragem-ic', titulo: 'Aula A — Amostragem e intervalo de confiança', licoesNums: [101, 102], cargaHoraria: 6 },
          { id: 'teste-hipotese', titulo: 'Aula B — Teste de hipótese (z, t)', licoesNums: [103, 104], cargaHoraria: 6 },
          { id: 'regressao-anova', titulo: 'Aula C — Regressão linear simples e múltipla, ANOVA', licoesNums: [105, 106, 107], cargaHoraria: 9 },
          { id: 'qui-bayes-sintese', titulo: 'Aula D — Qui-quadrado, Bayes intro + síntese', licoesNums: [108, 109, 110], cargaHoraria: 9 },
        ],
      },
      {
        num: 12,
        titulo: 'Trimestre 12 — Álgebra Linear Avançada e Síntese',
        foco:
          'Espaços vetoriais, autovalores, PCA, integração final do programa.',
        aulas: [
          { num: 111, titulo: 'Espaços vetoriais', topicos: 'Subespaços, base, dimensão', materia: 'algebra-linear', slug: 'licao-111-espacos-vetoriais' },
          { num: 112, titulo: 'Transformações lineares', topicos: 'Matriz associada', materia: 'algebra-linear', slug: 'licao-112-transformacoes-lineares' },
          { num: 113, titulo: 'Núcleo e imagem', topicos: 'Teorema do núcleo e imagem', materia: 'algebra-linear', slug: 'licao-113-nucleo-imagem' },
          { num: 114, titulo: 'Autovalores e autovetores', topicos: 'Polinômio característico', materia: 'algebra-linear', slug: 'licao-114-autovalores' },
          { num: 115, titulo: 'Diagonalização', topicos: 'A=PDP^-1', materia: 'algebra-linear', slug: 'licao-115-diagonalizacao' },
          { num: 116, titulo: 'Matrizes simétricas e ortogonais', topicos: 'Espectral', materia: 'algebra-linear', slug: 'licao-116-matrizes-especiais' },
          { num: 117, titulo: 'SVD', topicos: 'A=UΣV^T', materia: 'algebra-linear', slug: 'licao-117-svd' },
          { num: 118, titulo: 'PCA', topicos: 'Redução de dimensionalidade', materia: 'algebra-linear', slug: 'licao-118-pca' },
          { num: 119, titulo: 'Síntese: Black-Scholes revisited', topicos: 'EM converge', materia: 'algebra-linear', slug: 'licao-119-bs-sintese' },
          { num: 120, titulo: 'Workshop final do Programa', topicos: '40 problemas Anos 1-3', materia: 'algebra-linear', slug: 'licao-120-workshop-final' },
        ],
        agrupamento: [
          { id: 'espacos-vetoriais', titulo: 'Aula A — Espaços vetoriais e transformações', licoesNums: [111, 112, 113], cargaHoraria: 9 },
          { id: 'autovalores-diagonalizacao', titulo: 'Aula B — Autovalores, diagonalização, simétricas/ortogonais', licoesNums: [114, 115, 116], cargaHoraria: 9 },
          { id: 'svd-pca', titulo: 'Aula C — SVD e PCA', licoesNums: [117, 118], cargaHoraria: 6 },
          { id: 'sintese-final', titulo: 'Aula D — Síntese (Black-Scholes) + Workshop final', licoesNums: [119, 120], cargaHoraria: 6 },
        ],
      },
    ],
  },
]

/**
 * Lista linear de todas as 120 lições, em ordem (Ano 1 Trim 1 Lição 1 → Ano 3 Trim 12 Lição 120).
 * Usada para navegação prev/next na shell de cada lição.
 */
export const LICOES_FLAT: Licao[] = PROGRAMA_EM.flatMap((ano) =>
  ano.trimestres.flatMap((trim) => trim.aulas),
)

/** Materias usadas em cada ano (ordem fixa para tabs). */
export function materiasDoAno(ano: Ano): MateriaEM[] {
  const set = new Set<MateriaEM>()
  for (const t of ano.trimestres) for (const a of t.aulas) set.add(a.materia)
  return Array.from(set)
}

/** Aulas filtradas por matéria, mantendo ordem por num. */
export function aulasPorMateria(ano: Ano, materia: MateriaEM): Aula[] {
  const out: Aula[] = []
  for (const t of ano.trimestres) for (const a of t.aulas) {
    if (a.materia === materia) out.push(a)
  }
  return out.sort((a, b) => a.num - b.num)
}
