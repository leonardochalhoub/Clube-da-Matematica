/**
 * LOCALIZAÇÃO: app/engenharia/page.tsx
 *
 * Arquitetura do projeto: sem [locale] como segmento de rota.
 * O locale é resolvido via hook useLocale() no client ou via
 * helper de tradução no server (igual às outras páginas como /financas).
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { PROGRAMA_ENG, type DisciplinaEngData } from '@/content/programa-engenharia'

// Metadata estática em PT-BR (padrão do projeto)
export const metadata: Metadata = {
  title: 'Engenharia — Cálculo 1 a 4',
  description:
    'Cálculo 1, 2, 3 e 4 com rigor USP/ITA — limites, derivadas, integrais, EDOs, ' +
    'transformadas de Laplace e cálculo vetorial. Open source, gratuito, exercícios de fontes reais.',
}

// ─── Cartão de cada disciplina ────────────────────────────────────────────────

function DisciplinaCard({ disc }: { disc: DisciplinaEngData }) {
  const totalLicoes = disc.unidades.reduce((s, u) => s + u.licoes.length, 0)
  const licoesPub = disc.unidades
    .flatMap((u) => u.licoes)
    .filter((l) => !!l.slug).length
  const pct = Math.round((licoesPub / totalLicoes) * 100)

  // Cor de destaque por disciplina
  const corMap: Record<string, string> = {
    'calculo-1': 'bg-clube-teal/10 text-clube-teal border-clube-teal/20',
    'calculo-2': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'calculo-3': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    'calculo-4': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  }
  const cor = corMap[disc.id] ?? corMap['calculo-1']

  return (
    <article className="group flex flex-col rounded-2xl border border-clube-mist-soft/40 bg-clube-surface p-6 transition-all hover:border-clube-teal/40 hover:shadow-md">

      {/* Badge + carga horária */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className={`rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${cor}`}>
          {disc.id.replace('-', ' ').toUpperCase()}
        </span>
        <span className="text-xs text-clube-mist">
          {disc.cargaHoraria}h/semestre
        </span>
      </div>

      {/* Título e resumo */}
      <h2 className="mb-2 text-lg font-bold text-clube-ink group-hover:text-clube-teal-deep transition-colors leading-snug">
        {disc.titulo}
      </h2>
      <p className="mb-4 line-clamp-3 text-sm text-clube-mist leading-relaxed flex-1">
        {disc.resumo}
      </p>

      {/* Equivalência */}
      <p className="mb-4 rounded-lg bg-clube-cream-soft px-3 py-2 text-xs text-clube-mist">
        <span className="font-semibold text-clube-ink/70">Equivalência: </span>
        {disc.equivalencia}
      </p>

      {/* Progresso */}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-clube-mist">
          <span>{licoesPub}/{totalLicoes} lições publicadas</span>
          <span>{disc.unidades.length} unidades</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-clube-mist-soft/40">
          <div
            className="h-full rounded-full bg-clube-teal transition-all"
            style={{ width: `${Math.max(2, pct)}%` }}
          />
        </div>
      </div>

      {/* Unidades — preview */}
      <ol className="mb-5 space-y-1.5">
        {disc.unidades.map((unid) => {
          const pub = unid.licoes.filter((l) => !!l.slug).length
          return (
            <li
              key={unid.num}
              className="flex items-center gap-2 rounded-lg border border-clube-mist-soft/20 bg-clube-cream px-3 py-1.5 text-xs"
            >
              <span className="min-w-[1.25rem] rounded-full bg-clube-teal/10 px-1 py-0.5 text-center font-bold text-clube-teal">
                {unid.num}
              </span>
              <span className="flex-1 truncate font-medium text-clube-ink">
                {/* Pega só o subtítulo após o "—" */}
                {unid.titulo.includes('—')
                  ? unid.titulo.split('—').slice(1).join('—').trim()
                  : unid.titulo}
              </span>
              <span className="text-clube-mist">{pub}/{unid.licoes.length}</span>
            </li>
          )
        })}
      </ol>

      {/* CTA */}
      <Link
        href={`/engenharia/${disc.id}`}
        className="mt-auto block w-full rounded-xl bg-clube-teal px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-clube-teal-deep hover:no-underline"
      >
        Acessar {disc.titulo.split('—')[0]?.trim() ?? disc.titulo} →
      </Link>
    </article>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function EngenhariaPage() {
  return (
    <main className="container-clube py-12 md:py-20">

      {/* Hero */}
      <header className="mb-14 max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-clube-teal">
          Programa de Engenharia
        </p>
        <h1 className="mb-4 font-sans text-4xl font-bold leading-tight text-clube-ink md:text-5xl">
          Engenharia
        </h1>
        <p className="text-lg text-clube-ink/70 leading-relaxed">
          Cálculo 1 a 4 com rigor de engenharia — exercícios extraídos de Stewart,
          Guidorizzi, Apostol, Active Calculus e REAMAT. Cada lição segue o template
          das 7 portas.
        </p>
      </header>

      {/* Pré-requisito */}
      <div className="mb-12 rounded-2xl border border-amber-300/40 bg-amber-50/50 dark:bg-amber-900/10 px-5 py-4">
        <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
          Pré-requisito
        </p>
        <p className="mt-1 text-sm text-clube-ink/70">
          Ensino Médio completo (Anos 1–3). Em particular: limites (Lições 41–50),
          derivadas (51–60) e integral (81–90).{' '}
          <Link href="/ensino-medio" className="text-clube-teal hover:underline">
            Ir para o Ensino Médio →
          </Link>
        </p>
      </div>

      {/* Grid de disciplinas */}
      <section className="mb-20">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {PROGRAMA_ENG.map((disc) => (
            <DisciplinaCard key={disc.id} disc={disc} />
          ))}
        </div>
      </section>

      {/* Referências */}
      <section className="rounded-2xl border border-clube-mist-soft/40 bg-clube-surface px-6 py-8">
        <h2 className="mb-5 text-xl font-bold text-clube-ink">
          Referências bibliográficas
        </h2>
        <div className="grid gap-2 text-sm text-clube-ink/70 sm:grid-cols-2">
          {[
            { short: 'Stewart', full: 'Stewart, J. — Cálculo I e II. Cengage, 8ª ed. (2016).' },
            { short: 'Guidorizzi', full: 'Guidorizzi, H. L. — Um Curso de Cálculo (vols. 1–4). LTC, 5ª ed.' },
            { short: 'Apostol', full: 'Apostol, T. — Calculus I e II. Wiley, 2ª ed. (1967).' },
            { short: 'Active Calculus', full: 'Boelkins, M. — Active Calculus. CC-BY-NC-SA. (2024).' },
            { short: 'OpenStax Calc I/II/III', full: 'OpenStax — Calculus vols. I, II, III. CC-BY 4.0.' },
            { short: 'REAMAT', full: 'USP — Recursos Educacionais Abertos de Matemática. CC-BY-SA.' },
            { short: 'Boyce & DiPrima', full: 'Boyce & DiPrima — Elementary Differential Equations. Wiley, 11ª ed.' },
            { short: 'Burden & Faires', full: 'Burden & Faires — Análise Numérica. Cengage, 8ª ed.' },
          ].map(({ short, full }) => (
            <p key={short} className="rounded-lg bg-clube-cream-soft px-3 py-2">
              <span className="font-semibold text-clube-ink">{short}:</span> {full}
            </p>
          ))}
        </div>
      </section>

    </main>
  )
}
