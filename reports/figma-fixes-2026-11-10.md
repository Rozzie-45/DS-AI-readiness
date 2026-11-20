---
type: report
date: 2026-11-10
languages: [vi]
---

# Việc cần sửa trong Figma · 2026-11-10

Gửi team design. File thư viện: [Magenta-Design System - AI](https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR). Theo [ADR 003](../adr/003-code-led-token-pipeline.md) và [AGENTS.md](../AGENTS.md), khi Figma và code khác nhau thì code đúng, Figma cần sửa theo. Danh sách gồm các việc trong phần F của [known issues](known-issues-2026-11-10.md) và các mục "for the design team" trong note.

## Danh sách tổng hợp

| Việc | Note |
|---|---|
| Thêm state warning và success | [Checkbox](../components/checkbox.md), [Radio](../components/radio.md), [Select](../components/select.md), [Input](../components/input.md) |
| Thêm `labelAlignment="inline"` và nút clear | [Input](../components/input.md) |
| Thêm helper text dạng tooltip | [Select](../components/select.md) |
| Thêm màu red cho Link | [Link](../components/link.md) |
| Focus của page item dùng `primary.500` (Figma đang `primary.300`) | [Pagination](../components/pagination.md) |
| Bỏ nút "Show refresh" ẩn | [Pagination](../components/pagination.md) |
| Shadow popover dùng `shadows.lg` | [Popover](../components/popover.md) |
| Hàng đã chọn khi hover dùng `royal.100` | [Data table selection](../patterns/data-table-selection.md) |
| Thêm set split button; đổi tên frame "Button-Document-Overview" trên trang Button group | [ButtonGroup](../components/button-group.md) |
| Thêm set hoặc annotation cho non-modal dialog | [NonModalDialog](../components/non-modal-dialog.md) |
| Xoá set cũ `_Menu List` | [Menu](../components/menu.md) |
| Đổi tên frame trùng: Tabs, Tab group, Tooltip ("Popover-Document-Overview") | [Tabs](../components/tabs.md), [Tab group](../components/tab-group.md), [Tooltip](../components/tooltip.md) |
| Sửa chính tả "Fillled-hover" | [SearchInput](../components/search-input.md) |
| Dialog thiếu property Size cho chữ trong body | [pilot workflow A](archive/workflow-a-pilot-2026-11-04.md) |
| Bảng role màu trong Figma không khớp component | [Color](../foundations/color.md) |
| Tên variable `mag-spacings-*` (code dùng `spacing`) | [Spacing](../foundations/spacing.md) |
| Bỏ icon trái/phải của Breadcrumb item; trang hiện tại không có hover/focus (B2, B3) | [Breadcrumb](../components/breadcrumb.md) |
| Padding Dialog 24px ở mọi size (B5) | [Dialog](../components/dialog.md) |
| Bỏ Resizer ở mép Drawer (B6) | [Drawer](../components/drawer.md) |
| List item padding y 8px; set Lists có padding 12/8/6px (B11) | [List](../components/list.md) |
| Segmented control tối đa 5 item (B14) | [Segmented](../components/segmented.md) |
| Hover Stepper dùng sắc `.400` của màu trạng thái (B16) | [Stepper](../components/stepper.md) |
| Item Timeline cũ dùng icon có chấm màu xám (B18) | [Timeline](../components/timeline.md) |
| Trang Component status: Image là đã phát hành (C3) | [Image](../components/image.md) |

## Chi tiết từ các note

- **ButtonGroup** ([components/button-group.md](../components/button-group.md)): For the design team: there is no split button set in Figma; the documentation frame on the Button group page is named "Button-Document-Overview".
- **Checkbox** ([components/checkbox.md](../components/checkbox.md)): For the design team: add the warning and success states to the Figma Checkbox group set.
- **Drawer** ([components/drawer.md](../components/drawer.md)): Resolved 2026-11-10 (follows the code; [known issues](known-issues-2026-11-10.md) B6): The Figma Drawer has a Resizer on its edge; the code drawer cannot be resized. Is resizing planned, or should the Resizer go from the Figma component?
- **Input** ([components/input.md](../components/input.md)): For the design team: add `labelAlignment="inline"`, the warning and success states, and the clear button to the Figma Text input set.
- **Link** ([components/link.md](../components/link.md)): For the design team: the Figma Link set has no red color; the Storybook docs and code have it.
- **List** ([components/list.md](../components/list.md)): Resolved 2026-11-10 (follows the code; [known issues](known-issues-2026-11-10.md) B11): For the design team: the Figma Lists set has no vertical padding; in code `List` adds 12 / 8 / 6px top and bottom (lg / md / sm).
- **Menu** ([components/menu.md](../components/menu.md)): For the design team: the old `_Menu List` set is still on the Menu page; Menu List_ver 2 replaces it.
- **NonModalDialog** ([components/non-modal-dialog.md](../components/non-modal-dialog.md)): For the design team: add a non-modal dialog set, or an annotation, so designs show it explicitly.
- **Pagination** ([components/pagination.md](../components/pagination.md)): Resolved 2026-11-10 (follows the code; [known issues](known-issues-2026-11-10.md) B13): Table footer: Figma keeps the page size select and result count for both types, sets the count in `body1-semibold` with `colors.neutral.700`, and spaces the parts 16px apart. Storybook drops them for the editable type, uses a `font-bold` class and the default text color, and spaces them 24px apart. Decided 2026-11-06 to follow Storybook; the Figma set should match.
- **Pagination** ([components/pagination.md](../components/pagination.md)): Focus color: Figma draws the focused page item with a `colors.primary.300` border; code uses `colors.primary.500`. Code is right; the Figma set should match.
- **Popover** ([components/popover.md](../components/popover.md)): Shadow: Figma's popover uses `shadows.2xl`, the component `shadows.lg`. The elevation foundation already follows the component; the Figma set should match.
- **Radio** ([components/radio.md](../components/radio.md)): For the design team: add the warning and success states to the Figma Radio button form group set.
- **SearchInput** ([components/search-input.md](../components/search-input.md)): For the design team: the Figma state "Fillled-hover" is misspelled; the Design.mdx "When not to use" list is titled "When to use".
- **Select** ([components/select.md](../components/select.md)): For the design team: add the warning and success states and the tooltip helper type to the Figma Single select and Multiple-select sets.
- **Select** ([components/select.md](../components/select.md)): Resolved 2026-11-10 (follows the code; [known issues](known-issues-2026-11-10.md) D6): For the design team: the "Closable select" text in the documentation (a select closed or hidden after a selection) does not match code, where `clearable` adds a "clear all" button. The note maps Closable to `clearable`.
- **Tab group** ([components/tab-group.md](../components/tab-group.md)): For the design team: the Tab group documentation frame has the same name as the Tabs one.
- **Table** ([components/table.md](../components/table.md)): Resolved 2026-11-10 (follows the code; [known issues](known-issues-2026-11-10.md) B20): Row action size: Figma draws a 24px button with a 16px icon; the Storybook stories use `size="md"` (36px). Decided 2026-11-06 to follow the stories; the Figma set should match. The cell `Button` follows the same choice; that was not reviewed on its own.
- **Tabs** ([components/tabs.md](../components/tabs.md)): For the design team: both documentation frames on the Tabs page are named "Tabs-Document-Overview"; the second one documents tab groups.
- **Tooltip** ([components/tooltip.md](../components/tooltip.md)): For the design team: the documentation frame on the Tooltip page is named "Popover-Document-Overview".
- **Data table columns: resize, reorder, show and hide** ([patterns/data-table-columns.md](../patterns/data-table-columns.md)): Resolved 2026-11-10 (follows the code; [known issues](known-issues-2026-11-10.md) D7): Settings button placement: the stories put it in three places (a floating button, the actions column header in story ColumnsPinning, a toolbar settings menu for reset) and Figma draws an overflow button at the end of the header row. Decided 2026-11-09 to use the floating button; the Figma set should match.
- **Data table editing** ([patterns/data-table-editing.md](../patterns/data-table-editing.md)): Resolved 2026-11-10 (follows the code; [known issues](known-issues-2026-11-10.md) B22): Edit trigger: Figma's Editable document says "Click x1 to edit"; the Storybook docs make double-click the default. Decided 2026-11-09 to follow Storybook; the Figma document should match.
- **Data table expandable rows** ([patterns/data-table-expand.md](../patterns/data-table-expand.md)): Resolved 2026-11-10 (follows the code; [known issues](known-issues-2026-11-10.md) B24): Visual details: Figma's header trigger uses filled carets (`caret_right`, `caret_down`) and Figma pads the content area 8px; the stories use `ChevronNextOutline` and 16px. Decided 2026-11-09 to follow the stories; the Figma set should match.
- **Data table row selection** ([patterns/data-table-selection.md](../patterns/data-table-selection.md)): Selected row on hover: code turns it `colors.royal.100`; Figma's row set draws `colors.neutral.100`. Code is right; the Figma set should match.
- **Data table sorting and filtering** ([patterns/data-table-sort-filter.md](../patterns/data-table-sort-filter.md)): Resolved 2026-11-10 (follows the code; [known issues](known-issues-2026-11-10.md) B26): Figma disables the filter menu's Reset and Apply until the choices change; the story keeps them enabled. Decided 2026-11-09 to follow the story; the Figma set should match.
- **Data table toolbar, download, upload, loading and no results** ([patterns/data-table-toolbar.md](../patterns/data-table-toolbar.md)): Resolved 2026-11-10 (follows the code; [known issues](known-issues-2026-11-10.md) B27): Toolbar visuals: Figma draws a 56px band with 12/8 padding, 16px gaps and a bottom divider, an outline neutral "Add row", separate buttons and an overflow button; Storybook uses 8px gaps, no band, an outline primary "Add New", a `ButtonGroup` for Edit and Delete and a settings button. Decided 2026-11-09 to follow Storybook; the Figma set should match.
