---
type: report
date: 2026-11-10
languages: [vi, en]
---

# Lỗi upstream gửi team Magenta · 2026-11-10

Danh sách lỗi trong package `@ocean-network-express/magenta-react` (snapshot `5842dc1`) tìm thấy khi viết các note của vault, kèm đường dẫn code. Mỗi mục lấy từ phần "Upstream, for the Magenta team" trong Open questions của note tương ứng; chi tiết và cách đo nằm trong note. Nội dung lỗi để tiếng Anh để dán thẳng vào tracker.

*Issues in the Magenta package found while documenting it, grouped by component, with the code paths. Each comes from the "Upstream" item of the note's Open questions; the note has the details and how it was measured.*

Tổng: 60 nhóm.

## Hành vi và docs cần sửa (từ known issues 2026-11-10)

Các mục trong [known issues](known-issues-2026-11-10.md) được trả lời "theo code" nhưng cần Magenta sửa code hoặc docs. *Behaviour gaps and docs to fix, from the known issues list.*

| Mục | Vấn đề | Trả lời |
|---|---|---|
| A2 | [Carousel](../components/carousel.md): autoplay không có nút tạm dừng và vẫn chạy khi rê chuột (WCAG 2.2.2). | Theo code: không có nút pause, `stopOnMouseEnter` mặc định `false`. Note giữ cách bù; báo upstream. |
| A3 | [Carousel](../components/carousel.md): slide đang khuất không bị ẩn khỏi trình đọc màn hình và không có tên. | Theo code: slide khuất không bị ẩn. Note giữ cách bù (`aria-label="n of N"`); báo upstream. |
| A4 | [FormCheck](../components/form-check.md): `required` chỉ thêm dấu `*`, không đặt `aria-required` cho control. | Theo code: chỉ có dấu `*`. Note giữ cách bù (ghi "required" bằng chữ); báo upstream. |
| A5 | [FormCheck](../components/form-check.md), [Checkbox](../components/checkbox.md), [Radio](../components/radio.md), [Segmented](../components/segmented.md): group label là `<fieldset>` chỉ chứa chữ; `aria-invalid` gắn sai phần tử; radio group và Segmented dùng `role="group"` thay vì `radiogroup`. | Theo code: giữ cấu trúc hiện tại. Báo chung một lỗi upstream. |
| A6 | [Image](../components/image.md): Lightbox không có nút đóng và không đưa focus vào trong. | Theo code: không có nút đóng, đóng bằng Escape hoặc click ra ngoài. Báo upstream. |
| A7 | [Image](../components/image.md): overlay "Preview" chỉ hiện khi rê chuột, không hiện khi focus. | Theo code: overlay chỉ hiện khi hover. Báo upstream. |
| A8 | [InlineEdit](../components/inline-edit.md): Escape không huỷ, Enter không lưu. | Theo code: không có phím tắt; dùng nút Cancel và Save. Báo upstream. |
| A9 | [InlineEdit](../components/inline-edit.md): tên của nút ẩn chỉ có label, không có giá trị hiện tại. | Theo code: tên là label. Báo upstream. |
| A10 | [Stepper](../components/stepper.md): step dùng `role="tab"` nhưng không có `aria-selected`, không có panel, mũi tên không di chuyển. Có nên đổi sang list với `aria-current="step"`? | Theo code: giữ `tablist`/`tab`. Note giữ cách bù; báo upstream. |
| A11 | [TreeView](../components/tree-view.md): không có cách chọn nhiều item chỉ bằng bàn phím, và không có `aria-multiselectable`. | Theo code: chỉ chọn nhiều bằng Ctrl/Shift + click. Báo upstream. |
| A12 | [Data table columns](../patterns/data-table-columns.md): không có cách resize cột bằng bàn phím (WCAG 2.5.7). | Theo code (story): chỉ chuột và cảm ứng; bàn phím có "Reset Columns Size". Báo upstream. |
| A13 | [Data table editing](../patterns/data-table-editing.md): không có cách bắt đầu sửa ô bằng bàn phím (WCAG 2.1.1). Đề xuất của note: ô focus được, Enter hoặc F2 để sửa. | Theo code (story): double-click. Báo upstream. |
| A14 | [Accordion](../components/accordion.md): Divider vẫn được vẽ khi item đóng, nên đáy item có hai đường kẻ. Có chủ ý không? | Theo code: divider luôn được vẽ. Ghi là hành vi hiện tại; báo upstream. |
| A16 | [Breadcrumb](../components/breadcrumb.md): docs nói mặc định thu gọn "item đầu và 2 item cuối", nhưng code chỉ thu gọn khi có `limit`. Có nên mặc định `limit={3}`? | Theo code: chỉ thu gọn khi có `limit`. Docs cần sửa. |
| A17 | [Breadcrumb](../components/breadcrumb.md): docs nói có thể "ưu tiên item cụ thể", nhưng code không hỗ trợ. | Theo code: không hỗ trợ. Docs cần sửa. |
| A19 | [Dialog](../components/dialog.md): docs gợi ý đặt dialog gần nút mở, nhưng `Dialog` luôn ở giữa màn hình. | Theo code: Dialog luôn ở giữa. Docs cần sửa. |
| A24 | [Image](../components/image.md): docs mô tả zoom in/out trong preview, nhưng Lightbox không có. | Theo code: không có zoom. Docs cần sửa. |
| A27 | [Progress](../components/progress.md): `CircularProgress` với `size="responsive"` không bao giờ hiện số. Lỗi? | Theo code: không hiện số với `responsive`. Note giữ cách dùng size cố định; báo upstream (lỗi recipe). |
| B11 | [List](../components/list.md): docs và Figma cho item padding y 6/4; code dùng 8. Figma Lists không có padding dọc, code có 12/8/6. | Theo code: item padding y 8px; `List` thêm 12/8/6px trên dưới. Figma và docs cần sửa. |
| B28 | [Typography](../foundations/typography.md): lỗi `body3` ở size `lg`; Display 1–3 và các style gạch chân chỉ có trong Figma. Thêm vào code hay đánh dấu "chỉ Figma"? | Theo code: `body3` ở `lg` ra 10/12 (lỗi, báo upstream); Display 1–3 và gạch chân là "chỉ có trong Figma". |
| D4 | [Popover](../components/popover.md): Popover chỉ mở bằng click; hover/focus thì dùng `Tooltip`. Docs Popover cần sửa theo. | Theo code: Popover chỉ mở bằng click; hover và focus dùng `Tooltip`. Docs cần sửa. |

## Rule CSS không bao giờ được áp dụng (kiểm 2026-11-10)

So computed style của 34 screen prototype (1024, 1280, 1920px, cả overlay đang mở) giữa CSS gốc `magenta-react/index.css` và CSS cũ của prototype. Hai rule của recipe bị một recipe nạp sau trong `index.css` ghi đè, nên không bao giờ có tác dụng. *Recipe rules that a later recipe in `index.css` always overrides.*

- [NumberInput](../components/number-input.md): `numberInput` base sets `width: 250px; display: inline-grid`; `inputContainer` (later in `index.css`) sets `display: flex; width: fit-content`. The field follows its content. Code: `packages/css/src/recipes/numberInput.ts`.
- [FormCheck](../components/form-check.md): `formCheck` helperText sets `display: inline-flex`; `inputHelperText` (later) sets `inline-block`. Code: `packages/css/src/recipes` (formCheck, inputHelperText).
- Date and time pickers ([DatePicker](../components/date-picker.md), [DateRangePicker](../components/date-range-picker.md), [TimePicker](../components/time-picker.md)), package `magenta-react-dates`: the trigger divider in `dateTimeInput` (`iconButton` slot) is written `1px solid var(--mag-colors-neutral-300)` instead of `token(borders.1)` and `token(colors.neutral.300)`. Code: `packages/css/src/recipes/DatePicker/dateTimeInput.ts`.

## Đề xuất token mới

- `zIndex.sticky` = 2 trong `packages/css/src/tokens.ts`, cho header dính của bảng nằm trên ô ghim (`zIndex.above` = 1, đặt trong `packages/css/src/recipes/Table/tableCell.ts`). Lý do, các lựa chọn và cách đo: [ADR 004](../adr/004-sticky-z-index-token.md). *Proposed token: `zIndex.sticky` = 2 for sticky table headers over pinned cells; see ADR 004.*

## Theo component

### Accordion

Note: [components/accordion.md](../components/accordion.md)  
Code: `packages/react/src/components/Accordion/Accordion.tsx`, `packages/react/src/components/Accordion/Accordion.model.ts`, `packages/react/src/components/Accordion/hooks/useAccordion.tsx`, `packages/react/src/components/Accordion/AccordionItem/AccordionItem.tsx`, `packages/react/src/components/Accordion/AccordionControl/AccordionControl.tsx`, `packages/react/src/components/Accordion/AccordionPanel/AccordionPanel.tsx`, `packages/css/src/recipes/Accordion/accordion.ts`, `packages/css/src/recipes/Accordion/accordionItem.ts`

- End does nothing when the last item is disabled; the contract lists a `component` prop on `AccordionControl` and `AccordionItem` (from `OverridableComponentProps`), but both always render a `button` and a `div`; `AccordionItem` checks only that it has two children, not which; the recipe uses raw transition durations (`200ms`).

### Autocomplete

Note: [components/autocomplete.md](../components/autocomplete.md)  
Code: `packages/react/src/components/Autocomplete`

- there is no `loading` prop, though Figma has a Loading state; the stories build it with `renderRightContent` and `emptyOption`.

### Avatar

Note: [components/avatar.md](../components/avatar.md)  
Code: `packages/react/src/components/Avatar`, `packages/css/src/recipes/Avatar`

- No presence indicator; Figma and the docs have one.
   - The initials use the `body1` text style, which follows the viewport, not the avatar size; Figma shrinks them with the avatar (10/12 at 2xs to 15/24 at md and larger).
   - The default icon is named "avatar-default-icon" when there is no `alt`; letter avatars have no accessible name of their own.
   - The Colors story sets a background with a hex color (`#7B49B8`).

### Breadcrumb

Note: [components/breadcrumb.md](../components/breadcrumb.md)  
Code: `packages/react/src/components/Breadcrumb/Breadcrumb.tsx`, `packages/react/src/components/Breadcrumb/BreadcrumbItem.tsx`, `packages/react/src/components/Breadcrumb/BreadcrumbOverflow.tsx`, `packages/react/src/components/Breadcrumb/Breadcrumb.model.ts`, `packages/css/src/recipes/breadcrumb.ts`

- no `aria-current="page"` on the current page; the "..." button and the icon button have no accessible name; the icon action cannot be triggered by keyboard because `Breadcrumb` gives the button no `onClick`; overflow items are `MenuItem`s inside links and arrow keys do not move between them; closing the overflow menu drops focus to the body; the overflow button sets `paddingInline: 4` inline.

### ButtonGroup

Note: [components/button-group.md](../components/button-group.md)  
Code: `packages/react/src/components/Button/ButtonGroup/ButtonGroup.tsx`, `packages/css/src/recipes/buttonGroup.ts`

- `ButtonGroup` accepts `color` and `variant`, but the docs allow only the outline neutral style.
   - The split button story uses a `Popover` with plain `ListItem`s (no menu roles) and a chevron button with no accessible name; a list of actions belongs in a `DropdownMenu` ([Popover note](../components/popover.md)).

### Button

Note: [components/button.md](../components/button.md)  
Code: `packages/react/src/components/Button/Button.tsx`, `packages/react/src/components/Button/Button.model.ts`, `packages/react/src/components/Button/BaseButton/BaseButton.tsx`, `packages/css/src/recipes/button.ts`, `packages/css/src/recipes/iconButton.ts`

- the docs and Figma describe "Button on color" for colored backgrounds, but the package has no such variant. The "Button types" table of the Figma documentation frame still holds template text ("Click to customize! You can add or remove any columns in your table").

### Carousel

Note: [components/carousel.md](../components/carousel.md)  
Code: `packages/react/src/components/Carousel/Carousel.tsx`, `packages/react/src/components/Carousel/CarouselSlides.tsx`, `packages/react/src/components/Carousel/CarouselSlide.tsx`, `packages/react/src/components/Carousel/CarouselControl.tsx`, `packages/react/src/components/Carousel/CarouselIndicator.tsx`, `packages/react/src/components/Carousel/models`, `packages/react/src/components/Carousel/hooks/engines/AutoplayPlugin.ts`, `packages/css/src/recipes/Carousel`

- a JSDoc block between `export const` and `CarouselPrevious` hid it from the contract script (fixed in `scripts/build-contracts.mjs` on 2026-11-09); the recipes use raw values (`opacity` levels, `0.2s`).

### Checkbox

Note: [components/checkbox.md](../components/checkbox.md)  
Code: `packages/react/src/components/Checkbox/Checkbox.tsx`, `packages/react/src/components/Checkbox/hooks/useIndeterminate.ts`, `packages/react/src/components/FormCheck/FormCheck.tsx`, `packages/css/src/recipes/checkbox.ts`, `packages/css/src/recipes/formCheck.ts`

- `FormCheck` has no prop for a multi-column layout; the note uses `radioGroupClassName`, whose name also suggests it was meant for `Radio`.
- `FormCheck` renders its label inside a `<fieldset>` element and the checkboxes in a separate `role="group"` element; a `<fieldset>` with a `<legend>` wrapping the checkboxes is the usual pattern. The check mark is the text character "✓" in the system font, so it may look different on each platform.

### Collapse

Note: [components/collapse.md](../components/collapse.md)  
Code: `packages/react/src/components/Collapse/Collapse.tsx`, `packages/react/src/components/Collapse/Collapse.model.ts`, `packages/react/src/components/Collapse/hooks/useCollapse.tsx`, `packages/css/src/recipes/collapse.ts`

- closed content stays focusable inside an `aria-hidden` wrapper; with `collapsedHeight`, the visible part is also `aria-hidden`; `onTransitionEnd` is typed as taking no argument but runs for every transition that bubbles up (height and opacity), with the event; the docs' examples give the trigger no `aria-expanded` or `aria-controls`.

### CompactWrapper

Note: [components/compact-wrapper.md](../components/compact-wrapper.md)  
Code: `packages/react/src/components/CompactWrapper/CompactWrapper.tsx`, `packages/css/src/recipes/compactWrapper.ts`

- `CompactWrapper` has no `role`, no label link and no `disabled`, so every page must wire the label, group name and helper text by hand.
   - There is no label-left option, though Figma has one.

### Dialog

Note: [components/dialog.md](../components/dialog.md)  
Code: `packages/react/src/components/Dialog/DefaultDialog`, `packages/css/src/recipes/Dialog`

- the dialog is described by the whole `DialogContent`, which can hold a form or a table; the Storybook anatomy names the overlay color `--mag-color-background-overlay @50`, but the variable is `--mag-colors-background-overlay-50`.

### Divider

Note: [components/divider.md](../components/divider.md)  
Code: `packages/react/src/components/Divider/Divider.tsx`, `packages/react/src/components/Divider/Divider.model.ts`, `packages/css/src/recipes/divider.ts`

- the Divider page's changelog tab shows the Checkbox changelog (`getComponentChangelog('Checkbox')`), and the stories size vertical dividers with inline styles.

### Drawer

Note: [components/drawer.md](../components/drawer.md)  
Code: `packages/react/src/components/Drawer/Drawer.tsx`, `packages/react/src/components/Drawer/DrawerHeader.tsx`, `packages/react/src/components/Drawer/DrawerBody.tsx`, `packages/react/src/components/Drawer/hooks/useDrawer.ts`, `packages/react/src/components/Drawer/models/Item.model.ts`, `packages/react/src/components/Dialog/DefaultDialog/DialogHeaderCloseButton.tsx`, `packages/css/src/recipes/Drawer/drawer.ts`, `packages/css/src/recipes/Drawer/drawerWrapper.ts`

- the JSDoc of `returnFocus` says "Unique identifier for floating UI hooks."; the close button's name "close dialog" cannot be changed or translated; `DrawerHeader` and `DrawerBody` type their ref as `HTMLHRElement`; the recipe uses raw values (`400ms`, `3.25rem`, `0.875rem`, `0.9375rem`); the code docs talk about "dialog" in the Escape and outside-click sections.

### Feedback messages

Note: [components/feedback-messages.md](../components/feedback-messages.md)  
Code: `packages/react/src/components/FeedbackMessages`, `packages/css/src/recipes/FeedbackMessages`

- `Banner`'s description says banners are not dismissible, but it renders `InlineBanner`, whose `closable` defaults to `true`.
   - Each message in the `FeedbackMessages` stack has `role="menuitem"` outside any menu.
   - Alert and toast text is 15/24 (`fontSizes.md` / `lineHeights.2xl`) at every `size`.

### HelperText

Note: [components/helper-text.md](../components/helper-text.md)  
Code: `packages/react/src/components/InputAtoms/InputHelperText/HelperTextComponent.tsx`, `packages/css/src/recipes/InputAtoms/inputHelperText.ts`, `packages/react/src/components/Input/Input.tsx`, `packages/react/src/components/CompactWrapper/CompactWrapper.tsx`

- `HelperText` sets no `id` and no live region, so standalone uses must be linked and announced by hand; its JSDoc and docs do not say so. With `size="responsive"` the text is 10px below 1280px.

### IconButton

Note: [components/icon-button.md](../components/icon-button.md)  
Code: `packages/react/src/components/IconButton/IconButton.tsx`, `packages/css/src/recipes/button.ts`, `packages/css/src/recipes/iconButton.ts`

- no story gives an `IconButton` an `aria-label`, and the component does not require one.

### Image (Image, ImageBase, Lightbox)

Note: [components/image.md](../components/image.md)  
Code: `packages/react/src/components/Image/Image.tsx`, `packages/react/src/components/Image/Image.model.ts`, `packages/react/src/components/Image/ImageBase/ImageBase.tsx`, `packages/react/src/components/Image/Overlay/Overlay.tsx`, `packages/react/src/components/Lightbox/Lightbox.tsx`, `packages/react/src/components/Lightbox/Lightbox.model.ts`, `packages/css/src/recipes/image.ts`, `packages/css/src/recipes/Lightbox/lightbox.ts`

- the caption is `colors.neutral.500`, below 4.5:1 on white; the non-preview wrapper is a `div` with a `disabled` attribute; the loading layer has no accessible state; Lightbox's `title` and `LightboxCloseReason` `close-icon` have no matching feature; the Overlay uses raw `0.1s`.

### Indicator

Note: [components/indicator.md](../components/indicator.md)  
Code: `packages/react/src/components/Indicator/Indicator.tsx`, `packages/css/src/recipes/Indicator`

- the badge has no role or accessible link to the element it sits on.

### InlineEdit

Note: [components/inline-edit.md](../components/inline-edit.md)  
Code: `packages/react/src/components/InlineEdit/InlineEdit.tsx`, `packages/react/src/components/InlineEdit/InlineEditWrapper.tsx`, `packages/react/src/components/InlineEdit/InlineEditControl.tsx`, `packages/react/src/components/InlineEdit/InlineEditView.tsx`, `packages/react/src/components/InlineEdit/InlineEdit.models.ts`, `packages/css/src/recipes/InlineEdit/InlineWrapper.ts`, `packages/css/src/recipes/InlineEdit/InlineView.ts`

- focus is lost after Save and Cancel; the Cancel and Save names are fixed English strings; the recipe uses raw values (icon `16`/`20`, `0.2s`).

### Input

Note: [components/input.md](../components/input.md)  
Code: `packages/react/src/components/Input/Input.tsx`, `packages/react/src/components/Input/Input.model.ts`, `packages/react/src/components/InputAtoms`, `packages/css/src/recipes/input.ts`

- the password show/hide button has no accessible name (`aria-label`); the clear button has one ("Clear input").

### Link

Note: [components/link.md](../components/link.md)  
Code: `packages/react/src/components/Link/Link.tsx`, `packages/css/src/recipes/link`

- `Link` has no gap between label and icon; the story spaces the icon with an inline style.
   - The `underline` type allows `"always"` and `"hover"`, but the recipe also has `"never"`.
   - The default `tabIndex={0}` is set on every link, also one without `href`.

### List

Note: [components/list.md](../components/list.md)  
Code: `packages/react/src/components/List`, `packages/css/src/recipes/List`

- no drag and drop for lists (Figma has a Dnd handle and a grabbing item), and no error state component (the note uses `ListEmpty` with an error icon).
- `ListItem` always has `role="option"`, even in a plain `List` that is not a listbox; an interactive item renders a `<button>` directly inside the `<ul>`; `ListEmpty` and `ListLoading` render a `<div>` inside the `<ul>`.

### Menu

Note: [components/menu.md](../components/menu.md)  
Code: `packages/react/src/components/Menu`, `packages/css/src/recipes/Menu`, `packages/css/src/recipes/popover.ts`

- Resolved 2026-11-10 (follows the code; [known issues](known-issues-2026-11-10.md) Q18): child menus keep the same `shadows.lg` as their parent.
   - `CollapsibleMenuItem` puts `role="button"` and `aria-expanded` on the chevron icon, not on the item.
   - The `placement` description says the default is `bottom`; the code uses `bottom-start` (and `right-start` for a child menu).

### NonModalDialog

Note: [components/non-modal-dialog.md](../components/non-modal-dialog.md)  
Code: `packages/react/src/components/Dialog/NonModalDialog`, `packages/react/src/components/Resizeable`

- Code.mdx says `dragOffsetTop` defaults to 80px; code uses 0. Code.mdx also mentions three close reasons but lists two.

### NumberInput

Note: [components/number-input.md](../components/number-input.md)  
Code: `packages/react/src/components/NumberInput/NumberInput.tsx`, `packages/react/src/components/NumberInput/NumberInput.model.ts`, `packages/react/src/components/NumberInput/hooks`, `packages/css/src/recipes/numberInput.ts`

- the arrow and stepper buttons have no accessible name and only `aria-roledescription` values like "increase-button"; they respond to pointer events only. The field sets no `inputMode`, so phones show a full keyboard.

### Pagination

Note: [components/pagination.md](../components/pagination.md)  
Code: `packages/react/src/components/Pagination/Pagination.tsx`, `packages/react/src/components/Pagination/hooks/usePagination.ts`, `packages/css/src/recipes/pagination.ts`

- the "..." truncation is a plain `<div>` that screen readers read as text; the "of 10" text is not linked to the page input; an emptied page input stays empty after the user leaves it; the root sets `role="navigation"` on a `<nav>`, which already has that role.
- the `md` page input width is a raw value (`3.25rem`) in the recipe.

### Popover

Note: [components/popover.md](../components/popover.md)  
Code: `packages/react/src/components/Popover/Popover.tsx`, `packages/react/src/components/Popover/PopoverTrigger.tsx`, `packages/react/src/components/Popover/PopoverContent.tsx`, `packages/react/src/components/Popover/hooks/useFloatingPopover.ts`, `packages/css/src/recipes/popover.ts`

- `PopoverContent` sets `returnFocus={false}`, so focus is lost when the popover closes; the docs' Inline example uses third-party character text as sample copy.

### Progress (LinearProgress, CircularProgress)

Note: [components/progress.md](../components/progress.md)  
Code: `packages/react/src/components/Progress/LinearProgress.tsx`, `packages/react/src/components/Progress/CircularProgress.tsx`, `packages/react/src/components/Progress/Progress.model.ts`, `packages/react/src/components/Progress/hooks.ts`, `packages/css/src/recipes/Progress/linear.ts`, `packages/css/src/recipes/Progress/circular.ts`

- the default accessible names are fixed English strings; out-of-range values log a warning on every render; the recipes use raw values (`minWidth: 320`, stroke widths `1.6px`, `2px`, `2.5px`, `0.3s`); the inner circle has `stroke="#000000"` overridden by the recipe.

### Radio

Note: [components/radio.md](../components/radio.md)  
Code: `packages/react/src/components/Radio/Radio.tsx`, `packages/react/src/components/FormCheck/FormCheck.tsx`, `packages/css/src/recipes/radio.ts`

- A radio group should have `role="radiogroup"`; `FormCheck` gives every group `role="group"`.
   - The hover and focus halos are hard-coded hex colors in the SVG (`#F8E7F1`, `#EBB7D5`), copies of `primary.100` and `primary.200`, not tokens.

### SearchInput

Note: [components/search-input.md](../components/search-input.md)  
Code: `packages/react/src/components/SearchInput/SearchInput.tsx`, `packages/react/src/components/SearchInput/SearchInputOption.tsx`

- The input has no `role="combobox"`, `aria-expanded` or `aria-controls` when it shows suggestions.
   - The clear button is named "clear all tags", copied from the tags input.
   - There is no prop to run the search on Enter or to hide the search icon.

### Segmented

Note: [components/segmented.md](../components/segmented.md)  
Code: `packages/react/src/components/Segmented/Wrapper.tsx`, `packages/react/src/components/Segmented/Item.tsx`, `packages/react/src/components/Segmented/hooks/useSegmentedNavigation.ts`, `packages/css/src/recipes/Segmented/Wrapper.ts`, `packages/css/src/recipes/Segmented/Item.ts`

- Home and End select disabled items; the container has no name by default; the item recipe uses raw values (`2px` borders); a code comment says labels should be wrapped in `Text` for consistent typography.

### Select

Note: [components/select.md](../components/select.md)  
Code: `packages/react/src/components/Select/Select.tsx`, `packages/react/src/components/Select/SelectOption.tsx`, `packages/react/src/components/Select/hooks/useFloatingSelect.ts`, `packages/react/src/components/Select/models/Select.model.ts`, `packages/css/src/recipes/Select/select.ts`, `packages/css/src/recipes/Select/selectOption.ts`

- there is no prop for a fixed field height that scrolls; the story sets it with a `className`. The clear button's accessible name is "clear all tags", also on a single select.

### Shortcut

Note: [components/shortcut.md](../components/shortcut.md)  
Code: `packages/react/src/components/Shortcut/Shortcut.tsx`, `packages/react/src/components/Shortcut/models/Shortcut.model.ts`, `packages/css/src/recipes/shortcut.ts`

- the shortcut renders `type="submit"` by default (as `Button` does) and sets no `aria-pressed` for the active preset.

### Spinner

Note: [components/spinner.md](../components/spinner.md)  
Code: `packages/react/src/components/Spinner/Spinner.tsx`, `packages/css/src/recipes/spinner.ts`

- the spinner has no accessible name and no status role, and no component wraps it with loading text except `ListLoading`.

### Stepper

Note: [components/stepper.md](../components/stepper.md)  
Code: `packages/react/src/components/Stepper/Stepper.tsx`, `packages/react/src/components/Stepper/Step.tsx`, `packages/react/src/components/Stepper/StepIcon.tsx`, `packages/react/src/components/Stepper/StepConnector.tsx`, `packages/react/src/components/Stepper/hooks/useStepStatus.ts`, `packages/react/src/components/Stepper/models`, `packages/css/src/recipes/Stepper`

- the recipe sets raw values (`2px` line). (Hover uses `colors.blue.400` and `colors.green.400`; since 2026-11-10 these are the foundation's roles for stepper hover, following the code.)

### Tab group

Note: [components/tab-group.md](../components/tab-group.md)  
Code: `packages/react/src/components/Tabs/TabListGroup.tsx`, `packages/react/src/components/Tabs/TabColorPicker.tsx`, `packages/css/src/recipes/Tabs/tabListGroup.ts`

- the group menu in code has only the color picker; rename, ungroup, delete group, show or hide all tabs, and the per-tab menu are missing.
- the group label is a `Tag` whose delete slot holds the color button, so the label nests one control inside another; the wrapper's `aria-label` is the generic "tab list group", not the group name.

### Table

Note: [components/table.md](../components/table.md)  
Code: `packages/react/src/components/Table`, `packages/react/src/components/index.ts`, `packages/css/src/recipes/Table`

- `TableContainer` always renders the title block. Without a title, the empty block keeps its 16px bottom padding and 2px gap, so the table starts 34px from the container's top instead of 16px (measured in the prototype). Decided 2026-11-06: always use `TableContainer` with a title, and report this. The title and description are `<p>` elements that the table is not linked to, and the `component` prop in its type is ignored.
- `disabled` on `Tr` has no visible style, only `aria-disabled` and a not-allowed cursor, and Figma has no disabled row. Decided 2026-11-06: use it as the code does and report it.
- `Tr` sets `aria-selected` on a row of a plain table. The attribute belongs to grid and treegrid rows, so screen readers may not announce it; the selection checkbox has to carry the state.
- Figma draws the thin custom scrollbar that Magenta's `scrollable` utility gives, but the code puts that utility on `Tbody`, which never scrolls. The `TableContainer` that does scroll shows the browser's scrollbar.

### Tabs

Note: [components/tabs.md](../components/tabs.md)  
Code: `packages/react/src/components/Tabs`, `packages/css/src/recipes/Tabs`

- Tabs and panels are not linked (no `aria-controls` on a tab, no `aria-labelledby` on a panel).
   - The close icon is a `span` with `tabIndex={-1}`, so keyboard users cannot close a tab.
   - `deletable` can only be set on `Tabs`, for every tab; Code.mdx says to pass it to the tab. Code.mdx also names the uncontrolled prop `defaultValue`; the prop is `defaultIndex`.
   - There is no overflow tab; Figma has one.
   - The divider between tabs is 1px wide through `spacing.1` rather than `borders.1`. (Since 2026-11-10 the spacing foundation gives `spacing.1` this role, following the code.)

### Tag

Note: [components/tag.md](../components/tag.md)  
Code: `packages/react/src/components/Tag/Tag.tsx`, `packages/react/src/components/Tag/Tag.model.ts`, `packages/css/src/recipes/Tag/tag.ts`, `packages/css/src/recipes/Tag/utils.ts`

- Figma has a status type with an all-caps text style; code has no status type, no uppercase option and no all-caps text style token. The note uses a `className`.
- the Group and WithIcons stories combine `interactive` and `deletable`, which puts the close control (a `span` with `role="button"`) inside the tag's `<button>`. The note forbids the combination.
- the close button's accessible name is "delete" plus a generated id, not the tag's label; the tag sets `aria-selected` on an element whose role does not support it; `TagContent` sets `aria-description="tag-content"` as a style hook, which screen readers may read out.

### TagsInput

Note: [components/tags-input.md](../components/tags-input.md)  
Code: `packages/react/src/components/TagsInput`

- no `loading` prop though Figma has a Loading state; the field has no group role or count of tags for screen readers; `labelAlignment="inline"` is not supported, unlike the other fields.

### Textarea

Note: [components/textarea.md](../components/textarea.md)  
Code: `packages/react/src/components/Textarea/Textarea.tsx`, `packages/css/src/recipes/textarea.ts`, `packages/css/src/recipes/input.ts`

- `resizable={true}` resizes both ways, though the docs say only the height; the count has no live region, so screen readers do not hear it change.

### Timeline

Note: [components/timeline.md](../components/timeline.md)  
Code: `packages/react/src/components/Timeline/Timeline.tsx`, `packages/react/src/components/Timeline/TimelineItem.tsx`, `packages/react/src/components/Timeline/models`, `packages/css/src/recipes/Timeline/timeline.ts`, `packages/css/src/recipes/Timeline/utils.ts`, `packages/css/src/recipes/Stepper/step.ts`

- the default icon gets `color` as an SVG attribute, so `blue`, `green`, `orange`, `purple` and `red` render as CSS named colors; `allowItemSelect` and `onItemClick` are commented out in the model; the recipe uses a raw `4px` margin.

### Toggle

Note: [components/toggle.md](../components/toggle.md)  
Code: `packages/react/src/components/Toggle/Toggle.tsx`, `packages/css/src/recipes/toggle.ts`

- `Toggle` has no `labelSuffix`, so a tooltip cannot sit next to its label inside it.
   - A read-only toggle gets `tabIndex={-1}`, so keyboard users cannot reach it to hear its state.
   - The focus ring shows on any focus, not only keyboard focus; sizes and the track shadow are raw values, not tokens.

### Tooltip

Note: [components/tooltip.md](../components/tooltip.md)  
Code: `packages/react/src/components/Tooltip`, `packages/react/src/components/Select/Select.tsx`, `packages/css/src/recipes/tooltip.ts`, `packages/css/src/recipes/tooltipHelperText.ts`

- `Tooltip` has no status prop and no definition-term style. The note keeps status for form fields and uses a className for definitions.
   - `TooltipContent` sets `aria-modal="true"` and wraps the tooltip in a focus manager, which suit dialogs, not tooltips.
   - The Sizes story puts a `Button` inside a `TooltipTrigger` without `asChild` (a button inside a button). The Input Icons story uses `asChild` on a `span`, which keyboard users cannot focus.

### TreeView

Note: [components/tree-view.md](../components/tree-view.md)  
Code: `packages/react/src/components/TreeView/TreeView.tsx`, `packages/react/src/components/TreeView/TreeItem.tsx`, `packages/react/src/components/TreeView/hooks/useTreeViewNavigation.ts`, `packages/react/src/components/TreeView/models/TreeView.model.ts`, `packages/css/src/recipes/TreeView/treeView.ts`, `packages/css/src/recipes/TreeView/treeViewItem.ts`

- the recipe uses raw `1px` lines (its `spacing.18` branch offset is a foundation role since 2026-11-10, following the code); the context error message names `TreeViewItem` and `TreeViewGroup`, which do not exist.

### Data table columns: resize, reorder, show and hide

Note: [patterns/data-table-columns.md](../patterns/data-table-columns.md)

- the column ordering story puts drag listeners on a bare icon and removes its focus outline, the settings trigger has no accessible name and uses raw sticky offsets, and the menu items nest a focusable `Checkbox` with a `label` inside a menu item.

### Data table editing

Note: [patterns/data-table-editing.md](../patterns/data-table-editing.md)

- the stories' toolbar `IconButton`s have no accessible names, fields in cells have no names, and styles use raw sizes and inline styles (`height: 58`, `fontSize: '0.938rem'`).

### Data table expandable rows

Note: [patterns/data-table-expand.md](../patterns/data-table-expand.md)

- the stories drive expansion with the row selection state, put `aria-expanded` on the icon, give the triggers no accessible name, block pointer events on the details row, and set widths and paddings with inline styles.

### Data table row selection

Note: [patterns/data-table-selection.md](../patterns/data-table-selection.md)

- the stories' selection checkboxes and radios have no accessible name, the radios share no `name`, the controls use a fixed `size="lg"` with an inline padding style, and the count uses an inline `fontWeight` style.

### Data table sorting and filtering

Note: [patterns/data-table-sort-filter.md](../patterns/data-table-sort-filter.md)

- in the stories, the sort and filter `IconButton`s have no accessible name, sorted headers have no `aria-sort`, focus is lost after Apply or Reset, the filter menu's `MenuBody` uses an inline `maxHeight` of 400px, and the toolbar search is an `Input` where Figma draws the Search input.

### Data table sticky header and pinned columns

Note: [patterns/data-table-sticky-pinning.md](../patterns/data-table-sticky-pinning.md)  
Code: `packages/react/src/components/Table/TableCell/TableCell.tsx`, `packages/css/src/recipes/Table/tableCell.ts`

- the sticky header lives in a global stylesheet in the stories (with a raw border color and `top: -1rem`), the column menu triggers have no accessible name, the menu sets `returnFocus={false}`, the scroll areas are not focusable, and `Td` and `Th` write `left: undefinedpx` or `right: undefinedpx` into the style of cells pinned to the other side.

### Data table toolbar, download, upload, loading and no results

Note: [patterns/data-table-toolbar.md](../patterns/data-table-toolbar.md)  
Code: `packages/react-templates/src/patterns/DownloadAndUpload`, `packages/react-templates/src/patterns/EditableDataTable/EditableTable.tsx`, `packages/react-templates/src/components/NoDataFound/index.tsx`

- the templates write text colors as raw hex values (`#66707B`, `#666`), set weights with inline styles, and the settings button in the stories has no accessible name.

### Border

Note: [foundations/border.md](../foundations/border.md)  
Code: `packages/css/src/tokens.ts`, `packages/css/src/recipes`

- The Border page gives `radii.xl` to dialogs and banners; the components use `radii.lg`, and the team follows the components, so the page should change.
- Many recipes write border widths as raw px (39 times 1px, 13 times 2px) instead of `borders.1` and `borders.2`.
- The page is titled "Border radius" in Storybook but also covers border weight.

### Color

Note: [foundations/color.md](../foundations/color.md)  
Code: `packages/css/src/tokens.ts`, `packages/css/src/recipes/button.ts`, `packages/css/src/recipes/input.ts`, `packages/css/src/recipes/divider.ts`, `packages/css/src/recipes/link`, `packages/css/src/recipes/Tag`, `packages/css/src/recipes/FeedbackMessages`, `packages/css/src/recipes/Dialog`, `packages/react/src/components/FeedbackMessages`

- The Primary palette section has an internal drafting note ("Focus only in Primary color and primary variant color roles… Link to references: polaris").
- The Red description says "warnings or errors", but the roles use red for errors only.
- The Purple description repeats its sentence.
- The role tables have typos: "Activer icon color", "Sencondary".

### Elevation

Note: [foundations/elevation.md](../foundations/elevation.md)  
Code: `packages/css/src/tokens.ts`, `packages/css/src/recipes`, `packages/react/src/components/Menu/DropdownComponents`

- The docs say a child menu sits higher than its parent; `Menu` gives every level `shadows.lg` and the team follows the component (2026-11-10), so the docs should change.
- The docs give popovers `shadows.2xl`; the component uses `shadows.lg`, and the team follows the component, so the docs should change.
- Typos: "contanier" in the shadow table, and "default Ui" on the live page.

### Iconography

Note: [foundations/iconography.md](../foundations/iconography.md)  
Code: `packages/css/src/recipes/icon.ts`, `packages/css/src/tokens.ts`

- The naming convention `name_variants-style` describes the Figma names; the code names are PascalCase (`AddCircleOutline`). The docs should show both.
- The size pairing uses font sizes that Magenta does not have. The team pairs `xs` with 10px, `sm` with 11 to 13px and `md` with 15 to 17px text.
- Duo-tone is documented but not in the package. The team does not use it, so it should come out of the docs.

### Screens

Note: [foundations/screens.md](../foundations/screens.md)  
Code: `packages/css/src/breakpoints.ts`, `packages/css/src/recipes`

- The Breakpoints page puts `xs` at 0 to 639px, but `breakpoints.xs` starts at 480px. The Viewports page has it right (0 to 479 and 480 to 639). The live page still shows 0 to 639.
- The live page heading reads "Brearkpoints".
- The Breakpoints page says components auto-resize, which is true only with `size="responsive"`.

### Spacing

Note: [foundations/spacing.md](../foundations/spacing.md)  
Code: `packages/css/src/tokens.ts`, `packages/css/src/recipes/checkbox.ts`, `packages/css/src/recipes/radio.ts`, `packages/css/src/recipes/formCheck.ts`, `packages/css/src/recipes/Tag`, `packages/css/src/recipes/iconButton.ts`, `packages/css/src/recipes/InputAtoms`, `packages/css/src/recipes/button.ts`, `packages/css/src/recipes/input.ts`, `packages/react/src/components/Menu/hooks`, `packages/react/src/components/Popover/hooks`, `packages/react/src/components/Tooltip/hooks`, `packages/react/src/components/Select/hooks`

- The Usage column puts the padding of buttons and input fields at 12 to 24px, and of small components at 0 to 10px. The components use 6 to 16px horizontally and 8px vertically for buttons and inputs, and up to 12px for icon buttons. The team follows the components, so the docs should change.
- The scale table names the tokens `--mag-spacings-4` and up, but the CSS variables are `--mag-spacing-4`. The same "spacings" appears in the Figma variable names used by the templates.
- The layout templates in `react-templates` use raw values (header padding `16px 24px`) and Figma variable names such as `--Spacings-gaps-mag-spacings-12` instead of spacing tokens.
- The live page subtitle reads "Spacing negative space…", missing "refers to", with a double period.

### Typography

Note: [foundations/typography.md](../foundations/typography.md)  
Code: `packages/css/src/tokens.ts`, `packages/css/src/recipes/Text`, `packages/css/src/preset.ts`, `packages/css/src/breakpoints.ts`, `packages/react/src/components/Text`

- It says the sizes follow "the major third type scale, with a ratio of 1.2", rounded to the nearest multiple of 4px. The sizes in code follow no single ratio (see the Step column below), and most are not multiples of 4.
- It mentions Proxima Nova and different fonts for different languages, and lists five Noto Sans weights. Product UI uses only Noto Sans at 400 and 600.
- The line length section gives 40 to 60 characters in the text and 60 to 100 in the illustration, and refers to a "font size 100" that does not exist. This note leaves line length out.
- The "class name" column of the Font Style table (`--text-h1`…) names nothing that exists in code.

### Z-index

Note: [foundations/z-index.md](../foundations/z-index.md)  
Code: `packages/css/src/tokens.ts`, `packages/css/src/recipes`

- The Z-index table has no row for `zIndex.navigation-overlay`.
- The token audit ([report](archive/token-audit-2026-11-04.md)) finds raw z-index values in components: `9999` in the text editor's link menu, `10` in the `Select` and `Autocomplete` dropdowns, `11` in `Tooltip`, and `2` and `3` in button groups and compact wrappers.

