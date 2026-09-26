'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Terminal } from 'lucide-react';
import styles from './NothingTheme.module.css';

export default function NothingProjects() {
  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionFig}>(FIG. 01 — 03) // CORE MODULES</div>
        <h2 className={styles.sectionTitle}>SELECTED WORKS</h2>
      </div>

      {/* ════ FLAGSHIP #1: BYTERS ════ */}
      <motion.div
        className={styles.flagshipCard}
        initial={{ opacity: 0, y: 90, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      >
        <div className={styles.flagshipBody}>
          <div className={styles.partNoHeader}>
            <span className={styles.partNo}>MOD-BYTERS-01 // REV 4.2</span>
            <span className={styles.surgicalBadge}>FLAGSHIP</span>
          </div>

          <h3 className={styles.flagshipTitle}>BYTERS</h3>
          <p className={styles.flagshipSubtitle}>
            Full-stack AI-driven multi-tenant culinary discovery and group ordering platform.
            Engineered with vector similarity recommendations and live room synchronization.
          </p>

          <div className={styles.featureSpecList}>
            <div className={styles.featureSpecItem}>
              <span className={styles.specSquare} />
              <span>
                <strong>Vector Search Engine:</strong> MongoDB Atlas Vector Search indexing text embeddings for semantic meal recommendation based on dietary preferences and flavor profiles.
              </span>
            </div>
            <div className={styles.featureSpecItem}>
              <span className={styles.specSquare} />
              <span>
                <strong>WebSocket Group Rooms:</strong> Realtime multi-client cart coordination with instant price recalculation, host permission states, and shared checkout.
              </span>
            </div>
            <div className={styles.featureSpecItem}>
              <span className={styles.specSquare} />
              <span>
                <strong>Multi-Stage Order Telemetry:</strong> Live order dispatch state machine, progress tracking, and estimated delivery windows.
              </span>
            </div>
            <div className={styles.featureSpecItem}>
              <span className={styles.specSquare} />
              <span>
                <strong>Catalog & Filtering:</strong> Multi-restaurant discovery matrix with category filters, dynamic search indexing, and real-time inventory checks.
              </span>
            </div>
            <div className={styles.featureSpecItem}>
              <span className={styles.specSquare} />
              <span>
                <strong>Account Dashboard:</strong> Saved dining locations, historical transaction ledger, and favorite restaurant bookmarking.
              </span>
            </div>
          </div>

          <div className={styles.flagshipActions}>
            <a
              href="https://byters.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSolid}
            >
              <span>LAUNCH BYTERS</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="https://github.com/TalibIbrahim"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnOutline}
            >
              <span>INSPECT REPO</span>
              <Terminal size={14} />
            </a>
          </div>
        </div>

        <div className={styles.flagshipMediaCol}>
          <div className={styles.flagshipScreenshotCard}>
            <Image
              src="https://res.cloudinary.com/dk5pnej6r/image/upload/v1776194008/Radix%20Systems/cfaca28d-245a-47d2-b658-879a9d8d3c4c.png"
              alt="Byters Architecture Hardware View"
              fill
              sizes="(max-width: 900px) 100vw, 500px"
              className={styles.flagshipImage}
            />
          </div>
        </div>
      </motion.div>

      {/* ════ SECONDARY GRID: #2 QUICKDROP & #3 GITCHAT ════ */}
      <div className={styles.secondaryProjectsGrid}>
        {/* Project #2: QuickDrop */}
        <motion.div
          className={styles.secondaryCard}
          initial={{ opacity: 0, x: -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        >
          <div className={styles.secondaryHeader}>
            <span className={styles.partNo}>MOD-QDROP-02 // P2P</span>
            <span className={styles.secondaryFigBadge}>
              FIG. 02
            </span>
          </div>

          <h3 className={styles.secondaryTitle}>QUICKDROP</h3>
          <p className={styles.secondaryDesc}>
            Direct browser-to-browser peer-to-peer file transfer engine.
            Eliminates intermediate file upload servers by orchestrating WebRTC DataChannels for end-to-end encrypted chunked byte streams.
          </p>

          <div className={styles.chipList}>
            <span className={styles.hardwareChip}>WebRTC DataChannel</span>
            <span className={styles.hardwareChip}>PeerJS Signaler</span>
            <span className={styles.hardwareChip}>ArrayBuffer Streams</span>
            <span className={styles.hardwareChip}>QR Connect</span>
          </div>

          <div className={styles.secondaryActions}>
            <a
              href="https://quickdrop-file.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnOutline}
            >
              <span>LAUNCH APP</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="https://github.com/TalibIbrahim"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnOutline}
            >
              <span>SOURCE CODE</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>

        {/* Project #3: GitChat */}
        <motion.div
          className={styles.secondaryCard}
          initial={{ opacity: 0, x: 70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 24, delay: 0.08 }}
        >
          <div className={styles.secondaryHeader}>
            <span className={styles.partNo}>MOD-GCHAT-03 // RAG</span>
            <span className={styles.secondaryFigBadge}>
              FIG. 03
            </span>
          </div>

          <h3 className={styles.secondaryTitle}>GITCHAT</h3>
          <p className={styles.secondaryDesc}>
            Retrieval-Augmented Generation assistant for GitHub repositories.
            Tokenizes source trees into an AST vector store to deliver context-anchored code analysis and explanations.
          </p>

          <div className={styles.chipList}>
            <span className={styles.hardwareChip}>LangChain</span>
            <span className={styles.hardwareChip}>Atlas Vector Search</span>
            <span className={styles.hardwareChip}>Octokit GitHub API</span>
            <span className={styles.hardwareChip}>Next.js 14</span>
          </div>

          <div className={styles.secondaryActions}>
            <a
              href="https://github.com/TalibIbrahim/GitChat"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnOutline}
            >
              <span>SOURCE CODE</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
