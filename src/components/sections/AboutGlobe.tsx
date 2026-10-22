'use client';
// About's ink-dot globe, turned to face Pakistan with a pulsing pin on Lahore and its live local time.
// The SVG is the real frame (no JS, reduced motion, no WebGL, context lost, before the GL is ready):
// the front hemisphere pre-projected at the rest pose by scripts/gen-globe-dots.mjs. When About
// approaches, OGL loads lazily and a canvas of the same dots takes over (globe-scene.ts):
//   idle     a slow drift around Lahore and a breath in the dot size; the pin's ring pulses
//   pointer  dots near the cursor scatter and spring back; dragging turns the globe a little,
//            it coasts on release and eases back to Lahore
//   touch    sideways drags turn it (vertical drags still scroll the page: touch-action pan-y)
//   scroll   the globe tips north to south and swells a touch as it passes the viewport
// Rendered on gsap.ticker only while on screen.
import { useRef, useSyncExternalStore } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { site } from '@/data/site';
import { usePage } from '@/engine/next';
import { ease } from '@/engine';
import { GLOBE_FACE, GLOBE_LIMB, GLOBE_RADIUS, GLOBE_REST, GLOBE_VB, LAHORE_AT } from './globe-dots';
import type { GlobeScene } from './globe-scene';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

const PAD = 0.08; // canvas overhang per side, as a fraction of the frame, so scattered dots are not clipped
const ZONE = 'Asia/Karachi';

/* ---------------------------------------------------------------- live local time */
let fmt: Intl.DateTimeFormat | null = null;
const now = () => {
  fmt ??= new Intl.DateTimeFormat('en-GB', { timeZone: ZONE, hour: '2-digit', minute: '2-digit', hour12: false });
  return fmt.format(new Date());
};
function subscribe(cb: () => void) {
  let id = 0;
  const arm = () => {
    id = window.setTimeout(() => {
      cb();
      arm();
    }, 60_000 - (Date.now() % 60_000) + 50);
  };
  arm();
  const onVis = () => document.visibilityState === 'visible' && cb();
  document.addEventListener('visibilitychange', onVis);
  return () => {
    clearTimeout(id);
    document.removeEventListener('visibilitychange', onVis);
  };
}
const useLocalTime = () => useSyncExternalStore(subscribe, now, () => '');

/* ---------------------------------------------------------------- component */
export function AboutGlobe() {
  const frame = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const time = useLocalTime();
  const city = site.location.split(',')[0].trim();

  usePage(() => {
    const el = frame.current;
    const gl = host.current;
    const mark = pin.current;
    if (!el || !gl || !mark) return;
    const live = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (s) => el.toggleAttribute('data-live', s.isActive),
    });
    el.toggleAttribute('data-live', live.isActive);
    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        phone: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      },
      (c) => {
        if (!document.documentElement.classList.contains('motion')) return;
        return initGlobe(el, gl, mark, !!c.conditions?.phone);
      },
    );
    return () => {
      mm.revert();
      live.kill();
      el.removeAttribute('data-live');
    };
  });

  const c = GLOBE_VB / 2;
  return (
    <figure ref={frame} className={styles.globe} data-drop>
      <svg className={styles.print} viewBox={`0 0 ${GLOBE_VB} ${GLOBE_VB}`} aria-hidden="true" focusable="false">
        <circle className={styles.limbRing} cx={c} cy={c} r={GLOBE_VB * GLOBE_RADIUS} />
        <path className={styles.limbDots} d={GLOBE_LIMB} />
        <path className={styles.faceDots} d={GLOBE_FACE} />
      </svg>
      <div ref={host} className={styles.dots} />
      <div
        ref={pin}
        className={styles.pin}
        style={{ left: `${LAHORE_AT[0] * 100}%`, top: `${LAHORE_AT[1] * 100}%` }}
        aria-hidden="true"
      >
        <span className={styles.ring} />
        <span className={styles.core} />
        <span className={styles.tag}>
          {city}
          {time && <time dateTime={time}>{time}</time>}
        </span>
      </div>
      <figcaption className="sr-only">
        {site.globe.caption}
        {time && `, ${site.globe.timeCaption} ${time}`}
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- motion */
function initGlobe(el: HTMLElement, gl: HTMLDivElement, mark: HTMLDivElement, phone: boolean) {
  let scene: GlobeScene | null = null;
  let disposed = false;
  let loading = false;
  const st = {
    visible: false,
    scroll: 0.5,
    reveal: { v: 1 },
    // pointer: target and eased (canvas css px, bottom-left origin), strength spring
    tx: -1e4, ty: -1e4, x: -1e4, y: -1e4,
    tp: 0, p: 0, pv: 0,
    // drag offset (degrees) and its velocity; the target while a drag is held
    ol: 0, op: 0, vl: 0, vp: 0, dl: 0, dp: 0,
  };
  let revealTw: gsap.core.Tween | null = null;

  const ready = () => {
    el.classList.add(styles.gl);
    if (matchMedia('(pointer: fine)').matches) el.dataset.cursor = 'drag';
    if (st.visible) {
      // Already on screen: cross-fade from the print at the same pose.
      gsap.fromTo(gl, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: ease.soft });
    } else {
      // Arrived early: the ink spreads out from Lahore when the frame comes into view.
      gsap.set(gl, { opacity: 1 });
      st.reveal.v = 0;
      revealTw = gsap.to(st.reveal, { v: 1, duration: 2.4, ease: ease.out, paused: true });
    }
  };

  const fallback = () => {
    scene?.destroy();
    scene = null;
    el.classList.remove(styles.gl);
    delete el.dataset.cursor;
    gsap.set(gl, { clearProps: 'opacity' });
    mark.style.transform = '';
    mark.style.opacity = '';
    mark.removeAttribute('data-flip');
  };

  async function load() {
    if (loading || disposed) return;
    loading = true;
    const [mod, probe] = await Promise.all([
      import('./globe-scene').catch(() => null),
      import('./signature-scene').catch(() => null),
    ]);
    if (disposed || !mod || !probe || !probe.webglOK()) return;
    const css = getComputedStyle(document.documentElement);
    scene = mod.createGlobeScene(gl, {
      mobile: phone,
      ink: css.getPropertyValue('--c-accent').trim() || '#4d6bff',
      deep: '#1a2470', // accent pressed toward the desk black: the far side and the limb
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

  /* pointer: scatter + drag */
  const L = { lng: 38, lat: 16 }; // how far a drag can turn the globe (soft limit), degrees
  const soft = (v: number, lim: number) => lim * Math.tanh(v / lim);
  const drag = { id: -1, on: false, x: 0, y: 0, sl: 0, sp: 0, mouse: true };
  const toLocal = (e: PointerEvent) => {
    const r = gl.getBoundingClientRect();
    st.tx = e.clientX - r.left;
    st.ty = r.bottom - e.clientY;
  };
  let release: gsap.core.Tween | null = null;
  const degPerPx = () => (scene ? 57.3 / scene.size().r : 0.3) * 0.8;

  const onDown = (e: PointerEvent) => {
    if (!e.isPrimary || e.button > 0) return;
    toLocal(e);
    if (st.p < 0.02) {
      st.x = st.tx;
      st.y = st.ty;
    }
    st.tp = 1;
    release?.kill();
    drag.id = e.pointerId;
    drag.on = false;
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.sl = st.ol;
    drag.sp = st.op;
    drag.mouse = e.pointerType === 'mouse';
  };
  const onMove = (e: PointerEvent) => {
    toLocal(e);
    if (st.p < 0.02) {
      st.x = st.tx;
      st.y = st.ty;
    }
    if (e.pointerType === 'mouse' || drag.id === e.pointerId) st.tp = 1;
    if (drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.on) {
      const go = drag.mouse ? Math.hypot(dx, dy) > 4 : Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2;
      if (!go) return;
      drag.on = true;
      drag.x = e.clientX;
      drag.y = e.clientY;
      if (drag.mouse) el.setPointerCapture?.(e.pointerId);
      el.toggleAttribute('data-dragging', true);
      return;
    }
    const k = degPerPx();
    st.dl = soft(drag.sl - dx * k, L.lng);
    st.dp = drag.mouse ? soft(drag.sp + dy * k, L.lat) : st.op;
  };
  const onUp = (e: PointerEvent) => {
    if (drag.id === e.pointerId) {
      drag.id = -1;
      drag.on = false;
      el.removeAttribute('data-dragging');
      if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
    }
    if (e.pointerType === 'mouse') return;
    release?.kill();
    release = gsap.delayedCall(0.3, () => (st.tp = 0));
  };
  const onLeave = (e: PointerEvent) => {
    if (drag.id === e.pointerId && drag.on) return; // captured drag continues outside
    if (e.pointerType === 'mouse') st.tp = 0;
  };
  el.addEventListener('pointerdown', onDown, { passive: true });
  el.addEventListener('pointermove', onMove, { passive: true });
  el.addEventListener('pointerup', onUp, { passive: true });
  el.addEventListener('pointercancel', onUp, { passive: true });
  el.addEventListener('pointerleave', onLeave, { passive: true });

  const onResize = () => scene?.resize();
  addEventListener('resize', onResize);

  /* one clock */
  let time = 0;
  const tick = (t: number, dt: number) => {
    if (!scene || !st.visible) return;
    const s = Math.min(dt, 64) / 1000;
    time = t;
    // pointer strength: damped spring, stiffer in than out (the dots overshoot a hair, then settle)
    const f = 1 - Math.exp(-s * 14);
    st.x += (st.tx - st.x) * f;
    st.y += (st.ty - st.y) * f;
    const k = st.tp > st.p ? 120 : 60;
    st.pv += ((st.tp - st.p) * k - st.pv * 2 * Math.sqrt(k) * 0.72) * s;
    st.p = Math.max(0, st.p + st.pv * s);
    // drag offset: follows the hand while held; on release it coasts on its velocity and a soft
    // spring brings Lahore back to the front
    if (drag.on) {
      const g = 1 - Math.exp(-s * 22);
      const nl = st.ol + (st.dl - st.ol) * g;
      const np = st.op + (st.dp - st.op) * g;
      st.vl = s > 0 ? (nl - st.ol) / s : 0;
      st.vp = s > 0 ? (np - st.op) / s : 0;
      st.ol = nl;
      st.op = np;
    } else {
      const K = 7;
      const C = 2 * Math.sqrt(K) * 0.8;
      st.vl += (-K * st.ol - C * st.vl) * s;
      st.vp += (-K * st.op - C * st.vp) * s;
      st.ol += st.vl * s;
      st.op += st.vp * s;
    }
    // idle drift around Lahore, scroll tip (north to south) and swell
    const sc = st.scroll;
    const lng = GLOBE_REST.lng + 7 * Math.sin(t * 0.13) + st.ol;
    const lat = GLOBE_REST.lat + 2.5 * Math.sin(t * 0.09) + (0.5 - sc) * 14 + st.op;
    const scale = 0.93 + 0.07 * Math.sin(Math.PI * Math.min(1, Math.max(0, sc)));
    scene.render({ time, lng, lat, scale, reveal: st.reveal.v, pointer: [st.x, st.y], push: st.p });
    // the pin rides on Lahore
    const p = scene.project(lng, lat, scale);
    const { w } = scene.size();
    const frameW = w / (1 + 2 * PAD);
    const ox = p.x - w * PAD / (1 + 2 * PAD) - LAHORE_AT[0] * frameW;
    const oy = p.y - w * PAD / (1 + 2 * PAD) - LAHORE_AT[1] * frameW;
    mark.style.transform = `translate3d(${ox.toFixed(2)}px, ${oy.toFixed(2)}px, 0)`;
    mark.toggleAttribute('data-flip', ox + LAHORE_AT[0] * frameW > frameW * 0.6);
    mark.style.opacity = String(Math.min(1, Math.max(0, (p.z - 0.05) / 0.25)) * Math.min(1, st.reveal.v * 3));
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
    el.removeEventListener('pointerdown', onDown);
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerup', onUp);
    el.removeEventListener('pointercancel', onUp);
    el.removeEventListener('pointerleave', onLeave);
    el.removeAttribute('data-dragging');
    fallback();
  };
}
