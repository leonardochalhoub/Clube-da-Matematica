/**
 * Integração numérica — Trapézio composto + Simpson 1/3 composto.
 *
 * Trapézio composto:
 *   T(n) = (h/2) [f(x₀) + 2f(x₁) + 2f(x₂) + ... + 2f(xₙ₋₁) + f(xₙ)]
 *   Erro: O(h²);  E_T = -(b-a) h² f''(ξ) / 12
 *
 * Simpson 1/3 composto (n par):
 *   S(n) = (h/3) [f(x₀) + 4f(x₁) + 2f(x₂) + 4f(x₃) + ... + 4f(xₙ₋₁) + f(xₙ)]
 *   Erro: O(h⁴);  E_S = -(b-a) h⁴ f⁽⁴⁾(ξ) / 180
 */

export interface IntegralEntrada {
  f: (x: number) => number
  a: number
  b: number
  /** Número de subintervalos. Simpson exige n par. */
  n: number
}

export interface IntegralResultado {
  valor: number
  metodo: 'trapezio' | 'simpson'
  n: number
  h: number
}

export function trapezio(entrada: IntegralEntrada): IntegralResultado {
  const { f, a, b, n } = entrada
  if (n <= 0) throw new Error(`n deve ser positivo, recebido ${n}`)
  const h = (b - a) / n
  let soma = 0.5 * (f(a) + f(b))
  for (let i = 1; i < n; i++) {
    soma += f(a + i * h)
  }
  return { valor: soma * h, metodo: 'trapezio', n, h }
}

export function simpson(entrada: IntegralEntrada): IntegralResultado {
  const { f, a, b, n } = entrada
  if (n <= 0 || n % 2 !== 0) {
    throw new Error(`Simpson exige n par e positivo, recebido ${n}`)
  }
  const h = (b - a) / n
  let soma = f(a) + f(b)
  for (let i = 1; i < n; i++) {
    const x = a + i * h
    soma += (i % 2 === 0 ? 2 : 4) * f(x)
  }
  return { valor: (soma * h) / 3, metodo: 'simpson', n, h }
}

/**
 * Integral adaptativa baseada em refinamento de Simpson com
 * comparação de erro. Para quando a diferença entre n e 2n é < tolerância.
 */
export function simpsonAdaptativo(
  f: (x: number) => number,
  a: number,
  b: number,
  tolerancia: number,
  nInicial = 4,
  maxN = 1 << 20,
): IntegralResultado {
  let n = nInicial
  if (n % 2 !== 0) n++
  let s1 = simpson({ f, a, b, n }).valor
  while (n < maxN) {
    const s2 = simpson({ f, a, b, n: n * 2 }).valor
    if (Math.abs(s2 - s1) / 15 <= tolerancia) {
      return { valor: s2, metodo: 'simpson', n: n * 2, h: (b - a) / (n * 2) }
    }
    s1 = s2
    n *= 2
  }
  return { valor: s1, metodo: 'simpson', n, h: (b - a) / n }
}
