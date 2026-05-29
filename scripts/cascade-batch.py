#!/usr/bin/env python3
"""cascade-batch.py — run cascade-resource.py for many lessons in parallel.

Spawns N worker threads, each running one cascade-resource.py call. Workers
are I/O bound (LLM API + Ollama HTTP), so threading is enough. The provider
chain handles per-lesson fallback (Cerebras → OpenRouter → Ollama), so if
Cerebras rate-limits one worker, that worker drops to OpenRouter
automatically — no global rate budget needed here.

Usage:
    source .env.local && set -a && set +a  # export keys
    python3 scripts/cascade-batch.py 3 4 5 6 7 8 9 10 --workers 20
    python3 scripts/cascade-batch.py --whitelisted --workers 20    # all 73 whitelisted lessons
    python3 scripts/cascade-batch.py --range 3 20 --workers 12     # L03-L20

Live progress is printed as each lesson finishes.
"""
from __future__ import annotations

import argparse
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Lessons that build-strict-candidates.py has a section whitelist for.
WHITELISTED = (
    list(range(1, 21))               # 1..20  — functions, trig
    + list(range(21, 41))            # 21..40 — analytic geom, conics, vectors, matrices, prob
    + list(range(41, 71))            # 41..70 — limits, derivatives
    + list(range(81, 101))           # 81..100 — integration, ODEs
    + [111, 112, 113]                # 111..113 — vectors / planes
)
# Lessons already at L41 gold standard — don't re-cascade.
SKIP = {
    # Gold-standard already shipped
    1, 41, 51, 82,
    # Done this session
    2, 3, 4, 5, 6, 7, 8, 9, 12, 14, 19,
    # Pre-existing whitelist bugs (point to nonexistent corpus sections — fix later)
    15, 17, 18,
}


def cascade_one(lesson_num: int, provider: str, batch_size: int, candidate_cap: int) -> dict:
    t0 = time.time()
    cmd = [
        sys.executable, "-u", str(ROOT / "scripts" / "cascade-resource.py"),
        str(lesson_num),
        "--provider", provider,
        "--batch-size", str(batch_size),
        "--candidate-cap", str(candidate_cap),
        "--no-translate", "--no-manifest",
    ]
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=ROOT)
    elapsed = time.time() - t0
    # extract exercise count + provider used from stdout
    n_ex = "?"
    used = "?"
    for line in r.stdout.splitlines():
        if " returned " in line and " exercises" in line:
            # "cerebras returned 45 exercises"
            parts = line.split()
            for i, w in enumerate(parts):
                if w == "returned" and i + 1 < len(parts):
                    n_ex = parts[i + 1]
                if w in ("cerebras", "openrouter", "ollama", "gemini"):
                    used = w
            break
    return {
        "lesson": lesson_num,
        "rc": r.returncode,
        "elapsed_s": round(elapsed, 1),
        "exercises": n_ex,
        "provider": used,
        "stderr_tail": (r.stderr or "")[-300:].strip(),
        "stdout_tail": (r.stdout or "")[-300:].strip(),
    }


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("lessons", nargs="*", type=int, help="lesson numbers to cascade")
    p.add_argument("--whitelisted", action="store_true",
                   help="use the full whitelist (73 lessons, minus already-done)")
    p.add_argument("--range", type=int, nargs=2, metavar=("LO", "HI"),
                   help="cascade lessons LO..HI inclusive (filtered to whitelist)")
    p.add_argument("--workers", type=int, default=20)
    p.add_argument("--provider", default="chain")
    p.add_argument("--batch-size", type=int, default=45)
    p.add_argument("--candidate-cap", type=int, default=80)
    p.add_argument("--skip-done", action="store_true", default=True,
                   help="skip L01/L41/L51/L82 (already at gold standard)")
    args = p.parse_args()

    if args.whitelisted:
        lessons = sorted(set(WHITELISTED))
    elif args.range:
        lo, hi = args.range
        lessons = sorted(n for n in WHITELISTED if lo <= n <= hi)
    else:
        lessons = sorted(set(args.lessons))

    if args.skip_done:
        lessons = [n for n in lessons if n not in SKIP]

    if not lessons:
        print("no lessons to cascade", file=sys.stderr)
        return 1

    print(f"cascade-batch: {len(lessons)} lesson(s), {args.workers} workers, provider={args.provider}, batch={args.batch_size}")
    print(f"lessons: {lessons}")
    print()

    results: list[dict] = []
    t_start = time.time()
    done = 0
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {
            pool.submit(cascade_one, n, args.provider, args.batch_size, args.candidate_cap): n
            for n in lessons
        }
        for fut in as_completed(futures):
            r = fut.result()
            results.append(r)
            done += 1
            status = "OK" if r["rc"] == 0 else "FAIL"
            elapsed_total = time.time() - t_start
            print(
                f"[{done:3d}/{len(lessons)}] L{r['lesson']:>3}: "
                f"{status:4s}  {r['elapsed_s']:5.1f}s  "
                f"provider={r['provider']:9s}  exercises={r['exercises']:>3}  "
                f"(batch elapsed {elapsed_total:.0f}s)",
                flush=True,
            )
            if r["rc"] != 0:
                print(f"        stderr: {r['stderr_tail'][:200]}", file=sys.stderr, flush=True)

    elapsed_total = time.time() - t_start
    ok = sum(1 for r in results if r["rc"] == 0)
    fail = len(results) - ok
    print()
    print(f"=== summary: {ok} OK / {fail} FAIL in {elapsed_total:.0f}s "
          f"(avg {elapsed_total/len(results):.1f}s/lesson, "
          f"theoretical serial {sum(r['elapsed_s'] for r in results):.0f}s) ===")

    providers_used: dict[str, int] = {}
    for r in results:
        if r["rc"] == 0:
            providers_used[r["provider"]] = providers_used.get(r["provider"], 0) + 1
    if providers_used:
        print("by provider:", dict(sorted(providers_used.items(), key=lambda x: -x[1])))

    if fail:
        print(f"\nfailed lessons: {[r['lesson'] for r in results if r['rc'] != 0]}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
