# Biblioteca do Clube da Matemática

Coleção curada de livros **legais, gratuitos e abertos** para sustentar
os conteúdos do Clube da Matemática. Foco editorial: matemática, física
e estatística do nível ensino médio (programa "Japão + Alemanha +
Singapura") até graduação inicial em engenharia.

## Estrutura

```
livros/
├── README.md                  ← este arquivo
├── CATALOG.md                 ← catálogo completo (200+ entradas + pointers)
├── PROGRAMA-JAP-DE-SG.md      ← rascunho do currículo Japão + Alemanha + Singapura
├── raw/                       ← PDFs originais baixados (não rastreados em git pesado)
├── md/                        ← versões em Markdown (subset prioritário)
└── scripts/                   ← scripts de download e conversão
```

## Princípios

1. **Legalidade primeiro.** Toda entrada precisa ter licença explícita
   (Creative Commons, GNU FDL, domínio público, ou autorização explícita
   do autor).

2. **Acesso direto.** Toda entrada tem URL do site oficial / fonte
   primária. Nunca PDFs piratas.

3. **Multi-idioma OK.** Inglês, alemão, japonês, francês, russo,
   espanhol, português — todos aceitos. Tradução pode ser feita depois.

4. **Pointers para mega-catálogos** quando ele cobre centenas de livros
   com curadoria própria (LibreTexts, Open Textbook Library, MIT OCW).
   Não enumeramos 1812 livros da OTL aqui — linkamos pra eles e
   destacamos os críticos.

## Status atual

| Métrica | Valor |
|---|---|
| Entradas individuais no catálogo | ver CATALOG.md |
| Aggregator pointers (cada um cobre 100+ livros) | ver CATALOG.md |
| PDFs baixados em `raw/` | ver `raw/MANIFEST.md` |
| Livros convertidos para MD em `md/` | ver `md/MANIFEST.md` |

## Como usar

1. Para descobrir livros: começar pelo `CATALOG.md` e usar a busca
   `Ctrl+F` por tópico.

2. Para citar em peças MDX do Clube: copiar o título, autor e URL da
   entrada relevante. Toda entrada tem fonte primária linkada.

3. Para contribuir: adicione novas entradas seguindo o template do
   `CATALOG.md` (título / autor / idioma / licença / URL / nota
   editorial). Verifique licença antes de adicionar.

## Aviso sobre conversão Markdown

Conversão sistemática **PDF → Markdown com equações preservadas** é
tecnicamente difícil sem ferramentas ML (ex.: `marker`, `nougat`).
Algumas opções:

- **Livros com source LaTeX/MD/HTML disponível**: conversão é trivial
  (Wikilivros, LibreTexts, alguns AIM books).
- **Livros só em PDF**: extração via `pdfminer.six` ou `pypdf`
  preserva texto mas perde equações (que viram glifos quebrados).
- **Solução adequada futura**: rodar `marker` ou `nougat` num pipeline
  CI separado.

Por enquanto, `md/` contém apenas livros com source aberto (HTML/LaTeX).
PDFs originais ficam em `raw/` para consulta humana.
