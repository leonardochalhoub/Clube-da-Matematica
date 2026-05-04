'use client'

import Link from 'next/link'
import { SECOES, type Idioma, type Livro } from '@/content/livros-data'
import { useLocale } from '@/components/layout/LocaleProvider'

const BANDEIRA_IDIOMA: Record<Idioma, string> = {
  'PT-BR': '🇧🇷 PT-BR',
  EN: '🇺🇸 EN',
  IT: '🇮🇹 IT',
  FR: '🇫🇷 FR',
  JP: '🇯🇵 JP',
  KR: '🇰🇷 KR',
  CN: '🇨🇳 CN',
  RU: '🇷🇺 RU',
  DE: '🇩🇪 DE',
  ES: '🇪🇸 ES',
  VN: '🇻🇳 VN',
  LA: '🏛️ Latim',
}

function totalLivros(): number {
  return SECOES.reduce((acc, s) => acc + s.livros.length, 0)
}

function LivroLinha({ livro }: { livro: Livro }) {
  return (
    <li className="rounded-lg border border-clube-mist-soft/30 bg-clube-surface px-3 py-2.5">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <a
          href={livro.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-clube-teal hover:text-clube-teal-deep"
          lang={livro.idioma === 'JP' ? 'ja' : livro.idioma === 'CN' ? 'zh' : livro.idioma === 'FR' ? 'fr' : livro.idioma === 'IT' ? 'it' : livro.idioma === 'DE' ? 'de' : livro.idioma === 'PT-BR' ? 'pt-BR' : undefined}
        >
          {livro.titulo} →
        </a>
        <span className="font-mono text-[11px] text-clube-mist">
          ({livro.ano})
        </span>
        <span className="text-xs text-clube-mist">— {livro.autor}</span>
        <span className="ml-auto inline-flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-clube-cream-soft px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-clube-teal-deep">
            {BANDEIRA_IDIOMA[livro.idioma]}
          </span>
          <span className="rounded-full bg-clube-gold/15 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-clube-gold-deep">
            {livro.licenca}
          </span>
        </span>
      </div>
      {livro.notas && (
        <p className="mt-1 text-xs text-clube-mist">{livro.notas}</p>
      )}
    </li>
  )
}

export default function LivrosContent() {
  const { t } = useLocale()

  return (
    <article className="container-clube max-w-5xl py-12 sm:py-16">
      <header className="mb-12">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
          {t('page.books.eyebrow')}
        </p>
        <h1 className="text-display font-extrabold text-clube-teal-deep">
          {t('page.books.title')}
        </h1>
        <p className="mt-4 max-w-prose text-lg leading-relaxed text-clube-mist">
          {t('page.books.intro1.before')}{' '}
          <strong>{t('page.books.intro1.strong1')}</strong>
          {t('page.books.intro1.middle1')}{' '}
          <strong>{t('page.books.intro1.strong2')}</strong>{' '}
          {t('page.books.intro1.middle2')}{' '}
          <strong>{t('page.books.intro1.or')}</strong>{' '}
          {t('page.books.intro1.middle3')}
          <strong> {t('page.books.intro1.strong3')}</strong>{' '}
          {t('page.books.intro1.after')}
        </p>
        <p className="mt-3 max-w-prose text-base text-clube-mist/85">
          {t('page.books.intro2.before')}{' '}
          <Link href="/ensino-medio" className="text-clube-teal">
            {t('page.books.intro2.linkText')}
          </Link>
          {t('page.books.intro2.after')}
        </p>
      </header>

      <section className="mb-10 grid gap-3 sm:grid-cols-3">
        <div className="card-clube text-center">
          <div className="text-3xl font-extrabold text-clube-teal-deep">
            {totalLivros()}
          </div>
          <div className="mt-1 text-xs text-clube-mist">
            {t('page.books.stats.booksHere')}
          </div>
        </div>
        <div className="card-clube text-center">
          <div className="text-3xl font-extrabold text-clube-leaf">12</div>
          <div className="mt-1 text-xs text-clube-mist">
            {t('page.books.stats.languages')}
          </div>
        </div>
        <div className="card-clube text-center">
          <div className="text-3xl font-extrabold text-clube-gold-deep">100%</div>
          <div className="mt-1 text-xs text-clube-mist">
            {t('page.books.stats.freeAndLegal')}
          </div>
        </div>
      </section>

      <section className="mb-10 rounded-2xl border-l-4 border-clube-teal bg-clube-cream-soft p-6">
        <h2 className="text-lg font-bold text-clube-teal-deep">
          {t('page.books.howWeKnow.title')}
        </h2>
        <p className="mt-2 text-sm text-clube-ink/85">
          {t('page.books.howWeKnow.intro')}
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-clube-ink/85">
          <li>
            <strong>CC-BY / CC-BY-SA / CC-BY-NC / CC-BY-NC-SA</strong>{' '}
            {t('page.books.howWeKnow.cc')}
          </li>
          <li>
            <strong>GFDL</strong>{' '}
            {t('page.books.howWeKnow.gfdl')}
          </li>
          <li>
            <strong>CC0 / PD</strong>{' '}
            {t('page.books.howWeKnow.cc0')}
          </li>
          <li>
            <strong>{t('page.books.howWeKnow.authorFreeLabel')}</strong>{' '}
            {t('page.books.howWeKnow.authorFreeBody')}
          </li>
        </ul>
        <p className="mt-3 text-sm text-clube-ink/85">
          {t('page.books.howWeKnow.catalogBefore')}{' '}
          <a
            href="https://github.com/leonardochalhoub/Clube-da-Matematica/blob/main/livros/CATALOG.md"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-clube-teal"
          >
            livros/CATALOG.md
          </a>{' '}
          {t('page.books.howWeKnow.catalogAfter')}
        </p>
      </section>

      <nav aria-label={t('page.books.jumpTo.label')} className="mb-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-clube-mist">
          {t('page.books.jumpTo.title')}
        </p>
        <ul className="flex flex-wrap gap-2 text-xs">
          {SECOES.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="rounded-full border border-clube-mist-soft/60 bg-clube-surface px-3 py-1 font-semibold text-clube-ink/85 hover:border-clube-teal hover:text-clube-teal hover:no-underline"
              >
                {s.titulo}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-12">
        {SECOES.map((s) => (
          <section
            key={s.id}
            id={s.id}
            aria-labelledby={`${s.id}-titulo`}
            className="scroll-mt-24"
          >
            <header className="mb-4 border-l-4 border-clube-gold pl-4">
              <h2
                id={`${s.id}-titulo`}
                className="text-2xl font-extrabold text-clube-teal-deep"
              >
                {s.titulo}
              </h2>
              <p className="mt-1 text-sm text-clube-mist">{s.descricao}</p>
              <p className="mt-1 text-xs text-clube-mist/70">
                {s.livros.length} {t('page.books.section.booksInSection')}
              </p>
            </header>
            <ul className="space-y-2">
              {s.livros.map((livro) => (
                <LivroLinha key={livro.url} livro={livro} />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="mt-16 rounded-2xl bg-clube-cream-soft p-6 text-sm text-clube-mist">
        <h3 className="text-base font-bold text-clube-teal-deep">
          {t('page.books.contribute.title')}
        </h3>
        <p className="mt-2">
          {t('page.books.contribute.before')}{' '}
          <a
            href="https://github.com/leonardochalhoub/Clube-da-Matematica"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-clube-teal"
          >
            github.com/leonardochalhoub/Clube-da-Matematica
          </a>
          {t('page.books.contribute.after')}
        </p>
      </footer>
    </article>
  )
}
