---
type: component
component: "Button"
description: "Button enables users to perform actions, navigate the interface, and interact with features and functionalities."
category: actions
status: draft
figma_url: "https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System?node-id=3355-70376"
alternatives:
  - IconButton
related:
  - IconButton
  - ButtonGroup
can_contain: []
cannot_contain: []
required_children: []
a11y_role: button
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/docs/stories/Components/Button/Design.mdx
  - packages/react/src/components/Button/Button.tsx
  - packages/react/src/components/Button/Button.model.ts
  - packages/react/src/components/Button/BaseButton/BaseButton.tsx
  - packages/css/src/recipes/button.ts
  - packages/css/src/recipes/iconButton.ts
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Button

## Overview

A clickable element that triggers an action: submitting a form, starting a task, or moving the user on. It is the main way users act on the content of dialogs, forms, cards and toolbars. `style` and `color` set how much attention a button draws, so a screen can show which action matters most.

## When to use

- Submitting or saving a form.
- The actions of a dialog or modal window, such as confirming or cancelling ([Dialog note](dialog.md)).
- Actions on a card or in a toolbar.
- A step forward in a walkthrough or multi-step process.
- An action with critical consequences or risk, such as deleting: `color="danger"`.
- The call to action of a marketing or landing page: `size="xl"`.
- The most common or a supporting action of a screen, floating above the interface, usually at the bottom right: `floating` with `size="2xl"`.

## When not to use

- An action shown as an icon alone, in a compact layout. Use `IconButton`, with a tooltip that shows the label.

## Why this design

Emphasis is split into two properties, `variant` (fill, outline, ghost) and `color` (primary, secondary, neutral, danger), so the visual hierarchy of the buttons on a screen can be set without new components. A layout has one prominent button and the others hold less importance; in Magenta products that is the filled primary button.

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| An action with only an icon, in a compact layout | `IconButton` | `Button` with an icon and no label |
| Several related actions of equal weight shown together | `ButtonGroup` ([ButtonGroup note](button-group.md)) | Separate buttons with mixed styles |

## Anatomy

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Text label | yes | Says what the button does. |
| 2 | Icon | no | Left (common), right (rare, adds context), or both (menu buttons). Gives extra context or reinforces the action. |
| 3 | Spinner | no | Shown in place of the label and icons while `loading` is set. |

## Composition

- Label only, or label with a left icon, are the common types. A right icon is rare and adds context. A label with icons on both sides is a menu button: a default action plus a set of alternative actions.
- Minimum width: twice the button's height, with or without an icon.
- Alignment:
  - Right-aligned: single-focused tasks and dialogs, and inside notifications, search fields and data tables. In walkthroughs and multi-step processes the primary action goes at the bottom right.
  - Left-aligned: full-page designs, where users scan wide content from left to right.
- In a group of buttons with different colors, keep the same `variant`. In a group with different variants, keep the same `color`.
- A single important action standing on its own takes a filled button. In a card it either spans the card's width (`fullWidth`) or sits at the right.

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| Hover | Pointer over the button | Background or tint changes; see the GENERATED tables. |
| Pressed | Pointer or key press | `:active`. |
| Focus | Keyboard focus | `:focus-visible` shows a 2px outline ring in the color's `.300` level (`neutral.400` for neutral). |
| Loading | `loading` | Hides the label and icons and shows a spinner, at 50% opacity. Sets `aria-busy` and disables the button: it cannot be clicked or focused while loading. |
| Disabled | `disabled` | A native `<button>` gets `disabled`; another element set by `component` gets `aria-disabled` and `tabIndex={-1}`. |

## Accessibility

### Keyboard

- Tab moves focus to the button. A disabled or loading button is skipped.
- Enter or Space activates it (native `<button>`).

### Accessible name

The visible text label. A button without visible text is an `IconButton`, which needs an accessible name of its own.

### Focus

A 2px outline on `:focus-visible`, in the color's `.300` level (`colors.primary.300`, `colors.secondary.300`, `colors.red.300`; `colors.neutral.400` for neutral), on every variant.

### Contrast pairs

| Foreground token | Background token | Min ratio |
|---|---|---|
| `colors.white` | `colors.primary.500` | 4.5 |
| `colors.white` | `colors.secondary.500` | 4.5 |
| `colors.white` | `colors.neutral.700` | 4.5 |
| `colors.white` | `colors.red.500` | 4.5 |
| `colors.primary.500` | `colors.white` | 4.5 |
| `colors.secondary.500` | `colors.white` | 4.5 |
| `colors.neutral.700` | `colors.white` | 4.5 |
| `colors.red.500` | `colors.white` | 4.5 |

## Content

Sizes `xl` and `2xl` show the label in capitals: the recipe sets `textTransform: uppercase`.

## Do and don't

| Don't | Do |
|---|---|
| Two filled primary buttons side by side | Outline for the secondary action and fill for the primary action, in the same color |
| A group that changes both variant and color: outline secondary with fill primary, or ghost neutral with fill secondary | Same `variant` across colors (outline secondary with outline primary), or same `color` across variants (outline neutral with fill neutral) |
| An icon with no label inside `Button` | `IconButton`, with a tooltip |
| The Figma "On color" style in a product design | A variant that exists in code; "On color" is not in the package |

## Component tokens

## Figma to code mapping

Figma sets on the Buttons page of the library. Confirmed by the team on 2026-11-04. The usage documentation in Figma is the frame "Button-Document-Overview" (node `2422:30790`); its specs (padding, gap and text style per size, icon button padding, floating button) match the recipes in code.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| Button · Type | Text + Icon | — | `Button` |
| Button · Type | Icon only | — | `IconButton`, same `color`, `variant` and `size` |
| Button · Color | Primary / Secondary / Neutral / Danger | `color` | `"primary"` / `"secondary"` / `"neutral"` / `"danger"` |
| Button · Style | Fill / Outline / Ghost | `variant` | `"fill"` / `"outline"` / `"ghost"` |
| Button · Style | On color | — | Not in code: Figma only |
| Button · Size | Large / Medium / Small | `size` | `"responsive"`. The Figma size shows the frame's viewport; use `"lg"` / `"md"` / `"sm"` only when the design asks for a fixed size. |
| Button · State | Enable | — | default |
| Button · State | Hover / Focus / Pressed | — | interaction states (`:hover`, `:focus-visible`, `:active`), not props |
| Button · State | Loading | `loading` | `true` |
| Button · State | Disable | `disabled` | `true` |
| Button · Left icon | true | `leftIcon` | the icon chosen in Swap left icon |
| Button · Right icon | true | `rightIcon` | the icon chosen in Swap right icon |
| Button · Swap left icon / Swap right icon | icon instance | `leftIcon` / `rightIcon` | the matching icon from `@ocean-network-express/magenta-react-icons` |
| Button · Text | text | `children` | the label |
| CTAs button | any | `size` | `"xl"`; Icon only → `IconButton size="xl"`. Other properties as for Button. |
| CTAs button · Disable | True | `disabled` | `true` |
| Floating button | any | `floating`, `size` | `true`, `"2xl"`; Icon only → `IconButton floating size="2xl"` |
| Small icon button · Size | 24 / 20 / 16 | `IconButton` `size` | `"xs"` / `"2xs"` / `"3xs"`, ghost neutral ([IconButton note](icon-button.md)) |

## Open questions

1. Resolved 2026-11-10 (team, [known issues](../reports/known-issues-2026-11-10.md) Q2): the Figma Component status page is only an example, not a source; `status` follows the component in code. Question was: Component `status` (draft, beta, stable): no source yet.
2. Trade-offs: the docs give none.
3. Resolved 2026-11-05: the Link docs say a link navigates and a button runs an action without navigating ([Link note](link.md)).
4. Upstream, for the Magenta team: the docs and Figma describe "Button on color" for colored backgrounds, but the package has no such variant. The "Button types" table of the Figma documentation frame still holds template text ("Click to customize! You can add or remove any columns in your table").

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-11-04 from contracts/Button.json (scripts/build-contracts.mjs). Replaced by build/meta in phase 3. -->

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `'primary' \| 'secondary' \| 'neutral' \| 'danger'` | `primary` | Color of the button. |
| `component` | `React.ElementType` |  | The element or component to render instead of the default element. |
| `disabled` | `boolean` | `false` | If true, the button will be disabled. |
| `floating` | `boolean` | `false` | If true, the button will float above other content. |
| `fullWidth` | `boolean` | `false` | If true, the button will take up the full width of its container. |
| `leftIcon` | `React.ReactNode` |  | Icon to be displayed on the left side of the button. |
| `loading` | `boolean` | `false` | If true, the button will show a loading spinner. |
| `rightIcon` | `React.ReactNode` |  | Icon to be displayed on the right side of the button. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'responsive'` | `lg` | Size of the button. |
| `variant` | `'fill' \| 'outline' \| 'ghost'` | `fill` | Variant of the button. |

Also accepts the attributes of `<button>`, or of the element set by `component`.

### Colors by variant and state

From the `button` recipe; all are `colors.*` tokens. Text color applies to the label and icons. Focus ring is the outline color on keyboard focus.

| Variant | Color | Background | Hover | Pressed | Text | Border | Focus ring |
|---|---|---|---|---|---|---|---|
| fill | primary | primary.500 | primary.400 | primary.600 | white |  | primary.300 |
| fill | secondary | secondary.500 | secondary.400 | secondary.600 | white |  | secondary.300 |
| fill | neutral | neutral.700 | neutral.600 | neutral.800 | white |  | neutral.400 |
| fill | danger | red.500 | red.400 | red.600 | white |  | red.300 |
| outline | primary | white | primary.100 | primary.200 | primary.500 | primary.500 | primary.300 |
| outline | secondary | white | secondary.100 | secondary.200 | secondary.500 | secondary.500 | secondary.300 |
| outline | neutral | white | neutral.100 | neutral.200 | neutral.700 | neutral.700 | neutral.400 |
| outline | danger | white | red.100 | red.200 | red.500 | red.500 | red.300 |
| ghost | primary | transparent | primary.100 | primary.200 | primary.500 |  | primary.300 |
| ghost | secondary | transparent | secondary.100 | secondary.200 | secondary.500 |  | secondary.300 |
| ghost | neutral | transparent | neutral.100 | neutral.200 | neutral.700 |  | neutral.400 |
| ghost | danger | transparent | red.100 | red.200 | red.500 |  | red.300 |

### Sizes

| Size | Padding x / y (`spacing`) | Gap | Text (`fontSizes` / `lineHeights`) |
|---|---|---|---|
| `sm` | 8 / 8 | 4 | xs / md |
| `md` | 12 / 8 | 6 | sm / lg |
| `lg` | 16 / 8 | 8 | md / 2xl |
| `xl` | 16 / 12 | 12 | md / 2xl, uppercase |
| `2xl` | 16 / 12 | 12 | md / 2xl, uppercase |
| `responsive` | `sm` under 1280px, `md` from 1280px, `lg` from 1920px | | |

Stories: `packages/docs/stories/Components/Button/Button.stories.tsx#Playground`.
<!-- GENERATED:END -->
