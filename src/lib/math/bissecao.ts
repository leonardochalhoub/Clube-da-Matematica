/**
 * Método da Bisseção — encontra raiz de f(x) = 0 em [a, b].
 *
 * Hipótese: f contínua em [a, b] e f(a)·f(b) < 0 (Bolzano garante raiz).
 * Convergência: linear; erro a cada iteração ≤ (b-a) / 2^n.
 *
 * Iterações máximas analiticamente conhecidas:
 *   n_min = ceil( log2( (b-a) / ε ) )
 */

export interface BissecaoEntrada {
  f: (x: number) => number
  a: number
  b: number
  tolerancia: number
  maxIteracoes?: number
}

export interface BissecaoIteracao {
  /** Índice da iteração (0-based). */
  i: number
  /** Extremo inferior do intervalo nessa iteração. */
  a: number
  /** Extremo superior do intervalo nessa iteração. */
  b: number
  /** Ponto médio. */
  m: number
  fa: number
  fb: number
  fm: number
  /** Erro estimado: (b - a) / 2. */
  erro: number
  /** Qual extremo foi substituído pela média ('a' ou 'b'). */
  substituido: 'a' | 'b'
}

export type BissecaoMotivo = 'convergiu' | 'maxIteracoes' | 'sinaisIguais' | 'raizExata'

export interface BissecaoResultado {
  raiz: number
  iteracoes: BissecaoIteracao[]
  convergiu: boolean
  motivo: BissecaoMotivo
  erroFinal: number
}

const PADRAO_MAX_ITER = 100

/**
 * Quantidade mínima teórica de iterações para atingir tolerância ε
 * num intervalo de comprimento (b-a):  n = ⌈log₂((b-a)/ε)⌉.
 */
export function iteracoesMinimas(a: number, b: number, tolerancia: number): number {
  if (tolerancia <= 0) return Infinity
  return Math.ceil(Math.log2((b - a) / tolerancia))
}

export function bissecao(entrada: BissecaoEntrada): BissecaoResultado {
  const { f, tolerancia } = entrada
  const maxIter = entrada.maxIteracoes ?? PADRAO_MAX_ITER
  let { a, b } = entrada

  if (a >= b) throw new Error(`intervalo inválido: a=${a} deve ser menor que b=${b}`)
  if (tolerancia <= 0) throw new Error(`tolerância deve ser positiva, recebido ${tolerancia}`)

  const fa0 = f(a)
  const fb0 = f(b)

  if (fa0 === 0) {
    return { raiz: a, iteracoes: [], convergiu: true, motivo: 'raizExata', erroFinal: 0 }
  }
  if (fb0 === 0) {
    return { raiz: b, iteracoes: [], convergiu: true, motivo: 'raizExata', erroFinal: 0 }
  }
  if (fa0 * fb0 > 0) {
    return {
      raiz: NaN,
      iteracoes: [],
      convergiu: false,
      motivo: 'sinaisIguais',
      erroFinal: NaN,
    }
  }

  const iteracoes: BissecaoIteracao[] = []
  let m = (a + b) / 2

  for (let i = 0; i < maxIter; i++) {
    const fa = f(a)
    const fb = f(b)
    m = (a + b) / 2
    const fm = f(m)
    const erro = (b - a) / 2

    let substituido: 'a' | 'b'
    if (fa * fm < 0) {
      substituido = 'b'
    } else {
      substituido = 'a'
    }

    iteracoes.push({ i, a, b, m, fa, fb, fm, erro, substituido })

    if (Math.abs(fm) <= tolerancia || erro <= tolerancia) {
      return {
        raiz: m,
        iteracoes,
        convergiu: true,
        motivo: 'convergiu',
        erroFinal: erro,
      }
    }

    if (substituido === 'a') {
      a = m
    } else {
      b = m
    }
  }

  return {
    raiz: m,
    iteracoes,
    convergiu: false,
    motivo: 'maxIteracoes',
    erroFinal: (b - a) / 2,
  }
}
