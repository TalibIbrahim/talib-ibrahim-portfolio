'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Terminal } from 'lucide-react';
import styles from './MSportTheme.module.css';

export default function MSportProjects() {
  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTag}>TELEMETRY // SELECTED WORKS</div>
        <h2 className={styles.sectionTitle}>
          HIGH-PERFORMANCE <span className={styles.heroTitleHighlight}>BUILDS</span>
        </h2>
      </div>

      {/* ════ FLAGSHIP #1: BYTERS ════ */}
      <motion.div
        className={styles.flagshipCard}
        initial={{ opacity: 0, x: -90 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className={styles.flagshipStripeAccent} />

        <div className={styles.flagshipBody}>
          <div className={styles.flagshipRankBadge}>
            FLAGSHIP 01 // M-SPEC ARCHITECTURE
          </div>

          <h3 className={styles.flagshipTitle}>BYTERS</h3>
          <p className={styles.flagshipSubtitle}>
            Full-stack AI-driven multi-vendor culinary ordering engine with real-time room synchronization.
          </p>

          <div className={styles.flagshipFeatureList}>
            <div className={styles.flagshipFeatureItem}>
              <span className={styles.featureDot} />
              <span>
                <strong>AI Vector Search:</strong> Atlas Vector Search with OpenAI text-embedding-3 embeddings for semantic meal matching based on flavor profile and dietary constraints.
              </span>
            </div>
            <div className={styles.flagshipFeatureItem}>
              <span className={styles.featureDot} />
              <span>
                <strong>Realtime Group Cart Rooms:</strong> WebSocket-powered room synchronization allowing multi-device live joint carts, host approvals, and synchronized checkout state.
              </span>
            </div>
            <div className={styles.flagshipFeatureItem}>
              <span className={styles.featureDot} />
              <span>
                <strong>Live Order Tracking & Estimation:</strong> Multi-stage order dispatch pipeline with live stage telemetry, driver simulation, and dynamic delivery window calculation.
              </span>
            </div>
            <div className={styles.flagshipFeatureItem}>
              <span className={styles.featureDot} />
              <span>
                <strong>Multi-Restaurant Catalog:</strong> Dynamic categorization, allergen filtering, price-tier querying, and indexed restaurant discovery.
              </span>
            </div>
            <div className={styles.flagshipFeatureItem}>
              <span className={styles.featureDot} />
              <span>
                <strong>Customer & Vendor Telemetry:</strong> Dense order history analytics, favorite vendor bookmarking, address ledger, and transaction reporting.
              </span>
            </div>
          </div>

          <div className={styles.flagshipTelemetryGrid}>
            <div className={styles.specPill}>
              <div className={styles.specPillLabel}>FRAMEWORK</div>
              <div className={styles.specPillVal}>Next.js 14 App Router</div>
            </div>
            <div className={styles.specPill}>
              <div className={styles.specPillLabel}>VECTOR DB</div>
              <div className={styles.specPillVal}>MongoDB Atlas KNN</div>
            </div>
            <div className={styles.specPill}>
              <div className={styles.specPillLabel}>CONCURRENCY</div>
              <div className={styles.specPillVal}>Socket.IO WebSockets</div>
            </div>
          </div>

          <div className={styles.flagshipActions}>
            <a
              href="https://byters.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              <span>LAUNCH BYTERS</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="https://github.com/TalibIbrahim"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              <span>INSPECT CODEBASE</span>
              <Terminal size={14} />
            </a>
          </div>
        </div>

        <div className={styles.flagshipMediaCol}>
          <div className={styles.flagshipScreenshotCard}>
            <Image
              src="https://res.cloudinary.com/dk5pnej6r/image/upload/v1776194008/Radix%20Systems/cfaca28d-245a-47d2-b658-879a9d8d3c4c.png"
              alt="Byters Architecture Interface"
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
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className={styles.secondaryCardHeader}>
            <span className={styles.rankBadgeSmall}>PROJECT 02 // P2P DATA TRANSFER</span>
            <span className={styles.statLabel}>LATENCY: 0 HOP</span>
          </div>

          <h3 className={styles.secondaryTitle}>QUICKDROP</h3>
          <p className={styles.secondaryDesc}>
            High-throughput browser-to-browser peer-to-peer file transfer engine.
            Bypasses central storage by establishing direct WebRTC DataChannels for end-to-end encrypted chunked byte streams.
          </p>

          <div className={styles.telemetryBadgeList}>
            <span className={styles.telemetryChip}>WebRTC DataChannel</span>
            <span className={styles.telemetryChip}>PeerJS Signaler</span>
            <span className={styles.telemetryChip}>Chunked ArrayBuffer</span>
            <span className={styles.telemetryChip}>QR Handshake</span>
          </div>

          <div className={styles.secondaryActions}>
            <a
              href="https://quickdrop-file.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              <span>LAUNCH APP</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="https://github.com/TalibIbrahim"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              <span>SOURCE</span>
              <Terminal size={14} />
            </a>
          </div>
        </motion.div>

        {/* Project #3: GitChat */}
        <motion.div
          className={styles.secondaryCard}
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
        >
          <div className={styles.secondaryCardHeader}>
            <span className={styles.rankBadgeSmall}>PROJECT 03 // VECTOR RAG ENGINE</span>
            <span className={styles.statLabel}>CONTEXT: EMBEDDED</span>
          </div>

          <h3 className={styles.secondaryTitle}>GITCHAT</h3>
          <p className={styles.secondaryDesc}>
            Retrieval-Augmented Generation agent for GitHub repositories.
            Clones, tokenizes, and indexes source trees into an AST vector store to deliver source-anchored reasoning across large codebases.
          </p>

          <div className={styles.telemetryBadgeList}>
            <span className={styles.telemetryChip}>LangChain</span>
            <span className={styles.telemetryChip}>Atlas Vector Search</span>
            <span className={styles.telemetryChip}>Octokit GitHub API</span>
            <span className={styles.telemetryChip}>Next.js 14</span>
          </div>

          <div className={styles.secondaryActions}>
            <a
              href="https://github.com/TalibIbrahim/GitChat"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              <span>SOURCE REPO</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
