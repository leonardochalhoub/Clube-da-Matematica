'use client'

import { useEffect } from 'react'
import { trackVisitor } from '@/lib/analytics/visitor-tracker'

/**
 * Componente "fire-and-forget" que dispara o trackVisitor() uma vez por
 * sessão. Inclui-se no layout root pra rodar em todas páginas.
 */
export function VisitorTracker() {
  useEffect(() => {
    trackVisitor()
  }, [])
  return null
}
