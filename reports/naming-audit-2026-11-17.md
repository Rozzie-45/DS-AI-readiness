# Naming audit · 2026-11-17

**Library type:** design system
**Covers:**
- Components: 167 value exports from the barrels of `magenta-react` (121), `-dates` (19) and `-text-editor` (27).
- Storybook pattern hierarchy.
- Token naming is cited from [token-audit-2026-11-16](token-audit-2026-11-16.md). `component-api-validator` (prop naming) has not been run.

**Convention documentation:**
- Partial. The only written rules are in `developer-notes/CODE_REVIEW_CHECKLIST.md:35-40`: PascalCase components, file names consistent with component names, hooks start with `use`.
- Everything else below is derived from the inventory.

Paths are relative to `.source/magenta/packages/`. `index.ts` means `react/src/components/index.ts` unless another package is named.

## Summary

Naming is mostly consistent. Most exports follow one clear pattern: a PascalCase family prefix plus the part (`AccordionItem`, `DialogHeader`, `PopoverTrigger`). The 16 component findings below cover 34 of the 167 exported names. Nobody is misled into building the wrong thing.

The problems are local, and none is a 🔴. They cluster in three places:
1. **Families that broke the prefix rule:** Table's HTML-style aliases, `HelperText`, `TreeItem`.
2. **Pairs a consumer cannot tell apart by name:** `Menu` and `DropdownMenu`, `Banner` and `InlineBanner`, `SingleDateRangeCalendar` and `DualCalendar`.
3. **Enum-like constants exported in PascalCase,** so they look like components. Even this vault's own contract script took them for components.

The most important finding is NA-02 (`Menu` / `DropdownMenu`). Agents and people choose the wrong one.

## Convention inventory

| Convention | Dominant (derived) | Divergent |
|---|---|---|
| Casing | PascalCase components, `use*` hooks | `message` (lowercase function, `index.ts:85`); constant objects in PascalCase (NA-07) |
| Family naming | `<Family><Part>`: `AccordionItem`, `CarouselSlide`, `DrawerHeader`, `MenuItem`, `TimelineItem` | `Td`, `Th`, `Tr`, `Tbody`, `Thead`, `Tfoot`; `HelperText`; `TreeItem` |
| Overlays | `<X>` + `<X>Trigger` + `<X>Content` (Popover, Tooltip) | Menu family: `DropdownMenu` + `DropdownMenuTrigger` + `Menu` |
| Abbreviations | Full words | Table aliases |
| Number | Singular | `FeedbackMessages` |
| Date components | `<Unit>Picker`, `<Unit>RangePicker`, `<Unit>Calendar`, with Unit a noun (`Month`, `Week`, `Time`) | `Quarterly*` (adjective) |
| Editor | `<Feature>Controller` paired with `<Feature>Extension` | `NumberedListController` / `NumberListExtension` |
| Spelling | `resizable` (Textarea variant) | `Resizeable`, `ResizeableHandle` |

## Component findings

| ID | Name | Evidence | Issue | Rename suggestion | Severity |
|---|---|---|---|---|---|
| NA-02 | `Menu`, `DropdownMenu` | `index.ts:130,134` | `DropdownMenu` is the root that holds the open state; `Menu` is only the surface (`components/menu.md:50`). By name, `Menu` sounds like the whole component, so people render `Menu` alone and get no trigger behaviour. Popover and Tooltip already use `<X>Content` for the surface. | `Menu` → `DropdownMenuContent`, if `Menu` is never used without `DropdownMenu`. If it is also used standalone (side menus), keep `Menu` and document the split. | 🟠 |
| NA-03 | `Banner`, `InlineBanner` | `index.ts:75,83` | `InlineBanner` has an `inline` prop (and `sticky`) that `Banner` lacks, so `<InlineBanner inline={false}>` is possible and the name no longer says what it renders. | Keep `InlineBanner` and drop or rename the `inline` prop, or merge into `Banner` with a `placement` prop. | 🟠 |
| NA-11 | `SingleDateRangeCalendar`, `DualCalendar` | `react-dates/src/components/index.ts:8,18` | "Single" and "Range" read as opposites. `DualCalendar` does not say it picks a range. The real difference is one month versus two (`components/calendar.md:53,82`). | `DateRangeCalendar` (one month) and `DualDateRangeCalendar` (two months) | 🟠 |
| NA-01 | `Tbody`, `Td`, `Tfoot`, `Th`, `Thead`, `Tr` | `index.ts:183-193` (aliases of `TableBody`, `TableCell`…) | Abbreviated HTML tag names inside a family whose other members are spelled out (`Table`, `TableContainer`). The recipes use the full names (`tableCell`, `tableRow`). Probably deliberate (Chakra style). | Also export `TableBody`, `TableCell`, `TableHeaderCell`, `TableRow`, `TableHeader`, `TableFooter`; keep the short aliases as documented shorthands | 🟡 |
| NA-04 | `HelperText` | `index.ts:104` | Its siblings are `InputContainer` (`:106`) and `InputLabel` (`:108`); this one has no prefix. Its recipe is `inputHelperText`, and a `CompactHelperText` also exists. | `InputHelperText` | 🟡 |
| NA-05 | `TreeItem` | `index.ts:235` | Its family root is `TreeView` (`:238`) and its recipe is `treeViewItem`. | `TreeViewItem` | 🟡 |
| NA-06 | `FeedbackMessages` | `index.ts:81` (alias of `FeedbackMessage`) | Plural component name. Its own types are singular: `FeedbackMessageProps`, `FeedbackMessageType`. | `FeedbackMessage` | 🟡 |
| NA-07 | `FeedbackMessageColor`, `FeedbackMessagePosition`, `FeedbackMessageType`, `InlineEditChangeModeReason`, `AllowedProtocols` | `index.ts:78,79,82,95`; `react-text-editor/src/components/index.ts:20` | Constant objects exported in PascalCase look like components. Evidence: `scripts/build-contracts.mjs` lists them as components with "No props type". | Keep the name for the type, export the object in camelCase (`feedbackMessageColors`), or use a `const enum`-style suffix such as `FeedbackMessageColors` | 🟡 |
| NA-08 | `message` | `index.ts:85`; `FeedbackMessages/FeedbackMessage/state.ts:107` | A one-word lowercase export that shows a toast by default. It shadows the most common local variable name (`const message = …`). | `showMessage`, or `feedback.message` | 🟡 |
| NA-09 | `Resizeable`, `ResizeableHandle` | `index.ts:157,158` | Uses a different spelling from the system's own `resizable` variant on Textarea. | `Resizable`, `ResizableHandle` | 🟡 |
| NA-10 | `QuarterlyPicker`, `QuarterlyRangePicker`, `QuarterlyCalendar`, `QuarterlyRangeCalendar` | `react-dates/src/components/index.ts:14,16,53,58` | An adjective where every sibling uses a noun (`MonthPicker`, `WeekPicker`). | `QuarterPicker`, `QuarterRangePicker`, `QuarterCalendar`, `QuarterRangeCalendar` | 🟡 |
| NA-12 | `NumberListExtension` | `react-text-editor/src/components/index.ts:48` | Its controller is `NumberedListController` (`:46`), and every other Controller/Extension pair matches. | `NumberedListExtension` | 🟡 |
| NA-13 | `ButtonController`, `MenuItemController` | `react-text-editor/src/components/index.ts:3,5` | Read like controllers for `Button` and `MenuItem` from magenta-react. They are toolbar building blocks for custom controllers. | `ToolbarButtonController`, `ToolbarMenuItemController` | ⚪ |
| NA-14 | `CompactWrapper`, `CalendarWrapper` | `index.ts:49`; `react-dates/src/components/index.ts:1` | "Wrapper" names the structure, not the job. `CompactWrapper` joins a field with a select or button into one control. | `CompactWrapper` → `InputGroup`; leave `CalendarWrapper` if it is internal-facing | ⚪ |
| NA-15 | `FormCheck` | `index.ts:89` | A Bootstrap term. It is the label and helper-text group around checkboxes or radios. | `ChoiceGroup` | ⚪ |
| NA-16 | `Segmented` | `index.ts:163` | An adjective used as a component name. The common name is "segmented control". | `SegmentedControl` | ⚪ |

Checked and not flagged:
- `TabColorPicker` really is a color picker for a tab group.
- `ImageBase` is the image without the figure, aspect ratio and caption of `Image`. "Base" is generic but accurate.
- `Modal` and `Dialog` do not coexist. `NonModalDialog` is explicit.

## Pattern findings

Storybook pattern titles (`docs/stories/Developments/**`, `docs/stories/Patterns/**`):

| ID | Pattern | Evidence | Issue | Suggestion | Severity |
|---|---|---|---|---|---|
| NA-17 | "List & Detail", "Master & Detail" | `Pattern/CRUD Patterns/C. List & Detail`, `…/D. Master & Detail` | Two names that describe the same parts and cannot be told apart. The difference (detail in a dialog versus an expandable table) is only in the sub-stories. | Name by the task: "Edit a record in a dialog" and "Edit child records in place", or keep the names and add the distinction to the titles | 🟡 |
| NA-18 | Form and Page Header in several places | `Pattern/Layout & Navigation/Forms`, `Form (*Section Pattern)`, `Forms`, folder `Patterns/NewFormPattern`; `Page Header` and `Page Header (*Section Pattern)` | The same pattern is filed under two titles and two folders (`Developments/` and `Patterns/`). "New" in a folder name will age. | One title per pattern under `Pattern/`; rename the folder `NewFormPattern` to `Forms` | 🟡 |
| NA-19 | "Search & Form", "Search & Table" | `Pattern/CRUD Patterns/A.`, `B.` | Assembly names. They are distinct enough, so this is low. | Optional: "Search, then edit in a form" and "Search, then edit in the table" | ⚪ |

## Neighbouring reports

- **token-audit 2026-11-16:**
  - TA-04: mixed units in the spacing and sizes scales;
  - TA-07: role names in the primitive tier (`primary`, `secondary`, `background-overlay.50`).

  Token names otherwise follow one kebab and dot convention.
- **component-api-validator:** not run. Prop naming is not covered here, for example `state` versus `color` for status, and `isOpen` versus `open`.

## Recommendations

1. **Write the derived conventions down.** Add a "Naming" section to `CODE_REVIEW_CHECKLIST.md` (or an ADR) that covers:
   - the family prefix;
   - the Trigger and Content pair for overlays;
   - nouns for date units;
   - full words;
   - camelCase for constant objects.
2. **New components follow it from now on.** Renames come later.
3. **Rename in severity order:** NA-02, NA-03 and NA-11 first. Each rename ships the new name with the old one kept as a deprecated alias for at least one minor version.
4. **Treat every rename as a breaking change for consumers.** Announce it with a migration note (the `change-communication` skill). In this vault, the update report from `update-source` flags the changed exports, and `build-contracts` picks up the new names.

## Scope

- **Inspected:**
  - the three package barrels: `react/src/components/index.ts`, `react-dates/src/components/index.ts`, `react-text-editor/src/components/index.ts`;
  - `react/src/utils/index.ts` (re-exports);
  - Storybook titles under `docs/stories/Developments` and `docs/stories/Patterns`;
  - `developer-notes/CODE_REVIEW_CHECKLIST.md`;
  - the vault's contracts and component notes, for meaning.
- **Not inspected:**
  - Figma layer and component names (that is `figma-variable-audit` and the Figma library);
  - `react-icons` names;
  - internal, non-exported components;
  - prop names.
- **Assumptions:** the derived conventions above are the intended ones. NA-01 may be a deliberate choice.

> **A note on context:** This audit checks naming patterns against common conventions. It does not know why a name was chosen. Some inconsistencies may be deliberate distinctions. If any finding flags a naming choice your team made on purpose, say so and future runs will skip it. The goal is to catch accidental inconsistency, not to override deliberate decisions.
