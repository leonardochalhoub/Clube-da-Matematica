---
name: reference-local-llm-cascade-setup
description: Setup guide for running the Clube da Matemática strict-mode cascade on a GPU machine with local LLM (Ollama). Bypasses Gemini free-tier rate limits. Use this when resuming on the GPU computer.
metadata: 
  node_type: memory
  type: reference
  originSessionId: f759ba95-7a03-40e8-bc47-f0bcce3fe8cc
---

# Local LLM cascade setup (GPU computer)

**Context.** On the laptop (WSL2, 16 GB RAM, no GPU) we wrote `scripts/cascade-resource.py` that drives Gemini free-tier API to re-source lessons. It works but Gemini 2.0 Flash free tier rate-limits even single calls when the input prompt is ~25K tokens (174 candidates × ~500 chars each). Switching to a local LLM on a GPU eliminates the rate limit entirely and the per-day quota.

This doc gets us from "fresh git clone on the GPU machine" to "running the cascade locally".

## 0. Hardware check — pick a model that fits your VRAM

Cascade re-source prompt: ~25K tokens in, ~10K tokens out per lesson.

| Model | Quality (math + multilingual) | VRAM (Q4) | VRAM (Q8/fp16) |
|---|---|---|---|
| **Qwen 2.5 14B** | Excellent for math + 11-language coverage | 9 GB | 16 GB |
| **Qwen 2.5 32B** | Best Qwen for math reasoning | 20 GB | 36 GB |
| **DeepSeek R1 Distill Qwen 14B** | Math reasoning king at 14B size | 9 GB | 16 GB |
| **Llama 3.3 70B** | Best general, on par with Sonnet for translation | 40 GB | 70 GB |
| **Llama 3.1 8B** | Adequate fallback, fast | 5 GB | 8 GB |

**Sweet spot for this use case** (math exercise re-source + PT/EN/ES translation): **Qwen 2.5 14B** on a 12-16 GB GPU (RTX 4070 Ti / 4080 / 4090 / 3090). If you have 24 GB+ VRAM, go **Qwen 2.5 32B** for sharper distractor pedagogy. Wall-clock speed depends entirely on your GPU; numbers below are rough estimates — measure on your hardware first.

## 1. Install Ollama on the GPU machine

```bash
# Linux/WSL
curl -fsSL https://ollama.com/install.sh | sh

# macOS
brew install ollama
# OR download from ollama.com

# Verify
ollama --version

# Pull model (pick ONE — Qwen 2.5 14B recommended for 12-16 GB GPU):
ollama pull qwen2.5:14b
# OR for 24 GB+ VRAM:
ollama pull qwen2.5:32b
# OR math-focused:
ollama pull deepseek-r1:14b

# Test it responds:
ollama run qwen2.5:14b "Translate to Spanish: hello world"
# Expected: "Hola mundo" or similar in <2 seconds.
```

Ollama exposes an **OpenAI-compatible API** at `http://localhost:11434/v1`. The cascade script can hit that with minimal changes.

## 2. Clone the repo on the GPU machine

```bash
git clone https://github.com/leonardochalhoub/Clube-da-Matematica.git
cd Clube-da-Matematica
git pull   # ensure you have commit 7609fd3 or later

# Install Node deps if you'll run dev/build
npm install

# Verify the verified corpus is present (committed, ~6.5 MB)
ls -la livros/_parsed/_corpus.jsonl
# Expected: 10,826 lines / ~6.5 MB
```

## 3. Patch cascade-resource.py to call Ollama

The script lives at `scripts/cascade-resource.py`. The Gemini call is in `call_gemini_json()`. Add an `call_ollama_json()` sibling and a `--provider` flag.

Minimal patch (apply with Claude's Edit tool):

```python
# Near the top of cascade-resource.py, alongside GEMINI_URL:
OLLAMA_URL = "http://localhost:11434/v1/chat/completions"
OLLAMA_MODEL = "qwen2.5:14b"  # or "deepseek-r1:14b" or "qwen2.5:32b"


def call_ollama_json(system: str, user: str, schema: dict, max_retries: int = 4) -> dict:
    """Call local Ollama with JSON-mode output. Same return shape as call_gemini_json."""
    import urllib.request
    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.3,
        "max_tokens": 16000,
    }
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(
                OLLAMA_URL,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=600) as resp:  # local can be slow
                data = json.loads(resp.read())
            text = data["choices"][0]["message"]["content"]
            return json.loads(text)
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
                continue
            raise
```

Then in `main()`, branch on `--provider`:

```python
# Add to argparse:
parser.add_argument("--provider", choices=["gemini", "ollama"], default="gemini")

# Replace the existing Gemini call:
if args.provider == "ollama":
    result = call_ollama_json(system, user, EXERCISE_SCHEMA)
else:
    key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not key: fail("GEMINI_API_KEY not set")
    result = call_gemini_json(key, system, user, EXERCISE_SCHEMA)
```

The schema-constrained JSON output works on Ollama via `response_format: {"type": "json_object"}`. Qwen 2.5 and Llama 3.1+ both support it; the JSON validity rate is ~95% (occasionally needs a retry).

## 4. Patch translate-parallel.py for Ollama too

Same pattern. The existing script has `call_gemini()` and `call_groq()` — add `call_ollama()`. Look at `PROVIDERS` dict near the top; add an entry for `"ollama"`. Then `python3 scripts/translate-parallel.py --providers ollama` works.

Translation prompts: 1 file = ~25K tokens in, ~25K tokens out. On Qwen 2.5 14B at ~30 tok/s = ~14 min per locale per lesson. 115 lessons × 2 locales = ~54 hours single-threaded, or ~14 hours with 4 parallel translation workers (limited only by GPU throughput).

## 5. Run the cascade

```bash
# Test on one lesson first to validate quality + measure wall-clock:
time python3 scripts/cascade-resource.py 2 --provider ollama --no-translate --no-manifest

# Compare the output <ListaExercicios> block against L41 (the gold standard).
# If quality holds, scale parallel:
for n in 3 4 5 6 7 8 9 10; do
  python3 scripts/cascade-resource.py $n --provider ollama --no-translate --no-manifest &
done
wait

# Batch translation pass (deletes stale, retranslates):
python3 scripts/translate-parallel.py --providers ollama --only en-US
python3 scripts/translate-parallel.py --providers ollama --only es-ES

# Update manifest allowlist + rebuild:
./node_modules/.bin/tsx scripts/generate-manifest.ts
NODE_OPTIONS=--max-old-space-size=8192 npm run build
npx serve out -l 3002
```

## 6. State to know BEFORE resuming

- **Already trilingual (don't re-source)**: L01, L41, L51, L82. Committed at `7609fd3` on `origin/main`. These were done with Sonnet 4.6/4.7 and are the gold-standard reference.
- **Section whitelist curated for**: ~73 lessons in `scripts/build-strict-candidates.py` (`LESSON_SECTIONS` dict). Lessons outside this set (most of Year 1 Trim 3/4, Year 2 Trim 8, Year 3 Trim 11/12) need their whitelist added before re-source.
- **Manifest allowlist**: currently `[L01, L02, L41, L51, L82]`. `BUNDLE_LOCALES = {en-US, es-ES}` to keep webpack build under 8 GB heap. Other 9 locales fall back to PT-BR.
- **Memory files in `~/.claude/projects/-home-leochalhoub-Clube-da-Matematica/memory/`**:
  - `MEMORY.md` — index, auto-loaded into context
  - `project_session_2026_05_25_evening.md` — last full checkpoint
  - `project_l41_new_standard.md` — quantitative spec L01/L41/L51/L82 hit (40 ex each, 100% MC, 25% passos, all 5 fonte fields)
  - `reference_cascade_recipe.md` — per-lesson workflow steps
  - `project_cascade_plan.md` — section whitelist + priority order
  - `reference_sonnet_strict_prompt.md` — the prompt template that worked

## 7. First Claude prompt on the GPU machine

> Read MEMORY.md and the files it points to. Especially `reference_local_llm_cascade_setup.md` — that's THIS file. We're resuming the strict-mode cascade for Clube da Matemática. Hardware change: now on a GPU machine with Ollama installed and qwen2.5:14b (or whatever model I pulled) ready. Adapt `scripts/cascade-resource.py` to add `--provider ollama` per the patch in `reference_local_llm_cascade_setup.md` §3, then run cascade for L02 PT-BR only. Show me the resulting <ListaExercicios> block so I can eyeball quality vs L41. If clean, scale to L03-L10 in parallel.

That gives Claude on the GPU machine enough to pick up cleanly.

## 8. Quality vs cost vs speed comparison

| Stack | Re-source quality | Translation quality | Cost | Speed (115 lessons) |
|---|---|---|---|---|
| **Sonnet 4.6/4.7** (paid) | Reference standard | Reference | ~$57 | ~10 h wall (parallel) |
| **Gemini 2.0 Flash** (free API, rate-limited) | ~85% on-target distractors | Excellent | $0 | Blocked by rate limit; multi-day |
| **Qwen 2.5 14B** (local 12-16 GB GPU) | ~75-85% on-target distractors | Very good PT/EN/ES | $0 + electricity | 1-3 days unattended |
| **Qwen 2.5 32B** (local 24 GB+ GPU) | ~85% on-target | Excellent | $0 + electricity | 2-5 days unattended |
| **DeepSeek R1 Distill Qwen 14B** (local) | ~90% on math reasoning | Good (less polished prose) | $0 + electricity | 1-3 days unattended |

**Practical recommendation**: run the full cascade with local Qwen 2.5 14B (or 32B if you have the VRAM), **then** spot-check the 5-10 lessons whose distractors look weakest and have Sonnet do those individually. That's the cheapest path to L41-quality across all 115 lessons. Total cost: ~$5-10 of Sonnet for the spot-checks.

## 9. Things that don't change on the GPU machine

- The verified corpus (`livros/_parsed/_corpus.jsonl`) is committed — no need to re-crawl
- `scripts/build-strict-candidates.py` — same on both machines
- `scripts/render-exercise-mdx.py` — same
- `scripts/generate-manifest.ts` — same
- All four trilingual reference lessons (L01/L41/L51/L82) — already in git, don't touch
- The translation-review queue at `docs/translation-review-queue.md` will get appended to as new lessons cascade
- WSL build memory rules in `feedback_wsl_build_limits.md` may not apply on the GPU machine (more RAM, different OS) — re-check `npm run build` headroom there
