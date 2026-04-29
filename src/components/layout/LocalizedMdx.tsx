'use client'

import { useEffect, useState, type ComponentType } from 'react'
import { useLocale } from './LocaleProvider'
import { manifestoI18n } from '@/lib/content/manifest.generated'

interface LocalizedMdxProps {
  /** Caminho relativo do conteúdo (ex.: 'aulas/ano-1/trim-1/aula-01-conjuntos-intervalos') */
  caminho: string
  /** Componente PT-BR já renderizado (server-side, default). */
  fallback: React.ReactNode
}

/**
 * Renderiza o MDX no idioma ativo. Server SSR renderiza fallback (PT-BR) pra
 * estática + SEO. Client-side, após hidratação, busca a tradução do
 * `manifestoI18n` (lazy import) e substitui o conteúdo.
 *
 * Trade-off: pequeno "flash" de PT-BR antes do swap quando locale != pt-BR.
 * Solução pra eliminar: pre-renderizar 17 versões da página (1 por locale)
 * — que é pesado (124 × 17 = 2108 páginas no build).
 */
export function LocalizedMdx({ caminho, fallback }: LocalizedMdxProps) {
  const { locale } = useLocale()
  const [Componente, setComponente] = useState<ComponentType | null>(null)
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (locale === 'pt-BR') {
      // Usa fallback PT-BR (server-rendered)
      setComponente(null)
      return
    }
    const entry = manifestoI18n[caminho]
    const loader = entry?.[locale]
    if (!loader) {
      // Sem tradução pra esse locale → mantém PT-BR fallback
      setComponente(null)
      return
    }
    setCarregando(true)
    loader()
      .then((mod) => setComponente(() => mod.default))
      .catch(() => setComponente(null))
      .finally(() => setCarregando(false))
  }, [locale, caminho])

  if (Componente) {
    return <Componente />
  }
  if (carregando) {
    return (
      <div className="opacity-70">
        {fallback}
      </div>
    )
  }
  return <>{fallback}</>
}
