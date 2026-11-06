// Work. Server-rendered markup that is a complete, readable list without JS.
//   Head    "SELECTED / WORK" (site.workIndex.featuredHeading) around a mono chip:
//           `git log --featured · 05` (site.workIndex.log + the featured count).
//   Strip   the featured covers whole, at their own aspect and mixed heights (SLOTS: height, top or
//           bottom, offset, gap before); the git-graph line runs under the captions through a commit
//           node at each one, and curves in the gaps, never over a cover.
//   End     the "All projects" card (a branch off the line) to /work.
// Desktop + motion: ShowreelMotion sets data-strip and drives the bent-card entrance (OGL), the
// sticky sideways travel, the focus band and the line. Phones: a stacked composition with a rail.
// Reduced motion / no JS: the same items as a static wrapped grid, full colour.
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeatured, getProjects } from '@/data/projects';
import { site } from '@/data/site';
import { Reel, SLOTS, pad } from './showreel/Reel';
import { ShowreelMotion } from './showreel/ShowreelMotion';
import styles from './Showreel.module.css';

const copy = site.workIndex;

export function Showreel() {
  const projects = getFeatured();
  const n = projects.length;
  if (!n) return null;
  const all = getProjects();
  const words = copy.featuredHeading.split(' ');
  const last = words.length > 1 ? words.pop()! : '';
  const first = words.join(' ');

  return (
    <section id="work" className={styles.section} aria-labelledby="work-title" data-work>
      <div className={styles.stage} data-stage>
        <div className={styles.ground} aria-hidden="true" data-ground />
        <div className={styles.gl} aria-hidden="true" data-gl />

        <header className={styles.head} data-head data-drop>
          <h2 id="work-title" className={styles.title}>
            <span className="sr-only">{copy.featuredHeading}</span>
            <span className={styles.words} aria-hidden="true" data-words>
              <span className={styles.word} data-word>
                {first}
              </span>
              <span className={styles.chip} data-chip>
                <span className={styles.chipText}>
                  {copy.log} <span className={styles.chipCount}>· {pad(n)}</span>
                </span>
              </span>
              {last && (
                <span className={styles.word} data-word>
                  {last}
                </span>
              )}
            </span>
          </h2>
        </header>

        <div className={styles.track} data-track>
          <span className={styles.rail} aria-hidden="true" data-rail />
          <svg className={styles.graph} aria-hidden="true" focusable="false" data-graph>
            <path className={styles.line} data-line d="" />
          </svg>
          {/* during the travel the line is drawn in full and this desk-black cover slides off it
              (a transform), so drawing it costs no repaint per frame */}
          <span className={styles.cover} aria-hidden="true" data-cover />
          {/* where About's pen line ends: a commit node, the branch into project 01 leaves from it */}
          <span className={styles.leadNode} aria-hidden="true" data-lead-node />
          <ol className={styles.list} role="list">
            {projects.map((p, i) => (
              <Reel key={p.slug} project={p} index={all.indexOf(p)} slot={SLOTS[i % SLOTS.length]} first={i === 0} />
            ))}
          </ol>
          <p className={styles.all} data-all data-drop>
            <Link href="/work" className={styles.allLink} data-cursor="link">
              <span className={styles.node} aria-hidden="true" data-node />
              <span className={styles.allPath} aria-hidden="true">
                /work · {pad(all.length)}
              </span>
              <span className={styles.allText}>
                {copy.homeLink}
                <ArrowRight className={styles.allArrow} aria-hidden="true" strokeWidth={1.25} />
              </span>
            </Link>
          </p>
        </div>
      </div>

      {/* The duotone: luma mapped desk black -> pen blue -> paper (the GL entrance uses the same map). */}
      <svg className={styles.defs} aria-hidden="true" focusable="false">
        <filter id="ink-duo" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.043 0.302 0.925" />
            <feFuncG type="table" tableValues="0.043 0.420 0.910" />
            <feFuncB type="table" tableValues="0.047 1 0.875" />
          </feComponentTransfer>
        </filter>
      </svg>

      <ShowreelMotion />
    </section>
  );
}
