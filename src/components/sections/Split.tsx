// Front end / back end. Two halves of one seam: a mono top word over a heavy END, the stack for that
// layer, the projects that used it (links to their case studies) and one line of pitch.
//   Boundary (Showreel -> here)  "seam": the section opens from its centre line outwards, the seam
//                                hairline drawing first (scrubbed). Used nowhere else.
//   Hover / focus-within         a marker tag writes itself over the top word; the other half dims.
//   Touch / phone                the tag writes on the half in view and wipes off as it leaves.
// Reduced motion / no JS / Recruiter Mode: both halves complete, no tags, no seam wipe.
import { Fragment } from 'react';
import Link from 'next/link';
import { site } from '@/data/site';
import { getProjects } from '@/data/projects';
import { TAGS, TAG_SLANT, TAG_VIEWBOX, jitter } from './split/tags';
import { SplitMotion } from './split/SplitMotion';
import styles from './Split.module.css';

/** Labels and tools from site.layers; the marker tag and pitch for each side. Tools render only if site.stack lists them. */
const TAG = { front: TAGS.front, back: TAGS.back };
const PITCH = { front: site.pitch.frontEnd, back: site.pitch.backEnd };
const LABELS = site.layers;
const LAYERS = site.layers.sides.map((s) => ({ ...s, tag: TAG[s.key], pitch: PITCH[s.key] }));
const USED_MAX = 4; // both lists the same height

const norm = (s: string) => s.toLowerCase().replace(/\.js$/, '').trim();
const known = new Set(site.stack.flatMap((g) => g.items));

export function Split() {
  const projects = getProjects();

  return (
    <section id="layers" className={styles.section} aria-labelledby="layers-title" data-layers>
      <h2 id="layers-title" className="sr-only">
        {LABELS.heading}
      </h2>
      <span className={styles.seam} aria-hidden="true" data-seam />
      <div className={styles.grid} data-layers-body data-drop>
        {LAYERS.map((l) => {
          const tools = l.tools.filter((t) => known.has(t));
          const keys = new Set(tools.map(norm));
          const used = projects.filter((p) => p.stack.some((s) => keys.has(norm(s)))).slice(0, USED_MAX);
          return (
            <article key={l.key} className={`${styles.side} ${styles[l.key]}`} data-side={l.key}>
              <p className={styles.layer}>{l.layer}</p>
              <h3 className={styles.title}>
                <span className={styles.top}>
                  {l.top}
                  <svg className={styles.tag} viewBox={TAG_VIEWBOX} aria-hidden="true" data-tag>
                    <g transform={TAG_SLANT}>
                      {l.tag.map((d, i) => (
                        <Fragment key={i}>
                          <path d={d} strokeWidth={16} data-fat />
                          <path d={jitter(d)} strokeWidth={8} transform="translate(3.5 -2.8)" data-thin />
                        </Fragment>
                      ))}
                    </g>
                  </svg>
                </span>{' '}
                <span className={styles.end}>{LABELS.end}</span>
              </h3>
              {used.length > 0 && (
                <div className={styles.used}>
                  <p className={styles.usedLabel}>{LABELS.usedIn}</p>
                  <ul>
                    {used.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/work/${p.slug}`}>{p.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {l.pitch && <p className={styles.pitch}>{l.pitch}</p>}
              <ul className={styles.chips} aria-label={`${l.top} end stack`}>
                {tools.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
      <SplitMotion />
    </section>
  );
}
