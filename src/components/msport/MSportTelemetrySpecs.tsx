'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Award } from 'lucide-react';
import styles from './MSportTheme.module.css';

const RPM_SKILLS = [
  { skill: 'TypeScript & Next.js 14', level: 98, note: 'REDLINE // PRODUCTION APP ROUTER' },
  { skill: 'Node.js & WebSocket Concurrency', level: 95, note: 'REDLINE // LOW-LATENCY SOCKET.IO' },
  { skill: 'Atlas Vector Search & AI RAG', level: 92, note: 'OPTIMAL // EMBEDDINGS RETRIEVAL' },
  { skill: 'WebRTC P2P DataChannels', level: 90, note: 'HIGH // ZERO RELAY SERVER STREAM' },
  { skill: 'MongoDB Atlas & SQL Relational', level: 93, note: 'OPTIMAL // SCHEMA DESIGN & INDEXING' },
  { skill: 'Systems, C++ & Algorithms', level: 88, note: 'CALIBRATED // MEMORY & DATA STRUCTURES' },
];

export default function MSportTelemetrySpecs() {
  return (
    <section id="benchmarks" className={styles.benchmarksSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTag}>BENCHMARKS // RPM GAUGES</div>
        <h2 className={styles.sectionTitle}>
          ENGINEERING <span className={styles.heroTitleHighlight}>TELEMETRY</span>
        </h2>
      </div>

      <div className={styles.rpmGaugesGrid}>
        {RPM_SKILLS.map((item, index) => (
          <motion.div
            key={item.skill}
            className={styles.gaugeCard}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1], delay: index * 0.07 }}
          >
            <div className={styles.gaugeHeader}>
              <span className={styles.gaugeSkillName}>{item.skill}</span>
              <span className={styles.gaugeValue}>{item.level}% RPM</span>
            </div>

            <div className={styles.gaugeTrack}>
              <div
                className={styles.gaugeFill}
                style={{ width: `${item.level}%` }}
              />
            </div>

            <div className={styles.gaugeNote}>{item.note}</div>
          </motion.div>
        ))}
      </div>

      {/* Engineering Record & Academic Credentials */}
      <div className={styles.secondaryProjectsGrid}>
        <motion.div
          className={styles.secondaryCard}
          initial={{ opacity: 0, x: -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className={styles.secondaryCardHeader}>
            <div className={styles.clusterTitle}>
              <Cpu size={16} color="#008ac9" />
              <span>ACADEMIC FOUNDATION</span>
            </div>
            <span className={styles.statLabel}>UMT LAHORE</span>
          </div>

          <h3 className={styles.secondaryTitle}>BS COMPUTER SCIENCE</h3>
          <p className={styles.secondaryDesc}>
            Cumulative 3.60 GPA with consistent Department Honors. Core focus on distributed systems, data structures, network protocols, and artificial intelligence architecture.
          </p>

          <div className={styles.telemetryBadgeList}>
            <span className={styles.telemetryChip}>3.60 GPA</span>
            <span className={styles.telemetryChip}>Merit Scholar</span>
            <span className={styles.telemetryChip}>Expected Grad: 2027</span>
          </div>
        </motion.div>

        <motion.div
          className={styles.secondaryCard}
          initial={{ opacity: 0, x: 70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
        >
          <div className={styles.secondaryCardHeader}>
            <div className={styles.clusterTitle}>
              <Award size={16} color="#f11a22" />
              <span>VERIFIED ACCREDITATIONS</span>
            </div>
            <span className={styles.statLabel}>LICENSED</span>
          </div>

          <h3 className={styles.secondaryTitle}>ENGINEERING CERTIFICATES</h3>
          <p className={styles.secondaryDesc}>
            Rigorous full-stack and modern frontend accreditations completed under industry-leading curriculums:
          </p>

          <div className={styles.telemetryBadgeList}>
            <span className={styles.telemetryChip}>The MERN Fullstack Guide</span>
            <span className={styles.telemetryChip}>React & Next.js Complete Guide</span>
            <span className={styles.telemetryChip}>Google AI Fundamentals</span>
            <span className={styles.telemetryChip}>Mindstorm Game Jam 2024</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
