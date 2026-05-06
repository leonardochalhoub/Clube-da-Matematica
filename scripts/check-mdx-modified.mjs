#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

const files = process.argv.slice(2)
let fail = 0
for (const f of files) {
  try {
    const src = await readFile(f, 'utf-8')
    const body = src.replace(/^---\n[\s\S]*?\n---\n/, '')
    await compile(body, {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeKatex],
      jsx: true,
    })
    console.log('OK   ' + f)
  } catch (e) {
    fail++
    const loc = e.line ? `:${e.line}:${e.column}` : ''
    console.log('FAIL ' + f + loc + '  ' + (e.reason || e.message).split('\n')[0])
  }
}
console.log(`\n${files.length - fail}/${files.length} ok, ${fail} failed`)
process.exit(fail ? 1 : 0)
