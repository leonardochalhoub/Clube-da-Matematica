/**
 * Tradução das strings de UI (translations.ts).
 *
 * As traduções já estão diretamente no arquivo TS (escritas com cuidado
 * pelo Claude no momento da criação). Use este script apenas para
 * EXPANDIR a quantidade de strings e re-traduzir as ausentes.
 *
 * Uso: ANTHROPIC_API_KEY=... npx tsx scripts/translate-ui.ts
 *
 * Diferença vs translate-content.ts:
 *  - UI = strings curtas, batch única
 *  - Content = MDX longos, batch por arquivo
 */

/* eslint-disable */
// @ts-nocheck

const LOCALES = ['en', 'es', 'zh', 'ja', 'de', 'fr', 'it', 'ru', 'ko', 'vi', 'pl', 'sw', 'ar', 'hi', 'et']

const PROMPT = `You are translating UI strings for an open-source mathematics education platform (Clube da Matemática) from Brazilian Portuguese (pt-BR) into multiple languages.

Source key: {KEY}
Source PT-BR text: "{PT}"

Translate this UI string into each of these languages, returning JSON:
{
  "en": "...",
  "es": "...",
  "zh": "...",
  ...
}

Rules:
- Keep it short and direct (UI strings are usually 1-3 words)
- Use standard mathematical/educational terminology in each language
- Don't add explanations
- For nav items, use the most natural rendering (e.g., "Provas" → "Exams" in en, "Exámenes" in es)
- Output ONLY the JSON object, no commentary`

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('Set ANTHROPIC_API_KEY')
    process.exit(1)
  }

  const fs = await import('fs')
  const tsContent = fs.readFileSync('src/lib/i18n/translations.ts', 'utf-8')

  // Parse keys que não têm tradução completa
  const keyRegex = /'([^']+)':\s*\{([^}]+)\}/g
  const matches = [...tsContent.matchAll(keyRegex)]
  console.log(`Found ${matches.length} translation keys`)

  for (const match of matches) {
    const key = match[1]
    const body = match[2]
    const ptMatch = body.match(/'pt-BR':\s*'([^']+)'/)
    if (!ptMatch) continue
    const pt = ptMatch[1]

    // Detecta locales faltando
    const presentLocales = [...body.matchAll(/(\w+(?:-\w+)?):\s*'/g)].map((m) => m[1].replace(/['-]/g, '').toLowerCase())
    const missing = LOCALES.filter((l) => !presentLocales.some((p) => p === l || p === l.replace('-', '')))

    if (missing.length === 0) {
      console.log(`  [skip] ${key} — already complete`)
      continue
    }

    console.log(`  [...] ${key}: '${pt}' → ${missing.length} idiomas`)
    const translations = await callClaude(apiKey, key, pt)
    console.log(JSON.stringify(translations, null, 2))
    // Em produção: editar o arquivo TS preservando estrutura. Implementação manual.
  }
}

async function callClaude(apiKey, key, pt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-opus-4-7-20251120',
      max_tokens: 1000,
      temperature: 0.1,
      messages: [{ role: 'user', content: PROMPT.replace('{KEY}', key).replace('{PT}', pt) }],
    }),
  })
  const data = await response.json()
  const text = data.content[0].text.trim()
  return JSON.parse(text)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
