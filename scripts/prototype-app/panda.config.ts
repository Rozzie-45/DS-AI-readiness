import { magPandaPreset } from '@ocean-network-express/css';
import { defineConfig } from '@pandacss/dev';

// Same prefix, layers and preset as magenta-react, so screens style their own layout with the same
// tokens (--mag-*) the components use. Component styles come from magenta-react/index.css;
// `panda` writes the screens' own styles to styled-system/styles.css.
export default defineConfig({
  preflight: false,
  prefix: 'mag',
  separator: '-',
  hash: false,
  // No jsxFramework: Panda would see <Button> etc. in the screens and emit Magenta's recipes again,
  // after magenta-react/index.css, overriding rules such as the date pickers' trigger divider.
  include: ['./src/**/*.{ts,tsx}', '../../../../mockups/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  presets: [magPandaPreset],
  layers: { base: 'mag_base', recipes: 'mag_recipes', reset: 'mag_reset', tokens: 'mag_tokens', utilities: 'mag_utilities' },
});
