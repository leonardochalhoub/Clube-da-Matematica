import Link from 'next/link'
import { publicadosApenas, carregarTodosConteudos } from '@/lib/content/loader'
import { CATEGORIAS_LABEL } from '@/content/schema'
import { MainCounters } from '@/components/layout/MainCounters'
import { PROGRAMA_EM, HORAS_TOTAIS } from '@/content/programa-em'
import { PROVAS_REAIS, TOTAL_QUESTOES_REAIS } from '@/content/provas-data'
import {
  TOP_20,
  PRE_CALCULO,
  CALCULO,
  ALGEBRA_LINEAR,
  EDO_EDP,
  ANALISE,
  PROBABILIDADE,
  METODOS_NUMERICOS,
  LOGICA_PROVA,
  FISICA,
  PT_BR,
  CLASSICOS,
  MULTILINGUE,
  ML_CD,
} from '@/content/livros-data'
import { SearchDiscovery } from '@/components/layout/SearchDiscovery'
import { HomeHero } from '@/components/layout/HomeHero'

/** Conta exercícios em arquivos MDX via regex (extraído em build time). */
function contarExercicios(): number {
  // O loader já tem todos conteúdos parseados, mas não carrega o source bruto.
  // Aqui assumimos a contagem conhecida (atualizada manualmente quando adicionarmos):
  // Trim 1: 450, Trim 2: 365, Trim 3: 299, Trim 4: 310, Trim 5: 205,
  // Trim 6: 135, Trim 7: 152, Trim 8: 130, Trim 9: 190, Trim 10: 170,
  // Trim 11: 130, Trim 12: 170. Total ~2706.
  return 2706
}

/** Contagem total do catálogo de livros públicos curados em /livros. */
const LIVROS_NO_LEDGER =
  TOP_20.length + PRE_CALCULO.length + CALCULO.length + ALGEBRA_LINEAR.length +
  EDO_EDP.length + ANALISE.length + PROBABILIDADE.length + METODOS_NUMERICOS.length +
  LOGICA_PROVA.length + FISICA.length + PT_BR.length + CLASSICOS.length +
  MULTILINGUE.length + ML_CD.length

const TODOS_LIVROS = [
  ...TOP_20, ...PRE_CALCULO, ...CALCULO, ...ALGEBRA_LINEAR, ...EDO_EDP,
  ...ANALISE, ...PROBABILIDADE, ...METODOS_NUMERICOS, ...LOGICA_PROVA,
  ...FISICA, ...PT_BR, ...CLASSICOS, ...MULTILINGUE, ...ML_CD,
]

export default function HomePage() {
  const todos = carregarTodosConteudos()
  const aulasMdx = todos.filter((c) => c.meta.categoria === 'aulas')
  const licoesPublicadas = aulasMdx.length
  const licoesPlanejadas = PROGRAMA_EM.reduce(
    (acc, ano) => acc + ano.trimestres.reduce((a, t) => a + t.aulas.length, 0),
    0,
  )
  const slugToCaminho: Record<string, string> = {}
  for (const c of aulasMdx) slugToCaminho[c.meta.slug] = c.caminho

  return (
    <>
      <HomeHero />

      {/* Counters */}
      <MainCounters
        licoesPublicadas={licoesPublicadas}
        licoesPlanejadas={licoesPlanejadas}
        exerciciosTotal={contarExercicios()}
        questoesProvasReais={TOTAL_QUESTOES_REAIS}
        provasVersoes={PROVAS_REAIS.length}
        cargaHorariaH={HORAS_TOTAIS}
        livrosNoLedger={LIVROS_NO_LEDGER}
      />

      {/* Descoberta dinâmica — substitui antiga listagem estática */}
      <SearchDiscovery slugToCaminho={slugToCaminho} livros={TODOS_LIVROS} />

      {/* Filosofia */}
      <section className="border-y border-clube-mist-soft/30 bg-clube-cream-soft py-16">
        <div className="container-clube grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-clube-teal-deep">
              Não competimos com Khan
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-clube-ink/80">
              Khan ensina conta. A gente ensina <em>o que</em> a conta diz
              sobre o mundo. São produtos de naturezas diferentes.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-clube-teal-deep">
              6 portas em todo conteúdo
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-clube-ink/80">
              Formal, 5, 10, 15, 25, 40 — você escolhe a porta. Não importa
              se você reprovou em Cálculo ou ainda não viu derivada na
              escola. Toda equação central tem botão "Ler em voz alta".
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-clube-teal-deep">
              Caderno e dúzias de exercícios
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-clube-ink/80">
              Cada lição traz 40-80 exercícios extraídos dos melhores livros
              públicos (OpenStax, Active Calculus, Stitz-Zeager, livros do JP/DE/SG).
              Senta com o caderno e vai resolvendo. Sem milagre.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

function PdfIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 13h2a1.5 1.5 0 0 1 0 3H9zM9 17v-4" />
      <path d="M14 13v4M14 13h2.5" />
    </svg>
  )
}
