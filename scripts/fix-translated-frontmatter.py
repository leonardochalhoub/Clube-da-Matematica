#!/usr/bin/env python3
"""
fix-translated-frontmatter.py — restore PT-BR slug-like frontmatter fields in
translated MDX files. The translator occasionally translates fields it shouldn't
(slug, subcategoria, prerrequisitos, tags, autores). This script reads the
source PT-BR file and overwrites those fields in the translated file.

Translatable fields kept: titulo, descricao, usadoEm, atualizadoEm.
All other fields are copied verbatim from source.

USAGE:
  python3 scripts/fix-translated-frontmatter.py             # fix all en-US (and other locales)
  python3 scripts/fix-translated-frontmatter.py --only en-US
  python3 scripts/fix-translated-frontmatter.py --files content/i18n/en-US/aulas/ano-2/trim-6/licao-51-derivada-definicao.mdx
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE_ROOT = ROOT / "content"
I18N_ROOT = ROOT / "content" / "i18n"

# Fields that should NEVER be translated (always copy from source).
PRESERVE_FIELDS = {
    "slug", "categoria", "subcategoria", "ordem", "publicado",
    "tags", "prerrequisitos", "autores", "versao",
}
# Fields that ARE translated (keep target's value).
TRANSLATE_FIELDS = {"titulo", "descricao", "usadoEm", "atualizadoEm"}


def split_frontmatter(text: str) -> tuple[list[str], str]:
    """Return (frontmatter_lines, body). frontmatter_lines excludes the --- delimiters."""
    if not text.startswith("---"):
        raise ValueError("missing frontmatter opening ---")
    end = text.find("\n---", 3)
    if end == -1:
        raise ValueError("missing frontmatter closing ---")
    header = text[3:end].lstrip("\n").rstrip()
    body = text[end + 4:]
    return header.split("\n"), body


def parse_frontmatter_keys(lines: list[str]) -> dict[str, str]:
    """Naive YAML parser: capture top-level `key: value` and `key:` multi-line blocks.
    Returns a dict of key -> raw value string (everything after the colon, preserving
    whitespace and brackets)."""
    result: dict[str, str] = {}
    current_key: str | None = None
    current_value_lines: list[str] = []
    for line in lines:
        if line.startswith(" ") or line.startswith("\t"):
            # Continuation of multi-line value.
            if current_key is not None:
                current_value_lines.append(line)
            continue
        if ":" in line:
            if current_key is not None:
                result[current_key] = "\n".join(current_value_lines)
            key, _, value = line.partition(":")
            current_key = key.strip()
            current_value_lines = [value.lstrip()]
    if current_key is not None:
        result[current_key] = "\n".join(current_value_lines)
    return result


def rebuild_frontmatter(source_kv: dict[str, str], target_kv: dict[str, str],
                       source_order: list[str]) -> str:
    """Build the new frontmatter using source's key order. For PRESERVE_FIELDS take
    source value; for TRANSLATE_FIELDS take target value (fallback to source).
    For any other field, prefer target if present (it might be a translatable extra),
    else source."""
    out_lines: list[str] = []
    seen: set[str] = set()
    for key in source_order:
        if key in seen:
            continue
        seen.add(key)
        if key in PRESERVE_FIELDS:
            value = source_kv.get(key, "")
        elif key in TRANSLATE_FIELDS:
            value = target_kv.get(key, source_kv.get(key, ""))
        else:
            value = target_kv.get(key, source_kv.get(key, ""))
        out_lines.append(f"{key}: {value}" if value else f"{key}:")
    # Any extra keys present only in target (e.g. translator-added) get appended.
    for key, value in target_kv.items():
        if key not in seen:
            out_lines.append(f"{key}: {value}")
    return "\n".join(out_lines)


def source_path_for(translated: Path) -> Path | None:
    """Map content/i18n/<locale>/<...rest> to content/<...rest>."""
    try:
        rel = translated.relative_to(I18N_ROOT)
    except ValueError:
        return None
    parts = rel.parts
    if len(parts) < 2:
        return None
    src = SOURCE_ROOT.joinpath(*parts[1:])
    return src if src.exists() else None


def fix_file(translated: Path, *, dry_run: bool = False) -> tuple[bool, str]:
    source = source_path_for(translated)
    if source is None:
        return False, "no matching source"
    src_text = source.read_text(encoding="utf-8")
    tgt_text = translated.read_text(encoding="utf-8")
    try:
        src_lines, _ = split_frontmatter(src_text)
        tgt_lines, tgt_body = split_frontmatter(tgt_text)
    except ValueError as e:
        return False, f"frontmatter parse error: {e}"
    src_kv = parse_frontmatter_keys(src_lines)
    tgt_kv = parse_frontmatter_keys(tgt_lines)
    src_order = [line.partition(":")[0].strip() for line in src_lines
                 if line and not line.startswith((" ", "\t")) and ":" in line]
    new_fm = rebuild_frontmatter(src_kv, tgt_kv, src_order)
    new_text = f"---\n{new_fm}\n---{tgt_body}"
    if new_text == tgt_text:
        return False, "unchanged"
    if dry_run:
        return True, "would-update"
    translated.write_text(new_text, encoding="utf-8")
    return True, "updated"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="Only this locale dir (e.g. en-US)")
    ap.add_argument("--files", nargs="+", help="Specific files to fix")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if args.files:
        targets = [Path(p).resolve() for p in args.files]
    else:
        if not I18N_ROOT.exists():
            print(f"no {I18N_ROOT}", file=sys.stderr)
            return 1
        locale_dirs = ([I18N_ROOT / args.only] if args.only
                       else sorted(p for p in I18N_ROOT.iterdir() if p.is_dir()))
        targets = []
        for ld in locale_dirs:
            targets.extend(sorted(ld.rglob("*.mdx")))

    updated = 0
    skipped = 0
    errors = 0
    for tgt in targets:
        try:
            changed, reason = fix_file(tgt, dry_run=args.dry_run)
        except Exception as e:  # noqa: BLE001
            errors += 1
            print(f"[ERR] {tgt}: {e}")
            continue
        if changed:
            updated += 1
            print(f"[ok ] {tgt.relative_to(ROOT)} → {reason}")
        else:
            skipped += 1
    print(f"\n{updated} updated, {skipped} skipped, {errors} errors "
          f"(of {len(targets)} files)")
    return 0 if errors == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
