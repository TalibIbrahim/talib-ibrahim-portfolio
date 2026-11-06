'use client';
// Split motion: the seam boundary (scrubbed) and the marker tags (DrawSVG, hover / focus-within;
// on touch and phones, once on scroll-in). Reduced motion: nothing runs, the tags stay drawn.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { usePage } from '@/engine/next';
import { ease, isTouch, prefersReducedMotion } from '@/engine';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

export function SplitMotion() {
  usePage(() => {
    const section = document.querySelector<HTMLElement>('[data-layers]');
    if (!section || prefersReducedMotion() || !document.documentElement.classList.contains('motion')) return;
    const body = section.querySelector<HTMLElement>('[data-layers-body]')!;
    const seam = section.querySelector<HTMLElement>('[data-seam]');

    // Boundary: the halves open outwards from the seam as the section arrives.
    gsap.fromTo(
      body,
      { clipPath: 'inset(0% 50% 0% 50%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: ease.wipe,
        scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 20%', scrub: 0.6 },
      },
    );
    if (seam)
      gsap.fromTo(
        seam,
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 95%', end: 'top 45%', scrub: 0.6 } },
      );

    // Tags: fat pass + thin pressure pass per stroke; the thin pass trails a beat behind.
    const phone = matchMedia('(max-width: 767px)').matches;
    const offs: (() => void)[] = [];
    section.querySelectorAll<HTMLElement>('[data-side]').forEach((side) => {
      const key = side.dataset.side!;
      const fat = [...side.querySelectorAll<SVGPathElement>('[data-fat]')];
      const thin = [...side.querySelectorAll<SVGPathElement>('[data-thin]')];
      gsap.set([...fat, ...thin], { drawSVG: '0% 0%', visibility: 'hidden' });
      const tl = gsap.timeline({ paused: true });
      let at = 0;
      fat.forEach((f, i) => {
        const dur = gsap.utils.clamp(0.09, 0.3, f.getTotalLength() / 900);
        tl.set(f, { visibility: 'visible' }, at)
          .to(f, { drawSVG: '0% 100%', duration: dur, ease: 'power2.in' }, at)
          .set(thin[i], { visibility: 'visible' }, at + 0.03)
          .to(thin[i], { drawSVG: '0% 100%', duration: dur, ease: 'power2.in' }, at + 0.03);
        at += dur + 0.045;
      });

      if (isTouch() || phone) {
        // only the side in view is marked: it writes as the side reaches the middle of the screen and
        // wipes off again as it leaves
        ScrollTrigger.create({
          trigger: side,
          start: 'top 55%',
          end: 'bottom 45%',
          onToggle: (self) => (self.isActive ? tl.timeScale(1).play() : tl.timeScale(2.6).reverse()),
        });
        return;
      }
      // hover and keyboard focus run the same state
      const on = () => {
        section.dataset.active = key;
        tl.timeScale(1).play();
      };
      const off = (next?: EventTarget | null) => {
        if (side.matches(':hover') || side.contains((next as Node) ?? document.activeElement)) return;
        if (section.dataset.active === key) delete section.dataset.active;
        tl.timeScale(2.6).reverse();
      };
      const leave = () => off();
      const blur = (e: FocusEvent) => off(e.relatedTarget); // focus may be moving to another link in this half
      side.addEventListener('pointerenter', on);
      side.addEventListener('pointerleave', leave);
      side.addEventListener('focusin', on);
      side.addEventListener('focusout', blur);
      offs.push(() => {
        side.removeEventListener('pointerenter', on);
        side.removeEventListener('pointerleave', leave);
        side.removeEventListener('focusin', on);
        side.removeEventListener('focusout', blur);
      });
    });

    return () => {
      offs.forEach((f) => f());
      delete section.dataset.active;
    };
  });

  return null;
}
