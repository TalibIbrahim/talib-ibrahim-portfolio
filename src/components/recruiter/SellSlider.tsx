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
  const dock = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  // The slider sits in the page flow under the contact buttons, so it never lies on the copy. On
  // desktop, once its dock has scrolled above the viewport it folds into a small fixed tab in the
  // label column (an observer, not a scroll listener); the dock keeps its height, so nothing shifts.
  // Phones keep it docked only: no fixed bar over a one-column page.
  useEffect(() => {
    const holder = dock.current;
    const el = ref.current;
    if (!holder || !el) return;
    const wide = matchMedia('(min-width: 768px)');
    const io = new IntersectionObserver(([e]) => {
      const fold = wide.matches && !e.isIntersecting && e.boundingClientRect.top < 0;
      if (fold === el.hasAttribute('data-compact')) return;
      holder.style.height = fold ? `${holder.offsetHeight}px` : '';
      el.toggleAttribute('data-compact', fold);
    });
    io.observe(holder);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={dock} className={styles.dock}>
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
    </div>
  );
}
