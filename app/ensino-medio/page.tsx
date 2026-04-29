import type { Metadata } from 'next'
import Link from 'next/link'
import { carregarTodosConteudos } from '@/lib/content/loader'
import { PROGRAMA_EM } from '@/content/programa-em'

export const metadata: Metadata = {
  title: 'Ensino Médio',
  description:
    'Ensino Médio brasileiro otimizado — 12 trimestres, 120 aulas, calibrado pelos currículos oficiais de Japão, Alemanha e Singapura.',
}

export default function EnsinoMedioPage() {
  const todos = carregarTodosConteudos()
  const aulasPublicadas = new Set(
    todos.filter((c) => c.meta.categoria === 'aulas').map((c) => c.meta.slug),
  )

  const totalAulas = PROGRAMA_EM.reduce(
    (acc, ano) => acc + ano.trimestres.reduce((a, t) => a + t.aulas.length, 0),
    0,
  )

  function publicadasNoAno(anoNum: number): number {
    let n = 0
    const ano = PROGRAMA_EM.find((a) => a.num === anoNum)
    if (!ano) return 0
    for (const t of ano.trimestres)
      for (const a of t.aulas) if (a.slug && aulasPublicadas.has(a.slug)) n += 1
    return n
  }

  return (
    <article className="container-clube max-w-5xl py-12 sm:py-16">
      <header className="mb-12">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
          Programa de Ensino
        </p>
        <h1 className="text-display font-extrabold text-clube-teal-deep">
          Ensino Médio Otimizado
        </h1>
        <p className="mt-6 max-w-prose text-lg leading-relaxed text-clube-mist">
          <strong>3 anos · 12 trimestres · 120 aulas</strong>. Currículo
          brasileiro calibrado pelos sistemas que mais consistentemente formam
          alunos prontos para engenharia de fronteira:{' '}
          <strong>Japão</strong> (Math I/II/III),{' '}
          <strong>Alemanha</strong> (Klasse 10/11/12 Leistungskurs) e{' '}
          <strong>Singapura</strong> (Sec 4 + JC 1/2 H2 Math).
        </p>
        <p className="mt-4 max-w-prose text-base text-clube-mist/85">
          Cada aula traz <strong>40-80 exercícios</strong> no estilo de
          engenharia mecânica brasileira, com <strong>25% gabaritados</strong>{' '}
          em desenvolvimento formal. Cada equação central tem botão{' '}
          <strong>"Ler em voz alta"</strong> — acessibilidade nativa.
        </p>
      </header>

      <section className="mb-12 grid gap-4 sm:grid-cols-3">
        <div className="card-clube text-center">
          <div className="text-3xl font-extrabold text-clube-teal-deep">
            {totalAulas}
          </div>
          <div className="mt-1 text-sm text-clube-mist">aulas planejadas</div>
        </div>
        <div className="card-clube text-center">
          <div className="text-3xl font-extrabold text-clube-leaf">
            {aulasPublicadas.size}
          </div>
          <div className="mt-1 text-sm text-clube-mist">aulas publicadas</div>
        </div>
        <div className="card-clube text-center">
          <div className="text-3xl font-extrabold text-clube-gold-deep">~6.000</div>
          <div className="mt-1 text-sm text-clube-mist">
            exercícios totais (~50/aula)
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {PROGRAMA_EM.map((ano) => {
          const publicadas = publicadasNoAno(ano.num)
          const total = ano.trimestres.reduce(
            (a, t) => a + t.aulas.length,
            0,
          )
          const percent = Math.round((publicadas / total) * 100)
          return (
            <Link
              key={ano.num}
              href={`/ensino-medio/ano-${ano.num}/`}
              className="card-clube group flex flex-col gap-3 no-underline hover:no-underline"
            >
              <div className="flex items-baseline justify-between">
                <span className="rounded-full bg-clube-cream-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-clube-teal">
                  Ano {ano.num}
                </span>
                <span className="text-xs text-clube-mist">{ano.idade}</span>
              </div>
              <h2 className="text-2xl font-extrabold leading-tight text-clube-teal-deep group-hover:text-clube-teal">
                {ano.titulo}
              </h2>
              <p className="text-sm leading-relaxed text-clube-mist">
                {ano.resumo}
              </p>
              <div className="mt-auto pt-3 text-xs text-clube-mist/80">
                <div>
                  <strong>{publicadas}</strong> de {total} aulas publicadas
                  {' '}({percent}%)
                </div>
                <div className="mt-1 italic">{ano.equivalencia}</div>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-clube-teal group-hover:text-clube-teal-deep">
                Abrir plano de ensino do Ano {ano.num} →
              </div>
            </Link>
          )
        })}
      </section>

      <section className="mt-14 rounded-2xl border-l-4 border-clube-teal bg-clube-cream-soft p-6">
        <h2 className="text-lg font-bold text-clube-teal-deep">
          Filosofia pedagógica
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-clube-ink/85">
          <li>
            <strong>Bruner — espiral</strong>: cada conceito revisitado em
            níveis crescentes (taxa de variação aos 15, derivada aos 16,
            operador linear aos 17).
          </li>
          <li>
            <strong>Vygotsky — ZPD</strong>: scaffolding declarado em cada aula.
            Tarefa difícil + suporte calibrado.
          </li>
          <li>
            <strong>Singapura — CPA</strong>: concrete → pictorial → abstract em
            todo conceito novo.
          </li>
          <li>
            <strong>Japão — fewer concepts, greater detail</strong>: tópicos
            esgotados antes de avançar.
          </li>
          <li>
            <strong>Alemanha LK</strong>: pelo menos uma demonstração formal por
            trimestre, calibrada à idade.
          </li>
          <li>
            <strong>Brasil — porta 15 explícita</strong>: vocabulário e exemplos
            brasileiros (BNCC, ENEM, real). Não tradução de livro estrangeiro.
          </li>
        </ul>
      </section>

      <footer className="mt-12 rounded-2xl bg-clube-cream-soft p-6 text-sm text-clube-mist">
        <h3 className="text-base font-bold text-clube-teal-deep">Como contribuir</h3>
        <p className="mt-2">
          Aulas são arquivos MDX em <code>content/aulas/ano-N/trim-T/aula-NN.mdx</code>.
          Cada aula segue o template canônico (6+1 portas: formal/5/10/15/25/40/prática)
          com lista de exercícios usando <code>&lt;ListaExercicios seed=&quot;aula-NN&quot;&gt;</code>{' '}
          para gabarito determinístico de 25%. Pull requests bem-vindos.
        </p>
      </footer>
    </article>
  )
}
