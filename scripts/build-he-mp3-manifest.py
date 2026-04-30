#!/usr/bin/env python3
"""Constrói manifest pt-BR → URL do MP3 hebraico.

NOTA: hashes dos MP3s existentes foram gerados com decode broken
(unicode_escape) do Hebrew. Pra match, usamos esse mesmo broken decode
no Hebrew (só para hash). PT keys mantemos UTF-8 correto.
"""
import re, json, hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AUDIO_TS = ROOT / 'src/content/audio-translations.generated.ts'
MP3_DIR = ROOT / 'public/audio/he-IL'
OUT = ROOT / 'src/content/audio-mp3-he.generated.json'

def unescape_clean(s):
    out, i = [], 0
    while i < len(s):
        if s[i] == '\\' and i+1 < len(s):
            n = s[i+1]
            if n == "'": out.append("'"); i += 2
            elif n == '\\': out.append('\\'); i += 2
            elif n == 'n': out.append('\n'); i += 2
            else: out.append(s[i]); i += 1
        else: out.append(s[i]); i += 1
    return ''.join(out)

def unescape_broken(s):
    return s.encode().decode('unicode_escape')

text = AUDIO_TS.read_text(encoding='utf-8')
result, cur, inner = {}, None, {}
for line in text.split('\n'):
    m = re.match(r"^  '((?:[^'\\]|\\.)+)':\s*\{(.*)$", line)
    if m:
        cur = unescape_clean(m.group(1))
        inner = {}
        if re.match(r"\s*\}\s*,?\s*$", m.group(2)):
            result[cur] = {}
            cur = None
        continue
    if cur is not None:
        m = re.match(r"^    '([\w-]+)':\s*'((?:[^'\\]|\\.)*)',?\s*$", line)
        if m:
            inner[m.group(1)] = unescape_broken(m.group(2))
        elif re.match(r"^  \}\s*,?\s*$", line):
            result[cur] = inner
            cur, inner = None, {}

manifest = {}
for pt, trans in result.items():
    he = trans.get('he-IL')
    if not he: continue
    h = hashlib.sha256(he.encode('utf-8')).hexdigest()[:16]
    p = MP3_DIR / f'{h}.mp3'
    if p.exists() and p.stat().st_size > 0:
        manifest[pt] = f'/audio/he-IL/{h}.mp3'

OUT.write_text(json.dumps(manifest, ensure_ascii=False, indent=0), encoding='utf-8')
print(f"✅ {len(manifest)} entries")
