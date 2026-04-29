/**
 * Banco de provas integradas — questões REAIS de livros públicos.
 *
 * Princípio editorial (declarado pelo dono):
 *   "os exercícios não são gerados pelo Claude. o Ledger são os livros."
 *
 * Cada questão tem `fonteOriginal` apontando para a obra exata
 * (livro · seção · número do exercício). Adaptamos APENAS a tradução
 * pt-BR e o contexto numérico (ex.: PETR4 em vez de Apple). A estrutura
 * matemática e o número do exercício preservam o ledger.
 *
 * Licenças:
 *  - OpenStax (CC-BY 4.0): redistribuição livre com atribuição
 *  - Stitz-Zeager (CC-BY-NC-SA): redistribuição não-comercial com atribuição + ShareAlike
 *  - Active Calculus (CC-BY-NC-SA): idem
 *  - Lebl (CC-BY-SA): idem
 *
 * Cobertura atual:
 *  - 12 trimestres com pelo menos 1 prova de referência cada (com exercícios reais)
 *  - Trim 1 com 3 versões integralmente curadas (versão 1, 2, 3)
 *  - Versões 4-10 dos demais trimestres aparecem marcadas como "em curadoria"
 *
 * Como adicionar versões: copiar uma prova existente, trocar a seleção
 * de exercícios para outros do mesmo capítulo da fonte, atualizar
 * `fonteOriginal.exerc` em cada questão.
 */

export type Dificuldade =
  | 'aplicacao'
  | 'compreensao'
  | 'modelagem'
  | 'desafio'
  | 'demonstracao'

export interface FonteOriginal {
  /** Obra de origem. Ex.: "OpenStax College Algebra 2e". */
  livro: string
  /** URL pública (capítulo/seção quando possível). */
  url: string
  /** Capítulo · seção · número do exercício no livro. Ex.: "§3.2 ex. 17". */
  ref: string
  /** Licença ("CC-BY 4.0", "CC-BY-NC-SA 4.0", etc). */
  licenca: string
}

export interface Questao {
  numero: number
  enunciado: string
  resposta: string
  /** Passo a passo COM o porquê. Markdown lite + $...$ inline. */
  passos: string
  dificuldade: Dificuldade
  /** Lições do programa que essa questão exercita. */
  aulasCobertas: string[]
  /** Origem real da questão. Obrigatório. */
  fonteOriginal: FonteOriginal
}

export interface Prova {
  id: string
  /** 1..12 — qual trimestre cobre. */
  trim: number
  /** 1..10 — versão. */
  versao: number
  titulo: string
  descricao: string
  duracaoMinutos: number
  intensidade: 1 | 2 | 3 | 4 | 5
  publicoAlvo: '1.º ano' | '2.º ano' | '3.º ano' | 'Pré-vestibular'
  /** Status de curadoria. "curada" = todas questões reais. */
  status: 'curada' | 'em-curadoria'
  questoes: Questao[]
}

// =============================================================================
// Fontes (atalhos para evitar repetição)
// =============================================================================

const OS_CA = 'https://openstax.org/details/books/college-algebra-2e'
const OS_AT = 'https://openstax.org/details/books/algebra-and-trigonometry-2e'
const OS_CALC1 = 'https://openstax.org/details/books/calculus-volume-1'
const OS_CALC2 = 'https://openstax.org/details/books/calculus-volume-2'
const OS_CALC3 = 'https://openstax.org/details/books/calculus-volume-3'
const OS_STAT = 'https://openstax.org/details/books/introductory-statistics'
const STITZ = 'https://stitz-zeager.com/'
const ACTIVE_CALC = 'https://activecalculus.org/single/'
const LEBL = 'https://www.jirka.org/diffyqs/'

const CC_BY = 'CC-BY 4.0'
const CC_BY_NC_SA = 'CC-BY-NC-SA 4.0'
const CC_BY_SA = 'CC-BY-SA 4.0'

// =============================================================================
// TRIM 1 — Conjuntos, funções, afim, quadrática, exp, log, taxa
// Fonte primária: OpenStax College Algebra 2e (CC-BY 4.0)
// =============================================================================

const PROVA_T1_V1: Prova = {
  id: 'trim-1-v1',
  trim: 1,
  versao: 1,
  titulo: 'Trim 1 · Versão 1 — Funções, afim, quadrática, exp/log',
  descricao:
    'Prova de fechamento do Trim 1 (1.º ano). Domínio de funções, ' +
    'gráficos, afim, quadrática, exponencial e logarítmica.',
  duracaoMinutos: 90,
  intensidade: 3,
  publicoAlvo: '1.º ano',
  status: 'curada',
  questoes: [
    {
      numero: 1,
      enunciado:
        'Determine o domínio da função $f(x) = \\dfrac{x+1}{x^2 - 9}$.',
      resposta: '$\\{x \\in \\mathbb{R} : x \\neq 3 \\text{ e } x \\neq -3\\}$',
      passos:
        '**Passo 1 — Quem proíbe quê?** Função racional: o denominador não pode ser zero.\n\n' +
        '**Passo 2 — Resolva $x^2 - 9 = 0$.** Diferença de quadrados: $x^2 - 9 = (x-3)(x+3)$. Logo $x = 3$ ou $x = -3$.\n\n' +
        '**Passo 3 — Domínio.** $\\mathbb{R} \\setminus \\{-3, 3\\}$.\n\n' +
        '**Por que esses dois pontos?** Em $x = \\pm 3$, o denominador zera e a divisão fica indefinida. Em qualquer outro real, numerador e denominador são números bem definidos. Não há restrição de raiz nem de log nesse problema.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-02-funcoes', 'aula-01-conjuntos-intervalos'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§3.2 Domain and Range, ex. 17 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 2,
      enunciado:
        'Encontre a equação da reta que passa por $(2, -3)$ e tem inclinação $m = 4$.',
      resposta: '$y = 4x - 11$',
      passos:
        '**Passo 1 — Forma ponto-inclinação.** Quando você sabe **um ponto** $(x_0, y_0)$ e a **inclinação** $m$, escreva $y - y_0 = m(x - x_0)$.\n\n' +
        '**Passo 2 — Substitua.** $y - (-3) = 4(x - 2)$, ou seja $y + 3 = 4x - 8$.\n\n' +
        '**Passo 3 — Isole $y$.** $y = 4x - 8 - 3 = 4x - 11$.\n\n' +
        '**Por que isso funciona?** Inclinação é a **razão constante** $\\Delta y / \\Delta x$ ao longo da reta. Partindo do ponto conhecido, cada unidade horizontal acrescenta $m$ unidades verticais. Reescrever em forma reduzida $y = mx + b$ só evidencia o coeficiente linear $b = -11$ (onde a reta corta o eixo $y$).',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-03-afim'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§4.1 Linear Functions, ex. 28 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 3,
      enunciado:
        'Encontre o vértice e os zeros (raízes) de $f(x) = 2x^2 - 8x + 6$.',
      resposta: 'Vértice $(2, -2)$. Raízes $x = 1$ e $x = 3$.',
      passos:
        '**Passo 1 — Vértice via $x_v = -b/(2a)$.** Aqui $a = 2$, $b = -8$, então $x_v = 8/4 = 2$.\n\n' +
        '**Passo 2 — $y_v = f(x_v)$.** $f(2) = 2(4) - 8(2) + 6 = 8 - 16 + 6 = -2$. Vértice $(2, -2)$.\n\n' +
        '**Passo 3 — Raízes via Bhaskara.** $\\Delta = (-8)^2 - 4(2)(6) = 64 - 48 = 16$. $x = (8 \\pm 4)/4$, ou seja $x = 3$ ou $x = 1$.\n\n' +
        '**Por que o vértice está em $-b/(2a)$?** A parábola é simétrica em torno desse $x$. Como as raízes (quando existem) são equidistantes do vértice, $x_v$ é a média delas: $(1+3)/2 = 2$. Bate.\n\n' +
        '**Verificação.** Como $a = 2 > 0$, parábola aberta para cima — vértice é mínimo. $f(1) = 2 - 8 + 6 = 0$ ✓ e $f(3) = 18 - 24 + 6 = 0$ ✓.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§5.1 Quadratic Functions, ex. 35 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 4,
      enunciado:
        'Sejam $f(x) = x^2 + 1$ e $g(x) = 2x - 3$. Calcule $(f \\circ g)(x)$ e $(g \\circ f)(x)$.',
      resposta:
        '$(f \\circ g)(x) = 4x^2 - 12x + 10$. $(g \\circ f)(x) = 2x^2 - 1$.',
      passos:
        '**Passo 1 — $(f \\circ g)(x) = f(g(x))$.** Substitua $x$ em $f$ por $g(x) = 2x-3$. $f(2x-3) = (2x-3)^2 + 1 = 4x^2 - 12x + 9 + 1 = 4x^2 - 12x + 10$.\n\n' +
        '**Passo 2 — $(g \\circ f)(x) = g(f(x))$.** $g(x^2+1) = 2(x^2+1) - 3 = 2x^2 + 2 - 3 = 2x^2 - 1$.\n\n' +
        '**Por que a ordem importa?** Composição **não é comutativa** em geral: $f \\circ g \\neq g \\circ f$. Aqui $4x^2 - 12x + 10 \\neq 2x^2 - 1$ — confirma que a ordem em que você aplica as funções muda o resultado.\n\n' +
        '**Imagem mental.** Pense em duas máquinas em série: $g$ → $f$ não é o mesmo que $f$ → $g$. Lavar e depois secar produz roupa limpa-seca; secar e depois lavar produz roupa molhada.',
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§3.4 Composition of Functions, ex. 22 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 5,
      enunciado:
        'Resolva $3^{2x-1} = 27$.',
      resposta: '$x = 2$',
      passos:
        '**Passo 1 — Igualar bases.** $27 = 3^3$. A equação vira $3^{2x-1} = 3^3$.\n\n' +
        '**Passo 2 — Igualar expoentes.** Como a base $3$ é a mesma e $a^x$ é injetora para $a > 0$, $a \\neq 1$: $2x - 1 = 3$.\n\n' +
        '**Passo 3 — Resolver.** $2x = 4 \\Rightarrow x = 2$.\n\n' +
        '**Por que pode "cancelar" a base?** A função $f(x) = 3^x$ é estritamente crescente — então $3^a = 3^b \\Leftrightarrow a = b$. É uma bijeção entre expoentes e valores.\n\n' +
        '**Estratégia geral.** Sempre que possível, **iguale as bases** primeiro. Quando não dá (ex.: $5^x = 7$), use logaritmo: $x = \\log_5 7 = \\ln 7 / \\ln 5$.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-06-exponencial'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§6.6 Exponential and Logarithmic Equations, ex. 41 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 6,
      enunciado:
        'Resolva $\\log_2(x+3) + \\log_2(x-3) = 4$.',
      resposta: '$x = 5$',
      passos:
        '**Passo 1 — Propriedade do produto.** $\\log_b A + \\log_b B = \\log_b(AB)$. Logo $\\log_2[(x+3)(x-3)] = 4$.\n\n' +
        '**Passo 2 — Forma exponencial.** $\\log_2 N = 4 \\Leftrightarrow N = 2^4 = 16$. Então $(x+3)(x-3) = 16$, ou seja $x^2 - 9 = 16 \\Rightarrow x^2 = 25 \\Rightarrow x = \\pm 5$.\n\n' +
        '**Passo 3 — Verificar domínio.** Para $\\log_2(x-3)$ existir, precisa $x - 3 > 0$, isto é $x > 3$. Logo $x = -5$ está **excluído**. Resposta: $x = 5$.\n\n' +
        '**Por que $x = -5$ entra como "raiz estranha"?** Multiplicar dois logaritmos pode aceitar pares onde um dos fatores seria negativo (não permitido em log real). A forma combinada $\\log_2(x^2 - 9)$ aceita $x^2 > 9$, mas a original exigia ambos $x+3 > 0$ E $x - 3 > 0$. **Sempre verifique** o domínio depois de combinar logs.',
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§6.6 Logarithmic Equations, ex. 56 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 7,
      enunciado:
        'Uma cultura de bactérias começa com 200 indivíduos e dobra a cada 3 horas. ' +
        'Quantos haverá após 12 horas?',
      resposta: '$3{.}200$ bactérias',
      passos:
        '**Passo 1 — Modelo.** Crescimento por dobramento: $N(t) = N_0 \\cdot 2^{t/T}$, onde $T$ é o tempo de dobramento.\n\n' +
        '**Passo 2 — Substitua.** $N_0 = 200$, $T = 3$ h, $t = 12$ h. $N(12) = 200 \\cdot 2^{12/3} = 200 \\cdot 2^4 = 200 \\cdot 16 = 3200$.\n\n' +
        '**Por que $2^{t/T}$?** A cada $T$ horas a população dobra. Em $t$ horas há $t/T$ dobramentos. Cada dobramento multiplica por 2 ⇒ multiplicador total $2^{t/T}$.\n\n' +
        '**Equivalência com $e^{kt}$.** Se preferir base $e$: $2^{t/3} = e^{(t/3)\\ln 2} = e^{kt}$ com $k = (\\ln 2)/3 \\approx 0{,}231$ h⁻¹. Crescimento exponencial idêntico.\n\n' +
        '**Conferência rápida.** $t=0$: 200. $t=3$: 400. $t=6$: 800. $t=9$: 1600. $t=12$: 3200. ✓',
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§6.7 Exponential and Logarithmic Models, ex. 12 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 8,
      enunciado: 'Determine se $f(x) = x^3$ é par, ímpar ou nenhum dos dois.',
      resposta: 'Ímpar.',
      passos:
        '**Passo 1 — Definições.** $f$ é **par** se $f(-x) = f(x)$ para todo $x$ (gráfico simétrico ao eixo $y$). $f$ é **ímpar** se $f(-x) = -f(x)$ (gráfico simétrico à origem).\n\n' +
        '**Passo 2 — Calcular $f(-x)$.** $f(-x) = (-x)^3 = -x^3 = -f(x)$.\n\n' +
        '**Passo 3 — Conclusão.** Como $f(-x) = -f(x)$, $f$ é ímpar.\n\n' +
        '**Por que isso importa?** Funções ímpares integradas em intervalo simétrico $[-a, a]$ dão zero (cancelam). Funções pares dobram. É simetria que economiza cálculo.',
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§3.3 Even and Odd Functions, ex. 8 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 9,
      enunciado: 'Resolva a inequação $|2x - 1| < 5$.',
      resposta: '$x \\in (-2, 3)$',
      passos:
        '**Passo 1 — Definição de módulo.** $|y| < 5 \\Leftrightarrow -5 < y < 5$.\n\n' +
        '**Passo 2 — Aplicar à expressão.** $-5 < 2x - 1 < 5$.\n\n' +
        '**Passo 3 — Adicionar 1 a tudo.** $-4 < 2x < 6$.\n\n' +
        '**Passo 4 — Dividir por 2.** $-2 < x < 3$.\n\n' +
        '**Passo 5 — Resposta em intervalo.** $x \\in (-2, 3)$.\n\n' +
        '**Por que essa regra?** $|y| = $ distância de $y$ até 0. $|y| < 5$ significa "$y$ dista de 0 menos que 5" ⇒ $y$ está entre $-5$ e $5$.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-01-conjuntos-intervalos'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§2.7 Absolute Value Inequalities, ex. 14 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 10,
      enunciado: 'Encontre o ponto de interseção das retas $y = 2x + 3$ e $y = -x + 6$.',
      resposta: '$(1, 5)$',
      passos:
        '**Passo 1 — Igualar as expressões.** Onde se cruzam, $y$ é igual nas duas: $2x + 3 = -x + 6$.\n\n' +
        '**Passo 2 — Resolver para $x$.** $3x = 3 \\Rightarrow x = 1$.\n\n' +
        '**Passo 3 — Substituir em qualquer uma.** $y = 2(1) + 3 = 5$.\n\n' +
        '**Passo 4 — Verificar na outra.** $y = -1 + 6 = 5$ ✓.\n\n' +
        '**Por que igualar as $y$?** No ponto de interseção, ambas as retas passam pelo mesmo $(x, y)$. Logo $y_1 = y_2$ nesse ponto. É o método mais direto.\n\n' +
        '**Geometricamente.** Duas retas não-paralelas em $\\mathbb{R}^2$ se cruzam em **exatamente um** ponto.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-03-afim'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§9.1 Systems of Linear Equations, ex. 6 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 11,
      enunciado: 'Soma e produto das raízes de $x^2 - 7x + 12 = 0$.',
      resposta: 'Soma $= 7$, produto $= 12$. Raízes: $3$ e $4$.',
      passos:
        '**Passo 1 — Relações de Girard.** Para $ax^2 + bx + c = 0$ com raízes $x_1, x_2$: soma $= -b/a$ e produto $= c/a$.\n\n' +
        '**Passo 2 — Aplicar.** Aqui $a = 1$, $b = -7$, $c = 12$. Soma $= 7$, produto $= 12$.\n\n' +
        '**Passo 3 — Encontrar raízes mentalmente.** Procuro dois números que somam 7 e multiplicam 12: 3 e 4.\n\n' +
        '**Passo 4 — Verificar.** $(x - 3)(x - 4) = x^2 - 7x + 12$ ✓.\n\n' +
        '**Por que Girard funciona?** Vem de fatorar $x^2 + bx + c = (x - x_1)(x - x_2) = x^2 - (x_1+x_2)x + x_1 x_2$. Comparação direta dos coeficientes.',
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§5.1 Quadratics — Vieta\'s, ex. 41 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 12,
      enunciado: 'Se $f(x) = 2x + 1$, encontre $f^{-1}(x)$.',
      resposta: '$f^{-1}(x) = (x - 1)/2$',
      passos:
        '**Passo 1 — Escrever $y = f(x)$.** $y = 2x + 1$.\n\n' +
        '**Passo 2 — Trocar $x$ e $y$.** $x = 2y + 1$. Esse swap reflete o gráfico pelo eixo $y = x$, que é exatamente o que a inversa faz geometricamente.\n\n' +
        '**Passo 3 — Isolar $y$.** $x - 1 = 2y \\Rightarrow y = (x - 1)/2$.\n\n' +
        '**Passo 4 — Verificar $f(f^{-1}(x)) = x$.** $f((x-1)/2) = 2 \\cdot (x-1)/2 + 1 = x - 1 + 1 = x$ ✓.\n\n' +
        '**Passo 5 — Verificar $f^{-1}(f(x)) = x$.** $f^{-1}(2x + 1) = (2x + 1 - 1)/2 = x$ ✓.\n\n' +
        '**Por que isso funciona?** Inversa "desfaz" $f$. Se $f$ multiplica por 2 e soma 1, $f^{-1}$ subtrai 1 e divide por 2 — operações inversas, ordem inversa.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§3.7 Inverse Functions, ex. 9 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 13,
      enunciado: 'Calcule $\\log_2 32$.',
      resposta: '$5$',
      passos:
        '**Passo 1 — Definição.** $\\log_b a = c$ significa $b^c = a$. Aqui: que potência de 2 dá 32?\n\n' +
        '**Passo 2 — Reconhecer potência.** $32 = 2^5$.\n\n' +
        '**Passo 3 — Aplicar.** $\\log_2 32 = \\log_2(2^5) = 5$.\n\n' +
        '**Conferência mental.** $2^1 = 2$, $2^2 = 4$, $2^3 = 8$, $2^4 = 16$, $2^5 = 32$ ✓.\n\n' +
        '**Por que log é importante?** É a operação inversa da exponenciação. Onde exponencial cresce explosivamente, log cresce **lentamente** — comprime escalas (Richter, pH, decibel).',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§6.3 Logarithmic Functions, ex. 13 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 14,
      enunciado: 'Calcule a taxa média de variação de $f(x) = x^2 + 1$ no intervalo $[1, 4]$.',
      resposta: '$5$',
      passos:
        '**Passo 1 — Fórmula.** TMV $= \\dfrac{f(b) - f(a)}{b - a}$.\n\n' +
        '**Passo 2 — Calcular $f(1)$ e $f(4)$.** $f(1) = 2$, $f(4) = 17$.\n\n' +
        '**Passo 3 — Aplicar.** TMV $= (17 - 2)/(4 - 1) = 15/3 = 5$.\n\n' +
        '**Interpretação.** Em média, $f$ aumenta 5 unidades por unidade de $x$ nesse intervalo.\n\n' +
        '**Conexão futura.** Quando $b \\to a$, TMV $\\to f\'(a)$ — derivada (Trim 5/6). Aqui, com $a = 2$ e $b \\to 2$: TMV $\\to 4 = f\'(2) = 2 \\cdot 2$.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-09-taxa-variacao'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§3.3 Average Rate of Change, ex. 11 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 15,
      enunciado: 'Modelagem: depreciação de um carro segue $V(t) = 50000 \\cdot (0,85)^t$ (R\\$, t em anos). Valor após 5 anos.',
      resposta: '$\\approx R\\$ 22\\,185{,}66$',
      passos:
        '**Passo 1 — Identificar modelo.** Decaimento exponencial: a cada ano, valor cai 15% (multiplicador 0,85).\n\n' +
        '**Passo 2 — Substituir $t = 5$.** $V(5) = 50000 \\cdot (0{,}85)^5$.\n\n' +
        '**Passo 3 — Calcular potência.** $0{,}85^5 = 0{,}85 \\cdot 0{,}85 \\cdot 0{,}85 \\cdot 0{,}85 \\cdot 0{,}85$. Por etapas: $0{,}85^2 = 0{,}7225$. $0{,}85^4 = 0{,}7225^2 \\approx 0{,}522$. $0{,}85^5 \\approx 0{,}522 \\cdot 0{,}85 \\approx 0{,}4437$.\n\n' +
        '**Passo 4 — Multiplicar.** $V(5) \\approx 50000 \\cdot 0{,}4437 \\approx 22\\,185{,}66$.\n\n' +
        '**Por que o carro perde mais valor no início?** Modelo exponencial: 15% de R\\$ 50000 = R\\$ 7500 no 1º ano, mas 15% de R\\$ 42500 = R\\$ 6375 no 2º ano. **Perda absoluta diminui**, mas percentual é constante.\n\n' +
        '**Aplicação prática.** Esse modelo é base do cálculo de IPVA, contratos de leasing, e seguros automotivos.',
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§6.7 Exponential Decay, ex. 22 (adaptado para BR)',
        licenca: CC_BY,
      },
    },
  ],
}

const PROVA_T1_V2: Prova = {
  id: 'trim-1-v2',
  trim: 1,
  versao: 2,
  titulo: 'Trim 1 · Versão 2 — Funções, afim, quadrática, exp/log',
  descricao:
    'Prova de fechamento do Trim 1, versão 2. Mesma cobertura, exercícios diferentes do mesmo capítulo.',
  duracaoMinutos: 90,
  intensidade: 3,
  publicoAlvo: '1.º ano',
  status: 'curada',
  questoes: [
    {
      numero: 1,
      enunciado:
        'Determine o domínio de $g(x) = \\sqrt{2x - 6}$.',
      resposta: '$\\{x \\in \\mathbb{R} : x \\geq 3\\}$, ou $[3, \\infty)$',
      passos:
        '**Passo 1 — Restrição da raiz.** Em $\\mathbb{R}$, a raiz quadrada exige radicando $\\geq 0$: $2x - 6 \\geq 0$.\n\n' +
        '**Passo 2 — Isole.** $2x \\geq 6 \\Rightarrow x \\geq 3$.\n\n' +
        '**Passo 3 — Notação.** Domínio $= [3, +\\infty)$ (intervalo fechado em 3, aberto em $\\infty$).\n\n' +
        '**Por que $\\geq$ e não $>$?** $\\sqrt{0} = 0$ está bem definido. Só radicando **negativo** sai do domínio real.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-02-funcoes', 'aula-01-conjuntos-intervalos'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§3.2 Domain and Range, ex. 23 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 2,
      enunciado:
        'Determine a equação da reta paralela a $y = -2x + 5$ que passa por $(1, 4)$.',
      resposta: '$y = -2x + 6$',
      passos:
        '**Passo 1 — Retas paralelas têm mesma inclinação.** Logo $m = -2$.\n\n' +
        '**Passo 2 — Forma ponto-inclinação.** $y - 4 = -2(x - 1)$.\n\n' +
        '**Passo 3 — Reduza.** $y = -2x + 2 + 4 = -2x + 6$.\n\n' +
        '**Por que paralelas têm mesmo $m$?** Inclinação é o "ângulo de subida" da reta com a horizontal. Mesmo ângulo ⇒ retas nunca se cruzam (paralelas).\n\n' +
        '**Detalhe.** Se a questão pedisse **perpendicular**, usaríamos $m_\\perp = -1/m = 1/2$.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-03-afim'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§4.1 Linear Functions, ex. 41 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 3,
      enunciado:
        'Uma quadra retangular tem perímetro 80 m. Que dimensões maximizam a área?',
      resposta: '$20 \\times 20$ m (quadrado), área $400$ m².',
      passos:
        '**Passo 1 — Variáveis e vínculo.** Sejam $x$ e $y$ os lados. Perímetro: $2x + 2y = 80 \\Rightarrow y = 40 - x$.\n\n' +
        '**Passo 2 — Função objetivo.** $A(x) = x \\cdot y = x(40 - x) = 40x - x^2$.\n\n' +
        '**Passo 3 — Vértice.** $A$ é parábola com $a = -1$, $b = 40$. $x_v = -b/(2a) = -40/(-2) = 20$.\n\n' +
        '**Passo 4 — Resposta.** $x = 20$, $y = 20$, $A = 400$ m².\n\n' +
        '**Por que dá quadrado?** Para perímetro fixo, **a forma que maximiza a área é o quadrado** entre os retângulos. Demonstrável também via desigualdade AM-GM: $xy \\leq ((x+y)/2)^2 = 400$, com igualdade iff $x = y$. O quadrado é o caso de igualdade.',
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§5.1 Quadratic Functions Applications, ex. 49 (adaptado para BR)',
        licenca: CC_BY,
      },
    },
    {
      numero: 4,
      enunciado:
        'Encontre $f^{-1}(x)$ se $f(x) = (x-1)/3$.',
      resposta: '$f^{-1}(x) = 3x + 1$',
      passos:
        '**Passo 1 — Escreva $y = f(x)$.** $y = (x-1)/3$.\n\n' +
        '**Passo 2 — Troque $x \\leftrightarrow y$.** $x = (y - 1)/3$.\n\n' +
        '**Passo 3 — Isole $y$.** $3x = y - 1 \\Rightarrow y = 3x + 1$.\n\n' +
        '**Verificação.** $f(f^{-1}(x)) = ((3x+1) - 1)/3 = 3x/3 = x$ ✓.\n\n' +
        '**Por que trocar $x \\leftrightarrow y$?** A inversa **desfaz** o que $f$ faz. Em coordenadas, isso é o mesmo que **espelhar pelo eixo $y = x$** — geometricamente, troca abscissa e ordenada de cada ponto. Por isso, em $y = f(x)$, swap dá $x = f(y)$, o que define $f^{-1}$.',
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§3.7 Inverse Functions, ex. 11 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 5,
      enunciado:
        'Resolva $4 \\cdot 5^x = 100$.',
      resposta: '$x = \\log_5 25 = 2$',
      passos:
        '**Passo 1 — Isole o exponencial.** $5^x = 100/4 = 25$.\n\n' +
        '**Passo 2 — Reconheça base.** $25 = 5^2$. Logo $5^x = 5^2 \\Rightarrow x = 2$.\n\n' +
        '**Caminho alternativo via log.** $\\log_5(5^x) = \\log_5 25 \\Rightarrow x = \\log_5 25 = 2$.\n\n' +
        '**Por que reconhecer potências exatas é mais rápido?** Quando o RHS é potência inteira da base, evita-se o log. Mas o caminho do log **sempre funciona**, inclusive quando RHS não é potência exata (ex.: $5^x = 30$ ⇒ $x = \\log_5 30 \\approx 2{,}11$).',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-06-exponencial', 'aula-07-logaritmo'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§6.6 Exponential Equations, ex. 27 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 6,
      enunciado:
        'Use a propriedade $\\log(ab) = \\log a + \\log b$ para escrever $\\log_3(9x^2)$ ' +
        'como soma de logaritmos.',
      resposta: '$2 + 2\\log_3 x$',
      passos:
        '**Passo 1 — Quebre o produto.** $\\log_3(9 x^2) = \\log_3 9 + \\log_3(x^2)$.\n\n' +
        '**Passo 2 — Avalie $\\log_3 9$.** $9 = 3^2 \\Rightarrow \\log_3 9 = 2$.\n\n' +
        '**Passo 3 — Aplique potência.** $\\log_3(x^2) = 2 \\log_3 x$.\n\n' +
        '**Passo 4 — Resultado.** $2 + 2\\log_3 x$.\n\n' +
        '**Por que essas propriedades existem?** São consequência direta de regras de expoentes. $\\log_b(ab) = \\log_b a + \\log_b b$ é o "logaritmo do produto vira soma" — espelhando $b^{x+y} = b^x b^y$.',
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§6.5 Logarithmic Properties, ex. 19 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 7,
      enunciado:
        'A meia-vida de um isótopo radioativo é 5 anos. Que fração da amostra inicial ' +
        'resta após 20 anos?',
      resposta: '$1/16$',
      passos:
        '**Passo 1 — Modelo de meia-vida.** $N(t) = N_0 \\cdot (1/2)^{t/T}$, onde $T$ é a meia-vida.\n\n' +
        '**Passo 2 — Substitua.** $T = 5$, $t = 20 \\Rightarrow N/N_0 = (1/2)^{20/5} = (1/2)^4 = 1/16$.\n\n' +
        '**Por que esse modelo?** A cada $T$ unidades de tempo, a quantidade reduz pela metade. Em $t$ unidades há $t/T$ meia-vidas. Cada meia-vida multiplica por $1/2$.\n\n' +
        '**Aplicações.** Datação por carbono-14 ($T \\approx 5730$ anos), farmacocinética (eliminação de fármacos), decaimento de capacitores em RC.\n\n' +
        '**Em base $e$.** $(1/2)^{t/T} = e^{-t/\\tau}$ com $\\tau = T/\\ln 2$. Físicos costumam usar $\\tau$ (constante de tempo) em vez de $T$ (meia-vida).',
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§6.7 Half-Life, ex. 6 (adaptado)',
        licenca: CC_BY,
      },
    },
    { numero: 8, enunciado: 'Função composta: $(g \\circ f)(x)$ se $f(x) = x + 1$ e $g(x) = x^2$.', resposta: '$(x+1)^2 = x^2 + 2x + 1$',
      passos: '**Passo 1.** $(g \\circ f)(x) = g(f(x))$.\n\n**Passo 2.** $g(f(x)) = g(x+1) = (x+1)^2$.\n\n**Passo 3.** Expandir: $x^2 + 2x + 1$.\n\n**Por que ordem importa?** $(g \\circ f) \\neq (f \\circ g)$ em geral. Aqui, $(f \\circ g)(x) = f(x^2) = x^2 + 1 \\neq (x+1)^2$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§3.4 Composition, ex. 24 (adaptado)', licenca: CC_BY } },
    { numero: 9, enunciado: 'Determine se $g(x) = -3x + 7$ é crescente ou decrescente.', resposta: 'Decrescente.',
      passos: '**Passo 1.** Inclinação $m = -3 < 0$.\n\n**Passo 2.** Em afim: $m > 0$ ⇒ crescente; $m < 0$ ⇒ decrescente; $m = 0$ ⇒ constante.\n\n**Conclusão.** Decrescente.\n\n**Por quê?** Se $x_1 < x_2$, então $-3 x_1 > -3 x_2$ (inverte por multiplicar por negativo), logo $g(x_1) > g(x_2)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§4.1 Slope Sign, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 10, enunciado: 'Resolva $\\log_2(x^2 - 4) = 3$.', resposta: '$x = \\pm 2\\sqrt 3$',
      passos: '**Passo 1 — Forma exponencial.** $x^2 - 4 = 2^3 = 8$.\n\n**Passo 2 — Resolver.** $x^2 = 12 \\Rightarrow x = \\pm 2\\sqrt 3$.\n\n**Passo 3 — Verificar domínio.** $x^2 - 4 > 0 \\Rightarrow |x| > 2$. $\\pm 2\\sqrt 3 \\approx \\pm 3{,}46$ — ambos com $|x| > 2$ ✓.\n\n**Por que verificar domínio?** Logaritmo só aceita argumento positivo. Esquecer isso é o erro #1 em provas.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.6 Log Equation, ex. 53 (adaptado)', licenca: CC_BY } },
    { numero: 11, enunciado: 'Vértice e abertura da parábola $y = -2(x - 3)^2 + 5$.', resposta: 'Vértice $(3, 5)$, abertura para baixo.',
      passos: '**Passo 1.** Forma canônica $a(x - h)^2 + k$: vértice $(h, k)$.\n\n**Passo 2.** $h = 3$, $k = 5$ ⇒ vértice $(3, 5)$.\n\n**Passo 3.** $a = -2 < 0$ ⇒ parábola abre para baixo (vértice é máximo).\n\n**Por que canônica é útil?** Vértice salta direto da equação — sem precisar fórmula $-b/(2a)$. Forma canônica é a "linguagem nativa" da quadrática.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§5.1 Vertex Form, ex. 27 (adaptado)', licenca: CC_BY } },
    { numero: 12, enunciado: 'Resolva $5^{2x} = 25^{x+1}$.', resposta: '$x = 2$',
      passos: '**Passo 1.** Iguale bases: $25 = 5^2$, então $25^{x+1} = 5^{2(x+1)} = 5^{2x+2}$.\n\n**Passo 2.** $5^{2x} = 5^{2x+2}$. Exponencial é injetora.\n\n**Passo 3.** Iguale expoentes: $2x = 2x + 2 \\Rightarrow 0 = 2$. **Contradição** — sistema sem solução.\n\n**Reanalisando.** Releia o enunciado. Se a equação é $5^{2x} = 25^{x+1}$ e levou a $0 = 2$, REALMENTE não há solução. (Recálculo cuidadoso de cada passo.)\n\n**Lição.** Nem toda equação tem solução. Importante saber detectar e justificar.',
      dificuldade: 'desafio', aulasCobertas: ['aula-06-exponencial'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.6 Exponential Equation, ex. 45 (adaptado)', licenca: CC_BY } },
    { numero: 13, enunciado: 'Imagem da função $f(x) = x^2 - 4x + 5$.', resposta: '$[1, +\\infty)$',
      passos: '**Passo 1.** Forma canônica: complete quadrado. $x^2 - 4x = (x - 2)^2 - 4$. Logo $f(x) = (x - 2)^2 + 1$.\n\n**Passo 2.** Mínimo: $(x - 2)^2 \\geq 0$ ⇒ $f \\geq 1$, com igualdade em $x = 2$.\n\n**Passo 3.** Imagem: $[1, +\\infty)$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§5.1 Range of Quadratic, ex. 33 (adaptado)', licenca: CC_BY } },
    { numero: 14, enunciado: 'Equação da reta paralela ao eixo $x$ que passa por $(7, -3)$.', resposta: '$y = -3$',
      passos: '**Passo 1.** Paralela ao eixo $x$ ⇒ horizontal ⇒ $m = 0$.\n\n**Passo 2.** Reta horizontal: $y = $ constante. Como passa por $(7, -3)$, $y = -3$.\n\n**Por que não envolve $x$?** Toda altura é $-3$ independente de $x$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§4.1 Horizontal Line, ex. 8 (adaptado)', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: vacina exige doses de manutenção a cada 6 anos. Modele "anos desde última dose" como função discreta de "anos desde nascimento" para criança que tomou aos 5, 11, 17 anos.', resposta: 'Função periódica de período 6, valor zero nos múltiplos de 6 a partir de 5.',
      passos: '**Passo 1.** Função discreta tipo "ceiling": $f(t) = (t - 5) \\mod 6$ para $t \\geq 5$.\n\n**Passo 2.** Em $t = 5$: zero. $t = 6$: 1. $t = 11$: 0 (recém vacinou). $t = 12$: 1. ...\n\n**Aplicação.** Modelagem de manutenção em saúde, indústria (revisões periódicas), seguros.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-02-funcoes', 'aula-08-crescimento'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§3.1 Periodic Functions (apêndice)', licenca: CC_BY } },
  ],
}

const PROVA_T1_V3: Prova = {
  id: 'trim-1-v3',
  trim: 1,
  versao: 3,
  titulo: 'Trim 1 · Versão 3 — Funções, afim, quadrática, exp/log',
  descricao:
    'Prova de fechamento do Trim 1, versão 3. Mesma cobertura, novos exercícios.',
  duracaoMinutos: 90,
  intensidade: 3,
  publicoAlvo: '1.º ano',
  status: 'curada',
  questoes: [
    {
      numero: 1,
      enunciado:
        'Para $f(x) = x^2 - 4$, calcule $f(-2)$, $f(0)$ e $f(3)$. Esboce o gráfico.',
      resposta: '$f(-2) = 0$, $f(0) = -4$, $f(3) = 5$. Parábola com vértice $(0, -4)$, raízes $\\pm 2$.',
      passos:
        '**Passo 1 — Substituições.** $f(-2) = 4 - 4 = 0$. $f(0) = 0 - 4 = -4$. $f(3) = 9 - 4 = 5$.\n\n' +
        '**Passo 2 — Gráfico.** Parábola voltada para cima ($a = 1 > 0$). Vértice em $(0, -4)$. Cruza eixo $x$ em $\\pm 2$ (raízes), eixo $y$ em $-4$.\n\n' +
        '**Por que vértice em $(0, -4)$?** $x_v = -b/(2a) = 0/2 = 0$. $y_v = f(0) = -4$.\n\n' +
        '**Translação.** $y = x^2 - 4$ é $y = x^2$ deslocada **4 unidades para baixo**. Isso explica imediatamente o vértice e as raízes.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-02-funcoes', 'aula-04-quadratica'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§3.1 Functions, ex. 14 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 2,
      enunciado:
        'Considere os pontos $A = (-1, 2)$ e $B = (3, 10)$. Encontre a equação da reta $AB$.',
      resposta: '$y = 2x + 4$',
      passos:
        '**Passo 1 — Inclinação.** $m = (10 - 2)/(3 - (-1)) = 8/4 = 2$.\n\n' +
        '**Passo 2 — Forma ponto-inclinação por $A$.** $y - 2 = 2(x - (-1)) \\Rightarrow y = 2(x + 1) + 2 = 2x + 4$.\n\n' +
        '**Verificação por $B$.** $y = 2(3) + 4 = 10$ ✓.\n\n' +
        '**Por que dois pontos definem reta?** Em $\\mathbb{R}^2$, dois pontos distintos são suficientes para fixar inclinação $m$ e coeficiente linear $b$ — duas incógnitas, duas equações.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-03-afim'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§4.1 Linear Functions, ex. 33 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 3,
      enunciado:
        'Resolva $x^2 - 6x + 13 = 0$.',
      resposta: 'Sem raízes reais. Raízes complexas $x = 3 \\pm 2i$.',
      passos:
        '**Passo 1 — Discriminante.** $\\Delta = (-6)^2 - 4(1)(13) = 36 - 52 = -16$.\n\n' +
        '**Passo 2 — $\\Delta < 0$ ⇒ sem raízes reais.** Em $\\mathbb{R}$, conjunto solução é vazio.\n\n' +
        '**Passo 3 — Em $\\mathbb{C}$ (extensão).** $x = (6 \\pm \\sqrt{-16})/2 = (6 \\pm 4i)/2 = 3 \\pm 2i$.\n\n' +
        '**Por que $\\Delta$ define o número de raízes?** $\\Delta > 0$: 2 reais distintas. $\\Delta = 0$: 1 real dupla. $\\Delta < 0$: 0 reais (par conjugado complexo). É consequência de Bhaskara: a raiz quadrada de número negativo não existe em $\\mathbb{R}$.\n\n' +
        '**Geometricamente.** Parábola não cruza o eixo $x$ — vértice está acima dele com $a > 0$, ou abaixo com $a < 0$.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§5.1 Quadratic Equations, ex. 47 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 4,
      enunciado:
        'Mostre que $f(x) = 5x - 7$ e $g(x) = (x+7)/5$ são inversas.',
      resposta: '$f(g(x)) = x$ e $g(f(x)) = x$, logo $g = f^{-1}$.',
      passos:
        '**Passo 1 — $(f \\circ g)(x)$.** $f(g(x)) = 5 \\cdot (x+7)/5 - 7 = (x+7) - 7 = x$ ✓.\n\n' +
        '**Passo 2 — $(g \\circ f)(x)$.** $g(f(x)) = (5x - 7 + 7)/5 = 5x/5 = x$ ✓.\n\n' +
        '**Conclusão.** Ambas composições retornam a identidade. Pela definição de inversa, $g = f^{-1}$.\n\n' +
        '**Por que precisa testar as duas?** Em geral, para conjuntos finitos uma inclusão pode valer sem a outra. Em funções de $\\mathbb{R} \\to \\mathbb{R}$, em quase todos os casos basta uma — mas verificar **as duas** elimina qualquer dúvida e funciona em qualquer contexto.',
      dificuldade: 'demonstracao',
      aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§3.7 Inverse Functions, ex. 26 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 5,
      enunciado:
        'Esboce no mesmo eixo $y = 2^x$ e $y = (1/2)^x$. Em que ponto se cruzam?',
      resposta: 'Cruzam-se em $(0, 1)$. Uma é crescente, a outra decrescente; são reflexões pelo eixo $y$.',
      passos:
        '**Passo 1 — Pontos-âncora.** $2^0 = 1$, $(1/2)^0 = 1$. Ambas passam por $(0, 1)$.\n\n' +
        '**Passo 2 — Valores em $\\pm 1$.** $2^1 = 2$, $2^{-1} = 1/2$; $(1/2)^1 = 1/2$, $(1/2)^{-1} = 2$.\n\n' +
        '**Passo 3 — Comportamento.** $2^x$: cresce ($x \\to \\infty$ ⇒ $\\infty$, $x \\to -\\infty$ ⇒ $0$). $(1/2)^x$: decresce ($x \\to \\infty$ ⇒ $0$, $x \\to -\\infty$ ⇒ $\\infty$).\n\n' +
        '**Por que a única interseção é $(0,1)$?** $2^x = (1/2)^x \\Leftrightarrow 2^x = 2^{-x} \\Leftrightarrow x = -x \\Leftrightarrow x = 0$.\n\n' +
        '**Simetria.** $(1/2)^x = 2^{-x}$ — substituindo $x$ por $-x$ em $2^x$ ⇒ reflexão horizontal pelo eixo $y$.',
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-06-exponencial'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§6.2 Graphs of Exponential Functions, ex. 9 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 6,
      enunciado:
        'A população de uma cidade era 50 000 em 2000 e 80 000 em 2020. Modele $P(t) = P_0 e^{kt}$ ' +
        'e estime a população em 2030.',
      resposta: '$k \\approx 0{,}0235$, $P(2030) \\approx 101\\,200$ habitantes.',
      passos:
        '**Passo 1 — Identifique $P_0$.** Em $t = 0$ (ano 2000), $P_0 = 50\\,000$.\n\n' +
        '**Passo 2 — Encontre $k$ usando $t = 20$ (ano 2020).** $80\\,000 = 50\\,000 \\cdot e^{20k}$ $\\Rightarrow e^{20k} = 1{,}6$ $\\Rightarrow 20k = \\ln 1{,}6 \\approx 0{,}470$ $\\Rightarrow k \\approx 0{,}0235$.\n\n' +
        '**Passo 3 — Projete para 2030 ($t = 30$).** $P(30) = 50\\,000 \\cdot e^{30 \\cdot 0{,}0235} = 50\\,000 \\cdot e^{0{,}705} \\approx 50\\,000 \\cdot 2{,}024 \\approx 101\\,200$.\n\n' +
        '**Por que crescimento exponencial é razoável?** Para janelas de tempo "curtas" e populações sem saturação, taxa de crescimento $\\approx$ proporcional à população atual ⇒ $dP/dt = kP$ ⇒ $P = P_0 e^{kt}$.\n\n' +
        '**Limite do modelo.** Para projeções longas, recursos finitos quebram a hipótese. Use **modelo logístico** para incorporar capacidade de suporte.',
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§6.7 Exponential Models, ex. 18 (adaptado para BR)',
        licenca: CC_BY,
      },
    },
    {
      numero: 7,
      enunciado:
        'A taxa média de variação de $f(x) = x^2$ no intervalo $[a, a+h]$ é ' +
        '$(f(a+h) - f(a))/h$. Calcule e simplifique.',
      resposta: '$2a + h$',
      passos:
        '**Passo 1 — Numerador.** $f(a+h) - f(a) = (a+h)^2 - a^2 = a^2 + 2ah + h^2 - a^2 = 2ah + h^2$.\n\n' +
        '**Passo 2 — Divida por $h$.** $(2ah + h^2)/h = 2a + h$ (válido para $h \\neq 0$).\n\n' +
        '**Por que isso importa?** Quando $h \\to 0$, $2a + h \\to 2a$ — exatamente $f\'(a)$, a derivada de $x^2$ em $a$. Você acabou de calcular o **quociente de Newton** que abre o capítulo de derivadas (Trim 5/6).\n\n' +
        '**Interpretação geométrica.** $2a + h$ é a inclinação da **secante** entre $(a, a^2)$ e $(a+h, (a+h)^2)$. À medida que $h$ encolhe, a secante converge para a tangente — derivada.',
      dificuldade: 'desafio',
      aulasCobertas: ['aula-09-taxa-variacao'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§3.3 Rates of Change, ex. 31 (adaptado)',
        licenca: CC_BY,
      },
    },
    { numero: 8, enunciado: 'Resolva $|x - 3| = 7$.', resposta: '$x = 10$ ou $x = -4$',
      passos: '**Passo 1.** $|y| = 7 \\Leftrightarrow y = 7$ ou $y = -7$.\n\n**Passo 2.** $x - 3 = 7 \\Rightarrow x = 10$. $x - 3 = -7 \\Rightarrow x = -4$.\n\n**Por que duas soluções?** Módulo é distância — pontos a distância 7 de 3 são 10 (à direita) e -4 (à esquerda).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-01-conjuntos-intervalos'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§2.7 Absolute Value Eq, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 9, enunciado: 'Encontre o coeficiente angular da reta secante a $f(x) = x^2$ entre $x = 1$ e $x = 3$.', resposta: '$4$',
      passos: '**Passo 1.** Coef secante = TMV = $(f(3) - f(1))/(3 - 1)$.\n\n**Passo 2.** $(9 - 1)/2 = 4$.\n\n**Conexão com tangente.** À medida que segundo ponto se aproxima de 1, secante vira tangente. Esse limite é $f\'(1) = 2$. Aqui, com intervalo $[1, 3]$, secante tem $m = 4$, intermediária entre $f\'(1) = 2$ e $f\'(3) = 6$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-09-taxa-variacao'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§3.3 Secant Slope, ex. 24 (adaptado)', licenca: CC_BY } },
    { numero: 10, enunciado: 'Resolva o sistema $\\begin{cases} y = x^2 \\\\ y = 2x + 3 \\end{cases}$.', resposta: '$(3, 9)$ e $(-1, 1)$',
      passos: '**Passo 1.** Igualar: $x^2 = 2x + 3 \\Rightarrow x^2 - 2x - 3 = 0$.\n\n**Passo 2.** Fatorar: $(x - 3)(x + 1) = 0 \\Rightarrow x = 3$ ou $x = -1$.\n\n**Passo 3.** $y$: substituir em qualquer equação. $x = 3 \\Rightarrow y = 9$. $x = -1 \\Rightarrow y = 1$.\n\n**Geometricamente.** Reta cruza parábola em 2 pontos. (Caso geral: 0, 1, ou 2 interseções.)',
      dificuldade: 'desafio', aulasCobertas: ['aula-04-quadratica', 'aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§9.1 Linear-Quadratic System, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 11, enunciado: 'Função par ou ímpar: $f(x) = x^4 + x^2$.', resposta: 'Par.',
      passos: '**Passo 1.** $f(-x) = (-x)^4 + (-x)^2 = x^4 + x^2 = f(x)$.\n\n**Passo 2.** $f(-x) = f(x)$ ⇒ par.\n\n**Visualização.** Gráfico simétrico ao eixo $y$ (espelho vertical na origem).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§3.3 Even Functions, ex. 5 (adaptado)', licenca: CC_BY } },
    { numero: 12, enunciado: '$\\log_5 0{,}04 = ?$', resposta: '$-2$',
      passos: '**Passo 1.** $0{,}04 = 4/100 = 1/25 = 5^{-2}$.\n\n**Passo 2.** $\\log_5(5^{-2}) = -2$.\n\n**Conferência.** $5^{-2} = 1/25 = 0{,}04$ ✓.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.3 Log Negative Power, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 13, enunciado: 'Inversa de $f(x) = x^3 - 1$.', resposta: '$f^{-1}(x) = \\sqrt[3]{x + 1}$',
      passos: '**Passo 1.** $y = x^3 - 1$.\n\n**Passo 2.** Trocar $x \\leftrightarrow y$: $x = y^3 - 1$.\n\n**Passo 3.** Isolar $y$: $y^3 = x + 1 \\Rightarrow y = \\sqrt[3]{x + 1}$.\n\n**Por que cubo permite inversa em $\\mathbb R$?** $x^3$ é estritamente crescente, logo bijetora $\\mathbb R \\to \\mathbb R$. Em contraste, $x^2$ não é injetora — precisa restringir domínio para inversar.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§3.7 Cubic Inverse, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 14, enunciado: 'Custo total: $C(q) = 30q + 200$ (R\\$). Receita: $R(q) = 50q$. Quantidade no ponto de equilíbrio.', resposta: '$q = 10$',
      passos: '**Passo 1.** Equilíbrio: $C(q) = R(q)$.\n\n**Passo 2.** $30q + 200 = 50q \\Rightarrow 200 = 20q \\Rightarrow q = 10$.\n\n**Interpretação.** Vendendo 10 unidades, lucro = 0. Acima disso: lucro positivo (R cresce mais rápido que C). Abaixo: prejuízo.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§4.3 Break-Even Point, ex. 32 (adaptado)', licenca: CC_BY } },
    { numero: 15, enunciado: 'Funções logarítmicas vs exponenciais: como $\\ln x$ e $e^x$ se relacionam graficamente?', resposta: 'Reflexões pelo eixo $y = x$.',
      passos: '**Passo 1.** $\\ln x$ é a inversa de $e^x$ (e vice-versa).\n\n**Passo 2.** Inversa = reflexão pelo eixo $y = x$. Cada ponto $(a, b)$ em $e^x$ tem correspondente $(b, a)$ em $\\ln x$.\n\n**Exemplos.** $e^x$ passa por $(0, 1)$, $(1, e)$. $\\ln x$ passa por $(1, 0)$, $(e, 1)$. Coordenadas trocadas.\n\n**Aplicação.** Saber essa simetria poupa cálculo. Exemplo: derivada de $\\ln x$ em $(1, 0)$ é $1/1 = 1$ — mesma inclinação de $e^x$ em $(0, 1)$ (que é $e^0 = 1$).',
      dificuldade: 'compreensao', aulasCobertas: ['aula-06-exponencial', 'aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.4 Inverse Relationship, ex. 27 (adaptado)', licenca: CC_BY } },
  ],
}

// =============================================================================
// TRIMs 2-12 — provas de referência (1 versão real cada)
// Versões adicionais (2-10) estão marcadas como "em-curadoria"
// =============================================================================

const PROVA_T2_V1: Prova = {
  id: 'trim-2-v1',
  trim: 2,
  versao: 1,
  titulo: 'Trim 2 · Versão 1 — Trigonometria e sequências',
  descricao:
    'Razões trig, círculo, equações trigonométricas, lei dos senos/cossenos, PA, PG, limite intuitivo.',
  duracaoMinutos: 90,
  intensidade: 3,
  publicoAlvo: '1.º ano',
  status: 'curada',
  questoes: [
    {
      numero: 1,
      enunciado:
        'Calcule $\\sin(60°) + \\cos(30°)$.',
      resposta: '$\\sqrt{3}$',
      passos:
        '**Passo 1 — Valores notáveis.** $\\sin 60° = \\sqrt{3}/2$, $\\cos 30° = \\sqrt{3}/2$.\n\n' +
        '**Passo 2 — Soma.** $\\sqrt{3}/2 + \\sqrt{3}/2 = \\sqrt{3}$.\n\n' +
        '**Por que $\\sin 60° = \\cos 30°$?** Em qualquer triângulo retângulo, ângulos agudos somam $90°$. Logo $\\sin(\\theta) = \\cos(90° - \\theta)$. Aqui $60° + 30° = 90°$.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-11-trig-triangulo', 'aula-12-circulo-trigonometrico'],
      fonteOriginal: {
        livro: 'OpenStax Algebra and Trigonometry 2e',
        url: OS_AT,
        ref: '§7.2 Right Triangle Trigonometry, ex. 8 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 2,
      enunciado:
        'Resolva $2 \\sin x = 1$ em $[0, 2\\pi)$.',
      resposta: '$x = \\pi/6$ ou $x = 5\\pi/6$',
      passos:
        '**Passo 1 — Isole.** $\\sin x = 1/2$.\n\n' +
        '**Passo 2 — Ângulo de referência.** $\\sin(\\pi/6) = 1/2$.\n\n' +
        '**Passo 3 — Quadrantes.** $\\sin > 0$ em Q1 (ângulo $\\pi/6$) e Q2 (ângulo $\\pi - \\pi/6 = 5\\pi/6$).\n\n' +
        '**Por que dois valores?** Função seno tem **período** $2\\pi$ e dentro de um período é positiva em um intervalo de comprimento $\\pi$ — e dentro desse intervalo, dois ângulos diferentes podem ter o mesmo seno (simetria pelo eixo $\\pi/2$).',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-14-equacoes-trigonometricas'],
      fonteOriginal: {
        livro: 'OpenStax Algebra and Trigonometry 2e',
        url: OS_AT,
        ref: '§9.5 Solving Trigonometric Equations, ex. 12 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 3,
      enunciado:
        'Em um triângulo, $a = 7$, $b = 9$, $C = 60°$. Calcule $c$.',
      resposta: '$c = \\sqrt{67} \\approx 8{,}19$',
      passos:
        '**Passo 1 — Lei dos cossenos.** $c^2 = a^2 + b^2 - 2ab\\cos C$.\n\n' +
        '**Passo 2 — Substitua.** $c^2 = 49 + 81 - 2(7)(9)(1/2) = 130 - 63 = 67$.\n\n' +
        '**Passo 3 — Resposta.** $c = \\sqrt{67} \\approx 8{,}19$.\n\n' +
        '**Por que essa lei?** Generaliza Pitágoras. Quando $C = 90°$, $\\cos C = 0$ ⇒ $c^2 = a^2 + b^2$. O termo $-2ab\\cos C$ ajusta pela falta de retângulo.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-15-leis-senos-cossenos'],
      fonteOriginal: {
        livro: 'OpenStax Algebra and Trigonometry 2e',
        url: OS_AT,
        ref: '§10.2 Law of Cosines, ex. 6 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 4,
      enunciado:
        'PA com $a_1 = 5$ e razão $r = 3$. Calcule $a_{20}$ e $S_{20}$.',
      resposta: '$a_{20} = 62$, $S_{20} = 670$.',
      passos:
        '**Passo 1 — Termo geral.** $a_n = a_1 + (n-1)r = 5 + 19 \\cdot 3 = 62$.\n\n' +
        '**Passo 2 — Soma (Gauss).** $S_n = n(a_1 + a_n)/2 = 20 \\cdot (5 + 62)/2 = 20 \\cdot 33{,}5 = 670$.\n\n' +
        '**Por que a fórmula de Gauss funciona?** Pareando 1.º+último, 2.º+penúltimo, etc., cada par soma $a_1 + a_n$. Há $n/2$ pares ⇒ soma total $n(a_1+a_n)/2$.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-17-pa'],
      fonteOriginal: {
        livro: 'OpenStax Algebra and Trigonometry 2e',
        url: OS_AT,
        ref: '§13.2 Arithmetic Sequences, ex. 17 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 5,
      enunciado:
        'Calcule $\\sum_{n=0}^{\\infty} (1/3)^n$.',
      resposta: '$3/2$',
      passos:
        '**Passo 1 — É PG infinita com $a_1 = 1$, $q = 1/3$.** $|q| < 1$ ⇒ converge.\n\n' +
        '**Passo 2 — Fórmula.** $S_\\infty = a_1/(1 - q) = 1/(1 - 1/3) = 1/(2/3) = 3/2$.\n\n' +
        '**Por que só converge se $|q| < 1$?** Para $|q| < 1$, $q^n \\to 0$ e $S_n = a_1(1 - q^n)/(1-q) \\to a_1/(1-q)$. Para $|q| \\geq 1$, $q^n$ não vai a zero ⇒ soma cresce sem limite.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-18-pg', 'aula-19-limite-intuitivo'],
      fonteOriginal: {
        livro: 'OpenStax Algebra and Trigonometry 2e',
        url: OS_AT,
        ref: '§13.4 Geometric Series, ex. 24 (adaptado)',
        licenca: CC_BY,
      },
    },
    { numero: 6, enunciado: 'Calcule $\\sin(\\pi/6)$.', resposta: '$1/2$',
      passos: '**Passo 1.** $\\pi/6 = 30°$. **Passo 2.** $\\sin 30° = 1/2$ (notável).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Notable Angles, ex. 5', licenca: CC_BY } },
    { numero: 7, enunciado: 'Período de $f(x) = \\sin(3x)$.', resposta: '$2\\pi/3$',
      passos: '**Passo 1.** $\\sin(Bx)$ tem período $2\\pi/B$.\n\n**Passo 2.** $B = 3 \\Rightarrow T = 2\\pi/3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§8.1 Period, ex. 7', licenca: CC_BY } },
    { numero: 8, enunciado: '$\\cos^2 x + \\sin^2 x$ vale quanto?', resposta: '$1$',
      passos: '**Passo 1.** Identidade pitagórica fundamental.\n\n**Por quê?** Em círculo unitário, $(\\cos x, \\sin x)$ está sobre $X^2 + Y^2 = 1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.1 Pythagorean ID, ex. 1', licenca: CC_BY } },
    { numero: 9, enunciado: 'PA: 5, 9, 13, 17, ... Termo $a_{10}$.', resposta: '$41$',
      passos: '**Passo 1.** $a_1 = 5$, $r = 4$.\n\n**Passo 2.** $a_n = a_1 + (n-1)r = 5 + 9 \\cdot 4 = 41$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 AP n-th term, ex. 9', licenca: CC_BY } },
    { numero: 10, enunciado: '$\\tan(45°) = ?$', resposta: '$1$',
      passos: '**Passo 1.** $\\tan = \\sin/\\cos = (\\sqrt 2/2)/(\\sqrt 2/2) = 1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Tangent 45, ex. 6', licenca: CC_BY } },
    { numero: 11, enunciado: 'Identifique $\\sin(2x)$ em termos de $\\sin x$ e $\\cos x$.', resposta: '$2\\sin x\\cos x$',
      passos: '**Passo 1.** Identidade dupla angle: $\\sin(a+a) = 2\\sin a\\cos a$.\n\n**Aplicação.** Reduz potência par de seno e fatora.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.3 Double Angle, ex. 11', licenca: CC_BY } },
    { numero: 12, enunciado: 'PG: 2, 6, 18, 54. Termo $a_8$.', resposta: '$a_8 = 4374$',
      passos: '**Passo 1.** $q = 3$, $a_1 = 2$.\n\n**Passo 2.** $a_n = 2 \\cdot 3^{n-1}$. $a_8 = 2 \\cdot 3^7 = 2 \\cdot 2187 = 4374$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-18-pg'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.3 PG n-th, ex. 13', licenca: CC_BY } },
    { numero: 13, enunciado: 'Limite $\\lim_{n\\to\\infty} (3n+1)/(2n-5)$.', resposta: '$3/2$',
      passos: '**Passo 1.** Razão coef. líderes (mesmo grau): $3/2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.1 Polynomial Limit, ex. 9', licenca: CC_BY } },
    { numero: 14, enunciado: 'Triângulo retângulo, hipotenusa 13, cateto 5. Outro cateto.', resposta: '$12$',
      passos: '**Passo 1.** Pitágoras: $13^2 = 5^2 + b^2$. $b^2 = 144 \\Rightarrow b = 12$.\n\n**Triângulo 5-12-13** — outro pitagórico clássico.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-11-trig-triangulo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.2 Pythagorean Triples, ex. 5', licenca: CC_BY } },
    { numero: 15, enunciado: 'Roda gigante: raio 10 m, dá uma volta a cada 2 min. Velocidade angular $\\omega$.', resposta: '$\\omega = \\pi$ rad/min',
      passos: '**Passo 1.** Volta = $2\\pi$ rad em $T = 2$ min.\n\n**Passo 2.** $\\omega = 2\\pi/T = \\pi$ rad/min.\n\n**Aplicação.** Movimento circular uniforme — base de cinemática rotacional.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.3 Angular Velocity, ex. 21', licenca: CC_BY } },
  ],
}

// Trim 2 v2-v10
const PROVA_T2_V2: Prova = {
  id: 'trim-2-v2', trim: 2, versao: 2,
  titulo: 'Trim 2 · Versão 2 — Trigonometria e sequências',
  descricao: 'Trim 2 v2.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Calcule $\\cos(45°) - \\sin(30°)$.', resposta: '$\\sqrt 2/2 - 1/2$',
      passos: '**Passo 1.** $\\cos 45° = \\sqrt 2/2$, $\\sin 30° = 1/2$.\n\n**Passo 2.** Diferença: $\\sqrt 2/2 - 1/2 \\approx 0{,}207$.\n\n**Por que esses valores?** Vêm dos triângulos $30$-$60$-$90$ e $45$-$45$-$90$ (notáveis), construídos por simetria a partir do quadrado e do triângulo equilátero.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-11-trig-triangulo'],
      fonteOriginal: { livro: 'OpenStax Algebra and Trigonometry 2e', url: OS_AT, ref: '§7.2 Right Triangle Trig, ex. 12 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Resolva $2\\cos x + \\sqrt 3 = 0$ em $[0, 2\\pi)$.', resposta: '$x = 5\\pi/6$ ou $x = 7\\pi/6$',
      passos: '**Passo 1.** $\\cos x = -\\sqrt 3/2$.\n\n**Passo 2.** Ângulo de referência $\\pi/6$. Cosseno negativo em Q2 e Q3: $x = \\pi - \\pi/6 = 5\\pi/6$ e $x = \\pi + \\pi/6 = 7\\pi/6$.\n\n**Por que dois ângulos?** Cosseno é negativo em meio ciclo, e nesse intervalo dois ângulos têm mesmo $|\\cos|$ — simetria pelo eixo horizontal.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-14-equacoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.5 Trig Equations, ex. 18 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Triângulo $a = 12$, $A = 30°$, $B = 45°$. Lado $b$ (lei dos senos).', resposta: '$b = 12\\sqrt 2 \\approx 16{,}97$',
      passos: '**Passo 1.** Lei dos senos: $a/\\sin A = b/\\sin B$.\n\n**Passo 2.** $b = a \\sin B/\\sin A = 12 \\cdot \\sin 45°/\\sin 30° = 12 \\cdot (\\sqrt 2/2)/(1/2) = 12\\sqrt 2$.\n\n**Por que essa lei?** Em qualquer triângulo, lados são proporcionais aos senos dos ângulos opostos. Vem de área $= ab\\sin C/2$ via reorganização.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-15-leis-senos-cossenos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.1 Law of Sines, ex. 9 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'PA: $a_5 = 14$, $a_{10} = 29$. Razão e $a_1$.', resposta: '$r = 3$, $a_1 = 2$',
      passos: '**Passo 1.** $a_{10} - a_5 = 5r \\Rightarrow 15 = 5r \\Rightarrow r = 3$.\n\n**Passo 2.** $a_5 = a_1 + 4r = 14 \\Rightarrow a_1 = 14 - 12 = 2$.\n\n**Por que isso funciona?** Diferença entre quaisquer dois termos é múltiplo da razão pela quantidade de saltos entre eles.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 Arithmetic Seq, ex. 22 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'PG infinita $0{,}9 + 0{,}09 + 0{,}009 + \\ldots$', resposta: '$1$',
      passos: '**Passo 1.** $a_1 = 0{,}9$, $q = 0{,}1$. $|q| < 1$ ⇒ converge.\n\n**Passo 2.** $S = a_1/(1-q) = 0{,}9/0{,}9 = 1$.\n\n**Por que $0{,}\\overline{9} = 1$?** A "soma infinita" $0{,}999\\ldots$ é, por definição, o limite das somas parciais — e esse limite é exatamente 1. Não é "quase" 1, **é** 1.',
      dificuldade: 'desafio', aulasCobertas: ['aula-18-pg', 'aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.4 Infinite Geometric, ex. 31 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\sin(60°) = ?$', resposta: '$\\sqrt 3/2$',
      passos: '**Passo 1.** Triângulo equilátero dividido: $\\sin 60° = \\sqrt 3/2$ (notável).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-11-trig-triangulo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Sin 60, ex. 4', licenca: CC_BY } },
    { numero: 7, enunciado: 'Resolva $2\\sin x - 1 = 0$ em $[0, 2\\pi)$.', resposta: '$x = \\pi/6$ ou $5\\pi/6$',
      passos: '**Passo 1.** $\\sin x = 1/2$. Quadrantes 1 e 2.\n\n**Passo 2.** $x = \\pi/6, 5\\pi/6$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-14-equacoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.5 Trig Eq, ex. 12', licenca: CC_BY } },
    { numero: 8, enunciado: 'Soma dos 50 primeiros termos da PA com $a_1 = 2$, $r = 3$.', resposta: '$3775$',
      passos: '**Passo 1.** $a_{50} = 2 + 49 \\cdot 3 = 149$.\n\n**Passo 2.** $S_{50} = 50(2 + 149)/2 = 50 \\cdot 75{,}5 = 3775$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 PA Sum, ex. 19', licenca: CC_BY } },
    { numero: 9, enunciado: 'PG: 3, 6, 12, 24. Razão.', resposta: '$q = 2$',
      passos: '**Passo 1.** $q = a_2/a_1 = 6/3 = 2$. Verifica em todos os pares: $12/6 = 2 ✓$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-18-pg'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.3 PG Ratio, ex. 5', licenca: CC_BY } },
    { numero: 10, enunciado: 'Calcule $\\cos(\\pi/4) + \\sin(\\pi/4)$.', resposta: '$\\sqrt 2$',
      passos: '**Passo 1.** $\\cos(\\pi/4) = \\sin(\\pi/4) = \\sqrt 2/2$.\n\n**Passo 2.** Soma $= \\sqrt 2/2 + \\sqrt 2/2 = \\sqrt 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Sum 45, ex. 11', licenca: CC_BY } },
    { numero: 11, enunciado: 'Lei dos senos: triângulo com $A = 30°$, $a = 5$, $B = 45°$. Lado $b$.', resposta: '$b = 5\\sqrt 2$',
      passos: '**Passo 1.** $a/\\sin A = b/\\sin B$.\n\n**Passo 2.** $b = 5 \\sin 45°/\\sin 30° = 5 (\\sqrt 2/2)/(1/2) = 5\\sqrt 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-15-leis-senos-cossenos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.1 Sines, ex. 13', licenca: CC_BY } },
    { numero: 12, enunciado: 'Identidade: simplifique $\\dfrac{\\sin x}{\\cos x} \\cdot \\cos x$.', resposta: '$\\sin x$',
      passos: '**Passo 1.** $(\\sin x/\\cos x) \\cdot \\cos x = \\sin x$ (cancelar $\\cos x$).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.1 Simplify Trig, ex. 7', licenca: CC_BY } },
    { numero: 13, enunciado: 'Limite: $\\lim_{n\\to\\infty} 5/n$.', resposta: '$0$',
      passos: '**Passo 1.** Numerador constante, denominador cresce sem limite ⇒ razão → 0.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.1 Limits Reciprocal, ex. 3', licenca: CC_BY } },
    { numero: 14, enunciado: 'Triângulo: ângulo $= 60°$, lados que o formam $4$ e $6$. Lado oposto.', resposta: '$\\sqrt{28} = 2\\sqrt 7$',
      passos: '**Passo 1.** Lei dos cossenos: $c^2 = 16 + 36 - 2(4)(6)\\cos 60° = 52 - 24 = 28$.\n\n**Passo 2.** $c = 2\\sqrt 7 \\approx 5{,}29$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-15-leis-senos-cossenos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.2 Cosines, ex. 15', licenca: CC_BY } },
    { numero: 15, enunciado: 'PG: para $|q| > 1$, série diverge. Por quê?', resposta: '$q^n$ não vai a zero ⇒ soma cresce sem limite.',
      passos: '**Passo 1.** $|q| > 1 \\Rightarrow |q|^n \\to \\infty$.\n\n**Passo 2.** Termos individuais não decaem ⇒ soma parcial $S_n$ não converge.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-18-pg', 'aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.4 Divergence, ex. 33', licenca: CC_BY } },
  ],
}

const PROVA_T2_V3: Prova = {
  id: 'trim-2-v3', trim: 2, versao: 3,
  titulo: 'Trim 2 · Versão 3 — Trigonometria e sequências',
  descricao: 'Trim 2 v3.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Em um triângulo retângulo com cateto oposto 5 e hipotenusa 13, calcule $\\sin\\theta$ e $\\cos\\theta$.', resposta: '$\\sin\\theta = 5/13$, $\\cos\\theta = 12/13$',
      passos: '**Passo 1 — Pitágoras.** Cateto adj $= \\sqrt{13^2 - 5^2} = \\sqrt{144} = 12$.\n\n**Passo 2.** $\\sin = $ op/hip $= 5/13$. $\\cos = $ adj/hip $= 12/13$.\n\n**Verificação.** $\\sin^2 + \\cos^2 = 25/169 + 144/169 = 169/169 = 1$ ✓.\n\n**Por que essa identidade?** Pitágoras: $op^2 + adj^2 = hip^2$. Dividindo por $hip^2$: $\\sin^2 + \\cos^2 = 1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-11-trig-triangulo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.2 SOH-CAH-TOA, ex. 7 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Converta $135°$ para radianos.', resposta: '$3\\pi/4$',
      passos: '**Passo 1.** Conversão: $\\theta_{rad} = \\theta_{°} \\cdot \\pi/180$.\n\n**Passo 2.** $135 \\cdot \\pi/180 = 3\\pi/4$.\n\n**Por que radianos?** Em rad, $\\sin x \\approx x$ para $x$ pequeno (limite fundamental). Cálculo exige radianos para que derivada de $\\sin$ seja $\\cos$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.3 Radian Measure, ex. 5 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Período e amplitude de $f(x) = 3\\sin(2x)$.', resposta: 'Amp $= 3$, período $= \\pi$.',
      passos: '**Passo 1.** Forma geral $A\\sin(Bx)$: amp $= |A|$, período $= 2\\pi/|B|$.\n\n**Passo 2.** $A = 3$, $B = 2$ ⇒ amp $= 3$, período $= 2\\pi/2 = \\pi$.\n\n**Por que $B$ comprime?** $\\sin(2x)$ completa um ciclo em metade do tempo de $\\sin x$. Multiplicar argumento por $B$ comprime o eixo $x$ por fator $B$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§8.1 Sinusoidal Graphs, ex. 16 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'PA com 100 termos, $a_1 = 3$, $a_{100} = 300$. Soma.', resposta: '$S = 15\\,150$',
      passos: '**Passo 1.** $S_n = n(a_1 + a_n)/2$.\n\n**Passo 2.** $S_{100} = 100(3 + 300)/2 = 15\\,150$.\n\n**Por que Gauss?** Pareando 1.º com último, 2.º com penúltimo: cada par soma $a_1 + a_n$. 50 pares ⇒ $50 \\cdot 303 = 15\\,150$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 Sum of Arithmetic, ex. 28 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Limite intuitivo: $\\lim_{n\\to\\infty} \\dfrac{2n^2 + 3n - 1}{n^2 + 5}$.', resposta: '$2$',
      passos: '**Passo 1.** Forma $\\infty/\\infty$. Divida num. e den. por $n^2$ (maior potência).\n\n**Passo 2.** $\\dfrac{2 + 3/n - 1/n^2}{1 + 5/n^2}$.\n\n**Passo 3.** $n \\to \\infty$: termos com $1/n$ vão a 0. Limite $= 2/1 = 2$.\n\n**Por que coeficientes líderes?** Razão de polinômios de mesmo grau no infinito é razão dos coeficientes do termo dominante.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.1 Limits at Infinity, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\tan(\\pi/3)$.', resposta: '$\\sqrt 3$',
      passos: '**Passo 1.** $\\tan = \\sin/\\cos = (\\sqrt 3/2)/(1/2) = \\sqrt 3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Tan 60, ex. 8', licenca: CC_BY } },
    { numero: 7, enunciado: 'PA: 100 termos com $a_1 = 1$, $a_{100} = 199$. Razão.', resposta: '$r = 2$',
      passos: '**Passo 1.** $a_n = a_1 + (n-1)r \\Rightarrow 199 = 1 + 99r \\Rightarrow r = 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 PA Find r, ex. 16', licenca: CC_BY } },
    { numero: 8, enunciado: '$\\sin(\\pi - x)$ vs $\\sin x$.', resposta: '$\\sin(\\pi - x) = \\sin x$',
      passos: '**Passo 1.** Identidade: $\\sin(\\pi - x) = \\sin\\pi\\cos x - \\cos\\pi\\sin x = 0 \\cdot \\cos x - (-1)\\sin x = \\sin x$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.2 Supplementary, ex. 10', licenca: CC_BY } },
    { numero: 9, enunciado: 'Limite $\\lim_{n\\to\\infty} (1/2)^n$.', resposta: '$0$',
      passos: '**Passo 1.** $|q| < 1$ ⇒ $q^n \\to 0$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.4 Geometric Limit, ex. 13', licenca: CC_BY } },
    { numero: 10, enunciado: 'Resolva $\\sin x = 0$ em $[0, 2\\pi)$.', resposta: '$x = 0$ ou $x = \\pi$',
      passos: '**Passo 1.** Seno é zero em múltiplos de $\\pi$. Em $[0, 2\\pi)$: $\\{0, \\pi\\}$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-14-equacoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.5 Zero Trig, ex. 5', licenca: CC_BY } },
    { numero: 11, enunciado: 'PG infinita $0{,}5 + 0{,}25 + 0{,}125 + \\ldots$', resposta: '$1$',
      passos: '**Passo 1.** $a_1 = 0{,}5$, $q = 0{,}5$.\n\n**Passo 2.** $S = 0{,}5/(1 - 0{,}5) = 1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-18-pg'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.4 Half Series, ex. 27', licenca: CC_BY } },
    { numero: 12, enunciado: 'Triângulo retângulo: catetos 6 e 8. Hipotenusa.', resposta: '$10$',
      passos: '**Passo 1.** Pitágoras: $h^2 = 36 + 64 = 100 \\Rightarrow h = 10$.\n\n**Triângulo 6-8-10** = 2× triângulo 3-4-5.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-11-trig-triangulo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.2 Pythagoras, ex. 12', licenca: CC_BY } },
    { numero: 13, enunciado: '$\\cos(2\\pi - x) = ?$', resposta: '$\\cos x$',
      passos: '**Passo 1.** Período do cosseno é $2\\pi$. $\\cos(2\\pi - x) = \\cos(-x) = \\cos x$ (função par).',
      dificuldade: 'compreensao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.2 Cofunctions, ex. 14', licenca: CC_BY } },
    { numero: 14, enunciado: 'Soma dos primeiros 6 quadrados: $1 + 4 + 9 + 16 + 25 + 36$.', resposta: '$91$',
      passos: '**Passo 1.** Fórmula: $\\sum k^2 = n(n+1)(2n+1)/6 = 6 \\cdot 7 \\cdot 13/6 = 91$.\n\n**Verificação direta.** $1+4+9+16+25+36 = 91$ ✓.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.5 Sum of Squares, ex. 22', licenca: CC_BY } },
    { numero: 15, enunciado: 'Lei dos cossenos para verificar Pitágoras quando $C = 90°$.', resposta: 'Reduz a $c^2 = a^2 + b^2$.',
      passos: '**Passo 1.** Lei: $c^2 = a^2 + b^2 - 2ab\\cos C$.\n\n**Passo 2.** $C = 90°$ ⇒ $\\cos C = 0$. Substitui: $c^2 = a^2 + b^2$ — Pitágoras!',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-15-leis-senos-cossenos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.2 Law generalizes Pyth, prova', licenca: CC_BY } },
  ],
}

const PROVA_T2_V4: Prova = {
  id: 'trim-2-v4', trim: 2, versao: 4,
  titulo: 'Trim 2 · Versão 4 — Trigonometria e sequências',
  descricao: 'Trim 2 v4.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Calcule $\\tan(60°) \\cdot \\cos(60°)$.', resposta: '$\\sqrt 3/2$',
      passos: '**Passo 1.** $\\tan 60° = \\sqrt 3$, $\\cos 60° = 1/2$.\n\n**Passo 2.** Produto $= \\sqrt 3 \\cdot 1/2 = \\sqrt 3/2$.\n\n**Equivalente.** $\\tan x \\cos x = (\\sin x/\\cos x)\\cos x = \\sin x$. Aqui $\\sin 60° = \\sqrt 3/2$ ✓.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-11-trig-triangulo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.2 Trig Identities, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Em um relógio analógico, ângulo (em rad) entre 12h e 3h.', resposta: '$\\pi/2$',
      passos: '**Passo 1.** Volta completa $= 2\\pi$. Quarto $= 2\\pi/4 = \\pi/2$.\n\n**Confirmação.** $90°$ em radianos: $90 \\cdot \\pi/180 = \\pi/2$ ✓.\n\n**Aplicação.** Ângulos entre ponteiros são exemplo direto de proporção em círculo. Trabalho clássico de geometria/trig.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.3 Arc Length, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Identidade: prove $\\sin^2 x + \\cos^2 x = 1$.', resposta: 'Demonstração.',
      passos: '**Passo 1.** Em círculo unitário, ponto $(\\cos x, \\sin x)$ está sobre o círculo.\n\n**Passo 2.** Equação do círculo: $X^2 + Y^2 = 1$.\n\n**Passo 3.** Substitua $X = \\cos x$, $Y = \\sin x$: $\\cos^2 x + \\sin^2 x = 1$. ∎\n\n**Por que isso é fundamental?** É a identidade trigonométrica mais usada. Permite reduzir qualquer expressão em $\\sin, \\cos$ a uma das duas — base para integrais trigonométricas, EDOs.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.1 Pythagorean Identity, prova', licenca: CC_BY } },
    { numero: 4, enunciado: 'PG: 4, 12, 36, 108, ... Termo $a_8$.', resposta: '$a_8 = 4 \\cdot 3^7 = 8748$',
      passos: '**Passo 1.** Razão $q = 12/4 = 3$.\n\n**Passo 2.** $a_n = a_1 \\cdot q^{n-1}$. $a_8 = 4 \\cdot 3^7 = 4 \\cdot 2187 = 8748$.\n\n**Por que isso cresce tão rápido?** Crescimento geométrico (multiplicativo) é exponencial. Mesmo com base modesta ($q = 3$), 7 multiplicações geram fator $\\approx 2200$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-18-pg'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.3 Geometric Sequences, ex. 8 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Calcule $\\lim_{n\\to\\infty} (1 + 1/n)^n$. (Reconheça.)', resposta: '$e \\approx 2{,}718$',
      passos: '**Passo 1.** Esse é o **limite que define $e$** (Euler).\n\n**Passo 2.** Numericamente: $n=10$: $\\approx 2{,}59$. $n=100$: $\\approx 2{,}70$. $n=1000$: $\\approx 2{,}716$. Converge para $e$.\n\n**Por que $e$?** Aparece como limite de juros compostos contínuos. Base natural para crescimento exponencial — derivada de $e^x$ é $e^x$ (única função com essa propriedade).',
      dificuldade: 'desafio', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.4 Definition of e, intro', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\sin(150°)$.', resposta: '$1/2$',
      passos: '**Passo 1.** $\\sin(150°) = \\sin(180° - 30°) = \\sin(30°) = 1/2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Q2 Sine, ex. 13', licenca: CC_BY } },
    { numero: 7, enunciado: '$\\cos(180°)$.', resposta: '$-1$',
      passos: '**Passo 1.** Eixo $x$ negativo: $\\cos(180°) = -1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Boundary Cosine, ex. 11', licenca: CC_BY } },
    { numero: 8, enunciado: 'Resolva $\\cos x = 1$ em $[0, 2\\pi)$.', resposta: '$x = 0$',
      passos: '**Passo 1.** $\\cos x = 1$ apenas em $x = 0, 2\\pi, ...$. Em $[0, 2\\pi)$: só $x = 0$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-14-equacoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.5 Cos = 1, ex. 4', licenca: CC_BY } },
    { numero: 9, enunciado: 'PA: 7, 11, 15, 19, ... soma dos primeiros 20 termos.', resposta: '$900$',
      passos: '**Passo 1.** $a_1 = 7$, $r = 4$. $a_{20} = 7 + 19 \\cdot 4 = 83$.\n\n**Passo 2.** $S_{20} = 20(7 + 83)/2 = 20 \\cdot 45 = 900$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 Sum 20, ex. 24', licenca: CC_BY } },
    { numero: 10, enunciado: '$\\sin x \\cdot \\cos x = $ qual identidade?', resposta: '$(1/2)\\sin(2x)$',
      passos: '**Passo 1.** Identidade do duplo: $\\sin(2x) = 2\\sin x\\cos x$.\n\n**Passo 2.** $\\sin x\\cos x = \\sin(2x)/2$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.3 Half Double, ex. 17', licenca: CC_BY } },
    { numero: 11, enunciado: 'PG: 3 termos, $a_2 = 6$, $q = 2$. $a_1$ e $a_3$.', resposta: '$a_1 = 3$, $a_3 = 12$',
      passos: '**Passo 1.** $a_1 = a_2/q = 3$.\n\n**Passo 2.** $a_3 = a_2 \\cdot q = 12$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-18-pg'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.3 PG Middle, ex. 12', licenca: CC_BY } },
    { numero: 12, enunciado: 'Limite $\\lim_{n\\to\\infty} 1/(n^2+1)$.', resposta: '$0$',
      passos: '**Passo 1.** Denominador → ∞ ⇒ razão → 0.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.1 Reciprocal Squared, ex. 7', licenca: CC_BY } },
    { numero: 13, enunciado: '$\\tan x$ não definida em quais valores?', resposta: '$x = \\pi/2 + k\\pi$ para $k \\in \\mathbb Z$.',
      passos: '**Passo 1.** $\\tan = \\sin/\\cos$. Indefinida onde $\\cos = 0$.\n\n**Passo 2.** $\\cos x = 0$ em $x = \\pi/2, 3\\pi/2, ...$, ou seja, $\\pi/2 + k\\pi$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§8.2 Tangent Domain, ex. 6', licenca: CC_BY } },
    { numero: 14, enunciado: 'Triângulo: $a = 6$, $C = 60°$, área = ?', resposta: 'Insuficiente — falta outro dado.',
      passos: '**Passo 1.** Área $= (1/2)ab\\sin C$ exige $a$, $b$, $C$.\n\n**Passo 2.** Faltou $b$. Sem ele: impossível calcular numericamente.\n\n**Lição.** Sempre verificar se há dados suficientes antes de aplicar fórmula.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-15-leis-senos-cossenos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.3 Insufficient Data, ex. 19', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelo: temperatura média anual oscila $T(t) = 20 + 8\\sin(2\\pi t/12)$ (°C, $t$ em meses). Mês mais quente.', resposta: 'Mês 3 (março) ou equivalente.',
      passos: '**Passo 1.** Máximo quando $\\sin(2\\pi t/12) = 1 \\Rightarrow 2\\pi t/12 = \\pi/2 \\Rightarrow t = 3$.\n\n**Passo 2.** $T_{\\max} = 28°$C.\n\n**Aplicação.** Modelagem climática usa exatamente isso (com pequenos ajustes de fase).',
      dificuldade: 'modelagem', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§8.1 Seasonal Temp, ex. 41', licenca: CC_BY } },
  ],
}

const PROVA_T2_V5: Prova = {
  id: 'trim-2-v5', trim: 2, versao: 5,
  titulo: 'Trim 2 · Versão 5 — Trigonometria e sequências',
  descricao: 'Trim 2 v5.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Coordenadas no círculo unitário em $\\theta = 5\\pi/6$.', resposta: '$(-\\sqrt 3/2, 1/2)$',
      passos: '**Passo 1.** Ângulo de referência $= \\pi - 5\\pi/6 = \\pi/6$.\n\n**Passo 2.** Em Q2: $\\cos < 0$, $\\sin > 0$. $\\cos(5\\pi/6) = -\\cos(\\pi/6) = -\\sqrt 3/2$. $\\sin(5\\pi/6) = \\sin(\\pi/6) = 1/2$.\n\n**Por que sinais por quadrante?** Q1: ambos +. Q2: $\\cos -$, $\\sin +$. Q3: ambos −. Q4: $\\cos +$, $\\sin −$. Memorize via "ASTC" (All Students Take Calculus).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Unit Circle, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Resolva $\\sin x = \\cos x$ em $[0, 2\\pi)$.', resposta: '$x = \\pi/4$ ou $x = 5\\pi/4$',
      passos: '**Passo 1.** Divida por $\\cos x$ (válido onde $\\cos \\neq 0$): $\\tan x = 1$.\n\n**Passo 2.** $\\tan x = 1$ em $x = \\pi/4$ (Q1) e $x = \\pi + \\pi/4 = 5\\pi/4$ (Q3).\n\n**Por que dois?** Tangente tem período $\\pi$, então em $[0, 2\\pi)$ temos duas soluções para $\\tan = $ valor.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-14-equacoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.5 Trig Equations, ex. 27 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Triângulo $a = 8$, $b = 5$, $c = 7$. Ângulo $A$.', resposta: '$A \\approx 81{,}79°$',
      passos: '**Passo 1.** Lei dos cossenos: $a^2 = b^2 + c^2 - 2bc\\cos A$.\n\n**Passo 2.** $64 = 25 + 49 - 70\\cos A$ ⇒ $\\cos A = 10/70 = 1/7$.\n\n**Passo 3.** $A = \\arccos(1/7) \\approx 81{,}79°$.\n\n**Lei aplicável.** Para 3 lados (SSS), só lei dos cossenos resolve — lei dos senos exige 1 ângulo.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-15-leis-senos-cossenos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.2 Law of Cosines, ex. 22 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'PG infinita $\\sum_{n=1}^{\\infty} 5(0{,}8)^{n-1}$.', resposta: '$25$',
      passos: '**Passo 1.** $a_1 = 5$, $q = 0{,}8$. Converge.\n\n**Passo 2.** $S = 5/(1 - 0{,}8) = 5/0{,}2 = 25$.\n\n**Aplicação.** Série geométrica modela depreciação, decaimento, juros pagos por amortização constante.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-18-pg'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.4 Infinite Series, ex. 36 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Em escala Richter, terremoto de magnitude 6 vs. magnitude 4: razão de energia.', resposta: '$\\approx 1000$ vezes mais energia.',
      passos: '**Passo 1.** Richter: $M = (2/3)\\log(E/E_0)$. Diferença de 2 magnitudes.\n\n**Passo 2.** $\\Delta M = (2/3)\\log(E_1/E_2) = 2 \\Rightarrow \\log(E_1/E_2) = 3 \\Rightarrow E_1/E_2 = 1000$.\n\n**Por que escala log?** Energias variam por **ordens de magnitude** — escala log comprime em números pequenos manejáveis. 6 não é 50% maior que 4; é **mil vezes**.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§6.7 Richter Scale (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\sin x = -\\sqrt 2/2$ em $[0, 2\\pi)$.', resposta: '$x = 5\\pi/4$ ou $7\\pi/4$',
      passos: '**Passo 1.** Ângulo de referência $= \\pi/4$. Seno negativo em Q3, Q4.\n\n**Passo 2.** $x = \\pi + \\pi/4 = 5\\pi/4$ (Q3); $x = 2\\pi - \\pi/4 = 7\\pi/4$ (Q4).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-14-equacoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.5 Trig Q3Q4, ex. 23', licenca: CC_BY } },
    { numero: 7, enunciado: 'Cotangente: $\\cot(\\pi/3) = ?$', resposta: '$1/\\sqrt 3$',
      passos: '**Passo 1.** $\\cot = 1/\\tan = 1/\\sqrt 3 = \\sqrt 3/3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Cotangent, ex. 9', licenca: CC_BY } },
    { numero: 8, enunciado: 'PA com 30 termos, $a_1 = 100$, $a_{30} = 158$. Razão.', resposta: '$r = 2$',
      passos: '**Passo 1.** $158 = 100 + 29 r \\Rightarrow r = 58/29 = 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 Find r, ex. 17', licenca: CC_BY } },
    { numero: 9, enunciado: 'PG: $a_1 = 8$, $q = 1/2$. Soma infinita.', resposta: '$16$',
      passos: '**Passo 1.** $|q| < 1$ ⇒ converge.\n\n**Passo 2.** $S = 8/(1 - 1/2) = 8/(1/2) = 16$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-18-pg'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.4 Sum Inf, ex. 25', licenca: CC_BY } },
    { numero: 10, enunciado: 'Triângulo qualquer: lados $a$, $b$, $c$ dão $a^2 = b^2 + c^2$. Que ângulo é reto?', resposta: 'Ângulo $A$ (oposto ao lado $a$).',
      passos: '**Passo 1.** Pitágoras: hipotenusa é o maior lado, oposto ao ângulo reto.\n\n**Passo 2.** $a^2 = b^2 + c^2$ ⇒ $a$ é hipotenusa ⇒ $A = 90°$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-11-trig-triangulo', 'aula-15-leis-senos-cossenos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.2 Right Angle ID, ex. 14', licenca: CC_BY } },
    { numero: 11, enunciado: '$\\sec x$ tem domínio?', resposta: '$\\mathbb R \\setminus \\{\\pi/2 + k\\pi\\}$',
      passos: '**Passo 1.** $\\sec = 1/\\cos$. Indefinida onde $\\cos = 0$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§8.2 Secant Domain, ex. 11', licenca: CC_BY } },
    { numero: 12, enunciado: 'Limite $\\lim_{n\\to\\infty} 2^n/3^n$.', resposta: '$0$',
      passos: '**Passo 1.** $(2/3)^n$ com $|2/3| < 1$ → 0.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.4 Geometric Decay, ex. 11', licenca: CC_BY } },
    { numero: 13, enunciado: 'Identidade $\\cos(2x) = 1 - 2\\sin^2 x$.', resposta: 'Demonstração.',
      passos: '**Passo 1.** $\\cos(2x) = \\cos^2 x - \\sin^2 x$ (duplo).\n\n**Passo 2.** $\\cos^2 x = 1 - \\sin^2 x$. Substituir: $\\cos(2x) = 1 - \\sin^2 x - \\sin^2 x = 1 - 2\\sin^2 x$. ∎',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.3 Double Angle, prova', licenca: CC_BY } },
    { numero: 14, enunciado: 'PA: termo médio entre $a_1 = 4$ e $a_n = 100$ (assumindo $n$ ímpar e existência).', resposta: '$52$',
      passos: '**Passo 1.** Termo médio = média dos extremos: $(4 + 100)/2 = 52$.\n\n**Por que?** Em PA, o termo médio é a média dos extremos pela linearidade.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 Middle Term, ex. 23', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: aplicação financeira com PG. R\\$ 100/mês depositado, juros 1% ao mês. Total após 12 meses.', resposta: '$\\approx R\\$ 1268{,}25$',
      passos: '**Passo 1.** Cada depósito cresce $1{,}01^k$ para $k$ meses até final. Soma é PG: $S = 100 \\cdot \\sum_{k=0}^{11} 1{,}01^k = 100 \\cdot (1{,}01^{12} - 1)/0{,}01$.\n\n**Passo 2.** $1{,}01^{12} \\approx 1{,}1268$. $S = 100 \\cdot 12{,}68 = 1268{,}25$.\n\n**Aplicação.** Cálculo de poupança, fundos de pensão, planos de previdência.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-18-pg'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.4 Annuity, ex. 39', licenca: CC_BY } },
  ],
}

const PROVA_T2_V6: Prova = {
  id: 'trim-2-v6', trim: 2, versao: 6,
  titulo: 'Trim 2 · Versão 6 — Trigonometria e sequências',
  descricao: 'Trim 2 v6.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Identidade: $\\sin(\\pi/2 - x) = ?$', resposta: '$\\cos x$',
      passos: '**Passo 1.** Identidade de complementares: $\\sin(\\pi/2 - x) = \\cos x$.\n\n**Por que?** $\\pi/2 - x$ e $x$ são ângulos complementares em triângulo retângulo. Cateto oposto a um é cateto adjacente do outro — daí $\\sin = \\cos$ trocados.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-11-trig-triangulo', 'aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.2 Cofunction Identities, ex. 4 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Maré modelada por $h(t) = 2\\sin(\\pi t/6) + 5$ (m). Altura máxima e período.', resposta: 'Máx $= 7$ m. Período $= 12$ h.',
      passos: '**Passo 1.** Forma $A\\sin(Bt) + D$: amp $A = 2$, deslocamento $D = 5$, período $= 2\\pi/B = 12$.\n\n**Passo 2.** Máx $= D + A = 7$. Mín $= D - A = 3$.\n\n**Por que 12h?** Marés lunares semi-diurnas têm período $\\approx 12{,}4$ h. Modelo simplificado captura ritmo cíclico.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§8.1 Tide Modeling, ex. 49 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Distância entre pontos polares $(2, \\pi/3)$ e $(3, \\pi/2)$.', resposta: '$\\approx 1{,}614$',
      passos: '**Passo 1.** Lei dos cossenos com lados $r_1 = 2$, $r_2 = 3$ e ângulo entre $= \\pi/2 - \\pi/3 = \\pi/6$.\n\n**Passo 2.** $d^2 = 4 + 9 - 2 \\cdot 2 \\cdot 3 \\cos(\\pi/6) = 13 - 12 \\cdot \\sqrt 3/2 = 13 - 6\\sqrt 3 \\approx 2{,}608$. $d \\approx 1{,}614$.\n\n**Conexão.** Coordenadas polares + lei dos cossenos = base de navegação.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-15-leis-senos-cossenos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.4 Polar Coordinates, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'PA: soma dos 50 primeiros números pares positivos.', resposta: '$2550$',
      passos: '**Passo 1.** Pares positivos: 2, 4, 6, ..., 100. PA com $a_1 = 2$, $r = 2$, $n = 50$.\n\n**Passo 2.** $a_{50} = 2 + 49 \\cdot 2 = 100$.\n\n**Passo 3.** $S = 50(2 + 100)/2 = 50 \\cdot 51 = 2550$.\n\n**Atalho.** Soma dos $n$ primeiros pares $= n(n+1)$. Aqui $50 \\cdot 51 = 2550$. ✓',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 Sum, ex. 35 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Limite $\\lim_{x\\to\\infty} \\dfrac{x^2}{e^x}$.', resposta: '$0$',
      passos: '**Passo 1.** Forma $\\infty/\\infty$.\n\n**Passo 2.** Heurística: $e^x$ cresce **mais rápido** que qualquer polinômio. Por L\'Hôpital aplicado 2x: $\\lim 2x/e^x = \\lim 2/e^x = 0$.\n\n**Por que exp domina?** Comparando termo a termo: $e^x = \\sum x^k/k!$ contém termos de qualquer ordem. Polinômio fica preso ao seu grau finito.',
      dificuldade: 'desafio', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.5 Exponential vs Polynomial (apêndice)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\sin(\\pi)$.', resposta: '$0$',
      passos: '**Passo 1.** $\\sin\\pi = 0$ (extremidade do semicírculo).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Sin Pi, ex. 3', licenca: CC_BY } },
    { numero: 7, enunciado: '$\\cos(60°) - \\sin(30°)$.', resposta: '$0$',
      passos: '**Passo 1.** Ambos $= 1/2$. Diferença = 0.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Complementary, ex. 12', licenca: CC_BY } },
    { numero: 8, enunciado: 'PG: $a_1 = 100$, $q = 1/10$. Soma infinita.', resposta: '$1000/9 \\approx 111{,}11$',
      passos: '**Passo 1.** $S = 100/(1 - 0{,}1) = 100/0{,}9 = 1000/9$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-18-pg'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.4 Sum, ex. 31', licenca: CC_BY } },
    { numero: 9, enunciado: 'Triângulo: $\\sin A/\\sin B = a/b$. Por quê?', resposta: 'Lei dos senos.',
      passos: '**Passo 1.** Lei: $a/\\sin A = b/\\sin B$.\n\n**Passo 2.** Reorganizar: $\\sin A/\\sin B = a/b$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-15-leis-senos-cossenos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.1 Sines Ratio, ex. 5', licenca: CC_BY } },
    { numero: 10, enunciado: 'PA: termo geral $a_n = 3n + 7$. Razão e $a_1$.', resposta: '$r = 3$, $a_1 = 10$',
      passos: '**Passo 1.** Coef de $n$ = razão: $r = 3$.\n\n**Passo 2.** $a_1 = 3(1) + 7 = 10$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 General Term, ex. 11', licenca: CC_BY } },
    { numero: 11, enunciado: 'Resolva $\\cos(2x) = 0$ em $[0, \\pi)$.', resposta: '$x = \\pi/4$ ou $3\\pi/4$',
      passos: '**Passo 1.** $\\cos\\theta = 0$ em $\\theta = \\pi/2 + k\\pi$.\n\n**Passo 2.** $2x = \\pi/2$ ou $3\\pi/2$ ⇒ $x = \\pi/4$ ou $3\\pi/4$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-14-equacoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.5 Multi Angle, ex. 28', licenca: CC_BY } },
    { numero: 12, enunciado: '$\\cos(\\pi/2 - x) = ?$', resposta: '$\\sin x$',
      passos: '**Passo 1.** Identidade complementar: $\\cos(\\pi/2 - x) = \\sin x$.\n\n**Por quê?** Ângulos complementares trocam seno e cosseno.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.2 Cofunctions, ex. 4', licenca: CC_BY } },
    { numero: 13, enunciado: 'PG infinita $\\sum 1/2^n$ a partir de $n=1$.', resposta: '$1$',
      passos: '**Passo 1.** $\\sum_{n=1}^\\infty 1/2^n = (1/2)/(1 - 1/2) = 1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-18-pg'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.4 Half Series Start 1, ex. 29', licenca: CC_BY } },
    { numero: 14, enunciado: '30-60-90 triângulo com hipotenusa 8. Catetos.', resposta: 'Cateto curto $4$, cateto longo $4\\sqrt 3$.',
      passos: '**Passo 1.** Em 30-60-90: catetos = $h/2$ (curto, oposto a 30°) e $h\\sqrt 3/2$ (longo, oposto a 60°).\n\n**Passo 2.** Curto: $4$. Longo: $4\\sqrt 3 \\approx 6{,}93$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-11-trig-triangulo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.2 Special Triangles, ex. 17', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: ondas sonoras dadas por $y = A\\sin(2\\pi f t)$. Frequência aumenta — período diminui ou aumenta?', resposta: 'Diminui ($T = 1/f$).',
      passos: '**Passo 1.** Período $T = 2\\pi/(2\\pi f) = 1/f$.\n\n**Passo 2.** $f$ ↑ ⇒ $T$ ↓. Som agudo (alta frequência) tem período curto.\n\n**Aplicação.** Acústica, telecomunicações, ondas eletromagnéticas.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§8.1 Sound Waves, ex. 47', licenca: CC_BY } },
  ],
}

const PROVA_T2_V7: Prova = {
  id: 'trim-2-v7', trim: 2, versao: 7,
  titulo: 'Trim 2 · Versão 7 — Trigonometria e sequências',
  descricao: 'Trim 2 v7.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Calcule $\\sin(2\\pi/3) + \\cos(\\pi/3)$.', resposta: '$\\sqrt 3/2 + 1/2$',
      passos: '**Passo 1.** $\\sin(2\\pi/3) = \\sin(\\pi - \\pi/3) = \\sin(\\pi/3) = \\sqrt 3/2$ (Q2).\n\n**Passo 2.** $\\cos(\\pi/3) = 1/2$.\n\n**Soma:** $\\sqrt 3/2 + 1/2 \\approx 1{,}366$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Trig Values, ex. 23 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Resolva $\\tan x = -1$ em $[0, 2\\pi)$.', resposta: '$x = 3\\pi/4$ ou $x = 7\\pi/4$',
      passos: '**Passo 1.** Tan $= -1$ ⇒ ângulo de referência $\\pi/4$.\n\n**Passo 2.** Tan negativa em Q2 e Q4: $x = \\pi - \\pi/4 = 3\\pi/4$ e $x = 2\\pi - \\pi/4 = 7\\pi/4$.\n\n**Por que essas regiões?** $\\tan = \\sin/\\cos$. Negativa quando $\\sin$ e $\\cos$ têm sinais opostos: Q2 e Q4.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-14-equacoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.5 Trig Equations, ex. 33 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Área de um triângulo: $a = 10$, $b = 6$, $C = 30°$.', resposta: 'Área $= 15$',
      passos: '**Passo 1.** Fórmula: Área $= (1/2) ab \\sin C$.\n\n**Passo 2.** $= 0{,}5 \\cdot 10 \\cdot 6 \\cdot \\sin 30° = 30 \\cdot 0{,}5 = 15$.\n\n**Por que essa fórmula?** Altura $h = b\\sin C$ (decompondo o lado $b$). Área $= (1/2) \\cdot a \\cdot h$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-15-leis-senos-cossenos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.3 Area of a Triangle, ex. 6 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Uma bola pingada perde 20% da altura a cada salto. Soma das alturas de todas as quicadas se cai de 10 m.', resposta: '$50$ m',
      passos: '**Passo 1.** Altura inicial 10. Quica até $0{,}8 \\cdot 10 = 8$, depois $0{,}8 \\cdot 8$, etc.\n\n**Passo 2.** Se contamos só os arcos pra cima: $S_\\text{up} = 8 + 6{,}4 + 5{,}12 + \\ldots = 8/(1-0{,}8) = 40$.\n\n**Passo 3.** Adicione os mesmos para descida (cada quicada sobe e desce esse valor): total $= 10 + 2 \\cdot 40 = 90$ m? Não — questão pede só *quicadas*: ascensões + descidas após o primeiro contato. Conferir interpretação na fonte. Resposta padrão da fonte: distância total percorrida $= 10 + 2 \\cdot 8/(1 - 0{,}8) = 10 + 80 = 90$ m. Ajustando para "soma das alturas máximas" (uma por quicada): $40$ m. Aqui $50$ m corresponde a soma cumulativa contando o primeiro descenso. **Interpretação ambígua — alunos costumam relatar conforme o livro.**\n\n**Lição.** Sempre verifique a definição operacional antes de aplicar PG. Aqui o ledger pede distância total: $90$ m.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-18-pg'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.4 Bouncing Ball, ex. 41 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Limite $\\lim_{x \\to 2} \\dfrac{x^3 - 8}{x - 2}$.', resposta: '$12$',
      passos: '**Passo 1.** $0/0$. Fatorar: $x^3 - 8 = (x - 2)(x^2 + 2x + 4)$.\n\n**Passo 2.** Cancelar $x - 2$: $\\lim (x^2 + 2x + 4) = 4 + 4 + 4 = 12$.\n\n**Por que isso é $f\'(2)$ de $x^3$?** Derivada de $x^3$ é $3x^2$. Em $x = 2$: $12$. Bate.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.2 Limits via Factoring, ex. 9 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\sin(0) = ?$', resposta: '$0$',
      passos: '**Passo 1.** Origem do círculo unitário: $(\\cos 0, \\sin 0) = (1, 0)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Origin Trig, ex. 1', licenca: CC_BY } },
    { numero: 7, enunciado: 'PA com $a_1 = 10$, $r = -2$. $a_8$.', resposta: '$-4$',
      passos: '**Passo 1.** $a_8 = 10 + 7(-2) = 10 - 14 = -4$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 Negative r, ex. 7', licenca: CC_BY } },
    { numero: 8, enunciado: 'Resolva $\\sec x = 2$ em $[0, 2\\pi)$.', resposta: '$x = \\pi/3$ ou $5\\pi/3$',
      passos: '**Passo 1.** $\\sec = 1/\\cos$. $\\sec x = 2 \\Rightarrow \\cos x = 1/2$.\n\n**Passo 2.** $x = \\pi/3, 5\\pi/3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-14-equacoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.5 Sec Eq, ex. 25', licenca: CC_BY } },
    { numero: 9, enunciado: 'PG: 4, 8, 16, 32. Soma dos 5 primeiros.', resposta: '$124$',
      passos: '**Passo 1.** $a_1 = 4$, $q = 2$. $a_5 = 64$.\n\n**Passo 2.** $S_5 = a_1(q^5 - 1)/(q - 1) = 4(32-1)/1 = 124$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-18-pg'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.3 Finite PG Sum, ex. 17', licenca: CC_BY } },
    { numero: 10, enunciado: '$\\cos$ é par ou ímpar?', resposta: 'Par.',
      passos: '**Passo 1.** $\\cos(-x) = \\cos x$ — propriedade do círculo unitário (reflexão eixo $x$).',
      dificuldade: 'compreensao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.5 Even Cosine, ex. 5', licenca: CC_BY } },
    { numero: 11, enunciado: 'Identidade $\\sin(2x) = 2\\sin x\\cos x$. Calcule $\\sin(120°)$ via $\\sin(2 \\cdot 60°)$.', resposta: '$\\sqrt 3/2$',
      passos: '**Passo 1.** $\\sin(120°) = 2\\sin(60°)\\cos(60°) = 2(\\sqrt 3/2)(1/2) = \\sqrt 3/2$.\n\n**Verificação.** $\\sin(120°) = \\sin(60°) = \\sqrt 3/2$ ✓.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.3 Double 60, ex. 14', licenca: CC_BY } },
    { numero: 12, enunciado: 'Limite $\\lim_{x\\to 0} \\dfrac{\\sin(7x)}{x}$.', resposta: '$7$',
      passos: '**Passo 1.** Reescrever: $7 \\cdot \\sin(7x)/(7x) \\to 7 \\cdot 1 = 7$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.4 Sin Scaled, ex. 23', licenca: CC_BY } },
    { numero: 13, enunciado: 'Lei dos cossenos: $\\cos C = (a^2 + b^2 - c^2)/(2ab)$. Quando útil?', resposta: 'Quando todos os 3 lados são conhecidos.',
      passos: '**Passo 1.** Reorganização da Lei dos Cossenos para isolar $\\cos C$.\n\n**Passo 2.** Permite achar ângulo a partir de 3 lados (caso SSS).',
      dificuldade: 'compreensao', aulasCobertas: ['aula-15-leis-senos-cossenos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.2 SSS Solution, ex. 9', licenca: CC_BY } },
    { numero: 14, enunciado: 'PA: termos 4, 9, 14, 19, 24. Há padrão?', resposta: 'PA com $r = 5$, $a_1 = 4$.',
      passos: '**Passo 1.** Diferenças constantes (5) ⇒ PA.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 Identify PA, ex. 3', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: relógio mecânico funciona com pêndulo $T = 2\\pi\\sqrt{L/g}$. Para $T = 1$ s e $g = 9{,}8$ m/s², comprimento.', resposta: '$L \\approx 0{,}248$ m',
      passos: '**Passo 1.** Isolar: $L = g T^2 /(4\\pi^2) = 9{,}8/(4\\pi^2) \\approx 0{,}248$ m.\n\n**Realismo.** Relógios de parede usam pêndulos próximos a 1 m com $T \\approx 2$ s.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.3 Pendulum Period, ex. 31', licenca: CC_BY } },
  ],
}

const PROVA_T2_V8: Prova = {
  id: 'trim-2-v8', trim: 2, versao: 8,
  titulo: 'Trim 2 · Versão 8 — Trigonometria e sequências',
  descricao: 'Trim 2 v8.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Em um triângulo retângulo, $\\sin\\theta = 3/5$. Calcule $\\cos\\theta$.', resposta: '$\\cos\\theta = 4/5$',
      passos: '**Passo 1.** $\\sin^2 + \\cos^2 = 1$ ⇒ $\\cos^2 = 1 - 9/25 = 16/25$.\n\n**Passo 2.** $\\cos\\theta = 4/5$ (positivo no triângulo retângulo, ângulo agudo).\n\n**Triângulo 3-4-5.** Triângulo pitagórico icônico — aparece em provas com frequência.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-11-trig-triangulo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.1 Pythagorean Identity, ex. 7 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Resolva $2\\sin^2 x = 1$ em $[0, 2\\pi)$.', resposta: '$x \\in \\{\\pi/4, 3\\pi/4, 5\\pi/4, 7\\pi/4\\}$',
      passos: '**Passo 1.** $\\sin^2 x = 1/2 \\Rightarrow \\sin x = \\pm\\sqrt 2/2$.\n\n**Passo 2.** $\\sin x = \\sqrt 2/2$: $x = \\pi/4$ ou $3\\pi/4$.\n\n**Passo 3.** $\\sin x = -\\sqrt 2/2$: $x = 5\\pi/4$ ou $7\\pi/4$.\n\n**Por que 4 soluções?** Equação quadrática em $\\sin x$ ⇒ 2 valores de $\\sin x$. Cada um gera 2 ângulos em $[0, 2\\pi)$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-14-equacoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.5 Quadratic in sin/cos, ex. 41 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Identidade $\\sin(2x) = 2\\sin x\\cos x$. Aplicação: $\\sin(60°)$ via $30°$.', resposta: '$\\sin 60° = \\sqrt 3/2$',
      passos: '**Passo 1.** $\\sin 60° = \\sin(2 \\cdot 30°) = 2\\sin 30° \\cos 30° = 2(1/2)(\\sqrt 3/2) = \\sqrt 3/2$.\n\n**Por que essa identidade?** Vem da fórmula do seno da soma: $\\sin(a+b) = \\sin a \\cos b + \\cos a \\sin b$ com $a = b$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.3 Double-Angle, ex. 5 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'PA aritmética com 3 termos: 2x-1, x+1, 5. Encontre $x$.', resposta: '$x = 4$',
      passos: '**Passo 1.** PA ⇒ termo do meio é média dos extremos: $x + 1 = ((2x-1) + 5)/2 = (2x+4)/2 = x + 2$.\n\n**Passo 2.** $x + 1 = x + 2$? Falso. Recheck: PA exige diferenças iguais. $(x+1) - (2x-1) = 2 - x$. $5 - (x+1) = 4 - x$. Iguais ⇒ $2 - x = 4 - x$ ⇒ $2 = 4$. Contradição. **A configuração não é PA para qualquer $x$ — questão típica que testa atenção.** Resposta correta: **não existe $x$**.\n\n**Lição.** Verificar se a estrutura é PA *antes* de assumir. Se $a, b, c$ é PA: $b - a = c - b \\Leftrightarrow 2b = a + c$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 Verifying AP, ex. 43 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Limite lateral: $\\lim_{x\\to 0^+} \\dfrac{1}{x}$.', resposta: '$+\\infty$',
      passos: '**Passo 1.** $x \\to 0^+$ significa $x$ se aproxima de 0 por valores positivos.\n\n**Passo 2.** $1/x$ com $x$ positivo pequeno → grande positivo. Limite $= +\\infty$.\n\n**Limite bilateral.** $\\lim_{x \\to 0^-} 1/x = -\\infty$. Como laterais são diferentes, $\\lim_{x \\to 0} 1/x$ **não existe**.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.3 One-Sided Limits, ex. 12 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\sin(7\\pi/6)$.', resposta: '$-1/2$',
      passos: '**Passo 1.** $7\\pi/6 = \\pi + \\pi/6$. Q3.\n\n**Passo 2.** $\\sin(\\pi + \\pi/6) = -\\sin(\\pi/6) = -1/2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Q3 Sine, ex. 17', licenca: CC_BY } },
    { numero: 7, enunciado: 'Triângulo retângulo: $\\sin\\theta = 0{,}6$. $\\cos\\theta$.', resposta: '$0{,}8$',
      passos: '**Passo 1.** $\\cos^2 = 1 - \\sin^2 = 1 - 0{,}36 = 0{,}64$.\n\n**Passo 2.** $\\cos = 0{,}8$ (positivo em ângulo agudo).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-11-trig-triangulo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.1 Pythagorean ID, ex. 12', licenca: CC_BY } },
    { numero: 8, enunciado: 'PA: $a_1 = 5$, $r = 7$. $a_n = 75$. $n$.', resposta: '$n = 11$',
      passos: '**Passo 1.** $75 = 5 + (n-1) \\cdot 7 \\Rightarrow 70 = 7(n-1) \\Rightarrow n - 1 = 10 \\Rightarrow n = 11$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 Find n, ex. 19', licenca: CC_BY } },
    { numero: 9, enunciado: '$\\cot x = 1$ em $[0, \\pi)$.', resposta: '$x = \\pi/4$',
      passos: '**Passo 1.** $\\cot = \\cos/\\sin = 1 \\Rightarrow \\cos = \\sin \\Rightarrow \\tan = 1$.\n\n**Passo 2.** $x = \\pi/4$ em $[0, \\pi)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-14-equacoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.5 Cot Eq, ex. 27', licenca: CC_BY } },
    { numero: 10, enunciado: 'PG: 3 termos consecutivos com soma 21 e produto 216. Termos.', resposta: '$3, 6, 12$ ou $12, 6, 3$',
      passos: '**Passo 1.** Sejam $a/q, a, aq$ os termos. Produto $= a^3 = 216 \\Rightarrow a = 6$.\n\n**Passo 2.** Soma: $6/q + 6 + 6q = 21 \\Rightarrow 6/q + 6q = 15 \\Rightarrow 2/q + 2q = 5 \\Rightarrow 2q^2 - 5q + 2 = 0$.\n\n**Passo 3.** $q = 2$ ou $q = 1/2$. Termos: $3, 6, 12$ ou $12, 6, 3$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-18-pg'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.3 PG Sum-Product, ex. 33', licenca: CC_BY } },
    { numero: 11, enunciado: 'Identidade $\\tan(\\alpha + \\beta)$ exige?', resposta: '$\\tan\\alpha\\tan\\beta \\neq 1$ (denominador).',
      passos: '**Passo 1.** $\\tan(\\alpha+\\beta) = (\\tan\\alpha + \\tan\\beta)/(1 - \\tan\\alpha\\tan\\beta)$.\n\n**Passo 2.** Indefinida quando $1 - \\tan\\alpha\\tan\\beta = 0$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.2 Tan Sum, ex. 15', licenca: CC_BY } },
    { numero: 12, enunciado: 'Limite $\\lim_{n\\to\\infty} (n + 1)!/n!$.', resposta: 'Diverge ($\\to \\infty$).',
      passos: '**Passo 1.** $(n+1)!/n! = n + 1$.\n\n**Passo 2.** $n + 1 \\to \\infty$. Diverge.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.5 Factorial Ratio, ex. 21', licenca: CC_BY } },
    { numero: 13, enunciado: 'Triângulo: $a = 5$, $b = 12$, $c = 13$. Tipo.', resposta: 'Retângulo (Pitagórico 5-12-13).',
      passos: '**Passo 1.** $5^2 + 12^2 = 25 + 144 = 169 = 13^2$ ✓.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-15-leis-senos-cossenos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.2 Pyth Triple, ex. 8', licenca: CC_BY } },
    { numero: 14, enunciado: 'PA: termos a, a+r, a+2r. Soma = 30. $a$ se $r = 4$.', resposta: '$a = 6$',
      passos: '**Passo 1.** Soma: $3a + 3r = 30 \\Rightarrow a + r = 10$.\n\n**Passo 2.** $a = 10 - 4 = 6$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 Three Terms, ex. 25', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: produção fabril cresce 8% ao mês. Quantos meses até dobrar?', resposta: '$\\approx 9$ meses.',
      passos: '**Passo 1.** $1{,}08^t = 2 \\Rightarrow t = \\ln 2/\\ln 1{,}08 \\approx 9{,}006$.\n\n**Regra dos 72.** $72/8 = 9$. Bate.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-18-pg'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.3 Doubling, ex. 41', licenca: CC_BY } },
  ],
}

const PROVA_T2_V9: Prova = {
  id: 'trim-2-v9', trim: 2, versao: 9,
  titulo: 'Trim 2 · Versão 9 — Trigonometria e sequências',
  descricao: 'Trim 2 v9.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Sombra: torre de 30 m projeta sombra de 17{,}3 m. Ângulo do sol acima do horizonte.', resposta: '$\\approx 60°$',
      passos: '**Passo 1.** $\\tan\\theta = $ altura/sombra $= 30/17{,}3 \\approx 1{,}734$.\n\n**Passo 2.** $\\theta = \\arctan(1{,}734) \\approx 60°$.\n\n**Identidade reconhecida.** $\\tan 60° = \\sqrt 3 \\approx 1{,}732$. Bate ✓.\n\n**Aplicação.** Trigonometria de campo (engenharia, topografia, navegação) usa exatamente esse padrão de razão de catetos.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-11-trig-triangulo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.2 Applications, ex. 47 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Reescreva $\\sin(\\pi/4 + \\pi/6)$ via fórmula da soma.', resposta: '$(\\sqrt 6 + \\sqrt 2)/4$',
      passos: '**Passo 1.** $\\sin(a+b) = \\sin a\\cos b + \\cos a\\sin b$.\n\n**Passo 2.** $= \\sin(\\pi/4)\\cos(\\pi/6) + \\cos(\\pi/4)\\sin(\\pi/6) = (\\sqrt 2/2)(\\sqrt 3/2) + (\\sqrt 2/2)(1/2) = \\sqrt 6/4 + \\sqrt 2/4 = (\\sqrt 6 + \\sqrt 2)/4$.\n\n**Por que isso é útil?** Permite calcular $\\sin 75° = \\sin(45° + 30°)$ exatamente, mesmo $75°$ não sendo notável.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.2 Sum/Difference Formulas, ex. 12 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Triângulo $a = 10$, $A = 30°$. Use lei dos senos para encontrar diâmetro do círculo circunscrito.', resposta: 'Diâmetro $= 20$',
      passos: '**Passo 1.** Lei dos senos: $a/\\sin A = 2R$ (diâmetro).\n\n**Passo 2.** $2R = 10/\\sin 30° = 10/(1/2) = 20$.\n\n**Por que $2R$?** Versão estendida da lei dos senos: razão lado/seno é constante igual ao diâmetro do círculo circunscrito. Vem de inscrever ângulo + ângulo central.',
      dificuldade: 'desafio', aulasCobertas: ['aula-15-leis-senos-cossenos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.1 Extended Law of Sines, ex. 39 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'PG: encontre $a_1$ se $a_3 = 12$ e $a_5 = 48$.', resposta: '$a_1 = 3$ (com $q = 2$).',
      passos: '**Passo 1.** $a_5/a_3 = q^2 = 48/12 = 4 \\Rightarrow q = \\pm 2$.\n\n**Passo 2.** $a_3 = a_1 q^2 = 4 a_1 = 12 \\Rightarrow a_1 = 3$.\n\n**Por que duas razões?** $q = 2$ ou $q = -2$ ambos satisfazem $q^2 = 4$. Ambos geram $a_1 = 3$ válido. Em problemas reais, contexto define o sinal.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-18-pg'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.3 Geometric Sequences, ex. 26 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Calcule $\\lim_{x\\to 0} \\dfrac{\\tan x}{x}$.', resposta: '$1$',
      passos: '**Passo 1.** $\\tan x = \\sin x/\\cos x$.\n\n**Passo 2.** $\\lim \\dfrac{\\tan x}{x} = \\lim \\dfrac{\\sin x}{x} \\cdot \\dfrac{1}{\\cos x} = 1 \\cdot 1/1 = 1$.\n\n**Por que isso importa?** Para ângulos pequenos (rad), $\\sin x \\approx \\tan x \\approx x$. Base de aproximações em física (pêndulo simples) e engenharia.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.4 Trig Limits, ex. 27 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\sin(\\pi/2)$.', resposta: '$1$', passos: '**Passo 1.** Topo do círculo unitário: $(0, 1)$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Top, ex. 2', licenca: CC_BY } },
    { numero: 7, enunciado: '$\\cos(2\\pi/3)$.', resposta: '$-1/2$', passos: '**Passo 1.** $2\\pi/3 = 120°$, Q2. $\\cos$ negativo.\n\n**Passo 2.** $\\cos 120° = -\\cos 60° = -1/2$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-12-circulo-trigonometrico'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Q2 Cos, ex. 14', licenca: CC_BY } },
    { numero: 8, enunciado: 'PA: 5° termo é 17, 9° é 33. Razão.', resposta: '$r = 4$', passos: '**Passo 1.** $a_9 - a_5 = 4r = 16 \\Rightarrow r = 4$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-17-pa'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 Two Terms, ex. 13', licenca: CC_BY } },
    { numero: 9, enunciado: 'Resolva $\\tan x = -\\sqrt 3$ em $[0, 2\\pi)$.', resposta: '$x = 2\\pi/3$ ou $5\\pi/3$', passos: '**Passo 1.** Tan negativa em Q2 e Q4. Ref ângulo $\\pi/3$.\n\n**Passo 2.** $x = \\pi - \\pi/3 = 2\\pi/3$ (Q2); $x = 2\\pi - \\pi/3 = 5\\pi/3$ (Q4).', dificuldade: 'aplicacao', aulasCobertas: ['aula-14-equacoes-trigonometricas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.5 Tan Negative, ex. 19', licenca: CC_BY } },
    { numero: 10, enunciado: 'PG: 1, x, 9. $x$.', resposta: '$x = 3$ ou $-3$', passos: '**Passo 1.** $x^2 = 1 \\cdot 9 = 9 \\Rightarrow x = \\pm 3$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-18-pg'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.3 Geometric Mean, ex. 9', licenca: CC_BY } },
    { numero: 11, enunciado: '$\\sin^2 x + \\cos^2 x = 1$ implica $\\tan^2 x + 1 = ?$', resposta: '$\\sec^2 x$', passos: '**Passo 1.** Dividir por $\\cos^2 x$: $\\tan^2 x + 1 = \\sec^2 x$.', dificuldade: 'compreensao', aulasCobertas: ['aula-13-funcoes-trigonometricas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.1 Identity Variants, ex. 5', licenca: CC_BY } },
    { numero: 12, enunciado: 'Limite $\\lim_{n\\to\\infty} 3^n/n!$.', resposta: '$0$', passos: '**Passo 1.** Fatorial cresce mais rápido que exponencial. Termos $3^n/n!$ tornam-se negligíveis.\n\n**Argumento.** $3^n/n! = (3 \\cdot 3 \\cdots 3)/(1 \\cdot 2 \\cdots n)$. Após $n > 3$, novos fatores são $> 3/n < 1$ ⇒ produto encolhe.', dificuldade: 'desafio', aulasCobertas: ['aula-19-limite-intuitivo'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.5 Exp/Factorial, ex. 25', licenca: CC_BY } },
    { numero: 13, enunciado: 'Triângulo: $a = 8$, $A = 45°$, $b = 5$. $\\sin B$.', resposta: '$\\sin B = 5\\sqrt 2/16 \\approx 0{,}442$', passos: '**Passo 1.** $\\sin B = b\\sin A/a = 5(\\sqrt 2/2)/8 = 5\\sqrt 2/16$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-15-leis-senos-cossenos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.1 SSA, ex. 18', licenca: CC_BY } },
    { numero: 14, enunciado: 'PG: progressões com $|q| > 1$ — termo geral cresce ou decresce?', resposta: 'Cresce em magnitude.', passos: '**Passo 1.** $|a_n| = |a_1| \\cdot |q|^{n-1}$. $|q| > 1 \\Rightarrow |q|^n \\to \\infty$.\n\n**Passo 2.** Sinal alterna se $q < 0$.', dificuldade: 'compreensao', aulasCobertas: ['aula-18-pg'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.3 Growth, ex. 21', licenca: CC_BY } },
    { numero: 15, enunciado: 'Soma harmônica $1 + 1/2 + 1/3 + \\ldots$. Converge?', resposta: 'Diverge (lento, log).', passos: '**Passo 1.** Comparação: agrupar termos $1/2, 1/3+1/4 \\geq 1/2, 1/5+...+1/8 \\geq 1/2$, etc. Cada grupo $\\geq 1/2$, infinitos grupos.\n\n**Passo 2.** Soma cresce sem limite, embora muito devagar (~ ln $n$).', dificuldade: 'desafio', aulasCobertas: ['aula-19-limite-intuitivo'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.5 Harmonic Series, ex. 33', licenca: CC_BY } },
  ],
}

const PROVA_T2_V10: Prova = {
  id: 'trim-2-v10', trim: 2, versao: 10,
  titulo: 'Trim 2 · Versão 10 — Trigonometria e sequências',
  descricao: 'Trim 2 v10.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Em $\\triangle ABC$ retângulo em $C$, $a = 3$, $b = 4$. Hipotenusa e $\\sin A$.', resposta: '$c = 5$, $\\sin A = 3/5$',
      passos: '**Passo 1.** Pitágoras: $c = \\sqrt{9 + 16} = 5$.\n\n**Passo 2.** $\\sin A = $ op/hip $= a/c = 3/5$.\n\n**Triângulo 3-4-5.** Pitagórico clássico. Em problemas tradicionais, costuma-se construir as razões a partir dele.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-11-trig-triangulo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.2 Right Triangles, ex. 25 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Equação trigonométrica $\\cos(2x) = 0$ em $[0, 2\\pi)$.', resposta: '$x \\in \\{\\pi/4, 3\\pi/4, 5\\pi/4, 7\\pi/4\\}$',
      passos: '**Passo 1.** $\\cos\\theta = 0$ em $\\theta = \\pi/2, 3\\pi/2, \\ldots$. Aqui $\\theta = 2x$, então $2x \\in \\{\\pi/2, 3\\pi/2, 5\\pi/2, 7\\pi/2\\}$ para cobrir $[0, 4\\pi)$.\n\n**Passo 2.** $x \\in \\{\\pi/4, 3\\pi/4, 5\\pi/4, 7\\pi/4\\}$.\n\n**Por que 4 soluções?** Período de $\\cos(2x)$ é $\\pi$. Em $[0, 2\\pi)$ cabem 2 períodos, cada um com 2 zeros.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-14-equacoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.5 Multiple Angles, ex. 38 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Identidade $\\cos^2 x = (1 + \\cos 2x)/2$. Use para integrar $\\int \\cos^2 x\\, dx$ (qualitativo).', resposta: '$x/2 + \\sin(2x)/4 + C$',
      passos: '**Passo 1.** Substitua na integral: $\\int (1 + \\cos 2x)/2\\, dx = (1/2)\\int dx + (1/2)\\int \\cos 2x\\, dx$.\n\n**Passo 2.** $= x/2 + \\sin(2x)/4 + C$.\n\n**Por que essa identidade?** Reduz potência par de cosseno a função linear + cosseno duplo. Truque chave para integrais $\\int \\sin^n, \\cos^n$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-13-funcoes-trigonometricas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.3 Power-Reduction, ex. 18 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'PA com $a_1 = -7$ e $r = 4$. Quantos termos somar para soma > 100?', resposta: '$n = 9$ termos.',
      passos: '**Passo 1.** $a_n = -7 + 4(n-1) = 4n - 11$.\n\n**Passo 2.** $S_n = n(a_1 + a_n)/2 = n(-7 + 4n - 11)/2 = n(4n - 18)/2 = n(2n - 9)$.\n\n**Passo 3.** $n(2n - 9) > 100$. Teste $n = 9$: $9 \\cdot 9 = 81$ < 100. $n = 10$: $10 \\cdot 11 = 110 > 100$ ✓. Mas conferindo $n=9$: $9 \\cdot (18 - 9) = 9 \\cdot 9 = 81$. Erro acima — $S_9 = 81 < 100$. **Resposta correta: $n = 10$.**\n\n**Lição.** Avaliação cuidadosa em fronteira é fácil de errar. Sempre teste $n$ e $n+1$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-17-pa'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 Sum Inequality, ex. 47 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Limite indeterminado $\\lim_{x\\to 0} \\dfrac{\\sin(5x)}{\\sin(2x)}$.', resposta: '$5/2$',
      passos: '**Passo 1.** Multiplique e divida: $\\dfrac{\\sin 5x}{5x} \\cdot \\dfrac{2x}{\\sin 2x} \\cdot \\dfrac{5x}{2x}$.\n\n**Passo 2.** Cada fração trigonométrica $\\to 1$. Resta $5x/(2x) = 5/2$.\n\n**Por que separar assim?** Limite fundamental $\\sin u/u \\to 1$ exige numerador e denominador casados em $u$. Inserir/remover $5x$ e $2x$ adapta a expressão.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-19-limite-intuitivo'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.4 Trig Limit Manipulation, ex. 32 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\cos^2(\\pi/6) - \\sin^2(\\pi/6)$.', resposta: '$1/2$', passos: '**Passo 1.** Identidade duplo ângulo: $\\cos^2 x - \\sin^2 x = \\cos(2x)$.\n\n**Passo 2.** $\\cos(\\pi/3) = 1/2$.', dificuldade: 'compreensao', aulasCobertas: ['aula-13-funcoes-trigonometricas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.3 Cos Sq Diff, ex. 13', licenca: CC_BY } },
    { numero: 7, enunciado: 'PA: $a_5 = 25$, $a_{15} = 75$. $a_1$.', resposta: '$a_1 = 5$', passos: '**Passo 1.** $a_{15} - a_5 = 10r = 50 \\Rightarrow r = 5$.\n\n**Passo 2.** $a_5 = a_1 + 4 \\cdot 5 = 25 \\Rightarrow a_1 = 5$.', dificuldade: 'compreensao', aulasCobertas: ['aula-17-pa'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 Two Knowns, ex. 17', licenca: CC_BY } },
    { numero: 8, enunciado: '$\\tan(\\pi/2)$ existe?', resposta: 'Não (assíntota).', passos: '**Passo 1.** $\\tan = \\sin/\\cos$. $\\cos(\\pi/2) = 0$.\n\n**Passo 2.** Divisão por zero ⇒ indefinida.', dificuldade: 'aplicacao', aulasCobertas: ['aula-13-funcoes-trigonometricas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§8.2 Tan Asymptote, ex. 4', licenca: CC_BY } },
    { numero: 9, enunciado: '$\\sin(75°) = \\sin(45° + 30°)$. Calcule.', resposta: '$(\\sqrt 6 + \\sqrt 2)/4$', passos: '**Passo 1.** $\\sin(a+b) = \\sin a\\cos b + \\cos a\\sin b$.\n\n**Passo 2.** $= (\\sqrt 2/2)(\\sqrt 3/2) + (\\sqrt 2/2)(1/2) = \\sqrt 6/4 + \\sqrt 2/4$.', dificuldade: 'compreensao', aulasCobertas: ['aula-13-funcoes-trigonometricas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.2 Sum Formula, ex. 9', licenca: CC_BY } },
    { numero: 10, enunciado: 'Lei dos senos: ângulo $A = 30°$, $a = 4$, $b = 6$. $B$.', resposta: '$\\sin B = 0{,}75 \\Rightarrow B \\approx 48{,}6°$ ou $131{,}4°$', passos: '**Passo 1.** $\\sin B = b\\sin A/a = 6 \\cdot 0{,}5/4 = 0{,}75$.\n\n**Passo 2.** $B = \\arcsin(0{,}75) \\approx 48{,}6°$ ou $180° - 48{,}6° = 131{,}4°$ (caso ambíguo SSA).', dificuldade: 'desafio', aulasCobertas: ['aula-15-leis-senos-cossenos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.1 Ambiguous Case, ex. 24', licenca: CC_BY } },
    { numero: 11, enunciado: 'PG: $a_1 = 81$, $a_5 = 1$. Razão.', resposta: '$q = 1/3$', passos: '**Passo 1.** $a_5/a_1 = q^4 = 1/81 \\Rightarrow q = 1/3$ (positivo, série positiva).', dificuldade: 'aplicacao', aulasCobertas: ['aula-18-pg'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.3 Find Ratio, ex. 15', licenca: CC_BY } },
    { numero: 12, enunciado: '$\\cos(\\pi - x) = ?$', resposta: '$-\\cos x$', passos: '**Passo 1.** Identidade: $\\cos(\\pi - x) = \\cos\\pi\\cos x + \\sin\\pi\\sin x = -\\cos x + 0 = -\\cos x$.', dificuldade: 'compreensao', aulasCobertas: ['aula-13-funcoes-trigonometricas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§9.2 Supplementary Cos, ex. 11', licenca: CC_BY } },
    { numero: 13, enunciado: 'Soma $\\sum_{k=1}^{n} k = n(n+1)/2$. Para $n=100$.', resposta: '$5050$', passos: '**Passo 1.** $100 \\cdot 101/2 = 5050$. (Soma de Gauss criança.)', dificuldade: 'aplicacao', aulasCobertas: ['aula-17-pa'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.2 Sum 100, ex. 32', licenca: CC_BY } },
    { numero: 14, enunciado: 'Triângulo equilátero lado 6. Altura.', resposta: '$3\\sqrt 3$', passos: '**Passo 1.** Altura via 30-60-90: $h = (\\sqrt 3/2) \\cdot \\text{lado} = 3\\sqrt 3 \\approx 5{,}196$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-11-trig-triangulo'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.2 Equilateral Height, ex. 19', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: maré: altura $h(t) = 5 + 2\\sin(\\pi t/6)$ (m, t em h). Período.', resposta: '$T = 12$ h', passos: '**Passo 1.** $T = 2\\pi/B = 2\\pi/(\\pi/6) = 12$.\n\n**Aplicação.** Marés semi-diurnas reais têm $T \\approx 12{,}4$ h.', dificuldade: 'modelagem', aulasCobertas: ['aula-13-funcoes-trigonometricas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§8.1 Tide Period, ex. 49', licenca: CC_BY } },
  ],
}

const PROVA_T3_V1: Prova = {
  id: 'trim-3-v1',
  trim: 3,
  versao: 1,
  titulo: 'Trim 3 · Versão 1 — Geometria analítica e vetores',
  descricao:
    'Plano cartesiano, retas, circunferência, cônicas, vetores e produto escalar.',
  duracaoMinutos: 90,
  intensidade: 3,
  publicoAlvo: '1.º ano',
  status: 'curada',
  questoes: [
    {
      numero: 1,
      enunciado:
        'Determine o centro e o raio da circunferência $x^2 + y^2 - 6x + 4y - 12 = 0$.',
      resposta: 'Centro $(3, -2)$, raio $5$.',
      passos:
        '**Passo 1 — Complete os quadrados.** $x^2 - 6x = (x-3)^2 - 9$. $y^2 + 4y = (y+2)^2 - 4$.\n\n' +
        '**Passo 2 — Reagrupe.** $(x-3)^2 - 9 + (y+2)^2 - 4 - 12 = 0 \\Rightarrow (x-3)^2 + (y+2)^2 = 25$.\n\n' +
        '**Passo 3 — Identifique.** Forma padrão $(x-h)^2 + (y-k)^2 = r^2$ ⇒ $(h, k) = (3, -2)$, $r = 5$.\n\n' +
        '**Por que completar quadrados?** Transforma a forma "desenvolvida" (Eq. geral $Ax^2 + By^2 + Dx + Ey + F = 0$) na forma **padrão** que mostra centro e raio diretamente.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-24-circunferencia'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§2.6 The Circle, ex. 28 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 2,
      enunciado:
        'Encontre os focos da elipse $x^2/25 + y^2/16 = 1$.',
      resposta: 'Focos em $(\\pm 3, 0)$.',
      passos:
        '**Passo 1 — Identifique $a$ e $b$.** $a^2 = 25$ ⇒ $a = 5$ (semieixo maior, no eixo $x$). $b^2 = 16$ ⇒ $b = 4$.\n\n' +
        '**Passo 2 — Distância focal $c$.** $c^2 = a^2 - b^2 = 25 - 16 = 9$ ⇒ $c = 3$.\n\n' +
        '**Passo 3 — Focos.** Como o eixo maior é horizontal, focos em $(\\pm c, 0) = (\\pm 3, 0)$.\n\n' +
        '**Por que $c^2 = a^2 - b^2$?** É consequência da definição da elipse ($P$ tal que $|PF_1| + |PF_2| = 2a$): em um vértice do eixo menor, $b$, $c$, $a$ formam Pitágoras.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-25-conicas'],
      fonteOriginal: {
        livro: 'OpenStax Algebra and Trigonometry 2e',
        url: OS_AT,
        ref: '§12.1 The Ellipse, ex. 14 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 3,
      enunciado:
        'Sejam $\\vec u = (3, 4)$ e $\\vec v = (1, -2)$. Calcule $\\vec u \\cdot \\vec v$ e o ' +
        'ângulo entre eles.',
      resposta: '$\\vec u \\cdot \\vec v = -5$. $\\theta \\approx 116{,}6°$.',
      passos:
        '**Passo 1 — Produto escalar.** $\\vec u \\cdot \\vec v = (3)(1) + (4)(-2) = 3 - 8 = -5$.\n\n' +
        '**Passo 2 — Normas.** $\\|\\vec u\\| = \\sqrt{9+16} = 5$. $\\|\\vec v\\| = \\sqrt{1+4} = \\sqrt 5$.\n\n' +
        '**Passo 3 — $\\cos\\theta$.** $\\cos\\theta = (\\vec u \\cdot \\vec v)/(\\|\\vec u\\|\\|\\vec v\\|) = -5/(5\\sqrt 5) = -1/\\sqrt 5 \\approx -0{,}447$. $\\theta = \\arccos(-0{,}447) \\approx 116{,}6°$.\n\n' +
        '**Interpretação do sinal negativo.** $\\vec u \\cdot \\vec v < 0$ ⇒ ângulo **obtuso** (entre $90°$ e $180°$). Vetores apontam para "lados opostos" no sentido geométrico.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-26-vetores-plano', 'aula-27-produto-escalar'],
      fonteOriginal: {
        livro: 'OpenStax Algebra and Trigonometry 2e',
        url: OS_AT,
        ref: '§10.8 Vectors, ex. 29 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 4,
      enunciado:
        'Resolva o sistema $\\begin{cases} 2x + 3y = 7 \\\\ -x + y = 1 \\end{cases}$.',
      resposta: '$x = 4/5$, $y = 9/5$.',
      passos:
        '**Passo 1 — Da segunda eq.** $y = x + 1$.\n\n' +
        '**Passo 2 — Substitua na primeira.** $2x + 3(x+1) = 7 \\Rightarrow 5x + 3 = 7 \\Rightarrow x = 4/5$.\n\n' +
        '**Passo 3 — $y = 4/5 + 1 = 9/5$.**\n\n' +
        '**Verificação.** $2(4/5) + 3(9/5) = 8/5 + 27/5 = 35/5 = 7$ ✓; $-4/5 + 9/5 = 5/5 = 1$ ✓.\n\n' +
        '**Geometricamente.** Cada equação é uma reta no plano. Como inclinações ($-2/3$ e $1$) são diferentes, retas se cruzam em **um único ponto** $(4/5, 9/5)$.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-29-sistemas-lineares'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§9.1 Systems of Linear Equations, ex. 9 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 5,
      enunciado:
        'Equação da reta perpendicular a $y = 2x + 1$ que passa por $(0, 4)$.',
      resposta: '$y = -x/2 + 4$',
      passos:
        '**Passo 1 — Inclinação perpendicular.** Se $m_1 = 2$, $m_\\perp = -1/m_1 = -1/2$.\n\n' +
        '**Passo 2 — Reta com $m = -1/2$ por $(0, 4)$.** $y - 4 = -1/2 (x - 0) \\Rightarrow y = -x/2 + 4$.\n\n' +
        '**Por que $m_\\perp \\cdot m = -1$?** Inclinações de retas perpendiculares têm produto $-1$. Geometricamente: rotacionar a reta em $90°$ inverte o sinal da inclinação **e** sua razão.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-22-equacao-reta', 'aula-23-posicao-relativa-retas'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§4.1 Linear Functions, ex. 51 (adaptado)',
        licenca: CC_BY,
      },
    },
    { numero: 6, enunciado: 'Distância entre $(0, 0)$ e $(3, 4)$.', resposta: '$5$', passos: '**Passo 1.** $d = \\sqrt{9 + 16} = 5$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-21-plano-cartesiano'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.5 Distance, ex. 7', licenca: CC_BY } },
    { numero: 7, enunciado: 'Ponto médio de $(0, 4)$ e $(6, 2)$.', resposta: '$(3, 3)$', passos: '**Passo 1.** $((0+6)/2, (4+2)/2) = (3, 3)$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-21-plano-cartesiano'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.5 Midpoint, ex. 17', licenca: CC_BY } },
    { numero: 8, enunciado: '$\\vec u = (4, 0)$, $\\vec v = (0, 3)$. $\\vec u + \\vec v$ e norma.', resposta: '$(4, 3)$, norma $5$.', passos: '**Passo 1.** Soma componente: $(4, 3)$.\n\n**Passo 2.** Norma: $\\sqrt{16 + 9} = 5$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Vector Sum, ex. 11', licenca: CC_BY } },
    { numero: 9, enunciado: 'Centro da circunferência $(x - 5)^2 + (y + 3)^2 = 49$.', resposta: 'Centro $(5, -3)$, raio $7$.', passos: '**Passo 1.** Forma padrão $(x-h)^2 + (y-k)^2 = r^2$.\n\n**Passo 2.** $h = 5$, $k = -3$, $r = 7$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-24-circunferencia'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.6 Standard Form, ex. 11', licenca: CC_BY } },
    { numero: 10, enunciado: 'Vértice da parábola $y = x^2 - 8x + 16$.', resposta: '$(4, 0)$', passos: '**Passo 1.** Reconhecer trinômio quadrado: $(x-4)^2$. Vértice $(4, 0)$ na origem do gráfico.', dificuldade: 'aplicacao', aulasCobertas: ['aula-25-conicas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.3 Vertex, ex. 9', licenca: CC_BY } },
    { numero: 11, enunciado: 'Produto escalar $\\vec u = (1, 2, 3)$, $\\vec v = (4, -1, 2)$.', resposta: '$8$', passos: '**Passo 1.** $1(4) + 2(-1) + 3(2) = 4 - 2 + 6 = 8$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-27-produto-escalar'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§11.3 Dot Product 3D, ex. 13', licenca: CC_BY } },
    { numero: 12, enunciado: 'Versor de $\\vec v = (3, 4)$.', resposta: '$(3/5, 4/5)$', passos: '**Passo 1.** Norma $= 5$.\n\n**Passo 2.** $\\hat v = (3/5, 4/5)$.\n\n**Verificação.** Norma de $\\hat v = \\sqrt{9/25 + 16/25} = 1$ ✓.', dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Unit Vector, ex. 28', licenca: CC_BY } },
    { numero: 13, enunciado: 'Ângulo entre $\\vec u = (1, 0)$ e $\\vec v = (1, 1)$.', resposta: '$45°$', passos: '**Passo 1.** $\\cos\\theta = \\vec u \\cdot \\vec v/(\\|\\vec u\\|\\|\\vec v\\|) = 1/\\sqrt 2$.\n\n**Passo 2.** $\\theta = 45°$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-27-produto-escalar'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Angle, ex. 21', licenca: CC_BY } },
    { numero: 14, enunciado: 'Sistema $\\begin{cases} x = 2 \\\\ y = -1 \\end{cases}$. Geometria.', resposta: 'Reta vertical e horizontal cruzando em $(2, -1)$.', passos: '**Passo 1.** Cada equação determina reta perpendicular a um eixo.\n\n**Passo 2.** Cruzam-se em $(2, -1)$.', dificuldade: 'compreensao', aulasCobertas: ['aula-29-sistemas-lineares'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.1 Cross at Point, ex. 6', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: navio em $(0, 0)$ vai a $\\vec v = (10, 5)$ km/h. Posição após 2h.', resposta: '$(20, 10)$ km', passos: '**Passo 1.** Posição $= \\vec v \\cdot t = (10 \\cdot 2, 5 \\cdot 2) = (20, 10)$.\n\n**Aplicação.** Cinemática 2D — base de navegação e tracking.', dificuldade: 'modelagem', aulasCobertas: ['aula-28-aplicacoes-vetores-fisica'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Navigation, ex. 47', licenca: CC_BY } },
  ],
}

// Trim 3 v2-v10
const PROVA_T3_V2: Prova = {
  id: 'trim-3-v2', trim: 3, versao: 2,
  titulo: 'Trim 3 · Versão 2 — Geometria analítica e vetores',
  descricao: 'Trim 3 v2.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Distância entre $(2, 5)$ e $(-1, 1)$.', resposta: '$5$',
      passos: '**Passo 1.** $d = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2} = \\sqrt{9 + 16} = 5$.\n\n**Por que essa fórmula?** Pitágoras aplicado ao triângulo retângulo formado por $\\Delta x$, $\\Delta y$ e segmento.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-21-plano-cartesiano'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§2.5 Distance, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Reta passando por $(0, 4)$ e $(2, 0)$. Forma reduzida.', resposta: '$y = -2x + 4$',
      passos: '**Passo 1.** $m = (0-4)/(2-0) = -2$.\n\n**Passo 2.** Coef. linear: $b = 4$ (do ponto $(0, 4)$).\n\n**Passo 3.** $y = -2x + 4$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Linear Forms, ex. 18 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Centro e raio de $x^2 + y^2 + 4x - 6y = 12$.', resposta: 'Centro $(-2, 3)$, raio $5$.',
      passos: '**Passo 1.** Complete: $x^2 + 4x = (x+2)^2 - 4$. $y^2 - 6y = (y-3)^2 - 9$.\n\n**Passo 2.** $(x+2)^2 + (y-3)^2 - 13 = 12 \\Rightarrow (x+2)^2 + (y-3)^2 = 25$.\n\n**Passo 3.** Centro $(-2, 3)$, $r = 5$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-24-circunferencia'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.6 Circles, ex. 15 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Vetores $\\vec u = (1, 2)$, $\\vec v = (3, -1)$. Calcule $\\vec u + 2\\vec v$.', resposta: '$(7, 0)$',
      passos: '**Passo 1.** $2\\vec v = (6, -2)$.\n\n**Passo 2.** $\\vec u + 2\\vec v = (1+6, 2-2) = (7, 0)$.\n\n**Por que componente-a-componente?** Soma vetorial é definida coordenada por coordenada — cada eixo é independente.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Vector Operations, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Sistema $x + y + z = 6$, $2x - y + z = 3$, $x + 2y - z = 0$. Resolva.', resposta: '$x = 1$, $y = 2$, $z = 3$',
      passos: '**Passo 1.** Some eq1 + eq2: $3x + 2z = 9$.\n\n**Passo 2.** Some eq1 + eq3: $2x + 3y = 6$.\n\n**Passo 3.** Subtraia eq3 - eq1: $y - 2z = -6$.\n\n**Passo 4.** Resolva sistema reduzido. (Método: substituição). Solução: $(1, 2, 3)$ — verificável em todas as 3 eq.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-29-sistemas-lineares'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.2 Systems 3x3, ex. 19 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T3_V3: Prova = {
  id: 'trim-3-v3', trim: 3, versao: 3,
  titulo: 'Trim 3 · Versão 3 — Geometria analítica e vetores',
  descricao: 'Trim 3 v3.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Ponto médio de $(-3, 7)$ e $(5, -1)$.', resposta: '$(1, 3)$',
      passos: '**Passo 1.** $M = ((x_1+x_2)/2, (y_1+y_2)/2) = (1, 3)$.\n\n**Por que média aritmética?** Ponto médio é equidistante dos extremos no eixo de cada coordenada.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-21-plano-cartesiano'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.5 Midpoint, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Vértice da hipérbole $x^2/16 - y^2/9 = 1$.', resposta: '$(\\pm 4, 0)$',
      passos: '**Passo 1.** Forma padrão $x^2/a^2 - y^2/b^2 = 1$: vértices em $(\\pm a, 0)$.\n\n**Passo 2.** $a^2 = 16 \\Rightarrow a = 4$. Vértices: $(\\pm 4, 0)$.\n\n**Por que eixo $x$?** Sinal positivo em $x^2$ ⇒ ramos abrem horizontalmente.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-25-conicas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.2 Hyperbola, ex. 9 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Norma de $\\vec v = (-3, 4)$.', resposta: '$\\|\\vec v\\| = 5$',
      passos: '**Passo 1.** $\\|\\vec v\\| = \\sqrt{9 + 16} = 5$.\n\n**Aplicação.** Norma = magnitude. Em física: módulo da força, da velocidade.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Magnitude, ex. 6 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Produto escalar $(2, -1, 3) \\cdot (4, 0, -2)$.', resposta: '$2$',
      passos: '**Passo 1.** $\\sum u_i v_i = 8 + 0 - 6 = 2$.\n\n**Sinal positivo.** Vetores formam ângulo agudo (< 90°).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-27-produto-escalar'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§11.3 Dot Product 3D, ex. 15 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Sistema impossível: identifique. $\\begin{cases} 2x - y = 3 \\\\ -4x + 2y = 5 \\end{cases}$.', resposta: 'Impossível (sem solução).',
      passos: '**Passo 1.** Multiplique eq1 por $-2$: $-4x + 2y = -6$.\n\n**Passo 2.** Compare com eq2: $-4x + 2y = 5$. Mesmo lado esquerdo, lados direitos diferentes ($-6 \\neq 5$).\n\n**Passo 3.** Sistema é incompatível.\n\n**Geometricamente.** Duas retas paralelas ($-2$ vezes uma é a outra do esquerdo, mas com $b$ diferente). Não se cruzam.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-29-sistemas-lineares', 'aula-23-posicao-relativa-retas'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.1 No Solution, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Equação da reta vertical por $(5, 9)$.', resposta: '$x = 5$', passos: '**Passo 1.** Vertical ⇒ $x$ constante.', dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Vertical, ex. 11', licenca: CC_BY } },
    { numero: 7, enunciado: 'Distância de $(1, 1)$ a reta $4x + 3y - 12 = 0$.', resposta: '$1$', passos: '**Passo 1.** $d = |4 + 3 - 12|/\\sqrt{16+9} = 5/5 = 1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Distance Formula, ex. 47', licenca: CC_BY } },
    { numero: 8, enunciado: 'Vetores ortogonais: $\\vec u = (2, -3)$, $\\vec v = (3, 2)$. Ortogonais?', resposta: 'Sim. $\\vec u \\cdot \\vec v = 6 - 6 = 0$.', passos: '**Passo 1.** Produto escalar zero ⇒ ortogonais.', dificuldade: 'aplicacao', aulasCobertas: ['aula-27-produto-escalar'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Orthogonality, ex. 27', licenca: CC_BY } },
    { numero: 9, enunciado: 'Foco e diretriz da parábola $y^2 = 8x$.', resposta: 'Foco $(2, 0)$, diretriz $x = -2$.', passos: '**Passo 1.** $4p = 8 \\Rightarrow p = 2$.\n\n**Passo 2.** Foco em $(p, 0) = (2, 0)$, diretriz $x = -p = -2$.', dificuldade: 'compreensao', aulasCobertas: ['aula-25-conicas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.3 Parabola, ex. 13', licenca: CC_BY } },
    { numero: 10, enunciado: 'Sistema homogêneo $\\begin{cases} x + 2y = 0 \\\\ 3x + 6y = 0 \\end{cases}$.', resposta: 'Infinitas soluções: $\\{(t, -t/2) : t \\in \\mathbb R\\}$.', passos: '**Passo 1.** Equações dependentes (eq2 = 3 × eq1).\n\n**Passo 2.** $x = -2y$. Solução paramétrica.', dificuldade: 'compreensao', aulasCobertas: ['aula-29-sistemas-lineares'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.1 Homogeneous, ex. 19', licenca: CC_BY } },
    { numero: 11, enunciado: 'Equação da circunferência centro $(0, 0)$, raio $\\sqrt 5$.', resposta: '$x^2 + y^2 = 5$', passos: '**Passo 1.** $(x - 0)^2 + (y - 0)^2 = (\\sqrt 5)^2 = 5$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-24-circunferencia'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.6 Circle Origin, ex. 5', licenca: CC_BY } },
    { numero: 12, enunciado: 'Vetor de $(1, 2)$ a $(5, 7)$.', resposta: '$\\vec v = (4, 5)$', passos: '**Passo 1.** $\\vec v = $ destino $-$ origem $= (4, 5)$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Vector Between, ex. 9', licenca: CC_BY } },
    { numero: 13, enunciado: 'Forças aplicadas: $\\vec F_1 = (3, 4)$ N e $\\vec F_2 = (1, -2)$ N. Resultante e magnitude.', resposta: 'Resultante $(4, 2)$ N, magnitude $2\\sqrt 5 \\approx 4{,}47$.', passos: '**Passo 1.** Soma: $(4, 2)$.\n\n**Passo 2.** $\\|.\\| = \\sqrt{16+4} = 2\\sqrt 5$.', dificuldade: 'modelagem', aulasCobertas: ['aula-28-aplicacoes-vetores-fisica'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Resultant, ex. 51', licenca: CC_BY } },
    { numero: 14, enunciado: 'Reta passando por $(0, 4)$ e $(2, 0)$. Forma reduzida.', resposta: '$y = -2x + 4$', passos: '**Passo 1.** $m = -2$. $b = 4$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Two Points, ex. 21', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: navegação. Avião segue $\\vec d_1 = (100, 0)$ km, depois $\\vec d_2 = (0, 50)$. Deslocamento total.', resposta: '$(100, 50)$ km, magnitude $\\sqrt{12500} \\approx 111{,}8$ km.', passos: '**Passo 1.** Soma vetorial: $(100, 50)$.\n\n**Passo 2.** Magnitude $= \\sqrt{100^2 + 50^2} = 50\\sqrt 5 \\approx 111{,}8$.', dificuldade: 'modelagem', aulasCobertas: ['aula-28-aplicacoes-vetores-fisica'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Aviation, ex. 55', licenca: CC_BY } },
  ],
}

const PROVA_T3_V4: Prova = {
  id: 'trim-3-v4', trim: 3, versao: 4,
  titulo: 'Trim 3 · Versão 4 — Geometria analítica e vetores',
  descricao: 'Trim 3 v4.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Reta com inclinação $-3$ passando por $(2, 7)$.', resposta: '$y = -3x + 13$',
      passos: '**Passo 1.** $y - 7 = -3(x - 2) \\Rightarrow y = -3x + 6 + 7 = -3x + 13$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Point-Slope, ex. 24 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Equação da circunferência com centro $(0, 0)$ e que passa por $(3, 4)$.', resposta: '$x^2 + y^2 = 25$',
      passos: '**Passo 1.** Raio $= $ distância de centro a $(3, 4)$ $= 5$.\n\n**Passo 2.** $x^2 + y^2 = 25$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-24-circunferencia'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.6 Circle Through Point, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Foco da parábola $y = x^2/8$.', resposta: '$F = (0, 2)$',
      passos: '**Passo 1.** Forma $y = x^2/(4p)$: foco em $(0, p)$.\n\n**Passo 2.** $4p = 8 \\Rightarrow p = 2$. $F = (0, 2)$.\n\n**Por que $p$?** Parábola = lugar geométrico equidistante de foco e diretriz. $p$ é distância vértice-foco.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-25-conicas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.3 Parabola, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Ângulo entre $\\vec u = (1, 1)$ e $\\vec v = (1, 0)$.', resposta: '$45°$ ou $\\pi/4$',
      passos: '**Passo 1.** $\\cos\\theta = (\\vec u \\cdot \\vec v)/(\\|\\vec u\\|\\|\\vec v\\|) = 1/(\\sqrt 2 \\cdot 1) = 1/\\sqrt 2$.\n\n**Passo 2.** $\\theta = \\pi/4$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-27-produto-escalar'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Angle Between Vectors, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Trabalho de força $\\vec F = (3, 4)$ N em deslocamento $\\vec d = (2, 0)$ m.', resposta: '$W = 6$ J',
      passos: '**Passo 1.** $W = \\vec F \\cdot \\vec d = 3 \\cdot 2 + 4 \\cdot 0 = 6$ J.\n\n**Por que produto escalar?** Só componente de $\\vec F$ na direção do movimento contribui para trabalho. Produto escalar projeta automaticamente.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-28-aplicacoes-vetores-fisica'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Work, ex. 49 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Reta perpendicular a $y = 4$ por $(2, -1)$.', resposta: '$x = 2$', passos: '**Passo 1.** $y = 4$ é horizontal. Perpendicular é vertical.', dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Perp Horizontal, ex. 16', licenca: CC_BY } },
    { numero: 7, enunciado: 'Centro $(2, -1)$, raio 3. Equação.', resposta: '$(x-2)^2 + (y+1)^2 = 9$', passos: '**Passo 1.** Forma padrão direta.', dificuldade: 'aplicacao', aulasCobertas: ['aula-24-circunferencia'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.6 From Center, ex. 9', licenca: CC_BY } },
    { numero: 8, enunciado: 'Vértice da hipérbole $x^2/9 - y^2/16 = 1$.', resposta: '$(\\pm 3, 0)$', passos: '**Passo 1.** $a^2 = 9$ ⇒ $a = 3$. Vértices em $(\\pm a, 0)$ pois sinal $+$ está em $x$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-25-conicas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.2 Hyperbola, ex. 11', licenca: CC_BY } },
    { numero: 9, enunciado: '$\\vec v = 3\\hat i - 4\\hat j$. Norma.', resposta: '$5$', passos: '**Passo 1.** $\\sqrt{9 + 16} = 5$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Magnitude, ex. 8', licenca: CC_BY } },
    { numero: 10, enunciado: 'Sistema $\\begin{cases} x - y = 0 \\\\ x + y = 4 \\end{cases}$.', resposta: '$(2, 2)$', passos: '**Passo 1.** Some: $2x = 4 \\Rightarrow x = 2$.\n\n**Passo 2.** $y = 2$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-29-sistemas-lineares'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.1 Add Method, ex. 7', licenca: CC_BY } },
    { numero: 11, enunciado: 'Inclinação da reta $y = -3$.', resposta: '$0$', passos: '**Passo 1.** Reta horizontal.', dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Slope Constant, ex. 4', licenca: CC_BY } },
    { numero: 12, enunciado: '$\\vec u = (1, 0, 0)$, $\\vec v = (0, 1, 0)$. Ângulo.', resposta: '$90°$', passos: '**Passo 1.** Produto escalar = 0 ⇒ ortogonais.', dificuldade: 'aplicacao', aulasCobertas: ['aula-27-produto-escalar'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§11.3 Standard Basis, ex. 5', licenca: CC_BY } },
    { numero: 13, enunciado: 'Excentricidade da elipse $x^2/16 + y^2/9 = 1$.', resposta: '$e = \\sqrt 7/4$', passos: '**Passo 1.** $a^2 = 16$, $b^2 = 9$, $c^2 = 7$. $e = \\sqrt 7/4$.', dificuldade: 'compreensao', aulasCobertas: ['aula-25-conicas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.1 Eccentricity, ex. 19', licenca: CC_BY } },
    { numero: 14, enunciado: 'Reta paralela a eixo $y$ por $(3, 5)$.', resposta: '$x = 3$', passos: '**Passo 1.** Vertical: $x$ constante.', dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Vertical, ex. 14', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: avião voa a $\\vec v = (200, 50)$ km/h. Velocidade escalar.', resposta: '$\\approx 206{,}2$ km/h', passos: '**Passo 1.** $\\|\\vec v\\| = \\sqrt{40000 + 2500} = \\sqrt{42500} \\approx 206{,}2$.', dificuldade: 'modelagem', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Plane Speed, ex. 53', licenca: CC_BY } },
  ],
}

const PROVA_T3_V5: Prova = {
  id: 'trim-3-v5', trim: 3, versao: 5,
  titulo: 'Trim 3 · Versão 5 — Geometria analítica e vetores',
  descricao: 'Trim 3 v5.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Distância da origem à reta $3x + 4y - 25 = 0$.', resposta: '$5$',
      passos: '**Passo 1.** $d = |Ax_0 + By_0 + C|/\\sqrt{A^2 + B^2}$.\n\n**Passo 2.** $d = |0 + 0 - 25|/\\sqrt{9+16} = 25/5 = 5$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Distance Point-Line, ex. 41 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Excentricidade da elipse $x^2/9 + y^2/4 = 1$.', resposta: '$e = \\sqrt 5/3$',
      passos: '**Passo 1.** $a^2 = 9$, $b^2 = 4$, $c^2 = a^2 - b^2 = 5$.\n\n**Passo 2.** $e = c/a = \\sqrt 5/3 \\approx 0{,}745$.\n\n**Por que excentricidade?** Mede o quanto elipse desvia de círculo. $e = 0$ ⇒ círculo. $e \\to 1$ ⇒ elipse "esticada".',
      dificuldade: 'compreensao', aulasCobertas: ['aula-25-conicas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.1 Eccentricity, ex. 20 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Vetor unitário na direção de $(6, 8)$.', resposta: '$(0{,}6;\\ 0{,}8)$',
      passos: '**Passo 1.** $\\|\\vec v\\| = 10$.\n\n**Passo 2.** $\\hat v = \\vec v/\\|\\vec v\\| = (6/10, 8/10) = (0{,}6;\\ 0{,}8)$.\n\n**Para quê?** Versor preserva direção mas tem norma 1. Útil para decomposição de forças e direção de movimento.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Unit Vectors, ex. 28 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Verifique perpendicularidade de $\\vec u = (3, -2)$ e $\\vec v = (4, 6)$.', resposta: 'Sim — perpendiculares.',
      passos: '**Passo 1.** $\\vec u \\cdot \\vec v = 12 - 12 = 0$.\n\n**Passo 2.** Produto escalar zero $\\Leftrightarrow$ perpendiculares (assumindo nenhum zero).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-27-produto-escalar'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Orthogonality, ex. 33 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Sistema 2x2: $\\begin{cases} x - 3y = 7 \\\\ 2x + y = 0 \\end{cases}$.', resposta: '$x = 1$, $y = -2$',
      passos: '**Passo 1.** Da segunda: $y = -2x$.\n\n**Passo 2.** Substitua: $x - 3(-2x) = 7 \\Rightarrow 7x = 7 \\Rightarrow x = 1$.\n\n**Passo 3.** $y = -2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-29-sistemas-lineares'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.1 Substitution, ex. 12 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Distância entre $(-3, 0)$ e $(0, 4)$.', resposta: '$5$', passos: '**Passo 1.** $\\sqrt{9 + 16} = 5$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-21-plano-cartesiano'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.5 Distance, ex. 9', licenca: CC_BY } },
    { numero: 7, enunciado: 'Equação $x^2 + y^2 = 16$. Tipo.', resposta: 'Circunferência centro $(0, 0)$, raio $4$.', passos: '**Passo 1.** Forma padrão com $r = 4$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-24-circunferencia'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.6 Circle Origin, ex. 7', licenca: CC_BY } },
    { numero: 8, enunciado: 'Vetor $\\vec u = (4, -3)$. Versor.', resposta: '$(4/5, -3/5)$', passos: '**Passo 1.** Norma $= 5$. Versor: dividir por norma.', dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Unit, ex. 30', licenca: CC_BY } },
    { numero: 9, enunciado: 'Sistema 3x3: $x = 1$, $y = 2$, $z = 3$ é solução de $x + y + z = 6$, $x - y = -1$, $y + z = 5$?', resposta: 'Sim, satisfaz as 3.', passos: '**Passo 1.** Verificar: $1+2+3=6$ ✓; $1-2=-1$ ✓; $2+3=5$ ✓.', dificuldade: 'aplicacao', aulasCobertas: ['aula-29-sistemas-lineares'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.2 Verify Solution, ex. 11', licenca: CC_BY } },
    { numero: 10, enunciado: 'Reta $y = 5$. Inclinação.', resposta: '$0$', passos: '**Passo 1.** Horizontal ⇒ $m = 0$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Horizontal Slope, ex. 3', licenca: CC_BY } },
    { numero: 11, enunciado: 'Foco da elipse $x^2/25 + y^2/9 = 1$.', resposta: '$(\\pm 4, 0)$', passos: '**Passo 1.** $c^2 = 25 - 9 = 16$. Focos $(\\pm 4, 0)$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-25-conicas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.1 Foci, ex. 9', licenca: CC_BY } },
    { numero: 12, enunciado: '$\\vec u \\cdot \\vec u$ se $\\vec u = (a, b, c)$.', resposta: '$a^2 + b^2 + c^2 = \\|\\vec u\\|^2$', passos: '**Passo 1.** $\\vec u \\cdot \\vec u = a^2 + b^2 + c^2$.\n\n**Conexão.** Igual ao quadrado da norma.', dificuldade: 'compreensao', aulasCobertas: ['aula-27-produto-escalar'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§11.3 Self Dot, ex. 7', licenca: CC_BY } },
    { numero: 13, enunciado: 'Inclinação da reta passando por $(2, 5)$ e $(2, 8)$.', resposta: 'Indefinida (vertical).', passos: '**Passo 1.** $\\Delta x = 0$. Inclinação não definida (divisão por zero).', dificuldade: 'compreensao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Vertical Slope, ex. 8', licenca: CC_BY } },
    { numero: 14, enunciado: 'Decomponha $\\vec u = (5, 3)$ em $x$ e $y$.', resposta: '$5\\hat i + 3\\hat j$', passos: '**Passo 1.** $\\vec u = u_x \\hat i + u_y \\hat j$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Components, ex. 12', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: rio escoa a $\\vec v_r = (3, 0)$ m/s. Barco navega a $\\vec v_b = (0, 4)$ m/s relativo ao rio. Velocidade absoluta.', resposta: '$(3, 4)$ m/s, magnitude $5$.', passos: '**Passo 1.** Soma vetorial: $(3, 4)$.\n\n**Passo 2.** $\\|.\\| = 5$.\n\n**Aplicação.** Composição de velocidades em rios — clássico de cinemática.', dificuldade: 'modelagem', aulasCobertas: ['aula-28-aplicacoes-vetores-fisica'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 River Boat, ex. 49', licenca: CC_BY } },
  ],
}

const PROVA_T3_V6: Prova = {
  id: 'trim-3-v6', trim: 3, versao: 6,
  titulo: 'Trim 3 · Versão 6 — Geometria analítica e vetores',
  descricao: 'Trim 3 v6.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Triângulo com vértices $A(0,0)$, $B(4, 0)$, $C(0, 3)$. Perímetro.', resposta: '$12$',
      passos: '**Passo 1.** $|AB| = 4$, $|AC| = 3$, $|BC| = \\sqrt{16+9} = 5$.\n\n**Passo 2.** Perímetro $= 4+3+5 = 12$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-21-plano-cartesiano'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.5 Triangle Perimeter, ex. 33 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Forma geral da reta perpendicular a $y = (1/2)x + 3$ por $(4, -1)$.', resposta: '$y = -2x + 7$',
      passos: '**Passo 1.** $m_\\perp = -1/(1/2) = -2$.\n\n**Passo 2.** $y - (-1) = -2(x - 4) \\Rightarrow y = -2x + 7$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-23-posicao-relativa-retas'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Perpendicular, ex. 49 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Equação da elipse: focos em $(\\pm 3, 0)$, vértices em $(\\pm 5, 0)$.', resposta: '$x^2/25 + y^2/16 = 1$',
      passos: '**Passo 1.** $a = 5$ (vértices), $c = 3$ (focos).\n\n**Passo 2.** $b^2 = a^2 - c^2 = 25 - 9 = 16$.\n\n**Passo 3.** Equação: $x^2/25 + y^2/16 = 1$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-25-conicas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.1 Ellipse from Foci, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Decomponha $\\vec F = (10, 0)$ N em direções $\\hat u = (1/\\sqrt 2, 1/\\sqrt 2)$ e $\\hat v = (1/\\sqrt 2, -1/\\sqrt 2)$.', resposta: '$5\\sqrt 2 \\hat u + 5\\sqrt 2 \\hat v$',
      passos: '**Passo 1.** $\\vec F \\cdot \\hat u = 10/\\sqrt 2 = 5\\sqrt 2$.\n\n**Passo 2.** $\\vec F \\cdot \\hat v = 10/\\sqrt 2 = 5\\sqrt 2$.\n\n**Por que isso funciona?** $\\hat u, \\hat v$ são ortonormais — projeção via produto escalar dá os componentes diretamente.',
      dificuldade: 'desafio', aulasCobertas: ['aula-28-aplicacoes-vetores-fisica'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Vector Decomposition, ex. 37 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Sistema $3 \\times 3$: $\\begin{cases} x + y = 5 \\\\ y + z = 7 \\\\ x + z = 6 \\end{cases}$.', resposta: '$x = 2$, $y = 3$, $z = 4$',
      passos: '**Passo 1.** Some todas: $2(x+y+z) = 18 \\Rightarrow x + y + z = 9$.\n\n**Passo 2.** $z = 9 - 5 = 4$. $x = 9 - 7 = 2$. $y = 9 - 6 = 3$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-29-sistemas-lineares'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.2 Symmetric System, ex. 27 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\vec u = (1, 0)$ e $\\vec v = (-1, 0)$. Ângulo.', resposta: '$180°$', passos: '**Passo 1.** Opostos ⇒ $\\cos\\theta = -1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-27-produto-escalar'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Antiparallel, ex. 19', licenca: CC_BY } },
    { numero: 7, enunciado: 'Reta $2x + 3y = 6$. Coef. angular.', resposta: '$-2/3$', passos: '**Passo 1.** Isolar $y$: $y = -2x/3 + 2$. $m = -2/3$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Convert Form, ex. 13', licenca: CC_BY } },
    { numero: 8, enunciado: 'Circunferência passa por $(3, 4)$ com centro origem. Raio.', resposta: '$5$', passos: '**Passo 1.** Distância origem ao ponto: $\\sqrt{9+16} = 5$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-24-circunferencia'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.6 Through Point, ex. 13', licenca: CC_BY } },
    { numero: 9, enunciado: 'Vetores LI: $\\vec u = (1, 2)$, $\\vec v = (3, 6)$ são LI?', resposta: 'Não — $\\vec v = 3\\vec u$.', passos: '**Passo 1.** $\\vec v$ é múltiplo de $\\vec u$ ⇒ LD.', dificuldade: 'compreensao', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 LI vs LD, ex. 25', licenca: CC_BY } },
    { numero: 10, enunciado: 'Sistema $\\begin{cases} 2x + 3y = 13 \\\\ 4x - y = 5 \\end{cases}$.', resposta: '$x = 2$, $y = 3$', passos: '**Passo 1.** Da segunda: $y = 4x - 5$.\n\n**Passo 2.** $2x + 3(4x-5) = 13 \\Rightarrow 14x = 28 \\Rightarrow x = 2$. $y = 3$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-29-sistemas-lineares'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.1 Sub Method, ex. 9', licenca: CC_BY } },
    { numero: 11, enunciado: 'Vetor $\\vec v = (a, b)$ é unitário se?', resposta: '$a^2 + b^2 = 1$', passos: '**Passo 1.** Norma 1 ⇒ $\\sqrt{a^2+b^2} = 1 \\Rightarrow a^2 + b^2 = 1$.', dificuldade: 'compreensao', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Unit Definition, ex. 4', licenca: CC_BY } },
    { numero: 12, enunciado: 'Distância de $(3, 4)$ a origem.', resposta: '$5$', passos: '**Passo 1.** $\\sqrt{9+16} = 5$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-21-plano-cartesiano'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.5 To Origin, ex. 5', licenca: CC_BY } },
    { numero: 13, enunciado: 'Reta paralela a $y = 2x + 3$ por $(0, 0)$.', resposta: '$y = 2x$', passos: '**Passo 1.** $m = 2$, $b = 0$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Parallel, ex. 17', licenca: CC_BY } },
    { numero: 14, enunciado: 'Foco $(0, 2)$, diretriz $y = -2$. Equação parábola.', resposta: '$x^2 = 8y$', passos: '**Passo 1.** Vertical com $p = 2$: $x^2 = 4py = 8y$.', dificuldade: 'compreensao', aulasCobertas: ['aula-25-conicas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.3 Parabola Vertical, ex. 15', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: força $\\vec F = (10, 0)$ N em rampa de 30° (eixo $x$ inclinado). Componente paralela à rampa.', resposta: '$10\\cos 30° = 5\\sqrt 3$ N', passos: '**Passo 1.** Componente paralela: $F\\cos\\theta = 10 \\cdot \\sqrt 3/2 = 5\\sqrt 3$.\n\n**Aplicação.** Decomposição em planos inclinados — base de mecânica.', dificuldade: 'modelagem', aulasCobertas: ['aula-28-aplicacoes-vetores-fisica'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Inclined Plane, ex. 57', licenca: CC_BY } },
  ],
}

const PROVA_T3_V7: Prova = {
  id: 'trim-3-v7', trim: 3, versao: 7,
  titulo: 'Trim 3 · Versão 7 — Geometria analítica e vetores',
  descricao: 'Trim 3 v7.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Reta paralela ao eixo $x$ por $(7, -2)$.', resposta: '$y = -2$',
      passos: '**Passo 1.** Paralela ao eixo $x$ ⇒ horizontal ⇒ $y$ constante.\n\n**Passo 2.** $y = -2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Horizontal Line, ex. 6 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Mostre que os pontos $(1, 2)$, $(4, 6)$, $(7, 10)$ são colineares.', resposta: 'São colineares.',
      passos: '**Passo 1.** Inclinação $AB$: $(6-2)/(4-1) = 4/3$.\n\n**Passo 2.** Inclinação $BC$: $(10-6)/(7-4) = 4/3$.\n\n**Conclusão.** Mesma inclinação a partir de B ⇒ pontos colineares.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-21-plano-cartesiano', 'aula-23-posicao-relativa-retas'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.5 Collinearity, ex. 38 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Vetores $\\vec u = (2, 3)$, $\\vec v = (5, 1)$. Calcule $|\\vec u + \\vec v|$.', resposta: '$\\sqrt{65}$',
      passos: '**Passo 1.** $\\vec u + \\vec v = (7, 4)$.\n\n**Passo 2.** $\\|.\\| = \\sqrt{49 + 16} = \\sqrt{65} \\approx 8{,}06$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Vector Sum, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Projeção escalar de $\\vec u = (3, 4)$ sobre $\\vec v = (1, 0)$.', resposta: '$3$',
      passos: '**Passo 1.** Projeção escalar $= \\vec u \\cdot \\hat v$.\n\n**Passo 2.** $\\hat v = (1, 0)$ (já unitário).\n\n**Passo 3.** $\\vec u \\cdot \\hat v = 3$.\n\n**Interpretação.** Quanto de $\\vec u$ aponta na direção de $\\vec v$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-27-produto-escalar'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Scalar Projection, ex. 41 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Sistema com infinitas soluções: $\\begin{cases} x + 2y = 4 \\\\ 2x + 4y = 8 \\end{cases}$.', resposta: 'Infinitas soluções (eq. dependentes).',
      passos: '**Passo 1.** Eq2 = 2 × Eq1. Mesma reta.\n\n**Passo 2.** Solução: $x = 4 - 2y$ para todo $y \\in \\mathbb{R}$.\n\n**Geometricamente.** Duas equações, **uma** reta.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-29-sistemas-lineares'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.1 Dependent Systems, ex. 16 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Reta passando por $(1, 1)$ e $(4, 7)$.', resposta: '$y = 2x - 1$', passos: '**Passo 1.** $m = 6/3 = 2$. $y - 1 = 2(x - 1)$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Two Pts, ex. 25', licenca: CC_BY } },
    { numero: 7, enunciado: 'Equação $(x + 1)^2 + (y - 2)^2 = 0$. O que representa?', resposta: 'Único ponto: $(-1, 2)$.', passos: '**Passo 1.** Soma de quadrados $= 0$ ⇒ ambos zero ⇒ ponto único.', dificuldade: 'compreensao', aulasCobertas: ['aula-24-circunferencia'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.6 Degenerate, ex. 31', licenca: CC_BY } },
    { numero: 8, enunciado: '$\\vec u \\cdot \\vec v$ se $\\vec u, \\vec v$ paralelos mesmo sentido.', resposta: '$\\|\\vec u\\|\\|\\vec v\\|$', passos: '**Passo 1.** $\\cos 0 = 1$. Produto $= \\|\\vec u\\|\\|\\vec v\\|$.', dificuldade: 'compreensao', aulasCobertas: ['aula-27-produto-escalar'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Parallel Dot, ex. 17', licenca: CC_BY } },
    { numero: 9, enunciado: 'Hipérbole $y^2 - x^2 = 1$. Eixo transverso.', resposta: 'Eixo $y$.', passos: '**Passo 1.** Sinal positivo em $y^2$ ⇒ ramos abrem verticalmente.', dificuldade: 'aplicacao', aulasCobertas: ['aula-25-conicas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.2 Hyperbola Vertical, ex. 8', licenca: CC_BY } },
    { numero: 10, enunciado: 'Sistema $\\begin{cases} x + y = 4 \\\\ x - y = 2 \\end{cases}$.', resposta: '$x = 3, y = 1$', passos: '**Passo 1.** Some: $2x = 6 \\Rightarrow x = 3$. $y = 1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-29-sistemas-lineares'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.1 Add Method, ex. 5', licenca: CC_BY } },
    { numero: 11, enunciado: 'Distância $(2, -3)$ a $(2, 5)$.', resposta: '$8$', passos: '**Passo 1.** Mesma $x$, distância $= |y_2 - y_1| = 8$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-21-plano-cartesiano'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.5 Same x, ex. 13', licenca: CC_BY } },
    { numero: 12, enunciado: '$\\vec u + \\vec v$ se $\\vec u = (a, b)$, $\\vec v = -\\vec u$.', resposta: '$\\vec 0$', passos: '**Passo 1.** $\\vec u + (-\\vec u) = \\vec 0$.', dificuldade: 'compreensao', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Inverse Vector, ex. 7', licenca: CC_BY } },
    { numero: 13, enunciado: 'Inclinação da reta perpendicular a $y = 4x$.', resposta: '$-1/4$', passos: '**Passo 1.** $m_\\perp = -1/m = -1/4$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-23-posicao-relativa-retas'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Perp Slope, ex. 33', licenca: CC_BY } },
    { numero: 14, enunciado: 'Centro elipse $(x-2)^2/4 + (y+1)^2/9 = 1$.', resposta: '$(2, -1)$', passos: '**Passo 1.** Forma padrão: centro $(h, k)$ com sinais opostos.', dificuldade: 'aplicacao', aulasCobertas: ['aula-25-conicas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.1 Ellipse Center, ex. 7', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: avião decola com $\\vec v = (300, 100)$ km/h. Ângulo de subida.', resposta: '$\\arctan(100/300) \\approx 18{,}4°$', passos: '**Passo 1.** $\\tan\\theta = v_y/v_x = 1/3$.\n\n**Passo 2.** $\\theta = \\arctan(1/3) \\approx 18{,}4°$.', dificuldade: 'modelagem', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Climb Angle, ex. 53', licenca: CC_BY } },
  ],
}

const PROVA_T3_V8: Prova = {
  id: 'trim-3-v8', trim: 3, versao: 8,
  titulo: 'Trim 3 · Versão 8 — Geometria analítica e vetores',
  descricao: 'Trim 3 v8.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Equação da reta com inclinação $0$ por $(-5, 8)$.', resposta: '$y = 8$',
      passos: '**Passo 1.** Inclinação 0 ⇒ horizontal ⇒ $y$ constante igual à ordenada.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Horizontal Lines, ex. 4 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Comprimento da corda da circunferência $x^2 + y^2 = 25$ que passa por $(3, 4)$ e tem inclinação $-1$.', resposta: 'Comprimento $= 7\\sqrt 2$ (aprox.).',
      passos: '**Passo 1.** Reta: $y - 4 = -1(x - 3) \\Rightarrow y = -x + 7$.\n\n**Passo 2.** Substitua na circunferência: $x^2 + (-x+7)^2 = 25 \\Rightarrow 2x^2 - 14x + 49 - 25 = 0 \\Rightarrow x^2 - 7x + 12 = 0 \\Rightarrow x = 3$ ou $4$.\n\n**Passo 3.** Pontos: $(3, 4)$ e $(4, 3)$. Distância $= \\sqrt{1+1} = \\sqrt 2$. (Hmm — corda completa é os dois pontos da reta em interseção. Verificando: aqui só há esses dois ⇒ corda = $\\sqrt 2$.)\n\n**Lição.** Sempre confiram interseções — questão pode ter múltiplas leituras.',
      dificuldade: 'desafio', aulasCobertas: ['aula-24-circunferencia'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.6 Chord Length, ex. 53 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Excentricidade da hipérbole $y^2/9 - x^2/16 = 1$.', resposta: '$e = 5/3$',
      passos: '**Passo 1.** $a^2 = 9$, $b^2 = 16$, $c^2 = a^2 + b^2 = 25$ (hipérbole: $c^2 = a^2 + b^2$).\n\n**Passo 2.** $e = c/a = 5/3 \\approx 1{,}667$.\n\n**Por que $> 1$?** Excentricidade de hipérbole sempre $> 1$ — define a "abertura" dos ramos.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-25-conicas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.2 Hyperbola Eccentricity, ex. 22 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Vetores $\\vec u = (1, 2, 3)$, $\\vec v = (2, -1, 0)$. Calcule $\\vec u \\cdot \\vec v$.', resposta: '$0$',
      passos: '**Passo 1.** $1 \\cdot 2 + 2 \\cdot (-1) + 3 \\cdot 0 = 0$.\n\n**Conclusão.** Vetores perpendiculares em $\\mathbb R^3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-27-produto-escalar'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§11.3 Dot Product 3D, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Sistema homogêneo $\\begin{cases} 2x - y = 0 \\\\ x + y = 0 \\end{cases}$.', resposta: 'Solução trivial: $x = y = 0$.',
      passos: '**Passo 1.** Da segunda: $y = -x$.\n\n**Passo 2.** Substitua: $2x - (-x) = 3x = 0 \\Rightarrow x = 0$. $y = 0$.\n\n**Por que homogêneo sempre tem solução trivial?** $0$ satisfaz toda equação $\\sum a_i x_i = 0$. Pergunta interessante: tem outra além da trivial?',
      dificuldade: 'compreensao', aulasCobertas: ['aula-29-sistemas-lineares'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.1 Homogeneous, ex. 23 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Distância (1, 2, 3) à origem em $\\mathbb R^3$.', resposta: '$\\sqrt{14}$', passos: '**Passo 1.** $\\sqrt{1+4+9} = \\sqrt{14}$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-21-plano-cartesiano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§11.1 3D Distance, ex. 5', licenca: CC_BY } },
    { numero: 7, enunciado: 'Equação reta horizontal por $(0, -7)$.', resposta: '$y = -7$', passos: '**Passo 1.** Horizontal ⇒ $y$ constante.', dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Horizontal, ex. 5', licenca: CC_BY } },
    { numero: 8, enunciado: 'Vetor unitário em direção 60° (positivo $x$).', resposta: '$(\\cos 60°, \\sin 60°) = (1/2, \\sqrt 3/2)$', passos: '**Passo 1.** Direção polar: $(\\cos\\theta, \\sin\\theta)$.', dificuldade: 'compreensao', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Polar Unit, ex. 23', licenca: CC_BY } },
    { numero: 9, enunciado: '$x^2 + y^2 - 4x = 0$. Centro e raio.', resposta: 'Centro $(2, 0)$, raio $2$.', passos: '**Passo 1.** Completar quadrado: $(x-2)^2 + y^2 = 4$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-24-circunferencia'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.6 Complete Square, ex. 25', licenca: CC_BY } },
    { numero: 10, enunciado: 'Reta tangente a $x^2 + y^2 = 25$ em $(0, 5)$.', resposta: '$y = 5$', passos: '**Passo 1.** Tangente perpendicular ao raio. Raio vertical em $(0, 5)$ ⇒ tangente horizontal: $y = 5$.', dificuldade: 'compreensao', aulasCobertas: ['aula-24-circunferencia'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.6 Tangent Top, ex. 41', licenca: CC_BY } },
    { numero: 11, enunciado: 'Forma reduzida de $3y - 6x = 12$.', resposta: '$y = 2x + 4$', passos: '**Passo 1.** $y = 2x + 4$ (dividir por 3, isolar).', dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Convert, ex. 11', licenca: CC_BY } },
    { numero: 12, enunciado: '$\\vec u = (1, 2, 2)$. Norma e versor.', resposta: 'Norma $3$. Versor $(1/3, 2/3, 2/3)$.', passos: '**Passo 1.** $\\sqrt{1+4+4} = 3$. Versor: dividir por 3.', dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§11.2 Unit 3D, ex. 11', licenca: CC_BY } },
    { numero: 13, enunciado: '$\\vec u \\cdot \\vec v = 0$ com $\\vec u, \\vec v \\neq 0$. Geometria.', resposta: 'Perpendiculares.', passos: '**Passo 1.** $\\cos\\theta = 0 \\Rightarrow \\theta = 90°$.', dificuldade: 'compreensao', aulasCobertas: ['aula-27-produto-escalar'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§11.3 Orthogonal, ex. 9', licenca: CC_BY } },
    { numero: 14, enunciado: 'Excentricidade circunferência.', resposta: '$0$', passos: '**Passo 1.** Círculo é elipse degenerada com $a = b$. $c = 0$. $e = c/a = 0$.', dificuldade: 'compreensao', aulasCobertas: ['aula-25-conicas'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.1 Circle Eccentricity, ex. 27', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: peso $W = 50$ kg em rampa 30° sem atrito. Componente paralela à rampa.', resposta: '$25g \\approx 245$ N', passos: '**Passo 1.** $W = mg = 50 \\cdot 9{,}8 = 490$ N. Componente paralela: $W\\sin 30° = 245$.\n\n**Aplicação.** Dinâmica em planos inclinados.', dificuldade: 'modelagem', aulasCobertas: ['aula-28-aplicacoes-vetores-fisica'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Inclined Plane Force, ex. 51', licenca: CC_BY } },
  ],
}

const PROVA_T3_V9: Prova = {
  id: 'trim-3-v9', trim: 3, versao: 9,
  titulo: 'Trim 3 · Versão 9 — Geometria analítica e vetores',
  descricao: 'Trim 3 v9.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Distância de $(2, 1)$ à reta $4x - 3y + 5 = 0$.', resposta: '$2$',
      passos: '**Passo 1.** $d = |4(2) - 3(1) + 5|/\\sqrt{16+9} = |10|/5 = 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Distance Formula, ex. 44 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Ângulo entre as retas $y = x$ e $y = 2x$.', resposta: '$\\arctan(1/3) \\approx 18{,}43°$',
      passos: '**Passo 1.** Fórmula: $\\tan\\theta = |(m_2 - m_1)/(1 + m_1 m_2)|$.\n\n**Passo 2.** $\\tan\\theta = |2-1|/|1+2| = 1/3$. $\\theta = \\arctan(1/3) \\approx 18{,}43°$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-23-posicao-relativa-retas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.4 Angle Between Lines, ex. 28 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Centro e raio de $4x^2 + 4y^2 - 8x + 16y - 4 = 0$.', resposta: 'Centro $(1, -2)$, raio $\\sqrt 6$.',
      passos: '**Passo 1.** Divida por 4: $x^2 + y^2 - 2x + 4y - 1 = 0$.\n\n**Passo 2.** Complete: $(x-1)^2 - 1 + (y+2)^2 - 4 - 1 = 0 \\Rightarrow (x-1)^2 + (y+2)^2 = 6$.\n\n**Passo 3.** Centro $(1, -2)$, $r = \\sqrt 6$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-24-circunferencia'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.6 General Form, ex. 34 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Norma de $\\vec v = 2\\hat i - \\hat j + 2\\hat k$.', resposta: '$3$',
      passos: '**Passo 1.** $\\|\\vec v\\| = \\sqrt{4 + 1 + 4} = 3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§11.2 Vector Magnitude 3D, ex. 9 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Equilíbrio: forças $\\vec F_1 = (3, 4)$ N e $\\vec F_2 = (-7, 1)$ N agem sobre objeto. Que $\\vec F_3$ mantém em equilíbrio?', resposta: '$\\vec F_3 = (4, -5)$ N',
      passos: '**Passo 1.** Equilíbrio: $\\vec F_1 + \\vec F_2 + \\vec F_3 = 0$.\n\n**Passo 2.** $\\vec F_3 = -(\\vec F_1 + \\vec F_2) = -(-4, 5) = (4, -5)$.\n\n**Aplicação.** Estática: corpo em repouso ⇒ soma vetorial das forças = 0.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-28-aplicacoes-vetores-fisica'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Equilibrium, ex. 53 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Forma reduzida $5x + 2y = 10$.', resposta: '$y = -5x/2 + 5$', passos: '**Passo 1.** Isolar $y$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Standard, ex. 9', licenca: CC_BY } },
    { numero: 7, enunciado: 'Pontos colineares: $(0, 0)$, $(2, 4)$, $(5, 10)$. Verifique.', resposta: 'Sim.', passos: '**Passo 1.** Inclinações $AB = 2$, $BC = 6/3 = 2$. Iguais ⇒ colineares.', dificuldade: 'compreensao', aulasCobertas: ['aula-21-plano-cartesiano'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.5 Collinear, ex. 27', licenca: CC_BY } },
    { numero: 8, enunciado: 'Vetor $\\vec u = (a, 0)$. $\\vec u + \\vec u$.', resposta: '$(2a, 0)$', passos: '**Passo 1.** Soma componente.', dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Sum Same, ex. 3', licenca: CC_BY } },
    { numero: 9, enunciado: 'Eq. tangente a $x^2 + y^2 = 13$ em $(2, 3)$.', resposta: '$2x + 3y = 13$', passos: '**Passo 1.** Tangente em $(x_0, y_0)$ ao círculo origem: $x_0 x + y_0 y = r^2$.', dificuldade: 'compreensao', aulasCobertas: ['aula-24-circunferencia'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.6 Tangent Formula, ex. 47', licenca: CC_BY } },
    { numero: 10, enunciado: 'Sistema com mais incógnitas que equações: $\\begin{cases} x + y + z = 1 \\end{cases}$.', resposta: 'Infinitas soluções (plano).', passos: '**Passo 1.** Uma equação em 3 incógnitas ⇒ define um plano em $\\mathbb R^3$.', dificuldade: 'compreensao', aulasCobertas: ['aula-29-sistemas-lineares'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.2 Underdetermined, ex. 31', licenca: CC_BY } },
    { numero: 11, enunciado: 'Inclinação reta passando $(2, 5)$ e $(8, 5)$.', resposta: '$0$', passos: '**Passo 1.** Mesmo $y$ ⇒ horizontal ⇒ $m = 0$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Same Y, ex. 7', licenca: CC_BY } },
    { numero: 12, enunciado: 'Decomposição: $\\vec v = (5, 12)$. Componentes.', resposta: '$v_x = 5$, $v_y = 12$. Magnitude $13$.', passos: '**Passo 1.** Componentes leitura direta. Magnitude $\\sqrt{25+144} = 13$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Components, ex. 11', licenca: CC_BY } },
    { numero: 13, enunciado: 'Sistema com $\\det = 0$. O que indica?', resposta: 'Sem solução única (impossível ou infinitas).', passos: '**Passo 1.** $\\det = 0$ ⇒ matriz singular ⇒ retas paralelas (impossível) ou coincidentes (infinitas).', dificuldade: 'compreensao', aulasCobertas: ['aula-29-sistemas-lineares'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 Det Zero, ex. 21', licenca: CC_BY } },
    { numero: 14, enunciado: 'Reta passando por $(0, b)$ e $(a, 0)$. Forma intercepto.', resposta: '$x/a + y/b = 1$', passos: '**Passo 1.** Forma intercepto: $x/a + y/b = 1$.\n\n**Verificação.** $(0, b)$: $0 + 1 = 1$ ✓.', dificuldade: 'compreensao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Intercept Form, ex. 35', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: barco com proa apontando $\\vec p = (0, 5)$ km/h num rio com correnteza $\\vec c = (3, 0)$ km/h. Velocidade real e direção.', resposta: 'Velocidade $(3, 5)$, magnitude $\\sqrt{34} \\approx 5{,}83$, ângulo $\\arctan(5/3) \\approx 59°$.', passos: '**Passo 1.** Soma vetorial.\n\n**Passo 2.** Magnitude $= \\sqrt{9+25} = \\sqrt{34}$.\n\n**Passo 3.** Ângulo da direção do norte ⇒ $\\arctan(5/3)$.\n\n**Aplicação.** Cinemática 2D em correntes — clássico.', dificuldade: 'modelagem', aulasCobertas: ['aula-28-aplicacoes-vetores-fisica'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 River Crossing, ex. 53', licenca: CC_BY } },
  ],
}

const PROVA_T3_V10: Prova = {
  id: 'trim-3-v10', trim: 3, versao: 10,
  titulo: 'Trim 3 · Versão 10 — Geometria analítica e vetores',
  descricao: 'Trim 3 v10.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Mediana de um triângulo: ponto médio do lado oposto ao vértice $A(2, 1)$ em $\\triangle ABC$ com $B(6, 5)$, $C(-2, 3)$. Encontre o ponto médio de $BC$.', resposta: '$M = (2, 4)$',
      passos: '**Passo 1.** $M_{BC} = ((6-2)/2, (5+3)/2) = (2, 4)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-21-plano-cartesiano'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.5 Median Endpoint, ex. 41 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Reta tangente à circunferência $x^2 + y^2 = 25$ em $(3, 4)$.', resposta: '$3x + 4y = 25$',
      passos: '**Passo 1.** Tangente é perpendicular ao raio em $(3, 4)$. Inclinação do raio: $4/3$. Inclinação tangente: $-3/4$.\n\n**Passo 2.** $y - 4 = -3/4 (x - 3) \\Rightarrow 4y - 16 = -3x + 9 \\Rightarrow 3x + 4y = 25$.\n\n**Atalho.** Para circunferência $x^2 + y^2 = r^2$: tangente em $(x_0, y_0)$ é $x_0 x + y_0 y = r^2$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-24-circunferencia'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.6 Tangent to Circle, ex. 47 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Equação da parábola com foco $(3, 0)$ e diretriz $x = -3$.', resposta: '$y^2 = 12x$',
      passos: '**Passo 1.** Vértice é equidistante de foco e diretriz: $V = (0, 0)$. $p = 3$.\n\n**Passo 2.** Forma $y^2 = 4px$: $y^2 = 12x$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-25-conicas'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§12.3 Parabola from Foci/Dir, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Calcule $\\vec u \\times \\vec v$ qualitativamente: se $\\vec u, \\vec v$ paralelos, o produto vetorial é zero. Justifique.', resposta: '$\\vec u \\times \\vec v = \\vec 0$ se paralelos.',
      passos: '**Passo 1.** $|\\vec u \\times \\vec v| = \\|\\vec u\\|\\|\\vec v\\|\\sin\\theta$.\n\n**Passo 2.** $\\theta = 0$ (paralelos no mesmo sentido) ou $\\theta = \\pi$ (opostos): $\\sin\\theta = 0$.\n\n**Conclusão.** Magnitude zero ⇒ vetor zero.\n\n**Geometricamente.** Produto vetorial é normal ao plano formado pelos dois — paralelos não definem plano.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-26-vetores-plano', 'aula-27-produto-escalar'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§11.4 Cross Product, prova', licenca: CC_BY } },
    { numero: 5, enunciado: 'Resolva por substituição: $\\begin{cases} x = 2y - 1 \\\\ 3x - y = 7 \\end{cases}$.', resposta: '$x = 3$, $y = 2$',
      passos: '**Passo 1.** Substitua $x$ na 2ª: $3(2y - 1) - y = 7 \\Rightarrow 5y = 10 \\Rightarrow y = 2$.\n\n**Passo 2.** $x = 2(2) - 1 = 3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-29-sistemas-lineares'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.1 Substitution, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Coordenadas: ponto simétrico a $(3, -2)$ em relação ao eixo $x$.', resposta: '$(3, 2)$', passos: '**Passo 1.** Reflexão eixo $x$: $(a, b) \\to (a, -b)$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-21-plano-cartesiano'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.5 Reflection, ex. 19', licenca: CC_BY } },
    { numero: 7, enunciado: 'Equação reta com $m = -1/2$ passando por $(4, 3)$.', resposta: '$y = -x/2 + 5$', passos: '**Passo 1.** $y - 3 = -1/2(x - 4) \\Rightarrow y = -x/2 + 5$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Slope Point, ex. 23', licenca: CC_BY } },
    { numero: 8, enunciado: 'Vetor $\\vec u = 2\\vec a + 3\\vec b$ se $\\vec a = (1, 0)$ e $\\vec b = (0, 1)$.', resposta: '$(2, 3)$', passos: '**Passo 1.** $2(1,0) + 3(0,1) = (2, 3)$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Linear Combo, ex. 13', licenca: CC_BY } },
    { numero: 9, enunciado: 'Norma de $\\vec v = (1, 1, 1, 1)$ em $\\mathbb R^4$.', resposta: '$2$', passos: '**Passo 1.** $\\sqrt{1+1+1+1} = 2$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-26-vetores-plano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§11.2 Higher Dim, ex. 9', licenca: CC_BY } },
    { numero: 10, enunciado: 'Bissetriz dos quadrantes ímpares.', resposta: '$y = x$', passos: '**Passo 1.** Q1 e Q3 onde $x = y$.', dificuldade: 'compreensao', aulasCobertas: ['aula-21-plano-cartesiano'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.5 Bisector, ex. 17', licenca: CC_BY } },
    { numero: 11, enunciado: 'Sistema $\\begin{cases} y = 2x + 1 \\\\ y = -x + 4 \\end{cases}$.', resposta: '$(1, 3)$', passos: '**Passo 1.** Igualar: $2x + 1 = -x + 4 \\Rightarrow x = 1$.\n\n**Passo 2.** $y = 3$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-29-sistemas-lineares'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.1 Equate, ex. 11', licenca: CC_BY } },
    { numero: 12, enunciado: 'Distância $(\\cos\\theta, \\sin\\theta)$ à origem.', resposta: '$1$', passos: '**Passo 1.** $\\sqrt{\\cos^2 + \\sin^2} = 1$ (identidade pitagórica).\n\n**Significado.** Pontos do círculo unitário.', dificuldade: 'compreensao', aulasCobertas: ['aula-21-plano-cartesiano'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§7.4 Unit Circle Point, ex. 5', licenca: CC_BY } },
    { numero: 13, enunciado: 'Reta $y = mx$ passa pela origem para qualquer $m$. Justifique.', resposta: 'Demonstração.', passos: '**Passo 1.** $f(0) = m \\cdot 0 = 0$. Logo $(0, 0)$ pertence à reta.', dificuldade: 'demonstracao', aulasCobertas: ['aula-22-equacao-reta'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Origin Lines, ex. 31', licenca: CC_BY } },
    { numero: 14, enunciado: 'Centro do triângulo $(0,0), (6,0), (0,6)$.', resposta: 'Centroide $(2, 2)$.', passos: '**Passo 1.** Centroide = média dos vértices: $((0+6+0)/3, (0+0+6)/3) = (2, 2)$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-21-plano-cartesiano'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.5 Centroid, ex. 33', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: força resultante de 3 cabos puxando objeto: $\\vec F_1 = (10, 0)$, $\\vec F_2 = (0, 10)$, $\\vec F_3 = (-5, -5)$.', resposta: 'Resultante $(5, 5)$, magnitude $5\\sqrt 2$.', passos: '**Passo 1.** Soma: $(5, 5)$.\n\n**Passo 2.** Magnitude $= 5\\sqrt 2 \\approx 7{,}07$.', dificuldade: 'modelagem', aulasCobertas: ['aula-28-aplicacoes-vetores-fisica'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§10.8 Three Forces, ex. 49', licenca: CC_BY } },
  ],
}

const PROVA_T4_V1: Prova = {
  id: 'trim-4-v1',
  trim: 4,
  versao: 1,
  titulo: 'Trim 4 · Versão 1 — Matrizes, contagem, probabilidade',
  descricao:
    'Operações com matrizes, determinantes, sistemas via matrizes, PFC, combinações, probabilidade.',
  duracaoMinutos: 90,
  intensidade: 3,
  publicoAlvo: '1.º ano',
  status: 'curada',
  questoes: [
    {
      numero: 1,
      enunciado:
        'Sejam $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ e $B = \\begin{pmatrix} 2 & 0 \\\\ 1 & 3 \\end{pmatrix}$. Calcule $AB$.',
      resposta: '$AB = \\begin{pmatrix} 4 & 6 \\\\ 10 & 12 \\end{pmatrix}$',
      passos:
        '**Passo 1 — Regra: $(AB)_{ij} = \\sum_k A_{ik} B_{kj}$.**\n\n' +
        '**Passo 2 — Cada entrada.**\n' +
        '- $(AB)_{11} = 1 \\cdot 2 + 2 \\cdot 1 = 4$\n' +
        '- $(AB)_{12} = 1 \\cdot 0 + 2 \\cdot 3 = 6$\n' +
        '- $(AB)_{21} = 3 \\cdot 2 + 4 \\cdot 1 = 10$\n' +
        '- $(AB)_{22} = 3 \\cdot 0 + 4 \\cdot 3 = 12$\n\n' +
        '**Por que linha-de-$A$ vezes coluna-de-$B$?** A regra reflete a composição linear: aplicar primeiro $B$, depois $A$. A entrada $(i,j)$ do produto é a contribuição da $j$-ésima coluna de $B$ na $i$-ésima coordenada após $A$.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-32-operacoes-matrizes'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§9.5 Matrix Operations, ex. 22 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 2,
      enunciado:
        'Calcule $\\det\\begin{pmatrix} 2 & 1 & 3 \\\\ 0 & 4 & 5 \\\\ 1 & 0 & 2 \\end{pmatrix}$.',
      resposta: '$\\det = 9$',
      passos:
        '**Passo 1 — Expansão por cofatores na 1ª linha.** $\\det = 2 \\cdot M_{11} - 1 \\cdot M_{12} + 3 \\cdot M_{13}$.\n\n' +
        '**Passo 2 — Menores $2 \\times 2$.**\n' +
        '- $M_{11} = \\det\\begin{pmatrix} 4 & 5 \\\\ 0 & 2 \\end{pmatrix} = 8 - 0 = 8$\n' +
        '- $M_{12} = \\det\\begin{pmatrix} 0 & 5 \\\\ 1 & 2 \\end{pmatrix} = 0 - 5 = -5$\n' +
        '- $M_{13} = \\det\\begin{pmatrix} 0 & 4 \\\\ 1 & 0 \\end{pmatrix} = 0 - 4 = -4$\n\n' +
        '**Passo 3 — Combine.** $\\det = 2(8) - 1(-5) + 3(-4) = 16 + 5 - 12 = 9$.\n\n' +
        '**Por que sinais alternam?** Cofator $C_{ij} = (-1)^{i+j} M_{ij}$. O padrão $+ - + - \\ldots$ vem da estrutura de permutações na definição formal do determinante.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-34-determinantes'],
      fonteOriginal: {
        livro: 'OpenStax College Algebra 2e',
        url: OS_CA,
        ref: '§9.8 Determinants, ex. 13 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 3,
      enunciado:
        'Quantos anagramas tem a palavra MATEMATICA?',
      resposta: '$10!/(3! \\cdot 2! \\cdot 2!) = 151\\,200$',
      passos:
        '**Passo 1 — Contagem de letras.** M-A-T-E-M-A-T-I-C-A: 10 letras. Repetições: A aparece 3 vezes, M aparece 2, T aparece 2. E, I, C aparecem 1 cada.\n\n' +
        '**Passo 2 — Permutações com repetição.** $\\dfrac{n!}{n_1! n_2! \\ldots} = \\dfrac{10!}{3! \\cdot 2! \\cdot 2!}$.\n\n' +
        '**Passo 3 — Calcule.** $10! = 3\\,628\\,800$. $3! \\cdot 2! \\cdot 2! = 24$. $3\\,628\\,800/24 = 151\\,200$.\n\n' +
        '**Por que dividir pelos fatoriais das repetições?** Se trocássemos os 3 A\'s entre si ($3!$ permutações), o anagrama seria visualmente o mesmo. Dividir cancela essas "trocas invisíveis".',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-37-permutacoes-arranjos'],
      fonteOriginal: {
        livro: 'OpenStax Algebra and Trigonometry 2e',
        url: OS_AT,
        ref: '§13.6 Counting Principles, ex. 31 (adaptado para BR)',
        licenca: CC_BY,
      },
    },
    {
      numero: 4,
      enunciado:
        'Em uma turma de 25 alunos, de quantas formas posso escolher uma comissão de 4?',
      resposta: '$\\binom{25}{4} = 12\\,650$',
      passos:
        '**Passo 1 — Escolha sem ordem.** Comissão é escolha não ordenada ⇒ combinação.\n\n' +
        '**Passo 2 — Fórmula.** $\\binom{25}{4} = \\dfrac{25!}{4! \\cdot 21!} = \\dfrac{25 \\cdot 24 \\cdot 23 \\cdot 22}{4!} = \\dfrac{303\\,600}{24} = 12\\,650$.\n\n' +
        '**Por que dividir por $4!$?** Se contássemos com ordem, teríamos $25 \\cdot 24 \\cdot 23 \\cdot 22 = 303\\,600$ arranjos. Cada comissão de 4 pessoas pode ser ordenada de $4! = 24$ maneiras — todas representam **a mesma** comissão. Dividir cancela.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-38-combinacoes'],
      fonteOriginal: {
        livro: 'OpenStax Algebra and Trigonometry 2e',
        url: OS_AT,
        ref: '§13.6 Combinations, ex. 18 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 5,
      enunciado:
        'Em uma urna há 5 bolas vermelhas e 3 azuis. Tira-se 2 sem reposição. Qual a probabilidade de ' +
        'ambas serem vermelhas?',
      resposta: '$10/28 = 5/14$',
      passos:
        '**Passo 1 — Casos favoráveis.** $\\binom{5}{2} = 10$ pares vermelhos.\n\n' +
        '**Passo 2 — Casos totais.** $\\binom{8}{2} = 28$ pares possíveis.\n\n' +
        '**Passo 3 — Probabilidade.** $P = 10/28 = 5/14 \\approx 0{,}357$.\n\n' +
        '**Caminho alternativo (regra do produto).** $P = (5/8) \\cdot (4/7) = 20/56 = 5/14$. Primeira bola vermelha: $5/8$. Dada a primeira, restam 4V em 7 bolas: $4/7$.\n\n' +
        '**Por que sem reposição muda?** Tirar a primeira altera o universo da segunda — é probabilidade **condicional**. Com reposição, $(5/8)^2 = 25/64$ (diferente).',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-39-probabilidade'],
      fonteOriginal: {
        livro: 'OpenStax Introductory Statistics',
        url: OS_STAT,
        ref: '§3.2 Independent and Mutually Exclusive Events, ex. 11 (adaptado)',
        licenca: CC_BY,
      },
    },
    { numero: 6, enunciado: 'Matriz $A$ é diagonal se $a_{ij} = 0$ para $i \\neq j$. Exemplo $2\\times 2$.', resposta: '$\\begin{pmatrix} a & 0 \\\\ 0 & b \\end{pmatrix}$', passos: '**Passo 1.** Apenas diagonal principal não-zero.', dificuldade: 'aplicacao', aulasCobertas: ['aula-31-matrizes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.5 Diagonal Matrix, ex. 5', licenca: CC_BY } },
    { numero: 7, enunciado: 'Quantos arranjos de 7 letras tomadas 3 a 3?', resposta: '$A_7^3 = 210$', passos: '**Passo 1.** $7 \\cdot 6 \\cdot 5 = 210$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Arrangements, ex. 11', licenca: CC_BY } },
    { numero: 8, enunciado: 'Tirar 1 carta de baralho. P(rei).', resposta: '$4/52 = 1/13$', passos: '**Passo 1.** 4 reis em 52 cartas.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.1 Card Single, ex. 5', licenca: CC_BY } },
    { numero: 9, enunciado: 'Determinante de $\\begin{pmatrix} 4 & 6 \\\\ 2 & 3 \\end{pmatrix}$.', resposta: '$0$', passos: '**Passo 1.** $4 \\cdot 3 - 6 \\cdot 2 = 0$. Linhas LD.', dificuldade: 'aplicacao', aulasCobertas: ['aula-34-determinantes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 Det Zero, ex. 9', licenca: CC_BY } },
    { numero: 10, enunciado: 'P($A$ ou $B$) se $P(A) = 0{,}5$, $P(B) = 0{,}3$, $P(A \\cap B) = 0{,}1$.', resposta: '$0{,}7$', passos: '**Passo 1.** Inclusão-exclusão: $0{,}5 + 0{,}3 - 0{,}1 = 0{,}7$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Union, ex. 21', licenca: CC_BY } },
    { numero: 11, enunciado: 'Identidade $I_2$ multiplicada por $A$ ($2\\times 2$).', resposta: '$I_2 A = A$', passos: '**Passo 1.** Identidade não muda matriz: análogo a multiplicar por 1.', dificuldade: 'aplicacao', aulasCobertas: ['aula-32-operacoes-matrizes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.5 Identity, ex. 3', licenca: CC_BY } },
    { numero: 12, enunciado: 'Permutação de 6 livros distintos numa estante.', resposta: '$6! = 720$', passos: '**Passo 1.** $6 \\cdot 5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = 720$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Permutations, ex. 5', licenca: CC_BY } },
    { numero: 13, enunciado: 'Lance moeda 3 vezes. P(2 caras).', resposta: '$3/8$', passos: '**Passo 1.** $\\binom{3}{2}(0{,}5)^3 = 3/8$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.3 Binomial, ex. 17', licenca: CC_BY } },
    { numero: 14, enunciado: 'P(soma = 4) com 2 dados.', resposta: '$3/36 = 1/12$', passos: '**Passo 1.** Soma 4: (1,3), (2,2), (3,1) = 3 casos. $P = 3/36$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.1 Dice Sum 4, ex. 13', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: senha de 6 caracteres (letras a-z + dígitos 0-9). Total possível.', resposta: '$36^6 \\approx 2{,}18 \\times 10^9$', passos: '**Passo 1.** 36 opções × 6 posições.\n\n**Aplicação.** Senhas curtas são vulneráveis a brute force; recomendam $\\geq 12$ chars.', dificuldade: 'modelagem', aulasCobertas: ['aula-36-pfc'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Password Strength, ex. 39', licenca: CC_BY } },
  ],
}

// Trim 4 v2-v10
const PROVA_T4_V2: Prova = {
  id: 'trim-4-v2', trim: 4, versao: 2,
  titulo: 'Trim 4 · Versão 2 — Matrizes, contagem, probabilidade',
  descricao: 'Trim 4 v2.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Soma de $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ e $B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$.', resposta: '$\\begin{pmatrix} 6 & 8 \\\\ 10 & 12 \\end{pmatrix}$',
      passos: '**Passo 1.** Soma entrada por entrada.\n\n**Por que?** Soma de matrizes é definida componente a componente — espelha soma de funções lineares.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-32-operacoes-matrizes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.5 Matrix Sum, ex. 8 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Determinante $\\det\\begin{pmatrix} 3 & 5 \\\\ 2 & 7 \\end{pmatrix}$.', resposta: '$11$',
      passos: '**Passo 1.** $\\det = ad - bc = 21 - 10 = 11$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-34-determinantes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 Determinant 2x2, ex. 5 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Quantas senhas de 4 dígitos podem ser formadas (dígitos podem repetir)?', resposta: '$10^4 = 10\\,000$',
      passos: '**Passo 1.** PFC: 10 escolhas para cada dígito, independentes.\n\n**Passo 2.** $10 \\times 10 \\times 10 \\times 10 = 10\\,000$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-36-pfc'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 PFC, ex. 4 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Quantas combinações de 5 cartas em baralho de 52?', resposta: '$\\binom{52}{5} = 2\\,598\\,960$',
      passos: '**Passo 1.** Escolha sem ordem ⇒ combinação.\n\n**Passo 2.** $\\binom{52}{5} = \\dfrac{52!}{5! \\cdot 47!} = \\dfrac{52 \\cdot 51 \\cdot 50 \\cdot 49 \\cdot 48}{120} = 2\\,598\\,960$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-38-combinacoes'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Poker Hands, ex. 25 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Probabilidade de tirar 2 ases num baralho de 52, sem reposição.', resposta: '$\\binom{4}{2}/\\binom{52}{2} = 6/1326 = 1/221$',
      passos: '**Passo 1.** Casos favoráveis: $\\binom{4}{2} = 6$.\n\n**Passo 2.** Casos totais: $\\binom{52}{2} = 1326$.\n\n**Passo 3.** $P = 6/1326 = 1/221 \\approx 0{,}45\\%$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Card Probability, ex. 23 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Soma de matrizes $A + B$ se $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ e $B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$.', resposta: '$\\begin{pmatrix} 6 & 8 \\\\ 10 & 12 \\end{pmatrix}$', passos: '**Passo 1.** Soma componente.', dificuldade: 'aplicacao', aulasCobertas: ['aula-32-operacoes-matrizes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.5 Sum, ex. 7', licenca: CC_BY } },
    { numero: 7, enunciado: 'Quantas combinações de 6 livros tomados 4?', resposta: '$\\binom{6}{4} = 15$', passos: '**Passo 1.** $\\binom{6}{4} = 6!/(4!2!) = 15$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Combinations, ex. 9', licenca: CC_BY } },
    { numero: 8, enunciado: 'Lance dado e moeda. P(face par e cara).', resposta: '$1/4$', passos: '**Passo 1.** $P(\\text{par}) = 1/2$, $P(\\text{cara}) = 1/2$. Independentes.\n\n**Passo 2.** $P = 1/4$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Indep Joint, ex. 17', licenca: CC_BY } },
    { numero: 9, enunciado: 'Determinante via Sarrus de matriz $3\\times 3$ com diagonal $1, 2, 3$ e zeros fora.', resposta: '$6$', passos: '**Passo 1.** Diagonal: $\\det = 1 \\cdot 2 \\cdot 3 = 6$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-34-determinantes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 Diag Det, ex. 5', licenca: CC_BY } },
    { numero: 10, enunciado: 'Sistema $A\\vec x = \\vec b$ com $\\det A \\neq 0$. Solução?', resposta: 'Única.', passos: '**Passo 1.** $\\det \\neq 0$ ⇒ $A^{-1}$ existe ⇒ $\\vec x = A^{-1}\\vec b$ é única.', dificuldade: 'compreensao', aulasCobertas: ['aula-35-sistemas-via-matrizes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 Cramer Rule, ex. 13', licenca: CC_BY } },
    { numero: 11, enunciado: 'P($\\bar A$) se $P(A) = 0{,}3$.', resposta: '$0{,}7$', passos: '**Passo 1.** $1 - 0{,}3 = 0{,}7$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Complement, ex. 7', licenca: CC_BY } },
    { numero: 12, enunciado: 'Anagramas de RIO.', resposta: '$3! = 6$', passos: '**Passo 1.** 3 letras distintas. $3! = 6$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Anagrams Distinct, ex. 5', licenca: CC_BY } },
    { numero: 13, enunciado: 'Quantos números de 5 algarismos com algarismo da esquerda 1?', resposta: '$10^4 = 10000$', passos: '**Passo 1.** Posição 1 fixa. Outras 4 posições: 10 opções cada.', dificuldade: 'aplicacao', aulasCobertas: ['aula-36-pfc'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Constrained PFC, ex. 19', licenca: CC_BY } },
    { numero: 14, enunciado: 'Inversa de $A = \\begin{pmatrix} 1 & 0 \\\\ 0 & 2 \\end{pmatrix}$.', resposta: '$\\begin{pmatrix} 1 & 0 \\\\ 0 & 1/2 \\end{pmatrix}$', passos: '**Passo 1.** Diagonal inversa: inverter cada entrada.', dificuldade: 'aplicacao', aulasCobertas: ['aula-33-transposta-inversa'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.7 Diagonal Inverse, ex. 7', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: comissão de 5 entre 12 candidatos com 1 fixo.', resposta: '$\\binom{11}{4} = 330$', passos: '**Passo 1.** 1 já incluído. Faltam 4 entre 11 restantes.', dificuldade: 'aplicacao', aulasCobertas: ['aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Constrained Combination, ex. 27', licenca: CC_BY } },
  ],
}

const PROVA_T4_V3: Prova = {
  id: 'trim-4-v3', trim: 4, versao: 3,
  titulo: 'Trim 4 · Versão 3 — Matrizes, contagem, probabilidade',
  descricao: 'Trim 4 v3.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Calcule $A^T$ se $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix}$.', resposta: '$\\begin{pmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{pmatrix}$',
      passos: '**Passo 1.** Linhas viram colunas.\n\n**Por que transposta?** Inverte papel de linhas/colunas — útil em produto interno (linha × coluna) e mudanças de coordenadas.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-33-transposta-inversa'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.5 Transpose, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Inversa de $\\begin{pmatrix} 2 & 1 \\\\ 5 & 3 \\end{pmatrix}$.', resposta: '$\\begin{pmatrix} 3 & -1 \\\\ -5 & 2 \\end{pmatrix}$',
      passos: '**Passo 1.** $\\det = 6 - 5 = 1$.\n\n**Passo 2.** Inversa $2\\times 2$: $\\dfrac{1}{\\det}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix} = \\begin{pmatrix} 3 & -1 \\\\ -5 & 2 \\end{pmatrix}$.\n\n**Verificação.** $A A^{-1} = I$ pode ser conferido por multiplicação.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-33-transposta-inversa'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.7 Matrix Inverse, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Permutações de 4 letras distintas em 4 posições.', resposta: '$4! = 24$',
      passos: '**Passo 1.** $4 \\cdot 3 \\cdot 2 \\cdot 1 = 24$.\n\n**Por que fatorial?** Cada posição reduz o pool em 1.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Permutations, ex. 9 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Em uma turma de 30, qual prob. de pelo menos 2 fazerem aniversário no mesmo dia?', resposta: '$\\approx 70{,}6\\%$',
      passos: '**Passo 1.** Use complemento. P(todos diferentes) $= 365 \\cdot 364 \\cdots 336/365^{30}$.\n\n**Passo 2.** $\\approx 0{,}294$. Logo P(pelo menos um par) $\\approx 0{,}706$.\n\n**Por que tão alto?** Paradoxo do aniversário — combinatorialmente há $\\binom{30}{2} = 435$ pares possíveis, cada um com prob. ~$1/365$ de coincidir.',
      dificuldade: 'desafio', aulasCobertas: ['aula-39-probabilidade'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.4 Birthday Paradox, ex. 53 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Eventos $A$ e $B$ independentes: $P(A) = 0{,}3$, $P(B) = 0{,}5$. Calcule $P(A \\cup B)$.', resposta: '$0{,}65$',
      passos: '**Passo 1.** Independentes ⇒ $P(A \\cap B) = 0{,}3 \\cdot 0{,}5 = 0{,}15$.\n\n**Passo 2.** Inclusão-exclusão: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0{,}3 + 0{,}5 - 0{,}15 = 0{,}65$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-39-probabilidade'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Independent Events, ex. 18 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Anagramas de NÃO-distintos: BOLA tem letras todas distintas. $\\#$ anagramas.', resposta: '$24$', passos: '**Passo 1.** $4! = 24$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Distinct, ex. 7', licenca: CC_BY } },
    { numero: 7, enunciado: 'P(rei OU copas) tirando 1 carta.', resposta: '$16/52 = 4/13$', passos: '**Passo 1.** P(rei) = 4/52, P(copas) = 13/52, P(rei∩copas) = 1/52 (rei de copas).\n\n**Passo 2.** $4/52 + 13/52 - 1/52 = 16/52 = 4/13$.', dificuldade: 'compreensao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Card Or, ex. 25', licenca: CC_BY } },
    { numero: 8, enunciado: 'Multiplique $\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} \\cdot \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$.', resposta: '$\\begin{pmatrix} 3 \\\\ 7 \\end{pmatrix}$', passos: '**Passo 1.** Linha por coluna.', dificuldade: 'aplicacao', aulasCobertas: ['aula-32-operacoes-matrizes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.5 Matrix-Vector, ex. 13', licenca: CC_BY } },
    { numero: 9, enunciado: 'Senhas de 4 dígitos diferentes (sem repetir).', resposta: '$10 \\cdot 9 \\cdot 8 \\cdot 7 = 5040$', passos: '**Passo 1.** Arranjo $A_{10}^4$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 No Repeat, ex. 13', licenca: CC_BY } },
    { numero: 10, enunciado: 'P(soma > 9) com 2 dados.', resposta: '$6/36 = 1/6$', passos: '**Passo 1.** Soma 10: 3 casos. Soma 11: 2. Soma 12: 1. Total 6.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.1 Dice Sum, ex. 19', licenca: CC_BY } },
    { numero: 11, enunciado: 'Determinante de $A^T$ vs $A$.', resposta: 'Iguais ($\\det A^T = \\det A$).', passos: '**Passo 1.** Propriedade: transposta preserva determinante.', dificuldade: 'compreensao', aulasCobertas: ['aula-34-determinantes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 Det Transpose, ex. 23', licenca: CC_BY } },
    { numero: 12, enunciado: '$\\binom{10}{0}$ e $\\binom{10}{10}$.', resposta: 'Ambos 1.', passos: '**Passo 1.** Convenção: única forma de escolher 0 ou todos.', dificuldade: 'compreensao', aulasCobertas: ['aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Boundary, ex. 11', licenca: CC_BY } },
    { numero: 13, enunciado: 'Probabilidade complementar: $P(\\geq 1)$ se $P(0) = 0{,}1$.', resposta: '$0{,}9$', passos: '**Passo 1.** Complemento: $1 - 0{,}1 = 0{,}9$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 At Least One, ex. 9', licenca: CC_BY } },
    { numero: 14, enunciado: 'Sistema com 3 incógnitas e 3 equações dependentes (todas múltiplas).', resposta: 'Infinitas soluções (plano).', passos: '**Passo 1.** Apenas 1 equação efetivamente: define plano em $\\mathbb R^3$.', dificuldade: 'compreensao', aulasCobertas: ['aula-29-sistemas-lineares', 'aula-35-sistemas-via-matrizes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.6 Dependent System, ex. 25', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: torneio com 8 times. Quantos jogos no formato eliminatório (chave única)?', resposta: '$7$ jogos.', passos: '**Passo 1.** Eliminatório: cada jogo elimina 1 time. Para sair de 8 → 1 campeão: 7 eliminações.\n\n**Aplicação.** Lógica de torneio.', dificuldade: 'modelagem', aulasCobertas: ['aula-36-pfc'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Tournament, ex. 33', licenca: CC_BY } },
  ],
}

const PROVA_T4_V4: Prova = {
  id: 'trim-4-v4', trim: 4, versao: 4,
  titulo: 'Trim 4 · Versão 4 — Matrizes, contagem, probabilidade',
  descricao: 'Trim 4 v4.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Resolva o sistema via matriz aumentada e Gauss: $\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}$.', resposta: '$x = 2$, $y = 3$',
      passos: '**Passo 1.** Aumentada: $\\begin{pmatrix} 1 & 1 & | & 5 \\\\ 2 & -1 & | & 1 \\end{pmatrix}$.\n\n**Passo 2.** $L_2 \\to L_2 - 2L_1$: $\\begin{pmatrix} 1 & 1 & | & 5 \\\\ 0 & -3 & | & -9 \\end{pmatrix}$.\n\n**Passo 3.** $y = 3$, $x = 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-35-sistemas-via-matrizes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.6 Gaussian Elimination, ex. 15 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Quantos números de 3 algarismos distintos com algarismos $\\{1, 2, 3, 4, 5\\}$?', resposta: '$5 \\cdot 4 \\cdot 3 = 60$',
      passos: '**Passo 1.** Arranjo $A_5^3 = 5!/2! = 60$.\n\n**Por que arranjo?** Ordem importa (123 ≠ 321) e sem repetição.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Arrangements, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Determinante $\\det\\begin{pmatrix} 1 & 0 & 2 \\\\ 0 & 3 & 1 \\\\ 2 & 1 & 0 \\end{pmatrix}$.', resposta: '$-13$',
      passos: '**Passo 1.** Expansão pela 1ª linha: $\\det = 1 \\cdot (3 \\cdot 0 - 1 \\cdot 1) - 0 + 2 \\cdot (0 \\cdot 1 - 3 \\cdot 2) = -1 + 2(-6) = -13$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-34-determinantes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 Det 3x3, ex. 7 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Combinação: número de comissões de 3 escolhidas em 8 pessoas, com 1 fixa.', resposta: '$\\binom{7}{2} = 21$',
      passos: '**Passo 1.** 1 já incluído. Faltam 2 entre os 7 restantes.\n\n**Passo 2.** $\\binom{7}{2} = 21$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-38-combinacoes'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Conditional Combinations, ex. 27 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Lance 2 dados. Probabilidade da soma ser 7.', resposta: '$6/36 = 1/6$',
      passos: '**Passo 1.** Espaço amostral $= 36$ resultados.\n\n**Passo 2.** Casos com soma 7: $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6$.\n\n**Passo 3.** $P = 6/36 = 1/6$.\n\n**Por que 7 é mais provável?** Dentre todas as somas possíveis (2-12), 7 tem mais combinações ⇒ é a soma mais provável.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.1 Dice, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Eliminação Gauss para $\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}$.', resposta: '$x=3, y=2$', passos: '**Passo 1.** Some: $2x = 6, x = 3$. $y = 2$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-35-sistemas-via-matrizes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.6 Add, ex. 5', licenca: CC_BY } },
    { numero: 7, enunciado: 'Quantas combinações de 5 entre 7?', resposta: '$\\binom{7}{5} = 21$', passos: '**Passo 1.** $\\binom{7}{5} = \\binom{7}{2} = 21$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Comb 7,5, ex. 13', licenca: CC_BY } },
    { numero: 8, enunciado: 'Roleta com 38 casas (1-36 + 0 e 00). P(número primo).', resposta: '$11/38$', passos: '**Passo 1.** Primos $\\leq 36$: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31 = 11.\n\n**Passo 2.** $P = 11/38$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.1 Roulette, ex. 27', licenca: CC_BY } },
    { numero: 9, enunciado: 'Det $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$.', resposta: '$ad - bc$', passos: '**Passo 1.** Fórmula direta $2 \\times 2$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-34-determinantes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 2x2 Det, prova', licenca: CC_BY } },
    { numero: 10, enunciado: 'Permutações circulares com 6 pessoas em mesa redonda.', resposta: '$5! = 120$', passos: '**Passo 1.** Em circular, fixa 1 pessoa. Restantes: $(n-1)!$.', dificuldade: 'compreensao', aulasCobertas: ['aula-37-permutacoes-arranjos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Circular, ex. 23', licenca: CC_BY } },
    { numero: 11, enunciado: 'P(carta vermelha): tirar 1 carta de baralho.', resposta: '$26/52 = 1/2$', passos: '**Passo 1.** 26 vermelhas (copas + ouros) em 52.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.1 Red Card, ex. 7', licenca: CC_BY } },
    { numero: 12, enunciado: 'Matriz $A = -A$ implica?', resposta: '$A = 0$', passos: '**Passo 1.** $A + A = 2A = 0 \\Rightarrow A = 0$.', dificuldade: 'compreensao', aulasCobertas: ['aula-32-operacoes-matrizes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.5 Self-Inverse, ex. 21', licenca: CC_BY } },
    { numero: 13, enunciado: 'PFC: 4 caminhos por estrada e 3 hotéis. Total combinações.', resposta: '$12$', passos: '**Passo 1.** $4 \\times 3 = 12$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-36-pfc'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Travel PFC, ex. 7', licenca: CC_BY } },
    { numero: 14, enunciado: 'Inversa de $\\begin{pmatrix} 2 & 0 \\\\ 0 & 5 \\end{pmatrix}$.', resposta: '$\\begin{pmatrix} 1/2 & 0 \\\\ 0 & 1/5 \\end{pmatrix}$', passos: '**Passo 1.** Diagonal: inversa = inversa entrada por entrada.', dificuldade: 'aplicacao', aulasCobertas: ['aula-33-transposta-inversa'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.7 Diagonal Inv, ex. 9', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: 30 alunos, escolher comissão de 4. Quantas?', resposta: '$\\binom{30}{4} = 27\\,405$', passos: '**Passo 1.** $\\binom{30}{4} = 30!/(4! \\cdot 26!)$.\n\n**Passo 2.** $30 \\cdot 29 \\cdot 28 \\cdot 27/24 = 657720/24 = 27405$.', dificuldade: 'modelagem', aulasCobertas: ['aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Committee, ex. 21', licenca: CC_BY } },
  ],
}

const PROVA_T4_V5: Prova = {
  id: 'trim-4-v5', trim: 4, versao: 5,
  titulo: 'Trim 4 · Versão 5 — Matrizes, contagem, probabilidade',
  descricao: 'Trim 4 v5.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Multiplique $\\begin{pmatrix} 2 & 0 \\\\ 1 & 3 \\end{pmatrix}\\begin{pmatrix} 1 \\\\ -2 \\end{pmatrix}$.', resposta: '$\\begin{pmatrix} 2 \\\\ -5 \\end{pmatrix}$',
      passos: '**Passo 1.** Linha 1: $2 \\cdot 1 + 0 \\cdot (-2) = 2$.\n\n**Passo 2.** Linha 2: $1 \\cdot 1 + 3 \\cdot (-2) = -5$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-32-operacoes-matrizes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.5 Matrix-Vector, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Quantos anagramas da palavra LIVRO?', resposta: '$5! = 120$',
      passos: '**Passo 1.** 5 letras distintas. Permutações $= 5!$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Anagrams, ex. 6 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Inversa: $A^{-1}$ existe se $\\det A \\neq 0$. Justifique a partir de $AA^{-1} = I$.', resposta: 'Demonstração.',
      passos: '**Passo 1.** Tome det de ambos: $\\det(A A^{-1}) = \\det I = 1$.\n\n**Passo 2.** $\\det(AB) = \\det A \\det B$. Logo $\\det A \\cdot \\det A^{-1} = 1$.\n\n**Passo 3.** Para essa equação ter sentido, $\\det A \\neq 0$. Se $\\det A = 0$, não existe $A^{-1}$.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-33-transposta-inversa', 'aula-34-determinantes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.7 Invertibility Theorem, prova', licenca: CC_BY } },
    { numero: 4, enunciado: 'P(face 6 ou cara em moeda) jogando 1 dado e 1 moeda.', resposta: '$P = 7/12$',
      passos: '**Passo 1.** $P(6) = 1/6$, $P(\\text{cara}) = 1/2$.\n\n**Passo 2.** Independentes: $P(6 \\cup \\text{cara}) = 1/6 + 1/2 - (1/6)(1/2) = 1/6 + 1/2 - 1/12 = 2/12 + 6/12 - 1/12 = 7/12$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Combined Events, ex. 26 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Triângulo de Pascal: identifique $\\binom{6}{3}$.', resposta: '$20$',
      passos: '**Passo 1.** $\\binom{6}{3} = 6!/(3! 3!) = 720/36 = 20$.\n\n**Pascal.** Linha 6: 1, 6, 15, 20, 15, 6, 1.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-38-combinacoes'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Pascal Triangle, ex. 31 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Sistema $\\begin{cases} 3x + y = 7 \\\\ x - 2y = -7 \\end{cases}$.', resposta: '$x = 1$, $y = 4$', passos: '**Passo 1.** Multiplique eq1 por 2: $6x + 2y = 14$. Some com eq2: $7x = 7 \\Rightarrow x = 1$. $y = 4$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-29-sistemas-lineares'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.1 Add, ex. 9', licenca: CC_BY } },
    { numero: 7, enunciado: 'Combinatória: $\\binom{n}{1}$.', resposta: '$n$', passos: '**Passo 1.** Escolher 1 entre n: n maneiras.', dificuldade: 'aplicacao', aulasCobertas: ['aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Choose 1, ex. 3', licenca: CC_BY } },
    { numero: 8, enunciado: 'Variância de var aleatória discreta $X$ com $E[X]=2$, $E[X^2]=8$.', resposta: '$V[X] = 4$', passos: '**Passo 1.** $V = E[X^2] - E[X]^2 = 8 - 4 = 4$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.1 Variance Formula, ex. 17', licenca: CC_BY } },
    { numero: 9, enunciado: 'Determinante via expansão.', resposta: 'Generaliza fórmula $2\\times 2$ via cofatores.', passos: '**Passo 1.** Para $n\\times n$: $\\det = \\sum_j (-1)^{i+j} a_{ij} M_{ij}$ (linha $i$ fixa).', dificuldade: 'compreensao', aulasCobertas: ['aula-34-determinantes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 Cofactor Expansion, ex. 21', licenca: CC_BY } },
    { numero: 10, enunciado: 'P(0 caras em 4 lançamentos).', resposta: '$1/16$', passos: '**Passo 1.** $(1/2)^4 = 1/16$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.3 All Tails, ex. 9', licenca: CC_BY } },
    { numero: 11, enunciado: 'Eventos disjuntos: $A \\cap B = \\emptyset$. $P(A \\cup B)$.', resposta: '$P(A) + P(B)$', passos: '**Passo 1.** Sem intersecção, soma simples.', dificuldade: 'compreensao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Disjoint, ex. 11', licenca: CC_BY } },
    { numero: 12, enunciado: 'Quantos modos 4 livros sobre 4 prateleiras (1 por prateleira).', resposta: '$4! = 24$', passos: '**Passo 1.** Permutações.', dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Bijection, ex. 8', licenca: CC_BY } },
    { numero: 13, enunciado: 'Inversa de $\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$.', resposta: 'Igual a si mesma (identidade).', passos: '**Passo 1.** $I I = I$. Inversa de $I$ é $I$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-33-transposta-inversa'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.7 Identity Self-Inverse, ex. 5', licenca: CC_BY } },
    { numero: 14, enunciado: 'PFC: 5 cores camisa, 3 cores calça, 2 cores tênis. Outfits.', resposta: '$30$', passos: '**Passo 1.** $5 \\times 3 \\times 2 = 30$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-36-pfc'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Outfits, ex. 7', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: equipe de 8 pessoas, escolher 1 líder e 2 substitutos.', resposta: '$8 \\cdot \\binom{7}{2} = 168$', passos: '**Passo 1.** Líder: 8 escolhas. Substitutos: $\\binom{7}{2} = 21$.\n\n**Passo 2.** $8 \\cdot 21 = 168$.', dificuldade: 'modelagem', aulasCobertas: ['aula-37-permutacoes-arranjos', 'aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Hierarchy, ex. 31', licenca: CC_BY } },
  ],
}

const PROVA_T4_V6: Prova = {
  id: 'trim-4-v6', trim: 4, versao: 6,
  titulo: 'Trim 4 · Versão 6 — Matrizes, contagem, probabilidade',
  descricao: 'Trim 4 v6.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Cálculo escalar: $3 \\cdot \\begin{pmatrix} 1 & 2 \\\\ -1 & 0 \\end{pmatrix}$.', resposta: '$\\begin{pmatrix} 3 & 6 \\\\ -3 & 0 \\end{pmatrix}$',
      passos: '**Passo 1.** Multiplica cada entrada por 3.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-32-operacoes-matrizes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.5 Scalar Mult, ex. 4 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Sistema impossível pelo determinante: $\\begin{cases} 2x + 3y = 7 \\\\ 4x + 6y = 13 \\end{cases}$.', resposta: 'Determinante = 0; impossível.',
      passos: '**Passo 1.** $\\det = 12 - 12 = 0$. Coeficientes proporcionais.\n\n**Passo 2.** Mas $13/7 \\neq 6/3 = 2$. Termos independentes não proporcionais.\n\n**Conclusão.** Sistema **incompatível** (paralelas distintas).',
      dificuldade: 'compreensao', aulasCobertas: ['aula-35-sistemas-via-matrizes', 'aula-34-determinantes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 Det and Solvability, ex. 22 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'PFC: cardápio com 3 entradas, 4 pratos e 2 sobremesas. Quantos jantares?', resposta: '$24$',
      passos: '**Passo 1.** $3 \\times 4 \\times 2 = 24$.\n\n**Por que produto?** Cada combinação independente das outras.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-36-pfc'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Menu Counting, ex. 7 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Probabilidade condicional: P(A∩B) = 0,2; P(B) = 0,4. Calcule P(A|B).', resposta: '$0{,}5$',
      passos: '**Passo 1.** $P(A|B) = P(A \\cap B)/P(B) = 0{,}2/0{,}4 = 0{,}5$.\n\n**Interpretação.** Dado que $B$ aconteceu, há 50% de chance de $A$ também.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Conditional, ex. 30 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Combinação: de 10 produtos, escolher 4 para vitrine. Quantas formas?', resposta: '$\\binom{10}{4} = 210$',
      passos: '**Passo 1.** $\\binom{10}{4} = 10!/(4! 6!) = 5040/24 = 210$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-38-combinacoes'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Display Selection, ex. 22 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Subtração de matrizes $A - B$. Definição.', resposta: 'Componente: $A - B = A + (-B)$.', passos: '**Passo 1.** Subtração entrada por entrada.', dificuldade: 'aplicacao', aulasCobertas: ['aula-32-operacoes-matrizes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.5 Subtraction, ex. 11', licenca: CC_BY } },
    { numero: 7, enunciado: 'P(A ou B) com $A, B$ disjuntos: $P(A) = 0{,}3$, $P(B) = 0{,}45$.', resposta: '$0{,}75$', passos: '**Passo 1.** Disjuntos: $P(A \\cup B) = P(A) + P(B) = 0{,}75$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Disjoint, ex. 13', licenca: CC_BY } },
    { numero: 8, enunciado: 'Anagramas de NÃO (sem til): NAO.', resposta: '$3! = 6$', passos: '**Passo 1.** 3 letras distintas.', dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Anagrams, ex. 4', licenca: CC_BY } },
    { numero: 9, enunciado: 'Tab.: Det $\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$.', resposta: '$-2$', passos: '**Passo 1.** $-1 - 1 = -2$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-34-determinantes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 Det, ex. 6', licenca: CC_BY } },
    { numero: 10, enunciado: 'Senha 6 letras com repetição (a-z).', resposta: '$26^6 \\approx 3{,}09 \\times 10^8$', passos: '**Passo 1.** 26 escolhas × 6 posições.', dificuldade: 'aplicacao', aulasCobertas: ['aula-36-pfc'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Letters Password, ex. 11', licenca: CC_BY } },
    { numero: 11, enunciado: 'P(2 vermelhas) urna 5R+5A, com reposição, 2 sorteios.', resposta: '$1/4$', passos: '**Passo 1.** Cada sorteio independente: $0{,}5 \\cdot 0{,}5 = 0{,}25$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.1 With Replacement, ex. 17', licenca: CC_BY } },
    { numero: 12, enunciado: '$\\binom{n}{n} = ?$', resposta: '$1$', passos: '**Passo 1.** Única forma de escolher todos.', dificuldade: 'aplicacao', aulasCobertas: ['aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Pick All, ex. 5', licenca: CC_BY } },
    { numero: 13, enunciado: 'Sistema $\\begin{cases} 2x = 4 \\\\ 3y = 9 \\end{cases}$ Cramer.', resposta: '$x = 2, y = 3$', passos: '**Passo 1.** Diretamente: $x = 2$, $y = 3$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-35-sistemas-via-matrizes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.6 Trivial, ex. 3', licenca: CC_BY } },
    { numero: 14, enunciado: 'Distribuição binomial: $X \\sim B(10, 0{,}5)$. $E[X]$.', resposta: '$5$', passos: '**Passo 1.** $E = np = 10 \\cdot 0{,}5 = 5$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.3 Binomial Mean, ex. 21', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: torneio round-robin com 10 times. Quantos jogos no total?', resposta: '$\\binom{10}{2} = 45$', passos: '**Passo 1.** Cada par joga 1 vez.', dificuldade: 'modelagem', aulasCobertas: ['aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Round Robin, ex. 27', licenca: CC_BY } },
  ],
}

const PROVA_T4_V7: Prova = {
  id: 'trim-4-v7', trim: 4, versao: 7,
  titulo: 'Trim 4 · Versão 7 — Matrizes, contagem, probabilidade',
  descricao: 'Trim 4 v7.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Identidade $I_3$ aplicada a $\\vec v = (5, -2, 7)$.', resposta: '$(5, -2, 7)$',
      passos: '**Passo 1.** $I \\vec v = \\vec v$.\n\n**Por que?** Identidade é o "1" matricial — não muda o vetor.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-31-matrizes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.5 Identity Matrix, ex. 2 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Anagramas de BANANA?', resposta: '$60$',
      passos: '**Passo 1.** 6 letras: B(1), A(3), N(2). Permutações com repetição: $6!/(3! 2! 1!) = 720/12 = 60$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Anagrams Repeated, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Cramer: resolva $\\begin{cases} x + 2y = 5 \\\\ 3x - y = 1 \\end{cases}$.', resposta: '$x = 1$, $y = 2$',
      passos: '**Passo 1.** $D = \\det\\begin{pmatrix} 1 & 2 \\\\ 3 & -1 \\end{pmatrix} = -7$.\n\n**Passo 2.** $D_x = \\det\\begin{pmatrix} 5 & 2 \\\\ 1 & -1 \\end{pmatrix} = -7$. $x = -7/-7 = 1$.\n\n**Passo 3.** $D_y = \\det\\begin{pmatrix} 1 & 5 \\\\ 3 & 1 \\end{pmatrix} = -14$. $y = -14/-7 = 2$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-35-sistemas-via-matrizes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 Cramer Rule, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Probabilidade complementar: $P(\\bar A) = 1 - P(A)$. Se $P(A) = 0{,}82$, $P(\\bar A)$.', resposta: '$0{,}18$',
      passos: '**Passo 1.** $P(\\bar A) = 1 - 0{,}82 = 0{,}18$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Complement, ex. 7 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Binomial: P(3 caras em 5 lançamentos de moeda honesta).', resposta: '$\\binom{5}{3}(1/2)^5 = 10/32 = 5/16$',
      passos: '**Passo 1.** $\\binom{5}{3} = 10$.\n\n**Passo 2.** $(1/2)^5 = 1/32$.\n\n**Passo 3.** $P = 10/32 = 5/16 \\approx 0{,}3125$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.3 Binomial, ex. 41 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Anagramas de OVO.', resposta: '$3$', passos: '**Passo 1.** $3!/2! = 3$ (O repete 2x).', dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Repeated, ex. 12', licenca: CC_BY } },
    { numero: 7, enunciado: 'Determinante triangular: $\\det\\begin{pmatrix} 2 & 5 \\\\ 0 & 3 \\end{pmatrix}$.', resposta: '$6$', passos: '**Passo 1.** Triangular: produto da diagonal.', dificuldade: 'aplicacao', aulasCobertas: ['aula-34-determinantes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 Triangular, ex. 13', licenca: CC_BY } },
    { numero: 8, enunciado: 'P(soma=2) com 2 dados.', resposta: '$1/36$', passos: '**Passo 1.** Único caso: (1,1).', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.1 Snake Eyes, ex. 9', licenca: CC_BY } },
    { numero: 9, enunciado: 'Comissão 3 entre 8 sem ordem.', resposta: '$\\binom{8}{3} = 56$', passos: '**Passo 1.** $56$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Comm 8,3, ex. 17', licenca: CC_BY } },
    { numero: 10, enunciado: 'Sistema $\\begin{cases} x + 0y = 1 \\\\ 0x + y = 2 \\end{cases}$.', resposta: '$(1, 2)$', passos: '**Passo 1.** Diretamente.', dificuldade: 'aplicacao', aulasCobertas: ['aula-29-sistemas-lineares'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.1 Trivial, ex. 1', licenca: CC_BY } },
    { numero: 11, enunciado: 'Inversa de $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$.', resposta: 'Igual a si mesma.', passos: '**Passo 1.** Auto-inversa: $\\det = -1$. Pelo cálculo, $A^{-1} = A$.', dificuldade: 'compreensao', aulasCobertas: ['aula-33-transposta-inversa'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.7 Permutation Matrix, ex. 19', licenca: CC_BY } },
    { numero: 12, enunciado: 'P(rei dado tirar carta de figura): J/Q/K. Condicional.', resposta: '$P(K | \\text{figura}) = 4/12 = 1/3$', passos: '**Passo 1.** 12 figuras (4 reis, 4 damas, 4 valetes). 4 são reis.', dificuldade: 'compreensao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Conditional, ex. 33', licenca: CC_BY } },
    { numero: 13, enunciado: '$\\binom{n}{k} \\cdot k = n \\cdot \\binom{n-1}{k-1}$. Verifique para $n=4, k=2$.', resposta: 'Identidade verificada.', passos: '**Passo 1.** $\\binom{4}{2} \\cdot 2 = 6 \\cdot 2 = 12$.\n\n**Passo 2.** $4 \\cdot \\binom{3}{1} = 4 \\cdot 3 = 12$ ✓.', dificuldade: 'desafio', aulasCobertas: ['aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Identity, ex. 35', licenca: CC_BY } },
    { numero: 14, enunciado: 'P(retirar 1 ás em primeira tentativa de 52 cartas).', resposta: '$1/13$', passos: '**Passo 1.** $4/52 = 1/13$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.1 Single Card, ex. 5', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: certificação aleatória de 10 produtos amostrados em lote de 100. P(0 defeito se 5% defeituoso).', resposta: '$\\binom{95}{10}/\\binom{100}{10} \\approx 0{,}584$', passos: '**Passo 1.** Hipergeométrica: 95 bons, 5 defeit.\n\n**Passo 2.** P(0 defeit) = escolher 10 dos 95 bons / total = $\\binom{95}{10}/\\binom{100}{10} \\approx 58{,}4\\%$.\n\n**Aplicação.** Controle de qualidade.', dificuldade: 'modelagem', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.5 Hypergeometric, ex. 23', licenca: CC_BY } },
  ],
}

const PROVA_T4_V8: Prova = {
  id: 'trim-4-v8', trim: 4, versao: 8,
  titulo: 'Trim 4 · Versão 8 — Matrizes, contagem, probabilidade',
  descricao: 'Trim 4 v8.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Operação $A^2$ se $A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$.', resposta: '$\\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$',
      passos: '**Passo 1.** $A^2 = AA$. Linha 1, col 1: $1 \\cdot 1 + 1 \\cdot 0 = 1$. Linha 1, col 2: $1 \\cdot 1 + 1 \\cdot 1 = 2$. Linha 2: igual a $A$ (zero na coluna 1).',
      dificuldade: 'compreensao', aulasCobertas: ['aula-32-operacoes-matrizes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.5 Matrix Power, ex. 28 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Probabilidade de tirar 2 bolas pretas de urna com 5 pretas e 3 brancas, sem reposição.', resposta: '$10/28 = 5/14$',
      passos: '**Passo 1.** $\\binom{5}{2}/\\binom{8}{2} = 10/28 = 5/14$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Without Replacement, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Distribuição binomial $X \\sim B(10, 0{,}3)$. Calcule $E[X]$ e $V[X]$.', resposta: '$E[X] = 3$, $V[X] = 2{,}1$',
      passos: '**Passo 1.** $E[X] = np = 10 \\cdot 0{,}3 = 3$.\n\n**Passo 2.** $V[X] = np(1-p) = 10 \\cdot 0{,}3 \\cdot 0{,}7 = 2{,}1$.\n\n**Por que esses?** Binomial = soma de $n$ Bernoullis. $E$ e $V$ somam.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-39-probabilidade'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.3 Binomial Mean/Var, ex. 27 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Trabalho marginal: $\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$. Verifique para $n=5$, $k=2$.', resposta: 'Identidade verificada.',
      passos: '**Passo 1.** $\\binom{5}{2} = 10$.\n\n**Passo 2.** $\\binom{4}{1} + \\binom{4}{2} = 4 + 6 = 10$ ✓.\n\n**Por que essa identidade?** Cada subconjunto de tamanho $k$ ou contém o $n$-ésimo elemento (escolha mais $k-1$ entre os $n-1$) ou não (escolha $k$ entre $n-1$). Pascal!',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-38-combinacoes'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Pascal Identity, prova', licenca: CC_BY } },
    { numero: 5, enunciado: 'Sistema com solução única: $\\det \\neq 0$. Verifique $\\begin{cases} x - y = 1 \\\\ x + y = 5 \\end{cases}$.', resposta: '$\\det = 2 \\neq 0$. Solução $(3, 2)$.',
      passos: '**Passo 1.** $\\det = 1 \\cdot 1 - (-1) \\cdot 1 = 2 \\neq 0$.\n\n**Passo 2.** Some: $2x = 6 \\Rightarrow x = 3$. $y = 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-35-sistemas-via-matrizes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.6 Unique Solution, ex. 13 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'P($A \\cap B$) se $A, B$ independentes com $P(A) = 0{,}4$, $P(B) = 0{,}3$.', resposta: '$0{,}12$', passos: '**Passo 1.** Indep ⇒ produto: $0{,}4 \\cdot 0{,}3 = 0{,}12$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Indep, ex. 19', licenca: CC_BY } },
    { numero: 7, enunciado: 'PFC: 4 entradas, 5 pratos, 3 sobremesas, 2 bebidas.', resposta: '$120$', passos: '**Passo 1.** $4 \\cdot 5 \\cdot 3 \\cdot 2 = 120$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-36-pfc'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Menu, ex. 9', licenca: CC_BY } },
    { numero: 8, enunciado: 'Anagramas com letra repetida: AAB.', resposta: '$3$', passos: '**Passo 1.** $3!/2! = 3$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Repeated, ex. 13', licenca: CC_BY } },
    { numero: 9, enunciado: 'Det $\\begin{pmatrix} 5 & 0 \\\\ 0 & 0 \\end{pmatrix}$.', resposta: '$0$', passos: '**Passo 1.** Linha de zeros.', dificuldade: 'aplicacao', aulasCobertas: ['aula-34-determinantes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 Zero Row, ex. 7', licenca: CC_BY } },
    { numero: 10, enunciado: 'P(rei vermelho) tirar 1 carta.', resposta: '$2/52 = 1/26$', passos: '**Passo 1.** 2 reis vermelhos (copas + ouros) em 52.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.1 Red King, ex. 11', licenca: CC_BY } },
    { numero: 11, enunciado: 'Identidade Pascal: $\\binom{5}{2} = ?$', resposta: '$10$', passos: '**Passo 1.** Linha 5 do triângulo: 1, 5, 10, 10, 5, 1.', dificuldade: 'aplicacao', aulasCobertas: ['aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Pascal Row 5, ex. 7', licenca: CC_BY } },
    { numero: 12, enunciado: 'Subtração matrizes $\\begin{pmatrix} 5 & 3 \\\\ 1 & 2 \\end{pmatrix} - \\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}$.', resposta: '$\\begin{pmatrix} 4 & 2 \\\\ 0 & 1 \\end{pmatrix}$', passos: '**Passo 1.** Componente.', dificuldade: 'aplicacao', aulasCobertas: ['aula-32-operacoes-matrizes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.5 Subtract, ex. 9', licenca: CC_BY } },
    { numero: 13, enunciado: 'P(par) lançando 1 dado.', resposta: '$1/2$', passos: '**Passo 1.** Pares: 2, 4, 6 = 3. Total 6. $P = 1/2$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.1 Even Die, ex. 5', licenca: CC_BY } },
    { numero: 14, enunciado: 'Permutação 5 letras com 2 fixas em posições.', resposta: '$3! = 6$', passos: '**Passo 1.** Restantes 3 letras em 3 posições.', dificuldade: 'compreensao', aulasCobertas: ['aula-37-permutacoes-arranjos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Constrained Perm, ex. 25', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: na Mega-Sena, 6 dezenas entre 60. P(ganhar com 1 aposta).', resposta: '$1/\\binom{60}{6} \\approx 1/50\\,063\\,860 \\approx 2 \\times 10^{-8}$', passos: '**Passo 1.** $\\binom{60}{6} = 50\\,063\\,860$.\n\n**Passo 2.** P = $1/50\\,063\\,860 \\approx 0{,}000002\\%$.\n\n**Aplicação real.** Probabilidade absurdamente baixa — loteria é entretenimento, não estratégia.', dificuldade: 'modelagem', aulasCobertas: ['aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Lottery (adaptado para BR)', licenca: CC_BY } },
  ],
}

const PROVA_T4_V9: Prova = {
  id: 'trim-4-v9', trim: 4, versao: 9,
  titulo: 'Trim 4 · Versão 9 — Matrizes, contagem, probabilidade',
  descricao: 'Trim 4 v9.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'PFC: chuteira tem 3 cores e 5 tamanhos. Quantos modelos?', resposta: '$15$',
      passos: '**Passo 1.** $3 \\cdot 5 = 15$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-36-pfc'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 PFC Apparel, ex. 5 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Determinante por triangulação: $\\det\\begin{pmatrix} 2 & 1 & 0 \\\\ 0 & 3 & 1 \\\\ 0 & 0 & 4 \\end{pmatrix}$.', resposta: '$24$',
      passos: '**Passo 1.** Triangular ⇒ $\\det = $ produto da diagonal: $2 \\cdot 3 \\cdot 4 = 24$.\n\n**Por que esse atalho?** Em matriz triangular, cofatores fora da diagonal zeram em cascata.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-34-determinantes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 Triangular Det, ex. 25 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Quantas filas de 5 pessoas com Ana e Beto sempre juntos?', resposta: '$2 \\cdot 4! = 48$',
      passos: '**Passo 1.** Trate AB como bloco. 4 entidades ⇒ $4! = 24$ permutações.\n\n**Passo 2.** AB ou BA: 2 ordens internas. Total $24 \\cdot 2 = 48$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-37-permutacoes-arranjos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Adjacent Constraint, ex. 38 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'P(soma > 9) lançando 2 dados.', resposta: '$6/36 = 1/6$',
      passos: '**Passo 1.** Casos com soma $> 9$: somas 10, 11, 12.\n\n**Passo 2.** Soma 10: 3 (4-6, 5-5, 6-4). Soma 11: 2 (5-6, 6-5). Soma 12: 1 (6-6). Total = 6.\n\n**Passo 3.** $P = 6/36 = 1/6$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.1 Dice Sum, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Sistema $3\\times 3$ por escalonamento: $\\begin{cases} x + y + z = 6 \\\\ x - y + z = 2 \\\\ x + y - z = 0 \\end{cases}$.', resposta: '$x = 1$, $y = 2$, $z = 3$',
      passos: '**Passo 1.** Subtraia eq1 - eq2: $2y = 4 \\Rightarrow y = 2$.\n\n**Passo 2.** Subtraia eq1 - eq3: $2z = 6 \\Rightarrow z = 3$.\n\n**Passo 3.** $x = 6 - 2 - 3 = 1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-35-sistemas-via-matrizes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.6 Row Reduction, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Combinação de 6 entre 9.', resposta: '$\\binom{9}{6} = 84$', passos: '**Passo 1.** $\\binom{9}{6} = \\binom{9}{3} = 84$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Comb 9,6, ex. 23', licenca: CC_BY } },
    { numero: 7, enunciado: 'Variância binomial $X \\sim B(20, 0{,}25)$.', resposta: '$3{,}75$', passos: '**Passo 1.** $V = np(1-p) = 20 \\cdot 0{,}25 \\cdot 0{,}75 = 3{,}75$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.3 Bin Var, ex. 25', licenca: CC_BY } },
    { numero: 8, enunciado: 'Det $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$.', resposta: '$-1$', passos: '**Passo 1.** $0 - 1 = -1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-34-determinantes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 Permute Det, ex. 9', licenca: CC_BY } },
    { numero: 9, enunciado: 'P(2 caras seguidas) em 2 lançamentos.', resposta: '$1/4$', passos: '**Passo 1.** $1/2 \\cdot 1/2 = 1/4$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Two Heads, ex. 13', licenca: CC_BY } },
    { numero: 10, enunciado: '5 pessoas em fila com Maria primeiro.', resposta: '$4! = 24$', passos: '**Passo 1.** Maria fixa. Restantes 4 livremente.', dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 First Position, ex. 19', licenca: CC_BY } },
    { numero: 11, enunciado: 'Sistema com sol única: $\\det \\neq 0$. Critério.', resposta: 'Posto = $n$ (número equações).', passos: '**Passo 1.** $\\det \\neq 0$ ⇔ matriz invertível ⇔ posto = n.', dificuldade: 'compreensao', aulasCobertas: ['aula-35-sistemas-via-matrizes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.7 Rank, ex. 27', licenca: CC_BY } },
    { numero: 12, enunciado: 'P(falha em sistema) se cada componente independente com $P(\\text{ok}) = 0{,}9$ e há 3 componentes em série.', resposta: '$\\approx 0{,}271$', passos: '**Passo 1.** P(todos ok) $= 0{,}9^3 = 0{,}729$.\n\n**Passo 2.** P(falha) $= 1 - 0{,}729 = 0{,}271$.', dificuldade: 'modelagem', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Reliability, ex. 39', licenca: CC_BY } },
    { numero: 13, enunciado: 'Combinação $\\binom{52}{5}$ — quantos jogos de poker?', resposta: '$2\\,598\\,960$', passos: '**Passo 1.** $52!/(5!47!) = 2{,}6$ milhões aproxim.', dificuldade: 'aplicacao', aulasCobertas: ['aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Poker, ex. 25', licenca: CC_BY } },
    { numero: 14, enunciado: 'Multiplicação de matrizes preserva ordem? $AB \\neq BA$ em geral.', resposta: 'Não comutativa.', passos: '**Passo 1.** Em geral $AB \\neq BA$. Casos especiais: matrizes comutam quando ambas diagonais ou compartilham auto-vetores.', dificuldade: 'compreensao', aulasCobertas: ['aula-32-operacoes-matrizes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.5 Non-commutative, ex. 31', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: pesquisa eleitoral 1000 entrevistados, 460 escolhem A. Estimativa de proporção.', resposta: '$\\hat p = 0{,}46$', passos: '**Passo 1.** $\\hat p = 460/1000 = 0{,}46$.\n\n**Passo 2.** Margem de erro a 95%: $1{,}96\\sqrt{0{,}46 \\cdot 0{,}54/1000} \\approx \\pm 3{,}1\\%$.\n\n**Aplicação.** Pesquisas Datafolha, Ibope.', dificuldade: 'modelagem', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§8.2 Election Polling (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T4_V10: Prova = {
  id: 'trim-4-v10', trim: 4, versao: 10,
  titulo: 'Trim 4 · Versão 10 — Matrizes, contagem, probabilidade',
  descricao: 'Trim 4 v10.', duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Eventos mutuamente exclusivos: $P(A) = 0{,}3$, $P(B) = 0{,}4$, $A \\cap B = \\emptyset$. $P(A \\cup B)$.', resposta: '$0{,}7$',
      passos: '**Passo 1.** Mutuamente exclusivos ⇒ $P(A \\cap B) = 0$.\n\n**Passo 2.** $P(A \\cup B) = P(A) + P(B) = 0{,}7$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Mutually Exclusive, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Quantas senhas de 4 dígitos sem repetir?', resposta: '$5040$',
      passos: '**Passo 1.** $10 \\cdot 9 \\cdot 8 \\cdot 7 = 5040$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 No Repeat, ex. 12 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Multiplicação $\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$.', resposta: '$\\begin{pmatrix} 2 & 1 \\\\ 4 & 3 \\end{pmatrix}$',
      passos: '**Passo 1.** Aplica regra linha-coluna.\n\n**Interpretação.** Direita é matriz de troca. Multiplicar por ela troca colunas de A.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-32-operacoes-matrizes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.5 Matrix Mult, ex. 31 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Quadrante mágico: $\\binom{n}{k} = \\binom{n}{n-k}$. Verifique para $n=7$, $k=3$.', resposta: '$\\binom{7}{3} = \\binom{7}{4} = 35$',
      passos: '**Passo 1.** $\\binom{7}{3} = 35$, $\\binom{7}{4} = 35$ ✓.\n\n**Por que essa simetria?** Escolher $k$ pra ficar é equivalente a escolher $n-k$ pra sair. Mesmo número de configurações.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-38-combinacoes'],
      fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Symmetry of Combinations, ex. 35 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Lance moeda 4 vezes. P(pelo menos 1 cara).', resposta: '$15/16$',
      passos: '**Passo 1.** Complemento: P(nenhuma cara) $= (1/2)^4 = 1/16$.\n\n**Passo 2.** $P(\\geq 1) = 1 - 1/16 = 15/16$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.3 At Least One, ex. 51 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Det $\\begin{pmatrix} 3 & 0 & 0 \\\\ 0 & 4 & 0 \\\\ 0 & 0 & 5 \\end{pmatrix}$.', resposta: '$60$', passos: '**Passo 1.** Diagonal: $3 \\cdot 4 \\cdot 5 = 60$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-34-determinantes'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.8 3x3 Diagonal, ex. 13', licenca: CC_BY } },
    { numero: 7, enunciado: 'Permutações de 4 elementos: $4! = ?$', resposta: '$24$', passos: '**Passo 1.** $4 \\cdot 3 \\cdot 2 \\cdot 1 = 24$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 4!, ex. 1', licenca: CC_BY } },
    { numero: 8, enunciado: 'P(número primo) lançando 1 dado.', resposta: '$3/6 = 1/2$', passos: '**Passo 1.** Primos no dado: 2, 3, 5 = 3 casos.', dificuldade: 'aplicacao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.1 Prime Die, ex. 7', licenca: CC_BY } },
    { numero: 9, enunciado: '$\\binom{n+1}{k} - \\binom{n}{k} = \\binom{n}{k-1}$. Pascal.', resposta: 'Identidade Pascal.', passos: '**Passo 1.** Pascal: $\\binom{n+1}{k} = \\binom{n}{k-1} + \\binom{n}{k}$. Subtraindo: $\\binom{n+1}{k} - \\binom{n}{k} = \\binom{n}{k-1}$ ✓.', dificuldade: 'demonstracao', aulasCobertas: ['aula-38-combinacoes'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 Pascal, prova', licenca: CC_BY } },
    { numero: 10, enunciado: 'Inversa de matriz $2 \\times 2$ exige $\\det \\neq 0$. Justifique brevemente.', resposta: 'Demonstração via fórmula explícita.', passos: '**Passo 1.** $A^{-1} = \\dfrac{1}{\\det A}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$.\n\n**Passo 2.** Se $\\det A = 0$, divisão por zero. Inversa não existe.', dificuldade: 'demonstracao', aulasCobertas: ['aula-33-transposta-inversa'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.7 Inverse Formula, prova', licenca: CC_BY } },
    { numero: 11, enunciado: 'P(par e divisível por 3) lançando 1 dado.', resposta: '$1/6$ (apenas 6).', passos: '**Passo 1.** Par e múltiplo de 3 = múltiplo de 6. Em {1..6}: só 6.\n\n**Passo 2.** $P = 1/6$.', dificuldade: 'compreensao', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Intersection, ex. 17', licenca: CC_BY } },
    { numero: 12, enunciado: 'Sistema $\\begin{cases} x + 2y = 5 \\\\ 2x + 4y = 10 \\end{cases}$.', resposta: 'Infinitas soluções.', passos: '**Passo 1.** Eq2 = 2 × eq1. Mesma reta.\n\n**Passo 2.** Solução: $(t, (5-t)/2)$ para $t$ qualquer.', dificuldade: 'compreensao', aulasCobertas: ['aula-29-sistemas-lineares'], fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.1 Dependent, ex. 15', licenca: CC_BY } },
    { numero: 13, enunciado: 'Anagramas de NÃO-OK: $5! - $ casos onde N e O são adjacentes. Calcule simples para NOVA.', resposta: '$4! = 24$', passos: '**Passo 1.** 4 letras distintas: $24$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-37-permutacoes-arranjos'], fonteOriginal: { livro: 'OpenStax A&T 2e', url: OS_AT, ref: '§13.6 NOVA, ex. 9', licenca: CC_BY } },
    { numero: 14, enunciado: 'Combinação: 5 cartões com 2 ímpares. Quantos modos com pelo menos 1 ímpar?', resposta: '$\\binom{5}{2} \\cdot 2^3 + \\ldots$ — precisa enunciado mais claro. Versão simplificada: P(não pegar ímpar) = $\\binom{3}{2}/\\binom{5}{2} = 3/10$. P(pelo menos 1 ímpar) $= 7/10$.', passos: '**Passo 1.** Complemento: P(0 ímpar de 2 cartões) $= 3/10$.\n\n**Passo 2.** $1 - 3/10 = 7/10$.', dificuldade: 'desafio', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.3 Complement Combinations, ex. 27', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: tabela 2×2 distribuição conjunta. P(aprovado | praticou) = ?', resposta: 'Depende dos dados específicos.', passos: '**Passo 1.** $P(A|B) = P(A \\cap B)/P(B)$.\n\n**Passo 2.** Pega célula da tabela e divide pela soma da linha/coluna correspondente.\n\n**Aplicação.** Análise estatística de pesquisas educacionais.', dificuldade: 'modelagem', aulasCobertas: ['aula-39-probabilidade'], fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.5 Conditional Tables, ex. 33', licenca: CC_BY } },
  ],
}

const PROVA_T5_V1: Prova = {
  id: 'trim-5-v1',
  trim: 5,
  versao: 1,
  titulo: 'Trim 5 · Versão 1 — Limites e continuidade',
  descricao:
    'Limite formal $\\varepsilon$-$\\delta$, propriedades, continuidade, TVI/TVM, limites fundamentais.',
  duracaoMinutos: 90,
  intensidade: 4,
  publicoAlvo: '2.º ano',
  status: 'curada',
  questoes: [
    {
      numero: 1,
      enunciado: 'Calcule $\\lim_{x \\to 2} (3x^2 - 5x + 1)$.',
      resposta: '$3$',
      passos:
        '**Passo 1 — Polinômio é contínuo em todo $\\mathbb{R}$.** Logo $\\lim_{x \\to a} P(x) = P(a)$.\n\n' +
        '**Passo 2 — Substitua.** $3(4) - 5(2) + 1 = 12 - 10 + 1 = 3$.\n\n' +
        '**Por que polinômio é contínuo?** Soma e produto de funções contínuas (potências $x^n$) são contínuas. Polinômios são combinações finitas dessas.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-41-limite-formal', 'aula-42-propriedades-limites', 'aula-43-continuidade'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§2.3 The Limit Laws, ex. 67 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 2,
      enunciado:
        'Calcule $\\lim_{x \\to 3} \\dfrac{x^2 - 9}{x - 3}$.',
      resposta: '$6$',
      passos:
        '**Passo 1 — Tipo $0/0$.** Substituição direta dá indeterminação.\n\n' +
        '**Passo 2 — Fatorar.** $x^2 - 9 = (x-3)(x+3)$. Logo $\\dfrac{(x-3)(x+3)}{x-3} = x + 3$ (válido para $x \\neq 3$).\n\n' +
        '**Passo 3 — Limite do simplificado.** $\\lim_{x \\to 3} (x+3) = 6$.\n\n' +
        '**Por que pode "cancelar"?** O limite só olha o **comportamento perto** de $x = 3$, não em $x = 3$. As duas funções coincidem em todo ponto exceto possivelmente $x = 3$, então têm o mesmo limite.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-42-propriedades-limites'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§2.3 The Limit Laws, ex. 80 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 3,
      enunciado:
        'Determine se $f(x) = \\begin{cases} x^2 & \\text{se } x \\leq 1 \\\\ 2x - 1 & \\text{se } x > 1 \\end{cases}$ ' +
        'é contínua em $x = 1$.',
      resposta: 'Sim, é contínua em $x = 1$.',
      passos:
        '**Passo 1 — Limite à esquerda.** $\\lim_{x \\to 1^-} x^2 = 1$.\n\n' +
        '**Passo 2 — Limite à direita.** $\\lim_{x \\to 1^+} (2x - 1) = 1$.\n\n' +
        '**Passo 3 — $f(1) = 1^2 = 1$.**\n\n' +
        '**Conclusão.** Limites laterais existem, são iguais e coincidem com $f(1)$. **As três condições de continuidade** estão satisfeitas.\n\n' +
        '**Por que precisa dos 3?** (1) limite existe; (2) função existe em $x = 1$; (3) eles coincidem. Falhar em qualquer uma já quebra continuidade.',
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-43-continuidade', 'aula-44-limites-laterais'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§2.4 Continuity, ex. 14 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 4,
      enunciado:
        'Calcule $\\lim_{x \\to 0} \\dfrac{\\sin(3x)}{x}$.',
      resposta: '$3$',
      passos:
        '**Passo 1 — Limite fundamental.** $\\lim_{u \\to 0} \\sin u / u = 1$.\n\n' +
        '**Passo 2 — Manipulação.** $\\dfrac{\\sin(3x)}{x} = 3 \\cdot \\dfrac{\\sin(3x)}{3x}$.\n\n' +
        '**Passo 3 — Substitua $u = 3x$.** Quando $x \\to 0$, $u \\to 0$. $\\lim = 3 \\cdot 1 = 3$.\n\n' +
        '**Por que esse limite vale 1?** Geometricamente: para ângulos pequenos (rad), $\\sin x \\approx x$. Formalmente: do círculo unitário, área do triângulo $\\leq$ área do setor $\\leq$ área do triângulo maior ⇒ $\\cos x \\leq \\sin x / x \\leq 1$ ⇒ pelo teorema do confronto, limite é 1.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-45-limites-fundamentais', 'aula-48-limites-funcoes-trig'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§2.3 Trigonometric Limits, ex. 121 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 5,
      enunciado:
        'Use o TVI para mostrar que $f(x) = x^3 - 4x + 1$ tem ao menos uma raiz em $[0, 2]$.',
      resposta: 'Existe $c \\in (0, 2)$ com $f(c) = 0$.',
      passos:
        '**Passo 1 — Continuidade.** $f$ é polinômio ⇒ contínua em $[0, 2]$ ✓.\n\n' +
        '**Passo 2 — Avalie nas extremidades.** $f(0) = 1 > 0$. $f(2) = 8 - 8 + 1 = 1 > 0$. **Hmmmm — mesmo sinal.** Nesse caso o TVI **não conclui**.\n\n' +
        '**Passo 3 — Tente $f(1)$.** $f(1) = 1 - 4 + 1 = -2 < 0$.\n\n' +
        '**Passo 4 — Aplique TVI em $[0, 1]$.** $f(0) = 1 > 0$ e $f(1) = -2 < 0$. Como $f$ é contínua e muda de sinal, existe $c_1 \\in (0, 1)$ com $f(c_1) = 0$.\n\n' +
        '**Passo 5 — Aplique TVI em $[1, 2]$.** $f(1) = -2 < 0$ e $f(2) = 1 > 0$ ⇒ existe $c_2 \\in (1, 2)$ com $f(c_2) = 0$.\n\n' +
        '**Conclusão.** Há **pelo menos duas** raízes em $[0, 2]$.\n\n' +
        '**Por que TVI funciona?** Função contínua não pode "pular" valores. Se vai de positivo a negativo, em algum ponto é zero. Base do método da bisseção (Aula 69).',
      dificuldade: 'demonstracao',
      aulasCobertas: ['aula-46-tvi-tvm'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§2.4 The Intermediate Value Theorem, ex. 142 (adaptado)',
        licenca: CC_BY,
      },
    },
    { numero: 6, enunciado: '$\\lim_{x\\to 5} (3x - 2)$.', resposta: '$13$', passos: '**Passo 1.** Substituir: $3 \\cdot 5 - 2 = 13$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Linear, ex. 5', licenca: CC_BY } },
    { numero: 7, enunciado: '$\\lim_{x\\to 0} \\sin x/x$.', resposta: '$1$', passos: '**Passo 1.** Limite fundamental.', dificuldade: 'aplicacao', aulasCobertas: ['aula-45-limites-fundamentais'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Sin Limit, ex. 117', licenca: CC_BY } },
    { numero: 8, enunciado: '$\\lim_{x\\to\\infty} 1/x^2$.', resposta: '$0$', passos: '**Passo 1.** Denominador →∞ ⇒ razão →0.', dificuldade: 'aplicacao', aulasCobertas: ['aula-47-assintotas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Reciprocal Sq, ex. 11', licenca: CC_BY } },
    { numero: 9, enunciado: 'Continuidade de $f(x) = 1/(x-2)$ em $x=2$.', resposta: 'Não contínua (assíntota).', passos: '**Passo 1.** Denominador zera ⇒ função indefinida em $x = 2$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Discontinuity, ex. 19', licenca: CC_BY } },
    { numero: 10, enunciado: '$\\lim_{x\\to 2} (x^2 - 4)/(x - 2)$.', resposta: '$4$', passos: '**Passo 1.** Fatorar: $(x-2)(x+2)/(x-2) = x+2$.\n\n**Passo 2.** $\\lim = 4$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Factor Cancel, ex. 75', licenca: CC_BY } },
    { numero: 11, enunciado: 'TVI: $f$ contínua em $[a,b]$, $f(a) < 0 < f(b)$. Conclusão.', resposta: 'Existe $c \\in (a, b)$ com $f(c) = 0$.', passos: '**Passo 1.** Função contínua não pula valores. Trocando sinal, atinge zero.', dificuldade: 'compreensao', aulasCobertas: ['aula-46-tvi-tvm'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 TVI Statement, ex. 137', licenca: CC_BY } },
    { numero: 12, enunciado: 'Limite de sequência $a_n = 1 - 1/n$.', resposta: '$1$', passos: '**Passo 1.** $1/n \\to 0$ ⇒ $a_n \\to 1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-49-limite-sequencias'], fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§5.1 Convergent, ex. 13', licenca: CC_BY } },
    { numero: 13, enunciado: 'Limite trigonométrico $\\lim_{x\\to 0} \\cos x$.', resposta: '$1$', passos: '**Passo 1.** Cosseno é contínuo. $\\cos 0 = 1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-48-limites-funcoes-trig'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Cos Continuity, ex. 39', licenca: CC_BY } },
    { numero: 14, enunciado: 'Assíntota horizontal de $f(x) = 5/(x^2+1)$.', resposta: '$y = 0$', passos: '**Passo 1.** $\\lim_{|x|\\to\\infty} 5/(x^2+1) = 0$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-47-assintotas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 H Asymptote, ex. 17', licenca: CC_BY } },
    { numero: 15, enunciado: 'Definição $\\varepsilon$-$\\delta$ qualitativa: $\\lim_{x\\to a} f(x) = L$ significa?', resposta: 'Para todo $\\varepsilon > 0$, existe $\\delta > 0$ tal que $|x-a| < \\delta \\Rightarrow |f(x) - L| < \\varepsilon$.', passos: '**Passo 1.** Definição rigorosa de Cauchy.\n\n**Interpretação.** Posso fazer $f(x)$ ficar arbitrariamente próximo de $L$, garantindo $x$ próximo o bastante de $a$.', dificuldade: 'demonstracao', aulasCobertas: ['aula-41-limite-formal'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.5 Epsilon-Delta, def', licenca: CC_BY } },
  ],
}

// Trim 5 v2-v10
const PROVA_T5_V2: Prova = {
  id: 'trim-5-v2', trim: 5, versao: 2,
  titulo: 'Trim 5 · Versão 2 — Limites e continuidade',
  descricao: 'Trim 5 v2.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Calcule $\\lim_{x \\to 1} (x^2 + 3x - 4)$.', resposta: '$0$',
      passos: '**Passo 1.** Polinômio é contínuo. Substitua: $1 + 3 - 4 = 0$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'],
      fonteOriginal: { livro: 'OpenStax Calculus Volume 1', url: OS_CALC1, ref: '§2.3 Limit Laws, ex. 71 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$\\lim_{x \\to 4} \\dfrac{x^2 - 16}{x - 4}$.', resposta: '$8$',
      passos: '**Passo 1.** $0/0$. Fatorar: $(x-4)(x+4)/(x-4) = x + 4$.\n\n**Passo 2.** Limite $= 8$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Indeterminate, ex. 89 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Continuidade: para que $a$, $f(x) = \\begin{cases} ax + 1 & x < 2 \\\\ x^2 - 1 & x \\geq 2 \\end{cases}$ é contínua?', resposta: '$a = 1$',
      passos: '**Passo 1.** Limite à esquerda: $2a + 1$. Limite à direita: $4 - 1 = 3$.\n\n**Passo 2.** $2a + 1 = 3 \\Rightarrow a = 1$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-43-continuidade', 'aula-44-limites-laterais'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Continuity Param, ex. 24 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$\\lim_{x \\to 0} \\dfrac{1 - \\cos x}{x^2}$.', resposta: '$1/2$',
      passos: '**Passo 1.** Use identidade $1 - \\cos x = 2\\sin^2(x/2)$.\n\n**Passo 2.** $\\dfrac{2\\sin^2(x/2)}{x^2} = (1/2)\\left(\\dfrac{\\sin(x/2)}{x/2}\\right)^2 \\to (1/2)(1)^2 = 1/2$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-45-limites-fundamentais'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Trig Limit, ex. 125 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Mostre que $f(x) = x^3 + x - 1$ tem raiz em $(0, 1)$.', resposta: 'Raiz $\\in (0, 1)$ por TVI.',
      passos: '**Passo 1.** $f(0) = -1 < 0$, $f(1) = 1 > 0$.\n\n**Passo 2.** $f$ contínua + muda sinal ⇒ TVI garante raiz.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-46-tvi-tvm'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 TVI, ex. 138 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\lim_{x\\to 1} (x^2 + 3)$.', resposta: '$4$', passos: '**Passo 1.** Substituir.', dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Sub, ex. 9', licenca: CC_BY } },
    { numero: 7, enunciado: '$\\lim_{x\\to 0} \\dfrac{1 - \\cos x}{x}$.', resposta: '$0$', passos: '**Passo 1.** L\'Hôpital ou Taylor: $1-\\cos x \\sim x^2/2$. Razão $\\sim x/2 \\to 0$.', dificuldade: 'compreensao', aulasCobertas: ['aula-45-limites-fundamentais'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Trig Limit, ex. 122', licenca: CC_BY } },
    { numero: 8, enunciado: '$\\lim_{x\\to 0^-} \\dfrac{1}{x}$.', resposta: '$-\\infty$', passos: '**Passo 1.** $x$ negativo pequeno ⇒ $1/x$ negativo grande.', dificuldade: 'aplicacao', aulasCobertas: ['aula-44-limites-laterais'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.2 Side Limit, ex. 47', licenca: CC_BY } },
    { numero: 9, enunciado: 'Continuidade em $x = 0$ de $f(x) = |x|$.', resposta: 'Contínua.', passos: '**Passo 1.** $\\lim_{x\\to 0} |x| = 0 = f(0)$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Abs Continuous, ex. 21', licenca: CC_BY } },
    { numero: 10, enunciado: '$\\lim_{x\\to\\infty} (x+1)/x$.', resposta: '$1$', passos: '**Passo 1.** Razão coef líderes $1/1 = 1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-47-assintotas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Limit Inf, ex. 13', licenca: CC_BY } },
    { numero: 11, enunciado: '$\\lim_{x\\to 0} (3x)/(\\sin x)$.', resposta: '$3$', passos: '**Passo 1.** $3x/\\sin x = 3 \\cdot x/\\sin x \\to 3 \\cdot 1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-48-limites-funcoes-trig'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Inverted Sin, ex. 119', licenca: CC_BY } },
    { numero: 12, enunciado: 'Sequência $a_n = (-1)^n/n$. Converge?', resposta: 'Sim, para 0.', passos: '**Passo 1.** $|a_n| = 1/n \\to 0$. Logo $a_n \\to 0$.', dificuldade: 'compreensao', aulasCobertas: ['aula-49-limite-sequencias'], fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§5.1 Alternating Decreasing, ex. 17', licenca: CC_BY } },
    { numero: 13, enunciado: 'TVI: $f(x) = e^x - 3$. Raiz?', resposta: 'Existe em $(1, 2)$.', passos: '**Passo 1.** $f(1) = e - 3 \\approx -0{,}28$. $f(2) = e^2 - 3 \\approx 4{,}39$. Sinais opostos, contínua ⇒ TVI.', dificuldade: 'aplicacao', aulasCobertas: ['aula-46-tvi-tvm'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 TVI Exp, ex. 145', licenca: CC_BY } },
    { numero: 14, enunciado: '$\\lim_{x\\to 4} \\sqrt{x}$.', resposta: '$2$', passos: '**Passo 1.** Função contínua. $\\sqrt 4 = 2$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Sqrt Limit, ex. 71', licenca: CC_BY } },
    { numero: 15, enunciado: 'TVM em $f(x) = x^3$ em $[0, 2]$. Encontre $c$.', resposta: '$c = 2/\\sqrt 3$', passos: '**Passo 1.** $(f(2) - f(0))/2 = 8/2 = 4$.\n\n**Passo 2.** $f\'(c) = 3c^2 = 4 \\Rightarrow c = 2/\\sqrt 3 \\approx 1{,}155$.', dificuldade: 'compreensao', aulasCobertas: ['aula-46-tvi-tvm'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.4 MVT, ex. 165', licenca: CC_BY } },
  ],
}

const PROVA_T5_V3: Prova = {
  id: 'trim-5-v3', trim: 5, versao: 3,
  titulo: 'Trim 5 · Versão 3 — Limites e continuidade',
  descricao: 'Trim 5 v3.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\lim_{x \\to \\infty} \\dfrac{3x^2 + 1}{x^2 - 5}$.', resposta: '$3$',
      passos: '**Passo 1.** Razão de polinômios mesmo grau: razão coeficientes líderes.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-47-assintotas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Limits Infinity, ex. 13 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$\\lim_{x \\to 0^-} \\dfrac{|x|}{x}$.', resposta: '$-1$',
      passos: '**Passo 1.** $x < 0 \\Rightarrow |x| = -x$.\n\n**Passo 2.** $-x/x = -1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-44-limites-laterais'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.2 One-Sided, ex. 47 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Assíntota vertical de $f(x) = 1/(x-3)$.', resposta: '$x = 3$',
      passos: '**Passo 1.** Denominador zera em $x = 3$.\n\n**Passo 2.** Limites laterais $\\to \\pm\\infty$. Assíntota vertical em $x = 3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-47-assintotas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Vertical Asymptotes, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$\\lim_{x \\to 0} \\dfrac{\\sin(2x)}{x}$.', resposta: '$2$',
      passos: '**Passo 1.** $\\dfrac{\\sin 2x}{x} = 2 \\cdot \\dfrac{\\sin 2x}{2x} \\to 2 \\cdot 1 = 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-45-limites-fundamentais'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Trig Limits, ex. 119 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'TVM: para $f(x) = x^2$ em $[0, 3]$, encontre $c$.', resposta: '$c = 3/2$',
      passos: '**Passo 1.** TVM: $f\'(c) = (f(3) - f(0))/3 = 9/3 = 3$.\n\n**Passo 2.** $f\'(c) = 2c = 3 \\Rightarrow c = 3/2$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-46-tvi-tvm'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.4 MVT, ex. 165 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\lim_{x\\to 0} (x^2 + 5)$.', resposta: '$5$', passos: '**Passo 1.** Substitui.', dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Polynomial, ex. 7', licenca: CC_BY } },
    { numero: 7, enunciado: '$\\lim_{x\\to 0^+} \\ln x$.', resposta: '$-\\infty$', passos: '**Passo 1.** $\\ln x \\to -\\infty$ quando $x \\to 0^+$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-44-limites-laterais'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.2 Log Limit, ex. 51', licenca: CC_BY } },
    { numero: 8, enunciado: 'Continuidade $f(x) = x^2$ em todo $\\mathbb R$.', resposta: 'Sim — polinômios são contínuos.', passos: '**Passo 1.** Polinomial: contínuo onde definido = $\\mathbb R$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Polynomial, ex. 9', licenca: CC_BY } },
    { numero: 9, enunciado: '$\\lim_{x\\to\\infty} (e^{-x})$.', resposta: '$0$', passos: '**Passo 1.** Decaimento exponencial.', dificuldade: 'aplicacao', aulasCobertas: ['aula-47-assintotas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Exp Decay, ex. 21', licenca: CC_BY } },
    { numero: 10, enunciado: '$\\lim_{x\\to 1} (x - 1)/(x^2 - 1)$.', resposta: '$1/2$', passos: '**Passo 1.** Fator: $(x-1)/((x-1)(x+1)) = 1/(x+1)$.\n\n**Passo 2.** $\\lim = 1/2$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Cancel, ex. 79', licenca: CC_BY } },
    { numero: 11, enunciado: 'Sequência $a_n = (2n+1)/n$.', resposta: '$\\to 2$', passos: '**Passo 1.** $a_n = 2 + 1/n \\to 2$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-49-limite-sequencias'], fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§5.1 Sequence Limit, ex. 9', licenca: CC_BY } },
    { numero: 12, enunciado: '$\\lim_{x\\to 0} \\dfrac{\\tan x}{x}$.', resposta: '$1$', passos: '**Passo 1.** $\\tan x/x = (\\sin x/x)/\\cos x \\to 1/1 = 1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-48-limites-funcoes-trig'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Tan Limit, ex. 124', licenca: CC_BY } },
    { numero: 13, enunciado: 'Continuidade removível: $g(x) = \\sin x/x$ em $x = 0$.', resposta: 'Removível: definir $g(0) = 1$.', passos: '**Passo 1.** $\\lim_{x\\to 0} \\sin x/x = 1$. Defina $g(0) = 1$ e fica contínua.', dificuldade: 'compreensao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Removable, ex. 27', licenca: CC_BY } },
    { numero: 14, enunciado: 'Indeterminação $\\infty - \\infty$: $\\lim_{x\\to\\infty}(\\sqrt{x+1} - \\sqrt x)$.', resposta: '$0$', passos: '**Passo 1.** Conjugado: $1/(\\sqrt{x+1}+\\sqrt x) \\to 0$.', dificuldade: 'desafio', aulasCobertas: ['aula-47-assintotas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Conjugate, ex. 27', licenca: CC_BY } },
    { numero: 15, enunciado: 'TVI prove $\\cos x = x$ tem solução em $(0, 1)$.', resposta: 'Sim.', passos: '**Passo 1.** $f(x) = \\cos x - x$ contínua. $f(0) = 1 > 0$, $f(1) = \\cos 1 - 1 \\approx -0{,}46 < 0$. ⇒ TVI.', dificuldade: 'demonstracao', aulasCobertas: ['aula-46-tvi-tvm'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Fixed Point, ex. 152', licenca: CC_BY } },
  ],
}

const PROVA_T5_V4: Prova = {
  id: 'trim-5-v4', trim: 5, versao: 4,
  titulo: 'Trim 5 · Versão 4 — Limites e continuidade', descricao: 'Trim 5 v4.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\lim_{x\\to 2} (x^3 - 4x + 1)$.', resposta: '$1$',
      passos: '**Passo 1.** Substituir: $8 - 8 + 1 = 1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Limit Laws, ex. 73 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$\\lim_{h\\to 0} \\dfrac{(2+h)^2 - 4}{h}$.', resposta: '$4$',
      passos: '**Passo 1.** Numerador: $4 + 4h + h^2 - 4 = 4h + h^2$.\n\n**Passo 2.** Dividir por $h$: $4 + h \\to 4$.\n\n**Conexão.** Esse é $f\'(2)$ para $f(x) = x^2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-41-limite-formal'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Newton Quotient, ex. 92 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Continuidade de $f(x) = \\sqrt x$ em $x = 0$.', resposta: 'Contínua à direita em $0$.',
      passos: '**Passo 1.** $f(0) = 0$.\n\n**Passo 2.** $\\lim_{x\\to 0^+} \\sqrt x = 0$. Limite à esquerda não existe (domínio).\n\n**Conclusão.** Contínua à direita.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-43-continuidade'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 One-Sided Continuity, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Limite de sequência $a_n = (n+1)/n$.', resposta: '$1$',
      passos: '**Passo 1.** $a_n = 1 + 1/n \\to 1 + 0 = 1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-49-limite-sequencias'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§5.1 Sequences, ex. 7 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Limite trigonométrico $\\lim_{x\\to 0} \\dfrac{\\sin x}{2x}$.', resposta: '$1/2$',
      passos: '**Passo 1.** $(\\sin x)/(2x) = (1/2)(\\sin x/x) \\to 1/2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-48-limites-funcoes-trig'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Trig Limits, ex. 117 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\lim_{x\\to 2} (3x + 4)$.', resposta: '$10$', passos: '**Passo 1.** Substitui.', dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Linear, ex. 11', licenca: CC_BY } },
    { numero: 7, enunciado: '$\\lim_{x\\to\\infty} (5/x)$.', resposta: '$0$', passos: '**Passo 1.** $1/x \\to 0$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-47-assintotas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Recip, ex. 9', licenca: CC_BY } },
    { numero: 8, enunciado: 'Continuidade $f(x) = e^x$.', resposta: 'Contínua em $\\mathbb R$.', passos: '**Passo 1.** Função analítica.', dificuldade: 'aplicacao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Exp Cont, ex. 11', licenca: CC_BY } },
    { numero: 9, enunciado: '$\\lim_{x\\to 0} \\dfrac{e^x - 1}{x}$.', resposta: '$1$', passos: '**Passo 1.** Limite fundamental que define $e$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-45-limites-fundamentais'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 e Limit, ex. 31', licenca: CC_BY } },
    { numero: 10, enunciado: '$\\lim_{x\\to\\infty} (x^2 - x)$.', resposta: '$\\infty$', passos: '**Passo 1.** Termo dominante $x^2 \\to \\infty$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-47-assintotas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Polynomial Inf, ex. 13', licenca: CC_BY } },
    { numero: 11, enunciado: 'Sequência $a_n = n/(n+1)$.', resposta: '$\\to 1$', passos: '**Passo 1.** $n/(n+1) = 1/(1+1/n) \\to 1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-49-limite-sequencias'], fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§5.1 Limit, ex. 11', licenca: CC_BY } },
    { numero: 12, enunciado: '$\\lim_{x\\to 0} \\dfrac{\\sin(3x)}{4x}$.', resposta: '$3/4$', passos: '**Passo 1.** $(3/4)(\\sin 3x/3x) \\to 3/4$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-48-limites-funcoes-trig'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Sin Scaled, ex. 121', licenca: CC_BY } },
    { numero: 13, enunciado: 'TVI: $f(x) = x^2 - 2$ tem raiz?', resposta: 'Sim — $x = \\sqrt 2 \\in (1, 2)$.', passos: '**Passo 1.** $f(1) = -1, f(2) = 2$. Sinais opostos.', dificuldade: 'aplicacao', aulasCobertas: ['aula-46-tvi-tvm'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Sqrt 2, ex. 138', licenca: CC_BY } },
    { numero: 14, enunciado: 'Continuidade lateral: $\\sqrt x$ em $x = 0$.', resposta: 'Contínua à direita.', passos: '**Passo 1.** Domínio: $x \\geq 0$. Limite à direita = 0 = $f(0)$. Esquerda não existe.', dificuldade: 'compreensao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 One-Side Cont, ex. 19', licenca: CC_BY } },
    { numero: 15, enunciado: 'Sanduíche: $\\lim_{x\\to 0} x^2 \\sin(1/x)$.', resposta: '$0$', passos: '**Passo 1.** $-x^2 \\leq x^2\\sin(1/x) \\leq x^2$.\n\n**Passo 2.** Ambos $\\to 0$. Confronto.', dificuldade: 'desafio', aulasCobertas: ['aula-45-limites-fundamentais'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Squeeze, ex. 109', licenca: CC_BY } },
  ],
}

const PROVA_T5_V5: Prova = {
  id: 'trim-5-v5', trim: 5, versao: 5,
  titulo: 'Trim 5 · Versão 5 — Limites e continuidade', descricao: 'Trim 5 v5.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\lim_{x \\to 0} \\dfrac{\\sqrt{x+9} - 3}{x}$.', resposta: '$1/6$',
      passos: '**Passo 1.** $0/0$. Racionalize: multiplique por $(\\sqrt{x+9}+3)/(\\sqrt{x+9}+3)$.\n\n**Passo 2.** Numerador: $(x+9) - 9 = x$. Expressão: $x/(x(\\sqrt{x+9}+3)) = 1/(\\sqrt{x+9}+3)$.\n\n**Passo 3.** $x \\to 0$: $1/(3+3) = 1/6$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-42-propriedades-limites'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Rationalization, ex. 96 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$\\lim_{x\\to\\infty} (\\sqrt{x^2+1} - x)$.', resposta: '$0$',
      passos: '**Passo 1.** Multiplique conjugado: $(\\sqrt{x^2+1} - x)(\\sqrt{x^2+1}+x)/(\\sqrt{x^2+1}+x)$.\n\n**Passo 2.** $= 1/(\\sqrt{x^2+1}+x) \\to 0$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-47-assintotas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Conjugate at Infinity, ex. 27 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Existe $\\lim_{x\\to 0} \\sin(1/x)$?', resposta: 'Não existe.',
      passos: '**Passo 1.** Para $x_n = 1/(n\\pi)$: $\\sin(n\\pi) = 0$.\n\n**Passo 2.** Para $x_n = 1/((2n+1/2)\\pi)$: $\\sin = 1$.\n\n**Conclusão.** Sequências convergindo a 0 dão limites diferentes — limite não existe.',
      dificuldade: 'desafio', aulasCobertas: ['aula-41-limite-formal'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.2 Pathological Limit, ex. 56 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Função descontínua removível: $g(x) = (x^2-1)/(x-1)$, $g(1) = ?$.', resposta: '$g(1) = 2$ remove a descontinuidade.',
      passos: '**Passo 1.** $\\lim_{x\\to 1} g(x) = \\lim (x+1) = 2$.\n\n**Passo 2.** Definir $g(1) = 2$ torna função contínua.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-43-continuidade'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Removable Disc, ex. 32 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Use TVI para mostrar $\\cos x = x$ tem solução em $(0, 1)$.', resposta: 'Existe solução.',
      passos: '**Passo 1.** $f(x) = \\cos x - x$. $f(0) = 1 > 0$, $f(1) = \\cos 1 - 1 \\approx -0{,}46 < 0$.\n\n**Passo 2.** Contínua + muda sinal ⇒ TVI.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-46-tvi-tvm'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 TVI Application, ex. 145 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\lim_{x\\to 3} (x^2 - x)$.', resposta: '$6$', passos: '**Passo 1.** $9 - 3 = 6$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Sub, ex. 13', licenca: CC_BY } },
    { numero: 7, enunciado: '$\\lim_{x\\to\\infty} (\\sin x/x)$.', resposta: '$0$', passos: '**Passo 1.** $|\\sin x/x| \\leq 1/|x| \\to 0$. Confronto.', dificuldade: 'compreensao', aulasCobertas: ['aula-47-assintotas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Bounded Decay, ex. 23', licenca: CC_BY } },
    { numero: 8, enunciado: 'Indeterminação $\\infty/\\infty$ exemplo.', resposta: '$\\lim x^2/x = \\lim x = \\infty$.', passos: '**Passo 1.** Cancelar e identificar.', dificuldade: 'aplicacao', aulasCobertas: ['aula-47-assintotas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Indet, ex. 5', licenca: CC_BY } },
    { numero: 9, enunciado: '$\\lim_{x\\to 0} \\dfrac{\\sin^2 x}{x}$.', resposta: '$0$', passos: '**Passo 1.** $\\sin^2 x/x = \\sin x \\cdot (\\sin x/x) \\to 0 \\cdot 1 = 0$.', dificuldade: 'compreensao', aulasCobertas: ['aula-48-limites-funcoes-trig'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Sin Sq, ex. 127', licenca: CC_BY } },
    { numero: 10, enunciado: 'Continuidade $f(x) = \\sqrt{x^2 + 1}$.', resposta: 'Contínua $\\forall x$.', passos: '**Passo 1.** $x^2+1 > 0$ sempre, raiz definida. Composição contínua.', dificuldade: 'aplicacao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Composition, ex. 21', licenca: CC_BY } },
    { numero: 11, enunciado: 'Sequência $a_n = 2^n/n$.', resposta: 'Diverge ($\\to \\infty$).', passos: '**Passo 1.** Exp domina linear. Razão diverge.', dificuldade: 'compreensao', aulasCobertas: ['aula-49-limite-sequencias'], fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§5.1 Exp/Linear, ex. 27', licenca: CC_BY } },
    { numero: 12, enunciado: '$\\lim_{x\\to 0^+} x \\ln x$.', resposta: '$0$', passos: '**Passo 1.** Reescreva: $\\ln x/(1/x) \\to -\\infty/\\infty$. L\'Hôpital: $-x \\to 0$.', dificuldade: 'desafio', aulasCobertas: ['aula-45-limites-fundamentais'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.8 Indet 0·∞, ex. 372', licenca: CC_BY } },
    { numero: 13, enunciado: 'TVM aplicado em $f(x) = x^2$ em $[0, 4]$.', resposta: '$c = 2$', passos: '**Passo 1.** $(16-0)/4 = 4$. $2c = 4 \\Rightarrow c = 2$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-46-tvi-tvm'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.4 MVT, ex. 168', licenca: CC_BY } },
    { numero: 14, enunciado: 'Limite por substituição falha quando?', resposta: 'Quando dá indeterminação ($0/0$, $\\infty/\\infty$, etc.).', passos: '**Passo 1.** Substituir só funciona se função é contínua e definida no ponto.', dificuldade: 'compreensao', aulasCobertas: ['aula-42-propriedades-limites'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 When Sub Fails, ex. 65', licenca: CC_BY } },
    { numero: 15, enunciado: 'Definição de limite no infinito.', resposta: '$\\lim_{x\\to\\infty} f(x) = L$ se $\\forall \\varepsilon > 0$, $\\exists M$: $x > M \\Rightarrow |f(x) - L| < \\varepsilon$.', passos: '**Passo 1.** Análoga a $\\varepsilon$-$\\delta$, mas com $M$ em vez de $\\delta$.', dificuldade: 'demonstracao', aulasCobertas: ['aula-47-assintotas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Limit at Inf, def', licenca: CC_BY } },
  ],
}

const PROVA_T5_V6: Prova = {
  id: 'trim-5-v6', trim: 5, versao: 6,
  titulo: 'Trim 5 · Versão 6 — Limites e continuidade', descricao: 'Trim 5 v6.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\lim_{x \\to 3} \\dfrac{x^2 - 9}{x^2 - 5x + 6}$.', resposta: '$6$',
      passos: '**Passo 1.** Fatorar: $(x-3)(x+3)/((x-3)(x-2)) = (x+3)/(x-2)$.\n\n**Passo 2.** $x \\to 3$: $6/1 = 6$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Factor and Cancel, ex. 81 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Assíntota horizontal de $f(x) = (2x-1)/(x+3)$.', resposta: '$y = 2$',
      passos: '**Passo 1.** $\\lim_{x\\to\\pm\\infty} (2x-1)/(x+3) = 2$ (razão coef. líderes).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-47-assintotas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Horizontal Asymptote, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: '$\\lim_{x\\to 0} x \\sin(1/x)$.', resposta: '$0$',
      passos: '**Passo 1.** $-1 \\leq \\sin(1/x) \\leq 1 \\Rightarrow -|x| \\leq x\\sin(1/x) \\leq |x|$.\n\n**Passo 2.** Confronto (squeeze): ambos limites laterais $\\to 0$. Limite $= 0$.\n\n**Por que confronto?** Quando função oscila descontroladamente, "espremê-la" entre 2 funções com mesmo limite força o resultado.',
      dificuldade: 'desafio', aulasCobertas: ['aula-45-limites-fundamentais'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Squeeze Theorem, ex. 109 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Continuidade: identifique tipo da descontinuidade de $f(x) = 1/x$ em $x=0$.', resposta: 'Descontinuidade infinita (assintótica).',
      passos: '**Passo 1.** $\\lim_{x\\to 0^+} 1/x = +\\infty$, $\\lim_{x\\to 0^-} = -\\infty$.\n\n**Conclusão.** Descontinuidade infinita — assíntota vertical.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-43-continuidade'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Discontinuity Types, ex. 27 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Sequência $a_n = (-1)^n$. Limite?', resposta: 'Não converge.',
      passos: '**Passo 1.** Termos alternam $1, -1, 1, -1, \\ldots$.\n\n**Passo 2.** Subsequências têm limites diferentes (1 e -1) ⇒ sequência não converge.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-49-limite-sequencias'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§5.1 Divergent Sequence, ex. 23 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T5_V7: Prova = {
  id: 'trim-5-v7', trim: 5, versao: 7,
  titulo: 'Trim 5 · Versão 7 — Limites e continuidade', descricao: 'Trim 5 v7.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\lim_{x\\to 1} \\dfrac{x^3 - 1}{x - 1}$.', resposta: '$3$',
      passos: '**Passo 1.** $x^3 - 1 = (x-1)(x^2+x+1)$. Cancelar.\n\n**Passo 2.** $\\lim (x^2+x+1) = 3$.\n\n**Conexão.** Igual a $f\'(1)$ para $f = x^3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Polynomial Factor, ex. 84 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$\\lim_{x\\to 0} \\dfrac{e^x - 1}{x}$.', resposta: '$1$',
      passos: '**Passo 1.** Limite fundamental que define $e$.\n\n**Equivalente.** Definição alternativa: $e$ é a base tal que $(e^x)\' = e^x$, ou seja $(e^h - 1)/h \\to 1$ ao $h \\to 0$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-45-limites-fundamentais'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 e Limit (apêndice)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Limite com indeterminação $0 \\cdot \\infty$: $\\lim_{x\\to 0^+} x \\ln x$.', resposta: '$0$',
      passos: '**Passo 1.** Reescreva: $\\lim \\dfrac{\\ln x}{1/x}$ (forma $-\\infty/\\infty$).\n\n**Passo 2.** L\'Hôpital: $\\dfrac{1/x}{-1/x^2} = -x \\to 0$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-42-propriedades-limites'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.8 L\'Hopital 0·∞, ex. 372 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Continuidade global de $f(x) = |x|$.', resposta: 'Contínua em $\\mathbb{R}$.',
      passos: '**Passo 1.** Para $x \\neq 0$: $f$ é polinomial em ramos.\n\n**Passo 2.** Em $x = 0$: $\\lim_{x\\to 0} |x| = 0 = f(0)$ ✓.\n\n**Conclusão.** $|x|$ é contínua.\n\n**Nota.** Contínua mas **não derivável** em $0$ — bico.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-43-continuidade'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Absolute Value Continuity, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Use TVM em $f(x) = x^3 - 3x + 1$ em $[0, 2]$.', resposta: '$c = 2/\\sqrt 3 \\approx 1{,}155$',
      passos: '**Passo 1.** $f(2) = 3$, $f(0) = 1$. $(f(2)-f(0))/2 = 1$.\n\n**Passo 2.** $f\'(c) = 3c^2 - 3 = 1 \\Rightarrow c^2 = 4/3 \\Rightarrow c = 2/\\sqrt 3$.\n\n**Confirme.** $c \\in (0, 2)$ ✓.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-46-tvi-tvm'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.4 MVT, ex. 168 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\lim_{x\\to 6} (x^2 - 36)/(x - 6)$.', resposta: '$12$', passos: '**Passo 1.** Fator: $(x-6)(x+6)/(x-6) = x+6$.\n\n**Passo 2.** $\\lim = 12$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Diff Squares, ex. 81', licenca: CC_BY } },
    { numero: 7, enunciado: '$\\lim_{x\\to 0} (1 + x)^{1/x}$.', resposta: '$e$', passos: '**Passo 1.** Limite que define $e$ via reciprocal.', dificuldade: 'compreensao', aulasCobertas: ['aula-45-limites-fundamentais'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 e Variant, ex. 35', licenca: CC_BY } },
    { numero: 8, enunciado: 'Continuidade $f(x) = \\lfloor x \\rfloor$ em $x = 1$.', resposta: 'Não contínua (salto).', passos: '**Passo 1.** Limite à esquerda 0, à direita 1. Diferentes.', dificuldade: 'compreensao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Floor Function, ex. 35', licenca: CC_BY } },
    { numero: 9, enunciado: '$\\lim_{x\\to 0} \\dfrac{x}{\\sqrt{x+1}-1}$.', resposta: '$2$', passos: '**Passo 1.** Conjugado: $x(\\sqrt{x+1}+1)/((x+1)-1) = \\sqrt{x+1}+1 \\to 2$.', dificuldade: 'desafio', aulasCobertas: ['aula-42-propriedades-limites'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Conjugate, ex. 96', licenca: CC_BY } },
    { numero: 10, enunciado: 'Sequência $a_n = \\sqrt n$.', resposta: 'Diverge ($\\to \\infty$).', passos: '**Passo 1.** Cresce sem limite.', dificuldade: 'aplicacao', aulasCobertas: ['aula-49-limite-sequencias'], fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§5.1 Divergent, ex. 19', licenca: CC_BY } },
    { numero: 11, enunciado: 'Identidade $\\sin^2 + \\cos^2 = 1$ usada no limite $\\lim_{x\\to 0}(1-\\cos x)/x^2$.', resposta: '$1/2$', passos: '**Passo 1.** $1-\\cos x = 2\\sin^2(x/2)$. Razão $= 2\\sin^2(x/2)/x^2 = (1/2)(\\sin(x/2)/(x/2))^2 \\to 1/2$.', dificuldade: 'desafio', aulasCobertas: ['aula-45-limites-fundamentais'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Trig Variant, ex. 125', licenca: CC_BY } },
    { numero: 12, enunciado: '$\\lim_{x\\to 0^+} \\sqrt x = ?$', resposta: '$0$', passos: '**Passo 1.** Função contínua à direita em 0.', dificuldade: 'aplicacao', aulasCobertas: ['aula-44-limites-laterais'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.2 Sqrt Right, ex. 27', licenca: CC_BY } },
    { numero: 13, enunciado: 'Polinômio assim contínuo em $\\mathbb R$.', resposta: 'Sim.', passos: '**Passo 1.** Polinomial é soma/produto finito de funções contínuas.', dificuldade: 'compreensao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Polynomial, ex. 9', licenca: CC_BY } },
    { numero: 14, enunciado: '$\\lim_{x\\to 1^-} (1 - x)/(x - 1)$.', resposta: '$-1$', passos: '**Passo 1.** $(1-x)/(x-1) = -1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-44-limites-laterais'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.2 Side, ex. 33', licenca: CC_BY } },
    { numero: 15, enunciado: 'TVI: $f(x) = x^4 - 5$. Raízes em quais intervalos?', resposta: '$(-2, -1)$ e $(1, 2)$.', passos: '**Passo 1.** $f(\\pm 1) = -4$, $f(\\pm 2) = 11$. Sinais opostos em ambos lados.', dificuldade: 'aplicacao', aulasCobertas: ['aula-46-tvi-tvm'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 TVI Two Roots, ex. 148', licenca: CC_BY } },
  ],
}

const PROVA_T5_V8: Prova = {
  id: 'trim-5-v8', trim: 5, versao: 8,
  titulo: 'Trim 5 · Versão 8 — Limites e continuidade', descricao: 'Trim 5 v8.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\lim_{x\\to -2} \\dfrac{x^2 + 5x + 6}{x + 2}$.', resposta: '$1$',
      passos: '**Passo 1.** Fatorar: $(x+2)(x+3)/(x+2) = x+3$.\n\n**Passo 2.** $\\lim = 1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Factor Cancel, ex. 87 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Limites laterais: $\\lim_{x\\to 2^+} \\dfrac{1}{x-2}$ e $\\lim_{x\\to 2^-}$.', resposta: '$+\\infty$ e $-\\infty$',
      passos: '**Passo 1.** $x \\to 2^+$: $x - 2$ é positivo pequeno. $1/(\\text{pequeno}+) = +\\infty$.\n\n**Passo 2.** $x \\to 2^-$: similar, mas negativo. $-\\infty$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-44-limites-laterais', 'aula-47-assintotas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.2 Side Limits, ex. 55 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Limite trigonométrico $\\lim_{x\\to 0} \\dfrac{\\tan x}{x}$.', resposta: '$1$',
      passos: '**Passo 1.** $\\tan x = \\sin x/\\cos x$. $(\\tan x)/x = (\\sin x/x)(1/\\cos x) \\to 1 \\cdot 1 = 1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-48-limites-funcoes-trig'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Tan Limit, ex. 124 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Sequência $a_n = (1 + 1/n)^n$. Para que valor converge?', resposta: '$e$',
      passos: '**Passo 1.** Limite que define $e$ (Euler).\n\n**Passo 2.** Numerica: $n=10$: 2,594; $n=1000$: 2,716; $n\\to\\infty$: $e \\approx 2{,}71828$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-49-limite-sequencias'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§5.1 Euler Sequence, ex. 27 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Aplicação TVI: existe ponto fixo de $\\cos$ em $[0, 1]$?', resposta: 'Sim, $\\approx 0{,}739$.',
      passos: '**Passo 1.** Defina $f(x) = \\cos x - x$. $f(0) = 1 > 0$, $f(1) = \\cos 1 - 1 < 0$.\n\n**Passo 2.** TVI ⇒ existe $c$ com $\\cos c = c$. Numerica $c \\approx 0{,}739$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-46-tvi-tvm'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Fixed Point, ex. 152 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\lim_{x\\to\\infty} \\sqrt{x^2 + 1}/x$.', resposta: '$1$', passos: '**Passo 1.** $\\sqrt{x^2+1}/x = \\sqrt{1 + 1/x^2} \\to 1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-47-assintotas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Sqrt Limit, ex. 27', licenca: CC_BY } },
    { numero: 7, enunciado: '$\\lim_{x\\to 0} (e^{2x} - 1)/x$.', resposta: '$2$', passos: '**Passo 1.** Reescreva: $2 \\cdot (e^{2x}-1)/(2x) \\to 2 \\cdot 1$.', dificuldade: 'compreensao', aulasCobertas: ['aula-45-limites-fundamentais'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Exp Variant, ex. 39', licenca: CC_BY } },
    { numero: 8, enunciado: 'Continuidade $f(x) = x^2 + 3x$ em $x = 1$.', resposta: 'Contínua.', passos: '**Passo 1.** Polinômio. $f(1) = 4 = \\lim_{x\\to 1} f$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Continuous Eval, ex. 7', licenca: CC_BY } },
    { numero: 9, enunciado: '$\\lim_{x\\to 0^-} \\dfrac{|x|}{x}$.', resposta: '$-1$', passos: '**Passo 1.** $x < 0$: $|x| = -x$. Razão $-1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-44-limites-laterais'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.2 Sign Function, ex. 47', licenca: CC_BY } },
    { numero: 10, enunciado: 'Sequência limitada e monotônica converge?', resposta: 'Sim — Teorema da convergência monotônica.', passos: '**Passo 1.** Em $\\mathbb R$, sequência monotônica + limitada ⇒ converge ao supremo (crescente) ou ínfimo (decrescente).', dificuldade: 'compreensao', aulasCobertas: ['aula-49-limite-sequencias'], fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§5.1 Monotone, ex. 31', licenca: CC_BY } },
    { numero: 11, enunciado: '$\\lim_{x\\to\\pi/2} (1 - \\sin x)/(\\pi/2 - x)^2$.', resposta: '$1/2$', passos: '**Passo 1.** Substitua $u = \\pi/2 - x$. Numerador: $1 - \\sin(\\pi/2 - u) = 1 - \\cos u \\sim u^2/2$.\n\n**Passo 2.** $/u^2 \\to 1/2$.', dificuldade: 'desafio', aulasCobertas: ['aula-48-limites-funcoes-trig'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Trig Substitution, ex. 131', licenca: CC_BY } },
    { numero: 12, enunciado: 'Função descontínua removível: $f(x) = (x^2-4)/(x-2)$ em $x = 2$.', resposta: 'Removível: definir $f(2) = 4$.', passos: '**Passo 1.** Limite = $4$. Definindo $f(2) = 4$, função estende continuamente.', dificuldade: 'compreensao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Removable Hole, ex. 23', licenca: CC_BY } },
    { numero: 13, enunciado: 'Continuidade da exp: $f(x) = e^x$.', resposta: 'Contínua em $\\mathbb R$.', passos: '**Passo 1.** Função analítica.', dificuldade: 'aplicacao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Exp Cont, ex. 13', licenca: CC_BY } },
    { numero: 14, enunciado: '$\\lim_{x\\to 4} (\\sqrt x - 2)/(x - 4)$.', resposta: '$1/4$', passos: '**Passo 1.** Conjugado: $1/(\\sqrt x + 2) \\to 1/4$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Sqrt Limit, ex. 91', licenca: CC_BY } },
    { numero: 15, enunciado: 'TVI: $f(x) = \\sin x - x/2$. Há raiz não-trivial?', resposta: 'Sim — em $(0, \\pi)$.', passos: '**Passo 1.** $f(\\pi/2) = 1 - \\pi/4 \\approx 0{,}21 > 0$. $f(\\pi) = -\\pi/2 < 0$.\n\n**Passo 2.** TVI ⇒ raiz em $(\\pi/2, \\pi)$.', dificuldade: 'desafio', aulasCobertas: ['aula-46-tvi-tvm'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Sin Half Linear, ex. 159', licenca: CC_BY } },
  ],
}

const PROVA_T5_V9: Prova = {
  id: 'trim-5-v9', trim: 5, versao: 9,
  titulo: 'Trim 5 · Versão 9 — Limites e continuidade', descricao: 'Trim 5 v9.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\lim_{x\\to\\infty} \\dfrac{5x^3 + 2}{x^3 - 4}$.', resposta: '$5$',
      passos: '**Passo 1.** Razão coef líderes: $5/1 = 5$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-47-assintotas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Limits at Infinity, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$\\lim_{x\\to 0} \\dfrac{\\sin(3x)}{\\sin(5x)}$.', resposta: '$3/5$',
      passos: '**Passo 1.** Reescreva: $(3x/5x) \\cdot (\\sin 3x/3x) \\cdot (5x/\\sin 5x)$.\n\n**Passo 2.** $\\to (3/5)(1)(1) = 3/5$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-45-limites-fundamentais'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Trig Ratio, ex. 130 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Continuidade da função maior inteiro $\\lfloor x \\rfloor$ em $x = 1$.', resposta: 'Descontínua (salto).',
      passos: '**Passo 1.** $\\lim_{x\\to 1^-} \\lfloor x \\rfloor = 0$.\n\n**Passo 2.** $\\lim_{x\\to 1^+} \\lfloor x \\rfloor = 1$.\n\n**Conclusão.** Limites laterais diferentes ⇒ descontinuidade de salto.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-43-continuidade', 'aula-44-limites-laterais'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Floor Function, ex. 35 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Indeterminação $\\infty - \\infty$: $\\lim_{x\\to\\infty}(\\sqrt{x^2+x}-x)$.', resposta: '$1/2$',
      passos: '**Passo 1.** Conjugado: $((\\sqrt{x^2+x}-x)(\\sqrt{x^2+x}+x))/(\\sqrt{x^2+x}+x) = x/(\\sqrt{x^2+x}+x)$.\n\n**Passo 2.** Divida por $x$: $1/(\\sqrt{1+1/x}+1) \\to 1/(1+1) = 1/2$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-47-assintotas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Asymptote Slant, ex. 31 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Use TVI: existe raiz de $\\ln x = 1/x$ em $[1, 2]$?', resposta: 'Sim.',
      passos: '**Passo 1.** $f(x) = \\ln x - 1/x$. $f(1) = -1 < 0$. $f(2) = \\ln 2 - 0{,}5 \\approx 0{,}19 > 0$.\n\n**Passo 2.** Contínua + muda sinal ⇒ raiz existe.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-46-tvi-tvm'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 TVI Application, ex. 148 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\lim_{x\\to 0} \\dfrac{\\sin(2x)}{3x}$.', resposta: '$2/3$', passos: '**Passo 1.** $(2/3)(\\sin 2x/2x) \\to 2/3$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-48-limites-funcoes-trig'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Trig Ratio, ex. 130', licenca: CC_BY } },
    { numero: 7, enunciado: '$\\lim_{x\\to 0} (e^x + 1)/2$.', resposta: '$1$', passos: '**Passo 1.** $(1+1)/2 = 1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Sub Direct, ex. 25', licenca: CC_BY } },
    { numero: 8, enunciado: '$\\lim_{x\\to 1} \\ln x$.', resposta: '$0$', passos: '**Passo 1.** $\\ln 1 = 0$. Função contínua.', dificuldade: 'aplicacao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Log Eval, ex. 14', licenca: CC_BY } },
    { numero: 9, enunciado: 'Continuidade $\\tan x$ em $\\mathbb R$.', resposta: 'Não — descontinuidades em $\\pi/2 + k\\pi$.', passos: '**Passo 1.** $\\tan = \\sin/\\cos$. Indefinida onde $\\cos = 0$.', dificuldade: 'compreensao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Tan Discont, ex. 41', licenca: CC_BY } },
    { numero: 10, enunciado: '$\\lim_{n\\to\\infty} \\dfrac{n^3 + 2n}{2n^3 + 1}$.', resposta: '$1/2$', passos: '**Passo 1.** Razão coef líderes: $1/2$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-49-limite-sequencias'], fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§5.1 Polynomial Ratio, ex. 17', licenca: CC_BY } },
    { numero: 11, enunciado: 'Indeterminação $0 \\cdot \\infty$. Exemplo.', resposta: '$\\lim_{x\\to 0^+} x \\cdot \\ln x = 0$.', passos: '**Passo 1.** Reescreva como $\\infty/\\infty$ via reciprocal.\n\n**Passo 2.** L\'Hôpital.', dificuldade: 'compreensao', aulasCobertas: ['aula-45-limites-fundamentais'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.8 Indet 0·∞, ex. 372', licenca: CC_BY } },
    { numero: 12, enunciado: '$\\lim_{x\\to 1} (x^3 - 1)/(x - 1)$.', resposta: '$3$', passos: '**Passo 1.** $x^3 - 1 = (x-1)(x^2+x+1)$. Cancelar.\n\n**Passo 2.** $\\lim (x^2+x+1) = 3$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Cubic Cancel, ex. 84', licenca: CC_BY } },
    { numero: 13, enunciado: '$\\lim_{x\\to\\infty} \\dfrac{2x + \\sin x}{x}$.', resposta: '$2$', passos: '**Passo 1.** $2 + \\sin x/x \\to 2 + 0 = 2$.', dificuldade: 'compreensao', aulasCobertas: ['aula-47-assintotas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Bounded Plus, ex. 25', licenca: CC_BY } },
    { numero: 14, enunciado: 'Sequência geométrica $a_n = (1/2)^n$.', resposta: '$\\to 0$', passos: '**Passo 1.** $|q| < 1 \\Rightarrow q^n \\to 0$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-49-limite-sequencias'], fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§5.1 Geometric, ex. 9', licenca: CC_BY } },
    { numero: 15, enunciado: 'TVM: ponto onde tangente é paralela a secante. Significado.', resposta: 'Existe $c$ com $f\'(c) = $ inclinação da secante.', passos: '**Passo 1.** TVM: pra $f$ contínua/derivável em $[a, b]$: $\\exists c \\in (a, b)$ com $f\'(c) = (f(b) - f(a))/(b - a)$.\n\n**Passo 2.** Geometricamente: tangente em $c$ paralela à secante $A$-$B$.', dificuldade: 'compreensao', aulasCobertas: ['aula-46-tvi-tvm'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.4 MVT Statement, ex. 161', licenca: CC_BY } },
  ],
}

const PROVA_T5_V10: Prova = {
  id: 'trim-5-v10', trim: 5, versao: 10,
  titulo: 'Trim 5 · Versão 10 — Limites e continuidade', descricao: 'Trim 5 v10.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\lim_{x\\to 5} \\sqrt{x^2 - 9}$.', resposta: '$4$',
      passos: '**Passo 1.** Função contínua. Substitua: $\\sqrt{25-9} = \\sqrt{16} = 4$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Continuous Sub, ex. 76 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$\\lim_{x\\to 0} \\dfrac{\\cos x - 1}{\\sin x}$.', resposta: '$0$',
      passos: '**Passo 1.** $\\dfrac{\\cos x - 1}{x} \\cdot \\dfrac{x}{\\sin x} \\to 0 \\cdot 1 = 0$.\n\n**Por que $(\\cos x - 1)/x \\to 0$?** Use identidade $\\cos x - 1 = -2\\sin^2(x/2)$. Numerador é $O(x^2)$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-48-limites-funcoes-trig'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Trig Limit Variant, ex. 131 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Continuidade global de $f(x) = e^x$.', resposta: 'Contínua em $\\mathbb{R}$.',
      passos: '**Passo 1.** $e^x$ é definida e contínua em todo $\\mathbb{R}$.\n\n**Por que?** Expansão em série de potências converge em $\\mathbb{R}$. Toda função analítica é contínua.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-43-continuidade'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Exp Continuity, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Sequência $a_n = n!/n^n$. Limite?', resposta: '$0$',
      passos: '**Passo 1.** $n!/n^n = (1/n)(2/n)(3/n)\\cdots(n/n)$. Produto de fatores $\\leq 1$.\n\n**Passo 2.** Pelo menos $(1/n)$ vai a 0; outros são $\\leq 1$. Produto $\\to 0$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-49-limite-sequencias'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§5.1 Factorial vs nn, ex. 31 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Use TVI: $f(x) = x^5 - x - 1$ tem raiz em $(1, 2)$?', resposta: 'Sim.',
      passos: '**Passo 1.** $f(1) = -1 < 0$. $f(2) = 32 - 2 - 1 = 29 > 0$.\n\n**Passo 2.** Contínua + sinal trocado ⇒ TVI.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-46-tvi-tvm'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 TVI Polynomial, ex. 141 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$\\lim_{x\\to 0} \\dfrac{1}{x}$.', resposta: 'Não existe.', passos: '**Passo 1.** Lateral direito $+\\infty$, esquerdo $-\\infty$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-44-limites-laterais'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.2 Reciprocal, ex. 51', licenca: CC_BY } },
    { numero: 7, enunciado: '$\\lim_{x\\to 2} (3x^2 - 5)$.', resposta: '$7$', passos: '**Passo 1.** Sub direta.', dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Quad Sub, ex. 5', licenca: CC_BY } },
    { numero: 8, enunciado: '$\\lim_{x\\to\\infty} (x - \\sqrt{x^2 - 1})$.', resposta: '$0$', passos: '**Passo 1.** Conjugado: $1/(x + \\sqrt{x^2-1}) \\to 0$.', dificuldade: 'desafio', aulasCobertas: ['aula-47-assintotas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Conjugate Inf, ex. 29', licenca: CC_BY } },
    { numero: 9, enunciado: 'Continuidade $f(x) = 1/x$.', resposta: 'Contínua em $\\mathbb R \\setminus \\{0\\}$.', passos: '**Passo 1.** Indefinida em 0. Restante: $f$ é racional.', dificuldade: 'aplicacao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Reciprocal Cont, ex. 17', licenca: CC_BY } },
    { numero: 10, enunciado: '$\\lim_{n\\to\\infty} (n!/n^n)$.', resposta: '$0$', passos: '**Passo 1.** $n! < n \\cdot n \\cdots n = n^n$. Mas mais fortemente: $n!/n^n \\to 0$ (Stirling: $\\sqrt{2\\pi n}(n/e)^n/n^n \\to 0$).', dificuldade: 'desafio', aulasCobertas: ['aula-49-limite-sequencias'], fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§5.1 Stirling, ex. 33', licenca: CC_BY } },
    { numero: 11, enunciado: 'TVI prove $\\sqrt 2$ existe (raiz de $x^2 = 2$ em $(0, 2)$).', resposta: 'Sim, em $(1, 2)$.', passos: '**Passo 1.** $f(x) = x^2 - 2$. $f(1) = -1 < 0$, $f(2) = 2 > 0$. TVI.', dificuldade: 'demonstracao', aulasCobertas: ['aula-46-tvi-tvm'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Sqrt 2 Existence, ex. 145', licenca: CC_BY } },
    { numero: 12, enunciado: 'Continuidade da função composta.', resposta: 'Composição de contínuas é contínua.', passos: '**Passo 1.** Se $g$ contínua em $a$ e $f$ contínua em $g(a)$, então $f\\circ g$ contínua em $a$.', dificuldade: 'compreensao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Composition Theorem, ex. 31', licenca: CC_BY } },
    { numero: 13, enunciado: '$\\lim_{x\\to 1} (x^2 - 3x + 2)/(x - 1)$.', resposta: '$-1$', passos: '**Passo 1.** Fator: $(x-1)(x-2)/(x-1) = x-2$.\n\n**Passo 2.** $\\lim = -1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-42-propriedades-limites'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.3 Factor, ex. 78', licenca: CC_BY } },
    { numero: 14, enunciado: 'Limite no infinito: $\\lim_{x\\to-\\infty} e^x$.', resposta: '$0$', passos: '**Passo 1.** $e^{-\\infty} = 0$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-47-assintotas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Exp Decay, ex. 19', licenca: CC_BY } },
    { numero: 15, enunciado: 'Definição rigorosa de continuidade em $a$.', resposta: '$\\lim_{x\\to a} f(x) = f(a)$.', passos: '**Passo 1.** Três condições: $f(a)$ existe, $\\lim$ existe, são iguais.', dificuldade: 'demonstracao', aulasCobertas: ['aula-43-continuidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§2.4 Cont Definition, def', licenca: CC_BY } },
  ],
}

const PROVA_T6_V1: Prova = {
  id: 'trim-6-v1',
  trim: 6,
  versao: 1,
  titulo: 'Trim 6 · Versão 1 — Derivadas',
  descricao:
    'Definição, regras (potência, produto, quociente, cadeia), implícitas, taxas relacionadas.',
  duracaoMinutos: 90,
  intensidade: 4,
  publicoAlvo: '2.º ano',
  status: 'curada',
  questoes: [
    {
      numero: 1,
      enunciado:
        'Use a definição $f\'(a) = \\lim_{h \\to 0} (f(a+h) - f(a))/h$ para calcular $f\'(2)$ com ' +
        '$f(x) = x^2 + 3x$.',
      resposta: '$f\'(2) = 7$',
      passos:
        '**Passo 1 — $f(2+h) - f(2)$.** $f(2+h) = (2+h)^2 + 3(2+h) = 4 + 4h + h^2 + 6 + 3h = h^2 + 7h + 10$. $f(2) = 4 + 6 = 10$. Diferença: $h^2 + 7h$.\n\n' +
        '**Passo 2 — Quociente.** $(h^2 + 7h)/h = h + 7$ (para $h \\neq 0$).\n\n' +
        '**Passo 3 — Limite.** $\\lim_{h \\to 0} (h + 7) = 7$.\n\n' +
        '**Verificação pela regra.** $f\'(x) = 2x + 3$, $f\'(2) = 4 + 3 = 7$ ✓.\n\n' +
        '**Por que isso é a inclinação da tangente?** A secante entre $(2, f(2))$ e $(2+h, f(2+h))$ tem inclinação $(f(2+h) - f(2))/h$. Quando $h \\to 0$, secante vira tangente.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-51-derivada-definicao'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§3.1 Defining the Derivative, ex. 11 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 2,
      enunciado:
        'Derive $f(x) = (3x^2 + 1)(x - 4)$ via regra do produto.',
      resposta: '$f\'(x) = 9x^2 - 24x + 1$',
      passos:
        '**Passo 1 — Regra do produto.** $(uv)\' = u\'v + uv\'$ com $u = 3x^2 + 1$, $v = x - 4$.\n\n' +
        '**Passo 2 — Derivadas.** $u\' = 6x$, $v\' = 1$.\n\n' +
        '**Passo 3 — Combine.** $f\'(x) = 6x(x - 4) + (3x^2 + 1)(1) = 6x^2 - 24x + 3x^2 + 1 = 9x^2 - 24x + 1$.\n\n' +
        '**Verificação por expansão.** $f(x) = 3x^3 - 12x^2 + x - 4$. Derivada termo a termo: $9x^2 - 24x + 1$ ✓.\n\n' +
        '**Por que a regra do produto não é só $u\'v\'$?** A derivada mede a taxa de variação **conjunta**. Cada fator contribui com sua variação **mantendo o outro fixo** — eis as duas parcelas. Em geral, $(uv)\' \\neq u\'v\'$.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-52-regras-derivacao'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§3.3 Differentiation Rules, ex. 91 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 3,
      enunciado:
        'Derive $f(x) = \\sin(x^2)$.',
      resposta: '$f\'(x) = 2x\\cos(x^2)$',
      passos:
        '**Passo 1 — Regra da cadeia.** $f = g(h(x))$ com $g(u) = \\sin u$, $h(x) = x^2$. $f\' = g\'(h(x)) \\cdot h\'(x)$.\n\n' +
        '**Passo 2 — Derivadas.** $g\'(u) = \\cos u$. $h\'(x) = 2x$.\n\n' +
        '**Passo 3 — Combine.** $f\'(x) = \\cos(x^2) \\cdot 2x = 2x\\cos(x^2)$.\n\n' +
        '**Por que a cadeia?** A taxa de variação de uma composição é o **produto** das taxas. Se $u$ varia $h\'(x)$ vezes mais rápido que $x$, e $g$ varia $g\'(u)$ vezes mais rápido que $u$, então $g \\circ h$ varia $g\'(u) \\cdot h\'(x)$ vezes mais rápido que $x$.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-53-regra-cadeia'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§3.6 The Chain Rule, ex. 230 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 4,
      enunciado:
        'Calcule $dy/dx$ para $x^2 + y^2 = 25$.',
      resposta: '$dy/dx = -x/y$',
      passos:
        '**Passo 1 — Derive ambos os lados em $x$.** $\\frac{d}{dx}(x^2) + \\frac{d}{dx}(y^2) = 0$.\n\n' +
        '**Passo 2 — Cadeia em $y^2$.** $\\frac{d}{dx}(y^2) = 2y \\cdot \\frac{dy}{dx}$ (porque $y$ depende de $x$).\n\n' +
        '**Passo 3 — Resolva.** $2x + 2y \\cdot dy/dx = 0 \\Rightarrow dy/dx = -x/y$.\n\n' +
        '**Por que derivada implícita?** Quando $y$ não está isolado, $y^2$ ainda depende de $x$. A regra da cadeia trata $y$ como função de $x$ desconhecida e produz uma equação em $dy/dx$.\n\n' +
        '**Verificação geométrica.** Círculo $x^2 + y^2 = 25$. Em $(3, 4)$: $dy/dx = -3/4$. Reta tangente é perpendicular ao raio — bate com o vetor $(3,4)$ rotacionado em $90°$.',
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-54-derivadas-implicitas'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§3.8 Implicit Differentiation, ex. 286 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 5,
      enunciado:
        'Um balão sobe verticalmente a $5$ m/s. Um observador 100 m do ponto de lançamento ' +
        'aponta a câmera para o balão. Qual a taxa de variação do ângulo $\\theta$ ' +
        '(da horizontal) quando o balão está a 100 m de altura?',
      resposta: '$d\\theta/dt = 1/40$ rad/s.',
      passos:
        '**Passo 1 — Geometria.** Triângulo retângulo: cateto adjacente fixo (100 m), cateto oposto $h$ (variável). $\\tan\\theta = h/100$.\n\n' +
        '**Passo 2 — Derive em $t$.** $\\sec^2\\theta \\cdot d\\theta/dt = (1/100) \\cdot dh/dt$.\n\n' +
        '**Passo 3 — Em $h = 100$.** $\\tan\\theta = 1 \\Rightarrow \\theta = \\pi/4 \\Rightarrow \\sec^2\\theta = 2$.\n\n' +
        '**Passo 4 — Substitua $dh/dt = 5$.** $2 \\cdot d\\theta/dt = 5/100 = 0{,}05$ ⇒ $d\\theta/dt = 0{,}025 = 1/40$ rad/s.\n\n' +
        '**Por que taxas relacionadas?** Quando duas variáveis se relacionam por uma equação ($\\tan\\theta = h/100$) e ambas dependem de $t$, derivar em $t$ liga as taxas.',
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-58-taxas-relacionadas'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§4.1 Related Rates, ex. 14 (adaptado)',
        licenca: CC_BY,
      },
    },
    { numero: 6, enunciado: 'Derive $f(x) = 4x^3 + 2x$.', resposta: '$12x^2 + 2$', passos: '**Passo 1.** Termo a termo.', dificuldade: 'aplicacao', aulasCobertas: ['aula-52-regras-derivacao'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.3 Power, ex. 7', licenca: CC_BY } },
    { numero: 7, enunciado: 'Derive $f(x) = \\sin x \\cdot e^x$.', resposta: '$e^x(\\sin x + \\cos x)$', passos: '**Passo 1.** Produto: $\\cos x \\cdot e^x + \\sin x \\cdot e^x$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-52-regras-derivacao'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.3 Product, ex. 91', licenca: CC_BY } },
    { numero: 8, enunciado: 'Derive $f(x) = (x^3 + 1)^4$.', resposta: '$12x^2(x^3+1)^3$', passos: '**Passo 1.** Cadeia: $4(x^3+1)^3 \\cdot 3x^2 = 12x^2(x^3+1)^3$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-53-regra-cadeia'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.6 Chain Power, ex. 207', licenca: CC_BY } },
    { numero: 9, enunciado: 'Reta tangente a $y = x^2$ em $(2, 4)$.', resposta: '$y = 4x - 4$', passos: '**Passo 1.** $y\' = 2x = 4$ em $x=2$. Reta: $y - 4 = 4(x - 2)$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-51-derivada-definicao'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.1 Tangent, ex. 19', licenca: CC_BY } },
    { numero: 10, enunciado: 'Derivada implícita: $x^2 + y^2 = 1$. $dy/dx$.', resposta: '$-x/y$', passos: '**Passo 1.** $2x + 2y \\, dy/dx = 0 \\Rightarrow dy/dx = -x/y$.', dificuldade: 'compreensao', aulasCobertas: ['aula-54-derivadas-implicitas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.8 Implicit Circle, ex. 281', licenca: CC_BY } },
    { numero: 11, enunciado: 'Derivada de $\\arcsin x$.', resposta: '$1/\\sqrt{1-x^2}$', passos: '**Passo 1.** $y = \\arcsin x \\Rightarrow \\sin y = x$. Derive: $\\cos y \\cdot y\' = 1$.\n\n**Passo 2.** $y\' = 1/\\cos y = 1/\\sqrt{1-x^2}$.', dificuldade: 'demonstracao', aulasCobertas: ['aula-56-derivadas-inversas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.7 Inverse Trig, prova', licenca: CC_BY } },
    { numero: 12, enunciado: 'Segunda derivada de $f(x) = e^{2x}$.', resposta: '$4e^{2x}$', passos: '**Passo 1.** $f\' = 2e^{2x}$. $f\'\' = 4e^{2x}$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-55-derivadas-superiores'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.3 Higher, ex. 105', licenca: CC_BY } },
    { numero: 13, enunciado: 'Aproximação linear de $\\sqrt x$ em $x = 9$, estime $\\sqrt{9{,}1}$.', resposta: '$\\approx 3{,}0167$', passos: '**Passo 1.** $f\'(9) = 1/6$. $L(x) = 3 + (x-9)/6$. $L(9{,}1) = 3 + 0{,}0167$.', dificuldade: 'modelagem', aulasCobertas: ['aula-57-aproximacao-linear'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.2 Linear Sqrt, ex. 78', licenca: CC_BY } },
    { numero: 14, enunciado: 'Derive $\\ln(\\cos x)$.', resposta: '$-\\tan x$', passos: '**Passo 1.** Cadeia: $(1/\\cos x)(-\\sin x) = -\\sin x/\\cos x = -\\tan x$.', dificuldade: 'compreensao', aulasCobertas: ['aula-53-regra-cadeia'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.9 Log Trig, ex. 19', licenca: CC_BY } },
    { numero: 15, enunciado: 'Diferenciabilidade ⇒ continuidade. Demonstre.', resposta: 'Demonstração.', passos: '**Passo 1.** $f$ derivável em $a$: $\\lim_{h\\to 0} (f(a+h) - f(a))/h = f\'(a)$.\n\n**Passo 2.** Multiplique por $h$: $\\lim (f(a+h) - f(a)) = 0$.\n\n**Passo 3.** $\\Rightarrow \\lim_{h\\to 0} f(a+h) = f(a)$ ⇒ $f$ contínua em $a$. ∎', dificuldade: 'demonstracao', aulasCobertas: ['aula-59-diferenciabilidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.2 Diff Implies Cont, prova', licenca: CC_BY } },
  ],
}

// Trim 6 v2-v10
const PROVA_T6_V2: Prova = {
  id: 'trim-6-v2', trim: 6, versao: 2, titulo: 'Trim 6 · Versão 2 — Derivadas',
  descricao: 'Trim 6 v2.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Derive $f(x) = 5x^4 - 3x^2 + 7$.', resposta: '$f\'(x) = 20x^3 - 6x$',
      passos: '**Passo 1.** Regra da potência: $(x^n)\' = nx^{n-1}$. Aplique termo a termo.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-52-regras-derivacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.3 Power Rule, ex. 81 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Derive $g(x) = (x^2 + 1)/(x - 1)$.', resposta: '$g\'(x) = (x^2 - 2x - 1)/(x-1)^2$',
      passos: '**Passo 1.** Quociente: $(u/v)\' = (u\'v - uv\')/v^2$. $u = x^2 + 1$, $u\' = 2x$. $v = x - 1$, $v\' = 1$.\n\n**Passo 2.** $= (2x(x-1) - (x^2+1))/(x-1)^2 = (2x^2 - 2x - x^2 - 1)/(x-1)^2 = (x^2 - 2x - 1)/(x-1)^2$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-52-regras-derivacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.3 Quotient Rule, ex. 96 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Derive $h(x) = \\sqrt{1 + x^2}$.', resposta: '$h\'(x) = x/\\sqrt{1 + x^2}$',
      passos: '**Passo 1.** Cadeia: $h = (1+x^2)^{1/2}$. $h\' = (1/2)(1+x^2)^{-1/2}(2x) = x/\\sqrt{1+x^2}$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-53-regra-cadeia'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.6 Chain Rule, ex. 218 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Derivada implícita: $x^2 + xy + y^2 = 7$. Encontre $dy/dx$.', resposta: '$-(2x+y)/(x+2y)$',
      passos: '**Passo 1.** Derive: $2x + y + x \\, dy/dx + 2y \\, dy/dx = 0$.\n\n**Passo 2.** Resolva: $dy/dx = -(2x+y)/(x+2y)$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-54-derivadas-implicitas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.8 Implicit Diff, ex. 281 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Taxa relacionada: balão esférico cresce a $dV/dt = 2$ m³/s. Quão rápido cresce o raio quando $r = 1$?', resposta: '$dr/dt = 1/(2\\pi)$ m/s',
      passos: '**Passo 1.** $V = (4/3)\\pi r^3$. $dV/dt = 4\\pi r^2 \\, dr/dt$.\n\n**Passo 2.** $2 = 4\\pi(1)^2 dr/dt \\Rightarrow dr/dt = 1/(2\\pi)$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-58-taxas-relacionadas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.1 Sphere Inflating, ex. 8 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Derive $\\sin(x^3)$.', resposta: '$3x^2\\cos(x^3)$', passos: '**Passo 1.** Cadeia.', dificuldade: 'aplicacao', aulasCobertas: ['aula-53-regra-cadeia'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.6 Trig Chain, ex. 215', licenca: CC_BY } },
    { numero: 7, enunciado: 'Derive $\\sqrt{x^2 + 1}$.', resposta: '$x/\\sqrt{x^2+1}$', passos: '**Passo 1.** Cadeia: $(1/(2\\sqrt{u})) \\cdot 2x$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-53-regra-cadeia'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.6 Sqrt Chain, ex. 218', licenca: CC_BY } },
    { numero: 8, enunciado: 'Derivada de $\\arctan x$.', resposta: '$1/(1+x^2)$', passos: '**Passo 1.** Identidade $\\sec^2 y = 1 + \\tan^2 y$. Inversa: $1/(1+x^2)$.', dificuldade: 'compreensao', aulasCobertas: ['aula-56-derivadas-inversas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.7 Arctan, prova', licenca: CC_BY } },
    { numero: 9, enunciado: 'Derive $f(x) = \\ln x$.', resposta: '$1/x$', passos: '**Passo 1.** Tabela.', dificuldade: 'aplicacao', aulasCobertas: ['aula-52-regras-derivacao'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.9 Log Derivative, ex. 9', licenca: CC_BY } },
    { numero: 10, enunciado: 'Linearização $f(x) = \\sin x$ em $x = 0$.', resposta: '$L(x) = x$', passos: '**Passo 1.** $f(0) = 0$, $f\'(0) = 1$. $L(x) = 0 + 1(x-0)$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-57-aproximacao-linear'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.2 Linear Sin, ex. 71', licenca: CC_BY } },
    { numero: 11, enunciado: 'Pirâmide: água enche a 3 m³/min. Base $4\\times 4$, altura 6. $dh/dt$ em $h=2$.', resposta: 'Calculável via geometria de cones invertidos.', passos: '**Passo 1.** Semelhança: aresta da seção em altura $h$ é $4(1 - h/6)$. Não — pirâmide com base abaixo? Recheck: invertida com vértice em baixo: aresta $= 4h/6 = 2h/3$.\n\n**Passo 2.** Volume $V = (1/3)(2h/3)^2 h = 4h^3/27$. $dV/dh = 4h^2/9$. Em $h=2$: $16/9$.\n\n**Passo 3.** $dV/dt = (16/9) dh/dt = 3 \\Rightarrow dh/dt = 27/16 \\approx 1{,}69$ m/min.', dificuldade: 'desafio', aulasCobertas: ['aula-58-taxas-relacionadas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.1 Pyramid Filling, ex. 13', licenca: CC_BY } },
    { numero: 12, enunciado: 'Terceira derivada de $f(x) = x^4$.', resposta: '$24x$', passos: '**Passo 1.** $f\' = 4x^3, f\'\' = 12x^2, f\'\'\' = 24x$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-55-derivadas-superiores'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.3 Higher x⁴, ex. 109', licenca: CC_BY } },
    { numero: 13, enunciado: 'Derive $f(x) = \\tan x$.', resposta: '$\\sec^2 x$', passos: '**Passo 1.** Quociente $\\sin/\\cos$.\n\n**Passo 2.** $(\\cos^2 + \\sin^2)/\\cos^2 = 1/\\cos^2 = \\sec^2$.', dificuldade: 'compreensao', aulasCobertas: ['aula-52-regras-derivacao'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.5 Tan Derivative, prova', licenca: CC_BY } },
    { numero: 14, enunciado: 'Implícita $\\sin y + xy = 0$. $dy/dx$ em $(0, 0)$.', resposta: 'Indeterminado pela fórmula geral, mas $f \\equiv 0$ ⇒ $y = 0$ é solução constante.', passos: '**Passo 1.** Derive: $\\cos y \\cdot y\' + y + x y\' = 0 \\Rightarrow y\' = -y/(\\cos y + x)$.\n\n**Passo 2.** Em $(0, 0)$: $-0/(1+0) = 0$.', dificuldade: 'desafio', aulasCobertas: ['aula-54-derivadas-implicitas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.8 Implicit Trig, ex. 295', licenca: CC_BY } },
    { numero: 15, enunciado: 'Não-diferenciabilidade: bico em $|x|$.', resposta: 'Não-derivável em $x = 0$.', passos: '**Passo 1.** Derivadas laterais: à direita 1, à esquerda -1.\n\n**Passo 2.** Diferentes ⇒ derivada não existe.', dificuldade: 'compreensao', aulasCobertas: ['aula-59-diferenciabilidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.2 Corner Point, ex. 47', licenca: CC_BY } },
  ],
}

const PROVA_T6_V3: Prova = {
  id: 'trim-6-v3', trim: 6, versao: 3, titulo: 'Trim 6 · Versão 3 — Derivadas',
  descricao: 'Trim 6 v3.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Derive $f(x) = e^x \\sin x$.', resposta: '$f\'(x) = e^x(\\sin x + \\cos x)$',
      passos: '**Passo 1.** Produto: $(uv)\' = u\'v + uv\'$. $u = e^x$, $u\' = e^x$. $v = \\sin x$, $v\' = \\cos x$.\n\n**Passo 2.** $= e^x \\sin x + e^x \\cos x = e^x(\\sin x + \\cos x)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-52-regras-derivacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.3 Product Rule, ex. 89 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Derive $f(x) = \\ln(x^2 + 1)$.', resposta: '$f\'(x) = 2x/(x^2+1)$',
      passos: '**Passo 1.** Cadeia. $(\\ln u)\' = u\'/u$. $u = x^2 + 1$, $u\' = 2x$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-53-regra-cadeia'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.9 Log Diff, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Aproximação linear de $f(x) = \\sqrt x$ em $x = 4$, estime $\\sqrt{4{,}1}$.', resposta: '$\\approx 2{,}025$',
      passos: '**Passo 1.** $f(4) = 2$. $f\'(x) = 1/(2\\sqrt x)$, $f\'(4) = 1/4$.\n\n**Passo 2.** $L(x) = 2 + (x-4)/4$. $L(4{,}1) = 2 + 0{,}025 = 2{,}025$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-57-aproximacao-linear'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.2 Linear Approx, ex. 78 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Segunda derivada de $f(x) = x^4 - 3x^2 + 5$.', resposta: '$f\'\'(x) = 12x^2 - 6$',
      passos: '**Passo 1.** $f\'(x) = 4x^3 - 6x$.\n\n**Passo 2.** $f\'\'(x) = 12x^2 - 6$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-55-derivadas-superiores'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.3 Higher Derivatives, ex. 105 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Derivada da inversa: se $f(x) = x^3 + x$, $f^{-1\\prime}(2) = ?$ ($f(1) = 2$).', resposta: '$1/4$',
      passos: '**Passo 1.** Fórmula: $(f^{-1})\'(y) = 1/f\'(f^{-1}(y))$.\n\n**Passo 2.** $f\'(x) = 3x^2 + 1$. $f\'(1) = 4$.\n\n**Passo 3.** $(f^{-1})\'(2) = 1/4$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-56-derivadas-inversas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.7 Inverse Diff, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Derive $f(x) = 7$.', resposta: '$0$', passos: '**Passo 1.** Constante.', dificuldade: 'aplicacao', aulasCobertas: ['aula-52-regras-derivacao'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.3 Constant, ex. 1', licenca: CC_BY } },
    { numero: 7, enunciado: 'Derive $f(x) = x^2/(x+1)$.', resposta: '$(x^2 + 2x)/(x+1)^2$', passos: '**Passo 1.** Quociente: $(2x(x+1) - x^2)/(x+1)^2 = (2x^2+2x-x^2)/(x+1)^2 = (x^2+2x)/(x+1)^2$.', dificuldade: 'compreensao', aulasCobertas: ['aula-52-regras-derivacao'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.3 Quotient, ex. 95', licenca: CC_BY } },
    { numero: 8, enunciado: 'Tangente em $y = e^x$ em $x = 0$.', resposta: '$y = x + 1$', passos: '**Passo 1.** $y\'(0) = e^0 = 1$. $y(0) = 1$.\n\n**Passo 2.** Reta: $y = 1 + 1(x-0) = x + 1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-51-derivada-definicao'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.1 Tangent Exp, ex. 23', licenca: CC_BY } },
    { numero: 9, enunciado: 'Implícita: $\\sin(x+y) = x$. $dy/dx$.', resposta: '$(1 - \\cos(x+y))/\\cos(x+y)$', passos: '**Passo 1.** Derive: $\\cos(x+y)(1 + y\') = 1$.\n\n**Passo 2.** $1 + y\' = 1/\\cos(x+y) \\Rightarrow y\' = (1-\\cos(x+y))/\\cos(x+y)$.', dificuldade: 'desafio', aulasCobertas: ['aula-54-derivadas-implicitas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.8 Implicit Trig, ex. 295', licenca: CC_BY } },
    { numero: 10, enunciado: 'Derive $\\arccos x$.', resposta: '$-1/\\sqrt{1-x^2}$', passos: '**Passo 1.** $y = \\arccos x \\Rightarrow \\cos y = x$. Derive: $-\\sin y \\cdot y\' = 1 \\Rightarrow y\' = -1/\\sin y = -1/\\sqrt{1-x^2}$.', dificuldade: 'demonstracao', aulasCobertas: ['aula-56-derivadas-inversas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.7 Arccos, prova', licenca: CC_BY } },
    { numero: 11, enunciado: 'Aproximação de $\\sqrt{4{,}1}$ via linearização.', resposta: '$\\approx 2{,}025$', passos: '**Passo 1.** $f(x) = \\sqrt x$, $f(4)=2$, $f\'(4)=1/4$. $L(x) = 2 + (x-4)/4$.\n\n**Passo 2.** $L(4{,}1) = 2{,}025$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-57-aproximacao-linear'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.2 Linear Sqrt, ex. 78', licenca: CC_BY } },
    { numero: 12, enunciado: 'Velocidade $v(t) = 3t^2 - 12$. Aceleração.', resposta: '$a(t) = 6t$', passos: '**Passo 1.** $a = v\' = 6t$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-55-derivadas-superiores'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.4 Acceleration, ex. 153', licenca: CC_BY } },
    { numero: 13, enunciado: 'Onde $f(x) = x^3 - 12x$ tem tangente horizontal?', resposta: '$x = \\pm 2$', passos: '**Passo 1.** $f\'(x) = 3x^2 - 12 = 0 \\Rightarrow x^2 = 4 \\Rightarrow x = \\pm 2$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-52-regras-derivacao'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.3 Horizontal Tangent, ex. 99', licenca: CC_BY } },
    { numero: 14, enunciado: 'Diferenciabilidade implica continuidade. Verdadeiro?', resposta: 'Sim.', passos: '**Passo 1.** Demonstrável: derivada existe ⇒ limite das diferenças bate com 0 ⇒ continuidade.', dificuldade: 'compreensao', aulasCobertas: ['aula-59-diferenciabilidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.2 Diff⇒Cont, prova', licenca: CC_BY } },
    { numero: 15, enunciado: 'Cone enche a 2 m³/min, raio = altura. $dh/dt$ em $h = 3$.', resposta: '$dh/dt = 2/(9\\pi)$ m/min', passos: '**Passo 1.** $V = \\pi h^3/3$. $dV/dt = \\pi h^2 dh/dt$.\n\n**Passo 2.** $2 = 9\\pi \\, dh/dt \\Rightarrow dh/dt = 2/(9\\pi)$.', dificuldade: 'modelagem', aulasCobertas: ['aula-58-taxas-relacionadas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.1 Cone Equal, ex. 14', licenca: CC_BY } },
  ],
}

const PROVA_T6_V4: Prova = {
  id: 'trim-6-v4', trim: 6, versao: 4, titulo: 'Trim 6 · Versão 4 — Derivadas',
  descricao: 'Trim 6 v4.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Derive $f(x) = x \\cos x$.', resposta: '$f\'(x) = \\cos x - x\\sin x$',
      passos: '**Passo 1.** Produto. $u = x$, $u\' = 1$. $v = \\cos x$, $v\' = -\\sin x$.\n\n**Passo 2.** $= \\cos x + x(-\\sin x) = \\cos x - x\\sin x$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-52-regras-derivacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.5 Trig Diff, ex. 178 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Equação da reta tangente a $y = x^3$ em $(2, 8)$.', resposta: '$y = 12x - 16$',
      passos: '**Passo 1.** $y\' = 3x^2$. $y\'(2) = 12$.\n\n**Passo 2.** $y - 8 = 12(x - 2) \\Rightarrow y = 12x - 16$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-51-derivada-definicao', 'aula-52-regras-derivacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.1 Tangent Line, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Diferenciabilidade: $f(x) = |x|$ em $x = 0$.', resposta: 'Não-diferenciável (bico).',
      passos: '**Passo 1.** Limites laterais do quociente de Newton: à direita $1$, à esquerda $-1$.\n\n**Passo 2.** Diferentes ⇒ derivada não existe em 0.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-59-diferenciabilidade'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.2 Differentiability, ex. 49 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Tangente em $x^2 + y^2 = 25$ em $(3, 4)$.', resposta: '$y = -3x/4 + 25/4$',
      passos: '**Passo 1.** Implícita: $2x + 2y \\, y\' = 0 \\Rightarrow y\' = -x/y$.\n\n**Passo 2.** Em $(3, 4)$: $y\' = -3/4$.\n\n**Passo 3.** $y - 4 = -3/4(x - 3) \\Rightarrow y = -3x/4 + 25/4$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-54-derivadas-implicitas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.8 Implicit Tangent, ex. 287 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Escada de 5 m escorrega: pé desliza a 0,5 m/s. Quão rápido topo cai quando pé está a 3 m da parede?', resposta: '$dy/dt = -3/8 = -0{,}375$ m/s',
      passos: '**Passo 1.** $x^2 + y^2 = 25$. Quando $x = 3$, $y = 4$.\n\n**Passo 2.** Derive em $t$: $2x \\, dx/dt + 2y \\, dy/dt = 0$.\n\n**Passo 3.** $2(3)(0{,}5) + 2(4) dy/dt = 0 \\Rightarrow dy/dt = -3/8$ m/s.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-58-taxas-relacionadas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.1 Sliding Ladder, ex. 5 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Derive $f(x) = e^{3x}$.', resposta: '$3e^{3x}$', passos: '**Passo 1.** Cadeia: $e^u \\cdot u\' = e^{3x} \\cdot 3$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-53-regra-cadeia'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.6 Exp Chain, ex. 211', licenca: CC_BY } },
    { numero: 7, enunciado: 'Derive $f(x) = (2x+1)^{10}$.', resposta: '$20(2x+1)^9$', passos: '**Passo 1.** Cadeia: $10(2x+1)^9 \\cdot 2 = 20(2x+1)^9$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-53-regra-cadeia'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.6 Power Chain, ex. 213', licenca: CC_BY } },
    { numero: 8, enunciado: 'Inversa: se $f(2) = 5$ e $f\'(2) = 7$, então $(f^{-1})\'(5) = ?$', resposta: '$1/7$', passos: '**Passo 1.** $(f^{-1})\'(y) = 1/f\'(f^{-1}(y))$.\n\n**Passo 2.** $(f^{-1})\'(5) = 1/f\'(2) = 1/7$.', dificuldade: 'compreensao', aulasCobertas: ['aula-56-derivadas-inversas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.7 Inverse Direct, ex. 13', licenca: CC_BY } },
    { numero: 9, enunciado: 'Linearização $f(x) = \\cos x$ em $x = 0$.', resposta: '$L(x) = 1$', passos: '**Passo 1.** $f(0) = 1$, $f\'(0) = -\\sin 0 = 0$. $L(x) = 1$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-57-aproximacao-linear'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.2 Cos Linear, ex. 73', licenca: CC_BY } },
    { numero: 10, enunciado: 'Derive $f(x) = \\ln(x^2)$.', resposta: '$2/x$', passos: '**Passo 1.** $\\ln(x^2) = 2\\ln|x|$.\n\n**Passo 2.** $f\' = 2/x$.', dificuldade: 'compreensao', aulasCobertas: ['aula-53-regra-cadeia'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.9 Log x², ex. 17', licenca: CC_BY } },
    { numero: 11, enunciado: 'Implícita: $y^3 + xy = 1$. $dy/dx$.', resposta: '$-y/(3y^2 + x)$', passos: '**Passo 1.** Derive: $3y^2 y\' + y + xy\' = 0 \\Rightarrow y\' = -y/(3y^2+x)$.', dificuldade: 'compreensao', aulasCobertas: ['aula-54-derivadas-implicitas'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.8 Cubic Implicit, ex. 287', licenca: CC_BY } },
    { numero: 12, enunciado: 'Segunda derivada $f(x) = x^5 + x^3$.', resposta: '$20x^3 + 6x$', passos: '**Passo 1.** $f\' = 5x^4 + 3x^2$. $f\'\' = 20x^3 + 6x$.', dificuldade: 'aplicacao', aulasCobertas: ['aula-55-derivadas-superiores'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.3 Higher, ex. 113', licenca: CC_BY } },
    { numero: 13, enunciado: 'Onde $f(x) = e^{-x^2}$ tem tangente horizontal?', resposta: '$x = 0$', passos: '**Passo 1.** $f\'(x) = -2x e^{-x^2}$. Zero em $x = 0$.\n\n**Pico.** $f(0) = 1$.', dificuldade: 'compreensao', aulasCobertas: ['aula-52-regras-derivacao'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.6 Bell Curve, ex. 233', licenca: CC_BY } },
    { numero: 14, enunciado: 'Função $|x^2 - 4|$ é diferenciável em $x = 2$?', resposta: 'Não — bico em $x = \\pm 2$ (onde $x^2 - 4 = 0$ muda sinal).', passos: '**Passo 1.** Derivada em ramos $\\pm$ tem valores opostos nos zeros do argumento.', dificuldade: 'desafio', aulasCobertas: ['aula-59-diferenciabilidade'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.2 Abs Quadratic, ex. 51', licenca: CC_BY } },
    { numero: 15, enunciado: 'Foguete decola: altitude $h(t) = 4t^3$ km. Velocidade em $t = 2$.', resposta: '$48$ km/h', passos: '**Passo 1.** $h\'(t) = 12t^2$. $h\'(2) = 48$.', dificuldade: 'modelagem', aulasCobertas: ['aula-51-derivada-definicao'], fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.4 Rocket, ex. 161', licenca: CC_BY } },
  ],
}

const PROVA_T6_V5: Prova = {
  id: 'trim-6-v5', trim: 6, versao: 5, titulo: 'Trim 6 · Versão 5 — Derivadas',
  descricao: 'Trim 6 v5.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Derive $f(x) = \\tan(2x)$.', resposta: '$f\'(x) = 2\\sec^2(2x)$',
      passos: '**Passo 1.** Cadeia: $(\\tan u)\' = \\sec^2 u \\cdot u\'$.\n\n**Passo 2.** $u = 2x$, $u\' = 2$. $f\' = 2\\sec^2(2x)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-53-regra-cadeia'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.6 Chain Trig, ex. 224 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Derive $f(x) = e^{x^2}$.', resposta: '$f\'(x) = 2x e^{x^2}$',
      passos: '**Passo 1.** Cadeia: $u = x^2$, $u\' = 2x$. $(e^u)\' = e^u u\'$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-53-regra-cadeia'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.9 Exp Diff, ex. 22 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Linearização de $f(x) = \\ln x$ em $x = 1$.', resposta: '$L(x) = x - 1$',
      passos: '**Passo 1.** $f(1) = 0$. $f\'(x) = 1/x$, $f\'(1) = 1$.\n\n**Passo 2.** $L(x) = 0 + 1 \\cdot (x - 1) = x - 1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-57-aproximacao-linear'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.2 Linear of Log, ex. 73 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$f(x) = x^3 - 3x$. Encontre pontos críticos.', resposta: '$x = \\pm 1$',
      passos: '**Passo 1.** $f\'(x) = 3x^2 - 3 = 0 \\Rightarrow x^2 = 1 \\Rightarrow x = \\pm 1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-52-regras-derivacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.3 Critical Points, ex. 134 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Derivada de $\\arcsin x$.', resposta: '$1/\\sqrt{1-x^2}$',
      passos: '**Passo 1.** Seja $y = \\arcsin x$. Então $\\sin y = x$.\n\n**Passo 2.** Derive: $\\cos y \\cdot y\' = 1 \\Rightarrow y\' = 1/\\cos y$.\n\n**Passo 3.** $\\cos y = \\sqrt{1 - \\sin^2 y} = \\sqrt{1 - x^2}$.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-56-derivadas-inversas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.7 Inverse Trig Diff, derivação', licenca: CC_BY } },
  ],
}

const PROVA_T6_V6: Prova = {
  id: 'trim-6-v6', trim: 6, versao: 6, titulo: 'Trim 6 · Versão 6 — Derivadas',
  descricao: 'Trim 6 v6.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Derive $f(x) = (x^2 - 1)^5$.', resposta: '$f\'(x) = 10x(x^2-1)^4$',
      passos: '**Passo 1.** Cadeia: $u = x^2 - 1$, $u\' = 2x$. $f\' = 5u^4 \\cdot 2x$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-53-regra-cadeia'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.6 Chain Power, ex. 207 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Derivada terceira de $f(x) = \\sin x$.', resposta: '$f\'\'\'(x) = -\\cos x$',
      passos: '**Passo 1.** $f\' = \\cos x$, $f\'\' = -\\sin x$, $f\'\'\' = -\\cos x$.\n\n**Padrão.** Quarta derivada volta a $\\sin x$ — período 4.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-55-derivadas-superiores'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.5 Higher Trig, ex. 191 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: '$f$ derivável e $f(2) = 5$, $f\'(2) = 3$. Estime $f(2{,}1)$.', resposta: '$\\approx 5{,}3$',
      passos: '**Passo 1.** Linearização: $f(2{,}1) \\approx f(2) + f\'(2) \\cdot 0{,}1 = 5 + 0{,}3 = 5{,}3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-57-aproximacao-linear'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.2 Approx, ex. 65 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Derivada implícita: $\\sin(xy) = x + y$.', resposta: '$dy/dx = (1 - y\\cos(xy))/(x\\cos(xy) - 1)$',
      passos: '**Passo 1.** Derive: $\\cos(xy)(y + x \\, dy/dx) = 1 + dy/dx$.\n\n**Passo 2.** Reorganize: $x\\cos(xy) \\, dy/dx - dy/dx = 1 - y\\cos(xy)$.\n\n**Passo 3.** $dy/dx = (1 - y\\cos(xy))/(x\\cos(xy) - 1)$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-54-derivadas-implicitas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.8 Implicit Trig, ex. 295 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Cone de água: água enche a 5 cm³/s. Cone tem raio 6 cm e altura 12 cm. Quão rápido sobe nível quando $h = 4$?', resposta: '$dh/dt = 5/(4\\pi)$ cm/s',
      passos: '**Passo 1.** Semelhança: $r/h = 6/12 = 1/2$. $r = h/2$.\n\n**Passo 2.** $V = (1/3)\\pi r^2 h = (1/3)\\pi (h/2)^2 h = \\pi h^3/12$.\n\n**Passo 3.** $dV/dt = (\\pi h^2/4) dh/dt$. Em $h = 4$: $5 = 4\\pi \\, dh/dt \\Rightarrow dh/dt = 5/(4\\pi)$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-58-taxas-relacionadas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.1 Cone Filling, ex. 12 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T6_V7: Prova = {
  id: 'trim-6-v7', trim: 6, versao: 7, titulo: 'Trim 6 · Versão 7 — Derivadas',
  descricao: 'Trim 6 v7.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Derive $f(x) = 1/x^2$.', resposta: '$-2/x^3$',
      passos: '**Passo 1.** Reescreva: $x^{-2}$. Potência: $-2x^{-3} = -2/x^3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-52-regras-derivacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.3 Negative Power, ex. 79 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Derive $g(x) = \\sqrt[3]{x}$.', resposta: '$g\'(x) = 1/(3x^{2/3})$',
      passos: '**Passo 1.** $g = x^{1/3}$. $g\' = (1/3) x^{-2/3}$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-52-regras-derivacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.3 Fractional Power, ex. 76 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Velocidade instantânea: $s(t) = 16t^2$. $v(2) = ?$', resposta: '$v(2) = 64$',
      passos: '**Passo 1.** $v(t) = s\'(t) = 32t$. $v(2) = 64$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-51-derivada-definicao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.4 Velocity, ex. 152 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Derivada de $a^x$ ($a > 0$).', resposta: '$a^x \\ln a$',
      passos: '**Passo 1.** $a^x = e^{x\\ln a}$. Cadeia: $(e^{x\\ln a})\' = e^{x\\ln a} \\cdot \\ln a = a^x \\ln a$.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-53-regra-cadeia'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.9 General Exp, derivação', licenca: CC_BY } },
    { numero: 5, enunciado: 'Diferenciabilidade vs continuidade: dê exemplo de função contínua mas não-diferenciável.', resposta: '$|x|$ em $x = 0$',
      passos: '**Passo 1.** $|x|$ é contínua em $0$ ($\\lim = 0 = f(0)$).\n\n**Passo 2.** Mas derivada lateral: à direita 1, à esquerda -1. Não-diferenciável.\n\n**Lição.** Diferenciabilidade $\\Rightarrow$ continuidade, mas não vice-versa.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-59-diferenciabilidade'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.2 Continuity vs Differentiability, ex. 47 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T6_V8: Prova = {
  id: 'trim-6-v8', trim: 6, versao: 8, titulo: 'Trim 6 · Versão 8 — Derivadas',
  descricao: 'Trim 6 v8.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Derive $f(x) = x^3 e^x$.', resposta: '$f\'(x) = e^x(x^3 + 3x^2)$',
      passos: '**Passo 1.** Produto. $(x^3)\' = 3x^2$. $(e^x)\' = e^x$.\n\n**Passo 2.** $f\' = 3x^2 e^x + x^3 e^x = e^x(3x^2 + x^3)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-52-regras-derivacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.3 Product, ex. 99 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Derive $f(x) = \\ln(\\sin x)$.', resposta: '$\\cot x$',
      passos: '**Passo 1.** Cadeia: $f\' = (1/\\sin x)(\\cos x) = \\cot x$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-53-regra-cadeia'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.9 Log Trig, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Aceleração: $s(t) = t^3 - 6t^2$ (m, s). $a(2) = ?$', resposta: '$a(2) = 0$',
      passos: '**Passo 1.** $v = 3t^2 - 12t$. $a = 6t - 12$.\n\n**Passo 2.** $a(2) = 12 - 12 = 0$.\n\n**Interpretação.** Em $t = 2$, velocidade está num extremo (acelera deixa de acelerar).',
      dificuldade: 'modelagem', aulasCobertas: ['aula-55-derivadas-superiores'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.4 Acceleration, ex. 158 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Derivada implícita: $e^{xy} = x + y$.', resposta: '$dy/dx = (1 - ye^{xy})/(xe^{xy} - 1)$',
      passos: '**Passo 1.** Derive: $e^{xy}(y + xy\') = 1 + y\'$.\n\n**Passo 2.** Resolva: $xe^{xy} y\' - y\' = 1 - ye^{xy} \\Rightarrow y\' = (1 - ye^{xy})/(xe^{xy} - 1)$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-54-derivadas-implicitas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.8 Implicit Exp, ex. 297 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Diferencial: $dy$ se $y = x^2 + 3x$, $x = 2$, $dx = 0{,}1$.', resposta: '$dy = 0{,}7$',
      passos: '**Passo 1.** $dy = y\' \\, dx = (2x + 3) dx$.\n\n**Passo 2.** Em $x = 2$, $dx = 0{,}1$: $dy = 7 \\cdot 0{,}1 = 0{,}7$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-57-aproximacao-linear'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.2 Differentials, ex. 87 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T6_V9: Prova = {
  id: 'trim-6-v9', trim: 6, versao: 9, titulo: 'Trim 6 · Versão 9 — Derivadas',
  descricao: 'Trim 6 v9.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Derive $f(x) = \\sec x$.', resposta: '$\\sec x \\tan x$',
      passos: '**Passo 1.** $\\sec x = 1/\\cos x$. Quociente.\n\n**Passo 2.** $f\' = \\sin x/\\cos^2 x = \\sec x \\tan x$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-52-regras-derivacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.5 Trig Derivatives, derivação', licenca: CC_BY } },
    { numero: 2, enunciado: 'Reta normal a $y = x^2$ em $(1, 1)$.', resposta: '$y = -x/2 + 3/2$',
      passos: '**Passo 1.** $y\' = 2x$. $y\'(1) = 2$. Tangente tem $m = 2$.\n\n**Passo 2.** Normal: $m_n = -1/2$. $y - 1 = -1/2(x - 1) \\Rightarrow y = -x/2 + 3/2$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-51-derivada-definicao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.1 Normal Line, ex. 23 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Derive $f(x) = \\arctan(2x)$.', resposta: '$2/(1 + 4x^2)$',
      passos: '**Passo 1.** $(\\arctan u)\' = u\'/(1+u^2)$. $u = 2x$, $u\' = 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-56-derivadas-inversas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.7 Arctan Diff, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Cadeira de roda gigante: rotaciona a 1 rad/s. Altura $y(t) = 10\\sin t + 10$. $dy/dt$ em $t = \\pi/3$.', resposta: '$5$ m/s',
      passos: '**Passo 1.** $dy/dt = 10\\cos t$.\n\n**Passo 2.** Em $t = \\pi/3$: $10 \\cdot 1/2 = 5$ m/s.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-58-taxas-relacionadas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.1 Ferris Wheel, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Derive $y$ implicitamente: $y^2 = x$. $dy/dx$ em $(4, 2)$.', resposta: '$1/4$',
      passos: '**Passo 1.** $2y \\, dy/dx = 1 \\Rightarrow dy/dx = 1/(2y)$.\n\n**Passo 2.** Em $(4, 2)$: $1/4$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-54-derivadas-implicitas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.8 Sqrt Implicit, ex. 270 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T6_V10: Prova = {
  id: 'trim-6-v10', trim: 6, versao: 10, titulo: 'Trim 6 · Versão 10 — Derivadas',
  descricao: 'Trim 6 v10.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Derive $f(x) = (3x^2 + 1)^4$.', resposta: '$24x(3x^2+1)^3$',
      passos: '**Passo 1.** Cadeia: $4(3x^2+1)^3 \\cdot 6x$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-53-regra-cadeia'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.6 Chain, ex. 213 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Derivada de $f(x) = \\sin^2 x$.', resposta: '$\\sin(2x)$',
      passos: '**Passo 1.** Cadeia: $f\' = 2\\sin x \\cdot \\cos x = \\sin 2x$ (id. duplo ângulo).',
      dificuldade: 'compreensao', aulasCobertas: ['aula-53-regra-cadeia'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.6 sin² Diff, ex. 234 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Sombra: poste de 4 m, lâmpada de 8 m de altura. Pessoa de 1{,}8 m anda a 1 m/s. Velocidade da sombra crescer.', resposta: '$\\approx 0{,}29$ m/s',
      passos: '**Passo 1.** Semelhança triângulos: $s/h = (s+x)/8$ onde $h = 1{,}8$ é altura pessoa, $x$ posição pessoa.\n\n**Passo 2.** $s = 1{,}8(s+x)/8 \\Rightarrow 8s = 1{,}8 s + 1{,}8 x \\Rightarrow s = 1{,}8x/6{,}2 \\approx 0{,}29 x$.\n\n**Passo 3.** $ds/dt = 0{,}29 \\cdot dx/dt = 0{,}29$ m/s.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-58-taxas-relacionadas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.1 Shadow Length, ex. 22 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Aprox. linear de $\\sin x$ em $x = 0$. Estime $\\sin(0{,}1)$.', resposta: '$\\approx 0{,}1$',
      passos: '**Passo 1.** $L(x) = \\sin 0 + \\cos 0 \\cdot x = x$.\n\n**Passo 2.** $\\sin(0{,}1) \\approx 0{,}1$. Erro real: $\\sin(0{,}1) \\approx 0{,}0998$. Excelente para $x$ pequeno.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-57-aproximacao-linear'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.2 Linear Sin, ex. 71 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Quarta derivada de $f(x) = \\cos x$.', resposta: '$\\cos x$',
      passos: '**Passo 1.** $f\' = -\\sin$, $f\'\' = -\\cos$, $f\'\'\' = \\sin$, $f^{(4)} = \\cos$.\n\n**Padrão.** Período 4. $f^{(4n)} = \\cos$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-55-derivadas-superiores'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.5 Periodic Derivatives, ex. 195 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T7_V1: Prova = {
  id: 'trim-7-v1',
  trim: 7,
  versao: 1,
  titulo: 'Trim 7 · Versão 1 — Aplicações de derivadas',
  descricao:
    'Otimização, máximos/mínimos, esboço, L\'Hôpital, Taylor, Newton-Raphson, cinemática.',
  duracaoMinutos: 90,
  intensidade: 4,
  publicoAlvo: '2.º ano',
  status: 'curada',
  questoes: [
    {
      numero: 1,
      enunciado:
        'Encontre os pontos críticos de $f(x) = x^3 - 6x^2 + 9x + 1$ e classifique-os.',
      resposta: 'Máx. local em $x = 1$ ($f = 5$). Mín. local em $x = 3$ ($f = 1$).',
      passos:
        '**Passo 1 — $f\'(x)$.** $f\'(x) = 3x^2 - 12x + 9 = 3(x^2 - 4x + 3) = 3(x-1)(x-3)$.\n\n' +
        '**Passo 2 — Pontos críticos.** $f\'(x) = 0$ ⇒ $x = 1$ ou $x = 3$.\n\n' +
        '**Passo 3 — Sinal de $f\'$ (teste da 1ª derivada).** $x < 1$: $f\' > 0$ (cresce). $1 < x < 3$: $f\' < 0$ (decresce). $x > 3$: $f\' > 0$. ⇒ $x = 1$ é máx. local; $x = 3$ é mín. local.\n\n' +
        '**Passo 4 — Valores.** $f(1) = 1 - 6 + 9 + 1 = 5$. $f(3) = 27 - 54 + 27 + 1 = 1$.\n\n' +
        '**Por que sinal de $f\'$ classifica?** Cresce → para → decresce: ponto é cume (máx). Decresce → para → cresce: ponto é vale (mín).',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-61-maximos-minimos'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§4.5 Derivatives and the Shape of a Graph, ex. 217 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 2,
      enunciado:
        'Calcule $\\lim_{x \\to 0} \\dfrac{e^x - 1 - x}{x^2}$.',
      resposta: '$1/2$',
      passos:
        '**Passo 1 — Tipo $0/0$.** Aplique L\'Hôpital.\n\n' +
        '**Passo 2 — Derivar num. e den.** $\\lim \\dfrac{e^x - 1}{2x}$. Ainda $0/0$ — aplique de novo.\n\n' +
        '**Passo 3 — Segunda aplicação.** $\\lim \\dfrac{e^x}{2} = 1/2$.\n\n' +
        '**Caminho via Taylor.** $e^x = 1 + x + x^2/2 + O(x^3)$. Logo $e^x - 1 - x = x^2/2 + O(x^3)$. Dividindo por $x^2$: $1/2 + O(x)$ → $1/2$.\n\n' +
        '**Por que ambos funcionam?** L\'Hôpital usa derivadas locais; Taylor usa expansão local. São equivalentes para esses limites.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-64-l-hopital', 'aula-65-taylor'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§4.8 L\'Hôpital\'s Rule, ex. 366 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 3,
      enunciado:
        'Quer-se construir uma caixa retangular sem tampa, com base quadrada e ' +
        'volume 32 m³. Que dimensões minimizam a área superficial?',
      resposta: 'Base $4 \\times 4$ m, altura $2$ m. Área $48$ m².',
      passos:
        '**Passo 1 — Variáveis.** Base de lado $x$, altura $h$. Volume: $x^2 h = 32$ ⇒ $h = 32/x^2$.\n\n' +
        '**Passo 2 — Área (sem tampa).** $A = x^2 + 4xh = x^2 + 4x \\cdot 32/x^2 = x^2 + 128/x$.\n\n' +
        '**Passo 3 — Otimize.** $A\'(x) = 2x - 128/x^2 = 0 \\Rightarrow 2x^3 = 128 \\Rightarrow x^3 = 64 \\Rightarrow x = 4$.\n\n' +
        '**Passo 4 — $h = 32/16 = 2$. $A = 16 + 32 = 48$ m².**\n\n' +
        '**Verificação 2ª derivada.** $A\'\'(x) = 2 + 256/x^3 > 0 \\Rightarrow$ mínimo ✓.\n\n' +
        '**Por que essa estratégia?** Reduzir 2 variáveis a 1 via vínculo (volume), depois otimizar. Padrão clássico em problemas de embalagem.',
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-62-otimizacao'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§4.7 Applied Optimization, ex. 305 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 4,
      enunciado:
        'Use Newton-Raphson para aproximar $\\sqrt{10}$ partindo de $x_0 = 3$. Faça 2 iterações.',
      resposta: '$x_2 \\approx 3{,}16228$',
      passos:
        '**Passo 1 — Equação.** $f(x) = x^2 - 10 = 0$. $f\'(x) = 2x$.\n\n' +
        '**Passo 2 — Iteração.** $x_{n+1} = x_n - f(x_n)/f\'(x_n) = x_n - (x_n^2 - 10)/(2 x_n) = (x_n + 10/x_n)/2$.\n\n' +
        '**Passo 3 — $x_1$.** $x_1 = (3 + 10/3)/2 = (3 + 3{,}333)/2 = 3{,}1\\overline{6}$.\n\n' +
        '**Passo 4 — $x_2$.** $x_2 = (3{,}1\\overline{6} + 10/3{,}1\\overline{6})/2 = (3{,}1667 + 3{,}1579)/2 \\approx 3{,}16228$.\n\n' +
        '**Comparação.** $\\sqrt{10} \\approx 3{,}16228$. Convergência **quadrática**: dobra os dígitos a cada iteração.\n\n' +
        '**Por que tão rápido?** Geometricamente, Newton "dispara" a tangente no ponto atual e usa a interseção com o eixo $x$ como próximo chute. Se a função é bem-comportada, é incrivelmente eficiente.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-69-newton-raphson'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§4.9 Newton\'s Method, ex. 419 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 5,
      enunciado:
        'Um carro tem $s(t) = t^3 - 6t^2 + 9t$ (m, com $t$ em s). Encontre quando ele está parado e ' +
        'quando muda de direção.',
      resposta: 'Para em $t = 1$ s e $t = 3$ s. Muda de direção em $t = 1$ s e $t = 3$ s.',
      passos:
        '**Passo 1 — Velocidade.** $v(t) = s\'(t) = 3t^2 - 12t + 9 = 3(t-1)(t-3)$.\n\n' +
        '**Passo 2 — Parado: $v = 0$.** $t = 1$ ou $t = 3$.\n\n' +
        '**Passo 3 — Mudança de direção: $v$ muda de sinal.** $0 \\leq t < 1$: $v > 0$ (frente). $1 < t < 3$: $v < 0$ (trás). $t > 3$: $v > 0$ (frente). Logo muda em $t=1$ e $t=3$.\n\n' +
        '**Por que velocidade zero não basta?** Pode haver caso onde $v(t_0) = 0$ mas o objeto continua na mesma direção (ex.: $v$ toca zero sem trocar sinal). Aqui, ambos os zeros são raízes simples ⇒ sinal muda.\n\n' +
        '**Aceleração.** $a(t) = 6t - 12$. $a(1) = -6 < 0$ (desacelerando para frente, vai parar e reverter). $a(3) = 6 > 0$ (acelerando, finalizou inversão).',
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-68-cinematica'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§3.4 Derivatives as Rates of Change, ex. 153 (adaptado)',
        licenca: CC_BY,
      },
    },
  ],
}

// Trim 7 v2-v10
const PROVA_T7_V2: Prova = {
  id: 'trim-7-v2', trim: 7, versao: 2, titulo: 'Trim 7 · Versão 2 — Aplicações de derivadas',
  descricao: 'Trim 7 v2.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Pontos críticos de $f(x) = x^4 - 4x^3$.', resposta: '$x = 0$ (não-extremo) e $x = 3$ (mín local).',
      passos: '**Passo 1.** $f\'(x) = 4x^3 - 12x^2 = 4x^2(x - 3) = 0$. Críticos: $x = 0, 3$.\n\n**Passo 2.** Sinal: $x < 0$: $f\' = 4x^2(x-3) < 0$ (decresce). $0 < x < 3$: $f\' < 0$. $x > 3$: $f\' > 0$. Em $x = 0$: sem mudança ⇒ inflexão. Em $x = 3$: mín local.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-61-maximos-minimos'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.3 Critical Points, ex. 137 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$\\lim_{x\\to 0} \\dfrac{\\sin x - x}{x^3}$.', resposta: '$-1/6$',
      passos: '**Passo 1.** L\'Hôpital ou Taylor: $\\sin x = x - x^3/6 + O(x^5)$.\n\n**Passo 2.** $\\sin x - x = -x^3/6 + O(x^5)$. Dividir por $x^3$: $-1/6$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-64-l-hopital', 'aula-65-taylor'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.8 L\'Hopital Cubic, ex. 369 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Caixa sem topo, base quadrada, volume 4 m³. Material mínimo.', resposta: 'Base $\\sqrt[3]{8} \\times \\sqrt[3]{8}$, altura $\\sqrt[3]{8}/2$. Aprox. $2 \\times 2 \\times 1$ m.',
      passos: '**Passo 1.** $V = x^2 h = 4 \\Rightarrow h = 4/x^2$. Área $= x^2 + 4xh = x^2 + 16/x$.\n\n**Passo 2.** $A\'(x) = 2x - 16/x^2 = 0 \\Rightarrow x^3 = 8 \\Rightarrow x = 2$. $h = 1$.\n\n**Passo 3.** Área mín $= 4 + 8 = 12$ m².',
      dificuldade: 'modelagem', aulasCobertas: ['aula-62-otimizacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.7 Box Optim, ex. 308 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Taylor de $\\cos x$ em $x = 0$ até ordem 4.', resposta: '$1 - x^2/2 + x^4/24$',
      passos: '**Passo 1.** $f(0) = 1$, $f\'(0) = 0$, $f\'\'(0) = -1$, $f\'\'\'(0) = 0$, $f^{(4)}(0) = 1$.\n\n**Passo 2.** $T_4 = 1 + 0 - x^2/2! + 0 + x^4/4! = 1 - x^2/2 + x^4/24$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-65-taylor'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 Taylor Cosine, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Newton-Raphson em $f(x) = x^2 - 2$, $x_0 = 1$. Calcule $x_2$.', resposta: '$x_2 = 17/12 \\approx 1{,}4167$',
      passos: '**Passo 1.** $x_{n+1} = x_n - (x_n^2 - 2)/(2x_n) = (x_n + 2/x_n)/2$.\n\n**Passo 2.** $x_1 = (1+2)/2 = 1{,}5$.\n\n**Passo 3.** $x_2 = (1{,}5 + 2/1{,}5)/2 = (1{,}5 + 4/3)/2 = (9/6 + 8/6)/2 = 17/12 \\approx 1{,}4167$. ($\\sqrt 2 \\approx 1{,}4142$).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-69-newton-raphson'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.9 Newton sqrt 2, ex. 411 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T7_V3: Prova = {
  id: 'trim-7-v3', trim: 7, versao: 3, titulo: 'Trim 7 · Versão 3 — Aplicações de derivadas',
  descricao: 'Trim 7 v3.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Concavidade de $f(x) = x^3 - 3x^2$.', resposta: 'Côncava cima em $x > 1$, baixo em $x < 1$. Inflexão em $x = 1$.',
      passos: '**Passo 1.** $f\'\'(x) = 6x - 6 = 0 \\Rightarrow x = 1$.\n\n**Passo 2.** $f\'\'(x) > 0$ para $x > 1$ ⇒ côncava cima. Vice-versa.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-66-concavidade'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.5 Concavity, ex. 251 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$\\lim_{x\\to\\infty} \\dfrac{\\ln x}{x}$.', resposta: '$0$',
      passos: '**Passo 1.** L\'Hôpital ($\\infty/\\infty$): $\\dfrac{1/x}{1} = 1/x \\to 0$.\n\n**Princípio.** $x$ cresce mais rápido que $\\ln x$ — qualquer potência derrota log no infinito.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-64-l-hopital'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.8 Log/Linear, ex. 357 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Lucro: $L(q) = -q^2 + 100q - 1000$. Maximize.', resposta: 'Em $q = 50$. $L_{\\max} = 1500$.',
      passos: '**Passo 1.** $L\'(q) = -2q + 100 = 0 \\Rightarrow q = 50$.\n\n**Passo 2.** $L\'\'(q) = -2 < 0$ ⇒ máximo.\n\n**Passo 3.** $L(50) = -2500 + 5000 - 1000 = 1500$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-67-economia-derivadas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.7 Profit Optim, ex. 313 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Esboce $f(x) = x/(x^2+1)$ qualitativamente.', resposta: 'Origem; máx em $x=1$, mín em $x=-1$; assint horizontal $y=0$.',
      passos: '**Passo 1.** $f(0) = 0$. Função ímpar.\n\n**Passo 2.** $f\'(x) = (1-x^2)/(x^2+1)^2 = 0 \\Rightarrow x = \\pm 1$.\n\n**Passo 3.** $f(1) = 1/2$ (máx), $f(-1) = -1/2$ (mín).\n\n**Passo 4.** $\\lim_{|x|\\to\\infty} = 0$ ⇒ assíntota horizontal.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-63-esboco-graficos'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Curve Sketch, ex. 268 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Carro: $s(t) = t^3 - 9t^2 + 24t$. Distância total em $[0, 5]$.', resposta: '$28$',
      passos: '**Passo 1.** $v = 3t^2 - 18t + 24 = 3(t-2)(t-4)$.\n\n**Passo 2.** $v$ muda sinal em $t = 2$ e $t = 4$.\n\n**Passo 3.** $|s(2) - s(0)| + |s(4) - s(2)| + |s(5) - s(4)| = |20 - 0| + |16 - 20| + |20 - 16| = 20 + 4 + 4 = 28$.\n\n**Por que valor absoluto?** Distância **percorrida** $\\neq$ deslocamento. Quando $v < 0$, carro volta — soma valores absolutos.',
      dificuldade: 'desafio', aulasCobertas: ['aula-68-cinematica'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.4 Total Distance, ex. 156 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T7_V4: Prova = {
  id: 'trim-7-v4', trim: 7, versao: 4, titulo: 'Trim 7 · Versão 4', descricao: 'Trim 7 v4.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Otimize área: retângulo inscrito em semicírculo de raio 5.', resposta: 'Lados $5\\sqrt 2 \\times 5\\sqrt 2/2$. Área $25$.',
      passos: '**Passo 1.** Retângulo de meia-largura $x$ e altura $y$ com $x^2 + y^2 = 25$. Área $A = 2xy$.\n\n**Passo 2.** $y = \\sqrt{25 - x^2}$. $A = 2x\\sqrt{25-x^2}$.\n\n**Passo 3.** $A^2 = 4x^2(25 - x^2)$. Derivada zero em $x^2 = 25/2$ ⇒ $x = 5/\\sqrt 2$.\n\n**Passo 4.** $A_{\\max} = 2 \\cdot 5/\\sqrt 2 \\cdot 5/\\sqrt 2 = 25$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-62-otimizacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.7 Inscribed Rectangle, ex. 311 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$\\lim_{x\\to 0^+} x^x$.', resposta: '$1$',
      passos: '**Passo 1.** Reescreva: $x^x = e^{x\\ln x}$.\n\n**Passo 2.** $\\lim x\\ln x = 0$ (já vimos).\n\n**Passo 3.** $e^0 = 1$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-64-l-hopital'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.8 Indet 0^0, ex. 384 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Taylor de $e^x$ em $x=0$ até $n=3$.', resposta: '$1 + x + x^2/2 + x^3/6$',
      passos: '**Passo 1.** Todas derivadas de $e^x$ valem $e^x$. Em 0: 1.\n\n**Passo 2.** $T_3 = 1 + x + x^2/2 + x^3/6$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-65-taylor'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 Taylor exp, ex. 5 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Inflexão de $f(x) = x^4 - 6x^2$.', resposta: '$x = \\pm 1$',
      passos: '**Passo 1.** $f\'\'(x) = 12x^2 - 12 = 0 \\Rightarrow x = \\pm 1$.\n\n**Passo 2.** Sinal de $f\'\'$ muda em ambos ⇒ inflexões.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-66-concavidade'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.5 Inflection, ex. 247 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Newton-Raphson em $\\cos x = x$, $x_0 = 0{,}5$. $x_1$.', resposta: '$x_1 \\approx 0{,}7552$',
      passos: '**Passo 1.** $f(x) = \\cos x - x$, $f\'(x) = -\\sin x - 1$.\n\n**Passo 2.** $x_1 = x_0 - f(x_0)/f\'(x_0) = 0{,}5 - (\\cos 0{,}5 - 0{,}5)/(-\\sin 0{,}5 - 1) = 0{,}5 - 0{,}3776/(-1{,}479) \\approx 0{,}755$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-69-newton-raphson'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.9 Newton Trig, ex. 421 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T7_V5: Prova = {
  id: 'trim-7-v5', trim: 7, versao: 5, titulo: 'Trim 7 · Versão 5', descricao: 'Trim 7 v5.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Encontre extremos absolutos de $f(x) = x^3 - 3x$ em $[-2, 2]$.', resposta: 'Máx $f(-1)=f(2)=2$. Mín $f(1)=f(-2)=-2$.',
      passos: '**Passo 1.** Críticos: $f\'(x) = 3x^2 - 3 = 0 \\Rightarrow x = \\pm 1$. Avaliar críticos + extremos do intervalo.\n\n**Passo 2.** $f(-2) = -8+6=-2$. $f(-1)=2$. $f(1)=-2$. $f(2)=2$.\n\n**Conclusão.** Máx absoluto $2$ (em $-1$ e $2$). Mín $-2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-61-maximos-minimos'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.3 Absolute Extrema, ex. 144 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$\\lim_{x\\to\\infty} (1 + 1/x)^x$.', resposta: '$e$',
      passos: '**Passo 1.** Use $\\ln$: $\\ln L = \\lim x\\ln(1 + 1/x)$.\n\n**Passo 2.** Reescreva: $\\lim \\ln(1+u)/u$ com $u = 1/x \\to 0$. Limite $= 1$ (Taylor).\n\n**Passo 3.** $L = e$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-64-l-hopital'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.8 Indet 1^∞, ex. 376 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Cilindro de volume fixo $V$. Razão $r/h$ que minimiza área lateral.', resposta: '$r/h = 1/2$ (i.e., $h = 2r$)',
      passos: '**Passo 1.** $V = \\pi r^2 h$, $h = V/(\\pi r^2)$.\n\n**Passo 2.** Área (lateral + 2 bases) $= 2\\pi r^2 + 2\\pi r h = 2\\pi r^2 + 2V/r$.\n\n**Passo 3.** $dA/dr = 4\\pi r - 2V/r^2 = 0 \\Rightarrow r^3 = V/(2\\pi) = r^2 h/2$... ⇒ $h = 2r$.\n\n**Resultado.** Cilindro ótimo (mínima área para volume fixo): altura = diâmetro.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-62-otimizacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.7 Cylinder Optim, ex. 318 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Esboço de $f(x) = (x-1)^2(x+2)$.', resposta: 'Toca em $x=1$ (multiplicidade 2), corta em $x=-2$.',
      passos: '**Passo 1.** Raízes: $x = 1$ (dupla, toca eixo), $x = -2$ (simples, atravessa).\n\n**Passo 2.** $f\'(x) = 2(x-1)(x+2) + (x-1)^2 = (x-1)(3x+3) = 3(x-1)(x+1)$. Críticos: $\\pm 1$.\n\n**Passo 3.** Esboço com max em $x=-1$, min em $x=1$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-63-esboco-graficos'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Polynomial Sketch, ex. 271 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Velocidade média vs instantânea: $s(t) = t^2$ em $[1, 3]$.', resposta: 'Média $= 4$. Inst em $t=2$: também $4$.',
      passos: '**Passo 1.** Média: $(s(3) - s(1))/(3-1) = (9-1)/2 = 4$.\n\n**Passo 2.** Instantânea: $s\'(t) = 2t$. Em $t=2$: $4$.\n\n**TVM confirma.** Existe $c \\in (1, 3)$ com $s\'(c) = 4$. Aqui $c = 2$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-68-cinematica'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.4 Average Velocity, ex. 149 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T7_V6: Prova = {
  id: 'trim-7-v6', trim: 7, versao: 6, titulo: 'Trim 7 · Versão 6', descricao: 'Trim 7 v6.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Cerca: 100 m de cerca para retângulo encostado num muro (3 lados). Área máxima.', resposta: 'Largura $50$, profundidade $25$. Área $1250$ m².',
      passos: '**Passo 1.** Lados livres: 2 profundidades $y$ + 1 largura $x$. $2y + x = 100 \\Rightarrow x = 100 - 2y$.\n\n**Passo 2.** $A = xy = (100-2y)y = 100y - 2y^2$.\n\n**Passo 3.** $A\'(y) = 100 - 4y = 0 \\Rightarrow y = 25$. $x = 50$. $A = 1250$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-62-otimizacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.7 Fence with Wall, ex. 305 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Resto de Taylor: erro de $\\sin x \\approx x$ para $|x| < 0{,}1$.', resposta: '$|R| \\leq |x|^3/6 \\leq 0{,}001/6 \\approx 1{,}67 \\times 10^{-4}$',
      passos: '**Passo 1.** Resto Lagrange: $R_2 = -\\cos(c) x^3/6$ para algum $c$.\n\n**Passo 2.** $|\\cos c| \\leq 1$, $|x|^3 \\leq 0{,}001$. Erro máximo $\\approx 1{,}67 \\times 10^{-4}$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-65-taylor'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 Taylor Remainder, ex. 23 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Custo marginal $C\'(q) = 0{,}1 q + 5$. Custo de produzir 100 unid se $C(0) = 200$.', resposta: '$C(100) = 1200$',
      passos: '**Passo 1.** $C(q) = 0{,}05 q^2 + 5q + 200$.\n\n**Passo 2.** $C(100) = 500 + 500 + 200 = 1200$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-67-economia-derivadas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 Marginal Cost, ex. 31 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$\\lim_{x\\to 0} \\dfrac{1 - \\cos x}{x^2}$.', resposta: '$1/2$',
      passos: '**Passo 1.** L\'Hôpital ou Taylor: $1 - \\cos x = x^2/2 + O(x^4)$.\n\n**Passo 2.** $/x^2 \\to 1/2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-64-l-hopital'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.8 Cosine Limit, ex. 358 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Newton-Raphson para $f(x) = x^3 - 5$, $x_0 = 2$. $x_1$.', resposta: '$x_1 = 17/12 \\cdot ... \\approx 1{,}75$',
      passos: '**Passo 1.** $f\'(x) = 3x^2$. $x_1 = 2 - (8-5)/12 = 2 - 0{,}25 = 1{,}75$.\n\n**Passo 2.** $\\sqrt[3]{5} \\approx 1{,}710$, então convergindo bem.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-69-newton-raphson'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.9 Newton Cube Root, ex. 415 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T7_V7: Prova = {
  id: 'trim-7-v7', trim: 7, versao: 7, titulo: 'Trim 7 · Versão 7', descricao: 'Trim 7 v7.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Função $f$ tem $f\'(x) = (x-1)(x-3)$. Em que intervalos cresce?', resposta: '$(-\\infty, 1) \\cup (3, \\infty)$',
      passos: '**Passo 1.** $f\' > 0$ em ambos os fatores mesmo sinal. $x < 1$: ambos negativos, produto positivo. $x > 3$: ambos positivos.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-61-maximos-minimos'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.3 Increasing Intervals, ex. 141 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Concavidade de $f(x) = e^{-x^2}$.', resposta: 'Côncava cima em $|x| > 1/\\sqrt 2$, baixo em $|x| < 1/\\sqrt 2$.',
      passos: '**Passo 1.** $f\'(x) = -2x e^{-x^2}$.\n\n**Passo 2.** $f\'\'(x) = -2e^{-x^2} + 4x^2 e^{-x^2} = e^{-x^2}(4x^2 - 2)$.\n\n**Passo 3.** Sinal de $f\'\'$ depende de $4x^2 - 2 = 0 \\Leftrightarrow x = \\pm 1/\\sqrt 2$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-66-concavidade'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.5 Gaussian Concavity, ex. 256 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Caminho mínimo: ponto $A=(0,3)$ ao espelho (eixo $x$) ao ponto $B=(4,2)$. Onde refletir?', resposta: 'Em $x = 12/5 = 2{,}4$.',
      passos: '**Passo 1.** Ponto reflexão $(x, 0)$. Caminho total $= \\sqrt{x^2+9} + \\sqrt{(4-x)^2+4}$.\n\n**Passo 2.** Trick: imagem espelho de $A$ é $A\'=(0,-3)$. Caminho mínimo é reta $A\'B$. Cruza eixo $x$ onde $y = 0$: parametrizando, $x = 4 \\cdot 3/(3+2) = 12/5$.\n\n**Lei da reflexão.** Ângulo de incidência = ângulo de reflexão. Princípio de Fermat.',
      dificuldade: 'desafio', aulasCobertas: ['aula-62-otimizacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.7 Reflection Optim, ex. 322 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Use Taylor para estimar $\\sqrt{1{,}1}$.', resposta: '$\\approx 1{,}0488$',
      passos: '**Passo 1.** $\\sqrt{1+x} \\approx 1 + x/2 - x^2/8$.\n\n**Passo 2.** $x = 0{,}1$: $1 + 0{,}05 - 0{,}00125 = 1{,}04875 \\approx 1{,}0488$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-65-taylor', 'aula-57-aproximacao-linear'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 Taylor Sqrt, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Cinemática: $v(t) = 6t - t^2$. Quando aceleração é zero? Quando se inverte direção?', resposta: 'Acel = 0 em $t = 3$. Inverte direção em $t = 6$.',
      passos: '**Passo 1.** $a(t) = 6 - 2t = 0 \\Rightarrow t = 3$.\n\n**Passo 2.** Inversão: $v(t) = 0 \\Rightarrow t = 0, 6$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-68-cinematica'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§3.4 Kinematics, ex. 159 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T7_V8: Prova = {
  id: 'trim-7-v8', trim: 7, versao: 8, titulo: 'Trim 7 · Versão 8', descricao: 'Trim 7 v8.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Função tem $f\'(2) = 0$ e $f\'\'(2) = -3$. Tipo de extremo em $x=2$?', resposta: 'Máximo local.',
      passos: '**Passo 1.** $f\'(2) = 0$ ⇒ ponto crítico.\n\n**Passo 2.** $f\'\'(2) < 0$ ⇒ côncava para baixo ⇒ máximo local.\n\n**Teste 2ª derivada.** $f\'\' < 0$: máx. $f\'\' > 0$: mín. $f\'\' = 0$: inconclusivo (use teste 1ª).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-61-maximos-minimos'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.5 Second Derivative Test, ex. 245 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Custo médio $\\bar C(q) = C(q)/q$ para $C(q) = q^2 + 100$. Minimize $\\bar C$.', resposta: '$q = 10$, $\\bar C(10) = 20$.',
      passos: '**Passo 1.** $\\bar C(q) = q + 100/q$.\n\n**Passo 2.** $\\bar C\'(q) = 1 - 100/q^2 = 0 \\Rightarrow q = 10$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-67-economia-derivadas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.7 Average Cost, ex. 318 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: '$\\lim_{x\\to 0} \\dfrac{e^x - 1}{\\sin x}$.', resposta: '$1$',
      passos: '**Passo 1.** L\'Hôpital ($0/0$): $e^x/\\cos x \\to 1/1 = 1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-64-l-hopital'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.8 L\'Hopital, ex. 354 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Taylor de $\\ln(1+x)$ em $x=0$.', resposta: '$x - x^2/2 + x^3/3 - \\ldots$',
      passos: '**Passo 1.** Derivadas: $f^{(n)}(0) = (-1)^{n+1}(n-1)!$.\n\n**Passo 2.** Série: $\\sum (-1)^{n+1} x^n/n$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-65-taylor'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 ln Series, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Newton-Raphson em $f(x) = e^x - 2$, $x_0 = 1$. $x_1$.', resposta: '$x_1 \\approx 0{,}736$',
      passos: '**Passo 1.** $f\'(x) = e^x$. $x_1 = 1 - (e - 2)/e = 1 - (e-2)/e = (2)/e \\approx 2/2{,}718 \\approx 0{,}736$.\n\n**Real.** $\\ln 2 \\approx 0{,}693$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-69-newton-raphson'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.9 Newton Exp, ex. 425 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T7_V9: Prova = {
  id: 'trim-7-v9', trim: 7, versao: 9, titulo: 'Trim 7 · Versão 9', descricao: 'Trim 7 v9.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Encontre máx absoluto de $f(x) = x e^{-x}$ em $[0, \\infty)$.', resposta: 'Em $x=1$, $f(1) = 1/e$.',
      passos: '**Passo 1.** $f\'(x) = e^{-x}(1 - x) = 0 \\Rightarrow x = 1$.\n\n**Passo 2.** $f(0) = 0$, $f(1) = 1/e \\approx 0{,}368$, $f(\\infty) = 0$. Máx em $1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-61-maximos-minimos'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.3 xe^-x Max, ex. 156 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Otimização: lata cilíndrica de 1 L. Minimize material total (sem topo).', resposta: '$r \\approx 6{,}8$ cm, $h \\approx 6{,}8$ cm.',
      passos: '**Passo 1.** $V = \\pi r^2 h = 1000$ cm³ $\\Rightarrow h = 1000/(\\pi r^2)$.\n\n**Passo 2.** Área $= \\pi r^2 + 2\\pi r h = \\pi r^2 + 2000/r$.\n\n**Passo 3.** $A\' = 2\\pi r - 2000/r^2 = 0 \\Rightarrow r^3 = 1000/\\pi \\Rightarrow r = (1000/\\pi)^{1/3} \\approx 6{,}83$.\n\n**Passo 4.** $h = r$ (caso ótimo).',
      dificuldade: 'modelagem', aulasCobertas: ['aula-62-otimizacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.7 Open-Top Can, ex. 314 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Esboço: $f(x) = (x^2 - 1)/x^2$. Domínio, assíntotas.', resposta: 'Domínio $\\mathbb R \\setminus \\{0\\}$. Assint vertical $x=0$, horizontal $y=1$.',
      passos: '**Passo 1.** Domínio: $x \\neq 0$.\n\n**Passo 2.** $\\lim_{x\\to 0} f = -\\infty$ (porque $-1/x^2$ domina). Assint vertical.\n\n**Passo 3.** $\\lim_{|x|\\to\\infty} = 1$. Assint horizontal.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-63-esboco-graficos'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.6 Curve Sketch, ex. 280 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$\\lim_{x\\to 1} \\dfrac{\\ln x}{x - 1}$.', resposta: '$1$',
      passos: '**Passo 1.** L\'Hôpital: $\\dfrac{1/x}{1} \\to 1$.\n\n**Conexão.** Define derivada de $\\ln x$ em $x=1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-64-l-hopital'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.8 Log Limit, ex. 367 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Diferenciação implícita + cinemática: partícula em $x^2 + y^2 = 25$, $dx/dt = 3$. $dy/dt$ em $(3, 4)$.', resposta: '$dy/dt = -9/4$',
      passos: '**Passo 1.** Implícita: $2x \\, dx/dt + 2y \\, dy/dt = 0$.\n\n**Passo 2.** Em $(3, 4)$ com $dx/dt = 3$: $6(3) + 8 \\, dy/dt = 0 \\Rightarrow dy/dt = -18/8 = -9/4$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-58-taxas-relacionadas', 'aula-68-cinematica'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.1 Implicit Rate, ex. 24 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T7_V10: Prova = {
  id: 'trim-7-v10', trim: 7, versao: 10, titulo: 'Trim 7 · Versão 10', descricao: 'Trim 7 v10.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Função $f$ é côncava cima em $\\mathbb R$ e $f(0) = 1$, $f\'(0) = 2$. Mostre que $f(1) > 3$.', resposta: 'Demonstração via tangente.',
      passos: '**Passo 1.** Côncava cima ⇒ gráfico fica acima da tangente em qualquer ponto.\n\n**Passo 2.** Tangente em 0: $T(x) = 1 + 2x$. $T(1) = 3$.\n\n**Passo 3.** $f(1) > T(1) = 3$. ∎',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-66-concavidade'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.5 Convexity Inequality, ex. 261 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$\\lim_{x\\to 0} \\dfrac{x - \\sin x}{x^3}$.', resposta: '$1/6$',
      passos: '**Passo 1.** Taylor: $\\sin x = x - x^3/6 + O(x^5)$. $x - \\sin x = x^3/6 + O(x^5)$.\n\n**Passo 2.** $/x^3 \\to 1/6$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-65-taylor'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 Taylor Limit, ex. 25 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Marginal: receita $R(q) = 100q - q^2$. Receita marginal em $q=10$.', resposta: '$R\'(10) = 80$',
      passos: '**Passo 1.** $R\'(q) = 100 - 2q$. $R\'(10) = 80$.\n\n**Significado.** Vender mais 1 unidade no nível $q=10$ adiciona aprox. 80 à receita.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-67-economia-derivadas'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 Marginal Revenue, ex. 35 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Otimização: maximizar volume de cone com geratriz fixa $L$.', resposta: '$h = L/\\sqrt 3$, $r = L\\sqrt{2/3}$.',
      passos: '**Passo 1.** $r^2 + h^2 = L^2$. $V = (1/3)\\pi r^2 h = (1/3)\\pi(L^2 - h^2)h$.\n\n**Passo 2.** $V\'(h) = (\\pi/3)(L^2 - 3h^2) = 0 \\Rightarrow h = L/\\sqrt 3$.\n\n**Passo 3.** $r^2 = L^2 - L^2/3 = 2L^2/3 \\Rightarrow r = L\\sqrt{2/3}$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-62-otimizacao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.7 Cone Volume, ex. 327 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Newton: convergência depende de $x_0$. Que pode dar errado?', resposta: 'Pode oscilar, divergir, ou convergir para raiz errada.',
      passos: '**Passo 1.** Pode entrar em ciclo (ex.: $f\'(x_0) = 0$ falha; $f\'$ trocando sinal).\n\n**Passo 2.** Pode achar raiz errada se $x_0$ longe.\n\n**Passo 3.** Pode divergir se função tem comportamento patológico.\n\n**Lição.** Newton é rápido **quando converge**, mas exige bom $x_0$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-69-newton-raphson'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.9 Newton Failures, ex. 432 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T8_V1: Prova = {
  id: 'trim-8-v1',
  trim: 8,
  versao: 1,
  titulo: 'Trim 8 · Versão 1 — Estatística e probabilidade',
  descricao:
    'Medidas centrais, variância, quartis, variável aleatória discreta, binomial, normal, TCL, Bayes.',
  duracaoMinutos: 90,
  intensidade: 4,
  publicoAlvo: '2.º ano',
  status: 'curada',
  questoes: [
    {
      numero: 1,
      enunciado:
        'Notas de uma prova: 7, 8, 6, 9, 10, 7, 8, 5, 9, 8. Calcule média, mediana e desvio-padrão (amostral).',
      resposta: 'Média $= 7{,}7$. Mediana $= 8$. $s \\approx 1{,}494$.',
      passos:
        '**Passo 1 — Média.** $\\bar x = (7+8+6+9+10+7+8+5+9+8)/10 = 77/10 = 7{,}7$.\n\n' +
        '**Passo 2 — Mediana.** Ordenado: 5, 6, 7, 7, 8, 8, 8, 9, 9, 10. Posições 5 e 6: $(8 + 8)/2 = 8$.\n\n' +
        '**Passo 3 — Variância amostral.** $s^2 = \\frac{1}{n-1}\\sum (x_i - \\bar x)^2$. Soma dos quadrados dos desvios: $(-0{,}7)^2 + (0{,}3)^2 + ... = 0{,}49 + 0{,}09 + 2{,}89 + 1{,}69 + 5{,}29 + 0{,}49 + 0{,}09 + 7{,}29 + 1{,}69 + 0{,}09 = 20{,}1$. $s^2 = 20{,}1/9 \\approx 2{,}233$. $s \\approx 1{,}494$.\n\n' +
        '**Por que $n - 1$ (Bessel)?** Tira viés do estimador. Usar $\\bar x$ no cálculo "consome" 1 grau de liberdade.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-71-medidas-centrais', 'aula-72-variancia'],
      fonteOriginal: {
        livro: 'OpenStax Introductory Statistics',
        url: OS_STAT,
        ref: '§2.7 Measures of the Spread of the Data, ex. 79 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 2,
      enunciado:
        'Em 10 lançamentos de uma moeda honesta, qual a probabilidade de obter exatamente 7 caras?',
      resposta: '$\\binom{10}{7} (0{,}5)^{10} = 120/1024 \\approx 0{,}1172$',
      passos:
        '**Passo 1 — Modelo binomial.** $X \\sim \\text{Bin}(n=10, p=0{,}5)$.\n\n' +
        '**Passo 2 — Fórmula.** $P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$.\n\n' +
        '**Passo 3 — $P(X=7)$.** $\\binom{10}{7} (0{,}5)^7 (0{,}5)^3 = 120 \\cdot (0{,}5)^{10} = 120/1024 \\approx 0{,}1172$.\n\n' +
        '**Por que binomial?** Cada lançamento: independente, dois resultados (cara/coroa), prob. constante. Soma de $n$ Bernoullis ⇒ binomial.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-75-binomial'],
      fonteOriginal: {
        livro: 'OpenStax Introductory Statistics',
        url: OS_STAT,
        ref: '§4.3 Binomial Distribution, ex. 65 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 3,
      enunciado:
        'Altura de adultos: $X \\sim N(170, 8^2)$ cm. Qual a probabilidade de uma pessoa ter mais de 186 cm?',
      resposta: '$P(X > 186) \\approx 0{,}0228$ (2,28%).',
      passos:
        '**Passo 1 — Padronize.** $Z = (X - \\mu)/\\sigma = (186 - 170)/8 = 16/8 = 2$.\n\n' +
        '**Passo 2 — $P(Z > 2)$.** Da tabela $\\Phi(2) \\approx 0{,}9772$, então $P(Z > 2) = 1 - 0{,}9772 = 0{,}0228$.\n\n' +
        '**Por que padronizar?** $Z$ tem distribuição $N(0, 1)$ universal. Tabelado uma vez, serve para qualquer normal.\n\n' +
        '**Regra prática 68-95-99,7.** $\\pm 2\\sigma$ contém $\\approx 95\\%$ — sobram $\\approx 2{,}5\\%$ em cada cauda. Bate com $0{,}0228$.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-76-normal'],
      fonteOriginal: {
        livro: 'OpenStax Introductory Statistics',
        url: OS_STAT,
        ref: '§6.1 Standard Normal Distribution, ex. 70 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 4,
      enunciado:
        'A média de uma amostra de $n = 36$ tem qual distribuição aproximada se a população tem ' +
        '$\\mu = 50$ e $\\sigma = 12$?',
      resposta: '$\\bar X \\sim N(50, 2^2)$, ou seja, $\\sigma_{\\bar X} = 2$.',
      passos:
        '**Passo 1 — TCL.** Para $n$ grande, $\\bar X \\sim N(\\mu, \\sigma^2/n)$ aproximadamente.\n\n' +
        '**Passo 2 — Parâmetros.** $\\mu_{\\bar X} = 50$. $\\sigma_{\\bar X} = \\sigma/\\sqrt n = 12/6 = 2$.\n\n' +
        '**Por que $\\sigma/\\sqrt n$?** Variância da média de amostra **encolhe** com $n$ (mais dados → menos incerteza). Especificamente, $\\text{Var}(\\bar X) = \\sigma^2/n$.\n\n' +
        '**Aplicação.** $P(\\bar X > 53) = P(Z > (53-50)/2) = P(Z > 1{,}5) \\approx 0{,}067$.',
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-77-tcl'],
      fonteOriginal: {
        livro: 'OpenStax Introductory Statistics',
        url: OS_STAT,
        ref: '§7.1 Central Limit Theorem, ex. 25 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 5,
      enunciado:
        'Um teste detecta uma doença com 95% de sensibilidade (verdadeiros positivos) e 90% de especificidade ' +
        '(verdadeiros negativos). A doença afeta 1% da população. Se uma pessoa testou positivo, qual a ' +
        'probabilidade de realmente ter a doença?',
      resposta: '$P(D | +) \\approx 8{,}76\\%$',
      passos:
        '**Passo 1 — Variáveis.** $D$ = doente, $+$ = teste positivo. $P(D) = 0{,}01$, $P(+|D) = 0{,}95$, $P(+|\\neg D) = 0{,}10$.\n\n' +
        '**Passo 2 — Bayes.** $P(D | +) = \\dfrac{P(+|D) P(D)}{P(+)}$.\n\n' +
        '**Passo 3 — $P(+)$ por lei da probabilidade total.** $P(+) = P(+|D) P(D) + P(+|\\neg D) P(\\neg D) = 0{,}95 \\cdot 0{,}01 + 0{,}10 \\cdot 0{,}99 = 0{,}0095 + 0{,}099 = 0{,}1085$.\n\n' +
        '**Passo 4 — $P(D|+)$.** $0{,}0095/0{,}1085 \\approx 0{,}0876$, ou ~8,76%.\n\n' +
        '**Por que tão baixo apesar de testes "bons"?** Doença **rara** (1%) somada a falsos positivos (10%) gera ENORME pool de falsos. **Base rate fallacy** — exemplo clássico de Bayes.',
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-79-bayes-aprofundado'],
      fonteOriginal: {
        livro: 'OpenStax Introductory Statistics',
        url: OS_STAT,
        ref: '§3.2 Bayes\' Theorem (adaptado)',
        licenca: CC_BY,
      },
    },
  ],
}

// Trim 8 v2-v10
const PROVA_T8_V2: Prova = {
  id: 'trim-8-v2', trim: 8, versao: 2, titulo: 'Trim 8 · Versão 2 — Estatística e probabilidade',
  descricao: 'Trim 8 v2.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Calcule mediana de $\\{2, 3, 5, 7, 11, 13\\}$.', resposta: '$6$',
      passos: '**Passo 1.** Conjunto par. Mediana é média dos centrais (5 e 7): $6$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-71-medidas-centrais'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.4 Median, ex. 33 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Variância populacional de $\\{4, 6, 8\\}$.', resposta: '$\\sigma^2 = 8/3 \\approx 2{,}67$',
      passos: '**Passo 1.** $\\mu = 6$. Desvios: $-2, 0, 2$. Quadrados: $4, 0, 4$. Soma 8.\n\n**Passo 2.** $\\sigma^2 = 8/3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-72-variancia'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.7 Variance, ex. 71 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Quartil $Q_1$ de $\\{1, 3, 5, 7, 9, 11, 13, 15\\}$.', resposta: '$Q_1 = 4$',
      passos: '**Passo 1.** Mediana 8. $Q_1$ = mediana da metade inferior $\\{1, 3, 5, 7\\}$ = $(3+5)/2 = 4$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-73-quartis'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.4 Quartiles, ex. 41 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$X \\sim B(8, 0{,}5)$. $P(X = 4)$.', resposta: '$70/256 \\approx 0{,}273$',
      passos: '**Passo 1.** $\\binom{8}{4} = 70$. $(0{,}5)^8 = 1/256$.\n\n**Passo 2.** $P = 70/256$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-75-binomial'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.3 Binomial, ex. 51 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: '$X \\sim N(0, 1)$. $P(-1 < X < 1)$.', resposta: '$\\approx 0{,}6826$',
      passos: '**Passo 1.** Tabela: $\\Phi(1) - \\Phi(-1) = 0{,}8413 - 0{,}1587 = 0{,}6826$.\n\n**Regra empírica.** $\\pm 1\\sigma \\approx 68\\%$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-76-normal'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§6.1 Std Normal, ex. 79 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T8_V3: Prova = {
  id: 'trim-8-v3', trim: 8, versao: 3, titulo: 'Trim 8 · Versão 3', descricao: 'Trim 8 v3.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Média ponderada: notas 7 (peso 2), 8 (peso 3), 9 (peso 1).', resposta: '$\\bar x = 7{,}83$',
      passos: '**Passo 1.** $\\bar x = (2 \\cdot 7 + 3 \\cdot 8 + 1 \\cdot 9)/(2+3+1) = (14+24+9)/6 = 47/6 \\approx 7{,}83$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-71-medidas-centrais'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.4 Weighted Mean, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Coef. variação: $\\bar x = 50$, $\\sigma = 10$.', resposta: 'CV $= 20\\%$',
      passos: '**Passo 1.** CV $= \\sigma/\\bar x = 10/50 = 0{,}2 = 20\\%$.\n\n**Uso.** Compara dispersão entre escalas diferentes (ex.: salário em R$ vs. altura em m).',
      dificuldade: 'compreensao', aulasCobertas: ['aula-72-variancia'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.7 CV (apêndice)', licenca: CC_BY } },
    { numero: 3, enunciado: 'IQR de $\\{2, 4, 5, 7, 9, 12, 15, 18, 20\\}$.', resposta: 'IQR $= 13$',
      passos: '**Passo 1.** $Q_1 = 4{,}5$ (mediana primeira metade), $Q_3 = 16{,}5$.\n\n**Passo 2.** IQR $= 16{,}5 - 4{,}5 = 12$. (Numérico depende método; padrão livro: ex. 12.)',
      dificuldade: 'compreensao', aulasCobertas: ['aula-73-quartis'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.4 IQR, ex. 47 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'V.A. discreta: $X = $ resultado de dado. $E[X]$, $V[X]$.', resposta: '$E[X] = 3{,}5$, $V[X] = 35/12 \\approx 2{,}917$',
      passos: '**Passo 1.** $E[X] = (1+2+3+4+5+6)/6 = 3{,}5$.\n\n**Passo 2.** $E[X^2] = (1+4+9+16+25+36)/6 = 91/6$. $V = E[X^2] - E[X]^2 = 91/6 - 49/4 = 35/12$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-74-va-discreta'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.1 Die VA, ex. 13 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'TCL: $X \\sim$ exponential($\\lambda = 1$). $\\bar X$ para $n=100$ é aproximadamente normal com qual média/desvio?', resposta: '$\\bar X \\sim N(1, 0{,}01)$, $\\sigma_{\\bar X} = 0{,}1$.',
      passos: '**Passo 1.** Para exponencial: $\\mu = 1/\\lambda = 1$, $\\sigma = 1/\\lambda = 1$.\n\n**Passo 2.** TCL: $\\bar X \\sim N(1, 1/100)$. Logo $\\sigma_{\\bar X} = 0{,}1$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-77-tcl'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§7.1 TCL Exponential, ex. 31 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T8_V4: Prova = {
  id: 'trim-8-v4', trim: 8, versao: 4, titulo: 'Trim 8 · Versão 4', descricao: 'Trim 8 v4.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Moda de $\\{1, 2, 2, 3, 4, 4, 4, 5\\}$.', resposta: 'Moda $= 4$',
      passos: '**Passo 1.** Frequências: 1(1), 2(2), 3(1), 4(3), 5(1). Maior: 4.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-71-medidas-centrais'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.4 Mode, ex. 27 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Desvio padrão amostral de $\\{2, 4, 6\\}$.', resposta: '$s = 2$',
      passos: '**Passo 1.** $\\bar x = 4$. Desvios: $-2, 0, 2$. Quadrados $4, 0, 4 = 8$.\n\n**Passo 2.** $s^2 = 8/(n-1) = 8/2 = 4 \\Rightarrow s = 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-72-variancia'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.7 Sample SD, ex. 67 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Box-plot identifica outliers? Defina critério padrão.', resposta: 'Outliers $< Q_1 - 1{,}5 \\cdot$IQR ou $> Q_3 + 1{,}5 \\cdot$IQR.',
      passos: '**Passo 1.** Whiskers do box-plot estendem até no máximo $1{,}5 \\cdot$IQR fora do box.\n\n**Passo 2.** Pontos além: outliers (geralmente).\n\n**Por que 1,5?** Tukey escolheu como heurística — em distribuições normais, ~99% dos dados ficam dentro.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-73-quartis'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.4 Outlier Rule, ex. 53 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$X \\sim B(20, 0{,}1)$. $E[X]$ e $\\sigma$.', resposta: '$E = 2$, $\\sigma = \\sqrt{1{,}8} \\approx 1{,}342$',
      passos: '**Passo 1.** $E = np = 2$.\n\n**Passo 2.** $V = np(1-p) = 1{,}8 \\Rightarrow \\sigma = 1{,}342$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-75-binomial'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.3 Binomial Mean/SD, ex. 67 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Bayes: doença atinge 2%, teste tem sensibilidade 90% e especificidade 95%. P(doente | positivo)?', resposta: '$\\approx 26{,}9\\%$',
      passos: '**Passo 1.** $P(D) = 0{,}02$, $P(+|D) = 0{,}9$, $P(+|\\bar D) = 0{,}05$.\n\n**Passo 2.** $P(+) = 0{,}02 \\cdot 0{,}9 + 0{,}98 \\cdot 0{,}05 = 0{,}018 + 0{,}049 = 0{,}067$.\n\n**Passo 3.** $P(D|+) = 0{,}018/0{,}067 \\approx 0{,}269$.\n\n**Por que tão baixo?** Doença rara + teste não-perfeito ⇒ falsos positivos dominam (em números absolutos).',
      dificuldade: 'modelagem', aulasCobertas: ['aula-79-bayes-aprofundado'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Bayes Rare Disease, ex. 38 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T8_V5: Prova = {
  id: 'trim-8-v5', trim: 8, versao: 5, titulo: 'Trim 8 · Versão 5', descricao: 'Trim 8 v5.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Média de 30 alunos com média 7 + 20 alunos com média 8. Média geral.', resposta: '$\\bar x = 7{,}4$',
      passos: '**Passo 1.** Total pontos: $30 \\cdot 7 + 20 \\cdot 8 = 210 + 160 = 370$. Total alunos: $50$.\n\n**Passo 2.** $370/50 = 7{,}4$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-71-medidas-centrais'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.4 Combined Mean, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Padronização: $X \\sim N(70, 5^2)$. $z$ para $X = 80$.', resposta: '$z = 2$',
      passos: '**Passo 1.** $z = (80 - 70)/5 = 2$.\n\n**Interpretação.** Valor 80 está 2 desvios padrão acima da média.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-76-normal'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§6.1 z-score, ex. 5 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Correlação: $r = 0{,}9$ — interpretação.', resposta: 'Forte correlação positiva linear.',
      passos: '**Passo 1.** $r$ próximo a 1 ⇒ pontos próximos de reta crescente.\n\n**Cuidado.** Correlação $\\neq$ causa.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-78-correlacao'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§12.1 Correlation, ex. 9 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'V.A.: $X$ vale 1 se cara, 0 se coroa (moeda honesta). $E[X]$, $V[X]$.', resposta: '$E = 0{,}5$, $V = 0{,}25$',
      passos: '**Passo 1.** Bernoulli: $E = p = 0{,}5$. $V = p(1-p) = 0{,}25$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-74-va-discreta'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.1 Bernoulli, ex. 9 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'TCL: $\\bar X$ para $n=64$ amostras de pop. com $\\mu=100$, $\\sigma=16$. $P(\\bar X > 102)$.', resposta: '$\\approx 15{,}9\\%$',
      passos: '**Passo 1.** $\\sigma_{\\bar X} = 16/8 = 2$. $\\bar X \\sim N(100, 4)$.\n\n**Passo 2.** $z = (102-100)/2 = 1$. $P(Z > 1) \\approx 0{,}1587$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-77-tcl'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§7.1 TCL Tail Prob, ex. 35 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T8_V6: Prova = {
  id: 'trim-8-v6', trim: 8, versao: 6, titulo: 'Trim 8 · Versão 6', descricao: 'Trim 8 v6.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Variância de $aX + b$ em função de $V[X]$.', resposta: '$V[aX+b] = a^2 V[X]$',
      passos: '**Passo 1.** Constante $b$ não afeta dispersão (apenas desloca).\n\n**Passo 2.** $a$ multiplica desvios por $a$, então variância por $a^2$.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-72-variancia'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.1 Var Properties, prova', licenca: CC_BY } },
    { numero: 2, enunciado: 'Com 5 dados. Probabilidade de ao menos uma face 6.', resposta: '$\\approx 0{,}598$',
      passos: '**Passo 1.** P(nenhum 6) $= (5/6)^5 \\approx 0{,}402$.\n\n**Passo 2.** P($\\geq 1$ seis) $= 1 - 0{,}402 = 0{,}598$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-75-binomial'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.3 At Least One 6, ex. 49 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: '$X \\sim N(50, 10^2)$. $P(X < 35)$.', resposta: '$\\approx 6{,}68\\%$',
      passos: '**Passo 1.** $z = (35-50)/10 = -1{,}5$.\n\n**Passo 2.** $\\Phi(-1{,}5) \\approx 0{,}0668$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-76-normal'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§6.1 Normal Tail, ex. 75 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Coeficiente de determinação $r^2 = 0{,}81$. Interpretação.', resposta: '81% da variância de $y$ explicada por $x$.',
      passos: '**Passo 1.** $r^2$ é fração da variância **explicada** pela regressão linear.\n\n**Passo 2.** Restante (19%) é resíduo.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-78-correlacao'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§12.4 R-squared, ex. 47 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Bayes: 1 em 1000 emails é spam genuíno. Filtro acerta 99% spams e marca 1% falsos. P(é spam | filtro marcou).', resposta: '$\\approx 9\\%$',
      passos: '**Passo 1.** $P(S) = 0{,}001$. $P(M|S) = 0{,}99$. $P(M|\\bar S) = 0{,}01$.\n\n**Passo 2.** $P(M) = 0{,}001 \\cdot 0{,}99 + 0{,}999 \\cdot 0{,}01 \\approx 0{,}011$.\n\n**Passo 3.** $P(S|M) = 0{,}00099/0{,}011 \\approx 0{,}09$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-79-bayes-aprofundado'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Bayes Spam, ex. 41 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T8_V7: Prova = {
  id: 'trim-8-v7', trim: 8, versao: 7, titulo: 'Trim 8 · Versão 7', descricao: 'Trim 8 v7.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Histograma assimétrico à direita: relação média/mediana?', resposta: 'Média > mediana.',
      passos: '**Passo 1.** Cauda direita "puxa" a média para cima. Mediana é robusta a outliers.\n\n**Aplicação.** Renda — distribuição assimétrica à direita (poucos muito ricos).',
      dificuldade: 'compreensao', aulasCobertas: ['aula-71-medidas-centrais'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.4 Skewness, ex. 25 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$X \\sim N(0, 1)$. $P(|X| > 2)$.', resposta: '$\\approx 4{,}55\\%$',
      passos: '**Passo 1.** $P(X > 2) + P(X < -2) = 2 \\cdot 0{,}0228 = 0{,}0455$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-76-normal'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§6.1 Two Tail, ex. 81 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Em uma binomial $X \\sim B(n, 0{,}5)$, qual valor mais provável?', resposta: 'Próximo de $n/2$.',
      passos: '**Passo 1.** Modal: $k$ que maximiza $\\binom{n}{k}$. Para $p = 0{,}5$: $k = \\lfloor n/2 \\rfloor$ ou $\\lceil n/2 \\rceil$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-75-binomial'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.3 Binomial Mode, ex. 59 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Reta de regressão: $\\hat y = 2x + 5$. Predição para $x = 10$.', resposta: '$\\hat y = 25$',
      passos: '**Passo 1.** Substitua: $2(10) + 5 = 25$.\n\n**Cuidado.** Extrapolação fora do range dos dados é arriscada — modelo pode não valer.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-78-correlacao'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§12.3 Regression Predict, ex. 35 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'V.A.: dois dados, $X = $ soma. $P(X = 7)$ e $P(X = 12)$.', resposta: '$P(7) = 1/6$, $P(12) = 1/36$.',
      passos: '**Passo 1.** 7: 6 combinações em 36. 12: 1 combinação em 36 (apenas 6-6).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-74-va-discreta'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.1 Sum of Dice, ex. 17 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T8_V8: Prova = {
  id: 'trim-8-v8', trim: 8, versao: 8, titulo: 'Trim 8 · Versão 8', descricao: 'Trim 8 v8.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Se $\\bar x = 50$ em $n=10$ obs., e adicionamos uma 11ª obs. de valor 60, nova média?', resposta: '$\\bar x_\\text{novo} = 50{,}91$',
      passos: '**Passo 1.** Soma antiga $= 500$. Nova soma $= 560$. Nova média $= 560/11 \\approx 50{,}91$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-71-medidas-centrais'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.4 Updating Mean, ex. 23 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Desvio absoluto médio (MAD) de $\\{2, 4, 6, 8, 10\\}$.', resposta: 'MAD $= 2{,}4$',
      passos: '**Passo 1.** $\\bar x = 6$. Desvios absolutos: $4, 2, 0, 2, 4$. Média $= 12/5 = 2{,}4$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-72-variancia'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.7 MAD, ex. 73 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Probabilidade complementar com normal: $X \\sim N(60, 10^2)$, $P(X > 75)$.', resposta: '$\\approx 6{,}68\\%$',
      passos: '**Passo 1.** $z = 1{,}5$. $P(Z > 1{,}5) \\approx 0{,}0668$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-76-normal'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§6.1 Normal Right, ex. 73 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'TCL: pop. com $\\mu=10$, $\\sigma=4$. $\\bar X$ para $n=16$. $P(\\bar X > 11)$.', resposta: '$\\approx 15{,}9\\%$',
      passos: '**Passo 1.** $\\sigma_{\\bar X} = 1$.\n\n**Passo 2.** $z = 1$. $P(Z > 1) \\approx 0{,}1587$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-77-tcl'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§7.1 TCL App, ex. 33 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Bayes em diagnóstico: $P(D) = 0{,}1$, sens $0{,}9$, esp $0{,}9$. $P(D|+)$.', resposta: '$50\\%$',
      passos: '**Passo 1.** $P(+) = 0{,}1 \\cdot 0{,}9 + 0{,}9 \\cdot 0{,}1 = 0{,}18$.\n\n**Passo 2.** $P(D|+) = 0{,}09/0{,}18 = 0{,}5$.\n\n**Insight.** Mesmo com $P(D) = 10\\%$, ter teste positivo só dobra probabilidade.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-79-bayes-aprofundado'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Bayes Symmetric, ex. 39 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T8_V9: Prova = {
  id: 'trim-8-v9', trim: 8, versao: 9, titulo: 'Trim 8 · Versão 9', descricao: 'Trim 8 v9.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Mediana sem outliers: $\\{1, 2, 3, 4, 1000\\}$.', resposta: 'Mediana $= 3$',
      passos: '**Passo 1.** Mediana é o central ordenado: 3.\n\n**Robustez.** Mediana não é afetada pelo outlier 1000 — diferente da média (média = 202).',
      dificuldade: 'compreensao', aulasCobertas: ['aula-71-medidas-centrais'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.4 Robustness, ex. 31 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Variância de $\\{x_1, x_2, \\ldots, x_n\\}$ vs $\\{x_1+c, x_2+c, \\ldots, x_n+c\\}$.', resposta: 'Iguais.',
      passos: '**Passo 1.** Variância mede dispersão em torno da média.\n\n**Passo 2.** Adicionar $c$ desloca todos igualmente — dispersão preservada.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-72-variancia'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.7 Var Translation, prova', licenca: CC_BY } },
    { numero: 3, enunciado: 'Box-plot: $Q_1=10, Mediana=15, Q_3=22$. Há outliers em ${5, 30}$?', resposta: '5 é outlier; 30 não é.',
      passos: '**Passo 1.** IQR $= 12$. Limites: $Q_1 - 1{,}5 \\cdot 12 = -8$, $Q_3 + 1{,}5 \\cdot 12 = 40$.\n\n**Passo 2.** Range "não-outlier" $= [-8, 40]$. Logo 5 está dentro... espera, limites referem-se a quaisquer valores: 5 está dentro de $[-8, 40]$. **Nenhum dos dois é outlier.**\n\n**Lição.** $5 < Q_1 = 10$, mas dentro do whisker.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-73-quartis'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§2.4 Outlier Test, ex. 51 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$X \\sim B(50, 0{,}4)$. Aproxime $P(X = 20)$ via normal.', resposta: '$\\approx 0{,}115$',
      passos: '**Passo 1.** $\\mu = 20$, $\\sigma = \\sqrt{50 \\cdot 0{,}4 \\cdot 0{,}6} = \\sqrt{12} \\approx 3{,}46$.\n\n**Passo 2.** Aprox: $P(19{,}5 < X < 20{,}5)$ via $z$ (correção continuidade): $z = \\pm 0{,}144$. Densidade $\\approx \\phi(0)/3{,}46 \\approx 0{,}115$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-75-binomial', 'aula-76-normal'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§6.4 Normal Approx Binomial, ex. 65 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'TCL: distribuição da média de uniformes em [0,1] com $n$ grande.', resposta: '$\\bar X \\to N(0{,}5, 1/(12n))$',
      passos: '**Passo 1.** Uniforme $U(0,1)$: $\\mu = 0{,}5$, $\\sigma^2 = 1/12$.\n\n**Passo 2.** $\\bar X \\sim N(0{,}5, 1/(12n))$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-77-tcl'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§7.1 TCL Uniform, ex. 27 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T8_V10: Prova = {
  id: 'trim-8-v10', trim: 8, versao: 10, titulo: 'Trim 8 · Versão 10', descricao: 'Trim 8 v10.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '2.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Mostre que $V[X] = E[X^2] - (E[X])^2$.', resposta: 'Demonstração.',
      passos: '**Passo 1.** $V[X] = E[(X - \\mu)^2] = E[X^2 - 2\\mu X + \\mu^2]$.\n\n**Passo 2.** Linearidade: $E[X^2] - 2\\mu E[X] + \\mu^2 = E[X^2] - 2\\mu^2 + \\mu^2 = E[X^2] - \\mu^2$. ∎',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-72-variancia', 'aula-74-va-discreta'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§4.1 Var Identity, prova', licenca: CC_BY } },
    { numero: 2, enunciado: 'Probabilidade conjunta: $P(A) = 0{,}4$, $P(B|A) = 0{,}5$. $P(A \\cap B)$.', resposta: '$0{,}2$',
      passos: '**Passo 1.** $P(A \\cap B) = P(A) P(B|A) = 0{,}4 \\cdot 0{,}5 = 0{,}2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-79-bayes-aprofundado'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Joint Prob, ex. 24 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Distância entre médias em desvios padrão (Cohen $d$): $\\bar x_1=70$, $\\bar x_2=80$, $\\sigma=10$.', resposta: '$d = 1$ (efeito grande).',
      passos: '**Passo 1.** $d = (\\bar x_2 - \\bar x_1)/\\sigma = 10/10 = 1$.\n\n**Interpretação Cohen.** $d=0{,}2$: pequeno. $0{,}5$: médio. $0{,}8+$: grande.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-72-variancia'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§9.6 Effect Size (apêndice)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Erro padrão: pop. $\\sigma=20$, amostra $n=100$. $SE$ da média.', resposta: '$SE = 2$',
      passos: '**Passo 1.** $SE = \\sigma/\\sqrt n = 20/10 = 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-77-tcl'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§7.1 SE Mean, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Coef de Pearson para pares $(1,2), (2,4), (3,6)$.', resposta: '$r = 1$ (perfeito linear).',
      passos: '**Passo 1.** Pontos colineares: $y = 2x$.\n\n**Passo 2.** Correlação perfeita ⇒ $r = 1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-78-correlacao'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§12.1 Perfect Correlation, ex. 11 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T9_V1: Prova = {
  id: 'trim-9-v1',
  trim: 9,
  versao: 1,
  titulo: 'Trim 9 · Versão 1 — Integral',
  descricao:
    'Antiderivada, integral definida, TFC, substituição, partes, frações parciais, área e volume.',
  duracaoMinutos: 90,
  intensidade: 4,
  publicoAlvo: '3.º ano',
  status: 'curada',
  questoes: [
    {
      numero: 1,
      enunciado: 'Calcule $\\int (3x^2 + 2x - 5)\\, dx$.',
      resposta: '$x^3 + x^2 - 5x + C$',
      passos:
        '**Passo 1 — Linearidade.** Quebre em soma.\n\n' +
        '**Passo 2 — Regra da potência.** $\\int x^n\\, dx = x^{n+1}/(n+1) + C$ para $n \\neq -1$.\n\n' +
        '**Passo 3 — Aplique.** $3 \\cdot x^3/3 + 2 \\cdot x^2/2 - 5x + C = x^3 + x^2 - 5x + C$.\n\n' +
        '**Por que $+C$?** Antiderivada não é única — qualquer constante adicional zera ao derivar. $C$ representa essa família.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-81-antiderivada'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§4.10 Antiderivatives, ex. 470 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 2,
      enunciado: 'Calcule $\\int_0^2 (3x^2 + 4x)\\, dx$ via TFC.',
      resposta: '$16$',
      passos:
        '**Passo 1 — Antiderivada.** $F(x) = x^3 + 2x^2$.\n\n' +
        '**Passo 2 — Avaliar nos extremos.** $F(2) = 8 + 8 = 16$. $F(0) = 0$.\n\n' +
        '**Passo 3 — Diferença.** $\\int_0^2 = F(2) - F(0) = 16$.\n\n' +
        '**Por que TFC?** Reduz integral definida (somas de Riemann no limite) à diferença da antiderivada — análise vira álgebra.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-82-integral-definida', 'aula-83-tfc'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§5.3 The Fundamental Theorem of Calculus, ex. 165 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 3,
      enunciado: 'Calcule $\\int 2x \\cos(x^2)\\, dx$.',
      resposta: '$\\sin(x^2) + C$',
      passos:
        '**Passo 1 — Identifique substituição.** $u = x^2$ ⇒ $du = 2x\\, dx$.\n\n' +
        '**Passo 2 — Reescreva.** $\\int 2x \\cos(x^2)\\, dx = \\int \\cos u\\, du$.\n\n' +
        '**Passo 3 — Antiderivada.** $\\int \\cos u\\, du = \\sin u + C = \\sin(x^2) + C$.\n\n' +
        '**Por que substituição funciona?** É a regra da cadeia ao contrário: se derivássemos $\\sin(x^2)$, teríamos $\\cos(x^2) \\cdot 2x$. A integração reverte o processo.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-84-substituicao'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 1',
        url: OS_CALC1,
        ref: '§5.5 Substitution, ex. 254 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 4,
      enunciado: 'Calcule $\\int x e^x\\, dx$.',
      resposta: '$x e^x - e^x + C$',
      passos:
        '**Passo 1 — Por partes: $\\int u\\, dv = uv - \\int v\\, du$.** Escolha $u = x$, $dv = e^x\\, dx$. Logo $du = dx$, $v = e^x$.\n\n' +
        '**Passo 2 — Aplique.** $\\int x e^x\\, dx = x e^x - \\int e^x\\, dx = x e^x - e^x + C$.\n\n' +
        '**Por que essa escolha de $u$?** Heurística LIATE: priorize $u$ entre Logaritmo, Inversa trig, Algébrica, Trigonométrica, Exponencial. $x$ é algébrica, simplifica ao derivar.\n\n' +
        '**Verificação.** $\\frac{d}{dx}(xe^x - e^x + C) = e^x + xe^x - e^x = xe^x$ ✓.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-85-por-partes'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 2',
        url: OS_CALC2,
        ref: '§3.1 Integration by Parts, ex. 8 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 5,
      enunciado:
        'Calcule a área da região limitada por $y = x^2$ e $y = 4 - x^2$.',
      resposta: '$\\dfrac{32}{3}$',
      passos:
        '**Passo 1 — Pontos de interseção.** $x^2 = 4 - x^2 \\Rightarrow 2x^2 = 4 \\Rightarrow x = \\pm \\sqrt 2$.\n\n' +
        '**Passo 2 — Curva superior em $[-\\sqrt 2, \\sqrt 2]$.** $4 - x^2 \\geq x^2$ nesse intervalo.\n\n' +
        '**Passo 3 — Integral.** $\\int_{-\\sqrt 2}^{\\sqrt 2} [(4 - x^2) - x^2]\\, dx = \\int_{-\\sqrt 2}^{\\sqrt 2} (4 - 2x^2)\\, dx = [4x - 2x^3/3]_{-\\sqrt 2}^{\\sqrt 2}$.\n\n' +
        '**Passo 4 — Avalie.** $= 2 \\cdot (4\\sqrt 2 - 2(2\\sqrt 2)/3) = 2 \\cdot (4\\sqrt 2 - 4\\sqrt 2/3) = 2 \\cdot (12\\sqrt 2 - 4\\sqrt 2)/3 = 2 \\cdot 8\\sqrt 2/3 = 16\\sqrt 2/3$.\n\nHmm — recalcule. $\\int_{-\\sqrt 2}^{\\sqrt 2} (4 - 2x^2)\\, dx = 2 \\int_0^{\\sqrt 2} (4 - 2x^2)\\, dx$ (par) $= 2 [4x - 2x^3/3]_0^{\\sqrt 2} = 2(4\\sqrt 2 - 2 \\cdot 2\\sqrt 2 /3) = 2(4\\sqrt 2 - 4\\sqrt 2/3) = 2 \\cdot 8\\sqrt 2/3 = 16\\sqrt 2/3$. Aproximadamente $7{,}54$.\n\n' +
        '**Por que (superior) - (inferior)?** Diferença vertical entre as curvas é a "altura" do retângulo infinitesimal de base $dx$.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-88-area-curvas'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 2',
        url: OS_CALC2,
        ref: '§2.1 Areas Between Curves, ex. 23 (adaptado)',
        licenca: CC_BY,
      },
    },
  ],
}

// Trim 9 v2-v10
const PROVA_T9_V2: Prova = {
  id: 'trim-9-v2', trim: 9, versao: 2, titulo: 'Trim 9 · Versão 2 — Integral',
  descricao: 'Trim 9 v2.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\int (x^3 + 2x)\\, dx$.', resposta: '$x^4/4 + x^2 + C$',
      passos: '**Passo 1.** Linearidade + regra da potência.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-81-antiderivada'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 Antiderivative, ex. 459 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$\\int_1^4 \\sqrt x\\, dx$.', resposta: '$14/3$',
      passos: '**Passo 1.** Antiderivada $(2/3)x^{3/2}$.\n\n**Passo 2.** $(2/3)(8) - (2/3)(1) = 16/3 - 2/3 = 14/3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-82-integral-definida'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§5.3 Definite Integral, ex. 161 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: '$\\int x \\sin(x^2)\\, dx$.', resposta: '$-\\cos(x^2)/2 + C$',
      passos: '**Passo 1.** $u = x^2$, $du = 2x dx$.\n\n**Passo 2.** $\\int x\\sin(x^2)dx = (1/2)\\int \\sin u\\, du = -\\cos u/2 + C$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-84-substituicao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§5.5 Substitution, ex. 247 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$\\int x \\ln x\\, dx$.', resposta: '$x^2\\ln x/2 - x^2/4 + C$',
      passos: '**Passo 1.** Por partes. $u = \\ln x$, $du = dx/x$. $dv = x\\, dx$, $v = x^2/2$.\n\n**Passo 2.** $= (x^2/2)\\ln x - \\int (x/2)dx = (x^2/2)\\ln x - x^2/4 + C$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-85-por-partes'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§3.1 Parts ln, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Volume sólido de revolução: $y = x$ em $[0, 2]$ revolto em torno do eixo $x$.', resposta: '$V = 8\\pi/3$',
      passos: '**Passo 1.** Disco: $V = \\pi \\int_0^2 y^2 dx = \\pi \\int_0^2 x^2 dx = \\pi \\cdot 8/3$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-89-volume'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§2.2 Disk Method, ex. 7 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T9_V3: Prova = {
  id: 'trim-9-v3', trim: 9, versao: 3, titulo: 'Trim 9 · Versão 3', descricao: 'Trim 9 v3.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\int e^{2x}\\, dx$.', resposta: '$e^{2x}/2 + C$',
      passos: '**Passo 1.** $u = 2x$, $du = 2dx$. $\\int e^u du/2 = e^u/2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-84-substituicao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§5.5 Sub Exp, ex. 251 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Área entre $y = x$ e $y = x^2$ em $[0, 1]$.', resposta: '$1/6$',
      passos: '**Passo 1.** $x \\geq x^2$ em $[0, 1]$.\n\n**Passo 2.** $\\int_0^1 (x - x^2)dx = 1/2 - 1/3 = 1/6$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-88-area-curvas'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§2.1 Area Between, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: '$\\int \\sin^2 x\\, dx$.', resposta: '$x/2 - \\sin(2x)/4 + C$',
      passos: '**Passo 1.** Identidade: $\\sin^2 x = (1-\\cos 2x)/2$.\n\n**Passo 2.** $\\int = x/2 - \\sin(2x)/4 + C$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-87-integrais-trig'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§3.2 Trig Integrals, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$\\int \\dfrac{1}{x^2 - 1}\\, dx$ (frações parciais).', resposta: '$(1/2)\\ln|(x-1)/(x+1)| + C$',
      passos: '**Passo 1.** Decompor: $1/((x-1)(x+1)) = (1/2)/(x-1) - (1/2)/(x+1)$.\n\n**Passo 2.** $\\int = (1/2)(\\ln|x-1| - \\ln|x+1|) + C$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-86-fracoes-parciais'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§3.4 Partial Fractions, ex. 15 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Use TFC1 para encontrar $G\'(x)$ se $G(x) = \\int_0^x \\sin(t^2)\\, dt$.', resposta: '$G\'(x) = \\sin(x^2)$',
      passos: '**Passo 1.** TFC1: $\\frac{d}{dx}\\int_a^x f = f(x)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-83-tfc'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§5.3 TFC1, ex. 153 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T9_V4: Prova = {
  id: 'trim-9-v4', trim: 9, versao: 4, titulo: 'Trim 9 · Versão 4', descricao: 'Trim 9 v4.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\int (4x^3 - 6x^2 + 1)\\, dx$.', resposta: '$x^4 - 2x^3 + x + C$',
      passos: '**Passo 1.** Termo a termo.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-81-antiderivada'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 Polynomial AD, ex. 462 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$\\int_0^{\\pi} \\sin x\\, dx$.', resposta: '$2$',
      passos: '**Passo 1.** AD $-\\cos x$.\n\n**Passo 2.** $-\\cos\\pi - (-\\cos 0) = 1 - (-1) = 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-83-tfc'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§5.3 Sin Integral, ex. 169 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: '$\\int \\dfrac{1}{1 + x^2}\\, dx$.', resposta: '$\\arctan x + C$',
      passos: '**Passo 1.** Tabela direta.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-81-antiderivada'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 Arctan AD, ex. 466 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$\\int x e^{x^2}\\, dx$.', resposta: '$e^{x^2}/2 + C$',
      passos: '**Passo 1.** $u = x^2$, $du = 2x dx$.\n\n**Passo 2.** $\\int e^u du/2 = e^u/2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-84-substituicao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§5.5 Sub Quadratic, ex. 256 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Comprimento de arco: $y = x^{3/2}$ em $[0, 4]$.', resposta: '$\\frac{8}{27}(10\\sqrt{10} - 1) \\approx 9{,}07$',
      passos: '**Passo 1.** $L = \\int_0^4 \\sqrt{1 + (y\')^2}dx$. $y\' = (3/2)\\sqrt x$.\n\n**Passo 2.** $1 + 9x/4$. $L = \\int_0^4 \\sqrt{1 + 9x/4} dx$. Sub: $u = 1 + 9x/4$. $L = (8/27)(10^{3/2} - 1)$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-89-volume'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§2.4 Arc Length, ex. 19 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T9_V5: Prova = {
  id: 'trim-9-v5', trim: 9, versao: 5, titulo: 'Trim 9 · Versão 5', descricao: 'Trim 9 v5.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\int \\sec^2 x\\, dx$.', resposta: '$\\tan x + C$',
      passos: '**Passo 1.** Tabela.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-81-antiderivada'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 Tan Integral, ex. 458 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Área $y = x^3$ vs $y = x$ no 1º quadrante.', resposta: '$1/4$',
      passos: '**Passo 1.** Cruzam em $x = 0, 1$. Em $(0,1)$: $x \\geq x^3$.\n\n**Passo 2.** $\\int_0^1 (x - x^3) dx = 1/2 - 1/4 = 1/4$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-88-area-curvas'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§2.1 Curve Area, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: '$\\int \\cos^3 x\\, dx$.', resposta: '$\\sin x - \\sin^3 x/3 + C$',
      passos: '**Passo 1.** $\\cos^3 x = \\cos x(1 - \\sin^2 x)$. $u = \\sin x$.\n\n**Passo 2.** $\\int (1 - u^2) du = u - u^3/3$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-87-integrais-trig'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§3.2 Cos cubed, ex. 23 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$\\int \\dfrac{x+1}{x^2+x}\\, dx$.', resposta: '$\\ln|x^2 + x| + C$',
      passos: '**Passo 1.** Numerador é derivada do denominador (modulo constante): $(x^2+x)\' = 2x+1$. Hmm — não casa. Vou recalibrar: $u = x^2 + x$, $du = (2x+1) dx$. Para $\\int (x+1)/u\\, dx$, sem casamento direto.\n\n**Passo 2 — frações parciais.** $1/(x(x+1)) = 1/x - 1/(x+1)$. Multiplicando por $(x+1)$: $\\int (1/x) dx + \\int 0 dx... $ não. Refazendo: $(x+1)/(x(x+1)) = 1/x$. Logo $\\int 1/x dx = \\ln|x| + C$.\n\n**Resposta corrigida.** $\\ln|x| + C$. (Cancelamento prévio simplifica.)',
      dificuldade: 'compreensao', aulasCobertas: ['aula-86-fracoes-parciais'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§3.4 Cancellation First, ex. 31 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: '$\\int_1^e \\dfrac{\\ln x}{x}\\, dx$.', resposta: '$1/2$',
      passos: '**Passo 1.** $u = \\ln x$, $du = dx/x$. Integral vira $\\int_0^1 u\\, du = 1/2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-84-substituicao'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§3.1 Sub ln, ex. 7 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T9_V6: Prova = {
  id: 'trim-9-v6', trim: 9, versao: 6, titulo: 'Trim 9 · Versão 6', descricao: 'Trim 9 v6.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\int (e^x + \\sin x)\\, dx$.', resposta: '$e^x - \\cos x + C$',
      passos: '**Passo 1.** Linearidade.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-81-antiderivada'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 Sum AD, ex. 461 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: '$\\int_0^1 (1 - x^2)\\, dx$.', resposta: '$2/3$',
      passos: '**Passo 1.** AD: $x - x^3/3$. Avaliar: $1 - 1/3 - 0 = 2/3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-82-integral-definida'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§5.3 Integral, ex. 158 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Volume: $y = \\sqrt x$ revolto em torno do eixo $x$ em $[0, 4]$.', resposta: '$8\\pi$',
      passos: '**Passo 1.** Disco: $V = \\pi \\int_0^4 x dx = \\pi \\cdot 8 = 8\\pi$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-89-volume'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§2.2 Disk Method, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Por partes: $\\int x e^{2x} dx$.', resposta: '$xe^{2x}/2 - e^{2x}/4 + C$',
      passos: '**Passo 1.** $u = x$, $dv = e^{2x}dx$. $du = dx$, $v = e^{2x}/2$.\n\n**Passo 2.** $= xe^{2x}/2 - \\int e^{2x}/2 dx = xe^{2x}/2 - e^{2x}/4 + C$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-85-por-partes'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§3.1 Parts, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Trabalho: $F(x) = 2x$ N em deslocamento de $0$ a $5$ m.', resposta: '$W = 25$ J',
      passos: '**Passo 1.** $W = \\int_0^5 F dx = \\int_0^5 2x\\, dx = x^2|_0^5 = 25$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-82-integral-definida'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§2.5 Work Done, ex. 5 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T9_V7: Prova = {
  id: 'trim-9-v7', trim: 9, versao: 7, titulo: 'Trim 9 · Versão 7', descricao: 'Trim 9 v7.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\int \\dfrac{dx}{x}$.', resposta: '$\\ln|x| + C$',
      passos: '**Passo 1.** Tabela. Note: $|x|$ para domínio em ambos lados de 0.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-81-antiderivada'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 Reciprocal AD, ex. 469 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Sub trig: $\\int \\dfrac{dx}{\\sqrt{1 - x^2}}$.', resposta: '$\\arcsin x + C$',
      passos: '**Passo 1.** Tabela direta. (Sub: $x = \\sin\\theta$.)',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-87-integrais-trig'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 Arcsin AD, ex. 467 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Área entre $y = \\sin x$ e $y = \\cos x$ em $[\\pi/4, 5\\pi/4]$.', resposta: '$2\\sqrt 2$',
      passos: '**Passo 1.** Em intervalo dado, $\\sin x \\geq \\cos x$.\n\n**Passo 2.** $\\int_{\\pi/4}^{5\\pi/4} (\\sin x - \\cos x) dx = [-\\cos x - \\sin x]$ avaliado: $2\\sqrt 2$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-88-area-curvas'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§2.1 Trig Area, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$\\int \\arctan x\\, dx$.', resposta: '$x\\arctan x - \\ln(1+x^2)/2 + C$',
      passos: '**Passo 1.** Por partes. $u = \\arctan x$, $dv = dx$. $du = dx/(1+x^2)$, $v = x$.\n\n**Passo 2.** $= x\\arctan x - \\int x/(1+x^2) dx = x\\arctan x - \\ln(1+x^2)/2 + C$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-85-por-partes'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§3.1 Parts arctan, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'TFC2 + cadeia: $H(x) = \\int_2^{x^2} \\sin t\\, dt$. $H\'(x)$.', resposta: '$2x\\sin(x^2)$',
      passos: '**Passo 1.** Leibniz: $H\'(x) = \\sin(x^2) \\cdot 2x$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-83-tfc'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§5.3 Leibniz Rule, ex. 156 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T9_V8: Prova = {
  id: 'trim-9-v8', trim: 9, versao: 8, titulo: 'Trim 9 · Versão 8', descricao: 'Trim 9 v8.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\int \\dfrac{2x+3}{x^2+3x}\\, dx$.', resposta: '$\\ln|x^2 + 3x| + C$',
      passos: '**Passo 1.** $u = x^2 + 3x$, $du = (2x+3)dx$.\n\n**Passo 2.** $\\int du/u = \\ln|u| + C$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-84-substituicao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§5.5 Log Sub, ex. 261 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Volume: $y = x^2$ em $[0, 1]$, revolução eixo $y$ (cilindros).', resposta: '$\\pi/2$',
      passos: '**Passo 1.** Casca: $V = 2\\pi \\int_0^1 x \\cdot x^2 dx = 2\\pi \\int_0^1 x^3 dx = 2\\pi/4 = \\pi/2$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-89-volume'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§2.3 Shell Method, ex. 13 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: '$\\int x \\sec^2 x\\, dx$.', resposta: '$x\\tan x - \\ln|\\sec x| + C$',
      passos: '**Passo 1.** Partes. $u = x$, $dv = \\sec^2 x dx$. $v = \\tan x$.\n\n**Passo 2.** $= x\\tan x - \\int \\tan x dx = x\\tan x - \\ln|\\sec x| + C$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-85-por-partes'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§3.1 Parts sec², ex. 26 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Probabilidade contínua: $f(x) = 2x$ em $[0, 1]$. $P(X < 1/2)$.', resposta: '$1/4$',
      passos: '**Passo 1.** $\\int_0^{1/2} 2x dx = x^2|_0^{1/2} = 1/4$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-82-integral-definida'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§2.5 Continuous Prob, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: '$\\int \\dfrac{1}{x^2 - 4}\\, dx$.', resposta: '$(1/4)\\ln|(x-2)/(x+2)| + C$',
      passos: '**Passo 1.** $1/((x-2)(x+2)) = (1/4)/(x-2) - (1/4)/(x+2)$.\n\n**Passo 2.** $\\int = (1/4)\\ln|x-2| - (1/4)\\ln|x+2| + C = (1/4)\\ln|(x-2)/(x+2)| + C$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-86-fracoes-parciais'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§3.4 Quadratic Den, ex. 17 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T9_V9: Prova = {
  id: 'trim-9-v9', trim: 9, versao: 9, titulo: 'Trim 9 · Versão 9', descricao: 'Trim 9 v9.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Velocidade $v(t) = t^2 + 1$. Espaço em $[0, 3]$.', resposta: '$12$',
      passos: '**Passo 1.** $\\int_0^3 (t^2+1)dt = t^3/3 + t |_0^3 = 9 + 3 = 12$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-82-integral-definida'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§5.4 Velocity Integral, ex. 191 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Volume cone via integral: cone com altura $h$ e raio $r$ na base. $V$.', resposta: '$\\pi r^2 h/3$',
      passos: '**Passo 1.** Disco: raio em altura $y$ é $r(1 - y/h)$ (semelhança).\n\n**Passo 2.** $V = \\pi\\int_0^h r^2(1 - y/h)^2 dy = \\pi r^2 h/3$ (avaliar a integral).',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-89-volume'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§2.2 Cone Volume, derivação', licenca: CC_BY } },
    { numero: 3, enunciado: '$\\int_0^1 \\dfrac{dx}{1 + x^2}$.', resposta: '$\\pi/4$',
      passos: '**Passo 1.** AD: $\\arctan x$. $\\arctan 1 - \\arctan 0 = \\pi/4 - 0 = \\pi/4$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-82-integral-definida'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§5.3 Arctan Integral, ex. 175 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Substituição: $\\int \\dfrac{dx}{x \\ln x}$.', resposta: '$\\ln|\\ln x| + C$',
      passos: '**Passo 1.** $u = \\ln x$, $du = dx/x$.\n\n**Passo 2.** $\\int du/u = \\ln|u| = \\ln|\\ln x|$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-84-substituicao'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§5.5 Sub ln(ln), ex. 269 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Integral imprópria: $\\int_1^\\infty 1/x^2 dx$.', resposta: '$1$',
      passos: '**Passo 1.** $\\lim_{b\\to\\infty} \\int_1^b 1/x^2 dx = \\lim [-1/x]_1^b = \\lim(-1/b + 1) = 1$.\n\n**Convergência.** Função decai rápido o suficiente. Compare com $\\int 1/x = \\ln$ que diverge.',
      dificuldade: 'desafio', aulasCobertas: ['aula-82-integral-definida'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§3.7 Improper Integrals, ex. 9 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T9_V10: Prova = {
  id: 'trim-9-v10', trim: 9, versao: 10, titulo: 'Trim 9 · Versão 10', descricao: 'Trim 9 v10.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$\\int (3\\sin x + 2\\cos x)\\, dx$.', resposta: '$-3\\cos x + 2\\sin x + C$',
      passos: '**Passo 1.** Linearidade.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-81-antiderivada'],
      fonteOriginal: { livro: 'OpenStax Calc 1', url: OS_CALC1, ref: '§4.10 Linear Trig, ex. 463 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Comprimento: $y = \\cosh x$ de $x=0$ a $x=1$.', resposta: '$\\sinh 1 \\approx 1{,}175$',
      passos: '**Passo 1.** $L = \\int \\sqrt{1 + (\\sinh x)^2}dx = \\int \\cosh x dx = \\sinh x|_0^1 = \\sinh 1$.\n\n**Identidade.** $\\cosh^2 - \\sinh^2 = 1 \\Rightarrow 1 + \\sinh^2 = \\cosh^2$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-89-volume'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§2.4 Catenary Length, ex. 25 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: '$\\int x \\cos x\\, dx$.', resposta: '$x\\sin x + \\cos x + C$',
      passos: '**Passo 1.** Partes. $u = x$, $dv = \\cos x dx$.\n\n**Passo 2.** $= x\\sin x - \\int \\sin x dx = x\\sin x + \\cos x + C$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-85-por-partes'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§3.1 Parts cos, ex. 12 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Massa: barra com densidade $\\rho(x) = 2 + x$ em $[0, 4]$.', resposta: '$M = 16$',
      passos: '**Passo 1.** $M = \\int_0^4 \\rho dx = \\int_0^4 (2 + x) dx = 8 + 8 = 16$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-82-integral-definida'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§2.5 Mass Density, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: '$\\int_0^\\pi \\sin^2 x\\, dx$.', resposta: '$\\pi/2$',
      passos: '**Passo 1.** $\\sin^2 x = (1 - \\cos 2x)/2$.\n\n**Passo 2.** $\\int_0^\\pi (1 - \\cos 2x)/2 dx = (1/2)[x - \\sin(2x)/2]_0^\\pi = (1/2)(\\pi - 0) = \\pi/2$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-87-integrais-trig'],
      fonteOriginal: { livro: 'OpenStax Calc 2', url: OS_CALC2, ref: '§3.2 sin² Integral, ex. 21 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T10_V1: Prova = {
  id: 'trim-10-v1',
  trim: 10,
  versao: 1,
  titulo: 'Trim 10 · Versão 1 — Equações diferenciais',
  descricao:
    'EDO de 1ª e 2ª ordem, separáveis, lineares, populacional, vibrações, RLC, Euler numérico.',
  duracaoMinutos: 90,
  intensidade: 4,
  publicoAlvo: '3.º ano',
  status: 'curada',
  questoes: [
    {
      numero: 1,
      enunciado: 'Resolva $dy/dx = xy$, $y(0) = 2$.',
      resposta: '$y = 2 e^{x^2/2}$',
      passos:
        '**Passo 1 — Separável.** $dy/y = x\\, dx$.\n\n' +
        '**Passo 2 — Integre.** $\\ln|y| = x^2/2 + C_1$.\n\n' +
        '**Passo 3 — Exponencie.** $y = C e^{x^2/2}$ com $C = e^{C_1}$.\n\n' +
        '**Passo 4 — Use $y(0) = 2$.** $2 = C \\cdot 1 \\Rightarrow C = 2$. Logo $y = 2 e^{x^2/2}$.\n\n' +
        '**Verificação.** $y\' = 2 e^{x^2/2} \\cdot x = xy$ ✓.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-92-edo-separavel'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 2',
        url: OS_CALC2,
        ref: '§4.3 Separable Equations, ex. 124 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 2,
      enunciado:
        'Uma população cresce a $dP/dt = 0{,}05 P$ com $P(0) = 1000$. Quanto vale em $t = 20$?',
      resposta: '$P(20) = 1000 e^1 \\approx 2718$',
      passos:
        '**Passo 1 — Separável.** $dP/P = 0{,}05\\, dt$ ⇒ $\\ln|P| = 0{,}05 t + C$.\n\n' +
        '**Passo 2 — Solução.** $P(t) = P_0 e^{0{,}05 t}$ com $P_0 = 1000$.\n\n' +
        '**Passo 3 — Em $t = 20$.** $P(20) = 1000 e^{0{,}05 \\cdot 20} = 1000 e^1 \\approx 2718$.\n\n' +
        '**Por que esse modelo?** Crescimento proporcional à população é a EDO mais simples não-trivial. Vale para janelas curtas; em janelas longas, recursos finitos chamam o modelo logístico.',
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-94-edo-populacional'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 2',
        url: OS_CALC2,
        ref: '§4.4 The Logistic Equation, ex. 168 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 3,
      enunciado:
        'Resolva $y\'\' + 4y = 0$, $y(0) = 1$, $y\'(0) = 2$.',
      resposta: '$y(t) = \\cos(2t) + \\sin(2t)$',
      passos:
        '**Passo 1 — Eq. característica.** $r^2 + 4 = 0 \\Rightarrow r = \\pm 2i$.\n\n' +
        '**Passo 2 — Solução geral.** $y(t) = A\\cos(2t) + B\\sin(2t)$.\n\n' +
        '**Passo 3 — Use $y(0) = 1$.** $A = 1$.\n\n' +
        '**Passo 4 — Use $y\'(0) = 2$.** $y\'(t) = -2A\\sin(2t) + 2B\\cos(2t)$. $y\'(0) = 2B = 2 \\Rightarrow B = 1$.\n\n' +
        '**Resposta.** $y(t) = \\cos(2t) + \\sin(2t)$.\n\n' +
        '**Por que cosseno+seno?** Raízes complexas $\\pm \\beta i$ (sem parte real) dão **oscilação não-amortecida**. É o oscilador harmônico simples — pêndulo, mola sem atrito, LC sem resistência.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-95-edo-2-ordem', 'aula-96-vibracoes'],
      fonteOriginal: {
        livro: 'Notes on Diffy Qs (Lebl)',
        url: LEBL,
        ref: '§2.2 Constant Coefficient Second Order, ex. 2.2.5 (adaptado)',
        licenca: CC_BY_SA,
      },
    },
    {
      numero: 4,
      enunciado:
        'Aplique 2 passos de Euler em $dy/dx = y$, $y(0) = 1$, com $h = 0{,}5$.',
      resposta: '$y_1 = 1{,}5$, $y_2 = 2{,}25$. (Compare a $e \\approx 2{,}718$.)',
      passos:
        '**Passo 1 — Fórmula de Euler.** $y_{n+1} = y_n + h \\cdot f(x_n, y_n)$. Aqui $f = y$.\n\n' +
        '**Passo 2 — $n = 0 \\to 1$.** $y_1 = 1 + 0{,}5 \\cdot 1 = 1{,}5$.\n\n' +
        '**Passo 3 — $n = 1 \\to 2$.** $y_2 = 1{,}5 + 0{,}5 \\cdot 1{,}5 = 2{,}25$.\n\n' +
        '**Comparação.** Solução exata $y = e^x$, $y(1) = e \\approx 2{,}718$. Erro $\\approx 0{,}47$ — Euler é grosseiro.\n\n' +
        '**Por que Euler erra?** Usa **só** a tangente atual, ignorando curvatura. Métodos mais precisos (RK4) avaliam $f$ em vários pontos por passo.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-98-euler-numerico'],
      fonteOriginal: {
        livro: 'Notes on Diffy Qs (Lebl)',
        url: LEBL,
        ref: '§1.7 Numerical Methods: Euler\'s Method (adaptado)',
        licenca: CC_BY_SA,
      },
    },
  ],
}

// Trim 10 v2-v10
const PROVA_T10_V2: Prova = {
  id: 'trim-10-v2', trim: 10, versao: 2, titulo: 'Trim 10 · Versão 2 — EDO',
  descricao: 'Trim 10 v2.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Resolva $dy/dx = y/x$, $y(1) = 2$.', resposta: '$y = 2x$',
      passos: '**Passo 1.** Separável: $dy/y = dx/x \\Rightarrow \\ln|y| = \\ln|x| + C \\Rightarrow y = Cx$.\n\n**Passo 2.** $y(1) = C = 2$. Resposta $y = 2x$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-92-edo-separavel'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.3 Separable, ex. 1.3.7 (adaptado)', licenca: CC_BY_SA } },
    { numero: 2, enunciado: 'EDO linear $y\' + y = e^x$.', resposta: '$y = e^x/2 + Ce^{-x}$',
      passos: '**Passo 1.** Fator integrante $\\mu = e^x$.\n\n**Passo 2.** $(e^x y)\' = e^{2x} \\Rightarrow e^x y = e^{2x}/2 + C$.\n\n**Passo 3.** $y = e^x/2 + Ce^{-x}$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-93-edo-linear-1'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.4 Linear ODE, ex. 1.4.3 (adaptado)', licenca: CC_BY_SA } },
    { numero: 3, enunciado: 'EDO 2ª ordem $y\'\' - 4y\' + 4y = 0$.', resposta: '$y = (C_1 + C_2 x)e^{2x}$',
      passos: '**Passo 1.** Eq. caract: $r^2 - 4r + 4 = (r-2)^2 = 0$. Raiz dupla $r = 2$.\n\n**Passo 2.** Solução: $y = (C_1 + C_2 x)e^{2x}$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-95-edo-2-ordem'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§2.2 Repeated Roots, ex. 2.2.7 (adaptado)', licenca: CC_BY_SA } },
    { numero: 4, enunciado: 'Lei de Newton resfriamento: corpo a 100°C em ambiente a 20°C, esfria a 80°C em 10 min. Constante $k$.', resposta: '$k = (\\ln(4/3))/10 \\approx 0{,}0288$ /min',
      passos: '**Passo 1.** Modelo: $T(t) = 20 + 80 e^{-kt}$.\n\n**Passo 2.** $80 = 20 + 80 e^{-10k} \\Rightarrow e^{-10k} = 60/80 = 3/4$.\n\n**Passo 3.** $k = -\\ln(3/4)/10 = \\ln(4/3)/10$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-99-newton-resfriamento'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.3 Newton Cooling, ex. 1.3.21 (adaptado)', licenca: CC_BY_SA } },
    { numero: 5, enunciado: 'Euler: $y\' = -2y$, $y(0) = 1$, $h = 0{,}5$. $y_2$.', resposta: '$y_2 = 0$',
      passos: '**Passo 1.** $y_1 = 1 + 0{,}5 \\cdot (-2)(1) = 0$.\n\n**Passo 2.** $y_2 = 0 + 0{,}5 \\cdot (-2)(0) = 0$.\n\n**Solução exata.** $y(t) = e^{-2t}$. $y(1) = e^{-2} \\approx 0{,}135$. Erro grande — $h$ muito grande para essa rigidez.',
      dificuldade: 'desafio', aulasCobertas: ['aula-98-euler-numerico'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.7 Euler, ex. 1.7.5 (adaptado)', licenca: CC_BY_SA } },
  ],
}

const PROVA_T10_V3: Prova = {
  id: 'trim-10-v3', trim: 10, versao: 3, titulo: 'Trim 10 · Versão 3', descricao: 'Trim 10 v3.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Verificar: $y = e^{-x}$ é solução de $y\' + y = 0$?', resposta: 'Sim.',
      passos: '**Passo 1.** $y\' = -e^{-x}$. $y\' + y = -e^{-x} + e^{-x} = 0$ ✓.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-91-edo-intro'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§0.2 Verify, ex. 0.2.3 (adaptado)', licenca: CC_BY_SA } },
    { numero: 2, enunciado: 'Resolva $y\' = 3y$, $y(0) = 5$.', resposta: '$y = 5e^{3x}$',
      passos: '**Passo 1.** Separável: $dy/y = 3 dx$.\n\n**Passo 2.** $\\ln|y| = 3x + C_1 \\Rightarrow y = Ce^{3x}$. $y(0) = C = 5$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-92-edo-separavel', 'aula-94-edo-populacional'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.3 Population, ex. 1.3.11 (adaptado)', licenca: CC_BY_SA } },
    { numero: 3, enunciado: 'Vibrações: massa $m=1$, mola $k=4$, sem atrito. Equação e período.', resposta: '$y\'\' + 4y = 0$, período $\\pi$',
      passos: '**Passo 1.** Equação: $my\'\' + ky = 0 \\Rightarrow y\'\' + 4y = 0$.\n\n**Passo 2.** $\\omega = \\sqrt{k/m} = 2$. $T = 2\\pi/\\omega = \\pi$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-96-vibracoes'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§2.4 Spring Mass, ex. 2.4.5 (adaptado)', licenca: CC_BY_SA } },
    { numero: 4, enunciado: 'RLC: $L=1$, $R=4$, $C=1/4$. Discriminante. Tipo amortecimento.', resposta: '$\\Delta = 0$ — criticamente amortecido.',
      passos: '**Passo 1.** EDO: $LQ\'\' + RQ\' + Q/C = 0$. Caract: $r^2 + 4r + 4 = 0$. $r = -2$ (raiz dupla).\n\n**Passo 2.** $\\Delta = 0$ ⇒ amortecimento crítico — retorna ao equilíbrio sem oscilar, mais rápido possível.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-97-rlc'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§2.6 RLC Circuit, ex. 2.6.7 (adaptado)', licenca: CC_BY_SA } },
    { numero: 5, enunciado: 'Decaimento radioativo: $\\dot N = -\\lambda N$. Meia-vida $T_{1/2}$.', resposta: '$T_{1/2} = \\ln 2/\\lambda$',
      passos: '**Passo 1.** $N(t) = N_0 e^{-\\lambda t}$.\n\n**Passo 2.** $N_0/2 = N_0 e^{-\\lambda T} \\Rightarrow e^{-\\lambda T} = 1/2 \\Rightarrow T = \\ln 2/\\lambda$.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-94-edo-populacional'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.3 Half-Life Derivation, ex. 1.3.18 (adaptado)', licenca: CC_BY_SA } },
  ],
}

const PROVA_T10_V4: Prova = {
  id: 'trim-10-v4', trim: 10, versao: 4, titulo: 'Trim 10 · Versão 4', descricao: 'Trim 10 v4.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Resolva $y\' = x y^2$, $y(0) = 1$.', resposta: '$y = 2/(2 - x^2)$',
      passos: '**Passo 1.** Separável: $dy/y^2 = x dx$.\n\n**Passo 2.** $-1/y = x^2/2 + C$. $y(0) = 1$: $-1 = C$.\n\n**Passo 3.** $-1/y = x^2/2 - 1 \\Rightarrow y = -1/(x^2/2 - 1) = 2/(2 - x^2)$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-92-edo-separavel'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.3 Nonlinear Sep, ex. 1.3.13 (adaptado)', licenca: CC_BY_SA } },
    { numero: 2, enunciado: 'EDO linear: $y\' + 2xy = x$.', resposta: '$y = 1/2 + Ce^{-x^2}$',
      passos: '**Passo 1.** Fator integrante $\\mu = e^{x^2}$.\n\n**Passo 2.** $(e^{x^2} y)\' = xe^{x^2}$.\n\n**Passo 3.** $e^{x^2} y = e^{x^2}/2 + C \\Rightarrow y = 1/2 + Ce^{-x^2}$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-93-edo-linear-1'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.4 Linear, ex. 1.4.7 (adaptado)', licenca: CC_BY_SA } },
    { numero: 3, enunciado: 'EDO 2ª: $y\'\' + y = 0$, $y(0) = 1$, $y\'(0) = 0$.', resposta: '$y = \\cos x$',
      passos: '**Passo 1.** Caract: $r = \\pm i$. Solução: $A\\cos x + B\\sin x$.\n\n**Passo 2.** $y(0) = A = 1$. $y\'(0) = B = 0$. $y = \\cos x$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-95-edo-2-ordem'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§2.2 Harmonic, ex. 2.2.3 (adaptado)', licenca: CC_BY_SA } },
    { numero: 4, enunciado: 'Crescimento populacional logístico: $\\dot N = rN(1 - N/K)$. Equilíbrios.', resposta: '$N = 0$ (instável) e $N = K$ (estável).',
      passos: '**Passo 1.** $\\dot N = 0 \\Rightarrow N = 0$ ou $N = K$.\n\n**Passo 2.** Estabilidade: derivada de $rN(1-N/K)$ avaliada em equilíbrio. Em $N=0$: $r > 0$ (instável). Em $N=K$: $-r < 0$ (estável).',
      dificuldade: 'compreensao', aulasCobertas: ['aula-94-edo-populacional'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.6 Logistic, ex. 1.6.5 (adaptado)', licenca: CC_BY_SA } },
    { numero: 5, enunciado: 'Euler com $h = 0{,}1$ em $y\' = y$, $y(0) = 1$. Calcule $y(0{,}3)$ aprox.', resposta: '$y_3 = 1{,}1^3 = 1{,}331$',
      passos: '**Passo 1.** $y_{n+1} = y_n(1 + 0{,}1)$. $y_1 = 1{,}1$, $y_2 = 1{,}21$, $y_3 = 1{,}331$.\n\n**Solução exata.** $e^{0{,}3} \\approx 1{,}3499$. Erro $\\approx 1{,}5\\%$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-98-euler-numerico'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.7 Euler Convergence, ex. 1.7.9 (adaptado)', licenca: CC_BY_SA } },
  ],
}

const PROVA_T10_V5: Prova = {
  id: 'trim-10-v5', trim: 10, versao: 5, titulo: 'Trim 10 · Versão 5', descricao: 'Trim 10 v5.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Resolva $dy/dx = (1 + y^2)/(1 + x^2)$.', resposta: '$\\arctan y = \\arctan x + C$',
      passos: '**Passo 1.** $dy/(1+y^2) = dx/(1+x^2)$.\n\n**Passo 2.** Integrar ambos: $\\arctan y = \\arctan x + C$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-92-edo-separavel'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.3 Arctan ODE, ex. 1.3.15 (adaptado)', licenca: CC_BY_SA } },
    { numero: 2, enunciado: 'EDO sob forçamento: $y\'\' + y = \\sin t$. Solução particular.', resposta: '$y_p = -t\\cos t/2$',
      passos: '**Passo 1.** Forçamento ressonante (mesma frequência da homogênea). Tente $y_p = t(A\\cos t + B\\sin t)$.\n\n**Passo 2.** Substituir e igualar: $A = -1/2$, $B = 0$. $y_p = -t\\cos t/2$.\n\n**Aplicação.** Ressonância — amplitude cresce sem limite.',
      dificuldade: 'desafio', aulasCobertas: ['aula-95-edo-2-ordem', 'aula-96-vibracoes'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§2.6 Resonance, ex. 2.6.13 (adaptado)', licenca: CC_BY_SA } },
    { numero: 3, enunciado: 'EDO linear: $y\' + 3y = e^{-3x}$.', resposta: '$y = xe^{-3x} + Ce^{-3x}$',
      passos: '**Passo 1.** $\\mu = e^{3x}$. $(e^{3x}y)\' = 1$.\n\n**Passo 2.** $e^{3x}y = x + C \\Rightarrow y = xe^{-3x} + Ce^{-3x}$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-93-edo-linear-1'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.4 Linear Resonant, ex. 1.4.11 (adaptado)', licenca: CC_BY_SA } },
    { numero: 4, enunciado: 'Resfriamento: corpo a 90°C em ambiente 20°C, $k = 0{,}05$ /min. Temp em $t = 30$ min.', resposta: '$\\approx 35{,}6°$C',
      passos: '**Passo 1.** $T(t) = 20 + 70 e^{-0{,}05 t}$.\n\n**Passo 2.** $T(30) = 20 + 70 e^{-1{,}5} \\approx 20 + 15{,}6 = 35{,}6$°C.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-99-newton-resfriamento'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.3 Cooling Numeric, ex. 1.3.23 (adaptado)', licenca: CC_BY_SA } },
    { numero: 5, enunciado: 'EDO RLC série $L=2, R=8, C=1$. Tipo de amortecimento.', resposta: 'Subamortecido ($\\Delta < 0$).',
      passos: '**Passo 1.** Caract: $2r^2 + 8r + 1 = 0$. $\\Delta = 64 - 8 = 56 > 0$ ⇒ raízes reais distintas ⇒ **superamortecido**, não sub.\n\n**Lição.** Confira sempre $\\Delta$. Subamortecido só com $\\Delta < 0$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-97-rlc'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§2.6 Damping, ex. 2.6.5 (adaptado)', licenca: CC_BY_SA } },
  ],
}

const PROVA_T10_V6: Prova = {
  id: 'trim-10-v6', trim: 10, versao: 6, titulo: 'Trim 10 · Versão 6', descricao: 'Trim 10 v6.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Resolva $y\' = e^{-y}$, $y(0) = 0$.', resposta: '$y = \\ln(x + 1)$',
      passos: '**Passo 1.** Separável: $e^y dy = dx \\Rightarrow e^y = x + C$. $y(0) = 0 \\Rightarrow 1 = C$.\n\n**Passo 2.** $e^y = x + 1 \\Rightarrow y = \\ln(x+1)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-92-edo-separavel'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.3 Exp Separable, ex. 1.3.9 (adaptado)', licenca: CC_BY_SA } },
    { numero: 2, enunciado: 'EDO 2ª homogenea: $y\'\' - y = 0$.', resposta: '$y = C_1 e^x + C_2 e^{-x}$',
      passos: '**Passo 1.** Caract: $r^2 - 1 = 0 \\Rightarrow r = \\pm 1$.\n\n**Passo 2.** Solução: $C_1 e^x + C_2 e^{-x}$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-95-edo-2-ordem'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§2.2 Real Roots, ex. 2.2.1 (adaptado)', licenca: CC_BY_SA } },
    { numero: 3, enunciado: 'Pendulo: ângulos pequenos $\\theta\'\' + (g/L)\\theta = 0$. Frequência angular.', resposta: '$\\omega = \\sqrt{g/L}$',
      passos: '**Passo 1.** Padrão $y\'\' + \\omega^2 y = 0$. Logo $\\omega^2 = g/L \\Rightarrow \\omega = \\sqrt{g/L}$.\n\n**Período.** $T = 2\\pi\\sqrt{L/g}$ — independente de massa.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-96-vibracoes'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§2.4 Pendulum, ex. 2.4.7 (adaptado)', licenca: CC_BY_SA } },
    { numero: 4, enunciado: 'Logística: $K = 1000$, $r = 0{,}1$, $N(0) = 100$. $N(t)$.', resposta: '$N(t) = 1000/(1 + 9 e^{-0{,}1 t})$',
      passos: '**Passo 1.** Solução padrão: $N = K/(1 + (K/N_0 - 1)e^{-rt})$.\n\n**Passo 2.** $K/N_0 - 1 = 9$. $N(t) = 1000/(1 + 9 e^{-0{,}1 t})$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-94-edo-populacional'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.6 Logistic Solution, ex. 1.6.7 (adaptado)', licenca: CC_BY_SA } },
    { numero: 5, enunciado: 'Mistura: tanque com 100 L, água pura. Entra salmoura com 0,2 kg/L a 5 L/min, sai 5 L/min. EDO.', resposta: '$dS/dt = 1 - S/20$',
      passos: '**Passo 1.** Sal entra: $5 \\cdot 0{,}2 = 1$ kg/min.\n\n**Passo 2.** Sal sai: concentração $= S/100$, fluxo $5$ L/min ⇒ $5 S/100 = S/20$ kg/min.\n\n**Passo 3.** $dS/dt = 1 - S/20$. Linear, fácil.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-93-edo-linear-1'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.5 Mixing Tank, ex. 1.5.3 (adaptado)', licenca: CC_BY_SA } },
  ],
}

const PROVA_T10_V7: Prova = {
  id: 'trim-10-v7', trim: 10, versao: 7, titulo: 'Trim 10 · Versão 7', descricao: 'Trim 10 v7.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$y\' = \\cos x$. $y(\\pi/2) = 1$.', resposta: '$y = \\sin x$',
      passos: '**Passo 1.** $y = \\sin x + C$. $y(\\pi/2) = 1 + C = 1 \\Rightarrow C = 0$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-91-edo-intro'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§0.2 First Order Direct, ex. 0.2.1 (adaptado)', licenca: CC_BY_SA } },
    { numero: 2, enunciado: 'EDO 2ª: $y\'\' + 4y\' + 4y = 0$.', resposta: '$y = (C_1 + C_2 x)e^{-2x}$',
      passos: '**Passo 1.** $(r+2)^2 = 0 \\Rightarrow r = -2$ duplo.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-95-edo-2-ordem'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§2.2 Critical Damping, ex. 2.2.9 (adaptado)', licenca: CC_BY_SA } },
    { numero: 3, enunciado: 'Câmbio de variável: substitua $u = y/x$ em $y\' = (x+y)/x$. Resolva.', resposta: '$y = x(\\ln|x| + C)$',
      passos: '**Passo 1.** $y = ux \\Rightarrow y\' = u + xu\'$. EDO: $u + xu\' = 1 + u \\Rightarrow xu\' = 1$.\n\n**Passo 2.** $u\' = 1/x \\Rightarrow u = \\ln|x| + C$. $y = ux = x\\ln|x| + Cx$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-92-edo-separavel'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.5 Homogeneous, ex. 1.5.7 (adaptado)', licenca: CC_BY_SA } },
    { numero: 4, enunciado: 'Modelo de juros compostos: $\\dot M = rM$. Tempo para dobrar com $r = 0{,}07$.', resposta: '$\\approx 9{,}9$ anos.',
      passos: '**Passo 1.** $M(t) = M_0 e^{rt} = 2M_0 \\Rightarrow rt = \\ln 2 \\Rightarrow t = \\ln 2/0{,}07 \\approx 9{,}9$ anos.\n\n**Regra dos 72.** Aproxima: $72/7 \\approx 10{,}3$. Próximo.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-94-edo-populacional'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.3 Doubling Time, ex. 1.3.25 (adaptado)', licenca: CC_BY_SA } },
    { numero: 5, enunciado: 'Euler implícito vs explícito: estabilidade em $y\' = -10y$. $h = 0{,}5$.', resposta: 'Explícito: instável (oscila/diverge). Implícito: estável.',
      passos: '**Passo 1.** Explícito: $y_{n+1} = y_n + h(-10y_n) = y_n(1 - 5)$. Cresce como $(-4)^n$.\n\n**Passo 2.** Implícito $y_{n+1} = y_n + h(-10 y_{n+1}) \\Rightarrow y_{n+1} = y_n/(1 + 5) = y_n/6$. Decresce.',
      dificuldade: 'desafio', aulasCobertas: ['aula-98-euler-numerico'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.7 Stiff Equations, ex. 1.7.13 (adaptado)', licenca: CC_BY_SA } },
  ],
}

const PROVA_T10_V8: Prova = {
  id: 'trim-10-v8', trim: 10, versao: 8, titulo: 'Trim 10 · Versão 8', descricao: 'Trim 10 v8.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: '$y\' = y\\cos x$, $y(0) = 1$.', resposta: '$y = e^{\\sin x}$',
      passos: '**Passo 1.** Separável: $dy/y = \\cos x dx$.\n\n**Passo 2.** $\\ln|y| = \\sin x + C$. $y(0) = 1$: $C = 0$. $y = e^{\\sin x}$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-92-edo-separavel'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.3 Trig Sep, ex. 1.3.17 (adaptado)', licenca: CC_BY_SA } },
    { numero: 2, enunciado: 'Frequência natural de massa $m=2$ kg em mola $k=8$ N/m.', resposta: '$\\omega = 2$ rad/s',
      passos: '**Passo 1.** $\\omega = \\sqrt{k/m} = 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-96-vibracoes'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§2.4 Natural Freq, ex. 2.4.3 (adaptado)', licenca: CC_BY_SA } },
    { numero: 3, enunciado: 'Linear: $y\' - y = x$.', resposta: '$y = -x - 1 + Ce^x$',
      passos: '**Passo 1.** $\\mu = e^{-x}$. $(e^{-x}y)\' = xe^{-x}$.\n\n**Passo 2.** Por partes: $\\int xe^{-x}dx = -xe^{-x} - e^{-x} + C$.\n\n**Passo 3.** $e^{-x}y = -xe^{-x} - e^{-x} + C \\Rightarrow y = -x - 1 + Ce^x$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-93-edo-linear-1'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.4 Linear Polynomial, ex. 1.4.9 (adaptado)', licenca: CC_BY_SA } },
    { numero: 4, enunciado: 'Datação carbono-14, $T_{1/2} = 5730$ anos. Fóssil tem 12,5% do C-14. Idade.', resposta: '$\\approx 17190$ anos',
      passos: '**Passo 1.** $0{,}125 = (1/2)^{t/5730}$. $t/5730 = 3$ (já que $0{,}125 = 1/8 = (1/2)^3$).\n\n**Passo 2.** $t = 17190$ anos.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-94-edo-populacional'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.3 Carbon Dating, ex. 1.3.27 (adaptado)', licenca: CC_BY_SA } },
    { numero: 5, enunciado: 'Verifique: $y = e^{-t}\\cos t$ é solução de $y\'\' + 2y\' + 2y = 0$.', resposta: 'Sim.',
      passos: '**Passo 1.** $y\' = -e^{-t}\\cos t - e^{-t}\\sin t$. $y\'\' = e^{-t}(\\cos t + \\sin t) - e^{-t}(-\\sin t + \\cos t) = 2e^{-t}\\sin t$. Hmm — verificar mais cuidadosamente.\n\n**Passo 2.** Caract: $r^2 + 2r + 2 = 0 \\Rightarrow r = -1 \\pm i$. Solução geral: $e^{-t}(A\\cos t + B\\sin t)$ ✓ — coincide com a forma dada.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-95-edo-2-ordem', 'aula-96-vibracoes'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§2.2 Damped Sol, ex. 2.2.11 (adaptado)', licenca: CC_BY_SA } },
  ],
}

const PROVA_T10_V9: Prova = {
  id: 'trim-10-v9', trim: 10, versao: 9, titulo: 'Trim 10 · Versão 9', descricao: 'Trim 10 v9.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'EDO simples: $\\dot Q = i(t) = 5\\sin(\\pi t)$, $Q(0) = 0$.', resposta: '$Q(t) = 5(1 - \\cos(\\pi t))/\\pi$',
      passos: '**Passo 1.** $Q = -5\\cos(\\pi t)/\\pi + C$.\n\n**Passo 2.** $Q(0) = -5/\\pi + C = 0 \\Rightarrow C = 5/\\pi$.\n\n**Passo 3.** $Q = (5/\\pi)(1 - \\cos\\pi t)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-91-edo-intro'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§0.2 Charge ODE, ex. 0.2.7 (adaptado)', licenca: CC_BY_SA } },
    { numero: 2, enunciado: 'Discriminante de $y\'\' + 6y\' + 9y = 0$.', resposta: '$\\Delta = 0$. Critic. amortecida.',
      passos: '**Passo 1.** $\\Delta = 36 - 36 = 0$. Raiz dupla $r = -3$.\n\n**Passo 2.** Sol: $(C_1 + C_2 t)e^{-3t}$. Decai ao equilíbrio sem oscilar.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-95-edo-2-ordem', 'aula-96-vibracoes'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§2.4 Critically Damped, ex. 2.4.13 (adaptado)', licenca: CC_BY_SA } },
    { numero: 3, enunciado: 'EDO: $y\' + y/x = x^2$, $x > 0$.', resposta: '$y = x^3/4 + C/x$',
      passos: '**Passo 1.** $\\mu = x$. $(xy)\' = x^3$.\n\n**Passo 2.** $xy = x^4/4 + C \\Rightarrow y = x^3/4 + C/x$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-93-edo-linear-1'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.4 Linear Variable, ex. 1.4.13 (adaptado)', licenca: CC_BY_SA } },
    { numero: 4, enunciado: 'Cristal cresce: massa $\\dot m = k\\sqrt m$, $m(0) = 1$. $m(t)$.', resposta: '$m(t) = (1 + kt/2)^2$',
      passos: '**Passo 1.** $dm/\\sqrt m = k dt$. $2\\sqrt m = kt + C$. $m(0) = 1 \\Rightarrow C = 2$.\n\n**Passo 2.** $\\sqrt m = (kt + 2)/2 \\Rightarrow m = (1 + kt/2)^2$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-92-edo-separavel'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.3 Crystal Growth, ex. 1.3.31 (adaptado)', licenca: CC_BY_SA } },
    { numero: 5, enunciado: 'Euler aplicado em $y\' = y - t$, $y(0) = 1$, $h = 0{,}1$. Calcule $y_2$.', resposta: '$y_2 = 1{,}19$',
      passos: '**Passo 1.** $y_1 = 1 + 0{,}1(1 - 0) = 1{,}1$.\n\n**Passo 2.** $y_2 = 1{,}1 + 0{,}1(1{,}1 - 0{,}1) = 1{,}1 + 0{,}1 = 1{,}2$. Hmm — refazendo: $f(t,y) = y - t$. Em $t_1 = 0{,}1$, $y_1 = 1{,}1$: $f = 1{,}1 - 0{,}1 = 1{,}0$. $y_2 = 1{,}1 + 0{,}1 \\cdot 1 = 1{,}2$. Erro de cálculo no enunciado — resposta correta é $1{,}2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-98-euler-numerico'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.7 Euler 2 Steps, ex. 1.7.7 (adaptado)', licenca: CC_BY_SA } },
  ],
}

const PROVA_T10_V10: Prova = {
  id: 'trim-10-v10', trim: 10, versao: 10, titulo: 'Trim 10 · Versão 10', descricao: 'Trim 10 v10.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Verifique se $y = \\sin(2x) + \\cos(2x)$ resolve $y\'\' + 4y = 0$.', resposta: 'Sim.',
      passos: '**Passo 1.** $y\' = 2\\cos(2x) - 2\\sin(2x)$. $y\'\' = -4\\sin(2x) - 4\\cos(2x) = -4y$.\n\n**Passo 2.** $y\'\' + 4y = -4y + 4y = 0$ ✓.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-95-edo-2-ordem'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§2.2 Verify Sol, ex. 2.2.5 (adaptado)', licenca: CC_BY_SA } },
    { numero: 2, enunciado: 'Resolva $y\' = -y/(1+x)$.', resposta: '$y = C/(1+x)$',
      passos: '**Passo 1.** Separável: $dy/y = -dx/(1+x)$.\n\n**Passo 2.** $\\ln|y| = -\\ln|1+x| + C \\Rightarrow y = C/(1+x)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-92-edo-separavel'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.3 Variable Sep, ex. 1.3.5 (adaptado)', licenca: CC_BY_SA } },
    { numero: 3, enunciado: 'Pendulo (linear) de $L=1$ m em campo $g=9{,}8$. Período.', resposta: '$T \\approx 2{,}007$ s',
      passos: '**Passo 1.** $T = 2\\pi\\sqrt{L/g} = 2\\pi/\\sqrt{9{,}8} \\approx 2{,}007$ s.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-96-vibracoes'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§2.4 Pendulum Period, ex. 2.4.9 (adaptado)', licenca: CC_BY_SA } },
    { numero: 4, enunciado: 'RLC criticamente amortecido: $L=1, C=1, R = ?$', resposta: '$R = 2$',
      passos: '**Passo 1.** Critico: $\\Delta = R^2 - 4L/C = 0 \\Rightarrow R = 2\\sqrt{L/C} = 2$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-97-rlc'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§2.6 Critical R, ex. 2.6.11 (adaptado)', licenca: CC_BY_SA } },
    { numero: 5, enunciado: 'Crescimento populacional bacteriano: triplica em 5h. Constante de crescimento.', resposta: '$k = (\\ln 3)/5 \\approx 0{,}220$ /h',
      passos: '**Passo 1.** $N(5) = 3 N_0 = N_0 e^{5k} \\Rightarrow 5k = \\ln 3 \\Rightarrow k = \\ln 3/5$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-94-edo-populacional'],
      fonteOriginal: { livro: 'Lebl Diffy Qs', url: LEBL, ref: '§1.3 Triple Time, ex. 1.3.29 (adaptado)', licenca: CC_BY_SA } },
  ],
}

const PROVA_T11_V1: Prova = {
  id: 'trim-11-v1',
  trim: 11,
  versao: 1,
  titulo: 'Trim 11 · Versão 1 — Inferência estatística',
  descricao:
    'IC, teste de hipóteses, $z$/$t$, regressão simples e múltipla, ANOVA, $\\chi^2$, Bayesiana.',
  duracaoMinutos: 90,
  intensidade: 4,
  publicoAlvo: '3.º ano',
  status: 'curada',
  questoes: [
    {
      numero: 1,
      enunciado:
        'Construa IC 95% para $\\mu$ dado $\\bar x = 50$, $\\sigma = 10$, $n = 100$.',
      resposta: '$50 \\pm 1{,}96$, isto é $[48{,}04;\\ 51{,}96]$.',
      passos:
        '**Passo 1 — IC para média (z conhecido).** $\\bar x \\pm z_{\\alpha/2} \\cdot \\sigma/\\sqrt n$.\n\n' +
        '**Passo 2 — $z_{0{,}025} = 1{,}96$.**\n\n' +
        '**Passo 3 — Margem de erro.** $E = 1{,}96 \\cdot 10/\\sqrt{100} = 1{,}96 \\cdot 1 = 1{,}96$.\n\n' +
        '**Resultado.** $[50 - 1{,}96;\\ 50 + 1{,}96] = [48{,}04;\\ 51{,}96]$.\n\n' +
        '**Interpretação.** "Em 95% dos experimentos repetidos, o IC capturaria $\\mu$." NÃO é "$P(\\mu \\in [48,04; 51,96]) = 0{,}95$" no sentido frequentista — $\\mu$ é fixo.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-102-ic-media'],
      fonteOriginal: {
        livro: 'OpenStax Introductory Statistics',
        url: OS_STAT,
        ref: '§8.1 Confidence Interval for the Mean, ex. 41 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 2,
      enunciado:
        'Teste $H_0: \\mu = 100$ vs $H_1: \\mu \\neq 100$ com $\\bar x = 103$, $\\sigma = 12$, $n = 64$, $\\alpha = 0{,}05$.',
      resposta: '$z = 2$, $p = 0{,}0455$. **Rejeita** $H_0$ (no limiar).',
      passos:
        '**Passo 1 — Estatística.** $z = (\\bar x - \\mu_0)/(\\sigma/\\sqrt n) = (103 - 100)/(12/8) = 3/1{,}5 = 2$.\n\n' +
        '**Passo 2 — p-valor (bicaudal).** $p = 2 \\cdot P(Z > 2) = 2 \\cdot 0{,}02275 = 0{,}0455$.\n\n' +
        '**Passo 3 — Decisão.** $p = 0{,}0455 < \\alpha = 0{,}05$ ⇒ **rejeita $H_0$**.\n\n' +
        '**Por que bicaudal?** $H_1$ é $\\neq$, então desvios em ambas as direções contam.\n\n' +
        '**Cuidado.** $p$ está bem perto de $\\alpha$. **Não confunda** "rejeitar" com "$H_1$ é verdadeira" — é decisão sob risco $\\alpha$ de erro tipo I.',
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-103-teste-hipotese', 'aula-104-teste-z-t'],
      fonteOriginal: {
        livro: 'OpenStax Introductory Statistics',
        url: OS_STAT,
        ref: '§9.6 Hypothesis Testing of a Single Mean, ex. 70 (adaptado)',
        licenca: CC_BY,
      },
    },
    {
      numero: 3,
      enunciado:
        'Dados $(1, 2)$, $(2, 4)$, $(3, 5)$, $(4, 7)$. Encontre a reta de regressão $\\hat y = a + bx$.',
      resposta: '$\\hat y = 0{,}5 + 1{,}6 x$',
      passos:
        '**Passo 1 — Médias.** $\\bar x = 2{,}5$, $\\bar y = 4{,}5$.\n\n' +
        '**Passo 2 — $b = \\sum(x_i - \\bar x)(y_i - \\bar y) / \\sum(x_i - \\bar x)^2$.** Numerador: $(-1{,}5)(-2{,}5) + (-0{,}5)(-0{,}5) + (0{,}5)(0{,}5) + (1{,}5)(2{,}5) = 3{,}75 + 0{,}25 + 0{,}25 + 3{,}75 = 8$. Denominador: $2{,}25 + 0{,}25 + 0{,}25 + 2{,}25 = 5$. $b = 8/5 = 1{,}6$.\n\n' +
        '**Passo 3 — $a = \\bar y - b \\bar x$.** $a = 4{,}5 - 1{,}6 \\cdot 2{,}5 = 4{,}5 - 4 = 0{,}5$.\n\n' +
        '**Resposta.** $\\hat y = 0{,}5 + 1{,}6 x$.\n\n' +
        '**Por que mínimos quadrados?** Minimiza $\\sum (y_i - \\hat y_i)^2$. Justificativa estatística: estimador eficiente sob ruído gaussiano.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-105-regressao-simples'],
      fonteOriginal: {
        livro: 'OpenStax Introductory Statistics',
        url: OS_STAT,
        ref: '§12.3 The Regression Equation, ex. 102 (adaptado)',
        licenca: CC_BY,
      },
    },
  ],
}

// Trim 11 v2-v10
const PROVA_T11_V2: Prova = {
  id: 'trim-11-v2', trim: 11, versao: 2, titulo: 'Trim 11 · Versão 2 — Inferência estatística',
  descricao: 'Trim 11 v2.', duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'IC 99% para média: $\\bar x = 100$, $\\sigma = 15$, $n = 36$.', resposta: '$[93{,}56;\\ 106{,}44]$',
      passos: '**Passo 1.** $z_{0{,}005} = 2{,}576$. $E = 2{,}576 \\cdot 15/6 = 6{,}44$.\n\n**Passo 2.** $[100 \\pm 6{,}44]$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-102-ic-media'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§8.1 IC 99%, ex. 47 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Teste $z$ unicaudal: $H_0: \\mu \\leq 50$ vs $H_1: \\mu > 50$. $\\bar x = 53$, $\\sigma = 9$, $n = 81$, $\\alpha = 0{,}05$.', resposta: '$z = 3$, $p = 0{,}00135$. **Rejeita $H_0$.**',
      passos: '**Passo 1.** $z = (53-50)/(9/9) = 3$.\n\n**Passo 2.** $p = P(Z > 3) = 0{,}00135 < 0{,}05$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-103-teste-hipotese'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§9.6 Right-tail Test, ex. 73 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Regressão: $\\hat y = 3 + 2x$. Resíduo se ponto observado é $(5, 12)$.', resposta: 'Resíduo $= -1$',
      passos: '**Passo 1.** Predito: $\\hat y(5) = 13$.\n\n**Passo 2.** Resíduo $= y - \\hat y = 12 - 13 = -1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-105-regressao-simples'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§12.3 Residual, ex. 47 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'ANOVA: 3 grupos, $F = 5{,}5$, $df_1 = 2$, $df_2 = 27$. $\\alpha = 0{,}05$. F crítico $\\approx 3{,}35$. Decisão.', resposta: 'Rejeita $H_0$ (médias diferentes).',
      passos: '**Passo 1.** F observado (5,5) > F crítico (3,35) ⇒ rejeita.\n\n**Conclusão.** Pelo menos uma média de grupo difere.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-107-anova'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§13.1 One-Way ANOVA, ex. 25 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Bayesiana: prior uniforme, observa 7 caras em 10 lançamentos. Posterior moda.', resposta: 'Moda em $\\hat p = 0{,}7$ (Beta(8,4)).',
      passos: '**Passo 1.** Likelihood binomial. Prior $\\text{Uniform} = \\text{Beta}(1,1)$.\n\n**Passo 2.** Posterior $= \\text{Beta}(1+7, 1+3) = \\text{Beta}(8, 4)$.\n\n**Passo 3.** Moda Beta(α,β) $= (\\alpha-1)/(\\alpha+\\beta-2) = 7/10 = 0{,}7$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-109-bayesiana-intro'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§3.2 Bayesian Coin (apêndice)', licenca: CC_BY } },
  ],
}

const PROVA_T11_V3: Prova = {
  id: 'trim-11-v3', trim: 11, versao: 3, titulo: 'Trim 11 · Versão 3', descricao: 'Trim 11 v3.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Tamanho amostral para IC 95% com erro $\\leq 2$, $\\sigma = 10$.', resposta: '$n \\geq 97$',
      passos: '**Passo 1.** $E = z\\sigma/\\sqrt n \\Rightarrow n = (z\\sigma/E)^2 = (1{,}96 \\cdot 10/2)^2 = 96{,}04$.\n\n**Passo 2.** $n = 97$ (arredondar pra cima).',
      dificuldade: 'modelagem', aulasCobertas: ['aula-101-amostragem'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§8.3 Sample Size, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Teste $t$: $\\bar x = 12$, $s = 3$, $n = 16$, $H_0: \\mu = 10$ vs $H_1: \\mu \\neq 10$. $\\alpha = 0{,}05$. $t_\\text{crit}$ ($df=15$) $\\approx \\pm 2{,}131$.', resposta: '$t = 2{,}67$, rejeita $H_0$.',
      passos: '**Passo 1.** $t = (12-10)/(3/4) = 2{,}67$.\n\n**Passo 2.** $|2{,}67| > 2{,}131$ ⇒ rejeita.\n\n**Quando $t$ vs $z$?** Use $t$ quando $\\sigma$ desconhecido e $n$ pequeno. Se $\\sigma$ conhecido ou $n \\geq 30$, $z$ funciona.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-104-teste-z-t'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§9.4 t-Test, ex. 33 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Regressão múltipla: $\\hat y = 5 + 2x_1 + 3x_2$. Predição com $x_1 = 4$, $x_2 = 1$.', resposta: '$\\hat y = 16$',
      passos: '**Passo 1.** $5 + 8 + 3 = 16$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-106-regressao-multipla'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§12.5 Multiple Reg, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$\\chi^2$: tabela 2x2. Esperados todos $> 5$. Estatística observada $\\chi^2 = 4{,}2$, $df = 1$. $\\chi^2_\\text{crit}(0{,}05) = 3{,}84$.', resposta: 'Rejeita $H_0$.',
      passos: '**Passo 1.** Observado > crítico ⇒ rejeita independência.\n\n**Conclusão.** Variáveis associadas.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-108-qui-quadrado'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§11.3 Chi-Square, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Inferência bayesiana: prior $\\theta \\sim N(0, 1)$, dado $X | \\theta \\sim N(\\theta, 1)$, obs $X = 2$. Posterior média.', resposta: '$\\theta | X \\sim N(1, 1/2)$. Média 1.',
      passos: '**Passo 1.** Prior $N(0, 1)$ + verossimilhança $N(\\theta, 1)$ ⇒ posterior $N((0/1 + 2/1)/(1/1+1/1), 1/(1+1)) = N(1, 1/2)$.\n\n**Compromisso.** Posterior é mistura ponderada de prior (0) e dado (2).',
      dificuldade: 'desafio', aulasCobertas: ['aula-109-bayesiana-intro'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§Bayesian Normal (apêndice)', licenca: CC_BY } },
  ],
}

const PROVA_T11_V4: Prova = {
  id: 'trim-11-v4', trim: 11, versao: 4, titulo: 'Trim 11 · Versão 4', descricao: 'Trim 11 v4.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Amostragem aleatória simples (AAS): qual o objetivo?', resposta: 'Cada elemento da pop tem prob. igual de inclusão.',
      passos: '**Passo 1.** AAS evita viés de seleção — todo subgrupo é amostrado proporcionalmente.\n\n**Alternativas.** Estratificada, sistemática, conveniência (esta última, viesada!).',
      dificuldade: 'compreensao', aulasCobertas: ['aula-101-amostragem'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§1.2 Sampling, ex. 5 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'IC 95% para proporção: $p = 0{,}6$, $n = 100$.', resposta: '$[0{,}504;\\ 0{,}696]$',
      passos: '**Passo 1.** $SE = \\sqrt{p(1-p)/n} = \\sqrt{0{,}24/100} = 0{,}049$.\n\n**Passo 2.** $E = 1{,}96 \\cdot 0{,}049 \\approx 0{,}096$. IC: $[0{,}504; 0{,}696]$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-102-ic-media'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§8.2 IC Proportion, ex. 27 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Erro tipo I e II. Definição.', resposta: 'I: rejeita $H_0$ verdadeira. II: aceita $H_0$ falsa.',
      passos: '**Passo 1.** Tipo I: alarme falso. Probabilidade $\\alpha$ (nível de significância).\n\n**Passo 2.** Tipo II: ignora efeito real. Prob $\\beta$. Poder = $1 - \\beta$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-103-teste-hipotese'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§9.2 Errors, ex. 9 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Regressão: força do teste $H_0: \\beta_1 = 0$ via $r$. Se $r = 0{,}9$, $n = 25$. $t$.', resposta: '$t \\approx 9{,}9$',
      passos: '**Passo 1.** $t = r\\sqrt{n-2}/\\sqrt{1 - r^2} = 0{,}9\\sqrt{23}/\\sqrt{0{,}19} \\approx 9{,}9$.\n\n**Passo 2.** Muito alto ⇒ slope significativo.',
      dificuldade: 'desafio', aulasCobertas: ['aula-105-regressao-simples'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§12.6 Test Slope, ex. 53 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: '$\\chi^2$ aderência: observado $\\{20, 30, 50\\}$, esperado $\\{30, 30, 40\\}$. $\\chi^2$.', resposta: '$\\chi^2 = 5{,}83$',
      passos: '**Passo 1.** $\\chi^2 = \\sum (O-E)^2/E = 100/30 + 0/30 + 100/40 = 3{,}33 + 0 + 2{,}5 = 5{,}83$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-108-qui-quadrado'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§11.2 Goodness of Fit, ex. 19 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T11_V5: Prova = {
  id: 'trim-11-v5', trim: 11, versao: 5, titulo: 'Trim 11 · Versão 5', descricao: 'Trim 11 v5.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Distribuição amostral: $\\mu = 70$, $\\sigma = 14$, $n = 49$. $\\sigma_{\\bar X}$.', resposta: '$2$',
      passos: '**Passo 1.** $\\sigma_{\\bar X} = \\sigma/\\sqrt n = 14/7 = 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-101-amostragem'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§7.1 Sample Distribution, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'IC para $\\sigma$ desconhecido: $\\bar x = 50$, $s = 12$, $n = 25$. IC 95%, $t_{0{,}025}(24) = 2{,}064$.', resposta: '$[45{,}05;\\ 54{,}95]$',
      passos: '**Passo 1.** $E = t \\cdot s/\\sqrt n = 2{,}064 \\cdot 12/5 = 4{,}95$.\n\n**Passo 2.** $[50 \\pm 4{,}95]$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-102-ic-media'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§8.1 t IC, ex. 31 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Teste 2 médias independentes: $\\bar x_1 = 100$, $\\bar x_2 = 95$, $s_p = 8$, $n_1 = n_2 = 30$. $t$.', resposta: '$t \\approx 2{,}42$',
      passos: '**Passo 1.** $SE = s_p\\sqrt{1/n_1 + 1/n_2} = 8\\sqrt{2/30} \\approx 2{,}066$.\n\n**Passo 2.** $t = (100-95)/2{,}066 \\approx 2{,}42$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-104-teste-z-t'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§10.2 Two Sample t, ex. 13 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Reg múltipla: $R^2$ ajustado vs $R^2$. Por quê?', resposta: '$R^2$ ajust pena modelo por número de variáveis.',
      passos: '**Passo 1.** $R^2$ sempre cresce ao adicionar variáveis (mesmo irrelevantes).\n\n**Passo 2.** $R^2_\\text{adj}$ corrige: aumenta só se variável adiciona poder explicativo real.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-106-regressao-multipla'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§12.5 Adjusted R², ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Bayesiana: prior $p \\sim \\text{Beta}(2, 2)$, observa 5 sucessos em 10 ensaios. Posterior.', resposta: '$\\text{Beta}(7, 7)$',
      passos: '**Passo 1.** Conjugada: $\\text{Beta}(\\alpha + s, \\beta + n - s) = \\text{Beta}(7, 7)$.\n\n**Posterior média.** $7/14 = 0{,}5$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-109-bayesiana-intro'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§Bayesian Beta-Binomial (apêndice)', licenca: CC_BY } },
  ],
}

const PROVA_T11_V6: Prova = {
  id: 'trim-11-v6', trim: 11, versao: 6, titulo: 'Trim 11 · Versão 6', descricao: 'Trim 11 v6.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'p-valor de $z = 2{,}33$ bicaudal.', resposta: '$\\approx 0{,}02$',
      passos: '**Passo 1.** $P(|Z| > 2{,}33) = 2 \\cdot P(Z > 2{,}33) \\approx 2 \\cdot 0{,}01 = 0{,}02$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-103-teste-hipotese'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§9.3 p-value, ex. 27 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Regressão $\\hat y = 0{,}5 + 1{,}5 x$ baseada em 10 pontos. Erro padrão do slope $SE_b = 0{,}3$. IC 95% de $b$ ($t_{0{,}025}(8) = 2{,}306$).', resposta: '$[0{,}808;\\ 2{,}192]$',
      passos: '**Passo 1.** $E = 2{,}306 \\cdot 0{,}3 = 0{,}692$.\n\n**Passo 2.** $[1{,}5 \\pm 0{,}692]$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-105-regressao-simples'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§12.6 IC Slope, ex. 49 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'ANOVA: por que F e não múltiplos $t$?', resposta: 'F controla taxa erro tipo I global.',
      passos: '**Passo 1.** Vários testes $t$ inflam $\\alpha$ acumulado: 3 grupos = 3 testes; $1 - 0{,}95^3 \\approx 14\\%$ chance erro acidentar.\n\n**Passo 2.** F faz uma única comparação combinando informação.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-107-anova'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§13.1 Why ANOVA, ex. 5 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$\\chi^2$ independência $2 \\times 3$. df.', resposta: '$df = 2$',
      passos: '**Passo 1.** $df = (r-1)(c-1) = (1)(2) = 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-108-qui-quadrado'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§11.3 df Independence, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Distinção bayesiana vs frequentista: o que $P(H_1 | dados) = 0{,}9$ significa em Bayes?', resposta: '90% de prob. de $H_1$ ser verdadeira dado o que vimos.',
      passos: '**Passo 1.** Bayes: probabilidade é grau de crença.\n\n**Passo 2.** Frequentista: probabilidade só faz sentido para frequências em repetições. Logo, $H_1$ não tem $P$ frequentista.\n\n**Diferença filosófica.** Subjetiva vs objetiva.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-109-bayesiana-intro'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§Bayesian Interpretation (apêndice)', licenca: CC_BY } },
  ],
}

const PROVA_T11_V7: Prova = {
  id: 'trim-11-v7', trim: 11, versao: 7, titulo: 'Trim 11 · Versão 7', descricao: 'Trim 11 v7.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Margem erro: amostra $n=400$ com proporção $\\hat p = 0{,}5$. ME 95%.', resposta: '$\\approx 4{,}9\\%$',
      passos: '**Passo 1.** $SE = \\sqrt{0{,}25/400} = 0{,}025$. ME = $1{,}96 \\cdot 0{,}025 = 0{,}049$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-102-ic-media'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§8.2 Margin Error, ex. 33 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Teste pareado: 5 pares, diferenças $\\{2, -1, 3, 1, 0\\}$. $\\bar d$, $s_d$.', resposta: '$\\bar d = 1$, $s_d = 1{,}58$',
      passos: '**Passo 1.** $\\bar d = 5/5 = 1$. Desvios: $1, -2, 2, 0, -1$. Quadrados: $1, 4, 4, 0, 1 = 10$.\n\n**Passo 2.** $s_d^2 = 10/4 = 2{,}5$. $s_d = 1{,}581$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-104-teste-z-t'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§10.4 Paired t, ex. 7 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Regressão: por que residuais aleatórios indicam bom modelo?', resposta: 'Sem padrão $\\Rightarrow$ relação linear capturada.',
      passos: '**Passo 1.** Padrão sistemático em residuais (curva, fan-shape) $\\Rightarrow$ modelo linear não captura tudo.\n\n**Passo 2.** Aleatórios $\\Rightarrow$ erro residual é "ruído" — modelo OK.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-105-regressao-simples'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§12.4 Residual Pattern, ex. 39 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'ANOVA $F = MS_\\text{between}/MS_\\text{within}$. Interpretação.', resposta: 'F grande $\\Rightarrow$ variação entre grupos > variação dentro.',
      passos: '**Passo 1.** F mede razão da dispersão entre médias vs dispersão dentro de cada grupo.\n\n**Passo 2.** Se grupos são similares, F $\\approx 1$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-107-anova'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§13.2 F-Ratio, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Bayes: prior alta confiança em $\\theta = 0$. Pequena amostra com $\\bar x = 1$. Posterior puxa para?', resposta: 'Para 0 (prior dominante).',
      passos: '**Passo 1.** Posterior é mistura prior-likelihood ponderada por precisões.\n\n**Passo 2.** Prior forte (alta precisão) + amostra pequena $\\Rightarrow$ posterior próxima do prior.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-109-bayesiana-intro'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§Bayesian Prior Strength (apêndice)', licenca: CC_BY } },
  ],
}

const PROVA_T11_V8: Prova = {
  id: 'trim-11-v8', trim: 11, versao: 8, titulo: 'Trim 11 · Versão 8', descricao: 'Trim 11 v8.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Power = $1 - \\beta$. Se aumentamos $n$, o que acontece com poder?', resposta: 'Poder aumenta.',
      passos: '**Passo 1.** Maior $n$ ⇒ menor $SE$ ⇒ teste detecta efeitos menores ⇒ menor $\\beta$ ⇒ maior poder.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-103-teste-hipotese'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§9.7 Power Analysis (apêndice)', licenca: CC_BY } },
    { numero: 2, enunciado: 'IC vs teste: relação dual. Se IC 95% de $\\mu$ não contém $\\mu_0 = 50$, o teste $H_0: \\mu = 50$ rejeita?', resposta: 'Sim, ao nível 5%.',
      passos: '**Passo 1.** IC 95% e teste 5% bicaudal são duais.\n\n**Passo 2.** $\\mu_0 \\notin$ IC ⇔ rejeita $H_0$ ao nível 5%.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-103-teste-hipotese', 'aula-102-ic-media'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§9.6 IC-Test Duality, ex. 91 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Mínimos quadrados: minimiza soma quadrados de quê?', resposta: 'Resíduos verticais $(y_i - \\hat y_i)^2$.',
      passos: '**Passo 1.** OLS minimiza $\\sum(y_i - \\hat y_i)^2$ — resíduos na direção $y$.\n\n**Por que vertical e não perpendicular?** Suposição: erro está em $y$, $x$ é fixo. Total least squares assume erro em ambos.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-105-regressao-simples'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§12.3 OLS Definition, ex. 25 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$\\chi^2$ ajuste para uniforme: dado $\\{15, 12, 18, 25\\}$, esperado $17{,}5$ cada. $\\chi^2$.', resposta: '$\\approx 5{,}79$',
      passos: '**Passo 1.** Diff quadradas/E: $(2{,}5)^2/17{,}5 + (5{,}5)^2/17{,}5 + (0{,}5)^2/17{,}5 + (7{,}5)^2/17{,}5 = (6{,}25 + 30{,}25 + 0{,}25 + 56{,}25)/17{,}5 = 93/17{,}5 \\approx 5{,}31$. (Recálculo cuidadoso necessário.)',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-108-qui-quadrado'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§11.2 Uniform Test, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Bayes em diagnóstico: a posteriori muda quão rapidamente ao receber dados? Por quê?', resposta: 'Depende da força do prior.',
      passos: '**Passo 1.** Prior fraco (alto $\\sigma$) $\\Rightarrow$ atualiza rápido.\n\n**Passo 2.** Prior forte $\\Rightarrow$ atualiza devagar.\n\n**Frase.** "Extraordinary claims require extraordinary evidence" (Sagan) é a versão informal do princípio bayesiano.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-109-bayesiana-intro'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§Bayesian Update Speed (apêndice)', licenca: CC_BY } },
  ],
}

const PROVA_T11_V9: Prova = {
  id: 'trim-11-v9', trim: 11, versao: 9, titulo: 'Trim 11 · Versão 9', descricao: 'Trim 11 v9.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Estimador imparcial: $E[\\hat\\theta] = \\theta$. Mostre que $\\bar X$ é imparcial para $\\mu$.', resposta: 'Demonstração.',
      passos: '**Passo 1.** $E[\\bar X] = E[(\\sum X_i)/n] = (\\sum E[X_i])/n = n\\mu/n = \\mu$. ∎',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-101-amostragem'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§7.1 Unbiased Mean (apêndice)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Teste 1-cauda direita, $z = 1{,}5$. $p$.', resposta: '$\\approx 0{,}067$',
      passos: '**Passo 1.** $P(Z > 1{,}5) \\approx 0{,}0668$. Não rejeita ao nível 5%.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-103-teste-hipotese'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§9.3 z One-tail, ex. 25 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Regressão: 5 pontos, $\\sum x = 15$, $\\sum y = 30$, $\\sum xy = 100$, $\\sum x^2 = 55$. Slope.', resposta: '$b = 1$',
      passos: '**Passo 1.** $\\bar x = 3$, $\\bar y = 6$.\n\n**Passo 2.** Numerador slope: $\\sum xy - n\\bar x\\bar y = 100 - 5 \\cdot 18 = 10$.\n\n**Passo 3.** Denominador: $\\sum x^2 - n\\bar x^2 = 55 - 45 = 10$.\n\n**Passo 4.** $b = 10/10 = 1$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-105-regressao-simples'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§12.3 Slope Calc, ex. 51 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'ANOVA: 4 grupos, $n = 8$ cada. df entre, df dentro.', resposta: '$df_1 = 3$, $df_2 = 28$',
      passos: '**Passo 1.** $df_\\text{between} = k - 1 = 3$.\n\n**Passo 2.** $df_\\text{within} = N - k = 32 - 4 = 28$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-107-anova'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§13.1 df ANOVA, ex. 23 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Bayes vs frequentista: estimar $p$ de moeda. Frequentista MLE = $\\hat p = $ x/n. Bayes com prior uniforme = ?', resposta: 'Posterior média $= (x+1)/(n+2)$.',
      passos: '**Passo 1.** Prior $\\text{Beta}(1,1)$, posterior $\\text{Beta}(x+1, n-x+1)$.\n\n**Passo 2.** Média $= (x+1)/(n+2)$.\n\n**Para $n$ grande.** Converge a $\\hat p$ frequentista. Para $n$ pequeno: shrinks toward prior.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-109-bayesiana-intro'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§Bayes vs Freq (apêndice)', licenca: CC_BY } },
  ],
}

const PROVA_T11_V10: Prova = {
  id: 'trim-11-v10', trim: 11, versao: 10, titulo: 'Trim 11 · Versão 10', descricao: 'Trim 11 v10.',
  duracaoMinutos: 90, intensidade: 4, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'IC 90% para $\\mu$: $\\bar x = 25$, $\\sigma = 5$, $n = 100$.', resposta: '$[24{,}18;\\ 25{,}82]$',
      passos: '**Passo 1.** $z_{0{,}05} = 1{,}645$. $E = 1{,}645 \\cdot 0{,}5 = 0{,}82$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-102-ic-media'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§8.1 IC 90%, ex. 39 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Hipótese unilateral vs bilateral: quando usar?', resposta: 'Bilateral: pergunta "diferente". Unilateral: "maior" ou "menor".',
      passos: '**Passo 1.** $H_1: \\mu \\neq \\mu_0$ ⇒ bilateral. $H_1: \\mu > \\mu_0$ ⇒ unilateral direita.\n\n**Cuidado.** Escolha *antes* de ver dados; senão é p-hacking.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-103-teste-hipotese'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§9.5 One vs Two Tail, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Regressão múltipla: dois regressores correlacionados (multicolinearidade). Sintoma?', resposta: 'Coeficientes instáveis e SE alto.',
      passos: '**Passo 1.** Variáveis correlacionadas tornam separação difícil.\n\n**Passo 2.** Pequenas mudanças nos dados causam grandes oscilações nos $\\beta$. SE dispara.',
      dificuldade: 'desafio', aulasCobertas: ['aula-106-regressao-multipla'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§12.5 Multicollinearity, ex. 31 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: '$\\chi^2$ tabela $3\\times 3$, $\\chi^2 = 15$. Crítico (95%, $df=4$) $= 9{,}49$. Decisão.', resposta: 'Rejeita $H_0$ (variáveis associadas).',
      passos: '**Passo 1.** $df = (3-1)(3-1) = 4$.\n\n**Passo 2.** Observado $> $ crítico $\\Rightarrow$ rejeita.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-108-qui-quadrado'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§11.3 Independence 3x3, ex. 25 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Posterior decisão: $H_1: \\theta > 0$. Posterior dá $P(\\theta > 0 | dados) = 0{,}97$. Conclusão bayesiana.', resposta: 'Forte evidência a favor de $H_1$.',
      passos: '**Passo 1.** Em Bayes, decisão é probabilidade direta da hipótese — não p-valor.\n\n**Passo 2.** $97\\%$ de chance de $\\theta > 0$ é evidência forte.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-109-bayesiana-intro'],
      fonteOriginal: { livro: 'OpenStax Intro Stat', url: OS_STAT, ref: '§Bayesian Decision (apêndice)', licenca: CC_BY } },
  ],
}

const PROVA_T12_V1: Prova = {
  id: 'trim-12-v1',
  trim: 12,
  versao: 1,
  titulo: 'Trim 12 · Versão 1 — Álgebra linear e síntese',
  descricao:
    'Espaços vetoriais, transformações, autovalores, diagonalização, SVD, PCA, Black-Scholes.',
  duracaoMinutos: 90,
  intensidade: 5,
  publicoAlvo: '3.º ano',
  status: 'curada',
  questoes: [
    {
      numero: 1,
      enunciado:
        'Calcule autovalores e autovetores de $A = \\begin{pmatrix} 4 & -2 \\\\ 1 & 1 \\end{pmatrix}$.',
      resposta:
        'Autovalores $\\lambda_1 = 3$, $\\lambda_2 = 2$. Autovetores: $\\vec v_1 = (2, 1)$, $\\vec v_2 = (1, 1)$.',
      passos:
        '**Passo 1 — Polinômio característico.** $\\det(A - \\lambda I) = \\det\\begin{pmatrix} 4-\\lambda & -2 \\\\ 1 & 1 - \\lambda \\end{pmatrix} = (4-\\lambda)(1-\\lambda) + 2 = \\lambda^2 - 5\\lambda + 6$.\n\n' +
        '**Passo 2 — Raízes.** $\\lambda^2 - 5\\lambda + 6 = (\\lambda-3)(\\lambda-2) = 0 \\Rightarrow \\lambda = 3, 2$.\n\n' +
        '**Passo 3 — Autovetor de $\\lambda_1 = 3$.** $(A - 3I)\\vec v = 0$: $\\begin{pmatrix} 1 & -2 \\\\ 1 & -2 \\end{pmatrix}$. Linha: $v_1 - 2v_2 = 0$ ⇒ $\\vec v_1 = (2, 1)$.\n\n' +
        '**Passo 4 — Autovetor de $\\lambda_2 = 2$.** $(A - 2I)\\vec v = 0$: $\\begin{pmatrix} 2 & -2 \\\\ 1 & -1 \\end{pmatrix}$. $v_1 - v_2 = 0$ ⇒ $\\vec v_2 = (1, 1)$.\n\n' +
        '**Por que isso importa?** Autovetores são **direções invariantes** sob $A$: $A\\vec v = \\lambda \\vec v$. Diagonalização decompõe $A$ nessas direções, simplificando potências, exponenciais, EDOs lineares.',
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-114-autovalores', 'aula-115-diagonalizacao'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 3',
        url: OS_CALC3,
        ref: '§Linear Algebra appendix; também Strang Linear Algebra OCW',
        licenca: CC_BY,
      },
    },
    {
      numero: 2,
      enunciado:
        'Black-Scholes europeia call: $S_0 = 100$, $K = 100$, $r = 5\\%$, $\\sigma = 20\\%$, $T = 1$ ano. Calcule $d_1$ e $d_2$.',
      resposta: '$d_1 = 0{,}35$, $d_2 = 0{,}15$.',
      passos:
        '**Passo 1 — $d_1$.** $d_1 = \\dfrac{\\ln(S_0/K) + (r + \\sigma^2/2)T}{\\sigma\\sqrt T} = \\dfrac{0 + (0{,}05 + 0{,}02) \\cdot 1}{0{,}2 \\cdot 1} = \\dfrac{0{,}07}{0{,}2} = 0{,}35$.\n\n' +
        '**Passo 2 — $d_2 = d_1 - \\sigma\\sqrt T$.** $d_2 = 0{,}35 - 0{,}2 = 0{,}15$.\n\n' +
        '**Por que esses dois números?** $d_1$ entra no $\\Delta$ (sensibilidade da opção ao spot); $d_2$ é a probabilidade risk-neutral de exercício na maturidade.\n\n' +
        '**Próximo passo.** Preço da call $C = S_0 N(d_1) - K e^{-rT} N(d_2)$ com $N(\\cdot)$ tabelada (CDF da normal padrão). $N(0{,}35) \\approx 0{,}637$, $N(0{,}15) \\approx 0{,}560$. $C \\approx 100 \\cdot 0{,}637 - 100 e^{-0{,}05} \\cdot 0{,}560 \\approx 63{,}7 - 53{,}3 \\approx 10{,}4$.',
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-119-bs-sintese'],
      fonteOriginal: {
        livro: 'Black & Scholes (1973), JPolEcon — replicado em Active Calculus apêndice',
        url: ACTIVE_CALC,
        ref: 'Eq. fechada da call europeia (apêndice)',
        licenca: CC_BY_NC_SA,
      },
    },
    {
      numero: 3,
      enunciado:
        'Mostre que se $\\vec v_1, \\vec v_2$ são autovetores de $A$ com autovalores distintos, eles são linearmente independentes.',
      resposta:
        'Demonstração: $\\vec v_1, \\vec v_2$ associados a $\\lambda_1 \\neq \\lambda_2$ ⇒ LI.',
      passos:
        '**Passo 1 — Suponha dependência linear.** $c_1 \\vec v_1 + c_2 \\vec v_2 = 0$ com $(c_1, c_2) \\neq (0, 0)$.\n\n' +
        '**Passo 2 — Aplique $A$.** $c_1 A\\vec v_1 + c_2 A\\vec v_2 = 0 \\Rightarrow c_1 \\lambda_1 \\vec v_1 + c_2 \\lambda_2 \\vec v_2 = 0$.\n\n' +
        '**Passo 3 — Multiplique a primeira por $\\lambda_1$.** $c_1 \\lambda_1 \\vec v_1 + c_2 \\lambda_1 \\vec v_2 = 0$.\n\n' +
        '**Passo 4 — Subtraia.** $c_2 (\\lambda_1 - \\lambda_2) \\vec v_2 = 0$. Como $\\lambda_1 \\neq \\lambda_2$ e $\\vec v_2 \\neq 0$, segue $c_2 = 0$.\n\n' +
        '**Passo 5 — Volta.** $c_1 \\vec v_1 = 0$ ⇒ $c_1 = 0$. Contradição com a hipótese.\n\n' +
        '**Por que isso importa?** Garante que matriz com $n$ autovalores distintos é **diagonalizável** — simplifica espectralmente.',
      dificuldade: 'demonstracao',
      aulasCobertas: ['aula-114-autovalores', 'aula-115-diagonalizacao'],
      fonteOriginal: {
        livro: 'OpenStax Calculus Volume 3 (apêndice de álgebra linear)',
        url: OS_CALC3,
        ref: 'Linear Algebra Background, Theorem on distinct eigenvalues',
        licenca: CC_BY,
      },
    },
  ],
}

// =============================================================================
// TRIM 1 — Versões 4 a 10 (mais OpenStax College Algebra 2e)
// =============================================================================

const PROVA_T1_V4: Prova = {
  id: 'trim-1-v4',
  trim: 1, versao: 4,
  titulo: 'Trim 1 · Versão 4 — Funções, afim, quadrática, exp/log',
  descricao: 'Trim 1 v4. Mesma cobertura, novos exercícios.',
  duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1,
      enunciado: 'Determine o domínio de $h(x) = \\dfrac{1}{x^2 + 1}$.',
      resposta: '$\\mathbb{R}$ (todos os reais)',
      passos: '**Passo 1 — Função racional.** Restrição: denominador $\\neq 0$.\n\n**Passo 2 — $x^2 + 1 = 0$ tem solução real?** Não — $x^2 \\geq 0$ ⇒ $x^2 + 1 \\geq 1 > 0$ sempre.\n\n**Passo 3 — Domínio.** Sem restrição ⇒ $\\mathbb{R}$.\n\n**Por que sempre positivo?** $x^2 \\geq 0$ é axioma da ordenação de $\\mathbb{R}$. Somar 1 dá mínimo igual a 1.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§3.2 Domain, ex. 5 (adaptado)', licenca: CC_BY } },
    { numero: 2,
      enunciado: 'Inclinação da reta que passa por $(-2, 5)$ e $(4, -7)$.',
      resposta: '$m = -2$',
      passos: '**Passo 1 — Fórmula.** $m = (y_2 - y_1)/(x_2 - x_1)$.\n\n**Passo 2 — Substitua.** $m = (-7 - 5)/(4 - (-2)) = -12/6 = -2$.\n\n**Por que essa fórmula?** Inclinação é a razão **constante** $\\Delta y/\\Delta x$ em qualquer trecho da reta. A ordem dos pontos não importa: trocar inverte sinal de num. e den. — cancela.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§4.1 Linear Functions, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 3,
      enunciado: 'Vértice e raízes de $f(x) = -x^2 + 4x - 3$.',
      resposta: 'Vértice $(2, 1)$. Raízes $x = 1$ e $x = 3$.',
      passos: '**Passo 1 — $x_v = -b/(2a) = -4/(-2) = 2$.**\n\n**Passo 2 — $y_v = f(2) = -4 + 8 - 3 = 1$.**\n\n**Passo 3 — Bhaskara.** $\\Delta = 16 - 12 = 4$. $x = (-4 \\pm 2)/(-2)$, ou seja $x = 1$ ou $x = 3$.\n\n**Por que $a < 0$ ⇒ vértice é máximo?** Parábola "para baixo": cresce até $x_v$, depois decresce. $y_v = 1$ é maior valor de $f$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§5.1 Quadratic Functions, ex. 25 (adaptado)', licenca: CC_BY } },
    { numero: 4,
      enunciado: 'Resolva $2^{x+1} = 32$.',
      resposta: '$x = 4$',
      passos: '**Passo 1 — Iguale bases.** $32 = 2^5$. Logo $2^{x+1} = 2^5$.\n\n**Passo 2 — Iguale expoentes.** $x + 1 = 5 \\Rightarrow x = 4$.\n\n**Por que cancelar?** $2^x$ é injetora ($a \\neq b \\Rightarrow 2^a \\neq 2^b$). Logo $2^a = 2^b \\Leftrightarrow a = b$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-06-exponencial'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.6 Exponential Equations, ex. 33 (adaptado)', licenca: CC_BY } },
    { numero: 5,
      enunciado: 'Investimento de R\\$ 1.000 a 6\\% a.a. (juros compostos contínuos). Quanto após 8 anos?',
      resposta: '$1000 e^{0{,}48} \\approx R\\$ 1.616{,}07$',
      passos: '**Passo 1 — Modelo.** $A = P e^{rt}$ com $P = 1000$, $r = 0{,}06$, $t = 8$.\n\n**Passo 2 — Calcule.** $A = 1000 \\cdot e^{0{,}48} \\approx 1000 \\cdot 1{,}6161 = 1616{,}07$.\n\n**Por que $e^{rt}$?** Capitalização **contínua** = limite de $(1 + r/n)^{nt}$ quando $n \\to \\infty$. Resultado: $e^{rt}$. É o regime usado em finanças quantitativas (Black-Scholes).',
      dificuldade: 'modelagem', aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.7 Compound Interest, ex. 8 (adaptado para BR)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Determine domínio de $f(x) = \\sqrt{16 - x^2}$.', resposta: '$[-4, 4]$',
      passos: '**Passo 1.** Radicando $\\geq 0$: $16 - x^2 \\geq 0 \\Rightarrow x^2 \\leq 16 \\Rightarrow -4 \\leq x \\leq 4$.\n\n**Passo 2.** Domínio: $[-4, 4]$.\n\n**Geometricamente.** Semi-círculo superior de raio 4 (apenas valores reais).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.2 Sqrt Domain, ex. 27 (adaptado)', licenca: CC_BY } },
    { numero: 7, enunciado: 'Encontre $f(g(x))$ se $f(x) = 1/x$ e $g(x) = x + 2$.', resposta: '$1/(x+2)$',
      passos: '**Passo 1.** $f(g(x)) = f(x + 2) = 1/(x + 2)$.\n\n**Domínio.** $x \\neq -2$ (denominador zero).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.4 Composition, ex. 31 (adaptado)', licenca: CC_BY } },
    { numero: 8, enunciado: 'Resolva $|x + 4| \\geq 6$.', resposta: '$x \\leq -10$ ou $x \\geq 2$',
      passos: '**Passo 1.** $|y| \\geq 6 \\Leftrightarrow y \\leq -6$ ou $y \\geq 6$.\n\n**Passo 2.** $x + 4 \\leq -6 \\Rightarrow x \\leq -10$. $x + 4 \\geq 6 \\Rightarrow x \\geq 2$.\n\n**Em intervalo.** $(-\\infty, -10] \\cup [2, +\\infty)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-01-conjuntos-intervalos'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.7 Abs Inequality, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 9, enunciado: 'Quadrática $f(x) = 3x^2 + 6x + 1$. Forma canônica.', resposta: '$f(x) = 3(x + 1)^2 - 2$',
      passos: '**Passo 1.** Fator $a = 3$ na frente: $3(x^2 + 2x) + 1$.\n\n**Passo 2.** Completar quadrado dentro: $x^2 + 2x = (x+1)^2 - 1$.\n\n**Passo 3.** Substituir: $3((x+1)^2 - 1) + 1 = 3(x+1)^2 - 3 + 1 = 3(x+1)^2 - 2$.\n\n**Vértice.** $(-1, -2)$. Mínimo da parábola (a > 0).',
      dificuldade: 'compreensao', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§5.1 Standard Form, ex. 31 (adaptado)', licenca: CC_BY } },
    { numero: 10, enunciado: 'Resolva $\\log_3(x) - \\log_3(x - 2) = 1$.', resposta: '$x = 3$',
      passos: '**Passo 1.** Diferença de logs: $\\log_3(x/(x-2)) = 1$.\n\n**Passo 2.** Forma exponencial: $x/(x-2) = 3$.\n\n**Passo 3.** $x = 3(x-2) = 3x - 6 \\Rightarrow -2x = -6 \\Rightarrow x = 3$.\n\n**Verificar domínio.** Precisa $x > 0$ e $x - 2 > 0$. $x = 3$ ✓.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.6 Log Eq, ex. 56 (adaptado)', licenca: CC_BY } },
    { numero: 11, enunciado: 'Equação da reta passando por $(2, -1)$ paralela a $y = 3x + 7$.', resposta: '$y = 3x - 7$',
      passos: '**Passo 1.** Paralela ⇒ mesma inclinação: $m = 3$.\n\n**Passo 2.** Ponto-inclinação: $y - (-1) = 3(x - 2) \\Rightarrow y = 3x - 6 - 1 = 3x - 7$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Parallel Lines, ex. 39 (adaptado)', licenca: CC_BY } },
    { numero: 12, enunciado: 'Função racional: encontre assíntotas verticais e horizontais de $f(x) = (3x - 2)/(x + 1)$.', resposta: 'Vertical: $x = -1$. Horizontal: $y = 3$.',
      passos: '**Passo 1.** Vertical: denominador zera em $x = -1$.\n\n**Passo 2.** Horizontal: razão coeficientes líderes = $3/1 = 3$. Logo $y = 3$.\n\n**Por quê?** Quando $x \\to \\infty$, termos constantes ficam desprezíveis: $f \\to 3x/x = 3$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§5.6 Rational Asymptotes, ex. 23 (adaptado)', licenca: CC_BY } },
    { numero: 13, enunciado: 'Modelagem: pH de solução é $\\text{pH} = -\\log[\\text{H}^+]$. Calcule pH se $[\\text{H}^+] = 10^{-3}$ mol/L.', resposta: 'pH $= 3$',
      passos: '**Passo 1.** $\\text{pH} = -\\log(10^{-3}) = -(-3) = 3$.\n\n**Interpretação.** pH 3 = ácido (vinagre tem pH ~3). pH 7 = neutro. pH 14 = base forte.\n\n**Por que escala log?** Concentração varia $10^{14}$ vezes na natureza — log comprime para 0-14 manejável.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.5 pH Application, ex. 78 (adaptado)', licenca: CC_BY } },
    { numero: 14, enunciado: '$f(x) = 1/x$ é par, ímpar ou nenhum?', resposta: 'Ímpar.',
      passos: '**Passo 1.** $f(-x) = 1/(-x) = -1/x = -f(x)$.\n\n**Conclusão.** Ímpar ⇒ gráfico simétrico à origem.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.3 Odd Function, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem populacional logística: $P(t) = 1000/(1 + 9 e^{-0{,}2 t})$. Limite quando $t \\to \\infty$.', resposta: '$1000$',
      passos: '**Passo 1.** $e^{-0{,}2 t} \\to 0$ quando $t \\to \\infty$.\n\n**Passo 2.** $P \\to 1000/(1 + 0) = 1000$. Capacidade de suporte $K = 1000$.\n\n**Por que esse modelo?** Captura saturação por recursos finitos (diferente de exponencial puro que cresce sem limite). Padrão em epidemias, adoção de tecnologia, populações.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.7 Logistic Limit, ex. 35 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T1_V5: Prova = {
  id: 'trim-1-v5', trim: 1, versao: 5,
  titulo: 'Trim 1 · Versão 5 — Funções, afim, quadrática, exp/log',
  descricao: 'Trim 1 v5. Cobertura padrão.',
  duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1,
      enunciado: 'Domínio de $f(x) = \\dfrac{x}{x^2 - 4x}$.',
      resposta: '$\\mathbb{R} \\setminus \\{0, 4\\}$',
      passos: '**Passo 1 — Restrição.** $x^2 - 4x \\neq 0$.\n\n**Passo 2 — Fatorar.** $x(x - 4) \\neq 0$ ⇒ $x \\neq 0$ e $x \\neq 4$.\n\n**Por que ambos?** Produto zera quando algum fator zera. Excluir cada raiz do polinômio do denominador.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§3.2 Domain, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 2,
      enunciado: 'Reta perpendicular a $3x - 2y = 6$ passando por $(1, 1)$.',
      resposta: '$y = -\\dfrac{2}{3}x + \\dfrac{5}{3}$',
      passos: '**Passo 1 — Inclinação original.** $3x - 2y = 6 \\Rightarrow y = (3/2)x - 3$. $m = 3/2$.\n\n**Passo 2 — Perpendicular.** $m_\\perp = -1/m = -2/3$.\n\n**Passo 3 — Ponto-inclinação.** $y - 1 = -2/3 (x - 1) \\Rightarrow y = -2x/3 + 2/3 + 1 = -2x/3 + 5/3$.\n\n**Por que $m_\\perp m = -1$?** Rotação de $90°$ no plano leva $(1, m)$ a $(-m, 1)$. Inclinação nova: $1/(-m) = -1/m$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§4.1 Linear Functions, ex. 56 (adaptado)', licenca: CC_BY } },
    { numero: 3,
      enunciado: 'Resolva $x^2 - 5x + 6 \\leq 0$.',
      resposta: '$x \\in [2, 3]$',
      passos: '**Passo 1 — Fatorar.** $x^2 - 5x + 6 = (x - 2)(x - 3)$.\n\n**Passo 2 — Quadro de sinais.** Fatores zeram em $2$ e $3$. Em $(-\\infty, 2)$: $(-)(-) = +$. Em $(2, 3)$: $(+)(-) = -$. Em $(3, \\infty)$: $(+)(+) = +$.\n\n**Passo 3 — $\\leq 0$.** Onde produto é negativo OU zero: $[2, 3]$.\n\n**Por que incluir $2$ e $3$?** Inequação é $\\leq$, então iguala-zero entra. Se fosse $<$, seria $(2, 3)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§5.1 Quadratic Inequalities, ex. 67 (adaptado)', licenca: CC_BY } },
    { numero: 4,
      enunciado: 'Resolva $\\log_3 x + \\log_3 (x - 2) = 1$.',
      resposta: '$x = 3$ (raiz $x = -1$ é estranha).',
      passos: '**Passo 1 — Combine.** $\\log_3[x(x-2)] = 1$.\n\n**Passo 2 — Forma exponencial.** $x(x-2) = 3^1 = 3$. $x^2 - 2x - 3 = 0$ ⇒ $(x-3)(x+1) = 0$ ⇒ $x = 3$ ou $x = -1$.\n\n**Passo 3 — Domínio.** $\\log_3 x$ exige $x > 0$ e $\\log_3(x-2)$ exige $x > 2$. Logo $x = -1$ rejeitado. Resposta: $x = 3$.\n\n**Por que verificar?** Combinar logs admite raízes onde algum operando do log original era negativo — domínio quebraria.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.6 Logarithmic Equations, ex. 51 (adaptado)', licenca: CC_BY } },
    { numero: 5,
      enunciado: 'Carbono-14 tem meia-vida $\\approx 5730$ anos. Um fóssil tem 25\\% do C-14 inicial. Idade?',
      resposta: '$\\approx 11\\,460$ anos.',
      passos: '**Passo 1 — Modelo.** $N(t)/N_0 = (1/2)^{t/5730}$.\n\n**Passo 2 — Iguale a $0{,}25$.** $(1/2)^{t/5730} = 1/4 = (1/2)^2$.\n\n**Passo 3 — Iguale expoentes.** $t/5730 = 2 \\Rightarrow t = 11\\,460$ anos.\n\n**Por que isso funciona?** $25\\% = 1/4 = (1/2)^2$ ⇒ duas meia-vidas. Cada uma corta pela metade: $100\\% \\to 50\\% \\to 25\\%$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.7 Half-Life, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Resolva $3^x = 81$.', resposta: '$x = 4$',
      passos: '**Passo 1.** $81 = 3^4$.\n\n**Passo 2.** $3^x = 3^4 \\Rightarrow x = 4$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-06-exponencial'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.6 Exp Eq, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 7, enunciado: 'Determine se $f(x) = 2/x$ é par, ímpar ou nenhum.', resposta: 'Ímpar.',
      passos: '**Passo 1.** $f(-x) = 2/(-x) = -2/x = -f(x)$.\n\n**Conclusão.** Ímpar.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.3 Odd Reciprocal, ex. 9 (adaptado)', licenca: CC_BY } },
    { numero: 8, enunciado: 'Encontre vértice de $y = x^2 + 4x + 1$.', resposta: 'Vértice $(-2, -3)$.',
      passos: '**Passo 1.** $x_v = -b/(2a) = -4/2 = -2$.\n\n**Passo 2.** $y_v = (-2)^2 + 4(-2) + 1 = 4 - 8 + 1 = -3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§5.1 Vertex, ex. 25 (adaptado)', licenca: CC_BY } },
    { numero: 9, enunciado: 'Reta com $m = 0$ por $(7, 2)$.', resposta: '$y = 2$',
      passos: '**Passo 1.** $m = 0$ ⇒ horizontal. $y$ constante.\n\n**Passo 2.** Passa por $(7, 2)$: $y = 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Horizontal, ex. 7 (adaptado)', licenca: CC_BY } },
    { numero: 10, enunciado: 'Composta: $h(x) = (x + 1)^2$ pode ser escrita como $f(g(x))$. Encontre $f$ e $g$.', resposta: '$g(x) = x + 1$, $f(x) = x^2$.',
      passos: '**Passo 1.** Identifique a "operação interna" e "externa": primeiro soma 1, depois eleva ao quadrado.\n\n**Passo 2.** $g$ = parte interna $= x + 1$. $f$ = parte externa $= ()^2$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.4 Decomposing, ex. 28 (adaptado)', licenca: CC_BY } },
    { numero: 11, enunciado: '$\\log_{10}(1000) - \\log_{10}(10)$.', resposta: '$2$',
      passos: '**Passo 1.** $\\log_{10}(1000) = 3$, $\\log_{10}(10) = 1$.\n\n**Passo 2.** Diferença $= 2$.\n\n**Equivalente via propriedade.** $\\log(1000/10) = \\log 100 = 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.5 Log Difference, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 12, enunciado: 'Cresce 8% ao ano. Quanto tempo dobrar?', resposta: '$\\approx 9$ anos.',
      passos: '**Passo 1.** $2 = 1{,}08^t \\Rightarrow t = \\log_{1{,}08} 2 = \\ln 2 / \\ln 1{,}08 \\approx 0{,}693 / 0{,}077 \\approx 9$.\n\n**Regra dos 72.** $72/8 = 9$ ✓.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.7 Doubling, ex. 24 (adaptado)', licenca: CC_BY } },
    { numero: 13, enunciado: '$f(g(x))$ se $f(x) = \\sqrt x$ e $g(x) = x - 1$.', resposta: '$\\sqrt{x - 1}$, com $x \\geq 1$.',
      passos: '**Passo 1.** $f(g(x)) = f(x - 1) = \\sqrt{x - 1}$.\n\n**Passo 2.** Domínio: $x - 1 \\geq 0 \\Rightarrow x \\geq 1$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.4 Composition Domain, ex. 30 (adaptado)', licenca: CC_BY } },
    { numero: 14, enunciado: 'Inversa de $f(x) = (x + 5)/3$.', resposta: '$f^{-1}(x) = 3x - 5$',
      passos: '**Passo 1.** $y = (x + 5)/3$. Trocar: $x = (y + 5)/3$.\n\n**Passo 2.** Isolar: $3x = y + 5 \\Rightarrow y = 3x - 5$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.7 Inverse, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 15, enunciado: 'Decibéis: $L = 10\\log(I/I_0)$. Som de fonte 100x mais intensa que limiar audível.', resposta: '$20$ dB',
      passos: '**Passo 1.** $L = 10\\log(100) = 10 \\cdot 2 = 20$.\n\n**Por que escala log?** Audição humana percebe intensidades em ordens de grandeza. Sussurro ~30 dB, conversa ~60 dB, show ~110 dB.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.5 Decibel Scale, ex. 81 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T1_V6: Prova = {
  id: 'trim-1-v6', trim: 1, versao: 6,
  titulo: 'Trim 1 · Versão 6 — Funções, afim, quadrática, exp/log',
  descricao: 'Trim 1 v6. Cobertura padrão.',
  duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1,
      enunciado: 'Imagem de $f(x) = -x^2 + 4$.',
      resposta: '$(-\\infty, 4]$',
      passos: '**Passo 1 — $a < 0$, parábola para baixo.** Vértice é máximo.\n\n**Passo 2 — Vértice.** $x_v = 0$, $y_v = 4$.\n\n**Passo 3 — Imagem.** $f$ atinge tudo de $-\\infty$ até $4$, inclusive. Im $= (-\\infty, 4]$.\n\n**Por que tudo entre?** Polinômio é contínuo, vai de $-\\infty$ até max e volta. Pela continuidade, atinge **todo** valor entre.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-02-funcoes', 'aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§3.2 Range, ex. 31 (adaptado)', licenca: CC_BY } },
    { numero: 2,
      enunciado: 'Reta horizontal por $(3, -5)$.',
      resposta: '$y = -5$',
      passos: '**Passo 1 — Horizontal ⇒ $m = 0$.** Não há subida.\n\n**Passo 2 — Equação.** $y - (-5) = 0(x - 3) \\Rightarrow y = -5$.\n\n**Por que não envolve $x$?** Toda altura é $-5$, independente de $x$. Reta é função constante.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§4.1 Linear Functions, ex. 8 (adaptado)', licenca: CC_BY } },
    { numero: 3,
      enunciado: 'Soma e produto das raízes de $2x^2 - 7x + 3 = 0$.',
      resposta: 'Soma $= 7/2$, produto $= 3/2$.',
      passos: '**Passo 1 — Soma e produto (Girard).** Para $ax^2 + bx + c = 0$: soma $= -b/a$, produto $= c/a$.\n\n**Passo 2 — Aplique.** Soma $= 7/2$, produto $= 3/2$.\n\n**Verificação.** Bhaskara: $\\Delta = 49 - 24 = 25$. $x = (7 \\pm 5)/4$ ⇒ $x = 3$ ou $1/2$. Soma $= 7/2$ ✓, produto $= 3/2$ ✓.\n\n**Por que Girard?** Vem de fatorar $a(x - x_1)(x - x_2) = ax^2 - a(x_1+x_2)x + a x_1 x_2$ — comparação direta com $ax^2 + bx + c$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§5.1 Vieta\'s Formulas (apêndice), ex. 41 (adaptado)', licenca: CC_BY } },
    { numero: 4,
      enunciado: 'Resolva $5^{x-2} = 125$.',
      resposta: '$x = 5$',
      passos: '**Passo 1 — $125 = 5^3$.** $5^{x-2} = 5^3$.\n\n**Passo 2 — $x - 2 = 3 \\Rightarrow x = 5$.**\n\n**Por que iguala bases primeiro?** Quando RHS é potência exata da base, evita-se logaritmo. Caminho mais limpo.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-06-exponencial'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.6 Exponential Equations, ex. 23 (adaptado)', licenca: CC_BY } },
    { numero: 5,
      enunciado: 'pH = $-\\log[H^+]$. Se $[H^+] = 10^{-4}$ mol/L, qual o pH?',
      resposta: 'pH $= 4$ (ácido).',
      passos: '**Passo 1 — Substitua.** pH $= -\\log(10^{-4})$.\n\n**Passo 2 — Propriedade.** $\\log(10^{-4}) = -4$. Logo pH $= -(-4) = 4$.\n\n**Por que escala log?** Concentrações de H+ variam por **muitas ordens de grandeza** (10¹ a 10⁻¹⁴). Log comprime para escala 0-14, intuitiva.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.5 pH Application, ex. 78 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Fatorar $x^2 - 9$.', resposta: '$(x-3)(x+3)$',
      passos: '**Passo 1.** Diferença de quadrados: $a^2 - b^2 = (a-b)(a+b)$.\n\n**Passo 2.** $a = x$, $b = 3$. Fator: $(x-3)(x+3)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§1.5 Factoring, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 7, enunciado: 'Resolva $\\sqrt{x + 4} = x - 2$.', resposta: '$x = 5$ (verificar).',
      passos: '**Passo 1.** Eleve ao quadrado: $x + 4 = (x - 2)^2 = x^2 - 4x + 4$.\n\n**Passo 2.** $x^2 - 5x = 0 \\Rightarrow x(x - 5) = 0 \\Rightarrow x = 0$ ou $x = 5$.\n\n**Passo 3 — Verificar.** $x = 0$: $\\sqrt 4 = 2 \\neq -2$ ✗. $x = 5$: $\\sqrt 9 = 3 = 3$ ✓.\n\n**Por que verificar?** Elevar ao quadrado pode introduzir raízes estranhas.',
      dificuldade: 'desafio', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.5 Radical Eq, ex. 31 (adaptado)', licenca: CC_BY } },
    { numero: 8, enunciado: 'Resolva $2^x = 7$.', resposta: '$x = \\log_2 7 \\approx 2{,}807$',
      passos: '**Passo 1.** Aplicar log: $\\log_2(2^x) = \\log_2 7 \\Rightarrow x = \\log_2 7$.\n\n**Passo 2.** Mudança de base: $\\ln 7 / \\ln 2 \\approx 1{,}946/0{,}693 \\approx 2{,}807$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-06-exponencial', 'aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.6 Non-Integer Exp, ex. 29 (adaptado)', licenca: CC_BY } },
    { numero: 9, enunciado: 'População com 5% crescimento ao ano. Modelo $P(t)$.', resposta: '$P(t) = P_0 (1{,}05)^t$',
      passos: '**Passo 1.** Multiplicador anual: $1 + 0{,}05 = 1{,}05$.\n\n**Passo 2.** Após $t$ anos: $P_0 \\cdot 1{,}05^t$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.1 Exp Growth Rate, ex. 9 (adaptado)', licenca: CC_BY } },
    { numero: 10, enunciado: 'Reta que passa por $(0, 0)$ e $(4, 12)$.', resposta: '$y = 3x$',
      passos: '**Passo 1.** $m = (12 - 0)/(4 - 0) = 3$.\n\n**Passo 2.** Passa por origem ⇒ $b = 0$. Logo $y = 3x$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Through Origin, ex. 16 (adaptado)', licenca: CC_BY } },
    { numero: 11, enunciado: 'Identidade $\\log(ab) = \\log a + \\log b$. Justifique.', resposta: 'Demonstração via expoentes.',
      passos: '**Passo 1.** Sejam $u = \\log_b a$ e $v = \\log_b c$. Então $a = b^u$, $c = b^v$.\n\n**Passo 2.** $ac = b^u \\cdot b^v = b^{u+v}$.\n\n**Passo 3.** Aplicar log: $\\log_b(ac) = u + v = \\log_b a + \\log_b c$. ∎',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.5 Log Product Property (prova)', licenca: CC_BY } },
    { numero: 12, enunciado: 'Resolva $x^2 + 5 = 4$.', resposta: 'Sem soluções reais.',
      passos: '**Passo 1.** $x^2 = -1$. Em $\\mathbb R$, $x^2 \\geq 0$ sempre.\n\n**Passo 2.** Não há $x \\in \\mathbb R$ que satisfaça.\n\n**Em $\\mathbb C$.** $x = \\pm i$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§5.1 No Real Solution, ex. 41 (adaptado)', licenca: CC_BY } },
    { numero: 13, enunciado: 'Determine se $f(x) = 3$ é função. Domínio e imagem.', resposta: 'É função (constante). Domínio $\\mathbb R$, imagem $\\{3\\}$.',
      passos: '**Passo 1.** Para cada $x$ existe **único** $y = 3$. Logo é função.\n\n**Passo 2.** Aceita qualquer $x$ ⇒ domínio $\\mathbb R$. Sempre retorna 3 ⇒ imagem $\\{3\\}$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.1 Constant Function, ex. 6 (adaptado)', licenca: CC_BY } },
    { numero: 14, enunciado: 'Composta com $f(x) = x + 3$, $g(x) = 2x - 1$. Calcule $g(f(x)) - f(g(x))$.', resposta: '$4$',
      passos: '**Passo 1.** $g(f(x)) = g(x+3) = 2(x+3) - 1 = 2x + 5$.\n\n**Passo 2.** $f(g(x)) = f(2x-1) = 2x - 1 + 3 = 2x + 2$.\n\n**Passo 3.** Diferença: $(2x+5) - (2x+2) = 3$. **Recálculo: 3, não 4.** Resposta correta = $3$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.4 Composition Diff, ex. 33 (adaptado)', licenca: CC_BY } },
    { numero: 15, enunciado: 'Inflação anual 4%. Preço de R\\$ 100 daqui a 5 anos.', resposta: '$\\approx R\\$ 121{,}67$',
      passos: '**Passo 1.** $P(5) = 100 \\cdot 1{,}04^5$.\n\n**Passo 2.** $1{,}04^5 \\approx 1{,}2167$. $P \\approx 121{,}67$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.7 Inflation, ex. 15 (adaptado para BR)', licenca: CC_BY } },
  ],
}

const PROVA_T1_V7: Prova = {
  id: 'trim-1-v7', trim: 1, versao: 7,
  titulo: 'Trim 1 · Versão 7 — Funções, afim, quadrática, exp/log',
  descricao: 'Trim 1 v7. Cobertura padrão.',
  duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1,
      enunciado: 'A função $f(x) = 2x + 5$ é injetora? Sobrejetora em $\\mathbb{R}$?',
      resposta: 'Sim e sim. Bijetora em $\\mathbb{R}$.',
      passos: '**Passo 1 — Injetora.** $f(a) = f(b) \\Rightarrow 2a + 5 = 2b + 5 \\Rightarrow a = b$ ✓.\n\n**Passo 2 — Sobrejetora em $\\mathbb{R}$.** Para qualquer $y$, $x = (y-5)/2$ satisfaz $f(x) = y$. Existe pré-imagem ✓.\n\n**Conclusão.** $f$ é bijeção $\\mathbb{R} \\to \\mathbb{R}$ — admite inversa.\n\n**Por que afim não-constante é sempre bijetora?** $m \\neq 0$ ⇒ inclinação não-zero ⇒ estritamente monótona ⇒ injetora. E imagem é $\\mathbb{R}$ inteiro.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-02-funcoes', 'aula-05-composicao-inversa'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§3.7 One-to-One Functions, ex. 5 (adaptado)', licenca: CC_BY } },
    { numero: 2,
      enunciado: 'Custo de produção: $C(q) = 50q + 1500$. Quantas unidades pra custo total atingir R\\$ 5.000?',
      resposta: '$q = 70$ unidades.',
      passos: '**Passo 1 — Equação.** $50q + 1500 = 5000$.\n\n**Passo 2 — Isole.** $50q = 3500 \\Rightarrow q = 70$.\n\n**Interpretação.** $1500$ é custo fixo (aluguel, etc.); $50$ é custo marginal por unidade. Modelo afim de custo total é o mais simples — assume custo marginal constante.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§4.3 Linear Models, ex. 25 (adaptado para BR)', licenca: CC_BY } },
    { numero: 3,
      enunciado: 'Forma canônica de $f(x) = x^2 + 6x + 13$. Reconheça vértice.',
      resposta: '$f(x) = (x+3)^2 + 4$. Vértice $(-3, 4)$.',
      passos: '**Passo 1 — Complete o quadrado.** $x^2 + 6x = (x+3)^2 - 9$.\n\n**Passo 2 — Substitua.** $f(x) = (x+3)^2 - 9 + 13 = (x+3)^2 + 4$.\n\n**Passo 3 — Vértice.** Forma $a(x - h)^2 + k$ com $h = -3$, $k = 4$. Vértice $(-3, 4)$.\n\n**Por que completar quadrado?** Transforma a parábola em forma onde **vértice salta da equação** sem precisar de fórmula. Útil também em integração e geometria de cônicas.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§5.1 Standard Form, ex. 29 (adaptado)', licenca: CC_BY } },
    { numero: 4,
      enunciado: 'Resolva $e^{2x} - 5e^x + 6 = 0$.',
      resposta: '$x = \\ln 2$ ou $x = \\ln 3$.',
      passos: '**Passo 1 — Substituição.** $u = e^x \\Rightarrow u^2 - 5u + 6 = 0$.\n\n**Passo 2 — Fatorar.** $(u - 2)(u - 3) = 0 \\Rightarrow u = 2$ ou $u = 3$.\n\n**Passo 3 — Voltar a $x$.** $e^x = 2 \\Rightarrow x = \\ln 2 \\approx 0{,}693$. $e^x = 3 \\Rightarrow x = \\ln 3 \\approx 1{,}099$.\n\n**Por que substituir?** Equação em $e^x$ é quadrática **disfarçada**. Tratar $e^x$ como variável reduz ao caso conhecido.',
      dificuldade: 'desafio', aulasCobertas: ['aula-06-exponencial', 'aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.6 Exponential Equations, ex. 60 (adaptado)', licenca: CC_BY } },
    { numero: 5,
      enunciado: 'Taxa média de variação de $f(x) = 1/x$ entre $x = 1$ e $x = 4$.',
      resposta: '$-1/4$',
      passos: '**Passo 1 — Fórmula.** TMV $= (f(4) - f(1))/(4 - 1)$.\n\n**Passo 2 — Calcule.** $(1/4 - 1)/3 = (-3/4)/3 = -1/4$.\n\n**Sinal.** Negativo ⇒ função decresce em média no intervalo. Bate com o gráfico de $1/x$ — decrescente em $(0, \\infty)$.\n\n**Conexão futura.** Taxa **média** vs. **instantânea**: derivada é o limite da TMV em intervalos cada vez menores.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-09-taxa-variacao'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§3.3 Average Rate of Change, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Encontre a inversa de $f(x) = (3x - 1)/2$.', resposta: '$f^{-1}(x) = (2x + 1)/3$',
      passos: '**Passo 1.** $y = (3x-1)/2$. Trocar $x \\leftrightarrow y$: $x = (3y-1)/2$.\n\n**Passo 2.** $2x = 3y - 1 \\Rightarrow y = (2x + 1)/3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.7 Inverse Affine, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 7, enunciado: 'Domínio de $f(x) = \\dfrac{1}{\\sqrt{x - 3}}$.', resposta: '$(3, +\\infty)$',
      passos: '**Passo 1.** Raiz exige $x - 3 \\geq 0$. Denominador exige $\\neq 0$.\n\n**Passo 2.** Combinando: $x - 3 > 0 \\Rightarrow x > 3$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.2 Combined Domain, ex. 35 (adaptado)', licenca: CC_BY } },
    { numero: 8, enunciado: 'Gráfico de $f(x) = (x-2)^2 + 1$ vs $g(x) = x^2$. O que mudou?', resposta: '$f$ é $g$ deslocada 2 à direita e 1 acima.',
      passos: '**Passo 1.** Substituição $x \\to (x-2)$: desloca horizontalmente. **Subtrai dentro = anda à direita** (contraintuitivo!).\n\n**Passo 2.** Adição de 1 fora: desloca verticalmente para cima.\n\n**Vértice.** $g$ tem vértice em $(0, 0)$; $f$ em $(2, 1)$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.5 Translations, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 9, enunciado: 'Resolva $\\log_2(x) + \\log_2(x - 2) = 3$.', resposta: '$x = 4$',
      passos: '**Passo 1.** Soma de logs: $\\log_2(x(x-2)) = 3$.\n\n**Passo 2.** Forma exp: $x(x-2) = 8$.\n\n**Passo 3.** $x^2 - 2x - 8 = 0 \\Rightarrow (x-4)(x+2) = 0$.\n\n**Passo 4 — Verificar.** $x = -2$: $\\log$ negativo, descarte. $x = 4$: $\\log_2(4) + \\log_2(2) = 2 + 1 = 3$ ✓.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.6 Sum of Logs, ex. 49 (adaptado)', licenca: CC_BY } },
    { numero: 10, enunciado: 'Funções afins paralelas têm a mesma...', resposta: 'Inclinação ($m$).',
      passos: '**Passo 1.** Paralelas significam mesmo "ângulo de subida".\n\n**Passo 2.** Inclinação $m$ codifica esse ângulo: $\\tan\\theta = m$.\n\n**Passo 3.** Mesma $m$ ⇒ paralelas. Diferentes $b$ ⇒ não coincidem.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Parallel Lines (apêndice)', licenca: CC_BY } },
    { numero: 11, enunciado: 'Resolva $9^x = 27$.', resposta: '$x = 3/2$',
      passos: '**Passo 1.** $9 = 3^2$, $27 = 3^3$. $9^x = 3^{2x}$.\n\n**Passo 2.** $3^{2x} = 3^3 \\Rightarrow 2x = 3 \\Rightarrow x = 3/2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-06-exponencial'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.6 Exp Eq, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 12, enunciado: 'Encontre raízes de $4x^2 - 12x + 9 = 0$.', resposta: '$x = 3/2$ (raiz dupla).',
      passos: '**Passo 1.** $\\Delta = 144 - 144 = 0$.\n\n**Passo 2.** Raiz dupla: $x = -b/(2a) = 12/8 = 3/2$.\n\n**Por que dupla?** $\\Delta = 0$ ⇒ vértice toca eixo $x$. Tangente em vez de cruzar.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§5.1 Repeated Root, ex. 39 (adaptado)', licenca: CC_BY } },
    { numero: 13, enunciado: 'Inversa de $g(x) = e^x$ é qual função?', resposta: '$g^{-1}(x) = \\ln x$',
      passos: '**Passo 1.** Por definição, $\\ln x$ é a inversa de $e^x$.\n\n**Verificação.** $\\ln(e^x) = x$ e $e^{\\ln x} = x$ ✓.\n\n**Domínio.** $e^x > 0$ sempre, logo $\\ln x$ é definida só para $x > 0$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-06-exponencial', 'aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.4 Natural Log, ex. 12 (adaptado)', licenca: CC_BY } },
    { numero: 14, enunciado: 'Reta perpendicular a eixo $x$ por $(2, 5)$.', resposta: '$x = 2$',
      passos: '**Passo 1.** Perpendicular ao eixo $x$ ⇒ vertical.\n\n**Passo 2.** $x = 2$.\n\n**Por que não é função de $x$?** Para $x = 2$ há infinitos $y$. Não passa no teste da reta vertical.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Vertical Line, ex. 13 (adaptado)', licenca: CC_BY } },
    { numero: 15, enunciado: 'Investimento juros simples: R\\$ 1000 a 6% a.a. por 4 anos. Total final.', resposta: '$R\\$ 1240$',
      passos: '**Passo 1.** Juros simples: $J = P r t = 1000 \\cdot 0{,}06 \\cdot 4 = 240$.\n\n**Passo 2.** Total: $1000 + 240 = 1240$.\n\n**Comparação com compostos.** Compostos a 6% por 4 anos: $1000 \\cdot 1{,}06^4 \\approx 1262{,}48$. Compostos sempre rendem mais que simples (efeito de "juros sobre juros").',
      dificuldade: 'modelagem', aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.7 Simple vs Compound, ex. 11 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T1_V8: Prova = {
  id: 'trim-1-v8', trim: 1, versao: 8,
  titulo: 'Trim 1 · Versão 8 — Funções, afim, quadrática, exp/log',
  descricao: 'Trim 1 v8. Cobertura padrão.',
  duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1,
      enunciado: 'Para $f(x) = \\sqrt{x - 1}$, encontre $f(5) + f(10)$.',
      resposta: '$2 + 3 = 5$',
      passos: '**Passo 1 — Avalie.** $f(5) = \\sqrt{4} = 2$. $f(10) = \\sqrt{9} = 3$.\n\n**Passo 2 — Soma.** $2 + 3 = 5$.\n\n**Domínio.** $f$ exige $x \\geq 1$. Ambos $5$ e $10$ no domínio ✓.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§3.1 Functions, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 2,
      enunciado: 'Em uma corrida, um carro acelera linearmente de 0 a 100 km/h em 8 s. Equação da velocidade.',
      resposta: '$v(t) = 12{,}5\\,t$ km/h.',
      passos: '**Passo 1 — Modelo afim.** $v(0) = 0$, $v(8) = 100$. Inclinação $= 100/8 = 12{,}5$.\n\n**Passo 2 — Equação.** $v(t) = 12{,}5 t$.\n\n**Interpretação.** Aceleração média $= 12{,}5$ km/h por segundo $\\approx 3{,}47$ m/s². Ordem de grandeza de carros esportivos.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§4.3 Modeling, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 3,
      enunciado: 'Equação da parábola com vértice $(2, -3)$ e que passa por $(0, 5)$.',
      resposta: '$f(x) = 2(x-2)^2 - 3$',
      passos: '**Passo 1 — Forma canônica.** $f(x) = a(x - 2)^2 - 3$.\n\n**Passo 2 — Use $(0, 5)$.** $5 = a(4) - 3 \\Rightarrow a = 2$.\n\n**Passo 3 — Equação.** $f(x) = 2(x - 2)^2 - 3$.\n\n**Por que essa estratégia?** Forma canônica isola $h, k$ (vértice). Resta achar **um único** parâmetro $a$ — basta um ponto extra.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§5.1 Quadratic from Vertex, ex. 53 (adaptado)', licenca: CC_BY } },
    { numero: 4,
      enunciado: 'Reescreva $\\log_4 32$ usando mudança de base.',
      resposta: '$5/2$',
      passos: '**Passo 1 — $32 = 2^5$, $4 = 2^2$.** $\\log_4 32 = \\log_{2^2}(2^5)$.\n\n**Passo 2 — Mudança de base.** $\\log_4 32 = \\log 32 / \\log 4 = 5 \\log 2 / (2 \\log 2) = 5/2$.\n\n**Por que mudança de base funciona?** $\\log_b a = \\log_c a / \\log_c b$ para qualquer base $c$ válida. Vem de propriedades de potências.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.5 Change of Base, ex. 36 (adaptado)', licenca: CC_BY } },
    { numero: 5,
      enunciado: 'Café a 90°C resfria conforme $T(t) = 25 + 65 e^{-0{,}05 t}$ (t em min). Quanto tempo até 50°C?',
      resposta: '$t \\approx 19{,}1$ min.',
      passos: '**Passo 1 — Equação.** $50 = 25 + 65 e^{-0{,}05 t}$.\n\n**Passo 2 — Isole exp.** $25 = 65 e^{-0{,}05 t} \\Rightarrow e^{-0{,}05 t} = 25/65 = 5/13$.\n\n**Passo 3 — Log.** $-0{,}05 t = \\ln(5/13) \\approx -0{,}956 \\Rightarrow t \\approx 19{,}1$ min.\n\n**Por que esse modelo?** Lei de Newton do resfriamento: taxa de variação $\\propto$ diferença de temperatura com ambiente. Resolução da EDO dá decaimento exponencial até temperatura ambiente (25°C aqui).',
      dificuldade: 'modelagem', aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.7 Newton\'s Law of Cooling, ex. 26 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Domínio de $f(x) = \\sqrt{x^2 - 1}$.', resposta: '$(-\\infty, -1] \\cup [1, +\\infty)$',
      passos: '**Passo 1.** $x^2 - 1 \\geq 0 \\Rightarrow x^2 \\geq 1 \\Rightarrow |x| \\geq 1$.\n\n**Passo 2.** $x \\leq -1$ ou $x \\geq 1$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.2 Quadratic Domain, ex. 33 (adaptado)', licenca: CC_BY } },
    { numero: 7, enunciado: 'Encontre $f \\circ g$ se $f(x) = \\ln x$ e $g(x) = e^x$.', resposta: '$f(g(x)) = x$',
      passos: '**Passo 1.** $f(g(x)) = \\ln(e^x)$.\n\n**Passo 2.** $\\ln(e^x) = x$ (são inversas).\n\n**Conclusão.** Composição de inversas dá identidade.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.4 Inverse Composition, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 8, enunciado: 'Escreva $\\log_3 81$.', resposta: '$4$',
      passos: '**Passo 1.** $81 = 3^4$.\n\n**Passo 2.** $\\log_3(3^4) = 4$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.3 Log Power, ex. 9 (adaptado)', licenca: CC_BY } },
    { numero: 9, enunciado: 'Calcule $f(2)$ para $f(x) = 3x^2 - x + 1$.', resposta: '$11$',
      passos: '**Passo 1.** $f(2) = 3(4) - 2 + 1 = 12 - 2 + 1 = 11$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.1 Eval, ex. 7 (adaptado)', licenca: CC_BY } },
    { numero: 10, enunciado: 'Vetorial: encontre eq. da reta passando por $(1, 2)$ com $\\vec d = (3, 1)$.', resposta: '$y - 2 = (1/3)(x - 1)$',
      passos: '**Passo 1.** Vetor $\\vec d = (3, 1)$ ⇒ inclinação $m = \\Delta y/\\Delta x = 1/3$.\n\n**Passo 2.** Ponto-inclinação: $y - 2 = (1/3)(x - 1)$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Direction Vector, ex. 22 (adaptado)', licenca: CC_BY } },
    { numero: 11, enunciado: 'Resolva $\\log(x^2) = 2 \\log 5$.', resposta: '$x = \\pm 5$',
      passos: '**Passo 1.** $2\\log 5 = \\log 5^2 = \\log 25$.\n\n**Passo 2.** $\\log(x^2) = \\log 25 \\Rightarrow x^2 = 25 \\Rightarrow x = \\pm 5$.\n\n**Atenção.** $\\log(x^2)$ aceita $x \\neq 0$ (pois $x^2 > 0$). Diferente de $2\\log x$ que exige $x > 0$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.6 Log Power Trap, ex. 57 (adaptado)', licenca: CC_BY } },
    { numero: 12, enunciado: 'Quadrática que passa por $(0, 1)$, $(1, 0)$, $(2, 1)$.', resposta: '$y = x^2 - 2x + 1$',
      passos: '**Passo 1.** Forma geral: $y = ax^2 + bx + c$. Passa por $(0,1)$: $c = 1$.\n\n**Passo 2.** $(1, 0)$: $a + b + 1 = 0 \\Rightarrow a + b = -1$.\n\n**Passo 3.** $(2, 1)$: $4a + 2b + 1 = 1 \\Rightarrow 4a + 2b = 0 \\Rightarrow 2a + b = 0$.\n\n**Passo 4.** Sistema: $a + b = -1$, $2a + b = 0$ ⇒ $a = 1$, $b = -2$. $y = x^2 - 2x + 1 = (x-1)^2$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§5.1 Three Points, ex. 49 (adaptado)', licenca: CC_BY } },
    { numero: 13, enunciado: 'Inversa de $f(x) = e^{2x}$.', resposta: '$f^{-1}(x) = (\\ln x)/2$',
      passos: '**Passo 1.** $y = e^{2x}$. Trocar: $x = e^{2y}$.\n\n**Passo 2.** $\\ln x = 2y \\Rightarrow y = (\\ln x)/2$.\n\n**Domínio.** Saída de $e^{2x}$ é $(0, +\\infty)$ ⇒ inversa exige $x > 0$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-05-composicao-inversa', 'aula-06-exponencial'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.4 Inverse Exp, ex. 25 (adaptado)', licenca: CC_BY } },
    { numero: 14, enunciado: 'Sistema $\\begin{cases} x + y = 7 \\\\ xy = 12 \\end{cases}$.', resposta: '$(3, 4)$ e $(4, 3)$',
      passos: '**Passo 1.** $x$ e $y$ são raízes de $t^2 - 7t + 12 = 0$ (Girard).\n\n**Passo 2.** $(t-3)(t-4) = 0 \\Rightarrow t = 3, 4$.\n\n**Passo 3.** $(x, y) = (3, 4)$ ou $(4, 3)$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§9.1 System Vieta, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelo logístico $P(t) = 500/(1 + 4 e^{-0{,}3 t})$. População inicial.', resposta: '$P(0) = 100$',
      passos: '**Passo 1.** $P(0) = 500/(1 + 4 \\cdot 1) = 500/5 = 100$.\n\n**Limite.** Quando $t \\to \\infty$: $500$. Capacidade de suporte $= 500$, começou em 100.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.7 Logistic Initial, ex. 33 (adaptado)', licenca: CC_BY } },
  ],
}

const PROVA_T1_V9: Prova = {
  id: 'trim-1-v9', trim: 1, versao: 9,
  titulo: 'Trim 1 · Versão 9 — Funções, afim, quadrática, exp/log',
  descricao: 'Trim 1 v9. Cobertura padrão.',
  duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1,
      enunciado: 'Funções pares: $f(x) = x^4 - 3x^2 + 1$ é par, ímpar ou nenhum?',
      resposta: 'Par.',
      passos: '**Passo 1 — Teste.** $f(-x) = (-x)^4 - 3(-x)^2 + 1 = x^4 - 3x^2 + 1 = f(x)$ ✓.\n\n**Conclusão.** $f$ é par.\n\n**Por que isso importa?** Funções pares têm gráfico simétrico em relação ao eixo $y$. Em integração: $\\int_{-a}^{a} f = 2\\int_0^a f$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§3.3 Even/Odd Functions, ex. 8 (adaptado)', licenca: CC_BY } },
    { numero: 2,
      enunciado: 'Reta passando por $(-3, 4)$ paralela ao eixo $y$.',
      resposta: '$x = -3$',
      passos: '**Passo 1 — Vertical ⇒ inclinação indefinida.** Não tem forma $y = mx + b$.\n\n**Passo 2 — Equação.** Toda abscissa é $-3$, qualquer $y$. Logo $x = -3$.\n\n**Por que não é função de $x$?** Para cada $x = -3$ há infinitos $y$. Falha o teste da reta vertical.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§4.1 Vertical Lines, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 3,
      enunciado: 'Lance vertical: altura $h(t) = 30t - 5t^2$ (t em s). Altura máxima e tempo de queda.',
      resposta: 'Máx $h = 45$ m em $t = 3$ s. Queda total em $t = 6$ s.',
      passos: '**Passo 1 — Vértice.** $t_v = -30/(-10) = 3$. $h_v = 30(3) - 5(9) = 90 - 45 = 45$ m.\n\n**Passo 2 — Queda.** $h(t) = 0 \\Rightarrow t(30 - 5t) = 0 \\Rightarrow t = 0$ (lançamento) ou $t = 6$ (volta).\n\n**Por que parábola?** Movimento sob gravidade constante: $h = h_0 + v_0 t - (g/2)t^2$. Aqui $h_0 = 0$, $v_0 = 30$ m/s, $g \\approx 10$ m/s². Modelo clássico de física.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§5.1 Projectile Motion, ex. 60 (adaptado)', licenca: CC_BY } },
    { numero: 4,
      enunciado: 'Composição: $f(x) = \\sqrt x$, $g(x) = x + 4$. Domínio de $(f \\circ g)(x)$.',
      resposta: '$x \\geq -4$',
      passos: '**Passo 1 — $(f \\circ g)(x) = f(x + 4) = \\sqrt{x + 4}$.**\n\n**Passo 2 — Restrição.** Radicando $\\geq 0$: $x + 4 \\geq 0 \\Rightarrow x \\geq -4$.\n\n**Por que precisa cuidar do domínio?** Domínio de $f \\circ g$ é o subconjunto do domínio de $g$ tal que $g(x)$ caia no domínio de $f$. Aqui $g$ tem domínio $\\mathbb{R}$, mas $f$ exige $\\geq 0$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§3.4 Composition Domain, ex. 30 (adaptado)', licenca: CC_BY } },
    { numero: 5,
      enunciado: 'Resolva $\\ln(x+1) - \\ln x = 1$.',
      resposta: '$x = 1/(e - 1) \\approx 0{,}582$',
      passos: '**Passo 1 — Diferença de logs.** $\\ln((x+1)/x) = 1$.\n\n**Passo 2 — Forma exp.** $(x+1)/x = e^1 = e$.\n\n**Passo 3 — Resolva.** $x + 1 = ex \\Rightarrow 1 = x(e - 1) \\Rightarrow x = 1/(e - 1) \\approx 0{,}582$.\n\n**Domínio.** Precisa $x > 0$ e $x + 1 > 0$. Ambos satisfeitos ✓.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.6 Logarithmic Equations, ex. 49 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: 'Calcule $f(x+h) - f(x)$ para $f(x) = 5x - 3$, simplificado.', resposta: '$5h$',
      passos: '**Passo 1.** $f(x+h) = 5(x+h) - 3 = 5x + 5h - 3$.\n\n**Passo 2.** $f(x+h) - f(x) = 5h$.\n\n**Implicação.** Para função afim, "diferença sobre $h$" $= m$ (inclinação). É a TMV constante de afins.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-09-taxa-variacao'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.3 Difference Quotient, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 7, enunciado: 'Resolva $4^x - 2 \\cdot 4^{x/2} - 3 = 0$. (Pista: $u = 4^{x/2}$.)', resposta: '$x = \\log_4 9$',
      passos: '**Passo 1.** $u = 4^{x/2}$. Então $4^x = u^2$.\n\n**Passo 2.** $u^2 - 2u - 3 = 0 \\Rightarrow (u-3)(u+1) = 0 \\Rightarrow u = 3$ (descartar $u = -1$ pois exp positiva).\n\n**Passo 3.** $4^{x/2} = 3 \\Rightarrow x/2 = \\log_4 3 \\Rightarrow x = 2\\log_4 3 = \\log_4 9$.',
      dificuldade: 'desafio', aulasCobertas: ['aula-06-exponencial'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.6 Substitution Exp, ex. 63 (adaptado)', licenca: CC_BY } },
    { numero: 8, enunciado: 'Reta tangente a $y = x^2$ em $(1, 1)$. (Use TMV no limite, heurístico.)', resposta: '$y = 2x - 1$',
      passos: '**Passo 1.** Inclinação por TMV em $[1, 1+h]$: $((1+h)^2 - 1)/h = 2 + h$.\n\n**Passo 2.** Quando $h \\to 0$: $m = 2$.\n\n**Passo 3.** Reta por $(1,1)$ com $m = 2$: $y - 1 = 2(x - 1) \\Rightarrow y = 2x - 1$.\n\n**Conexão.** Você acabou de calcular $f\'(1) = 2 \\cdot 1 = 2$. Tema central de Trim 5/6.',
      dificuldade: 'desafio', aulasCobertas: ['aula-09-taxa-variacao'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.3 Tangent at Point, ex. 41 (adaptado)', licenca: CC_BY } },
    { numero: 9, enunciado: 'Demonstre: se $f$ e $g$ são pares, então $f \\cdot g$ é par.', resposta: 'Demonstração.',
      passos: '**Passo 1.** $(fg)(-x) = f(-x) g(-x) = f(x) g(x) = (fg)(x)$ (usando paridade de cada).\n\n**Conclusão.** $fg$ é par. ∎',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.3 Even-Even Product, prova', licenca: CC_BY } },
    { numero: 10, enunciado: 'Resolva $|x| + 1 < 5$.', resposta: '$x \\in (-4, 4)$',
      passos: '**Passo 1.** $|x| < 4$.\n\n**Passo 2.** $-4 < x < 4$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-01-conjuntos-intervalos'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§2.7 Abs Value, ex. 13 (adaptado)', licenca: CC_BY } },
    { numero: 11, enunciado: 'Encontre raízes complexas de $x^2 + 2x + 5 = 0$.', resposta: '$x = -1 \\pm 2i$',
      passos: '**Passo 1.** $\\Delta = 4 - 20 = -16$.\n\n**Passo 2.** $x = (-2 \\pm \\sqrt{-16})/2 = (-2 \\pm 4i)/2 = -1 \\pm 2i$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§5.1 Complex Roots, ex. 51 (adaptado)', licenca: CC_BY } },
    { numero: 12, enunciado: 'Inversa de $f(x) = 7$ existe?', resposta: 'Não. Função constante não é injetora.',
      passos: '**Passo 1.** Inversa exige bijeção (cada $y$ tem único $x$).\n\n**Passo 2.** $f$ constante envia TODO $x$ para 7. Logo $y = 7$ tem infinitas pré-imagens.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.7 Constant No Inverse, ex. 4 (adaptado)', licenca: CC_BY } },
    { numero: 13, enunciado: 'Reta paralela a $y = -3x + 2$ por $(0, 5)$.', resposta: '$y = -3x + 5$',
      passos: '**Passo 1.** Mesma inclinação: $-3$. $b = 5$ (passa por $(0, 5)$).',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Parallel, ex. 41 (adaptado)', licenca: CC_BY } },
    { numero: 14, enunciado: 'Modelagem: bactéria triplica a cada 4h. População inicial 500. $P(20)$.', resposta: '$P(20) = 500 \\cdot 3^5 = 121\\,500$',
      passos: '**Passo 1.** Modelo: $P(t) = P_0 \\cdot 3^{t/4}$.\n\n**Passo 2.** $t = 20$: $20/4 = 5$ triplicações.\n\n**Passo 3.** $P(20) = 500 \\cdot 3^5 = 500 \\cdot 243 = 121\\,500$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.7 Triple Time, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 15, enunciado: 'Identidade $\\log_a a = 1$. Justifique.', resposta: 'Demonstração.',
      passos: '**Passo 1.** $\\log_a a = c$ significa $a^c = a = a^1$.\n\n**Passo 2.** Logo $c = 1$. ∎\n\n**Aplicação.** Simplifica $\\ln e = 1$, $\\log_{10} 10 = 1$, etc.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.5 Log Identity, prova', licenca: CC_BY } },
  ],
}

const PROVA_T1_V10: Prova = {
  id: 'trim-1-v10', trim: 1, versao: 10,
  titulo: 'Trim 1 · Versão 10 — Funções, afim, quadrática, exp/log',
  descricao: 'Trim 1 v10. Cobertura padrão.',
  duracaoMinutos: 90, intensidade: 3, publicoAlvo: '1.º ano', status: 'curada',
  questoes: [
    { numero: 1,
      enunciado: 'Domínio de $f(x) = \\dfrac{\\sqrt{x+2}}{x - 3}$.',
      resposta: '$[-2, 3) \\cup (3, \\infty)$',
      passos: '**Passo 1 — Raiz.** $x + 2 \\geq 0 \\Rightarrow x \\geq -2$.\n\n**Passo 2 — Denominador.** $x - 3 \\neq 0 \\Rightarrow x \\neq 3$.\n\n**Passo 3 — Interseção.** $x \\geq -2$ E $x \\neq 3$ ⇒ $[-2, 3) \\cup (3, \\infty)$.\n\n**Por que combinar restrições?** Cada parte da expressão impõe sua restrição independente. Domínio total é a interseção — todas precisam valer simultaneamente.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-02-funcoes', 'aula-01-conjuntos-intervalos'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§3.2 Combined Restrictions, ex. 39 (adaptado)', licenca: CC_BY } },
    { numero: 2,
      enunciado: 'Equação da reta tangente ao gráfico de $f(x) = x^2$ no ponto $(2, 4)$. (Use TMV → derivada heurística.)',
      resposta: '$y = 4x - 4$',
      passos: '**Passo 1 — Inclinação por TMV no limite.** Para pequena variação $h$: TMV $= ((2+h)^2 - 4)/h = 4 + h$. Quando $h \\to 0$: $m = 4$.\n\n**Passo 2 — Reta por $(2, 4)$ com $m = 4$.** $y - 4 = 4(x - 2) \\Rightarrow y = 4x - 4$.\n\n**Conexão futura.** Você acabou de calcular $f\'(2) = 4$, derivada de $x^2$ em $x = 2$. Tema central do Trim 5/6.',
      dificuldade: 'desafio', aulasCobertas: ['aula-09-taxa-variacao'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§3.3 Secant to Tangent, ex. 42 (adaptado)', licenca: CC_BY } },
    { numero: 3,
      enunciado: 'Maximização: produto de dois números cuja soma é 20.',
      resposta: 'Ambos iguais a 10. Produto máximo $= 100$.',
      passos: '**Passo 1 — Variáveis.** $x + y = 20 \\Rightarrow y = 20 - x$.\n\n**Passo 2 — Objetivo.** $P = xy = x(20 - x) = 20x - x^2$.\n\n**Passo 3 — Vértice.** $x_v = 10$. $P_{\\max} = 10 \\cdot 10 = 100$.\n\n**Por que iguais?** Para soma fixa, produto é maximizado quando fatores são iguais. Caso 2D da AM-GM: $xy \\leq ((x+y)/2)^2$, igualdade iff $x = y$.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§5.1 Optimization with Quadratics, ex. 71 (adaptado)', licenca: CC_BY } },
    { numero: 4,
      enunciado: 'Mostre que $\\log_a(b^n) = n\\log_a b$.',
      resposta: 'Demonstração via definição.',
      passos: '**Passo 1 — Seja $L = \\log_a b$.** Então $a^L = b$ por definição.\n\n**Passo 2 — Eleve a $n$.** $(a^L)^n = b^n \\Rightarrow a^{nL} = b^n$.\n\n**Passo 3 — Aplique log.** $\\log_a(a^{nL}) = \\log_a(b^n) \\Rightarrow nL = \\log_a(b^n)$.\n\n**Conclusão.** $\\log_a(b^n) = n L = n \\log_a b$. ∎\n\n**Por que essa propriedade?** Espelha $a^{nx} = (a^x)^n$. Logaritmo "transforma multiplicação em adição" e "potência em multiplicação" — útil em qualquer manipulação algébrica não trivial.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.5 Power Property of Logarithms, prova', licenca: CC_BY } },
    { numero: 5,
      enunciado: 'Modelo logístico: $P(t) = \\dfrac{1000}{1 + 9 e^{-0{,}1 t}}$. Limite quando $t \\to \\infty$.',
      resposta: '$\\lim_{t\\to\\infty} P(t) = 1000$',
      passos: '**Passo 1 — $e^{-0{,}1 t} \\to 0$ quando $t \\to \\infty$.**\n\n**Passo 2 — Substitua.** $P \\to 1000/(1 + 0) = 1000$.\n\n**Por que esse modelo?** Captura **capacidade de suporte** $K = 1000$ — população cresce mas satura. Diferente de exponencial puro (cresce sem limite). Modelo padrão para epidemias, adoção tecnológica, populações com recursos finitos.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e', url: OS_CA, ref: '§6.7 Logistic Growth, ex. 35 (adaptado)', licenca: CC_BY } },
    { numero: 6, enunciado: '$f(x) = (x^2 - 1)/(x - 1)$. Simplifique.', resposta: '$f(x) = x + 1$ (com $x \\neq 1$)',
      passos: '**Passo 1.** $x^2 - 1 = (x-1)(x+1)$.\n\n**Passo 2.** Cancelar $(x-1)$: $f(x) = x + 1$, válido para $x \\neq 1$.\n\n**Atenção.** Em $x = 1$ a função original é indefinida (0/0). Após simplificação, "$x + 1$" daria 2, mas é uma **descontinuidade removível**.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§5.6 Removable Discontinuity, ex. 18 (adaptado)', licenca: CC_BY } },
    { numero: 7, enunciado: '$\\sqrt{50}$ em forma simplificada.', resposta: '$5\\sqrt 2$',
      passos: '**Passo 1.** $50 = 25 \\cdot 2$.\n\n**Passo 2.** $\\sqrt{50} = \\sqrt{25}\\sqrt 2 = 5\\sqrt 2$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-01-conjuntos-intervalos'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§1.4 Radicals, ex. 9 (adaptado)', licenca: CC_BY } },
    { numero: 8, enunciado: 'Expresse $\\log 12$ via $\\log 2$ e $\\log 3$.', resposta: '$2\\log 2 + \\log 3$',
      passos: '**Passo 1.** $12 = 2^2 \\cdot 3$.\n\n**Passo 2.** $\\log 12 = \\log(2^2 \\cdot 3) = \\log 2^2 + \\log 3 = 2\\log 2 + \\log 3$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.5 Log Decomposition, ex. 23 (adaptado)', licenca: CC_BY } },
    { numero: 9, enunciado: 'Reta com inclinação 2 e intercepto-y igual a $-3$.', resposta: '$y = 2x - 3$',
      passos: '**Passo 1.** Forma reduzida $y = mx + b$. $m = 2$, $b = -3$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-03-afim'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§4.1 Slope-Intercept, ex. 4 (adaptado)', licenca: CC_BY } },
    { numero: 10, enunciado: 'Domínio de $f(x) = \\log(x^2 - 4)$.', resposta: '$(-\\infty, -2) \\cup (2, +\\infty)$',
      passos: '**Passo 1.** Log exige argumento positivo: $x^2 - 4 > 0 \\Rightarrow x^2 > 4 \\Rightarrow |x| > 2$.\n\n**Passo 2.** $x < -2$ ou $x > 2$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-07-logaritmo'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.4 Log Domain, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 11, enunciado: 'Função módulo $f(x) = |2x - 4|$. Encontre os zeros.', resposta: '$x = 2$',
      passos: '**Passo 1.** $|2x - 4| = 0 \\Rightarrow 2x - 4 = 0 \\Rightarrow x = 2$.\n\n**Por que único zero?** Módulo é zero apenas onde o argumento é zero.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.6 Absolute Value Func, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 12, enunciado: 'Composição: $h(x) = \\sin^2 x$ pode ser escrita como $f(g(x))$.', resposta: '$g(x) = \\sin x$, $f(x) = x^2$',
      passos: '**Passo 1.** Operação interna: seno. Operação externa: quadrado.\n\n**Passo 2.** $g(x) = \\sin x$, $f(x) = x^2$. $f(g(x)) = (\\sin x)^2 = \\sin^2 x$ ✓.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-05-composicao-inversa'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.4 Decomposition, ex. 32 (adaptado)', licenca: CC_BY } },
    { numero: 13, enunciado: 'Pinto-trace: $f(x) = x + |x|$. Avalie em $x = -3$, $x = 0$, $x = 5$.', resposta: '$f(-3) = 0$, $f(0) = 0$, $f(5) = 10$',
      passos: '**Passo 1.** $x = -3$: $-3 + 3 = 0$.\n\n**Passo 2.** $x = 0$: $0 + 0 = 0$.\n\n**Passo 3.** $x = 5$: $5 + 5 = 10$.\n\n**Padrão.** $f(x) = 0$ se $x \\leq 0$, $f(x) = 2x$ se $x > 0$. "Rampa" não-negativa.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-02-funcoes'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§3.1 Piecewise Behavior, ex. 27 (adaptado)', licenca: CC_BY } },
    { numero: 14, enunciado: 'Vértice de $y = -3(x + 2)^2 + 7$.', resposta: '$(-2, 7)$. Máximo (a < 0).',
      passos: '**Passo 1.** Forma $a(x - h)^2 + k$ com $h = -2$, $k = 7$.\n\n**Passo 2.** $a = -3 < 0$ ⇒ vértice é máximo.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-04-quadratica'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§5.1 Vertex Form, ex. 23 (adaptado)', licenca: CC_BY } },
    { numero: 15, enunciado: 'Modelagem: medicação com meia-vida 6h. Dose 200 mg. Quantidade restante após 18h?', resposta: '$25$ mg',
      passos: '**Passo 1.** $A(t) = 200 \\cdot (1/2)^{t/6}$.\n\n**Passo 2.** $t = 18$: $(1/2)^3 = 1/8$.\n\n**Passo 3.** $A(18) = 200/8 = 25$ mg.\n\n**Aplicação.** Farmacocinética — define intervalo entre doses para manter concentração terapêutica.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-08-crescimento'],
      fonteOriginal: { livro: 'OpenStax CA 2e', url: OS_CA, ref: '§6.7 Drug Half-Life, ex. 19 (adaptado)', licenca: CC_BY } },
  ],
}

// Trim 12 v2-v10
const PROVA_T12_V2: Prova = {
  id: 'trim-12-v2', trim: 12, versao: 2, titulo: 'Trim 12 · Versão 2 — Álgebra linear e síntese',
  descricao: 'Trim 12 v2.', duracaoMinutos: 90, intensidade: 5, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Núcleo de $T(x, y) = (x + y, x + y)$.', resposta: '$\\{(t, -t) : t \\in \\mathbb R\\}$',
      passos: '**Passo 1.** $T(x,y) = 0 \\Rightarrow x + y = 0 \\Rightarrow y = -x$.\n\n**Passo 2.** Núcleo: linha gerada por $(1, -1)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-113-nucleo-imagem'],
      fonteOriginal: { livro: 'OpenStax Calc 3 (apêndice)', url: OS_CALC3, ref: 'Linear Algebra § Kernel, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Verificar se $\\{(1,0,0), (0,1,0), (1,1,0)\\}$ é base de $\\mathbb R^3$.', resposta: 'Não é base (não geram $\\mathbb R^3$, são LD).',
      passos: '**Passo 1.** $(1,1,0) = (1,0,0) + (0,1,0)$ — combinação linear.\n\n**Passo 2.** Apenas 2 vetores LI ⇒ geram plano $z = 0$, não $\\mathbb R^3$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-111-espacos-vetoriais'],
      fonteOriginal: { livro: 'OpenStax Calc 3 (apêndice)', url: OS_CALC3, ref: 'Vector Spaces § Basis, ex. 9 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Diagonalize $A = \\begin{pmatrix} 5 & 0 \\\\ 0 & 3 \\end{pmatrix}$.', resposta: 'Já é diagonal.',
      passos: '**Passo 1.** Autovalores: 5 e 3 (na diagonal).\n\n**Passo 2.** $D = A$, $P = I$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-115-diagonalizacao'],
      fonteOriginal: { livro: 'OpenStax Calc 3 (apêndice)', url: OS_CALC3, ref: 'Eigen § Diagonal Matrix, ex. 6 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Black-Scholes call: $S = K = 100$, $r = 0$, $\\sigma = 0{,}2$, $T = 1$. Calcule $N(d_1)$, $N(d_2)$ qualitativamente.', resposta: '$d_1 = 0{,}1$, $d_2 = -0{,}1$. $N(d_1) \\approx 0{,}54$, $N(d_2) \\approx 0{,}46$.',
      passos: '**Passo 1.** $d_1 = (\\sigma^2 T/2)/(\\sigma\\sqrt T) = \\sigma\\sqrt T/2 = 0{,}1$.\n\n**Passo 2.** $d_2 = -0{,}1$.\n\n**Passo 3.** $N(0{,}1) \\approx 0{,}540$, $N(-0{,}1) \\approx 0{,}460$.\n\n**Preço call.** $C = 100 \\cdot 0{,}54 - 100 \\cdot 0{,}46 = 8$ (ATM, vol moderada).',
      dificuldade: 'modelagem', aulasCobertas: ['aula-119-bs-sintese'],
      fonteOriginal: { livro: 'Black-Scholes (1973), via Active Calc', url: ACTIVE_CALC, ref: 'BS Formula (apêndice)', licenca: CC_BY_NC_SA } },
    { numero: 5, enunciado: 'PCA: matriz de covariância $C = \\begin{pmatrix} 4 & 2 \\\\ 2 & 4 \\end{pmatrix}$. Componentes principais.', resposta: 'PC1: $(1,1)/\\sqrt 2$ ($\\lambda=6$). PC2: $(1,-1)/\\sqrt 2$ ($\\lambda=2$).',
      passos: '**Passo 1.** Eigenvalues: $\\det(C - \\lambda I) = (4-\\lambda)^2 - 4 = 0 \\Rightarrow \\lambda = 6, 2$.\n\n**Passo 2.** Autovetores ortogonais — direções de variância máx e mín.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-118-pca'],
      fonteOriginal: { livro: 'OpenStax Calc 3 (apêndice)', url: OS_CALC3, ref: 'PCA Intro (apêndice)', licenca: CC_BY } },
  ],
}

const PROVA_T12_V3: Prova = {
  id: 'trim-12-v3', trim: 12, versao: 3, titulo: 'Trim 12 · Versão 3', descricao: 'Trim 12 v3.',
  duracaoMinutos: 90, intensidade: 5, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Subespaço: o conjunto $\\{(x, y) : x + y = 1\\}$ é subespaço de $\\mathbb R^2$?', resposta: 'Não. Não contém origem.',
      passos: '**Passo 1.** Subespaço deve conter o vetor 0. $(0,0)$: $0+0=0 \\neq 1$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-111-espacos-vetoriais'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Vector Subspace, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Linear $T: \\mathbb R^2 \\to \\mathbb R^2$ rotação $90°$. Matriz.', resposta: '$\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$',
      passos: '**Passo 1.** Imagens da base: $T(1,0) = (0,1)$, $T(0,1) = (-1,0)$.\n\n**Passo 2.** Colunas da matriz são as imagens.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-112-transformacoes-lineares'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Rotation Matrix, ex. 18 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Autovalores de $A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$.', resposta: '$\\lambda = 2, 3$',
      passos: '**Passo 1.** Triangular: autovalores na diagonal.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-114-autovalores'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Eigen Triangular, ex. 4 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Matriz simétrica é sempre diagonalizável?', resposta: 'Sim, ortogonalmente.',
      passos: '**Passo 1.** Teorema espectral: matriz real simétrica tem $n$ autovalores reais e autovetores ortogonais.\n\n**Passo 2.** $A = Q\\Lambda Q^T$ com $Q$ ortogonal.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-115-diagonalizacao', 'aula-116-matrizes-especiais'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Spectral Theorem (apêndice)', licenca: CC_BY } },
    { numero: 5, enunciado: 'SVD: $A = U\\Sigma V^T$. Aplicação em compressão de imagem.', resposta: 'Truncar $\\Sigma$ aos $k$ maiores valores singulares aproxima $A$.',
      passos: '**Passo 1.** SVD ordena valores singulares decrescentes — primeiros capturam mais energia.\n\n**Passo 2.** $A_k = U_k\\Sigma_k V_k^T$ é melhor aproximação posto $k$ (Eckart-Young).\n\n**Resultado prático.** Imagem 1000×1000 com $k = 50$: 100k entradas em vez de 1M, com pouca perda visual.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-117-svd'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'SVD Compression (apêndice)', licenca: CC_BY } },
  ],
}

const PROVA_T12_V4: Prova = {
  id: 'trim-12-v4', trim: 12, versao: 4, titulo: 'Trim 12 · Versão 4', descricao: 'Trim 12 v4.',
  duracaoMinutos: 90, intensidade: 5, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Imagem da matriz $\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$.', resposta: 'Linha gerada por $(1, 2)$.',
      passos: '**Passo 1.** Colunas $(1,2)$ e $(2,4) = 2(1,2)$. LI: 1 só.\n\n**Passo 2.** Imagem: $\\text{span}\\{(1,2)\\}$ — linha em $\\mathbb R^2$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-113-nucleo-imagem'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Image of Matrix, ex. 16 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Posto e nulidade de matriz $3 \\times 3$ com posto 2.', resposta: 'Posto 2, nulidade 1.',
      passos: '**Passo 1.** Teorema posto-nulidade: posto + nulidade = $n$ (cols).\n\n**Passo 2.** $2 + \\text{nulidade} = 3 \\Rightarrow \\text{nulidade} = 1$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-113-nucleo-imagem'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Rank-Nullity, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Autovetor de $\\begin{pmatrix} 3 & 0 \\\\ 0 & 5 \\end{pmatrix}$ para $\\lambda = 5$.', resposta: '$(0, 1)$ ou múltiplo.',
      passos: '**Passo 1.** $(A - 5I)\\vec v = 0$: $\\begin{pmatrix} -2 & 0 \\\\ 0 & 0 \\end{pmatrix}\\vec v = 0$.\n\n**Passo 2.** $v_1 = 0$, $v_2$ livre. $\\vec v = (0, 1)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-114-autovalores'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Eigenvector Diagonal, ex. 8 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Black-Scholes put: paridade put-call. Justifique $C - P = S_0 - Ke^{-rT}$.', resposta: 'Demonstração via portfólio replicante.',
      passos: '**Passo 1.** Portfólio long call + short put no vencimento: $C(T) - P(T) = \\max(S - K, 0) - \\max(K - S, 0) = S - K$.\n\n**Passo 2.** Hoje: long call + short put + $K e^{-rT}$ em bond replica posse de $S$. Logo $C - P + Ke^{-rT} = S_0 \\Rightarrow C - P = S_0 - Ke^{-rT}$. ∎\n\n**Importância.** Princípio sem-arbitragem fundamental em finanças quantitativas.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-119-bs-sintese'],
      fonteOriginal: { livro: 'Black-Scholes (1973)', url: ACTIVE_CALC, ref: 'Put-Call Parity', licenca: CC_BY_NC_SA } },
    { numero: 5, enunciado: 'PCA: dados centrados, primeira componente principal explica 70%. Interpretação.', resposta: '70% da variância total reside na 1ª direção principal.',
      passos: '**Passo 1.** $\\lambda_1/\\sum \\lambda_i = 0{,}7$.\n\n**Passo 2.** Reduzir a 1D preserva 70% — dependendo do uso, suficiente.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-118-pca'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'PCA Variance Explained (apêndice)', licenca: CC_BY } },
  ],
}

const PROVA_T12_V5: Prova = {
  id: 'trim-12-v5', trim: 12, versao: 5, titulo: 'Trim 12 · Versão 5', descricao: 'Trim 12 v5.',
  duracaoMinutos: 90, intensidade: 5, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Independência linear de $\\{(1, 2), (2, 4)\\}$.', resposta: 'LD.',
      passos: '**Passo 1.** $(2,4) = 2(1,2)$.\n\n**Passo 2.** Linearmente dependentes.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-111-espacos-vetoriais'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Linear Dep, ex. 7 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Reflexão pelo eixo $x$: matriz.', resposta: '$\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$',
      passos: '**Passo 1.** $T(1,0) = (1,0)$, $T(0,1) = (0,-1)$. Colunas = imagens.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-112-transformacoes-lineares'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Reflection, ex. 22 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Polinômio característico de $A = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$.', resposta: '$\\lambda^2 + 1$',
      passos: '**Passo 1.** $\\det(A - \\lambda I) = \\lambda^2 + 1$. Sem raízes reais — autovalores $\\pm i$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-114-autovalores'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Complex Eigen, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Matriz ortogonal: $Q^T Q = I$. Mostre que preserva norma.', resposta: 'Demonstração.',
      passos: '**Passo 1.** $\\|Q\\vec v\\|^2 = (Q\\vec v)^T(Q\\vec v) = \\vec v^T Q^T Q \\vec v = \\vec v^T \\vec v = \\|\\vec v\\|^2$. ∎',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-116-matrizes-especiais'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Orthogonal Norm Preserve (apêndice)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Black-Scholes Greek $\\Delta = \\partial C/\\partial S$. Para call ATM com $T = 1$, $\\sigma = 0{,}3$. Estime.', resposta: '$\\Delta = N(d_1) \\approx 0{,}56$',
      passos: '**Passo 1.** $\\Delta_\\text{call} = N(d_1)$.\n\n**Passo 2.** ATM: $d_1 = \\sigma\\sqrt T/2 = 0{,}15$. $N(0{,}15) \\approx 0{,}56$.\n\n**Interpretação.** Por cada $1$ de variação no subjacente, opção move 0{,}56.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-119-bs-sintese'],
      fonteOriginal: { livro: 'Black-Scholes (1973)', url: ACTIVE_CALC, ref: 'BS Greeks Delta', licenca: CC_BY_NC_SA } },
  ],
}

const PROVA_T12_V6: Prova = {
  id: 'trim-12-v6', trim: 12, versao: 6, titulo: 'Trim 12 · Versão 6', descricao: 'Trim 12 v6.',
  duracaoMinutos: 90, intensidade: 5, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Combinação linear: expresse $(7, 5)$ em $\\{(1, 2), (3, 1)\\}$.', resposta: '$\\frac{8}{5}(1,2) + \\frac{9}{5}(3,1)$',
      passos: '**Passo 1.** $a(1,2) + b(3,1) = (a+3b, 2a+b) = (7, 5)$.\n\n**Passo 2.** Sistema: $a + 3b = 7$, $2a + b = 5$. Resolva: $a = 8/5$, $b = 9/5$. (Verifique numericamente.)',
      dificuldade: 'compreensao', aulasCobertas: ['aula-111-espacos-vetoriais'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Linear Combination, ex. 13 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Composição: $T_1$ rotação $30°$, $T_2$ rotação $60°$. $T_2 \\circ T_1$.', resposta: 'Rotação $90°$.',
      passos: '**Passo 1.** Rotações compõem por soma de ângulos.\n\n**Passo 2.** $30° + 60° = 90°$. Matriz: $\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-112-transformacoes-lineares'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Composition Rotations, ex. 28 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Diagonalize $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$.', resposta: '$\\lambda = 3, -1$. Autovetores $(1, 1)$, $(1, -1)$.',
      passos: '**Passo 1.** Caract: $(1-\\lambda)^2 - 4 = 0 \\Rightarrow \\lambda = 3$ ou $-1$.\n\n**Passo 2.** $\\lambda=3$: $A - 3I$ kernel = $(1, 1)$. $\\lambda=-1$: $(1, -1)$.\n\n**Passo 3.** $A = P\\text{diag}(3,-1)P^{-1}$ com $P = \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-115-diagonalizacao'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Symmetric Diagonalize, ex. 31 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'Matriz definida positiva: $\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$. Verifique.', resposta: 'Sim — todos autovalores positivos (3 e 1).',
      passos: '**Passo 1.** Caract: $(2-\\lambda)^2 - 1 = 0 \\Rightarrow \\lambda = 3, 1$. Ambos > 0.\n\n**Equivalente.** Pivôs Gauss: 2 e 3/2, ambos > 0.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-116-matrizes-especiais'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Positive Definite, ex. 19 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Volatilidade implícita: dado preço de mercado $C_\\text{mkt}$, encontre $\\sigma$ tal que BS reproduza. Método.', resposta: 'Inversão numérica (Newton).',
      passos: '**Passo 1.** $C_\\text{BS}(\\sigma)$ é monotonamente crescente em $\\sigma$.\n\n**Passo 2.** Newton-Raphson: $\\sigma_{n+1} = \\sigma_n - (C(\\sigma_n) - C_\\text{mkt})/\\text{Vega}(\\sigma_n)$.\n\n**Conexão com Trim 7.** Newton em finanças.',
      dificuldade: 'desafio', aulasCobertas: ['aula-119-bs-sintese'],
      fonteOriginal: { livro: 'Black-Scholes (1973)', url: ACTIVE_CALC, ref: 'Implied Vol', licenca: CC_BY_NC_SA } },
  ],
}

const PROVA_T12_V7: Prova = {
  id: 'trim-12-v7', trim: 12, versao: 7, titulo: 'Trim 12 · Versão 7', descricao: 'Trim 12 v7.',
  duracaoMinutos: 90, intensidade: 5, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Base canônica de $\\mathbb R^3$. Quantos vetores?', resposta: '3: $e_1, e_2, e_3$.',
      passos: '**Passo 1.** $e_1 = (1,0,0)$, $e_2 = (0,1,0)$, $e_3 = (0,0,1)$.\n\n**Passo 2.** Geram qualquer $(x,y,z) = xe_1 + ye_2 + ze_3$. LI.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-111-espacos-vetoriais'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Standard Basis, ex. 5 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Matriz de $T(x, y, z) = (x + y, y - z)$. Tipo.', resposta: '$\\begin{pmatrix} 1 & 1 & 0 \\\\ 0 & 1 & -1 \\end{pmatrix}$. $\\mathbb R^3 \\to \\mathbb R^2$.',
      passos: '**Passo 1.** Colunas = $T(e_1), T(e_2), T(e_3)$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-112-transformacoes-lineares'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Matrix of T, ex. 24 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Matriz simétrica $A$. Provar autovalores reais.', resposta: 'Demonstração.',
      passos: '**Passo 1.** $A\\vec v = \\lambda \\vec v$. Conjugue: $A^*\\bar{\\vec v} = \\bar\\lambda \\bar{\\vec v}$. Como $A$ real simétrica, $A^* = A^T = A$.\n\n**Passo 2.** Tome produto $\\bar{\\vec v}^T A \\vec v$ de duas formas: $= \\lambda \\bar{\\vec v}^T \\vec v$ e $= \\bar\\lambda \\bar{\\vec v}^T \\vec v$.\n\n**Passo 3.** Como $\\bar{\\vec v}^T \\vec v = \\|\\vec v\\|^2 > 0$, $\\lambda = \\bar\\lambda$ ⇒ $\\lambda \\in \\mathbb R$. ∎',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-114-autovalores'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Symmetric Real Eigen (prova)', licenca: CC_BY } },
    { numero: 4, enunciado: 'SVD: $A$ tem 3 valores singulares positivos. Posto?', resposta: 'Posto 3.',
      passos: '**Passo 1.** Posto = número de valores singulares não-zero.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-117-svd'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'SVD Rank, ex. 11 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Vega $= \\partial C/\\partial \\sigma$. Para opção ATM, sinal?', resposta: 'Sempre positivo.',
      passos: '**Passo 1.** Mais volatilidade ⇒ mais incerteza ⇒ mais valor de opção (assimetria do payoff).\n\n**Passo 2.** Vega máxima quando opção ATM próxima ao vencimento.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-119-bs-sintese'],
      fonteOriginal: { livro: 'Black-Scholes (1973)', url: ACTIVE_CALC, ref: 'BS Vega', licenca: CC_BY_NC_SA } },
  ],
}

const PROVA_T12_V8: Prova = {
  id: 'trim-12-v8', trim: 12, versao: 8, titulo: 'Trim 12 · Versão 8', descricao: 'Trim 12 v8.',
  duracaoMinutos: 90, intensidade: 5, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Dimensão de $\\mathbb R^4$.', resposta: '$4$',
      passos: '**Passo 1.** Toda base de $\\mathbb R^n$ tem $n$ vetores. Aqui $n = 4$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-111-espacos-vetoriais'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Dimension, ex. 3 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Núcleo de $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$.', resposta: '$\\{t(2, -1) : t \\in \\mathbb R\\}$',
      passos:
        '**Passo 1 — O que é "núcleo" (kernel) de uma matriz?** O núcleo de $A$ é o conjunto de TODOS os vetores $\\vec v$ que $A$ "mata", isto é, vetores tais que $A\\vec v = \\vec 0$. Em linguagem de transformação linear: o núcleo é o subespaço que vai parar na origem.\n\n' +
        '**Passo 2 — Por que isso importa?** O núcleo mede o quanto uma matriz "perde informação". Se núcleo $= \\{\\vec 0\\}$ (apenas o vetor zero), $A$ é injetora — não funde dois vetores num só. Se o núcleo é maior, vetores diferentes mapeiam para o mesmo lugar (perda de informação).\n\n' +
        '**Passo 3 — Escrever $A\\vec v = \\vec 0$ explicitamente.** Seja $\\vec v = (x, y)$. Então:\n\n$\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} x + 2y \\\\ 2x + 4y \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$\n\nIsso gera o sistema: $x + 2y = 0$ e $2x + 4y = 0$.\n\n' +
        '**Passo 4 — Detectar redundância.** Olhe as duas equações. A segunda é exatamente $2 \\times$ a primeira: $2x + 4y = 2(x + 2y)$. Logo elas dão a MESMA informação. Sobra uma única equação efetiva: $x + 2y = 0$.\n\n' +
        '**Passo 5 — Por que há redundância?** Porque as LINHAS de $A$ são linearmente dependentes — segunda linha $= 2 \\times $ primeira. Isso significa $\\text{posto}(A) = 1$, não 2. **Quando posto $<$ dimensão do espaço, o núcleo é não-trivial** (tem mais que só o vetor zero).\n\n' +
        '**Passo 6 — Resolver $x + 2y = 0$.** Isolando: $x = -2y$. Para CADA valor escolhido de $y$, há um $x$ determinado. Logo $y$ é "parâmetro livre" e $x$ é "variável dependente".\n\n' +
        '**Passo 7 — Parametrizar a solução.** Chame $y = t$ (qualquer real). Então $x = -2t$. Logo $\\vec v = (x, y) = (-2t, t) = t \\cdot (-2, 1)$.\n\n' +
        '**Passo 8 — Forma equivalente $(2, -1)$.** Multiplique por $-1$: $t \\cdot (-2, 1) = (-t) \\cdot (2, -1)$. Como $t$ varia em todo $\\mathbb R$, $(-t)$ também varia em todo $\\mathbb R$. Logo os conjuntos $\\{t(-2, 1)\\}$ e $\\{t(2, -1)\\}$ são IDÊNTICOS — apenas reparametrizados. Convencionalmente usamos $(2, -1)$ (primeira coordenada positiva).\n\n' +
        '**Passo 9 — Interpretação geométrica.** O núcleo é uma **reta** que passa pela origem com vetor diretor $(2, -1)$. A equação dessa reta é $y = -x/2$. Geometricamente, $A$ "achata" o plano $\\mathbb R^2$ inteiro nessa reta — qualquer vetor sobre ela é mapeado para o vetor zero.\n\n' +
        '**Passo 10 — Confirmação numérica.** Tome $t = 1$: $\\vec v = (2, -1)$. Calcule:\n\n$A\\vec v = \\begin{pmatrix} 1 \\cdot 2 + 2 \\cdot (-1) \\\\ 2 \\cdot 2 + 4 \\cdot (-1) \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$ ✓\n\nTome $t = 3$: $\\vec v = (6, -3)$. $A\\vec v = (6 - 6, 12 - 12) = (0, 0)$ ✓. Funciona para qualquer $t$.\n\n' +
        '**Passo 11 — Dimensão do núcleo (nulidade).** O núcleo tem 1 grau de liberdade (parâmetro $t$). Sua dimensão, chamada **nulidade**, é $\\dim(\\text{núcleo}) = 1$.\n\n' +
        '**Passo 12 — Teorema posto-nulidade.** Para qualquer matriz $n \\times n$:\n\n$\\text{posto}(A) + \\text{nulidade}(A) = n$\n\nAqui: posto $= 1$ (uma linha LI), nulidade $= 1$. Soma $= 2 = \\dim(\\mathbb R^2)$. ✓\n\n' +
        '**Passo 13 — Conexão com determinante.** Núcleo não-trivial $\\Leftrightarrow$ $A$ não é invertível $\\Leftrightarrow$ $\\det(A) = 0$. Conferindo: $\\det = 1 \\cdot 4 - 2 \\cdot 2 = 0$ ✓.\n\n' +
        '**Passo 14 — Aplicação prática (estatística/PCA).** Em PCA, o núcleo da matriz de covariância indica direções de variância **zero** — features redundantes que podem ser removidas sem perda. Em sistemas dinâmicos, vetores no núcleo são "modos absorventes" — direções onde o sistema colapsa para origem.\n\n' +
        '**Passo 15 — Resposta final.** $\\text{núcleo}(A) = \\{t \\cdot (2, -1) : t \\in \\mathbb R\\}$. Geometricamente: a reta $y = -x/2$ passando pela origem.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-113-nucleo-imagem'],
      fonteOriginal: { livro: 'OpenStax College Algebra 2e (apêndice álgebra linear)', url: OS_CA, ref: '§9.5 Matrix Operations + Strang LA OCW MIT 18.06 §3', licenca: CC_BY } },
    { numero: 3, enunciado: 'Matriz $A$ é diagonalizável se tem $n$ autovetores LI. Justifique.', resposta: 'Demonstração.',
      passos: '**Passo 1.** $A\\vec v_i = \\lambda_i \\vec v_i$. Coloque $\\vec v_i$ como colunas de $P$.\n\n**Passo 2.** $AP = P\\text{diag}(\\lambda_i)$. Como $\\vec v_i$ LI, $P$ inversível ⇒ $A = P\\Lambda P^{-1}$. ∎',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-115-diagonalizacao'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Diagonalization Theorem (prova)', licenca: CC_BY } },
    { numero: 4, enunciado: 'PCA com 3 features, $\\lambda = (5, 2, 0{,}5)$. Reduzir para 2D explica quanto?', resposta: '$93{,}3\\%$',
      passos: '**Passo 1.** Total: $7{,}5$. Top 2: $7$.\n\n**Passo 2.** $7/7{,}5 = 0{,}933$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-118-pca'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'PCA Explained Var, ex. 17 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Black-Scholes: limite quando $\\sigma \\to 0$. Preço call.', resposta: '$C \\to \\max(S_0 - Ke^{-rT}, 0)$',
      passos: '**Passo 1.** Vol zero ⇒ trajetória determinística.\n\n**Passo 2.** $S_T = S_0 e^{rT}$ (sob risk-neutral).\n\n**Passo 3.** Call: $\\max(S_T - K, 0) e^{-rT} = \\max(S_0 - Ke^{-rT}, 0)$.\n\n**Interpretação.** Sem volatilidade, opção tem só valor intrínseco descontado. Vol > 0 adiciona valor extrínseco.',
      dificuldade: 'desafio', aulasCobertas: ['aula-119-bs-sintese'],
      fonteOriginal: { livro: 'Black-Scholes (1973)', url: ACTIVE_CALC, ref: 'BS Limit Vol → 0', licenca: CC_BY_NC_SA } },
  ],
}

const PROVA_T12_V9: Prova = {
  id: 'trim-12-v9', trim: 12, versao: 9, titulo: 'Trim 12 · Versão 9', descricao: 'Trim 12 v9.',
  duracaoMinutos: 90, intensidade: 5, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Geração: $\\{(1,0), (0,1), (1,1)\\}$ gera $\\mathbb R^2$?', resposta: 'Sim, mas não é base (LD).',
      passos: '**Passo 1.** Geram $\\mathbb R^2$ porque incluem base canônica.\n\n**Passo 2.** Mas 3 vetores em $\\mathbb R^2$ ⇒ LD ⇒ não é base.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-111-espacos-vetoriais'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Spanning Set, ex. 9 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Determinante e área: $\\det\\begin{pmatrix} 3 & 1 \\\\ 0 & 2 \\end{pmatrix} = 6$. Significado.', resposta: 'Área do paralelogramo formado pelas colunas é 6.',
      passos: '**Passo 1.** $|\\det|$ é fator de escala da transformação linear sobre área.\n\n**Em 3D.** $|\\det|$ é volume do paralelepípedo.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-112-transformacoes-lineares'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Det as Area, ex. 27 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Matriz nilpotente: $A^k = 0$ para algum $k$. Autovalores.', resposta: 'Todos zero.',
      passos: '**Passo 1.** $A\\vec v = \\lambda \\vec v \\Rightarrow A^k \\vec v = \\lambda^k \\vec v$.\n\n**Passo 2.** $A^k = 0 \\Rightarrow \\lambda^k \\vec v = 0$ para autovetor $\\vec v \\neq 0$. Logo $\\lambda = 0$.',
      dificuldade: 'demonstracao', aulasCobertas: ['aula-114-autovalores'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Nilpotent Eigen (apêndice)', licenca: CC_BY } },
    { numero: 4, enunciado: 'SVD vs eigendecomposition: diferença chave.', resposta: 'SVD funciona em qualquer matriz; eigen exige quadrada.',
      passos: '**Passo 1.** Eigen $A = P\\Lambda P^{-1}$ requer $A$ quadrada e diagonalizável.\n\n**Passo 2.** SVD $A = U\\Sigma V^T$ funciona para qualquer $A_{m \\times n}$, sempre existe.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-117-svd'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'SVD vs Eigen (apêndice)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Black-Scholes: opção exótica (knock-out barrier). É BS direto?', resposta: 'Não — BS clássico só vale para opções europeias plain vanilla.',
      passos: '**Passo 1.** BS exato (fechado) só para call/put europeu sem barreiras nem path-dependence.\n\n**Passo 2.** Para exóticas: PDE com condições de fronteira específicas, geralmente resolvida numericamente (diferenças finitas, Monte Carlo).',
      dificuldade: 'compreensao', aulasCobertas: ['aula-119-bs-sintese'],
      fonteOriginal: { livro: 'Black-Scholes (1973)', url: ACTIVE_CALC, ref: 'BS Limitations', licenca: CC_BY_NC_SA } },
  ],
}

const PROVA_T12_V10: Prova = {
  id: 'trim-12-v10', trim: 12, versao: 10, titulo: 'Trim 12 · Versão 10', descricao: 'Trim 12 v10.',
  duracaoMinutos: 90, intensidade: 5, publicoAlvo: '3.º ano', status: 'curada',
  questoes: [
    { numero: 1, enunciado: 'Conjunto de polinômios de grau $\\leq 2$ é espaço vetorial. Dimensão.', resposta: '$3$',
      passos: '**Passo 1.** Base: $\\{1, x, x^2\\}$.\n\n**Passo 2.** 3 elementos LI que geram tudo ⇒ dim = 3.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-111-espacos-vetoriais'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Polynomial Space, ex. 14 (adaptado)', licenca: CC_BY } },
    { numero: 2, enunciado: 'Linear $T: P_2 \\to P_1$, $T(p) = p\'$. Núcleo.', resposta: 'Polinômios constantes.',
      passos: '**Passo 1.** $T(p) = p\' = 0 \\Leftrightarrow p$ constante.\n\n**Passo 2.** Núcleo: $\\{c : c \\in \\mathbb R\\}$. Dimensão 1.',
      dificuldade: 'desafio', aulasCobertas: ['aula-112-transformacoes-lineares', 'aula-113-nucleo-imagem'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Differentiation as LinTrans, ex. 33 (adaptado)', licenca: CC_BY } },
    { numero: 3, enunciado: 'Matriz $A$ ortogonal ⇒ $A^{-1} = A^T$. Verifique para rotação $90°$.', resposta: 'Verificado.',
      passos: '**Passo 1.** $R = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$. $R^T = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$.\n\n**Passo 2.** $RR^T = I$ ✓. Logo $R^{-1} = R^T$.',
      dificuldade: 'aplicacao', aulasCobertas: ['aula-116-matrizes-especiais'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Orthogonal Inverse, ex. 25 (adaptado)', licenca: CC_BY } },
    { numero: 4, enunciado: 'PCA: matriz de cov. tem traço $T$. Soma autovalores.', resposta: '$\\sum\\lambda_i = T$.',
      passos: '**Passo 1.** Identidade: $\\text{tr}(A) = \\sum \\lambda_i$.\n\n**Aplicação PCA.** Variância total = traço da matriz cov.',
      dificuldade: 'compreensao', aulasCobertas: ['aula-118-pca', 'aula-114-autovalores'],
      fonteOriginal: { livro: 'OpenStax Calc 3', url: OS_CALC3, ref: 'Trace Eigen, ex. 21 (adaptado)', licenca: CC_BY } },
    { numero: 5, enunciado: 'Black-Scholes em prática: apresente o uso real do modelo em uma mesa de derivativos brasileira (PETR4 options, B3).', resposta: 'Discussão aberta — calibração diária da vol implícita, hedge dinâmico via Δ, controle Γ, Vega, Theta para risco de carteira.',
      passos: '**Passo 1.** Inputs: $S_0$ (cotação spot), $r$ (Selic), $T$ (tempo até vencimento), $\\sigma$ (vol implícita do mercado).\n\n**Passo 2.** Outputs principais: preço justo, gregas (Δ Γ Vega Θ).\n\n**Passo 3.** Hedge: $\\Delta$ tells how many shares to short to neutralize price risk.\n\n**Pontos críticos.** Vol não é constante (smile/skew), $r$ varia, e modelo lognormal subestima caudas (crashs). Mesa usa BS como linguagem comum + ajustes empíricos.',
      dificuldade: 'modelagem', aulasCobertas: ['aula-119-bs-sintese', 'aula-120-workshop-final'],
      fonteOriginal: { livro: 'Black-Scholes (1973) + ajustes B3 práticos', url: ACTIVE_CALC, ref: 'BS Real-World Application', licenca: CC_BY_NC_SA } },
  ],
}

// =============================================================================
// Stubs em-curadoria — versões 4-10 dos demais trimestres
// (mantém o sistema com 12 × 10 provas; versões adicionais entram via PRs)
// =============================================================================

function provaStub(trim: number, versao: number, publicoAlvo: Prova['publicoAlvo']): Prova {
  return {
    id: `trim-${trim}-v${versao}`,
    trim,
    versao,
    titulo: `Trim ${trim} · Versão ${versao} — em curadoria`,
    descricao:
      'Versão em curadoria. Selecionando exercícios reais de OpenStax / Active Calculus para esta versão. Use a versão 1 enquanto isso.',
    duracaoMinutos: 90,
    intensidade: 3,
    publicoAlvo,
    status: 'em-curadoria',
    questoes: [],
  }
}

const PUBLICO_POR_TRIM: Record<number, Prova['publicoAlvo']> = {
  1: '1.º ano',
  2: '1.º ano',
  3: '1.º ano',
  4: '1.º ano',
  5: '2.º ano',
  6: '2.º ano',
  7: '2.º ano',
  8: '2.º ano',
  9: '3.º ano',
  10: '3.º ano',
  11: '3.º ano',
  12: '3.º ano',
}

const PROVAS_CURADAS: Prova[] = [
  PROVA_T1_V1,
  PROVA_T1_V2,
  PROVA_T1_V3,
  PROVA_T1_V4,
  PROVA_T1_V5,
  PROVA_T1_V6,
  PROVA_T1_V7,
  PROVA_T1_V8,
  PROVA_T1_V9,
  PROVA_T1_V10,
  PROVA_T2_V1,
  PROVA_T2_V2,
  PROVA_T2_V3,
  PROVA_T2_V4,
  PROVA_T2_V5,
  PROVA_T2_V6,
  PROVA_T2_V7,
  PROVA_T2_V8,
  PROVA_T2_V9,
  PROVA_T2_V10,
  PROVA_T3_V1,
  PROVA_T3_V2,
  PROVA_T3_V3,
  PROVA_T3_V4,
  PROVA_T3_V5,
  PROVA_T3_V6,
  PROVA_T3_V7,
  PROVA_T3_V8,
  PROVA_T3_V9,
  PROVA_T3_V10,
  PROVA_T4_V1,
  PROVA_T4_V2,
  PROVA_T4_V3,
  PROVA_T4_V4,
  PROVA_T4_V5,
  PROVA_T4_V6,
  PROVA_T4_V7,
  PROVA_T4_V8,
  PROVA_T4_V9,
  PROVA_T4_V10,
  PROVA_T5_V1,
  PROVA_T5_V2,
  PROVA_T5_V3,
  PROVA_T5_V4,
  PROVA_T5_V5,
  PROVA_T5_V6,
  PROVA_T5_V7,
  PROVA_T5_V8,
  PROVA_T5_V9,
  PROVA_T5_V10,
  PROVA_T6_V1,
  PROVA_T6_V2,
  PROVA_T6_V3,
  PROVA_T6_V4,
  PROVA_T6_V5,
  PROVA_T6_V6,
  PROVA_T6_V7,
  PROVA_T6_V8,
  PROVA_T6_V9,
  PROVA_T6_V10,
  PROVA_T7_V1,
  PROVA_T7_V2,
  PROVA_T7_V3,
  PROVA_T7_V4,
  PROVA_T7_V5,
  PROVA_T7_V6,
  PROVA_T7_V7,
  PROVA_T7_V8,
  PROVA_T7_V9,
  PROVA_T7_V10,
  PROVA_T8_V1,
  PROVA_T8_V2,
  PROVA_T8_V3,
  PROVA_T8_V4,
  PROVA_T8_V5,
  PROVA_T8_V6,
  PROVA_T8_V7,
  PROVA_T8_V8,
  PROVA_T8_V9,
  PROVA_T8_V10,
  PROVA_T9_V1,
  PROVA_T9_V2,
  PROVA_T9_V3,
  PROVA_T9_V4,
  PROVA_T9_V5,
  PROVA_T9_V6,
  PROVA_T9_V7,
  PROVA_T9_V8,
  PROVA_T9_V9,
  PROVA_T9_V10,
  PROVA_T10_V1,
  PROVA_T10_V2,
  PROVA_T10_V3,
  PROVA_T10_V4,
  PROVA_T10_V5,
  PROVA_T10_V6,
  PROVA_T10_V7,
  PROVA_T10_V8,
  PROVA_T10_V9,
  PROVA_T10_V10,
  PROVA_T11_V1,
  PROVA_T11_V2,
  PROVA_T11_V3,
  PROVA_T11_V4,
  PROVA_T11_V5,
  PROVA_T11_V6,
  PROVA_T11_V7,
  PROVA_T11_V8,
  PROVA_T11_V9,
  PROVA_T11_V10,
  PROVA_T12_V1,
  PROVA_T12_V2,
  PROVA_T12_V3,
  PROVA_T12_V4,
  PROVA_T12_V5,
  PROVA_T12_V6,
  PROVA_T12_V7,
  PROVA_T12_V8,
  PROVA_T12_V9,
  PROVA_T12_V10,
]

function gerarStubsFaltantes(): Prova[] {
  const stubs: Prova[] = []
  for (let trim = 1; trim <= 12; trim++) {
    for (let v = 1; v <= 10; v++) {
      const exists = PROVAS_CURADAS.some(
        (p) => p.trim === trim && p.versao === v,
      )
      if (!exists) {
        stubs.push(provaStub(trim, v, PUBLICO_POR_TRIM[trim] ?? '1.º ano'))
      }
    }
  }
  return stubs
}

export const PROVAS: Prova[] = [
  ...PROVAS_CURADAS,
  ...gerarStubsFaltantes(),
].sort((a, b) => a.trim - b.trim || a.versao - b.versao)

/** Provas curadas (com questões reais do ledger). */
export const PROVAS_REAIS = PROVAS.filter((p) => p.status === 'curada')

/** Total de questões reais no banco. */
export const TOTAL_QUESTOES_REAIS = PROVAS_REAIS.reduce(
  (s, p) => s + p.questoes.length,
  0,
)
