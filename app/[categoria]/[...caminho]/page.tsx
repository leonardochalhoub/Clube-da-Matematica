import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  carregarTodosConteudos,
  carregarPorSlug,
} from '@/lib/content/loader'
import { carregarMdx } from '@/lib/content/manifest'
import { LessonPageShell } from '@/components/layout/LessonPageShell'
import { LICOES_FLAT } from '@/content/programa-em'

interface Props {
  params: Promise<{ categoria: string; caminho: string[] }>
}

export function generateStaticParams() {
  return carregarTodosConteudos().map(({ caminho }) => {
    const partes = caminho.split('/')
    const [categoria, ...rest] = partes
    return {
      categoria: categoria!,
      caminho: rest,
    }
  })
}

function caminhoCompleto(categoria: string, caminho: string[]): string {
  return [categoria, ...caminho].join('/')
}

function slugDoCaminho(caminho: string[]): string {
  return caminho[caminho.length - 1] ?? ''
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { caminho } = await params
  const slug = slugDoCaminho(caminho)
  const conteudo = carregarPorSlug(slug)
  if (!conteudo) return { title: 'Não encontrado' }
  return {
    title: conteudo.meta.titulo,
    description: conteudo.meta.descricao,
  }
}

export default async function ConteudoPage({ params }: Props) {
  const { categoria, caminho } = await params
  const completo = caminhoCompleto(categoria, caminho)
  const slug = slugDoCaminho(caminho)
  const conteudo = carregarPorSlug(slug)
  if (!conteudo || conteudo.caminho !== completo) notFound()

  // Carrega via manifest (webpack dynamic import). Diferente de
  // compileMDX, esse caminho preserva props com expressões JSX
  // ({ opcoes: [...], fonte: {...}, solucao: <>...</> }).
  // Trade-off: webpack precisa bundlar todos os 120 paths PT-BR,
  // o que aumenta uso de memória — daí o NODE_OPTIONS=8192 no build.
  const mod = await carregarMdx(completo)
  if (!mod) notFound()
  const MDXContent = mod.default

  const isAula = categoria === 'aulas'
  const isFinancas = categoria === 'financas-quantitativas'

  let prevLicao: { num: number; titulo: string; caminho?: string } | undefined
  let nextLicao: { num: number; titulo: string; caminho?: string } | undefined

  if (isAula) {
    const slugToCaminho = new Map(
      carregarTodosConteudos()
        .filter((c) => c.meta.categoria === 'aulas')
        .map((c) => [c.meta.slug, c.caminho]),
    )
    const idx = LICOES_FLAT.findIndex((l) => l.slug === conteudo.meta.slug)
    if (idx > 0) {
      const p = LICOES_FLAT[idx - 1]!
      prevLicao = {
        num: p.num,
        titulo: p.titulo,
        caminho: p.slug ? slugToCaminho.get(p.slug) : undefined,
      }
    }
    if (idx >= 0 && idx < LICOES_FLAT.length - 1) {
      const n = LICOES_FLAT[idx + 1]!
      nextLicao = {
        num: n.num,
        titulo: n.titulo,
        caminho: n.slug ? slugToCaminho.get(n.slug) : undefined,
      }
    }
  }

  return (
    <LessonPageShell
      meta={conteudo.meta}
      isAula={isAula}
      isFinancas={isFinancas}
      caminho={completo}
      prevLicao={prevLicao}
      nextLicao={nextLicao}
    >
      <MDXContent />
    </LessonPageShell>
  )
}
