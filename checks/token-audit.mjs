#!/usr/bin/env node
// Finds hardcoded visual values in style code and suggests the Magenta token to use instead.
//
// Usage:  node checks/token-audit.mjs [path ...] [--report[=file.md]] [--quiet]
//
// With no path, it audits the Magenta snapshot in .source/magenta (packages that ship styles).
// Give one or more files or folders to audit product code instead.
// Reads .css, .scss, .ts, .tsx, .js and .jsx. In TS and JS it checks Panda style properties
// (`p: '12px'`, `color: '#333'`); in CSS it checks declarations (`padding: 12px;`).
//
// Errors: hardcoded colors, spacing, font size and weight, line height, letter spacing, radius,
// border width, shadows and z-index that have a token. Warnings: values with no token yet
// (durations, easing), values off the scale, and raw values that equal a local-stacking token.
// Exit code 1 when there is at least one error.
//
// Tokens come from tokens/primitive.tokens.json, which scripts/build-tokens.mjs builds from the
// Magenta code and the foundation notes. Suggestions name the token's role, and never name a token
// whose status is forbidden. CSS variables that look like Magenta tokens but do not exist, and
// fallbacks on Magenta variables (`var(--mag-spacing-12, 12px)`), are errors.
//
// The report groups findings by how to fix them: swap for the token with the same value, use the
// closest token, or decide (no token fits). Every finding is listed per file in an appendix.
//
// To accept a value on purpose, put `token-audit-ignore` in a comment on that line or the line above.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VAULT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(VAULT, '.source', 'magenta');
const TOKENS_FILE = path.join(VAULT, 'tokens', 'primitive.tokens.json');
const DEFAULT_ROOTS = ['css/src', 'react/src', 'react-dates/src', 'react-data-grid/src', 'react-text-editor/src', 'react-templates/src', 'magenta/src'].map((p) => path.join(SOURCE, 'packages', p));
const EXTENSIONS = new Set(['.css', '.scss', '.ts', '.tsx', '.js', '.jsx']);
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '__tests__', '__test__', '.git']);
const SKIP_FILES = /(\.test\.|\.spec\.|\.stories\.|\.d\.ts$|[\\/]tokens\.ts$|[\\/]breakpoints\.ts$)/;

// ---------- arguments ----------

const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const reportArg = args.find((a) => a.startsWith('--report'));
const targets = args.filter((a) => !a.startsWith('--')).map((a) => path.resolve(a));
const roots = targets.length ? targets : DEFAULT_ROOTS.filter((p) => fs.existsSync(p));

// ---------- tokens ----------

if (!fs.existsSync(TOKENS_FILE)) {
  console.error('tokens/primitive.tokens.json is missing. Run node scripts/build-tokens.mjs first.');
  process.exit(2);
}
// Rebuild the tokens.ts shape ({ group: { key: { value } } }) from the token file, plus roles and
// forbidden tokens. Values are written the way code writes them: hex colors, px dimensions.
const tokens = {};
const roles = new Map();
const noRole = new Set();
const knownVars = new Set();
const pathByVar = new Map();
const hex8 = ({ hex, alpha }) => (alpha < 1 ? hex + Math.round(alpha * 255).toString(16).padStart(2, '0') : hex);
(function collect(node, p) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (v.$value === undefined) { collect(v, [...p, k]); continue; }
    const m = v.$extensions.mds;
    const [group, ...rest] = [...p, k];
    const value = v.$type === 'color' ? (m.codeValue ?? hex8(v.$value)) : v.$type === 'dimension' ? `${m.px}px` : (m.codeValue ?? String(v.$value));
    let target = (tokens[group] ??= {});
    for (const r of rest.slice(0, -1)) target = (target[r] ??= {});
    target[rest.at(-1)] = { value };
    const tokenPath = [group, ...rest].join('.');
    if (m.cssVar) { knownVars.add(m.cssVar); pathByVar.set(m.cssVar, [group, ...rest].join('.')); }
    if (m.status === 'forbidden') noRole.add(tokenPath);
    else if (m.roles) roles.set(tokenPath, m.roles.map((r) => r.role));
  }
})(JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8')), []);

const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const cssVar = (category, key) => `--mag-${kebab(category)}-${String(key).replace(/\./g, '-')}`;
const toPx = (v) => { const m = String(v).trim().match(/^(-?[\d.]+)(px|rem)?$/); return m ? parseFloat(m[1]) * (m[2] === 'rem' ? 16 : 1) : null; };

const colorList = []; // { path, hex }
for (const [palette, levels] of Object.entries(tokens.colors)) {
  if (levels.value !== undefined) colorList.push({ path: `colors.${palette}`, hex: levels.value });
  else for (const [level, t] of Object.entries(levels)) colorList.push({ path: `colors.${palette}.${level}`, hex: t.value });
}
const byPx = (group) => new Map(Object.entries(tokens[group]).map(([k, t]) => [toPx(t.value), k]).filter(([px]) => px !== null));
const spacingByPx = byPx('spacing');
const fontSizeByPx = byPx('fontSizes');
const lineHeightByPx = byPx('lineHeights');
const radiusByPx = byPx('radii');
const borderByPx = byPx('borders');
const letterSpacingByPx = byPx('letterSpacings');
const zIndexByValue = new Map(Object.entries(tokens.zIndex).map(([k, t]) => [Number(t.value), k]));
const shadowByValue = new Map(Object.entries(tokens.shadows).map(([k, t]) => [t.value.replace(/\s+/g, ' ').trim(), k]));

const withRole = (tokenPath) => {
  const r = roles.get(tokenPath);
  return r ? `${tokenPath} (${r[0]}${r.length > 1 ? ` +${r.length - 1} more` : ''})` : tokenPath;
};

// ---------- value checks ----------

const OK_WORDS = /^(0|0px|none|auto|inherit|initial|unset|revert|transparent|currentcolor|normal|fit-content|max-content|min-content)$/i;
const LOOKS_LIKE_TOKEN = /^--ma[a-z]-|mag-|(?:^|-)(colors|spacings?|radii|borders|shadows|font-sizes|line-heights|letter-spacings|font-weights|z-index)-/i;
const isTokenRef = (v) => /token\(|\{[a-zA-Z]+\.[^}]+\}|var\(--mag-/.test(v);

const hexToRgb = (hex) => {
  let h = hex.replace('#', '');
  if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const alphaOf = (raw) => {
  const hex = raw.match(/^#(?:[0-9a-f]{4}|[0-9a-f]{8})$/i);
  if (hex) { const h = raw.slice(1); return parseInt(h.length === 4 ? h[3] + h[3] : h.slice(6, 8), 16) / 255; }
  const inner = raw.match(/^rgba?\(([^)]*)\)$/i)?.[1].split(/[\s,/]+/).filter(Boolean) ?? [];
  if (inner.length >= 4) return inner[3].endsWith('%') ? parseFloat(inner[3]) / 100 : Number(inner[3]);
  return 1;
};
// RGB plus alpha, each 0-255, so a 50% overlay does not match an opaque color.
const parseColor = (raw) => {
  const hex = raw.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) return [...hexToRgb(raw), alphaOf(raw) * 255];
  const fn = raw.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  return fn ? [...fn.slice(1, 4).map(Number), alphaOf(raw) * 255] : null;
};
const nearestColor = (raw) => {
  const target = parseColor(raw);
  if (!target) return null;
  let best = null;
  for (const c of colorList) {
    if (!/^#/.test(c.hex) || noRole.has(c.path)) continue;
    const d = Math.hypot(...parseColor(c.hex).map((v, i) => v - target[i]));
    if (!best || d < best.d) best = { ...c, d };
  }
  return best;
};
const colorSuggestion = (raw, kind) => {
  if (alphaOf(raw) === 0) return `${withRole('colors.transparent')} → ${kind === 'css' ? 'var(--mag-colors-transparent)' : "'transparent'"}`;
  const n = nearestColor(raw);
  if (!n) return 'use a color token (see foundations/color.md)';
  const usage = kind === 'css' ? `var(${cssVar('colors', n.path.slice(7))})` : `'${n.path.slice(7)}'`;
  return `${n.d < 1 ? '' : 'closest: '}${withRole(n.path)} → ${usage}`;
};
const COLOR_IN_TEXT = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g;
const HAS_COLOR = /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/;
const NAMED_COLORS = /^(white|black|red|blue|green|gray|grey|orange|purple|yellow|pink|navy|teal|silver)$/i;

// Split a value into parts on spaces that are not inside parentheses.
const parts = (v) => {
  const out = []; let depth = 0; let cur = '';
  for (const ch of v) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (/\s/.test(ch) && depth === 0) { if (cur) out.push(cur); cur = ''; } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
};

function scaleCheck(part, { group, map, label, foundation, kind }) {
  if (OK_WORDS.test(part) || isTokenRef(part) || /%$/.test(part)) return null;
  if (kind !== 'css' && tokens[group][part.replace(/^-/, '')] !== undefined) return null;
  const px = toPx(part);
  if (px === null) {
    if (kind !== 'css' && /^-?[\d.]+$/.test(part)) return { severity: 'error', message: `'${part}' is not a ${label} token`, suggestion: `see ${foundation}` };
    return /calc\(/.test(part) ? null : { severity: 'warning', message: `unusual ${label} value '${part}'`, suggestion: `see ${foundation}` };
  }
  const key = map.get(Math.abs(px));
  if (key !== undefined && noRole.has(`${group}.${key}`)) return { severity: 'error', message: `hardcoded ${label} '${part}'`, suggestion: `no usable token: ${group}.${key} has this value but no role (${foundation})` };
  if (key !== undefined) {
    const neg = px < 0 ? '-' : '';
    const usage = kind === 'css' ? `${neg ? 'calc(-1 * ' : ''}var(${cssVar(group, key)})${neg ? ')' : ''}` : `'${neg}${key}'`;
    return { severity: 'error', message: `hardcoded ${label} '${part}'`, suggestion: `${withRole(`${group}.${key}`)} → ${usage}` };
  }
  const nearest = [...map.keys()].filter((k) => !noRole.has(`${group}.${map.get(k)}`)).sort((a, b) => Math.abs(a - Math.abs(px)) - Math.abs(b - Math.abs(px)))[0];
  return { severity: 'warning', message: `${label} '${part}' is off the scale`, suggestion: `closest: ${group}.${map.get(nearest)} (${nearest}px)` };
}

const CATEGORY_OF = (prop) => {
  const p = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  if (/^(p|px|py|pt|pb|pl|pr|ps|pe|padding.*|m|mx|my|mt|mb|ml|mr|ms|me|margin.*|gap|rowGap|columnGap)$/.test(p)) return 'spacing';
  if (/^(color|bg|background|backgroundColor|borderColor|border(Top|Bottom|Left|Right|Inline|Block)?Color|outlineColor|fill|stroke|accentColor|caretColor|textDecorationColor)$/.test(p)) return 'color';
  if (/^(border|border(Top|Bottom|Left|Right|Inline|Block|Start|End)|outline)$/.test(p)) return 'border';
  if (/^(borderWidth|border(Top|Bottom|Left|Right)Width|outlineWidth|borderBottomWidth)$/.test(p)) return 'borderWidth';
  if (/^(borderRadius|rounded.*|border[A-Za-z]*Radius)$/.test(p)) return 'radius';
  if (p === 'fontSize') return 'fontSize';
  if (p === 'fontWeight') return 'fontWeight';
  if (p === 'lineHeight') return 'lineHeight';
  if (p === 'letterSpacing') return 'letterSpacing';
  if (p === 'boxShadow' || p === 'shadow') return 'shadow';
  if (p === 'zIndex') return 'zIndex';
  if (/^(transition.*|animation.*)$/.test(p)) return 'motion';
  return null;
};

function checkValue(category, value, kind) {
  const v = value.replace(/\s*!(important)?\s*$/i, '').trim();
  const found = [];
  const add = (f) => f && found.push(f);
  // A fallback hides a missing token. A name that looks like a Magenta token but is not one
  // (`--mar-colors-…`, `--mag-color-…`) resolves to nothing, so it is an error too.
  for (const [, name, fallback] of v.matchAll(/var\((--[\w-]+)\s*(?:,\s*([^)]+))?\)/g)) {
    if (knownVars.has(name)) {
      if (fallback) add({ severity: 'error', message: `fallback '${fallback.trim()}' on ${name}`, suggestion: `${withRole(pathByVar.get(name))} → var(${name}), without the fallback` });
      continue;
    }
    const looksLikeToken = LOOKS_LIKE_TOKEN.test(name);
    add({ severity: looksLikeToken ? 'error' : 'warning', message: `CSS variable '${name}' is not a Magenta token`, suggestion: fallback ? `replace with the token for its fallback '${fallback.trim()}'` : looksLikeToken ? 'check the name in tokens/primitive.tokens.json' : 'use a Magenta token' });
  }
  const bare = v.replace(/var\([^)]*\)/g, '').trim();
  if (!bare) return found;
  if (category === 'color') {
    if (OK_WORDS.test(bare) || isTokenRef(v) || (kind !== 'css' && !HAS_COLOR.test(bare))) return found;
    const raw = bare.match(COLOR_IN_TEXT)?.[0] ?? (kind === 'css' && NAMED_COLORS.test(bare) ? bare : null);
    const named = raw && NAMED_COLORS.test(raw) ? raw.toLowerCase() : null;
    const namedSuggestion = named && tokens.colors[named]?.value !== undefined && !noRole.has(`colors.${named}`) ?`${withRole(`colors.${named}`)} → var(${cssVar('colors', named)})` : 'use a color token by role (foundations/color.md)';
    if (raw) add({ severity: 'error', message: `hardcoded color '${raw}'`, suggestion: named ? namedSuggestion : colorSuggestion(raw, kind) });
    return found;
  }
  if (category === 'border') {
    for (const c of bare.match(COLOR_IN_TEXT) ?? []) add({ severity: 'error', message: `hardcoded color '${c}' in border`, suggestion: colorSuggestion(c, kind) });
    for (const p of parts(bare.replace(COLOR_IN_TEXT, ''))) {
      if (/^[\d.]+(px|rem)$/.test(p)) add(widthCheck(p, kind));
    }
    return found;
  }
  if (category === 'borderWidth') { for (const p of parts(bare)) add(widthCheck(p, kind)); return found; }
  if (category === 'spacing') { for (const p of parts(bare)) add(scaleCheck(p, { group: 'spacing', map: spacingByPx, label: 'spacing', foundation: 'foundations/spacing.md', kind })); return found; }
  if (category === 'radius') { for (const p of parts(bare)) add(scaleCheck(p, { group: 'radii', map: radiusByPx, label: 'radius', foundation: 'foundations/border.md', kind })); return found; }
  if (category === 'fontSize') return [scaleCheck(bare, { group: 'fontSizes', map: fontSizeByPx, label: 'font size', foundation: 'foundations/typography.md', kind })].filter(Boolean);
  if (category === 'letterSpacing') return [scaleCheck(bare, { group: 'letterSpacings', map: letterSpacingByPx, label: 'letter spacing', foundation: 'foundations/typography.md', kind })].filter(Boolean);
  if (category === 'lineHeight') {
    if (/^[\d.]+$/.test(bare) && (kind === 'css' || tokens.lineHeights[bare] === undefined)) return [{ severity: 'warning', message: `unitless line height '${bare}'`, suggestion: 'use a text style (foundations/typography.md)' }];
    return [scaleCheck(bare, { group: 'lineHeights', map: lineHeightByPx, label: 'line height', foundation: 'foundations/typography.md', kind })].filter(Boolean);
  }
  if (category === 'fontWeight') {
    if (OK_WORDS.test(bare) || isTokenRef(v) || (kind !== 'css' && tokens.fontWeights[bare] !== undefined)) return found;
    const key = { 400: 'regular', normal: 'regular', 600: 'semi-bold' }[bare.toLowerCase()];
    return [{ severity: 'error', message: `hardcoded font weight '${bare}'`, suggestion: key ? `fontWeights.${key} → ${kind === 'css' ? `var(${cssVar('fontWeights', key)})` : `'${key}'`}` : 'Magenta has only fontWeights.regular and fontWeights.semi-bold' }];
  }
  if (category === 'shadow') {
    if (OK_WORDS.test(bare) || (kind !== 'css' && tokens.shadows[bare] !== undefined) || /^var\(--mag-shadows-/.test(v)) return found;
    const exact = shadowByValue.get(bare.replace(/\s+/g, ' ').trim());
    if (exact && noRole.has(`shadows.${exact}`)) return [{ severity: 'error', message: 'hardcoded shadow', suggestion: `no usable token: shadows.${exact} has this value but no role (foundations/elevation.md)` }];
    if (exact) return [{ severity: 'error', message: 'hardcoded shadow', suggestion: `shadows.${exact}` }];
    if (HAS_COLOR.test(bare)) { return [{ severity: 'error', message: `hardcoded shadow '${bare.slice(0, 60)}'`, suggestion: 'use a shadows token by elevation level (foundations/elevation.md)' }]; }
    if (/[1-9][\d.]*(px|rem)/.test(bare)) return [{ severity: 'warning', message: `custom shadow '${bare.slice(0, 60)}'`, suggestion: 'check foundations/elevation.md; use token(borders.*) for ring widths' }];
    return found;
  }
  if (category === 'zIndex') {
    if (OK_WORDS.test(bare) && bare !== '0') return found;
    if (kind !== 'css' && tokens.zIndex[bare] !== undefined) return found;
    const n = Number(bare);
    if (Number.isNaN(n)) return found;
    const key = zIndexByValue.get(n);
    if (key && noRole.has(`zIndex.${key}`)) return [{ severity: 'error', message: `raw z-index ${n}`, suggestion: `no usable token: zIndex.${key} has this value but no role (foundations/z-index.md)` }];
    if (key && ['below', 'base', 'above'].includes(key)) return [{ severity: 'warning', message: `raw z-index ${n}`, suggestion: `zIndex.${key} for stacking inside a component` }];
    if (key) return [{ severity: 'error', message: `raw z-index ${n}`, suggestion: `${withRole(`zIndex.${key}`)} → ${kind === 'css' ? `var(${cssVar('zIndex', key)})` : `'${key}'`}` }];
    return [{ severity: 'error', message: `raw z-index ${n} has no token`, suggestion: 'use the zIndex token for the kind of layer (foundations/z-index.md)' }];
  }
  if (category === 'motion') {
    const d = bare.match(/\b\d*\.?\d+m?s\b/);
    if (d) return [{ severity: 'warning', message: `raw duration '${d[0]}'`, suggestion: 'Magenta has no motion tokens yet' }];
    return found;
  }
  return found;
}

function widthCheck(p, kind) {
  if (OK_WORDS.test(p) || isTokenRef(p)) return null;
  const px = toPx(p);
  if (px === null) return null;
  const key = borderByPx.get(px);
  if (key !== undefined) return { severity: 'error', message: `hardcoded border width '${p}'`, suggestion: `${withRole(`borders.${key}`)} → ${kind === 'css' ? `var(${cssVar('borders', key)})` : `token(borders.${key})`}` };
  return { severity: 'warning', message: `border width '${p}' has no token`, suggestion: 'use borders.1 or borders.2 (foundations/border.md)' };
}

// ---------- scanning ----------

const blankComments = (src) => src
  .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  .replace(/^(\s*)\/\/.*$/gm, (m, ws) => ws + ' '.repeat(m.length - ws.length));

const lineOf = (src, index) => src.slice(0, index).split('\n').length;

function scanFile(file) {
  const ext = path.extname(file);
  const kind = ext === '.css' || ext === '.scss' ? 'css' : 'js';
  const original = fs.readFileSync(file, 'utf8');
  const src = blankComments(original);
  const originalLines = original.split('\n');
  const ignored = (line) => /token-audit-ignore/.test(originalLines[line - 1] ?? '') || /token-audit-ignore/.test(originalLines[line - 2] ?? '');
  const findings = [];
  const re = kind === 'css'
    ? /(?:^|[;{\s])([a-z-]+)\s*:\s*([^;{}]+?)\s*(?=;|\}|$)/gm
    : /\b([a-zA-Z]+)\s*:\s*('[^'\n]*'|"[^"\n]*"|`[^`\n]*`|-?\d+(?:\.\d+)?)(?=\s*[,}\n])/g;
  for (const m of src.matchAll(re)) {
    const prop = m[1];
    if (kind === 'css' && prop.startsWith('--')) continue;
    const category = CATEGORY_OF(prop);
    if (!category) continue;
    let value = m[2];
    if (kind === 'js') {
      if (value.startsWith('`') && value.includes('${')) continue;
      value = value.replace(/^['"`]|['"`]$/g, '');
    }
    const line = lineOf(src, m.index + m[0].indexOf(prop));
    if (ignored(line)) continue;
    for (const f of checkValue(category, value, kind)) findings.push({ file, line, category, value: value.trim(), ...f });
  }
  return findings;
}

const files = [];
const walk = (p) => {
  const stat = fs.statSync(p);
  if (stat.isFile()) { if (EXTENSIONS.has(path.extname(p)) && !SKIP_FILES.test(p)) files.push(p); return; }
  for (const e of fs.readdirSync(p, { withFileTypes: true })) {
    if (e.isDirectory() && SKIP_DIRS.has(e.name)) continue;
    walk(path.join(p, e.name));
  }
};
for (const r of roots) walk(r);

const findings = files.flatMap(scanFile);
const rel = (f) => path.relative(targets.length ? process.cwd() : path.join(SOURCE, 'packages'), f);

// ---------- output ----------

const errors = findings.filter((f) => f.severity === 'error');
const warnings = findings.filter((f) => f.severity === 'warning');
const count = (list, key) => list.reduce((m, f) => m.set(f[key], (m.get(f[key]) ?? 0) + 1), new Map());

// How to fix a finding, read from its suggestion: one that starts with a token path swaps in a token
// of the same value, "closest: " changes the value slightly, and anything else needs a decision.
const FIXES = {
  swap: 'Swap for the token with the same value',
  closest: 'Use the closest token (the look changes slightly)',
  decide: 'Needs a decision (no token fits)',
};
const fixOf = (f) => (f.suggestion.startsWith('closest: ') ? 'closest' : /^[a-zA-Z]+\.[\w.-]+(\s|$)/.test(f.suggestion) ? 'swap' : 'decide');
const tokenOf = (f) => f.suggestion.replace(/^closest: /, '').match(/^[a-zA-Z]+\.[\w.-]+/)?.[0];
const foundOf = (f) => f.message.match(/'([^']*)'/)?.[1] ?? f.value.replace(/\s*!important$/, '');
const unquote = (s) => s.replace(/\s*'[^']*'/g, '').replace(/ -?\d[\d.]*\b/g, '').trim();
// Fixes with a token are grouped by token, so `1px` in `border` and in `borderWidth` land together.
const groupKey = (f) => (fixOf(f) === 'decide' ? `decide|${f.category}|${unquote(f.message)}|${unquote(f.suggestion)}` : `${fixOf(f)}|${tokenOf(f)}`);
const groupsOf = (list) => [...list.reduce((m, f) => m.set(groupKey(f), [...(m.get(groupKey(f)) ?? []), f]), new Map()).values()].sort((a, b) => b.length - a.length);

if (!quiet) {
  for (const f of findings) console.log(`${rel(f.file)}:${f.line}  ${f.severity.padEnd(7)} ${f.category.padEnd(13)} ${f.message}  →  ${f.suggestion}`);
  if (findings.length) console.log('');
}
const byCategory = [...new Set(findings.map((f) => f.category))].sort();
const pkgOf = (f) => rel(f).split(path.sep)[0];
const byPackage = [...new Set(findings.map((f) => pkgOf(f.file)))].sort();
console.log(`Scanned ${files.length} files. ${errors.length} errors, ${warnings.length} warnings.`);
if (findings.length) console.log(`  ${Object.keys(FIXES).map((k) => `${k} ${findings.filter((f) => fixOf(f) === k).length}`).join(', ')}  (swap: same-value token, closest: nearest token, decide: no token fits)`);
if (byPackage.length > 1) for (const p of byPackage) console.log(`  ${p.padEnd(20)} ${errors.filter((f) => pkgOf(f.file) === p).length} errors, ${warnings.filter((f) => pkgOf(f.file) === p).length} warnings`);
for (const c of byCategory) console.log(`  ${c.padEnd(13)} ${findings.filter((f) => f.category === c && f.severity === 'error').length} errors, ${findings.filter((f) => f.category === c && f.severity === 'warning').length} warnings`);
const topFiles = [...count(findings, 'file')].sort((a, b) => b[1] - a[1]).slice(0, 10);
if (topFiles.length) {
  console.log('Most findings:');
  for (const [f, n] of topFiles) console.log(`  ${String(n).padStart(4)}  ${rel(f)}`);
}

if (reportArg) {
  const today = new Date().toISOString().slice(0, 10);
  const out = reportArg.includes('=') ? path.resolve(reportArg.split('=')[1]) : path.join(VAULT, 'reports', `token-audit-${today}.md`);
  const lock = fs.existsSync(path.join(VAULT, 'source.lock.json')) ? JSON.parse(fs.readFileSync(path.join(VAULT, 'source.lock.json'), 'utf8')) : null;
  const target = targets.length ? targets.map((t) => `\`${path.relative(VAULT, t) || '.'}\``).join(', ') : `Magenta snapshot \`${lock?.magenta?.commit?.slice(0, 7) ?? '?'}\` (${DEFAULT_ROOTS.map((r) => `\`${path.relative(path.join(SOURCE, 'packages'), r)}\``).join(', ')})`;
  const esc = (s) => String(s).replace(/\|/g, '\\|');
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  const uniq = (xs) => [...new Set(xs)];
  const codeList = (xs, n = 5) => xs.slice(0, n).map((x) => `\`${esc(x)}\``).join(', ') + (xs.length > n ? ` +${xs.length - n} more` : '');
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const tally = (list) => `${list.filter((f) => f.severity === 'error').length} / ${list.filter((f) => f.severity === 'warning').length}`;
  const places = (g) => {
    const [e, w] = ['error', 'warning'].map((s) => g.filter((f) => f.severity === s).length);
    return `${[e && plural(e, 'error'), w && plural(w, 'warning')].filter(Boolean).join(', ')} in ${plural(uniq(g.map((f) => f.file)).length, 'file')}`;
  };
  const examples = (g) => codeList(uniq(g.map((f) => `${rel(f.file)}:${f.line}`)), 3);
  // A token with several roles is shown bare: its first role alone would mislead.
  const tokenCell = (t) => `\`${t}\`${roles.get(t)?.length === 1 ? `: ${esc(roles.get(t)[0])}` : ''}`;
  const summaryOf = (g) => (fixOf(g[0]) === 'decide'
    ? `${cap(unquote(g[0].message))} (${esc(unquote(g[0].suggestion))})`
    : `${codeList(uniq(g.map(foundOf)), 3)} → ${fixOf(g[0]) === 'closest' ? 'closest ' : ''}\`${tokenOf(g[0])}\``);
  // The Magenta snapshot is split: products install the library packages; react-templates is private.
  const sections = targets.length ? [['Findings', findings]] : [
    ['Library packages', findings.filter((f) => pkgOf(f.file) !== 'react-templates')],
    ['`react-templates`', findings.filter((f) => pkgOf(f.file) === 'react-templates')],
  ];
  const columns = [...sections, ...(sections.length > 1 ? [['Total', findings]] : [])];
  const lines = [
    '---', 'type: report', `date: ${today}`, '---', '', `# Token audit ${today}`, '',
    `Target: ${target}. Written by \`checks/token-audit.mjs\`.`, '',
    '## Summary', '',
    `**${files.length.toLocaleString('en-US')} files scanned. ${errors.length} errors, ${warnings.length} warnings.** Errors fail the check; warnings do not.`, '',
    `| How to fix (errors / warnings) | ${columns.map(([t]) => t).join(' | ')} |`, `|---|${columns.map(() => '---|').join('')}`,
    ...Object.entries(FIXES).map(([k, label]) => `| ${label} | ${columns.map(([, l]) => tally(l.filter((f) => fixOf(f) === k))).join(' | ')} |`),
    '',
    ...(sections.length > 1 ? ['The library packages are the ones products install. `react-templates` is a private package of page layouts and patterns; it is not published.', ''] : []),
    'Largest groups:', '',
    ...groupsOf(findings).slice(0, 8).map((g) => `- ${summaryOf(g)}: ${places(g)}`),
    '',
  ];
  for (const [title, list] of sections.filter(([, l]) => l.length)) {
    lines.push(`## ${title}`, '');
    const groups = groupsOf(list);
    for (const [k, label] of Object.entries(FIXES)) {
      const gs = groups.filter((g) => fixOf(g[0]) === k);
      if (!gs.length) continue;
      lines.push(`### ${label}`, '');
      if (k === 'decide') {
        lines.push('| Category | Problem | Found | Suggestion | Places | Examples |', '|---|---|---|---|---|---|');
        for (const g of gs) lines.push(`| ${g[0].category} | ${cap(unquote(g[0].message))} | ${codeList(uniq(g.map(foundOf)))} | ${esc(unquote(g[0].suggestion))} | ${places(g)} | ${examples(g)} |`);
      } else {
        lines.push(`| Found | ${k === 'closest' ? 'Closest token' : 'Token'} | Write | Places | Examples |`, '|---|---|---|---|---|');
        for (const g of gs) lines.push(`| ${codeList(uniq(g.map(foundOf)))} | ${tokenCell(tokenOf(g[0]))} | ${codeList(uniq(g.map((f) => f.suggestion.split(' → ')[1]).filter(Boolean))) || '—'} | ${places(g)} | ${examples(g)} |`);
      }
      lines.push('');
    }
  }
  lines.push('## Appendix: findings per file', '');
  for (const f of [...new Set(findings.map((x) => x.file))].sort((a, b) => rel(a).localeCompare(rel(b)))) {
    lines.push(`### \`${rel(f)}\``, '', '| Line | Severity | Category | Fix | Found | Suggestion |', '|---|---|---|---|---|---|');
    for (const x of findings.filter((y) => y.file === f)) lines.push(`| ${x.line} | ${x.severity} | ${x.category} | ${fixOf(x)} | ${esc(x.message)} | ${esc(x.suggestion)} |`);
    lines.push('');
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, lines.join('\n'));
  console.log(`Report: ${path.relative(process.cwd(), out)}`);
}

process.exit(errors.length ? 1 : 0);
