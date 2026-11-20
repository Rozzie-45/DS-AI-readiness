#!/usr/bin/env node
// Builds the Figma plugin code that brings the library's variables and styles in line with the
// token files (ADR 003). Run scripts/build-tokens.mjs first.
//
// Usage:  node scripts/build-figma-sync.mjs
//
// Writes the code of scripts/figma/sync-tokens.plugin.js with the spec filled in:
// - build/figma/sync-tokens.dry-run.js: changes nothing, reports every change, and stores the spec in
//   the plugin's client storage;
// - build/figma/sync-tokens.apply-stored.js: applies the spec the last dry run stored (small file);
// - build/figma/sync-tokens.apply.js: applies with the spec embedded, if client storage is not available.
// Run them through figma-console (figma_execute) on the library file. Review the dry run before applying.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VAULT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const primitive = JSON.parse(fs.readFileSync(path.join(VAULT, 'tokens', 'primitive.tokens.json'), 'utf8'));
const textFile = JSON.parse(fs.readFileSync(path.join(VAULT, 'tokens', 'text-styles.tokens.json'), 'utf8'));
const template = fs.readFileSync(path.join(VAULT, 'scripts', 'figma', 'sync-tokens.plugin.js'), 'utf8');
const lock = JSON.parse(fs.readFileSync(path.join(VAULT, 'source.lock.json'), 'utf8'));
const commit = lock.magenta?.commit?.slice(0, 7) ?? 'unknown';

// The library's existing collection, and the names its variables had before code paths.
const COLLECTION = 'Magenta DS -v0.1.0';
// Text levels left as they are in Figma. body3: the code renders size lg as 10/12 with size="lg" but
// 11/16 when responsive, so the team left it out of the first sync (2026-11-04).
const EXCLUDE_TEXT_LEVELS = ['body3', 'body3-semibold'];
const LEGACY = { spacing: 'Spacings-gaps/mag-spacings-', radii: 'Border radius/mag-radii-' };
const FIGMA_TYPE = { color: 'COLOR', dimension: 'FLOAT', fontWeight: 'FLOAT', fontFamily: 'STRING' };

const walk = (node, p = []) => Object.entries(node).filter(([k]) => !k.startsWith('$')).flatMap(([k, v]) => (v.$value !== undefined ? [[[...p, k].join('.'), v]] : walk(v, [...p, k])));
const firstSentence = (s = '') => s.replace(/`/g, '').split(/(?<=\.)\s/)[0];

// What a designer or agent sees on the variable in Figma: the roles, or what the token is.
const describe = (t) => {
  const m = t.$extensions.mds;
  if (m.status === 'forbidden') return `Do not use: ${m.forbiddenBy} forbids it. ${firstSentence(t.$description)}`.trim();
  const roles = [...new Set((m.roles ?? []).map((r) => r.role.replace(/`/g, '')))];
  return roles.length ? `Roles: ${roles.join('; ')}.` : firstSentence(t.$description);
};
const valueOf = (t) => {
  if (t.$type === 'color') { const [r, g, b] = t.$value.components; return { r, g, b, a: t.$value.alpha }; }
  if (t.$type === 'dimension') return t.$extensions.mds.px;
  if (t.$type === 'fontFamily') return t.$value[0];
  return t.$value;
};

// The spec is kept small, because it travels inside a figma_execute call: type, scopes and code syntax
// are the same for a whole group, so each variable is only [name, value, description, hidden, code?].
const groups = {};
const variables = [];
const renames = {};
for (const [p, t] of walk(primitive)) {
  const f = t.$extensions.mds.figma;
  if (!f?.variable) continue;
  const [group, key] = [p.split('.')[0], p.split('.').slice(1).join('.')];
  const cssGroup = t.$extensions.mds.cssVar?.slice('--mag-'.length, -(key.replace(/\./g, '-').length + 1)) ?? null;
  groups[group] ??= { type: FIGMA_TYPE[t.$type], scopes: f.scopes, css: cssGroup };
  if (f.codeSyntax?.WEB && f.codeSyntax.WEB !== `var(--mag-${cssGroup}-${key.replace(/\./g, '-')})`) throw new Error(`${p}: code syntax does not follow the group pattern`);
  if (LEGACY[group]) renames[`${LEGACY[group]}${key}`] = f.variable;
  variables.push([f.variable, valueOf(t), describe(t), f.hiddenFromPublishing ? 1 : 0]);
}
// Figma keeps a 0 radius variable that code does not have: code writes 0 (foundations/border.md).
groups['_figma-only'] = { type: 'FLOAT', scopes: ['CORNER_RADIUS'], css: null };
renames[`${LEGACY.radii}none`] = '_figma-only/radius-0';
variables.push(['_figma-only/radius-0', 0, 'Figma only. Code has no token for square corners and writes 0 (foundations/border.md).', 0, '0']);

// Text styles: the font size, line height, letter spacing and font weight variables of each Text
// level and size. Every style also binds fonts/primary.
const varOf = (ref) => ref.slice(1, -1).replace(/\./g, '/');
const textStyles = {};
for (const [p, t] of walk(textFile)) {
  const v = t.$value;
  textStyles[p.replace(/^textStyles\./, '')] = [v.fontSize, v.lineHeight, v.letterSpacing, v.fontWeight].map(varOf);
}

const spec = {
  id: null,
  collection: COLLECTION,
  versionTitle: `Before token sync from code ${commit}`,
  versionDescription: 'Saved by scripts/figma/sync-tokens.plugin.js (ADR 003) before renaming variables, adding variables from tokens/*.tokens.json and binding styles to them.',
  renames,
  groups,
  variables,
  textStyles,
  excludeTextLevels: EXCLUDE_TEXT_LEVELS,
};

spec.id = `${commit}-${crypto.createHash('sha256').update(JSON.stringify(spec)).digest('hex').slice(0, 8)}`;

const outDir = path.join(VAULT, 'build', 'figma');
fs.mkdirSync(outDir, { recursive: true });
// spec.json is for sending the spec in parts when one call cannot carry it; the *-stored files then
// read it from client storage.
fs.writeFileSync(path.join(outDir, 'spec.json'), JSON.stringify(spec));
const files = { 'dry-run': ['dry-run', spec], apply: ['apply', spec], 'dry-run-stored': ['dry-run', null], 'apply-stored': ['apply', null] };
for (const [name, [mode, embedded]] of Object.entries(files)) {
  const code = template.replace('/*SPEC*/ null', JSON.stringify(embedded)).replace("/*MODE*/ 'dry-run'", `'${mode}'`);
  fs.writeFileSync(path.join(outDir, `sync-tokens.${name}.js`), code);
}
console.log(`wrote build/figma/sync-tokens.{dry-run,apply,dry-run-stored,apply-stored}.js and spec.json, spec ${spec.id}: ${variables.length} variables, ${Object.keys(renames).length} renames, ${Object.keys(textStyles).length} text styles.`);
