'use client';
// The hero's one driver (see Hero.tsx for the story). A few numbers (reach r, settle s, expand e,
// name progress q) place every layer through apply() / placeNames(), so the card, portrait, name
// copies, header, signature and captions can never drift apart. One scrubbed timeline sets them.
// Clock: the hero ScrollTrigger (scrub) + the GSAP ticker for the idle row drift and the contours
// (30 fps, only while the hero is on screen). Reduced motion: the landing stays still, contours drawn once.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { usePage } from '@/engine/next';
import { ease, prefersReducedMotion } from '@/engine';
import { makeContours } from './contours';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const NOISE = '01{}/=_;$#<>';
const TILT = -10;
/** Signature width as a share of the card: it overruns the card (bolder than the frame). */
const SIG = { desk: 1.34, phone: 1.12 };
/** The rows stop this far short of the card on both sides. */
const GAP = 24;

type Box = { x: number; y: number; w: number; h: number };

export function HeroMotion() {
  usePage(() => {
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    const stage = hero?.querySelector<HTMLElement>('[data-hero-stage]');
    const canvas = hero?.querySelector<HTMLCanvasElement>('[data-bg]');
    if (!hero || !stage || !canvas) return;
    const bg = makeContours(canvas);

    if (prefersReducedMotion() || !document.documentElement.classList.contains('motion')) {
      bg.draw(); // a still survey sheet
      const onResize = () => {
        bg.size();
        bg.draw();
      };
      addEventListener('resize', onResize);
      return () => removeEventListener('resize', onResize);
    }

    const q = <T extends Element = HTMLElement>(s: string) => stage.querySelector<T>(s)!;
    const qa = <T extends Element = HTMLElement>(s: string, root: ParentNode = stage) => [...root.querySelectorAll<T>(s)];
    const card = q('[data-card]');
    const inkCopy = q('[data-copy="card"]');
    const creamCopy = q('[data-copy="photo"]');
    const photoLayer = q('[data-photo-layer]');
    const photo = q('[data-photo]');
    const bw = q('[data-bw]');
    const given = q('[data-given]');
    const header = q('[data-header]');
    const sig = q<SVGSVGElement>('[data-sig]');
    const startCap = q('[data-caption="start"]');
    const endCap = q('[data-caption="end"]');
    const cue = q('[data-cue]');
    const rowName = q('[data-row="name"]');
    const rowsLayer = rowName.parentElement as HTMLElement;
    const rowStack = q('[data-row="stack"]');
    const [trackN, trackS] = qa('[data-track]');
    const headN = q('[data-head="name"]');
    const headS = q('[data-head="stack"]');
    const from = headS.dataset.from ?? '';
    const to = headS.dataset.to ?? '';
    headS.textContent = from; // the server HTML draws it from data-deco; from here on it is real text
    headS.removeAttribute('data-deco');
    const firsts = qa('[data-word="first"]');
    const lasts = qa('[data-word="last"]');
    const words = [...firsts, ...lasts];
    const chars = qa('[data-ch]', header);
    const label = header.firstElementChild as HTMLElement; // "// " + MUHAMMAD + " TALIB IBRAHIM"
    const slashCh = qa('[data-ch]', label.firstElementChild!);
    const nameCh = [...label.children].filter((c): c is HTMLElement => c.hasAttribute('data-ch'));
    const signCh = qa('[data-ch]', header.lastElementChild!);
    const strokes = qa<SVGPathElement>('[data-stroke]', sig);
    const nibs = qa<SVGPathElement>('[data-nib]', sig);
    const dots = qa<SVGCircleElement>('[data-dot]', sig);

    /* ------------------------------------------------------------ geometry */
    const drv = { r: 0, s: 0, e: 0, live: 0, shift: 0 };
    const clipCache = { n: '', s: '', ink: '', photo: '', cream: '' };
    let bgLive = false;
    const nm = { q: 0 };
    const clipN = { a: 0, b: 0 };
    const clipS = { a: 0, b: 0 };
    let G = {
      W: 0, H: 0, mob: false, gut: 0, cx: 0, cy: 0,
      p0: { x: 0, y: 0, w: 0, h: 0 } as Box, p1: { x: 0, y: 0, w: 0, h: 0 } as Box,
      c0: { x: 0, y: 0, w: 0, h: 0 } as Box, c1: { x: 0, y: 0, w: 0, h: 0 } as Box,
      first: { x0: 0, y0: 0, x1: 0, y1: 0, s1: 1, f: 1, l: 0, t: 0, w: 0 }, last: { x0: 0, y0: 0, x1: 0, y1: 0, s1: 1, f: 1, l: 0, t: 0, w: 0 },
      hN: { x: 0, w: 0 }, hS: { x: 0, w: 0 }, baseN: 0, baseS: 0, wN: 1, wS: 1,
      hdr: { w: 0, h: 0 }, end: { w: 0, h: 0 }, sigW: 0, sigH: 0,
    };
    const card0: Box = { x: 0, y: 0, w: 0, h: 0 };

    function measure() {
      const W = stage!.clientWidth, H = stage!.clientHeight, mob = W < 768;
      const gut = parseFloat(getComputedStyle(stage!).getPropertyValue('--gutter')) || 24;
      // start: the landing exactly as CSS lays it out (offset boxes ignore the intro's translate)
      const p0 = { x: photo.offsetLeft, y: photo.offsetTop, w: photo.offsetWidth, h: photo.offsetHeight };
      const c0 = { x: card.offsetLeft, y: card.offsetTop, w: card.offsetWidth, h: card.offsetHeight };
      // end: a centred landscape frame (phone: near-square)
      const cw = mob ? 0.86 * W : Math.min(0.4 * W, 1.55 * 0.44 * H);
      const ch = mob ? Math.min(0.46 * H, cw * 1.15) : cw / 1.55;
      const cy = mob ? 0.48 * H : 0.5 * H;
      const c1 = { x: (W - cw) / 2, y: cy - ch / 2, w: cw, h: ch };
      // portrait framed head-and-shoulders: the head just under the frame's top edge
      const ph1 = Math.max(p0.h, (mob ? 1.85 : 2.0) * ch);
      const p1 = { x: (W - (ph1 * p0.w) / p0.h) / 2, y: c1.y + 0.06 * ch - 0.022 * ph1, w: (ph1 * p0.w) / p0.h, h: ph1 };

      // rows: desktop = a band over the top half of the frame (the signature's tail ends below it);
      // phone = one row above the frame, one under the captions
      const fN = parseFloat(getComputedStyle(rowName).fontSize);
      endCap.style.display = 'grid'; // measured while it has a box; the timeline owns its display
      const endH = endCap.offsetHeight, endW = endCap.offsetWidth;
      endCap.style.removeProperty('display');
      const nTop = mob ? c1.y - fN - 46 : c1.y + 0.04 * ch;
      const sTop = mob ? c1.y + ch + 16 + endH + 24 : nTop + fN * 1.02;
      rowName.style.top = `${nTop}px`;
      rowStack.style.top = `${sTop}px`;
      const copiesN = qa('[data-copy-n]', rowName), copiesS = qa('[data-copy-s]', rowStack);
      const wN = copiesN[1].offsetLeft - copiesN[0].offsetLeft;
      const wS = copiesS[1].offsetLeft - copiesS[0].offsetLeft;
      // heads: "Talib" lands on the left gutter, the pixel head on the right gutter
      const baseN = gut - headN.offsetLeft;
      const baseS = W - gut - (headS.offsetLeft + headS.offsetWidth);
      const hN = { x: headN.offsetLeft + baseN, w: headN.offsetWidth };
      const hS = { x: headS.offsetLeft + baseS, w: headS.offsetWidth };

      // the giant words land on the heads: same font-size ratio, line-box centres matched
      const word = (el: HTMLElement, right: boolean, head: { x: number; w: number }, rowTop: number, rowFont: number) => {
        const f = parseFloat(getComputedStyle(el).fontSize);
        const x0 = right ? el.offsetLeft + el.offsetWidth : el.offsetLeft;
        const y0 = el.offsetTop + (0.86 * f) / 2;
        return { x0, y0, x1: right ? head.x + head.w : head.x, y1: rowTop + rowFont / 2, s1: rowFont / f, f, l: el.offsetLeft, t: el.offsetTop, w: el.offsetWidth };
      };
      const fS = parseFloat(getComputedStyle(rowStack).fontSize);
      const sigW = (mob ? SIG.phone : SIG.desk) * cw;

      G = {
        W, H, mob, gut, cx: W / 2, cy, p0, p1, c0, c1,
        first: word(firsts[0], false, hN, nTop, fN),
        last: word(lasts[0], true, hS, sTop, fS),
        hN, hS, baseN, baseS, wN, wS,
        hdr: { w: header.offsetWidth, h: header.offsetHeight }, end: { w: endW, h: endH },
        sigW, sigH: (sigW * 340) / 1100,
      };
      gsap.set(sig, { width: G.sigW, height: G.sigH });
      Object.assign(clipCache, { n: '', s: '', ink: '', photo: '', cream: '' });
      apply();
      placeNames();
      placeRows();
      clipRows();
      bg.size();
      if (bgLive) bg.draw();
    }

    /* ------------------------------------------------------------ placement */
    function apply() {
      const { p0, p1, c0, c1, cx, cy, W, H } = G;
      if (!W) return;
      const r = drv.r, k = 1 - 0.1 * drv.s, e = drv.e;
      const about = (v: number, o: number) => o + (v - o) * k;
      let x = about(lerp(c0.x, c1.x, r), cx), y = about(lerp(c0.y, c1.y, r), cy);
      let w = lerp(c0.w, c1.w, r) * k, h = lerp(c0.h, c1.h, r) * k;
      // expand: the signed card grows to full bleed (the About paper)
      x = lerp(x, 0, e); y = lerp(y, 0, e); w = lerp(w, W, e); h = lerp(h, H, e);
      Object.assign(card0, { x, y, w, h });
      const X = Math.round(x), Y = Math.round(y), R = Math.round(W - x - w), B = Math.round(H - y - h);
      gsap.set(card, { x: x - c0.x, y: y - c0.y, scaleX: w / c0.w, scaleY: h / c0.h });
      const box = `inset(${Y}px ${R}px ${B}px ${X}px)`;
      if (nm.q < 1 && box !== clipCache.ink) inkCopy.style.clipPath = clipCache.ink = box;
      // the head is free above the card (the landing look); the card crops the sides and bottom
      const open = `inset(0px ${R}px ${B}px ${X}px)`;
      // clip-path writes re-raster the layer: only when the card has actually moved a pixel
      if (open !== clipCache.photo) photoLayer.style.clipPath = clipCache.photo = open;
      const pTop = about(lerp(p0.y, p1.y, r), cy), pH = lerp(p0.h, p1.h, r) * k;
      gsap.set(photo, { y: pTop - p0.y, scale: pH / p0.h });
      // the colour copies only exist until the names hand over to the rows: stop repainting them after
      if (nm.q < 1) {
        if (open !== clipCache.cream) creamCopy.style.clipPath = clipCache.cream = open;
        const pw = (p0.w * pH) / p0.h;
        const mp = `${(cx - pw / 2).toFixed(1)}px ${pTop.toFixed(1)}px`, ms = `${pw.toFixed(1)}px ${pH.toFixed(1)}px`;
        creamCopy.style.setProperty('-webkit-mask-position', mp);
        creamCopy.style.setProperty('mask-position', mp);
        creamCopy.style.setProperty('-webkit-mask-size', ms);
        creamCopy.style.setProperty('mask-size', ms);
      }
      // header rides the frame's top edge, the end caption its bottom edge (both centred)
      const top = about(c1.y, cy), bottom = about(c1.y + c1.h, cy);
      gsap.set(header, { x: cx - G.hdr.w / 2, y: top - (G.mob ? 14 : 22) - G.hdr.h });
      gsap.set(endCap, { x: G.mob ? G.gut : cx - G.end.w / 2, y: bottom + 16 });
      // signature: centred on the frame, in its lower third, tilted, scaled with it
      gsap.set(sig, {
        x: cx - G.sigW / 2,
        y: cy + 0.16 * (c1.h * k) - G.sigH / 2,
        scale: k,
        rotation: TILT,
        transformOrigin: '50% 50%',
      });
      clipRows();
    }

    function placeNames() {
      if (!G.W) return;
      const qq = nm.q;
      const MID = 0.6, Q = 0.5; // both words share one scale curve down to MID (same cap height mid-scroll)
      for (const [els, n, right] of [[firsts, G.first, false], [lasts, G.last, true]] as const) {
        const sc = qq < Q ? lerp(1, MID, qq / Q) : lerp(MID, n.s1, (qq - Q) / (1 - Q));
        const ax = lerp(n.x0, n.x1, qq), ay = lerp(n.y0, n.y1, qq);
        // the anchor (left or right glyph edge, line centre) follows the path; origin is the box corner
        const x = right ? ax - (n.l + n.w) : ax - n.l;
        const y = ay - n.t - (sc * 0.86 * n.f) / 2;
        gsap.set(els, { x, y, scale: sc });
        if (!right) gsap.set(given, { x, y }); // MUHAMMAD rides Talib's top-left corner
      }
    }

    const setTrackN = gsap.quickSetter(trackN, 'x', 'px') as (v: number) => void;
    const setTrackS = gsap.quickSetter(trackS, 'x', 'px') as (v: number) => void;
    let idle = 0, vel = 0;
    function placeRows() {
      const off = drv.live * (idle + drv.shift);
      setTrackN(G.baseN - (((off % G.wN) + G.wN) % G.wN));
      setTrackS(G.baseS + (((off % G.wS) + G.wS) % G.wS));
    }

    /** Each row: a near segment growing out of its head, and a far segment past the card (a hole
     *  where the card sits, so no glyph is ever sliced against the frame). */
    function clipRows() {
      if (!G.W) return;
      const { W, mob } = G;
      const gapL = mob ? W / 2 : card0.x - GAP, gapR = mob ? W / 2 : card0.x + card0.w + GAP;
      const poly = (a0: number, a1: number, b0: number, b1: number) =>
        `polygon(${a0}px 0, ${a1}px 0, ${a1}px 100%, ${b0}px 100%, ${b0}px 0, ${b1}px 0, ${b1}px 100%, ${a0}px 100%)`;
      // name row: head at the left gutter, opens left/right inside [0, gapL], then [gapR, W]
      const nL = lerp(G.hN.x, 0, clipN.a), nR = lerp(G.hN.x + G.hN.w, mob ? W : gapL, clipN.a);
      const nF = mob ? W : lerp(gapR, W, clipN.b);
      const cn = poly(nL, nR, mob ? W : gapR, nF);
      if (cn !== clipCache.n) rowName.style.clipPath = clipCache.n = cn; // never rewrite an unchanged clip
      // stack row: head at the right gutter, opens inside [gapR, W], then [0, gapL]
      const sR = lerp(G.hS.x + G.hS.w, W, clipS.a), sL = lerp(G.hS.x, mob ? 0 : gapR, clipS.a);
      const sF = mob ? 0 : lerp(gapL, 0, clipS.b);
      const cs = poly(sF, mob ? 0 : gapL, sL, sR);
      if (cs !== clipCache.s) rowStack.style.clipPath = clipCache.s = cs;
    }


    const dec = { p: 0 };
    function decode() {
      const p = dec.p, n = to.length;
      let s = '';
      for (let i = 0; i < n; i++) {
        const t0 = (i / n) * 0.75, t1 = t0 + 0.25; // a two-glyph window of noise walks across: the rest stays readable
        s += p >= t1 ? to[i] : p >= t0 ? NOISE[(i * 7 + Math.floor(p * 60)) % NOISE.length] : from[i];
      }
      headS.textContent = s;
    }

    /* ------------------------------------------------------------ timeline */
    gsap.set(strokes.concat(nibs), { drawSVG: '0% 0%', visibility: 'hidden' });
    gsap.set(dots, { scale: 0, transformOrigin: '50% 50%', visibility: 'hidden' });
    const soft = ease.soft;
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
    tl.fromTo(cue, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.5 }, 0)
      .fromTo(startCap, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.45, ease: soft }, 0.1)
      // 1. the card closes into the frame, the portrait drops in
      .fromTo(drv, { r: 0 }, { r: 1, duration: 3, ease: ease.inOut, onUpdate: apply }, 0)
      // 2. the name shrinks into the row heads, dimming on the card's curve
      .fromTo(nm, { q: 0 }, { q: 1, duration: 2.6, ease: 'power2.inOut', onUpdate: placeNames }, 0)
      .fromTo(firsts, { opacity: 1 }, { opacity: 0.6, duration: 2.6, ease: ease.inOut }, 0)
      .fromTo(lasts, { opacity: 1 }, { opacity: 0.7, duration: 2.6, ease: ease.inOut }, 0)
      .fromTo(given, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.4, ease: soft }, 1.05)
      // hand-over: the giant words become the row heads they landed on
      .set(words, { visibility: 'hidden' }, 2.6)
      .set([rowName, rowStack], { visibility: 'visible' }, 2.6)
      .fromTo(dec, { p: 0 }, { p: 1, duration: 0.9, onUpdate: decode }, 2.6)
      .fromTo(clipN, { a: 0 }, { a: 1, duration: 1.7, ease: soft, onUpdate: clipRows }, 2.65)
      .fromTo(clipS, { a: 0 }, { a: 1, duration: 1.7, ease: soft, onUpdate: clipRows }, 3.0)
      .fromTo(clipN, { b: 0 }, { b: 1, duration: 1.2, ease: soft, onUpdate: clipRows }, 3.4)
      .fromTo(clipS, { b: 0 }, { b: 1, duration: 1.2, ease: soft, onUpdate: clipRows }, 3.5)
      // the card header: MUHAMMAD comes back on top of the frame and types out the name
      .fromTo(header, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 2.9)
      .set(slashCh, { visibility: 'visible', stagger: 0.07 }, 3.0)
      .set(nameCh, { visibility: 'visible', stagger: 0.045 }, 3.25)
      .set(endCap, { display: 'grid' }, 2.94)
      .fromTo(endCap, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: soft }, 2.95)
      // rows come alive and drift with the scroll
      .fromTo(drv, { live: 0 }, { live: 1, duration: 0.01, immediateRender: false, onUpdate: placeRows }, 2.95)
      .fromTo(drv, { shift: 0 }, { shift: () => G.W * 0.42, duration: 7, onUpdate: placeRows }, 3)
      // 3. the frame settles while it is signed; rows step back; the portrait goes black and white
      .fromTo(drv, { s: 0 }, { s: 1, duration: 5.6, ease: soft, onUpdate: apply, immediateRender: false }, 4.4)
      .fromTo(rowsLayer, { opacity: 1 }, { opacity: 0.45, duration: 0.9, ease: soft }, 4.4)
      // the B&W copy is out of rendering until its crossfade, so the compositor carries one portrait
      .fromTo(bw, { display: 'none' }, { display: 'block', duration: 0.01, immediateRender: true }, 4.39)
      .fromTo(bw, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: soft, immediateRender: false }, 4.4)
      .set(sig, { visibility: 'visible' }, 4.8);
    // the signature, stroke by stroke (each with its nib pass), then the two tittles
    const dur = [1.6, 1.6, 1.05];
    let t = 4.8;
    strokes.forEach((p, i) => {
      const pair = [p, nibs[i]];
      tl.set(pair, { visibility: 'visible' }, t).to(pair, { drawSVG: '0% 100%', duration: dur[i] ?? 1.2, ease: 'power1.inOut' }, t);
      t += (dur[i] ?? 1.2) + 0.08;
    });
    dots.forEach((d, i) =>
      tl.set(d, { visibility: 'visible' }, t + i * 0.18).to(d, { scale: 1, duration: 0.25, ease: 'back.out(3)' }, t + i * 0.18),
    );
    tl.set(signCh, { visibility: 'visible', stagger: 0.035 }, t + 0.5);
    // 4. hold the signed card, then it grows into the page
    const E = t + 1.4;
    tl.to([photo, sig, header, endCap], { autoAlpha: 0, duration: 0.7, ease: soft }, E)
      .fromTo(drv, { e: 0 }, { e: 1, duration: 2, ease: ease.wipe, onUpdate: apply, immediateRender: false }, E)
      .to({}, { duration: 0.3 });

    measure();
    const st = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      animation: tl,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        vel = self.getVelocity();
        bg.state.scroll = self.progress * 160;
      },
    });
    // handoff: once the card is paper, the stage steps away and About (already underneath) is the page
    ScrollTrigger.create({
      trigger: hero,
      start: 'bottom bottom',
      onEnter: () => gsap.set(stage, { autoAlpha: 0 }),
      onLeaveBack: () => gsap.set(stage, { autoAlpha: 1 }),
    });
    const onRefreshInit = () => measure();
    ScrollTrigger.addEventListener('refreshInit', onRefreshInit);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // One clock. The rows drift (faster with scroll velocity) whenever they are on screen.
    // The contours start after the intro (the first paint and the portrait own the main thread) and
    // then only move while the visitor does: scroll or pointer input sets the drift going, and it eases
    // to a stop ~2.5 s after the last input, so the first screen rests as a still poster. Phones draw
    // the sheet once and never redraw it per frame (the scrub owns their frame budget).
    const every = 3; // 20 fps while drifting
    let frame = 0, acc = 0, act = 0, lastInput = 0, drawnScroll = -1;
    const poke = () => {
      lastInput = performance.now();
    };
    addEventListener('pointermove', poke, { passive: true });
    const tick = (_time: number, dt: number) => {
      const visible = st.isActive || scrollY < (st.start || 0) + 4;
      if (!visible || drv.e >= 0.999) return;
      idle += 0.045 * dt * (1 + Math.min(Math.abs(vel) / 700, 4));
      vel *= 0.92;
      if (drv.live) placeRows();
      if (!bgLive || G.mob) return;
      if (Math.abs(vel) > 1) poke();
      const target = performance.now() - lastInput < 2500 ? 1 : 0;
      act += (target - act) * Math.min(1, dt / 600);
      acc += dt;
      if (frame++ % every) return;
      const moved = Math.abs(bg.state.scroll - drawnScroll) > 0.5;
      if (act < 0.01 && !moved) {
        acc = 0;
        return; // at rest: nothing to redraw
      }
      bg.state.t += acc * 0.00009 * act;
      acc = 0;
      bg.state.labels = drv.e < 0.5;
      drawnScroll = bg.state.scroll;
      bg.draw();
    };
    gsap.ticker.add(tick);
    const startBg = gsap.delayedCall(1.4, () => {
      bgLive = true;
      bg.draw();
      canvas.dataset.live = '';
    });

    return () => {
      removeEventListener('pointermove', poke);
      startBg.kill();
      delete canvas.dataset.live;
      gsap.ticker.remove(tick);
      ScrollTrigger.removeEventListener('refreshInit', onRefreshInit);
      st.kill();
      tl.kill();
      for (const el of [inkCopy, photoLayer, rowName, rowStack]) el.style.removeProperty('clip-path');
      for (const p of ['clip-path', '-webkit-mask-position', 'mask-position', '-webkit-mask-size', 'mask-size'])
        creamCopy.style.removeProperty(p);
      rowName.style.removeProperty('top');
      rowStack.style.removeProperty('top');
      headS.textContent = from;
      gsap.set([stage, card, photo, bw, given, header, sig, startCap, endCap, cue, rowsLayer, rowName, rowStack, trackN, trackS, creamCopy, ...words, ...chars, ...strokes, ...nibs, ...dots], {
        clearProps: 'transform,opacity,visibility,width,height,display',
      });
    };
  });

  return null;
}
