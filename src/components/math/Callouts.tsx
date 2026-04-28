import type { ReactNode } from 'react'

interface CalloutBaseProps {
  titulo?: string
  numero?: string
  children: ReactNode
}

/** Bloco visual padrão de um callout matemático. */
function Bloco({
  rotulo,
  cor,
  children,
  titulo,
  numero,
  icone,
}: CalloutBaseProps & {
  rotulo: string
  cor: string
  icone: ReactNode
}) {
  return (
    <aside
      className="my-6 overflow-hidden rounded-xl border border-clube-mist-soft/40 bg-clube-surface"
      role="note"
    >
      <header
        className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
        style={{ backgroundColor: cor }}
      >
        <span aria-hidden className="flex items-center">
          {icone}
        </span>
        <span>{rotulo}</span>
        {numero && <span className="ml-1 opacity-80">— {numero}</span>}
        {titulo && <span className="ml-2 truncate text-white/90 normal-case tracking-normal">· {titulo}</span>}
      </header>
      <div className="prose prose-clube max-w-none px-5 py-4 text-clube-ink">
        {children}
      </div>
    </aside>
  )
}

const Icone = {
  D: <span className="font-mono text-sm">D</span>,
  T: <span className="font-mono text-sm">T</span>,
  E: <span className="font-mono text-sm">E</span>,
  I: <span className="font-mono text-sm">i</span>,
  W: <span className="font-mono text-sm">!</span>,
}

export function Definicao(props: CalloutBaseProps) {
  return <Bloco rotulo="Definição" cor="#1A4D5C" icone={Icone.D} {...props} />
}

export function Teorema(props: CalloutBaseProps) {
  return <Bloco rotulo="Teorema" cor="#0F3540" icone={Icone.T} {...props} />
}

export function Exemplo(props: CalloutBaseProps) {
  return <Bloco rotulo="Exemplo" cor="#3D7A5F" icone={Icone.E} {...props} />
}

export function Insight(props: CalloutBaseProps) {
  return <Bloco rotulo="Observação" cor="#C9A35F" icone={Icone.I} {...props} />
}

export function Cuidado(props: CalloutBaseProps) {
  return <Bloco rotulo="Cuidado" cor="#C76B3F" icone={Icone.W} {...props} />
}

interface LeiturasProps {
  children: ReactNode
}

/**
 * Bloco de "Leituras adicionais / fontes" no fim de cada conteúdo.
 */
export function Leituras({ children }: LeiturasProps) {
  return (
    <section className="mt-12 rounded-xl bg-clube-cream-soft px-6 py-5">
      <h3 className="!mt-0 text-sm font-semibold uppercase tracking-wider text-clube-mist">
        Para continuar
      </h3>
      <div className="prose prose-clube prose-sm mt-3 max-w-none">{children}</div>
    </section>
  )
}
