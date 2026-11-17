// Generated from tokens.json by scripts/tokens/build.mjs (assets repo). Do not edit.
// swift-format-ignore-file

import SwiftUI

/// The studio's shared design tokens. An app's own `Theme` reads these and adds only what is its own.
enum ThemeTokens {
    enum Colour {
        enum Brand {
            /// The tile, text, dark grounds.
            static let ink = ThemeColour(fixed: .init(0x17161C))
            /// Light grounds; the tile on dark.
            static let paper = ThemeColour(fixed: .init(0xF4F4F6))
            /// The seed on light; the one action colour.
            static let moss = ThemeColour(fixed: .init(0x4F7A4A))
            /// The seed, links and accent icons on dark.
            static let mossOnDark = ThemeColour(fixed: .init(0x8DBB82))
            /// 'Labs' in the wordmark and brand secondary text on light. UI secondary text is role.textSecondary.
            static let muted = ThemeColour(fixed: .init(0x6B6A73))
            /// The same, on dark.
            static let mutedOnDark = ThemeColour(fixed: .init(0xB9B8C2))
        }
        enum Role {
            /// Body text and titles.
            static let textPrimary = ThemeColour(light: .init(0x17161C), dark: .init(0xF4F4F6), lightContrast: .init(0x000000), darkContrast: .init(0xFFFFFF))
            /// Captions, meta, group labels. Muted darkened until 4.5:1 is measured on every surface.
            static let textSecondary = ThemeColour(light: .init(0x64636C), dark: .init(0xB9B8C2), lightContrast: .init(0x3E3D45), darkContrast: .init(0xDCDBE3))
            /// Links and accent icons. A moss shade that clears 4.5:1.
            static let link = ThemeColour(light: .init(0x466E41), dark: .init(0x8DBB82), lightContrast: .init(0x3B5D38), darkContrast: .init(0xA9D19F))
            /// The fill of the one primary action per surface.
            static let actionPrimary = ThemeColour(light: .init(0x4F7A4A), dark: .init(0x4F7A4A), lightContrast: .init(0x3B5D38), darkContrast: .init(0x4F7A4A))
            /// Primary fill under the pointer. Lighter on dark.
            static let actionPrimaryHover = ThemeColour(light: .init(0x456B41), dark: .init(0x527F4C), lightContrast: .init(0x34522F), darkContrast: .init(0x3B5D38))
            /// Primary fill while pressed.
            static let actionPrimaryPressed = ThemeColour(light: .init(0x3B5D38), dark: .init(0x456B41), lightContrast: .init(0x2C4529), darkContrast: .init(0x34522F))
            /// Label on the primary fill. 4.9:1 on moss.
            static let onAction = ThemeColour(fixed: .init(0xFFFFFF))
            /// Secondary button fill, with a hairline.
            static let actionSecondary = ThemeColour(light: .init(0xF4F4F6), dark: .init(0x2C2B33, alpha: 0.9), lightContrast: .init(0xF4F4F6), darkContrast: .init(0x2C2B33))
            /// Window and panel background, including the title bar. Dark is ink glass over a behind-window blur.
            static let surfaceBase = ThemeColour(light: .init(0xFFFFFF), dark: .init(0x1C1B22, alpha: 0.86), lightContrast: .init(0xFFFFFF), darkContrast: .init(0x232229))
            /// surfaceBase with Reduce Transparency on, or where no blur is drawn.
            static let surfaceBaseSolid = ThemeColour(light: .init(0xFFFFFF), dark: .init(0x232229), lightContrast: .init(0xFFFFFF), darkContrast: .init(0x232229))
            /// Cards inside a window and info cards: ink at 4% over the surface (Drop's shipped fill). No shadow.
            static let surfaceCard = ThemeColour(light: .init(0x17161C, alpha: 0.04), dark: .init(0xF4F4F6, alpha: 0.06), lightContrast: .init(0x17161C, alpha: 0.08), darkContrast: .init(0xF4F4F6, alpha: 0.12))
            /// Selects and fields: paper on light (Drop's shipped fill), with a hairline.
            static let surfaceRaised = ThemeColour(light: .init(0xF4F4F6), dark: .init(0x2C2B33, alpha: 0.9), lightContrast: .init(0xF4F4F6), darkContrast: .init(0x2C2B33))
            /// Menu panels. Dark sits over a behind-window blur.
            static let surfaceMenu = ThemeColour(light: .init(0xFFFFFF), dark: .init(0x24232B, alpha: 0.96), lightContrast: .init(0xFFFFFF), darkContrast: .init(0x24232B))
            /// The thin edge on cards and controls.
            static let hairline = ThemeColour(light: .init(0x17161C, alpha: 0.12), dark: .init(0xF4F4F6, alpha: 0.12), lightContrast: .init(0x5E5D66), darkContrast: .init(0xA09FA8))
            /// Edges that carry a control's state. 3:1 against the surface.
            static let controlBoundary = ThemeColour(light: .init(0x8A8992), dark: .init(0x7A7983), lightContrast: .init(0x5E5D66), darkContrast: .init(0xA09FA8))
            /// The keyboard focus ring. Solid, at least 3:1.
            static let focusRing = ThemeColour(light: .init(0x4F7A4A), dark: .init(0x8DBB82), lightContrast: .init(0x3B5D38), darkContrast: .init(0xA9D19F))
            /// An off switch's track.
            static let switchOff = ThemeColour(light: .init(0xD8D7DE), dark: .init(0x4A4952), lightContrast: .init(0xD8D7DE), darkContrast: .init(0x4A4952))
            /// Hovered or keyboard-highlighted menu row.
            static let highlight = ThemeColour(light: .init(0x4F7A4A, alpha: 0.1), dark: .init(0x8DBB82, alpha: 0.16), lightContrast: .init(0x4F7A4A, alpha: 0.2), darkContrast: .init(0x8DBB82, alpha: 0.3))
            /// The soft ring a select wears while its menu is open.
            static let openRing = ThemeColour(light: .init(0x4F7A4A, alpha: 0.25), dark: .init(0x8DBB82, alpha: 0.35), lightContrast: .init(0x4F7A4A, alpha: 0.25), darkContrast: .init(0x8DBB82, alpha: 0.35))
            /// A progress bar's unfilled part.
            static let track = ThemeColour(light: .init(0x17161C, alpha: 0.08), dark: .init(0xF4F4F6, alpha: 0.1), lightContrast: .init(0x17161C, alpha: 0.08), darkContrast: .init(0xF4F4F6, alpha: 0.1))
            /// The ink the dark glass is tinted with, at opacity.glassTint. surfaceBase dark is this pair.
            static let glassTint = ThemeColour(fixed: .init(0x1C1B22))
            /// Dim over a window behind a sheet.
            static let scrim = ThemeColour(light: .init(0x17161C, alpha: 0.2), dark: .init(0x000000, alpha: 0.36), lightContrast: .init(0x17161C, alpha: 0.2), darkContrast: .init(0x000000, alpha: 0.36))
            /// A disabled primary on the kit board. In code, disabled is opacity.disabled on the live control.
            static let disabledFill = ThemeColour(light: .init(0xC9C8CF), dark: .init(0x4A4952), lightContrast: .init(0xC9C8CF), darkContrast: .init(0x4A4952))
            /// Glyphs on a GlassToolbar, a ModePill and an app's title row.
            static let toolbarIcon = ThemeColour(light: .init(0x3E3D45), dark: .init(0xD6D5DD), lightContrast: .init(0x17161C), darkContrast: .init(0xF4F4F6))
            /// The GlassToolbar capsule and circle, and the ModePill.
            static let surfacePill = ThemeColour(light: .init(0xFFFFFF), dark: .init(0x2C2B33), lightContrast: .init(0xFFFFFF), darkContrast: .init(0x2C2B33))
            /// Hover and press shade on glass buttons, at opacity.toolbarHover or opacity.toolbarPressed.
            static let toolbarShade = ThemeColour(light: .init(0x17161C), dark: .init(0xF4F4F6), lightContrast: .init(0x17161C), darkContrast: .init(0xF4F4F6))
            /// A recording in progress: GlassToolbar's recording state.
            static let recording = ThemeColour(light: .init(0xD93A2B), dark: .init(0xFF5A4B), lightContrast: .init(0xB0281B), darkContrast: .init(0xFF7A6E))
            enum Status {
                /// Fill of a done badge. White on it is 5.3:1.
                static let success = ThemeColour(light: .init(0x2F7A3A), dark: .init(0x2F7A3A), lightContrast: .init(0x225C2B), darkContrast: .init(0x2F7A3A))
                /// Green status icons and text. Dark is mossOnDark's Increase Contrast step, so a success chip (on highlight) clears 4.5:1 over glass on any wallpaper.
                static let good = ThemeColour(light: .init(0x2F7A3A), dark: .init(0xA9D19F), lightContrast: .init(0x225C2B), darkContrast: .init(0xC5E0BE))
                /// Warning icons and a warning action's label.
                static let warning = ThemeColour(light: .init(0xB25E00), dark: .init(0xF0A44B), lightContrast: .init(0x8A4800), darkContrast: .init(0xFFC27A))
                /// Text on a warning fill.
                static let warningText = ThemeColour(light: .init(0x6B4300), dark: .init(0xF5D3A1), lightContrast: .init(0x4A2F00), darkContrast: .init(0xFFE7C4))
                /// A warning card's fill.
                static let warningFill = ThemeColour(light: .init(0xFFF4E0), dark: .init(0xFFAA3C, alpha: 0.14), lightContrast: .init(0xFFF4E0), darkContrast: .init(0xFFAA3C, alpha: 0.2))
                /// Error icons and error text. Dark clears 4.5:1 on dangerFill over glass on any wallpaper.
                static let danger = ThemeColour(light: .init(0xC4271B), dark: .init(0xFF9D94), lightContrast: .init(0x9E1D13), darkContrast: .init(0xFFB0A8))
                /// An error card's fill, and a field's error halo.
                static let dangerFill = ThemeColour(light: .init(0xFDECEA), dark: .init(0xFF5A50, alpha: 0.14), lightContrast: .init(0xFDECEA), darkContrast: .init(0xFF5A50, alpha: 0.2))
            }
        }
    }
    enum Fonts {
        enum Family {
            /// Wordmark, byline and onboarding headings only.
            static let brand = "Manrope"
            /// Everything else. SF Pro on Apple platforms.
            static let system = "-apple-system"
            /// Numbers that change, and big figures.
            static let rounded = "ui-rounded"
            /// File paths.
            static let mono = "ui-monospace"
        }
        enum Wordmark {
            static let nidus: SwiftUI.Font.Weight = .heavy
            static let labs: SwiftUI.Font.Weight = .medium
        }
    }
    enum Space {
        /// hairline gaps; caption under title
        static let xxxs: CGFloat = 2
        /// group-label inset
        static let xxs: CGFloat = 4
        /// label to card; title to info icon
        static let xs: CGFloat = 6
        /// between buttons and list cards
        static let s: CGFloat = 8
        /// row vertical padding; stacked buttons
        static let m: CGFloat = 12
        /// row horizontal padding; between groups; divider inset
        static let l: CGFloat = 16
        /// window content inset; sheet padding
        static let xl: CGFloat = 24
        /// page title to first group
        static let xxl: CGFloat = 32
    }
    enum TypeScale {
        static let display = ThemeType(size: 56, weight: .bold, family: .rounded)
        static let hero = ThemeType(size: 36, weight: .bold, family: .rounded)
        static let title = ThemeType(size: 26, weight: .semibold, family: .system)
        static let windowTitle = ThemeType(size: 22, weight: .semibold, family: .system)
        static let pageTitle = ThemeType(size: 20, weight: .semibold, family: .system)
        static let panelTitle = ThemeType(size: 17, weight: .semibold, family: .system, tracking: -0.17)
        static let sectionTitle = ThemeType(size: 15, weight: .semibold, family: .system)
        static let body = ThemeType(size: 13, weight: .regular, family: .system)
        static let bodyMedium = ThemeType(size: 13, weight: .medium, family: .system)
        static let bodyEmphasis = ThemeType(size: 13, weight: .semibold, family: .system)
        static let callout = ThemeType(size: 12, weight: .regular, family: .system)
        static let caption = ThemeType(size: 11, weight: .regular, family: .system)
        static let groupLabel = ThemeType(size: 11, weight: .medium, family: .system)
        static let micro = ThemeType(size: 10, weight: .semibold, family: .system)
    }
    enum Radius {
        static let xs: CGFloat = 4
        static let sm: CGFloat = 6
        /// value-holding controls: select, field, segmented track
        static let control: CGFloat = 8
        /// a row inside a menu panel
        static let menuRow: CGFloat = 7
        /// menu panels; cards inside a 400 pt panel
        static let menu: CGFloat = 10
        /// containers at window scale, continuous corners
        static let card: CGFloat = 14
        /// notification panels
        static let panel: CGFloat = 18
        /// capsules: every action
        static let pill: CGFloat = 999
        /// an icon tile's radius as a share of its size
        static let iconTileRatio: Double = 0.26
    }
    enum Border {
        /// cards and menu panels
        static let hairline: CGFloat = 0.5
        /// selects, fields, secondary buttons
        static let control: CGFloat = 1
        /// the hairline with Increase Contrast on
        static let hairlineIncreasedContrast: CGFloat = 1
        /// ring width
        static let focusRing: CGFloat = 2
        /// gap between a control and its ring
        static let focusOffset: CGFloat = 2
        /// a select's ring while open
        static let openRing: CGFloat = 3
    }
    enum Opacity {
        /// a disabled or dependent control, in place
        static let disabled: Double = 0.45
        /// ink over a secondary control under the pointer
        static let hoverShade: Double = 0.04
        /// ink over a secondary control while pressed
        static let pressShade: Double = 0.08
        static let menuIdleText: Double = 0.78
        static let menuDisabledText: Double = 0.35
        /// the ink tint over the behind-window blur in dark mode
        static let glassTint: Double = 0.86
        /// toolbarShade over a GlassToolbar button under the pointer
        static let toolbarHover: Double = 0.06
        /// toolbarShade over a GlassToolbar button while pressed
        static let toolbarPressed: Double = 0.12
    }
    enum Shadow {
        static let window = ThemeShadow(colour: ThemeColour(fixed: .init(0x000000, alpha: 0.28)), x: 0, y: 20, blur: 50)
        static let menu = ThemeShadow(colour: ThemeColour(fixed: .init(0x000000, alpha: 0.22)), x: 0, y: 10, blur: 28)
        static let knob = ThemeShadow(colour: ThemeColour(fixed: .init(0x000000, alpha: 0.25)), x: 0, y: 1, blur: 2)
    }
    enum Motion {
        /// determinate progress never passes this until the work is done
        static let progressCeiling: Double = 0.9
        enum Spring {
            static let swap = ThemeSpring(response: 0.4, dampingFraction: 0.9)
            static let slideIn = ThemeSpring(response: 0.4, dampingFraction: 0.9)
            static let thumb = ThemeSpring(response: 0.34, dampingFraction: 0.86)
            static let toggle = ThemeSpring(response: 0.25, dampingFraction: 0.85)
            static let check = ThemeSpring(response: 0.35, dampingFraction: 0.7)
        }
        enum Duration {
            /// hover and press on controls, easeOut
            static let hover: TimeInterval = 0.12
            /// the Reduce Motion fallback: an opacity crossfade
            static let fade: TimeInterval = 0.2
            /// a control enabling or disabling, easeInOut
            static let enable: TimeInterval = 0.28
            /// an onboarding step change, easeInOut
            static let page: TimeInterval = 0.35
            /// stagedReveal: one item arriving, easeOut
            static let reveal: TimeInterval = 0.4
            /// numericRoll, easeInOut
            static let numbers: TimeInterval = 0.45
            /// onboarding content arriving
            static let stagger: TimeInterval = 0.45
            /// delay added per item
            static let staggerStep: TimeInterval = 0.08
            /// onboarding leaving
            static let exit: TimeInterval = 0.45
            /// stagedReveal: between items
            static let revealCadence: TimeInterval = 0.55
            /// progressHold: a finished state stays at least this long
            static let minDwell: TimeInterval = 0.6
            /// typed letters count as one search while they come this close together
            static let typeahead: TimeInterval = 1
            /// dismissible: a finished panel closes itself after this (Drop's shipped value)
            static let afterDone: TimeInterval = 6
        }
        enum Easing {
            static let easeOut = Animation.timingCurve(0, 0, 0.58, 1, duration: 1)
            static let easeInOut = Animation.timingCurve(0.42, 0, 0.58, 1, duration: 1)
        }
        enum Distance {
            static let swapBlur: CGFloat = 6
            static let swapOffset: CGFloat = 5
            /// slideIn: outer padding and travel
            static let slideOffset: CGFloat = 8
            static let revealOffset: CGFloat = 8
            static let revealBlur: CGFloat = 8
            static let pageBlur: CGFloat = 8
            static let staggerBlur: CGFloat = 10
            static let exitBlur: CGFloat = 12
        }
    }
    enum Size {
        enum Button {
            static let smallHeight: CGFloat = 28
            static let smallPaddingX: CGFloat = 14
            static let inListHeight: CGFloat = 24
            static let inListPaddingX: CGFloat = 10
            static let height: CGFloat = 30
            static let paddingX: CGFloat = 16
            static let heroHeight: CGFloat = 38
            static let heroWidth: CGFloat = 240
        }
        enum Switch {
            static let width: CGFloat = 34
            static let height: CGFloat = 20
            static let knob: CGFloat = 16
            static let inset: CGFloat = 2
        }
        enum Select {
            static let height: CGFloat = 28
            static let minWidth: CGFloat = 144
            static let paddingLeading: CGFloat = 10
            static let icon: CGFloat = 16
            static let chevron: CGFloat = 9
            static let rowHeight: CGFloat = 32
            static let rowPaddingX: CGFloat = 10
            static let rowIconGap: CGFloat = 10
            static let check: CGFloat = 12
            static let checkSlot: CGFloat = 14
        }
        enum Field {
            static let height: CGFloat = 28
            static let paddingX: CGFloat = 11
            static let paddingY: CGFloat = 7
            static let searchHeight: CGFloat = 29
        }
        enum Icon {
            static let body: CGFloat = 13
            static let row: CGFloat = 14
            static let rowLarge: CGFloat = 16
            static let sidebar: CGFloat = 16
            static let info: CGFloat = 14
            static let disclosure: CGFloat = 11
            static let emptyStateMin: CGFloat = 32
            static let emptyStateMax: CGFloat = 44
        }
        enum Progress {
            static let height: CGFloat = 6
            static let radius: CGFloat = 3
            static let width: CGFloat = 240
        }
        enum NotificationPanel {
            static let width: CGFloat = 400
            static let inset: CGFloat = 18
            static let header: CGFloat = 11
            static let media: CGFloat = 60
            static let mediaGap: CGFloat = 14
            /// Drop's shipped panel card
            static let detailsPadY: CGFloat = 12
            /// Drop's shipped panel card
            static let detailsRowGap: CGFloat = 8
        }
        enum AppWindow {
            static let width: CGFloat = 440
            static let column: CGFloat = 376
            static let media: CGFloat = 96
            static let detailRowGap: CGFloat = 24
        }
        enum MainWindow {
            static let width: CGFloat = 980
            static let height: CGFloat = 700
            static let sidebarWidth: CGFloat = 240
            static let sidebarRowWidth: CGFloat = 216
            static let sidebarRowHeight: CGFloat = 29
            static let statusCapsuleHeight: CGFloat = 40
            static let brandY: CGFloat = 42
            static let headerY: CGFloat = 20
        }
        enum SettingsWindow {
            static let width: CGFloat = 560
            static let maxHeight: CGFloat = 720
            static let titleTop: CGFloat = 40
        }
        enum SettingsRow {
            static let switchHeight: CGFloat = 48
            static let selectHeight: CGFloat = 52
            static let captionSwitchHeight: CGFloat = 58.5
            static let disclosureHeight: CGFloat = 41
            static let listItemHeight: CGFloat = 44
        }
        enum Sheet {
            static let width: CGFloat = 560
            static let height: CGFloat = 480
            static let confirmationWidth: CGFloat = 420
        }
        enum MenuBarPanel {
            static let width: CGFloat = 240
            static let rowMinHeight: CGFloat = 24
        }
        enum Onboarding {
            static let width: CGFloat = 600
            static let height: CGFloat = 480
            static let textWidth: CGFloat = 420
            static let bottomInset: CGFloat = 40
            static let artIcon: CGFloat = 120
            static let artMaxHeight: CGFloat = 190
            static let dot: CGFloat = 6
            static let dotActive: CGFloat = 18
        }
        enum InfoCard {
            static let panelRadius: CGFloat = 10
        }
        enum Chip {
            static let textMin: CGFloat = 11
            static let textMax: CGFloat = 12
        }
        enum GlassToolbar {
            static let band: CGFloat = 54
            static let capsule: CGFloat = 36
            static let buttonWidth: CGFloat = 32
            static let buttonHeight: CGFloat = 28
            static let circle: CGFloat = 36
            static let icon: CGFloat = 15
        }
        enum ModePill {
            static let height: CGFloat = 36
            static let minWidth: CGFloat = 216
            static let icon: CGFloat = 13
        }
        enum MenuPanel {
            static let width: CGFloat = 232
            static let tallRowHeight: CGFloat = 44
            static let headerHeight: CGFloat = 22
        }
    }
    enum App {
        enum Pane {
            enum Colour {
                /// Pane's light window: paper glass. A recorded deviation from solid light surfaces. 93% keeps textSecondary at 4.5:1 with pure black behind the glass (92% measured 4.496:1).
                static let glassLight = ThemeColour(fixed: .init(0xF4F4F6, alpha: 0.93))
                static let frameBody = ThemeColour(light: .init(0x1F1E25), dark: .init(0x0E0E12), lightContrast: .init(0x1F1E25), darkContrast: .init(0x0E0E12))
                static let frameEdge = ThemeColour(light: .init(0x17161C, alpha: 0.55), dark: .init(0xF4F4F6, alpha: 0.22), lightContrast: .init(0x17161C, alpha: 0.55), darkContrast: .init(0xF4F4F6, alpha: 0.22))
                static let frameButton = ThemeColour(light: .init(0x2B2A32), dark: .init(0x3A3943), lightContrast: .init(0x2B2A32), darkContrast: .init(0x3A3943))
                static let frameButtonNear = ThemeColour(light: .init(0x3A3943), dark: .init(0x4A4953), lightContrast: .init(0x3A3943), darkContrast: .init(0x4A4953))
                static let frameButtonEdge = ThemeColour(light: .init(0xFFFFFF, alpha: 0.22), dark: .init(0xFFFFFF, alpha: 0.26), lightContrast: .init(0xFFFFFF, alpha: 0.5), darkContrast: .init(0xFFFFFF, alpha: 0.55))
                /// The device screen with nothing on it (no emulator, starting, booting). Dark in both modes: a phone that is off.
                static let screenEmpty = ThemeColour(fixed: .init(0x111116))
                /// Behind the live picture, before its first frame arrives.
                static let screenOff = ThemeColour(fixed: .init(0x000000))
                /// Tool outlines and lines. One fixed set: tools draw over the device screen.
                static let toolSelect = ThemeColour(fixed: .init(0x4F7A4A))
                static let toolFill = ThemeColour(fixed: .init(0x4F7A4A, alpha: 0.16))
                /// Distances and snap guides, always dashed.
                static let toolGuide = ThemeColour(fixed: .init(0xB25E00))
                static let toolHalo = ThemeColour(fixed: .init(0xF4F4F6, alpha: 0.9))
                static let toolChip = ThemeColour(fixed: .init(0x17161C, alpha: 0.92))
                static let toolChipText = ThemeColour(fixed: .init(0xF4F4F6))
                static let toolChipEdge = ThemeColour(fixed: .init(0xF4F4F6, alpha: 0.3))
            }
            enum Motion {
                enum Spring {
                    static let frameButton = ThemeSpring(response: 0.25, dampingFraction: 0.85)
                }
            }
            enum Size {
                enum TitleRow {
                    static let height: CGFloat = 52
                    /// past the traffic lights
                    static let titleLeading: CGFloat = 28
                    static let more: CGFloat = 36
                }
                enum Frame {
                    static let bezel: CGFloat = 10
                    static let bodyRadius: CGFloat = 46
                    static let screenRadius: CGFloat = 36
                    static let punchHole: CGFloat = 11
                    static let buttonDepth: CGFloat = 3
                    static let buttonDepthNear: CGFloat = 7
                    static let buttonDepthPressed: CGFloat = 1
                    static let buttonProximity: CGFloat = 24
                    static let buttonHitDepth: CGFloat = 14
                }
                enum Chip {
                    static let height: CGFloat = 20
                    static let paddingX: CGFloat = 7
                    static let outline: CGFloat = 1.5
                }
            }
        }
    }
}

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
