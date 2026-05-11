import { carregarTodosConteudos } from '@/lib/content/loader'
import {
  FinancasPageContent,
  type FinancasItem,
} from '@/components/layout/FinancasPageContent'
import { buildSectionMetadata } from '@/lib/seo/metadata'

// Metadata em PT-BR (SSG). Conteúdo visível i18n via LocaleProvider client-side.
export const metadata = buildSectionMetadata({
  path: 'financas',
  locale: 'pt-BR',
  titulo: 'Finanças Quantitativas',
  descricao:
    'Black-Scholes e a matemática que opera mesa de derivativos em São Paulo, Tóquio e Londres. Demonstração viva de para onde a matemática do Ensino Médio leva.',
})

export default function FinancasPage() {
  const todos = carregarTodosConteudos()
  const conteudos: FinancasItem[] = todos
    .filter((c) => c.meta.categoria === 'financas-quantitativas')
    .map(({ meta, caminho }) => ({
      slug: meta.slug,
      caminho,
      titulo: meta.titulo,
      descricao: meta.descricao,
      subcategoria: meta.subcategoria,
      usadoEm: meta.usadoEm,
    }))

  return <FinancasPageContent conteudos={conteudos} />
}
