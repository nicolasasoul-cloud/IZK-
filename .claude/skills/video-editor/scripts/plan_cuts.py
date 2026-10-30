#!/usr/bin/env python3
"""Find retakes and long pauses in a word-level transcript and plan the cuts.

Reads the transcript.json from transcribe.py and writes cuts.json:
  {"keep": [[start, end], ...],        # source-time ranges to keep, in order
   "removed": [{"start", "end", "why", "text"}, ...],
   "words": [...]}                     # kept words re-timed to the edited video

Rules (from the video-editor skill):
  * A spoken cue ("let's redo that", "scratch that", "start over", ...) throws
    away the sentence it interrupts and the cue itself.
  * A sentence that is started again (same first words as the next one, or a
    fragment the next one repeats) is a retake: only the LAST take is kept.
  * Any silence longer than --max-pause (0.5 s) is shortened, leaving --pad on
    each side of the speech so words are not clipped.

Always print the report and show it to the person: the heuristics can be wrong,
and they are the director.

Usage: plan_cuts.py transcript.json [--out cuts.json] [--max-pause 0.5] [--pad 0.12]
"""
import argparse
import json
import re

CUE_PATTERNS = [
    r"let'?s (re ?do|redo) (that|this|it)",
    r"let me (re ?do|redo|start over|try (that|this|it) again|say (that|this|it) again)",
    r"(re ?do|redo) (that|this)",
    r"scratch that",
    r"start (that )?over",
    r"one more time",
    r"take (two|2|three|3)",
    r"try (that|this|it) again",
    r"from the top",
    r"cut (that|this)",
]
CUE_RE = re.compile(r"\b(" + "|".join(CUE_PATTERNS) + r")\b")
SENTENCE_GAP = 0.7  # a silence this long also ends a sentence


def norm(t):
    return re.sub(r"[^a-z0-9' ]", "", t.lower()).strip()


def sentences(words):
    """Split words into sentences on end punctuation or a long gap."""
    out, cur = [], []
    for i, w in enumerate(words):
        if cur and w["start"] - cur[-1]["end"] >= SENTENCE_GAP:
            out.append(cur)
            cur = []
        cur.append(w)
        if re.search(r"[.!?]$", w["text"]) or w["text"].endswith(("—", "-", "…")):
            out.append(cur)
            cur = []
    if cur:
        out.append(cur)
    return out


def sent_text(s):
    return " ".join(norm(w["text"]) for w in s).split()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("transcript")
    ap.add_argument("--out", default="cuts.json")
    ap.add_argument("--max-pause", type=float, default=0.5)
    ap.add_argument("--pad", type=float, default=0.12)
    args = ap.parse_args()

    data = json.load(open(args.transcript))
    words = data["words"]
    sents = sentences(words)
    drop = [False] * len(sents)
    why = [""] * len(sents)

    for i, s in enumerate(sents):
        text = " ".join(sent_text(s))
        m = CUE_RE.search(text)
        if m:
            drop[i] = True
            why[i] = f'redo cue "{m.group(0)}"'
            # The cue usually follows a broken sentence: drop that one too,
            # unless it is the same sentence as what comes after (handled below).
            if i > 0 and not drop[i - 1]:
                drop[i - 1] = True
                why[i - 1] = "take before a redo cue"

    # Restarted sentences: keep the last take.
    for i in range(len(sents) - 1):
        if drop[i]:
            continue
        a = sent_text(sents[i])
        j = i + 1
        while j < len(sents) and drop[j] and "redo cue" in why[j]:
            j += 1
        if j >= len(sents):
            continue
        b = sent_text(sents[j])
        if not a or not b:
            continue
        n = min(3, len(a), len(b))
        same_start = a[:n] == b[:n]
        fragment = len(a) < len(b) and b[: len(a)] == a
        if same_start or fragment:
            drop[i] = True
            why[i] = "restarted sentence (kept the later take)"

    kept_words, removed = [], []
    for s, d, y in zip(sents, drop, why):
        if d:
            removed.append({"start": s[0]["start"], "end": s[-1]["end"], "why": y,
                            "text": " ".join(w["text"] for w in s)})
        else:
            kept_words.extend(s)

    # Build keep ranges around kept speech, closing any gap > max_pause.
    keep = []
    for w in kept_words:
        st, en = max(0.0, w["start"] - args.pad), w["end"] + args.pad
        if keep and st - keep[-1][1] <= args.max_pause - 2 * args.pad:
            keep[-1][1] = max(keep[-1][1], en)
        elif keep and st <= keep[-1][1]:
            keep[-1][1] = max(keep[-1][1], en)
        else:
            if keep:
                gap = st - keep[-1][1]
                removed.append({"start": round(keep[-1][1], 3), "end": round(st, 3),
                                "why": f"pause ({gap + 2 * args.pad:.2f}s of silence)", "text": ""})
            keep.append([st, en])
    keep = [[round(a, 3), round(b, 3)] for a, b in keep]

    # Re-time kept words onto the edited timeline (for captions).
    retimed, offset_map = [], []
    t = 0.0
    for a, b in keep:
        offset_map.append((a, b, t))
        t += b - a
    for w in kept_words:
        for a, b, t0 in offset_map:
            if a <= w["start"] < b:
                retimed.append({"id": f"w{len(retimed)}", "text": w["text"],
                                "start": round(t0 + w["start"] - a, 3),
                                "end": round(t0 + min(w["end"], b) - a, 3)})
                break

    json.dump({"keep": keep, "removed": sorted(removed, key=lambda r: r["start"]),
               "duration": round(t, 3), "words": retimed},
              open(args.out, "w"), indent=1, ensure_ascii=False)

    print(f"Original speech span: {words[0]['start']:.2f}-{words[-1]['end']:.2f}s  ->  edited length {t:.2f}s")
    for r in sorted(removed, key=lambda r: r["start"]):
        print(f"  CUT {r['start']:7.2f}-{r['end']:7.2f}  {r['why']}" + (f": {r['text']}" if r["text"] else ""))
    print("KEPT: " + " ".join(w["text"] for w in kept_words))


if __name__ == "__main__":
    main()
