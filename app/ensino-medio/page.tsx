import { carregarTodosConteudos } from '@/lib/content/loader'
import {
  PROGRAMA_EM,
  HORAS_POR_TRIMESTRE,
  HORAS_POR_ANO,
  HORAS_TOTAIS,
} from '@/content/programa-em'
import { EnsinoMedioPageContent } from '@/components/layout/EnsinoMedioPageContent'
import { buildSectionMetadata } from '@/lib/seo/metadata'

// Metadata em PT-BR (SSG). Conteúdo visível i18n via LocaleProvider client-side.
export const metadata = buildSectionMetadata({
  path: 'ensino-medio',
  locale: 'pt-BR',
  titulo: 'Ensino Médio',
  descricao:
    'Ensino Médio brasileiro otimizado — 12 trimestres, 120 lições, calibrado pelos currículos oficiais de Japão, Alemanha e Singapura. Equivalente a High School (US/UK), Bachillerato (ES/CO).',
})

export default function EnsinoMedioPage() {
  const todos = carregarTodosConteudos()
  // Only `publicado: true` lessons render as clickable links + count toward
  // the "published" totals. Unpublished lessons (publicado: false) appear
  // in the listing with a red "soon" badge instead.
  const aulasMdx = todos.filter(
    (c) => c.meta.categoria === 'aulas' && c.meta.publicado,
  )
  const aulasPublicadas = new Set(aulasMdx.map((c) => c.meta.slug))
  const slugToCaminho: Record<string, string> = {}
  for (const c of aulasMdx) slugToCaminho[c.meta.slug] = c.caminho

  const totalLicoes = PROGRAMA_EM.reduce(
    (acc, ano) => acc + ano.trimestres.reduce((a, t) => a + t.aulas.length, 0),
    0,
  )

  const publicadasPorAno: Record<number, number> = {}
  const totalPorAno: Record<number, number> = {}
  for (const ano of PROGRAMA_EM) {
    let publicadas = 0
    let total = 0
    for (const t of ano.trimestres) {
      for (const a of t.aulas) {
        total += 1
        if (a.slug && aulasPublicadas.has(a.slug)) publicadas += 1
      }
    }
    publicadasPorAno[ano.num] = publicadas
    totalPorAno[ano.num] = total
  }

  return (
    <EnsinoMedioPageContent
      programa={PROGRAMA_EM}
      totalLicoes={totalLicoes}
      totalPublicadas={aulasPublicadas.size}
      publicadasPorAno={publicadasPorAno}
      totalPorAno={totalPorAno}
      horasPorTrim={HORAS_POR_TRIMESTRE}
      horasPorAno={HORAS_POR_ANO}
      horasTotais={HORAS_TOTAIS}
      slugToCaminho={slugToCaminho}
    />
  )
}
