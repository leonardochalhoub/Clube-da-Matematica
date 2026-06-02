#!/usr/bin/env node
/**
 * check-mdx-render.mjs — RENDER-accurate MDX validation.
 *
 * Parsing (check-mdx-build.mjs / acorn) is NOT enough: `$\mathbb{R}$` inside a
 * JSX fragment parses fine but throws `R is not defined` at PRERENDER, which is
 * what `next build` does and what crashed the en deploy (licao-50).
 *
 * This compiles each MDX to a component and renders it to static markup with
 * the same plugins + a stub for every custom component, surfacing render-time
 * ReferenceErrors before they reach CI.
 *
 *   node scripts/check-mdx-render.mjs <file|dir>
 */
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { readFile, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

// Stub every custom component so children still render (and trigger {ident} eval).
const passthrough = (name) => (props) => React.createElement('div', { 'data-c': name }, props?.children)
const NAMES = ['DuasPortas','Porta','Equation','Eq','EquacaoCanonica','PayoffChart','ListaExercicios','Exercicio','VerificarPasso','Definicao','Teorema','Exemplo','Insight','Cuidado','Leituras']
const components = Object.fromEntries(NAMES.map(n => [n, passthrough(n)]))

async function* walk(d){ for(const e of await readdir(d,{withFileTypes:true})){ const p=join(d,e.name); if(e.isDirectory()) yield* walk(p); else if(p.endsWith('.mdx')) yield p } }

const target = process.argv[2] || 'content'
const files=[]
if((await stat(target)).isDirectory()){ for await(const f of walk(target)) files.push(f) } else files.push(target)
files.sort()

let ok=0, fail=0
for(const f of files){
  const raw = await readFile(f,'utf-8')
  const src = raw.replace(/^---[\s\S]*?---\n/,'')
  try{
    const code = await compile(src,{ outputFormat:'function-body', remarkPlugins:[remarkGfm,remarkMath], rehypePlugins:[[rehypeKatex,{throwOnError:false,strict:false}]] })
    const { default: MDXContent } = await run(code, { ...runtime, baseUrl: import.meta.url })
    renderToStaticMarkup(React.createElement(MDXContent, { components }))
    ok++
  }catch(e){
    fail++
    console.log('RENDER-FAIL', f)
    console.log('  ', (e.message||'').split('\n')[0])
  }
}
console.log(`\ncheck-mdx-render: ok=${ok} fail=${fail}`)
process.exit(fail?1:0)
