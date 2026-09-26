'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Crosshair, Terminal } from 'lucide-react';
import styles from './NothingTheme.module.css';

const nothingTransition = {
  duration: 0.5,
  ease: [0.1, 0.9, 0.2, 1] as const,
};

export default function NothingHero() {
  const [timeStr, setTimeStr] = useState('08:00:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Karachi',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="system" className={styles.heroSection}>
      <motion.div
        className={styles.heroContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={nothingTransition}
      >
        <div className={styles.hardwareTag}>
          <span className={styles.redDot} />
          <span>FIG. 00 // SYSTEM.INIT // DEV-TALIB-PK</span>
        </div>

        <h1 className={styles.heroTitle}>
          <span className={styles.heroTitleRed}>MUHAMMAD TALIB</span>
          <br />
          IBRAHIM
        </h1>

        <p className={styles.heroSubhead}>
          Full-stack software architect specializing in distributed real-time systems,
          high-throughput WebRTC data channels, and vector-similarity search engines.
          Engineered with uncompromising precision.
        </p>

        <div className={styles.heroActions}>
          <a href="#projects" className={styles.btnSolid}>
            <span>ENGAGE BUILDS</span>
            <ArrowRight size={14} />
          </a>
          <a href="#contact" className={styles.btnOutline}>
            <span>REQUEST DOSSIER</span>
            <Terminal size={14} />
          </a>
        </div>

        <div className={styles.hardwareStrip}>
          <div className={styles.stripItem}>
            <div className={styles.stripLabel}>ACADEMIC RECORD</div>
            <div className={styles.stripValue}>3.60 GPA</div>
          </div>
          <div className={styles.stripItem}>
            <div className={styles.stripLabel}>P2P EFFICIENCY</div>
            <div className={styles.stripValue}>100% DIRECT</div>
          </div>
          <div className={styles.stripItem}>
            <div className={styles.stripLabel}>EMBEDDINGS</div>
            <div className={styles.stripValue}>KNN ATLAS</div>
          </div>
          <div className={styles.stripItem}>
            <div className={styles.stripLabel}>STATUS</div>
            <div className={`${styles.stripValue} ${styles.statusNominal}`}>
              NOMINAL
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Column: Hardware Widget & Circular Clock */}
      <motion.div
        className={styles.hardwareWidgetCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...nothingTransition, delay: 0.15 }}
      >
        <div className={styles.cardCrosshairTL} />
        <div className={styles.cardCrosshairBR} />

        <div className={styles.widgetHeader}>
          <span className={styles.widgetTitle}>(HARDWARE WIDGET: CLOCK-01)</span>
          <Crosshair size={14} color="#5A5A62" />
        </div>

        {/* Circular Clock Dial */}
        <div className={styles.clockDialWrapper}>
          <div className={styles.clockRing}>
            <div className={styles.clockInner}>
              <div className={styles.clockTime}>{timeStr}</div>
              <div className={styles.clockZone}>LAHORE // UTC+5</div>
            </div>
          </div>
        </div>

        {/* Hardware Pilot Photo */}
        <div className={styles.hardwarePilotPhoto}>
          <Image
            src="/talib.png"
            alt="Muhammad Talib Ibrahim"
            fill
            sizes="(max-width: 900px) 100vw, 360px"
            className={styles.pilotImage}
            priority
          />
        </div>

        <div className={styles.pilotMeta}>
          <span>CHASSIS: WHITE FROSTED</span>
          <span>BATT: 100% [CHARGED]</span>
        </div>
      </motion.div>
    </section>
  );
}
