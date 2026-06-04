#!/usr/bin/env node
/**
 * gen-redirect-stubs.mjs — backward-compat redirects for the pt-BR URL move.
 *
 * Context: pt-BR lessons used to live at root URLs (/aulas/…); they now live at
 * /pt-br/aulas/… (pt-BR became a normal URL locale so each language builds in
 * its own CI job). To preserve old links / SEO, this writes a static HTML stub
 * at each OLD root path that redirects to the NEW /pt-br/ path.
 *
 * `output: export` can't use next.config redirects(), so we emit meta-refresh +
 * canonical + JS-replace stubs into ./out after `next build`.
 *
 * Run in the pt-br matrix job only (it owns the root tree in ./out):
 *   NEXT_PUBLIC_BASE_PATH=/Clube-da-Matematica node scripts/gen-redirect-stubs.mjs
 *
 * Idempotent: overwrites existing stubs; never touches real /pt-br/ pages.
 */
import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const CONTENT = join(ROOT, 'content')
const OUT = join(ROOT, 'out')
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

// Only these top-level content dirs hold lessons that had root URLs.
const LESSON_DIRS = ['aulas', 'financas-quantitativas', 'metodos-numericos', 'calculo-1']

async function* walkMdx(dir, base = dir) {
  if (!existsSync(dir)) return
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name)
    if (e.isDirectory()) yield* walkMdx(full, base)
    else if (e.name.endsWith('.mdx')) yield relative(base, full).replace(/\.mdx$/, '')
  }
}

function isPublished(raw, rel) {
  // Non-aulas content is always published; aulas gate on `publicado: true`.
  if (!rel.startsWith('aulas/')) return true
  const fm = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
  return /^publicado:\s*true\s*$/m.test(fm)
}

function stubHtml(targetPath) {
  // targetPath: absolute site path with trailing slash, base-prefixed.
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Redirecting…</title>
<link rel="canonical" href="${targetPath}">
<meta name="robots" content="noindex,follow">
<meta http-equiv="refresh" content="0; url=${targetPath}">
<script>location.replace(${JSON.stringify(targetPath)} + location.hash);</script>
</head><body>Redirecting to <a href="${targetPath}">${targetPath}</a>…</body></html>
`
}

async function main() {
  if (!existsSync(OUT)) {
    console.error(`[redirect-stubs] ./out not found — run after next build.`)
    process.exit(1)
  }
  const caminhos = []
  for (const d of LESSON_DIRS) {
    const dir = join(CONTENT, d)
    if (!existsSync(dir)) continue
    for await (const rel of walkMdx(dir)) {
      const caminho = `${d}/${rel}`
      const raw = await readFile(join(CONTENT, `${caminho}.mdx`), 'utf-8')
      if (isPublished(raw, caminho)) caminhos.push(caminho)
    }
  }

  let written = 0
  for (const caminho of caminhos) {
    const oldDir = join(OUT, caminho)            // ./out/aulas/ano-…/licao-…/
    const target = `${BASE}/pt-br/${caminho}/`   // /Clube-da-Matematica/pt-br/aulas/…/
    await mkdir(oldDir, { recursive: true })
    await writeFile(join(oldDir, 'index.html'), stubHtml(target), 'utf-8')
    written++
  }
  console.log(`[redirect-stubs] wrote ${written} root→/pt-br/ redirect stubs (base="${BASE}")`)
}

main().catch((e) => { console.error(e); process.exit(1) })
