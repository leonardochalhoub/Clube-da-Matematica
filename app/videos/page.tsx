import type { Metadata } from 'next'
import Link from 'next/link'
import { VIDEOS, getEmbedUrl, getThumbnail } from '@/content/videos-data'

export const metadata: Metadata = {
  title: 'Vídeos públicos curados',
  description:
    'Playlists do YouTube curadas para apoiar o programa do Clube da Matemática — em português, inglês, e outros idiomas. Tudo gratuito.',
}

const BANDEIRAS: Record<string, string> = {
  'PT-BR': '🇧🇷 PT-BR',
  EN: '🇺🇸 EN',
  IT: '🇮🇹 IT',
  ES: '🇪🇸 ES',
  FR: '🇫🇷 FR',
  JP: '🇯🇵 JP',
  DE: '🇩🇪 DE',
}

export default function VideosPage() {
  return (
    <article className="container-clube max-w-5xl py-12 sm:py-16">
      <header className="mb-12">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
          Vídeos públicos
        </p>
        <h1 className="text-display font-extrabold text-clube-teal-deep">
          Vídeos curados do YouTube
        </h1>
        <p className="mt-6 max-w-prose text-lg leading-relaxed text-clube-mist">
          Playlists e vídeos públicos do YouTube selecionados como{' '}
          <strong>apoio ao programa</strong>. Não substituem as aulas e
          exercícios — complementam com explicações visuais e narrativas
          alternativas.
        </p>
        <p className="mt-3 max-w-prose text-base text-clube-mist/85">
          Curadoria do <Link href="/manifesto" className="text-clube-teal">Clube</Link>.
          Tudo grátis, no canal do criador. Para adicionar uma sugestão,{' '}
          <a
            href="https://github.com/leonardochalhoub/Clube-da-Matematica/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-clube-teal"
          >
            abra uma issue no GitHub
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
                    alt={`Thumbnail de ${v.titulo}`}
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
              {v.topicosCobertos.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-clube-gold/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-clube-gold-deep"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-1 text-xs italic text-clube-mist/70">
              Cobre: {v.cobertura}
            </p>
          </article>
        ))}
      </div>

      <footer className="mt-16 rounded-2xl bg-clube-cream-soft p-6 text-sm text-clube-mist">
        <h3 className="text-base font-bold text-clube-teal-deep">
          Como contribuir
        </h3>
        <p className="mt-2">
          Para sugerir uma playlist ou vídeo, abra uma issue ou pull request
          em{' '}
          <a
            href="https://github.com/leonardochalhoub/Clube-da-Matematica"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-clube-teal"
          >
            github.com/leonardochalhoub/Clube-da-Matematica
          </a>
          . Critérios de curadoria: (a) público no YouTube, (b) qualidade
          pedagógica, (c) cobertura de tópico do programa, (d) preferência
          por PT-BR ou EN.
        </p>
      </footer>
    </article>
  )
}
