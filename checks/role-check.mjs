#!/usr/bin/env node
// Checks the color roles in foundations/color.md against the code: for every role row, some recipe
// must use that palette token for that kind of property (text, background, border, icon, focus ring)
// and, when the role names a state (hover, pressed, disabled…), in that state. The code is the source
// (ADR 005): a role the code does not back is either page-level (products apply it, no recipe does)
// or wrong. Reads the recipe styles from contracts/.
//
// Usage:  node checks/role-check.mjs [--strict]
// Prints every role with no evidence in the code. --strict exits 1 when there is one that is not
// marked page level (a "page" or "marketing" word in the role, or listed in the note's
// <!-- role-check: page level: … --> comment).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VAULT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--strict');

// ---------- recipe styles ----------
const index = JSON.parse(fs.readFileSync(path.join(VAULT, 'contracts', 'index.json'), 'utf8'));
const styles = [];
const seen = new Set();
for (const c of index.components) {
  const contract = JSON.parse(fs.readFileSync(path.join(VAULT, 'contracts', c.contract), 'utf8'));
  for (const s of contract.styles ?? []) {
    const k = `${s.recipe}${JSON.stringify(s)}`;
    if (!seen.has(k)) { seen.add(k); styles.push(s); }
  }
}
const KIND = {
  text: /^color$/,
  background: /^(bg|background|backgroundColor)$/,
  border: /^(border\w*|outline\w*|boxShadow|stroke)$/,
  icon: /^(color|fill|stroke)$/,
  focus: /^(outline\w*|boxShadow|border\w*)$/,
};
const STATE = {
  hover: /_hover|:hover/, pressed: /_active|:active/, visited: /_visited|:visited/,
  disabled: /_disabled|disabled|aria-disabled="true"/, focus: /_focus|:focus/, selected: /selected|_checked|checked/,
};
function used(token, kinds, state) {
  return styles.filter((s) => (s.tokens ?? []).includes(token) && kinds.some((k) => KIND[k].test(s.property))
    && (!state || STATE[state].test(`${s.state ?? ''} ${JSON.stringify(s.when ?? {})}`)));
}

// ---------- roles ----------
const note = fs.readFileSync(path.join(VAULT, 'foundations', 'color.md'), 'utf8');
const section = note.slice(note.indexOf('## Semantic roles'), note.indexOf('\n## ', note.indexOf('## Semantic roles') + 5));
const PALETTES = ['blue', 'green', 'neutral', 'orange', 'primary', 'purple', 'red', 'royal', 'secondary'];
const STATUSES = ['blue', 'green', 'orange', 'red'];
const rows = [];
for (const line of section.split('\n')) {
  const cells = line.split('|').slice(1, -1).map((c) => c.trim());
  if (cells.length < 2 || cells[0] === 'Role' || /^-+$/.test(cells[0]) || cells[0] === 'Token') continue;
  const tokens = [...cells[1].matchAll(/`(colors\.[^`]+)`/g)].map((m) => m[1]);
  if (tokens.length) rows.push({ role: cells[0], tokens });
}

const kindsOf = (role) => {
  const r = role.toLowerCase();
  if (/focus ring/.test(r)) return ['focus'];
  const k = [];
  if (/border|divider|outline|line\b|connector/.test(r)) k.push('border');
  if (/background|layer|overlay|skeleton|hover on|track|thumb|prefix bar|fill\)|indicator|chart|decoration/.test(r)) k.push('background');
  if (/icon/.test(r)) k.push('icon');
  if (/text|message|label|heading|title|subtitle|placeholder|link|navigation|mark/.test(r)) k.push('text');
  return k.length ? k : ['text', 'background', 'border', 'icon'];
};
const stateOf = (role) => {
  const r = role.toLowerCase();
  return ['hover', 'pressed', 'visited', 'disabled', 'selected'].find((s) => new RegExp(`\\b${s}\\b`).test(r)) ?? null;
};
const expand = (t) => (t.includes('<palette>') ? PALETTES.map((p) => t.replace('<palette>', p)) : t.includes('<status>') ? STATUSES.map((p) => t.replace('<status>', p)) : [t]);
// Roles the note marks as set by products, not components: <!-- role-check: page level: A; B -->
const marked = (note.match(/<!--\s*role-check:\s*page level:\s*([^>]*?)-->/) ?? [])[1]?.split(';').map((x) => x.trim()).filter(Boolean) ?? [];
const PAGE_LEVEL_WORDS = /page|marketing|feature background|chart|decoration|navigation text/i;
const PAGE_LEVEL = { test: (role) => PAGE_LEVEL_WORDS.test(role) || marked.includes(role) };

let backed = 0;
const unbacked = [];
for (const { role, tokens } of rows) {
  const kinds = kindsOf(role);
  const state = stateOf(role);
  const hits = tokens.flatMap(expand).flatMap((t) => used(t, kinds, state));
  // A state the code expresses some other way (a variant prop) still counts when the token is used in that kind.
  const loose = hits.length ? hits : tokens.flatMap(expand).flatMap((t) => used(t, kinds, null));
  if (hits.length) backed++;
  else unbacked.push({ role, tokens, kinds, state, loose: [...new Set(loose.map((s) => s.recipe))].slice(0, 5), pageLevel: PAGE_LEVEL.test(role) });
}

console.log(`foundations/color.md: ${rows.length} roles, ${backed} backed by the recipes, ${unbacked.length} without evidence.\n`);
for (const u of unbacked) {
  const why = u.pageLevel ? 'page level: no recipe sets it (products do)' : u.loose.length ? `used as ${u.kinds.join('/')} by ${u.loose.join(', ')} but not in the "${u.state}" state` : `no recipe uses ${u.tokens.join(', ')} as ${u.kinds.join('/')}`;
  console.log(`  ${u.pageLevel ? 'info' : 'WARN'}  ${u.role} → ${u.tokens.join(', ')}: ${why}`);
}
const real = unbacked.filter((u) => !u.pageLevel);
if (real.length) console.log(`\n${real.length} role(s) to check against the code: fix the note if the code does something else (ADR 005).`);
process.exit(strict && real.length ? 1 : 0);
