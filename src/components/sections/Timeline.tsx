// Experience + education. Server-rendered, complete and readable without JS.
// Boundary 8 (Stack -> Experience) is a diagonal strike-through wipe; the body is two depth
// layers (experience / education) and a certifications ticker line. TimelineMotion wires both; see its header.
import { site } from '@/data/site';
import { TimelineMotion } from './timeline/TimelineMotion';
import styles from './Timeline.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

export function Timeline() {
  const { experience, education, certifications } = site;

  return (
    <section id="experience" className={styles.section} aria-labelledby="experience-title" data-timeline>
      {/* The pen stroke that leads the wipe. Decorative. */}
      <div className={styles.ink} aria-hidden="true" data-wipe-ink />

      <div className={styles.sheet} data-sheet>
        <header className={styles.head} data-drop>
          <h2 id="experience-title" className={styles.title} data-split="lines">
            Experience and education
          </h2>
        </header>

        <div className={styles.grid}>
          {/* Layer A: experience. Nearest layer, arrives from the left. */}
          <div className={`${styles.layer} ${styles.layerA}`} data-drop>
            <div data-depth="a">
              <h3 className={styles.label}>Experience</h3>
              <ol className={styles.entries} role="list">
                {experience.map((e, i) => (
                  <li key={`${e.org}-${e.start}`} className={styles.entry} data-entry>
                    <p className={styles.dates}>
                      <span className={styles.index} aria-hidden="true">
                        {pad(i + 1)}
                      </span>
                      <span>
                        {e.start} <span aria-hidden="true">/</span>
                        <span className="sr-only">to</span> {e.end}
                      </span>
                    </p>
                    <h4 className={styles.role}>{e.role}</h4>
                    <p className={styles.org}>
                      {e.org}
                      <span className={styles.place}>{e.place}</span>
                    </p>
                    <ul className={styles.points}>
                      {e.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Layer B: education. Middle layer, arrives from the right. */}
          <div className={`${styles.layer} ${styles.layerB}`} data-drop>
            <div data-depth="b">
              <h3 className={styles.label}>Education</h3>
              <ul className={styles.entries} role="list">
                {education.map((ed) => (
                  <li key={ed.school} className={`${styles.entry} ${styles.edu}`} data-entry>
                    <p className={styles.dates}>
                      <span>
                        {ed.start} <span aria-hidden="true">/</span>
                        <span className="sr-only">to</span> {ed.end}
                      </span>
                    </p>
                    <h4 className={styles.role}>{ed.degree}</h4>
                    <p className={styles.org}>{ed.school}</p>
                    {ed.gpa && (
                      <p className={styles.gpa}>
                        <span className={styles.gpaLabel}>GPA</span>
                        <span className={styles.gpaValue}>{ed.gpa}</span>
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Certifications: one slim mono line that drifts by. The list is the real content (screen
            readers, no JS, reduced motion: a plain wrapped line); motion adds an aria-hidden copy to loop. */}
        {certifications.length > 0 && (
          <div className={styles.ticker} data-ticker data-drop>
            <h3 className={styles.tickerLabel}>Certifications</h3>
            <div className={styles.tickerWindow}>
              <ul className={styles.tickerList} role="list" data-ticker-run>
                {certifications.map((c) => (
                  <li key={c} className={styles.tickerItem}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <TimelineMotion />
    </section>
  );
}
