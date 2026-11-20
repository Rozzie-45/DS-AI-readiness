---
type: report
date: 2026-11-04
---

# Figma token sync 2026-11-04

File: [Magenta-Design System - AI](https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR) (`m5GWvQiv67rsNlBinvOqlR`), collection `Magenta DS -v0.1.0`, mode `Default v1.0.0`. Built by `scripts/build-figma-sync.mjs` from `tokens/*.tokens.json` ([ADR 003](../../adr/003-code-led-token-pipeline.md)).

## Result

Applied on 2026-11-04 with spec `5842dc1-b39c123c`: the dry-run spec `5842dc1-9719fc54` with `body3` left out (team decision, see below). A dry run after applying reports no change left: 173 variables match the token files, 94 paint styles and 70 text styles are bound, 0 errors.

- The plugin saved the version "Before token sync from code 5842dc1" in the file's version history first. To undo, restore that version.
- The single apply run made every change but timed out before it could report, and the Desktop Bridge plugin disconnected. The plugin now applies in parts (`PHASE` `variables`, `paint`, `text`) for the next sync.
- Read back after applying: `h6` and `body` letter spacing is in px and bound to `letterSpacings/*`; `radii/full` is 9999; `colors/neutral/900` has the code syntax `var(--mag-colors-neutral-900)` and its roles as description; the `body3` styles are unchanged and unbound.

The rest of this report is the dry run that was reviewed before applying.

## Summary

| Change | Count |
|---|---|
| Variables renamed to their code path | 21 |
| New variables | 152 |
| Variables whose value, description, code syntax or visibility changes | 21 |
| Paint styles bound to a color variable | 94 of 96 |
| Text styles bound to font size, line height, letter spacing, font weight and font family variables | 82 of 91 (70 after leaving out `body3`) |
| Errors | 0 |

Nothing is deleted. Effect styles (shadows), grid styles, the two gradient paint styles, the nine `Display` text styles and the variables `_spec color`, `_focusing text` and `Placeholder` stay as they are.

Before applying, the plugin saves a version named "Before token sync from code 5842dc1" in the file's version history.

## Renames

Bindings survive a rename, because Figma binds by variable ID.

- `Spacings-gaps/mag-spacings-<n>` → `spacing/<n>` (15 variables).
- `Border radius/mag-radii-<size>` → `radii/<size>` (5 variables).
- `Border radius/mag-radii-none` → `_figma-only/radius-0`. Code has no such token; square corners are written `0`, so its code syntax is `0`.

## New variables

| Group | Count | Notes |
|---|---|---|
| `colors/*` | 94 | Each paint style is then bound to one. |
| `fontSizes/*`, `lineHeights/*`, `letterSpacings/*`, `fontWeights/*`, `fonts/primary` | 30 | Text styles are then bound to them. |
| `borders/1`, `borders/2` | 2 | Scope: stroke width. |
| `sizes/*` | 17 | Scope: width and height. |
| `breakpoints/*` | 7 | Scope: width and height. No code syntax: breakpoints are Panda conditions, not CSS variables. |
| `spacing/1`, `spacing/18` | 2 | In code but forbidden by `foundations/spacing.md`, so hidden from publishing. |

Every variable gets its roles as its description, its CSS variable as web code syntax (`var(--mag-colors-neutral-900)`), and scopes for its group. Tokens the foundation notes forbid are hidden from publishing: `colors.black`, `colors.blue.400`, `colors.blue.1000`, `colors.green.400`, `colors.green.1000`, `colors.orange.400`, `colors.orange.1000`, `colors.red.1000`, `radii.xl`, `spacing.1`, `spacing.18`.

## Existing variables that change

- All 21: description and code syntax added.
- `radii/full`: 999999 → 9999, the code value.
- `radii/xl`: hidden from publishing.

## Paint styles

All 94 color styles are bound to the variable of the same token. Their colors do not change. Two variables carry alpha: `colors/background-overlay/50` (`#333333` at 50%) and `colors/transparent` (alpha 0). Once bound, Figma shows the variable's alpha as the paint opacity, so these two styles still show opacity 0.5 and 0; the rendered color is unchanged.

## Text styles

82 styles are bound. Most keep their values. These change:

| Styles | Change | Why |
|---|---|---|
| `h6` lg, md, sm | Letter spacing -0.2**%** → -0.2**px** | Code uses px. At 13px, -0.2% is about -0.03px. |
| `body` regular lg (two styles with the same name), md; semibold md, sm (two styles with the same name) | Letter spacing in % → px (-0.4px or -0.2px) | Same as above. |
| `body3` md: regular, semibold, underline, all caps (6 styles) | 10/12 → 11/16. **Not applied.** | Code: `body3` is 11/16 from 1280px. |
| `body3` lg: regular, semibold, underline, all caps (6 styles) | 11/16 → 10/12. **Not applied.** | See below. |

The changed `h6` and `body` styles change every component and design that uses them; the letter spacing difference is a fraction of a pixel.

## `body3`: left out of this sync

The code gives two answers:

- `<Text level="body3" size="lg">` renders 10/12. `getTextStyle` applies only the `3xl` overrides for `lg`, and `body3` has none, so it falls back to the base size.
- `<Text level="body3">` without a size, or `size="responsive"`, renders 11/16 from 1920px, because the `xl` override (11/16) still applies.

Products pass `size="responsive"` by default (`AGENTS.md`), so a design at 1920px shows 11/16. **Decision (2026-11-04):** leave the 12 `body3` styles as they are in Figma for this sync, unbound, until the code bug is settled. Recorded in `foundations/typography.md`, Open questions.

## Untouched, for the team

- `Display 1`–`3` (53–69px): no font size token in code.
- Underline and all-caps styles: bound like their base level; text decoration and case are not tokens.
- `body3-semibold` and `body4-semibold` exist in Figma, but `foundations/typography.md` forbids them.
- Grid styles use 768/1024px columns; the components switch size at 1280/1920px.
