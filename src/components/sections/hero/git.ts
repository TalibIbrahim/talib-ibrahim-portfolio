// The hero's end state (desktop): the signature's last stroke runs on into a commit line. One main line
// (education, the trunk), one branch per role that forks off and merges back, a project committed on a
// branch where the data says so, then HEAD. The markup is server-rendered by Hero.tsx (labels draw their
// text from data-deco); this module only places it, draws it and pops each commit as the pen passes.
//   motion  draw(p, q): p is the pen's progress along the main line (branches draw up to the same x,
//           commits pop with their labels as the head passes them), q the line running on from HEAD
//           down and back to About's margin, so About's pen line picks it up at the stage's bottom edge.
//   static  reduced motion: everything drawn and shown at once (layout, then setStatic()).
// No own clock: draw() is called from the hero's scrubbed timeline; the HEAD ring's breath is a tween the
// hero's ticker pauses off screen.
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ease } from '@/engine';

gsap.registerPlugin(DrawSVGPlugin, ScrambleTextPlugin);

const NS = 'http://www.w3.org/2000/svg';
const NOISE = '#_/=+01';
/** Layout units: the main line runs from U0 (the first commit) to U1 (HEAD); branches share U0..UB. */
const U0 = 500, UB = 1330, U1 = 1390;

export type GitLayout = {
  x0: number; // where the pen lifts (the main line starts here)
  lead?: number; // run-on before the first commit (the signature's tail; 0 when there is no signature)
  my: number; // main line y
  hx: number; // HEAD x
  lane: number; // branch lane offset above the main line
  ret: { y: number; x: number; bottom: number } | null; // the run-on to About's margin, or none
};

type Table = { L: number; x: Float32Array; l: Float32Array };
function table(p: SVGPathElement, n = 240): Table {
  const L = p.getTotalLength();
  const x = new Float32Array(n + 1);
  const l = new Float32Array(n + 1);
  for (let i = 0; i <= n; i++) {
    l[i] = (L * i) / n;
    x[i] = p.getPointAtLength(l[i]).x;
  }
  return { L, x, l };
}
/** Length along a path (monotonic in x) where it first reaches x = v. */
function lenAt(T: Table, v: number) {
  const { x, l } = T;
  const n = x.length - 1;
  if (v <= x[0]) return 0;
  if (v >= x[n]) return T.L;
  let lo = 0, hi = n;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (x[m] < v) lo = m;
    else hi = m;
  }
  const f = x[hi] === x[lo] ? 1 : (v - x[lo]) / (x[hi] - x[lo]);
  return l[lo] + (l[hi] - l[lo]) * f;
}
function drawL(el: SVGPathElement, len: number) {
  if (len < 0.5) gsap.set(el, { visibility: 'hidden' });
  else gsap.set(el, { visibility: 'visible', drawSVG: `0 ${len}` });
}
const make = <K extends keyof SVGElementTagNameMap>(tag: K, cls: string) => {
  const e = document.createElementNS(NS, tag);
  e.setAttribute('class', cls);
  return e;
};

type Label = { el: HTMLElement; lane: number; branch: number; kind: string };
type Item = { x: number; on: boolean; tl: gsap.core.Timeline };

export function makeGit(root: HTMLElement, cls: Record<string, string>) {
  const svg = root.querySelector<SVGSVGElement>('svg')!;
  const cmd = root.querySelector<HTMLElement>('[data-git-cmd]');
  const signed = root.querySelector<HTMLElement>('[data-git-signed]');
  const head = root.querySelector<HTMLElement>('[data-git-head]')!;
  const refEl = head.querySelector<HTMLElement>('[data-git-ref]')!;
  const labels: Label[] = [...root.querySelectorAll<HTMLElement>('[data-git-label]')].map((el) => ({
    el,
    lane: Number(el.dataset.lane),
    branch: Number(el.dataset.branch),
    kind: el.dataset.kind ?? '',
  }));
  const nBranch = Math.max(0, ...labels.map((l) => l.branch + 1));

  // text that animates character by character is real text from here on (CSS drew it until now)
  const texts = [cmd, signed, refEl, ...labels.map((l) => l.el.querySelector<HTMLElement>('[data-git-date]'))].filter(
    (e): e is HTMLElement => !!e,
  );
  const finals = texts.map((e) => e.dataset.deco ?? '');
  texts.forEach((e, i) => {
    e.textContent = finals[i];
    e.dataset.text = '';
  });

  // the drawing: built once, placed by layout()
  const main = make('path', cls.gl);
  const ret = make('path', cls.gl);
  const branches = Array.from({ length: nBranch }, () => make('path', cls.gl));
  const merges = Array.from({ length: nBranch }, () => make('circle', `${cls.gnode} ${cls.merge}`));
  const nodes = labels.map((l) => make('circle', `${cls.gnode}${l.kind === 'proj' ? ` ${cls.fill}` : ''}`));
  const headNode = make('circle', `${cls.gnode} ${cls.fill}`);
  const ring = make('circle', cls.gring);
  svg.append(main, ...branches, ret, ...merges, ...nodes, ring, headNode);
  gsap.set([main, ret, ...branches], { visibility: 'hidden' });
  gsap.set([...merges, ...nodes, headNode, ring], { scale: 0, transformOrigin: '50% 50%' });

  const nodeTl = (node: SVGCircleElement, label: HTMLElement | null) => {
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(node, { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(2.5)' }, 0);
    if (!label) return tl;
    tl.fromTo(label, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0);
    const d = label.querySelector<HTMLElement>('[data-git-date]');
    if (d) tl.to(d, { scrambleText: { text: d.dataset.deco ?? '', chars: NOISE, speed: 0.6 }, duration: 0.45, ease: 'none' }, 0);
    const rise = label.querySelectorAll('[data-mi]');
    if (rise.length) tl.fromTo(rise, { yPercent: 112 }, { yPercent: 0, duration: 0.8, stagger: 0.06, ease: ease.out }, 0.06);
    return tl;
  };
  const items: Item[] = labels.map((l, i) => ({ x: 0, on: false, tl: nodeTl(nodes[i], l.el) }));
  const mergeItems: Item[] = merges.map((m) => ({ x: 0, on: false, tl: nodeTl(m, null) }));
  const refText = refEl.dataset.deco ?? '';
  const typed = { n: 0 };
  const headTl = gsap
    .timeline({ paused: true })
    .fromTo(head, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0)
    .fromTo(headNode, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, 0)
    .fromTo(ring, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 0.5, duration: 0.8, ease: ease.out }, 0.05)
    .fromTo(
      typed,
      { n: 0 },
      { n: refText.length, duration: 0.55, ease: 'none', onUpdate: () => void (refEl.textContent = refText.slice(0, Math.round(typed.n))) },
      0.1,
    )
    .fromTo(head.querySelectorAll('[data-mi]'), { yPercent: 112 }, { yPercent: 0, duration: 0.8, stagger: 0.08, ease: ease.out }, 0.45);
  const headItem: Item = { x: 0, on: false, tl: headTl };
  const all = [...items, ...mergeItems, headItem];
  gsap.set([...labels.map((l) => l.el), head], { autoAlpha: 0 });
  const breath = gsap.to(ring, { scale: 1.3, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true });

  let T = { x0: 0, hx: 0, br: [] as Table[], ret: null as Table | null };

  function layout(L: GitLayout) {
    const { x0, my, hx, lane } = L;
    const ly = my - lane;
    const ux = x0 + (L.lead ?? 18);
    const X = (u: number) => ux + ((u - U0) * (hx - ux)) / (U1 - U0);
    main.setAttribute('d', `M ${x0.toFixed(1)} ${my.toFixed(1)} H ${hx.toFixed(1)}`);

    // branches share U0..UB by weight (their commits + 1); each forks, runs its lane, merges back
    const per = Array.from({ length: nBranch }, (_, b) => labels.filter((l) => l.branch === b && l.lane === 1));
    const weights = per.map((p) => p.length + 1);
    const sum = weights.reduce((a, b) => a + b, 0) || 1;
    let base = U0;
    const nodeU = new Map<Label, number>();
    per.forEach((list, b) => {
      const w = ((UB - U0) * weights[b]) / sum;
      const f = b === 0 ? U0 : base + 20;
      const ls = f + 60;
      list.forEach((l, i) => nodeU.set(l, ls + 15 + i * 160));
      const le = Math.max(ls + 15 + (list.length - 1) * 160 + 40, base + w - 50);
      const m = le + 50;
      branches[b].setAttribute(
        'd',
        `M ${X(f)} ${my} C ${X(f + 30)} ${my} ${X(f + 30)} ${ly} ${X(ls)} ${ly} H ${X(le)} C ${X(le + 25)} ${ly} ${X(m - 25)} ${my} ${X(m)} ${my}`,
      );
      merges[b].setAttribute('cx', `${X(m)}`);
      merges[b].setAttribute('cy', `${my}`);
      merges[b].setAttribute('r', '3.5');
      mergeItems[b].x = X(m);
      base += w;
    });
    // the trunk's own commits sit on the main line, left to right from U0
    labels.filter((l) => l.lane === 0).forEach((l, i) => nodeU.set(l, U0 + i * 170));

    labels.forEach((l, i) => {
      const x = X(nodeU.get(l) ?? U0);
      const y = l.lane ? ly : my;
      nodes[i].setAttribute('cx', `${x}`);
      nodes[i].setAttribute('cy', `${y}`);
      nodes[i].setAttribute('r', '6');
      items[i].x = x;
      Object.assign(l.el.style, { left: `${x - 5}px`, top: `${l.lane ? ly - 16 : my + 18}px` });
      if (l.lane) l.el.dataset.up = '';
      else delete l.el.dataset.up;
    });
    headNode.setAttribute('cx', `${hx}`);
    headNode.setAttribute('cy', `${my}`);
    headNode.setAttribute('r', '8');
    ring.setAttribute('cx', `${hx}`);
    ring.setAttribute('cy', `${my}`);
    ring.setAttribute('r', '15');
    headItem.x = hx;
    Object.assign(head.style, { left: `${hx - 20}px`, top: `${my + 18}px` });

    // the command over the first commit, the signature's hash over HEAD, both above the tallest lane label
    const tall = Math.max(0, ...labels.filter((l) => l.lane).map((l) => l.el.offsetHeight));
    const top = ly - 16 - tall - 28;
    if (cmd) Object.assign(cmd.style, { left: `${X(U0) - 5}px`, top: `${top}px` });
    if (signed) Object.assign(signed.style, { left: `${hx + 8}px`, top: `${top}px` });

    // the run-on: down from HEAD, back along the bottom to About's margin, down off the stage edge
    if (L.ret) {
      const { y, x, bottom } = L.ret;
      const r = Math.min(28, (bottom - y) / 2, (y - my) / 2);
      ret.setAttribute(
        'd',
        `M ${hx} ${my} V ${y - r} Q ${hx} ${y} ${hx - r} ${y} H ${x + r} Q ${x} ${y} ${x} ${y + r} V ${bottom}`,
      );
    } else ret.setAttribute('d', '');

    T = { x0, hx, br: branches.map((b) => table(b)), ret: L.ret ? table(ret, 8) : null };
  }

  const toggle = (it: Item, on: boolean) => {
    if (it.on === on) return;
    it.on = on;
    if (on) it.tl.play();
    else it.tl.reverse();
  };

  /** p: the pen along the main line (0..1); q: the run-on from HEAD to About (0..1). */
  function draw(p: number, q: number) {
    const hx = T.x0 + (T.hx - T.x0) * p;
    drawL(main, hx - T.x0);
    branches.forEach((b, i) => drawL(b, p > 0 ? lenAt(T.br[i], hx) : 0));
    all.forEach((it) => toggle(it, p > 0 && hx >= it.x - 0.5));
    if (T.ret) drawL(ret, q * T.ret.L);
    if (p >= 1) breath.play();
    else breath.pause(0);
  }

  /** Reduced motion: the whole graph, drawn and labelled, with no motion. */
  function setStatic() {
    gsap.set([main, ret, ...branches], { visibility: 'visible', drawSVG: '0% 100%' });
    if (!T.ret) gsap.set(ret, { visibility: 'hidden' });
    all.forEach((it) => it.tl.progress(1));
  }

  /** Pause the HEAD ring while the hero is off screen. */
  function idle(on: boolean) {
    if (on && breath.paused() && headItem.on) breath.play();
    else if (!on) breath.pause();
  }

  function revert() {
    breath.kill();
    all.forEach((it) => it.tl.kill());
    [main, ret, ...branches, ...merges, ...nodes, headNode, ring].forEach((e) => e.remove());
    texts.forEach((e) => {
      e.textContent = '';
      delete e.dataset.text;
    });
    gsap.set([...labels.map((l) => l.el), head, cmd, signed].filter(Boolean), { clearProps: 'all' });
    labels.forEach((l) => l.el.querySelectorAll('[data-mi]').forEach((m) => gsap.set(m, { clearProps: 'all' })));
    head.querySelectorAll('[data-mi]').forEach((m) => gsap.set(m, { clearProps: 'all' }));
  }

  /** The command and the hash print as the graph appears (a scrubbed tween). */
  function printTween() {
    const tl = gsap.timeline();
    [cmd, signed].forEach((e) => {
      if (!e) return;
      const i = texts.indexOf(e);
      tl.fromTo(e, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0).to(
        e,
        { scrambleText: { text: finals[i], chars: NOISE, speed: 0.6 }, duration: 0.5, ease: 'none' },
        0,
      );
    });
    return tl;
  }

  return { layout, draw, setStatic, idle, revert, printTween };
}
