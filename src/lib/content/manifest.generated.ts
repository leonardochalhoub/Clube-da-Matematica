/**
 * GERADO AUTOMATICAMENTE por scripts/generate-manifest.ts
 * Não edite à mão — rode: pnpm tsx scripts/generate-manifest.ts
 *
 * Modo: matrix build (BUILD_LOCALE=pt-BR)
 *
 * Cada path mapeia (locale → import dinâmico do MDX).
 * Usar via carregarMdxLocalizado(caminho, locale) em manifest.ts.
 */
import type { ComponentType } from 'react'

type MdxLoader = () => Promise<{ default: ComponentType }>

export const manifestoI18n: Record<string, Partial<Record<string, MdxLoader>>> = {
  'aulas/ano-1/trim-1/licao-01-conjuntos-intervalos': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-01-conjuntos-intervalos.mdx'),
  },
  'aulas/ano-1/trim-1/licao-02-funcoes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-02-funcoes.mdx'),
  },
  'aulas/ano-1/trim-1/licao-03-afim': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-03-afim.mdx'),
  },
  'aulas/ano-1/trim-1/licao-04-quadratica': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-04-quadratica.mdx'),
  },
  'aulas/ano-1/trim-1/licao-05-composicao-inversa': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-05-composicao-inversa.mdx'),
  },
  'aulas/ano-1/trim-1/licao-06-exponencial': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-06-exponencial.mdx'),
  },
  'aulas/ano-1/trim-1/licao-07-logaritmo': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-07-logaritmo.mdx'),
  },
  'aulas/ano-1/trim-1/licao-08-crescimento': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-08-crescimento.mdx'),
  },
  'aulas/ano-1/trim-1/licao-09-taxa-variacao': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-09-taxa-variacao.mdx'),
  },
  'aulas/ano-1/trim-1/licao-10-consolidacao-trim-1': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-10-consolidacao-trim-1.mdx'),
  },
  'aulas/ano-1/trim-2/licao-11-trig-triangulo': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-11-trig-triangulo.mdx'),
  },
  'aulas/ano-1/trim-2/licao-12-circulo-trigonometrico': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-12-circulo-trigonometrico.mdx'),
  },
  'aulas/ano-1/trim-2/licao-13-funcoes-trigonometricas': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-13-funcoes-trigonometricas.mdx'),
  },
  'aulas/ano-1/trim-2/licao-14-equacoes-trigonometricas': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-14-equacoes-trigonometricas.mdx'),
  },
  'aulas/ano-1/trim-2/licao-15-leis-senos-cossenos': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-15-leis-senos-cossenos.mdx'),
  },
  'aulas/ano-1/trim-2/licao-16-sequencias': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-16-sequencias.mdx'),
  },
  'aulas/ano-1/trim-2/licao-17-pa': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-17-pa.mdx'),
  },
  'aulas/ano-1/trim-2/licao-18-pg': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-18-pg.mdx'),
  },
  'aulas/ano-1/trim-2/licao-19-limite-intuitivo': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-19-limite-intuitivo.mdx'),
  },
  'aulas/ano-1/trim-2/licao-20-consolidacao-trim-2': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-20-consolidacao-trim-2.mdx'),
  },
  'aulas/ano-1/trim-3/licao-21-plano-cartesiano': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-21-plano-cartesiano.mdx'),
  },
  'aulas/ano-1/trim-3/licao-22-equacao-reta': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-22-equacao-reta.mdx'),
  },
  'aulas/ano-1/trim-3/licao-23-posicao-relativa-retas': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-23-posicao-relativa-retas.mdx'),
  },
  'aulas/ano-1/trim-3/licao-24-circunferencia': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-24-circunferencia.mdx'),
  },
  'aulas/ano-1/trim-3/licao-25-conicas': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-25-conicas.mdx'),
  },
  'aulas/ano-1/trim-3/licao-26-vetores-plano': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-26-vetores-plano.mdx'),
  },
  'aulas/ano-1/trim-3/licao-27-produto-escalar': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-27-produto-escalar.mdx'),
  },
  'aulas/ano-1/trim-3/licao-28-aplicacoes-vetores-fisica': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-28-aplicacoes-vetores-fisica.mdx'),
  },
  'aulas/ano-1/trim-3/licao-29-sistemas-lineares': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-29-sistemas-lineares.mdx'),
  },
  'aulas/ano-1/trim-3/licao-30-consolidacao-trim-3': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-30-consolidacao-trim-3.mdx'),
  },
  'aulas/ano-1/trim-4/licao-31-matrizes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-31-matrizes.mdx'),
  },
  'aulas/ano-1/trim-4/licao-32-operacoes-matrizes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-32-operacoes-matrizes.mdx'),
  },
  'aulas/ano-1/trim-4/licao-33-transposta-inversa': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-33-transposta-inversa.mdx'),
  },
  'aulas/ano-1/trim-4/licao-34-determinantes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-34-determinantes.mdx'),
  },
  'aulas/ano-1/trim-4/licao-35-sistemas-via-matrizes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-35-sistemas-via-matrizes.mdx'),
  },
  'aulas/ano-1/trim-4/licao-36-pfc': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-36-pfc.mdx'),
  },
  'aulas/ano-1/trim-4/licao-37-permutacoes-arranjos': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-37-permutacoes-arranjos.mdx'),
  },
  'aulas/ano-1/trim-4/licao-38-combinacoes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-38-combinacoes.mdx'),
  },
  'aulas/ano-1/trim-4/licao-39-probabilidade': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-39-probabilidade.mdx'),
  },
  'aulas/ano-1/trim-4/licao-40-consolidacao-anual': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-40-consolidacao-anual.mdx'),
  },
  'aulas/ano-2/trim-5/licao-41-limite-formal': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-41-limite-formal.mdx'),
  },
  'aulas/ano-2/trim-5/licao-42-propriedades-limites': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-42-propriedades-limites.mdx'),
  },
  'aulas/ano-2/trim-5/licao-43-continuidade': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-43-continuidade.mdx'),
  },
  'aulas/ano-2/trim-5/licao-44-limites-laterais': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-44-limites-laterais.mdx'),
  },
  'aulas/ano-2/trim-5/licao-45-limites-fundamentais': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-45-limites-fundamentais.mdx'),
  },
  'aulas/ano-2/trim-5/licao-46-tvi-tvm': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-46-tvi-tvm.mdx'),
  },
  'aulas/ano-2/trim-5/licao-47-assintotas': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-47-assintotas.mdx'),
  },
  'aulas/ano-2/trim-5/licao-48-limites-funcoes-trig': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-48-limites-funcoes-trig.mdx'),
  },
  'aulas/ano-2/trim-5/licao-49-limite-sequencias': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-49-limite-sequencias.mdx'),
  },
  'aulas/ano-2/trim-5/licao-50-consolidacao-trim-5': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-50-consolidacao-trim-5.mdx'),
  },
  'aulas/ano-2/trim-6/licao-51-derivada-definicao': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-51-derivada-definicao.mdx'),
  },
  'aulas/ano-2/trim-6/licao-52-regras-derivacao': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-52-regras-derivacao.mdx'),
  },
  'aulas/ano-2/trim-6/licao-53-regra-cadeia': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-53-regra-cadeia.mdx'),
  },
  'aulas/ano-2/trim-6/licao-54-derivadas-implicitas': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-54-derivadas-implicitas.mdx'),
  },
  'aulas/ano-2/trim-6/licao-55-derivadas-superiores': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-55-derivadas-superiores.mdx'),
  },
  'aulas/ano-2/trim-6/licao-56-derivadas-inversas': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-56-derivadas-inversas.mdx'),
  },
  'aulas/ano-2/trim-6/licao-57-aproximacao-linear': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-57-aproximacao-linear.mdx'),
  },
  'aulas/ano-2/trim-6/licao-58-taxas-relacionadas': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-58-taxas-relacionadas.mdx'),
  },
  'aulas/ano-2/trim-6/licao-59-diferenciabilidade': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-59-diferenciabilidade.mdx'),
  },
  'aulas/ano-2/trim-6/licao-60-consolidacao-trim-6': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-60-consolidacao-trim-6.mdx'),
  },
  'aulas/ano-2/trim-7/licao-61-maximos-minimos': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-61-maximos-minimos.mdx'),
  },
  'aulas/ano-2/trim-7/licao-62-otimizacao': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-62-otimizacao.mdx'),
  },
  'aulas/ano-2/trim-7/licao-63-esboco-graficos': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-63-esboco-graficos.mdx'),
  },
  'aulas/ano-2/trim-7/licao-64-l-hopital': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-64-l-hopital.mdx'),
  },
  'aulas/ano-2/trim-7/licao-65-taylor': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-65-taylor.mdx'),
  },
  'aulas/ano-2/trim-7/licao-66-concavidade': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-66-concavidade.mdx'),
  },
  'aulas/ano-2/trim-7/licao-67-economia-derivadas': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-67-economia-derivadas.mdx'),
  },
  'aulas/ano-2/trim-7/licao-68-cinematica': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-68-cinematica.mdx'),
  },
  'aulas/ano-2/trim-7/licao-69-newton-raphson': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-69-newton-raphson.mdx'),
  },
  'aulas/ano-2/trim-7/licao-70-consolidacao-trim-7': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-70-consolidacao-trim-7.mdx'),
  },
  'aulas/ano-2/trim-8/licao-71-medidas-centrais': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-71-medidas-centrais.mdx'),
  },
  'aulas/ano-2/trim-8/licao-72-variancia': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-72-variancia.mdx'),
  },
  'aulas/ano-2/trim-8/licao-73-quartis': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-73-quartis.mdx'),
  },
  'aulas/ano-2/trim-8/licao-74-va-discreta': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-74-va-discreta.mdx'),
  },
  'aulas/ano-2/trim-8/licao-75-binomial': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-75-binomial.mdx'),
  },
  'aulas/ano-2/trim-8/licao-76-normal': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-76-normal.mdx'),
  },
  'aulas/ano-2/trim-8/licao-77-tcl': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-77-tcl.mdx'),
  },
  'aulas/ano-2/trim-8/licao-78-correlacao': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-78-correlacao.mdx'),
  },
  'aulas/ano-2/trim-8/licao-79-bayes-aprofundado': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-79-bayes-aprofundado.mdx'),
  },
  'aulas/ano-2/trim-8/licao-80-consolidacao-trim-8': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-80-consolidacao-trim-8.mdx'),
  },
  'aulas/ano-3/trim-10/licao-100-consolidacao-trim-10': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-100-consolidacao-trim-10.mdx'),
  },
  'aulas/ano-3/trim-10/licao-91-edo-intro': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-91-edo-intro.mdx'),
  },
  'aulas/ano-3/trim-10/licao-92-edo-separavel': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-92-edo-separavel.mdx'),
  },
  'aulas/ano-3/trim-10/licao-93-edo-linear-1': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-93-edo-linear-1.mdx'),
  },
  'aulas/ano-3/trim-10/licao-94-edo-populacional': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-94-edo-populacional.mdx'),
  },
  'aulas/ano-3/trim-10/licao-95-edo-2-ordem': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-95-edo-2-ordem.mdx'),
  },
  'aulas/ano-3/trim-10/licao-96-vibracoes': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-96-vibracoes.mdx'),
  },
  'aulas/ano-3/trim-10/licao-97-rlc': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-97-rlc.mdx'),
  },
  'aulas/ano-3/trim-10/licao-98-euler-numerico': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-98-euler-numerico.mdx'),
  },
  'aulas/ano-3/trim-10/licao-99-newton-resfriamento': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-99-newton-resfriamento.mdx'),
  },
  'aulas/ano-3/trim-11/licao-101-amostragem': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-101-amostragem.mdx'),
  },
  'aulas/ano-3/trim-11/licao-102-ic-media': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-102-ic-media.mdx'),
  },
  'aulas/ano-3/trim-11/licao-103-teste-hipotese': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-103-teste-hipotese.mdx'),
  },
  'aulas/ano-3/trim-11/licao-104-teste-z-t': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-104-teste-z-t.mdx'),
  },
  'aulas/ano-3/trim-11/licao-105-regressao-simples': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-105-regressao-simples.mdx'),
  },
  'aulas/ano-3/trim-11/licao-106-regressao-multipla': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-106-regressao-multipla.mdx'),
  },
  'aulas/ano-3/trim-11/licao-107-anova': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-107-anova.mdx'),
  },
  'aulas/ano-3/trim-11/licao-108-qui-quadrado': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-108-qui-quadrado.mdx'),
  },
  'aulas/ano-3/trim-11/licao-109-bayesiana-intro': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-109-bayesiana-intro.mdx'),
  },
  'aulas/ano-3/trim-11/licao-110-consolidacao-trim-11': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-110-consolidacao-trim-11.mdx'),
  },
  'aulas/ano-3/trim-12/licao-111-espacos-vetoriais': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-111-espacos-vetoriais.mdx'),
  },
  'aulas/ano-3/trim-12/licao-112-transformacoes-lineares': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-112-transformacoes-lineares.mdx'),
  },
  'aulas/ano-3/trim-12/licao-113-nucleo-imagem': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-113-nucleo-imagem.mdx'),
  },
  'aulas/ano-3/trim-12/licao-114-autovalores': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-114-autovalores.mdx'),
  },
  'aulas/ano-3/trim-12/licao-115-diagonalizacao': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-115-diagonalizacao.mdx'),
  },
  'aulas/ano-3/trim-12/licao-116-matrizes-especiais': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-116-matrizes-especiais.mdx'),
  },
  'aulas/ano-3/trim-12/licao-117-svd': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-117-svd.mdx'),
  },
  'aulas/ano-3/trim-12/licao-118-pca': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-118-pca.mdx'),
  },
  'aulas/ano-3/trim-12/licao-119-bs-sintese': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-119-bs-sintese.mdx'),
  },
  'aulas/ano-3/trim-12/licao-120-workshop-final': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-120-workshop-final.mdx'),
  },
  'aulas/ano-3/trim-9/licao-81-antiderivada': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-81-antiderivada.mdx'),
  },
  'aulas/ano-3/trim-9/licao-82-integral-definida': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-82-integral-definida.mdx'),
  },
  'aulas/ano-3/trim-9/licao-83-tfc': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-83-tfc.mdx'),
  },
  'aulas/ano-3/trim-9/licao-84-substituicao': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-84-substituicao.mdx'),
  },
  'aulas/ano-3/trim-9/licao-85-por-partes': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-85-por-partes.mdx'),
  },
  'aulas/ano-3/trim-9/licao-86-fracoes-parciais': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-86-fracoes-parciais.mdx'),
  },
  'aulas/ano-3/trim-9/licao-87-integrais-trig': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-87-integrais-trig.mdx'),
  },
  'aulas/ano-3/trim-9/licao-88-area-curvas': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-88-area-curvas.mdx'),
  },
  'aulas/ano-3/trim-9/licao-89-volume': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-89-volume.mdx'),
  },
  'aulas/ano-3/trim-9/licao-90-consolidacao-trim-9': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-90-consolidacao-trim-9.mdx'),
  },
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
