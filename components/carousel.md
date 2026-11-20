---
type: component
component: "Carousel"
description: "The carousel is used to display a series of content items, such as images, text, or other media, in a sequential."
category: media
status: draft
figma_url: "https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=26866-143930"
alternatives:
  - Tabs
  - List
related:
  - CarouselSlideContainer
  - CarouselSlide
  - CarouselPrevious
  - CarouselNext
  - CarouselIndicator
  - Image
can_contain:
  - CarouselSlideContainer
  - CarouselPrevious
  - CarouselNext
  - CarouselIndicator
cannot_contain: []
required_children:
  - CarouselSlideContainer
a11y_role: region
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/docs/stories/Components/Carousel/Design.mdx
  - packages/docs/stories/Components/Carousel/Code.mdx
  - packages/docs/stories/Components/Carousel/Examples
  - packages/react/src/components/Carousel/Carousel.tsx
  - packages/react/src/components/Carousel/CarouselSlides.tsx
  - packages/react/src/components/Carousel/CarouselSlide.tsx
  - packages/react/src/components/Carousel/CarouselControl.tsx
  - packages/react/src/components/Carousel/CarouselIndicator.tsx
  - packages/react/src/components/Carousel/models
  - packages/react/src/components/Carousel/hooks/engines/AutoplayPlugin.ts
  - packages/css/src/recipes/Carousel
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Carousel

## Overview

A series of content items, such as images, text or other media, shown one at a time in a sliding strip that the user moves through with arrows, indicators, a drag or the keyboard. It is built from parts that you arrange: `Carousel` (the root and its options), `CarouselSlideContainer` (the viewport and strip), `CarouselSlide` (each item), `CarouselPrevious` and `CarouselNext` (the arrows) and `CarouselIndicator` (the dots). The parts come with little styling; positioning the arrows and dots is up to you.

## When to use

From the docs and the Figma documentation frame:

- Browsing a series of items one at a time, such as product highlights or announcements, with arrows or indicators.
- Content items with an image or color background and text placed center-center, center-bottom, left-center, left-bottom, right-center or right-bottom (docs, Content placement).

## When not to use

The docs give no list. These follow from what the component does and from the other notes:

- Content the user must read or compare: items behind a carousel are often missed. Show them in a `List` or a grid.
- Switching between views of one subject. Use `Tabs` ([Tabs note](tabs.md)).
- A single image the user needs to see larger. Use `Image` with `preview` ([Image note](image.md)).

## Why this design

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| A few highlights, one at a time | `Carousel` | `Tabs` |
| Items the user scans or compares | A list or grid | `Carousel` |
| Views of one subject | `Tabs` | `Carousel` |

## Anatomy

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Slide | yes | `CarouselSlide`: the container for one item. |
| 2 | Content area | yes | Your content inside the slide: image, text, buttons. |
| 3 | Arrow control | no | `CarouselPrevious` and `CarouselNext`: 40px round buttons with a chevron. |
| 4 | Indicator | yes (docs: "Picker control") | `CarouselIndicator`: one dot per slide (or group); the active one is wider. |

## Composition

- Structure:

  ```tsx
  <Carousel aria-label="Product highlights" className={css({ position: 'relative', h: '240px' })}>
    <CarouselSlideContainer>
      <CarouselSlide aria-label="1 of 3">…</CarouselSlide>
      …
    </CarouselSlideContainer>
    <CarouselPrevious className={…} />
    <CarouselNext className={…} />
    <CarouselIndicator className={…} />
  </Carousel>
  ```

- Position the arrows and dots yourself: the Basic story places the arrows at the vertical middle and the dots at the bottom center, absolutely positioned above the slides (`zIndex: 'above'` in token terms).
- Name the carousel with `aria-label`, and each slide with its position ("1 of 3"); the component sets neither.
- Arrows: `variant="light"` (default: white, for dark or colored slides, Figma "On dark") or `variant="dark"` (`colors.neutral.700`, for light slides, Figma "On light"). `children` replaces the chevron.
- Size and gap: `slideSize` (default `100%`) and `slideGap` (default `0`); for several slides in view, such as `slideSize="50%"`. `slidesToScroll` moves several at a time (or `"auto"`), and `isGroupIndicators` on `CarouselIndicator` gives one dot per group.
- `align` (`center` by default, `start`, `end`), `loop`, `initialSlide`, `draggable` (default `true`), `dragFree`, `duration` (default `25`, not milliseconds).
- Autoplay: `autoplay` with `autoplayOptions` (`delay` 3000ms, `stopOnFocusIn` `true`, `stopOnMouseEnter` `false`, `stopOnInteraction` `false`, `stopOnLastSnap` `false` by default). There is no pause button: if you use autoplay, set `stopOnMouseEnter: true` and add your own pause control (WCAG 2.2.2).
- External control: `carouselApi={(api) => …}` gives `scrollNext`, `scrollPrev`, `scrollTo`, `canScrollNext`, `canScrollPrev` and `selectedScrollSnap`; `onSlideChange(index)` reports the slide.
- Orientation: `orientation="vertical"` is supported by the code (prop, recipe, up and down chevrons, Arrow Up and Arrow Down on the dots), but its docs section is commented out and Figma has no vertical carousel. Use it only where the design asks for it.

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| Slide change | Arrows, dots, drag, arrow keys on the dots, `carouselApi` | Animated; `onSlideChange` fires. |
| First or last slide | Without `loop` | The arrow that cannot move is disabled (`colors.neutral.300`). |
| Arrow hover, pressed, focus | Pointer, keyboard | The round background shows more or less; focus adds a 1px inner ring (white or `colors.neutral.700`). |
| Dot active | The current slide | `colors.primary.200`, 16px wide; others `colors.neutral.200`, 8px. |
| Dot hover, focus | Pointer, keyboard | `colors.primary.100`; focus adds a 1px `colors.primary.300` inner ring. |
| Autoplay | `autoplay` | Moves every `delay`; pauses while focus is inside the slides. |

Measured in the prototype (screen `#/carousel`): the arrows are 40px; the previous arrow is disabled on the first slide and the next arrow on the last; the active dot is 16px wide and the others 8px. Autoplay moved after about 3 seconds, kept moving with the pointer over it, paused while a button inside a slide had focus and resumed when focus left, and did not pause while a dot had focus.

## Accessibility

### Keyboard

Measured:

- Tab moves through the content of every slide, then the arrows and the dots (in DOM order). Tabbing into a slide that is out of view scrolls it into view.
- Enter or Space on an arrow moves one step (docs; the arrows are native buttons).
- On the dots (one tab stop, on the active dot): Arrow Right and Arrow Left move to the next and previous slide and focus its dot; Home and End go to the first and last. Without `loop` they stop at the ends.

### Accessible name

- The root is a `section` with `aria-roledescription="carousel"`; give it `aria-label`.
- Slides have `aria-roledescription="slide"`; give each an `aria-label` such as "2 of 5". Slides out of view are not hidden from assistive technology.
- The strip has `aria-live="polite"` (`off` with autoplay), so slide changes are announced.
- The arrows are named "previous slide" and "next slide"; the dots are tabs named "slide 1", "slide 2"… in a tablist named "slides indicator". The dots have no `aria-controls`.

### Focus

Focus stays on the arrow or dot used. Disabled arrows drop out of the tab order.

### Contrast pairs

| Foreground token | Background token | Min ratio |
|---|---|---|
| `colors.white` (light arrow icon) | the slide behind it | 3 |
| `colors.neutral.700` (dark arrow icon) | the slide behind it | 3 |
| `colors.primary.200` (active dot) | the slide behind it | 3 |

## Content

- Slide text: a heading, one supporting line and at most two actions (the Basic story: Heading, Subhead, body, Secondary and Primary buttons).

## Do and don't

| Don't | Do |
|---|---|
| A carousel with no `aria-label` | `aria-label` on `Carousel` and "n of N" on each slide |
| Autoplay without a way to stop it | `stopOnMouseEnter: true` and a pause control, or no autoplay |
| Light arrows on a light slide | `variant="dark"` |
| Key information only in later slides | Put it in the first slide, or in a list |
| `orientation="vertical"` without a design that asks for it | Horizontal, the documented default |
| Inline `style` for positioning, as the stories do | `className` with `css()` |

## Component tokens

## Figma to code mapping

Figma page "Carousel": sets "Carousel" (`8533:101046`), "Carousel arrow item" (`8349:1271`) and "Carousel indicator item" (`8349:756`). Usage documentation: frame "Carousel-Document-Overview" (`26866:143930`); its text matches the Storybook docs. Read on 2026-11-09.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| Carousel · Arrows | True / False | `CarouselPrevious`, `CarouselNext` | present / left out |
| Carousel · Swap content | instance | children of `CarouselSlide` | the content |
| Carousel arrow item · Type | Previous / Next | — | `CarouselPrevious` / `CarouselNext` |
| Carousel arrow item · Style | On dark / On light | `variant` | `"light"` / `"dark"` |
| Carousel arrow item · State | Enable / Hover / Focus / Pressed | — | Interaction states |
| Carousel arrow item · State | Disable | — | The first or last slide without `loop` |
| Carousel indicator item · Status | Active / Inactive | — | The current slide / another slide |
| Carousel indicator item · State | Enable / Hover / Focus | — | Interaction states |
| Carousel indicator item · Orientation | Horizontal / Vertical | `orientation` | `"horizontal"` / `"vertical"` |

## Open questions

1. Resolved 2026-11-10 (team, [known issues](../reports/known-issues-2026-11-10.md) Q1): the Why this design section stays empty. Question was: Why this design and its trade-offs: the docs give none. "When not to use" is drawn from the component and the other notes.
2. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A2): Autoplay has no pause control and keeps moving under the pointer by default; it pauses only for focus inside the slides. Should Magenta add a pause button, as the WAI-ARIA carousel pattern the docs link describes?
3. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A3): Slides out of view are not hidden from assistive technology and carry no name. Should the component set `aria-hidden` or `inert` on them and label them?
4. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A18): Is `orientation="vertical"` supported? Its docs section is commented out.
5. The docs list `CarouselSlideIndicator`; the export is `CarouselIndicator`.
6. Upstream, for the Magenta team: a JSDoc block between `export const` and `CarouselPrevious` hid it from the contract script (fixed in `scripts/build-contracts.mjs` on 2026-11-09); the recipes use raw values (`opacity` levels, `0.2s`).

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-11-09 from contracts/Carousel.json, CarouselSlideContainer.json, CarouselSlide.json, CarouselIndicator.json, CarouselNext.json, CarouselPrevious.json (scripts/build-contracts.mjs). Styles read from the carousel recipes. Replaced by build/meta in phase 3. -->

### Props

`Carousel` (also accepts the attributes of `<div>`; renders a `<section>`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `align` | `'start' \| 'center' \| 'end'` | `center` | |
| `autoplay` | `boolean` | `false` | |
| `autoplayOptions` | `{ delay?, stopOnFocusIn?, stopOnInteraction?, stopOnLastSnap?, stopOnMouseEnter? }` | `3000`, `true`, `false`, `false`, `false` | |
| `carouselApi` | `(api: CarouselApiType) => void` | | |
| `dragFree` | `boolean` | `false` | |
| `draggable` | `boolean` | `true` | |
| `duration` | `number` | `25` | |
| `initialSlide` | `number` | `0` | |
| `loop` | `boolean` | `false` | |
| `onSlideChange` | `(index: number) => void` | | |
| `orientation` | `'horizontal' \| 'vertical'` | `horizontal` | |
| `slideGap` | `string \| number` | `0px` | |
| `slideSize` | `string \| number` | `100%` | |
| `slidesToScroll` | `number \| 'auto'` | `1` | |

`CarouselSlideContainer`, `CarouselSlide`: no props of their own (attributes of `<div>`).

`CarouselIndicator`: `isGroupIndicators` (`boolean`, default `false`): if true, the indicators will be grouped based on the number of slides to scroll.

`CarouselPrevious`, `CarouselNext` (attributes of `<button>`): `variant` (`'light' | 'dark'`, default `light`).

Most props have no JSDoc in the package; defaults are from the code and the docs.

### Styles

| Recipe · slot | Styles |
|---|---|
| `carousel` | relative; viewport hides overflow; strip is a flex row (column when vertical) |
| `carouselSlide` | flex basis `slideSize`, end padding `slideGap` |
| `carouselControl` | `sizes.40` circle (`radii.full`); `light`: `colors.white` icon and background layer; `dark`: `colors.neutral.700`; disabled `colors.neutral.300`; focus 1px inner ring (`borders.1`) |
| `carouselIndicator` | gap `spacing.8`; dot `sizes.8`, `colors.neutral.200`; hover and focus `colors.primary.100`, focus ring `colors.primary.300`; active `colors.primary.200`, `sizes.16` long |

Stories: `packages/docs/stories/Components/Carousel/Carousel.stories.tsx`, `packages/docs/stories/Components/Carousel/Examples`.
<!-- GENERATED:END -->
