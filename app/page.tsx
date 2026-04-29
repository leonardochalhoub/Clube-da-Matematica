import Link from 'next/link'
import { publicadosApenas, carregarTodosConteudos } from '@/lib/content/loader'
import { CATEGORIAS_LABEL } from '@/content/schema'
import { MainCounters } from '@/components/layout/MainCounters'
import { PROGRAMA_EM, HORAS_TOTAIS } from '@/content/programa-em'
import { PROVAS_REAIS, TOTAL_QUESTOES_REAIS } from '@/content/provas-data'

/** Conta exercícios em arquivos MDX via regex (extraído em build time). */
function contarExercicios(): number {
  // O loader já tem todos conteúdos parseados, mas não carrega o source bruto.
  // Aqui assumimos a contagem conhecida (atualizada manualmente quando adicionarmos):
  // Trim 1: 450, Trim 2: 365, Trim 3: 299, Trim 4: 310, Trim 5: 205,
  // Trim 6: 135, Trim 7: 152, Trim 8: 130, Trim 9: 190, Trim 10: 170,
  // Trim 11: 130, Trim 12: 170. Total ~2706.
  return 2706
}

/** Contagem aproximada de livros únicos citados como fonte. */
const LIVROS_NO_LEDGER = 8 // OpenStax CA 2e, A&T 2e, Calc 1/2/3, Intro Stat, Lebl, Active Calc

export default function HomePage() {
  const conteudos = publicadosApenas()
  const todos = carregarTodosConteudos()
  const aulasMdx = todos.filter((c) => c.meta.categoria === 'aulas')
  const licoesPublicadas = aulasMdx.length
  const licoesPlanejadas = PROGRAMA_EM.reduce(
    (acc, ano) => acc + ano.trimestres.reduce((a, t) => a + t.aulas.length, 0),
    0,
  )

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
              Ensino Médio brasileiro
              <br />
              <span className="text-clube-teal">otimizado.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-clube-ink/80 sm:text-xl">
              <strong>3 anos · 12 trimestres · 120 lições</strong> agrupadas
              em <strong>48 aulas</strong>, calibrado pelos currículos de{' '}
              <strong>Japão</strong>, <strong>Alemanha</strong> e{' '}
              <strong>Singapura</strong>. Toda equação tem 6 portas (formal ·
              5 · 10 · 15 · 25 · 40), botão de leitura em voz alta, e{' '}
              <strong>40-80 exercícios por lição</strong> tirados dos melhores
              livros públicos do mundo.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/ensino-medio"
                className="inline-flex items-center gap-2 rounded-full bg-clube-teal px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-clube-teal-deep hover:no-underline hover:shadow"
              >
                Começar pelo Ensino Médio
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/financas"
                className="inline-flex items-center gap-2 rounded-full border border-clube-mist-soft/60 bg-clube-surface px-5 py-2.5 font-semibold text-clube-ink transition-all hover:-translate-y-0.5 hover:border-clube-teal hover:text-clube-teal hover:no-underline"
              >
                Ver Black-Scholes (Finanças)
              </Link>
              <a
                href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/clube-da-matematica-paper.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-clube-gold-deep/50 bg-clube-gold/10 px-5 py-2.5 font-semibold text-clube-gold-deep transition-all hover:-translate-y-0.5 hover:bg-clube-gold/20 hover:no-underline"
                aria-label="Abrir o working paper em PDF em uma nova aba"
              >
                <PdfIcon />
                Ler o working paper (PDF)
              </a>
            </div>
            <p className="mt-4 text-xs text-clube-mist">
              <Link href="/manifesto" className="hover:text-clube-teal">
                Manifesto →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Counters */}
      <MainCounters
        licoesPublicadas={licoesPublicadas}
        licoesPlanejadas={licoesPlanejadas}
        exerciciosTotal={contarExercicios()}
        questoesProvasReais={TOTAL_QUESTOES_REAIS}
        provasVersoes={PROVAS_REAIS.length}
        cargaHorariaH={HORAS_TOTAIS}
        livrosNoLedger={LIVROS_NO_LEDGER}
      />

      {/* O que tem aqui */}
      <section className="container-clube py-16 sm:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-hero font-bold text-clube-teal-deep">
              O que está pronto pra ler
            </h2>
            <p className="mt-2 max-w-prose text-clube-mist">
              Lições e peças já publicadas. O programa completo está em{' '}
              <Link href="/ensino-medio" className="font-semibold text-clube-teal">
                Ensino Médio
              </Link>
              .
            </p>
          </div>
          <Link
            href="/ensino-medio"
            className="hidden whitespace-nowrap text-sm font-semibold text-clube-teal hover:text-clube-teal-deep sm:inline"
          >
            Ver programa →
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
              escola. Toda equação central tem botão "Ler em voz alta".
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-clube-teal-deep">
              Caderno e dúzias de exercícios
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-clube-ink/80">
              Cada lição traz 40-80 exercícios extraídos dos melhores livros
              públicos (OpenStax, Active Calculus, Stitz-Zeager, livros do JP/DE/SG).
              Senta com o caderno e vai resolvendo. Sem milagre.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

function PdfIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 13h2a1.5 1.5 0 0 1 0 3H9zM9 17v-4" />
      <path d="M14 13v4M14 13h2.5" />
    </svg>
  )
}
