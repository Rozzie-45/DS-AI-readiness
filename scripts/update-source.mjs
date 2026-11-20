#!/usr/bin/env node
// Replaces .source/magenta with a newer snapshot of the Magenta repo and writes a report
// of what changed, so the notes that depend on those files can be reviewed in one pass.
//
// Usage:  node scripts/update-source.mjs <path/to/magenta-develop.zip> [--force]
//
// Get the zip from https://github.com/ocean-network-express/magenta → branch develop →
// Code → Download ZIP. The previous snapshot is kept in .source/magenta.prev.

import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VAULT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = path.join(VAULT, '.source');
const CURRENT = path.join(SOURCE_DIR, 'magenta');
const PREVIOUS = path.join(SOURCE_DIR, 'magenta.prev');
const INCOMING = path.join(SOURCE_DIR, '.incoming');
const LOCK = path.join(VAULT, 'source.lock.json');
const REPORTS = path.join(VAULT, 'reports');

const [zipArg, ...flags] = process.argv.slice(2);
if (!zipArg) {
  console.error('Usage: node scripts/update-source.mjs <path/to/magenta-develop.zip> [--force]');
  process.exit(1);
}
const zip = path.resolve(zipArg);
const force = flags.includes('--force');

// GitHub writes the commit SHA as the zip comment.
const comment = execFileSync('unzip', ['-z', zip], { encoding: 'utf8' });
const commit = comment.match(/\b[0-9a-f]{40}\b/)?.[0];
if (!commit) {
  console.error('No commit SHA in the zip comment. Download the zip from GitHub (Code → Download ZIP).');
  process.exit(1);
}

const lock = JSON.parse(fs.readFileSync(LOCK, 'utf8'));
const before = lock.magenta;
if (before.commit === commit && !force) {
  console.log(`Already at ${commit.slice(0, 7)}. Nothing to do. Use --force to re-import anyway.`);
  process.exit(0);
}

// Unpack into a fresh folder next to the current snapshot.
fs.rmSync(INCOMING, { recursive: true, force: true });
fs.mkdirSync(INCOMING, { recursive: true });
execFileSync('unzip', ['-q', zip, '-d', INCOMING]);
const tops = fs.readdirSync(INCOMING).filter((d) => !d.startsWith('__MACOSX'));
if (tops.length !== 1) throw new Error(`Expected one top folder in the zip, found: ${tops.join(', ')}`);
const next = path.join(INCOMING, tops[0]);

// Compare file contents between the two snapshots.
const hashTree = (root) => {
  const out = new Map();
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile()) out.set(path.relative(root, p), crypto.createHash('sha1').update(fs.readFileSync(p)).digest('hex'));
    }
  };
  walk(root);
  return out;
};
const oldFiles = hashTree(CURRENT);
const newFiles = hashTree(next);
const changes = [];
for (const [f, h] of newFiles) {
  if (!oldFiles.has(f)) changes.push({ file: f, kind: 'added' });
  else if (oldFiles.get(f) !== h) changes.push({ file: f, kind: 'modified' });
}
for (const f of oldFiles.keys()) if (!newFiles.has(f)) changes.push({ file: f, kind: 'removed' });

// Group changes by what they affect in the docs.
const areaOf = (f) => {
  let m;
  if (f === 'packages/css/src/tokens.ts') return 'Tokens';
  if ((m = f.match(/^packages\/css\/src\/recipes\/([^/.]+)/))) return `Recipe · ${m[1]}`;
  if ((m = f.match(/^packages\/(react[^/]*)\/src\/components\/([^/]+)\//))) return `Component · ${m[2]} (${m[1]})`;
  if ((m = f.match(/^packages\/docs\/stories\/([^/]+)\/([^/]+)\//))) return `Docs · ${m[1]}/${m[2]}`;
  if (f.startsWith('packages/docs/assets/')) return 'Docs images';
  if (/(^|\/)package\.json$/.test(f)) return 'Package manifests';
  if (/(^|\/)CHANGELOG\.md$/.test(f)) return 'Changelogs';
  return 'Other';
};
const areas = new Map();
for (const c of changes) {
  const a = areaOf(c.file);
  if (!areas.has(a)) areas.set(a, []);
  areas.get(a).push(c);
}

// Notes whose `sources` frontmatter lists a changed file, or a folder that contains one.
const readSources = (file) => {
  const fm = fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const block = fm.match(/^sources:\s*\n((?:\s+-\s+.+\n?)+)/m)?.[1] ?? '';
  return [...block.matchAll(/-\s+["']?([^"'\n]+?)["']?\s*$/gm)].map((m) => m[1].replace(/\/$/, ''));
};
const notesToReview = new Map();
for (const dir of ['components', 'foundations', 'patterns']) {
  const abs = path.join(VAULT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const name of fs.readdirSync(abs).filter((n) => n.endsWith('.md'))) {
    const note = `${dir}/${name}`;
    for (const src of readSources(path.join(abs, name))) {
      const hits = changes.filter((c) => c.file === src || c.file.startsWith(`${src}/`));
      if (hits.length) notesToReview.set(note, [...(notesToReview.get(note) ?? []), ...hits]);
    }
  }
}

// Package versions in the new snapshot.
const packages = {};
for (const d of fs.readdirSync(path.join(next, 'packages'))) {
  const f = path.join(next, 'packages', d, 'package.json');
  if (!fs.existsSync(f)) continue;
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  packages[j.name] = { path: `packages/${d}`, version: j.version ?? null, published: !j.private };
}

// Write the report.
const today = new Date().toISOString().slice(0, 10);
const sign = { added: '+', modified: '~', removed: '−' };
const lines = [
  '---',
  'type: report',
  `date: ${today}`,
  `from_commit: ${before.commit}`,
  `to_commit: ${commit}`,
  '---',
  '',
  `# Source update ${today}`,
  '',
  `Magenta \`${before.branch}\`: \`${before.commit.slice(0, 7)}\` → \`${commit.slice(0, 7)}\`. ${changes.length} files changed.`,
  '',
  '## Notes to review',
  '',
  ...(notesToReview.size
    ? [...notesToReview].map(([note, hits]) => `- [${note}](../${note}): ${hits.map((c) => `${sign[c.kind]} \`${c.file}\``).join(', ')}`)
    : ['None of the notes list a changed file in `sources`.']),
  '',
  '## Package versions',
  '',
  '| Package | Before | After |',
  '|---|---|---|',
  ...Object.entries(packages)
    .filter(([, p]) => p.published)
    .map(([n, p]) => {
      const was = before.packages?.[n]?.version ?? '—';
      return `| \`${n}\` | ${was} | ${p.version === was ? p.version : `**${p.version}**`} |`;
    }),
  '',
  '## What changed',
  '',
  'Notes that describe these areas need a review. `+` added, `~` modified, `−` removed.',
  '',
];
for (const [area, list] of [...areas].sort(([a], [b]) => a.localeCompare(b))) {
  lines.push(`### ${area} (${list.length})`, '');
  const shown = area === 'Docs images' || area === 'Other' ? list.slice(0, 10) : list;
  for (const c of shown) lines.push(`- ${sign[c.kind]} \`${c.file}\``);
  if (shown.length < list.length) lines.push(`- … and ${list.length - shown.length} more`);
  lines.push('');
}
if (!changes.length) lines.push('No file changed.', '');
fs.mkdirSync(REPORTS, { recursive: true });
const reportPath = path.join(REPORTS, `source-update-${today}-${commit.slice(0, 7)}.md`);
fs.writeFileSync(reportPath, lines.join('\n'));

// Swap snapshots: current → previous, incoming → current.
fs.rmSync(PREVIOUS, { recursive: true, force: true });
fs.renameSync(CURRENT, PREVIOUS);
fs.renameSync(next, CURRENT);
fs.rmSync(INCOMING, { recursive: true, force: true });

lock.magenta = {
  ...before,
  commit,
  snapshot: {
    file: path.basename(zip),
    sha256: crypto.createHash('sha256').update(fs.readFileSync(zip)).digest('hex'),
    importedOn: today,
  },
  packages,
};
fs.writeFileSync(LOCK, JSON.stringify(lock, null, 2) + '\n');

console.log(`Updated to ${commit.slice(0, 7)}. ${changes.length} files changed.`);
console.log(`Report: ${path.relative(VAULT, reportPath)}`);
