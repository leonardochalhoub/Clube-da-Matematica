import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  carregarTodosConteudos,
  carregarPorSlug,
} from '@/lib/content/loader'
import { carregarMdx } from '@/lib/content/manifest'
import { LessonPageShell } from '@/components/layout/LessonPageShell'

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
  // Metadata sempre em PT-BR (SSG); UI visível i18n via LocaleProvider client-side.
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

  const mod = await carregarMdx(completo)
  if (!mod) notFound()
  const MDXContent = mod.default

  // Para breadcrumb na seção certa
  const isAula = categoria === 'aulas'
  const isFinancas = categoria === 'financas-quantitativas'

  return (
    <LessonPageShell
      meta={conteudo.meta}
      isAula={isAula}
      isFinancas={isFinancas}
      caminho={completo}
    >
      <MDXContent />
    </LessonPageShell>
  )
}
