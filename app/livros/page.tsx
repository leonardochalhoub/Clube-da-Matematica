import type { Metadata } from 'next'
import LivrosContent from './LivrosContent'

export const metadata: Metadata = {
  title: 'Fontes Públicas',
  description:
    'Catálogo curado de livros de matemática gratuitos e legais — Active Calculus, OpenStax, Wikilivros (PT-BR), Stitz-Zeager, Lebl, Axler, Hammack, REAMAT, Battaia (IT), Kyoto Calculus (JP) e mais. Todos com licença aberta ou disponibilização gratuita oficial.',
}

export default function LivrosPage() {
  return <LivrosContent />
}
