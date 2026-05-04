'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/components/layout/LocaleProvider'
import { LOCALES } from '@/lib/i18n/locales'

interface PageAudioReaderProps {
  /** CSS selector of the element to read. Default: 'main'. */
  selector?: string
  /** Compact mode for placement in headers/floating UIs. */
  compact?: boolean
}

type Estado = 'idle' | 'falando' | 'pausado' | 'indisponivel'

/**
 * Lê **toda** a lição em voz alta para acessibilidade de pessoas cegas.
 *
 * Estratégia:
 *   1. Walks the article DOM. Para cada elemento de texto / parágrafo /
 *      heading / list-item, extrai texto visível.
 *   2. Para equações KaTeX, prefere o `aria-label` (que é o LaTeX puro) ou
 *      o `audioTexto` em `<EquacaoCanonica>`. Sem isso, fala o LaTeX bruto
 *      (que vai soar feio mas dá acesso ao conteúdo matemático).
 *   3. Quebra em chunks de ~200 caracteres (limite Web Speech API).
 *   4. Fala cada chunk sequencialmente. Pause/Resume/Stop disponíveis.
 *   5. Voz: do locale ativo. Se navegador não tem voz pt-BR / en-US /
 *      etc., fallback silencioso.
 *
 * Princípio editorial #7: acessibilidade total. Cego deve poder consumir
 * a lição inteira sem ler.
 */
export function PageAudioReader({
  selector = 'main',
  compact = false,
}: PageAudioReaderProps = {}) {
  const { locale, t } = useLocale()
  const [estado, setEstado] = useState<Estado>('idle')
  const [progresso, setProgresso] = useState({ atual: 0, total: 0 })
  const chunksRef = useRef<string[]>([])
  const indiceRef = useRef(0)
  const cancelledRef = useRef(false)
  const vozRef = useRef<SpeechSynthesisVoice | null>(null)

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

  /**
   * Língua a falar — reflete o **conteúdo** da página, não o locale da UI.
   *
   * Hoje todas as páginas têm conteúdo PT-BR (mesmo quando usuário trocou
   * UI pra inglês), porque ainda não temos traduções de MDX. Forçar voz
   * inglesa sobre texto PT-BR resulta em "português com sotaque inglês"
   * — ininteligível.
   *
   * Estratégia: usar `document.documentElement.lang` se disponível (a rota
   * pode marcar a página como `lang="en-US"` quando servir conteúdo
   * traduzido). Senão, fallback pra `pt-BR` (o source).
   *
   * Quando traduções de MDX estiverem prontas, o roteamento já seta o lang
   * correto e essa heurística pega a voz certa automaticamente.
   */
  const [speechLang, setSpeechLang] = useState<string>('pt-BR')
  useEffect(() => {
    if (typeof document === 'undefined') return
    const docLang = document.documentElement.getAttribute('data-content-lang')
      || document.documentElement.lang
    setSpeechLang(docLang || 'pt-BR')
    void LOCALES[locale]
  }, [locale])

  /**
   * Extrai texto legível do article. Pula:
   *  - elementos invisíveis (display:none)
   *  - katex-html (visual duplicado — usa katex-mathml/aria-label)
   *  - botões interativos (não são "conteúdo")
   *  - <details> não-abertos (esconde solução até o aluno pedir)
   *  - <pre>, <code> blocos longos (ASCII art não soa bem)
   */
  /**
   * Converte LaTeX cru para algo pronunciável em PT-BR. Não pretende ser
   * perfeito — só evita ler `\sqrt{2}` literalmente como "barra-invertida sqrt
   * chave 2". Quando há `data-audio-texto` autorado, usamos ele em vez
   * dessa heurística.
   */
  function latexToProse(latex: string): string {
    let s = latex
    // Chaves de conjunto: `\{ ... \}` ou `\lbrace ... \rbrace`. Tornamos "o
    // conjunto" e fechamos com vírgula natural.
    s = s.replace(/\\\{|\\lbrace\b/g, ' o conjunto ')
    s = s.replace(/\\\}|\\rbrace\b/g, ' ')
    // Comandos com argumentos
    s = s.replace(/\\sqrt\{([^}]+)\}/g, ' raiz quadrada de $1 ')
    s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, ' $1 sobre $2 ')
    s = s.replace(/\\(text|mathrm|mathbf|mathit|mathbb|mathcal|operatorname)\{([^}]+)\}/g, ' $2 ')
    s = s.replace(/\^\{([^}]+)\}/g, ' elevado a $1 ')
    s = s.replace(/_\{([^}]+)\}/g, ' índice $1 ')
    s = s.replace(/\^(\w)/g, ' elevado a $1 ')
    s = s.replace(/_(\w)/g, ' índice $1 ')
    // Conjuntos / símbolos
    const dict: Array<[RegExp, string]> = [
      [/\\mathbb\{N\}|\\N\b/g, ' naturais '],
      [/\\mathbb\{Z\}|\\Z\b/g, ' inteiros '],
      [/\\mathbb\{Q\}|\\Q\b/g, ' racionais '],
      [/\\mathbb\{R\}|\\R\b/g, ' reais '],
      [/\\mathbb\{C\}|\\C\b/g, ' complexos '],
      [/\\cup/g, ' união '],
      [/\\cap/g, ' interseção '],
      [/\\setminus/g, ' menos '],
      [/\\subseteq|\\subset\b/g, ' contido em '],
      [/\\supseteq|\\supset\b/g, ' contém '],
      [/\\in\b/g, ' pertence a '],
      [/\\notin/g, ' não pertence a '],
      [/\\emptyset|\\varnothing/g, ' conjunto vazio '],
      [/\\forall/g, ' para todo '],
      [/\\exists/g, ' existe '],
      [/\\implies|\\Rightarrow|\\Longrightarrow/g, ' implica '],
      [/\\iff|\\Leftrightarrow/g, ' se e somente se '],
      [/\\leq|\\le\b/g, ' menor ou igual a '],
      [/\\geq|\\ge\b/g, ' maior ou igual a '],
      [/\\neq|\\ne\b/g, ' diferente de '],
      [/\\approx/g, ' aproximadamente '],
      [/\\infty/g, ' infinito '],
      [/\\to\b|\\rightarrow|\\longrightarrow/g, ' tende a '],
      [/\\cdot|\\times/g, ' vezes '],
      [/\\div/g, ' dividido por '],
      [/\\pm/g, ' mais ou menos '],
      [/\\mid\b/g, ' tal que '],
      [/\\alpha\b/g, ' alfa '],
      [/\\beta\b/g, ' beta '],
      [/\\gamma\b/g, ' gama '],
      [/\\delta\b/g, ' delta '],
      [/\\epsilon\b|\\varepsilon\b/g, ' épsilon '],
      [/\\theta\b/g, ' teta '],
      [/\\lambda\b/g, ' lambda '],
      [/\\mu\b/g, ' mu '],
      [/\\pi\b/g, ' pi '],
      [/\\sigma\b/g, ' sigma '],
      [/\\phi\b|\\varphi\b/g, ' fi '],
      [/\\omega\b/g, ' ômega '],
      [/\\eta\b/g, ' eta '],
      [/\\ldots|\\dots|\\cdots/g, ' e assim por diante '],
      [/\\(left|right|big|Big|bigg|Bigg)/g, ''],
      [/\\,|\\;|\\:|\\!|\\quad|\\qquad/g, ' '],
    ]
    for (const [r, sub] of dict) s = s.replace(r, sub)
    // Operadores
    s = s.replace(/\s*<=\s*/g, ' menor ou igual a ')
    s = s.replace(/\s*>=\s*/g, ' maior ou igual a ')
    s = s.replace(/\s*!=\s*/g, ' diferente de ')
    s = s.replace(/\s*<\s*/g, ' menor que ')
    s = s.replace(/\s*>\s*/g, ' maior que ')
    // Limpa restos: comandos `\foo`, qualquer barra invertida solta (que o
    // sintetizador pronunciaria como "contra barra"), e chaves órfãs.
    s = s.replace(/\\[a-zA-Z]+\*?/g, ' ')
    s = s.replace(/\\./g, ' ')
    s = s.replace(/\\/g, ' ')
    s = s.replace(/[{}]/g, ' ')
    s = s.replace(/\s+/g, ' ').trim()
    return s
  }

  function extractText(root: HTMLElement): string {
    const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'BUTTON', 'INPUT', 'PRE'])
    const SKIP_CLASSES = ['katex-html']

    const out: string[] = []

    function walk(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const t = node.textContent?.trim() ?? ''
        if (t) out.push(t)
        return
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return
      const el = node as HTMLElement

      // Skip hidden
      if (el.hidden || el.getAttribute('aria-hidden') === 'true') return
      if (SKIP_TAGS.has(el.tagName)) return
      const cls = el.className || ''
      if (typeof cls === 'string' && SKIP_CLASSES.some((c) => cls.includes(c))) return

      // Prosa autorada (atributo `data-audio-texto` em <EquacaoCanonica> /
      // <Equation>) — usa essa em vez do conteúdo bruto.
      const audioTexto = el.getAttribute('data-audio-texto')
      if (audioTexto) {
        out.push(audioTexto)
        return
      }

      // Closed <details> — don't reveal hidden solutions
      if (el.tagName === 'DETAILS' && !(el as HTMLDetailsElement).open) {
        const summary = el.querySelector('summary')
        if (summary) walk(summary)
        return
      }

      // KaTeX math: converte LaTeX para prosa pronunciável.
      if (typeof cls === 'string' && cls.includes('katex')) {
        const annotation = el.querySelector('annotation')
        if (annotation?.textContent) {
          out.push(latexToProse(annotation.textContent))
          return
        }
        const aria = el.getAttribute('aria-label')
        if (aria) {
          out.push(latexToProse(aria))
          return
        }
      }

      // Recurse
      for (const child of Array.from(el.childNodes)) {
        walk(child)
      }

      // Add a sentence break after block-level elements
      const blockTags = new Set([
        'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'DIV', 'SECTION',
        'ARTICLE', 'BLOCKQUOTE', 'TR', 'FIGCAPTION',
      ])
      if (blockTags.has(el.tagName) && out.length > 0) {
        const last = out[out.length - 1]!
        if (!/[.!?…]$/.test(last)) out[out.length - 1] = last + '.'
      }
    }

    walk(root)
    return out.join(' ').replace(/\s+/g, ' ').trim()
  }

  /** Quebra texto em chunks de ~200 chars respeitando fronteiras de frase. */
  function makeChunks(text: string, maxLen = 220): string[] {
    const sentences = text.match(/[^.!?…]+[.!?…]+|\S[^.!?…]*$/g) ?? [text]
    const chunks: string[] = []
    let buf = ''
    for (const s of sentences) {
      if (buf.length + s.length + 1 <= maxLen) {
        buf = buf ? `${buf} ${s.trim()}` : s.trim()
      } else {
        if (buf) chunks.push(buf)
        if (s.length > maxLen) {
          // Split mid-sentence at word boundary
          let rest = s.trim()
          while (rest.length > maxLen) {
            const cut = rest.lastIndexOf(' ', maxLen)
            chunks.push(rest.slice(0, cut > 0 ? cut : maxLen))
            rest = rest.slice(cut > 0 ? cut + 1 : maxLen)
          }
          buf = rest
        } else {
          buf = s.trim()
        }
      }
    }
    if (buf) chunks.push(buf)
    return chunks
  }

  async function obterVoz(): Promise<SpeechSynthesisVoice | null> {
    return new Promise((resolve) => {
      const get = () => {
        const vs = window.speechSynthesis.getVoices()
        const exact = vs.filter((v) => v.lang === speechLang)
        const prefix = vs.filter((v) =>
          v.lang.toLowerCase().startsWith(speechLang.split('-')[0]!.toLowerCase()),
        )
        const candidates = exact.length > 0 ? exact : prefix
        resolve(candidates[0] ?? null)
      }
      const vs = window.speechSynthesis.getVoices()
      if (vs.length > 0) get()
      else {
        const handler = () => {
          window.speechSynthesis.removeEventListener('voiceschanged', handler)
          get()
        }
        window.speechSynthesis.addEventListener('voiceschanged', handler)
        setTimeout(get, 600)
      }
    })
  }

  function speakChunk(idx: number, voice: SpeechSynthesisVoice | null) {
    if (cancelledRef.current) return
    if (idx >= chunksRef.current.length) {
      setEstado('idle')
      setProgresso({ atual: 0, total: 0 })
      return
    }
    indiceRef.current = idx
    setProgresso({ atual: idx + 1, total: chunksRef.current.length })

    const u = new SpeechSynthesisUtterance(chunksRef.current[idx]!)
    u.lang = speechLang
    u.rate = 1
    u.pitch = 1
    u.volume = 1
    if (voice) u.voice = voice
    u.onend = () => speakChunk(idx + 1, voice)
    u.onerror = () => setEstado('idle')
    window.speechSynthesis.speak(u)
  }

  async function iniciar() {
    if (estado === 'indisponivel') return
    const root =
      typeof document === 'undefined'
        ? null
        : (document.querySelector(selector) as HTMLElement | null)
    if (!root) return

    const texto = extractText(root)
    if (!texto) return
    chunksRef.current = makeChunks(texto)
    indiceRef.current = 0
    cancelledRef.current = false
    setEstado('falando')

    vozRef.current = await obterVoz()
    speakChunk(0, vozRef.current)
  }

  /** Pula para um chunk específico (usado pelo clique na barra). */
  function seekTo(novoIdx: number) {
    if (estado === 'indisponivel') return
    const total = chunksRef.current.length
    if (total === 0) return
    const idx = Math.max(0, Math.min(total - 1, novoIdx))
    cancelledRef.current = true
    window.speechSynthesis.cancel()
    // Pequeno timeout pra garantir que `cancel` propagou antes do novo speak
    setTimeout(() => {
      cancelledRef.current = false
      setEstado('falando')
      speakChunk(idx, vozRef.current)
    }, 50)
  }

  function pausar() {
    if (estado !== 'falando') return
    window.speechSynthesis.pause()
    setEstado('pausado')
  }

  function continuar() {
    if (estado !== 'pausado') return
    window.speechSynthesis.resume()
    setEstado('falando')
  }

  function parar() {
    cancelledRef.current = true
    window.speechSynthesis.cancel()
    setEstado('idle')
    setProgresso({ atual: 0, total: 0 })
  }

  if (estado === 'indisponivel') return null

  const label = t('audio.readPage', 'Ouvir página inteira')
  const labelStop = t('audio.stop', 'Parar')
  const labelPause = t('audio.pause', 'Pausar')
  const labelResume = t('audio.resume', 'Continuar')
  void LOCALES[locale]

  const containerClass = compact
    ? 'inline-flex items-center gap-1.5'
    : 'my-4 flex flex-wrap items-center gap-2 rounded-xl border border-clube-mist-soft/40 bg-clube-cream-soft px-4 py-3'

  // Tamanho dos botões: compact = pequeno (header-friendly), normal = maior.
  const sz = compact
    ? 'px-3 py-1 text-[11px]'
    : 'px-4 py-2 text-sm'

  return (
    <div
      className={containerClass}
      role="region"
      aria-label={label}
    >
      {estado === 'idle' && (
        <button
          type="button"
          onClick={iniciar}
          aria-label={label}
          title={label}
          className={`inline-flex items-center gap-1.5 rounded-full bg-clube-teal font-semibold text-white hover:bg-clube-teal-deep ${sz}`}
        >
          <SpeakerIcon />
          {!compact && <span>{label}</span>}
          {compact && <span className="hidden sm:inline">{label}</span>}
          <AccessibilityIcon />
        </button>
      )}

      {(estado === 'falando' || estado === 'pausado') && (
        <>
          {estado === 'falando' ? (
            <button
              type="button"
              onClick={pausar}
              className={`inline-flex items-center gap-1.5 rounded-full bg-clube-gold font-semibold text-clube-teal-deep hover:bg-clube-gold-deep hover:text-white ${sz}`}
              aria-label={labelPause}
              title={labelPause}
            >
              <PauseIcon />
              {!compact && <span>{labelPause}</span>}
            </button>
          ) : (
            <button
              type="button"
              onClick={continuar}
              className={`inline-flex items-center gap-1.5 rounded-full bg-clube-teal font-semibold text-white hover:bg-clube-teal-deep ${sz}`}
              aria-label={labelResume}
              title={labelResume}
            >
              <PlayIcon />
              {!compact && <span>{labelResume}</span>}
            </button>
          )}

          <button
            type="button"
            onClick={parar}
            className={`inline-flex items-center gap-1.5 rounded-full border border-clube-mist-soft bg-clube-surface font-medium text-clube-ink hover:border-clube-clay hover:text-clube-clay ${sz}`}
            aria-label={labelStop}
            title={labelStop}
          >
            <StopIcon />
            {!compact && <span>{labelStop}</span>}
          </button>

          <SeekBar
            atual={progresso.atual}
            total={progresso.total}
            onSeek={(idx) => seekTo(idx)}
            compact={compact}
          />
        </>
      )}
    </div>
  )
}

interface SeekBarProps {
  atual: number  // 1-indexed (chunk being spoken now)
  total: number
  onSeek: (chunkIdx: number) => void  // 0-indexed target chunk
  compact: boolean
}

/**
 * Barra de progresso clicável. Click em qualquer posição pula a fala
 * para o chunk correspondente. Hover mostra o número alvo.
 */
function SeekBar({ atual, total, onSeek, compact }: SeekBarProps) {
  if (total === 0) return null
  const pct = Math.max(0, Math.min(100, (atual / total) * 100))
  const widthClass = compact ? 'w-32 sm:w-48' : 'w-48 sm:w-64'

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = Math.max(0, Math.min(1, x / rect.width))
    const target = Math.floor(ratio * total)
    onSeek(target)
  }

  return (
    <div className="ml-1 flex items-center gap-2">
      <div
        role="slider"
        tabIndex={0}
        aria-label="Posição da leitura"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={atual}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') onSeek(Math.max(0, atual - 2))
          else if (e.key === 'ArrowRight') onSeek(Math.min(total - 1, atual))
          else if (e.key === 'Home') onSeek(0)
          else if (e.key === 'End') onSeek(total - 1)
        }}
        className={`relative h-2 cursor-pointer rounded-full bg-clube-mist-soft/40 hover:bg-clube-mist-soft/60 ${widthClass} group`}
        title={`${atual} de ${total} — clique para pular`}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-clube-teal transition-all"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-clube-teal-deep border-2 border-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${pct}%` }}
          aria-hidden
        />
      </div>
      <span
        className="text-[10px] text-clube-mist tabular-nums whitespace-nowrap"
        aria-live="polite"
      >
        {atual}/{total}
      </span>
    </div>
  )
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function AccessibilityIcon() {
  // Universal access symbol: person figure inside a circle. Signals
  // that this control is the accessibility entry point for the page.
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="7" r="1.4" fill="currentColor" />
      <path d="M7.5 10.5h9" />
      <path d="M12 10.5v4" />
      <path d="M9.5 18l2.5-3.5 2.5 3.5" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  )
}
