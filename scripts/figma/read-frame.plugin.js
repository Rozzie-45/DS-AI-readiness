// Runs inside Figma (figma-console figma_execute). Reads one frame for the /create skill: every
// visible node with its type, size and auto-layout, and for each instance its component set, variant
// values, component properties and texts. Read only. Set FRAME_ID to the frame's node ID, run it,
// and save the returned JSON as mockups/<slug>/figma.json. Then run scripts/figma-to-spec.mjs.
//
// An instance is recorded as one node: its inside belongs to the library, so only its texts and the
// sets of the instances nested in it are kept. Frames, groups and detached copies are read in full.

const FRAME_ID = '';

const root = await figma.getNodeByIdAsync(FRAME_ID);
if (!root) throw new Error(`No node ${FRAME_ID}`);

const varNames = new Map();
const varName = async (alias) => {
  const id = alias?.id;
  if (!id) return null;
  if (!varNames.has(id)) varNames.set(id, (await figma.variables.getVariableByIdAsync(id))?.name ?? null);
  return varNames.get(id);
};
const px = (v) => Math.round(v * 10) / 10;

// A layout value and, when it is bound, the variable it uses (e.g. "spacing/16").
async function bound(node, field) {
  const v = node[field];
  if (v === undefined || v === figma.mixed) return undefined;
  const name = await varName(node.boundVariables?.[field]);
  return name ? `${px(v)} {${name}}` : px(v);
}

async function paint(node, key) {
  const list = node[key];
  if (!Array.isArray(list)) return undefined;
  const p = list.find((f) => f.visible !== false && f.type === 'SOLID');
  if (!p) return undefined;
  const v = await varName(p.boundVariables?.color);
  if (v) return `{${v}}`;
  const styleId = key === 'fills' ? node.fillStyleId : node.strokeStyleId;
  if (typeof styleId === 'string' && styleId) return `style ${(await figma.getStyleByIdAsync(styleId))?.name}`;
  const c = p.color;
  return `raw #${[c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('')}`;
}

async function setOf(instance) {
  const main = await instance.getMainComponentAsync();
  if (!main) return { set: null, component: null };
  const set = main.parent?.type === 'COMPONENT_SET' ? main.parent.name : main.name;
  return { set };
}

const shown = (n) => n.visible !== false;
// Visible inside an instance: the node and every parent up to the instance.
const shownIn = (n, top) => { for (let p = n; p && p !== top; p = p.parent) if (p.visible === false) return false; return true; };
const textsOf = (r) => [r.text, ...(r.texts ?? []), ...(r.children ?? []).flatMap(textsOf)].filter(Boolean);
let count = 0;

async function read(node, depth) {
  count++;
  const out = { name: node.name, type: node.type, w: px(node.width), h: px(node.height) };
  if (node.type === 'TEXT') {
    out.text = node.characters;
    const s = typeof node.textStyleId === 'string' && node.textStyleId ? await figma.getStyleByIdAsync(node.textStyleId) : null;
    out.textStyle = s?.name ?? null;
    out.fill = await paint(node, 'fills');
    return out;
  }
  if (node.type === 'INSTANCE') {
    Object.assign(out, await setOf(node));
    out.variant = node.variantProperties ?? {};
    const props = {};
    for (const [k, p] of Object.entries(node.componentProperties ?? {})) {
      const key = k.replace(/#[\d:]+$/, '');
      if (p.type === 'VARIANT') continue;
      if (p.type === 'INSTANCE_SWAP') {
        // A swapped icon is a variant ("Style=outline, Size=20"); its set carries the icon name.
        const c = await figma.getNodeByIdAsync(p.value);
        props[key] = c?.parent?.type === 'COMPONENT_SET' ? c.parent.name : c?.name ?? p.value;
      }
      else props[key] = p.value;
    }
    out.props = props;
    const texts = node.findAll((n) => n.type === 'TEXT' && shownIn(n, node) && n.characters.trim()).map((n) => n.characters.trim());
    out.texts = [...new Set(texts)].slice(0, 8);
    const nested = [];
    for (const n of node.findAll((n) => n.type === 'INSTANCE' && shownIn(n, node))) {
      const s = (await setOf(n)).set;
      if (s && !nested.includes(s)) nested.push(s);
      if (nested.length >= 10) break;
    }
    if (nested.length) out.nested = nested;
    return out;
  }
  if ('layoutMode' in node && node.layoutMode !== 'NONE') {
    out.layout = {
      dir: node.layoutMode === 'HORIZONTAL' ? 'row' : node.layoutMode === 'VERTICAL' ? 'column' : 'grid',
      gap: await bound(node, 'itemSpacing'),
      padding: [await bound(node, 'paddingTop'), await bound(node, 'paddingRight'), await bound(node, 'paddingBottom'), await bound(node, 'paddingLeft')],
      align: [node.primaryAxisAlignItems, node.counterAxisAlignItems].join(' '),
      wrap: node.layoutWrap === 'WRAP' || undefined,
    };
  }
  if ('layoutSizingHorizontal' in node) out.sizing = `${node.layoutSizingHorizontal} ${node.layoutSizingVertical}`;
  out.fill = await paint(node, 'fills');
  out.stroke = await paint(node, 'strokes');
  if ('cornerRadius' in node && node.cornerRadius && node.cornerRadius !== figma.mixed) out.radius = await bound(node, 'topLeftRadius');
  if ('children' in node) {
    // Siblings with the same structure (table rows, list items) are kept once, with "repeat" and their texts.
    out.children = [];
    let prevSig = null;
    for (const c of node.children) {
      if (!shown(c)) continue;
      const r = await read(c, depth + 1);
      const sig = JSON.stringify(r, (k, v) => (k === 'text' || k === 'texts' || k === 'name' || k === 'repeat' || k === 'samples' ? undefined : k === 'props' ? Object.fromEntries(Object.entries(v).filter(([key, x]) => typeof x !== 'string' || !/text|label|title|value|message|placeholder|number|count/i.test(key))) : v));
      const last = out.children[out.children.length - 1];
      if (sig === prevSig && last) {
        last.repeat = (last.repeat ?? 1) + 1;
        if ((last.samples ??= []).length < 3) last.samples.push(textsOf(r).slice(0, 6));
      } else out.children.push(r);
      prevSig = sig;
    }
  }
  for (const k of Object.keys(out)) if (out[k] === undefined || out[k] === null) delete out[k];
  return out;
}

const tree = await read(root, 0);
// A JSON string: when it is long, the agent's tool runner saves it to a file the agent can copy.
return JSON.stringify({ file: figma.root.name, fileKey: figma.fileKey ?? null, frameId: root.id, frame: root.name, width: px(root.width), height: px(root.height), nodes: count, read: new Date().toISOString().slice(0, 10), tree });
