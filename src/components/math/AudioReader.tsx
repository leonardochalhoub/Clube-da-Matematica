'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/components/layout/LocaleProvider'
import { LOCALES } from '@/lib/i18n/locales'
import { AUDIO_TRANSLATIONS } from '@/content/audio-translations.generated'
import { Flag } from '@/components/layout/Flag'

interface AudioReaderProps {
  /** Texto principal (PT-BR — versão original). */
  texto: string
  /** Versões traduzidas inline (chave = código do locale). Tem prioridade sobre AUDIO_TRANSLATIONS. */
  textosI18n?: Partial<Record<string, string>>
  /** Rótulo do botão. Default: t('audio.read'). */
  label?: string
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
 * Pipeline (todo offline, zero requisições de rede):
 *   1. Se há tradução manual (`textosI18n[locale]`) → usa ela.
 *   2. Se há entrada em AUDIO_TRANSLATIONS[texto][speechLang] (gerado em
 *      build-time pelo Claude Opus 4.7) → usa ela.
 *   3. Senão → fala o texto PT-BR original com voz PT-BR (mesmo idioma do
 *      texto, evitando "PT-BR com sotaque alemão").
 *
 * Quando cair em (3), o botão sinaliza com bandeira 🇧🇷 + tooltip
 * "tradução pendente".
 */
export function AudioReader({ texto, textosI18n, label }: AudioReaderProps) {
  const { locale, t } = useLocale()
  const [estado, setEstado] = useState<'idle' | 'falando' | 'indisponivel'>('idle')
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

  // Determina texto e idioma de forma síncrona — sem promise, sem rede.
  const traducaoManual = textosI18n?.[locale]
  const traducaoPreBuild = AUDIO_TRANSLATIONS[texto]?.[speechLang]
  const traducao = traducaoManual ?? traducaoPreBuild
  const temTraducao = !!traducao || locale === 'pt-BR'
  const textoFalado = traducao ?? texto
  const langFalado = temTraducao ? speechLang : 'pt-BR'
  const bandeiraFalada = temTraducao
    ? LOCALES[locale].bandeira
    : LOCALES['pt-BR'].bandeira

  async function falar() {
    if (estado === 'indisponivel') return
    if (estado === 'falando') {
      window.speechSynthesis.cancel()
      setEstado('idle')
      return
    }

    const u = new SpeechSynthesisUtterance(textoFalado)
    u.lang = langFalado
    u.rate = 0.95
    u.pitch = 1
    u.volume = 1

    const vozes = await obterVoicesAsync()
    const exatas = vozes.filter((v) => v.lang === langFalado)
    const prefixo = vozes.filter((v) => {
      const head = langFalado.split('-')[0]
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
  const titulo = falando
    ? t('audio.stop', 'Parar')
    : temTraducao
      ? `${labelFinal} — ${LOCALES[locale].bandeira}`
      : `${labelFinal} (${t('audio.pendingTranslation', 'tradução pendente — falando em PT-BR')})`

  return (
    <button
      type="button"
      onClick={falar}
      aria-label={falando ? t('audio.stop', 'Parar') : `${labelFinal} (${LOCALES[locale].nome})`}
      aria-pressed={falando}
      title={titulo}
      className="inline-flex items-center gap-2 rounded-full border border-clube-mist-soft/60 bg-clube-surface px-3 py-1.5 text-xs font-medium text-clube-ink transition-all hover:border-clube-teal hover:text-clube-teal"
    >
      {falando ? (
        <>
          <StopIcon />
          <span>{t('audio.stop', 'Parar')}</span>
        </>
      ) : (
        <>
          <SpeakerIcon />
          <span>{labelFinal}</span>
          <Flag emoji={bandeiraFalada} size={14} className="opacity-90" />
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
