#!/usr/bin/env node
/**
 * validate-mdx.mjs — pre-flight MDX/JSX parse check.
 *
 * Uso:
 *   node scripts/validate-mdx.mjs <arquivo.mdx>
 *
 * Exit codes:
 *   0 = parse OK
 *   1 = parse error (imprime linha:col + mensagem)
 *   2 = arquivo nao encontrado
 *
 * Mesmos plugins que o pipeline real do Next (ver next.config.mjs):
 *   remarkFrontmatter, remarkGfm, remarkMath, rehypeKatex (com macros)
 * Detecta os mesmos bugs que quebram a build:
 *   - Aspas duplas aninhadas em atributos JSX
 *   - {,} brace-decimal fora de $...$ math
 *   - Headings markdown precedendo componentes JSX
 *   - Backtick template literals encadeados em fragmentos
 *   - Fragmentos JSX desbalanceados
 *
 * Stdlib + dependencias ja no node_modules. Sem npm install.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { compile } from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const file = process.argv[2];
if (!file) {
  console.error("uso: node scripts/validate-mdx.mjs <arquivo.mdx>");
  process.exit(2);
}
const path = resolve(file);
if (!existsSync(path)) {
  console.error(`ERRO: arquivo nao existe: ${path}`);
  process.exit(2);
}

const src = readFileSync(path, "utf-8");

try {
  await compile(src, {
    remarkPlugins: [remarkFrontmatter, remarkGfm, remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false, throwOnError: false }]],
    development: false,
  });
  console.log(`✓ parse OK: ${file}`);
  process.exit(0);
} catch (err) {
  // mdx errors use multiple shapes: err.place, err.position, err.line/column, or string in message
  const place = err.place || err.position;
  let line = place?.start?.line ?? err.line ?? null;
  let col = place?.start?.column ?? err.column ?? null;
  if (line == null) {
    const m = (err.message || "").match(/(\d+):(\d+)/);
    if (m) { line = +m[1]; col = +m[2]; }
  }
  const lineDisp = line ?? "?";
  const colDisp = col ?? "?";
  const lineSrc = line ? (src.split("\n")[line - 1] || "").slice(0, 200) : "";
  console.error(`✗ parse ERROR em ${file}:${lineDisp}:${colDisp}`);
  console.error(`  mensagem: ${err.reason || err.message}`);
  if (lineSrc) console.error(`  linha:    ${lineSrc}`);
  if (col && col > 0) {
    console.error(`            ${" ".repeat(Math.max(0, col - 1))}^`);
  }
  process.exit(1);
}
