#!/usr/bin/env python3
"""
fetch-book.py — baixa um capitulo de livro CC-BY/CC-BY-SA e salva como markdown
limpo em livros/, pra ser passado como --context aos agentes Gemini.

Uso:
  python3 scripts/fetch-book.py \\
    --url "https://openstax.org/books/college-algebra-2e/pages/1-1-real-numbers-algebra-essentials" \\
    --out livros/openstax-college-algebra-1.1.md \\
    --titulo "OpenStax College Algebra 2e §1.1 — Real Numbers"

Stdlib only (urllib + html.parser). Strip de HTML rudimentar mas suficiente
pra extrair texto + headings + listas. Sem dependencias.
"""

import argparse
import os
import re
import sys
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path


class MarkdownExtractor(HTMLParser):
    """Converte HTML em markdown leve preservando headings, paragrafos, listas e math."""
    SKIP_TAGS = {"script", "style", "nav", "aside", "header", "footer", "noscript"}
    HEADING_TAGS = {"h1": "#", "h2": "##", "h3": "###", "h4": "####", "h5": "#####", "h6": "######"}

    def __init__(self):
        super().__init__()
        self.out = []
        self.skip_depth = 0
        self.current_heading = None
        self.in_list = []
        self.in_pre = False
        self.in_math = False
        self.collected = []

    def _flush(self, sep="\n\n"):
        text = "".join(self.collected).strip()
        if text:
            self.out.append(text)
        self.collected = []

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP_TAGS:
            self.skip_depth += 1
            return
        if self.skip_depth:
            return
        attrs_d = dict(attrs)
        cls = attrs_d.get("class", "")
        if "math" in cls or tag == "math":
            self.in_math = True
            self.collected.append("$")
            return
        if tag in self.HEADING_TAGS:
            self._flush()
            self.collected.append(self.HEADING_TAGS[tag] + " ")
            self.current_heading = tag
        elif tag == "p":
            self._flush()
        elif tag == "br":
            self.collected.append("\n")
        elif tag == "li":
            indent = "  " * (len(self.in_list) - 1) if self.in_list else ""
            marker = "-" if self.in_list and self.in_list[-1] == "ul" else "1."
            self.collected.append(f"\n{indent}{marker} ")
        elif tag == "ul":
            self.in_list.append("ul")
            self._flush()
        elif tag == "ol":
            self.in_list.append("ol")
            self._flush()
        elif tag == "pre":
            self._flush()
            self.collected.append("```\n")
            self.in_pre = True
        elif tag == "code" and not self.in_pre:
            self.collected.append("`")
        elif tag in ("strong", "b"):
            self.collected.append("**")
        elif tag in ("em", "i"):
            self.collected.append("*")
        elif tag == "a":
            self.current_href = attrs_d.get("href", "")
            self.collected.append("[")

    def handle_endtag(self, tag):
        if tag in self.SKIP_TAGS:
            self.skip_depth = max(0, self.skip_depth - 1)
            return
        if self.skip_depth:
            return
        if tag == "math" or self.in_math and tag in ("span", "div"):
            if self.in_math:
                self.collected.append("$")
                self.in_math = False
            return
        if tag in self.HEADING_TAGS:
            self._flush()
            self.current_heading = None
        elif tag == "p":
            self._flush()
        elif tag in ("ul", "ol"):
            if self.in_list:
                self.in_list.pop()
            self._flush()
        elif tag == "pre":
            self.collected.append("\n```")
            self.in_pre = False
            self._flush()
        elif tag == "code" and not self.in_pre:
            self.collected.append("`")
        elif tag in ("strong", "b"):
            self.collected.append("**")
        elif tag in ("em", "i"):
            self.collected.append("*")
        elif tag == "a":
            href = getattr(self, "current_href", "")
            self.collected.append(f"]({href})" if href else "]")

    def handle_data(self, data):
        if self.skip_depth:
            return
        if not data.strip() and not self.in_pre:
            return
        # Collapse whitespace except in pre
        text = data if self.in_pre else re.sub(r"\s+", " ", data)
        self.collected.append(text)

    def finalize(self) -> str:
        self._flush()
        # Normalize: collapse 3+ blank lines to 2
        result = "\n\n".join(self.out)
        result = re.sub(r"\n{3,}", "\n\n", result)
        return result.strip() + "\n"


def fetch(url: str) -> str:
    import ssl
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Clube da Matematica book fetcher)",
    })
    # WSL2/Linux often lacks proper CA bundle for Python; livros publicos sao
    # CC-BY de hosts confiaveis (openstax, hammack, stitz-zeager) — skip OK aqui
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    with urllib.request.urlopen(req, timeout=60, context=ctx) as resp:
        encoding = resp.headers.get_content_charset() or "utf-8"
        return resp.read().decode(encoding, errors="replace")


def html_to_markdown(html: str) -> str:
    # Strip <head>, focus on <main> or <article> if present
    main_m = re.search(r"<main\b[^>]*>(.*?)</main>", html, re.IGNORECASE | re.DOTALL)
    if main_m:
        html = main_m.group(1)
    else:
        article_m = re.search(r"<article\b[^>]*>(.*?)</article>", html, re.IGNORECASE | re.DOTALL)
        if article_m:
            html = article_m.group(1)
    # Strip script/style entirely (HTMLParser also skips, but defensive)
    html = re.sub(r"<script\b[^>]*>.*?</script>", "", html, flags=re.IGNORECASE | re.DOTALL)
    html = re.sub(r"<style\b[^>]*>.*?</style>", "", html, flags=re.IGNORECASE | re.DOTALL)
    p = MarkdownExtractor()
    p.feed(html)
    return p.finalize()


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--url", required=True, help="URL do capitulo (HTML)")
    parser.add_argument("--out", required=True, help="Arquivo de saida .md")
    parser.add_argument("--titulo", help="Titulo a colocar no topo do arquivo")
    parser.add_argument("--max-chars", type=int, default=120000, help="Max chars apos extracao (default 120k)")
    args = parser.parse_args()

    print(f"[fetch-book] baixando {args.url}", file=sys.stderr)
    try:
        html = fetch(args.url)
    except urllib.error.URLError as e:
        sys.exit(f"ERRO ao baixar: {e}")

    print(f"[fetch-book] {len(html)} bytes baixados, extraindo markdown...", file=sys.stderr)
    md = html_to_markdown(html)
    if len(md) > args.max_chars:
        md = md[:args.max_chars] + "\n\n[... truncado em --max-chars ...]\n"

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    header = []
    if args.titulo:
        header.append(f"# {args.titulo}\n")
    header.append(f"> Fonte: {args.url}\n> Baixado por scripts/fetch-book.py\n")
    out_path.write_text("\n".join(header) + "\n" + md, encoding="utf-8")
    print(f"[fetch-book] gravado em {out_path} ({len(md)} chars)", file=sys.stderr)


if __name__ == "__main__":
    main()
