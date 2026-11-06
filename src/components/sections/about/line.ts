// The pen line, part two (desktop; part one is the hero's commit graph, hero/git.ts, whose line runs off
// the hero stage's bottom edge at this x). One blue stroke from About's top edge, through a commit node
// beside the tagline, down About's left margin (half a gutter in) to the section's bottom edge, where the Work
// stage's git-graph line picks it up at the same x (showreel/ShowreelMotion.tsx: its lead segment
// comes down from the stage's top edge and turns into project 01's node). Read as one line.
//   motion   scrubbed (no lag): the head leaves the top edge as the paper comes in under the hero's line
//            and reaches the 72% line of the viewport by the section's end, so it hands over to the Work
//            segment, which keeps its head on the same line. The line is straight, so it draws
//            with scaleY (a transform: no repaint per frame).
//   static   reduced motion: the line is simply there, fully drawn.
// Geometry is measured on every ScrollTrigger refresh (no per-frame layout reads).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** The pen's head, as a share of the viewport height. ShowreelMotion uses the same value. */
export const PEN_HEAD = 0.72;

export function initLine(root: HTMLElement, animate: boolean) {
  const pen = root.querySelector<HTMLElement>('[data-pen]');
  const line = pen?.querySelector<HTMLElement>('[data-pen-line]');
  const node = pen?.querySelector<HTMLElement>('[data-pen-node]');
  const text = root.querySelector<HTMLElement>('[data-text]');
  const headline = root.querySelector<HTMLElement>('[data-headline]');
  if (!pen || !line || !node || !text || !headline) return;

  let nodeAt = 0; // where the node sits along the line (0..1), for the timeline
  const build = () => {
    const x = (parseFloat(getComputedStyle(text).paddingLeft) || 0) / 2;
    const fs = parseFloat(getComputedStyle(headline).fontSize) || 48;
    const y0 = headline.offsetTop + fs * 0.45; // the node: level with the tagline's first line
    const y1 = root.offsetHeight;
    Object.assign(line.style, { left: `${x}px`, top: '0px', height: `${y1}px` });
    Object.assign(node.style, { left: `${x}px`, top: `${y0}px` });
    nodeAt = y1 ? y0 / y1 : 0;
  };
  build();
  pen.dataset.on = '';
  ScrollTrigger.addEventListener('refreshInit', build);
  const off = () => {
    ScrollTrigger.removeEventListener('refreshInit', build);
    delete pen.dataset.on;
    line.removeAttribute('style');
    node.removeAttribute('style');
  };
  if (!animate) return off;

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: line,
      start: 'top bottom',
      end: `bottom ${PEN_HEAD * 100}%`,
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0).fromTo(node, { scale: 0 }, { scale: 1, duration: 0.03 }, nodeAt);

  return () => {
    tl.scrollTrigger?.kill();
    tl.revert();
    off();
  };
}
