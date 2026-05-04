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

interface Props {
  params: Promise<{ locale: string; categoria: string; caminho: string[] }>
}

const ROOT = process.cwd()

/**
 * Walks a directory recursively, returning relative paths to .mdx files.
 */
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
  // Pra cada locale não-PT-BR, gera os paths que TÊM tradução em
  // content/i18n/<speechLang>/. PT-BR usa rota raiz (sem prefixo).
  const params: Array<{ locale: string; categoria: string; caminho: string[] }> = []
  const i18nRoot = join(ROOT, 'content', 'i18n')
  if (!existsSync(i18nRoot)) return params

  for (const speechLang of readdirSync(i18nRoot)) {
    const dir = join(i18nRoot, speechLang)
    if (!statSync(dir).isDirectory()) continue
    // Achar o locale-código curto pelo speechLang
    const localeEntry = Object.values(LOCALES).find((l) => l.speechLang === speechLang)
    if (!localeEntry) continue
    const localeCode = localeEntry.code
    if (localeCode === 'pt-BR') continue
    for (const rel of walkMdx(dir)) {
      const partes = rel.split('/')
      const [categoria, ...rest] = partes
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

export default async function ConteudoLocalizadoPage({ params }: Props) {
  const { locale, categoria, caminho } = await params
  if (!(locale in LOCALES)) notFound()
  const localeInfo = LOCALES[locale as Locale]

  const completo = caminhoCompleto(categoria, caminho)
  const slug = slugDoCaminho(caminho)
  const conteudo = carregarPorSlug(slug)
  if (!conteudo || conteudo.caminho !== completo) notFound()

  // Tenta carregar versão traduzida; se não existe, fallback pra PT-BR
  let arquivo = caminhoArquivoMdx(completo, locale as Locale, localeInfo.speechLang)
  if (!arquivo) {
    arquivo = caminhoArquivoMdx(completo, 'pt-BR', 'pt-BR')
  }
  if (!arquivo) notFound()

  // Tenta carregar+compilar MDX traduzido; se falhar (parse error, KaTeX),
  // cai pra PT-BR. Garante que erros de tradução não derrubam o build.
  const mdxOptions: Parameters<typeof compileMDX>[0]['options'] = {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [
        rehypeKatex,
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      ],
    },
  }

  let mdxRendered: React.ReactNode
  try {
    const { content } = await lerMdxSource(arquivo)
    const compiled = await compileMDX({
      source: content,
      components: MDX_COMPONENTS,
      options: mdxOptions,
    })
    mdxRendered = compiled.content
  } catch {
    // Fallback PT-BR
    const ptArquivo = caminhoArquivoMdx(completo, 'pt-BR', 'pt-BR')
    if (!ptArquivo) notFound()
    const { content } = await lerMdxSource(ptArquivo)
    const compiled = await compileMDX({
      source: content,
      components: MDX_COMPONENTS,
      options: mdxOptions,
    })
    mdxRendered = compiled.content
  }

  const isAula = categoria === 'aulas'
  const isFinancas = categoria === 'financas-quantitativas'

  return (
    <LessonPageShell
      meta={conteudo.meta}
      isAula={isAula}
      isFinancas={isFinancas}
      caminho={completo}
    >
      {mdxRendered}
    </LessonPageShell>
  )
}
