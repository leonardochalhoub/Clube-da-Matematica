import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { carregarPorSlug } from '@/lib/content/loader'
import { carregarMdxLocalizado } from '@/lib/content/manifest'
import { caminhoArquivoMdx, lerMdxSource } from '@/lib/content/loader-i18n'
import { LessonPageShell } from '@/components/layout/LessonPageShell'
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
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

// NOTE: In this route, `categoria` param = locale code (e.g. "en-US"),
// and `subcategoria` param = content category (e.g. "engenharia").
// The folder was renamed [locale] → [categoria] and [categoria] → [subcategoria]
// to satisfy Next.js requirement that dynamic segments at the same URL
// position share the same name across sibling routes.
interface Props {
  params: Promise<{ categoria: string; subcategoria: string; caminho: string[] }>
}

const ROOT = process.cwd()

function walkMdx(dir: string, base = dir): string[] {
  if (!existsSync(dir)) return []
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      out.push(...walkMdx(full, base))
    } else if (entry.endsWith('.mdx')) {
      out.push(relative(base, full).replace(/\.mdx$/, ''))
    }
  }
  return out
}

export function generateStaticParams() {
  const params: Array<{ categoria: string; subcategoria: string; caminho: string[] }> = []
  const i18nRoot = join(ROOT, 'content', 'i18n')
  if (!existsSync(i18nRoot)) return params

  const buildLocale = process.env.BUILD_LOCALE ?? ''
  if (buildLocale === 'pt-BR') return params

  const previewLocales = buildLocale
    ? new Set([buildLocale])
    : process.env.PREVIEW_LOCALES
      ? new Set(process.env.PREVIEW_LOCALES.split(',').map((s) => s.trim()))
      : null

  for (const speechLang of readdirSync(i18nRoot)) {
    const dir = join(i18nRoot, speechLang)
    if (!statSync(dir).isDirectory()) continue
    const localeEntry = Object.values(LOCALES).find((l) => l.speechLang === speechLang)
    if (!localeEntry) continue
    const localeCode = localeEntry.code
    if (localeCode === 'pt-BR') continue
    if (previewLocales && !previewLocales.has(localeCode)) continue
    for (const rel of walkMdx(dir)) {
      const partes = rel.split('/')
      const [subcategoria, ...rest] = partes
      if (!subcategoria || rest.length === 0) continue
      // categoria = locale code, subcategoria = content category
      params.push({ categoria: localeCode, subcategoria, caminho: rest })
    }
  }
  return params
}

function caminhoCompleto(subcategoria: string, caminho: string[]): string {
  return [subcategoria, ...caminho].join('/')
}

function slugDoCaminho(caminho: string[]): string {
  return caminho[caminho.length - 1] ?? ''
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // categoria = locale code, subcategoria = content category
  const { categoria: locale, subcategoria, caminho } = await params
  const slug = slugDoCaminho(caminho)
  const conteudo = carregarPorSlug(slug)
  if (!conteudo) return { title: 'Not found' }

  let titulo = conteudo.meta.titulo
  let descricao = conteudo.meta.descricao
  if (locale in LOCALES && locale !== 'pt-BR') {
    const info = LOCALES[locale as Locale]
    const completo = caminhoCompleto(subcategoria, caminho)
    const arquivo = caminhoArquivoMdx(completo, locale as Locale, info.speechLang)
    if (arquivo) {
      try {
        const { data } = await lerMdxSource(arquivo)
        if (typeof data.titulo === 'string') titulo = data.titulo
        if (typeof data.descricao === 'string') descricao = data.descricao
      } catch {
        /* keep PT-BR meta */
      }
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
      rehypeKatex,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
}

export default async function ConteudoLocalizadoPage({ params }: Props) {
  // categoria = locale code, subcategoria = content category
  const { categoria: locale, subcategoria, caminho } = await params
  if (!(locale in LOCALES)) notFound()
  const localeInfo = LOCALES[locale as Locale]

  const completo = caminhoCompleto(subcategoria, caminho)
  const slug = slugDoCaminho(caminho)
  const conteudo = carregarPorSlug(slug)
  if (!conteudo || conteudo.caminho !== completo) notFound()

  let mdxRendered: React.ReactNode
  let translatedFrontmatter: Record<string, unknown> = {}

  const mod = await carregarMdxLocalizado(completo, locale)
  if (mod) {
    const MDXContent: React.ComponentType = mod.default
    mdxRendered = <MDXContent />
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

  const isAula = subcategoria === 'aulas'
  const isFinancas = subcategoria === 'financas-quantitativas'

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
