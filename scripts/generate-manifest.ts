#!/usr/bin/env tsx
/**
 * Gera manifest.ts a partir do filesystem.
 *
 * - PT-BR (origem): /content/<path>.mdx
 * - Traduções:       /content/i18n/<locale>/<path>.mdx
 *
 * Output: src/lib/content/manifest.generated.ts com:
 *   {
 *     'aulas/ano-1/trim-1/aula-01': {
 *       'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/aula-01.mdx'),
 *       'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/aula-01.mdx'),
 *       ...
 *     },
 *     ...
 *   }
 *
 * Webpack só consegue resolver imports com strings literais — por isso o
 * manifesto explícito.
 */
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

const ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content')
const I18N_DIR = path.join(CONTENT_DIR, 'i18n')
const OUT = path.join(ROOT, 'src/lib/content/manifest.generated.ts')

async function* walkMdx(dir: string, prefix = ''): AsyncGenerator<string> {
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entries) {
    if (e.name === 'i18n') continue // não recurse pra translations dentro do PT-BR walk
    const full = path.join(dir, e.name)
    const rel = prefix ? `${prefix}/${e.name}` : e.name
    if (e.isDirectory()) {
      yield* walkMdx(full, rel)
    } else if (e.name.endsWith('.mdx')) {
      yield rel.replace(/\.mdx$/, '')
    }
  }
}

async function main() {
  console.log('📘 Lendo content/ (PT-BR origem)…')
  const ptPaths = new Set<string>()
  for await (const p of walkMdx(CONTENT_DIR)) ptPaths.add(p)
  console.log(`   ${ptPaths.size} arquivos PT-BR`)

  console.log('🌐 Lendo content/i18n/<locale>/…')
  const locales = await fs.readdir(I18N_DIR).catch(() => [])
  const localeMap: Record<string, Set<string>> = {}
  for (const locale of locales) {
    const stat = await fs.stat(path.join(I18N_DIR, locale)).catch(() => null)
    if (!stat?.isDirectory()) continue
    localeMap[locale] = new Set()
    for await (const p of walkMdx(path.join(I18N_DIR, locale))) {
      localeMap[locale]!.add(p)
    }
    console.log(`   ${locale}: ${localeMap[locale]!.size} arquivos`)
  }

  // Gera o manifesto
  const sortedPaths = [...ptPaths].sort()
  let out = `/**
 * GERADO AUTOMATICAMENTE por scripts/generate-manifest.ts
 * Não edite à mão — rode: pnpm tsx scripts/generate-manifest.ts
 *
 * Cada path mapeia (locale → import dinâmico do MDX).
 * Usar via carregarMdxLocalizado(caminho, locale) em manifest.ts.
 */
import type { ComponentType } from 'react'

type MdxLoader = () => Promise<{ default: ComponentType }>

export const manifestoI18n: Record<string, Partial<Record<string, MdxLoader>>> = {
`

  for (const p of sortedPaths) {
    out += `  '${p}': {\n`
    out += `    'pt-BR': () => import('@/../content/${p}.mdx'),\n`
    for (const [locale, set] of Object.entries(localeMap)) {
      if (set.has(p)) {
        out += `    '${locale}': () => import('@/../content/i18n/${locale}/${p}.mdx'),\n`
      }
    }
    out += `  },\n`
  }
  out += `}\n`

  await fs.writeFile(OUT, out, 'utf-8')

  // Estatísticas
  const totalEntries = sortedPaths.reduce((acc, p) => {
    let count = 1 // pt-BR sempre
    for (const set of Object.values(localeMap)) if (set.has(p)) count++
    return acc + count
  }, 0)

  console.log(`\n✅ Manifesto gerado: ${OUT}`)
  console.log(`   ${sortedPaths.length} paths × média ${(totalEntries / sortedPaths.length).toFixed(1)} locales`)
  console.log(`   ${totalEntries} entries totais`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
