import type { ComponentPropsWithoutRef } from 'react'
import type { MDXComponents } from 'mdx/types'
import { DuasPortas, Porta } from '@/components/math/DuasPortas'
import { Equation, Eq } from '@/components/math/Equation'
import { EquacaoCanonica } from '@/components/math/EquacaoCanonica'
import { PayoffChart } from '@/components/math/PayoffChart'
import { ListaExercicios, Exercicio } from '@/components/math/ListaExercicios'
import { VerificarPasso } from '@/components/math/VerificarPasso'
import {
  Definicao,
  Teorema,
  Exemplo,
  Insight,
  Cuidado,
  Leituras,
} from '@/components/math/Callouts'

/**
 * `<th>` acessível: garante `scope="col"` se o autor não definiu.
 * Tabelas MDX em GFM geram `<th>` puro, sem `scope` — leitor de tela
 * fica perdido em tabelas com mais de 1 coluna. Com `scope="col"`
 * cada célula é narrada com seu cabeçalho.
 */
function MdxTh({ scope, ...rest }: ComponentPropsWithoutRef<'th'>) {
  return <th scope={scope ?? 'col'} {...rest} />
}

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
    ListaExercicios,
    Exercicio,
    VerificarPasso,
    Definicao,
    Teorema,
    Exemplo,
    Insight,
    Cuidado,
    Leituras,
    th: MdxTh,
    ...components,
  }
}
