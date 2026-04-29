import type { Metadata } from 'next'
import { VisitorMap } from '@/components/layout/VisitorMap'

export const metadata: Metadata = {
  title: 'Mapa de visitantes — Clube da Matemática',
  description:
    'Onde os leitores do Clube da Matemática estão no mundo. Anônimo, agregado, transparente.',
}

export default function MapaPage() {
  return (
    <main className="container-clube py-16 sm:py-20">
      <header className="mx-auto mb-10 max-w-3xl text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
          ◆ De onde vem nossa galera ◆
        </p>
        <h1 className="text-hero font-bold text-clube-teal-deep">
          Mapa do mundo
        </h1>
        <p className="mt-4 text-base text-clube-ink/80">
          Cada acesso ao Clube é registrado de forma anônima — só país e
          cidade aproximada (via IP). Nada de IP guardado, nada de cookie
          de tracking, nada de venda de dados.
        </p>
        <p className="mt-2 text-sm italic text-clube-mist">
          Curiosidade pura: queremos saber quem está estudando.
        </p>
      </header>

      <VisitorMap />

      <footer className="mx-auto mt-16 max-w-3xl rounded-2xl border border-clube-mist-soft/40 bg-clube-cream-soft/30 p-6 text-sm text-clube-mist">
        <h2 className="mb-2 text-base font-semibold text-clube-teal-deep">
          Como funciona
        </h2>
        <ol className="ml-5 list-decimal space-y-1 text-xs">
          <li>
            Quando você abre o site, fazemos uma requisição para{' '}
            <code className="rounded bg-clube-cream px-1 py-0.5">ipapi.co</code>{' '}
            (serviço gratuito) que devolve seu país aproximado pelo IP.
          </li>
          <li>
            Incrementamos um contador anônimo no{' '}
            <code className="rounded bg-clube-cream px-1 py-0.5">CounterAPI.dev</code>{' '}
            tipo <code>clube-pais-br</code>, <code>clube-pais-de</code>, etc.
          </li>
          <li>
            Esta página lê esses contadores e mostra o agregado.
            <strong className="text-clube-ink/85">
              Nenhum dado pessoal é armazenado em momento algum.
            </strong>
          </li>
          <li>
            Cada sessão de navegador conta uma vez (controle por
            <code className="rounded bg-clube-cream px-1 py-0.5"> sessionStorage</code>).
          </li>
        </ol>
      </footer>
    </main>
  )
}
