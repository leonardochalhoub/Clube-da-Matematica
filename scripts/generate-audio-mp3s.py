#!/usr/bin/env python3
"""
Gera arquivos MP3 pré-renderizados pra cada string de áudio em cada idioma.

Uso: python3 scripts/generate-audio-mp3s.py [--langs=he,vi,et]

Saída: public/audio/<lang>/<sha256>.mp3 — chaveado por hash do texto pra
estabilidade entre runs.

Por que MP3s pré-renderizados?
  Web Speech API depende de vozes instaladas no SISTEMA OPERACIONAL do
  usuário. Hebreu, vietnamita, suaíli, estoniano (e às vezes árabe
  libanês) não vêm em Windows/Chrome por padrão. O áudio "não toca nada"
  ou toca voz default lendo caracteres errados.

  Solução: gerar MP3 com gTTS (Google Translate TTS, free, sem chave) em
  build-time. AudioReader toca o MP3 quando não há voz nativa.

Mapeamento speechLang → gTTS lang:
  - gTTS usa códigos curtos (he, vi, et, sw, ar, hi, etc.).
  - Hebrew em gTTS é 'iw' (legacy) ou 'he' (moderno) — testamos qual aceita.
"""
import argparse
import hashlib
import json
import os
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from threading import Lock

try:
    from gtts import gTTS
except ImportError:
    print("Instale gtts: pip3 install --user gtts", file=sys.stderr)
    sys.exit(1)


ROOT = Path(__file__).resolve().parent.parent
AUDIO_TS = ROOT / 'src/content/audio-translations.generated.ts'
OUT_DIR = ROOT / 'public/audio'

# Mapeamento speechLang → gTTS code
SPEECH_TO_GTTS = {
    'pt-BR': 'pt-BR',
    'en-US': 'en',
    'es-ES': 'es',
    'zh-CN': 'zh-CN',
    'ja-JP': 'ja',
    'de-DE': 'de',
    'fr-FR': 'fr',
    'it-IT': 'it',
    'ru-RU': 'ru',
    'ko-KR': 'ko',
    'vi-VN': 'vi',
    'pl-PL': 'pl',
    'sw-KE': 'sw',
    'ar-LB': 'ar',
    'he-IL': 'iw',  # gTTS usa código legacy
    'hi-IN': 'hi',
    'et-EE': 'et',
}


def parse_audio_translations() -> dict:
    """Faz parse do arquivo TS gerado. Heurística simples."""
    text = AUDIO_TS.read_text(encoding='utf-8')
    # Pattern: '<key>': { 'lang-XX': '<value>', ... }
    # Captura objeto inteiro
    match = re.search(
        r'AUDIO_TRANSLATIONS[^=]*=\s*(\{[\s\S]*\})\s*as\s+const',
        text,
    )
    if not match:
        print("ERRO: estrutura de AUDIO_TRANSLATIONS não reconhecida", file=sys.stderr)
        sys.exit(1)

    # Aval seguro do objeto: usa eval com escopo restrito
    obj_text = match.group(1)
    # JS object → Python dict: ' → "
    # Cuidado: strings podem conter ' escape (\')
    # Estratégia: usa regex pra extrair pares chave→valor manualmente
    return _parse_js_obj(obj_text)


def _parse_js_obj(text: str) -> dict:
    """Parser tolerante. Retorna dict {pt_key: {lang_key: value}}."""
    result = {}
    # Cada entry top-level: '<key>': { ... },
    # Strings podem ter \' escape mas não newlines não-escapadas
    # Vamos procurar padrões `  'KEY': {` e fechar matching `  },`
    lines = text.split('\n')
    i = 0
    cur_key = None
    cur_inner = {}
    while i < len(lines):
        line = lines[i]
        # Linha de top-level key (2 espaços de indent + ')
        m = re.match(r"^  '((?:[^'\\]|\\.)+)':\s*\{(.*)$", line)
        if m:
            cur_key = m.group(1).encode().decode('unicode_escape')
            cur_inner = {}
            rest = m.group(2)
            # Inline empty {}? "{},"
            if re.match(r"\s*\}\s*,?\s*$", rest):
                result[cur_key] = {}
                cur_key = None
            i += 1
            continue
        # Linha de translation entry: "    'lang': '...'"
        if cur_key is not None:
            m = re.match(r"^    '([\w-]+)':\s*'((?:[^'\\]|\\.)*)',?\s*$", line)
            if m:
                lang = m.group(1)
                val = m.group(2).encode().decode('unicode_escape')
                cur_inner[lang] = val
            elif re.match(r"^  \}\s*,?\s*$", line):
                # Fim do bloco
                result[cur_key] = cur_inner
                cur_key = None
                cur_inner = {}
        i += 1
    return result


def text_hash(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()[:16]


def generate_mp3(text: str, gtts_lang: str, out_path: Path) -> bool:
    if out_path.exists() and out_path.stat().st_size > 0:
        return True
    try:
        tts = gTTS(text=text, lang=gtts_lang, slow=False)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        tts.save(str(out_path))
        return True
    except Exception as e:
        print(f"  FAIL [{gtts_lang}] {text[:50]}…: {e}", file=sys.stderr)
        return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--langs', help='Lista de speechLangs (ex: he-IL,vi-VN)')
    parser.add_argument('--limit', type=int, help='Limita N strings (debug)')
    args = parser.parse_args()

    target_langs = None
    if args.langs:
        target_langs = set(args.langs.split(','))

    print(f"📘 Lendo {AUDIO_TS.name}…")
    data = parse_audio_translations()
    print(f"   {len(data)} strings encontradas")

    # Index manifest pra AudioReader saber qual MP3 carregar
    manifest = {}
    total_pares = 0
    pulados = 0
    feitos = 0
    falhas = 0

    items = list(data.items())
    if args.limit:
        items = items[: args.limit]

    # Coleta todas tarefas (evita aninhar locks)
    tasks = []
    for pt_key, translations in items:
        manifest[pt_key] = {}
        for speech_lang, translated_text in translations.items():
            if target_langs and speech_lang not in target_langs:
                continue
            if speech_lang not in SPEECH_TO_GTTS:
                continue
            gtts_lang = SPEECH_TO_GTTS[speech_lang]
            h = text_hash(translated_text)
            mp3_path = OUT_DIR / speech_lang / f'{h}.mp3'
            rel_url = f'/audio/{speech_lang}/{h}.mp3'
            manifest[pt_key][speech_lang] = rel_url
            total_pares += 1
            if mp3_path.exists() and mp3_path.stat().st_size > 0:
                pulados += 1
                continue
            tasks.append((translated_text, gtts_lang, mp3_path, speech_lang))

    print(f"   📋 {pulados} já existem, {len(tasks)} a gerar")

    # Executa em paralelo
    counter_lock = Lock()
    counters = {'feitos': 0, 'falhas': 0}

    def work(task):
        text, gtts_lang, mp3_path, speech_lang = task
        ok = generate_mp3(text, gtts_lang, mp3_path)
        with counter_lock:
            if ok:
                counters['feitos'] += 1
                if counters['feitos'] % 50 == 0:
                    print(f"   {counters['feitos']} gerados…")
            else:
                counters['falhas'] += 1
        return ok

    if tasks:
        with ThreadPoolExecutor(max_workers=20) as ex:
            list(ex.map(work, tasks))

    feitos = counters['feitos']
    falhas = counters['falhas']

    # Salva manifesto JSON pra AudioReader importar
    manifest_path = ROOT / 'src/content/audio-mp3-manifest.generated.json'
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=0),
        encoding='utf-8',
    )

    print(f"\n✅ {feitos} novos MP3, {pulados} já existentes, {falhas} falhas")
    print(f"   Manifesto: {manifest_path}")
    print(f"   Audio dir: {OUT_DIR}")


if __name__ == '__main__':
    main()
