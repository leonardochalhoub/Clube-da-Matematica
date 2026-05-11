import { MapaPageContent } from '@/components/layout/MapaPageContent'
import { buildSectionMetadata } from '@/lib/seo/metadata'

// Metadata fica em PT-BR (SSG). Conteúdo visível i18n via LocaleProvider client-side.
export const metadata = buildSectionMetadata({
  path: 'mapa',
  locale: 'pt-BR',
  titulo: 'Mapa de visitantes',
  descricao:
    'Onde os leitores do Clube da Matemática estão no mundo. Anônimo, agregado, transparente.',
})

export default function MapaPage() {
  return <MapaPageContent />
}
