/**
 * Reads the token file into a flat list every emitter shares: one entry per
 * token with its dotted path, its type (inherited from the nearest group),
 * its value with aliases resolved, and its other modes.
 */

export const MODES_EXTENSION = 'dev.niduslabs.modes';
/**
 * On an `app.<name>` group: the only outputs that carry it (for example
 * `["splito"]`). An app with its own language keeps it out of the shared
 * Swift, CSS, TypeScript and kit outputs.
 */
export const OUTPUTS_EXTENSION = 'dev.niduslabs.outputs';
/** The modes a colour can carry besides its `$value`, which is light. */
export const MODES = ['light', 'dark', 'lightContrast', 'darkContrast'];
/** What a mode falls back to when a token leaves it out. */
const MODE_FALLBACK = { dark: 'light', lightContrast: 'light', darkContrast: 'dark' };

const ALIAS = /^\{([^}]+)\}$/;
const HEX_CHANNELS = 3;
const CHANNEL_MAX = 255;
const COMPONENT_TOLERANCE = 0.0005;

/** @returns {{path: string, type: string, value: unknown, modes?: Record<string, unknown>, description?: string}[]} */
export function flatten(source) {
  const raw = new Map();
  walk(source, [], undefined, raw);

  const resolve = (path, seen = []) => {
    const token = raw.get(path);
    if (!token) throw new Error(`unknown token {${path}} (from ${seen.join(' → ') || 'the file'})`);
    const alias = typeof token.$value === 'string' && token.$value.match(ALIAS);
    if (!alias) return token;
    if (seen.includes(path)) throw new Error(`alias loop: ${[...seen, path].join(' → ')}`);
    const target = resolve(alias[1], [...seen, path]);
    return { ...target, type: token.type ?? target.type, $description: token.$description ?? target.$description };
  };

  const out = [];
  for (const path of raw.keys()) {
    const token = resolve(path);
    if (!token.type) throw new Error(`${path}: no $type on the token or any group above it`);
    const entry = { path, type: token.type, value: token.$value };
    if (token.$description) entry.description = token.$description;
    if (token.type === 'color') {
      checkColour(path, token.$value);
      const given = { light: token.$value, ...token.$extensions?.[MODES_EXTENSION] };
      for (const value of Object.values(given)) checkColour(path, value);
      entry.modes = Object.fromEntries(MODES.map((mode) => [mode, pickMode(given, mode)]));
    } else if (token.$extensions?.[MODES_EXTENSION]) {
      const given = { light: token.$value, ...token.$extensions[MODES_EXTENSION] };
      entry.modes = Object.fromEntries(MODES.map((mode) => [mode, pickMode(given, mode)]));
    }
    out.push(entry);
  }
  return out;
}

function walk(node, path, inheritedType, raw) {
  const type = node.$type ?? inheritedType;
  if ('$value' in node) {
    raw.set(path.join('.'), { ...node, type });
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (child === null || typeof child !== 'object') throw new Error(`${[...path, key].join('.')}: not a group or token`);
    walk(child, [...path, key], type, raw);
  }
}

function pickMode(given, mode) {
  let current = mode;
  while (!(current in given)) current = MODE_FALLBACK[current];
  return given[current];
}

/** A colour's `hex` is for people; `components` is the value. They must agree. */
function checkColour(path, value) {
  if (value?.colorSpace !== 'srgb' || value.components?.length !== HEX_CHANNELS) {
    throw new Error(`${path}: colours are sRGB with three components`);
  }
  if (!value.hex) return;
  value.components.forEach((component, index) => {
    const start = 1 + index * 2;
    const fromHex = Number.parseInt(value.hex.slice(start, start + 2), 16) / CHANNEL_MAX;
    if (Math.abs(fromHex - component) > COMPONENT_TOLERANCE) {
      throw new Error(`${path}: hex ${value.hex} and components disagree`);
    }
  });
}

/** `#RRGGBB`, the channels 0–255 and alpha of a colour value. */
export function rgba(value) {
  const channels = value.components.map((component) => Math.round(component * CHANNEL_MAX));
  const hex = `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
  return { hex, channels, alpha: value.alpha ?? 1 };
}

/** A colour as CSS: `#RRGGBB`, or `rgba()` when it is translucent. */
export function cssColour(value) {
  const { hex, channels, alpha } = rgba(value);
  return alpha === 1 ? hex : `rgba(${channels.join(', ')}, ${alpha})`;
}

const MS_PER_SECOND = 1000;

/** A duration value in milliseconds. */
export function milliseconds(value) {
  return value.unit === 's' ? value.value * MS_PER_SECOND : value.value;
}

/** The token list as a tree of groups, for emitters that nest. */
export function tree(tokens) {
  const rootNode = {};
  for (const token of tokens) {
    const parts = token.path.split('.');
    let node = rootNode;
    for (const part of parts.slice(0, -1)) node = node[part] ??= {};
    node[parts.at(-1)] = { $token: token };
  }
  return rootNode;
}

/**
 * A SwiftUI spring as the stiffness and damping other platforms take
 * (mass 1): stiffness = (2π / response)², damping = 4π × fraction / response.
 */
export function springPhysics(response, dampingFraction) {
  const round = (number) => Math.round(number * 100) / 100;
  return {
    stiffness: round((2 * Math.PI / response) ** 2),
    damping: round((4 * Math.PI * dampingFraction) / response),
    mass: 1,
  };
}

export const GENERATED_NOTE = 'Generated from tokens.json by scripts/tokens/build.mjs (assets repo). Do not edit.';

/**
 * The path prefixes of app groups that name their own outputs, mapped to those
 * outputs (`{ 'app.splito': ['splito'] }`).
 */
export function scopedGroups(source) {
  return Object.fromEntries(
    Object.entries(source.app ?? {})
      .filter(([name, group]) => !name.startsWith('$') && group.$extensions?.[OUTPUTS_EXTENSION])
      .map(([name, group]) => [`app.${name}`, group.$extensions[OUTPUTS_EXTENSION]]),
  );
}
