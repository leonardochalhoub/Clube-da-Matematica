import type { Metadata } from 'next'
import ManifestoContent from './ManifestoContent'

export const metadata: Metadata = {
  title: 'Manifesto',
  description:
    'O que o Clube da Matemática acredita. Por que existe. Para quem existe.',
}

export default function ManifestoPage() {
  return <ManifestoContent />
}
