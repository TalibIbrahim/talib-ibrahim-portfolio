'use client';
// Work motion. Renders nothing; wires the server-rendered #work section on every page load.
//
// Desktop (>= 768px, html.motion): the section gets data-strip; CSS makes a sticky 100svh stage over
// 180svh + --travel of scroll. One scrubbed driver (scrub .6), split in two phases:
//   entrance  p 0 -> 1 over the first 80svh after the stage sticks (scrub .6). Project 01's cover is a
//             small tilted duotone card under the title; it pulls flat into its slot (OGL plane, the
//             top-left corner leads, the sheet sags; DOM FLIP when there is no GL). Meanwhile the
//             paper ground fades to ink (.4 -> .75), the title rises into its band and parts around
//             the chip as the chip opens (.3 -> 1), and the title decodes once at p >= .9.
//   travel    the track slides sideways by its overflow O over O / 1.5 of scroll (ease none).
//             As each project reaches the focus band its description rises by masked lines (SplitText)
//             and its key-fact line types in, once.
//             One onUpdate drives everything from cached offsets: the focus band at .4vw (scale,
//             duotone, the head node), captions typing in as items cross
//             85%, and the git-graph line, whose head runs a little ahead of the focus band. The line
//             runs just under the captions through a node at each, and curves through the gaps between
//             covers (never over one). Covers are whole: no in-frame parallax or crop.
//   pen lead  the git-graph line no longer starts at the stage's left edge: it comes down from the stage's
//             top edge at About's pen-line x (half a gutter), so About's line (about/line.ts) runs on into
//             it, and turns into project 01's node. Its vertical draws with the pen's head on the same
//             viewport line as About's (PEN_HEAD), from the section top at that line until the corner; the
//             turn to the node still draws as the card lands.
// Phones (html.motion): stacked; project 01 un-skews from a polygon and its colour comes in; each
// cover fades duotone -> colour as it reaches the middle; a rail draws down the left with a node per
// project. Reduced motion / no JS / Recruiter Mode: the static grid, nothing here runs.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ease, scrollToTarget } from '@/engine';
import { usePage } from '@/engine/next';
import { webglOK } from '@/lib/webgl';
import { holdGL } from '@/lib/gl-hold';
import type { EntranceScene, Rect } from './entrance-scene';
import { PEN_HEAD } from '../about/line';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const q = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => root.querySelector<T>(sel);
const qa = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => [...root.querySelectorAll<T>(sel)];
const clamp01 = gsap.utils.clamp(0, 1);
const fit = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const NOISE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const ENTRANCE = 0.8; // screens of scroll for the entrance
const RATIO = 1.5; // sideways px per px of scroll (eased from 1.7 when the gaps widened)
const BAND = 0.4; // focus band, share of the stage width
const THUMB_ROT = -4; // degrees

export function ShowreelMotion() {
  usePage(() => {
    const section = document.getElementById('work');
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add(
      {
        strip: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        phone: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      },
      (c) => {
        if (!document.documentElement.classList.contains('motion')) return;
        return c.conditions?.strip ? initStrip(section) : initPhone(section);
      },
    );
    return () => mm.revert();
  });
  return null;
}

/* ---------------------------------------------------------------- shared: text effects */

/** The title words resolve from noise once, char by char (fixed-width slots, so nothing reflows). */
function makeDecode(words: HTMLElement[]) {
  const splits = words.map((w) => SplitText.create(w, { type: 'chars', charsClass: 'work-char', aria: 'none' }));
  splits.forEach((s) => s.chars.forEach((c) => ((c as HTMLElement).style.width = `${(c as HTMLElement).offsetWidth}px`)));
  let done = false;
  let tl: gsap.core.Timeline | null = null;
  return {
    play() {
      if (done) return;
      done = true;
      tl = gsap.timeline();
      splits.forEach((s, wi) =>
        s.chars.forEach((c, ci) =>
          tl!.to(
            c,
            { duration: 0.6, ease: 'none', scrambleText: { text: c.textContent ?? '', chars: NOISE, speed: 0.6 } },
            wi * 0.25 + ci * 0.05,
          ),
        ),
      );
    },
    revert() {
      tl?.progress(1).kill();
      splits.forEach((s) => s.revert());
    },
  };
}

/** A caption types itself in behind a block caret, once. */
function typeIn(cap: HTMLElement) {
  const text = q(cap, '[data-cap-text]');
  const caret = q(cap, '[data-caret]');
  if (!text || !caret || cap.dataset.typed) return null;
  cap.dataset.typed = '';
  const n = Math.max(1, (text.textContent ?? '').length);
  const w = text.offsetWidth;
  const d = Math.min(0.9, n * 0.028);
  return gsap
    .timeline()
    .set(caret, { visibility: 'visible', x: 0 })
    .to(text, { clipPath: 'inset(-10% 0% -10% 0%)', ease: `steps(${n})`, duration: d }, 0)
    .to(caret, { x: w, ease: `steps(${n})`, duration: d }, 0)
    .to(caret, { opacity: 0, duration: 0.01, repeat: 3, yoyo: true, repeatDelay: 0.22 }, d + 0.1)
    .set(caret, { visibility: 'hidden' });
}
/** The description rises by masked lines and the fact line types in, once, when the project reaches
 *  the focus band. Until then the lines wait under their masks (motion only; the HTML is final). */
function makeCopy(item: HTMLElement) {
  const desc = q(item, '[data-desc]');
  const fact = q(item, '[data-fact-text]');
  let played = false;
  let tl: gsap.core.Timeline | null = null;
  const split = desc
    ? SplitText.create(desc, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'work-line',
        autoSplit: true,
        onSplit(self) {
          gsap.set(self.lines, { yPercent: played ? 0 : 105 });
        },
      })
    : null;
  if (fact) gsap.set(fact, { clipPath: 'inset(-10% 100% -10% 0%)' });
  return {
    play() {
      if (played) return;
      played = true;
      tl = gsap.timeline();
      if (split) tl.to(split.lines, { yPercent: 0, duration: 0.9, ease: ease.out, stagger: 0.06 }, 0);
      if (fact) {
        const n = Math.max(1, (fact.textContent ?? '').length);
        tl.to(fact, { clipPath: 'inset(-10% 0% -10% 0%)', ease: `steps(${n})`, duration: Math.min(0.9, n * 0.028) }, 0.25);
      }
    },
    revert() {
      tl?.progress(1).kill();
      split?.revert();
      if (fact) gsap.set(fact, { clearProps: 'clipPath' });
    },
  };
}

const hideCaption = (cap: HTMLElement) => {
  const text = q(cap, '[data-cap-text]');
  if (text) gsap.set(text, { clipPath: 'inset(-10% 100% -10% 0%)' });
};

/* ---------------------------------------------------------------- desktop: the strip */

type Item = {
  cell: HTMLElement;
  frame: HTMLElement;
  media: HTMLElement;
  par: HTMLElement;
  duo: HTMLElement | null;
  node: HTMLElement | null;
  cap: HTMLElement | null;
  x0: number; // frame left in track px
  w: number;
  setScale: (v: number) => void;
  setDuo: (v: number) => void;
  lit: boolean;
  head: boolean;
  copy: ReturnType<typeof makeCopy>;
};

function initStrip(section: HTMLElement) {
  const stage = q(section, '[data-stage]');
  const ground = q(section, '[data-ground]');
  const glHost = q(section, '[data-gl]');
  const head = q(section, '[data-head]');
  const track = q(section, '[data-track]');
  const chip = q(section, '[data-chip]');
  const line = q<SVGPathElement>(section, '[data-line]');
  const allEl = q(section, '[data-all]');
  const wordEls = qa(section, '[data-word]');
  if (!stage || !ground || !glHost || !head || !track || !chip || !line || !allEl) return;

  section.dataset.strip = '';
  const late: gsap.core.Animation[] = [];

  const items: Item[] = qa(section, '[data-item]').map((el) => {
    const frame = q(el, '[data-frame]')!;
    const media = q(el, '[data-media]')!;
    const par = q(el, '[data-par]')!;
    const duo = q(el, '[data-duo]');
    return {
      cell: el.parentElement as HTMLElement,
      frame,
      media,
      par,
      duo,
      node: q(el, '[data-node]'),
      cap: q(el, '[data-cap]'),
      x0: 0,
      w: 1,
      setScale: gsap.quickSetter(media, 'scale') as (v: number) => void,
      setDuo: duo ? (gsap.quickSetter(duo, 'opacity') as (v: number) => void) : () => {},
      lit: false,
      head: false,
      copy: makeCopy(el),
    };
  });
  if (!items.length) return;
  const p1 = items[0];
  const allNode = q(allEl, '[data-node]');
  const p1Text = qa(p1.cell, '[data-copy]');

  items.forEach((it) => it.cap && hideCaption(it.cap));
  const decode = makeDecode(wordEls);

  /* ---------- measure (on every refresh, before positions are computed) ---------- */
  const m = {
    W: 1,
    H: 1,
    O: 0,
    slot: { cx: 0, cy: 0, w: 1, h: 1 } as Rect,
    thumb: { cx: 0, cy: 0, w: 1, h: 1 } as Rect,
    shift: 0, // how far each title word moves out for the chip
    chipW: 0,
    rise: 0, // the title's start offset (down), px
    total: 0, // line length
    xs: new Float32Array(0), // line samples: x at each length step
    step: 1,
    nodeX: [] as number[],
    allX: 0,
    lead: 0, // length of the pen lead (down from the stage top, round the corner)
  };

  function measure() {
    gsap.set(track, { x: 0 });
    gsap.set(head, { x: 0, y: 0 });
    gsap.set(wordEls, { x: 0 });
    gsap.set(chip, { clipPath: 'none' });
    m.W = stage!.clientWidth;
    m.H = stage!.clientHeight;
    m.O = Math.max(0, track!.offsetWidth - m.W);
    section.style.setProperty('--travel', `${Math.round(m.O / RATIO)}px`);

    items.forEach((it) => {
      const art = it.frame.offsetParent as HTMLElement;
      it.x0 = art.offsetLeft + it.frame.offsetLeft;
      it.w = it.frame.offsetWidth;
    });
    const art = p1.frame.offsetParent as HTMLElement;
    const sw = p1.frame.offsetWidth;
    const sh = p1.frame.offsetHeight;
    m.slot = { cx: art.offsetLeft + p1.frame.offsetLeft + sw / 2, cy: art.offsetTop + p1.frame.offsetTop + sh / 2, w: sw, h: sh };
    // Title: where the words sit with the chip open, and how far apart that is.
    const [a, b] = wordEls;
    const fs = parseFloat(getComputedStyle(head!.querySelector('[data-words]')!).fontSize) || 100;
    // The card waits under the title (never under the letters: the title is difference-blended).
    const tw = gsap.utils.clamp(220, 340, m.W * 0.22);
    const th = (tw * sh) / sw;
    const startCy = m.H * 0.4;
    m.thumb = { cx: m.W / 2, cy: startCy + fs * 0.45 + m.H * 0.05 + th / 2, w: tw, h: th };
    if (a && b) {
      const gap = b.offsetLeft - (a.offsetLeft + a.offsetWidth);
      m.shift = Math.max(0, (gap - fs * 0.24) / 2);
    }
    m.chipW = chip!.offsetWidth;
    const wordsCy = head!.offsetTop + head!.offsetHeight / 2;
    m.rise = startCy - wordsCy;

    buildLine();
    placeGL();
    glScene?.setPose({ from: m.thumb, rot: (THUMB_ROT * Math.PI) / 180, to: m.slot, focus: focusOf(p1) });
  }

  /** The canvas covers only the card's path: the card, the slot, the sag and the tilt. */
  function placeGL() {
    const t = m.thumb;
    const sl = m.slot;
    const r = Math.hypot(t.w, t.h) / 2;
    const pad = 4;
    const x0 = Math.max(0, Math.floor(Math.min(t.cx - r, sl.cx - sl.w / 2) - pad));
    const y0 = Math.max(0, Math.floor(Math.min(t.cy - r, sl.cy - sl.h / 2) - pad));
    const x1 = Math.min(m.W, Math.ceil(Math.max(t.cx + r, sl.cx + sl.w / 2) + pad));
    const y1 = Math.min(m.H, Math.ceil(Math.max(t.cy + r, sl.cy + sl.h / 2) + sl.h * 0.06 + pad));
    Object.assign(glHost!.style, { left: `${x0}px`, top: `${y0}px`, width: `${x1 - x0}px`, height: `${y1 - y0}px` });
    glScene?.resize(x0, y0, x1 - x0, y1 - y0);
  }

  /* ---------- the git-graph line: through every frame's middle, curving in the gaps ---------- */
  function buildLine() {
    // every point from the nodes' boxes, relative to the track (measure() has reset its x to 0)
    const tr = track!.getBoundingClientRect();
    const centre = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - tr.left, y: r.top + r.height / 2 - tr.top };
    };
    const pts = items.map((it) => {
      const c = it.node ? centre(it.node) : { x: it.x0 - 16, y: 0 };
      // offsets, not the box: project 01's frame carries the entrance transform while this runs
      const art = it.frame.offsetParent as HTMLElement;
      return { nx: c.x, ny: c.y, right: art.offsetLeft + it.frame.offsetLeft + it.frame.offsetWidth };
    });
    const a = allNode ? centre(allNode) : centre(allEl!);
    const ax = a.x;
    const ay = a.y;
    m.nodeX = pts.map((p) => p.nx);
    m.allX = ax;

    // the pen lead: down from the stage's top edge at About's line x, round a corner, into node 01
    const px = (parseFloat(getComputedStyle(head!).paddingLeft) || 0) / 2;
    const y0 = pts[0].ny;
    const r = Math.max(4, Math.min(28, (pts[0].nx - px) / 2, y0 / 2));
    let d = `M ${px.toFixed(1)} 0 V ${(y0 - r).toFixed(1)} Q ${px.toFixed(1)} ${y0.toFixed(1)} ${(px + r).toFixed(1)} ${y0.toFixed(1)}`;
    line!.setAttribute('d', d);
    m.lead = line!.getTotalLength();
    d += ` H ${pts[0].nx.toFixed(1)}`;
    // under a caption to its frame's right edge, then one smooth S through the gap (horizontal
    // tangents at both ends, so it stays monotonic in x and never kinks) into the next node
    const curve = (fromX: number, fromY: number, toX: number, toY: number, endX: number) => {
      const gs = fromX + 4;
      const ge = Math.max(gs + 24, toX - 12);
      if (Math.abs(toY - fromY) < 1) {
        d += ` H ${endX.toFixed(1)}`;
        return;
      }
      const k = (ge - gs) * 0.5;
      d += ` H ${gs.toFixed(1)} C ${(gs + k).toFixed(1)} ${fromY.toFixed(1)} ${(ge - k).toFixed(1)} ${toY.toFixed(1)} ${ge.toFixed(1)} ${toY.toFixed(1)} H ${endX.toFixed(1)}`;
    };
    for (let i = 0; i < pts.length - 1; i++) curve(pts[i].right, pts[i].ny, pts[i + 1].nx, pts[i + 1].ny, pts[i + 1].nx);
    const last = pts[pts.length - 1];
    curve(last.right, last.ny, ax, ay, ax);
    line!.setAttribute('d', d);

    // samples of x along the line after the lead (monotonic in x), for drawing up to a track x
    const total = line!.getTotalLength();
    const N = 600;
    m.total = total;
    m.step = (total - m.lead) / N;
    m.xs = new Float32Array(N + 1);
    for (let i = 0; i <= N; i++) m.xs[i] = line!.getPointAtLength(m.lead + i * m.step).x;
    line!.style.strokeDasharray = `${total} ${total + 10}`;
    line!.style.strokeDashoffset = `${total}`;
    drawn = -1;
    paint();
  }
  let drawn = -1;
  let leadP = 0; // the pen lead's progress (scroll, before the stage sticks)
  let headLen = 0; // drawn length past the lead, from a track x
  function paint() {
    const len = leadP < 1 ? leadP * m.lead : m.lead + headLen;
    if (Math.abs(len - drawn) < 0.5) return;
    drawn = len;
    line!.style.strokeDashoffset = `${(m.total - len).toFixed(1)}`;
  }
  /** Draw the line up to track-x `hx` (the samples are monotonic in x). */
  function drawTo(hx: number) {
    const xs = m.xs;
    let lo = 0;
    let hi = xs.length - 1;
    if (hx <= xs[0]) hi = 0;
    else
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (xs[mid] <= hx) lo = mid;
        else hi = mid - 1;
      }
    headLen = Math.min(m.total - m.lead, hi * m.step);
    paint();
  }

  /* ---------- entrance ---------- */
  const setHeadY = gsap.quickSetter(head, 'y', 'px') as (v: number) => void;
  const setHeadX = gsap.quickSetter(head, 'x', 'px') as (v: number) => void;
  const setA = wordEls[0] ? (gsap.quickSetter(wordEls[0], 'x', 'px') as (v: number) => void) : () => {};
  const setB = wordEls[1] ? (gsap.quickSetter(wordEls[1], 'x', 'px') as (v: number) => void) : () => {};
  const setGround = gsap.quickSetter(ground, 'opacity') as (v: number) => void;
  const inOut = gsap.parseEase(ease.inOut);
  const out = gsap.parseEase(ease.out);
  const others = items.slice(1);

  let glScene: EntranceScene | null = null;
  let release: (() => void) | null = null;
  let landed = false;
  let lastP = -1;

  function applyEntrance(p: number) {
    lastP = p;
    // title: rises into its band, the chip opens, the words part around it
    const t = inOut(fit(p, 0.3, 1));
    setHeadY(m.rise * (1 - inOut(fit(p, 0.08, 0.8))));
    setA(m.shift * (1 - t));
    setB(-m.shift * (1 - t));
    const cut = (m.chipW / 2) * (1 - t);
    chip!.style.clipPath = t >= 1 ? 'none' : `inset(0px ${cut.toFixed(1)}px 0px ${cut.toFixed(1)}px)`;
    // ground: paper -> ink
    setGround(1 - fit(p, 0.4, 0.75));
    // the card
    const mid = p > 0 && p < 1;
    if (glScene && mid) {
      glScene.render(p);
      glHost!.style.visibility = 'visible';
      p1.frame.style.visibility = 'hidden';
      release ??= holdGL();
    } else {
      glHost!.style.visibility = 'hidden';
      p1.frame.style.visibility = '';
      release?.();
      release = null;
    }
    const k = inOut(p);
    const s = m.thumb.w / m.slot.w;
    gsap.set(p1.frame, {
      x: (m.thumb.cx - m.slot.cx) * (1 - k),
      y: (m.thumb.cy - m.slot.cy) * (1 - k),
      scale: s + (1 - s) * k,
      rotation: THUMB_ROT * (1 - k),
    });
    if (p < 1) p1.setDuo(1 - k);
    // the rest of the first screen prints in under the landing card
    const r = out(fit(p, 0.62, 0.98));
    others.forEach((it) => {
      const v = r >= 1 || it.x0 > m.W ? '' : `inset(0% 0% ${((1 - r) * 100).toFixed(2)}% 0%)`;
      if (it.cell.style.clipPath !== v) it.cell.style.clipPath = v;
    });
    // landing: the title resolves, project 01's text types in
    if (p >= 0.9) decode.play();
    const nowLanded = p >= 0.97;
    if (nowLanded !== landed) {
      landed = nowLanded;
      p1Text.forEach((el) => gsap.to(el, { opacity: landed ? 1 : 0, duration: 0.4, ease: ease.soft, overwrite: true }));
      if (!landed)
        items.forEach((it) => {
          it.lit = false; // the nodes go dark with the captions when the card lifts back off
          it.node?.removeAttribute('data-on');
        });
      if (landed) {
        applyTravel(state.q);
        items.forEach((it) => {
          if (it.cap && it.x0 < m.W * 0.85) {
            const tw = typeIn(it.cap);
            if (tw) late.push(tw);
          }
        });
      }
    }
    // the line's lead-in draws as the card lands
    if (p < 1) drawTo(fit(p, 0.9, 1) * (m.nodeX[0] ?? 0));
  }

  // ONE scrubbed driver for the entrance and the travel, so the card has always landed (p = 1) before
  // the track moves (q > 0), at any scroll speed and in both directions: P 0 -> split is the entrance,
  // split -> 1 the travel. (Two scrubbed tweens lagged independently, so the track could start sliding
  // while the GL plane was still mid-flight, and the plane drifted off its slot.)
  const state = { p: 0, q: 0, P: 0 };
  let split = 0.5; // the entrance's share of the driver's scroll; measured on refresh
  const setSplit = () => {
    const travelPx = parseFloat(section.style.getPropertyValue('--travel')) || 0;
    const e = innerHeight * ENTRANCE;
    split = e / Math.max(1, e + travelPx);
  };
  function drive() {
    const p = fit(state.P, 0, split);
    const qv = state.P <= split ? 0 : fit(state.P, split, 1);
    state.p = p;
    state.q = qv;
    applyEntrance(p);
    applyTravel(qv);
  }
  /* ---------- the pen lead: About's line runs on down the stage ---------- */
  const leadST = ScrollTrigger.create({
    trigger: section,
    start: `top ${PEN_HEAD * 100}%`,
    end: () => `top ${Math.round(innerHeight * PEN_HEAD - m.lead)}px`,
    invalidateOnRefresh: true,
    onUpdate: (st) => {
      leadP = st.progress;
      paint();
    },
    onRefresh: (st) => {
      leadP = st.progress;
      paint();
    },
  });

  /* ---------- travel ---------- */
  const setTrackX = gsap.quickSetter(track, 'x', 'px') as (v: number) => void;
  // The frames are promoted (will-change) so the focus scale is a compositor-only change. A promoted
  // layer keeps the raster scale of its first paint, so the first paint happens at scale 1 (sharp at
  // focus, a clean downsample elsewhere); the focus scale is armed a few frames later.
  let armed = false;
  late.push(
    gsap.delayedCall(0.3, () => {
      armed = true;
      applyTravel(state.q);
    }),
  );
  const power2 = gsap.parseEase('power2.out');
  function applyTravel(qv: number) {
    const x = -m.O * qv;
    setTrackX(x);
    setHeadX(x);
    const W = m.W;
    const band = BAND * W;
    items.forEach((it, i) => {
      const left = it.x0 + x;
      const cx = left + it.w / 2;
      let f = 1 - clamp01((Math.abs(cx - band) - 0.06 * W) / (0.5 * W));
      f = power2(f);
      if (i > 0 || state.p >= 1) {
        if (armed) it.setScale(0.86 + 0.14 * f);
        it.setDuo(1 - f);
      }
      const isHead = f > 0.6;
      if (isHead && landed) it.copy.play();
      if (isHead !== it.head) {
        it.head = isHead;
        it.node?.toggleAttribute('data-head', isHead);
      }
      if (it.cap && left < W * 0.85 && landed) {
        const tw = typeIn(it.cap);
        if (tw) late.push(tw);
      }
    });
    // the line runs a little ahead of the focus band, and reaches the end card at the end
    if (state.p >= 1 || qv > 0) {
      const hx = -x + gsap.utils.interpolate(0.44, 0.97, qv) * W;
      drawTo(hx);
      items.forEach((it, i) => {
        const on = hx >= m.nodeX[i] - 2;
        if (on !== it.lit) {
          it.lit = on;
          it.node?.toggleAttribute('data-on', on);
        }
      });
      allNode?.toggleAttribute('data-on', hx >= m.allX - 2);
      allNode?.toggleAttribute('data-head', hx >= m.allX - 2);
    }
  }

  const driver = gsap.to(state, {
    P: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
    onUpdate: drive,
  });

  const onRefreshInit = () => {
    measure();
    setSplit();
  };
  const onRefresh = () => drive();
  ScrollTrigger.addEventListener('refreshInit', onRefreshInit);
  ScrollTrigger.addEventListener('refresh', onRefresh);
  measure();
  setSplit();
  applyEntrance(0);
  applyTravel(0);

  /* ---------- the GL card: built lazily a screen before the section ---------- */
  let disposed = false;
  let loading = false;
  async function loadGL() {
    if (loading || disposed || !webglOK()) return;
    loading = true;
    const img = q<HTMLImageElement>(p1.frame, 'img[data-color]');
    const src = img?.currentSrc || img?.src;
    if (!src) return;
    const [mod, tex] = await Promise.all([
      import('./entrance-scene').catch(() => null),
      new Promise<HTMLImageElement | null>((res) => {
        const im = new Image();
        im.decoding = 'async';
        im.onload = () => res(im);
        im.onerror = () => res(null);
        im.src = src;
      }),
    ]);
    if (disposed || !mod || !tex) return;
    glScene = mod.createEntranceScene(glHost!, tex, {
      onLost: () => {
        glScene?.destroy();
        glScene = null;
        applyEntrance(state.p);
      },
    });
    if (!glScene) return;
    placeGL();
    glScene.setPose({ from: m.thumb, rot: (THUMB_ROT * Math.PI) / 180, to: m.slot, focus: focusOf(p1) });
    applyEntrance(lastP < 0 ? state.p : lastP);
  }
  const pre = ScrollTrigger.create({
    trigger: section,
    start: 'top bottom+=100%',
    end: 'bottom top',
    onToggle: (s) => s.isActive && loadGL(),
  });
  if (pre.isActive) loadGL();

  /* ---------- keyboard: bring a focused project (or the end card) into the focus band ---------- */
  const onFocus = (e: FocusEvent) => {
    const target = e.target as Element;
    const st = driver.scrollTrigger;
    if (!st) return;
    let qv: number | null = null;
    const art = target.closest('[data-item]');
    if (art) {
      const it = items.find((i) => i.frame.offsetParent === art);
      if (it) qv = m.O > 0 ? clamp01((it.x0 + it.w / 2 - BAND * m.W) / m.O) : 0;
    } else if (allEl.contains(target)) qv = 1;
    if (qv === null) return;
    const y = st.start + (split + qv * (1 - split)) * (st.end - st.start);
    if (Math.abs(scrollY - y) > 4) scrollToTarget(y, { immediate: true });
  };
  section.addEventListener('focusin', onFocus);

  return () => {
    disposed = true;
    section.removeEventListener('focusin', onFocus);
    ScrollTrigger.removeEventListener('refreshInit', onRefreshInit);
    ScrollTrigger.removeEventListener('refresh', onRefresh);
    pre.kill();
    leadST.kill();
    driver.scrollTrigger?.kill();
    driver.kill();
    late.forEach((t) => t.kill());
    release?.();
    glScene?.destroy();
    decode.revert();
    gsap.set([track, head, ...wordEls, ground, ...p1Text, glHost], { clearProps: 'all' });
    chip.style.clipPath = '';
    items.forEach((it) => {
      it.copy.revert();
      // only what this module wrote: the cells carry React's slot variables inline
      it.cell.style.removeProperty('clip-path');
      gsap.set([it.frame, it.media, it.par], { clearProps: 'transform,visibility' });
      if (it.duo) gsap.set(it.duo, { clearProps: 'opacity' });
      it.node?.removeAttribute('data-on');
      it.node?.removeAttribute('data-head');
      if (it.cap) {
        delete it.cap.dataset.typed;
        qa(it.cap, '[data-cap-text], [data-caret]').forEach((el) => gsap.set(el, { clearProps: 'all' }));
      }
    });
    allNode?.removeAttribute('data-on');
    allNode?.removeAttribute('data-head');
    line.removeAttribute('style');
    line.setAttribute('d', '');
    section.style.removeProperty('--travel');
    delete section.dataset.strip;
  };
}

function focusOf(it: { frame: HTMLElement }): [number, number, number] {
  const img = it.frame.querySelector<HTMLImageElement>('img[data-color]');
  if (!img) return [0.5, 0.5, 1];
  const [x, y] = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
  const z = parseFloat(getComputedStyle(img).scale) || 1;
  return [Number.isFinite(x) ? x : 0.5, Number.isFinite(y) ? y : 0.5, z];
}

/* ---------------------------------------------------------------- phones */

function initPhone(section: HTMLElement) {
  const late: gsap.core.Animation[] = [];
  const cells = qa(section, '[data-item]');
  const track = q(section, '[data-track]');
  const head = q(section, '[data-head]');
  const decode = makeDecode(qa(section, '[data-word]'));
  if (head) ScrollTrigger.create({ trigger: head, start: 'top 75%', once: true, onEnter: () => decode.play() });

  cells.forEach((el, i) => {
    const media = q(el, '[data-media]');
    const duo = q(el, '[data-duo]');
    const cap = q(el, '[data-cap]');
    const node = q(el, '[data-node]');
    if (i === 0 && media) {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: media, start: 'top 85%', end: 'top 35%', scrub: 0.6 },
      });
      tl.fromTo(media, { clipPath: 'polygon(6% 10%, 100% 0%, 94% 100%, 0% 92%)' }, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }, 0);
      if (duo) tl.fromTo(duo, { opacity: 1 }, { opacity: 0 }, 0);
    } else if (media && duo) {
      gsap.fromTo(
        duo,
        { opacity: 1 },
        { opacity: 0, ease: 'none', scrollTrigger: { trigger: media, start: 'top 75%', end: 'center 55%', scrub: 0.6 } },
      );
    }
    if (cap) {
      hideCaption(cap);
      ScrollTrigger.create({
        trigger: cap,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          const tw = typeIn(cap);
          if (tw) late.push(tw);
        },
      });
    }
    if (node) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 70%',
        onToggle: (s) => {
          node.toggleAttribute('data-on', s.isActive || s.progress > 0);
          node.toggleAttribute('data-head', s.isActive);
        },
        end: 'bottom 70%',
      });
    }
  });
  const allNode = q(section, '[data-all] [data-node]');
  if (allNode)
    ScrollTrigger.create({
      trigger: allNode,
      start: 'top 70%',
      onToggle: (s) => {
        allNode.toggleAttribute('data-on', s.progress > 0 || s.isActive);
        allNode.toggleAttribute('data-head', s.progress > 0 || s.isActive);
      },
    });
  const rail = q(section, '[data-rail]');
  if (track && rail) {
    gsap.fromTo(
      rail,
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', scrollTrigger: { trigger: track, start: 'top 70%', end: 'bottom 70%', scrub: 0.6 } },
    );
  }

  return () => {
    late.forEach((t) => t.kill());
    decode.revert();
    if (rail) gsap.set(rail, { clearProps: 'transform' });
    qa(section, '[data-node]').forEach((n) => {
      n.removeAttribute('data-on');
      n.removeAttribute('data-head');
    });
    qa(section, '[data-cap]').forEach((c) => {
      delete c.dataset.typed;
      qa(c, '[data-cap-text], [data-caret]').forEach((el) => gsap.set(el, { clearProps: 'all' }));
    });
  };
}
