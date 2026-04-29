import katex from 'katex'
import { AudioReader } from './AudioReader'

interface EquationProps {
  /** LaTeX da equação (sem delimitadores `$$`). */
  children: string
  /** Explicação obrigatória abaixo — "o que essa equação significa". */
  explicacao?: React.ReactNode
  /** Numeração opcional: "Eq. (1)", "Eq. (2)", etc. */
  numero?: string
  /** Render inline em vez de bloco (default: bloco). */
  inline?: boolean
  /** Rótulo curto pra leitor de tela (sobrescreve o LaTeX bruto). */
  ariaLabel?: string
  /** Prosa em PT-BR para o botão "Ler equação" (Web Speech API).
   *  Quando presente, o bloco mostra um botão que narra a fórmula em
   *  voz alta — essencial para usuários cegos / baixa visão. */
  audioTexto?: string
}

const macros: Record<string, string> = {
  '\\R': '\\mathbb{R}',
  '\\C': '\\mathbb{C}',
  '\\N': '\\mathbb{N}',
  '\\Z': '\\mathbb{Z}',
  '\\Q': '\\mathbb{Q}',
  '\\E': '\\mathbb{E}',
  '\\Prob': '\\mathbb{P}',
  '\\Var': '\\operatorname{Var}',
  '\\Cov': '\\operatorname{Cov}',
  '\\d': '\\mathrm{d}',
  '\\e': '\\mathrm{e}',
  '\\eps': '\\varepsilon',
  '\\diff': '\\frac{\\d#1}{\\d#2}',
  '\\pdiff': '\\frac{\\partial#1}{\\partial#2}',
}

/**
 * Bloco de equação canônico do Clube da Matemática.
 *
 * Renderiza KaTeX server-side com output `htmlAndMathml` (acessibilidade),
 * envolto em `<figure role="math">` e com **explicação obrigatória abaixo**
 * — que é a regra editorial central: toda equação é apresentada com sua
 * tradução em prosa para leitor humano.
 *
 * Quando `audioTexto` é passado, exibe botão "Ler equação" (Web Speech API)
 * — acessível para usuários com deficiência visual.
 */
export function Equation({
  children,
  explicacao,
  numero,
  inline = false,
  ariaLabel,
  audioTexto,
}: EquationProps) {
  const html = katex.renderToString(children, {
    output: 'htmlAndMathml',
    displayMode: !inline,
    throwOnError: false,
    strict: false,
    macros,
  })

  if (inline) {
    return (
      <span
        className="katex-inline"
        aria-label={ariaLabel ?? children}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return (
    <figure
      role="math"
      aria-label={ariaLabel ?? children}
      className="my-7 rounded-xl border-l-4 border-clube-gold bg-clube-cream-soft px-6 py-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="flex-1 overflow-x-auto py-1"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="flex shrink-0 items-center gap-3 self-center">
          {audioTexto && <AudioReader texto={audioTexto} label="Ler" />}
          {numero && (
            <div className="font-mono text-sm text-clube-mist">({numero})</div>
          )}
        </div>
      </div>
      {explicacao && (
        <figcaption className="mt-3 border-t border-clube-mist-soft/40 pt-3 text-sm leading-relaxed text-clube-mist">
          <span className="font-semibold uppercase tracking-wider text-clube-gold-deep">
            o que isso quer dizer ·{' '}
          </span>
          {explicacao}
        </figcaption>
      )}
    </figure>
  )
}

/** Atalho para LaTeX inline. */
export function Eq({ children }: { children: string }) {
  return <Equation inline>{children}</Equation>
}
