// Page transitions: an ink brush stroke. Leave: one fat pen-blue stroke sweeps across and covers
// the screen (bristle streaks ride inside it). Enter: the stroke drains off the new page in the
// same direction. Markup lives in the layout (#curtain > svg). The adapter runs leave() while the
// next page loads.
import { gsap } from 'gsap';
import { ease, prefersReducedMotion } from './env';

// Kept for the adapter's API; the stroke always sweeps the same way, like handwriting.
export const setTransitionOrigin = (x: number, y: number) => {
  void x;
  void y;
};

const curtain = () => document.getElementById('curtain');
const strokes = (c: HTMLElement) => [...c.querySelectorAll<SVGPathElement>('[data-stroke]')];

export function playLeave(): Promise<unknown> {
  const c = curtain();
  if (!c) return Promise.resolve();
  if (prefersReducedMotion()) {
    gsap.set(strokes(c), { strokeDashoffset: 0 });
    return Promise.resolve(gsap.timeline().set(c, { autoAlpha: 1 }).fromTo(c, { opacity: 0 }, { opacity: 1, duration: 0.2 }));
  }
  const s = strokes(c);
  return Promise.resolve(
    gsap.timeline()
      .set(c, { autoAlpha: 1, opacity: 1 })
      .fromTo(s, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: ease.wipe, stagger: 0.04 }),
  );
}

export function playEnter(): Promise<unknown> {
  const c = curtain();
  if (!c) return Promise.resolve();
  if (prefersReducedMotion()) return Promise.resolve(gsap.to(c, { autoAlpha: 0, duration: 0.2 }));
  const s = strokes(c);
  return Promise.resolve(
    gsap.timeline()
      .to(s, { strokeDashoffset: -1, duration: 0.8, ease: ease.wipe, stagger: { each: 0.04, from: 'end' } })
      .set(c, { autoAlpha: 0 })
      .set(s, { strokeDashoffset: 1 }),
  );
}
