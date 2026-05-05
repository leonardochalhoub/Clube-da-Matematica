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
} from '@/lib/content/loader'
// `carregarMdx` is dynamically imported inside the PT-BR branch so that
// translated routes (/en, /es, …) don't transitively depend on every
// PT-BR MDX file compiling — a single broken source would otherwise
// 500 every locale's pages.
import { caminhoArquivoMdx, lerMdxSource } from '@/lib/content/loader-i18n'
import { LessonPageShell } from '@/components/layout/LessonPageShell'
import { LICOES_FLAT } from '@/content/programa-em'
import { LOCALES, type Locale } from '@/lib/i18n/locales'
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
  params: Promise<{ categoria: string; caminho: string[] }>
}

const NON_PT_LOCALES = Object.keys(LOCALES).filter((l) => l !== 'pt-BR') as Locale[]

function isLocaleSegment(segment: string): segment is Locale {
  return NON_PT_LOCALES.includes(segment as Locale)
}

/**
 * Resolve the dynamic params into (locale, real categoria, real caminho).
 * URL `/aulas/ano-1/...`        → locale='pt-BR', categoria='aulas',         caminho=['ano-1', ...]
 * URL `/en/aulas/ano-1/...`     → locale='en',    categoria='aulas',         caminho=['ano-1', ...]
 *
 * Returns null when the first segment looks like a locale but the
 * remaining caminho is empty (e.g. `/en` alone), since the route
 * still requires a content path.
 */
function resolveParams(
  rawCategoria: string,
  rawCaminho: string[],
): { locale: Locale; categoria: string; caminho: string[] } | null {
  if (isLocaleSegment(rawCategoria)) {
    const [next, ...rest] = rawCaminho
    if (!next) return null
    return { locale: rawCategoria, categoria: next, caminho: rest }
  }
  return { locale: 'pt-BR', categoria: rawCategoria, caminho: rawCaminho }
}

export function generateStaticParams() {
  const conteudos = carregarTodosConteudos()
  const params: Array<{ categoria: string; caminho: string[] }> = []

  // PT-BR — canonical path: /<categoria>/<...caminho>
  for (const { caminho } of conteudos) {
    const [categoria, ...rest] = caminho.split('/')
    if (!categoria) continue
    params.push({ categoria, caminho: rest })
  }

  // All non-PT locales — prefixed: /<locale>/<categoria>/<...caminho>
  for (const localeCode of NON_PT_LOCALES) {
    for (const { caminho } of conteudos) {
      const segments = caminho.split('/')
      if (segments.length === 0) continue
      params.push({ categoria: localeCode, caminho: segments })
    }
  }

  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria: rawCategoria, caminho: rawCaminho } = await params
  const resolved = resolveParams(rawCategoria, rawCaminho)
  if (!resolved) return { title: 'Não encontrado' }
  const slug = resolved.caminho[resolved.caminho.length - 1] ?? ''
  const conteudo = carregarPorSlug(slug)
  if (!conteudo) return { title: 'Não encontrado' }
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

async function renderTranslatedMdx(
  caminhoCompleto: string,
  locale: Locale,
): Promise<{
  rendered: React.ReactNode
  frontmatter: Record<string, unknown>
}> {
  const localeInfo = LOCALES[locale]
  const arquivo =
    caminhoArquivoMdx(caminhoCompleto, locale, localeInfo.speechLang) ??
    caminhoArquivoMdx(caminhoCompleto, 'pt-BR', 'pt-BR')
  if (!arquivo) notFound()

  try {
    const { content, data } = await lerMdxSource(arquivo)
    const compiled = await compileMDX({
      source: content,
      components: MDX_COMPONENTS,
      options: MDX_OPTIONS,
    })
    return { rendered: compiled.content, frontmatter: data }
  } catch {
    // Translation parse error — fall back to PT-BR silently.
    const ptArquivo = caminhoArquivoMdx(caminhoCompleto, 'pt-BR', 'pt-BR')
    if (!ptArquivo) notFound()
    const { content, data } = await lerMdxSource(ptArquivo)
    const compiled = await compileMDX({
      source: content,
      components: MDX_COMPONENTS,
      options: MDX_OPTIONS,
    })
    return { rendered: compiled.content, frontmatter: data }
  }
}

export default async function ConteudoPage({ params }: Props) {
  const { categoria: rawCategoria, caminho: rawCaminho } = await params
  const resolved = resolveParams(rawCategoria, rawCaminho)
  if (!resolved) notFound()
  const { locale, categoria, caminho } = resolved

  const completo = [categoria, ...caminho].join('/')
  const slug = caminho[caminho.length - 1] ?? ''
  const conteudo = carregarPorSlug(slug)
  if (!conteudo || conteudo.caminho !== completo) notFound()

  // Both PT-BR and translated routes render via compileMDX from disk —
  // never via webpack-bundled MDX imports. This avoids OOM when bundling
  // ~120 lessons × N locales (the dev compile would otherwise pin >8 GB).
  const { rendered, frontmatter } = await renderTranslatedMdx(completo, locale)

  // Use the translated frontmatter (titulo, descricao, usadoEm) so the
  // page header reflects the locale's language. Fall back to PT-BR meta
  // for any field the translation hasn't provided.
  const localizedMeta = {
    ...conteudo.meta,
    ...(frontmatter as Partial<typeof conteudo.meta>),
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
      meta={localizedMeta}
      isAula={isAula}
      isFinancas={isFinancas}
      caminho={completo}
      prevLicao={prevLicao}
      nextLicao={nextLicao}
    >
      {rendered}
    </LessonPageShell>
  )
}
