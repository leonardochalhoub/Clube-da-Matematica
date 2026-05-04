#!/usr/bin/env python3
"""
Translate 10 Trim 1 lessons from PT-BR to Japanese (ja-JP).
Uses Claude Haiku for cost efficiency.
Preserves MDX structure, math notation, URLs, component names, and exercise IDs.
"""

import os
import sys
import re
from pathlib import Path
import anthropic

# Lessons to translate
LESSONS = [
    "licao-01-conjuntos-intervalos",
    "licao-02-funcoes",
    "licao-03-afim",
    "licao-04-quadratica",
    "licao-05-composicao-inversa",
    "licao-06-exponencial",
    "licao-07-logaritmo",
    "licao-08-crescimento",
    "licao-09-taxa-variacao",
    "licao-10-consolidacao-trim-1",
]

BASE_SOURCE = "/home/leochalhoub/Clube-da-Matematica/content/aulas/ano-1/trim-1"
BASE_TARGET = "/home/leochalhoub/Clube-da-Matematica/content/i18n/ja-JP/aulas/ano-1/trim-1"

def read_file_in_chunks(filepath, chunk_size=20000):
    """Read file and yield chunks for processing."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into logical chunks: frontmatter + body sections
    parts = content.split('\n---\n', 1)
    if len(parts) == 2:
        frontmatter = parts[0]
        body = parts[1]
        # Reconstruct frontmatter chunk
        yield ('frontmatter', frontmatter)

        # Split body into manageable chunks
        remaining = body
        while remaining:
            if len(remaining) <= chunk_size:
                yield ('body', remaining)
                break
            else:
                # Find a good split point (after a component)
                chunk = remaining[:chunk_size]
                last_nl = chunk.rfind('\n')
                if last_nl > 0:
                    chunk = remaining[:last_nl]
                yield ('body', chunk)
                remaining = remaining[len(chunk):]
    else:
        yield ('body', content)

def translate_chunk(client, chunk_text, chunk_type, lesson_name):
    """Translate a single chunk using Claude Haiku."""

    if chunk_type == 'frontmatter':
        # Frontmatter: only translate titulo and descricao
        prompt = f"""Translate this MDX frontmatter from PT-BR to Japanese (ja-JP).

RULES:
1. Translate only 'titulo' and 'descricao' fields (the string values in quotes)
2. Keep all other frontmatter unchanged: slug, categoria, subcategoria, tags, etc.
3. Replace "Lição N" with "第N課" in the title
4. Do NOT change field names or structure

Keep the exact same YAML structure. Output ONLY the translated frontmatter:

{chunk_text}"""
    else:
        # Body: translate prose, component content, but preserve math, URLs, component names
        prompt = f"""Translate this MDX content section from PT-BR to Japanese (ja-JP).

RULES:
1. Translate body prose, list items, headings
2. Translate <Porta> content (the 7 doors)
3. Translate exercise statements, solucao/passos/dica content
4. Translate legenda and audioTexto JSX content
5. Translate <aside>, blockquote prose, **Fonte.** text (NOT URL)
6. DO NOT TOUCH: all $...$ and $$...$$ (LaTeX math), <Eq>{`...`}</Eq>, URLs, slug, categoria, tags, numero, dificuldade, correta, component/prop names, exercise IDs, <code>
7. Convert decimal commas to dots (1,5 → 1.5)
8. Tone: 丁寧な学術的日本語 (polite academic Japanese, です・ます調)
9. Remove any stray </content> tags at the end if present

Preserve MDX structure exactly. Output ONLY the translated content:

{chunk_text}"""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=4000,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.content[0].text

def translate_lesson(lesson_name):
    """Translate one entire lesson file."""
    source_file = Path(BASE_SOURCE) / f"{lesson_name}.mdx"
    target_file = Path(BASE_TARGET) / f"{lesson_name}.mdx"

    if not source_file.exists():
        print(f"[translator-ja] ERROR: {lesson_name} source not found")
        return False

    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    print(f"[translator-ja] Reading {lesson_name}...")
    translated_content = ""
    total_chunks = 0

    # Process file in chunks
    chunks = list(read_file_in_chunks(str(source_file)))
    total_chunks = len([c for c in chunks if c[0] == 'body'])
    body_count = 0

    for chunk_type, chunk_text in chunks:
        try:
            if chunk_type == 'frontmatter':
                print(f"[translator-ja] Translating frontmatter...")
                translated_chunk = translate_chunk(client, chunk_text, chunk_type, lesson_name)
                translated_content += translated_chunk + "\n---\n"
            else:
                body_count += 1
                print(f"[translator-ja] Translating body chunk {body_count}/{total_chunks}...")
                translated_chunk = translate_chunk(client, chunk_text, chunk_type, lesson_name)
                # Strip any stray </content> tags
                translated_chunk = translated_chunk.replace('</content>', '')
                translated_content += translated_chunk
        except Exception as e:
            print(f"[translator-ja] ERROR translating {lesson_name}: {e}")
            return False

    # Write translated file
    try:
        target_file.parent.mkdir(parents=True, exist_ok=True)
        with open(target_file, 'w', encoding='utf-8') as f:
            f.write(translated_content)
        print(f"[translator-ja 1/10] translated {lesson_name} (ja-JP)")
        return True
    except Exception as e:
        print(f"[translator-ja] ERROR writing {target_file}: {e}")
        return False

def main():
    """Translate all 10 lessons."""
    success_count = 0
    for idx, lesson in enumerate(LESSONS, 1):
        if translate_lesson(lesson):
            success_count += 1

    print(f"\n[translator-ja] Completed: {success_count}/{len(LESSONS)} lessons translated")
    return success_count == len(LESSONS)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
