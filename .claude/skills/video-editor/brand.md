# Saved brands

Read from the person's own brand files (their websites in these repos) on
2026-10-30. Use these; do not ask again. If a video is for a brand not listed
here, ask once for its 2 brand colours and its font, then add a section below.

If it is not obvious which brand a video is for, ask as part of the
captions/graphics question (question 3), e.g. "Captions and graphics in
Chicana Hippie or IZK style, or a clean cut?"

## Chicana Hippie (default)

Source: `chicanahippie/src/app/globals.css`, `chicanahippie/src/app/fonts.ts`

- Voice: "Timeless questions. Rebel thought. Art for the future." Editorial,
  philosophical, warm; art, astrology, culture, literature, ancestral
  knowledge, from a Chicana perspective. Bilingual (English / Spanish).
- Colour 1, paper (backgrounds): `#f2e9d6` (deeper `#e9dcbd`, `#ded0a8`)
- Colour 2, ink (text): `#18130d`
- Accent, oxblood: `#7a2e22`. Use it for highlighted caption words and small text.
- Accent, ochre: `#bd7f21`. Decorative only (rules, shapes, large shapes). It
  FAILS contrast as text on paper (1.6:1), found in the first test.
- Fonts: **Fraunces** (headlines and captions, 800; italic 400 for taglines),
  **Work Sans** (labels, 600, uppercase, wide tracking). Caveat is the
  handwritten accent face (sparingly).
- Logo: `chicanahippie/public/logo-mark-black.png` (on light),
  `logo-mark-white.png` (on dark), `logo-mark-square.png`.
- Spanish captions: transcribe with `--language es`; the site has `/es` copy.

## IZK

Source: `IZK-/src/app/globals.css`, `IZK-/src/app/layout.tsx`

- Voice: "a rare, wise whale moving through the world": ancient, intelligent,
  family-oriented, quietly playful. Original art from the depths.
- Colour 1, deep ocean (backgrounds): `#030f1a` / `#072335` / `#0d3d52`
- Colour 2, bioluminescent glow (highlights): `#7ef4d6`
- Text: foam `#eef6f4`; accents gold `#d9a86c`, sand `#f3ead9`
- Fonts: **Fraunces** (display), **Manrope** (body). Manrope is not bundled
  in the template: fetch `@fontsource/manrope` with `npm pack` into `assets/fonts/`.
- Logo: the whale mark (`IZK-/src/components/Whale.tsx`, SVG, placeholder art per the README).
