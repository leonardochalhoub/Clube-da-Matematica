/**
 * Método da Secante — variante do Newton sem precisar da derivada.
 *
 * Iteração:  x_{n+1} = x_n - f(x_n) · (x_n - x_{n-1}) / (f(x_n) - f(x_{n-1}))
 * Convergência: superlinear (ordem φ ≈ 1.618).
 */

export interface SecanteEntrada {
  f: (x: number) => number
  x0: number
  x1: number
  tolerancia: number
  maxIteracoes?: number
}

export interface SecanteIteracao {
  i: number
  x0: number
  x1: number
  fx0: number
  fx1: number
  proximoX: number
  erro: number
}

export type SecanteMotivo = 'convergiu' | 'maxIteracoes' | 'denominadorZero' | 'raizExata'

export interface SecanteResultado {
  raiz: number
  iteracoes: SecanteIteracao[]
  convergiu: boolean
  motivo: SecanteMotivo
  erroFinal: number
}

const PADRAO_MAX_ITER = 100

export function secante(entrada: SecanteEntrada): SecanteResultado {
  const { f, tolerancia } = entrada
  const maxIter = entrada.maxIteracoes ?? PADRAO_MAX_ITER
  let x0 = entrada.x0
  let x1 = entrada.x1

  if (x0 === x1) throw new Error('chutes iniciais não podem ser iguais')
  if (tolerancia <= 0) throw new Error(`tolerância deve ser positiva, recebido ${tolerancia}`)

  const iteracoes: SecanteIteracao[] = []

  for (let i = 0; i < maxIter; i++) {
    const fx0 = f(x0)
    const fx1 = f(x1)

    if (Math.abs(fx1) <= tolerancia) {
      return {
        raiz: x1,
        iteracoes,
        convergiu: true,
        motivo: i === 0 ? 'raizExata' : 'convergiu',
        erroFinal: Math.abs(fx1),
      }
    }

    const denom = fx1 - fx0
    if (denom === 0) {
      return {
        raiz: x1,
        iteracoes,
        convergiu: false,
        motivo: 'denominadorZero',
        erroFinal: Math.abs(fx1),
      }
    }

    const proximoX = x1 - (fx1 * (x1 - x0)) / denom
    const erro = Math.abs(proximoX - x1)

    iteracoes.push({ i, x0, x1, fx0, fx1, proximoX, erro })

    if (erro <= tolerancia) {
      return { raiz: proximoX, iteracoes, convergiu: true, motivo: 'convergiu', erroFinal: erro }
    }

    x0 = x1
    x1 = proximoX
  }

  return { raiz: x1, iteracoes, convergiu: false, motivo: 'maxIteracoes', erroFinal: Infinity }
}
