# ADR-0001 — Stack from Scratch

**Data:** 2026-04-28
**Status:** Aprovado
**Decisores:** dono + conselho técnico
**Substitui:** código legado em `legacy_code/` (React CRA + FastAPI Python)

---

## Contexto

O projeto legado usava Create React App (sem SSR, sem SSG, sem roteamento estático), FastAPI como backend de cálculo numérico, e inline styles em JavaScript puro sem sistema de design. Não havia testes automatizados, CI, versionamento de conteúdo, nem separação entre lógica de algoritmo e renderização. A decisão foi recomeçar do zero com práticas de produção desde o commit inicial.

Restrições fixadas antes deste ADR: SSG indexável, deploy em GitHub Pages, PT-BR único, KaTeX via rehype-katex (ADR-0002), Supabase se necessário, identidade visual definida (IDENTITY.md).

---

## 1. Stack Final e Justificativas

| Camada | Decisão | Justificativa |
|---|---|---|
| Framework | Next.js 15 (App Router) com `output: 'export'` | SSG puro compatível com GH Pages; App Router habilita layouts aninhados, loading.tsx, error.tsx sem boilerplate manual. Confirmado: `output: 'export'` gera HTML/CSS/JS estático sem servidor Node em runtime. |
| Linguagem | TypeScript 5, `strict: true` | Frontmatter MDX tipado em Zod fecha o loop: schema compile-time + runtime. Sem `any` implícito nos algoritmos numéricos. |
| Conteúdo | MDX via `@next/mdx` + remark/rehype plugins | MDX permite importar `<Predicao />`, `<DuasPortas />`, `<Iteracao />` diretamente nos arquivos de conteúdo. Pipeline: remark-gfm → remark-math → rehype-katex → rehype-prism-plus → rehype-slug → rehype-autolink-headings. |
| Estilo | Tailwind CSS v4 + design tokens via CSS custom properties | v4 usa CSS nativo (`@theme`) sem `tailwind.config.ts` obrigatório para tokens; mas mantemos `tailwind.config.ts` para extensões TypeScript e IDE support. Tokens `--clube-*` definidos uma vez, consumidos em todo o projeto. |
| Estado global | Zustand | Peso ~1kB. Suficiente para estado dos exercícios de predição entre componentes. Redux seria over-engineering para este escopo. Context API causaria re-renders desnecessários no gráfico SVG durante cada keystroke de input. |
| Algoritmos numéricos | TypeScript puro em `src/lib/math/` | Zero dependência de runtime externo. Testável com Vitest + fast-check (property-based). O legado Python/FastAPI era uma roundtrip de rede para operações de microssegundos — eliminada. |
| Validação de conteúdo | Zod sobre frontmatter MDX | Garante em build-time que nenhuma peça de conteúdo chega ao deploy com campos obrigatórios ausentes. CI roda `validate-content.ts` antes do build. |
| Testes | Vitest + Testing Library + fast-check + Playwright | Pirâmide detalhada na seção 6. |
| Linting | ESLint flat config (eslint.config.mjs) + Prettier + commitlint | Flat config é o padrão do ESLint 9+. commitlint enforce Conventional Commits para changelog automático futuro. |
| CI/CD | GitHub Actions | lint → typecheck → test → validate-content → build → deploy GH Pages. Sem custo adicional para repositório público. |
| Banco de dados | Supabase (milestone 6) | Antes do M6: localStorage para persistência de progresso de predições. Trigger de migração: quando o usuário precisar continuar progresso em outro dispositivo, ou quando comments forem implementados. RLS de predições anônimas via Supabase Auth anonymous sign-in. |
| Notação matemática | KaTeX via rehype-katex | Decidido em ADR-0002. |
| Gráficos | SVG customizado (sem chart.js) | O gráfico da bisseção legado já era SVG manual — correto. chart.js adicionava ~200kB de bundle para funcionalidade que SVG cobre com zero dependência. Manter como componente React puro. |

### Sobre `output: 'export'` e GH Pages

Features do Next.js que **não funcionam** com `output: 'export'`:
- ISR (Incremental Static Regeneration) — sem servidor Node
- Image Optimization (`<Image>` com resize on-demand) — usar `unoptimized: true` ou servir imagens já otimizadas
- Server Actions e Route Handlers dinâmicos
- Middleware (executa em Edge runtime)

Features que **funcionam**:
- App Router com layouts aninhados
- `generateStaticParams` para rotas dinâmicas
- `generateMetadata` para SEO por página
- Server Components para leitura de MDX em build-time
- Todos os Client Components com `'use client'`

Quando migrar para Vercel: se o projeto precisar de ISR (conteúdo novo sem rebuild completo) ou image optimization automática. Para o escopo atual, GH Pages é suficiente.

---

## 2. Estrutura de Diretórios

```
clube-da-matematica/
├── .github/
│   └── workflows/
│       └── ci.yml                        # lint + test + build + deploy
├── app/
│   ├── layout.tsx                        # root layout: fontes, tokens CSS, KaTeX CSS
│   ├── page.tsx                          # home: manifesto + cards de conteúdo
│   ├── globals.css                       # @theme Tailwind v4 + tokens --clube-*
│   ├── [categoria]/
│   │   └── [slug]/
│   │       ├── page.tsx                  # rota dinâmica; generateStaticParams lê content/
│   │       └── loading.tsx
│   └── not-found.tsx
├── content/
│   ├── metodos-numericos/
│   │   ├── zero-de-funcoes/
│   │   │   ├── bissecao.mdx
│   │   │   ├── newton-raphson.mdx
│   │   │   └── secante.mdx
│   │   └── sistemas-lineares/
│   │       ├── jacobi.mdx
│   │       └── gauss-seidel.mdx
│   └── financas-quantitativas/
│       └── black-scholes.mdx
├── src/
│   ├── lib/
│   │   └── math/
│   │       ├── parser.ts                 # avaliador de expressão seguro (sem eval)
│   │       ├── parser.test.ts
│   │       ├── bissecao.ts
│   │       ├── bissecao.test.ts
│   │       ├── newton.ts
│   │       ├── newton.test.ts
│   │       ├── secante.ts
│   │       ├── secante.test.ts
│   │       ├── jacobi.ts
│   │       ├── gauss-seidel.ts
│   │       ├── interpolacao.ts
│   │       ├── integrais.ts
│   │       └── black-scholes.ts
│   ├── components/
│   │   ├── math/
│   │   │   ├── DuasPortas.tsx            # seletor de porta (formal/5/10/15/25/40)
│   │   │   ├── Predicao.tsx              # wrapper do modo predição
│   │   │   ├── Iteracao.tsx              # card de iteração step-by-step
│   │   │   ├── GraficoFuncao.tsx         # SVG genérico para f(x)
│   │   │   └── Calculadora.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/
│   │   │   ├── Botao.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── ProgressBar.tsx
│   │   └── brand/
│   │       └── Logo.tsx                  # espiral SVG + wordmark
│   ├── machines/
│   │   └── predicao.ts                   # máquina de estados do modo predição (TS puro)
│   ├── design/
│   │   └── tokens.ts                     # re-exporta tokens como constantes TS
│   ├── content/
│   │   └── schema.ts                     # Zod schema das 6 portas + exercício
│   └── hooks/
│       ├── usePredicao.ts                # integra máquina de estados com Zustand
│       └── useContentPage.ts
├── public/
│   ├── fonts/
│   │   ├── Inter-Variable.woff2
│   │   └── JetBrainsMono-Variable.woff2
│   └── og-default.png
├── scripts/
│   └── validate-content.ts               # lê todos os MDX, valida frontmatter com Zod
├── docs/
│   └── architecture/
│       ├── ADR-0001-stack-from-scratch.md
│       ├── ADR-0002-notacao-matematica.md
│       └── katex-macros.json
├── assets/
│   └── brand/
│       ├── icon.svg
│       └── favicon.svg
├── tests/
│   └── e2e/
│       ├── bissecao.spec.ts              # Playwright: fluxo completo de predição
│       └── navegacao.spec.ts
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.mjs
├── .prettierrc
├── .gitignore
└── README.md
```

---

## 3. Decisões Críticas

### GitHub Pages SSG vs Vercel

Confirmado: `output: 'export'` gera site completamente estático. O pipeline de conteúdo inteiro roda em build-time via Server Components — leitura de MDX, validação Zod, `generateStaticParams`. Nenhum runtime Node necessário em produção.

Limitação concreta: `next/image` com `loader` padrão não funciona sem servidor. Solução: `images: { unoptimized: true }` no `next.config.mjs` e imagens já otimizadas em `public/`. Para o escopo atual (conteúdo matemático, pouquíssimas imagens rasterizadas) é aceitável.

**Trigger para migrar para Vercel:** qualquer uma das condições — (a) conteúdo novo precisa aparecer sem rebuild manual (ISR); (b) upload de imagens de usuário; (c) Server Actions para mutation de dados.

### Supabase: quando ativar

Antes do M6, o estado de progresso de predição fica em `localStorage` com chave `clube:progresso:<slug>`. Funciona para um único dispositivo, sem autenticação.

**Trigger de ativação do Supabase:** usuário quer continuar o exercício no celular depois de ter começado no desktop — ou seja, persistência cross-device. Isso implica auth anônima (Supabase anonymous sign-in, sem senha) + tabela `predicao_progresso` com RLS `auth.uid() = user_id`. Comments em peças de conteúdo é o segundo trigger, mas provavelmente posterior.

### 6 Portas como dado vs componente

As 6 portas não são 6 componentes diferentes. São um único componente `<DuasPortas />` que recebe o frontmatter tipado e renderiza a porta selecionada. O dado vive no MDX; a lógica de seleção vive no componente. Isso permite adicionar uma sétima porta sem tocar em TypeScript — só no MDX.

### Modo Predição como máquina de estados

O estado do exercício de predição é uma máquina de estados finitos em `src/machines/predicao.ts`, TypeScript puro, sem JSX, sem efeitos colaterais. O React consome a máquina via `usePredicao.ts`.

```
Estados:
  IDLE → AGUARDANDO_PREDICAO → PREDICAO_REGISTRADA → MOSTRANDO_RESPOSTA → CORRIGINDO → CONCLUIDO

Transições:
  IDLE
    + iniciar()             → AGUARDANDO_PREDICAO

  AGUARDANDO_PREDICAO
    + registrarPredicao(v)  → PREDICAO_REGISTRADA   { predicao: v }

  PREDICAO_REGISTRADA
    + revelarResposta()     → MOSTRANDO_RESPOSTA

  MOSTRANDO_RESPOSTA
    + corrigir(gabarito)    → CORRIGINDO             { acertou: boolean }

  CORRIGINDO
    + proximoPasso()        → AGUARDANDO_PREDICAO    (se há mais subpassos)
    + proximoPasso()        → CONCLUIDO              (se era o último)

  CONCLUIDO
    + reiniciar()           → IDLE

Contexto do estado:
  {
    slug: string,
    passoAtual: number,
    totalPassos: number,
    predicao: string | null,
    acertou: boolean | null,
    historico: Array<{ passo: number, predicao: string, acertou: boolean }>
  }
```

A máquina não sabe nada de localStorage nem Supabase. Persistência é responsabilidade do hook `usePredicao.ts`.

### Pipeline editorial

O autor escreve um arquivo MDX em `content/`. Importa componentes diretamente no MDX:

```mdx
---
# frontmatter (validado pelo schema Zod)
---

import { DuasPortas } from '@/components/math/DuasPortas'
import { Predicao }   from '@/components/math/Predicao'
import { Iteracao }   from '@/components/math/Iteracao'

<DuasPortas portas={portas} />

<Predicao exercicio={exercicio} />
```

O campo `portas` e o campo `exercicio` são lidos do frontmatter tipado e passados como props pelo `page.tsx` antes de renderizar o MDX. O autor não lida com estado — só escreve conteúdo declarativo.

---

## 4. Setup Técnico

### `package.json`

```json
{
  "name": "clube-da-matematica",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "validate-content": "tsx scripts/validate-content.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "dependencies": {
    "next": "^15.3.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "zustand": "^5.0.0",
    "zod": "^3.24.0",
    "katex": "^0.16.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/katex": "^0.16.0",
    "@next/mdx": "^15.3.0",
    "@mdx-js/loader": "^3.1.0",
    "@mdx-js/react": "^3.1.0",
    "remark-gfm": "^4.0.0",
    "remark-math": "^6.0.0",
    "rehype-katex": "^7.0.0",
    "rehype-prism-plus": "^2.0.0",
    "rehype-slug": "^6.0.0",
    "rehype-autolink-headings": "^7.1.0",
    "gray-matter": "^4.0.3",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/typography": "^0.5.15",
    "vitest": "^3.1.0",
    "@vitest/coverage-v8": "^3.1.0",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.5.0",
    "fast-check": "^3.23.0",
    "jsdom": "^26.0.0",
    "@playwright/test": "^1.52.0",
    "eslint": "^9.20.0",
    "@eslint/js": "^9.20.0",
    "eslint-config-next": "^15.3.0",
    "typescript-eslint": "^8.22.0",
    "prettier": "^3.4.0",
    "@commitlint/cli": "^19.6.0",
    "@commitlint/config-conventional": "^19.6.0",
    "tsx": "^4.19.0",
    "husky": "^9.1.0"
  }
}
```

### `next.config.mjs`

```js
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import katexMacros from './docs/architecture/katex-macros.json' assert { type: 'json' }

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      [rehypeKatex, { output: 'htmlAndMathml', macros: katexMacros }],
      rehypePrismPlus,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: { unoptimized: true },
  trailingSlash: true,
}

export default withMDX(nextConfig)
```

### `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './src/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        clube: {
          teal:  'var(--clube-teal)',
          gold:  'var(--clube-gold)',
          cream: 'var(--clube-cream)',
          ink:   'var(--clube-ink)',
          mist:  'var(--clube-mist)',
          leaf:  'var(--clube-leaf)',
          clay:  'var(--clube-clay)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [typography],
} satisfies Config
```

`app/globals.css` define os tokens:
```css
@import 'tailwindcss';
@import 'katex/dist/katex.min.css';

@theme {
  --color-clube-teal:  #1A4D5C;
  --color-clube-gold:  #E8C77A;
  --color-clube-cream: #FBF8F3;
  --color-clube-ink:   #1A1F2C;
  --color-clube-mist:  #6B7B85;
  --color-clube-leaf:  #3D7A5F;
  --color-clube-clay:  #C76B3F;
}

:root {
  --clube-teal:  #1A4D5C;
  --clube-gold:  #E8C77A;
  --clube-cream: #FBF8F3;
  --clube-ink:   #1A1F2C;
  --clube-mist:  #6B7B85;
  --clube-leaf:  #3D7A5F;
  --clube-clay:  #C76B3F;
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "moduleResolution": "bundler",
    "module": "esnext",
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "legacy_code"]
}
```

### `vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/lib/math/**', 'src/machines/**'],
      thresholds: { lines: 90, functions: 90, branches: 85 },
    },
  },
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
})
```

### `eslint.config.mjs`

```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import nextPlugin from 'eslint-config-next'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
  { ignores: ['legacy_code/**', '.next/**', 'out/**'] },
)
```

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Typecheck
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Validate content
        run: npm run validate-content

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: out/

  deploy:
    needs: ci
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### `scripts/validate-content.ts`

```ts
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'
import { conteudoSchema } from '../src/content/schema'

const CONTENT_DIR = join(process.cwd(), 'content')

async function* walkMdx(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walkMdx(full)
    else if (entry.name.endsWith('.mdx')) yield full
  }
}

let errors = 0
for await (const file of walkMdx(CONTENT_DIR)) {
  const raw = await readFile(file, 'utf-8')
  const { data } = matter(raw)
  const result = conteudoSchema.safeParse(data)
  if (!result.success) {
    console.error(`ERRO: ${file}`)
    console.error(result.error.format())
    errors++
  } else {
    console.log(`OK: ${file.replace(process.cwd(), '')}`)
  }
}

if (errors > 0) {
  console.error(`\n${errors} arquivo(s) com frontmatter inválido.`)
  process.exit(1)
}
```

### `src/content/schema.ts`

```ts
import { z } from 'zod'

const portaSchema = z.object({
  titulo: z.string().min(1),
  texto:  z.string().min(1),
})

const exercicioPassoSchema = z.object({
  id:              z.string(),
  pergunta:        z.string(),
  perguntaTexto:   z.string(),
  tipo:            z.enum(['numero', 'simnao', 'escolha']),
  esperado:        z.union([z.number(), z.string()]),
  dica:            z.string(),
  inteiro:         z.boolean().optional(),
  opcoes:          z.array(z.string()).optional(),
  contextoSubpasso: z.string().nullable().optional(),
})

const exercicioSchema = z.object({
  descricao:   z.string(),
  parametros:  z.record(z.string(), z.union([z.string(), z.number()])),
  passos:      z.array(exercicioPassoSchema).min(1),
})

export const conteudoSchema = z.object({
  titulo:      z.string().min(1),
  slug:        z.string().regex(/^[a-z0-9-]+$/),
  categoria:   z.string().min(1),
  subcategoria: z.string().min(1),
  descricao:   z.string().min(10),
  ordem:       z.number().int().positive(),
  publicado:   z.boolean(),
  tags:        z.array(z.string()).optional(),

  // 6 portas obrigatórias
  portas: z.object({
    formal: portaSchema,
    idade5:  portaSchema,
    idade10: portaSchema,
    idade15: portaSchema,
    idade25: portaSchema,
    idade40: portaSchema,
  }),

  // Portas extras opcionais
  portasExtras: z.record(z.string(), portaSchema).optional(),

  // Exercício de predição
  exercicio: exercicioSchema,
})

export type Conteudo = z.infer<typeof conteudoSchema>
export type Porta = z.infer<typeof portaSchema>
export type Exercicio = z.infer<typeof exercicioSchema>
export type ExercicioPasso = z.infer<typeof exercicioPassoSchema>
```

### `.gitignore`

```
.next/
out/
node_modules/
.env
.env.local
.env.*.local
*.pem
npm-debug.log*
.DS_Store
coverage/
playwright-report/
test-results/
*.tsbuildinfo
.vercel
```

---

## 5. Roadmap em Milestones

### M0 — Bootstrap (estimativa: 4h)

**Entrega:** repositório configurado com toda a estrutura de diretórios, `package.json` instalado, CI passando no GH Actions, deploy de "Hello Clube" em GH Pages com tokens de identidade aplicados.

**Critério de aceite:** `npm run typecheck && npm run lint && npm run build` passam sem erros. URL pública do GH Pages carrega a página com cor de fundo `--clube-cream` e título "Clube da Matemática" em Inter 700.

### M1 — Layout + Identidade (estimativa: 6h)

**Entrega:** Header com logo (espiral SVG + wordmark), Sidebar com navegação por categoria/subcategoria, Footer. Página `/` com manifesto e grid de cards de conteúdo (vazio por ora). Fontes auto-hospedadas funcionando. Dark mode não-escopo — não implementar.

**Critério de aceite:** Lighthouse mobile ≥ 90 em Performance + Accessibility. Fontes carregando de `public/fonts/` sem requisição a Google Fonts.

### M2 — Pipeline MDX + Bisseção (estimativa: 8h)

**Entrega:** `generateStaticParams` lendo todos os MDX de `content/`. Componente `<DuasPortas />` funcional com seleção de porta. `validate-content.ts` rodando em CI. `bissecao.mdx` completa com as 6 portas escritas (incluindo porta 25 com "uma opção de Petrobras de 90 dias custa R$1,80 — 5% do preço da ação" como ponto de ancoragem). Rota `/metodos-numericos/zero-de-funcoes/bissecao` funcionando.

**Critério de aceite:** `validate-content.ts` valida sem erros. Página da bisseção renderiza KaTeX corretamente. Seleção de porta funciona no mobile.

### M3 — Componentes Interativos (estimativa: 10h)

**Entrega:** `src/machines/predicao.ts` (máquina de estados). `src/lib/math/bissecao.ts` com `gerarPassos()` tipado, testado com Vitest (≥15 casos unitários + 3 propriedades fast-check: convergência garantida, erro < tolerância, número de iterações ≤ ceil(log2((b-a)/ε))). `<Predicao />` e `<Iteracao />` integrados. `GraficoFuncao.tsx` em SVG puro. `Calculadora.tsx` refatorada sem inline styles. `parser.ts` substituindo o `eval`/`Function()` do legado.

**Critério de aceite:** testes passam com cobertura ≥ 90% em `src/lib/math/`. Modo predição funciona end-to-end na bisseção: predição → confirmação → feedback → histórico. Sem `eval` nem `new Function()` no codebase novo.

### M4 — Newton-Raphson + Secante + Black-Scholes (estimativa: 12h)

**Entrega:** três peças MDX completas com 6 portas + exercício. `newton.ts`, `secante.ts`, `black-scholes.ts` em `src/lib/math/` com testes. Black-Scholes com porta 40 incluindo Greeks (delta, theta, vega) e exemplo numérico com preços reais de PETR4.

**Critério de aceite:** `validate-content.ts` passa para os três. Testes de `black-scholes.ts`: preço de call para S=30, K=30, r=0,10, σ=0,25, T=90/365 deve retornar ≈ R$1,79 ± 0,02.

### M5 — Jacobi + Gauss-Seidel + Interpolação + Integrais (estimativa: 12h)

**Entrega:** seis peças MDX. Algoritmos em `src/lib/math/` com testes property-based (convergência para matrizes estritamente diagonal dominantes).

**Critério de aceite:** suite completa de testes passa. Build sem erros. Cobertura geral ≥ 85%.

### M6 — Supabase + Comments (estimativa: 16h)

**Entrega:** Supabase Auth anônima. Tabela `predicao_progresso` com RLS. Migração de localStorage para Supabase quando usuário opta por "salvar progresso". Sistema de comments por peça de conteúdo.

**Critério de aceite:** usuário pode iniciar bisseção no desktop, abrir no celular, e ver o mesmo ponto de progresso. RLS impede usuário A de ler progresso do usuário B.

---

## 6. Pirâmide de Testes

```
         /   E2E: 8 specs Playwright   \
        /   (fluxos críticos de UI)     \
       /─────────────────────────────────\
      /   Integração: ~20 testes         \
     /   (componentes + hooks + máquina) \
    /─────────────────────────────────────\
   /   Unitários: ~80 testes              \
  /   (algoritmos + parser + schema Zod)  \
 /─────────────────────────────────────────\
```

**Unitários (~80) — Vitest:**
- `src/lib/math/*.test.ts`: cada algoritmo com casos nominais, casos de borda (intervalo sem raiz, matriz não convergente, divisão por zero) e 3–5 propriedades fast-check por algoritmo.
- `src/content/schema.ts`: validação de frontmatter válido e inválido.
- `src/machines/predicao.ts`: cada transição de estado isolada.

**Integração (~20) — Vitest + Testing Library:**
- `<Predicao />` com máquina de estados: ciclo completo de resposta certa + errada + dica.
- `<DuasPortas />`: troca de porta atualiza conteúdo.
- `usePredicao` hook: persistência em localStorage.
- `validate-content.ts`: script com fixtures de MDX válido e inválido.

**E2E (8 specs) — Playwright:**
- Navegação home → bisseção → predição completa (caminho feliz).
- Navegação home → bisseção → predição com erros → dica parcial → dica completa.
- Seleção de porta em mobile (viewport 375px).
- KaTeX renderizado corretamente (não mostra LaTeX cru).
- Navegação entre duas peças via Sidebar.
- Black-Scholes: entrada de parâmetros reais → resultado esperado.
- Acessibilidade básica: `aria-label` em fórmulas, tab-order no modo predição.
- Deploy de GH Pages: smoke test na URL pública (só no pipeline de main).

**Thresholds em CI:**
- Cobertura de `src/lib/math/`: linhas ≥ 90%, branches ≥ 85%.
- Cobertura de `src/machines/`: linhas ≥ 90%.
- E2E: qualquer falha bloqueia deploy.

---

## Consequências

Aceitar este ADR significa: o legado em `legacy_code/` é referência de algoritmos e lógica de interação, não de arquitetura. Nenhum arquivo de `legacy_code/` é copiado diretamente. O `eval`/`new Function()` do `avaliar()` legado é substituído por um parser seguro em `src/lib/math/parser.ts`. Os inline styles do legado são substituídos por Tailwind com tokens. A chamada HTTP ao FastAPI é eliminada — algoritmos rodam 100% no cliente em TypeScript.

O site resultante é: estático, indexável, mobile-first, sem servidor em runtime, com fórmulas renderizadas em build-time, e com suite de testes que impede regressão nos algoritmos numéricos.
