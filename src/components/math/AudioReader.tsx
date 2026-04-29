'use client'

import { useEffect, useRef, useState } from 'react'

interface AudioReaderProps {
  /** Prosa em PT-BR que o navegador deve ler. Idealmente uma versão
   *  audível da equação (ex.: "C igual a S vezes N de d um..."). */
  texto: string
  /** Rótulo do botão. Default: "Ler equação". */
  label?: string
}

/**
 * Botão "🔊 Ler equação" — usa a Web Speech API nativa do navegador
 * (speechSynthesis). Zero dependências externas, zero API key, zero custo.
 * Funciona offline, em qualquer host estático (GitHub Pages compatível).
 *
 * Para PT-BR, o navegador escolhe a voz portuguesa-brasil mais natural
 * disponível no SO (Google PT-BR no Android/Chrome, Luciana no macOS, etc.).
 */
export function AudioReader({ texto, label = 'Ler equação' }: AudioReaderProps) {
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

  function falar() {
    if (estado === 'indisponivel') return
    if (estado === 'falando') {
      window.speechSynthesis.cancel()
      setEstado('idle')
      return
    }

    const u = new SpeechSynthesisUtterance(texto)
    u.lang = 'pt-BR'
    u.rate = 0.95 // levemente devagar pra clareza em fórmulas
    u.pitch = 1
    u.volume = 1

    // Tenta escolher uma voz PT-BR explícita
    const vozes = window.speechSynthesis.getVoices()
    const vozPtBr = vozes.find((v) => v.lang === 'pt-BR') ?? vozes.find((v) => v.lang.startsWith('pt'))
    if (vozPtBr) u.voice = vozPtBr

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
      aria-label={falando ? 'Parar leitura' : `${label} em voz alta`}
      aria-pressed={falando}
      title={falando ? 'Parar' : label}
      className="inline-flex items-center gap-2 rounded-full border border-clube-mist-soft/60 bg-clube-surface px-3 py-1.5 text-xs font-medium text-clube-ink transition-all hover:border-clube-teal hover:text-clube-teal"
    >
      {falando ? (
        <>
          <StopIcon />
          <span>Parar</span>
        </>
      ) : (
        <>
          <SpeakerIcon />
          <span>{label}</span>
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
