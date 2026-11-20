#!/usr/bin/env node
// Step 2 of /create from Figma: turns mockups/<slug>/figma.json (written by
// scripts/figma/read-frame.plugin.js) into mockups/<slug>/spec.md, the brief the agent codes from.
//
// Usage:  node scripts/figma-to-spec.mjs <slug>
//
// For each library instance it finds the Magenta component through the "Figma to code mapping"
// rows in build/meta (figma.propMap) and fills in every prop the rows state exactly (quoted values,
// booleans, size, texts). Rows written as prose are attached as hints. Instances with no mapping,
// raw colors and unbound spacing go to Gaps. Bound variables become tokens (spacing/16 → spacing.16).
// Repeated siblings (table rows) are collapsed. Writes nothing else.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VAULT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
if (!slug) { console.error('Usage: node scripts/figma-to-spec.mjs <slug>'); process.exit(2); }
const dir = path.join(VAULT, 'mockups', slug);
const input = path.join(dir, 'figma.json');
if (!fs.existsSync(input)) { console.error(`mockups/${slug}/figma.json not found. Run scripts/figma/read-frame.plugin.js in Figma first.`); process.exit(2); }
const figma = JSON.parse(fs.readFileSync(input, 'utf8'));

// ---------- tokens ----------
const primitive = JSON.parse(fs.readFileSync(path.join(VAULT, 'tokens', 'primitive.tokens.json'), 'utf8'));
const tokenOk = (p) => p.split('.').reduce((n, k) => n?.[k], primitive)?.$value !== undefined;
// "16 {spacing/16}" → { value: 16, token: "spacing.16" }
function tok(v) {
  if (v === undefined || v === null) return null;
  const m = String(v).match(/^(-?[\d.]+)?\s*\{([^}]+)\}$/);
  if (!m) return { value: v, token: null };
  const t = m[2].replace(/\//g, '.');
  return { value: m[1] ?? null, token: tokenOk(t) ? t : null, variable: m[2] };
}
const tokText = (v, gaps, where) => {
  const t = tok(v);
  if (!t) return null;
  if (t.token) return t.token;
  if (t.variable) { gaps.push(`${where}: variable \`${t.variable}\` has no matching token`); return `{${t.variable}}`; }
  if (t.value !== 0 && t.value !== '0') gaps.push(`${where}: ${t.value} is not bound to a variable`);
  return String(t.value);
};

// ---------- mapping rows from build/meta ----------
const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
const bySet = new Map(); // set name → [{ meta, docs, prop, values, codeProp, codeValue }]
for (const f of fs.readdirSync(path.join(VAULT, 'build', 'meta'))) {
  const m = JSON.parse(fs.readFileSync(path.join(VAULT, 'build', 'meta', f), 'utf8'));
  let lastSets = [];
  for (const r of m.figma?.propMap ?? []) {
    const [head, ...rest] = r.figmaProperty.split(' · ');
    let sets;
    let prop;
    if (r.figmaProperty.startsWith('·') || head === '') { sets = lastSets; prop = r.figmaProperty.replace(/^·\s*/, ''); }
    else { sets = head.split(/\s*(?:\/|,|\|)\s*/).map(norm).filter(Boolean); prop = rest.join(' · '); lastSets = sets; }
    for (const s of sets) {
      if (!bySet.has(s)) bySet.set(s, []);
      bySet.get(s).push({ meta: m.name, docs: m.docs, prop, values: r.figmaValue, codeProp: r.codeProp, codeValue: r.codeValue });
    }
  }
}
// One mapping table per note: the same rows are copied into every export of the note.
const rowsFor = (set) => {
  const all = bySet.get(norm(set ?? '')) ?? [];
  const seen = new Set();
  return all.filter((r) => { const k = `${r.docs}|${r.prop}|${r.values}|${r.codeProp}|${r.codeValue}`; if (seen.has(k)) return false; seen.add(k); return true; });
};
const metasFor = (set) => [...new Set((bySet.get(norm(set ?? '')) ?? []).map((r) => r.meta))];

// Icons: the Figma icon set "gear_setting" is the export GearSettingOutline (or …Fill).
const ICON_DIR = path.join(VAULT, '.source', 'magenta', 'packages', 'react-icons', 'src', 'svg');
const ICONS = new Set(fs.existsSync(ICON_DIR) ? fs.readdirSync(ICON_DIR).flatMap((d) => fs.readdirSync(path.join(ICON_DIR, d)).map((f) => f.replace(/\.tsx?$/, ''))) : []);
const iconExport = (name, style) => {
  const base = String(name).split(/[_\s-]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('');
  const order = /fill/i.test(style ?? '') ? ['Fill', 'Outline', ''] : ['Outline', 'Fill', ''];
  return order.map((x) => base + x).find((n) => ICONS.has(n)) ?? null;
};
const ALL_METAS = new Set(fs.readdirSync(path.join(VAULT, 'build', 'meta')).map((f) => JSON.parse(fs.readFileSync(path.join(VAULT, 'build', 'meta', f), 'utf8')).name));

const propNames = (p) => p.split(/\s*(?:\/|,)\s*/).map(norm);
const valueList = (v) => v.split(/\s+\/\s+/).map((x) => norm(x.replace(/^"|"$/g, '')));
const quoted = (s) => /^"[^"]*"$/.test(s.trim());
const FREE = new Set(['any', 'text', 'icon instance', 'instance', 'icon', 'number']);

// Resolve one Figma property value. Returns { prop, value } (exact), { hint } or null (ignore).
function resolve(rows, name, value) {
  const v = norm(String(value));
  const matches = rows.filter((r) => propNames(r.prop).includes(norm(name)) && (valueList(r.values).includes(v) || FREE.has(norm(r.values))));
  const out = [];
  for (const r of matches) {
    const cv = r.codeValue.trim();
    if (/not props|^default$/i.test(cv)) continue;
    // The code is the source: what exists only in Figma is not built, it is reported.
    if (/not in code|figma only/i.test(cv)) { out.push({ figmaOnly: `${name}=${value}` }); continue; }
    const cp = r.codeProp.trim();
    if (cp === '—' || cp === '-' || /\s\/\s/.test(cp)) { out.push({ hint: `${name}=${value} → ${cp === '—' ? '' : `${cp}: `}${cv}` }); continue; }
    if (/^"responsive"/.test(cv)) { out.push({ prop: cp, value: '"responsive"' }); continue; }
    const fv = valueList(r.values);
    const cvs = cv.split(/\s+\/\s+/);
    if (fv.length > 1 && fv.length === cvs.length && cvs.every(quoted)) { out.push({ prop: cp, value: cvs[fv.indexOf(v)] }); continue; }
    if (quoted(cv)) { out.push({ prop: cp, value: cv }); continue; }
    if (/^(true|false|-?\d+(\.\d+)?)$/.test(cv)) { out.push({ prop: cp, value: `{${cv}}` }); continue; }
    if (FREE.has(norm(r.values)) && typeof value === 'string' && value && !/^(true|false)$/.test(v)) {
      out.push({ prop: cp, value: /icon/i.test(r.values) ? `{${value}}` : JSON.stringify(value), note: cv });
      continue;
    }
    out.push({ hint: `${name}=${value} → ${cp}: ${cv}` });
  }
  return out;
}

// Pick the component: a row that names it (codeProp —), else the export whose name is in the set name.
function component(set, rows, values) {
  const metas = metasFor(set);
  if (!metas.length) return null;
  const words = norm(set).replace(/[^a-z ]/g, ' ');
  const byName = metas.filter((m) => words.replace(/ /g, '').includes(m.toLowerCase())).sort((a, b) => b.length - a.length);
  return { pick: byName[0] ?? null, candidates: metas, docs: [...new Set(rows.map((r) => r.docs))] };
}

// ---------- walk ----------
const gaps = [];
let instances = 0;
let mapped = 0;
const unmappedSets = new Map();

function lineFor(n, where) {
  if (n.type === 'TEXT') {
    const fill = n.fill ? tokText(n.fill, gaps, `text "${n.text.slice(0, 20)}"`) : null;
    if (!n.textStyle) gaps.push(`text "${n.text.slice(0, 30)}" has no text style`);
    return { line: `text "${n.text.replace(/\n/g, ' ')}"${n.textStyle ? ` · style ${n.textStyle}` : ''}${fill ? ` · color ${fill}` : ''}` };
  }
  if (n.type === 'INSTANCE') {
    instances++;
    const rows = rowsFor(n.set);
    const c = component(n.set, rows);
    const values = { ...(n.variant ?? {}), ...(n.props ?? {}) };
    const desc = `${n.set}${Object.keys(n.variant ?? {}).length ? ` (${Object.entries(n.variant).map(([k, v]) => `${k}=${v}`).join(', ')})` : ''}`;
    // A standalone icon from the library's icon sets ("gear_setting", Style=outline).
    const icon = !c && iconExport(n.set, n.variant?.Style);
    if (icon) { mapped++; return { line: `**<${icon} />** (icon)   ← ${desc}` }; }
    if (!c) {
      unmappedSets.set(n.set, (unmappedSets.get(n.set) ?? 0) + 1);
      return { line: `instance **${desc}** → no mapping${n.texts?.length ? ` · texts: ${n.texts.map((t) => `"${t}"`).join(', ')}` : ''}${n.nested ? ` · contains ${n.nested.join(', ')}` : ''}`, sub: [] };
    }
    mapped++;
    const props = new Map();
    const hints = [];
    const figmaOnly = [];
    for (const [k, v] of Object.entries(values)) {
      if (v === false || v === '') continue;
      for (const r of resolve(rows, k, v)) {
        if (r.figmaOnly) figmaOnly.push(r.figmaOnly);
        else if (r.prop && !props.has(r.prop)) props.set(r.prop, r.value);
        else if (r.hint) hints.push(r.hint);
      }
    }
    // A mapping row whose code value starts with a component name ("IconButton, same color…") picks it.
    const named = hints.map((h) => h.match(/→\s*([A-Z][A-Za-z]+)\b/)?.[1]).find((x) => x && ALL_METAS.has(x));
    // "children of Td" in a mapping row names the component and the prop.
    let ofName = null;
    for (const [k, v] of [...props]) { const m = k.match(/^children of ([A-Z]\w*)$/); if (m && ALL_METAS.has(m[1])) { ofName = m[1]; props.delete(k); props.set('children', v); } }
    // Otherwise a hint like "any content in a Td" names it, when that export is a candidate.
    const inHint = hints.map((h) => h.match(/\b(?:in|a|an) ([A-Z][A-Za-z]+)\b/)?.[1]).find((x) => x && c.candidates.includes(x));
    const pickName = named ?? ofName ?? c.pick ?? inHint;
    // Swapped icons: Swap left icon → leftIcon, Swap right icon → rightIcon, other icon slots → children of an IconButton.
    for (const [k, v] of Object.entries(values)) {
      if (typeof v !== 'string' || !/icon/i.test(k) || !/swap/i.test(k)) continue;
      const side = /left/i.test(k) ? 'left' : /right/i.test(k) ? 'right' : null;
      const shownKey = Object.keys(values).find((x) => side && new RegExp(`^${side} icon$`, 'i').test(x));
      if (shownKey && values[shownKey] === false) continue;
      // An icon slot that is switched off (Action-icon=False) or not drawn (absent from the visible nested sets) is skipped.
      if (!side && Object.entries(values).some(([x, y]) => /icon/i.test(x) && !/swap/i.test(x) && (y === false || /^false$/i.test(String(y))))) continue;
      if (n.nested && !n.nested.includes(v)) continue;
      const exp = iconExport(v);
      if (!exp) { gaps.push(`icon "${v}" in ${n.set}: no export in magenta-react-icons`); continue; }
      const target = side ? `${side}Icon` : pickName === 'IconButton' ? 'children' : 'icon';
      if (!props.has(target)) props.set(target, `{<${exp} />}`);
    }
    if (pickName === 'IconButton') { props.delete('leftIcon'); props.delete('children'); const ic = Object.entries(values).find(([k, v]) => /swap/i.test(k) && /icon/i.test(k) && iconExport(v) && (!n.nested || n.nested.includes(v))); if (ic) props.set('children', `{<${iconExport(ic[1])} />}`); props.set('aria-label', '"…"'); }
    const comp = pickName ?? `one of ${c.candidates.slice(0, 6).join(', ')}`;
    const propText = [...props].map(([k, v]) => `${k}=${v}`).join(' ');
    const sub = [];
    if (n.texts?.length && ![...props.values()].some((v) => n.texts.some((t) => v.includes(t)))) sub.push(`texts: ${n.texts.map((t) => `"${t}"`).join(', ')}`);
    if (n.nested) sub.push(`contains: ${n.nested.join(', ')}`);
    const seenHint = new Set();
    for (const h of hints) { const key = h.replace(/^.*?→\s*/, '').slice(0, 25); if (seenHint.has(key) || /^(Left|Right) icon=|^Swap /.test(h)) continue; seenHint.add(key); sub.push(`hint: ${h}`); if (seenHint.size >= 6) break; }
    for (const f of figmaOnly) { sub.push(`figma only: ${f} (not in code, leave it out)`); gaps.push(`${n.set} ${f}: Figma only, not in code; the mockup follows the code`); }
    sub.push(`note: ${c.docs.join(', ')}`);
    return { line: `**${comp}** ${propText}   ← ${desc}`, sub };
  }
  // frame, group, section, rectangle…
  const parts = [`${n.type.toLowerCase()} "${n.name}"`];
  if (/^gap\b/i.test(n.name)) gaps.push(`"${n.name}": marked as a gap in Figma`);
  if (n.layout) {
    const pad = (n.layout.padding ?? []).map((p) => tokText(p, gaps, `"${n.name}" padding`));
    parts.push(`${n.layout.dir}${n.layout.wrap ? ' wrap' : ''} gap ${tokText(n.layout.gap, gaps, `"${n.name}" gap`) ?? '0'}`);
    if (pad.some((p) => p && p !== '0')) parts.push(`padding ${pad.join(' ')}`);
    parts.push(`align ${n.layout.align.toLowerCase()}`);
  } else if (n.children?.length > 1) parts.push('no auto-layout');
  if (n.sizing) parts.push(`size ${n.sizing.toLowerCase()} (${n.w}×${n.h})`);
  if (n.fill) parts.push(`bg ${tokText(n.fill, gaps, `"${n.name}" fill`)}`);
  if (n.stroke) parts.push(`border ${tokText(n.stroke, gaps, `"${n.name}" stroke`)}`);
  if (n.radius) parts.push(`radius ${tokText(n.radius, gaps, `"${n.name}" radius`)}`);
  return { line: parts.join(' · '), children: n.children ?? [] };
}

const out = [];
function walk(n, depth) {
  const r = lineFor(n);
  const pad = '  '.repeat(depth);
  out.push(`${pad}- ${r.line}`);
  for (const s of r.sub ?? []) out.push(`${pad}    ${s}`);
  if (n.repeat) out.push(`${pad}    (× ${n.repeat} in Figma, same structure${n.samples?.length ? `; texts of the others: ${n.samples.map((x) => `[${x.map((t) => `"${t}"`).join(', ')}]`).join(' ')}` : ''})`);
  // Collapse runs of siblings that render the same lines (table rows, list items).
  const kids = r.children ?? [];
  // Rows named alike ("Row 0000001", "Row 0000002"…): the first two in full, the rest as one line of texts.
  const textsOf = (x) => [x.text, ...(x.texts ?? []), ...(x.children ?? []).flatMap(textsOf)].filter(Boolean);
  const stem = (x) => (x.type === 'INSTANCE' ? null : x.name.replace(/\d+/g, '#'));
  let i = 0;
  while (i < kids.length) {
    const st = stem(kids[i]);
    let run = i;
    while (st && /#/.test(st) && run + 1 < kids.length && stem(kids[run + 1]) === st) run++;
    if (run - i >= 2) {
      walk(kids[i], depth + 1);
      walk(kids[i + 1], depth + 1);
      const pad1 = '  '.repeat(depth + 1);
      for (const k of kids.slice(i + 2, run + 1)) out.push(`${pad1}- frame "${k.name}" · same layout as the rows above · texts: ${textsOf(k).map((t) => `"${t}"`).join(', ')}`);
      i = run + 1;
      continue;
    }
    const start = out.length;
    walk(kids[i], depth + 1);
    const block = out.slice(start).join('\n').replace(/"[^"]*"/g, '""');
    let j = i + 1;
    while (j < kids.length) {
      const probe = out.length;
      const saved = [gaps.length, instances, mapped, new Map(unmappedSets)];
      walk(kids[j], depth + 1);
      const same = out.slice(probe).join('\n').replace(/"[^"]*"/g, '""') === block;
      // Probing only: undo the output and the counts either way; a mismatch is walked for real next.
      out.length = probe;
      gaps.length = saved[0]; instances = saved[1]; mapped = saved[2];
      unmappedSets.clear(); for (const [k, v] of saved[3]) unmappedSets.set(k, v);
      if (!same) break;
      j++;
    }
    if (j - i > 1) out.push(`${'  '.repeat(depth + 1)}  (× ${j - i}: ${j - i} siblings like this one, texts differ)`);
    i = j;
  }
}
walk(figma.tree, 0);

const unmapped = [...unmappedSets].sort((a, b) => b[1] - a[1]);
for (const [s, k] of unmapped) gaps.unshift(`instance set "${s}" (${k}×): no Figma to code mapping in any note`);
const pct = instances ? Math.round((mapped / instances) * 100) : 0;

const md = [
  `# Spec: ${figma.frame}`,
  '',
  `Generated by \`scripts/figma-to-spec.mjs\` from [figma.json](figma.json) (${figma.file}, frame \`${figma.frameId}\`, read ${figma.read}). Do not edit; rerun after the design changes.`,
  '',
  `- Frame: ${figma.width} × ${figma.height}, ${figma.nodes} nodes.`,
  `- Instances mapped to a Magenta component: **${mapped} of ${instances} (${pct}%)**. Repeats and elided rows count once.`,
  '- Props after a component are exact (from quoted values in the note\'s mapping table). `hint:` lines are prose from the table: read them and decide. Pass `size="responsive"` whatever the Figma size says.',
  '- Layout: `gap`, `padding`, `bg`, `border` give tokens where the design binds a variable.',
  '- The code is the source: a `figma only:` line is a design option Magenta does not have. Leave it out, list it under Differences, and report it as a Figma issue.',
  '',
  '## Tree',
  '',
  ...out,
  '',
  '## Gaps',
  '',
  ...(gaps.length ? [...new Set(gaps)].map((g) => `- ${g}`) : ['None.']),
  '',
];
fs.writeFileSync(path.join(dir, 'spec.md'), md.join('\n'));
console.log(`mockups/${slug}/spec.md: ${mapped}/${instances} instances mapped (${pct}%), ${new Set(gaps).size} gaps.`);
