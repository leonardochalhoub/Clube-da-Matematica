import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { readFile } from 'node:fs/promises'

const f = process.argv[2]
const src = (await readFile(f, 'utf-8')).replace(/^---[\s\S]*?---\n/, '')
try {
  await compileMDX({ source: src, options: { mdxOptions: { remarkPlugins: [remarkGfm, remarkMath] } } })
  console.log('OK')
} catch (e) {
  console.log('FAIL:')
  console.log(e.message)
  console.log('---')
  if (e.position) console.log('pos:', JSON.stringify(e.position))
  if (e.line) console.log('line:', e.line, 'col:', e.column)
}
