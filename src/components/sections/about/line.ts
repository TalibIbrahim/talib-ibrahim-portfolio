// The pen line, part one (desktop). One blue stroke that starts as a commit node beside the tagline
// and runs down About's left margin (half a gutter in) to the section's bottom edge, where the Work
// stage's git-graph line picks it up at the same x (showreel/ShowreelMotion.tsx: its lead segment
// comes down from the stage's top edge and turns into project 01's node). Read as one line.
//   motion   DrawSVG scrubbed (no lag): the pen's head sits on the 72% line of the viewport, so it
//            hands over to the Work segment, which keeps its head on the same line.
//   static   reduced motion: the line is simply there, fully drawn.
// Geometry is measured on every ScrollTrigger refresh (no per-frame layout reads).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

/** The pen's head, as a share of the viewport height. ShowreelMotion uses the same value. */
export const PEN_HEAD = 0.72;

export function initLine(root: HTMLElement, animate: boolean) {
  const svg = root.querySelector<SVGSVGElement>('[data-pen]');
  const path = svg?.querySelector<SVGPathElement>('path');
  const node = svg?.querySelector<SVGCircleElement>('circle');
  const text = root.querySelector<HTMLElement>('[data-text]');
  const headline = root.querySelector<HTMLElement>('[data-headline]');
  if (!svg || !path || !node || !text || !headline) return;

  const build = () => {
    const x = (parseFloat(getComputedStyle(text).paddingLeft) || 0) / 2;
    const fs = parseFloat(getComputedStyle(headline).fontSize) || 48;
    const y0 = headline.offsetTop + fs * 0.45; // level with the tagline's first line
    const y1 = root.offsetHeight;
    path.setAttribute('d', `M ${x.toFixed(1)} ${y0.toFixed(1)} V ${y1}`);
    node.setAttribute('cx', x.toFixed(1));
    node.setAttribute('cy', y0.toFixed(1));
  };
  build();
  svg.dataset.on = '';
  ScrollTrigger.addEventListener('refreshInit', build);
  const off = () => {
    ScrollTrigger.removeEventListener('refreshInit', build);
    delete svg.dataset.on;
    path.setAttribute('d', '');
  };
  if (!animate) return off;

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: path,
      start: `top ${PEN_HEAD * 100}%`,
      end: `bottom ${PEN_HEAD * 100}%`,
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  tl.fromTo(node, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.03 }, 0).fromTo(
    path,
    { drawSVG: '0% 0%' },
    { drawSVG: '0% 100%', duration: 1 },
    0,
  );

  return () => {
    tl.scrollTrigger?.kill();
    tl.revert();
    off();
  };
}
