# Contexto do Projeto: Clube da Matemática

> Este arquivo é injetado como contexto base em TODAS as chamadas a agentes
> (Gemini ou Claude) que produzem conteúdo para o repositório.
> Atualizado: 2026-05-04

## Missão e posicionamento

O Clube da Matemática é um currículo aberto e gratuito de matemática para o Ensino Médio
brasileiro, distribuído como site estático (Next.js 15 + MDX + KaTeX + GitHub Pages).
Cobre **12 trimestres × 10 aulas = 120 lições**, do 1.º ao 3.º ano do EM, mais um
braço de aplicações em finanças quantitativas.

Padrão editorial inspirado em **engenharia mecânica BR + JP + DE + SG**: rigor,
densidade, dezenas de exercícios por aula, progressão crescente de dificuldade,
linguagem precisa sem condescender com o leitor de 15 anos.

**Princípio editorial-mãe**: a peça `content/financas-quantitativas/opcoes/black-scholes.mdx`
é o template canônico. Toda aula nova replica sua DNA estrutural.

## Audiência

- Aluno brasileiro do EM, 15-18 anos, com background heterogêneo
- Estudo solitário em casa (sem professor) — o texto precisa **sustentar** esse estudo
- Equivalências: Math I japonês, Klasse 10 alemã, A-Level britânico
- Convenções adotadas: `0 ∈ ℕ` (BNCC), notação anglo de intervalos `(a,b)` para aberto

## Anatomia obrigatória de uma aula

### 1. Frontmatter YAML

```yaml
---
titulo: "Lição N — Título em PT-BR"
slug: "aula-NN-slug-do-tema"
categoria: "aulas"
subcategoria: "ano-X-trim-Y"
descricao: "Resumo de 1-2 frases que vai pra metadata e SEO."
ordem: NN
publicado: true
tags: ["tema", "ano-X", "trim-Y"]
prerrequisitos: ["aula-MM-tema"]
autores: ["Clube da Matemática"]
atualizadoEm: "AAAA-MM-DD"
usadoEm: ["X.º ano do EM (idade)", "Equiv. Math I japonês", "Equiv. Klasse 10 alemã"]
---
```

REGRAS DURAS:
- **Título sempre "Lição N"**, nunca "Aula N". O slug pode ser `aula-NN-...` (URL convenção).
- Conteúdo só em PT-BR. Termos em inglês podem aparecer entre parênteses como apoio.
- Frontmatter usa **aspas duplas ASCII** (`"`), nunca curly (`"`). YAML não aceita curly.

### 2. EquacaoCanonica de abertura

A equação-mãe da aula em destaque visual:

```mdx
<EquacaoCanonica
  formula="\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}"
  legenda={<>A <strong>hierarquia dos conjuntos numéricos</strong>...</>}
  audioTexto="Os naturais estão contidos nos inteiros, e assim por diante."
/>
```

### 3. DuasPortas com 7 níveis

```mdx
<DuasPortas>
  <Porta nivel="formal" titulo="Definição rigorosa">...</Porta>
  <Porta nivel="5" titulo="Pra criança de 5 anos">...</Porta>
  <Porta nivel="10" titulo="Pra criança de 10 anos">...</Porta>
  <Porta nivel="15" titulo="Pra adolescente de 15 anos">...</Porta>
  <Porta nivel="25" titulo="Pra estudante de engenharia">...</Porta>
  <Porta nivel="40" titulo="Pra profissional sênior">...</Porta>
  <Porta nivel="pratica" titulo="Prática — exemplos com dados reais">...</Porta>
</DuasPortas>
```

Cada Porta deve ter PARÁGRAFOS DE PROSA CONTÍNUA, não bullets soltos. A `nivel="15"`
deve incluir 1-2 parágrafos sobre **onde a aula se encaixa no programa de 12
trimestres** (conexão pedagógica explícita).

Componentes auxiliares dentro das Portas:
- `<Definicao titulo="...">` — definições formais
- `<Teorema titulo="...">` — teoremas com enunciado
- `<Insight>` — observação reveladora (uso comedido, 1-2 por aula)
- `<Cuidado>` — pegadinhas e erros frequentes
- `<Equation explicacao="...">` — equação destacada com legenda

### 4. Seção "## Exemplos resolvidos" (NOVA — A PARTIR DA LIÇÃO 1)

Entre `</DuasPortas>` e `<ListaExercicios>`. **6-10 exemplos** plenamente resolvidos:

```mdx
## Exemplos resolvidos

<Exemplo titulo="Exemplo 1 — descrição curta sem aspas internas" numero="1">

**Problema:** Enunciado.

**Estratégia:** 1-3 parágrafos explicando o caminho ANTES de calcular.

**Resolução:**

1. Passo 1, com **justificativa do POR QUÊ** (não só álgebra).
2. Passo 2, idem.
3. ...

**Verificação:** Substituir o resultado na equação original e checar.

</Exemplo>
```

Os exemplos devem cobrir TODOS os tipos de problema da lista — quem ler só os
exemplos consegue tentar 80% dos exercícios. Quando relevante, incluir
`<VerificarPasso esperado="..." prompt="..." />` para conferência interativa via SymPy.

### 5. ListaExercicios (40-60 exercícios em blocos)

```mdx
<ListaExercicios seed="aula-NN">

### Bloco A — Aplicação direta (NN.1 a NN.20)
<Exercicio numero="NN.1" dificuldade="aplicacao" resposta="$valor$"
  fonte={{ livro: "OpenStax College Algebra 2e", url: "https://openstax.org/books/college-algebra-2e/pages/1-1-real-numbers-algebra-essentials", secao: "§1.1", pagina: 23, exercicio: "ex. 5", licenca: "CC-BY 4.0" }}>
Enunciado em markdown com $LaTeX$ inline.
</Exercicio>

### Bloco B — Compreensão conceitual
### Bloco C — Modelagem aplicada
### Bloco D — Demonstrações
### Bloco E — Desafios (vestibular ENEM/EJU/Putnam)

</ListaExercicios>
```

DUREZAS:
- **PELO MENOS 30%** dos exercícios devem ter `solucao={<>passo-a-passo JSX</>}`
- **PELO MENOS 60%** devem ter `fonte={{...}}` apontando livro open-access
- Dificuldades válidas: `aplicacao`, `compreensao`, `modelagem`, `demonstracao`, `desafio`

### 6. Citações inline com blockquote + deep-link

Quando trechos de livros sustentam a explicação, citar verbatim com link:

```markdown
> "Trecho citado verbatim do livro." — [Stitz-Zeager, *Precalculus*, cap. 1.3, p. 47](https://www.stitz-zeager.com/szprecalculus07042013.pdf#page=47)

```

Use `#page=N` em PDFs quando souber a página. Use anchor `#section-id` em livros HTML.
**NUNCA invente páginas ou citações.** Prefira fontes CC-BY/CC-BY-SA.

### 7. Seção "## Fontes desta aula"

Lista de TODOS os livros que alimentaram a aula:

```markdown
## Fontes desta aula

- [**Precalculus**](https://www.stitz-zeager.com/) — Carl Stitz, Jeff Zeager · 2013, v3 · EN · CC-BY-NC-SA · cap. 1: notação. **Fonte primária.**
- [**College Algebra 2e**](https://openstax.org/details/books/college-algebra-2e) — OpenStax · 2022 · EN · CC-BY · §1.7. **Bloco D.**
```

Se mencionar **Prêmio Nobel**, link obrigatório pra `nobelprize.org`.

## Bibliotecas de referência (open-access para `fonte={{...}}`)

Sempre prefira essas fontes (todas CC-BY, CC-BY-SA ou domínio público):

| Livro | URL | Idioma | Cobertura |
|---|---|---|---|
| OpenStax College Algebra 2e | https://openstax.org/details/books/college-algebra-2e | EN | Álgebra do EM |
| OpenStax Precalculus | https://openstax.org/details/books/precalculus-2e | EN | Pré-cálculo |
| OpenStax Calculus Vol 1 | https://openstax.org/details/books/calculus-volume-1 | EN | Cálculo I |
| Stitz-Zeager Precalculus | https://www.stitz-zeager.com/ | EN | Pré-cálculo, álgebra |
| Active Calculus | https://activecalculus.org/single/ | EN | Cálculo |
| Hammack — Book of Proof | https://richardhammack.github.io/BookOfProof/ | EN | Demonstrações |
| Yoshiwara — Modeling, Functions, Graphs | https://textbooks.aimath.org/textbooks/approved-textbooks/yoshiwara/ | EN | Modelagem |
| Lebl — Basic Analysis | https://www.jirka.org/ra/ | EN | Análise real |
| Cours d'analyse (Cauchy) | https://gallica.bnf.fr/ark:/12148/bpt6k90196z | FR | Histórico |
| Wikilivros Matemática elementar | https://pt.wikibooks.org/wiki/Matem%C3%A1tica_elementar | PT-BR | Fundamentos |
| Elon Lima — Análise Real | https://impa.br/wp-content/uploads/2017/04/Analise_Real_Vol_1-Elon_Lima.pdf | PT-BR | Análise (BR) |

## REGRAS DURAS DE MDX (quebram a build se violadas)

Estes erros foram observados em gerações anteriores. **Nunca** os cometa:

### 1. NÃO use aspas duplas ASCII (`"`) dentro de texto markdown próximo de JSX

```mdx
<!-- ERRADO: MDX 3 confunde com atributo JSX -->
- A interseção é tipo um "cubo-bolinha"!

<!-- CERTO: aspas tipográficas curly -->
- A interseção é tipo um "cubo-bolinha"!
```

Para abrir/fechar citações no corpo do texto, sempre use `"..."` (curly quotes em PT-BR)
ou converta a aspa-pra-um-único-termo em itálico: `*cubo-bolinha*`.

### 2. NÃO aninhe aspas duplas dentro de atributos JSX

```mdx
<!-- ERRADO -->
<Exemplo titulo="Exemplo 3 — definição de "spread" de preço" numero="3">

<!-- CERTO: use curly ou single quotes internas -->
<Exemplo titulo="Exemplo 3 — definição de 'spread' de preço" numero="3">
<Exemplo titulo="Exemplo 3 — definição de 'spread' de preço" numero="3">
```

### 3. NÃO preceda componentes JSX com headings markdown

```mdx
<!-- ERRADO -->
## <ListaExercicios seed="aula-01">

<!-- CERTO: heading só em texto puro -->
<ListaExercicios seed="aula-01">
```

### 4. USE `<Exemplo>` JSX, não `### Exemplo N:` markdown

A seção `## Exemplos resolvidos` é um heading markdown, mas cada exemplo individual
DEVE ser um componente `<Exemplo>` (renderiza com box verde, ícone E):

```mdx
<!-- ERRADO -->
### Exemplo 1: domínio de função
**Problema:** ...

<!-- CERTO -->
<Exemplo titulo="Exemplo 1 — domínio de função" numero="1">
**Problema:** ...
</Exemplo>
```

### 5. Decimais PT-BR com chave dupla escapando a vírgula

```mdx
<!-- ERRADO: KaTeX renderiza errado -->
$0,001$ ou $0.001$

<!-- CERTO: chave dupla isola a vírgula como separador decimal -->
$0{,}001$
```

### 6. JSX em props use fragment vazio

```mdx
<!-- Atributos que recebem JSX como filhos: -->
solucao={<>passo-a-passo em JSX</>}
dica={<>texto curto</>}
legenda={<>HTML rico com <strong>negrito</strong></>}
```

### 7. NÃO desenhe retas numéricas em ASCII com `<-----` ou `---->`

```mdx
<!-- ERRADO: MDX parser le `<-----` como JSX tag opening -->
```
    <-----|-----]----------->
         0     2
```

<!-- CERTO: use seta Unicode -->
```
    ←—————|—————]—————————→
         0     2
```

<!-- AINDA MELHOR: use SVG inline (ver aula-01 original linhas 43-66) -->
```

### 8. Em legendas/SVG inline, expressão LaTeX em backticks

```mdx
<!-- Em texto markdown puro: -->
$\sqrt{2}$

<!-- Dentro de JSX (legendas, bullets HTML): -->
<Eq>{`\\sqrt{2}`}</Eq>
```

## Macros KaTeX disponíveis

- `\R = \mathbb{R}`
- `\e = \mathrm{e}`
- `\eps = \varepsilon`
- (lista completa em `docs/architecture/katex-macros.json`)

## Tom e voz editorial

- Rigor de bacharelado, escrita de professor experiente, narrativa fluida
- Porta nível 5 e 10 devem ser **genuinamente acessíveis** (sem condescender)
- Nunca incluir disclaimers, mencionar IA, ou meta-discurso
- Aulas curtas demais não servem — extensão alvo: **800-1200 linhas de MDX**
- Densidade > brevidade. O leitor estuda em casa, sem professor.

## REGRA CRITICA: PRESERVE exercicios ja curados

Quando uma aula ja existe (passada como referencia), os exercicios e suas
`fonte={{...}}` foram cuidadosamente curados pelo dono. Sua tarefa NAO e
reescrever ou re-numerar exercicios. **MANTENHA EXATAMENTE** os blocos
`<Exercicio>...</Exercicio>` da aula original — copie verbatim. Adicione apenas:

- `solucao={<>...</>}` em exercicios que ainda nao tem (mas mantenha SHORT, max
  1-2 frases; multi-step explanations vao em `<Exemplo>`, nao em `solucao`)
- `fonte={{...}}` em exercicios que ainda nao tem
- Novos exercicios SO se o brief pedir explicitamente

Se o brief diz "adicione exemplos resolvidos e citacoes inline", isso significa:
seccao NOVA `## Exemplos resolvidos` + blockquotes inline NO TEXTO. NAO mexa nos
exercicios alem de complementar fonte/solucao.

## REGRA CRITICA: livros-fonte (`livros/`)

Quando arquivos forem passados via `--book` (ou aparecerem com tag `=== LIVRO-FONTE`
no contexto), eles sao capitulos REAIS de livros CC-BY/CC-BY-SA. Use-os para:

1. **Citacoes verbatim com blockquote**: copie um trecho EXATO do livro-fonte e
   atribua com link deep. Nao parafraseie como se fosse verbatim.
2. **Numero de secao/pagina**: extraia do livro-fonte real, nao invente.
3. **Estrutura conceitual**: alinhe a porta nivel="formal" com a sequencia logica
   do livro (mas em PT-BR).

Se um conceito apareceu na referencia MDX mas tem cobertura mais profunda no
livro-fonte, prefira o livro-fonte para ancorar. Exemplo: a aula original cita
"$\\sqrt{2}$ e irracional (Pitagoras)" — o Hammack Book of Proof tem a
demonstracao formal completa, use-a.

## O que estamos implementando agora (a partir da Lição 1)

Antes, as aulas iam direto da definição teórica para a lista de exercícios — pulavam
a camada de **modelagem do raciocínio**. A partir da Lição 1, toda aula nova deve
incluir:

1. **Seção "## Exemplos resolvidos"** com 6-10 `<Exemplo>` plenamente desenvolvidos:
   - Estratégia narrada antes de calcular
   - Cada passo justificado (POR QUÊ, não só álgebra)
   - Verificação final substituindo o resultado
2. **Citações inline ricas**: 3-5 blockquotes com trechos verbatim de livros + deep-link
3. **`fonte={{...}}` em pelo menos 60%** dos exercícios
4. **`solucao={<>...</>}` em pelo menos 30%** dos exercícios

A Lição 1 (Conjuntos numéricos, intervalos, notação) é a primeira a receber esse
tratamento e serve de referência para as próximas 119 lições.
