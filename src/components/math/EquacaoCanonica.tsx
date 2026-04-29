import katex from 'katex'
import { AudioReader } from './AudioReader'

interface EquacaoCanonicaProps {
  /** LaTeX (sem `$$`). */
  formula: string
  /** Curta descrição abaixo da fórmula — nome, ano, autor. */
  legenda?: React.ReactNode
  /** Rótulo curto pra leitor de tela. */
  ariaLabel?: string
  /** Prosa em PT-BR que o botão "Ler equação" usa via Web Speech API.
   *  Ex.: "C igual a S vezes N de d um, menos K vezes e elevado a menos
   *  r T, vezes N de d dois". Se omitido, o botão não aparece. */
  audioTexto?: string
}

const macros: Record<string, string> = {
  '\\R': '\\mathbb{R}',
  '\\E': '\\mathbb{E}',
  '\\d': '\\mathrm{d}',
  '\\e': '\\mathrm{e}',
  '\\diff': '\\frac{\\d#1}{\\d#2}',
  '\\pdiff': '\\frac{\\partial#1}{\\partial#2}',
}

/**
 * Bloco-hero da equação canônica do conteúdo.
 *
 * Sempre visível NO TOPO da peça, fora do DuasPortas — qualquer porta que
 * o usuário escolha vê a fórmula. É a "cara" do conteúdo: vê a equação,
 * sabe imediatamente do que é a peça.
 */
export function EquacaoCanonica({
  formula,
  legenda,
  ariaLabel,
  audioTexto,
}: EquacaoCanonicaProps) {
  const html = katex.renderToString(formula, {
    output: 'htmlAndMathml',
    displayMode: true,
    throwOnError: false,
    strict: false,
    macros,
  })

  return (
    <section
      role="math"
      aria-label={ariaLabel ?? formula}
      className="not-prose my-10 overflow-hidden rounded-2xl border-2 border-clube-gold/30 bg-gradient-to-b from-clube-cream-soft to-clube-surface px-6 py-10 shadow-sm"
    >
      <div
        className="canonica-katex overflow-x-auto text-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {(legenda || audioTexto) && (
        <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-between">
          {legenda && (
            <p className="text-center text-sm leading-relaxed text-clube-mist sm:text-left">
              {legenda}
            </p>
          )}
          {audioTexto && (
            <div className="shrink-0">
              <AudioReader texto={audioTexto} />
            </div>
          )}
        </div>
      )}
    </section>
  )
}
