---
type: component
component: "Accordion"
description: "An accordion is a UI component that consists of a vertical stack of headers that can be expanded or collapsed to reveal or hide associated content sections."
category: layout
status: draft
figma_url: "https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=10383-406667"
alternatives:
  - Tabs
  - Collapse
  - TreeView
related:
  - AccordionItem
  - AccordionControl
  - AccordionPanel
  - Collapse
  - Divider
can_contain:
  - AccordionItem
cannot_contain: []
required_children:
  - AccordionItem
a11y_role: region
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/docs/stories/Components/Accordion/Design.mdx
  - packages/docs/stories/Components/Accordion/Accordion.mdx
  - packages/docs/stories/Components/Accordion/Examples
  - packages/react/src/components/Accordion/Accordion.tsx
  - packages/react/src/components/Accordion/Accordion.model.ts
  - packages/react/src/components/Accordion/hooks/useAccordion.tsx
  - packages/react/src/components/Accordion/AccordionItem/AccordionItem.tsx
  - packages/react/src/components/Accordion/AccordionControl/AccordionControl.tsx
  - packages/react/src/components/Accordion/AccordionPanel/AccordionPanel.tsx
  - packages/css/src/recipes/Accordion/accordion.ts
  - packages/css/src/recipes/Accordion/accordionItem.ts
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Accordion

## Overview

A vertical stack of sections, each with a header the user clicks to show or hide its content. It groups related information under clear labels so the user opens only what they need. Built from `Accordion` (the stack and its open state), `AccordionItem` (one section), `AccordionControl` (the header button with the arrow) and `AccordionPanel` (the content, animated by `Collapse`).

## When to use

From the docs and the Figma documentation frame:

- Grouping related information under clear labels, such as FAQs or product details, so the page stays short and the user opens what they need.
- Content of different kinds and lengths that the user explores at their own pace.
- Topics with subcategories: nest an accordion in a panel to show the layers (Nested accordions).

## When not to use

The docs give no list. These follow from what the component does and from the other notes:

- One block of content shown and hidden by your own trigger, with no header row. Use `Collapse` ([Collapse note](collapse.md)).
- Switching between views of the same level where only one is shown at a time and each is a peer. Use `Tabs` ([Tabs note](tabs.md)).
- A hierarchy the user navigates and selects in, such as folders. Use `TreeView`.
- Information the user must see to complete the task: do not hide it in a closed section; show it on the page.

## Why this design

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Several sections, each with a header that opens and closes it | `Accordion` | A `Button` and a `Collapse` per section |
| One block that your own control shows and hides | `Collapse` | An `Accordion` with one item |
| Peer views, one visible at a time | `Tabs` | An `Accordion` with `multiple` off |
| A selectable hierarchy | `TreeView` | Nested `Accordion`s |

## Anatomy

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Header (`AccordionControl`) | yes | A full-width button: the title, semibold, and anything else passed as children. |
| 2 | Icon | yes | The arrow, after the title (`arrowPosition="right"`, default) or before it (`"left"`). A chevron pointing right when closed and down when open. |
| 3 | Panel (`AccordionPanel`) | yes | The content shown when the item is open, below a 1px divider. |
| 4 | Additional | no | Extra header content such as a support text line or a `Tag` (the docs' "Additional (optional)"). |

## Composition

- Structure: `<Accordion>` → `<AccordionItem id="…">` → `<AccordionControl>` then `<AccordionPanel>`. Every `AccordionItem` needs an `id` that is unique in its `Accordion`; the open state refers to items by that `id`. `AccordionItem` throws an error with fewer than two children.
- Styles (Figma "Style"): separated, the default, gives each item its own border and rounded corners with a gap between items; `stacked` joins them into one block with lines between items and no outer border.
- Size: pass `size="responsive"`. With no `size` the items are `lg` at every width, but the gap between items is 12px whatever the item size.
- One or many open: one item at a time by default; `multiple` lets several stay open. Then `defaultOpenId` and `openId` are arrays of ids.
- Controlled: `openId` with `onChange` (the story's `setOpenId`). Uncontrolled: `defaultOpenId`, or nothing for all closed.
- Header content: plain text, or several children laid out in a column, such as the title and a support text line (`<Text level="body2">` with regular weight and `colors.neutral.700`, as in the Nested story). To put content at the far end of the header, wrap the children in a flex row with `justifyContent: 'space-between'`, as in the CustomLabel story.
- Panel content: any content. Actions for the section go at the end of the panel, aligned right, as in the Nested story and Figma.
- Headings: the component does not wrap headers in heading elements. Where the section titles belong to the page outline, wrap each `AccordionControl` in a heading at the right level, inside the `AccordionItem`: `<h3 className={css({ m: '0' })}><AccordionControl>…</AccordionControl></h3>`. Checked in the prototype (2026-11-10): the look and the arrow keys stay the same.
- Nested: put a `stacked` `Accordion` inside an `AccordionPanel`. The Nested story and Figma use `arrowPosition="left"` on both levels and a caret icon (`<CaretDownFill />` through `arrowIcon`) on the outer header.
- Custom arrow: `arrowIcon` on `AccordionControl` replaces the chevron; the component still turns it.
- Loading content on open: fetch in the `onClick` of `AccordionControl` and show a `Spinner` in the panel until the data arrives (Async story).

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| Closed | default | The panel has no height and is hidden from assistive technology; the arrow points right. |
| Open | Click, Enter or Space on the header; `defaultOpenId`; `openId` | The panel slides open (`transitionDuration`, 200ms by default); the arrow turns to point down. Without `multiple`, the item that was open closes. |
| Hover | Pointer over an enabled header | Header background `colors.neutral.100`. |
| Focus | Keyboard focus on the header | A 1px `colors.primary.300` outline around the whole item. |
| Disabled | `disabled` on `AccordionItem` | Item background `colors.neutral.100`, text `colors.neutral.500`, arrow `colors.neutral.300`; the header cannot be clicked or focused. |

Measured in the prototype (screen `#/accordion`) with `size="responsive"`: the header is 32px high with 8px padding and a 16px arrow at 1024px, 40px with 10px padding at 1280px, and 48px with 12px padding and a 20px arrow at 1920px; items are 4, 8 and 12px apart. The 1px divider above the panel is drawn even when the item is closed, so a closed separated item shows 2px of line along its bottom edge (43px tall at 1280px).

## Accessibility

### Keyboard

- Enter or Space on a header opens or closes its item.
- Arrow Down and Arrow Up move focus to the next and previous header in the same accordion, wrapping around and skipping disabled items.
- Home and End move to the first and last header. End does nothing when the last item is disabled (measured).
- Tab moves through headers and into open panels in page order.
- Arrow keys in a nested accordion stay inside that accordion.

### Accessible name

Each header is a `button` with `aria-expanded` and `aria-controls`; its name is its text. Each panel has `role="region"` named by its header (`aria-labelledby`). Headers are not wrapped in heading elements, so they do not appear in a screen reader's list of headings; wrap them yourself (see Composition).

### Focus

Focus stays on the header when its item opens or closes. The focus ring is drawn around the whole item, not only the header.

### Contrast pairs

| Foreground token | Background token | Min ratio |
|---|---|---|
| `colors.neutral.900` (header and text) | `colors.white` | 4.5 |
| `colors.neutral.900` (header on hover) | `colors.neutral.100` | 4.5 |

## Content

- Header: the title reflects what is in the section (docs, Anatomy). Keep it to one line; add a support text line under it when the title alone is not enough.

## Do and don't

| Don't | Do |
|---|---|
| `size` left out | `size="responsive"` |
| Two items with the same `id`, or an item with no `id` | A unique `id` on every `AccordionItem` |
| A required field or a key message inside a closed item | Show it on the page, outside the accordion |
| Separated items inside a panel | A `stacked` nested accordion |
| A third level of nesting | Two levels, as the Nested story and Figma show (no limit is documented) |
| An `Accordion` with one item to show and hide a block | `Collapse` |

## Component tokens

## Figma to code mapping

Figma page "Accordions": sets "Accordions" (`1526:25477`), "Accordion base" (`1524:24591`) and "Nested Accordion" (`3883:72786`). Usage documentation: frame "Accordion-Document-Overview" (`10383:406667`); its text matches the Storybook docs. A generated "Specs" frame (`40000018:2288`) lists the props (Trigger alignment, Style, Size) and the space between items: 12 (Large), 8 (Medium), 0 (Stacked), the same as measured in the prototype. Read on 2026-11-09; Specs read on 2026-11-11.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| Accordions · Size, Accordion base · Size | Large / Medium / Small | `size` on `Accordion` | `"lg"` / `"md"` / `"sm"`; `"responsive"` in product screens |
| Accordions · Style | Separated / Stacked | `stacked` | left out / `true` |
| Trigger alignment | Right / Left | `arrowPosition` on `Accordion` | `"right"` (default) / `"left"` |
| Accordion base · Expand | False / True | `openId` or `defaultOpenId` | the item's `id` not included / included |
| Accordion base · State | Enable / Hover / Focus | — | Interaction states |
| Accordion base · State | Disable | `disabled` on `AccordionItem` | `true` |
| Accordion base · Title text | text | — | children of `AccordionControl` |
| Accordion base · Title slot | true | — | extra children of `AccordionControl` (see Composition) |
| Accordion base · Content text, Show slot, Swap slot | text, instance | — | children of `AccordionPanel` |
| Nested Accordion · Title helper text, Support info | true | — | a `<Text level="body2">` line under the title in `AccordionControl` |
| Nested Accordion · Actions | true | — | `Button`s at the end of the outer `AccordionPanel`, aligned right |
| Nested Accordion · caret icon | — | `arrowIcon` on the outer `AccordionControl` | `<CaretDownFill />` |
| Nested Accordion · inner Accordions instance | — | — | a `stacked` `Accordion` in the outer `AccordionPanel` |

## Open questions

1. Resolved 2026-11-10 (team, [known issues](../reports/known-issues-2026-11-10.md) Q1): the Why this design section stays empty. Question was: Why this design and its trade-offs: the docs give none. "When not to use" and the two-level limit are drawn from the component, the stories and Figma, not from the docs.
2. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A14): The divider above the panel is drawn when the item is closed, doubling the bottom line of a closed separated item. Is that intended?
3. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A1): Should headers sit inside heading elements, as the WAI-ARIA accordion pattern the docs link recommends?
4. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A15): With `size` left out, items are `lg` but the gap is 12px; the docs say the default size is `lg`, which matches. Should `Accordion` pass `lg` explicitly so the recipe and the items agree?
5. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) B1): Figma's nested accordion shows the inner items separated; the Nested story stacks them. Which is right?
6. Upstream, for the Magenta team: End does nothing when the last item is disabled; the contract lists a `component` prop on `AccordionControl` and `AccordionItem` (from `OverridableComponentProps`), but both always render a `button` and a `div`; `AccordionItem` checks only that it has two children, not which; the recipe uses raw transition durations (`200ms`).

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-11-09 from contracts/Accordion.json, contracts/AccordionItem.json, contracts/AccordionControl.json, contracts/AccordionPanel.json (scripts/build-contracts.mjs). Styles read from the accordion and accordionItem recipes. Replaced by build/meta in phase 3. -->

### Props

`Accordion` (also accepts the attributes of `<div>`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | required | The content to be displayed inside the accordion. |
| `arrowPosition` | `'left' \| 'right'` | `right` | Position of the arrow icon in the accordion control. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'responsive'` | | Size of the accordion. |
| `stacked` | `boolean` | | If true, the accordion items will be stacked. |
| `multiple` | `boolean` | | If true, multiple accordion items can be open at the same time. |
| `defaultOpenId` | `string \| string[]` | | The default ID of the open accordion item(s). |
| `openId` | `string \| string[]` | | The controlled ID of the open accordion item(s). |
| `onChange` | `(id: string \| string[] \| undefined) => void` | | Callback function to be called when the open accordion item(s) change. |
| `id` | `string` | | Unique identifier for the accordion. |
| `transitionDuration` | `number` | `200` | Duration of the transition animation in milliseconds. |

`AccordionItem` (also accepts the attributes of `<div>`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | required | Unique identifier for the accordion item. |
| `children` | `React.ReactNode` | required | The content to be displayed inside the accordion item. |
| `disabled` | `boolean` | | If true, the accordion item will be disabled. |

`AccordionControl` (also accepts the attributes of `<button>`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | required | The content to be displayed inside the accordion control. |
| `arrowIcon` | `React.ReactNode` | `<ChevronDownOutline />` | Custom icon to be displayed as the arrow indicator. |
| `disabled` | `boolean` | | If true, the accordion control will be disabled. |

`AccordionPanel` (also accepts the attributes of `<div>`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | required | The content to be displayed inside the accordion panel. |
| `onTransitionEnd` | `() => void` | | Callback function to be called when the transition ends. |

### Styles

From the `accordion` and `accordionItem` recipes.

| Slot | Styles |
|---|---|
| `accordion` `base` | flex column, gap `spacing.12`; `size`: `sm` `spacing.4`, `md` `spacing.8`, `lg` `spacing.12`, `responsive` 4 → 8 from `xl` → 12 from `3xl` |
| `accordion` `base` · `stacked` | gap 0; items lose radius and border, with a 1px bottom border on all but the last |
| `accordionItem` `base` | full width, `colors.white`, radius `radii.md`, 1px border `colors.neutral.200`, text `colors.neutral.900`; focus-visible header: outline `borders.1` `colors.primary.300` |
| `accordionItem` `base` · `size` | `sm`: `fontSizes.xs`, `lineHeights.md`; `md`: `fontSizes.sm`, `lineHeights.lg`; `lg`: `fontSizes.md`, `lineHeights.2xl`; `responsive`: sm → md from `xl` → lg from `3xl` |
| `control` | flex, space-between, `fontWeights.semi-bold`; hover `colors.neutral.100`; `arrowPosition: left`: row reversed |
| `control` · `size` | padding and gap `spacing.8` (`sm`), `spacing.10` (`md`), `spacing.12` (`lg`) |
| `panelContent` · `size` | `sm`: x `spacing.10`, top `spacing.10`, bottom `spacing.12`; `md`: 12 / 12 / 16; `lg`: 16 / 16 / 24 |
| `triggerArrow` | rotated 270° closed, 360° open, 200ms; icon 16px (`sm`), 20px (`md`, `lg`) |
| `disabled` | item `colors.neutral.100` and `colors.neutral.500`; arrow `colors.neutral.300` |

Stories: `packages/docs/stories/Components/Accordion/Accordion.stories.tsx`, `packages/docs/stories/Components/Accordion/Examples`.
<!-- GENERATED:END -->
