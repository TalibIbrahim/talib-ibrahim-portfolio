'use client';

import React, { useState, useCallback } from 'react';
import { portfolioData } from '@/data/portfolio';
import type { Project } from '@/data/types';
import { playClickChime, playHoverBeep } from '@/utils/audioSynth';
import styles from './PragmaticView.module.css';

export interface PragmaticViewProps {
  readonly className?: string;
}

interface CoreTechItem {
  readonly name: string;
  readonly role: string;
  readonly category: string;
}

const CORE_STACK: readonly CoreTechItem[] = [
  { name: 'TypeScript', role: 'Strict Typing & Enterprise Contracts', category: 'Language' },
  { name: 'Next.js', role: 'SSR, App Router, Route Handlers', category: 'Framework' },
  { name: 'Node.js', role: 'Backend Services & Event Emitters', category: 'Runtime' },
  { name: 'WebRTC', role: 'P2P Real-time & Media Streaming', category: 'Networking' },
  { name: 'MongoDB', role: 'Document Database & Aggregations', category: 'Database' },
  { name: 'LangChain', role: 'RAG Pipelines & Agent Orchestration', category: 'AI Architecture' },
];

// Targeted project IDs for Stage 2 fact-first record
const TARGET_PROJECT_IDS = ['gitchat', 'radix', 'solara', 'slingkick'] as const;

/**
 * PragmaticView renders Stage 2 of the Intensity progression.
 * High-density, fact-first engineering record highlighting verified track record,
 * selected works (GitChat, Radix Systems, Solara, SlingKick), core tech stack, and functional comms.
 */
export default function PragmaticView({ className = '' }: PragmaticViewProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // Filter projects to ensure GitChat, Radix Systems, Solara, and SlingKick are prominently displayed
  const selectedProjects: readonly Project[] = portfolioData.projects.filter((p) =>
    (TARGET_PROJECT_IDS as readonly string[]).includes(p.id)
  );

  const copyEmail = useCallback(async () => {
    playClickChime();
    try {
      await navigator.clipboard.writeText('talibibrahim04@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }, []);

  return (
    <article className={`${styles.container} ${className}`.trim()}>
      {/* Fact-First Direct Confident Statement */}
      <header className={styles.heroSection}>
        <div className={styles.stageIdentifier}>
          <span aria-hidden="true">■</span> 02 // PRAGMATIC PRESENTATION
        </div>
        <h1 className={styles.heroHeadline}>
          ENGINEERING SYSTEMS THAT SHIP &amp; SCALE
        </h1>
        <p className={styles.confidentStatement}>
          I am <span className={styles.strongHighlight}>Muhammad Talib Ibrahim</span>, a software engineer
          based in Lahore, Pakistan. I build reliable full-stack applications, real-time networking protocols,
          and production RAG pipelines. My focus is deterministic execution, zero unnecessary abstractions,
          and robust infrastructure that performs under load.
        </p>

        <div className={styles.credentialGrid}>
          <div className={styles.credentialCard}>
            <span className={styles.credValue}>3.6 GPA</span>
            <span className={styles.credLabel}>BS Computer Science · UMT Lahore</span>
          </div>
          <div className={styles.credentialCard}>
            <span className={styles.credValue}>6+ SYSTEMS</span>
            <span className={styles.credLabel}>Shipped Production Applications</span>
          </div>
          <div className={styles.credentialCard}>
            <span className={styles.credValue}>LEAD DEV</span>
            <span className={styles.credLabel}>Google Developer Group (GDGoC) UMT</span>
          </div>
          <div className={styles.credentialCard}>
            <span className={styles.credValue}>100% COMMITTED</span>
            <span className={styles.credLabel}>Full-Time &amp; High-Impact Contract Work</span>
          </div>
        </div>
      </header>

      {/* Core Tech Stack Badge Array */}
      <section className={styles.stackSection} aria-label="Core Technology Stack">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>CORE TECHNOLOGY STACK</h2>
          <span className={styles.sectionSub}>PRIMARY PRODUCTION TOOLING</span>
        </div>

        <div className={styles.stackGrid}>
          {CORE_STACK.map((item) => (
            <div
              key={item.name}
              className={styles.stackBadge}
              onMouseEnter={playHoverBeep}
            >
              <div className={styles.stackName}>
                <span>{item.name}</span>
                <span className={styles.stackDot} aria-hidden="true" />
              </div>
              <span className={styles.stackDesc}>{item.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Works Grid */}
      <section className={styles.worksSection} aria-label="Selected Production Works">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>SELECTED WORKS</h2>
          <span className={styles.sectionSub}>VERIFIED ENGINEERING IMPLEMENTATIONS</span>
        </div>

        <div className={styles.projectsGrid}>
          {selectedProjects.map((project) => (
            <div
              key={project.id}
              className={styles.projectCard}
            >
              <div className={styles.projectCardHeader}>
                <div className={styles.projectCardMeta}>
                  <span className={styles.projectId}>{'//'} PROJECT: {project.id}</span>
                </div>
                <h3 className={styles.projectTitle}>{project.title}</h3>
              </div>

              <p className={styles.projectDesc}>{project.description}</p>

              {project.architectureHighlights.length > 0 && (
                <ul className={styles.highlightsList}>
                  {project.architectureHighlights.map((hl, i) => (
                    <li key={i} className={styles.highlightItem}>
                      <span className={styles.highlightBullet} aria-hidden="true">▸</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className={styles.tagRow}>
                {project.techTags.map((tag) => (
                  <span key={tag} className={styles.tagBadge}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className={styles.projectActions}>
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playHoverBeep}
                    onClick={playClickChime}
                    className={`${styles.projectBtn} ${styles.projectBtnPrimary}`}
                  >
                    LIVE DEMO ↗
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playHoverBeep}
                    onClick={playClickChime}
                    className={`${styles.projectBtn} ${styles.projectBtnSecondary}`}
                  >
                    GITHUB ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Simple Functional Contact Section */}
      <section className={styles.contactSection} aria-label="Direct Communication">
        <div className={styles.contactContent}>
          <div className={styles.contactInfoCol}>
            <h2 className={styles.contactTitle}>TRANSMIT COMM &amp; INQUIRIES</h2>
            <p className={styles.contactText}>
              Open for software engineering positions, infrastructure contracts, and high-impact web architecture roles.
              Reach out directly for discussions, code reviews, or resume delivery.
            </p>
          </div>

          <div className={styles.contactActionCol}>
            <a
              href="mailto:talibibrahim04@gmail.com?subject=Software%20Engineering%20Opportunity%20-%20Muhammad%20Talib%20Ibrahim"
              onMouseEnter={playHoverBeep}
              onClick={playClickChime}
              className={styles.contactMainBtn}
            >
              EMAIL: TALIBIBRAHIM04@GMAIL.COM ↗
            </a>

            <div className={styles.contactSecondaryRow}>
              <button
                type="button"
                onClick={copyEmail}
                onMouseEnter={playHoverBeep}
                className={`${styles.contactSecBtn} ${copied ? styles.copiedTag : ''}`}
              >
                {copied ? '✓ COPIED EMAIL' : '[ COPY EMAIL ]'}
              </button>

              <a
                href="mailto:talibibrahim04@gmail.com?subject=Resume%20Request%20-%20Muhammad%20Talib%20Ibrahim"
                onMouseEnter={playHoverBeep}
                onClick={playClickChime}
                className={styles.contactSecBtn}
              >
                [ REQUEST RESUME ]
              </a>
            </div>

            <div className={styles.contactSecondaryRow}>
              <a
                href="https://github.com/TalibIbrahim"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHoverBeep}
                onClick={playClickChime}
                className={styles.contactSecBtn}
              >
                GITHUB PROFILE ↗
              </a>

              <a
                href="https://www.linkedin.com/in/muhammad-talib-ibrahim"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHoverBeep}
                onClick={playClickChime}
                className={styles.contactSecBtn}
              >
                LINKEDIN NETWORK ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
