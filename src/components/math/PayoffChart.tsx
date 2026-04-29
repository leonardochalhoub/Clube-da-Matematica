interface PayoffChartProps {
  /** Tipo da posição. */
  tipo: 'long-call' | 'short-call' | 'long-put' | 'short-put' | 'covered-call'
  /** Preço atual do ativo (R$). */
  S: number
  /** Strike (R$). */
  K: number
  /** Prêmio pago (long) ou recebido (short) — sempre positivo (R$). */
  premio: number
  /** Range de S_T no eixo X. Default: ±25% do strike. */
  rangeMin?: number
  rangeMax?: number
  /** Título acima do gráfico. */
  titulo?: string
  /** Legenda abaixo. */
  legenda?: string
}

/**
 * Diagrama de payoff de opção no vencimento.
 * Eixo X: preço do ativo no vencimento (S_T). Eixo Y: lucro/prejuízo em R$.
 *
 * SVG puro, sem dependência de chart lib. Adapta a dark mode via tokens
 * CSS variables (currentColor).
 */
export function PayoffChart({
  tipo,
  S,
  K,
  premio,
  rangeMin,
  rangeMax,
  titulo,
  legenda,
}: PayoffChartProps) {
  const xMin = rangeMin ?? Math.min(S, K) * 0.75
  const xMax = rangeMax ?? Math.max(S, K) * 1.25

  // Função de payoff por tipo. Retorna LUCRO total (já com prêmio).
  function payoff(St: number): number {
    switch (tipo) {
      case 'long-call':
        return Math.max(St - K, 0) - premio
      case 'short-call':
        return premio - Math.max(St - K, 0)
      case 'long-put':
        return Math.max(K - St, 0) - premio
      case 'short-put':
        return premio - Math.max(K - St, 0)
      case 'covered-call':
        // Long ação a S0 + short call. Payoff = (St - S) + premio - max(St - K, 0)
        return St - S + premio - Math.max(St - K, 0)
    }
  }

  // Amostra 64 pontos
  const N = 64
  const pontos: { x: number; y: number }[] = []
  for (let i = 0; i <= N; i++) {
    const x = xMin + (i / N) * (xMax - xMin)
    pontos.push({ x, y: payoff(x) })
  }

  // Range Y com padding
  const yValores = pontos.map((p) => p.y)
  const yMinRaw = Math.min(...yValores, 0)
  const yMaxRaw = Math.max(...yValores, 0)
  const yPad = (yMaxRaw - yMinRaw) * 0.15
  const yMin = yMinRaw - yPad
  const yMax = yMaxRaw + yPad

  // Dimensões
  const W = 560
  const H = 280
  const padL = 56
  const padR = 16
  const padT = 16
  const padB = 36

  const innerW = W - padL - padR
  const innerH = H - padT - padB

  function xToSvg(x: number) {
    return padL + ((x - xMin) / (xMax - xMin)) * innerW
  }
  function yToSvg(y: number) {
    return padT + ((yMax - y) / (yMax - yMin)) * innerH
  }

  // Path do payoff (linha)
  const pathLinha = pontos
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xToSvg(p.x).toFixed(2)} ${yToSvg(p.y).toFixed(2)}`)
    .join(' ')

  // Áreas: sombreado verde no lucro, vermelho no prejuízo (terra-cota)
  // Constrói paths separados acima/abaixo de y=0
  const y0 = yToSvg(0)

  const lucroPathPts: string[] = []
  const prejuizoPathPts: string[] = []
  for (const p of pontos) {
    if (p.y >= 0) {
      lucroPathPts.push(`${xToSvg(p.x).toFixed(2)},${yToSvg(p.y).toFixed(2)}`)
    } else {
      prejuizoPathPts.push(`${xToSvg(p.x).toFixed(2)},${yToSvg(p.y).toFixed(2)}`)
    }
  }

  // Breakeven: onde payoff = 0
  function breakeven(): number | null {
    if (tipo === 'long-call' || tipo === 'short-call') return K + premio * (tipo === 'long-call' ? 1 : -1)
    if (tipo === 'long-put') return K - premio
    if (tipo === 'short-put') return K - premio
    if (tipo === 'covered-call') return S - premio
    return null
  }
  const be = breakeven()

  // Ticks do eixo X (5 ticks)
  const xTicks: number[] = []
  for (let i = 0; i <= 4; i++) xTicks.push(xMin + (i / 4) * (xMax - xMin))
  const yTicks: number[] = []
  const yStep = (yMax - yMin) / 4
  for (let i = 0; i <= 4; i++) yTicks.push(yMin + i * yStep)

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-xl border border-clube-mist-soft/40 bg-clube-surface p-4">
      {titulo && (
        <figcaption className="mb-2 px-1 text-sm font-semibold text-clube-teal-deep">
          {titulo}
        </figcaption>
      )}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Payoff ${tipo}, strike ${K}, prêmio ${premio}`}
      >
        {/* Grid horizontal */}
        {yTicks.map((t, i) => (
          <line
            key={`hg${i}`}
            x1={padL}
            x2={W - padR}
            y1={yToSvg(t)}
            y2={yToSvg(t)}
            stroke="currentColor"
            strokeOpacity={0.08}
            strokeWidth={1}
          />
        ))}

        {/* Eixo Y labels */}
        {yTicks.map((t, i) => (
          <text
            key={`yl${i}`}
            x={padL - 6}
            y={yToSvg(t) + 4}
            textAnchor="end"
            fontSize="11"
            fontFamily="var(--font-mono, monospace)"
            fill="currentColor"
            fillOpacity={0.55}
          >
            {t >= 0 ? '+' : ''}
            {t.toFixed(1)}
          </text>
        ))}

        {/* Eixo X labels */}
        {xTicks.map((t, i) => (
          <text
            key={`xl${i}`}
            x={xToSvg(t)}
            y={H - padB + 18}
            textAnchor="middle"
            fontSize="11"
            fontFamily="var(--font-mono, monospace)"
            fill="currentColor"
            fillOpacity={0.55}
          >
            {t.toFixed(0)}
          </text>
        ))}

        {/* Linha y=0 */}
        <line
          x1={padL}
          x2={W - padR}
          y1={y0}
          y2={y0}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1.5}
          strokeDasharray="3 3"
        />

        {/* Áreas de lucro (verde) e prejuízo (terra-cota) */}
        {lucroPathPts.length > 0 && (
          <polyline
            points={`${lucroPathPts[0]?.split(',')[0]},${y0} ${lucroPathPts.join(' ')} ${lucroPathPts.at(-1)?.split(',')[0]},${y0}`}
            fill="rgb(61 122 95 / 0.18)"
            stroke="none"
          />
        )}

        {/* Linha vertical no spot S */}
        <line
          x1={xToSvg(S)}
          x2={xToSvg(S)}
          y1={padT}
          y2={H - padB}
          stroke="currentColor"
          strokeOpacity={0.4}
          strokeWidth={1}
          strokeDasharray="2 4"
        />
        <text
          x={xToSvg(S)}
          y={padT + 12}
          textAnchor="middle"
          fontSize="10"
          fontFamily="var(--font-mono, monospace)"
          fill="currentColor"
          fillOpacity={0.6}
        >
          S = {S.toFixed(2)}
        </text>

        {/* Linha vertical no strike K */}
        <line
          x1={xToSvg(K)}
          x2={xToSvg(K)}
          y1={padT}
          y2={H - padB}
          stroke="rgb(232 199 122)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        <text
          x={xToSvg(K)}
          y={padT + 12}
          textAnchor="middle"
          fontSize="10"
          fontFamily="var(--font-mono, monospace)"
          fill="rgb(201 163 95)"
          fontWeight="bold"
        >
          K = {K.toFixed(2)}
        </text>

        {/* Linha de breakeven */}
        {be !== null && be > xMin && be < xMax && (
          <>
            <circle
              cx={xToSvg(be)}
              cy={y0}
              r={4}
              fill="rgb(26 77 92)"
              stroke="rgb(232 199 122)"
              strokeWidth={2}
            />
            <text
              x={xToSvg(be)}
              y={y0 + 16}
              textAnchor="middle"
              fontSize="10"
              fontFamily="var(--font-mono, monospace)"
              fill="rgb(26 77 92)"
              fontWeight="bold"
            >
              BE {be.toFixed(2)}
            </text>
          </>
        )}

        {/* Linha do payoff */}
        <path
          d={pathLinha}
          fill="none"
          stroke="rgb(26 77 92)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="dark:stroke-clube-teal"
        />

        {/* Eixo X linha */}
        <line
          x1={padL}
          x2={W - padR}
          y1={H - padB}
          y2={H - padB}
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeWidth={1}
        />

        {/* Label X axis */}
        <text
          x={W / 2}
          y={H - 4}
          textAnchor="middle"
          fontSize="11"
          fontFamily="var(--font-inter, sans-serif)"
          fill="currentColor"
          fillOpacity={0.6}
        >
          Preço no vencimento (R$)
        </text>

        {/* Label Y axis (rotated) */}
        <text
          x={14}
          y={H / 2}
          textAnchor="middle"
          fontSize="11"
          fontFamily="var(--font-inter, sans-serif)"
          fill="currentColor"
          fillOpacity={0.6}
          transform={`rotate(-90 14 ${H / 2})`}
        >
          Lucro / Prejuízo (R$)
        </text>
      </svg>
      {legenda && (
        <p className="mt-2 px-1 text-xs leading-relaxed text-clube-mist">{legenda}</p>
      )}
    </figure>
  )
}
