# Mockups

Screens rebuilt with the real Magenta components from a screenshot or a Figma frame, made with the `/create` skill (`.claude/skills/create/SKILL.md`).

Each mockup has its own folder:

| File | What |
|---|---|
| `source.png` or `source.md` | The input: the image, or the Figma URL and node |
| `figma.json`, `spec.md` | Figma sources only: the frame read by `scripts/figma/read-frame.plugin.js`, and the brief `scripts/figma-to-spec.mjs` builds from it (components and props already mapped, plus Gaps) |
| `Screen.tsx` | The mockup code |
| `README.md` | What each part of the source became in Magenta, the gaps, and the differences |
| `result-1024.png`, `result-1280.png`, `result-1920.png` | Screenshots at the three reference widths |

A mockup can also be built in Figma instead of code (for example `inbound-settings/`): the folder then holds the source and a README with the Figma link and the mapping, and no `Screen.tsx`.

Open a code mockup at `http://localhost:5173/#/mockup/<slug>` (start the `prototype` server first). The prototype app loads every `mockups/*/Screen.tsx` automatically.

Commands:

```bash
node evals/check.mjs - mockups/<slug>/Screen.tsx
```
```bash
node scripts/figma-to-spec.mjs <slug>
```
```bash
node scripts/shoot-mockup.mjs <slug>
```
