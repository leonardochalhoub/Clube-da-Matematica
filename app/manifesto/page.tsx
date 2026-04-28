import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manifesto',
  description:
    'O que o Clube da Matemática acredita. Por que existe. Para quem existe.',
}

export default function ManifestoPage() {
  return (
    <article className="container-clube max-w-3xl py-16 sm:py-20">
      <header className="mb-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
          Manifesto
        </p>
        <h1 className="text-display font-extrabold leading-tight text-clube-teal-deep">
          Você vai aprender matemática
          <br />
          <span className="text-clube-teal">de verdade.</span>
        </h1>
      </header>

      <div className="prose prose-clube prose-lg max-w-none">
        <p>
          Não decorar fórmula pra esquecer depois. Não assistir vídeo, achar
          que entendeu e não saber explicar pro colega no dia seguinte.
          Aprender de verdade — saber{' '}
          <strong>o que cada coisa faz, por que faz, e onde ela vive no mundo real</strong>.
        </p>

        <p>
          Não importa se você reprovou Cálculo na engenharia mecânica três
          vezes. Não importa se você terminou mestrado em Finanças e ainda
          olha pra uma derivada e congela. Não importa se você tem 12 anos
          curioso por causa de um vídeo do YouTube, 25 voltando a estudar
          pro concurso, ou 50 querendo finalmente entender aquilo que te
          assustou na faculdade. Se você está{' '}
          <strong>interessado de verdade</strong> — esse site é seu.
        </p>

        <p>
          Aqui matemática não começa pela fórmula. Começa por{' '}
          <strong>um problema que ninguém sabe resolver fácil</strong> — e
          só depois a ferramenta aparece, porque você sentiu a falta dela
          primeiro. Bisseção não abre em ε e tolerância. Abre na pergunta{' '}
          <em>"como achar uma raiz quando não dá pra isolar o x?"</em>.
          Black-Scholes não abre na PDE. Abre em{' '}
          <em>"como saber quanto vale uma opção que ainda não venceu?"</em>.
        </p>

        <p>
          Toda equação aqui tem <strong>6 portas</strong>. Uma é a
          derivação formal completa, com todo o rigor que um professor de
          federal exige. As outras cinco são versões pra criança de 5, 10,
          jovem de 15, estudante de 25, profissional de 40. Todas certas.
          Todas conectadas. <strong>Você escolhe a porta — e troca de porta
          quando quiser</strong>.
        </p>

        <p>
          Aqui você <strong>prevê antes de ver</strong>. Erra, recebe
          correção, tenta de novo, e aí entende. Como se aprende uma língua
          morando na Espanha, não na sala de aula. Como se aprende a
          programar quebrando código, não lendo manual. A correção vem em
          loop curto, e a recompensa vem <em>depois</em> do esforço — nunca
          antes. Sem distintivo, sem pontos, sem ofuscação.
        </p>

        <p>
          Aqui não tem paywall. Não tem login. Não tem trial de 7 dias. Não
          tem "assine o premium pra ver os passos".{' '}
          <strong>Open source pra sempre, gratuito pra sempre</strong>,
          código aberto no GitHub, conteúdo aberto pra qualquer professor
          remixar, traduzir, adaptar.
        </p>

        <p>
          Não estamos competindo com a Khan Academy.{' '}
          <strong>Khan ensina conta. Estamos competindo com o silêncio</strong> —
          o silêncio entre saber a fórmula e entender o que ela diz sobre o
          mundo. Esse silêncio é o que faz aluno bom no ensino médio
          reprovar em Cálculo na faculdade. É o que faz mestre em Finanças
          não conseguir derivar Black-Scholes mesmo tendo tirado A na
          cadeira.
        </p>

        <p className="!mb-2 text-2xl font-bold text-clube-teal-deep">
          A matemática não é difícil. <span className="text-clube-clay">Está mal contada.</span>
        </p>
        <p className="!mt-2 text-2xl font-bold text-clube-teal">
          A gente conta direito.
        </p>

        <hr className="!my-10" />

        <p className="text-clube-mist">
          Você vai aprender matemática <em>maluco</em>. Esse é o trato.
        </p>
      </div>
    </article>
  )
}
