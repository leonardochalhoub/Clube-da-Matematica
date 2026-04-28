/**
 * Loader de conteúdo MDX em build-time.
 *
 * Lê todos os arquivos `.mdx` em `content/`, valida o frontmatter contra
 * o schema Zod, e expõe utilitários para `generateStaticParams` e
 * páginas de listagem.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import { conteudoSchema, type Conteudo } from '@/content/schema'

const CONTENT_DIR = join(process.cwd(), 'content')

export interface ConteudoCarregado {
  meta: Conteudo
  /** Caminho relativo: `metodos-numericos/zero-de-funcoes/bissecao` */
  caminho: string
}

function* walkMdx(dir: string, prefixo = ''): Generator<{ full: string; rel: string }> {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    const rel = prefixo ? `${prefixo}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      yield* walkMdx(full, rel)
    } else if (entry.name.endsWith('.mdx')) {
      yield { full, rel: rel.replace(/\.mdx$/, '') }
    }
  }
}

let cache: ConteudoCarregado[] | null = null

export function carregarTodosConteudos(): ConteudoCarregado[] {
  if (cache) return cache
  const items: ConteudoCarregado[] = []
  for (const { full, rel } of walkMdx(CONTENT_DIR)) {
    const raw = readFileSync(full, 'utf-8')
    const { data } = matter(raw)
    const result = conteudoSchema.safeParse(data)
    if (!result.success) {
      console.error(`[content] frontmatter inválido em ${rel}.mdx:`)
      console.error(JSON.stringify(result.error.flatten(), null, 2))
      throw new Error(`Frontmatter inválido em ${rel}.mdx`)
    }
    items.push({ meta: result.data, caminho: rel })
  }
  items.sort((a, b) => {
    if (a.meta.categoria !== b.meta.categoria) {
      return a.meta.categoria.localeCompare(b.meta.categoria)
    }
    return a.meta.ordem - b.meta.ordem
  })
  cache = items
  return items
}

export function carregarPorSlug(slug: string): ConteudoCarregado | undefined {
  return carregarTodosConteudos().find((c) => c.meta.slug === slug)
}

export function publicadosApenas(): ConteudoCarregado[] {
  return carregarTodosConteudos().filter((c) => c.meta.publicado)
}
