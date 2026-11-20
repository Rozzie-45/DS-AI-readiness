#!/usr/bin/env node
// Builds the proposed semantic and component tokens from the code (ADR 005).
//
// Usage:  node scripts/build-token-proposal.mjs [--check]
//
// Reads:
//   proposals/semantic-tokens.md   semantic tokens written by people (name, palette token, role, scope)
//   contracts/*.json               every style each recipe sets, with the token it resolves to
//   tokens/primitive.tokens.json   the palette and scales the values must exist in
// Writes:
//   build/proposal/semantic.tokens.json, component.tokens.json   DTCG
//   build/proposal/panda-semantic-tokens.ts                      Panda semanticTokens object
//   reports/token-proposal-review.md                             where components differ from a role
//
// The code is the source: a semantic token must be used by at least one recipe in its role, and a
// component token always resolves to the value the recipe has today. Run after build-contracts.
// --check builds in memory and exits 1 when a file on disk is out of date or a semantic token fails.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VAULT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NOTE = path.join(VAULT, 'proposals', 'semantic-tokens.md');
const OUT = path.join(VAULT, 'build', 'proposal');
const REPORT = path.join(VAULT, 'reports', 'token-proposal-review.md');
const check = process.argv.includes('--check');
const rel = (p) => path.relative(VAULT, p);

// ---------- primitives ----------
const primitive = JSON.parse(fs.readFileSync(path.join(VAULT, 'tokens', 'primitive.tokens.json'), 'utf8'));
const prim = new Map(); // path -> { value, status }
(function walk(node, p) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (v.$value === undefined) walk(v, [...p, k]);
    else prim.set([...p, k].join('.'), { value: v.$value, status: v.$extensions?.mds?.status ?? 'ok', css: v.$extensions?.mds?.cssVar });
  }
})(primitive, []);
const dimPx = (v) => (v && typeof v === 'object' && 'unit' in v ? (v.unit === 'rem' ? v.value * 16 : v.value) : null);

// ---------- the note ----------
const note = fs.readFileSync(NOTE, 'utf8');
const errors = [];
const tableAfter = (heading) => {
  const i = note.indexOf(heading);
  if (i < 0) { errors.push(`${rel(NOTE)}: heading "${heading}" not found`); return []; }
  const lines = note.slice(i).split('\n').slice(1);
  const start = lines.findIndex((l) => l.startsWith('|'));
  const rows = [];
  for (const l of lines.slice(start)) { if (!l.startsWith('|')) break; rows.push(l.split('|').slice(1, -1).map((c) => c.trim())); }
  return rows.slice(2); // header and separator
};
const GROUPS = { '### Colors': 'colors', '### Radii': 'radii', '### Border widths': 'borders', '### Shadows': 'shadows' };
const semantic = [];
for (const [heading, group] of Object.entries(GROUPS)) {
  for (const [name, value, role, applies, link] of tableAfter(heading)) {
    semantic.push({ group, name, path: `${group}.${name}`, value, role, applies: applies === '*' ? null : applies.split(',').map((s) => s.trim()), link: link === 'yes' });
  }
}
const scope = tableAfter('## Component token scope').map(([recipe, why]) => ({ recipe, why }));

// ---------- recipe styles from the contracts ----------
const index = JSON.parse(fs.readFileSync(path.join(VAULT, 'contracts', 'index.json'), 'utf8'));
const styles = [];
const seen = new Set();
for (const c of index.components) {
  const contract = JSON.parse(fs.readFileSync(path.join(VAULT, 'contracts', c.contract), 'utf8'));
  for (const s of contract.styles ?? []) {
    const key = `${s.recipe}${JSON.stringify(s)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    styles.push({ ...s, file: contract.source?.file });
  }
}

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// Conditions and selectors → state words and parts. Negations (:not(...)) say nothing about the state.
const STATE_ORDER = ['open', 'selected', 'checked', 'indeterminate', 'editing', 'read-only', 'disabled', 'visited', 'placeholder', 'selection', 'hover', 'active', 'focus-within', 'focus-visible', 'focus'];
function readState(raw = '') {
  const words = new Set();
  const parts = [];
  for (const piece0 of raw.split(/ (?=[_&.])/).filter(Boolean)) {
    const piece = piece0.replace(/:not\([^()]*(\([^()]*\))?[^()]*\)/g, '');
    const t = [
      [/^_hover$|:hover/, 'hover'], [/^_active$|:active\b/, 'active'], [/^_focusVisible$|:focus-visible/, 'focus-visible'],
      [/^_focusWithin$|:focus-within/, 'focus-within'], [/^_focus$|:focus(?![-\w])/, 'focus'], [/^_checked$|:checked|aria-checked="?true/, 'checked'],
      [/^_disabled$|aria-disabled="true"|:disabled/, 'disabled'], [/^_visited$|:visited/, 'visited'], [/^_placeholder$|::?placeholder/, 'placeholder'],
      [/::?(-moz-)?selection/, 'selection'], [/aria-selected=true\]|^_selected$|data-selected/, 'selected'], [/data-active-editor-element/, 'editing'], [/data-state="open"|aria-expanded="?true/, 'open'],
    ];
    for (const [re, w] of t) if (re.test(piece)) words.add(w);
    for (const [re, p] of [[/^_before$|::before/, 'before'], [/^_after$|::after/, 'after'], [/switch-track/, 'track'], [/switch-thumb/, 'thumb'], [/radio-icon|\.mag-icon/, 'icon'], [/\.link\b/, 'link']]) {
      if (re.test(piece) && !parts.includes(p)) parts.push(p);
    }
  }
  return { words, state: STATE_ORDER.filter((w) => words.has(w)).join('-') || 'default', parts };
}

// Recipe variants that change a color. Value variants keep their value; boolean ones add a word when true.
const VALUE_VARIANTS = ['variant', 'color', 'state', 'columnPinningPosition', 'underline', 'divider'];
const BOOL_VARIANTS = { interactive: 'interactive', inline: 'inline', sticky: 'sticky', floating: 'floating', loading: 'loading', isColumnPinningLastOrFirst: 'pinned-edge', withRightBorder: 'right-border' };
const BOOL_STATES = { isOpen: 'open', selected: 'selected', checked: 'checked', indeterminate: 'indeterminate', readOnly: 'read-only', disabled: 'disabled' };
function readWhen(when = {}) {
  const segs = [];
  const states = [];
  for (const k of VALUE_VARIANTS) if (when[k] !== undefined && !/^(true|false)$/.test(String(when[k]))) segs.push(kebab(String(when[k])));
  for (const [k, w] of Object.entries(BOOL_VARIANTS)) if (String(when[k]) === 'true') segs.push(w);
  for (const [k, w] of Object.entries(BOOL_STATES)) if (String(when[k]) === 'true') states.push(w);
  return { segs, states };
}

const COLOR_PROP = /^(color|bg|background|backgroundColor|borderColor|border(Top|Bottom|Left|Right)?(Color)?|outline(Color)?|boxShadow|fill|stroke)$/;
const ICONISH = /icon|arrow|spinner|close|tooltip/i;
// Fields draw their focused border with outline, border or box-shadow: that is the field border, not a ring.
let FIELDS = new Set();
function category(prop, slot, parts, state, recipe) {
  if (/^(bg|background|backgroundColor)$/.test(prop)) return 'background';
  if (/^(fill|stroke)$/.test(prop)) return 'icon';
  if (prop === 'color') return ICONISH.test(slot) || parts.includes('icon') ? 'icon' : 'text';
  if (/focus(-visible)?$/.test(state) && /^(outline|outlineColor|boxShadow|border)/.test(prop)) return FIELDS.has(recipe) && slot !== 'helperTooltip' ? 'border' : 'focus-ring';
  return 'border';
}

const fieldRow = (fs.readFileSync(NOTE, 'utf8').match(/^\| border\.field\.default \|[^|]*\|[^|]*\|([^|]*)\|/m) ?? [])[1];
FIELDS = new Set((fieldRow ?? '').split(',').map((x) => x.trim()).filter(Boolean));
// One entry per color a recipe sets: { recipe, cat, comp path segments, state, token, style }.
const entries = [];
for (const s of styles) {
  const colorTokens = (s.tokens ?? []).filter((t) => t.startsWith('colors.') && !/^colors\.(transparent)$/.test(t));
  if (!colorTokens.length || !COLOR_PROP.test(s.property)) continue;
  const st = readState(s.state);
  const w = readWhen(s.when);
  const state = STATE_ORDER.filter((x) => st.words.has(x) || w.states.includes(x)).join('-') || 'default';
  const cat = category(s.property, s.slot, st.parts, state, s.recipe);
  for (const token of colorTokens) entries.push({ recipe: s.recipe, file: s.file, slot: s.slot, parts: st.parts, segs: w.segs, state, cat, property: s.property, token, raw: s });
}

// ---------- semantic tokens: check against the code ----------
const STATE_WORDS = new Set(STATE_ORDER.concat('default'));
const semState = (sem) => { const last = sem.name.split('.').pop(); return STATE_WORDS.has(last) ? last : 'default'; };
// A role in state "focus" covers the three focus conditions the code uses.
const stateMatches = (role, code) => role === code || (role === 'focus' && /^(focus|focus-visible|focus-within)$/.test(code));
const appliesTo = (sem, recipe) => !sem.applies || sem.applies.includes(recipe);
// A status role (text.error, border.warning…) only matches styles under that status variant;
// other roles only match styles under no status variant.
const STATUS = ['error', 'warning', 'success'];
const MODIFIERS = [...STATUS, 'loading'];
const statusOf = (sem) => STATUS.find((w) => sem.name.split('.')[1] === w) ?? null;
const sameStatus = (sem, e) => { const st = statusOf(sem); return st ? e.segs.includes(st) && !e.segs.includes('loading') : !e.segs.some((x) => MODIFIERS.includes(x)); };
const matchesColor = (sem, e) => {
  const cat = sem.name.split('.')[0];
  if (e.cat !== cat || e.token !== sem.value || !appliesTo(sem, e.recipe) || !sameStatus(sem, e)) return false;
  if (cat === 'focus-ring') return /focus/.test(e.state);
  return stateMatches(semState(sem), e.state);
};
// Non-color tokens: the token in the style, or (borders) a raw width equal to it.
const PROP_OF = { radii: /^(borderRadius|rounded|border\w*Radius)$/, shadows: /^(boxShadow|shadow)$/, borders: /^(outline|outlineWidth|border|borderWidth|border(Top|Bottom|Left|Right)(Width)?|boxShadow)$/ };
const matchesOther = (sem, s) => {
  if (!PROP_OF[sem.group].test(s.property) || !appliesTo(sem, s.recipe)) return false;
  const st = readState(s.state).state;
  if (sem.group === 'borders') {
    const focus = /focus/.test(st);
    if (sem.name === 'default' && focus) return false;
    if (sem.name.startsWith('focus-ring') && !focus) return false;
    if ((s.tokens ?? []).includes(sem.value)) return true;
    const px = dimPx(prim.get(sem.value)?.value);
    return /^outlineWidth$/.test(s.property) && px !== null && s.value === `${px}px` || (s.property === 'outline' && s.value.startsWith(`${px}px `)) || (/^(outline|boxShadow)$/.test(s.property) && new RegExp(`(^|\\s)(inset )?0 0 0 ${px}px\\b`).test(s.value));
  }
  return (s.tokens ?? []).includes(sem.value);
};

const NAME = /^[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+(-[a-z0-9]+)*)*$/;
for (const sem of semantic) {
  const p = prim.get(sem.value);
  if (!NAME.test(sem.name)) errors.push(`${sem.path}: name must be lowercase segments joined by dots`);
  if (!p) { errors.push(`${sem.path}: value ${sem.value} is not a primitive token`); continue; }
  if (p.status === 'forbidden') errors.push(`${sem.path}: value ${sem.value} is forbidden`);
  if (!sem.value.startsWith(`${sem.group}.`)) errors.push(`${sem.path}: value ${sem.value} is not in group ${sem.group}`);
  if (!sem.link) { sem.usedBy = []; continue; }
  const users = sem.group === 'colors' ? entries.filter((e) => matchesColor(sem, e)).map((e) => e.recipe) : styles.filter((s) => matchesOther(sem, s)).map((s) => s.recipe);
  sem.usedBy = [...new Set(users)].sort();
  if (sem.link && !sem.usedBy.length) errors.push(`${sem.path}: no recipe uses ${sem.value} in this role (set Link to no for page-level roles)`);
}
const recipesKnown = new Set(styles.map((s) => s.recipe));
for (const r of scope) if (!recipesKnown.has(r.recipe)) errors.push(`Component token scope: no recipe named ${r.recipe}`);
for (const sem of semantic) for (const r of sem.applies ?? []) if (!recipesKnown.has(r)) errors.push(`${sem.path}: Applies to names no recipe "${r}"`);

// ---------- component tokens ----------
const inScope = new Set(scope.map((s) => s.recipe));
const comp = new Map(); // name -> { token, sources[] }
const collisions = [];
for (const e of entries.filter((x) => inScope.has(x.recipe))) {
  const segs = [e.cat, kebab(e.recipe), ...(e.slot && e.slot !== 'base' && e.slot !== 'root' ? [kebab(e.slot)] : []), ...e.parts, ...e.segs, e.state];
  let name = `colors.${segs.join('.')}`;
  const src = { file: e.file, recipe: e.recipe, slot: e.slot, when: e.raw.when, state: e.raw.state, property: e.property, value: e.raw.value };
  const put = (n) => { const cur = comp.get(n); if (!cur) { comp.set(n, { token: e.token, entry: e, sources: [src] }); return true; } if (cur.token === e.token) { cur.sources.push(src); return true; } return false; };
  if (put(name)) { e.name = name; continue; }
  // Two properties of the same element set different colors: name them by property.
  const named = `colors.${[...segs.slice(0, -1), kebab(e.property), e.state].join('.')}`;
  if (put(named)) e.name = named; else collisions.push(`${name}: ${comp.get(name).token} and ${e.token}`);
}
// A path cannot be both a token and a group.
const allPaths = [...semantic.map((s) => s.path), ...comp.keys()];
const asGroups = new Set(allPaths.flatMap((p) => p.split('.').slice(1, -1).map((_, i, a) => p.split('.').slice(0, i + 2).join('.'))));
for (const p of allPaths) if (asGroups.has(p)) errors.push(`${p} is both a token and a group`);
if (new Set(allPaths).size !== allPaths.length) errors.push('A component token has the same name as a semantic token');

// Link a component token to a semantic token when value, category, state and scope match.
for (const [, c] of comp) {
  const sem = semantic.find((s) => s.group === 'colors' && s.link && matchesColor(s, c.entry));
  c.alias = sem ? sem.path : c.token;
  c.semantic = sem?.path ?? null;
}
// Differences: every recipe (in scope or not) whose color differs from the role for the same category and state.
const review = [];
const reviewed = new Set();
for (const e of entries) {
  if (semantic.some((s) => s.group === 'colors' && s.link && matchesColor(s, e))) continue;
  const role = semantic.find((s) => s.group === 'colors' && s.link && s.name.split('.')[0] === e.cat && appliesTo(s, e.recipe) && s.applies && sameStatus(s, e) && (s.name.split('.')[0] === 'focus-ring' ? /focus/.test(e.state) : stateMatches(semState(s), e.state)) && s.value !== e.token);
  // Focus rings: a focus-ring role value, or the .300 step of the component's own palette (tags, links), is expected.
  const oddRing = e.cat === 'focus-ring' && !semantic.some((s) => s.name.startsWith('focus-ring') && s.value === e.token) && !/^colors\.(?!neutral\.)[\w-]+\.300$/.test(e.token);
  if (!role && !oddRing) continue;
  const key = `${e.recipe}|${e.slot}|${e.cat}|${e.state}|${e.token}|${e.segs.join('.')}`;
  if (reviewed.has(key)) continue;
  reviewed.add(key);
  review.push({ name: e.name ?? null, recipe: e.recipe, token: e.token, role: role ?? null, src: { recipe: e.recipe, slot: e.slot, when: e.raw.when, state: e.raw.state, property: e.property } });
}

// ---------- outputs ----------
const sortObj = (o) => (o && typeof o === 'object' && !Array.isArray(o) ? Object.fromEntries(Object.keys(o).sort().map((k) => [k, sortObj(o[k])])) : o);
const setPath = (root, p, leaf) => { const segs = p.split('.'); let n = root; for (const s of segs.slice(0, -1)) n = n[s] ??= {}; n[segs.at(-1)] = leaf; };
const TYPE = { colors: 'color', radii: 'dimension', borders: 'dimension', shadows: 'shadow' };
const header = 'Generated by scripts/build-token-proposal.mjs from proposals/semantic-tokens.md and contracts/. Do not edit. PROPOSED: these tokens do not exist in Magenta; do not use them in code or Figma (ADR 005).';

const semJson = { $description: header };
for (const s of semantic) setPath(semJson, s.path, { $type: TYPE[s.group], $value: `{${s.value}}`, $description: s.role, $extensions: { mds: { tier: 'semantic', status: 'proposed', usedBy: s.usedBy, cssVar: `--mag-${s.path.replace(/\./g, '-')}` } } });
const compJson = { $description: header };
for (const [name, c] of comp) setPath(compJson, name, { $type: 'color', $value: `{${c.alias}}`, $extensions: { mds: { tier: 'component', status: 'proposed', component: c.entry.recipe, resolvesTo: c.token, cssVar: `--mag-${name.replace(/\./g, '-')}`, from: c.sources.slice(0, 3) } } });

const pandaTree = {};
for (const s of semantic) setPath(pandaTree, s.path, { value: `{${s.value}}`, description: s.role });
for (const [name, c] of comp) setPath(pandaTree, name, { value: `{${c.alias}}` });
const panda = `// ${header}\n// Proposed for packages/css/src/preset.ts: theme.semanticTokens = semanticTokens.\n\nexport const semanticTokens = ${JSON.stringify(sortObj(pandaTree), null, 2).replace(/"([a-zA-Z_$][\w$]*)":/g, '$1:')} as const;\n`;

const srcText = (x) => `\`${x.recipe}\`${x.slot && x.slot !== 'base' ? ` slot \`${x.slot}\`` : ''}, \`${x.property}\`${x.state ? ` in \`${x.state}\`` : ''}${x.when ? ` when ${Object.entries(x.when).map(([k, v]) => `${k}=${v}`).join(', ')}` : ''}`;
const byRecipe = (list) => Object.entries(list.reduce((a, x) => ((a[x] = (a[x] ?? 0) + 1), a), {})).sort((a, b) => b[1] - a[1]);
const compCount = byRecipe([...comp.values()].map((c) => c.entry.recipe));
const linked = [...comp.values()].filter((c) => c.semantic).length;
const reportLines = [
  '# Token proposal review',
  '',
  `Generated by \`scripts/build-token-proposal.mjs\`. Do not edit. Source: [proposals/semantic-tokens.md](../proposals/semantic-tokens.md), decision: [ADR 005](../adr/005-code-led-token-proposal.md).`,
  '',
  '## Summary',
  '',
  `- Semantic tokens: ${semantic.length} (${semantic.filter((s) => s.group === 'colors').length} colors, ${semantic.filter((s) => s.group !== 'colors').length} radii, border widths and shadows).`,
  `- Component tokens: ${comp.size} in ${compCount.length} components; ${linked} point to a semantic token, ${comp.size - linked} point to a palette token.`,
  `- By component: ${compCount.map(([r, n]) => `${r} ${n}`).join(', ')}.`,
  '',
  '## Semantic tokens and the components that use them',
  '',
  '| Token | Value | Used by (code) |',
  '|---|---|---|',
  ...semantic.map((s) => `| \`${s.path}\` | \`${s.value}\` | ${s.usedBy.length ? s.usedBy.join(', ') : (s.link ? '**none**' : 'not linked: no recipe sets this role (page level or docs only)')} |`),
  '',
  '## Components that differ from a role',
  '',
  'Each row is a component token whose value differs from the semantic role for the same category and state. The component token keeps the code value (ADR 005). The team decides whether the component or the role should change; until then nothing changes.',
  '',
  '| Component token | Code value | Role it differs from | Source |',
  '|---|---|---|---|',
  ...review.map((r) => `| ${r.name ? `\`${r.name}\`` : `none (\`${r.recipe}\` is outside the component token scope)`} | \`${r.token}\` | ${r.role ? `\`${r.role.path}\` (\`${r.role.value}\`)` : 'no focus ring role has this value'} | ${srcText(r.src)} |`),
  '',
  ...(collisions.length ? ['## Name collisions', '', ...collisions.map((c) => `- ${c}`), ''] : []),
];

const outputs = new Map([
  [path.join(OUT, 'semantic.tokens.json'), `${JSON.stringify(sortObj(semJson), null, 2)}\n`],
  [path.join(OUT, 'component.tokens.json'), `${JSON.stringify(sortObj(compJson), null, 2)}\n`],
  [path.join(OUT, 'panda-semantic-tokens.ts'), panda],
  [REPORT, `${reportLines.join('\n')}\n`],
]);

if (errors.length) console.error(`Errors:\n${errors.map((e) => `  ${e}`).join('\n')}`);
const summary = `${semantic.length} semantic tokens, ${comp.size} component tokens (${linked} linked to a semantic token), ${review.length} differences for review, ${collisions.length} name collisions.`;
if (check) {
  const stale = [...outputs].filter(([p, s]) => !fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== s).map(([p]) => rel(p));
  console.log(stale.length ? `Out of date: ${stale.join(', ')}. Run node scripts/build-token-proposal.mjs.` : `Token proposal is up to date. ${summary}`);
  process.exit(stale.length || errors.length ? 1 : 0);
}
fs.mkdirSync(OUT, { recursive: true });
for (const [p, s] of outputs) fs.writeFileSync(p, s);
console.log(summary);
console.log([...outputs.keys()].map(rel).join('\n'));
process.exit(errors.length || collisions.length ? 1 : 0);
