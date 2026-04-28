import Link from 'next/link'
import { publicadosApenas } from '@/lib/content/loader'
import { CATEGORIAS_LABEL } from '@/content/schema'

export default function HomePage() {
  const conteudos = publicadosApenas()

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-clube-mist-soft/30 bg-gradient-to-b from-clube-cream to-clube-cream-soft">
        <div className="container-clube py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="mb-4 inline-block rounded-full border border-clube-gold-deep/40 bg-clube-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
              Open source · gratuito · em português
            </p>
            <h1 className="font-sans text-display font-extrabold text-clube-teal-deep">
              Aprenda matemática
              <br />
              <span className="text-clube-teal">de verdade.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-clube-ink/80 sm:text-xl">
              Toda equação tem <strong className="text-clube-teal-deep">6 portas</strong>:
              a derivação formal e versões facilitadas para criança de 5,
              jovem de 15 e profissional de 40. Você escolhe a porta. Antes
              de ver a resposta, você prevê — erra, recebe correção, tenta
              de novo.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/conteudos"
                className="inline-flex items-center gap-2 rounded-full bg-clube-teal px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-clube-teal-deep hover:no-underline hover:shadow"
              >
                Ver todos os conteúdos
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/manifesto"
                className="inline-flex items-center gap-2 rounded-full border border-clube-mist-soft/60 bg-clube-surface px-5 py-2.5 font-semibold text-clube-ink transition-all hover:-translate-y-0.5 hover:border-clube-teal hover:text-clube-teal hover:no-underline"
              >
                Ler o manifesto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* O que tem aqui */}
      <section className="container-clube py-16 sm:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-hero font-bold text-clube-teal-deep">
              O que tem aqui
            </h2>
            <p className="mt-2 max-w-prose text-clube-mist">
              Disciplinas que aparecem nas grades de engenharia das melhores
              federais brasileiras (USP, ITA, UFRGS) e internacionais (MIT,
              Tsinghua, ETH).
            </p>
          </div>
          <Link
            href="/conteudos"
            className="hidden whitespace-nowrap text-sm font-semibold text-clube-teal hover:text-clube-teal-deep sm:inline"
          >
            Ver todos →
          </Link>
        </div>

        {conteudos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-clube-mist-soft p-10 text-center text-clube-mist">
            Conteúdos sendo escritos. Volte em breve — ou{' '}
            <a
              href="https://github.com/leonardochalhoub/Clube-da-Matematica"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-clube-teal"
            >
              contribua no GitHub
            </a>
            .
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {conteudos.map(({ meta, caminho }) => (
              <Link
                key={meta.slug}
                href={`/${caminho}/`}
                className="card-clube group flex flex-col gap-3 no-underline hover:no-underline"
              >
                <span className="inline-block self-start rounded-full bg-clube-cream-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-clube-teal">
                  {CATEGORIAS_LABEL[meta.categoria]}
                </span>
                <h3 className="text-xl font-semibold leading-tight text-clube-teal-deep group-hover:text-clube-teal">
                  {meta.titulo}
                </h3>
                <p className="text-sm leading-relaxed text-clube-mist">
                  {meta.descricao}
                </p>
                {meta.usadoEm.length > 0 && (
                  <div className="mt-auto pt-3 text-xs text-clube-mist/80">
                    Usado em: {meta.usadoEm.join(' · ')}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Filosofia */}
      <section className="border-y border-clube-mist-soft/30 bg-clube-cream-soft py-16">
        <div className="container-clube grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-clube-teal-deep">
              Não competimos com Khan
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-clube-ink/80">
              Khan ensina conta. A gente ensina <em>o que</em> a conta diz
              sobre o mundo. São produtos de naturezas diferentes.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-clube-teal-deep">
              6 portas em todo conteúdo
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-clube-ink/80">
              Formal, 5, 10, 15, 25, 40 — você escolhe a porta. Não importa
              se você reprovou em Cálculo ou ainda não viu derivada na
              escola.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-clube-teal-deep">
              Open source pra sempre
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-clube-ink/80">
              Sem login. Sem paywall. Conhecimento que muda a cabeça das
              pessoas não pode ter porteiro.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
