import { GENERATED_NOTE, MODES, cssColour, milliseconds } from './model.mjs';

/**
 * The flat token map the kit page, the contract tools and the board generator
 * read: dotted path to a plain value (numbers in points, durations in
 * milliseconds, colours as CSS strings per mode).
 */
export function kitJson(tokens) {
  const out = {};
  for (const token of tokens) {
    const entry = { type: token.type };
    if (token.type === 'color') {
      for (const mode of MODES) entry[mode] = cssColour(token.modes[mode]);
    } else if (token.modes) {
      entry.value = plainValue(token);
      for (const mode of MODES) entry[mode] = plainValue({ ...token, value: token.modes[mode] });
    } else {
      entry.value = plainValue(token);
    }
    if (token.description) entry.description = token.description;
    out[token.path] = entry;
  }
  return `${JSON.stringify({ $note: GENERATED_NOTE, modes: MODES, tokens: out }, null, 2)}\n`;
}

/** A non-colour token as the plainest value that keeps its meaning. */
export function plainValue(token) {
  switch (token.type) {
    case 'dimension':
      return token.value.value;
    case 'duration':
      return milliseconds(token.value);
    case 'shadow': {
      const layer = (value) => ({
        color: cssColour(value.color),
        offsetX: value.offsetX.value,
        offsetY: value.offsetY.value,
        blur: value.blur.value,
        spread: value.spread.value,
      });
      return Array.isArray(token.value) ? token.value.map(layer) : layer(token.value);
    }
    default:
      return token.value;
  }
}
