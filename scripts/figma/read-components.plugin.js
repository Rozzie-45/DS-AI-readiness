// Runs inside Figma (figma-console figma_execute) on the library file. Lists the component sets of
// the given pages with their key and component properties, for contracts/figma-components.json.
// Read only. Pass page IDs in PAGES; a few pages per call, because loading many pages at once
// times out and drops the Desktop Bridge connection.

const PAGES = [];
const out = [];
for (const id of PAGES) {
  const page = await figma.getNodeByIdAsync(id);
  await page.loadAsync();
  for (const set of page.findAllWithCriteria({ types: ['COMPONENT_SET'] })) {
    const props = {};
    for (const [k, d] of Object.entries(set.componentPropertyDefinitions)) {
      const name = k.replace(/#[\d:]+$/, '');
      props[name] = d.type === 'VARIANT' ? d.variantOptions : d.type === 'BOOLEAN' ? `BOOLEAN=${d.defaultValue}` : d.type === 'TEXT' ? 'TEXT' : 'INSTANCE_SWAP';
    }
    out.push({ page: page.name.trim(), set: set.name, id: set.id, key: set.key, variants: set.children.length, props, ...(set.description ? { description: set.description.slice(0, 120) } : {}) });
  }
}
return out;
