---
type: pattern
pattern: "Data table columns: resize, reorder, show and hide"
kind: layout
components:
  - Table
  - TableContainer
  - Th
  - Td
  - Tr
  - IconButton
  - Button
  - Checkbox
  - HelperText
  - Text
  - Tooltip
  - TooltipTrigger
  - TooltipContent
  - DropdownMenu
  - DropdownMenuTrigger
  - Menu
  - MenuHeader
  - MenuBody
  - MenuList
  - MenuItem
  - MenuFooter
  - ListItemIcon
  - ListItemText
status: draft
sources:
  - packages/docs/stories/TableFeature/ColumnsResizable/Design.mdx
  - packages/docs/stories/TableFeature/ColumnsResizable/Basic.stories.tsx
  - packages/docs/stories/TableFeature/ColumnsResizable/ReadableMinimum.stories.tsx
  - packages/docs/stories/TableFeature/ColumnsResizable/styles.module.css
  - packages/docs/stories/TableFeature/ColumnAndRowOrdering/Basic.stories.tsx
  - packages/docs/stories/TableFeature/ColumnAndRowOrdering/RowOrdering.stories.tsx
  - packages/docs/stories/TableFeature/ColumnAndRowOrdering/GroupColumns.stories.tsx
  - packages/docs/stories/TableFeature/ColumnsCustomization/Design.mdx
  - packages/docs/stories/TableFeature/ColumnsCustomization/SettingMenu/ShowAndHideColumns.stories.tsx
  - packages/docs/stories/TableFeature/ColumnsCustomization/SettingMenu/RequiredColumns.stories.tsx
  - packages/docs/stories/TableFeature/ColumnsCustomization/GroupColumns/GroupColumns.stories.tsx
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Data table columns: resize, reorder, show and hide

## Problem

Users of wide data tables need the columns their task needs, in the order and width that make the data readable. The docs name three tools: resizing a column by dragging its divider, reordering columns (and rows) by drag and drop, and a settings menu to show, hide and order columns. Without limits, users can make a column unreadable or hide everything that identifies a row.

Magenta's table elements have none of this ([Table note](../components/table.md)). The Storybook examples build it with TanStack Table (`@tanstack/react-table`) for column sizes, order and visibility, and with dnd-kit (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, public npm packages) for drag and drop. `magenta-react` already depends on `@dnd-kit/core`; `@dnd-kit/sortable` comes from the docs only.

## When to use

- Resize: content of varying length, where users want to see more of one column, such as long names or descriptions.
- Reorder columns: users compare columns that are far apart.
- Reorder rows: the row order itself means something, such as a priority or a sequence, and users set it by hand.
- Show and hide: more columns than a task needs, where users pick their own view.

## When not to use

- Sorting rows by a value: use sorting ([sort and filter pattern](data-table-sort-filter.md)), not row drag and drop.
- Keeping a column in view while scrolling: pin it ([sticky header and pinned columns pattern](data-table-sticky-pinning.md)).

## Rules

- Every resizable column MUST have a minimum width that keeps its content readable and meaningful (docs: status indicators and visual cues stay visible, actions stay visible, the minimum follows the content item). Set `minSize` per column, and `defaultColumn: { minSize: 50, maxSize: 800 }` as the stories do.
- The primary key column MUST NOT be resizable (`enableResizing: false`), per the docs.
- Users MUST be able to reset all column widths, from a button or by reloading the page (docs). The story puts "Reset Columns Size" (`table.resetColumnSizing(true)`) in a toolbar settings menu.
- A drag handle MUST be an `IconButton` with `aria-label` ("Move column Vessel", "Move row BK-1001") holding `DraggableOutline`, with dnd-kit's `setActivatorNodeRef`, `attributes` and `listeners` on it, so keyboard users can drag with Space and the arrow keys. The column ordering story puts the listeners on the bare icon and removes its focus outline; the row ordering story uses an `IconButton` as here.
- Pinned columns and fixed rows MUST NOT move or accept a drop (`disabled` in `useSortable`, and ignore drops on them).
- Columns that must stay visible MUST be locked in the settings menu (`enableHiding: false`): their item is disabled and stays checked.
- When fewer than the required number of columns are checked, Apply MUST show an error and stay disabled until enough are checked (docs: disable Apply when the minimum is not reached).

## Principles

- Show the resize affordance on the column divider; double-clicking the handle resets that column, as the stories do.
- Nested columns resize relatively (docs): resizing a parent changes its children equally; resizing a child changes the parent but not its siblings. TanStack sizes group headers from their children.
- Show how many columns are hidden on the settings button, so users notice a reduced view: its tooltip says "1 hidden column" or "3 hidden columns".
- Keep the menu's choices until Apply; Cancel throws them away, Reset returns to the default view.

## Structure

Resize (stories ColumnsResizable Basic and ReadableMinimum):

1. TanStack: `columnResizeMode: 'onChange'`, `defaultColumn: { minSize: 50, maxSize: 800 }`, `size` and `minSize` per column, `enableResizing: false` on the primary key.
2. Cells: `width={column.getSize()}` on `Th` and `Td`, and the content in an element of that width that ends long text with an ellipsis: `css({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })` with `style={{ width: column.getSize() }}`.
3. Handle, inside each resizable `Th`: a `span` with `aria-hidden`, `onMouseDown` and `onTouchStart` set to `header.getResizeHandler()`, `onDoubleClick={() => column.resetSize()}`, and `className={css({ position: 'absolute', top: '0', right: '0', h: '100%', w: '4', cursor: 'col-resize', userSelect: 'none', touchAction: 'none', zIndex: 'above' })}`. The story's handle is 2px wide and transparent.

Reorder columns (story ColumnAndRowOrdering Basic):

1. TanStack `columnOrder` state with `onColumnOrderChange`.
2. In `Thead`: a DndContext (sensors: PointerSensor, and KeyboardSensor with `sortableKeyboardCoordinates`) and a SortableContext with the movable column ids and `horizontalListSortingStrategy`. Each movable `Th` calls `useSortable({ id: column.id })` and gets `ref={setNodeRef}`; its drag handle `IconButton` (`variant="ghost"`, `color="neutral"`, `size="xs"`) comes before the label.
3. While dragging, the column's cells show `css({ opacity: 0.5, color: 'neutral.500' })`; the story also shows a DragOverlay on a white card (`radii.md`, `shadows.xl`). On drop, `arrayMove` the order.

Reorder rows (story RowOrdering, in this note by team decision, 2026-11-09):

1. A first column with the row drag handle (`IconButton`, `aria-label` naming the row); fixed rows have it `disabled`.
2. In `Tbody`: a DndContext and a SortableContext with the row ids and `verticalListSortingStrategy`. Each `Tr` calls `useSortable({ id: row.id, disabled: fixed })`, gets `ref={setNodeRef}` and `style={{ transform: CSS.Transform.toString(transform) }}`, and `css({ opacity: 0.4 })` while dragging. On drop, `arrayMove` the data.

Show and hide (stories ShowAndHideColumns and RequiredColumns; team decision, 2026-11-09, to follow their floating button):

1. Trigger: an `IconButton` with `variant="outline"`, `color="neutral"`, `size="sm"`, `floating` and `TableEditOutline`, floating over the top right corner of the table, above the actions column, inside a `Tooltip` with the hidden count. Give it an `aria-label` with the count ("Show and hide columns, 2 hidden"). The prototype places it in an absolutely positioned wrapper (`top: '4'`, `right: '4'`) next to the scroll area, so it stays put when the table scrolls sideways; the story uses `position: sticky` with raw offsets.
2. `DropdownMenu` with `open`, `onOpenChange` and `closeOnItemClick={false}`; `Menu` with `size="responsive"`:
   - `MenuHeader`: a "Select All" `Checkbox` (checked, indeterminate when some are hidden) and a Reset `Button` (`variant="ghost"`, `color="primary"`).
   - `MenuBody`: one `MenuItem` per column, `selected` when shown and `disabled` when locked, with a read-only `Checkbox` (`tabIndex={-1}`) in a `ListItemIcon` and the column name in a `ListItemText`; the menu's `onItemClick` toggles it. The stories also put a drag handle in each item to reorder columns (a vertical SortableContext), and Apply sets the column order from the list.
   - `MenuFooter`: when too few columns are checked, `HelperText` ([HelperText note](../components/helper-text.md)) with `state="error"`, an `InfoCircleOutline` icon and "Please select at least 2 columns" (the story's minimum is 2); then Cancel (`Button` ghost primary) and Apply (`Button`, `disabled` while the error shows).
3. Apply writes the choices to TanStack's `columnVisibility` (and `columnOrder`), and closes the menu.

Nested or grouped columns: the stories reorder group columns as a whole and show them as a tree in the settings menu (`TreeView`, `TreeItem`; [TreeView note](../components/tree-view.md)), with child columns moving inside their parent.

Checked in the prototype, screen `#/table-columns`: resizing by dragging and to the minimum, the double-click reset, no handle on the primary key, the settings menu with a locked column, the minimum-columns error and Apply, and drag and drop of columns and rows with the mouse and with the keyboard (Space, arrow keys, Space), with the fixed row's handle disabled.

Setup: dnd-kit's hooks must use the same copy of `@dnd-kit/core` as the DndContext. In the prototype (pnpm and Vite), Vite pre-bundled a second copy of `@dnd-kit/core` inside `@dnd-kit/sortable`: the handles got no listeners and nothing could be dragged, with no error. `resolve: { dedupe: ['@dnd-kit/core', '@dnd-kit/utilities'] }` in the Vite config fixed it.

## Accessibility

- Drag handles are named `IconButton`s, so keyboard users reach them; dnd-kit's keyboard sensor picks up with Space, moves with the arrow keys and drops with Space, and announces the steps in a live region it adds to the page.
- The resize handle is mouse and touch only, as in the stories; keyboard users have the "Reset Columns Size" action but no way to set a width (see Open questions).
- Checkboxes in menu items take `tabIndex={-1}`: the menu item carries the action ([Checkbox note](../components/checkbox.md)).
- The settings button's `aria-label` carries the hidden count, which the tooltip shows only on hover.

## Do and don't

| Don't | Do |
|---|---|
| Drag listeners on a bare icon with its focus outline removed | A named `IconButton` as the drag handle |
| A resizable primary key column | `enableResizing: false` on it |
| Columns with no `minSize` | A `minSize` that keeps the content readable |
| Hiding every column | Lock key columns (`enableHiding: false`) and require a minimum |
| Applying each checkbox as the user ticks it | Apply and Cancel in the menu footer |
| Dropping onto pinned columns or fixed rows | `disabled` sortables, and ignore those drops |

## Examples

- Prototype: `.prototype/magenta/apps/prototype/src/screens/table-columns.tsx` (screen `#/table-columns`).
- Stories: `ColumnsResizable/Basic.stories.tsx`, `ColumnsResizable/ReadableMinimum.stories.tsx`, `ColumnAndRowOrdering/Basic.stories.tsx`, `ColumnAndRowOrdering/RowOrdering.stories.tsx`, `ColumnAndRowOrdering/GroupColumns.stories.tsx`, `ColumnsCustomization/SettingMenu/ShowAndHideColumns.stories.tsx`, `ColumnsCustomization/SettingMenu/RequiredColumns.stories.tsx`, `ColumnsCustomization/GroupColumns/GroupColumns.stories.tsx`.

## Figma to code mapping

Figma sets on the Data Table page. Mapped on 2026-11-09; the settings button, dnd-kit and the row ordering scope were decided with the team that day, the rest has not been reviewed on its own. The Figma frame for column ordering (node `33973:343376`) only links to the separate "MDS Data Table Document" file, which was not read.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| Header cell item · Type | Customizable | — | a header with a drag handle and the column menu ([sticky header and pinned columns pattern](data-table-sticky-pinning.md)) |
| Header cell item · Dnd handle (Customizable) | Dnd handle, `draggable` icon | — | the drag handle `IconButton` with `DraggableOutline` |
| Resizer (in every cell and item) | — | — | Not a resize handle: a Figma layout helper from the Utilities page. Nothing in code. The package's `Resizeable` component is not used for columns either: it is internal to `NonModalDialog` (team decision, 2026-11-10) |
| _Data table row item · Overflow menu | True (header row) | — | the show and hide settings button, floating over the actions column (team decision) |
| Data table overflow menu item · Type | On Toolbar | — | a toolbar menu such as the story's settings menu with "Reset Columns Size" ([toolbar pattern](data-table-toolbar.md)) |
| Pin item | any | — | the docs' pinned indicator in the show and hide menu; no story ([sticky header and pinned columns pattern](data-table-sticky-pinning.md)) |

## Open questions

1. The design pages show the resize anatomy, the recommended minimum widths per column type, the settings menu, its tooltip, fixed columns, drag and drop and nested columns only as images, which are missing from the source snapshot.
2. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) C16): The docs say resize handles appear when hovering over the divider, but the story's handle is transparent; how it should look is not documented.
3. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) A12): Keyboard users cannot resize a column: neither the docs nor the stories give a keyboard way, which WCAG 2.2 (2.5.7 Dragging Movements) asks for. "Reset Columns Size" only restores widths.
4. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) D7): Settings button placement: the stories put it in three places (a floating button, the actions column header in story ColumnsPinning, a toolbar settings menu for reset) and Figma draws an overflow button at the end of the header row. Decided 2026-11-09 to use the floating button; the Figma set should match.
5. Upstream, for the Magenta team: the column ordering story puts drag listeners on a bare icon and removes its focus outline, the settings trigger has no accessible name and uses raw sticky offsets, and the menu items nest a focusable `Checkbox` with a `label` inside a menu item.
6. Resolved 2026-11-09: `TreeView` and `TreeItem` now have a usage note ([TreeView note](../components/tree-view.md)); the group column stories use `TreeView` in the settings menu.
