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
from datetime import datetime, timezone
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

# ---- Local Ollama (native /api/chat — supports num_ctx + streaming) ----
OLLAMA_BASE = os.environ.get("OLLAMA_BASE", "http://localhost:11434")
OLLAMA_CHAT_URL = f"{OLLAMA_BASE}/api/chat"
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "qwen2.5:7b")
OLLAMA_NUM_CTX = int(os.environ.get("OLLAMA_NUM_CTX", "16384"))
# Observed on L02: each verbose exercise (body + 4 options + solucao + sometimes passos)
# is ~350 output tokens. A 15-exercise batch ≈ 5,500 tokens; 8000 gives the model
# ~2,500 tokens of safety + JSON close bracket overhead.
OLLAMA_NUM_PREDICT = int(os.environ.get("OLLAMA_NUM_PREDICT", "8000"))

# ---- Cerebras Cloud (OpenAI-compatible) — primary free provider, ~1000+ tok/s ----
CEREBRAS_URL = "https://api.cerebras.ai/v1/chat/completions"
CEREBRAS_MODEL = os.environ.get("CEREBRAS_MODEL", "gpt-oss-120b")

# ---- OpenRouter (OpenAI-compatible) — fallback, free 120B models ----
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "nvidia/nemotron-3-super-120b-a12b:free")

# ---- Source-id → display name (for fonte.livro) ----
LIVRO_DISPLAY = {
    "openstax/college-algebra-2e": "OpenStax College Algebra 2e",
    "openstax/calculus-volume-1": "OpenStax Calculus Volume 1",
    "openstax/calculus-volume-2": "OpenStax Calculus Volume 2",
    "openstax/calculus-volume-3": "OpenStax Calculus Volume 3",
    "openstax/statistics": "OpenStax Statistics",
    "openstax/introductory-statistics-2e": "OpenStax Introductory Statistics 2e",
    "openintro/statistics": "OpenIntro Statistics",
    "active-calculus/single": "Active Calculus",
    "beezer/first-course-linear-algebra": "A First Course in Linear Algebra (Beezer)",
    "axler/linear-algebra-done-right-4e": "Linear Algebra Done Right (Axler, 4th ed)",
}


# ---- Live monitor (best-effort; never breaks the pipeline) -----------------
# agent_monitor lives next to this script (scripts/ is sys.path[0] when run
# directly). If the import fails for any reason, fall back to a no-op shim so
# every mon.* call is a harmless pass.
try:
    import agent_monitor as mon  # type: ignore
except Exception:  # noqa: BLE001
    class _NoMon:
        def __getattr__(self, _):
            return lambda *a, **k: None
    mon = _NoMon()  # type: ignore

_MON_AGENT: str | None = None  # set in main(); read by provider calls + fail()


def fail(msg: str) -> None:
    if _MON_AGENT:
        mon.finish_agent(_MON_AGENT, "fail", error=msg)
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
    r = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "build-strict-candidates.py"), str(lesson_num)],
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
            um = data.get("usageMetadata", {})
            mon.record_usage(_MON_AGENT,
                             tok_in=int(um.get("promptTokenCount") or 0),
                             tok_out=int(um.get("candidatesTokenCount") or 0),
                             model=f"gemini/{GEMINI_MODEL}")
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


class ProviderError(Exception):
    """Raised when a provider fails — cascade chain catches and tries next."""


def _openai_compat_call(
    url: str,
    api_key: str,
    model: str,
    system: str,
    user: str,
    schema: dict,
    *,
    label: str,
    timeout: int = 120,
    max_tokens: int = 8000,
    extra_headers: dict[str, str] | None = None,
) -> dict:
    """Single-attempt OpenAI-compatible JSON-mode call. Used for Cerebras + OpenRouter."""
    schema_hint = (
        "\n\nOutput a SINGLE JSON object matching this shape exactly. "
        "Top-level keys and types are mandatory:\n"
        + json.dumps(schema, separators=(",", ":"))[:4000]
    )
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system + schema_hint},
            {"role": "user", "content": user},
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.3,
        "max_tokens": max_tokens,
    }
    t0 = time.time()
    info(f"{label} call — model={model}")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        # Cloudflare in front of Cerebras blocks `Python-urllib/3.x` (the
        # default UA). curl works; any non-urllib UA passes.
        "User-Agent": "cascade-resource/1.0 (Clube-da-Matematica)",
    }
    if extra_headers:
        headers.update(extra_headers)
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")[:300]
        raise ProviderError(f"{label} HTTP {e.code}: {body}")
    except urllib.error.URLError as e:
        raise ProviderError(f"{label} network error: {e}")
    if "choices" not in data:
        err = data.get("error", {})
        raise ProviderError(f"{label} bad response: {str(err)[:200] or str(data)[:200]}")
    choice = data["choices"][0]
    msg = choice.get("message", {})
    text = msg.get("content")
    finish = choice.get("finish_reason", "?")
    if not text:
        # gpt-oss reasoning models stuff CoT into `message.reasoning` and the
        # answer into `message.content`. If finish_reason=length, reasoning
        # exhausted the token budget before content started.
        had_reasoning = bool(msg.get("reasoning"))
        raise ProviderError(
            f"{label} empty content (finish={finish}, reasoning_present={had_reasoning})"
        )
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError as e:
        raise ProviderError(f"{label} JSON parse: {e}")
    top_keys = set(schema.get("required", []))
    if top_keys and not top_keys.issubset(parsed.keys()):
        missing = top_keys - parsed.keys()
        raise ProviderError(f"{label} schema: missing {missing}")
    u = data.get("usage", {})
    ok(f"{label} OK: in={u.get('prompt_tokens','?')} out={u.get('completion_tokens','?')} in {time.time()-t0:.1f}s")
    mon.record_usage(_MON_AGENT, tok_in=int(u.get("prompt_tokens") or 0),
                     tok_out=int(u.get("completion_tokens") or 0), model=label)
    return parsed


def call_cerebras_json(system: str, user: str, schema: dict, *, max_tokens: int = 16000) -> dict:
    """Cerebras call with rate-limit-aware retry.

    Free tier is 5 RPM / 30K TPM / 1M TPD. With 5+ parallel workers we WILL
    trip 429. Instead of falling through to OpenRouter (slow + unreliable at
    batch=45) or Ollama (5-11 min serial), wait the rate-limit window and
    retry. Each lesson is ~10s success, so a few 12s waits is much faster
    than the alternatives.
    """
    key = os.environ.get("CEREBRAS_API_KEY", "").strip()
    if not key:
        raise ProviderError("CEREBRAS_API_KEY not set")
    # Cerebras free tier: 5 RPM / 30K TPM / 1M TPD. Rolling 60s window. On 429
    # ("Tokens per minute limit exceeded") we MUST wait long enough for the
    # window to clear before retrying — short retries waste both quota and time.
    # Strategy: try, on 429 sleep N s, try again. Up to MAX_RETRIES retries.
    sleep_between_retries = 70  # seconds; >60 ensures the TPM window has rolled
    max_retries = 4  # so worst-case = 5 attempts × ~5s + 4 × 70s = ~305s
    last_err: Exception | None = None
    for attempt in range(max_retries + 1):
        try:
            return _openai_compat_call(
                CEREBRAS_URL, key, CEREBRAS_MODEL, system, user, schema,
                label=f"Cerebras({CEREBRAS_MODEL})",
                timeout=180,
                # gpt-oss-120b is a reasoning model: budget must cover BOTH the
                # internal chain-of-thought AND the final JSON answer.
                max_tokens=max_tokens,
            )
        except ProviderError as e:
            last_err = e
            msg = str(e)
            # 429 = wait + retry. Anything else = propagate immediately.
            if "HTTP 429" not in msg and "rate" not in msg.lower():
                raise
            if attempt >= max_retries:
                raise ProviderError(f"Cerebras: 429 after {max_retries+1} attempts. Last: {e}")
            warn(f"Cerebras 429 (attempt {attempt+1}/{max_retries+1}), sleeping {sleep_between_retries}s for TPM clear…")
            time.sleep(sleep_between_retries)
    # unreachable
    raise ProviderError(f"Cerebras: unreachable retry exit. Last: {last_err}")


def call_openrouter_json(system: str, user: str, schema: dict, *, max_tokens: int = 16000) -> dict:
    key = os.environ.get("OPENROUTER_API_KEY", "").strip()
    if not key:
        raise ProviderError("OPENROUTER_API_KEY not set")
    return _openai_compat_call(
        OPENROUTER_URL, key, OPENROUTER_MODEL, system, user, schema,
        label=f"OpenRouter({OPENROUTER_MODEL})", timeout=240,
        max_tokens=max_tokens,
        # OpenRouter convention: identify the calling project. Free-tier users
        # get rate-pool credit on a per-Referer basis.
        extra_headers={
            "HTTP-Referer": "https://github.com/leonardochalhoub/Clube-da-Matematica",
            "X-Title": "Clube da Matematica",
        },
    )


SINGLE_EXERCISE_SCHEMA = {
    "type": "object",
    "properties": {
        "exercise": EXERCISE_SCHEMA["properties"]["exercises"]["items"],
    },
    "required": ["exercise"],
}


def regenerate_exercise(
    bad_ex: dict,
    issues_for_ex: list[str],
    candidate: dict,
    provider_call,
) -> dict | None:
    """Ask the LLM to re-author ONE exercise that failed the quality check.

    The retry prompt is small (~500 tokens) so it lands in <1s on Cerebras.
    Returns the fixed exercise, or None if the retry also fails.
    """
    system = (
        "You are fixing a single multiple-choice math exercise that failed quality "
        "checks. Re-author it from the same source candidate. Output a SINGLE JSON "
        "object: {\"exercise\": {...}} matching the same shape as before.\n\n"
        "Hard rules:\n"
        "- EXACTLY 4 options. All four texts MUST be distinct strings.\n"
        "- EXACTLY ONE option marked correta=true.\n"
        "- All LaTeX commands fully spelled (\\\\backslash, \\\\frac, \\\\times — never \\\\ackslash / \\\\rac / \\\\imes).\n"
        "- Solução in PT-BR, 1-3 sentences, must match the correct option.\n"
        "- Keep the same numero, candidate_index, dificuldade, body_pt, fonte.\n"
    )
    user = (
        f"Original exercise (had issues: {'; '.join(issues_for_ex)}):\n"
        f"```json\n{json.dumps(bad_ex, ensure_ascii=False)}\n```\n\n"
        f"Source candidate:\n"
        f"```json\n{json.dumps({k: candidate.get(k) for k in ('source_id','section_number','section_title','exercise_id','statement')}, ensure_ascii=False)}\n```\n\n"
        f"Output: {{\"exercise\": <fixed object>}}"
    )
    try:
        result = provider_call(system, user, SINGLE_EXERCISE_SCHEMA, max_tokens=4000)
        fixed = result.get("exercise")
        if not fixed:
            return None
        # Preserve original candidate_index (model sometimes shifts it)
        fixed["candidate_index"] = bad_ex.get("candidate_index", fixed.get("candidate_index"))
        return fixed
    except ProviderError as e:
        warn(f"  regen failed: {e}")
        return None


def issues_by_exercise(issues: list[str]) -> dict[str, list[str]]:
    """Group flat issue list by exercise numero. Issue strings start with '<numero>: …'."""
    by_num: dict[str, list[str]] = {}
    for issue in issues:
        # numero may be '?' for batch-level issues — skip those
        m = re.match(r"^([0-9]+\.[0-9]+):\s*(.+)$", issue)
        if m:
            by_num.setdefault(m.group(1), []).append(m.group(2))
    return by_num


def validate_exercises_quality(exercises: list[dict]) -> list[str]:
    """Cheap structural quality checks. Returns list of issues; empty = good.

    Catches the failure modes we saw with Qwen 7B on L02:
      - duplicate MC option texts (true distractors must differ)
      - `\\ackslash` instead of `\\backslash` (model drops 'b')
      - solucao numerical answer doesn't match labeled correct option
      - boilerplate solucao reused verbatim across exercises
    """
    issues: list[str] = []
    seen_solucoes: dict[str, list[str]] = {}
    for ex in exercises:
        numero = ex.get("numero", "?")
        opts = ex.get("options", [])
        # 1) Duplicate option texts
        texts = [o.get("text") or o.get("texto") or "" for o in opts]
        normalized = [re.sub(r"\s+", " ", t).strip().lower() for t in texts]
        if len(set(normalized)) < len(normalized):
            issues.append(f"{numero}: duplicate option texts")
        # 2) Corrupted LaTeX (\ackslash, \rac, \imes…)
        blob = json.dumps(ex, ensure_ascii=False)
        if re.search(r"\\\\?ackslash|\\\\?rac\b|\\\\?imes\b", blob):
            issues.append(f"{numero}: corrupted LaTeX command (\\ackslash / \\rac / \\imes)")
        # 3) Boilerplate solucao reuse (tracked across the batch)
        sol = (ex.get("solucao_pt") or "").strip()
        if sol:
            seen_solucoes.setdefault(sol, []).append(numero)
        # 4) Exactly one option flagged correct
        n_correct = sum(1 for o in opts if o.get("correct") or o.get("correta"))
        if n_correct != 1:
            issues.append(f"{numero}: {n_correct} options marked correct (need exactly 1)")
    for sol, nums in seen_solucoes.items():
        if len(nums) >= 3:
            issues.append(f"boilerplate solucao reused across {nums}: {sol[:60]}…")
    return issues


def _check_nonempty_exercises(result: dict, label: str, min_count: int) -> dict:
    """A 200 response with no usable exercises is still a provider failure."""
    exs = result.get("exercises") if isinstance(result, dict) else None
    if not exs:
        raise ProviderError(f"{label} returned 0 exercises")
    if len(exs) < min_count:
        raise ProviderError(f"{label} returned only {len(exs)} (< {min_count} required)")
    return result


def call_with_chain(
    system: str, user: str, schema: dict, providers: list[str],
    *, max_tokens: int = 16000, min_exercises: int = 1,
) -> tuple[dict, str]:
    """Try providers in order; on ProviderError, fall back to the next.

    Each successful API call is validated to actually contain `min_exercises`+
    items. A 200 OK with 0 exercises (e.g. Nemotron hallucinating a stub) is
    treated as a provider failure so the chain advances to the next provider.

    Returns (result, provider_name_that_succeeded). Raises if all fail.
    """
    last_err: Exception | None = None
    for p in providers:
        try:
            if p == "cerebras":
                r = call_cerebras_json(system, user, schema, max_tokens=max_tokens)
                return _check_nonempty_exercises(r, "cerebras", min_exercises), "cerebras"
            elif p == "openrouter":
                r = call_openrouter_json(system, user, schema, max_tokens=max_tokens)
                return _check_nonempty_exercises(r, "openrouter", min_exercises), "openrouter"
            elif p == "ollama":
                r = call_ollama_json(system, user, schema)
                return _check_nonempty_exercises(r, "ollama", min_exercises), "ollama"
            elif p == "gemini":
                key = os.environ.get("GEMINI_API_KEY", "").strip()
                if not key:
                    raise ProviderError("GEMINI_API_KEY not set")
                r = call_gemini_json(key, system, user, schema)
                return _check_nonempty_exercises(r, "gemini", min_exercises), "gemini"
            else:
                warn(f"unknown provider '{p}' in chain — skipping")
        except ProviderError as e:
            last_err = e
            warn(f"provider {p} failed: {e}. Trying next…")
            continue
        except SystemExit as e:
            # call_gemini_json / call_ollama_json bail via fail() — convert to ProviderError
            last_err = ProviderError(f"{p} fatal")
            warn(f"provider {p} bailed; trying next…")
            continue
    fail(f"all providers exhausted. Last error: {last_err}")
    raise AssertionError("unreachable")  # for type-checkers


def call_ollama_json(system: str, user: str, schema: dict, max_retries: int = 4) -> dict:
    """Call local Ollama via /api/chat with streaming + live token counter.

    Uses native API so we can pass `options.num_ctx` (default 16384 — the
    OpenAI-compat /v1 endpoint silently truncates input to 4096, which was the
    root cause of L02 schema failures). Streams tokens, prints a live progress
    line to stderr every 5 s so `tail -f` shows real-time activity.

    Returns the parsed top-level dict (same shape as call_gemini_json).
    """
    schema_hint = (
        "\n\nOutput a SINGLE JSON object matching this shape — top-level keys "
        "and types are mandatory:\n"
        + json.dumps(schema, separators=(",", ":"))[:4000]
    )
    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {"role": "system", "content": system + schema_hint},
            {"role": "user", "content": user},
        ],
        "stream": True,
        "format": "json",
        "options": {
            "num_ctx": OLLAMA_NUM_CTX,
            "num_predict": OLLAMA_NUM_PREDICT,
            "temperature": 0.3,
        },
    }
    prompt_tokens_est = (len(system) + len(user) + len(schema_hint)) // 4
    last_err: Exception | None = None
    for attempt in range(max_retries):
        info(f"Ollama call (attempt {attempt+1}/{max_retries}) — model={OLLAMA_MODEL} "
             f"ctx={OLLAMA_NUM_CTX} predict={OLLAMA_NUM_PREDICT} prompt≈{prompt_tokens_est} tok")
        chunks: list[str] = []
        eval_count = 0
        prompt_eval_count = 0
        final_event: dict = {}
        t_start = time.time()
        t_last_log = t_start
        try:
            req = urllib.request.Request(
                OLLAMA_CHAT_URL,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=3600) as resp:
                for raw_line in resp:
                    if not raw_line.strip():
                        continue
                    try:
                        ev = json.loads(raw_line.decode("utf-8"))
                    except json.JSONDecodeError:
                        continue
                    if "message" in ev and ev["message"].get("content"):
                        chunks.append(ev["message"]["content"])
                    if "eval_count" in ev:
                        eval_count = ev["eval_count"]
                    if "prompt_eval_count" in ev:
                        prompt_eval_count = ev["prompt_eval_count"]
                    if ev.get("done"):
                        # Capture final timing stats for FinOps ledger
                        final_event = ev
                    now = time.time()
                    if now - t_last_log >= 5.0 or ev.get("done"):
                        elapsed = now - t_start
                        # rough live count: assume ~4 chars/tok if eval_count not yet reported
                        out_tok = eval_count or sum(len(c) for c in chunks) // 4
                        rate = out_tok / elapsed if elapsed > 0 else 0
                        prefix = "[done] " if ev.get("done") else ""
                        print(
                            f"  \033[36m·\033[0m {prefix}attempt {attempt+1}  "
                            f"elapsed={elapsed:6.1f}s  prompt_tok={prompt_eval_count or '?'}  "
                            f"out_tok={out_tok:5d}  rate={rate:5.1f} tok/s",
                            file=sys.stderr,
                            flush=True,
                        )
                        t_last_log = now
                    if ev.get("done"):
                        break
            text = "".join(chunks)
            parsed = json.loads(text)
            top_keys = set(schema.get("required", []))
            if top_keys and not top_keys.issubset(parsed.keys()):
                missing = top_keys - parsed.keys()
                raise ValueError(f"top-level keys missing: {missing}")
            ok(f"Ollama OK: {eval_count} output tokens in {time.time()-t_start:.1f}s")
            mon.record_usage(_MON_AGENT,
                             tok_in=int(prompt_eval_count or 0),
                             tok_out=int(eval_count or 0),
                             model=f"ollama/{OLLAMA_MODEL}")
            # FinOps ledger: append one JSONL line per successful call.
            # Read by pipelines/finops/bronze_ollama_state.py → ollama_runs.parquet.
            try:
                ledger = ROOT / "logs" / "ollama-runs.jsonl"
                ledger.parent.mkdir(parents=True, exist_ok=True)
                record = {
                    "ts": datetime.now(timezone.utc).isoformat(),
                    "caller": "cascade-resource.py",
                    "model": OLLAMA_MODEL,
                    "endpoint": "/api/chat",
                    "num_ctx": OLLAMA_NUM_CTX,
                    "num_predict": OLLAMA_NUM_PREDICT,
                    "prompt_eval_count": int(prompt_eval_count or 0),
                    "eval_count": int(eval_count or 0),
                    "prompt_eval_duration_ns": int(final_event.get("prompt_eval_duration") or 0),
                    "eval_duration_ns": int(final_event.get("eval_duration") or 0),
                    "total_duration_ns": int(final_event.get("total_duration") or 0),
                    "load_duration_ns": int(final_event.get("load_duration") or 0),
                    "wall_clock_s": round(time.time() - t_start, 3),
                    "attempt": attempt + 1,
                    "success": True,
                }
                with ledger.open("a", encoding="utf-8") as fh:
                    fh.write(json.dumps(record) + "\n")
            except Exception as _ledger_err:  # pragma: no cover — never fail the cascade for a log write
                warn(f"ollama-runs.jsonl write failed: {type(_ledger_err).__name__}: {_ledger_err}")
            return parsed
        except urllib.error.URLError as e:
            last_err = e
            if attempt < max_retries - 1:
                warn(f"Ollama network error: {e}. Retry in {2**attempt}s…")
                time.sleep(2 ** attempt)
                continue
        except (KeyError, IndexError, json.JSONDecodeError, ValueError) as e:
            last_err = e
            if attempt < max_retries - 1:
                warn(f"Ollama bad output ({type(e).__name__}: {e}). Retry…")
                time.sleep(1)
                continue
    fail(f"Ollama: exhausted retries. Last error: {last_err}")


def build_resource_prompt(
    lesson_num: int,
    lesson_path: Path,
    candidates: list[dict],
    batch_size: int = 15,
    candidate_cap: int = 40,
    candidate_offset: int = 0,
    exercise_start: int = 1,
) -> tuple[str, str]:
    """Build (system_prompt, user_prompt) for LLM re-source call.

    Lessons-learned tuning for free-tier (Ollama on 8 GB VRAM, num_ctx=16384):
    - `candidate_cap` slices the candidates list to keep prompt ≤ ~6K tokens.
    - `batch_size` caps the ask at ~20 exercises so output stays ≤ ~5K tokens.
    - Multiple batches per lesson (different `candidate_offset` + `exercise_start`)
      let us reach 30-45 total exercises across 2 calls. Each call stays well
      inside the context window.
    """
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
- Pick EXACTLY {batch_size} exercises (no more, no less), prefer variety (aplicacao/compreensao/modelagem/desafio/demonstracao mix: ~60/15/15/5/5)
- Translate each English `statement` into Brazilian Portuguese (the curriculum is PT-BR source)
- Compose a 4-option MC where exactly one option is correct
- Distractors should reflect classic student errors for this topic:
{distractor_guide}
- Write a 1-3 sentence solucao in PT-BR explaining how to reach the correct answer
- Mark EXACTLY 25% of exercises with passos (line-by-line reasoning, 4-6 steps in PT-BR)
- Math notation: use $...$ for inline math (NOT \\(...\\)), $$...$$ for display math
- NEVER include `pagina` field anywhere
- Number exercises sequentially starting at "{lesson_num}.{exercise_start}", "{lesson_num}.{exercise_start+1}", …
- STOP after {batch_size} exercises. Close the JSON array and object cleanly."""

    # Pre-cull with section-balanced stratified sampling: when the candidate
    # pool spans multiple sections (typical for consolidação lessons), naive
    # head-slicing biases toward the first section. Instead, take roughly equal
    # counts from EACH (source_id, section_number) bucket present in the pool.
    sections_present = []
    seen_sections: set[tuple[str, str]] = set()
    for c in candidates:
        key = (c["source_id"], c["section_number"])
        if key not in seen_sections:
            seen_sections.add(key)
            sections_present.append(key)

    if len(sections_present) > 1:
        per_section_cap = max(8, candidate_cap // len(sections_present))
        sliced: list[dict] = []
        original_indices: list[int] = []
        for key in sections_present:
            count = 0
            for orig_idx, c in enumerate(candidates):
                if (c["source_id"], c["section_number"]) == key and count < per_section_cap:
                    sliced.append(c)
                    original_indices.append(orig_idx)
                    count += 1
            # honor overall cap
            if len(sliced) >= candidate_cap:
                break
    else:
        sliced = candidates[candidate_offset : candidate_offset + candidate_cap]
        original_indices = list(range(candidate_offset, candidate_offset + len(sliced)))

    compact_candidates = []
    for orig_idx, c in zip(original_indices, sliced):
        compact_candidates.append({
            "index": orig_idx,  # preserve original index so render_listaexercicios matches
            "source": c["source_id"],
            "section": c["section_number"],
            "exercise_id": c["exercise_id"],
            "statement": c["statement"][:400],
        })

    # Build a per-section distribution hint for the LLM. The model defaults
    # to picking everything from the first source unless explicitly told to
    # spread the picks. Compute target counts per section for this batch.
    section_breakdown_lines = []
    if len(sections_present) > 1:
        target_per_section = max(1, batch_size // len(sections_present))
        leftover = batch_size - target_per_section * len(sections_present)
        for i, (src, sec) in enumerate(sections_present):
            extra = 1 if i < leftover else 0
            section_breakdown_lines.append(
                f"  • {src} §{sec}: take {target_per_section + extra} exercise(s)"
            )

    diversity_instruction = ""
    if section_breakdown_lines:
        diversity_instruction = (
            "\n\nIMPORTANT — TOPIC DIVERSITY: The candidates span "
            f"{len(sections_present)} different sections. You MUST distribute your "
            f"{batch_size} picks proportionally across ALL sections. Target counts:\n"
            + "\n".join(section_breakdown_lines)
            + "\n\nDo NOT pick everything from one section. Coverage of every section "
            "is mandatory — this is a consolidação lesson that must integrate all topics."
        )

    user_prompt = f"""Candidates pool for Lição {lesson_num} (showing {len(compact_candidates)} of {len(candidates)} candidates from {len(sections_present)} section(s); pick {batch_size} from below):

```json
{json.dumps(compact_candidates, ensure_ascii=False)}
```{diversity_instruction}

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


def inline_math_to_eq(s: str) -> str:
    """Convert `$math$` to `<Eq>{`math`}</Eq>` for safe JSX-expression rendering.

    Inside JSX fragments (`solucao={<>...</>}`, `passos={<>...</>}`), raw
    `$...$` breaks webpack's acorn parse when math contains `<`, `>`, `{`, `}`.
    The L01/L41 gold-standard pattern is `<Eq>{`math`}</Eq>`. Run this on any
    text before wrapping it in `<>...</>`.
    """
    def _replace(m: re.Match) -> str:
        math = m.group(1).replace("`", r"\`")
        return "<Eq>{`" + math + "`}</Eq>"
    return re.sub(r"\$([^\$\n]+?)\$", _replace, s)


def render_exercise_block(ex: dict, candidate: dict) -> str:
    """Render one exercise as MDX `<Exercicio>...` block."""
    livro = LIVRO_DISPLAY.get(candidate["source_id"], candidate["source_id"])
    url = candidate["section_url"]
    secao = "§" + candidate["section_number"]
    exercicio = "ex. " + candidate["exercise_id"]
    licenca = candidate["license"]

    body = latex_html_to_mdx(ex["body_pt"])
    # solucao goes inside `<>...</>` (JSX expression context) — convert $math$
    # to <Eq>{`math`}</Eq> to avoid acorn parse errors on `<`, `>`, `{`, `}`.
    solucao = inline_math_to_eq(latex_html_to_mdx(ex["solucao_pt"]))

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
            # passos items go inside <li>...</li> JSX context — same conversion.
            step_clean = inline_math_to_eq(latex_html_to_mdx(step))
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
    parser.add_argument("--provider",
                        choices=["chain", "cerebras", "openrouter", "gemini", "ollama"],
                        default="chain",
                        help="LLM backend. 'chain' = cerebras → openrouter → ollama with fallback (recommended).")
    parser.add_argument("--batch-size", type=int, default=30,
                        help="Exercises per LLM call (default 30 = L1 standard floor). "
                             "Cerebras max_tokens auto-scales with this.")
    parser.add_argument("--candidate-cap", type=int, default=60,
                        help="Max candidates fed to the LLM (default 60). Bigger pool = more variety, "
                             "but inflates prompt tokens.")
    args = parser.parse_args()

    # `chain` doesn't need a single key — each provider checks its own.
    # Other modes need their respective key (or daemon, for ollama).
    if args.provider == "gemini":
        if not os.environ.get("GEMINI_API_KEY", "").strip() and not args.dry_run:
            fail("GEMINI_API_KEY not set — source .env.local first")
    elif args.provider == "cerebras":
        if not os.environ.get("CEREBRAS_API_KEY", "").strip() and not args.dry_run:
            fail("CEREBRAS_API_KEY not set — source .env.local first")
    elif args.provider == "openrouter":
        if not os.environ.get("OPENROUTER_API_KEY", "").strip() and not args.dry_run:
            fail("OPENROUTER_API_KEY not set — source .env.local first")

    # Register with the live monitor. Reuse the id the batch parent pre-queued
    # (AGENT_MONITOR_ID) so the dashboard row promotes queued→running in place.
    global _MON_AGENT
    _MON_AGENT = mon.start_agent(
        "cascade", f"L{args.lesson} re-source", model=args.provider,
        parent=os.environ.get("AGENT_MONITOR_BATCH"),
        agent_id=os.environ.get("AGENT_MONITOR_ID"),
        meta={"lesson": args.lesson, "batch_size": args.batch_size},
    )

    lesson_path = find_lesson_mdx(args.lesson)
    caminho = relative_caminho(lesson_path)
    info(f"target: {lesson_path.relative_to(ROOT)}")
    info(f"caminho: {caminho}")
    mon.event(_MON_AGENT, f"target {lesson_path.name}", phase="locate")

    # Phase 1+2: candidates
    candidates_path = ensure_candidates(args.lesson)
    candidates = [json.loads(line) for line in candidates_path.open()]
    mon.event(_MON_AGENT, f"{len(candidates)} strict candidates built", phase="candidates")

    if args.dry_run:
        mon.finish_agent(_MON_AGENT, "ok")
        ok(f"dry-run complete. Would re-source L{args.lesson} from {len(candidates)} candidates.")
        return 0

    # Phase 3: LLM re-source — provider chain with fallback
    system, user = build_resource_prompt(
        args.lesson, lesson_path, candidates,
        batch_size=args.batch_size,
        candidate_cap=args.candidate_cap,
    )
    # Budget: ~700 output tokens per exercise (content) + ~30% headroom for the
    # gpt-oss-120b chain-of-thought.
    max_tokens = max(8000, int(args.batch_size * 700 * 1.3))
    info(f"batch_size={args.batch_size}  candidate_cap={args.candidate_cap}  "
         f"prompt≈{(len(system)+len(user))//4} tok  max_tokens={max_tokens}")
    mon.event(_MON_AGENT, f"calling {args.provider} (batch={args.batch_size})", phase="re-source")
    if args.provider == "chain":
        # Require at least ~half the requested batch — anything less is a sign
        # the provider couldn't follow the prompt and we should fall through.
        result, used = call_with_chain(
            system, user, EXERCISE_SCHEMA,
            providers=["cerebras", "openrouter", "ollama"],
            max_tokens=max_tokens,
            min_exercises=max(10, args.batch_size // 2),
        )
    elif args.provider == "cerebras":
        result, used = call_cerebras_json(system, user, EXERCISE_SCHEMA, max_tokens=max_tokens), "cerebras"
    elif args.provider == "openrouter":
        result, used = call_openrouter_json(system, user, EXERCISE_SCHEMA, max_tokens=max_tokens), "openrouter"
    elif args.provider == "ollama":
        info(f"calling Ollama ({OLLAMA_MODEL}) at {OLLAMA_CHAT_URL} to pick + author exercises…")
        result, used = call_ollama_json(system, user, EXERCISE_SCHEMA), "ollama"
    else:  # gemini
        info(f"calling Gemini ({GEMINI_MODEL}) to pick + author exercises…")
        key = os.environ.get("GEMINI_API_KEY", "").strip()
        result, used = call_gemini_json(key, system, user, EXERCISE_SCHEMA), "gemini"
    exercises = result.get("exercises", [])
    if not exercises:
        fail(f"{used} returned no exercises")
    ok(f"{used} returned {len(exercises)} exercises")
    mon.event(_MON_AGENT, f"{used} returned {len(exercises)} exercises",
              level="ok", phase="re-source")

    # Phase 3b: structural quality check on the exercises themselves
    quality_issues = validate_exercises_quality(exercises)
    if quality_issues:
        warn(f"quality check flagged {len(quality_issues)} issue(s) (provider={used}):")
        for q in quality_issues:
            print(f"  - {q}", file=sys.stderr)

        # Phase 3c: auto-retry bad exercises individually with the same provider.
        per_ex_issues = issues_by_exercise(quality_issues)
        if per_ex_issues:
            # Pick the right provider call (skip ollama — too slow for per-exercise fixes)
            if used == "cerebras":
                provider_call = call_cerebras_json
            elif used == "openrouter":
                provider_call = call_openrouter_json
            else:
                provider_call = None  # skip retry for ollama / gemini

            if provider_call:
                info(f"auto-retrying {len(per_ex_issues)} bad exercise(s) via {used}…")
                num_to_ex = {ex.get("numero"): (i, ex) for i, ex in enumerate(exercises)}
                fixed_count = 0
                for numero, ex_issues in per_ex_issues.items():
                    if numero not in num_to_ex:
                        continue
                    i, bad_ex = num_to_ex[numero]
                    cand_idx = bad_ex.get("candidate_index", -1)
                    if not (0 <= cand_idx < len(candidates)):
                        continue
                    fixed = regenerate_exercise(bad_ex, ex_issues, candidates[cand_idx], provider_call)
                    if fixed is None:
                        continue
                    # Re-validate the single fix; only swap if it passes
                    re_issues = validate_exercises_quality([fixed])
                    if any(numero in (ri or "") or ri.startswith(numero + ":") for ri in re_issues):
                        warn(f"  {numero}: regen still has issues, keeping original")
                        continue
                    exercises[i] = fixed
                    fixed_count += 1
                    ok(f"  {numero}: fixed")
                if fixed_count:
                    ok(f"auto-retry repaired {fixed_count}/{len(per_ex_issues)} bad exercise(s)")
                # Final validation pass
                quality_issues = validate_exercises_quality(exercises)
                if not quality_issues:
                    ok("quality check clean after auto-retry")
                else:
                    warn(f"quality check: {len(quality_issues)} issue(s) remain after auto-retry")
    else:
        ok("quality check clean")

    # Phase 4+5: render + replace
    if args.keep_existing:
        info("--keep-existing: skipping lesson MDX update (validation only)")
    else:
        block = render_listaexercicios(args.lesson, exercises, candidates)
        replace_listaexercicios(lesson_path, block)
        ok(f"replaced <ListaExercicios> block in {lesson_path.relative_to(ROOT)}")
        mon.event(_MON_AGENT, f"rendered {len(exercises)} exercises into MDX", phase="render")

    # Phase 6: validate
    issues = validate_lesson(lesson_path)
    if issues:
        warn(f"validation found {len(issues)} issue(s):")
        for i in issues:
            print(f"  - {i}", file=sys.stderr)
        mon.event(_MON_AGENT, f"validation: {len(issues)} issue(s)", level="warn", phase="validate")
        if any("FORBIDDEN" in i for i in issues):
            fail("aborting cascade due to FORBIDDEN issue")
    else:
        ok("validation clean")
        mon.event(_MON_AGENT, "validation clean", level="ok", phase="validate")

    # Phase 7: trigger EN/ES translation
    if args.no_translate:
        info("--no-translate: skipping translation phase")
    else:
        mon.event(_MON_AGENT, "translating en-US + es-ES", phase="translate")
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

    mon.event(_MON_AGENT, f"L{args.lesson} cascade complete", level="ok", phase="done")
    mon.finish_agent(_MON_AGENT, "ok")
    ok(f"\nL{args.lesson} cascade complete. Next:")
    print(f"  ./node_modules/.bin/tsx scripts/generate-manifest.ts")
    print(f"  rm -rf out .next && NODE_OPTIONS=--max-old-space-size=8192 npm run build")
    print(f"  npx serve out -l 3002")
    return 0


if __name__ == "__main__":
    sys.exit(main())
