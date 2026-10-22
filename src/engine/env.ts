// Media queries + the shared easing vocabulary (DESIGN.md "Motion language").
// Use these names everywhere; never invent per-component curves.
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(hover: none), (pointer: coarse)').matches;
export const isMobile = () => typeof matchMedia !== 'undefined' && matchMedia('(max-width: 767px)').matches;

// Registered once; CustomEase only parses strings, so this is SSR-safe.
CustomEase.create('ink-out', '0.19, 1, 0.22, 1');
CustomEase.create('ink-soft', '0.22, 1, 0.36, 1');
CustomEase.create('ink-wipe', '0.625, 0.05, 0, 1');
CustomEase.create('ink-hard', '0.6, 0, 0, 1');

export const ease = {
  out: 'ink-out', // reveals, ink settling
  soft: 'ink-soft', // small UI, hovers
  wipe: 'ink-wipe', // clip-path wipes, curtain
  inOut: 'ink-hard', // big transforms: zoom, rotate
} as const;

/** Shorten a non-scrubbed duration when the visitor scrolls fast, so motion never lags behind them. */
export function velocityDuration(base: number, velocity: number) {
  const v = Math.abs(velocity);
  if (v < 8) return base;
  return Math.max(0.25, base * (1 - Math.min(v, 60) / 75));
}
