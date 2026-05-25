import type { Metadata } from 'next'
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
import { AnoPageContent } from '@/components/layout/AnoPageContent'

interface AulaPath extends Aula {
  caminho?: string
}

interface PageProps {
  params: Promise<{ ano: string }>
}

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
    <AnoPageContent
      anoNum={ano.num}
      anoTituloFallback={ano.titulo}
      anoResumoFallback={ano.resumo}
      idade={ano.idade}
      equivalencia={ano.equivalencia}
      trimestres={ano.trimestres}
      materias={materias}
      indexMaterias={indexMaterias}
      allAulasFlat={allAulasFlat}
      totalLicoes={totalLicoes}
      publicadas={publicadas}
      horasPorTrimestre={HORAS_POR_TRIMESTRE}
      horasPorAno={HORAS_POR_ANO}
    />
  )
}
