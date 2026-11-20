---
type: component
component: "Tag"
description: "A tag is used to organize content such as labels, and categories. The label normally represents the keyword to describe the item."
category: data-display
status: draft
figma_url: "https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=6881-106985"
alternatives: []
related:
  - TagContent
  - TagsInput
  - Select
  - Autocomplete
  - Tooltip
  - Tabs
can_contain:
  - TagContent
cannot_contain: []
required_children:
  - TagContent
a11y_role: ""
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/docs/stories/Components/Tag/Design.mdx
  - packages/docs/stories/Components/Tag/Examples
  - packages/react/src/components/Tag/Tag.tsx
  - packages/react/src/components/Tag/Tag.model.ts
  - packages/css/src/recipes/Tag/tag.ts
  - packages/css/src/recipes/Tag/utils.ts
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Tag

## Overview

A small label that categorizes, classifies or identifies content by an attribute, a topic or a state. Tags help users and systems find, filter and organize content. A tag has a label, an optional leading icon, and an optional close button. It comes in two styles: Light, for busy screens with a lot of visual information, and Bold, with higher contrast for emphasis.

A tag is one of three kinds, never two at once: basic (read-only), interactive (clickable or selectable), or removable.

## When to use

- Categorizing or labelling an item by a keyword, such as a container type.
- A group of related tags that share a theme, topic or purpose.
- A status tag: a non-interactive or removable tag that states an entity's state, such as DRAFT or OVERDUE.
- An interactive tag the user clicks or selects.
- A removable tag for a value the user can take away.

## When not to use

- Values the user picks inside a field. `Select` (`renderValueType="tag"`), `TagsInput` and `Autocomplete` draw those tags themselves; do not place `Tag`s in a field by hand.
- A tag that is both interactive and removable. Choose one.

## Why this design

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Chosen values shown in a form field | `Select`, `TagsInput` or `Autocomplete`, which render tags | `Tag`s placed next to an `Input` |
| A colored tab in a tab group | `Tabs` (Tabs note) | A `Tag` styled as a tab |

## Anatomy

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Label | yes | The keyword, in a `TagContent` (`children`). |
| 2 | Icon | no | Indicates the purpose of the tag: an icon placed before the `TagContent`. |
| 3 | Close button | no | Removes the tag (`deletable`, `onDeleted`). |

## Composition

- Write the label inside `TagContent`: `<Tag><TagContent>Label</TagContent></Tag>`. Truncation and wrapping only work on a `TagContent`.
- An icon goes before the `TagContent`, as a child of `Tag`.
- Status tag: `className={css({ textTransform: 'uppercase' })}`, not interactive. It can be removable.
- A group of tags: a wrapping row, 8px apart both ways: `css({ display: 'flex', flexWrap: 'wrap', gap: '8' })`.
- Long labels: a tag stays on one line and ends with an ellipsis. With enough horizontal space, set `multiline` so the label wraps to a second line. In tight spaces keep one line and show the full label in a `Tooltip`: the tag goes inside a `TooltipTrigger` without `asChild`, so keyboard users can reach it ([Tooltip note](tooltip.md)).
- Removable: `deletable` with `onDeleted`, which removes the tag from your data. `deleteIcon` changes the close icon.

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| Basic | default | Not focusable, no hover state. |
| Interactive | `interactive` | Renders a `<button>`: focusable, with hover, focus and pressed states. |
| Hover | Pointer over an interactive tag or a close button | Background one level lighter (Light `.100`, Bold `.500`). |
| Pressed | Press on an interactive tag or a close button | Background one level darker (Light `.300`, Bold `.700`). |
| Focus | Keyboard focus | A 1px ring in the color's `.300` level. |
| Selected | `selected`, on an interactive tag | Background one level lighter, with a 1px ring (Light `.500`, Bold `.800`). |
| Removable | `deletable` | A close button at the right; Enter, Space or a click calls `onDeleted`. |
| Disabled | `disabled` | Background `colors.neutral.100`, text `colors.neutral.300`; not interactive. |

## Accessibility

### Keyboard

- An interactive tag is a tab stop; Enter or Space activates it.
- A removable tag's close button is a tab stop; Enter or Space removes the tag.
- A basic tag is not focusable.

### Accessible name

An interactive tag is named by its label. The close button's name is set by the component (see Open questions).

### Focus

A 1px ring in the tag color's `.300` level: around the tag, or inside the close button.

### Contrast pairs

| Foreground token | Background token | Min ratio |
|---|---|---|
| `colors.<color>.900` | `colors.<color>.200` | 4.5 |
| `colors.white` | `colors.<color>.600` | 4.5 |
| `colors.neutral.300` | `colors.neutral.100` | — |

`<color>` is the tag's `color`: neutral, primary, secondary, blue, green, orange, red, purple or royal. Disabled text is exempt from contrast rules.

## Content

- The label is a keyword: one or two words.
- Status tags use short states: Draft, Scheduled, Sent, Failed, Overdue, To do, In progress, Done.

## Do and don't

| Don't | Do |
|---|---|
| `interactive` and `deletable` on the same tag | One of them |
| A label as plain text inside `Tag` | The label inside `TagContent` |
| A long label that pushes the layout in a tight space | One line with an ellipsis, and a `Tooltip` with the full label |
| `Tag`s placed next to an input to show chosen values | `Select`, `TagsInput` or `Autocomplete` |

## Component tokens

## Figma to code mapping

Figma sets on the Tags page of the library. Confirmed by the team on 2026-11-05. The usage documentation in Figma is the frame "Tag-Document-Overview" (node `6881:106985`); its sizes, colors and group spacing (8px) match the code.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| Tag | any | — | `Tag` with a `TagContent` |
| Tag · Label text | text | `children` of `TagContent` | the label |
| Tag · Left icon, Swap left icon | true, icon instance | — | the icon from `@ocean-network-express/magenta-react-icons`, before the `TagContent` |
| Tag · Style | Light / Bold | `variant` | `"light"` / `"bold"` |
| Tag · Color | Neutral / Primary / Secondary / Blue / Green / Orange / Red / Purple / Royal Purple | `color` | `"neutral"` / `"primary"` / `"secondary"` / `"blue"` / `"green"` / `"orange"` / `"red"` / `"purple"` / `"royal"` |
| Tag · Type | Default | — | default |
| Tag · Type | Status | `className` | `css({ textTransform: 'uppercase' })`; not interactive |
| Tag · Size | Large / Medium / Small | `size` | `"responsive"`. The Figma size shows the frame's viewport; use `"lg"` / `"md"` / `"sm"` only when the design asks for a fixed size. |
| Tag · State | Enable | — | default |
| Tag · State | Hover / Focus / Pressed (Removable False) | `interactive` | `true`; the states are interactions, not props |
| Tag · State | Hover / Focus / Pressed (Removable True) | — | interaction states of the close button; the tag is not `interactive` |
| Tag · State | Selected | `interactive`, `selected` | `true`, `true` |
| Tag · State | Disable | `disabled` | `true` |
| Tag · Removable | True | `deletable`, `onDeleted` | `true`, the remove handler |
| Tag · Editing | True | — | Not a `Tag` prop: a tag being edited inline in `TagsInput` with `editable` ([TagsInput note](tags-input.md)) |
| Tag close button item | any | — | drawn by `Tag` when `deletable`; `deleteIcon` changes the icon |
| Tag for Tab Group / Tag group menu button | any | — | Not `Tag`: the group label and menu of `TabListGroup` ([Tab group note](tab-group.md)) |
| Documentation · Input tag | — | — | tags drawn by `Select` (`renderValueType="tag"`), `TagsInput` or `Autocomplete`; `renderTag` customizes them |

## Open questions

1. Resolved 2026-11-10 (team, [known issues](../reports/known-issues-2026-11-10.md) Q1): the Why this design section stays empty. Question was: Why this design and its trade-offs: the docs give none.
2. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) D2): Tag vs text badge: decided 2026-11-05 that an entity's status is a status `Tag`, and a text badge (`Indicator text`) is a short supplementary label ([Indicator note](indicator.md)); the team should confirm.
3. Upstream, for the Magenta team: Figma has a status type with an all-caps text style; code has no status type, no uppercase option and no all-caps text style token. The note uses a `className`.
4. Upstream, for the Magenta team: the Group and WithIcons stories combine `interactive` and `deletable`, which puts the close control (a `span` with `role="button"`) inside the tag's `<button>`. The note forbids the combination.
5. Upstream, for the Magenta team: the close button's accessible name is "delete" plus a generated id, not the tag's label; the tag sets `aria-selected` on an element whose role does not support it; `TagContent` sets `aria-description="tag-content"` as a style hook, which screen readers may read out.
6. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) D11): Contrast: Bold green (white on `colors.green.600`, 3.47:1) and Bold orange (white on `colors.orange.600`, 2.58:1) are below 4.5:1. The team keeps failing pairs as they are (foundations/color.md).

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-11-05 from contracts/Tag.json and contracts/TagContent.json (scripts/build-contracts.mjs). Sizes and colors read from the tag recipe and its createCompoundTagStyles helper. Replaced by build/meta in phase 3. -->

### Props

`Tag` (also accepts the attributes of `<button>`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `'neutral' \| 'primary' \| 'secondary' \| 'blue' \| 'green' \| 'orange' \| 'red' \| 'purple' \| 'royal'` | `neutral` | The color of the tag |
| `deletable` | `boolean` | `false` | Whether the tag is deletable |
| `deleteIcon` | `React.ReactNode` |  | Custom delete icon for the tag |
| `deleteIconProps` | `ExtendableComponentProps<'span'>` |  | Props for the delete icon |
| `disabled` | `boolean` | `false` | Whether the tag is disabled |
| `interactive` | `boolean` | `false` | Whether the tag is interactive (clickable) |
| `multiline` | `boolean` | `false` | Whether the tag supports multiline content |
| `onDeleted` | `() => void` |  | Callback triggered when the tag is deleted |
| `selected` | `boolean` | `false` | Whether the tag is selected |
| `size` | `'sm' \| 'md' \| 'lg' \| 'responsive'` | `lg` | The size of the tag |
| `variant` | `'light' \| 'bold'` | `light` | The visual variant of the tag |

`TagContent`: the label; accepts the attributes of `<div>`.

### Sizes

From the `tag` recipe. The tag's height is the line height; there is no vertical padding.

| Size | Height | Padding x | Gap icon to label | Text (`fontSizes` / `lineHeights`) | Icon | Close button width |
|---|---|---|---|---|---|---|
| `sm` | 16px | 4 | 4 | xs / md | 12px | 16px |
| `md` | 20px | 6 | 4 | sm / lg | 16px | 20px |
| `lg` | 24px | 8 | 4 | md / 2xl | 16px | 24px |
| `responsive` | `sm` under 1280px, `md` from 1280px, `lg` from 1920px | | | | | |

Close icon 16px. Border radius `radii.md`.

### Colors by variant and state

All are `colors.*` tokens; `<color>` is the tag's `color` (`royal` for Royal Purple).

| Variant | Background | Text and icons | Hover | Pressed | Focus ring | Selected |
|---|---|---|---|---|---|---|
| light | `<color>.200` | `<color>.900` | `<color>.100` | `<color>.300` | `<color>.300`, 1px | background `<color>.100`, ring `<color>.500` |
| bold | `<color>.600` | white | `<color>.500` | `<color>.700` | `<color>.300`, 1px | background `<color>.500`, ring `<color>.800` |
| disabled (both) | neutral.100 | neutral.300 | | | | |

Hover, pressed and focus apply to an interactive tag and to the close button. Stories: `packages/docs/stories/Components/Tag/Tag.stories.tsx#Playground`.
<!-- GENERATED:END -->
