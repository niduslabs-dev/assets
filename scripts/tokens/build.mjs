/**
 * Builds every framework's tokens from `tokens.json` (Design Tokens Format
 * Module 2025.10). Outputs go to `dist/tokens/` and are committed, so an app
 * can copy one without running this. Run `npm run build:tokens`; never edit
 * the outputs. `--check` exits 1 when a committed output is stale.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { cssFile } from './emit-css.mjs';
import { kitJson } from './emit-json.mjs';
import { swiftFile } from './emit-swift.mjs';
import { typescriptFile } from './emit-ts.mjs';
import { splitoFile } from './emit-splito.mjs';
import { flatten, scopedGroups } from './model.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = join(root, 'dist', 'tokens');
const source = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));
const all = flatten(source);
const scoped = Object.keys(scopedGroups(source));
/** The studio's shared tokens: everything but the app groups that keep their own outputs. */
const tokens = all.filter((token) => !scoped.some((prefix) => token.path.startsWith(`${prefix}.`)));

const outputs = {
  'ThemeTokens.swift': swiftFile(tokens),
  'tokens.css': cssFile(tokens),
  'tokens.ts': typescriptFile(tokens),
  'tokens.kit.json': kitJson(tokens),
  'splito.ts': splitoFile(all),
};

const check = process.argv.includes('--check');
let stale = 0;
mkdirSync(outDir, { recursive: true });
for (const [name, text] of Object.entries(outputs)) {
  const path = join(outDir, name);
  if (check) {
    let current = '';
    try {
      current = readFileSync(path, 'utf8');
    } catch {
      current = '';
    }
    if (current !== text) {
      stale += 1;
      console.error(`stale: dist/tokens/${name}`);
    }
  } else {
    writeFileSync(path, text);
    console.log(`dist/tokens/${name}`);
  }
}
console.log(`${all.length} tokens (${tokens.length} shared)`);
if (stale > 0) process.exit(1);
