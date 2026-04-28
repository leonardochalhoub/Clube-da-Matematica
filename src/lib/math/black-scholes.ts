/**
 * Modelo de Black-Scholes (1973) — precificação de opções europeias.
 *
 * Hipóteses: log-normalidade do ativo, volatilidade σ e taxa r constantes,
 * sem dividendos, sem custos de transação, mercado completo, ausência de
 * arbitragem. Todas falsas em estresse — usar com humildade.
 *
 * Black, F.; Scholes, M. (1973). The Pricing of Options and Corporate
 * Liabilities. Journal of Political Economy 81(3): 637-654.
 *
 * Nobel de Economia 1997 (Scholes + Merton; Black falecido em 1995).
 */

export interface BlackScholesEntrada {
  /** Preço atual do ativo subjacente (R$). */
  S: number
  /** Preço de exercício (strike) (R$). */
  K: number
  /** Taxa livre de risco anualizada (decimal: 0.10 = 10% a.a.). */
  r: number
  /** Volatilidade anualizada (decimal: 0.25 = 25% a.a.). */
  sigma: number
  /** Tempo até vencimento, em anos (90 dias = 90/365). */
  T: number
  /** Yield de dividendos (decimal). Padrão 0. */
  q?: number
}

export interface BlackScholesResultado {
  call: number
  put: number
  d1: number
  d2: number
  Nd1: number
  Nd2: number
  /** Probabilidade neutra a risco da opção terminar in-the-money. */
  probItmCall: number
  probItmPut: number
  greeks: Greeks
}

export interface Greeks {
  /** ∂C/∂S — sensibilidade ao preço do ativo. */
  deltaCall: number
  deltaPut: number
  /** ∂²C/∂S² — convexidade (mesmo para call/put). */
  gamma: number
  /** ∂C/∂σ — sensibilidade à volatilidade (por 1pp). */
  vega: number
  /** ∂C/∂T — decaimento por tempo (call/put diferentes). Anualizado, ÷365 dá decay/dia. */
  thetaCall: number
  thetaPut: number
  /** ∂C/∂r — sensibilidade à taxa de juros (por 1pp). */
  rhoCall: number
  rhoPut: number
}

/**
 * Aproximação racional de Abramowitz & Stegun para a distribuição normal
 * acumulada padrão Φ(x). Erro absoluto < 7,5 × 10⁻⁸.
 */
export function distribuicaoNormalAcumulada(x: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = x < 0 ? -1 : 1
  const absX = Math.abs(x) / Math.SQRT2
  const t = 1.0 / (1.0 + p * absX)
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX)

  return 0.5 * (1.0 + sign * y)
}

/** Densidade da normal padrão φ(x) = (1/√(2π)) · e^(-x²/2). */
export function densidadeNormal(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
}

export function blackScholes(entrada: BlackScholesEntrada): BlackScholesResultado {
  const { S, K, r, sigma, T } = entrada
  const q = entrada.q ?? 0

  if (S <= 0) throw new Error(`S deve ser positivo, recebido ${S}`)
  if (K <= 0) throw new Error(`K deve ser positivo, recebido ${K}`)
  if (sigma <= 0) throw new Error(`σ deve ser positivo, recebido ${sigma}`)
  if (T < 0) throw new Error(`T não pode ser negativo, recebido ${T}`)

  const sqrtT = Math.sqrt(T)
  const d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * sqrtT)
  const d2 = d1 - sigma * sqrtT

  const Nd1 = distribuicaoNormalAcumulada(d1)
  const Nd2 = distribuicaoNormalAcumulada(d2)
  const Nmd1 = distribuicaoNormalAcumulada(-d1)
  const Nmd2 = distribuicaoNormalAcumulada(-d2)

  const expQT = Math.exp(-q * T)
  const expRT = Math.exp(-r * T)

  const call = S * expQT * Nd1 - K * expRT * Nd2
  const put = K * expRT * Nmd2 - S * expQT * Nmd1

  // Greeks
  const phiD1 = densidadeNormal(d1)
  const deltaCall = expQT * Nd1
  const deltaPut = expQT * (Nd1 - 1)
  const gamma = (expQT * phiD1) / (S * sigma * sqrtT)
  const vega = S * expQT * phiD1 * sqrtT * 0.01 // por 1 ponto percentual
  const thetaCall =
    (-(S * expQT * phiD1 * sigma) / (2 * sqrtT) - r * K * expRT * Nd2 + q * S * expQT * Nd1) / 365 // por dia
  const thetaPut =
    (-(S * expQT * phiD1 * sigma) / (2 * sqrtT) + r * K * expRT * Nmd2 - q * S * expQT * Nmd1) / 365
  const rhoCall = K * T * expRT * Nd2 * 0.01
  const rhoPut = -K * T * expRT * Nmd2 * 0.01

  return {
    call,
    put,
    d1,
    d2,
    Nd1,
    Nd2,
    probItmCall: Nd2,
    probItmPut: Nmd2,
    greeks: {
      deltaCall,
      deltaPut,
      gamma,
      vega,
      thetaCall,
      thetaPut,
      rhoCall,
      rhoPut,
    },
  }
}

/**
 * Calcula a volatilidade implícita via método de Newton-Raphson.
 * Dado um preço de mercado de call, encontra σ que reproduz esse preço.
 */
export function volatilidadeImplicita(
  precoCall: number,
  S: number,
  K: number,
  r: number,
  T: number,
  q = 0,
  tolerancia = 1e-6,
  maxIter = 100,
): number {
  let sigma = 0.3 // chute inicial

  for (let i = 0; i < maxIter; i++) {
    const { call, greeks } = blackScholes({ S, K, r, sigma, T, q })
    const diff = call - precoCall
    if (Math.abs(diff) < tolerancia) return sigma
    const vegaAnualizada = greeks.vega * 100 // desfaz o /100 do vega
    if (vegaAnualizada === 0) break
    sigma = sigma - diff / vegaAnualizada
    if (sigma <= 0) sigma = 0.01
  }

  return sigma
}
