'use client';
// Signature: the second beat. The landing collapses into an ink dot; this stage takes over on that
// exact dot (its sticky stage sits under the landing's last screen), the camera grazes the nib of
// a 3D ink pipe, pulls back as the signature writes itself, the i's get dotted, a statement
// arrives, then the ink bleeds into paper for About.
// No WebGL: a flat SVG signature (drawn at 1×, so it stays sharp) + a CSS paper wipe.
// Reduced motion: the finished signature and the statement, no sticky stage.
import { useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { site } from '@/data/site';
import { usePage } from '@/engine/next';
import { ease, isMobile, isTouch, prefersReducedMotion } from '@/engine';
import { DOTS, NIB_OFFSETS, SIGNATURE_VIEWBOX, STROKES } from './signature-paths';
import styles from './Signature.module.css';

const seg = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const shotEase = gsap.parseEase('power1.inOut');

export function Signature() {
  const section = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const statement = useRef<HTMLParagraphElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  usePage(() => {
    if (prefersReducedMotion() || !section.current || !svg.current) return;
    const mobile = isMobile();
    const root = svg.current;
    const st = { p: 0, look: [0, 0] as [number, number], visible: false, time: 0 };
    let scene: import('./signature-scene').SignatureScene | null = null;
    let disposed = false;
    let lastCount = '';

    // Flat fallback strokes (also the source geometry for the 3D pipe).
    const groups = STROKES.map((s) => [...root.querySelectorAll<SVGPathElement>(`[data-stroke="${s.id}"]`)]);
    const base = groups.map((g) => g.find((el) => el.dataset.base === '1')!);
    const len = base.map((el) => el.getTotalLength());
    const total = len.reduce((a, b) => a + b, 0);
    const dotEls = [...root.querySelectorAll<SVGCircleElement>('[data-dot]')];

    const split = SplitText.create(statement.current!, { type: 'lines', mask: 'lines' });
    const statementTl = gsap.timeline({ paused: true }).from(split.lines, { yPercent: 110, duration: 1, stagger: 0.08, ease: ease.out });
    gsap.set(statement.current, { visibility: 'visible' });

    function frame() {
      const { p } = st;
      const draw = 0.003 + 0.997 * seg(p, 0.05, 0.5);
      const dots = seg(p, 0.5, 0.57);
      // One tracking shot over the writing, eased once (sine: gentle start and landing).
      const shot = shotEase(seg(p, 0.02, 0.52)); // paced to the writing so the nib stays in frame
      const bleed = seg(p, 0.72, 0.97);
      statementTl.progress(seg(p, 0.56, 0.68));
      const c = String(Math.round(seg(p, 0.02, 0.5) * 100)).padStart(3, '0');
      if (count.current && c !== lastCount) count.current.textContent = lastCount = c;

      if (scene) {
        scene.render({
          draw,
          dots,
          shot,
          look: st.look,
          glint: draw >= 1 ? (st.time / 38) % 1 : null,
          bleed,
          time: st.time,
        });
      } else {
        // Flat fallback: draw by length at 1×, paper wipe for the bleed.
        let l = draw * total;
        groups.forEach((g, i) => {
          const f = Math.min(1, Math.max(0, l / len[i]));
          l -= len[i];
          for (const el of g) el.style.strokeDashoffset = String(1 - f);
        });
        dotEls.forEach((d, i) => d.style.setProperty('r', String(3.4 * seg(dots, i * 0.4, i * 0.4 + 0.6))));
        if (paper.current) {
          paper.current.style.visibility = bleed > 0 ? 'visible' : 'hidden';
          paper.current.style.clipPath = `circle(${(bleed * 150).toFixed(2)}% at 50% 40%)`;
        }
      }
    }

    gsap.to(st, {
      p: 1,
      ease: 'none',
      onUpdate: frame,
      scrollTrigger: {
        trigger: section.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.9,
        invalidateOnRefresh: true,
        onRefresh: frame,
      },
    });
    const vis = gsap.to({}, {
      scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'bottom top', onToggle: (s) => (st.visible = s.isActive) },
    });

    // Build the 3D pipe a beat after load (keeps the landing's first paint and LCP clean).
    // After the page transition has drained (0.8 s), so building the pipe never stutters it.
    const boot = gsap.delayedCall(1.3, async () => {
      const mod = await import('./signature-scene').catch(() => null);
      if (disposed || !mod || !mod.webglOK() || !host.current) return;
      const strokes = STROKES.map((st) => mod.samplePathD(st.d, 1.2));
      const css = getComputedStyle(document.documentElement);
      scene = mod.createSignatureScene(host.current, strokes, DOTS.map(([x, y]) => ({ x, y })), {
        mobile,
        ink: css.getPropertyValue('--c-accent').trim() || '#4d6bff',
        paper: css.getPropertyValue('--c-fg').trim() || '#ece8df',
        onLost: () => {
          scene?.destroy();
          scene = null;
          section.current?.classList.remove(styles.gl);
          frame();
        },
      });
      if (scene) section.current?.classList.add(styles.gl);
      frame();
    });
    const onResize = () => scene?.resize();
    addEventListener('resize', onResize);

    // One clock: render while on screen (keeps the idle glint and the fibres alive).
    // Scroll drives frames through the ScrollTrigger above. The ticker only redraws for things
    // that move on their own: the idle glint and the bleed's fibres, once the writing is done.
    const tick = (t: number) => {
      st.time = t;
      if (st.visible && scene && st.p > 0.5) frame();
    };
    gsap.ticker.add(tick);

    let offPointer = () => {};
    if (!isTouch()) {
      const look = { x: 0, y: 0 };
      const lx = gsap.quickTo(look, 'x', { duration: 1.2, ease: ease.soft, onUpdate: () => (st.look = [look.x, look.y]) });
      const ly = gsap.quickTo(look, 'y', { duration: 1.2, ease: ease.soft });
      const move = (e: PointerEvent) => {
        if (!st.visible) return;
        lx(e.clientX / innerWidth - 0.5);
        ly(e.clientY / innerHeight - 0.5);
      };
      addEventListener('pointermove', move, { passive: true });
      offPointer = () => removeEventListener('pointermove', move);
    }
    frame();

    return () => {
      disposed = true;
      boot.kill();
      vis.kill();
      gsap.ticker.remove(tick);
      removeEventListener('resize', onResize);
      offPointer();
      scene?.destroy();
      scene = null;
      split.revert();
      section.current?.classList.remove(styles.gl);
      for (const g of groups) for (const el of g) el.style.strokeDashoffset = '';
      dotEls.forEach((d) => d.style.removeProperty('r'));
      if (paper.current) {
        paper.current.style.clipPath = '';
        paper.current.style.visibility = '';
      }
    };
  });

  return (
    <section ref={section} id="signature" className={styles.section} aria-labelledby="signature-title">
      <h2 id="signature-title" className="sr-only">Signature</h2>
      <div className={styles.stage}>
        <div ref={paper} className={styles.paper} aria-hidden="true" />
        <div ref={host} className={styles.host} aria-hidden="true" />
        <div className={styles.flat} data-drop>
          <svg
            ref={svg}
            className={styles.sig}
            viewBox={`0 0 ${SIGNATURE_VIEWBOX.w} ${SIGNATURE_VIEWBOX.h}`}
            role="img"
            aria-label={`Handwritten signature: ${site.shortName}`}
          >
            <g className={styles.nib}>
              {NIB_OFFSETS.map(([dx, dy], i) => (
                <g key={i} transform={`translate(${dx} ${dy})`}>
                  {STROKES.map((s) => (
                    <path
                      key={s.id}
                      d={s.d}
                      data-stroke={s.id}
                      data-base={dx === 0 ? '1' : undefined}
                      pathLength={1}
                      className={styles.stroke}
                    />
                  ))}
                </g>
              ))}
            </g>
            {DOTS.map(([x, y]) => (
              <circle key={x} data-dot cx={x} cy={y} r="3.4" className={styles.dot} />
            ))}
          </svg>
        </div>

        <div className={styles.copy} data-drop>
          <p ref={statement} className={styles.statement}>
            {site.tagline}
          </p>
          <p className={styles.counter} aria-hidden="true">
            Signing <span ref={count} className={styles.count}>000</span>
          </p>
        </div>
      </div>
    </section>
  );
}
