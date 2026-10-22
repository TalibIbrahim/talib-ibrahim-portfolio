// Canvas plumbing for the finale game: one clock (gsap.ticker), capped DPR, tokens read from CSS.
import { gsap } from 'gsap';

export type Tick = (dt: number) => void;

/** A start/stop handle for `tick` (dt in seconds, clamped to 50 ms) on the GSAP ticker. */
export function tickerLoop(tick: Tick) {
  let on = false;
  const fn = (_time: number, deltaMs: number) => tick(Math.min(deltaMs, 50) / 1000);
  return {
    get running() {
      return on;
    },
    start() {
      if (on) return;
      on = true;
      gsap.ticker.add(fn);
    },
    stop() {
      if (!on) return;
      on = false;
      gsap.ticker.remove(fn);
    },
  };
}

/** Calls `onChange` when `el` enters or leaves the viewport. Returns a disconnect. */
export function watchVisible(el: Element, onChange: (visible: boolean) => void) {
  const io = new IntersectionObserver(([e]) => onChange(e.isIntersecting), { threshold: 0 });
  io.observe(el);
  return () => io.disconnect();
}

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Read a CSS custom property from :root (tokens live in globals.css). */
export const token = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

/** Resolve a font-family var (next/font hashes the family name). */
export const family = (name: string) => {
  const probe = document.createElement('span');
  probe.style.fontFamily = `var(${name})`;
  document.body.appendChild(probe);
  const f = getComputedStyle(probe).fontFamily;
  probe.remove();
  return f;
};

/** Size a canvas to its CSS box at a capped DPR. Returns the 2D context already scaled. */
export function fitCanvas(canvas: HTMLCanvasElement, w: number, h: number, maxDpr = 2) {
  const dpr = Math.min(devicePixelRatio || 1, maxDpr);
  canvas.width = Math.max(1, Math.round(w * dpr));
  canvas.height = Math.max(1, Math.round(h * dpr));
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, dpr };
}

/** Fill {key} placeholders. */
export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
