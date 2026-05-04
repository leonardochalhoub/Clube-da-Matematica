/**
 * Gera src/lib/version.generated.ts com:
 *  - version do package.json
 *  - timestamp ISO da última atualização (commit HEAD ou now)
 *  - short commit SHA
 *
 * Rodar antes de cada build pra estampar a versão atual no Footer.
 */
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'))
const version = pkg.version as string

let commitSha = 'unknown'
let commitDate = new Date().toISOString()
try {
  commitSha = execSync('git rev-parse --short HEAD').toString().trim()
  commitDate = execSync('git log -1 --format=%cI').toString().trim()
} catch {
  // sem git: usa now()
}

const out = `// AUTO-GERADO por scripts/generate-version.ts — não edite à mão.
export const APP_VERSION = ${JSON.stringify(version)}
export const APP_COMMIT_SHA = ${JSON.stringify(commitSha)}
export const APP_LAST_UPDATE = ${JSON.stringify(commitDate)}
`

writeFileSync(join(ROOT, 'src/lib/version.generated.ts'), out)
console.log(`✓ version: ${version} · commit: ${commitSha} · date: ${commitDate}`)
