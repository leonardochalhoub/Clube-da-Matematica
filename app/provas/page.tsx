import type { Metadata } from 'next'
import { ProvaViewer } from '@/components/math/ProvaViewer'
import {
  PROVAS,
  PROVAS_REAIS,
  TOTAL_QUESTOES_REAIS,
} from '@/content/provas-data'

export const metadata: Metadata = {
  title: 'Provas',
  description:
    'Banco de provas integradas — questões REAIS de OpenStax, Active Calculus e outros livros públicos. Cada questão tem fonte declarada + passo a passo profundo com o porquê.',
}

export default function ProvasPage() {
  const totalProvas = PROVAS.length
  const totalCuradas = PROVAS_REAIS.length
  const trimsCobertos = new Set(PROVAS_REAIS.map((p) => p.trim)).size

  return (
    <article className="container-clube max-w-4xl py-12 sm:py-16">
      <header className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
          Provas
        </p>
        <h1 className="text-display font-extrabold text-clube-teal-deep">
          Provas integradas
        </h1>
        <p className="mt-4 max-w-prose text-lg leading-relaxed text-clube-mist">
          Cada questão tem <strong>fonte declarada</strong> (livro · seção ·
          número do exercício) e <strong>passo a passo profundo</strong> com
          o porquê de cada operação.
        </p>
        <p className="mt-3 max-w-prose text-base text-clube-mist/85">
          O ledger são os livros: <strong>OpenStax</strong> (College Algebra
          2e, Algebra & Trig 2e, Calculus Vol 1/2/3, Introductory Statistics
          — todos CC-BY 4.0), <strong>Notes on Diffy Qs</strong> (Lebl,
          CC-BY-SA), <strong>Active Calculus</strong> (Boelkins,
          CC-BY-NC-SA). Adaptamos apenas tradução pt-BR e contexto numérico
          (PETR4 em vez de Apple).
        </p>
      </header>

      <section className="mb-10 grid gap-3 sm:grid-cols-4">
        <div className="card-clube text-center">
          <div className="text-2xl font-extrabold text-clube-teal-deep">
            {totalProvas}
          </div>
          <div className="mt-1 text-xs text-clube-mist">provas no banco</div>
        </div>
        <div className="card-clube text-center">
          <div className="text-2xl font-extrabold text-clube-leaf">
            {totalCuradas}
          </div>
          <div className="mt-1 text-xs text-clube-mist">versões curadas</div>
        </div>
        <div className="card-clube text-center">
          <div className="text-2xl font-extrabold text-clube-gold-deep">
            {TOTAL_QUESTOES_REAIS}
          </div>
          <div className="mt-1 text-xs text-clube-mist">questões reais</div>
        </div>
        <div className="card-clube text-center">
          <div className="text-2xl font-extrabold text-clube-clay">
            {trimsCobertos}/12
          </div>
          <div className="mt-1 text-xs text-clube-mist">trimestres cobertos</div>
        </div>
      </section>

      <ProvaViewer />

      <footer className="mt-16 rounded-2xl bg-clube-cream-soft p-6 text-sm text-clube-mist">
        <h3 className="text-base font-bold text-clube-teal-deep">
          Como funciona
        </h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Escolha o trimestre e a versão.</li>
          <li>Reserve o tempo indicado e resolva no caderno.</li>
          <li>
            Verifique cada questão: clique em{' '}
            <em>Revelar passo a passo</em>.
          </li>
          <li>
            Anote os pontos onde errou e revisite a lição correspondente
            (badges com ID da lição abaixo de cada questão).
          </li>
          <li>
            Curioso sobre a fonte? Clique no nome do livro e vá direto ao
            capítulo original.
          </li>
        </ol>
        <p className="mt-3 italic">
          Versões marcadas como "em curadoria" ainda não têm questões
          carregadas. As versões 1 de cada trimestre estão sempre prontas.
          Quer ajudar a curar mais versões? Cada PR adicional é
          bem-vindo no GitHub.
        </p>
      </footer>
    </article>
  )
}
