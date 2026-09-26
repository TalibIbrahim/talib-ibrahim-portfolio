'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMode, type PortfolioMode } from '@/context/ModeContext';
import { playModeSwitchSound } from '@/utils/audioSynth';
import styles from './ModeTransitionOverlay.module.css';

const BORING_LINES = [
  '[!] WARPING REALITY...',
  '[-] TERMINATING 40,000 LINES OF GLSL SHADERS & THREE.JS MESHES...',
  '[-] DISABLING INERTIAL SPRINGS & PARTICLE ACCELERATORS...',
  '[-] REVERTING TO 1999 SPREADSHEET-GRADE PLAIN TEXT...',
  '[OK] READY FOR 30-SECOND RECRUITER SCAN.',
] as const;

const HYPER_LINES = [
  '[!] OVERCLOCKING GPU...',
  '[+] RE-ENGAGING R3F DISPLACEMENT SHADERS...',
  '[+] INITIALIZING LIQUID CURSOR MASK...',
  '[OK] HYPER-DRIVE RESTORED.',
] as const;

/**
 * ModeTransitionOverlay renders a retro CRT degauss and diagnostic terminal overlay
 * during portfolio mode transitions (Hyper-Drive vs Boring Mode).
 * Features TV collapse animation, phosphor scanline roll, and kinetic log output.
 */
export default function ModeTransitionOverlay() {
  const { isTransitioning, mode } = useMode();
  const [targetMode, setTargetMode] = useState<PortfolioMode>('boring');
  const [visibleLines, setVisibleLines] = useState<number>(1);
  const wasTransitioning = useRef<boolean>(false);

  useEffect(() => {
    if (isTransitioning && !wasTransitioning.current) {
      // Play synthetic CRT power-down or sci-fi warp charge sound
      playModeSwitchSound(mode === 'hyper');

      // Transition just initiated: target is opposite of current mode
      const nextTarget: PortfolioMode = mode === 'hyper' ? 'boring' : 'hyper';
      setTargetMode(nextTarget);
      setVisibleLines(1);

      const totalLines = nextTarget === 'boring' ? BORING_LINES.length : HYPER_LINES.length;
      const intervalMs = Math.floor(650 / totalLines);

      const timers: ReturnType<typeof setTimeout>[] = [];
      for (let i = 2; i <= totalLines; i++) {
        const timer = setTimeout(() => {
          setVisibleLines(i);
        }, (i - 1) * intervalMs);
        timers.push(timer);
      }

      wasTransitioning.current = true;

      return () => {
        timers.forEach(clearTimeout);
      };
    }

    if (!isTransitioning) {
      wasTransitioning.current = false;
      setVisibleLines(1);
    }
  }, [isTransitioning, mode]);

  if (!isTransitioning) {
    return null;
  }

  const activeLines = targetMode === 'boring' ? BORING_LINES : HYPER_LINES;

  return (
    <AnimatePresence>
      <div
        className={styles.overlayRoot}
        role="alert"
        aria-live="assertive"
        aria-label="Mode transition in progress"
      >
        {/* Full-screen CRT scanline roll */}
        <div className={styles.scanlines} aria-hidden="true" />

        {/* CRT Glass Vignette & Curvature Shadow */}
        <div className={styles.vignette} aria-hidden="true" />

        {/* Phosphor Beam Flicker */}
        <div className={styles.flickerLayer} aria-hidden="true" />

        {/* Central High-Intensity CRT Beam Collapse Flash */}
        <motion.div
          className={styles.beamFlash}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{
            opacity: [0, 1, 0.2, 0.2, 1, 0],
            scaleX: [0, 1, 1, 1, 1, 0],
          }}
          transition={{
            duration: 1.2,
            times: [0, 0.06, 0.12, 0.85, 0.95, 1],
            ease: 'easeInOut',
          }}
          aria-hidden="true"
        />

        {/* CRT Screen with Television Power-Off Collapse Animation */}
        <motion.div
          className={styles.crtScreen}
          initial={{ scaleY: 0.003, scaleX: 1, opacity: 0 }}
          animate={{
            scaleY: [0.003, 1, 1, 0.002, 0.002],
            scaleX: [1, 1, 1, 1, 0],
            opacity: [0.8, 1, 1, 1, 0],
          }}
          transition={{
            duration: 1.2,
            times: [0, 0.08, 0.84, 0.96, 1],
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Top HUD */}
          <div className={styles.terminalHeader}>
            <div className={styles.terminalHeaderLeft}>
              <span className={styles.degaussDot} aria-hidden="true" />
              <span>SYS_KERNEL // MODE_SHIFT_PROTOCOL</span>
            </div>
            <div className={styles.terminalHeaderRight}>
              <span>TARGET: {targetMode.toUpperCase()}</span>
            </div>
          </div>

          {/* Central Diagnostic Terminal */}
          <div className={styles.terminalBody}>
            {activeLines.slice(0, visibleLines).map((line, index) => {
              const isLast = index === visibleLines - 1;
              return (
                <div key={line} className={styles.logLine}>
                  <span>{line}</span>
                  {isLast && <span className={styles.cursor} aria-hidden="true" />}
                </div>
              );
            })}
          </div>

          {/* Bottom HUD */}
          <div className={styles.terminalFooter}>
            <span>RETRO_DEGAUSS_UNIT: ACTIVE</span>
            <span>FREQ: 60HZ PHOSPHOR</span>
            <span>HARDWARE_SYNC: 100%</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
