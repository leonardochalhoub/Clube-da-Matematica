import type { MDXComponents } from 'mdx/types'
import { DuasPortas, Porta } from '@/components/math/DuasPortas'
import { Equation, Eq } from '@/components/math/Equation'
import {
  Definicao,
  Teorema,
  Exemplo,
  Insight,
  Cuidado,
  Leituras,
} from '@/components/math/Callouts'

/**
 * Componentes globais disponíveis em qualquer arquivo .mdx do projeto.
 * Não exigem `import` no MDX.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    DuasPortas,
    Porta,
    Equation,
    Eq,
    Definicao,
    Teorema,
    Exemplo,
    Insight,
    Cuidado,
    Leituras,
    ...components,
  }
}
