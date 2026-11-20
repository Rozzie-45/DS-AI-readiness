---
type: foundation
foundation: color
token_group: colors
status: stable
figma_url: "https://www.figma.com/design/CEUVPiqlbUf5CFplTE5Huk/Magenta-Design-System---v1.0?node-id=1232-22784"
sources:
  - packages/docs/stories/Foundation/Colors/Design.mdx
  - packages/docs/stories/Foundation/Colors/Color.stories.mdx
  - packages/docs/assets/images/Color
  - packages/docs/stories/Components/Button/Design.mdx
  - packages/css/src/tokens.ts
  - packages/css/src/recipes/button.ts
  - packages/css/src/recipes/input.ts
  - packages/css/src/recipes/InputAtoms
  - packages/css/src/recipes/divider.ts
  - packages/css/src/recipes/link
  - packages/css/src/recipes/Tag
  - packages/css/src/recipes/FeedbackMessages
  - packages/css/src/recipes/Dialog
  - packages/react/src/components/FeedbackMessages
  - packages/docs/stories/Foundation/Icon/Design.mdx
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Color

## Overview

Color is foundational of design system, providing a consistent and recognizable visual identity that communicates a brand's personality and values. It enhances user experience, builds trust, and fosters loyalty.

Magenta color has two layers:

- **Primitive tokens** are the palette: nine palettes of ten levels each, from 100 (lightest) to 1000 (darkest), plus `colors.white`, `colors.black`, `colors.transparent` and `colors.background-overlay.50`. They say what a color is. They are the only color tokens in code, as CSS variables `--mag-colors-<palette>-<level>`.
- **Semantic roles** say what a color is for: body text, divider, primary button hover. Magenta has no semantic tokens in code yet, so each role points to the primitive token that serves it ([ADR 001](../adr/001-color-roles-on-palette-tokens.md)). You choose a role, then write its primitive token.

There is no dark mode.

The per-level roles come from the team's color role tables in Figma (`figma_url`; screenshots in [references/color-roles](../references/color-roles/)). Where the tables disagreed with the components, the team chose the components (2026-10-28), so the roles below match the code. One deliberate difference remains: see [Differences from the components](#differences-from-the-components).

## Principles

**Communication is the key.** Our primary focus is on clear communication, supporting the purpose of the content. By thoughtfully utilizing colors, we ensure that the chosen color scheme effectively demonstrates the hierarchy of information, conveys interactive states, and distinguishes between different elements.

**Color has meaning.** Colors have roles, each of which has a specific meaning. Define the role of each color to make things easy to modify and expandable. Consider avoiding the use of meaningless colors within the interface.

**Accessibility.** We adhere to the WCAG AA standard for contrast ratios. See [Accessibility](#accessibility).

**Light and emphasis levels.** Light level contrast is the subtle contrast a color has against the default surface. It is useful in busy interfaces with a lot of visual information. Emphasis levels use bolder colors with higher contrast, so they draw more attention.

## Rules

- MUST choose a color by its semantic role (see [Semantic roles](#semantic-roles)), then use the primitive token the role points to. MUST NOT choose a primitive token by hue or value.
- MUST NOT use a level for a purpose that has no role. Ask instead, and add the case to Open questions.
- MUST use color tokens: `--mag-colors-<palette>-<level>` in CSS, `<palette>.<level>` in Panda style objects. MUST NOT hardcode hex, rgb or named colors.
- MUST use the Magenta component (`Button`, `Tag`, `Alert`, `Toast`…) instead of rebuilding its colors. The component roles below are for custom elements that must match.
- Interaction states MUST step one level from the default: hover one level lighter, pressed one level darker. Buttons use 500, 400 and 600; light tags 200, 100 and 300; emphasis tags 600, 500 and 700.
- Notices and warnings MUST use orange. Errors and destructive actions MUST use red.
- Text smaller than 24px MUST have a contrast ratio of at least 4.5:1 against its background (WCAG 1.4.3).
- Text 24px or larger, and any UI element essential to understanding the experience, MUST have a contrast ratio of at least 3:1 (WCAG 1.4.11).

## Primitive tokens

<!-- What each palette is. Descriptions are copied from the Magenta Storybook docs; brand names come from the team's role tables and Button/Design.mdx. -->

| Token | Description |
|---|---|
| `colors.primary.*` | Primary colors serve as the primary action and elements for key interactions, such as indicating operation status or highlighting important information. `colors.primary.500` is the brand Magenta (`#BD0F72`). |
| `colors.secondary.*` | Secondary colors can reinforce brand identity and should be used to complement and support primary colors. In user interfaces, they can be used for navigation elements. `colors.secondary.600` is named Dark Teal. |
| `colors.neutral.*` | Works alongside any color. Applies to most backgrounds, text, and shapes in the user interface. To reach the target contrast ratio, neutral elements should use a higher level than other colors; for example, the neutral button background uses `colors.neutral.700`. |
| `colors.blue.*` | Indicates different types of information or sections within the design system, or communicates that something is in progress. |
| `colors.green.*` | Indicates positive actions, such as success, confirmation, or completion. Can also represent safety or permission, as in "Go ahead" or "Safe to proceed", and health or environmental friendliness in some contexts. `colors.green.500` is named Pandan. |
| `colors.orange.*` | Accent color that brings attention to specific elements or actions, such as notifications or warnings. `colors.orange.500` is named Mandarin. |
| `colors.red.*` | Draws attention and communicates errors, for example error messages, alerts, or actions with irreversible consequences. |
| `colors.purple.*` | Charts and graphs, to communicate complex data. |
| `colors.royal.*` | Royal purple. A supporting color in the secondary palette of the brand identity, used for decoration, illustrations, and data visualization. |
| `colors.white` | `#FFFFFF`. |
| `colors.black` | `#000000`. |
| `colors.transparent` | Fully transparent. |
| `colors.background-overlay.50` | `colors.neutral.900` (`#333333`) at 50% opacity. |

Levels with no role stay in the palette (team decision, 2026-10-28) but MUST NOT be used until they get one: `colors.orange.400`, `colors.blue.1000`, `colors.green.1000`, `colors.orange.1000`, `colors.red.1000` and `colors.black`. `colors.blue.400` and `colors.green.400` were on this list; they now have the roles the components give them (team decision, 2026-11-10: follow the code), in [Toggles and steppers](#toggles-and-steppers). `colors.purple.400`, `colors.purple.1000`, `colors.royal.400` and `colors.royal.1000` are used only for charts, illustrations and data visualization.

## Semantic roles

<!-- One row per role. Token is the primitive token the role points to (ADR 001). `<palette>` stands for any of the nine palettes. `<status>` stands for blue, green, orange or red, the `color` of a feedback message. Use on lists backgrounds where a text role passes 4.5:1 (see Contrast below). -->

### Text

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Heading | `colors.neutral.1000` | `colors.white`, `colors.neutral.100` |  |  |
| Default body text | `colors.neutral.900` | `colors.white`, `colors.neutral.100` |  |  |
| Default subheadings and subtitles | `colors.neutral.800` | `colors.white`, `colors.neutral.100` |  |  |
| Default labels, helper text and explanatory text | `colors.neutral.700` | `colors.white`, `colors.neutral.100` |  |  |
| Placeholder text | `colors.neutral.500` |  |  |  |
| Primary subheadings and subtitles | `colors.primary.800` | `colors.white`, `colors.neutral.100` |  |  |
| Secondary headings and subtitles | `colors.secondary.800` | `colors.white`, `colors.neutral.100` |  |  |
| Primary heading on marketing sites | `colors.primary.1000` | `colors.white`, `colors.neutral.100` |  |  |
| Secondary heading on marketing sites | `colors.secondary.1000` | `colors.white`, `colors.neutral.100` |  |  |
| Active text | `colors.primary.500` | `colors.white`, `colors.neutral.100` |  |  |
| Navigation text and accessible text (menu bar, navigation bar) | `colors.primary.500` | `colors.white`, `colors.neutral.100` |  |  |
| Text on interactive colors (filled buttons, emphasis tags) | `colors.white` |  |  |  |

### Links

`Link` applies these. Its default `color` is `secondary`; `color="red"` uses the same levels of red.

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Text link | `colors.secondary.500` | `colors.white`, `colors.neutral.100` |  |  |
| Text link, hover | `colors.secondary.400` |  |  |  |
| Text link, pressed | `colors.secondary.800` | `colors.white`, `colors.neutral.100` |  |  |
| Text link, visited | `colors.secondary.600` | `colors.white`, `colors.neutral.100` |  |  |
| Text link focus ring | `colors.secondary.300` |  |  |  |
| Disabled text link | `colors.neutral.300` |  |  |  |

### Surfaces

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Default page background | `colors.neutral.100` |  |  |  |
| Background layer on the default page background | `colors.white` |  |  |  |
| Background layer on a white layer | `colors.neutral.100` |  |  |  |
| Hover on a white or transparent background, neutral elements | `colors.neutral.100` |  |  |  |
| Hover on a white or transparent background, primary elements | `colors.primary.100` |  |  |  |
| Feature background | `colors.primary.500` |  |  |  |
| Transparent background | `colors.transparent` |  |  |  |
| Overlay behind dialogs, drawers and lightboxes ("filter background") | `colors.background-overlay.50` |  |  |  |
| Skeleton background and elements | `colors.neutral.200` |  |  |  |

### Borders, dividers and form fields

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Default divider | `colors.neutral.200` |  |  |  |
| Form field background | `colors.white` |  |  |  |
| Form field border, enabled (input, selection box) | `colors.neutral.300` |  |  |  |
| Form field border, hover | `colors.primary.400` |  |  |  |
| Form field border, focused ("active field border") | `colors.primary.500` |  |  |  |
| Form field border, disabled | `colors.neutral.200` |  |  |  |
| Form field background, disabled | `colors.neutral.100` |  |  |  |
| Form field border and status icon (helper tooltip), error | `colors.red.500` |  |  |  |
| Form field border and status icon (helper tooltip), warning | `colors.orange.500` |  |  |  |
| Form field border and status icon (helper tooltip), success | `colors.green.500` |  |  |  |
| Form field message (helper text), error | `colors.red.600` |  |  |  |
| Form field message (helper text), warning | `colors.orange.600` |  |  |  |
| Form field message (helper text), success | `colors.green.600` |  |  |  |
| Required mark (`*`) after a field label | `colors.red.500` |  |  |  |

### Buttons

`Button` applies these. They are listed so custom interactive elements match.

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Primary button background | `colors.primary.500` |  |  |  |
| Primary button background, hover | `colors.primary.400` |  |  |  |
| Primary button background, pressed | `colors.primary.600` |  |  |  |
| Primary button focus ring | `colors.primary.300` |  |  |  |
| Secondary button background | `colors.secondary.500` |  |  |  |
| Secondary button background, hover | `colors.secondary.400` |  |  |  |
| Secondary button background, pressed | `colors.secondary.600` |  |  |  |
| Secondary button focus ring | `colors.secondary.300` |  |  |  |
| Neutral button background | `colors.neutral.700` |  |  |  |
| Neutral button background, hover | `colors.neutral.600` |  |  |  |
| Neutral button background, pressed | `colors.neutral.800` |  |  |  |
| Neutral button focus ring | `colors.neutral.400` |  |  |  |
| Danger button background | `colors.red.500` |  |  |  |
| Danger button background, hover | `colors.red.400` |  |  |  |
| Danger button background, pressed | `colors.red.600` |  |  |  |
| Danger button focus ring | `colors.red.300` |  |  |  |
| Text on filled buttons | `colors.white` |  |  |  |
| Outline and ghost button text and border | `colors.primary.500`, `colors.secondary.500`, `colors.red.500`; neutral uses `colors.neutral.700` |  |  |  |
| Outline and ghost button background, hover | `colors.primary.100`, `colors.secondary.100`, `colors.neutral.100`, `colors.red.100` |  |  |  |
| Outline and ghost button background, pressed | `colors.primary.200`, `colors.secondary.200`, `colors.neutral.200`, `colors.red.200` |  |  |  |
| Disabled button background (fill) | `colors.neutral.200` |  |  |  |

### Tags

`Tag` applies these. Light level is `variant="light"` (the default); emphasis level is `variant="bold"`. `<palette>` is the tag's `color`, any of the nine palettes.

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Tag background, light level | `colors.<palette>.200` |  |  |  |
| Tag background, light level, hover | `colors.<palette>.100` |  |  |  |
| Tag background, light level, pressed | `colors.<palette>.300` |  |  |  |
| Tag background, light level, selected | `colors.<palette>.100` |  |  |  |
| Tag border, light level, selected | `colors.<palette>.500` |  |  |  |
| Tag text, light level | `colors.<palette>.900` |  |  |  |
| Tag background, emphasis level | `colors.<palette>.600` |  |  |  |
| Tag background, emphasis level, hover | `colors.<palette>.500` |  |  |  |
| Tag background, emphasis level, pressed | `colors.<palette>.700` |  |  |  |
| Tag background, emphasis level, selected | `colors.<palette>.500` |  |  |  |
| Tag border, emphasis level, selected | `colors.<palette>.800` |  |  |  |
| Tag text, emphasis level | `colors.white` |  |  |  |
| Tag focus ring | `colors.<palette>.300` |  |  |  |
| Disabled tag text | `colors.neutral.300` |  |  |  |
| Disabled tag background | `colors.neutral.100` |  |  |  |

### Feedback messages: Alert, Banner and Toast

The components apply these. `<status>` is the component's `color`: `blue` for information, `green` for success, `orange` for notices and warnings, `red` for errors. `neutral` uses its own levels, given in each row.

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Alert background | `colors.white` |  |  |  |
| Alert border | `colors.<status>.500`; neutral: `colors.neutral.500` |  |  |  |
| Alert and Banner title and icon | `colors.<status>.600`; neutral: `colors.neutral.700` |  |  |  |
| Alert and Banner message text | `colors.neutral.900` |  |  |  |
| Banner background | `colors.<status>.100`; neutral: `colors.white` |  |  |  |
| Toast background | `colors.white` |  |  |  |
| Toast message text | `colors.<status>.600`; neutral: `colors.neutral.900` |  |  |  |
| Toast prefix bar | `colors.<status>.600`; neutral: `colors.neutral.500` |  |  |  |

### Icons

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Default icon | `colors.neutral.700` |  |  |  |
| Disabled icon | `colors.neutral.200` |  |  |  |
| Icon color in a status palette | `colors.blue.600`, `colors.green.600`, `colors.orange.600`, `colors.red.600` |  |  |  |
| Active icon | `colors.primary.700` |  |  |  |

### Toggles and steppers

<!-- Added 2026-11-10 from the component recipes (team decision: follow the code). -->

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Toggle track, on, hover | `colors.green.400` |  |  |  |
| Stepper step in progress, hover (label and indicator) | `colors.blue.400` |  |  |  |
| Stepper step complete, hover (label and indicator) | `colors.green.400` |  |  |  |

### Data visualization

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Charts and graphs | `colors.purple.*` |  |  |  |
| Decoration, illustrations and data visualization | `colors.royal.*` |  |  |  |

### Differences from the components

None. The roles follow the code ([ADR 005](../adr/005-code-led-token-proposal.md)). Until 2026-11-19 the status icon role was `.700`, from the Figma role tables, with `Alert` and `Banner` kept at `.600` as a deliberate difference; no component uses `.700` for an icon, so the role now says `.600`, and `purple` and `royal` were dropped from it because no component shows a status icon in them.

<!-- role-check: page level: Heading; Primary subheadings and subtitles; Active icon -->
These roles come from the Figma role tables and no component sets them: products apply them in their own pages. `node checks/role-check.mjs` lists them as page level: Heading (`colors.neutral.1000`), Primary subheadings and subtitles (`colors.primary.800`), Active icon (`colors.primary.700`).

## Accessibility

Magenta follows WCAG AA for contrast:

- **4.5:1** for text smaller than 24px (WCAG 1.4.3).
- **3:1** for text 24px or larger and for UI elements essential to understanding the experience (WCAG 1.4.11).

Measured ratios for every role pair are in the Contrast tables below. Some current roles fail, for example placeholder text, filled buttons on hover, orange status text and focus rings. The team keeps these roles as they are (2026-10-28): use the role's token, and do not swap in another level to raise the contrast.

## Do and don't

| Don't | Do |
|---|---|
| `color: '#BD0F72'` | `color: 'primary.500'` or `var(--mag-colors-primary-500)` |
| `color: 'neutral.600'` for body text because it looks right | `color: 'neutral.900'`, the token for the Default body text role |
| `--mag-colors-text-default` or another invented semantic name | The primitive token the role points to |
| A custom hover color picked by eye | One level lighter than the default, e.g. `primary.400` for a `primary.500` fill |

## Open questions

**1. Semantic tokens.** Decided in [ADR 001](../adr/001-color-roles-on-palette-tokens.md): each role points to a real palette token. Names for a future semantic tier are proposed in [ADR 002](../adr/002-semantic-color-token-naming.md); review them before they go to the Magenta team.

**2. Figma cleanup.** The role tables in Figma disagree with the components the team chose to follow. To update in Figma:
- Alert, Section Message and Toast: the tables give `.300` and `.500` backgrounds and `.1000` text.
- Tag: `colors.neutral.400` as the neutral tag background, a `.400` tag border, `colors.secondary.700` as "focused", and `colors.purple.200` / `colors.royal.200` as "hover".
- Navigation text is also listed under `colors.secondary.600`.
- Icon color is listed as `.500`.

**3. Upstream doc cleanup.** To report to the Magenta team:
- The Primary palette section has an internal drafting note ("Focus only in Primary color and primary variant color roles… Link to references: polaris").
- The Red description says "warnings or errors", but the roles use red for errors only.
- The Purple description repeats its sentence.
- The role tables have typos: "Activer icon color", "Sencondary".

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-10-28 by one-off scripts from packages/css/src/tokens.ts and packages/css/src/recipes. Replaced by scripts/ in phase 3. -->

### Palette

CSS variable: `--mag-colors-<palette>-<level>`. In Panda style objects: `<palette>.<level>`, e.g. `color: 'neutral.900'`.

| Palette | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 |
|---|---|---|---|---|---|---|---|---|---|---|
| `primary` | `#F8E7F1` | `#EBB7D5` | `#DC7FB4` | `#CC4B90` | `#BD0F72` | `#A20D66` | `#8A0B5C` | `#700951` | `#520743` | `#340535` |
| `secondary` | `#E2F2F1` | `#B3E3E1` | `#85D3D1` | `#5AA7AD` | `#2F728C` | `#024D71` | `#024463` | `#033B55` | `#033246` | `#032938` |
| `neutral` | `#F5F7FA` | `#D8DDE5` | `#B8BEC8` | `#9CA3AD` | `#8B939E` | `#6C727A` | `#555A61` | `#43474C` | `#333333` | `#2C2D2E` |
| `blue` | `#EAF2FD` | `#BBD5F9` | `#8DB9F5` | `#5E9DF1` | `#2F80ED` | `#2A73D5` | `#2462B5` | `#1D5094` | `#163F74` | `#102D53` |
| `green` | `#E6F4EC` | `#B6E4CD` | `#86D5AE` | `#55C58F` | `#25B570` | `#209D61` | `#1B8652` | `#176E44` | `#125735` | `#0D3F26` |
| `orange` | `#FEF4E6` | `#FDDEB5` | `#FCC983` | `#FAB352` | `#F99D20` | `#E58D17` | `#CA7C14` | `#965A0D` | `#754406` | `#542E00` |
| `red` | `#FDF2F2` | `#F5BFBF` | `#ED8C8C` | `#E45959` | `#DC2626` | `#C62222` | `#A81D1D` | `#8A1818` | `#6B1212` | `#4D0D0D` |
| `purple` | `#EAE2F3` | `#CAB7E1` | `#9869D1` | `#7B49B8` | `#683D99` | `#563480` | `#4B2C71` | `#402562` | `#341D53` | `#291544` |
| `royal` | `#EDD6E9` | `#D3ADCC` | `#BA85B0` | `#A05C93` | `#863376` | `#752C68` | `#652659` | `#541F4B` | `#44193C` | `#33122E` |

| Token | Value | CSS variable |
|---|---|---|
| `colors.white` | `#ffffff` | `--mag-colors-white` |
| `colors.black` | `#000000` | `--mag-colors-black` |
| `colors.transparent` | `transparent` | `--mag-colors-transparent` |
| `colors.background-overlay.50` | `#33333380` | `--mag-colors-background-overlay-50` |

### Contrast

Ratios computed from the token values and truncated, not rounded. Small text needs 4.5:1; text 24px or larger and essential UI elements need 3:1.

| Text role token | on `white` | on `neutral.100` |
|---|---|---|
| `neutral.1000` | 13.79 pass | 12.85 pass |
| `neutral.900` | 12.63 pass | 11.77 pass |
| `neutral.800` | 9.35 pass | 8.71 pass |
| `neutral.700` | 6.95 pass | 6.47 pass |
| `neutral.600` | 4.85 pass | 4.52 pass |
| `neutral.500` | 3.10 large text only | 2.89 fail |
| `primary.500` | 6.04 pass | 5.63 pass |
| `primary.800` | 11.37 pass | 10.59 pass |
| `primary.1000` | 17.22 pass | 16.05 pass |
| `secondary.400` | 2.77 fail | 2.58 fail |
| `secondary.500` | 5.37 pass | 5.00 pass |
| `secondary.600` | 9.12 pass | 8.49 pass |
| `secondary.800` | 11.92 pass | 11.11 pass |
| `secondary.1000` | 15.23 pass | 14.19 pass |
| `blue.600` | 4.65 pass | 4.33 large text only |
| `green.500` | 2.65 fail | 2.46 fail |
| `green.600` | 3.46 large text only | 3.23 large text only |
| `orange.500` | 2.12 fail | 1.98 fail |
| `orange.600` | 2.57 fail | 2.39 fail |
| `red.500` | 4.82 pass | 4.49 large text only |
| `red.600` | 5.74 pass | 5.35 pass |

| Filled button | `white` on default | on hover | on pressed |
|---|---|---|---|
| `primary` | 6.04 pass (`primary.500`) | 4.21 large text only (`primary.400`) | 7.53 pass (`primary.600`) |
| `secondary` | 5.37 pass (`secondary.500`) | 2.77 fail (`secondary.400`) | 9.12 pass (`secondary.600`) |
| `neutral` | 6.95 pass (`neutral.700`) | 4.85 pass (`neutral.600`) | 9.35 pass (`neutral.800`) |
| `danger` | 4.82 pass (`red.500`) | 3.57 large text only (`red.400`) | 5.74 pass (`red.600`) |

| Palette | Light tag: `.900` on `.200` | on `.100` (hover) | on `.300` (pressed) | Emphasis tag: `white` on `.600` | on `.500` (hover) | on `.700` (pressed) |
|---|---|---|---|---|---|---|
| `primary` | 8.34 pass | 12.03 pass | 5.26 pass | 7.53 pass | 6.04 pass | 9.19 pass |
| `secondary` | 9.68 pass | 11.75 pass | 7.90 pass | 9.12 pass | 5.37 pass | 10.44 pass |
| `neutral` | 9.26 pass | 11.77 pass | 6.76 pass | 4.85 pass | 3.10 large text only | 6.95 pass |
| `blue` | 7.00 pass | 9.32 pass | 5.20 pass | 4.65 pass | 3.86 large text only | 6.01 pass |
| `green` | 6.13 pass | 7.58 pass | 4.97 pass | 3.46 large text only | 2.65 fail | 4.58 pass |
| `orange` | 6.30 pass | 7.46 pass | 5.34 pass | 2.57 fail | 2.12 fail | 3.27 large text only |
| `red` | 7.60 pass | 11.13 pass | 5.07 pass | 5.74 pass | 4.82 pass | 7.34 pass |
| `purple` | 7.86 pass | 11.52 pass | 3.64 large text only | 9.55 pass | 7.73 pass | 11.06 pass |
| `royal` | 7.32 pass | 10.61 pass | 4.87 pass | 9.06 pass | 7.63 pass | 10.63 pass |

| Status | Alert and Banner title, icon; Toast message: `.600` on `white` | Banner: `.600` on `.100` |
|---|---|---|
| `blue` | 4.65 pass | 4.12 large text only |
| `green` | 3.46 large text only | 3.05 large text only |
| `orange` | 2.57 fail | 2.36 fail |
| `red` | 5.74 pass | 5.24 pass |
| `neutral` (title, icon `.700`) | 6.95 pass | 6.95 pass |

| Palette | Icon `.700` on `white` (needs 3:1) |
|---|---|
| `primary` | 9.19 pass |
| `blue` | 6.01 pass |
| `green` | 4.58 pass |
| `orange` | 3.27 pass |
| `red` | 7.34 pass |
| `purple` | 11.06 pass |
| `royal` | 10.63 pass |

| UI element (needs 3:1) | Token | on `white` |
|---|---|---|
| Form field border, enabled | `neutral.300` | 1.86 fail |
| Form field border, hover | `primary.400` | 4.21 pass |
| Form field border, focused | `primary.500` | 6.04 pass |
| Focus ring, primary | `primary.300` | 2.71 fail |
| Focus ring, secondary | `secondary.300` | 1.71 fail |
| Focus ring, neutral | `neutral.400` | 2.54 fail |

### Observed use in recipes

How many component recipes use each token, by CSS property. This shows current practice, not an approved rule. Tokens built at runtime from a palette name, as in `Tag` and `Link`, are not counted.

| Token | Text / icon | Background | Border / outline | Focus ring / shadow |
|---|---|---|---|---|
| `colors.primary.100` |  | 6 |  | 1 |
| `colors.primary.200` |  | 3 |  | 1 |
| `colors.primary.300` |  | 2 | 6 | 6 |
| `colors.primary.400` | 5 | 4 | 5 | 1 |
| `colors.primary.500` | 5 | 3 | 8 | 2 |
| `colors.primary.600` | 5 | 3 | 1 | 1 |
| `colors.primary.700` |  | 1 |  |  |
| `colors.secondary.100` |  | 2 |  |  |
| `colors.secondary.200` |  | 2 |  |  |
| `colors.secondary.300` |  |  | 1 |  |
| `colors.secondary.400` | 6 | 1 | 1 |  |
| `colors.secondary.500` | 3 | 1 | 3 |  |
| `colors.secondary.600` | 2 | 1 | 1 |  |
| `colors.neutral.100` |  | 23 |  |  |
| `colors.neutral.200` | 11 | 11 | 26 | 1 |
| `colors.neutral.300` | 9 | 4 | 4 | 2 |
| `colors.neutral.400` | 1 | 1 | 1 |  |
| `colors.neutral.500` | 21 | 3 | 1 |  |
| `colors.neutral.600` | 6 | 2 | 1 |  |
| `colors.neutral.700` | 30 | 3 | 2 | 1 |
| `colors.neutral.800` | 2 | 1 | 1 |  |
| `colors.neutral.900` | 24 |  |  |  |
| `colors.blue.100` |  | 1 |  |  |
| `colors.blue.200` |  | 2 |  |  |
| `colors.blue.400` |  |  |  |  |
| `colors.blue.500` |  |  | 1 |  |
| `colors.blue.600` | 3 | 2 | 1 |  |
| `colors.green.100` |  | 1 |  |  |
| `colors.green.300` | 2 | 1 |  | 1 |
| `colors.green.400` | 1 | 1 |  |  |
| `colors.green.500` | 6 | 2 | 4 | 1 |
| `colors.green.600` | 6 | 3 | 1 |  |
| `colors.orange.100` |  | 1 |  |  |
| `colors.orange.300` | 1 |  |  |  |
| `colors.orange.500` | 3 |  | 4 | 1 |
| `colors.orange.600` | 4 | 1 | 1 |  |
| `colors.red.100` |  | 2 |  |  |
| `colors.red.200` |  | 1 |  |  |
| `colors.red.300` | 2 |  | 1 |  |
| `colors.red.400` | 1 | 1 | 1 |  |
| `colors.red.500` | 9 | 2 | 6 | 1 |
| `colors.red.600` | 6 | 3 | 2 |  |
| `colors.purple.600` |  |  | 1 |  |
| `colors.royal.100` |  | 2 |  |  |
| `colors.royal.600` |  |  | 1 |  |
| `colors.background-overlay.50` |  | 4 |  |  |
| `colors.white` | 8 | 30 | 1 | 1 |
| `colors.transparent` | 1 | 10 | 2 |  |

<!-- GENERATED:END -->
