---
type: foundation
foundation: elevation
token_group: shadows
status: stable
figma_url: ""
sources:
  - packages/docs/stories/Foundation/Shadow/Design.mdx
  - packages/docs/stories/Foundation/Shadow/Develop.mdx
  - packages/docs/stories/Foundation/Shadow/Shadow.stories.mdx
  - packages/docs/assets/images/Shadows
  - packages/css/src/tokens.ts
  - packages/css/src/recipes
  - packages/react/src/components/Menu/DropdownComponents
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Elevation

## Overview

Elevation refers to the relative depth or distance between two surfaces along the z-axis, while shadow is the darkened area that appears on a surface as a result of an object blocking light. When used together, elevation and shadow create a sense of depth and hierarchy in a user interface.

Magenta has three elevation levels (Low, Medium, High) and seven shadow tokens (`shadows.none` to `shadows.2xl`, plus `shadows.inner`). The stacking order of layers is in [Z-index](z-index.md). Magenta has no semantic elevation tokens, so, as for color ([ADR 001](../adr/001-color-roles-on-palette-tokens.md)), each role points to these tokens. Where the docs and the components differ, the roles follow the components (team decision, 2026-10-28; for child menus, 2026-11-10).

How to write them: `boxShadow: 'lg'` in Panda style objects, `var(--mag-shadows-lg)` in CSS.

## Principles

**Higher means deeper.** The elevation of an element indicates the distance between surfaces and the depth of its shadow. A higher elevation casts a deeper shadow, which creates a sense of depth and hierarchy. A lower elevation gives a shallower shadow and a flatter appearance.

**Elevation shows importance.** Each level represents the relative importance or prominence of the UI element. The levels differ by the spread of their drop shadow.

**Shadows sparingly.** Excessive shadows quickly create a busy interface and pull the user's attention to the wrong place.

## Rules

- MUST use the shadow of the element's elevation level from [Semantic roles](#semantic-roles). MUST NOT write raw shadow values.
- An element that sits over other UI (toast, dialog, menu) MUST have a higher shadow than the surface beneath it.
- MUST NOT use `shadows.inner`. It has no role.
- Controls that belong together MUST share one shadow on their container, not one shadow each.
- Where a Magenta component sets the shadow, keep what the component applies.

## Primitive tokens

<!-- What the scales are. Values are in the GENERATED block. -->

| Token | Description |
|---|---|
| `shadows.none` | No shadow. Low level. |
| `shadows.sm` | Low level. |
| `shadows.md` | Medium level, lower step. |
| `shadows.lg` | Medium level, higher step. |
| `shadows.xl` | High level, lower step. |
| `shadows.2xl` | High level, higher step. |
| `shadows.inner` | Inner shadow. The docs describe it for content that has scrolled outside a view, but no component uses it. No role. |

Each drop shadow has two layers, a "cast" shadow and a "core" shadow, in `colors.neutral.900` at 10% and 15% opacity.

## Semantic roles

<!-- Roles come from the Shadow values and usage table in the Storybook docs, and follow the components where they differ. -->

The z-index of each layer is in [Z-index](z-index.md#stacking-order).

### Shadow

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Low level. Flat UI surface | `shadows.none` |  |  |  |
| Low level. Clickable cards, a flat card raised, the default form container | `shadows.sm` |  |  |  |
| Medium level. Card raised (pickup, hover, move), form container, selected segmented item | `shadows.md` |  |  |  |
| Medium level. Dropdown menus and their child menus, selection menus, pickers, popovers, major forms (login, booking), drag cards, navigation bar | `shadows.lg` |  |  |  |
| High level. Modals and dialogs, drawers, alerts, banners, toasts, floating action button at rest | `shadows.xl` |  |  |  |
| High level. Tooltips, floating action button raised (hover) | `shadows.2xl` |  |  |  |

### Differences from the docs

The components differ from the docs in these places. The roles above follow the components.

| Docs | Components |
|---|---|
| A child menu has a higher elevation than its parent | `Menu` gives every level `shadows.lg`. The team follows the component (2026-11-10); the docs should change. |
| Popover uses `shadows.2xl` | `Popover` shares one recipe with dropdown menus and uses `shadows.lg` |

## Accessibility

- **Shadow is not a boundary.** The shadows are faint (10% and 15% opacity), so a shadow alone does not give the 3:1 contrast needed to show where a control is (WCAG 1.4.11). Where the edge of a control matters, use a border as well.

## Do and don't

| Don't | Do |
|---|---|
| A dropdown menu with a low shadow such as `shadows.sm` | `shadows.lg`, the level of menus |
| A toast with the same low shadow as the card beneath it | A higher shadow on the toast (`shadows.xl`) than on the card |
| A shadow on each control of a date navigator | One shadow on the container that holds the controls |
| `boxShadow: '0 2px 8px rgba(0,0,0,0.1)'` | `boxShadow: 'lg'` |

## Open questions

**1. Upstream cleanup.** To report to the Magenta team:
- The docs say a child menu sits higher than its parent; `Menu` gives every level `shadows.lg` and the team follows the component (2026-11-10), so the docs should change.
- The docs give popovers `shadows.2xl`; the component uses `shadows.lg`, and the team follows the component, so the docs should change.
- Typos: "contanier" in the shadow table, and "default Ui" on the live page.

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-10-29 by a one-off script from packages/css/src/tokens.ts and packages/css/src/recipes. Replaced by scripts/ in phase 3. -->

### Shadows

In Panda style objects: `boxShadow: 'lg'`. In CSS: `var(--mag-shadows-lg)`.

| Token | Value | CSS variable |
|---|---|---|
| `shadows.none` | `none` | `--mag-shadows-none` |
| `shadows.sm` | `0px 1px 2px 0px rgba(51, 51, 51, 0.1), 0px 1px 2px 1px rgba(51, 51, 51, 0.15)` | `--mag-shadows-sm` |
| `shadows.md` | `0px 2px 6px 0px rgba(51, 51, 51, 0.1), 0px 2px 4px 2px rgba(51, 51, 51, 0.15)` | `--mag-shadows-md` |
| `shadows.lg` | `0px 2px 8px 0px rgba(51, 51, 51, 0.1), 0px 4px 8px 3px rgba(51, 51, 51, 0.15)` | `--mag-shadows-lg` |
| `shadows.xl` | `0px 0px 10px 0px rgba(51, 51, 51, 0.1), 0px 8px 10px 4px rgba(51, 51, 51, 0.15)` | `--mag-shadows-xl` |
| `shadows.2xl` | `0px 0px 12px 0px rgba(51, 51, 51, 0.1), 0px 10px 16px 6px rgba(51, 51, 51, 0.15)` | `--mag-shadows-2xl` |
| `shadows.inner` | `inset 0px 0px 6px 0px rgba(44, 45, 46, 0.10), inset 0px 0px 2px 1px rgba(51, 51, 51, 0.15)` | `--mag-shadows-inner` |

### Observed use in recipes

Which recipes use each token. This shows current practice, not an approved rule. `Menu` dropdowns use the `popover` recipe.

| Shadow | Recipes |
|---|---|
| `shadows.none` | `FeedbackMessages/banner`, `Select/select`, `toggle` |
| `shadows.sm` | `Tabs/tabs` |
| `shadows.md` | `Segmented/Item` |
| `shadows.lg` | `Calendar/calendarWrapper`, `Select/select`, `popover` |
| `shadows.xl` | `Dialog/dialog`, `Drawer/drawer`, `FeedbackMessages/alert`, `FeedbackMessages/banner`, `FeedbackMessages/toast`, `button` |
| `shadows.2xl` | `button`, `tooltip` |
| `shadows.inner` | — |

<!-- GENERATED:END -->
