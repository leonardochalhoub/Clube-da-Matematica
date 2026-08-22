/**
 * Pins de visitantes — um ponto no mapa por visitante DISTINTO, anônimo.
 *
 * Armazenamento: JSON estático congelado em `src/content/visitor-pins.json`
 * (snapshot exportado do Supabase em 2026-08-22 — ver CLAUDE.md). O mapa não
 * cresce mais; é um retrato dos visitantes até a data do congelamento.
 * Privacidade:
 *   - `visitor_id` é um UUID aleatório gerado no browser (localStorage) só pra
 *     deduplicar — não identifica a pessoa.
 *   - lat/lng vêm aproximados do ipapi.co e são ARREDONDADOS a ~1 km (2 casas)
 *     antes de salvar. Nunca guardamos IP nem coordenada exata.
 *   - Só gravamos cidade + país. Nada mais.
 *
 * Degradação graciosa: sem Supabase configurado, o registro de novos pins
 * vira no-op silencioso (mantido apenas até a remoção final do Supabase).
 */
import { getSupabase } from '@/lib/supabase/client'
import staticPins from '@/content/visitor-pins.json'

const VISITOR_ID_KEY = 'clube-visitor-id-v1'
const PIN_SENT_KEY = 'clube-pin-sent-v1'

export interface VisitorPin {
  lat: number
  lng: number
  city: string | null
  region: string | null
  region_code: string | null
  country: string | null
}

/** Dados de geolocalização aproximada (formato normalizado dos provedores). */
export interface GeoInput {
  latitude?: number
  longitude?: number
  city?: string
  region?: string
  region_code?: string
  country_name?: string
  country_code?: string
}

/** UUID estável por dispositivo (localStorage). Só serve pra deduplicar pins. */
function getOrCreateVisitorId(): string | null {
  try {
    let id = window.localStorage.getItem(VISITOR_ID_KEY)
    if (!id) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `v-${Date.now()}-${Math.random().toString(36).slice(2)}`
      window.localStorage.setItem(VISITOR_ID_KEY, id)
    }
    return id
  } catch {
    return null
  }
}

/** Arredonda a ~1.1 km pra não guardar localização exata. */
function coarse(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Grava o pin do visitante atual (idempotente por dispositivo).
 * Chamado uma única vez por visitante; o UNIQUE(visitor_id) + upsert
 * `ignoreDuplicates` garante que reabrir o site não cria pin duplicado.
 */
export async function recordVisitorPin(geo: GeoInput): Promise<void> {
  if (typeof window === 'undefined') return
  const supabase = getSupabase()
  if (!supabase) return
  if (geo.latitude == null || geo.longitude == null) return

  try {
    if (window.localStorage.getItem(PIN_SENT_KEY)) return
  } catch {
    /* localStorage bloqueado — segue tentando, o UNIQUE protege */
  }

  const visitorId = getOrCreateVisitorId()
  if (!visitorId) return

  const row = {
    visitor_id: visitorId,
    lat: coarse(geo.latitude),
    lng: coarse(geo.longitude),
    city: geo.city?.slice(0, 120) ?? null,
    region: geo.region?.slice(0, 120) ?? null,
    region_code: geo.region_code?.slice(0, 16) ?? null,
    country: geo.country_name?.slice(0, 120) ?? null,
    country_code: geo.country_code?.slice(0, 8) ?? null,
  }

  try {
    const { error } = await supabase
      .from('visitor_pins')
      .upsert(row, { onConflict: 'visitor_id', ignoreDuplicates: true })
    if (!error) {
      try {
        window.localStorage.setItem(PIN_SENT_KEY, '1')
      } catch {
        /* ok */
      }
    }
  } catch {
    /* analytics opcional — falha silenciosa */
  }
}

/** Lê todos os pins (lat/lng/cidade/país) pra desenhar no mapa. */
export async function fetchVisitorPins(): Promise<VisitorPin[]> {
  return staticPins as VisitorPin[]
}
