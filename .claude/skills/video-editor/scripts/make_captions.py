#!/usr/bin/env python3
"""Build a HyperFrames captions sub-composition from timed words, in brand style.

Input: cuts.json (its "words" are already re-timed to the edited video) or a
transcript.json. Words are grouped (max 4 by default; 3 for punchy, 5 for calm),
one group on screen at a time, and each word lights up in the accent colour as
it is spoken. Follows hyperframes/references/captions.md: groups open at their
first word, hard-kill after their exit, sized with fitTextFontSize.

Usage:
  make_captions.py WORDS.json OUT.html --width 1080 --height 1920 \
      --font "Fraunces" --weight 800 --ink "#18130d" --accent "#bd7f21" \
      [--fix "Shakana=Chicana"] [--max-words 3] [--bottom 700]

--fix corrects words Whisper misheard (repeatable, case-sensitive).
--bottom is the caption's distance from the bottom edge in px
(portrait 600-700 keeps it above TikTok/Reels buttons; landscape ~100).
The fonts' @font-face must be declared in the file; pass --font-css with the
@font-face rules (or a path to a .css file holding them).
"""
import argparse
import html
import json
import os
import re


def groups_of(words, max_words):
    """Split at sentence ends, commas and pauses >= 150 ms, then cut each run into
    evenly sized chunks of at most max_words (no one-word orphans)."""
    runs, cur = [], []
    for w in words:
        if cur and w["start"] - cur[-1]["end"] >= 0.15:
            runs.append(cur)
            cur = []
        cur.append(w)
        if re.search(r"[.!?,;:]$", w["text"]):
            runs.append(cur)
            cur = []
    if cur:
        runs.append(cur)
    out = []
    for r in runs:
        k = -(-len(r) // max_words)
        size = -(-len(r) // k)
        out += [r[i:i + size] for i in range(0, len(r), size)]
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("words")
    ap.add_argument("out")
    ap.add_argument("--id", default="captions")
    ap.add_argument("--width", type=int, default=1080)
    ap.add_argument("--height", type=int, default=1920)
    ap.add_argument("--font", default="Inter")
    ap.add_argument("--weight", default="800")
    ap.add_argument("--ink", default="#ffffff")
    ap.add_argument("--accent", default="#ffd400")
    ap.add_argument("--max-words", type=int, default=4)
    ap.add_argument("--bottom", type=int, default=None)
    ap.add_argument("--fix", action="append", default=[])
    ap.add_argument("--font-css", default="")
    args = ap.parse_args()

    words = json.load(open(args.words))["words"]
    fixes = dict(f.split("=", 1) for f in args.fix)
    for w in words:
        for bad, good in fixes.items():
            w["text"] = w["text"].replace(bad, good)
    portrait = args.height > args.width
    bottom = args.bottom if args.bottom is not None else (640 if portrait else 110)
    max_w = 900 if portrait else 1600
    font_css = args.font_css
    if font_css and os.path.isfile(font_css):
        font_css = open(font_css).read()

    groups = groups_of(words, args.max_words)
    markup, tweens = [], []
    for gi, g in enumerate(groups):
        start = max(0.1, g[0]["start"] - 0.05)
        if markup:  # never before the previous group is gone
            start = max(start, prev_end)
        # Stay up until the next group opens (one group on screen at a time).
        if gi + 1 < len(groups):
            end = max(groups[gi + 1][0]["start"] - 0.05, 0.1)
            end = min(end, g[-1]["end"] + 0.6)
        else:
            end = g[-1]["end"] + 0.6
        end = max(end, start + 0.3)
        prev_end = end
        spans = "".join(f'<span id="cw{gi}-{wi}" class="cw">{html.escape(w["text"])}</span> '
                        for wi, w in enumerate(g))
        markup.append(f'    <div id="cg{gi}" class="cg clip" data-start="{start:.2f}" '
                      f'data-duration="{end - start:.2f}"><div class="cg-in">{spans.strip()}</div></div>')
        tweens.append(f'  fit("#cg{gi} .cg-in");')
        tweens.append(f'  tl.fromTo("#cg{gi} .cg-in", {{opacity: 0, y: 24, scale: 0.96}}, '
                      f'{{opacity: 1, y: 0, scale: 1, duration: 0.18, ease: "power3.out"}}, {start:.2f});')
        for wi, w in enumerate(g):
            tweens.append(f'  tl.to("#cw{gi}-{wi}", {{color: "{args.accent}", duration: 0.08}}, {w["start"]:.2f});')
        tweens.append(f'  tl.to("#cg{gi} .cg-in", {{opacity: 0, duration: 0.12, ease: "power2.in"}}, {end - 0.12:.2f});')
        # Hard kill on the inner element: lint forbids visibility on a .clip itself.
        tweens.append(f'  tl.set("#cg{gi} .cg-in", {{opacity: 0, visibility: "hidden"}}, {end:.2f});')

    doc = f"""<template>
  <style>
{font_css}
    #root {{ position: absolute; inset: 0; }}
    .cg {{ position: absolute; left: 0; right: 0; bottom: {bottom}px; text-align: center; overflow: visible; }}
    .cg-in {{ display: inline-block; max-width: {max_w}px; font-family: "{args.font}"; font-weight: {args.weight};
      color: {args.ink}; line-height: 1.05; letter-spacing: -0.02em; }}
    .cw {{ display: inline-block; }}
  </style>
  <div id="root" data-composition-id="{args.id}" data-width="{args.width}" data-height="{args.height}">
{chr(10).join(markup)}
  </div>
  <script>
  const tl = gsap.timeline({{ paused: true }});
  const fit = (sel) => {{
    const el = document.querySelector(sel);
    const r = window.__hyperframes.fitTextFontSize(el.textContent, {{
      fontFamily: "{args.font}", fontWeight: {args.weight}, maxWidth: {max_w}, baseFontSize: {96 if portrait else 78}, minFontSize: 42 }});
    el.style.fontSize = r.fontSize + "px";
  }};
{chr(10).join(tweens)}
  window.__timelines["{args.id}"] = tl;
  </script>
</template>
"""
    open(args.out, "w").write(doc)
    print(f"{len(groups)} caption groups -> {args.out}")


if __name__ == "__main__":
    main()
