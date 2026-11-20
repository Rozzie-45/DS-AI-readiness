---
type: foundation
foundation: ""
token_group: ""
status: draft
figma_url: ""
sources: []
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# {{title}}

<!--
HOW TO USE THIS TEMPLATE
- Save as foundations/<foundation>.md, e.g. foundations/color.md.
- foundation: color, typography, spacing, border, elevation, z-index, motion, iconography or layout.
- token_group: the top-level token group this note describes, e.g. color.
- The scale itself (every value) comes from the package and appears in the GENERATED block.
  Do not copy values into the sections above it.
- Keep every ## heading exactly as written. Scripts find content by heading.
- Delete these comments when the note is done.
-->

## Overview

<!-- 1–3 sentences: what this foundation covers and how it is organized. -->

## Principles

<!-- 3–5 principles that guide judgment, each with its reason. Write them like brand
guidelines, not like a list of answers. Example: "Color carries meaning, not decoration.
Brand magenta marks the one action we want people to take." -->

## Rules

<!-- Decisions that must be the same everywhere. One per bullet, written as MUST or MUST NOT,
and specific enough for a script or a reviewer to check. Example:
- MUST NOT use primitive tokens in product code.
-->

## Primitive tokens

<!-- (optional) What each primitive token or scale IS, not what it is for: e.g. "Brand magenta".
One row per token or per group (`colors.primary.*`). scripts/build-tokens.mjs copies Description →
$description on the primitive token; a row naming tokens one by one wins over a group row. -->

| Token | Description |
|---|---|
|  |  |

## Semantic roles

<!-- What each token is FOR. One row per role, e.g. "Default body text". Group rows under ###
headings when there are many (Text, Surfaces, Borders…).
Token: the semantic token for the role. Magenta has no semantic tokens yet (ADR 001), so name the
primitive token the role points to. Never invent a token name.
scripts/build-tokens.mjs copies each row onto the tokens it names, as one entry of `roles`:
Role → role, the ### heading → group, Use on → useOn, Don't use on → avoidOn, Replaced by →
replacedBy. Use on / Don't use on / Replaced by take token paths in backticks. A range such as
`spacing.0` – `spacing.10` names every token in between.
If Figma or the team already has a description, copy it word for word. If there is no source,
leave the cell empty and add an Open question. -->

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
|  |  |  |  |  |

## Accessibility

<!-- Requirements tied to tokens, e.g. minimum contrast for text tokens on their backgrounds,
minimum touch target, reduced motion. -->

## Do and don't

| Don't | Do |
|---|---|
|  |  |

## Open questions

<!-- Remove the section when empty. -->

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- GENERATED:END -->
