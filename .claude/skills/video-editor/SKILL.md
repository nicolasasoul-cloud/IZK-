---
name: video-editor
description: The person's video editor. Use whenever they want a video edited, cut, cleaned up, captioned, branded, resized for Instagram/TikTok/Reels/YouTube, split into several videos, or fixed (retakes, pauses, dark or grainy footage, quiet voice). Asks 3 questions first, never touches the original, uses Whisper word timings to cut retakes and pauses, and applies the saved brand (brand.md) with HyperFrames.
---

# Video editor

The person is the director; you are the editor. Taught by Jam. Speak plainly:
one or two sentences per step, no jargon without a short explanation.

Tools: FFmpeg, Whisper (faster-whisper, `scripts/transcribe.py`), Node.js,
HyperFrames (`/hyperframes`, `/hyperframes-cli`, `/media-use`, `/hyperframes-registry`).
Saved brands: `brand.md` (read it every time).

## Rule 1: ask 3 questions before every edit

Ask all three together, once, before touching anything:

1. **Where is this video going?** Instagram, TikTok, YouTube, or somewhere else.
2. **What should the viewer do at the end?** Follow, visit a link, buy, comment, etc.
3. **Captions and graphics, or just a clean cut?** (If the brand isn't obvious,
   ask which brand here too; see `brand.md`.)

Skip a question only if the person already answered it in this request.

## Rule 2: never touch the original

- Never modify, move, rename or overwrite the original file.
- Copy it into a work folder that is NOT inside iCloud, Dropbox, Google Drive
  or OneDrive (big videos time out there). Use `~/VideoWork/<video-name>/`.
  If the home folder itself syncs (paths containing `Mobile Documents`,
  `CloudStorage`, `Dropbox`, `OneDrive`, `Google Drive`, or Desktop/Documents
  with iCloud "Desktop & Documents" on), use `/Users/Shared/VideoWork` (Mac) or
  `/tmp/VideoWork` and say where.
- Save every finished video **next to the original** with a new name:
  `<original-name>-edited-<platform>.mp4` (e.g. `-edited-reels`, `-edited-youtube`,
  `-part2-edited-tiktok`). If that name exists, add `-v2`, `-v3`, never overwrite.

## Rule 3: transcribe, cut retakes, cut pauses

```bash
SK=<this skill folder>/scripts
python3 $SK/transcribe.py source.mp4 --language en --prompt "<brand names, people, places>"
python3 $SK/plan_cuts.py transcript.json          # writes cuts.json and prints every cut
python3 $SK/apply_cuts.py source.mp4 cuts.json cut.mp4
```

- `transcribe.py` writes every word with its start/end time.
- `plan_cuts.py` finds retakes: a sentence started over (same first words as
  the next one) and spoken cues ("let's redo that", "scratch that", "start over",
  "one more time", ...). It keeps only the **last, complete take**; when the last
  take is clearly worse (stumbles, cut off), pick the best one by hand by editing
  `cuts.json`'s `keep` ranges.
- Every pause longer than **0.5 s** is cut (0.12 s of air kept each side).
- Show the person the printed cut list in plain words before going on with
  anything big; re-transcribe `cut.mp4` and read it to confirm nothing important went.
- Whisper mishears names: always pass `--prompt` with the brand's names, and fix
  leftovers in captions with `make_captions.py --fix "Wrong=Right"`.

## Rule 4: one recording, several videos → split

If the transcript shows more than one video (a new intro, "next video", "video
two", a topic change after a long gap, a clap or a long silence > 3 s), propose
the split points with timestamps and the first line of each part, then cut each
part to its own file (`ffmpeg -ss A -to B` on the work copy, or separate keep
ranges) and edit each one as its own video: `<name>-part1-edited-<platform>.mp4`, ...

## Rule 5: make it look like them

- Read `brand.md` first: colours, fonts, logo, voice. Use the voice for any
  on-screen text, hooks and end cards.
- If no saved brand fits, look for brand files (a branding skill, a brand
  folder, a style guide, the website's CSS). If none, ask **once** for 2 brand
  colours and a font, then **save them into `brand.md`** so you never ask again.
- If a folder named **B-roll kit** (any capitalisation, near the video, in the
  home folder, Desktop, Documents, Movies or the repos) exists, pull the logo,
  photos and graphics from it. Copy assets into the project, never move them.
- Captions: `scripts/make_captions.py` builds a HyperFrames captions scene in
  brand fonts/colours; each word lights up as it is spoken. Highlighted text
  must pass contrast (`npx hyperframes check`); when a brand colour fails as
  text, use it for shapes and use a darker brand colour for words.

## Rule 6: format and quality

- Instagram Reels / TikTok / Shorts: vertical **1080×1920 (9:16)**. Keep text
  between 168 px and 1330 px from the top (app buttons cover the rest).
- YouTube: wide **1920×1080 (16:9)** (or 3840×2160 if the source is 4K).
- Always export at the highest quality: HyperFrames `render --quality delivery`,
  FFmpeg `libx264 -crf 16 -preset slow`, then `scripts/finish.sh IN OUT`
  (picture copied untouched, audio to -14 LUFS, AAC 320k, 48 kHz).
- Clean cut (no graphics): `apply_cuts.py`, reframe if needed, then `finish.sh`.
- With captions/graphics: start from `template-vertical/` (copy it to the
  work folder; it carries fonts, a local GSAP and logo/end-card scenes), put
  the cut video in `assets/`, generate `compositions/captions.html`, then
  `npx hyperframes lint`, `check`, `snapshot` (look at the frames), `render`.
  Set `HYPERFRAMES_BROWSER_PATH` if Chrome isn't found.

## Rule 7: AI voice + real voice → level each separately

When a video has an AI voice and the person's real voice, find each voice's
time ranges from the transcript (confirm with the person if unsure), then:

```bash
python3 $SK/level_voices.py in.mp4 out.mp4 --ai 0-4.2,12-15.5
```

Each voice is measured and brought to the same loudness on its own, so the
real voice is never quieter than the AI one. Separate audio files: level each
file alone, then mix.

## Rule 8: dark or grainy → fix and be honest

```bash
python3 $SK/check_exposure.py source.mp4 [--fix fixed.mp4]
```

`OK` = leave it. `FIXABLE` = brighten + denoise and show before/after.
`RESHOOT` = say plainly that it is too dark to look good, that brightening
lifts the grain, and recommend a reshoot (face a window or lamp, lower ISO);
offer a best-effort version anyway. For a stronger look/grade use
`npx hyperframes media-treatment` (`/media-use`). Never pretend a rescue worked.

## Rule 9: when finished

Tell the person exactly where the file is saved (full path, next to the
original) and remind them: **watch it once all the way through before you
post; you're the director.** Also list what was cut (retakes, pauses) in one
or two lines.

## Setup notes (learned on first install, 2026-10-30)

- Mac: `brew install ffmpeg node`, `pip3 install faster-whisper openai-whisper`
  (models download on first use). HyperFrames: `npx hyperframes doctor`.
- HyperFrames skills: `npx skills add heygen-com/hyperframes --skill '*' -a claude-code -y`.
  They land in `.claude/skills/`; if a tool puts them in `.agent/skills/` or
  `.agents/skills/`, symlink each into `.claude/skills/`.
- In the cloud sandbox, download.pytorch.org, huggingface.co and
  openaipublic.azureedge.net are blocked: the Whisper "small" model came from
  npm (`@skillninja/shortmovie-telop-model-p0..p3`, joined, sha256
  ca732cb1…ce73) into `/opt/whisper-models/small`; the browser is
  `/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell`;
  jsdelivr can fail, so the template ships GSAP locally.
- First test: a 15 s recording with a flubbed take, "let's redo that" and
  three long pauses became 5.8 s of clean speech + a 2 s brand end card (7.8 s),
  vertical, Fraunces captions, oxblood word highlight, -14 LUFS.
