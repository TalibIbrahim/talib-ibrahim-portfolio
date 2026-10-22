'use client';
// Landing: portrait + name. "Talib" sits behind the photo, "Ibrahim" in front of it, on a paper
// card the photo breaks out of. Scrolling pulls the name apart and shrinks the card into a single
// blue ink dot at the centre: the exact point where the pen touches down in the Signature section.
import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ArrowDown } from 'lucide-react';
import { site } from '@/data/site';
import { usePage } from '@/engine/next';
import { ease, isMobile, isTouch, prefersReducedMotion } from '@/engine';
import styles from './Hero.module.css';

const PHOTO = { src: '/headshot-no-bg.png', width: 476, height: 820 };

export function Hero() {
  const hero = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLSpanElement>(null);
  const last = useRef<HTMLSpanElement>(null);
  const given = useRef<HTMLSpanElement>(null);
  const meta = useRef<HTMLDivElement>(null);

  usePage(({ intro }) => {
    if (prefersReducedMotion() || !hero.current) return;
    const mobile = isMobile();
    const splits = [first.current!, last.current!].map((el) => SplitText.create(el, { type: 'chars', mask: 'chars' }));
    gsap.set([first.current, last.current, given.current], { visibility: 'visible' });

    // Intro: the card opens upward, the photo rises into it, the name settles from both sides.
    intro
      .fromTo(card.current, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: ease.wipe }, 0)
      .from(photo.current, { yPercent: 18, autoAlpha: 0, duration: 1.4, ease: ease.out }, 0.25)
      .from(splits[0].chars, { yPercent: 110, duration: 1, ease: ease.out, stagger: 0.04 }, 0.35)
      .from(splits[1].chars, { yPercent: -110, duration: 1, ease: ease.out, stagger: { each: 0.04, from: 'end' } }, 0.45)
      .from(given.current, { autoAlpha: 0, y: 12, duration: 0.8, ease: ease.soft }, 0.8)
      .from(meta.current, { autoAlpha: 0, duration: 0.8, ease: ease.soft }, 0.9);

    // Scroll: the name pulls apart, the card collapses into the ink dot.
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero.current, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
    });
    tl.to(first.current, { xPercent: mobile ? -110 : -125, ease: ease.inOut, duration: 0.6 }, 0)
      .to(last.current, { xPercent: mobile ? 110 : 125, ease: ease.inOut, duration: 0.6 }, 0)
      .to([given.current, meta.current], { autoAlpha: 0, duration: 0.2 }, 0)
      .to(photo.current, { scale: 0.7, yPercent: 10, autoAlpha: 0, duration: 0.42, ease: ease.inOut }, 0.05)
      .to(card.current, { clipPath: 'inset(46% 46% 46% 46% round 50%)', duration: 0.55, ease: ease.inOut }, 0.15)
      .fromTo(dot.current, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.2, ease: ease.out }, 0.55)
      .to(card.current, { autoAlpha: 0, duration: 0.15 }, 0.62)
      .to({}, { duration: 0.23 }); // hold on the dot so the handoff reads

    // Handoff: the moment the landing ends, the Signature stage (same frame: one dot, centred)
    // takes over. Hide this stage so it doesn't scroll up over the pen.
    ScrollTrigger.create({
      trigger: hero.current,
      start: 'bottom bottom',
      onEnter: () => gsap.set(stage.current, { autoAlpha: 0 }),
      onLeaveBack: () => gsap.set(stage.current, { autoAlpha: 1 }),
    });

    // Pointer: the photo and the name drift apart a little, so the depth reads before scrolling.
    let off = () => {};
    if (!isTouch()) {
      const px = gsap.quickTo(photo.current, 'x', { duration: 1, ease: ease.soft });
      const nx = gsap.quickTo([first.current, last.current], 'x', { duration: 1.2, ease: ease.soft });
      const move = (e: PointerEvent) => {
        const k = e.clientX / innerWidth - 0.5;
        px(k * -14);
        nx(k * 22);
      };
      addEventListener('pointermove', move, { passive: true });
      off = () => removeEventListener('pointermove', move);
    }

    return () => {
      off();
      splits.forEach((s) => s.revert());
    };
  });

  return (
    <section ref={hero} id="top" className={styles.hero} aria-labelledby="hero-name">
      <div ref={stage} className={styles.stage}>
        <h1 id="hero-name" className={styles.name}>
          <span ref={given} className={styles.given}>Muhammad</span>{' '}
          <span ref={first} className={`${styles.word} ${styles.first}`}>Talib</span>{' '}
          <span ref={last} className={`${styles.word} ${styles.last}`}>Ibrahim</span>
        </h1>

        <div className={styles.portrait} data-drop>
          <div ref={card} className={styles.card} />
          <div ref={photo} className={styles.photo}>
              <Image
                src={PHOTO.src}
                alt={`Portrait of ${site.name} in a dark suit`}
                width={PHOTO.width}
                height={PHOTO.height}
                sizes="(max-width: 767px) 70vw, 30vw"
                loading="eager"
                fetchPriority="high"
                className={styles.img}
              />
          </div>
        </div>
        <div ref={dot} className={styles.dot} aria-hidden="true" />

        <div ref={meta} className={styles.meta} data-drop>
          <p className={styles.role}>
            {site.role}
            <br />
            {site.location}
          </p>
          <p className={styles.cue} aria-hidden="true">
            Scroll <ArrowDown size={14} strokeWidth={1.5} />
          </p>
        </div>
      </div>
    </section>
  );
}
