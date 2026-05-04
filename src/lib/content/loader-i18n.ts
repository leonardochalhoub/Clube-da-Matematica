/**
 * Loader server-side de MDX por locale via filesystem.
 *
 * Lê o arquivo MDX direto de `content/i18n/<locale>/...` (ou
 * `content/aulas/...` pra pt-BR) e devolve o source string.
 *
 * NÃO usa webpack — bypass total da bundling pra evitar OOM com
 * 1.240 chunks (124 paths × 11 locales).
 *
 * Renderização: MDXRemote do next-mdx-remote/rsc faz compile +
 * render no React Server Component, retorna HTML estático.
 */
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import type { Locale } from '@/lib/i18n/locales'

const ROOT = process.cwd()

/**
 * Devolve o caminho absoluto do MDX pra (caminho, locale).
 * pt-BR usa content/aulas/...; outros usam content/i18n/<locale>/...
 *
 * speechLang format: 'pt-BR', 'en-US', 'es-ES', etc. (vem de LOCALES[loc].speechLang)
 */
export function caminhoArquivoMdx(caminho: string, locale: Locale, speechLang: string): string | null {
  const rel = `${caminho}.mdx`
  if (locale === 'pt-BR') {
    const p = join(ROOT, 'content', rel)
    return existsSync(p) ? p : null
  }
  // Locales não-PT usam content/i18n/<speechLang>/<caminho>.mdx
  const p = join(ROOT, 'content', 'i18n', speechLang, rel)
  return existsSync(p) ? p : null
}

export interface MdxSource {
  /** Conteúdo MDX (sem frontmatter). */
  content: string
  /** Frontmatter parseado. */
  data: Record<string, unknown>
}

/** Lê e separa frontmatter + conteúdo MDX. */
export async function lerMdxSource(arquivo: string): Promise<MdxSource> {
  const raw = await readFile(arquivo, 'utf-8')
  const { content, data } = matter(raw)
  return { content, data: data as Record<string, unknown> }
}
