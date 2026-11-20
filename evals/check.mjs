#!/usr/bin/env node
// Scores one eval run: a .tsx file an agent wrote for a case in evals/cases.
//
// Usage:  node evals/check.mjs <case-id> <file.tsx> [--json]
//         node evals/check.mjs - <file.tsx>      general checks only (used by the /create skill)
//
// Mechanical checks (pass / fail):
//   imports     every component or icon imported from a Magenta package exists
//   expect      every component in expect.components is used; one of each anyOf group is used
//   mustNot     no forbidden pattern (raw HTML controls, the wrong component)
//   requires    every required pattern is present (a prop, a workaround from a note)
//   props       every prop on a Magenta component exists in its contract, with an allowed value
//   size        every Magenta component that has size="responsive" in its contract gets it
//   tokens      node checks/token-audit.mjs on the file reports no errors
// The rubric is printed for a person (or a second model) to score by hand.
// Exit code 1 when a mechanical check fails.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VAULT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [caseId, fileArg] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const asJson = process.argv.includes('--json');
if (!caseId || !fileArg) {
  console.error('Usage: node evals/check.mjs <case-id> <file.tsx> [--json]');
  process.exit(2);
}
// Case id "-" runs only the general checks (imports, props, size, tokens): used for mockups.
const spec = caseId === '-'
  ? { id: 'general', title: 'General checks (no case)', expect: { components: [], anyOf: [] }, mustNot: [{ pattern: '<(button|input|select|textarea|table)[\\s>]', why: 'Use Magenta components, not raw HTML controls' }], requires: [], rubric: [] }
  : JSON.parse(fs.readFileSync(path.join(VAULT, 'evals', 'cases', `${caseId}.json`), 'utf8'));
const file = path.resolve(fileArg);
const code = fs.readFileSync(file, 'utf8');

const index = JSON.parse(fs.readFileSync(path.join(VAULT, 'contracts', 'index.json'), 'utf8'));
const contracts = new Map(index.components.map((c) => [c.name, JSON.parse(fs.readFileSync(path.join(VAULT, 'contracts', c.contract), 'utf8'))]));

// Names imported from Magenta packages (a local component with the same name is not checked).
const ICONS_DIR = path.join(VAULT, '.source', 'magenta', 'packages', 'react-icons', 'src', 'svg');
const icons = new Set(fs.existsSync(ICONS_DIR) ? fs.readdirSync(ICONS_DIR).flatMap((d) => fs.readdirSync(path.join(ICONS_DIR, d)).map((f) => f.replace(/\.[jt]sx?$/, ''))) : []);
const imported = new Set();
const unknownImports = [];
for (const m of code.matchAll(/import\s*(type\s*)?\{([^}]*)\}\s*from\s*['"](@ocean-network-express\/magenta-react[\w-]*)['"]/g)) {
  for (const n of m[2].split(',')) {
    const isType = !!m[1] || /^\s*type\s/.test(n);
    const name = n.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0];
    if (!name) continue;
    imported.add(name);
    // Components and icons must exist; functions, hooks and types are not in the contracts.
    const known = m[3].endsWith('-icons') ? icons.has(name) : contracts.has(name);
    if (!isType && /^[A-Z]/.test(name) && !known) unknownImports.push(`${name} from ${m[3]}`);
  }
}

const GLOBAL_ATTRS = /^(id|key|ref|className|style|children|role|title|tabIndex|hidden|lang|dir|type|name|value|defaultValue|placeholder|form|autoFocus|autoComplete|htmlFor|href|target|rel|src|alt|width|height|min|max|step|required|readOnly|disabled|checked|multiple|accept|scope|colSpan|rowSpan|headers|download|(aria|data)-[\w-]+|on[A-Z]\w*)$/;
function allowedProps(contract, seen = new Set()) {
  const set = new Set(Object.keys(contract.props ?? {}));
  for (const inh of contract.inherits ?? []) {
    // "attributes of <typeof ListItem>" or "Exclude<InputProps, …>" both name a parent component.
    const m = inh.match(/typeof (\w+)/) ?? inh.match(/\b([A-Z]\w*?)Props\b/);
    if (m && contracts.has(m[1]) && !seen.has(m[1])) {
      seen.add(m[1]);
      for (const p of allowedProps(contracts.get(m[1]), seen)) set.add(p);
    }
  }
  return set;
}

const results = [];
const check = (group, ok, msg) => results.push({ group, ok, msg });
const used = (n) => (n.endsWith('(') ? code.includes(n) : new RegExp(`<${n}[\\s/>]`).test(code) && imported.has(n));

// imports
check('imports', unknownImports.length === 0, unknownImports.length ? `not exported by Magenta: ${unknownImports.join(', ')}` : 'every imported component exists');
// expect
for (const n of spec.expect.components) check('expect', used(n), `uses ${n}`);
for (const group of spec.expect.anyOf ?? []) check('expect', group.some(used), `uses one of ${group.join(' / ')}`);
// mustNot / requires
for (const r of spec.mustNot ?? []) check('mustNot', !new RegExp(r.pattern).test(code), r.why);
for (const r of spec.requires ?? []) check('requires', new RegExp(r.pattern).test(code), r.why);

// props, values and size on Magenta components
const lineOf = (i) => code.slice(0, i).split('\n').length;
let propErrors = 0;
let sizeErrors = 0;
for (const tag of code.matchAll(/<([A-Z][A-Za-z0-9]*)\b((?:[^<>{}]|\{(?:[^{}]|\{[^{}]*\})*\})*?)\/?>/g)) {
  const name = tag[1];
  if (!imported.has(name) || !contracts.has(name)) continue;
  const contract = contracts.get(name);
  const allowed = allowedProps(contract);
  const spreads = (contract.inherits ?? []).length > 0;
  let attrs = tag[2].replace(/"[^"]*"|'[^']*'/g, '""');
  while (/\{[^{}]*\}/.test(attrs)) attrs = attrs.replace(/\{[^{}]*\}/g, '""');
  for (const a of attrs.matchAll(/(?:^|\s)([a-zA-Z][\w-]*)(?==|\s|$)/g)) {
    const p = a[1];
    if (allowed.has(p) || (spreads && GLOBAL_ATTRS.test(p)) || /^(key|ref|children)$/.test(p)) continue;
    propErrors++;
    check('props', false, `L${lineOf(tag.index)} <${name} ${p}>: not a prop of ${name}`);
  }
  for (const v of tag[2].matchAll(/(?:^|\s)([a-zA-Z][\w-]*)="([^"]*)"/g)) {
    const values = contract.props?.[v[1]]?.values; // the prop's type; recipe options can be partial (InlineBanner color)
    if (Array.isArray(values) && values.length && values.every((x) => typeof x === 'string') && !values.includes(v[2])) {
      propErrors++;
      check('props', false, `L${lineOf(tag.index)} <${name} ${v[1]}="${v[2]}">: allowed ${values.join(', ')}`);
    }
  }
  const srcFile = contract.source?.file ? path.join(VAULT, '.source', 'magenta', contract.source.file) : null;
  // Parts that read their size from the parent (`sizeProp ?? ctx?.size`) need no size of their own.
  // Buttons do so only inside ButtonGroup or CompactWrapper; elsewhere they need size="responsive".
  const srcText = srcFile && fs.existsSync(srcFile) ? fs.readFileSync(srcFile, 'utf8') : '';
  const readsParentSize = /size(Prop)?\s*\?\?\s*\w*(ctx|context|Context)/.test(srcText);
  const sizeFromParent = readsParentSize && (!/useButtonContext/.test(srcText) || /<(ButtonGroup|CompactWrapper)[\s>]/.test(code));
  const sizeValues = sizeFromParent ? [] : contract.props?.size?.values ?? contract.options?.size?.values ?? [];
  const sizeType = contract.props?.size?.type ?? '';
  if ((sizeValues.includes('responsive') || (!sizeFromParent && /'responsive'/.test(sizeType))) && !/\ssize="responsive"/.test(tag[2]) && !/\ssize=\{/.test(tag[2])) {
    sizeErrors++;
    check('size', false, `L${lineOf(tag.index)} <${name}> has no size="responsive"`);
  }
}
if (!propErrors) check('props', true, 'all props exist in the contracts');
if (!sizeErrors) check('size', true, 'size="responsive" on every component that supports it');

// tokens
let auditOut = '';
let auditOk = true;
try {
  auditOut = execFileSync('node', [path.join(VAULT, 'checks', 'token-audit.mjs'), file, '--quiet'], { encoding: 'utf8' });
} catch (e) {
  auditOk = false;
  auditOut = e.stdout ?? String(e);
}
const summary = auditOut.trim().split('\n').pop();
check('tokens', auditOk, `token-audit: ${summary}`);

// ---------- output ----------
const passed = results.filter((r) => r.ok).length;
if (asJson) {
  console.log(JSON.stringify({ case: spec.id, file: path.relative(VAULT, file), passed, total: results.length, results, rubric: spec.rubric }, null, 2));
} else {
  console.log(`${spec.id}: ${spec.title}\n${path.relative(VAULT, file)}\n`);
  for (const r of results) console.log(`  ${r.ok ? 'PASS' : 'FAIL'} ${r.group.padEnd(9)} ${r.msg}`);
  console.log(`\nMechanical score: ${passed}/${results.length}`);
  console.log('\nRubric (score by hand, 0–2 each):');
  for (const r of spec.rubric) console.log(`  [ ] ${r}`);
}
process.exit(results.every((r) => r.ok) ? 0 : 1);
