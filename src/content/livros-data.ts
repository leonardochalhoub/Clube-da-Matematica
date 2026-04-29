/**
 * Catálogo curado de livros públicos legais para o Clube da Matemática.
 *
 * Subset estruturado do `livros/CATALOG.md` (243 livros + 20 agregadores).
 * Todos os livros aqui têm:
 *   1. Licença aberta (CC, GFDL, CC0, domínio público) OU disponibilização
 *      gratuita oficial pelos autores ou pela editora.
 *   2. URL ativa em 2026-04-29.
 *   3. Conteúdo relevante para o programa do Clube (ensino médio +
 *      graduação inicial em engenharia).
 *
 * REGRA EDITORIAL: nunca traduzir o título do livro. Mantenha o título
 * original no idioma do autor + ano de publicação (ou edição mais recente).
 */

export type Idioma =
  | 'PT-BR'
  | 'EN'
  | 'IT'
  | 'FR'
  | 'JP'
  | 'KR'
  | 'CN'
  | 'RU'
  | 'DE'
  | 'ES'
  | 'VN'
  | 'LA'

export type CategoriaLivro =
  | 'top-20'
  | 'pre-calculo'
  | 'calculo'
  | 'algebra-linear'
  | 'edo-edp'
  | 'analise'
  | 'probabilidade'
  | 'metodos-numericos'
  | 'logica-prova'
  | 'fisica'
  | 'pt-br'
  | 'ml-cd'
  | 'classicos'
  | 'multilingue'

export interface Livro {
  /** Título no idioma original — não traduzir. */
  titulo: string
  autor: string
  /** Ano de publicação (ou edição mais recente disponível). */
  ano: string
  idioma: Idioma
  licenca: string
  url: string
  notas?: string
}

export const TOP_20: Livro[] = [
  {
    titulo: 'Active Calculus',
    autor: 'Matt Boelkins (Grand Valley State Univ.)',
    ano: '2024 (ed. 2.0)',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://activecalculus.org/single/',
    notas: 'Pedagogia Bruner explícita, exercícios ativos. Escolha #1 para Cálculo I/II/III num programa estilo Singapura/Alemanha.',
  },
  {
    titulo: 'Calculus',
    autor: 'Gilbert Strang (MIT)',
    ano: '1991, reimpressão MIT OCW 2023',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://ocw.mit.edu/courses/res-18-001-calculus-fall-2023/',
    notas: 'Texto clássico do MIT. Cobre Math III japonês com folga.',
  },
  {
    titulo: 'Cálculo (Volume 1, 2, 3)',
    autor: 'Wikilivros — colaborativo',
    ano: '2008–2024',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://pt.wikibooks.org/wiki/C%C3%A1lculo_(Volume_1)',
    notas: 'A versão brasileira mais completa, source HTML.',
  },
  {
    titulo: 'Linear Algebra Done Right',
    autor: 'Sheldon Axler',
    ano: '2024 (4th ed)',
    idioma: 'EN',
    licenca: 'CC-BY-NC',
    url: 'https://linear.axler.net/',
    notas: 'Abordagem moderna sem determinantes-first. Cobre Lineare Algebra do LK alemão.',
  },
  {
    titulo: 'OpenIntro Statistics',
    autor: 'David Diez, Mine Çetinkaya-Rundel, Christopher Barr',
    ano: '2019 (4th ed)',
    idioma: 'EN',
    licenca: 'CC-BY-SA',
    url: 'https://www.openintro.org/book/os/',
    notas: 'Estatística inferencial clara, com vídeos e exercícios. Cobre Stochastik LK + Math B JP.',
  },
  {
    titulo: 'APEX Calculus',
    autor: 'Gregory Hartman, Brian Heinold, Troy Siemers, Dimplekumar Chalishajar (VMI)',
    ano: '2024 (versão 5)',
    idioma: 'EN',
    licenca: 'CC-BY-NC',
    url: 'https://www.apexcalculus.com/',
    notas: 'Mais formal que Active Calculus; estilo livro-texto tradicional.',
  },
  {
    titulo: 'A First Course in Linear Algebra',
    autor: 'Robert A. Beezer',
    ano: '2022',
    idioma: 'EN',
    licenca: 'GFDL',
    url: 'http://linear.ups.edu/',
    notas: 'Demonstrações detalhadas, source LaTeX no GitHub.',
  },
  {
    titulo: 'Notes on Diffy Qs: Differential Equations for Engineers',
    autor: 'Jiří Lebl',
    ano: '2024 (versão 6.6)',
    idioma: 'EN',
    licenca: 'CC-BY-SA',
    url: 'https://www.jirka.org/diffyqs/',
    notas: 'EDOs e EDPs introdutórias, extremamente claro.',
  },
  {
    titulo: 'Basic Analysis: Introduction to Real Analysis (Vol. I & II)',
    autor: 'Jiří Lebl',
    ano: '2024 (versão 6.0)',
    idioma: 'EN',
    licenca: 'CC-BY-SA',
    url: 'https://www.jirka.org/ra/',
    notas: 'Ponte EM → Análise universitária.',
  },
  {
    titulo: 'Cálculo Numérico (Python)',
    autor: 'REAMAT — UFRGS (Pedro H. de A. Konzen et al.)',
    ano: '2024',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://www.ufrgs.br/reamat/CalculoNumerico/livro-py/main.html',
    notas: 'Métodos numéricos com Python. Source LaTeX no GitHub. Já é referência viva pro Clube.',
  },
  {
    titulo: 'Introductory Statistics',
    autor: 'Barbara Illowsky, Susan Dean (OpenStax)',
    ano: '2022 (2nd ed)',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://openstax.org/details/books/statistics',
    notas: 'Aplicações práticas e exemplos do dia a dia.',
  },
  {
    titulo: 'Book of Proof',
    autor: 'Richard Hammack',
    ano: '2018 (3rd ed)',
    idioma: 'EN',
    licenca: 'livre (autor)',
    url: 'https://richardhammack.github.io/BookOfProof/',
    notas: 'Como pensar em prova. Pré-requisito para análise universitária.',
  },
  {
    titulo: 'Calculus (Volume 1, 2, 3)',
    autor: 'OpenStax — Edwin Herman, Gilbert Strang et al.',
    ano: '2016',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://openstax.org/details/books/calculus-volume-1',
    notas: 'Alternativa institucional ao Strang/Active. Vídeos e exercícios próprios.',
  },
  {
    titulo: 'Matematica di Base',
    autor: 'Luciano Battaia',
    ano: '2020',
    idioma: 'IT',
    licenca: 'CC 4.0',
    url: 'http://www.batmath.it/matematica/mat_base/mbase.pdf',
    notas: 'Compêndio italiano sólido para base universitária.',
  },
  {
    titulo: 'Mathematical Analysis I',
    autor: 'Elias Zakon',
    ano: '2004',
    idioma: 'EN',
    licenca: 'livre (Trillia Group)',
    url: 'http://www.trillia.com/zakon-analysisI.html',
    notas: 'Análise rigorosa via Trillia. Acompanha Math III avançado.',
  },
  {
    titulo: 'University Physics (Volume 1, 2, 3)',
    autor: 'OpenStax — Samuel Ling, Jeff Sanny, William Moebs',
    ano: '2016',
    idioma: 'EN',
    licenca: 'CC-BY',
    url: 'https://openstax.org/details/books/university-physics-volume-1',
    notas: 'Física calculus-based completa.',
  },
  {
    titulo: '微分積分学',
    autor: '石本健太 (Kenta Ishimoto, Kyoto Univ.)',
    ano: '2023',
    idioma: 'JP',
    licenca: 'aberto',
    url: 'https://www.kurims.kyoto-u.ac.jp/~ishimoto/files/note_calculus.pdf',
    notas: 'Notas de aula da Universidade de Kyoto. Math III avançado.',
  },
  {
    titulo: "Cours d'analyse de l'École royale polytechnique",
    autor: 'Augustin-Louis Cauchy',
    ano: '1821',
    idioma: 'FR',
    licenca: 'PD',
    url: 'https://gallica.bnf.fr/ark:/12148/bpt6k90196z',
    notas: 'Domínio público. Origem histórica do rigor moderno em Cálculo.',
  },
  {
    titulo: 'ChinaTextbook',
    autor: 'TapXWorld (colaborativo)',
    ano: '2024 (vivo)',
    idioma: 'CN',
    licenca: 'aberto',
    url: 'https://github.com/TapXWorld/ChinaTextbook',
    notas: 'Repositório com livros didáticos chineses K-12 e universidade.',
  },
  {
    titulo: 'Mathematics for Machine Learning',
    autor: 'Marc Peter Deisenroth, A. Aldo Faisal, Cheng Soon Ong',
    ano: '2020',
    idioma: 'EN',
    licenca: 'gratuito (Cambridge UP)',
    url: 'https://mml-book.com/',
    notas: 'Ponte pré-cálculo + álgebra linear + cálculo + probabilidade para ML.',
  },
]

export const PRE_CALCULO: Livro[] = [
  {
    titulo: 'College Algebra',
    autor: 'Jay Abramson et al. (OpenStax)',
    ano: '2022 (2nd ed)',
    idioma: 'EN',
    licenca: 'CC-BY',
    url: 'https://openstax.org/details/books/college-algebra-2e',
  },
  {
    titulo: 'Algebra and Trigonometry',
    autor: 'Jay Abramson et al. (OpenStax)',
    ano: '2022 (2nd ed)',
    idioma: 'EN',
    licenca: 'CC-BY',
    url: 'https://openstax.org/details/books/algebra-and-trigonometry-2e',
  },
  {
    titulo: 'Precalculus',
    autor: 'Jay Abramson et al. (OpenStax)',
    ano: '2022 (2nd ed)',
    idioma: 'EN',
    licenca: 'CC-BY',
    url: 'https://openstax.org/details/books/precalculus-2e',
  },
  {
    titulo: 'Precalculus / College Algebra / Trigonometry',
    autor: 'Carl Stitz, Jeff Zeager',
    ano: '2013 (versão 3)',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://www.stitz-zeager.com/',
    notas: 'Excelente em inequações modulares e funções de uma variável.',
  },
  {
    titulo: 'College Trigonometry',
    autor: 'Carl Stitz, Jeff Zeager',
    ano: '2013',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://textbooks.aimath.org/textbooks/approved-textbooks/college-trigonometry/',
  },
  {
    titulo: 'Modeling, Functions, and Graphs',
    autor: 'Katherine Yoshiwara',
    ano: '2020',
    idioma: 'EN',
    licenca: 'aberto',
    url: 'https://textbooks.aimath.org/textbooks/approved-textbooks/yoshiwara/',
  },
  {
    titulo: 'ORCCA: Open Resources for Community College Algebra',
    autor: 'Portland Community College',
    ano: '2024',
    idioma: 'EN',
    licenca: 'CC-BY-SA',
    url: 'https://textbooks.aimath.org/textbooks/approved-textbooks/orcca/',
  },
  {
    titulo: 'Geometria e Trigonometria',
    autor: 'Wikilivros',
    ano: 'vivo',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://pt.wikibooks.org/wiki/Geometria_e_Trigonometria',
  },
  {
    titulo: 'Matemática elementar',
    autor: 'Wikilivros',
    ano: 'vivo',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://pt.wikibooks.org/wiki/Matem%C3%A1tica_elementar',
  },
  {
    titulo: 'Matemática essencial',
    autor: 'Wikilivros',
    ano: 'vivo',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://pt.wikibooks.org/wiki/Matem%C3%A1tica_essencial',
  },
]

export const CALCULO: Livro[] = [
  {
    titulo: 'Active Calculus',
    autor: 'Matt Boelkins',
    ano: '2024 (ed. 2.0)',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://activecalculus.org/single/',
  },
  {
    titulo: 'Calculus (Volume 1)',
    autor: 'OpenStax',
    ano: '2016',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://openstax.org/details/books/calculus-volume-1',
  },
  {
    titulo: 'Calculus (Volume 2)',
    autor: 'OpenStax',
    ano: '2016',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://openstax.org/details/books/calculus-volume-2',
  },
  {
    titulo: 'Calculus (Volume 3)',
    autor: 'OpenStax',
    ano: '2016',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://openstax.org/details/books/calculus-volume-3',
  },
  {
    titulo: 'CLP Calculus (1, 2, 3, 4)',
    autor: 'Joel Feldman, Andrew Rechnitzer, Elyse Yeager (UBC)',
    ano: '2023',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://textbooks.aimath.org/textbooks/approved-textbooks/clp-calculus/',
  },
  {
    titulo: 'APEX Calculus',
    autor: 'Hartman et al.',
    ano: '2024 (v5)',
    idioma: 'EN',
    licenca: 'CC-BY-NC',
    url: 'https://www.apexcalculus.com/',
  },
  {
    titulo: 'Whitman Calculus',
    autor: 'David Guichard',
    ano: '2020',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://www.whitman.edu/mathematics/calculus_online/',
  },
  {
    titulo: 'Cálculo (Volume 1, 2, 3)',
    autor: 'Wikilivros',
    ano: 'vivo',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://pt.wikibooks.org/wiki/C%C3%A1lculo_(Volume_1)',
  },
  {
    titulo: 'Calculus',
    autor: 'Gilbert Strang (MIT)',
    ano: '1991, reimpressão OCW 2023',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://ocw.mit.edu/courses/res-18-001-calculus-fall-2023/',
  },
]

export const ALGEBRA_LINEAR: Livro[] = [
  {
    titulo: 'Linear Algebra Done Right',
    autor: 'Sheldon Axler',
    ano: '2024 (4th ed)',
    idioma: 'EN',
    licenca: 'CC-BY-NC',
    url: 'https://linear.axler.net/',
  },
  {
    titulo: 'A First Course in Linear Algebra',
    autor: 'Robert A. Beezer',
    ano: '2022',
    idioma: 'EN',
    licenca: 'GFDL',
    url: 'http://linear.ups.edu/',
  },
  {
    titulo: 'Linear Algebra',
    autor: 'Jim Hefferon',
    ano: '2020 (4th ed)',
    idioma: 'EN',
    licenca: 'CC-BY-SA',
    url: 'https://hefferon.net/linearalgebra/',
  },
  {
    titulo: 'Álgebra linear',
    autor: 'Wikilivros',
    ano: 'vivo',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://pt.wikibooks.org/wiki/%C3%81lgebra_linear',
  },
  {
    titulo: '18.06 Linear Algebra (MIT OCW)',
    autor: 'Gilbert Strang',
    ano: '2010',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/',
  },
]

export const EDO_EDP: Livro[] = [
  {
    titulo: 'Notes on Diffy Qs',
    autor: 'Jiří Lebl',
    ano: '2024 (v6.6)',
    idioma: 'EN',
    licenca: 'CC-BY-SA',
    url: 'https://www.jirka.org/diffyqs/',
  },
  {
    titulo: 'Elementary Differential Equations',
    autor: 'William F. Trench',
    ano: '2013',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://digitalcommons.trinity.edu/mono/9/',
  },
  {
    titulo: 'Equações Diferenciais Ordinárias',
    autor: 'Wikilivros',
    ano: 'vivo',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://pt.wikibooks.org/wiki/Equa%C3%A7%C3%B5es_diferenciais_ordin%C3%A1rias',
  },
]

export const ANALISE: Livro[] = [
  {
    titulo: 'Basic Analysis: Introduction to Real Analysis (Vol. I)',
    autor: 'Jiří Lebl',
    ano: '2024 (v6.0)',
    idioma: 'EN',
    licenca: 'CC-BY-SA',
    url: 'https://www.jirka.org/ra/',
  },
  {
    titulo: 'Mathematical Analysis I',
    autor: 'Elias Zakon',
    ano: '2004',
    idioma: 'EN',
    licenca: 'livre (Trillia)',
    url: 'http://www.trillia.com/zakon-analysisI.html',
  },
  {
    titulo: 'Análise real',
    autor: 'Wikilivros',
    ano: 'vivo',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://pt.wikibooks.org/wiki/An%C3%A1lise_real',
  },
]

export const PROBABILIDADE: Livro[] = [
  {
    titulo: 'OpenIntro Statistics',
    autor: 'Diez, Çetinkaya-Rundel, Barr',
    ano: '2019 (4th ed)',
    idioma: 'EN',
    licenca: 'CC-BY-SA',
    url: 'https://www.openintro.org/book/os/',
  },
  {
    titulo: 'Introductory Statistics',
    autor: 'Illowsky, Dean (OpenStax)',
    ano: '2022 (2nd ed)',
    idioma: 'EN',
    licenca: 'CC-BY-NC-SA',
    url: 'https://openstax.org/details/books/statistics',
  },
  {
    titulo: 'Introduction to Probability',
    autor: 'Joseph K. Blitzstein, Jessica Hwang',
    ano: '2019 (2nd ed)',
    idioma: 'EN',
    licenca: 'gratuito (autores)',
    url: 'http://probabilitybook.net/',
  },
]

export const METODOS_NUMERICOS: Livro[] = [
  {
    titulo: 'Cálculo Numérico (Python)',
    autor: 'REAMAT — UFRGS',
    ano: '2024',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://www.ufrgs.br/reamat/CalculoNumerico/livro-py/main.html',
  },
  {
    titulo: 'Numerical Analysis',
    autor: 'L. Ridgway Scott et al. (open notes)',
    ano: '2018',
    idioma: 'EN',
    licenca: 'mixed open',
    url: 'https://textbooks.aimath.org/textbooks/approved-textbooks/numerical-analysis/',
  },
]

export const LOGICA_PROVA: Livro[] = [
  {
    titulo: 'Book of Proof',
    autor: 'Richard Hammack',
    ano: '2018 (3rd ed)',
    idioma: 'EN',
    licenca: 'livre (autor)',
    url: 'https://richardhammack.github.io/BookOfProof/',
  },
  {
    titulo: 'How to Think Like a Mathematician',
    autor: 'Kevin Houston',
    ano: '2009 (Cambridge UP, preview livre)',
    idioma: 'EN',
    licenca: 'preview livre',
    url: 'https://www.kevinhouston.net/htm.html',
  },
]

export const FISICA: Livro[] = [
  {
    titulo: 'University Physics (Volume 1, 2, 3)',
    autor: 'OpenStax — Ling, Sanny, Moebs',
    ano: '2016',
    idioma: 'EN',
    licenca: 'CC-BY',
    url: 'https://openstax.org/details/books/university-physics-volume-1',
  },
  {
    titulo: 'The Feynman Lectures on Physics',
    autor: 'Richard Feynman, Robert Leighton, Matthew Sands',
    ano: '1963–1965 (online ed. Caltech, 2013)',
    idioma: 'EN',
    licenca: 'gratuito (Caltech)',
    url: 'https://www.feynmanlectures.caltech.edu/',
  },
]

export const PT_BR: Livro[] = [
  {
    titulo: 'Cálculo (Volume 1, 2, 3)',
    autor: 'Wikilivros',
    ano: 'vivo',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://pt.wikibooks.org/wiki/C%C3%A1lculo_(Volume_1)',
  },
  {
    titulo: 'Cálculo Numérico (Python)',
    autor: 'REAMAT — UFRGS',
    ano: '2024',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://www.ufrgs.br/reamat/CalculoNumerico/livro-py/main.html',
  },
  {
    titulo: 'Geometria e Trigonometria',
    autor: 'Wikilivros',
    ano: 'vivo',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://pt.wikibooks.org/wiki/Geometria_e_Trigonometria',
  },
  {
    titulo: 'Matemática elementar',
    autor: 'Wikilivros',
    ano: 'vivo',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://pt.wikibooks.org/wiki/Matem%C3%A1tica_elementar',
  },
  {
    titulo: 'Matemática essencial',
    autor: 'Wikilivros',
    ano: 'vivo',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://pt.wikibooks.org/wiki/Matem%C3%A1tica_essencial',
  },
  {
    titulo: 'Álgebra linear',
    autor: 'Wikilivros',
    ano: 'vivo',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://pt.wikibooks.org/wiki/%C3%81lgebra_linear',
  },
  {
    titulo: 'Estatística',
    autor: 'Wikilivros',
    ano: 'vivo',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://pt.wikibooks.org/wiki/Estat%C3%ADstica',
  },
  {
    titulo: 'Probabilidade',
    autor: 'Wikilivros',
    ano: 'vivo',
    idioma: 'PT-BR',
    licenca: 'CC-BY-SA',
    url: 'https://pt.wikibooks.org/wiki/Probabilidade',
  },
]

export const CLASSICOS: Livro[] = [
  {
    titulo: "Cours d'analyse de l'École royale polytechnique",
    autor: 'Augustin-Louis Cauchy',
    ano: '1821',
    idioma: 'FR',
    licenca: 'PD',
    url: 'https://gallica.bnf.fr/ark:/12148/bpt6k90196z',
  },
  {
    titulo: "Euclid's Elements (trad. Heath)",
    autor: 'Euclid / trans. Thomas L. Heath',
    ano: 'séc. III a.C., trad. 1908',
    idioma: 'EN',
    licenca: 'PD',
    url: 'https://aleph0.clarku.edu/~djoyce/elements/elements.html',
  },
  {
    titulo: 'Disquisitiones Arithmeticae',
    autor: 'Carl Friedrich Gauss',
    ano: '1801',
    idioma: 'LA',
    licenca: 'PD',
    url: 'https://archive.org/details/disquisitionesa00gausgoog',
  },
]

export const MULTILINGUE: Livro[] = [
  {
    titulo: '微分積分学',
    autor: '石本健太 (Kenta Ishimoto, Kyoto Univ.)',
    ano: '2023',
    idioma: 'JP',
    licenca: 'aberto',
    url: 'https://www.kurims.kyoto-u.ac.jp/~ishimoto/files/note_calculus.pdf',
  },
  {
    titulo: 'Matematica di Base',
    autor: 'Luciano Battaia',
    ano: '2020',
    idioma: 'IT',
    licenca: 'CC 4.0',
    url: 'http://www.batmath.it/matematica/mat_base/mbase.pdf',
  },
  {
    titulo: 'ChinaTextbook',
    autor: 'TapXWorld (colaborativo)',
    ano: '2024 (vivo)',
    idioma: 'CN',
    licenca: 'aberto',
    url: 'https://github.com/TapXWorld/ChinaTextbook',
  },
  {
    titulo: 'Sésamath — Manuel de mathématiques',
    autor: 'Sésamath',
    ano: 'vivo',
    idioma: 'FR',
    licenca: 'CC-BY-SA',
    url: 'https://manuel.sesamath.net/',
  },
  {
    titulo: 'Serlo Mathematik',
    autor: 'Serlo Education e.V.',
    ano: 'vivo',
    idioma: 'DE',
    licenca: 'CC-BY-SA',
    url: 'https://serlo.org/mathe',
  },
]

export const ML_CD: Livro[] = [
  {
    titulo: 'Mathematics for Machine Learning',
    autor: 'Marc P. Deisenroth, A. Aldo Faisal, Cheng Soon Ong',
    ano: '2020',
    idioma: 'EN',
    licenca: 'gratuito (Cambridge UP)',
    url: 'https://mml-book.com/',
  },
  {
    titulo: 'Probabilistic Machine Learning: An Introduction',
    autor: 'Kevin P. Murphy',
    ano: '2022',
    idioma: 'EN',
    licenca: 'gratuito (autor)',
    url: 'https://probml.github.io/pml-book/',
  },
  {
    titulo: 'An Introduction to Statistical Learning',
    autor: 'Gareth James, Daniela Witten, Trevor Hastie, Robert Tibshirani',
    ano: '2023 (2nd ed)',
    idioma: 'EN',
    licenca: 'gratuito (autores)',
    url: 'https://www.statlearning.com/',
  },
]

export interface Secao {
  id: CategoriaLivro
  titulo: string
  descricao: string
  livros: Livro[]
}

export const SECOES: Secao[] = [
  {
    id: 'top-20',
    titulo: 'TOP-20 — comece por aqui',
    descricao:
      'Ranking editorial do conselho do Clube. Critério: cobertura curricular JP/DE/SG (40%), qualidade pedagógica (25%), licença/idioma (15%), adequação ao público brasileiro (10%), material de apoio (10%).',
    livros: TOP_20,
  },
  {
    id: 'pre-calculo',
    titulo: 'Pré-Cálculo, Álgebra, Trigonometria',
    descricao:
      'Fundamentos do Ensino Médio: funções, inequações, trigonometria, modelagem.',
    livros: PRE_CALCULO,
  },
  {
    id: 'calculo',
    titulo: 'Cálculo Diferencial e Integral',
    descricao:
      'Limites, derivadas, integrais, séries — uma e múltiplas variáveis.',
    livros: CALCULO,
  },
  {
    id: 'algebra-linear',
    titulo: 'Álgebra Linear',
    descricao: 'Matrizes, espaços vetoriais, autovalores e autovetores.',
    livros: ALGEBRA_LINEAR,
  },
  {
    id: 'edo-edp',
    titulo: 'Equações Diferenciais (EDOs e EDPs)',
    descricao: 'Modelagem de fenômenos contínuos.',
    livros: EDO_EDP,
  },
  {
    id: 'analise',
    titulo: 'Análise Real e Complexa',
    descricao: 'Rigor universitário sobre limites, sequências e continuidade.',
    livros: ANALISE,
  },
  {
    id: 'probabilidade',
    titulo: 'Probabilidade e Estatística',
    descricao: 'Inferência, distribuições, testes, regressão.',
    livros: PROBABILIDADE,
  },
  {
    id: 'metodos-numericos',
    titulo: 'Métodos Numéricos',
    descricao:
      'Algoritmos que rodam de fato no computador (Python, REAMAT).',
    livros: METODOS_NUMERICOS,
  },
  {
    id: 'logica-prova',
    titulo: 'Lógica e Demonstração',
    descricao:
      'Como ler e escrever provas. Pré-requisito para análise universitária.',
    livros: LOGICA_PROVA,
  },
  {
    id: 'fisica',
    titulo: 'Física (cálculo-baseada)',
    descricao: 'Aplicação imediata da matemática do programa.',
    livros: FISICA,
  },
  {
    id: 'pt-br',
    titulo: 'Recursos em Português Brasileiro',
    descricao: 'Material em PT-BR — Wikilivros, REAMAT, autores brasileiros.',
    livros: PT_BR,
  },
  {
    id: 'ml-cd',
    titulo: 'Machine Learning e Ciência de Dados',
    descricao:
      'Onde a matemática de engenharia encontra a inteligência artificial.',
    livros: ML_CD,
  },
  {
    id: 'classicos',
    titulo: 'Clássicos em Domínio Público',
    descricao: 'Textos históricos — Cauchy, Euclides, Gauss.',
    livros: CLASSICOS,
  },
  {
    id: 'multilingue',
    titulo: 'Recursos Multilíngues',
    descricao:
      'Material em japonês, italiano, francês, alemão, chinês — para alunos que querem ver o mesmo conteúdo de outras tradições.',
    livros: MULTILINGUE,
  },
]
