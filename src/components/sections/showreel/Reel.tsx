// One project in the Work strip. The whole item is one link (stretched from the title), so the title
// is the accessible name. Layers, outside in:
//   article[data-item]   Recruiter Mode furniture (data-drop); its slot comes from SLOTS via CSS vars
//   [data-cap]           mono caption: index · year · first stack item (types in once); it holds the
//                        commit node: the git-graph line runs just under the captions, never over a cover
//   [data-frame]         the slot box, at the cover's own aspect; project 01's is also the entrance card
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
 * Every cover is shown whole: the slot takes the cover's own aspect (media.poster width / height),
 * and the scatter comes from height, top/bottom anchoring, offset and gap only. The gaps leave the
 * git-graph line room to curve between covers. `pw`/`px` are the phone width and alignment.
 */
export type Slot = { h: number; at: 'top' | 'bottom'; off: number; gap: number; pw: number; px: 'start' | 'end' };
export const SLOTS: Slot[] = [
  { h: 44, at: 'bottom', off: 9, gap: 0, pw: 100, px: 'start' },
  { h: 30, at: 'top', off: 30, gap: 21, pw: 76, px: 'end' },
  { h: 40, at: 'bottom', off: 7, gap: 23, pw: 84, px: 'start' },
  { h: 28, at: 'top', off: 17, gap: 21, pw: 76, px: 'end' },
  { h: 36, at: 'bottom', off: 12, gap: 23, pw: 100, px: 'start' },
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
  const ar = poster.width / poster.height;
  const cap = [pad(index + 1), p.year, p.stack[0]].filter((v) => v !== null && v !== undefined).join(' · ');
  // Rendered width: the slot on desktop (~0.62vw per svh on a 16:10 screen), with headroom for 1.4x screens.
  const vw = Math.min(100, Math.round(slot.h * ar * 0.62 * 1.4));
  const sizes = `(max-width: 767px) ${slot.pw}vw, ${vw}vw`;

  return (
    <li
      className={styles.cell}
      style={
        {
          '--ar': ar,
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
            <span className={styles.node} aria-hidden="true" data-node />
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
          <div className={styles.media} data-media>
            <div className={styles.par} data-par>
              <Image
                className={styles.img}
                src={poster.src}
                alt={poster.alt}
                fill
                sizes={sizes}
                loading={first ? 'eager' : 'lazy'}
                data-color
              />
              <Image
                className={`${styles.img} ${styles.duo}`}
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

        <p className={styles.tagline} data-copy data-desc>
          {p.tagline}
        </p>
        {p.keyFact && (
          <p className={styles.fact} data-copy data-fact>
            <span className={styles.factText} data-fact-text>
              {p.keyFact}
            </span>
          </p>
        )}
      </article>
    </li>
  );
}
