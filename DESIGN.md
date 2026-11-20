---
type: design-language
review_status: draft-ai
reviewed_by: Phuong
reviewed_on: ""
---

# DESIGN.md

<!--
SKELETON (phase 1).
This file is the design language: the principles an agent or a designer uses for judgment
calls that no rule covers. Write it like brand guidelines, with reasons, not as a list of
answers. Values belong in tokens, component facts in build/meta, and checkable rules in the
Rules sections of foundations/ and patterns/.
-->

## Purpose

<!-- Drafted 2026-11-10 from Storybook (Foundation/GettingStarted/Design.mdx, Content/VoiceAndTone.stories.mdx, Components/DecisionTree) and the Figma file "Magenta-Design System - AI" (cover page; principles on the Colors and Spacing pages). Figma has no page of overall principles; the principles below gather the ones stated per topic. -->

Magenta is the design system of Ocean Network Express (ONE): reusable components, guidelines and assets so that teams build "consistent, high-quality user interfaces across different products and platforms", with "a consistent and harmony style across all ONE products" (Getting Started). The Figma cover puts it in one line: "Foundation and UI Component to design with Magenta for ONE products". Products should feel trustworthy, friendly, smart, formal and professional, the five tone keywords of the Voice & Tone guide: clear and honest information, an approachable voice, and no clutter.

## Principles

1. **Consistent across ONE products.** Use the shared foundations, components and terminology rather than local variants. Reason: the system exists so that every ONE product looks and reads the same (Getting Started; Voice "Consistent: unifying and cohesive").
2. **Accessible by default (WCAG AA).** Text under 24px needs 4.5:1 contrast; text 24px or larger and essential UI elements need 3:1. Reason: Figma's color principles commit to the WCAG AA contrast ratios, and Getting Started asks designers to "always" consider accessibility next to the ONE branding guideline.
3. **Choose by the situation, not by look.** Pick feedback by its level of friction, how long it stays, where it shows and how much it can say; pick inputs by data type and number of options. Reason: the Decision Tree sorts components this way so the choice "best matches the urgency and amount of information needed" ([DecisionTree](.source/magenta/packages/docs/stories/Components/DecisionTree)).
4. **Clarity and meaning first.** Every color, space and word should carry meaning: colors have roles, spacing shows how things relate and what matters most, text is plain and free of jargon. Reason: Figma's color principles ("Communication is the key", "Color has meaning": avoid meaningless colors), the spacing principles (Consistency, Hierarchy, Clarity) and the Voice guide ("Transparent: clear, concise and accessible").
5. **Friction matches the stakes.** High friction (dialogs, empty states, input validation) only for critical decisions, missing content or errors the user must fix; medium (alerts, banners) for information that stays until dismissed; low (toasts) for brief confirmations. Reason: the Feedback decision tree ranks each feedback type by friction and reserves dialogs for "critical information, making a decision or confirming a destructive action".

## Visual language

<!-- One or two sentences per topic on intent, then a link to the foundation note. -->

### Color

Color communicates: it shows the hierarchy of information, interactive states and the difference between elements, and each color has a role (blue for information or progress, orange for attention and warnings, red for errors and irreversible actions, neutral for most backgrounds, text and shapes, secondary to support navigation and brand). Do not use color without a meaning (Figma Colors page). Roles and tokens: [Color](foundations/color.md).

### Typography

Noto Sans at two weights carries the hierarchy of headings, body and detail text; sizes come from the type tokens. Roles and tokens: [Typography](foundations/typography.md).

### Space and layout

Spacing follows three principles from Figma: consistency (one 4px-based scale), hierarchy (more space for more important separations) and clarity (no crowding, room to focus). Items placed close together read as related; space between sections separates them. Roles and tokens: [Spacing](foundations/spacing.md), [Screens](foundations/screens.md).

### Shape and elevation

### Motion

## Composition and hierarchy

<!-- How screens are put together: density, grouping, emphasis, how many primary actions.
Keep these as principles so layouts can vary where variety helps. -->

## Named decisions

<!-- The few decisions that must be the same on every screen, as MUST / MUST NOT. Example:
- A destructive action MUST NOT be more prominent than the primary action.
-->

## Voice and tone

<!-- Drafted 2026-11-10 from Storybook Content/VoiceAndTone.stories.mdx. -->

The voice stays the same everywhere; the tone adapts to the user's situation (good news, an error, a warning).

- Voice: **Transparent** (clear, concise, accessible, no jargon), **Engaging** (friendly, warm, guiding), **Consistent** (the same terms and style on every platform).
- Tone keywords: **Trustworthy**, **Friendly**, **Smart**, **Formal**, **Professional**. Formal is for legal information, security warnings and other serious contexts.
- Tone mapping in the guide places each use case from informational to instructional and from low to high impact; use it to decide how direct and how serious a message should be.

More detail: Storybook "Content" section (Voice & Tone, Buttons, Feedback, Numbers).

## Tech stack

<!-- Filled in phase 2 from the package: framework and version, styling method, how tokens
reach the code (CSS variables, theme object…), supported browsers. -->
