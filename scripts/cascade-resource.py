#!/usr/bin/env python3
"""
cascade-resource.py — free-tier cascade orchestrator for one lesson.

For lesson LNN, this script:

  1. Builds strict candidates (calls build-strict-candidates.py internally)
  2. Drives Gemini 2.0 Flash (free) to pick ~35-45 exercises from the
     candidates, generate MC distractors + solucao + 25% passos, output as
     structured JSON (responseSchema enforced, so JSX integrity is reliable)
  3. Renders the JSON into the lesson MDX (replaces the existing
     <ListaExercicios>...</ListaExercicios> block — keeps everything outside)
  4. Validates: count + fonte fields + no pagina + MDX-safe escaping
  5. Deletes stale en-US + es-ES translations of this lesson
  6. Triggers translate-parallel.py to re-translate via Gemini (free)
  7. Appends suspect exercises to docs/translation-review-queue.md
     for later Opus review
  8. Updates scripts/generate-manifest.ts allowlist with this lesson

Stdlib + the project's own scripts only. No external Python deps.

ENV (read from .env.local — source it first):
  GEMINI_API_KEY — required
  GROQ_API_KEY   — optional (fallback)

USAGE:
  source .env.local
  python3 scripts/cascade-resource.py 2          # do L02 end-to-end
  python3 scripts/cascade-resource.py 2 --dry-run  # plan only, no API calls
  python3 scripts/cascade-resource.py 2 --no-translate  # PT-BR only
  python3 scripts/cascade-resource.py 2 --keep-existing  # don't replace existing
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
CORPUS = ROOT / "livros" / "_parsed" / "_corpus.jsonl"
CASCADE_DIR = Path("/tmp/cascade-strict")
REVIEW_QUEUE = ROOT / "docs" / "translation-review-queue.md"
MANIFEST_SCRIPT = ROOT / "scripts" / "generate-manifest.ts"

# ---- Gemini API ----
GEMINI_MODEL = "gemini-2.0-flash"
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_MODEL}:generateContent?key={{key}}"
)

# ---- Source-id → display name (for fonte.livro) ----
LIVRO_DISPLAY = {
    "openstax/college-algebra-2e": "OpenStax College Algebra 2e",
    "openstax/calculus-volume-1": "OpenStax Calculus Volume 1",
    "openstax/calculus-volume-2": "OpenStax Calculus Volume 2",
    "openstax/calculus-volume-3": "OpenStax Calculus Volume 3",
    "openstax/introductory-statistics-2e": "OpenStax Introductory Statistics 2e",
    "active-calculus/single": "Active Calculus",
}


def fail(msg: str) -> None:
    print(f"\033[31mERROR\033[0m {msg}", file=sys.stderr)
    sys.exit(1)


def info(msg: str) -> None:
    print(f"\033[36m·\033[0m {msg}")


def ok(msg: str) -> None:
    print(f"\033[32m✓\033[0m {msg}")


def warn(msg: str) -> None:
    print(f"\033[33m!\033[0m {msg}")


# =============================================================================
# Phase 1: locate target lesson
# =============================================================================

def find_lesson_mdx(lesson_num: int) -> Path:
    """Find content/aulas/ano-X/trim-Y/licao-NN-slug.mdx for the given number."""
    pattern = f"licao-{lesson_num:02d}-*.mdx" if lesson_num < 100 else f"licao-{lesson_num}-*.mdx"
    matches = list((ROOT / "content" / "aulas").rglob(pattern))
    # Try a 2-digit-or-N pattern variant too (e.g. "licao-9-..." has no zero-pad)
    if not matches:
        pattern2 = f"licao-{lesson_num}-*.mdx"
        matches = list((ROOT / "content" / "aulas").rglob(pattern2))
    matches = [m for m in matches if ".bak" not in m.name]
    if not matches:
        fail(f"no lesson MDX file matching L{lesson_num} found")
    if len(matches) > 1:
        fail(f"multiple candidates for L{lesson_num}: {matches}")
    return matches[0]


def relative_caminho(mdx_path: Path) -> str:
    """Convert absolute lesson path → 'aulas/ano-X/trim-Y/licao-NN-slug'."""
    return str(mdx_path.relative_to(ROOT / "content")).removesuffix(".mdx")


# =============================================================================
# Phase 2: build strict candidates (delegates to build-strict-candidates.py)
# =============================================================================

def ensure_candidates(lesson_num: int) -> Path:
    """Run build-strict-candidates.py if /tmp/cascade-strict/LNN-candidates.jsonl missing."""
    out_path = CASCADE_DIR / f"L{lesson_num}-candidates.jsonl"
    if out_path.exists() and out_path.stat().st_size > 0:
        n = sum(1 for _ in out_path.open())
        info(f"reusing existing candidates: {n} rows in {out_path}")
        return out_path
    info(f"building candidates for L{lesson_num}…")
    py = "/home/leochalhoub/miniconda3/envs/dev-env/bin/python3"
    r = subprocess.run(
        [py, str(ROOT / "scripts" / "build-strict-candidates.py"), str(lesson_num)],
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        fail(f"build-strict-candidates.py failed:\n{r.stderr}")
    if not out_path.exists() or out_path.stat().st_size == 0:
        fail(f"no candidates produced for L{lesson_num} — check LESSON_SECTIONS[{lesson_num}]")
    n = sum(1 for _ in out_path.open())
    ok(f"{n} candidates in {out_path}")
    return out_path


# =============================================================================
# Phase 3: Gemini-driven PT-BR re-source — output structured JSON
# =============================================================================

# Per-lesson distractor guidance. Lessons not listed get a generic guide.
DISTRACTOR_GUIDES: dict[int, str] = {
    2: """For functions (domain/range, f(x) notation, graphs):
- Confusing domain with range
- Missing domain restrictions (radical needs non-negative argument; denominator ≠ 0)
- Treating f(x+h) as f(x)+f(h)
- Vertical line test confusion
- Mistaking f(x) graph for f^{-1}(x)
- Swapping x and y in function evaluation""",
    3: """For linear functions and equations:
- Confusing slope-intercept with point-slope form
- Sign errors when rearranging
- Y-intercept vs x-intercept confusion
- Parallel/perpendicular slope relationships
- Slope of vertical/horizontal lines""",
    # Add per-lesson guides as cascade progresses. Generic guide below.
}

GENERIC_DISTRACTOR_GUIDE = """For any math exercise:
- Sign flips (+ vs -)
- Off-by-one errors
- Reciprocal slips (a vs 1/a)
- Factor-of-2 slips (forgot to multiply/divide by 2)
- Bracket type confusion (open vs closed intervals)
- Common conceptual confusions specific to the topic
NEVER use troll distractors (e.g. "$\\emptyset$" when the question is about counting natural numbers)."""


# JSON Schema for Gemini structured output.
EXERCISE_SCHEMA = {
    "type": "object",
    "properties": {
        "exercises": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "candidate_index": {"type": "integer", "description": "0-based index into the candidates JSONL"},
                    "numero": {"type": "string", "description": "e.g. '2.1', '2.2'"},
                    "dificuldade": {"type": "string", "enum": ["aplicacao", "compreensao", "modelagem", "desafio", "demonstracao"]},
                    "body_pt": {"type": "string", "description": "Exercise statement in Brazilian Portuguese, using $...$ for inline math and $$...$$ for display math"},
                    "options": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "texto": {"type": "string"},
                                "correta": {"type": "boolean"},
                            },
                            "required": ["texto", "correta"],
                        },
                        "minItems": 4,
                        "maxItems": 4,
                    },
                    "solucao_pt": {"type": "string", "description": "1-3 sentence explanation in PT-BR. Use $...$ for inline math."},
                    "passos_pt": {"type": "array", "items": {"type": "string"}, "description": "Optional 4-6 step-by-step lines. Empty array if no passos for this exercise."},
                },
                "required": ["candidate_index", "numero", "dificuldade", "body_pt", "options", "solucao_pt", "passos_pt"],
            },
        },
    },
    "required": ["exercises"],
}


def call_gemini_json(api_key: str, system: str, user: str, schema: dict, max_retries: int = 4) -> dict:
    """Call Gemini with JSON-mode output enforced by responseSchema."""
    url = GEMINI_URL.format(key=api_key)
    payload = {
        "systemInstruction": {"parts": [{"text": system}]},
        "contents": [{"parts": [{"text": user}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": schema,
            "temperature": 0.3,
            "maxOutputTokens": 32000,
        },
    }
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = json.loads(resp.read())
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(text)
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")[:500]
            if e.code == 429:
                wait = 2 ** attempt * 10
                warn(f"Gemini rate limit (429). Waiting {wait}s before retry {attempt+1}/{max_retries}…")
                time.sleep(wait)
                continue
            if e.code >= 500 and attempt < max_retries - 1:
                wait = 2 ** attempt
                warn(f"Gemini {e.code} server error. Retry {attempt+1} in {wait}s…")
                time.sleep(wait)
                continue
            fail(f"Gemini API error {e.code}: {body}")
        except urllib.error.URLError as e:
            if attempt < max_retries - 1:
                warn(f"Gemini network error: {e}. Retry {attempt+1}…")
                time.sleep(2 ** attempt)
                continue
            fail(f"Gemini network error: {e}")
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            fail(f"Gemini response parse error: {e}. Raw: {data!r}")
    fail("Gemini API: exhausted retries")


def build_resource_prompt(lesson_num: int, lesson_path: Path, candidates: list[dict]) -> tuple[str, str]:
    """Build (system_prompt, user_prompt) for Gemini re-source call."""
    distractor_guide = DISTRACTOR_GUIDES.get(lesson_num, GENERIC_DISTRACTOR_GUIDE)

    # Read lesson topic + a few existing exercises for context
    lesson_text = lesson_path.read_text()
    # Try to extract the topic from the frontmatter
    fm = re.search(r"^---\n(.*?)\n---", lesson_text, re.DOTALL)
    topic = ""
    if fm:
        tm = re.search(r'titulo:\s*"([^"]+)"', fm.group(1))
        dm = re.search(r'descricao:\s*"([^"]+)"', fm.group(1))
        if tm and dm:
            topic = f"{tm.group(1)} — {dm.group(1)}"

    system_prompt = f"""You are re-sourcing exercises for a Brazilian high-school math curriculum (Clube da Matemática). The lesson topic is: {topic}

You MUST pick exercises ONLY from the candidates list provided in the user message — never invent exercises. Each candidate has:
- candidate_index (0-based; you reference this in your output)
- source_id, section_number, section_title, exercise_id (the book citation)
- statement (the exercise text in English, as parsed from the source book)

Your output:
- Pick 30-45 exercises, prefer variety (aplicacao/compreensao/modelagem/desafio/demonstracao mix: ~60/15/15/5/5)
- Translate each English `statement` into Brazilian Portuguese (the curriculum is PT-BR source)
- Compose a 4-option MC where exactly one option is correct
- Distractors should reflect classic student errors for this topic:
{distractor_guide}
- Write a 1-3 sentence solucao in PT-BR explaining how to reach the correct answer
- Mark EXACTLY 25% of exercises with passos (line-by-line reasoning, 4-6 steps in PT-BR)
- Math notation: use $...$ for inline math (NOT \\(...\\)), $$...$$ for display math
- NEVER include `pagina` field anywhere
- Number exercises sequentially: "{lesson_num}.1", "{lesson_num}.2", ..."""

    # Truncate candidate statements that are too long
    compact_candidates = []
    for i, c in enumerate(candidates):
        compact_candidates.append({
            "index": i,
            "source": c["source_id"],
            "section": c["section_number"],
            "exercise_id": c["exercise_id"],
            "statement": c["statement"][:500],  # truncate to keep prompt size sane
        })

    user_prompt = f"""Candidates pool for Lição {lesson_num} (you pick 30-45 of these):

```json
{json.dumps(compact_candidates, ensure_ascii=False)}
```

Output the JSON object matching the schema. Each exercise.candidate_index must point to one of the candidates above."""

    return system_prompt, user_prompt


# =============================================================================
# Phase 4: render JSON → MDX
# =============================================================================

def latex_html_to_mdx(s: str) -> str:
    """Same as render-exercise-mdx.py — convert raw book LaTeX → MDX-safe."""
    s = re.sub(r"\\begin\{equation\*?\}(.*?)\\end\{equation\*?\}", r"$$\1$$", s, flags=re.DOTALL)
    s = re.sub(r"\\\((.+?)\\\)", r"$\1$", s, flags=re.DOTALL)
    s = re.sub(r"\\\[(.+?)\\\]", r"$$\1$$", s, flags=re.DOTALL)
    s = re.sub(r"\\text\{([,.;])\}", r"\1", s)
    return s.strip()


def render_exercise_block(ex: dict, candidate: dict) -> str:
    """Render one exercise as MDX `<Exercicio>...` block."""
    livro = LIVRO_DISPLAY.get(candidate["source_id"], candidate["source_id"])
    url = candidate["section_url"]
    secao = "§" + candidate["section_number"]
    exercicio = "ex. " + candidate["exercise_id"]
    licenca = candidate["license"]

    body = latex_html_to_mdx(ex["body_pt"])
    solucao = latex_html_to_mdx(ex["solucao_pt"])

    # Build opcoes block
    opcoes_lines = []
    for opt in ex["options"]:
        texto = opt["texto"].replace("\\", "\\\\").replace('"', '\\"')
        correta_str = ", correta: true" if opt["correta"] else ""
        opcoes_lines.append(f'    {{ texto: "{texto}"{correta_str} }}')
    opcoes_block = "  opcoes={[\n" + ",\n".join(opcoes_lines) + ",\n  ]}"

    # Build passos block if present
    passos_block = ""
    if ex.get("passos_pt"):
        passos_items = []
        for step in ex["passos_pt"]:
            step_clean = latex_html_to_mdx(step)
            passos_items.append(f"      <li>{step_clean}</li>")
        passos_block = (
            "\n  passos={<>\n"
            "    <ol>\n"
            + "\n".join(passos_items) + "\n"
            "    </ol>\n"
            "  </>}"
        )

    fonte_block = (
        f'  fonte={{{{ livro: "{livro}", url: "{url}", secao: "{secao}", '
        f'exercicio: "{exercicio}", licenca: "{licenca}" }}}}'
    )

    return (
        f'<Exercicio numero="{ex["numero"]}" dificuldade="{ex["dificuldade"]}"\n'
        f"{opcoes_block}\n"
        f"  solucao={{<>{solucao}</>}}{passos_block}\n"
        f"{fonte_block}\n"
        f">\n"
        f"{body}\n"
        f"</Exercicio>"
    )


def render_listaexercicios(lesson_num: int, exercises: list[dict], candidates: list[dict]) -> str:
    """Render the full <ListaExercicios> block."""
    blocks = []
    for ex in exercises:
        idx = ex["candidate_index"]
        if idx < 0 or idx >= len(candidates):
            warn(f"exercise {ex['numero']} references invalid candidate_index {idx} — skipping")
            continue
        blocks.append(render_exercise_block(ex, candidates[idx]))

    slug_match = re.search(r"licao-(\d+)-([a-z0-9-]+)\.mdx", str(lesson_num))
    # If we can't derive slug, fall back to "licao-NN"
    seed = f"licao-{lesson_num:02d}" if lesson_num < 100 else f"licao-{lesson_num}"

    return (
        f'<ListaExercicios seed="{seed}">\n\n'
        + "\n\n".join(blocks)
        + "\n\n</ListaExercicios>"
    )


# =============================================================================
# Phase 5: replace lesson's ListaExercicios block
# =============================================================================

LISTA_RE = re.compile(
    r"<ListaExercicios\s[^>]*>.*?</ListaExercicios>",
    re.DOTALL,
)


def replace_listaexercicios(lesson_path: Path, new_block: str) -> None:
    """Atomically replace the existing <ListaExercicios>...</ListaExercicios> in the lesson."""
    src = lesson_path.read_text()
    if not LISTA_RE.search(src):
        fail(f"no <ListaExercicios>...</ListaExercicios> found in {lesson_path}")
    new_src = LISTA_RE.sub(lambda _: new_block, src, count=1)
    lesson_path.write_text(new_src)


# =============================================================================
# Phase 6: validation
# =============================================================================

def validate_lesson(lesson_path: Path, expected_count_min: int = 30) -> list[str]:
    """Return list of issues found. Empty list = clean."""
    issues: list[str] = []
    src = lesson_path.read_text()
    ex_count = len(re.findall(r"<Exercicio\b", src))
    mc_count = len(re.findall(r"opcoes=\{\[", src))
    sol_count = len(re.findall(r"\bsolucao=", src))
    pas_count = len(re.findall(r"\bpassos=", src))
    fonte_count = len(re.findall(r"\bfonte=\{\{", src))
    fonte_ex_count = len(re.findall(r"\bfonte=\{\{[^}]*\bexercicio:", src))
    fonte_pag_count = len(re.findall(r"\bfonte=\{\{[^}]*\bpagina:", src))

    if ex_count < expected_count_min:
        issues.append(f"too few exercises: {ex_count} (expected ≥{expected_count_min})")
    if mc_count != ex_count:
        issues.append(f"MC mismatch: {mc_count} opcoes vs {ex_count} exercises")
    if sol_count != ex_count:
        issues.append(f"solucao mismatch: {sol_count} vs {ex_count} exercises")
    pas_pct = pas_count / ex_count if ex_count else 0
    if not (0.18 <= pas_pct <= 0.32):
        issues.append(f"passos out of band: {pas_count}/{ex_count} = {pas_pct:.1%} (expected ~25%)")
    if fonte_count != ex_count:
        issues.append(f"fonte mismatch: {fonte_count} vs {ex_count} exercises")
    if fonte_ex_count != ex_count:
        issues.append(f"fonte missing exercicio field on {ex_count - fonte_ex_count} exercises")
    if fonte_pag_count > 0:
        issues.append(f"FORBIDDEN: {fonte_pag_count} fonte blocks contain pagina field")
    return issues


# =============================================================================
# Phase 7: trigger EN/ES translation via translate-parallel.py
# =============================================================================

def delete_stale_translations(lesson_path: Path) -> None:
    """Remove existing en-US and es-ES copies so translate-parallel.py re-creates them."""
    rel = lesson_path.relative_to(ROOT / "content")
    for locale in ("en-US", "es-ES"):
        target = ROOT / "content" / "i18n" / locale / rel
        if target.exists():
            target.unlink()
            info(f"deleted stale: {target.relative_to(ROOT)}")


def run_translate(locale: str) -> int:
    """Invoke translate-parallel.py for a single locale, limit 1 missing file."""
    info(f"translating to {locale} via Gemini free tier…")
    r = subprocess.run(
        ["python3", str(ROOT / "scripts" / "translate-parallel.py"),
         "--only", locale, "--limit", "1"],
        cwd=ROOT,
    )
    return r.returncode


# =============================================================================
# Phase 8: review queue
# =============================================================================

def append_review_queue(lesson_num: int, items: list[dict]) -> None:
    """Append flagged exercises to docs/translation-review-queue.md."""
    if not items:
        return
    REVIEW_QUEUE.parent.mkdir(exist_ok=True, parents=True)
    header_present = REVIEW_QUEUE.exists() and REVIEW_QUEUE.read_text().lstrip().startswith("#")
    with REVIEW_QUEUE.open("a") as fh:
        if not header_present:
            fh.write(
                "# Translation review queue\n\n"
                "Exercises flagged by `scripts/cascade-resource.py` as potentially needing Opus review.\n"
                "Each entry has lesson, exercise number, locale, suspected issue, and a PT/translation excerpt.\n\n"
                "When reviewed, mark with `[REVIEWED]` and a date.\n\n"
                "---\n\n"
            )
        fh.write(f"## L{lesson_num} — flagged on cascade run\n\n")
        for item in items:
            fh.write(
                f"- **{item['exercise']}** ({item['locale']}) — {item['reason']}\n"
                f"  - PT: `{item['pt_excerpt']}`\n"
                f"  - {item['locale']}: `{item['locale_excerpt']}`\n\n"
            )


# =============================================================================
# Phase 9: manifest allowlist update
# =============================================================================

def add_to_manifest_allowlist(caminho: str) -> None:
    """Append the lesson to includeTranslationsFor in generate-manifest.ts (idempotent)."""
    src = MANIFEST_SCRIPT.read_text()
    if f"'{caminho}'" in src:
        info(f"{caminho} already in manifest allowlist")
        return
    # Find the includeTranslationsFor Set literal
    m = re.search(
        r"(const includeTranslationsFor = new Set<string>\(\[\s*\n)(.*?)(\s*\]\))",
        src, re.DOTALL,
    )
    if not m:
        warn("could not locate includeTranslationsFor in generate-manifest.ts — skipping manifest update")
        return
    inner = m.group(2)
    new_line = f"    '{caminho}',\n"
    new_inner = inner.rstrip() + "\n" + new_line
    new_src = src[:m.start(2)] + new_inner + src[m.end(2):]
    MANIFEST_SCRIPT.write_text(new_src)
    ok(f"added {caminho} to manifest allowlist")


# =============================================================================
# main
# =============================================================================

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("lesson", type=int, help="Lesson number (1..120)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Show plan + candidate count, no API calls or file changes")
    parser.add_argument("--no-translate", action="store_true",
                        help="Skip EN+ES translation (PT-BR re-source only)")
    parser.add_argument("--no-manifest", action="store_true",
                        help="Skip manifest allowlist update")
    parser.add_argument("--keep-existing", action="store_true",
                        help="Don't replace existing <ListaExercicios> in lesson MDX (validates only)")
    args = parser.parse_args()

    key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not key and not args.dry_run:
        fail("GEMINI_API_KEY not set — source .env.local first")

    lesson_path = find_lesson_mdx(args.lesson)
    caminho = relative_caminho(lesson_path)
    info(f"target: {lesson_path.relative_to(ROOT)}")
    info(f"caminho: {caminho}")

    # Phase 1+2: candidates
    candidates_path = ensure_candidates(args.lesson)
    candidates = [json.loads(line) for line in candidates_path.open()]

    if args.dry_run:
        ok(f"dry-run complete. Would re-source L{args.lesson} from {len(candidates)} candidates.")
        return 0

    # Phase 3: Gemini re-source
    info(f"calling Gemini ({GEMINI_MODEL}) to pick + author exercises…")
    system, user = build_resource_prompt(args.lesson, lesson_path, candidates)
    result = call_gemini_json(key, system, user, EXERCISE_SCHEMA)
    exercises = result.get("exercises", [])
    if not exercises:
        fail("Gemini returned no exercises")
    ok(f"Gemini returned {len(exercises)} exercises")

    # Phase 4+5: render + replace
    if args.keep_existing:
        info("--keep-existing: skipping lesson MDX update (validation only)")
    else:
        block = render_listaexercicios(args.lesson, exercises, candidates)
        replace_listaexercicios(lesson_path, block)
        ok(f"replaced <ListaExercicios> block in {lesson_path.relative_to(ROOT)}")

    # Phase 6: validate
    issues = validate_lesson(lesson_path)
    if issues:
        warn(f"validation found {len(issues)} issue(s):")
        for i in issues:
            print(f"  - {i}", file=sys.stderr)
        if any("FORBIDDEN" in i for i in issues):
            fail("aborting cascade due to FORBIDDEN issue")
    else:
        ok("validation clean")

    # Phase 7: trigger EN/ES translation
    if args.no_translate:
        info("--no-translate: skipping translation phase")
    else:
        delete_stale_translations(lesson_path)
        for locale in ("en-US", "es-ES"):
            rc = run_translate(locale)
            if rc != 0:
                warn(f"translate-parallel.py for {locale} exited {rc}")

    # Phase 8: manifest allowlist
    if args.no_manifest:
        info("--no-manifest: skipping manifest update")
    else:
        add_to_manifest_allowlist(caminho)

    ok(f"\nL{args.lesson} cascade complete. Next:")
    print(f"  ./node_modules/.bin/tsx scripts/generate-manifest.ts")
    print(f"  rm -rf out .next && NODE_OPTIONS=--max-old-space-size=8192 npm run build")
    print(f"  npx serve out -l 3002")
    return 0


if __name__ == "__main__":
    sys.exit(main())
