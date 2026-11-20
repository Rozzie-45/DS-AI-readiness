---
type: component
component: "Segmented"
description: "Segmented controls let users switch between related options."
category: selection
status: draft
figma_url: "https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=10427-512856"
alternatives:
  - Tabs
  - Select
  - ButtonGroup
related:
  - SegmentedItem
  - Indicator
  - DropdownMenu
can_contain:
  - SegmentedItem
cannot_contain: []
required_children:
  - SegmentedItem
a11y_role: radiogroup
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/docs/stories/Components/Segmented/Design.mdx
  - packages/docs/stories/Components/Segmented/Code.mdx
  - packages/docs/stories/Components/Segmented/Examples
  - packages/react/src/components/Segmented/Wrapper.tsx
  - packages/react/src/components/Segmented/Item.tsx
  - packages/react/src/components/Segmented/hooks/useSegmentedNavigation.ts
  - packages/css/src/recipes/Segmented/Wrapper.ts
  - packages/css/src/recipes/Segmented/Item.ts
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Segmented

## Overview

A row of joined segments that lets the user switch between one option or content section at a time from a small set of closely related choices. Exactly one segment is selected. Built from `Segmented` (the container and the selected index) and `SegmentedItem` (one segment, a button).

## When to use

From the docs and the Figma documentation frame:

- Switching between views, in toolbars or navigation bars ("List view", "Grid view").
- Switching between editing modes ("Editing", "Read-only").
- Filtering content by criteria ("All", "Active", "Completed").
- Sorting content ("All", "Read", "Unread").

Used with `Tabs`, a segmented control takes a lower place in the hierarchy than the tabs: it filters or sorts within one tab (docs).

## When not to use

From the docs:

- Navigation between unrelated content, sections or subpages. Use `Tabs` ([Tabs note](tabs.md)).
- Many options: the control gets cluttered. Use `Select` ([Select note](select.md)); keep a segmented control to fewer than 6 options.
- Choices that perform actions rather than select an option. Use `ButtonGroup` ([ButtonGroup note](button-group.md)).

## Why this design

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Filtering or sorting within one view, 2–5 options | `Segmented` | `Tabs` |
| Distinct sections or subpages | `Tabs` | `Segmented` |
| 6 or more options | `Select` | `Segmented` |
| Several actions of equal weight | `ButtonGroup` | `Segmented` |
| One option that is on or off | `Toggle` | A `Segmented` with two items |

## Anatomy

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Container | yes | `Segmented`: `colors.neutral.100` background with a 2px `colors.neutral.200` outline, radius `radii.lg`, as wide as its items. |
| 2 | Selected section | yes | The one selected `SegmentedItem`: white, raised (`shadows.md`), text `colors.primary.600`. |
| 3 | Enabled section | yes | The other items: transparent, text `colors.neutral.700`. |
| 4 | Label text | yes | The children of `SegmentedItem`, semibold. |
| 5 | Indicator | no | An `Indicator` after the label, for new or unread content (Figma). |

## Composition

- Structure: `<Segmented>` with 2 to 5 `<SegmentedItem>` children (Figma has 2 to 6; the docs say fewer than 6). The selection is the item's index, zero-based, in children order.
- Uncontrolled: `defaultIndex` (0 by default). Controlled: `selectedIndex` with `onChange(index)`.
- Size: pass `size="responsive"`; the default is `lg`. Give an `Indicator` inside an item the same size.
- Label the group: pass `aria-label` (or `aria-labelledby`) naming what the choice is, such as "Booking status".
- Disabled item: `disabled` on `SegmentedItem` (it passes button attributes through). Do not make the last item disabled: End would select it (see Accessibility).
- Width: the control is as wide as its items; labels do not wrap. There is no full-width option.
- Overflow menu: when there are more options than fit, the last item can open a `DropdownMenu` with the rest, as in the "Segmented with menu" story: the item shows the chosen option's label and a chevron, and `onChange` and the menu's `onItemClick` both update the view.
- With `Tabs`: the story puts the `Segmented` inside `Tabs` and sets the tab index from `onChange`, with one `TabPanel` per option.

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| Selected | Click, arrow keys, `defaultIndex`, `selectedIndex` | White background, `shadows.md`, text `colors.primary.600`. Only one at a time; selecting by arrow key also moves focus. |
| Hover | Pointer over an item | Text `colors.primary.400`. |
| Focus | Keyboard focus | The item's 2px border turns `colors.primary.300`. |
| Disabled | `disabled` on the item | Text `colors.neutral.500`; not clickable; arrow keys skip it. |

Measured in the prototype (screen `#/segmented`) with `size="responsive"`: items are 32px high with 8px padding and 11px text at 1024px, 36px with 8 × 12px padding and 13px text at 1280px, and 40px with 8 × 16px padding and 15px text at 1920px, as the docs' specs give.

## Accessibility

### Keyboard

- Tab moves into the control onto the selected item, and out of it in one step (only the selected item is in the tab order).
- Arrow Right and Arrow Left select the next and previous item and move focus to it, wrapping at the ends and skipping disabled items.
- Home and End select the first and last item. They do not skip disabled items: with the last item disabled, End selects it while focus stays where it was (measured).
- Enter or Space on an item selects it (it is a button).

### Accessible name

The container has `role="group"` and each item `role="radio"` with `aria-checked`. Name the group with `aria-label` or `aria-labelledby`; it has no name otherwise. An item's name is its text, including an `Indicator`'s number (for example "Unread 12").

### Focus

Focus stays on the item that was chosen. The control does not move focus to the content it filters.

### Contrast pairs

| Foreground token | Background token | Min ratio |
|---|---|---|
| `colors.primary.600` (selected) | `colors.white` | 4.5 |
| `colors.neutral.700` (unselected) | `colors.neutral.100` | 4.5 |
| `colors.primary.400` (hover) | `colors.neutral.100` | 4.5 |

## Content

- Labels: one or two words naming the view, mode, filter or sort, as in the docs' examples ("List view", "All", "Unread").

## Do and don't

| Don't | Do |
|---|---|
| `size` left out | `size="responsive"` |
| A `Segmented` with no `aria-label` | `aria-label` naming the choice |
| 6 or more items | `Select`, or an overflow menu on the last item |
| Items that run actions ("Export", "Delete") | `ButtonGroup` |
| A segmented control as the main navigation of a page | `Tabs` |
| A disabled last item | Disable a middle item, or remove the option |

## Component tokens

## Figma to code mapping

Figma page "Segmented Control": sets "Segmented control" (`11481:123091`) and "Segment item" (`10280:231099`). Usage documentation: frame "Segmented-Document-Overview" (`10427:512856`); its text matches the Storybook docs. Read on 2026-11-09.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| Segmented control · Size, Segment item · Size | Large / Medium / Small | `size` on `Segmented` | `"lg"` / `"md"` / `"sm"`; `"responsive"` in product screens |
| Segmented control · Segment qty | 2–6 | — | the number of `SegmentedItem` children |
| Segment item · Status | Selected / Unselected | `selectedIndex` or `defaultIndex` | the item's index / another index |
| Segment item · State | Enable / Hover / Focus | — | Interaction states |
| Segment item · State | Disable | `disabled` on `SegmentedItem` | `true` |
| Segment item · Label text | text | — | children of `SegmentedItem` |
| Segment item · Indicator | true | — | `<Indicator size="responsive" label="…" />` after the label |
| Segment item · Show trigger | true | — | a chevron icon in the item, which is the trigger of a `DropdownMenu` (overflow menu) |

## Open questions

1. Resolved 2026-11-10 (team, [known issues](../reports/known-issues-2026-11-10.md) Q1): the Why this design section stays empty. Question was: Why this design and its trade-offs: the docs give none.
2. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A5): The container has `role="group"`, not `radiogroup`, around items with `role="radio"`. Should it be `radiogroup`?
3. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) B14): The docs say fewer than 6 options; Figma offers up to 6. Which is the limit?
4. Upstream, for the Magenta team: Home and End select disabled items; the container has no name by default; the item recipe uses raw values (`2px` borders); a code comment says labels should be wrapped in `Text` for consistent typography.

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-11-09 from contracts/Segmented.json, contracts/SegmentedItem.json (scripts/build-contracts.mjs). Styles read from the segmentedWrapper and segmentedItem recipes. Replaced by build/meta in phase 3. -->

### Props

`Segmented` (also accepts the attributes of `<div>`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg' \| 'responsive'` | `lg` | Size of the segmented items |
| `defaultIndex` | `number` | | Default index of the selected item |
| `selectedIndex` | `number` | | Currently selected index |
| `onChange` | `(index: number) => void` | | Callback function when the selected item changes |

`SegmentedItem`: no props of its own (also accepts the attributes of `<button>`, such as `disabled`).

### Styles

From the `segmentedWrapper` and `segmentedItem` recipes.

| Slot | Styles |
|---|---|
| wrapper `base` | flex, no wrap, gap 0, radius `radii.lg`, `colors.neutral.100`, width `fit-content`; first and last items rounded `radii.lg` |
| item `base` | `fontWeights.semi-bold`, no wrap, 2px top and bottom border `colors.neutral.200`; hover `colors.primary.400`; focus-visible border `colors.primary.300`; disabled `colors.neutral.500` |
| item · `selected` | `false`: `colors.neutral.700`, transparent; `true`: `colors.primary.600`, `colors.white`, `shadows.md` |
| item · `size` | `sm`: padding `spacing.8`, `fontSizes.xs`, height `sizes.32`; `md`: 8 × 12, `fontSizes.sm`, `sizes.36`; `lg`: 8 × 16, `fontSizes.md`, `sizes.40`; `responsive`: sm → md from `xl` → lg from `3xl` |

Stories: `packages/docs/stories/Components/Segmented/Segmented.stories.tsx`, `packages/docs/stories/Components/Segmented/Examples`.
<!-- GENERATED:END -->
