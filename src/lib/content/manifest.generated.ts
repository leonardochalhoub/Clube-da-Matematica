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
  'aulas/ano-1/trim-1/licao-01-conjuntos-intervalos': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-01-conjuntos-intervalos.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/licao-01-conjuntos-intervalos.mdx'),
  },
  'aulas/ano-1/trim-1/licao-02-funcoes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-02-funcoes.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/licao-02-funcoes.mdx'),
  },
  'aulas/ano-1/trim-1/licao-03-afim': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-03-afim.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/licao-03-afim.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-1/licao-03-afim.mdx'),
  },
  'aulas/ano-1/trim-1/licao-04-quadratica': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-04-quadratica.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/licao-04-quadratica.mdx'),
  },
  'aulas/ano-1/trim-1/licao-05-composicao-inversa': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-05-composicao-inversa.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/licao-05-composicao-inversa.mdx'),
  },
  'aulas/ano-1/trim-1/licao-06-exponencial': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-06-exponencial.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/licao-06-exponencial.mdx'),
  },
  'aulas/ano-1/trim-1/licao-07-logaritmo': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-07-logaritmo.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/licao-07-logaritmo.mdx'),
  },
  'aulas/ano-1/trim-1/licao-08-crescimento': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-08-crescimento.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/licao-08-crescimento.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-1/licao-08-crescimento.mdx'),
  },
  'aulas/ano-1/trim-1/licao-09-taxa-variacao': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-09-taxa-variacao.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/licao-09-taxa-variacao.mdx'),
  },
  'aulas/ano-1/trim-1/licao-10-consolidacao-trim-1': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/licao-10-consolidacao-trim-1.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/licao-10-consolidacao-trim-1.mdx'),
  },
  'aulas/ano-1/trim-2/licao-11-trig-triangulo': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-11-trig-triangulo.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/licao-11-trig-triangulo.mdx'),
  },
  'aulas/ano-1/trim-2/licao-12-circulo-trigonometrico': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-12-circulo-trigonometrico.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/licao-12-circulo-trigonometrico.mdx'),
  },
  'aulas/ano-1/trim-2/licao-13-funcoes-trigonometricas': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-13-funcoes-trigonometricas.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/licao-13-funcoes-trigonometricas.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-2/licao-13-funcoes-trigonometricas.mdx'),
  },
  'aulas/ano-1/trim-2/licao-14-equacoes-trigonometricas': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-14-equacoes-trigonometricas.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/licao-14-equacoes-trigonometricas.mdx'),
  },
  'aulas/ano-1/trim-2/licao-15-leis-senos-cossenos': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-15-leis-senos-cossenos.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/licao-15-leis-senos-cossenos.mdx'),
  },
  'aulas/ano-1/trim-2/licao-16-sequencias': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-16-sequencias.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/licao-16-sequencias.mdx'),
  },
  'aulas/ano-1/trim-2/licao-17-pa': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-17-pa.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/licao-17-pa.mdx'),
  },
  'aulas/ano-1/trim-2/licao-18-pg': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-18-pg.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/licao-18-pg.mdx'),
  },
  'aulas/ano-1/trim-2/licao-19-limite-intuitivo': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-19-limite-intuitivo.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/licao-19-limite-intuitivo.mdx'),
  },
  'aulas/ano-1/trim-2/licao-20-consolidacao-trim-2': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/licao-20-consolidacao-trim-2.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/licao-20-consolidacao-trim-2.mdx'),
  },
  'aulas/ano-1/trim-3/licao-21-plano-cartesiano': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-21-plano-cartesiano.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/licao-21-plano-cartesiano.mdx'),
  },
  'aulas/ano-1/trim-3/licao-22-equacao-reta': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-22-equacao-reta.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/licao-22-equacao-reta.mdx'),
  },
  'aulas/ano-1/trim-3/licao-23-posicao-relativa-retas': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-23-posicao-relativa-retas.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/licao-23-posicao-relativa-retas.mdx'),
  },
  'aulas/ano-1/trim-3/licao-24-circunferencia': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-24-circunferencia.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/licao-24-circunferencia.mdx'),
  },
  'aulas/ano-1/trim-3/licao-25-conicas': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-25-conicas.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/licao-25-conicas.mdx'),
  },
  'aulas/ano-1/trim-3/licao-26-vetores-plano': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-26-vetores-plano.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/licao-26-vetores-plano.mdx'),
  },
  'aulas/ano-1/trim-3/licao-27-produto-escalar': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-27-produto-escalar.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/licao-27-produto-escalar.mdx'),
  },
  'aulas/ano-1/trim-3/licao-28-aplicacoes-vetores-fisica': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-28-aplicacoes-vetores-fisica.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/licao-28-aplicacoes-vetores-fisica.mdx'),
  },
  'aulas/ano-1/trim-3/licao-29-sistemas-lineares': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-29-sistemas-lineares.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/licao-29-sistemas-lineares.mdx'),
  },
  'aulas/ano-1/trim-3/licao-30-consolidacao-trim-3': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/licao-30-consolidacao-trim-3.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/licao-30-consolidacao-trim-3.mdx'),
  },
  'aulas/ano-1/trim-4/licao-31-matrizes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-31-matrizes.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-4/licao-31-matrizes.mdx'),
  },
  'aulas/ano-1/trim-4/licao-32-operacoes-matrizes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-32-operacoes-matrizes.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-4/licao-32-operacoes-matrizes.mdx'),
  },
  'aulas/ano-1/trim-4/licao-33-transposta-inversa': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-33-transposta-inversa.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-4/licao-33-transposta-inversa.mdx'),
  },
  'aulas/ano-1/trim-4/licao-34-determinantes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-34-determinantes.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-4/licao-34-determinantes.mdx'),
  },
  'aulas/ano-1/trim-4/licao-35-sistemas-via-matrizes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-35-sistemas-via-matrizes.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-4/licao-35-sistemas-via-matrizes.mdx'),
  },
  'aulas/ano-1/trim-4/licao-36-pfc': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-36-pfc.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-4/licao-36-pfc.mdx'),
  },
  'aulas/ano-1/trim-4/licao-37-permutacoes-arranjos': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-37-permutacoes-arranjos.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-4/licao-37-permutacoes-arranjos.mdx'),
  },
  'aulas/ano-1/trim-4/licao-38-combinacoes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-38-combinacoes.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-4/licao-38-combinacoes.mdx'),
  },
  'aulas/ano-1/trim-4/licao-39-probabilidade': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-39-probabilidade.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-4/licao-39-probabilidade.mdx'),
  },
  'aulas/ano-1/trim-4/licao-40-consolidacao-anual': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/licao-40-consolidacao-anual.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-4/licao-40-consolidacao-anual.mdx'),
  },
  'aulas/ano-2/trim-5/licao-41-limite-formal': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-41-limite-formal.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-5/licao-41-limite-formal.mdx'),
  },
  'aulas/ano-2/trim-5/licao-42-propriedades-limites': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-42-propriedades-limites.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-5/licao-42-propriedades-limites.mdx'),
  },
  'aulas/ano-2/trim-5/licao-43-continuidade': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-43-continuidade.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-5/licao-43-continuidade.mdx'),
  },
  'aulas/ano-2/trim-5/licao-44-limites-laterais': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-44-limites-laterais.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-5/licao-44-limites-laterais.mdx'),
  },
  'aulas/ano-2/trim-5/licao-45-limites-fundamentais': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-45-limites-fundamentais.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-5/licao-45-limites-fundamentais.mdx'),
  },
  'aulas/ano-2/trim-5/licao-46-tvi-tvm': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-46-tvi-tvm.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-5/licao-46-tvi-tvm.mdx'),
  },
  'aulas/ano-2/trim-5/licao-47-assintotas': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-47-assintotas.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-5/licao-47-assintotas.mdx'),
  },
  'aulas/ano-2/trim-5/licao-48-limites-funcoes-trig': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-48-limites-funcoes-trig.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-5/licao-48-limites-funcoes-trig.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-2/trim-5/licao-48-limites-funcoes-trig.mdx'),
  },
  'aulas/ano-2/trim-5/licao-49-limite-sequencias': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-49-limite-sequencias.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-5/licao-49-limite-sequencias.mdx'),
  },
  'aulas/ano-2/trim-5/licao-50-consolidacao-trim-5': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/licao-50-consolidacao-trim-5.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-5/licao-50-consolidacao-trim-5.mdx'),
  },
  'aulas/ano-2/trim-6/licao-51-derivada-definicao': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-51-derivada-definicao.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-6/licao-51-derivada-definicao.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-2/trim-6/licao-51-derivada-definicao.mdx'),
  },
  'aulas/ano-2/trim-6/licao-52-regras-derivacao': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-52-regras-derivacao.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-6/licao-52-regras-derivacao.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-2/trim-6/licao-52-regras-derivacao.mdx'),
  },
  'aulas/ano-2/trim-6/licao-53-regra-cadeia': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-53-regra-cadeia.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-6/licao-53-regra-cadeia.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-2/trim-6/licao-53-regra-cadeia.mdx'),
  },
  'aulas/ano-2/trim-6/licao-54-derivadas-implicitas': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-54-derivadas-implicitas.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-6/licao-54-derivadas-implicitas.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-2/trim-6/licao-54-derivadas-implicitas.mdx'),
  },
  'aulas/ano-2/trim-6/licao-55-derivadas-superiores': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-55-derivadas-superiores.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-6/licao-55-derivadas-superiores.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-2/trim-6/licao-55-derivadas-superiores.mdx'),
  },
  'aulas/ano-2/trim-6/licao-56-derivadas-inversas': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-56-derivadas-inversas.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-6/licao-56-derivadas-inversas.mdx'),
  },
  'aulas/ano-2/trim-6/licao-57-aproximacao-linear': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-57-aproximacao-linear.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-6/licao-57-aproximacao-linear.mdx'),
  },
  'aulas/ano-2/trim-6/licao-58-taxas-relacionadas': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-58-taxas-relacionadas.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-6/licao-58-taxas-relacionadas.mdx'),
  },
  'aulas/ano-2/trim-6/licao-59-diferenciabilidade': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-59-diferenciabilidade.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-6/licao-59-diferenciabilidade.mdx'),
  },
  'aulas/ano-2/trim-6/licao-60-consolidacao-trim-6': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/licao-60-consolidacao-trim-6.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-6/licao-60-consolidacao-trim-6.mdx'),
  },
  'aulas/ano-2/trim-7/licao-61-maximos-minimos': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-61-maximos-minimos.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-7/licao-61-maximos-minimos.mdx'),
  },
  'aulas/ano-2/trim-7/licao-62-otimizacao': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-62-otimizacao.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-7/licao-62-otimizacao.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-2/trim-7/licao-62-otimizacao.mdx'),
  },
  'aulas/ano-2/trim-7/licao-63-esboco-graficos': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-63-esboco-graficos.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-7/licao-63-esboco-graficos.mdx'),
  },
  'aulas/ano-2/trim-7/licao-64-l-hopital': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-64-l-hopital.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-7/licao-64-l-hopital.mdx'),
  },
  'aulas/ano-2/trim-7/licao-65-taylor': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-65-taylor.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-7/licao-65-taylor.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-2/trim-7/licao-65-taylor.mdx'),
  },
  'aulas/ano-2/trim-7/licao-66-concavidade': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-66-concavidade.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-7/licao-66-concavidade.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-2/trim-7/licao-66-concavidade.mdx'),
  },
  'aulas/ano-2/trim-7/licao-67-economia-derivadas': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-67-economia-derivadas.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-7/licao-67-economia-derivadas.mdx'),
  },
  'aulas/ano-2/trim-7/licao-68-cinematica': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-68-cinematica.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-7/licao-68-cinematica.mdx'),
  },
  'aulas/ano-2/trim-7/licao-69-newton-raphson': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-69-newton-raphson.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-7/licao-69-newton-raphson.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-2/trim-7/licao-69-newton-raphson.mdx'),
  },
  'aulas/ano-2/trim-7/licao-70-consolidacao-trim-7': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/licao-70-consolidacao-trim-7.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-7/licao-70-consolidacao-trim-7.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-2/trim-7/licao-70-consolidacao-trim-7.mdx'),
  },
  'aulas/ano-2/trim-8/licao-71-medidas-centrais': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-71-medidas-centrais.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-8/licao-71-medidas-centrais.mdx'),
  },
  'aulas/ano-2/trim-8/licao-72-variancia': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-72-variancia.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-8/licao-72-variancia.mdx'),
  },
  'aulas/ano-2/trim-8/licao-73-quartis': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-73-quartis.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-8/licao-73-quartis.mdx'),
  },
  'aulas/ano-2/trim-8/licao-74-va-discreta': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-74-va-discreta.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-8/licao-74-va-discreta.mdx'),
  },
  'aulas/ano-2/trim-8/licao-75-binomial': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-75-binomial.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-8/licao-75-binomial.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-2/trim-8/licao-75-binomial.mdx'),
  },
  'aulas/ano-2/trim-8/licao-76-normal': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-76-normal.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-8/licao-76-normal.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-2/trim-8/licao-76-normal.mdx'),
  },
  'aulas/ano-2/trim-8/licao-77-tcl': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-77-tcl.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-8/licao-77-tcl.mdx'),
  },
  'aulas/ano-2/trim-8/licao-78-correlacao': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-78-correlacao.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-8/licao-78-correlacao.mdx'),
  },
  'aulas/ano-2/trim-8/licao-79-bayes-aprofundado': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-79-bayes-aprofundado.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-8/licao-79-bayes-aprofundado.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-2/trim-8/licao-79-bayes-aprofundado.mdx'),
  },
  'aulas/ano-2/trim-8/licao-80-consolidacao-trim-8': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/licao-80-consolidacao-trim-8.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-2/trim-8/licao-80-consolidacao-trim-8.mdx'),
  },
  'aulas/ano-3/trim-10/licao-100-consolidacao-trim-10': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-100-consolidacao-trim-10.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-10/licao-100-consolidacao-trim-10.mdx'),
  },
  'aulas/ano-3/trim-10/licao-91-edo-intro': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-91-edo-intro.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-10/licao-91-edo-intro.mdx'),
  },
  'aulas/ano-3/trim-10/licao-92-edo-separavel': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-92-edo-separavel.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-10/licao-92-edo-separavel.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-3/trim-10/licao-92-edo-separavel.mdx'),
  },
  'aulas/ano-3/trim-10/licao-93-edo-linear-1': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-93-edo-linear-1.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-10/licao-93-edo-linear-1.mdx'),
  },
  'aulas/ano-3/trim-10/licao-94-edo-populacional': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-94-edo-populacional.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-10/licao-94-edo-populacional.mdx'),
  },
  'aulas/ano-3/trim-10/licao-95-edo-2-ordem': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-95-edo-2-ordem.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-10/licao-95-edo-2-ordem.mdx'),
  },
  'aulas/ano-3/trim-10/licao-96-vibracoes': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-96-vibracoes.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-10/licao-96-vibracoes.mdx'),
  },
  'aulas/ano-3/trim-10/licao-97-rlc': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-97-rlc.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-10/licao-97-rlc.mdx'),
  },
  'aulas/ano-3/trim-10/licao-98-euler-numerico': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-98-euler-numerico.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-10/licao-98-euler-numerico.mdx'),
  },
  'aulas/ano-3/trim-10/licao-99-newton-resfriamento': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/licao-99-newton-resfriamento.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-10/licao-99-newton-resfriamento.mdx'),
  },
  'aulas/ano-3/trim-11/licao-101-amostragem': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-101-amostragem.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-11/licao-101-amostragem.mdx'),
  },
  'aulas/ano-3/trim-11/licao-102-ic-media': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-102-ic-media.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-11/licao-102-ic-media.mdx'),
  },
  'aulas/ano-3/trim-11/licao-103-teste-hipotese': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-103-teste-hipotese.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-11/licao-103-teste-hipotese.mdx'),
  },
  'aulas/ano-3/trim-11/licao-104-teste-z-t': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-104-teste-z-t.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-11/licao-104-teste-z-t.mdx'),
  },
  'aulas/ano-3/trim-11/licao-105-regressao-simples': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-105-regressao-simples.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-11/licao-105-regressao-simples.mdx'),
  },
  'aulas/ano-3/trim-11/licao-106-regressao-multipla': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-106-regressao-multipla.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-11/licao-106-regressao-multipla.mdx'),
  },
  'aulas/ano-3/trim-11/licao-107-anova': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-107-anova.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-11/licao-107-anova.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-3/trim-11/licao-107-anova.mdx'),
  },
  'aulas/ano-3/trim-11/licao-108-qui-quadrado': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-108-qui-quadrado.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-11/licao-108-qui-quadrado.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-3/trim-11/licao-108-qui-quadrado.mdx'),
  },
  'aulas/ano-3/trim-11/licao-109-bayesiana-intro': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-109-bayesiana-intro.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-11/licao-109-bayesiana-intro.mdx'),
  },
  'aulas/ano-3/trim-11/licao-110-consolidacao-trim-11': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/licao-110-consolidacao-trim-11.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-11/licao-110-consolidacao-trim-11.mdx'),
  },
  'aulas/ano-3/trim-12/licao-111-espacos-vetoriais': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-111-espacos-vetoriais.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-12/licao-111-espacos-vetoriais.mdx'),
  },
  'aulas/ano-3/trim-12/licao-112-transformacoes-lineares': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-112-transformacoes-lineares.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-12/licao-112-transformacoes-lineares.mdx'),
  },
  'aulas/ano-3/trim-12/licao-113-nucleo-imagem': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-113-nucleo-imagem.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-12/licao-113-nucleo-imagem.mdx'),
  },
  'aulas/ano-3/trim-12/licao-114-autovalores': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-114-autovalores.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-12/licao-114-autovalores.mdx'),
  },
  'aulas/ano-3/trim-12/licao-115-diagonalizacao': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-115-diagonalizacao.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-12/licao-115-diagonalizacao.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-3/trim-12/licao-115-diagonalizacao.mdx'),
  },
  'aulas/ano-3/trim-12/licao-116-matrizes-especiais': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-116-matrizes-especiais.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-12/licao-116-matrizes-especiais.mdx'),
  },
  'aulas/ano-3/trim-12/licao-117-svd': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-117-svd.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-12/licao-117-svd.mdx'),
  },
  'aulas/ano-3/trim-12/licao-118-pca': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-118-pca.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-12/licao-118-pca.mdx'),
  },
  'aulas/ano-3/trim-12/licao-119-bs-sintese': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-119-bs-sintese.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-12/licao-119-bs-sintese.mdx'),
  },
  'aulas/ano-3/trim-12/licao-120-workshop-final': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/licao-120-workshop-final.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-12/licao-120-workshop-final.mdx'),
  },
  'aulas/ano-3/trim-9/licao-81-antiderivada': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-81-antiderivada.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-9/licao-81-antiderivada.mdx'),
  },
  'aulas/ano-3/trim-9/licao-82-integral-definida': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-82-integral-definida.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-9/licao-82-integral-definida.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-3/trim-9/licao-82-integral-definida.mdx'),
  },
  'aulas/ano-3/trim-9/licao-83-tfc': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-83-tfc.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-9/licao-83-tfc.mdx'),
  },
  'aulas/ano-3/trim-9/licao-84-substituicao': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-84-substituicao.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-9/licao-84-substituicao.mdx'),
  },
  'aulas/ano-3/trim-9/licao-85-por-partes': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-85-por-partes.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-9/licao-85-por-partes.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-3/trim-9/licao-85-por-partes.mdx'),
  },
  'aulas/ano-3/trim-9/licao-86-fracoes-parciais': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-86-fracoes-parciais.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-9/licao-86-fracoes-parciais.mdx'),
  },
  'aulas/ano-3/trim-9/licao-87-integrais-trig': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-87-integrais-trig.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-9/licao-87-integrais-trig.mdx'),
  },
  'aulas/ano-3/trim-9/licao-88-area-curvas': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-88-area-curvas.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-9/licao-88-area-curvas.mdx'),
  },
  'aulas/ano-3/trim-9/licao-89-volume': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-89-volume.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-9/licao-89-volume.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-3/trim-9/licao-89-volume.mdx'),
  },
  'aulas/ano-3/trim-9/licao-90-consolidacao-trim-9': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/licao-90-consolidacao-trim-9.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-3/trim-9/licao-90-consolidacao-trim-9.mdx'),
  },
  'calculo-1/derivadas/o-que-e-derivada': {
    'pt-BR': () => import('@/../content/calculo-1/derivadas/o-que-e-derivada.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/calculo-1/derivadas/o-que-e-derivada.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/calculo-1/derivadas/o-que-e-derivada.mdx'),
  },
  'engenharia/calculo-1/unidade-1/cal1-u1-l01-numeros-reais': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-1/cal1-u1-l01-numeros-reais.mdx'),
  },
  'engenharia/calculo-1/unidade-1/cal1-u1-l02-limite-epsilon-delta': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-1/cal1-u1-l02-limite-epsilon-delta.mdx'),
  },
  'engenharia/calculo-1/unidade-1/cal1-u1-l03-tecnicas-limites': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-1/cal1-u1-l03-tecnicas-limites.mdx'),
  },
  'engenharia/calculo-1/unidade-1/cal1-u1-l04-limites-fundamentais': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-1/cal1-u1-l04-limites-fundamentais.mdx'),
  },
  'engenharia/calculo-1/unidade-1/cal1-u1-l05-limites-infinito-assintotas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-1/cal1-u1-l05-limites-infinito-assintotas.mdx'),
  },
  'engenharia/calculo-1/unidade-1/cal1-u1-l06-continuidade': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-1/cal1-u1-l06-continuidade.mdx'),
  },
  'engenharia/calculo-1/unidade-1/cal1-u1-l07-tvi': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-1/cal1-u1-l07-tvi.mdx'),
  },
  'engenharia/calculo-1/unidade-1/cal1-u1-l08-weierstrass': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-1/cal1-u1-l08-weierstrass.mdx'),
  },
  'engenharia/calculo-1/unidade-1/cal1-u1-l09-limites-sequencias': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-1/cal1-u1-l09-limites-sequencias.mdx'),
  },
  'engenharia/calculo-1/unidade-1/cal1-u1-l10-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-1/cal1-u1-l10-workshop.mdx'),
  },
  'engenharia/calculo-1/unidade-2/cal1-u2-l11-derivada-definicao': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-2/cal1-u2-l11-derivada-definicao.mdx'),
  },
  'engenharia/calculo-1/unidade-2/cal1-u2-l12-regras-derivacao': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-2/cal1-u2-l12-regras-derivacao.mdx'),
  },
  'engenharia/calculo-1/unidade-2/cal1-u2-l13-regra-cadeia': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-2/cal1-u2-l13-regra-cadeia.mdx'),
  },
  'engenharia/calculo-1/unidade-2/cal1-u2-l14-derivadas-trig-inversas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-2/cal1-u2-l14-derivadas-trig-inversas.mdx'),
  },
  'engenharia/calculo-1/unidade-2/cal1-u2-l15-derivadas-exp-log': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-2/cal1-u2-l15-derivadas-exp-log.mdx'),
  },
  'engenharia/calculo-1/unidade-2/cal1-u2-l16-derivacao-implicita': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-2/cal1-u2-l16-derivacao-implicita.mdx'),
  },
  'engenharia/calculo-1/unidade-2/cal1-u2-l17-derivadas-ordem-superior': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-2/cal1-u2-l17-derivadas-ordem-superior.mdx'),
  },
  'engenharia/calculo-1/unidade-2/cal1-u2-l18-diferenciabilidade-aproximacao': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-2/cal1-u2-l18-diferenciabilidade-aproximacao.mdx'),
  },
  'engenharia/calculo-1/unidade-2/cal1-u2-l19-taxas-relacionadas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-2/cal1-u2-l19-taxas-relacionadas.mdx'),
  },
  'engenharia/calculo-1/unidade-2/cal1-u2-l20-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-2/cal1-u2-l20-workshop.mdx'),
  },
  'engenharia/calculo-1/unidade-3/cal1-u3-l21-tvm': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-3/cal1-u3-l21-tvm.mdx'),
  },
  'engenharia/calculo-1/unidade-3/cal1-u3-l22-crescimento-decrescimento': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-3/cal1-u3-l22-crescimento-decrescimento.mdx'),
  },
  'engenharia/calculo-1/unidade-3/cal1-u3-l23-concavidade-inflexao': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-3/cal1-u3-l23-concavidade-inflexao.mdx'),
  },
  'engenharia/calculo-1/unidade-3/cal1-u3-l24-esboco-graficos': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-3/cal1-u3-l24-esboco-graficos.mdx'),
  },
  'engenharia/calculo-1/unidade-3/cal1-u3-l25-maximos-minimos-globais': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-3/cal1-u3-l25-maximos-minimos-globais.mdx'),
  },
  'engenharia/calculo-1/unidade-3/cal1-u3-l26-otimizacao': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-3/cal1-u3-l26-otimizacao.mdx'),
  },
  'engenharia/calculo-1/unidade-3/cal1-u3-l27-lhopital': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-3/cal1-u3-l27-lhopital.mdx'),
  },
  'engenharia/calculo-1/unidade-3/cal1-u3-l28-taylor': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-3/cal1-u3-l28-taylor.mdx'),
  },
  'engenharia/calculo-1/unidade-3/cal1-u3-l29-newton-raphson': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-3/cal1-u3-l29-newton-raphson.mdx'),
  },
  'engenharia/calculo-1/unidade-3/cal1-u3-l30-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-3/cal1-u3-l30-workshop.mdx'),
  },
  'engenharia/calculo-1/unidade-4/cal1-u4-l31-somas-riemann': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-4/cal1-u4-l31-somas-riemann.mdx'),
  },
  'engenharia/calculo-1/unidade-4/cal1-u4-l32-propriedades-integral': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-4/cal1-u4-l32-propriedades-integral.mdx'),
  },
  'engenharia/calculo-1/unidade-4/cal1-u4-l33-antiderivada-integral-indefinida': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-4/cal1-u4-l33-antiderivada-integral-indefinida.mdx'),
  },
  'engenharia/calculo-1/unidade-4/cal1-u4-l34-tfc': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-4/cal1-u4-l34-tfc.mdx'),
  },
  'engenharia/calculo-1/unidade-4/cal1-u4-l35-substituicao': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-4/cal1-u4-l35-substituicao.mdx'),
  },
  'engenharia/calculo-1/unidade-4/cal1-u4-l36-area-curvas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-4/cal1-u4-l36-area-curvas.mdx'),
  },
  'engenharia/calculo-1/unidade-4/cal1-u4-l37-volumes': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-4/cal1-u4-l37-volumes.mdx'),
  },
  'engenharia/calculo-1/unidade-4/cal1-u4-l38-comprimento-arco': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-4/cal1-u4-l38-comprimento-arco.mdx'),
  },
  'engenharia/calculo-1/unidade-4/cal1-u4-l39-aplicacoes-fisicas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-4/cal1-u4-l39-aplicacoes-fisicas.mdx'),
  },
  'engenharia/calculo-1/unidade-4/cal1-u4-l40-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-1/unidade-4/cal1-u4-l40-workshop.mdx'),
  },
  'financas-quantitativas/opcoes/black-scholes': {
    'pt-BR': () => import('@/../content/financas-quantitativas/opcoes/black-scholes.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/financas-quantitativas/opcoes/black-scholes.mdx'),
  },
  'metodos-numericos/zero-de-funcoes/bissecao': {
    'pt-BR': () => import('@/../content/metodos-numericos/zero-de-funcoes/bissecao.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/metodos-numericos/zero-de-funcoes/bissecao.mdx'),
  },
  'metodos-numericos/zero-de-funcoes/newton-raphson': {
    'pt-BR': () => import('@/../content/metodos-numericos/zero-de-funcoes/newton-raphson.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/metodos-numericos/zero-de-funcoes/newton-raphson.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/metodos-numericos/zero-de-funcoes/newton-raphson.mdx'),
  },
  'engenharia/calculo-2/unidade-1/cal2-u1-l01-integracao-partes': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-1/cal2-u1-l01-integracao-partes.mdx'),
  },
  'engenharia/calculo-2/unidade-1/cal2-u1-l02-integrais-trigonometricas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-1/cal2-u1-l02-integrais-trigonometricas.mdx'),
  },
  'engenharia/calculo-2/unidade-1/cal2-u1-l03-substituicao-trigonometrica': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-1/cal2-u1-l03-substituicao-trigonometrica.mdx'),
  },
  'engenharia/calculo-2/unidade-1/cal2-u1-l04-fracoes-parciais': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-1/cal2-u1-l04-fracoes-parciais.mdx'),
  },
  'engenharia/calculo-2/unidade-1/cal2-u1-l05-funcoes-hiperbolicas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-1/cal2-u1-l05-funcoes-hiperbolicas.mdx'),
  },
  'engenharia/calculo-2/unidade-1/cal2-u1-l06-estrategias-integracao': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-1/cal2-u1-l06-estrategias-integracao.mdx'),
  },
  'engenharia/calculo-2/unidade-1/cal2-u1-l07-integrais-improprias-tipo1': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-1/cal2-u1-l07-integrais-improprias-tipo1.mdx'),
  },
  'engenharia/calculo-2/unidade-1/cal2-u1-l08-integrais-improprias-tipo2': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-1/cal2-u1-l08-integrais-improprias-tipo2.mdx'),
  },
  'engenharia/calculo-2/unidade-1/cal2-u1-l09-probabilidade-continua': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-1/cal2-u1-l09-probabilidade-continua.mdx'),
  },
  'engenharia/calculo-2/unidade-1/cal2-u1-l10-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-1/cal2-u1-l10-workshop.mdx'),
  },
  'engenharia/calculo-2/unidade-2/cal2-u2-l11-sequencias': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-2/cal2-u2-l11-sequencias.mdx'),
  },
  'engenharia/calculo-2/unidade-2/cal2-u2-l12-series-convergencia': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-2/cal2-u2-l12-series-convergencia.mdx'),
  },
  'engenharia/calculo-2/unidade-2/cal2-u2-l13-teste-integral-series-p': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-2/cal2-u2-l13-teste-integral-series-p.mdx'),
  },
  'engenharia/calculo-2/unidade-2/cal2-u2-l14-testes-comparacao': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-2/cal2-u2-l14-testes-comparacao.mdx'),
  },
  'engenharia/calculo-2/unidade-2/cal2-u2-l15-series-alternadas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-2/cal2-u2-l15-series-alternadas.mdx'),
  },
  'engenharia/calculo-2/unidade-2/cal2-u2-l16-series-potencias': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-2/cal2-u2-l16-series-potencias.mdx'),
  },
  'engenharia/calculo-2/unidade-2/cal2-u2-l17-series-taylor-maclaurin': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-2/cal2-u2-l17-series-taylor-maclaurin.mdx'),
  },
  'engenharia/calculo-2/unidade-2/cal2-u2-l18-series-fourier': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-2/cal2-u2-l18-series-fourier.mdx'),
  },
  'engenharia/calculo-2/unidade-2/cal2-u2-l19-estrategias-series': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-2/cal2-u2-l19-estrategias-series.mdx'),
  },
  'engenharia/calculo-2/unidade-2/cal2-u2-l20-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-2/cal2-u2-l20-workshop.mdx'),
  },
  'engenharia/calculo-2/unidade-3/cal2-u3-l21-edo-introducao': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-3/cal2-u3-l21-edo-introducao.mdx'),
  },
  'engenharia/calculo-2/unidade-3/cal2-u3-l22-edo-separaveis': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-3/cal2-u3-l22-edo-separaveis.mdx'),
  },
  'engenharia/calculo-2/unidade-3/cal2-u3-l23-edo-lineares-1a-ordem': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-3/cal2-u3-l23-edo-lineares-1a-ordem.mdx'),
  },
  'engenharia/calculo-2/unidade-3/cal2-u3-l24-edo-2a-ordem-homogenea': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-3/cal2-u3-l24-edo-2a-ordem-homogenea.mdx'),
  },
  'engenharia/calculo-2/unidade-3/cal2-u3-l25-edo-2a-ordem-nao-homogenea': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-3/cal2-u3-l25-edo-2a-ordem-nao-homogenea.mdx'),
  },
  'engenharia/calculo-2/unidade-3/cal2-u3-l26-transformada-laplace': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-3/cal2-u3-l26-transformada-laplace.mdx'),
  },
  'engenharia/calculo-2/unidade-3/cal2-u3-l27-sistemas-edo': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-3/cal2-u3-l27-sistemas-edo.mdx'),
  },
  'engenharia/calculo-2/unidade-3/cal2-u3-l28-metodos-numericos-edo': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-3/cal2-u3-l28-metodos-numericos-edo.mdx'),
  },
  'engenharia/calculo-2/unidade-3/cal2-u3-l29-edo-series-potencias': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-3/cal2-u3-l29-edo-series-potencias.mdx'),
  },
  'engenharia/calculo-2/unidade-3/cal2-u3-l30-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-3/cal2-u3-l30-workshop.mdx'),
  },
  'engenharia/calculo-2/unidade-4/cal2-u4-l31-integrais-duplas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-4/cal2-u4-l31-integrais-duplas.mdx'),
  },
  'engenharia/calculo-2/unidade-4/cal2-u4-l32-integrais-duplas-polares': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-4/cal2-u4-l32-integrais-duplas-polares.mdx'),
  },
  'engenharia/calculo-2/unidade-4/cal2-u4-l33-aplicacoes-integrais-duplas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-4/cal2-u4-l33-aplicacoes-integrais-duplas.mdx'),
  },
  'engenharia/calculo-2/unidade-4/cal2-u4-l34-integrais-triplas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-4/cal2-u4-l34-integrais-triplas.mdx'),
  },
  'engenharia/calculo-2/unidade-4/cal2-u4-l35-coordenadas-cilindricas-esfericas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-4/cal2-u4-l35-coordenadas-cilindricas-esfericas.mdx'),
  },
  'engenharia/calculo-2/unidade-4/cal2-u4-l36-mudanca-variaveis-jacobiano': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-4/cal2-u4-l36-mudanca-variaveis-jacobiano.mdx'),
  },
  'engenharia/calculo-2/unidade-4/cal2-u4-l37-campos-vetoriais-integrais-linha': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-4/cal2-u4-l37-campos-vetoriais-integrais-linha.mdx'),
  },
  'engenharia/calculo-2/unidade-4/cal2-u4-l38-teorema-green': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-4/cal2-u4-l38-teorema-green.mdx'),
  },
  'engenharia/calculo-2/unidade-4/cal2-u4-l39-stokes-gauss': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-4/cal2-u4-l39-stokes-gauss.mdx'),
  },
  'engenharia/calculo-2/unidade-4/cal2-u4-l40-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-2/unidade-4/cal2-u4-l40-workshop.mdx'),
  },
  'engenharia/calculo-3/unidade-1/cal3-u1-l01-funcoes-varias-variaveis': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-1/cal3-u1-l01-funcoes-varias-variaveis.mdx'),
  },
  'engenharia/calculo-3/unidade-1/cal3-u1-l02-limites-continuidade-rn': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-1/cal3-u1-l02-limites-continuidade-rn.mdx'),
  },
  'engenharia/calculo-3/unidade-1/cal3-u1-l03-derivadas-parciais': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-1/cal3-u1-l03-derivadas-parciais.mdx'),
  },
  'engenharia/calculo-3/unidade-1/cal3-u1-l04-diferenciabilidade-plano-tangente': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-1/cal3-u1-l04-diferenciabilidade-plano-tangente.mdx'),
  },
  'engenharia/calculo-3/unidade-1/cal3-u1-l05-regra-cadeia-variaveis': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-1/cal3-u1-l05-regra-cadeia-variaveis.mdx'),
  },
  'engenharia/calculo-3/unidade-1/cal3-u1-l06-derivadas-direcionais-gradiente': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-1/cal3-u1-l06-derivadas-direcionais-gradiente.mdx'),
  },
  'engenharia/calculo-3/unidade-1/cal3-u1-l07-derivadas-ordem-superior-clairaut': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-1/cal3-u1-l07-derivadas-ordem-superior-clairaut.mdx'),
  },
  'engenharia/calculo-3/unidade-1/cal3-u1-l08-funcoes-rn-rm-jacobiano': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-1/cal3-u1-l08-funcoes-rn-rm-jacobiano.mdx'),
  },
  'engenharia/calculo-3/unidade-1/cal3-u1-l09-funcoes-implicitas-tfi': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-1/cal3-u1-l09-funcoes-implicitas-tfi.mdx'),
  },
  'engenharia/calculo-3/unidade-1/cal3-u1-l10-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-1/cal3-u1-l10-workshop.mdx'),
  },
  'engenharia/calculo-3/unidade-2/cal3-u2-l11-extremos-livres-hessiana': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-2/cal3-u2-l11-extremos-livres-hessiana.mdx'),
  },
  'engenharia/calculo-3/unidade-2/cal3-u2-l12-extremos-globais-compactos': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-2/cal3-u2-l12-extremos-globais-compactos.mdx'),
  },
  'engenharia/calculo-3/unidade-2/cal3-u2-l13-lagrange-uma-restricao': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-2/cal3-u2-l13-lagrange-uma-restricao.mdx'),
  },
  'engenharia/calculo-3/unidade-2/cal3-u2-l14-lagrange-multiplas-restricoes': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-2/cal3-u2-l14-lagrange-multiplas-restricoes.mdx'),
  },
  'engenharia/calculo-3/unidade-2/cal3-u2-l15-teorema-funcao-implicita-completo': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-2/cal3-u2-l15-teorema-funcao-implicita-completo.mdx'),
  },
  'engenharia/calculo-3/unidade-2/cal3-u2-l16-teorema-funcao-inversa': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-2/cal3-u2-l16-teorema-funcao-inversa.mdx'),
  },
  'engenharia/calculo-3/unidade-2/cal3-u2-l17-curvas-frenet-serret': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-2/cal3-u2-l17-curvas-frenet-serret.mdx'),
  },
  'engenharia/calculo-3/unidade-2/cal3-u2-l18-superficies-area': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-2/cal3-u2-l18-superficies-area.mdx'),
  },
  'engenharia/calculo-3/unidade-2/cal3-u2-l19-taylor-rn-forma-quadratica': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-2/cal3-u2-l19-taylor-rn-forma-quadratica.mdx'),
  },
  'engenharia/calculo-3/unidade-2/cal3-u2-l20-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-2/cal3-u2-l20-workshop.mdx'),
  },
  'engenharia/calculo-3/unidade-3/cal3-u3-l21-introducao-edps': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-3/cal3-u3-l21-introducao-edps.mdx'),
  },
  'engenharia/calculo-3/unidade-3/cal3-u3-l22-equacao-onda-dalembert': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-3/cal3-u3-l22-equacao-onda-dalembert.mdx'),
  },
  'engenharia/calculo-3/unidade-3/cal3-u3-l23-equacao-calor-separacao': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-3/cal3-u3-l23-equacao-calor-separacao.mdx'),
  },
  'engenharia/calculo-3/unidade-3/cal3-u3-l24-laplace-harmonicas-dirichlet': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-3/cal3-u3-l24-laplace-harmonicas-dirichlet.mdx'),
  },
  'engenharia/calculo-3/unidade-3/cal3-u3-l25-fourier-edps': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-3/cal3-u3-l25-fourier-edps.mdx'),
  },
  'engenharia/calculo-3/unidade-3/cal3-u3-l26-transformada-fourier': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-3/cal3-u3-l26-transformada-fourier.mdx'),
  },
  'engenharia/calculo-3/unidade-3/cal3-u3-l27-fourier-edps-dominio-inteiro': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-3/cal3-u3-l27-fourier-edps-dominio-inteiro.mdx'),
  },
  'engenharia/calculo-3/unidade-3/cal3-u3-l28-metodo-caracteristicas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-3/cal3-u3-l28-metodo-caracteristicas.mdx'),
  },
  'engenharia/calculo-3/unidade-3/cal3-u3-l29-classificacao-edps-2a-ordem': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-3/cal3-u3-l29-classificacao-edps-2a-ordem.mdx'),
  },
  'engenharia/calculo-3/unidade-3/cal3-u3-l30-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-3/cal3-u3-l30-workshop.mdx'),
  },
  'engenharia/calculo-3/unidade-4/cal3-u4-l31-numeros-complexos-funcoes': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-4/cal3-u4-l31-numeros-complexos-funcoes.mdx'),
  },
  'engenharia/calculo-3/unidade-4/cal3-u4-l32-funcoes-analiticas-cauchy-riemann': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-4/cal3-u4-l32-funcoes-analiticas-cauchy-riemann.mdx'),
  },
  'engenharia/calculo-3/unidade-4/cal3-u4-l33-funcoes-elementares-complexas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-4/cal3-u4-l33-funcoes-elementares-complexas.mdx'),
  },
  'engenharia/calculo-3/unidade-4/cal3-u4-l34-integracao-complexa-cauchy': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-4/cal3-u4-l34-integracao-complexa-cauchy.mdx'),
  },
  'engenharia/calculo-3/unidade-4/cal3-u4-l35-series-taylor-laurent': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-4/cal3-u4-l35-series-taylor-laurent.mdx'),
  },
  'engenharia/calculo-3/unidade-4/cal3-u4-l36-singularidades-isoladas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-4/cal3-u4-l36-singularidades-isoladas.mdx'),
  },
  'engenharia/calculo-3/unidade-4/cal3-u4-l37-teorema-residuos': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-4/cal3-u4-l37-teorema-residuos.mdx'),
  },
  'engenharia/calculo-3/unidade-4/cal3-u4-l38-aplicacoes-integrais-reais': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-4/cal3-u4-l38-aplicacoes-integrais-reais.mdx'),
  },
  'engenharia/calculo-3/unidade-4/cal3-u4-l39-mapeamentos-conformes': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-4/cal3-u4-l39-mapeamentos-conformes.mdx'),
  },
  'engenharia/calculo-3/unidade-4/cal3-u4-l40-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-3/unidade-4/cal3-u4-l40-workshop.mdx'),
  },
  'engenharia/calculo-4/unidade-1/cal4-u1-l01-espacos-vetoriais': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-1/cal4-u1-l01-espacos-vetoriais.mdx'),
  },
  'engenharia/calculo-4/unidade-1/cal4-u1-l02-transformacoes-lineares': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-1/cal4-u1-l02-transformacoes-lineares.mdx'),
  },
  'engenharia/calculo-4/unidade-1/cal4-u1-l03-autovalores-autovetores': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-1/cal4-u1-l03-autovalores-autovetores.mdx'),
  },
  'engenharia/calculo-4/unidade-1/cal4-u1-l04-produto-interno-ortogonalidade': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-1/cal4-u1-l04-produto-interno-ortogonalidade.mdx'),
  },
  'engenharia/calculo-4/unidade-1/cal4-u1-l05-teorema-espectral': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-1/cal4-u1-l05-teorema-espectral.mdx'),
  },
  'engenharia/calculo-4/unidade-1/cal4-u1-l06-svd-decomposicao-singular': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-1/cal4-u1-l06-svd-decomposicao-singular.mdx'),
  },
  'engenharia/calculo-4/unidade-1/cal4-u1-l07-minimos-quadrados-regressao': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-1/cal4-u1-l07-minimos-quadrados-regressao.mdx'),
  },
  'engenharia/calculo-4/unidade-1/cal4-u1-l08-espacos-hilbert-completude': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-1/cal4-u1-l08-espacos-hilbert-completude.mdx'),
  },
  'engenharia/calculo-4/unidade-1/cal4-u1-l09-sturm-liouville': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-1/cal4-u1-l09-sturm-liouville.mdx'),
  },
  'engenharia/calculo-4/unidade-1/cal4-u1-l10-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-1/cal4-u1-l10-workshop.mdx'),
  },
  'engenharia/calculo-4/unidade-2/cal4-u2-l11-transformada-laplace-avancada': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-2/cal4-u2-l11-transformada-laplace-avancada.mdx'),
  },
  'engenharia/calculo-4/unidade-2/cal4-u2-l12-transformada-z-sistemas-discretos': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-2/cal4-u2-l12-transformada-z-sistemas-discretos.mdx'),
  },
  'engenharia/calculo-4/unidade-2/cal4-u2-l13-dft-fft-analise-espectral': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-2/cal4-u2-l13-dft-fft-analise-espectral.mdx'),
  },
  'engenharia/calculo-4/unidade-2/cal4-u2-l14-distribuicoes-schwartz': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-2/cal4-u2-l14-distribuicoes-schwartz.mdx'),
  },
  'engenharia/calculo-4/unidade-2/cal4-u2-l15-fourier-distribuicoes': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-2/cal4-u2-l15-fourier-distribuicoes.mdx'),
  },
  'engenharia/calculo-4/unidade-2/cal4-u2-l16-wavelets': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-2/cal4-u2-l16-wavelets.mdx'),
  },
  'engenharia/calculo-4/unidade-2/cal4-u2-l17-funcoes-green-odos': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-2/cal4-u2-l17-funcoes-green-odos.mdx'),
  },
  'engenharia/calculo-4/unidade-2/cal4-u2-l18-funcoes-green-edps': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-2/cal4-u2-l18-funcoes-green-edps.mdx'),
  },
  'engenharia/calculo-4/unidade-2/cal4-u2-l19-serie-autofuncoes-expansao-espectral': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-2/cal4-u2-l19-serie-autofuncoes-expansao-espectral.mdx'),
  },
  'engenharia/calculo-4/unidade-2/cal4-u2-l20-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-2/cal4-u2-l20-workshop.mdx'),
  },
  'engenharia/calculo-4/unidade-3/cal4-u3-l21-introducao-calculo-variacional': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-3/cal4-u3-l21-introducao-calculo-variacional.mdx'),
  },
  'engenharia/calculo-4/unidade-3/cal4-u3-l22-equacao-euler-lagrange-avancada': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-3/cal4-u3-l22-equacao-euler-lagrange-avancada.mdx'),
  },
  'engenharia/calculo-4/unidade-3/cal4-u3-l23-mecanica-lagrangiana': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-3/cal4-u3-l23-mecanica-lagrangiana.mdx'),
  },
  'engenharia/calculo-4/unidade-3/cal4-u3-l24-mecanica-hamiltoniana': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-3/cal4-u3-l24-mecanica-hamiltoniana.mdx'),
  },
  'engenharia/calculo-4/unidade-3/cal4-u3-l25-controle-otimo-pontryagin': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-3/cal4-u3-l25-controle-otimo-pontryagin.mdx'),
  },
  'engenharia/calculo-4/unidade-3/cal4-u3-l26-problemas-isoperimetricos': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-3/cal4-u3-l26-problemas-isoperimetricos.mdx'),
  },
  'engenharia/calculo-4/unidade-3/cal4-u3-l27-calculo-variacional-sobolev': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-3/cal4-u3-l27-calculo-variacional-sobolev.mdx'),
  },
  'engenharia/calculo-4/unidade-3/cal4-u3-l28-metodos-variacionais-edps': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-3/cal4-u3-l28-metodos-variacionais-edps.mdx'),
  },
  'engenharia/calculo-4/unidade-3/cal4-u3-l29-aplicacoes-fisica-engenharia': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-3/cal4-u3-l29-aplicacoes-fisica-engenharia.mdx'),
  },
  'engenharia/calculo-4/unidade-3/cal4-u3-l30-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-3/cal4-u3-l30-workshop.mdx'),
  },
  'engenharia/calculo-4/unidade-4/cal4-u4-l31-tensores-notacao-indices': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-4/cal4-u4-l31-tensores-notacao-indices.mdx'),
  },
  'engenharia/calculo-4/unidade-4/cal4-u4-l32-formas-diferenciais': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-4/cal4-u4-l32-formas-diferenciais.mdx'),
  },
  'engenharia/calculo-4/unidade-4/cal4-u4-l33-variedades-diferenciaveis': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-4/cal4-u4-l33-variedades-diferenciaveis.mdx'),
  },
  'engenharia/calculo-4/unidade-4/cal4-u4-l34-geometria-riemanniana': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-4/cal4-u4-l34-geometria-riemanniana.mdx'),
  },
  'engenharia/calculo-4/unidade-4/cal4-u4-l35-curvatura-geodesicas': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-4/cal4-u4-l35-curvatura-geodesicas.mdx'),
  },
  'engenharia/calculo-4/unidade-4/cal4-u4-l36-teorema-gauss-bonnet': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-4/cal4-u4-l36-teorema-gauss-bonnet.mdx'),
  },
  'engenharia/calculo-4/unidade-4/cal4-u4-l37-stokes-aplicacoes': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-4/cal4-u4-l37-stokes-aplicacoes.mdx'),
  },
  'engenharia/calculo-4/unidade-4/cal4-u4-l38-fibrados-vetoriais': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-4/cal4-u4-l38-fibrados-vetoriais.mdx'),
  },
  'engenharia/calculo-4/unidade-4/cal4-u4-l39-relatividade-geral': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-4/cal4-u4-l39-relatividade-geral.mdx'),
  },
  'engenharia/calculo-4/unidade-4/cal4-u4-l40-workshop': {
    'pt-BR': () => import('@/../content/engenharia/calculo-4/unidade-4/cal4-u4-l40-workshop.mdx'),
  },
}
