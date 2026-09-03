import localFont from 'next/font/local';
import { Outfit, Syne, JetBrains_Mono, Space_Grotesk, Instrument_Serif, Playfair_Display, Source_Serif_4 } from 'next/font/google';

// ── Primary body/UI — Outfit: geometric, sharp, variable ──
export const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

// ── Editorial/analysis — Syne: angular, futuristic, matches Arctic Guardian DNA ──
export const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

// ── Data/code — JetBrains Mono ──
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

// ── Legacy (kept for backward compat, can remove later) ──
export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
});

// ── Trumpstein editorial system — local assets, no additional network request ──
export const hilsfiger = localFont({
  src: '../public/fonts/Hilsfiger/Hilsfiger Regular.ttf',
  variable: '--font-hilsfiger',
  display: 'swap',
});

export const adhesianSerif = localFont({
  src: '../public/fonts/adhesian_serif/Adhesian-VF.ttf',
  variable: '--font-adhesian-serif',
  display: 'swap',
});

// Arctic Guardian Font Family - All variants
export const arcticGuardian = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardianleft.ttf',
  variable: '--font-arctic-guardian',
  display: 'swap',
});

export const arcticGuardian3D = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardian3d.ttf',
  variable: '--font-arctic-guardian-3d',
  display: 'swap',
});

export const arcticGuardianGrad = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardiangrad.ttf',
  variable: '--font-arctic-guardian-grad',
  display: 'swap',
});

export const arcticGuardianGradItalic = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardiangradital.ttf',
  variable: '--font-arctic-guardian-grad-italic',
  display: 'swap',
});

export const arcticGuardianLaser = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardianlaser.ttf',
  variable: '--font-arctic-guardian-laser',
  display: 'swap',
});

export const arcticGuardianLaserItalic = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardianlaserital.ttf',
  variable: '--font-arctic-guardian-laser-italic',
  display: 'swap',
});

export const arcticGuardianHalf = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardianhalf.ttf',
  variable: '--font-arctic-guardian-half',
  display: 'swap',
});

export const arcticGuardianHalfItalic = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardianhalfital.ttf',
  variable: '--font-arctic-guardian-half-italic',
  display: 'swap',
});

export const arcticGuardianTwoTone = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardiantwotone.ttf',
  variable: '--font-arctic-guardian-twotone',
  display: 'swap',
});

export const arcticGuardianTwoToneItalic = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardiantwotoneital.ttf',
  variable: '--font-arctic-guardian-twotone-italic',
  display: 'swap',
});

export const arcticGuardianLeft = localFont({
  src: '../public/fonts/Arctic_Guardian/arcticguardianleft.ttf',
  variable: '--font-arctic-guardian-left',
  display: 'swap',
});
