'use client'

import Link from 'next/link'
import { VIDEOS, getEmbedUrl, getThumbnail } from '@/content/videos-data'
import { useLocale } from '@/components/layout/LocaleProvider'

const BANDEIRAS: Record<string, string> = {
  'PT-BR': '🇧🇷 PT-BR',
  EN: '🇺🇸 EN',
  IT: '🇮🇹 IT',
  ES: '🇪🇸 ES',
  FR: '🇫🇷 FR',
  JP: '🇯🇵 JP',
  DE: '🇩🇪 DE',
}

export default function VideosContent() {
  const { t } = useLocale()

  return (
    <article className="container-clube max-w-5xl py-12 sm:py-16">
      <header className="mb-12">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
          {t('page.videos.eyebrow')}
        </p>
        <h1 className="text-display font-extrabold text-clube-teal-deep">
          {t('page.videos.title')}
        </h1>
        <p className="mt-6 max-w-prose text-lg leading-relaxed text-clube-mist">
          {t('page.videos.intro1.before')}{' '}
          <strong>{t('page.videos.intro1.strong')}</strong>
          {t('page.videos.intro1.after')}
        </p>
        <p className="mt-3 max-w-prose text-base text-clube-mist/85">
          {t('page.videos.intro2.curatedBy')}{' '}
          <Link href="/manifesto" className="text-clube-teal">
            {t('page.videos.intro2.clubLink')}
          </Link>
          {t('page.videos.intro2.middle')}{' '}
          <a
            href="https://github.com/leonardochalhoub/Clube-da-Matematica/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-clube-teal"
          >
            {t('page.videos.intro2.openIssue')}
          </a>
          .
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {VIDEOS.map((v) => (
          <article
            key={v.url}
            className="card-clube flex flex-col gap-3"
          >
            {/* Embed responsivo se for playlist */}
            {v.playlistId ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                <iframe
                  src={getEmbedUrl(v.playlistId)}
                  title={v.titulo}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            ) : (
              v.videoId &&
              getThumbnail(v.videoId) && (
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-video w-full overflow-hidden rounded-lg bg-black no-underline"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getThumbnail(v.videoId)!}
                    alt={`${t('page.videos.thumb.alt')} ${v.titulo}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </a>
              )
            )}

            <div className="flex flex-wrap items-baseline gap-2">
              <a
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-clube-teal-deep hover:text-clube-teal"
              >
                {v.titulo} →
              </a>
              <span className="rounded-full bg-clube-cream-soft px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-clube-teal-deep">
                {BANDEIRAS[v.idioma]}
              </span>
            </div>

            <p className="text-xs text-clube-mist">— {v.canal}</p>
            <p className="text-sm leading-relaxed text-clube-ink/85">
              {v.descricao}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {v.topicosCobertos.map((topico) => (
                <span
                  key={topico}
                  className="rounded-full bg-clube-gold/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-clube-gold-deep"
                >
                  {topico}
                </span>
              ))}
            </div>
            <p className="mt-1 text-xs italic text-clube-mist/70">
              {t('page.videos.covers')} {v.cobertura}
            </p>
          </article>
        ))}
      </div>

      <footer className="mt-16 rounded-2xl bg-clube-cream-soft p-6 text-sm text-clube-mist">
        <h3 className="text-base font-bold text-clube-teal-deep">
          {t('page.videos.contribute.title')}
        </h3>
        <p className="mt-2">
          {t('page.videos.contribute.before')}{' '}
          <a
            href="https://github.com/leonardochalhoub/Clube-da-Matematica"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-clube-teal"
          >
            github.com/leonardochalhoub/Clube-da-Matematica
          </a>
          {t('page.videos.contribute.after')}
        </p>
      </footer>
    </article>
  )
}
