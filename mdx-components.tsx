import type { MDXComponents } from 'mdx/types'
import { DuasPortas, Porta } from '@/components/math/DuasPortas'
import { Equation, Eq } from '@/components/math/Equation'
import { EquacaoCanonica } from '@/components/math/EquacaoCanonica'
import { PayoffChart } from '@/components/math/PayoffChart'
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
    EquacaoCanonica,
    PayoffChart,
    Definicao,
    Teorema,
    Exemplo,
    Insight,
    Cuidado,
    Leituras,
    ...components,
  }
}
