import { GENERATED_NOTE, MODES, cssColour, springPhysics, tree } from './model.mjs';
import { plainValue } from './emit-json.mjs';

const isSpring = (node) => node.response?.$token && node.damping?.$token && Object.keys(node).length === 2;

function plain(node) {
  if (node.$token) {
    const token = node.$token;
    if (token.type === 'color') return Object.fromEntries(MODES.map((mode) => [mode, cssColour(token.modes[mode])]));
    return plainValue(token);
  }
  if (isSpring(node)) {
    const response = node.response.$token.value;
    const dampingFraction = node.damping.$token.value;
    return { response, dampingFraction, ...springPhysics(response, dampingFraction) };
  }
  return Object.fromEntries(Object.entries(node).map(([key, child]) => [key, plain(child)]));
}

/**
 * A typed theme object for TypeScript and React Native: lengths are unitless
 * numbers (points), durations are milliseconds, springs carry both SwiftUI's
 * response and damping fraction and the stiffness, damping and mass Reanimated
 * takes. `themeFor(mode)` gives the same tree with each colour as one string.
 */
export function typescriptFile(tokens) {
  const body = JSON.stringify(plain(tree(tokens)), null, 2);
  return `// ${GENERATED_NOTE}

export const tokens = ${body} as const;

export type ColorMode = ${MODES.map((mode) => `"${mode}"`).join(' | ')};

type ColorValue = Record<ColorMode, string>;
type Resolved<T> = T extends ColorValue ? string : T extends object ? { [K in keyof T]: Resolved<T[K]> } : T;

const isColor = (value: object): value is ColorValue => ${MODES.map((mode) => `"${mode}" in value`).join(' && ')};

function resolve(node: unknown, mode: ColorMode): unknown {
  if (node === null || typeof node !== "object" || Array.isArray(node)) return node;
  if (isColor(node)) return node[mode];
  return Object.fromEntries(Object.entries(node).map(([key, child]) => [key, resolve(child, mode)]));
}

/** The whole theme for one appearance, with every colour resolved to a string. */
export function themeFor(mode: ColorMode): Resolved<typeof tokens> {
  return resolve(tokens, mode) as Resolved<typeof tokens>;
}
`;
}
