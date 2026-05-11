import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { carregarTodosConteudos } from '@/lib/content/loader'
import {
  PROGRAMA_EM,
  HORAS_POR_TRIMESTRE,
} from '@/content/programa-em'
import { TrimPageContent } from '@/components/layout/TrimPageContent'

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
  const { buildSectionMetadata } = await import('@/lib/seo/metadata')
  return buildSectionMetadata({
    path: `ensino-medio/ano-${anoNum}/trim-${trimNum}`,
    locale: 'pt-BR',
    titulo: t.titulo,
    descricao: t.foco,
  })
}

export default async function TrimPage({ params }: PageProps) {
  const { ano, trim } = await params
  const anoNum = numFromAnoSlug(ano)
  const trimNum = numFromTrimSlug(trim)
  const a = PROGRAMA_EM.find((x) => x.num === anoNum)
  const t = a?.trimestres.find((x) => x.num === trimNum)
  if (!a || !t) notFound()

  const todos = carregarTodosConteudos()
  // Only `publicado: true` lessons map to a clickable path; unpublished
  // ones get a "planned" badge in the client listing.
  const slugToCaminho: Record<string, string> = {}
  for (const c of todos) {
    if (c.meta.categoria === 'aulas' && c.meta.publicado) {
      slugToCaminho[c.meta.slug] = c.caminho
    }
  }

  return (
    <TrimPageContent
      anoNum={a.num}
      trimNum={t.num}
      anoTituloFallback={a.titulo}
      trimTituloFallback={t.titulo}
      trimFocoFallback={t.foco}
      licoes={t.aulas}
      agrupamento={t.agrupamento ?? []}
      trimestre={t}
      slugToCaminho={slugToCaminho}
      horasPorTrimestre={HORAS_POR_TRIMESTRE}
    />
  )
}
