import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { carregarTodosConteudos, carregarPorSlug } from '@/lib/content/loader'
import { carregarMdx } from '@/lib/content/manifest'
import { CATEGORIAS_LABEL } from '@/content/schema'

interface Props {
  params: Promise<{ categoria: string; subcategoria: string; slug: string }>
}

export function generateStaticParams() {
  return carregarTodosConteudos().map(({ meta, caminho }) => {
    const partes = caminho.split('/')
    return {
      categoria: partes[0]!,
      subcategoria: partes[1]!,
      slug: meta.slug,
    }
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const conteudo = carregarPorSlug(slug)
  if (!conteudo) return { title: 'Não encontrado' }
  return {
    title: conteudo.meta.titulo,
    description: conteudo.meta.descricao,
  }
}

export default async function ConteudoPage({ params }: Props) {
  const { categoria, subcategoria, slug } = await params
  const conteudo = carregarPorSlug(slug)
  if (!conteudo) notFound()

  const partes = conteudo.caminho.split('/')
  if (partes[0] !== categoria || partes[1] !== subcategoria) notFound()

  // Importa o MDX via manifesto estático (build-time)
  const mod = await carregarMdx(`${categoria}/${subcategoria}/${slug}`)
  if (!mod) notFound()
  const MDXContent = mod.default

  return (
    <article className="container-clube max-w-prose-wide py-12 sm:py-16">
      {/* Breadcrumb */}
      <nav aria-label="Navegação" className="mb-6 text-sm text-clube-mist">
        <Link href="/" className="hover:text-clube-teal">
          Início
        </Link>
        <span className="mx-2">/</span>
        <Link href="/conteudos" className="hover:text-clube-teal">
          Conteúdos
        </Link>
        <span className="mx-2">/</span>
        <span className="text-clube-ink/70">
          {CATEGORIAS_LABEL[conteudo.meta.categoria]}
        </span>
      </nav>

      {/* Header */}
      <header className="mb-10 border-b border-clube-mist-soft/40 pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
          {CATEGORIAS_LABEL[conteudo.meta.categoria]}
        </p>
        <h1 className="text-hero font-extrabold leading-tight text-clube-teal-deep">
          {conteudo.meta.titulo}
        </h1>
        <p className="mt-3 text-lg text-clube-mist">{conteudo.meta.descricao}</p>
        {conteudo.meta.usadoEm.length > 0 && (
          <p className="mt-4 text-sm text-clube-mist">
            <span className="font-semibold text-clube-ink/70">Usado em:</span>{' '}
            {conteudo.meta.usadoEm.join(' · ')}
          </p>
        )}
      </header>

      {/* Conteúdo MDX renderizado */}
      <div className="prose prose-clube max-w-none">
        <MDXContent />
      </div>

      {/* Rodapé editorial */}
      <footer className="mt-16 border-t border-clube-mist-soft/40 pt-6 text-sm text-clube-mist">
        <p>
          Atualizado em {conteudo.meta.atualizadoEm} · Autor(es):{' '}
          {conteudo.meta.autores.join(', ')}
        </p>
        <p className="mt-2">
          Achou um erro?{' '}
          <a
            href="https://github.com/leonardochalhoub/Clube-da-Matematica/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-clube-teal"
          >
            Abra uma issue no GitHub
          </a>{' '}
          ou submeta um PR — open source pra sempre.
        </p>
      </footer>
    </article>
  )
}
