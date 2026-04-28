/**
 * Valida o frontmatter de todos os MDX em content/ contra o schema Zod.
 * Roda em CI antes do build. Falha se algum arquivo for inválido.
 *
 * Uso:  npm run validate-content
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'
import matter from 'gray-matter'
import { conteudoSchema } from '../src/content/schema'

const CONTENT_DIR = join(process.cwd(), 'content')

function* walkMdx(dir: string): Generator<string> {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walkMdx(full)
    else if (entry.name.endsWith('.mdx')) yield full
  }
}

let total = 0
let erros = 0

for (const file of walkMdx(CONTENT_DIR)) {
  total++
  const raw = readFileSync(file, 'utf-8')
  const { data } = matter(raw)
  const result = conteudoSchema.safeParse(data)
  const rel = relative(process.cwd(), file)
  if (!result.success) {
    console.error(`✗ ${rel}`)
    console.error(JSON.stringify(result.error.flatten().fieldErrors, null, 2))
    erros++
  } else {
    console.log(`✓ ${rel}`)
  }
}

console.log(`\n${total} arquivo(s) verificado(s), ${erros} com erro(s).`)

if (erros > 0) process.exit(1)
