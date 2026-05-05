import { compile } from '@mdx-js/mdx'
import remarkMath from 'remark-math'
import remarkFrontmatter from 'remark-frontmatter'
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) yield* walk(p)
    else if (p.endsWith('.mdx')) yield p
  }
}

const files = []
for await (const f of walk('content/aulas')) files.push(f)
files.sort()
for (const f of files) {
  try {
    const src = await readFile(f, 'utf-8')
    await compile(src, { remarkPlugins: [remarkFrontmatter, remarkMath] })
  } catch (e) {
    const msg = e.message || ''
    const place = e.line && e.column ? ` (line ${e.line}:${e.column})` : ''
    console.log(`BROKEN: ${f}`)
    console.log(`  ${msg.split('\n')[0]}${place}`)
  }
}
