#!/usr/bin/env tsx
/**
 * Compila cada arquivo MDX de content/engenharia/ usando o mesmo pipeline
 * do webpack (remark-gfm + remark-math + MDX) e reporta erros de JSX.
 *
 * Uso: pnpm tsx scripts/validate-mdx-compile.ts
 */
import { compile } from '@mdx-js/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const CONTENT_DIR = join(ROOT, 'content', 'engenharia')

function* walkMdx(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walkMdx(full)
    else if (entry.name.endsWith('.mdx')) yield full
  }
}

async function main() {
  const errors: Array<{ file: string; message: string }> = []
  let ok = 0

  for (const file of walkMdx(CONTENT_DIR)) {
    const source = readFileSync(file, 'utf-8')
    try {
      await compile(source, {
        remarkPlugins: [remarkFrontmatter, remarkGfm, remarkMath],
      })
      ok++
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      const rel = file.replace(ROOT, '').replace(/\\/g, '/')
      errors.push({ file: rel, message: msg.split('\n')[0]! })
    }
  }

  console.log(`\nChecked ${ok + errors.length} files: ${ok} OK, ${errors.length} errors\n`)
  if (errors.length) {
    for (const { file, message } of errors) {
      console.error(`ERROR: ${file}`)
      console.error(`  ${message}\n`)
    }
    process.exit(1)
  } else {
    console.log('All MDX files compiled successfully.')
  }
}

main()
