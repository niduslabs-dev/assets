# Nidus Labs assets — Agent Guide

> Part of the Nidus Labs workspace (`~/Work/personal/niduslabs`). Start with the workspace guide `../AGENTS.md` and `../STATUS.md`; this file covers this repo only.

The studio's logo, icons, social images and store screenshots. What's here and how it's generated is in `README.md` (`pnpm build` runs `scripts/build.mjs`).

- **Generated files come from their sources.** Edit the source and rebuild, rather than hand-editing exports.
- **Brand:** the mark is an app tile with a moss seed; the wordmark is Manrope (Nidus 800, Labs 500); the byline is "A home for little ideas."
- **Design tokens:** `tokens.json` is the single source for every app's shared design values (DTCG format). `npm run build:tokens` regenerates `dist/tokens/` (Swift, CSS, TypeScript, kit JSON); commit source and outputs together, and run `npm run check:tokens` before committing. Rules for changing a token: `../studio/design/language.md`.
