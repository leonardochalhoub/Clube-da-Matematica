import type { Metadata } from 'next'
import ProvasContent from './ProvasContent'

export const metadata: Metadata = {
  title: 'Provas',
  description:
    'Banco de provas integradas — questões REAIS de OpenStax, Active Calculus e outros livros públicos. Cada questão tem fonte declarada + passo a passo profundo com o porquê.',
}

export default function ProvasPage() {
  return <ProvasContent />
}
