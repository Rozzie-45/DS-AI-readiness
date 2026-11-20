---
type: component
component: "Calendar"
description: "The calendar grids used inside the date pickers, also exported for a calendar shown on the page: days, a date range, date and time, months, quarters and weeks."
category: inputs
status: draft
figma_url: "https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=27344-47749"
alternatives:
  - DatePicker
  - DateRangePicker
related:
  - CalendarWrapper
  - DateTimeCalendar
  - DualCalendar
  - SingleDateRangeCalendar
  - MonthCalendar
  - MonthRangeCalendar
  - QuarterlyCalendar
  - QuarterlyRangeCalendar
  - WeekCalendar
can_contain: []
cannot_contain: []
required_children: []
a11y_role: table
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/docs/stories/Dates/Calendars/Design.mdx
  - packages/docs/stories/Dates/Calendars/Calendar/Code.mdx
  - packages/docs/stories/Dates/Calendars
  - packages/react-dates/src/components/Calendar
  - packages/react-dates/src/components/atoms/CalendarWrapper/index.tsx
  - packages/css/src/recipes/Calendar/date.ts
  - packages/css/src/recipes/Calendar/calendarWrapper.ts
  - packages/css/src/recipes/Calendar/calendarHeader.ts
  - packages/css/src/recipes/Calendar/weekdaysRow.ts
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Calendar

## Overview

The calendar grids of `@ocean-network-express/magenta-react-dates`. Each date picker opens one of them in its popover, and each is also exported, to show a calendar directly on the page:

| Calendar | Selects | Used inside |
|---|---|---|
| `Calendar` | One day | `DatePicker` |
| `DateTimeCalendar` | One day and a time | `DateTimePicker` |
| `DualCalendar` | A range of days, two months side by side | `DateRangePicker` (default) |
| `SingleDateRangeCalendar` | A range of days, one month | `DateRangePicker mode="single"` |
| `MonthCalendar` | One month | `MonthPicker` (an internal variant) |
| `MonthRangeCalendar` | A range of months, two years | `MonthRangePicker` |
| `QuarterlyCalendar`, `QuarterlyRangeCalendar` | A quarter, a range of quarters | `QuarterlyPicker`, `QuarterlyRangePicker` |
| `WeekCalendar` | A week | `WeekPicker` |

`CalendarWrapper` is the white card around a calendar shown on the page (the pickers' popover has its own).

This note covers what the calendars share: the anatomy, the day states and their tokens, keyboard and accessibility, and the props for a calendar on the page. The picker notes cover the field and how picks fill it: [DatePicker](date-picker.md), [DateRangePicker](date-range-picker.md), [MonthPicker](month-picker.md).

## When to use

- Use a picker in forms; it already contains the right calendar.
- Use a calendar directly when the calendar is the content: a booking view, a schedule, availability, where the user should see the month at once.

## When not to use

- A form field for a date: use the matching picker, not a calendar next to an `Input`.

## Why this design

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| A date field in a form | `DatePicker` | `Calendar` in a `Popover` built by hand |
| A month always visible on the page | `Calendar` in `CalendarWrapper` | `DatePicker` with `open` forced on |
| A range always visible | `DualCalendar` (or `SingleDateRangeCalendar` where space is short) | Two `Calendar`s |

## Anatomy

From the docs and Figma (numbers as in the docs' anatomy image), for `Calendar`:

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Calendar container | yes | The grid and its header. On the page, wrap it in `CalendarWrapper`: `colors.white`, `radii.lg`, `shadows.lg`, padding `spacing.6` / `spacing.8` / `spacing.12` by size. |
| 2 | Month dropdown | yes (`Calendar`) | A button with the month name that opens a menu of the 12 months. |
| 3 | Year dropdown | yes (`Calendar`) | A button with the year that opens a menu of years (`yearRange`, default 2000–2050). |
| 4 | Month control | yes | Previous and next month buttons. |
| 5 | Day row | yes | One-letter weekday headers, `colors.neutral.600`. |
| 6 | Calendar grid | yes | Day buttons, 6 rows with `consistentWeeks`, otherwise as many as the month needs. A 1px `colors.neutral.200` line separates the header. |

`DualCalendar` and the range calendars show the month and year as plain text, with no dropdowns, and one previous and one next button for the pair (measured). Optional slots on all: `calendarHeaderContent` and `calendarFooterContent` (preset shortcuts, Reset).

## Composition

- Pass `size="responsive"` to the calendar and to `CalendarWrapper`; both default to `lg`.
- `Calendar` value: controlled with `date` and `onDateChange(date)`, or uncontrolled with `defaultDate`. `initialMonth` (0–11) and `initialYear` set the first month shown.
- Range calendars: `date` is `[start, end]`, `onDateChange([start, end])`; `startViewDate` sets the first month shown.
- Limits: `minDate` and `maxDate` disable days outside them and the month buttons at the edge. They do not limit the month and year menus (see Behavior); set `yearRange` to match.
- `hideOutside` hides the days of the previous and next month; `consistentWeeks` always draws 6 rows (with `hideOutside` this leaves empty rows).
- Per-day content: `renderHelperTextDay(date)` adds content under each day (a price, a tag); `getDayProps(date)` sets props on a day (for example `disabled`).
- Props whose names start with `__` or `is` (`__handlerRef`, `isDualMode`, `isNext`, …) are internal wiring between the calendars; do not set them.
- `CalendarWrapper` takes only `size` and `children` (code); it has no `className` or attributes.

## Behavior

Day states, from the `date` recipe and measured in the prototype (screen `#/calendar`):

| State | Triggered by | Tokens |
|---|---|---|
| Default (this month) | — | text `colors.neutral.900`, semibold |
| Hover | Pointer over a day | background `colors.primary.100` |
| Pressed | Pointer down | background `colors.primary.300` |
| Focus | Keyboard focus | inset 2px ring `colors.primary.300` |
| Today | The current date | text `colors.primary.600` and a 24 × 2px `colors.primary.600` bar under the number |
| Selected (and range ends) | A pick | background `colors.primary.600`, text `colors.white`; hover `colors.primary.400`, pressed `colors.primary.700` |
| In range | Between the range ends | the cell background `colors.primary.100`; hover `colors.primary.200` |
| Anticipated (draft range) | Hovering a possible end before the second pick | the cell background `colors.neutral.100` |
| Outside month | Days of the previous or next month | text `colors.neutral.700`, regular weight |
| Disabled | Outside `minDate`–`maxDate`, or `getDayProps` | text `colors.neutral.300`, not clickable; the today bar turns `colors.neutral.300` |

Navigation, measured:

- Moving focus past the last or first day of the month shows the next or previous month (`Calendar`: Arrow Right on 30 November showed December). In `DualCalendar`, focus moves from the left month to the right one.
- Arrow keys stop at `minDate` and `maxDate`; the previous or next month button is disabled when that month is out of range.
- The month and year menus are not limited by `minDate`/`maxDate`: choosing January 2026 with `minDate` 5 November 2026 showed a month of disabled days. The year menu lists 2000–2050 whatever the limits.
- Picking a day does not move the view or close anything; in the pickers the popover stays open too.

Sizes, measured with `size="responsive"`: day cells 32px with 11px text at 1024px, 36px with 13px at 1280px, 40px with 15px at 1920px; `CalendarWrapper` padding 6, 8 and 12px.

## Accessibility

### Keyboard

- Tab reaches the month and year buttons, the previous and next buttons (when enabled), then one day: the selected day, else today (roving tab index).
- Arrow keys move by day and by week, skipping disabled days (docs; measured). Page Up, Page Down, Home and End do nothing (measured in DatePicker).
- Enter or Space picks the focused day (measured).
- Month and year buttons: Enter opens the menu with focus on the current item; arrow keys move; Enter picks and returns focus to the button (measured).

### Accessible name

- The grid is a `<table>` with `<th>` weekday headers; there is no `role="grid"`. The headers are single letters ("S", "M", "T"…) with no `abbr`, so Sunday and Saturday, Tuesday and Thursday are read the same.
- Day buttons are named with the full date ("19 November 2026"). Today has only `data-today`, and the selected day only `data-selected`: neither has `aria-current` or `aria-selected` (measured).
- The month and year buttons have `aria-haspopup` and `aria-expanded` and are named by their text ("NOVEMBER", "2026") only. Their menus are `role="menu"` with no name; the current month is marked in the menu.
- The calendar itself has no name; on the page, give it a heading or `aria-label` on a wrapping element.

### Focus

`isFocusOnMounted` (set by the pickers) moves focus into the grid when the calendar appears. On the page, focus stays where it was until the user tabs in.

### Contrast pairs

Ratios on white from [Color](../foundations/color.md); disabled days are exempt from contrast requirements.

| Foreground token | Background token | Min ratio |
|---|---|---|
| `colors.neutral.900` (days) | `colors.white` | 4.5 |
| `colors.primary.600` (today) | `colors.white` | 4.5 |
| `colors.white` (selected) | `colors.primary.600` | 4.5 |
| `colors.neutral.700` (outside days) | `colors.white` | 4.5 |
| `colors.neutral.600` (weekday headers) | `colors.white` | 4.5 |
| `colors.neutral.900` (in range) | `colors.primary.100` | 4.5 |

## Content

- Month and year in the header are uppercase ("NOVEMBER"); weekday headers are one letter.
- `renderHelperTextDay`: keep it to a short value or a small `Tag`, as in the docs' example; it must fit under the number at every size.

## Do and don't

| Don't | Do |
|---|---|
| `Calendar` plus `Input` for a form field | The matching picker |
| A calendar on the page with no heading | A heading or `aria-label` naming what the dates are for |
| Rely on `minDate`/`maxDate` to limit the year menu | Set `yearRange` to the same years |
| Set `isDualMode`, `__handlerRef` and the other internal props | Only the documented props |
| Raw shadows or padding around a page calendar | `CalendarWrapper size="responsive"` |

## Component tokens

## Figma to code mapping

Figma page "Calendar - Updating": sets "Calendar" (`4143:177392`), "Calendar with shortcut" (`61539:112864`), "Customized calendar" (`29542:9542`), "Date item-Ver 1.0.0" (`3270:68725`), "Date with additional item-Ver 1.0.0" (`3289:67251`), "Weekday item" (`3284:68044`), "Month select item" (`3286:67163`), "Year select item" (`3286:67330`), "Month and year picker" (`59348:322909`), "Week menu" (`59348:331490`), "Month menu" (`81160:88173`), "Month item-Ver 1.0.0" (`81160:87596`), "Quarter menu" (`58939:80601`), "Quarter item-Ver 1.0.0" (`58931:80291`). Usage documentation: frame "Calendar-Document-Overview" (`27344:47749`). Read on 2026-11-10.

| Figma property | Figma value | Code | Code value |
|---|---|---|---|
| Calendar · Type | Default / Dual / Week select | component | `Calendar` / `DualCalendar` / `WeekCalendar` |
| Calendar · Time | True | component | `DateTimeCalendar` |
| Calendar · Size, item · Size | Large / Medium / Small | `size` | `"lg"` / `"md"` / `"sm"`; `"responsive"` in product screens |
| Calendar with shortcut | — | `calendarHeaderContent` | `Shortcut` items |
| Date with additional item | — | `renderHelperTextDay` | content under the number |
| Date item · Type of day | This month / Pre/Next-Month / Today | — | default, `data-outside`, `data-today` |
| Date item · Type of day | In range / Start range / End range / Anticipated | — | range states (`data-in-range`, `data-first-in-range`, `data-last-in-range`, draft range) |
| Date item · State | Enable / Hover / Focus / Pressed / Disable | — | Interaction states; Disable = `minDate`/`maxDate` or `getDayProps` |
| Date item · Selected | True | `date` | the selected day |
| Weekday item · Type | Minimum / Abbreviation / Full | — | the code renders Minimum (one letter) only |
| Month menu, Quarter menu · Type | Default / Dual | component | `MonthCalendar` / `MonthRangeCalendar`; `QuarterlyCalendar` / `QuarterlyRangeCalendar` |

## Open questions

1. The Why this design section is empty: the docs give no rationale (as with the other notes, [known issues](../reports/known-issues-2026-11-10.md) Q1).
2. Upstream, for the Magenta team: weekday headers are single letters with no `abbr`; today and the selected day have no `aria-current`/`aria-selected`; the month and year menus ignore `minDate`/`maxDate`; the calendar has no accessible name; internal props (`__handlerRef`, `isDualMode`, …) are in the public types; `CalendarWrapper` accepts no `className` or attributes.
3. Contracts: `contracts/CalendarWrapper.json` lists no props because its props type is written inline; `scripts/build-contracts.mjs` should read inline prop types.
4. Figma's Weekday item has Abbreviation and Full types that the code cannot render. Is a longer weekday header planned?

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-11-10 from contracts/Calendar.json, contracts/DualCalendar.json, contracts/CalendarWrapper.json and the other calendar contracts (scripts/build-contracts.mjs); CalendarWrapper props read from its source. Styles read from the date and calendarWrapper recipes. Replaced by build/meta in phase 3. -->

### Props

`Calendar` (also accepts the attributes of `<div>`; internal props starting with `__` or `is` left out)

| Prop | Type | Default | Description |
|---|---|---|---|
| `date` | `Date \| null` | | The currently selected date. |
| `defaultDate` | `Date \| null` | | The default date to be displayed when no date is selected. |
| `onDateChange` | `(value: DatePickerValue \| null) => void` | | Callback triggered when the selected date changes. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'responsive'` | `lg` | The size of the calendar component. |
| `minDate` | `Date` | | The minimum selectable date. |
| `maxDate` | `Date` | | The maximum selectable date. |
| `month` | `number` | | The currently displayed month (0-based index). |
| `year` | `number` | | The currently displayed year. |
| `initialMonth` | `number` | | The initial month to display when the calendar is first rendered. |
| `initialYear` | `number` | | The initial year to display when the calendar is first rendered. |
| `onMonthChange` | `(month: number) => void` | | Callback triggered when the displayed month changes. |
| `onYearChange` | `(year: number) => void` | | Callback triggered when the displayed year changes. |
| `onPreviousClick` | `(year: number, month: number) => void` | | Callback triggered when the "previous" button is clicked. |
| `onNextClick` | `(year: number, month: number) => void` | | Callback triggered when the "next" button is clicked. |
| `hideOutside` | `boolean` | | Whether to hide days that fall outside the current month. |
| `consistentWeeks` | `boolean \| undefined` | `false` | Whether the Calendar always displays 6 rows. |
| `getDayProps` | `(date: Date) => Omit<Partial<DateProps>, …>` | | Function to retrieve properties for a specific day. |
| `renderHelperTextDay` | `(date: Date) => React.ReactNode` | | Function to render helper text for a specific day. |
| `calendarHeaderContent` | `React.ReactNode` | | The content to be displayed in the calendar header. |
| `calendarFooterContent` | `React.ReactNode` | | The content to be displayed in the calendar footer. |
| `disableTabEntry` | `boolean` | `false` | When `true`, every day button renders with `tabIndex={-1}`. |
| `onFocusEscapeStart`, `onFocusEscapeEnd` | `(date: Date) => void` | | In dual calendar mode: arrow-key navigation leaving the month. |

`DualCalendar` (and `SingleDateRangeCalendar`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `date` | `DatesRangeValue \| null` | | The currently selected date range value. |
| `defaultDate` | `DatesRangeValue` | | The default date range value. |
| `onDateChange` | `((value: DatesRangeValue \| null) => void) \| undefined` | | Callback function triggered when the date range value changes. |
| `startViewDate` | `Date` | | The date to start the view from. |
| `enableLayoutResponsive` | `boolean` | `false` | Whether to enable responsive layout behavior. |
| `size`, `minDate`, `maxDate`, `renderHelperTextDay`, `calendarHeaderContent`, `calendarFooterContent` | | | As in `Calendar`. `SingleDateRangeCalendar` also takes `yearRange`. |

`MonthCalendar` (`month`, `defaultMonth`, `onMonthChange`, `getMonthProps`), `QuarterlyCalendar` (`quarter`, `defaultQuarter`, `onQuarterChange`, `getQuarterProps`), `WeekCalendar` (`week`, `defaultWeek`, `onWeekChange`, `weekType` default `sale`, `cylinderWeekTitle` default `WEEK`, `WeekCylinderProps`) and `DateTimeCalendar` (`calendarRef`, `timeContainerRef`, `enableLayoutResponsive`, `scrollIntoView`) follow the same pattern; see their contracts.

`CalendarWrapper`

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg' \| 'responsive'` | `lg` | |
| `children` | `React.ReactNode` | | |

### Styles

| Slot | Styles |
|---|---|
| calendarWrapper `base` | `colors.white`, padding `spacing.12`, `radii.lg`, `shadows.lg`, fit-content; `size`: `sm` `spacing.6`, `md` `spacing.8`, `lg` `spacing.12`, `responsive` 6 → 8 from `xl` → 12 from `3xl` |
| date `base` | min 40 × 40, padding `spacing.8`, `fontSizes.md`, `colors.neutral.900`, `radii.md`, semibold; hover `colors.primary.100`; focus-visible inset `borders.2` `colors.primary.300`; active `colors.primary.300`; disabled `colors.neutral.300` |
| date · `selected` | `colors.primary.600`, `colors.white`; hover `colors.primary.400`; active `colors.primary.700` |
| date · `today` | `colors.primary.600` text; bar 24 × 2, `radii.full`, `colors.primary.600` |
| date · `outside` | regular weight, `colors.neutral.700` |
| date · `inRange` / `inDraftRange` | wrapper `colors.primary.100` (hover `colors.primary.200`) / `colors.neutral.100` |
| date · `size` | `sm` 32, `fontSizes.xs`; `md` 36, `fontSizes.sm`; `lg` 40, `fontSizes.md`; `responsive` sm → md from `xl` → lg from `3xl` |
| weekdaysRow | `colors.neutral.600` |
| calendarHeader | bottom border 1px `colors.neutral.200` |

Stories: `packages/docs/stories/Dates/Calendars`.
<!-- GENERATED:END -->
