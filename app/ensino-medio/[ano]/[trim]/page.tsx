import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { carregarTodosConteudos } from '@/lib/content/loader'
import {
  PROGRAMA_EM,
  HORAS_POR_TRIMESTRE,
  type Trimestre,
  type Licao,
  type AulaAgrupada,
} from '@/content/programa-em'

interface PageProps {
  params: Promise<{ ano: string; trim: string }>
}

function numFromAnoSlug(slug: string): number | null {
  const m = slug.match(/^ano-(\d+)$/)
  return m ? Number(m[1]) : null
}
function numFromTrimSlug(slug: string): number | null {
  const m = slug.match(/^trim-(\d+)$/)
  return m ? Number(m[1]) : null
}

export function generateStaticParams() {
  const out: { ano: string; trim: string }[] = []
  for (const a of PROGRAMA_EM) {
    for (const t of a.trimestres) {
      out.push({ ano: `ano-${a.num}`, trim: `trim-${t.num}` })
    }
  }
  return out
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { ano, trim } = await params
  const anoNum = numFromAnoSlug(ano)
  const trimNum = numFromTrimSlug(trim)
  const a = PROGRAMA_EM.find((x) => x.num === anoNum)
  const t = a?.trimestres.find((x) => x.num === trimNum)
  if (!t) return { title: 'Trimestre' }
  return { title: t.titulo, description: t.foco }
}

export default async function TrimPage({ params }: PageProps) {
  const { ano, trim } = await params
  const anoNum = numFromAnoSlug(ano)
  const trimNum = numFromTrimSlug(trim)
  const a = PROGRAMA_EM.find((x) => x.num === anoNum)
  const t = a?.trimestres.find((x) => x.num === trimNum)
  if (!a || !t) notFound()

  const todos = carregarTodosConteudos()
  const slugToCaminho = new Map(
    todos
      .filter((c) => c.meta.categoria === 'aulas')
      .map((c) => [c.meta.slug, c.caminho]),
  )

  const licoes = t.aulas
  const agrupamento = t.agrupamento ?? []

  const licoesPublicadas = licoes.filter(
    (l) => l.slug && slugToCaminho.has(l.slug),
  ).length

  return (
    <article className="container-clube max-w-5xl py-12 sm:py-16">
      <nav aria-label="Trilha" className="mb-6 text-sm text-clube-mist">
        <Link
          href="/ensino-medio"
          className="text-clube-teal hover:text-clube-teal-deep"
        >
          Ensino Médio
        </Link>{' '}
        /{' '}
        <Link
          href={`/ensino-medio/ano-${a.num}/`}
          className="text-clube-teal hover:text-clube-teal-deep"
        >
          Ano {a.num}
        </Link>{' '}
        / Trimestre {t.num}
      </nav>

      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
          Trimestre {t.num} · Ano {a.num}
        </p>
        <h1 className="text-display font-extrabold text-clube-teal-deep">
          {t.titulo}
        </h1>
        <p className="mt-4 max-w-prose text-lg italic text-clube-mist">
          {t.foco}
        </p>
      </header>

      <section className="mb-10 grid gap-3 sm:grid-cols-3">
        <div className="card-clube text-center">
          <div className="text-2xl font-extrabold text-clube-teal-deep">
            {licoes.length}
          </div>
          <div className="mt-1 text-xs text-clube-mist">lições no trimestre</div>
        </div>
        <div className="card-clube text-center">
          <div className="text-2xl font-extrabold text-clube-leaf">
            {licoesPublicadas}
          </div>
          <div className="mt-1 text-xs text-clube-mist">já publicadas</div>
        </div>
        <div className="card-clube text-center">
          <div className="text-2xl font-extrabold text-clube-clay">
            ~{HORAS_POR_TRIMESTRE}h
          </div>
          <div className="mt-1 text-xs text-clube-mist">estudo total</div>
        </div>
      </section>

      {agrupamento.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-clube-teal-deep">
            Aulas (agrupamento didático)
          </h2>
          <p className="mt-1 text-sm text-clube-mist">
            Cada Aula agrupa 2-5 Lições por tema. Clique numa Lição para
            estudar o conteúdo.
          </p>

          <div className="mt-6 space-y-6">
            {agrupamento.map((g, idx) => (
              <AulaCard
                key={g.id}
                aula={g}
                trimestre={t}
                slugToCaminho={slugToCaminho}
                indice={idx}
              />
            ))}
          </div>
        </section>
      )}

      {agrupamento.length === 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-clube-teal-deep">
            Lições do trimestre
          </h2>
          <p className="mt-1 text-sm text-clube-mist">
            Clique numa Lição para estudar o conteúdo.
          </p>
          <ol className="mt-4 space-y-2">
            {licoes.map((l) => (
              <LicaoLinha
                key={l.num}
                licao={l}
                slugToCaminho={slugToCaminho}
              />
            ))}
          </ol>
        </section>
      )}

      <section className="mt-12 rounded-2xl border-l-4 border-clube-teal bg-clube-cream-soft p-6">
        <h3 className="text-base font-bold text-clube-teal-deep">
          Avalie-se neste trimestre
        </h3>
        <p className="mt-2 text-sm text-clube-ink/85">
          Há <strong>10 versões de prova</strong> cobrindo este trimestre, cada
          uma com gabarito + explicação passo a passo. Faça uma após cada
          conjunto de lições.
        </p>
        <div className="mt-4">
          <Link
            href={`/provas?trim=${t.num}`}
            className="inline-flex items-center gap-2 rounded-full bg-clube-teal px-5 py-2 text-sm font-semibold text-white hover:bg-clube-teal-deep hover:no-underline"
          >
            Abrir provas do Trim {t.num} →
          </Link>
        </div>
      </section>

      <nav className="mt-10 grid gap-3 sm:grid-cols-2">
        {t.num > 1 && (
          <Link
            href={`/ensino-medio/${ano}/trim-${t.num - 1}/`}
            className="card-clube no-underline hover:no-underline"
          >
            <div className="text-xs uppercase tracking-wider text-clube-mist">
              ← Anterior
            </div>
            <div className="mt-1 font-semibold text-clube-teal-deep">
              Trimestre {t.num - 1}
            </div>
          </Link>
        )}
        {t.num < 12 && (
          <Link
            href={`/ensino-medio/${ano}/trim-${t.num + 1}/`}
            className="card-clube no-underline hover:no-underline sm:text-right"
          >
            <div className="text-xs uppercase tracking-wider text-clube-mist">
              Próximo →
            </div>
            <div className="mt-1 font-semibold text-clube-teal-deep">
              Trimestre {t.num + 1}
            </div>
          </Link>
        )}
      </nav>
    </article>
  )
}

function AulaCard({
  aula,
  trimestre,
  slugToCaminho,
  indice,
}: {
  aula: AulaAgrupada
  trimestre: Trimestre
  slugToCaminho: Map<string, string>
  indice: number
}) {
  const licoes = aula.licoesNums
    .map((n) => trimestre.aulas.find((l) => l.num === n))
    .filter((l): l is Licao => !!l)

  const cores = ['border-clube-teal', 'border-clube-gold', 'border-clube-leaf', 'border-clube-clay']
  const corBorda = cores[indice % cores.length]

  return (
    <div className={`rounded-2xl border-l-4 ${corBorda} bg-clube-surface p-5 shadow-sm`}>
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-bold text-clube-teal-deep">
          {aula.titulo}
        </h3>
        <span className="rounded-full bg-clube-gold/15 px-3 py-1 text-xs font-mono uppercase tracking-wider text-clube-gold-deep">
          ~{aula.cargaHoraria}h · {licoes.length} lições
        </span>
      </header>
      <ol className="space-y-2">
        {licoes.map((l) => (
          <LicaoLinha key={l.num} licao={l} slugToCaminho={slugToCaminho} />
        ))}
      </ol>
    </div>
  )
}

function LicaoLinha({
  licao,
  slugToCaminho,
}: {
  licao: Licao
  slugToCaminho: Map<string, string>
}) {
  const caminho = licao.slug ? slugToCaminho.get(licao.slug) : undefined
  const Inner = (
    <div className="flex items-start gap-3 text-sm">
      <span className="mt-0.5 inline-block min-w-[3.5rem] rounded-full bg-clube-cream-soft px-2 py-0.5 text-center font-mono text-[10px] font-bold text-clube-teal-deep">
        Lição {licao.num}
      </span>
      <div className="flex-1">
        <div className="font-semibold text-clube-ink">{licao.titulo}</div>
        <div className="text-xs text-clube-mist">{licao.topicos}</div>
      </div>
      {caminho ? (
        <span className="rounded-full bg-clube-leaf/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-clube-leaf">
          publicada →
        </span>
      ) : (
        <span className="rounded-full bg-clube-mist-soft/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-clube-mist">
          planejada
        </span>
      )}
    </div>
  )

  return (
    <li className="rounded-lg border border-clube-mist-soft/30 bg-clube-cream-soft/30 px-3 py-2">
      {caminho ? (
        <Link
          href={`/${caminho}/`}
          className="block no-underline hover:no-underline hover:bg-clube-cream-soft -mx-3 -my-2 rounded-lg px-3 py-2"
        >
          {Inner}
        </Link>
      ) : (
        <div className="opacity-70">{Inner}</div>
      )}
    </li>
  )
}
