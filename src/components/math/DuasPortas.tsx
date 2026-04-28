'use client'

import { useState, Children, isValidElement, type ReactElement, type ReactNode } from 'react'
import { IDADES_PADRAO, IDADE_LABEL, IDADE_DESCRICAO, type Idade } from '@/content/schema'

interface PortaProps {
  nivel: Idade | string
  titulo?: string
  children: ReactNode
}

/**
 * Wrapper de uma porta. Não renderiza visualmente nada por conta própria —
 * o `<DuasPortas>` pai filtra os filhos e mostra a porta selecionada.
 */
export function Porta({ children, titulo }: PortaProps) {
  return (
    <article className="prose prose-clube max-w-none">
      {titulo && (
        <h3 className="!mb-4 text-xl font-semibold text-clube-teal-deep">{titulo}</h3>
      )}
      {children}
    </article>
  )
}
Porta.displayName = 'Porta'

interface DuasPortasProps {
  /** Idade pré-selecionada. Default '25'. */
  idadeInicial?: Idade
  children: ReactNode
}

/**
 * Seletor de porta — mostra UMA porta por vez baseada na idade selecionada.
 *
 * Os filhos esperados são `<Porta nivel="..." />`. Idades extras (`8`, `60`,
 * etc.) são suportadas e aparecem como pills adicionais.
 */
export function DuasPortas({ children, idadeInicial = '25' }: DuasPortasProps) {
  // Extrai todas as Portas dos filhos
  const portas = Children.toArray(children).filter(
    (child): child is ReactElement<PortaProps> =>
      isValidElement(child) &&
      typeof child.props === 'object' &&
      child.props !== null &&
      'nivel' in child.props,
  )

  // Idades disponíveis: as padrão sempre + extras na ordem que aparecem
  const idadesPadrao = new Set<string>(IDADES_PADRAO)
  const portasMap = new Map<string, ReactElement<PortaProps>>()
  portas.forEach((p) => portasMap.set(String(p.props.nivel), p))

  const idadesPresentes = [
    ...IDADES_PADRAO.filter((id) => portasMap.has(id)),
    ...Array.from(portasMap.keys()).filter((k) => !idadesPadrao.has(k)),
  ]

  const inicialFinal = idadesPresentes.includes(idadeInicial)
    ? idadeInicial
    : (idadesPresentes[0] ?? 'formal')

  const [idade, setIdade] = useState<string>(inicialFinal)
  const portaAtiva = portasMap.get(idade)

  const labelDe = (id: string): string =>
    id in IDADE_LABEL ? IDADE_LABEL[id as Idade] : `${id} anos`
  const descDe = (id: string): string =>
    id in IDADE_DESCRICAO ? IDADE_DESCRICAO[id as Idade] : ''

  return (
    <div className="my-8">
      {/* Seletor de idade */}
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-clube-mist">
        Escolha sua porta
      </div>
      <div
        className="-mx-1 flex flex-wrap items-center gap-1.5 py-2"
        role="tablist"
        aria-label="Selecionar nível de explicação"
      >
        {idadesPresentes.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={idade === id}
            data-active={idade === id ? 'true' : 'false'}
            onClick={() => setIdade(id)}
            className="porta-pill"
          >
            {labelDe(id)}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-clube-mist">{descDe(idade)}</p>

      {/* Conteúdo da porta */}
      <div className="mt-6 rounded-2xl border border-clube-mist-soft/40 bg-clube-surface p-6 sm:p-8">
        {portaAtiva ?? (
          <p className="text-clube-mist">Nenhum conteúdo para esta idade ainda.</p>
        )}
      </div>
    </div>
  )
}
