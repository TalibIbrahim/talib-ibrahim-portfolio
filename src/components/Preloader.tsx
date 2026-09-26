'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMode } from '@/context/ModeContext';
import styles from './Preloader.module.css';

const SESSION_STORAGE_KEY = 'talib_portfolio_preloader_seen';

/**
 * Preloader executes a theatrical 1.1s cyberpunk/telemetry startup sequence
 * with high-speed counter, diagnostics terminal, and curtain wipe reveal.
 * Fully fail-safe: guaranteed 1.2s safety timeout fallback, wall-clock timing,
 * and click/keyboard bypass so visitors are NEVER stuck.
 */
export default function Preloader() {
  const { mode } = useMode();
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const hasDismissedRef = useRef<boolean>(false);

  const dismiss = useCallback(() => {
    if (hasDismissedRef.current) return;
    hasDismissedRef.current = true;
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    } catch {
      // Safe fallback
    }
    setIsVisible(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }, []);

  useEffect(() => {
    setIsClient(true);

    // Skip preloader in boring mode
    if (mode === 'boring') {
      return;
    }

    // 1. Accessibility guard: if reduced motion requested, skip
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // 2. Session guard: only play once per browser session
    try {
      const hasSeen = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (hasSeen === 'true') {
        return;
      }
    } catch {
      // Safe fallback
    }

    // Sequence active: lock scroll during boot sequence
    setIsVisible(true);
    document.body.style.overflow = 'hidden';

    // 3. Absolute safety timeout fallback: GUARANTEED removal after 1350ms
    const safetyTimeout = setTimeout(() => {
      dismiss();
    }, 1350);

    // 4. Reliable Wall-Clock interval (runs regardless of tab focus or rAF throttling)
    const startTime = Date.now();
    const duration = 950; // 950ms rapid counter progression

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const linearRatio = Math.min(elapsed / duration, 1);
      const easedProgress = Math.min(Math.floor(linearRatio * 100), 100);

      setProgress(easedProgress);

      if (linearRatio >= 1) {
        clearInterval(intervalId);
        setProgress(100);
        setTimeout(() => {
          dismiss();
        }, 180);
      }
    }, 16);

    // 5. Emergency keyboard escape/space/enter to skip
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        dismiss();
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      clearInterval(intervalId);
      clearTimeout(safetyTimeout);
      window.removeEventListener('keydown', handleKey);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [mode, dismiss]);

  if (!isClient) return null;

  // Determine terminal status log based on progress thresholds
  let statusLog = '00 // INITIALIZING CORE SUBSYSTEMS';
  if (progress >= 100) {
    statusLog = '100 // SYSTEM ONLINE';
  } else if (progress >= 88) {
    statusLog = '88 // CALIBRATING INERTIAL SPRINGS';
  } else if (progress >= 45) {
    statusLog = '45 // COMPILING GLSL SHADERS';
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="portfolio-preloader"
          className={styles.preloaderOverlay}
          initial={{ opacity: 1, y: 0 }}
          exit={{
            y: '-100%',
            transition: {
              duration: 0.65,
              ease: [0.76, 0, 0.24, 1], // cinematic theatrical ease
            },
          }}
          aria-hidden="true"
        >
          {/* Top telemetry HUD */}
          <div className={styles.hudTop}>
            <div className={styles.hudBadge}>
              <span className={styles.hudDot} />
              <span>SYS_INIT // BOOT_SEQUENCE</span>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className={styles.skipBtn}
              aria-label="Skip initialization intro"
            >
              [ SKIP INTRO ]
            </button>
          </div>

          {/* Central Counter & Diagnostics */}
          <div className={styles.centerStage} onClick={dismiss} style={{ cursor: 'pointer' }}>
            <div className={styles.bracketLeft} />
            <div className={styles.counterWrapper}>
              <div className={styles.counterValue}>
                {progress < 10 ? `0${progress}` : progress}
                <span className={styles.percentSymbol}>%</span>
              </div>
              <div className={styles.progressBarWrapper}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className={styles.statusLogLine}>
                <span className={styles.statusLogPrompt}>{'>'}</span>
                <span className={styles.statusLogText}>{statusLog}</span>
                <span className={styles.cursorBlink}>_</span>
              </div>
            </div>
            <div className={styles.bracketRight} />
          </div>

          {/* Bottom telemetry HUD */}
          <div className={styles.hudBottom}>
            <span className={styles.telemetryTag}>CHASSIS: CARBON_FIBER_MONOCOQUE</span>
            <span className={styles.telemetryTag}>STATUS: NOMINAL</span>
            <span className={styles.telemetryTag}>TAP ANYWHERE TO SKIP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

