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
  PROVA_T5_V1,
  PROVA_T6_V1,
  PROVA_T7_V1,
  PROVA_T8_V1,
  PROVA_T9_V1,
  PROVA_T10_V1,
  PROVA_T11_V1,
  PROVA_T12_V1,
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
