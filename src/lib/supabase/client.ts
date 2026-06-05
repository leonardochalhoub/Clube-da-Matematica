/**
 * Cliente Supabase para o browser (anon key, somente leitura + insert).
 *
 * O site é estático (`output: 'export'`) e roda 100% no GitHub Pages — não há
 * backend. O navegador fala direto com o Supabase usando a chave pública `anon`,
 * protegida por RLS (insert + select para `anon`, nunca update/delete).
 *
 * Degradação graciosa: se as variáveis NEXT_PUBLIC_SUPABASE_* não estiverem
 * configuradas (ex.: dev local sem .env, ou build sem secrets), `getSupabase()`
 * retorna `null` e todo o recurso de pins simplesmente não faz nada. O build
 * NUNCA quebra por falta de Supabase.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let cached: SupabaseClient | null | undefined

/** Retorna um cliente singleton, ou `null` se o Supabase não está configurado. */
export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached
  if (!URL || !ANON) {
    cached = null
    return null
  }
  cached = createClient(URL, ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}

/** `true` quando as duas env vars estão presentes. Útil pra esconder UI. */
export const isSupabaseConfigured = Boolean(URL && ANON)
