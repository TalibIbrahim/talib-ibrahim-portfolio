// Page transitions: an ink wash. The panel floods out from the click point, then drains upward
// off the new page. The adapter runs leave() while the next page loads.
import { gsap } from 'gsap';
import { ease, prefersReducedMotion } from './env';

let point = { x: 0.5, y: 0.5 }; // fraction of the viewport
export const setTransitionOrigin = (x: number, y: number) => {
  point = { x: x / innerWidth, y: y / innerHeight };
};

const curtain = () => document.getElementById('curtain');
const panel = (c: HTMLElement) => c.querySelector<HTMLElement>('.curtain__panel')!;

export function playLeave(): Promise<unknown> {
  const c = curtain();
  if (!c) return Promise.resolve();
  if (prefersReducedMotion()) {
    return Promise.resolve(gsap.timeline().set(c, { autoAlpha: 1 }).fromTo(c, { opacity: 0 }, { opacity: 1, duration: 0.2 }));
  }
  const at = `${(point.x * 100).toFixed(1)}% ${(point.y * 100).toFixed(1)}%`;
  return Promise.resolve(
    gsap.timeline()
      .set(c, { autoAlpha: 1, opacity: 1 })
      .fromTo(panel(c), { clipPath: `circle(0% at ${at})` }, { clipPath: `circle(150% at ${at})`, duration: 0.85, ease: ease.wipe }),
  );
}

export function playEnter(): Promise<unknown> {
  const c = curtain();
  if (!c) return Promise.resolve();
  if (prefersReducedMotion()) return Promise.resolve(gsap.to(c, { autoAlpha: 0, duration: 0.2 }));
  return Promise.resolve(
    gsap.timeline()
      .fromTo(panel(c), { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: ease.wipe })
      .set(c, { autoAlpha: 0 }),
  );
}
