# Design tokens: why they are built this way

The decisions behind `tokens.json` and its generator (`scripts/tokens/`), settled 2026-11-17. Moved here from the workspace plan "Design language in git" (`studio/plans/design-language.md`, deleted 2026-11-19 once it shipped; git keeps it). How to change a token: `../studio/design/language.md`. Which values were settled and why (Drop's shipped values, the contrast fixes): `../tools/design/MIGRATION.md`.


- **Token format: Design Tokens Format Module 2025.10 (DTCG)**, the W3C community group's first stable version. Colours are sRGB objects with a hex; lengths and durations carry units; aliases are `{group.token}`. It is the one format Style Dictionary, Terrazzo and Figma-side tools all read, so the file outlives our scripts. The file keeps the name `tokens.json` (the spec prefers `.tokens.json`, and allows this) because guides and the artwork build already point at it.
- **Modes** (dark, and Increase Contrast for light and dark) sit in `$extensions["dev.niduslabs.modes"]` on each colour. The format has no modes of its own; its separate Resolver module does, with one file per mode, which is heavier than four values beside each other.
- **Generator: our own, about 450 lines, no dependencies.** Considered (versions checked on npm, 2026-11-17):
  - *Style Dictionary 5.8.0* (maintained, reads DTCG, 13 dependencies). Its stock Swift, CSS and React Native outputs don't do colours with four appearances, springs or nested Swift enums, so all four outputs would be custom formats inside it; it would add a dependency tree to do reference resolution, which is 40 lines.
  - *Terrazzo 2.10.0* (DTCG-native, maintained, modes built in, 18 dependencies for the CLI). Its Swift plugin writes asset catalogs, which a Swift package without an Xcode project can't use; same custom work for React Native.
  - *Doing nothing* (keep values in the guide and each `Theme.swift`): what let Pane drift.
  The source stays standard, so moving to either tool later is a config file, not a rewrite.
- **Springs** are two number tokens (`response`, `damping`): the format has no spring type. The TypeScript output adds stiffness, damping and mass.
- **Contracts are YAML**, one file each, checked by a JSON Schema (ajv 8.20.0) and a validator that refuses raw numbers in value fields. Dependencies in `tools/design/`: `yaml` 2.9.1, `ajv` 8.20.0, `oxlint` 1.90.0, `oxfmt` 0.75.0, pinned. The two linters are a few versions behind latest because pnpm's release-age guard holds back packages published in the last days.
- **The guide is generated where it repeats contracts or tokens** (46 blocks between markers); prose stays hand-written.
- **Pane's GlassToolbar, ModePill and MenuPanel are kit primitives** (Jatin, 2026-11-17); their tokens moved from `app.pane` to `color.role`, `opacity` and `size`. DeviceFrame, FrameButton and ToolChip stay Pane's one-offs.
- **Splito keeps its own palette** (Jatin, 2026-11-17), as `app.splito` in the same source. The group names its own outputs (`dev.niduslabs.outputs`), so the shared outputs leave it out and `emit-splito.mjs` writes `splito.ts` in Splito's shape.
- **The kit page measures contrast in the browser**, and treats glass at its worst (pure black and pure white behind it).
- **The measured check reads, never drives**: accessibility tree plus one window capture; identifiers map controls to contracts.

