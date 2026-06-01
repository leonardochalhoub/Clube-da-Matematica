/**
 * Rota estática para lições de Cálculo 4: /engenharia/calculo-4/[unidade]/[licao]
 * Isola ~40 MDX files para evitar OOM ao compilar o manifesto completo (294 files).
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { carregarPorSlug, publicadosApenas } from '@/lib/content/loader'
import { manifestoEngCal4 } from '@/lib/content/manifests/manifest-engenharia-calculo-4'
import { LessonPageShell } from '@/components/layout/LessonPageShell'
import { PROGRAMA_ENG } from '@/content/programa-engenharia'

const DISCIPLINA = 'calculo-4'

interface Props {
  params: Promise<{ unidade: string; licao: string }>
}

export function generateStaticParams() {
  return publicadosApenas()
    .filter((c) => c.caminho.startsWith(`engenharia/${DISCIPLINA}/`))
    .map(({ caminho }) => {
      const [, , unidade, licao] = caminho.split('/')
      return { unidade: unidade!, licao: licao! }
    })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { unidade, licao: licaoSlug } = await params
  const completo = `engenharia/${DISCIPLINA}/${unidade}/${licaoSlug}`
  const conteudo = carregarPorSlug(licaoSlug)
  if (!conteudo || conteudo.caminho !== completo) return { title: 'Não encontrado' }
  return {
    title: `${conteudo.meta.titulo} — Engenharia`,
    description: conteudo.meta.descricao,
  }
}

export default async function LicaoPage({ params }: Props) {
  const { unidade, licao: licaoSlug } = await params
  const completo = `engenharia/${DISCIPLINA}/${unidade}/${licaoSlug}`

  const conteudo = carregarPorSlug(licaoSlug)
  if (!conteudo || conteudo.caminho !== completo) notFound()

  const loader = manifestoEngCal4[completo]?.['pt-BR']
  if (!loader) notFound()

  const mod = await loader()
  const MDXContent: React.ComponentType = mod.default

  let prevLicao: { num: number; titulo: string; caminho?: string } | undefined
  let nextLicao: { num: number; titulo: string; caminho?: string } | undefined

  const disc = PROGRAMA_ENG.find((d) => d.id === DISCIPLINA)
  if (disc) {
    const allLicoes = disc.unidades.flatMap((u) => u.licoes)
    const idx = allLicoes.findIndex((l) => l.caminho === completo)
    if (idx > 0) {
      const p = allLicoes[idx - 1]!
      prevLicao = { num: p.num, titulo: p.titulo, caminho: p.caminho }
    }
    if (idx >= 0 && idx < allLicoes.length - 1) {
      const n = allLicoes[idx + 1]!
      nextLicao = { num: n.num, titulo: n.titulo, caminho: n.caminho }
    }
  }

  return (
    <LessonPageShell
      meta={conteudo.meta}
      isAula={false}
      isFinancas={false}
      isEngenharia={true}
      caminho={completo}
      prevLicao={prevLicao}
      nextLicao={nextLicao}
    >
      <MDXContent />
    </LessonPageShell>
  )
}
