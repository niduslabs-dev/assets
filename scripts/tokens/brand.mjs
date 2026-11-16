import { readFileSync } from 'node:fs';

const BRAND_EXTENSION = 'dev.niduslabs.brand';

/**
 * The brand values in the plain shape the asset build has always read
 * (`color.ink` as a hex string, `byline`, `apps.splito.color.primary`), taken
 * from the design-token file. The token file is the source; this keeps the
 * artwork code free of the token format.
 */
export function loadBrandTokens(tokensPath) {
  const tokens = JSON.parse(readFileSync(tokensPath, 'utf8'));
  const brand = tokens.$extensions[BRAND_EXTENSION];
  const hexes = (group) =>
    Object.fromEntries(
      Object.entries(group)
        .filter(([name]) => !name.startsWith('$'))
        .map(([name, token]) => [name, token.$value.hex]),
    );
  const apps = Object.fromEntries(
    Object.entries(brand.apps).map(([id, app]) => [
      id,
      { ...app, color: hexes(tokens.app[id].color), font: tokens.app[id].font.family.$value },
    ]),
  );
  return {
    name: brand.name,
    byline: brand.byline,
    color: hexes(tokens.color.brand),
    font: {
      family: tokens.font.family.brand.$value,
      wordmark: {
        Nidus: tokens.font.wordmark.nidus.$value,
        Labs: tokens.font.wordmark.labs.$value,
        tracking: brand.wordmark.tracking,
      },
      source: brand.wordmark.source,
    },
    apps,
  };
}
