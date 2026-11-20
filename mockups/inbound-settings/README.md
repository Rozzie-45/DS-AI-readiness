# Inbound Settings

Source: Figma frame [inbound-settings/office-setup-rule](https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=40000121-24474) (`40000121:24474`, page "_Draft-Example - DO NOT USE"), read 2026-11-19. It replaces the first frame, [Inbound Settings · 1920](https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=40000084-727893) (`40000084:727893`), which `figma.json` and `spec.md` still describe. · Code built 2026-11-19 with Magenta @ocean-network-express/magenta-react 1.32.0
Open: http://localhost:5173/#/mockup/inbound-settings

## Screen type
A settings page with one tab holding a data table: page header, tabs, table toolbar (sync status, Sync, row actions, Add Rule, settings), a 16-column table with multiple selection, filter triggers on every column, a pinned row action column with its menu, a show and hide columns trigger, and a footer with page size, result count and pagination. Follows the [toolbar](../../patterns/data-table-toolbar.md), [selection](../../patterns/data-table-selection.md), [sort and filter](../../patterns/data-table-sort-filter.md), [columns](../../patterns/data-table-columns.md) and [sticky header and pinned columns](../../patterns/data-table-sticky-pinning.md) patterns.

## Mapping
| Region / element in the source | Magenta | Props and notes |
|---|---|---|
| `[SRM]Page_tab` | `Tabs` › `TabHeader` › `TabList` › `TabListItem`, `TabPanels` › `TabPanel` | `size="responsive"`, `defaultIndex={0}`; no left padding on the tab or the panel, as in the frame |
| Data table | `TableContainer` with toolbar, scroll region and footer | No container padding, so the table runs edge to edge; toolbar padding 16 and items 16 apart (`Data table toolbar v1.2`); footer padding 8 / 24 |
| Last sync | `RenewOutline` (16) and `Text` body1 `neutral.700` | The frame uses the `renew` icon, not `refresh` |
| Sync | `Button` outline secondary, `RenewOutline` | |
| Icon button group | `ButtonGroup` of `IconButton`s in `Tooltip`s | Disabled until a row is selected |
| Add Rule | `Button` outline primary, `AddOutline` | |
| Table setting | `IconButton` outline neutral `GearSettingOutline` in a `Tooltip` | Label and tooltip "Priority Tier Configuration", from the frame's tooltip |
| Header cells | `Th` with `width` from the frame (120 to 320) and a ghost `IconButton` size `xs` `SortFilterListOutline` | Labels truncate with an ellipsis; POD Country and Inbound Office Email are required (red asterisk, hidden "(required)") |
| Status tags (`*`, A/N, D/O, standard) | `Tag size="responsive"` light, upper case (Tag Type=Status) | neutral, blue, primary, secondary |
| Value with "+N more" (Badge) | Value, then `Indicator text label="+4 more"` neutral light under it, gap `4` | Figma's Badge maps to `Indicator` with `text` |
| Updated By | `Avatar size="xs"` and the name, then `Tag size="md"` neutral with the office | Fixed sizes: the frame uses Avatar xs and Tag Medium at every width |
| Updated Time | Date and time on two lines | Copied as in the frame (`2026-30-07`, `12:25`) |
| Action | `Th` / `Td` `columnPinningPosition="right"` `right={48}` `width={120}` `isColumnPinningLastOrFirst`; `DropdownMenu` with `IconButton` `MenuMoreVerticalOutline` | Fixed at the end, with the edge shadow the frame shows (`before shadow`). Menu items from the frame: Issue Delivery Order, Full CTNR Release, Arrival Information |
| show/hide col (Header cell item ver 1.2) | Last `Th`, pinned `right={0}` `width={48}`, with a ghost neutral `IconButton` `sm` `TableEditOutline` in a `Tooltip`; an empty pinned `Td` in each row | As the frame: its own 48px header cell after Action, not a floating button. The menu is not built |
| Data table footer | The system's table footer from the Pagination note: `Select` ("Show 10/20/30 items", `aria-label="Items per page"`) and `Text` body1-semibold "Total 199 results" at the left, `Pagination type="editable" withEdges` at the right | As the frame. The user chose this on 2026-11-19 |

## Gaps
- **App header and side navigation** (`[COMMON] NavBar 1.0`, `[SRM]Local_menu`): Magenta has no app shell. Plain `header` (`sizes.48`) and `nav` with library icons, `Text` and tokens. The local menu's expand button and active item are not built.
- **Page header** (`[SRM]Page_header`): `Text` h4 and body1 in a `div`.
- **Mark column** (44px, `Cell item/mark`) and the **expand cell**: empty in every visible row and with no header, so their content is unknown; left out.

## Differences from the source
- **Follows the code, not Figma**: cells place their content at the top (`Td` `vertical-align: top`); the frame centres it.
- **Overrides of component styles**, to match the frame (2026-11-19, asked by the user): `Tabs` loses its card look (`boxShadow: 'none'`, `borderRadius: '0'`; by default `shadows.sm` and `radii.lg`), `TabPanel`'s 16px padding is reset from `Tabs` with the selector `& .mag-tab-panel__base` (the panel puts `className` on an inner element), and `TableContainer` gets `p: 0` and hides its empty title block with `& .mag-table__textContainer`. Both selectors use Magenta's internal class names and can break on an update; a padding prop on `TabPanel` and `TableContainer` would be the clean fix (report to the Magenta team).
- **Action edge shadow**: the [pinning pattern](../../patterns/data-table-sticky-pinning.md) says the actions column draws no edge shadow (story ColumnsPinning); the frame draws one, and the mockup follows the frame.
- **Pagination footer**: built with the page size select, the count and first and last buttons beside the editable pagination, as the frame shows (user's choice, 2026-11-19). [The Pagination note](../../components/pagination.md) was updated the same day: both footer types now have the select, the count and `withEdges`.
- The 12th row, partly visible in the frame (a second "0000001"), is left out as a likely duplicate.
- Filter menus and the columns menu are triggers only.
- `figma.json` and `spec.md` describe the first frame. The new frame is built from local composites (`Data table`, `[SRM]…`), and `read-frame.plugin.js` keeps each instance as one node, so its spec would show one "Data table" with no mapping. The table here was read node by node instead.

## Checks
- evals/check.mjs: 4/5. The size check flags `<Tag size="md">` in the Updated By cell, a fixed size the frame asks for; the other checks (imports, raw controls, props, tokens) pass.
- Screenshots: result-1024.png, result-1280.png, result-1920.png (no console errors or failed requests)
