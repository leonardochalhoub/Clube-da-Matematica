import type { Metadata } from 'next'
import Link from 'next/link'
import { carregarTodosConteudos } from '@/lib/content/loader'

export const metadata: Metadata = {
  title: 'Finanças Quantitativas',
  description:
    'Black-Scholes e a matemática que opera mesa de derivativos em São Paulo, Tóquio e Londres. Demonstração viva de para onde a matemática do ensino médio leva.',
}

export default function FinancasPage() {
  const todos = carregarTodosConteudos()
  const financas = todos.filter(
    (c) => c.meta.categoria === 'financas-quantitativas',
  )

  return (
    <article className="container-clube max-w-5xl py-12 sm:py-16">
      <header className="mb-12">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
          Finanças Quantitativas
        </p>
        <h1 className="text-display font-extrabold text-clube-teal-deep">
          A matemática que opera derivativos
        </h1>
        <p className="mt-6 max-w-prose text-lg leading-relaxed text-clube-mist">
          Aqui está o destino do programa de ensino médio. Toda matemática
          que ensinamos — funções, derivadas, integrais, logaritmos,
          probabilidade — converge em <strong>uma única equação</strong> que
          ganhou o Prêmio Nobel de Economia em 1997 e move bilhões de dólares
          por dia em mesa de derivativos do mundo inteiro.
        </p>
        <p className="mt-4 max-w-prose text-base text-clube-mist/85">
          Esta seção não é prioridade de expansão (foco hoje é{' '}
          <Link href="/ensino-medio" className="text-clube-teal">
            Ensino Médio Otimizado
          </Link>
          ), mas serve como <strong>demonstração viva</strong> de que a
          matemática que vamos ensinar é real, é a mesma usada em São Paulo,
          Tóquio e Londres, e tem aplicação imediata.
        </p>
      </header>

      <section className="mb-12 overflow-hidden rounded-2xl border-2 border-clube-gold/30 bg-gradient-to-b from-clube-cream-soft to-clube-surface p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
          Página em destaque
        </p>
        <h2 className="mt-2 text-3xl font-extrabold text-clube-teal-deep">
          Equação de Black-Scholes
        </h2>
        <p className="mt-3 text-clube-mist">
          A peça mais completa do site. <strong>6 portas + porta prática</strong>{' '}
          com 4 cenários reais usando dados de mercado da B3 (PETR4 em
          24/04/2026). Inclui derivação via lema de Itô, paridade put-call,
          os 4 Greeks principais (Δ, Γ, ν, Θ) e diagramas de payoff
          interativos.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/financas-quantitativas/opcoes/black-scholes/"
            className="inline-flex items-center gap-2 rounded-full bg-clube-teal px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-clube-teal-deep hover:no-underline hover:shadow"
          >
            Abrir página completa
            <span aria-hidden>→</span>
          </Link>
          <a
            href="https://www.nobelprize.org/prizes/economic-sciences/1997/summary/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-clube-mist-soft/60 bg-clube-surface px-5 py-2.5 font-semibold text-clube-ink transition-all hover:border-clube-teal hover:text-clube-teal hover:no-underline"
          >
            Nobel de Economia 1997 (oficial)
          </a>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-clube-teal-deep">
          Conteúdos publicados em Finanças
        </h2>
        {financas.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-clube-mist-soft p-10 text-center text-clube-mist">
            Nenhum conteúdo de Finanças publicado ainda.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {financas.map(({ meta, caminho }) => (
              <Link
                key={meta.slug}
                href={`/${caminho}/`}
                className="card-clube no-underline hover:no-underline"
              >
                <div className="text-xs uppercase tracking-wider text-clube-gold-deep">
                  {meta.subcategoria}
                </div>
                <h3 className="mt-1 text-lg font-semibold leading-snug text-clube-teal-deep">
                  {meta.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-clube-mist">
                  {meta.descricao}
                </p>
                {meta.usadoEm.length > 0 && (
                  <div className="mt-3 text-xs text-clube-mist/80">
                    Usado em: {meta.usadoEm.join(' · ')}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-clube-cream-soft p-6 text-sm text-clube-mist">
        <h3 className="text-base font-bold text-clube-teal-deep">
          Pré-requisitos para entender Black-Scholes
        </h3>
        <p className="mt-2">
          Para chegar na porta formal, você precisa do{' '}
          <Link
            href="/ensino-medio/ano-3/"
            className="font-semibold text-clube-teal"
          >
            Ano 3 do Ensino Médio
          </Link>{' '}
          completo — em particular: <em>derivada</em>, <em>integral</em>,{' '}
          <em>logaritmo natural</em>, <em>distribuição normal</em>. As portas
          5/10/15 da página de Black-Scholes funcionam <strong>sem
          pré-requisito</strong>: criança de 5 anos consegue acompanhar o
          conceito por analogia de figurinhas, e adolescente de 15 com a
          analogia de skin de jogo.
        </p>
      </section>
    </article>
  )
}
