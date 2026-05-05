/**
 * GERADO AUTOMATICAMENTE por scripts/generate-manifest.ts
 * Não edite à mão — rode: pnpm tsx scripts/generate-manifest.ts
 *
 * Cada path mapeia (locale → import dinâmico do MDX).
 * Usar via carregarMdxLocalizado(caminho, locale) em manifest.ts.
 */
import type { ComponentType } from 'react'

type MdxLoader = () => Promise<{ default: ComponentType }>

export const manifestoI18n: Record<string, Partial<Record<string, MdxLoader>>> = {
  'aulas/ano-1/trim-1/licao-01-conjuntos-intervalos': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-01-conjuntos-intervalos.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/licao-01-conjuntos-intervalos.mdx'),
  },
  'aulas/ano-1/trim-1/licao-02-funcoes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-02-funcoes.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-1/licao-02-funcoes.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/licao-02-funcoes.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-1/licao-02-funcoes.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-1/licao-02-funcoes.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-1/licao-02-funcoes.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-1/licao-02-funcoes.mdx'),
    'ko-KR': () => import('@/../content/i18n/ko-KR/aulas/ano-1/trim-1/licao-02-funcoes.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-1/licao-02-funcoes.mdx'),
    'zh-CN': () => import('@/../content/i18n/zh-CN/aulas/ano-1/trim-1/licao-02-funcoes.mdx'),
  },
  'calculo-1/derivadas/o-que-e-derivada': {
    'pt-BR': () => import('@/../content/calculo-1/derivadas/o-que-e-derivada.mdx'),
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
