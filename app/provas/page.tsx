import type { Metadata } from 'next'
import { ProvaViewer } from '@/components/math/ProvaViewer'
import { PROVAS } from '@/content/provas-data'

export const metadata: Metadata = {
  title: 'Provas',
  description:
    'Banco de provas integradas do programa do Clube da Matemática. Cada questão tem gabarito + explicação passo a passo. Troque de prova com um clique.',
}

export default function ProvasPage() {
  const totalQuestoes = PROVAS.reduce((s, p) => s + p.questoes.length, 0)
  const totalProvas = PROVAS.length

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
          {totalProvas} provas · {totalQuestoes} questões totais. Cada questão
          tem <strong>gabarito e explicação passo a passo</strong>. Use o botão
          "Revelar passo a passo" depois de tentar resolver no caderno.
        </p>
        <p className="mt-3 max-w-prose text-base text-clube-mist/85">
          Estilo: questões adaptadas (paráfrase, números BR) de OpenStax,
          Stitz-Zeager, ENEM, ITA e Olimpíada Brasileira de Matemática.{' '}
          <strong>Não use a explicação como muleta</strong> — feche e tente
          de novo se errar.
        </p>
      </header>

      <ProvaViewer />

      <footer className="mt-16 rounded-2xl bg-clube-cream-soft p-6 text-sm text-clube-mist">
        <h3 className="text-base font-bold text-clube-teal-deep">
          Como funciona
        </h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Escolha uma prova no seletor no topo.</li>
          <li>Reserve o tempo indicado e resolva no caderno.</li>
          <li>Verifique cada questão: clique em <em>Revelar passo a passo</em>.</li>
          <li>Anote os pontos onde errou e revisite a aula correspondente.</li>
        </ol>
        <p className="mt-3 italic">
          Nenhum dado seu é coletado. Tudo roda no seu navegador, e seu
          progresso é privado.
        </p>
      </footer>
    </article>
  )
}
