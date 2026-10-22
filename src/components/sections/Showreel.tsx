// Work showreel. Server-rendered markup that is a complete, readable list without JS.
// Desktop + motion: ShowreelMotion turns the list into a sticky film strip (data-film on the section).
import type { CSSProperties } from 'react';
import { getFeatured } from '@/data/projects';
import { Reel, pad } from './showreel/Reel';
import { ShowreelMotion } from './showreel/ShowreelMotion';
import styles from './Showreel.module.css';

export function Showreel() {
  const projects = getFeatured();
  const n = projects.length;
  if (!n) return null;
  const first = projects[0];

  return (
    <section
      id="work"
      className={styles.section}
      aria-labelledby="work-title"
      style={{ '--n': n } as CSSProperties}
    >
      <div className={styles.head} data-drop>
        <h2 id="work-title" className={styles.heading}>
          Selected work
        </h2>
        <p className={styles.count}>
          {n} {n === 1 ? 'project' : 'projects'}
        </p>
      </div>

      <div className={styles.track} data-track>
        <div className={styles.stage}>
          <div className={styles.frame} data-frame>
            <div className={styles.strip} data-strip>
              {projects.map((p, i) => (
                <Reel key={p.slug} project={p} index={i} total={n} />
              ))}
            </div>
            <div className={styles.sprockets} aria-hidden="true">
              <span />
              <span />
            </div>
            <p
              className={styles.timecode}
              aria-hidden="true"
              data-timecode
              style={first.accent ? ({ '--tc-accent': first.accent } as CSSProperties) : undefined}
            >
              <span className={styles.tcNum}>
                <span data-tc-index>{pad(1)}</span> / {pad(n)}
              </span>
              <span className={styles.tcTitle} data-tc-title>
                {first.title}
              </span>
            </p>
          </div>
        </div>
      </div>

      <ShowreelMotion />
    </section>
  );
}
