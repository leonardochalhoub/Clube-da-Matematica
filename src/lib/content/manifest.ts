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
  // Métodos numéricos
  'metodos-numericos/zero-de-funcoes/bissecao': () =>
    import('@/../content/metodos-numericos/zero-de-funcoes/bissecao.mdx'),
  'metodos-numericos/zero-de-funcoes/newton-raphson': () =>
    import('@/../content/metodos-numericos/zero-de-funcoes/newton-raphson.mdx'),

  // Finanças quantitativas
  'financas-quantitativas/opcoes/black-scholes': () =>
    import('@/../content/financas-quantitativas/opcoes/black-scholes.mdx'),

  // Cálculo 1 (legado, fora do programa EM mas mantido)
  'calculo-1/derivadas/o-que-e-derivada': () =>
    import('@/../content/calculo-1/derivadas/o-que-e-derivada.mdx'),

  // Aulas — Ano 1, Trimestre 1
  'aulas/ano-1/trim-1/aula-01-conjuntos-intervalos': () =>
    import('@/../content/aulas/ano-1/trim-1/aula-01-conjuntos-intervalos.mdx'),
  'aulas/ano-1/trim-1/aula-02-funcoes': () =>
    import('@/../content/aulas/ano-1/trim-1/aula-02-funcoes.mdx'),
  'aulas/ano-1/trim-1/aula-03-afim': () =>
    import('@/../content/aulas/ano-1/trim-1/aula-03-afim.mdx'),
  'aulas/ano-1/trim-1/aula-04-quadratica': () =>
    import('@/../content/aulas/ano-1/trim-1/aula-04-quadratica.mdx'),
  'aulas/ano-1/trim-1/aula-05-composicao-inversa': () =>
    import('@/../content/aulas/ano-1/trim-1/aula-05-composicao-inversa.mdx'),
  'aulas/ano-1/trim-1/aula-06-exponencial': () =>
    import('@/../content/aulas/ano-1/trim-1/aula-06-exponencial.mdx'),
  'aulas/ano-1/trim-1/aula-07-logaritmo': () =>
    import('@/../content/aulas/ano-1/trim-1/aula-07-logaritmo.mdx'),
  'aulas/ano-1/trim-1/aula-08-crescimento': () =>
    import('@/../content/aulas/ano-1/trim-1/aula-08-crescimento.mdx'),
  'aulas/ano-1/trim-1/aula-09-taxa-variacao': () =>
    import('@/../content/aulas/ano-1/trim-1/aula-09-taxa-variacao.mdx'),
  'aulas/ano-1/trim-1/aula-10-consolidacao-trim-1': () =>
    import('@/../content/aulas/ano-1/trim-1/aula-10-consolidacao-trim-1.mdx'),

  // Aulas — Ano 1, Trimestre 2
  'aulas/ano-1/trim-2/aula-11-trig-triangulo': () =>
    import('@/../content/aulas/ano-1/trim-2/aula-11-trig-triangulo.mdx'),
  'aulas/ano-1/trim-2/aula-12-circulo-trigonometrico': () =>
    import('@/../content/aulas/ano-1/trim-2/aula-12-circulo-trigonometrico.mdx'),
  'aulas/ano-1/trim-2/aula-13-funcoes-trigonometricas': () =>
    import('@/../content/aulas/ano-1/trim-2/aula-13-funcoes-trigonometricas.mdx'),
  'aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas': () =>
    import('@/../content/aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas.mdx'),
  'aulas/ano-1/trim-2/aula-15-leis-senos-cossenos': () =>
    import('@/../content/aulas/ano-1/trim-2/aula-15-leis-senos-cossenos.mdx'),
  'aulas/ano-1/trim-2/aula-16-sequencias': () =>
    import('@/../content/aulas/ano-1/trim-2/aula-16-sequencias.mdx'),
  'aulas/ano-1/trim-2/aula-17-pa': () =>
    import('@/../content/aulas/ano-1/trim-2/aula-17-pa.mdx'),
  'aulas/ano-1/trim-2/aula-18-pg': () =>
    import('@/../content/aulas/ano-1/trim-2/aula-18-pg.mdx'),
  'aulas/ano-1/trim-2/aula-19-limite-intuitivo': () =>
    import('@/../content/aulas/ano-1/trim-2/aula-19-limite-intuitivo.mdx'),
  'aulas/ano-1/trim-2/aula-20-consolidacao-trim-2': () =>
    import('@/../content/aulas/ano-1/trim-2/aula-20-consolidacao-trim-2.mdx'),
}

export async function carregarMdx(caminho: string) {
  const loader = manifesto[caminho]
  if (!loader) return null
  return loader()
}
