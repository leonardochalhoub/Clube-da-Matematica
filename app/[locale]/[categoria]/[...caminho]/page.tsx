import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { carregarTodosConteudos, carregarPorSlug } from '@/lib/content/loader'
import { caminhoArquivoMdx, lerMdxSource } from '@/lib/content/loader-i18n'
import { LessonPageShell } from '@/components/layout/LessonPageShell'
import { LOCALES, type Locale } from '@/lib/i18n/locales'
import { LICOES_FLAT } from '@/content/programa-em'
import { DuasPortas, Porta } from '@/components/math/DuasPortas'
import { Equation, Eq } from '@/components/math/Equation'
import { EquacaoCanonica } from '@/components/math/EquacaoCanonica'
import { PayoffChart } from '@/components/math/PayoffChart'
import { ListaExercicios, Exercicio } from '@/components/math/ListaExercicios'
import { VerificarPasso } from '@/components/math/VerificarPasso'
import {
  Definicao,
  Teorema,
  Exemplo,
  Insight,
  Cuidado,
  Leituras,
} from '@/components/math/Callouts'

interface Props {
  params: Promise<{ locale: string; categoria: string; caminho: string[] }>
}

export function generateStaticParams() {
  // Generate one path per lesson × per non-PT-BR locale.
  // The page falls back to PT-BR MDX for untranslated lessons,
  // so all 120 lessons are reachable in every locale.
  const conteudos = carregarTodosConteudos()
  const params: Array<{ locale: string; categoria: string; caminho: string[] }> = []
  for (const localeCode of Object.keys(LOCALES).filter((l) => l !== 'pt-BR')) {
    for (const c of conteudos) {
      const [categoria, ...rest] = c.caminho.split('/')
      if (!categoria || rest.length === 0) continue
      params.push({ locale: localeCode, categoria, caminho: rest })
    }
  }
  return params
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
  if (!conteudo) return { title: 'Not found' }
  return {
    title: conteudo.meta.titulo,
    description: conteudo.meta.descricao,
  }
}

const MDX_COMPONENTS = {
  DuasPortas,
  Porta,
  Equation,
  Eq,
  EquacaoCanonica,
  PayoffChart,
  ListaExercicios,
  Exercicio,
  VerificarPasso,
  Definicao,
  Teorema,
  Exemplo,
  Insight,
  Cuidado,
  Leituras,
}

const MDX_OPTIONS: Parameters<typeof compileMDX>[0]['options'] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
}

export default async function ConteudoLocalizadoPage({ params }: Props) {
  const { locale, categoria, caminho } = await params
  if (!(locale in LOCALES)) notFound()
  const localeInfo = LOCALES[locale as Locale]

  const completo = caminhoCompleto(categoria, caminho)
  const slug = slugDoCaminho(caminho)
  const conteudo = carregarPorSlug(slug)
  if (!conteudo || conteudo.caminho !== completo) notFound()

  // Try translated MDX; fall back to PT-BR on missing file or parse error.
  const arquivo =
    caminhoArquivoMdx(completo, locale as Locale, localeInfo.speechLang) ??
    caminhoArquivoMdx(completo, 'pt-BR', 'pt-BR')
  if (!arquivo) notFound()

  let mdxRendered: React.ReactNode
  try {
    const { content } = await lerMdxSource(arquivo)
    const compiled = await compileMDX({
      source: content,
      components: MDX_COMPONENTS,
      options: MDX_OPTIONS,
    })
    mdxRendered = compiled.content
  } catch {
    // Translation parse error — serve PT-BR silently.
    const ptArquivo = caminhoArquivoMdx(completo, 'pt-BR', 'pt-BR')
    if (!ptArquivo) notFound()
    const { content } = await lerMdxSource(ptArquivo)
    const compiled = await compileMDX({
      source: content,
      components: MDX_COMPONENTS,
      options: MDX_OPTIONS,
    })
    mdxRendered = compiled.content
  }

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
      {mdxRendered}
    </LessonPageShell>
  )
}
