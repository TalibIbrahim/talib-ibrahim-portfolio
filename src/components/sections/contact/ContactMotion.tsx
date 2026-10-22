'use client';
// Contact motion. Renders nothing; wires the server-rendered #contact section on every page load.
//
// Boundary 10, reveal from underneath. Desktop, scrubbed (no smoothing, so the hold is exact)
// while the section top travels from the viewport bottom to the top, i.e. while the Timeline
// sheet (z-index above) slides off:
//   [data-under]  y -100vh -> 0 (linear: cancels the scroll, the layer stays put under the sheet)
//                 scale .92 -> 1 (ease.soft), from the top edge
//   [data-dim]    opacity .78 -> 0 (ease.soft): the desk un-dims as it is uncovered
//   "Email me"    per-character masked rise, scrubbed (scrub .6) from section top 75% -> 10%
// Phones: no hold (touch scroll is native, a counter-transform would jitter); the layer scales
// .96 -> 1 and un-dims as it enters, the headline chars rise over 85% -> 35%.
// Reduced motion / no JS / Recruiter Mode: nothing runs; the section is plain flow.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease } from '@/engine';
import { usePage } from '@/engine/next';

gsap.registerPlugin(ScrollTrigger);

export function ContactMotion() {
  usePage(() => {
    const section = document.getElementById('contact');
    const under = section?.querySelector<HTMLElement>('[data-under]');
    const dim = section?.querySelector<HTMLElement>('[data-dim]');
    if (!section || !under || !dim) return;
    const chars = gsap.utils.toArray<HTMLElement>('[data-char]', section);

    const mm = gsap.matchMedia();
    mm.add(
      {
        desk: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        phone: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      },
      (c) => {
        if (!document.documentElement.classList.contains('motion')) return;
        const desk = !!c.conditions?.desk;

        gsap.set(under, { transformOrigin: '50% 0%' });
        const tl = gsap.timeline({
          defaults: { duration: 1 },
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: desk ? 'top top' : 'top 40%',
            scrub: desk ? true : 0.5,
            invalidateOnRefresh: true,
          },
        });
        if (desk) tl.fromTo(under, { y: () => -innerHeight }, { y: 0, ease: 'none' }, 0);
        tl.fromTo(under, { scale: desk ? 0.92 : 0.96 }, { scale: 1, ease: ease.soft }, 0).fromTo(
          dim,
          { opacity: desk ? 0.78 : 0.6 },
          { opacity: 0, ease: ease.soft },
          0,
        );

        if (chars.length) {
          gsap.fromTo(
            chars,
            { yPercent: 118 },
            {
              yPercent: 0,
              ease: 'none',
              stagger: 0.08,
              scrollTrigger: {
                trigger: section,
                start: desk ? 'top 75%' : 'top 85%',
                end: desk ? 'top 10%' : 'top 35%',
                scrub: 0.6,
              },
            },
          );
        }
      },
    );
    return () => mm.revert();
  });
  return null;
}
