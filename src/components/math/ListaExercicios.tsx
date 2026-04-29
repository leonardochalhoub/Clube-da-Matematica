'use client'

import {
  Children,
  isValidElement,
  useMemo,
  useState,
  type ReactNode,
  type ReactElement,
} from 'react'
import katex from 'katex'

export type DificuldadeExercicio =
  | 'aplicacao'
  | 'compreensao'
  | 'modelagem'
  | 'desafio'
  | 'demonstracao'

const DIFICULDADE_LABEL: Record<DificuldadeExercicio, string> = {
  aplicacao: 'Aplicação',
  compreensao: 'Compreensão',
  modelagem: 'Modelagem',
  desafio: 'Desafio',
  demonstracao: 'Demonstração',
}

const DIFICULDADE_COR: Record<DificuldadeExercicio, string> = {
  aplicacao: 'bg-clube-cream-soft text-clube-mist',
  compreensao: 'bg-clube-teal/10 text-clube-teal',
  modelagem: 'bg-clube-leaf/15 text-clube-leaf',
  desafio: 'bg-clube-clay/15 text-clube-clay',
  demonstracao: 'bg-clube-gold/20 text-clube-gold-deep',
}

const KATEX_MACROS: Record<string, string> = {
  '\\R': '\\mathbb{R}',
  '\\N': '\\mathbb{N}',
  '\\Z': '\\mathbb{Z}',
  '\\Q': '\\mathbb{Q}',
  '\\C': '\\mathbb{C}',
  '\\e': '\\mathrm{e}',
}

function renderKatex(expr: string): string {
  try {
    return katex.renderToString(expr, {
      throwOnError: false,
      strict: false,
      macros: KATEX_MACROS,
    })
  } catch {
    return `<code>${expr}</code>`
  }
}

/** Renderiza string com $...$ inline → KaTeX. */
function renderInline(text: string): string {
  return text.replace(/\$([^$]+)\$/g, (_, expr) => renderKatex(expr))
}

/**
 * Heurística: resposta é "LaTeX-only" se contém comandos LaTeX (\xxx, ^, _, \frac etc)
 * impossíveis de digitar como texto plano. Nesses casos não pedimos input — só
 * mostramos a resposta renderizada.
 */
function respostaImpossivelDigitar(resposta: string): boolean {
  const r = resposta.trim()
  // contém $...$ com comandos
  if (/\$[^$]*\\[a-zA-Z]+/.test(r)) return true
  // múltiplos $...$
  const dollarCount = (r.match(/\$/g) ?? []).length
  if (dollarCount >= 4) return true
  // comandos LaTeX soltos
  if (/\\[a-zA-Z]{2,}/.test(r)) return true
  return false
}

export interface OpcaoExercicio {
  /** Texto da opção. Pode conter $...$ inline KaTeX. */
  texto: string
  /** Se essa opção é a correta. (Apenas uma deve ser true.) */
  correta?: boolean
}

export interface FonteExercicio {
  /** Nome do livro. Ex.: "OpenStax College Algebra 2e". */
  livro: string
  /** URL deep-link à seção/página específica do livro. */
  url: string
  /** Seção (ex.: "§3.2"). */
  secao?: string
  /** Página (ex.: 247). */
  pagina?: string | number
  /** Identificador do exercício no livro (ex.: "ex. 17"). */
  exercicio?: string
  /** Licença (CC-BY 4.0, etc.). */
  licenca?: string
}

interface ExercicioProps {
  /** Número/identificador (ex.: "1.3"). */
  numero?: string
  /** Dificuldade — define cor e badge. */
  dificuldade: DificuldadeExercicio
  /** Enunciado. */
  children: ReactNode
  /** Resposta esperada (texto plano ou $LaTeX$). */
  resposta?: string
  /** Opções de múltipla escolha. Quando presente, ignora `resposta` para
   *  conferência: a verificação é por clique na opção correta. */
  opcoes?: OpcaoExercicio[]
  /** Dica progressiva. */
  dica?: ReactNode
  /** Solução desenvolvida (só aparece nos gabaritados). */
  solucao?: ReactNode
  /** Fonte — clicável, vai pra página do livro. */
  fonte?: FonteExercicio
  /** Referência editorial em formato livre (legacy). Use `fonte` em vez disso. */
  referencia?: string
}

const EXERCICIO_MARKER = '__clube_exercicio__'

/**
 * Marker null-component. Render delegado ao pai `<ListaExercicios>`.
 */
export function Exercicio(_props: ExercicioProps): null {
  return null
}
Exercicio.displayName = 'Exercicio'
;(Exercicio as unknown as { [k: string]: unknown })[EXERCICIO_MARKER] = true

interface ListaExerciciosProps {
  seed: string
  fracaoGabaritada?: number
  children: ReactNode
}

function fnv1a(str: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash
}

function lcg(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = Math.imul(state, 1664525) + 1013904223
    state = state >>> 0
    return state / 0xffffffff
  }
}

export function ListaExercicios({
  seed,
  fracaoGabaritada = 0.25,
  children,
}: ListaExerciciosProps) {
  // Robusto a Next.js client boundary: filtra por presença de prop `dificuldade`
  const exercicios = Children.toArray(children).filter(
    (c): c is ReactElement<ExercicioProps> => {
      if (!isValidElement(c)) return false
      const props = (c as ReactElement<unknown>).props as Partial<ExercicioProps> | null
      if (!props || typeof props !== 'object') return false
      return typeof props.dificuldade === 'string'
    },
  )

  const idsGabaritados = useMemo(() => {
    const total = exercicios.length
    const k = Math.max(1, Math.floor(total * fracaoGabaritada))
    const rng = lcg(fnv1a(seed))
    const indices = Array.from({ length: total }, (_, i) => i)
    for (let i = total - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j]!, indices[i]!]
    }
    return new Set(indices.slice(0, k))
  }, [exercicios.length, fracaoGabaritada, seed])

  const total = exercicios.length
  const gabaritados = idsGabaritados.size

  const contagem = exercicios.reduce<Record<DificuldadeExercicio, number>>(
    (acc, ex) => {
      acc[ex.props.dificuldade] = (acc[ex.props.dificuldade] ?? 0) + 1
      return acc
    },
    {
      aplicacao: 0,
      compreensao: 0,
      modelagem: 0,
      desafio: 0,
      demonstracao: 0,
    },
  )

  return (
    <section className="not-prose my-10 rounded-2xl border-2 border-clube-mist-soft/40 bg-clube-cream-soft p-4 sm:p-6 lg:p-8">
      <header className="mb-6 border-b border-clube-mist-soft/40 pb-4">
        <h3 className="text-xl font-bold text-clube-teal-deep">
          Lista de exercícios
        </h3>
        <p className="mt-1 text-sm text-clube-mist">
          {total} exercícios · {gabaritados} com solução desenvolvida ({Math.round(fracaoGabaritada * 100)}%)
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {(Object.entries(contagem) as [DificuldadeExercicio, number][])
            .filter(([, n]) => n > 0)
            .map(([dif, n]) => (
              <span
                key={dif}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${DIFICULDADE_COR[dif]}`}
              >
                {DIFICULDADE_LABEL[dif]} <strong>{n}</strong>
              </span>
            ))}
        </div>
      </header>

      <ol className="space-y-5">
        {exercicios.map((ex, i) => (
          <ItemExercicio
            key={i}
            indice={i}
            props={ex.props}
            gabaritado={idsGabaritados.has(i)}
          />
        ))}
      </ol>
    </section>
  )
}

/**
 * Constrói URL do Wolfram Alpha para resolver o exercício online.
 * Usa o enunciado como query (sem o KaTeX wrapper).
 */
function wolframUrl(enunciadoTexto: string): string {
  // Tira $...$ wrapping mas mantém o LaTeX dentro
  const clean = enunciadoTexto
    .replace(/\$([^$]+)\$/g, '$1')
    .replace(/\\\\/g, ' ')
    .trim()
    .slice(0, 500)
  return `https://www.wolframalpha.com/input?i=${encodeURIComponent(clean)}`
}

/** Extrai texto puro de um ReactNode (best-effort, para query Wolfram). */
function nodeToString(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeToString).join('')
  if (isValidElement(node)) {
    const children = (node as ReactElement<{ children?: ReactNode }>).props
      ?.children
    return nodeToString(children ?? '')
  }
  return ''
}

function ItemExercicio({
  indice,
  props,
  gabaritado,
}: {
  indice: number
  props: ExercicioProps
  gabaritado: boolean
}) {
  const {
    numero,
    dificuldade,
    children,
    resposta,
    opcoes,
    dica,
    solucao,
    fonte,
    referencia,
  } = props
  const [tentou, setTentou] = useState(false)
  const [pediuDica, setPediuDica] = useState(false)
  const [vendoSolucao, setVendoSolucao] = useState(false)
  const [respostaUsuario, setRespostaUsuario] = useState('')
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<number | null>(null)

  const id = numero ?? String(indice + 1)
  const enunciadoTexto = nodeToString(children)

  // ====== Lógica de conferência ======
  const temOpcoes = !!opcoes && opcoes.length > 0
  const indiceCorreto = temOpcoes
    ? opcoes!.findIndex((o) => o.correta)
    : -1
  const acertouOpcao =
    temOpcoes && tentou && opcaoSelecionada === indiceCorreto

  const respostaLatexOnly =
    !!resposta && respostaImpossivelDigitar(resposta)
  // Quando há `resposta` mas é LaTeX-only e SEM opcoes, oferecemos só "Ver
  // resposta" (sem text input que seria impossível de preencher).
  const usaInputTexto = !!resposta && !temOpcoes && !respostaLatexOnly

  const acertouTexto =
    usaInputTexto &&
    tentou &&
    resposta!.trim().replace(/\s+/g, '').toLowerCase() ===
      respostaUsuario.trim().replace(/\s+/g, '').toLowerCase()

  return (
    <li className="rounded-xl border border-clube-mist-soft/40 bg-clube-surface p-4 sm:p-5">
      {/* Header do exercício */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm font-bold text-clube-teal-deep">
          Ex. {id}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${DIFICULDADE_COR[dificuldade]}`}
        >
          {DIFICULDADE_LABEL[dificuldade]}
        </span>
        {gabaritado && (
          <span className="rounded-full bg-clube-gold/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-clube-gold-deep">
            Gabarito
          </span>
        )}
      </div>

      {/* Enunciado */}
      <div className="prose prose-clube prose-sm max-w-none">{children}</div>

      {/* Múltipla escolha */}
      {temOpcoes && (
        <fieldset className="mt-4 border-t border-clube-mist-soft/40 pt-4">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-clube-mist">
            Selecione a alternativa correta
          </legend>
          <div className="space-y-2">
            {opcoes!.map((op, idx) => {
              const isSel = opcaoSelecionada === idx
              const showCertaErrada = tentou && isSel
              const corBorda = showCertaErrada
                ? acertouOpcao
                  ? 'border-clube-leaf bg-clube-leaf/10'
                  : 'border-clube-clay bg-clube-clay/10'
                : isSel
                  ? 'border-clube-teal bg-clube-teal/5'
                  : 'border-clube-mist-soft/60 bg-clube-cream'
              return (
                <label
                  key={idx}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 px-3 py-2 transition-colors hover:border-clube-teal/50 ${corBorda}`}
                >
                  <input
                    type="radio"
                    name={`ex-${id}-opcoes`}
                    value={idx}
                    checked={isSel}
                    onChange={() => {
                      setOpcaoSelecionada(idx)
                      setTentou(false)
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-clube-teal"
                  />
                  <span
                    className="flex-1 text-sm text-clube-ink"
                    dangerouslySetInnerHTML={{ __html: renderInline(op.texto) }}
                  />
                  {tentou && idx === indiceCorreto && (
                    <span className="text-clube-leaf" aria-label="correta">
                      ✓
                    </span>
                  )}
                </label>
              )
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setTentou(true)}
              disabled={opcaoSelecionada === null}
              className="rounded-md bg-clube-teal px-3 py-1.5 text-sm font-semibold text-white hover:bg-clube-teal-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              Conferir
            </button>
            {tentou && (
              <span
                className={`text-sm font-semibold ${
                  acertouOpcao ? 'text-clube-leaf' : 'text-clube-clay'
                }`}
              >
                {acertouOpcao
                  ? '✓ Correto.'
                  : '✗ Tente novamente — escolha outra alternativa.'}
              </span>
            )}
          </div>
        </fieldset>
      )}

      {/* Input texto (só quando faz sentido digitar) */}
      {usaInputTexto && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-clube-mist-soft/40 pt-3">
          <input
            type="text"
            value={respostaUsuario}
            onChange={(e) => setRespostaUsuario(e.target.value)}
            placeholder="sua resposta"
            className="flex-1 min-w-[180px] rounded-md border border-clube-mist-soft/60 bg-clube-cream px-3 py-1.5 font-mono text-sm text-clube-ink"
            disabled={acertouTexto}
          />
          <button
            type="button"
            onClick={() => setTentou(true)}
            className="rounded-md bg-clube-teal px-3 py-1.5 text-sm font-semibold text-white hover:bg-clube-teal-deep"
            disabled={acertouTexto}
          >
            Conferir
          </button>
          {dica && !pediuDica && (
            <button
              type="button"
              onClick={() => setPediuDica(true)}
              className="rounded-md border border-clube-mist-soft/60 bg-clube-surface px-3 py-1.5 text-sm text-clube-mist hover:border-clube-teal"
            >
              Pedir dica
            </button>
          )}
        </div>
      )}

      {/* "Ver resposta" para casos LaTeX-only sem opcoes */}
      {respostaLatexOnly && !temOpcoes && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-clube-mist-soft/40 pt-3">
          <button
            type="button"
            onClick={() => setTentou(true)}
            className="rounded-md bg-clube-teal px-3 py-1.5 text-sm font-semibold text-white hover:bg-clube-teal-deep"
          >
            {tentou ? 'Resposta revelada ↓' : 'Ver resposta'}
          </button>
          {dica && !pediuDica && (
            <button
              type="button"
              onClick={() => setPediuDica(true)}
              className="rounded-md border border-clube-mist-soft/60 bg-clube-surface px-3 py-1.5 text-sm text-clube-mist hover:border-clube-teal"
            >
              Pedir dica
            </button>
          )}
        </div>
      )}

      {/* Feedback resposta texto */}
      {tentou && usaInputTexto && (
        <p
          className={`mt-2 text-sm font-semibold ${
            acertouTexto ? 'text-clube-leaf' : 'text-clube-clay'
          }`}
        >
          {acertouTexto ? '✓ Correto.' : `✗ Resposta esperada: `}
          {!acertouTexto && (
            <span
              className="font-normal"
              dangerouslySetInnerHTML={{ __html: renderInline(resposta!) }}
            />
          )}
        </p>
      )}

      {/* Resposta revelada (caso LaTeX-only) */}
      {tentou && respostaLatexOnly && !temOpcoes && (
        <div className="mt-2 rounded-md border-l-4 border-clube-leaf bg-clube-leaf/10 p-3 text-sm">
          <strong className="block text-xs uppercase tracking-wider text-clube-leaf">
            Resposta
          </strong>
          <span
            className="mt-1 inline-block text-clube-ink"
            dangerouslySetInnerHTML={{ __html: renderInline(resposta!) }}
          />
        </div>
      )}

      {/* Dica */}
      {pediuDica && dica && (
        <div className="mt-3 rounded-lg border-l-4 border-clube-gold bg-clube-gold/10 p-3 text-sm">
          <strong className="block text-xs uppercase tracking-wider text-clube-gold-deep">
            Dica
          </strong>
          <div className="prose prose-clube prose-sm mt-1 max-w-none">{dica}</div>
        </div>
      )}

      {/* Botão "Resolver online" + fonte */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-clube-mist-soft/30 pt-3 text-[11px]">
        <a
          href={wolframUrl(enunciadoTexto)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-clube-mist-soft/60 bg-clube-cream px-2.5 py-1 font-medium text-clube-teal hover:border-clube-teal hover:bg-clube-teal/5 hover:no-underline"
          aria-label="Resolver este exercício online no Wolfram Alpha"
        >
          <CalcIcon /> Resolver online
        </a>
        {fonte && (
          <a
            href={fonte.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-clube-cream-soft px-2.5 py-1 font-medium text-clube-mist hover:text-clube-teal hover:no-underline"
          >
            <BookIcon />
            <span>
              <strong className="text-clube-ink/85">{fonte.livro}</strong>
              {fonte.secao && <span> · {fonte.secao}</span>}
              {fonte.exercicio && <span> · {fonte.exercicio}</span>}
              {fonte.pagina && <span> · p. {fonte.pagina}</span>}
            </span>
          </a>
        )}
        {!fonte && referencia && (
          <span className="text-clube-mist/80">ref: {referencia}</span>
        )}
      </div>

      {/* Solução passo-a-passo — sempre disponível quando autora forneceu.
         O badge "Gabarito" no topo ainda marca os 25% sorteados como
         destaque visual, mas a solução em si é universal. */}
      {solucao && (
        <details
          className="mt-3 rounded-lg border border-clube-teal/30 bg-clube-teal/5 p-3"
          open={vendoSolucao}
          onToggle={(e) => setVendoSolucao((e.target as HTMLDetailsElement).open)}
        >
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-clube-teal hover:text-clube-teal-deep">
            {vendoSolucao ? 'Ocultar passo a passo' : 'Ver passo a passo (com o porquê)'}
          </summary>
          <div className="prose prose-clube prose-sm mt-3 max-w-none">{solucao}</div>
        </details>
      )}
    </li>
  )
}

function CalcIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="12"
      height="12"
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10" />
      <line x1="12" y1="10" x2="12" y2="10" />
      <line x1="16" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="8" y2="14" />
      <line x1="12" y1="14" x2="12" y2="14" />
      <line x1="16" y1="14" x2="16" y2="14" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="12"
      height="12"
      aria-hidden="true"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}
