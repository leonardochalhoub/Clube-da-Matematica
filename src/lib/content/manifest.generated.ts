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
  'aulas/ano-1/trim-1/aula-01-conjuntos-intervalos': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/aula-01-conjuntos-intervalos.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-1/aula-01-conjuntos-intervalos.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/aula-01-conjuntos-intervalos.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-1/aula-01-conjuntos-intervalos.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-1/aula-01-conjuntos-intervalos.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-1/aula-01-conjuntos-intervalos.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-1/aula-01-conjuntos-intervalos.mdx'),
    'pl-PL': () => import('@/../content/i18n/pl-PL/aulas/ano-1/trim-1/aula-01-conjuntos-intervalos.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-1/aula-01-conjuntos-intervalos.mdx'),
    'zh-CN': () => import('@/../content/i18n/zh-CN/aulas/ano-1/trim-1/aula-01-conjuntos-intervalos.mdx'),
  },
  'aulas/ano-1/trim-1/aula-02-funcoes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/aula-02-funcoes.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-1/aula-02-funcoes.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-1/aula-02-funcoes.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/aula-02-funcoes.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-1/aula-02-funcoes.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-1/aula-02-funcoes.mdx'),
    'he-IL': () => import('@/../content/i18n/he-IL/aulas/ano-1/trim-1/aula-02-funcoes.mdx'),
    'hi-IN': () => import('@/../content/i18n/hi-IN/aulas/ano-1/trim-1/aula-02-funcoes.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-1/aula-02-funcoes.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-1/aula-02-funcoes.mdx'),
    'ko-KR': () => import('@/../content/i18n/ko-KR/aulas/ano-1/trim-1/aula-02-funcoes.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-1/aula-02-funcoes.mdx'),
    'zh-CN': () => import('@/../content/i18n/zh-CN/aulas/ano-1/trim-1/aula-02-funcoes.mdx'),
  },
  'aulas/ano-1/trim-1/aula-03-afim': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/aula-03-afim.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-1/aula-03-afim.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-1/aula-03-afim.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/aula-03-afim.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-1/aula-03-afim.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-1/aula-03-afim.mdx'),
    'he-IL': () => import('@/../content/i18n/he-IL/aulas/ano-1/trim-1/aula-03-afim.mdx'),
    'hi-IN': () => import('@/../content/i18n/hi-IN/aulas/ano-1/trim-1/aula-03-afim.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-1/aula-03-afim.mdx'),
  },
  'aulas/ano-1/trim-1/aula-04-quadratica': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/aula-04-quadratica.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-1/aula-04-quadratica.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/aula-04-quadratica.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-1/aula-04-quadratica.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-1/aula-04-quadratica.mdx'),
    'hi-IN': () => import('@/../content/i18n/hi-IN/aulas/ano-1/trim-1/aula-04-quadratica.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-1/aula-04-quadratica.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-1/aula-04-quadratica.mdx'),
    'ko-KR': () => import('@/../content/i18n/ko-KR/aulas/ano-1/trim-1/aula-04-quadratica.mdx'),
    'pl-PL': () => import('@/../content/i18n/pl-PL/aulas/ano-1/trim-1/aula-04-quadratica.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-1/aula-04-quadratica.mdx'),
    'zh-CN': () => import('@/../content/i18n/zh-CN/aulas/ano-1/trim-1/aula-04-quadratica.mdx'),
  },
  'aulas/ano-1/trim-1/aula-05-composicao-inversa': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/aula-05-composicao-inversa.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-1/aula-05-composicao-inversa.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-1/aula-05-composicao-inversa.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/aula-05-composicao-inversa.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-1/aula-05-composicao-inversa.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-1/aula-05-composicao-inversa.mdx'),
    'he-IL': () => import('@/../content/i18n/he-IL/aulas/ano-1/trim-1/aula-05-composicao-inversa.mdx'),
    'hi-IN': () => import('@/../content/i18n/hi-IN/aulas/ano-1/trim-1/aula-05-composicao-inversa.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-1/aula-05-composicao-inversa.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-1/aula-05-composicao-inversa.mdx'),
    'ko-KR': () => import('@/../content/i18n/ko-KR/aulas/ano-1/trim-1/aula-05-composicao-inversa.mdx'),
    'pl-PL': () => import('@/../content/i18n/pl-PL/aulas/ano-1/trim-1/aula-05-composicao-inversa.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-1/aula-05-composicao-inversa.mdx'),
    'zh-CN': () => import('@/../content/i18n/zh-CN/aulas/ano-1/trim-1/aula-05-composicao-inversa.mdx'),
  },
  'aulas/ano-1/trim-1/aula-06-exponencial': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/aula-06-exponencial.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-1/aula-06-exponencial.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-1/aula-06-exponencial.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/aula-06-exponencial.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-1/aula-06-exponencial.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-1/aula-06-exponencial.mdx'),
    'he-IL': () => import('@/../content/i18n/he-IL/aulas/ano-1/trim-1/aula-06-exponencial.mdx'),
    'hi-IN': () => import('@/../content/i18n/hi-IN/aulas/ano-1/trim-1/aula-06-exponencial.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-1/aula-06-exponencial.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-1/aula-06-exponencial.mdx'),
    'ko-KR': () => import('@/../content/i18n/ko-KR/aulas/ano-1/trim-1/aula-06-exponencial.mdx'),
    'pl-PL': () => import('@/../content/i18n/pl-PL/aulas/ano-1/trim-1/aula-06-exponencial.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-1/aula-06-exponencial.mdx'),
  },
  'aulas/ano-1/trim-1/aula-07-logaritmo': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/aula-07-logaritmo.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-1/aula-07-logaritmo.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-1/aula-07-logaritmo.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/aula-07-logaritmo.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-1/aula-07-logaritmo.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-1/aula-07-logaritmo.mdx'),
    'he-IL': () => import('@/../content/i18n/he-IL/aulas/ano-1/trim-1/aula-07-logaritmo.mdx'),
    'hi-IN': () => import('@/../content/i18n/hi-IN/aulas/ano-1/trim-1/aula-07-logaritmo.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-1/aula-07-logaritmo.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-1/aula-07-logaritmo.mdx'),
    'ko-KR': () => import('@/../content/i18n/ko-KR/aulas/ano-1/trim-1/aula-07-logaritmo.mdx'),
    'pl-PL': () => import('@/../content/i18n/pl-PL/aulas/ano-1/trim-1/aula-07-logaritmo.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-1/aula-07-logaritmo.mdx'),
  },
  'aulas/ano-1/trim-1/aula-08-crescimento': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/aula-08-crescimento.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-1/aula-08-crescimento.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-1/aula-08-crescimento.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/aula-08-crescimento.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-1/aula-08-crescimento.mdx'),
  },
  'aulas/ano-1/trim-1/aula-09-taxa-variacao': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/aula-09-taxa-variacao.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/aula-09-taxa-variacao.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-1/aula-09-taxa-variacao.mdx'),
  },
  'aulas/ano-1/trim-1/aula-10-consolidacao-trim-1': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-1/aula-10-consolidacao-trim-1.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-1/aula-10-consolidacao-trim-1.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-1/aula-10-consolidacao-trim-1.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-1/aula-10-consolidacao-trim-1.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-1/aula-10-consolidacao-trim-1.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-1/aula-10-consolidacao-trim-1.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-1/aula-10-consolidacao-trim-1.mdx'),
    'zh-CN': () => import('@/../content/i18n/zh-CN/aulas/ano-1/trim-1/aula-10-consolidacao-trim-1.mdx'),
  },
  'aulas/ano-1/trim-2/aula-11-trig-triangulo': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/aula-11-trig-triangulo.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/aula-11-trig-triangulo.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-2/aula-11-trig-triangulo.mdx'),
  },
  'aulas/ano-1/trim-2/aula-12-circulo-trigonometrico': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/aula-12-circulo-trigonometrico.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/aula-12-circulo-trigonometrico.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-2/aula-12-circulo-trigonometrico.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-2/aula-12-circulo-trigonometrico.mdx'),
  },
  'aulas/ano-1/trim-2/aula-13-funcoes-trigonometricas': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/aula-13-funcoes-trigonometricas.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-2/aula-13-funcoes-trigonometricas.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/aula-13-funcoes-trigonometricas.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-2/aula-13-funcoes-trigonometricas.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-2/aula-13-funcoes-trigonometricas.mdx'),
  },
  'aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas.mdx'),
    'he-IL': () => import('@/../content/i18n/he-IL/aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas.mdx'),
    'ko-KR': () => import('@/../content/i18n/ko-KR/aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas.mdx'),
    'pl-PL': () => import('@/../content/i18n/pl-PL/aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas.mdx'),
    'zh-CN': () => import('@/../content/i18n/zh-CN/aulas/ano-1/trim-2/aula-14-equacoes-trigonometricas.mdx'),
  },
  'aulas/ano-1/trim-2/aula-15-leis-senos-cossenos': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/aula-15-leis-senos-cossenos.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-2/aula-15-leis-senos-cossenos.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/aula-15-leis-senos-cossenos.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-2/aula-15-leis-senos-cossenos.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-2/aula-15-leis-senos-cossenos.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-2/aula-15-leis-senos-cossenos.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-2/aula-15-leis-senos-cossenos.mdx'),
    'ko-KR': () => import('@/../content/i18n/ko-KR/aulas/ano-1/trim-2/aula-15-leis-senos-cossenos.mdx'),
    'pl-PL': () => import('@/../content/i18n/pl-PL/aulas/ano-1/trim-2/aula-15-leis-senos-cossenos.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-2/aula-15-leis-senos-cossenos.mdx'),
  },
  'aulas/ano-1/trim-2/aula-16-sequencias': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/aula-16-sequencias.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-2/aula-16-sequencias.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-2/aula-16-sequencias.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/aula-16-sequencias.mdx'),
  },
  'aulas/ano-1/trim-2/aula-17-pa': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/aula-17-pa.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-2/aula-17-pa.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-2/aula-17-pa.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/aula-17-pa.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-2/aula-17-pa.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-2/aula-17-pa.mdx'),
  },
  'aulas/ano-1/trim-2/aula-18-pg': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/aula-18-pg.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-2/aula-18-pg.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/aula-18-pg.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-2/aula-18-pg.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-2/aula-18-pg.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-2/aula-18-pg.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-2/aula-18-pg.mdx'),
    'ko-KR': () => import('@/../content/i18n/ko-KR/aulas/ano-1/trim-2/aula-18-pg.mdx'),
    'pl-PL': () => import('@/../content/i18n/pl-PL/aulas/ano-1/trim-2/aula-18-pg.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-2/aula-18-pg.mdx'),
    'zh-CN': () => import('@/../content/i18n/zh-CN/aulas/ano-1/trim-2/aula-18-pg.mdx'),
  },
  'aulas/ano-1/trim-2/aula-19-limite-intuitivo': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/aula-19-limite-intuitivo.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-2/aula-19-limite-intuitivo.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-2/aula-19-limite-intuitivo.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/aula-19-limite-intuitivo.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-2/aula-19-limite-intuitivo.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-2/aula-19-limite-intuitivo.mdx'),
    'he-IL': () => import('@/../content/i18n/he-IL/aulas/ano-1/trim-2/aula-19-limite-intuitivo.mdx'),
    'hi-IN': () => import('@/../content/i18n/hi-IN/aulas/ano-1/trim-2/aula-19-limite-intuitivo.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-2/aula-19-limite-intuitivo.mdx'),
  },
  'aulas/ano-1/trim-2/aula-20-consolidacao-trim-2': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-2/aula-20-consolidacao-trim-2.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-2/aula-20-consolidacao-trim-2.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-2/aula-20-consolidacao-trim-2.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-2/aula-20-consolidacao-trim-2.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-2/aula-20-consolidacao-trim-2.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-2/aula-20-consolidacao-trim-2.mdx'),
  },
  'aulas/ano-1/trim-3/aula-21-plano-cartesiano': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/aula-21-plano-cartesiano.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-3/aula-21-plano-cartesiano.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-3/aula-21-plano-cartesiano.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/aula-21-plano-cartesiano.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-3/aula-21-plano-cartesiano.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-3/aula-21-plano-cartesiano.mdx'),
    'he-IL': () => import('@/../content/i18n/he-IL/aulas/ano-1/trim-3/aula-21-plano-cartesiano.mdx'),
    'hi-IN': () => import('@/../content/i18n/hi-IN/aulas/ano-1/trim-3/aula-21-plano-cartesiano.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-3/aula-21-plano-cartesiano.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-3/aula-21-plano-cartesiano.mdx'),
    'ko-KR': () => import('@/../content/i18n/ko-KR/aulas/ano-1/trim-3/aula-21-plano-cartesiano.mdx'),
  },
  'aulas/ano-1/trim-3/aula-22-equacao-reta': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/aula-22-equacao-reta.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-3/aula-22-equacao-reta.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-3/aula-22-equacao-reta.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/aula-22-equacao-reta.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-3/aula-22-equacao-reta.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-3/aula-22-equacao-reta.mdx'),
    'he-IL': () => import('@/../content/i18n/he-IL/aulas/ano-1/trim-3/aula-22-equacao-reta.mdx'),
    'hi-IN': () => import('@/../content/i18n/hi-IN/aulas/ano-1/trim-3/aula-22-equacao-reta.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-3/aula-22-equacao-reta.mdx'),
  },
  'aulas/ano-1/trim-3/aula-23-posicao-relativa-retas': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/aula-23-posicao-relativa-retas.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-3/aula-23-posicao-relativa-retas.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-3/aula-23-posicao-relativa-retas.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/aula-23-posicao-relativa-retas.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-3/aula-23-posicao-relativa-retas.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-3/aula-23-posicao-relativa-retas.mdx'),
    'he-IL': () => import('@/../content/i18n/he-IL/aulas/ano-1/trim-3/aula-23-posicao-relativa-retas.mdx'),
    'hi-IN': () => import('@/../content/i18n/hi-IN/aulas/ano-1/trim-3/aula-23-posicao-relativa-retas.mdx'),
  },
  'aulas/ano-1/trim-3/aula-24-circunferencia': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/aula-24-circunferencia.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-3/aula-24-circunferencia.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-3/aula-24-circunferencia.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/aula-24-circunferencia.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-3/aula-24-circunferencia.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-3/aula-24-circunferencia.mdx'),
    'he-IL': () => import('@/../content/i18n/he-IL/aulas/ano-1/trim-3/aula-24-circunferencia.mdx'),
    'hi-IN': () => import('@/../content/i18n/hi-IN/aulas/ano-1/trim-3/aula-24-circunferencia.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-3/aula-24-circunferencia.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-3/aula-24-circunferencia.mdx'),
    'ko-KR': () => import('@/../content/i18n/ko-KR/aulas/ano-1/trim-3/aula-24-circunferencia.mdx'),
    'pl-PL': () => import('@/../content/i18n/pl-PL/aulas/ano-1/trim-3/aula-24-circunferencia.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-3/aula-24-circunferencia.mdx'),
    'zh-CN': () => import('@/../content/i18n/zh-CN/aulas/ano-1/trim-3/aula-24-circunferencia.mdx'),
  },
  'aulas/ano-1/trim-3/aula-25-conicas': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/aula-25-conicas.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/aula-25-conicas.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-3/aula-25-conicas.mdx'),
  },
  'aulas/ano-1/trim-3/aula-26-vetores-plano': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/aula-26-vetores-plano.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-3/aula-26-vetores-plano.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/aula-26-vetores-plano.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-3/aula-26-vetores-plano.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-3/aula-26-vetores-plano.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-3/aula-26-vetores-plano.mdx'),
    'pl-PL': () => import('@/../content/i18n/pl-PL/aulas/ano-1/trim-3/aula-26-vetores-plano.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-3/aula-26-vetores-plano.mdx'),
  },
  'aulas/ano-1/trim-3/aula-27-produto-escalar': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/aula-27-produto-escalar.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-3/aula-27-produto-escalar.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/aula-27-produto-escalar.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-3/aula-27-produto-escalar.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-3/aula-27-produto-escalar.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-3/aula-27-produto-escalar.mdx'),
    'pl-PL': () => import('@/../content/i18n/pl-PL/aulas/ano-1/trim-3/aula-27-produto-escalar.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-3/aula-27-produto-escalar.mdx'),
  },
  'aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
    'he-IL': () => import('@/../content/i18n/he-IL/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
    'hi-IN': () => import('@/../content/i18n/hi-IN/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
    'ko-KR': () => import('@/../content/i18n/ko-KR/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
    'pl-PL': () => import('@/../content/i18n/pl-PL/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
    'sw-KE': () => import('@/../content/i18n/sw-KE/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
    'zh-CN': () => import('@/../content/i18n/zh-CN/aulas/ano-1/trim-3/aula-28-aplicacoes-vetores-fisica.mdx'),
  },
  'aulas/ano-1/trim-3/aula-29-sistemas-lineares': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/aula-29-sistemas-lineares.mdx'),
  },
  'aulas/ano-1/trim-3/aula-30-consolidacao-trim-3': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-3/aula-30-consolidacao-trim-3.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-3/aula-30-consolidacao-trim-3.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-3/aula-30-consolidacao-trim-3.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-3/aula-30-consolidacao-trim-3.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-3/aula-30-consolidacao-trim-3.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-3/aula-30-consolidacao-trim-3.mdx'),
    'he-IL': () => import('@/../content/i18n/he-IL/aulas/ano-1/trim-3/aula-30-consolidacao-trim-3.mdx'),
    'hi-IN': () => import('@/../content/i18n/hi-IN/aulas/ano-1/trim-3/aula-30-consolidacao-trim-3.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-3/aula-30-consolidacao-trim-3.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-3/aula-30-consolidacao-trim-3.mdx'),
    'ko-KR': () => import('@/../content/i18n/ko-KR/aulas/ano-1/trim-3/aula-30-consolidacao-trim-3.mdx'),
    'pl-PL': () => import('@/../content/i18n/pl-PL/aulas/ano-1/trim-3/aula-30-consolidacao-trim-3.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-3/aula-30-consolidacao-trim-3.mdx'),
    'zh-CN': () => import('@/../content/i18n/zh-CN/aulas/ano-1/trim-3/aula-30-consolidacao-trim-3.mdx'),
  },
  'aulas/ano-1/trim-4/aula-31-matrizes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/aula-31-matrizes.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-4/aula-31-matrizes.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-4/aula-31-matrizes.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-4/aula-31-matrizes.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-4/aula-31-matrizes.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-4/aula-31-matrizes.mdx'),
  },
  'aulas/ano-1/trim-4/aula-32-operacoes-matrizes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/aula-32-operacoes-matrizes.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-4/aula-32-operacoes-matrizes.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-4/aula-32-operacoes-matrizes.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-4/aula-32-operacoes-matrizes.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-4/aula-32-operacoes-matrizes.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-4/aula-32-operacoes-matrizes.mdx'),
    'he-IL': () => import('@/../content/i18n/he-IL/aulas/ano-1/trim-4/aula-32-operacoes-matrizes.mdx'),
    'hi-IN': () => import('@/../content/i18n/hi-IN/aulas/ano-1/trim-4/aula-32-operacoes-matrizes.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-4/aula-32-operacoes-matrizes.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-4/aula-32-operacoes-matrizes.mdx'),
    'ko-KR': () => import('@/../content/i18n/ko-KR/aulas/ano-1/trim-4/aula-32-operacoes-matrizes.mdx'),
    'pl-PL': () => import('@/../content/i18n/pl-PL/aulas/ano-1/trim-4/aula-32-operacoes-matrizes.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-4/aula-32-operacoes-matrizes.mdx'),
    'zh-CN': () => import('@/../content/i18n/zh-CN/aulas/ano-1/trim-4/aula-32-operacoes-matrizes.mdx'),
  },
  'aulas/ano-1/trim-4/aula-33-transposta-inversa': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/aula-33-transposta-inversa.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-4/aula-33-transposta-inversa.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-4/aula-33-transposta-inversa.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-4/aula-33-transposta-inversa.mdx'),
  },
  'aulas/ano-1/trim-4/aula-34-determinantes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/aula-34-determinantes.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-4/aula-34-determinantes.mdx'),
    'de-DE': () => import('@/../content/i18n/de-DE/aulas/ano-1/trim-4/aula-34-determinantes.mdx'),
    'en-US': () => import('@/../content/i18n/en-US/aulas/ano-1/trim-4/aula-34-determinantes.mdx'),
    'es-ES': () => import('@/../content/i18n/es-ES/aulas/ano-1/trim-4/aula-34-determinantes.mdx'),
    'fr-FR': () => import('@/../content/i18n/fr-FR/aulas/ano-1/trim-4/aula-34-determinantes.mdx'),
    'he-IL': () => import('@/../content/i18n/he-IL/aulas/ano-1/trim-4/aula-34-determinantes.mdx'),
    'hi-IN': () => import('@/../content/i18n/hi-IN/aulas/ano-1/trim-4/aula-34-determinantes.mdx'),
    'it-IT': () => import('@/../content/i18n/it-IT/aulas/ano-1/trim-4/aula-34-determinantes.mdx'),
    'ja-JP': () => import('@/../content/i18n/ja-JP/aulas/ano-1/trim-4/aula-34-determinantes.mdx'),
    'ko-KR': () => import('@/../content/i18n/ko-KR/aulas/ano-1/trim-4/aula-34-determinantes.mdx'),
    'pl-PL': () => import('@/../content/i18n/pl-PL/aulas/ano-1/trim-4/aula-34-determinantes.mdx'),
    'ru-RU': () => import('@/../content/i18n/ru-RU/aulas/ano-1/trim-4/aula-34-determinantes.mdx'),
    'zh-CN': () => import('@/../content/i18n/zh-CN/aulas/ano-1/trim-4/aula-34-determinantes.mdx'),
  },
  'aulas/ano-1/trim-4/aula-35-sistemas-via-matrizes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/aula-35-sistemas-via-matrizes.mdx'),
    'ar-LB': () => import('@/../content/i18n/ar-LB/aulas/ano-1/trim-4/aula-35-sistemas-via-matrizes.mdx'),
  },
  'aulas/ano-1/trim-4/aula-36-pfc': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/aula-36-pfc.mdx'),
  },
  'aulas/ano-1/trim-4/aula-37-permutacoes-arranjos': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/aula-37-permutacoes-arranjos.mdx'),
  },
  'aulas/ano-1/trim-4/aula-38-combinacoes': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/aula-38-combinacoes.mdx'),
  },
  'aulas/ano-1/trim-4/aula-39-probabilidade': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/aula-39-probabilidade.mdx'),
  },
  'aulas/ano-1/trim-4/aula-40-consolidacao-anual': {
    'pt-BR': () => import('@/../content/aulas/ano-1/trim-4/aula-40-consolidacao-anual.mdx'),
  },
  'aulas/ano-2/trim-5/aula-41-limite-formal': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/aula-41-limite-formal.mdx'),
  },
  'aulas/ano-2/trim-5/aula-42-propriedades-limites': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/aula-42-propriedades-limites.mdx'),
  },
  'aulas/ano-2/trim-5/aula-43-continuidade': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/aula-43-continuidade.mdx'),
  },
  'aulas/ano-2/trim-5/aula-44-limites-laterais': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/aula-44-limites-laterais.mdx'),
  },
  'aulas/ano-2/trim-5/aula-45-limites-fundamentais': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/aula-45-limites-fundamentais.mdx'),
  },
  'aulas/ano-2/trim-5/aula-46-tvi-tvm': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/aula-46-tvi-tvm.mdx'),
  },
  'aulas/ano-2/trim-5/aula-47-assintotas': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/aula-47-assintotas.mdx'),
  },
  'aulas/ano-2/trim-5/aula-48-limites-funcoes-trig': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/aula-48-limites-funcoes-trig.mdx'),
  },
  'aulas/ano-2/trim-5/aula-49-limite-sequencias': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/aula-49-limite-sequencias.mdx'),
  },
  'aulas/ano-2/trim-5/aula-50-consolidacao-trim-5': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-5/aula-50-consolidacao-trim-5.mdx'),
  },
  'aulas/ano-2/trim-6/aula-51-derivada-definicao': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/aula-51-derivada-definicao.mdx'),
  },
  'aulas/ano-2/trim-6/aula-52-regras-derivacao': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/aula-52-regras-derivacao.mdx'),
  },
  'aulas/ano-2/trim-6/aula-53-regra-cadeia': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/aula-53-regra-cadeia.mdx'),
  },
  'aulas/ano-2/trim-6/aula-54-derivadas-implicitas': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/aula-54-derivadas-implicitas.mdx'),
  },
  'aulas/ano-2/trim-6/aula-55-derivadas-superiores': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/aula-55-derivadas-superiores.mdx'),
  },
  'aulas/ano-2/trim-6/aula-56-derivadas-inversas': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/aula-56-derivadas-inversas.mdx'),
  },
  'aulas/ano-2/trim-6/aula-57-aproximacao-linear': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/aula-57-aproximacao-linear.mdx'),
  },
  'aulas/ano-2/trim-6/aula-58-taxas-relacionadas': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/aula-58-taxas-relacionadas.mdx'),
  },
  'aulas/ano-2/trim-6/aula-59-diferenciabilidade': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/aula-59-diferenciabilidade.mdx'),
  },
  'aulas/ano-2/trim-6/aula-60-consolidacao-trim-6': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-6/aula-60-consolidacao-trim-6.mdx'),
  },
  'aulas/ano-2/trim-7/aula-61-maximos-minimos': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/aula-61-maximos-minimos.mdx'),
  },
  'aulas/ano-2/trim-7/aula-62-otimizacao': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/aula-62-otimizacao.mdx'),
  },
  'aulas/ano-2/trim-7/aula-63-esboco-graficos': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/aula-63-esboco-graficos.mdx'),
  },
  'aulas/ano-2/trim-7/aula-64-l-hopital': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/aula-64-l-hopital.mdx'),
  },
  'aulas/ano-2/trim-7/aula-65-taylor': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/aula-65-taylor.mdx'),
  },
  'aulas/ano-2/trim-7/aula-66-concavidade': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/aula-66-concavidade.mdx'),
  },
  'aulas/ano-2/trim-7/aula-67-economia-derivadas': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/aula-67-economia-derivadas.mdx'),
  },
  'aulas/ano-2/trim-7/aula-68-cinematica': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/aula-68-cinematica.mdx'),
  },
  'aulas/ano-2/trim-7/aula-69-newton-raphson': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/aula-69-newton-raphson.mdx'),
  },
  'aulas/ano-2/trim-7/aula-70-consolidacao-trim-7': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-7/aula-70-consolidacao-trim-7.mdx'),
  },
  'aulas/ano-2/trim-8/aula-71-medidas-centrais': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/aula-71-medidas-centrais.mdx'),
  },
  'aulas/ano-2/trim-8/aula-72-variancia': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/aula-72-variancia.mdx'),
  },
  'aulas/ano-2/trim-8/aula-73-quartis': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/aula-73-quartis.mdx'),
  },
  'aulas/ano-2/trim-8/aula-74-va-discreta': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/aula-74-va-discreta.mdx'),
  },
  'aulas/ano-2/trim-8/aula-75-binomial': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/aula-75-binomial.mdx'),
  },
  'aulas/ano-2/trim-8/aula-76-normal': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/aula-76-normal.mdx'),
  },
  'aulas/ano-2/trim-8/aula-77-tcl': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/aula-77-tcl.mdx'),
  },
  'aulas/ano-2/trim-8/aula-78-correlacao': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/aula-78-correlacao.mdx'),
  },
  'aulas/ano-2/trim-8/aula-79-bayes-aprofundado': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/aula-79-bayes-aprofundado.mdx'),
  },
  'aulas/ano-2/trim-8/aula-80-consolidacao-trim-8': {
    'pt-BR': () => import('@/../content/aulas/ano-2/trim-8/aula-80-consolidacao-trim-8.mdx'),
  },
  'aulas/ano-3/trim-10/aula-100-consolidacao-trim-10': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/aula-100-consolidacao-trim-10.mdx'),
  },
  'aulas/ano-3/trim-10/aula-91-edo-intro': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/aula-91-edo-intro.mdx'),
  },
  'aulas/ano-3/trim-10/aula-92-edo-separavel': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/aula-92-edo-separavel.mdx'),
  },
  'aulas/ano-3/trim-10/aula-93-edo-linear-1': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/aula-93-edo-linear-1.mdx'),
  },
  'aulas/ano-3/trim-10/aula-94-edo-populacional': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/aula-94-edo-populacional.mdx'),
  },
  'aulas/ano-3/trim-10/aula-95-edo-2-ordem': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/aula-95-edo-2-ordem.mdx'),
  },
  'aulas/ano-3/trim-10/aula-96-vibracoes': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/aula-96-vibracoes.mdx'),
  },
  'aulas/ano-3/trim-10/aula-97-rlc': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/aula-97-rlc.mdx'),
  },
  'aulas/ano-3/trim-10/aula-98-euler-numerico': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/aula-98-euler-numerico.mdx'),
  },
  'aulas/ano-3/trim-10/aula-99-newton-resfriamento': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-10/aula-99-newton-resfriamento.mdx'),
  },
  'aulas/ano-3/trim-11/aula-101-amostragem': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/aula-101-amostragem.mdx'),
  },
  'aulas/ano-3/trim-11/aula-102-ic-media': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/aula-102-ic-media.mdx'),
  },
  'aulas/ano-3/trim-11/aula-103-teste-hipotese': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/aula-103-teste-hipotese.mdx'),
  },
  'aulas/ano-3/trim-11/aula-104-teste-z-t': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/aula-104-teste-z-t.mdx'),
  },
  'aulas/ano-3/trim-11/aula-105-regressao-simples': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/aula-105-regressao-simples.mdx'),
  },
  'aulas/ano-3/trim-11/aula-106-regressao-multipla': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/aula-106-regressao-multipla.mdx'),
  },
  'aulas/ano-3/trim-11/aula-107-anova': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/aula-107-anova.mdx'),
  },
  'aulas/ano-3/trim-11/aula-108-qui-quadrado': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/aula-108-qui-quadrado.mdx'),
  },
  'aulas/ano-3/trim-11/aula-109-bayesiana-intro': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/aula-109-bayesiana-intro.mdx'),
  },
  'aulas/ano-3/trim-11/aula-110-consolidacao-trim-11': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-11/aula-110-consolidacao-trim-11.mdx'),
  },
  'aulas/ano-3/trim-12/aula-111-espacos-vetoriais': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/aula-111-espacos-vetoriais.mdx'),
  },
  'aulas/ano-3/trim-12/aula-112-transformacoes-lineares': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/aula-112-transformacoes-lineares.mdx'),
  },
  'aulas/ano-3/trim-12/aula-113-nucleo-imagem': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/aula-113-nucleo-imagem.mdx'),
  },
  'aulas/ano-3/trim-12/aula-114-autovalores': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/aula-114-autovalores.mdx'),
  },
  'aulas/ano-3/trim-12/aula-115-diagonalizacao': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/aula-115-diagonalizacao.mdx'),
  },
  'aulas/ano-3/trim-12/aula-116-matrizes-especiais': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/aula-116-matrizes-especiais.mdx'),
  },
  'aulas/ano-3/trim-12/aula-117-svd': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/aula-117-svd.mdx'),
  },
  'aulas/ano-3/trim-12/aula-118-pca': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/aula-118-pca.mdx'),
  },
  'aulas/ano-3/trim-12/aula-119-bs-sintese': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/aula-119-bs-sintese.mdx'),
  },
  'aulas/ano-3/trim-12/aula-120-workshop-final': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-12/aula-120-workshop-final.mdx'),
  },
  'aulas/ano-3/trim-9/aula-81-antiderivada': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/aula-81-antiderivada.mdx'),
  },
  'aulas/ano-3/trim-9/aula-82-integral-definida': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/aula-82-integral-definida.mdx'),
  },
  'aulas/ano-3/trim-9/aula-83-tfc': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/aula-83-tfc.mdx'),
  },
  'aulas/ano-3/trim-9/aula-84-substituicao': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/aula-84-substituicao.mdx'),
  },
  'aulas/ano-3/trim-9/aula-85-por-partes': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/aula-85-por-partes.mdx'),
  },
  'aulas/ano-3/trim-9/aula-86-fracoes-parciais': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/aula-86-fracoes-parciais.mdx'),
  },
  'aulas/ano-3/trim-9/aula-87-integrais-trig': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/aula-87-integrais-trig.mdx'),
  },
  'aulas/ano-3/trim-9/aula-88-area-curvas': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/aula-88-area-curvas.mdx'),
  },
  'aulas/ano-3/trim-9/aula-89-volume': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/aula-89-volume.mdx'),
  },
  'aulas/ano-3/trim-9/aula-90-consolidacao-trim-9': {
    'pt-BR': () => import('@/../content/aulas/ano-3/trim-9/aula-90-consolidacao-trim-9.mdx'),
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
