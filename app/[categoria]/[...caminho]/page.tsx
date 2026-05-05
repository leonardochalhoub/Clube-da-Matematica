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
import { carregarMdx } from '@/lib/content/manifest'
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

const MDX_COMPONENTS = {
  DuasPortas, Porta,
  Equation, Eq, EquacaoCanonica,
  PayoffChart,
  ListaExercicios, Exercicio,
  VerificarPasso,
  Definicao, Teorema, Exemplo, Insight, Cuidado, Leituras,
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

interface Props {
  params: Promise<{ categoria: string; caminho: string[] }>
}

/** Códigos de locale != pt-BR (são prefixos de URL: /en/aulas/...). */
const LOCALE_CODES = new Set(
  Object.keys(LOCALES).filter((c) => c !== 'pt-BR'),
)

/**
 * Detecta se o primeiro segmento da URL é um locale (ex.: 'en', 'es').
 * Se for, devolve { locale, categoria, caminho } "reais" — descartando
 * o prefixo. Caso contrário devolve null.
 */
function parseLocalePrefix(
  segment: string,
  rest: string[],
): { locale: string; categoria: string; caminho: string[] } | null {
  if (!LOCALE_CODES.has(segment)) return null
  const [actualCategoria, ...actualCaminho] = rest
  if (!actualCategoria) return null
  return { locale: segment, categoria: actualCategoria, caminho: actualCaminho }
}

export function generateStaticParams() {
  const conteudos = carregarTodosConteudos()
  // Paths PT-BR (sem prefixo de locale)
  const ptBR = conteudos.map(({ caminho }) => {
    const [categoria, ...rest] = caminho.split('/')
    return { categoria: categoria!, caminho: rest }
  })
  // Paths com prefixo de locale (/en/aulas/..., /es/aulas/..., etc.)
  // Servem o mesmo conteúdo PT-BR até termos traduções no filesystem.
  const localePaths: Array<{ categoria: string; caminho: string[] }> = []
  for (const localeCode of LOCALE_CODES) {
    for (const c of conteudos) {
      const partes = c.caminho.split('/')
      // Aqui `categoria` recebe o LOCALE; `caminho` recebe categoria+resto
      localePaths.push({
        categoria: localeCode,
        caminho: partes,
      })
    }
  }
  return [...ptBR, ...localePaths]
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
  const { categoria: rawCategoria, caminho: rawCaminho } = await params
  // Se a URL é /<locale>/<categoria>/<...>, descasca o locale.
  const localeMatch = parseLocalePrefix(rawCategoria, rawCaminho)
  const categoria = localeMatch ? localeMatch.categoria : rawCategoria
  const caminho = localeMatch ? localeMatch.caminho : rawCaminho

  const completo = caminhoCompleto(categoria, caminho)
  const slug = slugDoCaminho(caminho)
  const conteudo = carregarPorSlug(slug)
  if (!conteudo || conteudo.caminho !== completo) notFound()

  // PT-BR uses the manifest path (preserves JSX expression props on
  // <Exercicio>: solucao={<>...</>}, opcoes={[...]}, fonte={{...}}).
  // Non-PT-BR locales read translated MDX from disk via compileMDX —
  // some rich JSX expression props may render less faithfully there,
  // but at least the locale gets translated content.
  const localeCode = (localeMatch?.locale ?? 'pt-BR') as Locale
  let MDXContent: React.ComponentType | null = null
  let translatedRendered: React.ReactNode = null
  let translatedFrontmatter: Record<string, unknown> = {}

  if (localeCode === 'pt-BR') {
    const mod = await carregarMdx(completo)
    if (!mod) notFound()
    MDXContent = mod.default
  } else {
    const localeInfo = LOCALES[localeCode]
    const arquivo =
      caminhoArquivoMdx(completo, localeCode, localeInfo.speechLang)
    if (arquivo) {
      try {
        const { content, data } = await lerMdxSource(arquivo)
        const compiled = await compileMDX({
          source: content,
          components: MDX_COMPONENTS,
          options: MDX_OPTIONS,
        })
        translatedRendered = compiled.content
        translatedFrontmatter = data
      } catch {
        // Translation parse error → fall back to PT-BR via manifest.
        const mod = await carregarMdx(completo)
        if (!mod) notFound()
        MDXContent = mod.default
      }
    } else {
      // No translation file → fall back to PT-BR via manifest.
      const mod = await carregarMdx(completo)
      if (!mod) notFound()
      MDXContent = mod.default
    }
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

  // Localized meta — non-PT-BR pages use the translated frontmatter
  // (titulo, descricao, usadoEm) so the page header reflects the locale.
  const localizedMeta = {
    ...conteudo.meta,
    ...(translatedFrontmatter as Partial<typeof conteudo.meta>),
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
      {MDXContent ? <MDXContent /> : translatedRendered}
    </LessonPageShell>
  )
}
