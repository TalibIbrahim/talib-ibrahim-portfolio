'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Activity } from 'lucide-react';
import styles from './MSportTheme.module.css';

const mTransition = {
  duration: 0.6,
  ease: [0.2, 0.8, 0.2, 1] as const,
};

export default function MSportHero() {
  return (
    <section id="overview" className={styles.heroSection}>
      <motion.div
        className={styles.heroContent}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={mTransition}
      >
        <div className={styles.telemetryTag}>
          <span className={styles.telemetryDot} />
          <span className={styles.telemetryText}>
            POWER-UNIT: ACTIVE // 115° CANTED SPEC // LAHORE, PK
          </span>
        </div>

        <h1 className={styles.heroTitle}>
          MUHAMMAD TALIB IBRAHIM.
          <br />
          <span className={styles.heroTitleHighlight}>FULL-STACK ARCHITECT.</span>
        </h1>

        <p className={styles.heroSubhead}>
          High-cadence software engineering built for zero packet loss and high concurrency.
          From low-latency WebRTC data channels to dense AI vector recommendation engines.
        </p>

        <div className={styles.heroActions}>
          <a href="#projects" className={styles.btnPrimary}>
            <span>ENGAGE SELECTED WORKS</span>
            <ArrowRight size={16} />
          </a>
          <a href="#contact" className={styles.btnSecondary}>
            <span>REQUEST CREDENTIALS</span>
            <ChevronRight size={16} />
          </a>
        </div>

        {/* 0-60 Style Telemetry Stat Blocks */}
        <div className={styles.telemetryGrid}>
          <div className={styles.statBlock}>
            <div className={styles.statValue}>0.42s</div>
            <div className={styles.statLabel}>TTI BENCHMARK</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statValue}>99.8%</div>
            <div className={styles.statLabel}>P2P TRANSFER EFFICIENCY</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statValue}>3.60</div>
            <div className={styles.statLabel}>GPA RECORD (UMT)</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statValue}>&lt;45ms</div>
            <div className={styles.statLabel}>VECTOR LATENCY</div>
          </div>
        </div>
      </motion.div>

      {/* Hero Instrument Cluster */}
      <motion.div
        className={styles.clusterCard}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...mTransition, delay: 0.15 }}
      >
        <div className={styles.clusterHeader}>
          <div className={styles.clusterTitle}>
            <Activity size={16} color="#f11a22" />
            <span>PRIMARY PILOT RECORD</span>
          </div>
          <div className={styles.clusterStatus}>{'///M TELEMETRY'}</div>
        </div>

        <div className={styles.clusterPhotoWrapper}>
          <Image
            src="/talib.png"
            alt="Muhammad Talib Ibrahim"
            fill
            sizes="(max-width: 900px) 280px, 320px"
            className={styles.clusterPhotoImage}
            priority
          />
          <div className={styles.clusterCrosshair} />
        </div>

        <div className={styles.clusterFooterTelemetry}>
          <div>
            <div>PILOT: M. TALIB IBRAHIM</div>
            <div>SPEC: BS COMP SCI (2023-2027)</div>
          </div>
          <div>
            <div>STATUS: READY TO DEPLOY</div>
            <div>LOCATION: LAHORE // UTC+5</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
