// Engine core: framework-agnostic page lifecycle. No DOM access at import time (SSR-safe).
// The adapter (next.tsx) calls:
//   boot(setup)            once, on first load
//   leave() → cleanup()    before the route swaps
//   enter()                after the new page is in the DOM
// Recruiter Mode calls suspend() / resume(): the engine (Lenis, ScrollTriggers, cursor, GL) only
// runs while <html data-mode="fun">.
// Project code hooks in with onPage(fn): fn runs on every page load inside a gsap.context, so the
// tweens and ScrollTriggers it creates are reverted automatically. Return a cleanup for the rest.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { destroyScroll, initScroll, resetScroll, startScroll, stopScroll } from './scroll';
import { initReveals } from './reveal';
import { destroyCursor, initCursor, initMagnetic } from './cursor';
import { playEnter, playLeave } from './transition';
import { prefersReducedMotion } from './env';

export { onScroll, scrollState, scrollToTarget, stopScroll, startScroll } from './scroll';
export { setTransitionOrigin } from './transition';
export { ease, isTouch, isMobile, prefersReducedMotion, velocityDuration } from './env';

export type PageFn = (page: { intro: gsap.core.Timeline; path: string }) => void | (() => void);

const pageFns = new Set<PageFn>();
// Each running page function owns its own gsap.context, so unregistering one (a component
// unmount, React Strict Mode's double mount in dev) reverts exactly its tweens and triggers.
const live = new Map<PageFn, { ctx: gsap.Context; off?: () => void }>();
const cleanups: (() => void)[] = [];
let ctx: gsap.Context | null = null;
let intro: gsap.core.Timeline | null = null;
let ready = false;
let booted = false;
let running = false;

export const isFun = () => (document.documentElement.dataset.mode ?? 'fun') === 'fun';

/** Run fn on every page load (and now, if a page is ready). Returns an unsubscribe. */
export function onPage(fn: PageFn) {
  pageFns.add(fn);
  if (ready) runPageFn(fn);
  return () => {
    pageFns.delete(fn);
    stopPageFn(fn);
  };
}

function runPageFn(fn: PageFn) {
  stopPageFn(fn); // never twice
  const entry: { ctx: gsap.Context; off?: () => void } = { ctx: gsap.context(() => {}) };
  live.set(fn, entry); // registered first, so a throw (or a self-unsubscribe) still cleans up
  try {
    entry.ctx.add(() => {
      const r = fn({ intro: intro!, path: location.pathname });
      if (typeof r === 'function') entry.off = r;
    });
  } catch (err) {
    console.error(err); // one broken section must not take the rest of the page down
  }
}

function stopPageFn(fn: PageFn) {
  const e = live.get(fn);
  if (!e) return;
  live.delete(fn);
  e.off?.();
  e.ctx.revert();
}

export function syncFlags() {
  const h = document.documentElement.classList;
  h.add('js', 'is-booted');
  h.toggle('motion', !prefersReducedMotion() && isFun());
}

function initPage() {
  syncFlags();
  const cursor = document.getElementById('cursor');
  if (cursor) cursor.dataset.state = '';
  ctx = gsap.context(() => {
    intro = initReveals(document.querySelector('[data-fun-root]') ?? document);
    cleanups.push(initMagnetic(document));
  });
  ready = true;
  pageFns.forEach(runPageFn);
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

function start() {
  if (running) return;
  running = true;
  initScroll();
  initCursor();
  initPage();
  intro?.play();
}

/** First load. `setup` runs once on the client before the first page initializes. */
export function boot(setup?: () => void) {
  if (booted) return;
  booted = true;
  setup?.();
  syncFlags();
  if (isFun()) start();
}

/** Tear down the current page: reverts every tween, ScrollTrigger and split. */
export function cleanup() {
  if (!ready) return;
  ready = false;
  [...live.keys()].forEach(stopPageFn);
  cleanups.splice(0).forEach((c) => c());
  ctx?.revert();
  ctx = null;
}

/** Recruiter Mode on: stop everything. The DOM swap happens after this resolves. */
export function suspend() {
  cleanup();
  destroyScroll();
  destroyCursor();
  running = false;
  syncFlags();
}

/** Recruiter Mode off: the fun tree is visible again. */
export function resume() {
  syncFlags();
  resetScroll();
  start();
}

/** Cover the screen before a route change. Recruiter Mode navigates without a curtain. */
export async function leave() {
  if (!running) return;
  stopScroll();
  await playLeave();
}

/** Init the new page. `transition: false` for back/forward, where no leave ran. */
export async function enter({ transition = true, scrollTop = true } = {}) {
  if (!booted) return;
  if (!running) {
    if (scrollTop) scrollTo(0, 0);
    return;
  }
  cleanup();
  if (scrollTop) resetScroll();
  initPage();
  if (transition) await playEnter();
  startScroll();
  intro?.play();
}
