---
type: report
date: 2026-11-06
languages: [vi, en]
---

# Kiểm tra kiến trúc token 2026-11-06 · Token architecture audit 2026-11-06

Mỗi đoạn có tiếng Việt trước, tiếng Anh (in nghiêng) sau. Tên token, đường dẫn file và mã giữ nguyên.
*Each paragraph is in Vietnamese first, then English (in italics). Token names, file paths and code are unchanged.*

Đối tượng: snapshot Magenta `5842dc1` ([source.lock.json](../../source.lock.json)). Nguồn token: `packages/css/src/tokens.ts`, `packages/css/src/recipes/Text/textStyles.ts`, `packages/css/src/breakpoints.ts`, được đọc qua `packages/css/src/preset.ts`. File sinh ra: [tokens/primitive.tokens.json](../../tokens/primitive.tokens.json), [tokens/text-styles.tokens.json](../../tokens/text-styles.tokens.json).
*Target: Magenta snapshot `5842dc1`. Token source: the files above, read through `preset.ts`. Generated files: the two token JSON files above.*

Báo cáo này kiểm tra cách token được **định nghĩa**. Cách code **sử dụng** token nằm trong [token-audit-2026-11-04.md](token-audit-2026-11-04.md) (do `checks/token-audit.mjs` viết). Đây là lần kiểm tra kiến trúc đầu tiên nên chưa có phần xu hướng.
*This audits how tokens are **defined**. How code **uses** them is in the 2026-11-04 report, written by `checks/token-audit.mjs`. This is the first architecture run, so there is no trend section.*

**Magenta có tầng primitive gọn gàng nhưng không có tầng semantic.** Đó là vấn đề cấu trúc duy nhất. Phần còn lại là các vấn đề nhỏ, cục bộ: một màu mang tên vai trò, màu xám neutral bị chép thành giá trị thô trong shadow, hai thang kích thước gần giống nhau, và không có token chuyển động.
***Magenta has a clean primitive tier and no semantic tier.** That is the one structural problem. Everything else is small and local: one colour that carries a role name, neutral grey copied as raw values into shadows, two near-identical size scales, and no motion tokens.*

## Tóm tắt · Summary

Tầng primitive gọn gàng: 191 token và 51 text style. Token nào cũng có mô tả. Không có hai mức màu nào trùng mã hex. Mọi tên đều dùng kebab-case. Cả 51 text style đều tham chiếu token cho mọi giá trị con. `node scripts/build-tokens.mjs --check` trả về 0, nghĩa là JSON sinh ra khớp với code. Không có phát hiện nào ở mức Critical.
*The primitive layer is tidy: 191 tokens and 51 text styles. Every token has a description. No two palette levels share a hex value. All names use kebab-case. All 51 text-style composites alias their sub-values. `build-tokens.mjs --check` exits 0, so the generated JSON matches the code. Nothing here is Critical.*

Lỗ hổng thật sự là điều [ADR 001](../../adr/001-color-roles-on-palette-tokens.md) đã nêu. Các vai trò như "body text" chỉ tồn tại trong các ghi chú foundation và trong `$extensions.mds.roles`. Mọi recipe đều tham chiếu thẳng tới mức màu của palette. Hệ quả: đổi một vai trò nghĩa là phải sửa mọi recipe dùng nó, và không có đường đi tới theme thứ hai. ADR đã chấp nhận đây là giải pháp tạm. Báo cáo này xếp mức High vì các phát hiện khác đều bắt nguồn từ nó: primitive mang tên vai trò, thiếu token trạng thái, và recipe dùng token spacing làm độ dày viền.
*The real gap is the one ADR 001 already names. Roles such as "body text" exist only in the foundation notes and in `$extensions.mds.roles`. Every recipe references palette levels directly. A role change therefore means editing every recipe that uses it, and there is no route to a second theme. The ADR accepted this as temporary. This report rates it High because the other findings follow from it: role-named primitives, missing state tokens, and recipes using a spacing token as a border width.*

## Cấu trúc tầng · Tier structure

| Tầng · Tier | Trạng thái · Status | Bằng chứng · Evidence |
|---|---|---|
| Primitive | 🟢 Mạnh · Strong | `tokens.ts:1-263`: 13 nhóm, thang nhất quán, mô tả đầy đủ trong JSON sinh ra<br>*13 categories, consistent scales, full descriptions in the generated JSON* |
| Semantic | 🔴 Không có · Absent | `preset.ts:291` chỉ truyền `tokens`; không có khóa `semanticTokens`. Vai trò được ghi trong tài liệu, không có trong code ([ADR 001](../../adr/001-color-roles-on-palette-tokens.md))<br>*Passes `tokens` only; no `semanticTokens` key. Roles are documented, not coded* |
| Component | Không dùng · Not used | Recipe tham chiếu thẳng token palette. Bản thân điều này không phải là phát hiện<br>*Recipes reference palette tokens directly. Not a finding by itself* |
| Rò rỉ tầng · Tier leakage | 0 | Không token nào tham chiếu sang tầng khác. Khi chỉ có một tầng, kiểm tra này không thể trượt<br>*No token references another tier. With one tier, this check cannot fail* |

Text style (`textStyles.ts`) là thứ gần nhất với một tầng semantic mà Magenta có: các composite mang tên vai trò (`h1`, `body`) tham chiếu tới primitive. Xem TA-09.
*Text styles are the closest thing Magenta has to a semantic layer: role-named composites that alias primitives. See TA-09.*

## Kết quả kiểm tra · Check results

| Kiểm tra · Check | Kết quả · Result | Ghi chú · Note |
|---|---|---|
| File sinh ra khớp nguồn · Generated output matches source | ✅ PASS | `build-tokens.mjs --check` trả về 0 · *exit 0* |
| Đặt tên semantic theo mục đích · Descriptive semantic naming | ⚠️ WARN | Không có tầng semantic; tên vai trò nằm trong tầng primitive (TA-02, TA-03)<br>*No semantic tier; role names sit in the primitive tier* |
| Rò rỉ tầng / tham chiếu ngược · Tier leakage / upward references | ✅ PASS | Không thể xảy ra khi chỉ có một tầng · *None possible with one tier* |
| Tên mơ hồ · Ambiguity flags | ✅ PASS | Mọi tên là vai trò (`zIndex.dialog`) hoặc bậc thang (`radii.lg`, `letterSpacings.narrow`)<br>*Every name is a role or a scale step* |
| Nhất quán quy ước · Convention consistency | ⚠️ WARN | Cách viết hoa nhất quán; đơn vị và cặp tên cỡ thì không (TA-06, TA-07)<br>*Casing consistent; units and t-shirt pairings are not* |
| Hậu tố nền tảng · Platform suffixes | ✅ PASS | Không có · *None* |
| Giá trị thô trên tầng primitive · Raw values above primitive tier | ✅ PASS | Text style tham chiếu cả 5 giá trị con · *Text styles alias all 5 sub-values each* |
| Giá trị thô trùng lặp · Duplicate raw values | ⚠️ WARN | Không trùng hex, nhưng `neutral.900` bị chép vào 7 token (TA-04); ba token 1px và hai thang kích thước chồng nhau (TA-05)<br>*No duplicate hexes, but `neutral.900` is copied into 7 tokens; three 1px tokens and two overlapping size scales* |
| Token trạng thái tương tác · Interaction-state coverage | ❌ FAIL | Không có token trạng thái; trạng thái nằm trong condition của recipe (thuộc TA-01)<br>*No state tokens; states live in recipe conditions* |
| Alias theo theme · Theme aliases | n/a | Một theme; snapshot không có condition `_dark` hay resolver<br>*Single theme; no `_dark` condition or resolver* |
| Độ phủ nhóm token · Category coverage | ⚠️ WARN | Không có `durations`, `easings`, `opacity` (TA-08) |

## Phát hiện · Findings

### TA-01 🟠 High · Độ phủ · Coverage · Không có tầng semantic · No semantic tier

Code không có token nào mang ý định sử dụng, nên vai trò chỉ được đảm bảo bằng tài liệu và bộ kiểm tra, không phải bằng bản build.
*The code has no tokens that carry intent, so roles are enforced by docs and checks, not by the build.*

- **Bằng chứng · Evidence:** `.source/magenta/packages/css/src/preset.ts:291` (chỉ có `tokens` · *`tokens` only*). Recipe dùng đường dẫn palette, ví dụ · *Recipes use palette paths, e.g.* `css/src/recipes/Tabs/tabListGroup.ts:126` `{colors.purple.600}`, `css/src/recipes/link/utils.ts:21` `` `${colorName}.500` ``. Vai trò nằm trong `foundations/color.md` và được chép lên primitive dưới dạng `$extensions.mds.roles` (ví dụ `colors.neutral.900` → "Default body text").
  *Roles live in `foundations/color.md` and are copied onto primitives as `$extensions.mds.roles`.*
- **Hành động · Action:** Triển khai Proposal B trong ADR 001 với các tên trong [ADR 002](../../adr/002-semantic-color-token-naming.md) (trạng thái: *proposed*). Bắt đầu với các vai trò toàn cục cho text, background và border. Các dòng của chúng đã có trong `foundations/color.md`, nên đợt đầu được sinh tự động chứ không phải chọn tay. Chỉ thêm token trạng thái (`hover`, `active`, `disabled`, `focus-visible`) ở những chỗ recipe đã thay đổi theo trạng thái.
  *Ship Proposal B from ADR 001 using the names in ADR 002 (status: proposed). Start with the global text, background and border roles; their rows already exist in `foundations/color.md`, so the first batch is generated, not chosen. Add state tokens only where a recipe already varies by state.*
- **Đã quyết định · Already decided:** ADR 001 đã chấp nhận lỗ hổng này tạm thời. Mức xếp hạng phản ánh chi phí về sau, không phải bất đồng với ADR.
  *ADR 001 accepted the gap for now. The rating reflects its downstream cost, not a disagreement with that ADR.*

### TA-02 🟡 Medium · Đặt tên · Naming · `colors.background-overlay.50` là vai trò đội lốt mức palette · a role posing as a palette level

- **Bằng chứng · Evidence:** `.source/magenta/packages/css/src/tokens.ts:8-10`, giá trị · *value* `#33333380`. `foundations/color.md:81` ghi đây là `neutral.900` với độ mờ 50% · *says it is `neutral.900` at 50% opacity.*
- **Vấn đề · Problem:** Đây là màu duy nhất được đặt theo vai trò thay vì sắc màu. Số `50` trông như một mức palette (100–1000) nhưng thực ra là độ trong suốt. Agent đọc `background-overlay.50` sẽ tưởng có `.100`, `.200`, v.v.
  *This is the only colour named by role, not hue. Its `50` looks like a palette level but means alpha. An agent will expect `.100`, `.200` and so on to exist.*
- **Hành động · Action:** Khi có tầng semantic, biến overlay thành token semantic tham chiếu `colors.neutral.900`. Một tên đề xuất theo mẫu ADR 002 là `colors.background.overlay`. Trước đó, giữ tên hiện tại và thêm vào `$description` rằng `50` là độ mờ.
  *When the semantic tier lands, make the overlay a semantic token that references `colors.neutral.900`, for example `colors.background.overlay` (proposed). Until then, keep the name and note in its `$description` that `50` is opacity.*

### TA-03 ⚪ Low · Đặt tên · Naming · `primary` và `secondary` là tên vai trò của palette · role names for palettes

- **Bằng chứng · Evidence:** `tokens.ts:66` (`primary`, `#BD0F72` ở mức 500 · *at 500*) và · *and* `tokens.ts:117` (`secondary`). Bên cạnh là các palette theo sắc màu · *Beside them are hue palettes*: `blue`, `green`, `royal`…
- **Vấn đề · Problem:** Đây là cách làm phổ biến và có lẽ là chủ ý. Cái giá đến sau: khi có token semantic, cả `colors.primary.500` lẫn một vai trò semantic về "primary" đều được đọc như ý định. Đổi thương hiệu cũng phải sửa trực tiếp primitive.
  *Common practice and probably deliberate. The cost comes later: once semantic tokens exist, both will read as intent, and a rebrand edits primitives in place.*
- **Hành động · Action:** Giữ nguyên lúc này. Nếu xây tầng semantic, cân nhắc đặt tên theo sắc màu cho hai palette này để "primary" chỉ còn là vai trò. Nếu cách đặt tên này đã chốt, hãy báo để các lần chạy sau bỏ qua.
  *Leave as is for now. If the semantic tier is built, consider hue names for these two palettes. Tell me if this naming is settled, and future runs will skip it.*

### TA-04 🟡 Medium · Giá trị · Value · `neutral.900` và `neutral.1000` bị chép thành giá trị thô · copied as raw values

- **Bằng chứng · Evidence:** `tokens.ts:188-205`: cả sáu shadow (trừ `none`) dùng `rgba(51, 51, 51, …)`, tức `neutral.900` (`tokens.ts:49`, `#333333`). `shadows.inner` (`:192`) còn dùng `rgba(44, 45, 46, …)`, tức `neutral.1000` (`:50`). `background-overlay.50` (`:9`) lại là cùng màu xám đó. JSON sinh ra giữ chúng dưới dạng object màu thô (`shadows.md.$value[0].color.hex = "#333333"`).
  *All six non-`none` shadows use `neutral.900` as raw rgba; `shadows.inner` also uses `neutral.1000`; the overlay is the same grey. The generated JSON reproduces them as raw colour objects.*
- **Vấn đề · Problem:** Nếu đổi màu shadow hay overlay, `neutral.900` sẽ không đổi theo. Đầu ra DTCG cũng không thể hiện mối liên hệ này.
  *If the shadow colour or overlay changes, `neutral.900` won't follow, and the DTCG output doesn't show the link.*
- **Hành động (đề xuất) · Action (proposed):** Tham chiếu token palette trong giá trị shadow và overlay, nếu phiên bản Panda trong repo hỗ trợ tham chiếu kèm độ mờ (cần kiểm tra với Panda 0.25). Nếu không, cho `build-tokens.mjs` ghi lại nguồn gốc trong `$extensions.mds`, để khi `neutral.900` đổi thì 8 token này được đánh dấu.
  *Reference the palette token if Panda 0.25 resolves a reference with opacity (needs checking). If not, have `build-tokens.mjs` record the derivation in `$extensions.mds`, so a change to `neutral.900` flags these 8 tokens.*

### TA-05 🟡 Medium · Giá trị · Value · Thang `spacing` và `sizes` lệch nhau; ba token 1px · scales have drifted apart; three 1px tokens

- **Bằng chứng · Evidence:** `sizes` ở `tokens.ts:209-227`, `spacing` ở `:229-247`. `sizes` có 36 (10 tham chiếu trong 4 file) nhưng không có 18; `spacing` có 18 (`css/src/recipes/TreeView/treeViewItem.ts:150`) nhưng không có 36. Giá trị 1px xuất hiện ba lần: `borders.1` (`:3`), `sizes.1` (`:211`), `spacing.1` (`:231`). Recipe dùng `spacing.1` làm độ dày viền: `Tabs/tabHeader.ts:27`, `DatePicker/dateTimePicker.ts:8`, `TimePicker/timeCylinder.ts:49`.
  *`sizes` has 36 (10 refs, 4 files) but no 18; `spacing` has 18 but no 36. 1px appears three times. Recipes use `spacing.1` as a border width.*
- **Vấn đề · Problem:** Panda cần các nhóm riêng nên việc có hai thang là do cấu trúc; nhưng việc các bậc lệch nhau thì không. Không có gì nói `spacing.18` và `sizes.36` là cố ý. Dùng token spacing cho viền khiến quyết định "viền 1px" nằm ở hai nơi.
  *Two scales are structural in Panda; the step drift isn't, and nothing says it's intentional. A spacing token as a border puts the "1px border" decision in two places.*
- **Hành động · Action:** Đề nghị Magenta đổi các viền dùng `spacing.1` sang `borders.1` (phía code sử dụng, 6 tham chiếu). Quyết định xem 18 và 36 nên có ở cả hai thang hay không thang nào. Vault đã cấm `spacing.1` và `spacing.18` (`foundations/spacing.md:56`), nên agent hiện đã được bảo vệ.
  *Ask Magenta to swap the `spacing.1` border widths for `borders.1` (6 references). Decide whether 18 and 36 belong in both scales or neither. The vault already forbids `spacing.1` and `spacing.18`, so agents are protected now.*

### TA-06 ⚪ Low · Đặt tên · Naming · `fontSizes` và `lineHeights` dùng chung tên cỡ nhưng không khớp cặp · share t-shirt names that don't pair

- **Bằng chứng · Evidence:** `fontSizes.lg` = 17px (`tokens.ts:141`), `lineHeights.lg` = 20px (`:172`). `h1` ghép `fontSize: '5xl'` với `lineHeight: '6xl'` (`textStyles.ts:5-6`). `lineHeights` không có `xs`/`2xs` nhưng có `8xl`.
- **Vấn đề · Problem:** Ai ghép tên giống nhau (`lg` + `lg`) sẽ được một cặp mà không text style nào dùng.
  *Anyone who writes matching names gets a pairing no text style uses.*
- **Hành động · Action:** Cách rẻ: tiếp tục hướng mọi người chỉ dùng `textStyles` (ghi chú typography nên nói rõ nếu chưa có). Cách cấu trúc: đặt tên line height theo giá trị px như `spacing` (`lineHeights.20`).
  *Cheap fix: keep directing people to `textStyles` only, stated in the typography note if not already. Structural fix: name line heights by pixel value, as `spacing` does.*

### TA-07 ⚪ Low · Đặt tên · Naming · Đơn vị lẫn lộn trong và giữa các thang · Mixed units within and across scales

- **Bằng chứng · Evidence:** `spacing` và `sizes` từ 0–6 dùng px, từ 8 trở lên dùng rem (`tokens.ts:230-246`). `radii`, `borders`, `letterSpacings` dùng px; `fontSizes`, `lineHeights` dùng rem.
- **Vấn đề · Problem:** Điều này đã được ghi lại (`foundations/spacing.md:113`) và có vẻ cố ý. Tác dụng phụ: khoảng cách chữ giữ cố định trong khi cỡ chữ co giãn theo cài đặt cỡ chữ của người dùng.
  *Documented and looks deliberate. Side effect: letter spacing stays fixed while font size scales with the user's font setting.*
- **Hành động · Action:** Xác nhận đây là chủ ý. Nếu đúng, đánh dấu đã chấp nhận và các lần chạy sau sẽ bỏ qua.
  *Confirm it is intended; if so, mark it accepted and future runs will skip it.*

### TA-08 🟡 Medium · Độ phủ · Coverage · Không có token chuyển động và độ mờ · No motion or opacity tokens

- **Bằng chứng · Evidence:** `preset.ts:294` định nghĩa `keyframes` nhưng không có nhóm `durations` hay `easings`. [token-audit-2026-11-04.md](token-audit-2026-11-04.md) tìm thấy 31 duration thô trong 24 file. Độ mờ chỉ tồn tại bên trong `background-overlay.50`.
  *`keyframes` exist but no `durations` or `easings`. The 11-04 report found 31 raw durations in 24 files. Opacity exists only inside `background-overlay.50`.*
- **Hành động · Action:** Đề xuất `durations` và `easings` cho Magenta, dựa trên các giá trị recipe đang dùng; kiểm kê 31 giá trị đó trước. Vault chưa có ghi chú foundation về chuyển động, nên danh sách vai trò sẽ bắt đầu từ đó.
  *Propose `durations` and `easings` built from the values recipes already use; inventory the 31 first. There is no motion foundation note yet, so the role list starts there.*

### TA-09 ⚪ Low · Đặt tên · Naming · Text style bị gắn `tier: primitive` · Text styles are tagged `tier: primitive`

- **Bằng chứng · Evidence:** `scripts/build-tokens.mjs:268` gán `tier: 'primitive'` cho cả 51 mục `textStyles.*`. Thực chất chúng là composite mang tên vai trò, tham chiếu tới primitive.
  *Sets `tier: 'primitive'` on all 51 entries, though they are role-named composites that alias primitives.*
- **Hành động · Action:** Gắn `semantic`, hoặc `composite` nếu muốn để "semantic" dành cho vai trò màu. Agent đọc trường này, và giá trị hiện tại khiến chúng hiểu text style là giá trị thô.
  *Tag them `semantic`, or `composite` to keep "semantic" for colour roles. Agents read this field, and the current value tells them text styles are raw values.*

### TA-10 ⚪ Low · Độ phủ · Coverage · Token có thể không dùng · Orphan candidates

- **Đã xác nhận (không có tham chiếu trong repo) · Confirmed (no in-repo reference):** `zIndex.base` (`tokens.ts:251`), `zIndex.navigation-overlay` (`:259`), `shadows.inner` (`:190`). Hai token sau đã bị `forbidden`. `zIndex.base` thì chưa, và báo cáo tuân thủ 11-04 cho thấy 3 recipe dùng z-index thô `0` ở chỗ token này phù hợp.
  *The last two are already `forbidden`. `zIndex.base` is not, and 3 recipes use a raw `0` where it fits.*
- **Chưa xác nhận · Unconfirmed:** 45/94 màu không có tham chiếu dạng chữ. Recipe dựng tên màu từ template (`css/src/recipes/Tabs/utils.ts:36`, `Indicator/utils.ts:37,45`, `link/utils.ts:21-33`), nên tìm kiếm dạng chữ đếm thiếu. Đừng coi chúng là không dùng.
  *45 of 94 colours have no literal reference, but recipes build colour names from templates, so a literal search under-counts. Don't treat them as unused.*
- **Hành động · Action:** Đổi 3 giá trị `0` thô sang `zIndex.base`. Để nguyên các màu cho đến khi có chỉ mục hiểu được template (`codebase-index`).
  *Point the 3 raw `0`s at `zIndex.base`. Leave the colours until a template-aware index exists.*

### TA-11 ⚪ Low · Tài liệu · Docs · Các ADR mâu thuẫn về `semantic.tokens.json` · ADRs disagree about `semantic.tokens.json`

- **Bằng chứng · Evidence:** `adr/001-color-roles-on-palette-tokens.md:25,68` nói file này "để trống" · *says the file "stays empty"*. `adr/003-code-led-token-pipeline.md:33` nói không có file semantic · *says there is no semantic file*. Thư mục `tokens/` chỉ có hai file primitive · *`tokens/` contains only the two primitive files.*
- **Hành động · Action:** Sửa ADR 001 cho khớp ADR 003, hoặc thêm một dòng vào ADR 003 nói rằng nó thay thế điểm này.
  *Edit ADR 001 to match ADR 003, or add a line to ADR 003 saying it supersedes that point.*

## Thứ tự khắc phục · Remediation priority

1. **Sửa trước · Fix first:** TA-01. Đây là lỗ hổng cấu trúc; TA-02, TA-03 và lỗi thiếu token trạng thái được giải quyết cùng lúc.
   *The structural gap; TA-02, TA-03 and the state-coverage failure are resolved as part of it.*
2. **Sửa tiếp · Fix next:** TA-04, TA-05, TA-08, TA-09. Các thay đổi nhỏ phía token, ngăn nợ kỹ thuật tích tụ.
   *Small token-side changes that stop debt compounding.*
3. **Xử lý dần · Address eventually:** TA-06, TA-07, TA-10, TA-11.

## Ước tính công sức · Effort estimates

Các dòng TA-01, TA-04, TA-05 chỉ tính thay đổi phía token; việc chuyển đổi recipe và sản phẩm là phần thêm. Hệ thống có 242 mục token, nên hãy làm một spike giới hạn 1–2 ngày cho TA-01 trước khi đưa vào sprint.
*The rows for TA-01, TA-04 and TA-05 cover the token-side change only; migrating recipes and products is extra. With 242 token entries, do a timeboxed 1–2 day spike on TA-01 before sprint planning.*

| Phát hiện · Finding | Công sức · Effort | Giả định · Assumptions | Độ tin cậy · Confidence |
|---|---|---|---|
| TA-01 | 3–6 ngày · *days* (đợt đầu vai trò màu toàn cục trong `preset.ts`, cập nhật generator và vault · *first batch of global colour roles, generator and vault update*) | Tên ADR 002 được duyệt; Magenta chấp nhận Proposal B; recipe chuyển đổi sau<br>*ADR 002 names approved; Magenta accepts Proposal B; recipes migrate later* | Thấp · Low: phụ thuộc thỏa thuận upstream và việc duyệt danh sách vai trò<br>*depends on upstream agreement and role-list review* |
| TA-02 | 1–2 giờ · *h* (mô tả ngay); gộp vào TA-01 sau<br>*description now; folded into TA-01 later* | Đổi tên cùng lúc với tầng semantic<br>*Rename happens with the semantic tier* | Cao · High |
| TA-03 | 0 lúc này; 0.5–1 ngày nếu đổi tên palette<br>*0 now; 0.5–1 day if palettes are renamed* | Chỉ đổi tên cùng TA-01 · *Rename only alongside TA-01* | Trung bình · Medium |
| TA-04 | 2–4 giờ · *h* | Panda 0.25 hỗ trợ cú pháp tham chiếu, hoặc generator ghi nguồn gốc<br>*Panda 0.25 supports the reference syntax, or the generator records the derivation* | Trung bình · Medium: chưa kiểm tra Panda · *Panda support unverified* |
| TA-05 | 2–4 giờ phía token + 1–2 giờ cho 6 chỗ sửa recipe<br>*2–4 h token side + 1–2 h for 6 recipe swaps* | Nhóm quyết định 18/36 trong một buổi · *Team decides on 18/36 in one discussion* | Cao · High |
| TA-06 | 0.5 giờ (một dòng tài liệu) hoặc 4–8 giờ (đổi tên + text style)<br>*0.5 h (doc line) or 4–8 h (rename + text styles)* | Đổi tên sẽ phá vỡ code dùng trực tiếp `lineHeight`<br>*Rename would break direct `lineHeight` users* | Trung bình · Medium |
| TA-07 | 0.5 giờ · *h* | Chỉ cần xác nhận · *Confirmation only* | Cao · High |
| TA-08 | 1–2 ngày · *days* | Gồm kiểm kê 31 duration thô và thiết kế duyệt thang<br>*Includes inventory of 31 raw durations and design sign-off on a scale* | Thấp · Low: chưa thiết kế thang · *scale not yet designed* |
| TA-09 | 0.5–1 giờ · *h* | Sửa `build-tokens.mjs` + build lại · *Change in `build-tokens.mjs` + rebuild* | Cao · High |
| TA-10 | 1 giờ · *h* | 3 chỗ sửa recipe upstream · *3 recipe edits upstream* | Cao · High |
| TA-11 | 15–30 phút · *min* | Sửa tài liệu · *Doc edit* | Cao · High |

## Mức độ tương thích DTCG 2025.10 · DTCG 2025.10 alignment

**Nguồn** là TypeScript của Panda với giá trị dạng chuỗi (`'#333333'`, `'1rem'`). Các file **sinh ra** đã dùng cấu trúc 2025.10: 94 object màu, 75 object kích thước, `fontWeight` và `zIndex` dạng số, và composite `typography` tham chiếu mọi giá trị con. Vì vậy phương án C của [ADR 003](../../adr/003-code-led-token-pipeline.md) (DTCG làm nguồn) không đòi hỏi đổi định dạng ở phía agent.
*The **source** is Panda TypeScript with string values. The **generated** files already use 2025.10 shapes: 94 colour objects, 75 dimension objects, numeric `fontWeight` and `zIndex`, and `typography` composites that alias every sub-value. So ADR 003 option C needs no reformatting from agents' side.*

- Composite duy nhất có giá trị con thô là `shadow` (TA-04). Nó nằm ở tầng primitive và hệ thống chỉ có một theme, nên giữ mức 🟡 Medium.
  *The only composite with raw sub-values is `shadow`. It sits at the primitive tier in a single-theme system, so it stays Medium.*
- Không có file resolver và cũng không cần cho một theme. Xem lại nếu TA-01 thêm condition `_dark`.
  *No resolver files, and none needed for one theme. Revisit if TA-01 adds a `_dark` condition.*
- Chưa chạy `schema-validator`. Hãy chạy để xác nhận tự động việc phân giải alias và cấu trúc giá trị.
  *`schema-validator` was not run. Run it to confirm alias resolution and value shapes mechanically.*

## Bản đồ phụ thuộc · Dependency map

Chưa dựng: thư mục `.ai/index/` không tồn tại. Chạy `codebase-index` trước để biết token nào được nhiều component dùng và có cái nhìn hiểu template về cách dùng màu (xem TA-10).
*Not built: `.ai/index/` does not exist. Run `codebase-index` first for high-fan-out tokens and a template-aware view of colour usage.*

## Phạm vi · Scope

- **Đã kiểm tra · Inspected:** `.source/magenta/packages/css/src/{tokens.ts, preset.ts, breakpoints.ts, recipes/Text/textStyles.ts}`; `tokens/*.tokens.json`; `scripts/build-tokens.mjs` (logic tier và forbidden · *tier and forbidden logic*); `adr/001–003`; `foundations/{color,spacing,border,elevation}.md` (các phần liên quan · *relevant sections*); `reports/archive/token-audit-2026-11-04.md` (phần đầu · *header*).
- **Chưa kiểm tra · Not inspected:** repo sản phẩm sử dụng Magenta · *consuming product repos*; biến Figma · *Figma variables* (xem · *see* [figma-sync-2026-11-04.md](figma-sync-2026-11-04.md)); `packages/docs`; `.prototype/`.
- **Cách kiểm chứng "không tìm thấy" · How "none found" was checked:** Tìm token không dùng trên 1.687 file `.ts`/`.tsx`/`.css` trong `.source/magenta/packages/*/src`, bỏ qua docs, test và stories. Đối chứng dương: `colors.neutral.900` tìm thấy 30 lần trong 26 file, `colors.primary.500` 41 lần trong 15 file. Tìm hex trùng chạy trên mọi mã hex 6 và 8 chữ số trong `tokens.ts` và cho kết quả 0; cùng mẫu đó khớp cả 93 định nghĩa màu hex (`transparent` là màu thứ 94 và không có hex).
  *The orphan search covered 1,687 files, excluding docs, tests and stories. Positive control: `colors.neutral.900` found 30 times in 26 files, `colors.primary.500` 41 times in 15 files. The duplicate-hex search returned 0; the same pattern matches all 93 hex colour definitions (`transparent` is the 94th and has no hex).*
- **Giả định · Assumptions:** Snapshot `5842dc1` phản ánh đúng những gì sản phẩm cài đặt. Chỉ một theme, vì `preset.ts` không có condition `_dark` hay selector theme.
  *The snapshot reflects what products install. Single theme, because `preset.ts` has no `_dark` condition or theme selector.*

> **Lưu ý về bối cảnh:** Bản kiểm tra này nhìn thấy các file token, nhưng không nhìn thấy những quyết định đằng sau chúng. Một số phát hiện có thể chỉ ra những cách làm mà nhóm đã cố ý chọn. Nếu phát hiện nào mô tả một quyết định có chủ đích, hãy cho tôi biết — tôi sẽ loại nó khỏi các lần chạy sau và học theo quy ước của hệ thống. Mục tiêu là tìm ra những vấn đề bạn chưa thấy, không phải phán xét lại những lựa chọn đã đưa ra.
>
> ***A note on context:** This audit sees your token files — it does not see the decisions behind them. Some findings may flag patterns your team chose deliberately. If any finding describes an intentional decision, let me know — I'll exclude it from future runs and learn your system's conventions. The goal is to surface problems you haven't seen yet, not to second-guess choices you've already made.*
