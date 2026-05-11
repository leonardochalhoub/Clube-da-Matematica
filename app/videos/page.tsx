import VideosContent from './VideosContent'
import { buildSectionMetadata } from '@/lib/seo/metadata'

export const metadata = buildSectionMetadata({
  path: 'videos',
  locale: 'pt-BR',
  titulo: 'Vídeos públicos curados',
  descricao:
    'Playlists do YouTube curadas para apoiar o programa do Clube da Matemática — em português, inglês, e outros idiomas. Tudo gratuito.',
})

export default function VideosPage() {
  return <VideosContent />
}
