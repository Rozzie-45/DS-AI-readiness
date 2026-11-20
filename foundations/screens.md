---
type: foundation
foundation: layout
token_group: breakpoints
status: stable
figma_url: ""
sources:
  - packages/docs/stories/Foundation/Screens/Screens.stories.mdx
  - packages/docs/stories/Foundation/Screens/Screens.ts
  - packages/docs/stories/Foundation/Screens/ViewPorts
  - packages/docs/stories/Foundation/Typography/Typography.mdx
  - packages/docs/stories/Shared/components/ResponsiveSizeTable
  - packages/css/src/breakpoints.ts
  - packages/css/src/recipes
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Screens

## Overview

Text and components adjust responsively to the viewport size. The live Storybook calls the breakpoints page "Responsive - Auto resize component".

Magenta has seven breakpoints, `breakpoints.xs` to `breakpoints.3xl`, used mobile first: each one applies from its min-width up. Components and text have three sizes, `sm`, `md` and `lg`. With `size="responsive"` they switch size at two breakpoints: `sm` under 1280px, `md` from 1280px (`breakpoints.xl`) and `lg` from 1920px (`breakpoints.3xl`).

Most components do not do this by default. Their default size is `lg` at every viewport; only `size="responsive"` makes them follow the breakpoints. `Text` is the exception: without `size`, it is responsive. The team's decision (2026-10-28): product code passes `size="responsive"` to every component that supports it.

How to write them: breakpoint conditions in Panda style objects, `{ fontSize: 'sm', xl: { fontSize: 'md' } }`. In CSS, a min-width media query with the breakpoint value.

## Principles

**Desktop first for verification.** Verify UI first at 1280 to 1535px, the Small Desktop range: navigation layouts remain usable, critical actions remain accessible, and components display properly.

**Viewports follow OS scaling.** The desktop ranges match common screens at different system scaling: 1920px and up is 1080p or 1440p at 100 to 125%, 1536 to 1919px is 1080p at 125%, and 1280 to 1535px is 1080p at 150%.

**Below 1280px is touch first.** Viewport ranges below 1280px represent touch-first environments where browser UI chrome, virtual keyboards, and OS safe areas reduce usable space. Layout changes there reflect shifts in interaction (stacking content, simplified navigation, reduced density), not specific devices.

## Rules

- MUST use the Panda breakpoint conditions (`xs` to `3xl`) for responsive styles. MUST NOT write media queries with raw px values.
- MUST NOT use the `--screen-*` CSS variables. They exist only in the Storybook docs, not in the package.
- MUST pass `size="responsive"` to every component that supports it. Without it, most components stay at `lg`. Use a fixed size only where the design asks for one.
- MUST verify UI first at 1280 to 1535px.
## Primitive tokens

<!-- What the breakpoints are. Values are in the GENERATED block. -->

| Token | Description |
|---|---|
| `breakpoints.xs` | Extra small. |
| `breakpoints.sm` | Small. |
| `breakpoints.md` | Medium. |
| `breakpoints.lg` | Large. |
| `breakpoints.xl` | Extra large. Components switch from `sm` to `md` here. |
| `breakpoints.2xl` | 2x large. |
| `breakpoints.3xl` | 3x large. Components switch from `md` to `lg` here. |

## Semantic roles

<!-- Roles come from the Breakpoints and Viewports pages in the Storybook docs. -->

### Responsive size

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Component and text size `sm`: viewports under 1280px | base to `breakpoints.lg` |  |  |  |
| Component and text size `md`: 1280 to 1919px | `breakpoints.xl`, `breakpoints.2xl` |  |  |  |
| Component and text size `lg`: 1920px and up | `breakpoints.3xl` |  |  |  |

### Viewports

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Large Desktop, 1920px and up. Internal and External lists. | `breakpoints.3xl` |  |  |  |
| Standard Desktop, 1536 to 1919px. Internal and External lists. | `breakpoints.2xl` |  |  |  |
| Small Desktop, 1280 to 1535px. Internal and External lists. The first viewport to verify. | `breakpoints.xl` |  |  |  |
| Tablet and mobile, under 1280px. External list only. | base to `breakpoints.lg` |  |  |  |

## Accessibility

- **Reflow (WCAG 1.4.10, AA).** At 400% zoom, a 1280px window is 320 CSS px wide. Content must reflow without horizontal scrolling at that width, except parts that need a two-dimensional layout, such as data tables. This applies to products that only target desktop viewports too.
- **Resize text (WCAG 1.4.4, AA).** Text must stay readable and usable at 200% zoom. Font sizes and most spacing are in rem, so they scale.
- **Touch targets.** Below 1280px the docs expect touch input; follow the target size in [Spacing](spacing.md#accessibility).

## Do and don't

| Don't | Do |
|---|---|
| `@media (min-width: 1280px) { … }` | `{ xl: { … } }` in a Panda style object |
| `var(--screen-xl)` | The `xl` breakpoint condition |
| `<Button>` and expecting it to shrink on small screens | `<Button size="responsive">` |
| Checking a new screen only at 1920px | Checking it first at 1280 to 1535px |

## Open questions

**1. Upstream doc cleanup.** To report to the Magenta team:
- The Breakpoints page puts `xs` at 0 to 639px, but `breakpoints.xs` starts at 480px. The Viewports page has it right (0 to 479 and 480 to 639). The live page still shows 0 to 639.
- The live page heading reads "Brearkpoints".
- The Breakpoints page says components auto-resize, which is true only with `size="responsive"`.

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-10-28 by a one-off script from packages/css/src/breakpoints.ts and packages/css/src/recipes. Replaced by scripts/ in phase 3. -->

### Breakpoints

Mobile first: each condition applies from its min-width up. Below `xs` (under 480px) the base style applies. In Panda style objects: `{ fontSize: 'sm', xl: { fontSize: 'md' } }`.

| Token | Min width | Range in code | Range on the Breakpoints page | Media query |
|---|---|---|---|---|
| `breakpoints.xs` | 480px | 480–639 | 0-639 | `@media (min-width: 480px)` |
| `breakpoints.sm` | 640px | 640–767 | 640-767 | `@media (min-width: 640px)` |
| `breakpoints.md` | 768px | 768–1023 | 768-1023 | `@media (min-width: 768px)` |
| `breakpoints.lg` | 1024px | 1024–1279 | 1024-1279 | `@media (min-width: 1024px)` |
| `breakpoints.xl` | 1280px | 1280–1535 | 1280-1535 | `@media (min-width: 1280px)` |
| `breakpoints.2xl` | 1536px | 1536–1919 | 1536-1919 | `@media (min-width: 1536px)` |
| `breakpoints.3xl` | 1920px | 1920–+ | 1920+ | `@media (min-width: 1920px)` |

### Responsive size

What `size="responsive"` resolves to. `Text` without `size` behaves the same way.

| Viewport | Breakpoints | Size |
|---|---|---|
| Under 1280px | base to `breakpoints.lg` | `sm` |
| 1280px to 1919px | `breakpoints.xl`, `breakpoints.2xl` | `md` |
| 1920px and up | `breakpoints.3xl` | `lg` |

### Default size in recipes

Recipes that have a `responsive` size, by the size they use when no `size` is passed. A React component can set its own default on top.

| Default | Count | Recipes |
|---|---|---|
| `lg` | 51 | `Accordion/accordionItem`, `Autocomplete/autocomplete`, `Autocomplete/autocompleteInput`, `Calendar/calendar`, `Calendar/calendarHeader`, `Calendar/calendarWrapper`, `Calendar/date`, `Calendar/dualCalendar`, `Calendar/monthCalendar`, `Calendar/quarterlyCalendar`, `DatePicker/calendarPicker`, `DatePicker/dateTimePicker`, `FeedbackMessages/alert`, `FeedbackMessages/banner`, `FeedbackMessages/toast`, `InlineEdit/InlineView`, `InlineEdit/InlineWrapper`, `InputAtoms/inputHelperText`, `InputAtoms/inputLabel`, `List/list`, `List/listItem`, `List/listItemText`, `List/listLoadingAndEmpty`, `List/listSubheader`, `Menu/menu`, `Menu/menuFooter`, `Menu/menuHeader`, `Progress/circular`, `Progress/linear`, `Segmented/Item`, `Segmented/Wrapper`, `Select/select`, `Stepper/step`, `Stepper/stepNumberIndicator`, `Tag/tag`, `TextEditor/editor`, `TimePicker/timeCylinder`, `TimePicker/weekCylinder`, `TreeView/treeViewItem`, `breadcrumb`, `button`, `checkbox`, `formCheck`, `iconButton`, `input`, `numberInput`, `pagination`, `radio`, `spinner`, `textarea`, `toggle` |
| `md` | 2 | `Avatar/avatar`, `Avatar/avatarGroup` |
| none set | 7 | `Accordion/accordion`, `DatePicker/dateTimeInput`, `Indicator/indicator`, `Tabs/tabListGroup`, `Tabs/tabListItem`, `TextEditor/paragraph`, `tooltip` |

<!-- GENERATED:END -->
