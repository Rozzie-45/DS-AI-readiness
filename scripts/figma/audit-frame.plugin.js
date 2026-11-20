// Runs inside Figma (figma-console figma_execute). Checks a frame an agent built from the library
// (workflow A): every visible solid fill and stroke uses a paint style or a color variable, every
// visible text uses a text style, and text sizes match the frame's size (sm/md/lg by width).
// Read only. Set FRAME_ID to the frame's node ID.

const FRAME_ID = '';
// Component and text size by viewport width, as in foundations/screens.md.
const sizeFor = (w) => (w >= 1920 ? 'lg' : w >= 1280 ? 'md' : 'sm');

const frame = await figma.getNodeByIdAsync(FRAME_ID);
const expected = sizeFor(frame.width);
const issues = []; const texts = []; let nodes = 0; let instances = 0;
const shown = (n) => { for (let p = n; p && p.id !== frame.id; p = p.parent) if (p.visible === false) return false; return true; };
for (const n of [frame, ...frame.findAll(() => true)]) {
  if (!shown(n)) continue;
  nodes++;
  if (n.type === 'INSTANCE') instances++;
  if ('fills' in n && Array.isArray(n.fills)) for (const f of n.fills) if (f.visible !== false && f.type === 'SOLID' && !n.fillStyleId && !f.boundVariables?.color) issues.push(`raw fill on ${n.type} "${n.name}"`);
  if ('strokes' in n && Array.isArray(n.strokes)) for (const f of n.strokes) if (f.visible !== false && f.type === 'SOLID' && !n.strokeStyleId && !f.boundVariables?.color) issues.push(`raw stroke on ${n.type} "${n.name}"`);
  if (n.type === 'TEXT') {
    const style = typeof n.textStyleId === 'string' && n.textStyleId ? (await figma.getStyleByIdAsync(n.textStyleId))?.name : null;
    texts.push(`${n.characters.slice(0, 30)} → ${style ?? 'no text style'}`);
    if (!style) issues.push(`text without a text style: "${n.characters.slice(0, 20)}"`);
    else { const size = style.match(/-(sm|md|lg)$/)?.[1]; if (size && size !== expected) issues.push(`text "${n.characters.slice(0, 20)}" uses ${style}; a ${Math.round(frame.width)}px frame expects size ${expected}`); }
  }
}
return { frame: frame.name, width: frame.width, expectedSize: expected, nodes, instances, issues: [...new Set(issues)], texts };
