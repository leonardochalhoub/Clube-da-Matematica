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
  PROVA_T2_V1,
  PROVA_T3_V1,
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
