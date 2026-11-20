---
type: component
component: "Checkbox"
description: "A checkbox is an input control that allows users to choose one or more items from a list of available options."
category: selection
status: draft
figma_url: "https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=4834-20201"
alternatives:
  - Toggle
  - Radio
  - Select
related:
  - FormCheck
  - Toggle
  - Radio
  - List
  - Select
can_contain: []
cannot_contain: []
required_children: []
a11y_role: checkbox
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/docs/stories/Components/Checkbox/Design.mdx
  - packages/docs/stories/Components/Checkbox/Examples
  - packages/react/src/components/Checkbox/Checkbox.tsx
  - packages/react/src/components/Checkbox/hooks/useIndeterminate.ts
  - packages/react/src/components/FormCheck/FormCheck.tsx
  - packages/css/src/recipes/checkbox.ts
  - packages/css/src/recipes/formCheck.ts
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Checkbox

## Overview

A selection control for choices that are not exclusive: the user can pick none, one or several options, and turn each on or off on its own. Related checkboxes go in a checkbox group, `FormCheck`, which adds a group label, helper or validation text and a required mark. A checkbox has three statuses: unchecked, checked and indeterminate.

## When to use

- The user selects one or more items from a list of options.
- Options that can be turned on or off independently.
- Filtering or sorting data, where the user combines several criteria to refine the results.
- A parent checkbox that selects or deselects a set of child checkboxes ("Select all").

## When not to use

- A single on/off setting that applies at once. Use `Toggle` ([Toggle note](toggle.md)). Agreeing to terms and conditions stays a checkbox.
- Options that exclude each other, where choosing one should deselect the others. Use `Radio` ([Radio note](radio.md)).
- A long list of options that would clutter the screen. Use a multiple `Select`.

## Why this design

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| A single on/off option | `Toggle` | One `Checkbox` |
| One choice from a few options | `Radio` | `Checkbox` |
| Several choices from a long list | `Select` with `multiple` | A long `FormCheck` |

## Anatomy

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Checkbox | yes | The selection control: unchecked, checked or indeterminate. |
| 2 | Checkbox label | no | The value or a description of the option (`label`). Without it, the checkbox needs an accessible name. |
| 3 | State layer | no | The ring shown on hover and keyboard focus. |
| 4 | Group label | no | Names the group (`FormCheck` `label`), with an optional required mark and tooltip. |
| 5 | Helper text | no | A description or a validation message for the group (`FormCheck` `helperText`). |

## Composition

- Related checkboxes: one `FormCheck` with the `Checkbox`es as children. `FormCheck` passes `size`, `disabled`, `name` and the error state to every checkbox in it.
- `FormCheck` stacks its checkboxes in one column, 8px apart. The group label, the checkboxes and the helper text are 4px apart.
- Several columns in one group: keep one `FormCheck` and lay out its checkboxes with `radioGroupClassName={css({ display: 'grid', gridAutoFlow: 'column', gridTemplateRows: 'repeat(N, auto)', rowGap: '8', columnGap: '20' })}`, where N is the number of rows. Leave more space between columns than between rows.
- A label that wraps to several lines: the box stays aligned with the first line. This is built in.
- A parent "Select all" checkbox: `checked` when every child is checked, `indeterminate` when only some are. Clicking it while indeterminate deselects all children; clicking again selects all. The app computes these states: the component does not.
- A checkbox without a visible label (the Figma "Checkbox item"): pass `aria-label`, unless the checkbox sits in an element that carries the action, such as an interactive list item or a `SelectOption`. There it gets `tabIndex={-1}` ([List note](list.md)). A row selection checkbox in a table is the control itself: it keeps its tab stop and gets `aria-label` ([data table selection pattern](../patterns/data-table-selection.md)).
- Controlled: `checked` with `onChange`. Uncontrolled: `defaultChecked`.

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| Unchecked | default | A 1px `colors.neutral.700` border on a white box. |
| Checked | `checked` or `defaultChecked`, or a click | Box `colors.primary.600` with a white check mark. |
| Indeterminate | `indeterminate` | Box `colors.primary.600` with a white bar. Also sets the input's DOM `indeterminate`, so screen readers announce "mixed". |
| Hover | Pointer over the checkbox | A 4px ring in `colors.primary.100`. |
| Focus | Keyboard focus | A 4px ring in `colors.primary.200`. |
| Disabled | `disabled` on `Checkbox` or `FormCheck` | Border `colors.neutral.200`; a checked or indeterminate box turns `colors.neutral.200`; label `colors.neutral.500`. |
| Error, warning, success | `state` on `FormCheck` | Only the helper text changes: `colors.red.600`, `colors.orange.600` or `colors.green.600`. The boxes keep their colors. `state="error"` sets `aria-invalid` on the group and on each checkbox. |
| Required | `required` on `FormCheck` | A red asterisk after the group label. |

## Accessibility

### Keyboard

- Tab moves focus to each checkbox in turn. A disabled checkbox is skipped.
- Space toggles the focused checkbox (native `<input type="checkbox">`).

### Accessible name

The `label`, linked to the input with `htmlFor`. A checkbox with no `label` needs `aria-label`, unless its row or item carries the action. A `FormCheck` group has `role="group"`, named by its `label` (`aria-labelledby`) and described by its helper text (`aria-describedby`).

### Focus

A 4px ring in `colors.primary.200` around the box on keyboard focus.

### Contrast pairs

| Foreground token | Background token | Min ratio |
|---|---|---|
| `colors.neutral.900` | `colors.white` | 4.5 |
| `colors.neutral.700` | `colors.white` | 4.5 |
| `colors.red.600` | `colors.white` | 4.5 |
| `colors.white` | `colors.primary.600` | 3 |
| `colors.neutral.700` | `colors.white` | 3 |

The last two rows are non-text contrast: the check mark on the checked box, and the unchecked box's border.

## Content

- The label states the option, in a few words.
- A group label names what the options have in common, such as "Booking status".
- Use the helper text for a rule or an error, such as "Select at least one status".

## Do and don't

| Don't | Do |
|---|---|
| Center the box vertically on a label that wraps to several lines | Align the box to the top of the label (built in) |
| A group in several columns with the same space between columns as between rows | More space between columns (20px) than between rows (8px) |
| Several `FormCheck`s side by side to make columns of one group | One `FormCheck` with a grid layout in `radioGroupClassName` |
| A single checkbox for one on/off option | `Toggle` |
| Checkboxes for options that exclude each other | `Radio` |

## Component tokens

## Figma to code mapping

Figma sets on the Checkbox page of the library. Confirmed by the team on 2026-11-04. The usage documentation in Figma is the frame "Checkbox-Document-Overview" (node `4834:20201`); its sizes and specs (box 16 / 16 / 12px, gap 8 / 6 / 4px) and the error colors of the group match the recipes in code.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| Checkbox | any | — | `Checkbox` |
| Checkbox · Value | true | `label` | the text in Value text |
| Checkbox · Value | false | `aria-label` | a name for the checkbox; no `label` |
| Checkbox · Selection | Unchecked / Checked / Indeterminate | `checked` / `indeterminate` | `false` / `true` / `indeterminate={true}` |
| Checkbox · Size | Large / Medium / Small | `size` | `"responsive"`, set on the `FormCheck` when there is one. The Figma size shows the frame's viewport; use `"lg"` / `"md"` / `"sm"` only when the design asks for a fixed size. |
| Checkbox · State | Enable | — | default |
| Checkbox · State | Hover / Focus | — | interaction states, not props |
| Checkbox · State | Disable | `disabled` | `true` |
| Checkbox item | any | — | `Checkbox` with no `label`; see Composition for its accessible name. Size Large / Small are the 16px and 12px boxes: `size="responsive"`. |
| Checkbox group | any | — | `FormCheck` with `Checkbox` children |
| Checkbox group · Label | true | `label` | the group label |
| Checkbox group · Helper / Helper text | true / text | `helperText` | the text |
| Checkbox group · State | Enable | — | default |
| Checkbox group · State | Error | `state`, `helperText` | `"error"`, the error message |
| Checkbox group · Alignment | Default | — | one column, the default |
| Checkbox group · Size | Large / Medium / Small | `size` on `FormCheck` | `"responsive"` |
| Input label item (in the group) · Required | True | `required` on `FormCheck` | `true` |
| Input label item (in the group) · Tooltip | true, alignment Right / Left | `labelSuffix` / `labelPrefix` | an info icon inside `Tooltip`, with `aria-label` ([Tooltip note](tooltip.md)) |

In code only, with no Figma variant yet: `state="warning"` and `state="success"` on `FormCheck`. The multi-column group is shown in the Figma documentation, but no set property draws it.

## Open questions

1. Resolved 2026-11-10 (team, [known issues](../reports/known-issues-2026-11-10.md) Q1): the Why this design section stays empty. Question was: Why this design and its trade-offs: the docs give none.
2. Resolved 2026-11-05: the Figma Toggle documentation shows "Agree to terms and conditions" as a checkbox, not a toggle.
3. Upstream, for the Magenta team: `FormCheck` has no prop for a multi-column layout; the note uses `radioGroupClassName`, whose name also suggests it was meant for `Radio`.
4. Upstream, for the Magenta team: `FormCheck` renders its label inside a `<fieldset>` element and the checkboxes in a separate `role="group"` element; a `<fieldset>` with a `<legend>` wrapping the checkboxes is the usual pattern. The check mark is the text character "✓" in the system font, so it may look different on each platform.
5. For the design team: add the warning and success states to the Figma Checkbox group set.

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-11-05 from contracts/Checkbox.json and contracts/FormCheck.json (scripts/build-contracts.mjs). Sizes and colors read from the checkbox and formCheck recipes. Replaced by build/meta in phase 3. -->

### Props

`Checkbox` (also accepts the attributes of `<input>`: `checked`, `defaultChecked`, `disabled`, `name`, `value`, `onChange`…)

| Prop | Type | Default | Description |
|---|---|---|---|
| `indeterminate` | `boolean` |  | If true, the checkbox will be in an indeterminate state. |
| `label` | `React.ReactNode` |  | Label for the checkbox. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'responsive'` | `lg` | Size of the checkbox. |

`FormCheck` (also accepts the attributes of `<div>`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `disabled` | `boolean` |  | Whether the form check is disabled |
| `helperText` | `React.ReactNode` |  | Helper text to display below the form check |
| `label` | `React.ReactNode` |  | Label for the form check |
| `labelPrefix` | `React.ReactNode` |  | Prefix element for the label |
| `labelSuffix` | `React.ReactNode` |  | Suffix element for the label |
| `name` | `string` |  | Name of the form check |
| `radioGroupClassName` | `string` |  | Class name for the radio group |
| `required` | `boolean` | `false` | Whether the form check is required |
| `size` | `'sm' \| 'md' \| 'lg' \| 'responsive'` | `lg` | Size of the form check |
| `state` | `'error' \| 'warning' \| 'success'` |  | State of the form check (error, warning, success) |

A `Checkbox` inside a `FormCheck` takes its `size`, `disabled` and `name` from it unless set on the checkbox.

### Sizes

From the `checkbox` and `formCheck` recipes.

| Size | Box | Row height (`lineHeights`) | Gap box to label | Label text (`fontSizes` / `lineHeights`) | Group label and helper text |
|---|---|---|---|---|---|
| `sm` | 12px | md (16px) | 4 | xs / md (`body1` sm) | 2xs / sm |
| `md` | 16px | lg (20px) | 6 | sm / lg (`body1` md) | xs / md |
| `lg` | 16px | 2xl (24px) | 8 | md / 2xl (`body1` lg) | sm / lg |
| `responsive` | `sm` under 1280px, `md` from 1280px, `lg` from 1920px | | | | |

`FormCheck`: 8 between checkboxes, 4 between the group label, the checkboxes and the helper text. Group label `neutral.700`, semi-bold; required mark `red.500`; helper text `neutral.700`.

### Colors by state

From the `checkbox` recipe; all are `colors.*` tokens. Box radius `radii.sm`.

| State | Box border | Box fill | Mark | Label |
|---|---|---|---|---|
| unchecked | neutral.700, 1px | white | | neutral.900 |
| checked | none | primary.600 | white check | neutral.900 |
| indeterminate | none | primary.600 | white bar | neutral.900 |
| hover | as above, plus a 4px ring primary.100 | | | |
| focus | as above, plus a 4px ring primary.200 | | | |
| disabled, unchecked | neutral.200, 1px | white | | neutral.500 |
| disabled, checked or indeterminate | none | neutral.200 | white | neutral.500 |

Helper text by `FormCheck` `state`: error `red.600`, warning `orange.600`, success `green.600`. Stories: `packages/docs/stories/Components/Checkbox/Checkbox.stories.tsx#Playground`.
<!-- GENERATED:END -->
