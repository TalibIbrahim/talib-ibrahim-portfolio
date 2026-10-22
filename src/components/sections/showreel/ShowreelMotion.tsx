'use client';
// Showreel motion. Renders nothing; wires the server-rendered #work section on every page load.
//
// Desktop (>= 768px, html.motion): the section gets data-film, CSS turns the list into a sticky
// stage over a (n+1)*100svh track, and ONE scrubbed timeline runs over that track in n+1 units:
//   unit 0          entry: the frame lands (scale .56 -> 1, rotateX 24 -> 0, y 16vh -> 0, radius 18 -> 0)
//   unit 1+i        project i holds the gate; the film advances to project i centred on 1+i (width .5)
//   per frame       poster pan / zoom / drift across the span that frame is visible
//                   title chars + tagline lines reveal as the frame arrives
// Phones (html.motion): stacked reels, the window tightens (inset 6% -> 0) and the poster drifts.
// Reduced motion / no JS / Recruiter Mode: the static list, nothing here runs.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ease, prefersReducedMotion, scrollToTarget } from '@/engine';
import { usePage } from '@/engine/next';

gsap.registerPlugin(ScrollTrigger, SplitText);

const pad = (n: number) => String(n).padStart(2, '0');
const q = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => root.querySelector<T>(sel);

export function ShowreelMotion() {
  usePage(() => {
    const section = document.getElementById('work');
    if (!section) return;
    const reels = gsap.utils.toArray<HTMLElement>('[data-reel]', section);
    if (!reels.length) return;

    const offVideo = initVideos(section);
    const mm = gsap.matchMedia();
    mm.add(
      {
        film: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        phone: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      },
      (c) => {
        if (!document.documentElement.classList.contains('motion')) return;
        return c.conditions?.film ? initFilm(section, reels) : initPhone(reels);
      },
    );
    return () => {
      mm.revert();
      offVideo();
    };
  });
  return null;
}

/* ---------------------------------------------------------------- desktop: film */

function initFilm(section: HTMLElement, reels: HTMLElement[]) {
  const track = q(section, '[data-track]');
  const frame = q(section, '[data-frame]');
  const strip = q(section, '[data-strip]');
  const timecode = q(section, '[data-timecode]');
  const tcIndex = q(section, '[data-tc-index]');
  const tcTitle = q(section, '[data-tc-title]');
  if (!track || !frame || !strip) return;

  const n = reels.length;
  const U = n + 1; // timeline units: entry + one per project
  section.dataset.film = '';

  const splits: SplitText[] = [];
  const idles: gsap.core.Tween[] = [];
  let active = -1;
  let onScreen = false;

  const setActive = (i: number) => {
    if (i === active) return;
    idles[active]?.pause();
    active = i;
    const reel = reels[i];
    if (tcIndex) tcIndex.textContent = pad(i + 1);
    if (tcTitle) tcTitle.textContent = reel.dataset.name ?? '';
    if (timecode) {
      if (reel.dataset.accent) timecode.style.setProperty('--tc-accent', reel.dataset.accent);
      else timecode.style.removeProperty('--tc-accent');
    }
    if (onScreen) idles[i]?.play();
  };

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => setActive(gsap.utils.clamp(0, n - 1, Math.floor(self.progress * U - 1))),
    },
  });

  // 1. Entry: the frame lands (the About "o" zoom-through hands into this frame).
  gsap.set(frame, { transformOrigin: '50% 100%' });
  tl.fromTo(
    frame,
    { scale: 0.56, rotationX: 24, y: () => innerHeight * 0.16, clipPath: 'inset(0% 0% 0% 0% round 18px)' },
    { scale: 1, rotationX: 0, y: 0, clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1 },
    0,
  );

  // 2. Film advance: one frame per project, centred on unit 1+i.
  for (let i = 1; i < n; i++) {
    tl.to(strip, { yPercent: (-100 / n) * i, duration: 0.5, ease: ease.inOut }, 1 + i - 0.25);
  }

  // 3. Inside each frame.
  reels.forEach((reel, i) => {
    const poster = q(reel, '[data-poster]');
    const idle = q(reel, '[data-idle]');
    const title = q(reel, '[data-title]');
    const tagline = q(reel, '[data-tagline]');
    const from = i === 0 ? 0 : i + 0.75;
    const to = i === n - 1 ? U : i + 2.25;

    if (poster) {
      const m = reel.dataset.motion;
      const [a, b]: gsap.TweenVars[] =
        m === 'pan' ? [{ xPercent: -5 }, { xPercent: 5 }]
        : m === 'zoom' ? [{ scale: 1.15 }, { scale: 1 }]
        : m === 'video' ? [{ scale: 1.06 }, { scale: 1 }]
        : [{ xPercent: -3, yPercent: 3, scale: 1.04 }, { xPercent: 3, yPercent: -3, scale: 1.04 }];
      tl.fromTo(poster, a, { ...b, duration: to - from }, from);
    }

    if (idle) {
      idles[i] = gsap.to(idle, {
        xPercent: 1.2,
        yPercent: -0.9,
        duration: 9,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        paused: true,
      });
    }

    const at = i === 0 ? 0.55 : 1 + i - 0.05; // title starts as the frame settles in the gate
    if (title) {
      const split = SplitText.create(title, { type: 'words,chars', mask: 'chars', charsClass: 'reel-char', aria: 'auto' }) // one accessible copy: aria-label on the title, chars hidden;
      splits.push(split);
      tl.fromTo(split.chars, { yPercent: 110 }, { yPercent: 0, duration: 0.28, stagger: { amount: 0.18 } }, at);
    }
    if (tagline) {
      splits.push(
        SplitText.create(tagline, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit(self) {
            // Re-split on resize / font load: SplitText kills the old tween (removing it from tl)
            // and this one takes its place at the same position.
            // immediateRender:false so the new lines are not parked at their hidden "from" state;
            // then render the tween at the scrubbed playhead, so a re-split mid-scroll shows the
            // tagline exactly as far in as the scroll says (fully in once its frame has settled).
            const tw = gsap.fromTo(
              self.lines,
              { yPercent: 110 },
              { yPercent: 0, ease: 'none', duration: 0.3, stagger: 0.06, immediateRender: false },
            );
            tl.add(tw, at + 0.14);
            const local = Math.min(tw.totalDuration(), tl.time() - tw.startTime());
            if (local > 0) tw.render(local, true, true);
            else gsap.set(self.lines, { yPercent: 110 }); // its frame has not arrived yet
            return tw;
          },
        }),
      );
    }
  });
  tl.add(() => {}, U); // the timeline is exactly n+1 units long

  // Idle drift only while the section is on screen.
  const visible = ScrollTrigger.create({
    trigger: track,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      onScreen = self.isActive;
      if (onScreen) idles[active]?.play();
      else idles.forEach((t) => t.pause());
    },
  });

  // Keyboard: frames off the gate are clipped, so bring a focused reel into the gate.
  const onFocus = (e: FocusEvent) => {
    const reel = (e.target as Element).closest<HTMLElement>('[data-reel]');
    const st = tl.scrollTrigger;
    if (!reel || !st) return;
    const i = reels.indexOf(reel);
    if (i < 0 || i === active) return;
    scrollToTarget(st.start + ((1.5 + i) / U) * (st.end - st.start), { immediate: true }); // keyboard focus must land on a visible frame
  };
  section.addEventListener('focusin', onFocus);

  setActive(0);

  return () => {
    section.removeEventListener('focusin', onFocus);
    visible.kill();
    idles.forEach((t) => t.kill());
    splits.forEach((s) => s.revert());
    delete section.dataset.film;
  };
}

/* ---------------------------------------------------------------- phones: touch version */

function initPhone(reels: HTMLElement[]) {
  reels.forEach((reel) => {
    const win = q(reel, '[data-window]');
    const poster = q(reel, '[data-poster]');
    if (win) {
      gsap.fromTo(
        win,
        { clipPath: 'inset(6% 6% 6% 6%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: reel, start: 'top bottom', end: 'top 45%', scrub: 0.6 },
        },
      );
    }
    if (poster) {
      gsap.fromTo(
        poster,
        { yPercent: -6 },
        { yPercent: 6, ease: 'none', scrollTrigger: { trigger: reel, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    }
  });
}

/* ---------------------------------------------------------------- video reels */

function initVideos(section: HTMLElement) {
  const videos = [...section.querySelectorAll<HTMLVideoElement>('video[data-video]')];
  if (!videos.length || prefersReducedMotion()) return () => {};
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.intersectionRatio >= 0.5) {
          v.preload = 'auto';
          v.play().catch(() => {});
        } else v.pause();
      }),
    { threshold: [0, 0.5] },
  );
  videos.forEach((v) => io.observe(v));
  return () => {
    io.disconnect();
    videos.forEach((v) => v.pause());
  };
}
