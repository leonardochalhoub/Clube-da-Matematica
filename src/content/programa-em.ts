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

export interface Aula {
  num: number
  titulo: string
  topicos: string
  materia: MateriaEM
  /** Slug do MDX se já publicada. */
  slug?: string
}

export interface Trimestre {
  num: number
  titulo: string
  foco: string
  aulas: Aula[]
}

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
          { num: 1, titulo: 'Conjuntos, intervalos, notação', topicos: 'ℕ, ℤ, ℚ, ℝ, intervalos, ∩, ∪, complemento', materia: 'funcoes', slug: 'aula-01-conjuntos-intervalos' },
          { num: 2, titulo: 'Funções: definição, domínio, imagem', topicos: 'f: A→B, gráfico cartesiano, sobrejetora/injetora', materia: 'funcoes', slug: 'aula-02-funcoes' },
          { num: 3, titulo: 'Funções afins (1.º grau)', topicos: 'Inclinação como taxa de variação constante', materia: 'funcoes', slug: 'aula-03-afim' },
          { num: 4, titulo: 'Funções quadráticas', topicos: 'Vértice, raízes, eixo de simetria, Bhaskara', materia: 'funcoes', slug: 'aula-04-quadratica' },
          { num: 5, titulo: 'Composição e função inversa', topicos: 'f∘g, f⁻¹, condição de invertibilidade', materia: 'funcoes', slug: 'aula-05-composicao-inversa' },
          { num: 6, titulo: 'Funções exponenciais', topicos: 'a^x, número e via juros compostos', materia: 'funcoes', slug: 'aula-06-exponencial' },
          { num: 7, titulo: 'Funções logarítmicas', topicos: 'log_a x como inversa de a^x; ln, log decimal', materia: 'funcoes', slug: 'aula-07-logaritmo' },
          { num: 8, titulo: 'Crescimento e decaimento', topicos: 'População, decaimento radioativo, juros compostos', materia: 'funcoes', slug: 'aula-08-crescimento' },
          { num: 9, titulo: 'TAXA DE VARIAÇÃO MÉDIA', topicos: 'Δy/Δx, interpretação geométrica e física — porta de entrada do cálculo', materia: 'pre-calculo', slug: 'aula-09-taxa-variacao' },
          { num: 10, titulo: 'Consolidação Trim 1', topicos: 'Workshop integrador, problemas estilo ENEM/EJU/Abitur', materia: 'pre-calculo', slug: 'aula-10-consolidacao-trim-1' },
        ],
      },
      {
        num: 2,
        titulo: 'Trimestre 2 — Trigonometria e Sequências',
        foco:
          'Ferramentas trigonométricas + introdução à ideia de limite via sequências.',
        aulas: [
          { num: 11, titulo: 'Razões trigonométricas no triângulo retângulo', topicos: 'sen, cos, tan, aplicações em medição', materia: 'trigonometria', slug: 'aula-11-trig-triangulo' },
          { num: 12, titulo: 'Círculo trigonométrico', topicos: 'Radianos, identidades fundamentais', materia: 'trigonometria', slug: 'aula-12-circulo-trigonometrico' },
          { num: 13, titulo: 'Funções trigonométricas', topicos: 'Periodicidade, gráficos de sin x, cos x, tan x', materia: 'trigonometria', slug: 'aula-13-funcoes-trigonometricas' },
          { num: 14, titulo: 'Equações e inequações trigonométricas', topicos: 'sin x = 1/2, etc.', materia: 'trigonometria', slug: 'aula-14-equacoes-trigonometricas' },
          { num: 15, titulo: 'Lei dos senos e cossenos', topicos: 'Triângulos não-retângulos, área via 1/2 ab sin C', materia: 'trigonometria', slug: 'aula-15-leis-senos-cossenos' },
          { num: 16, titulo: 'Sequências numéricas', topicos: '(aₙ), recorrência, monotonia, limitação', materia: 'sequencias', slug: 'aula-16-sequencias' },
          { num: 17, titulo: 'Progressões aritméticas (PA)', topicos: 'aₙ = a₁ + (n−1)r, soma de termos', materia: 'sequencias', slug: 'aula-17-pa' },
          { num: 18, titulo: 'Progressões geométricas (PG)', topicos: 'aₙ = a₁q^(n−1), soma finita e infinita', materia: 'sequencias', slug: 'aula-18-pg' },
          { num: 19, titulo: 'LIMITE INTUITIVO DE SEQUÊNCIA', topicos: '"Para onde vai 1/n?" — ponte explícita pra Trim 5', materia: 'sequencias', slug: 'aula-19-limite-intuitivo' },
          { num: 20, titulo: 'Consolidação Trim 2', topicos: 'Problemas integrados', materia: 'sequencias', slug: 'aula-20-consolidacao-trim-2' },
        ],
      },
      {
        num: 3,
        titulo: 'Trimestre 3 — Geometria Analítica e Vetores 2D',
        foco:
          'Linguagem geométrica das funções + vetores como objetos novos.',
        aulas: [
          { num: 21, titulo: 'Plano cartesiano: distância, ponto médio', topicos: 'd(P,Q), divisão de segmento', materia: 'geometria-analitica', slug: 'aula-21-plano-cartesiano' },
          { num: 22, titulo: 'Equação da reta', topicos: 'Forma geral, reduzida, paramétrica', materia: 'geometria-analitica', slug: 'aula-22-equacao-reta' },
          { num: 23, titulo: 'Posição relativa de retas', topicos: 'Paralelismo, perpendicularidade, ângulo', materia: 'geometria-analitica', slug: 'aula-23-posicao-relativa-retas' },
          { num: 24, titulo: 'Equação da circunferência', topicos: '(x−a)² + (y−b)² = r²', materia: 'geometria-analitica', slug: 'aula-24-circunferencia' },
          { num: 25, titulo: 'Cônicas: elipse, parábola, hipérbole', topicos: 'Definições por foco-diretriz e equações', materia: 'geometria-analitica', slug: 'aula-25-conicas' },
          { num: 26, titulo: 'Vetores no plano', topicos: 'Representação, soma, produto por escalar', materia: 'vetores', slug: 'aula-26-vetores-plano' },
          { num: 27, titulo: 'Produto escalar', topicos: 'u·v, ângulo entre vetores, projeção', materia: 'vetores', slug: 'aula-27-produto-escalar' },
          { num: 28, titulo: 'Aplicações de vetores em física', topicos: 'Forças, deslocamento, decomposição', materia: 'vetores', slug: 'aula-28-aplicacoes-vetores-fisica' },
          { num: 29, titulo: 'Sistemas lineares 2x2 e 3x3', topicos: 'Substituição, escalonamento básico', materia: 'vetores', slug: 'aula-29-sistemas-lineares' },
          { num: 30, titulo: 'Consolidação Trim 3', topicos: 'Síntese geométrica + analítica', materia: 'vetores', slug: 'aula-30-consolidacao-trim-3' },
        ],
      },
      {
        num: 4,
        titulo: 'Trimestre 4 — Matrizes, Determinantes, Combinatória',
        foco: 'Estruturas algébricas + ponte para probabilidade.',
        aulas: [
          { num: 31, titulo: 'Introdução a matrizes', topicos: 'Notação, dimensões, igualdade', materia: 'matrizes' },
          { num: 32, titulo: 'Operações com matrizes', topicos: 'Soma, escalar, produto matricial', materia: 'matrizes' },
          { num: 33, titulo: 'Matriz transposta, identidade, inversa', topicos: 'A^T, I, A⁻¹', materia: 'matrizes' },
          { num: 34, titulo: 'Determinantes 2x2 e 3x3', topicos: 'Sarrus, propriedades', materia: 'matrizes' },
          { num: 35, titulo: 'Resolução de sistemas via matrizes', topicos: 'Cramer, Gauss básico', materia: 'matrizes' },
          { num: 36, titulo: 'Princípio fundamental da contagem', topicos: 'n₁·n₂·...', materia: 'combinatoria' },
          { num: 37, titulo: 'Permutações e arranjos', topicos: 'n!, A(n,p)', materia: 'combinatoria' },
          { num: 38, titulo: 'Combinações', topicos: 'C(n,p), triângulo de Pascal', materia: 'combinatoria' },
          { num: 39, titulo: 'Probabilidade discreta básica', topicos: 'P(A) = casos favoráveis / casos possíveis', materia: 'probabilidade' },
          { num: 40, titulo: 'Consolidação anual', topicos: 'Workshop integrador Ano 1', materia: 'probabilidade' },
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
        aulas: Array.from({ length: 10 }).map((_, i) => ({
          num: 41 + i,
          titulo: `Aula ${41 + i} — em desenvolvimento`,
          topicos: 'Conteúdo detalhado em docs/curriculos/PROGRAMA-JAP-DE-SG.md',
          materia: 'limites' as MateriaEM,
        })),
      },
      {
        num: 6,
        titulo: 'Trimestre 6 — Derivadas: Conceito e Regras',
        foco:
          'Definição via limite, regras (cadeia, produto, quociente), derivadas notáveis.',
        aulas: Array.from({ length: 10 }).map((_, i) => ({
          num: 51 + i,
          titulo: `Aula ${51 + i} — em desenvolvimento`,
          topicos: 'Conteúdo detalhado em docs/curriculos/PROGRAMA-JAP-DE-SG.md',
          materia: 'derivadas' as MateriaEM,
        })),
      },
      {
        num: 7,
        titulo: 'Trimestre 7 — Aplicações da Derivada',
        foco:
          'Otimização, taxa relacionada, esboço de gráficos, Taylor introdutório.',
        aulas: Array.from({ length: 10 }).map((_, i) => ({
          num: 61 + i,
          titulo: `Aula ${61 + i} — em desenvolvimento`,
          topicos: 'Conteúdo detalhado em docs/curriculos/PROGRAMA-JAP-DE-SG.md',
          materia: 'aplicacoes-derivada' as MateriaEM,
        })),
      },
      {
        num: 8,
        titulo: 'Trimestre 8 — Estatística Descritiva e Probabilidade',
        foco:
          'Distribuições, normal, Teorema Central do Limite intuitivo.',
        aulas: Array.from({ length: 10 }).map((_, i) => ({
          num: 71 + i,
          titulo: `Aula ${71 + i} — em desenvolvimento`,
          topicos: 'Conteúdo detalhado em docs/curriculos/PROGRAMA-JAP-DE-SG.md',
          materia: 'estatistica-descritiva' as MateriaEM,
        })),
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
        aulas: Array.from({ length: 10 }).map((_, i) => ({
          num: 81 + i,
          titulo: `Aula ${81 + i} — em desenvolvimento`,
          topicos: 'Conteúdo detalhado em docs/curriculos/PROGRAMA-JAP-DE-SG.md',
          materia: 'integral' as MateriaEM,
        })),
      },
      {
        num: 10,
        titulo: 'Trimestre 10 — Equações Diferenciais',
        foco:
          'EDOs 1.ª e 2.ª ordem, modelos físicos, métodos numéricos básicos.',
        aulas: Array.from({ length: 10 }).map((_, i) => ({
          num: 91 + i,
          titulo: `Aula ${91 + i} — em desenvolvimento`,
          topicos: 'Conteúdo detalhado em docs/curriculos/PROGRAMA-JAP-DE-SG.md',
          materia: 'edo' as MateriaEM,
        })),
      },
      {
        num: 11,
        titulo: 'Trimestre 11 — Estatística Inferencial e Regressão',
        foco:
          'Intervalos de confiança, testes de hipótese, regressão linear.',
        aulas: Array.from({ length: 10 }).map((_, i) => ({
          num: 101 + i,
          titulo: `Aula ${101 + i} — em desenvolvimento`,
          topicos: 'Conteúdo detalhado em docs/curriculos/PROGRAMA-JAP-DE-SG.md',
          materia: 'inferencia' as MateriaEM,
        })),
      },
      {
        num: 12,
        titulo: 'Trimestre 12 — Álgebra Linear Avançada e Síntese',
        foco:
          'Espaços vetoriais, autovalores, PCA, integração final do programa.',
        aulas: Array.from({ length: 10 }).map((_, i) => ({
          num: 111 + i,
          titulo: `Aula ${111 + i} — em desenvolvimento`,
          topicos: 'Conteúdo detalhado em docs/curriculos/PROGRAMA-JAP-DE-SG.md',
          materia: 'algebra-linear' as MateriaEM,
        })),
      },
    ],
  },
]

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
