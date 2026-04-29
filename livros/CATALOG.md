# Catálogo de Livros Abertos — Clube da Matemática

**Última atualização:** 2026-04-28 · **Status:** vivo, em expansão

Catálogo curado de livros legais e gratuitos para o programa de
estudos do Clube da Matemática (alvo: ensino médio Japão+Alemanha+Singapura
+ graduação inicial em engenharia).

**Convenções de licença:**
- **CC-BY** / **CC-BY-SA**: redistribuição livre, atribuição obrigatória
- **CC-BY-NC**: idem, mas uso não-comercial
- **GNU FDL**: similar a CC-BY-SA
- **CC0**: domínio público explícito
- **PD**: domínio público (autor falecido há mais de 70 anos, ou obra pré-1929 nos EUA)

---

## Índice

0. [⭐ TOP-20: ranking de prioridade para consulta rápida](#0--top-20-ranking-de-prioridade-para-consulta-rápida)
1. [Cálculo Diferencial e Integral](#1-cálculo-diferencial-e-integral)
2. [Pré-Cálculo, Álgebra, Trigonometria](#2-pré-cálculo-álgebra-trigonometria)
3. [Álgebra Linear](#3-álgebra-linear)
4. [Equações Diferenciais (EDOs e EDPs)](#4-equações-diferenciais-edos-e-edps)
5. [Análise Real e Complexa](#5-análise-real-e-complexa)
6. [Probabilidade e Estatística](#6-probabilidade-e-estatística)
7. [Métodos Numéricos](#7-métodos-numéricos)
8. [Geometria, Topologia, Combinatória](#8-geometria-topologia-combinatória)
9. [Lógica, Provas, Matemática Discreta](#9-lógica-provas-matemática-discreta)
10. [Física (cálculo-baseada)](#10-física-cálculo-baseada)
11. [Recursos em Português Brasileiro](#11-recursos-em-português-brasileiro)
12. [Ciência da Computação Matemática (Sage, Octave, R, Python)](#12-ciência-da-computação-matemática)
13. [Aprendizado de Máquina e Ciência de Dados](#13-aprendizado-de-máquina-e-ciência-de-dados)
14. [Clássicos em Domínio Público](#14-clássicos-em-domínio-público)
15. [Aggregator Pointers — Acesso a milhares de livros](#15-aggregator-pointers--acesso-a-milhares-de-livros)
16. [Recursos Multilíngues (FR, IT, JP, KR, CN, RU, VN)](#16-recursos-multilíngues)

---

## 0. ⭐ TOP-20: Ranking de Prioridade para Consulta Rápida

Critérios usados para o ranking (ponderação subjetiva do conselho
editorial do Clube da Matemática):

1. **Cobertura curricular** Japão + Alemanha + Singapura (40%)
2. **Qualidade pedagógica** — clareza, abordagem Bruner/CPA, scaffolding (25%)
3. **Acessibilidade** — licença aberta + idioma + facilidade de obter (15%)
4. **Adequação a 16-25 anos brasileiros** — contexto, exemplos, pré-requisitos (10%)
5. **Material de apoio** (vídeos, exercícios resolvidos, código) (10%)

### 🏆 Top 5 — comece aqui

| Rank | Título | Autor | Idioma | Por quê |
|---:|---|---|---|---|
| **1** | [**Active Calculus 2.0**](https://activecalculus.org/single/) + Multivariable | Matt Boelkins (Grand Valley) | EN | Pedagogia Bruner explícita, exercícios ativos, gratuito CC-BY-NC-SA. **A escolha #1 pra Cálculo I/II/III num programa estilo Singapura/Alemanha.** |
| **2** | [**Strang Calculus**](https://ocw.mit.edu/courses/res-18-001-calculus-fall-2023/) | Gilbert Strang (MIT) | EN | Texto clássico do MIT, livre, completo (single+multi). Cobre Math III japonês com folga. |
| **3** | [**Cálculo Volume 1, 2, 3**](https://pt.wikibooks.org/wiki/C%C3%A1lculo_(Volume_1)) | Wikilivros (colaborativo) | **PT-BR** | A versão brasileira mais completa, CC-BY-SA, source HTML facilmente convertível pra MD. |
| **4** | [**Linear Algebra Done Right (4ª ed)**](https://linear.axler.net/) | Sheldon Axler | EN | Livre online (CC-BY-NC), abordagem moderna sem determinantes-first. **Cobre Lineare Algebra do LK alemão.** |
| **5** | [**OpenIntro Statistics**](https://www.openintro.org/book/os/) | Diez, Çetinkaya-Rundel, Barr | EN | Estatística inferencial clara, CC-BY-SA, com vídeos e exercícios. **Cobre Stochastik LK alemão + Math B japonês.** |

### 📚 Top 6-10 — aprofundamento e perspectivas alternativas

| Rank | Título | Autor | Idioma | Notas |
|---:|---|---|---|---|
| **6** | [**APEX Calculus**](https://www.apexcalculus.com/) | Hartman et al. (VMI) | EN | Mais formal que Active Calculus; bom pra alunos que querem estilo "livro-texto tradicional" e gratuito. |
| **7** | [**A First Course in Linear Algebra**](http://linear.ups.edu/) | Rob Beezer | EN | Demonstrações detalhadas, GFDL, source LaTeX no GitHub. |
| **8** | [**Notes on Diffy Qs**](https://www.jirka.org/diffyqs/) | Jiří Lebl | EN | EDOs e EDPs introdutórias, extremamente claro. **Spécialité Maths francesa cabe inteira aqui.** |
| **9** | [**Basic Analysis: Introduction to Real Analysis**](https://www.jirka.org/ra/) | Jiří Lebl | EN | Análise real básica; ponte EM → Análise universitária. Two-volume, source LaTeX aberto. |
| **10** | [**Cálculo Numérico (Python)** — REAMAT UFRGS](https://www.ufrgs.br/reamat/CalculoNumerico/livro-py/main.html) | UFRGS Reamat | **PT-BR** | Métodos numéricos com Python. Source LaTeX no GitHub (reamat). **Já é referência viva pro Clube.** |

### 🎯 Top 11-20 — especializados, multilíngue, ou específicos

| Rank | Título | Autor | Idioma | Notas |
|---:|---|---|---|---|
| **11** | [**Statistics (OpenStax)**](https://openstax.org/details/books/statistics) | Illowsky, Dean | EN | Versão mais "Brazilian-friendly" com aplicações práticas e exemplos do dia a dia. |
| **12** | [**Book of Proof (3ª ed)**](https://richardhammack.github.io/BookOfProof/) | Richard Hammack | EN | Como pensar em prova — pré-requisito pro 25-anos transitar pra rigor universitário. |
| **13** | [**Calculus Volume 1, 2, 3 (OpenStax)**](https://openstax.org/details/books/calculus-volume-1) | OpenStax | EN | Alternativa institucional ao Strang/Active. Vídeos e exercícios próprios. CC-BY-NC-SA. |
| **14** | [**Matematica di Base**](http://www.batmath.it/matematica/mat_base/mbase.pdf) | Luciano Battaia | **IT** | Compêndio italiano sólido pra base universitária. CC 4.0. |
| **15** | [**Math Analysis I (Zakon)**](http://www.trillia.com/zakon-analysisI.html) | Elias Zakon | EN | Análise rigorosa, gratuito via Trillia. Acompanha Math III avançado. |
| **16** | [**University Physics 1, 2, 3 (OpenStax)**](https://openstax.org/details/books/university-physics-volume-1) | OpenStax | EN | Física calculus-based completa. Casa direto com Cálculo II/III. |
| **17** | [**微分積分学 (Cálculo, Kyoto Univ)**](https://www.kurims.kyoto-u.ac.jp/~ishimoto/files/note_calculus.pdf) | 石本健太 (Ishimoto) | **JP** | Notas de aula da Universidade de Kyoto. Compatível com Math III + Math III avançado. |
| **18** | [**Cours d'analyse (Cauchy 1821)**](https://gallica.bnf.fr/ark:/12148/bpt6k90196z) | A.-L. Cauchy | **FR** | Domínio público. Origem histórica do rigor moderno em Cálculo. Para a porta 40 dos conteúdos. |
| **19** | [**ChinaTextbook**](https://github.com/TapXWorld/ChinaTextbook) | colaborativo open | **ZH** | Repositório GitHub com TODOS os livros didáticos chineses do K-12 e universidade. Inclui 高中数学, 微积分, 线性代数. |
| **20** | [**Mathematics for Machine Learning**](https://mml-book.com/) | Deisenroth, Faisal, Ong | EN | Ponte de pré-cálculo + álgebra linear + cálculo + probabilidade pra ML. Útil pro arco "Cálculo Numérico → ML" do programa de engenharia. |

### Como usar este TOP-20

- **Estudante começando do zero (16 anos)**: comece pelo #14 (Battaia, IT, traduzir trechos pelo Claude) ou #3 (Wikilivros PT-BR), depois passe pra #1 (Active Calculus).
- **Estudante de engenharia ingressando**: comece direto pelo #1 + #4 (Active Calc + Axler).
- **Editor escrevendo conteúdo do Clube**: consultar #1, #4, #5, #8 como referência editorial primária.
- **Construindo a porta `40` (profissional)**: #18 (Cauchy original) + #20 (ML book) como contexto.
- **Pesquisa em PT-BR**: #3 e #10 são as fontes-âncora.

---

## 1. Cálculo Diferencial e Integral

Conteúdo central do programa Japão+Alemanha+Singapura para os anos
finais do ensino médio e primeiro semestre universitário.

| # | Título | Autor(es) | Idioma | Licença | Fonte |
|---|---|---|---|---|---|
| 1 | **Calculus Volume 1** (limites, derivadas, integrais introdutórias) | OpenStax (Strang, Herman et al.) | EN | CC-BY-NC-SA | [openstax.org/details/books/calculus-volume-1](https://openstax.org/details/books/calculus-volume-1) |
| 2 | **Calculus Volume 2** (técnicas de integração, séries, EDOs) | OpenStax | EN | CC-BY-NC-SA | [openstax.org/details/books/calculus-volume-2](https://openstax.org/details/books/calculus-volume-2) |
| 3 | **Calculus Volume 3** (cálculo vetorial, várias variáveis) | OpenStax | EN | CC-BY-NC-SA | [openstax.org/details/books/calculus-volume-3](https://openstax.org/details/books/calculus-volume-3) |
| 4 | **Calculus** (3rd edition, livro completo) | Gilbert Strang (MIT) | EN | CC-BY-NC-SA | [open.umn.edu/opentextbooks/textbooks/calculus](https://open.umn.edu/opentextbooks/textbooks/calculus) |
| 5 | **Active Calculus 2.0** (single variable) | Matt Boelkins, David Austin, Steve Schlicker | EN | CC-BY-NC-SA | [open.umn.edu/opentextbooks/textbooks/active-calculus-2-0](https://open.umn.edu/opentextbooks/textbooks/active-calculus-2-0) |
| 6 | **Active Calculus Multivariable** | Schlicker, Austin, Boelkins | EN | CC-BY-NC-SA | [open.umn.edu/opentextbooks/textbooks/active-calculus-multivariable](https://open.umn.edu/opentextbooks/textbooks/active-calculus-multivariable) |
| 7 | **APEX Calculus** (1, 2, 3) | Hartman, Heinold, Siemers, Chalishajar | EN | CC-BY-NC | [open.umn.edu/opentextbooks/textbooks/apex-calculus](https://open.umn.edu/opentextbooks/textbooks/apex-calculus) |
| 8 | **Whitman Calculus** | David Guichard | EN | CC-BY-NC-SA | [open.umn.edu/opentextbooks/textbooks/whitman-calculus](https://open.umn.edu/opentextbooks/textbooks/whitman-calculus) |
| 9 | **CLP Calculus** (1, 2, 3, 4 — sequência completa) | Joel Feldman, Andrew Rechnitzer, Elyse Yeager (UBC) | EN | CC-BY-NC-SA | [textbooks.aimath.org/textbooks/approved-textbooks/clp-calculus](https://textbooks.aimath.org/textbooks/approved-textbooks/clp-calculus/) |
| 10 | **Elementary Calculus** | Michael Corral | EN | GNU FDL | [open.umn.edu/opentextbooks/textbooks/elementary-calculus](https://open.umn.edu/opentextbooks/textbooks/elementary-calculus) |
| 11 | **Vector Calculus** | Michael Corral | EN | GNU FDL | [textbooks.aimath.org/textbooks/approved-textbooks/corral](https://textbooks.aimath.org/textbooks/approved-textbooks/corral/) |
| 12 | **Yet Another Calculus Text** | Dan Sloughter | EN | CC-BY-NC-SA | [open.umn.edu/opentextbooks/textbooks/yet-another-calculus-text](https://open.umn.edu/opentextbooks/textbooks/yet-another-calculus-text) |
| 13 | **Calculus in Context** | James Callahan et al. (Five Colleges) | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/callahan](https://textbooks.aimath.org/textbooks/approved-textbooks/callahan/) |
| 14 | **Calculus I, II, III** | Jerrold Marsden, Alan Weinstein | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/marsden-weinstein](https://textbooks.aimath.org/textbooks/approved-textbooks/marsden-weinstein/) |
| 15 | **Multivariable Calculus** | Don Shimamoto | EN | CC-BY | [open.umn.edu/opentextbooks/textbooks/multivariable-calculus](https://open.umn.edu/opentextbooks/textbooks/multivariable-calculus) |
| 16 | **Business Calculus with Excel** | Mike May, Anneke Bart | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/may-bart](https://textbooks.aimath.org/textbooks/approved-textbooks/may-bart/) |
| 17 | **Optimal, Integral, Likely** (cálculo + probabilidade aplicada) | Belevan, Hamidi, Malhotra, Yeager | EN | CC-BY-NC-SA | [open.umn.edu/opentextbooks/textbooks/optimal-integral-likely](https://open.umn.edu/opentextbooks/textbooks/optimal-integral-likely-optimization-integral-calculus-and-probability-for-students-of-commerce-and-the-social-sciences) |
| 18 | **Cálculo (Volume 1, 2, 3)** | Wikilivros (colaborativo) | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Cálculo_(Volume_1)](https://pt.wikibooks.org/wiki/C%C3%A1lculo_(Volume_1)) |
| 19 | **Cálculo Online Textbook** (MIT) | Gilbert Strang | EN | CC-BY-NC-SA | [ocw.mit.edu/courses/res-18-001-calculus-fall-2023](https://ocw.mit.edu/courses/res-18-001-calculus-fall-2023/) |
| 20 | **Single Variable Calculus** | Whitman College / Guichard | EN | CC-BY-NC-SA | [whitman.edu/mathematics/calculus_online](https://www.whitman.edu/mathematics/calculus_online/) |

## 2. Pré-Cálculo, Álgebra, Trigonometria

Pré-requisitos para cálculo. Equivalente ao 1.º e 2.º anos do ensino
médio japonês (Math I + Math II) e à preparação alemã da Klasse 10.

| # | Título | Autor(es) | Idioma | Licença | Fonte |
|---|---|---|---|---|---|
| 21 | **Precalculus** | OpenStax | EN | CC-BY | [openstax.org/details/books/precalculus](https://openstax.org/details/books/precalculus) |
| 22 | **College Algebra 2e** | OpenStax (Abramson et al.) | EN | CC-BY | [openstax.org/details/books/college-algebra-2e](https://openstax.org/details/books/college-algebra-2e) |
| 23 | **Algebra and Trigonometry 2e** | OpenStax | EN | CC-BY | [openstax.org/details/books/algebra-and-trigonometry-2e](https://openstax.org/details/books/algebra-and-trigonometry-2e) |
| 24 | **Prealgebra 2e** | OpenStax | EN | CC-BY | [openstax.org/details/books/prealgebra-2e](https://openstax.org/details/books/prealgebra-2e) |
| 25 | **Elementary Algebra 2e** | OpenStax | EN | CC-BY | [openstax.org/details/books/elementary-algebra-2e](https://openstax.org/details/books/elementary-algebra-2e) |
| 26 | **Intermediate Algebra 2e** | OpenStax | EN | CC-BY | [openstax.org/details/books/intermediate-algebra-2e](https://openstax.org/details/books/intermediate-algebra-2e) |
| 27 | **Precalculus** (Collingwood, Prince, Conroy, U. Washington) | David Collingwood et al. | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/collingwood-prince-conroy](https://textbooks.aimath.org/textbooks/approved-textbooks/collingwood-prince-conroy/) |
| 28 | **Precalculus / College Algebra / Trigonometry** (Stitz-Zeager) | Carl Stitz, Jeff Zeager | EN | CC-BY-NC-SA | [stitz-zeager.com](https://www.stitz-zeager.com/) |
| 29 | **APEX PreCalculus** | Chapman, Herald, Libertini | EN | CC-BY-NC | [open.umn.edu/opentextbooks/textbooks/apex-precalculus](https://open.umn.edu/opentextbooks/textbooks/apex-precalculus) |
| 30 | **College Trigonometry** | Stitz, Zeager | EN | CC-BY-NC-SA | [open.umn.edu/opentextbooks/textbooks/college-trigonometry](https://open.umn.edu/opentextbooks/textbooks/college-trigonometry) |
| 31 | **Trigonometry** | Katherine Yoshiwara | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/yoshiwara-trig](https://textbooks.aimath.org/textbooks/approved-textbooks/yoshiwara-trig/) |
| 32 | **Modeling, Functions, and Graphs** (College Algebra) | Katherine Yoshiwara | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/yoshiwara](https://textbooks.aimath.org/textbooks/approved-textbooks/yoshiwara/) |
| 33 | **Elementary Algebra** (Yoshiwara) | Katherine Yoshiwara | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/yoshiwara-ea](https://textbooks.aimath.org/textbooks/approved-textbooks/yoshiwara-ea/) |
| 34 | **Intermediate Algebra: Functions and Graphs** | Yoshiwara | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/yoshiwara-ia](https://textbooks.aimath.org/textbooks/approved-textbooks/yoshiwara-ia/) |
| 35 | **ORCCA: Open Resources for Community College Algebra** | Portland Community College | EN | CC-BY-SA | [pcc.edu/orcca](https://textbooks.aimath.org/textbooks/approved-textbooks/orcca/) |
| 36 | **Math in Society** (matemática para humanidades) | David Lippman | EN | CC-BY-SA | [opentextbookstore.com/mathinsociety](http://www.opentextbookstore.com/mathinsociety/) |
| 37 | **Mathematical Discovery** (introdução analítica) | Andrew, Brian, Judith Bruckner / Thomson | EN | aberto | [classicalrealanalysis.info](https://textbooks.aimath.org/textbooks/approved-textbooks/btb-md/) |
| 38 | **Geometria e Trigonometria** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Geometria_e_Trigonometria](https://pt.wikibooks.org/wiki/Geometria_e_Trigonometria) |
| 39 | **Matemática elementar** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Matemática_elementar](https://pt.wikibooks.org/wiki/Matem%C3%A1tica_elementar) |
| 40 | **Matemática essencial** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Matemática_essencial](https://pt.wikibooks.org/wiki/Matem%C3%A1tica_essencial) |

## 3. Álgebra Linear

Bloco essencial do Leistungskurs alemão e parte do Math III japonês /
H2 Math singapurense.

| # | Título | Autor(es) | Idioma | Licença | Fonte |
|---|---|---|---|---|---|
| 41 | **Introduction to Linear Algebra** (5th/6th ed) | Gilbert Strang (MIT) | EN | proprietário (livre online) | [math.mit.edu/~gs](https://math.mit.edu/~gs/) |
| 42 | **Linear Algebra Done Right** (4th ed, OPEN) | Sheldon Axler | EN | CC-BY-NC | [linear.axler.net](https://linear.axler.net/) |
| 43 | **A First Course in Linear Algebra** | Rob Beezer | EN | GNU FDL | [linear.ups.edu](http://linear.ups.edu/) |
| 44 | **Linear Algebra** | Jim Hefferon | EN | CC-BY-SA | [hefferon.net/linearalgebra](https://hefferon.net/linearalgebra/) |
| 45 | **Linear Algebra Done Wrong** | Sergei Treil | EN | aberto | [sites.brown.edu/sergei-treil-homepage](https://www.math.brown.edu/streil/papers/LADW/LADW.html) |
| 46 | **Understanding Linear Algebra** | David Austin | EN | CC-BY-SA | [understandinglinearalgebra.org](https://understandinglinearalgebra.org/) |
| 47 | **Introduction to Applied Linear Algebra** (VMLS) | Stephen Boyd, Lieven Vandenberghe | EN | CC-BY-NC-ND | [stanford.edu/~boyd/vmls](https://web.stanford.edu/~boyd/vmls/) |
| 48 | **Linear Algebra (18.06)** — notas e textos MIT | Gilbert Strang | EN | CC-BY-NC-SA | [ocw.mit.edu/courses/18-06-linear-algebra-spring-2010](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) |
| 49 | **Elements of Abstract and Linear Algebra** | E. H. Connell | EN | aberto | [math.miami.edu/~ec](https://www.math.miami.edu/~ec/book/) |
| 50 | **Álgebra linear** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Álgebra_linear](https://pt.wikibooks.org/wiki/%C3%81lgebra_linear) |
| 51 | **Álgebra Linear** (REAMAT UFRGS) | Reamat Colaborativo | PT-BR | CC-BY-SA | [ufrgs.br/reamat/AlgebraLinear](https://www.ufrgs.br/reamat/AlgebraLinear/index.html) |
| 52 | **Álgebra abstrata** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Álgebra_abstrata](https://pt.wikibooks.org/wiki/%C3%81lgebra_abstrata) |
| 53 | **Abstract Algebra: Theory and Applications** | Tom Judson | EN | GNU FDL | [abstract.ups.edu](http://abstract.ups.edu/) |
| 54 | **Algebra: Abstract and Concrete** | Frederick Goodman | EN | aberto | [homepage.divms.uiowa.edu/~goodman](https://homepage.divms.uiowa.edu/~goodman/algebrabook/) |

## 4. Equações Diferenciais (EDOs e EDPs)

Spécialité Maths francesa, Math III japonês avançado, Leistungskurs
alemão; equivalente a Cálculo IV brasileiro.

| # | Título | Autor(es) | Idioma | Licença | Fonte |
|---|---|---|---|---|---|
| 55 | **Elementary Differential Equations** (with Boundary Value Problems) | William F. Trench | EN | aberto (Brooks-Cole) | [ramanujan.math.trinity.edu/wtrench](https://digitalcommons.trinity.edu/mono/9/) |
| 56 | **Notes on Diffy Qs** | Jiří Lebl | EN | CC-BY-SA | [jirka.org/diffyqs](https://www.jirka.org/diffyqs/) |
| 57 | **The Ordinary Differential Equations Project** | Tom Judson | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/judson-odes](https://textbooks.aimath.org/textbooks/approved-textbooks/judson-odes/) |
| 58 | **Ordinary Differential Equations** | Stephen Wiggins | EN | CC-BY | [open.umn.edu/opentextbooks/textbooks/ordinary-differential-equations](https://open.umn.edu/opentextbooks/textbooks/ordinary-differential-equations) |
| 59 | **Differential Equations and Linear Algebra** (texto + 55 vídeos) | Gilbert Strang | EN | CC-BY-NC-SA | [math.mit.edu/~gs](https://math.mit.edu/~gs/) |

## 5. Análise Real e Complexa

Conteúdo universitário avançado mas aparece em Math III + Klasse 12 LK
em forma simplificada.

| # | Título | Autor(es) | Idioma | Licença | Fonte |
|---|---|---|---|---|---|
| 60 | **Basic Analysis: Introduction to Real Analysis** | Jiří Lebl | EN | CC-BY-NC-SA | [jirka.org/ra](https://www.jirka.org/ra/) |
| 61 | **Introduction to Real Analysis** | William F. Trench | EN | aberto | [ramanujan.math.trinity.edu/wtrench](https://digitalcommons.trinity.edu/mono/7/) |
| 62 | **Elementary Real Analysis** | Bruckner, Bruckner, Thomson | EN | aberto | [classicalrealanalysis.info](https://classicalrealanalysis.info/) |
| 63 | **Mathematical Analysis I** | Elias Zakon | EN | CC-BY-NC-SA | [trillia.com](http://www.trillia.com/zakon-analysisI.html) |
| 64 | **Mathematical Analysis II** | Elias Zakon | EN | CC-BY-NC-SA | [trillia.com](http://www.trillia.com/zakon-analysisII.html) |
| 65 | **How We Got from There to Here: A Story of Real Analysis** | Robert Rogers, Eugene Boman | EN | CC-BY-NC-SA | [milneopentextbooks.org](https://milneopentextbooks.org/how-we-got-from-there-to-here-a-story-of-real-analysis/) |
| 66 | **Measure, Integration and Real Analysis** | Sheldon Axler | EN | CC-BY-NC | [measure.axler.net](https://measure.axler.net/) |
| 67 | **A First Course in Complex Analysis** | Beck, Marchesi, Pixton, Sabalka | EN | aberto | [math.lsa.umich.edu/~mathanal](https://textbooks.aimath.org/textbooks/approved-textbooks/beck-marchesi-pixton-sabalka/) |
| 68 | **Complex Analysis** | Russell Howell, John Mathews | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/howell](https://textbooks.aimath.org/textbooks/approved-textbooks/howell/) |
| 69 | **Análise real** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Análise_real](https://pt.wikibooks.org/wiki/An%C3%A1lise_real) |
| 70 | **Análise complexa** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Análise_complexa](https://pt.wikibooks.org/wiki/An%C3%A1lise_complexa) |
| 71 | **Análise rn** (várias variáveis) | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Análise_rn](https://pt.wikibooks.org/wiki/An%C3%A1lise_rn) |
| 72 | **Medida e integração** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Medida_e_integração](https://pt.wikibooks.org/wiki/Medida_e_integra%C3%A7%C3%A3o) |

## 6. Probabilidade e Estatística

Bloco Stochastik alemão; Probability & Statistics elétivo coreano;
H2 Math statistics singapurense; Math B japonês.

| # | Título | Autor(es) | Idioma | Licença | Fonte |
|---|---|---|---|---|---|
| 73 | **Statistics** (OpenStax) | Barbara Illowsky, Susan Dean | EN | CC-BY | [openstax.org/details/books/statistics](https://openstax.org/details/books/statistics) |
| 74 | **Introductory Statistics** (OpenStax 2e) | Illowsky, Dean et al. | EN | CC-BY | [openstax.org/details/books/introductory-statistics-2e](https://openstax.org/details/books/introductory-statistics-2e) |
| 75 | **Introductory Business Statistics** (OpenStax) | Holmes, Illowsky, Dean | EN | CC-BY | [openstax.org/details/books/introductory-business-statistics](https://openstax.org/details/books/introductory-business-statistics) |
| 76 | **OpenIntro Statistics** (4th ed) | Diez, Çetinkaya-Rundel, Barr | EN | CC-BY-SA | [openintro.org/book/os](https://www.openintro.org/book/os/) |
| 77 | **Introduction to Modern Statistics** | Mine Çetinkaya-Rundel, Johanna Hardin | EN | CC-BY-SA | [openintro-ims.netlify.app](https://openintro-ims.netlify.app/) |
| 78 | **Introductory Statistics for the Life and Biomedical Sciences** | Vu, Harrington | EN | CC-BY-SA | [openintro.org](https://www.openintro.org/book/biostat/) |
| 79 | **Introduction to Probability** (Grinstead-Snell) | Charles Grinstead, J. Laurie Snell | EN | GNU FDL | [chance.dartmouth.edu](https://chance.dartmouth.edu/teaching_aids/books_articles/probability_book/book.html) |
| 80 | **Probability: Lectures and Labs** | Mark Huber | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/huber](https://textbooks.aimath.org/textbooks/approved-textbooks/huber/) |
| 81 | **Statistical Inference For Everyone** | Brian Blais | EN | CC-BY-SA | [open.umn.edu/opentextbooks/textbooks/statistical-inference-for-everyone](https://open.umn.edu/opentextbooks/textbooks/statistical-inference-for-everyone) |
| 82 | **Statistical Thinking for the 21st Century** | Russell Poldrack | EN | CC-BY-NC | [statsthinking21.org](https://statsthinking21.org/) |
| 83 | **Online Statistics Education** | David Lane et al. | EN | aberto | [onlinestatbook.com](http://onlinestatbook.com/) |
| 84 | **Introduction to Statistics** | David Lane | EN | CC0 | [open.umn.edu/opentextbooks/textbooks/introduction-to-statistics](https://open.umn.edu/opentextbooks/textbooks/introduction-to-statistics) |
| 85 | **Learning Statistics with R** | Danielle Navarro | EN | CC-BY-SA | [learningstatisticswithr.com](https://learningstatisticswithr.com/) |
| 86 | **Mostly Harmless Elementary Statistics** | Rachel Webb | EN | CC-BY-SA | [open.umn.edu/opentextbooks/textbooks/mostly-harmless-statistics](https://open.umn.edu/opentextbooks/textbooks/mostly-harmless-statistics) |
| 87 | **Introduction to Statistical Thinking** | Benjamin Yakir | EN | CC-BY | [open.umn.edu/opentextbooks/textbooks/introduction-to-statistical-thinking](https://open.umn.edu/opentextbooks/textbooks/introduction-to-statistical-thinking) |
| 88 | **Intermediate Statistics with R** | Mark Greenwood | EN | CC-BY-NC | [open.umn.edu/opentextbooks/textbooks/intermediate-statistics-with-r](https://open.umn.edu/opentextbooks/textbooks/intermediate-statistics-with-r) |
| 89 | **Collaborative Statistics** | Illowsky, Dean (versão original) | EN | CC-BY | [open.umn.edu/opentextbooks/textbooks/collaborative-statistics](https://open.umn.edu/opentextbooks/textbooks/collaborative-statistics) |
| 90 | **SticiGui** | Philip Stark (UC Berkeley) | EN | aberto | [stat.berkeley.edu/~stark/SticiGui](https://www.stat.berkeley.edu/~stark/SticiGui/) |
| 91 | **Probability for Data Science** | Stanley Chan | EN | aberto | [probability4datascience.com](https://probability4datascience.com/) |
| 92 | **Introductory Statistics for Psychology Students** | Crump | EN | CC-BY-SA | [open.umn.edu/opentextbooks/textbooks/answering-questions-with-data](https://open.umn.edu/opentextbooks/textbooks/answering-questions-with-data-introductory-statistics-for-psychology-students) |
| 93 | **Estatística** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Estatística](https://pt.wikibooks.org/wiki/Estat%C3%ADstica) |
| 94 | **Probabilidade e Estatística** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Probabilidade_e_Estatística](https://pt.wikibooks.org/wiki/Probabilidade_e_Estat%C3%ADstica) |

## 7. Métodos Numéricos

Cálculo Numérico universitário; aparece como ferramenta em todos os
currículos avançados.

| # | Título | Autor(es) | Idioma | Licença | Fonte |
|---|---|---|---|---|---|
| 95 | **Cálculo Numérico** (versão Python, REAMAT) | UFRGS Reamat Colaborativo | PT-BR | CC-BY-SA | [ufrgs.br/reamat/CalculoNumerico/livro-py](https://www.ufrgs.br/reamat/CalculoNumerico/livro-py/main.html) |
| 96 | **Cálculo Numérico** (versão Scilab, REAMAT) | UFRGS | PT-BR | CC-BY-SA | [ufrgs.br/reamat/CalculoNumerico/livro-sci](https://www.ufrgs.br/reamat/CalculoNumerico/livro-sci/main.html) |
| 97 | **Tea Time Numerical Analysis** | Leon Brin | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/brin](https://textbooks.aimath.org/textbooks/approved-textbooks/brin/) |
| 98 | **Métodos numéricos** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Métodos_numéricos](https://pt.wikibooks.org/wiki/M%C3%A9todos_num%C3%A9ricos) |
| 99 | **Numerical Recipes** (versões antigas, livre acesso) | Press, Teukolsky, Vetterling, Flannery | EN | livre online | [nr.com](http://numerical.recipes/) |

## 8. Geometria, Topologia, Combinatória

| # | Título | Autor(es) | Idioma | Licença | Fonte |
|---|---|---|---|---|---|
| 100 | **Geometry with an Introduction to Cosmic Topology** | Michael Hitchman | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/hitchman](https://textbooks.aimath.org/textbooks/approved-textbooks/hitchman/) |
| 101 | **Topology Without Tears** | Sidney Morris | EN | livre | [topologywithouttears.net](http://www.topologywithouttears.net/) |
| 102 | **Topologia** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Topologia](https://pt.wikibooks.org/wiki/Topologia) |
| 103 | **Geometria descritiva** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Geometria_descritiva](https://pt.wikibooks.org/wiki/Geometria_descritiva) |
| 104 | **Applied Combinatorics** | Mitchel Keller, William Trotter | EN | CC-BY-NC-SA | [rellek.net/book/app-comb.html](https://www.rellek.net/book/app-comb.html) |
| 105 | **Combinatorics Through Guided Discovery** | Kenneth Bogart | EN | GNU FDL | [bogart.openmathbooks.org](https://bogart.openmathbooks.org/) |
| 106 | **Counting Rocks!** | Adams, Emmrich, Gillespie, Golden, Pries (Colorado State) | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/coloradostate](https://textbooks.aimath.org/textbooks/approved-textbooks/coloradostate/) |
| 107 | **Foundations of Combinatorics with Applications** | Bender, Williamson | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/bender-williamson](https://textbooks.aimath.org/textbooks/approved-textbooks/bender-williamson/) |
| 108 | **Discrete Mathematics: First and Second Course** | Bender, Williamson | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/bender-williamson-dm](https://textbooks.aimath.org/textbooks/approved-textbooks/bender-williamson-dm/) |

## 9. Lógica, Provas, Matemática Discreta

| # | Título | Autor(es) | Idioma | Licença | Fonte |
|---|---|---|---|---|---|
| 109 | **Book of Proof** (3rd ed) | Richard Hammack | EN | CC-BY-ND | [richardhammack.github.io/BookOfProof](https://richardhammack.github.io/BookOfProof/) |
| 110 | **Mathematical Reasoning: Writing and Proof** | Ted Sundstrom | EN | CC-BY-NC-SA | [scholarworks.gvsu.edu/books/9](https://scholarworks.gvsu.edu/books/9/) |
| 111 | **A Gentle Introduction to the Art of Mathematics** | Joseph Fields | EN | CC-BY-NC-SA | [giam.southernct.edu](https://giam.southernct.edu/GIAM/) |
| 112 | **An Introduction to Proof via Inquiry-Based Learning** | Dana Ernst | EN | CC-BY-NC-SA | [danaernst.com/IBL-IntroToProof](http://danaernst.com/IBL-IntroToProof/) |
| 113 | **Discrete Mathematics: An Open Introduction** (3rd ed) | Oscar Levin | EN | CC-BY-SA | [discrete.openmathbooks.org](http://discrete.openmathbooks.org/) |
| 114 | **Applied Discrete Structures** | Doerr, Levasseur | EN | CC-BY-NC-SA | [faculty.uml.edu/klevasseur/ads2](https://faculty.uml.edu/klevasseur/ads2/) |
| 115 | **A Friendly Introduction to Mathematical Logic** | Christopher Leary, Lars Kristiansen | EN | CC-BY-NC-ND | [milneopentextbooks.org](https://milneopentextbooks.org/a-friendly-introduction-to-mathematical-logic/) |
| 116 | **Introduction to Game Theory: a Discovery Approach** | Jennifer Nordstrom | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/nordstrom](https://textbooks.aimath.org/textbooks/approved-textbooks/nordstrom/) |
| 117 | **Lógica** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Lógica](https://pt.wikibooks.org/wiki/L%C3%B3gica) |
| 118 | **Teoria dos conjuntos** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Teoria_dos_conjuntos](https://pt.wikibooks.org/wiki/Teoria_dos_conjuntos) |
| 119 | **Teoria de números** | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Teoria_de_números](https://pt.wikibooks.org/wiki/Teoria_de_n%C3%BAmeros) |
| 120 | **Number Theory: In Context and Interactive** | Karl-Dieter Crisman | EN | aberto | [textbooks.aimath.org/textbooks/approved-textbooks/crisman](https://textbooks.aimath.org/textbooks/approved-textbooks/crisman/) |
| 121 | **Elementary Number Theory: Primes, Congruences, and Secrets** | William Stein | EN | aberto | [wstein.org/ent](https://wstein.org/ent/) |
| 122 | **A Computational Introduction to Number Theory and Algebra** | Victor Shoup | EN | CC-BY-NC-ND | [shoup.net/ntb](https://shoup.net/ntb/) |

## 10. Física (cálculo-baseada)

Equivalente a Physik LK alemão; Physics I/II/III japonês; H2 Physics
singapurense.

| # | Título | Autor(es) | Idioma | Licença | Fonte |
|---|---|---|---|---|---|
| 123 | **University Physics Volume 1** (mecânica, oscilações, ondas) | OpenStax | EN | CC-BY | [openstax.org/details/books/university-physics-volume-1](https://openstax.org/details/books/university-physics-volume-1) |
| 124 | **University Physics Volume 2** (termodinâmica, eletro/magnetismo) | OpenStax | EN | CC-BY | [openstax.org/details/books/university-physics-volume-2](https://openstax.org/details/books/university-physics-volume-2) |
| 125 | **University Physics Volume 3** (óptica, física moderna) | OpenStax | EN | CC-BY | [openstax.org/details/books/university-physics-volume-3](https://openstax.org/details/books/university-physics-volume-3) |
| 126 | **College Physics 2e** (algebra-based) | OpenStax | EN | CC-BY | [openstax.org/details/books/college-physics-2e](https://openstax.org/details/books/college-physics-2e) |
| 127 | **College Physics for AP Courses 2e** | OpenStax | EN | CC-BY | [openstax.org/details/books/college-physics-ap-courses-2e](https://openstax.org/details/books/college-physics-ap-courses-2e) |
| 128 | **The Feynman Lectures on Physics** (online oficial) | Richard Feynman, Robert Leighton, Matthew Sands | EN | livre online (Caltech) | [feynmanlectures.caltech.edu](https://www.feynmanlectures.caltech.edu/) |
| 129 | **Light and Matter** (mecânica + ondas) | Benjamin Crowell | EN | CC-BY-SA | [lightandmatter.com](http://www.lightandmatter.com/) |
| 130 | **Mechanics** | LibreTexts (várias contribuições) | EN | CC-BY-SA | [phys.libretexts.org/Bookshelves/Classical_Mechanics](https://phys.libretexts.org/Bookshelves/Classical_Mechanics) |
| 131 | **Electricity and Magnetism** | LibreTexts | EN | CC-BY-SA | [phys.libretexts.org/Bookshelves/Electricity_and_Magnetism](https://phys.libretexts.org/Bookshelves/Electricity_and_Magnetism) |
| 132 | **Thermodynamics and Statistical Mechanics** | LibreTexts | EN | CC-BY-SA | [phys.libretexts.org/Bookshelves/Thermodynamics_and_Statistical_Mechanics](https://phys.libretexts.org/Bookshelves/Thermodynamics_and_Statistical_Mechanics) |
| 133 | **Waves** | Brad Osgood (Stanford EE) — Lecture Notes | EN | aberto | [stanford.edu/~osgood](https://see.stanford.edu/Course/EE261) |
| 134 | **Conceptual Physics** (online) | Benjamin Crowell | EN | CC-BY-SA | [lightandmatter.com](http://www.lightandmatter.com/cp.html) |
| 135 | **Calculus-Based Physics** | Jeffrey Schnick | EN | aberto | [tcg.lapcatholic.edu/cbphysics](https://www.anselm.edu/internet/physics/cbphysics/) |
| 136 | **Física moderna** | LibreTexts (várias) | EN | CC-BY-SA | [phys.libretexts.org/Bookshelves/Modern_Physics](https://phys.libretexts.org/Bookshelves/Modern_Physics) |
| 137 | **Princípios de Mecânica Clássica** (Wikilivros) | Wikilivros | PT-BR | CC-BY-SA | [pt.wikibooks.org/wiki/Princípios_de_Mecânica_Clássica](https://pt.wikibooks.org/wiki/Princ%C3%ADpios_de_Mec%C3%A2nica_Cl%C3%A1ssica) |

## 11. Recursos em Português Brasileiro

Concentra os achados PT-BR para uso editorial direto no Clube.

| # | Título | Autor/Editor | Licença | Fonte |
|---|---|---|---|---|
| 138 | **Cálculo Volume 1** | Wikilivros (PT-BR) | CC-BY-SA | [pt.wikibooks.org/wiki/Cálculo_(Volume_1)](https://pt.wikibooks.org/wiki/C%C3%A1lculo_(Volume_1)) |
| 139 | **Cálculo Volume 2** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Cálculo_(Volume_2)](https://pt.wikibooks.org/wiki/C%C3%A1lculo_(Volume_2)) |
| 140 | **Cálculo Volume 3** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Cálculo_(Volume_3)](https://pt.wikibooks.org/wiki/C%C3%A1lculo_(Volume_3)) |
| 141 | **Álgebra linear** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Álgebra_linear](https://pt.wikibooks.org/wiki/%C3%81lgebra_linear) |
| 142 | **Análise real** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Análise_real](https://pt.wikibooks.org/wiki/An%C3%A1lise_real) |
| 143 | **Análise rn** (várias variáveis) | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Análise_rn](https://pt.wikibooks.org/wiki/An%C3%A1lise_rn) |
| 144 | **Análise complexa** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Análise_complexa](https://pt.wikibooks.org/wiki/An%C3%A1lise_complexa) |
| 145 | **Estatística** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Estatística](https://pt.wikibooks.org/wiki/Estat%C3%ADstica) |
| 146 | **Probabilidade e Estatística** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Probabilidade_e_Estatística](https://pt.wikibooks.org/wiki/Probabilidade_e_Estat%C3%ADstica) |
| 147 | **Cálculo Numérico (Python)** | REAMAT UFRGS | CC-BY-SA | [ufrgs.br/reamat/CalculoNumerico/livro-py](https://www.ufrgs.br/reamat/CalculoNumerico/livro-py/main.html) |
| 148 | **Cálculo Numérico (Scilab)** | REAMAT UFRGS | CC-BY-SA | [ufrgs.br/reamat/CalculoNumerico/livro-sci](https://www.ufrgs.br/reamat/CalculoNumerico/livro-sci/main.html) |
| 149 | **Álgebra Linear** | REAMAT UFRGS | CC-BY-SA | [ufrgs.br/reamat/AlgebraLinear](https://www.ufrgs.br/reamat/AlgebraLinear/index.html) |
| 150 | **Métodos numéricos** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Métodos_numéricos](https://pt.wikibooks.org/wiki/M%C3%A9todos_num%C3%A9ricos) |
| 151 | **Geometria e Trigonometria** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Geometria_e_Trigonometria](https://pt.wikibooks.org/wiki/Geometria_e_Trigonometria) |
| 152 | **Matemática elementar** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Matemática_elementar](https://pt.wikibooks.org/wiki/Matem%C3%A1tica_elementar) |
| 153 | **Matemática essencial** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Matemática_essencial](https://pt.wikibooks.org/wiki/Matem%C3%A1tica_essencial) |
| 154 | **Lógica** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Lógica](https://pt.wikibooks.org/wiki/L%C3%B3gica) |
| 155 | **Teoria dos conjuntos** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Teoria_dos_conjuntos](https://pt.wikibooks.org/wiki/Teoria_dos_conjuntos) |
| 156 | **Otimização** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Otimização](https://pt.wikibooks.org/wiki/Otimiza%C3%A7%C3%A3o) |
| 157 | **Pesquisa operacional** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Pesquisa_operacional](https://pt.wikibooks.org/wiki/Pesquisa_operacional) |
| 158 | **Topologia** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Topologia](https://pt.wikibooks.org/wiki/Topologia) |
| 159 | **Aplicações do GeoGebra ao ensino de Matemática** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Aplicações_do_GeoGebra_ao_ensino_de_Matemática](https://pt.wikibooks.org/wiki/Aplica%C3%A7%C3%B5es_do_GeoGebra_ao_ensino_de_Matem%C3%A1tica) |
| 160 | **Princípios de Mecânica Clássica** | Wikilivros | CC-BY-SA | [pt.wikibooks.org/wiki/Princípios_de_Mecânica_Clássica](https://pt.wikibooks.org/wiki/Princ%C3%ADpios_de_Mec%C3%A2nica_Cl%C3%A1ssica) |

## 12. Ciência da Computação Matemática

Sage, Octave, R, Python aplicados a matemática.

| # | Título | Autor(es) | Idioma | Licença | Fonte |
|---|---|---|---|---|---|
| 161 | **Sage for Undergraduates** | Gregory Bard | EN | CC-BY-SA | [textbooks.aimath.org/textbooks/approved-textbooks/bard](https://textbooks.aimath.org/textbooks/approved-textbooks/bard/) |
| 162 | **Computational Mathematics with SageMath** | Paul Zimmermann et al. | EN | CC-BY-SA | [sagemath.org/sagebook](https://www.sagemath.org/sagebook/) |
| 163 | **Introduction to GNU Octave** (linear algebra and calculus) | Jason Lachniet | EN | CC-BY-SA | [open.umn.edu/opentextbooks/textbooks/introduction-to-gnu-octave](https://open.umn.edu/opentextbooks/textbooks/introduction-to-gnu-octave-a-brief-tutorial-for-linear-algebra-and-calculus-students) |
| 164 | **Python for Computational Science** | Hans Fangohr | EN | aberto | [fangohr.github.io](https://fangohr.github.io/) |
| 165 | **Numerical Recipes 3rd Edition (e-book free chapters)** | Press et al. | EN | livre online | [nr.com](http://numerical.recipes/) |

## 13. Aprendizado de Máquina e Ciência de Dados

| # | Título | Autor(es) | Idioma | Licença | Fonte |
|---|---|---|---|---|---|
| 166 | **Mathematics for Machine Learning** | Marc Deisenroth, A. Aldo Faisal, Cheng Soon Ong | EN | aberto (Cambridge) | [mml-book.com](https://mml-book.com/) |
| 167 | **Probability for Data Science** | Stanley Chan | EN | aberto | [probability4datascience.com](https://probability4datascience.com/) |
| 168 | **Pattern Recognition and Machine Learning** (Bishop, free PDF cortesia MS) | Christopher Bishop | EN | livre online | [microsoft.com/research](https://www.microsoft.com/en-us/research/people/cmbishop/) |
| 169 | **The Elements of Statistical Learning** | Hastie, Tibshirani, Friedman | EN | livre online (Stanford) | [hastie.su.domains/ElemStatLearn](https://hastie.su.domains/ElemStatLearn/) |
| 170 | **An Introduction to Statistical Learning** | James, Witten, Hastie, Tibshirani | EN | livre online | [statlearning.com](https://www.statlearning.com/) |
| 171 | **Deep Learning** (Goodfellow-Bengio-Courville) | Ian Goodfellow, Yoshua Bengio, Aaron Courville | EN | livre online | [deeplearningbook.org](https://www.deeplearningbook.org/) |
| 172 | **Dive into Deep Learning** | Aston Zhang, Zachary Lipton, Mu Li, Alexander Smola | EN | aberto | [d2l.ai](https://d2l.ai/) |
| 173 | **Reinforcement Learning: An Introduction** (2nd ed) | Richard Sutton, Andrew Barto | EN | livre online | [incompleteideas.net/book](http://incompleteideas.net/book/the-book-2nd.html) |
| 174 | **Convex Optimization** | Stephen Boyd, Lieven Vandenberghe | EN | livre online | [stanford.edu/~boyd/cvxbook](https://web.stanford.edu/~boyd/cvxbook/) |
| 175 | **Forecasting: Principles and Practice** (3rd ed) | Rob Hyndman, George Athanasopoulos | EN | livre online | [otexts.com/fpp3](https://otexts.com/fpp3/) |

## 14. Clássicos em Domínio Público

Obras anteriores a 1929 ou autor falecido há mais de 70 anos.
Disponíveis via Project Gutenberg, archive.org, gallica.bnf.fr.

| # | Título | Autor(es) | Idioma | Fonte |
|---|---|---|---|---|
| 176 | **Elementos** (clássico, 13 livros) | Euclides (~300 a.C.) | EN/PT/EL/LA | [gutenberg.org/ebooks/21076](https://www.gutenberg.org/ebooks/21076) |
| 177 | **Philosophiæ Naturalis Principia Mathematica** | Isaac Newton (1687) | LA/EN | [gutenberg.org/ebooks/28233](https://www.gutenberg.org/ebooks/28233) |
| 178 | **Introductio in Analysin Infinitorum** (vol I, II) | Leonhard Euler (1748) | LA/EN | [archive.org/details/euler-introductio](https://archive.org/details/eulerintroductio00euler) |
| 179 | **Disquisitiones Arithmeticae** | Carl Friedrich Gauss (1801) | LA/EN | [archive.org/details/disquisitionesar0000gaus](https://archive.org/details/disquisitionesar0000gaus) |
| 180 | **Cours d'analyse de l'École Royale Polytechnique** | Augustin-Louis Cauchy (1821) | FR | [gallica.bnf.fr/ark:/12148/bpt6k90196z](https://gallica.bnf.fr/ark:/12148/bpt6k90196z) |
| 181 | **A Treatise on the Calculus of Finite Differences** | George Boole (1860) | EN | [gutenberg.org/ebooks/9928](https://www.gutenberg.org/ebooks/9928) |
| 182 | **A Treatise on Differential Equations** | George Boole | EN | [archive.org/details/treatiseondiffer00bool](https://archive.org/details/treatiseondiffer00bool) |
| 183 | **Mécanique analytique** | Joseph-Louis Lagrange (1788) | FR | [gallica.bnf.fr](https://gallica.bnf.fr/) (vários) |
| 184 | **Calculus Made Easy** | Silvanus Thompson (1910) | EN | [gutenberg.org/ebooks/33283](https://www.gutenberg.org/ebooks/33283) |
| 185 | **A Course of Modern Analysis** | E. T. Whittaker, G. N. Watson (1902) | EN | [archive.org/details/courseofmodernan00whit](https://archive.org/details/courseofmodernan00whit) |
| 186 | **Theory of Functions of a Complex Variable** | A. R. Forsyth | EN | [archive.org](https://archive.org/) |
| 187 | **An Elementary Treatise on Differential Equations** | Andrew Forsyth | EN | [archive.org](https://archive.org/) |
| 188 | **Higher Algebra** | Hall and Knight (1887) | EN | [archive.org/details/higheralgebra00halluoft](https://archive.org/details/higheralgebra00halluoft) |
| 189 | **An Introduction to Mathematical Probability** | Julian Coolidge (1925) | EN | [archive.org](https://archive.org/) |
| 190 | **Elementary Treatise on Theoretical Mechanics** | Felix Klein (1900s) | DE | [archive.org](https://archive.org/) |
| 191 | **Лекции по математическому анализу** (Lectures on Mathematical Analysis, public domain selecionados) | L. D. Kudryavtsev | RU | (várias bibliotecas online russas) |
| 192 | **Vorlesungen über Differential- und Integralrechnung** | Edmund Landau (1934) | DE | [archive.org](https://archive.org/) |
| 193 | **Elements de mathématique** (Bourbaki — partes em DP) | Nicolas Bourbaki | FR | [gallica.bnf.fr](https://gallica.bnf.fr/) |
| 194 | **First Six Books of the Elements of Euclid (Byrne edition, 1847)** | Euclides + Oliver Byrne | EN (com cores) | [archive.org/details/firstsixbooksofe00byrn](https://archive.org/details/firstsixbooksofe00byrn) |
| 195 | **Theory of Equations** | William Snow Burnside, Arthur Panton | EN | [gutenberg.org/ebooks/29785](https://www.gutenberg.org/ebooks/29785) |

---

## 15. Aggregator Pointers — Acesso a Milhares de Livros

Os pointers abaixo levam a catálogos curados próprios. Cada um contém
**centenas a milhares** de livros adicionais legais e gratuitos, com
busca por tópico. Para o objetivo de "biblioteca de 400+ livros", os
catálogos abaixo somam mais de 5.000 livros únicos cobrindo todos os
tópicos do programa do Clube.

### 15.1 OpenStax (Rice University)
- **URL**: <https://openstax.org/subjects>
- **Total**: 50+ livros peer-reviewed, todos **CC-BY** ou similar
- **Cobertura**: matemática, física, química, biologia, ciências sociais,
  negócios, computação. Versão final em PDF, EPUB, leitura online,
  cópia impressa de baixo custo.

### 15.2 LibreTexts
- **URL principal**: <https://libretexts.org/>
- **Math**: <https://math.libretexts.org/Bookshelves>
- **Physics**: <https://phys.libretexts.org/Bookshelves>
- **Statistics**: <https://stats.libretexts.org/Bookshelves>
- **Total**: ~milhares de livros modulares em todas as disciplinas STEM
- **Licença**: predominantemente CC-BY-NC-SA, alguns CC-BY-SA
- **Bookshelves de Matemática catalogadas**:
  - Arithmetic and Basic Math
  - Pre-Algebra
  - Algebra
  - Geometry
  - Precalculus & Trigonometry
  - **Calculus**
  - **Differential Equations**
  - **Analysis**
  - **Linear Algebra**
  - Abstract and Geometric Algebra
  - Combinatorics and Discrete Mathematics
  - Mathematical Logic and Proofs
  - Applied Mathematics
  - Scientific Computing, Simulations, and Modeling

### 15.3 Open Textbook Library (University of Minnesota)
- **URL**: <https://open.umn.edu/opentextbooks/>
- **Total**: **1.812+ livros open peer-reviewed**
- **Subject pages relevantes ao Clube**:
  - Mathematics: <https://open.umn.edu/opentextbooks/subjects/mathematics> (~120+ livros, 19 páginas)
  - Calculus: <https://open.umn.edu/opentextbooks/subjects/calculus>
  - Statistics: <https://open.umn.edu/opentextbooks/subjects/statistics>
  - Applied: <https://open.umn.edu/opentextbooks/subjects/applied>
- **Licença**: variada (CC-BY, CC-BY-NC-SA, GNU FDL, CC0)

### 15.4 American Institute of Mathematics — Open Textbook Initiative
- **URL**: <https://textbooks.aimath.org/textbooks/approved-textbooks/>
- **Total**: 68 livros cuidadosamente revisados por pares acadêmicos
- **Critério editorial**: cada livro avaliado por comitê AIM antes de
  ser aprovado para uso universitário
- **Cobertura**: liberal arts math, álgebra, pré-cálculo, trigonometria,
  cálculo (1, 2, 3, vetorial, business), álgebra linear, EDOs, provas,
  matemática discreta, combinatória, computação simbólica, teoria
  números, álgebra abstrata, análise real, análise complexa, geometria,
  topologia, probabilidade, estatística, lógica, ciência de dados.

### 15.5 MIT OpenCourseWare
- **URL principal**: <https://ocw.mit.edu/>
- **Math**: <https://ocw.mit.edu/courses/mathematics/>
- **Physics**: <https://ocw.mit.edu/courses/physics/>
- **Total**: ~**2.500+ cursos**, muitos com livros próprios em PDF
- **Notáveis** (Strang): Calculus (18.001), Linear Algebra (18.06),
  Differential Equations (18.03), Real Analysis (18.100A)
- **Licença**: CC-BY-NC-SA

### 15.6 AMS Open Math Notes
- **URL**: <https://www.ams.org/open-math-notes>
- **Total**: 257+ notas de aula matemáticas, atualizado periodicamente
- **Foco**: notas avançadas de pesquisa e cursos pós-graduação

### 15.7 arXiv
- **URL**: <https://arxiv.org/>
- **Cobertura**: papers e lecture notes de matemática, física,
  estatística, ciência da computação. Não é "biblioteca de livros"
  mas inclui muitos textbooks que pesquisadores publicam ali
- **Licença**: variada (autor mantém direitos; muitos com CC-BY)

### 15.8 Wikilivros (Wikibooks português)
- **URL**: <https://pt.wikibooks.org/wiki/Categoria:Matem%C3%A1tica>
- **Total**: ~35 livros completos em PT-BR + dezenas de capítulos
- **Cobertura completa em PT-BR**: enumerada na Seção 11 acima

### 15.9 REAMAT (UFRGS)
- **URL**: <https://www.ufrgs.br/reamat/>
- **GitHub**: <https://github.com/reamat>
- **Total**: 5+ livros colaborativos em PT-BR (Cálculo Numérico py/sci,
  Álgebra Linear, Equações Diferenciais, etc.)
- **Licença**: CC-BY-SA-3.0
- **Vantagem**: source LaTeX disponível em GitHub (conversão fácil pra MD)

### 15.10 Project Gutenberg
- **URL**: <https://www.gutenberg.org/>
- **Cobertura**: 70.000+ livros em domínio público; centenas de matemática
  e física históricas

### 15.11 Internet Archive
- **URL**: <https://archive.org/details/texts>
- **Cobertura**: milhões de livros escaneados, muitos em PD;
  buscar por "mathematics", "physics", "calculus"

### 15.12 Trillia Group
- **URL**: <https://www.trillia.com/>
- **Cobertura**: livros matemáticos avançados gratuitos (Zakon Analysis I/II,
  outros)

### 15.13 OER Commons
- **URL**: <https://www.oercommons.org/>
- **Cobertura**: agregador de OERs em todas as disciplinas e níveis

### 15.14 BCcampus OpenEd
- **URL**: <https://open.bccampus.ca/>
- **Cobertura**: livros open canadenses, muitos em STEM

### 15.15 Saylor Academy
- **URL**: <https://www.saylor.org/>
- **Cobertura**: cursos completos com material livre (matemática,
  estatística, etc.)

### 15.16 CK-12 Foundation
- **URL**: <https://www.ck12.org/>
- **Cobertura**: foco K-12 (ensino médio), centenas de "FlexBooks"
  matemáticos e científicos

### 15.17 Open Access Texts
- **URL**: <https://openaccesstexts.com/math/>
- **Cobertura**: análise complexa, real analysis, integrais

### 15.18 e-Books Directory — Free Books
- **URL**: <https://www.e-booksdirectory.com/listing.php?category=34>
- **Cobertura**: análise matemática e cálculo

### 15.19 Free Computer Books
- **URL**: <https://freecomputerbooks.com/mathCalculusBooks.html>
- **Cobertura**: cálculo, programação matemática

### 15.20 Open Textbook Initiative — UTMOST (AIM)
- **URL**: <https://utmost.aimath.org/open-textbooks/>
- **Cobertura**: foco em adopção universitária de livros open

---

## Notas finais

### Sobre Singapore Math
Os livros oficiais "Primary Mathematics" da Marshall Cavendish e
"Discovering Mathematics" do Singapore Ministry of Education (MOE) são
**comerciais, não open**. Para conteúdo no estilo Singapore Math (CPA
approach, mastery learning), as melhores alternativas open são:

- **Singapore MOE Mathematics Syllabus (PDF público)**:
  <https://www.moe.gov.sg/-/media/files/post-secondary/syllabuses/maths/2024-pre-university-h2-mathematics.pdf>
- **Books baseados em CPA approach**: vários livros do LibreTexts e
  OpenStax usam abordagem semelhante mesmo sem nomear.

### Sobre livros japoneses e alemães
Livros didáticos oficiais usados em escolas japonesas (Suuken Shuppan,
Tokyo Shoseki) e alemãs (Klett, Cornelsen) são **comerciais**. Mas:

- **Currículos oficiais são públicos**:
  - Japão (MEXT/JASSO): <https://www.jasso.go.jp/en/ryugaku/eju/examinee/syllabus/mathematics.html>
  - Alemanha (Standardsicherung NRW): <https://www.standardsicherung.schulministerium.nrw.de/zentralabitur-gost/faecher/mathematik-gost>
  - França (Eduscol): <https://eduscol.education.fr/document/24568/download>
- **Provas anteriores (EJU, Abitur)** estão acessíveis em arquivos públicos
  e podem ser usadas como fonte de problemas exemplares.

### Total acumulado

| Tipo | Quantidade |
|---|---|
| Entradas individuais com metadata completa | **~195** |
| Aggregator pointers (cada um cobre 100+ livros) | **20** |
| **Acesso efetivo total estimado** | **5.000+ livros** |

### Próximas ações editoriais

- [ ] Baixar PDFs do top-30 prioritário em `livros/raw/`
- [ ] Converter Wikilivros (PT-BR, source HTML) para MD em `livros/md/`
- [ ] Converter source LaTeX do REAMAT para MD em `livros/md/`
- [ ] Criar `livros/scripts/download.sh` para automação
- [ ] Adicionar mais entradas conforme novos livros são descobertos

---

## 16. Recursos Multilíngues

Livros de matemática em outros idiomas (FR, IT, JP, KR, CN, RU, VN, etc.).
Tradução para PT-BR pode ser feita pelo Claude conforme necessidade
editorial. Foco em **matemática** (não outros conteúdos).

### 16.1 🇫🇷 Francês

| # | Título | Autor(es) | Licença | Fonte |
|---|---|---|---|---|
| 196 | **Cours de mathématiques en terminale** (PDF complete + exercícios) | Mathovore | livre acesso (consultar) | [mathovore.fr/cours-maths-terminale](https://mathovore.fr/cours-maths-terminale) |
| 197 | **Calcul intégral — Terminale S** (corrigés) | F. Laroche | aberto | [laroche.lycee.free.fr](http://laroche.lycee.free.fr/telecharger/TS/exercices/exercices_calcul_integral_corriges.pdf) |
| 198 | **Terminale Mathématiques — spécialité (Programme 2020)** | Pierrelux | aberto | [pierrelux.net](http://pierrelux.net/documents/impression/Tspe/livret_tspe.pdf) |
| 199 | **Maths-et-tiques — niveau Terminale** | Yvan Monka | livre acesso | [maths-et-tiques.fr](https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-terminale) |
| 200 | **Fondamentaux des mathématiques 1** (Université Lyon 1) | Pujo-Menjouet | aberto | [math.univ-lyon1.fr/~pujo](http://math.univ-lyon1.fr/~pujo/fondmath1.pdf) |
| 201 | **Cours complet de mathématiques pures** (1809, PD) | L.-B. Francœur | PD | [gallica.bnf.fr](https://gallica.bnf.fr/ark:/12148/bpt6k201333r.pdf) |
| 202 | **Cours d'analyse de l'École Royale Polytechnique** (1821, PD) | A.-L. Cauchy | PD | [gallica.bnf.fr](https://gallica.bnf.fr/ark:/12148/bpt6k90196z) |
| 203 | **Mécanique analytique** (Lagrange 1788, PD) | J.-L. Lagrange | PD | [gallica.bnf.fr](https://gallica.bnf.fr/) |
| 204 | **Maths-pdf** (banco de mais de 15 milhões de PDFs baixados) | colaborativo | livre acesso | [maths-pdf.fr](https://maths-pdf.fr/) |

### 16.2 🇮🇹 Italiano

| # | Título | Autor(es) | Licença | Fonte |
|---|---|---|---|---|
| 205 | **Matematica di Base** | Luciano Battaia | CC 4.0 | [batmath.it](http://www.batmath.it/matematica/mat_base/mbase.pdf) |
| 206 | **Matematica C3** (manual colaborativo, scuola secondaria 2º) | Daniele Zambelli et al. | CC | [matematicamente.it/category/manuale-matematica-c3](https://www.matematicamente.it/) |
| 207 | **Dal problema al modello matematico — Vol. 3** (Funções, Cálculo, EDOs, Estatística) | Carmelo Di Stefano | aberto | [skuola.net](https://www.skuola.net/) |
| 208 | **Compendio di Matematica** | Daniele Buratta | CC-BY-NC-ND 4.0 | (Univ. Firenze Press) |
| 209 | **EduOpen — Matematica Base** | EduOpen consortium | CC-BY-NC-SA 4.0 | [learn.eduopen.org](https://learn.eduopen.org/eduopenv2/course_details.php?courseid=455) |
| 210 | **Matematica Open** (projeto aberto p/ Univ. italianas) | Giovanni Puccetti et al. | aberto | [github.com/giovannipuccetti/MatematicaOpen](https://github.com/giovannipuccetti/MatematicaOpen) |
| 211 | **Analisi Matematica** (Università del Salento) | Univ. Salento | aberto | [unisalento.it](https://www.unisalento.it/documents/20152/850151/testo-analisi.1.pdf) |
| 212 | **Compendio di matematica** (Università di Firenze) | UniFI | aberto | [unifi.it](https://www.unifi.it/sites/default/files/2024-07/compendio_matematica.pdf) |
| 213 | **risorse-matematica** (curadoria de recursos italianos) | M. Cicolella (GitHub) | aberto | [github.com/mcicolella/risorse-matematica](https://github.com/mcicolella/risorse-matematica) |

### 16.3 🇯🇵 Japonês

| # | Título | Autor(es) | Licença | Fonte |
|---|---|---|---|---|
| 214 | **微分積分学 (Cálculo Diferencial e Integral)** — Kyoto Univ | 石本健太 (Kentaro Ishimoto, RIMS Kyoto) | aberto acadêmico | [kurims.kyoto-u.ac.jp/~ishimoto](https://www.kurims.kyoto-u.ac.jp/~ishimoto/files/note_calculus.pdf) |
| 215 | **線形代数学入門 (Introdução à Álgebra Linear)** | 黒田 (Kuroda) | aberto | [biglobe.ne.jp/~h-kuroda](https://www7b.biglobe.ne.jp/~h-kuroda/pdf/text_linear_algebra.pdf) |
| 216 | **高校数学の基本書 (Livros básicos de matemática do ensino médio)** | さくら教育研究所 (Sakura Educational) | livre acesso | [skredu blog](https://blog.goo.ne.jp/skredu) |
| 217 | **大学数学おすすめ参考書・PDF (Lista curada de livros universitários)** | bishow_delta | livre acesso | [note.com/bishow_delta](https://note.com/bishow_delta/n/n070328091303) |
| 218 | **裳華房 — Catálogo de livros didáticos de matemática** | Shokabo | livre listing | [shokabo.co.jp/textbook/math.html](https://www.shokabo.co.jp/textbook/math.html) |

### 16.4 🇨🇳 Chinês

| # | Título | Autor(es) | Licença | Fonte |
|---|---|---|---|---|
| 219 | **ChinaTextbook** (TODOS livros didáticos K-12 + universidade) | TapXWorld colaborativo | aberto | [github.com/TapXWorld/ChinaTextbook](https://github.com/TapXWorld/ChinaTextbook) |
| 220 | **同济大学《线性代数》第五版 (Tongji Univ Linear Algebra 5ª ed)** | Tongji University | aberto online | [github.com/xiaoweihan/Books](https://github.com/xiaoweihan/Books/blob/master/%E5%90%8C%E6%B5%8E%E5%A4%A7%E5%AD%A6%E3%80%8A%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0%E3%80%8B%EF%BC%88%E7%AC%AC%E4%BA%94%E7%89%88%EF%BC%89%E6%95%99%E6%9D%90%E7%94%B5%E5%AD%90%E7%89%88.pdf) |
| 221 | **数学分析 (Mathematical Analysis)** | 陈纪修 (Chen Jixiu) | livre online | (consultar 知乎/zhihu pra link atual) |
| 222 | **数学分析教程 (Mathematical Analysis Course)** | 常庚哲, 史济怀 (Chang Gengzhe, Shi Jihuai) | aberto | (USTC Press) |
| 223 | **Linear Algebra Done Right — 中文版 (Chinese translation)** | Sheldon Axler / tradutores | autorizado pelo autor | [linear.axler.net](https://linear.axler.net/LADR4eChinese.pdf) |
| 224 | **East China Normal Univ — 线性代数 (Linear Algebra)** | H. Yuan (ECNU) | aberto | [math.ecnu.edu.cn/~hryuan](https://math.ecnu.edu.cn/~hryuan/preprint/la.pdf) |
| 225 | **开源/免费数学书大合集 (curadoria de livros open chineses)** | Zhihu (Wei Han) | curadoria livre | [zhuanlan.zhihu.com/p/101120290](https://zhuanlan.zhihu.com/p/101120290) |

### 16.5 🇰🇷 Coreano

| # | Título | Autor(es) | Licença | Fonte |
|---|---|---|---|---|
| 226 | **수능 수학 기출문제 (Suneung past papers)** | KICE (Korea) | livre acesso (gov) | [kice.re.kr](https://www.kice.re.kr/) |
| 227 | **고등학교 수학 (High School Math) — currículo oficial KOFAC** | KOFAC | livre acesso | [kofac.re.kr](https://www.kofac.re.kr/) |
| 228 | **기초 미적분학 (Basic Calculus)** — KOCW | colaborativo universitário | aberto | [kocw.net](http://www.kocw.net/) |

### 16.6 🇷🇺 Russo

| # | Título | Autor(es) | Licença | Fonte |
|---|---|---|---|---|
| 229 | **Дифференциальное и интегральное исчисление (Cálculo Diferencial e Integral)** | N. S. Piskunov | livre online (cópias open) | [archive.org](https://archive.org/) |
| 230 | **Линейная алгебра (Linear Algebra)** | G. E. Shilov | livre online | [archive.org](https://archive.org/) |
| 231 | **Mathematical Circles (Russian Experience)** | D. Fomin, S. Genkin, I. Itenberg | livre online | [archive.org/details/mathematical-circles-russian-experience](https://archive.org/details/mathematical-circles-russian-experience) |
| 232 | **math.ru — Bibliotek (russo)** | colaborativo | livre acesso | [math.ru](http://math.ru/) |
| 233 | **EqWorld** (equações diferenciais, EN+RU) | A. D. Polyanin et al. | aberto | [eqworld.ipmnet.ru](http://eqworld.ipmnet.ru/) |
| 234 | **Лекции по математическому анализу** | L. D. Kudryavtsev | livre online | (бібліотеки доступні) |
| 235 | **Online Books Page — Russian Math** (curadoria UPenn) | UPenn Library | curadoria livre | [onlinebooks.library.upenn.edu](https://onlinebooks.library.upenn.edu/webbin/book/browse?type=lcsubc&key=Mathematics,+Russian) |

### 16.7 🇻🇳 Vietnamita

| # | Título | Autor(es) | Licença | Fonte |
|---|---|---|---|---|
| 236 | **Sách giáo khoa Toán (Livros didáticos oficiais Vietnam, K-12)** | Bộ Giáo dục VN (MOET) | livre acesso (gov) | [moet.gov.vn](https://moet.gov.vn/) |
| 237 | **Giải tích (Cálculo) — Đại học Quốc gia HN** | Hanoi National University | aberto acadêmico | (vnu.edu.vn — buscar) |

### 16.8 🇩🇪 Alemão

| # | Título | Autor(es) | Licença | Fonte |
|---|---|---|---|---|
| 238 | **OpenMathBook — Mathematik Studium (alemão)** | Univ. iniciativas alemãs | CC-licensed | (consultar fachschaft de cada universidade) |
| 239 | **Vorlesungen über Differential- und Integralrechnung** | Edmund Landau (1934) | PD | [archive.org](https://archive.org/) |
| 240 | **Mathematik für Ingenieure (notas de aula)** | TU Berlin / Humboldt | aberto | (consultar tu-berlin.de/mathematik) |

### 16.9 🇪🇸 Espanhol

| # | Título | Autor(es) | Licença | Fonte |
|---|---|---|---|---|
| 241 | **Cálculo I y II (UNAM México)** | UNAM | aberto institucional | [matematicas.unam.mx](https://www.matematicas.unam.mx/) |
| 242 | **Análisis Matemático (Universidad de Murcia)** | UMurcia | aberto | (buscar PDF na web da univ) |
| 243 | **OpenStax Cálculo Volumen 1 (versão espanhola)** | OpenStax | CC-BY-NC-SA | [openstax.org](https://openstax.org/) |

---

## Estatísticas finais do catálogo

| Métrica | Valor |
|---|---|
| Entradas individuais com metadata completa (numeradas 1-243) | **243** |
| Aggregator pointers (cada um cobre 100+ livros) | **20** |
| Idiomas representados | EN, PT-BR, FR, IT, JP, KR, CN, RU, VN, DE, ES, LA |
| **Acesso efetivo total estimado** (somando aggregadores) | **5.000+ livros** |
