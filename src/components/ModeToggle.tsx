'use client';

import React from 'react';
import { useMode } from '@/context/ModeContext';
import Magnet from './react-bits/Magnet';
import { Zap, FileText } from 'lucide-react';
import styles from './ModeToggle.module.css';

export interface ModeToggleProps {
  readonly className?: string;
}

/**
 * ModeToggle triggers switching between Hyper-Drive 3D mode and Boring / Recruiter mode.
 * Encased in a magnetic attractor and positioned statically in the upper-right viewport.
 * Keyboard shortcut: [B].
 */
export default function ModeToggle({ className = '' }: ModeToggleProps) {
  const { mode, toggleMode, isTransitioning } = useMode();
  const isHyper = mode === 'hyper';

  return (
    <div
      className={`${styles.fixedWrapper} ${className}`.trim()}
      role="region"
      aria-label="Portfolio presentation mode switch"
    >
      <Magnet padding={20} magnetStrength={0.2} disabled={!isHyper}>
        <button
          type="button"
          onClick={toggleMode}
          disabled={isTransitioning}
          className={`${styles.toggleBtn} ${isHyper ? styles.hyperBtn : styles.boringBtn}`}
          aria-label={
            isHyper
              ? 'Switch to Boring / Recruiter Mode (Keyboard shortcut: B)'
              : 'Restore 3D Hyper-Drive Mode (Keyboard shortcut: B)'
          }
          title={`Switch mode [B] — currently in ${isHyper ? 'Hyper-Drive' : 'Boring'} mode`}
        >
          {isHyper ? (
            <>
              <span className={styles.pulsingDot} aria-hidden="true" />
              <span className={styles.hyperLabel}>
                <Zap size={13} aria-hidden="true" /> HYPER-DRIVE
              </span>
              <span className={styles.hyperBadge}>[B] RECRUITER MODE</span>
            </>
          ) : (
            <>
              <span className={styles.boringSquare} aria-hidden="true" />
              <span className={styles.boringLabel}>
                <FileText size={13} aria-hidden="true" /> BORING MODE
              </span>
              <span className={styles.boringBadge}>[B] RESTORE 3D</span>
            </>
          )}
        </button>
      </Magnet>
    </div>
  );
}
