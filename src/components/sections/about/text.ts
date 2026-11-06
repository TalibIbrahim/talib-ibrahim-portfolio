// About text motion (motion only; the server HTML is the final text). One reveal voice per block:
//   Headline   (the tagline) each line is wiped by a blue block, scrubbed to its own position: the
//              block crosses the line between 85% and 65% of the viewport, the text appears under it.
//   Lead, body each line rises out of its mask once (0.7 s) as it crosses 92%; the mask opens once the line
//              is home, so no line is ever left clipped. A key word on a line resolves as soon as
//              that line comes into view (92%) (time-based and short, finished long before mid-screen):
//                decode  glyph noise resolves into the phrase (<= 0.4 s); common phrases only
//                type    the phrase types in behind a caret; proper nouns
//                diff    the struck placeholder token leaves and the phrase rises into its slot
//                select  the company is selected like shift+arrow
// Proper nouns are never scrambled. Each slot is as wide as its final text, so nothing reflows.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ease } from '@/engine';
import { diffToken } from './fx';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const NOISE = '01{}/=_;$#';
const noise = (n: number, seed: number) =>
  Array.from({ length: n }, (_, i) => NOISE[(i * 7 + seed * 3 + ((i * i) % 5)) % NOISE.length]).join('');

type Classes = Record<string, string>;
type Killable = { kill: () => void };

/** Sets the slot's pre-state and returns its (short, paused) effect. */
function prepare(slot: HTMLElement, seed: number) {
  const kind = slot.dataset.fx;
  const vis = slot.querySelector<HTMLElement>('[data-vis]');
  if (!vis) return null;
  const target = vis.textContent ?? '';
  const n = target.length;
  const tl = gsap.timeline({ paused: true });
  const live = () => tl.set(slot, { attr: { 'data-state': 'live' } });

  if (kind === 'decode') {
    slot.dataset.state = 'noise';
    vis.textContent = noise(n, seed);
    tl.to(vis, { duration: 0.4, scrambleText: { text: target, chars: NOISE, revealDelay: 0.1, speed: 1 }, ease: 'none' });
    tl.add(live(), 0.1);
  } else if (kind === 'type') {
    // empty slot (its width is reserved), then the caret types the name in
    const caret = slot.querySelector<HTMLElement>('[data-caret]');
    const ch = slot.offsetWidth / n;
    vis.textContent = '';
    slot.dataset.state = 'live';
    const p = { i: 0 };
    if (caret) tl.set(caret, { opacity: 1, x: 0 });
    tl.to(p, {
      i: n,
      duration: Math.min(0.6, n * 0.05),
      ease: `steps(${n})`,
      onUpdate: () => {
        const k = Math.round(p.i);
        vis.textContent = target.slice(0, k);
        if (caret) gsap.set(caret, { x: k * ch });
      },
    });
    if (caret) tl.to(caret, { opacity: 0, duration: 0.01, repeat: 3, yoyo: true, repeatDelay: 0.22 }).set(caret, { opacity: 0 });
  } else if (kind === 'diff') {
    const del = slot.querySelector<HTMLElement>('[data-del]');
    const strike = slot.querySelector<HTMLElement>('[data-strike]');
    const ins = slot.querySelector<HTMLElement>('[data-ins]');
    if (!del || !strike || !ins) return null;
    vis.textContent = diffToken((ins.textContent ?? '').length); // the placeholder is client-only
    gsap.set(del, { display: 'block' });
    gsap.set(ins, { yPercent: 110 });
    tl.to(strike, { scaleX: 1, duration: 0.25, ease: ease.wipe })
      .to(del, { yPercent: -110, autoAlpha: 0, duration: 0.3, ease: 'power3.in' }, '>0.1')
      .to(ins, { yPercent: 0, duration: 0.45, ease: ease.out }, '>-0.05')
      .add(live(), '<');
  } else if (kind === 'select') {
    // plain text first (a name is never scrambled), then the selection sweeps over it
    const bg = slot.querySelector<HTMLElement>('[data-selbg]');
    slot.dataset.state = 'live';
    if (bg) tl.to(bg, { scaleX: 1, duration: 0.4, ease: 'steps(13)' });
    tl.set(slot, { attr: { 'data-state': 'selected' } }, 0.1);
  }
  return tl;
}

/** Plays each effect once, when the line holding it comes into view (92% of the viewport). */
function onArrival(line: HTMLElement, effects: gsap.core.Timeline[], done: Set<gsap.core.Timeline>, keep: Killable[]) {
  if (!effects.length) return;
  const play = () =>
    effects.forEach((fx) => {
      done.add(fx);
      fx.play();
    });
  if (effects.every((fx) => done.has(fx))) {
    effects.forEach((fx) => fx.progress(1));
    return;
  }
  // as soon as the line is in view (reachable on any screen, even the last line of a short page);
  // a line already past its start when the trigger is made plays at once
  keep.push(ScrollTrigger.create({ trigger: line, start: 'top 92%', once: true, onEnter: play }));
}

export function initText(root: HTMLElement, styles: Classes) {
  const offs: (() => void)[] = [];
  // the key-word layers are drawn from data-text by CSS in the server HTML; make them real text first
  root.querySelectorAll<HTMLElement>('[data-fx] [data-text]').forEach((el) => {
    el.textContent = el.dataset.text ?? '';
    el.removeAttribute('data-text');
  });
  const played = new Set<string>(); // effect kinds already played: a re-split restores them finished

  const track = (tl: gsap.core.Timeline, kind: string) => {
    if (played.has(kind)) tl.progress(1);
    tl.eventCallback('onStart', () => played.add(kind));
    return tl;
  };

  /* ---------- headline: per-line block wipe (scrubbed) */
  const lead = root.querySelector<HTMLElement>('[data-headline]');
  if (lead) {
    let keep: Killable[] = [];
    const kill = () => {
      keep.forEach((k) => k.kill());
      keep = [];
    };
    const split = SplitText.create(lead, {
      type: 'lines',
      linesClass: 'block-line',
      ignore: '[data-fx-unit]', // key-word slots and their punctuation stay whole
      aria: 'none', // the DOM already reads right: sr-only phrases, aria-hidden visual layers
      autoSplit: true,
      onSplit(self) {
        kill();
        const done = new Set<gsap.core.Timeline>();
        self.lines.forEach((line, i) => {
          const wrap = document.createElement('span');
          wrap.className = styles.bwrap;
          const txt = document.createElement('span');
          txt.className = styles.btxt;
          while (line.firstChild) txt.appendChild(line.firstChild);
          const blk = document.createElement('span');
          blk.className = styles.blk;
          blk.setAttribute('aria-hidden', 'true');
          wrap.append(txt, blk);
          line.append(wrap);
          const wipe = gsap
            .timeline({ scrollTrigger: { trigger: line, start: 'top 85%', end: 'top 65%', scrub: 0.4 } })
            .fromTo(blk, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.5, ease: ease.wipe })
            .set(txt, { visibility: 'visible' }, 0.5)
            .set(blk, { transformOrigin: '100% 50%' }, 0.5)
            .to(blk, { scaleX: 0, duration: 0.5, ease: ease.wipe }, 0.5);
          keep.push(wipe);
          const effects = [...line.querySelectorAll<HTMLElement>('[data-fx]')]
            .map((slot, k) => {
              const fx = prepare(slot, i + k + 1);
              return fx && track(fx, slot.dataset.fx!);
            })
            .filter((fx): fx is gsap.core.Timeline => !!fx);
          keep.push(...effects);
          onArrival(line as HTMLElement, effects.filter((fx) => fx.progress() < 1), done, keep);
        });
      },
    });
    offs.push(() => {
      kill();
      split.revert();
    });
  }

  /* ---------- lead + body: per-line rise (scrubbed), the mask opens once the line is home */
  root.querySelectorAll<HTMLElement>('[data-lead], [data-body]').forEach((p) => {
    let keep: Killable[] = [];
    const kill = () => {
      keep.forEach((k) => k.kill());
      keep = [];
    };
    const split = SplitText.create(p, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      ignore: '[data-fx-unit]',
      aria: 'none',
      autoSplit: true,
      onSplit(self) {
        kill();
        const done = new Set<gsap.core.Timeline>();
        self.lines.forEach((line, i) => {
          const mask = (self.masks?.[i] as HTMLElement | undefined) ?? line.parentElement;
          // Time-based, once (0.7 s, ease.out) as the line crosses 92%: a scrubbed rise left the lowest
          // lines of the screen part-risen, so the paragraph read as if its leading jumped.
          const rise = gsap.fromTo(
            line,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.7,
              ease: ease.out,
              scrollTrigger: { trigger: mask ?? line, start: 'top 92%', toggleActions: 'play none none none' },
              onComplete() {
                if (mask) mask.style.overflow = 'visible';
              },
            },
          );
          keep.push(rise);
          const effects = [...line.querySelectorAll<HTMLElement>('[data-fx]')]
            .map((slot, k) => {
              const fx = prepare(slot, i + k + 5);
              return fx && track(fx, slot.dataset.fx!);
            })
            .filter((fx): fx is gsap.core.Timeline => !!fx);
          keep.push(...effects);
          onArrival(line as HTMLElement, effects.filter((fx) => fx.progress() < 1), done, keep);
        });
      },
    });
    offs.push(() => {
      kill();
      split.revert();
    });
  });

  return () => offs.forEach((off) => off());
}
