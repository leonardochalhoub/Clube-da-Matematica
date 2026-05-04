# Regras Editoriais do Clube da Matemática

**Status:** Norma editorial · **Atualizado:** 2026-04-28

Este documento codifica regras editoriais não-negociáveis que toda
peça de conteúdo do Clube da Matemática deve seguir. Complementa o
padrão estrutural definido pelo template canônico (Black-Scholes —
ver `pattern-content-template` na memória do projeto).

## 1. Toda equação tem 6 portas

Toda peça de conteúdo segue o padrão **Formal + 5/10/15/25/40 + Prática**.
A porta `formal` é a default na abertura. Detalhes em `src/content/schema.ts`
e no template canônico de Black-Scholes em
`content/financas-quantitativas/opcoes/black-scholes.mdx`.

## 2. Toda equação tem explicação abaixo

Em qualquer fórmula apresentada via `<Equation>`, é obrigatória a
prop `explicacao` com prosa em PT-BR explicando o que a equação
significa. Anti-padrão: equação solta sem contextualização.

## 3. Toda equação tem áudio acessível

Em fórmulas-âncora (`<EquacaoCanonica>`) e em equações importantes
dentro do corpo, fornecer prop `audioTexto` com transcrição em
PT-BR para a Web Speech API. Acessibilidade não é opcional.

## 4. **Nobel ganha link oficial sempre**

Sempre que mencionar "Prêmio Nobel" ou "Nobel de Economia" em
qualquer peça, **incluir link para a página oficial em
nobelprize.org**.

URLs canônicas:
- Página índice de uma edição:
  `https://www.nobelprize.org/prizes/<categoria>/<ano>/summary/`
- Lecture de um laureado específico:
  `https://www.nobelprize.org/prizes/<categoria>/<ano>/<sobrenome>/lecture/`
- Banquet speech:
  `https://www.nobelprize.org/prizes/<categoria>/<ano>/<sobrenome>/speech/`

Categorias: `physics`, `chemistry`, `medicine`, `literature`, `peace`,
`economic-sciences`.

**Exemplo (Black-Scholes, 1997):**
- Summary: <https://www.nobelprize.org/prizes/economic-sciences/1997/summary/>
- Scholes lecture: <https://www.nobelprize.org/prizes/economic-sciences/1997/scholes/lecture/>
- Merton lecture: <https://www.nobelprize.org/prizes/economic-sciences/1997/merton/lecture/>

**Em MDX**, usar âncora com `target="_blank"` e `rel="noopener noreferrer"`:

```jsx
<a href="https://www.nobelprize.org/prizes/economic-sciences/1997/summary/"
   target="_blank" rel="noopener noreferrer">
  Nobel de Economia 1997
</a>
```

Ou, em prosa simples, link Markdown:

```md
[Prêmio Nobel em 1997](https://www.nobelprize.org/prizes/economic-sciences/1997/summary/)
```

**Por quê esta regra existe**: Nobel é fato histórico verificável.
Toda menção sem link transforma fato em alegação. O leitor
interessado deve poder, em um clique, chegar à fonte primária — a
lecture do laureado em PDF, o banquet speech, o press release. É
diferencial editorial vs. Khan Academy / Wolfram, que mencionam
sem linkar.

## 5. Livros são o ledger — IA nunca inventa exercício ou exemplo

**Toda** ocorrência de `<Exercicio>` e `<Exemplo>` deve ter um
`fonte={{ livro, url, secao, pagina, exercicio, licenca }}` apontando
para um livro de licença aberta listado em `livros/CATALOG.md`
(Stitz–Zeager, OpenStax, Hammack, Yoshiwara, Active Calculus,
Wikilivros, etc.). A URL deve ir até a página/seção/exercício exato
quando o livro permitir. Provenance is the moat — o aluno deve
poder, em um clique, chegar à fonte primária do problema, conferir
o original e ver as variações.

**Anti-padrão:** exercício "inventado pela IA" sem fonte. A única
exceção é drill puramente mecânico ("calcule $5 + 7$"). Se você
quer um exercício sobre tópico X e não acha fonte aberta — escolha
outro tópico que tenha. Qualidade vs. quantidade: 30 bem-fundados >
60 meio-inventados.

## 6. Aluno clica, nunca digita

O aluno resolve no caderno. O site é apenas para ler e clicar.
Toda interação é click/select/toggle — nunca campo de texto.

- Exercício de resposta única → **múltipla escolha** (`opcoes={[...]}`).
- "Ver solução" / "Ver passo a passo" → botões `<details>`.
- Filtros, locale switcher, áudio → botões/select.

**Anti-padrão:** `<input type="text">` para o aluno digitar
resposta. O componente `<Exercicio>` não renderiza mais input box
mesmo quando `resposta` está presente sem `opcoes` — mas autore MC
de qualquer jeito. Toda novo componente que pedir interação deve
respeitar essa regra.

**Por quê:** input de texto cria fricção (teclado mobile, notação
matemática difícil, falsos negativos por capitalização/espaços) sem
ganho pedagógico — o aluno já escreveu a resposta no papel.

## 7. Acessibilidade total — áudio para tudo

Áudio é obrigatório em equações canônicas (`audioTexto` na
`<EquacaoCanonica>`) e em fórmulas-âncora dentro do corpo. Além
disso, toda lição deve ter um botão "ler página inteira" no topo,
para que pessoas cegas possam consumir o conteúdo via Web Speech
API. A localidade ativa controla a voz (PT-BR, EN-US, etc.). Não é
extra — é parte do produto.

## 8. Atualização

Quando uma regra editorial nova for descoberta ou explicitada,
adicionar como nova seção numerada neste arquivo. Não remover
regras antigas sem registro de quando e por quê.
