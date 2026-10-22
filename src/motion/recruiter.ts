// The way out to /recruiter: everything the visitor can see shrinks, greys and falls (gravity),
// then the router takes over. Elements marked data-drop are the "furniture" (outer wrappers that
// no other timeline transforms). Reduced motion: no fall, straight navigation.
import { gsap } from 'gsap';
import { prefersReducedMotion } from '@/engine/env';

function furniture(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('[data-drop]')].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight && r.width > 0 && r.height > 0;
  });
}

const rand = gsap.utils.random;

export async function dropAway() {
  if (prefersReducedMotion()) return;
  const items = furniture();
  const stage = document.querySelectorAll<HTMLElement>('[data-stage]');
  await gsap.timeline()
    .to(stage, { filter: 'grayscale(1) contrast(0.85)', duration: 0.5, ease: 'power1.out' }, 0)
    .to(items, { scale: 0.92, opacity: 0.85, duration: 0.4, ease: 'ink-soft', stagger: { each: 0.03, from: 'random' } }, 0)
    .to(items, {
      y: () => innerHeight * rand(1.1, 1.6),
      x: () => rand(-80, 80),
      rotation: () => rand(-28, 28),
      opacity: 0,
      duration: () => rand(0.6, 0.95),
      ease: 'power2.in', // gravity: accelerates all the way down
      stagger: { each: 0.04, from: 'random' },
    }, 0.3);
}
