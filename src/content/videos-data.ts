/**
 * Curadoria de vídeos do YouTube para apoio ao programa.
 *
 * REGRA: vídeos públicos do YouTube. Quem curou: Leo Chalhoub.
 * Para adicionar, basta colar o link aqui — preferencialmente playlists
 * (URL com `list=...`) para o aluno consumir em sequência.
 */

export interface VideoLista {
  titulo: string
  canal: string
  idioma: 'PT-BR' | 'EN' | 'IT' | 'ES' | 'FR' | 'JP' | 'DE'
  url: string
  /** ID da playlist (extraído da URL `list=...`) ou null se for vídeo único. */
  playlistId: string | null
  /** ID do primeiro vídeo (para thumbnail). */
  videoId?: string | null
  descricao: string
  topicosCobertos: string[]
  /** Ano do EM ou trimestre coberto (referência aproximada). */
  cobertura: string
}

export const VIDEOS: VideoLista[] = [
  {
    titulo: '3Blue1Brown — Essence of Calculus',
    canal: '3Blue1Brown (Grant Sanderson)',
    idioma: 'EN',
    url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM&list=PL590CCC2BC5AF3BC1',
    playlistId: 'PL590CCC2BC5AF3BC1',
    videoId: 'WUvTyaaNkzM',
    descricao:
      'Série visual icônica que constrói intuição geométrica para limites, derivadas, integrais e teorema fundamental do cálculo. Essência mesmo — não é "como calcular", é "o que está acontecendo".',
    topicosCobertos: ['limites', 'derivada', 'integral', 'TFC', 'Taylor'],
    cobertura: 'Ano 2 — Trims 5-7 (Cálculo Diferencial)',
  },
  {
    titulo: 'Khan Academy — Brasil — Cálculo',
    canal: 'Khan Academy Brasil',
    idioma: 'PT-BR',
    url: 'https://www.youtube.com/playlist?list=PLo4jXE-LdDTSkmHd3xNGhcObfWXvpwmCL',
    playlistId: 'PLo4jXE-LdDTSkmHd3xNGhcObfWXvpwmCL',
    videoId: null,
    descricao:
      'Playlist em português brasileiro cobrindo cálculo diferencial e integral. Boa para alunos que preferem material em PT-BR.',
    topicosCobertos: ['limites', 'derivada', 'integral', 'aplicações'],
    cobertura: 'Ano 2-3 — Cálculo I e II',
  },
]

/** Extrai o ID da playlist da URL do YouTube. */
export function getPlaylistId(url: string): string | null {
  const match = url.match(/[?&]list=([^&]+)/)
  return match ? match[1]! : null
}

/** Constrói URL de embed para playlist. */
export function getEmbedUrl(playlistId: string): string {
  return `https://www.youtube.com/embed/videoseries?list=${playlistId}`
}

/** URL da thumbnail do primeiro vídeo da playlist (via API pública). */
export function getThumbnail(videoId: string | null | undefined): string | null {
  if (!videoId) return null
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}
