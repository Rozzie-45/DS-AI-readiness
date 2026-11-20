---
type: foundation
foundation: border
token_group: radii, borders
status: stable
figma_url: ""
sources:
  - packages/docs/stories/Foundation/Border/Design.mdx
  - packages/docs/stories/Foundation/Border/Develop.mdx
  - packages/docs/stories/Foundation/Border/Border.stories.mdx
  - packages/docs/assets/images/Border
  - packages/css/src/tokens.ts
  - packages/css/src/recipes
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Border

## Overview

Border radius refers to the property that defines the rounded corners of a shape or container within a user interface. Border weight refers to the thickness or width of a border applied to a UI element. It defines the visual prominence and visibility of the border.

Magenta has five radius tokens (`radii.sm`, `radii.md`, `radii.lg`, `radii.xl`, `radii.full`) and two border width tokens (`borders.1`, `borders.2`). Radius grows with the size of the component. Magenta has no semantic border tokens, so, as for color ([ADR 001](../adr/001-color-roles-on-palette-tokens.md)), each role in Semantic roles points to these tokens.

How to write them:

- Radius: `borderRadius: 'md'` in Panda style objects, `var(--mag-radii-md)` in CSS.
- Width: inside a border or outline value, `border: 'token(borders.1) solid token(colors.neutral.200)'` in Panda style objects, `var(--mag-borders-1)` in CSS. In Panda, `borderWidth` reads a different token group (`borderWidths`) that Magenta does not define, so `borderWidth: '1'` does not resolve.

## Principles

**Consistent rounding.** Maintaining consistent border radius values throughout the design system is crucial for visual harmony and a cohesive user experience. Components with similar purposes or hierarchical relationships use the same border radius.

**Radius grows with size.** Small elements get minimal rounding, medium components a balanced rounding, and large containers a more pronounced rounding.

**Weight shows prominence.** The standard border is 1px. A 2px border is for elements that need emphasis or visual distinction.

## Rules

- MUST use `radii` tokens for corner radius and `borders` tokens for border and outline width. MUST NOT write raw px.
- Components with similar purposes or hierarchical relationships MUST use the same radius.
- MUST choose the radius from [Semantic roles](#semantic-roles). Where a Magenta component sets the radius or border, keep what the component applies.
- Use `radii.xl` only through `Image` (`borderRadius="xl"`), the one component that offers it (team decision, 2026-11-10: follow the code). Do not set it on other elements.
- Where controls are joined edge to edge (button groups, compact wrappers), the inner corners MUST be square (`0`).

## Primitive tokens

<!-- What the scales are. Values are in the GENERATED block. -->

| Token | Description |
|---|---|
| `radii.sm` | Small. Slight rounding. |
| `radii.md` | Medium, the default radius. |
| `radii.lg` | Large. More pronounced rounding. |
| `radii.xl` | Extra large. Used only as an option of `Image`. |
| `radii.full` | Full, a circle or pill. |
| `borders.1` | Default-light, the standard border weight. |
| `borders.2` | Bold, for emphasis or visual distinction. |

## Semantic roles

<!-- Roles come from the Border page in the Storybook docs and follow the components where they differ (team decision, 2026-10-28). -->

### Radius

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Small elements, 16px tall or less, that need minimal rounding (checkbox box) | `radii.sm` |  |  |  |
| Medium components: buttons, input fields, select fields, text areas, tags, pagination items, accordion items | `radii.md` |  |  |  |
| Large components: containers, cards, dropdown menus, popovers, tooltips, alerts, banners, toasts, dialogs, floating buttons | `radii.lg` |  |  |  |
| Circles and pills: avatars, profile pictures, radio buttons, toggles, progress bars, step numbers, carousel indicators | `radii.full` |  |  |  |
| Extra-large image corners (`Image` `borderRadius="xl"` only) | `radii.xl` |  |  |  |
| Square corners: a sticky full-width banner, and the inner corners of joined controls | `0` |  |  |  |

### Border width

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Standard border: input fields, outline buttons, dividers, containers | `borders.1` |  |  |  |
| Focus ring (buttons, tabs, calendar dates, dialog header) | `borders.2` |  |  |  |
| Emphasis or visual distinction (segmented control items) | `borders.2` |  |  |  |

### Differences from the docs

The components differ from the Border page in these places. The roles above follow the components (team decision, 2026-10-28); `radii.xl` keeps only the role `Image` gives it (2026-11-10).

| Docs | Components |
|---|---|
| `radii.xl` for modals, dialogs and full-width banners | `Dialog`, `Alert`, `Banner` and `Toast` use `radii.lg`; the sticky full-width `Banner` has square corners |

## Accessibility

- **Focus.** Focus rings use `borders.2`. Their colors are in [Color](color.md#buttons); several fail 3:1 and the team keeps them.
- **Control boundaries.** A border that shows where a control is (input fields, outline buttons) is information needed to identify the control, so its color needs 3:1 against the background (WCAG 1.4.11). See Color for the measured ratios.
- **Radius** has no accessibility requirement.

## Do and don't

| Don't | Do |
|---|---|
| `borderRadius: '6px'` | `borderRadius: 'md'` |
| A dropdown menu with `radii.md` next to a popover with `radii.lg` | The same radius (`radii.lg`) for components with the same purpose |
| `border: '1px solid #D8DDE5'` | `border: 'token(borders.1) solid token(colors.neutral.200)'` |
| `borderWidth: '1'` | `token(borders.1)` inside the border value |
| `radii.xl` on a new dialog | `radii.lg`, as `Dialog` uses |

## Open questions

**1. Upstream doc cleanup.** To report to the Magenta team:
- The Border page gives `radii.xl` to dialogs and banners; the components use `radii.lg`, and the team follows the components, so the page should change.
- Many recipes write border widths as raw px (39 times 1px, 13 times 2px) instead of `borders.1` and `borders.2`.
- The page is titled "Border radius" in Storybook but also covers border weight.

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-10-28 by a one-off script from packages/css/src/tokens.ts and packages/css/src/recipes. Replaced by scripts/ in phase 3. -->

### Radius

In Panda style objects: `borderRadius: 'md'`. In CSS: `var(--mag-radii-md)`.

| Token | Value | CSS variable |
|---|---|---|
| `radii.sm` | 2px | `--mag-radii-sm` |
| `radii.md` | 4px | `--mag-radii-md` |
| `radii.lg` | 8px | `--mag-radii-lg` |
| `radii.xl` | 12px | `--mag-radii-xl` |
| `radii.full` | 9999px | `--mag-radii-full` |

### Border width

Use inside a border or outline value: `border: 'token(borders.1) solid token(colors.neutral.200)'`. In CSS: `var(--mag-borders-1)`.

| Token | Value | CSS variable |
|---|---|---|
| `borders.1` | 1px | `--mag-borders-1` |
| `borders.2` | 2px | `--mag-borders-2` |

### Observed use in recipes

Which recipes use each radius. This shows current practice, not an approved rule.

| Radius | Recipes |
|---|---|
| `radii.sm` | `checkbox`, `image` |
| `radii.md` | `Accordion/accordionItem`, `Calendar/calendar`, `Calendar/date`, `DatePicker/dateTimePicker`, `InlineEdit/InlineWrapper`, `Select/select`, `Tabs/tabColor`, `Tag/tag`, `TextEditor/attachment`, `TextEditor/color`, `button`, `checkbox`, `image`, `input`, `numberInput`, `pagination`, `textarea` |
| `radii.lg` | `Calendar/calendarWrapper`, `Dialog/dialog`, `Dialog/dialogHeader`, `FeedbackMessages/alert`, `FeedbackMessages/banner`, `FeedbackMessages/toast`, `Segmented/Wrapper`, `Select/select`, `Tabs/tabColor`, `Tabs/tabList`, `Tabs/tabs`, `TextEditor/attachment`, `TextEditor/editor`, `button`, `image`, `popover`, `tooltip` |
| `radii.xl` | `image` |
| `radii.full` | `Avatar/avatar`, `Avatar/avatarGroup`, `Calendar/date`, `Carousel/carouselControl`, `Carousel/carouselIndicator`, `Indicator/indicator`, `Progress/linear`, `Stepper/stepNumberIndicator`, `image`, `radio`, `shortcut`, `toggle` |
| none (`0`) | `Accordion/accordion`, `Calendar/date`, `DatePicker/dateTimeInput`, `FeedbackMessages/banner`, `Lightbox/lightbox`, `Segmented/Item`, `Tabs/tabListItem`, `Tabs/tabs`, `buttonGroup`, `compactWrapper`, `numberInput` |
| other | `Tabs/tabList` |

Border and outline widths, occurrences:

| Width | As token | As raw px |
|---|---|---|
| 1px | 97 (`borders.1`) | 39 |
| 2px | 3 (`borders.2`) | 13 |
| Other | — | 1 |

<!-- GENERATED:END -->
