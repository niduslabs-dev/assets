/**
 * Builds every Nidus Labs asset from the mark's geometry and Manrope, so the
 * SVGs carry outlined text (no font needed to view them) and every PNG comes
 * from the same source. Run `npm run build`; the output is committed.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Resvg } from '@resvg/resvg-js';
import opentype from 'opentype.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));
const { ink, paper, moss, mossOnDark, muted, mutedOnDark } = tokens.color;
const byline = tokens.byline;

const font = (file) => opentype.parse(readFileSync(join(root, 'scripts/fonts', file)).buffer);
const extraBold = font('Manrope-ExtraBold.ttf');
const medium = font('Manrope-Medium.ttf');

/** Tracking for the wordmark, in em (the design's -0.02em). */
const tracking = -0.02;

/**
 * The mark in a 100-unit box: an app tile with a seed settling into it. The
 * tile's outer edge runs 12–88 in both weights. `small` is the heavier cut for
 * 48 px and below, where the regular stroke thins out.
 */
function markShapes({ tile, seed, small = false }) {
  const [inset, stroke, corner, seedY, seedR] = small ? [18, 12, 21, 61, 11] : [16, 8, 24, 62, 9];
  const side = 100 - inset * 2;
  return (
    `<rect x="${inset}" y="${inset}" width="${side}" height="${side}" rx="${corner}" fill="none" stroke="${tile}" stroke-width="${stroke}"/>` +
    `<circle cx="50" cy="${seedY}" r="${seedR}" fill="${seed}"/>`
  );
}

/** The mark's tight box: the tile's outer edge. */
const markBox = { x: 12, size: 76 };

/** Outlined text as one SVG path, with kerning and the wordmark's tracking. */
function textPath(face, text, x, baseline, size, letterSpacing = 0) {
  const scale = size / face.unitsPerEm;
  const glyphs = face.stringToGlyphs(text);
  const parts = [];
  let pen = x;
  glyphs.forEach((glyph, i) => {
    parts.push(glyph.getPath(pen, baseline, size).toPathData(2));
    const next = glyphs[i + 1];
    pen += glyph.advanceWidth * scale + letterSpacing * size;
    if (next) pen += face.getKerningValue(glyph, next) * scale;
  });
  return { d: parts.join(''), width: pen - x - letterSpacing * size };
}

/** "Nidus Labs" at a font size, starting at x on a baseline; returns paths and width. */
function wordmark(x, baseline, size, colors) {
  const nidus = textPath(extraBold, 'Nidus', x, baseline, size, tracking);
  const space = extraBold.charToGlyph(' ').advanceWidth * (size / extraBold.unitsPerEm);
  const labs = textPath(medium, 'Labs', x + nidus.width + space, baseline, size, tracking);
  return {
    svg: `<path d="${nidus.d}" fill="${colors.word}"/><path d="${labs.d}" fill="${colors.labs}"/>`,
    width: nidus.width + space + labs.width,
  };
}

const capHeight = (size) => (extraBold.tables.os2.sCapHeight / extraBold.unitsPerEm) * size;

/** The mark beside the wordmark, caps centred on the mark. */
function lockup(colors) {
  const markSize = 100;
  const size = 64;
  const gap = 28;
  const baseline = markSize / 2 + capHeight(size) / 2;
  const word = wordmark(markSize + gap, baseline, size, colors);
  const width = Math.ceil(markSize + gap + word.width);
  const scale = markSize / markBox.size;
  return svgDoc(
    width,
    markSize,
    `<g transform="scale(${scale}) translate(${-markBox.x} ${-markBox.x})">${markShapes(colors)}</g>${word.svg}`,
  );
}

function svgDoc(width, height, body, background) {
  const ground = background ? `<rect width="${width}" height="${height}" fill="${background}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${ground}${body}</svg>\n`;
}

/** The mark alone in its tight box. */
function mark(colors) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${markBox.x} ${markBox.x} ${markBox.size} ${markBox.size}">${markShapes(colors)}</svg>\n`;
}

/**
 * A square icon: the mark centred on a ground. `share` is how much of the
 * side the mark takes; avatars and maskable icons keep it inside the circle.
 */
function icon(side, { ground, colors, share, radius = 0, small = false }) {
  const markSide = side * share;
  const offset = (side - markSide) / 2;
  const scale = markSide / markBox.size;
  const groundShape = `<rect width="${side}" height="${side}" rx="${radius}" fill="${ground}"/>`;
  return svgDoc(
    side,
    side,
    `${groundShape}<g transform="translate(${offset} ${offset}) scale(${scale}) translate(${-markBox.x} ${-markBox.x})">${markShapes({ ...colors, small })}</g>`,
  );
}

/** A social card: lockup and byline on paper. */
function socialCard(width, height) {
  const markSize = Math.round(height * 0.22);
  const size = Math.round(markSize * 0.64);
  const gap = Math.round(markSize * 0.28);
  const left = Math.round(width * 0.09);
  const top = Math.round(height * 0.32);
  const baseline = top + markSize / 2 + capHeight(size) / 2;
  const word = wordmark(left + markSize + gap, baseline, size, { word: ink, labs: muted });
  const scale = markSize / markBox.size;
  const bylineSize = Math.round(size * 0.62);
  const line = textPath(medium, byline, left, top + markSize + bylineSize * 2.1, bylineSize, -0.01);
  return svgDoc(
    width,
    height,
    `<g transform="translate(${left} ${top}) scale(${scale}) translate(${-markBox.x} ${-markBox.x})">${markShapes({ tile: ink, seed: moss })}</g>` +
      `${word.svg}<path d="${line.d}" fill="${muted}"/>`,
    paper,
  );
}

/** Lockup and byline centred on paper, for wide banners that get cropped at the sides. */
function banner(width, height) {
  const markSize = Math.round(height * 0.2);
  const size = Math.round(markSize * 0.64);
  const gap = Math.round(markSize * 0.28);
  const bylineSize = Math.round(size * 0.5);
  const probe = wordmark(0, 0, size, { word: ink, labs: muted });
  const lockupWidth = markSize + gap + probe.width;
  const left = (width - lockupWidth) / 2;
  const blockHeight = markSize + bylineSize * 2.4;
  const top = (height - blockHeight) / 2;
  const baseline = top + markSize / 2 + capHeight(size) / 2;
  const word = wordmark(left + markSize + gap, baseline, size, { word: ink, labs: muted });
  const bylineProbe = textPath(medium, byline, 0, 0, bylineSize, -0.01);
  const line = textPath(medium, byline, (width - bylineProbe.width) / 2, top + blockHeight, bylineSize, -0.01);
  const scale = markSize / markBox.size;
  return svgDoc(
    width,
    height,
    `<g transform="translate(${left} ${top}) scale(${scale}) translate(${-markBox.x} ${-markBox.x})">${markShapes({ tile: ink, seed: moss })}</g>` +
      `${word.svg}<path d="${line.d}" fill="${muted}"/>`,
    paper,
  );
}

/** A 24-bit PNG (no alpha channel), for stores that refuse transparency. */
function opaquePng(svg, width) {
  const image = new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render();
  const { width: w, height: h, pixels } = image;
  const rows = Buffer.alloc(h * (w * 3 + 1));
  for (let y = 0; y < h; y++) {
    const row = y * (w * 3 + 1);
    for (let x = 0; x < w; x++) {
      const from = (y * w + x) * 4;
      pixels.copy(rows, row + 1 + x * 3, from, from + 3);
    }
  }
  const chunk = (type, data) => {
    const out = Buffer.alloc(12 + data.length);
    out.writeUInt32BE(data.length, 0);
    out.write(type, 4, 'ascii');
    data.copy(out, 8);
    out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
    return out;
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(w, 0);
  header.writeUInt32BE(h, 4);
  header.set([8, 2, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(rows, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(data) {
  let c = 0xffffffff;
  for (const byte of data) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function png(svg, width) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
}

/** An .ico holding PNGs (supported by every current browser and Windows). */
function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const entry = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, entry);
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.data)]);
}

function write(path, content) {
  const full = join(root, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
  console.log(path);
}

const light = { tile: ink, seed: moss, word: ink, labs: muted };
const dark = { tile: paper, seed: mossOnDark, word: paper, labs: mutedOnDark };
const monoInk = { tile: ink, seed: ink, word: ink, labs: ink };
const monoWhite = { tile: '#FFFFFF', seed: '#FFFFFF', word: '#FFFFFF', labs: '#FFFFFF' };

// Logo: vector masters.
write('logo/mark.svg', mark(light));
write('logo/mark-on-dark.svg', mark(dark));
write('logo/mark-mono-black.svg', mark(monoInk));
write('logo/mark-mono-white.svg', mark(monoWhite));
write('logo/lockup.svg', lockup(light));
write('logo/lockup-on-dark.svg', lockup(dark));
write('logo/lockup-mono-black.svg', lockup(monoInk));
write('logo/lockup-mono-white.svg', lockup(monoWhite));

// Logo: PNG exports on transparent ground.
for (const [name, colors] of [['mark', light], ['mark-on-dark', dark]]) {
  write(`logo/png/${name}-512.png`, png(mark(colors), 512));
}
for (const [name, colors] of [['lockup', light], ['lockup-on-dark', dark]]) {
  write(`logo/png/${name}-1200.png`, png(lockup(colors), 1200));
}

// Avatars (GitHub, npm, social profiles): ink square, mark inside the circle crop.
const avatar = (side) => icon(side, { ground: ink, colors: dark, share: 0.5 });
write('avatar/avatar.svg', avatar(1024));
write('avatar/avatar-1024.png', png(avatar(1024), 1024));
write('avatar/avatar-512.png', png(avatar(512), 512));

// Web icons.
const tile = (side, small) =>
  icon(side, { ground: ink, colors: dark, share: 0.72, radius: side * 0.22, small });
write('web/favicon.svg', tile(32, true));
write(
  'web/favicon.ico',
  ico([16, 32, 48].map((size) => ({ size, data: png(tile(size, true), size) }))),
);
write('web/apple-touch-icon.png', png(icon(180, { ground: ink, colors: dark, share: 0.56 }), 180));
write('web/icon-192.png', png(icon(192, { ground: ink, colors: dark, share: 0.56 }), 192));
write('web/icon-512.png', png(icon(512, { ground: ink, colors: dark, share: 0.56 }), 512));
write('web/icon-maskable-512.png', png(icon(512, { ground: ink, colors: dark, share: 0.44 }), 512));

// Social cards.
write('social/og-image.png', png(socialCard(1200, 630), 1200));
write('social/github-social-preview.png', png(socialCard(1280, 640), 1280));

// Store pages.
write('stores/google-play-header.png', opaquePng(banner(4096, 2304), 4096));
write('stores/google-play-icon-512.png', opaquePng(icon(512, { ground: ink, colors: dark, share: 0.5 }), 512));

// Splito: store artwork, drawn from the app icon's own shapes and the app's font.
const splito = tokens.apps.splito;
const jakartaExtraBold = font('PlusJakartaSans_800ExtraBold.ttf');
const jakartaMedium = font('PlusJakartaSans_500Medium.ttf');

/**
 * Splito's mark in the icon's 1024 box: two half-discs, white on the left and
 * lilac on the right, offset down and apart. Its bounds run 270–754 both ways.
 */
const splitoMark =
  `<path d="M486 270 A216 216 0 0 0 486 702 Z" fill="${splito.color.onPrimary}"/>` +
  `<path d="M538 322 A216 216 0 0 1 538 754 Z" fill="${splito.color.lilac}"/>`;

/** The Play icon: the app icon's full square; Play rounds the corners itself. */
function splitoIcon(side) {
  return svgDoc(
    side,
    side,
    `<g transform="scale(${side / 1024})">${splitoMark}</g>`,
    splito.color.primary,
  );
}

/** The 1024×500 feature graphic: mark, name and tagline, centred. */
function splitoFeatureGraphic(width, height) {
  const markSize = 210;
  const nameSize = 112;
  const taglineSize = 40;
  const gap = 56;
  const name = textPath(jakartaExtraBold, splito.name, 0, 0, nameSize, -0.02);
  const tagline = textPath(jakartaMedium, splito.tagline, 0, 0, taglineSize, -0.01);
  const textWidth = Math.max(name.width, tagline.width);
  const left = (width - (markSize + gap + textWidth)) / 2;
  const markTop = (height - markSize) / 2;
  const textLeft = left + markSize + gap;
  const capHeight = (jakartaExtraBold.tables.os2.sCapHeight / jakartaExtraBold.unitsPerEm) * nameSize;
  const block = capHeight + 28 + taglineSize;
  const nameBaseline = (height - block) / 2 + capHeight;
  const taglineBaseline = nameBaseline + 28 + taglineSize;
  const scale = markSize / 484;
  return svgDoc(
    width,
    height,
    `<g transform="translate(${left} ${markTop}) scale(${scale}) translate(-270 -270)">${splitoMark}</g>` +
      `<path d="${textPath(jakartaExtraBold, splito.name, textLeft, nameBaseline, nameSize, -0.02).d}" fill="${splito.color.onPrimary}"/>` +
      `<path d="${textPath(jakartaMedium, splito.tagline, textLeft, taglineBaseline, taglineSize, -0.01).d}" fill="${splito.color.lilac}"/>`,
    splito.color.primary,
  );
}

write('apps/splito/google-play-icon-512.png', opaquePng(splitoIcon(512), 512));
write('apps/splito/google-play-feature-graphic.png', opaquePng(splitoFeatureGraphic(1024, 500), 1024));

/** Splito's Play Store phone screenshots: captures from apps/splito/screenshots/raw, captioned. */
const phoneShots = [
  ['01-friends', 'Split bills, stay friends', 'See who owes whom at a glance'],
  ['02-group', 'Every trip, sorted', 'One ledger for the whole group'],
  ['03-add-expense', 'Add an expense like a sentence', 'Paid by you, split equally. Done.'],
  ['04-settle-up', 'Settle up over UPI', 'Pay from any UPI app in a tap'],
  ['05-activity', 'See what everyone added', 'Every expense and payment as it happens'],
];

/** One line of outlined text centred on `width`, shrunk until it fits `maxWidth`. */
function centredLine(face, text, width, baseline, size, maxWidth, letterSpacing) {
  const probe = textPath(face, text, 0, 0, size, letterSpacing);
  const fitted = probe.width > maxWidth ? (size * maxWidth) / probe.width : size;
  const line = textPath(face, text, 0, 0, fitted, letterSpacing);
  return textPath(face, text, (width - line.width) / 2, baseline, fitted, letterSpacing).d;
}

/**
 * A 1080×1920 phone screenshot: caption and subline on Splito purple, then the
 * capture (1080×2400) scaled to fit below them with rounded corners.
 */
function splitoPhoneShot(capture, title, subline) {
  const width = 1080;
  const height = 1920;
  const margin = 72;
  const titleBaseline = 196;
  const sublineBaseline = 268;
  const shotTop = 336;
  const shotHeight = height - shotTop - margin;
  const shotWidth = (shotHeight * 1080) / 2400;
  const shotLeft = (width - shotWidth) / 2;
  const radius = 44;
  const data = readFileSync(join(root, 'apps/splito/screenshots/raw', capture)).toString('base64');
  const box = `x="${shotLeft}" y="${shotTop}" width="${shotWidth}" height="${shotHeight}" rx="${radius}"`;
  return svgDoc(
    width,
    height,
    `<defs><clipPath id="shot"><rect ${box}/></clipPath>` +
      `<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="24"/></filter></defs>` +
      `<rect ${box} fill="#1E1747" opacity="0.45" filter="url(#shadow)" transform="translate(0 16)"/>` +
      `<path d="${centredLine(jakartaExtraBold, title, width, titleBaseline, 76, width - margin * 2, -0.02)}" fill="${splito.color.onPrimary}"/>` +
      `<path d="${centredLine(jakartaMedium, subline, width, sublineBaseline, 38, width - margin * 2, -0.01)}" fill="${splito.color.lilac}"/>` +
      `<image x="${shotLeft}" y="${shotTop}" width="${shotWidth}" height="${shotHeight}" clip-path="url(#shot)" href="data:image/png;base64,${data}"/>` +
      `<rect ${box} fill="none" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="3"/>`,
    splito.color.primary,
  );
}

for (const [name, title, subline] of phoneShots) {
  write(`apps/splito/screenshots/${name}.png`, opaquePng(splitoPhoneShot(`${name}.png`, title, subline), 1080));
}

// Drop: the macOS app icon ("The Slot"), drawn on Apple's 1024 grid.

/**
 * Drop's artwork in a 100-unit box: an app tile carrying the Nidus mark drops into a
 * glowing moss slot on an ink ground. `small` is the cut for 32 px and below: no
 * streaks or outlined mark, a bigger tile and a thicker slot, so it still reads.
 */
function dropArt(small) {
  const slotLight = '#C3EBB8';
  const defs =
    `<defs>` +
    `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B2A33"/><stop offset="0.55" stop-color="${ink}"/><stop offset="1" stop-color="#0D0C11"/></linearGradient>` +
    `<linearGradient id="face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E6E5EB"/></linearGradient>` +
    `<radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${slotLight}"/><stop offset="0.45" stop-color="${mossOnDark}" stop-opacity="0.85"/><stop offset="1" stop-color="${moss}" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="slot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050507"/><stop offset="1" stop-color="#1E3A1C"/></linearGradient>` +
    `<linearGradient id="lip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mossOnDark}"/><stop offset="1" stop-color="#3B5D38"/></linearGradient>` +
    `<linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.16"/><stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>` +
    `<clipPath id="sq"><rect width="100" height="100" rx="22.4"/></clipPath>` +
    `<clipPath id="above"><rect width="100" height="66.5"/></clipPath>` +
    `</defs>`;
  if (small) {
    return (
      defs +
      `<g clip-path="url(#sq)"><rect width="100" height="100" fill="${ink}"/>` +
      `<g clip-path="url(#above)"><g transform="rotate(-6 50 46)"><rect x="28" y="22" width="44" height="44" rx="11" fill="${paper}"/><circle cx="50" cy="47" r="7" fill="${moss}"/></g></g>` +
      `<ellipse cx="50" cy="70" rx="44" ry="15" fill="${mossOnDark}" opacity="0.55"/>` +
      `<rect x="12" y="64" width="76" height="11" rx="5.5" fill="#050507"/><rect x="12" y="64" width="76" height="3.4" rx="1.7" fill="${slotLight}"/></g>`
    );
  }
  const streaks = [
    [36, 10, 24, 2.2, 0.35],
    [50, 6, 20, 2.6, 0.6],
    [64, 12, 26, 2.2, 0.35],
  ]
    .map(([x, y1, y2, w, o]) => `<path d="M${x} ${y1}V${y2}" stroke="${mossOnDark}" stroke-width="${w}" stroke-linecap="round" opacity="${o}"/>`)
    .join('');
  return (
    defs +
    `<g clip-path="url(#sq)"><rect width="100" height="100" fill="url(#g)"/><rect width="100" height="100" fill="url(#sheen)"/>${streaks}` +
    `<g clip-path="url(#above)"><g transform="rotate(-6 50 48)">` +
    `<rect x="34.7" y="33.4" width="33" height="33" rx="8.5" fill="#000" opacity="0.25"/>` +
    `<rect x="33.5" y="31" width="33" height="33" rx="8.5" fill="url(#face)"/>` +
    `<rect x="39.5" y="37" width="21" height="21" rx="7" fill="none" stroke="${ink}" stroke-width="3"/>` +
    `<circle cx="50" cy="51.5" r="3.6" fill="${moss}"/>` +
    `<rect x="33.5" y="31" width="33" height="14" rx="8.5" fill="#FFFFFF" opacity="0.45"/></g></g>` +
    `<ellipse cx="50" cy="70" rx="42" ry="16" fill="url(#glow)" opacity="0.95"/>` +
    `<rect x="17" y="64" width="66" height="9" rx="4.5" fill="url(#slot)"/>` +
    `<rect x="17" y="64" width="66" height="2.4" rx="1.2" fill="${slotLight}" opacity="0.9"/>` +
    `<path d="M17 71.5h66v3a4 4 0 0 1-4 4h-58a4 4 0 0 1-4-4z" fill="url(#lip)"/></g>` +
    `<rect x="0.6" y="0.6" width="98.8" height="98.8" rx="22" fill="none" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="1.2"/>`
  );
}

/** Apple's macOS icon grid: artwork 824 square at 100,100 in a 1024 canvas, with a soft shadow. */
const appleGrid = { canvas: 1024, inset: 100, art: 824 };

function dropIcon(small) {
  const { canvas, inset, art } = appleGrid;
  const scale = art / 100;
  const shadow =
    `<filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur stdDeviation="14"/></filter>` +
    `<rect x="${inset}" y="${inset + 12}" width="${art}" height="${art}" rx="${art * 0.224}" fill="#000" opacity="0.32" filter="url(#shadow)"/>`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}" viewBox="0 0 ${canvas} ${canvas}">` +
    `${shadow}<g transform="translate(${inset} ${inset}) scale(${scale})">${dropArt(small)}</g></svg>`
  );
}

write('apps/drop/icon.svg', dropIcon(false));
write('apps/drop/icon-small.svg', dropIcon(true));
/** Every slot of a macOS .iconset, with the small cut where the icon is 32 px or less. */
const iconset = [
  ['icon_16x16.png', 16],
  ['icon_16x16@2x.png', 32],
  ['icon_32x32.png', 32],
  ['icon_32x32@2x.png', 64],
  ['icon_128x128.png', 128],
  ['icon_128x128@2x.png', 256],
  ['icon_256x256.png', 256],
  ['icon_256x256@2x.png', 512],
  ['icon_512x512.png', 512],
  ['icon_512x512@2x.png', 1024],
];
for (const [name, side] of iconset) {
  write(`apps/drop/Drop.iconset/${name}`, png(dropIcon(side <= 32), side));
}

// Shelf (shelf.niduslabs.dev): an ink tile holding three books on a shelf, the third (moss)
// standing on the same line and leaning against the second.
/** Shelf's books and shelf, drawn in a 28-unit box (the same art as the site's header logo). */
const shelfArt =
  `<rect x="7" y="8" width="3.5" height="10" rx="1" fill="${paper}"/>` +
  `<rect x="12.25" y="6" width="3.5" height="12" rx="1" fill="${paper}"/>` +
  `<rect x="18" y="9.5" width="3.5" height="8.5" rx="1" fill="${mossOnDark}" transform="rotate(-14 18 18)"/>` +
  `<rect x="6" y="19.5" width="16" height="2" rx="1" fill="${paper}"/>`;

/**
 * Shelf's icon at `side` px. `radius` rounds the tile (0 where the platform masks it);
 * `scale` shrinks the art toward the centre to keep it inside a maskable icon's safe zone.
 */
function shelfIcon(side, { radius = 8, scale = 1 } = {}) {
  const inset = (28 * (1 - scale)) / 2;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${side}" height="${side}" viewBox="0 0 28 28">` +
    `<rect width="28" height="28" rx="${radius}" fill="${ink}"/>` +
    `<g transform="translate(${inset} ${inset}) scale(${scale})">${shelfArt}</g></svg>`
  );
}

write('apps/shelf/favicon.svg', shelfIcon(32));
write(
  'apps/shelf/favicon.ico',
  ico([16, 32, 48].map((size) => ({ size, data: png(shelfIcon(size), size) }))),
);
write('apps/shelf/apple-touch-icon.png', png(shelfIcon(180, { radius: 0 }), 180));
write('apps/shelf/icon-192.png', png(shelfIcon(192), 192));
write('apps/shelf/icon-512.png', png(shelfIcon(512), 512));
write('apps/shelf/icon-maskable-512.png', png(shelfIcon(512, { radius: 0, scale: 0.8 }), 512));
