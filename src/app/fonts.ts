import { Azeret_Mono } from 'next/font/google';
import localFont from 'next/font/local';

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

// Mono: small labels, timecodes and counters only.
export const azeret = Azeret_Mono({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-azeret',
  display: 'swap',
  fallback: ['ui-monospace', 'Menlo', 'monospace'],
});
