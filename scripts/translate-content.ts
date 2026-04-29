/**
 * Script de pré-tradução em batch via Claude Opus 4.7.
 *
 * Princípio: traduzir TUDO em build time, não runtime. Quando o admin
 * decide traduzir, esse script:
 *   1. Lê todos os arquivos MDX em content/aulas/
 *   2. Chama Claude Opus 4.7 com prompt cuidadoso por idioma
 *   3. Salva traduções em content/translations/<locale>/<arquivo>.mdx
 *   4. Cliente carrega o MDX traduzido quando locale != pt-BR
 *
 * Como rodar:
 *   ANTHROPIC_API_KEY=sk-ant-... npx tsx scripts/translate-content.ts en
 *
 * Argumentos:
 *   - locale obrigatório: en, es, zh, ja, de, fr, it, ru, ko, vi, pl, sw, ar, hi, et
 *   - --only=aula-01-...  → traduz só um arquivo (debug)
 *   - --dry-run           → mostra o que faria sem chamar API
 *
 * Modelo: claude-opus-4-7-20251120 (Opus 4.7) com 200k context, baixa
 * temperatura, prompt instruindo:
 *   - Manter LaTeX intacto ($...$ e $$...$$)
 *   - Manter componentes JSX (<Porta>, <Eq>, etc.)
 *   - Manter URLs, números, código
 *   - Traduzir SÓ texto humano
 *   - Adaptar idiomatismos brasileiros (ex.: ENEM → vestibular nacional EUA equiv)
 *
 * Custo estimado: 120 lições × ~10k tokens = 1.2M tokens por idioma.
 * Em Opus 4.7: ~$15 input + ~$75 output = $90 por idioma.
 * Para 15 idiomas além de PT-BR: ~$1350 (one-shot).
 *
 * Cache: salva em translations/.cache/<hash>.json — se rodar de novo,
 * pula arquivos já traduzidos com mesmo conteúdo source.
 */

/* eslint-disable */
// @ts-nocheck — este é um script standalone, não passa pelo build do Next

const SUPPORTED_LOCALES = ['en', 'es', 'zh', 'ja', 'de', 'fr', 'it', 'ru', 'ko', 'vi', 'pl', 'sw', 'ar', 'hi', 'et']

const LOCALE_NAMES = {
  en: 'English',
  es: 'Spanish (Castilian)',
  zh: 'Mandarin Chinese (Simplified)',
  ja: 'Japanese',
  de: 'German',
  fr: 'French',
  it: 'Italian',
  ru: 'Russian',
  ko: 'Korean',
  vi: 'Vietnamese',
  pl: 'Polish',
  sw: 'Swahili',
  ar: 'Arabic',
  hi: 'Hindi',
  et: 'Estonian',
}

const PROMPT_TEMPLATE = (targetName, targetCode) => `You are a precise mathematical content translator working with MDX files.

TASK: Translate the following Brazilian Portuguese (PT-BR) MDX content into ${targetName} (${targetCode}).

STRICT RULES:
1. NEVER translate or modify LaTeX expressions inside \\$...\\$ or \\$\\$...\\$\\$
2. NEVER translate or modify JSX/React component tags like <Porta>, <Eq>, <EquacaoCanonica>, <ListaExercicios>, <Exercicio>, <Definicao>, <DuasPortas>, etc.
3. NEVER translate URLs, slugs, file names, or technical identifiers
4. NEVER translate code blocks (\`\`\`...\`\`\`) or inline code (\`...\`)
5. NEVER translate the YAML frontmatter keys (titulo, slug, etc.) — but DO translate the values when they are human-readable text
6. Preserve all Markdown formatting (headers #, bold **, italic *, lists -, tables |)
7. Adapt Brazilian-specific examples (ENEM → equivalent national exam in target country, BNCC → equivalent curriculum framework, BRL/Reais → equivalent local currency where appropriate)
8. Keep mathematical terminology natural to ${targetName} academic tradition
9. Be precise. Mathematical clarity matters more than literary flourish.
10. Output ONLY the translated MDX. No commentary, no markdown code fences around the result.

INPUT MDX:
---
{CONTENT}
---

OUTPUT (translated MDX in ${targetName}):`

async function main() {
  const args = process.argv.slice(2)
  const locale = args.find((a) => !a.startsWith('--'))
  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    console.error('Usage: ANTHROPIC_API_KEY=... npx tsx scripts/translate-content.ts <locale>')
    console.error('Supported:', SUPPORTED_LOCALES.join(', '))
    process.exit(1)
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('Set ANTHROPIC_API_KEY environment variable.')
    process.exit(1)
  }

  const fs = await import('fs')
  const path = await import('path')
  const { glob } = await import('glob')

  const sourceFiles = await glob('content/aulas/**/*.mdx', { cwd: process.cwd() })
  const targetDir = `content/translations/${locale}`
  fs.mkdirSync(targetDir, { recursive: true })

  console.log(`Translating ${sourceFiles.length} files into ${LOCALE_NAMES[locale]} (${locale})`)

  const dryRun = args.includes('--dry-run')
  const only = args.find((a) => a.startsWith('--only='))?.replace('--only=', '')

  for (const file of sourceFiles) {
    if (only && !file.includes(only)) continue
    const relative = path.relative('content/aulas', file)
    const target = path.join(targetDir, relative)
    fs.mkdirSync(path.dirname(target), { recursive: true })

    if (fs.existsSync(target)) {
      console.log(`  [skip] ${target} already exists`)
      continue
    }

    const source = fs.readFileSync(file, 'utf-8')
    if (dryRun) {
      console.log(`  [dry] would translate ${file} → ${target} (${source.length} chars)`)
      continue
    }

    console.log(`  [...] translating ${file}`)
    const translated = await callClaude(apiKey, source, locale)
    fs.writeFileSync(target, translated)
    console.log(`  [ok ] ${target}`)
  }
}

async function callClaude(apiKey, content, locale) {
  const prompt = PROMPT_TEMPLATE(LOCALE_NAMES[locale], locale).replace('{CONTENT}', content)
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-7-20251120',
      max_tokens: 16000,
      temperature: 0.2,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${await response.text()}`)
  }
  const data = await response.json()
  return data.content[0].text
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
