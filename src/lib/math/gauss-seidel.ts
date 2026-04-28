/**
 * Método de Gauss-Seidel — versão acelerada do Jacobi.
 *
 * Iteração: x^(k+1)_i = (1/aᵢᵢ) · ( bᵢ − Σⱼ<ᵢ aᵢⱼ · x^(k+1)_j − Σⱼ>ᵢ aᵢⱼ · x^(k)_j )
 *
 * Diferença vs. Jacobi: usa o valor JÁ ATUALIZADO de x_j para j < i na
 * mesma iteração k+1. Tipicamente converge em ~metade das iterações
 * de Jacobi (e usa metade da memória — não precisa de x_novo separado).
 *
 * Convergência: garantida se A é estritamente diagonal dominante OU
 * simétrica positiva-definida.
 */

import { normaResiduo, diagonalDominante } from './jacobi'

export { normaResiduo, diagonalDominante }

export interface GaussSeidelEntrada {
  A: number[][]
  b: number[]
  chuteInicial?: number[]
  tolerancia: number
  maxIteracoes?: number
}

export interface GaussSeidelIteracao {
  i: number
  x: number[]
  residuoNorma: number
}

export type GaussSeidelMotivo = 'convergiu' | 'maxIteracoes' | 'naoQuadrada' | 'diagonalZero'

export interface GaussSeidelResultado {
  solucao: number[]
  iteracoes: GaussSeidelIteracao[]
  convergiu: boolean
  motivo: GaussSeidelMotivo
  residuoFinal: number
}

const PADRAO_MAX_ITER = 200

export function gaussSeidel(entrada: GaussSeidelEntrada): GaussSeidelResultado {
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

  const x = entrada.chuteInicial ? [...entrada.chuteInicial] : new Array(n).fill(0)
  const iteracoes: GaussSeidelIteracao[] = []

  for (let k = 0; k < maxIter; k++) {
    for (let i = 0; i < n; i++) {
      let soma = b[i]!
      for (let j = 0; j < n; j++) {
        if (j !== i) soma -= A[i]![j]! * x[j]!
      }
      x[i] = soma / A[i]![i]!
    }

    const res = normaResiduo(A, b, x)
    iteracoes.push({ i: k, x: [...x], residuoNorma: res })

    if (res <= tolerancia) {
      return {
        solucao: [...x],
        iteracoes,
        convergiu: true,
        motivo: 'convergiu',
        residuoFinal: res,
      }
    }
  }

  return {
    solucao: [...x],
    iteracoes,
    convergiu: false,
    motivo: 'maxIteracoes',
    residuoFinal: normaResiduo(A, b, x),
  }
}
