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
// Sign-off (desktop and phones): when the footer signature enters (top 85%), the owner signs the
// page once: each stroke's nib-offset copies draw together (stroke-dashoffset, pathLength 1), the
// strokes in writing order at a constant pen speed, a pen-blue nib dot rides the tip (transform),
// then the i's are dotted (scale, ease.soft) and the nib lifts away.
// Reduced motion / no JS / Recruiter Mode: nothing runs; the section is plain flow and the
// signature is fully drawn.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease } from '@/engine';
import { STROKES } from '../signature-paths';
import { usePage } from '@/engine/next';

gsap.registerPlugin(ScrollTrigger);

export function ContactMotion() {
  usePage(() => {
    const section = document.getElementById('contact');
    const under = section?.querySelector<HTMLElement>('[data-under]');
    const dim = section?.querySelector<HTMLElement>('[data-dim]');
    if (!section || !under || !dim) return;
    const chars = gsap.utils.toArray<HTMLElement>('[data-char]', section);
    const sign = section.querySelector<SVGSVGElement>('[data-sign]');

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

        if (sign) signOff(section, under, sign);
      },
    );
    return () => mm.revert();
  });
  return null;
}

const SIGN_SECONDS = 2.8; // the whole signature, at a constant pen speed
const HIDDEN = 1.03; // dashoffset that hides a stroke, caps included

function signOff(section: HTMLElement, under: HTMLElement, sign: SVGSVGElement) {
  const groups = STROKES.map((s) => [...sign.querySelectorAll<SVGPathElement>(`[data-stroke="${s.id}"]`)]);
  const base = groups.map((g) => g.find((el) => el.dataset.base === '1'));
  const nib = sign.querySelector<SVGCircleElement>('[data-nib]');
  const dots = sign.querySelectorAll<SVGCircleElement>('[data-dot]');
  if (!nib || base.some((b) => !b)) return;
  const lens = base.map((b) => b!.getTotalLength());
  const total = lens.reduce((a, b) => a + b, 0) || 1;

  // Dash 1, gap 2 and a start just past 1: no round cap peeks out at either end before the pen
  // gets there (pathLength is 1).
  gsap.set(groups.flat(), { strokeDasharray: '1 2', strokeDashoffset: HIDDEN });
  gsap.set(dots, { scale: 0, transformOrigin: '50% 50%' });
  const start = base[0]!.getPointAtLength(0);
  gsap.set(nib, { x: start.x, y: start.y, opacity: 0, scale: 0.4, transformOrigin: '50% 50%' });

  const tl = gsap.timeline({ paused: true });
  tl.to(nib, { opacity: 1, scale: 1, duration: 0.3, ease: ease.soft });
  groups.forEach((g, i) => {
    const path = base[i]!;
    const len = lens[i];
    const pen = { p: 0 };
    tl.to(
      pen,
      {
        p: 1,
        duration: (SIGN_SECONDS * len) / total,
        ease: 'none',
        onUpdate: () => {
          gsap.set(g, { strokeDashoffset: HIDDEN * (1 - pen.p) });
          const pt = path.getPointAtLength(pen.p * len);
          gsap.set(nib, { x: pt.x, y: pt.y });
        },
      },
      i ? '+=0.14' : '>-0.1',
    );
  });
  tl.to(dots, { scale: 1, duration: 0.45, stagger: 0.14, ease: ease.soft }, '+=0.08').to(
    nib,
    { opacity: 0, scale: 0.4, duration: 0.5, ease: ease.soft },
    '<',
  );

  // [data-under] is transformed by the boundary scrub, so measuring the signature itself would be
  // off by up to a screen. Measure its untransformed distance from the section bottom instead and
  // start when the signature's top reaches 85% of the viewport.
  const fromBottom = () => {
    let top = 0;
    for (let el = sign.parentElement; el && el !== under; el = el.offsetParent as HTMLElement | null) top += el.offsetTop;
    const label = sign.previousElementSibling as HTMLElement | null;
    return under.offsetHeight - top - (label ? label.offsetHeight : 0);
  };
  ScrollTrigger.create({
    trigger: section,
    start: () => `bottom ${Math.round(innerHeight * 0.85 + fromBottom())}px`,
    once: true,
    invalidateOnRefresh: true,
    onEnter: () => tl.play(),
  });
}
