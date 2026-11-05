// One project in the Work strip. The whole item is one link (stretched from the title), so the title
// is the accessible name. Layers, outside in:
//   article[data-item]   Recruiter Mode furniture (data-drop); its slot comes from SLOTS via CSS vars
//   [data-cap]           mono caption: index · year · first stack item (types in once)
//   [data-frame]         the slot box; project 01's is also the entrance card (FLIP fallback)
//   [data-node]          the commit node on the git-graph line
//   [data-media]         focus scale (strip) / entry clip-path (phone); hover clip-path is CSS
//   [data-par]           sideways parallax inside the frame
//   [data-duo]           the duotone copy; only its opacity animates
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { FeaturedProject } from '@/data/types';
import styles from '../Showreel.module.css';

export const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Slot rhythm for the strip, in order (cycled past five). Heights, offsets and gaps are svh.
 * Each cover goes to the slot of its position; the ratios follow the five covers' own shapes
 * (Byters 1.86, Lumos 1.46, QuickDrop 1.88, JARVIS 1.78), except the third, a portrait crop that
 * breaks the row of landscapes (Orbit, framed by its media.focus). `pw`/`px` are the phone width
 * and alignment.
 */
export type Slot = { ar: number; h: number; at: 'top' | 'bottom'; off: number; gap: number; pw: number; px: 'start' | 'end' };
export const SLOTS: Slot[] = [
  { ar: 16 / 9, h: 46, at: 'bottom', off: 9, gap: 0, pw: 100, px: 'start' },
  { ar: 4 / 3, h: 28, at: 'top', off: 33, gap: 9, pw: 76, px: 'end' },
  { ar: 4 / 5, h: 50, at: 'bottom', off: 7, gap: 11, pw: 58, px: 'start' },
  { ar: 3 / 2, h: 26, at: 'top', off: 15, gap: 8, pw: 70, px: 'end' },
  { ar: 16 / 9, h: 36, at: 'bottom', off: 12, gap: 10, pw: 100, px: 'start' },
];

export function Reel({
  project: p,
  index,
  slot,
  first,
}: {
  project: FeaturedProject;
  index: number;
  slot: Slot;
  first: boolean;
}) {
  const titleId = `reel-${p.slug}`;
  const { poster } = p.media;
  const focus = p.media.focus ?? { x: 0.5, y: 0.5 };
  const zoom = focus.zoom ?? 1;
  const cap = [pad(index + 1), p.year, p.stack[0]].filter((v) => v !== null && v !== undefined).join(' · ');
  // Rendered width: the slot on desktop (~0.62vw per svh on a 16:10 screen), times the art-directed zoom.
  const vw = Math.min(100, Math.round(slot.h * slot.ar * 0.62 * zoom * 1.4));
  const sizes = `(max-width: 767px) ${Math.round(slot.pw * zoom)}vw, ${vw}vw`;
  const img = {
    objectPosition: `${focus.x * 100}% ${focus.y * 100}%`,
    transformOrigin: `${focus.x * 100}% ${focus.y * 100}%`,
    '--zoom': zoom,
  } as CSSProperties;

  return (
    <li
      className={styles.cell}
      style={
        {
          '--ar': slot.ar,
          '--h': slot.h,
          '--off': slot.off,
          '--gap': slot.gap,
          '--pw': `${slot.pw}%`,
          '--pwn': slot.pw / 100,
        } as CSSProperties
      }
      data-at={slot.at}
      data-px={slot.px}
      data-first={first || undefined}
    >
      <article className={styles.item} aria-labelledby={titleId} data-item data-drop>
        <div className={styles.text} data-copy>
          <p className={styles.cap} data-cap>
            <span className={styles.capText} data-cap-text>
              {cap}
            </span>
            <span className={styles.caret} aria-hidden="true" data-caret />
          </p>
          <h3 className={styles.name} id={titleId}>
            <Link href={`/work/${p.slug}`} className={styles.link} data-cursor="view" data-cursor-label="Case study">
              <span className={styles.nameShift}>
                {p.title}
                <ArrowUpRight className={styles.arrow} aria-hidden="true" strokeWidth={1.5} />
              </span>
            </Link>
          </h3>
        </div>

        <div className={styles.frame} data-frame>
          <span className={styles.node} aria-hidden="true" data-node />
          <div className={styles.media} data-media>
            <div className={styles.par} data-par>
              <Image
                className={styles.img}
                style={img}
                src={poster.src}
                alt={poster.alt}
                fill
                sizes={sizes}
                loading={first ? 'eager' : 'lazy'}
                data-color
              />
              <Image
                className={`${styles.img} ${styles.duo}`}
                style={img}
                src={poster.src}
                alt=""
                aria-hidden="true"
                fill
                sizes={sizes}
                loading={first ? 'eager' : 'lazy'}
                data-duo
              />
            </div>
          </div>
        </div>

        <p className={styles.tagline} data-copy>
          {p.tagline}
        </p>
      </article>
    </li>
  );
}
