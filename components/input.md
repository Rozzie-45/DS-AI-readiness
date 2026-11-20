---
type: component
component: "Input"
description: "An input is a form field that allows users to enter and edit short and free-form text, such as plain text, numbers, and passwords."
category: inputs
status: draft
figma_url: "https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=693-39731"
alternatives:
  - Textarea
  - Select
  - Radio
related:
  - InputLabel
  - HelperText
  - CompactWrapper
  - SearchInput
  - NumberInput
can_contain: []
cannot_contain: []
required_children: []
a11y_role: textbox
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/docs/stories/Components/Input/Design.mdx
  - packages/react/src/components/Input/Input.tsx
  - packages/react/src/components/Input/Input.model.ts
  - packages/react/src/components/InputAtoms
  - packages/css/src/recipes/input.ts
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Input

## Overview

A form field for short, single-line, free-form text: names, addresses, numbers, passwords. It is the basic control for collecting user input in forms. The field comes with a label, and optionally a placeholder, leading and trailing content, helper or validation text, a required mark and a tooltip.

## When to use

- Short, single-line content such as a name, an address or general text.
- Free-form data with no formatting restrictions, entered quickly.
- A password or PIN: `type="password"`, which masks the characters and adds a show/hide button.
- A value that needs context or a format cue before or after it, such as a unit or a currency: a prefix or suffix in `leftContent` / `rightContent`.

## When not to use

- Longer text such as descriptions or comments. Use `Textarea` ([Textarea note](textarea.md)).
- Choosing from predefined options. Use `Select` or `Radio`.
- A prefix or suffix when the value needs no extra context. Use a plain `Input`.
- A prefix or suffix where space is limited and the field would look crowded. Use a plain `Input`.

## Why this design

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Multi-line text | `Textarea` | `Input` |
| One choice from a known list | `Select` or `Radio` | `Input` |
| A field joined to a select or a button | `CompactWrapper` with the field inside | An `Input` with a button placed next to it |

## Anatomy

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Input field | yes | Where the user types. |
| 2 | Placeholder | no | Text shown while the field is empty (`placeholder`). |
| 3 | Label | yes | Says what to enter (`label`). Input fields always have a label. |
| 4 | Leading content | no | An icon or prefix that indicates the purpose of the field (`leftContent`). |
| 5 | Trailing content | no | An icon or suffix label that adds context or an action (`rightContent`). |
| 6 | Helper text | no | A description or a validation message (`helperText`). |
| 7 | Required mark | no | An asterisk after the label (`required`). |
| 8 | Tooltip | no | Extra guidance next to the label (`labelSuffix` or `labelPrefix`), or the helper text shown in a tooltip (`renderHelperType="tooltip"`). |

## Composition

- Custom label rows: when the label needs a control next to it (the docs' "Activation checkbox" example: an `InputLabel` and a `Checkbox` above the field), wrap the parts in `InputContainer` (props: `fullWidth`, plus `<div>` attributes). It is the wrapper `Input`, `Select`, `Textarea`, `NumberInput`, `SearchInput`, `TagsInput` and `Autocomplete` use themselves (a column with `spacing.4` gaps, code); pass the field's `id` to `InputLabel`'s `htmlFor`.
- Label alignment:
  - `top`, the default: label above the field.
  - `left`: label in a column to the left of the field; the helper text stays under the field.
  - `inline`: label inside the field, before the value. `leftContent` is not shown.
- Minimum width: 2.5 times the field's height.
- Use the tooltip form of the helper text when vertical space is limited.
- To join a field to a select or a button, wrap them in `CompactWrapper` ([CompactWrapper note](compact-wrapper.md)).

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| Hover | Pointer over the field | Border `colors.primary.400`. |
| Focus | Focus inside the field | Border `colors.primary.500`. |
| Filled | A value | No style change of its own. |
| Error, warning, success | `state` | Border in `colors.red.500`, `colors.orange.500` or `colors.green.500`; helper text in `colors.red.600`, `colors.orange.600` or `colors.green.600` (measured, 2026-11-09; [HelperText note](helper-text.md)). `state="error"` also sets `aria-invalid`. |
| Loading | `loading` | Spinner at the right, border `colors.primary.500`, background `colors.neutral.100`. The field is disabled while loading. |
| Disabled | `disabled` | Border `colors.neutral.200`, background `colors.neutral.100`, text and icons `colors.neutral.500`. |
| Read-only | `readOnly` | Border `colors.neutral.200`, background `colors.neutral.100`, no hover change. `readOnlyInput` makes only the typing area read-only, not the rest of the component. |
| Clearable | `clearable` and a value | A clear button (ghost neutral `IconButton`, "Clear input") empties the field and calls `onClear`. |
| Password | `type="password"` | A button at the right shows or hides the characters. |

## Accessibility

### Keyboard

- Tab moves focus to the field, then to the clear or show/hide button when there is one.
- Enter or Space activates those buttons.

### Accessible name

The `label`, linked to the field. Input fields always have a label. The helper text is linked with `aria-describedby`.

### Focus

On focus the field's border turns `colors.primary.500`.

### Contrast pairs

| Foreground token | Background token | Min ratio |
|---|---|---|
| `colors.neutral.900` | `colors.white` | 4.5 |
| `colors.neutral.500` | `colors.white` | 4.5 |
| `colors.red.500` | `colors.white` | 4.5 |
| `colors.red.600` | `colors.white` | 4.5 |
| `colors.orange.600` | `colors.white` | 4.5 |
| `colors.green.600` | `colors.white` | 4.5 |
| `colors.neutral.300` | `colors.white` | 3 |

Helper text in a state (measured 2026-11-09): `colors.red.600` is 5.75:1; `colors.orange.600` (2.58:1) and `colors.green.600` (3.47:1) are below 4.5:1. The team keeps failing pairs as they are (foundations/color.md).

## Content

## Do and don't

| Don't | Do |
|---|---|
| A field with no label | Always a `label`; use `labelAlignment` to place it |
| A text input for a long description | `Textarea` |
| A text input for a value from a fixed list | `Select` or `Radio` |
| A prefix or suffix that adds nothing | A plain field |

## Component tokens

## Figma to code mapping

Figma sets on the Inputs page of the library. Confirmed by the team on 2026-11-04. The usage documentation in Figma is the frame "Input-Document-Overview" (node `2620:29734`); its sizes and specs (gap and padding per size) match the recipe in code.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| Text input · Show label | true | `label` | the label text |
| Text input · Label alignment | Top / Left | `labelAlignment` | `"top"` / `"left"` |
| Text input · Size | Large / Medium / Small | `size` | `"responsive"`. The Figma size shows the frame's viewport; use `"lg"` / `"md"` / `"sm"` only when the design asks for a fixed size. |
| Text input · State | Enable | — | default |
| Text input · State | Hover / Focus | — | interaction states, not props |
| Text input · State | Filled | `value` | any value |
| Text input · State | Error | `state` | `"error"` |
| Text input · State | Loading | `loading` | `true` |
| Text input · State | Disable | `disabled` | `true` |
| Text input · State | Read-only | `readOnly` | `true` |
| Text input · Show helper / Helper text | true / text | `helperText` | the text |
| Text input · Error message | text | `helperText` | the message, with `state="error"` |
| Password input | any | `type` | `"password"`; Show text is the user's toggle, not a prop. Other properties as for Text input. |
| Input label item · Required | True | `required` | `true` (adds the red asterisk) |
| Input label item · Tooltip | true, Tooltip alignment Right | `labelSuffix` | an info icon inside `Tooltip`, with `aria-label` ([Tooltip note](tooltip.md)) |
| Input label item · Tooltip | true, Tooltip alignment Left | `labelPrefix` | an info icon inside `Tooltip`, with `aria-label` ([Tooltip note](tooltip.md)) |
| Input label item · Left-slot / Right-slot | true | `labelPrefix` / `labelSuffix` | the slot content |
| Input prefix text item / Input suffix text item | text | `leftContent` / `rightContent` | the text |
| Text input field base · Swap-left-icon / Swap-right-icon | icon instance | `leftContent` / `rightContent` | the icon from `@ocean-network-express/magenta-react-icons` |
| Text input field base · Type | Pre-Suffix Text | `leftContent` / `rightContent` | the prefix and suffix text |
| Text input field base · Type | Date Range | — | Not `Input`: the date range picker of `@ocean-network-express/magenta-react-dates` |
| Before Wrapper / After wrapper / After button wrapper | any | — | `CompactWrapper` ([CompactWrapper note](compact-wrapper.md)) |

In code only, with no Figma variant yet: `labelAlignment="inline"`, `state="warning"`, `state="success"`, `clearable`, and `renderHelperType="tooltip"` (shown in the Figma documentation frame, but no property of the Text input set).

## Open questions

1. Resolved 2026-11-10 (team, [known issues](../reports/known-issues-2026-11-10.md) Q1): the Why this design section stays empty. Question was: Why this design and its trade-offs: the docs give no rationale.
2. For the design team: add `labelAlignment="inline"`, the warning and success states, and the clear button to the Figma Text input set.
3. Upstream, for the Magenta team: the password show/hide button has no accessible name (`aria-label`); the clear button has one ("Clear input").
4. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) D11): Contrast: the placeholder (`colors.neutral.500` on white) and the default border (`colors.neutral.300` on white) are below the listed ratios. The team keeps failing pairs as they are (foundations/color.md).

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-11-04 from contracts/Input.json (scripts/build-contracts.mjs). Defaults of labelAlignment, renderHelperType and clearable read from Input.tsx. Replaced by build/meta in phase 3. -->

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `clearable` | `boolean` | `false` | Whether a non-empty input can be cleared. Defaults to false. |
| `containerRef` | `React.Ref<HTMLDivElement>` |  | Ref for the input container element |
| `fullWidth` | `boolean` |  | Whether the input should take the full width of its container |
| `helperText` | `React.ReactNode` |  | Helper text to display below the input |
| `label` | `React.ReactNode` |  | Label for the input |
| `labelAlignment` | `'top' \| 'inline' \| 'left'` | `top` | Alignment of the label |
| `labelPrefix` | `React.ReactNode` |  | Content to display before the label |
| `labelSuffix` | `React.ReactNode` |  | Content to display after the label |
| `leftContent` | `React.ReactNode` |  | Content to display on the left side of the input |
| `loading` | `boolean` |  | Whether the input is in a loading state |
| `onClear` | `() => void` |  | Called after the input is cleared. |
| `readOnlyInput` | `boolean` |  | Whether the input field itself is read-only (as opposed to the entire component) |
| `renderHelperType` | `'inline' \| 'tooltip'` | `inline` | How to render the helper text (inline or as a tooltip) |
| `rightContent` | `React.ReactNode` |  | Content to display on the right side of the input |
| `size` | `'sm' \| 'md' \| 'lg' \| 'responsive'` | `lg` | Size of the input |
| `state` | `'error' \| 'warning' \| 'success'` |  | State of the input (error, warning, success) |

Also accepts the attributes of `<input>` (`type`, `value`, `placeholder`, `disabled`, `readOnly`, `required`…).

### Sizes

From the `input` recipe.

| Size | Height | Padding x / y | Gap | Text (`fontSizes` / `lineHeights`) |
|---|---|---|---|---|
| `sm` | 32px | 6 / 8 | 4 | xs / md |
| `md` | 36px | 8 / 8 | 6 | sm / lg |
| `lg` | 40px | 12 / 8 | 8 | md / 2xl |
| `responsive` | `sm` under 1280px, `md` from 1280px, `lg` from 1920px | | | |

### Colors by state

| State | Border | Background | Text |
|---|---|---|---|
| default | neutral.300 | white | neutral.900 (placeholder neutral.500) |
| hover | primary.400 | white | neutral.900 |
| focus | primary.500 | white | neutral.900 |
| error / warning / success | red.500 / orange.500 / green.500 | white | neutral.900 |
| loading | primary.500 | neutral.100 | neutral.900 |
| disabled | neutral.200 | neutral.100 | neutral.500 |
| read-only | neutral.200 | neutral.100 | neutral.900 |

Border radius `radii.md`, border width `borders.1`. Stories: `packages/docs/stories/Components/Input/Input.stories.tsx#Playground`.
<!-- GENERATED:END -->
