import ProvasContent from './ProvasContent'
import { buildSectionMetadata } from '@/lib/seo/metadata'

export const metadata = buildSectionMetadata({
  path: 'provas',
  locale: 'pt-BR',
  titulo: 'Provas',
  descricao:
    'Banco de provas integradas — questões REAIS de OpenStax, Active Calculus e outros livros públicos. Cada questão tem fonte declarada + passo a passo profundo com o porquê.',
})

export default function ProvasPage() {
  return <ProvasContent />
}
