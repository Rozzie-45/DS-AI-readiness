---
type: component
component: "Radio"
description: "A radio button is an input control that allows users to select one option from a set of mutually exclusive options."
category: selection
status: draft
figma_url: "https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=4903-38680"
alternatives:
  - Checkbox
  - Select
  - Toggle
related:
  - FormCheck
  - Checkbox
  - Select
  - Toggle
can_contain: []
cannot_contain: []
required_children: []
a11y_role: radio
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/docs/stories/Components/Radio/Design.mdx
  - packages/docs/stories/Components/Radio/Examples
  - packages/react/src/components/Radio/Radio.tsx
  - packages/react/src/components/FormCheck/FormCheck.tsx
  - packages/css/src/recipes/radio.ts
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Radio

## Overview

A selection control for one choice among options that exclude each other, in forms and surveys. Users see every option and pick exactly one. Radios come in a group, `FormCheck`, which adds a group label, helper or validation text and a required mark, and gives every radio the same `name`. A radio is selected or unselected.

## When to use

- Exactly one option from a list of mutually exclusive choices, with all options visible.
- A manageable number of options, about 2 to 5.

## When not to use

- Several options may be selected. Use `Checkbox`.
- More than 5 options. Use `Select` (or a segmented control).
- Two states of one setting that apply at once, such as on and off. A `Toggle` can replace two radio buttons ([Toggle note](toggle.md)).

## Why this design

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Several options may be chosen | `Checkbox` | `Radio` |
| One choice from more than 5 options | `Select` | A long radio group |
| One setting that is on or off | `Toggle` | Two radios |

## Anatomy

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Radio button | yes | The selection control. |
| 2 | Label | yes | The value or description of the option (`label`). |
| 3 | State layer | no | The ring on hover and keyboard focus. |
| 4 | Group label | yes | Names the group (`FormCheck` `label`). |
| 5 | Helper text | no | A description or validation message (`FormCheck` `helperText`). |

## Composition

- A group: one `FormCheck` with a `name` and the `Radio`s as children, each with its `label` and `value`. `FormCheck` passes `name`, `size`, `disabled` and its error state to every radio. Without a `FormCheck`, give every radio of a group the same `name`.
- `FormCheck` stacks the radios in one column, 8px apart; group label, radios and helper text are 4px apart. For several columns, use the grid layout of the [Checkbox note](checkbox.md) on `radioGroupClassName`.
- A label that wraps: the radio stays aligned with the first line (built in).
- A radio without a visible label (the Figma "Radio button item"): pass `aria-label`.
- Controlled: `checked` with `onChange` on each radio. Uncontrolled: `defaultChecked` on the default option.
- Size: `size="responsive"` on the `FormCheck`.

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| Unselected | default | A 1px ring in `colors.neutral.700`. |
| Selected | `checked`, `defaultChecked` or a click | Ring and dot `colors.primary.600`. Selecting one radio unselects the others with the same `name`. |
| Hover | Pointer over the radio | A 4px halo in `primary.100`. |
| Focus | Keyboard focus | A 4px halo in `primary.200`. |
| Disabled | `disabled` on `Radio` or `FormCheck` | Ring and dot `colors.neutral.200`, label `colors.neutral.500`. |
| Error | `state="error"` on `FormCheck` | Helper text `colors.red.600` and `aria-invalid` on the group; the radios keep their colors. |

## Accessibility

### Keyboard

- Tab moves into the group, on the selected radio (or the first one); Tab again leaves the group.
- Arrow keys move to the next or previous radio of the same `name` and select it.

### Accessible name

Each radio is a native `<input type="radio">`, named by its `label`. The `FormCheck` group has `role="group"`, named by its label and described by its helper text.

### Focus

A 4px halo in `primary.200` around the radio on keyboard focus.

### Contrast pairs

| Foreground token | Background token | Min ratio |
|---|---|---|
| `colors.neutral.900` | `colors.white` | 4.5 |
| `colors.neutral.700` | `colors.white` | 3 |
| `colors.primary.600` | `colors.white` | 3 |

The last two rows are the ring of an unselected and a selected radio.

## Content

- Labels name each option in a few words; the group label names what the options have in common, such as "User group".
- Use the helper text for a rule or an error, such as "Select a user group".

## Do and don't

| Don't | Do |
|---|---|
| Center the radio vertically on a label that wraps | Align it to the top of the label (built in) |
| Radios for options that can be combined | `Checkbox` |
| A radio group with many options | `Select` |
| Radios of one group with different `name`s | One `FormCheck` with a `name` |

## Component tokens

## Figma to code mapping

Figma sets on the "Radio Button" page of the library. Mapped on 2026-11-05 with the same decisions as Checkbox; not yet confirmed on its own. The usage documentation in Figma is the frame "Radio button-Document-Overview" (node `4903:38680`); its sizes (radio 16 / 16 / 12px, gap 8 / 6 / 4px) match the `radio` recipe.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| Radio button | any | — | `Radio` |
| Radio button · Value | true | `label` | the text in Value text |
| Radio button · Value | false | `aria-label` | a name for the radio; no `label` |
| Radio button · Selection | Selected / Unselected | `checked` | `true` / `false` |
| Radio button · Size | Large / Medium / Small | `size` | `"responsive"`, set on the `FormCheck`. The Figma size shows the frame's viewport; use `"lg"` / `"md"` / `"sm"` only when the design asks for a fixed size. |
| Radio button · State | Enable | — | default |
| Radio button · State | Hover / Focus | — | interaction states, not props |
| Radio button · State | Disable | `disabled` | `true` |
| Radio button item | any | — | `Radio` with no `label` and with `aria-label`; Size Large / Small are the 16px and 12px radios |
| Radio button form group | any | — | `FormCheck` with a `name` and `Radio` children |
| Radio button form group · Label | true | `label` | the group label |
| Radio button form group · Helper / Helper text | true / text | `helperText` | the text |
| Radio button form group · State | Error | `state`, `helperText` | `"error"`, the error message |
| Radio button form group · Alignment | Default | — | one column, the default |
| Input label item (in the group) · Required / Tooltip | True / true | `required` / `labelSuffix` or `labelPrefix` | as for checkbox groups ([Checkbox note](checkbox.md)) |

In code only, with no Figma variant yet: `state="warning"` and `state="success"` on `FormCheck`.

## Open questions

1. Resolved 2026-11-10 (team, [known issues](../reports/known-issues-2026-11-10.md) Q1): the Why this design section stays empty. Question was: Why this design and its trade-offs: the docs give none.
2. Upstream, for the Magenta team:
   - A radio group should have `role="radiogroup"`; `FormCheck` gives every group `role="group"`.
   - The hover and focus halos are hard-coded hex colors in the SVG (`#F8E7F1`, `#EBB7D5`), copies of `primary.100` and `primary.200`, not tokens.
3. For the design team: add the warning and success states to the Figma Radio button form group set.

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-11-05 from contracts/Radio.json and contracts/FormCheck.json (scripts/build-contracts.mjs). Sizes and colors read from the radio recipe and the Radio icon. Replaced by build/meta in phase 3. -->

### Props

`Radio` (also accepts the attributes of `<input>`: `checked`, `defaultChecked`, `disabled`, `name`, `value`, `onChange`…)

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `React.ReactNode` |  | The label to display next to the radio button |
| `size` | `'sm' \| 'md' \| 'lg' \| 'responsive'` | `lg` | The size of the radio button |

`FormCheck` props are listed in the [Checkbox note](checkbox.md). A `Radio` inside a `FormCheck` takes its `name`, `size` and `disabled` from it unless set on the radio.

### Sizes

| Size | Radio | Row height (`lineHeights`) | Gap radio to label | Label text (`fontSizes` / `lineHeights`) |
|---|---|---|---|---|
| `sm` | 12px | md (16px) | 4 | xs / md |
| `md` | 16px | lg (20px) | 6 | sm / lg |
| `lg` | 16px | 2xl (24px) | 8 | md / 2xl |
| `responsive` | `sm` under 1280px, `md` from 1280px, `lg` from 1920px | | | |

### Colors

| State | Ring and dot | Label |
|---|---|---|
| unselected | neutral.700 ring | neutral.900 |
| selected | primary.600 ring and dot | neutral.900 |
| hover | plus a 4px halo primary.100 | |
| focus | plus a 4px halo primary.200 | |
| disabled | neutral.200 | neutral.500 |

Stories: `packages/docs/stories/Components/Radio/Radio.stories.tsx#Playground`.
<!-- GENERATED:END -->
