'use client'

import Link from 'next/link'
import { useState, useId } from 'react'
import {
  type Aula,
  type MateriaEM,
  MATERIAS_LABEL,
  MATERIAS_DESCRICAO,
} from '@/content/programa-em'

interface AulaPath extends Aula {
  /** Caminho completo (ex.: 'aulas/ano-1/trim-1/aula-01-conjuntos-intervalos'). */
  caminho?: string
}

interface MateriaTabsProps {
  /** Matérias presentes neste ano (ordem das tabs). */
  materias: MateriaEM[]
  /** Aulas indexadas por matéria. */
  aulasPorMateria: Record<MateriaEM, AulaPath[]>
}

/**
 * Abas WAI-ARIA-compliant para apresentar matérias dentro de um Ano.
 * Cada tab mostra a lista de aulas daquela matéria; aulas publicadas
 * têm link clicável, planejadas ficam em estado "planejada".
 */
export function MateriaTabs({ materias, aulasPorMateria }: MateriaTabsProps) {
  const [ativa, setAtiva] = useState<MateriaEM>(materias[0]!)
  const groupId = useId()

  if (materias.length === 0) {
    return (
      <p className="rounded-lg bg-clube-cream-soft px-4 py-3 text-sm italic text-clube-mist">
        Sem matérias registradas.
      </p>
    )
  }

  return (
    <div className="not-prose">
      <div
        role="tablist"
        aria-label="Matérias do ano"
        className="flex flex-wrap gap-2 border-b border-clube-mist-soft/40 pb-3"
      >
        {materias.map((m) => {
          const selected = m === ativa
          const tabId = `${groupId}-tab-${m}`
          const panelId = `${groupId}-panel-${m}`
          return (
            <button
              key={m}
              id={tabId}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setAtiva(m)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                  e.preventDefault()
                  const i = materias.indexOf(m)
                  const next =
                    e.key === 'ArrowRight'
                      ? materias[(i + 1) % materias.length]!
                      : materias[(i - 1 + materias.length) % materias.length]!
                  setAtiva(next)
                }
              }}
              className={
                'rounded-full px-4 py-1.5 text-sm font-semibold transition-all ' +
                (selected
                  ? 'bg-clube-teal text-white shadow-sm'
                  : 'border border-clube-mist-soft/60 bg-clube-surface text-clube-ink/85 hover:border-clube-teal hover:text-clube-teal')
              }
            >
              {MATERIAS_LABEL[m]}
            </button>
          )
        })}
      </div>

      {materias.map((m) => {
        const tabId = `${groupId}-tab-${m}`
        const panelId = `${groupId}-panel-${m}`
        const aulas = aulasPorMateria[m] ?? []
        const isActive = m === ativa
        return (
          <section
            key={m}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isActive}
            className="pt-6"
          >
            <header className="mb-4">
              <h3 className="text-xl font-bold text-clube-teal-deep">
                {MATERIAS_LABEL[m]}
              </h3>
              <p className="mt-1 text-sm text-clube-mist">
                {MATERIAS_DESCRICAO[m]}
              </p>
            </header>

            {aulas.length === 0 ? (
              <p className="rounded-lg bg-clube-cream-soft px-4 py-3 text-sm italic text-clube-mist">
                Sem aulas registradas nesta matéria para este ano.
              </p>
            ) : (
              <ol className="space-y-2">
                {aulas.map((aula) => {
                  const publicada = !!aula.caminho
                  return (
                    <li
                      key={aula.num}
                      className="flex items-start gap-3 rounded-lg border border-clube-mist-soft/30 bg-clube-surface px-3 py-2 text-sm"
                    >
                      <span className="mt-0.5 inline-block min-w-[3rem] rounded-full bg-clube-cream-soft px-2 py-0.5 text-center font-mono text-[10px] font-bold text-clube-teal-deep">
                        Lição {aula.num}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-clube-ink">
                          {publicada && aula.caminho ? (
                            <Link
                              href={`/${aula.caminho}/`}
                              className="text-clube-teal hover:text-clube-teal-deep"
                            >
                              {aula.titulo} →
                            </Link>
                          ) : (
                            aula.titulo
                          )}
                        </div>
                        <div className="text-xs text-clube-mist">
                          {aula.topicos}
                        </div>
                      </div>
                      {publicada ? (
                        <span className="rounded-full bg-clube-leaf/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-clube-leaf">
                          publicada
                        </span>
                      ) : (
                        <span className="rounded-full bg-clube-mist-soft/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-clube-mist">
                          planejada
                        </span>
                      )}
                    </li>
                  )
                })}
              </ol>
            )}
          </section>
        )
      })}
    </div>
  )
}
