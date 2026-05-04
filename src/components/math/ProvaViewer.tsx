'use client'

import { useMemo, useState } from 'react'
import katex from 'katex'
import { type Prova, PROVAS } from '@/content/provas-data'
import { useLocale } from '@/components/layout/LocaleProvider'

const macros: Record<string, string> = {
  '\\R': '\\mathbb{R}',
  '\\e': '\\mathrm{e}',
}

function renderMath(text: string): string {
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
  let html = renderMath(text)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\n\n/g, '</p><p class="mt-2">')
  return `<p>${html}</p>`
}

export function ProvaViewer() {
  const { t } = useLocale()
  const [trimFiltro, setTrimFiltro] = useState<number>(1)
  const provasDoTrim = useMemo(
    () => PROVAS.filter((p) => p.trim === trimFiltro),
    [trimFiltro],
  )
  const [provaId, setProvaId] = useState<string>(
    provasDoTrim.find((p) => p.status === 'curada')?.id ??
      provasDoTrim[0]?.id ??
      PROVAS[0]!.id,
  )
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const prova = PROVAS.find((p) => p.id === provaId) ?? provasDoTrim[0] ?? PROVAS[0]!

  function selectTrim(trimNum: number) {
    setTrimFiltro(trimNum)
    const novas = PROVAS.filter((p) => p.trim === trimNum)
    const primeiraCurada = novas.find((p) => p.status === 'curada')
    setProvaId(primeiraCurada?.id ?? novas[0]?.id ?? PROVAS[0]!.id)
    setRevealed({})
  }

  function selectProva(id: string) {
    setProvaId(id)
    setRevealed({})
  }

  function toggleReveal(num: number) {
    setRevealed((r) => ({ ...r, [num]: !r[num] }))
  }

  const totalQuestoes = prova.questoes.length
  const totalReveladas = Object.values(revealed).filter(Boolean).length

  return (
    <div className="not-prose">
      {/* Filtro por trimestre */}
      <div className="mb-4 rounded-2xl border border-clube-mist-soft/40 bg-clube-cream-soft p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
          {t('prova.term.label')} —{' '}
          <span
            className="text-clube-mist normal-case tracking-normal"
            dangerouslySetInnerHTML={{ __html: t('prova.term.legend') }}
          />
        </p>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((tn) => {
            const ativo = tn === trimFiltro
            // T1-T4 = ano 1 (bronze); T5-T8 = ano 2 (prata); T9-T12 = ano 3 (ouro)
            const ano = tn <= 4 ? 1 : tn <= 8 ? 2 : 3
            const corBordaInativa =
              ano === 1
                ? 'border-[#a97142]/60 hover:border-[#a97142] hover:text-[#a97142]'
                : ano === 2
                  ? 'border-[#9ca3af]/70 hover:border-[#9ca3af] hover:text-[#6b7280]'
                  : 'border-[#c9a35f]/70 hover:border-[#c9a35f] hover:text-[#9c7c3a]'
            const corAtiva =
              ano === 1
                ? 'bg-[#a97142] text-white shadow-sm border-2 border-[#a97142]'
                : ano === 2
                  ? 'bg-[#6b7280] text-white shadow-sm border-2 border-[#6b7280]'
                  : 'bg-[#9c7c3a] text-white shadow-sm border-2 border-[#9c7c3a]'
            return (
              <button
                key={tn}
                type="button"
                onClick={() => selectTrim(tn)}
                className={
                  'rounded-full px-3 py-1 font-mono text-xs font-semibold transition-all ' +
                  (ativo
                    ? corAtiva
                    : `border-2 bg-clube-surface text-clube-ink/85 ${corBordaInativa}`)
                }
                aria-label={t('prova.term.aria').replace('{t}', String(tn)).replace('{ano}', String(ano))}
              >
                T{tn}
              </button>
            )
          })}
        </div>
      </div>

      {/* Seletor de versão dentro do trim */}
      <div className="mb-6 rounded-2xl border border-clube-mist-soft/40 bg-clube-cream-soft p-4">
        <label
          htmlFor="prova-select"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-clube-gold-deep"
        >
          {t('prova.version.label')}
        </label>
        <select
          id="prova-select"
          value={provaId}
          onChange={(e) => selectProva(e.target.value)}
          className="w-full rounded-lg border border-clube-mist-soft/60 bg-clube-surface px-3 py-2 text-sm text-clube-ink focus:border-clube-teal focus:outline-none"
        >
          {provasDoTrim.map((p) => (
            <option key={p.id} value={p.id}>
              {p.titulo} {p.status === 'curada' ? '✓' : `· ${t('prova.status.curating')}`}
            </option>
          ))}
        </select>
      </div>

      {/* Cabeçalho da prova */}
      <header className="mb-8 rounded-2xl border-2 border-clube-gold/30 bg-gradient-to-b from-clube-cream-soft to-clube-surface p-4 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between">
          <h2 className="text-xl font-extrabold text-clube-teal-deep sm:text-2xl">
            {prova.titulo}
          </h2>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-clube-cream-soft px-2 py-1 font-mono text-clube-teal-deep">
              {prova.duracaoMinutos} {t('prova.minutes')}
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
          {t('prova.meta.term')} {prova.trim} · {t('prova.meta.version')} {prova.versao} · {totalQuestoes} {t('prova.meta.questions')} ·{' '}
          {totalReveladas}{' '}
          {totalReveladas === 1
            ? t('prova.meta.revealedSingular')
            : t('prova.meta.revealedPlural')}
        </p>
      </header>

      {/* Caso seja stub em-curadoria */}
      {prova.status === 'em-curadoria' && (
        <div className="mb-8 rounded-xl border-2 border-dashed border-clube-mist-soft p-6 text-center">
          <p className="text-sm text-clube-mist">
            {t('prova.curating.text')}
          </p>
          <p className="mt-3 text-sm text-clube-ink">
            <strong>{t('prova.curating.fallback')}</strong>
          </p>
        </div>
      )}

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

            {/* Fonte original */}
            <div className="mt-3 rounded-md border border-clube-mist-soft/30 bg-clube-cream-soft px-3 py-2 text-[11px]">
              <span className="font-semibold uppercase tracking-wider text-clube-mist">
                {t('prova.source.label')}
              </span>{' '}
              <a
                href={q.fonteOriginal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-clube-teal hover:text-clube-teal-deep"
              >
                {q.fonteOriginal.livro}
              </a>{' '}
              <span className="text-clube-mist">
                · {q.fonteOriginal.ref} · {q.fonteOriginal.licenca}
              </span>
            </div>

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
                {revealed[q.numero] ? t('prova.hideSolution') : t('prova.revealSolution')}
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
                  {t('prova.answer')}
                </p>
                <div
                  className="mt-1 text-sm text-clube-ink"
                  dangerouslySetInnerHTML={{ __html: renderMath(q.resposta) }}
                />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
                  {t('prova.stepByStep')}
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
