/**
 * Generate OG images with trump_logo_ascii.png as centerpiece.
 * Run: node scripts/gen-og-images.mjs
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images');
mkdirSync(OUT, { recursive: true });

const COUNT = 4175;
const LOGO_B64 = readFileSync(path.join(ROOT, 'public/web-app-manifest-512x512.png')).toString('base64');
const LOGO_URI = `data:image/png;base64,${LOGO_B64}`;
// Logo native: 512×512
const LOGO_NATIVE_W = 512;
const LOGO_NATIVE_H = 512;

const ORANGE = '#FF6500';
const BG = '#0a0a0a';
const WHITE = '#ffffff';
const MUTED = 'rgba(255,255,255,0.50)';
const DIM = 'rgba(255,255,255,0.25)';
const GRID = 'rgba(255,101,0,0.055)';

const SCORES = ['Danger', 'Lawlessness', 'Insanity', 'Absurdity', 'Impact'];

function gridLines(W, H, size = 40) {
  let s = '';
  for (let y = 0; y <= H; y += size) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${GRID}" stroke-width="1"/>`;
  for (let x = 0; x <= W; x += size) s += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${GRID}" stroke-width="1"/>`;
  return s;
}

/**
 * Landscape 1200×630 — logo right side, text left
 */
function buildLandscape() {
  const W = 1200, H = 630;
  const padX = 64, padY = 52;

  // Logo: fit in right 480px square column, full height minus padding
  const logoAreaW = 480, logoAreaH = H - padY * 2;
  const logoScale = Math.min(logoAreaW / LOGO_NATIVE_W, logoAreaH / LOGO_NATIVE_H);
  const logoW = Math.round(LOGO_NATIVE_W * logoScale);
  const logoH = Math.round(LOGO_NATIVE_H * logoScale);
  const logoX = W - padX - logoW;
  const logoY = Math.round((H - logoH) / 2);

  // Left text column width
  const textW = W - padX * 2 - logoW - 40;

  // Sizes
  const countSize = 108;
  const headlineSize = 38;
  const bodySize = 20;
  const tagSize = 13;
  const dotR = 5;
  const scoreGap = 20;

  // Vertical layout on left
  const topTagY = padY + tagSize;
  const countY = topTagY + 48 + countSize;
  const subY = countY + 10 + 28;
  const headlineY = subY + 50;
  const bodyY = headlineY + 36;
  const scoreY = H - padY - 4;

  const pills = SCORES.map((label, i) => {
    const approxW = dotR * 2 + 8 + label.length * 8;
    const prev = SCORES.slice(0, i).reduce((a, l) => a + dotR * 2 + 8 + l.length * 8 + scoreGap, 0);
    const x = padX + prev;
    return `
      <circle cx="${x + dotR}" cy="${scoreY - dotR / 2}" r="${dotR}" fill="${ORANGE}" opacity="0.7"/>
      <text x="${x + dotR * 2 + 6}" y="${scoreY}" font-size="${tagSize}" fill="${DIM}" font-family="system-ui,sans-serif" letter-spacing="1.1" font-weight="600">${label}</text>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="gr1" cx="75%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${ORANGE}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gr2" cx="10%" cy="80%" r="45%">
      <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${ORANGE}" stop-opacity="0"/>
    </radialGradient>
    <filter id="logoGlow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <filter id="logoGlowBg">
      <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="blur"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  ${gridLines(W, H)}
  <rect width="${W}" height="${H}" fill="url(#gr1)"/>
  <rect width="${W}" height="${H}" fill="url(#gr2)"/>

  <!-- Vertical orange divider -->
  <line x1="${W - padX - logoW - 24}" y1="${padY}" x2="${W - padX - logoW - 24}" y2="${H - padY}" stroke="${ORANGE}" stroke-width="1" opacity="0.25"/>

  <!-- Logo glow behind -->
  <image href="${LOGO_URI}" x="${logoX}" y="${logoY}" width="${logoW}" height="${logoH}" filter="url(#logoGlowBg)" opacity="0.35"/>
  <!-- Logo proper -->
  <image href="${LOGO_URI}" x="${logoX}" y="${logoY}" width="${logoW}" height="${logoH}" opacity="0.92"/>

  <!-- Top tag -->
  <rect x="${padX}" y="${topTagY - tagSize - 5}" width="160" height="${tagSize + 10}" rx="3" fill="${ORANGE}"/>
  <text x="${padX + 10}" y="${topTagY - 1}" font-size="${tagSize}" fill="#fff" font-weight="900" font-family="system-ui,sans-serif" letter-spacing="2">THE TRUMP FILES</text>

  <!-- Count -->
  <text x="${padX}" y="${countY}" font-size="${countSize}" font-weight="900" fill="${ORANGE}" font-family="system-ui,sans-serif" letter-spacing="-3">${COUNT.toLocaleString()}</text>

  <!-- "documented incidents" -->
  <text x="${padX}" y="${subY}" font-size="24" font-weight="700" fill="${MUTED}" font-family="system-ui,sans-serif">documented incidents</text>

  <!-- Headline -->
  <text x="${padX}" y="${headlineY}" font-size="${headlineSize}" font-weight="900" fill="${WHITE}" font-family="system-ui,sans-serif">Encyclopedia Orange</text>

  <!-- Body -->
  <text x="${padX}" y="${bodyY}" font-size="${bodySize}" fill="${MUTED}" font-family="system-ui,sans-serif">AI-scored · source-linked · timestamped</text>

  <!-- URL bottom right -->
  <text x="${W - padX}" y="${H - padY + 4}" font-size="${tagSize}" fill="${DIM}" font-family="system-ui,sans-serif" text-anchor="end" letter-spacing="0.5">trumpfiles.fun</text>

  <!-- Score pills -->
  ${pills}
</svg>`;
}

/**
 * Square 1200×1200 — logo top-center, text below
 */
function buildSquare() {
  const W = 1200, H = 1200;
  const padX = 72, padY = 64;

  // Logo centered top half
  const logoMaxW = 520, logoMaxH = 420;
  const logoScale = Math.min(logoMaxW / LOGO_NATIVE_W, logoMaxH / LOGO_NATIVE_H);
  const logoW = Math.round(LOGO_NATIVE_W * logoScale);
  const logoH = Math.round(LOGO_NATIVE_H * logoScale);
  const logoX = Math.round((W - logoW) / 2);
  const logoY = padY + 80;

  const countSize = 120;
  const headlineSize = 48;
  const bodySize = 26;
  const tagSize = 16;
  const dotR = 6;
  const scoreGap = 28;

  const textStartY = logoY + logoH + 40;
  const tagY = textStartY + tagSize;
  const countY = tagY + 56 + countSize;
  const subY = countY + 14 + 32;
  const headlineY = subY + 60;
  const bodyY = headlineY + 46;
  const scoreY = H - padY - 4;

  const pills = SCORES.map((label, i) => {
    const prev = SCORES.slice(0, i).reduce((a, l) => a + dotR * 2 + 8 + l.length * 10.5 + scoreGap, 0);
    const x = padX + prev;
    return `
      <circle cx="${x + dotR}" cy="${scoreY - dotR / 2}" r="${dotR}" fill="${ORANGE}" opacity="0.7"/>
      <text x="${x + dotR * 2 + 8}" y="${scoreY}" font-size="${tagSize}" fill="${DIM}" font-family="system-ui,sans-serif" letter-spacing="1.2" font-weight="600">${label}</text>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="gs1" cx="50%" cy="35%" r="55%">
      <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${ORANGE}" stop-opacity="0"/>
    </radialGradient>
    <filter id="lgb2">
      <feGaussianBlur in="SourceGraphic" stdDeviation="32" result="blur"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  ${gridLines(W, H)}
  <rect width="${W}" height="${H}" fill="url(#gs1)"/>

  <!-- Horizontal divider below logo -->
  <line x1="${padX}" y1="${logoY + logoH + 24}" x2="${W - padX}" y2="${logoY + logoH + 24}" stroke="${ORANGE}" stroke-width="1" opacity="0.2"/>

  <!-- Logo glow -->
  <image href="${LOGO_URI}" x="${logoX}" y="${logoY}" width="${logoW}" height="${logoH}" filter="url(#lgb2)" opacity="0.30"/>
  <image href="${LOGO_URI}" x="${logoX}" y="${logoY}" width="${logoW}" height="${logoH}" opacity="0.92"/>

  <!-- Tag -->
  <rect x="${padX}" y="${tagY - tagSize - 6}" width="200" height="${tagSize + 12}" rx="4" fill="${ORANGE}"/>
  <text x="${padX + 12}" y="${tagY - 1}" font-size="${tagSize}" fill="#fff" font-weight="900" font-family="system-ui,sans-serif" letter-spacing="2">THE TRUMP FILES</text>

  <!-- Count -->
  <text x="${padX}" y="${countY}" font-size="${countSize}" font-weight="900" fill="${ORANGE}" font-family="system-ui,sans-serif" letter-spacing="-3">${COUNT.toLocaleString()}</text>

  <!-- Sub -->
  <text x="${padX}" y="${subY}" font-size="28" font-weight="700" fill="${MUTED}" font-family="system-ui,sans-serif">documented incidents</text>

  <!-- Headline -->
  <text x="${padX}" y="${headlineY}" font-size="${headlineSize}" font-weight="900" fill="${WHITE}" font-family="system-ui,sans-serif">Encyclopedia Orange</text>

  <!-- Body -->
  <text x="${padX}" y="${bodyY}" font-size="${bodySize}" fill="${MUTED}" font-family="system-ui,sans-serif">AI-scored · source-linked · timestamped</text>

  <!-- URL -->
  <text x="${W - padX}" y="${H - padY + 4}" font-size="${tagSize}" fill="${DIM}" font-family="system-ui,sans-serif" text-anchor="end" letter-spacing="0.5">trumpfiles.fun</text>

  ${pills}
</svg>`;
}

const TARGETS = [
  { name: 'og-image-2.png',     svg: buildLandscape() },
  { name: 'og-image-square.png', svg: buildSquare()    },
];

for (const { name, svg } of TARGETS) {
  const outPath = path.join(OUT, name);
  await sharp(Buffer.from(svg))
    .png({ quality: 95 })
    .toFile(outPath);
  console.log(`✓ ${name}`);
}
console.log('\nDone → public/images/');
