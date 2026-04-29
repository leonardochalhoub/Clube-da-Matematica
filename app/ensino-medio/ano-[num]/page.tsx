import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { carregarTodosConteudos } from '@/lib/content/loader'
import {
  PROGRAMA_EM,
  materiasDoAno,
  aulasPorMateria,
  type MateriaEM,
  type Aula,
} from '@/content/programa-em'
import { MateriaTabs } from '@/components/layout/MateriaTabs'

interface AulaPath extends Aula {
  caminho?: string
}

interface PageProps {
  params: Promise<{ num: string }>
}

export function generateStaticParams() {
  return PROGRAMA_EM.map((a) => ({ num: String(a.num) }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { num } = await params
  const ano = PROGRAMA_EM.find((a) => String(a.num) === num)
  if (!ano) return { title: 'Ensino Médio' }
  return {
    title: ano.titulo,
    description: ano.resumo,
  }
}

export default async function AnoEnsinoMedioPage({ params }: PageProps) {
  const { num } = await params
  const ano = PROGRAMA_EM.find((a) => String(a.num) === num)
  if (!ano) notFound()

  const todos = carregarTodosConteudos()
  const aulasMdx = todos.filter((c) => c.meta.categoria === 'aulas')
  const slugToCaminho = new Map(aulasMdx.map((c) => [c.meta.slug, c.caminho]))

  const materias = materiasDoAno(ano)
  const indexMaterias = {} as Record<MateriaEM, AulaPath[]>
  for (const m of materias) {
    indexMaterias[m] = aulasPorMateria(ano, m).map((a) => ({
      ...a,
      caminho: a.slug ? slugToCaminho.get(a.slug) : undefined,
    }))
  }

  const totalAulas = ano.trimestres.reduce((acc, t) => acc + t.aulas.length, 0)
  const publicadas = ano.trimestres.reduce(
    (acc, t) =>
      acc + t.aulas.filter((a) => a.slug && slugToCaminho.has(a.slug)).length,
    0,
  )

  return (
    <article className="container-clube max-w-5xl py-12 sm:py-16">
      <nav aria-label="Trilha" className="mb-6 text-sm text-clube-mist">
        <Link href="/ensino-medio" className="text-clube-teal hover:text-clube-teal-deep">
          Ensino Médio
        </Link>{' '}
        / Ano {ano.num}
      </nav>

      <header className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
          Ano {ano.num} · {ano.idade}
        </p>
        <h1 className="text-display font-extrabold text-clube-teal-deep">
          {ano.titulo}
        </h1>
        <p className="mt-4 max-w-prose text-lg leading-relaxed text-clube-mist">
          {ano.resumo}
        </p>
        <p className="mt-3 text-sm italic text-clube-mist/85">
          {ano.equivalencia}
        </p>
      </header>

      <section className="mb-10 grid gap-3 sm:grid-cols-3">
        <div className="card-clube text-center">
          <div className="text-2xl font-extrabold text-clube-teal-deep">
            {totalAulas}
          </div>
          <div className="mt-1 text-xs text-clube-mist">aulas no ano</div>
        </div>
        <div className="card-clube text-center">
          <div className="text-2xl font-extrabold text-clube-leaf">
            {publicadas}
          </div>
          <div className="mt-1 text-xs text-clube-mist">já publicadas</div>
        </div>
        <div className="card-clube text-center">
          <div className="text-2xl font-extrabold text-clube-gold-deep">
            {materias.length}
          </div>
          <div className="mt-1 text-xs text-clube-mist">matérias cobertas</div>
        </div>
      </section>

      {/* Calendario por trimestre — mais sintético */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-clube-teal-deep">
          Cronograma por trimestre
        </h2>
        <p className="mt-1 text-sm text-clube-mist">
          Como as 40 aulas se distribuem ao longo do ano letivo. Use as abas
          abaixo para navegar por matéria.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ano.trimestres.map((t) => (
            <div
              key={t.num}
              className="rounded-xl border border-clube-mist-soft/40 bg-clube-surface p-4"
            >
              <h3 className="text-sm font-bold text-clube-teal-deep">
                {t.titulo}
              </h3>
              <p className="mt-1 text-xs italic text-clube-mist">{t.foco}</p>
              <p className="mt-2 text-xs text-clube-mist/85">
                {t.aulas.length} aulas
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-clube-teal-deep">
          Aulas organizadas por matéria
        </h2>
        <MateriaTabs materias={materias} aulasPorMateria={indexMaterias} />
      </section>

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
