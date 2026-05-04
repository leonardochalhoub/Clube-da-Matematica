'use client'

import {
  useState,
  useRef,
  Children,
  isValidElement,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { IDADES_PADRAO, type Idade } from '@/content/schema'
import { useLocale } from '@/components/layout/LocaleProvider'

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
  /** Idade pré-selecionada. Default 'formal' — todos abrem rigoroso. */
  idadeInicial?: Idade
  children: ReactNode
}

/**
 * Seletor de porta — mostra UMA porta por vez baseada na idade selecionada.
 *
 * Acessibilidade (WAI-ARIA Tabs Pattern):
 * - role="tablist" com aria-label
 * - cada botão é role="tab" com id, aria-selected, aria-controls
 * - painel é role="tabpanel" com aria-labelledby + tabIndex={0}
 * - teclas Home/End/← /→ navegam entre tabs (foco circular)
 * - aria-live="polite" não é usado aqui porque o foco do tabpanel já
 *   sinaliza a mudança ao leitor de tela.
 */
export function DuasPortas({ children, idadeInicial = 'formal' }: DuasPortasProps) {
  const { t } = useLocale()

  const portas = Children.toArray(children).filter(
    (child): child is ReactElement<PortaProps> =>
      isValidElement(child) &&
      typeof child.props === 'object' &&
      child.props !== null &&
      'nivel' in child.props,
  )

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

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const labelDe = (id: string): string => {
    if (idadesPadrao.has(id)) return t(`idade.${id}.label`)
    return `${id} ${t('duasPortas.years')}`
  }
  const descDe = (id: string): string => {
    if (idadesPadrao.has(id)) return t(`idade.${id}.desc`, '')
    return ''
  }

  const tabId = (id: string) => `porta-tab-${id}`
  const panelId = (id: string) => `porta-panel-${id}`

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const idx = idadesPresentes.indexOf(idade)
    let nextIdx = idx
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        nextIdx = (idx + 1) % idadesPresentes.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        nextIdx = (idx - 1 + idadesPresentes.length) % idadesPresentes.length
        break
      case 'Home':
        e.preventDefault()
        nextIdx = 0
        break
      case 'End':
        e.preventDefault()
        nextIdx = idadesPresentes.length - 1
        break
      default:
        return
    }
    const next = idadesPresentes[nextIdx]
    if (next) {
      setIdade(next)
      requestAnimationFrame(() => tabRefs.current[next]?.focus())
    }
  }

  return (
    <div className="my-8">
      <div
        className="mb-1 text-xs font-semibold uppercase tracking-wider text-clube-mist"
        id="porta-tablist-label"
      >
        {t('duasPortas.chooseDoor')}
      </div>
      <div
        className="-mx-1 flex flex-wrap items-center gap-1.5 py-2"
        role="tablist"
        aria-labelledby="porta-tablist-label"
      >
        {idadesPresentes.map((id) => {
          const ativo = idade === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={tabId(id)}
              aria-selected={ativo}
              aria-controls={panelId(id)}
              tabIndex={ativo ? 0 : -1}
              data-active={ativo ? 'true' : 'false'}
              onClick={() => setIdade(id)}
              onKeyDown={onKeyDown}
              ref={(el) => {
                tabRefs.current[id] = el
              }}
              className="porta-pill"
            >
              {labelDe(id)}
            </button>
          )
        })}
      </div>
      <p className="mt-1 text-xs text-clube-mist">{descDe(idade)}</p>

      <div
        role="tabpanel"
        id={panelId(idade)}
        aria-labelledby={tabId(idade)}
        tabIndex={0}
        className="mt-6 rounded-2xl border border-clube-mist-soft/40 bg-clube-surface p-6 sm:p-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-clube-gold"
      >
        {portaAtiva ?? (
          <p className="text-clube-mist">{t('duasPortas.empty')}</p>
        )}
      </div>
    </div>
  )
}
