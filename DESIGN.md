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

## Spacing

Padding, margin and gap use a 4px grid: 4, 8, 12, 16, 20, 24, 28, 32 and up. Only 1, 2 and 3 are allowed below 4, for hairlines and tight pairs. Values inside `calc()`, `clamp()` or `var()` are left alone.

## Colour

Neutral dark grey-black with one orange accent (Substack-like). Text is cream; orange is for buttons, shapes and section names only.

| Token | Value | Use |
|---|---|---|
| bg | `#171717` (landing, hero), `#1A1A1A` (app) | page |
| surface | `#222222`, `#2A2A2A` | idea box, cards, free plan |
| ink | `#F2F2F0` | all text, headlines in one colour |
| muted | `#9B9B9B` / `#8A8A8A` | secondary text |
| line | `#2F2F2F` | dividers |
| orange | `#FF6719` (hover `#FF9A66`) | main buttons, arrow circles, section names, running light, save button |
| text on orange | `#1C0A00` | at least 4.5:1 |
| light grey | `#E6E6E3`, `#E9E9E6` | Pro plan, "what you get" cards, idea cards (with `#D4D4D0`, `#BEBEBA`) |
| verdict: start | `#3DDC84` on `#06210F` | "worth starting" cards; home tiles use the softer `#86BF9E` |
| verdict: refine | `#FFB36B` on `#1C0A00` | "worth refining"; home tiles `#DDB48F` |
| verdict: stop | `#E8CDBC` on `#3A1C10` | "stop here"; home tiles `#C9B0A6` |

Buttons: dark pill with an orange arrow circle; on hover an orange 2px outline, never a full orange fill. A button that cannot act yet is dim (`rgba(242,242,240,.14)` with 75% text), never hidden.

## Motion

Durations 100, 150, 200, 250, 300 ms. Ease out `cubic-bezier(0.22, 1, 0.36, 1)`. Press scale 0.97. Only transform and opacity. Reduced motion removes travel.

## Voice (Hebrew)

Plural, gender neutral imperatives (כתבו, נסו, בדקו; שלכם, לכם), plain words, no business jargon, no dashes as punctuation, no period at the end of a heading. Checked with the `rules-loop` skill and `rules.py` in the session scratchpad.
