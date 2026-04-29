'use client'

import {
  Children,
  isValidElement,
  useMemo,
  useState,
  type ReactNode,
  type ReactElement,
} from 'react'

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

interface ExercicioProps {
  /** Número/identificador (ex.: "1.3" significa terceiro exercício da Aula 1) */
  numero?: string
  /** Nível de dificuldade — define cor e ordenação */
  dificuldade: DificuldadeExercicio
  /** Enunciado do exercício */
  children: ReactNode
  /** Resposta esperada (numérica ou string curta) — mostrada apenas após o aluno tentar */
  resposta?: string
  /** Dica progressiva (se houver) */
  dica?: ReactNode
  /** Solução desenvolvida — só visível para os 25% sorteados pelo seed da lista */
  solucao?: ReactNode
  /** Referência editorial: "Active Calculus §1.3 ex. 12" */
  referencia?: string
}

/**
 * Item individual da lista de exercícios. NÃO renderiza diretamente — o
 * pai `<ListaExercicios>` consome os filhos e decide o que mostrar.
 */
export function Exercicio(_props: ExercicioProps): null {
  return null // Render delegado ao pai
}
Exercicio.displayName = 'Exercicio'

interface ListaExerciciosProps {
  /** Seed determinística para sorteio dos 25% gabaritados.
   *  Tipicamente "aula-NN" (ex.: "aula-01"). */
  seed: string
  /** Fração que recebe solução visível. Default 0.25 (25%). */
  fracaoGabaritada?: number
  /** Filhos: somente `<Exercicio>` */
  children: ReactNode
}

/**
 * Hash simples (FNV-1a 32-bit) para seed pseudoaleatório determinístico.
 */
function fnv1a(str: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash
}

/**
 * RNG determinístico simples (LCG) a partir de seed inteiro.
 */
function lcg(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = Math.imul(state, 1664525) + 1013904223
    state = state >>> 0
    return state / 0xffffffff
  }
}

/**
 * Lista de exercícios da aula. Sorteia 25% (configurável) dos exercícios
 * para mostrar a solução desenvolvida; nos demais, oferece resposta final
 * apenas após o aluno digitar.
 *
 * O sorteio é determinístico via seed — o mesmo aluno verá os mesmos
 * exercícios gabaritados em sessões futuras (consistência pedagógica).
 */
export function ListaExercicios({
  seed,
  fracaoGabaritada = 0.25,
  children,
}: ListaExerciciosProps) {
  const exercicios = Children.toArray(children).filter(
    (c): c is ReactElement<ExercicioProps> =>
      isValidElement(c) && (c.type as { displayName?: string }).displayName === 'Exercicio',
  )

  // Sorteia índices que terão solução visível, com seed determinística
  const idsGabaritados = useMemo(() => {
    const total = exercicios.length
    const k = Math.max(1, Math.floor(total * fracaoGabaritada))
    const rng = lcg(fnv1a(seed))
    const indices = Array.from({ length: total }, (_, i) => i)
    // Fisher-Yates determinístico
    for (let i = total - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j]!, indices[i]!]
    }
    return new Set(indices.slice(0, k))
  }, [exercicios.length, fracaoGabaritada, seed])

  const total = exercicios.length
  const gabaritados = idsGabaritados.size

  // Agrupa por dificuldade pra resumo
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
    <section className="not-prose my-10 rounded-2xl border-2 border-clube-mist-soft/40 bg-clube-cream-soft p-6 sm:p-8">
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

function ItemExercicio({
  indice,
  props,
  gabaritado,
}: {
  indice: number
  props: ExercicioProps
  gabaritado: boolean
}) {
  const { numero, dificuldade, children, resposta, dica, solucao, referencia } = props
  const [tentou, setTentou] = useState(false)
  const [pediuDica, setPediuDica] = useState(false)
  const [vendoSolucao, setVendoSolucao] = useState(false)
  const [respostaUsuario, setRespostaUsuario] = useState('')

  const id = numero ?? String(indice + 1)

  const acertou =
    tentou &&
    resposta !== undefined &&
    respostaUsuario.trim().replace(/\s+/g, '').toLowerCase() ===
      resposta.trim().replace(/\s+/g, '').toLowerCase()

  return (
    <li className="rounded-xl border border-clube-mist-soft/40 bg-clube-surface p-4 sm:p-5">
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
        {referencia && (
          <span className="ml-auto text-[10px] text-clube-mist/80">
            ref: {referencia}
          </span>
        )}
      </div>

      <div className="prose prose-clube prose-sm max-w-none">{children}</div>

      {resposta !== undefined && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-clube-mist-soft/40 pt-3">
          <input
            type="text"
            value={respostaUsuario}
            onChange={(e) => setRespostaUsuario(e.target.value)}
            placeholder="sua resposta"
            className="flex-1 min-w-[180px] rounded-md border border-clube-mist-soft/60 bg-clube-cream px-3 py-1.5 font-mono text-sm text-clube-ink"
            disabled={acertou}
          />
          <button
            type="button"
            onClick={() => setTentou(true)}
            className="rounded-md bg-clube-teal px-3 py-1.5 text-sm font-semibold text-white hover:bg-clube-teal-deep"
            disabled={acertou}
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

      {tentou && resposta !== undefined && (
        <p
          className={`mt-2 text-sm font-semibold ${
            acertou ? 'text-clube-leaf' : 'text-clube-clay'
          }`}
        >
          {acertou ? '✓ Correto.' : `✗ Resposta esperada: ${resposta}`}
        </p>
      )}

      {pediuDica && dica && (
        <div className="mt-3 rounded-lg border-l-4 border-clube-gold bg-clube-gold/10 p-3 text-sm">
          <strong className="block text-xs uppercase tracking-wider text-clube-gold-deep">
            Dica
          </strong>
          <div className="prose prose-clube prose-sm mt-1 max-w-none">{dica}</div>
        </div>
      )}

      {gabaritado && solucao && (
        <details
          className="mt-3 rounded-lg border border-clube-teal/30 bg-clube-teal/5 p-3"
          open={vendoSolucao}
          onToggle={(e) => setVendoSolucao((e.target as HTMLDetailsElement).open)}
        >
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-clube-teal hover:text-clube-teal-deep">
            {vendoSolucao ? 'Ocultar solução' : 'Ver solução desenvolvida'}
          </summary>
          <div className="prose prose-clube prose-sm mt-3 max-w-none">{solucao}</div>
        </details>
      )}
    </li>
  )
}
