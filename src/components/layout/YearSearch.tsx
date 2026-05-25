'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Aula } from '@/content/programa-em'
import { useLocale } from './LocaleProvider'
import { localizedHref } from '@/lib/i18n/href'
import { licaoTitulo } from '@/content/programa-em-licao-i18n.generated'

interface YearSearchProps {
  /** All Aulas of this year, with optional caminho if published. */
  aulas: Array<Aula & { caminho?: string; trimNum: number }>
  anoNum: number
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function YearSearch({ aulas, anoNum }: YearSearchProps) {
  const { t, locale } = useLocale()
  const [query, setQuery] = useState('')
  const trimmed = query.trim()

  const localizedAulas = useMemo(
    () =>
      aulas.map((a) => ({
        ...a,
        tituloLocalizado: licaoTitulo(a.num, locale, a.titulo),
      })),
    [aulas, locale],
  )

  const results = useMemo(() => {
    if (trimmed.length < 2) return []
    const q = normalize(trimmed)
    return localizedAulas
      .filter((a) => {
        const haystack = normalize(
          `${a.num} ${a.titulo} ${a.tituloLocalizado} ${a.topicos ?? ''}`,
        )
        return haystack.includes(q)
      })
      .slice(0, 12)
  }, [localizedAulas, trimmed])

  const termShort = t('em.term.short', 'Trim')
  const placeholder = t(
    'page.ano.search.placeholder',
    'ex.: função quadrática, matrizes, vetores…',
  )
  const ariaLabel = t('page.ano.search.aria', 'Buscar lição no ano').replace(
    '{n}',
    String(anoNum),
  )

  return (
    <section className="mb-10">
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-clube-mist">
          {t('page.ano.search.label', 'Buscar lição neste ano')}
        </span>
        <input
          type="search"
          inputMode="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-clube-mist-soft/40 bg-clube-surface px-4 py-3 text-sm text-clube-ink placeholder:text-clube-mist/60 focus:border-clube-teal focus:outline-none focus:ring-2 focus:ring-clube-teal/30"
          aria-label={`${ariaLabel} ${anoNum}`}
        />
      </label>

      {trimmed.length >= 2 && (
        <div className="mt-3 rounded-xl border border-clube-mist-soft/40 bg-clube-surface p-2">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-sm text-clube-mist">
              {t('page.ano.search.empty', 'Nenhuma lição encontrada para')} "{trimmed}".
            </p>
          ) : (
            <ul className="divide-y divide-clube-mist-soft/30">
              {results.map((a) => (
                <li key={`${a.trimNum}-${a.num}`}>
                  {a.caminho ? (
                    <Link
                      href={localizedHref(a.caminho, locale)}
                      className="flex items-baseline gap-3 px-3 py-2 text-sm no-underline hover:bg-clube-cream-soft hover:no-underline"
                    >
                      <span className="font-mono text-xs font-bold text-clube-teal-deep">
                        L{a.num}
                      </span>
                      <span className="flex-1 text-clube-ink">
                        {a.tituloLocalizado}
                      </span>
                      <span className="text-xs text-clube-mist">
                        {termShort} {a.trimNum}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex items-baseline gap-3 px-3 py-2 text-sm">
                      <span className="font-mono text-xs font-bold text-clube-mist">
                        L{a.num}
                      </span>
                      <span className="flex-1 text-clube-mist">
                        {a.tituloLocalizado}
                      </span>
                      <span className="rounded-full bg-clube-clay/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-clube-clay">
                        {t('page.ano.search.soon', 'em breve')}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
