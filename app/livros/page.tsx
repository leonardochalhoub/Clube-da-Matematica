import LivrosContent from './LivrosContent'
import { buildSectionMetadata } from '@/lib/seo/metadata'

export const metadata = buildSectionMetadata({
  path: 'livros',
  locale: 'pt-BR',
  titulo: 'Fontes Públicas',
  descricao:
    'Catálogo curado de livros de matemática gratuitos e legais — Active Calculus, OpenStax, Wikilivros (PT-BR), Stitz-Zeager, Lebl, Axler, Hammack, REAMAT, Battaia (IT), Kyoto Calculus (JP) e mais. Todos com licença aberta.',
})

export default function LivrosPage() {
  return <LivrosContent />
}
