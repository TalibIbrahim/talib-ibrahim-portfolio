'use client';
// InkPad: the finale is a sheet of paper you can write on. A 2D canvas sits behind the content
// (sticky, one viewport tall, so its memory stays small however long the section is) and draws
// fountain-pen strokes:
//   - width from speed: slow = a wide, pooled line, fast = a hairline (smoothed, so it swells)
//   - the ink bleeds: a soft halo that spreads over the first second, like ink wicking into paper
//   - it dries: deep wet blue fades to a pale dry blue, then disappears (LIFE seconds)
// Colours are opaque, pre-mixed with the paper token: the layer only ever sits on paper.
// Ink lives in the section's coordinates, so it scrolls with the paper.
// Input: fine pointers draw on hover anywhere in the section (the pen lifts over the form and
// over links/buttons, and after a short pause). Touch draws only inside [data-ink-pad], which
// carries touch-action: none, so the rest of the section scrolls normally.
// Clock: gsap.ticker only, and only while the section is on screen and there is wet ink.
// DPR capped at 2. Reduced motion / no 2D context / Recruiter Mode: nothing runs, nothing shows.
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isTouch, prefersReducedMotion } from '@/engine';
import { usePage } from '@/engine/next';
import styles from '../Contact.module.css';

gsap.registerPlugin(ScrollTrigger);

type Pt = { x: number; y: number; w: number; t: number };
type Stroke = { pts: Pt[] };
type RGB = [number, number, number];

const LIFE = 6; // seconds from touch-down to gone
const BUCKETS = 30; // age buckets: one fill per bucket and pass
const MAX_W = 11; // CSS px, a slow pen
const MIN_W = 1.4; // CSS px, a fast flick
const SPEED_THIN = 2600; // px/s at which the line is thinnest
const LIFT_GAP = 0.14; // s without movement = the pen lifted
const JUMP = 140; // px between samples = the pen lifted
const MAX_POINTS = 5000;
const OFF = 'form, a, button, input, textarea, select, label, [data-ink-off]';
const TAU = Math.PI * 2;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const mix = (a: RGB, b: RGB, t: number): RGB => [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t)) as RGB;

function token(el: Element, name: string, fallback: RGB): RGB {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  const m = /^#?([0-9a-f]{6})$/i.exec(v);
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function InkPad() {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  usePage(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    const section = document.getElementById('contact');
    if (!layer || !canvas || !section) return;
    if (prefersReducedMotion() || !document.documentElement.classList.contains('motion')) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const touch = isTouch();
    const pad = section.querySelector<HTMLElement>('[data-ink-pad]');
    if (touch && !pad) return;
    section.dataset.ink = touch ? 'touch' : 'pointer';

    // Palette from the tokens: wet ink is the accent pushed toward the desk, dry ink toward paper.
    const accent = token(document.documentElement, '--c-accent', [77, 107, 255]);
    const desk = token(document.documentElement, '--c-bg', [11, 11, 12]);
    const paper = token(document.documentElement, '--c-fg', [236, 232, 223]);
    const wet = mix(accent, desk, 0.42);
    const dry = mix(accent, paper, 0.42);
    // Every colour is opaque and pre-mixed with the paper (the canvas only ever sits on paper), so
    // overlapping segments, joints and age buckets never stack alpha into bands.
    const css = (c: RGB) => `rgb(${c[0]},${c[1]},${c[2]})`;
    const core: string[] = [];
    const haloIn: string[] = [];
    const haloOut: string[] = [];
    const bleed: number[] = [];
    for (let b = 0; b < BUCKETS; b++) {
      const l = (b + 0.5) / BUCKETS;
      const ink = mix(wet, dry, smooth(0.06, 0.55, l));
      const a = 1 - smooth(0.5, 1, l);
      core.push(css(mix(paper, ink, a * 0.96)));
      haloIn.push(css(mix(paper, ink, a * 0.2)));
      haloOut.push(css(mix(paper, ink, a * 0.09)));
      bleed.push(0.6 + 3.4 * (1 - Math.exp(-l * LIFE * 2.6))); // px the halo has spread
    }

    const strokes: Stroke[] = [];
    let cur: Stroke | null = null;
    let total = 0;
    let travelled = 0;
    let inView = false;
    let ticking = false;
    let dpr = 1;
    let cw = 0;
    let ch = 0;
    const segS: Stroke[][] = Array.from({ length: BUCKETS }, () => []);
    const segI: number[][] = Array.from({ length: BUCKETS }, () => []);

    const wake = () => {
      if (ticking || !inView) return;
      ticking = true;
      gsap.ticker.add(render);
    };
    const sleep = () => {
      if (!ticking) return;
      ticking = false;
      gsap.ticker.remove(render);
    };

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const r = canvas!.getBoundingClientRect();
      cw = r.width;
      ch = r.height;
      canvas!.width = Math.max(1, Math.round(cw * dpr));
      canvas!.height = Math.max(1, Math.round(ch * dpr));
      render();
    }

    // ---------- input ----------
    function lift() {
      cur = null;
    }
    function add(x: number, y: number, t: number) {
      let last = cur?.pts[cur.pts.length - 1];
      if (last && ((!touch && t - last.t > LIFT_GAP) || Math.hypot(x - last.x, y - last.y) > JUMP)) {
        cur = null;
        last = undefined;
      }
      if (!cur) {
        cur = { pts: [] };
        strokes.push(cur);
      }
      let w = MAX_W * 0.7;
      if (last) {
        const d = Math.hypot(x - last.x, y - last.y);
        if (d < 1.5) return;
        const v = d / Math.max(t - last.t, 1 / 240);
        const target = MAX_W - (MAX_W - MIN_W) * clamp(v / SPEED_THIN, 0, 1);
        w = last.w + (target - last.w) * 0.28;
        travelled += d;
      }
      cur.pts.push({ x, y, w: touch ? w * 0.85 : w, t });
      if (++total > MAX_POINTS) {
        const old = strokes.shift();
        total -= old?.pts.length ?? 0;
        if (old === cur) cur = null;
      }
      if (travelled > 80 && !('inked' in section!.dataset)) section!.dataset.inked = '';
      wake();
    }
    function feed(e: PointerEvent) {
      const L = layer!.getBoundingClientRect();
      const list = e.getCoalescedEvents?.() ?? [];
      for (const p of list.length ? list : [e]) add(p.clientX - L.left, p.clientY - L.top, p.timeStamp / 1000);
    }

    const offs: (() => void)[] = [];
    const on = <K extends keyof HTMLElementEventMap>(
      el: HTMLElement,
      type: K,
      fn: (e: HTMLElementEventMap[K]) => void,
      opts?: AddEventListenerOptions,
    ) => {
      el.addEventListener(type, fn, opts);
      offs.push(() => el.removeEventListener(type, fn, opts));
    };

    if (!touch) {
      on(
        section,
        'pointermove',
        (e) => {
          if (e.pointerType === 'touch' || !inView) return;
          if ((e.target as Element | null)?.closest(OFF)) return lift();
          feed(e);
        },
        { passive: true },
      );
      on(section, 'pointerleave', lift);
    } else {
      let id: number | null = null;
      on(pad!, 'pointerdown', (e) => {
        id = e.pointerId;
        pad!.setPointerCapture(e.pointerId);
        lift();
        feed(e);
      });
      on(pad!, 'pointermove', (e) => {
        if (e.pointerId === id) feed(e);
      });
      const end = (e: PointerEvent) => {
        if (e.pointerId !== id) return;
        id = null;
        lift();
      };
      on(pad!, 'pointerup', end);
      on(pad!, 'pointercancel', end);
    }

    // ---------- render ----------
    let ox = 0;
    let oy = 0;
    function ribbon(a: Pt, b: Pt, extra: number) {
      const ax = a.x - ox, ay = a.y - oy, bx = b.x - ox, by = b.y - oy;
      const len = Math.hypot(bx - ax, by - ay) || 1;
      const nx = -(by - ay) / len, ny = (bx - ax) / len;
      const ha = a.w / 2 + extra, hb = b.w / 2 + extra;
      // Every quad and disc winds the same way, so overlaps fill once (no holes, no doubled alpha).
      ctx!.moveTo(ax + nx * ha, ay + ny * ha);
      ctx!.lineTo(bx + nx * hb, by + ny * hb);
      ctx!.lineTo(bx - nx * hb, by - ny * hb);
      ctx!.lineTo(ax - nx * ha, ay - ny * ha);
      ctx!.closePath();
      ctx!.moveTo(bx + hb, by);
      ctx!.arc(bx, by, hb, 0, TAU, true);
    }
    function blot(p: Pt, r: number) {
      ctx!.moveTo(p.x - ox + r, p.y - oy);
      ctx!.arc(p.x - ox, p.y - oy, r, 0, TAU, true);
    }

    function render() {
      const now = performance.now() / 1000;
      // Drop dried ink from the tail of each stroke.
      for (let s = strokes.length - 1; s >= 0; s--) {
        const pts = strokes[s].pts;
        let k = 0;
        while (k < pts.length && now - pts[k].t > LIFE) k++;
        if (k > 1) {
          pts.splice(0, k - 1);
          total -= k - 1;
        }
        if (pts.length && now - pts[pts.length - 1].t > LIFE) {
          total -= pts.length;
          if (strokes[s] === cur) cur = null;
          strokes.splice(s, 1);
        }
      }

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, cw, ch);
      if (!strokes.length) {
        sleep();
        return;
      }
      const C = canvas!.getBoundingClientRect();
      const L = layer!.getBoundingClientRect();
      ox = C.left - L.left;
      oy = C.top - L.top;

      for (let b = 0; b < BUCKETS; b++) {
        segS[b].length = 0;
        segI[b].length = 0;
      }
      for (const s of strokes) {
        const pts = s.pts;
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          if (p.y - oy < -40 || p.y - oy > ch + 40) continue;
          const l = (now - p.t) / LIFE;
          if (l >= 1 || l < 0) continue;
          const b = Math.min(BUCKETS - 1, Math.floor(l * BUCKETS));
          segS[b].push(s);
          segI[b].push(i);
        }
      }

      // Pass by pass (outer bleed, inner bleed, core), oldest first, so wet ink lands on top.
      for (let pass = 0; pass < 3; pass++) {
        for (let b = BUCKETS - 1; b >= 0; b--) {
          const S = segS[b];
          if (!S.length) continue;
          const I = segI[b];
          const extra = pass === 0 ? bleed[b] * 1.8 : pass === 1 ? bleed[b] : 0;
          ctx!.beginPath();
          for (let k = 0; k < S.length; k++) {
            const pts = S[k].pts;
            const i = I[k];
            if (i === 0) blot(pts[0], pts[0].w * 0.62 + extra);
            else ribbon(pts[i - 1], pts[i], extra);
          }
          ctx!.fillStyle = pass === 0 ? haloOut[b] : pass === 1 ? haloIn[b] : core[b];
          ctx!.fill();
        }
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => {
        inView = self.isActive;
        if (!inView) {
          lift();
          sleep();
        } else if (strokes.length) wake();
      },
      onRefresh: (self) => {
        inView = self.isActive;
      },
    });

    return () => {
      sleep();
      ro.disconnect();
      offs.forEach((o) => o());
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      delete section.dataset.ink;
      delete section.dataset.inked;
    };
  });

  return (
    <div ref={layerRef} className={styles.inkLayer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.inkCanvas} />
    </div>
  );
}
