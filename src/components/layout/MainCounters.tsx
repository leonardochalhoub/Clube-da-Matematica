'use client'

import { useEffect, useState } from 'react'
import { useLocale } from './LocaleProvider'

interface CounterCard {
  numero: string | number
  label: string
  sublabel?: string
  cor: 'teal' | 'gold' | 'leaf' | 'clay' | 'mist'
}

const COR_CLASSES: Record<CounterCard['cor'], string> = {
  teal: 'text-clube-teal-deep',
  gold: 'text-clube-gold-deep',
  leaf: 'text-clube-leaf',
  clay: 'text-clube-clay',
  mist: 'text-clube-mist',
}

interface MainCountersProps {
  /** Lições publicadas (vem do loader). */
  licoesPublicadas: number
  /** Lições planejadas total. */
  licoesPlanejadas: number
  /** Total exercícios MDX. */
  exerciciosTotal: number
  /** Total de questões reais nas provas. */
  questoesProvasReais: number
  /** Versões de prova curadas. */
  provasVersoes: number
  /** Carga horária total (h). */
  cargaHorariaH: number
  /** Livros públicos citados como fonte. */
  livrosNoLedger: number
}

/**
 * Bloco de contadores na main page.
 *
 * Mistura:
 * 1. Números **intrínsecos** da plataforma (lições, exercícios, etc) —
 *    sempre exatos, vêm do loader em build time.
 * 2. **Visitas** — contador público live via CounterAPI.dev (free).
 *
 * Visitas-by-spec:
 * - Cada montagem do componente faz POST que incrementa.
 * - Usa namespace 'clube-da-matematica' + key 'visits'.
 * - Falha silenciosa: se API offline, o número some (não polui o layout).
 */
export function MainCounters({
  licoesPublicadas,
  licoesPlanejadas,
  exerciciosTotal,
  questoesProvasReais,
  provasVersoes,
  cargaHorariaH,
  livrosNoLedger,
}: MainCountersProps) {
  const { t } = useLocale()
  const [visitas, setVisitas] = useState<number | null>(null)
  const [erroVisitas, setErroVisitas] = useState(false)

  useEffect(() => {
    let cancelado = false
    async function bumpVisits() {
      try {
        // CounterAPI v1 — incrementa e retorna novo valor.
        // Namespace + key. Seguro pra publicar (URL pública).
        const r = await fetch(
          'https://api.counterapi.dev/v1/clube-da-matematica/visits/up',
          { method: 'GET' },
        )
        if (!r.ok) throw new Error('Counter API erro')
        const data = (await r.json()) as { count?: number; value?: number }
        const valor = data.count ?? data.value ?? null
        if (!cancelado && typeof valor === 'number') setVisitas(valor)
      } catch {
        if (!cancelado) setErroVisitas(true)
      }
    }
    bumpVisits()
    return () => {
      cancelado = true
    }
  }, [])

  const cards: CounterCard[] = [
    {
      numero: visitas ?? (erroVisitas ? '—' : '...'),
      label: t('counters.visits'),
      cor: 'teal',
    },
    {
      numero: licoesPublicadas,
      label: t('counters.lessons.published'),
      sublabel: `${licoesPlanejadas}`,
      cor: 'leaf',
    },
    {
      numero: exerciciosTotal.toLocaleString(),
      label: t('counters.exercises'),
      cor: 'gold',
    },
    {
      numero: provasVersoes,
      label: t('counters.exam.versions'),
      sublabel: `${questoesProvasReais}+`,
      cor: 'clay',
    },
    {
      numero: `~${cargaHorariaH}h`,
      label: t('counters.study.total'),
      sublabel: '128h/ano',
      cor: 'teal',
    },
    {
      numero: livrosNoLedger,
      label: t('counters.books.ledger'),
      sublabel: 'OpenStax, Lebl, Active Calc',
      cor: 'mist',
    },
  ]

  return (
    <section
      aria-label={t('counters.aria')}
      className="border-y-2 border-clube-gold/40 bg-gradient-to-b from-clube-cream-soft via-clube-surface to-clube-cream-soft py-12 sm:py-16"
    >
      <div className="container-clube">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clube-gold-deep">
            {t('counters.eyebrow')}
          </p>
          <h2 className="mt-2 text-hero font-extrabold text-clube-teal-deep">
            {t('counters.title')}
          </h2>
          <p className="mt-2 text-sm text-clube-mist">
            {t('counters.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {cards.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl border-2 border-clube-mist-soft/40 bg-clube-surface p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-clube-gold/60 hover:shadow-md sm:p-5"
            >
              <div
                className={`text-2xl font-extrabold tabular-nums sm:text-3xl ${COR_CLASSES[c.cor]}`}
              >
                {c.numero}
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-clube-mist sm:text-[13px]">
                {c.label}
              </div>
              {c.sublabel && (
                <div className="mt-0.5 text-[11px] italic text-clube-mist/80">
                  {c.sublabel}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
