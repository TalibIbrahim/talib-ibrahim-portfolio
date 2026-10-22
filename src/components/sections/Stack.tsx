'use client';
// Stack: a page that turns in, then the site's only horizontal moment.
//   Boundary 6   "rotate": the paper panel turns in from -8deg around its top-left corner as the
//                section enters (scrubbed). Phones: -4deg over a shorter distance.
//   Desktop      the section pins (top top) and the type strip pans left over its own scrollWidth.
//                Each group arrives as it enters the horizontal viewport (containerAnimation), each
//                from its own direction with its own ease: below/out, above/soft, right/inOut, scale/wipe.
// Phones: a native overflow-x scroll-snap row of group cards, no pin.
// Reduced motion / no JS / Recruiter Mode: no rotate, no pin; desktop shows a 2x2 grid of groups.
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
        desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        phone: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      },
      (c) => {
        if (!document.documentElement.classList.contains('motion')) return;
        const phone = !!c.conditions?.phone;

        // Boundary 6: the page turns in around its top-left corner.
        gsap.fromTo(
          panel,
          { rotation: phone ? -4 : -8, transformOrigin: '0% 0%' },
          {
            rotation: 0,
            ease: ease.inOut,
            scrollTrigger: { trigger: root, start: 'top bottom', end: phone ? 'top 55%' : 'top top', scrub: 0.6 },
          },
        );
        if (phone) return;

        root.dataset.pan = '';
        const dist = () => Math.max(0, row.scrollWidth - innerWidth);
        const pan = gsap.to(row, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        if (bar.current) {
          gsap.fromTo(bar.current, { scaleX: 0 }, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${dist()}`, scrub: 0.8, invalidateOnRefresh: true },
          });
        }

        // Arrivals. A group already inside the viewport when the pin starts arrives while the
        // page turns in; the rest arrive as the strip carries them in from the right.
        gsap.utils.toArray<HTMLElement>('[data-group]', row).forEach((g, i) => {
          const a = ARRIVALS[i % ARRIVALS.length];
          const body = g.querySelector<HTMLElement>('[data-arrive]');
          const chips = gsap.utils.toArray<HTMLElement>('[data-chip]', g);
          if (!body) return;
          const visibleAtStart = g.offsetLeft < innerWidth * 0.9;
          const st: ScrollTrigger.Vars = visibleAtStart
            ? { trigger: root, start: 'top 70%', end: 'top top', scrub: 0.6 }
            : { trigger: g, containerAnimation: pan, start: 'left 100%', end: 'left 66%', scrub: 0.6 };
          const tl = gsap.timeline({ scrollTrigger: st });
          tl.from(body, { ...a.from, ease: a.ease, duration: 1 }, 0);
          tl.from(chips, { ...a.chips, autoAlpha: 0, ease: a.ease, duration: 0.6, stagger: 0.4 / Math.max(1, chips.length) }, 0.3);
        });

        return () => {
          delete root.dataset.pan;
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
