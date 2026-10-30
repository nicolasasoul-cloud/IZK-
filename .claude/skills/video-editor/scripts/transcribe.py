#!/usr/bin/env python3
"""Transcribe a video or audio file with Whisper, word by word.

Writes <out>.json:
  {"language": "en",
   "words":    [{"id": "w0", "text": "Hello", "start": 0.12, "end": 0.48}, ...],
   "segments": [{"start": 0.12, "end": 2.9, "text": "Hello there."}, ...]}

The "words" list is the same shape HyperFrames captions use, so it can be
dropped straight into a caption composition.

Engine: faster-whisper (same Whisper models, runs fast on CPU). Model lookup:
  --model PATH_OR_NAME, else $WHISPER_MODEL, else /opt/whisper-models/small if
  it exists, else "small" (downloaded on first use).

--prompt "Chicana Hippie, IZK" passes brand names and unusual words so Whisper
spells them right (always pass the active brand's names from brand.md).

Usage: transcribe.py INPUT [--out transcript.json] [--language en] [--model small] [--prompt WORDS]
"""
import argparse
import json
import os
import subprocess
import sys

import numpy as np


def pick_model(arg):
    if arg:
        return arg
    if os.environ.get("WHISPER_MODEL"):
        return os.environ["WHISPER_MODEL"]
    if os.path.isdir("/opt/whisper-models/small"):
        return "/opt/whisper-models/small"
    return "small"


def load_audio(path):
    """Decode any video/audio file to 16 kHz mono float32 with ffmpeg."""
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", "16000",
                          "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("--out", default="transcript.json")
    ap.add_argument("--language", default=None, help="e.g. en, es. Default: auto-detect")
    ap.add_argument("--model", default=None)
    ap.add_argument("--prompt", default=None, help="names/words to spell correctly")
    args = ap.parse_args()

    from faster_whisper import WhisperModel

    model = WhisperModel(pick_model(args.model), device="auto", compute_type="int8")
    segments, info = model.transcribe(
        load_audio(args.input),
        language=args.language,
        word_timestamps=True,
        initial_prompt=args.prompt,
        hotwords=args.prompt,
        vad_filter=False,  # keep every utterance: retakes are found from the words
        condition_on_previous_text=False,  # stops Whisper "fixing" a repeated retake away
    )

    words, segs = [], []
    for seg in segments:
        segs.append({"start": round(seg.start, 3), "end": round(seg.end, 3), "text": seg.text.strip()})
        for w in seg.words or []:
            text = w.word.strip()
            if not text:
                continue
            words.append({"id": f"w{len(words)}", "text": text,
                          "start": round(w.start, 3), "end": round(w.end, 3)})

    with open(args.out, "w") as f:
        json.dump({"language": info.language, "words": words, "segments": segs}, f, indent=1, ensure_ascii=False)
    print(f"{len(words)} words, {len(segs)} segments, language={info.language} -> {args.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
