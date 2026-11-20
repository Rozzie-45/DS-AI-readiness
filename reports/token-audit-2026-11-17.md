# Token audit · 2026-11-17

The primitive tier has not changed since the last run, so all earlier findings still stand. What is new is a proposed semantic and component tier ([ADR 005](../adr/005-code-led-token-proposal.md)). It holds together structurally: every alias resolves, there are no upward references and no name collisions. Its weak points are naming (a few vague role names and hyphen-joined states) and the 628 component tokens that point straight at primitives, a result of following the code.

## Trend since last audit (2026-11-16)

| | 2026-11-16 | 2026-11-17 | Change |
|---|---|---|---|
| Source snapshot | 5842dc1 | 5842dc1 | none (no `update-source`) |
| Findings on primitives (TA-01 to TA-08) | 8 open | 7 open, 1 in progress | TA-01 in progress: a semantic tier is now proposed, not shipped |
| New findings | — | 6 (TA-09 to TA-14) | all on the new proposal or on the role text in the generated token file |

Persistent findings (TA-02 to TA-08) are one cycle old, not yet flagged as stale.

## Token sources

- `.source/magenta/packages/css/src/tokens.ts`: 191 primitives. Unchanged.
- `tokens/primitive.tokens.json`, `tokens/text-styles.tokens.json`: generated from the code, in sync (`build-tokens --check` exits 0).
- **New**, generated from `proposals/semantic-tokens.md` and `contracts/`; `--check` passes:
  - `build/proposal/semantic.tokens.json`: 47 semantic tokens;
  - `build/proposal/component.tokens.json`: 775 component tokens.

## Tier structure

| Tier | Shipped (code) | Proposal |
|---|---|---|
| Primitive | 🟢 Strong | — |
| Semantic | 🔴 Absent | 🟡 Functional. 47 tokens, all resolve to primitives in use, but some names are weak (TA-10, TA-11) |
| Component | Not used | 🟡 Functional. 775 tokens in 17 components |
| Tier leakage | — | 628 of 775 component tokens point to a primitive instead of a semantic token (TA-09) |

Checks that pass on the proposal:
- **Aliases resolve.** All 822 aliases resolve to an existing primitive; checked by resolving every alias in `build/proposal/panda-semantic-tokens.ts`.
- **Reference direction.** No semantic token refers to a component token, and no component token refers to another component token.
- **No name collisions.** No path is both a token and a group, and no name is used twice (the build fails otherwise).
- **No forbidden or deprecated targets.** No semantic token points to a forbidden or deprecated primitive (build check).
- **Shared values are documented roles, not accidental duplicates.**
  - `neutral.100` is shared by `background.page`, `layer-alt`, `neutral.hover` and `field.disabled`.
  - `neutral.200` is shared by `border.divider`, `border.field.disabled` and `background.skeleton`.

## Findings

### Carried over (unchanged code)

TA-01 to TA-08 from [token-audit-2026-11-16](token-audit-2026-11-16.md):
- TA-01 is now in progress.
- TA-02 (raw colours and shadows in recipes) and TA-03 (about 110 px values that have a token) are still the cheapest fixes.

### New

**TA-09 🟠 High · Naming/Value. Most component tokens skip the semantic tier.**

- **Evidence:** in `build/proposal/component.tokens.json`, 628 of 775 aliases are `{colors.<palette>.<step>}`, for example `colors.background.button.fill.primary.default` → `{colors.primary.500}`.
- **Cause:** this is by design (ADR 005, follow the code). The semantic tier has no roles for buttons, tags or status messages, so those component tokens have nothing to point to.
  - Tag and Indicator account for 362 of the 775.
  - Buttons account for 98.
- **Action:** decide which repeated groups deserve a semantic role. Candidates:
  - **intent roles:** `background.primary`, `background.primary.hover`, `.active` and the same for secondary, neutral and danger. These would cover Button, IconButton and Link.
  - **status roles:** `background.status.error`, `text.status.error` and so on, for Alert, Banner and Toast.

  Each role added links tens of component tokens. Tag palettes can stay direct, since they are categories, not roles.

**TA-10 🟡 Medium · Naming. Vague or size-based semantic names.**

| Token | Defined at (`build/proposal/semantic.tokens.json`) | Problem | Suggested rename |
|---|---|---|---|
| `radii.small` | line 857 | A size word used as the whole role; its siblings use roles (`control`, `container`, `pill`) | `radii.indicator` (checkbox box, small marks) |
| `shadows.top` | line 959 | Says nothing about use | `shadows.tooltip` |
| `shadows.lifted` | line 909 | Close in meaning to `raised` | `shadows.dragging` (card being moved or hovered) |
| `colors.text.label` | line 651 | Also covers helper and explanatory text | `colors.text.secondary` |

**TA-11 🟡 Medium · Naming. Combined states and slot names are hard to parse.**

- **Evidence:** 45 component tokens put two states in one segment joined by `-`, while some single states already contain `-`. For example `read-only-focus-visible` (`build/proposal/component.tokens.json:10304`) or `checked-disabled`.
- **Problem:** the slot and the variant use the same segment position, so a reader cannot tell `input-container` (slot) from `error` (variant) without the recipe. For example `colors.border.input.input-container.error.default`.
- **Action:** in ADR 002, either join combined states with a separator that never appears inside a state name (`read-only_focus-visible`), or give them one segment each (`read-only.focus-visible`). Then document the segment order as category · component · slot · variant · state.

**TA-12 🟡 Medium · Coverage. A role the components use has no semantic token.**

- **Evidence:** disabled text is set by:
  - `stepperStep`, `tabListItem` and `carouselControl`: `neutral.300`;
  - `pagination`: `neutral.200`;
  - `editor`: `neutral.500`.

  `proposals/semantic-tokens.md` has no `text.disabled`, and the values disagree.
- **Action:** add `colors.text.disabled` → `colors.neutral.300` (the majority). The other two components will then show up in the review report for a team decision.

**TA-13 🟡 Medium · Value. The generated token file carries a wrong role.**

- **Evidence:** `tokens/primitive.tokens.json:3159`, `:1768` and `:769` give `red.500`, `orange.500` and `green.500` the role "Form field border **and message**".
  - The message text is `.600` in code (`recipes/InputAtoms/inputHelperText.ts:50`).
  - The role text comes from `foundations/color.md:144-146`.
- **Action:** split the role in `foundations/color.md` into border (`.500`) and message (`.600`), then rebuild tokens, proposal and meta.

**TA-14 ⚪ Low · Coverage. Proposed tokens with no in-repo consumer.**

- **Evidence:** 6 of 47 semantic tokens (13%) have `Link: no`: `text.heading`, `text.subtitle`, `icon.active`, `background.page`, `background.feature`, `background.skeleton`.
  - No recipe sets them in that role.
  - `icon.active` (`primary.700`) is not used as an icon colour anywhere in the recipes.
- **Action:** keep the page-level roles (heading, subtitle, page), which products set themselves. Ask the team whether `icon.active` and `background.feature` are still wanted.

## Remediation priority

1. **Fix first:**
   - TA-13: wrong role text in a generated file agents read;
   - TA-02 (carried over).
2. **Fix next:**
   - TA-09: add intent and status roles before proposing the set upstream;
   - TA-11 and TA-10: settle names before anyone adopts them, because renaming later is a breaking change;
   - TA-12.
3. **Address eventually:**
   - TA-14;
   - the carried-over Low findings.

## Effort estimates

| Finding | Effort | Assumptions | Confidence |
|---|---|---|---|
| TA-13 | 30–60 minutes | Note edit, then `build-tokens`, `build-token-proposal`, `build-meta` | High |
| TA-09 | 2–4 hours (proposal side) | Roles taken from the Buttons and Feedback tables in `foundations/color.md`; the script relinks component tokens automatically | Medium |
| TA-10, TA-11 | 1–2 hours plus team review | Changes to ADR 002 and to the naming in `build-token-proposal.mjs` | Medium |
| TA-12 | 15–30 minutes | One row in the proposal | High |
| TA-14 | Under 1 hour | Team answer needed | High |

All estimates cover the vault and proposal only. Adopting the tokens in Magenta is extra work: 3–6 days on the token side, plus 2–4 weeks to migrate the recipes, as estimated in the previous report.

## DTCG

The proposal files use DTCG 2025.10 alias strings and carry a `$type` on every token. Structural validation (`schema-validator`) has not been run. The alias check above was done by the build and by resolving every alias.

## Scope

- **Inspected:**
  - `packages/css/src/tokens.ts`;
  - `tokens/*.tokens.json`;
  - `build/proposal/*`;
  - `proposals/semantic-tokens.md`;
  - the recipe styles in `contracts/`;
  - `reports/token-proposal-review.md`.
- **Not inspected:**
  - product repos that consume Magenta;
  - Figma variables (`figma-variable-audit`);
  - structural DTCG validation (`schema-validator`);
  - a token-to-component dependency index (`codebase-index` has not been run).
- **How "none found" was checked:**
  - Upward references and collisions are checked by `build-token-proposal.mjs`, which fails on them.
  - Alias resolution was checked by resolving all 822 aliases; the check reports unresolved ones (0).
- **Assumptions:** the proposal is judged as a draft for the Magenta team, not as shipped tokens.

> **A note on context:** This audit sees your token files, not the decisions behind them. Some findings may flag patterns your team chose on purpose (TA-09 follows ADR 005). If any finding describes an intentional decision, say so and future runs will skip it.
