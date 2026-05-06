#!/usr/bin/env node
// Find raw $...$ math inside JSX expression bodies (solucao={<>...</>} or passos={<>...</>})
// and convert each to <Eq>{`...`}</Eq>. Skip math already wrapped in <Eq>.
import { readFile, writeFile } from 'node:fs/promises'

const files = process.argv.slice(2)

function fixLine(line) {
  // Detect lines that contain a JSX expression body opening
  // (solucao={<> or passos={<> on same line, OR within a <>...</>) ... too hard generally
  // Approach: just operate on lines whose first non-space starts with a key like solucao={<> or passos={<>
  //          OR <li> tags within passos blocks
  // For each such line, find $...$ matches and convert if NOT preceded by `<Eq>` and content has special chars
  return line
}

// Simpler approach: process the whole file with regex per line, but only for lines INSIDE
// a solucao={<>...</>} or passos={<>...</>} block
async function processFile(path) {
  const src = await readFile(path, 'utf-8')
  const lines = src.split('\n')
  let inJsxExpr = false
  let changed = false
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    const opens = (line.match(/=\{<>/g) || []).length
    const closes = (line.match(/<\/>\}/g) || []).length

    const wasInJsx = inJsxExpr
    inJsxExpr = inJsxExpr || opens > 0
    const processThisLine = inJsxExpr || wasInJsx

    if (processThisLine) {
      // Replace each $...$ that contains { or < or > with <Eq>{`...`}</Eq>
      // Skip if the match is inside an existing <Eq>{`...`}</Eq>
      // Match $...$ but NOT \$...\$ (escaped dollars are currency markers, not math)
      const newLine = line.replace(/(?<!\\)\$([^$\n]+?)(?<!\\)\$/g, (match, mathContent, offset) => {
        // Check it's not already inside a <Eq>{` ... `}</Eq> by inspecting char to the left
        const before = line.slice(Math.max(0, offset - 8), offset)
        const after = line.slice(offset + match.length, offset + match.length + 8)
        if (before.endsWith('<Eq>{`') || before.includes('<Eq>{`') && !after.startsWith('`}</Eq>')) {
          return match
        }
        // Skip if math content contains \$ (escaped dollar = currency)
        if (mathContent.includes('\\$')) return match
        // Only convert if math contains { or < or > (problematic chars in JSX)
        if (!/[{<>]/.test(mathContent)) return match
        // Escape backslashes for template literal
        const esc = mathContent.replace(/\\/g, '\\\\')
        return '<Eq>{`' + esc + '`}</Eq>'
      })
      if (newLine !== line) {
        lines[i] = newLine
        changed = true
      }
    }

    if (closes > 0 && opens === 0) inJsxExpr = false
    if (closes > 0 && opens > 0 && closes >= opens) inJsxExpr = false
  }
  if (changed) {
    await writeFile(path, lines.join('\n'))
    return true
  }
  return false
}

let total = 0
for (const f of files) {
  const changed = await processFile(f)
  if (changed) { console.log('CHANGED ' + f); total++ }
  else console.log('clean   ' + f)
}
console.log(`\n${total}/${files.length} files changed`)
