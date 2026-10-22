// One reel: poster (or muted loop) + scrim + copy. The whole reel is one link (stretched from the
// title), so the title is the accessible name. Layers, outside in:
//   article[data-drop]   Recruiter Mode furniture; never transformed by the showreel
//   [data-window]        phone entry clip-path (6% -> 0)
//   .media               hover clip-path (0 -> 2%), CSS only
//   [data-poster]        scroll motion per media.motion (pan / zoom / drift)
//   [data-idle]          idle drift on the GSAP ticker
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/data/types';
import styles from '../Showreel.module.css';

export const pad = (n: number) => String(n).padStart(2, '0');

export function Reel({ project: p, index, total }: { project: Project; index: number; total: number }) {
  const titleId = `reel-${p.slug}`;
  const { media } = p;
  const motion = media.kind === 'poster' ? (media.motion ?? 'drift') : 'video';
  const poster = media.poster;

  return (
    <article
      className={styles.reel}
      aria-labelledby={titleId}
      data-drop
      data-reel
      data-motion={motion}
      data-name={p.title}
      data-accent={p.accent}
      style={p.accent ? ({ '--reel-accent': p.accent } as CSSProperties) : undefined}
    >
      <div className={styles.window} data-window>
        <div className={styles.media}>
          <div className={styles.poster} data-poster>
            <div className={styles.idle} data-idle>
              {media.kind === 'video' ? (
                <video
                  className={styles.img}
                  src={media.src}
                  poster={poster.src}
                  width={poster.width}
                  height={poster.height}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-label={poster.alt}
                  data-video
                />
              ) : (
                <Image
                  className={styles.img}
                  src={poster.src}
                  alt={poster.alt}
                  fill
                  sizes="100vw"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.scrim} aria-hidden="true" />

        <div className={styles.copy}>
          <p className={styles.meta}>
            <span className={styles.index}>
              {pad(index + 1)} / {pad(total)}
            </span>
            <span>{p.kind}</span>
            {p.year !== null && <span>{p.year}</span>}
          </p>

          <div className={styles.bottom}>
            <h3 className={styles.title} id={titleId}>
              <Link
                href={`/work/${p.slug}`}
                className={styles.link}
                data-cursor="view"
                data-cursor-label="Case study"
              >
                <span className={styles.titleShift}>
                  <span className={styles.titleText} data-title>
                    {p.title}
                  </span>
                  <ArrowUpRight className={styles.arrow} aria-hidden="true" strokeWidth={1.25} />
                </span>
              </Link>
            </h3>
            <p className={styles.tagline} data-tagline>
              {p.tagline}
            </p>
            <ul className={styles.stack} aria-label={`${p.title} stack`}>
              {p.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
