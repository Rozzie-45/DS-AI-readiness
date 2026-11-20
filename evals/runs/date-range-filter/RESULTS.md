# date-range-filter · 2026-11-10

Same prompt, same model (Sonnet), two sessions: one read the vault through AGENTS.md, one worked from its own knowledge only.

| Run | Mechanical | Rubric (0–2 each) | What went wrong |
|---|---|---|---|
| `with-vault.tsx` | 10/10 | 5/6 | Label "Departure date" names the field, not quite the period ("Departure between") |
| `without-vault.tsx` | 6/12 | not scored | Invented prop `isDateUnavailable`; `Button variant="secondary"` (does not exist); no `size="responsive"`; no `aria-labelledby` workaround, so the inputs keep the generic names; no helper text |

The run with the vault used the workaround from [date-range-picker.md](../../../components/date-range-picker.md) (`startInputProps`/`endInputProps` with `aria-labelledby`) and the Figma advice to state the range in `helperText`.

Scores updated after the scorer gained the imports check; see [../RESULTS.md](../RESULTS.md).
