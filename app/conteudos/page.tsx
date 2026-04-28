import Link from 'next/link'
import type { Metadata } from 'next'
import { publicadosApenas } from '@/lib/content/loader'
import {
  CATEGORIAS_LABEL,
  CATEGORIAS_DESCRICAO,
  type Conteudo,
} from '@/content/schema'

export const metadata: Metadata = {
  title: 'Conteúdos',
  description:
    'Todos os conteúdos publicados — do Cálculo 1 a Black-Scholes, com 6 portas cada.',
}

export default function ConteudosPage() {
  const todos = publicadosApenas()
  const porCategoria = new Map<Conteudo['categoria'], typeof todos>()
  for (const c of todos) {
    const arr = porCategoria.get(c.meta.categoria) ?? []
    arr.push(c)
    porCategoria.set(c.meta.categoria, arr)
  }

  return (
    <div className="container-clube max-w-5xl py-16 sm:py-20">
      <header className="mb-12">
        <h1 className="text-display font-extrabold text-clube-teal-deep">
          Conteúdos
        </h1>
        <p className="mt-3 max-w-prose text-lg text-clube-mist">
          Tudo aqui é matemática que aparece nas grades de engenharia.
          Cada peça tem 6 portas — você escolhe a sua.
        </p>
      </header>

      {todos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-clube-mist-soft p-10 text-center text-clube-mist">
          Nenhum conteúdo publicado ainda.
        </div>
      ) : (
        <div className="space-y-12">
          {Array.from(porCategoria.entries()).map(([cat, items]) => (
            <section key={cat}>
              <header className="mb-5">
                <h2 className="text-2xl font-bold text-clube-teal-deep">
                  {CATEGORIAS_LABEL[cat]}
                </h2>
                <p className="mt-1 text-sm text-clube-mist">
                  {CATEGORIAS_DESCRICAO[cat]}
                </p>
              </header>
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map(({ meta, caminho }) => (
                  <Link
                    key={meta.slug}
                    href={`/${caminho}/`}
                    className="card-clube no-underline hover:no-underline"
                  >
                    <h3 className="text-lg font-semibold leading-snug text-clube-teal-deep">
                      {meta.titulo}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-clube-mist">
                      {meta.descricao}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
