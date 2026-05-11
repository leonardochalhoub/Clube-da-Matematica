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
import concurrent.futures as cf
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
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 60000},
    }
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={
        "Content-Type": "application/json",
        "User-Agent": "clube-da-matematica/0.1 (https://github.com/leonardochalhoub/Clube-da-Matematica)",
    })
    with urllib.request.urlopen(req, timeout=600) as resp:
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
        "max_tokens": 60000,
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
    with urllib.request.urlopen(req, timeout=600) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
    return payload["choices"][0]["message"]["content"]


PROVIDERS: dict[str, dict] = {
    "gemini": {
        "name": "Gemini Flash",
        "model": "gemini-2.5-flash",
        # Free tier: 10 RPM, ~20 RPD on standard plan. The daily cap makes
        # bulk batch translation impossible on this model. Use 'gemini-lite'
        # for full-corpus jobs.
        "rate_per_min": 8,
        "env": "GEMINI_API_KEY",
        "call": call_gemini,
    },
    "gemini-lite": {
        "name": "Gemini Flash-Lite",
        "model": "gemini-2.5-flash-lite",
        # Free tier: 20 RPD per project (per recent quota audit). Use the
        # `-latest` alias variants below if this bucket is exhausted.
        "rate_per_min": 12,
        "env": "GEMINI_API_KEY",
        "call": call_gemini,
    },
    "gemini-latest": {
        "name": "Gemini Flash (latest)",
        # `gemini-flash-latest` is an alias resolving to the current shipped
        # Flash model. It has its own quota bucket separate from the explicit
        # `gemini-2.5-flash` ID.
        "model": "gemini-flash-latest",
        "rate_per_min": 12,
        "env": "GEMINI_API_KEY",
        "call": call_gemini,
    },
    "gemini-lite-latest": {
        "name": "Gemini Flash-Lite (latest)",
        # Alias bucket — see note on `gemini-latest`. Separate quota.
        "model": "gemini-flash-lite-latest",
        "rate_per_min": 12,
        "env": "GEMINI_API_KEY",
        "call": call_gemini,
    },
    "groq": {
        "name": "Groq GPT-OSS",
        # NOTE: Groq free tier (on_demand) caps TPM at ~8k, which is far below
        # the size of a typical 80k-token translation request. This entry is
        # kept for paid tier users but is useless for full-file translation
        # on free tier.
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


def _call_with_retries(provider: dict, key: str, system_prompt: str,
                       user_prompt: str, max_attempts: int = 3) -> tuple[str, str]:
    """Try one provider with exponential backoff on transient errors.
    Returns (output, error_msg). One of them is empty."""
    last_err = ""
    for attempt in range(1, max_attempts + 1):
        try:
            return provider["call"](system_prompt, user_prompt,
                                    key=key, model=provider["model"]), ""
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")[:200]
            last_err = f"HTTP {e.code}: {body}"
            if e.code in (429, 500, 502, 503, 504) and attempt < max_attempts:
                time.sleep(3 * (3 ** (attempt - 1)))
                continue
            return "", last_err
        except (urllib.error.URLError, TimeoutError) as e:
            last_err = f"{type(e).__name__}: {e}"
            if attempt < max_attempts:
                time.sleep(3 * (3 ** (attempt - 1)))
                continue
            return "", last_err
        except Exception as e:
            return "", f"{type(e).__name__}: {e}"
    return "", last_err or "empty output"


def translate_one(src_path: Path, locale_code: str,
                  provider_chain: list[tuple[dict, str]],
                  system_prompt: str,
                  rate_claim: Callable[[dict], None] | None = None,
                  ) -> tuple[bool, str, str]:
    """Translate a single MDX, trying each provider in the chain on failure.
    Returns (success, provider_used_name, error_or_message)."""
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

    last_err = "no provider"
    last_name = ""
    for provider, key in provider_chain:
        last_name = provider["name"]
        if rate_claim is not None:
            rate_claim(provider)
        out, err = _call_with_retries(provider, key, system_prompt, user_prompt)
        if not out:
            last_err = f"{provider['name']}: {err}"
            continue

        out = out.strip()
        if out.startswith("```"):
            out = re.sub(r"^```(?:mdx|markdown)?\s*\n", "", out)
            out = re.sub(r"\n```\s*$", "", out)
        if not out.startswith("---"):
            last_err = f"{provider['name']}: output missing frontmatter"
            continue

        target.write_text(out + ("\n" if not out.endswith("\n") else ""),
                          encoding="utf-8")
        return True, provider["name"], "ok"

    return False, last_name, last_err


# ---------------------------------------------------------------------------
# Worker (one per locale)
# ---------------------------------------------------------------------------

class LocaleWorker:
    def __init__(self, locale_code: str, provider_names: list[str], agent_idx: int,
                 agent_total: int, system_prompt: str, limit: int | None,
                 print_lock: threading.Lock, workers: int = 1):
        self.locale = locale_code
        self.provider_names = provider_names
        self.providers = [PROVIDERS[n] for n in provider_names]
        self.api_keys = {p["name"]: os.environ.get(p["env"]) for p in self.providers}
        self.agent_idx = agent_idx
        self.agent_total = agent_total
        self.system_prompt = system_prompt
        self.limit = limit
        self.print_lock = print_lock
        self.workers = max(1, workers)
        self.done = 0
        self.failed = 0
        self.by_provider: dict[str, int] = {p["name"]: 0 for p in self.providers}
        self.target_total = 0
        # Per-provider rate bucket: name → (lock, next_send_at, min_interval)
        self._rate: dict[str, dict] = {
            p["name"]: {
                "lock": threading.Lock(),
                "next_send_at": 0.0,
                "min_interval": 60.0 / p["rate_per_min"],
            } for p in self.providers
        }
        self._progress_lock = threading.Lock()
        self._progress = 0

    def log(self, msg: str) -> None:
        prefix = f"[{'+'.join(p['name'] for p in self.providers)} · {self.agent_idx:02d}/{self.agent_total:02d} · {self.locale}]"
        with self.print_lock:
            print(f"{prefix} {msg}", flush=True)

    def _claim_slot(self, provider: dict) -> None:
        """Block until next allowed send time for THIS provider's bucket."""
        bucket = self._rate[provider["name"]]
        with bucket["lock"]:
            now = time.monotonic()
            wait = bucket["next_send_at"] - now
            if wait > 0:
                time.sleep(wait)
            bucket["next_send_at"] = max(now, bucket["next_send_at"]) + bucket["min_interval"]

    def _provider_chain(self) -> list[tuple[dict, str]]:
        """Return (provider, key) pairs in priority order, skipping any whose
        env var is unset."""
        chain: list[tuple[dict, str]] = []
        for p in self.providers:
            k = self.api_keys.get(p["name"])
            if k:
                chain.append((p, k))
        return chain

    def _process_one(self, idx_src: tuple[int, Path]) -> None:
        i, src = idx_src
        chain = self._provider_chain()
        t0 = time.monotonic()
        ok, used, msg = translate_one(src, self.locale, chain,
                                       self.system_prompt,
                                       rate_claim=self._claim_slot)
        elapsed = time.monotonic() - t0
        with self._progress_lock:
            self._progress += 1
            done_now = self._progress
            if ok:
                self.done += 1
                self.by_provider[used] = self.by_provider.get(used, 0) + 1
            else:
                self.failed += 1
        tag = f"ok via {used}" if ok else f"FAIL ({msg})"
        self.log(f"{src.name} → {tag} ({done_now}/{self.target_total}, "
                 f"{elapsed:.1f}s)")

    def run(self, source_files: list[Path]) -> None:
        chain = self._provider_chain()
        if not chain:
            self.log("SKIP — no API key set for any configured provider")
            return
        missing = missing_for_locale(self.locale, source_files)
        if self.limit is not None:
            missing = missing[: self.limit]
        self.target_total = len(missing)
        if self.target_total == 0:
            self.log("nothing to do (locale fully translated)")
            return
        self.log(f"starting — {self.target_total} files, "
                 f"{self.workers} worker{'s' if self.workers > 1 else ''}, "
                 f"chain: {' → '.join(p['name'] for p, _ in chain)}")
        if self.workers <= 1:
            for i, src in enumerate(missing, start=1):
                self._process_one((i, src))
        else:
            tasks = list(enumerate(missing, start=1))
            with cf.ThreadPoolExecutor(max_workers=self.workers) as ex:
                list(ex.map(self._process_one, tasks))
        breakdown = ", ".join(f"{name}:{n}" for name, n in self.by_provider.items() if n)
        self.log(f"done — {self.done} ok ({breakdown}) / {self.failed} failed")


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
    p.add_argument("--workers", type=int, default=1,
                   help="Concurrent translation requests per locale (default: 1). "
                        "Shares one provider-wide rate limit.")
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

    # Each locale gets ALL configured providers as a fallback chain (first = primary).
    chain_names = list(args.providers)
    plan: list[tuple[str, list[str]]] = [(loc, chain_names) for loc in target_locales]

    print("=" * 72)
    print(f"Translation plan — {len(plan)} agents, {len(sources)} source MDX files")
    print(f"System prompt: COMPACT_SYSTEM_PROMPT (~1k tokens) — for full reference "
          f"see {TRANSLATOR_CONTEXT.relative_to(ROOT)}")
    print("=" * 72)
    total_missing = 0
    for i, (loc, prov_list) in enumerate(plan, start=1):
        miss = missing_for_locale(loc, sources)
        if args.limit is not None:
            miss = miss[: args.limit]
        total_missing += len(miss)
        speech, lang_name = LOCALES[loc]
        chain_label = " → ".join(PROVIDERS[n]["name"] for n in prov_list)
        env_states = ["✓" if os.environ.get(PROVIDERS[n]["env"]) else "✗"
                      for n in prov_list]
        print(f"  [{chain_label:<28s} · {i:02d}/{len(plan):02d} · {loc:<3s} → {speech}] "
              f"{lang_name:<22s}  {len(miss):3d} missing  envs:{','.join(env_states)}")
    print("=" * 72)
    print(f"Total translations to do: {total_missing}")
    print()

    if args.dry_run:
        print("(dry-run — no API calls)")
        return 0

    print_lock = threading.Lock()
    workers = [
        LocaleWorker(loc, prov_list, idx, len(plan), system_prompt,
                     args.limit, print_lock, workers=args.workers)
        for idx, (loc, prov_list) in enumerate(plan, start=1)
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
        breakdown = ", ".join(f"{n}:{c}" for n, c in w.by_provider.items() if c)
        print(f"  [{'+'.join(w.provider_names):<14s} · {w.locale}] "
              f"{w.done}/{w.target_total} ok ({breakdown}), "
              f"{w.failed} failed")
    print(f"Grand total: {total_ok} translations succeeded, {total_fail} failed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
