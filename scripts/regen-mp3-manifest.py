#!/usr/bin/env python3
"""
Regenera o manifesto JSON dos MP3s, incluindo APENAS arquivos que
existem no disco (com size > 0).

Útil quando gTTS rate-limita e algumas MP3s falham — não queremos referenciar
arquivos vazios no manifesto.
"""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AUDIO_TS = ROOT / 'src/content/audio-translations.generated.ts'
MANIFEST_OUT = ROOT / 'src/content/audio-mp3-manifest.generated.json'
AUDIO_DIR = ROOT / 'public/audio'


def text_hash(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()[:16]


def parse_audio_translations() -> dict:
    text = AUDIO_TS.read_text(encoding='utf-8')
    result = {}
    lines = text.split('\n')
    cur_key = None
    cur_inner = {}
    i = 0
    while i < len(lines):
        line = lines[i]
        m = re.match(r"^  '((?:[^'\\]|\\.)+)':\s*\{(.*)$", line)
        if m:
            cur_key = m.group(1).encode().decode('unicode_escape')
            cur_inner = {}
            rest = m.group(2)
            if re.match(r"\s*\}\s*,?\s*$", rest):
                result[cur_key] = {}
                cur_key = None
            i += 1
            continue
        if cur_key is not None:
            m = re.match(r"^    '([\w-]+)':\s*'((?:[^'\\]|\\.)*)',?\s*$", line)
            if m:
                lang = m.group(1)
                val = m.group(2).encode().decode('unicode_escape')
                cur_inner[lang] = val
            elif re.match(r"^  \}\s*,?\s*$", line):
                result[cur_key] = cur_inner
                cur_key = None
                cur_inner = {}
        i += 1
    return result


def main():
    data = parse_audio_translations()
    manifest = {}
    incluidos = 0
    omitidos = 0
    for pt_key, translations in data.items():
        manifest[pt_key] = {}
        for speech_lang, translated_text in translations.items():
            h = text_hash(translated_text)
            mp3_path = AUDIO_DIR / speech_lang / f'{h}.mp3'
            if mp3_path.exists() and mp3_path.stat().st_size > 0:
                manifest[pt_key][speech_lang] = f'/audio/{speech_lang}/{h}.mp3'
                incluidos += 1
            else:
                omitidos += 1
    MANIFEST_OUT.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=0),
        encoding='utf-8',
    )
    print(f"✅ Manifesto regenerado: {MANIFEST_OUT}")
    print(f"   Incluídos: {incluidos}")
    print(f"   Omitidos:  {omitidos} (MP3 ausente ou vazio)")


if __name__ == '__main__':
    main()
