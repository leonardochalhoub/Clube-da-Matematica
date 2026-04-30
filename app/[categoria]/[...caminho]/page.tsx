import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  carregarTodosConteudos,
  carregarPorSlug,
} from '@/lib/content/loader'
import { carregarMdx } from '@/lib/content/manifest'
import { CATEGORIAS_LABEL } from '@/content/schema'

interface Props {
  params: Promise<{ categoria: string; caminho: string[] }>
}

export function generateStaticParams() {
  return carregarTodosConteudos().map(({ caminho }) => {
    const partes = caminho.split('/')
    const [categoria, ...rest] = partes
    return {
      categoria: categoria!,
      caminho: rest,
    }
  })
}

function caminhoCompleto(categoria: string, caminho: string[]): string {
  return [categoria, ...caminho].join('/')
}

function slugDoCaminho(caminho: string[]): string {
  return caminho[caminho.length - 1] ?? ''
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { caminho } = await params
  const slug = slugDoCaminho(caminho)
  const conteudo = carregarPorSlug(slug)
  if (!conteudo) return { title: 'Não encontrado' }
  return {
    title: conteudo.meta.titulo,
    description: conteudo.meta.descricao,
  }
}

export default async function ConteudoPage({ params }: Props) {
  const { categoria, caminho } = await params
  const completo = caminhoCompleto(categoria, caminho)
  const slug = slugDoCaminho(caminho)
  const conteudo = carregarPorSlug(slug)
  if (!conteudo || conteudo.caminho !== completo) notFound()

  const mod = await carregarMdx(completo)
  if (!mod) notFound()
  const MDXContent = mod.default

  // Para breadcrumb na seção certa
  const isAula = categoria === 'aulas'
  const isFinancas = categoria === 'financas-quantitativas'

  return (
    <article className="container-clube max-w-prose-wide py-12 sm:py-16">
      <nav aria-label="Navegação" className="mb-6 text-sm text-clube-mist">
        <Link href="/" className="hover:text-clube-teal">
          Início
        </Link>
        <span className="mx-2">/</span>
        {isAula ? (
          <Link href="/ensino-medio" className="hover:text-clube-teal">
            Ensino Médio
          </Link>
        ) : isFinancas ? (
          <Link href="/financas" className="hover:text-clube-teal">
            Finanças
          </Link>
        ) : (
          <span className="text-clube-ink/70">
            {CATEGORIAS_LABEL[conteudo.meta.categoria]}
          </span>
        )}
        <span className="mx-2">/</span>
        <span className="text-clube-ink/70">{conteudo.meta.titulo}</span>
      </nav>

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

      <div className="prose prose-clube max-w-none">
        {/* TODO: re-enable LocalizedMdx quando manifest tiver < 100 entries
            ou quando build for movido pra Vercel com mais RAM. Build CI
            (4GB heap) explodiu em OOM com 451 lazy imports. */}
        <MDXContent />
      </div>

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
