'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Mail, ExternalLink, ArrowDownRight } from 'lucide-react';
import styles from './AppleDynamicIsland.module.css';

export interface AppleDynamicIslandProps {
  readonly className?: string;
}

const islandSpring = {
  type: 'spring',
  mass: 0.85,
  stiffness: 380,
  damping: 28,
} as const;

/**
 * Apple Dynamic Island Component
 *
 * True-to-spec Apple Dynamic Island hardware interface:
 * - Fluid Obsidian Black morphology with spring-physics transitions
 * - Resting compact pill (~140px x 36px): simulated TrueDepth camera aperture, live pulse dot, 4-bar equalizer
 * - Expanded interactive pill (~380px x 168px): hire badge, live equalizer, career title & 3 quick actions
 */
export default function AppleDynamicIsland({ className = '' }: AppleDynamicIslandProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [hasCopiedEmail, setHasCopiedEmail] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setIsPinned(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
        setIsPinned(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  }, [isPinned]);

  const handleIslandClick = useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      setIsPinned(next);
      return next;
    });
  }, []);

  const handleCopyEmail = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText('talibibrahim04@gmail.com');
      setHasCopiedEmail(true);
      setTimeout(() => setHasCopiedEmail(false), 2000);
    } catch {
      // Fallback if clipboard API is unavailable
    }
  }, []);

  const handleViewProjects = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
    setIsPinned(false);
    const target = document.querySelector('#byters');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleRequestResume = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href =
      'mailto:talibibrahim04@gmail.com?subject=Resume%20Request%20%E2%80%94%20Muhammad%20Talib%20Ibrahim&body=Hi%20Talib,%0A%0AWe%20would%20like%20to%20request%20your%20resume%20for%20an%20open%20engineering%20role.%0A%0ABest%20regards,';
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.islandContainer} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Apple Dynamic Island live status & actions"
    >
      <motion.div
        layout
        transition={islandSpring}
        className={`${styles.islandPill} ${isExpanded ? styles.islandPillExpanded : ''}`}
        style={{
          width: isExpanded ? 'min(380px, calc(100vw - 24px))' : 140,
          height: isExpanded ? 168 : 36,
          borderRadius: isExpanded ? 38 : 9999,
        }}
        onClick={!isExpanded ? handleIslandClick : undefined}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* ════════ COMPACT RESTING STATE ════════ */
            <motion.div
              key="compact-island"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={styles.compactRow}
            >
              {/* Simulated TrueDepth Camera & Brand Micro-Text */}
              <div className={styles.compactLeft}>
                <div className={styles.cameraAperture} aria-hidden="true">
                  <span className={styles.cameraLensReflection} />
                </div>
                <span className={styles.compactTitle}>TALIB</span>
              </div>

              {/* Pulsing Green Status Dot & 4-Bar Equalizer */}
              <div className={styles.compactRight}>
                <span className={styles.liveDot} aria-hidden="true" />
                <div className={styles.equalizer} aria-hidden="true">
                  <span className={`${styles.eqBar} ${styles.eqBar1}`} />
                  <span className={`${styles.eqBar} ${styles.eqBar2}`} />
                  <span className={`${styles.eqBar} ${styles.eqBar3}`} />
                  <span className={`${styles.eqBar} ${styles.eqBar4}`} />
                </div>
              </div>
            </motion.div>
          ) : (
            /* ════════ EXPANDED INTERACTIVE STATE ════════ */
            <motion.div
              key="expanded-island"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, delay: 0.04 }}
              className={styles.expandedContainer}
            >
              {/* Header Row: TrueDepth Cutout, Hire Status, Dev Tag */}
              <div className={styles.expandedHeader}>
                <div className={styles.trueDepthCutout} aria-hidden="true">
                  <span className={styles.trueDepthDot} />
                </div>

                <span className={styles.statusHireBadge}>
                  AVAILABLE FOR HIRE
                </span>

                <span className={styles.devLiveTag}>
                  DEV // LIVE
                </span>
              </div>

              {/* Center Content Row: 4-Bar Equalizer, Name, Current Focus */}
              <div className={styles.expandedCenter}>
                <div className={styles.expandedEqWrapper} aria-hidden="true">
                  <div className={styles.equalizer}>
                    <span className={`${styles.eqBar} ${styles.eqBar1}`} />
                    <span className={`${styles.eqBar} ${styles.eqBar2}`} />
                    <span className={`${styles.eqBar} ${styles.eqBar3}`} />
                    <span className={`${styles.eqBar} ${styles.eqBar4}`} />
                  </div>
                </div>

                <div className={styles.expandedInfo}>
                  <div className={styles.expandedTitle}>
                    Muhammad Talib Ibrahim
                  </div>
                  <div className={styles.expandedSubtitle}>
                    Now Engineering: Next.js + Three.js
                  </div>
                </div>
              </div>

              {/* Action Footer: Request Resume, Copy Email, View Projects */}
              <div className={`${styles.expandedFooter} ${styles.expandedActions}`}>
                <button
                  type="button"
                  onClick={handleRequestResume}
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  aria-label="Request formal resume"
                >
                  <Mail size={12} strokeWidth={2.5} />
                  <span>Request Resume</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`${styles.actionBtn} ${styles.actionBtnSecondary} ${hasCopiedEmail ? styles.actionBtnCopied : ''}`}
                  aria-label="Copy email address"
                >
                  {hasCopiedEmail ? (
                    <>
                      <Check size={12} strokeWidth={2.5} />
                      <span>Copied! ✓</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink size={11} strokeWidth={2.5} />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleViewProjects}
                  className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                  aria-label="Scroll to featured Byters project"
                >
                  <ArrowDownRight size={12} strokeWidth={2.5} />
                  <span>View Projects</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
