---
type: report
date: 2026-11-09
languages: [vi]
---

# Kế hoạch hoàn thiện component · 2026-11-09

Đối tượng: snapshot Magenta `5842dc1` ([source.lock.json](../source.lock.json)). Kế hoạch dựa trên cấu trúc vault hiện có ([templates/README.md](../templates/README.md)) và các bài viết về design system sẵn sàng cho AI (xem cuối file).

## 1. Cấu trúc hiện có, tóm tắt

```
.source/magenta (code, read-only)
   │  scripts/build-tokens.mjs        → tokens/*.tokens.json  → build/figma/* → Figma variables (ADR 003)
   │  scripts/build-contracts.mjs     → contracts/<Name>.json (+ khối GENERATED trong note)
   │  scripts/figma/read-components   → contracts/figma-components.json
   │  scripts/propose-figma-map.mjs   → reports/component-mapping-<date>.md (đề xuất)
   ▼
components/<name>.md  (người/AI viết: when to use, why, a11y, Figma mapping, open questions)
   │  scripts/setup-prototype.mjs     → .prototype/magenta/apps/prototype/src/screens/<name>.tsx
   │  checks/token-audit.mjs          → kiểm tra giá trị thô
   ▼
build/meta/<name>.meta.json  (CHƯA CÓ, phase 3)  +  llms.txt (đang viết tay)
```

Một note component đi qua các bước sau (theo những note đã làm, ví dụ [divider.md](../components/divider.md)):

1. Đọc nguồn trong `sources`: `docs/stories/Components/<X>/Design.mdx`, `<X>.mdx`, `Examples/`, file `.tsx`, `.model.ts` và recipe.
2. Đọc set Figma, điền bảng Figma to code mapping.
3. Viết note theo [templates/component.md](../templates/component.md). Chỗ nào không có nguồn thì đưa vào Open questions.
4. Tạo màn prototype `#/<name>`, đo hành vi rồi ghi vào Behavior/Composition, sau đó chạy `token-audit`.
5. Thêm một dòng vào [llms.txt](../llms.txt).

## 2. Định nghĩa "xong" (exit criteria), đề xuất

Phỏng theo pipeline của Kaelig (mỗi bước có exit criteria và chỗ thiếu thì đánh dấu thay vì đoán), checklist của Southleft và evals của Murphy Trueman. Cột "Kiểm bằng" cho biết tiêu chí nào script kiểm được ngay, tiêu chí nào cần script mới.

| # | Tiêu chí | Kiểm bằng |
|---|---|---|
| 1 | Contract có props đầy đủ; `build-contracts --check` = 0 | Script có sẵn |
| 2 | Note có đủ mọi `##` của template; chỗ trống nằm trong Open questions, không bịa | Cần validator (phase 3) |
| 3 | When not to use: mỗi dòng nêu component thay thế | Validator |
| 4 | Frontmatter `can_contain` / `required_children` điền khi component có con (Murphy: composable contracts) | Validator |
| 5 | Accessibility: có Keyboard, Accessible name, Focus và Contrast pairs | Validator |
| 6 | Bảng Figma mapping được người xác nhận; Figma set có description theo PURPOSE / BEHAVIOR / COMPOSITION / USAGE / CODE GEN NOTES (Southleft) | Người + figma-console |
| 7 | Có màn prototype; `token-audit` 0 lỗi; xem ở 1024 / 1280 / 1920px | Script có sẵn |
| 8 | Có ít nhất 1 eval case. Prompt viết theo ý định, không gọi tên component; kiểm prop, token và việc chọn đúng component | Cần dựng (`evals/`) |
| 9 | Có người duyệt: `review_status: approved`, kèm `reviewed_by` và `reviewed_on` | Người |
| 10 | Có trong `llms.txt` và `build/meta/<name>.meta.json` sinh được, đúng schema | Phase 3 |

Một component đạt 1–7 thì xem như "đã viết xong, chờ duyệt". Đạt 1–10 thì "AI-ready".

## 3. Hiện trạng component

### 3.1 Đã có note: 30 nhóm, tất cả `draft-ai`

Autocomplete, Avatar, Button, ButtonGroup, Checkbox, Collapse, CompactWrapper, Dialog, Divider, FeedbackMessages (Alert, Banner, InlineBanner, Toast), HelperText, IconButton, Indicator, Input, Link, List, Menu, NonModalDialog, NumberInput, Pagination, Popover, Radio, SearchInput, Select, Spinner, Table, TabGroup, Tabs, Tag, TagsInput, Textarea, Toggle, Tooltip.

Cả 30 note này đang đạt tiêu chí 1, 3, 5, 7 ở mức khác nhau, nhưng chưa note nào đạt tiêu chí 8 và 9.

### 3.2 Chưa có note: 17 nhóm trong `magenta-react`

| Component | Props | Docs upstream | Figma | Ghi chú |
|---|---|---|---|---|
| `Accordion` (+Item, Control, Panel) | 10 | Có, đủ | Đã đọc | **Đã viết 2026-11-09**: [accordion.md](../components/accordion.md), screen `#/accordion`, draft-ai |
| `FormCheck` | 10 | Không có trang riêng | Đã đọc | **Đã viết 2026-11-09**: [form-check.md](../components/form-check.md), screen `#/form-check`, draft-ai |
| `Text` | 4 | Typography/Props.mdx | Đã đọc | **Đã viết 2026-11-09**: [text.md](../components/text.md), screen `#/text`, draft-ai; note mỏng, trỏ sang [typography.md](../foundations/typography.md) |
| `TreeView` (+TreeItem) | 6 | Có | Đã đọc | **Đã viết 2026-11-09**: [tree-view.md](../components/tree-view.md), screen `#/tree-view`, draft-ai |
| `Breadcrumb` | 4 | Có | Đã đọc | **Đã viết 2026-11-09**: [breadcrumb.md](../components/breadcrumb.md), screen `#/breadcrumb`, draft-ai |
| `Drawer` (+Header, Body) | 10 | Có | Đã đọc | **Đã viết 2026-11-09**: [drawer.md](../components/drawer.md), screen `#/drawer`, draft-ai |
| `Stepper` (+Step) | 11 | Có | Đã đọc | **Đã viết 2026-11-09**: [stepper.md](../components/stepper.md), screen `#/stepper`, draft-ai |
| `CircularProgress`, `LinearProgress` | 5 | ProgressBar/ | Đã đọc | **Đã viết 2026-11-09**: [progress.md](../components/progress.md), screen `#/progress`, draft-ai. Contract đã sửa: `build-contracts.mjs` giờ đọc kiểu props dùng chung (`ProgressProps`) |
| `Segmented` (+Item) | 4 | Có | Đã đọc | **Đã viết 2026-11-09**: [segmented.md](../components/segmented.md), screen `#/segmented`, draft-ai |
| `InlineEdit` (+Control) | 21 | Có | Đã đọc | **Đã viết 2026-11-09**: [inline-edit.md](../components/inline-edit.md), screen `#/inline-edit`, draft-ai |
| `Timeline` (+Item) | 4 | Có | Đã đọc | **Đã viết 2026-11-09**: [timeline.md](../components/timeline.md), screen `#/timeline`, draft-ai |
| `Shortcut` | 7 | Có | Đã đọc | **Đã viết 2026-11-09**: [shortcut.md](../components/shortcut.md), screen `#/shortcut`, draft-ai |
| `Image` (+ImageBase) | 20 | Có | Đã đọc | **Đã viết 2026-11-09**: [image.md](../components/image.md), screen `#/image`, draft-ai |
| `Lightbox` | 9 | Không có trang riêng | — | **Đã viết 2026-11-09** trong [image.md](../components/image.md) |
| `Carousel` (+5 phần) | 15 | Có | Đã đọc | **Đã viết 2026-11-09**: [carousel.md](../components/carousel.md), screen `#/carousel`, draft-ai. Contract `CarouselPrevious` đã sửa trong `build-contracts.mjs` |
| `Resizeable` (+Handle) | 15 | Không có, chỉ có ví dụ trong NonModalDialog, Textarea | — | **Quyết định 2026-11-10: nội bộ, không viết note riêng.** Code chỉ dùng bên trong NonModalDialog; đã ghi vào [non-modal-dialog.md](../components/non-modal-dialog.md). Resize cột bảng dùng TanStack ([data-table-columns](../patterns/data-table-columns.md)) |

### 3.3 Ngoài phạm vi contract hiện tại

`build-contracts.mjs` mới đọc `packages/react`. Các package đã publish sau đây chưa có contract hay note nào:

- `magenta-react-dates` 1.14.0: Calendar, DatePicker, DateRangePicker, DateTimePicker, MonthPicker, MonthRangePicker, QuarterlyPicker, QuarterlyRangePicker, TimePicker, WeekPicker, DatesProvider. Docs có đủ trong `docs/stories/Dates/`.
- `magenta-react-text-editor` 1.3.1: Editor và các extension, docs trong `docs/stories/Editor/`.

DatePicker có mặt trong hầu hết form nghiệp vụ, nên đây là khoảng trống lớn.

### 3.4 Nguồn docs upstream chưa dùng

- `docs/stories/Content/`: VoiceAndTone, Buttons, Numbers, Feedback. Đây là nguồn cho phần **Voice and tone của DESIGN.md**.
- `docs/stories/Patterns/`: Forms, PageHeader, SearchFilterArea, SavedFilter. Đây là pattern mới.
- `docs/stories/Components/DecisionTree/`: hướng dẫn chọn component cho nhập/chọn dữ liệu và feedback. Đây là nguồn cho pattern loại `decision` và cho mục "Compared to similar components".

### 3.5 Nguồn Figma (đọc qua figma-console ngày 2026-11-09)

File `m5GWvQiv67rsNlBinvOqlR`. "Doc frame" là frame `<X>-Document-Overview` chứa hướng dẫn sử dụng. Trạng thái lấy từ trang "Information Architect - Component status", nơi trạng thái được mã hoá bằng màu: RELEASED, DONE DESIGN, Unavailable.

| Component | Trang Figma | Component set (số variant) | Doc frame | Trạng thái Figma |
|---|---|---|---|---|
| Accordion | Accordions | Accordions (12), Accordion base (48), Nested Accordion (16) | Có | Released |
| Breadcrumb | Breadcrumb | Breadcrumb (6), Breadcrumb item (18), Breadcrumb overflow item (9) | Có | Released |
| Drawer | Drawer | Chỉ có Double drawer (2) | Có | Released |
| Stepper | Stepper | Stepper (2), Step base (216) | Có | Released |
| Progress | Progress Bar | Circular (18), Linear (18), track item (3) | Có | Released |
| Segmented | Segmented Control | Segmented control (15), Segment item (24) | Có | Released |
| FormCheck | Checkbox / Radio Button | Checkbox group (6), Radio button form group (6) | Nằm trong doc của Checkbox và Radio | — |
| InlineEdit | Inline Editing - Inprogress | Inline editing item (72) | Có ("Inline Edit-Document") | Không có trong sitemap; tên trang ghi đang làm |
| TreeView | Tree view | Tree view item (189), value item (18), Expand-Collapse (6), Indent spacer (5) | Có | Released |
| Timeline | Timeline | Timeline (2), Timeline Step base (36) | Có | Không có trong sitemap |
| Text | 📗 Typography | Không có set, chỉ có text style | Có | Foundation |
| Shortcut | Shortcut | Calendar shortcut item (27, có description) | Có | Không có trong sitemap |
| Image | Image | Image (54) | **Không có** | **Unavailable**, trong khi code đã có |
| Lightbox | — | **Không có** | — | — |
| Carousel | Carousel | Carousel (2), arrow item (20), indicator item (9) | Có | Released |
| Resizeable | Utilities | Resizer (2, có description) | Không có | — |
| Date pickers | Date & Time Picker, Calendar - Updating | 11 + 14 set | 9 doc frame | Released; Calendar ghi "Done design" |
| Editor | Text editor | 6 set | Có | Không có trong sitemap |

Sitemap lệch với code ở mấy chỗ, cần ghi vào Open questions của note tương ứng:

- Image được đánh dấu Unavailable nhưng code có `Image`.
- Calendar và Data Table ghi "Done design, chưa phát triển" nhưng code đã có.
- Cards, File upload và Slider có trong sitemap nhưng chưa có trong code.

## 4. Kế hoạch theo đợt

### Đợt 0: Chuẩn bị (làm một lần, mở đường cho mọi đợt sau)

1. Sửa `build-contracts.mjs` để lần theo re-export `from '.'`. Việc này lấp props cho `CircularProgress`, `LinearProgress`, `CarouselNext`, `CarouselPrevious` và các component khác trong danh sách "No props type".
2. Đọc các trang Figma còn thiếu vào `contracts/figma-components.json` bằng `read-components.plugin.js`, vài trang mỗi lần, kèm instance lồng bên trong (bài học số 4 của [pilot workflow A](archive/workflow-a-pilot-2026-11-04.md)).
3. Chốt exit criteria ở mục 2 vào `templates/README.md`.
4. Viết skill `component-note` gói quy trình 5 bước ở mục 1 để mỗi component làm giống nhau.

### Đợt 1: Component cốt lõi cho màn nghiệp vụ

`Drawer`, `Breadcrumb`, `Accordion`, `Stepper`, `Progress` (Circular + Linear), `Segmented`, `FormCheck`.

Lý do: đây là các thành phần điều hướng, overlay và form, xuất hiện trên hầu hết màn hình. Docs đều đủ, trừ FormCheck (FormCheck chủ yếu viết phần Composition, lấy từ note Checkbox và Radio).

### Đợt 2: Dữ liệu và chỉnh sửa

`InlineEdit`, `TreeView`, `Timeline`, `Text`, `Shortcut`.

`InlineEdit` cần đối chiếu với [data-table-editing](../patterns/data-table-editing.md). `Text` cần đối chiếu với foundation typography và `tokens/text-styles.tokens.json`.

### Đợt 3: Media và utility

`Image` cùng `Lightbox`, `Carousel`, `Resizeable`. Trước khi viết `Resizeable` cần hỏi team đây là API public hay chỉ dùng nội bộ.

### Đợt 4: Mở rộng sang package khác

Mở rộng `build-contracts.mjs` cho `react-dates` và `react-text-editor`, sau đó viết note cho DatePicker, DateRangePicker, TimePicker và Editor.

**2026-11-10: đã mở rộng script.** Có thêm 44 contract (19 của `react-dates`, 25 của `react-text-editor`); 119 contract của `magenta-react` không đổi. `DatesProvider` không được export từ `components/index.ts` nên không có contract.

Đề xuất chia note (mỗi note gom một họ component):

Prototype: `vite.config.ts` pre-bundle `@react-input/mask` (qua react-dates) và `dayjs`; nếu không, Vite gom chúng ở lượt sau với bản React khác và DatePicker báo "Invalid hook call" (2026-11-10).

Prototype: `panda.config.ts` bỏ `jsxFramework` (2026-11-10). Trước đó Panda của prototype sinh lại recipe Magenta (button, …) vào `styles.css`, nạp sau `magenta-react/index.css`, nên ghi đè các rule ghép như divider của nút trigger date/time picker. Các phép đo trước ngày này có thể bị ảnh hưởng ở chỗ một recipe ghi đè recipe khác. **Đã kiểm 2026-11-10:** so computed style 34 screen ở 1024/1280/1920px, kể cả menu, popover, drawer, lightbox, lịch đang mở. Chỉ khác ở divider của date/time picker (đã sửa note), chiều rộng NumberInput (note không ghi số cũ; đã thêm số đo mới) và `display` của helper text FormCheck (bố cục không đổi). Không note nào khác bị ảnh hưởng.

| Note | Export | Trang Figma |
|---|---|---|
| `date-picker.md` | DatePicker, DateTimePicker | Date & Time Picker: Date picker, Date-Time-Picker. **Đã viết 2026-11-10**: [date-picker.md](../components/date-picker.md), screen `#/date-picker`, draft-ai |
| `date-range-picker.md` | DateRangePicker | Date-Range-Picker. **Đã viết 2026-11-10**: [date-range-picker.md](../components/date-range-picker.md), screen `#/date-range-picker`, draft-ai |
| `time-picker.md` | TimePicker | Time picker, Time selection menu. **Đã viết 2026-11-10**: [time-picker.md](../components/time-picker.md), screen `#/time-picker`, draft-ai |
| `month-picker.md` | MonthPicker, MonthRangePicker | Month Picker, Month-Range-Picker. **Đã viết 2026-11-10**: [month-picker.md](../components/month-picker.md), screen `#/month-picker`, draft-ai |
| `quarterly-picker.md` | QuarterlyPicker, QuarterlyRangePicker | Quarter Picker, Quarter-Range-Picker. **Đã viết 2026-11-10**: [quarterly-picker.md](../components/quarterly-picker.md), screen `#/quarterly-picker`, draft-ai |
| `week-picker.md` | WeekPicker | Week Picker. **Đã viết 2026-11-10**: [week-picker.md](../components/week-picker.md), screen `#/week-picker`, draft-ai |
| `calendar.md` | Calendar, DateTimeCalendar, DualCalendar, SingleDateRangeCalendar, MonthCalendar, MonthRangeCalendar, QuarterlyCalendar, QuarterlyRangeCalendar, WeekCalendar, CalendarWrapper | Calendar - Updating. **Đã viết 2026-11-10**: [calendar.md](../components/calendar.md), screen `#/calendar`, draft-ai. Làm trước QuarterlyPicker và WeekPicker để các note picker trỏ sang |
| `editor.md` | Editor, EditorContent, EditorToolbar, ButtonController, MenuItemController, 9 `*Controller`, 10 `*Extension`, AllowedProtocols | Text editor. **Đã viết 2026-11-10**: [editor.md](../components/editor.md), screen `#/editor`, draft-ai. Prototype build thêm react-text-editor (`setup-prototype.mjs`, `optimizeDeps` cho tiptap) |

**Kiểm độ phủ 2026-11-10:** 163/163 export của 3 package đã có trong ít nhất một note (55 note). Bổ sung lần cuối: `InputContainer` (input.md), `FeedbackMessageColor`/`FeedbackMessagePosition` (feedback-messages.md), tên đầy đủ các `*Extension` (editor.md). Chưa có note riêng cho `Resizeable` (nội bộ) và `DatesProvider` (không export).

### Song song: đóng 30 note draft

Không cần chờ các đợt trên. Lần lượt cho từng note:

1. Chạy checklist mục 2.
2. Gửi người phụ trách duyệt.
3. Đặt `approved`.

Ưu tiên các component pilot (Button, Input, Select, Checkbox, Tag, Dialog, Tabs, FeedbackMessages, Menu, Table) vì bảng mapping của chúng đã có đề xuất ([component-mapping](archive/component-mapping-2026-11-04.md)).

### Song song: hạ tầng phase 3 và evals

**2026-11-10:** đã có validator `checks/note-lint.mjs` (55 note: 0 lỗi, 55 cảnh báo, báo cáo `reports/note-lint-2026-11-10.md`) và `evals/` (5 case, `evals/check.mjs`). **`build/meta` đã làm 2026-11-10:** `scripts/build-meta.mjs` sinh 148 file (một file cho mỗi export có component), hợp lệ theo schema; `--check` báo khi file cũ. Quy trình cập nhật ghi trong AGENTS.md.

- `build/meta` cùng validator (tiêu chí 2–5 và 10) và script `build-llms`.
- `evals/`: khởi đầu với 5 case (xoá có xác nhận, form tạo mới, bảng có lọc, thông báo lỗi lưu, chọn ngày). Mỗi case có check cơ học (prop có trong contract, `token-audit`) và một rubric phán đoán. Có thể chạy bằng promptfoo.
- `DESIGN.md`: **2026-11-10** đã điền bản nháp Purpose, Principles và Voice and tone từ Storybook (Getting Started, Decision Tree, Voice & Tone). Đã bổ sung từ Figma (trang bìa, nguyên tắc của Colors và Spacing) và điền Visual language cho Color, Typography, Space. Còn trống: Shape and elevation, Motion, Composition and hierarchy, Named decisions, Tech stack.

## 5. Câu hỏi cho team Magenta

1. ~~`Resizeable` và `Lightbox` có phải API public cho sản phẩm không?~~ Đã trả lời 2026-11-10: `Resizeable` là nội bộ (chỉ dùng trong NonModalDialog). `Lightbox` được ghi trong [image.md](../components/image.md), nơi Image dùng nó khi bật `preview`.
2. `FormCheck` có trang docs hoặc set Figma riêng không?
3. Ai là owner duyệt (`reviewed_by`) cho từng nhóm component?
4. `DecisionTree` có được xem là pattern chính thức để agent dựa vào khi chọn component không?
5. ADR 002 (semantic token) đã có lịch không?

## Nguồn tham khảo

- Kaelig, *Design system components with AI agent teams*: pipeline, exit criteria, `[PENDING]`/`[BLOCKING]`.
- Southleft, *Anatomy of an AI-ready design system* và *AI design systems*: checklist Figma, cấu trúc description.
- Murphy Trueman, *Your next design system user is an agent*, *Not perfect, just honest*, *Design systems need evals*, *Your design system is fragmenting into agent files*, *The parts of your system you never wrote down*.
