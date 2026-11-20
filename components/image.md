---
type: component
component: "Image"
description: "The Image component ensures consistent visual presentation across the product by standardizing how images are displayed within predefined aspect ratios."
category: media
status: draft
figma_url: "https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=95703-144489"
alternatives:
  - Avatar
related:
  - ImageBase
  - Lightbox
  - Spinner
can_contain: []
cannot_contain: []
required_children: []
a11y_role: img
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/docs/stories/Components/Image/Design.mdx
  - packages/docs/stories/Components/Image/Code.mdx
  - packages/docs/stories/Components/Image/Examples
  - packages/react/src/components/Image/Image.tsx
  - packages/react/src/components/Image/Image.model.ts
  - packages/react/src/components/Image/ImageBase/ImageBase.tsx
  - packages/react/src/components/Image/Overlay/Overlay.tsx
  - packages/react/src/components/Lightbox/Lightbox.tsx
  - packages/react/src/components/Lightbox/Lightbox.model.ts
  - packages/css/src/recipes/image.ts
  - packages/css/src/recipes/Lightbox/lightbox.ts
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Image (Image, ImageBase, Lightbox)

## Overview

An image shown in a fixed aspect ratio, with optional rounded corners, a caption, a loading state, a disabled state and a preview: with `preview`, clicking the image opens it full size in a `Lightbox` over the page. `Image` is the component to use; `ImageBase` is the bare `<img>` it renders, and `Lightbox` is the full-screen viewer it opens. Fixed ratios keep layouts stable and avoid unexpected cropping (docs).

## When to use

From the docs and the Figma documentation frame:

- Any picture in product content, in one of the recommended ratios (1:1, 2:1, 2:3, 3:1, 3:2, 3:4, 4:3, 16:9, or free).
- By shape: square for product cards, thumbnails and gallery grids; rounded to follow the design language's curvature; circular for an image that represents identity (people, brands).
- By ratio: wide for system-level content (campaigns, features); square for scanning and browsing; tall when the image itself tells a vertical story.
- With a caption in articles, reports and documentation, where the image needs context or a source.
- Floating beside text, when it supports the nearby paragraph and is secondary to it (left when it introduces the point, right when it adds detail).
- With `preview`, when the user needs to see the image larger.

## When not to use

From the docs:

- A user's photo or initials as an identity marker in the UI. Use `Avatar` ([Avatar note](avatar.md)); the docs say a circular image "may be formatted to appear as an Avatar".
- Floating an image that is the main subject (charts, results, infographics): center it. Do not float on narrow screens, or two images on the same line.
- `objectFit="fill"`: do not stretch, compress or distort images; when space is short, change the size, not the ratio.

## Why this design

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| A person's photo next to their name in the UI | `Avatar` | `Image` with `borderRadius="full"` |
| A content image in a card or article | `Image` | `ImageBase` or a plain `<img>` |
| An image the user needs to see larger | `Image` with `preview` | A custom modal |

## Anatomy

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Image | yes | The `<img>`, with `alt`. |
| 2 | Wrapper | yes | A `div`, or a `button` with `preview`. |
| 3 | Caption | no | `imageCaption`, in a `<figcaption>`; the image and caption sit in a `<figure>`. |
| 4 | Overlay | no | With `preview`: a dark layer (`colors.background-overlay.50`) with an eye icon and "Preview", shown on hover. |
| 5 | Loading layer | no | With `loading`: a `colors.neutral.100` layer with a `Spinner` over the image. |
| 6 | Lightbox | no | With `preview`: the image at full size over a dark overlay, closed by Escape or a click outside. |

## Composition

- Size and ratio: give the container a width (or pass `width`) and set `aspectRatio` (for example `16 / 9`, `1`); the image fills the width and keeps the ratio. Set a maximum width and height so images do not grow too large on big screens (docs).
- Fit: `objectFit="cover"` (default) for visual-first images such as cards, banners and thumbnails; `"contain"` when the whole image must be seen, such as diagrams, charts, maps, logos and screenshots (docs).
- Corners: `borderRadius` `"sm"`, `"md"`, `"lg"` or `"xl"` (`radii.xl`, which only `Image` uses; [Border](../foundations/border.md)); `"full"` with `aspectRatio={1}` for a circle.
- `alt` is required. Write what the image shows, following the docs' writing rule ([noun] + [action] + [context], no "image of"); for charts, the main point; for images with text, that text.
- Caption: `imageCaption`; say why the image matters, in one sentence, with the source at the end if needed; do not repeat the alt text (docs).
- Loading: `loading` is yours to set. Set it while you fetch the image and clear it in `onLoad`; the component does not detect loading itself. `loadingType="lazy"` defers loading until the image is near the viewport.
- Errors: handle `onError`, for example by switching `src` to a fallback image (docs). Otherwise the browser shows its broken-image icon and the `alt` text.
- Preview: `preview` turns the image into a button that opens the `Lightbox`. Replace the overlay content with `OverlayProps.content`.
- Floating: float the image's container with `css()`, keeping 8–12px from the text (docs).
- `Lightbox` on its own: `<Lightbox open={open} onClose={setOpen} aria-label="…">` with an `<ImageBase>` child. Give it an `aria-label`: it has no name otherwise.

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| Default | — | The image. |
| Loading | `loading` | A `colors.neutral.100` layer with a 1px `colors.neutral.200` border and a `Spinner`, over the image. |
| Hover | Pointer, with `preview` | The overlay fades in. |
| Focus | Tab, with `preview` | A 1px `colors.primary.500` outline. The overlay does not show on focus. |
| Disabled | `disabled` | The image at 50% opacity; `preview` does nothing. |
| Error | The `src` fails | The browser's broken-image icon and the `alt` text. |
| Lightbox open | Click or Enter on a preview image | The image at full size, at most the viewport minus 64px, over `colors.background-overlay.50`; the page stops scrolling. |
| Lightbox closed | Escape, a click outside | Focus returns to the image. |

Measured in the prototype (screen `#/image`): in a 280px column, `aspectRatio={16 / 9}` gives 280 × 158px, `4 / 3` 280 × 210px, `1` 280 × 280px; `borderRadius="md"` is 4px; the caption is 13px in `colors.neutral.500`; the disabled image is at 0.5 opacity. The Lightbox opened at the image's natural size (800 × 450px), with no close button and nothing focusable inside: focus stayed on the image button behind the overlay, and Tab moved to an invisible focus guard. Escape and a click on the overlay closed it and focus returned to the image.

## Accessibility

### Keyboard

- With `preview`: Tab reaches the image; Enter or Space opens the Lightbox (docs; the image is a native button); Escape closes it (measured).
- Without `preview`: the image is not focusable.

### Accessible name

- The image's name is its `alt`. An image that is pure decoration takes `alt=""`.
- A preview image is a button named by its `alt` and the overlay text "Preview".
- The Lightbox is a `role="dialog"` with `aria-modal="true"` and no name; pass `aria-label` when you use it directly (`Image` gives it none). Its `title` prop becomes a tooltip, not a name.
- The loading layer has no text, role or `aria-busy`; say that the image is loading elsewhere if it matters.

### Focus

When the Lightbox opens, focus does not move into it (`initialFocus` is `-1`) and it has no close button, so keyboard users can only close it with Escape. Focus returns to the image when it closes.

### Contrast pairs

| Foreground token | Background token | Min ratio |
|---|---|---|
| `colors.neutral.500` (caption) | `colors.white` | 4.5 |
| `colors.white` (overlay text) | `colors.background-overlay.50` over the image | 4.5 |

## Content

- Alt text: describe what the image shows, concisely, without "image of" or "photo of"; include any important text shown in the image (docs).
- Caption: why the image is relevant, one sentence, complete and in a consistent tense; source at the end (docs).

## Do and don't

| Don't | Do |
|---|---|
| An `Image` without meaningful `alt` | `alt` that says what the image shows, or `alt=""` for decoration |
| `objectFit="fill"` | `cover` or `contain`, and change the size instead of the ratio |
| Several unmatched ratios in one group | One ratio per group (docs) |
| `Image` with `borderRadius="full"` for a user in the UI | `Avatar` |
| A `Lightbox` with no `aria-label` | `aria-label` naming the image |

## Component tokens

## Figma to code mapping

Figma page "Image": set "Image" (`95703:145041`). Usage documentation: frame "Image" (`95703:144489`); its text matches the Storybook docs. The page has no "Document-Overview" frame and the component status sitemap marks Image "Unavailable". Figma has no Lightbox. Read on 2026-11-09.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| Ratio | 1:1 / 2:1 / 2:3 / 3:1 / 3:2 / 3:4 / 4:3 / 16:9 | `aspectRatio` | `1` / `2` / `2 / 3` / `3` / `3 / 2` / `3 / 4` / `4 / 3` / `16 / 9` |
| Ratio | Free | `aspectRatio` | left out; set `width` and `height` |
| State | Default | — | — |
| State | Hover / Focus | `preview` | `true` |
| State | Loading | `loading` | `true` |
| State | Disabled | `disabled` | `true` |
| State | Error | — | A failed `src`; handle with `onError` |
| Alt Text | text | `alt` | the text |

## Open questions

1. Resolved 2026-11-10 (team, [known issues](../reports/known-issues-2026-11-10.md) Q1): the Why this design section stays empty. Question was: Why this design and its trade-offs: the docs give none.
2. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A6): The Lightbox has no close button (its recipe has a `closeIcon` slot, unused) and moves no focus into itself. Should it have both?
3. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A24): The docs describe zoom in and out in the preview; the Lightbox has none.
4. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A7): The preview overlay shows on hover only, not on keyboard focus.
5. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) C3): The component status sitemap marks Image "Unavailable", but the code exports it. Is it released?
6. Upstream, for the Magenta team: the caption is `colors.neutral.500`, below 4.5:1 on white; the non-preview wrapper is a `div` with a `disabled` attribute; the loading layer has no accessible state; Lightbox's `title` and `LightboxCloseReason` `close-icon` have no matching feature; the Overlay uses raw `0.1s`.

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-11-09 from contracts/Image.json, contracts/ImageBase.json, contracts/Lightbox.json (scripts/build-contracts.mjs). Styles read from the image and lightbox recipes. Replaced by build/meta in phase 3. -->

### Props

`Image` (also accepts the props of `ImageBase`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | | |
| `alt` | `string` | required | |
| `aspectRatio` | `number` (or a CSS keyword) | | |
| `objectFit` | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` (or a CSS keyword) | `cover` | |
| `borderRadius` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | | |
| `width`, `height` | `number \| string` | | Size of the wrapper |
| `htmlWidth`, `htmlHeight` | `number \| string` | `100%` | `width` and `height` of the `<img>` |
| `imageCaption` | `React.ReactNode` | | Caption in a `<figcaption>` |
| `ImageCaptionProps` | props of `<figcaption>` | | |
| `ImageWrapperProps` | HTML attributes | | Props of the wrapper |
| `loading` | `boolean` | `false` | Shows the loading layer |
| `loadingType` | `'eager' \| 'lazy'` | | The `<img>` `loading` attribute |
| `preview` | `boolean` | `false` | Opens the image in a `Lightbox` on click |
| `OverlayProps` | `{ content?, WrapperProps? }` | | The preview overlay |
| `disabled` | `boolean` | `false` | |
| `onLoad`, `onError` | event handlers | | |

`Lightbox` (also accepts the attributes of `<div>`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | required | |
| `children` | `React.ReactNode` | required | The image |
| `onClose` | `(open, event?, reason?: 'outside-press' \| 'escape-key' \| 'close-icon') => void` | | |
| `closeByEscape` | `boolean` | `true` | |
| `closeByOutsideClick` | `boolean` | `true` | |
| `lockScroll` | `boolean` | `true` | |
| `initialFocus` | `number \| React.MutableRefObject<HTMLElement \| null>` | `-1` | |
| `returnFocus` | `boolean` | `true` | |
| `title` | `string` | | |

The props have no JSDoc in the package.

### Styles

| Recipe · slot | Styles |
|---|---|
| `image` `figure` | flex column, gap `spacing.4` |
| `image` `imageWrapper` | focus-visible outline 1px `colors.primary.500` |
| `image` `caption` | `fontSizes.sm`, `colors.neutral.500` |
| `image` `overlay` | `colors.background-overlay.50`, hidden until hover |
| `image` `spinner` | `colors.neutral.100`, 1px border `colors.neutral.200` |
| `image` · `borderRadius` | `radii.sm`, `radii.md`, `radii.lg`, `radii.xl`, `radii.full` |
| `lightbox` `overlay` | `colors.background-overlay.50`, centered |
| `lightbox` `image` | at most viewport minus 64px |

Stories: `packages/docs/stories/Components/Image/Image.stories.tsx`, `packages/docs/stories/Components/Image/Examples`.
<!-- GENERATED:END -->
