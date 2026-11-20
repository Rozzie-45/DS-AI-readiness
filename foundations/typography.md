---
type: foundation
foundation: typography
token_group: fonts, fontSizes, fontWeights, lineHeights, letterSpacings, textStyles
status: stable
sources:
  - packages/docs/stories/Foundation/Typography/Design.mdx
  - packages/docs/stories/Foundation/Typography/Typography.mdx
  - packages/docs/assets/images/Typography
  - packages/docs/stories/Foundation/GettingStarted/Develop.mdx
  - packages/css/src/tokens.ts
  - packages/css/src/recipes/Text
  - packages/css/src/preset.ts
  - packages/css/src/breakpoints.ts
  - packages/react/src/components/Text
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Typography

## Overview

Tokens provide a standardized approach for font sizes, weights, line heights, and letter spacing, ensuring consistency throughout the product.

Magenta has one typeface (Noto Sans), two weights, 12 font sizes, 11 line heights and 4 letter spacings. They are combined into 12 text styles: `h1`–`h6`, `body`, `body1`–`body4` and `button`. The `Text` component applies a style through its `level` prop; body levels also come with a `-semibold` suffix, for example `body1-semibold`. Text styles respond to the viewport: size `sm` under 1280px, `md` from 1280px and `lg` from 1920px, unless a fixed `size` is passed.

## Principles

**Every style has a role.** Font styles serve distinct roles in communicating information and establishing a clear visual hierarchy. Pick a style for its role (see Semantic roles), not for its size.

**Weight builds hierarchy.** By contrasting thick and thin cuts, we offer dynamic contrast and establish hierarchy, which helps communicate key information. Choose a weight that suits the text size and context.

**Headings are sparing.** Headings introduce and segment content. They command attention through larger size and bolder weight, so use them sparingly within a single page.

**Color supports hierarchy.** A slightly different color or shade can separate subheadings and subtitles from main headings, which establishes a sub-level hierarchy. Use the text color roles in [Color](color.md#text).

**Lists.** Use numbered lists for items in a set order. Use bullet lists to group related items.

## Rules

- MUST set text styles with the `Text` component's `level` prop, or with `textStyle` in Panda style objects. MUST NOT combine `fontSizes`, `lineHeights` and `letterSpacings` tokens by hand for text that a style covers.
- MUST use only Noto Sans (`fonts.primary`), in every language. MUST NOT use Proxima Nova or another typeface.
- MUST use only `fontWeights.regular` (400) and `fontWeights.semi-bold` (600). For semi-bold body text, use the `-semibold` level, e.g. `body1-semibold`.
- MUST NOT use raw font sizes, line heights or weights (`14px`, `1.5`, `700`).
- MUST choose a style by its role in [Semantic roles](#semantic-roles), not by its size. MUST NOT use a style for a purpose that has no role; ask instead.
- MUST NOT use the names in the "class name" column of the Font Style table (`--text-h1`, `--text-body1-regular`…). They are labels in the docs, not CSS variables or classes in code.
- The `button` style MUST be used only for button labels. `Button` applies it already.
- `body1` is the default body text. The `body` style MUST be used only in commercial documents.
- The title of a product page MUST use the `h4` style in an `<h1>` element: `<Text level="h4" component="h1">`. The `h4` style MUST appear at most once per product page.
- MUST NOT use `body3-semibold` or `body4-semibold`. They have no role yet.
- A `Text` that is a heading MUST pass a heading element in `component` (`h1`–`h6`). `level` only sets the look; without `component`, `Text` renders a `<p>` (WCAG 1.3.1).
- Apps MUST load Noto Sans at weights 400 and 600. Magenta sets the font family but does not load the font.

## Primitive tokens

<!-- What each scale is. The values are in the GENERATED block. Product code reaches the scales through the text styles in Semantic roles, not directly. -->

| Token | Description |
|---|---|
| `fonts.primary` | Noto Sans, the only typeface, in every language. The Magenta preset sets it on `html`, so all text inherits it. |
| `fontWeights.regular` | Regular. Body levels without the `-semibold` suffix. |
| `fontWeights.semi-bold` | Semi-bold. Headings `h1`–`h6`, the `button` style and body levels with `-semibold`. |
| `fontSizes.*` | The font size scale, `2xs` to `7xl`. Font sizes directly impact the legibility and visual hierarchy of the product. The sizes follow no single ratio: each step is 1.06 to 1.22 times the size before it, about 1.15 on average (see the Step column below). |
| `lineHeights.*` | The line height scale, `sm` to `8xl`. Each text style pairs a font size with one line height. |
| `letterSpacings.*` | Four letter spacings: `narrowest`, `narrower`, `narrow` and `normal`. Headings use `narrower`, body text `narrower` or `narrowest`, buttons `narrow`. |

## Semantic roles

<!-- Text styles are the semantic layer of typography: each combines primitive tokens for a role. Roles come from the Usage column of the Font Style table; groups follow the Heading, Body and Detail categories of the Usage section (both in the Storybook docs, see sources). -->

How to apply a row in code: `<Text level="h4">`, and for a semi-bold row add the suffix, `<Text level="body2-semibold">`. In Panda style objects: `textStyle: 'body2'`, plus `fontWeight: 'semi-bold'` for a semi-bold row.

Pair each style with a text color role from [Color](color.md#text): Heading, Default subheadings and subtitles, Default body text, or Default labels, helper text and explanatory text.

### Heading

Heading styles establish a clear structure and hierarchy on a page by introducing and segmenting content. They command attention through larger size, bolder weight, and greater visual prominence.

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Oversized screen titles. Display heading for landing pages or marketing sites. | `textStyles.h1` |  |  |  |
| Empty states and feature introductions. Top-level headers. | `textStyles.h2` |  |  |  |
| Oversized titles. Introduction heading. | `textStyles.h3` |  |  |  |
| Main titles. Use only once per product page, in an `<h1>` element. | `textStyles.h4` |  |  |  |
| Headings of key functionality. | `textStyles.h5` |  |  |  |
| Default subtitle. | `textStyles.h6` |  |  |  |

### Body

Body typography is the primary textual content: paragraphs, sentences, and other information that conveys the main message or details. `body1` is the default.

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Default body in commercial documents only. | `textStyles.body` |  |  |  |
| Strong body for emphasis in commercial documents only. | `textStyles.body` + `fontWeights.semi-bold` |  |  |  |
| Default body. Input text. Text links. | `textStyles.body1` |  |  |  |
| Default subtitle. Strong body for emphasis. | `textStyles.body1` + `fontWeights.semi-bold` |  |  |  |

### Detail

Detail typography is smaller text that gives additional context or supplementary information: captions, labels, footnotes, citations, or other text that supports the main content.

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Default helper text. | `textStyles.body2` |  |  |  |
| Default label. | `textStyles.body2` + `fontWeights.semi-bold` |  |  |  |
| Default caption that accompanies an image, illustration or media element to give descriptive or explanatory context. | `textStyles.body3` |  |  |  |
| Small caption. | `textStyles.body4` |  |  |  |

### Button

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Button labels only. `Button` applies it. | `textStyles.button` |  |  |  |

## Accessibility

- **Contrast.** Text styles at 24px or larger need 3:1 against their background; all others need 4.5:1 (see [Color](color.md)). Only `h1` and `h2` at every size, and `h3` at `lg`, reach 24px. Every other style needs 4.5:1.
- **Headings.** Pass a heading element in `component` so assistive technology can navigate by heading. The heading element follows the page outline, not the visual style.
- **Text resize.** Font sizes and line heights are in rem, so text scales with the user's browser font setting. Letter spacing is in px.
- **Small text.** `body2`, `body3` and `body4` are 10px at size `sm`, and `body4` is 10px at every size. The team keeps these sizes; there is no larger minimum.

## Do and don't

| Don't | Do |
|---|---|
| `css({ fontSize: 'xs', lineHeight: 'md', letterSpacing: 'narrower' })` for body text | `<Text level="body1">` or `css({ textStyle: 'body1' })` |
| `<Text level="h4">Shipment details</Text>` as a page title: it renders a `<p>` | `<Text level="h4" component="h1">Shipment details</Text>` |
| `fontWeight: 'bold'` or `700` | `level="body1-semibold"`, or `fontWeight: 'semi-bold'` |
| `<Text level="button">` on a link or label | `Button`, which applies the button style itself |
| `font: var(--text-h1)` or `className="text-h1"` | `<Text level="h1">` or `css({ textStyle: 'h1' })` |

## Open questions

**1. Upstream doc cleanup.** To report to the Magenta team about the Typography page (Design.mdx):
- It says the sizes follow "the major third type scale, with a ratio of 1.2", rounded to the nearest multiple of 4px. The sizes in code follow no single ratio (see the Step column below), and most are not multiples of 4.
- It mentions Proxima Nova and different fonts for different languages, and lists five Noto Sans weights. Product UI uses only Noto Sans at 400 and 600.
- The line length section gives 40 to 60 characters in the text and 60 to 100 in the illustration, and refers to a "font size 100" that does not exist. This note leaves line length out.
- The "class name" column of the Font Style table (`--text-h1`…) names nothing that exists in code.

**2. `body3` at size `lg` (code bug).** `<Text level="body3" size="lg">` renders 10/12, because `getTextStyle` applies only the `3xl` overrides for `lg` and `body3` has none. Responsive `body3` renders 11/16 from 1920px. The Figma library keeps its own `body3` styles until this is settled: `md` is 10/12 there, 11/16 in code; `lg` is 11/16. They were left out of the first token sync (2026-11-04, [report](../reports/archive/figma-sync-2026-11-04.md)).

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-10-28 by a one-off script from packages/css/src/tokens.ts and packages/css/src/recipes/Text. Replaced by scripts/ in phase 3. -->

### Font family

| Token | Value | CSS variable |
|---|---|---|
| `fonts.primary` | `'Noto Sans', sans-serif` | `--mag-fonts-primary` |

### Font weight

| Token | Value | CSS variable |
|---|---|---|
| `fontWeights.regular` | 400 | `--mag-font-weights-regular` |
| `fontWeights.semi-bold` | 600 | `--mag-font-weights-semi-bold` |

### Font size

Step: this size divided by the one before it.

| Token | rem | px | Step | CSS variable |
|---|---|---|---|---|
| `fontSizes.2xs` | 0.625rem | 10 | — | `--mag-font-sizes-2xs` |
| `fontSizes.xs` | 0.6875rem | 11 | 1.10 | `--mag-font-sizes-xs` |
| `fontSizes.sm` | 0.8125rem | 13 | 1.18 | `--mag-font-sizes-sm` |
| `fontSizes.md` | 0.9375rem | 15 | 1.15 | `--mag-font-sizes-md` |
| `fontSizes.lg` | 1.0625rem | 17 | 1.13 | `--mag-font-sizes-lg` |
| `fontSizes.xl` | 1.1875rem | 19 | 1.12 | `--mag-font-sizes-xl` |
| `fontSizes.2xl` | 1.4375rem | 23 | 1.21 | `--mag-font-sizes-2xl` |
| `fontSizes.3xl` | 1.6875rem | 27 | 1.17 | `--mag-font-sizes-3xl` |
| `fontSizes.4xl` | 1.9375rem | 31 | 1.15 | `--mag-font-sizes-4xl` |
| `fontSizes.5xl` | 2.1875rem | 35 | 1.13 | `--mag-font-sizes-5xl` |
| `fontSizes.6xl` | 2.3125rem | 37 | 1.06 | `--mag-font-sizes-6xl` |
| `fontSizes.7xl` | 2.8125rem | 45 | 1.22 | `--mag-font-sizes-7xl` |

### Line height

| Token | rem | px | CSS variable |
|---|---|---|---|
| `lineHeights.sm` | 0.75rem | 12 | `--mag-line-heights-sm` |
| `lineHeights.md` | 1rem | 16 | `--mag-line-heights-md` |
| `lineHeights.lg` | 1.25rem | 20 | `--mag-line-heights-lg` |
| `lineHeights.xl` | 1.375rem | 22 | `--mag-line-heights-xl` |
| `lineHeights.2xl` | 1.5rem | 24 | `--mag-line-heights-2xl` |
| `lineHeights.3xl` | 1.75rem | 28 | `--mag-line-heights-3xl` |
| `lineHeights.4xl` | 2rem | 32 | `--mag-line-heights-4xl` |
| `lineHeights.5xl` | 2.25rem | 36 | `--mag-line-heights-5xl` |
| `lineHeights.6xl` | 2.5rem | 40 | `--mag-line-heights-6xl` |
| `lineHeights.7xl` | 2.75rem | 44 | `--mag-line-heights-7xl` |
| `lineHeights.8xl` | 3.25rem | 52 | `--mag-line-heights-8xl` |

### Letter spacing

| Token | Value | CSS variable |
|---|---|---|
| `letterSpacings.narrowest` | -0.4px | `--mag-letter-spacings-narrowest` |
| `letterSpacings.narrower` | -0.2px | `--mag-letter-spacings-narrower` |
| `letterSpacings.narrow` | -0.1px | `--mag-letter-spacings-narrow` |
| `letterSpacings.normal` | 0px | `--mag-letter-spacings-normal` |

### Text styles

Values per `size` of `Text`, as font size / line height in px, then letter spacing. Without `size`, `Text` is responsive: `sm` under 1280px, `md` from 1280px, `lg` from 1920px. The `button` style switches at 768px and 1024px instead. Weight is semi-bold for `h1`–`h6` and `button`; body levels are regular, or semi-bold with the `-semibold` suffix. Default `level`: `body1`. Default element: `p`.

| Style | sm | md | lg |
|---|---|---|---|
| `h1` | 35/40 · -0.2px (`5xl`/`6xl`/`narrower`) | 37/44 · -0.2px (`6xl`/`7xl`/`narrower`) | 45/52 · -0.2px (`7xl`/`8xl`/`narrower`) |
| `h2` | 27/32 · -0.2px (`3xl`/`4xl`/`narrower`) | 31/36 · -0.2px (`4xl`/`5xl`/`narrower`) | 37/44 · -0.2px (`6xl`/`7xl`/`narrower`) |
| `h3` | 19/24 · -0.2px (`xl`/`2xl`/`narrower`) | 23/28 · -0.2px (`2xl`/`3xl`/`narrower`) | 31/36 · -0.2px (`4xl`/`5xl`/`narrower`) |
| `h4` | 17/22 · -0.2px (`lg`/`xl`/`narrower`) | 19/24 · -0.2px (`xl`/`2xl`/`narrower`) | 23/28 · -0.2px (`2xl`/`3xl`/`narrower`) |
| `h5` | 15/20 · -0.2px (`md`/`lg`/`narrower`) | 17/22 · -0.2px (`lg`/`xl`/`narrower`) | 19/24 · -0.2px (`xl`/`2xl`/`narrower`) |
| `h6` | 13/16 · -0.2px (`sm`/`md`/`narrower`) | 15/20 · -0.2px (`md`/`lg`/`narrower`) | 17/22 · -0.2px (`lg`/`xl`/`narrower`) |
| `body` | 13/20 · -0.2px (`sm`/`lg`/`narrower`) | 15/24 · -0.4px (`md`/`2xl`/`narrowest`) | 17/28 · -0.4px (`lg`/`3xl`/`narrowest`) |
| `body1` | 11/16 · -0.2px (`xs`/`md`/`narrower`) | 13/20 · -0.4px (`sm`/`lg`/`narrowest`) | 15/24 · -0.4px (`md`/`2xl`/`narrowest`) |
| `body2` | 10/12 · -0.2px (`2xs`/`sm`/`narrower`) | 11/16 · -0.2px (`xs`/`md`/`narrower`) | 13/20 · -0.4px (`sm`/`lg`/`narrowest`) |
| `body3` | 10/12 · -0.2px (`2xs`/`sm`/`narrower`) | 11/16 · -0.2px (`xs`/`md`/`narrower`) | 10/12 · -0.2px (`2xs`/`sm`/`narrower`) |
| `body4` | 10/12 · -0.2px (`2xs`/`sm`/`narrower`) | 10/12 · -0.2px (`2xs`/`sm`/`narrower`) | 10/12 · -0.2px (`2xs`/`sm`/`narrower`) |
| `button` | 11/16 · -0.1px (`xs`/`md`/`narrow`) | 13/20 · -0.1px (`sm`/`lg`/`narrow`) | 15/24 · -0.1px (`md`/`2xl`/`narrow`) |

### Observed use in recipes

Occurrences in component recipes, outside the `Text` recipe. This shows current practice, not an approved rule.

| Property | Values (occurrences) |
|---|---|
| `fontSize` | `xs` 67, `sm` 66, `md` 50, `2xs` 22, `xl` 1, `inherit` 3, `12px` 1 (checkbox input) |
| `lineHeight` | `md` 65, `lg` 63, `2xl` 49, `sm` 22, `inherit` 2, `0` 2 |
| `letterSpacing` | `narrowest` 92, `narrower` 79, `narrow` 11, `normal` 8, `inherit` 2 |
| `fontWeight` | `semi-bold` 27, `regular` 4, `inherit` 1 |
| `textStyle` | `body1` 3, `h5` 1 |
| `getTextStyle()` | `body1` 16, `body2` 3 |

<!-- GENERATED:END -->
