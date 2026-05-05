import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { readFile } from 'node:fs/promises'

const f = process.argv[2]
const raw = await readFile(f, 'utf-8')
const src = raw.replace(/^---[\s\S]*?---\n/, '')
try {
  await compile(src, { remarkPlugins: [remarkGfm, remarkMath] })
  console.log('OK')
} catch (e) {
  console.log(e.message)
  if (e.line) console.log('line', e.line, 'col', e.column)
  if (e.position) console.log('position', JSON.stringify(e.position))
}
