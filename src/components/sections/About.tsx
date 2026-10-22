'use client';
// About: the page the hero's ink bled onto. Paper ground, ink text.
//   Text         every line rises out of its mask, scrubbed to scroll, and each word inks in
//                (muted -> full ink) as the reading line passes it. The ink is an overlay copy of
//                the word whose opacity is scrubbed, so only opacity / transform ever animate.
//   Boundary 4   "zoom-through": a huge "Work" sits on the paper; on a sticky stage the counter of
//                its "o" fills with desk black and the word scales around that counter until the
//                dark disc covers the viewport, so the visitor falls through the letter into the
//                showreel (which then lands its own frame .56 -> 1).
//   Portrait     a halftone of pen-blue ink dots (HalftonePortrait, lazy OGL) beside the text.
// Reduced motion / no JS / Recruiter Mode: a calm paper section, no sticky stage, no disc.
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { site } from '@/data/site';
import { usePage } from '@/engine/next';
import { ease } from '@/engine';
import { HalftonePortrait } from './HalftonePortrait';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const seg = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));

/* ---------------------------------------------------------------- text */
function initText(root: HTMLElement) {
  const paras = [...root.querySelectorAll<HTMLElement>('[data-ink]')];
  const splits = paras.map((p) => {
    let anims: gsap.core.Animation[] = [];
    const kill = () => {
      anims.forEach((a) => a.scrollTrigger?.kill());
      anims.forEach((a) => a.kill());
      anims = [];
    };
    const split = SplitText.create(p, {
      type: 'lines,words',
      mask: 'lines',
      linesClass: 'split-line',
      wordsClass: 'about-word',
      autoSplit: true,
      onSplit(self) {
        kill();
        // Phones get the line reveal only: per-word ink overlays cost too much scroll smoothness.
        const phone = matchMedia('(max-width: 767px)').matches;
        if (!phone) p.classList.add(styles.inking);
        // Ink overlay per word: same glyphs, full ink, opacity scrubbed 0 -> 1.
        const inks = phone ? [] : self.words.map((w) => {
          const s = document.createElement('span');
          s.className = styles.ink;
          s.setAttribute('aria-hidden', 'true');
          s.textContent = w.textContent;
          w.appendChild(s);
          return s;
        });
        anims.push(
          gsap.fromTo(
            self.lines,
            { yPercent: 110, rotate: 2 },
            {
              yPercent: 0,
              rotate: 0,
              stagger: 0.08,
              ease: 'none',
              scrollTrigger: { trigger: p, start: 'top 92%', end: 'top 50%', scrub: 0.6 },
            },
          ),
          gsap.fromTo(
            inks,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 1,
              stagger: 0.32,
              ease: 'none',
              scrollTrigger: { trigger: p, start: 'top 78%', end: 'bottom 42%', scrub: 0.6 },
            },
          ),
        );
      },
    });
    return () => {
      kill();
      split.revert();
      p.classList.remove(styles.inking);
    };
  });
  return () => splits.forEach((off) => off());
}

/* ---------------------------------------------------------------- zoom-through */
type ZoomEls = { track: HTMLElement; st: HTMLElement; w: HTMLElement; letter: HTMLElement; d: HTMLElement };

function initZoom({ track, st, w, letter, d }: ZoomEls, phone: boolean) {
  const S = phone ? 7 : 9; // final word scale around the counter
  const m = { x: 0, y: 0, r: 0, R: 0 }; // counter centre (stage px), counter radius, cover radius
  const inOut = gsap.parseEase(ease.inOut);
  const out = gsap.parseEase(ease.out);
  const state = { t: 0 };

  // Where the counter of the "o" is. The inline box is the font's content area, so its top +
  // the font ascent is the baseline; canvas metrics give the glyph's own bounds from there.
  function measure() {
    gsap.set(w, { scale: 1 });
    const sr = st.getBoundingClientRect();
    const lr = letter.getBoundingClientRect();
    const wr = w.getBoundingClientRect();
    const cs = getComputedStyle(letter);
    let cx = lr.left + lr.width / 2;
    let cy = lr.top + lr.height * 0.62;
    let half = lr.width * 0.5;
    const ctx = document.createElement('canvas').getContext('2d');
    if (ctx) {
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const g = ctx.measureText('o');
      if (g.fontBoundingBoxAscent && g.actualBoundingBoxAscent) {
        const baseline = lr.top + g.fontBoundingBoxAscent;
        cy = baseline - (g.actualBoundingBoxAscent - g.actualBoundingBoxDescent) / 2;
        cx = lr.left + (g.actualBoundingBoxRight - g.actualBoundingBoxLeft) / 2;
        half = Math.min(g.actualBoundingBoxRight + g.actualBoundingBoxLeft, g.actualBoundingBoxAscent + g.actualBoundingBoxDescent) / 2;
      }
    }
    m.x = cx - sr.left;
    m.y = cy - sr.top;
    m.r = half * 0.48; // inside the stroke of the bowl
    m.R = Math.hypot(Math.max(m.x, sr.width - m.x), Math.max(m.y, sr.height - m.y)) + 4;
    gsap.set(w, { transformOrigin: `${cx - wr.left}px ${cy - wr.top}px` });
    render();
  }

  function render() {
    const t = state.t;
    const fill = out(seg(t, 0, 0.22)); // the counter floods with desk black
    const z = inOut(seg(t, 0.14, 1));
    const s = Math.pow(S, z); // exponential: the fall keeps a constant pace
    const cover = Math.pow(seg(t, 0.5, 0.97), 2.2) * m.R;
    const r = t >= 0.97 ? m.R : Math.max(m.r * s * fill, cover);
    gsap.set(w, { scale: s });
    d.style.clipPath = `circle(${r.toFixed(1)}px at ${m.x.toFixed(1)}px ${m.y.toFixed(1)}px)`;
    d.style.visibility = r > 0.5 ? 'visible' : 'hidden';
  }

  const tw = gsap.to(state, {
    t: 1,
    ease: 'none',
    onUpdate: render,
    scrollTrigger: {
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.7,
      invalidateOnRefresh: true,
      onRefresh: measure, // no will-change: the scaled glyphs must re-raster to stay sharp
    },
  });
  measure();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  return () => {
    tw.scrollTrigger?.kill();
    tw.kill();
    gsap.set(w, { clearProps: 'transform,transformOrigin' });
    d.style.clipPath = '';
    d.style.visibility = '';
  };
}

export function About() {
  const section = useRef<HTMLElement>(null);
  const zoom = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLParagraphElement>(null);
  const o = useRef<HTMLSpanElement>(null);
  const disc = useRef<HTMLDivElement>(null);

  usePage(() => {
    const root = section.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        phone: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      },
      (c) => {
        if (!document.documentElement.classList.contains('motion')) return;
        const phone = !!c.conditions?.phone;
        const offText = initText(root);
        const els = { track: zoom.current, st: stage.current, w: word.current, letter: o.current, d: disc.current };
        const offZoom = Object.values(els).every(Boolean) ? initZoom(els as ZoomEls, phone) : () => {};
        return () => {
          offText();
          offZoom();
        };
      },
    );
    return () => mm.revert();
  });

  const [lead, ...rest] = site.about;

  return (
    <section ref={section} id="about" className={styles.about} aria-labelledby="about-title">
      <div className={styles.text}>
        <h2 id="about-title" className={styles.label} data-drop>
          About
        </h2>
        <p className={styles.meta} data-drop>
          <span>{site.role}</span>
          <span>{site.location}</span>
        </p>
        <p className={styles.lead} data-ink data-drop>
          {lead}
        </p>
        <HalftonePortrait />
        {rest.map((p) => (
          <p key={p.slice(0, 24)} className={styles.body} data-ink data-drop>
            {p}
          </p>
        ))}
      </div>

      {/* Boundary 4: decorative; the showreel carries the real "Selected work" heading. */}
      <div ref={zoom} className={styles.zoom} aria-hidden="true">
        <div ref={stage} className={styles.stage}>
          <div className={styles.wordWrap} data-drop>
            <p ref={word} className={styles.word}>
              W<span ref={o}>o</span>rk
            </p>
          </div>
          <div ref={disc} className={styles.disc} />
        </div>
      </div>
    </section>
  );
}
