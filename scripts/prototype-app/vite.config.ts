import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';

// The vault root (four levels up from apps/prototype) holds mockups/<slug>/Screen.tsx.
const VAULT = path.resolve(__dirname, '../../../..');

// Vite does not watch folders outside the app, so a mockup added after the server started would not
// appear: watch mockups/ and reload main.tsx (which globs mockups/*/Screen.tsx) when a screen is added or removed.
function watchMockups(): Plugin {
  const dir = path.join(VAULT, 'mockups');
  return {
    name: 'watch-mockups',
    configureServer(server) {
      server.watcher.add(dir);
      const onChange = (file: string) => {
        if (!file.startsWith(dir) || !file.endsWith('Screen.tsx')) return;
        for (const mod of server.moduleGraph.getModulesByFile(path.resolve(__dirname, 'src/main.tsx')) ?? []) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', onChange);
      server.watcher.on('unlink', onChange);
    },
  };
}

export default defineConfig({
  plugins: [react(), watchMockups()],
  server: { port: 5173, strictPort: true, fs: { allow: [path.resolve(__dirname, '../..'), path.join(VAULT, 'mockups')] } },
  // One copy of each shared library: @dnd-kit/sortable must use the same @dnd-kit/core instance as the app,
  // or its hooks never see the DndContext.
  // Mockups live outside the app (in the vault's mockups/ folder). dedupe makes their imports of these packages
  // resolve from the app, as if the files were inside it; the aliases give them the app's styled-system.
  resolve: {
    dedupe: [
      'react',
      'react-dom',
      '@dnd-kit/core',
      '@dnd-kit/utilities',
      '@ocean-network-express/magenta-react',
      '@ocean-network-express/magenta-react-dates',
      '@ocean-network-express/magenta-react-icons',
      '@ocean-network-express/magenta-react-text-editor',
      'dayjs',
    ],
    alias: {
      '@mockups': path.join(VAULT, 'mockups'),
      'styled-system': path.resolve(__dirname, 'styled-system'),
    },
  },
  // react-dates pulls in @react-input/mask and dayjs. Pre-bundle them at start-up: if Vite finds them later,
  // it bundles them in a separate pass with its own React copy and hooks fail ("Invalid hook call").
  // The same applies to react-text-editor's tiptap packages.
  optimizeDeps: {
    include: [
      '@ocean-network-express/magenta-react-dates > @react-input/mask',
      'dayjs',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/core',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-bold',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-bullet-list',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-character-count',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-color',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-document',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-dropcursor',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-gapcursor',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-hard-break',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-italic',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-link',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-list-item',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-ordered-list',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-paragraph',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-placeholder',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-strike',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-text',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-text-style',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/extension-underline',
      '@ocean-network-express/magenta-react-text-editor > @tiptap/react',
      '@ocean-network-express/magenta-react-text-editor > linkify-it',
    ],
  },
});
