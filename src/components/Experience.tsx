"use client";
import { experience } from "@/data/portfolio";
import ScrollReveal from "./ScrollReveal";
import styles from "./Experience.module.css";

export default function Experience() {
  return (
    <section className="section" id="experience">
      <ScrollReveal>
        <p className="section-label">02 — Experience</p>
        <h2 className="section-title">Where I&apos;ve worked</h2>
      </ScrollReveal>

      <div className={styles.timeline}>
        {experience.map((exp, i) => (
          <ScrollReveal key={exp.id} delay={i * 0.1}>
            <div className={styles.entry}>
              <div className={styles.marker}>
                <div className={styles.dot} />
                {i < experience.length - 1 && <div className={styles.line} />}
              </div>
              <div className={styles.card}>
                <div className={styles.header}>
                  <div>
                    <h3 className={styles.role}>{exp.role}</h3>
                    <p className={styles.company}>{exp.company}</p>
                  </div>
                  <div className={styles.meta}>
                    <span className={`mono ${styles.period}`}>{exp.period}</span>
                    <span className={styles.location}>{exp.location}</span>
                  </div>
                </div>
                <ul className={styles.bullets}>
                  {exp.bullets.map((b, j) => (
                    <li key={j} className={styles.bullet}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
