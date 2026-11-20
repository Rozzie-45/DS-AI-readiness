---
type: proposal
status: proposed
review_status: draft-ai
decision: adr/005-code-led-token-proposal.md
naming: adr/002-semantic-color-token-naming.md
---

# Semantic and component tokens (proposal)

A proposed set of semantic and component tokens for Magenta, built from the code. None of these tokens exist in Magenta yet. **Agents MUST NOT write them in code or Figma** until Magenta ships them. Until then, keep using the palette tokens from the foundation notes ([ADR 001](../adr/001-color-roles-on-palette-tokens.md)).

## How the set is made

- **The code is the source.** Every value is a token the components already use. When a role and a component disagree, the component wins ([ADR 005](../adr/005-code-led-token-proposal.md)).
- **Semantic tokens** (this note) name a role shared by several components. A person writes the name, the palette token and the role. `scripts/build-token-proposal.mjs` checks that the code uses that token in that role, and lists the components that do.
- **Component tokens** are not written by hand. The script reads every color a component's recipe sets (from `contracts/`) and names it `colors.<category>.<component>.<slot or part>.<variants>.<state>` ([ADR 002](../adr/002-semantic-color-token-naming.md)). When the value matches a semantic token for the same category and state, the component token points to the semantic token; otherwise it points to the palette token, which keeps the component exactly as it is today.
- Only the components in [Component token scope](#component-token-scope) get component tokens. The others keep their colors in the recipe and use semantic tokens when Magenta migrates them.
- Nothing changes on screen when Magenta adopts the set: every token resolves to the value the component already has.

Output (generated, never edited):

| File | What |
|---|---|
| `build/proposal/semantic.tokens.json` | Semantic tokens, DTCG format, with the components that use each one |
| `build/proposal/component.tokens.json` | Component tokens, DTCG format, with the recipe style each one comes from |
| `build/proposal/panda-semantic-tokens.ts` | The same set as a Panda `semanticTokens` object, ready to propose to Magenta |
| `reports/token-proposal-review.md` | Where components differ from a semantic role, for the team to review |

## Columns

- **Token**: the path under the group, without the group (`text.body` means `colors.text.body`). The last segment is a state (`hover`, `active`, `focus-within`, `disabled`…) when the role has states.
- **Value**: the palette token it points to.
- **Applies to**: the recipes in which the role can be recognised, or `*` for all. The script only matches and links component tokens inside these recipes.
- **Link**: `yes` lets component tokens point to this token, and the build fails if no recipe uses the value in this role. `no` for roles that no recipe sets (page-level text such as headings, which products color themselves), or whose value would match unrelated styles.

## Semantic tokens

### Colors

Roles from [foundations/color.md](../foundations/color.md), which follow the components (team decision 2026-10-28).

| Token | Value | Role | Applies to | Link |
|---|---|---|---|---|
| text.heading | colors.neutral.1000 | Heading | * | no |
| text.body | colors.neutral.900 | Default body text | * | yes |
| text.subtitle | colors.neutral.800 | Default subheadings and subtitles | * | no |
| text.label | colors.neutral.700 | Default labels, helper text and explanatory text | * | yes |
| text.placeholder | colors.neutral.500 | Placeholder text | * | yes |
| text.on-fill | colors.white | Text on interactive colors (filled buttons, emphasis tags) | * | yes |
| text.disabled | colors.neutral.300 | Disabled text (step labels, tab labels, carousel controls, disabled text links) | * | yes |
| text.error | colors.red.600 | Form field message (helper text), error | inputHelperText, formCheck | yes |
| text.warning | colors.orange.600 | Form field message (helper text), warning | inputHelperText, formCheck | yes |
| text.success | colors.green.600 | Form field message (helper text), success | inputHelperText, formCheck | yes |
| background.field.default | colors.white | Form field background | input, select, textarea, numberInput, autocompleteInput, dateTimeInput, editor, inlineEditWrapper | yes |
| background.field.disabled | colors.neutral.100 | Form field background, disabled | input, select, textarea, numberInput, autocompleteInput, dateTimeInput, editor, inlineEditWrapper | yes |
| background.page | colors.neutral.100 | Default page background | * | no |
| background.layer | colors.white | Background layer on the default page background | * | yes |
| background.layer-alt | colors.neutral.100 | Background layer on a white layer | * | yes |
| background.neutral.hover | colors.neutral.100 | Hover on a white or transparent background, neutral elements | * | yes |
| background.primary.hover | colors.primary.100 | Hover on a white or transparent background, primary elements | * | yes |
| background.feature | colors.primary.500 | Feature background | * | no |
| background.overlay | colors.background-overlay.50 | Overlay behind dialogs, drawers and lightboxes | * | yes |
| background.skeleton | colors.neutral.200 | Skeleton background and elements | * | no |
| border.divider | colors.neutral.200 | Default divider | * | yes |
| border.field.default | colors.neutral.300 | Form field border, enabled | input, select, textarea, numberInput, autocompleteInput, dateTimeInput, editor, inlineEditWrapper | yes |
| border.field.hover | colors.primary.400 | Form field border, hover | input, select, textarea, numberInput, autocompleteInput, dateTimeInput, editor, inlineEditWrapper | yes |
| border.field.focus | colors.primary.500 | Form field border, focused (the code uses `_focusWithin`, `_focusVisible` or `_focus`) | input, select, textarea, numberInput, autocompleteInput, dateTimeInput, editor, inlineEditWrapper | yes |
| border.field.disabled | colors.neutral.200 | Form field border, disabled | input, select, textarea, numberInput, autocompleteInput, dateTimeInput, editor, inlineEditWrapper | yes |
| border.error | colors.red.500 | Form field border, error | input, select, textarea, numberInput, autocompleteInput, dateTimeInput | yes |
| border.warning | colors.orange.500 | Form field border, warning | input, select, textarea, numberInput, autocompleteInput, dateTimeInput | yes |
| border.success | colors.green.500 | Form field border, success | input, select, textarea, numberInput, autocompleteInput, dateTimeInput | yes |
| icon.default | colors.neutral.700 | Default icon | * | yes |
| icon.active | colors.primary.700 | Active icon | * | no |
| icon.disabled | colors.neutral.200 | Disabled icon | * | yes |
| focus-ring.primary | colors.primary.300 | Focus ring on primary elements | * | yes |
| focus-ring.secondary | colors.secondary.300 | Focus ring on secondary elements and text links | * | yes |
| focus-ring.neutral | colors.neutral.400 | Focus ring on neutral elements | * | yes |
| focus-ring.danger | colors.red.300 | Focus ring on danger elements | * | yes |

### Radii

Roles from [foundations/border.md](../foundations/border.md).

| Token | Value | Role | Applies to | Link |
|---|---|---|---|---|
| small | radii.sm | Small elements, 16px tall or less (checkbox box) | * | yes |
| control | radii.md | Medium components: buttons, fields, tags, pagination items, accordion items | * | yes |
| container | radii.lg | Large components: containers, menus, popovers, tooltips, alerts, banners, toasts, dialogs | * | yes |
| pill | radii.full | Circles and pills: avatars, radio buttons, toggles, progress bars, step numbers | * | yes |

### Border widths

Roles from [foundations/border.md](../foundations/border.md). The code writes most focus ring widths as `2px` or `1px`; the script counts those as uses of `borders.2` and `borders.1`.

| Token | Value | Role | Applies to | Link |
|---|---|---|---|---|
| default | borders.1 | Standard border: fields, outline buttons, dividers, containers | * | yes |
| focus-ring | borders.2 | Focus ring on standalone controls (fill and ghost buttons, tabs, calendar dates, dialog header) | * | yes |
| focus-ring-inset | borders.1 | Focus ring drawn inside rows and bordered controls (outline buttons, list and menu items, accordion items, tags) | * | yes |

### Shadows

Roles from [foundations/elevation.md](../foundations/elevation.md), following the components where the docs differ (Popover and child menus use `shadows.lg`).

| Token | Value | Role | Applies to | Link |
|---|---|---|---|---|
| flat | shadows.none | Flat surface | * | yes |
| raised | shadows.sm | Clickable cards, raised flat cards, default form container | * | yes |
| lifted | shadows.md | Card being moved or hovered, selected segmented item | * | yes |
| dropdown | shadows.lg | Dropdown and child menus, selection menus, pickers, popovers | * | yes |
| overlay | shadows.xl | Dialogs, drawers, alerts, banners, toasts, floating action button | * | yes |
| top | shadows.2xl | Tooltips, floating action button on hover | * | yes |

Spacing, z-index and text styles get no semantic tokens: spacing does not change with a theme and Magenta has no density modes, `zIndex.*` is already named by role, and `textStyles` already are semantic.

## Component token scope

| Recipe | Why it gets component tokens |
|---|---|
| button | The largest color matrix (variant × color × state) and the component teams most often want to override |
| input | Field family: one set keeps all fields alike |
| select | Field family |
| textarea | Field family |
| numberInput | Field family |
| editor | Field family; its focus border differs from the other fields |
| tag | Nine palettes × two levels × states, today computed in a helper; named tokens make every value readable |
| indicator | Same palette matrix as tag |
| checkbox | Selection control with its own focus halo |
| radio | Selection control |
| toggle | Selection control with its own on, hover and focus colors |
| alert | Status colors per message type |
| banner | Status colors per message type |
| toast | Status colors per message type |
| link | Link states, including visited |
| tableCell | Pinned and selected cell colors |
| tableRow | Row borders |

## Open questions

- The team decides whether tag and indicator keep their component tokens or stay inside the recipe; they make up most of the component tokens.
- Dark mode: every token has one value today. Values for a dark theme have to be designed; the code cannot provide them.
