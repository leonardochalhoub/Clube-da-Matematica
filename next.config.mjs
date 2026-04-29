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
}

export default withMDX(nextConfig)
