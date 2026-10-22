// Cursor follower with context states. Fine pointers only; never hides the native cursor.
// Markup lives in the layout: #cursor > .cursor__dot + [data-cursor-label].
// Targets declare a state with data-cursor="link|view|play|drag|text". Labels for view/play/drag
// come from data-cursor-label on the target, or the defaults below.
import { gsap } from 'gsap';
import { isTouch, prefersReducedMotion } from './env';

const LABELS: Record<string, string> = { view: 'View', play: 'Play', drag: 'Drag' };
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary';

let off: (() => void) | null = null;

export function initCursor() {
  if (off || isTouch() || prefersReducedMotion()) return;
  const el = document.getElementById('cursor');
  if (!el) return;
  const label = el.querySelector<HTMLElement>('[data-cursor-label]');
  const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
  const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

  const move = (e: PointerEvent) => {
    x(e.clientX);
    y(e.clientY);
    const t = e.target as Element | null;
    const target = t?.closest<HTMLElement>('[data-cursor]');
    let state = target?.dataset.cursor || '';
    if (!state && t?.closest(INTERACTIVE)) state = 'link';
    if (el.dataset.state !== state) el.dataset.state = state;
    const text = target?.dataset.cursorLabel ?? LABELS[state] ?? '';
    if (label && label.textContent !== text) label.textContent = text;
    if (!el.classList.contains('is-ready')) el.classList.add('is-ready');
  };
  const down = () => el.classList.add('is-pressed');
  const up = () => el.classList.remove('is-pressed');
  const leave = () => el.classList.remove('is-ready');

  addEventListener('pointermove', move, { passive: true });
  addEventListener('pointerdown', down);
  addEventListener('pointerup', up);
  document.documentElement.addEventListener('pointerleave', leave);
  off = () => {
    removeEventListener('pointermove', move);
    removeEventListener('pointerdown', down);
    removeEventListener('pointerup', up);
    document.documentElement.removeEventListener('pointerleave', leave);
    el.classList.remove('is-ready', 'is-pressed');
    el.dataset.state = '';
  };
}

export function destroyCursor() {
  off?.();
  off = null;
}

/** Leans an element toward the pointer: data-magnetic="0.3". Runs inside the page context. */
export function initMagnetic(scope: ParentNode = document) {
  if (isTouch() || prefersReducedMotion()) return () => {};
  const offs: (() => void)[] = [];
  scope.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '0.3');
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { x(0); y(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    offs.push(() => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    });
  });
  return () => offs.forEach((o) => o());
}
