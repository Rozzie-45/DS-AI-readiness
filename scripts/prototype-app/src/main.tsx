// Magenta's own CSS (tokens, recipes, preflight), then the screens' layout styles that Panda
// extracts from src into styled-system/styles.css. Panda's PostCSS plugin is not used: it would
// rewrite magenta-react's CSS too, because that file declares the same layers.
import '@ocean-network-express/magenta-react/index.css';
import '../styled-system/styles.css';

import { Link, Text } from '@ocean-network-express/magenta-react';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { css } from '../styled-system/css';

// Every file in src/screens is a screen, opened at #/<file name>. A screen exports a default
// component and a `title`.
type Screen = { default: () => JSX.Element; title?: string };
const screens = import.meta.glob<Screen>('./screens/*.tsx', { eager: true });
// Mockups made with the /create skill: mockups/<slug>/Screen.tsx in the vault, opened at #/mockup/<slug>.
const mockups = import.meta.glob<Screen>('@mockups/*/Screen.tsx', { eager: true });
const byName = Object.fromEntries([
  ...Object.entries(screens).map(([path, mod]) => [path.replace(/^.*\/|\.tsx$/g, ''), mod] as const),
  ...Object.entries(mockups).map(([path, mod]) => [`mockup/${path.split('/').slice(-2)[0]}`, mod] as const),
]);

function App() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const screen = byName[hash.replace(/^#\/?/, '')];
  if (screen) return <screen.default />;
  return (
    <main className={css({ p: '32', display: 'flex', flexDirection: 'column', gap: '16' })}>
      <Text level="h4" component="h1">MDS prototypes</Text>
      {Object.entries(byName).map(([name, mod]) => (
        <Link key={name} href={`#/${name}`}>{mod.title ?? name}</Link>
      ))}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
