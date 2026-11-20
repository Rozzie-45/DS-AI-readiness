---
type: pattern
pattern: "Data table expandable rows"
kind: layout
components:
  - Table
  - TableContainer
  - Tr
  - Th
  - Td
  - IconButton
  - Tooltip
  - TooltipTrigger
  - TooltipContent
  - Collapse
  - Text
status: draft
sources:
  - packages/docs/stories/TableFeature/TableExpand/Design.mdx
  - packages/docs/stories/TableFeature/TableExpand/Code.mdx
  - packages/docs/stories/TableFeature/TableExpand/TableSingleExpand.stories.tsx
  - packages/docs/stories/TableFeature/TableExpand/TableMultipleExpand.stories.tsx
  - packages/docs/stories/TableFeature/TableExpand/TableMultipleExpandNestedHeader.stories.tsx
  - packages/docs/stories/TableFeature/TableExpand/styles.module.css
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Data table expandable rows

## Problem

In the docs' words, an expandable data table allows users to view additional details for specific rows within the table. Users need those details without leaving the table or losing their place, and the table must stay scannable while some rows are open.

Magenta's table elements have no expansion logic ([Table note](../components/table.md)). The Storybook examples build it with TanStack Table (`@tanstack/react-table`), an `IconButton` in a first column, and an extra row under the expanded row whose single cell holds the details in a `Collapse`.

## When to use

- Details that belong to one row and do not fit in its cells: a description, contact data, or a subtable of related records.
- One row open at a time (single expand), or several (multiple expand) with an Expand all and Collapse all button in the header.

## When not to use

- Rows that group other rows of the same table (nested or grouped rows): the docs show them only as an image, with no story; see Open questions.
- Details that need a full workflow, such as editing a record: open a `Dialog` or a separate page ([Dialog note](../components/dialog.md)).
- Actions on one row: the row action menu ([Table note](../components/table.md)).

## Rules

- Expansion MUST use TanStack's expanded state (`expanded`, `getExpandedRowModel()`, `row.getIsExpanded()`, `row.toggleExpanded()`, `table.toggleAllRowsExpanded()`), never the row selection state. A table can have both, and Figma draws rows that are selectable and expandable at once (team decision, 2026-11-09; the stories use the selection state).
- The expand trigger MUST be an `IconButton` with `aria-label` naming the row ("Details of BK-1001"), `aria-expanded` set from the row's state, and `aria-controls` pointing to the `id` of the details row. The stories put `aria-expanded` on the icon instead, where it has no effect.
- A row that cannot expand MUST NOT show a trigger (`getRowCanExpand`), and its details row MUST NOT render, even after Expand all.
- The details row MUST NOT block pointer events: the stories' `pointer-events: none` on it makes every link and button inside unusable.
- A subtable that stands alone in the details area MUST have a full border; a subtable shown with other content MUST sit on a card (the docs' two content area styles).

## Principles

- Give every expandable row the same visual cue, a chevron in the first column, so users know which rows hold more (the docs' anatomy).
- Animate opening and closing with `Collapse`, and keep the details row mounted until the collapse has finished, so the content does not vanish before the animation.
- Offer Expand all and Collapse all when users compare details across rows.

## Structure

Anatomy, from the docs: 1 table header, 2 expandable row (with a chevron as a cue), 3 expand trigger, 4 expanded content area.

1. Columns: a selection column first if the table has one ([selection pattern](data-table-selection.md)), then the expand column, then the data columns. Expand column cells: `width={24}` and `className={css({ pr: '0' })}` on the `Th` and the `Td`, `divider="none"` on the `Th`.
2. Row trigger: `IconButton` with `color="neutral"`, `variant="ghost"`, `size="xs"` and `className={css({ verticalAlign: 'top' })}` (otherwise the row grows by about 4px), holding `ChevronRightOutline` with `aria-hidden`. While the row is open, the icon turns 90° (team decision, 2026-11-09, following the stories): a class with `transition: 'transform 200ms ease'`, plus one with `transform: 'rotate(90deg)'` when open. Write them as two static `css()` calls; a value chosen inside one `css()` call is not extracted.
3. Header trigger (multiple expand): the same `IconButton` with `ChevronNextOutline`, turning the same way when every row is open, inside a `Tooltip` (`placement="top"`) that says "Expand All" or "Collapse All". It calls `table.toggleAllRowsExpanded(!table.getIsAllRowsExpanded())`.
4. Details row, rendered right after its row while open: `<Tr id={`${row.id}-details`}>` with one `Td` (`colSpan` = number of visible columns, `className={css({ bg: 'neutral.100', p: '0' })}`) holding `<Collapse open={open}>`. Keep the row 220ms after it closes, as the stories do, so the collapse can play.
5. Content area inside the `Collapse`: `css({ p: '16', display: 'flex', flexDirection: 'column', gap: '8' })` (team decision, 2026-11-09, following the stories).
   - Several items: each on a card, `css({ bg: 'white', borderRadius: 'lg', p: '16', display: 'flex', flexDirection: 'column', gap: '4' })`.
   - Standalone subtable: a `Table` with `className={css({ mb: '0', border: 'token(borders.1) solid token(colors.neutral.200)' })}` and its own `aria-label`.
   - A subtable with a title: inside a card, in a `TableContainer` with the title, as the stories do.
6. Nested header: when the table has two header rows, the expand column's header cell spans both (`rowSpan`), as in story TableMultipleExpandNestedHeader.

TanStack wiring (checked in the prototype, screen `#/table-expand`):

```tsx
const [expanded, setExpanded] = useState<ExpandedState>({});
const table = useReactTable({
  data,
  columns,
  state: { expanded, rowSelection },
  onExpandedChange: setExpanded,
  onRowSelectionChange: setRowSelection,
  getRowId: (row) => row.id,
  getRowCanExpand: (row) => row.original.containers.length > 0,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
});

// details row
const open = row.getIsExpanded() && row.getCanExpand();
const [mounted, setMounted] = useState(open);
useEffect(() => {
  if (open) return setMounted(true);
  const t = setTimeout(() => setMounted(false), 220);
  return () => clearTimeout(t);
}, [open]);
```

- `table.toggleAllRowsExpanded(true)` marks every row as expanded, including rows that cannot expand; check `row.getCanExpand()` before rendering a details row.
- Single expand (one row at a time): set the expanded state to only that row, `setExpanded(row.getIsExpanded() ? {} : { [row.id]: true })`.

## Accessibility

- The trigger's `aria-label`, `aria-expanded` and `aria-controls` (Rules). The header trigger's `aria-label` follows its action ("Expand all bookings", "Collapse all bookings") with `aria-expanded`.
- The details row follows its row in the DOM, so screen reader users meet the details right after the row they opened.
- A subtable in the details has its own accessible name (`aria-label`, or the title wiring of the [Table note](../components/table.md)).
- Contrast: body text (`colors.neutral.900`) on the `colors.neutral.100` content area is 11.77:1.

## Do and don't

| Don't | Do |
|---|---|
| Expansion stored in the row selection state | TanStack's expanded state |
| `aria-expanded` on the chevron icon | `aria-expanded` and `aria-controls` on the `IconButton` |
| A trigger without `aria-label` | `aria-label="Details of BK-1001"` |
| `pointer-events: none` on the details row | A normal row, so its content can be used |
| A details row for a row that cannot expand | Check `row.getCanExpand()` |
| A bare subtable next to other content | The subtable on a card |
| `transform: open ? 'rotate(90deg)' : 'none'` in one `css()` call | Two static classes, joined when open |

## Examples

- Prototype: `.prototype/magenta/apps/prototype/src/screens/table-expand.tsx` (screen `#/table-expand`): selection and expansion in one table, Expand all, a row that cannot expand, a subtable on a card.
- Stories: `TableExpand/TableSingleExpand.stories.tsx`, `TableExpand/TableMultipleExpand.stories.tsx`, `TableExpand/TableMultipleExpandNestedHeader.stories.tsx`.

## Figma to code mapping

Figma sets on the Data Table page. Mapped on 2026-11-09; the state and the visual details were decided with the team that day, the rest has not been reviewed on its own. The usage documentation in Figma is the frame "Expandable-Document" (node `21304:70292`); its anatomy and styles text match the Storybook docs. It also links to the separate "MDS Data Table Document" file, which was not read.

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| Expand-collapse cell · Type | Body | — | the row trigger: `IconButton` (`neutral`, `ghost`, `xs`) with `ChevronRightOutline` |
| Expand-collapse cell · Type | Header | — | the Expand all trigger with `ChevronNextOutline` and a tooltip |
| Expand-collapse cell · Expanded | False / True | `aria-expanded` | `false` / `true`; the chevron turns 90° (Figma swaps to `chevron_down`, and to caret icons in the header) |
| Expand-collapse cell · State | Default / Hover / Focus | — | the `IconButton`'s own states |
| Expand-collapse cell · State | Disable | `disabled` | `true` |
| _Data table row item · Expandable | True | `getRowCanExpand` | `true` for that row |
| _Data table row item · Expanded | True | — | the details row is rendered under the row |
| _Data table row item · Expandable content | Slot | — | the content area: `colors.neutral.100`, padding 16 in code (8 in Figma), items 8 apart |

## Open questions

1. The design page shows the anatomy, Expand and Collapse all, the two content area styles, nested or grouped rows, and expandable rows with fixed columns only as images, which are missing from the source snapshot. Nested or grouped rows and fixed columns with expansion have no story.
2. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) B24): Visual details: Figma's header trigger uses filled carets (`caret_right`, `caret_down`) and Figma pads the content area 8px; the stories use `ChevronNextOutline` and 16px. Decided 2026-11-09 to follow the stories; the Figma set should match.
3. Upstream, for the Magenta team: the stories drive expansion with the row selection state, put `aria-expanded` on the icon, give the triggers no accessible name, block pointer events on the details row, and set widths and paddings with inline styles.
4. Checked 2026-11-09 ([Collapse note](../components/collapse.md)): `onTransitionEnd` runs twice per change (height and opacity), so it can replace the 220ms timer only if the handler allows for that. The details row is unmounted after closing, so its content does not stay in the tab order; a `Collapse` that stays mounted needs `inert` while closed.
