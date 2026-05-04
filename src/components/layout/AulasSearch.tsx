'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  PROGRAMA_EM,
  type Aula,
  MATERIAS_LABEL,
} from '@/content/programa-em'
import { useLocale } from '@/components/layout/LocaleProvider'

interface AulaCompleta extends Aula {
  ano: number
  trim: number
  caminho?: string
}

interface AulasSearchProps {
  /** Map de slug → caminho completo (montado server-side). */
  caminhos: Record<string, string>
}

function flattenAulas(caminhos: Record<string, string>): AulaCompleta[] {
  const out: AulaCompleta[] = []
  for (const ano of PROGRAMA_EM) {
    for (const t of ano.trimestres) {
      for (const a of t.aulas) {
        out.push({
          ...a,
          ano: ano.num,
          trim: t.num,
          caminho: a.slug ? caminhos[a.slug] : undefined,
        })
      }
    }
  }
  return out
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function AulasSearch({ caminhos }: AulasSearchProps) {
  const { t } = useLocale()
  const [query, setQuery] = useState('')
  const todasAulas = useMemo(() => flattenAulas(caminhos), [caminhos])

  const filtered = useMemo(() => {
    if (!query.trim()) return []
    const q = normalize(query.trim())
    return todasAulas
      .filter((a) => {
        const haystack = normalize(
          [a.titulo, a.topicos, MATERIAS_LABEL[a.materia], `aula ${a.num}`, `ano ${a.ano}`, `trim ${a.trim}`].join(' '),
        )
        return haystack.includes(q)
      })
      .slice(0, 30)
  }, [query, todasAulas])

  return (
    <div className="not-prose">
      <label
        htmlFor="aulas-search"
        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-clube-gold-deep"
      >
        {t('aulasSearch.label')}
      </label>
      <input
        id="aulas-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('aulasSearch.placeholder')}
        className="w-full rounded-full border border-clube-mist-soft/60 bg-clube-surface px-4 py-2.5 text-sm text-clube-ink shadow-sm focus:border-clube-teal focus:outline-none"
      />

      {query.trim() && (
        <div className="mt-4">
          {filtered.length === 0 ? (
            <p className="rounded-lg bg-clube-cream-soft px-4 py-3 text-sm italic text-clube-mist">
              {t('aulasSearch.noResultsPrefix')} "{query}". {t('aulasSearch.noResultsHint')}
            </p>
          ) : (
            <>
              <p className="mb-2 text-xs uppercase tracking-wider text-clube-mist">
                {filtered.length}{' '}
                {filtered.length === 1
                  ? t('aulasSearch.resultsSingular')
                  : t('aulasSearch.resultsPlural')}
              </p>
              <ul className="space-y-1.5">
                {filtered.map((a) => {
                  const isPub = !!a.caminho
                  const Inner = (
                    <div className="flex items-baseline gap-2">
                      <span className="rounded-full bg-clube-cream-soft px-2 py-0.5 font-mono text-[10px] font-bold text-clube-teal-deep">
                        {t('aulasSearch.lesson')} {a.num}
                      </span>
                      <span className="text-sm font-semibold text-clube-ink">
                        {a.titulo}
                      </span>
                      <span className="ml-auto text-[10px] uppercase tracking-wider text-clube-mist">
                        {t('aulasSearch.year')} {a.ano} / {t('aulasSearch.term')} {a.trim} · {MATERIAS_LABEL[a.materia]}
                      </span>
                    </div>
                  )
                  return (
                    <li
                      key={a.num}
                      className="rounded-lg border border-clube-mist-soft/30 bg-clube-surface px-3 py-2"
                    >
                      {isPub && a.caminho ? (
                        <Link
                          href={`/${a.caminho}/`}
                          className="block no-underline hover:no-underline"
                        >
                          {Inner}
                        </Link>
                      ) : (
                        <div className="opacity-70">
                          {Inner}
                          <div className="mt-1 text-[10px] italic text-clube-mist">
                            {t('aulasSearch.plannedNote')}
                          </div>
                        </div>
                      )}
                      <p className="mt-1 text-xs text-clube-mist">
                        {a.topicos}
                      </p>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
