import type { Metadata } from 'next'
import VideosContent from './VideosContent'

export const metadata: Metadata = {
  title: 'Vídeos públicos curados',
  description:
    'Playlists do YouTube curadas para apoiar o programa do Clube da Matemática — em português, inglês, e outros idiomas. Tudo gratuito.',
}

export default function VideosPage() {
  return <VideosContent />
}
