'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Livro } from '@/content/livros-data'
import {
  PROGRAMA_EM,
  type Aula,
} from '@/content/programa-em'
import { useLocale } from './LocaleProvider'

interface AulaResult {
  num: number
  titulo: string
  topicos: string
  ano: number
  trim: number
  caminho?: string
}

interface SearchDiscoveryProps {
  /** Mapa slug → caminho (ex.: 'aulas/ano-1/trim-1/aula-01-...'). */
  slugToCaminho: Record<string, string>
  /** Catálogo completo de livros. */
  livros: Livro[]
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

function flatLicoes(slugToCaminho: Record<string, string>): AulaResult[] {
  const out: AulaResult[] = []
  for (const ano of PROGRAMA_EM) {
    for (const trim of ano.trimestres) {
      for (const a of trim.aulas as Aula[]) {
        const caminho = a.slug ? slugToCaminho[a.slug] : undefined
        out.push({
          num: a.num,
          titulo: a.titulo,
          topicos: a.topicos,
          ano: ano.num,
          trim: trim.num,
          caminho,
        })
      }
    }
  }
  return out
}

/**
 * Descoberta por busca: home page mostra nada inicialmente.
 * Aluno digita "trigonometria" → aparecem as lições e livros relevantes,
 * em ordem (Ano/Trim/lição número), com cards clicáveis.
 */
export function SearchDiscovery({ slugToCaminho, livros }: SearchDiscoveryProps) {
  const { t } = useLocale()
  const [q, setQ] = useState('')
  const todasLicoes = useMemo(() => flatLicoes(slugToCaminho), [slugToCaminho])

  const { licoes, livrosFiltrados } = useMemo(() => {
    const term = normalize(q.trim())
    if (term.length < 2) return { licoes: [], livrosFiltrados: [] }

    const licoes = todasLicoes
      .map((l) => ({
        l,
        score:
          (normalize(l.titulo).includes(term) ? 3 : 0) +
          (normalize(l.topicos).includes(term) ? 2 : 0),
      }))
      .filter((x) => x.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          a.l.ano - b.l.ano ||
          a.l.trim - b.l.trim ||
          a.l.num - b.l.num,
      )
      .slice(0, 30)
      .map((x) => x.l)

    const livrosFiltrados = livros
      .filter((b) => {
        const corpus = normalize(`${b.titulo} ${b.autor} ${b.notas ?? ''}`)
        return corpus.includes(term)
      })
      .slice(0, 20)

    return { licoes, livrosFiltrados }
  }, [q, todasLicoes, livros])

  return (
    <section className="container-clube py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
          {t('search.eyebrow')}
        </p>
        <h2 className="text-hero font-bold text-clube-teal-deep">
          {t('search.title')}
        </h2>

        <div className="relative mx-auto mt-6 max-w-2xl">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full rounded-full border-2 border-clube-mist-soft/60 bg-clube-surface px-5 py-3 pr-12 text-base text-clube-ink shadow-sm focus:border-clube-teal focus:outline-none focus:ring-2 focus:ring-clube-gold/40"
            aria-label={t('common.search')}
          />
          <span
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-clube-mist"
            aria-hidden
          >
            🔍
          </span>
          {q.length > 0 && q.length < 2 && (
            <p className="mt-2 text-xs italic text-clube-mist">
              {t('search.minLetters')}
            </p>
          )}
        </div>
      </div>

      {/* Vazio inicial — convite */}
      {q.trim().length < 2 && (
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border-2 border-dashed border-clube-mist-soft/60 bg-clube-cream-soft/50 p-8 text-center text-sm text-clube-mist">
          <p className="text-base">
            {t('search.empty.invite')}
          </p>
          <p className="mt-2 text-xs italic">
            {t('search.exploreOr')}{' '}
            <Link href="/ensino-medio" className="font-semibold text-clube-teal hover:text-clube-teal-deep">
              {t('nav.middleSchool')} →
            </Link>
            {' '}{t('search.andCatalog')}{' '}
            <Link href="/livros" className="font-semibold text-clube-teal hover:text-clube-teal-deep">
              {t('nav.books')} →
            </Link>
          </p>
        </div>
      )}

      {/* Resultados de lições */}
      {licoes.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
            {t('search.lessons.label')} ({licoes.length})
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {licoes.map((l) => {
              const tag = `${t('search.tag.year')} ${l.ano} · ${t('search.tag.term')} ${l.trim} · ${t('search.tag.lesson')} ${l.num}`
              if (l.caminho) {
                return (
                  <Link
                    key={l.num}
                    href={`/${l.caminho}/`}
                    className="card-clube group flex flex-col gap-2 no-underline hover:no-underline"
                  >
                    <span className="rounded-full bg-clube-cream-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-clube-teal self-start">
                      {tag}
                    </span>
                    <h4 className="text-base font-semibold text-clube-teal-deep group-hover:text-clube-teal">
                      {l.titulo}
                    </h4>
                    <p className="text-xs text-clube-mist">{l.topicos}</p>
                  </Link>
                )
              }
              return (
                <div key={l.num} className="card-clube flex flex-col gap-2 opacity-60">
                  <span className="rounded-full bg-clube-cream-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-clube-mist self-start">
                    {tag} · {t('materia.status.planned')}
                  </span>
                  <h4 className="text-base font-semibold text-clube-mist">{l.titulo}</h4>
                  <p className="text-xs text-clube-mist/80">{l.topicos}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Resultados de livros */}
      {livrosFiltrados.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
            {t('search.books.label')} ({livrosFiltrados.length})
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {livrosFiltrados.map((b, i) => (
              <li key={i}>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-clube group flex flex-col gap-1.5 no-underline hover:no-underline"
                >
                  <span className="rounded-full bg-clube-gold/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-clube-gold-deep self-start">
                    {b.idioma} · {b.licenca}
                  </span>
                  <h4 className="text-base font-semibold text-clube-teal-deep group-hover:text-clube-teal">
                    {b.titulo}
                  </h4>
                  <p className="text-xs text-clube-mist">
                    {b.autor} · {b.ano}
                  </p>
                  {b.notas && (
                    <p className="text-[11px] italic text-clube-mist/80">{b.notas}</p>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sem resultados */}
      {q.trim().length >= 2 &&
        licoes.length === 0 &&
        livrosFiltrados.length === 0 && (
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-clube-clay/30 bg-clube-clay/5 p-6 text-center text-sm text-clube-clay">
            {t('search.no.results')} "{q}".
          </div>
        )}
    </section>
  )
}
