---
type: component
component: "DateRangePicker"
description: "Two date fields for a start and an end date, typed or picked from a dual (or single) calendar."
category: inputs
status: draft
figma_url: "https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=28123-611981"
alternatives:
  - DatePicker
  - MonthRangePicker
  - QuarterlyRangePicker
  - WeekPicker
related:
  - DualCalendar
  - SingleDateRangeCalendar
  - Shortcut
  - Button
  - HelperText
can_contain: []
cannot_contain: []
required_children: []
a11y_role: textbox
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/docs/stories/Dates/DateRangePicker/Design.mdx
  - packages/docs/stories/Dates/DateRangePicker/Code.mdx
  - packages/docs/stories/Dates/DateRangePicker/Props.mdx
  - packages/docs/stories/Dates/DateRangePicker/Examples
  - packages/react-dates/src/components/DateRangePicker/DateRangePicker.tsx
  - packages/react-dates/src/components/atoms/DateRangeInput/DateRangeInput.tsx
  - packages/react-dates/src/components/atoms/DateRangeInput/DateRangeInputField.tsx
  - packages/react-dates/src/components/atoms/DateRangeInput/DateRangeInputWrapper.tsx
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# DateRangePicker

## Overview

One field with two masked inputs, a start date and an end date, joined by a range icon (`~` by default). The user types both dates or opens a calendar with the calendar trigger and picks the two ends of the range. The calendar shows two consecutive months (`mode="dual"`, default) or one (`mode="single"`). From `@ocean-network-express/magenta-react-dates`.

## When to use

From the docs and the Figma documentation frame:

- The user must enter a period with a start and an end date (a sailing window, a report period).
- Preset shortcuts (such as "Today", "-1 week", "-30 days") help when users often pick the same relative periods.
- `mode="single"`: compact layouts and simpler ranges; same interaction as the dual calendar (docs).

## When not to use

- One date: use `DatePicker` ([DatePicker note](date-picker.md)).
- A range of months or quarters: use `MonthRangePicker` or `QuarterlyRangePicker`.
- Preset shortcuts, from the docs: not when users need irregular ranges, not when the context needs fixed, non-relative dates, and not with too many presets (fewer than 6; with more, use a `Select`).

## Why this design

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| A start and an end date | `DateRangePicker` | Two `DatePicker`s |
| One date | `DatePicker` | `DateRangePicker` |
| A range of months or quarters | `MonthRangePicker`, `QuarterlyRangePicker` | `DateRangePicker` |
| A few common relative periods | `DateRangePicker` with preset shortcuts | A separate `Segmented` above the field |
| Six or more preset periods | `Select` | Shortcuts in the calendar header |

## Anatomy

From the docs (numbers as in the docs' anatomy image):

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Input container | yes | One bordered field holding both inputs. |
| 2 | Start date field | yes | A masked input, placeholder `startDatePlaceholder`. |
| 3 | End date field | yes | A masked input, placeholder `endDatePlaceholder`. Between the two: `rangeIcon` (`~` by default). |
| 4 | Label | yes in product screens | `label`; linked to the start input only (see Accessibility). |
| 5 | Calendar trigger | yes | Icon button at the end (`CalendarOutline`). A 1px `colors.neutral.300` divider on its left separates it from the input, and its left corners are square (`dateTimeInput` recipe, `iconButton` slot; measured). |
| 6 | Dual calendar | yes | Two consecutive months (`DualCalendar`), or one with `mode="single"` (`SingleDateRangeCalendar`). |
| 7 | Clear button | no | `clearable`; clears both dates. |
| 8 | Helper text | no | `helperText`, inline or tooltip (`renderHelperType`). |

Optional calendar slots: `CalendarProps.calendarHeaderContent` (preset shortcuts) and `CalendarProps.calendarFooterContent` (Apply and Reset actions).

For the calendar's own states, tokens and keyboard, see the [Calendar note](calendar.md).

## Composition

- Import from `@ocean-network-express/magenta-react-dates`. Pass `size="responsive"`; the calendar follows the field's size.
- Value: `[start, end]` (`DatesRangeValue`, each a `Date` or `null`). Controlled with `value` and `onChange`, or uncontrolled with `defaultValue`. `value={null}` means both empty.
- `onChange(value, inputValue, isDateValid, options)`: read `options.inputValue` (`{ start, end }` strings), `options.isDateValid` (`{ start, end }`) and `options.rawValue`; the second and third arguments are deprecated. `onChange` fires after each pick: first with `[start, null]`, then with the full range.
- Range limits: `minDate` and `maxDate`; say the range in `helperText` (Figma recommends inline helper text for the range).
- Order: `autoSort` (default `true`) swaps a typed end date that is before the start date. With `autoSort={false}` the reversed range stays as typed.
- Validation: `state="error"` with the message in `helperText`. Figma says to show one cross-field message ("Start date must be before End date") rather than one per input, and only the most obvious error per pair.
- Label: `label` names the start input only, and both inputs carry a fixed `aria-label` that hides it (see Accessibility). Until fixed upstream, name the inputs with `aria-labelledby` through `startInputProps` and `endInputProps`, as the prototype does:

  ```tsx
  <DateRangePicker
    size="responsive"
    label={<span id="sailing-label">Sailing window</span>}
    startInputProps={{ 'aria-labelledby': 'sailing-label sailing-start' }}
    endInputProps={{ 'aria-labelledby': 'sailing-label sailing-end' }}
  />
  <span id="sailing-start" className={css({ srOnly: true })}>start date</span>
  <span id="sailing-end" className={css({ srOnly: true })}>end date</span>
  ```

- Preset shortcuts: put `Shortcut` items in `CalendarProps.calendarHeaderContent`, as in the "Preset Shortcuts" story; set the value from `onClick`, and mark the active preset with `color="primary"`. Pass `type="button"` to each `Shortcut`: it renders `type="submit"` by default and would submit a surrounding form (measured; see the [Shortcut note](shortcut.md)).
- Apply and Reset: put a ghost `Button` with `type="button"` in `CalendarProps.calendarFooterContent`. The story only has Reset. Figma describes Apply to confirm and Reset to clear; Magenta has no built-in Apply flow, so a confirm step needs a controlled `open` and a draft value (not in the docs).
- `selectModeOnly`: typing is off and the field opens the calendar. It cannot be combined with `readOnly` (docs: a type error).
- The top-level `calendarHeaderContent`, `calendarFooterContent` and `DualCalendarProps` are deprecated: use `CalendarProps` (code).

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| Closed | Default; focus or typing in an input | The calendar does not open on focus (code; matches Figma). |
| Open | Calendar trigger; with `selectModeOnly`, the field | Two months from the start date's month (or today's); focus moves to the start date or today. |
| Start picked | First click on a day | Start input filled, end empty; `onChange([start, null])`. |
| Range picked | Second click on a later day | Both filled; days between are highlighted. |
| Range picked backwards | Second click on an earlier day | That day becomes the start and the first pick the end (measured; matches Figma). |
| Range reset | A click after a full range is set | Starts a new range from that day (measured; matches Figma). |
| Still open | After a full range | The calendar stays open; it closes on Escape, the trigger or a click outside (measured). |
| Typed | Typing in an input | Separators are inserted; at the end of the start input, typing does not move on to the end input; Tab or Arrow Right does. |
| Sorted on blur | End date before start date, `autoSort` true | The two dates swap (measured: 2026-12-20 ~ 2026-12-05 became 2026-12-05 ~ 2026-12-20). |
| Corrected / reverted on blur | `transformInvalidValue`, `fixOnBlur` (both `true`) | As in DatePicker: dayjs fills and corrects; a date outside `minDate`–`maxDate` reverts to the last valid value (measured). |
| Error / warning / success | `state` | With `helperText`. |
| Read-only, disabled, loading | `readOnly`, `disabled`, `loading` | `disabledInput` disables only the inputs. |

Sizes, measured with `size="responsive"`: the field and the day cells are 32px high with 11px text at 1024px, 36px with 13px text at 1280px, 40px with 15px text at 1920px, as the docs give. The dual calendar was 546px wide at 1024px.

## Accessibility

### Keyboard

- Tab order: start input, end input, clear button (when shown), calendar trigger (measured).
- In an input, Arrow Left and Right move between the year, month and day parts, and past the last part to the other input (docs; code). Measured: Arrow Right at the end of the start input moves to the end input.
- Enter or Space on the trigger opens the calendar; Escape closes it and returns focus to the trigger (measured).
- In the calendar, arrow keys move by day and week (docs, as in DatePicker); Enter picks.

### Accessible name

- The `<label>` is linked to the start input only (`for`), and both inputs have a fixed `aria-label` ("date range picker input start date", "date range picker input end date"), which takes precedence over the label. A screen reader hears the same generic names for every range field on the page; the `label` text is not read (code; measured attributes).
- `startInputProps`/`endInputProps` are spread before the fixed `aria-label`, so they cannot replace it; `aria-labelledby` set through them takes precedence over `aria-label` by the accessible-name rules (workaround in Composition). The attributes reach the inputs (measured); not yet checked with a screen reader.
- The calendar trigger is named "calendar-trigger"; the clear button "clear all dates". The popover is a `role="dialog"` with no name.
- Day buttons are named with the full date. The range ends and the days in between are marked only with `data-*` attributes, not `aria-selected` (measured).
- With `selectModeOnly`, the wrapper has `role="button"` with no name, around the inputs (measured).

### Focus

Opening moves focus into the calendar; Escape returns it to the trigger. Picking days leaves focus in the calendar.

### Contrast pairs

The field uses the same pairs as [Input](input.md). The calendar's pairs are in the [Calendar note](calendar.md).

## Content

- Label: name the period ("Sailing window", "Report period").
- Helper text: the allowed range; one cross-field error message for the pair (Figma).
- Preset labels: short relative periods ("Today", "-1 week", "-30 days" in the docs).

## Do and don't

| Don't | Do |
|---|---|
| `size` left out | `size="responsive"` |
| Rely on `label` alone for the input names | `label` plus `aria-labelledby` on both inputs |
| Two `DatePicker`s for a start and end | One `DateRangePicker` |
| One error per input for an inverted range | One message: "Start date must be before End date" |
| `Shortcut` presets inside a form without `type` | `type="button"` on each preset |
| Six or more presets | A `Select` of periods |
| `selectModeOnly` with `readOnly` | One or the other |

## Component tokens

## Figma to code mapping

Figma page "Date & Time Picker": set "Date-Range-Picker" (`27497:152993`), built on "Date-Time-Field-Base" (`925:17721`, Type = Date Range). Usage documentation: frame "Date Range Picker-Document-Overview" (`28123:611981`). Read on 2026-11-10.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| Size | Large / Medium / Small | `size` | `"lg"` / `"md"` / `"sm"`; `"responsive"` in product screens |
| State | Enable / Hover / Focus / Active / Filled / Filled-hover / Filled-focus | — | Interaction states and a value |
| State | Error | `state` | `"error"` |
| State | Disable | `disabled` | `true` |
| State | Read-only | `readOnly` | `true` |
| Calendar | True | `open` (or a trigger click) | `true` |
| Show label | true | `label` | text |
| Show helper text, Helper text | true, text | `helperText` | text |
| Error message | text | `helperText` with `state="error"` | text |
| Date-Time-Field-Base · Start date, End date | text | `value` | `[start, end]` |
| Date-Time-Field-Base · Closable | true | `clearable` | `true` |
| — (doc frame shows warning and success messages) | — | `state` | `"warning"`, `"success"` |
| — | — | `mode`, `autoSort`, `selectModeOnly`, `loading`, `rangeIcon` | not in the set |

## Open questions

1. The Why this design section is empty: the docs give no rationale (as with the other notes, [known issues](../reports/known-issues-2026-11-10.md) Q1).
2. Upstream, for the Magenta team: the fixed `aria-label` on both inputs hides `label`, and the label is linked to the start input only; `startInputProps` cannot override it. Suggested: name the inputs from the label plus "start date"/"end date". Also as in DatePicker: trigger named "calendar-trigger" without `aria-expanded`, unnamed dialog, range days without `aria-selected`; the `selectModeOnly` wrapper is an unnamed `role="button"` around textboxes. The trigger divider in the `dateTimeInput` recipe is written as `1px solid var(--mag-colors-neutral-300)` instead of `token(borders.1)` and `token(colors.neutral.300)`; the contracts miss this recipe because the component file does not import it directly.
3. Upstream: the JSDoc example in `DateRangePicker.tsx` uses props that do not exist (`startDate`, `endDate`, `onDatesChange`).
4. For the design team: the Figma anatomy text says the end field allows "start date" (typo); the Date-Range-Picker set has no Warning, Success or Loading state, no single-calendar option and no preset or Apply/Reset slots, although the doc frame shows them.
5. Apply & Reset: Figma and the Design docs describe an Apply action that confirms the range; the code and stories only show Reset, and picks apply at once. Should products add Apply, and how? Needs the team.

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- The dateTimeInput row was added by hand on 2026-11-10 (the contract does not list that recipe). Generated 2026-11-10 from contracts/DateRangePicker.json (scripts/build-contracts.mjs). Styles read from the datePicker and timeSelect recipes. Replaced by build/meta in phase 3. -->

### Props

`DateRangePicker` (also accepts the attributes of `<div>`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `DatesRangeValue \| null` | | The current value of the date range picker. |
| `defaultValue` | `DatesRangeValue` | | The default value for the date range picker. |
| `onChange` | `(value, inputValue, isDateValid, options) => void` | | Callback triggered when the date range value changes. The second and third arguments are deprecated. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'responsive'` | | Size of the date range picker. |
| `mode` | `'single' \| 'dual'` | `dual` | Determines the calendar display mode for the date range picker. |
| `autoSort` | `boolean` | `true` | Automatically sorts the date range to ensure the start date is before the end date. |
| `label` | `React.ReactNode` | | Label for the date range picker. |
| `labelPrefix` | `React.ReactNode` | | Content displayed before the label. |
| `labelSuffix` | `React.ReactNode` | | Content displayed after the label. |
| `required` | `boolean` | | Marks the date range picker as required. |
| `helperText` | `React.ReactNode` | | Helper text displayed below the date range picker. |
| `renderHelperType` | `'inline' \| 'tooltip'` | | Determines how helper text is displayed, either inline or as a tooltip. |
| `state` | `'error' \| 'warning' \| 'success'` | | State of the date range picker, used for validation feedback. |
| `clearable` | `boolean` | `false` | Determines if the date range picker can be cleared. |
| `minDate` | `Date` | | The minimum selectable date. |
| `maxDate` | `Date` | | The maximum selectable date. |
| `valueFormat` | `string` | `YYYY-MM-DD` | Format string for the date range value. |
| `startDatePlaceholder` | `string` | `YYYY-MM-DD` | Placeholder text for the start date input field. |
| `endDatePlaceholder` | `string` | `YYYY-MM-DD` | Placeholder text for the end date input field. |
| `rangeIcon` | `React.ReactNode` | | Icon displayed in the middle of 2 date input field of the date range picker. |
| `fixOnBlur` | `boolean` | `true` | Fixes the input value on blur if invalid. |
| `transformInvalidValue` | `boolean` | `true` | If false, prevents transforming the invalid input value to a date. |
| `selectModeOnly` | `false \| undefined` | `false` | |
| `disabled` | `boolean` | | Disables the entire date range picker. |
| `disabledInput` | `boolean` | | Disables the input fields of the date range picker. |
| `readOnly` | `boolean \| undefined` | | |
| `loading` | `boolean` | | If `true`, the calendar trigger button will show a loading spinner. |
| `fullWidth` | `boolean` | | If true, the component will take the full width of its container. |
| `leftContent` | `React.ReactNode` | | Custom content displayed to the left of the date range picker. |
| `locale` | `string` | | Locale string for date formatting and localization. |
| `open` | `boolean` | | If `true`, the dropdown Calendar is open. |
| `onOpenChange` | `(value: boolean, event?: Event, reason?: OpenChangeReason) => void` | | Callback function to be called when the open state changes. |
| `onIconClick` | `(event: React.MouseEvent<HTMLButtonElement>) => void` | | Called when the calendar icon is clicked. |
| `onInputsBlur` | `(inputValue?: { end: string; start: string }) => void` | | Callback triggered when the inputs lose focus. |
| `ignoreOutsideRefs` | `React.MutableRefObject<HTMLElement \| null>[]` | | Array of refs to elements that should not trigger outside press events. |
| `dropdownConfig` | `PopoverProps['dropdownConfig']` | | Dropdown configuration for the picker popover. |
| `startInputProps` | `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' \| 'type'>` | | Additional HTML attributes to pass directly to the start date `<input>` element. |
| `endInputProps` | `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' \| 'type'>` | | Additional HTML attributes to pass directly to the end date `<input>` element. |
| `CalendarProps` | `DualCalendarProps` | | Custom properties for the DualCalendar component. |
| `DualCalendarProps` | `DualCalendarProps` | | Deprecated; use `CalendarProps` |
| `calendarHeaderContent` | `React.ReactNode` | | Deprecated; use `CalendarProps.calendarHeaderContent` |
| `calendarFooterContent` | `React.ReactNode` | | Deprecated; use `CalendarProps.calendarFooterContent` |
| `renderHelperTextDay` | `(date: Date) => React.ReactNode` | | Function to render helper text for a specific day. |

### Styles

From the `datePicker` and `timeSelect` recipes.

| Slot | Styles |
|---|---|
| dateTimeInput `iconButton` | left border 1px `colors.neutral.300` (written as a raw `1px` and `var(--mag-colors-neutral-300)`, not `token()`); left corners square |
| datePicker `base` · `fullWidth` | `true`: width 100%; `false`: width `fit-content`, max width 100% |
| timeSelect | `base` relative; `dropdown` padding 0; `menu` max height 500px, scrolls |

Stories: `packages/docs/stories/Dates/DateRangePicker/DateRangePicker.stories.tsx`, `packages/docs/stories/Dates/DateRangePicker/Examples`.
<!-- GENERATED:END -->
