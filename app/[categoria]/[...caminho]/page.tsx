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
  // Only emit routes for `publicado: true` content. Quarantined lessons
  // (publicado: false) are skipped at SSG time so they neither render nor
  // crash the build with malformed JSX.
  const conteudos = publicadosApenas()

  // BUILD_LOCALE controls which routes this build emits.
  // - Unset: emit ALL (PT-BR + every translated locale prefix). Used for
  //   local dev / single-build mode.
  // - Set: emit ONLY that locale's routes. Matrix-build mode (CI), where
  //   each locale gets its own job and 11 jobs merge into the final out/.
  const buildLocale = process.env.BUILD_LOCALE ?? ''

  // Paths PT-BR (sem prefixo de locale)
  const ptBR = conteudos.map(({ caminho }) => {
    const [categoria, ...rest] = caminho.split('/')
    return { categoria: categoria!, caminho: rest }
  })

  if (buildLocale === 'pt-BR') return ptBR

  // Paths com prefixo de locale (/en/aulas/..., /es/aulas/..., etc.)
  // No matrix mode: só o locale-alvo. No single-build mode: todos.
  const localePaths: Array<{ categoria: string; caminho: string[] }> = []
  const targetLocales = buildLocale ? [buildLocale] : Array.from(LOCALE_CODES)
  for (const localeCode of targetLocales) {
    if (localeCode === 'pt-BR') continue
    for (const c of conteudos) {
      const partes = c.caminho.split('/')
      // Aqui `categoria` recebe o LOCALE; `caminho` recebe categoria+resto
      localePaths.push({
        categoria: localeCode,
        caminho: partes,
      })
    }
  }
  if (buildLocale) return localePaths
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

  // ALL locales (PT-BR and translated) go through the webpack manifest
  // path via carregarMdxLocalizado. compileMDX-rsc was dropping JSX
  // expression props (opcoes, solucao, passos, fonte) on translated
  // routes — manifest path preserves them. The manifest is filtered to
  // `publicado: true` lessons so the module graph stays small enough
  // to build.
  const localeCode = (localeMatch?.locale ?? 'pt-BR') as Locale
  const mod = await carregarMdxLocalizado(completo, localeCode)
  if (!mod) notFound()
  const MDXContent: React.ComponentType = mod.default

  // For non-PT-BR locales, read frontmatter from the translated MDX
  // source so the page header (titulo, descricao) reflects the locale.
  // If the translation file is missing, manifest fallback already
  // returned the PT-BR module — leave frontmatter empty so we keep
  // the PT-BR meta from `conteudo.meta` below.
  let translatedFrontmatter: Record<string, unknown> = {}
  if (localeCode !== 'pt-BR') {
    const localeInfo = LOCALES[localeCode]
    const arquivo = caminhoArquivoMdx(completo, localeCode, localeInfo.speechLang)
    if (arquivo) {
      try {
        const { data } = await lerMdxSource(arquivo)
        translatedFrontmatter = data
      } catch {
        // Frontmatter read failed — fall through with PT-BR meta.
      }
    }
  }
  // Keep these symbols referenced so removing the compileMDX branch
  // doesn't dead-code the imports webpack needs at the top of file.
  void compileMDX
  void MDX_COMPONENTS
  void MDX_OPTIONS
  const translatedRendered: React.ReactNode = null
  void translatedRendered

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
      isEngenharia={isEngenharia}
      caminho={completo}
      prevLicao={prevLicao}
      nextLicao={nextLicao}
    >
      <MDXContent />
    </LessonPageShell>
  )
}
