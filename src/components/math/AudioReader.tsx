'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/components/layout/LocaleProvider'
import { LOCALES } from '@/lib/i18n/locales'

interface AudioReaderProps {
  /** Texto principal (PT-BR — versão original). */
  texto: string
  /** Versões traduzidas. Chave = código do locale. Se ausente, usa `texto`. */
  textosI18n?: Partial<Record<string, string>>
  /** Rótulo do botão. Default: "Ler". */
  label?: string
}

/**
 * Botão de áudio que respeita o idioma globalmente selecionado.
 *
 * - Se há tradução no `textosI18n` para o locale ativo, usa ela.
 * - Senão, usa o `texto` original (PT-BR).
 * - A `lang` da utterance é sempre o speechLang do locale ativo —
 *   o navegador escolhe a melhor voz disponível pra esse idioma.
 * - Voz aleatória dentro das disponíveis pro idioma (mais natural).
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

  // CRÍTICO: só usa idioma do locale ativo se HÁ tradução pra ele.
  // Se não há tradução pro locale, fala em PT-BR (texto original) com voz PT-BR.
  // Evita o bug "Português com sotaque alemão" — não tem como o navegador
  // ler PT-BR de um locale alemão de forma natural; melhor cair pra PT-BR puro.
  const temTraducao = !!textosI18n?.[locale]
  const textoFinal = temTraducao ? textosI18n![locale]! : texto
  const speechLang = temTraducao ? LOCALES[locale].speechLang : 'pt-BR'
  const labelFinal = label ?? t('audio.read', 'Ouvir')

  function falar() {
    if (estado === 'indisponivel') return
    if (estado === 'falando') {
      window.speechSynthesis.cancel()
      setEstado('idle')
      return
    }

    const u = new SpeechSynthesisUtterance(textoFinal)
    u.lang = speechLang
    u.rate = 0.95
    u.pitch = 1
    u.volume = 1

    // Escolhe voz aleatória ESTRITAMENTE do idioma certo. Se não há
    // voz nativa, deixa o navegador escolher (vai falhar com som ruim,
    // mas pelo menos não usa voz do idioma errado).
    const vozes = window.speechSynthesis.getVoices()
    const vozesDoIdiomaExato = vozes.filter((v) => v.lang === speechLang)
    const vozesDoPrefixo = vozes.filter(
      (v) => v.lang.startsWith(speechLang.split('-')[0] + '-') || v.lang === speechLang.split('-')[0],
    )
    const candidatas = vozesDoIdiomaExato.length > 0 ? vozesDoIdiomaExato : vozesDoPrefixo
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

  return (
    <button
      type="button"
      onClick={falar}
      aria-label={falando ? t('audio.stop', 'Parar') : `${labelFinal} (${LOCALES[locale].nome})`}
      aria-pressed={falando}
      title={falando ? t('audio.stop', 'Parar') : `${labelFinal} — ${LOCALES[locale].bandeira}`}
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
