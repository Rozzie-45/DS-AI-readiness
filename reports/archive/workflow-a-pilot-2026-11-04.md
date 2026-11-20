---
type: report
date: 2026-11-04
---

# Workflow A pilot: delete confirmation dialog

Workflow A: brainstorm in chat, then build the design in Figma from the library's components and styles (figma-console). First run, to test the Button note.

## What was built

- Screen chosen in the brainstorm widget: a delete confirmation dialog in a 1280px frame (component size `md`).
- Figma: file `m5GWvQiv67rsNlBinvOqlR`, page "_Draft-Example - DO NOT USE", section "AI playground", frame `40000044:728013`.
- Library instance of `Dialog` (Width-size Small); its nested `Dialog header` and `Dialog footer` set to Size Medium; footer with 2 actions.
- Buttons, following [components/button.md](../../components/button.md): "Cancel" Ghost + Danger and "Delete" Fill + Danger, Size Medium; the close button is the header's Icon only, Ghost, Neutral, Medium.
- Page background `neutral.100` and overlay `background-overlay.50`, both through paint styles.
- Audit (`scripts/figma/audit-frame.plugin.js`): 14 instances, no raw fill or stroke, every text on a text style.

## What went wrong, and what it means

1. **The brainstorm option broke a rule.** The widget offered "outline neutral + fill danger", which changes both color and variant inside one group; the Button docs say a group keeps one of them. Caught while building. → Options shown in a brainstorm widget must be checked against the component notes before they are shown.
2. **The library Dialog has no size for its body text.** Its content text is fixed at `body1` size lg (15px); in a 1280px frame it must be md (13px). Fixed with a text style override. → For the design team: the Figma `Dialog` set has a Width-size but no Size property. The audit now flags text whose size does not match the frame.
3. **The file is on Figma's Starter plan.** Starter allows 3 pages, so the planned "_AI playground" page could not be created; the frame went on the existing draft page. → Check the plan of the real library file before relying on pages, branching or publishing.
4. **The contracts do not describe the Figma component's insides.** How to set the dialog's buttons (nested instances "Negative button", "Secondary button", "Primary button" inside "Dialog footer", chosen by the Actions property) was found by reading the component tree during the build. → Add the nested instances of each set, with their names and default properties, to `contracts/figma-components.json`.
5. **Checks were partly manual.** Raw values and text styles are now checked by the audit script; the Button grouping rules (one fill button per group, one color or one variant per group) are not. → Add them to the audit.

## Next

- Workflow B on the same dialog: read it from Figma and build it with Magenta components in code.
- Then write the workflow A skill: the steps above, the checks, and the five lessons.
