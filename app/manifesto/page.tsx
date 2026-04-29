import type { Metadata } from 'next'
import Link from 'next/link'

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

        <h2 className="!mt-12">Nosso primeiro objetivo: Ensino Médio brasileiro otimizado</h2>

        <p>
          A maior dor do sistema educacional brasileiro está no{' '}
          <strong>ensino médio</strong>. É onde aluno bom desiste de matemática,
          é onde aluno mediano reprova em Cálculo I na faculdade no semestre
          seguinte, é onde a curiosidade vira trauma. Por isso nosso{' '}
          <strong>primeiro objetivo é construir um currículo otimizado de
          matemática para o ensino médio brasileiro</strong> — 12 trimestres,
          120 aulas, calibrado pelos modelos de{' '}
          <strong>Japão</strong> (Math I/II/III), <strong>Alemanha</strong>{' '}
          (Klasse 10/11/12 Leistungskurs) e <strong>Singapura</strong> (Sec 4
          + JC H2 Math) — os três sistemas que mais consistentemente formam
          alunos prontos para engenharia de fronteira.
        </p>

        <p>
          Não é tradução de livro estrangeiro. É <strong>currículo brasileiro
          calibrado pelos melhores do mundo</strong>: nomenclatura BNCC,
          exemplos com PETR4, IBOVESPA, ENEM, ITA, IME, Olimpíada Brasileira de
          Matemática. Cada aula traz <strong>40 a 80 exercícios</strong> no
          estilo de engenharia mecânica brasileira (USP, ITA, Poli) — 25%
          gabaritados em desenvolvimento formal, o restante com resposta para
          conferência. Sem afrouxamento.
        </p>

        <h3 className="!mt-8 !mb-3">Documentos oficiais usados como referência</h3>
        <p>
          Todos os links abaixo apontam para os documentos oficiais
          disponibilizados pelos respectivos ministérios. Você pode clicar e
          consultar diretamente:
        </p>
        <ul>
          <li>
            <strong>🇯🇵 Japão — MEXT (Ministry of Education):</strong>{' '}
            <a
              href="https://www.mext.go.jp/a_menu/shotou/new-cs/youryou/eiyaku/__icsFiles/afieldfile/2019/03/28/1407196_22_1_1_2.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Course of Study for Senior High School (em inglês oficial, 2018, PDF)
            </a>{' '}
            — currículo nacional vigente, com Math I/II/III + Math A/B/C
            detalhados.
          </li>
          <li>
            <strong>🇩🇪 Alemanha — KMK (Conferência Permanente dos Ministros):</strong>{' '}
            <a
              href="https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2012/2012_10_18-Bildungsstandards-Mathe-Abi.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bildungsstandards im Fach Mathematik für die Allgemeine Hochschulreife (Abitur, 2012, PDF)
            </a>{' '}
            — padrão nacional para o Abitur (Klasse 11–12 LK), referência
            usada nas Aulas de cálculo e álgebra linear.
          </li>
          <li>
            <strong>🇸🇬 Singapura — MOE (Ministry of Education):</strong>{' '}
            <a
              href="https://www.moe.gov.sg/-/media/files/secondary/syllabuses/maths/2020-express_na-maths_syllabuses.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              O-Level Mathematics Syllabus (Express/E-Math, 2020, PDF)
            </a>{' '}
            +{' '}
            <a
              href="https://www.moe.gov.sg/-/media/files/post-secondary/2025-pre-u-h2-math.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              H2 Mathematics (JC1/JC2, 2025, PDF)
            </a>{' '}
            — referências para Trim 1-4 e para o Cálculo do Ano 2-3.
          </li>
          <li>
            <strong>🇧🇷 Brasil — MEC/CONSED (BNCC):</strong>{' '}
            <a
              href="http://basenacionalcomum.mec.gov.br/images/historico/BNCC_EnsinoMedio_embaixa_site_110518.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Base Nacional Comum Curricular — Ensino Médio (PDF)
            </a>{' '}
            — base de comparação e calibração para o público brasileiro.
          </li>
        </ul>
        <p className="!mt-3">
          Carga horária comparada:{' '}
          <strong>JP ~140h/ano</strong>,{' '}
          <strong>DE Klasse 10 LK ~120h/ano</strong>,{' '}
          <strong>SG E-Math ~135h/ano</strong>. Nosso programa: 12 trimestres ×
          ~30h ≈ <strong>360h totais</strong> (3 anos), compatível com a média
          dos três sistemas.
        </p>

        <h2 className="!mt-12">Como o site cresce a partir daqui</h2>

        <p>
          Depois do ensino médio bem servido, vem o resto. Em ordem:
        </p>

        <ol>
          <li>
            <strong>Hoje (em construção)</strong> ·{' '}
            <Link href="/ensino-medio" className="text-clube-teal">
              Ensino Médio Otimizado
            </Link>{' '}
            · 12 trimestres × 10 aulas. Matemática completa: cálculo, álgebra,
            geometria analítica, trigonometria, vetores, matrizes, combinatória,
            probabilidade, estatística, álgebra linear introdutória.
          </li>
          <li>
            <strong>Próximo passo (futuro próximo)</strong> · <em>Física do
            ensino médio</em> · mesma metodologia, mesmas 6+1 portas.
            Cinemática, dinâmica, eletromagnetismo, ondas, óptica, termodinâmica
            — conectando matemática com aplicação concreta.
          </li>
          <li>
            <strong>Visão de longo prazo</strong> · <em>Faculdade de
            Engenharia</em> · disciplinas das engenharias mecânica, elétrica,
            civil, naval. Continuação natural para quem cursou a base. Cálculo
            I-IV, EDOs, Mecânica dos Sólidos, Sinais e Sistemas, Termodinâmica
            Aplicada — sem o silêncio que tantos sentem em sala de aula.
          </li>
        </ol>

        <p>
          Além disso, mantemos uma <Link href="/financas" className="text-clube-teal">
          seção de Finanças Quantitativas</Link> — Black-Scholes em destaque —
          como demonstração viva de que a matemática que vamos ensinar é{' '}
          <strong>a mesma</strong> que opera mesa de derivativos em São Paulo,
          Tóquio e Londres. Não é teoria descolada. É a régua do mundo.
        </p>

        <h2 className="!mt-12">Como cada aula é construída</h2>

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
          quando quiser</strong>. Toda equação central tem ainda um botão{' '}
          <strong>"Ler em voz alta"</strong> em PT-BR — acessibilidade
          embutida, não enxertada.
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
