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

// Stub every custom component so children still render (and trigger {ident}
// eval). MUST mirror the full set in mdx-components.tsx — a missing name causes
// a false "Expected component X to be defined". Keep in sync with that file.
const passthrough = (name) => (props) => React.createElement('div', { 'data-c': name }, props?.children)
const NAMES = [
  'DuasPortas','Porta','Equation','Eq','EquacaoCanonica','PayoffChart',
  'ListaExercicios','Exercicio','VerificarPasso',
  'Definicao','Teorema','Corolario','Exemplo','Insight','Cuidado','Leituras',
]
const components = Object.fromEntries(NAMES.map(n => [n, passthrough(n)]))

async function* walk(d){ for(const e of await readdir(d,{withFileTypes:true})){ const p=join(d,e.name); if(e.isDirectory()) yield* walk(p); else if(p.endsWith('.mdx')) yield p } }

// URL code -> content/i18n/<dir>. pt-br has no i18n dir (source in content/).
const URL_TO_FS = { en:'en-US', es:'es-ES', zh:'zh-CN', ja:'ja-JP', de:'de-DE', fr:'fr-FR', it:'it-IT', ru:'ru-RU', ko:'ko-KR', pl:'pl-PL' }

const args = process.argv.slice(2)
const localeArg = (args.find(a => a.startsWith('--build-locale=')) || '').split('=')[1] || process.env.BUILD_LOCALE || ''
const positional = args.filter(a => !a.startsWith('--'))

const files=[]
if (localeArg) {
  // Mirror what the matrix job actually builds: the pt-BR base (everything
  // under content/ EXCEPT content/i18n) + ONLY this locale's i18n dir.
  // Render-checking other locales would flag files that aren't deployed.
  for await (const f of walk('content')) {
    if (!f.includes(`${'content'}/i18n/`)) { files.push(f); continue }
    if (localeArg !== 'pt-br') {
      const fsDir = URL_TO_FS[localeArg]
      if (fsDir && f.includes(`content/i18n/${fsDir}/`)) files.push(f)
    }
  }
} else {
  const target = positional[0] || 'content'
  if((await stat(target)).isDirectory()){ for await(const f of walk(target)) files.push(f) } else files.push(target)
}
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
