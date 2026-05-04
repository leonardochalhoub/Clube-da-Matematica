'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useLocale } from './LocaleProvider'
import { CATEGORIAS_LABEL } from '@/content/schema'
import type { Conteudo } from '@/content/schema'

interface LessonPageShellProps {
  meta: Conteudo
  isAula: boolean
  isFinancas: boolean
  /** O `<MDXContent />` renderizado pelo server component. */
  children: ReactNode
}

/**
 * Shell client-side do template de cada lição.
 * - Breadcrumb, header, footer e link de issue traduzidos via useLocale().t().
 * - Recebe o componente MDX já resolvido via `children` (server component carrega).
 */
export function LessonPageShell({
  meta,
  isAula,
  isFinancas,
  children,
}: LessonPageShellProps) {
  const { t } = useLocale()

  return (
    <article className="container-clube max-w-prose-wide py-12 sm:py-16">
      <nav aria-label={t('lesson.nav.aria')} className="mb-6 text-sm text-clube-mist">
        <Link href="/" className="hover:text-clube-teal">
          {t('lesson.breadcrumb.home')}
        </Link>
        <span className="mx-2">/</span>
        {isAula ? (
          <Link href="/ensino-medio" className="hover:text-clube-teal">
            {t('nav.middleSchool')}
          </Link>
        ) : isFinancas ? (
          <Link href="/financas" className="hover:text-clube-teal">
            {t('nav.finance')}
          </Link>
        ) : (
          <span className="text-clube-ink/70">
            {CATEGORIAS_LABEL[meta.categoria]}
          </span>
        )}
        <span className="mx-2">/</span>
        <span className="text-clube-ink/70">{meta.titulo}</span>
      </nav>

      <header className="mb-10 border-b border-clube-mist-soft/40 pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
          {CATEGORIAS_LABEL[meta.categoria]}
        </p>
        <h1 className="text-hero font-extrabold leading-tight text-clube-teal-deep">
          {meta.titulo}
        </h1>
        <p className="mt-3 text-lg text-clube-mist">{meta.descricao}</p>
        {meta.usadoEm.length > 0 && (
          <p className="mt-4 text-sm text-clube-mist">
            <span className="font-semibold text-clube-ink/70">
              {t('lesson.usedIn')}
            </span>{' '}
            {meta.usadoEm.join(' · ')}
          </p>
        )}
      </header>

      <div className="prose prose-clube max-w-none">{children}</div>

      <footer className="mt-16 border-t border-clube-mist-soft/40 pt-6 text-sm text-clube-mist">
        <p>
          {t('lesson.updated')} {meta.atualizadoEm} · {t('lesson.authors')}{' '}
          {meta.autores.join(', ')}
        </p>
        <p className="mt-2">
          {t('lesson.error.title')}{' '}
          <a
            href="https://github.com/leonardochalhoub/Clube-da-Matematica/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-clube-teal"
          >
            {t('lesson.error.linkIssue')}
          </a>{' '}
          {t('lesson.error.body')}
        </p>
      </footer>
    </article>
  )
}
