'use client';
// Timeline motion. Renders nothing; wires the server-rendered #experience section on every page load.
//
// Boundary 8, the strike-through: the paper sheet is revealed by a polygon clip whose edge is a
// "/" diagonal sweeping left to right, with an accent band (the pen stroke) leading the edge.
//   Desktop: scrubbed while the section top travels 90% -> 5% of the viewport (ease.wipe).
//   Phones:  the same wipe, played once in 0.9 s (shortened by scroll velocity).
// Body, desktop: three depth layers drift at three scroll speeds over the whole section
//   (experience 3vh, education 10vh, certifications 16vh) and their entries arrive once:
//   experience from the left (ease.out), education from the right (ease.soft),
//   certifications from below (ease.inOut).
// Body, phones: single column, each entry is a masked (clip-path) reveal. No parallax.
// Reduced motion / no JS / Recruiter Mode: nothing runs; the sheet is plain and fully visible.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, scrollState, velocityDuration } from '@/engine';
import { usePage } from '@/engine/next';

gsap.registerPlugin(ScrollTrigger);

const DEPTH = { a: 0.03, b: 0.1, c: 0.16 } as const; // share of the viewport height, each way
const LEAD = 0.07; // the ink band leads the paper edge by this share of the width

export function TimelineMotion() {
  usePage(() => {
    const section = document.getElementById('experience');
    const sheet = section?.querySelector<HTMLElement>('[data-sheet]');
    const ink = section?.querySelector<HTMLElement>('[data-wipe-ink]');
    if (!section || !sheet || !ink) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        desk: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        phone: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      },
      (c) => {
        if (!document.documentElement.classList.contains('motion')) return;
        return c.conditions?.desk ? initDesk(section, sheet, ink) : initPhone(section, sheet, ink);
      },
    );
    return () => mm.revert();
  });
  return null;
}

/** "/" edge through (a, 0) and (a - slant, h). Everything left of it is visible. */
function poly(a: number, slant: number, h: number) {
  return `polygon(0px 0px, ${a}px 0px, ${a - slant}px ${h}px, 0px ${h}px)`;
}

/* ---------------------------------------------------------------- desktop */

function initDesk(section: HTMLElement, sheet: HTMLElement, ink: HTMLElement) {
  const W = () => section.clientWidth;
  const H = () => section.offsetHeight;
  // The edge crosses ~45% of the width over one viewport of height, whatever the section height.
  const S = () => (0.45 * W() * H()) / innerHeight;
  const lead = () => LEAD * W();

  const wipe = gsap.timeline({
    defaults: { ease: ease.wipe, duration: 1 },
    scrollTrigger: {
      trigger: section,
      start: 'top 90%',
      end: 'top 5%',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
    onUpdate: () => {
      // Fully drawn: drop the clip so nothing (Recruiter Mode's falling blocks) gets cut at the edges.
      if (wipe.progress() === 1) sheet.style.clipPath = 'none';
    },
  });
  wipe
    .fromTo(ink, { clipPath: () => poly(lead(), S(), H()) }, { clipPath: () => poly(W() + S() + lead(), S(), H()) }, 0)
    .fromTo(sheet, { clipPath: () => poly(0, S(), H()) }, { clipPath: () => poly(W() + S(), S(), H()) }, 0);

  // Depth: three layers, three speeds.
  (Object.keys(DEPTH) as (keyof typeof DEPTH)[]).forEach((k) => {
    const el = section.querySelector<HTMLElement>(`[data-depth="${k}"]`);
    if (!el) return;
    gsap.fromTo(
      el,
      { y: () => DEPTH[k] * innerHeight },
      {
        y: () => -DEPTH[k] * innerHeight,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      },
    );
  });

  // Arrivals: left / right / below, each with its own ease.
  // Tweens born in onEnter run outside the matchMedia context; track them so cleanup kills them.
  const late: gsap.core.Animation[] = [];
  const arrive = (targets: HTMLElement[], from: gsap.TweenVars, curve: string, base: number, trigger: Element) => {
    if (!targets.length) return;
    gsap.set(targets, from);
    ScrollTrigger.create({
      trigger,
      start: 'top 86%',
      once: true,
      onEnter: () =>
        void late.push(
          gsap.to(targets, {
            x: 0,
            y: 0,
            autoAlpha: 1,
            duration: velocityDuration(base, scrollState().velocity),
            ease: curve,
            stagger: 0.08,
          }),
        ),
    });
  };
  const inLayer = (k: string, sel: string) =>
    gsap.utils.toArray<HTMLElement>(`[data-depth="${k}"] ${sel}`, section);

  inLayer('a', '[data-entry]').forEach((el) => arrive([el], { x: -96, autoAlpha: 0 }, ease.out, 1.3, el));
  inLayer('b', '[data-entry]').forEach((el) => arrive([el], { x: 96, autoAlpha: 0 }, ease.soft, 1.2, el));
  const certs = inLayer('c', '[data-cert]');
  if (certs[0]) arrive(certs, { y: 64, autoAlpha: 0 }, ease.inOut, 1.1, certs[0].parentElement ?? certs[0]);

  return () => {
    late.forEach((t) => t.kill());
    sheet.style.removeProperty('clip-path');
  };
}

/* ---------------------------------------------------------------- phones */

function initPhone(section: HTMLElement, sheet: HTMLElement, ink: HTMLElement) {
  const hidden = (w: number, h: number) => poly(0, (0.6 * w * h) / innerHeight, h);
  gsap.set(sheet, { clipPath: hidden(section.clientWidth, section.offsetHeight) });
  gsap.set(ink, { clipPath: hidden(section.clientWidth, section.offsetHeight) });
  const late: gsap.core.Animation[] = [];

  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      const w = section.clientWidth;
      const h = section.offsetHeight;
      const s = (0.6 * w * h) / innerHeight;
      const d = velocityDuration(0.9, scrollState().velocity);
      late.push(gsap
        .timeline({ defaults: { ease: ease.wipe, duration: d } })
        .fromTo(ink, { clipPath: poly(LEAD * w, s, h) }, { clipPath: poly(w + s + LEAD * w, s, h) }, 0)
        .fromTo(
          sheet,
          { clipPath: poly(0, s, h) },
          { clipPath: poly(w + s, s, h), onComplete: () => void (sheet.style.clipPath = 'none') },
          0.06,
        ));
    },
  });

  // Masked reveals, one per entry.
  gsap.utils.toArray<HTMLElement>('[data-entry], [data-cert]', section).forEach((el) => {
    gsap.set(el, { clipPath: 'inset(0% 0% 100% 0%)', y: 24 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () =>
        void late.push(
          gsap.to(el, {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            duration: velocityDuration(1.1, scrollState().velocity),
            ease: ease.out,
            clearProps: 'clipPath',
          }),
        ),
    });
  });

  return () => {
    late.forEach((t) => t.kill());
    sheet.style.removeProperty('clip-path');
  };
}
