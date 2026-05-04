#!/usr/bin/env python3
"""
translate-parallel.py — launches N parallel translation workers, one per locale,
across multiple free providers (Gemini, Groq), with visible progress.

Each worker pulls the next missing translation for its assigned locale,
translates it via the assigned provider, and writes the result to
content/i18n/<speechLang>/<same-relative-path-as-source>.mdx

The system prompt comes from docs/agents/translator-context.md.

USAGE:

  # See plan, no API calls:
  python3 scripts/translate-parallel.py --dry-run

  # Run all 10 locales in parallel using Gemini (default):
  export GEMINI_API_KEY="..."
  python3 scripts/translate-parallel.py

  # Mix providers (round-robin):
  export GEMINI_API_KEY="..." GROQ_API_KEY="..."
  python3 scripts/translate-parallel.py --providers gemini groq

  # Limit a single locale (testing):
  python3 scripts/translate-parallel.py --only es-ES --limit 3

OUTPUT FORMAT (visibility):
  [Gemini Flash · 03/10 · es-ES] aula-51-derivada-definicao.mdx → ok (47/74)
  [Groq Llama-3.3 · 04/10 · ja-JP] aula-12-circulo-trigonometrico.mdx → ok (12/99)

Stdlib only.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sys
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Callable

ROOT = Path(__file__).resolve().parent.parent
TRANSLATOR_CONTEXT = ROOT / "docs/agents/translator-context.md"

# Compact inline system prompt sent on EVERY API call. The full
# translator-context.md is for human reference; this is the model-facing
# version, trimmed to ~1k tokens so it fits inside small TPM budgets.
COMPACT_SYSTEM_PROMPT = """You are a precise machine translator for an MDX (Markdown + JSX + LaTeX) math-curriculum file.

NEVER translate or modify:
- LaTeX math: anything inside $...$, $$...$$, or <Eq>{`...`}</Eq>
- JSX component names and props: <DuasPortas>, <Porta nivel="..." titulo="...">,
  <EquacaoCanonica formula="..." legenda={...} audioTexto="...">, <Equation>, <Eq>,
  <ListaExercicios seed="...">, <Exercicio numero="X.Y" dificuldade="...">, <VerificarPasso>,
  <Definicao>, <Teorema>, <Exemplo>, <Insight>, <Cuidado>, <Leituras>, <PayoffChart>,
  <AudioReader>
- Frontmatter keys (titulo, slug, categoria, subcategoria, descricao, ordem, publicado,
  tags, prerrequisitos, autores, atualizadoEm, usadoEm)
- Frontmatter values for: slug, categoria, subcategoria, ordem, publicado, tags,
  prerrequisitos, atualizadoEm
- URLs, code fences, numbers, units, math symbols

ALWAYS translate:
- Frontmatter `titulo` and `descricao`
- The prose inside `legenda={<>...</>}` (but keep all <Eq>{`...`}</Eq> blocks intact)
- Body text inside <Porta>, including ### headings
- The question text inside <Exercicio> (keep numero and dificuldade attributes verbatim)
- The `audioTexto` strings (these will be read aloud — write natural prose in target locale)
- The "## Fontes" / "## Sources" heading and descriptive notes (keep author names and
  book titles in their original language — those are proper nouns)

Naming conventions per locale (the user prompt names the target locale):
- "Lição NN" → en: "Lesson NN" | es: "Lección NN" | de: "Lektion NN" | fr: "Leçon NN" |
  it: "Lezione NN" | zh: "第NN课" | ja: "第NN講" | ru: "Урок NN" | ko: "NN강" | pl: "Lekcja NN"
- "Trim N" → en: "Term N" | es: "Trimestre N" | de: "Quartal N" | fr: "Trimestre N" |
  it: "Trimestre N" | zh: "第N学期" | ja: "第N学期" | ru: "Семестр N" | ko: "N분기" | pl: "Kwartał N"
- "Ensino Médio" → en: "High School" | es: "Bachillerato" | de: "Gymnasium" |
  fr: "Lycée" | it: "Scuola superiore" | zh: "高中" | ja: "高校" | ru: "Старшая школа" |
  ko: "고등학교" | pl: "Liceum"
- The `nivel` prop values (formal, 5, 10, 15, 25, 40, pratica) are kept verbatim;
  only translate the `titulo` prop of <Porta>.

OUTPUT: Emit ONLY the complete translated file content. No commentary, no markdown
fences around it, no explanations. Start with the `---` frontmatter delimiter.
Update `atualizadoEm` to today's ISO date.
"""

# locale code -> (full speechLang, gemini lang code, language name for prompt)
LOCALES: dict[str, tuple[str, str]] = {
    "en":  ("en-US", "English (US)"),
    "es":  ("es-ES", "Spanish (Castilian)"),
    "zh":  ("zh-CN", "Simplified Chinese"),
    "ja":  ("ja-JP", "Japanese"),
    "de":  ("de-DE", "German"),
    "fr":  ("fr-FR", "French"),
    "it":  ("it-IT", "Italian"),
    "ru":  ("ru-RU", "Russian"),
    "ko":  ("ko-KR", "Korean"),
    "pl":  ("pl-PL", "Polish"),
}


# ---------------------------------------------------------------------------
# Provider adapters
# ---------------------------------------------------------------------------

def call_gemini(system: str, user: str, *, key: str,
                model: str = "gemini-2.5-flash") -> str:
    url = (f"https://generativelanguage.googleapis.com/v1beta/"
           f"models/{model}:generateContent?key={key}")
    body = {
        "system_instruction": {"parts": [{"text": system}]},
        "contents": [{"role": "user", "parts": [{"text": user}]}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 8000},
    }
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={
        "Content-Type": "application/json",
        "User-Agent": "clube-da-matematica/0.1 (https://github.com/leonardochalhoub/Clube-da-Matematica)",
    })
    with urllib.request.urlopen(req, timeout=120) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
    cand = payload["candidates"][0]
    parts = cand.get("content", {}).get("parts", [])
    return "".join(p.get("text", "") for p in parts)


def call_groq(system: str, user: str, *, key: str,
              model: str = "llama-3.3-70b-versatile") -> str:
    url = "https://api.groq.com/openai/v1/chat/completions"
    body = {
        "model": model,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "temperature": 0.2,
        "max_tokens": 8000,
    }
    data = json.dumps(body).encode("utf-8")
    # Cloudflare 1010 fix: send a non-Python User-Agent so we look like a
    # normal HTTP client, not a bot fingerprint.
    req = urllib.request.Request(url, data=data, headers={
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "clube-da-matematica/0.1 (https://github.com/leonardochalhoub/Clube-da-Matematica)",
    })
    with urllib.request.urlopen(req, timeout=120) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
    return payload["choices"][0]["message"]["content"]


PROVIDERS: dict[str, dict] = {
    "gemini": {
        "name": "Gemini Flash",
        "model": "gemini-2.5-flash",
        "rate_per_min": 15,
        "env": "GEMINI_API_KEY",
        "call": call_gemini,
    },
    "groq": {
        "name": "Groq GPT-OSS",
        # gpt-oss-120b has ~200k TPM on Groq free tier (vs 12k on llama-3.3-70b),
        # which fits the ~12k-token translation request in one shot.
        "model": "openai/gpt-oss-120b",
        "rate_per_min": 30,
        "env": "GROQ_API_KEY",
        "call": call_groq,
    },
}


# ---------------------------------------------------------------------------
# File discovery & translation
# ---------------------------------------------------------------------------

def list_source_mdx() -> list[Path]:
    """Returns all PT-BR source MDX outside content/i18n/."""
    out: list[Path] = []
    for mdx in (ROOT / "content").rglob("*.mdx"):
        rel = mdx.relative_to(ROOT / "content")
        if rel.parts and rel.parts[0] == "i18n":
            continue
        out.append(mdx)
    return sorted(out)


def missing_for_locale(locale_code: str, source_files: list[Path]) -> list[Path]:
    speech = LOCALES[locale_code][0]
    out_root = ROOT / "content" / "i18n" / speech
    missing: list[Path] = []
    for src in source_files:
        rel = src.relative_to(ROOT / "content")
        target = out_root / rel
        if not target.exists():
            missing.append(src)
    return missing


def translate_one(src_path: Path, locale_code: str, provider: dict, key: str,
                  system_prompt: str) -> tuple[bool, str]:
    """Translate a single MDX. Returns (success, error_or_message)."""
    speech, lang_name = LOCALES[locale_code]
    rel = src_path.relative_to(ROOT / "content")
    target = ROOT / "content" / "i18n" / speech / rel
    target.parent.mkdir(parents=True, exist_ok=True)

    source_text = src_path.read_text(encoding="utf-8")
    user_prompt = (
        f"Target locale: {locale_code} ({speech}, {lang_name}).\n"
        f"Translate the following PT-BR MDX file into {lang_name} according to "
        f"the rules in the system prompt. Output ONLY the file content, no fences, "
        f"no commentary. Update `atualizadoEm` to today.\n\n"
        f"--- SOURCE FILE ---\n{source_text}"
    )
    try:
        out = provider["call"](system_prompt, user_prompt,
                               key=key, model=provider["model"])
    except urllib.error.HTTPError as e:
        return False, f"HTTP {e.code}: {e.read().decode('utf-8', errors='replace')[:200]}"
    except Exception as e:
        return False, f"{type(e).__name__}: {e}"

    out = out.strip()
    # Strip code fences if the model added them
    if out.startswith("```"):
        out = re.sub(r"^```(?:mdx|markdown)?\s*\n", "", out)
        out = re.sub(r"\n```\s*$", "", out)
    # Sanity: must have frontmatter
    if not out.startswith("---"):
        return False, "output missing frontmatter"

    target.write_text(out + ("\n" if not out.endswith("\n") else ""), encoding="utf-8")
    return True, "ok"


# ---------------------------------------------------------------------------
# Worker (one per locale)
# ---------------------------------------------------------------------------

class LocaleWorker:
    def __init__(self, locale_code: str, provider_name: str, agent_idx: int,
                 agent_total: int, system_prompt: str, limit: int | None,
                 print_lock: threading.Lock):
        self.locale = locale_code
        self.provider_name = provider_name
        self.provider = PROVIDERS[provider_name]
        self.api_key = os.environ.get(self.provider["env"])
        self.agent_idx = agent_idx
        self.agent_total = agent_total
        self.system_prompt = system_prompt
        self.limit = limit
        self.print_lock = print_lock
        self.done = 0
        self.failed = 0
        self.target_total = 0
        self.min_interval = 60.0 / self.provider["rate_per_min"]

    def log(self, msg: str) -> None:
        prefix = f"[{self.provider['name']} · {self.agent_idx:02d}/{self.agent_total:02d} · {self.locale}]"
        with self.print_lock:
            print(f"{prefix} {msg}", flush=True)

    def run(self, source_files: list[Path]) -> None:
        if not self.api_key:
            self.log(f"SKIP — env var {self.provider['env']} not set")
            return
        missing = missing_for_locale(self.locale, source_files)
        if self.limit is not None:
            missing = missing[: self.limit]
        self.target_total = len(missing)
        if self.target_total == 0:
            self.log("nothing to do (locale fully translated)")
            return
        self.log(f"starting — {self.target_total} files to translate")
        for i, src in enumerate(missing, start=1):
            t0 = time.monotonic()
            ok, msg = translate_one(src, self.locale, self.provider,
                                    self.api_key, self.system_prompt)
            elapsed = time.monotonic() - t0
            tag = "ok" if ok else f"FAIL ({msg})"
            if ok:
                self.done += 1
            else:
                self.failed += 1
            self.log(f"{src.name} → {tag} ({i}/{self.target_total}, "
                     f"{elapsed:.1f}s)")
            # rate limit
            wait = self.min_interval - elapsed
            if wait > 0 and i < self.target_total:
                time.sleep(wait)
        self.log(f"done — {self.done} ok / {self.failed} failed")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--providers", nargs="+", default=["gemini"],
                   choices=list(PROVIDERS.keys()),
                   help="Providers to round-robin across locales (default: gemini only)")
    p.add_argument("--only", help="Only translate this locale (e.g. es-ES)")
    p.add_argument("--limit", type=int,
                   help="Translate at most N files per locale (testing)")
    p.add_argument("--dry-run", action="store_true",
                   help="Show plan only, no API calls")
    p.add_argument("--groq-model", default=None,
                   help="Override Groq model (default: openai/gpt-oss-120b)")
    p.add_argument("--gemini-model", default=None,
                   help="Override Gemini model (default: gemini-2.5-flash)")
    args = p.parse_args()
    if args.groq_model:
        PROVIDERS["groq"]["model"] = args.groq_model
    if args.gemini_model:
        PROVIDERS["gemini"]["model"] = args.gemini_model

    # Use the compact prompt for API calls (fits in tight TPM budgets).
    # The full translator-context.md is for human readers / reference.
    system_prompt = COMPACT_SYSTEM_PROMPT

    sources = list_source_mdx()

    # Decide which locales to run
    if args.only:
        # accept either short code (es) or full speechLang (es-ES)
        target_locales = [c for c in LOCALES if c == args.only or LOCALES[c][0] == args.only]
        if not target_locales:
            print(f"ERROR: locale {args.only!r} not in {list(LOCALES)}", file=sys.stderr)
            return 1
    else:
        target_locales = list(LOCALES.keys())

    # Round-robin provider per locale
    plan: list[tuple[str, str]] = []  # (locale, provider)
    for i, loc in enumerate(target_locales):
        prov = args.providers[i % len(args.providers)]
        plan.append((loc, prov))

    print("=" * 72)
    print(f"Translation plan — {len(plan)} agents, {len(sources)} source MDX files")
    print(f"System prompt: COMPACT_SYSTEM_PROMPT (~1k tokens) — for full reference "
          f"see {TRANSLATOR_CONTEXT.relative_to(ROOT)}")
    print("=" * 72)
    total_missing = 0
    for i, (loc, prov) in enumerate(plan, start=1):
        miss = missing_for_locale(loc, sources)
        if args.limit is not None:
            miss = miss[: args.limit]
        total_missing += len(miss)
        speech, lang_name = LOCALES[loc]
        prov_meta = PROVIDERS[prov]
        env_set = "✓" if os.environ.get(prov_meta["env"]) else "✗ (env not set)"
        print(f"  [{prov_meta['name']:<18s} · {i:02d}/{len(plan):02d} · {loc:<3s} → {speech}] "
              f"{lang_name:<22s}  {len(miss):3d} missing  {env_set}")
    print("=" * 72)
    print(f"Total translations to do: {total_missing}")
    print()

    if args.dry_run:
        print("(dry-run — no API calls)")
        return 0

    print_lock = threading.Lock()
    workers = [
        LocaleWorker(loc, prov, idx, len(plan), system_prompt,
                     args.limit, print_lock)
        for idx, (loc, prov) in enumerate(plan, start=1)
    ]

    with ThreadPoolExecutor(max_workers=len(workers)) as ex:
        futs = [ex.submit(w.run, sources) for w in workers]
        for f in as_completed(futs):
            try:
                f.result()
            except Exception as e:
                print(f"WORKER ERROR: {e}", file=sys.stderr)

    print()
    print("=" * 72)
    print("Final summary:")
    total_ok = sum(w.done for w in workers)
    total_fail = sum(w.failed for w in workers)
    for w in workers:
        if w.target_total == 0:
            continue
        print(f"  [{w.provider_name:<6s} · {w.locale}] {w.done}/{w.target_total} ok, "
              f"{w.failed} failed")
    print(f"Grand total: {total_ok} translations succeeded, {total_fail} failed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
