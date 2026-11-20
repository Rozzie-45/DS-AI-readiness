---
type: component
component: "HelperText"
description: "The HelperText component is used to provide additional information or guidance to users below an input field. It can be used to display error messages, warnings, or success messages related to the input, as well as general helper text to assist users in filling out the form correctly."
category: inputs
status: draft
figma_url: ""
alternatives: []
related:
  - Input
  - Select
  - Textarea
  - FormCheck
  - CompactWrapper
  - CompactHelperText
  - NumberInput
can_contain: []
cannot_contain: []
required_children: []
a11y_role: ""
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/react/src/components/InputAtoms/InputHelperText/HelperTextComponent.tsx
  - packages/css/src/recipes/InputAtoms/inputHelperText.ts
  - packages/react/src/components/Input/Input.tsx
  - packages/react/src/components/CompactWrapper/CompactWrapper.tsx
  - packages/docs/stories/Components/NumberInput/Examples/NumberRangeInput.tsx
  - packages/docs/stories/TableFeature/ColumnsCustomization/SettingMenu/RequiredColumns.stories.tsx
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# HelperText

## Overview

A short line of text under a field: a description that helps users fill it in, or a validation message in an error, warning or success state. It renders a `<span>`, and nothing at all when it has no content.

Form fields draw their own helper text from their `helperText` prop (`Input`, `Select`, `Textarea`, `Autocomplete`, `SearchInput`, `TagsInput`, `NumberInput`, `FormCheck`) and link it to the field themselves. Use `HelperText` on its own only where no field draws it: a group of fields, a custom control, or a message inside a menu or dialog. `CompactHelperText` is the same component under another name, for `CompactWrapper` ([CompactWrapper note](compact-wrapper.md)).

Magenta has no Storybook page for `HelperText` and no Figma set: in Figma it is the "Helper text" layer of each field set.

## When to use

- A message for a group of fields that no single field owns, such as a number range with a common error (story NumberRangeInput).
- A message in a menu or dialog footer, such as "Please select at least 2 columns" in the show and hide columns menu ([columns pattern](../patterns/data-table-columns.md)).
- Helper text for a `CompactWrapper`: `CompactHelperText`.

## When not to use

- A single form field: pass `helperText` (and `state`) to the field, which links the text for you ([Input note](input.md)).
- Messages about the whole page or a task: a feedback message ([Feedback messages note](feedback-messages.md)).
- Little vertical space: the field's `renderHelperType="tooltip"` shows the helper text in a tooltip.

## Why this design

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Help or an error for one field | The field's `helperText` and `state` | A `HelperText` placed under the field |
| Help or an error for a `CompactWrapper` | `CompactHelperText` | The fields' own `helperText` inside the wrapper |
| Help or an error for a group of fields or a custom control | `HelperText` with an `id`, linked by `aria-describedby` | A `Text` styled as helper text |

## Anatomy

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Text | yes | The description or the message (`children`). |
| 2 | Icon | no | An icon before the text, added as a child (story RequiredColumns: `InfoCircleOutline` before an error). |

## Composition

- `<HelperText id="range-help" size="responsive">Range is from 1 to 30 t</HelperText>`, and `aria-describedby="range-help"` on the control or group it describes. `HelperText` sets no `id` and no link of its own.
- A message: `state="error"`, `"warning"` or `"success"`. When the text shows an error, also mark the control as invalid (`aria-invalid`, or the field's own `state`).
- With an icon: put it first in the children, with `size="responsive"` and `aria-hidden="true"`, and give the `HelperText` a `className` with `css({ display: 'flex', alignItems: 'center', gap: '8' })`, as story RequiredColumns does.
- `disabled` greys out a description; a message in a state keeps its color when disabled.
- Size: `size="responsive"` in products; the default is `lg`.
- Empty content renders nothing, so a message can be conditional without an empty line left behind.

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| Default | — | `colors.neutral.700`. |
| Error | `state="error"` | `colors.red.600`. |
| Warning | `state="warning"` | `colors.orange.600`. |
| Success | `state="success"` | `colors.green.600`. |
| Disabled | `disabled` | `colors.neutral.500`; a state's color wins over it. |
| Empty | no `children` | Nothing is rendered. |

Measured in the prototype (screen `#/helper-text`): the colors above for the standalone component and for the helper text of `Input`, `Select` and `Textarea`, which use this component; text 10px / 12px under 1280px with `size="responsive"`; nothing rendered for empty content.

## Accessibility

### Keyboard

Not focusable.

### Accessible name

None: it describes something else. Link it with `aria-describedby` from the control or group, so screen readers read it after the control's name. Fields do this themselves for their `helperText`.

- A message that appears after an action (such as a validation error in a menu footer) is not announced by itself: render it in a container with `aria-live="polite"` that stays in the page, or move focus to the control in error.

### Focus

None.

### Contrast pairs

| Foreground token | Background token | Min ratio |
|---|---|---|
| `colors.neutral.700` | `colors.white` | 4.5 |
| `colors.red.600` | `colors.white` | 4.5 |
| `colors.orange.600` | `colors.white` | 4.5 |
| `colors.green.600` | `colors.white` | 4.5 |
| `colors.neutral.500` | `colors.white` | — |

`colors.neutral.700` is 6.95:1 and `colors.red.600` 5.75:1. `colors.orange.600` (2.58:1) and `colors.green.600` (3.47:1) are below 4.5:1; the team keeps failing pairs as they are (foundations/color.md). Disabled text is exempt.

## Content

## Do and don't

| Don't | Do |
|---|---|
| A `HelperText` under an `Input` | The `Input`'s `helperText` |
| A standalone `HelperText` that nothing points to | An `id` and `aria-describedby` on the control or group |
| An error shown only by color | Error wording, and `aria-invalid` on the control |
| A `Text` with `colors.red.600` as an error line | `HelperText` with `state="error"` |

## Component tokens

## Figma to code mapping

No Figma set of its own: each field set in the library has a "Helper text" layer, mapped in that field's note ([Input note](input.md)). Checked on 2026-11-09 against the Text input set: text style `body2` (regular), `colors.neutral.700`, the error message in `colors.red.600`, disabled in `colors.neutral.500`. It matches the code.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| (field set) · Helper text layer | text | `helperText` on the field, or `children` of `HelperText` | the text |
| (field set) · State | Error / Warning / Success | `state` | `"error"` / `"warning"` / `"success"` |
| (field set) · State | Disable | `disabled` | `true` |

## Open questions

1. Resolved 2026-11-10 (team, [known issues](../reports/known-issues-2026-11-10.md) Q1): the Why this design section stays empty. Question was: Why this design and its trade-offs, and content rules for helper text and messages: no source gives them.
2. Upstream, for the Magenta team: `HelperText` sets no `id` and no live region, so standalone uses must be linked and announced by hand; its JSDoc and docs do not say so. With `size="responsive"` the text is 10px below 1280px.
3. This vault's Input, Select and Textarea notes said helper text took the `.500` state colors; measured on 2026-11-09, it takes `.600` (the border takes `.500`). Those notes are corrected.

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-11-09 from contracts/HelperText.json (scripts/build-contracts.mjs). Sizes and colors read from the inputHelperText recipe. Replaced by build/meta in phase 3. -->

### Props

`HelperText` (also accepts the attributes of `<span>`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `state` | `'error' \| 'warning' \| 'success'` |  | State of the helper text |
| `disabled` | `boolean` | `false` | Indicates if the helper text is disabled |
| `size` | `'sm' \| 'md' \| 'lg' \| 'responsive'` | `lg` | Size of the helper text |

### Sizes

From the `inputHelperText` recipe.

| Size | Text (`fontSizes` / `lineHeights`) | Letter spacing |
|---|---|---|
| `sm` | 2xs / sm | narrower |
| `md` | xs / md | narrower |
| `lg` | sm / lg | narrowest |
| `responsive` | `sm` under 1280px, `md` from 1280px, `lg` from 1920px | |

### Colors

All are `colors.*` tokens: default neutral.700; error red.600; warning orange.600; success green.600; disabled neutral.500 (a state's color wins).

Stories: none of its own; used in `packages/docs/stories/Components/NumberInput/Examples/NumberRangeInput.tsx` and the table column settings stories.
<!-- GENERATED:END -->
