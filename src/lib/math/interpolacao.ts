/**
 * Interpolação polinomial — Lagrange + Newton (diferenças divididas).
 *
 * Forma de Lagrange:
 *   p(x) = Σᵢ yᵢ · Lᵢ(x)   onde  Lᵢ(x) = Πⱼ≠ᵢ (x - xⱼ) / (xᵢ - xⱼ)
 *
 * Forma de Newton (diferenças divididas):
 *   p(x) = f[x₀] + (x - x₀) f[x₀,x₁] + (x - x₀)(x - x₁) f[x₀,x₁,x₂] + ...
 *
 * As duas formas produzem o MESMO polinômio (Teorema da unicidade do
 * polinômio interpolador). Newton é mais conveniente para adicionar pontos.
 */

export interface PontoInterpolacao {
  x: number
  y: number
}

/** Avalia o polinômio interpolador de Lagrange num ponto x. */
export function lagrange(pontos: PontoInterpolacao[], x: number): number {
  const n = pontos.length
  let resultado = 0
  for (let i = 0; i < n; i++) {
    let Li = 1
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        Li *= (x - pontos[j]!.x) / (pontos[i]!.x - pontos[j]!.x)
      }
    }
    resultado += pontos[i]!.y * Li
  }
  return resultado
}

/**
 * Calcula a tabela de diferenças divididas. Retorna um array onde
 * tabela[k] = f[x₀, x₁, ..., x_k] — os coeficientes da forma de Newton.
 */
export function diferencasDivididas(pontos: PontoInterpolacao[]): number[] {
  const n = pontos.length
  const f = pontos.map((p) => p.y)
  const coeficientes: number[] = [f[0]!]

  for (let j = 1; j < n; j++) {
    for (let i = n - 1; i >= j; i--) {
      f[i] = (f[i]! - f[i - 1]!) / (pontos[i]!.x - pontos[i - j]!.x)
    }
    coeficientes.push(f[j]!)
  }

  return coeficientes
}

/**
 * Avalia o polinômio interpolador na forma de Newton num ponto x.
 * É equivalente ao Lagrange mas mais eficiente para múltiplas avaliações.
 */
export function newtonInterpolacao(pontos: PontoInterpolacao[], x: number): number {
  const coefs = diferencasDivididas(pontos)
  let resultado = coefs[0]!
  let produto = 1
  for (let i = 1; i < coefs.length; i++) {
    produto *= x - pontos[i - 1]!.x
    resultado += coefs[i]! * produto
  }
  return resultado
}

/**
 * Constrói um interpolador (função x → y) usando a forma de Newton com
 * coeficientes pré-calculados. Útil para chamadas múltiplas.
 */
export function construirInterpolador(
  pontos: PontoInterpolacao[],
): (x: number) => number {
  const coefs = diferencasDivididas(pontos)
  return (x: number) => {
    let resultado = coefs[0]!
    let produto = 1
    for (let i = 1; i < coefs.length; i++) {
      produto *= x - pontos[i - 1]!.x
      resultado += coefs[i]! * produto
    }
    return resultado
  }
}
