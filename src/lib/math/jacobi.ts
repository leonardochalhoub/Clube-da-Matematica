/**
 * Método de Jacobi — resolve sistemas lineares Ax = b iterativamente.
 *
 * Iteração:  x^(k+1)_i = (1/aᵢᵢ) · ( bᵢ − Σⱼ≠ᵢ aᵢⱼ · x^(k)_j )
 *
 * Convergência: garantida se A é estritamente diagonal dominante,
 *   ou seja, |aᵢᵢ| > Σⱼ≠ᵢ |aᵢⱼ| para todo i.
 *
 * Característica: usa apenas valores da iteração ANTERIOR (x^(k)).
 */

export interface JacobiEntrada {
  A: number[][]
  b: number[]
  chuteInicial?: number[]
  tolerancia: number
  maxIteracoes?: number
}

export interface JacobiIteracao {
  i: number
  x: number[]
  residuoNorma: number
}

export type JacobiMotivo = 'convergiu' | 'maxIteracoes' | 'naoQuadrada' | 'diagonalZero'

export interface JacobiResultado {
  solucao: number[]
  iteracoes: JacobiIteracao[]
  convergiu: boolean
  motivo: JacobiMotivo
  residuoFinal: number
}

const PADRAO_MAX_ITER = 200

/** Norma infinito do resíduo r = b − Ax. */
export function normaResiduo(A: number[][], b: number[], x: number[]): number {
  const n = b.length
  let max = 0
  for (let i = 0; i < n; i++) {
    let soma = b[i]!
    for (let j = 0; j < n; j++) soma -= A[i]![j]! * x[j]!
    if (Math.abs(soma) > max) max = Math.abs(soma)
  }
  return max
}

/** Verifica se a matriz A é estritamente diagonal dominante. */
export function diagonalDominante(A: number[][]): boolean {
  const n = A.length
  for (let i = 0; i < n; i++) {
    const diag = Math.abs(A[i]![i]!)
    let soma = 0
    for (let j = 0; j < n; j++) {
      if (j !== i) soma += Math.abs(A[i]![j]!)
    }
    if (diag <= soma) return false
  }
  return true
}

export function jacobi(entrada: JacobiEntrada): JacobiResultado {
  const { A, b, tolerancia } = entrada
  const n = b.length
  const maxIter = entrada.maxIteracoes ?? PADRAO_MAX_ITER

  if (A.length !== n || A.some((row) => row.length !== n)) {
    return {
      solucao: [],
      iteracoes: [],
      convergiu: false,
      motivo: 'naoQuadrada',
      residuoFinal: NaN,
    }
  }
  for (let i = 0; i < n; i++) {
    if (A[i]![i]! === 0) {
      return {
        solucao: [],
        iteracoes: [],
        convergiu: false,
        motivo: 'diagonalZero',
        residuoFinal: NaN,
      }
    }
  }

  let x = entrada.chuteInicial ? [...entrada.chuteInicial] : new Array(n).fill(0)
  const xNovo = new Array<number>(n).fill(0)
  const iteracoes: JacobiIteracao[] = []

  for (let k = 0; k < maxIter; k++) {
    for (let i = 0; i < n; i++) {
      let soma = b[i]!
      for (let j = 0; j < n; j++) {
        if (j !== i) soma -= A[i]![j]! * x[j]!
      }
      xNovo[i] = soma / A[i]![i]!
    }

    const res = normaResiduo(A, b, xNovo)
    iteracoes.push({ i: k, x: [...xNovo], residuoNorma: res })

    if (res <= tolerancia) {
      return {
        solucao: [...xNovo],
        iteracoes,
        convergiu: true,
        motivo: 'convergiu',
        residuoFinal: res,
      }
    }

    x = [...xNovo]
  }

  return {
    solucao: [...x],
    iteracoes,
    convergiu: false,
    motivo: 'maxIteracoes',
    residuoFinal: normaResiduo(A, b, x),
  }
}
