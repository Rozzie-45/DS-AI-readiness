---
type: component
component: "InlineEdit"
description: "Inline edit allows users to modify content directly on the very page where it is being viewed, without the need to switch to a separate editing mode or open form/additional windows."
category: inputs
status: draft
figma_url: "https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=54139-76652"
alternatives:
  - Input
  - Dialog
  - Drawer
related:
  - InlineEditControl
  - Input
  - Select
  - Textarea
  - IconButton
  - ButtonGroup
can_contain: []
cannot_contain: []
required_children: []
a11y_role: button
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/docs/stories/Components/InlineEdit/Design.mdx
  - packages/docs/stories/Components/InlineEdit/inlineEdit.mdx
  - packages/docs/stories/Components/InlineEdit/Examples
  - packages/react/src/components/InlineEdit/InlineEdit.tsx
  - packages/react/src/components/InlineEdit/InlineEditWrapper.tsx
  - packages/react/src/components/InlineEdit/InlineEditControl.tsx
  - packages/react/src/components/InlineEdit/InlineEditView.tsx
  - packages/react/src/components/InlineEdit/InlineEdit.models.ts
  - packages/css/src/recipes/InlineEdit/InlineWrapper.ts
  - packages/css/src/recipes/InlineEdit/InlineView.ts
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# InlineEdit

## Overview

A value shown as text that the user can edit in place: clicking it (or pressing Enter or Space on it) turns it into a field with Cancel and Save buttons, without opening a form or another window. It has two modes, `view` and `edit`. The field is an `Input` (default), a `Select` or a `Textarea`, chosen with `component`. The component does not keep the value: your code holds it, updates it while the user types, and puts the old value back when the user cancels or leaves.

## When to use

From the docs and the Figma documentation frame:

- Changing one value directly on the page where it is shown, such as a reference number or a note on a detail page, without opening a form or a dialog.
- A value from a fixed list (with `Select`) or a longer text (with `Textarea`): inline edit wraps the data input and, in edit mode, follows that input's own rules.

## When not to use

The docs give no list. These follow from what the component does and from the other notes:

- Editing cells of a data table. Follow the [data table editing pattern](../patterns/data-table-editing.md), which puts `Input` or `Select` in the cell.
- A form the user fills in from scratch, or several related values saved together. Use `Input`, `Select` and the other fields in a form, with one Save.
- Changes that need a confirmation or more context, such as several fields of one record. Use a `Dialog` or a `Drawer` ([Dialog note](dialog.md), [Drawer note](drawer.md)).

## Why this design

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| One value on a detail page, edited now and then | `InlineEdit` | A form with one field and a Save button |
| A field that is always editable | `Input` | `InlineEdit` |
| Several values of one record, saved together | A form in a `Drawer` or `Dialog` | Several `InlineEdit`s |
| A cell in a data table | The data table editing pattern | `InlineEdit` in a `Td` |

## Anatomy

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Editable content | yes | The value as text in view mode (`colors.neutral.900`), or the placeholder (`colors.neutral.500`) when there is none. |
| 2 | Label | no | `label`, above the value or, with `labelAlignment="horizontal"`, to its left. |
| 3 | Main container | yes | Holds the content and actions; on hover or focus it gets a `colors.neutral.100` background (hover) or a `colors.primary.500` outline (focus), rounded `radii.md`. |
| 4 | Indicator icon | yes | A pen icon (`colors.neutral.700`) at the end of the value, shown on hover and focus only. |
| 5 | Input control | yes | In edit mode: the `component` (`Input`, `Select` or `Textarea`), full width. |
| 6 | Cancel and Save | yes | In edit mode: two outline `IconButton`s in a `ButtonGroup`, a cross ("Cancel") and a check ("Save"), after the field or, with `buttonAlignment="vertical"`, under it. |

## Composition

- Value: always controlled. Pass `value`, update it from the field (`onChange` for `Input` and `Textarea`, `onValueChange` for `Select`), and handle `onModeChange`:

  ```tsx
  const REVERT = [InlineEditChangeModeReason.Cancel, InlineEditChangeModeReason.ClickOutside, InlineEditChangeModeReason.Blur];
  <InlineEdit<typeof Input>
    component={Input}
    label="Customer reference"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    onModeChange={({ reason, nextValue }) => {
      if (REVERT.includes(reason)) setValue(nextValue);       // put the value from before editing back
      if (reason === InlineEditChangeModeReason.Save) save(nextValue);
    }}
    size="responsive"
  />
  ```

  This is the pattern of every story. Without it, Cancel leaves the typed text in place.
- `InlineEditControl` is the part `InlineEdit` renders for the field in edit mode (it passes `component`, `placeholder`, `value` and the field's props to it). It is exported, but neither the docs nor the stories use it on its own: render `InlineEdit`.
- Field type: `component={Select}` with `items` and `renderValue` to show labels instead of values (a list of `Tag`s for several values, as in the Async story); `component={Textarea}` for long text. Props of the field (such as `items`, `multiple`, `maxLength`) are passed on `InlineEdit`.
- Empty value: show `placeholder`, such as "No information" (docs: "No information" or placeholder text, depending on the context).
- Validation: set `state` and `helperText` while editing; they show in edit mode only, under the field or, with `renderHelperType="tooltip"`, as a tooltip. Save stays enabled when `state="error"`: check the value in `onModeChange` before saving, and keep the old value if it fails.
- Saving to a server: set `loading` while the request runs; the Save button shows a spinner (edit mode only).
- Size: pass `size="responsive"`; the default is `lg`. The view row is as high as the field (measured 32px at 1024px and 40px at 1920px), so the layout does not jump when switching modes.
- Width: as wide as its content by default; `fullWidth` fills the container. Long values: the docs say to truncate and show the full content on hover.
- `readOnly` shows the value with no hover and no editing (`colors.neutral.700`); `disabled` the same in `colors.neutral.500`.

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| View | default; Save, Cancel, blur, click outside | The value as text. `onModeChange` gets `mode: 'view'` and the reason. |
| Hover | Pointer over the value | Background `colors.neutral.100`, 4px side padding, pen icon. |
| Focus | Tab onto the value | Outline `colors.primary.500`, pen icon. |
| Edit | Click, Enter or Space on the value, or a click on the label | The field replaces the text and takes focus, with the cursor at the end. `reason: 'click'`. |
| Saved | Save button | `reason: 'save'`, `nextValue` is the new value. |
| Cancelled | Cancel button | `reason: 'cancel'`, `nextValue` is the value from before editing. |
| Left | Focus or a click leaves the component | `reason: 'blur'` or `'click-outside'`, `nextValue` is the value from before editing: the change is discarded without asking. |
| Read-only, disabled | `readOnly`, `disabled` | Stays in view mode; cannot be focused or edited. |

`mode` and `onModeChange` together make the mode controlled.

Measured in the prototype (screen `#/inline-edit`) with `size="responsive"`: Enter or Space on the value opens edit mode and focuses the field; Escape and Enter in the field do nothing; Tab moves to Cancel, then Save; Enter on Save saves and returns to view mode, but focus goes to the page body; tabbing out of the field discards the change (the log shows `blur → view` and the old value comes back). The value text is 11px at 1024px, 13px at 1280px and 15px at 1920px; Cancel and Save are 32px square at 1024px and 40px at 1920px.

## Accessibility

### Keyboard

- Tab reaches the value (a hidden button). Enter or Space opens edit mode.
- In edit mode, Tab moves from the field to Cancel and Save.
- Escape does not cancel and Enter does not save (measured). Tab out of the component discards the change.

### Accessible name

The value is a hidden, empty button named by the `label` (the label's `for` points at it). Its name does not include the value, so a screen reader announces "Customer reference, button" without the reference itself. In edit mode the field has the same `id`, so the label names it. Cancel and Save are named "Cancel" and "Save". With no `label`, the hidden button has no name: pass a `label`.

### Focus

On entering edit mode, focus moves to the field. After Save or Cancel, focus is lost (it goes to the page body); move it back to the component yourself if the user is working by keyboard.

### Contrast pairs

| Foreground token | Background token | Min ratio |
|---|---|---|
| `colors.neutral.900` (value) | `colors.white` | 4.5 |
| `colors.neutral.900` (value on hover) | `colors.neutral.100` | 4.5 |
| `colors.neutral.700` (read-only value, pen icon) | `colors.white` | 4.5 |
| `colors.neutral.500` (placeholder) | `colors.white` | 4.5 |

## Content

- Placeholder for an empty value: "No information", or a placeholder that says what to enter (docs, Displayed Content).

## Do and don't

| Don't | Do |
|---|---|
| `value` with no `onModeChange` | Put `nextValue` back on cancel, blur and click outside |
| Saving a value with `state="error"` | Check the value in `onModeChange` before saving |
| `InlineEdit` with no `label` | A `label` (it names the editable value) |
| `InlineEdit` in data table cells | The data table editing pattern |
| Several `InlineEdit`s for one record that must save together | One form in a `Drawer` or `Dialog` |
| `size` left out | `size="responsive"` |

## Component tokens

## Figma to code mapping

Figma page "Inline Editing - Inprogress": set "Inline editing item" (`55750:73230`). Usage documentation: frame "Inline Edit-Document" (`54139:76652`); its text matches the Storybook docs. The page is marked in progress. Read on 2026-11-09.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| Size | Large / Medium / Small | `size` | `"lg"` / `"md"` / `"sm"`; `"responsive"` in product screens |
| Show label | true / false | `label` | text / left out |
| Label alignment | Top / Left | `labelAlignment` | `"vertical"` (default) / `"horizontal"` |
| Button alignment | Horizontal / Vertical | `buttonAlignment` | `"horizontal"` (default) / `"vertical"` |
| State | Enable / Hover / Focus | — | View mode and its interaction states |
| State | Active | `mode` | `"edit"` (or the user clicks) |
| State | Disable | `disabled` | `true` |
| State | Read-only | `readOnly` | `true` |
| Input label item · Required, Tooltip | True | `required`, `labelPrefix` / `labelSuffix` | `true`, an info icon in a `Tooltip` |
| Input slot (Text input) | instance | `component` | `Input`; `Select` or `Textarea` for those fields |

## Open questions

1. Resolved 2026-11-10 (team, [known issues](../reports/known-issues-2026-11-10.md) Q1): the Why this design section stays empty. Question was: Why this design and its trade-offs: the docs give none. "When not to use" is drawn from the component and the data table editing pattern.
2. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A8): Escape does not cancel and Enter does not save. Should they?
3. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A25): Leaving the component discards the change without asking, while the data table editing pattern asks before leaving with unsaved changes. Which rule applies here?
4. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A9): The hidden button's name is the label only, not the value. Should it include the value?
5. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A26): Save is enabled while `state="error"`. Should it be disabled?
6. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) B10): The Figma doc frame mentions "Enable edit button to edit" and min-max height with scrolling; the code has neither. The Figma page is marked in progress.
7. Upstream, for the Magenta team: focus is lost after Save and Cancel; the Cancel and Save names are fixed English strings; the recipe uses raw values (icon `16`/`20`, `0.2s`).

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-11-09 from contracts/InlineEdit.json and contracts/InlineEditControl.json (scripts/build-contracts.mjs). Styles read from the inlineEditWrapper and inlineEditView recipes. Replaced by build/meta in phase 3. -->

### Props

`InlineEdit<C>` where `C` is `typeof Input` (default), `typeof Select` or `typeof Textarea` (also accepts the props of `C`, except `label`, `size`, `helperText`, `loading`, `state`, `fullWidth`, `renderHelperType`, `id`, `disabled`, `readOnly`, `placeholder`, `labelAlignment`, `minRows`, `maxRows`, which it sets itself)

| Prop | Type | Default | Description |
|---|---|---|---|
| `component` | `C` | required | The field used in edit mode |
| `value` | value of `C` | | Value of Inline edit component |
| `onModeChange` | `(props: { mode, nextValue, reason, event }) => void` | | Event handler whenever the mode changes |
| `mode` | `'edit' \| 'view'` | | Mode of InlineEdit component |
| `renderValue` | `(props: { value }) => React.ReactNode` | | Custom Render Value of InlineEdit component in view mode |
| `placeholder` | placeholder of `C` | | |
| `label` | `React.ReactNode` | | Label for the inputEdit |
| `labelPrefix`, `labelSuffix` | `React.ReactNode` | | From `InputLabel` |
| `labelAlignment` | `'vertical' \| 'horizontal'` | `vertical` | Alignment direction for label |
| `buttonAlignment` | `'vertical' \| 'horizontal'` | `horizontal` | Alignment direction for validation buttons |
| `helperText` | `React.ReactNode` | | The helper text to display below the inputEdit |
| `renderHelperType` | `'inline' \| 'tooltip'` | | How to render the helper text (inline or as a tooltip) |
| `state` | `'error' \| 'warning' \| 'success'` | | State of the inputEdit (error, warning, success) |
| `loading` | `boolean` | | loading state |
| `required` | `boolean` | | If required, show asterisk in the label |
| `disabled` | `boolean` | | If disabled is true, the component operates in view mode and cannot be edited. |
| `readOnly` | `boolean` | | If readOnly is true, the component operates in view mode and cannot be edited. |
| `fullWidth` | `boolean` | `false` | Whether the inputEdit should take the full width of its container |
| `rightContent` | `React.ReactNode` | | Content to display on the right side of the inputEdit |
| `size` | `'sm' \| 'md' \| 'lg' \| 'responsive'` | `lg` | Size of the inputEdit |

`InlineEditChangeModeReason`: `click`, `blur`, `click-outside`, `cancel`, `save`.

### Styles

| Recipe · slot | Styles |
|---|---|
| `inlineEditWrapper` `base` | grid, gap `spacing.4`, width `fit-content` (100% with `fullWidth`); `labelAlignment: horizontal`: label beside, padding block `spacing.10` |
| `inlineEditWrapper` `content` (view) | pointer, radius `radii.md`, `borders.1` transparent outline; hover: `colors.neutral.100`, padding inline `spacing.4`, pen icon shown; focus-within: outline `colors.primary.500` |
| `inlineEditWrapper` `content` (edit) | gap `spacing.4`; Cancel and Save after the field, or under it with `buttonAlignment: vertical` |
| `inlineEditView` `content` | padding block `spacing.8`, `colors.neutral.900`; read-only `colors.neutral.700`; disabled `colors.neutral.500` |
| `inlineEditView` `icon` | `colors.neutral.700`; 16px (`sm`, `md`), 20px (`lg`); margin block `spacing.8` / `spacing.10` |
| `inlineEditView` `placeholder` | `colors.neutral.500` |

Stories: `packages/docs/stories/Components/InlineEdit/InlineEdit.stories.tsx`, `packages/docs/stories/Components/InlineEdit/Examples`.
<!-- GENERATED:END -->
