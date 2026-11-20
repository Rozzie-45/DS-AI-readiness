---
type: report
date: 2026-11-10
languages: [vi, en]
previous: token-architecture-audit-2026-11-06.md
---

# Kiểm tra kiến trúc token 2026-11-10 · Token architecture audit 2026-11-10

Mỗi đoạn có tiếng Việt trước, tiếng Anh (in nghiêng) sau. Tên token, đường dẫn file và mã giữ nguyên.
*Each paragraph is in Vietnamese first, then English (in italics). Token names, file paths and code are unchanged.*

Đối tượng: snapshot Magenta `5842dc1`, giống lần trước. Code token upstream không đổi; phần thay đổi nằm ở vault: các ghi chú foundation, `tokens/primitive.tokens.json` (sinh lại) và [ADR 004](../adr/004-sticky-z-index-token.md).
*Target: Magenta snapshot `5842dc1`, same as last run. Upstream token code is unchanged; what changed is the vault: foundation notes, the regenerated `tokens/primitive.tokens.json`, and ADR 004.*

**Có một lỗi mới cần sửa ngay: bản build gắn role sai cho `spacing.1` và `spacing.18`.** Ngày 10/11 nhóm bỏ cấm hai token này, và trình sinh token đang gán cho chúng các role thuộc về cả một khoảng giá trị. Kết quả là JSON nói với agent rằng `spacing.1` dùng được làm khoảng cách giữa các tag, trong khi `foundations/spacing.md` cấm điều đó. Vấn đề cấu trúc chính (không có tầng semantic) vẫn như cũ.
***One new issue needs fixing now: the build attaches the wrong roles to `spacing.1` and `spacing.18`.** The team un-forbade these two tokens on 11-10, and the generator now gives them roles meant for a whole range. The JSON therefore tells agents `spacing.1` is fine as a tag-group gap, which `foundations/spacing.md` forbids. The main structural gap (no semantic tier) is unchanged.*

## Xu hướng từ lần trước · Trend since last audit

| | 2026-11-06 | 2026-11-10 | Thay đổi · Change |
|---|---|---|---|
| 🟠 High | 1 | 2 | +1 (TA-12 mới · *new*) |
| 🟡 Medium | 4 | 4 | +1 (TA-13 mới) −1 (TA-05 hạ xuống Low · *downgraded*) |
| ⚪ Low | 6 | 7 | +1 (TA-05) |
| **Tổng · Total** | **11** | **13** | **+2** |
| Token `forbidden` | 15 | 10 | −5 (`radii.xl`, `colors.blue.400`, `colors.green.400`, `spacing.1`, `spacing.18`) |
| Token có role · *with roles* | 109 | 112 | +3 |

- **Mới · New:** TA-12 (role gắn sai do mở rộng khoảng · *wrong roles from range expansion*), TA-13 (thang z-index thiếu bậc · *z-index scale gap*).
- **Cải thiện · Improved:** TA-05. `spacing.1` dùng làm độ dày viền giờ đã được ghi thành role theo code (`foundations/spacing.md:84`), kèm hướng dẫn dùng `borders.1` cho viền mới.
  *`spacing.1` as a border width is now a documented role that follows the code, with `borders.1` named for new borders.*
- **Chưa xử lý từ lần trước · Unaddressed since last run:** TA-01 đến TA-11 (trừ TA-05). Upstream chưa có bản mới, nên các phát hiện phía code Magenta không thể thay đổi. Nhưng TA-09 và TA-11 nằm hoàn toàn trong vault và có thể sửa ngay.
  *TA-01 to TA-11 except TA-05. Upstream hasn't moved, so findings on Magenta code can't change yet. TA-09 and TA-11 are vault-only and can be fixed now.*

## Cấu trúc tầng · Tier structure

Không đổi: Primitive 🟢 Strong · Semantic 🔴 Absent · Component: không dùng · *not used* · Rò rỉ tầng · *Tier leakage*: 0. Chi tiết trong [báo cáo 06/11](archive/token-architecture-audit-2026-11-06.md#cấu-trúc-tầng--tier-structure) · *Details in the 11-06 report.*

## Phát hiện mới và thay đổi · New and changed findings

### TA-12 🟠 High · Giá trị · Value · Trình sinh gán role của cả khoảng cho token ngoài thang · Generator gives off-scale tokens the roles of a whole range

- **Bằng chứng · Evidence:**
  - `scripts/build-tokens.mjs:89-97` (`refsIn`): một ô bảng viết dạng "`spacing.0` – `spacing.10`" được mở rộng thành **mọi** token trong khoảng, kể cả token không nằm trong thang tài liệu.
    *A cell written "`spacing.0` – `spacing.10`" expands to every token in the span, including tokens outside the documented scale.*
  - `foundations/spacing.md:80,82` (khoảng `spacing.0`–`spacing.10`) và `:91-92` (khoảng `spacing.12`–`spacing.24`).
  - Kết quả trong `tokens/primitive.tokens.json` · *Result:*
    - `spacing.1` nhận "Gap between repeating small elements (tag group)" và "Vertical space between elements in a card…"
    - `spacing.18` nhận "Vertical space between elements in cards" và "Space between elements in a form"
  - Trong khi đó `foundations/spacing.md:56` ghi: "Do not use them for other spacing."
    *Meanwhile the note says: "Do not use them for other spacing."*
- **Vì sao High · Why High:** AGENTS.md bảo agent đọc role từ `$extensions.mds.roles`. Trong 6 role của hai token này, có 4 role sai và mâu thuẫn với ghi chú gốc. Lỗi có từ trước, nhưng trạng thái `forbidden` che nó đi; bỏ cấm ngày 10/11 thì lỗi lộ ra. `build-tokens --check` vẫn qua, vì JSON đúng với *trình sinh*, chỉ sai so với *ý của ghi chú*.
  *AGENTS.md tells agents to read roles from `$extensions.mds.roles`. Four of these two tokens' six roles are wrong and contradict the source note. The bug was latent and hidden by `forbidden`; lifting that on 11-10 exposed it. `--check` still passes, because the JSON matches the generator, not the note's intent.*
- **Hành động · Action:** Khi mở rộng khoảng, bỏ qua các token mà bảng Primitive tokens đánh dấu "In the docs scale: no" (`foundations/spacing.md:148`, cột đó đã có sẵn). Hoặc cho `--check` báo lỗi khi một token nhận role vừa qua khoảng vừa có câu "Do not use them for other…". Sau khi sửa, `spacing.1` chỉ giữ role viền 1px và `spacing.18` chỉ giữ role nhánh TreeView.
  *Skip tokens marked "In the docs scale: no" when expanding a range (the column already exists in `foundations/spacing.md:148`), or make `--check` fail when a token gets a range role while its note restricts it. After the fix, `spacing.1` keeps only the 1px-line role and `spacing.18` only the TreeView branch role.*

### TA-13 🟡 Medium · Độ phủ · Coverage · Thang z-index nhảy từ 1 lên 500 · z-index scale jumps from 1 to 500

- **Bằng chứng · Evidence:** `.source/magenta/packages/css/src/tokens.ts:250` (`above` = 1) và `:257` (`menu` = 500). [ADR 004](../adr/004-sticky-z-index-token.md) ghi lại lỗi đo được: header ghim bị ô ghim trong thân bảng đè lên khi cuộn (`#/table-sticky-pinning`).
  *`above` = 1, `menu` = 500. ADR 004 records a measured bug: pinned body cells cover pinned header cells on scroll.*
- **Trạng thái · Status:** Đang xử lý. ADR 004 (*proposed*) đề xuất `zIndex.sticky` = 2; tạm thời trang dùng `zIndex: 2` kèm `token-audit-ignore`. Cách xử lý đúng quy trình code → vault của ADR 003.
  *In progress. ADR 004 (proposed) suggests `zIndex.sticky` = 2; pages use `zIndex: 2` with `token-audit-ignore` meanwhile. This follows the ADR 003 code-to-vault flow.*
- **Hành động · Action:** Gửi đề xuất cho Magenta, và khi gửi thì hỏi luôn: trong một component có cần nhiều hơn ba bậc (`below`/`base`/`above`/`sticky`) không? Nếu có, nên đề xuất một thang trong-component (1, 2, 3…) thay vì thêm từng tên một.
  *Send the proposal, and ask whether components need more than these in-component steps. If so, propose an in-component scale rather than adding names one by one.*

### TA-05 ⚪ Low (trước là 🟡 Medium · *was Medium*) · Thang `spacing`/`sizes` và token 1px · scales and 1px tokens

- **Thay đổi · Change:** `foundations/spacing.md:84` giờ ghi `spacing.1` là role "1px lines drawn as width in components" và hướng viền mới sang `borders.1`. Sự khác biệt giữa ba token 1px đã có tài liệu, nên hạ xuống Low.
  *The note now documents `spacing.1` as the 1px-line role and points new borders to `borders.1`. The distinction is documented, so this drops to Low.*
- **Còn lại · Remaining:** Phía upstream vẫn nên đổi sang `borders.1` (đã có trong [upstream-issues-2026-11-10.md](upstream-issues-2026-11-10.md) dòng 346). Độ lệch 18/36 giữa hai thang vẫn chưa có quyết định. Lưu ý: TA-12 làm role của `spacing.1` rộng hơn mức ghi chú cho phép.
  *Upstream should still swap to `borders.1` (already in the upstream issues report). The 18/36 drift is still undecided. Note that TA-12 widens `spacing.1`'s roles beyond what the note allows.*

## Phát hiện không đổi · Unchanged findings

Chi tiết và bằng chứng như [báo cáo 06/11](archive/token-architecture-audit-2026-11-06.md); file và dòng code upstream không đổi.
*Details and evidence as in the 11-06 report; upstream files and lines are unchanged.*

| ID | Mức · Severity | Nội dung · Summary | Ghi chú lần này · Note this run |
|---|---|---|---|
| TA-01 | 🟠 High | Không có tầng semantic · *No semantic tier* | ADR 002 vẫn *proposed*; `foundations/color.md` vẫn `draft-ai` · *still proposed / draft-ai* |
| TA-02 | 🟡 Medium | `background-overlay.50`: tên vai trò, `50` là độ mờ · *role name, `50` is alpha* | upstream-issues:138 thêm: Storybook ghi sai tên biến · *Storybook misnames the variable* |
| TA-03 | ⚪ Low | `primary`/`secondary` là tên vai trò của palette · *role-named palettes* | — |
| TA-04 | 🟡 Medium | `neutral.900`/`1000` chép thô vào shadow và overlay · *copied raw into shadows and overlay* | — |
| TA-06 | ⚪ Low | Tên cỡ `fontSizes`/`lineHeights` không khớp cặp · *t-shirt names don't pair* | — |
| TA-07 | ⚪ Low | Đơn vị px/rem lẫn lộn · *Mixed px/rem* | — |
| TA-08 | 🟡 Medium | Không có token chuyển động/độ mờ · *No motion or opacity tokens* | known-issues C21 hỏi về foundation motion, chưa có trả lời · *open question, unanswered* |
| TA-09 | ⚪ Low | Text style gắn `tier: primitive` · *Text styles tagged primitive* | Chỉ trong vault, sửa được ngay · *Vault-only, fixable now* |
| TA-10 | ⚪ Low | Token không dùng: `zIndex.base` (0 tham chiếu), `navigation-overlay` và `shadows.inner` (đều `forbidden`); 45 màu chưa xác nhận · *orphans; 45 colours unconfirmed* | Code không đổi nên số liệu giữ nguyên · *Same code, same counts* |
| TA-11 | ⚪ Low | ADR 001 (`:25,68`) và ADR 003 (`:33`) mâu thuẫn về `semantic.tokens.json` · *ADRs disagree* | Chỉ trong vault, sửa được ngay · *Vault-only, fixable now* |

## Thứ tự khắc phục · Remediation priority

1. **Sửa trước · Fix first:** TA-12. Lỗi nằm trong vault, sửa nhanh, và đang cho agent hướng dẫn sai. Sau đó là TA-01 (cấu trúc, cần upstream).
   *Vault-side, quick, and currently misleading agents. Then TA-01 (structural, needs upstream).*
2. **Sửa tiếp · Fix next:** TA-13 (gửi ADR 004), TA-04, TA-08, TA-09.
3. **Xử lý dần · Address eventually:** TA-02, TA-03, TA-05, TA-06, TA-07, TA-10, TA-11.

## Ước tính công sức · Effort estimates

Các ước tính TA-01 đến TA-11 giữ như báo cáo 06/11. Dưới đây chỉ có mục mới hoặc mục thay đổi.
*Estimates for TA-01 to TA-11 stand as in the 11-06 report. New or changed items only:*

| Phát hiện · Finding | Công sức · Effort | Giả định · Assumptions | Độ tin cậy · Confidence |
|---|---|---|---|
| TA-12 | 2–4 giờ · *h* | Sửa `refsIn` để đọc cột "In the docs scale", build lại, thêm một ca kiểm tra trong `evals/`<br>*Change `refsIn` to read the "In the docs scale" column, rebuild, add one eval case* | Cao · High |
| TA-13 | 0.5–1 giờ phía vault; phía Magenta chưa rõ<br>*0.5–1 h vault side; Magenta side unknown* | ADR 004 đã viết; chỉ cần gửi và theo dõi · *ADR written; send and track* | Thấp · Low: phụ thuộc lịch phát hành Magenta · *depends on Magenta release* |
| TA-05 | 1–2 giờ upstream (6 chỗ đổi sang `borders.1`) · *1–2 h upstream (6 swaps)* | Magenta nhận đề xuất · *Magenta accepts* | Cao · High |

## Phạm vi · Scope

- **Đã kiểm tra · Inspected:** `tokens/*.tokens.json` (sinh lại, `--check` trả về 0); `scripts/build-tokens.mjs:75-125`; `foundations/{spacing,z-index,border,color}.md` (các phần đã đổi · *changed sections*); `adr/004-sticky-z-index-token.md`; `reports/upstream-issues-2026-11-10.md`, `reports/known-issues-2026-11-10.md` (các dòng liên quan token · *token-related lines*); danh sách file đổi từ sau báo cáo 06/11 · *files modified since the 11-06 report*.
- **Chưa kiểm tra · Not inspected:** upstream (snapshot không đổi, `5842dc1`, nên lượt tìm token không dùng không chạy lại · *orphan pass not re-run*); repo sản phẩm · *product repos*; Figma; `.prototype/`.
- **Cách kiểm chứng "không tìm thấy" · How "none found" was checked:** "Không token `forbidden` nào có role" được kiểm bằng cách duyệt cả 191 token trong `primitive.tokens.json`; cùng phép duyệt đó đếm được 112 token có role, khớp với kết quả của `build-tokens`.
  *"No forbidden token carries roles" was checked by walking all 191 tokens; the same walk counts 112 tokens with roles, matching `build-tokens` output.*
- **Giả định · Assumptions:** Không có `.ds-ops-config.yml`, nên phần xu hướng so sánh tay với báo cáo 06/11. Các phát hiện về code upstream được coi là không đổi vì commit snapshot giống hệt.
  *No `.ds-ops-config.yml`; the trend compares by hand with the 11-06 report. Upstream findings are carried over because the snapshot commit is identical.*

> **Lưu ý về bối cảnh:** Bản kiểm tra này nhìn thấy các file token, nhưng không nhìn thấy những quyết định đằng sau chúng. Một số phát hiện có thể chỉ ra những cách làm mà nhóm đã cố ý chọn. Nếu phát hiện nào mô tả một quyết định có chủ đích, hãy cho tôi biết — tôi sẽ loại nó khỏi các lần chạy sau và học theo quy ước của hệ thống. Mục tiêu là tìm ra những vấn đề bạn chưa thấy, không phải phán xét lại những lựa chọn đã đưa ra.
>
> ***A note on context:** This audit sees your token files — it does not see the decisions behind them. Some findings may flag patterns your team chose deliberately. If any finding describes an intentional decision, let me know — I'll exclude it from future runs and learn your system's conventions. The goal is to surface problems you haven't seen yet, not to second-guess choices you've already made.*
