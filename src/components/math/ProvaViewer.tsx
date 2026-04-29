'use client'

import { useState } from 'react'
import katex from 'katex'
import { type Prova, PROVAS } from '@/content/provas-data'

const macros: Record<string, string> = {
  '\\R': '\\mathbb{R}',
  '\\e': '\\mathrm{e}',
}

function renderMath(text: string): string {
  // Inline $...$ → KaTeX
  return text.replace(/\$([^$]+)\$/g, (_, expr) => {
    try {
      return katex.renderToString(expr, {
        throwOnError: false,
        strict: false,
        macros,
      })
    } catch {
      return `<code>${expr}</code>`
    }
  })
}

function renderMarkdown(text: string): string {
  // Lightweight markdown: **bold** and \n\n paragraphs
  let html = renderMath(text)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\n\n/g, '</p><p class="mt-2">')
  return `<p>${html}</p>`
}

interface ProvaViewerProps {
  initialId?: string
}

export function ProvaViewer({ initialId }: ProvaViewerProps) {
  const [provaId, setProvaId] = useState<string>(initialId ?? PROVAS[0]!.id)
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const prova = PROVAS.find((p) => p.id === provaId)
  if (!prova) return null

  function toggleReveal(num: number) {
    setRevealed((r) => ({ ...r, [num]: !r[num] }))
  }

  function selectProva(id: string) {
    setProvaId(id)
    setRevealed({})
  }

  const totalQuestoes = prova.questoes.length
  const totalReveladas = Object.values(revealed).filter(Boolean).length

  return (
    <div className="not-prose">
      {/* Seletor de prova */}
      <div className="mb-6 rounded-2xl border border-clube-mist-soft/40 bg-clube-cream-soft p-4">
        <label
          htmlFor="prova-select"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-clube-gold-deep"
        >
          Trocar de prova
        </label>
        <select
          id="prova-select"
          value={provaId}
          onChange={(e) => selectProva(e.target.value)}
          className="w-full rounded-lg border border-clube-mist-soft/60 bg-clube-surface px-3 py-2 text-sm text-clube-ink focus:border-clube-teal focus:outline-none"
        >
          {PROVAS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.titulo}
            </option>
          ))}
        </select>
      </div>

      {/* Cabeçalho da prova */}
      <header className="mb-8 rounded-2xl border-2 border-clube-gold/30 bg-gradient-to-b from-clube-cream-soft to-clube-surface p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl font-extrabold text-clube-teal-deep">
            {prova.titulo}
          </h2>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-clube-cream-soft px-2 py-1 font-mono text-clube-teal-deep">
              {prova.duracaoMinutos} min
            </span>
            <span className="rounded-full bg-clube-gold/15 px-2 py-1 font-mono text-clube-gold-deep">
              {'★'.repeat(prova.intensidade)}
              {'☆'.repeat(5 - prova.intensidade)}
            </span>
            <span className="rounded-full bg-clube-leaf/20 px-2 py-1 font-mono text-clube-leaf">
              {prova.publicoAlvo}
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm text-clube-mist">{prova.descricao}</p>
        <p className="mt-1 text-xs italic text-clube-mist/70">
          Cobre: {prova.trimestresAlvo.join(', ')} · {totalQuestoes} questões ·{' '}
          {totalReveladas} resolução{totalReveladas === 1 ? '' : 'ões'} revelada
          {totalReveladas === 1 ? '' : 's'}
        </p>
      </header>

      {/* Questões */}
      <ol className="space-y-6">
        {prova.questoes.map((q) => (
          <li
            key={q.numero}
            className="rounded-xl border border-clube-mist-soft/40 bg-clube-surface p-5"
          >
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <span className="rounded-full bg-clube-cream-soft px-3 py-1 font-mono text-xs font-bold text-clube-teal-deep">
                Q{q.numero}
              </span>
              <span className="rounded-full bg-clube-mist-soft/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-clube-mist">
                {q.dificuldade}
              </span>
            </div>

            <div
              className="prose prose-clube max-w-none text-clube-ink"
              dangerouslySetInnerHTML={{
                __html: renderMath(q.enunciado),
              }}
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => toggleReveal(q.numero)}
                className={
                  'rounded-full px-4 py-1.5 text-xs font-semibold transition-all ' +
                  (revealed[q.numero]
                    ? 'bg-clube-clay/20 text-clube-clay'
                    : 'bg-clube-teal text-white hover:bg-clube-teal-deep')
                }
              >
                {revealed[q.numero] ? 'Esconder resolução' : 'Revelar passo a passo'}
              </button>
              {q.aulasCobertas.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {q.aulasCobertas.map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-clube-gold/15 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-clube-gold-deep"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {revealed[q.numero] && (
              <div className="mt-4 rounded-lg border-l-4 border-clube-gold bg-clube-cream-soft p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
                  Resposta
                </p>
                <div
                  className="mt-1 text-sm text-clube-ink"
                  dangerouslySetInnerHTML={{ __html: renderMath(q.resposta) }}
                />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
                  Passo a passo
                </p>
                <div
                  className="mt-1 text-sm leading-relaxed text-clube-ink/85"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(q.passos) }}
                />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
