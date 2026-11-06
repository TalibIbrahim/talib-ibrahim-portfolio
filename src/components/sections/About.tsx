'use client';
// About: the paper the signed hero card grew into. Paper ground, ink text.
//   Text         the tagline headline (Fraunces accents) prints under blue blocks; the lead and body
//                lines rise out of their masks and their key words resolve as each line arrives
//                (about/text.ts; phrases from site.aboutFx via about/fx.tsx).
//   Boundary 4   About ends on its paper; the Work section's stage starts on the same paper and
//                its bent card pulls the page into ink (showreel/ShowreelMotion.tsx).
//   Globe        an ink-dot globe facing Lahore with its local time (AboutGlobe, lazy OGL) beside the text.
//   Pen line     desktop: one blue line from a commit node beside the tagline down the left margin into
//                the Work stage's git graph, drawn by scroll (about/line.ts); fully drawn under reduced motion.
// Reduced motion / no JS / Recruiter Mode: a calm paper section.
import { useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { site } from '@/data/site';
import { usePage } from '@/engine/next';
import { AboutGlobe } from './AboutGlobe';
import { withFx } from './about/fx';
import { initText } from './about/text';
import { initLine } from './about/line';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

/** The tagline with its accent words (from data) set in Fraunces italic. */
function accented(text: string, words: string[]) {
  const hits = words
    .map((w) => ({ w, at: text.indexOf(w) }))
    .filter((h) => h.at >= 0)
    .sort((a, b) => a.at - b.at);
  const out: ReactNode[] = [];
  let i = 0;
  for (const { w, at } of hits) {
    if (at < i) continue;
    out.push(text.slice(i, at), <span key={at} className={styles.serif}>{w}</span>);
    i = at + w.length;
  }
  out.push(text.slice(i));
  return out;
}

export function About() {
  const section = useRef<HTMLElement>(null);

  usePage(() => {
    const root = section.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        phone: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      },
      () => {
        if (!document.documentElement.classList.contains('motion')) return;
        return initText(root, styles);
      },
    );
    // the pen line: desktop only; static (fully drawn) under reduced motion
    mm.add('(min-width: 768px)', () => {
      const motion =
        document.documentElement.classList.contains('motion') && !matchMedia('(prefers-reduced-motion: reduce)').matches;
      return initLine(root, motion);
    });
    return () => mm.revert();
  });

  const [lead, ...rest] = site.about;

  return (
    <section ref={section} id="about" className={styles.about} aria-labelledby="about-title">
      <span className={styles.pen} aria-hidden="true" data-pen>
        <span className={styles.penLine} data-pen-line />
        <span className={styles.penNode} data-pen-node />
      </span>
      <div className={styles.text} data-text>
        <h2 id="about-title" className={styles.label} data-drop>
          About
        </h2>
        <p className={styles.meta} data-drop>
          <span>{site.role}</span>
          <span>{site.location}</span>
        </p>
        <p className={styles.headline} data-headline data-drop>
          {accented(site.tagline, site.taglineAccents)}
        </p>
        <p className={styles.lead} data-lead data-drop>
          {withFx(lead)}
        </p>
        <AboutGlobe />
        {rest.map((p) => (
          <p key={p.slice(0, 24)} className={styles.body} data-body data-drop>
            {withFx(p)}
          </p>
        ))}
      </div>
    </section>
  );
}
