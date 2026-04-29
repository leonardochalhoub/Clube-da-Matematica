#!/usr/bin/env tsx
/**
 * Pre-tradução de strings de áudio (build-time).
 *
 * Workflow:
 *   1. Varre todos os .mdx em content/ procurando `audioTexto="..."`.
 *   2. Dedupa.
 *   3. Para cada string única, traduz via MyMemory para os 15 idiomas-alvo.
 *   4. Salva em src/content/audio-translations.generated.ts (commitado).
 *
 * Resultado: AudioReader.tsx lê do TS gerado em vez de chamar API em runtime.
 *
 * Como rodar:
 *   pnpm tsx scripts/pretranslate-audio.ts            # incremental (só novas strings)
 *   pnpm tsx scripts/pretranslate-audio.ts --force    # re-traduz tudo
 *   pnpm tsx scripts/pretranslate-audio.ts --langs=es,de   # subset de idiomas
 *
 * MyMemory: 5000 chars/dia/IP anônimo. Adicione `&de=email@x.com` no fetch
 * pra subir pra 50k. Já está embutido como `clube@clube-da-matematica.dev`.
 */
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

const ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content')
const OUT_FILE = path.join(ROOT, 'src/content/audio-translations.generated.ts')

const TARGET_LANGS = [
  { locale: 'en', mymemory: 'en-US' },
  { locale: 'es', mymemory: 'es-ES' },
  { locale: 'zh', mymemory: 'zh-CN' },
  { locale: 'ja', mymemory: 'ja-JP' },
  { locale: 'de', mymemory: 'de-DE' },
  { locale: 'fr', mymemory: 'fr-FR' },
  { locale: 'it', mymemory: 'it-IT' },
  { locale: 'ru', mymemory: 'ru-RU' },
  { locale: 'ko', mymemory: 'ko-KR' },
  { locale: 'vi', mymemory: 'vi-VN' },
  { locale: 'pl', mymemory: 'pl-PL' },
  { locale: 'sw', mymemory: 'sw-KE' },
  { locale: 'ar', mymemory: 'ar-SA' },
  { locale: 'hi', mymemory: 'hi-IN' },
  { locale: 'et', mymemory: 'et-EE' },
] as const

type TranslationMap = Record<string, Record<string, string>>

async function walkMdxFiles(dir: string): Promise<string[]> {
  const out: string[] = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      out.push(...(await walkMdxFiles(full)))
    } else if (e.isFile() && e.name.endsWith('.mdx')) {
      out.push(full)
    }
  }
  return out
}

function extractAudioStrings(source: string): string[] {
  // Captura: audioTexto="..." (string literal de uma linha)
  // Limitação: não pega multi-linha nem template literals — adicione se necessário.
  const re = /audioTexto\s*=\s*"((?:[^"\\]|\\.)+)"/g
  const out: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(source)) !== null) {
    const raw = m[1]!.replace(/\\"/g, '"').replace(/\\\\/g, '\\')
    out.push(raw)
  }
  return out
}

async function loadExisting(): Promise<TranslationMap> {
  try {
    const txt = await fs.readFile(OUT_FILE, 'utf8')
    // Captura tudo entre `= {` e `} as const`. Greedy pra pegar o último `}`.
    const match = txt.match(/AUDIO_TRANSLATIONS[^=]*=\s*(\{[\s\S]*\})\s*as\s+const/)
    if (!match) return {}
    const obj = new Function(`return ${match[1]}`)() as TranslationMap
    return obj
  } catch (e) {
    console.warn(`⚠️  Não consegui carregar traduções existentes:`, (e as Error).message)
    return {}
  }
}

async function traduzir(texto: string, langPair: string): Promise<string | null> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=pt-BR|${langPair}&de=clube@clube-da-matematica.dev`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = (await res.json()) as {
      responseData?: { translatedText?: string }
    }
    const t = data?.responseData?.translatedText
    if (typeof t !== 'string' || t.length === 0) return null
    if (/^(MYMEMORY|INVALID|PLEASE|QUERY LENGTH)/i.test(t.trim())) return null
    return t
  } catch {
    return null
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function escapeForTsLiteral(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
}

function emitFile(map: TranslationMap): string {
  const header = `/* eslint-disable */
/**
 * GERADO AUTOMATICAMENTE por scripts/pretranslate-audio.ts
 * Não edite à mão — rode o script para regenerar.
 *
 * Cada chave é o texto PT-BR original (do prop \`audioTexto\`).
 * Cada valor é um mapa BCP-47 (speechLang) → tradução.
 */

export const AUDIO_TRANSLATIONS: Record<string, Record<string, string>> = {
`
  const entries = Object.keys(map)
    .sort()
    .map((k) => {
      const inner = Object.entries(map[k]!)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([lang, val]) => `    '${lang}': '${escapeForTsLiteral(val)}',`)
        .join('\n')
      return `  '${escapeForTsLiteral(k)}': {\n${inner}\n  },`
    })
    .join('\n')
  return `${header}${entries}\n} as const\n`
}

async function main() {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const langArg = args.find((a) => a.startsWith('--langs='))
  const langFilter = langArg ? langArg.replace('--langs=', '').split(',') : null
  const langs = langFilter
    ? TARGET_LANGS.filter((l) => langFilter.includes(l.locale))
    : TARGET_LANGS

  console.log(`📘 Lendo MDX de ${CONTENT_DIR}…`)
  const mdxFiles = await walkMdxFiles(CONTENT_DIR)
  console.log(`   ${mdxFiles.length} arquivos`)

  const allStrings = new Set<string>()
  for (const f of mdxFiles) {
    const txt = await fs.readFile(f, 'utf8')
    for (const s of extractAudioStrings(txt)) allStrings.add(s)
  }
  console.log(`🔍 ${allStrings.size} strings únicas de áudio encontradas`)

  const existing = force ? {} : await loadExisting()
  const map: TranslationMap = { ...existing }

  let total = 0
  let saltadas = 0
  let traduzidas = 0
  let falhas = 0

  for (const texto of allStrings) {
    if (!map[texto]) map[texto] = {}
    for (const lang of langs) {
      total++
      const speechLang = lang.mymemory
      if (map[texto]![speechLang]) {
        saltadas++
        continue
      }
      process.stdout.write(`  [${traduzidas + 1}] ${lang.locale} ← ${texto.slice(0, 50)}…  `)
      const traduzido = await traduzir(texto, speechLang)
      if (traduzido) {
        map[texto]![speechLang] = traduzido
        traduzidas++
        process.stdout.write(`✓\n`)
      } else {
        falhas++
        process.stdout.write(`✗\n`)
      }
      // Throttle: ~5 req/s — suficientemente conservador
      await sleep(220)
    }
    // Salva incremental a cada string completa (resilência)
    await fs.writeFile(OUT_FILE, emitFile(map), 'utf8')
  }

  console.log(`\n✅ Pronto.`)
  console.log(`   Total chamadas: ${total}`)
  console.log(`   Cache hits:     ${saltadas}`)
  console.log(`   Traduzidas:     ${traduzidas}`)
  console.log(`   Falhas:         ${falhas}`)
  console.log(`   Output:         ${OUT_FILE}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
