// The first-landing boot screen (src/components/chrome/Loader.tsx). Each line ticks off a real check:
//   fonts    document.fonts.ready
//   images   the hero's <img> elements decoded (img.decode())
//   scroll   the engine's first ScrollTrigger refresh (pins and scrubs measured)
// Lines print with ScrambleText; a status flips to "ok" when its check resolves, or "skip" at the cap.
// Timing: at least 0.8 s, gone by 1.5 s after navigation start (it proceeds anyway). Exit: the
// screen wipes up (clip-path, ease.wipe, .3 s), then html.loading is removed, which releases the hero's
// CSS intro, and the engine's first intro (held via holdIntro) plays: the hero starts after the
// loader, never under it. Reduced motion: no scramble, a plain .25 s fade. Marks the session as booted.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ease, prefersReducedMotion, startScroll, stopScroll } from '@/engine';
import { site } from '@/data/site';
import { BOOT_KEY } from '@/lib/mode-script';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

const MIN = 0.8; // s, from navigation start
// hard cap, exit included (fonts or images may finish under the hero); the boot script's cap, same values
const MAX = typeof matchMedia !== 'undefined' && matchMedia('(max-width: 767px), (pointer: coarse)').matches ? 1.2 : 1.5;
const NOISE = '01{}/=_;$#<>';

const wait = (s: number) => new Promise<void>((r) => gsap.delayedCall(Math.max(0, s), r));
const since = () => performance.now() / 1000;

function checks(): Record<string, Promise<unknown>> {
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const imgs = [...document.querySelectorAll<HTMLImageElement>('[data-hero] img')].filter((i) => i.loading !== 'lazy');
  const images = Promise.all(imgs.map((i) => i.decode().catch(() => undefined)));
  // registered before the engine's first page init (setup runs first), so the first refresh is caught
  const scroll = new Promise<void>((r) => {
    const done = () => {
      ScrollTrigger.removeEventListener('refresh', done);
      r();
    };
    ScrollTrigger.addEventListener('refresh', done);
  });
  return { fonts, images, scroll };
}

export function runLoader(): Promise<void> {
  const root = document.documentElement;
  const el = document.getElementById('loader');
  if (!el || !root.classList.contains('loading')) return Promise.resolve();
  const reduced = prefersReducedMotion();
  const L = site.loader;
  // the boot text lives in data-final (out of the server HTML text); copy it in before anything reads it
  el.querySelectorAll<HTMLElement>('[data-final]').forEach((t) => (t.textContent = t.dataset.final ?? ''));
  el.dataset.run = '';
  const lines = [...el.querySelectorAll<HTMLElement>('[data-boot-line]')];
  const texts = lines.map((l) => l.querySelector<HTMLElement>('[data-boot-text]'));
  const finals = texts.map((t) => t?.textContent ?? '');
  const pending = checks();
  gsap.delayedCall(0, () => stopScroll()); // Lenis starts with the engine, right after setup

  if (!reduced) {
    gsap.set(lines, { autoAlpha: 0 });
    texts.forEach((t) => t && (t.textContent = ''));
  }

  const print = (i: number) => {
    const line = lines[i];
    const t = texts[i];
    if (!line) return Promise.resolve();
    if (reduced) return Promise.resolve();
    gsap.set(line, { autoAlpha: 1 });
    return new Promise<void>((r) =>
      gsap.to(t, {
        duration: 0.22,
        ease: 'none',
        scrambleText: { text: finals[i], chars: NOISE, speed: 1 },
        onComplete: r,
      }),
    );
  };
  const mark = (line: HTMLElement, text: string) => {
    const s = line.querySelector<HTMLElement>('[data-boot-status]');
    if (!s) return;
    line.dataset.state = text === L.ok ? 'ok' : 'skip';
    if (reduced) s.textContent = text;
    else gsap.to(s, { duration: 0.15, ease: 'none', scrambleText: { text, chars: NOISE, speed: 1 } });
  };

  const cap = wait(MAX - since() - 0.3); // leave time for the exit inside the cap
  const run = async () => {
    await print(0);
    const keys = ['fonts', 'images', 'scroll'];
    for (let k = 0; k < keys.length; k++) {
      const line = lines[k + 1];
      await print(k + 1);
      const ok = await Promise.race([pending[keys[k]].then(() => true), cap.then(() => false)]);
      if (line) mark(line, ok ? L.ok : L.skip);
    }
    await print(lines.length - 1);
    await wait(MIN - since());
  };

  return Promise.race([run(), cap])
    .catch(() => undefined)
    .then(
      () =>
        new Promise<void>((done) => {
          const finish = () => {
            root.classList.remove('loading', 'loaded');
            try {
              sessionStorage.setItem(BOOT_KEY, '1');
            } catch {
              /* private mode: it shows again next time, which is fine */
            }
            gsap.killTweensOf([el, ...lines, ...texts.filter((t): t is HTMLElement => !!t)]);
            el.remove(); // one boot per session: it never comes back, so it leaves the DOM
            startScroll();
            done();
          };
          if (!root.classList.contains('loading') || !el.isConnected) return finish(); // the hard cap already took it away
          if (reduced) gsap.to(el, { autoAlpha: 0, duration: 0.25, ease: 'none', onComplete: finish });
          else gsap.to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.3, ease: ease.wipe, onComplete: finish });
        }),
    );
}
