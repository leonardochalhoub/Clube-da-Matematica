# Programa de Estudos Japão + Alemanha + Singapura

**Status:** Documento vivo · **Atualizado:** 2026-04-28
**Alvo:** 3 anos do ensino médio brasileiro (15-17 anos) com 4 trimestres
por ano = **12 trimestres totais**.
**Fonte:** mescla dos currículos oficiais de Japão (Math I/II/III + Math A/B/C),
Alemanha (Klasse 10/11/12, Leistungskurs Mathematik) e Singapura (Sec 4 + JC 1/JC 2,
H2 Mathematics 9758), com adaptação ao contexto brasileiro.

## Estrutura geral

Cada trimestre tem **10 aulas** + 1 prova-ensaio. Total: **120 aulas** em 3 anos.

| Ano | Trimestres | Foco | Idade-alvo | Equiv. JP | Equiv. DE | Equiv. SG |
|---|---|---|---|---|---|---|
| **1.º** | 1, 2, 3, 4 | Fundamentos algébrico-funcionais + intuição de variação | 15 | Math I + Math A | Klasse 10 | Sec 4 (E-Math) |
| **2.º** | 5, 6, 7, 8 | Cálculo diferencial + estatística + matrizes | 16 | Math II + Math B | Klasse 11 LK | JC 1 (H2 começo) |
| **3.º** | 9, 10, 11, 12 | Cálculo integral + EDOs + estatística inferencial + álgebra linear | 17 | Math III + Math C | Klasse 12 LK | JC 2 (H2 final) |

## Princípios pedagógicos

1. **Bruner — espiral**: cada conceito é revisitado em níveis crescentes.
   Ex.: derivada aparece como "taxa de variação" no 1.º ano (intuitivo),
   "inclinação da tangente" no 2.º ano (geométrico/simbólico) e
   "operador linear" no 3.º ano (formal).

2. **Vygotsky — ZPD**: cada aula tem scaffolding declarado: o que o aluno
   já consegue, o que aprende com auxílio, o que ainda não.

3. **Singapura CPA**: cada conceito apresentado em sequência
   Concrete → Pictorial → Abstract.

4. **Japão — fewer concepts, greater detail**: priorizar profundidade.
   Tópicos com mais de 3 aulas têm semana de "consolidação" antes de
   avançar.

5. **Alemanha LK — rigor + aplicação**: pelo menos uma demonstração
   formal por trimestre, calibrada à idade.

6. **Brasil — porta 15 explícita**: vocabulário e exemplos brasileiros
   (BNCC, ENEM, real). Não tradução acadêmica de livro estrangeiro.

---

## Ano 1 — Fundamentos (15 anos)

### Trimestre 1: Funções, Conjuntos, Intuição de Mudança

**Objetivos**: estabelecer linguagem matemática rigorosa; introduzir a
ideia central que precede o cálculo — "como uma coisa muda em relação a
outra". Sem ε-δ. Sem limites formais. Mas com taxa de variação como
conceito vivo.

| # | Aula | Tópicos | Referência principal | Exercícios |
|---|---|---|---|---|
| 1 | Conjuntos, intervalos, notação | $\mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{R}$, intervalos, intersecção, união | Wikilivros Mat. elementar | 12 |
| 2 | Funções: definição, domínio, imagem | $f: A \to B$, gráfico cartesiano | Active Calculus §1.1 | 15 |
| 3 | Funções afins (1.º grau) e suas aplicações | Inclinação como taxa de variação constante | Wikilivros Cálculo Vol 1 §1 | 18 |
| 4 | Funções quadráticas | Vértice, raízes, eixo de simetria | Stitz-Zeager §2 | 16 |
| 5 | Composição e função inversa | $f \circ g$, $f^{-1}$ | Active Calculus §1.2 | 14 |
| 6 | Funções exponenciais (intro) | $a^x$, base $e$ apresentada empiricamente (juros compostos) | OpenStax College Algebra §6 | 12 |
| 7 | Funções logarítmicas (intro) | $\log_a x$ como inversa de $a^x$ | OpenStax §6.4 | 14 |
| 8 | Crescimento e decaimento | População, decaimento radioativo, juros | OpenStax §6.7 + ENEM contexto | 10 |
| 9 | **Taxa de variação média** (PORTAL CRÍTICO) | $\frac{\Delta y}{\Delta x}$, interpretação geométrica e física | Active Calculus §1.3 (adaptado) | 12 |
| 10 | Consolidação + revisão | Workshop com problemas ENEM-style | — | 15 |
| **prova** | Ensaio escrito 90 min | 5 questões + 1 dissertativa | — | — |

**Total exercícios trimestre**: 138.
**25% com gabarito formal**: 35 exercícios.

### Trimestre 2: Trigonometria e Sequências

| # | Aula | Tópicos | Referência principal |
|---|---|---|---|
| 11 | Razões trigonométricas no triângulo retângulo | sen, cos, tan; aplicações em medição | Wikilivros Geometria e Trig. |
| 12 | Círculo trigonométrico | Radianos, identidades fundamentais | Stitz-Zeager Trigonometry |
| 13 | Funções trigonométricas | Periodicidade, gráficos $y = \sin x, \cos x$ | Yoshiwara Trigonometry |
| 14 | Equações e inequações trig. | $\sin x = 1/2$, etc. | Yoshiwara §3 |
| 15 | Lei dos senos e cossenos | Triângulos não-retângulos | Yoshiwara §4 |
| 16 | Sequências numéricas: definição e notação | $(a_n)$, recorrência | Wikilivros Cálculo Vol 1 |
| 17 | Progressões aritméticas (PA) | $a_n = a_1 + (n-1)r$, soma | OpenStax Precalculus §13 |
| 18 | Progressões geométricas (PG) | $a_n = a_1 q^{n-1}$, soma finita e infinita | OpenStax §13 |
| 19 | **Limite intuitivo de sequência** | "Para onde vai $1/n$?" sem ε-δ | Active Calculus §0 (adaptado) |
| 20 | Consolidação + revisão | Problemas integrados | — |

### Trimestre 3: Geometria Analítica e Vetores 2D

| # | Aula | Tópicos | Referência |
|---|---|---|---|
| 21 | Plano cartesiano: distância, ponto médio | $d(P,Q) = \sqrt{...}$ | Wikilivros |
| 22 | Equação da reta | Forma geral, reduzida, paramétrica | Stitz-Zeager |
| 23 | Posição relativa de retas | Paralelismo, perpendicularidade | OpenStax College Algebra |
| 24 | Equação da circunferência | $(x-a)^2 + (y-b)^2 = r^2$ | OpenStax §3 |
| 25 | Cônicas: elipse, parábola, hipérbole | Definições e equações | OpenStax Precalculus §10 |
| 26 | Vetores no plano | Representação, soma, multiplicação por escalar | Battaia §5 |
| 27 | Produto escalar | $\vec{u} \cdot \vec{v}$, ângulo entre vetores | Active Calc. (multivariable) §1 |
| 28 | Aplicações de vetores em física | Forças, deslocamento, decomposição | OpenStax University Physics 1 |
| 29 | Sistemas lineares 2x2 e 3x3 | Substituição, escalonamento básico | Beezer FCLA §1 |
| 30 | Consolidação + revisão | — | — |

### Trimestre 4: Matrizes, Determinantes, Combinatória

| # | Aula | Tópicos | Referência |
|---|---|---|---|
| 31 | Introdução a matrizes | Notação, dimensões, igualdade | Beezer FCLA §M |
| 32 | Operações com matrizes | Soma, multiplicação por escalar, produto | Hefferon §1 |
| 33 | Matriz transposta, identidade, inversa | $A^T, I, A^{-1}$ | Hefferon §2 |
| 34 | Determinantes 2x2 e 3x3 | Regra de Sarrus, propriedades | Hefferon §3 |
| 35 | Resolução de sistemas via matrizes | Cramer, Gauss básico | Hefferon §4 |
| 36 | Princípio fundamental da contagem | $n_1 \cdot n_2 \cdot \ldots$ | OpenStax §13.5 |
| 37 | Permutações e arranjos | $n!$, $A_{n,p}$ | OpenStax §13 |
| 38 | Combinações | $\binom{n}{p}$, triângulo de Pascal | OpenStax |
| 39 | Probabilidade discreta básica | $P(A) = $ casos favoráveis / casos possíveis | Grinstead-Snell §1 |
| 40 | Consolidação + revisão anual | Workshop integrador | — |

---

## Ano 2 — Cálculo Diferencial + Probabilidade Inferencial (16 anos)

### Trimestre 5: Limites e Continuidade

| # | Aula | Tópicos | Referência |
|---|---|---|---|
| 41 | Conceito intuitivo de limite | $\lim_{x \to a} f(x)$ como "para onde vai" | Active Calculus §1.7 |
| 42 | Limites laterais | $\lim_{x \to a^-}$, $\lim_{x \to a^+}$ | Lebl Basic Analysis (adaptado) |
| 43 | Propriedades dos limites | Soma, produto, quociente | OpenStax Calc 1 §2 |
| 44 | Limites infinitos e no infinito | Assíntotas | OpenStax §2 |
| 45 | Continuidade | Definição, classificação de descontinuidades | Active Calc §1.7 |
| 46 | Teorema do Valor Intermediário | Aplicações (raízes, ponto fixo) | Active Calc §1.7 |
| 47 | Limites notáveis | $\lim \frac{\sin x}{x}$, $\lim (1+x)^{1/x}$ | OpenStax §2 |
| 48 | Indeterminações: $0/0$, $\infty/\infty$ | Manipulação algébrica + L'Hôpital intuitivo | OpenStax §4 |
| 49 | Aplicações em física e biologia | Velocidade instantânea, taxa de crescimento | OpenStax UPhys |
| 50 | Consolidação + revisão | — | — |

### Trimestre 6: Derivadas — Conceito e Regras

| # | Aula | Tópicos | Referência |
|---|---|---|---|
| 51 | **Derivada como taxa instantânea** | Definição via limite | Active Calc §1.5 |
| 52 | Derivada como inclinação da tangente | Visualização gráfica | Active Calc §1.6 |
| 53 | Regras: soma, produto, quociente | $(f+g)', (fg)', (f/g)'$ | OpenStax Calc 1 §3 |
| 54 | Regra da cadeia | $(f \circ g)' = f'(g) \cdot g'$ | OpenStax §3.6 |
| 55 | Derivada de funções polinomiais | Caso $x^n$ | OpenStax §3 |
| 56 | Derivada de $\sin, \cos, \tan$ | + identidades | OpenStax §3 |
| 57 | Derivada de $\e^x$ e $\ln x$ | + caso geral $a^x$ | OpenStax §3 |
| 58 | Derivada implícita | $x^2 + y^2 = 1 \Rightarrow ?$ | OpenStax §3.8 |
| 59 | Derivadas de ordem superior | $f''$, $f'''$ | OpenStax §3 |
| 60 | Consolidação + revisão | — | — |

### Trimestre 7: Aplicações da Derivada

| # | Aula | Tópicos | Referência |
|---|---|---|---|
| 61 | Variação e extremos locais | $f' = 0$, máximo/mínimo | OpenStax Calc 1 §4 |
| 62 | Concavidade e ponto de inflexão | $f'' > 0, f'' < 0$ | OpenStax §4 |
| 63 | Esboço de gráficos | Sumário das ferramentas | OpenStax §4 |
| 64 | **Otimização** | Problemas práticos (área máxima, custo mínimo) | Active Calc §4.3 |
| 65 | Taxas relacionadas | Escada deslizante, balão inflando | OpenStax §4 |
| 66 | Aproximação linear e diferencial | $f(x+h) \approx f(x) + f'(x)h$ | OpenStax §4 |
| 67 | Polinômio de Taylor (intro) | $f(x) \approx \sum f^{(n)}(a)/n! (x-a)^n$ | APEX Calc 2 §8 |
| 68 | Aplicações em física: cinemática | Velocidade, aceleração | OpenStax UPhys 1 |
| 69 | Aplicações em economia: marginal | Custo marginal, receita marginal | OpenStax Bus. Stats |
| 70 | Consolidação + revisão | — | — |

### Trimestre 8: Estatística Descritiva e Probabilidade

| # | Aula | Tópicos | Referência |
|---|---|---|---|
| 71 | População, amostra, variável | Tipos de variáveis | OpenIntro Stats §1 |
| 72 | Tabelas e gráficos | Histograma, boxplot | OpenIntro §2 |
| 73 | Medidas de tendência central | Média, mediana, moda | OpenIntro §2 |
| 74 | Medidas de dispersão | Variância, desvio-padrão, quartis | OpenIntro §2 |
| 75 | Probabilidade: espaço amostral | Eventos, axiomas | Grinstead-Snell §1 |
| 76 | Probabilidade condicional e Bayes | $P(A \mid B)$, regra de Bayes | Grinstead-Snell §4 |
| 77 | Variáveis aleatórias discretas | $E[X], \text{Var}(X)$, binomial | Grinstead-Snell §6 |
| 78 | Distribuição normal (intro) | Curva sino, regra empírica 68-95-99 | OpenIntro §4 |
| 79 | Amostragem e o **Teorema Central do Limite** (intuição) | Por que normal aparece em tudo | OpenIntro §5 |
| 80 | Consolidação + revisão anual | Projeto: análise de dataset real | — |

---

## Ano 3 — Integral, EDOs, Inferência, Álgebra Linear (17 anos)

### Trimestre 9: Cálculo Integral

| # | Aula | Tópicos | Referência |
|---|---|---|---|
| 81 | Antiderivada e primitiva | $F'(x) = f(x)$ | OpenStax Calc 1 §4 |
| 82 | Integral indefinida | $\int f(x)\,dx$ + propriedades | OpenStax Calc 2 §1 |
| 83 | **Integral definida** | $\int_a^b$ como soma de Riemann | Active Calc §4 |
| 84 | **Teorema Fundamental do Cálculo** | I e II partes | OpenStax Calc 1 §5 |
| 85 | Integração por substituição | $u$-substitution | OpenStax §5 |
| 86 | Integração por partes | $\int u\,dv = uv - \int v\,du$ | OpenStax Calc 2 §3 |
| 87 | Aplicações: área entre curvas | $\int_a^b (f - g)\,dx$ | Active Calc §6 |
| 88 | Aplicações: volume por revolução | Discos, cascas | OpenStax Calc 2 §6 |
| 89 | Aplicações em física: trabalho, centro de massa | Vetorial básico | OpenStax UPhys 1 |
| 90 | Consolidação + revisão | — | — |

### Trimestre 10: Equações Diferenciais (EDOs)

| # | Aula | Tópicos | Referência |
|---|---|---|---|
| 91 | O que é uma equação diferencial | Ordem, EDO vs EDP | Lebl Diffyqs §1 |
| 92 | EDO de 1.ª ordem separável | $dy/dx = f(x)g(y)$ | Lebl §1.3 |
| 93 | EDO linear de 1.ª ordem | Fator integrante | Lebl §1.4 |
| 94 | Aplicações: crescimento, decaimento, juros contínuos | $dy/dt = ky$ | OpenStax Calc 2 §8 |
| 95 | Aplicações: queda livre com resistência do ar | Modelo físico real | OpenStax UPhys |
| 96 | EDO linear de 2.ª ordem (intro) | $y'' + by' + cy = 0$ | Lebl §2 |
| 97 | Modelo do oscilador harmônico | $y'' + \omega^2 y = 0$ | Lebl §2.4 |
| 98 | Sistemas de EDOs (intro) | Problemas presa-predador | Lebl §3 (qualitativo) |
| 99 | Métodos numéricos: Euler, Runge-Kutta intuitivo | REAMAT Cálc Numérico | REAMAT §6 |
| 100 | Consolidação + revisão | — | — |

### Trimestre 11: Estatística Inferencial e Regressão

| # | Aula | Tópicos | Referência |
|---|---|---|---|
| 101 | Distribuição normal: cálculo de probabilidades | Z-score, tabela | OpenIntro §4 |
| 102 | Distribuição amostral da média | Por que normal | OpenIntro §5 |
| 103 | Intervalos de confiança (média) | $\bar{x} \pm t \cdot SE$ | OpenIntro §5 |
| 104 | Testes de hipótese (média) | $H_0$ vs $H_1$, $p$-valor | OpenIntro §5 |
| 105 | Erro tipo I e tipo II | Trade-off poder vs significância | OpenIntro §5 |
| 106 | Inferência para proporções | Testes para $p$ | OpenIntro §6 |
| 107 | Correlação | Pearson, Spearman | OpenIntro §7 |
| 108 | Regressão linear simples | $y = \beta_0 + \beta_1 x + \eps$ | OpenIntro §7 |
| 109 | Diagnóstico de regressão | Resíduos, $R^2$ | OpenIntro §7 |
| 110 | Consolidação + projeto final | Análise de dataset real | — |

### Trimestre 12: Álgebra Linear Avançada e Síntese

| # | Aula | Tópicos | Referência |
|---|---|---|---|
| 111 | Espaços vetoriais | Definição axiomática | Beezer FCLA §V |
| 112 | Independência linear, base, dimensão | Conceitos fundamentais | Beezer §S, §B |
| 113 | Transformações lineares | Núcleo, imagem | Hefferon §3 |
| 114 | Autovalores e autovetores | $Av = \lambda v$ | Axler §5 |
| 115 | Diagonalização | Aplicação a sistemas dinâmicos | Axler §5 |
| 116 | Aplicação: cadeias de Markov | Exemplo concreto | OpenIntro Modern §7 |
| 117 | Aplicação: análise de componentes principais (PCA) | Visualização | Deisenroth MML §10 |
| 118 | Síntese: cálculo + álgebra linear | Equação do calor 1D | Lebl §4 (intro EDPs) |
| 119 | Síntese: cálculo + estatística | Black-Scholes (porta 25 do Clube) | Clube WP #9 |
| 120 | **Aula final**: visão integrada da matemática estudada | Workshop reflexivo | — |

---

## Sistema de Exercícios

Cada aula tem **lista de exercícios** com os seguintes níveis:

| Nível | Quantidade típica | Característica |
|---|---|---|
| **Aplicação direta** | 5-7 | Aplicar fórmula/conceito recém-visto |
| **Compreensão** | 3-5 | Conexão entre conceitos, justificar |
| **Desafio** | 1-3 | Problema mais complexo, ENEM/EJU/Abitur-style |
| **Modelagem** | 1 | Aplicação a problema real (semana sim, semana não) |

### Sorteio aleatório com 25% gabaritado

A regra editorial: **25% dos exercícios** de cada lista têm
**solução formalmente desenvolvida** no site, em formato passo a passo
estilo "porta formal" do Clube. Os 75% restantes mostram apenas
resposta numérica final (ou indicam "ver gabarito comentado em livro
referência X").

A escolha de quais 25% recebem solução é por **seed determinístico**:
mesma seed para o mesmo aluno (cookie/localStorage) garante que o
exercício gabaritado de hoje é o mesmo de amanhã se ele voltar à
mesma aula. Isso permite navegação consistente.

Implementação no Clube: componente `<ListaExercicios seed="..." />`
seleciona pseudoaleatoriamente quais terão `<Solucao>` visível.

### Modos de interação

1. **Tentar primeiro**: aluno digita resposta. Sistema valida ou não.
2. **Pedir dica**: 1.ª dica parcial, 2.ª dica mais clara.
3. **Ver solução** (apenas para os 25%): mostra desenvolvimento
   passo a passo.
4. **Discutir**: link para issue do GitHub do Clube com tópico
   pré-criado (sem login, autenticação por GitHub para autoria).

---

## Referências consolidadas

Lista enxuta dos livros mais referenciados neste programa
(ver `livros/CATALOG.md` para o catálogo completo de 243+ livros):

- **Active Calculus** (Boelkins) — Ano 2-3 cálculo, espinha dorsal
- **OpenStax Calculus 1, 2, 3** — backup formal, exercícios
- **APEX Calculus** — alternativa rigorosa
- **Wikilivros Cálculo Vol. 1, 2, 3** (PT-BR) — referência traduzida pronta
- **Beezer FCLA + Hefferon Linear Algebra** — Ano 1 trim 4, Ano 3 trim 12
- **Axler Linear Algebra Done Right** — Ano 3 trim 12 (avançado)
- **Lebl Notes on Diffy Qs** — Ano 3 trim 10
- **Lebl Basic Analysis** — Ano 2 trim 5 (limites e continuidade rigorosa)
- **OpenIntro Statistics + Modern Statistics** — Ano 2 trim 8, Ano 3 trim 11
- **Grinstead-Snell Probability** — Ano 1 trim 4, Ano 2 trim 8
- **REAMAT Cálculo Numérico** — Ano 3 trim 10 (métodos numéricos)
- **OpenStax University Physics 1, 2, 3** — aplicações físicas (transversal)
- **Hammack Book of Proof** — Ano 3 (porta 25/40 com rigor)
- **Battaia Matematica di Base** (IT) — Ano 1 (recuperação de base, traduzir trechos)
- **Stitz-Zeager Precalculus + Trigonometry** — Ano 1 (fundamentos)
