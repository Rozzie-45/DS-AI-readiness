---
type: pattern
pattern: "Data table toolbar, download, upload, loading and no results"
kind: layout
components:
  - TableContainer
  - Table
  - Tr
  - Td
  - Button
  - ButtonGroup
  - IconButton
  - Divider
  - DropdownMenu
  - DropdownMenuTrigger
  - Menu
  - MenuBody
  - MenuList
  - MenuItem
  - ListItemText
  - Dialog
  - DialogHeader
  - DialogContent
  - DialogAction
  - FormCheck
  - Radio
  - SearchInput
  - Select
  - Spinner
  - Text
status: draft
sources:
  - packages/docs/stories/TableFeature/Shared/ToolbarHeader.tsx
  - packages/docs/stories/TableFeature/FilterAndSort/TableToolbar.stories.tsx
  - packages/docs/stories/TableFeature/TableSelectable/Design.mdx
  - packages/docs/stories/TableFeature/DownloadAndUpload/Design.mdx
  - packages/docs/stories/Developments/SearchAndTable/Design.mdx
  - packages/react-templates/src/patterns/DownloadAndUpload
  - packages/react-templates/src/patterns/EditableDataTable/EditableTable.tsx
  - packages/react-templates/src/components/NoDataFound/index.tsx
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Data table toolbar, download, upload, loading and no results

## Problem

A data table needs a place for actions on the whole table or on many rows. The docs: the data table toolbar offers general actions for managing the entire table or a large group of rows, such as table settings, advanced filtering, specific searching, data export and bulk editing. Users also need to take data out of the table and bring data in (download and upload), and to understand what the table is doing after a search: still loading, or finding nothing.

Magenta has no toolbar component. The Storybook examples lay out Magenta buttons, menus and fields above the `Table`, inside the `TableContainer`. Download and upload are shown with templates from `@ocean-network-express/magenta-react-templates`, a private package that is not part of `magenta-react`; this note keeps only what they build from `magenta-react` components.

## When to use

- Actions that apply to the whole table: add a row, export, table settings.
- Actions on the selected rows that stay visible before anything is selected (bulk actions; [selection pattern](data-table-selection.md)).
- Table-level sort, filter and search ([sort and filter pattern](data-table-sort-filter.md)).
- Download: saving the current data, with its filters and customizations, for offline use, sharing or analysis (docs).
- Upload: importing external data in a predefined format to update or extend the table (docs).

## When not to use

- An action on one row: the row action menu ([Table note](../components/table.md)).
- Actions that appear only once rows are selected: the batch actions bar ([selection pattern](data-table-selection.md)).
- Page-level search with many fields: the docs' Search & filter area pattern, which this vault has not documented yet.
- An editable table: its toolbar carries Cancel and Save in edit mode ([editing pattern](data-table-editing.md)).

## Rules

- The toolbar MUST sit inside the `TableContainer`, above the `Table`, and the create, update and delete actions MUST sit at its top right: the docs ask for CRUD actions in the upper right corner of each container, not at the top of the page.
- Actions that need selected rows MUST be disabled until a row is selected (docs: the bulk action button is disabled when no items are selected; multiple rows download needs at least one row).
- An `IconButton` in the toolbar MUST have an `aria-label` ("Table settings").
- Controls MUST take `size="responsive"`; the stories use fixed sizes.
- A table that is loading MUST say so in text and set `aria-busy` on the `Table`; the `Spinner` alone tells screen readers nothing ([Spinner note](../components/spinner.md)).
- A table with no results MUST offer a way back to the default view; a primary action is optional (docs).
- Upload uses `FileUpload` from `magenta-react-templates` (team decision, 2026-11-10); `magenta-react` has no file upload component. Do not build a lookalike file picker.

## Principles

- Keep loading local: when a search runs, only the table area shows the spinner; the page does not reload (docs).
- Download one file type directly; offer a menu only when there are several types, and a dialog only when there are several options as well (docs).
- Prepare large or complex downloads before offering them; the docs call this "Preparing Download" but show it only in an image.

## Structure

Toolbar (stories TableToolbar and ToolbarHeader; team decision, 2026-11-09, to follow Storybook over Figma):

1. Row: `css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8', mb: '8' })` inside the `TableContainer`, before the `Table`. With no table-level controls, the actions sit at the right (`justifyContent: 'flex-end'`).
2. Left: table-level sort (`Select`) and search (`SearchInput`), 8px apart ([sort and filter pattern](data-table-sort-filter.md)).
3. Right, 8px apart, in this order:
   - Row actions: a `ButtonGroup` (`size="responsive"`, `disabled` while no row is selected) of outline neutral `Button`s with a left icon, such as Edit (`PenEditOutline`) and Delete (`TrashDeleteOutline`).
   - `<Divider direction="vertical" className={css({ h: '24' })} />` ([Divider note](../components/divider.md)).
   - Table actions: outline neutral `Button`s with a left icon, such as Export or Download.
   - The main action: `Button` with `variant="outline"`, `color="primary"` and a left icon, such as "Add New" (`AddOutline`).
   - Settings: `IconButton` with `variant="outline"`, `color="neutral"`, `GearSettingOutline` and `aria-label`, opening a menu (the column resize story puts "Reset Columns Size" there; [columns pattern](data-table-columns.md)).

Download (docs and templates DownloadAllData, MultipleRowsDownload, SingleRowDownload, DownloadModal):

- One file type: an outline neutral `Button` "Download" with `ArrowDownloadOutline` that downloads at once.
- Several file types: the same `Button` with `rightIcon={<ChevronDownOutline />}` as a `DropdownMenuTrigger`, and a `Menu` with one `MenuItem` per file type.
- Several options as well: the menu choice opens a `Dialog` with a `DialogHeader` (the choice), a description, a `FormCheck` of `Radio`s for "Download options" and one for "File types", and a `DialogAction` with Cancel (`Button` ghost), an optional second way such as "Sent as Attachment" (`Button` outline) and Download (`Button`).
- One row: a "Download" item with `ArrowDownloadOutline` in the row action menu.
- Selected rows: the download button stays disabled until a row is selected.

Upload (docs and templates UploadData, UploadModal):

- An outline neutral `Button` "Upload" with `ArrowExportOutline`. One file uploads directly; several files go through a `Dialog` ("Upload Files") with a file picker and a `DialogAction` of Cancel (`Button` ghost) and Upload (`Button`). The file picker is `FileUpload` from `magenta-react-templates` (team decision, 2026-11-10).

Loading and no results (docs Search & Table, template EditableTable; in this note by team decision, 2026-11-09):

1. Loading: instead of the rows, one `Tr` with one `Td` spanning all columns (`colSpan`), holding a centered column (`css({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8', py: '24' })`, `role="status"`) with `<Spinner size="3xl" />` and `<Text level="body1-semibold" className={css({ color: 'neutral.700' })}>In progress...</Text>`. Set `aria-busy` on the `Table` while loading.
2. No results: the same single row, with `role="status"`: `<Text level="h5" component="p">No Data Found</Text>`, then `<Text className={css({ color: 'neutral.700' })}>Please try another search, keywords or filters.</Text>`, then the buttons 8px apart: "Back to default" (`Button` outline, required) and the primary action (`Button`, optional). This also covers a filtered table with no rows ([sort and filter pattern](data-table-sort-filter.md)).

Checked in the prototype, screen `#/table-toolbar`: the toolbar layout, Edit and Delete disabled until a row is selected, the download menu, the loading row with a 48px spinner and `aria-busy`, the no results row after a search with no match, and "Back to default".

## Accessibility

- Name every toolbar `IconButton` with `aria-label`.
- A disabled `ButtonGroup` disables its buttons; tell users why when it is not obvious, for example with the selected count of the [selection pattern](data-table-selection.md).
- Loading and no results: `role="status"` on the message so screen readers announce it, and `aria-busy` on the `Table` while it loads.
- The "In progress..." text (`colors.neutral.700` on `colors.white`) is 6.95:1.

## Do and don't

| Don't | Do |
|---|---|
| Create, edit and delete buttons at the top of the page | At the top right of the table's container |
| Bulk actions enabled with nothing selected | `disabled` until a row is selected |
| A spinner with no text | The spinner, "In progress..." and `aria-busy` on the `Table` |
| A no results message with no way back | "Back to default", and optionally a primary action |
| A file picker built by hand | Ask the team (see Open questions) |
| `style={{ fontWeight: 600, color: '#666' }}` on the loading text, as the template does | `Text level="body1-semibold"` with `colors.neutral.700` |

## Examples

- Prototype: `.prototype/magenta/apps/prototype/src/screens/table-toolbar.tsx` (screen `#/table-toolbar`).
- Stories: `TableFeature/FilterAndSort/TableToolbar.stories.tsx`, `TableFeature/Shared/ToolbarHeader.tsx`, `TableFeature/DownloadAndUpload/DownloadAndUpload.stories.tsx`, `Developments/SearchAndTable/SearchAndTable.stories.tsx`.

## Figma to code mapping

Figma set `_Data table toolbar v1.0.0` on the Data Table page. Mapped on 2026-11-09; the toolbar follows Storybook by team decision that day, the rest has not been reviewed on its own.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| _Data table toolbar | any | — | the toolbar row: gap `8`, margin bottom `8`, no band or bottom line (Figma: 56px band, padding 12/8, gap 16, bottom divider) |
| _Data table toolbar · Sort & Filter | True | — | the left controls: Filter by (`Select` with `multiple`), Sort (`Select`), Search (`SearchInput`) ([sort and filter pattern](data-table-sort-filter.md)) |
| _Data table toolbar · Selectable table, Selection | True, Unselected / Selected | `disabled` | row and bulk actions disabled while Unselected |
| _Data table toolbar · Selected info | text | — | the selected count ([selection pattern](data-table-selection.md)) |
| _Data table toolbar · Selected tool (Icon button group) | any | — | the row actions `ButtonGroup` (Edit, Delete) |
| _Data table toolbar · Acts-tools-divider | true | — | `Divider` `direction="vertical"`, height `24` |
| _Data table toolbar · Bulk actions | Button, outline neutral | — | an outline neutral `Button`, with a `DropdownMenu` when there are several bulk actions (the Selectable document shows Export, Download, Delete) |
| _Data table toolbar · Secondary action | Button, outline neutral | — | an outline neutral `Button` with a left icon |
| _Data table toolbar · Primary action | Button "Add row", outline neutral | — | `Button` `variant="outline"` `color="primary"` "Add New" (Storybook) |
| Data table overflow menu item · Type | On Toolbar | — | the settings `IconButton` with `GearSettingOutline` (Storybook) |
| _Data table toolbar · Horizontal-divider | true | — | left out (Storybook) |

## Open questions

1. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) B27): Toolbar visuals: Figma draws a 56px band with 12/8 padding, 16px gaps and a bottom divider, an outline neutral "Add row", separate buttons and an overflow button; Storybook uses 8px gaps, no band, an outline primary "Add New", a `ButtonGroup` for Edit and Delete and a settings button. Decided 2026-11-09 to follow Storybook; the Figma set should match.
2. Resolved 2026-11-10 (team, [known issues](../reports/known-issues-2026-11-10.md) Q14): use `FileUpload` from `magenta-react-templates`. Question was: Upload: the stories' file picker (`FileUpload`) is in the private `magenta-react-templates` package. `magenta-react` has no file upload component, so the team must say what products use.
3. Resolved 2026-11-10 (team, [known issues](../reports/known-issues-2026-11-10.md) Q15): use an empty state; it will be specified with the shared templates (ask the team then). Question was: The no results illustration (NoDataFoundFill) is also templates-only, and the template shows a red toast ("No results found. Please check and try again!") with a check icon at the same time as the in-table message. This note leaves both out; the team should confirm.
4. The docs show "Preparing Download", multiple rows download, the download dialog and "Upload and Download" only as images, which are missing from the source snapshot.
5. Upstream, for the Magenta team: the templates write text colors as raw hex values (`#66707B`, `#666`), set weights with inline styles, and the settings button in the stories has no accessible name.
6. The docs' Search & filter area, Mixed form and Master & detail patterns, which Search & Table points to, are not documented in this vault.
