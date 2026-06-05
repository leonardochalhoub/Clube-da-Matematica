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

// KaTeX hardcodes `console.warn("No character metrics for...")` with no
// config gate (strict:false only affects parser, not font-metric warnings).
// Same for "Unrecognized Unicode character" and "LaTeX-incompatible input"
// emitted from buildCommon.js. Filter them at the process level — build only.
const _origWarn = console.warn
console.warn = (...args) => {
  const msg = args[0]
  if (typeof msg === 'string' && (
    msg.startsWith('No character metrics for') ||
    msg.startsWith('LaTeX-incompatible input') ||
    msg.includes('Unrecognized Unicode character')
  )) return
  _origWarn(...args)
}
const _origStderrWrite = process.stderr.write.bind(process.stderr)
process.stderr.write = (chunk, ...rest) => {
  const s = typeof chunk === 'string' ? chunk : chunk.toString()
  if (
    s.startsWith('No character metrics for') ||
    s.startsWith('LaTeX-incompatible input') ||
    s.includes('Unrecognized Unicode character')
  ) return true
  return _origStderrWrite(chunk, ...rest)
}

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
  // react-leaflet v5 + @react-leaflet/core são ESM-only e quebram o webpack
  // build worker do Next sem transpile. Usados só no /mapa (Mapa de Visitantes).
  transpilePackages: ['react-leaflet', '@react-leaflet/core', 'leaflet'],
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  devIndicators: false,
  // Webpack's infrastructure logging emits "Skipped not serializable cache
  // item" warnings every time a vfile with KaTeX messages can't be cached.
  // Those are noise — silence them with level: 'error'.
  webpack: (config) => {
    config.infrastructureLogging = {
      ...(config.infrastructureLogging ?? {}),
      level: 'error',
    }
    return config
  },
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
