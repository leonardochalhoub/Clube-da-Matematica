#!/usr/bin/env node
/**
 * Compile each v0 MDX lesson in isolation using @mdx-js/mdx
 * with the same plugin set as the build, and report which ones fail.
 *
 * This catches the actual MDX parse errors that break next build,
 * without having to do a full Next.js build per lesson.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

function* walkMdx(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walkMdx(full)
    else if (entry.name.endsWith('.mdx')) yield full
  }
}

const v0Paths = []
for (const p of walkMdx('content/aulas')) {
  const text = await readFile(p, 'utf-8')
  if (text.match(/^---\n[\s\S]*?versao:\s*"v0"[\s\S]*?\n---/m)) {
    v0Paths.push(p)
  }
}

console.log(`Checking ${v0Paths.length} v0 lessons...\n`)

const failures = []
const passes = []

for (const path of v0Paths) {
  const src = await readFile(path, 'utf-8')
  try {
    await compile(src, {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeKatex],
    })
    passes.push(path)
  } catch (e) {
    failures.push({ path, line: e.line ?? '?', col: e.column ?? '?', msg: e.message ?? String(e) })
  }
  if ((passes.length + failures.length) % 10 === 0) {
    process.stdout.write(`  ${passes.length + failures.length}/${v0Paths.length}...\r`)
  }
}

console.log(`\nPASS: ${passes.length}`)
console.log(`FAIL: ${failures.length}`)

if (failures.length) {
  console.log('\n--- FAILURES ---')
  for (const f of failures) {
    const rel = f.path.replace('content/aulas/', '')
    const firstLine = f.msg.split('\n')[0].slice(0, 100)
    console.log(`${rel}:${f.line}:${f.col}  ${firstLine}`)
  }
}

await writeFile('/tmp/v0-pass.txt', passes.map(p => p.replace('content/aulas/', '')).join('\n'))
await writeFile('/tmp/v0-fail.txt', failures.map(f => `${f.path.replace('content/aulas/', '')}\t${f.line}\t${f.msg.split('\n')[0]}`).join('\n'))
console.log(`\n→ Pass list: /tmp/v0-pass.txt (${passes.length})`)
console.log(`→ Fail list: /tmp/v0-fail.txt (${failures.length})`)
