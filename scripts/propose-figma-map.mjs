#!/usr/bin/env node
// Proposes how the properties of a Figma component set map to the props of the Magenta component,
// for the team to confirm. Reads contracts/<Name>.json and contracts/figma-components.json.
//
// Usage:  node scripts/propose-figma-map.mjs
//
// Writes reports/component-mapping-<date>.md. The proposals are guesses from names and values:
// confirmed rows go into the "Figma to code mapping" table of components/<name>.md, which is what
// build/meta reads (templates/README.md). This script writes nothing else.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VAULT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const figma = JSON.parse(fs.readFileSync(path.join(VAULT, 'contracts', 'figma-components.json'), 'utf8'));
const contract = (name) => JSON.parse(fs.readFileSync(path.join(VAULT, 'contracts', `${name}.json`), 'utf8'));

// Pilot pairs: Magenta component → Figma component set.
const PAIRS = [
  ['Button', 'Button'], ['Input', 'Text input'], ['Select', 'Single select'], ['Select', 'Multiple-select'],
  ['Checkbox', 'Checkbox'], ['Tag', 'Tag'],
  ['Dialog', 'Dialog'], ['DialogHeader', 'Dialog header'], ['DialogContent', '_Dialog body'], ['DialogAction', 'Dialog footer'],
  ['TabList', 'Tab List'], ['TabListItem', 'Tab item'],
  ['Alert', 'Alert-Messages'], ['Banner', 'Banner'], ['InlineBanner', 'Inline Banner'], ['Toast', 'Toast'],
  ['Menu', 'Menu List_ver 2'], ['MenuHeader', 'Menu header'], ['MenuFooter', 'Menu footer'],
  ['Tr', '_Data table row item'], ['Th', 'Header cell item'], ['Td', 'Cell item'],
];

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const VALUE_SYNONYMS = { large: 'lg', medium: 'md', small: 'sm', xlarge: 'xl', xsmall: 'xs', royalpurple: 'royal', information: 'blue', success: 'green', warning: 'orange', error: 'red', top: 'top', left: 'left' };
const PROP_SYNONYMS = { style: ['variant'], widthsize: ['maxWidth'], status: ['color'], removable: ['deletable'], orientation: ['vertical'], selection: ['checked', 'indeterminate'] };
const valueFor = (figmaValue, codeValues) => {
  const n = norm(figmaValue);
  return codeValues.find((v) => norm(v) === n) ?? codeValues.find((v) => norm(v) === VALUE_SYNONYMS[n]) ?? null;
};

// The State property mixes interaction states (CSS conditions) and props. disabled and readOnly can
// also be HTML attributes the component inherits from <input>, <button>, <select> or <textarea>.
const stateRow = (value, code) => {
  const props = code.props;
  const html = code.inherits.some((i) => /<(input|button|select|textarea)>/.test(i));
  const n = norm(value);
  if (['enable', 'default'].includes(n)) return ['—', 'default (no prop)', 'state'];
  if (n === 'hover') return ['—', ':hover (interaction, not a prop)', 'state'];
  if (n === 'focus') return ['—', ':focus-visible (interaction, not a prop)', 'state'];
  if (['pressed', 'active'].includes(n)) return ['—', ':active (interaction, not a prop)', 'state'];
  if (['disable', 'disabled'].includes(n)) return props.disabled ? ['disabled', 'true', 'state'] : html ? ['disabled', 'true (HTML attribute)', 'state'] : ['?', 'no disabled prop', 'none'];
  if (n === 'loading') return props.loading ? ['loading', 'true', 'state'] : ['?', 'no loading prop', 'none'];
  if (n === 'error') return props.state?.values?.includes('error') ? ['state', '"error"', 'state'] : ['?', 'no error state prop', 'none'];
  if (n === 'readonly') return props.readOnly ? ['readOnly', 'true', 'state'] : html ? ['readOnly', 'true (HTML attribute)', 'state'] : ['?', 'no readOnly prop', 'none'];
  if (n === 'selected') return props.selected ? ['selected', 'true', 'state'] : ['?', 'selected: set by the parent or by value', 'guess'];
  if (n === 'filled') return ['value', 'any non-empty value', 'guess'];
  return ['?', '', 'none'];
};

// Code props a BOOLEAN, TEXT or INSTANCE_SWAP property most likely controls.
const contentProp = (figmaName, type, props) => {
  const n = norm(figmaName).replace(/^(show|swap)/, '').replace(/text$/, '');
  const candidates = {
    lefticon: ['leftIcon', 'icon'], righticon: ['rightIcon'], icon: ['icon', 'leftIcon'], label: ['label', 'children'], value: ['label', 'children'],
    helper: ['helperText'], helpertext: ['helperText'], errormessage: ['helperText'], title: ['title'], message: ['message', 'children'],
    closable: ['closable', 'deletable'], content: ['children'], slot: ['children'], '': ['children', 'label'], header: ['children'], form: ['children'],
  }[n] ?? [n];
  const hit = candidates.find((c) => props[c] || (c === 'children' && type !== 'BOOLEAN'));
  return hit ?? null;
};

const rowsFor = (code, set) => {
  const rows = [];
  const options = code.options;
  for (const [prop, def] of Object.entries(set.props)) {
    if (Array.isArray(def)) {
      if (norm(prop) === 'state' || norm(prop) === 'inputstate') { for (const v of def) rows.push([prop, v, ...stateRow(v, code)]); continue; }
      // Name match first, then synonyms, then the option whose values overlap most.
      const byName = Object.keys(options).find((o) => norm(o) === norm(prop)) ?? (PROP_SYNONYMS[norm(prop)] ?? []).find((o) => options[o] || code.props[o]);
      const byValues = Object.entries(options).map(([o, d]) => [o, def.filter((v) => valueFor(v, d.values)).length]).sort((a, b) => b[1] - a[1])[0];
      const target = byName ?? (byValues && byValues[1] >= Math.ceil(def.length / 2) ? byValues[0] : null);
      const isBool = def.every((v) => /^(true|false)$/i.test(v));
      for (const v of def) {
        if (target && options[target]) { const cv = valueFor(v, options[target].values); rows.push([prop, v, target, cv ? `"${cv}"` : 'no matching value', cv ? (byName ? 'name' : 'values') : 'none']); }
        else if (target && code.props[target]?.type === 'boolean') rows.push([prop, v, target, String(/true|vertical|checked|indeterminate/i.test(v)), 'name']);
        else if (isBool) { const p = contentProp(prop, 'BOOLEAN', code.props); rows.push([prop, v, p ?? '?', p ? String(/true/i.test(v)) : '', p ? 'guess' : 'none']); }
        else rows.push([prop, v, '?', '', 'none']);
      }
    } else {
      const type = def.split('=')[0];
      const p = contentProp(prop, type, code.props);
      const value = type === 'BOOLEAN' ? 'true: shown; false: not passed' : type === 'TEXT' ? 'the text' : 'the icon or slot component';
      rows.push([prop, type === 'BOOLEAN' ? `true / false (default ${def.split('=')[1]})` : type.toLowerCase().replace('_', ' '), p ?? '?', p ? value : '', p ? 'guess' : 'none']);
    }
  }
  return rows;
};

const today = new Date().toISOString().slice(0, 10);
const esc = (s) => String(s).replace(/\|/g, '\\|');
const lines = ['---', 'type: report', `date: ${today}`, '---', '', `# Figma to code mapping, proposal ${today}`, '',
  'Generated by `scripts/propose-figma-map.mjs` from `contracts/<Name>.json` (code) and `contracts/figma-components.json` (the Figma library). **These are guesses from names and values, for the team to confirm.** Confirmed rows go into the "Figma to code mapping" table of `components/<name>.md`.', '',
  'How: **name** = the property names match; **values** = most values match; **state** = an interaction state or a state prop; **guess** = a likely prop from the property name; **none** = no match, needs a decision.', ''];
const summary = [];
for (const [name, setName] of PAIRS) {
  const code = contract(name);
  const set = figma.sets.find((s) => s.set === setName);
  if (!set) { lines.push(`## ${name} ↔ (missing set "${setName}")`, ''); continue; }
  const rows = rowsFor(code, set);
  const unmatched = rows.filter((r) => r[4] === 'none');
  // Code option values no Figma variant shows.
  const shown = new Set(rows.filter((r) => r[3]?.startsWith('"')).map((r) => `${r[2]}=${r[3].slice(1, -1)}`));
  const missing = Object.entries(code.options).flatMap(([o, d]) => (rows.some((r) => r[2] === o) ? d.values.filter((v) => !shown.has(`${o}=${v}`)).map((v) => `\`${o}="${v}"\``) : []));
  const notInFigma = Object.keys(code.options).filter((o) => !rows.some((r) => r[2] === o)).map((o) => `\`${o}\``);
  summary.push(`| \`${name}\` | ${setName} (${set.variants} variants) | ${rows.length - unmatched.length}/${rows.length} | ${unmatched.length} |`);
  lines.push(`## \`${name}\` ↔ Figma "${setName}"`, '',
    `Figma: page ${set.page}, node \`${set.id}\`, key \`${set.key}\`, ${set.variants} variants. Code: \`${code.source.file}\`, ${Object.keys(code.props).length} props${code.inherits.length ? `, plus ${code.inherits.join(', ')}` : ''}.`, '',
    '| Figma property | Figma value | Code prop | Code value | How |', '|---|---|---|---|---|',
    ...rows.map((r) => `| ${esc(r[0])} | ${esc(r[1])} | ${r[2] === '?' || r[2] === '—' ? r[2] : `\`${r[2]}\``} | ${esc(r[3])} | ${r[4]} |`), '');
  if (missing.length) lines.push(`Code values no Figma variant shows: ${missing.join(', ')}.`, '');
  if (notInFigma.length) lines.push(`Code options with no Figma property: ${notInFigma.join(', ')}.`, '');
}
lines.splice(10, 0, '## Summary', '', '| Component | Figma set | Rows matched | Rows with no match |', '|---|---|---|---|', ...summary, '');
const out = path.join(VAULT, 'reports', `component-mapping-${today}.md`);
fs.writeFileSync(out, lines.join('\n'));
console.log(`wrote ${path.relative(VAULT, out)}: ${PAIRS.length} pairs`);
console.log(summary.join('\n'));
