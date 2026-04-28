/**
 * Manifesto estático de todos os conteúdos MDX do projeto.
 *
 * Mapeia caminhos relativos em `content/` para componentes MDX importados
 * dinamicamente. Necessário porque dynamic import com template string em
 * Next.js força webpack a bundlear TODOS os arquivos matching, esgotando
 * memória em projetos com muitos MDX e KaTeX.
 *
 * Quando adicionar um novo conteúdo, registre-o aqui.
 */

import type { ComponentType } from 'react'

type MdxLoader = () => Promise<{ default: ComponentType }>

export const manifesto: Record<string, MdxLoader> = {
  'metodos-numericos/zero-de-funcoes/bissecao': () =>
    import('@/../content/metodos-numericos/zero-de-funcoes/bissecao.mdx'),
  'metodos-numericos/zero-de-funcoes/newton-raphson': () =>
    import('@/../content/metodos-numericos/zero-de-funcoes/newton-raphson.mdx'),
  'financas-quantitativas/opcoes/black-scholes': () =>
    import('@/../content/financas-quantitativas/opcoes/black-scholes.mdx'),
  'calculo-1/derivadas/o-que-e-derivada': () =>
    import('@/../content/calculo-1/derivadas/o-que-e-derivada.mdx'),
}

export async function carregarMdx(caminho: string) {
  const loader = manifesto[caminho]
  if (!loader) return null
  return loader()
}
