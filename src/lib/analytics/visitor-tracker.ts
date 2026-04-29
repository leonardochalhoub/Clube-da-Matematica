/**
 * Tracker de visitantes — totalmente anônimo, client-side.
 *
 * Pipeline:
 *   1. Verifica sessionStorage 'clube-tracked' — se já trackou, pula.
 *   2. Busca geolocation aproximada via ipapi.co (free, 30k req/mês,
 *      sem chave). Retorna { country_code, city, region }.
 *   3. Incrementa contadores no CounterAPI:
 *        - clube-pais-{ISO2}    (ex.: clube-pais-BR)
 *        - clube-cidade-{slug}  (ex.: clube-cidade-sao-paulo-br)
 *   4. Marca sessionStorage para evitar duplicação na mesma sessão.
 *
 * Privacidade: nenhum dado pessoal armazenado. Apenas contadores
 * agregados por localização. IP nunca é persistido — só usado pra
 * resolver geolocalização aproximada.
 */

const TRACKED_KEY = 'clube-tracked-v1'
const COUNTER_BASE = 'https://api.counterapi.dev/v1/clube-da-matematica'

/** Slugify cidade pra chave estável: "São Paulo" → "sao-paulo" */
function slugifyCidade(cidade: string): string {
  return cidade
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

interface IpInfo {
  country_code?: string
  country_name?: string
  city?: string
  region?: string
}

async function getGeolocation(): Promise<IpInfo | null> {
  try {
    const res = await fetch('https://ipapi.co/json/', {
      // O ipapi.co é CORS-enabled e não precisa de key pra free tier
      method: 'GET',
    })
    if (!res.ok) return null
    return (await res.json()) as IpInfo
  } catch {
    return null
  }
}

async function bumpCounter(key: string): Promise<void> {
  try {
    await fetch(`${COUNTER_BASE}/${key}/up`, { method: 'GET' })
  } catch {
    /* silent — analytics opcional */
  }
}

/**
 * Track uma visita. Idempotente por sessão.
 */
export async function trackVisitor(): Promise<void> {
  if (typeof window === 'undefined') return
  try {
    if (window.sessionStorage.getItem(TRACKED_KEY)) return
    window.sessionStorage.setItem(TRACKED_KEY, Date.now().toString())
  } catch {
    return
  }

  const geo = await getGeolocation()
  if (!geo) return

  const promises: Promise<void>[] = []
  if (geo.country_code) {
    promises.push(bumpCounter(`pais-${geo.country_code.toLowerCase()}`))
  }
  if (geo.city && geo.country_code) {
    const slug = slugifyCidade(geo.city) + '-' + geo.country_code.toLowerCase()
    promises.push(bumpCounter(`cidade-${slug}`))
  }
  await Promise.all(promises)
}

/**
 * Lê o valor atual de um contador (sem incrementar).
 * Retorna `null` se a chave não existe ou em erro.
 */
export async function readCounter(key: string): Promise<number | null> {
  try {
    const res = await fetch(`${COUNTER_BASE}/${key}`, { method: 'GET' })
    if (!res.ok) return null
    const data = (await res.json()) as { count?: number; value?: number }
    return data.count ?? data.value ?? null
  } catch {
    return null
  }
}
