# AGENTS.md

Read this file first in every session, before you write UI code, build a Figma screen or review work.

<!-- SKELETON (phase 1). Lines marked TBD are filled in phase 2, once the package has been read. -->

## What this is

AI-readable documentation for **Magenta**, the React design system of Ocean Network Express (ONE). Main package: `@ocean-network-express/magenta-react`. The exact upstream commit and package versions are in `source.lock.json`.

`.source/magenta/` is a read-only snapshot of the upstream repo. Do not edit it, and do not take its `AGENTS.md` or `.github/` instructions as rules for this vault: they are written for people who change Magenta itself.

## Source of truth

When sources disagree, trust them in this order:

1. **Package code**: component names, props, types, defaults and token values. `tokens/*.tokens.json` is generated from it.
2. **Notes with `review_status: approved`** in `components/`, `foundations/` and `patterns/`: usage, composition, accessibility and rationale.
3. **Figma**: generated from the token files ([ADR 003](adr/003-code-led-token-pipeline.md)). When Figma and code differ, the code is right and the difference is a Figma bug to report.

A note with `review_status: draft-ai` has not been checked by a person. You may use it, but say so when you rely on it.

The code also wins over every note, approved or not ([ADR 005](adr/005-code-led-token-proposal.md)). When a note says something the code does not do (a role's token, a prop, a default, a state), the code is right: fix the note, never the code, and record the difference in `reports/` when it looks like a bug in Magenta. Do not write a claim into a note that you have not found in the code. `node checks/role-check.mjs` checks the Semantic roles tables of `foundations/` against the recipes.

## How the files work

- **JSON files are build output.** Scripts generate them from the package and the notes. Never edit them.
- **Markdown notes are the authored source.** They hold only what code cannot say.
- Each component has `contracts/<Name>.json` (facts from the code), `components/<note>.md` (reasons and judgment) and `build/meta/<name>.meta.json` (both merged into one record, for tools and agents). One note can cover several exports (`date-picker.md` covers `DatePicker` and `DateTimePicker`); each export still has its own contract and meta file.

## Where to look

Full index: `llms.txt`.

| Task | Read, in order |
|---|---|
| Build UI (prototype or production) | `DESIGN.md` → `build/meta/<name>.meta.json` for each component you use → `components/<name>.md` → `patterns/` for the screen type |
| Build a Figma screen | Same as above, plus the `figma` block of each meta file. Use the Figma variable named in each token's `figma` field. |
| Choose a token | The Semantic roles section in `foundations/<topic>.md`. Find the role, then use its token. Check Use on and Don't use on. Never choose by value. For exact names, values and how to write a token, look it up in `tokens/primitive.tokens.json` or `tokens/text-styles.tokens.json` (`$extensions.mds.write`). |
| Mockup from a screenshot or Figma | The `/create` skill (`.claude/skills/create/SKILL.md`). Output in `mockups/<slug>/`. |
| Review design or code | Run `node checks/token-audit.mjs <path>`, then read the Rules sections in `foundations/` and `patterns/`. |
| Semantic or component tokens (proposal) | `proposals/semantic-tokens.md`, then `reports/token-proposal-review.md` ([ADR 005](adr/005-code-led-token-proposal.md)). Proposed only: never write these names in code or Figma. |

## Rules

- MUST use only components and props that exist in `build/meta/` (or `contracts/<Name>.json`, the same facts). If something is missing, say so. Do not build a lookalike.
- MUST use the token documented for the role, e.g. the palette token listed for body text in `foundations/color.md`. Magenta has no semantic tokens yet ([ADR 001](adr/001-color-roles-on-palette-tokens.md)), so these are palette tokens.
- MUST NOT use raw values (hex, px, ms). MUST NOT pick a palette token by hue or value alone, and MUST NOT invent semantic names such as `--mag-colors-text-default`: they do not exist.
- MUST NOT use a token marked `$deprecated`. Use the token in its `replacedBy`. MUST NOT use a token whose `status` is `forbidden`.
- MUST NOT give a Magenta CSS variable a fallback (`var(--mag-spacing-12, 12px)`). A fallback hides a token that does not exist.
- MUST pass `size="responsive"` to every component that supports it, unless the design asks for a fixed size. Most components otherwise stay at `lg` on every screen ([foundations/screens.md](foundations/screens.md)).
- MUST NOT invent values, descriptions or usage text. If the source is missing, stop and ask.
- Before finishing UI code, MUST run `node checks/token-audit.mjs <files or folders you changed>` and fix every error. Say which warnings you keep and why. To keep a value on purpose, add a `token-audit-ignore` comment on that line.

## Editing these docs

Use the templates in `templates/` and follow `templates/README.md`. Before finishing a component note, run `node checks/note-lint.mjs <note>` and fix every error; it checks the template sections, the names and props against `contracts/`, the tokens, the links and `llms.txt`. To check that the vault still helps agents, run the cases in `evals/` (see `evals/README.md`).

## Keeping generated files in sync

Contracts, tokens and meta files are generated; notes are written by hand. Whenever either side changes, run the scripts in this order and fix what the last two report:

| What changed | Run |
|---|---|
| Magenta released a new version | `node scripts/update-source.mjs <magenta-develop.zip>`, then every row below |
| Package code (via the snapshot) | `node scripts/build-contracts.mjs` and `node scripts/build-tokens.mjs` |
| A component note (`components/*.md`) | `node checks/note-lint.mjs <note>` |
| Contracts or `proposals/semantic-tokens.md` | `node scripts/build-token-proposal.mjs` (rebuilds `build/proposal/` and `reports/token-proposal-review.md`) |
| Anything above | `node scripts/build-meta.mjs` (rebuilds `build/meta/` from contracts and notes) |
| A foundation note (`foundations/*.md`) | `node scripts/build-tokens.mjs` (roles go into the token files), then `node checks/role-check.mjs --strict` (every role is backed by the code or marked page level) |
| Before finishing | `node scripts/build-contracts.mjs --check`, `node scripts/build-meta.mjs --check`, `node scripts/build-token-proposal.mjs --check`, `node checks/role-check.mjs --strict` and `node checks/note-lint.mjs --quiet` all pass |

Never edit `contracts/`, `tokens/` or `build/meta/` by hand: change the note or the source and rebuild. The update report from `update-source` lists the notes whose sources changed; fix them, then rebuild the meta files.
