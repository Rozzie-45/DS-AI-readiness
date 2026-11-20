# Evals

Tests that show whether an agent builds correct Magenta UI **with this vault**, and whether a change to the vault makes it better or worse.

Each case is a task written as an intent, without naming the components, so the agent has to choose them from the notes. A script scores what it can check mechanically; a person scores the rest with the case's rubric.

## Files

| Path | What |
|---|---|
| `cases/<id>.json` | One case: `prompt`, the `notes` that should answer it, what to `expect`, what it `mustNot` do, what it `requires`, and a `rubric` for a person |
| `check.mjs` | Scores one run: `node evals/check.mjs <case-id> <file.tsx>` |
| `runs/<case-id>/<label>.tsx` | The code an agent produced, kept to compare runs over time |
| `runs/RESULTS.md` | Scores of the latest runs, with and without the vault |

## Cases

| Case | Intent | Main notes |
|---|---|---|
| `delete-confirm` | Delete a booking after confirming | dialog, button, icon-button |
| `create-form` | Create a booking: text, number, type, date | input, number-input, select, date-picker |
| `table-filter` | Shipments table with search and pages | table, search-input, pagination |
| `save-error` | Tell the user a save failed or worked | feedback-messages |
| `date-range-filter` | Filter voyages between two dates | date-range-picker, calendar |

## How to run a case

1. Start a fresh agent session in this vault (so it reads `AGENTS.md`). Give it the case's `prompt` and: "Write one React component in `evals/runs/<case-id>/<label>.tsx`. Follow AGENTS.md."
2. Score it:

   ```bash
   node evals/check.mjs date-range-filter evals/runs/date-range-filter/with-vault.tsx
   ```

3. Score the rubric by hand (0–2 per line) and note it next to the run.
4. To measure the vault itself, run the same prompt in a session that cannot read the vault (only the package names) and compare the scores.

## What the script checks

| Group | Check |
|---|---|
| imports | Every component or icon imported from a Magenta package exists (no `TextField`, `Modal`, `Badge`) |
| expect | The expected components are used (imported from a Magenta package and rendered) |
| mustNot | No forbidden pattern: raw `<button>`/`<input>`, the wrong component for the situation |
| requires | Required props or workarounds from the notes are present |
| props | Every prop on a Magenta component exists in its contract, with an allowed value |
| size | `size="responsive"` on every component that supports it (AGENTS.md) |
| tokens | `checks/token-audit.mjs` finds no raw values or invented tokens |

## Adding a case

Write the prompt as a user would ask, never naming a component. Put in `expect` only what the notes clearly decide; when several components fit (the Decision Tree allows Segmented, Radio or Select for 4 options), list them in an `anyOf` group. Every `mustNot` and `requires` entry says why, citing the note.
