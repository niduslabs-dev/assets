/**
 * Pane's macOS app icon, "Phone behind glass": an Android phone with a moss screen, and a
 * clear tilted pane of glass over its corner. Under the glass the phone is drawn a second
 * time, paler and shifted, which is how the sheet refracts without blend modes. The Nidus
 * seed sits on the glass.
 *
 * Three cuts. `full` is drawn in a 100-unit tile on Apple's 1024 grid and is used from
 * 64 px up. `cut32` and `cut16` are drawn straight on their own pixel grids, every edge on
 * a whole pixel: the pane stands straight, the camera, buttons and gesture bar go, and the
 * 16 px cut drops the seed, which is noise at that size.
 *
 * Callers pass the studio colours from tokens.json; nothing here reads files.
 */

/** Apple's macOS icon grid: artwork 824 square at 100,100 in a 1024 canvas. */
export const paneGrid = { canvas: 1024, inset: 100, art: 824, corner: 0.224 };

/**
 * Where the phone and pane sit in the 100-unit tile. They are drawn at their round 3
 * positions, then scaled about the pair's own box and moved so the box centre lands on
 * `centre`: right of the tile's centre because the dark phone carries the left side.
 */
export const paneLayout = {
  phone: { x: 24, y: 13, w: 36, h: 70, r: 9, bezel: 2.4 },
  sheet: { x: 39, y: 35, side: 48, r: 11, tilt: 8 },
  seed: { x: 70, y: 68, r: 4.6 },
  scale: 1.15,
  centre: { x: 51.5, y: 50 },
};

/** The glass's own colours: the phone seen through the sheet. Pane's, not studio tokens. */
export const paneGlass = {
  frame: '#6F7F7A',
  mintTop: '#C4E6D4',
  mintBottom: '#93CDB0',
  camera: '#33443C',
};

const hex = (n) => Math.round(n).toString(16).padStart(2, '0').toUpperCase();

/** `a` moved `t` of the way to `b`, both #RRGGBB. */
export function mix(a, b, t) {
  const p = (c, i) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16);
  return '#' + [0, 1, 2].map((i) => hex(p(a, i) + (p(b, i) - p(a, i)) * t)).join('');
}

const rect = (x, y, w, h, r, rest) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ${rest}/>`;

/** The tight box of the phone (with its side buttons) and the tilted sheet, before scaling. */
export function pairBox() {
  const { phone, sheet } = paneLayout;
  const a = (sheet.tilt * Math.PI) / 180;
  const half = (sheet.side / 2 - sheet.r) * (Math.cos(a) + Math.sin(a)) + sheet.r;
  const c = { x: sheet.x + sheet.side / 2, y: sheet.y + sheet.side / 2 };
  const x0 = Math.min(phone.x, c.x - half);
  const y0 = Math.min(phone.y, c.y - half);
  const x1 = Math.max(phone.x + phone.w + 1, c.x + half);
  const y1 = Math.max(phone.y + phone.h, c.y + half);
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/** The pair's box in the tile after `paneLayout.scale` and centring. */
export function placedBox() {
  const b = pairBox();
  const { scale, centre } = paneLayout;
  return { x: centre.x - (b.w * scale) / 2, y: centre.y - (b.h * scale) / 2, w: b.w * scale, h: b.h * scale };
}

function phone(id, tag, c, { buttons }) {
  const { x, y, w, h, r, bezel } = paneLayout.phone;
  const side = buttons
    ? rect(x + w - 0.3, y + 15, 1.3, 7, 0.6, `fill="${c.frame}"`) + rect(x + w - 0.3, y + 25, 1.3, 12, 0.6, `fill="${c.frame}"`)
    : '';
  return (
    `<linearGradient id="${id}${tag}" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bottom}"/></linearGradient>` +
    side +
    rect(x, y, w, h, r, `fill="${c.frame}"`) +
    rect(x + bezel, y + bezel, w - bezel * 2, h - bezel * 2, r - bezel + 0.2, `fill="url(#${id}${tag})"`) +
    `<circle cx="${x + w / 2}" cy="${y + 6.6}" r="1.7" fill="${c.camera}"/>` +
    rect(x + w / 2 - 5.5, y + h - 6.2, 11, 1.5, 0.75, `fill="#FFFFFF" fill-opacity="${c.bar}"`)
  );
}

/** The full cut's artwork in the 100-unit tile, unclipped. `id` prefixes every def. */
function fullArt({ ink, paper, moss }, id) {
  const { phone: p, sheet: s, seed, scale, centre } = paneLayout;
  const box = pairBox();
  const turn = `transform="rotate(${s.tilt} ${s.x + s.side / 2} ${s.y + s.side / 2})"`;
  const pane = (rest, dx = 0, dy = 0, grow = 0) =>
    rect(s.x + dx - grow, s.y + dy - grow, s.side + grow * 2, s.side + grow * 2, s.r + grow, rest);
  const base = { frame: ink, top: mix(moss, '#FFFFFF', 0.14), bottom: mix(moss, '#000000', 0.18), camera: mix(ink, '#000000', 0.5), bar: 0.6 };
  const lit = { frame: paneGlass.frame, top: paneGlass.mintTop, bottom: paneGlass.mintBottom, camera: paneGlass.camera, bar: 0.95 };
  const tile =
    `<linearGradient id="${id}tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(paper, '#FFFFFF', 0.75)}"/><stop offset="0.6" stop-color="${mix(paper, ink, 0.025)}"/><stop offset="1" stop-color="${mix(paper, ink, 0.09)}"/></linearGradient>` +
    `<radialGradient id="${id}th" cx="0.28" cy="0.10" r="0.8"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>` +
    `<rect width="100" height="100" fill="url(#${id}tg)"/><rect width="100" height="100" fill="url(#${id}th)"/>`;
  const defs =
    `<filter id="${id}sb" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>` +
    `<filter id="${id}pb" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter>` +
    `<clipPath id="${id}pc"><rect x="${s.x}" y="${s.y}" width="${s.side}" height="${s.side}" rx="${s.r}" ${turn}/></clipPath>` +
    `<linearGradient id="${id}pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.55"/><stop offset="0.42" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.07"/></linearGradient>` +
    `<linearGradient id="${id}pe" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.6" stop-color="#FFFFFF" stop-opacity="0.55"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0.25"/></linearGradient>`;
  const pair =
    rect(p.x + 0.6, p.y + 2.6, p.w, p.h, p.r, `fill="#000" opacity="0.28" filter="url(#${id}sb)"`) +
    phone(id, 'a', base, { buttons: true }) +
    `<g ${turn}>${pane(`fill="#000" opacity="0.24" filter="url(#${id}pb)"`, 1.2, 2.6)}${pane('fill="#FFFFFF" fill-opacity="0.34"')}</g>` +
    `<g clip-path="url(#${id}pc)"><g transform="translate(1.3 -1.1)">${phone(id, 'b', lit, { buttons: false })}</g></g>` +
    `<g ${turn}>` +
    pane(`fill="url(#${id}pg)"`) +
    pane('fill="none" stroke="#000" stroke-opacity="0.09" stroke-width="1"', 0, 0, -0.9) +
    pane(`fill="none" stroke="url(#${id}pe)" stroke-width="1"`) +
    `<path d="M${s.x + s.r * 0.55} ${s.y + 3.2}H${s.x + s.side * 0.58}" stroke="#FFFFFF" stroke-opacity="0.8" stroke-width="1.3" stroke-linecap="round"/>` +
    `<path d="M${s.x + 3.2} ${s.y + s.r * 0.75}V${s.y + s.side * 0.36}" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="1.1" stroke-linecap="round"/>` +
    `<circle cx="${seed.x}" cy="${seed.y + 0.7}" r="${seed.r}" fill="#000" opacity="0.18"/>` +
    `<circle cx="${seed.x}" cy="${seed.y}" r="${seed.r}" fill="${moss}"/>` +
    `<circle cx="${seed.x - seed.r * 0.3}" cy="${seed.y - seed.r * 0.35}" r="${seed.r * 0.32}" fill="#FFFFFF" opacity="0.35"/>` +
    `</g>`;
  const move = `translate(${centre.x} ${centre.y}) scale(${scale}) translate(${-(box.x + box.w / 2)} ${-(box.y + box.h / 2)})`;
  return `${tile}${defs}<g transform="${move}">${pair}</g>`;
}

/** The full cut on Apple's grid at `size` px (drawn in the 1024 canvas). */
export function paneIcon(colors, { size = paneGrid.canvas, id = 'p' } = {}) {
  const { canvas, inset, art, corner } = paneGrid;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${canvas} ${canvas}" role="img" aria-label="Pane">` +
    `<filter id="${id}shadow" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur stdDeviation="16"/></filter>` +
    `<rect x="${inset}" y="${inset + 16}" width="${art}" height="${art}" rx="${art * corner}" fill="#000" opacity="0.30" filter="url(#${id}shadow)"/>` +
    `<g transform="translate(${inset} ${inset}) scale(${art / 100})"><clipPath id="${id}sq"><rect width="100" height="100" rx="${100 * corner}"/></clipPath>` +
    `<g clip-path="url(#${id}sq)">${fullArt(colors, id)}</g>` +
    `<rect x="0.4" y="0.4" width="99.2" height="99.2" rx="${100 * corner - 0.2}" fill="none" stroke="${colors.ink}" stroke-opacity="0.12" stroke-width="0.8"/></g></svg>\n`
  );
}

/**
 * The hand-tuned cuts, in whole pixels of their own canvas: `tile` is the tile's inset and
 * side, `phone` and `sheet` are x, y, width, height and corner, `seed` is centre and radius
 * (absent at 16). The web favicon is the 32 cut's art on a tile that fills the canvas.
 */
export const paneSmallCuts = {
  32: { canvas: 32, tile: [3, 26], phone: [7, 5, 11, 21, 3], sheet: [13, 13, 14, 14, 3.5], seed: [22.5, 22.5, 1.7] },
  16: { canvas: 16, tile: [1, 14], phone: [3, 2, 6, 11, 1.75], sheet: [6, 6, 8, 8, 2] },
  favicon: { canvas: 32, tile: [0, 32], phone: [5, 3, 13, 26, 3.5], sheet: [12, 13, 17, 17, 4], seed: [23.5, 24.5, 2] },
};

/** A small cut at `size` px. `cut` is a key of `paneSmallCuts`. */
export function paneSmallIcon({ ink, paper, moss }, cut, { size, id = 'p' } = {}) {
  const { canvas, tile, phone: p, sheet: s, seed } = paneSmallCuts[cut];
  const [inset, side] = tile;
  const framed = inset > 0;
  const body = (c, screen) => rect(p[0], p[1], p[2], p[3], p[4], `fill="${c}"`) + rect(p[0] + 1, p[1] + 1, p[2] - 2, p[3] - 2, Math.max(p[4] - 1, 0.5), `fill="${screen}"`);
  const sheet = (rest, grow = 0) => rect(s[0] - grow, s[1] - grow, s[2] + grow * 2, s[3] + grow * 2, s[4] + grow, rest);
  const shadow = framed
    ? `<filter id="${id}ts" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur stdDeviation="${canvas / 64}"/></filter>` +
      rect(inset, inset + canvas / 64, side, side, side * paneGrid.corner, `fill="#000" opacity="0.30" filter="url(#${id}ts)"`)
    : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size ?? canvas}" height="${size ?? canvas}" viewBox="0 0 ${canvas} ${canvas}" role="img" aria-label="Pane">` +
    `<linearGradient id="${id}tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(paper, '#FFFFFF', 0.75)}"/><stop offset="1" stop-color="${mix(paper, ink, 0.06)}"/></linearGradient>` +
    `<clipPath id="${id}pc">${sheet('')}</clipPath>` +
    shadow +
    rect(inset, inset, side, side, side * paneGrid.corner, `fill="url(#${id}tg)"`) +
    (framed ? rect(inset + 0.5, inset + 0.5, side - 1, side - 1, side * paneGrid.corner - 0.5, `fill="none" stroke="${ink}" stroke-opacity="0.16"`) : '') +
    body(ink, moss) +
    sheet(`fill="${ink}" fill-opacity="0.30"`, 0) +
    sheet('fill="#FFFFFF"', -1) +
    `<g clip-path="url(#${id}pc)">${body(paneGlass.frame, paneGlass.mintTop)}</g>` +
    sheet(`fill="none" stroke="${ink}" stroke-opacity="0.42"`, -0.5) +
    (seed ? `<circle cx="${seed[0]}" cy="${seed[1]}" r="${seed[2]}" fill="${moss}"/>` : '') +
    `</svg>\n`
  );
}
