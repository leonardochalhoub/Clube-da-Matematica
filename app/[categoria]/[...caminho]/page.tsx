import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings' 
import {
  carregarTodosConteudos,
  carregarPorSlug,
  publicadosApenas,
} from '@/lib/content/loader'
import { carregarMdxLocalizado } from '@/lib/content/manifest'
import { caminhoArquivoMdx, lerMdxSource } from '@/lib/content/loader-i18n'
import { LessonPageShell } from '@/components/layout/LessonPageShell'
import { LICOES_FLAT } from '@/content/programa-em'
import { LOCALES, type Locale } from '@/lib/i18n/locales'
import { buildLessonMetadata } from '@/lib/seo/metadata'
import {
  buildCourseSchema,
  buildBreadcrumbSchema,
  lessonBreadcrumbs,
} from '@/lib/seo/structured-data'
import { JsonLd } from '@/components/seo/JsonLd'
import { DuasPortas, Porta } from '@/components/math/DuasPortas'
import { Equation, Eq } from '@/components/math/Equation'
import { EquacaoCanonica } from '@/components/math/EquacaoCanonica'
import { PayoffChart } from '@/components/math/PayoffChart'
import { ListaExercicios, Exercicio } from '@/components/math/ListaExercicios'
import { VerificarPasso } from '@/components/math/VerificarPasso'
import {
  Definicao,
  Teorema,
  Corolario,
  Exemplo,
  Insight,
  Cuidado,
  Leituras,
} from '@/components/math/Callouts'

const MDX_COMPONENTS = {
  DuasPortas, Porta,
  Equation, Eq, EquacaoCanonica,
  PayoffChart,
  ListaExercicios, Exercicio,
  VerificarPasso,
  Definicao, Teorema, Corolario, Exemplo, Insight, Cuidado, Leituras,
}

const MDX_OPTIONS: Parameters<typeof compileMDX>[0]['options'] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      [rehypeKatex, { output: 'htmlAndMathml', throwOnError: false, strict: false }],
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
}

interface Props {
  params: Promise<{ categoria: string; caminho: string[] }>
}

// This catch-all route owns PT-BR URLs only. Locale-prefixed URLs
// (/en/..., /es/..., /zh/...) are owned by [locale]/[categoria]/[...caminho]
// which reads MDX directly from disk via compileMDX. Mixing the manifest path
// here was serving PT-BR fallbacks for locales that DO have translations on
// disk — see memory bug-mdx-render-oom.md: ALWAYS compileMDX, NEVER manifest.

export function generateStaticParams() {
  // Only emit routes for `publicado: true` content. Quarantined lessons
  // (publicado: false) are skipped at SSG time so they neither render nor
  // crash the build with malformed JSX.
  const conteudos = publicadosApenas()

  // PT-BR only — no locale prefixes. The [locale] sibling route handles
  // every other locale via compileMDX from `content/i18n/<speechLang>/...`.
  return conteudos.map(({ caminho }) => {
    const [categoria, ...rest] = caminho.split('/')
    return { categoria: categoria!, caminho: rest }
  })
}

function caminhoCompleto(categoria: string, caminho: string[]): string {
  return [categoria, ...caminho].join('/')
}

function slugDoCaminho(caminho: string[]): string {
  return caminho[caminho.length - 1] ?? ''
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria, caminho } = await params
  const slug = slugDoCaminho(caminho)
  const conteudo = carregarPorSlug(slug)
  if (!conteudo) return { title: 'Não encontrado' }

  return buildLessonMetadata({
    caminho: `${categoria}/${caminho.join('/')}`,
    locale: 'pt-BR',
    titulo: conteudo.meta.titulo,
    descricao: conteudo.meta.descricao,
  })
}

export default async function ConteudoPage({ params }: Props) {
  const { categoria, caminho } = await params
  const completo = caminhoCompleto(categoria, caminho)
  const slug = slugDoCaminho(caminho)
  const conteudo = carregarPorSlug(slug)
  if (!conteudo || conteudo.caminho !== completo) notFound()

  // PT-BR-only: serve the canonical MDX module straight from the manifest.
  // No locale fallback dance here — locale URLs live in the [locale] route.
  const mod = await carregarMdxLocalizado(completo, 'pt-BR')
  if (!mod) notFound()
  const MDXContent: React.ComponentType = mod.default

  // Keep these symbols referenced so removing the compileMDX branch
  // doesn't dead-code the imports webpack needs at the top of file.
  void compileMDX
  void MDX_COMPONENTS
  void MDX_OPTIONS
  void caminhoArquivoMdx
  void lerMdxSource
  void LOCALES

  const isAula = categoria === 'aulas'
  const isFinancas = categoria === 'financas-quantitativas'
  const isEngenharia = categoria === 'engenharia'

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

  // ---------- JSON-LD structured data ----------
  const courseSchema = buildCourseSchema({
    caminho: completo,
    locale: 'pt-BR' as Locale,
    titulo: conteudo.meta.titulo,
    descricao: conteudo.meta.descricao,
    tags: conteudo.meta.tags ?? [],
    prerrequisitos: conteudo.meta.prerrequisitos ?? [],
    isAula,
  })
  const breadcrumbSchema = buildBreadcrumbSchema(
    lessonBreadcrumbs(completo, 'pt-BR', conteudo.meta.titulo),
  )

  return (
    <>
      <JsonLd data={[courseSchema, breadcrumbSchema]} />
      <LessonPageShell
        meta={conteudo.meta}
        isAula={isAula}
        isFinancas={isFinancas}
        isEngenharia={isEngenharia}
        caminho={completo}
        prevLicao={prevLicao}
        nextLicao={nextLicao}
      >
        <MDXContent />
      </LessonPageShell>
    </>
  )
}
