# Clube da Matemática

> *"A matemática é a única linguagem em que se pode raciocinar sem ambiguidade sobre o infinito, o aleatório e o invisível."*
> — adaptado de Bertrand Russell

**Open source · gratuito · UI em 11 idiomas (lições traduzidas: TO-DO)**

Curso completo de matemática para o **Ensino Médio brasileiro** — 3 anos lineares, 12 trimestres, 120 lições, do nível conjunto/intervalo até Black-Scholes. Escrito com **rigor de engenharia** (BR + JP + DE + SG), com cada conceito explicado em **7 níveis progressivos** (criança de 5 anos → profissional sênior).

[**Acessar o site →**](https://leonardochalhoub.github.io/Clube-da-Matematica/)

---

## O que está pronto hoje

- ✅ **120 lições** em PT-BR cobrindo o Ensino Médio inteiro (Anos 1-3 × 4 trimestres × 10 lições)
- ✅ **~4.770 exercícios** com fonte (livro · página · licença) — nenhum inventado pela IA
- ✅ **1.800 questões em provas** (12 trim × 10 versões × 15 q)
- ✅ **UI traduzida em 11 idiomas** (botões, navegação, "Ouvir", breadcrumb)
- ✅ **Acessibilidade — leitor de voz em toda página**: cada lição, exemplo e seção tem uma **caixa de áudio "Ouvir"** que narra o conteúdo via Web Speech API nativa do navegador (zero arquivos MP3, voz no idioma selecionado). Ajuda alunos com dislexia, deficiência visual, ou que aprendem melhor por audição.
- ✅ **Build estático** em GitHub Pages — custo R$ 0,00
- ⏳ **Tradução das lições MDX → TO-DO** (por enquanto: PT-BR é a única língua dos corpos; UI já localiza a navegação)
- ⏳ **Provas i18n** — TO-DO (1.800 questões × 10 idiomas)
- ⏳ **Próximos módulos**: Física Ensino Médio, Engenharia introdutória

---

## Em números

| Métrica | Quantidade |
|---|---|
| **Lições** | 120 (3 anos × 4 trimestres × 10 lições) |
| **Portas pedagógicas por lição** | 7 (formal · 5 anos · 10 anos · 15 anos · engenharia · sênior · prática) |
| **Exercícios reais** | ~4.770 (não placeholders) |
| **Provas curadas** | 120 versões (12 trimestres × 10 versões) |
| **Questões em provas** | 1.800 |
| **Idiomas (UI + áudio)** | 11 (português, inglês, espanhol, mandarim, japonês, alemão, francês, italiano, russo, coreano, polonês) |
| **Idiomas (lições MDX)** | 1 (PT-BR) — 10 demais estão na fila TO-DO |
| **Componentes interativos** | 14 (DuasPortas, ListaExercicios, AudioReader, VerificarPasso, etc.) |
| **Linhas de código** | ~30.000 |
| **Custo de hospedagem** | R\$ 0,00 (GitHub Pages) |

---

## Filosofia editorial

### As 7 portas

Cada conceito atravessa 7 portas progressivas. Nenhuma é "a versão fácil" — todas são **rigorosas** no nível adequado.

| Porta | Para quem | Estilo |
|---|---|---|
| **formal** | tabela de referência | definições, fórmulas, propriedades |
| **5** | criança de 5 anos | analogia simples, sem jargão |
| **10** | criança de 10 anos | exemplos do dia a dia |
| **15** | adolescente de 15 anos | conexão com o que já sabe + intuição |
| **25** | estudante de engenharia | demonstrações, conexões cross-domínio |
| **40** | profissional sênior | generalizações, ML, quant finance, Wolfram/SymPy |
| **prática** | quem vai aplicar amanhã | workflow passo-a-passo + casos onde falha |

A premissa: **inteligência não está em "explicar fácil"**. Inteligência está em **adaptar a profundidade** sem perder o rigor.

### Engenharia mecânica BR + JP + DE + SG

Cada lição tem **30-50 exercícios reais** — sem placeholders genéricos. Distribuição:

- **60%** aplicação direta (treino)
- **15%** modelagem (problemas reais)
- **15%** compreensão (mostre que entende, não que decora)
- **10%** desafio + demonstração (rigor matemático)

**25%** dos exercícios trazem `(Resp: X)` inline para autocorreção. Os restantes são para o aluno descobrir — e errar — antes de conferir.

### Lição 1 como template canônico

A [**Lição 1 — Conjuntos e intervalos**](content/aulas/ano-1/trim-1/licao-01-conjuntos-intervalos.mdx) é o **template editorial canônico** do projeto. Toda lição nova é escrita seguindo o padrão dela:

- Equação canônica + áudio narrado (`<EquacaoCanonica>`)
- 7 portas com profundidade crescente (`<DuasPortas>`)
- 5 exemplos resolvidos com fonte explícita
- 30-80 exercícios em `<ListaExercicios>`, todos com `solucao` + `fonte` (livro · página · licença) — ~25% também com `passos` (passo-a-passo)
- Conexão com Nobel oficial ([nobelprize.org](https://www.nobelprize.org/prizes/economic-sciences/1997/)) quando aplicável
- Fontes OER apenas: OpenStax, Active Calculus, Hammack, Stitz–Zeager, Yoshiwara, MIT OCW, Strang, Axler, etc.

A [**Lição 119 — Black-Scholes**](content/aulas/ano-3/trim-12/licao-119-bs-sintese.mdx) e a [**Lição 120 — Workshop final**](content/aulas/ano-3/trim-12/licao-120-workshop-final.mdx) fecham o currículo de 3 anos.

---

## Currículo (12 trimestres)

| Ano | Trim | Tema | Lições |
|---|---|---|---|
| **1.º** | 1 | Funções, afim, quadrática, exp/log | aulas 01-10 |
| **1.º** | 2 | Trigonometria, sequências, limite intuitivo | aulas 11-20 |
| **1.º** | 3 | Geometria analítica, vetores, sistemas | aulas 21-30 |
| **1.º** | 4 | Matrizes, combinatória, probabilidade | aulas 31-40 |
| **2.º** | 5 | Limites e continuidade | aulas 41-50 |
| **2.º** | 6 | Derivadas — regras, cadeia, implícita | aulas 51-60 |
| **2.º** | 7 | Aplicações: otimização, Taylor, Newton | aulas 61-70 |
| **2.º** | 8 | Estatística + probabilidade aplicada | aulas 71-80 |
| **3.º** | 9 | Integrais — Riemann, TFC, técnicas | aulas 81-90 |
| **3.º** | 10 | EDO + aplicações físicas (RLC, vibrações) | aulas 91-100 |
| **3.º** | 11 | Estatística inferencial — IC, testes, ANOVA | aulas 101-110 |
| **3.º** | 12 | Álgebra linear + síntese (PCA, SVD, BS) | aulas 111-120 |

---

## Multilinguagem (estado atual)

Não é Google Translate em runtime. É **tradução pré-compilada**. Hoje, o status real é:

- **UI** (botões, menus, breadcrumb, "Ouvir") → **11 idiomas, 100%**
- **Áudio TTS** (narrado pelo botão "Ouvir") → **11 idiomas, 100%**, com voz nativa do SO via Web Speech API
- **Lições MDX (corpos das aulas)** → **TO-DO**: por enquanto só PT-BR. Quando o aluno escolhe outro idioma, a UI muda mas o corpo da lição permanece em português. A pipeline de tradução com Gemini free-tier está pronta (`scripts/translate-parallel.py`); falta executar.

Idiomas atualmente removidos: árabe, hebraico e hindi — saíram temporariamente porque o TTS gratuito não rendia bem; voltarão quando tivermos uma solução de voz neural.

| Idioma | UI | TTS | Lições MDX |
|---|---|---|---|
| 🇧🇷 Português (Brasil) | 100% | 100% | **100% (fonte)** |
| 🇺🇸 English | 100% | 100% | TO-DO |
| 🇪🇸 Español | 100% | 100% | TO-DO |
| 🇨🇳 中文 (简体) | 100% | 100% | TO-DO |
| 🇯🇵 日本語 | 100% | 100% | TO-DO |
| 🇩🇪 Deutsch | 100% | 100% | TO-DO |
| 🇫🇷 Français | 100% | 100% | TO-DO |
| 🇮🇹 Italiano | 100% | 100% | TO-DO |
| 🇷🇺 Русский | 100% | 100% | TO-DO |
| 🇰🇷 한국어 | 100% | 100% | TO-DO |
| 🇵🇱 Polski | 100% | 100% | TO-DO |

---

## Stack técnica

```
Frontend:   Next.js 15 (App Router, SSG output:'export')
Conteúdo:   MDX + frontmatter YAML + KaTeX
Estilo:     Tailwind CSS + tokens RGB-tuple
Áudio:      Web Speech API (zero arquivos, exceto MP3 fallback removido)
Hospedagem: GitHub Pages (CDN gratuito, custo R$ 0)
i18n:       Sem libs externas — dicionário TypeScript pré-compilado
Testes:     Vitest
Validação:  npm run validate-content (frontmatter + YAML + Zod schemas)
```

### Build

```bash
npm install
npm run validate-content  # checa frontmatter e schemas
npm run typecheck
npm run build             # SSG estático em out/
```

### Adicionar uma lição nova

1. Crie `content/aulas/ano-N/trim-M/aula-XX-slug.mdx`
2. Use o template da `aula-52-regras-derivacao.mdx` (ou Black-Scholes para Trim 12)
3. Frontmatter com `titulo`, `descricao`, `categoria`, `slug`, `ordem`, `prerrequisitos`
4. 7 portas em `<DuasPortas>` + `<ListaExercicios>` com 30-50 exercícios
5. Validação automática no CI antes do deploy

---

## Fontes (todas OER · CC-BY ou compatível)

- [**Active Calculus**](https://activecalculus.org/single/) — Boelkins · 2024 · CC-BY-NC-SA
- [**OpenStax**](https://openstax.org/) — Calculus I-III, College Algebra, Statistics · CC-BY
- [**MIT OCW 18.06**](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) — Strang · CC-BY-NC-SA
- [**Linear Algebra Done Right**](https://linear.axler.net/) — Axler · 4ª ed · CC-BY-NC
- [**APEX Calculus**](https://www.apexcalculus.com/) — Hartman et al. · CC-BY-NC
- [**Mathematics for Machine Learning**](https://mml-book.com/) — Deisenroth, Faisal, Ong · gratuito
- [**Hastie ESL**](https://hastie.su.domains/ElemStatLearn/) — Statistical Learning · gratuito

Cada lição cita a fonte primária no rodapé. Nada inventado, nada plagiado.

---

## Por que existir

> A premissa do projeto: o Brasil tem **dois milhões de alunos** entrando no Ensino Médio todo ano. O conteúdo de matemática deles deveria ser pelo menos tão bom quanto o que existe nos cursinhos de elite — mas **gratuito, aberto e auditável**.

Esse projeto não é um cursinho a mais. É **a primeira vez** que um currículo completo de Ensino Médio brasileiro foi escrito:

- Por **dois autores** (Leonardo Chalhoub + Jefferson Korte Junior) com co-autoria do Claude Opus 4.7.
- Em **3 anos lineares**, com 12 trimestres encadeados que culminam em Black-Scholes.
- Com **rigor de engenharia** — não é "matemática para professor", é matemática para quem vai usar (engenheiro, físico, economista, cientista de dados, médico estatístico, programador).
- Em **13 idiomas** simultaneamente — porque um aluno em Lima, Tóquio ou Berlim merece o mesmo conteúdo de um aluno em São Paulo.
- **Open source** — qualquer professor no mundo pode forkar, adaptar e usar com sua turma.

Não estamos competindo com Khan Academy ou Brasil Escola. Estamos preenchendo uma lacuna específica: **rigor + profundidade + acessibilidade + multilinguagem**, tudo gratuito.

---

## Autoria

| Pessoa | Papel | Contato |
|---|---|---|
| **Leonardo Chalhoub** | Idealização, arquitetura, conteúdo, Black-Scholes | [LinkedIn](https://www.linkedin.com/in/leonardochalhoub/) · [Mirante dos Dados](https://leonardochalhoub.github.io/mirante-dos-dados-br/) |
| **Jefferson Korte Junior** | Conteúdo, revisão técnica, exercícios | UTFPR · jeffersonkorte@gmail.com · [LinkedIn](https://www.linkedin.com/in/jefferson-korte-dev/) |
| **Claude Opus 4.7** (Anthropic) | Co-autoria editorial, traduções, revisão | [anthropic.com](https://www.anthropic.com/) |

---

## Apoio

[**Amazing School**](https://www.amazingschool.com.br/) — plataforma gratuita de inglês com IA — é apoiadora oficial do Clube da Matemática.

---

## Contribuir

Achou um erro? Quer adicionar uma lição? Quer melhorar uma tradução?

- **Issues**: [github.com/leonardochalhoub/Clube-da-Matematica/issues](https://github.com/leonardochalhoub/Clube-da-Matematica/issues)
- **Pull Requests**: bem-vindos. Veja o template `aula-52` antes de propor estrutura nova.
- **Tradução**: cada `content/i18n/<locale>/aulas/...` é editável por humanos. Submeta correções diretamente.
- **Curadoria de exercícios**: dificuldades do tipo `'desafio'` e `'demonstracao'` precisam de revisão pedagógica — abra issue marcada com `curadoria`.

Critério editorial: toda contribuição passa pelo template das **7 portas**. Conteúdo que não atravessa as 7 portas (ex.: explicação só no nível "engenharia" sem versão para criança) será solicitada complementação antes do merge.

---

## Licença

[**MIT**](LICENSE) para o código. Conteúdo MDX e provas: **CC-BY 4.0** (atribuir Clube da Matemática + autores).

Fontes externas mantêm suas próprias licenças (OpenStax CC-BY, Active Calculus CC-BY-NC-SA, etc.). Cada lição cita explicitamente a licença da fonte primária.

---

## Roadmap

- [x] **120/120 lições** em PT-BR com 7 portas + ~4.770 exercícios sourceados
- [x] **1.800 questões em provas** (12 trim × 10 versões × 15 q)
- [x] **UI traduzida** em 11 idiomas
- [x] **Áudio TTS / leitor de voz acessível** em 11 idiomas (Web Speech API)
- [x] **Lições L1-L120 padronizadas no template canônico** (Lição 1 standard)
- [ ] **MDX das lições traduzido** em 10 idiomas além do PT-BR — **TO-DO** (pipeline Gemini pronta em `scripts/translate-parallel.py`)
- [ ] **Provas i18n** (1.800 questões × 10 idiomas) — TO-DO
- [ ] **Retorno de árabe / hebraico / hindi** quando houver TTS neural decente
- [ ] **Próximo módulo: Física Ensino Médio** (mecânica, ondas, eletromagnetismo)
- [ ] **Próximo módulo: Engenharia introdutória** (mecânica dos materiais, termo, fluidos)

---

## Mensagem final

Você está olhando para um curso que **não existia há um ano**. Foi escrito por duas pessoas + uma IA, ao longo de meses, sem orçamento, sem patrocinador, sem prazo.

A matemática que está aqui **não envelhece**. Códigos mudam, frameworks expiram. Mas $e^{i\pi} + 1 = 0$ permanece eternamente verdadeiro.

Se uma única pessoa em Lima, Tóquio, Berlim ou Belém aprende mais matemática por causa desse projeto, **valeu cada hora**.

> *"O bom estudante não para porque o curso terminou. O bom estudante percebe que o curso é só o começo."*

[**Comece pelo Ensino Médio →**](https://leonardochalhoub.github.io/Clube-da-Matematica/ensino-medio)
