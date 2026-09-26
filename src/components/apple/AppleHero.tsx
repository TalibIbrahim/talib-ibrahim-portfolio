'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import styles from './AppleTheme.module.css';

const appleTransition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1] as const,
};

export default function AppleHero() {
  return (
    <section id="overview" className={styles.heroSection}>
      <div className={styles.heroBackdropWrapper} aria-hidden="true">
        <motion.div
          className={styles.heroPortraitContainer}
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/talib.png"
            alt="Muhammad Talib Ibrahim"
            width={560}
            height={680}
            className={styles.heroSharpPortrait}
            priority
          />
          <Image
            src="/talib.png"
            alt=""
            width={560}
            height={680}
            className={styles.heroBlurredPortrait}
            priority
            aria-hidden="true"
          />
        </motion.div>
      </div>

      <div className={styles.heroTextContent}>
        <div className={styles.heroTextScrim} aria-hidden="true" />
        <motion.p
          className={styles.heroEyebrow}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...appleTransition, delay: 0.1 }}
        >
          Software Engineer. Systems Builder.
        </motion.p>

        <motion.h1
          className={styles.heroHeadline}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...appleTransition, delay: 0.2 }}
        >
          Muhammad Talib Ibrahim.
        </motion.h1>

        <motion.p
          className={styles.heroSubhead}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...appleTransition, delay: 0.3 }}
        >
          Building scalable web applications with modern JavaScript — from real-time WebRTC networks to vector RAG pipelines.
        </motion.p>

        <motion.div
          className={styles.heroActions}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...appleTransition, delay: 0.4 }}
        >
          <a href="#byters" className={styles.primaryPillBtn}>
            Explore Selected Works
          </a>
          <a href="#contact" className={styles.secondaryLink}>
            <span>Request Resume</span>
            <ArrowRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
