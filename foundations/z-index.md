---
type: foundation
foundation: z-index
token_group: zIndex
status: stable
figma_url: ""
sources:
  - packages/docs/stories/Foundation/ZIndex/Design.mdx
  - packages/docs/stories/Foundation/ZIndex/Develop.mdx
  - packages/docs/stories/Foundation/ZIndex/Shadow.stories.mdx
  - packages/docs/assets/images/ZIndex
  - packages/css/src/tokens.ts
  - packages/css/src/recipes
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Z-index

## Overview

The z-index determines the stacking order of elements, dictating which elements appear in front of or behind others when they overlap. Elements with higher z-index values are displayed on top of those with lower values.

Magenta has twelve z-index tokens. Nine are page layers, from `zIndex.menu` up to `zIndex.tooltip`, one for each kind of component; `zIndex.below`, `zIndex.base` and `zIndex.above` are for stacking inside a component. Each layer also has a shadow, set by its elevation level in [Elevation](elevation.md). Magenta has no semantic z-index tokens, so, as for color ([ADR 001](../adr/001-color-roles-on-palette-tokens.md)), each role points to these tokens. Where the docs and the components differ, the roles follow the components (team decision, 2026-10-28).

How to write them: `zIndex: 'dialog'` in Panda style objects, `var(--mag-z-index-dialog)` in CSS.

## Principles

**Higher value, in front.** An element with a higher z-index is displayed on top of elements with lower values.

**Same look, different stacking.** Different components can share the same elevation style, such as shadows or visual depth cues, to keep a consistent look and feel. Each kind of component still has its own z-index, which sets its stacking order.

## Rules

- MUST use the z-index token for the kind of layer (`zIndex.menu`, `zIndex.dialog`, `zIndex.tooltip`…). MUST NOT write raw z-index numbers for page layers.
- A custom element MUST use the token of its kind: a custom dropdown uses `zIndex.menu`. For a new kind of layer, ask; each kind gets its own z-index.
- Inside a component, local stacking MUST use `zIndex.below`, `zIndex.base` and `zIndex.above`.
- MUST NOT use `zIndex.navigation-overlay`. It has no role.
- Sticky table header cells over pinned body cells: `zIndex.sticky` (2) is proposed to Magenta ([ADR 004](../adr/004-sticky-z-index-token.md)) and does not exist yet. Until it ships, write `zIndex: 2` with a `token-audit-ignore` comment naming ADR 004. MUST NOT write `zIndex: 'sticky'` or `var(--mag-z-index-sticky)` before then.
- Where a Magenta component sets the z-index, keep what the component applies.

## Primitive tokens

<!-- What the tokens are. Values are in the GENERATED block. -->

| Token | Description |
|---|---|
| `zIndex.below`, `zIndex.base`, `zIndex.above` | Stacking inside a component: behind, level with, or in front of the element's siblings. |
| `zIndex.menu` to `zIndex.tooltip` | Page layers, one for each kind of component. Order and roles in Semantic roles. |
| `zIndex.navigation-overlay` | In code, but not in the docs, and nothing uses it. No role. |

## Semantic roles

<!-- Roles come from the Z-index table in the Storybook docs and follow the components where they differ. -->

### Stacking order

Lowest to highest. The role also names the shadow the layer uses, from [Elevation](elevation.md#semantic-roles).

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Overflow and dropdown menus (shadow `shadows.lg`) | `zIndex.menu` |  |  |  |
| Navigation bar, sticky banner (shadow `shadows.lg`; sticky banner none) | `zIndex.navigation` |  |  |  |
| Floating button (shadow `shadows.xl`) | `zIndex.floating-button` |  |  |  |
| Drawer (shadow `shadows.xl`) | `zIndex.drawer` |  |  |  |
| Dialog (shadow `shadows.xl`) | `zIndex.dialog` |  |  |  |
| Feedback messages: Alert, Banner, Toast (shadow `shadows.xl`) | `zIndex.feedback` |  |  |  |
| Popover (shadow `shadows.lg`) | `zIndex.popover` |  |  |  |
| Tooltip (shadow `shadows.2xl`) | `zIndex.tooltip` |  |  |  |
| Stacking inside a component | `zIndex.below`, `zIndex.base`, `zIndex.above` |  |  |  |

`Select` gives its dropdown a raw z-index of `10` instead of `zIndex.menu`. The team keeps this as the code has it.

### Differences from the docs

| Docs | Components |
|---|---|
| Feedback messages, including Banner, sit at `zIndex.feedback` | A sticky `Banner` sits at `zIndex.navigation`, with no shadow |

## Accessibility

- **Focus not obscured (WCAG 2.4.11, AA).** A sticky layer such as the navigation bar or a sticky banner must not completely hide the element that has keyboard focus. Scroll the focused element into view below the sticky layer.
- **Content on hover or focus (WCAG 1.4.13, AA).** Tooltips and popovers sit above everything else. They must be dismissible without moving focus (for example with Escape), stay visible while the pointer is over them, and stay until dismissed or no longer relevant.

## Do and don't

| Don't | Do |
|---|---|
| `zIndex: 9999` | `zIndex: 'tooltip'`, or the token for the kind of layer |
| A custom dropdown at `zIndex: 10` | `zIndex: 'menu'` |
| `zIndex: 2` to lift one item of a group above its neighbours | `zIndex: 'above'` |

## Open questions

**1. Upstream cleanup.** To report to the Magenta team:
- The Z-index table has no row for `zIndex.navigation-overlay`.
- The token audit ([report](../reports/archive/token-audit-2026-11-04.md)) finds raw z-index values in components: `9999` in the text editor's link menu, `10` in the `Select` and `Autocomplete` dropdowns, `11` in `Tooltip`, and `2` and `3` in button groups and compact wrappers.

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-10-29 by a one-off script from packages/css/src/tokens.ts and packages/css/src/recipes. Replaced by scripts/ in phase 3. -->

### Z-index

In Panda style objects: `zIndex: 'dialog'`. In CSS: `var(--mag-z-index-dialog)`. "In the docs table" compares with the Z-index table in the Storybook docs.

| Token | Value | In the docs table | CSS variable |
|---|---|---|---|
| `zIndex.below` | -1 | no | `--mag-z-index-below` |
| `zIndex.base` | 0 | no | `--mag-z-index-base` |
| `zIndex.above` | 1 | no | `--mag-z-index-above` |
| `zIndex.menu` | 500 | yes | `--mag-z-index-menu` |
| `zIndex.navigation` | 800 | yes | `--mag-z-index-navigation` |
| `zIndex.navigation-overlay` | 900 | no | `--mag-z-index-navigation-overlay` |
| `zIndex.floating-button` | 1100 | yes | `--mag-z-index-floating-button` |
| `zIndex.drawer` | 1300 | yes | `--mag-z-index-drawer` |
| `zIndex.dialog` | 1500 | yes | `--mag-z-index-dialog` |
| `zIndex.feedback` | 1600 | yes | `--mag-z-index-feedback` |
| `zIndex.popover` | 1800 | yes | `--mag-z-index-popover` |
| `zIndex.tooltip` | 2000 | yes | `--mag-z-index-tooltip` |

### Observed use in recipes

Which recipes use each token. This shows current practice, not an approved rule.

| Z-index | Recipes |
|---|---|
| `zIndex.above` | `Segmented/Item`, `Table/tableCell`, `Tabs/tabList` |
| `zIndex.below` | `Carousel/carouselControl`, `Segmented/Item` |
| `zIndex.dialog` | `Dialog/dialog` |
| `zIndex.drawer` | `Drawer/drawerWrapper` |
| `zIndex.feedback` | `FeedbackMessages/index` |
| `zIndex.floating-button` | `button` |
| `zIndex.menu` | `Menu/menu` |
| `zIndex.navigation` | `FeedbackMessages/banner` |
| `zIndex.popover` | `popover` |
| `zIndex.tooltip` | `tooltip` |
| raw `-1` | `InlineEdit/InlineView` |
| raw `0` | `buttonGroup`, `compactWrapper`, `radio` |
| raw `1` | `DatePicker/dateRangeInput`, `TreeView/treeViewItem`, `buttonGroup`, `compactWrapper`, `numberInput` |
| raw `2` | `buttonGroup`, `compactWrapper` |
| raw `3` | `compactWrapper`, `numberInput` |
| raw `10` | `Select/select` |
| raw `11` | `tooltip` |

<!-- GENERATED:END -->
