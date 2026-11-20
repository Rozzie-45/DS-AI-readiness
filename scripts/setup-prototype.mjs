#!/usr/bin/env node
// Sets up .prototype/magenta: a working copy of the Magenta snapshot where prototypes run on the
// real packages (workflow B). The snapshot in .source/magenta stays read-only.
//
// Usage:  node scripts/setup-prototype.mjs [--no-install]
//
// 1. Copies .source/magenta to .prototype/magenta, without packages/docs (Storybook) and without
//    touching apps/prototype, node_modules or build output already there.
// 2. Creates apps/prototype from scripts/prototype-app the first time. Screens live in
//    apps/prototype/src/screens and survive later runs.
// 3. Installs dependencies from the public npm registry. Every @ocean-network-express package is a
//    workspace package, so nothing is fetched from GitHub Packages and no token is used.
// 4. Builds magenta-react-icons, magenta-react, magenta-react-dates and magenta-react-text-editor (Panda codegen, then tsup) as the repo does.
//
// Then start the app: the "prototype" entry of .claude/launch.json, or
// pnpm --dir .prototype/magenta/apps/prototype dev

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VAULT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(VAULT, '.source', 'magenta');
const WORK = path.join(VAULT, '.prototype', 'magenta');
const APP = path.join(WORK, 'apps', 'prototype');
const TEMPLATE = path.join(VAULT, 'scripts', 'prototype-app');
const install = !process.argv.includes('--no-install');

const run = (cmd, args, cwd = WORK) => {
  console.log(`$ ${[cmd, ...args].join(' ')}${cwd === WORK ? '' : `   (in ${path.relative(WORK, cwd)})`}`);
  execFileSync(cmd, args, { cwd, stdio: 'inherit', env: { ...process.env, CI: 'true', HUSKY: '0' } });
};

fs.mkdirSync(WORK, { recursive: true });
run('rsync', ['-a', '--delete',
  '--exclude', '/apps/prototype', '--exclude', '/packages/docs', '--exclude', 'node_modules',
  '--exclude', 'dist', '--exclude', 'styled-system', '--exclude', '.turbo',
  `${SOURCE}/`, `${WORK}/`], VAULT);

if (!fs.existsSync(APP)) {
  fs.cpSync(TEMPLATE, APP, { recursive: true });
  console.log(`created ${path.relative(VAULT, APP)} from scripts/prototype-app`);
}

if (install) {
  // --ignore-scripts: the root `prepare` runs husky, which needs git. The builds below run what is needed.
  run('pnpm', ['install', '--ignore-scripts', '--no-frozen-lockfile', '--filter', '.', '--filter', '@mds/prototype...']);
  run('pnpm', ['--filter', '@ocean-network-express/magenta-react-icons', 'exec', 'tsup', '--minify']);
  run('pnpm', ['--filter', '@ocean-network-express/magenta-react', 'run', 'panda']);
  run('pnpm', ['--filter', '@ocean-network-express/magenta-react', 'exec', 'tsup', '--minify']);
  run('pnpm', ['--filter', '@ocean-network-express/magenta-react-dates', 'run', 'panda']);
  run('pnpm', ['--filter', '@ocean-network-express/magenta-react-dates', 'exec', 'tsup', '--minify']);
  run('pnpm', ['--filter', '@ocean-network-express/magenta-react-text-editor', 'run', 'panda']);
  run('pnpm', ['--filter', '@ocean-network-express/magenta-react-text-editor', 'exec', 'tsup', '--minify']);
}
console.log(`\nReady. Start the app with: pnpm --dir ${path.relative(VAULT, APP)} dev`);
