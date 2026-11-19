import { GENERATED_NOTE, cssColour } from './model.mjs';
import { plainValue } from './emit-json.mjs';

const kebab = (path) =>
  `--${path.replaceAll('.', '-').replaceAll(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

/** One shadow layer as CSS, from `plainValue`'s shape. */
const cssShadow = (layer) => `${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${layer.color}`;

function cssValue(token, mode = 'light') {
  const value = plainValue(token.modes ? { ...token, value: token.modes[mode] } : token);
  switch (token.type) {
    case 'dimension':
      return `${value}px`;
    case 'duration':
      return `${value}ms`;
    case 'fontFamily':
      return [value].flat().map((family) => (/[^a-z-]/i.test(family) ? `"${family}"` : family)).join(', ');
    case 'cubicBezier':
      return `cubic-bezier(${value.join(', ')})`;
    case 'shadow':
      return [value].flat().map(cssShadow).join(', ');
    default:
      return String(value);
  }
}

function block(selector, lines, indent = '') {
  return `${indent}${selector} {\n${lines.map((line) => `${indent}  ${line}`).join('\n')}\n${indent}}\n`;
}

/**
 * CSS custom properties. Light is the default; dark and Increase Contrast
 * follow the system unless an ancestor sets `data-theme` ("light" or "dark")
 * or `data-contrast="more"`, which is how the kit page shows the modes side
 * by side.
 */
export function cssFile(tokens) {
  const colours = tokens.filter((token) => token.type === 'color');
  const moded = tokens.filter((token) => token.type !== 'color' && token.modes);
  const rest = tokens.filter((token) => token.type !== 'color' && !token.modes);
  const colourLines = (mode) => [
    ...colours
      .filter((token) => mode === 'light' || cssColour(token.modes[mode]) !== cssColour(token.modes.light) || mode === 'darkContrast')
      .map((token) => `${kebab(token.path)}: ${cssColour(token.modes[mode])};`),
    ...moded
      .filter((token) => mode === 'light' || cssValue(token, mode) !== cssValue(token, 'light') || mode === 'darkContrast')
      .map((token) => `${kebab(token.path)}: ${cssValue(token, mode)};`),
  ];
  const base = [...rest.map((token) => `${kebab(token.path)}: ${cssValue(token)};`), ...colourLines('light')];

  return [
    `/* ${GENERATED_NOTE} */\n`,
    block(':root, [data-theme="light"]', base),
    block('[data-theme="dark"]', colourLines('dark')),
    block('[data-contrast="more"], [data-contrast="more"] [data-theme="light"]', colourLines('lightContrast')),
    block('[data-theme="dark"][data-contrast="more"], [data-contrast="more"] [data-theme="dark"]', colourLines('darkContrast')),
    `@media (prefers-color-scheme: dark) {\n${block(':root:not([data-theme])', colourLines('dark'), '  ')}}\n`,
    `@media (prefers-contrast: more) {\n${block(':root:not([data-theme]):not([data-contrast])', colourLines('lightContrast'), '  ')}}\n`,
    `@media (prefers-color-scheme: dark) and (prefers-contrast: more) {\n${block(':root:not([data-theme]):not([data-contrast])', colourLines('darkContrast'), '  ')}}\n`,
  ].join('\n');
}
