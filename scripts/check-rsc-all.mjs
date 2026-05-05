import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
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
  const raw = await readFile(f, 'utf-8')
  const src = raw.replace(/^---[\s\S]*?---\n/, '')
  try {
    await compileMDX({ source: src, options: { mdxOptions: { remarkPlugins: [remarkGfm, remarkMath] } } })
  } catch (e) {
    console.log('FAIL:', f)
    const msg = (e.message || '').split('\n').slice(0, 3).join(' | ')
    console.log(' ', msg)
  }
}
