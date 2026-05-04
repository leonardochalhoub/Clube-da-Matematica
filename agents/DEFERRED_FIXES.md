# Deferred Fixes (não bloqueantes)

> Lista de itens identificados durante a sessão de 2026-05-04 que não impedem
> avanço imediato mas precisam ser endereçados depois.

## Naming convention: `licao-` em vez de `aula-`

Renomear globalmente:
- Diretórios e arquivos `.mdx`: `aula-01-...` → `licao-01-...`
- `slug:` no frontmatter: `aula-01-conjuntos-intervalos` → `licao-01-conjuntos-intervalos`
- `seed=` em `<ListaExercicios>`: `aula-01` → `licao-01`
- Referências cruzadas em `prerrequisitos:` de outras aulas
- Manifest gerado (re-rodar `generate-manifest.ts`)
- URLs em `app/[categoria]/[...caminho]` continuariam funcionando porque o
  caminho é derivado do filesystem
- Pode haver scripts/utils que assumem prefixo "aula-" — checar `lib/content/`

Razão: padrão editorial brasileiro — "Lição" é a denominação correta, "aula" virou
URL convention só por inércia. Memória `feedback-licao-pt-br.md` já cobre o lado
da palavra impressa; falta alinhar o filesystem.

## Conflito de rotas `[locale]` vs `[categoria]`

App router tem dois dynamic segments irmãos no root: `app/[categoria]/` (PT-BR
legacy) e `app/[locale]/[categoria]/` (i18n novo). Next 15 não tolera. Hoje é
contornado escondendo um ou outro. Plano definitivo:
- Migrar PT-BR para `app/[locale]/[categoria]/` também (`pt-BR` como locale padrão
  via redirect raiz `/` → `/pt-BR`)
- Apagar `app/[categoria]/` legacy
- Atualizar `generateStaticParams` da rota i18n para incluir paths PT-BR

## Dev server lento + retry de áudio

`next dev` na rota dinâmica fica em "Retrying 1/3..." por algum serviço externo
(possivelmente Pyodide CDN ou AudioReader pretranslate). Investigar e fazer
graceful skip em dev local sem internet.

## Gemini truncation em outputs longos

`gemini-2.5-flash` corta o output quando atinge `max-tokens` (mesmo com 48k).
O draft v4 da Lição 1 cortou no exercício 1.56, deixando JSX inacabado. Adicionar
ao `gemini-draft.py`:
- Detecção pós-geração: contar `<Exercicio` opens vs `</Exercicio>` closes; se
  desbalanceado, avisar
- Continuação automática: se output truncar, pedir continuação a partir do último
  `</Exercicio>` válido, juntar
