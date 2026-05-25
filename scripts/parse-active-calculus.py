#!/usr/bin/env python3
"""
Active Calculus section parser — second concrete piece of the deterministic
re-sourcing pipeline (after parse-openstax.py).

Active Calculus by Matt Boelkins is published as PreTeXt-generated HTML at
https://activecalculus.org/single/ — each section lives at a URL of the
form `sec-<chapter>-<section>-<topic>.html`. Exercises are wrapped in
`<article class="exercise">` blocks at the end of each section.

Emits one JSONL row per exercise:

    {
      "source_id": "active-calculus/single",
      "section_number": "1.2",
      "section_title": "The notion of limit",
      "section_url": "https://activecalculus.org/single/sec-1-2-lim.html",
      "exercise_id": "1",
      "statement": "Use the figure below ...",
      "license": "CC-BY-NC-SA 4.0"
    }

Usage:
    # all 44 sections (auto-discovered from frontmatter)
    scripts/parse-active-calculus.py --all > out.jsonl

    # single section
    scripts/parse-active-calculus.py URL [URL ...] > out.jsonl
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from dataclasses import dataclass, asdict
from typing import Iterable
from urllib.parse import urljoin

try:
    import requests
    from bs4 import BeautifulSoup, Tag
except ImportError as exc:
    sys.exit(
        f"error: missing dependency ({exc}). "
        f"Run: pip install beautifulsoup4 requests"
    )

BASE = "https://activecalculus.org/single/"
FRONTMATTER = BASE + "frontmatter.html"
LICENSE = "CC-BY-NC-SA 4.0"
USER_AGENT = (
    "ClubeDaMatematica-Parser/0.1 "
    "(+https://github.com/leonardochalhoub/Clube-da-Matematica)"
)

# URL slug: "sec-<chapter>-<section>-<topic>.html"
SLUG_RE = re.compile(r"^sec-(\d+)-(\d+)-([a-z-]+)\.html$")
# Cleanup patterns inside exercise body text.
LINK_GLYPH = re.compile(r"\s*🔗\s*")
ACTIVATE_RE = re.compile(r"\bActivate\b\s*", re.IGNORECASE)
# Trailing form-field labels like "Limit:", "Answer:", etc., that follow
# the actual question (PreTeXt renders WeBWorK interactive widgets).
TRAILING_FIELDS_RE = re.compile(
    r"\s*\b(Limit|Answer|Value|Result|Slope|Solution)\s*:\s*$"
)


@dataclass(frozen=True)
class Exercise:
    source_id: str
    section_number: str
    section_title: str
    section_url: str
    exercise_id: str
    statement: str
    license: str


def fetch(url: str, *, timeout: float = 30.0) -> str:
    resp = requests.get(
        url, headers={"User-Agent": USER_AGENT}, timeout=timeout
    )
    resp.raise_for_status()
    # AC pages don't declare a charset in headers; default is latin-1 which
    # mangles the 🔗 glyphs and any non-ASCII math. Force UTF-8.
    resp.encoding = "utf-8"
    return resp.text


def discover_all_section_urls() -> list[str]:
    """Pull every numbered-section URL from the frontmatter page."""
    html = fetch(FRONTMATTER)
    soup = BeautifulSoup(html, "html.parser")
    urls: list[str] = []
    seen: set[str] = set()
    for a in soup.find_all("a", href=True):
        href = a["href"].split("#")[0].split("?")[0]
        if SLUG_RE.match(href):
            full = urljoin(BASE, href)
            if full not in seen:
                seen.add(full)
                urls.append(full)
    # Sort by (chapter, section) numerically
    def key(u: str) -> tuple[int, int]:
        slug = u.rsplit("/", 1)[-1]
        m = SLUG_RE.match(slug)
        return (int(m.group(1)), int(m.group(2))) if m else (999, 999)
    urls.sort(key=key)
    return urls


def parse_section(url: str, html: str) -> Iterable[Exercise]:
    soup = BeautifulSoup(html, "html.parser")
    slug = url.rsplit("/", 1)[-1]
    m = SLUG_RE.match(slug)
    if not m:
        return
    section_number = f"{m.group(1)}.{m.group(2)}"
    section_title = _section_title(soup, section_number)

    # Locate the "Exercises" subsection — usually <section class="exercises">.
    ex_section = soup.find("section", class_="exercises")
    if ex_section is None:
        return

    # Each exercise is an <article class="exercise">.
    for art in ex_section.find_all("article", class_="exercise"):
        number, statement = _split_exercise(art)
        if not statement:
            continue
        yield Exercise(
            source_id="active-calculus/single",
            section_number=section_number,
            section_title=section_title,
            section_url=url,
            exercise_id=number,
            statement=statement,
            license=LICENSE,
        )


def _section_title(soup, section_number):
    """Pull the section title from <section class='section'> first heading."""
    sec = soup.find("section", class_="section")
    if sec is None:
        return ""
    h = sec.find(["h1", "h2", "h3"])
    if h is None:
        return ""
    # PreTeXt renders headings like "Section1.2The notion of limit" with the
    # number glued to the title (no separator). Strip the "Section<num>" prefix.
    txt = _clean_text(h)
    prefix_re = re.compile(
        r"^(?:Section|Subsection)?\s*" + re.escape(section_number) + r"\s*"
    )
    return prefix_re.sub("", txt).strip()


def _split_exercise(art: Tag) -> tuple[str, str]:
    """
    Active Calculus exercises start with an h4/h5 carrying the visible
    number ("1.") and then the body text follows in <p>/<div> children.
    """
    # Number
    head = art.find(["h4", "h5", "h6"])
    if head:
        head_txt = _clean_text(head).rstrip(".").strip()
        number = head_txt
        head.extract()
    else:
        number = ""

    # Body text. Strip "Activate", 🔗 glyphs, and trailing widget labels.
    body = _clean_text(art)
    body = ACTIVATE_RE.sub("", body)
    body = LINK_GLYPH.sub(" ", body)
    # Drop trailing "Limit:", "Answer:", etc. — appear repeated for multi-part
    # WeBWorK exercises with (a)(b)(c) sub-questions.
    body = re.sub(
        r"\s*\b(Limit|Answer|Value|Result|Slope|Solution|Mass|Velocity|Position|Concentration)\b\s*:\s*",
        " ",
        body,
    )
    body = re.sub(r"\s+", " ", body).strip()
    # Strip a leading "<N> ." duplicate of the number we extracted.
    body = re.sub(r"^\d+\s*\.\s*", "", body, count=1)
    return number, body


def _clean_text(el: Tag) -> str:
    return re.sub(r"\s+", " ", el.get_text(" ", strip=True)).strip()


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument(
        "urls",
        nargs="*",
        help="Section URLs (or use --all to crawl every section).",
    )
    p.add_argument(
        "--all",
        action="store_true",
        help="Discover and parse every section from the AC frontmatter.",
    )
    p.add_argument(
        "--sleep",
        type=float,
        default=0.75,
        help="Seconds between requests (default: 0.75).",
    )
    return p.parse_args()


def main() -> int:
    args = parse_args()
    urls = list(args.urls)
    if args.all:
        discovered = discover_all_section_urls()
        print(
            f"discovered {len(discovered)} sections from frontmatter",
            file=sys.stderr,
        )
        urls.extend(discovered)
    if not urls:
        sys.exit("error: provide URLs or --all.")

    total = 0
    for i, url in enumerate(urls):
        if i > 0:
            time.sleep(args.sleep)
        try:
            html = fetch(url)
        except Exception as exc:
            print(f"warn: failed to fetch {url}: {exc}", file=sys.stderr)
            continue
        count = 0
        for ex in parse_section(url, html):
            json.dump(asdict(ex), sys.stdout, ensure_ascii=False)
            sys.stdout.write("\n")
            count += 1
        print(f"  {url} → {count} exercises", file=sys.stderr)
        total += count
    print(
        f"total: {total} exercises across {len(urls)} sections",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
