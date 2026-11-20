---
type: foundation
foundation: spacing
token_group: spacing
status: stable
figma_url: ""
sources:
  - packages/docs/stories/Foundation/Spacing/Design.mdx
  - packages/docs/stories/Foundation/Spacing/Develop.mdx
  - packages/docs/stories/Foundation/Spacing/Spacing.stories.mdx
  - packages/docs/stories/Foundation/Spacing/Spacing.ts
  - packages/docs/assets/images/Spacing
  - packages/css/src/tokens.ts
  - packages/css/src/recipes/checkbox.ts
  - packages/css/src/recipes/radio.ts
  - packages/css/src/recipes/formCheck.ts
  - packages/css/src/recipes/Tag
  - packages/css/src/recipes/iconButton.ts
  - packages/css/src/recipes/InputAtoms
  - packages/css/src/recipes/button.ts
  - packages/css/src/recipes/input.ts
  - packages/react/src/components/Menu/hooks
  - packages/react/src/components/Popover/hooks
  - packages/react/src/components/Tooltip/hooks
  - packages/react/src/components/Select/hooks
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Spacing

## Overview

Spacing refers to the negative space or distance between design elements within a design system. It provides visual separation, establishes hierarchy, and elevates the user experience.

Magenta has one spacing scale on a base unit of 4px, with half steps of 2px. Each token is named by its pixel value, from `spacing.0` to `spacing.80`. Use it for padding, margin and gap: `p: '12'` or `gap: '8'` in Panda style objects, `var(--mag-spacing-12)` in CSS. Magenta has no semantic spacing tokens, so, as for color ([ADR 001](../adr/001-color-roles-on-palette-tokens.md)), each role in Semantic roles points to scale tokens.

## Principles

**Consistency.** Unified spacing ensures a cohesive visual experience, aiding navigation and comprehension.

**Hierarchy.** Varying spacing establishes visual importance, guiding users through a clear and organized interface. Elements with higher importance get more generous spacing around them, so they stand out; elements of lower importance can have tighter spacing, which shows they are subordinate.

**Clarity.** Well-controlled spacing enhances legibility, prevents overcrowding, and promotes focus.

**Space builds connections.** Items placed close together are seen as related. As more space is added between elements, they are seen as less connected. Consistent internal padding and spacing around elements creates visual similarity, which helps users understand how they relate.

**Empty space.** Empty space separates sections on a page, creates focus on specific elements, and gives breathing room that prevents overload. Where a section is dense with content, balance it with white space elsewhere on the page.

## Rules

- MUST use spacing tokens for padding, margin and gap. MUST NOT use raw px or rem values.
- MUST NOT use the names in the docs' scale table (`--mag-spacings-4`…). The CSS variables are `--mag-spacing-<n>`, without the final "s".
- MUST choose a value from the range given for the role in [Semantic roles](#semantic-roles). Where a Magenta component sets the spacing, keep what the component applies.
- `spacing.1` and `spacing.18` are not in the documented scale but the components use them (team decision, 2026-11-10: follow the code); their roles are below. Do not use them for other spacing.
- Related elements MUST be closer together than unrelated ones. A button that acts on a block of text sits close to that text.
- Items in the same group MUST use the same spacing between them.
- The space between separate items MUST be larger than the space inside each item, so it is clear which icon or control belongs to which label.

## Primitive tokens

<!-- What the scale is. Values are in the GENERATED block. -->

| Token | Description |
|---|---|
| `spacing.*` | The spacing scale, from `spacing.0` to `spacing.80`, defined using multiples of 2 and 4. Each value has its own token named by its pixel value. `spacing.0` to `spacing.6` are in px; `spacing.8` and up are in rem. |
| `spacing.1`, `spacing.18` | In code, but not in the documented scale. Used only where the components use them (see Semantic roles). |
| `sizes.*` | The width and height scale. Same names and values as spacing, plus `sizes.36`, but with no 18. For dimensions, not for space between elements. |

## Semantic roles

<!-- Roles and ranges come from the Usage column of the Spacing scale table in the Storybook docs. Where a Magenta component implements the role, the Token cell gives what the component uses, by component size sm / md / lg. -->

### Small and medium elements: `spacing.0` to `spacing.10`

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Space between an icon and its text (checkbox, radio button) | `spacing.4`, `spacing.6`, `spacing.8` (`Checkbox`, `Radio` at `sm`, `md`, `lg`) |  |  |  |
| Gap between repeating small elements (tag group) | `spacing.0` – `spacing.10` |  |  |  |
| Vertical space between elements in a component (label and field) | `spacing.4` (label, field and helper text in form fields) |  |  |  |
| Vertical space between elements in a card (title and description, description and actions) | `spacing.0` – `spacing.10` |  |  |  |
| Gap between a trigger and its floating element (dropdown button and menu) | `spacing.4` (`Menu`, `Popover`, `Tooltip`, `Select`, `Autocomplete`; plus 8px when the arrow shows) |  |  |  |
| 1px lines drawn as width in components (tab separators, date picker and time picker borders) | `spacing.1` (as the components use it; for new borders use `borders.1`) |  |  |  |
| Branch line offset in a tree view (`TreeView` `md` and `lg`) | `spacing.18` |  |  |  |

### Larger components: `spacing.12` to `spacing.24`

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Vertical space between elements in cards | `spacing.12` – `spacing.24` |  |  |  |
| Space between elements in a form | `spacing.12` – `spacing.24` |  |  |  |

### Page: `spacing.32` to `spacing.80`

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Space between content on the page (top of page and header), page margins and the gap between sections | `spacing.32` – `spacing.80` |  |  |  |

### Component padding

Padding follows the components (team decision, 2026-10-28), even where the docs' ranges differ. Use these values for custom elements that sit next to the components. Sizes are the component's `size`.

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Horizontal padding of tags | `spacing.4`, `spacing.6`, `spacing.8` (`sm`, `md`, `lg`) |  |  |  |
| Padding of icon buttons | `spacing.8` (`sm`, `md`), `spacing.10` (`lg`), `spacing.12` (`xl`) |  |  |  |
| Horizontal padding of buttons | `spacing.8`, `spacing.12`, `spacing.16` (`sm`, `md`, `lg`) |  |  |  |
| Vertical padding of buttons | `spacing.8`; `spacing.12` at `xl` |  |  |  |
| Horizontal padding of input fields | `spacing.6`, `spacing.8`, `spacing.12` (`sm`, `md`, `lg`) |  |  |  |
| Vertical padding of input fields | `spacing.8` |  |  |  |

## Accessibility

- **Text resize.** `spacing.8` and up are in rem, so they grow with the user's browser font setting. `spacing.0` to `spacing.6` are in px and stay fixed.
- **Target size (WCAG 2.5.8, AA).** An interactive target must be at least 24 × 24 CSS px, or have enough space around it that a 24px circle centred on it does not overlap another target. Small icon buttons, tags and options in dense rows need that space.
- **Grouping.** Proximity shows which label, icon and control belong together. Follow the rules above so a label is never closer to the wrong control.

## Do and don't

| Don't | Do |
|---|---|
| A large gap between a block of text and the button that acts on it | Keep the button close to the text it belongs to |
| Different spacing between fields in the same group | The same spacing between all fields in a group |
| Options packed so tightly that the gap between options is no larger than the gap between an icon and its label | More space between options than inside each option |
| The same tight spacing around a label, a title and a subtitle | More space around the title, the most important element |
| Dense cards with little padding and no space between them | Inner padding and a clear gap between cards |
| `padding: '12px'` | `p: '12'` or `var(--mag-spacing-12)` |
| `var(--mag-spacings-12)` | `var(--mag-spacing-12)` |

## Open questions

**1. Upstream doc cleanup.** To report to the Magenta team:
- The Usage column puts the padding of buttons and input fields at 12 to 24px, and of small components at 0 to 10px. The components use 6 to 16px horizontally and 8px vertically for buttons and inputs, and up to 12px for icon buttons. The team follows the components, so the docs should change.
- The scale table names the tokens `--mag-spacings-4` and up, but the CSS variables are `--mag-spacing-4`. The same "spacings" appears in the Figma variable names used by the templates.
- The layout templates in `react-templates` use raw values (header padding `16px 24px`) and Figma variable names such as `--Spacings-gaps-mag-spacings-12` instead of spacing tokens.
- The live page subtitle reads "Spacing negative space…", missing "refers to", with a double period.

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-10-28 by one-off scripts from packages/css/src/tokens.ts and packages/css/src/recipes. Replaced by scripts/ in phase 3. -->

### Scale

In Panda style objects: `p: '12'`, `gap: '8'`. In CSS: `var(--mag-spacing-12)`. "In the docs scale" compares with the Spacing scale table in the Storybook docs.

| Token | Value | px | Base unit (4px) | In the docs scale | CSS variable |
|---|---|---|---|---|---|
| `spacing.0` | 0px | 0 | 0x | yes | `--mag-spacing-0` |
| `spacing.1` | 1px | 1 | 0.25x | no | `--mag-spacing-1` |
| `spacing.2` | 2px | 2 | 0.5x | yes | `--mag-spacing-2` |
| `spacing.4` | 4px | 4 | 1x | yes | `--mag-spacing-4` |
| `spacing.6` | 6px | 6 | 1.5x | yes | `--mag-spacing-6` |
| `spacing.8` | 0.5rem | 8 | 2x | yes | `--mag-spacing-8` |
| `spacing.10` | 0.625rem | 10 | 2.5x | yes | `--mag-spacing-10` |
| `spacing.12` | 0.75rem | 12 | 3x | yes | `--mag-spacing-12` |
| `spacing.16` | 1rem | 16 | 4x | yes | `--mag-spacing-16` |
| `spacing.18` | 1.125rem | 18 | 4.5x | no | `--mag-spacing-18` |
| `spacing.20` | 1.25rem | 20 | 5x | yes | `--mag-spacing-20` |
| `spacing.24` | 1.5rem | 24 | 6x | yes | `--mag-spacing-24` |
| `spacing.32` | 2rem | 32 | 8x | yes | `--mag-spacing-32` |
| `spacing.40` | 2.5rem | 40 | 10x | yes | `--mag-spacing-40` |
| `spacing.48` | 3rem | 48 | 12x | yes | `--mag-spacing-48` |
| `spacing.64` | 4rem | 64 | 16x | yes | `--mag-spacing-64` |
| `spacing.80` | 5rem | 80 | 20x | yes | `--mag-spacing-80` |

`sizes` compared with `spacing`: only in sizes: 36; only in spacing: 18; all shared names have the same value.

### Observed use in recipes

Occurrences in component recipes, by property. This shows current practice, not an approved rule.

| Token | Padding | Margin | Gap |
|---|---|---|---|
| `spacing.0` | 40 | 27 | 4 |
| `spacing.1` |  |  |  |
| `spacing.2` | 27 | 12 | 17 |
| `spacing.4` | 46 | 4 | 79 |
| `spacing.6` | 55 | 4 | 61 |
| `spacing.8` | 163 | 5 | 86 |
| `spacing.10` | 15 | 2 | 2 |
| `spacing.12` | 67 |  | 29 |
| `spacing.16` | 31 | 1 | 13 |
| `spacing.18` |  |  |  |
| `spacing.20` | 6 |  |  |
| `spacing.24` | 10 |  |  |
| `spacing.32` | 1 |  |  |
| `spacing.40` |  |  |  |
| `spacing.48` | 2 | 1 |  |
| `spacing.64` |  |  |  |
| `spacing.80` |  |  |  |

Raw values instead of tokens (occurrences):

- `-12px` in TextEditor/linkForm.ts (1)
- `-1px` in buttonGroup.ts (1)
- `-1px` in compactWrapper.ts (1)
- `-1px` in numberInput.ts (2)
- `-4px` in Avatar/avatarGroup.ts (2)
- `-6px` in Avatar/avatarGroup.ts (2)
- `-8px` in Avatar/avatarGroup.ts (2)
- `4px` in Timeline/timeline.ts (1)
- `4px` in toggle.ts (2)
- `6px` in toggle.ts (2)
- `8px` in toggle.ts (2)

<!-- GENERATED:END -->
