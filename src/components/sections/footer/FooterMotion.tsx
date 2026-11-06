'use client';
// Footer motion. Renders nothing; wires the server-rendered [data-footer] on every page load.
//
// Boundary 12, frame lock (scrubbed, no lag, while the footer's top travels from the viewport bottom
// to the top; phones to 30%):
//   [data-panel]     scale 1.08 -> 1 (ease.inOut), from its centre. The desk arrives full bleed (the
//                    frame and its tabs are pushed past the clip), then the blue closes in and the
//                    tabs cut into it as it locks: the bookend of the landing's card growing to full bleed.
//   [data-portrait]  yPercent 12 -> 0 (desktop only), rising into the frame a little slower than the page.
// Then once, as the footer passes 25% (phones 60%): the closing lines rise out of their masks
// (ease.out, 1.1 s, 90 ms apart) and the signature writes over them stroke by stroke, each with its
// nib pass (DrawSVG, the hero's order and rhythm at 0.65x), then the two tittles.
// Reduced motion / no JS / Recruiter Mode: nothing runs; the frame is locked and the signature drawn.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ease } from '@/engine';
import { usePage } from '@/engine/next';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const DUR = [1.05, 1.05, 0.7]; // talib, ibrahim, flourish

export function FooterMotion() {
  usePage(() => {
    const root = document.querySelector<HTMLElement>('[data-footer]');
    const panel = root?.querySelector<HTMLElement>('[data-panel]');
    if (!root || !panel) return;
    const portrait = root.querySelector<HTMLElement>('[data-portrait]');
    const lines = gsap.utils.toArray<HTMLElement>('[data-rise]', root);
    const strokes = gsap.utils.toArray<SVGPathElement>('[data-stroke]', root);
    const nibs = gsap.utils.toArray<SVGPathElement>('[data-nib]', root);
    const dots = gsap.utils.toArray<SVGCircleElement>('[data-dot]', root);

    const mm = gsap.matchMedia();
    mm.add(
      {
        desk: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        phone: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      },
      (c) => {
        if (!document.documentElement.classList.contains('motion')) return;
        const desk = !!c.conditions?.desk;

        // 1. the frame locks
        const lock = gsap.timeline({
          defaults: { duration: 1, ease: 'none' },
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: desk ? 'top top' : 'top 30%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        lock.fromTo(panel, { scale: desk ? 1.08 : 1.05 }, { scale: 1, ease: ease.inOut, transformOrigin: '50% 50%' }, 0);
        if (desk && portrait) lock.fromTo(portrait, { yPercent: 12 }, { yPercent: 0 }, 0);

        // 2. the name prints, then he signs over it
        gsap.set(lines, { yPercent: 110 });
        gsap.set([...strokes, ...nibs], { drawSVG: '0% 0%', visibility: 'hidden' });
        gsap.set(dots, { scale: 0, transformOrigin: '50% 50%' });
        const sign = gsap.timeline({ paused: true });
        sign.to(lines, { yPercent: 0, duration: 1.1, ease: ease.out, stagger: 0.09 }, 0);
        let t = 0.45;
        strokes.forEach((p, i) => {
          const pair = [p, nibs[i]].filter(Boolean);
          const d = DUR[i] ?? 0.8;
          sign.set(pair, { visibility: 'visible' }, t).to(pair, { drawSVG: '0% 100%', duration: d, ease: 'power1.inOut' }, t);
          t += d + 0.05;
        });
        dots.forEach((dot, i) => sign.to(dot, { scale: 1, duration: 0.25, ease: 'back.out(3)' }, t + i * 0.14));

        ScrollTrigger.create({
          trigger: root,
          start: desk ? 'top 25%' : 'top 60%',
          once: true,
          onEnter: () => {
            sign.play();
          },
        });
      },
    );
    return () => mm.revert();
  });
  return null;
}
