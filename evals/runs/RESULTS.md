# Eval results · 2026-11-10

Five cases, each run twice with the same model (Sonnet): once in a session that read the vault through `AGENTS.md`, once from the model's own knowledge with only the package names. Scored with `node evals/check.mjs <case> <file>`.

| Case | With vault | Without vault | Main mistakes without the vault |
|---|---|---|---|
| delete-confirm | 10/11 | 7/13 | Imports `Modal`, `Typography`, `TrashIcon` (none exist); no `Dialog`; `Button variant="primary"/"secondary"` (do not exist); no `color="danger"` |
| create-form | 14/14 | 9/25 | Imports `TextField`, `NumberField`, `SelectItem` (do not exist); React Aria style props (`isRequired`, `isInvalid`, `errorMessage`, `selectedKey`); no `size="responsive"` |
| table-filter | 10/10 | 4/10 | Imports `TextField`, `Badge` (do not exist); `<Pagination pageCount>`; no `Th` |
| save-error | 9/9 | 6/14 | `<Alert variant>` (no such prop); no red color for the error; no `size="responsive"` |
| date-range-filter | 10/10 | 6/12 | `isDateUnavailable` (no such prop); `Button variant="secondary"`; no `aria-labelledby` workaround; no helper text |
| **Total** | **53/54 (98%)** | **32/74 (43%)** | |

The only miss with the vault: in delete-confirm the row's delete `IconButton` has no `size="responsive"`.

## What the runs fixed in the tools

Reading the failures showed four false results; each was fixed and every run re-scored:

- `contracts/TagContent.json` listed the props of `Tag` (both live in `Tag.tsx`); `scripts/build-contracts.mjs` now reads the props type from the component's own declaration. `TagContent` takes only `<div>` attributes.
- `contracts/InlineBanner.json` listed only `secondary` and `grey` for `color`; the script now follows spreads in const objects (`...FeedbackMessageColor`), giving all seven colors.
- `check.mjs` now follows inherited props written as `XProps` (`NumberInput` takes the `Input` props), skips `size` on parts that take it from their parent (`ListItemText`), and checks prop values only against the prop's own type.
- `save-error` now accepts an `InlineBanner` next to the form as well as an alert, as the FeedbackMessages note says.

Rubric scores (by hand) are not filled in yet.
