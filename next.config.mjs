import createMDX from '@next/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const macros = JSON.parse(
  readFileSync(resolve(__dirname, 'docs/architecture/katex-macros.json'), 'utf-8'),
)
delete macros._meta

const withMDX = createMDX({
  options: {
    // remarkFrontmatter primeiro: reconhece e remove o YAML frontmatter
    // (lido em paralelo via gray-matter no loader.ts)
    remarkPlugins: [remarkFrontmatter, remarkGfm, remarkMath],
    rehypePlugins: [
      [rehypeKatex, { output: 'htmlAndMathml', macros, throwOnError: false, strict: false }],
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
})

// GitHub Pages serve em https://<user>.github.io/<repo>/.
// NEXT_PUBLIC_BASE_PATH é setado no workflow CI; dev local fica vazio.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  devIndicators: false,
  /**
   * Turbopack rules para `.mdx`. Usa `@mdx-js/loader` direto (não o wrapper
   * `@next/mdx`, cujas options não são serializáveis pelo Turbopack).
   *
   * Plugins passados como **strings** — o loader auto-importa do node_modules.
   * Vantagem: tudo serializável → Turbopack feliz.
   *
   * Webpack continua usando o `withMDX(...)` no fim do arquivo (para `next
   * build` / fallback). Em dev com `--turbopack`, este bloco vence.
   */
  turbopack: {
    rules: {
      '*.mdx': {
        loaders: [
          {
            loader: '@mdx-js/loader',
            options: {
              remarkPlugins: [
                'remark-frontmatter',
                'remark-gfm',
                'remark-math',
              ],
              rehypePlugins: [
                ['rehype-katex', {
                  output: 'htmlAndMathml',
                  macros,
                  throwOnError: false,
                  strict: false,
                }],
                'rehype-slug',
                ['rehype-autolink-headings', { behavior: 'wrap' }],
              ],
            },
          },
        ],
        as: '*.tsx',
      },
    },
  },
}

// Por enquanto: webpack (estável, mas lento). Turbopack precisa de plugins
// MDX como funções (não strings) — fica para depois.
export default withMDX(nextConfig)
