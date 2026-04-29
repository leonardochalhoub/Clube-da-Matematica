/**
 * Banco de provas integradas — 12 trimestres × 10 versões = 120 provas.
 *
 * Cada Trim tem um TEMPLATE que parametriza questões. A função
 * `gerarProvasDoTrim(trimNum)` produz 10 versões com parâmetros
 * variando por seed (1..10), preservando estrutura mas mudando números.
 *
 * Cada questão traz:
 *   - enunciado (com $...$ KaTeX inline)
 *   - resposta
 *   - passos: explicação passo a passo COM o porquê de cada passo
 *
 * Adicionar mais Trims: estender PROVA_TEMPLATES.
 */

export type Dificuldade =
  | 'aplicacao'
  | 'compreensao'
  | 'modelagem'
  | 'desafio'
  | 'demonstracao'

export interface Questao {
  numero: number
  enunciado: string
  resposta: string
  /** Passo a passo COM o porquê. Markdown lite + $...$ inline. */
  passos: string
  dificuldade: Dificuldade
  aulasCobertas: string[]
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
  questoes: Questao[]
}

// =============================================================================
// Helpers de geração
// =============================================================================

/** Pequeno PRNG determinístico (LCG). */
function lcg(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s
  }
}

/** Pega item de array de forma determinística por seed. */
function pick<T>(arr: T[], rand: () => number): T {
  return arr[rand() % arr.length]!
}

/** Inteiro em [min, max]. */
function intRange(min: number, max: number, rand: () => number): number {
  return min + (rand() % (max - min + 1))
}

// =============================================================================
// Templates por Trimestre
// =============================================================================

interface TrimTemplate {
  trim: number
  publicoAlvo: Prova['publicoAlvo']
  intensidade: Prova['intensidade']
  duracaoMinutos: number
  tituloBase: string
  descricao: string
  /** Recebe seed (1..10), retorna lista de questões da versão. */
  geraQuestoes: (versao: number) => Questao[]
}

// -----------------------------------------------------------------------------
// TRIM 1 — Funções, Conjuntos, Taxa de Variação
// -----------------------------------------------------------------------------

const TEMPLATE_TRIM_1: TrimTemplate = {
  trim: 1,
  publicoAlvo: '1.º ano',
  intensidade: 2,
  duracaoMinutos: 90,
  tituloBase: 'Funções e taxa de variação',
  descricao: 'Trim 1 do Ano 1: conjuntos, funções, afim, quadrática, exp/log, taxa de variação média.',
  geraQuestoes: (v) => {
    const r = lcg(v * 31)
    const a = intRange(2, 5, r)
    const b = intRange(1, 6, r)
    const x0 = intRange(1, 4, r)
    const inputF = intRange(2, 6, r)
    const massa = intRange(60, 90, r)
    const altura = (160 + (v % 20)) / 100 // 1.60 - 1.79
    const taxa = intRange(3, 8, r)
    const valor0 = intRange(1000, 5000, r)

    return [
      {
        numero: 1,
        enunciado: `Determine o domínio máximo de $f(x) = \\sqrt{x - ${x0}}$.`,
        resposta: `$[${x0}, +\\infty)$`,
        passos:
          `**Passo 1 — Identifique a restrição.** Sob raiz quadrada, o argumento deve ser não-negativo (em $\\mathbb{R}$): $x - ${x0} \\geq 0$.\n\n` +
          `**Passo 2 — Resolva a inequação.** Somando ${x0} aos dois lados: $x \\geq ${x0}$.\n\n` +
          `**Passo 3 — Por que essa é a resposta?** O domínio máximo é o **maior subconjunto** de $\\mathbb{R}$ onde a fórmula faz sentido. Para $x < ${x0}$, $\\sqrt{}$ daria número complexo (fora de $\\mathbb{R}$). Logo, em notação de intervalo: $[${x0}, +\\infty)$ — fechado em ${x0} porque $\\sqrt{0}=0$ é definido.\n\n` +
          `**Conexão com aulas.** Lições 1 (intervalos) + 2 (domínio).`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-01-conjuntos-intervalos', 'aula-02-funcoes'],
      },
      {
        numero: 2,
        enunciado: `Para a função afim $f(x) = ${a}x + ${b}$, calcule $f(${inputF})$.`,
        resposta: `$f(${inputF}) = ${a * inputF + b}$`,
        passos:
          `**Passo 1 — Substitua o valor.** $f(${inputF}) = ${a} \\cdot ${inputF} + ${b}$.\n\n` +
          `**Passo 2 — Calcule.** ${a} \\cdot ${inputF} = ${a * inputF}, e ${a * inputF} + ${b} = ${a * inputF + b}$.\n\n` +
          `**Por que esse cálculo?** A função afim é a regra "multiplica por $a$ e soma $b$". Substituir é literalmente aplicar a regra com $x = ${inputF}$.\n\n` +
          `**Insight extra.** O coeficiente angular $a = ${a}$ significa que cada aumento de 1 unidade em $x$ aumenta $f$ em ${a} unidades — taxa de variação constante (Lição 9).`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-03-afim', 'aula-09-taxa-variacao'],
      },
      {
        numero: 3,
        enunciado: `Encontre o vértice da parábola $f(x) = x^2 - ${2 * x0}x + ${x0 * x0 + b}$.`,
        resposta: `$(${x0}, ${b})$`,
        passos:
          `**Passo 1 — Identifique $a, b, c$.** Comparando com $ax^2 + bx + c$: $a = 1$, $b = -${2 * x0}$, $c = ${x0 * x0 + b}$.\n\n` +
          `**Passo 2 — $x$ do vértice.** Use $x_V = -b/(2a) = ${2 * x0}/2 = ${x0}$.\n\n` +
          `**Passo 3 — $y$ do vértice.** Substitua $x = ${x0}$ na função: $f(${x0}) = ${x0 * x0} - ${2 * x0 * x0} + ${x0 * x0 + b} = ${b}$.\n\n` +
          `**Por que essa fórmula?** $x_V$ é o ponto onde a derivada $f'(x) = 2ax + b$ se anula — geometricamente, o ponto onde a tangente é horizontal (mínimo se $a > 0$). Você verá isso formalmente na Lição 51.\n\n` +
          `**Verificação rápida.** Forma canônica $(x - ${x0})^2 + ${b}$ — se a forma "completar quadrado" der esse padrão, vértice é $(${x0}, ${b})$.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-04-quadratica'],
      },
      {
        numero: 4,
        enunciado: `Resolva $|2x - ${b}| < ${a + 2}$.`,
        resposta: `$x \\in (\\frac{${b - a - 2}}{2}, \\frac{${b + a + 2}}{2})$`,
        passos:
          `**Passo 1 — Reescreva como dupla desigualdade.** $|u| < k$ (com $k > 0$) equivale a $-k < u < k$. Aqui: $-${a + 2} < 2x - ${b} < ${a + 2}$.\n\n` +
          `**Passo 2 — Some ${b} aos três membros.** $${b - a - 2} < 2x < ${b + a + 2}$.\n\n` +
          `**Passo 3 — Divida tudo por 2.** $${(b - a - 2) / 2} < x < ${(b + a + 2) / 2}$.\n\n` +
          `**Por que vale tirar o módulo assim?** Geometricamente, $|2x - ${b}| < ${a + 2}$ significa "a distância de $2x$ até ${b}$ é menor que ${a + 2}$". Isso descreve um **intervalo aberto** em torno de ${b}/2 com raio ${(a + 2) / 2}.\n\n` +
          `**Conexão.** Lição 1 (intervalos) — toda inequação modular vira intervalo.`,
        dificuldade: 'compreensao',
        aulasCobertas: ['aula-01-conjuntos-intervalos'],
      },
      {
        numero: 5,
        enunciado: `Calcule a TVM (taxa de variação média) de $f(x) = x^2 + ${a}x$ no intervalo $[1, ${b + 1}]$.`,
        resposta: `${b + 2 + a}`,
        passos:
          `**Passo 1 — Calcule $f$ nos extremos.**\n- $f(1) = 1 + ${a} = ${1 + a}$\n- $f(${b + 1}) = ${(b + 1) ** 2} + ${a * (b + 1)} = ${(b + 1) ** 2 + a * (b + 1)}$\n\n` +
          `**Passo 2 — Aplique a fórmula.** $\\text{TVM} = \\frac{f(${b + 1}) - f(1)}{${b + 1} - 1} = \\frac{${(b + 1) ** 2 + a * (b + 1)} - ${1 + a}}{${b}} = ${b + 2 + a}$.\n\n` +
          `**Por que TVM importa?** É a inclinação da reta secante pelo gráfico nos pontos $(1, f(1))$ e $(${b + 1}, f(${b + 1}))$. **Essa é a versão discreta da derivada** — quando o intervalo encolhe ($\\Delta x \\to 0$), TVM vira derivada $f'(x_0)$. **Aqui está a ponte para o Cálculo** (Trim 5-6).\n\n` +
          `**Aplicação prática.** Em economia, TVM do custo entre $q_1$ e $q_2$ é o "custo marginal médio". Em cinemática, TVM da posição é a velocidade média.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-09-taxa-variacao'],
      },
      {
        numero: 6,
        enunciado: `Resolva $${a}^x = ${a ** (b > 4 ? 3 : b)}$.`,
        resposta: `$x = ${b > 4 ? 3 : b}$`,
        passos:
          `**Passo 1 — Reconheça a base.** Lado direito $= ${a}^{${b > 4 ? 3 : b}}$ por inspeção (${a} elevado a ${b > 4 ? 3 : b}).\n\n` +
          `**Passo 2 — Iguale expoentes.** Se $a^x = a^y$ com $a > 0$, $a \\neq 1$, então $x = y$ pela injetividade da exponencial.\n\n` +
          `**Por que isso funciona?** $f(x) = ${a}^x$ é **estritamente crescente** (Lição 6) — ou seja, injetora. Logo dois valores distintos produzem imagens distintas; igualdade de imagens implica igualdade de inputs.\n\n` +
          `**Caso geral.** Se as bases não fossem iguais, aplicaríamos $\\log$ em ambos os lados: $x = \\log_{${a}}(${a ** (b > 4 ? 3 : b)})$.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-06-exponencial'],
      },
      {
        numero: 7,
        enunciado: `Calcule $\\log_{${a}}(${a ** 4})$.`,
        resposta: `$4$`,
        passos:
          `**Passo 1 — Use a definição.** $\\log_a(x) = y \\iff a^y = x$. Aqui $a = ${a}$, $x = ${a ** 4}$.\n\n` +
          `**Passo 2 — Por inspeção ou propriedade.** Como ${a ** 4} = ${a}^4$, temos $\\log_{${a}}(${a}^4) = 4$ pela propriedade $\\log_a(a^n) = n$.\n\n` +
          `**Por que essa propriedade?** $\\log_a$ é a inversa de $a^x$. Aplicar uma após a outra dá identidade: $\\log_a(a^n) = n$ e $a^{\\log_a x} = x$.\n\n` +
          `**Aplicação.** Em escalas físicas, $\\log_{10}(1000) = 3$ → "1000 tem 3 zeros". Richter, decibel, pH usam isso.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-07-logaritmo'],
      },
      {
        numero: 8,
        enunciado: `Uma cultura de bactérias dobra a cada hora. Inicialmente há ${valor0} bactérias. Quantas após ${a} horas?`,
        resposta: `$${valor0} \\cdot 2^{${a}} = ${valor0 * 2 ** a}$`,
        passos:
          `**Passo 1 — Modelo exponencial.** Cada hora dobra → fator multiplicativo 2 por hora. Após $t$ horas: $N(t) = N_0 \\cdot 2^t$.\n\n` +
          `**Passo 2 — Substitua $N_0 = ${valor0}$, $t = ${a}$.** $N(${a}) = ${valor0} \\cdot 2^{${a}} = ${valor0} \\cdot ${2 ** a} = ${valor0 * 2 ** a}$.\n\n` +
          `**Por que crescimento é exponencial?** Porque a taxa de reprodução é proporcional à população atual: $\\dot N = k N$, cuja solução é $N = N_0 e^{kt}$. Em forma com base 2: $N = N_0 \\cdot 2^{t/T}$ onde $T$ é tempo de duplicação ($T = 1$ h aqui).\n\n` +
          `**Realismo.** Em laboratório, esse modelo só vale enquanto os nutrientes são abundantes. Em algum ponto a curva vira logística (saturação) — Lição 94.`,
        dificuldade: 'modelagem',
        aulasCobertas: ['aula-06-exponencial', 'aula-08-crescimento'],
      },
      {
        numero: 9,
        enunciado: `Calcule o IMC de uma pessoa com ${massa} kg e ${altura.toFixed(2)} m. (IMC = massa / altura²)`,
        resposta: `IMC = ${(massa / (altura * altura)).toFixed(1)} kg/m²`,
        passos:
          `**Passo 1 — Eleve a altura ao quadrado.** $${altura.toFixed(2)}^2 = ${(altura * altura).toFixed(4)}$ m².\n\n` +
          `**Passo 2 — Divida.** IMC = ${massa} / ${(altura * altura).toFixed(4)} = ${(massa / (altura * altura)).toFixed(2)} kg/m².\n\n` +
          `**Por que essa fórmula?** Quetelet (1832) propôs IMC como índice **invariante por escala** aproximado: pessoas geometricamente similares têm massa ∝ altura³ (volume), mas em prática a estrutura não é cúbica. O quociente massa/altura² é uma aproximação empírica que funciona bem para adultos.\n\n` +
          `**Limitações.** IMC não distingue gordura de músculo. Um halterofilista pode ter IMC > 30 sem obesidade. Use junto com %gordura e circunferência.`,
        dificuldade: 'modelagem',
        aulasCobertas: ['aula-02-funcoes'],
      },
      {
        numero: 10,
        enunciado: `Aplicação de R$ ${valor0} a ${taxa}% ao ano com juros compostos. Saldo após ${a} anos.`,
        resposta: `R$ ${(valor0 * (1 + taxa / 100) ** a).toFixed(2)}`,
        passos:
          `**Passo 1 — Fórmula.** Juros compostos: $S(t) = S_0 (1 + i)^t$ onde $i$ é taxa por período (decimal).\n\n` +
          `**Passo 2 — Substitua $S_0 = ${valor0}$, $i = ${taxa}/100 = ${taxa / 100}$, $t = ${a}$.** $S = ${valor0} \\cdot (${(1 + taxa / 100).toFixed(4)})^{${a}}$.\n\n` +
          `**Passo 3 — Calcule a potência.** $(${(1 + taxa / 100).toFixed(4)})^{${a}} = ${((1 + taxa / 100) ** a).toFixed(6)}$.\n\n` +
          `**Passo 4 — Multiplicação final.** $${valor0} \\cdot ${((1 + taxa / 100) ** a).toFixed(6)} = ${(valor0 * (1 + taxa / 100) ** a).toFixed(2)}$.\n\n` +
          `**Por que compostos vs simples?** Simples: $S = S_0(1 + it)$ — juros sobre o capital inicial só. Compostos: juros sobre juros — crescimento exponencial. Em 30 anos, a diferença é enorme. Albert Einstein supostamente disse: "juros compostos são a 8.ª maravilha do mundo".\n\n` +
          `**Continuidade.** Se a capitalização for "instantânea" (limite), aparece $e^{rt}$ — base de Black-Scholes (Lição 119).`,
        dificuldade: 'modelagem',
        aulasCobertas: ['aula-08-crescimento'],
      },
    ]
  },
}

// -----------------------------------------------------------------------------
// TRIM 2 — Trigonometria + Sequências
// -----------------------------------------------------------------------------

const TEMPLATE_TRIM_2: TrimTemplate = {
  trim: 2,
  publicoAlvo: '1.º ano',
  intensidade: 3,
  duracaoMinutos: 90,
  tituloBase: 'Trigonometria e sequências',
  descricao: 'Trim 2 do Ano 1: razões trig, círculo, equações, leis dos senos/cossenos, PA, PG, limite intuitivo.',
  geraQuestoes: (v) => {
    const r = lcg(v * 71)
    const angulosNotaveis = [30, 45, 60]
    const ang = pick(angulosNotaveis, r)
    const angRad = ang === 30 ? '\\pi/6' : ang === 45 ? '\\pi/4' : '\\pi/3'
    const sinVals: Record<number, string> = { 30: '1/2', 45: '\\sqrt{2}/2', 60: '\\sqrt{3}/2' }
    const cosVals: Record<number, string> = { 30: '\\sqrt{3}/2', 45: '\\sqrt{2}/2', 60: '1/2' }
    const a1 = intRange(2, 8, r)
    const razao = intRange(2, 5, r)
    const n = intRange(8, 15, r)
    const lado1 = intRange(3, 9, r)
    const lado2 = intRange(4, 10, r)
    const angTri = pick([30, 45, 60, 90, 120], r)
    const a = intRange(2, 5, r)
    const b = intRange(1, 6, r)

    return [
      {
        numero: 1,
        enunciado: `Calcule $\\sin(${ang}°)$.`,
        resposta: `$${sinVals[ang]}$`,
        passos:
          `**Passo 1 — Reconheça o ângulo notável.** ${ang}° é um dos 3 ângulos cujos valores trig se decoram: 30°, 45°, 60°.\n\n` +
          `**Passo 2 — Relembre o triângulo de referência.** Para ${ang}°: ${
            ang === 30
              ? 'triângulo 30-60-90 com lados em proporção $1 : \\sqrt{3} : 2$. $\\sin(30°) = $ cateto oposto / hipotenusa = $1/2$.'
              : ang === 45
                ? 'triângulo 45-45-90 isóceles. $\\sin(45°) = 1/\\sqrt{2} = \\sqrt{2}/2$.'
                : 'triângulo 30-60-90. $\\sin(60°) = \\sqrt{3}/2$ (cateto oposto sobre hipotenusa).'
          }\n\n` +
          `**Por que esses são notáveis?** Decorrem de geometria simples (triângulo equilátero metade + Pitágoras). Aparecem em problemas físicos (rampa 30°, encaixe 45°) o tempo todo, daí decorá-los.\n\n` +
          `**Verificação.** ${sinVals[ang]} ≈ ${(Math.sin((ang * Math.PI) / 180)).toFixed(4)}, bate com calculadora.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-11-trig-triangulo'],
      },
      {
        numero: 2,
        enunciado: `Converta $${ang}°$ para radianos.`,
        resposta: `$${angRad}$ rad`,
        passos:
          `**Passo 1 — Fator de conversão.** $1° = \\pi/180$ rad. (Vem de $360° = 2\\pi$ rad → $1° = 2\\pi/360 = \\pi/180$.)\n\n` +
          `**Passo 2 — Multiplique.** $${ang} \\cdot \\pi/180 = ${ang}\\pi/180 = ${angRad}$ (após simplificar a fração).\n\n` +
          `**Por que radianos?** Em cálculo, **radianos é a unidade natural**. As fórmulas $(\\sin x)' = \\cos x$ só valem em radianos. Em graus, ficaria $(\\pi/180)\\cos x$ — feio.\n\n` +
          `**Truque mnemônico.** $\\pi$ rad = 180° (meia-volta). $\\pi/2$ = 90° (quarto). $\\pi/3$ = 60°. $\\pi/4$ = 45°. $\\pi/6$ = 30°.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-12-circulo-trigonometrico'],
      },
      {
        numero: 3,
        enunciado: `Resolva $\\sin x = ${sinVals[ang]}$ em $[0, 2\\pi)$.`,
        resposta:
          ang === 90
            ? `$x = \\pi/2$`
            : `$x \\in \\{${angRad}, \\pi - ${angRad}\\}$`,
        passos:
          `**Passo 1 — Identifique o ângulo de referência.** $\\sin x = ${sinVals[ang]}$ → ângulo de referência é $${angRad}$ (do círculo trigonométrico, Q1).\n\n` +
          `**Passo 2 — Encontre todas as soluções em $[0, 2\\pi)$.** $\\sin$ é positivo em **dois quadrantes** (I e II). Logo:\n- $x_1 = ${angRad}$ (Q1)\n- $x_2 = \\pi - ${angRad}$ (Q2, simetria pela vertical)\n\n` +
          `**Por que dois valores?** O seno tem **período** $2\\pi$, e dentro de cada período há 2 ângulos distintos (exceto nos extremos $\\pm 1$) com mesmo valor de seno — pela simetria do gráfico em torno de $\\pi/2$.\n\n` +
          `**Solução geral em $\\mathbb{R}$.** $x = ${angRad} + 2k\\pi$ ou $x = \\pi - ${angRad} + 2k\\pi$, $k \\in \\mathbb{Z}$.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-14-equacoes-trigonometricas'],
      },
      {
        numero: 4,
        enunciado: `Triângulo qualquer com $a = ${lado1}$, $b = ${lado2}$, ângulo $C = ${angTri}°$ entre eles. Calcule $c$ (lei dos cossenos).`,
        resposta: `$c = \\sqrt{${lado1 * lado1 + lado2 * lado2 - 2 * lado1 * lado2 * Math.cos((angTri * Math.PI) / 180)}}$ ≈ ${Math.sqrt(lado1 * lado1 + lado2 * lado2 - 2 * lado1 * lado2 * Math.cos((angTri * Math.PI) / 180)).toFixed(2)}`,
        passos:
          `**Passo 1 — Lei dos cossenos.** $c^2 = a^2 + b^2 - 2ab\\cos C$.\n\n` +
          `**Passo 2 — Substitua valores.** $c^2 = ${lado1 ** 2} + ${lado2 ** 2} - 2 \\cdot ${lado1} \\cdot ${lado2} \\cdot \\cos(${angTri}°) = ${lado1 ** 2 + lado2 ** 2} - ${2 * lado1 * lado2}\\cos(${angTri}°)$.\n\n` +
          `**Passo 3 — Cosseno.** $\\cos(${angTri}°) = ${cosVals[angTri] ?? (angTri === 90 ? '0' : angTri === 120 ? '-1/2' : 'valor numérico')} \\approx ${Math.cos((angTri * Math.PI) / 180).toFixed(4)}$.\n\n` +
          `**Passo 4 — Calcule.** $c^2 = ${(lado1 ** 2 + lado2 ** 2 - 2 * lado1 * lado2 * Math.cos((angTri * Math.PI) / 180)).toFixed(2)}$, então $c \\approx ${Math.sqrt(lado1 ** 2 + lado2 ** 2 - 2 * lado1 * lado2 * Math.cos((angTri * Math.PI) / 180)).toFixed(2)}$.\n\n` +
          `**Por que essa lei?** Generaliza Pitágoras para triângulos não-retângulos. Quando $C = 90°$, $\\cos C = 0$ e a fórmula vira $c^2 = a^2 + b^2$ (Pitágoras). O termo $-2ab\\cos C$ "ajusta" pela falta de retângulo.\n\n` +
          `**Aplicação.** Topografia, navegação, força resultante (regra do paralelogramo).`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-15-leis-senos-cossenos'],
      },
      {
        numero: 5,
        enunciado: `PA com $a_1 = ${a1}$ e razão $r = ${razao}$. Calcule $a_{${n}}$ e a soma $S_{${n}}$.`,
        resposta: `$a_{${n}} = ${a1 + (n - 1) * razao}$, $S_{${n}} = ${(n * (a1 + (a1 + (n - 1) * razao))) / 2}$`,
        passos:
          `**Passo 1 — Termo geral.** $a_n = a_1 + (n-1)r$. Aqui $a_{${n}} = ${a1} + (${n}-1) \\cdot ${razao} = ${a1} + ${(n - 1) * razao} = ${a1 + (n - 1) * razao}$.\n\n` +
          `**Passo 2 — Soma de termos (fórmula de Gauss).** $S_n = n(a_1 + a_n)/2 = ${n} \\cdot (${a1} + ${a1 + (n - 1) * razao})/2 = ${n} \\cdot ${a1 + a1 + (n - 1) * razao}/2 = ${(n * (a1 + (a1 + (n - 1) * razao))) / 2}$.\n\n` +
          `**Por que essas fórmulas?** PA tem **diferença constante**: cada termo é o anterior + r. Após $n-1$ passos: $a_n = a_1 + (n-1)r$. Para a soma, **truque de Gauss criança** (~1789): some os termos em pares simétricos (1.º + último, 2.º + penúltimo, etc.) — cada par soma $a_1 + a_n$, há $n/2$ pares.\n\n` +
          `**Verificação.** ${a1}, ${a1 + razao}, ${a1 + 2 * razao}, ..., ${a1 + (n - 1) * razao}. Soma rápida com $n$ pequeno bate.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-17-pa'],
      },
      {
        numero: 6,
        enunciado: `Calcule a soma da PG infinita $1 + 1/${a + 1} + 1/${(a + 1) ** 2} + 1/${(a + 1) ** 3} + \\ldots$.`,
        resposta: `$\\frac{${a + 1}}{${a}}$`,
        passos:
          `**Passo 1 — Identifique $a_1$ e $q$.** Primeiro termo $a_1 = 1$. Razão $q = 1/${a + 1}$.\n\n` +
          `**Passo 2 — Verifique convergência.** $|q| = 1/${a + 1} < 1$, então a série infinita converge. (Se fosse $\\geq 1$, divergeria.)\n\n` +
          `**Passo 3 — Aplique a fórmula.** $S_\\infty = a_1/(1 - q) = 1/(1 - 1/${a + 1}) = 1/(${a}/${a + 1}) = ${a + 1}/${a}$.\n\n` +
          `**Por que a fórmula vale só para $|q| < 1$?** Se $|q| < 1$, $q^n \\to 0$ e $S_n = a_1 \\frac{1 - q^n}{1 - q} \\to \\frac{a_1}{1 - q}$. Se $|q| \\geq 1$, $q^n$ não vai a zero, e a soma cresce sem limite.\n\n` +
          `**Aplicação histórica.** Paradoxo de Zenão: somar metade + metade da metade + ... = 1. Se o caminho fosse infinitos passos com soma infinita, Aquiles nunca alcançaria a tartaruga. Mas a soma é finita ⟹ ele alcança.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-18-pg'],
      },
      {
        numero: 7,
        enunciado: `Calcule $\\lim_{n \\to \\infty} \\frac{${a}n + ${b}}{${razao}n + ${a1}}$.`,
        resposta: `$${a}/${razao}$`,
        passos:
          `**Passo 1 — Tipo de indeterminação.** Quando $n \\to \\infty$, numerador e denominador vão a $\\infty$. Forma $\\infty/\\infty$.\n\n` +
          `**Passo 2 — Divida tudo por $n$ (truque para razão de polinômios).** $\\frac{${a} + ${b}/n}{${razao} + ${a1}/n}$.\n\n` +
          `**Passo 3 — Tome o limite.** $${b}/n \\to 0$ e $${a1}/n \\to 0$. Restou $${a}/${razao}$.\n\n` +
          `**Por que esse truque?** Razão de polinômios de mesmo grau no infinito tem limite igual à **razão dos coeficientes líderes**. É consequência direta de dividir por $n^k$ (maior potência) em ambos os lados.\n\n` +
          `**Generalização.** Se $\\deg(P) > \\deg(Q)$: limite $= \\pm\\infty$. Se $\\deg(P) < \\deg(Q)$: limite $= 0$. Mesmo grau: razão dos líderes.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-19-limite-intuitivo'],
      },
      {
        numero: 8,
        enunciado: `Você está a 50 m da base de uma torre. Mede o ângulo de elevação ao topo: ${angTri === 90 ? 60 : angTri}°. Qual a altura da torre?`,
        resposta: `$50 \\tan(${angTri === 90 ? 60 : angTri}°) \\approx ${(50 * Math.tan(((angTri === 90 ? 60 : angTri) * Math.PI) / 180)).toFixed(2)}$ m`,
        passos:
          `**Passo 1 — Modelo geométrico.** Triângulo retângulo: cateto adjacente = 50 m (distância horizontal), cateto oposto = altura $h$, ângulo de elevação = ${angTri === 90 ? 60 : angTri}° no vértice onde você está.\n\n` +
          `**Passo 2 — Use tangente.** $\\tan(\\text{ângulo}) = \\text{oposto}/\\text{adjacente} = h/50 \\Rightarrow h = 50 \\tan(${angTri === 90 ? 60 : angTri}°)$.\n\n` +
          `**Passo 3 — Calcule.** $\\tan(${angTri === 90 ? 60 : angTri}°) \\approx ${Math.tan(((angTri === 90 ? 60 : angTri) * Math.PI) / 180).toFixed(4)}$, então $h \\approx ${(50 * Math.tan(((angTri === 90 ? 60 : angTri) * Math.PI) / 180)).toFixed(2)}$ m.\n\n` +
          `**Por que tangente?** Pela definição: tangente do ângulo agudo = cateto oposto / cateto adjacente. Em problemas de elevação/depressão, é a razão direta entre altura e distância.\n\n` +
          `**Onde aparece?** Topografia (medir altura sem subir), navegação (calcular distância de farol), engenharia (rampas).`,
        dificuldade: 'modelagem',
        aulasCobertas: ['aula-11-trig-triangulo'],
      },
    ]
  },
}

// -----------------------------------------------------------------------------
// Templates simplificados para os outros 10 trims
// (questões menos parametrizadas, mas com 10 versões pela seed afetar valores)
// -----------------------------------------------------------------------------

function templateGenerico(
  trim: number,
  tituloBase: string,
  descricao: string,
  publicoAlvo: Prova['publicoAlvo'],
  intensidade: Prova['intensidade'],
  questoesBase: (v: number, r: () => number) => Questao[],
): TrimTemplate {
  return {
    trim,
    publicoAlvo,
    intensidade,
    duracaoMinutos: 90,
    tituloBase,
    descricao,
    geraQuestoes: (v) => questoesBase(v, lcg(v * 113)),
  }
}

const TEMPLATE_TRIM_3 = templateGenerico(
  3,
  'Geometria Analítica e Vetores',
  'Trim 3 do Ano 1: plano cartesiano, retas, cônicas, vetores, sistemas lineares.',
  '1.º ano',
  3,
  (v, r) => {
    const x1 = intRange(1, 5, r), y1 = intRange(1, 5, r)
    const x2 = x1 + intRange(3, 7, r), y2 = y1 + intRange(3, 7, r)
    const dx = x2 - x1, dy = y2 - y1
    const d = Math.sqrt(dx * dx + dy * dy)
    const a1 = intRange(2, 6, r), a2 = intRange(2, 6, r)
    const radius = intRange(3, 8, r)
    return [
      {
        numero: 1,
        enunciado: `Calcule a distância entre $(${x1}, ${y1})$ e $(${x2}, ${y2})$.`,
        resposta: `$${d.toFixed(2)}$`,
        passos:
          `**Passo 1 — Fórmula da distância.** $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.\n\n**Passo 2 — Substitua.** $d = \\sqrt{${dx}^2 + ${dy}^2} = \\sqrt{${dx * dx + dy * dy}} \\approx ${d.toFixed(2)}$.\n\n**Por quê?** A fórmula vem de **Pitágoras** aplicado ao triângulo retângulo formado pelas projeções dos pontos nos eixos. Os catetos são $|\\Delta x|$ e $|\\Delta y|$, a hipotenusa é a distância.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-21-plano-cartesiano'],
      },
      {
        numero: 2,
        enunciado: `Equação da reta passando por $(${x1}, ${y1})$ e $(${x2}, ${y2})$.`,
        resposta: `$y = ${(dy / dx).toFixed(2)}(x - ${x1}) + ${y1}$`,
        passos:
          `**Passo 1 — Inclinação.** $m = (y_2 - y_1)/(x_2 - x_1) = ${dy}/${dx} = ${(dy / dx).toFixed(2)}$.\n\n**Passo 2 — Forma ponto-inclinação.** $y - y_1 = m(x - x_1) \\Rightarrow y = ${(dy / dx).toFixed(2)}(x - ${x1}) + ${y1}$.\n\n**Por quê?** Toda reta no plano com inclinação $m$ e passando por $(x_1, y_1)$ tem essa forma — é a definição mesmo de "reta com inclinação m". Você pode reorganizar para forma reduzida $y = mx + b$ se quiser.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-22-equacao-reta'],
      },
      {
        numero: 3,
        enunciado: `Equação da circunferência centro $(${x1}, ${y1})$ e raio ${radius}.`,
        resposta: `$(x - ${x1})^2 + (y - ${y1})^2 = ${radius * radius}$`,
        passos:
          `**Passo 1 — Forma reduzida.** $(x - h)^2 + (y - k)^2 = r^2$ com centro $(h, k)$ e raio $r$.\n\n**Passo 2 — Substitua.** $(x - ${x1})^2 + (y - ${y1})^2 = ${radius}^2 = ${radius * radius}$.\n\n**Por quê?** A circunferência é o **lugar geométrico** dos pontos a distância $r$ do centro. Aplicando a fórmula da distância e elevando ao quadrado para limpar a raiz, obtém-se a forma reduzida.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-24-circunferencia'],
      },
      {
        numero: 4,
        enunciado: `Calcule $(${a1}, ${a2}) \\cdot (${dy}, ${dx})$ e o ângulo entre eles.`,
        resposta: `Produto = $${a1 * dy + a2 * dx}$. Ângulo $\\approx ${(Math.acos((a1 * dy + a2 * dx) / (Math.sqrt(a1 ** 2 + a2 ** 2) * Math.sqrt(dy ** 2 + dx ** 2))) * 180 / Math.PI).toFixed(1)}°$`,
        passos:
          `**Passo 1 — Produto escalar.** $\\vec u \\cdot \\vec v = u_1 v_1 + u_2 v_2 = ${a1} \\cdot ${dy} + ${a2} \\cdot ${dx} = ${a1 * dy + a2 * dx}$.\n\n**Passo 2 — Módulos.** $|\\vec u| = \\sqrt{${a1}^2 + ${a2}^2} = ${Math.sqrt(a1 ** 2 + a2 ** 2).toFixed(2)}$, $|\\vec v| = ${Math.sqrt(dy ** 2 + dx ** 2).toFixed(2)}$.\n\n**Passo 3 — Cosseno do ângulo.** $\\cos\\theta = \\vec u \\cdot \\vec v / (|\\vec u||\\vec v|) = ${(a1 * dy + a2 * dx) / (Math.sqrt(a1 ** 2 + a2 ** 2) * Math.sqrt(dy ** 2 + dx ** 2))}$.\n\n**Por quê?** Produto escalar é **bilinear** e mede projeção: $\\vec u \\cdot \\vec v = |\\vec u||\\vec v|\\cos\\theta$. Quando vetores são perpendiculares, $\\cos = 0$ e produto = 0 — critério de ortogonalidade.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-27-produto-escalar'],
      },
      {
        numero: 5,
        enunciado: `Resolva o sistema $\\begin{cases} ${a1}x + ${a2}y = ${a1 * x1 + a2 * y1} \\\\ x - y = ${x1 - y1} \\end{cases}$.`,
        resposta: `$x = ${x1}, y = ${y1}$`,
        passos:
          `**Passo 1 — Da segunda equação.** $x = y + ${x1 - y1}$.\n\n**Passo 2 — Substitua na primeira.** $${a1}(y + ${x1 - y1}) + ${a2}y = ${a1 * x1 + a2 * y1}$. Expandindo: $${a1}y + ${a1 * (x1 - y1)} + ${a2}y = ${a1 * x1 + a2 * y1}$. Simplificando: $${a1 + a2}y = ${a1 * x1 + a2 * y1 - a1 * (x1 - y1)} = ${a1 * y1 + a2 * y1}$, então $y = ${y1}$.\n\n**Passo 3 — Volte.** $x = ${y1} + ${x1 - y1} = ${x1}$.\n\n**Por que substituição?** Em sistemas 2x2, isolar uma variável e substituir é direto. Para sistemas maiores, usa-se escalonamento (Gauss) ou Cramer (matrizes). Geometricamente, é a interseção de duas retas no plano.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-29-sistemas-lineares'],
      },
      {
        numero: 6,
        enunciado: `Massa de ${a1 * 5} kg em rampa $30°$ sem atrito. Aceleração de descida (g = 10 m/s²)?`,
        resposta: `$5$ m/s²`,
        passos:
          `**Passo 1 — Decompor a gravidade.** $\\vec g$ aponta para baixo. Em rampa de inclinação $\\theta$, decompõe-se em **paralela à rampa** ($g \\sin\\theta$, faz o objeto descer) e **normal à rampa** ($g \\cos\\theta$, equilibrada pela força normal).\n\n**Passo 2 — Aplique.** Como sem atrito, só a componente paralela acelera o objeto. $a = g \\sin(30°) = 10 \\cdot 0,5 = 5$ m/s².\n\n**Por que essa decomposição?** Vetorialmente, a base "natural" para movimento na rampa é {paralela, normal}. Componentes de $\\vec g$ nessa base: $g\\sin\\theta$ e $g\\cos\\theta$. A massa cancela porque $F = ma$ e $F = mg\\sin\\theta \\Rightarrow a = g\\sin\\theta$ — independe da massa.\n\n**Aplicação.** Galileu derrubou a impressão de que objetos pesados caem mais rápido com experimentos em rampas (Pisa, fim do séc. XVI).`,
        dificuldade: 'modelagem',
        aulasCobertas: ['aula-28-aplicacoes-vetores-fisica'],
      },
    ]
  },
)

const TEMPLATE_TRIM_4 = templateGenerico(
  4,
  'Matrizes, Combinatória e Probabilidade',
  'Trim 4 do Ano 1: matrizes, determinantes, sistemas, PFC, permutações, combinações, probabilidade.',
  '1.º ano',
  3,
  (v, r) => {
    const a = intRange(2, 7, r), b = intRange(1, 5, r), c = intRange(1, 5, r), d = intRange(2, 7, r)
    const det = a * d - b * c
    const n = intRange(5, 9, r), k = intRange(2, Math.min(4, n - 1), r)
    const fact = (x: number): number => (x <= 1 ? 1 : x * fact(x - 1))
    const comb = fact(n) / (fact(k) * fact(n - k))
    return [
      {
        numero: 1,
        enunciado: `Calcule $\\det \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$.`,
        resposta: `$${det}$`,
        passos:
          `**Passo 1 — Fórmula 2x2.** $\\det = ad - bc = ${a} \\cdot ${d} - ${b} \\cdot ${c} = ${a * d} - ${b * c} = ${det}$.\n\n**Por que essa fórmula?** O determinante 2x2 mede a **área orientada** do paralelogramo formado pelas colunas $(a, c)$ e $(b, d)$. Quando $\\det = 0$, as colunas são paralelas (área nula) e a matriz não é invertível.\n\n**Conexão.** Determinante zero ⟺ sistema linear não tem solução única. É o teste de invertibilidade.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-34-determinantes'],
      },
      {
        numero: 2,
        enunciado: `Calcule a inversa de $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$.`,
        resposta: det !== 0
          ? `$A^{-1} = \\frac{1}{${det}}\\begin{pmatrix} ${d} & -${b} \\\\ -${c} & ${a} \\end{pmatrix}$`
          : 'Não existe (det = 0).',
        passos:
          det !== 0
            ? `**Passo 1 — Fórmula 2x2.** $A^{-1} = \\frac{1}{\\det A}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$.\n\n**Passo 2 — Substituir.** $A^{-1} = \\frac{1}{${det}}\\begin{pmatrix} ${d} & -${b} \\\\ -${c} & ${a} \\end{pmatrix}$.\n\n**Por quê?** A inversa "desfaz" a matriz: $A A^{-1} = I$. A fórmula vem de resolver o sistema $A X = I$ entrada por entrada.\n\n**Verificação.** $A \\cdot A^{-1}$ deve dar identidade.`
            : `Como $\\det A = 0$, $A$ não é invertível. **Por quê?** Det zero = colunas linearmente dependentes = matriz "achata" o plano em uma reta. Não tem como reverter essa perda de informação.`,
        dificuldade: 'compreensao',
        aulasCobertas: ['aula-33-transposta-inversa'],
      },
      {
        numero: 3,
        enunciado: `Quantos anagramas tem a palavra "${'CASA'.substring(0, 3 + (v % 3))}" (letras pertinentes)?`,
        resposta: `${(() => {
          const w = 'CASA'.substring(0, 3 + (v % 3))
          const counts: Record<string, number> = {}
          for (const ch of w) counts[ch] = (counts[ch] ?? 0) + 1
          let denom = 1
          for (const c of Object.values(counts)) denom *= fact(c)
          return fact(w.length) / denom
        })()}`,
        passos:
          `**Passo 1 — Conte letras totais e repetições.** Letras: ${'CASA'.substring(0, 3 + (v % 3)).length}. Repetições: identifique letras que aparecem mais de uma vez.\n\n**Passo 2 — Fórmula de permutação com repetição.** $P = n!/(n_1! n_2! \\ldots)$, onde $n_i$ é a multiplicidade de cada letra.\n\n**Por quê?** Sem repetição, seriam $n!$ permutações. Mas trocar duas letras iguais (digamos dois A's) **não gera anagrama novo**, então dividimos pelas $n_i!$ permutações internas indistinguíveis.\n\n**Insight.** Anagramas de "AAA" = $3!/3! = 1$ — só uma palavra possível.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-37-permutacoes-arranjos'],
      },
      {
        numero: 4,
        enunciado: `Em uma turma de ${n} pessoas, quantas comissões de ${k} podem ser formadas?`,
        resposta: `$\\binom{${n}}{${k}} = ${comb}$`,
        passos:
          `**Passo 1 — Identifique combinação ou arranjo.** Pergunta sobre **comissões**, sem distinção de papel — então **combinação** (ordem não importa).\n\n**Passo 2 — Fórmula.** $\\binom{n}{k} = \\frac{n!}{k!(n-k)!} = \\frac{${n}!}{${k}! \\cdot ${n - k}!} = ${comb}$.\n\n**Por que dividir por $k!$?** Cada comissão de $k$ pessoas pode ser **ordenada de $k!$ formas**, mas todas representam a mesma comissão. Como o arranjo $A_n^k$ conta cada combinação $k!$ vezes, divide-se por $k!$.\n\n**Aplicação.** Mega-Sena: $\\binom{60}{6} = 50.063.860$ jogos diferentes — daí ser difícil ganhar.`,
        dificuldade: 'aplicacao',
        aulasCobertas: ['aula-38-combinacoes'],
      },
      {
        numero: 5,
        enunciado: `Lance ${k} dados honestos. $P(\\text{soma} = ${k * 4})$?`,
        resposta: `Depende de $k$. Para $k=2$: 3/36 (combinações 4-4, etc.) — calcular manualmente.`,
        passos:
          `**Passo 1 — Espaço amostral.** Lançar $k$ dados → $6^k$ resultados igualmente prováveis.\n\n**Passo 2 — Casos favoráveis (soma = ${k * 4}).** Conte triplas/duplas que somam ${k * 4}. Para 2 dados (k=2) somando 8: (2,6), (3,5), (4,4), (5,3), (6,2) — 5 casos.\n\n**Passo 3 — Probabilidade.** $P = \\text{favoráveis}/\\text{total}$.\n\n**Por que igualmente prováveis?** Dado honesto: cada face tem prob $1/6$. Independência entre dados → probabilidade conjunta = produto.\n\n**Aplicação.** Em jogos com dados, a soma 7 (k=2) é a mais frequente — 6 combinações em 36, prob 1/6.`,
        dificuldade: 'modelagem',
        aulasCobertas: ['aula-39-probabilidade'],
      },
      {
        numero: 6,
        enunciado: `Doença com $P(D) = 0,01$. Teste com sensibilidade ${85 + (v % 10)}\\%$, especificidade ${90 + (v % 5)}\\%$. $P(D | +)$?`,
        resposta: `Depende dos parâmetros, mas tipicamente $\\sim 5-10\\%$ — base rate fallacy.`,
        passos:
          `**Bayes**: $P(D|+) = P(+|D) \\cdot P(D) / P(+)$.\n\n**Passo 1 — Identifique as probabilidades.** $P(+|D) = $ sensibilidade. $P(+|D^c) = 1 - $ especificidade.\n\n**Passo 2 — Lei da probabilidade total.** $P(+) = P(+|D)P(D) + P(+|D^c)P(D^c)$.\n\n**Passo 3 — Substitua e calcule** (use os valores específicos da versão).\n\n**Por que o resultado é baixo mesmo com testes 90-95% precisos?** **Base rate fallacy**: doença rara ($P(D) = 1\\%$) significa que a maioria dos positivos são **falsos positivos** (porque $P(D^c)$ é 99%). Isso explica por que testes de massa exigem cuidados especiais — Aula 39 detalha.`,
        dificuldade: 'modelagem',
        aulasCobertas: ['aula-39-probabilidade'],
      },
    ]
  },
)

// -----------------------------------------------------------------------------
// Trims 5-12: stubs com 5-6 questões cada, parametrizadas
// -----------------------------------------------------------------------------

function templateMinimo(trim: number, titulo: string, descricao: string, publico: Prova['publicoAlvo'], questoesFn: (v: number) => Questao[]): TrimTemplate {
  return {
    trim,
    publicoAlvo: publico,
    intensidade: 3,
    duracaoMinutos: 90,
    tituloBase: titulo,
    descricao,
    geraQuestoes: questoesFn,
  }
}

const TEMPLATE_TRIM_5 = templateMinimo(5, 'Limites e continuidade', 'Trim 5 do Ano 2: ε-δ, propriedades, fundamentais, continuidade, TVI.', '2.º ano', (v) => {
  const r = lcg(v * 17)
  const a = intRange(2, 5, r), b = intRange(1, 4, r), k = intRange(2, 6, r)
  return [
    {
      numero: 1,
      enunciado: `Calcule $\\lim_{x \\to ${a}} (${b}x^2 - ${k}x + 1)$.`,
      resposta: `$${b * a * a - k * a + 1}$`,
      passos: `**Passo 1 — Continuidade da função polinomial.** Polinômios são contínuos em $\\mathbb{R}$, então $\\lim_{x \\to a} P(x) = P(a)$.\n\n**Passo 2 — Substitua.** $P(${a}) = ${b} \\cdot ${a}^2 - ${k} \\cdot ${a} + 1 = ${b * a * a} - ${k * a} + 1 = ${b * a * a - k * a + 1}$.\n\n**Por quê?** Por **continuidade**: o limite quando $x$ se aproxima de $a$ é exatamente $P(a)$, sem indeterminação. Só precisamos manipular quando temos formas $0/0$, $\\infty/\\infty$, etc.`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-42-propriedades-limites'],
    },
    {
      numero: 2,
      enunciado: `Calcule $\\lim_{x \\to 0} \\frac{\\sin(${k}x)}{x}$.`,
      resposta: `$${k}$`,
      passos: `**Passo 1 — Limite fundamental.** Sabemos $\\lim_{u \\to 0} \\sin(u)/u = 1$.\n\n**Passo 2 — Manipulação algébrica.** $\\sin(${k}x)/x = ${k} \\cdot \\sin(${k}x)/(${k}x)$. Substitua $u = ${k}x$ — quando $x \\to 0$, $u \\to 0$.\n\n**Passo 3 — Aplique.** $\\lim = ${k} \\cdot 1 = ${k}$.\n\n**Por que esse truque?** A regra geral $\\lim_{x \\to 0} \\sin(kx)/x = k$ vem de adaptar o limite fundamental por mudança de variável + linearidade do limite.\n\n**Alternativa (L'Hôpital).** Forma 0/0: deriva em cima e embaixo. $(\\sin(kx))' = k\\cos(kx) \\to k$, $(x)' = 1$. Razão $\\to k$.`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-45-limites-fundamentais'],
    },
    {
      numero: 3,
      enunciado: `$\\lim_{x \\to \\infty} \\frac{${a}x^2 + ${b}x}{${k}x^2 + 1}$.`,
      resposta: `$${a}/${k}$`,
      passos: `**Passo 1 — Forma indeterminada $\\infty/\\infty$.** Numerador e denominador vão a infinito.\n\n**Passo 2 — Divida tudo por $x^2$ (maior potência).** $\\frac{${a} + ${b}/x}{${k} + 1/x^2}$.\n\n**Passo 3 — Termos $\\to 0$.** $${b}/x \\to 0$, $1/x^2 \\to 0$. Sobra $${a}/${k}$.\n\n**Por quê?** Razão de polinômios de mesmo grau no infinito = razão dos coeficientes líderes. Truque universal e infalível para esse tipo.`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-44-limites-laterais'],
    },
    {
      numero: 4,
      enunciado: `A função $f(x) = (x^2 - ${a * a})/(x - ${a})$ é contínua em $x = ${a}$? Conserte se possível.`,
      resposta: `Não é definida em $x = ${a}$. Defina $f(${a}) = ${2 * a}$ — descontinuidade removível.`,
      passos: `**Passo 1 — Verifique se está definida.** Em $x = ${a}$, denominador zera → não definida. Ainda assim, queremos saber se há **descontinuidade removível**.\n\n**Passo 2 — Calcule o limite.** Fatore: $(x^2 - ${a * a})/(x - ${a}) = (x - ${a})(x + ${a})/(x - ${a}) = x + ${a}$ (para $x \\neq ${a}$). Logo $\\lim_{x \\to ${a}} f(x) = ${2 * a}$.\n\n**Passo 3 — Conserte.** Definindo $\\tilde f(${a}) = ${2 * a}$ e $\\tilde f = f$ no resto, obtemos função contínua.\n\n**Por que "removível"?** Porque o limite **existe e é finito**. Se o limite fosse $\\infty$ ou diferente dos lados, não daria pra "preencher o buraco".`,
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-43-continuidade'],
    },
    {
      numero: 5,
      enunciado: `Mostre via TVI que $x^3 - ${a}x - 1 = 0$ tem raiz em $(${1}, ${2})$.`,
      resposta: 'Sim, por TVI.',
      passos: `**Passo 1 — TVI requer continuidade.** $f(x) = x^3 - ${a}x - 1$ é polinomial, logo contínua em $\\mathbb{R}$. ✓\n\n**Passo 2 — Avalie nos extremos.**\n- $f(1) = 1 - ${a} - 1 = ${-a}$ (negativo).\n- $f(2) = 8 - ${2 * a} - 1 = ${7 - 2 * a}$.\n\n**Passo 3 — Sinal oposto?** Se $f(1) \\cdot f(2) < 0$, há raiz por TVI.\n\n**Por que TVI?** Porque uma função contínua que muda de sinal **deve passar por zero** em algum ponto intermediário (não pode "pular" zero sem ser contínua). Esta é a base do **método da bisseção**.`,
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-46-tvi-tvm'],
    },
    {
      numero: 6,
      enunciado: `$\\lim_{x \\to \\infty}(1 + ${k}/x)^x$.`,
      resposta: `$e^{${k}}$`,
      passos: `**Passo 1 — Reconheça o padrão.** Limite fundamental $\\lim_{x \\to \\infty}(1 + 1/x)^x = e$.\n\n**Passo 2 — Generalização.** $\\lim_{x \\to \\infty}(1 + a/x)^x = e^a$. Aqui $a = ${k}$, então o limite é $e^{${k}}$.\n\n**Por quê?** Capitalização contínua: investir a taxa $a$ por ano, capitalizado $x$ vezes, no limite $x \\to \\infty$ dá $e^a$. **Origem do número $e$**.\n\n**Demonstração esquemática.** Aplique $\\ln$: $\\ln L = x \\ln(1 + a/x) \\sim x \\cdot a/x = a$ (Taylor de $\\ln(1+u) \\sim u$). Logo $L = e^a$.`,
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-45-limites-fundamentais'],
    },
  ]
})

const TEMPLATE_TRIM_6 = templateMinimo(6, 'Derivadas: definição e regras', 'Trim 6 do Ano 2: derivada via limite, regras, cadeia, implícita.', '2.º ano', (v) => {
  const r = lcg(v * 19)
  const a = intRange(2, 6, r), b = intRange(1, 5, r), k = intRange(2, 5, r)
  return [
    {
      numero: 1,
      enunciado: `Derive $f(x) = ${a}x^${k+1}$.`,
      resposta: `$f'(x) = ${a * (k + 1)}x^${k}$`,
      passos: `**Passo 1 — Regra da potência.** $(x^n)' = n x^{n-1}$.\n\n**Passo 2 — Linearidade.** $(c f)' = c f'$. Aqui $c = ${a}$, $n = ${k + 1}$.\n\n**Passo 3 — Aplique.** $f'(x) = ${a} \\cdot ${k + 1} \\cdot x^{${k}} = ${a * (k + 1)} x^${k}$.\n\n**Por que essa regra?** Vem da definição de derivada + binômio de Newton: $\\lim_{h \\to 0}((x+h)^n - x^n)/h$. O termo dominante após cancelar $x^n$ é $n x^{n-1} h$, e dividir por $h$ deixa $n x^{n-1}$.`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-52-regras-derivacao'],
    },
    {
      numero: 2,
      enunciado: `Derive $f(x) = (x^2 + ${b})\\sin x$.`,
      resposta: `$f'(x) = 2x \\sin x + (x^2 + ${b})\\cos x$`,
      passos: `**Passo 1 — Regra do produto.** $(uv)' = u'v + uv'$ com $u = x^2 + ${b}$, $v = \\sin x$.\n\n**Passo 2 — Calcule cada derivada.** $u' = 2x$, $v' = \\cos x$.\n\n**Passo 3 — Combine.** $f' = 2x \\cdot \\sin x + (x^2 + ${b}) \\cdot \\cos x$.\n\n**Por que produto não se reduz a $u'v'$?** Porque $f$ depende dos **dois fatores**: variar $u$ enquanto fixa $v$, e vice-versa. A taxa total combina os dois efeitos.\n\n**Demonstração.** $\\lim_h (u(x+h)v(x+h) - u(x)v(x))/h$. Soma e subtraia $u(x)v(x+h)$: separa em duas razões incrementais.`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-52-regras-derivacao'],
    },
    {
      numero: 3,
      enunciado: `Derive $f(x) = \\sin(${a}x^2 + ${b})$.`,
      resposta: `$f'(x) = ${2 * a}x \\cos(${a}x^2 + ${b})$`,
      passos: `**Passo 1 — Regra da cadeia.** $(\\sin g)' = \\cos g \\cdot g'$.\n\n**Passo 2 — Identifique $g$.** $g = ${a}x^2 + ${b}$, $g' = ${2 * a}x$.\n\n**Passo 3 — Combine.** $f' = \\cos(${a}x^2 + ${b}) \\cdot ${2 * a}x = ${2 * a}x\\cos(${a}x^2 + ${b})$.\n\n**Por que cadeia?** $f$ é composição de funções: $\\sin$ aplicado a $g$. A taxa de variação de $f$ em relação a $x$ é o produto da taxa em $g$ pela taxa de $g$ em $x$ — "**multiplica derivadas das camadas**".`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-53-regra-cadeia'],
    },
    {
      numero: 4,
      enunciado: `Reta tangente a $y = x^${k+1}$ em $x = ${a}$.`,
      resposta: `$y = ${(k + 1) * a ** k}(x - ${a}) + ${a ** (k + 1)}$`,
      passos: `**Passo 1 — Derivada (= inclinação tangente).** $y' = ${k + 1}x^${k}$, $y'(${a}) = ${(k + 1) * a ** k}$.\n\n**Passo 2 — Ponto de tangência.** $y(${a}) = ${a ** (k + 1)}$.\n\n**Passo 3 — Equação ponto-inclinação.** $y - y_0 = m(x - x_0)$ com $m = ${(k + 1) * a ** k}$, $(x_0, y_0) = (${a}, ${a ** (k + 1)})$.\n\n**Por que tangente = derivada?** Geometricamente, tangente é o "limite das retas secantes" quando os dois pontos colapsam. A inclinação dessa secante é o quociente $\\Delta y/\\Delta x$, que no limite vira $f'(x)$.`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-51-derivada-definicao'],
    },
    {
      numero: 5,
      enunciado: `Derive implicitamente $x^2 + y^2 = ${a + b}$.`,
      resposta: `$y' = -x/y$`,
      passos: `**Passo 1 — Derive ambos os lados em relação a $x$.** Trate $y$ como função de $x$.\n\n**Passo 2 — Aplique cadeia em $y^2$.** $(y^2)' = 2y \\cdot y'$ (não esqueça do $y'$ — cadeia!).\n\n**Passo 3 — Equação resultante.** $2x + 2yy' = 0$.\n\n**Passo 4 — Isole $y'$.** $y' = -x/y$.\n\n**Por que cadeia em $y$?** Porque $y$ depende de $x$ (implicitamente). Derivar $y^2$ em relação a $x$ usa cadeia: $(y(x))^2$ derivado é $2 y(x) \\cdot y'(x)$.\n\n**Aplicação.** Tangente a círculo $x^2 + y^2 = r^2$ em $(x_0, y_0)$: inclinação $-x_0/y_0$, perpendicular ao raio.`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-54-derivadas-implicitas'],
    },
    {
      numero: 6,
      enunciado: `Posição $s(t) = t^3 - ${3 * a}t^2 + ${3 * a * a}t$. Velocidade em $t = ${a}$? Aceleração?`,
      resposta: `$v(${a}) = 0$, $a(${a}) = 0$.`,
      passos: `**Passo 1 — Velocidade = derivada da posição.** $v(t) = s'(t) = 3t^2 - ${6 * a}t + ${3 * a * a}$.\n\n**Passo 2 — Aceleração = derivada da velocidade.** $a(t) = v'(t) = 6t - ${6 * a}$.\n\n**Passo 3 — Em $t = ${a}$.** $v(${a}) = 3 \\cdot ${a * a} - ${6 * a} \\cdot ${a} + ${3 * a * a} = ${3 * a * a - 6 * a * a + 3 * a * a} = 0$. $a(${a}) = ${6 * a} - ${6 * a} = 0$.\n\n**Por que isso pode acontecer?** Em $t = ${a}$, a partícula está **momentaneamente em repouso e sem aceleração** (ponto de inflexão da posição). É o tipo de informação que derivadas extraem.`,
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-55-derivadas-superiores'],
    },
  ]
})

const TEMPLATE_TRIM_7 = templateMinimo(7, 'Aplicações da derivada', 'Trim 7 do Ano 2: otimização, L\'Hôpital, Taylor, esboço, Newton.', '2.º ano', (v) => {
  const r = lcg(v * 23)
  const a = intRange(2, 5, r), b = intRange(2, 6, r)
  return [
    {
      numero: 1,
      enunciado: `Encontre máximo e mínimo locais de $f(x) = x^3 - ${3 * a}x^2 + ${3 * a * a - b}x$.`,
      resposta: `Pontos críticos via $f' = 0$. Use teste 2ª derivada para classificar.`,
      passos: `**Passo 1 — Pontos críticos.** $f' = 3x^2 - ${6 * a}x + ${3 * a * a - b} = 0$. Use Bhaskara: $x = (${6 * a} \\pm \\sqrt{${36 * a * a} - 12(${3 * a * a - b})})/6$.\n\n**Passo 2 — Teste da 2ª derivada.** $f'' = 6x - ${6 * a}$. Em cada ponto crítico, se $f'' > 0$ é mínimo; se $f'' < 0$ é máximo.\n\n**Por que ponto crítico = candidato a extremo?** Pelo Teorema de Fermat: se $f$ tem extremo interior diferenciável, $f' = 0$ aí. (Recíproca falsa: $f' = 0$ em ponto de inflexão também.)\n\n**Aplicação.** Otimização: maximizar lucro, minimizar custo, encontrar caminho mínimo (variacional).`,
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-61-maximos-minimos'],
    },
    {
      numero: 2,
      enunciado: `Cerca para retangular contra parede com ${100 * a} m de cerca (3 lados). Maximize a área.`,
      resposta: `$x = ${25 * a}$, $y = ${50 * a}$, área = $${1250 * a * a}$ m².`,
      passos: `**Passo 1 — Modelagem.** Parede usa 1 lado, cerca os outros 3. Sejam $x$ (perpendicular à parede) e $y$ (paralela). Restrição: $2x + y = ${100 * a}$.\n\n**Passo 2 — Função objetivo.** Área $A(x) = x \\cdot y = x(${100 * a} - 2x) = ${100 * a}x - 2x^2$.\n\n**Passo 3 — Otimize.** $A'(x) = ${100 * a} - 4x = 0 \\Rightarrow x = ${25 * a}$. Logo $y = ${50 * a}$ e $A_{\\max} = ${25 * a} \\cdot ${50 * a} = ${1250 * a * a}$.\n\n**Por que esse formato?** Em problemas de otimização com restrição: 1) escreva quantidade a otimizar; 2) use restrição pra eliminar variável; 3) derive e iguale a zero; 4) verifique 2ª derivada (negativa = máximo).\n\n**Lição** profunda: o ótimo dá $x = y/2$ — metade da cerca em cada direção (intuição "simétrica" enviesada porque parede gratuita).`,
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-62-otimizacao'],
    },
    {
      numero: 3,
      enunciado: `$\\lim_{x \\to 0} \\sin(x)/x$ via L'Hôpital.`,
      resposta: `$1$`,
      passos: `**Passo 1 — Forma 0/0.** Em $x = 0$: numerador $\\sin 0 = 0$, denominador $0$. Indeterminação válida para L'Hôpital.\n\n**Passo 2 — Derive cima e baixo.** $(\\sin x)' = \\cos x$, $(x)' = 1$.\n\n**Passo 3 — Limite da razão das derivadas.** $\\lim \\cos(x)/1 = \\cos 0 = 1$.\n\n**Por que L'Hôpital funciona?** Em $0/0$, ambas as funções "começam em zero". A razão das taxas de variação imediatamente após zero (= derivadas em zero) determina como elas se aproximam — é exatamente a razão dos limites.\n\n**Cuidado.** Só aplique se a forma é mesmo $0/0$ ou $\\infty/\\infty$. Aplicar em casos sem indeterminação dá errado.`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-64-l-hopital'],
    },
    {
      numero: 4,
      enunciado: `Polinômio de Taylor de grau 2 de $\\cos x$ em $a = 0$.`,
      resposta: `$T_2(x) = 1 - x^2/2$`,
      passos: `**Passo 1 — Fórmula de Taylor.** $T_n(x) = \\sum_{k=0}^n f^{(k)}(a)(x-a)^k/k!$.\n\n**Passo 2 — Calcule derivadas.** $\\cos(0) = 1$, $\\cos'(0) = -\\sin(0) = 0$, $\\cos''(0) = -\\cos(0) = -1$.\n\n**Passo 3 — Monte.** $T_2(x) = 1 + 0 \\cdot x + (-1) x^2/2 = 1 - x^2/2$.\n\n**Por que Taylor funciona?** A ideia é "achar polinômio que aproxima a função", concordando com ela na função e nas $n$ primeiras derivadas em $a$. Por isso usa derivadas $/k!$.\n\n**Aplicação.** Para $x$ pequeno, $\\cos x \\approx 1 - x^2/2$. Em programação, computa-se $\\cos$ via Taylor + redução de argumento.`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-65-taylor'],
    },
    {
      numero: 5,
      enunciado: `Newton-Raphson para $f(x) = x^2 - ${a + b}$ a partir de $x_0 = ${Math.ceil(Math.sqrt(a + b))}$. Calcule $x_2$.`,
      resposta: `$x_2 \\approx \\sqrt{${a + b}}$ com 4-5 dígitos.`,
      passos: `**Passo 1 — Fórmula.** $x_{n+1} = x_n - f(x_n)/f'(x_n)$. Aqui $f' = 2x$, então $x_{n+1} = (x_n + ${a + b}/x_n)/2$.\n\n**Passo 2 — Iteração 1.** $x_1 = (x_0 + ${a + b}/x_0)/2$. Calcule.\n\n**Passo 3 — Iteração 2.** $x_2 = (x_1 + ${a + b}/x_1)/2$.\n\n**Por que converge tão rápido?** Newton tem **convergência quadrática** próximo da raiz: número de dígitos certos dobra a cada iteração. Em 4-5 passos, atinge-se precisão de máquina (16 dígitos float).\n\n**Histórico.** Algoritmo babilônico (~2000 a.C.) para raiz quadrada usa exatamente essa iteração — Newton (1685) generalizou.`,
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-69-newton-raphson'],
    },
  ]
})

const TEMPLATE_TRIM_8 = templateMinimo(8, 'Estatística e probabilidade', 'Trim 8 do Ano 2: descritiva, binomial, normal, TCL, regressão, Bayes.', '2.º ano', (v) => {
  const r = lcg(v * 29)
  const n = intRange(8, 20, r), p = (intRange(2, 7, r)) / 10
  const mean = intRange(50, 80, r), std = intRange(5, 15, r)
  return [
    {
      numero: 1,
      enunciado: `Dados: $${5 + (v % 3)}, ${7 + (v % 3)}, ${10 + (v % 3)}, ${12 + (v % 3)}, ${16 + (v % 3)}$. Média e mediana.`,
      resposta: `Média = ${(5 + (v % 3) + 7 + (v % 3) + 10 + (v % 3) + 12 + (v % 3) + 16 + (v % 3)) / 5}, mediana = ${10 + (v % 3)}.`,
      passos: `**Passo 1 — Média (aritmética).** Soma / quantidade. $({5 + 7 + 10 + 12 + 16}) / 5 = 50/5 = 10$ (com offset por versão).\n\n**Passo 2 — Mediana.** Ordene os dados (já ordenados aqui) e pegue o do meio. Para $n = 5$ (ímpar), é o 3.º valor.\n\n**Por que duas medidas?** Média é sensível a outliers; mediana é robusta. Quando há valores extremos (renda, tempo de espera), reportar mediana é mais informativo. Em distribuições simétricas (normal), as duas coincidem.`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-71-medidas-centrais'],
    },
    {
      numero: 2,
      enunciado: `$X \\sim \\text{Bin}(${n}, ${p})$. $P(X = ${Math.floor(n * p)})$ (use $\\binom{n}{k}p^k(1-p)^{n-k}$).`,
      resposta: `$\\binom{${n}}{${Math.floor(n * p)}} \\cdot ${p}^{${Math.floor(n * p)}} \\cdot ${(1 - p).toFixed(2)}^{${n - Math.floor(n * p)}}$`,
      passos: `**Passo 1 — Fórmula da binomial.** $P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$.\n\n**Passo 2 — Identifique.** $n = ${n}$, $p = ${p}$, $k = ${Math.floor(n * p)}$.\n\n**Passo 3 — Calcule cada parte.** $\\binom{${n}}{${Math.floor(n * p)}}$, depois multiplica por potências.\n\n**Por que essa fórmula?** $\\binom{n}{k}$ conta quantas sequências de $n$ ensaios têm exatamente $k$ sucessos. Cada sequência tem prob $p^k(1-p)^{n-k}$ (independência).\n\n**Aplicação.** Controle de qualidade (defeitos em lote), A/B testing (conversões em $n$ usuários), genética (cruzamentos).`,
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-75-binomial'],
    },
    {
      numero: 3,
      enunciado: `Em uma população normal $\\mathcal{N}(${mean}, ${std}^2)$, qual a probabilidade de uma observação estar entre $${mean - std}$ e $${mean + std}$?`,
      resposta: `$\\approx 68\\%$.`,
      passos: `**Passo 1 — Padronize.** $Z = (X - \\mu)/\\sigma$. Para $X = ${mean} \\pm ${std}$, $Z = \\pm 1$.\n\n**Passo 2 — Use a regra empírica.** $P(-1 < Z < 1) \\approx 68\\%$ (normal padrão).\n\n**Por que esse valor mágico?** Vem da integral $\\int_{-1}^1 (1/\\sqrt{2\\pi}) e^{-z^2/2}\\, dz \\approx 0,6827$. Não há fórmula fechada simples.\n\n**Regra 68-95-99,7.** $\\pm 1\\sigma$: 68%; $\\pm 2\\sigma$: 95%; $\\pm 3\\sigma$: 99,7%. **Decora** — base de IC, controle estatístico, finanças.`,
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-76-normal'],
    },
    {
      numero: 4,
      enunciado: `Doença com $P(D) = 0,01$. Sensibilidade ${85 + (v % 10)}\\%$, especificidade ${90 + (v % 5)}\\%$. $P(D|+)$.`,
      resposta: `Calcule via Bayes — base rate fallacy típica.`,
      passos: `**Bayes.** $P(D|+) = \\frac{P(+|D) P(D)}{P(+|D)P(D) + P(+|D^c)P(D^c)}$.\n\nSubstitua: $P(+|D) = 0,${85 + (v % 10)}$, $P(D) = 0,01$, $P(+|D^c) = 1 - 0,${90 + (v % 5)} = 0,${10 - (v % 5)}$, $P(D^c) = 0,99$.\n\n**Por que $P(D|+)$ é baixo mesmo com testes "bons"?** Porque $P(D)$ é muito pequena — a maior parte dos positivos são **falsos positivos**, vindos do enorme grupo $D^c$.\n\n**Lição operacional.** Triagem em massa de doença rara → falsos positivos dominam. Por isso oncologia usa testes de confirmação (biopsia) após qualquer rastreio.`,
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-79-bayes-aprofundado'],
    },
    {
      numero: 5,
      enunciado: `Calcule a variância dos dados $${10}, ${12}, ${15}, ${18}, ${20}$.`,
      resposta: `$\\sigma^2 = \\frac{1}{5}\\sum (x_i - \\bar x)^2$.`,
      passos: `**Passo 1 — Média.** $\\bar x = (10+12+15+18+20)/5 = 75/5 = 15$.\n\n**Passo 2 — Desvios ao quadrado.** $(10-15)^2 = 25$, $(12-15)^2 = 9$, $(15-15)^2 = 0$, $(18-15)^2 = 9$, $(20-15)^2 = 25$.\n\n**Passo 3 — Soma e divide.** $(25 + 9 + 0 + 9 + 25)/5 = 68/5 = 13,6$. Variância populacional $\\sigma^2 = 13,6$.\n\n**Variância amostral** (divide por $n-1$): $68/4 = 17$.\n\n**Por que $n-1$?** Correção de Bessel: usar $\\bar x$ em vez de $\\mu$ "consome um grau de liberdade". Dividir por $n-1$ dá estimador não-viesado de $\\sigma^2$.`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-72-variancia'],
    },
  ]
})

const TEMPLATE_TRIM_9 = templateMinimo(9, 'Cálculo Integral', 'Trim 9 do Ano 3: antiderivada, definida, TFC, técnicas, área/volume.', '3.º ano', (v) => {
  const r = lcg(v * 31)
  const a = intRange(2, 5, r), b = intRange(1, 4, r)
  return [
    {
      numero: 1,
      enunciado: `$\\int (${a}x^2 + ${b}x) dx$.`,
      resposta: `$\\frac{${a}}{3}x^3 + \\frac{${b}}{2}x^2 + C$`,
      passos: `**Passo 1 — Linearidade.** $\\int (f + g) = \\int f + \\int g$. $\\int (cf) = c\\int f$.\n\n**Passo 2 — Use $\\int x^n dx = x^{n+1}/(n+1) + C$ para cada termo.**\n- $\\int ${a}x^2 dx = ${a}x^3/3$\n- $\\int ${b}x dx = ${b}x^2/2$\n\n**Passo 3 — Some + C.** $\\frac{${a}}{3}x^3 + \\frac{${b}}{2}x^2 + C$.\n\n**Por que $+C$?** Toda antiderivada é única **a menos de constante**. Se $F' = f$, então $(F + C)' = f$ também.`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-81-antiderivada'],
    },
    {
      numero: 2,
      enunciado: `$\\int_0^${a} ${b}x dx$.`,
      resposta: `$${b * a * a / 2}$`,
      passos: `**Passo 1 — Antiderivada.** $F(x) = ${b}x^2/2$.\n\n**Passo 2 — TFC: $F(b) - F(a)$.** $F(${a}) - F(0) = ${b * a * a}/2 - 0 = ${b * a * a / 2}$.\n\n**Por que TFC?** A integral definida (= área sob a curva) é igual à diferença da antiderivada nos extremos. Esse é o **resultado fundamental do cálculo** — Newton-Leibniz, séc. XVII.`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-82-integral-definida', 'aula-83-tfc'],
    },
    {
      numero: 3,
      enunciado: `$\\int 2x \\cos(x^2) dx$ (substituição).`,
      resposta: `$\\sin(x^2) + C$`,
      passos: `**Passo 1 — Identifique a substituição.** $u = x^2$, $du = 2x dx$. **Convenientemente**, $2x dx$ aparece intacto.\n\n**Passo 2 — Reescreva.** $\\int \\cos(u) du$.\n\n**Passo 3 — Integre.** $\\sin(u) + C = \\sin(x^2) + C$.\n\n**Por que substituição funciona?** Inversa da regra da cadeia: se sabemos derivar $\\sin(g(x))$ via cadeia, sabemos integrar $\\cos(g(x)) g'(x)$. Procure produto de "derivada de algo" com função desse algo.`,
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-84-substituicao'],
    },
    {
      numero: 4,
      enunciado: `$\\int x e^x dx$ (por partes).`,
      resposta: `$xe^x - e^x + C$`,
      passos: `**Passo 1 — Fórmula.** $\\int u dv = uv - \\int v du$.\n\n**Passo 2 — Escolha $u, dv$.** $u = x \\Rightarrow du = dx$. $dv = e^x dx \\Rightarrow v = e^x$.\n\n**Passo 3 — Aplique.** $xe^x - \\int e^x dx = xe^x - e^x + C$.\n\n**Como escolher $u$?** **LIATE**: Logarítmica, Inversa trig, Algébrica, Trig, Exponencial — escolha $u$ pelo que vem primeiro. Aqui: Algébrica ($x$) > Exponencial ($e^x$), então $u = x$.\n\n**Por que partes funciona?** Inversa da regra do produto: $(uv)' = u'v + uv'$ → $\\int u'v = uv - \\int uv'$.`,
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-85-por-partes'],
    },
    {
      numero: 5,
      enunciado: `Área entre $y = x^2$ e $y = ${a}x$ em $[0, ${a}]$.`,
      resposta: `$\\frac{${a ** 3}}{6}$`,
      passos: `**Passo 1 — Identifique qual está em cima.** Em $[0, ${a}]$, $${a}x \\geq x^2$ (verifique em ponto teste).\n\n**Passo 2 — Área = integral da diferença.** $A = \\int_0^${a} (${a}x - x^2) dx$.\n\n**Passo 3 — Calcule.** $[${a}x^2/2 - x^3/3]_0^${a} = ${a}^3/2 - ${a}^3/3 = ${a ** 3}/6$.\n\n**Por que diferença?** Cada faixa vertical em $[x, x + dx]$ tem altura $f(x) - g(x)$ e largura $dx$. Soma de Riemann no limite = integral da diferença.\n\n**Aplicação.** Área de regiões planas, volumes (preview Lição 89), e em probabilidade (área = probabilidade).`,
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-88-area-curvas'],
    },
  ]
})

const TEMPLATE_TRIM_10 = templateMinimo(10, 'Equações Diferenciais', 'Trim 10 do Ano 3: separáveis, lineares, vibrações, RLC, Euler.', '3.º ano', (v) => {
  const r = lcg(v * 37)
  const k = intRange(2, 6, r), y0 = intRange(2, 8, r)
  return [
    {
      numero: 1,
      enunciado: `Resolva $y' = ${k}y$ com $y(0) = ${y0}$.`,
      resposta: `$y(x) = ${y0} e^{${k}x}$`,
      passos: `**Passo 1 — EDO separável.** Reescreva: $dy/y = ${k} dx$.\n\n**Passo 2 — Integre os dois lados.** $\\ln|y| = ${k}x + C_1$, ou seja $y = A e^{${k}x}$ com $A = e^{C_1}$.\n\n**Passo 3 — Use condição inicial.** $y(0) = A = ${y0}$. Logo $y(x) = ${y0} e^{${k}x}$.\n\n**Por que toda EDO separável segue essa receita?** Separar variáveis: $f(y) dy = g(x) dx$, integrar ambos os lados, isolar $y$.\n\n**Aplicação universal.** $\\dot N = kN$ (juros, populações, decaimento) → solução exponencial. **A EDO mais importante da ciência.**`,
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-92-edo-separavel'],
    },
    {
      numero: 2,
      enunciado: `Café a $90°C$ esfria em sala $25°C$ com $k = 0,1$/min. Tempo para atingir $30°C$.`,
      resposta: `$\\approx 25,6$ min`,
      passos: `**Passo 1 — Lei de Newton resfriamento.** $T(t) = T_a + (T_0 - T_a) e^{-kt}$. Substitui: $T(t) = 25 + 65 e^{-0,1 t}$.\n\n**Passo 2 — Iguale a 30.** $25 + 65 e^{-0,1 t} = 30 \\Rightarrow e^{-0,1 t} = 5/65 = 1/13$.\n\n**Passo 3 — Aplique log.** $-0,1 t = \\ln(1/13) = -\\ln 13 \\approx -2,565$. $t = 25,65$ min.\n\n**Por que essa fórmula?** Newton (1701) postulou $\\dot T = -k(T - T_a)$ — taxa de resfriamento ∝ diferença com ambiente. Solução é exponencial assintótica a $T_a$.\n\n**Verificação.** Em $t = 0$: $T = 25 + 65 = 90$ ✓. Quando $t \\to \\infty$: $T \\to 25$ ✓.`,
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-99-newton-resfriamento'],
    },
    {
      numero: 3,
      enunciado: `EDO característica de $y'' + ${k}y' + ${y0}y = 0$.`,
      resposta: `Depende de $\\Delta$ — calcule.`,
      passos: `**Passo 1 — Equação característica.** $\\lambda^2 + ${k}\\lambda + ${y0} = 0$.\n\n**Passo 2 — Discriminante.** $\\Delta = ${k}^2 - 4 \\cdot ${y0} = ${k * k - 4 * y0}$.\n\n**Passo 3 — Classifique.**\n- $\\Delta > 0$: 2 raízes reais distintas → solução $c_1 e^{\\lambda_1 x} + c_2 e^{\\lambda_2 x}$ (sobreamortecido).\n- $\\Delta = 0$: raiz dupla → $(c_1 + c_2 x) e^{\\lambda x}$ (criticamente amortecido).\n- $\\Delta < 0$: complexas → $e^{\\alpha x}(c_1\\cos\\beta x + c_2\\sin\\beta x)$ (subamortecido — oscila).\n\n**Por que esse algoritmo?** Substituir $y = e^{\\lambda x}$ na EDO leva à equação característica. As 3 categorias correspondem a comportamentos físicos distintos: amortecimento crítico (porta automática), subamortecido (pêndulo), supercrítico (suspensão de carro).`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-95-edo-2-ordem'],
    },
    {
      numero: 4,
      enunciado: `Massa-mola: $m = ${k}$ kg, $k = ${k * y0}$ N/m. Frequência natural?`,
      resposta: `$\\omega = \\sqrt{${y0}}$ rad/s`,
      passos: `**Passo 1 — Modelo.** $m\\ddot x + k x = 0$, ou $\\ddot x + (k/m) x = 0$. Compare com $\\ddot x + \\omega^2 x = 0$ → $\\omega^2 = k/m$.\n\n**Passo 2 — Substitua.** $\\omega = \\sqrt{${k * y0}/${k}} = \\sqrt{${y0}}$.\n\n**Passo 3 — Período.** $T = 2\\pi/\\omega$.\n\n**Por que $\\omega^2 = k/m$?** $k$ é "rigidez" — força restauradora por unidade de deslocamento. $m$ é inércia. Quanto mais rígido, mais rápido oscila; quanto mais massa, mais lento.\n\n**Aplicação.** Cordas de violão (afinação = $\\omega$ depende de tensão e densidade), pêndulos, suspensões, circuitos LC.`,
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-96-vibracoes'],
    },
    {
      numero: 5,
      enunciado: `Método de Euler para $y' = y$, $y(0) = 1$, $h = 0,1$. Calcule $y_3$.`,
      resposta: `$y_3 = 1{,}331$`,
      passos: `**Passo 1 — Fórmula.** $y_{n+1} = y_n + h f(x_n, y_n)$. Aqui $f = y$, então $y_{n+1} = y_n + h y_n = y_n(1 + h) = 1,1 y_n$.\n\n**Passo 2 — Itere.**\n- $y_0 = 1$\n- $y_1 = 1,1 \\cdot 1 = 1,1$\n- $y_2 = 1,1 \\cdot 1,1 = 1,21$\n- $y_3 = 1,1 \\cdot 1,21 = 1,331$\n\n**Passo 3 — Compare com analítico.** Solução exata $y(0,3) = e^{0,3} \\approx 1,3499$. Erro $\\approx 0,019$.\n\n**Por que Euler erra?** A "linha tangente" só é precisa localmente. Após cada passo, acumula erro de truncamento. Erro global $O(h)$ — diminuir $h$ pela metade reduz erro pela metade.\n\n**Métodos melhores.** RK4 (Runge-Kutta 4ª ordem) tem erro $O(h^4)$ — muito mais preciso para mesmo $h$. Padrão em produção.`,
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-98-euler-numerico'],
    },
  ]
})

const TEMPLATE_TRIM_11 = templateMinimo(11, 'Estatística inferencial', 'Trim 11 do Ano 3: amostragem, IC, teste de hipótese, regressão, ANOVA.', '3.º ano', (v) => {
  const r = lcg(v * 41)
  const n = intRange(50, 200, r), mean = intRange(40, 60, r), s = intRange(5, 15, r)
  return [
    {
      numero: 1,
      enunciado: `IC 95% para média populacional. $n = ${n}$, $\\bar x = ${mean}$, $s = ${s}$.`,
      resposta: `$IC = ${mean} \\pm 1,96 \\cdot ${s}/\\sqrt{${n}}$`,
      passos: `**Passo 1 — Erro padrão da média.** $SE = s/\\sqrt n = ${s}/\\sqrt{${n}} = ${(s / Math.sqrt(n)).toFixed(3)}$.\n\n**Passo 2 — Margem de erro 95%.** $ME = 1,96 \\cdot SE = ${(1.96 * s / Math.sqrt(n)).toFixed(3)}$.\n\n**Passo 3 — IC.** $\\bar x \\pm ME = [${(mean - 1.96 * s / Math.sqrt(n)).toFixed(2)}, ${(mean + 1.96 * s / Math.sqrt(n)).toFixed(2)}]$.\n\n**Por que 1,96?** É o quantil 97,5% da normal padrão. Como o IC bilateral deixa 2,5% em cada cauda, o valor crítico é $z_{0,025} = 1,96$.\n\n**Interpretação correta.** "95% dos ICs construídos dessa forma contêm $\\mu$" — NÃO "há 95% de probabilidade de $\\mu$ estar neste IC". Confusão sutil mas importante.`,
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-102-ic-media'],
    },
    {
      numero: 2,
      enunciado: `Teste $H_0: \\mu = 50$ vs $H_1: \\mu \\neq 50$. $n = ${n}$, $\\bar x = ${mean}$, $s = ${s}$. Estatística t.`,
      resposta: `$t = (${mean} - 50)/(${s}/\\sqrt{${n}})$`,
      passos: `**Passo 1 — Estatística t.** $t = (\\bar x - \\mu_0)/(s/\\sqrt n) = (${mean} - 50)/(${(s / Math.sqrt(n)).toFixed(3)}) = ${((mean - 50) / (s / Math.sqrt(n))).toFixed(3)}$.\n\n**Passo 2 — p-valor (bilateral).** Use distribuição t com $n-1 = ${n - 1}$ graus de liberdade. $p = 2 \\cdot P(T > |t|)$.\n\n**Passo 3 — Decisão.** Se $p < 0,05$, rejeita $H_0$.\n\n**Por que t e não z?** Porque estimamos $\\sigma$ pela amostra ($s$). A incerteza adicional infla a cauda — distribuição t (Gosset 1908). Para $n$ grande, t $\\approx$ z.\n\n**Cuidado com p-hacking.** P-valor pequeno NÃO significa "efeito grande" nem "alta probabilidade da hipótese". Veja ASA Statement 2016.`,
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-104-teste-z-t'],
    },
    {
      numero: 3,
      enunciado: `Regressão linear simples com 5 pontos: $(1, ${1 + (v % 3)}), (2, ${3 + (v % 3)}), (3, ${5 + (v % 3)}), (4, ${7 + (v % 3)}), (5, ${9 + (v % 3)})$. Inclinação $\\hat\\beta_1$?`,
      resposta: `$\\hat\\beta_1 = 2$`,
      passos: `**Passo 1 — Médias.** $\\bar x = 3$, $\\bar y = ${5 + (v % 3)}$.\n\n**Passo 2 — Inclinação OLS.** $\\hat\\beta_1 = \\frac{\\sum (x_i - \\bar x)(y_i - \\bar y)}{\\sum (x_i - \\bar x)^2}$.\n\n**Passo 3 — Calcule.** Numerador: $(-2)(-4) + (-1)(-2) + 0 \\cdot 0 + 1 \\cdot 2 + 2 \\cdot 4 = 20$. Denominador: $4 + 1 + 0 + 1 + 4 = 10$. $\\hat\\beta_1 = 20/10 = 2$.\n\n**Por que essa fórmula?** Minimiza soma de quadrados dos resíduos $\\sum (y_i - \\hat y_i)^2$. Derivando em $\\beta_1$ e igualando a zero, sai a fórmula.\n\n**Geometricamente.** A reta de regressão é a projeção ortogonal de $\\mathbf{y}$ no espaço-coluna de $\\mathbf{X}$ (matriz de design).`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-105-regressao-simples'],
    },
    {
      numero: 4,
      enunciado: `Teste qui-quadrado de aderência: dados observados [${10 + (v % 3)}, ${20 + (v % 3)}, ${30 + (v % 3)}, ${40 + (v % 3)}], esperados [25, 25, 25, 25]. Estatística?`,
      resposta: `$\\chi^2 = \\sum (O_i - E_i)^2/E_i$`,
      passos: `**Passo 1 — Fórmula.** $\\chi^2 = \\sum_i \\frac{(O_i - E_i)^2}{E_i}$.\n\n**Passo 2 — Calcule cada termo** (use os valores específicos da versão).\n\n**Passo 3 — Soma e compare.** Compare com $\\chi^2_{k-1, \\alpha}$ (graus de liberdade = $k - 1$).\n\n**Por que esse formato?** Pearson (1900): cada termo $(O - E)^2/E$ é uma normal padrão ao quadrado (assintoticamente), e soma de normais² é $\\chi^2$.\n\n**Aplicação.** Testar se um dado é honesto (observado vs uniforme), aderência a uma distribuição teórica.`,
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-108-qui-quadrado'],
    },
    {
      numero: 5,
      enunciado: `Em ANOVA, $F$ é razão de variâncias. $F$ grande sugere o quê?`,
      resposta: `Diferença significativa entre grupos.`,
      passos: `**Passo 1 — Decomponha variabilidade.** Variabilidade total = entre grupos + dentro de grupos.\n\n**Passo 2 — F = MS(entre)/MS(dentro).** Se $F \\gg 1$, variabilidade entre grupos é maior que dentro → grupos diferem.\n\n**Passo 3 — Distribuição F.** Sob $H_0$ (médias iguais), $F$ segue F-distribution. p-valor = cauda superior.\n\n**Por que ANOVA?** Generalização de teste t para mais de 2 grupos. Comparar pares múltiplos infla erro tipo I (Bonferroni); ANOVA testa diferença geral.`,
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-107-anova'],
    },
  ]
})

const TEMPLATE_TRIM_12 = templateMinimo(12, 'Álgebra Linear avançada e síntese', 'Trim 12 do Ano 3: espaços, autovalores, SVD, PCA, Black-Scholes síntese.', 'Pré-vestibular', (v) => {
  const r = lcg(v * 43)
  const a = intRange(2, 5, r), b = intRange(1, 4, r)
  const tr = a + b, det = a * b
  const disc = tr * tr - 4 * det
  return [
    {
      numero: 1,
      enunciado: `Autovalores de $A = \\begin{pmatrix} ${a} & 1 \\\\ 0 & ${b} \\end{pmatrix}$.`,
      resposta: `$\\lambda_1 = ${a}, \\lambda_2 = ${b}$`,
      passos: `**Passo 1 — Polinômio característico.** $\\det(A - \\lambda I) = (${a} - \\lambda)(${b} - \\lambda) - 0 = 0$.\n\n**Passo 2 — Resolva.** Triangular: autovalores são os elementos da diagonal. $\\lambda_1 = ${a}, \\lambda_2 = ${b}$.\n\n**Por que diagonal de triangular?** $\\det(A - \\lambda I) = $ produto dos elementos diagonais de $(A - \\lambda I)$ = $(a_{11} - \\lambda)(a_{22} - \\lambda)\\cdots$. Raízes são justamente $a_{ii}$.\n\n**Aplicação.** Diagonalização: $A = PDP^{-1}$ acelera computação de potências e exponencial de matriz.`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-114-autovalores'],
    },
    {
      numero: 2,
      enunciado: `$A = \\begin{pmatrix} ${a} & 1 \\\\ 1 & ${b} \\end{pmatrix}$. Autovalores via traço/determinante.`,
      resposta: `$\\lambda^2 - ${tr}\\lambda + ${det - 1} = 0$`,
      passos: `**Passo 1 — Traço.** $\\text{tr}(A) = ${a} + ${b} = ${tr}$.\n\n**Passo 2 — Determinante.** $\\det(A) = ${a}${b} - 1 = ${det - 1}$.\n\n**Passo 3 — Polinômio.** $\\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) = 0$.\n\n**Passo 4 — Bhaskara.** $\\lambda = (${tr} \\pm \\sqrt{${tr * tr - 4 * (det - 1)}})/2$.\n\n**Por que essa relação 2x2?** Sempre vale $\\det(A - \\lambda I) = \\lambda^2 - \\text{tr}\\lambda + \\det$ para 2x2. Truque rápido sem expandir o determinante.`,
      dificuldade: 'aplicacao',
      aulasCobertas: ['aula-114-autovalores'],
    },
    {
      numero: 3,
      enunciado: `Em PCA, autovetores da matriz de covariância. O que representa o "PC1"?`,
      resposta: `Direção de maior variância dos dados.`,
      passos: `**Passo 1 — Definição PCA.** Encontre vetor $\\vec v$ unitário que maximiza $\\text{Var}(\\vec v^T X)$.\n\n**Passo 2 — Solução.** $\\vec v$ = autovetor associado ao maior autovalor $\\lambda_1$ da matriz de covariância $\\Sigma$.\n\n**Passo 3 — Variância capturada.** $\\lambda_1$ é a variância ao longo de PC1. Razão $\\lambda_1/\\sum \\lambda_i$ = proporção explicada.\n\n**Por que PCA usa autovalores?** Maximizar Rayleigh quotient $\\vec v^T \\Sigma \\vec v / \\vec v^T \\vec v$ — solução pelos autovetores.\n\n**Aplicação.** Redução de dimensionalidade, compressão de dados, "eigenfaces" em reconhecimento facial.`,
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-118-pca'],
    },
    {
      numero: 4,
      enunciado: `Black-Scholes: identifique 3 conceitos do programa que aparecem na fórmula $C = SN(d_1) - Ke^{-rT}N(d_2)$.`,
      resposta: `Funções, exp, log (em $d_1$), integral (em $N$), distribuição normal, derivadas (Greeks), EDP (origem).`,
      passos: `**1. Função de duas variáveis** (Lições 1-5): $C(S, t)$ — domínio $S > 0$, $t \\in [0, T]$.\n\n**2. Exponencial e log** (6-7): $e^{-rT}$ é desconto contínuo. $\\ln(S/K)$ está em $d_1$.\n\n**3. Distribuição normal** (76): $N(d)$ é a CDF da normal padrão.\n\n**4. Integral** (82): $N(d) = \\frac{1}{\\sqrt{2\\pi}}\\int_{-\\infty}^d e^{-u^2/2}du$.\n\n**5. Derivadas** (51, 67): Greeks (Δ, Γ, ν, Θ) são derivadas parciais.\n\n**6. EDP** (preview): a fórmula é solução fechada de uma EDP parabólica análoga à equação do calor.\n\n**Síntese.** Black-Scholes é a culminação simbólica do programa — todos os 12 trimestres aparecem.`,
      dificuldade: 'compreensao',
      aulasCobertas: ['aula-119-bs-sintese'],
    },
    {
      numero: 5,
      enunciado: `Para a covariância $\\Sigma = \\begin{pmatrix} 4 & 1 \\\\ 1 & 3 \\end{pmatrix}$, calcule autovalores.`,
      resposta: `$\\lambda = (7 \\pm \\sqrt{5})/2$`,
      passos: `**Passo 1 — Polinômio característico.** $\\lambda^2 - 7\\lambda + 11 = 0$ (traço 7, det 11).\n\n**Passo 2 — Bhaskara.** $\\lambda = (7 \\pm \\sqrt{49 - 44})/2 = (7 \\pm \\sqrt 5)/2$.\n\n**Passo 3 — Aproxime.** $\\lambda_1 \\approx 4,618$, $\\lambda_2 \\approx 2,382$.\n\n**Interpretação PCA.** PC1 captura $\\lambda_1/(\\lambda_1 + \\lambda_2) \\approx 4,62/7 \\approx 66\\%$ da variância.`,
      dificuldade: 'modelagem',
      aulasCobertas: ['aula-114-autovalores', 'aula-118-pca'],
    },
  ]
})

// =============================================================================
// Map de templates por trimestre
// =============================================================================

const PROVA_TEMPLATES: Record<number, TrimTemplate> = {
  1: TEMPLATE_TRIM_1,
  2: TEMPLATE_TRIM_2,
  3: TEMPLATE_TRIM_3,
  4: TEMPLATE_TRIM_4,
  5: TEMPLATE_TRIM_5,
  6: TEMPLATE_TRIM_6,
  7: TEMPLATE_TRIM_7,
  8: TEMPLATE_TRIM_8,
  9: TEMPLATE_TRIM_9,
  10: TEMPLATE_TRIM_10,
  11: TEMPLATE_TRIM_11,
  12: TEMPLATE_TRIM_12,
}

/** Gera as 10 versões de provas do Trim X. */
export function gerarProvasDoTrim(trim: number): Prova[] {
  const tpl = PROVA_TEMPLATES[trim]
  if (!tpl) return []
  return Array.from({ length: 10 }, (_, i) => {
    const versao = i + 1
    return {
      id: `p-trim${trim}-v${versao}`,
      trim,
      versao,
      titulo: `Prova Trim ${trim} — ${tpl.tituloBase} (versão ${versao})`,
      descricao: tpl.descricao,
      duracaoMinutos: tpl.duracaoMinutos,
      intensidade: tpl.intensidade,
      publicoAlvo: tpl.publicoAlvo,
      questoes: tpl.geraQuestoes(versao),
    }
  })
}

/** Todas as 12*10 = 120 provas. */
export function gerarTodasProvas(): Prova[] {
  const out: Prova[] = []
  for (let t = 1; t <= 12; t++) {
    out.push(...gerarProvasDoTrim(t))
  }
  return out
}

/** Lista de trimestres disponíveis. */
export function trimsDisponiveis(): number[] {
  return Object.keys(PROVA_TEMPLATES).map(Number).sort((a, b) => a - b)
}

/** Provas pré-computadas (para componente client-side). */
export const PROVAS: Prova[] = gerarTodasProvas()

export function getProvaById(id: string): Prova | undefined {
  return PROVAS.find((p) => p.id === id)
}
