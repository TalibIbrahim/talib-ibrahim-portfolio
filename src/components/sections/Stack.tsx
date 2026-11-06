'use client';
// Stack: a page that turns in, then one pinned screen with every group on it.
//   Boundary 8   "rotate": the paper panel turns in from -8deg around its top-left corner as the
//                section enters (scrubbed). Phones: -4deg over a shorter distance.
//   Desktop      (>= 1100px) the section pins (top top) for one screen of scroll. The four groups sit
//                as four columns under the title; each arrives in turn, from its own direction with its
//                own ease (below/out, above/soft, right/inOut, scale/wipe), and the progress rule fills.
//                If the screen is too short for the whole composition it does not pin: the groups
//                arrive as the section scrolls in.
// Tablets: the same columns as a 2x2 grid, rotate only. Phones: a native overflow-x scroll-snap row of
// group cards sized to their content, no pin.
// Reduced motion / no JS / Recruiter Mode: no rotate, no pin; the static columns.
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { site } from '@/data/site';
import { usePage } from '@/engine/next';
import { ease } from '@/engine';
import styles from './Stack.module.css';

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, '0');

// Arrival per group, in order. Groups past the fourth reuse the cycle.
const ARRIVALS: { from: gsap.TweenVars; ease: string; chips: gsap.TweenVars }[] = [
  { from: { y: () => innerHeight * 0.32, autoAlpha: 0 }, ease: ease.out, chips: { yPercent: 120 } },
  { from: { y: () => -innerHeight * 0.32, autoAlpha: 0 }, ease: ease.soft, chips: { yPercent: -120 } },
  { from: { x: () => innerWidth * 0.36, autoAlpha: 0 }, ease: ease.inOut, chips: { xPercent: 60 } },
  { from: { scale: 0.8, autoAlpha: 0 }, ease: ease.wipe, chips: { scale: 0.6 } },
];

export function Stack() {
  const section = useRef<HTMLElement>(null);
  const turn = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const groups = site.stack;
  const n = groups.length;

  usePage(() => {
    const root = section.current;
    const panel = turn.current;
    const row = strip.current;
    if (!root || !panel || !row) return;
    const mm = gsap.matchMedia();
    mm.add(
      {
        wide: '(min-width: 1100px) and (prefers-reduced-motion: no-preference)',
        narrow: '(max-width: 1099px) and (prefers-reduced-motion: no-preference)',
      },
      (c) => {
        if (!document.documentElement.classList.contains('motion')) return;
        const phone = matchMedia('(max-width: 767px)').matches;

        // Boundary 8: the page turns in around its top-left corner.
        gsap.fromTo(
          panel,
          { rotation: phone ? -4 : -8, transformOrigin: '0% 0%' },
          {
            rotation: 0,
            ease: ease.inOut,
            scrollTrigger: { trigger: root, start: 'top bottom', end: phone ? 'top 55%' : 'top top', scrub: 0.6 },
          },
        );
        if (!c.conditions?.wide) return;

        // One screen of pin, only when the whole composition fits the viewport.
        const fits = row.offsetHeight <= innerHeight;
        if (fits) root.dataset.pin = '';
        const tl = gsap.timeline({
          defaults: { duration: 1 },
          scrollTrigger: fits
            ? { trigger: root, start: 'top top', end: '+=100%', pin: true, scrub: 0.6, invalidateOnRefresh: true }
            : { trigger: row, start: 'top 75%', end: 'bottom 85%', scrub: 0.6, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>('[data-group]', row).forEach((g, i) => {
          const a = ARRIVALS[i % ARRIVALS.length];
          const body = g.querySelector<HTMLElement>('[data-arrive]');
          const chips = gsap.utils.toArray<HTMLElement>('[data-chip]', g);
          if (!body) return;
          const at = i * 0.35;
          tl.from(body, { ...a.from, ease: a.ease }, at);
          tl.from(chips, { ...a.chips, autoAlpha: 0, ease: a.ease, duration: 0.6, stagger: 0.4 / Math.max(1, chips.length) }, at + 0.3);
        });
        tl.to({}, { duration: 0.25 }); // a short hold with everything in place before the pin lets go
        if (bar.current) tl.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: tl.duration() }, 0);

        return () => {
          delete root.dataset.pin;
        };
      },
    );
    return () => mm.revert();
  });

  return (
    <section ref={section} id="stack" className={styles.section} aria-labelledby="stack-title">
      <div ref={turn} className={styles.turn}>
        <div ref={strip} className={styles.strip}>
          <div className={styles.intro} data-drop>
            <h2 id="stack-title" className={styles.title}>
              Stack
            </h2>
            <p className={styles.count}>
              {pad(n)} groups / {pad(groups.reduce((s, g) => s + g.items.length, 0))} tools
            </p>
          </div>
          <ol className={styles.groups} aria-label="Stack groups" tabIndex={0}>
            {groups.map((g, i) => (
              <li key={g.name} className={styles.group} data-group data-drop>
                <div className={styles.arrive} data-arrive>
                  <p className={styles.index} aria-hidden="true">
                    {pad(i + 1)} / {pad(n)}
                  </p>
                  <h3 className={styles.name}>{g.name}</h3>
                  <ul className={styles.chips}>
                    {g.items.map((item) => (
                      <li key={item} className={styles.chip} data-chip>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.progress} aria-hidden="true">
          <span ref={bar} className={styles.bar} />
        </div>
      </div>
    </section>
  );
}
