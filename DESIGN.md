# Wazo design system

Dark only. Hebrew first (RTL), also English, Spanish, French (LTR). One rule above all: **whole pixels**.

## Whole pixels

No half pixels anywhere that is rendered: font sizes, line heights, borders, box heights, spacing.

- **Font sizes** come from one scale: 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 56. Fluid sizes are wrapped: `font-size: round(clamp(34px, 11vw, 52px), 2px)`.
- **Line heights** are written as a ratio on the rule (`--lhr: 1.5`), never as `line-height`. One universal rule turns the ratio into an even number of pixels from the element's own font size:
  `*, *::before, *::after { line-height: round(calc(var(--lhr) * 1em), 2px) }`.
  `:root` sets the default `--lhr: 1.4`. A browser without `round()` falls back to the ratio.
- **Borders** are 1px or 2px. Never 1.3, 1.5.
- **Heights computed from the viewport** are rounded: `round(down, 100dvh - ..., 2px)`. A grid split by `fr` that must stay whole uses an explicit `round()` row and `1fr` for the rest.
- Do not use the `font:` shorthand on a rule that also needs the line-height ratio: it resets `line-height` to `normal`.
- Elements that animate with scale or rotate are exempt (their measured box is fractional only while moving).

Check it with `tools/pixel-audit.js` (paste in the browser console, or inject as a script, then call `__audit()`). It lists every element with a fractional font size, line height, border, spacing or box height. The target is an empty report at 390, 768 and 1440 wide, in Hebrew and English, in every state (home, result cards 1 to 5, sheets).

## Colour

| Token | Value | Use |
|---|---|---|
| bg | `#080808` (landing), `#0E0E0E` (app) | page |
| card | `#1C1C1C` | cards, ask box |
| ink | `#F1F0EC` | text |
| muted | `#A8A6A0` | secondary text |
| line | `#2A2A2A` | dividers |
| coral | `#F07167` | accent, idea band, closing section, window |
| teal | `#A8DADC` | final verdict card |
| text on coral | `#0A0A0A` | at least 4.5:1 |

Dim text on coral must stay at 78% opacity or more to pass 4.5:1.

## Motion

Durations 100, 150, 200, 250, 300 ms. Ease out `cubic-bezier(0.22, 1, 0.36, 1)`. Press scale 0.97. Only transform and opacity. Reduced motion removes travel.

## Voice (Hebrew)

Plural, gender neutral imperatives (כתבו, נסו, בדקו; שלכם, לכם), plain words, no business jargon, no dashes as punctuation, no period at the end of a heading. Checked with the `rules-loop` skill and `rules.py` in the session scratchpad.
