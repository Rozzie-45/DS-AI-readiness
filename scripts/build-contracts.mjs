#!/usr/bin/env node
// Builds contracts/: the facts about each Magenta React component that the code knows, for
// build/meta to merge with the component notes.
//
// Usage:  node scripts/build-contracts.mjs [--check]
//
// For every component exported from the components/index.ts of magenta-react, magenta-react-dates
// and magenta-react-text-editor (packages/<dir>/src/components/index.ts) it writes
// contracts/<Name>.json with:
// - props, from the component's TypeScript prop type and its JSDoc (Pick, Omit, & and the
//   magenta-commons helpers are followed; HTML attributes are listed as "inherits");
// - options: the props whose type is a union of string literals, with their default;
// - the Panda recipes the component file uses, their variants and default variants;
// - styles: every style a recipe sets, by slot, variant and state, with the token it resolves to;
// - stories in packages/docs.
// contracts/index.json lists them. --check writes nothing and exits 1 when a file is out of date.

import fs from 'node:fs';
import { register } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

register(new URL('./lib/ts-loader.mjs', import.meta.url));

const VAULT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.join(VAULT, '.source', 'magenta');
// The published React packages documented by the vault, in output order.
const PACKAGES = [
  { name: '@ocean-network-express/magenta-react', dir: 'react' },
  { name: '@ocean-network-express/magenta-react-dates', dir: 'react-dates' },
  { name: '@ocean-network-express/magenta-react-text-editor', dir: 'react-text-editor' },
];
const srcOf = (p) => path.join(REPO, 'packages', p.dir, 'src');
let COMPONENTS = path.join(srcOf(PACKAGES[0]), 'components');
const STORIES = path.join(REPO, 'packages', 'docs', 'stories');
const OUT = path.join(VAULT, 'contracts');
const check = process.argv.includes('--check');
const rel = (f) => path.relative(REPO, f);

const lock = JSON.parse(fs.readFileSync(path.join(VAULT, 'source.lock.json'), 'utf8'));
const versionOf = (name) => lock.magenta?.packages?.[name]?.version ?? null;
let PACKAGE = PACKAGES[0].name;
let version = versionOf(PACKAGE);
const primitive = JSON.parse(fs.readFileSync(path.join(VAULT, 'tokens', 'primitive.tokens.json'), 'utf8'));
const textStyleNames = Object.keys(JSON.parse(fs.readFileSync(path.join(VAULT, 'tokens', 'text-styles.tokens.json'), 'utf8')).textStyles);

const walkFiles = (dir, test) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walkFiles(p, test) : test(p) ? [p] : [];
});
const sources = new Map(PACKAGES.flatMap((p) => walkFiles(srcOf(p), (f) => /\.tsx?$/.test(f) && !/\.(test|spec|stories)\./.test(f))).map((f) => [f, fs.readFileSync(f, 'utf8')]));

// ---------- scanning TypeScript text ----------

// Index just past the end of a type expression or member type starting at i. Stops at depth 0 on any
// character in `stops`, or on a newline that does not continue the type (next line not | or &).
function scanType(src, i, stops) {
  let depth = 0;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2) + 1; continue; }
    if (c === '/' && src[i + 1] === '/') { const nl = src.indexOf('\n', i); i = (nl === -1 ? src.length : nl) - 1; continue; }
    if (c === "'" || c === '"' || c === '`') { let j = i + 1; while (j < src.length && src[j] !== c) j += src[j] === '\\' ? 2 : 1; i = j; continue; }
    if ('({[<'.includes(c)) depth++;
    else if (c === '>' && src[i - 1] === '=') continue;
    else if (')}]>'.includes(c)) { if (depth === 0) return i; depth--; }
    else if (depth === 0 && c === '\n' && stops.includes('\n')) {
      const before = src.slice(0, i).trimEnd();
      const after = src.slice(i).trimStart();
      if (!/[|&:=,(<]$/.test(before) && !/^[|&]/.test(after) && !/^=>/.test(after)) return i;
    }
    else if (depth === 0 && c !== '\n' && stops.includes(c)) return i;
  }
  return i;
}
const splitTop = (expr, sep) => {
  const parts = []; let start = 0;
  for (let i = 0; i <= expr.length; i++) {
    const end = i === expr.length ? i : scanType(expr, i, sep);
    parts.push(expr.slice(start, end)); start = end + 1; i = end;
  }
  return parts.map((p) => p.trim()).filter(Boolean);
};
const cleanDoc = (doc) => doc.replace(/^\/\*\*|\*\/$/g, '').split('\n').map((l) => l.replace(/^\s*\*\s?/, '').trim()).join(' ').replace(/\s+/g, ' ').trim();

// Type declarations: name → [{ file, expr }] (an interface becomes "Base & { body }").
const decls = new Map();
for (const [file, src] of sources) {
  for (const m of src.matchAll(/(?:^|\n)[ \t]*(?:export\s+)?(type|interface)\s+([A-Za-z_]\w*)/g)) {
    let i = m.index + m[0].length;
    if (src[i] === '<') i = scanType(src, i + 1, '') + 1;
    let expr;
    if (m[1] === 'type') {
      const eq = src.indexOf('=', i);
      const end = scanType(src, eq + 1, ';\n');
      expr = src.slice(eq + 1, end);
    } else {
      const brace = src.indexOf('{', i);
      const ext = src.slice(i, brace).replace(/^\s*extends\s*/, '').trim();
      const end = scanType(src, brace + 1, '');
      expr = [ext ? splitTop(ext, ',').join(' & ') : '', src.slice(brace, end + 1)].filter(Boolean).join(' & ');
    }
    if (!decls.has(m[2])) decls.set(m[2], []);
    decls.get(m[2]).push({ file, expr: expr.trim() });
  }
}
const lookup = (name, file) => { const d = decls.get(name); return d ? (d.find((x) => x.file === file) ?? d[0]) : null; };

// Members of an object type literal ({ ... } including the braces). Each remembers its file, so an
// alias in its type is looked up where it was written.
let currentFile = '';
function members(body) {
  const props = new Map();
  const src = body.trim().slice(1, -1);
  let i = 0; let doc = '';
  while (i < src.length) {
    const rest = src.slice(i);
    const ws = rest.match(/^[\s;,]+/);
    if (ws) { i += ws[0].length; continue; }
    if (rest.startsWith('/**')) { const end = src.indexOf('*/', i); doc = src.slice(i, end + 2); i = end + 2; continue; }
    if (rest.startsWith('//')) { const nl = src.indexOf('\n', i); i = nl === -1 ? src.length : nl; continue; }
    const m = rest.match(/^(?:readonly\s+)?(\[[^\]]*\]|[A-Za-z_$][\w$]*|'[^']*'|"[^"]*")(\?)?\s*([:(])/);
    if (!m) { const nl = src.indexOf('\n', i); i = nl === -1 ? src.length : nl; doc = ''; continue; }
    const start = i + m[0].length - (m[3] === '(' ? 1 : 0);
    const end = scanType(src, start, ';,\n');
    const name = m[1].replace(/^['"]|['"]$/g, '');
    const type = (m[3] === '(' ? src.slice(start, end) : src.slice(start, end)).replace(/\s+/g, ' ').trim();
    if (!name.startsWith('[')) props.set(name, { name, type, optional: Boolean(m[2]), doc: doc ? cleanDoc(doc) : '', file: currentFile });
    doc = ''; i = end;
  }
  return props;
}

const literalUnion = (type) => {
  const parts = splitTop(type.replace(/^\(|\)$/g, ''), '|');
  return parts.length && parts.every((p) => /^'[^']*'$|^"[^"]*"$/.test(p)) ? parts.map((p) => p.slice(1, -1)) : null;
};
const keysOf = (k, file, seen) => {
  const kk = k.trim();
  if (kk.startsWith('keyof ')) return [...resolveType(kk.slice(6), file, seen).props.keys()];
  const ex = kk.match(/^(Exclude|Extract)<([\s\S]*)>$/);
  if (ex) {
    const [all, some] = splitTop(ex[2], ',').map((a) => keysOf(a, file, seen));
    return all.filter((x) => (ex[1] === 'Exclude') !== some.includes(x));
  }
  return literalUnion(kk) ?? [];
};

// String values of a prop type: a literal union, an alias of one, or the values of an `as const`
// object (EnumValue<typeof X>, (typeof X)[keyof typeof X]).
// Values of a `const X = { … } as const` object, following spreads (`...FeedbackMessageColor`).
const constObjectValues = (name, seen = new Set()) => {
  if (seen.has(name)) return [];
  seen.add(name);
  for (const src of sources.values()) {
    const m = src.match(new RegExp(`const\\s+${name}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*as\\s+const`));
    if (m) {
      const spread = [...m[1].matchAll(/\.\.\.(\w+)/g)].flatMap((x) => constObjectValues(x[1], seen) ?? []);
      return [...new Set([...spread, ...[...m[1].matchAll(/:\s*'([^']*)'|:\s*"([^"]*)"/g)].map((x) => x[1] ?? x[2])])];
    }
  }
  return null;
};
function valuesOf(type, file, seen = new Set()) {
  const t = type.trim().replace(/^\(|\)$/g, '');
  const direct = literalUnion(t);
  if (direct) return direct;
  const en = t.match(/^EnumValue<typeof (\w+)>$/) ?? t.match(/^\(?typeof (\w+)\)?\[keyof typeof \w+\]$/);
  if (en) return constObjectValues(en[1]);
  const parts = splitTop(t, '|');
  if (parts.length > 1) { const all = parts.map((p) => valuesOf(p, file, seen)); return all.every(Boolean) ? [...new Set(all.flat())] : null; }
  if (/^[A-Z]\w*$/.test(t) && !seen.has(t)) { const d = lookup(t, file); return d ? valuesOf(d.expr, d.file, new Set([...seen, t])) : null; }
  return null;
}

// Props and inherited types of a type expression.
function resolveType(expr, file, seen = new Set()) {
  const out = { props: new Map(), inherits: new Set() };
  const merge = (r) => { for (const [k, v] of r.props) out.props.set(k, v); for (const x of r.inherits) out.inherits.add(x); };
  let e = expr.trim();
  while (e.startsWith('(') && scanType(e, 1, '') === e.length - 1) e = e.slice(1, -1).trim();
  const union = splitTop(e, '|');
  if (union.length > 1 && !literalUnion(e)) { for (const u of union) merge(resolveType(u, file, seen)); for (const v of out.props.values()) v.optional = true; return out; }
  const parts = splitTop(e, '&');
  if (parts.length > 1) { for (const p of parts) merge(resolveType(p, file, seen)); return out; }
  if (e.startsWith('{')) { currentFile = file; out.props = members(e); return out; }
  const g = e.match(/^([\w.]+)\s*(?:<([\s\S]*)>)?(\[\])?$/);
  if (!g) { out.inherits.add(e); return out; }
  const [, name, argText] = g;
  const args = argText ? splitTop(argText, ',') : [];
  const element = (a) => (a ?? '').replace(/^['"]|['"]$/g, '');
  switch (name) {
    case 'Pick': case 'Omit': {
      const base = resolveType(args[0], file, seen);
      const keys = new Set(keysOf(args[1], file, seen));
      for (const [k, v] of base.props) if ((name === 'Pick') === keys.has(k)) out.props.set(k, v);
      if (name === 'Omit') for (const x of base.inherits) out.inherits.add(x);
      return out;
    }
    case 'Partial': case 'Required': case 'Readonly': {
      merge(resolveType(args[0], file, seen));
      if (name !== 'Readonly') for (const [k, v] of out.props) out.props.set(k, { ...v, optional: name === 'Partial' });
      return out;
    }
    case 'ExtendableComponentProps': case 'OverridableComponentProps':
    case 'ExtendableComponentPropsWithOptionalPick': case 'OverridableComponentPropsWithOptionalPick': {
      out.inherits.add(`attributes of <${element(args[0])}>`);
      if (args[1]) merge(resolveType(args[1], file, seen));
      if (args[2] && args[3]) for (const [k, v] of resolveType(`Pick<${args[3]}, ${args[2]}>`, file, seen).props) out.props.set(k, { ...v, optional: true });
      if (name.startsWith('Overridable')) out.props.set('component', { name: 'component', type: 'React.ElementType', optional: true, doc: 'The element or component to render instead of the default element.' });
      return out;
    }
    default: {
      if (/^React\./.test(name)) { out.inherits.add(e); return out; }
      const d = !seen.has(name) && lookup(name, file);
      if (!d) { out.inherits.add(e); return out; }
      return resolveType(d.expr, d.file, new Set([...seen, name]));
    }
  }
}

// ---------- recipes ----------

const presetModule = await import(path.join(REPO, 'packages', 'css', 'src', 'preset.ts'));
const preset = presetModule.magPandaPreset ?? Object.values(presetModule)[0];
const recipes = { ...(preset.theme.recipes ?? {}), ...(preset.theme.slotRecipes ?? {}) };

const tokenPaths = new Set();
const cssVarToPath = new Map();
(function collect(node, p) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (v.$value === undefined) collect(v, [...p, k]);
    else { tokenPaths.add([...p, k].join('.')); if (v.$extensions.mds.cssVar) cssVarToPath.set(v.$extensions.mds.cssVar, [...p, k].join('.')); }
  }
})(primitive, []);

const GROUP_OF = (prop) => {
  if (/^(color|bg|background|backgroundColor|borderColor|border(Top|Bottom|Left|Right|Inline|Block|Start|End)Color|outlineColor|fill|stroke|accentColor|caretColor|textDecorationColor|divideColor|ringColor)$/.test(prop)) return 'colors';
  if (/^(p|px|py|pt|pb|pl|pr|ps|pe|padding.*|m|mx|my|mt|mb|ml|mr|ms|me|margin.*|gap|rowGap|columnGap|top|right|bottom|left|inset.*)$/.test(prop)) return 'spacing';
  if (/^(w|h|width|height|minW|maxW|minH|maxH|minWidth|maxWidth|minHeight|maxHeight|size|boxSize)$/.test(prop)) return 'sizes';
  if (/^(borderRadius|rounded.*|border[A-Za-z]*Radius)$/.test(prop)) return 'radii';
  return { fontSize: 'fontSizes', fontWeight: 'fontWeights', lineHeight: 'lineHeights', letterSpacing: 'letterSpacings', boxShadow: 'shadows', shadow: 'shadows', zIndex: 'zIndex', textStyle: 'textStyles', fontFamily: 'fonts' }[prop] ?? null;
};
const tokensIn = (prop, value) => {
  const v = String(value);
  const found = [...v.matchAll(/token\(([\w.-]+)\)|\{([\w.-]+)\}/g)].map((m) => m[1] ?? m[2]);
  for (const [, name] of v.matchAll(/var\((--mag-[\w-]+)\)/g)) if (cssVarToPath.has(name)) found.push(cssVarToPath.get(name));
  const group = GROUP_OF(prop);
  if (group === 'textStyles' && textStyleNames.includes(v)) found.push(`textStyles.${v}`);
  else if (group && tokenPaths.has(`${group}.${v.replace(/^-/, '')}`)) found.push(`${group}.${v.replace(/^-/, '')}`);
  return [...new Set(found)].filter((t) => tokenPaths.has(t) || t.startsWith('textStyles.'));
};

// Every style a recipe sets: { slot, when, state, property, value, tokens }.
function stylesOf(recipe) {
  const out = [];
  const visit = (styles, slot, when, state) => {
    for (const [k, v] of Object.entries(styles ?? {})) {
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        // A key that is not a CSS property is a condition: _hover, &:focus, xl, base…
        const isValueObject = Object.keys(v).every((x) => x === 'base' || /^(sm|md|lg|xl|2xl|3xl|xs|_\w+)$/.test(x)) && GROUP_OF(k);
        if (isValueObject) { for (const [cond, val] of Object.entries(v)) out.push(entry(slot, when, cond === 'base' ? state : [...state, cond], k, val)); }
        else visit(v, slot, when, [...state, k]);
      } else out.push(entry(slot, when, state, k, v));
    }
  };
  const entry = (slot, when, state, property, value) => ({ slot, ...(Object.keys(when).length && { when }), ...(state.length && { state: state.join(' ') }), property, value: String(value), ...(tokensIn(property, value).length && { tokens: tokensIn(property, value) }) });
  const bySlot = (obj, when) => { if (recipe.slots) for (const [slot, s] of Object.entries(obj ?? {})) visit(s, slot, when, []); else visit(obj, 'root', when, []); };
  bySlot(recipe.base, {});
  for (const [key, values] of Object.entries(recipe.variants ?? {})) for (const [val, obj] of Object.entries(values)) bySlot(obj, { [key]: val });
  for (const cv of recipe.compoundVariants ?? []) { const { css, ...when } = cv; bySlot(css, when); }
  return out;
}

// ---------- components ----------


const findComponentFile = (local, folder) => {
  const dir = path.join(COMPONENTS, folder);
  const files = [...sources.keys()].filter((f) => f.startsWith(dir + path.sep) && f.endsWith('.tsx'));
  // A JSDoc block may sit between `export const` and the name (CarouselPrevious).
  return files.find((f) => new RegExp(`export\\s+(const|function)\\s+(?:/\\*[\\s\\S]*?\\*/\\s*)?${local}\\b`).test(sources.get(f)))
    ?? files.find((f) => new RegExp(`(const|function)\\s+${local}\\b`).test(sources.get(f))) ?? null;
};
const descriptionOf = (src, local) => {
  const docs = [...src.matchAll(/\/\*\*([\s\S]*?)\*\/\s*(?:export\s+)?(?:const|function)\s+(\w+)/g)].filter((m) => m[2] === local || m[2] === `Inner${local}`);
  for (const d of docs) { const t = cleanDoc(`/**${d[1]}*/`).match(/@description\s*-?\s*(.*?)(?=\s@\w+|$)/); if (t) return t[1].trim(); }
  return docs[0] ? cleanDoc(`/**${docs[0][1]}*/`).replace(/\s@\w+[\s\S]*$/, '').trim() : null;
};
// Destructuring defaults: `({ size = 'lg' }: ButtonProps<E>, ref)` or, untyped inside forwardRef,
// `function Input({ labelAlignment = 'top' }, ref)`.
const defaultsIn = (src) => {
  const m = src.match(/\(\s*\{([\s\S]*?)\}\s*:\s*\w+Props/) ?? src.match(/function\s+\w+\(\s*\{([\s\S]*?)\}\s*,\s*ref\b/);
  return m ? Object.fromEntries([...m[1].matchAll(/(\w+)\s*=\s*('[^']*'|"[^"]*"|true|false|-?\d+(?:\.\d+)?)/g)].map(([, k, v]) => [k, v.replace(/^['"]|['"]$/g, '')])) : {};
};
const storyFiles = fs.existsSync(STORIES) ? walkFiles(STORIES, (f) => /\.stories\.tsx?$/.test(f)) : [];
const storiesOf = (name) => storyFiles.filter((f) => path.basename(f).replace(/\.stories\.tsx?$/, '') === name || path.basename(path.dirname(f)) === name)
  .flatMap((f) => [...fs.readFileSync(f, 'utf8').matchAll(/export\s+const\s+(\w+)\s*(?::[^=]+)?=/g)].map((m) => ({ title: m[1], path: `${rel(f)}#${m[1]}` })));

// Files a component file imports by relative path, up to two levels, inside the same component
// folder and not through an index.ts: BaseAlert.tsx for Alert, BaseButton for Button.
const relativeImports = (file, depth = 2, seen = new Set([file])) => {
  if (!depth) return [];
  const top = path.relative(COMPONENTS, file).split(path.sep)[0];
  const found = [];
  for (const [, names, spec] of (sources.get(file) ?? '').matchAll(/import\s*(?:\{([^}]*)\}|[\w*\s]+)\s*from\s*'(\.[^']*)'/g)) {
    const base = path.resolve(path.dirname(file), spec);
    let targets = [['.tsx', '.ts', ''].map((e) => base + e).find((f) => sources.has(f))].filter(Boolean);
    // `import { BaseAlert } from '.'`: find the files of the folder that define those names.
    if (!targets.length && base !== COMPONENTS && names) {
      const dir = [...sources.keys()].filter((f) => path.dirname(f) === base);
      targets = names.split(',').map((n) => n.trim().split(/\s+as\s+/)[0]).flatMap((n) => dir.filter((f) => new RegExp(`export\\s+(const|function)\\s+${n}\\b`).test(sources.get(f))));
    }
    for (const target of targets) {
      if (seen.has(target) || path.basename(target).startsWith('index.') || path.relative(COMPONENTS, target).split(path.sep)[0] !== top) continue;
      seen.add(target);
      found.push(target, ...relativeImports(target, depth - 1, seen));
    }
  }
  return found;
};
const recipeImports = (src) => (src.match(/import\s*\{([^}]*)\}\s*from\s*'~styled-system\/recipes'/)?.[1] ?? '').split(',').map((x) => x.trim().split(/\s+as\s+/)[0]).filter(Boolean);

const contracts = [];
for (const P of PACKAGES) {
COMPONENTS = path.join(srcOf(P), 'components');
PACKAGE = P.name;
version = versionOf(PACKAGE);
const indexSrc = fs.readFileSync(path.join(COMPONENTS, 'index.ts'), 'utf8');
const exportsList = [];
for (const m of indexSrc.matchAll(/export\s*\{([^}]*)\}\s*from\s*'\.\/([^']+)'/g)) {
  const names = m[1].split(',').map((x) => x.trim()).filter(Boolean);
  const types = new Set(names.filter((x) => x.startsWith('type ')).map((x) => x.slice(5).trim()));
  for (const n of names.filter((x) => !x.startsWith('type '))) {
    const [local, exported = local] = n.split(/\s+as\s+/);
    if (/^[A-Z]/.test(exported)) exportsList.push({ exported, local, folder: m[2], types });
  }
}
for (const { exported, local, folder, types } of exportsList) {
  const file = findComponentFile(local, folder);
  const src = file ? sources.get(file) : '';
  // By name first; otherwise the props type the component file itself uses, for components that
  // share one type: `React.forwardRef<HTMLDivElement, ProgressProps>` or `({ … }: ProgressProps`.
  // When several components share a file (Tag and TagContent), read the props type from this
  // component's own declaration first: `export const TagContent = React.forwardRef<HTMLDivElement,
  // React.ComponentPropsWithoutRef<'div'>>(` has no props type of its own, only <div> attributes.
  const ownDecl = src.match(new RegExp(`(?:const|function)\\s+${local}\\b[^=(]*=\\s*(?:React\\.)?forwardRef<[^,>]+,\\s*([^\\n]+?)>\\s*\\(`))?.[1]?.trim();
  const ownElement = ownDecl?.match(/^React\.ComponentProps(?:WithoutRef|WithRef)?<'(\w+)'>$/)?.[1];
  const ownPropsType = ownDecl?.match(/^(\w+Props)$/)?.[1];
  const usedPropsType = ownElement
    ? undefined
    : [ownPropsType, src.match(/forwardRef<[^,>]+,\s*(\w+Props)\b/)?.[1], src.match(/\}\s*:\s*(\w+Props)\b/)?.[1]].find((n) => n && decls.has(n) && !/^(Extendable|Overridable)ComponentProps/.test(n));
  const propsName = [`${exported}Props`, `${local}Props`].find((n) => types.has(n) || decls.has(n)) ?? usedPropsType;
  const resolved = propsName
    ? resolveType(propsName, file ?? '')
    : { props: new Map(), inherits: new Set(ownElement ? [`attributes of <${ownElement}>`] : []) };
  // A polymorphic component names its default element: <E extends React.ElementType = 'button'>.
  const defaultElement = src.match(/<\s*E\s+extends\s+React\.ElementType\s*=\s*'(\w+)'/)?.[1];
  const inherits = [...resolved.inherits].map((x) => (x === 'attributes of <E>' && defaultElement ? `attributes of <${defaultElement}> (or of the element set by component)` : x));
  const recipeNames = [...new Set([file, ...(file ? relativeImports(file) : [])].filter(Boolean).flatMap((f) => recipeImports(sources.get(f))))];
  const used = recipeNames.filter((r) => recipes[r]);
  const defaults = Object.fromEntries(Object.entries({ ...Object.fromEntries(used.flatMap((r) => Object.entries(recipes[r].defaultVariants ?? {}))), ...defaultsIn(src) }).filter(([, v]) => v !== undefined && v !== 'undefined'));
  const props = {};
  for (const [name, p] of [...resolved.props].sort(([a], [b]) => a.localeCompare(b))) {
    const values = valuesOf(p.type, p.file ?? file);
    const jsDefault = p.doc.match(/@default\s+(\S+)/)?.[1]?.replace(/^['"]|['"]$/g, '');
    props[name] = {
      type: p.type,
      ...(!p.optional && { required: true }),
      ...(values && { values }),
      ...((defaults[name] ?? jsDefault) !== undefined && { default: String(defaults[name] ?? jsDefault) }),
      ...(p.doc && { description: p.doc.replace(/\s*@\w+.*$/, '') }),
      ...(/@deprecated/.test(p.doc) && { deprecated: true }),
      ...(/React\.ReactNode|ReactElement/.test(p.type) && { slot: true }),
    };
  }
  const styles = used.flatMap((r) => stylesOf(recipes[r]).map((s) => ({ recipe: r, ...s })));
  contracts.push({
    name: exported,
    description: file ? descriptionOf(src, local) : null,
    source: { package: PACKAGE, version, export: exported, importPath: PACKAGE, file: file ? rel(file) : null, propsType: propsName ?? null },
    options: Object.fromEntries(Object.entries(props).filter(([, p]) => p.values).map(([k, p]) => [k, { values: p.values, ...(p.default !== undefined && { default: p.default }) }])),
    props,
    inherits,
    recipes: used.map((r) => ({ name: r, className: recipes[r].className, slots: recipes[r].slots ?? null, variants: Object.fromEntries(Object.entries(recipes[r].variants ?? {}).map(([k, v]) => [k, Object.keys(v)])), defaultVariants: recipes[r].defaultVariants ?? {} })),
    tokens: { used: [...new Set(styles.flatMap((s) => s.tokens ?? []))].sort() },
    styles,
    examples: storiesOf(exported),
  });
}
}

// ---------- output ----------

const headerOf = (pkg, ver) => `Generated by scripts/build-contracts.mjs from ${pkg} ${ver ?? ''} (Magenta snapshot ${lock.magenta?.commit?.slice(0, 7)}). Do not edit by hand.`;
const indexHeader = `Generated by scripts/build-contracts.mjs from ${PACKAGES.map((p) => `${p.name} ${versionOf(p.name) ?? ''}`).join(', ')} (Magenta snapshot ${lock.magenta?.commit?.slice(0, 7)}). Do not edit by hand.`;
const seenNames = new Map();
for (const c of contracts) { if (seenNames.has(c.name)) console.warn(`Duplicate export name ${c.name} in ${seenNames.get(c.name)} and ${c.source.package}`); seenNames.set(c.name, c.source.package); }
const files = { 'index.json': { $comment: indexHeader, components: contracts.map((c) => ({ name: c.name, package: c.source.package, file: c.source.file, props: Object.keys(c.props).length, recipes: c.recipes.map((r) => r.name), contract: `${c.name}.json` })) } };
for (const c of contracts) files[`${c.name}.json`] = { $comment: headerOf(c.source.package, c.source.version), ...c };
let stale = 0;
fs.mkdirSync(OUT, { recursive: true });
for (const [name, data] of Object.entries(files)) {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  const file = path.join(OUT, name);
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (current === text) continue;
  if (check) { stale++; console.log(`${current === null ? 'missing' : 'out of date'}: contracts/${name}`); } else fs.writeFileSync(file, text);
}
const noProps = contracts.filter((c) => !c.source.propsType).map((c) => c.name);
const noFile = contracts.filter((c) => !c.source.file).map((c) => c.name);
console.log(`${contracts.length} components. ${contracts.filter((c) => c.recipes.length).length} with a recipe. No props type: ${noProps.join(', ') || 'none'}. No component file: ${noFile.join(', ') || 'none'}.`);
process.exit(check && stale ? 1 : 0);
