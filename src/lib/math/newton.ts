/**
 * Método de Newton-Raphson — encontra raiz de f(x) = 0 a partir de chute x₀.
 *
 * Iteração:  x_{n+1} = x_n - f(x_n) / f'(x_n)
 * Convergência: quadrática se f'(raiz) ≠ 0 e f for de classe C².
 */

export interface NewtonEntrada {
  f: (x: number) => number
  /** Derivada f'(x). */
  fp: (x: number) => number
  x0: number
  tolerancia: number
  maxIteracoes?: number
}

export interface NewtonIteracao {
  i: number
  x: number
  fx: number
  fpx: number
  proximoX: number
  erro: number
}

export type NewtonMotivo = 'convergiu' | 'maxIteracoes' | 'derivadaZero' | 'raizExata'

export interface NewtonResultado {
  raiz: number
  iteracoes: NewtonIteracao[]
  convergiu: boolean
  motivo: NewtonMotivo
  erroFinal: number
}

const PADRAO_MAX_ITER = 100

export function newton(entrada: NewtonEntrada): NewtonResultado {
  const { f, fp, tolerancia } = entrada
  const maxIter = entrada.maxIteracoes ?? PADRAO_MAX_ITER
  let x = entrada.x0

  if (tolerancia <= 0) throw new Error(`tolerância deve ser positiva, recebido ${tolerancia}`)

  const iteracoes: NewtonIteracao[] = []

  for (let i = 0; i < maxIter; i++) {
    const fx = f(x)
    if (Math.abs(fx) <= tolerancia) {
      return { raiz: x, iteracoes, convergiu: true, motivo: i === 0 ? 'raizExata' : 'convergiu', erroFinal: Math.abs(fx) }
    }

    const fpx = fp(x)
    if (fpx === 0) {
      return {
        raiz: x,
        iteracoes,
        convergiu: false,
        motivo: 'derivadaZero',
        erroFinal: Math.abs(fx),
      }
    }

    const proximoX = x - fx / fpx
    const erro = Math.abs(proximoX - x)

    iteracoes.push({ i, x, fx, fpx, proximoX, erro })

    if (erro <= tolerancia) {
      return { raiz: proximoX, iteracoes, convergiu: true, motivo: 'convergiu', erroFinal: erro }
    }

    x = proximoX
  }

  return { raiz: x, iteracoes, convergiu: false, motivo: 'maxIteracoes', erroFinal: Infinity }
}

/**
 * Calcula derivada numérica via diferença central — útil quando f' não é
 * conhecida analiticamente. Erro O(h²).
 */
export function derivadaNumerica(f: (x: number) => number, h = 1e-6): (x: number) => number {
  return (x: number) => (f(x + h) - f(x - h)) / (2 * h)
}
