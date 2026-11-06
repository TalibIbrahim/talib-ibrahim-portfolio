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
// Ground: polka dots (footer/dots.ts) on the GSAP ticker at 20 fps, only while the footer is in view
// and the visitor scrolls or moves the pointer; the drift eases to rest ~2.5 s after the last input.
// Phones and reduced motion: drawn once (redrawn on resize).
// Reduced motion / no JS / Recruiter Mode: nothing else runs; the frame is locked and the signature drawn.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ease, scrollState } from '@/engine';
import { usePage } from '@/engine/next';
import { makeDots } from './dots';

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

    const canvas = root.querySelector<HTMLCanvasElement>('[data-bg]');
    const ground = canvas ? makeDots(canvas) : null;

    const mm = gsap.matchMedia();
    // the ground: still (drawn once) on phones and under reduced motion
    mm.add('(max-width: 767px), (prefers-reduced-motion: reduce)', () => {
      if (!ground) return;
      ground.draw();
      const redraw = () => {
        ground.size();
        ground.draw();
      };
      ScrollTrigger.addEventListener('refresh', redraw);
      return () => ScrollTrigger.removeEventListener('refresh', redraw);
    });
    // desktop + motion: it drifts and breathes while the footer is in view and the visitor moves
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      if (!ground || !document.documentElement.classList.contains('motion')) {
        ground?.draw();
        return;
      }
      const view = ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'bottom top' });
      const redraw = () => {
        ground.size();
        ground.draw();
      };
      ScrollTrigger.addEventListener('refresh', redraw);
      let last = 0;
      let act = 0;
      let acc = 0;
      let frame = 0;
      const poke = () => {
        last = performance.now();
      };
      addEventListener('pointermove', poke, { passive: true });
      const tick = (_t: number, dt: number) => {
        if (!view.isActive) return;
        if (Math.abs(scrollState().velocity) > 0.5) poke();
        const target = performance.now() - last < 2500 ? 1 : 0;
        act += (target - act) * Math.min(1, dt / 600);
        acc += dt;
        if (Math.abs(scrollState().velocity) > 4) {
          acc = 0; // fast scroll: skip the ground, it catches up when the page slows
          return;
        }
        if (frame++ % 3) return; // 20 fps
        if (act < 0.01) {
          acc = 0;
          return; // at rest: nothing to redraw
        }
        ground.state.t += acc * 0.0006 * act;
        acc = 0;
        ground.draw();
      };
      gsap.ticker.add(tick);
      ground.draw();
      return () => {
        gsap.ticker.remove(tick);
        removeEventListener('pointermove', poke);
        ScrollTrigger.removeEventListener('refresh', redraw);
        view.kill();
      };
    });

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
        gsap.set(panel, { transformOrigin: '50% 50%' }); // from the centre, so the frame closes in evenly on all sides
        lock.fromTo(panel, { scale: desk ? 1.08 : 1.05 }, { scale: 1, ease: ease.inOut }, 0);
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
