import ManifestoContent from './ManifestoContent'
import { buildSectionMetadata } from '@/lib/seo/metadata'

export const metadata = buildSectionMetadata({
  path: 'manifesto',
  locale: 'pt-BR',
  titulo: 'Manifesto',
  descricao:
    'O que o Clube da Matemática acredita. Por que existe. Para quem existe. Rigor, gratuidade e acessibilidade como princípios.',
})

export default function ManifestoPage() {
  return <ManifestoContent />
}
