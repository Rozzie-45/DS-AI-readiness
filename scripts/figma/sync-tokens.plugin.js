// Runs inside Figma (figma-console figma_execute). Brings the library's variables and styles in line
// with tokens/*.tokens.json (ADR 003). Generated into build/figma/sync-tokens.js by
// scripts/build-figma-sync.mjs, which fills in SPEC and MODE below. Do not run this file directly.
//
// MODE "dry-run" changes nothing and returns every planned change. MODE "apply" first saves a
// version in the file's history, then makes the changes and reads them back.
//
// What it does, in the variable collection that already holds the spacing and radius variables:
// - renames existing variables to their code path (bindings survive: Figma binds by ID);
// - creates the missing variables; sets value, description, code syntax, scopes and visibility;
// - binds each paint style to its color variable (alpha lives in the variable; Figma then shows it as
//   the paint opacity);
// - binds each text style that matches a code text style to the font size, line height, letter
//   spacing, font weight and font family variables, which also corrects values that drifted.
// It deletes nothing. Effect styles, grid styles and styles with no code counterpart stay as they are.

let SPEC = /*SPEC*/ null;
const MODE = /*MODE*/ 'dry-run';
// Apply can run in parts when one run is too heavy for the plugin bridge (it times out and drops the
// connection): PHASE 'variables', then 'paint', then 'text', the text styles in slices TEXT_FROM–TEXT_TO.
// Each part is safe to repeat: it creates only what is missing and binds only what is not bound.
const PHASE = 'all';
const TEXT_FROM = 0;
const TEXT_TO = Infinity;
const runs = (p) => MODE === 'apply' && (PHASE === 'all' || PHASE === p);

// A run with a spec stores it in the plugin's client storage; a run without one (the small apply file)
// uses the stored spec, so apply changes exactly what the reviewed dry run reported.
const STORE_KEY = 'mds-token-sync-spec';
if (SPEC) await figma.clientStorage.setAsync(STORE_KEY, SPEC);
else SPEC = await figma.clientStorage.getAsync(STORE_KEY);
if (!SPEC) return { error: 'No spec. Run build/figma/sync-tokens.dry-run.js first.' };

const out = { mode: MODE, spec: SPEC.id, file: figma.root.name, collection: null, variables: { rename: [], create: [], update: [], unchanged: 0 }, paintStyles: { bind: [], skip: [] }, textStyles: { bind: [], skip: [] }, errors: [] };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const toFigmaValue = (v) => (v && typeof v === 'object' && 'r' in v ? { r: v.r, g: v.g, b: v.b, a: v.a } : v);
const close = (a, b) => (typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) < 1e-4 : a && b && typeof a === 'object' ? ['r', 'g', 'b', 'a'].every((k) => Math.abs((a[k] ?? 1) - (b[k] ?? 1)) < 1e-3) : a === b);

const cols = await figma.variables.getLocalVariableCollectionsAsync();
const col = cols.find((c) => c.name === SPEC.collection) ?? null;
if (!col) return { error: `collection "${SPEC.collection}" not found`, collections: cols.map((c) => c.name) };
out.collection = { name: col.name, modes: col.modes.map((m) => m.name) };
const modeId = col.defaultModeId;
const byName = new Map();
for (const id of col.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); byName.set(v.name, v); }

// Save a version only before the first change: if a code-path variable exists, an earlier run already did.
const started = [...byName.keys()].some((n) => n.startsWith('colors/'));
if (runs('variables') && !started) await figma.saveVersionHistoryAsync(SPEC.versionTitle, SPEC.versionDescription);

// ---------- variables ----------
// Each spec variable is [name, value, description, hidden, code?]; type, scopes and the CSS group
// for the code syntax come from its group.
const specVars = SPEC.variables.map(([name, value, description, hidden, code]) => {
  const [group, ...rest] = name.split('/');
  const g = SPEC.groups[group];
  return { name, value, description, hidden: Boolean(hidden), type: g.type, scopes: g.scopes, code: code ?? (g.css ? `var(--mag-${g.css}-${rest.join('-')})` : undefined) };
});
const specByName = new Map(specVars.map((s) => [s.name, s]));
const vars = new Map();
for (const s of specVars) {
  const oldName = Object.keys(SPEC.renames).find((k) => SPEC.renames[k] === s.name);
  let v = byName.get(s.name) ?? (oldName && byName.get(oldName));
  const want = toFigmaValue(s.value);
  if (!v) {
    out.variables.create.push(s.name);
    if (runs('variables')) {
      try { v = figma.variables.createVariable(s.name, col, s.type); } catch (e) { out.errors.push(`create ${s.name}: ${e.message}`); continue; }
    } else continue;
  } else {
    const changes = [];
    if (v.name !== s.name) { out.variables.rename.push(`${v.name} → ${s.name}`); changes.push('name'); }
    if (!close(v.valuesByMode[modeId], want)) changes.push(`value ${JSON.stringify(v.valuesByMode[modeId])} → ${JSON.stringify(want)}`);
    if ((v.description ?? '') !== s.description) changes.push('description');
    if (!same([...v.scopes].sort(), [...s.scopes].sort())) changes.push(`scopes ${v.scopes.join(',')} → ${s.scopes.join(',')}`);
    if ((v.codeSyntax?.WEB ?? '') !== (s.code ?? '')) changes.push('code syntax');
    if (Boolean(v.hiddenFromPublishing) !== Boolean(s.hidden)) changes.push(`hidden → ${Boolean(s.hidden)}`);
    if (changes.length) out.variables.update.push(`${s.name}: ${changes.filter((c) => c !== 'name').join('; ') || 'rename only'}`);
    else out.variables.unchanged++;
  }
  if (runs('variables')) {
    try {
      if (v.name !== s.name) v.name = s.name;
      v.setValueForMode(modeId, want);
      v.description = s.description;
      v.scopes = s.scopes;
      if (s.code) v.setVariableCodeSyntax('WEB', s.code);
      v.hiddenFromPublishing = Boolean(s.hidden);
    } catch (e) { out.errors.push(`set ${s.name}: ${e.message}`); }
  }
  if (v) vars.set(s.name, v);
}

// ---------- paint styles ----------
// Paint style names carry the CSS variable: "neutral/--mag-colors-neutral 900", "other/--mag-colors-background-overlay @50".
const paintToken = (name) => {
  const m = name.match(/--mag-colors-([a-z-]+?)(?: (\d+))?(?: @(\d+))?$/);
  return m ? ['colors', m[1], m[2] ?? m[3]].filter(Boolean).join('/') : null;
};
for (const style of await figma.getLocalPaintStylesAsync()) {
  const token = paintToken(style.name);
  const paint = style.paints[0];
  if (!token || !paint || paint.type !== 'SOLID') { out.paintStyles.skip.push(style.name); continue; }
  const bound = paint.boundVariables?.color?.id;
  const v = vars.get(token);
  if (!v && MODE === 'apply') { out.paintStyles.skip.push(`${style.name} (no variable ${token})`); continue; }
  // Once bound, Figma shows the variable's alpha as the paint opacity, so opacity is not compared.
  if (bound && v && bound === v.id) continue;
  out.paintStyles.bind.push(`${style.name} → ${token}${paint.opacity !== 1 ? ` (opacity ${paint.opacity} → 1)` : ''}`);
  if (runs('paint') && v) {
    try { style.paints = [{ ...figma.variables.setBoundVariableForPaint({ ...paint, opacity: 1 }, 'color', v) }]; } catch (e) { out.errors.push(`paint ${style.name}: ${e.message}`); }
  }
}

// ---------- text styles ----------
const FIELDS = ['fontSize', 'lineHeight', 'letterSpacing', 'fontWeight', 'fontFamily'];
const loaded = new Set();
let textIndex = 0;
const WEIGHTS = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 };
const current = (s, f) => (f === 'lineHeight' ? (s.lineHeight.unit === 'PIXELS' ? s.lineHeight.value : `${s.lineHeight.unit}`) : f === 'letterSpacing' ? (s.letterSpacing.unit === 'PIXELS' ? Math.round(s.letterSpacing.value * 100) / 100 : `${Math.round(s.letterSpacing.value * 100) / 100}%`) : f === 'fontWeight' ? (WEIGHTS[s.fontName.style] ?? s.fontName.style) : f === 'fontFamily' ? s.fontName.family : s.fontSize);
for (const style of await figma.getLocalTextStylesAsync()) {
  const name = style.name;
  const level = name.match(/^h([1-6])\//)?.[1] ? `h${name.match(/^h([1-6])\//)[1]}` : name.match(/^body (\d)\//) ? `body${name.match(/^body (\d)\//)[1]}` : /^body\//.test(name) ? 'body' : /^button\//.test(name) ? 'button' : null;
  if (!level) { out.textStyles.skip.push(name); continue; }
  const size = name.match(/(?:-|\/)(sm|md|lg)$/)?.[1] ?? (level === 'body4' ? 'sm' : null);
  if (!size) { out.textStyles.skip.push(name); continue; }
  const semibold = /semibold|semiblod/i.test(name) && /^body/.test(level);
  const key = `${level}${semibold ? '-semibold' : ''}.${size}`;
  if (SPEC.excludeTextLevels?.includes(key.split('.')[0])) { out.textStyles.skip.push(`${name} (excluded)`); continue; }
  if (!SPEC.textStyles[key]) { out.textStyles.skip.push(`${name} (no code style ${key})`); continue; }
  const inSlice = textIndex >= TEXT_FROM && textIndex < TEXT_TO;
  textIndex++;
  const [fontSize, lineHeight, letterSpacing, fontWeight] = SPEC.textStyles[key];
  const t = { fontSize, lineHeight, letterSpacing, fontWeight, fontFamily: 'fonts/primary' };
  const wantValue = (f) => specByName.get(t[f]).value;
  const unbound = FIELDS.filter((f) => !vars.get(t[f]) || style.boundVariables?.[f]?.id !== vars.get(t[f]).id);
  if (!unbound.length) continue;
  const valueChanges = unbound.filter((f) => current(style, f) !== wantValue(f)).map((f) => `${f} ${current(style, f)} → ${wantValue(f)}`);
  out.textStyles.bind.push(`${name} → ${key}${valueChanges.length ? `: ${valueChanges.join(', ')}` : ''}`);
  if (runs('text') && inSlice) {
    try {
      const font = `${style.fontName.family}/${style.fontName.style}`;
      if (!loaded.has(font)) { await figma.loadFontAsync(style.fontName); loaded.add(font); }
      for (const f of FIELDS) { const v = vars.get(t[f]); if (v) style.setBoundVariable(f, v); }
    } catch (e) { out.errors.push(`text ${name}: ${e.message}`); }
  }
}

out.summary = `${out.variables.rename.length} renames, ${out.variables.create.length} new variables, ${out.variables.update.length} variables changed, ${out.variables.unchanged} unchanged; ${out.paintStyles.bind.length} paint styles to bind (${out.paintStyles.skip.length} left as they are); ${out.textStyles.bind.length} text styles to bind (${out.textStyles.skip.length} left as they are); ${out.errors.length} errors.`;
// The dry run listed every change; apply reports only the totals, what it left alone and any errors.
if (MODE === 'apply') return { mode: MODE, spec: SPEC.id, file: out.file, summary: out.summary, errors: out.errors, paintStylesLeft: out.paintStyles.skip, textStylesLeft: out.textStyles.skip };
return out;
