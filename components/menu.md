---
type: component
component: "Menu"
description: "A menu display a set of selectable actions or options."
category: navigation
status: draft
figma_url: "https://www.figma.com/design/m5GWvQiv67rsNlBinvOqlR/Magenta-Design-System---AI?node-id=6087-102033"
alternatives:
  - Select
  - List
related:
  - DropdownMenu
  - DropdownMenuTrigger
  - MenuHeader
  - MenuBody
  - MenuList
  - MenuItem
  - MenuFooter
  - CollapsibleMenuItem
  - List
  - Button
can_contain:
  - MenuHeader
  - MenuBody
  - MenuFooter
cannot_contain: []
required_children:
  - MenuBody
a11y_role: menu
deprecated_by: ""
deprecated_since: ""
sources:
  - packages/docs/stories/Components/Menu/Design.mdx
  - packages/docs/stories/Components/Menu/Code.mdx
  - packages/docs/stories/Components/Menu/Examples
  - packages/react/src/components/Menu
  - packages/css/src/recipes/Menu
  - packages/css/src/recipes/popover.ts
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Menu

## Overview

A temporary surface with a list of actions or options. It opens when the user interacts with a trigger, usually a button, and closes after a choice. A menu has an optional header (a title and an action), one or more lists of items, and an optional footer with actions. Its items are list items ([List note](list.md)).

The family: `DropdownMenu` (holds the open state), `DropdownMenuTrigger` (the control that opens it), `Menu` (the surface), `MenuHeader`, `MenuBody`, `MenuList`, `MenuItem`, `MenuFooter`, and `CollapsibleMenuItem` for items that expand in place.

## When to use

- A set of actions or options the user opens from a button or another control.
- Options sorted into categories: a grouped menu.
- Structured content with subcategories: a nested-collapsible menu.
- Sub-options that open beside an item: a branched menu.
- A long list the user filters by typing, with an optional "Select all": a searchable menu.

## When not to use

- Choosing the value of a form field. Use `Select`.
- A list that stays on the page rather than opening from a trigger. Use `List`.

## Why this design

### Trade-offs

## Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| A value the user picks in a form | `Select` | A `DropdownMenu` that writes into a field |
| Items always shown on the page | `List` | A `Menu` that is always open |
| Sub-options that stay in the same panel | `CollapsibleMenuItem` | A branched menu |

## Anatomy

| # | Part | Required | Description |
|---|---|---|---|
| 1 | Menu container | yes | The temporary surface (`Menu`), opened by a `DropdownMenuTrigger`. |
| 2 | Menu header | no | The menu's title and an extra action, a search field, a "Select all" or a switch (`MenuHeader`). |
| 3 | List of options | yes | `MenuBody` holding one or more `MenuList`s. |
| 4 | List item | yes | One action or option (`MenuItem`), built like a list item. |
| 5 | Footer | no | Extra actions, aligned right (`MenuFooter`). |

## Composition

- A pop-up menu: `<DropdownMenu><DropdownMenuTrigger><Button>…</Button></DropdownMenuTrigger><Menu>…</Menu></DropdownMenu>`. Use a button as the trigger. Without `DropdownMenu`, `Menu` renders in place.
- Inside `Menu`: an optional `MenuHeader`, then `MenuBody` with `MenuList`s of `MenuItem`s, then an optional `MenuFooter`.
- A `MenuItem` holds a `ListItemText`, with icons, a checkbox or an avatar in `ListItemIcon`s, as in the [List note](list.md). Give it `item={{ label, value }}` so the `Menu`'s `onItemClick` receives the item, or handle `onClick` on the item.
- The menu closes after an item is chosen. For a menu where the user picks several items (checkboxes), set `closeOnItemClick={false}` on `DropdownMenu` and put Reset and Apply in the footer.
- Checkbox items: a `Checkbox` with `readOnly` and `tabIndex={-1}` in a `ListItemIcon` before the text.
- Grouped menu: a `ListSubheader` before each group inside a `MenuList`, or one `MenuList` per group inside `MenuBody`. `columns` on `Menu` lays the `MenuList`s side by side, 16px apart.
- Branched menu: wrap the `MenuItem` in its own `DropdownMenu` and `DropdownMenuTrigger`, with a `ChevronRightOutline` in a `ListItemIcon` after the text, and put the child `Menu` next to the trigger. The child opens on hover or Right Arrow, to the right (`right-start`). The child `Menu` keeps the component's `shadows.lg`, the same as its parent (team decision, 2026-11-10: follow the code).
- Nested-collapsible menu: `CollapsibleMenuItem` with `label={<ListItemText primaryText="…" />}` and the sub-items as children. Each level is indented further. The chevron points right and turns down when open; `collapseIcon` changes it.
- Levels (team decision, 2026-11-10): the second level of a menu is a nested-collapsible group; from the third level, branch into a child menu.
- Header:
  - Default: the title as text, and an optional action as a ghost primary `Button`.
  - Searchable: an `Input` with `leftContent={<SearchOutline />}` that filters the items. Not `SearchInput`, which has its own dropdown ([SearchInput note](search-input.md)).
  - Selection: a "Select all" `Checkbox` (indeterminate when only some items are checked) and a ghost primary "Reset" `Button`.
  - Switch: the title and a `Toggle`.
- Footer: a ghost primary `Button` for the secondary action, then a fill primary `Button` for the main one ([Button note](button.md)).
- Empty, loading or error lists: `ListEmpty` or `ListLoading` inside `MenuBody` ([List note](list.md)).
- Long menus: `className={css({ maxHeight })}` on `Menu`. `MenuBody` scrolls; the header and footer stay fixed.
- Placement: `bottom-start` below the trigger by default; `placement` changes it. `caret` adds a caret pointing at the trigger.

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| Open | Click, Enter, Space, Down Arrow or Up Arrow on the trigger | Focus moves to the first item. A branched menu also opens on hover or Right Arrow. |
| Closed | Choosing an item, Escape, a click outside | Focus returns to the trigger. `closeOnItemClick={false}` keeps it open after a choice. |
| Controlled | `open` with `onOpenChange` on `DropdownMenu` | Your code opens and closes it. |
| Item hover | Pointer over an item | Background `colors.neutral.100`. |
| Item highlighted | Arrow keys | An inset 1px ring in `colors.primary.300`. |
| Item with an open child menu | A branched item whose menu is open | Background `colors.neutral.100`. |
| Active item | `active` on `MenuItem` | Text and icons `colors.primary.500`. |
| Selected item | `selected` on `MenuItem` | Background `colors.primary.100`, semi-bold text. |
| Disabled item | `disabled` on `MenuItem` | Text `colors.neutral.500`; skipped by the keyboard. |
| Collapsible item open | Click or Enter on a `CollapsibleMenuItem`, or `open` | Its sub-items slide down; the chevron turns 90°. |

## Accessibility

### Keyboard

- On the trigger: Down Arrow, Up Arrow, Space or Enter opens the menu and moves focus to the first item.
- In the menu: Up and Down Arrow move between items; Home and End go to the first and last; Space or Enter chooses the item; a letter moves to the next item starting with it; Escape closes the menu.
- On a branched item: Right Arrow opens its menu and focuses the first item; Left Arrow closes it and returns focus to the item.

### Accessible name

The trigger is named by its button label and has `aria-haspopup`, `aria-expanded` and `aria-controls`. `Menu` has `role="menu"`; each `MenuItem` has `role="menuitem"` and is named by its text.

### Focus

Opening moves focus into the menu; closing returns it to the trigger. The highlighted item shows an inset ring in `colors.primary.300`.

### Contrast pairs

| Foreground token | Background token | Min ratio |
|---|---|---|
| `colors.neutral.900` | `colors.white` | 4.5 |
| `colors.neutral.900` | `colors.neutral.100` | 4.5 |
| `colors.neutral.900` | `colors.primary.100` | 4.5 |
| `colors.primary.500` | `colors.white` | 4.5 |

## Content

- Header title: names what the menu holds, such as "Filter".
- Item labels: short, starting with the key word.
- Footer actions: a verb each, such as Reset and Apply.

## Do and don't

| Don't | Do |
|---|---|
| A menu that changes a form field's value | `Select` |
| A branched child menu at the second level | A nested-collapsible group at the second level; branch from the third |
| A checkbox menu that closes after each click | `closeOnItemClick={false}`, with Reset and Apply in the footer |
| `SearchInput` in the menu header | `Input` with a search icon that filters the items |
| Two fill buttons in the footer | Ghost for the secondary action, fill for the main one |

## Component tokens

## Figma to code mapping

Figma sets on the Menu page of the library. Confirmed by the team on 2026-11-05. The usage documentation in Figma is the frame "Menu-Document-Overview" (node `6087:102033`). Its header specs and item sizes match code; its footer spec does not (see Open questions).

| Figma property | Figma value | Code prop | Code value |
|---|---|---|---|
| Menu List_ver 2 | any | — | `Menu` with `MenuBody`, `MenuList` and `MenuItem`s; inside `DropdownMenu` when it opens from a trigger |
| Menu List_ver 2 · Type | Default / Checkbox / Avatar | — | items of that type, as for List item-base · Type ([List note](list.md)) |
| Menu List_ver 2 · Header | True | — | a `MenuHeader` |
| Menu List_ver 2 · Footer | True | — | a `MenuFooter` |
| Menu List_ver 2 · Size | Large / Medium / Small | `size` on `Menu` | `"responsive"`. The Figma size shows the frame's viewport; use `"lg"` / `"md"` / `"sm"` only when the design asks for a fixed size. |
| _Menu List | any | — | The old version of Menu List_ver 2: map it the same way, but do not place it in new Figma designs |
| _Menu List · Show scroll | true | `className` on `Menu` | `css({ maxHeight })`; in Figma, set a maximum height on a Menu List_ver 2 instance |
| Menu header · Title | text | `children` | the title |
| Menu header · Actions | true | — | a ghost primary `Button` in the `MenuHeader` |
| Menu header · Type | Default / Searchable / Selection / Switch | — | the header compositions (Composition) |
| Menu footer · Sec button / Pri button | true | — | `Button variant="ghost"` / `Button` (fill), both primary, in the `MenuFooter` |
| Menu-horizontal group | any | `columns` on `Menu` | `true`, with one `MenuList` per group |
| Swap slot menu · Swap slot | instance | — | the custom content inside `MenuBody` |
| Branched menu item | any | — | a `MenuItem` inside its own `DropdownMenuTrigger`, with a `ChevronRightOutline` after the text |
| Branched menu item · Left-icon, Swap left icon | true, icon instance | — | the icon in a `ListItemIcon` before the text |
| Branched menu item · Open / State Active | True / Active | — | its child menu is open: an interaction; the item's background is drawn by the component |
| Branched menu item · Active | True | `active` | `true` |
| Nested list item (List page) | any | — | `CollapsibleMenuItem` |
| Nested list item · Open | True | `open` | an interaction; use `open` with `onOpenChange` only to control it |
| Nested list item · Type | Checkbox | — | a `Checkbox` in the `label` |
| Nested list item · Active | True | `active` | `true` |
| Nested list item · DnD handle | true | — | Not in code: Figma only |
| Menu list item-loading / no-data / error | any | — | `ListLoading` / `ListEmpty` in `MenuBody` ([List note](list.md)) |
| Data table overflow menu item, table overflow menu, _table dropdown menu | any | — | Table menus: the row action menu is in the [Table note](table.md); the header sort and filter menus are in the [sort and filter pattern](../patterns/data-table-sort-filter.md) |
| Tag group menu button | any | — | `TabListGroup` menu ([Tab group note](tab-group.md)) |

## Open questions

1. Resolved 2026-11-10 (team, [known issues](../reports/known-issues-2026-11-10.md) Q1): the Why this design section stays empty. Question was: Why this design and its trade-offs: the docs give none.
2. Resolved 2026-11-10 (team, [known issues](../reports/known-issues-2026-11-10.md) Q7): the second level is nested-collapsible; branch from the third level. Question was: The Figma documentation shows a branched menu but says nothing about when to use it instead of a nested-collapsible menu.
3. Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) B12): Specs: the Figma footer has 8px top padding at every size; code uses 8 / 6 / 4 (lg / md / sm). The note follows code.
4. Upstream, for the Magenta team:
   - Resolved 2026-11-10 (follows the code; [known issues](../reports/known-issues-2026-11-10.md) Q18): child menus keep the same `shadows.lg` as their parent.
   - `CollapsibleMenuItem` puts `role="button"` and `aria-expanded` on the chevron icon, not on the item.
   - The `placement` description says the default is `bottom`; the code uses `bottom-start` (and `right-start` for a child menu).
5. For the design team: the old `_Menu List` set is still on the Menu page; Menu List_ver 2 replaces it.

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-11-05 from contracts/Menu.json, MenuItem.json, DropdownMenu.json, DropdownMenuTrigger.json and the Menu models (scripts/build-contracts.mjs). CollapsibleMenuItem props read from MenuItem.model.ts; DropdownMenu defaults from useDropdownMenu.ts; sizes from the Menu recipes. Replaced by build/meta in phase 3. -->

### Props

`Menu` (also accepts the attributes of `<div>`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `boolean` |  | Whether the menu should be displayed in columns |
| `onItemClick` | `(item?: MenuOption) => void` |  | Callback function when a menu item is clicked |
| `size` | `'sm' \| 'md' \| 'lg' \| 'responsive'` | `lg` | Size of the menu items |

`MenuItem` (also accepts the props of `ListItem`: `active`, `disabled`, `selected`…)

| Prop | Type | Default | Description |
|---|---|---|---|
| `item` | `MenuOption` (`{ label: string; value?: string }`) |  | Menu option details |

`CollapsibleMenuItem` (also accepts the props of `MenuItem`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `React.ReactNode` |  | Label of the collapse menu item (required) |
| `collapseIcon` | `React.FC` | `ChevronRightOutline` | Custom collapse icon |
| `onOpenChange` | `(open: boolean) => void` |  | Callback function when the open state changes |
| `open` | `boolean` |  | Whether the collapse menu item is open |

`DropdownMenu`

| Prop | Type | Default | Description |
|---|---|---|---|
| `caret` | `boolean` | `false` | Whether the menu should be displayed caret |
| `children` | `React.ReactNode` |  | Children elements to be rendered inside the dropdown menu |
| `closeOnItemClick` | `boolean` | `true` | Whether the menu should close when an item is clicked |
| `dropdownConfig` | `Omit<DropdownConfig, 'placement'> & { placement?: Placement }` |  | Configuration for the dropdown (`strategy` `absolute` by default) |
| `id` | `string` |  | ID of the dropdown menu |
| `onOpenChange` | `(open: boolean, event?: Event, reason?: …) => void` |  | Callback function when the open state changes |
| `open` | `boolean` |  | Whether the dropdown menu is open |
| `placement` | `Placement` | `bottom-start` (`right-start` for a child menu) | Placement of the dropdown menu. |
| `returnFocus` | `boolean` | `true` (`false` for a child menu) | Whether the menu should return focus to the trigger element |

`DropdownMenuTrigger` (also accepts the attributes of `<button>`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `containerRef` | `React.RefObject<HTMLElement>` |  | Reference to the container element |

`MenuHeader`, `MenuBody` and `MenuFooter` accept the attributes of `<div>`; `MenuList` accepts the props of `List`.

### Sizes

From the `menu`, `menuHeader`, `menuFooter` and `menuBody` recipes. Item sizes are those of `ListItem` ([List note](list.md)).

| Size | Menu padding y | Header padding x / bottom | Header gap | Header text (`fontSizes` / `lineHeights`) | Footer padding x / top | Footer gap | Footer min height |
|---|---|---|---|---|---|---|---|
| `sm` | 6 | 6 / 8 | 6 | xs / md | 6 / 4 | 6 | 24 |
| `md` | 8 | 8 / 8 | 8 | sm / lg | 8 / 6 | 8 | 32 |
| `lg` | 12 | 12 / 8 | 12 | md / 2xl | 12 / 8 | 12 | 40 |
| `responsive` | `sm` under 1280px, `md` from 1280px, `lg` from 1920px | | | | | | |

`columns`: 16 between lists.

### Colors

Container `white`, radius `radii.lg`, shadow `shadows.lg` (child menus too), layer `zIndex.menu`. Header text semi-bold. Footer top border `borders.1` `colors.neutral.200`. Items: hover `neutral.100`, highlighted inset ring `primary.300`, item with an open child menu `neutral.100`, active `primary.500`, selected `primary.100`, disabled `neutral.500`. Stories: `packages/docs/stories/Components/Menu/Menu.stories.tsx#Playground`.
<!-- GENERATED:END -->
