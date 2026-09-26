'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import SkillsMatrix from './SkillsMatrix';
import BentoShowcase from './BentoShowcase';
import ExperienceTimeline from './ExperienceTimeline';
import Contact from './Contact';
import { playClickChime, playHoverBeep } from '@/utils/audioSynth';
import styles from './ArchitectView.module.css';

export interface ArchitectViewProps {
  readonly className?: string;
}

const TELEMETRY_CARDS = [
  { key: 'RUNTIME ENGINE', val: 'Node.js & Next.js App Router (React 19 Server Components)' },
  { key: 'DISTRIBUTED ARCHITECTURE', val: 'WebRTC P2P mesh & low-latency WebSocket signaling' },
  { key: 'VECTOR RETRIEVAL', val: 'RAG pipelines with chunked embeddings & Ollama models' },
  { key: 'PERSISTENCE TIERS', val: 'MongoDB document store & Upstash Redis memory layer' },
] as const;

/**
 * ArchitectView renders Stage 3 of the Intensity progression.
 * Prioritizes deep systems architecture, competency telemetry, project blueprints,
 * and engineering career trajectory.
 */
export default function ArchitectView({ className = '' }: ArchitectViewProps) {
  const handleScrollTo = (elementId: string) => {
    playClickChime();
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <article className={`${styles.container} ${className}`.trim()}>
      {/* Architectural Headline & Telemetry Masthead */}
      <header className={styles.masthead}>
        <div className={styles.systemBadge}>
          <span className={styles.systemDot} aria-hidden="true" />
          <span>03 // ARCHITECTURAL TELEMETRY &amp; SYSTEMS RADAR</span>
        </div>

        <h1 className={styles.headline}>
          SYSTEMS ARCHITECTURE &amp; FULL-STACK TOPOLOGY
        </h1>

        <p className={styles.leadText}>
          Technical deep-dive into distributed systems, real-time networking stacks, vector retrieval pipelines,
          and robust production architectures engineered by Muhammad Talib Ibrahim.
        </p>

        {/* Telemetry Ribbon */}
        <div className={styles.telemetryGrid}>
          {TELEMETRY_CARDS.map((card) => (
            <div
              key={card.key}
              className={styles.telemetryCard}
              onMouseEnter={playHoverBeep}
            >
              <span className={styles.telemetryKey}>{'//'} {card.key}</span>
              <span className={styles.telemetryVal}>{card.val}</span>
            </div>
          ))}
        </div>

        {/* Rapid Jump Navigation */}
        <nav className={styles.jumpNav} aria-label="Architecture sections quick navigation">
          <span className={styles.jumpNavLabel}>JUMP TELEMETRY:</span>
          <button
            type="button"
            onClick={() => handleScrollTo('skills-radar')}
            onMouseEnter={playHoverBeep}
            className={styles.jumpAnchor}
          >
            [ 01 // COMPETENCIES ]
          </button>
          <button
            type="button"
            onClick={() => handleScrollTo('projects-bento')}
            onMouseEnter={playHoverBeep}
            className={styles.jumpAnchor}
          >
            [ 02 // PROJECT BLUEPRINTS ]
          </button>
          <button
            type="button"
            onClick={() => handleScrollTo('experience-timeline')}
            onMouseEnter={playHoverBeep}
            className={styles.jumpAnchor}
          >
            [ 03 // TRAJECTORY ]
          </button>
          <button
            type="button"
            onClick={() => handleScrollTo('contact-protocol')}
            onMouseEnter={playHoverBeep}
            className={styles.jumpAnchor}
          >
            [ 04 // COMM TRANSMISSION ]
          </button>
        </nav>
      </header>

      {/* Sections Area: Radar, Blueprints, Trajectory, Contact */}
      <div className={styles.sectionsArea}>
        <section id="skills-radar" aria-label="Technical Competencies Radar">
          <SkillsMatrix competencies={portfolioData.competencies} />
        </section>

        <section id="projects-bento" aria-label="System Implementations & Blueprints">
          <BentoShowcase projects={portfolioData.projects} />
        </section>

        <section id="experience-timeline" aria-label="Engineering Career Trajectory">
          <ExperienceTimeline experiences={portfolioData.experience} />
        </section>

        <section id="contact-protocol" aria-label="Communication Transmission Protocol">
          <Contact id="contact" />
        </section>
      </div>
    </article>
  );
}
