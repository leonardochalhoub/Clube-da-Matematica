#!/usr/bin/env node
/**
 * check-mdx-build.mjs — build-ACCURATE MDX validation.
 *
 * Uses @mdx-js/mdx (the acorn-based compiler `next build` actually runs),
 * NOT next-mdx-remote. The next-mdx-remote checker (scripts/check-rsc-all.mjs)
 * is LENIENT and passes files that `next build` rejects — it hid 30 en-US
 * failures in the 2026-06 translation pass. Always verify translations with
 * THIS script before claiming a file compiles.
 *
 * Usage:
 *   node scripts/check-mdx-build.mjs <file.mdx | dir>   (default: content)
 * Prints FAIL <path> + first error line; exits 1 if any fail.
 */
import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { readFile, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

async function* walk(d) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = join(d, e.name)
    if (e.isDirectory()) yield* walk(p)
    else if (p.endsWith('.mdx')) yield p
  }
}

const target = process.argv[2] || 'content'
const files = []
if ((await stat(target)).isDirectory()) { for await (const f of walk(target)) files.push(f) }
else files.push(target)
files.sort()

let fail = 0, ok = 0
for (const f of files) {
  const raw = await readFile(f, 'utf-8')
  const src = raw.replace(/^---[\s\S]*?---\n/, '')
  try { await compile(src, { remarkPlugins: [remarkGfm, remarkMath] }); ok++ }
  catch (e) {
    fail++
    console.log('FAIL', f)
    console.log('  ', (e.message || '').split('\n')[0], e.line ? `(body line ${e.line}:${e.column})` : '')
  }
}
console.log(`\ncheck-mdx-build: ok=${ok} fail=${fail}`)
process.exit(fail ? 1 : 0)
