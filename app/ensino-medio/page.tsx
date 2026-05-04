import type { Metadata } from 'next'
import { carregarTodosConteudos } from '@/lib/content/loader'
import {
  PROGRAMA_EM,
  HORAS_POR_TRIMESTRE,
  HORAS_POR_ANO,
  HORAS_TOTAIS,
} from '@/content/programa-em'
import { EnsinoMedioPageContent } from '@/components/layout/EnsinoMedioPageContent'

// Metadata em PT-BR (SSG). Conteúdo visível i18n via LocaleProvider client-side.
export const metadata: Metadata = {
  title: 'Ensino Médio',
  description:
    'Ensino Médio brasileiro otimizado — 12 trimestres, 120 lições, calibrado pelos currículos oficiais de Japão, Alemanha e Singapura.',
}

export default function EnsinoMedioPage() {
  const todos = carregarTodosConteudos()
  const aulasMdx = todos.filter((c) => c.meta.categoria === 'aulas')
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
