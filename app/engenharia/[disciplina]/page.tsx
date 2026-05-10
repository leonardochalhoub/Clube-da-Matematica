/**
 * LOCALIZAÇÃO: app/engenharia/[disciplina]/page.tsx
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  PROGRAMA_ENG,
  type DisciplinaEng,
  type LicaoEng,
  type UnidadeEng,
} from '@/content/programa-engenharia'

interface Props {
  params: Promise<{ disciplina: string }>
}

const DISC_IDS: DisciplinaEng[] = ['calculo-1', 'calculo-2', 'calculo-3', 'calculo-4']

export function generateStaticParams() {
  return DISC_IDS.map((disciplina) => ({ disciplina }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { disciplina } = await params
  const disc = PROGRAMA_ENG.find((d) => d.id === disciplina)
  if (!disc) return { title: 'Não encontrado' }
  return {
    title: `${disc.titulo} — Engenharia`,
    description: disc.resumo,
  }
}

// ─── Item de lição ────────────────────────────────────────────────────────────

function LicaoItem({ licao }: { licao: LicaoEng }) {
  // CORREÇÃO: usa caminho em vez de slug para decidir se está publicada
  const publicada = !!licao.caminho

  return (
    <li className="flex items-start gap-3 rounded-xl border border-clube-mist-soft/30 bg-clube-surface px-4 py-3 text-sm">
      {/* Número */}
      <span className="mt-0.5 inline-block min-w-[3rem] rounded-full bg-clube-cream-soft px-2 py-0.5 text-center font-mono text-[10px] font-bold text-clube-teal-deep shrink-0">
        Lição {licao.num}
      </span>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-clube-ink leading-snug">
          {/* CORREÇÃO: link usa /${licao.caminho} que aponta para o roteador genérico */}
          {publicada && licao.caminho ? (
            <Link
              href={`/${licao.caminho}`}
              className="text-clube-teal hover:text-clube-teal-deep"
            >
              {licao.titulo} →
            </Link>
          ) : (
            licao.titulo
          )}
        </div>
        <p className="mt-0.5 text-xs text-clube-mist">{licao.topicos}</p>
        <p className="mt-1 text-[10px] text-clube-mist/60">
          <span className="font-semibold">ref:</span> {licao.referencia}
        </p>
      </div>

      {/* Badge status */}
      {publicada ? (
        <span className="shrink-0 rounded-full bg-clube-leaf/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-clube-leaf">
          publicada
        </span>
      ) : (
        <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-600">
          em breve
        </span>
      )}
    </li>
  )
}

// ─── Seção de unidade ─────────────────────────────────────────────────────────

function UnidadeSection({ unidade }: { unidade: UnidadeEng }) {
  // CORREÇÃO: conta por caminho em vez de slug
  const pubCount = unidade.licoes.filter((l) => !!l.caminho).length

  return (
    <section className="mb-10">
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-clube-teal-deep">
            Unidade {unidade.num}
            {unidade.titulo.includes('—') && (
              <span className="font-normal text-clube-ink">
                {' '}— {unidade.titulo.split('—').slice(1).join('—').trim()}
              </span>
            )}
          </h2>
          <p className="mt-1 text-sm text-clube-mist">{unidade.foco}</p>
        </div>
        <span className="shrink-0 text-xs text-clube-mist whitespace-nowrap">
          {pubCount}/{unidade.licoes.length} lições
        </span>
      </header>

      <ol className="space-y-2">
        {unidade.licoes.map((licao) => (
          <LicaoItem key={licao.num} licao={licao} />
        ))}
      </ol>
    </section>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function DisciplinaPage({ params }: Props) {
  const { disciplina } = await params

  const disc = PROGRAMA_ENG.find((d) => d.id === disciplina)
  if (!disc) notFound()

  const totalLicoes = disc.unidades.reduce((s, u) => s + u.licoes.length, 0)
  // CORREÇÃO: conta por caminho em vez de slug
  const licoesPub = disc.unidades.flatMap((u) => u.licoes).filter((l) => !!l.caminho).length
  const pct = Math.round((licoesPub / totalLicoes) * 100)

  const currentIdx = DISC_IDS.indexOf(disc.id as DisciplinaEng)
  const prevDisc = currentIdx > 0 ? PROGRAMA_ENG[currentIdx - 1] : null
  const nextDisc = currentIdx < PROGRAMA_ENG.length - 1 ? PROGRAMA_ENG[currentIdx + 1] : null

  return (
    <main className="container-clube py-12">

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-clube-mist">
        <Link href="/engenharia" className="hover:text-clube-teal transition-colors">
          Engenharia
        </Link>
        <span>/</span>
        <span className="text-clube-ink font-medium">
          {disc.titulo.split('—')[0]?.trim() ?? disc.titulo}
        </span>
      </nav>

      {/* Hero da disciplina */}
      <header className="mb-10 max-w-3xl">
        <h1 className="mb-3 font-sans text-3xl font-bold text-clube-ink md:text-4xl leading-tight">
          {disc.titulo}
        </h1>
        <p className="mb-5 text-clube-ink/70 leading-relaxed">{disc.resumo}</p>

        <div className="flex flex-wrap gap-2 text-sm mb-5">
          <span className="rounded-full border border-clube-mist-soft/40 bg-clube-surface px-3 py-1 text-clube-ink/70">
            {totalLicoes} lições
          </span>
          <span className="rounded-full border border-clube-mist-soft/40 bg-clube-surface px-3 py-1 text-clube-ink/70">
            {disc.unidades.length} unidades
          </span>
          <span className="rounded-full border border-clube-mist-soft/40 bg-clube-surface px-3 py-1 text-clube-ink/70">
            {disc.cargaHoraria}h/semestre
          </span>
        </div>

        {/* Barra de progresso */}
        <div className="mb-5">
          <div className="mb-1 flex justify-between text-xs text-clube-mist">
            <span>{licoesPub} lições publicadas</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-clube-mist-soft/40">
            <div
              className="h-full rounded-full bg-clube-teal transition-all"
              style={{ width: `${Math.max(2, pct)}%` }}
            />
          </div>
        </div>

        <p className="rounded-xl bg-clube-cream-soft px-4 py-2.5 text-xs text-clube-mist">
          <span className="font-semibold text-clube-ink/70">Equivalência: </span>
          {disc.equivalencia}
        </p>

        {disc.prerrequisitos.length > 0 && (
          <div className="mt-3 rounded-xl border border-amber-300/40 bg-amber-50/50 dark:bg-amber-900/10 px-4 py-3">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
              Pré-requisitos
            </p>
            <ul className="list-disc list-inside text-xs text-clube-ink/70 space-y-0.5">
              {disc.prerrequisitos.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Unidades com lições */}
      {disc.unidades.map((unidade) => (
        <UnidadeSection key={unidade.num} unidade={unidade} />
      ))}

      {/* Navegação entre disciplinas */}
      <nav className="mt-12 flex items-center justify-between gap-4 border-t border-clube-mist-soft/40 pt-8">
        {prevDisc ? (
          <Link
            href={`/engenharia/${prevDisc.id}`}
            className="flex items-center gap-2 text-sm text-clube-teal hover:text-clube-teal-deep transition-colors"
          >
            ← {prevDisc.titulo.split('—')[0]?.trim() ?? prevDisc.titulo}
          </Link>
        ) : (
          <div />
        )}
        {nextDisc ? (
          <Link
            href={`/engenharia/${nextDisc.id}`}
            className="flex items-center gap-2 text-sm text-clube-teal hover:text-clube-teal-deep transition-colors"
          >
            {nextDisc.titulo.split('—')[0]?.trim() ?? nextDisc.titulo} →
          </Link>
        ) : (
          <div />
        )}
      </nav>

    </main>
  )
}
