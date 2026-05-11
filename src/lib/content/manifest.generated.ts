/**
 * GERADO AUTOMATICAMENTE por scripts/generate-manifest.ts
 * Não edite à mão — rode: pnpm tsx scripts/generate-manifest.ts
 *
 * Modo: dev/single (allowlist gated)
 *
 * Cada path mapeia (locale → import dinâmico do MDX).
 * Usar via carregarMdxLocalizado(caminho, locale) em manifest.ts.
 */
import type { ComponentType } from 'react'

type MdxLoader = () => Promise<{ default: ComponentType }>

export const manifestoI18n: Record<string, Partial<Record<string, MdxLoader>>> = {
  'calculo-1/derivadas/o-que-e-derivada': {
    'pt-BR': () => import('@/../content/calculo-1/derivadas/o-que-e-derivada.mdx'),
  },
  'engenharia/calculo-1/unidade-1/cal1-u1-l02-limite-epsilon-delta': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-1/cal1-u1-l02-limite-epsilon-delta.mdx'),
  },
  'financas-quantitativas/opcoes/black-scholes': {
    'pt-BR': () => import('@/../content/financas-quantitativas/opcoes/black-scholes.mdx'),
  },
  'metodos-numericos/zero-de-funcoes/bissecao': {
    'pt-BR': () => import('@/../content/metodos-numericos/zero-de-funcoes/bissecao.mdx'),
  },
  'metodos-numericos/zero-de-funcoes/newton-raphson': {
    'pt-BR': () => import('@/../content/metodos-numericos/zero-de-funcoes/newton-raphson.mdx'),
  },
}
