/**
 * Rota genérica de lição de engenharia: /engenharia/[disciplina]/[unidade]/[licao]
 *
 * As disciplinas calculo-1..4 têm rotas estáticas próprias que importam
 * manifestos menores (~40 MDX files cada), evitando OOM em dev.
 * Esta rota genérica só é atingida por disciplinas FUTURAS sem rota própria.
 *
 * NÃO adicionar imports de manifesto pesado aqui — use rotas por disciplina.
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { carregarPorSlug, publicadosApenas } from '@/lib/content/loader'
import { carregarMdxLocalizado } from '@/lib/content/manifest'
import { LessonPageShell } from '@/components/layout/LessonPageShell'
import { PROGRAMA_ENG } from '@/content/programa-engenharia'

// Disciplinas com rotas estáticas próprias — excluídas daqui para evitar
// conflito na build estática e OOM em dev (manifesto completo = 294 MDX).
const DISCIPLINAS_COM_ROTA_PROPRIA = new Set(['calculo-1', 'calculo-2', 'calculo-3', 'calculo-4'])

interface Props {
  params: Promise<{ disciplina: string; unidade: string; licao: string }>
}

export function generateStaticParams() {
  return publicadosApenas()
    .filter((c) => {
      if (!c.caminho.startsWith('engenharia/')) return false
      const disciplina = c.caminho.split('/')[1]
      return !DISCIPLINAS_COM_ROTA_PROPRIA.has(disciplina ?? '')
    })
    .map(({ caminho }) => {
      const [, disciplina, unidade, licao] = caminho.split('/')
      return {
        disciplina: disciplina!,
        unidade: unidade!,
        licao: licao!,
      }
    })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { disciplina, unidade, licao: licaoSlug } = await params
  const completo = `engenharia/${disciplina}/${unidade}/${licaoSlug}`
  const conteudo = carregarPorSlug(licaoSlug)
  if (!conteudo || conteudo.caminho !== completo) return { title: 'Não encontrado' }
  return {
    title: `${conteudo.meta.titulo} — Engenharia`,
    description: conteudo.meta.descricao,
  }
}

export default async function EngLicaoPage({ params }: Props) {
  const { disciplina, unidade, licao: licaoSlug } = await params
  const completo = `engenharia/${disciplina}/${unidade}/${licaoSlug}`

  const conteudo = carregarPorSlug(licaoSlug)
  if (!conteudo || conteudo.caminho !== completo) notFound()

  const mod = await carregarMdxLocalizado(completo, 'pt-BR')
  if (!mod) notFound()

  const MDXContent: React.ComponentType = mod.default

  // Build prev/next navigation within the same discipline
  let prevLicao: { num: number; titulo: string; caminho?: string } | undefined
  let nextLicao: { num: number; titulo: string; caminho?: string } | undefined

  const disc = PROGRAMA_ENG.find((d) => d.id === disciplina)
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
