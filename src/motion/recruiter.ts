// Recruiter Mode choreography. Elements marked data-drop (outer wrappers that no other timeline
// transforms) are the "furniture" that falls. Full site → recruiter: shrink, desaturate, gravity
// drop, engine suspend, swap. Recruiter → full site: swap back, engine resume, furniture rises.
import { gsap } from 'gsap';
import { resume, suspend, syncFlags } from '@/engine';
import { prefersReducedMotion } from '@/engine/env';
import { setMode } from '@/lib/mode';

function furniture(): HTMLElement[] {
  const all = [...document.querySelectorAll<HTMLElement>('.fun-only [data-drop], .fun-only[data-drop]')];
  // Only what the visitor can see right now falls; the rest just disappears with the swap.
  return all.filter((el) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight && r.width > 0 && r.height > 0;
  });
}

const rand = gsap.utils.random;

export async function toRecruiter() {
  const root = document.documentElement;
  if (prefersReducedMotion()) {
    suspend();
    setMode('recruiter');
    syncFlags();
    document.documentElement.classList.remove('frame-away');
    scrollTo(0, 0);
    return;
  }
  root.classList.add('is-switching');
  const items = furniture();
  const stage = document.querySelectorAll<HTMLElement>('.fun-only[data-stage], .fun-only [data-stage]');
  const tl = gsap.timeline();
  tl.to(stage, { filter: 'grayscale(1) contrast(0.85)', duration: 0.6, ease: 'power1.out' }, 0)
    .to(items, { scale: 0.92, opacity: 0.85, duration: 0.45, ease: 'ink-soft', stagger: { each: 0.03, from: 'random' } }, 0)
    .to(items, {
      y: () => innerHeight * rand(1.1, 1.6),
      x: () => rand(-80, 80),
      rotation: () => rand(-28, 28),
      opacity: 0,
      duration: () => rand(0.7, 1.05),
      ease: 'power2.in', // gravity: accelerates all the way down
      stagger: { each: 0.045, from: 'random' },
    }, 0.35);
  await tl;
  suspend();
  gsap.set(items, { clearProps: 'transform,opacity' });
  gsap.set(stage, { clearProps: 'filter' });
  setMode('recruiter');
  syncFlags();
  document.documentElement.classList.remove('frame-away');
  scrollTo(0, 0);
  root.classList.remove('is-switching');
  const page = document.querySelector<HTMLElement>('.recruiter-only[data-recruiter-root]');
  if (page) await gsap.fromTo(page, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power1.out', clearProps: 'opacity' });
}

export async function toFun() {
  const root = document.documentElement;
  if (prefersReducedMotion()) {
    setMode('fun');
    scrollTo(0, 0);
    resume();
    return;
  }
  const page = document.querySelector<HTMLElement>('.recruiter-only[data-recruiter-root]');
  if (page) await gsap.to(page, { opacity: 0, duration: 0.25, ease: 'power1.in' });
  root.classList.add('is-switching');
  setMode('fun');
  scrollTo(0, 0);
  if (page) gsap.set(page, { clearProps: 'opacity' });
  resume();
  const items = furniture();
  await gsap.from(items, {
    y: () => innerHeight * rand(0.9, 1.3),
    rotation: () => rand(-22, 22),
    opacity: 0,
    duration: () => rand(0.9, 1.25),
    ease: 'ink-out',
    stagger: { each: 0.05, from: 'random' },
    clearProps: 'transform,opacity',
  });
  root.classList.remove('is-switching');
}
