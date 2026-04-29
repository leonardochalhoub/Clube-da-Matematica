'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/components/layout/LocaleProvider'
import { LOCALES } from '@/lib/i18n/locales'

interface AudioReaderProps {
  /** Texto principal (PT-BR — versão original). */
  texto: string
  /** Versões traduzidas (chave = código do locale). Tem prioridade sobre tradução automática. */
  textosI18n?: Partial<Record<string, string>>
  /** Rótulo do botão. Default: t('audio.read'). */
  label?: string
}

const TRANSLATION_CACHE_KEY = 'clube_audio_translation_cache_v1'

function loadCache(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(TRANSLATION_CACHE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

function saveCache(cache: Record<string, string>) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(cache))
  } catch {
    // localStorage cheio ou bloqueado — ignora
  }
}

/**
 * MyMemory translation API:
 *   - free, no key, supports CORS browser-side
 *   - 5000 chars/dia/IP anônimo (suficiente porque cacheamos)
 *   - retorna PT-BR → qualquer idioma alvo
 *
 * Mapeamento speechLang → MyMemory langpair (BCP-47 simples).
 */
function speechLangToMyMemory(speechLang: string): string {
  // MyMemory aceita "es-ES", "de-DE", etc. Mas alguns valores precisam ajuste.
  const map: Record<string, string> = {
    'pt-BR': 'pt-BR',
    'en-US': 'en-US',
    'es-ES': 'es-ES',
    'zh-CN': 'zh-CN',
    'ja-JP': 'ja-JP',
    'de-DE': 'de-DE',
    'fr-FR': 'fr-FR',
    'it-IT': 'it-IT',
    'ru-RU': 'ru-RU',
    'ko-KR': 'ko-KR',
    'vi-VN': 'vi-VN',
    'pl-PL': 'pl-PL',
    'sw-KE': 'sw-KE',
    'ar-SA': 'ar-SA',
    'hi-IN': 'hi-IN',
    'et-EE': 'et-EE',
  }
  return map[speechLang] ?? speechLang
}

async function traduzirViaMyMemory(texto: string, alvoLang: string): Promise<string | null> {
  const langpair = `pt-BR|${speechLangToMyMemory(alvoLang)}`
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=${encodeURIComponent(langpair)}&de=clube@clube-da-matematica.dev`
  try {
    const res = await fetch(url, { method: 'GET' })
    if (!res.ok) return null
    const data = (await res.json()) as {
      responseData?: { translatedText?: string; match?: number }
      responseStatus?: number
    }
    const traduzido = data?.responseData?.translatedText
    if (typeof traduzido !== 'string' || traduzido.length === 0) return null
    // MyMemory às vezes devolve "MYMEMORY WARNING:" ou "INVALID..." em texto — filtra.
    if (/^(MYMEMORY|INVALID|PLEASE|QUERY LENGTH)/i.test(traduzido.trim())) return null
    return traduzido
  } catch {
    return null
  }
}

async function obterVoicesAsync(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const v = window.speechSynthesis.getVoices()
    if (v.length > 0) {
      resolve(v)
      return
    }
    const handler = () => {
      const vNew = window.speechSynthesis.getVoices()
      window.speechSynthesis.removeEventListener('voiceschanged', handler)
      resolve(vNew)
    }
    window.speechSynthesis.addEventListener('voiceschanged', handler)
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 600)
  })
}

/**
 * Botão de áudio multilíngue.
 *
 * Pipeline:
 *   1. Se há tradução manual (`textosI18n[locale]`) → usa ela.
 *   2. Se locale é PT-BR → usa o `texto` original.
 *   3. Caso contrário → traduz via MyMemory (cache em localStorage).
 *
 * Voz: sempre do locale ativo. Se navegador não tem voz nativa do idioma,
 * tenta voz com mesmo prefixo (ex.: "de" sem "-DE").
 */
export function AudioReader({ texto, textosI18n, label }: AudioReaderProps) {
  const { locale, t } = useLocale()
  const [estado, setEstado] = useState<'idle' | 'traduzindo' | 'falando' | 'indisponivel'>('idle')
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setEstado('indisponivel')
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speechLang = LOCALES[locale].speechLang
  const labelFinal = label ?? t('audio.read', 'Ouvir')

  async function obterTextoFinal(): Promise<string> {
    const traducaoManual = textosI18n?.[locale]
    if (traducaoManual) return traducaoManual
    if (locale === 'pt-BR') return texto

    const cache = loadCache()
    const cacheKey = `${speechLang}::${texto}`
    if (cache[cacheKey]) return cache[cacheKey]!

    setEstado('traduzindo')
    const traduzido = await traduzirViaMyMemory(texto, speechLang)
    if (traduzido) {
      cache[cacheKey] = traduzido
      saveCache(cache)
      return traduzido
    }
    return texto
  }

  async function falar() {
    if (estado === 'indisponivel') return
    if (estado === 'falando') {
      window.speechSynthesis.cancel()
      setEstado('idle')
      return
    }
    if (estado === 'traduzindo') return

    const textoFinal = await obterTextoFinal()
    const u = new SpeechSynthesisUtterance(textoFinal)
    u.lang = speechLang
    u.rate = 0.95
    u.pitch = 1
    u.volume = 1

    const vozes = await obterVoicesAsync()
    const exatas = vozes.filter((v) => v.lang === speechLang)
    const prefixo = vozes.filter((v) => {
      const head = speechLang.split('-')[0]
      return v.lang.toLowerCase().startsWith(`${head}-`) || v.lang.toLowerCase() === head
    })
    const candidatas = exatas.length > 0 ? exatas : prefixo
    if (candidatas.length > 0) {
      const random = candidatas[Math.floor(Math.random() * candidatas.length)]!
      u.voice = random
    }

    u.onstart = () => setEstado('falando')
    u.onend = () => setEstado('idle')
    u.onerror = () => setEstado('idle')

    utterRef.current = u
    window.speechSynthesis.speak(u)
  }

  if (estado === 'indisponivel') return null

  const falando = estado === 'falando'
  const traduzindo = estado === 'traduzindo'

  return (
    <button
      type="button"
      onClick={falar}
      disabled={traduzindo}
      aria-label={falando ? t('audio.stop', 'Parar') : `${labelFinal} (${LOCALES[locale].nome})`}
      aria-pressed={falando}
      title={falando ? t('audio.stop', 'Parar') : `${labelFinal} — ${LOCALES[locale].bandeira}`}
      className="inline-flex items-center gap-2 rounded-full border border-clube-mist-soft/60 bg-clube-surface px-3 py-1.5 text-xs font-medium text-clube-ink transition-all hover:border-clube-teal hover:text-clube-teal disabled:opacity-60"
    >
      {falando ? (
        <>
          <StopIcon />
          <span>{t('audio.stop', 'Parar')}</span>
        </>
      ) : traduzindo ? (
        <>
          <SpinnerIcon />
          <span>{t('audio.translating', 'Traduzindo…')}</span>
        </>
      ) : (
        <>
          <SpeakerIcon />
          <span>{labelFinal}</span>
          <span aria-hidden className="opacity-70">
            {LOCALES[locale].bandeira}
          </span>
        </>
      )}
    </button>
  )
}

function SpeakerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="12"
      height="12"
      aria-hidden="true"
    >
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="14"
      height="14"
      aria-hidden="true"
      className="animate-spin"
    >
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="m4.93 4.93 2.83 2.83" />
      <path d="m16.24 16.24 2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="m4.93 19.07 2.83-2.83" />
      <path d="m16.24 7.76 2.83-2.83" />
    </svg>
  )
}
