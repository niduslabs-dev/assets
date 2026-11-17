import { GENERATED_NOTE, MODES, milliseconds, rgba, tree } from './model.mjs';

/** Group names that would collide with Swift or SwiftUI (`ThemeTokens.Type` is the metatype, `Font` is SwiftUI's), or read better in British spelling. */
const ENUM_NAMES = { type: 'TypeScale', color: 'Colour', font: 'Fonts' };
const WEIGHTS = { 400: '.regular', 500: '.medium', 600: '.semibold', 700: '.bold', 800: '.heavy' };
const FAMILIES = { 'font.family.system': '.system', 'font.family.rounded': '.rounded', 'font.family.brand': '.brand', 'font.family.mono': '.mono' };
const MS_PER_SECOND = 1000;
const INDENT = '    ';

const enumName = (key) => ENUM_NAMES[key] ?? key[0].toUpperCase() + key.slice(1);
const number = (value) => String(value);
const isSpring = (node) => node.response?.$token && node.damping?.$token && Object.keys(node).length === 2;
const isTypeStyle = (node) => node.size?.$token && node.weight?.$token && node.family?.$token;

function colourArgument(value) {
  const { hex, alpha } = rgba(value);
  const literal = `0x${hex.slice(1)}`;
  return alpha === 1 ? `.init(${literal})` : `.init(${literal}, alpha: ${alpha})`;
}

function tokenLine(name, token) {
  const doc = token.description ? `/// ${token.description}\n` : '';
  switch (token.type) {
    case 'color': {
      const [light, dark, lightContrast, darkContrast] = MODES.map((mode) => colourArgument(token.modes[mode]));
      const same = dark === light && lightContrast === light && darkContrast === light;
      const args = same ? `fixed: ${light}` : `light: ${light}, dark: ${dark}, lightContrast: ${lightContrast}, darkContrast: ${darkContrast}`;
      return `${doc}static let ${name} = ThemeColour(${args})`;
    }
    case 'dimension':
      return `${doc}static let ${name}: CGFloat = ${number(token.value.value)}`;
    case 'duration':
      return `${doc}static let ${name}: TimeInterval = ${number(milliseconds(token.value) / MS_PER_SECOND)}`;
    case 'number':
      return `${doc}static let ${name}: Double = ${number(token.value)}`;
    case 'fontWeight':
      return `${doc}static let ${name}: SwiftUI.Font.Weight = ${WEIGHTS[token.value]}`;
    case 'fontFamily':
      return `${doc}static let ${name} = ${JSON.stringify([token.value].flat()[0])}`;
    case 'cubicBezier':
      return `${doc}static let ${name} = Animation.timingCurve(${token.value.join(', ')}, duration: 1)`;
    case 'shadow': {
      const { color, offsetX, offsetY, blur } = token.value;
      return `${doc}static let ${name} = ThemeShadow(colour: ThemeColour(fixed: ${colourArgument(color)}), x: ${offsetX.value}, y: ${offsetY.value}, blur: ${blur.value})`;
    }
    default:
      throw new Error(`${token.path}: no Swift output for type ${token.type}`);
  }
}

function familyOf(node, sourceFamilies) {
  return sourceFamilies.get(node.family.$token.path) ?? '.system';
}

function emit(node, depth, sourceFamilies) {
  const pad = INDENT.repeat(depth);
  const lines = [];
  for (const [key, child] of Object.entries(node)) {
    if (child.$token) {
      lines.push(...tokenLine(key, child.$token).split('\n').map((line) => pad + line));
    } else if (isSpring(child)) {
      lines.push(`${pad}static let ${key} = ThemeSpring(response: ${child.response.$token.value}, dampingFraction: ${child.damping.$token.value})`);
    } else if (isTypeStyle(child)) {
      const tracking = child.tracking ? `, tracking: ${child.tracking.$token.value.value}` : '';
      lines.push(`${pad}static let ${key} = ThemeType(size: ${child.size.$token.value.value}, weight: ${WEIGHTS[child.weight.$token.value]}, family: ${familyOf(child, sourceFamilies)}${tracking})`);
    } else {
      lines.push(`${pad}enum ${enumName(key)} {`, ...emit(child, depth + 1, sourceFamilies), `${pad}}`);
    }
  }
  return lines;
}

const SUPPORT = `
/// One colour token: a value per appearance, including Increase Contrast.
struct ThemeColour: Sendable {
    struct RGBA: Sendable {
        let hex: UInt32
        let alpha: CGFloat
        init(_ hex: UInt32, alpha: CGFloat = 1) {
            self.hex = hex
            self.alpha = alpha
        }
    }

    let light: RGBA
    let dark: RGBA
    let lightContrast: RGBA
    let darkContrast: RGBA

    init(light: RGBA, dark: RGBA, lightContrast: RGBA, darkContrast: RGBA) {
        self.light = light
        self.dark = dark
        self.lightContrast = lightContrast
        self.darkContrast = darkContrast
    }

    init(fixed: RGBA) {
        self.init(light: fixed, dark: fixed, lightContrast: fixed, darkContrast: fixed)
    }

    /// The dark values in every mode, Increase Contrast kept: for text and controls drawn over
    /// something that is dark whatever the app's mode (a device screen, a photo, a video).
    var alwaysDark: ThemeColour {
        ThemeColour(light: dark, dark: dark, lightContrast: darkContrast, darkContrast: darkContrast)
    }

    var color: Color { Color(platformColor) }
}

#if canImport(AppKit)
    import AppKit

    extension ThemeColour {
        /// Follows the view's appearance, so it changes with dark mode and Increase Contrast.
        var platformColor: NSColor {
            NSColor(name: nil) { appearance in
                let match = appearance.bestMatch(from: [
                    .aqua, .darkAqua, .accessibilityHighContrastAqua, .accessibilityHighContrastDarkAqua,
                ])
                switch match {
                case .darkAqua: return NSColor(self.dark)
                case .accessibilityHighContrastAqua: return NSColor(self.lightContrast)
                case .accessibilityHighContrastDarkAqua: return NSColor(self.darkContrast)
                default: return NSColor(self.light)
                }
            }
        }
    }

    extension NSColor {
        fileprivate convenience init(_ value: ThemeColour.RGBA) {
            let channel = { (shift: UInt32) in CGFloat((value.hex >> shift) & 0xFF) / 255 }
            self.init(srgbRed: channel(16), green: channel(8), blue: channel(0), alpha: value.alpha)
        }
    }
#elseif canImport(UIKit)
    import UIKit

    extension ThemeColour {
        /// Follows the trait collection, so it changes with dark mode and Increase Contrast.
        var platformColor: UIColor {
            UIColor { traits in
                let dark = traits.userInterfaceStyle == .dark
                let contrast = traits.accessibilityContrast == .high
                switch (dark, contrast) {
                case (true, true): return UIColor(self.darkContrast)
                case (true, false): return UIColor(self.dark)
                case (false, true): return UIColor(self.lightContrast)
                case (false, false): return UIColor(self.light)
                }
            }
        }
    }

    extension UIColor {
        fileprivate convenience init(_ value: ThemeColour.RGBA) {
            let channel = { (shift: UInt32) in CGFloat((value.hex >> shift) & 0xFF) / 255 }
            self.init(red: channel(16), green: channel(8), blue: channel(0), alpha: value.alpha)
        }
    }
#endif

/// A SwiftUI spring by its response and damping fraction.
struct ThemeSpring: Sendable {
    let response: Double
    let dampingFraction: Double
    var animation: Animation { .spring(response: response, dampingFraction: dampingFraction) }
}

/// One step of the type scale.
struct ThemeType: Sendable {
    enum Family: Sendable { case system, rounded, mono, brand }

    let size: CGFloat
    let weight: SwiftUI.Font.Weight
    let family: Family
    var tracking: CGFloat = 0

    /// The brand family needs the app to have registered Manrope; until then this is the system font.
    var font: SwiftUI.Font {
        switch family {
        case .system: .system(size: size, weight: weight)
        case .rounded: .system(size: size, weight: weight, design: .rounded)
        case .mono: .system(size: size, weight: weight, design: .monospaced)
        case .brand: .custom(ThemeTokens.Fonts.Family.brand, size: size).weight(weight)
        }
    }
}

/// A shadow for surfaces the system doesn't shadow itself.
struct ThemeShadow: Sendable {
    let colour: ThemeColour
    let x: CGFloat
    let y: CGFloat
    let blur: CGFloat
}
`;

/**
 * One Swift file an app copies next to its own \`Theme.swift\`: the shared
 * values as nested enums, colours that follow the appearance (AppKit or
 * UIKit), and small value types for springs, type styles and shadows.
 */
export function swiftFile(tokens) {
  const sourceFamilies = new Map();
  for (const token of tokens) {
    if (token.path.startsWith('type.') && token.path.endsWith('.family')) {
      const alias = tokens.find((other) => other.path.startsWith('font.family.') && other.value === token.value);
      if (alias) sourceFamilies.set(token.path, FAMILIES[alias.path]);
    }
  }
  const body = emit(tree(tokens), 1, sourceFamilies).join('\n');
  return `// ${GENERATED_NOTE}
// swift-format-ignore-file

import SwiftUI

/// The studio's shared design tokens. An app's own \`Theme\` reads these and adds only what is its own.
enum ThemeTokens {
${body}
}
${SUPPORT}`;
}
