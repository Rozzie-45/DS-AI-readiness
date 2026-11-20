#!/usr/bin/env node
// Takes screenshots of a mockup at the three reference widths and saves them next to it.
//
// Usage:  node scripts/shoot-mockup.mjs <slug> [--url=http://localhost:5173]
//
// Opens #/mockup/<slug> in the prototype app (start it first: the "prototype" server in
// .claude/launch.json, or `pnpm --dir .prototype/magenta/apps/prototype dev`) and writes
// mockups/<slug>/result-1024.png, result-1280.png and result-1920.png (full page).
// Uses the Playwright and Chromium installed in the prototype workspace.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const VAULT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv.slice(2).find((a) => !a.startsWith('--'));
const base = (process.argv.find((a) => a.startsWith('--url=')) ?? '--url=http://localhost:5173').slice(6);
if (!slug) {
  console.error('Usage: node scripts/shoot-mockup.mjs <slug> [--url=http://localhost:5173]');
  process.exit(2);
}
const dir = path.join(VAULT, 'mockups', slug);
if (!fs.existsSync(path.join(dir, 'Screen.tsx'))) {
  console.error(`mockups/${slug}/Screen.tsx does not exist.`);
  process.exit(2);
}

const pnpmDir = path.join(VAULT, '.prototype', 'magenta', 'node_modules', '.pnpm');
const pw = fs.existsSync(pnpmDir) && fs.readdirSync(pnpmDir).find((d) => /^playwright@/.test(d));
if (!pw) {
  console.error('Playwright not found in .prototype/magenta. Run node scripts/setup-prototype.mjs.');
  process.exit(2);
}
const { chromium } = await import(pathToFileURL(path.join(pnpmDir, pw, 'node_modules', 'playwright', 'index.mjs')).href);

// Playwright wants the Chromium build it was released with. If that build is not downloaded,
// fall back to another Playwright Chromium in the cache, then to the installed Google Chrome.
async function launch() {
  try {
    return await chromium.launch();
  } catch (first) {
    const cache = path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright');
    const builds = fs.existsSync(cache) ? fs.readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse() : [];
    for (const b of builds) {
      for (const app of ['chrome-mac-arm64', 'chrome-mac']) {
        const exe = path.join(cache, b, app, 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing');
        if (fs.existsSync(exe)) return chromium.launch({ executablePath: exe });
      }
    }
    try {
      return await chromium.launch({ channel: 'chrome' });
    } catch {
      throw first;
    }
  }
}
const browser = await launch();
const errors = [];
try {
  for (const width of [1024, 1280, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on('pageerror', (e) => errors.push(`${width}px: ${e.message}`));
    page.on('console', (m) => m.type() === 'error' && !/forwardRef render functions|Failed to load resource/.test(m.text()) && errors.push(`${width}px: ${m.text().slice(0, 200)}`));
    // Report failed requests by URL (the console message does not say which); the favicon does not count.
    page.on('response', (r) => r.status() >= 400 && !/favicon/.test(r.url()) && errors.push(`${width}px: ${r.status()} ${r.url()}`));
    await page.goto(`${base}/#/mockup/${slug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const file = path.join(dir, `result-${width}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`mockups/${slug}/result-${width}.png`);
    await page.close();
  }
} finally {
  await browser.close();
}
if (errors.length) {
  console.log(`\nConsole errors:\n${[...new Set(errors)].join('\n')}`);
  process.exit(1);
}
