---
type: component
component: "MonthPicker"
description: "A month field (YYYY-MM) typed or picked from a month calendar; MonthRangePicker takes a start and an end month."
category: inputs
status: draft
figma_url: "https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=81145-63428"
alternatives:
  - DatePicker
  - DateRangePicker
  - QuarterlyPicker
  - WeekPicker
related:
  - MonthRangePicker
  - MonthCalendar
  - MonthRangeCalendar
  - Input
  - HelperText
can_contain: []
cannot_contain: []
required_children: []
a11y_role: textbox
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/docs/stories/Dates/MonthPicker/Design.mdx
  - packages/docs/stories/Dates/MonthPicker/Code.mdx
  - packages/docs/stories/Dates/MonthRangePicker/Design.mdx
  - packages/docs/stories/Dates/MonthRangePicker/Code.mdx
  - packages/react-dates/src/components/MonthPicker/MonthPicker.tsx
  - packages/react-dates/src/components/MonthPicker/MonthPicker.model.ts
  - packages/react-dates/src/components/MonthRangePicker/MonthRangePicker.tsx
  - packages/react-dates/src/components/atoms/MonthRangeInput/MonthRangeInput.tsx
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# MonthPicker

## Overview

`MonthPicker` is a masked field for one month (`YYYY-MM`). The user types it or opens a month calendar (a year header and a grid of 12 months) with the calendar trigger. `MonthRangePicker` has a start and an end month field and a calendar with two consecutive years. Both come from `@ocean-network-express/magenta-react-dates`. The value is a `Date` on the first day of the month, for the start and for the end of a range.

## When to use

From the docs and the Figma documentation frames:

- The task is about a whole month, not a day (a billing month, a report month).
- `MonthRangePicker`: a period of whole months (a contract period from one month to another).

## When not to use

- A specific day: `DatePicker`; a range of days: `DateRangePicker`.
- A quarter or a week: `QuarterlyPicker` or `WeekPicker`.

## Why this design

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| One month | `MonthPicker` | `DatePicker` with day 1 |
| A range of months | `MonthRangePicker` | Two `MonthPicker`s |
| A range of days | `DateRangePicker` | `MonthRangePicker` |
| A quarter or a range of quarters | `QuarterlyPicker`, `QuarterlyRangePicker` | `MonthRangePicker` |

## Anatomy

From the docs (numbers as in the docs' anatomy images):

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Input field (range: input container with a start and an end field) | yes | Masked `YYYY-MM`. |
| 2 | Calendar trigger | yes | Icon button (`CalendarOutline`). A 1px `colors.neutral.300` divider on its left, as in all date pickers (`dateTimeInput` recipe). |
| 3 | Label | yes in product screens | `label`. |
| 4 | Calendar | yes | `MonthPicker`: a year header with previous and next year buttons, and 12 months in 4 columns. `MonthRangePicker`: two consecutive years. |
| 5 | Clear button | no | `clearable`. |
| 6 | Helper text | no | `helperText`, inline or tooltip. |

For the calendar's own states, tokens and keyboard, see the [Calendar note](calendar.md).

## Composition

- Import from `@ocean-network-express/magenta-react-dates`. Pass `size="responsive"`. `MonthPicker` takes the `Input` props (`label`, `size`, `helperText`, `state`, `required`, `fullWidth`…), so they are not in its own props table.
- Value: `MonthPicker` takes `value`/`defaultValue` as a `Date` (or `null`); `MonthRangePicker` takes `[start, end]`. Each is the first day of its month (measured: picking April 2027 as the end gives 2027-04-01). For an inclusive period, compute the end of the end month yourself.
- `onChange` takes two arguments, unlike `DatePicker`: `MonthPicker` `onChange(value, options)` and `MonthRangePicker` `onChange(value, options)`, with `options.inputValue`, `options.isDateValid` and `options.rawValue`.
- Range: `minDate` and `maxDate` disable months outside them in the calendar and revert typed months on blur (docs). Combine with `CalendarProps.yearRange` (default 2000–2050) so the year navigation stays in range.
- `MonthRangePicker`: `autoSort` (default `true`) puts the earlier month first. The `mode` prop in its types has no effect: the calendar always shows two years (code; measured), and `mode` reaches the DOM as an unknown attribute. Do not pass it.
- Label on `MonthRangePicker`: `label` names the start input; the end input has a fixed `aria-label` ("date range picker end date") that `endInputProps` cannot replace. Name it with `aria-labelledby` through `endInputProps`, as in the [DateRangePicker note](date-range-picker.md).
- `MonthCalendarProps` and `MonthRangeCalendarProps` are deprecated: use `CalendarProps`.
- `selectModeOnly`: typing off; not with `readOnly` (docs: a type error).

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| Closed | Default; focus on the input | The calendar does not open on focus (measured; matches Figma). |
| Open | Calendar trigger | Measured with no value: shows the current year and focuses its first enabled month (January 2026), not the current month. |
| Picked | Click or Enter on a month | The input and `onChange` update; the calendar stays open (measured). |
| Range picked | `MonthRangePicker`: two clicks | First click: start, end empty. A second click before the start becomes the start (measured: Aug then Mar gave 2026-03 ~ 2026-08). A click after a full range starts a new one (measured). Matches Figma. |
| Corrected on blur | Typing, `transformInvalidValue` | Measured: `2025` → `2025-01`; `2025-44` → `2025-12`. Docs: `2025-4` → `2025-04`, `2025-00` → `2025-01`. |
| Reverted on blur | `fixOnBlur` | Docs: a year under 1000 (`5`, `202`) or with a leading zero (`0123`) reverts to the previous value or placeholder; a month outside `minDate`–`maxDate` reverts. Not measured (the mask mixed the typed digits with the previous value). |
| Error / warning / success | `state` | With `helperText`. |

These correction rules differ from `DatePicker`, which lets dayjs carry an overflowing month into the next year (`2025-13-01` → `2026-01-01`); `MonthPicker` clamps it to December.

Sizes, measured with `size="responsive"`: the field is 32px high with 11px text at 1024px, 36px with 13px at 1280px, 40px with 15px at 1920px; month cells are 32, 36 and 40px high. Without `size` the field is 40px (`lg`), as the docs say.

## Accessibility

### Keyboard

- In the input, Arrow Left and Right move between the year and month parts (docs).
- Enter or Space on the trigger opens the calendar; Escape closes it.
- In the calendar, arrow keys move between months in the 4-column grid (measured: Arrow Right then Arrow Down went from January to June). Enter picks.

### Accessible name

- `MonthPicker`'s input is named by `label`. `MonthRangePicker`'s start input is named by `label`; the end input's fixed name is "date range picker end date".
- Month buttons are named with the full month and year ("June 2026"); the year navigation buttons "previous year" and "next year". The trigger is "calendar-trigger"; the popover a `role="dialog"` with no name.
- In a range, the selected months are marked with `data-*` attributes only, not `aria-selected` (measured).

### Focus

Opening moves focus into the month grid (measured: January). Escape closes the calendar; the shared picker code then returns focus to the trigger, as measured in DatePicker.

### Contrast pairs

The field uses the same pairs as [Input](input.md). The calendar's pairs are in the [Calendar note](calendar.md).

## Content

- Label: name the month or period ("Billing month", "Contract period").
- Helper text: the allowed range when there is one.

## Do and don't

| Don't | Do |
|---|---|
| `size` left out | `size="responsive"` |
| Treat the end value as the end of the period | Add a month and subtract a day (or use end-of-month) |
| `mode="single"` on `MonthRangePicker` | Nothing: the range calendar is always two years |
| `DatePicker` for a billing month | `MonthPicker` |
| Rely on `label` for the range's end input | `aria-labelledby` through `endInputProps` |

## Component tokens

## Figma to code mapping

Figma page "Date & Time Picker": sets "Month Picker" (`81160:70479`) and "Month-Range-Picker" (`81160:70325`). Calendar parts on the "Calendar - Updating" page: "Month menu" (`81160:88173`, Type Default / Dual), "Month item-Ver 1.0.0" (`81160:87596`), "Month and year picker" (`59348:322909`). Usage documentation: frames "Month Picker-Document-Overview" (`81145:63428`) and "Month Range Pickers-Document-Overview" (`81249:94061`). Read on 2026-11-10.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| Size | Large / Medium / Small | `size` | `"lg"` / `"md"` / `"sm"`; `"responsive"` in product screens |
| State | Enable / Hover / Focus / Active / Filled / Filled-hover / Filled-focus | — | Interaction states and a value |
| State | Error | `state` | `"error"` |
| State | Disable | `disabled` | `true` |
| State | Read-only | `readOnly` | `true` |
| Calendar | True | `open` (or a trigger click) | `true` |
| Show label, Show helper text, Helper text, Error message | — | `label`, `helperText` | text |
| Month menu · Type | Default / Dual | — | `MonthPicker` / `MonthRangePicker` |
| Month item · Type of Month | Start range / In range / End range / Anticipated | — | Range states in the calendar |
| — | — | `state` | `"warning"`, `"success"` (not in the sets) |

## Open questions

1. The Why this design section is empty: the docs give no rationale (as with the other notes, [known issues](../reports/known-issues-2026-11-10.md) Q1).
2. Upstream, for the Magenta team: `MonthRangePicker`'s types include `mode`, which the component ignores and passes to the DOM; its end input has a fixed `aria-label` that hides `label`; `MonthPicker`'s JSDoc is copied from the week picker ("WeekInput", "week numbers 1-52"); the calendar focuses January instead of the selected or current month; selected months have no `aria-selected`. Also as in the other pickers: trigger named "calendar-trigger", unnamed dialog.
3. The range end is the first day of the end month. Is that intended, or should the end be the last day? Products filtering by period need to know.

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-11-10 from contracts/MonthPicker.json, contracts/MonthRangePicker.json (scripts/build-contracts.mjs). Replaced by build/meta in phase 3. -->

### Props

`MonthPicker` (also accepts the props of `Input`, such as `label`, `size`, `helperText`, `state`, `required`, `fullWidth`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `DateValue` | | The value of the month picker input. |
| `defaultValue` | `DateValue` | | Default value. |
| `onChange` | `(value: DateValue, options?: MonthPickerOnChangeOptions) => void` | | Callback fired when the value of the month picker input changes. |
| `inputValue` | `string` | | The input value to display in the input field. |
| `onInputValueChange` | `(value: string) => void` | | Called when the input value changes. |
| `minDate` | `Date` | | The minimum date that can be selected. |
| `maxDate` | `Date` | | The maximum date that can be selected. |
| `clearable` | `boolean` | `false` | Show a clear icon when the input has a value. |
| `fixOnBlur` | `boolean` | `true` | Revert to last valid or clear if invalid. |
| `transformInvalidValue` | `boolean` | `true` | Transform invalid input to the nearest valid month. |
| `selectModeOnly` | `false \| undefined` | `false` | |
| `readOnlyInput` | `boolean` | `false` | If `true`, the input field will be read-only when selectModeOnly is enabled. |
| `disabledInput` | `boolean` | | If `true`, **ONLY** the input component is disabled. |
| `readOnly` | `boolean \| undefined` | | |
| `loading` | `boolean` | | If `true`, the calendar trigger button will show a loading spinner. |
| `icon` | `React.ReactNode` | `<CalendarOutline/>` | The icon to display in the input field. |
| `labelPrefix` | `React.ReactNode` | | Content displayed before the label. |
| `labelSuffix` | `React.ReactNode` | | Content displayed after the label. |
| `renderHelperType` | `InputProps['renderHelperType']` | | How to render the helper text (inline or as a tooltip). |
| `open` | `boolean` | | If `true`, the dropdown Calendar is open. |
| `onOpenChange` | `(value: boolean, event?: Event, reason?: OpenChangeReason) => void` | | Callback function to be called when the open state changes. |
| `onIconClick` | `(event: React.MouseEvent<HTMLButtonElement>) => void` | | Called when the calendar icon is clicked. |
| `ignoreOutsideRefs` | `React.MutableRefObject<HTMLElement \| null>[]` | | Refs to elements that should not trigger outside press events. |
| `dropdownConfig` | `PopoverProps['dropdownConfig']` | | Dropdown configuration for the picker popover. |
| `CalendarProps` | `MonthCalendarProps` | | Custom properties for the MonthCalendar component. |
| `MonthCalendarProps` | `MonthCalendarProps` | | Deprecated; use `CalendarProps` |

`MonthRangePicker` (also accepts the attributes of `<div>`): the same props as `DateRangePicker` ([DateRangePicker note](date-range-picker.md)), with these differences:

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `DatesRangeValue` | | The current value of the month range picker (start and end month). |
| `onChange` | `(value: DatesRangeValue, options?: MonthRangePickerOnChangeOptions) => void` | | Callback triggered when the month range value changes. |
| `valueFormat` | `string` | `YYYY-MM` | Format string for the range value. |
| `startDatePlaceholder`, `endDatePlaceholder` | `string` | `YYYY-MM` | Placeholders. |
| `CalendarProps` | `MonthRangeCalendarProps` | | Custom properties for the MonthRangeCalendar component. |
| `MonthRangeCalendarProps` | `MonthRangeCalendarProps` | | Deprecated; use `CalendarProps` |
| `mode` | `'single' \| 'dual'` | | In the types; ignored by the component. |

### Styles

`MonthPicker`: the `dateTimeInput` recipe. `MonthRangePicker`: the `datePicker` and `timeSelect` recipes.

| Slot | Styles |
|---|---|
| dateTimeInput `iconButton` | left border 1px `colors.neutral.300` (written as a raw `1px` and `var(--mag-colors-neutral-300)`); left corners square |
| datePicker `base` · `fullWidth` | `true`: width 100%; `false`: width `fit-content`, max width 100% |

Stories: `packages/docs/stories/Dates/MonthPicker`, `packages/docs/stories/Dates/MonthRangePicker`.
<!-- GENERATED:END -->
