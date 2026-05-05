import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  carregarTodosConteudos,
  carregarPorSlug,
} from '@/lib/content/loader'
import { carregarMdx } from '@/lib/content/manifest'
import { LessonPageShell } from '@/components/layout/LessonPageShell'
import { LICOES_FLAT } from '@/content/programa-em'
import { LOCALES } from '@/lib/i18n/locales'

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
