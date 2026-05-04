import type { Metadata } from 'next'
import { MapaPageContent } from '@/components/layout/MapaPageContent'

// Metadata fica em PT-BR (SSG). Conteúdo visível i18n via LocaleProvider client-side.
export const metadata: Metadata = {
  title: 'Mapa de visitantes — Clube da Matemática',
  description:
    'Onde os leitores do Clube da Matemática estão no mundo. Anônimo, agregado, transparente.',
}

export default function MapaPage() {
  return <MapaPageContent />
}
