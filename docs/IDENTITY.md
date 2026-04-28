# Identidade Visual — Clube da Matemática

**Status:** v1 · **Data:** 2026-04-28

## Nome

**Clube da Matemática**
- Wordmark: "Clube da Matemática"
- Slug curto / título de aba: "Clube"
- Domínio sugerido: `clubedamatematica.org` (TBD)
- Handle: `@clubedamatematica` (TBD)

## Tagline

> **"Aprenda matemática de verdade."**

Variantes contextuais:
- Short: *"Matemática contada direito."*
- Long: *"Onde matemática para de ser fórmula pra decorar e vira ferramenta pra entender o mundo."*
- Brutal: *"Você vai aprender matemática maluco."*

## Símbolo — A Espiral Áurea

### Conceito

Um **espiral de Fibonacci** desenhado como linha contínua única, em quartos de arco crescentes na razão áurea. Inscrito numa moldura suave de cantos arredondados. Aberto nas duas pontas — nunca fechado, nunca terminado.

### Por quê esse símbolo

| Atributo solicitado | Como o espiral entrega |
|---|---|
| **Paz** | Curva orgânica contínua, sem ângulos agudos, moldura arredondada |
| **Segurança** | Razão áurea é uma das constantes mais universais e antigas da matemática — fundação confiável |
| **Perseverança** | Cada volta cresce; nunca para; sempre tem mais |
| **Fé em aprender** | Pontas abertas: aprendizado nunca é fechado, sempre tem outra volta |

A espiral também é **transcultural** — aparece em conchas, galáxias, plantas, na arte renascentista. Não é símbolo "tech". É símbolo da matemática como linguagem da natureza.

### Construção matemática

Quatro arcos de 90° conectados, com raios em sequência de Fibonacci:
$$r_1 = 1,\quad r_2 = 2,\quad r_3 = 3,\quad r_4 = 5,\quad r_5 = 8$$

Cada arco subsequente cresce na razão $\varphi \approx 1{,}618$ — a razão áurea aparece sozinha na proporção entre arcos consecutivos. **A geometria é o significado.**

### Arquivos

- `assets/brand/icon.svg` — ícone com fundo teal (uso em fundos claros, app icon, OG image)
- `assets/brand/favicon.svg` — só o espiral em teal, fundo transparente (browser tab, dark mode-friendly)

## Paleta de cores

| Token | Hex | Uso |
|---|---|---|
| `--clube-teal` | `#1A4D5C` | Primária. Fundo do ícone, links, header |
| `--clube-gold` | `#E8C77A` | Acento. A espiral, hover states, callouts |
| `--clube-cream` | `#FBF8F3` | Background do site. Calmo, não branco-clínico |
| `--clube-ink` | `#1A1F2C` | Texto principal |
| `--clube-mist` | `#6B7B85` | Texto secundário, metadados |
| `--clube-leaf` | `#3D7A5F` | Sucesso, acerto na predição |
| `--clube-clay` | `#C76B3F` | Atenção, erro na predição (terracota — não vermelho-pânico) |

**Princípios:**
- Teal profundo > azul tech-startup. Mais maduro, menos cliché.
- Gold quente > amarelo-sinalização. Peso de ouro, não de etiqueta.
- Cream > branco puro. Reduz fadiga ocular em sessão longa.
- Erro em terracota, não vermelho. Errar é parte do processo, não punição.

## Tipografia

| Uso | Fonte | Razão |
|---|---|---|
| Texto corrido | **Inter** | Humanista, alta legibilidade em qualquer tamanho, suporte completo a PT-BR |
| Matemática / código | **JetBrains Mono** | Monoespaçada, ligaturas matemáticas, distingue `0` de `O`, `1` de `l` |
| Headings (opcional) | Inter (peso 700-800) | Sem fonte serif decorativa — manter coesão |

Fontes auto-hospedadas (não Google Fonts CDN) — performance em rede ruim + privacidade.

**Tabular numerals** ativados em listas de iterações, tabelas de resultado, qualquer dado numérico vertical: `font-variant-numeric: tabular-nums`.

## Aplicação no header (upper bar)

```
┌─────────────────────────────────────────────────────────────┐
│  [▸] Clube da Matemática                            [busca] │
└─────────────────────────────────────────────────────────────┘
```

- Ícone à esquerda do nome, ~32px de altura, gap de 12px
- Wordmark "Clube da Matemática" em Inter 600 (semibold), tracking-tight
- Cor do wordmark: `--clube-ink` em fundo cream; `--clube-cream` em fundo teal
- Browser tab: favicon (espiral teal sobre transparente) + título "Clube da Matemática"

## Voz e tom

| Princípio | Exemplo bom | Exemplo ruim |
|---|---|---|
| Direto, sem academiquês desnecessário | "A bisseção corta o intervalo no meio." | "Procedemos à divisão do intervalo no ponto médio." |
| Pergunta antes de responder | "Você acha que vai convergir?" | "Note que a sequência converge." |
| Cita o real, com números | "Uma opção de Petrobras a 90 dias custa R$1,80 — 5% do preço da ação." | "Opções têm um preço associado." |
| Brasileiro, sem afetação | "Maluco, isso aqui muda tudo." | "Tenha em mente que isto é fundamental." |
| Honesto sobre limitação | "Black-Scholes assume vol constante. Mercado real não é assim." | (omite limitações) |

**Anti-padrões:**
- ❌ "Olá, jovem aprendiz!" (gameficação Khan)
- ❌ "Vamos juntos descobrir!" (paternalismo)
- ❌ "É super simples!" (mente — não é)
- ❌ Emoji de festa em conquista pedagógica

## Coerência futura

Toda peça nova de identidade (logo animado, OG image, slide de palestra, badge de contribuidor open source) **deve** derivar deste documento. Mudanças são via PR + ADR.
