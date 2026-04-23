"use client";
import Image from "next/image";
import { projects } from "@/data/portfolio";
import ScrollReveal from "./ScrollReveal";
import styles from "./Projects.module.css";

export default function Projects() {
  return (
    <section className="section" id="projects">
      <ScrollReveal>
        <p className="section-label">03 — Projects</p>
        <h2 className="section-title">Things I&apos;ve built</h2>
      </ScrollReveal>

      <div className={styles.grid}>
        {projects.map((p, i) => (
          <ScrollReveal key={p.id} delay={i * 0.1}>
            <article className={`${styles.card} card`}>
              {p.imageUrl && (
                <div className={styles.imageWrap}>
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className={styles.cardTop}>
                <div className={styles.folder}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                  </svg>
                </div>
                <div className={styles.links}>
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={styles.extLink}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    </a>
                  )}
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" aria-label="Live demo" className={styles.extLink}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                    </a>
                  )}
                </div>
              </div>

              <h3 className={styles.title}>{p.title}</h3>
              <p className={styles.subtitle}>{p.subtitle}</p>
              <p className={styles.desc}>{p.description}</p>

              <div className={styles.techRow}>
                {p.tech.map((t) => (
                  <span key={t} className={`mono ${styles.tech}`}>{t}</span>
                ))}
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
