import { GENERATED_NOTE, rgba } from './model.mjs';

const PREFIX = 'app.splito.';

/**
 * A colour the way Splito's palette has always written it: `#RRGGBB`,
 * `transparent`, or `rgba(r,g,b,a)` with no spaces. Keeping the strings
 * identical means adopting this file changes nothing on screen.
 */
function splitoColour(value) {
  const { hex, channels, alpha } = rgba(value);
  if (alpha === 1) return hex;
  if (alpha === 0) return 'transparent';
  return `rgba(${channels.join(',')},${alpha})`;
}

/** A shadow (one layer or several) as a React Native `boxShadow` string. */
function splitoShadow(value) {
  return [value]
    .flat()
    .map((layer) =>
      [layer.offsetX, layer.offsetY, layer.blur, layer.spread]
        .map((length, index) => (length.value === 0 && index !== 2 ? '0' : `${length.value}px`))
        .filter((part, index) => index < 3 || part !== '0')
        .concat(splitoColour(layer.color))
        .join(' '),
    )
    .join(', ');
}

function palette(tokens, mode) {
  const entries = tokens
    .filter((token) => token.path.startsWith(`${PREFIX}color.`) || token.path.startsWith(`${PREFIX}shadow.`))
    .map((token) => {
      const name = token.path.split('.').at(-1);
      const value = token.type === 'color' ? splitoColour(token.modes[mode]) : splitoShadow(token.modes?.[mode] ?? token.value);
      return `  ${name}: ${JSON.stringify(value)},`;
    });
  return entries.join('\n');
}

/**
 * Splito's own tokens (`app.splito`) in the shape its theme reads: a light and
 * a dark palette keyed exactly like `apps/mobile/src/theme/palette.ts`, plus
 * the disabled opacity and the font family. Only Splito uses this file.
 */
export function splitoFile(tokens) {
  const value = (path) => tokens.find((token) => token.path === `${PREFIX}${path}`).value;
  return `// ${GENERATED_NOTE}
// Splito's palette (app.splito in tokens.json). Copy into apps/mobile/src/theme/.

export const lightPalette = {
${palette(tokens, 'light')}
} as const;

export const darkPalette = {
${palette(tokens, 'dark')}
} as const satisfies Record<keyof typeof lightPalette, string>;

export type PaletteName = keyof typeof lightPalette;

/** How far a control fades while it can't be used. */
export const disabledOpacity = ${value('opacity.disabled')};

export const fontFamily = ${JSON.stringify(value('font.family'))};
`;
}
