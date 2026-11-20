# Templates

How the documentation in this vault is organized, and how to fill in each template.

## The one rule

**Markdown notes are what people write. JSON files are what scripts build.**

- If you can see it in Obsidian, you can edit it.
- JSON files (`tokens/`, `build/`, `contracts/`) are generated. Hand edits are overwritten on the next build.
- Facts the code already knows (props, types, defaults, token values) are never typed by hand. Notes hold only what the code cannot say: when to use something, why it is designed that way, how it combines with other parts, and what accessibility needs.

## Folder layout

| Folder | Contents | Written by |
|---|---|---|
| `AGENTS.md`, `DESIGN.md` | Rules for agents; design language | People |
| `components/` | One note per component | People (AI drafts allowed) |
| `foundations/` | Color, typography, spacing…, each with its Primitive tokens and Semantic roles tables | People (AI drafts allowed) |
| `patterns/` | Layouts, flows, choosing between components | People (AI drafts allowed) |
| `adr/` | Decisions and their reasons | People |
| `templates/` | These templates and examples | People |
| `schemas/` | JSON Schemas for the build output | People |
| `contracts/` | One JSON per component with what the code knows: props, options, recipes, the token of each style; plus the Figma library's component sets | `scripts/build-contracts.mjs`, `scripts/figma/read-components.plugin.js` |
| `tokens/` | Tokens in W3C DTCG format, built from the package code and the foundation notes (ADR 003) | `scripts/build-tokens.mjs` |
| `build/meta/` | One merged `<name>.meta.json` per component export | `scripts/build-meta.mjs` |
| `proposals/` | Proposed semantic tokens and the component token scope (ADR 005). Not usable until Magenta ships them | People |
| `build/proposal/` | Proposed semantic and component tokens (DTCG and Panda), built from `proposals/` and `contracts/` | `scripts/build-token-proposal.mjs` |
| `llms.txt` | Index for agents | By hand for now |
| `checks/` | Validation scripts. `token-audit.mjs` finds hardcoded visual values. | Scripts (phase 5) |
| `reports/` | Source update reports, audits | Scripts |
| `references/` | Material supplied by the team that is not in the repo, e.g. screenshots of the color role tables | People |
| `.source/magenta/` | Read-only snapshot of the upstream repo. Hidden from Obsidian. | `scripts/update-source.mjs` |
| `source.lock.json` | Upstream commit and package versions of that snapshot | `scripts/update-source.mjs` |

## Updating the source

1. Download the zip of the `develop` branch from https://github.com/ocean-network-express/magenta (Code → Download ZIP).
2. In the vault folder, run `node scripts/update-source.mjs <path-to-zip>`.
3. Open the report it writes in `reports/`. It lists changed package versions and every changed file, grouped by component, recipe, docs page and tokens. Review the notes for those areas.

The previous snapshot stays in `.source/magenta.prev` until the next update.

## Building the tokens

Tokens flow one way: package code → `tokens/*.tokens.json` → Figma ([ADR 003](../adr/003-code-led-token-pipeline.md)). Run `node scripts/build-tokens.mjs` after updating the source and after editing a Primitive tokens table, a Semantic roles table or a MUST NOT rule in `foundations/`.

- `tokens/primitive.tokens.json`: every token in `tokens.ts`, plus the breakpoints. Each has its value, CSS variable, how to write it in Panda and CSS (`write`), its roles, its `status` (`forbidden` when a note says MUST NOT use it), contrast against its Use on backgrounds, and the Figma variable it becomes.
- `tokens/text-styles.tokens.json`: one token per `Text` level and size, as `<Text level size>` renders it.
- `node scripts/build-tokens.mjs --check` writes nothing and exits 1 when a file is out of date. It also reports token names in the notes that do not exist.
- There is no `semantic.tokens.json` or `component.tokens.json`: Magenta has no tokens of those tiers. The files appear when the code has them.

### Syncing Figma

After a token build, bring the Figma library in line (ADR 003):

1. `node scripts/build-figma-sync.mjs` writes the plugin code to `build/figma/` from the token files.
2. With the Desktop Bridge plugin open on the library file, run `build/figma/sync-tokens.dry-run.js` through figma-console (`figma_execute`). It changes nothing and lists every change. When the call is too large, send `build/figma/spec.json` in parts to client storage and run `sync-tokens.dry-run-stored.js`.
3. Review the list, then run `sync-tokens.apply-stored.js`. It saves a version in the file's history first. If it times out, set `PHASE` to `variables`, `paint`, then `text` and run each part; every part is safe to repeat.
4. Run the dry run again: it should report no change left. Write the result to `reports/figma-sync-<date>.md`.

## Building the contracts

`node scripts/build-contracts.mjs` reads the Magenta snapshot and writes `contracts/<Name>.json` for every component exported from the `src/components/index.ts` of `magenta-react`, `magenta-react-dates` and `magenta-react-text-editor`, plus `contracts/index.json`, which gives each entry its `package`. It imports the Panda recipes straight from the TypeScript source (`scripts/lib/ts-loader.mjs`), so it needs no `node_modules`. `--check` writes nothing and exits 1 when a contract is out of date.

Each contract holds:

- `props`: from the component's prop type and its JSDoc, following `Pick`, `Omit`, `&` and the magenta-commons helpers. HTML attributes the component passes through are listed in `inherits`, not one by one.
- `options`: props whose type is a union of string literals, with their default from the recipe's `defaultVariants` or the component's destructuring.
- `recipes`: the Panda recipes the component and its internal files use, with slots, variants and default variants.
- `styles`: every style those recipes set, by slot, variant (`when`) and state (`_hover`…), with the token it resolves to; `tokens.used` lists them.
- `examples`: stories in `packages/docs`.

`contracts/figma-components.json` lists the component sets of the Figma library: key, node, variants and properties. Read it with `scripts/figma/read-components.plugin.js` through figma-console, a few pages per call.

`node scripts/propose-figma-map.mjs` matches Figma properties to code props for the pilot components and writes `reports/component-mapping-<date>.md`. The matches are proposals: confirmed rows go into the "Figma to code mapping" table of `components/<name>.md`.

## Prototyping in code

Prototypes run on the real Magenta packages, built from the snapshot (workflow B). Nothing is fetched from GitHub Packages and no token is used: every `@ocean-network-express` package is a workspace package.

1. `node scripts/setup-prototype.mjs` copies `.source/magenta` to `.prototype/magenta` (hidden from Obsidian; `packages/docs` left out), creates `apps/prototype` from `scripts/prototype-app` the first time, installs from the public npm registry and builds `magenta-react-icons` and `magenta-react`. Run it again after a source update; screens are kept.
2. Start the app: the `prototype` entry of `.claude/launch.json` (port 5173), or `pnpm --dir .prototype/magenta/apps/prototype dev`.
3. A screen is one file in `apps/prototype/src/screens/<name>.tsx`, opened at `http://localhost:5173/#/<name>`. Use Magenta components with `size="responsive"`, and style layout with `css()` and token names.
4. Before calling a screen done, run `node checks/token-audit.mjs .prototype/magenta/apps/prototype/src`, and check it at 1024, 1280 and 1920px.

The app loads `magenta-react/index.css` for the components and Panda's `styled-system/styles.css` for the screens' layout. It does not use Panda's PostCSS plugin: that plugin would rewrite `magenta-react/index.css` too, because the file declares the same layers, and the variant styles would disappear.

## Running the token audit

`checks/token-audit.mjs` finds hardcoded colors, spacing, font sizes and weights, line heights, radii, border widths, shadows, z-index and durations, and suggests the Magenta token for each. It reads `tokens/primitive.tokens.json`, so build the tokens first. Suggestions name the token's role and never name a forbidden token. CSS variables that look like Magenta tokens but do not exist, and fallbacks on Magenta variables, are errors.

- `node checks/token-audit.mjs` audits the Magenta snapshot.
- `node checks/token-audit.mjs <path> …` audits product code: CSS, SCSS, and Panda style objects in TS and JS.
- `--report` writes `reports/token-audit-<date>.md`; `--report=<file>` writes elsewhere. `--quiet` prints only the summary.
- The report groups findings by how to fix them: **swap** for the token with the same value, use the **closest** token (the look changes slightly, so a designer checks it), or **decide** (no token fits; the team chooses or adds one). For the Magenta snapshot, the library packages and the private `react-templates` package are listed apart. Every finding is listed per file in the appendix.
- Exit code 1 when there is an error, so it can run in CI. Warnings (no token yet, off-scale values) do not fail.
- A `token-audit-ignore` comment on a line, or on the line above, skips that line.
- `checks/fixtures/` holds test files: `dirty/` must give 21 errors and 8 warnings, `clean/` none. Run both after changing the script.

## Creating a note in Obsidian

1. Create a note with the right name and folder, e.g. `components/button.md`. Use lowercase and hyphens.
2. Run **Templates: Insert template** from the command palette and pick the template.
3. Fill in the properties at the top, then each section. The comments in each section say what goes there; delete them when you are done.

## Templates

| Template | Save as | Builds into |
|---|---|---|
| `component.md` | `components/<name>.md` | `build/meta/<name>.meta.json`. Magenta has no component tokens, so the token each variant and state uses comes from the recipe (ADR 003); fill the Component tokens table only once Magenta ships component tokens. |
| `foundation.md` | `foundations/<topic>.md` | `tokens/primitive.tokens.json`: Primitive tokens table → `$description`; Semantic roles table → `roles` on the tokens each row names (ADR 001); a MUST NOT sentence → `status: forbidden`. |
| `pattern.md` | `patterns/<name>.md` | Index only |
| `adr.md` | `adr/<number>-<title>.md` | Index only |

Build output:

- `component.meta.example.json`: an example of one merged component record, for reference only. Schema: `schemas/component.schema.json`.
- `tokens/*.tokens.json`: the real token files (see Building the tokens). The `$extensions.mds` block follows `schemas/token-extension.schema.json`.

## Writing rules

1. **Keep the `##` headings exactly as written.** Scripts read content by heading. Delete a section only where the template marks it optional.
2. **Name components and tokens in backticks**, e.g. `Link` or `color.text.subtle`. The validator checks that each name exists.
3. **Do not invent.** Copy descriptions from Figma or from the team. If there is no source, leave the field empty and add an item to Open questions.
4. **Write situations, not principles,** in When to use: "Saving a form", not "Important actions".
5. **Every "When not to use" item names the alternative.**

## Properties reference

Values for properties with a fixed set of options:

| Property | Notes | Allowed values |
|---|---|---|
| `type` | All | `component`, `foundation`, `pattern`, `adr`, `design-language` |
| `status` | Component, foundation, pattern | `draft`, `beta`, `stable`, `deprecated` |
| `review_status` | All except ADR | `draft-ai`, `in-review`, `approved` |
| `category` | Component | `actions`, `inputs`, `selection`, `navigation`, `feedback`, `overlay`, `layout`, `data-display`, `media`, `utility` |
| `kind` | Pattern | `layout`, `flow`, `decision` |
| `status` | ADR | `proposed`, `accepted`, `rejected`, `superseded` |

Properties that hold names:

| Property | Holds | Checked against |
|---|---|---|
| `component` | Export name in the package, e.g. `Button` | Package exports |
| `alternatives`, `related`, `can_contain`, `cannot_contain`, `required_children`, `components` | Component names | Package exports |
| `deprecated_by` | Component name | Package exports |
| `deprecated_since` | Package version | Package versions |
| `a11y_role` | WAI-ARIA role, e.g. `button` | ARIA role list |
| `figma_url` | Link to the Figma frame the note was written from (component, foundation) | Nothing yet. The source update cannot see Figma, so check the frame by hand when it changes. |
| `sources` | Upstream files or folders the note was written from, relative to the repo root, e.g. `packages/docs/stories/Foundation/Colors/Design.mdx` | Files in `.source/magenta`. When one changes, the source update report lists this note under Notes to review. |

## Review status

| Value | Meaning | Who sets it |
|---|---|---|
| `draft-ai` | Written by AI. No person has checked it. This is the default. | AI |
| `in-review` | A person is checking it. | Writer |
| `approved` | Checked by the owner of the component or foundation. Fill in `reviewed_by` and `reviewed_on`. | Reviewer |

Agents may use `draft-ai` content, but must say so when they rely on it. For tokens, the same information is in `descriptionSource`: `figma`, `team` or `ai-draft`.

## Where each field of the build output comes from

### Component (`build/meta/<name>.meta.json`)

| Field | Source |
|---|---|
| `name`, `source`, `options`, `props`, `tokens.used`, `examples`, `docs` | Package (generated) |
| `description`, `category`, `status` | Note properties |
| `usage.when` / `usage.avoid` | Note sections When to use / When not to use |
| `usage.alternatives`, `related` | Note properties |
| `rationale` | Note section Why this design |
| `composition` | Note properties `can_contain`, `cannot_contain`, `required_children`, plus section Composition |
| `accessibility.role` | Note property `a11y_role` |
| `accessibility.keyboard`, `accessibleName`, `focus`, `contrastPairs` | Note section Accessibility (contrast values measured by a check) |
| `figma.url` | Note property `figma_url` |
| `figma.propMap` | Note section Figma to code mapping, until a Code Connect file exists |
| `deprecated` | Note properties `deprecated_by`, `deprecated_since`, plus section Migration |
| `review` | Note properties `review_status`, `reviewed_by`, `reviewed_on` |

### Token (`tokens/*.tokens.json`)

| Field | Source |
|---|---|
| `$type`, `$value`, `tier`, `source`, `cssVar`, `write`, `px`, `codeValue`, `text` | Package (generated). Colors use the DTCG 2025.10 color object, dimensions `{ value, unit }`. |
| `figma` | Generated from the token path: the variable name, code syntax and scopes the Figma library uses (ADR 003) |
| `$description` | Primitive tokens table. A row naming tokens one by one wins over a `group.*` or range row. |
| `roles` (`role`, `group`, `useOn`, `avoidOn`, `replacedBy`) | One entry per Semantic roles row that names the token |
| `status`, `forbiddenBy` | `forbidden` when a foundation note says MUST NOT use the token |
| `$deprecated` | Set when Replaced by is filled |
| `contrast` | Computed by the build against each Use on background |
| `descriptionSource` | `team` when the note is approved, otherwise `ai-draft` |

## Open for phase 2

- Whether `meta.json` files move next to the component code in the package. The AI-readiness checklist recommends this.
- How modes (light/dark, density) are stored: the `modes` field above, or separate files.
