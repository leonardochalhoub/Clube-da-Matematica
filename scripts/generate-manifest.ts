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

// Maps URL prefix locale codes (used as BUILD_LOCALE values) to
// filesystem directory names under content/i18n/. Filesystem uses
// long codes (en-US); URL uses short codes (en). 'pt-BR' is special
// — it has no URL prefix and reads from content/ directly.
const LOCALE_TO_FS_DIR: Record<string, string> = {
  'en': 'en-US', 'es': 'es-ES', 'zh': 'zh-CN', 'ja': 'ja-JP',
  'de': 'de-DE', 'fr': 'fr-FR', 'it': 'it-IT', 'ru': 'ru-RU',
  'ko': 'ko-KR', 'pl': 'pl-PL',
}

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

/**
 * Reads frontmatter `publicado:` flag. Returns `true` for any non-aula path
 * (Black-Scholes, métodos numéricos, etc. — those don't gate by publicado),
 * or for aula paths whose frontmatter has `publicado: true`.
 *
 * Filtering keeps the webpack module graph small: only published lessons
 * + their existing translations get bundled, avoiding OOM at ~468 entries.
 */
async function isPublished(rel: string): Promise<boolean> {
  if (!rel.startsWith('aulas/')) return true
  try {
    const text = await fs.readFile(path.join(CONTENT_DIR, `${rel}.mdx`), 'utf-8')
    const fm = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
    return /^publicado:\s*true\s*$/m.test(fm)
  } catch {
    return false
  }
}

async function main() {
  console.log('📘 Lendo content/ (PT-BR origem)…')
  const ptPathsAll = new Set<string>()
  for await (const p of walkMdx(CONTENT_DIR)) ptPathsAll.add(p)
  const ptPaths = new Set<string>()
  for (const p of ptPathsAll) {
    if (await isPublished(p)) ptPaths.add(p)
  }
  console.log(`   ${ptPathsAll.size} arquivos PT-BR no disco, ${ptPaths.size} publicados (entram no manifesto)`)

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
  // BUILD_LOCALE controls which translations enter the webpack module graph.
  //
  // - Unset (default — local dev): include the L1+L2 allowlist for both PT-BR
  //   and a small set of locales. Keeps `next dev` fast and matches what the
  //   prior gated build did.
  //
  // - Set to a single locale (matrix CI mode): include ONLY that locale's
  //   entries. Each per-locale CI job ends up with ~120 manifest entries
  //   instead of ~1320. Memory stays under 7 GB even with all 120 lessons
  //   published. PT-BR build emits root URLs; non-PT-BR builds emit
  //   /<locale>/... URLs only. Artifacts merge after.
  const buildLocale = process.env.BUILD_LOCALE ?? ''
  const isMatrixBuild = buildLocale !== ''

  // A maintained-locale translation is BUNDLED into the webpack manifest only
  // if it passes BOTH gates:
  //   (1) EXERCISE-SYNCED   — same `<Exercicio` count as the canonical PT-BR
  //                           (else it's a stale, half-translated lesson), and
  //   (2) BUILD-COMPILES    — `@mdx-js/mdx` (acorn, what `next build` runs)
  //                           parses it without error.
  // A file that fails either gate falls back to PT-BR under the locale URL —
  // which is correct: better the source language than a broken page that
  // crashes the whole build. Gate (2) is essential because exercise-count
  // parity does NOT imply the JSX/MDX is valid; on 2026-06-02 three es-ES
  // files were count-synced but had unclosed tags / acorn errors, and bundling
  // them broke `next build`. Bundling the manifest is what preserves the
  // JSX-expression props (opcoes, solucao, passos, fonte) that compileMDX
  // (next-mdx-remote/rsc) silently drops. Re-synced+fixed locales auto-include
  // on the next manifest regen — no hardcoded list to maintain.
  const MAINTAINED_LOCALES = ['en-US', 'es-ES']
  const countExercicios = (txt: string) => (txt.match(/<Exercicio\b/g) ?? []).length
  const compilesMdx = async (file: string): Promise<boolean> => {
    try {
      const { compile } = await import('@mdx-js/mdx')
      const remarkGfm = (await import('remark-gfm')).default
      const remarkMath = (await import('remark-math')).default
      const raw = await fs.readFile(file, 'utf-8')
      const body = raw.replace(/^---[\s\S]*?---\n/, '')
      await compile(body, { remarkPlugins: [remarkGfm, remarkMath] })
      return true
    } catch { return false }
  }
  // syncedByLocale[fsDir] = Set of paths where that locale is synced AND compiles.
  const syncedByLocale: Record<string, Set<string>> = {}
  for (const fsDir of MAINTAINED_LOCALES) syncedByLocale[fsDir] = new Set()
  for (const p of ptPaths) {
    let src: number
    try { src = countExercicios(await fs.readFile(path.join(CONTENT_DIR, `${p}.mdx`), 'utf-8')) }
    catch { continue }
    for (const fsDir of MAINTAINED_LOCALES) {
      const tgt = path.join(I18N_DIR, fsDir, `${p}.mdx`)
      try {
        if (countExercicios(await fs.readFile(tgt, 'utf-8')) !== src) continue  // gate 1
        if (!(await compilesMdx(tgt))) continue                                  // gate 2
        syncedByLocale[fsDir]!.add(p)
      } catch { /* no translation file */ }
    }
  }
  // A lesson is in the allowlist if ANY maintained locale is bundled for it.
  const includeTranslationsFor = new Set<string>()
  for (const fsDir of MAINTAINED_LOCALES) for (const p of syncedByLocale[fsDir]!) includeTranslationsFor.add(p)
  for (const fsDir of MAINTAINED_LOCALES) {
    console.log(`   ${fsDir}: ${syncedByLocale[fsDir]!.size} lessons synced+compiling → bundled`)
  }

  let out = `/**
 * GERADO AUTOMATICAMENTE por scripts/generate-manifest.ts
 * Não edite à mão — rode: pnpm tsx scripts/generate-manifest.ts
 *
 * Modo: ${isMatrixBuild ? `matrix build (BUILD_LOCALE=${buildLocale})` : 'dev/single (allowlist gated)'}
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
    if (isMatrixBuild) {
      // Matrix mode: emit a single entry for the target locale.
      // For PT-BR, use the canonical source. For other locales, use the
      // translation file if it exists, else fall back to the PT-BR file
      // (the locale URL still gets a route — just with PT-BR content).
      if (buildLocale === 'pt-BR') {
        out += `    'pt-BR': () => import('@/../content/${p}.mdx'),\n`
      } else {
        // BUILD_LOCALE is the URL prefix (en, de, etc.). The filesystem
        // directory uses the long code (en-US, de-DE) — translate.
        const fsDir = LOCALE_TO_FS_DIR[buildLocale]
        const localeSet = fsDir ? localeMap[fsDir] : undefined
        const fileExists = !!localeSet?.has(p)
        const allowlisted = includeTranslationsFor.has(p)
        if (fileExists && allowlisted && fsDir) {
          // Translation is aligned with current canonical PT-BR.
          out += `    '${buildLocale}': () => import('@/../content/i18n/${fsDir}/${p}.mdx'),\n`
        } else {
          // Either no translation file, OR file exists but is stale (lesson
          // was rewritten and translation hasn't been regenerated yet).
          // Route is served from PT-BR module under the locale URL.
          out += `    '${buildLocale}': () => import('@/../content/${p}.mdx'),\n`
        }
      }
    } else {
      // Single-build mode (dev): allowlist gating.
      //
      // For lessons in the allowlist, bundle only EN+ES translations.
      // The other 9 locales (de, fr, it, ja, ko, pl, ru, zh) fall back
      // to PT-BR via carregarMdxLocalizado's default. Why: bundling all
      // ~50 translation MDXs for the allowlist lessons (5 × 10 locales)
      // pushed the webpack build past 8 GB heap on WSL. Several of those
      // translations also have stale JSX (pre-strict-mode content) that
      // throws webpack cache serializer warnings. EN+ES are the locales
      // we actively maintain; others rebuild only via the matrix CI.
      out += `    'pt-BR': () => import('@/../content/${p}.mdx'),\n`
      // Bundle a maintained locale's file ONLY if it is exercise-synced for
      // this lesson (per-locale gate). Stale translations are skipped → the
      // locale URL falls back to PT-BR rather than shipping a half-translated
      // lesson with the wrong exercise count.
      for (const fsDir of MAINTAINED_LOCALES) {
        if (syncedByLocale[fsDir]!.has(p)) {
          out += `    '${fsDir}': () => import('@/../content/i18n/${fsDir}/${p}.mdx'),\n`
        }
      }
    }
    out += `  },\n`
  }
  out += `}\n`

  await fs.writeFile(OUT, out, 'utf-8')

  // Estatísticas
  const totalEntries = sortedPaths.reduce((acc, p) => {
    if (isMatrixBuild) return acc + 1 // exatamente uma entrada por path
    let count = 1 // pt-BR sempre
    if (includeTranslationsFor.has(p)) {
      for (const set of Object.values(localeMap)) if (set.has(p)) count++
    }
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
