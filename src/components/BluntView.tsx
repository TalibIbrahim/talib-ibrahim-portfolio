'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClickChime, playHoverBeep } from '@/utils/audioSynth';
import styles from './BluntView.module.css';

const BLUNT_QUOTES = [
  'I write software. It works, it doesn\'t break, and it ships on time. So what.',
  'I engineer systems and build web applications in Lahore. No buzzwords, no hand-waving, just clean code that handles production load.',
  'Software engineer. I build RAG pipelines, WebRTC networks, and full-stack products. Tell me what you need built, or don\'t.',
] as const;

export interface BluntViewProps {
  readonly className?: string;
}

/**
 * BluntView renders Stage 1 of the Intensity spectrum.
 * Ultra-minimalist, editorial, high-contrast brutalist presentation inspired by getcoleman.com.
 * Zero WebGL overhead, instant text rendering, direct contact channels, and honest copy.
 */
export default function BluntView({ className = '' }: BluntViewProps) {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const cycleQuote = useCallback(() => {
    playClickChime();
    setActiveQuoteIndex((prev) => (prev + 1) % BLUNT_QUOTES.length);
  }, []);

  const selectQuote = useCallback((index: number) => {
    playClickChime();
    setActiveQuoteIndex(index);
  }, []);

  const copyEmailToClipboard = useCallback(async () => {
    playClickChime();
    try {
      await navigator.clipboard.writeText('talibibrahim04@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback if clipboard API is denied
      setCopied(false);
    }
  }, []);

  const handleResumeRequest = useCallback(() => {
    playClickChime();
    const contactElement = document.getElementById('contact-box');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href =
        'mailto:talibibrahim04@gmail.com?subject=Resume%20Request%20-%20Muhammad%20Talib%20Ibrahim&body=Hi%20Talib%2C%20I%20would%20like%20to%20review%20your%20resume%20for%20a%20software%20engineering%20opportunity.';
    }
  }, []);

  return (
    <article className={`${styles.container} ${className}`.trim()}>
      {/* Editorial Top Bar */}
      <header className={styles.metaHeader}>
        <div className={styles.statusTag}>
          <span className={styles.statusDot} aria-hidden="true" />
          <span>STATUS: OPEN FOR COMMISSIONS & FULL-TIME ROLES</span>
        </div>
        <div className={styles.locationTag}>
          LAHORE, PAKISTAN (UTC+5)
        </div>
      </header>

      {/* Hero Header */}
      <section className={styles.headerSection} aria-label="Introduction">
        <h1 className={styles.heroTitle}>MUHAMMAD TALIB IBRAHIM</h1>
        <p className={styles.heroSub}>
          FULL-STACK SOFTWARE ENGINEER // NEXT.JS · TYPESCRIPT · WEBRTC · RAG PIPELINES
        </p>
      </section>

      {/* Blunt Honest Line (3 selectable/cyclable quotes) */}
      <section className={styles.quoteSection} aria-label="Statement of Philosophy">
        <div className={styles.quoteControlBar}>
          <div className={styles.quoteIndicator}>
            STATEMENT 0{activeQuoteIndex + 1} / 03
          </div>
          <div className={styles.quotePills} role="tablist" aria-label="Philosophy statements">
            {BLUNT_QUOTES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={activeQuoteIndex === idx}
                onClick={() => selectQuote(idx)}
                onMouseEnter={playHoverBeep}
                className={`${styles.quoteTabBtn} ${activeQuoteIndex === idx ? styles.quoteTabActive : ''}`}
                aria-label={`Select philosophy statement 0${idx + 1}`}
              >
                [ 0{idx + 1} ]
              </button>
            ))}
          </div>
        </div>

        <div
          className={styles.quoteInteractiveArea}
          onClick={cycleQuote}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              cycleQuote();
            }
          }}
          aria-label="Click to cycle to the next philosophy statement"
          title="Click to cycle statement"
        >
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={activeQuoteIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={styles.quoteText}
            >
              &ldquo;{BLUNT_QUOTES[activeQuoteIndex]}&rdquo;
            </motion.blockquote>
          </AnimatePresence>
          <span className={styles.quoteHint}>[ CLICK STATEMENT TO CYCLE → ]</span>
        </div>
      </section>

      {/* Fast Action Bar */}
      <section className={styles.actionBarSection} aria-label="Immediate Actions">
        <div className={styles.actionBarLabel}>RAPID DISPATCH // CHANNELS</div>
        <div className={styles.actionBarGrid}>
          <button
            type="button"
            onClick={handleResumeRequest}
            onMouseEnter={playHoverBeep}
            className={`${styles.actionBtn} ${styles.actionBtnResume}`}
          >
            [ REQUEST RESUME ]
          </button>
          <a
            href="mailto:talibibrahim04@gmail.com"
            onMouseEnter={playHoverBeep}
            className={styles.actionBtn}
          >
            [ EMAIL ME ]
          </a>
          <a
            href="https://github.com/TalibIbrahim"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={playHoverBeep}
            className={styles.actionBtn}
          >
            [ GITHUB ]
          </a>
          <a
            href="https://www.linkedin.com/in/muhammad-talib-ibrahim"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={playHoverBeep}
            className={styles.actionBtn}
          >
            [ LINKEDIN ]
          </a>
        </div>
      </section>

      {/* Snapshot Engineering Record */}
      <section className={styles.snapshotGrid} aria-label="Engineering Snapshot">
        <div className={styles.snapshotItem}>
          <span className={styles.snapshotLabel}>ACADEMIC RECORD</span>
          <span className={styles.snapshotValue}>
            BS Computer Science (3.6 GPA) — University of Management &amp; Technology, Lahore
          </span>
        </div>
        <div className={styles.snapshotItem}>
          <span className={styles.snapshotLabel}>CORE SPECIALIZATION</span>
          <span className={styles.snapshotValue}>
            Full-stack web applications, real-time WebRTC/Socket.IO infrastructure, and RAG pipelines
          </span>
        </div>
        <div className={styles.snapshotItem}>
          <span className={styles.snapshotLabel}>ENGINEERING CULTURE</span>
          <span className={styles.snapshotValue}>
            Clean deterministic code, zero bloat, strict typing, high throughput, and on-time shipment
          </span>
        </div>
      </section>

      {/* Minimalistic Contact Box */}
      <section id="contact-box" className={styles.contactBox} aria-label="Direct Contact Box">
        <div className={styles.contactBoxHeader}>
          <h2 className={styles.contactBoxTitle}>DIRECT LINE // GET IN TOUCH</h2>
          <div className={styles.contactSlaBadge}>TYP. RESPONSE &lt; 12 HRS</div>
        </div>
        <p className={styles.contactBoxDesc}>
          Have an engineering contract, full-time opportunity, or want to discuss technical architecture?
          Drop a note directly to my inbox. No recruiter spam, just direct communication.
        </p>

        <div className={styles.emailDirectRow}>
          <code className={styles.emailPill}>talibibrahim04@gmail.com</code>
          <button
            type="button"
            onClick={copyEmailToClipboard}
            onMouseEnter={playHoverBeep}
            className={`${styles.copyEmailBtn} ${copied ? styles.copiedActive : ''}`}
            aria-label="Copy email address to clipboard"
          >
            {copied ? '✓ COPIED TO CLIPBOARD' : '[ COPY EMAIL ]'}
          </button>
          <a
            href="mailto:talibibrahim04@gmail.com?subject=Software%20Engineering%20Inquiry%20-%20Muhammad%20Talib%20Ibrahim"
            onMouseEnter={playHoverBeep}
            className={styles.copyEmailBtn}
          >
            [ OPEN IN CLIENT ]
          </a>
        </div>

        <footer className={styles.contactChannels}>
          <a
            href="https://github.com/TalibIbrahim"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.channelLink}
          >
            GITHUB: @TALIBIBRAHIM
          </a>
          <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
          <a
            href="https://www.linkedin.com/in/muhammad-talib-ibrahim"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.channelLink}
          >
            LINKEDIN: MUHAMMAD-TALIB-IBRAHIM
          </a>
          <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
          <a
            href="mailto:talibibrahim04@gmail.com?subject=Resume%20Request"
            className={styles.channelLink}
          >
            RESUME: REQUEST VIA COMM
          </a>
        </footer>
      </section>
    </article>
  );
}
