---
type: component
component: "Text"
description: "The Text component is a versatile component that allows you to render text with various styles and levels of emphasis. It supports forwarding refs and can be rendered as different HTML elements based on the `component` prop."
category: data-display
status: draft
figma_url: "https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=2793-30823"
alternatives:
  - Link
  - Button
related:
  - Link
  - HelperText
can_contain: []
cannot_contain: []
required_children: []
a11y_role: ""
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/react/src/components/Text/Text.tsx
  - packages/react/src/components/Text/Text.model.ts
  - packages/css/src/recipes/Text/textRecipe.ts
  - packages/css/src/recipes/Text/textStyles.ts
  - packages/css/src/recipes/Text/utils.ts
  - packages/docs/stories/Foundation/Typography/Typography.mdx
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Text

## Overview

The component that renders text in a Magenta text style: `<Text level="body2">`. `level` picks the style (`h1`–`h6`, `body`, `body1`–`body4`, `button`, and the body levels with `-semibold`), `component` picks the HTML element (a `<p>` by default), and `size` fixes the size, which otherwise follows the viewport. It sets the font only: no color and no margin. Which style to use for which role is in [Typography](../foundations/typography.md); this note covers the component.

## When to use

- Any text on a screen that is not already drawn by a component: page and section titles, body text, labels, helper and secondary text.
- Text inside a slot of another component, such as the title in a `DialogHeader` or `DrawerHeader`, or the label of a `Step`.

## When not to use

- Text that navigates. Use `Link` ([Link note](link.md)).
- Text that runs an action. Use `Button` ([Button note](button.md)); it applies the `button` style itself.
- A field's description or validation message. Use the field's `helperText`, or `HelperText` ([HelperText note](helper-text.md)).
- Text a component already styles, such as a `Tag`'s label or a `Table` cell's content: pass plain text.

## Why this design

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| A page title | `<Text level="h4" component="h1">` | `<Text level="h4">` (a `<p>`) |
| Text that navigates | `Link` | `Text` with an `onClick` |
| A field's validation message | the field's `helperText` | `Text` in red |

## Anatomy

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Text | yes | The children, in the style of `level` (`body1` by default). |

## Composition

- Style: `level` per role ([Typography](../foundations/typography.md), Semantic roles). Semi-bold body text: the `-semibold` level, such as `body2-semibold`.
- Element: `component` sets the element; `level` only sets the look. A heading MUST pass a heading element: `<Text level="h4" component="h1">` for the page title, `component="h2"` and lower for sections (Typography rules). Inline text inside a sentence: `component="span"`.
- Size: leave `size` out in product screens; the style then follows the viewport (`sm` under 1280px, `md` from 1280px, `lg` from 1920px). Pass `"sm"`, `"md"` or `"lg"` only when the design asks for a fixed size. The docs list `size="responsive"`, but the type does not accept it; leaving `size` out does the same thing.
- Color: `Text` sets none; the text takes its parent's color. Set the role's color with `className`, such as `className={css({ color: 'neutral.900' })}` for body text or `neutral.700` for helper and secondary text ([Color](../foundations/color.md), Semantic roles).
- Spacing: `Text` has no margin. Space text with the container's `gap`.

## Behavior

Measured in the prototype (screen `#/text`), with `size` left out:

| Level | 1024px | 1280px | 1920px |
|---|---|---|---|
| `h4` | 17/22 | 19/24 | 23/28 |
| `h5` | 15/20 | 17/22 | 19/24 |
| `body1` | 11/16 | 13/20 | 15/24 |
| `body2` | 10/12 | 11/16 | 13/20 |
| `body3` | 10/12 | 11/16 | 11/16 |
| `button` | 15/24 | 15/24 | 15/24 |

Font size / line height in px. `body1` with `size="md"` is 13/20 at every width. `button` switches at 768px and 1024px, not 1280px (Typography). The text color was the page's default black, rgb(0, 0, 0), because `Text` sets no color. The full table of styles and sizes is in [Typography](../foundations/typography.md), Text styles.

## Accessibility

### Keyboard

Not interactive.

### Accessible name

None of its own. Headings are headings only when `component` is a heading element; a `level="h4"` `Text` without `component` is a paragraph to assistive technology (WCAG 1.3.1).

### Focus

None.

### Contrast pairs

| Foreground token | Background token | Min ratio |
|---|---|---|
| `colors.neutral.900` (body text) | `colors.white` | 4.5 |
| `colors.neutral.700` (labels, helper text) | `colors.white` | 4.5 |

See [Typography](../foundations/typography.md), Accessibility: only `h1`, `h2` and `h3` at `lg` reach the 24px large-text size.

## Content

## Do and don't

| Don't | Do |
|---|---|
| `<Text level="h4">Shipment details</Text>` as a page title | `<Text level="h4" component="h1">Shipment details</Text>` |
| `<Text>` relying on the page's default color | `className={css({ color: 'neutral.900' })}` or the role's token |
| `size="lg"` in a product screen | `size` left out |
| `<Text level="button">` on a clickable label | `Button` |
| `css({ fontSize: 'sm', lineHeight: 'lg' })` on a `div` | `<Text level="body1">` or `css({ textStyle: 'body1' })` |
| Margins on `Text` to space paragraphs | `gap` on the container |

## Component tokens

## Figma to code mapping

Figma page "📗 Typography", frame "Typography-Document-Overview" (`2793:30823`). Figma has no `Text` component: text uses the library's text styles (91 styles, 70 bound to variables after the 2026-11-04 sync). Read on 2026-11-09.

| Figma text style | Code |
|---|---|
| `h1/text-h1-lg` … `h6/text-h6-sm` | `<Text level="h1">` … `level="h6"`, with a heading `component`; the `-sm`, `-md`, `-lg` suffix is the viewport, so leave `size` out |
| `body 1/regular/text-body1-regular-lg` | `<Text level="body1">` |
| `body 1/semibold/text-body1-semibold-lg` | `<Text level="body1-semibold">` |
| `body 2/…`, `body 3/…`, `body 4/…`, `body/…` | `level="body2"`, `"body3"`, `"body4"`, `"body"`, with `-semibold` for semibold |
| `button/text-button-lg` | `Button`, or `<Text level="button">` for button-like text that is not a button |
| `body 1/underline/…` | No code style: a `Link`, or `textDecoration: 'underline'` |
| `Display 1`–`3` | No code style (see Typography, Open questions) |

## Open questions

1. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A35): The docs list `size="responsive"`, but the `size` type is `'sm' | 'md' | 'lg'`. Should the type accept `"responsive"`?
2. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A36): `Text` sets no color. Should it default to the body text role (`colors.neutral.900`)?
3. The JSDoc of `children` says "The HTML element to render, defaulting to 'p'", which describes `component`.
4. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) B28): `body3` at size `lg` and the Figma-only styles: see [Typography](../foundations/typography.md), Open questions.

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-11-09 from contracts/Text.json (scripts/build-contracts.mjs). Styles read from the text recipe and textStyles. Replaced by build/meta in phase 3. -->

### Props

`Text` (also accepts the attributes of `<p>`, or of the element set by `component`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `level` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'body' \| 'body-semibold' \| 'body1' \| 'body1-semibold' \| 'body2' \| 'body2-semibold' \| 'body3' \| 'body3-semibold' \| 'body4' \| 'body4-semibold' \| 'button'` | `body1` | The semantic level of the text (e.g., heading, body). |
| `size` | `'sm' \| 'md' \| 'lg'` | | The size of the text (small, medium, or large). |
| `component` | `React.ElementType` | `p` | The element or component to render instead of the default element. |
| `children` | `React.ReactNode` | | |

### Styles

From the `text` recipe: each `level` and `size` applies the matching entry of `textStyles` (`textStyles.<level>`); `-semibold` levels and `button` set `fontWeights.semi-bold`. Values: [Typography](../foundations/typography.md), Text styles, and `tokens/text-styles.tokens.json`.

Stories: `packages/docs/stories/Foundation/Typography/Typography.stories.tsx`.
<!-- GENERATED:END -->
