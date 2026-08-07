import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import {
  carregarPorSlug,
  publicadosApenas,
} from '@/lib/content/loader'
import { carregarMdxLocalizado } from '@/lib/content/manifest'
import { caminhoArquivoMdx, lerMdxSource } from '@/lib/content/loader-i18n'
import { LessonPageShell } from '@/components/layout/LessonPageShell'
import { LOCALES, localeToUrl, urlToLocale, type Locale } from '@/lib/i18n/locales'
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
  // PT-BR only (2026-08-06 pivot — see CLAUDE.md §4). This route still takes
  // a `locale` URL param because pt-BR itself is served at /pt-br/… (source
  // MDX lives in content/, not content/i18n), but no other locale is emitted
  // here anymore — translated content/i18n/ stays on disk, just unrouted.
  const params: Array<{ locale: string; categoria: string; caminho: string[] }> = []
  for (const { caminho } of publicadosApenas()) {
    const [categoria, ...rest] = caminho.split('/')
    if (!categoria || rest.length === 0) continue
    params.push({ locale: localeToUrl('pt-BR'), categoria, caminho: rest })
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
  const { locale: urlCode, categoria, caminho } = await params
  const locale = urlToLocale(urlCode)
  const slug = slugDoCaminho(caminho)
  const conteudo = carregarPorSlug(slug)
  if (!conteudo || !locale) return { title: 'Not found' }

  let titulo = conteudo.meta.titulo
  let descricao = conteudo.meta.descricao
  // Read locale-specific frontmatter from disk. pt-BR reads from content/ and
  // others from content/i18n/<speechLang> — caminhoArquivoMdx handles both.
  const info = LOCALES[locale]
  const completo = caminhoCompleto(categoria, caminho)
  const arquivo = caminhoArquivoMdx(completo, locale, info.speechLang)
  if (arquivo) {
    try {
      const { data } = await lerMdxSource(arquivo)
      if (typeof data.titulo === 'string') titulo = data.titulo
      if (typeof data.descricao === 'string') descricao = data.descricao
    } catch {
      /* keep PT-BR meta */
    }
  }
  return { title: titulo, description: descricao }
}

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
      [rehypeKatex, { output: 'htmlAndMathml', throwOnError: false, strict: false }],
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
}

export default async function ConteudoLocalizadoPage({ params }: Props) {
  const { locale: urlCode, categoria, caminho } = await params
  const locale = urlToLocale(urlCode)
  if (!locale) notFound()
  const localeInfo = LOCALES[locale]

  const completo = caminhoCompleto(categoria, caminho)
  const slug = slugDoCaminho(caminho)
  const conteudo = carregarPorSlug(slug)
  if (!conteudo || conteudo.caminho !== completo) notFound()

  let mdxRendered: React.ReactNode
  let translatedFrontmatter: Record<string, unknown> = {}

  // PRIMARY PATH: webpack-bundled MDX module via manifest.
  // This is the only path that PRESERVES JSX-expression props on
  // <Exercicio> — opcoes={[...]}, solucao={<>...</>}, passos={...},
  // fonte={{...}}. compileMDX (next-mdx-remote/rsc) drops them, which
  // is why locale pages were showing exercises without MC/solution
  // buttons. Lessons must be in `includeTranslationsFor` in
  // scripts/generate-manifest.ts to land here.
  const mod = await carregarMdxLocalizado(completo, locale)
  if (mod) {
    const MDXContent: React.ComponentType = mod.default
    mdxRendered = <MDXContent />
    // Still read frontmatter from disk so page header (titulo, descricao,
    // usadoEm) renders in the active locale.
    const arquivo = caminhoArquivoMdx(completo, locale as Locale, localeInfo.speechLang)
    if (arquivo) {
      try {
        const { data } = await lerMdxSource(arquivo)
        translatedFrontmatter = data
      } catch {
        /* keep PT-BR frontmatter */
      }
    }
  } else {
    // FALLBACK PATH: compileMDX from disk for lessons not in the manifest
    // allowlist. JSX-expression props will NOT render correctly here —
    // any lesson with MC/solution/passos must be added to the manifest
    // allowlist instead of relying on this fallback.
    let arquivo = caminhoArquivoMdx(completo, locale as Locale, localeInfo.speechLang)
    if (!arquivo) {
      arquivo = caminhoArquivoMdx(completo, 'pt-BR', 'pt-BR')
    }
    if (!arquivo) notFound()
    try {
      const { content, data } = await lerMdxSource(arquivo)
      translatedFrontmatter = data
      const compiled = await compileMDX({
        source: content,
        components: MDX_COMPONENTS,
        options: MDX_OPTIONS,
      })
      mdxRendered = compiled.content
    } catch (err) {
      console.error(
        `[i18n-fallback] compileMDX failed for ${locale}/${completo} — serving PT-BR fallback. Reason:`,
        err instanceof Error ? err.message : err,
      )
      translatedFrontmatter = {}
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
  }

  const isAula = categoria === 'aulas'
  const isFinancas = categoria === 'financas-quantitativas'

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
    >
      {mdxRendered}
    </LessonPageShell>
  )
}
