# Token audit · 2026-11-16

Source: `.source/magenta/packages/css/src/tokens.ts` (Magenta snapshot 5842dc1). The generated vault files `tokens/primitive.tokens.json` and `tokens/text-styles.tokens.json` are in sync with it (`node scripts/build-tokens.mjs --check` exits 0).

## Summary

The primitive tier is solid: 191 tokens on full scales, and every text style refers to tokens, with no raw values. The structural problem is the missing semantic tier. All component recipes refer to palette steps directly, so a role such as "body text" exists only as a convention. This is a known decision ([ADR 001](../adr/001-color-roles-on-palette-tokens.md)). Magenta ships one theme, so it rates High, not Critical. Next in urgency: about ten places in the recipes hardcode colours and shadows that already exist as tokens, and about 110 px values have an exact matching token.

## Tier structure

| Tier | Status |
|---|---|
| Primitive | 🟢 Strong. 94 colours, 17 spacing, 17 sizes, 5 radii, 7 shadows, 12 zIndex, full type scales |
| Semantic | 🔴 Absent. `preset.ts` defines no `semanticTokens` (documented decision, ADR 001) |
| Component | Not used. This is not a finding |
| Tier leakage | Every recipe refers to primitives. With no semantic tier there is nothing to leak around, so this is counted under TA-01, not per instance |

## Findings

**TA-01 🟠 High · Coverage. No semantic tier; components refer to palette steps directly.**

- **Evidence:**
  - `packages/css/src/preset.ts:~126` sets `theme.tokens` but no `semanticTokens`.
  - Interaction states are encoded as palette steps inside the recipes, for example the link hover changes from `.500` to `.400` and active uses `.800` (`recipes/link/utils.ts:21-37`).
- **Action:** propose ADR 001 option B upstream. Add Panda `semanticTokens` for the roles the vault already documents (112 tokens carry a role in `tokens/primitive.tokens.json`), starting with text, border, surface and action including hover, active and disabled. Then migrate the recipes.

**TA-02 🟠 High · Value. Raw colours and shadows in recipes duplicate existing tokens.**

- **Evidence:**
  - `recipes/toggle.ts:78,84,97`: copies the value of `shadows.inner` by hand, while `shadows.inner` itself is never referenced.
  - `recipes/popover.ts:48` and `recipes/tooltip.ts:22`: `rgba(51, 51, 51, 0.15)`, which is `neutral.900` at 15%.
  - `recipes/Tabs/tabList.ts:114,126`, `recipes/Table/tableCell.ts:137` and `recipes/Calendar/date.ts:285,298`: gradients built from raw rgba values.
  - `recipes/Tabs/tabList.ts:116,128`: a legacy IE `progid` filter with `#333333`.
  - `recipes/TextEditor/fileDragOverlay.ts:16`: `#B3E3E150`, which is `secondary.200` with alpha.
- **Action:**
  - In `toggle.ts`, use `token(shadows.inner)`.
  - For the rest, use `token(colors.neutral.900)` with `color-mix()` or Panda's opacity modifier (`neutral.900/15`), and `secondary.200/30` for the overlay.
  - Remove the `progid` filters.

**TA-03 🟡 Medium · Value. Raw px values that have an exact token.**

- **Evidence:**
  - 214 raw px values in the recipes, measured as prop/value pairs. 97 of them match a `spacing` or `sizes` token exactly.
  - 13 `outlineWidth: '1px'|'2px'` values match `borders.1` and `borders.2`.
  - Most are in `toggle.ts` (40), `radio.ts` (12), `Segmented/Item.ts` (8) and `TimePicker/weekCylinder.ts` (7). For example, `toggle.ts:199` has `gap: '8px'`, which is `spacing.8`, and `toggle.ts:202-207` have `w: '20px'`, which is `sizes.20`.
  - The rest (`maxH: '216px'`, `minW: '122px'`, `strokeWidth: '1.6px'`) have no token. They are component dimensions and not a finding on their own.
- **Action:** replace the 110 matches with token keys. Leave the true one-off dimensions alone.

**TA-04 🟡 Medium · Naming. Mixed units within a scale.**

- **Evidence:**
  - `tokens.ts:209-246`: `spacing` and `sizes` use px for 0–6 and rem from 8 upward.
  - `radii` (`tokens.ts:178`), `borders` and `letterSpacings` are all px.
- **Action:** pick one rule and record it, for example "rem for anything that should scale with text, px for hairlines and radii". Then align `spacing.0`–`spacing.6`, or document why small steps stay px.

**TA-05 🟡 Medium · Value. Shadows and overlay hardcode a colour that is already a token.**

- **Evidence:**
  - `tokens.ts:186-207`: every shadow uses `rgba(51, 51, 51, …)`, which equals `colors.neutral.900` (`tokens.ts:49`). `inner` also uses `rgba(44, 45, 46, …)`, which equals `neutral.1000`.
  - `tokens.ts:8-9`: `background-overlay.50 = #33333380`, which is again `neutral.900` at 50%.
- **Action:** if the neutral palette changes, the shadows do not follow. Define them by reference, `{colors.neutral.900}` with alpha, or record that shadow colour is fixed on purpose.

**TA-06 ⚪ Low · Coverage. Orphan candidates (no reference inside the repo).**

- **Evidence:**
  - A static search found 47 of 94 colours unreferenced. After expanding the colour helpers in Tag, Indicator, Tabs, Link and Timeline (9 palettes × steps 100–900), 13 remain (14%).
    - The `.1000` step of all 9 palettes.
    - `black`, `orange.400`, `purple.400`, `royal.400`.
  - Also `shadows.inner` (see TA-02) and `zIndex.navigation-overlay` (`tokens.ts:259`).
  - The vault already marks 8 of these as `forbidden`. Not yet marked: `neutral.1000`, `primary.1000`, `purple.400`, `purple.1000`, `royal.400`, `royal.1000`, `secondary.1000`.
- **Action:** ask the Magenta team whether the `.1000` steps are meant for product apps. If not, mark them in the vault as well. Do not delete anything upstream until consumers have been checked.

**TA-07 ⚪ Low · Naming. Role names in the primitive tier.**

- **Evidence:**
  - The palettes `primary` (`tokens.ts:66`) and `secondary` (`tokens.ts:117`) are named by role.
  - `background-overlay.50` (`tokens.ts:8`) puts a role name on a primitive, and `50` looks like a scale step but means 50% alpha.
- **Action:** nothing now. When TA-01 is done, consider moving `background-overlay.50` to a semantic token such as `overlay.backdrop` that points to `neutral.900` at 50%. Before semantic `action.primary` tokens exist, check that the `primary` palette name does not cause confusion with them.

**TA-08 ⚪ Low · Coverage. ADR 001 describes a file that does not exist.**

- **Evidence:** ADR 001 says `tokens/semantic.tokens.json` "stays empty", but the file is not there.
- **Action:** change the ADR wording to "is not created until…", or create the empty file.

**Passing checks:**
- Text styles: all 51 refer to tokens, with 0 raw values (`recipes/Text/textStyles.ts`).
- zIndex is named by layer role (`dialog`, `popover`, `tooltip`).
- No token is `$deprecated`.
- The vault output already uses the DTCG 2025.10 shape: colour, dimension and shadow are objects.

## Remediation priority

1. **Fix first:**
   - TA-02, which is small and has a clear win.
   - TA-01, which needs an upstream proposal.
2. **Fix next:** TA-03, TA-05 and TA-04.
3. **Address eventually:** TA-06, TA-07 and TA-08.

## Effort estimates

These are estimates. The assumptions are listed and can be changed.

| Finding | Effort | Assumptions | Confidence |
|---|---|---|---|
| TA-02 | 4–8 hours | About 10 sites in 7 files, plus a visual check of Toggle, Popover, Tooltip, Tabs, Table, Calendar and Editor | High |
| TA-03 | 1–2 days | About 110 replacements in about 20 files, plus a screenshot comparison of the affected components | Medium |
| TA-05 | 2–4 hours | Panda accepts references inside token values. Alpha needs `color-mix` or a pre-mixed value | Medium |
| TA-04 | 2–4 hours token-side | Changing px to rem affects rendering when the user enlarges text, so it needs a visual check | Medium |
| TA-01 | Token side 3–6 days, recipe migration 2–4 weeks extra | Role list taken from `foundations/color.md`. Magenta team agrees. Excludes migrating product apps | Low: needs a spike to count palette references per recipe |
| TA-06 to TA-08 | Under 2 hours | Vault-side only | High |

## Scope

- **Inspected:**
  - `packages/css/src/tokens.ts`, `preset.ts`, `breakpoints.ts`, `utilities.ts` and all of `recipes/`;
  - the source (excluding stories and tests) of `react`, `react-dates`, `react-text-editor`, `react-data-grid` and `react-templates`, 1,082 files in all;
  - the vault's `tokens/` and ADR 001.
- **Not inspected:**
  - product repos that consume Magenta;
  - the Figma variables (that is `figma-variable-audit`).
- **How "none found" was checked:**
  - The colour search finds `primary.500` and `token(radii.lg)`.
  - The hex search finds the hex values in `tokens.ts`.
  - The colour orphans were re-checked after expanding the dynamic helpers.
  - Orphans for `spacing` and `sizes` were **not** checked, because numeric keys cannot be searched reliably.
- **Assumptions:**
  - The 214 px values were counted only as `prop: 'Npx'` pairs. Values inside composite strings (`'0 0 0 2px'`) were not counted.
  - An exact match to a token is taken to mean the token was intended.

> **A note on context:** This audit sees your token files, not the decisions behind them. Some findings may flag patterns your team chose on purpose (TA-01 is already recorded in ADR 001). If any finding describes an intentional decision, say so and future runs will skip it.
