#!/usr/bin/env python3
"""
Aggregate per-book parser outputs into a single normalised corpus JSONL.

Reads every `livros/_parsed/<source>.jsonl` produced by the per-book
parsers (parse-openstax.py, parse-active-calculus.py, ...) and writes
`livros/_parsed/_corpus.jsonl` with one row per exercise, augmented with:

- `topic_tags`: keywords extracted from the section_title (lowercased,
  stop-words removed). Used downstream by the authoring CLI to match
  exercises to a lesson's topic.
- `statement_len`: character length of the statement (cheap proxy for
  difficulty / formality).

Also emits `livros/_parsed/_index.json` with per-source totals so the
owner can audit coverage at a glance.

Usage:
    scripts/aggregate-corpus.py
"""
from __future__ import annotations

import json
import re
import sys
from collections import Counter
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
PARSED_DIR = REPO_ROOT / "livros" / "_parsed"
CORPUS_OUT = PARSED_DIR / "_corpus.jsonl"
INDEX_OUT = PARSED_DIR / "_index.json"

# Words to drop from topic_tags — generic English / math glue that
# doesn't help with topic discrimination.
STOP_WORDS = {
    "the", "a", "an", "of", "and", "or", "to", "in", "on", "with",
    "from", "for", "by", "as", "at", "is", "are", "be", "this", "that",
    "introduction", "essentials", "section", "exercises", "review",
    "chapter", "applications", "more", "and", "using", "their",
}


def topic_tags_from_title(title: str) -> list[str]:
    """Lowercase tokenize, drop stop-words and very short tokens."""
    tokens = re.findall(r"[a-zA-Z]+", (title or "").lower())
    return [
        t for t in tokens
        if len(t) >= 3 and t not in STOP_WORDS
    ]


def main() -> int:
    if not PARSED_DIR.is_dir():
        sys.exit(f"error: {PARSED_DIR} not found — run parsers first.")

    sources = sorted(p for p in PARSED_DIR.glob("*.jsonl") if not p.name.startswith("_"))
    if not sources:
        sys.exit(
            f"error: no parser outputs in {PARSED_DIR}. "
            "Run scripts/parse-openstax.py and scripts/parse-active-calculus.py first."
        )

    per_source: dict[str, int] = {}
    per_topic: Counter[str] = Counter()
    total = 0
    skipped_short = 0

    with CORPUS_OUT.open("w", encoding="utf-8") as out:
        for src in sources:
            count = 0
            with src.open(encoding="utf-8") as fh:
                for line in fh:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        row = json.loads(line)
                    except json.JSONDecodeError:
                        continue
                    statement = (row.get("statement") or "").strip()
                    if len(statement) < 20:
                        skipped_short += 1
                        continue
                    row["topic_tags"] = topic_tags_from_title(
                        row.get("section_title", "")
                    )
                    row["statement_len"] = len(statement)
                    for tag in row["topic_tags"]:
                        per_topic[tag] += 1
                    json.dump(row, out, ensure_ascii=False)
                    out.write("\n")
                    count += 1
                    total += 1
            per_source[src.stem] = count
            print(f"  {src.name}: {count} exercises", file=sys.stderr)

    index = {
        "total_exercises": total,
        "skipped_short": skipped_short,
        "per_source": per_source,
        "top_topics": per_topic.most_common(40),
    }
    INDEX_OUT.write_text(
        json.dumps(index, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(
        f"\nwrote {total} exercises to {CORPUS_OUT}\n"
        f"index summary at {INDEX_OUT}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
