/**
 * Programa de Engenharia — Cálculo Diferencial e Integral I, II, III e IV.
 *
 * Calibrado pelos planos de ensino de:
 *   - USP (MAC0105 / MAT0111-0116)
 *   - ITA (MA-011, MA-012, MA-021)
 *   - UNICAMP (MA111, MA211, MA311)
 *
 * Referências bibliográficas primárias (OER onde possível):
 *   - Stewart, J. — Cálculo (vols. I e II) — Cengage, 8ª ed.
 *   - Guidorizzi, H. L. — Um Curso de Cálculo (vols. 1–4) — LTC
 *   - Apostol, T. — Calculus (vols. I e II) — Wiley
 *   - Active Calculus (Boelkins) — CC-BY-NC-SA
 *   - OpenStax Calculus I/II/III — CC-BY
 *   - REAMAT (USP) — CC-BY-SA
 *
 * Estrutura: 4 disciplinas × 4 unidades × 10 lições = 160 lições.
 * Cada lição ≈ 4h (1h teoria + 3h exercícios), totalizando ~640h.
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type DisciplinaEng =
  | 'calculo-1'
  | 'calculo-2'
  | 'calculo-3'
  | 'calculo-4'

export type MateriaEng =
  // Cálculo 1
  | 'limites-continuidade'
  | 'derivada-1'
  | 'aplicacoes-derivada-1'
  | 'integral-1'
  // Cálculo 2
  | 'tecnicas-integracao'
  | 'integrais-impróprias-series'
  | 'series-taylor'
  | 'equacoes-diferenciais-1'
  // Cálculo 3
  | 'funcoes-varias-variaveis'
  | 'derivadas-parciais'
  | 'integrais-multiplas'
  | 'calculo-vetorial'
  // Cálculo 4
  | 'edo-avancado'
  | 'transformadas'
  | 'analise-numerica'
  | 'topicos-avancados'

export const MATERIAS_ENG_LABEL: Record<MateriaEng, string> = {
  'limites-continuidade': 'Limites e Continuidade',
  'derivada-1': 'Derivadas',
  'aplicacoes-derivada-1': 'Aplicações da Derivada',
  'integral-1': 'Integral',
  'tecnicas-integracao': 'Técnicas de Integração',
  'integrais-impróprias-series': 'Integrais Impróprias e Sequências',
  'series-taylor': 'Séries e Taylor',
  'equacoes-diferenciais-1': 'EDOs de 1ª Ordem',
  'funcoes-varias-variaveis': 'Funções de Várias Variáveis',
  'derivadas-parciais': 'Derivadas Parciais',
  'integrais-multiplas': 'Integrais Múltiplas',
  'calculo-vetorial': 'Cálculo Vetorial',
  'edo-avancado': 'EDOs de 2ª Ordem e Sistemas',
  'transformadas': 'Transformadas de Laplace e Fourier',
  'analise-numerica': 'Análise Numérica',
  'topicos-avancados': 'Tópicos Avançados',
}

export const MATERIAS_ENG_DESCRICAO: Record<MateriaEng, string> = {
  'limites-continuidade':
    'Fundação rigorosa: definição ε-δ de Cauchy-Weierstrass, continuidade e o TVI.',
  'derivada-1':
    'Derivada como limite do quociente de Newton, regras algébricas, derivadas notáveis.',
  'aplicacoes-derivada-1':
    'Otimização, esboço de curvas, L\'Hôpital, polinômio de Taylor e aplicações em engenharia.',
  'integral-1':
    'Integral de Riemann, TFC (Newton-Leibniz), primitivas imediatas e área.',
  'tecnicas-integracao':
    'Substituição trigonométrica, partes, frações parciais, integrais de funções especiais.',
  'integrais-impróprias-series':
    'Integrais impróprias, sequências, séries numéricas e critérios de convergência.',
  'series-taylor':
    'Séries de potências, raio de convergência, Taylor e Maclaurin, aproximações.',
  'equacoes-diferenciais-1':
    'EDOs de 1ª ordem: separáveis, lineares, Bernoulli, equações exatas e fator integrante.',
  'funcoes-varias-variaveis':
    'Topologia em ℝⁿ, curvas de nível, limites e continuidade em várias variáveis.',
  'derivadas-parciais':
    'Derivadas parciais, regra da cadeia, gradiente, plano tangente, diferencial total.',
  'integrais-multiplas':
    'Integrais duplas e triplas, mudança de variáveis, coordenadas polares, cilíndricas e esféricas.',
  'calculo-vetorial':
    'Campos vetoriais, integrais de linha e de superfície, teoremas de Green, Stokes e Gauss.',
  'edo-avancado':
    'EDOs lineares de 2ª ordem, método da variação dos parâmetros, sistemas de EDOs.',
  'transformadas':
    'Transformada de Laplace: resolução de EDOs e sistemas; Série de Fourier e transformada de Fourier.',
  'analise-numerica':
    'Erros, zeros de funções, interpolação, integração numérica, métodos para EDOs.',
  'topicos-avancados':
    'Equações diferenciais parciais: ondas, calor, Laplace. Introdução à análise complexa.',
}

// ─── Interfaces (compatíveis com programa-em.ts) ──────────────────────────────

export interface LicaoEng {
  num: number
  titulo: string
  /** Tópicos cobertos na lição. */
  topicos: string
  materia: MateriaEng
  /** Referência bibliográfica primária (livro, seção). */
  referencia: string
  /** Slug do MDX se já publicada. */
  slug?: string
  caminho?: string
}

export interface UnidadeEng {
  num: number
  titulo: string
  foco: string
  licoes: LicaoEng[]
}

export interface DisciplinaEngData {
  id: DisciplinaEng
  titulo: string
  /** Equivalência em universidades brasileiras de referência. */
  equivalencia: string
  resumo: string
  /** Carga horária semestral típica (horas-aula). */
  cargaHoraria: number
  prerrequisitos: string[]
  unidades: UnidadeEng[]
}

// ─── Constantes ───────────────────────────────────────────────────────────────

/**
 * Carga horária padrão por disciplina (horas-aula, 50 min cada).
 * Baseado nos planos de ensino USP/ITA/UNICAMP 2024.
 *  - Cálculo 1: 90h (USP MAC0105 = 6 créditos × 15 semanas)
 *  - Cálculo 2: 90h
 *  - Cálculo 3: 90h (algumas instituições: 60h, mas ITA mantém 90h)
 *  - Cálculo 4: 60h (ITA MA-021, UNICAMP MA311)
 */
export const CARGA_HORARIA_ENG: Record<DisciplinaEng, number> = {
  'calculo-1': 90,
  'calculo-2': 90,
  'calculo-3': 90,
  'calculo-4': 60,
}

// ─── Programa Completo ────────────────────────────────────────────────────────

export const PROGRAMA_ENG: DisciplinaEngData[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // CÁLCULO 1 — Diferencial e Integral de uma variável (fundamentos)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'calculo-1',
    titulo: 'Cálculo 1 — Diferencial e Integral',
    equivalencia:
      'USP MAC0105 / MAT0111 · ITA MA-011 · UNICAMP MA111 · IME/UFRJ · típico 1.º semestre',
    resumo:
      'Fundação rigorosa do cálculo de uma variável real. Cobre limites (ε-δ), derivadas e suas ' +
      'aplicações, integral de Riemann e o Teorema Fundamental do Cálculo. ' +
      'Ao final, o aluno consegue modelar e resolver problemas de otimização, ' +
      'taxa de variação e cálculo de áreas que aparecem em todas as engenharias.',
    cargaHoraria: 90,
    prerrequisitos: [
      'Ensino Médio otimizado completo (Anos 1-3)',
      'Em especial: limites intuitivos (Lição 19 e 41–50), derivada (Lições 51–60), integral (Lições 81–90)',
    ],
    unidades: [
      {
        num: 1,
        titulo: 'Unidade 1 — Limites e Continuidade',
        foco:
          'Definição rigorosa ε-δ, técnicas de cálculo de limites, continuidade e ' +
          'teoremas fundamentais (TVI, Weierstrass).',
        licoes: [
          {
            num: 1,
            titulo: 'Revisão: números reais, supremo e ínfimo',
            topicos: 'Completude de ℝ, sup/inf, Axioma de Arquimedes, densidade de ℚ',
            materia: 'limites-continuidade',
            referencia: 'Guidorizzi vol. 1 §1.1–1.3 · Apostol I §I 3–4',
            slug: 'cal1-u1-l01-numeros-reais',
            caminho: 'engenharia/calculo-1/unidade-1/cal1-u1-l01-numeros-reais',
          },
          {
            num: 2,
            titulo: 'Limite de função: definição ε-δ',
            topicos: 'Definição de Cauchy, unicidade do limite, limites laterais',
            materia: 'limites-continuidade',
            referencia: 'Stewart §2.4 · Guidorizzi §2.1 · OpenStax Calc I §2.5',
            slug: 'cal1-u1-l02-limite-epsilon-delta',
            caminho: 'engenharia/calculo-1/unidade-1/cal1-u1-l02-limite-epsilon-delta',
          },
          {
            num: 3,
            titulo: 'Técnicas algébricas de cálculo de limites',
            topicos: 'Álgebra de limites, fatoração, racionalização, Teorema do Confronto',
            materia: 'limites-continuidade',
            referencia: 'Stewart §2.3 · Active Calculus §1.2 · OpenStax Calc I §2.3',
            slug: 'cal1-u1-l03-tecnicas-limites',
            caminho: 'engenharia/calculo-1/unidade-1/cal1-u1-l03-tecnicas-limites',
          },
          {
            num: 4,
            titulo: 'Limites fundamentais',
            topicos: 'lim(sin x)/x = 1, lim(1+1/n)^n = e, lim(e^x−1)/x = 1',
            materia: 'limites-continuidade',
            referencia: 'Guidorizzi §2.3 · Stewart §3.3 Nota · REAMAT cap. 2',
            slug: 'cal1-u1-l04-limites-fundamentais',
            caminho: 'engenharia/calculo-1/unidade-1/cal1-u1-l04-limites-fundamentais',
          },
          {
            num: 5,
            titulo: 'Limites no infinito e assíntotas',
            topicos: 'Comportamento assintótico, assíntotas horizontais e oblíquas',
            materia: 'limites-continuidade',
            referencia: 'Stewart §2.6 · OpenStax Calc I §4.6',
            slug: 'cal1-u1-l05-limites-infinito-assintotas',
            caminho: 'engenharia/calculo-1/unidade-1/cal1-u1-l05-limites-infinito-assintotas',
          },
          {
            num: 6,
            titulo: 'Continuidade: definição e classificação de descontinuidades',
            topicos: 'Continuidade no ponto e no intervalo, descontinuidades removível/salto/essencial',
            materia: 'limites-continuidade',
            referencia: 'Stewart §2.5 · Guidorizzi §2.4 · Active Calculus §1.7',
            slug: 'cal1-u1-l06-continuidade',
            caminho: 'engenharia/calculo-1/unidade-1/cal1-u1-l06-continuidade',
          },
          {
            num: 7,
            titulo: 'Teorema do Valor Intermediário (TVI)',
            topicos: 'Enunciado, demonstração, zeros de funções contínuas, aplicações (bisseção)',
            materia: 'limites-continuidade',
            referencia: 'Stewart §2.5 · Apostol I §3.11 · OpenStax Calc I §2.4',
            slug: 'cal1-u1-l07-tvi',
            caminho: 'engenharia/calculo-1/unidade-1/cal1-u1-l07-tvi',
          },
          {
            num: 8,
            titulo: 'Teorema de Weierstrass (máximo e mínimo)',
            topicos: 'Funções contínuas em compactos, existência de extremos globais',
            materia: 'limites-continuidade',
            referencia: 'Guidorizzi §2.5 · Apostol I §3.16',
            slug: 'cal1-u1-l08-weierstrass',
            caminho: 'engenharia/calculo-1/unidade-1/cal1-u1-l08-weierstrass',
          },
          {
            num: 9,
            titulo: 'Limites de sequências: formalização ε-N',
            topicos: 'Sequências convergentes, monotona limitada, Bolzano-Weierstrass',
            materia: 'limites-continuidade',
            referencia: 'Guidorizzi §1.4–1.6 · Apostol I §10.1–10.3',
            slug: 'cal1-u1-l09-limites-sequencias',
            caminho: 'engenharia/calculo-1/unidade-1/cal1-u1-l09-limites-sequencias',
          },
          {
            num: 10,
            titulo: 'Workshop Unidade 1 — Limites e Continuidade',
            topicos: 'Resolução de problemas integrados, estilo FUVEST/ITA/ENEM',
            materia: 'limites-continuidade',
            referencia: 'REAMAT cap. 1–2 · Guidorizzi Lista I · ITA provas 2010–2024',
            slug: 'cal1-u1-l10-workshop',
            caminho: 'engenharia/calculo-1/unidade-1/cal1-u1-l10-workshop',
          },
        ],
      },
      {
        num: 2,
        titulo: 'Unidade 2 — Derivadas',
        foco:
          'Derivada como limite do quociente diferencial, regras de derivação ' +
          'e derivadas das funções elementares.',
        licoes: [
          {
            num: 11,
            titulo: 'Derivada: definição via limite',
            topicos: 'Quociente de Newton Δy/Δx → dy/dx, interpretação geométrica (reta tangente) e física (velocidade)',
            materia: 'derivada-1',
            referencia: 'Stewart §2.1–2.2 · Guidorizzi §3.1 · Active Calculus §1.3',
            slug: 'cal1-u2-l11-derivada-definicao',
            caminho: 'engenharia/calculo-1/unidade-2/cal1-u2-l11-derivada-definicao',
          },
          {
            num: 12,
            titulo: 'Regras de derivação: soma, produto, quociente',
            topicos: '(f+g)′=f′+g′, (fg)′, (f/g)′, derivada da potência x^n',
            materia: 'derivada-1',
            referencia: 'Stewart §2.3 · OpenStax Calc I §3.3 · Active Calculus §2.1',
            slug: 'cal1-u2-l12-regras-derivacao',
            caminho: 'engenharia/calculo-1/unidade-2/cal1-u2-l12-regras-derivacao',
          },
          {
            num: 13,
            titulo: 'Regra da cadeia',
            topicos: '(f∘g)′(x) = f′(g(x))·g′(x), exemplos encadeados, notação de Leibniz',
            materia: 'derivada-1',
            referencia: 'Stewart §2.5 · Guidorizzi §3.3 · Active Calculus §2.5',
            slug: 'cal1-u2-l13-regra-cadeia',
            caminho: 'engenharia/calculo-1/unidade-2/cal1-u2-l13-regra-cadeia',
          },
          {
            num: 14,
            titulo: 'Derivadas das funções trigonométricas e inversas',
            topicos: '(sin)′=cos, (cos)′=−sin, (tan)′=sec², (arctan)′, (arcsin)′',
            materia: 'derivada-1',
            referencia: 'Stewart §2.4 e §2.6 · Guidorizzi §3.4',
            slug: 'cal1-u2-l14-derivadas-trig-inversas',
            caminho: 'engenharia/calculo-1/unidade-2/cal1-u2-l14-derivadas-trig-inversas',
          },
          {
            num: 15,
            titulo: 'Derivadas das funções exponencial e logarítmica',
            topicos: '(e^x)′=e^x, (ln x)′=1/x, (a^x)′, (log_a x)′, derivação logarítmica',
            materia: 'derivada-1',
            referencia: 'Stewart §3.1–3.3 · OpenStax Calc I §3.9 · Active Calculus §2.6',
            slug: 'cal1-u2-l15-derivadas-exp-log',
            caminho: 'engenharia/calculo-1/unidade-2/cal1-u2-l15-derivadas-exp-log',
          },
          {
            num: 16,
            titulo: 'Derivação implícita',
            topicos: 'F(x,y)=0 → dy/dx, derivada de função inversa via implícita',
            materia: 'derivada-1',
            referencia: 'Stewart §2.6 · Active Calculus §2.7 · Guidorizzi §3.5',
            slug: 'cal1-u2-l16-derivacao-implicita',
            caminho: 'engenharia/calculo-1/unidade-2/cal1-u2-l16-derivacao-implicita',
          },
          {
            num: 17,
            titulo: 'Derivadas de ordem superior',
            topicos: 'f′′, f^(n), notação, aceleração, concavidade',
            materia: 'derivada-1',
            referencia: 'Stewart §2.7 · OpenStax Calc I §3.5',
            slug: 'cal1-u2-l17-derivadas-ordem-superior',
            caminho: 'engenharia/calculo-1/unidade-2/cal1-u2-l17-derivadas-ordem-superior',
          },
          {
            num: 18,
            titulo: 'Diferenciabilidade e aproximação linear',
            topicos: 'Diferencial dy = f′(x)dx, approximação f(x)≈f(a)+f′(a)(x−a)',
            materia: 'derivada-1',
            referencia: 'Stewart §3.10 · Active Calculus §1.8 · Guidorizzi §3.6',
            slug: 'cal1-u2-l18-diferenciabilidade-aproximacao',
            caminho: 'engenharia/calculo-1/unidade-2/cal1-u2-l18-diferenciabilidade-aproximacao',
          },
          {
            num: 19,
            titulo: 'Taxas relacionadas',
            topicos: 'dy/dt = f′(x)·dx/dt, problemas de engenharia e física',
            materia: 'derivada-1',
            referencia: 'Stewart §2.8 · OpenStax Calc I §4.1 · Active Calculus §3.5',
            slug: 'cal1-u2-l19-taxas-relacionadas',
            caminho: 'engenharia/calculo-1/unidade-2/cal1-u2-l19-taxas-relacionadas',
          },
          {
            num: 20,
            titulo: 'Workshop Unidade 2 — Derivadas',
            topicos: 'Problemas integrados, estilo ITA/USP/UNICAMP',
            materia: 'derivada-1',
            referencia: 'REAMAT cap. 3 · ITA provas 2015–2024 · Guidorizzi Lista II',
            slug: 'cal1-u2-l20-workshop',
            caminho: 'engenharia/calculo-1/unidade-2/cal1-u2-l20-workshop',
          },
        ],
      },
      {
        num: 3,
        titulo: 'Unidade 3 — Aplicações da Derivada',
        foco:
          'Usar a derivada para analisar funções, resolver otimização e ' +
          'construir aproximações polinomiais.',
        licoes: [
          {
            num: 21,
            titulo: 'Teorema de Rolle e Teorema do Valor Médio (TVM)',
            topicos: 'Enunciados, demonstrações, aplicações: monotonicidade, funções constantes',
            materia: 'aplicacoes-derivada-1',
            referencia: 'Stewart §3.2 · Guidorizzi §4.1 · Apostol I §4.1–4.3',
            slug: 'cal1-u3-l21-tvm',
            caminho: 'engenharia/calculo-1/unidade-3/cal1-u3-l21-tvm',
          },
          {
            num: 22,
            titulo: 'Crescimento, decrescimento e teste da 1ª derivada',
            topicos: 'f′>0 → crescente, pontos críticos, extremos locais',
            materia: 'aplicacoes-derivada-1',
            referencia: 'Stewart §3.3 · Active Calculus §3.1 · OpenStax Calc I §4.3',
            slug: 'cal1-u3-l22-crescimento-decrescimento',
            caminho: 'engenharia/calculo-1/unidade-3/cal1-u3-l22-crescimento-decrescimento',
          },
          {
            num: 23,
            titulo: 'Concavidade, inflexão e teste da 2ª derivada',
            topicos: 'f′′>0 → convexa, pontos de inflexão, teste de segunda derivada',
            materia: 'aplicacoes-derivada-1',
            referencia: 'Stewart §3.4 · Active Calculus §3.1 · Guidorizzi §4.2',
            slug: 'cal1-u3-l23-concavidade-inflexao',
            caminho: 'engenharia/calculo-1/unidade-3/cal1-u3-l23-concavidade-inflexao',
          },
          {
            num: 24,
            titulo: 'Esboço sistemático de gráficos',
            topicos: 'Análise completa: domínio, simetria, assíntotas, monotonia, concavidade',
            materia: 'aplicacoes-derivada-1',
            referencia: 'Stewart §3.5 · Guidorizzi §4.3 · OpenStax Calc I §4.5',
            slug: 'cal1-u3-l24-esboco-graficos',
            caminho: 'engenharia/calculo-1/unidade-3/cal1-u3-l24-esboco-graficos',
          },
          {
            num: 25,
            titulo: 'Máximos e mínimos globais',
            topicos: 'Extremos em intervalos fechados, algoritmo de busca',
            materia: 'aplicacoes-derivada-1',
            referencia: 'Stewart §3.1 · Active Calculus §3.3 · OpenStax Calc I §4.2',
            slug: 'cal1-u3-l25-maximos-minimos-globais',
            caminho: 'engenharia/calculo-1/unidade-3/cal1-u3-l25-maximos-minimos-globais',
          },
          {
            num: 26,
            titulo: 'Otimização aplicada',
            topicos: 'Problemas reais: dimensões ótimas, custo mínimo, lucro máximo',
            materia: 'aplicacoes-derivada-1',
            referencia: 'Stewart §3.7 · Active Calculus §3.4 · REAMAT cap. 4',
            slug: 'cal1-u3-l26-otimizacao',
            caminho: 'engenharia/calculo-1/unidade-3/cal1-u3-l26-otimizacao',
          },
          {
            num: 27,
            titulo: 'Regra de L\'Hôpital e formas indeterminadas',
            topicos: '0/0, ∞/∞, 0·∞, ∞−∞, 0^0, 1^∞, ∞^0',
            materia: 'aplicacoes-derivada-1',
            referencia: 'Stewart §3.7 · Guidorizzi §4.4 · Apostol I §7.12',
            slug: 'cal1-u3-l27-lhopital',
            caminho: 'engenharia/calculo-1/unidade-3/cal1-u3-l27-lhopital',
          },
          {
            num: 28,
            titulo: 'Polinômio de Taylor e série de Taylor',
            topicos: 'f(x) = Σ f^(k)(a)/k! (x−a)^k, resto de Lagrange, erro de truncamento',
            materia: 'aplicacoes-derivada-1',
            referencia: 'Stewart §11.11 · Guidorizzi §4.5 · Apostol I §7.7',
            slug: 'cal1-u3-l28-taylor',
            caminho: 'engenharia/calculo-1/unidade-3/cal1-u3-l28-taylor',
          },
          {
            num: 29,
            titulo: 'Método de Newton-Raphson',
            topicos: 'Iteração xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ), convergência, implementação',
            materia: 'aplicacoes-derivada-1',
            referencia: 'Stewart §3.8 · REAMAT §5.2 · Active Calculus §3.8',
            slug: 'cal1-u3-l29-newton-raphson',
            caminho: 'engenharia/calculo-1/unidade-3/cal1-u3-l29-newton-raphson',
          },
          {
            num: 30,
            titulo: 'Workshop Unidade 3 — Aplicações da Derivada',
            topicos: 'Problemas integrados estilo ITA/IME/vestibular de engenharia',
            materia: 'aplicacoes-derivada-1',
            referencia: 'REAMAT cap. 4 · ITA 2018–2024 · Guidorizzi Lista III',
            slug: 'cal1-u3-l30-workshop',
            caminho: 'engenharia/calculo-1/unidade-3/cal1-u3-l30-workshop',
          },
        ],
      },
      {
        num: 4,
        titulo: 'Unidade 4 — Integral de Riemann',
        foco:
          'Construção rigorosa da integral definida, Teorema Fundamental do ' +
          'Cálculo e primeiras aplicações.',
        licoes: [
          {
            num: 31,
            titulo: 'Somas de Riemann e integral definida',
            topicos: 'Partições, soma inferior/superior, definição de ∫[a,b]f(x)dx',
            materia: 'integral-1',
            referencia: 'Stewart §4.1–4.2 · Guidorizzi §5.1 · Apostol I §1.7–1.10',
            slug: 'cal1-u4-l31-somas-riemann',
            caminho: 'engenharia/calculo-1/unidade-4/cal1-u4-l31-somas-riemann',
          },
          {
            num: 32,
            titulo: 'Propriedades da integral definida',
            topicos: 'Linearidade, aditividade, monotonia, módulo',
            materia: 'integral-1',
            referencia: 'Stewart §4.2 · OpenStax Calc I §5.2 · Active Calculus §4.3',
            slug: 'cal1-u4-l32-propriedades-integral',
            caminho: 'engenharia/calculo-1/unidade-4/cal1-u4-l32-propriedades-integral',
          },
          {
            num: 33,
            titulo: 'Antiderivada e integral indefinida',
            topicos: 'F′=f, constante de integração, primitivas imediatas',
            materia: 'integral-1',
            referencia: 'Stewart §4.4 · Guidorizzi §5.2 · Active Calculus §4.4',
            slug: 'cal1-u4-l33-antiderivada-integral-indefinida',
            caminho: 'engenharia/calculo-1/unidade-4/cal1-u4-l33-antiderivada-integral-indefinida',
          },
          {
            num: 34,
            titulo: 'Teorema Fundamental do Cálculo (TFC1 e TFC2)',
            topicos: 'G(x) = ∫[a,x]f, G′=f; ∫[a,b]f = F(b)−F(a)',
            materia: 'integral-1',
            referencia: 'Stewart §4.3–4.4 · Guidorizzi §5.3 · Apostol I §5.1',
            slug: 'cal1-u4-l34-tfc',
            caminho: 'engenharia/calculo-1/unidade-4/cal1-u4-l34-tfc',
          },
          {
            num: 35,
            titulo: 'Técnica de substituição (mudança de variável)',
            topicos: 'u-substitution, método geral, casos trigonométricos simples',
            materia: 'integral-1',
            referencia: 'Stewart §4.5 · Active Calculus §5.3 · OpenStax Calc I §5.5',
            slug: 'cal1-u4-l35-substituicao',
            caminho: 'engenharia/calculo-1/unidade-4/cal1-u4-l35-substituicao',
          },
          {
            num: 36,
            titulo: 'Área entre curvas',
            topicos: 'A = ∫(f−g)dx, integração em relação a y',
            materia: 'integral-1',
            referencia: 'Stewart §5.1 · Active Calculus §6.1 · OpenStax Calc I §6.1',
            slug: 'cal1-u4-l36-area-curvas',
            caminho: 'engenharia/calculo-1/unidade-4/cal1-u4-l36-area-curvas',
          },
          {
            num: 37,
            titulo: 'Volume por discos e cascas cilíndricas',
            topicos: 'Sólidos de revolução, método dos discos/anéis e das cascas',
            materia: 'integral-1',
            referencia: 'Stewart §5.2–5.3 · OpenStax Calc I §6.2–6.3',
            slug: 'cal1-u4-l37-volumes',
            caminho: 'engenharia/calculo-1/unidade-4/cal1-u4-l37-volumes',
          },
          {
            num: 38,
            titulo: 'Comprimento de arco e área de superfície de revolução',
            topicos: 'ds = √(1+[f′]²)dx, área de superfície = 2π∫f·ds',
            materia: 'integral-1',
            referencia: 'Stewart §5.4 · Guidorizzi §5.5 · OpenStax Calc I §6.4',
            slug: 'cal1-u4-l38-comprimento-arco',
            caminho: 'engenharia/calculo-1/unidade-4/cal1-u4-l38-comprimento-arco',
          },
          {
            num: 39,
            titulo: 'Aplicações físicas: trabalho, pressão, centro de massa',
            topicos: 'W = ∫F dx, força hidrostática, centroides',
            materia: 'integral-1',
            referencia: 'Stewart §5.5 · REAMAT §6.4 · OpenStax Calc I §6.5',
            slug: 'cal1-u4-l39-aplicacoes-fisicas',
            caminho: 'engenharia/calculo-1/unidade-4/cal1-u4-l39-aplicacoes-fisicas',
          },
          {
            num: 40,
            titulo: 'Workshop Unidade 4 — Integral e síntese de Cálculo 1',
            topicos: 'Problemas integrados, prova-modelo estilo USP/ITA',
            materia: 'integral-1',
            referencia: 'REAMAT cap. 5–6 · Guidorizzi Lista IV · ITA provas 2010–2024',
            slug: 'cal1-u4-l40-workshop',
            caminho: 'engenharia/calculo-1/unidade-4/cal1-u4-l40-workshop',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CÁLCULO 2 — Técnicas de Integração, Séries, EDOs de 1ª ordem
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'calculo-2',
    titulo: 'Cálculo 2 — Técnicas, Séries e EDOs',
    equivalencia:
      'USP MAT0112 · ITA MA-012 · UNICAMP MA211 · típico 2.º semestre',
    resumo:
      'Aprofunda o cálculo integral com técnicas avançadas, estende o conceito ' +
      'de integral para o caso impróprio, introduz sequências e séries (com ' +
      'convergência rigorosa) e apresenta as equações diferenciais ordinárias ' +
      'de 1ª ordem — modelo matemático central em engenharia.',
    cargaHoraria: 90,
    prerrequisitos: ['Cálculo 1 completo'],
    unidades: [
      {
        num: 1,
        titulo: 'Unidade 1 — Técnicas Avançadas de Integração',
        foco: 'Ampliar o repertório de técnicas para calcular integrais.',
        licoes: [
          {
            num: 1,
            titulo: 'Integração por partes',
            topicos: '∫u dv = uv − ∫v du, tabela, integrais cíclicas, fórmula de redução',
            materia: 'tecnicas-integracao',
            referencia: 'Stewart §7.1 · Guidorizzi §6.1 · Active Calculus §5.4',
          },
          {
            num: 2,
            titulo: 'Integrais trigonométricas',
            topicos: '∫sinⁿx cosᵐx, ∫tanⁿx, ∫secⁿx, identidades de Pitágoras',
            materia: 'tecnicas-integracao',
            referencia: 'Stewart §7.2 · Guidorizzi §6.2 · OpenStax Calc II §3.2',
          },
          {
            num: 3,
            titulo: 'Substituição trigonométrica',
            topicos: '√(a²−x²), √(a²+x²), √(x²−a²) — escolha de substituição',
            materia: 'tecnicas-integracao',
            referencia: 'Stewart §7.3 · Guidorizzi §6.3 · OpenStax Calc II §3.3',
          },
          {
            num: 4,
            titulo: 'Integração por frações parciais',
            topicos: 'Decomposição racional (fatores simples, repetidos, irredutíveis)',
            materia: 'tecnicas-integracao',
            referencia: 'Stewart §7.4 · Guidorizzi §6.4 · Active Calculus §5.5',
          },
          {
            num: 5,
            titulo: 'Integrais de funções hiperbólicas e inversas',
            topicos: 'sinh, cosh, tanh e suas integrais; ∫1/√(x²±a²)',
            materia: 'tecnicas-integracao',
            referencia: 'Stewart §6.7 · Guidorizzi §6.5',
          },
          {
            num: 6,
            titulo: 'Estratégias de integração e tabelas',
            topicos: 'Seleção de técnica, uso de tabelas, CAS como verificação',
            materia: 'tecnicas-integracao',
            referencia: 'Stewart §7.5 · OpenStax Calc II §3.5',
          },
          {
            num: 7,
            titulo: 'Integrais impróprias de 1.º tipo (limites infinitos)',
            topicos: '∫[a,+∞)f, ∫(−∞,b]f, ∫(−∞,+∞)f — convergência e divergência',
            materia: 'integrais-impróprias-series',
            referencia: 'Stewart §7.8 · Guidorizzi §7.1 · Active Calculus §6.5',
          },
          {
            num: 8,
            titulo: 'Integrais impróprias de 2.º tipo (descontinuidades)',
            topicos: 'Integrando com singularidade, teste de comparação',
            materia: 'integrais-impróprias-series',
            referencia: 'Stewart §7.8 · Guidorizzi §7.2',
          },
          {
            num: 9,
            titulo: 'Aplicações: distribuições de probabilidade contínuas',
            topicos: 'Função densidade, E[X], Var[X], distribuição exponencial, gaussiana',
            materia: 'tecnicas-integracao',
            referencia: 'Stewart §7.9 (aplicação) · REAMAT §6.5',
          },
          {
            num: 10,
            titulo: 'Workshop Unidade 1 — Técnicas de Integração',
            topicos: 'Banco de 40 integrais de nível USP/ITA/UNICAMP',
            materia: 'tecnicas-integracao',
            referencia: 'REAMAT cap. 6 · Guidorizzi Lista V · Stewart cap. 7 exercícios',
          },
        ],
      },
      {
        num: 2,
        titulo: 'Unidade 2 — Sequências e Séries Numéricas',
        foco:
          'Convergência rigorosa de sequências e séries; critérios ' +
          'aplicáveis em engenharia.',
        licoes: [
          {
            num: 11,
            titulo: 'Sequências: limite, monotonia, limitação',
            topicos: 'Definição ε-N, sequências monótonas e limitadas, Bolzano-Weierstrass',
            materia: 'integrais-impróprias-series',
            referencia: 'Stewart §11.1 · Guidorizzi §8.1 · Apostol I §10.1–10.4',
          },
          {
            num: 12,
            titulo: 'Séries numéricas: definição e convergência',
            topicos: 'Sequência de somas parciais, série geométrica, série harmônica',
            materia: 'integrais-impróprias-series',
            referencia: 'Stewart §11.2 · Guidorizzi §8.2 · Apostol I §10.5',
          },
          {
            num: 13,
            titulo: 'Critérios de convergência I: integral e comparação',
            topicos: 'Teste da integral (Cauchy), comparação direta e limite',
            materia: 'integrais-impróprias-series',
            referencia: 'Stewart §11.3–11.4 · Guidorizzi §8.3',
          },
          {
            num: 14,
            titulo: 'Critérios de convergência II: razão, raiz, Leibniz',
            topicos: 'Teste da razão (D\'Alembert), raiz (Cauchy), séries alternadas (Leibniz)',
            materia: 'integrais-impróprias-series',
            referencia: 'Stewart §11.5–11.6 · Guidorizzi §8.4',
          },
          {
            num: 15,
            titulo: 'Convergência absoluta e condicional',
            topicos: 'Séries absolutamente convergentes, Teorema de Riemann sobre rearranjos',
            materia: 'integrais-impróprias-series',
            referencia: 'Stewart §11.6 · Apostol I §10.14–10.16',
          },
          {
            num: 16,
            titulo: 'Séries de potências: raio e intervalo de convergência',
            topicos: 'Σ aₙ(x−c)ⁿ, raio via fórmula de Hadamard, derivação e integração termo a termo',
            materia: 'series-taylor',
            referencia: 'Stewart §11.8–11.9 · Guidorizzi §8.6 · Apostol I §11.1–11.5',
          },
          {
            num: 17,
            titulo: 'Série de Taylor e Maclaurin',
            topicos: 'f(x) = Σf^(n)(a)/n! (x−a)ⁿ, desenvolvimentos clássicos (eˣ, sin, cos, ln, ...)',
            materia: 'series-taylor',
            referencia: 'Stewart §11.10 · Guidorizzi §8.7 · Active Calculus §8.5',
            slug: 'cal2-u2-l17-series-taylor',
          },
          {
            num: 18,
            titulo: 'Erro de truncamento e estimativas',
            topicos: 'Resto de Lagrange, grau necessário para precisão ε',
            materia: 'series-taylor',
            referencia: 'Stewart §11.11 · Guidorizzi §8.8',
          },
          {
            num: 19,
            titulo: 'Aplicações de séries: cálculo de limites e integrais',
            topicos: 'Limite via expansão, ∫sin(x²)dx, ∫e^(−x²)dx, soma de séries conhecidas',
            materia: 'series-taylor',
            referencia: 'Stewart §11.11 · REAMAT §9.5',
          },
          {
            num: 20,
            titulo: 'Workshop Unidade 2 — Séries',
            topicos: 'Problemas de convergência e aplicações estilo USP/ITA',
            materia: 'series-taylor',
            referencia: 'REAMAT cap. 9 · Guidorizzi Lista VII · Apostol I cap. 10',
          },
        ],
      },
      {
        num: 3,
        titulo: 'Unidade 3 — Equações Diferenciais de 1ª Ordem',
        foco:
          'Modelagem, resolução analítica e qualitativa de EDOs de 1ª ordem.',
        licoes: [
          {
            num: 21,
            titulo: 'Introdução a EDOs: classificação e modelagem',
            topicos: 'Ordem, grau, tipo (linear/não-linear), campo de direções',
            materia: 'equacoes-diferenciais-1',
            referencia: 'Boyce & DiPrima §1.1–1.3 · Stewart §9.1 · REAMAT §10.1',
          },
          {
            num: 22,
            titulo: 'EDOs separáveis',
            topicos: 'dy/dx = g(x)h(y), separação de variáveis, soluções implícitas e explícitas',
            materia: 'equacoes-diferenciais-1',
            referencia: 'Boyce & DiPrima §2.2 · Stewart §9.3 · OpenStax Calc II §4.3',
          },
          {
            num: 23,
            titulo: 'EDOs lineares de 1ª ordem',
            topicos: 'y′+P(x)y = Q(x), fator integrante μ(x) = e^∫P(x)dx',
            materia: 'equacoes-diferenciais-1',
            referencia: 'Boyce & DiPrima §2.1 · Stewart §9.5 · Active Calculus §7.4',
            slug: 'cal2-u3-l23-edo-linear-1',
          },
          {
            num: 24,
            titulo: 'Equação de Bernoulli',
            topicos: 'y′+P(x)y = Q(x)yⁿ, substituição v=y^(1−n)',
            materia: 'equacoes-diferenciais-1',
            referencia: 'Boyce & DiPrima §2.4 · Guidorizzi vol. 2 §11.3',
          },
          {
            num: 25,
            titulo: 'Equações exatas e fator integrante',
            topicos: 'M dx + N dy = 0, ∂M/∂y = ∂N/∂x, determinação de fator integrante',
            materia: 'equacoes-diferenciais-1',
            referencia: 'Boyce & DiPrima §2.6 · Guidorizzi §11.2',
          },
          {
            num: 26,
            titulo: 'Existência e unicidade (Picard-Lindelöf)',
            topicos: 'Teorema de Picard, iterações de Picard, exemplos e contra-exemplos',
            materia: 'equacoes-diferenciais-1',
            referencia: 'Boyce & DiPrima §2.8 · Apostol I §8.3',
          },
          {
            num: 27,
            titulo: 'Modelo logístico e equações autônomas',
            topicos: 'y′=ry(1−y/K), diagrama de fase 1D, pontos de equilíbrio, estabilidade',
            materia: 'equacoes-diferenciais-1',
            referencia: 'Boyce & DiPrima §2.5 · Stewart §9.4 · Active Calculus §7.5',
          },
          {
            num: 28,
            titulo: 'Método de Euler e métodos numéricos básicos',
            topicos: 'Euler explícito, Euler melhorado, Runge-Kutta 4ª ordem (esboço)',
            materia: 'equacoes-diferenciais-1',
            referencia: 'Boyce & DiPrima §8.1 · REAMAT §10.4',
          },
          {
            num: 29,
            titulo: 'Aplicações de EDOs de 1ª ordem em engenharia',
            topicos: 'Circuito RC, lei de Newton de resfriamento, mistura de soluções, queda livre com arrasto',
            materia: 'equacoes-diferenciais-1',
            referencia: 'Boyce & DiPrima §2.3 · REAMAT §10.3 · Stewart §9.4',
          },
          {
            num: 30,
            titulo: 'Workshop Unidade 3 — EDOs de 1ª Ordem e síntese de Cálculo 2',
            topicos: 'Problemas integrados: técnicas, séries e EDOs',
            materia: 'equacoes-diferenciais-1',
            referencia: 'REAMAT cap. 10 · Boyce & DiPrima cap. 2 · ITA provas',
          },
        ],
      },
      {
        num: 4,
        titulo: 'Unidade 4 — Tópicos Integradores de Cálculo 2',
        foco:
          'Coordenadas paramétricas e polares, integrais relacionadas e ' +
          'problemas de engenharia que unem os três blocos anteriores.',
        licoes: [
          {
            num: 31,
            titulo: 'Curvas paramétricas',
            topicos: 'x=f(t), y=g(t), tangente, comprimento de arco paramétrico',
            materia: 'tecnicas-integracao',
            referencia: 'Stewart §10.1–10.2 · Guidorizzi §9.1',
          },
          {
            num: 32,
            titulo: 'Coordenadas polares',
            topicos: 'r=f(θ), área em polares A = ½∫r²dθ, comprimento de arco polar',
            materia: 'tecnicas-integracao',
            referencia: 'Stewart §10.3–10.4 · Guidorizzi §9.2',
          },
          {
            num: 33,
            titulo: 'Cônicas em coordenadas polares',
            topicos: 'r = ed/(1+e cosθ), excentricidade, órbitas kepleranas',
            materia: 'tecnicas-integracao',
            referencia: 'Stewart §10.6 · Apostol I §13.8',
          },
          {
            num: 34,
            titulo: 'Funções hiperbólicas: integrais e EDOs',
            topicos: 'cosh, sinh, tanh — integrais, equação da catenária',
            materia: 'tecnicas-integracao',
            referencia: 'Stewart §6.7 · Guidorizzi §6.6',
          },
          {
            num: 35,
            titulo: 'Série de Fourier (introdução)',
            topicos: 'Coeficientes de Fourier, convergência pontual, fenômeno de Gibbs',
            materia: 'series-taylor',
            referencia: 'Boyce & DiPrima §10.2 · REAMAT §9.6',
          },
          {
            num: 36,
            titulo: 'Aplicações de séries de Taylor em física e engenharia',
            topicos: 'Expansão de potencial elétrico, aproximações de pequenas oscilações',
            materia: 'series-taylor',
            referencia: 'Stewart §11.11 · REAMAT §9.5',
          },
          {
            num: 37,
            titulo: 'Integração numérica',
            topicos: 'Regras de trapézio, Simpson 1/3, erro, quadratura de Gauss',
            materia: 'tecnicas-integracao',
            referencia: 'Stewart §7.7 · REAMAT §6.6 · OpenStax Calc II §3.6',
          },
          {
            num: 38,
            titulo: 'Integrais dependentes de parâmetro (diferenciação sob o sinal)',
            topicos: 'Regra de Leibniz: d/dα ∫f(x,α)dx = ∫∂f/∂α dx',
            materia: 'tecnicas-integracao',
            referencia: 'Apostol I §12.1 · Guidorizzi §7.4',
          },
          {
            num: 39,
            titulo: 'Problema inverso: identificação de primitivas difíceis',
            topicos: '∫e^(−x²)dx (função erro), ∫sin(x²)dx (Fresnel), liouvillianos',
            materia: 'tecnicas-integracao',
            referencia: 'REAMAT §6.7 · Apostol I §11.6',
          },
          {
            num: 40,
            titulo: 'Workshop Final — Cálculo 2',
            topicos: 'Prova simulada completa: 20 questões nível USP/ITA',
            materia: 'tecnicas-integracao',
            referencia: 'REAMAT · ITA provas 2010–2024 · Guidorizzi Listas V–VIII',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CÁLCULO 3 — Funções de várias variáveis e Cálculo Vetorial
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'calculo-3',
    titulo: 'Cálculo 3 — Várias Variáveis e Cálculo Vetorial',
    equivalencia:
      'USP MAT0115 · ITA MA-021 (parcial) · UNICAMP MA311 · típico 3.º semestre',
    resumo:
      'Estende o cálculo para ℝⁿ: limites e continuidade em várias variáveis, ' +
      'derivadas parciais, otimização irrestrita e restrita (Lagrange), ' +
      'integrais duplas/triplas em diferentes sistemas de coordenadas e ' +
      'os grandes teoremas do cálculo vetorial (Green, Stokes, Gauss).',
    cargaHoraria: 90,
    prerrequisitos: ['Cálculo 1 e 2 completos', 'Álgebra Linear (Ensino Médio Ano 3, Trim 12)'],
    unidades: [
      {
        num: 1,
        titulo: 'Unidade 1 — Funções de Várias Variáveis',
        foco:
          'Geometria em ℝ³, topologia básica, limites e continuidade para f: ℝⁿ → ℝ.',
        licoes: [
          {
            num: 1,
            titulo: 'Vetores em ℝ³: produto vetorial e produto misto',
            topicos: 'u×v, [u,v,w], área de paralelogramo, volume de paralelepípedo',
            materia: 'funcoes-varias-variaveis',
            referencia: 'Stewart §12.4–12.5 · Guidorizzi vol. 2 §1.3–1.4',
          },
          {
            num: 2,
            titulo: 'Retas, planos e superfícies em ℝ³',
            topicos: 'Equações de reta/plano, quádricas (elipsóide, parabolóide, hiperbolóide)',
            materia: 'funcoes-varias-variaveis',
            referencia: 'Stewart §12.5–12.6 · Guidorizzi §1.5–1.6',
          },
          {
            num: 3,
            titulo: 'Curvas no espaço: funções vetoriais',
            topicos: 'r(t), tangente, comprimento de arco, curvatura, vetor normal',
            materia: 'funcoes-varias-variaveis',
            referencia: 'Stewart §13.1–13.3 · Guidorizzi §2.1–2.3',
          },
          {
            num: 4,
            titulo: 'Funções f: ℝⁿ → ℝ: domínio, gráfico, curvas de nível',
            topicos: 'Superfícies de nível, contornos, visualização de f(x,y)',
            materia: 'funcoes-varias-variaveis',
            referencia: 'Stewart §14.1 · Guidorizzi §3.1 · OpenStax Calc III §4.1',
          },
          {
            num: 5,
            titulo: 'Limite e continuidade em várias variáveis',
            topicos: 'Definição ε-δ em ℝⁿ, caminhos de aproximação, descontinuidades',
            materia: 'funcoes-varias-variaveis',
            referencia: 'Stewart §14.2 · Guidorizzi §3.2 · Apostol II §12.1',
          },
          {
            num: 6,
            titulo: 'Derivadas parciais: definição e cálculo',
            topicos: '∂f/∂x, ∂f/∂y via limite, interpretação geométrica, regras algébricas',
            materia: 'derivadas-parciais',
            referencia: 'Stewart §14.3 · Guidorizzi §3.3 · OpenStax Calc III §4.3',
          },
          {
            num: 7,
            titulo: 'Derivadas de ordem superior e Teorema de Schwarz',
            topicos: '∂²f/∂x², ∂²f/∂x∂y, Hessiana, fxy=fyx (condições Schwarz)',
            materia: 'derivadas-parciais',
            referencia: 'Stewart §14.3 · Guidorizzi §3.4',
          },
          {
            num: 8,
            titulo: 'Plano tangente e diferencial total',
            topicos: 'z−z₀ = fx(x₀,y₀)(x−x₀)+fy(x₀,y₀)(y−y₀), diferenciabilidade',
            materia: 'derivadas-parciais',
            referencia: 'Stewart §14.4 · Active Calculus §10.4 · Guidorizzi §3.5',
          },
          {
            num: 9,
            titulo: 'Regra da cadeia e derivadas implícitas em várias variáveis',
            topicos: 'df/dt = ∂f/∂x·dx/dt+..., F(x,y,z)=0 → ∂z/∂x implícita',
            materia: 'derivadas-parciais',
            referencia: 'Stewart §14.5 · Guidorizzi §3.6 · OpenStax Calc III §4.5',
          },
          {
            num: 10,
            titulo: 'Workshop Unidade 1 — Geometria em ℝ³ e Derivadas Parciais',
            topicos: 'Problemas integrados, estilo USP/UNICAMP',
            materia: 'funcoes-varias-variaveis',
            referencia: 'REAMAT cap. 11 · Guidorizzi Lista IX',
          },
        ],
      },
      {
        num: 2,
        titulo: 'Unidade 2 — Derivadas Parciais e Otimização',
        foco: 'Gradiente, otimização irrestrita e método dos multiplicadores de Lagrange.',
        licoes: [
          {
            num: 11,
            titulo: 'Gradiente e derivada direcional',
            topicos: '∇f, derivada direcional Dᵤf = ∇f·u, direção de máximo crescimento',
            materia: 'derivadas-parciais',
            referencia: 'Stewart §14.6 · Guidorizzi §3.7 · OpenStax Calc III §4.6',
            slug: 'cal3-u2-l11-gradiente',
          },
          {
            num: 12,
            titulo: 'Superfícies de nível e planos tangentes via gradiente',
            topicos: '∇F normal à superfície, plano tangente a F(x,y,z)=c',
            materia: 'derivadas-parciais',
            referencia: 'Stewart §14.6 · Apostol II §12.7',
          },
          {
            num: 13,
            titulo: 'Extremos livres: pontos críticos e Hessiana',
            topicos: 'Condições de 1ª e 2ª ordem, classificação via det(H), selas',
            materia: 'derivadas-parciais',
            referencia: 'Stewart §14.7 · Guidorizzi §4.1 · OpenStax Calc III §4.7',
          },
          {
            num: 14,
            titulo: 'Multiplicadores de Lagrange',
            topicos: '∇f = λ∇g, restrição g(x,y,z)=c, casos com duas restrições',
            materia: 'derivadas-parciais',
            referencia: 'Stewart §14.8 · Guidorizzi §4.2 · Active Calculus §10.8',
          },
          {
            num: 15,
            titulo: 'Mínimos quadrados via cálculo multivariável',
            topicos: 'OLS como problema de otimização, gradiente igualado a zero',
            materia: 'derivadas-parciais',
            referencia: 'Apostol II §12.13 · REAMAT §11.5',
          },
          {
            num: 16,
            titulo: 'Teorema da função implícita',
            topicos: 'Condições para resolver F(x,y)=0 localmente, Jacobiano',
            materia: 'derivadas-parciais',
            referencia: 'Apostol II §13.1 · Guidorizzi §4.3',
          },
          {
            num: 17,
            titulo: 'Transformações e Jacobiano',
            topicos: 'J(u,v)→(x,y), mudança de variáveis em integrais duplas via Jacobiano',
            materia: 'derivadas-parciais',
            referencia: 'Stewart §15.9 · Guidorizzi §5.4',
          },
          {
            num: 18,
            titulo: 'Séries de Taylor para funções de várias variáveis',
            topicos: 'Polinômio de Taylor de 2ª ordem em ℝⁿ, forma quadrática Hessiana',
            materia: 'derivadas-parciais',
            referencia: 'Apostol II §12.10 · Guidorizzi §4.4',
          },
          {
            num: 19,
            titulo: 'Aplicações em termodinâmica e engenharia',
            topicos: 'Relações de Maxwell, potencial elétrico, análise de sensibilidade',
            materia: 'derivadas-parciais',
            referencia: 'REAMAT §11.6 · Stewart §14 (exemplos)',
          },
          {
            num: 20,
            titulo: 'Workshop Unidade 2 — Otimização Multivariável',
            topicos: 'Problemas de Lagrange e otimização irrestrita estilo USP/ITA',
            materia: 'derivadas-parciais',
            referencia: 'REAMAT cap. 11 · Guidorizzi Lista X · Apostol II cap. 12',
          },
        ],
      },
      {
        num: 3,
        titulo: 'Unidade 3 — Integrais Múltiplas',
        foco: 'Integrais duplas e triplas, mudança de variáveis, aplicações geométricas e físicas.',
        licoes: [
          {
            num: 21,
            titulo: 'Integral dupla sobre retângulo: definição e Fubini',
            topicos: 'Sumas duplas de Riemann, Teorema de Fubini, iteração de integrais',
            materia: 'integrais-multiplas',
            referencia: 'Stewart §15.1–15.2 · Guidorizzi §5.1 · OpenStax Calc III §5.1',
          },
          {
            num: 22,
            titulo: 'Integral dupla sobre região geral (tipo I e II)',
            topicos: 'Limites variáveis de integração, trocar ordem',
            materia: 'integrais-multiplas',
            referencia: 'Stewart §15.3 · Active Calculus §11.1 · Guidorizzi §5.2',
          },
          {
            num: 23,
            titulo: 'Integrais duplas em coordenadas polares',
            topicos: '∬f(r,θ) r dr dθ, região polar, aplicação em distribuição gaussiana',
            materia: 'integrais-multiplas',
            referencia: 'Stewart §15.4 · Guidorizzi §5.3 · OpenStax Calc III §5.3',
            slug: 'cal3-u3-l23-integrais-polares',
          },
          {
            num: 24,
            titulo: 'Aplicações de integrais duplas: área, massa, centroide',
            topicos: 'Área, massa com densidade variável, centro de massa, momento de inércia',
            materia: 'integrais-multiplas',
            referencia: 'Stewart §15.5–15.6 · Active Calculus §11.4',
          },
          {
            num: 25,
            titulo: 'Integral tripla: Fubini em ℝ³',
            topicos: '∭f dV, iteração, troca de ordem, volume de sólidos',
            materia: 'integrais-multiplas',
            referencia: 'Stewart §15.7 · Guidorizzi §5.5 · OpenStax Calc III §5.4',
          },
          {
            num: 26,
            titulo: 'Coordenadas cilíndricas',
            topicos: '(r,θ,z), elemento de volume r dr dθ dz, aplicação em sólidos de revolução',
            materia: 'integrais-multiplas',
            referencia: 'Stewart §15.8 · Guidorizzi §5.6 · Active Calculus §11.6',
          },
          {
            num: 27,
            titulo: 'Coordenadas esféricas',
            topicos: '(ρ,θ,φ), elemento de volume ρ² sin φ dρ dθ dφ, esferas e cones',
            materia: 'integrais-multiplas',
            referencia: 'Stewart §15.9 · Guidorizzi §5.7 · OpenStax Calc III §5.5',
          },
          {
            num: 28,
            titulo: 'Mudança de variáveis via Jacobiano',
            topicos: '∭f dV = ∭f(T)·|J| du dv dw, exemplos gerais',
            materia: 'integrais-multiplas',
            referencia: 'Stewart §15.10 · Apostol II §11.4',
          },
          {
            num: 29,
            titulo: 'Aplicações: fluxo de calor, distribuições de carga, probabilidade',
            topicos: 'Densidade de carga elétrica, função de distribuição conjunta',
            materia: 'integrais-multiplas',
            referencia: 'REAMAT §12.5 · Stewart §15.6',
          },
          {
            num: 30,
            titulo: 'Workshop Unidade 3 — Integrais Múltiplas',
            topicos: 'Problemas integrados em coordenadas variadas, estilo USP/UNICAMP',
            materia: 'integrais-multiplas',
            referencia: 'REAMAT cap. 12 · Guidorizzi Lista XI',
          },
        ],
      },
      {
        num: 4,
        titulo: 'Unidade 4 — Cálculo Vetorial',
        foco:
          'Campos vetoriais, integrais de linha e de superfície, teoremas de Green, Stokes e Gauss.',
        licoes: [
          {
            num: 31,
            titulo: 'Campos vetoriais: definição, exemplos, campo gradiente',
            topicos: 'F: ℝⁿ→ℝⁿ, campo conservativo, potencial escalar',
            materia: 'calculo-vetorial',
            referencia: 'Stewart §16.1 · Guidorizzi §6.1 · OpenStax Calc III §6.1',
          },
          {
            num: 32,
            titulo: 'Integrais de linha (trabalho)',
            topicos: '∫_C F·dr, independência do caminho, campos conservativos',
            materia: 'calculo-vetorial',
            referencia: 'Stewart §16.2–16.3 · Guidorizzi §6.2',
          },
          {
            num: 33,
            titulo: 'Teorema de Green',
            topicos: '∮_C F·dr = ∬_D (∂Q/∂x−∂P/∂y)dA, área via Green, forma de fluxo',
            materia: 'calculo-vetorial',
            referencia: 'Stewart §16.4 · Guidorizzi §6.3 · Apostol II §10.7',
            slug: 'cal3-u4-l33-teorema-green',
          },
          {
            num: 34,
            titulo: 'Rotacional e divergência',
            topicos: 'curl F = ∇×F, div F = ∇·F, interpretações físicas',
            materia: 'calculo-vetorial',
            referencia: 'Stewart §16.5 · Guidorizzi §6.4 · OpenStax Calc III §6.5',
          },
          {
            num: 35,
            titulo: 'Superfícies parametrizadas e integrais de superfície',
            topicos: 'r(u,v), elemento de área dS, ∬_S f dS',
            materia: 'calculo-vetorial',
            referencia: 'Stewart §16.6–16.7 · Guidorizzi §6.5',
          },
          {
            num: 36,
            titulo: 'Integrais de superfície de campos vetoriais (fluxo)',
            topicos: '∬_S F·dS = ∬_S F·n dS, fluxo elétrico e magnético',
            materia: 'calculo-vetorial',
            referencia: 'Stewart §16.7 · Guidorizzi §6.6',
          },
          {
            num: 37,
            titulo: 'Teorema de Stokes',
            topicos: '∮_C F·dr = ∬_S (∇×F)·dS, interpretação como generalização de Green',
            materia: 'calculo-vetorial',
            referencia: 'Stewart §16.8 · Guidorizzi §6.7 · Apostol II §11.6',
          },
          {
            num: 38,
            titulo: 'Teorema da Divergência (Gauss-Ostrogradski)',
            topicos: '∬_S F·dS = ∭_V div F dV, lei de Gauss, equações de Maxwell',
            materia: 'calculo-vetorial',
            referencia: 'Stewart §16.9 · Guidorizzi §6.8 · Apostol II §11.7',
          },
          {
            num: 39,
            titulo: 'Equações de Maxwell como aplicação do cálculo vetorial',
            topicos: '∇·E=ρ/ε₀, ∇×B=μ₀J, ∇·B=0, ∇×E=−∂B/∂t',
            materia: 'calculo-vetorial',
            referencia: 'REAMAT §13.5 · Apostol II §11.8',
          },
          {
            num: 40,
            titulo: 'Workshop Final — Cálculo 3',
            topicos: 'Prova simulada completa: integrais múltiplas e cálculo vetorial',
            materia: 'calculo-vetorial',
            referencia: 'REAMAT cap. 13 · Guidorizzi Lista XII · ITA provas',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CÁLCULO 4 — EDOs avançadas, Transformadas, Análise Numérica
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'calculo-4',
    titulo: 'Cálculo 4 — EDOs Avançadas e Métodos Matemáticos',
    equivalencia:
      'USP MAT0116 (parcial) · ITA MA-021 (parte II) · UNICAMP MA311 (avançado) · disciplina de Métodos Matemáticos',
    resumo:
      'Equações diferenciais de 2ª ordem (massa-mola, RLC), sistemas de EDOs, ' +
      'transformadas de Laplace e Fourier (ferramentas-chave em sinais e sistemas), ' +
      'introdução a EDP (ondas, calor, Laplace) e análise numérica aplicada.',
    cargaHoraria: 60,
    prerrequisitos: [
      'Cálculo 1, 2 e 3 completos',
      'Álgebra Linear (autovalores e autovetores)',
    ],
    unidades: [
      {
        num: 1,
        titulo: 'Unidade 1 — EDOs Lineares de 2ª Ordem e Sistemas',
        foco: 'Solução completa: homogênea + particular; sistemas de EDOs; espaço de fase.',
        licoes: [
          {
            num: 1,
            titulo: 'EDOs lineares de 2ª ordem: equação característica',
            topicos: 'ay″+by′+cy=0, raízes reais distintas, repetidas e complexas',
            materia: 'edo-avancado',
            referencia: 'Boyce & DiPrima §3.1–3.4 · Guidorizzi vol. 2 §12.1',
            slug: 'cal4-u1-l01-edo-2-ordem',
          },
          {
            num: 2,
            titulo: 'Método dos coeficientes indeterminados',
            topicos: 'ay″+by′+cy=g(x), g polinomial/exponencial/trig, ressonância',
            materia: 'edo-avancado',
            referencia: 'Boyce & DiPrima §3.5 · Stewart §17.2 · Guidorizzi §12.2',
          },
          {
            num: 3,
            titulo: 'Método da variação dos parâmetros',
            topicos: 'Wronskiano, W₁, W₂, u₁′ e u₂′, solução geral com g(x) arbitrário',
            materia: 'edo-avancado',
            referencia: 'Boyce & DiPrima §3.6 · Stewart §17.3 · Guidorizzi §12.3',
          },
          {
            num: 4,
            titulo: 'Modelo massa-mola: vibração livre e forçada',
            topicos: 'Oscilação livre amortecida/subamortecida/criticamente amortecida, ressonância',
            materia: 'edo-avancado',
            referencia: 'Boyce & DiPrima §3.7–3.8 · REAMAT §14.2',
          },
          {
            num: 5,
            titulo: 'Circuito RLC como EDO de 2ª ordem',
            topicos: 'L q″+Rq′+q/C = E(t), analogia com massa-mola, filtros',
            materia: 'edo-avancado',
            referencia: 'Boyce & DiPrima §3.8 · REAMAT §14.3',
          },
          {
            num: 6,
            titulo: 'Sistemas de EDOs de 1ª ordem: forma matricial',
            topicos: 'x′ = Ax, solução via autovalores, espaço de fase',
            materia: 'edo-avancado',
            referencia: 'Boyce & DiPrima §7.1–7.5 · Guidorizzi §13.1',
          },
          {
            num: 7,
            titulo: 'Sistemas de EDOs: raízes complexas e repetidas',
            topicos: 'Espirais, centros, nós, selas — classificação de pontos de equilíbrio',
            materia: 'edo-avancado',
            referencia: 'Boyce & DiPrima §7.6–7.8 · Strogatz §5.2',
          },
          {
            num: 8,
            titulo: 'Exponencial de matriz e solução geral de x′=Ax',
            topicos: 'e^(At), fórmula de Cayley-Hamilton, implementação',
            materia: 'edo-avancado',
            referencia: 'Boyce & DiPrima §7.7 · Apostol II §11.11',
          },
          {
            num: 9,
            titulo: 'Sistemas de EDOs não-lineares: linearização',
            topicos: 'Ponto de equilíbrio, Jacobiano, estabilidade de Lyapunov',
            materia: 'edo-avancado',
            referencia: 'Boyce & DiPrima §9.1–9.3 · Strogatz §6.1–6.3',
          },
          {
            num: 10,
            titulo: 'Workshop Unidade 1 — EDOs de 2ª Ordem e Sistemas',
            topicos: 'Problemas de vibrações, circuitos e espaço de fase estilo USP/ITA',
            materia: 'edo-avancado',
            referencia: 'REAMAT cap. 14 · Boyce & DiPrima Listas 3 e 7',
          },
        ],
      },
      {
        num: 2,
        titulo: 'Unidade 2 — Transformadas de Laplace e Fourier',
        foco:
          'Transformada de Laplace para resolução de EDOs com condições iniciais; ' +
          'série e transformada de Fourier para análise de sinais.',
        licoes: [
          {
            num: 11,
            titulo: 'Transformada de Laplace: definição e propriedades',
            topicos: 'ℒ{f}(s) = ∫₀^∞ e^(−st)f(t)dt, transformadas elementares, linearidade',
            materia: 'transformadas',
            referencia: 'Boyce & DiPrima §6.1 · REAMAT §15.1',
            slug: 'cal4-u2-l11-laplace',
          },
          {
            num: 12,
            titulo: 'Propriedades da Laplace: derivação, integração, translação',
            topicos: 'ℒ{f′}=sF−f(0), ℒ{e^(at)f}=F(s−a), translação no tempo',
            materia: 'transformadas',
            referencia: 'Boyce & DiPrima §6.2–6.3 · REAMAT §15.2',
          },
          {
            num: 13,
            titulo: 'Transformada inversa: frações parciais e tabelas',
            topicos: 'ℒ⁻¹, decomposição em frações parciais, Heaviside',
            materia: 'transformadas',
            referencia: 'Boyce & DiPrima §6.2 · REAMAT §15.3',
          },
          {
            num: 14,
            titulo: 'Resolução de EDOs e sistemas via Laplace',
            topicos: 'Aplicação a y″+by′+cy=g(t) com CI, circuito RLC',
            materia: 'transformadas',
            referencia: 'Boyce & DiPrima §6.4 · REAMAT §15.4',
          },
          {
            num: 15,
            titulo: 'Função de Heaviside e delta de Dirac',
            topicos: 'u_c(t), ℒ{u_c}, δ(t−c), resposta impulsiva',
            materia: 'transformadas',
            referencia: 'Boyce & DiPrima §6.3–6.5 · REAMAT §15.5',
          },
          {
            num: 16,
            titulo: 'Convolução e Teorema de Convolução',
            topicos: '(f*g)(t) = ∫₀ᵗ f(τ)g(t−τ)dτ, ℒ{f*g}=F·G, função de transferência',
            materia: 'transformadas',
            referencia: 'Boyce & DiPrima §6.6 · REAMAT §15.6',
          },
          {
            num: 17,
            titulo: 'Série de Fourier: coeficientes e convergência',
            topicos: 'Coeficientes aₙ, bₙ, série complexa, convergência pontual',
            materia: 'transformadas',
            referencia: 'Boyce & DiPrima §10.2–10.3 · REAMAT §9.6',
          },
          {
            num: 18,
            titulo: 'Série de Fourier: seno, cosseno, forma complexa',
            topicos: 'Série de seno e cosseno em [0,L], forma exponencial, parseval',
            materia: 'transformadas',
            referencia: 'Boyce & DiPrima §10.4 · REAMAT §9.7',
          },
          {
            num: 19,
            titulo: 'Transformada de Fourier',
            topicos: 'ℱ{f}(ω), inversa, propriedades, convolução, análise espectral',
            materia: 'transformadas',
            referencia: 'Boyce & DiPrima §10.6 · REAMAT §9.8',
          },
          {
            num: 20,
            titulo: 'Workshop Unidade 2 — Transformadas',
            topicos: 'Resolução de EDOs e sistemas via Laplace; análise de sinais periódicos',
            materia: 'transformadas',
            referencia: 'REAMAT cap. 15 · Boyce & DiPrima Listas 6 e 10',
          },
        ],
      },
      {
        num: 3,
        titulo: 'Unidade 3 — Análise Numérica Aplicada',
        foco: 'Erros, zeros de funções, interpolação, integração numérica e métodos para EDOs.',
        licoes: [
          {
            num: 21,
            titulo: 'Aritmética de ponto flutuante e análise de erros',
            topicos: 'IEEE 754, erro de representação, cancelamento catastrófico, propagação',
            materia: 'analise-numerica',
            referencia: 'REAMAT §2.1 · Burden & Faires §1.2',
          },
          {
            num: 22,
            titulo: 'Zeros de funções: bisseção e ponto fixo',
            topicos: 'Convergência de bisseção, teorema do ponto fixo de Banach',
            materia: 'analise-numerica',
            referencia: 'REAMAT §5.1 · Burden & Faires §2.1–2.2',
          },
          {
            num: 23,
            titulo: 'Newton-Raphson multivariável e método da secante',
            topicos: 'Sistema F(x)=0, Jacobiano, taxa de convergência quadrática',
            materia: 'analise-numerica',
            referencia: 'REAMAT §5.2–5.3 · Burden & Faires §2.3',
          },
          {
            num: 24,
            titulo: 'Interpolação polinomial: Lagrange e Newton',
            topicos: 'Polinômio de Lagrange, diferenças divididas, erro de interpolação',
            materia: 'analise-numerica',
            referencia: 'REAMAT §7.1–7.2 · Burden & Faires §3.1–3.3',
          },
          {
            num: 25,
            titulo: 'Interpolação por splines cúbicas',
            topicos: 'Splines naturais e not-a-knot, sistema tridiagonal, suavidade C²',
            materia: 'analise-numerica',
            referencia: 'REAMAT §7.3 · Burden & Faires §3.5',
          },
          {
            num: 26,
            titulo: 'Integração numérica: trapézio, Simpson e Gauss',
            topicos: 'Fórmulas de Newton-Cotes, erro, quadratura de Gauss-Legendre',
            materia: 'analise-numerica',
            referencia: 'REAMAT §6.6 · Burden & Faires §4.1–4.3',
            slug: 'cal4-u3-l26-integracao-numerica',
          },
          {
            num: 27,
            titulo: 'Sistemas lineares: eliminação de Gauss e fatoração LU',
            topicos: 'Pivoteamento parcial, fatoração PA=LU, condicionamento, norma de matriz',
            materia: 'analise-numerica',
            referencia: 'REAMAT §8.1–8.2 · Burden & Faires §6.1–6.4',
          },
          {
            num: 28,
            titulo: 'Métodos iterativos: Jacobi, Gauss-Seidel',
            topicos: 'Convergência (raio espectral), critério de parada, SOR',
            materia: 'analise-numerica',
            referencia: 'REAMAT §8.3 · Burden & Faires §7.1–7.3',
          },
          {
            num: 29,
            titulo: 'Métodos numéricos para EDOs: Runge-Kutta e Adams',
            topicos: 'RK4, métodos multipasso Adams-Bashforth, controle de passo',
            materia: 'analise-numerica',
            referencia: 'REAMAT §10.4–10.5 · Burden & Faires §5.1–5.4',
          },
          {
            num: 30,
            titulo: 'Workshop Unidade 3 — Análise Numérica',
            topicos: 'Implementação em Python: bisseção, LU, RK4; interpretação de erros',
            materia: 'analise-numerica',
            referencia: 'REAMAT · Burden & Faires selecionados',
          },
        ],
      },
      {
        num: 4,
        titulo: 'Unidade 4 — Equações Diferenciais Parciais e Síntese Final',
        foco:
          'Introdução às EDPs clássicas (ondas, calor, Laplace) e conexão com as demais ' +
          'disciplinas do programa.',
        licoes: [
          {
            num: 31,
            titulo: 'Introdução às EDPs: classificação e exemplos',
            topicos: 'Elíptica, parabólica, hiperbólica — exemplos físicos canônicos',
            materia: 'topicos-avancados',
            referencia: 'Boyce & DiPrima §10.1 · REAMAT §16.1',
          },
          {
            num: 32,
            titulo: 'Equação da onda: separação de variáveis',
            topicos: 'u_tt = c²u_xx, modos normais, problema de valor inicial',
            materia: 'topicos-avancados',
            referencia: 'Boyce & DiPrima §10.7 · REAMAT §16.2',
          },
          {
            num: 33,
            titulo: 'Equação do calor',
            topicos: 'u_t = αu_xx, solução por Fourier, estado estacionário',
            materia: 'topicos-avancados',
            referencia: 'Boyce & DiPrima §10.5 · REAMAT §16.3',
          },
          {
            num: 34,
            titulo: 'Equação de Laplace e problema de Dirichlet',
            topicos: '∇²u=0, harmônicas, solução via separação em retângulo e disco',
            materia: 'topicos-avancados',
            referencia: 'Boyce & DiPrima §10.8 · REAMAT §16.4',
          },
          {
            num: 35,
            titulo: 'Método de diferenças finitas para EDPs',
            topicos: 'Discretização, estabilidade (von Neumann), implementação Laplace 2D',
            materia: 'topicos-avancados',
            referencia: 'Burden & Faires §12.1–12.2 · REAMAT §16.5',
          },
          {
            num: 36,
            titulo: 'Funções especiais: Bessel e Legendre (introdução)',
            topicos: 'Equação de Bessel, Jₙ(x), equação de Legendre, Pₙ(x)',
            materia: 'topicos-avancados',
            referencia: 'Boyce & DiPrima §11.4–11.5',
          },
          {
            num: 37,
            titulo: 'Análise complexa: números complexos, funções analíticas',
            topicos: 'ℂ, funções holomorfas, equações de Cauchy-Riemann',
            materia: 'topicos-avancados',
            referencia: 'Guidorizzi vol. 4 §1.1–1.3 · Churchill §1–2',
          },
          {
            num: 38,
            titulo: 'Integral de Cauchy e Teorema dos Resíduos',
            topicos: '∮_C f dz, fórmula integral de Cauchy, pólos, cálculo de integrais reais',
            materia: 'topicos-avancados',
            referencia: 'Guidorizzi vol. 4 §2 · Churchill §4–6',
          },
          {
            num: 39,
            titulo: 'Conexão: Black-Scholes como EDP parabólica',
            topicos: '∂V/∂t + ½σ²S²∂²V/∂S² + rS∂V/∂S − rV = 0, substituição para equação do calor',
            materia: 'topicos-avancados',
            referencia: 'Wilmott §5 · REAMAT §16.6',
          },
          {
            num: 40,
            titulo: 'Workshop Final — Cálculo 4 e síntese do programa de Engenharia',
            topicos: 'Prova simulada completa: 25 questões cobrindo Cálculo 1–4',
            materia: 'topicos-avancados',
            referencia: 'REAMAT · ITA/USP provas históricas · Boyce & DiPrima revisão geral',
          },
        ],
      },
    ],
  },
]

// ─── Utilitários ──────────────────────────────────────────────────────────────

/** Lista linear de todas as lições de Engenharia, em ordem. */
export const LICOES_ENG_FLAT: LicaoEng[] = PROGRAMA_ENG.flatMap((disc) =>
  disc.unidades.flatMap((unid) => unid.licoes),
)

/** Matérias únicas de uma disciplina, em ordem de aparição. */
export function materiasEng(disc: DisciplinaEngData): MateriaEng[] {
  const set = new Set<MateriaEng>()
  for (const u of disc.unidades) for (const l of u.licoes) set.add(l.materia)
  return Array.from(set)
}

/** Lições filtradas por matéria em uma disciplina. */
export function licoesPorMateriaEng(disc: DisciplinaEngData, materia: MateriaEng): LicaoEng[] {
  return disc.unidades
    .flatMap((u) => u.licoes)
    .filter((l) => l.materia === materia)
    .sort((a, b) => a.num - b.num)
}
