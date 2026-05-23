/**
 * Manifesto de conteúdos MDX — carregamento localizado via webpack.
 *
 * O `manifesto` antigo (120+ importações de aulas) foi removido daqui porque
 * causava freeze na compilação da rota /[categoria]/[...caminho]: o webpack
 * via TODOS os import() estáticos e compilava ~130 arquivos MDX de uma só vez
 * mesmo que apenas 1 lição estivesse sendo acessada.
 *
 * Hoje só `manifestoI18n` (≤ 10 entradas) é necessário para essa rota.
 */

import { manifestoI18n } from './manifest.generated'
import { LOCALES, type Locale } from '@/lib/i18n/locales'

/**
 * Carrega o módulo MDX traduzido para o `locale` desejado.
 *
 * Usa `manifestoI18n` (gerado por scripts/generate-manifest.ts) que contém
 * APENAS lições com `publicado: true`. Isso mantém o módulo graph pequeno
 * o bastante para compilar em ~5s em vez de 10+ minutos.
 *
 * Fallback: se a tradução não existe, devolve o módulo PT-BR.
 */
export async function carregarMdxLocalizado(
  caminho: string,
  locale: string,
) {
  const localized = manifestoI18n[caminho]
  if (!localized) return null
  const manifestKey =
    locale === 'pt-BR' ? 'pt-BR' : LOCALES[locale as Locale]?.speechLang
  const loader =
    (manifestKey ? localized[manifestKey] : undefined) ?? localized['pt-BR']
  if (!loader) return null
  return loader()
}
