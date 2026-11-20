---
type: report
date: 2026-11-10
languages: [vi]
---

# Known issues · 2026-11-10

Tổng hợp từ mục **Open questions** của 47 note component, 8 foundation và 7 pattern (294 mục). Các mục trùng nhau đã được gộp. Nội dung trong note không đổi; khi bạn trả lời, mình cập nhật note tương ứng và đánh dấu mục đó là đã giải quyết.

## Cách trả lời

- Viết câu trả lời sau `→ Trả lời:`. Một chữ là đủ, ví dụ "đúng", "theo code", "theo Figma", "bỏ qua", hoặc ghi tên người hay nguồn quyết định.
- **Đề xuất** là ý của mình, dựa trên code và docs. Nếu đồng ý, ghi "OK".
- Mục nào bạn không quyết được thì ghi "hỏi team Magenta" hoặc "hỏi team design", mình sẽ chuyển sang phần báo cáo.
- Phần E và F không cần trả lời từng dòng; chỉ cần cho biết gửi cho ai.

| Phần | Nội dung | Số mục |
|---|---|---|
| [A](#a-hành-vi-component-lỗi-hay-chủ-ý) | Hành vi component: lỗi hay chủ ý | 39 |
| [B](#b-figma-và-code-khác-nhau-bên-nào-đúng) | Figma và code khác nhau: bên nào đúng | 28 |
| [C](#c-không-có-nguồn-cần-quy-tắc) | Không có nguồn: cần quy tắc | 21 |
| [D](#d-quyết-định-đã-ghi-cần-xác-nhận) | Quyết định đã ghi, cần xác nhận | 12 |
| [E](#e-lỗi-upstream-báo-team-magenta) | Lỗi upstream, báo team Magenta | 1 câu hỏi |
| [F](#f-việc-cần-sửa-trong-figma-báo-team-design) | Việc cần sửa trong Figma | 1 câu hỏi |
| [G](#g-ảnh-docs-bị-thiếu) | Ảnh docs bị thiếu | 1 câu hỏi |

---

## A. Hành vi component: lỗi hay chủ ý

Code đang làm một kiểu, docs, chuẩn a11y hoặc lẽ thường gợi ý kiểu khác. Trả lời giúp mình biết note nên ghi "đây là lỗi, cách bù là…" hay "đây là thiết kế".

### Accessibility

- **A1** [Accordion](../components/accordion.md): header không nằm trong thẻ heading, trái với mẫu WAI-ARIA mà docs dẫn tới. Có nên yêu cầu bọc heading không?
  Đề xuất: lỗi upstream; note hướng dẫn tự bọc `<h3>` quanh header.
  → Trả lời: Theo code: không bọc heading. Note ghi lỗi upstream và cách tự bọc `<h3>` quanh `AccordionControl` (đã đo: không đổi giao diện, phím mũi tên vẫn chạy).
- **A2** [Carousel](../components/carousel.md): autoplay không có nút tạm dừng và vẫn chạy khi rê chuột (WCAG 2.2.2).
  Đề xuất: lỗi upstream; note bắt buộc `stopOnMouseEnter: true` và nút tạm dừng tự làm.
  → Trả lời: Theo code: không có nút pause, `stopOnMouseEnter` mặc định `false`. Note giữ cách bù; báo upstream.
- **A3** [Carousel](../components/carousel.md): slide đang khuất không bị ẩn khỏi trình đọc màn hình và không có tên.
  Đề xuất: lỗi upstream; note yêu cầu tự đặt `aria-label="n of N"`.
  → Trả lời: Theo code: slide khuất không bị ẩn. Note giữ cách bù (`aria-label="n of N"`); báo upstream.
- **A4** [FormCheck](../components/form-check.md): `required` chỉ thêm dấu `*`, không đặt `aria-required` cho control.
  Đề xuất: lỗi upstream; note yêu cầu ghi "required" bằng chữ.
  → Trả lời: Theo code: chỉ có dấu `*`. Note giữ cách bù (ghi "required" bằng chữ); báo upstream.
- **A5** [FormCheck](../components/form-check.md), [Checkbox](../components/checkbox.md), [Radio](../components/radio.md), [Segmented](../components/segmented.md): group label là `<fieldset>` chỉ chứa chữ; `aria-invalid` gắn sai phần tử; radio group và Segmented dùng `role="group"` thay vì `radiogroup`.
  Đề xuất: báo chung một lỗi upstream "cấu trúc group của form control".
  → Trả lời: Theo code: giữ cấu trúc hiện tại. Báo chung một lỗi upstream.
- **A6** [Image](../components/image.md): Lightbox không có nút đóng và không đưa focus vào trong.
  Đề xuất: lỗi upstream.
  → Trả lời: Theo code: không có nút đóng, đóng bằng Escape hoặc click ra ngoài. Báo upstream.
- **A7** [Image](../components/image.md): overlay "Preview" chỉ hiện khi rê chuột, không hiện khi focus.
  → Trả lời: Theo code: overlay chỉ hiện khi hover. Báo upstream.
- **A8** [InlineEdit](../components/inline-edit.md): Escape không huỷ, Enter không lưu.
  Đề xuất: lỗi upstream.
  → Trả lời: Theo code: không có phím tắt; dùng nút Cancel và Save. Báo upstream.
- **A9** [InlineEdit](../components/inline-edit.md): tên của nút ẩn chỉ có label, không có giá trị hiện tại.
  → Trả lời: Theo code: tên là label. Báo upstream.
- **A10** [Stepper](../components/stepper.md): step dùng `role="tab"` nhưng không có `aria-selected`, không có panel, mũi tên không di chuyển. Có nên đổi sang list với `aria-current="step"`?
  Đề xuất: có.
  → Trả lời: Theo code: giữ `tablist`/`tab`. Note giữ cách bù; báo upstream.
- **A11** [TreeView](../components/tree-view.md): không có cách chọn nhiều item chỉ bằng bàn phím, và không có `aria-multiselectable`.
  → Trả lời: Theo code: chỉ chọn nhiều bằng Ctrl/Shift + click. Báo upstream.
- **A12** [Data table columns](../patterns/data-table-columns.md): không có cách resize cột bằng bàn phím (WCAG 2.5.7).
  → Trả lời: Theo code (story): chỉ chuột và cảm ứng; bàn phím có "Reset Columns Size". Báo upstream.
- **A13** [Data table editing](../patterns/data-table-editing.md): không có cách bắt đầu sửa ô bằng bàn phím (WCAG 2.1.1). Đề xuất của note: ô focus được, Enter hoặc F2 để sửa.
  → Trả lời: Theo code (story): double-click. Báo upstream.

### Hành vi và mặc định

- **A14** [Accordion](../components/accordion.md): Divider vẫn được vẽ khi item đóng, nên đáy item có hai đường kẻ. Có chủ ý không?
  → Trả lời: Theo code: divider luôn được vẽ. Ghi là hành vi hiện tại; báo upstream.
- **A15** [Accordion](../components/accordion.md): khi không truyền `size`, item là `lg` nhưng khoảng cách là 12px. Có nên truyền `lg` rõ ràng?
  → Trả lời: Theo code: không đổi. Note vẫn yêu cầu `size="responsive"`.
- **A16** [Breadcrumb](../components/breadcrumb.md): docs nói mặc định thu gọn "item đầu và 2 item cuối", nhưng code chỉ thu gọn khi có `limit`. Có nên mặc định `limit={3}`?
  → Trả lời: Theo code: chỉ thu gọn khi có `limit`. Docs cần sửa.
- **A17** [Breadcrumb](../components/breadcrumb.md): docs nói có thể "ưu tiên item cụ thể", nhưng code không hỗ trợ.
  → Trả lời: Theo code: không hỗ trợ. Docs cần sửa.
- **A18** [Carousel](../components/carousel.md): `orientation="vertical"` có được hỗ trợ không? Phần docs của nó đang bị comment.
  → Trả lời: Theo code: `orientation="vertical"` có prop và recipe nên được hỗ trợ; docs chưa có. Note sửa lại.
- **A19** [Dialog](../components/dialog.md): docs gợi ý đặt dialog gần nút mở, nhưng `Dialog` luôn ở giữa màn hình.
  → Trả lời: Theo code: Dialog luôn ở giữa. Docs cần sửa.
- **A20** [Drawer](../components/drawer.md): `DrawerBody` không tự cuộn khi nội dung dài. Có nên cuộn mặc định?
  Đề xuất: có (Figma có "Show scroll bar").
  → Trả lời: Theo code: `DrawerBody` không tự cuộn. Note giữ cách bù.
- **A21** [Drawer](../components/drawer.md): docs khuyến nghị max width 40/60/100% nhưng Drawer không có độ rộng mặc định. Có nên đặt sẵn?
  → Trả lời: Theo code: không có độ rộng mặc định. Note giữ cách đặt theo docs.
- **A22** [FormCheck](../components/form-check.md): `radioGroupClassName` áp dụng cho cả checkbox và toggle. Có nên đổi tên?
  → Trả lời: Theo code: giữ tên `radioGroupClassName`.
- **A23** [IconButton](../components/icon-button.md): các size nhỏ (`xs`–`3xs`) không đổi theo viewport. Có đúng không?
  → Trả lời: Theo code: các size nhỏ cố định, không đổi theo viewport.
- **A24** [Image](../components/image.md): docs mô tả zoom in/out trong preview, nhưng Lightbox không có.
  → Trả lời: Theo code: không có zoom. Docs cần sửa.
- **A25** [InlineEdit](../components/inline-edit.md): rời khỏi field thì bỏ thay đổi mà không hỏi, trong khi pattern data-table-editing yêu cầu hỏi. Quy tắc nào áp dụng?
  → Trả lời: Theo code: InlineEdit bỏ thay đổi khi rời đi, không hỏi. Pattern bảng giữ quy tắc riêng của nó.
- **A26** [InlineEdit](../components/inline-edit.md): nút Save vẫn bấm được khi `state="error"`. Có nên disable?
  → Trả lời: Theo code: Save luôn bật; code của bạn kiểm tra trước khi lưu.
- **A27** [Progress](../components/progress.md): `CircularProgress` với `size="responsive"` không bao giờ hiện số. Lỗi?
  Đề xuất: lỗi recipe.
  → Trả lời: Theo code: không hiện số với `responsive`. Note giữ cách dùng size cố định; báo upstream (lỗi recipe).
- **A28** [Progress](../components/progress.md): `LinearProgress` rộng tối thiểu 320px nên tràn ra ngoài container hẹp. Có nên co lại?
  → Trả lời: Theo code: rộng tối thiểu 320px.
- **A29** [Progress](../components/progress.md): có định làm chế độ chạy vô định (indeterminate) không, hay luôn dùng `Spinner`?
  → Trả lời: Theo code: không có chế độ indeterminate; dùng `Spinner`.
- **A30** [Shortcut](../components/shortcut.md): quy tắc "rộng tối thiểu bằng 2 lần chiều cao" không được code áp dụng. Có nên đưa vào recipe?
  → Trả lời: Theo code: không áp dụng tự động. Note giữ hướng dẫn.
- **A31** [Stepper](../components/stepper.md): vòng tròn số luôn 24px ở mọi size, trong khi icon là 12/16/20px.
  → Trả lời: Theo code: vòng tròn số luôn 24px.
- **A32** [Stepper](../components/stepper.md): stepper dọc bọc chữ theo từ dài nhất.
  → Trả lời: Theo code: giữ như hiện tại. Note giữ lời khuyên viết helper text ngắn.
- **A33** [Stepper](../components/stepper.md): đường nối luôn màu xám; recipe có phần tô màu theo trạng thái nhưng đang bị comment. Có nên tô màu đoạn đã xong?
  → Trả lời: Theo code: đường nối luôn `colors.neutral.300`.
- **A34** [Stepper](../components/stepper.md): story MaxAvailableStep tồn tại nhưng prop `maxAvailableStep` bị comment.
  → Trả lời: Theo code: không có `maxAvailableStep`; dùng `status="in-active"`.
- **A35** [Text](../components/text.md): docs ghi có `size="responsive"`, nhưng kiểu TypeScript không chấp nhận.
  → Trả lời: Theo code: kiểu không có `"responsive"`; bỏ trống `size`.
- **A36** [Text](../components/text.md): `Text` không đặt màu chữ. Có nên mặc định `colors.neutral.900`?
  → Trả lời: Theo code: `Text` không đặt màu. Note giữ hướng dẫn đặt màu theo role.
- **A37** [TreeView](../components/tree-view.md): `selectable` báo item đã chọn nhưng không hiển thị. Component có nên tự giữ và hiển thị selection?
  → Trả lời: Theo code: code của bạn truyền `selected`.
- **A38** [TreeView](../components/tree-view.md): Shift+click chọn luôn item bị disabled.
  → Trả lời: Theo code: Shift + click chọn cả item disabled. Note giữ hướng dẫn lọc bỏ.
- **A39** [Toggle](../components/toggle.md): hover của toggle đang bật dùng `green.400`, một mức màu chưa có role. Gán role cho `green.400`, hay đổi toggle?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**

---

## B. Figma và code khác nhau: bên nào đúng

Theo [AGENTS.md](../AGENTS.md), khi có xung đột thì code đúng. Các mục dưới đây là chỗ mình không chắc code có phải ý định thật không. Nếu trả lời "theo code", mình chuyển mục đó sang phần F (sửa Figma).

- **B1** [Accordion](../components/accordion.md): accordion lồng nhau trong Figma để item separated, story để stacked.
  → Trả lời: Theo code (story): accordion lồng bên trong dùng `stacked`.
- **B2** [Breadcrumb](../components/breadcrumb.md): Figma có icon trái/phải cho từng item và icon home trong overflow; code không có.
  → Trả lời: Theo code: không có icon cho từng item. Figma cần sửa.
- **B3** [Breadcrumb](../components/breadcrumb.md): trang hiện tại có hover/focus trong Figma, còn trong code thì không focus được.
  → Trả lời: Theo code: trang hiện tại không focus được. Figma cần sửa.
- **B4** [ButtonGroup](../components/button-group.md): Figma cho tới 12 nút. Giới hạn bao nhiêu?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **B5** [Dialog](../components/dialog.md): Figma giảm padding ở size md/sm (16/12px); code giữ 24px.
  → Trả lời: Theo code: padding 24px ở mọi size. Figma cần sửa.
- **B6** [Drawer](../components/drawer.md): Figma có Resizer ở mép; code không resize được.
  → Trả lời: Theo code: Drawer không resize. Figma cần bỏ Resizer.
- **B7** [Drawer](../components/drawer.md): cấp 2 trong story chỉ có nút Back; Figma có cả Back và nút đóng.
  → Trả lời: Theo code (story): cấp 2 chỉ có nút Back.
- **B8** [Drawer](../components/drawer.md): Figma có Sub-title và Sub Header Slot; code không có.
  → Trả lời: Theo code: không có sub-title; tự ghép trong `DrawerHeader`.
- **B9** [Feedback messages](../components/feedback-messages.md): mọi variant Figma đều dùng icon info; code không có icon mặc định theo trạng thái.
  → Trả lời: Theo code: không có icon mặc định. Note giữ bộ icon của form field.
- **B10** [InlineEdit](../components/inline-edit.md): Figma nhắc "Enable edit button to edit" và chiều cao min-max có cuộn; code không có. Trang Figma đang ghi "Inprogress".
  → Trả lời: Theo code: không có nút edit riêng, không giới hạn chiều cao.
- **B11** [List](../components/list.md): docs và Figma cho item padding y 6/4; code dùng 8. Figma Lists không có padding dọc, code có 12/8/6.
  → Trả lời: Theo code: item padding y 8px; `List` thêm 12/8/6px trên dưới. Figma và docs cần sửa.
- **B12** [Menu](../components/menu.md): footer Figma padding trên 8px ở mọi size; code 8/6/4.
  → Trả lời: Theo code: footer padding trên 8/6/4px.
- **B13** [Pagination](../components/pagination.md): footer bảng trong Figma giữ page size select và số kết quả cho cả hai kiểu; Storybook bỏ ở kiểu editable.
  → Trả lời: Theo code (Storybook): kiểu editable bỏ page size select và số kết quả.
- **B14** [Segmented](../components/segmented.md): docs nói dưới 6 lựa chọn; Figma cho tới 6.
  → Trả lời: Code không giới hạn; docs nói dưới 6, nên tối đa 5. Figma cần sửa.
- **B15** [Shortcut](../components/shortcut.md): spec Figma dùng `text-button-md` cho shortcut lớn chỉ có chữ, nhưng `text-button-lg` khi có icon.
  → Trả lời: Theo code: một cỡ chữ theo mỗi size.
- **B16** [Stepper](../components/stepper.md): hover trong Figma là magenta cho mọi trạng thái; code dùng sắc `.400` của từng màu trạng thái.
  → Trả lời: Theo code: hover dùng sắc `.400` của màu trạng thái. Figma cần sửa.
- **B17** [Textarea](../components/textarea.md): docs và Figma cho chiều cao tối thiểu khoảng 2 dòng; code mặc định 4 dòng.
  → Trả lời: Theo code: mặc định 4 dòng.
- **B18** [Timeline](../components/timeline.md): Figma dùng icon rỗng cho item cũ; code dùng icon có chấm màu xám.
  → Trả lời: Theo code: icon có chấm, màu xám cho item cũ. Figma cần sửa.
- **B19** [Timeline](../components/timeline.md): Figma có property Number; code không có.
  → Trả lời: Theo code: không có số.
- **B20** [Table](../components/table.md): nút action trong hàng, Figma 24px, story 36px. Đã chọn theo story ngày 06/11; cần xác nhận.
  → Trả lời: Theo code (story): nút 36px (`size="md"`).
- **B21** [Table](../components/table.md): Figma có ô "Color Bg" không có code. Đã quyết định bỏ ngày 06/11; cần xác nhận mục đích.
  → Trả lời: Theo code: không có ô Color Bg; không dùng.
- **B22** [Data table editing](../patterns/data-table-editing.md): Figma "click 1 lần để sửa", Storybook "double-click". Đã chọn Storybook; cần xác nhận.
  → Trả lời: Theo code (story): double-click.
- **B23** [Data table editing](../patterns/data-table-editing.md): bộ nút ở chế độ sửa khác nhau giữa Figma và story. Đã chọn story; cần xác nhận.
  → Trả lời: Theo code (story): Cancel ghost primary, Save fill primary.
- **B24** [Data table expand](../patterns/data-table-expand.md): icon caret và padding 8px trong Figma, chevron và 16px trong story. Đã chọn story; cần xác nhận.
  → Trả lời: Theo code (story): chevron và padding 16px.
- **B25** [Data table selection](../patterns/data-table-selection.md): batch actions bar có nền `blue.100` và nút Cancel (Figma, ví dụ editable) hay không có nền (ví dụ bulk)?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **B26** [Data table sort & filter](../patterns/data-table-sort-filter.md): nút filter `_table dropdown menu` trong Figma không có story; Reset/Apply bị disable trong Figma nhưng bật trong story. Đã chọn story.
  → Trả lời: Theo code (story): Reset và Apply luôn bật; không có nút filter kiểu Figma.
- **B27** [Data table toolbar](../patterns/data-table-toolbar.md): Figma vẽ dải cao 56px, có divider và nút "Add row"; story khác.
  → Trả lời: Theo code (story): bố cục theo story.
- **B28** [Typography](../foundations/typography.md): lỗi `body3` ở size `lg`; Display 1–3 và các style gạch chân chỉ có trong Figma. Thêm vào code hay đánh dấu "chỉ Figma"?
  → Trả lời: Theo code: `body3` ở `lg` ra 10/12 (lỗi, báo upstream); Display 1–3 và gạch chân là "chỉ có trong Figma".

---

## C. Không có nguồn: cần quy tắc

Docs, Figma và code đều không nói. Note đang để trống hoặc ghi "no source says".

- **C1** Toàn bộ 47 note component: phần **Why this design / Trade-offs** đang trống, vì docs không giải thích lý do thiết kế. Team có nguồn nào không (tài liệu nội bộ, quyết định cũ), hay để trống?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **C2** Toàn bộ note: trường `status` (draft/beta/stable) chưa có nguồn. Lấy theo trang Component status của Figma (Released = stable) được không?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **C3** [Image](../components/image.md): trang status ghi Image "Unavailable" dù code đã có. Image đã release chưa?
  → Trả lời: Theo code: Image được export, dùng được. Trang status trong Figma cần sửa.
- **C4** [Shortcut](../components/shortcut.md): set Figma ghi "Beta use"; mục filter section ghi "for future use". Có dùng cho filter được chưa?
  → Trả lời: Theo code: Shortcut không gắn với date picker, dùng được ở filter.
- **C5** [Autocomplete](../components/autocomplete.md): docs nói người dùng có thể "tiếp tục gõ giá trị riêng", nhưng docs SearchInput lại gửi người dùng sang Autocomplete để tránh giá trị sai.
  → Trả lời: Theo code: chỉ giá trị đã chọn (hoặc giá trị code thêm ở chế độ creatable) được giữ lại.
- **C6** [Dialog](../components/dialog.md): khi nào dialog nên chặn Escape và click ra ngoài?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **C7** [Indicator](../components/indicator.md): hiển thị gì khi số lớn hơn 99?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **C8** [List](../components/list.md): item `active` nghĩa là gì?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **C9** [Menu](../components/menu.md): khi nào dùng menu phân nhánh (branched), khi nào dùng menu lồng thu gọn?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **C10** [NonModalDialog](../components/non-modal-dialog.md): docs khuyến nghị rộng 50–60% và cao 70–80% viewport; code giới hạn theo `maxWidth` và 80%.
  → Trả lời: Theo code: rộng theo `maxWidth` của size, cao tối đa 80% viewport.
- **C11** [Spinner](../components/spinner.md): khi nào dùng các size cố định `xl`–`3xl`, và hiển thị loading cả trang thế nào?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **C12** [Tabs](../components/tabs.md): khi nào dùng tab dọc thay vì ngang?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **C13** [Timeline](../components/timeline.md): docs có trạng thái "Locked" (có vẻ chép từ Stepper). Có áp dụng cho Timeline không?
  → Trả lời: Theo code: Timeline không có trạng thái; "Locked" không áp dụng.
- **C14** [Tooltip](../components/tooltip.md): tooltip nên xuống dòng ở độ rộng bao nhiêu?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **C15** [Data table selection](../patterns/data-table-selection.md): batch actions bar đặt trên hay dưới bảng? Khi nào dùng bulk actions trong toolbar?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **C16** [Data table columns](../patterns/data-table-columns.md): handle resize trông như thế nào? (story để trong suốt)
  → Trả lời: Theo code (story): handle trong suốt, chỉ có con trỏ `col-resize`.
- **C17** [Data table editing](../patterns/data-table-editing.md): story có hai kiểu đánh dấu ô đã đổi (overlay `orange.500` 10%, hoặc `orange.100` có tooltip). Chọn kiểu nào?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **C18** [Data table toolbar](../patterns/data-table-toolbar.md): component upload file (`FileUpload`) chỉ có trong package nội bộ `react-templates`. Sản phẩm dùng gì để upload?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **C19** [Data table toolbar](../patterns/data-table-toolbar.md): hình minh hoạ "no results" chỉ có trong templates, và template hiện cùng lúc một toast đỏ. Dùng gì?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **C20** [Data table sticky & pinning](../patterns/data-table-sticky-pinning.md): không có token z-index nằm giữa `above` (1) và `menu` (500) cho header dính. Có nên thêm token?
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **C21** [Motion](../foundations): Magenta không có token chuyển động; recipe dùng giá trị thô (200ms, 400ms, 0.3s). Có viết foundation motion ghi các giá trị đang dùng không?
  → Trả lời: Theo code: có giá trị thô (200ms, 400ms, 0.3s). Việc cần làm: viết `foundations/motion.md` ghi các giá trị đang dùng.

---

## D. Quyết định đã ghi, cần xác nhận

Các note đã chọn một hướng, ghi là "decided" hoặc "team should confirm". Chỉ cần xác nhận hoặc sửa.

- **D1** [Avatar](../components/avatar.md): màu nền chữ viết tắt chỉ giữ các mức đạt tương phản 4.5:1 với chữ trắng.
  → Trả lời: Theo code: dùng mọi mức 500–800 (xem Q19).
- **D2** [Indicator](../components/indicator.md) và [Tag](../components/tag.md): trạng thái của đối tượng dùng status `Tag`; text badge (`Indicator`) chỉ cho nhãn phụ ngắn.
  → Trả lời: Theo docs: trạng thái dùng status `Tag`; text badge cho nhãn phụ.
- **D3** [NumberInput](../components/number-input.md): bật dấu phân cách hàng nghìn cho số tiền và số lượng. Có nên thành mặc định?
  → Trả lời: Code mặc định tắt; docs yêu cầu dấu phẩy từ 1,000. Note giữ: bật cho số tiền và số lượng.
- **D4** [Popover](../components/popover.md): Popover chỉ mở bằng click; hover/focus thì dùng `Tooltip`. Docs Popover cần sửa theo.
  → Trả lời: Theo code: Popover chỉ mở bằng click; hover và focus dùng `Tooltip`. Docs cần sửa.
- **D5** [Popover](../components/popover.md): các ví dụ Figma (Settings, Filter, Download) là danh sách hành động, nên note gửi sang `DropdownMenu`/`Menu`.
  → Trả lời: Theo code: danh sách hành động dùng `DropdownMenu` và `Menu`.
- **D6** [Select](../components/select.md): quy tắc chọn component: tới khoảng 5 lựa chọn dùng Radio, nhiều lựa chọn dùng Checkbox, danh sách dài tìm bằng gõ dùng Autocomplete. Và "Closable select" trong docs được hiểu là `clearable`.
  → Trả lời: Theo docs và code: giữ quy tắc trong note; "Closable" là `clearable`.
- **D7** [Table](../components/table.md): nút cài đặt cột dùng kiểu nút nổi (story ShowAndHide); `disabled` trên `Tr` dùng như code; khối tiêu đề trống của `TableContainer` được báo là lỗi.
  → Trả lời: Theo code (story): giữ các quyết định trong note.
- **D8** [Elevation](../foundations/elevation.md) và [Menu](../components/menu.md): menu con dùng `shadows.xl` (thêm bằng className); popover giữ `shadows.lg` theo component.
  → Trả lời: **Code không định nghĩa: gửi bạn quyết định (xem cuối file).**
- **D9** [Border](../foundations/border.md): dialog và banner dùng `radii.lg` theo component; trang Border cần sửa.
  → Trả lời: Theo code: `radii.lg`. Trang Border cần sửa.
- **D10** [Iconography](../foundations/iconography.md): ghép size icon với cỡ chữ (`xs` với 10px, `sm` với 11–13px, `md` với 15–17px); bỏ duo-tone khỏi docs.
  → Trả lời: Giữ quyết định team đã ghi.
- **D11** Tương phản màu: các cặp sau đang dưới chuẩn nhưng team giữ nguyên (theo [Color](../foundations/color.md)). Vẫn giữ?
  - Chữ toast và tiêu đề alert màu `orange.600` (2.58:1) và `green.600` (3.47:1) ([Feedback messages](../components/feedback-messages.md))
  - Placeholder `neutral.500` và viền `neutral.300` ([Input](../components/input.md), [Select](../components/select.md))
  - Hover link `secondary.400` (2.78:1) ([Link](../components/link.md)); icon info `secondary.400` ([Tooltip](../components/tooltip.md))
  - Tag Bold green 3.47:1 và Bold orange 2.58:1 ([Tag](../components/tag.md))
  - Track toggle đang bật `green.500` 2.65:1 ([Toggle](../components/toggle.md))
  - Caption ảnh `neutral.500` ([Image](../components/image.md))
  - Nút Cancel `red.500` trên `blue.100` 4.28:1 ([Data table selection](../patterns/data-table-selection.md))
  → Trả lời: Theo code: giữ các màu như hiện tại; ghi là cặp chưa đạt chuẩn.
- **D12** [Resizeable](../components/non-modal-dialog.md): là phần nội bộ của NonModalDialog, không dùng trực tiếp. (Đã xác nhận ngày 10/11, ghi lại để đủ.)
  → Trả lời: đã xác nhận

---

## E. Lỗi upstream: báo team Magenta

Các lỗi code trong package, mỗi note đã ghi chi tiết ở mục "Upstream, for the Magenta team". Không cần trả lời từng dòng.

| Nhóm | Component và pattern |
|---|---|
| Accessibility (tên, role, focus, bàn phím) | Accordion, Breadcrumb, ButtonGroup, Collapse, CompactWrapper, Dialog, Drawer, Feedback messages, HelperText, IconButton, Image/Lightbox, Indicator, InlineEdit, Input, Link, List, Menu, NumberInput, Pagination, Popover, Radio, SearchInput, Segmented, Select, Spinner, Stepper, Tab group, Table, Tabs, Tag, TagsInput, Textarea, Toggle, Tooltip, TreeView, cùng 7 pattern data table |
| Token bị cấm hoặc giá trị thô trong recipe | Stepper (`blue.400`, `green.400`), Image (`radii.xl`), TreeView (`spacing.18`), Timeline (màu tên CSS), Progress, Carousel, Pagination, Drawer, InlineEdit, Segmented, Radio, cùng các foundation Border và Z-index |
| Docs và JSDoc sai | Drawer (`returnFocus`), Text (`children`), Carousel (`CarouselSlideIndicator`), Divider (changelog), NonModalDialog (`dragOffsetTop`), Banner, cùng 8 foundation (lỗi chính tả, bảng sai) |
| Thiếu tính năng có trong Figma hoặc docs | Autocomplete và TagsInput (`loading`), Avatar (presence), Button ("on color"), List (drag and drop), Tab group (menu nhóm), Tag (status, chữ in hoa), Toggle (`labelSuffix`), CompactWrapper (label bên trái) |
| Hành vi mặc định gây lỗi | Shortcut và Button (`type="submit"`), Popover và Menu (`returnFocus`), Progress (cảnh báo console sau mỗi lần render) |

- **E1** Gửi danh sách này cho ai, qua kênh nào? Mình có thể xuất thành một file riêng theo từng component, kèm đường dẫn code, để dán vào tracker của team Magenta.
  → Trả lời: Gửi cho bạn: [upstream-issues-2026-11-10.md](upstream-issues-2026-11-10.md).

---

## F. Việc cần sửa trong Figma: báo team design

Code đúng; Figma cần sửa theo.

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

- **F1** Gửi danh sách này cho ai trong team design?
  → Trả lời: Gửi cho bạn: [figma-fixes-2026-11-10.md](figma-fixes-2026-11-10.md).

---

## G. Ảnh docs bị thiếu

Các trang design của 7 pattern data table mô tả nhiều nội dung chỉ bằng ảnh, nhưng ảnh không có trong snapshot (anatomy, resize, pinning bằng kéo, download dialog, validation…). Các note đánh dấu những phần này là "chưa có nguồn".

- **G1** Bạn lấy được ảnh từ Storybook đang chạy, hoặc từ file Figma "MDS Data Table Document" không? Nếu được, mình đọc và bổ sung vào pattern.
  → Trả lời: OK, bạn sẽ gửi ảnh; mình bổ sung vào các pattern khi có.

---

## Mục đã giải quyết (không cần trả lời)

- Button: link dùng để điều hướng, button dùng để chạy hành động (05/11).
- Checkbox: "Agree to terms" dùng checkbox, không dùng toggle (05/11).
- Data table columns: TreeView đã có note (09/11).
- Data table selection: Divider đã có note (09/11).
- Resizeable: nội bộ của NonModalDialog (10/11).

---

## Cần bạn quyết định (code không định nghĩa)

Cập nhật 2026-11-10: mọi mục A–D đã được trả lời theo code base (code của package và docs Storybook trong snapshot). Các mục dưới đây code không trả lời được: đó là quy tắc dùng, nội dung, hoặc chỗ code mâu thuẫn với một quy tắc của vault. Ghi câu trả lời ngay dưới mỗi mục.

### Quy tắc dùng mà code và docs không nói

- **Q1 (C1)** "Why this design" của 47 note: có nguồn nào không, hay để trống?
  → Trả lời: Để trống (team, 2026-11-10).
- **Q2 (C2)** Trường `status` của note: lấy theo trang Component status trong Figma (Released = `stable`, Done design = `beta`)?
  → Trả lời: Trang Component status trong Figma chỉ là ví dụ, không phải nguồn. `status` lấy theo việc component có trong code và dùng đúng (team, 2026-11-10).
- **Q3 (B4)** ButtonGroup tối đa mấy nút? (code không giới hạn, Figma tới 12)
  → Trả lời: Chưa có giới hạn.
- **Q4 (C6)** Khi nào Dialog nên chặn Escape và click ra ngoài? (code mặc định cho phép cả hai)
  → Trả lời: Tuỳ từng trường hợp; mỗi màn hình tự quyết định `closeByEscape` và `closeByOutsideClick`.
- **Q5 (C7)** Indicator hiển thị gì khi lớn hơn 99? (code hiển thị nguyên `label`, ví dụ "99+" là do bạn truyền)
  → Trả lời: Hiển thị tối đa "99".
- **Q6 (C8)** `ListItem` `active` dùng khi nào? (JSDoc chỉ ghi "Indicates if the list item is active")
  → Trả lời: `active` khi item ứng với trang đang mở, ví dụ list item trong menu điều hướng của trang hiện tại.
- **Q7 (C9)** Menu phân nhánh hay menu lồng thu gọn: khi nào dùng loại nào?
  → Trả lời: Cấp 2 dùng menu lồng thu gọn; từ cấp 3 bắt đầu phân nhánh.
- **Q8 (C11)** Spinner size `xl`–`3xl` dùng khi nào; loading cả trang hiển thị thế nào?
  → Trả lời: Tuỳ trường hợp.
- **Q9 (C12)** Khi nào dùng tab dọc?
  → Trả lời: Tuỳ trường hợp; mặc định dùng tab ngang.
- **Q10 (C14)** Tooltip xuống dòng ở độ rộng bao nhiêu? (code không có max width)
  → Trả lời: Do người dùng component (developer) tự đặt.
- **Q11 (C15)** Batch actions bar đặt trên hay dưới bảng; khi nào dùng bulk actions trong toolbar?
  → Trả lời: Đặt trên bảng.

### Story mâu thuẫn nhau hoặc chỉ có trong package nội bộ

- **Q12 (B25)** Batch actions bar: có nền `blue.100` và nút Cancel (ví dụ editable) hay không nền và dùng `ButtonGroup` (ví dụ bulk)?
  → Trả lời: Nhiều hành động dùng `ButtonGroup`; một hành động dùng `Button` thường.
- **Q13 (C17)** Đánh dấu ô đã đổi: overlay `orange.500` 10% hay `orange.100` có tooltip "Value Changed"?
  → Trả lời: Không cần đánh dấu ô đã đổi.
- **Q14 (C18)** Upload file: `FileUpload` chỉ có trong `react-templates` (nội bộ). Sản phẩm dùng gì?
  → Trả lời: Dùng `FileUpload` của `react-templates`.
- **Q15 (C19)** Bảng không có kết quả: hình minh hoạ và toast đỏ chỉ có trong templates. Dùng gì?
  → Trả lời: Dùng empty state; sẽ bổ sung sau, hỏi lại khi làm template dùng chung.
- **Q16 (C20)** Header dính trong bảng cần z-index giữa `above` (1) và `menu` (500), nhưng chưa có token. Thêm token, hay dùng `above`?
  → Trả lời: Dùng `zIndex.above`.
  **Mở lại 2026-11-10:** đã thử trên prototype (`#/table-sticky-pinning`): ô ghim trong thân bảng cũng là `above` (1) nên khi cuộn, chúng đè lên header ghim ("Booking", "Actions"). Header cần cao hơn 1. Chọn: (a) thêm token mới, ví dụ `zIndex.sticky` = 2; (b) dùng giá trị thô 2 có ghi `token-audit-ignore`; (c) dùng `zIndex.above` và chấp nhận lỗi khi kết hợp header dính với cột ghim.
  → Trả lời lại: Thêm token mới `zIndex.sticky` = 2. Đã viết đề xuất [ADR 004](../adr/004-sticky-z-index-token.md) gửi Magenta; trong lúc chờ, dùng `zIndex: 2` kèm `token-audit-ignore` ghi ADR 004.

### Code mâu thuẫn với quy tắc của vault

- **Q17 (A39 và lỗi upstream)** Code dùng token mà foundation đánh dấu `forbidden`: Toggle hover `green.400`, Stepper hover `blue.400` và `green.400`, Image `borderRadius="xl"` (`radii.xl`), TreeView `spacing.18`. Bỏ cấm các token này (gán role theo code), hay giữ cấm và coi code là lỗi?
  → Trả lời: Theo code: bỏ cấm các token code đang dùng.
- **Q18 (D8)** Menu con: code dùng `shadows.lg` (bằng menu cha), team muốn `shadows.xl` và note đang thêm bằng className. Theo code (bỏ className) hay giữ `xl`?
  → Trả lời: Theo code: menu con dùng `shadows.lg`.
- **Q19 (D1)** Avatar: code chọn ngẫu nhiên màu từ mức 500–800, trong đó 6 mức không đạt 4.5:1 với chữ trắng. Theo code (mọi mức), hay giữ giới hạn của note (chỉ mức đạt chuẩn)?
  → Trả lời: Theo code: dùng mọi mức 500–800; giữ là cặp tương phản chưa đạt chuẩn.
- **Q20 ([WeekPicker](../components/week-picker.md))** Figma yêu cầu đọc "Sales Week Business Logic Document" trước khi dùng WeekPicker; vault không có tài liệu này.
  → Trả lời (2026-11-10): Chưa define, để sau. Note giữ câu hỏi ở trạng thái hoãn.
- **Q21 ([WeekPicker](../components/week-picker.md))** Figma mô tả Week Range Picker ("Start week must be before End week"); package không có. Sẽ làm, hay ghép hai `WeekPicker`?
  → Trả lời (2026-11-10): Chưa define, để sau. Note không hướng dẫn cách ghép.
### Gửi báo cáo

- **E1** Danh sách lỗi upstream gửi cho ai, qua kênh nào? → xem phần E.
- **F1** Danh sách sửa Figma gửi cho ai trong team design? → xem phần F. Các mục B trả lời "Figma cần sửa" đã được thêm vào danh sách đó.
- **G1** Lấy được ảnh docs của các pattern data table không? → xem phần G.
