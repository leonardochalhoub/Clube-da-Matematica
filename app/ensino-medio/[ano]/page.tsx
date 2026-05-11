import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { carregarTodosConteudos } from '@/lib/content/loader'
import {
  PROGRAMA_EM,
  materiasDoAno,
  aulasPorMateria,
  HORAS_POR_TRIMESTRE,
  HORAS_POR_ANO,
  type MateriaEM,
  type Aula,
} from '@/content/programa-em'
import { MateriaTabs } from '@/components/layout/MateriaTabs'
import { YearSearch } from '@/components/layout/YearSearch'

interface AulaPath extends Aula {
  caminho?: string
}

interface PageProps {
  params: Promise<{ ano: string }>
}

/** Aceita slug como "ano-1", "ano-2", "ano-3". */
function numFromSlug(slug: string): number | null {
  const match = slug.match(/^ano-(\d+)$/)
  if (!match) return null
  const n = Number(match[1])
  return Number.isInteger(n) ? n : null
}

export function generateStaticParams() {
  return PROGRAMA_EM.map((a) => ({ ano: `ano-${a.num}` }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { ano: anoSlug } = await params
  const num = numFromSlug(anoSlug)
  const ano = PROGRAMA_EM.find((a) => a.num === num)
  if (!ano) return { title: 'Ensino Médio' }
  const { buildSectionMetadata } = await import('@/lib/seo/metadata')
  return buildSectionMetadata({
    path: `ensino-medio/ano-${num}`,
    locale: 'pt-BR',
    titulo: ano.titulo,
    descricao: ano.resumo,
  })
}

export default async function AnoEnsinoMedioPage({ params }: PageProps) {
  const { ano: anoSlug } = await params
  const num = numFromSlug(anoSlug)
  const ano = PROGRAMA_EM.find((a) => a.num === num)
  if (!ano) notFound()

  const todos = carregarTodosConteudos()
  const aulasMdx = todos.filter(
    (c) => c.meta.categoria === 'aulas' && c.meta.publicado,
  )
  const slugToCaminho = new Map(aulasMdx.map((c) => [c.meta.slug, c.caminho]))

  const materias = materiasDoAno(ano)
  const indexMaterias = {} as Record<MateriaEM, AulaPath[]>
  for (const m of materias) {
    indexMaterias[m] = aulasPorMateria(ano, m).map((a) => ({
      ...a,
      caminho: a.slug ? slugToCaminho.get(a.slug) : undefined,
    }))
  }

  // Flat list of all Aulas in the year, with caminho + trim number for search
  const allAulasFlat: Array<Aula & { caminho?: string; trimNum: number }> = []
  for (const t of ano.trimestres) {
    for (const a of t.aulas) {
      allAulasFlat.push({
        ...a,
        trimNum: t.num,
        caminho: a.slug ? slugToCaminho.get(a.slug) : undefined,
      })
    }
  }

  const totalLicoes = ano.trimestres.reduce((acc, t) => acc + t.aulas.length, 0)
  const publicadas = ano.trimestres.reduce(
    (acc, t) =>
      acc + t.aulas.filter((a) => a.slug && slugToCaminho.has(a.slug)).length,
    0,
  )

  return (
    <article className="container-clube max-w-6xl py-12 sm:py-16">
      <nav aria-label="Trilha" className="mb-6 text-sm text-clube-mist">
        <Link href="/ensino-medio" className="text-clube-teal hover:text-clube-teal-deep">
          Ensino Médio
        </Link>{' '}
        / Ano {ano.num}
      </nav>

      {/* TWO-COLUMN HERO — left: narrative; right: trimester schedule */}
      <section className="mb-12 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
        {/* LEFT — narrative */}
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
            Ano {ano.num} · {ano.idade}
          </p>
          <h1 className="text-display font-extrabold leading-tight text-clube-teal-deep">
            {ano.titulo}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-clube-ink/85">
            {ano.resumo}
          </p>
          <p className="mt-4 text-sm italic text-clube-mist">
            {ano.equivalencia}
          </p>
        </div>

        {/* RIGHT — trimester schedule */}
        <div>
          <h2 className="text-xl font-bold text-clube-teal-deep">
            Cronograma por trimestre
          </h2>
          <p className="mt-1 text-sm text-clube-mist">
            <strong>Clique num trimestre</strong> para ver as Aulas e Lições
            (cada Lição abre o conteúdo). Lições agrupadas em{' '}
            <strong>Aulas</strong> didáticas (3-5 lições por Aula). Ou use as
            abas abaixo para navegar por matéria.
          </p>
          <div className="mt-4 space-y-3">
            {ano.trimestres.map((t) => (
              <Link
                key={t.num}
                href={`/ensino-medio/ano-${ano.num}/trim-${t.num}/`}
                className="group block rounded-xl border border-clube-mist-soft/40 bg-clube-surface p-4 no-underline transition-all hover:border-clube-teal hover:shadow-sm hover:no-underline"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-bold text-clube-teal-deep group-hover:text-clube-teal">
                    {t.titulo}
                  </h3>
                  <span className="text-xs text-clube-teal opacity-0 transition-opacity group-hover:opacity-100">
                    abrir →
                  </span>
                </div>
                <p className="mt-1 text-xs italic text-clube-mist">{t.foco}</p>
                <p className="mt-2 text-xs text-clube-mist/85">
                  {t.aulas.length} lições · ~{HORAS_POR_TRIMESTRE}h de estudo
                </p>
                {t.agrupamento && t.agrupamento.length > 0 && (
                  <ul className="mt-3 space-y-1 border-t border-clube-mist-soft/40 pt-3">
                    {t.agrupamento.map((g) => (
                      <li
                        key={g.id}
                        className="flex items-baseline gap-2 text-[11px]"
                      >
                        <span className="rounded-full bg-clube-gold/15 px-2 py-0.5 font-mono uppercase tracking-wider text-clube-gold-deep">
                          ~{g.cargaHoraria}h
                        </span>
                        <span className="text-clube-ink/85">{g.titulo}</span>
                        <span className="ml-auto text-clube-mist/70">
                          ({g.licoesNums.length} lições)
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH BAR — scoped to this year's lessons */}
      <YearSearch aulas={allAulasFlat} anoNum={ano.num} />

      {/* KPI ROW */}
      <section className="mb-12 grid gap-3 grid-cols-2 sm:grid-cols-4">
        <div className="card-clube !p-4 text-center sm:!p-6">
          <div className="text-xl font-extrabold text-clube-teal-deep sm:text-2xl">
            {totalLicoes}
          </div>
          <div className="mt-1 text-xs text-clube-mist">lições no ano</div>
        </div>
        <div className="card-clube !p-4 text-center sm:!p-6">
          <div className="text-xl font-extrabold text-clube-leaf sm:text-2xl">
            {publicadas}
            <span className="text-clube-mist/70"> / {totalLicoes}</span>
          </div>
          <div className="mt-1 text-xs text-clube-mist">lições publicadas</div>
        </div>
        <div className="card-clube !p-4 text-center sm:!p-6">
          <div className="text-xl font-extrabold text-clube-gold-deep sm:text-2xl">
            {materias.length}
          </div>
          <div className="mt-1 text-xs text-clube-mist">matérias cobertas</div>
        </div>
        <div className="card-clube !p-4 text-center sm:!p-6">
          <div className="text-xl font-extrabold text-clube-clay sm:text-2xl">
            ~{HORAS_POR_ANO}h
          </div>
          <div className="mt-1 text-xs text-clube-mist">
            estudo no ano ({HORAS_POR_TRIMESTRE}h/trim)
          </div>
        </div>
      </section>

      {/* MATERIA TABS — secondary navigation */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-clube-teal-deep">
          Lições organizadas por matéria
        </h2>
        <MateriaTabs materias={materias} aulasPorMateria={indexMaterias} />
      </section>

      {/* PREV / NEXT */}
      <section className="mt-16 grid gap-3 sm:grid-cols-2">
        {ano.num > 1 && (
          <Link
            href={`/ensino-medio/ano-${ano.num - 1}/`}
            className="card-clube no-underline hover:no-underline"
          >
            <div className="text-xs uppercase tracking-wider text-clube-mist">
              ← Anterior
            </div>
            <div className="mt-1 font-semibold text-clube-teal-deep">
              Ano {ano.num - 1}
            </div>
          </Link>
        )}
        {ano.num < 3 && (
          <Link
            href={`/ensino-medio/ano-${ano.num + 1}/`}
            className="card-clube no-underline hover:no-underline sm:text-right"
          >
            <div className="text-xs uppercase tracking-wider text-clube-mist">
              Próximo →
            </div>
            <div className="mt-1 font-semibold text-clube-teal-deep">
              Ano {ano.num + 1}
            </div>
          </Link>
        )}
      </section>
    </article>
  )
}
