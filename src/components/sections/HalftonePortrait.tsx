'use client';
// About's halftone ink portrait. The <img> is the real content (alt, SEO, no-JS, reduced motion,
// no WebGL, context lost): it is styled as a screen print on the paper. When the section
// approaches, OGL loads lazily and a canvas of pen-blue dots takes over the same frame:
//   pointer   dots near the cursor are pushed aside and spring back (eased on gsap.ticker)
//   touch     a tap or a sideways drag pushes the dots; vertical drags still scroll the page (pan-y)
//   idle      a slow breath of the dot scale, rendered only while the frame is on screen
//   scroll    dots grow a touch as the frame passes the middle of the viewport
import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { site } from '@/data/site';
import { usePage } from '@/engine/next';
import { ease } from '@/engine';
import type { HalftoneScene } from './halftone-scene';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

const PHOTO = { src: '/headshot-no-bg.png', width: 476, height: 820 };
const PAD = 0.08; // canvas overhang per side, as a fraction of the frame, so pushed dots are not clipped

export function HalftonePortrait() {
  const frame = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);

  usePage(() => {
    const el = frame.current;
    const gl = host.current;
    if (!el || !gl) return;
    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        phone: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      },
      (c) => {
        if (!document.documentElement.classList.contains('motion')) return;
        return initHalftone(el, gl, !!c.conditions?.phone);
      },
    );
    return () => mm.revert();
  });

  return (
    <figure ref={frame} className={styles.portrait} data-drop>
      <Image
        src={PHOTO.src}
        alt={`Portrait of ${site.name}`}
        width={PHOTO.width}
        height={PHOTO.height}
        sizes="(max-width: 767px) 70vw, 34vw"
        className={styles.print}
      />
      <div ref={host} className={styles.dots} />
    </figure>
  );
}

function initHalftone(el: HTMLElement, gl: HTMLDivElement, phone: boolean) {
  let scene: HalftoneScene | null = null;
  let disposed = false;
  let loading = false;
  const st = {
    visible: false,
    scroll: 0.5,
    reveal: { v: 0 },
    // target and eased pointer (canvas css px, bottom-left origin) and strength
    tx: -1e4, ty: -1e4, x: -1e4, y: -1e4,
    tp: 0, p: 0, pv: 0,
  };
  let revealTw: gsap.core.Tween | null = null;

  const img = el.querySelector('img');

  const ready = () => {
    el.classList.add(styles.gl);
    gsap.fromTo(gl, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: ease.soft });
    revealTw = gsap.to(st.reveal, { v: 1, duration: 2.2, ease: ease.out, paused: true });
    if (st.visible) revealTw.play();
  };

  const fallback = () => {
    scene?.destroy();
    scene = null;
    el.classList.remove(styles.gl);
    gsap.set(gl, { clearProps: 'opacity' });
  };

  async function load() {
    if (loading || disposed || !img) return;
    loading = true;
    const [mod, probe] = await Promise.all([
      import('./halftone-scene').catch(() => null),
      import('./signature-scene').catch(() => null),
    ]);
    if (disposed || !mod || !probe || !probe.webglOK()) return;
    // The frame's own (already optimized) image is the texture: no second download.
    if (!img.complete || !img.naturalWidth) await new Promise((r) => img.addEventListener('load', r, { once: true }));
    try {
      await img.decode();
    } catch {
      return;
    }
    if (disposed) return;
    const css = getComputedStyle(document.documentElement);
    scene = mod.createHalftoneScene(gl, img, {
      mobile: phone,
      ink: css.getPropertyValue('--c-accent').trim() || '#4d6bff',
      deep: '#1a2470', // accent pressed toward the desk black: the darkest tones read as wet ink
      pad: PAD,
      onLost: fallback,
    });
    if (scene) ready();
  }

  // Lazy: build the GL a screen before About arrives.
  const pre = ScrollTrigger.create({
    trigger: el,
    start: 'top bottom+=100%',
    end: 'bottom top',
    onToggle: (s) => s.isActive && load(),
    onLeave: () => load(),
  });
  if (pre.progress > 0) load();

  // Visibility + scroll progress through the viewport.
  const vis = ScrollTrigger.create({
    trigger: el,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (s) => {
      st.visible = s.isActive;
      if (s.isActive) revealTw?.play();
    },
    onUpdate: (s) => (st.scroll = s.progress),
  });
  st.visible = vis.isActive;
  st.scroll = vis.progress;

  // Pointer: map client coords into the canvas (bottom-left origin).
  const toLocal = (e: PointerEvent) => {
    const r = gl.getBoundingClientRect();
    st.tx = e.clientX - r.left;
    st.ty = r.bottom - e.clientY;
  };
  let release: gsap.core.Tween | null = null;
  const onMove = (e: PointerEvent) => {
    toLocal(e);
    if (st.p < 0.02) {
      st.x = st.tx;
      st.y = st.ty;
    }
    st.tp = 1;
  };
  const onDown = (e: PointerEvent) => {
    onMove(e);
    if (e.pointerType !== 'mouse') {
      // A tap: push, hold a beat, then spring back.
      release?.kill();
      release = gsap.delayedCall(0.45, () => (st.tp = 0));
    }
  };
  const onLeave = () => (st.tp = 0);
  const onTouchMove = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') return onMove(e);
    release?.kill();
    onMove(e);
  };
  const onUp = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    release?.kill();
    release = gsap.delayedCall(0.3, () => (st.tp = 0));
  };
  el.addEventListener('pointermove', onTouchMove, { passive: true });
  el.addEventListener('pointerdown', onDown, { passive: true });
  el.addEventListener('pointerleave', onLeave, { passive: true });
  el.addEventListener('pointerup', onUp, { passive: true });
  el.addEventListener('pointercancel', onUp, { passive: true });

  const onResize = () => scene?.resize();
  addEventListener('resize', onResize);

  // One clock. Position follows quickly; strength is a damped spring, so the dots overshoot a hair
  // on the way back and settle like ink.
  let time = 0;
  const tick = (t: number, dt: number) => {
    if (!scene || !st.visible) return;
    const s = Math.min(dt, 64) / 1000;
    time = t;
    const f = 1 - Math.exp(-s * 14);
    st.x += (st.tx - st.x) * f;
    st.y += (st.ty - st.y) * f;
    const k = st.tp > st.p ? 120 : 60; // stiffer in, softer out
    const damp = 2 * Math.sqrt(k) * 0.72;
    st.pv += ((st.tp - st.p) * k - st.pv * damp) * s;
    st.p = Math.max(0, st.p + st.pv * s);
    scene.render({
      time,
      scroll: st.scroll,
      reveal: st.reveal.v,
      pointer: [st.x, st.y],
      push: st.p,
    });
  };
  gsap.ticker.add(tick);

  return () => {
    disposed = true;
    pre.kill();
    vis.kill();
    revealTw?.kill();
    release?.kill();
    gsap.ticker.remove(tick);
    removeEventListener('resize', onResize);
    el.removeEventListener('pointermove', onTouchMove);
    el.removeEventListener('pointerdown', onDown);
    el.removeEventListener('pointerleave', onLeave);
    el.removeEventListener('pointerup', onUp);
    el.removeEventListener('pointercancel', onUp);
    fallback();
  };
}
