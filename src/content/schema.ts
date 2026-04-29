import { z } from 'zod'

/**
 * Schema das peças de conteúdo do Clube da Matemática.
 *
 * Frontmatter MDX leve (metadados). As 6 portas (formal +
 * idades 5/10/15/25/40) e o exercício interativo vivem como
 * componentes React no corpo do MDX.
 *
 * Categorias modeladas a partir das grades de engenharia
 * (USP/ITA/MIT) — ver docs/curriculos/.
 */
export const conteudoSchema = z.object({
  titulo: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  categoria: z.enum([
    'calculo-1',
    'calculo-2',
    'calculo-3',
    'calculo-4',
    'algebra-linear',
    'edo',
    'edp',
    'fisica-1',
    'fisica-2',
    'fisica-3',
    'estatistica',
    'metodos-numericos',
    'financas-quantitativas',
  ]),
  subcategoria: z.string().min(2),
  descricao: z.string().min(20).max(280),
  ordem: z.number().int().nonnegative(),
  publicado: z.boolean(),
  tags: z.array(z.string()).default([]),
  prerrequisitos: z.array(z.string()).default([]),
  autores: z.array(z.string()).default(['Clube da Matemática']),
  atualizadoEm: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** Disciplinas de engenharia onde esse conteúdo é usado. */
  usadoEm: z.array(z.string()).default([]),
})

export type Conteudo = z.infer<typeof conteudoSchema>

export const CATEGORIAS_LABEL: Record<Conteudo['categoria'], string> = {
  'calculo-1': 'Cálculo 1',
  'calculo-2': 'Cálculo 2',
  'calculo-3': 'Cálculo 3',
  'calculo-4': 'Cálculo 4',
  'algebra-linear': 'Álgebra Linear',
  edo: 'Equações Diferenciais Ordinárias',
  edp: 'Equações Diferenciais Parciais',
  'fisica-1': 'Física 1 — Mecânica',
  'fisica-2': 'Física 2 — Ondas e Termo',
  'fisica-3': 'Física 3 — Eletromagnetismo',
  estatistica: 'Estatística e Probabilidade',
  'metodos-numericos': 'Métodos Numéricos',
  'financas-quantitativas': 'Finanças Quantitativas',
}

export const CATEGORIAS_DESCRICAO: Record<Conteudo['categoria'], string> = {
  'calculo-1': 'Limites, derivadas, integrais — uma variável real.',
  'calculo-2': 'Derivadas parciais, gradiente, integrais múltiplas.',
  'calculo-3': 'Cálculo vetorial — Green, Stokes, divergência.',
  'calculo-4': 'Sequências, séries, séries de Fourier.',
  'algebra-linear': 'Matrizes, espaços vetoriais, autovalores e autovetores.',
  edo: 'Equações diferenciais ordinárias — vibrações, circuitos, decaimento.',
  edp: 'Equação do calor, da onda, de Laplace — separação de variáveis.',
  'fisica-1': 'Mecânica clássica — leis de Newton, energia, momento.',
  'fisica-2': 'Ondas, fluidos, termodinâmica.',
  'fisica-3': 'Eletromagnetismo — equações de Maxwell.',
  estatistica: 'Probabilidade, distribuições, inferência, regressão.',
  'metodos-numericos': 'Algoritmos que o computador realmente executa.',
  'financas-quantitativas': 'Black-Scholes, derivativos, gestão de risco.',
}

export const IDADES_PADRAO = ['formal', '5', '10', '15', '25', '40', 'pratica'] as const
export type Idade = (typeof IDADES_PADRAO)[number]

export const IDADE_LABEL: Record<Idade, string> = {
  formal: 'Formal',
  '5': '5 anos',
  '10': '10 anos',
  '15': '15 anos',
  '25': '25 anos',
  '40': '40 anos',
  pratica: 'Prática',
}

export const IDADE_DESCRICAO: Record<Idade, string> = {
  formal: 'Notação rigorosa, derivação completa, hipóteses',
  '5': 'Analogia concreta — figurinhas, brinquedos',
  '10': 'Exemplo cotidiano — jogos, mesada',
  '15': 'Curiosidade jovem — fórmulas familiares, sem medo',
  '25': 'Estudante de engenharia — fórmula + intuição + cross-domínio',
  '40': 'Profissional — crítica do modelo + números reais + uso operacional',
  pratica: 'Cenários reais com dados de mercado e cálculos passo a passo',
}
