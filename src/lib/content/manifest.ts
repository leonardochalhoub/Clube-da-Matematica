/**
 * Manifesto estático de todos os conteúdos MDX do projeto.
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

  // Cálculo 1 (legado)
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

  // Aulas — Ano 1, Trimestre 3
  'aulas/ano-1/trim-3/aula-21-plano-cartesiano': () =>
    import('@/../content/aulas/ano-1/trim-3/aula-21-plano-cartesiano.mdx'),
  'aulas/ano-1/trim-3/aula-22-equacao-reta': () =>
    import('@/../content/aulas/ano-1/trim-3/aula-22-equacao-reta.mdx'),
  'aulas/ano-1/trim-3/aula-23-posicao-relativa-retas': () =>
    import('@/../content/aulas/ano-1/trim-3/aula-23-posicao-relativa-retas.mdx'),
  'aulas/ano-1/trim-3/aula-24-circunferencia': () =>
    import('@/../content/aulas/ano-1/trim-3/aula-24-circunferencia.mdx'),
  'aulas/ano-1/trim-3/aula-25-conicas': () =>
    import('@/../content/aulas/ano-1/trim-3/aula-25-conicas.mdx'),
  'aulas/ano-1/trim-3/aula-26-vetores-plano': () =>
    import('@/../content/aulas/ano-1/trim-3/aula-26-vetores-plano.mdx'),
  'aulas/ano-1/trim-3/aula-27-produto-escalar': () =>
    import('@/../content/aulas/ano-1/trim-3/aula-27-produto-escalar.mdx'),
  'aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica': () =>
    import('@/../content/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
  'aulas/ano-1/trim-3/aula-29-sistemas-lineares': () =>
    import('@/../content/aulas/ano-1/trim-3/aula-29-sistemas-lineares.mdx'),
  'aulas/ano-1/trim-3/aula-30-consolidacao-trim-3': () =>
    import('@/../content/aulas/ano-1/trim-3/aula-30-consolidacao-trim-3.mdx'),

  // Aulas — Ano 1, Trimestre 4
  'aulas/ano-1/trim-4/aula-31-matrizes': () =>
    import('@/../content/aulas/ano-1/trim-4/aula-31-matrizes.mdx'),
  'aulas/ano-1/trim-4/aula-32-operacoes-matrizes': () =>
    import('@/../content/aulas/ano-1/trim-4/aula-32-operacoes-matrizes.mdx'),
  'aulas/ano-1/trim-4/aula-33-transposta-inversa': () =>
    import('@/../content/aulas/ano-1/trim-4/aula-33-transposta-inversa.mdx'),
  'aulas/ano-1/trim-4/aula-34-determinantes': () =>
    import('@/../content/aulas/ano-1/trim-4/aula-34-determinantes.mdx'),
  'aulas/ano-1/trim-4/aula-35-sistemas-via-matrizes': () =>
    import('@/../content/aulas/ano-1/trim-4/aula-35-sistemas-via-matrizes.mdx'),
  'aulas/ano-1/trim-4/aula-36-pfc': () =>
    import('@/../content/aulas/ano-1/trim-4/aula-36-pfc.mdx'),
  'aulas/ano-1/trim-4/aula-37-permutacoes-arranjos': () =>
    import('@/../content/aulas/ano-1/trim-4/aula-37-permutacoes-arranjos.mdx'),
  'aulas/ano-1/trim-4/aula-38-combinacoes': () =>
    import('@/../content/aulas/ano-1/trim-4/aula-38-combinacoes.mdx'),
  'aulas/ano-1/trim-4/aula-39-probabilidade': () =>
    import('@/../content/aulas/ano-1/trim-4/aula-39-probabilidade.mdx'),
  'aulas/ano-1/trim-4/aula-40-consolidacao-anual': () =>
    import('@/../content/aulas/ano-1/trim-4/aula-40-consolidacao-anual.mdx'),

  // Aulas — Ano 2, Trimestre 5
  'aulas/ano-2/trim-5/aula-41-limite-formal': () =>
    import('@/../content/aulas/ano-2/trim-5/aula-41-limite-formal.mdx'),
  'aulas/ano-2/trim-5/aula-42-propriedades-limites': () =>
    import('@/../content/aulas/ano-2/trim-5/aula-42-propriedades-limites.mdx'),
  'aulas/ano-2/trim-5/aula-43-continuidade': () =>
    import('@/../content/aulas/ano-2/trim-5/aula-43-continuidade.mdx'),
  'aulas/ano-2/trim-5/aula-44-limites-laterais': () =>
    import('@/../content/aulas/ano-2/trim-5/aula-44-limites-laterais.mdx'),
  'aulas/ano-2/trim-5/aula-45-limites-fundamentais': () =>
    import('@/../content/aulas/ano-2/trim-5/aula-45-limites-fundamentais.mdx'),
  'aulas/ano-2/trim-5/aula-46-tvi-tvm': () =>
    import('@/../content/aulas/ano-2/trim-5/aula-46-tvi-tvm.mdx'),
  'aulas/ano-2/trim-5/aula-47-assintotas': () =>
    import('@/../content/aulas/ano-2/trim-5/aula-47-assintotas.mdx'),
  'aulas/ano-2/trim-5/aula-48-limites-funcoes-trig': () =>
    import('@/../content/aulas/ano-2/trim-5/aula-48-limites-funcoes-trig.mdx'),
  'aulas/ano-2/trim-5/aula-49-limite-sequencias': () =>
    import('@/../content/aulas/ano-2/trim-5/aula-49-limite-sequencias.mdx'),
  'aulas/ano-2/trim-5/aula-50-consolidacao-trim-5': () =>
    import('@/../content/aulas/ano-2/trim-5/aula-50-consolidacao-trim-5.mdx'),

  // Aulas — Ano 2, Trimestre 6
  'aulas/ano-2/trim-6/aula-51-derivada-definicao': () =>
    import('@/../content/aulas/ano-2/trim-6/aula-51-derivada-definicao.mdx'),
  'aulas/ano-2/trim-6/aula-52-regras-derivacao': () =>
    import('@/../content/aulas/ano-2/trim-6/aula-52-regras-derivacao.mdx'),
  'aulas/ano-2/trim-6/aula-53-regra-cadeia': () =>
    import('@/../content/aulas/ano-2/trim-6/aula-53-regra-cadeia.mdx'),
  'aulas/ano-2/trim-6/aula-54-derivadas-implicitas': () =>
    import('@/../content/aulas/ano-2/trim-6/aula-54-derivadas-implicitas.mdx'),
  'aulas/ano-2/trim-6/aula-55-derivadas-superiores': () =>
    import('@/../content/aulas/ano-2/trim-6/aula-55-derivadas-superiores.mdx'),
  'aulas/ano-2/trim-6/aula-56-derivadas-inversas': () =>
    import('@/../content/aulas/ano-2/trim-6/aula-56-derivadas-inversas.mdx'),
  'aulas/ano-2/trim-6/aula-57-aproximacao-linear': () =>
    import('@/../content/aulas/ano-2/trim-6/aula-57-aproximacao-linear.mdx'),
  'aulas/ano-2/trim-6/aula-58-taxas-relacionadas': () =>
    import('@/../content/aulas/ano-2/trim-6/aula-58-taxas-relacionadas.mdx'),
  'aulas/ano-2/trim-6/aula-59-diferenciabilidade': () =>
    import('@/../content/aulas/ano-2/trim-6/aula-59-diferenciabilidade.mdx'),
  'aulas/ano-2/trim-6/aula-60-consolidacao-trim-6': () =>
    import('@/../content/aulas/ano-2/trim-6/aula-60-consolidacao-trim-6.mdx'),

  // Aulas — Ano 2, Trimestre 7
  'aulas/ano-2/trim-7/aula-61-maximos-minimos': () =>
    import('@/../content/aulas/ano-2/trim-7/aula-61-maximos-minimos.mdx'),
  'aulas/ano-2/trim-7/aula-62-otimizacao': () =>
    import('@/../content/aulas/ano-2/trim-7/aula-62-otimizacao.mdx'),
  'aulas/ano-2/trim-7/aula-63-esboco-graficos': () =>
    import('@/../content/aulas/ano-2/trim-7/aula-63-esboco-graficos.mdx'),
  'aulas/ano-2/trim-7/aula-64-l-hopital': () =>
    import('@/../content/aulas/ano-2/trim-7/aula-64-l-hopital.mdx'),
  'aulas/ano-2/trim-7/aula-65-taylor': () =>
    import('@/../content/aulas/ano-2/trim-7/aula-65-taylor.mdx'),
  'aulas/ano-2/trim-7/aula-66-concavidade': () =>
    import('@/../content/aulas/ano-2/trim-7/aula-66-concavidade.mdx'),
  'aulas/ano-2/trim-7/aula-67-economia-derivadas': () =>
    import('@/../content/aulas/ano-2/trim-7/aula-67-economia-derivadas.mdx'),
  'aulas/ano-2/trim-7/aula-68-cinematica': () =>
    import('@/../content/aulas/ano-2/trim-7/aula-68-cinematica.mdx'),
  'aulas/ano-2/trim-7/aula-69-newton-raphson': () =>
    import('@/../content/aulas/ano-2/trim-7/aula-69-newton-raphson.mdx'),
  'aulas/ano-2/trim-7/aula-70-consolidacao-trim-7': () =>
    import('@/../content/aulas/ano-2/trim-7/aula-70-consolidacao-trim-7.mdx'),

  // Aulas — Ano 2, Trimestre 8
  'aulas/ano-2/trim-8/aula-71-medidas-centrais': () =>
    import('@/../content/aulas/ano-2/trim-8/aula-71-medidas-centrais.mdx'),
  'aulas/ano-2/trim-8/aula-72-variancia': () =>
    import('@/../content/aulas/ano-2/trim-8/aula-72-variancia.mdx'),
  'aulas/ano-2/trim-8/aula-73-quartis': () =>
    import('@/../content/aulas/ano-2/trim-8/aula-73-quartis.mdx'),
  'aulas/ano-2/trim-8/aula-74-va-discreta': () =>
    import('@/../content/aulas/ano-2/trim-8/aula-74-va-discreta.mdx'),
  'aulas/ano-2/trim-8/aula-75-binomial': () =>
    import('@/../content/aulas/ano-2/trim-8/aula-75-binomial.mdx'),
  'aulas/ano-2/trim-8/aula-76-normal': () =>
    import('@/../content/aulas/ano-2/trim-8/aula-76-normal.mdx'),
  'aulas/ano-2/trim-8/aula-77-tcl': () =>
    import('@/../content/aulas/ano-2/trim-8/aula-77-tcl.mdx'),
  'aulas/ano-2/trim-8/aula-78-correlacao': () =>
    import('@/../content/aulas/ano-2/trim-8/aula-78-correlacao.mdx'),
  'aulas/ano-2/trim-8/aula-79-bayes-aprofundado': () =>
    import('@/../content/aulas/ano-2/trim-8/aula-79-bayes-aprofundado.mdx'),
  'aulas/ano-2/trim-8/aula-80-consolidacao-trim-8': () =>
    import('@/../content/aulas/ano-2/trim-8/aula-80-consolidacao-trim-8.mdx'),

  // Aulas — Ano 3, Trimestre 10
  'aulas/ano-3/trim-10/aula-100-consolidacao-trim-10': () =>
    import('@/../content/aulas/ano-3/trim-10/aula-100-consolidacao-trim-10.mdx'),
  'aulas/ano-3/trim-10/aula-91-edo-intro': () =>
    import('@/../content/aulas/ano-3/trim-10/aula-91-edo-intro.mdx'),
  'aulas/ano-3/trim-10/aula-92-edo-separavel': () =>
    import('@/../content/aulas/ano-3/trim-10/aula-92-edo-separavel.mdx'),
  'aulas/ano-3/trim-10/aula-93-edo-linear-1': () =>
    import('@/../content/aulas/ano-3/trim-10/aula-93-edo-linear-1.mdx'),
  'aulas/ano-3/trim-10/aula-94-edo-populacional': () =>
    import('@/../content/aulas/ano-3/trim-10/aula-94-edo-populacional.mdx'),
  'aulas/ano-3/trim-10/aula-95-edo-2-ordem': () =>
    import('@/../content/aulas/ano-3/trim-10/aula-95-edo-2-ordem.mdx'),
  'aulas/ano-3/trim-10/aula-96-vibracoes': () =>
    import('@/../content/aulas/ano-3/trim-10/aula-96-vibracoes.mdx'),
  'aulas/ano-3/trim-10/aula-97-rlc': () =>
    import('@/../content/aulas/ano-3/trim-10/aula-97-rlc.mdx'),
  'aulas/ano-3/trim-10/aula-98-euler-numerico': () =>
    import('@/../content/aulas/ano-3/trim-10/aula-98-euler-numerico.mdx'),
  'aulas/ano-3/trim-10/aula-99-newton-resfriamento': () =>
    import('@/../content/aulas/ano-3/trim-10/aula-99-newton-resfriamento.mdx'),

  // Aulas — Ano 3, Trimestre 11
  'aulas/ano-3/trim-11/aula-101-amostragem': () =>
    import('@/../content/aulas/ano-3/trim-11/aula-101-amostragem.mdx'),
  'aulas/ano-3/trim-11/aula-102-ic-media': () =>
    import('@/../content/aulas/ano-3/trim-11/aula-102-ic-media.mdx'),
  'aulas/ano-3/trim-11/aula-103-teste-hipotese': () =>
    import('@/../content/aulas/ano-3/trim-11/aula-103-teste-hipotese.mdx'),
  'aulas/ano-3/trim-11/aula-104-teste-z-t': () =>
    import('@/../content/aulas/ano-3/trim-11/aula-104-teste-z-t.mdx'),
  'aulas/ano-3/trim-11/aula-105-regressao-simples': () =>
    import('@/../content/aulas/ano-3/trim-11/aula-105-regressao-simples.mdx'),
  'aulas/ano-3/trim-11/aula-106-regressao-multipla': () =>
    import('@/../content/aulas/ano-3/trim-11/aula-106-regressao-multipla.mdx'),
  'aulas/ano-3/trim-11/aula-107-anova': () =>
    import('@/../content/aulas/ano-3/trim-11/aula-107-anova.mdx'),
  'aulas/ano-3/trim-11/aula-108-qui-quadrado': () =>
    import('@/../content/aulas/ano-3/trim-11/aula-108-qui-quadrado.mdx'),
  'aulas/ano-3/trim-11/aula-109-bayesiana-intro': () =>
    import('@/../content/aulas/ano-3/trim-11/aula-109-bayesiana-intro.mdx'),
  'aulas/ano-3/trim-11/aula-110-consolidacao-trim-11': () =>
    import('@/../content/aulas/ano-3/trim-11/aula-110-consolidacao-trim-11.mdx'),

  // Aulas — Ano 3, Trimestre 12
  'aulas/ano-3/trim-12/aula-111-espacos-vetoriais': () =>
    import('@/../content/aulas/ano-3/trim-12/aula-111-espacos-vetoriais.mdx'),
  'aulas/ano-3/trim-12/aula-112-transformacoes-lineares': () =>
    import('@/../content/aulas/ano-3/trim-12/aula-112-transformacoes-lineares.mdx'),
  'aulas/ano-3/trim-12/aula-113-nucleo-imagem': () =>
    import('@/../content/aulas/ano-3/trim-12/aula-113-nucleo-imagem.mdx'),
  'aulas/ano-3/trim-12/aula-114-autovalores': () =>
    import('@/../content/aulas/ano-3/trim-12/aula-114-autovalores.mdx'),
  'aulas/ano-3/trim-12/aula-115-diagonalizacao': () =>
    import('@/../content/aulas/ano-3/trim-12/aula-115-diagonalizacao.mdx'),
  'aulas/ano-3/trim-12/aula-116-matrizes-especiais': () =>
    import('@/../content/aulas/ano-3/trim-12/aula-116-matrizes-especiais.mdx'),
  'aulas/ano-3/trim-12/aula-117-svd': () =>
    import('@/../content/aulas/ano-3/trim-12/aula-117-svd.mdx'),
  'aulas/ano-3/trim-12/aula-118-pca': () =>
    import('@/../content/aulas/ano-3/trim-12/aula-118-pca.mdx'),
  'aulas/ano-3/trim-12/aula-119-bs-sintese': () =>
    import('@/../content/aulas/ano-3/trim-12/aula-119-bs-sintese.mdx'),
  'aulas/ano-3/trim-12/aula-120-workshop-final': () =>
    import('@/../content/aulas/ano-3/trim-12/aula-120-workshop-final.mdx'),

  // Aulas — Ano 3, Trimestre 9
  'aulas/ano-3/trim-9/aula-81-antiderivada': () =>
    import('@/../content/aulas/ano-3/trim-9/aula-81-antiderivada.mdx'),
  'aulas/ano-3/trim-9/aula-82-integral-definida': () =>
    import('@/../content/aulas/ano-3/trim-9/aula-82-integral-definida.mdx'),
  'aulas/ano-3/trim-9/aula-83-tfc': () =>
    import('@/../content/aulas/ano-3/trim-9/aula-83-tfc.mdx'),
  'aulas/ano-3/trim-9/aula-84-substituicao': () =>
    import('@/../content/aulas/ano-3/trim-9/aula-84-substituicao.mdx'),
  'aulas/ano-3/trim-9/aula-85-por-partes': () =>
    import('@/../content/aulas/ano-3/trim-9/aula-85-por-partes.mdx'),
  'aulas/ano-3/trim-9/aula-86-fracoes-parciais': () =>
    import('@/../content/aulas/ano-3/trim-9/aula-86-fracoes-parciais.mdx'),
  'aulas/ano-3/trim-9/aula-87-integrais-trig': () =>
    import('@/../content/aulas/ano-3/trim-9/aula-87-integrais-trig.mdx'),
  'aulas/ano-3/trim-9/aula-88-area-curvas': () =>
    import('@/../content/aulas/ano-3/trim-9/aula-88-area-curvas.mdx'),
  'aulas/ano-3/trim-9/aula-89-volume': () =>
    import('@/../content/aulas/ano-3/trim-9/aula-89-volume.mdx'),
  'aulas/ano-3/trim-9/aula-90-consolidacao-trim-9': () =>
    import('@/../content/aulas/ano-3/trim-9/aula-90-consolidacao-trim-9.mdx'),

}

export async function carregarMdx(caminho: string) {
  const loader = manifesto[caminho]
  if (!loader) return null
  return loader()
}
