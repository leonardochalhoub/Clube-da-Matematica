#!/usr/bin/env python3
"""
OpenStax section parser — first concrete piece of the deterministic
re-sourcing pipeline described in docs/sources-revalidation.md.

Given an OpenStax section URL like:
    https://openstax.org/books/college-algebra-2e/pages/1-1-real-numbers-algebra-essentials

emits one JSONL row per exercise in the "Section Exercises" block:

    {
      "source_id": "openstax/college-algebra-2e",
      "section_number": "1.1",
      "section_title": "Real Numbers: Algebra Essentials",
      "section_url": "https://openstax.org/books/...",
      "category": "Verbal",
      "exercise_id": "1",
      "statement": "Is sqrt(2) an example of a rational terminating ...",
      "license": "CC-BY 4.0"
    }

Why this exists: the corpus's previous `fonte={{ ... exercicio: "ex. N" }}`
citations were hallucinated. With this index, an authoring CLI can
pick a real exercise from the right section and emit a `fonte` block
that's verifiable by construction.

Usage:
    # Single section, JSONL to stdout
    scripts/parse-openstax.py URL [URL ...] > out.jsonl

    # Batch from a urls.txt (one URL per line, # for comments)
    scripts/parse-openstax.py --batch urls.txt > out.jsonl

Dependencies: bs4, requests. Install via `pip install beautifulsoup4 requests`.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from dataclasses import dataclass, asdict
from typing import Iterable
from urllib.parse import urlparse

try:
    import requests
    from bs4 import BeautifulSoup, Tag
except ImportError as exc:
    sys.exit(
        f"error: missing dependency ({exc}). "
        f"Run: pip install beautifulsoup4 requests"
    )

# OpenStax page URLs look like:
#   https://openstax.org/books/<book-slug>/pages/<section-slug>
# where section-slug typically starts with "1-1-...", "2-3-...", etc.
SECTION_NUMBER_RE = re.compile(r"^(\d+)-(\d+)-")
USER_AGENT = (
    "ClubeDaMatematica-Parser/0.1 "
    "(+https://github.com/leonardochalhoub/Clube-da-Matematica)"
)
# OpenStax-wide books are CC-BY (algebra, statistics) or CC-BY-NC-SA
# (calculus). Caller passes --license to override if needed; default is
# the most restrictive interpretation so we never over-claim.
DEFAULT_LICENSE = "CC-BY-NC-SA"
# Some books are CC-BY. Map by book-slug when we know.
LICENSE_BY_BOOK = {
    "college-algebra-2e": "CC-BY 4.0",
    "statistics": "CC-BY 4.0",
    "introductory-statistics-2e": "CC-BY 4.0",
}


@dataclass(frozen=True)
class Exercise:
    source_id: str
    section_number: str
    section_title: str
    section_url: str
    category: str | None
    exercise_id: str
    statement: str
    license: str


def fetch(url: str, *, timeout: float = 30.0) -> str:
    resp = requests.get(
        url, headers={"User-Agent": USER_AGENT}, timeout=timeout
    )
    resp.raise_for_status()
    # OpenStax doesn't declare charset; requests defaults to ISO-8859-1
    # which mangles Unicode math glyphs (−, ÷, ×, π, etc.). Force UTF-8.
    resp.encoding = "utf-8"
    return resp.text


def parse_section(url: str, html: str) -> Iterable[Exercise]:
    soup = BeautifulSoup(html, "html.parser")

    book_slug, section_slug = _parse_url(url)
    section_number = _section_number_from_slug(section_slug)
    section_title = _section_title(soup, section_number)
    license_str = LICENSE_BY_BOOK.get(book_slug, DEFAULT_LICENSE)

    container = _find_section_exercises_container(soup)
    if container is None:
        return

    # Walk only DIRECT children of the container so we can spot top-level
    # `<p>` group-introduction paragraphs (which sit between exercises and
    # provide the "For each function below, ..." preamble that's shared
    # across the next several exercises). Without this, multi-part problem
    # groups parse as context-less fragments like "lim x → a f(x) = N".
    current_category: str | None = None
    current_group_intro: str | None = None
    # OpenStax wraps exercise lists in nested <div> structures; flatten
    # them by walking descendants but only acting on direct interest tags.
    for el in container.descendants:
        if not isinstance(el, Tag):
            continue
        if el.name == "h4":
            current_category = _clean_text(el)
            current_group_intro = None  # a new category resets the group
            continue
        # A `<p>` that lives outside any exercise block and starts with
        # phrasing like "In the following...", "For each...", "For the
        # following exercises" is a multi-exercise group preamble.
        if el.name == "p" and not el.find_parent(attrs={"data-type": "exercise"}):
            txt = _clean_text(el)
            if _looks_like_group_intro(txt):
                current_group_intro = txt
            continue
        if el.get("data-type") == "exercise":
            problem = el.find(attrs={"data-type": "problem"})
            if problem is None:
                continue
            number, statement = _split_number_and_statement(problem)
            if not statement:
                continue
            # Prepend the group intro so the LLM downstream has the
            # context "Verify the limit using ε-δ" rather than just
            # "lim x→a f(x) = N".
            full_statement = (
                f"{current_group_intro} {statement}"
                if current_group_intro
                else statement
            )
            yield Exercise(
                source_id=f"openstax/{book_slug}",
                section_number=section_number,
                section_title=section_title,
                section_url=url,
                category=current_category,
                exercise_id=number,
                statement=full_statement,
                license=license_str,
            )


# Phrases that mark a `<p>` as a multi-exercise group preamble.
GROUP_INTRO_PATTERNS = [
    re.compile(r"^(?:In|For)\s+the\s+following\s+exercises", re.IGNORECASE),
    re.compile(r"^For\s+each\b", re.IGNORECASE),
    re.compile(r"^(?:Use|Using)\s+the\s+(?:above|following|graph|table|figure)", re.IGNORECASE),
    re.compile(r"\bSuppose\s+that\b", re.IGNORECASE),
    re.compile(r"\bConsider\s+the\b", re.IGNORECASE),
]


def _looks_like_group_intro(txt: str) -> bool:
    if len(txt) < 15 or len(txt) > 500:
        return False
    return any(p.search(txt) for p in GROUP_INTRO_PATTERNS)


def _parse_url(url: str) -> tuple[str, str]:
    path = urlparse(url).path.strip("/")
    parts = path.split("/")
    # Expect: books/<book-slug>/pages/<section-slug>
    if len(parts) < 4 or parts[0] != "books" or parts[2] != "pages":
        raise ValueError(f"not an OpenStax section URL: {url}")
    return parts[1], parts[3]


def _section_number_from_slug(slug: str) -> str:
    m = SECTION_NUMBER_RE.match(slug)
    if not m:
        # Some intro pages don't have a chapter-section number — pass it through.
        return slug
    return f"{m.group(1)}.{m.group(2)}"


def _section_title(soup: BeautifulSoup, section_number: str) -> str:
    """Pull the section title from the page h2 (e.g. '1.1 Real Numbers')."""
    h2 = soup.find("h2")
    if h2 is None:
        return ""
    title = _clean_text(h2)
    # H2 commonly starts with "1.1Real Numbers..." (no space) — strip the
    # number prefix so we get just the title.
    prefix = section_number.replace(" ", "")
    if title.startswith(prefix):
        title = title[len(prefix):].lstrip()
    # Also handle "1.1 Real Numbers..." with space.
    elif title.startswith(f"{section_number} "):
        title = title[len(section_number) + 1:]
    return title


def _find_section_exercises_container(soup: BeautifulSoup) -> Tag | None:
    # OpenStax heading text varies by book:
    #   College Algebra 2e:    "1.1 Section Exercises"
    #   Calculus Volume 1/2/3: "Section 2.2 Exercises"
    # Match either by searching for both words anywhere in the heading.
    def is_section_ex_heading(h: Tag) -> bool:
        txt = h.get_text().lower()
        return "section" in txt and "exercises" in txt
    heading = next(
        (h for h in soup.find_all(["h2", "h3", "h4"]) if is_section_ex_heading(h)),
        None,
    )
    if heading is None:
        return None
    return heading.find_parent("div", class_="os-section-exercises-container")


# Trailing-number pattern: OpenStax wraps display math in <math> + a
# visual span, producing duplicated text like "3 4 3 4". Collapse runs
# of "X Y X Y" → "X Y" by detecting symmetric repetition.
def _split_number_and_statement(problem: Tag) -> tuple[str, str]:
    text = _clean_text(problem)
    # Exercise format: "<N> . <body>"
    m = re.match(r"^(\d+(?:\.\d+)?)\s*\.\s*(.*)$", text, flags=re.DOTALL)
    if not m:
        return "", text
    number = m.group(1)
    body = _collapse_doubled_math(m.group(2))
    return number, body


def _clean_text(el: Tag) -> str:
    # Use ' ' separator so adjacent inline elements don't fuse.
    return re.sub(r"\s+", " ", el.get_text(" ", strip=True)).strip()


def _collapse_doubled_math(text: str) -> str:
    """
    OpenStax renders inline math twice (MathML + visual fallback), so
    extracted text looks like '6 ÷ 2 − ( 81 ÷ 3 2 ) 6 ÷ 2 − ( 81 ÷ 3 2 )'.
    Detect a tail that exactly repeats a prefix (separated by a space)
    and drop the tail.
    """
    s = text.strip()
    if not s:
        return s
    # If the string is "<X> <X>" where <X> is identical, collapse.
    mid = len(s) // 2
    # Walk a small window around the midpoint looking for a split that
    # makes left == right.
    for split in range(mid - 5, mid + 6):
        if 1 <= split < len(s):
            left = s[:split].strip()
            right = s[split:].strip()
            if left and left == right:
                return left
    return s


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument(
        "urls",
        nargs="*",
        help="OpenStax section URLs (or use --batch / --crawl).",
    )
    p.add_argument(
        "--batch",
        metavar="FILE",
        help="File with one URL per line (# = comment).",
    )
    p.add_argument(
        "--crawl",
        metavar="START_URL",
        help=(
            "Crawl forward from START_URL following sibling section links. "
            "Each OpenStax section page only links to ±1 sibling, so the "
            "crawler walks chapter-section pairs until 404 or a numbering jump."
        ),
    )
    p.add_argument(
        "--book",
        metavar="SLUG",
        help=(
            "Discover every numbered section in a book by scraping the "
            "embedded TOC JSON from the book's preface page. "
            "Example: --book college-algebra-2e"
        ),
    )
    p.add_argument(
        "--sleep",
        type=float,
        default=1.0,
        help="Seconds to wait between requests (default: 1.0).",
    )
    return p.parse_args()


def crawl_forward(start_url: str) -> list[str]:
    """
    Follow the "next section" link from each page until 404 or no link found.
    Returns the ordered list of URLs visited (including start_url).
    """
    seen: list[str] = [start_url]
    seen_set = {start_url}
    current = start_url
    book_slug, _ = _parse_url(current)
    while True:
        try:
            html = fetch(current)
        except Exception:
            break
        soup = BeautifulSoup(html, "html.parser")
        # Find a sibling-section link with a slug numerically > the current one
        cur_slug = current.rsplit("/", 1)[-1]
        cur_num = _slug_to_num(cur_slug)
        next_url: str | None = None
        for a in soup.find_all("a", href=True):
            href = a["href"].split("?")[0].split("#")[0]
            # normalize to slug
            if "/pages/" in href:
                slug = href.split("/pages/")[1]
            else:
                slug = href.lstrip("/")
            if not SECTION_NUMBER_RE.match(slug):
                continue
            slug_num = _slug_to_num(slug)
            if slug_num > cur_num:
                next_url = f"https://openstax.org/books/{book_slug}/pages/{slug}"
                break
        if next_url is None or next_url in seen_set:
            break
        seen.append(next_url)
        seen_set.add(next_url)
        current = next_url
        time.sleep(0.5)
    return seen


def _slug_to_num(slug: str) -> tuple[int, int]:
    m = SECTION_NUMBER_RE.match(slug)
    if not m:
        return (0, 0)
    return (int(m.group(1)), int(m.group(2)))


# OpenStax book pages embed the full table of contents as a chunk of JSON
# in the page HTML. Each numbered section appears as `"slug":"1-1-real..."`.
SLUG_JSON_RE = re.compile(r'"slug":"(\d+-\d+-[a-z0-9-]+)"')


def discover_book_sections(book_slug: str) -> list[str]:
    """
    Scrape the preface page of an OpenStax book and extract every
    numbered-section slug from the embedded TOC JSON.
    """
    preface_url = f"https://openstax.org/books/{book_slug}/pages/preface"
    html = fetch(preface_url)
    slugs = sorted(set(SLUG_JSON_RE.findall(html)), key=_slug_to_num)
    return [
        f"https://openstax.org/books/{book_slug}/pages/{s}" for s in slugs
    ]


def collect_urls(args: argparse.Namespace) -> list[str]:
    urls = list(args.urls)
    if args.batch:
        with open(args.batch, encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if line and not line.startswith("#"):
                    urls.append(line)
    if args.crawl:
        discovered = crawl_forward(args.crawl)
        print(
            f"crawled {len(discovered)} sections starting from {args.crawl}",
            file=sys.stderr,
        )
        urls.extend(discovered)
    if args.book:
        discovered = discover_book_sections(args.book)
        print(
            f"discovered {len(discovered)} sections in book '{args.book}'",
            file=sys.stderr,
        )
        urls.extend(discovered)
    if not urls:
        sys.exit(
            "error: provide at least one URL "
            "(or --batch FILE / --crawl URL / --book SLUG)."
        )
    return urls


def main() -> int:
    args = parse_args()
    urls = collect_urls(args)

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
        print(
            f"  {url} → {count} exercises", file=sys.stderr
        )
        total += count
    print(f"total: {total} exercises across {len(urls)} sections", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
