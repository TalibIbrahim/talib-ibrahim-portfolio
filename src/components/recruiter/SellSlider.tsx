'use client';
// The "hard sell" slider: four stops from the whole pitch in one paragraph (0) to everything (3).
// A native range input, so keyboard, touch and screen readers work for free.
import { useEffect, useRef } from 'react';
import { site } from '@/data/site';
import { setSell, useSell, type Sell } from '@/lib/mode';
import styles from './Recruiter.module.css';

export function SellSlider() {
  const sell = useSell();
  const { less, more, levels } = site.recruiter;
  const step = (v: number) => setSell(Math.max(0, Math.min(3, v)) as Sell);
  const ref = useRef<HTMLDivElement>(null);
  // Fold to a bar once the top of the page has scrolled away (an observer, not a scroll listener).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:120px;pointer-events:none';
    document.body.prepend(probe);
    const io = new IntersectionObserver(([e]) => el.toggleAttribute('data-compact', !e.isIntersecting));
    io.observe(probe);
    return () => {
      io.disconnect();
      probe.remove();
    };
  }, []);
  return (
    <div ref={ref} className={styles.slider} role="group" aria-label="How hard should this page sell">
      <button type="button" className={styles.end} onClick={() => step(sell - 1)} tabIndex={-1} aria-hidden="true">
        {less}
      </button>
      <div className={styles.rangeWrap}>
        <div className={styles.ticks} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <input
          type="range"
          className={styles.range}
          min={0}
          max={3}
          step={1}
          value={sell}
          onChange={(e) => step(Number(e.target.value))}
          aria-label={`${less} to ${more}`}
          aria-valuetext={levels[sell]}
          style={{ '--p': `${(sell / 3) * 100}%` } as React.CSSProperties}
        />
      </div>
      <button type="button" className={styles.end} onClick={() => step(sell + 1)} tabIndex={-1} aria-hidden="true">
        {more}
      </button>
      <p className={styles.level} aria-hidden="true">
        {levels[sell]}
      </p>
    </div>
  );
}
