import { AudioReader } from './AudioReader'

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

const TIPO_LABEL: Record<PayoffChartProps['tipo'], string> = {
  'long-call': 'compra de call (long call)',
  'short-call': 'venda de call (short call)',
  'long-put': 'compra de put (long put)',
  'short-put': 'venda de put (short put)',
  'covered-call': 'covered call (long ações + short call)',
}

function fmtBRL(v: number): string {
  return v.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Diagrama de payoff de opção no vencimento.
 *
 * Acessibilidade:
 * - SVG com role="img", <title> e <desc> descritivos.
 * - Tabela visualmente oculta (.sr-only) com pontos-chave (S, K, prêmio,
 *   breakeven, lucro/prejuízo máx) — leitores de tela leem números reais.
 * - Botão "Ouvir descrição" que narra a curva via Web Speech API (PT-BR).
 * - aria-describedby liga o SVG à descrição estendida.
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
        return St - S + premio - Math.max(St - K, 0)
    }
  }

  const N = 64
  const pontos: { x: number; y: number }[] = []
  for (let i = 0; i <= N; i++) {
    const x = xMin + (i / N) * (xMax - xMin)
    pontos.push({ x, y: payoff(x) })
  }

  const yValores = pontos.map((p) => p.y)
  const yMinRaw = Math.min(...yValores, 0)
  const yMaxRaw = Math.max(...yValores, 0)
  const yPad = (yMaxRaw - yMinRaw) * 0.15
  const yMin = yMinRaw - yPad
  const yMax = yMaxRaw + yPad

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

  const pathLinha = pontos
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xToSvg(p.x).toFixed(2)} ${yToSvg(p.y).toFixed(2)}`)
    .join(' ')

  const y0 = yToSvg(0)

  const lucroPathPts: string[] = []
  for (const p of pontos) {
    if (p.y >= 0) {
      lucroPathPts.push(`${xToSvg(p.x).toFixed(2)},${yToSvg(p.y).toFixed(2)}`)
    }
  }

  function breakeven(): number | null {
    if (tipo === 'long-call' || tipo === 'short-call')
      return K + premio * (tipo === 'long-call' ? 1 : -1)
    if (tipo === 'long-put') return K - premio
    if (tipo === 'short-put') return K - premio
    if (tipo === 'covered-call') return S - premio
    return null
  }
  const be = breakeven()

  // Pontos extremos do payoff no range visualizado
  const lucroMax = Math.max(...yValores)
  const prejMax = Math.min(...yValores)

  const xTicks: number[] = []
  for (let i = 0; i <= 4; i++) xTicks.push(xMin + (i / 4) * (xMax - xMin))
  const yTicks: number[] = []
  const yStep = (yMax - yMin) / 4
  for (let i = 0; i <= 4; i++) yTicks.push(yMin + i * yStep)

  // ────────────────────────────────────────────────
  // Texto narrativo (para leitores de tela e áudio)
  // ────────────────────────────────────────────────
  const tipoLabel = TIPO_LABEL[tipo]

  const desc = [
    `Diagrama de payoff de uma ${tipoLabel} no vencimento.`,
    `Eixo horizontal: preço do ativo no vencimento, em reais, de ${fmtBRL(xMin)} a ${fmtBRL(xMax)}.`,
    `Eixo vertical: lucro ou prejuízo, em reais.`,
    `Preço atual do ativo (spot): ${fmtBRL(S)} reais.`,
    `Preço de exercício (strike): ${fmtBRL(K)} reais.`,
    `Prêmio: ${fmtBRL(premio)} reais.`,
    be !== null ? `Ponto de equilíbrio (breakeven): ${fmtBRL(be)} reais.` : '',
    `Lucro máximo no intervalo mostrado: ${fmtBRL(lucroMax)} reais.`,
    `Prejuízo máximo no intervalo mostrado: ${fmtBRL(prejMax)} reais.`,
  ]
    .filter(Boolean)
    .join(' ')

  const idBase = `payoff-${tipo}-${K}-${premio}`.replace(/\./g, '_')
  const titleId = `${idBase}-title`
  const descId = `${idBase}-desc`

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-xl border border-clube-mist-soft/40 bg-clube-surface p-4">
      {titulo && (
        <figcaption
          id={`${idBase}-caption`}
          className="mb-2 flex items-center justify-between gap-3 px-1 text-sm font-semibold text-clube-teal-deep"
        >
          <span>{titulo}</span>
          <AudioReader texto={desc} label="Ouvir descrição" />
        </figcaption>
      )}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-labelledby={titulo ? `${idBase}-caption ${titleId}` : titleId}
        aria-describedby={descId}
      >
        <title id={titleId}>
          Payoff de {tipoLabel}, strike R$ {fmtBRL(K)}, prêmio R$ {fmtBRL(premio)}
        </title>
        <desc id={descId}>{desc}</desc>

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

        {/* Área de lucro */}
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

        <path
          d={pathLinha}
          fill="none"
          stroke="rgb(26 77 92)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="dark:stroke-clube-teal"
        />

        <line
          x1={padL}
          x2={W - padR}
          y1={H - padB}
          y2={H - padB}
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeWidth={1}
        />

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

      {/* Resumo numérico — versão visualmente oculta lida pelo leitor de tela.
         Provê os mesmos dados do gráfico em forma textual estruturada. */}
      <div className="sr-only">
        <h4>Resumo do diagrama de payoff</h4>
        <ul>
          <li>Tipo de posição: {tipoLabel}.</li>
          <li>Preço atual do ativo (S): R$ {fmtBRL(S)}.</li>
          <li>Strike (K): R$ {fmtBRL(K)}.</li>
          <li>Prêmio: R$ {fmtBRL(premio)}.</li>
          {be !== null && <li>Breakeven (lucro zero): R$ {fmtBRL(be)}.</li>}
          <li>Lucro máximo no intervalo mostrado: R$ {fmtBRL(lucroMax)}.</li>
          <li>Prejuízo máximo no intervalo mostrado: R$ {fmtBRL(prejMax)}.</li>
          <li>
            Faixa do eixo X (preço do ativo no vencimento): R$ {fmtBRL(xMin)} a R${' '}
            {fmtBRL(xMax)}.
          </li>
        </ul>
      </div>

      {legenda && (
        <p className="mt-2 px-1 text-xs leading-relaxed text-clube-mist">{legenda}</p>
      )}
    </figure>
  )
}
