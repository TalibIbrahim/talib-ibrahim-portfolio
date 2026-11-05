import localFont from 'next/font/local';

// Type roles (DESIGN.md "Type"): every face has one job.
//   Clash Display    display
//   General Sans     body
//   JetBrains Mono   code-flavoured details: labels, eyebrows, chips, key words, timecodes
//   Departure Mono   the hero's marquee rows only
//   Fraunces italic  2-3 accent words inside big headlines only

// Display: Clash Display (Fontshare, self-hosted). Tight, bold, contemporary.
export const clash = localFont({
  src: [
    { path: '../fonts/clash-display-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/clash-display-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/clash-display-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-clash',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

// Text: General Sans (Fontshare, self-hosted).
export const general = localFont({
  src: [
    { path: '../fonts/general-sans-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/general-sans-400-italic.woff2', weight: '400', style: 'italic' },
    { path: '../fonts/general-sans-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/general-sans-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-general',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

// Code details: JetBrains Mono (OFL, self-hosted, latin), 400 + 500 only.
export const mono = localFont({
  src: [
    { path: '../fonts/jetbrains-mono-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/jetbrains-mono-500-normal.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'Menlo', 'Consolas', 'monospace'],
});

// Hero marquee rows only: Departure Mono (OFL, self-hosted). Not preloaded: it is never in the first paint.
export const departure = localFont({
  src: [{ path: '../fonts/departure-mono-400-normal.woff2', weight: '400', style: 'normal' }],
  variable: '--font-departure',
  display: 'swap',
  preload: false,
  fallback: ['ui-monospace', 'Menlo', 'monospace'],
});

// Headline accents only: Fraunces italic (OFL, self-hosted, latin, variable opsz + wght).
export const fraunces = localFont({
  src: [{ path: '../fonts/fraunces-italic-variable.woff2', weight: '100 900', style: 'italic' }],
  variable: '--font-fraunces',
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'serif'],
});
