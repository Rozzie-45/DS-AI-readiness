---
type: report
date: 2026-11-04
---

# Token audit 2026-11-04

Target: Magenta snapshot `5842dc1` (`css/src`, `react/src`, `react-dates/src`, `react-data-grid/src`, `react-text-editor/src`, `react-templates/src`, `magenta/src`). Written by `checks/token-audit.mjs`.

## Summary

**1,110 files scanned. 388 errors, 111 warnings.** Errors fail the check; warnings do not.

| How to fix (errors / warnings) | Library packages | `react-templates` | Total |
|---|---|---|---|
| Swap for the token with the same value | 77 / 17 | 234 / 11 | 311 / 28 |
| Use the closest token (the look changes slightly) | 4 / 1 | 12 / 20 | 16 / 21 |
| Needs a decision (no token fits) | 24 / 52 | 37 / 10 | 61 / 62 |

The library packages are the ones products install. `react-templates` is a private package of page layouts and patterns; it is not published.

Largest groups:

- `1px`, `1` → `borders.1`: 47 errors in 32 files
- `24px`, `-24px`, `24` +1 more → `spacing.24`: 45 errors in 15 files
- Raw duration (Magenta has no motion tokens yet): 31 warnings in 24 files
- `16px`, `1rem` → `spacing.16`: 31 errors in 12 files
- `white` → `colors.white`: 26 errors in 11 files
- `1` → `zIndex.above`: 24 warnings in 17 files
- Custom shadow (check foundations/elevation.md; use token(borders.*) for ring widths): 23 warnings in 2 files
- `-4px`, `4px`, `0.25rem` → `spacing.4`: 22 errors in 9 files

## Library packages

### Swap for the token with the same value

| Found | Token | Write | Places | Examples |
|---|---|---|---|---|
| `1px`, `1` | `borders.1`: Standard border: input fields, outline buttons, dividers, containers | `token(borders.1)` | 42 errors in 27 files | `css/src/recipes/Accordion/accordion.ts:25`, `css/src/recipes/Accordion/accordionItem.ts:12`, `css/src/recipes/Avatar/avatar.ts:12` +39 more |
| `1` | `zIndex.above`: Stacking inside a component | — | 13 warnings in 11 files | `css/src/recipes/DatePicker/dateRangeInput.ts:32`, `css/src/recipes/TreeView/treeViewItem.ts:29`, `css/src/recipes/TreeView/treeViewItem.ts:38` +10 more |
| `2px` | `borders.2` | `token(borders.2)` | 13 errors in 4 files | `css/src/recipes/Dialog/dialogHeader.ts:18`, `css/src/recipes/Segmented/Item.ts:15`, `css/src/recipes/Segmented/Item.ts:16` +10 more |
| `-4px`, `4px` | `spacing.4` | `'-4'`, `'4'` | 7 errors in 4 files | `css/src/recipes/Avatar/avatarGroup.ts:24`, `css/src/recipes/Avatar/avatarGroup.ts:66`, `css/src/recipes/Timeline/timeline.ts:29` +4 more |
| `-6px`, `6px` | `spacing.6` | `'-6'`, `'6'` | 4 errors in 2 files | `css/src/recipes/Avatar/avatarGroup.ts:29`, `css/src/recipes/Avatar/avatarGroup.ts:80`, `css/src/recipes/toggle.ts:230` +1 more |
| `-8px`, `8px` | `spacing.8` | `'-8'`, `'8'` | 4 errors in 2 files | `css/src/recipes/Avatar/avatarGroup.ts:35`, `css/src/recipes/Avatar/avatarGroup.ts:94`, `css/src/recipes/toggle.ts:199` +1 more |
| `0` | `zIndex.base`: Stacking inside a component | — | 3 warnings in 3 files | `css/src/recipes/buttonGroup.ts:29`, `css/src/recipes/compactWrapper.ts:34`, `css/src/recipes/radio.ts:44` |
| `4` | `radii.md`: Medium components: buttons, input fields, select fields, text areas, tags, pagination items, accordion items | `'md'` | 3 errors in 1 file | `css/src/utilities.ts:12`, `css/src/utilities.ts:17`, `css/src/utilities.ts:21` |
| `-1` | `zIndex.below`: Stacking inside a component | — | 1 warning in 1 file | `css/src/recipes/InlineEdit/InlineView.ts:9` |
| `rgba(51, 51, 51, 0.00)` | `colors.transparent`: Transparent background | `'transparent'` | 1 error in 1 file | `css/src/recipes/Table/tableCell.ts:155` |
| `2px` | `spacing.2` | `'2'` | 1 error in 1 file | `css/src/recipes/TextEditor/attachment.ts:76` |
| `2rem` | `spacing.32`: Space between content on the page (top of page and header), page margins and the gap between sections | `'32'` | 1 error in 1 file | `css/src/recipes/TextEditor/editor.ts:47` |
| `-12px` | `spacing.12` | `'-12'` | 1 error in 1 file | `css/src/recipes/TextEditor/linkForm.ts:25` |

### Use the closest token (the look changes slightly)

| Found | Closest token | Write | Places | Examples |
|---|---|---|---|---|
| `rgba(51, 51, 51, 0.15)`, `rgba(51,51,51,0.15)` | `colors.background-overlay.50`: Overlay behind dialogs, drawers and lightboxes ("filter background") | `'background-overlay.50'` | 3 errors in 2 files | `css/src/recipes/Table/tableCell.ts:137`, `css/src/recipes/Tabs/tabList.ts:113`, `css/src/recipes/Tabs/tabList.ts:125` |
| `#B3E3E150` | `colors.secondary.200`: Outline and ghost button background, pressed | `'secondary.200'` | 1 error in 1 file | `css/src/recipes/TextEditor/fileDragOverlay.ts:16` |
| `12px` | `fontSizes.sm` | — | 1 warning in 1 file | `css/src/recipes/checkbox.ts:74` |

### Needs a decision (no token fits)

| Category | Problem | Found | Suggestion | Places | Examples |
|---|---|---|---|---|---|
| shadow | Custom shadow | `inset 0 -2px 0 0 {colors.primary.300}`, `inset -2px 0 0 0 {colors.primary.300}`, `inset 0 0 0 1px token(colors.neutral.300)`, `inset 0 0 0 1px token(colors.primary.400)`, `inset 0 0 0 1px token(colors.primary.500)` +5 more | check foundations/elevation.md; use token(borders.*) for ring widths | 23 warnings in 2 files | `css/src/recipes/Stepper/step.ts:83`, `css/src/recipes/Stepper/step.ts:106`, `css/src/recipes/numberInput.ts:36` +20 more |
| motion | Raw duration | `200ms`, `2s`, `0.2s`, `400ms`, `0.3s` +4 more | Magenta has no motion tokens yet | 22 warnings in 19 files | `css/src/recipes/Accordion/accordionItem.ts:28`, `css/src/recipes/Accordion/accordionItem.ts:39`, `css/src/recipes/Calendar/date.ts:19` +19 more |
| zIndex | Raw z-index has no token | `10`, `2`, `3`, `11`, `-10` +1 more | use the zIndex token for the kind of layer (foundations/z-index.md) | 16 errors in 9 files | `css/src/recipes/Select/select.ts:56`, `css/src/recipes/buttonGroup.ts:17`, `css/src/recipes/buttonGroup.ts:21` +13 more |
| spacing | Hardcoded spacing | `-1px`, `1px` | no usable token: spacing.1 has this value but no role (foundations/spacing.md) | 5 errors in 4 files | `css/src/recipes/buttonGroup.ts:11`, `css/src/recipes/compactWrapper.ts:16`, `css/src/recipes/numberInput.ts:391` +2 more |
| lineHeight | Unitless line height | `0` | use a text style (foundations/typography.md) | 3 warnings in 3 files | `css/src/recipes/radio.ts:124`, `css/src/recipes/spinner.ts:14`, `react/src/components/Select/Select.tsx:810` |
| shadow | Hardcoded shadow | `inset 0 0 0 token(borders.1) token(colors.neutral.300), 0px `, `inset 0 0 0 token(borders.1) token(colors.green.300), 0px 0p`, `0px 0px 6px 0px rgba(44, 45, 46, 0.10) inset, 0px 0px 2px 1p` | use a shadows token by elevation level (foundations/elevation.md) | 3 errors in 1 file | `css/src/recipes/toggle.ts:77`, `css/src/recipes/toggle.ts:83`, `css/src/recipes/toggle.ts:96` |
| borderWidth | Border width has no token | `1.5px` | use borders.1 or borders.2 (foundations/border.md) | 2 warnings in 1 file | `css/src/recipes/checkbox.ts:244` |
| spacing | Unusual spacing value | `[-1px]`, `[1px]` | see foundations/spacing.md | 2 warnings in 1 file | `react/src/components/TagsInput/TagsInput.tsx:1071` |

## `react-templates`

### Swap for the token with the same value

| Found | Token | Write | Places | Examples |
|---|---|---|---|---|
| `24px`, `-24px`, `24`, `1.5rem` | `spacing.24` | `'24'`, `var(--mag-spacing-24)`, `'-24'`, `calc(-1 * var(--mag-spacing-24))` | 45 errors in 15 files | `react-templates/src/components/Layouts/Navigator.tsx:27`, `react-templates/src/components/Layouts/styles/header.css:17`, `react-templates/src/components/Layouts/styles/header.css:51` +42 more |
| `16px`, `1rem` | `spacing.16` | `'16'`, `var(--mag-spacing-16)` | 31 errors in 12 files | `react-templates/src/components/Layouts/Header.tsx:80`, `react-templates/src/components/Layouts/Header.tsx:84`, `react-templates/src/components/Layouts/styles/header.css:32` +27 more |
| `white` | `colors.white` | `var(--mag-colors-white)` | 26 errors in 11 files | `react-templates/src/components/Layouts/styles/responsive-header.css:3`, `react-templates/src/components/commons/Panel/styles.css:6`, `react-templates/src/patterns/EditableDataTable/styles.css:39` +23 more |
| `600` | `fontWeights.semi-bold` | `var(--mag-font-weights-semi-bold)`, `'semi-bold'` | 18 errors in 16 files | `react-templates/src/components/Layouts/styles/header.css:56`, `react-templates/src/patterns/DownloadAndUpload/DownloadAllData.tsx:42`, `react-templates/src/patterns/DownloadAndUpload/DownloadModal.tsx:53` +15 more |
| `0.25rem`, `4px` | `spacing.4` | `var(--mag-spacing-4)`, `'4'` | 15 errors in 5 files | `react-templates/src/components/Form/FileUpload/styles.css:46`, `react-templates/src/patterns/EditableDataTable/EditableTable.tsx:694`, `react-templates/src/patterns/EditableDataTable/styles.css:59` +12 more |
| `-10px`, `10px`, `0.625rem` | `spacing.10` | `'-10'`, `var(--mag-spacing-10)`, `'10'` | 14 errors in 7 files | `react-templates/src/components/Layouts/HeaderTitles/HeaderTitle.tsx:85`, `react-templates/src/components/Layouts/styles/header.css:17`, `react-templates/src/patterns/EditableDataTable/BasicTable.tsx:90` +10 more |
| `8px`, `0.5rem` | `spacing.8` | `'8'`, `var(--mag-spacing-8)` | 14 errors in 4 files | `react-templates/src/patterns/DownloadAndUpload/UploadAndDownloadData.tsx:39`, `react-templates/src/patterns/DownloadAndUpload/UploadModal.tsx:46`, `react-templates/src/patterns/EditableDataTable/styles.css:51` +11 more |
| `-12px`, `12px`, `0.75rem` | `spacing.12` | `'-12'`, `'12'`, `var(--mag-spacing-12)` | 11 errors in 5 files | `react-templates/src/components/Layouts/HeaderTitles/HeaderTitle.tsx:85`, `react-templates/src/components/Layouts/Navigator.tsx:27`, `react-templates/src/patterns/DownloadAndUpload/DownloadModal.tsx:55` +8 more |
| `1` | `zIndex.above`: Stacking inside a component | — | 11 warnings in 6 files | `react-templates/src/patterns/EditableDataTable/BasicTable.tsx:165`, `react-templates/src/patterns/ListAndDetail/styles.css:84`, `react-templates/src/patterns/ListAndDetail/styles.css:87` +8 more |
| `48px` | `spacing.48`: Space between content on the page (top of page and header), page margins and the gap between sections | `'48'` | 9 errors in 8 files | `react-templates/src/patterns/EditableDataTable/BasicTable.tsx:262`, `react-templates/src/patterns/EditableDataTable/EditableTable.tsx:1317`, `react-templates/src/patterns/ListAndDetail/ListAndDetail.tsx:32` +6 more |
| `2rem` | `spacing.32`: Space between content on the page (top of page and header), page margins and the gap between sections | `var(--mag-spacing-32)` | 9 errors in 1 file | `react-templates/src/styles/index.css:270`, `react-templates/src/styles/index.css:294`, `react-templates/src/styles/index.css:318` +6 more |
| `0.125rem` | `spacing.2` | `var(--mag-spacing-2)` | 6 errors in 1 file | `react-templates/src/styles/index.css:379`, `react-templates/src/styles/index.css:420`, `react-templates/src/styles/index.css:476` +3 more |
| `0.375rem` | `spacing.6` | `var(--mag-spacing-6)` | 6 errors in 1 file | `react-templates/src/styles/index.css:387`, `react-templates/src/styles/index.css:428`, `react-templates/src/styles/index.css:484` +3 more |
| `1px` | `borders.1`: Standard border: input fields, outline buttons, dividers, containers | `var(--mag-borders-1)`, `token(borders.1)` | 5 errors in 5 files | `react-templates/src/components/Form/FileUpload/styles.css:22`, `react-templates/src/patterns/DownloadAndUpload/UploadModal.tsx:62`, `react-templates/src/patterns/MasterAndDetail/styles.css:107` +2 more |
| `15px` | `fontSizes.md` | `var(--mag-font-sizes-md)`, `'md'` | 5 errors in 5 files | `react-templates/src/components/Layouts/styles/header.css:64`, `react-templates/src/components/Layouts/styles/navigator.css:97`, `react-templates/src/patterns/MasterAndDetail/styles.css:111` +2 more |
| `1.25rem` | `spacing.20` | `var(--mag-spacing-20)` | 5 errors in 1 file | `react-templates/src/styles/index.css:456`, `react-templates/src/styles/index.css:512`, `react-templates/src/styles/index.css:572` +2 more |
| `400` | `fontWeights.regular` | `var(--mag-font-weights-regular)`, `'regular'` | 3 errors in 3 files | `react-templates/src/components/Form/FileUpload/styles.css:58`, `react-templates/src/patterns/SavedFilter/FilterSetting/EditableListItem.tsx:155`, `react-templates/src/patterns/SavedFilter/FilterSetting/FilterSetting.tsx:271` |
| `8px`, `8` | `radii.lg`: Large components: containers, cards, dropdown menus, popovers, tooltips, alerts, banners, toasts, dialogs, floating buttons | `'lg'`, `var(--mag-radii-lg)` | 3 errors in 3 files | `react-templates/src/patterns/DownloadAndUpload/UploadModal.tsx:63`, `react-templates/src/patterns/EditableDataTable/styles.css:55`, `react-templates/src/patterns/FormWithStepper/ReviewForm.tsx:67` |
| `#f5f7fa` | `colors.neutral.100` | `var(--mag-colors-neutral-100)` | 2 errors in 2 files | `react-templates/src/components/Form/FileUpload/styles.css:10`, `react-templates/src/components/Layouts/styles/layout.css:13` |
| `24px` | `lineHeights.2xl` | `var(--mag-line-heights-2xl)` | 2 errors in 2 files | `react-templates/src/components/Layouts/styles/header.css:65`, `react-templates/src/components/Layouts/styles/navigator.css:99` |
| `4px` | `radii.md`: Medium components: buttons, input fields, select fields, text areas, tags, pagination items, accordion items | `var(--mag-radii-md)` | 2 errors in 2 files | `react-templates/src/components/Layouts/styles/menu-button.css:8`, `react-templates/src/components/Layouts/styles/navigator.css:51` |
| `23px` | `fontSizes.2xl` | `var(--mag-font-sizes-2xl)` | 1 error in 1 file | `react-templates/src/components/Layouts/styles/header.css:57` |
| `28px` | `lineHeights.3xl` | `var(--mag-line-heights-3xl)` | 1 error in 1 file | `react-templates/src/components/Layouts/styles/header.css:58` |
| `19px` | `fontSizes.xl` | `'xl'` | 1 error in 1 file | `react-templates/src/patterns/SavedFilter/FilterSetting/FilterSetting.tsx:147` |

### Use the closest token (the look changes slightly)

| Found | Closest token | Write | Places | Examples |
|---|---|---|---|---|
| `-14px`, `0.875rem` | `spacing.12` | — | 6 warnings in 2 files | `react-templates/src/components/Layouts/styles/navigator.css:50`, `react-templates/src/styles/index.css:444`, `react-templates/src/styles/index.css:500` +3 more |
| `#666` | `colors.neutral.700` | `'neutral.700'` | 6 errors in 6 files | `react-templates/src/patterns/EditableDataTable/BasicTable.tsx:183`, `react-templates/src/patterns/EditableDataTable/EditableTable.tsx:1115`, `react-templates/src/patterns/MasterAndDetail/BookingTable/BookingTable.tsx:447` +3 more |
| `1.375rem` | `spacing.20` | — | 5 warnings in 1 file | `react-templates/src/styles/index.css:460`, `react-templates/src/styles/index.css:516`, `react-templates/src/styles/index.css:576` +2 more |
| `-0.2px`, `-0.4px` | `letterSpacings.normal` | — | 3 warnings in 2 files | `react-templates/src/components/Layouts/styles/header.css:59`, `react-templates/src/components/Layouts/styles/header.css:66`, `react-templates/src/components/Layouts/styles/navigator.css:100` |
| `#66707b` | `colors.neutral.600`: Neutral button background, hover | `var(--mag-colors-neutral-600)` | 2 errors in 2 files | `react-templates/src/components/Form/FileUpload/styles.css:62`, `react-templates/src/patterns/Form/AddNewPatterns/styles.css:11` |
| `rgba(255, 255, 255, 0.2)` | `colors.white` | `var(--mag-colors-white)` | 2 errors in 2 files | `react-templates/src/components/Layouts/styles/header.css:69`, `react-templates/src/components/Layouts/styles/menu-button.css:4` |
| `46` | `spacing.48`: Space between content on the page (top of page and header), page margins and the gap between sections | — | 2 warnings in 2 files | `react-templates/src/patterns/ListAndDetail/ListPage/PopupDetailForm.tsx:104`, `react-templates/src/patterns/MasterAndDetail/MasterPage/PopupDetailForm.tsx:119` |
| `11px` | `spacing.10` | — | 2 warnings in 1 file | `react-templates/src/patterns/SearchAndForm/styles.css:148`, `react-templates/src/patterns/SearchAndForm/styles.css:152` |
| `0.375rem` | `radii.lg`: Large components: containers, cards, dropdown menus, popovers, tooltips, alerts, banners, toasts, dialogs, floating buttons | — | 1 warning in 1 file | `react-templates/src/components/Form/FileUpload/styles.css:14` |
| `#d1d5db` | `colors.neutral.200` | `var(--mag-colors-neutral-200)` | 1 error in 1 file | `react-templates/src/components/Form/FileUpload/styles.css:26` |
| `#3b82f6` | `colors.blue.500` | `var(--mag-colors-blue-500)` | 1 error in 1 file | `react-templates/src/components/Form/FileUpload/styles.css:50` |
| `14px` | `fontSizes.md` | — | 1 warning in 1 file | `react-templates/src/components/Layouts/styles/header.css:40` |

### Needs a decision (no token fits)

| Category | Problem | Found | Suggestion | Places | Examples |
|---|---|---|---|---|---|
| spacing | Hardcoded spacing | `-1px`, `0.0625rem` | no usable token: spacing.1 has this value but no role (foundations/spacing.md) | 16 errors in 6 files | `react-templates/src/patterns/ListAndDetail/styles.css:73`, `react-templates/src/patterns/ListAndDetail/styles.css:90`, `react-templates/src/patterns/MasterAndDetail/styles.css:59` +13 more |
| motion | Raw duration | `0.2s`, `0.4s`, `50ms`, `10ms` | Magenta has no motion tokens yet | 9 warnings in 5 files | `react-templates/src/components/Layouts/styles/header.css:72`, `react-templates/src/components/Layouts/styles/navigator.css:7`, `react-templates/src/components/Layouts/styles/navigator.css:73` +6 more |
| spacing | Hardcoded spacing | `1.125rem` | no usable token: spacing.18 has this value but no role (foundations/spacing.md) | 5 errors in 1 file | `react-templates/src/styles/index.css:452`, `react-templates/src/styles/index.css:508`, `react-templates/src/styles/index.css:568` +2 more |
| zIndex | Raw z-index has no token | `10`, `2` | use the zIndex token for the kind of layer (foundations/z-index.md) | 4 errors in 3 files | `react-templates/src/components/Layouts/styles/navigator.css:8`, `react-templates/src/components/Layouts/styles/navigator.css:49`, `react-templates/src/patterns/EditableDataTable/EditableTable.tsx:1087` +1 more |
| color | CSS variable is not a Magenta token | `--mar-colors-primary-700` | check the name in tokens/primitive.tokens.json | 4 errors in 4 files | `react-templates/src/patterns/MasterAndDetail/BookingTable/BookingTable.tsx:445`, `react-templates/src/patterns/SearchAndForm/SearchAndForm.tsx:210`, `react-templates/src/patterns/SearchAndForm/SearchMixedFormEdit.tsx:189` +1 more |
| shadow | Hardcoded shadow | `0px 2px 8px 0px rgba(51, 51, 51, 0.1),`, `0px 1px 2px 0px rgba(51, 51, 51, 0.1),`, `0px 2px 8px 0px rgba(51, 51, 51, 0),` | use a shadows token by elevation level (foundations/elevation.md) | 3 errors in 1 file | `react-templates/src/components/Layouts/styles/navigator.css:28`, `react-templates/src/components/Layouts/styles/navigator.css:52`, `react-templates/src/components/Layouts/styles/navigator.css:122` |
| spacing | CSS variable is not a Magenta token | `--Spacings-gaps-mag-spacings-12` | replace with the token for its fallback | 3 errors in 1 file | `react-templates/src/components/Layouts/styles/navigator.css:69`, `react-templates/src/components/Layouts/styles/navigator.css:70`, `react-templates/src/components/Layouts/styles/navigator.css:83` |
| fontWeight | Hardcoded font weight | `700` | Magenta has only fontWeights.regular and fontWeights.semi-bold | 2 errors in 2 files | `react-templates/src/components/Layouts/styles/header.css:39`, `react-templates/src/styles/index.css:237` |
| lineHeight | Unitless line height | `1.4` | use a text style (foundations/typography.md) | 1 warning in 1 file | `react-templates/src/patterns/SavedFilter/FilterSetting/FilterSetting.tsx:290` |

## Appendix: findings per file

### `css/src/recipes/Accordion/accordion.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 25 | error | borderWidth | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/Accordion/accordionItem.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 12 | error | borderWidth | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 28 | warning | motion | decide | raw duration '200ms' | Magenta has no motion tokens yet |
| 39 | warning | motion | decide | raw duration '200ms' | Magenta has no motion tokens yet |

### `css/src/recipes/Avatar/avatar.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 12 | error | borderWidth | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/Avatar/avatarGroup.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 13 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 24 | error | spacing | swap | hardcoded spacing '-4px' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → '-4' |
| 29 | error | spacing | swap | hardcoded spacing '-6px' | spacing.6 (Space between an icon and its text (checkbox, radio button) +4 more) → '-6' |
| 35 | error | spacing | swap | hardcoded spacing '-8px' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → '-8' |
| 66 | error | spacing | swap | hardcoded spacing '-4px' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → '-4' |
| 80 | error | spacing | swap | hardcoded spacing '-6px' | spacing.6 (Space between an icon and its text (checkbox, radio button) +4 more) → '-6' |
| 94 | error | spacing | swap | hardcoded spacing '-8px' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → '-8' |

### `css/src/recipes/button.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 22 | warning | motion | decide | raw duration '2s' | Magenta has no motion tokens yet |
| 69 | error | borderWidth | swap | hardcoded border width '2px' | borders.2 (Focus ring (buttons, tabs, calendar dates, dialog header) +1 more) → token(borders.2) |
| 78 | error | borderWidth | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 87 | error | borderWidth | swap | hardcoded border width '2px' | borders.2 (Focus ring (buttons, tabs, calendar dates, dialog header) +1 more) → token(borders.2) |
| 142 | error | borderWidth | swap | hardcoded border width '2px' | borders.2 (Focus ring (buttons, tabs, calendar dates, dialog header) +1 more) → token(borders.2) |
| 431 | error | borderWidth | swap | hardcoded border width '2px' | borders.2 (Focus ring (buttons, tabs, calendar dates, dialog header) +1 more) → token(borders.2) |
| 461 | error | borderWidth | swap | hardcoded border width '2px' | borders.2 (Focus ring (buttons, tabs, calendar dates, dialog header) +1 more) → token(borders.2) |
| 491 | error | borderWidth | swap | hardcoded border width '2px' | borders.2 (Focus ring (buttons, tabs, calendar dates, dialog header) +1 more) → token(borders.2) |
| 521 | error | borderWidth | swap | hardcoded border width '2px' | borders.2 (Focus ring (buttons, tabs, calendar dates, dialog header) +1 more) → token(borders.2) |
| 534 | error | borderWidth | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/buttonGroup.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 11 | error | spacing | decide | hardcoded spacing '-1px' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 13 | error | borderWidth | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 14 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 17 | error | zIndex | decide | raw z-index 2 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |
| 21 | error | zIndex | decide | raw z-index 2 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |
| 25 | error | zIndex | decide | raw z-index 2 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |
| 29 | warning | zIndex | swap | raw z-index 0 | zIndex.base for stacking inside a component |

### `css/src/recipes/Calendar/calendarHeader.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 23 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/Calendar/calendarWrapper.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 12 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/Calendar/date.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 19 | warning | motion | decide | raw duration '2s' | Magenta has no motion tokens yet |

### `css/src/recipes/Calendar/dualCalendar.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 19 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/Carousel/carouselIndicator.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 20 | warning | motion | decide | raw duration '0.2s' | Magenta has no motion tokens yet |

### `css/src/recipes/checkbox.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 56 | warning | motion | decide | raw duration '0.2s' | Magenta has no motion tokens yet |
| 74 | warning | fontSize | closest | font size '12px' is off the scale | closest: fontSizes.sm (13px) |
| 87 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 207 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 244 | warning | borderWidth | decide | border width '1.5px' has no token | use borders.1 or borders.2 (foundations/border.md) |
| 244 | warning | borderWidth | decide | border width '1.5px' has no token | use borders.1 or borders.2 (foundations/border.md) |

### `css/src/recipes/compactWrapper.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 16 | error | spacing | decide | hardcoded spacing '-1px' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 18 | error | borderWidth | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 19 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 22 | error | zIndex | decide | raw z-index 3 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |
| 26 | error | zIndex | decide | raw z-index 3 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |
| 30 | error | zIndex | decide | raw z-index 3 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |
| 34 | warning | zIndex | swap | raw z-index 0 | zIndex.base for stacking inside a component |
| 40 | error | zIndex | decide | raw z-index 2 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |
| 45 | error | zIndex | decide | raw z-index 3 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |

### `css/src/recipes/DatePicker/dateRangeInput.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 32 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |

### `css/src/recipes/DatePicker/dateTimeInput.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 36 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/Dialog/dialogHeader.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 18 | error | borderWidth | swap | hardcoded border width '2px' | borders.2 (Focus ring (buttons, tabs, calendar dates, dialog header) +1 more) → token(borders.2) |

### `css/src/recipes/Drawer/drawer.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 17 | warning | motion | decide | raw duration '400ms' | Magenta has no motion tokens yet |

### `css/src/recipes/FeedbackMessages/alert.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 38 | error | borderWidth | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/formCheck.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 16 | warning | motion | decide | raw duration '0.2s' | Magenta has no motion tokens yet |

### `css/src/recipes/image.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 24 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 49 | warning | motion | decide | raw duration '0.1s' | Magenta has no motion tokens yet |
| 68 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/InlineEdit/InlineView.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 9 | warning | zIndex | swap | raw z-index -1 | zIndex.below for stacking inside a component |

### `css/src/recipes/InlineEdit/InlineWrapper.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 14 | warning | motion | decide | raw duration '0.2s' | Magenta has no motion tokens yet |

### `css/src/recipes/InputAtoms/inputContainer.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 15 | warning | motion | decide | raw duration '0.2s' | Magenta has no motion tokens yet |

### `css/src/recipes/link/link.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 16 | warning | motion | decide | raw duration '2s' | Magenta has no motion tokens yet |

### `css/src/recipes/List/listSubheader.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 21 | warning | motion | decide | raw duration '0.2s' | Magenta has no motion tokens yet |

### `css/src/recipes/Menu/menuFooter.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 13 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/Menu/menuItem.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 25 | warning | motion | decide | raw duration '0.2s' | Magenta has no motion tokens yet |

### `css/src/recipes/numberInput.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 36 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.neutral.300)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 49 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.primary.400)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 57 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.primary.500)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 163 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.red.500)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 171 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.orange.500)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 179 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.green.500)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 391 | error | spacing | decide | hardcoded spacing '-1px' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 397 | error | spacing | decide | hardcoded spacing '-1px' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 401 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 425 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.neutral.200)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 431 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.neutral.200)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 449 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.neutral.200)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 452 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.primary.500)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 465 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.neutral.200)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 494 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.neutral.200)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 504 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.neutral.300)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 506 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.primary.400)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 508 | error | zIndex | decide | raw z-index 3 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |
| 511 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.primary.600)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 513 | error | zIndex | decide | raw z-index 3 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |
| 523 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.red.500)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 535 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.red.500)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 547 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.orange.500)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 559 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.orange.500)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 571 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.green.500)' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 583 | warning | shadow | decide | custom shadow 'inset 0 0 0 1px token(colors.green.500)' | check foundations/elevation.md; use token(borders.*) for ring widths |

### `css/src/recipes/Progress/linear.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 26 | warning | motion | decide | raw duration '0.3s' | Magenta has no motion tokens yet |

### `css/src/recipes/radio.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 16 | warning | motion | decide | raw duration '0.2s' | Magenta has no motion tokens yet |
| 44 | warning | zIndex | swap | raw z-index 0 | zIndex.base for stacking inside a component |
| 124 | warning | lineHeight | decide | unitless line height '0' | use a text style (foundations/typography.md) |

### `css/src/recipes/Resizeable/resizeable.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 22 | error | borderWidth | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/Segmented/Item.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 15 | error | border | swap | hardcoded border width '2px' | borders.2 (Focus ring (buttons, tabs, calendar dates, dialog header) +1 more) → token(borders.2) |
| 16 | error | border | swap | hardcoded border width '2px' | borders.2 (Focus ring (buttons, tabs, calendar dates, dialog header) +1 more) → token(borders.2) |
| 60 | error | border | swap | hardcoded border width '2px' | borders.2 (Focus ring (buttons, tabs, calendar dates, dialog header) +1 more) → token(borders.2) |
| 63 | error | border | swap | hardcoded border width '2px' | borders.2 (Focus ring (buttons, tabs, calendar dates, dialog header) +1 more) → token(borders.2) |

### `css/src/recipes/Select/select.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 56 | error | zIndex | decide | raw z-index 10 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |

### `css/src/recipes/spinner.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 14 | warning | lineHeight | decide | unitless line height '0' | use a text style (foundations/typography.md) |
| 16 | warning | motion | decide | raw duration '0.5s' | Magenta has no motion tokens yet |
| 20 | warning | motion | decide | raw duration '0.5s' | Magenta has no motion tokens yet |

### `css/src/recipes/Stepper/step.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 83 | warning | shadow | decide | custom shadow 'inset 0 -2px 0 0 {colors.primary.300}' | check foundations/elevation.md; use token(borders.*) for ring widths |
| 106 | warning | shadow | decide | custom shadow 'inset -2px 0 0 0 {colors.primary.300}' | check foundations/elevation.md; use token(borders.*) for ring widths |

### `css/src/recipes/Table/table.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 16 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 17 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/Table/tableCell.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 23 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 38 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 53 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 137 | error | color | closest | hardcoded color 'rgba(51, 51, 51, 0.15)' | closest: colors.background-overlay.50 (Overlay behind dialogs, drawers and lightboxes ("filter background")) → 'background-overlay.50' |
| 155 | error | color | swap | hardcoded color 'rgba(51, 51, 51, 0.00)' | colors.transparent (Transparent background) → 'transparent' |

### `css/src/recipes/Table/tableFooter.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 9 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/Table/tableHeader.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 9 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/Table/tableRow.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 19 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/Tabs/tabList.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 113 | error | color | closest | hardcoded color 'rgba(51,51,51,0.15)' | closest: colors.background-overlay.50 (Overlay behind dialogs, drawers and lightboxes ("filter background")) → 'background-overlay.50' |
| 125 | error | color | closest | hardcoded color 'rgba(51,51,51,0.15)' | closest: colors.background-overlay.50 (Overlay behind dialogs, drawers and lightboxes ("filter background")) → 'background-overlay.50' |

### `css/src/recipes/Tabs/tabListGroup.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 32 | warning | motion | decide | raw duration '0.1s' | Magenta has no motion tokens yet |
| 105 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 112 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 119 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 126 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 133 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 140 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/Tabs/tabListItem.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 18 | warning | motion | decide | raw duration '1s' | Magenta has no motion tokens yet |
| 45 | warning | motion | decide | raw duration '2s' | Magenta has no motion tokens yet |
| 53 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 280 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/Tabs/utils.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 60 | error | border | swap | hardcoded border width '2px' | borders.2 (Focus ring (buttons, tabs, calendar dates, dialog header) +1 more) → token(borders.2) |

### `css/src/recipes/TextEditor/attachment.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 40 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 76 | error | spacing | swap | hardcoded spacing '2px' | spacing.2 (Gap between repeating small elements (tag group) +1 more) → '2' |

### `css/src/recipes/TextEditor/editor.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 16 | error | borderWidth | swap | hardcoded border width '1' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 47 | error | spacing | swap | hardcoded spacing '2rem' | spacing.32 (Space between content on the page (top of page and header), page margins and the gap between sections) → '32' |
| 100 | error | borderWidth | swap | hardcoded border width '1' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 106 | error | borderWidth | swap | hardcoded border width '1' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/TextEditor/fileDragOverlay.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 16 | error | color | closest | hardcoded color '#B3E3E150' | closest: colors.secondary.200 (Outline and ghost button background, pressed) → 'secondary.200' |

### `css/src/recipes/TextEditor/linkForm.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 25 | error | spacing | swap | hardcoded spacing '-12px' | spacing.12 (Vertical space between elements in cards +5 more) → '-12' |

### `css/src/recipes/Timeline/timeline.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 29 | error | spacing | swap | hardcoded spacing '4px' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → '4' |

### `css/src/recipes/TimePicker/timeCylinder.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 26 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |

### `css/src/recipes/toggle.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 11 | warning | motion | decide | raw duration '0.25s' | Magenta has no motion tokens yet |
| 77 | error | shadow | decide | hardcoded shadow 'inset 0 0 0 token(borders.1) token(colors.neutral.300), 0px ' | use a shadows token by elevation level (foundations/elevation.md) |
| 83 | error | shadow | decide | hardcoded shadow 'inset 0 0 0 token(borders.1) token(colors.green.300), 0px 0p' | use a shadows token by elevation level (foundations/elevation.md) |
| 96 | error | shadow | decide | hardcoded shadow '0px 0px 6px 0px rgba(44, 45, 46, 0.10) inset, 0px 0px 2px 1p' | use a shadows token by elevation level (foundations/elevation.md) |
| 199 | error | spacing | swap | hardcoded spacing '8px' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → '8' |
| 230 | error | spacing | swap | hardcoded spacing '6px' | spacing.6 (Space between an icon and its text (checkbox, radio button) +4 more) → '6' |
| 261 | error | spacing | swap | hardcoded spacing '4px' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → '4' |
| 294 | error | spacing | swap | hardcoded spacing '4px' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → '4' |
| 295 | error | spacing | swap | hardcoded spacing '6px' | spacing.6 (Space between an icon and its text (checkbox, radio button) +4 more) → '6' |
| 296 | error | spacing | swap | hardcoded spacing '8px' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → '8' |

### `css/src/recipes/tooltip.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 16 | error | zIndex | decide | raw z-index 11 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |

### `css/src/recipes/TreeView/treeViewItem.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 26 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 29 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 38 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 54 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 57 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |

### `css/src/utilities.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 12 | error | radius | swap | hardcoded radius '4' | radii.md (Medium components: buttons, input fields, select fields, text areas, tags, pagination items, accordion items) → 'md' |
| 16 | error | spacing | decide | hardcoded spacing '1px' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 17 | error | radius | swap | hardcoded radius '4' | radii.md (Medium components: buttons, input fields, select fields, text areas, tags, pagination items, accordion items) → 'md' |
| 21 | error | radius | swap | hardcoded radius '4' | radii.md (Medium components: buttons, input fields, select fields, text areas, tags, pagination items, accordion items) → 'md' |

### `react-templates/src/components/commons/Panel/styles.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 6 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |

### `react-templates/src/components/Form/FileUpload/styles.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 10 | error | color | swap | hardcoded color '#f5f7fa' | colors.neutral.100 (Default page background +5 more) → var(--mag-colors-neutral-100) |
| 14 | warning | radius | closest | radius '0.375rem' is off the scale | closest: radii.lg (8px) |
| 22 | error | borderWidth | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → var(--mag-borders-1) |
| 26 | error | color | closest | hardcoded color '#d1d5db' | closest: colors.neutral.200 (Skeleton background and elements +6 more) → var(--mag-colors-neutral-200) |
| 46 | error | spacing | swap | hardcoded spacing '0.25rem' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → var(--mag-spacing-4) |
| 50 | error | color | closest | hardcoded color '#3b82f6' | closest: colors.blue.500 → var(--mag-colors-blue-500) |
| 58 | error | fontWeight | swap | hardcoded font weight '400' | fontWeights.regular → var(--mag-font-weights-regular) |
| 62 | error | color | closest | hardcoded color '#66707b' | closest: colors.neutral.600 (Neutral button background, hover) → var(--mag-colors-neutral-600) |

### `react-templates/src/components/Layouts/Header.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 80 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |
| 84 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |

### `react-templates/src/components/Layouts/HeaderTitles/HeaderTitle.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 85 | error | spacing | swap | hardcoded spacing '-10px' | spacing.10 (Gap between repeating small elements (tag group) +2 more) → '-10' |
| 85 | error | spacing | swap | hardcoded spacing '-12px' | spacing.12 (Vertical space between elements in cards +5 more) → '-12' |

### `react-templates/src/components/Layouts/Navigator.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 27 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 27 | error | spacing | swap | hardcoded spacing '12px' | spacing.12 (Vertical space between elements in cards +5 more) → '12' |

### `react-templates/src/components/Layouts/styles/header.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 17 | error | spacing | swap | hardcoded spacing '10px' | spacing.10 (Gap between repeating small elements (tag group) +2 more) → var(--mag-spacing-10) |
| 17 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 17 | error | spacing | swap | hardcoded spacing '10px' | spacing.10 (Gap between repeating small elements (tag group) +2 more) → var(--mag-spacing-10) |
| 32 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → var(--mag-spacing-16) |
| 39 | error | fontWeight | decide | hardcoded font weight '700' | Magenta has only fontWeights.regular and fontWeights.semi-bold |
| 40 | warning | fontSize | closest | font size '14px' is off the scale | closest: fontSizes.md (15px) |
| 51 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → var(--mag-spacing-16) |
| 51 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 56 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → var(--mag-font-weights-semi-bold) |
| 57 | error | fontSize | swap | hardcoded font size '23px' | fontSizes.2xl → var(--mag-font-sizes-2xl) |
| 58 | error | lineHeight | swap | hardcoded line height '28px' | lineHeights.3xl → var(--mag-line-heights-3xl) |
| 59 | warning | letterSpacing | closest | letter spacing '-0.2px' is off the scale | closest: letterSpacings.normal (0px) |
| 64 | error | fontSize | swap | hardcoded font size '15px' | fontSizes.md → var(--mag-font-sizes-md) |
| 65 | error | lineHeight | swap | hardcoded line height '24px' | lineHeights.2xl → var(--mag-line-heights-2xl) |
| 66 | warning | letterSpacing | closest | letter spacing '-0.4px' is off the scale | closest: letterSpacings.normal (0px) |
| 69 | error | color | closest | hardcoded color 'rgba(255, 255, 255, 0.2)' | closest: colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 72 | warning | motion | decide | raw duration '0.2s' | Magenta has no motion tokens yet |

### `react-templates/src/components/Layouts/styles/layout.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 13 | error | color | swap | hardcoded color '#f5f7fa' | colors.neutral.100 (Default page background +5 more) → var(--mag-colors-neutral-100) |

### `react-templates/src/components/Layouts/styles/menu-button.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 4 | error | color | closest | hardcoded color 'rgba(255, 255, 255, 0.2)' | closest: colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 8 | error | radius | swap | hardcoded radius '4px' | radii.md (Medium components: buttons, input fields, select fields, text areas, tags, pagination items, accordion items) → var(--mag-radii-md) |

### `react-templates/src/components/Layouts/styles/navigator.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 7 | warning | motion | decide | raw duration '0.4s' | Magenta has no motion tokens yet |
| 8 | error | zIndex | decide | raw z-index 10 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |
| 28 | error | shadow | decide | hardcoded shadow '0px 2px 8px 0px rgba(51, 51, 51, 0.1),' | use a shadows token by elevation level (foundations/elevation.md) |
| 49 | error | zIndex | decide | raw z-index 10 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |
| 50 | warning | spacing | closest | spacing '-14px' is off the scale | closest: spacing.12 (12px) |
| 51 | error | radius | swap | hardcoded radius '4px' | radii.md (Medium components: buttons, input fields, select fields, text areas, tags, pagination items, accordion items) → var(--mag-radii-md) |
| 52 | error | shadow | decide | hardcoded shadow '0px 1px 2px 0px rgba(51, 51, 51, 0.1),' | use a shadows token by elevation level (foundations/elevation.md) |
| 69 | error | spacing | decide | CSS variable '--Spacings-gaps-mag-spacings-12' is not a Magenta token | replace with the token for its fallback '12px' |
| 70 | error | spacing | decide | CSS variable '--Spacings-gaps-mag-spacings-12' is not a Magenta token | replace with the token for its fallback '12px' |
| 73 | warning | motion | decide | raw duration '0.4s' | Magenta has no motion tokens yet |
| 83 | error | spacing | decide | CSS variable '--Spacings-gaps-mag-spacings-12' is not a Magenta token | replace with the token for its fallback '12px' |
| 84 | warning | motion | decide | raw duration '0.4s' | Magenta has no motion tokens yet |
| 97 | error | fontSize | swap | hardcoded font size '15px' | fontSizes.md → var(--mag-font-sizes-md) |
| 99 | error | lineHeight | swap | hardcoded line height '24px' | lineHeights.2xl → var(--mag-line-heights-2xl) |
| 100 | warning | letterSpacing | closest | letter spacing '-0.2px' is off the scale | closest: letterSpacings.normal (0px) |
| 101 | warning | motion | decide | raw duration '0.4s' | Magenta has no motion tokens yet |
| 122 | error | shadow | decide | hardcoded shadow '0px 2px 8px 0px rgba(51, 51, 51, 0),' | use a shadows token by elevation level (foundations/elevation.md) |

### `react-templates/src/components/Layouts/styles/responsive-header.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 3 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 4 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |

### `react-templates/src/components/NoDataFound/index.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 26 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |

### `react-templates/src/patterns/DownloadAndUpload/DownloadAllData.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 42 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 44 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 78 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 82 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 135 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 140 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |

### `react-templates/src/patterns/DownloadAndUpload/DownloadModal.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 52 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |
| 53 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 55 | error | spacing | swap | hardcoded spacing '-12px' | spacing.12 (Vertical space between elements in cards +5 more) → '-12' |
| 70 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |
| 71 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 73 | error | spacing | swap | hardcoded spacing '-12px' | spacing.12 (Vertical space between elements in cards +5 more) → '-12' |

### `react-templates/src/patterns/DownloadAndUpload/MultipleRowsDownload.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 45 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 45 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 47 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 51 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 108 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 113 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |

### `react-templates/src/patterns/DownloadAndUpload/SingleRowDownload.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 54 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 54 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 56 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 58 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |

### `react-templates/src/patterns/DownloadAndUpload/UploadAndDownloadData.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 34 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 34 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 36 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 39 | error | spacing | swap | hardcoded spacing '8px' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → '8' |

### `react-templates/src/patterns/DownloadAndUpload/UploadData.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 27 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 27 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 29 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 34 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |

### `react-templates/src/patterns/DownloadAndUpload/UploadModal.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 37 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 37 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |
| 43 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |
| 46 | error | spacing | swap | hardcoded spacing '8px' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → '8' |
| 53 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |
| 62 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → token(borders.1) |
| 63 | error | radius | swap | hardcoded radius '8px' | radii.lg (Large components: containers, cards, dropdown menus, popovers, tooltips, alerts, banners, toasts, dialogs, floating buttons) → 'lg' |

### `react-templates/src/patterns/EditableDataTable/BasicTable.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 90 | error | spacing | swap | hardcoded spacing '10px' | spacing.10 (Gap between repeating small elements (tag group) +2 more) → '10' |
| 101 | error | spacing | swap | hardcoded spacing '10px' | spacing.10 (Gap between repeating small elements (tag group) +2 more) → '10' |
| 165 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 183 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 183 | error | color | closest | hardcoded color '#666' | closest: colors.neutral.700 (Default labels, helper text and explanatory text +5 more) → 'neutral.700' |
| 242 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |
| 262 | error | spacing | swap | hardcoded spacing '48px' | spacing.48 (Space between content on the page (top of page and header), page margins and the gap between sections) → '48' |

### `react-templates/src/patterns/EditableDataTable/EditableTable.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 674 | error | spacing | swap | hardcoded spacing '10px' | spacing.10 (Gap between repeating small elements (tag group) +2 more) → '10' |
| 694 | error | spacing | swap | hardcoded spacing '4px' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → '4' |
| 996 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 1087 | error | zIndex | decide | raw z-index 2 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |
| 1115 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 1115 | error | color | closest | hardcoded color '#666' | closest: colors.neutral.700 (Default labels, helper text and explanatory text +5 more) → 'neutral.700' |
| 1295 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |
| 1317 | error | spacing | swap | hardcoded spacing '48px' | spacing.48 (Space between content on the page (top of page and header), page margins and the gap between sections) → '48' |

### `react-templates/src/patterns/EditableDataTable/styles.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 39 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 48 | error | spacing | swap | hardcoded spacing '1rem' | spacing.16 (Vertical space between elements in cards +2 more) → var(--mag-spacing-16) |
| 51 | error | spacing | swap | hardcoded spacing '8px' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → var(--mag-spacing-8) |
| 54 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 55 | error | radius | swap | hardcoded radius '8px' | radii.lg (Large components: containers, cards, dropdown menus, popovers, tooltips, alerts, banners, toasts, dialogs, floating buttons) → var(--mag-radii-lg) |
| 56 | error | spacing | swap | hardcoded spacing '1rem' | spacing.16 (Vertical space between elements in cards +2 more) → var(--mag-spacing-16) |
| 59 | error | spacing | swap | hardcoded spacing '4px' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → var(--mag-spacing-4) |
| 63 | error | zIndex | decide | raw z-index 2 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |
| 68 | error | spacing | swap | hardcoded spacing '10px' | spacing.10 (Gap between repeating small elements (tag group) +2 more) → var(--mag-spacing-10) |

### `react-templates/src/patterns/Form/AddNewPatterns/styles.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 10 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → var(--mag-font-weights-semi-bold) |
| 11 | error | color | closest | hardcoded color '#66707b' | closest: colors.neutral.600 (Neutral button background, hover) → var(--mag-colors-neutral-600) |
| 20 | warning | motion | decide | raw duration '0.2s' | Magenta has no motion tokens yet |

### `react-templates/src/patterns/Form/InputBySearch/styles.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 22 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |

### `react-templates/src/patterns/FormWithStepper/ReviewForm.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 67 | error | radius | swap | hardcoded radius '8' | radii.lg (Large components: containers, cards, dropdown menus, popovers, tooltips, alerts, banners, toasts, dialogs, floating buttons) → 'lg' |

### `react-templates/src/patterns/ListAndDetail/ListAndDetail.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 32 | error | spacing | swap | hardcoded spacing '48px' | spacing.48 (Space between content on the page (top of page and header), page margins and the gap between sections) → '48' |

### `react-templates/src/patterns/ListAndDetail/ListPage/ListPage.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 107 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |

### `react-templates/src/patterns/ListAndDetail/ListPage/PopupDetailForm.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 104 | warning | spacing | closest | spacing '46' is off the scale | closest: spacing.48 (48px) |

### `react-templates/src/patterns/ListAndDetail/styles.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 14 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 19 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 27 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 73 | error | spacing | decide | hardcoded spacing '-1px' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 84 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 87 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 90 | error | spacing | decide | hardcoded spacing '-1px' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |

### `react-templates/src/patterns/MasterAndDetail/BookingTable/BookingTable.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 181 | error | spacing | swap | hardcoded spacing '10px' | spacing.10 (Gap between repeating small elements (tag group) +2 more) → '10' |
| 192 | error | spacing | swap | hardcoded spacing '10px' | spacing.10 (Gap between repeating small elements (tag group) +2 more) → '10' |
| 412 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |
| 445 | error | color | decide | CSS variable '--mar-colors-primary-700' is not a Magenta token | check the name in tokens/primitive.tokens.json |
| 447 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 447 | error | color | closest | hardcoded color '#666' | closest: colors.neutral.700 (Default labels, helper text and explanatory text +5 more) → 'neutral.700' |
| 537 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |

### `react-templates/src/patterns/MasterAndDetail/MasterAndDetail.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 31 | error | spacing | swap | hardcoded spacing '48px' | spacing.48 (Space between content on the page (top of page and header), page margins and the gap between sections) → '48' |
| 53 | error | spacing | swap | hardcoded spacing '48px' | spacing.48 (Space between content on the page (top of page and header), page margins and the gap between sections) → '48' |

### `react-templates/src/patterns/MasterAndDetail/MasterPage/PopupDetailForm.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 68 | error | spacing | swap | hardcoded spacing '-24px' | spacing.24 (Vertical space between elements in cards +1 more) → '-24' |
| 119 | warning | spacing | closest | spacing '46' is off the scale | closest: spacing.48 (48px) |

### `react-templates/src/patterns/MasterAndDetail/styles.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 14 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 19 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 27 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 59 | error | spacing | decide | hardcoded spacing '-1px' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 70 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 73 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 76 | error | spacing | decide | hardcoded spacing '-1px' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 86 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 91 | error | spacing | swap | hardcoded spacing '24' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 99 | error | spacing | swap | hardcoded spacing '24' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 100 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 106 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 107 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → var(--mag-borders-1) |
| 111 | error | fontSize | swap | hardcoded font size '15px' | fontSizes.md → var(--mag-font-sizes-md) |

### `react-templates/src/patterns/PageHeader/LayoutResponsive/LayoutResponsive.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 40 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |
| 40 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 41 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |
| 41 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |

### `react-templates/src/patterns/PageHeader/LayoutResponsive/styles.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 3 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 7 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → var(--mag-borders-1) |

### `react-templates/src/patterns/PageHeader/styles.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 10 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |

### `react-templates/src/patterns/SavedFilter/FilterSetting/EditableListItem.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 90 | error | spacing | swap | hardcoded spacing '-12px' | spacing.12 (Vertical space between elements in cards +5 more) → '-12' |
| 155 | error | fontWeight | swap | hardcoded font weight '400' | fontWeights.regular → 'regular' |

### `react-templates/src/patterns/SavedFilter/FilterSetting/FilterSetting.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 147 | error | fontSize | swap | hardcoded font size '19px' | fontSizes.xl → 'xl' |
| 155 | error | fontSize | swap | hardcoded font size '15px' | fontSizes.md → 'md' |
| 158 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 271 | error | fontWeight | swap | hardcoded font weight '400' | fontWeights.regular → 'regular' |
| 290 | warning | lineHeight | decide | unitless line height '1.4' | use a text style (foundations/typography.md) |

### `react-templates/src/patterns/SavedFilter/FilterSetting/styles.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 11 | error | spacing | swap | hardcoded spacing '4px' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → var(--mag-spacing-4) |

### `react-templates/src/patterns/SavedFilter/NewSavedFilter.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 255 | error | spacing | swap | hardcoded spacing '48px' | spacing.48 (Space between content on the page (top of page and header), page margins and the gap between sections) → '48' |

### `react-templates/src/patterns/SavedFilter/styles.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 19 | warning | motion | decide | raw duration '50ms' | Magenta has no motion tokens yet |
| 25 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 51 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 57 | error | spacing | decide | hardcoded spacing '-1px' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 66 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 69 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 72 | error | spacing | decide | hardcoded spacing '-1px' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |

### `react-templates/src/patterns/SearchAndForm/SearchAndForm.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 210 | error | color | decide | CSS variable '--mar-colors-primary-700' is not a Magenta token | check the name in tokens/primitive.tokens.json |
| 212 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 212 | error | color | closest | hardcoded color '#666' | closest: colors.neutral.700 (Default labels, helper text and explanatory text +5 more) → 'neutral.700' |

### `react-templates/src/patterns/SearchAndForm/SearchMixedFormEdit.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 189 | error | color | decide | CSS variable '--mar-colors-primary-700' is not a Magenta token | check the name in tokens/primitive.tokens.json |
| 191 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 191 | error | color | closest | hardcoded color '#666' | closest: colors.neutral.700 (Default labels, helper text and explanatory text +5 more) → 'neutral.700' |
| 216 | error | spacing | swap | hardcoded spacing '48px' | spacing.48 (Space between content on the page (top of page and header), page margins and the gap between sections) → '48' |

### `react-templates/src/patterns/SearchAndForm/SearchMixedFormReadToEdit.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 193 | error | color | decide | CSS variable '--mar-colors-primary-700' is not a Magenta token | check the name in tokens/primitive.tokens.json |
| 195 | error | fontWeight | swap | hardcoded font weight '600' | fontWeights.semi-bold → 'semi-bold' |
| 195 | error | color | closest | hardcoded color '#666' | closest: colors.neutral.700 (Default labels, helper text and explanatory text +5 more) → 'neutral.700' |
| 223 | error | spacing | swap | hardcoded spacing '48px' | spacing.48 (Space between content on the page (top of page and header), page margins and the gap between sections) → '48' |

### `react-templates/src/patterns/SearchAndForm/styles.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 33 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 38 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 46 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 78 | error | spacing | decide | hardcoded spacing '-1px' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 89 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 92 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 95 | error | spacing | decide | hardcoded spacing '-1px' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 105 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 110 | error | spacing | swap | hardcoded spacing '24' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 118 | error | spacing | swap | hardcoded spacing '24' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 119 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 125 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 126 | error | border | swap | hardcoded border width '1px' | borders.1 (Standard border: input fields, outline buttons, dividers, containers) → var(--mag-borders-1) |
| 130 | error | fontSize | swap | hardcoded font size '15px' | fontSizes.md → var(--mag-font-sizes-md) |
| 139 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 148 | warning | spacing | closest | spacing '11px' is off the scale | closest: spacing.10 (10px) |
| 151 | error | spacing | swap | hardcoded spacing '-24px' | spacing.24 (Vertical space between elements in cards +1 more) → calc(-1 * var(--mag-spacing-24)) |
| 152 | warning | spacing | closest | spacing '11px' is off the scale | closest: spacing.10 (10px) |

### `react-templates/src/patterns/SearchAndTable/index.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 61 | error | spacing | swap | hardcoded spacing '24px' | spacing.24 (Vertical space between elements in cards +1 more) → '24' |
| 64 | error | spacing | swap | hardcoded spacing '16px' | spacing.16 (Vertical space between elements in cards +2 more) → '16' |

### `react-templates/src/patterns/SearchFilterArea/SaveFilter.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 798 | error | spacing | swap | hardcoded spacing '48px' | spacing.48 (Space between content on the page (top of page and header), page margins and the gap between sections) → '48' |

### `react-templates/src/patterns/SearchFilterArea/styles.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 22 | warning | motion | decide | raw duration '50ms' | Magenta has no motion tokens yet |
| 29 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 56 | error | color | swap | hardcoded color 'white' | colors.white (Text on interactive colors (filled buttons, emphasis tags) +7 more) → var(--mag-colors-white) |
| 63 | error | spacing | decide | hardcoded spacing '-1px' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 75 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 79 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
| 83 | error | spacing | decide | hardcoded spacing '-1px' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 94 | warning | motion | decide | raw duration '10ms' | Magenta has no motion tokens yet |

### `react-templates/src/styles/index.css`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 237 | error | fontWeight | decide | hardcoded font weight '700' | Magenta has only fontWeights.regular and fontWeights.semi-bold |
| 254 | error | spacing | swap | hardcoded spacing '0.25rem' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → var(--mag-spacing-4) |
| 258 | error | spacing | swap | hardcoded spacing '0.5rem' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → var(--mag-spacing-8) |
| 262 | error | spacing | swap | hardcoded spacing '1rem' | spacing.16 (Vertical space between elements in cards +2 more) → var(--mag-spacing-16) |
| 266 | error | spacing | swap | hardcoded spacing '1.5rem' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 270 | error | spacing | swap | hardcoded spacing '2rem' | spacing.32 (Space between content on the page (top of page and header), page margins and the gap between sections) → var(--mag-spacing-32) |
| 278 | error | spacing | swap | hardcoded spacing '0.25rem' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → var(--mag-spacing-4) |
| 282 | error | spacing | swap | hardcoded spacing '0.5rem' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → var(--mag-spacing-8) |
| 286 | error | spacing | swap | hardcoded spacing '1rem' | spacing.16 (Vertical space between elements in cards +2 more) → var(--mag-spacing-16) |
| 290 | error | spacing | swap | hardcoded spacing '1.5rem' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 294 | error | spacing | swap | hardcoded spacing '2rem' | spacing.32 (Space between content on the page (top of page and header), page margins and the gap between sections) → var(--mag-spacing-32) |
| 302 | error | spacing | swap | hardcoded spacing '0.25rem' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → var(--mag-spacing-4) |
| 306 | error | spacing | swap | hardcoded spacing '0.5rem' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → var(--mag-spacing-8) |
| 310 | error | spacing | swap | hardcoded spacing '1rem' | spacing.16 (Vertical space between elements in cards +2 more) → var(--mag-spacing-16) |
| 314 | error | spacing | swap | hardcoded spacing '1.5rem' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 318 | error | spacing | swap | hardcoded spacing '2rem' | spacing.32 (Space between content on the page (top of page and header), page margins and the gap between sections) → var(--mag-spacing-32) |
| 326 | error | spacing | swap | hardcoded spacing '0.25rem' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → var(--mag-spacing-4) |
| 330 | error | spacing | swap | hardcoded spacing '0.5rem' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → var(--mag-spacing-8) |
| 334 | error | spacing | swap | hardcoded spacing '1rem' | spacing.16 (Vertical space between elements in cards +2 more) → var(--mag-spacing-16) |
| 338 | error | spacing | swap | hardcoded spacing '1.5rem' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 342 | error | spacing | swap | hardcoded spacing '2rem' | spacing.32 (Space between content on the page (top of page and header), page margins and the gap between sections) → var(--mag-spacing-32) |
| 350 | error | spacing | swap | hardcoded spacing '0.25rem' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → var(--mag-spacing-4) |
| 354 | error | spacing | swap | hardcoded spacing '0.5rem' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → var(--mag-spacing-8) |
| 358 | error | spacing | swap | hardcoded spacing '1rem' | spacing.16 (Vertical space between elements in cards +2 more) → var(--mag-spacing-16) |
| 362 | error | spacing | swap | hardcoded spacing '1.5rem' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 366 | error | spacing | swap | hardcoded spacing '2rem' | spacing.32 (Space between content on the page (top of page and header), page margins and the gap between sections) → var(--mag-spacing-32) |
| 375 | error | spacing | decide | hardcoded spacing '0.0625rem' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 379 | error | spacing | swap | hardcoded spacing '0.125rem' | spacing.2 (Gap between repeating small elements (tag group) +1 more) → var(--mag-spacing-2) |
| 383 | error | spacing | swap | hardcoded spacing '0.25rem' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → var(--mag-spacing-4) |
| 387 | error | spacing | swap | hardcoded spacing '0.375rem' | spacing.6 (Space between an icon and its text (checkbox, radio button) +4 more) → var(--mag-spacing-6) |
| 391 | error | spacing | swap | hardcoded spacing '0.5rem' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → var(--mag-spacing-8) |
| 395 | error | spacing | swap | hardcoded spacing '0.75rem' | spacing.12 (Vertical space between elements in cards +5 more) → var(--mag-spacing-12) |
| 399 | error | spacing | swap | hardcoded spacing '1rem' | spacing.16 (Vertical space between elements in cards +2 more) → var(--mag-spacing-16) |
| 403 | error | spacing | swap | hardcoded spacing '1.5rem' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 407 | error | spacing | swap | hardcoded spacing '2rem' | spacing.32 (Space between content on the page (top of page and header), page margins and the gap between sections) → var(--mag-spacing-32) |
| 416 | error | spacing | decide | hardcoded spacing '0.0625rem' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 420 | error | spacing | swap | hardcoded spacing '0.125rem' | spacing.2 (Gap between repeating small elements (tag group) +1 more) → var(--mag-spacing-2) |
| 424 | error | spacing | swap | hardcoded spacing '0.25rem' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → var(--mag-spacing-4) |
| 428 | error | spacing | swap | hardcoded spacing '0.375rem' | spacing.6 (Space between an icon and its text (checkbox, radio button) +4 more) → var(--mag-spacing-6) |
| 432 | error | spacing | swap | hardcoded spacing '0.5rem' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → var(--mag-spacing-8) |
| 436 | error | spacing | swap | hardcoded spacing '0.625rem' | spacing.10 (Gap between repeating small elements (tag group) +2 more) → var(--mag-spacing-10) |
| 440 | error | spacing | swap | hardcoded spacing '0.75rem' | spacing.12 (Vertical space between elements in cards +5 more) → var(--mag-spacing-12) |
| 444 | warning | spacing | closest | spacing '0.875rem' is off the scale | closest: spacing.12 (12px) |
| 448 | error | spacing | swap | hardcoded spacing '1rem' | spacing.16 (Vertical space between elements in cards +2 more) → var(--mag-spacing-16) |
| 452 | error | spacing | decide | hardcoded spacing '1.125rem' | no usable token: spacing.18 has this value but no role (foundations/spacing.md) |
| 456 | error | spacing | swap | hardcoded spacing '1.25rem' | spacing.20 (Vertical space between elements in cards +1 more) → var(--mag-spacing-20) |
| 460 | warning | spacing | closest | spacing '1.375rem' is off the scale | closest: spacing.20 (20px) |
| 464 | error | spacing | swap | hardcoded spacing '1.5rem' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 472 | error | spacing | decide | hardcoded spacing '0.0625rem' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 476 | error | spacing | swap | hardcoded spacing '0.125rem' | spacing.2 (Gap between repeating small elements (tag group) +1 more) → var(--mag-spacing-2) |
| 480 | error | spacing | swap | hardcoded spacing '0.25rem' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → var(--mag-spacing-4) |
| 484 | error | spacing | swap | hardcoded spacing '0.375rem' | spacing.6 (Space between an icon and its text (checkbox, radio button) +4 more) → var(--mag-spacing-6) |
| 488 | error | spacing | swap | hardcoded spacing '0.5rem' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → var(--mag-spacing-8) |
| 492 | error | spacing | swap | hardcoded spacing '0.625rem' | spacing.10 (Gap between repeating small elements (tag group) +2 more) → var(--mag-spacing-10) |
| 496 | error | spacing | swap | hardcoded spacing '0.75rem' | spacing.12 (Vertical space between elements in cards +5 more) → var(--mag-spacing-12) |
| 500 | warning | spacing | closest | spacing '0.875rem' is off the scale | closest: spacing.12 (12px) |
| 504 | error | spacing | swap | hardcoded spacing '1rem' | spacing.16 (Vertical space between elements in cards +2 more) → var(--mag-spacing-16) |
| 508 | error | spacing | decide | hardcoded spacing '1.125rem' | no usable token: spacing.18 has this value but no role (foundations/spacing.md) |
| 512 | error | spacing | swap | hardcoded spacing '1.25rem' | spacing.20 (Vertical space between elements in cards +1 more) → var(--mag-spacing-20) |
| 516 | warning | spacing | closest | spacing '1.375rem' is off the scale | closest: spacing.20 (20px) |
| 520 | error | spacing | swap | hardcoded spacing '1.5rem' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 524 | error | spacing | swap | hardcoded spacing '2rem' | spacing.32 (Space between content on the page (top of page and header), page margins and the gap between sections) → var(--mag-spacing-32) |
| 532 | error | spacing | decide | hardcoded spacing '0.0625rem' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 536 | error | spacing | swap | hardcoded spacing '0.125rem' | spacing.2 (Gap between repeating small elements (tag group) +1 more) → var(--mag-spacing-2) |
| 540 | error | spacing | swap | hardcoded spacing '0.25rem' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → var(--mag-spacing-4) |
| 544 | error | spacing | swap | hardcoded spacing '0.375rem' | spacing.6 (Space between an icon and its text (checkbox, radio button) +4 more) → var(--mag-spacing-6) |
| 548 | error | spacing | swap | hardcoded spacing '0.5rem' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → var(--mag-spacing-8) |
| 552 | error | spacing | swap | hardcoded spacing '0.625rem' | spacing.10 (Gap between repeating small elements (tag group) +2 more) → var(--mag-spacing-10) |
| 556 | error | spacing | swap | hardcoded spacing '0.75rem' | spacing.12 (Vertical space between elements in cards +5 more) → var(--mag-spacing-12) |
| 560 | warning | spacing | closest | spacing '0.875rem' is off the scale | closest: spacing.12 (12px) |
| 564 | error | spacing | swap | hardcoded spacing '1rem' | spacing.16 (Vertical space between elements in cards +2 more) → var(--mag-spacing-16) |
| 568 | error | spacing | decide | hardcoded spacing '1.125rem' | no usable token: spacing.18 has this value but no role (foundations/spacing.md) |
| 572 | error | spacing | swap | hardcoded spacing '1.25rem' | spacing.20 (Vertical space between elements in cards +1 more) → var(--mag-spacing-20) |
| 576 | warning | spacing | closest | spacing '1.375rem' is off the scale | closest: spacing.20 (20px) |
| 580 | error | spacing | swap | hardcoded spacing '1.5rem' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 588 | error | spacing | decide | hardcoded spacing '0.0625rem' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 592 | error | spacing | swap | hardcoded spacing '0.125rem' | spacing.2 (Gap between repeating small elements (tag group) +1 more) → var(--mag-spacing-2) |
| 596 | error | spacing | swap | hardcoded spacing '0.25rem' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → var(--mag-spacing-4) |
| 600 | error | spacing | swap | hardcoded spacing '0.375rem' | spacing.6 (Space between an icon and its text (checkbox, radio button) +4 more) → var(--mag-spacing-6) |
| 604 | error | spacing | swap | hardcoded spacing '0.5rem' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → var(--mag-spacing-8) |
| 608 | error | spacing | swap | hardcoded spacing '0.625rem' | spacing.10 (Gap between repeating small elements (tag group) +2 more) → var(--mag-spacing-10) |
| 612 | error | spacing | swap | hardcoded spacing '0.75rem' | spacing.12 (Vertical space between elements in cards +5 more) → var(--mag-spacing-12) |
| 616 | warning | spacing | closest | spacing '0.875rem' is off the scale | closest: spacing.12 (12px) |
| 620 | error | spacing | swap | hardcoded spacing '1rem' | spacing.16 (Vertical space between elements in cards +2 more) → var(--mag-spacing-16) |
| 624 | error | spacing | decide | hardcoded spacing '1.125rem' | no usable token: spacing.18 has this value but no role (foundations/spacing.md) |
| 628 | error | spacing | swap | hardcoded spacing '1.25rem' | spacing.20 (Vertical space between elements in cards +1 more) → var(--mag-spacing-20) |
| 632 | warning | spacing | closest | spacing '1.375rem' is off the scale | closest: spacing.20 (20px) |
| 636 | error | spacing | swap | hardcoded spacing '1.5rem' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 644 | error | spacing | decide | hardcoded spacing '0.0625rem' | no usable token: spacing.1 has this value but no role (foundations/spacing.md) |
| 648 | error | spacing | swap | hardcoded spacing '0.125rem' | spacing.2 (Gap between repeating small elements (tag group) +1 more) → var(--mag-spacing-2) |
| 652 | error | spacing | swap | hardcoded spacing '0.25rem' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → var(--mag-spacing-4) |
| 656 | error | spacing | swap | hardcoded spacing '0.375rem' | spacing.6 (Space between an icon and its text (checkbox, radio button) +4 more) → var(--mag-spacing-6) |
| 660 | error | spacing | swap | hardcoded spacing '0.5rem' | spacing.8 (Space between an icon and its text (checkbox, radio button) +8 more) → var(--mag-spacing-8) |
| 664 | error | spacing | swap | hardcoded spacing '0.625rem' | spacing.10 (Gap between repeating small elements (tag group) +2 more) → var(--mag-spacing-10) |
| 668 | error | spacing | swap | hardcoded spacing '0.75rem' | spacing.12 (Vertical space between elements in cards +5 more) → var(--mag-spacing-12) |
| 672 | warning | spacing | closest | spacing '0.875rem' is off the scale | closest: spacing.12 (12px) |
| 676 | error | spacing | swap | hardcoded spacing '1rem' | spacing.16 (Vertical space between elements in cards +2 more) → var(--mag-spacing-16) |
| 680 | error | spacing | decide | hardcoded spacing '1.125rem' | no usable token: spacing.18 has this value but no role (foundations/spacing.md) |
| 684 | error | spacing | swap | hardcoded spacing '1.25rem' | spacing.20 (Vertical space between elements in cards +1 more) → var(--mag-spacing-20) |
| 688 | warning | spacing | closest | spacing '1.375rem' is off the scale | closest: spacing.20 (20px) |
| 692 | error | spacing | swap | hardcoded spacing '1.5rem' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 696 | error | spacing | swap | hardcoded spacing '1.5rem' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 697 | error | spacing | swap | hardcoded spacing '1.5rem' | spacing.24 (Vertical space between elements in cards +1 more) → var(--mag-spacing-24) |
| 701 | error | spacing | swap | hardcoded spacing '2rem' | spacing.32 (Space between content on the page (top of page and header), page margins and the gap between sections) → var(--mag-spacing-32) |
| 702 | error | spacing | swap | hardcoded spacing '2rem' | spacing.32 (Space between content on the page (top of page and header), page margins and the gap between sections) → var(--mag-spacing-32) |

### `react-text-editor/src/components/extensions/Attachment/components/DragOverlay.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 187 | error | zIndex | decide | raw z-index -10 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |

### `react-text-editor/src/components/extensions/Link/components/BubbleLinkMenu.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 90 | error | zIndex | decide | raw z-index 9999 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |

### `react/src/components/Autocomplete/hooks/useFloatingMultipleAutocomplete.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 142 | error | zIndex | decide | raw z-index 10 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |
| 205 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |

### `react/src/components/Autocomplete/hooks/useFloatingSingleAutocomplete.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 145 | error | zIndex | decide | raw z-index 10 has no token | use the zIndex token for the kind of layer (foundations/z-index.md) |
| 209 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |

### `react/src/components/Menu/hooks/useDropdownMenu.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 211 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |

### `react/src/components/Popover/hooks/useFloatingPopover.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 133 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |

### `react/src/components/SearchInput/hooks/useFloatingSearchInput.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 273 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |

### `react/src/components/Select/Select.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 810 | warning | lineHeight | decide | unitless line height '0' | use a text style (foundations/typography.md) |

### `react/src/components/TagsInput/EditableTagsInputInnerTag.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 20 | error | spacing | swap | hardcoded spacing '4px' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → '4' |
| 32 | error | spacing | swap | hardcoded spacing '4px' | spacing.4 (Space between an icon and its text (checkbox, radio button) +5 more) → '4' |

### `react/src/components/TagsInput/TagsInput.tsx`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 1071 | warning | spacing | decide | unusual spacing value '[-1px]' | see foundations/spacing.md |
| 1071 | warning | spacing | decide | unusual spacing value '[1px]' | see foundations/spacing.md |

### `react/src/components/Tooltip/hooks/useFloatingTooltip.ts`

| Line | Severity | Category | Fix | Found | Suggestion |
|---|---|---|---|---|---|
| 126 | warning | zIndex | swap | raw z-index 1 | zIndex.above for stacking inside a component |
