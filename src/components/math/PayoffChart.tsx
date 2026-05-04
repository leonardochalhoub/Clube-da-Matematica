'use client'

import { AudioReader } from './AudioReader'
import { useLocale } from '@/components/layout/LocaleProvider'

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

const TIPO_TKEY: Record<PayoffChartProps['tipo'], string> = {
  'long-call': 'payoff.tipo.long-call',
  'short-call': 'payoff.tipo.short-call',
  'long-put': 'payoff.tipo.long-put',
  'short-put': 'payoff.tipo.short-put',
  'covered-call': 'payoff.tipo.covered-call',
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
  const { t } = useLocale()
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
  const tipoLabel = t(TIPO_TKEY[tipo])

  const desc = [
    t('payoff.desc.title').replace('{tipo}', tipoLabel),
    t('payoff.desc.xAxis').replace('{min}', fmtBRL(xMin)).replace('{max}', fmtBRL(xMax)),
    t('payoff.desc.yAxis'),
    t('payoff.desc.spot').replace('{value}', fmtBRL(S)),
    t('payoff.desc.strike').replace('{value}', fmtBRL(K)),
    t('payoff.desc.premio').replace('{value}', fmtBRL(premio)),
    be !== null ? t('payoff.desc.breakeven').replace('{value}', fmtBRL(be)) : '',
    t('payoff.desc.lucroMax').replace('{value}', fmtBRL(lucroMax)),
    t('payoff.desc.prejMax').replace('{value}', fmtBRL(prejMax)),
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
          <AudioReader texto={desc} label={t('payoff.audioLabel')} />
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
          {t('payoff.title.aria')
            .replace('{tipo}', tipoLabel)
            .replace('{strike}', fmtBRL(K))
            .replace('{premio}', fmtBRL(premio))}
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
          {t('payoff.xAxisLabel')}
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
          {t('payoff.yAxisLabel')}
        </text>
      </svg>

      {/* Resumo numérico — versão visualmente oculta lida pelo leitor de tela.
         Provê os mesmos dados do gráfico em forma textual estruturada. */}
      <div className="sr-only">
        <h4>{t('payoff.summary.title')}</h4>
        <ul>
          <li>{t('payoff.summary.tipo')} {tipoLabel}.</li>
          <li>{t('payoff.summary.spot')} R$ {fmtBRL(S)}.</li>
          <li>{t('payoff.summary.strike')} R$ {fmtBRL(K)}.</li>
          <li>{t('payoff.summary.premio')} R$ {fmtBRL(premio)}.</li>
          {be !== null && <li>{t('payoff.summary.breakeven')} R$ {fmtBRL(be)}.</li>}
          <li>{t('payoff.summary.lucroMax')} R$ {fmtBRL(lucroMax)}.</li>
          <li>{t('payoff.summary.prejMax')} R$ {fmtBRL(prejMax)}.</li>
          <li>
            {t('payoff.summary.xRange').replace('{min}', fmtBRL(xMin)).replace('{max}', fmtBRL(xMax))}
          </li>
        </ul>
      </div>

      {legenda && (
        <p className="mt-2 px-1 text-xs leading-relaxed text-clube-mist">{legenda}</p>
      )}
    </figure>
  )
}
