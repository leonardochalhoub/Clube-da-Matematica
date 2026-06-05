/**
 * Tracker de visitantes — totalmente anônimo, client-side.
 *
 * Dois trabalhos independentes, cada um com seu próprio guard:
 *   1. Contador de visitas por sessão (sessionStorage `clube-tracked-v1`) →
 *      incrementa CounterAPI (pais-/cidade-) uma vez por sessão.
 *   2. Pin no mapa de visitantes (localStorage `clube-pin-sent-v1`) →
 *      grava UMA vez por dispositivo, pra sempre. NÃO é gated pela sessão,
 *      então quem já visitou antes (flag de sessão setada) ainda ganha o pin.
 *
 * Geolocalização: tenta vários provedores free/CORS/no-key em cascata, então
 * um rate-limit do ipapi.co não mata o registro. Os guards só são gravados
 * APÓS sucesso — falha transitória é re-tentada no próximo load.
 *
 * Privacidade: nenhum dado pessoal. IP nunca persistido — só usado pra
 * resolver geolocalização aproximada. Coordenadas arredondadas no pin.
 */
import { recordVisitorPin, type GeoInput } from './visitor-pins'

const TRACKED_KEY = 'clube-tracked-v1'
const PIN_SENT_KEY = 'clube-pin-sent-v1'
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

type Geo = GeoInput

/**
 * Provedores de geolocalização por IP — todos free, CORS-enabled, sem chave.
 * Normalizados pro mesmo shape. Tentados em ordem; o primeiro que resolver
 * lat/lng válidos vence.
 */
const GEO_PROVIDERS: Array<() => Promise<Geo | null>> = [
  async () => {
    const r = await fetch('https://ipapi.co/json/')
    if (!r.ok) return null
    const d = await r.json()
    if (d?.error) return null
    return {
      latitude: d.latitude,
      longitude: d.longitude,
      city: d.city,
      country_name: d.country_name,
      country_code: d.country_code,
    }
  },
  async () => {
    const r = await fetch('https://ipwho.is/')
    if (!r.ok) return null
    const d = await r.json()
    if (!d?.success) return null
    return {
      latitude: d.latitude,
      longitude: d.longitude,
      city: d.city,
      country_name: d.country,
      country_code: d.country_code,
    }
  },
  async () => {
    const r = await fetch('https://get.geojs.io/v1/ip/geo.json')
    if (!r.ok) return null
    const d = await r.json()
    return {
      latitude: parseFloat(d.latitude),
      longitude: parseFloat(d.longitude),
      city: d.city,
      country_name: d.country,
      country_code: d.country_code,
    }
  },
]

async function getGeolocation(): Promise<Geo | null> {
  for (const provider of GEO_PROVIDERS) {
    try {
      const g = await provider()
      if (
        g &&
        typeof g.latitude === 'number' &&
        typeof g.longitude === 'number' &&
        !Number.isNaN(g.latitude) &&
        !Number.isNaN(g.longitude)
      ) {
        return g
      }
    } catch {
      /* tenta o próximo provedor */
    }
  }
  return null
}

async function bumpCounter(key: string): Promise<void> {
  try {
    await fetch(`${COUNTER_BASE}/${key}/up`, { method: 'GET' })
  } catch {
    /* silent — analytics opcional */
  }
}

/**
 * Track uma visita. Counter idempotente por sessão; pin idempotente por
 * dispositivo. Busca geo só se algum dos dois ainda precisa rodar.
 */
export async function trackVisitor(): Promise<void> {
  if (typeof window === 'undefined') return

  let needCounter = true
  let needPin = true
  try {
    needCounter = !window.sessionStorage.getItem(TRACKED_KEY)
  } catch {
    needCounter = false
  }
  try {
    needPin = !window.localStorage.getItem(PIN_SENT_KEY)
  } catch {
    needPin = true
  }
  if (!needCounter && !needPin) return

  const geo = await getGeolocation()
  if (!geo) return // guards intactos → re-tenta no próximo load

  const tasks: Promise<unknown>[] = []

  if (needCounter) {
    // Só marca a sessão DEPOIS que a geo resolveu (evita queimar a sessão num
    // erro transitório do provedor).
    try {
      window.sessionStorage.setItem(TRACKED_KEY, Date.now().toString())
    } catch {
      /* ok */
    }
    if (geo.country_code) {
      tasks.push(bumpCounter(`pais-${geo.country_code.toLowerCase()}`))
    }
    if (geo.city && geo.country_code) {
      const slug = slugifyCidade(geo.city) + '-' + geo.country_code.toLowerCase()
      tasks.push(bumpCounter(`cidade-${slug}`))
    }
  }

  if (needPin) {
    // recordVisitorPin tem seu próprio guard (PIN_SENT_KEY) e só o grava em
    // sucesso, então falha de rede é re-tentada depois.
    tasks.push(recordVisitorPin(geo))
  }

  await Promise.all(tasks)
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
