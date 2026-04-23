"use client";
import { personalInfo, skills, certifications } from "@/data/portfolio";
import ScrollReveal from "./ScrollReveal";
import styles from "./About.module.css";

export default function About() {
  return (
    <section className="section" id="about">
      <ScrollReveal>
        <p className="section-label">01 — About</p>
        <h2 className="section-title">A bit about me</h2>
      </ScrollReveal>

      <div className={styles.grid}>
        <ScrollReveal delay={0.1} className={styles.bio}>
          <p>{personalInfo.bio}</p>
          <div className={styles.edu}>
            <div className={styles.eduItem}>
              <span className={`mono ${styles.eduLabel}`}>University</span>
              <span className={styles.eduValue}>{personalInfo.university}</span>
            </div>
            <div className={styles.eduItem}>
              <span className={`mono ${styles.eduLabel}`}>Degree</span>
              <span className={styles.eduValue}>{personalInfo.degree}</span>
            </div>
            <div className={styles.eduItem}>
              <span className={`mono ${styles.eduLabel}`}>Timeline</span>
              <span className={styles.eduValue}>{personalInfo.gradDate}</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className={styles.skillsWrap}>
          <h3 className={styles.skillsTitle}>Technologies</h3>
          <div className={styles.skillGrid}>
            {skills.map((s) => (
              <span key={s.name} className="pill">{s.name}</span>
            ))}
          </div>
          <h3 className={styles.skillsTitle} style={{ marginTop: 28 }}>Certifications</h3>
          <div className={styles.certList}>
            {certifications.map((c) => (
              <div key={c} className={styles.certItem}>
                <span className={styles.certDot} />
                {c}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
