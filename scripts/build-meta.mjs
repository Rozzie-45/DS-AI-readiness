#!/usr/bin/env node
// Builds build/meta/<name>.meta.json: one machine-readable record per component, merged from the
// package contract (contracts/<Name>.json, generated) and the component note (components/<note>.md,
// authored). See schemas/component.schema.json for each field and where it comes from.
//
// Usage:  node scripts/build-meta.mjs [--check]
//
// Never edit build/meta by hand: change the note (judgment) or rerun build-contracts (code facts),
// then rerun this script. --check rebuilds in memory and exits 1 if a file on disk is out of date.
//
// Which note covers which export: the note whose `component` is the export; otherwise the first
// note that lists it in related / can_contain / required_children; otherwise the note that names it
// in backticks most often. Exports with no component file (constants such as FeedbackMessageType,
// tiptap extensions) get no meta file. Output has no timestamps, so a rebuild with no source change
// writes identical files.
//
// The output is validated against the schema with ajv when the prototype workspace has it installed.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const VAULT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(VAULT, 'build', 'meta');
const check = process.argv.includes('--check');

// ---------- sources ----------

const index = JSON.parse(fs.readFileSync(path.join(VAULT, 'contracts', 'index.json'), 'utf8'));
const contracts = new Map(index.components.map((c) => [c.name, JSON.parse(fs.readFileSync(path.join(VAULT, 'contracts', c.contract), 'utf8'))]));

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  const fm = {};
  if (!m) return fm;
  let key = null;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (kv) {
      key = kv[1];
      const v = kv[2].trim();
      fm[key] = v === '[]' ? [] : v.replace(/^"(.*)"$/, '$1');
      continue;
    }
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && key) {
      if (!Array.isArray(fm[key])) fm[key] = [];
      fm[key].push(item[1].trim().replace(/^"(.*)"$/, '$1'));
    }
  }
  return fm;
}

const notes = fs
  .readdirSync(path.join(VAULT, 'components'))
  .filter((f) => f.endsWith('.md'))
  .sort()
  .map((f) => {
    const text = fs.readFileSync(path.join(VAULT, 'components', f), 'utf8');
    const body = text.replace(/^---\n[\s\S]*?\n---\n/, '').split('<!-- GENERATED:START')[0];
    return { file: `components/${f}`, fm: parseFrontmatter(text), body, text };
  });

// ---------- markdown helpers ----------

function h2(body, heading) {
  const re = new RegExp('^## ' + heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$', 'm');
  const m = re.exec(body);
  if (!m) return '';
  const rest = body.slice(m.index + m[0].length);
  const next = rest.search(/^## /m);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}
function h3(section, heading) {
  const re = new RegExp('^### ' + heading + '\\s*$', 'm');
  const m = re.exec(section);
  if (!m) return '';
  const rest = section.slice(m.index + m[0].length);
  const next = rest.search(/^#{2,3} /m);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}
const stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, '').trim();
// Top-level bullets, with their indented continuation lines joined.
function bullets(s) {
  const out = [];
  for (const line of stripComments(s).split('\n')) {
    const b = line.match(/^[-*] (.+)$/) ?? line.match(/^\d+\. (.+)$/);
    if (b) out.push(b[1].trim());
    else if (out.length && /^\s{2,}\S/.test(line)) out[out.length - 1] += ' ' + line.trim();
  }
  return out;
}
// Bullets if there are any, otherwise the paragraphs.
const items = (s) => {
  const b = bullets(s);
  return b.length ? b : stripComments(s).split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter((p) => p && !p.startsWith('|') && !p.startsWith('#'));
};
const prose = (s) => stripComments(s).replace(/\n{3,}/g, '\n\n').trim();
function table(s) {
  const rows = stripComments(s).split('\n').filter((l) => l.trim().startsWith('|'));
  if (rows.length < 3) return { header: [], rows: [] };
  const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  return { header: cells(rows[0]), rows: rows.slice(2).map(cells) };
}
const firstToken = (c) => c.match(/`([a-zA-Z]+\.[A-Za-z0-9.\-]+)`/)?.[1];
const unwrap = (c) => c.replace(/`/g, '').trim();

// ---------- which note covers which export ----------

function noteFor(name) {
  const own = notes.find((n) => n.fm.component === name);
  if (own) return own;
  // The note that writes about the export most covers it. Several notes list a part in `related`
  // (Breadcrumb lists DropdownMenu, Divider lists Td), so `related` only decides when no note names it.
  const listed = notes.filter((n) => ['related', 'can_contain', 'required_children'].some((k) => Array.isArray(n.fm[k]) && n.fm[k].includes(name)));
  let best = null;
  let bestCount = 0;
  for (const n of notes) {
    const count = (n.text.match(new RegExp('`' + name + '`', 'g')) ?? []).length;
    if (count > bestCount || (count === bestCount && count > 0 && listed.includes(n) && !listed.includes(best))) [best, bestCount] = [n, count];
  }
  return best ?? listed[0] ?? null;
}

// ---------- build one record ----------

function build(name, contract, note) {
  const { fm, body } = note;
  const main = fm.component === name; // used for related below

  const options = {};
  const props = {};
  for (const [k, p] of Object.entries(contract.props ?? {})) {
    const values = Array.isArray(p.values) && p.values.length && p.values.every((v) => typeof v === 'string') ? p.values : null;
    if (values) {
      options[k] = { values };
      if (p.default !== undefined) options[k].default = String(p.default);
      if (p.required) options[k].required = true;
      if (p.description) options[k].description = p.description;
    } else {
      props[k] = { type: p.type };
      if (p.required) props[k].required = true;
      if (p.default !== undefined) props[k].default = p.default;
      if (p.description) props[k].description = p.description;
      if (p.slot) props[k].slot = true;
    }
  }

  const when = items(h2(body, 'When to use'));
  const avoid = items(h2(body, 'When not to use'));
  const why = h2(body, 'Why this design');
  const tradeoffs = bullets(h3(why, 'Trade-offs'));
  const whySummary = prose(why.split(/^### /m)[0]);
  const a11y = h2(body, 'Accessibility');

  const contrast = table(h3(a11y, 'Contrast pairs'));
  const ratioIsMin = /min/i.test(contrast.header[2] ?? '');
  const contrastPairs = contrast.rows
    .map((r) => {
      const foreground = firstToken(r[0] ?? '');
      const background = firstToken(r[1] ?? '');
      const n = parseFloat((r[2] ?? '').match(/[\d.]+/)?.[0] ?? '');
      if (!foreground || !background || Number.isNaN(n)) return null;
      return ratioIsMin ? { foreground, background, minRatio: n } : { foreground, background, minRatio: 4.5, measured: { light: n } };
    })
    .filter(Boolean);

  const figmaTable = table(h2(body, 'Figma to code mapping'));
  const propMap = figmaTable.rows
    .filter((r) => r.length >= 4 && r[0] && r[2])
    .map((r) => ({ figmaProperty: unwrap(r[0]), figmaValue: unwrap(r[1]), codeProp: unwrap(r[2]), codeValue: unwrap(r[3]) }));

  const meta = {
    $schema: '../../schemas/component.schema.json',
    name,
    // The note's description covers every export it documents; JSDoc descriptions in the code are
    // often implementation notes ("wrapper for InnerDateTimePicker … ref system").
    description: fm.description || contract.description,
    category: fm.category,
    status: fm.status,
    source: {
      package: contract.source.package,
      version: contract.source.version,
      export: contract.source.export,
      importPath: contract.source.importPath,
      ...(contract.source.file ? { file: contract.source.file } : {}),
    },
    options,
    props,
    usage: {
      when: when.length ? when : [fm.description],
      avoid,
      alternatives: Array.isArray(fm.alternatives) ? fm.alternatives : [],
    },
  };
  if (whySummary || tradeoffs.length) meta.rationale = { ...(whySummary ? { summary: whySummary } : {}), ...(tradeoffs.length ? { tradeoffs } : {}) };
  meta.composition = {
    canContain: Array.isArray(fm.can_contain) ? fm.can_contain : [],
    cannotContain: Array.isArray(fm.cannot_contain) ? fm.cannot_contain : [],
    required: Array.isArray(fm.required_children) ? fm.required_children : [],
    ...(h2(body, 'Composition') ? { order: prose(h2(body, 'Composition')) } : {}),
  };
  meta.related = [...new Set([...(Array.isArray(fm.related) ? fm.related : []), ...(main ? [] : [fm.component])])].filter((n) => n && n !== name);
  if (contract.tokens?.used?.length) meta.tokens = { used: contract.tokens.used };
  meta.accessibility = {
    role: fm.a11y_role || 'none',
    ...(bullets(h3(a11y, 'Keyboard')).length ? { keyboard: bullets(h3(a11y, 'Keyboard')) } : {}),
    ...(prose(h3(a11y, 'Accessible name')) ? { accessibleName: prose(h3(a11y, 'Accessible name')) } : {}),
    ...(prose(h3(a11y, 'Focus')) ? { focus: prose(h3(a11y, 'Focus')) } : {}),
    ...(contrastPairs.length ? { contrastPairs } : {}),
  };
  meta.figma = { ...(fm.figma_url ? { url: fm.figma_url } : {}), ...(propMap.length ? { propMap } : {}) };
  if (contract.examples?.length) meta.examples = contract.examples.map((e) => ({ title: e.title, path: e.path }));
  meta.deprecated = fm.deprecated_by ? { replacedBy: fm.deprecated_by, since: fm.deprecated_since || '', ...(h2(body, 'Migration') ? { migration: prose(h2(body, 'Migration')) } : {}) } : false;
  meta.docs = note.file;
  meta.review = {
    status: fm.review_status,
    ...(fm.reviewed_by ? { reviewedBy: fm.reviewed_by } : {}),
    ...(fm.reviewed_on ? { reviewedOn: fm.reviewed_on } : {}),
  };
  return meta;
}

// ---------- run ----------

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
const outputs = new Map();
const skipped = [];
const noNote = [];
for (const [name, contract] of contracts) {
  if (!contract.source?.file) {
    skipped.push(name);
    continue;
  }
  const note = noteFor(name);
  if (!note) {
    noNote.push(name);
    continue;
  }
  outputs.set(`${kebab(name)}.meta.json`, JSON.stringify(build(name, contract, note), null, 2) + '\n');
}

// Schema validation with ajv, when available in the prototype workspace.
const ajvPath = path.join(VAULT, '.prototype', 'magenta', 'node_modules', '.pnpm', 'ajv@8.17.1', 'node_modules', 'ajv', 'dist', '2020.js');
let invalid = 0;
if (fs.existsSync(ajvPath)) {
  const Ajv = (await import(pathToFileURL(ajvPath).href)).default.default ?? (await import(pathToFileURL(ajvPath).href)).default;
  const ajv = new Ajv({ strict: false, allErrors: true, validateFormats: false });
  const validate = ajv.compile(JSON.parse(fs.readFileSync(path.join(VAULT, 'schemas', 'component.schema.json'), 'utf8')));
  for (const [file, json] of outputs) {
    if (!validate(JSON.parse(json))) {
      invalid++;
      console.error(`${file}: ${validate.errors.slice(0, 3).map((e) => `${e.instancePath} ${e.message}`).join('; ')}`);
    }
  }
} else {
  console.warn('ajv not found (run scripts/setup-prototype.mjs); schema validation skipped.');
}

if (check) {
  const stale = [];
  const existing = fs.existsSync(OUT) ? new Set(fs.readdirSync(OUT).filter((f) => f.endsWith('.meta.json'))) : new Set();
  for (const [file, json] of outputs) {
    const p = path.join(OUT, file);
    if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== json) stale.push(file);
    existing.delete(file);
  }
  stale.push(...[...existing].map((f) => `${f} (no longer built)`));
  console.log(stale.length ? `Out of date: ${stale.join(', ')}. Run node scripts/build-meta.mjs.` : `build/meta is up to date (${outputs.size} files).`);
  process.exit(stale.length || invalid ? 1 : 0);
}

fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.meta.json') && !outputs.has(f)) fs.unlinkSync(path.join(OUT, f));
for (const [file, json] of outputs) fs.writeFileSync(path.join(OUT, file), json);
console.log(`${outputs.size} meta files in build/meta. ${invalid} invalid against the schema.`);
console.log(`No component file (no meta): ${skipped.join(', ') || 'none'}.`);
if (noNote.length) console.log(`No note covers: ${noNote.join(', ')}.`);
process.exit(invalid ? 1 : 0);
