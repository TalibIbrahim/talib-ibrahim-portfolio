'use client';

import React, { type JSX } from 'react';
import { motion } from 'framer-motion';
import { useIntensity, type IntensityStage } from '@/hooks/useIntensity';
import { useMode } from '@/context/ModeContext';
import Magnet from './react-bits/Magnet';
import { playClickChime, playHoverBeep } from '@/utils/audioSynth';
import { Zap } from 'lucide-react';
import styles from './IntensitySlider.module.css';

export interface IntensitySliderProps {
  readonly className?: string;
}

interface StageStopConfig {
  readonly stage: IntensityStage;
  readonly label: string;
  readonly title: string;
  readonly badge: string;
}

const STAGES: readonly StageStopConfig[] = [
  { stage: 1, label: '1', title: 'Stage 1: Blunt — Single honest sentence. Zero fluff. Instant actions.', badge: '01 // BLUNT' },
  { stage: 2, label: '2', title: 'Stage 2: Pragmatic — Fact-first engineering credentials & selected works.', badge: '02 // PRAGMATIC' },
  { stage: 3, label: '3', title: 'Stage 3: Dossier — Full high-density spreadsheet-grade recruiter spec.', badge: '03 // DOSSIER' },
  { stage: 4, label: '4', title: 'Stage 4: 3D Hyper-Drive — Restore over-engineered 3D WebGL version.', badge: '3D HYPER' },
];

/**
 * IntensitySlider docked exclusively in Boring / Recruiter Mode.
 * Takes the central dock position to allow recruiters to smoothly dial the portfolio
 * presentation between Blunt (1), Pragmatic (2), Full Dossier (3), and 3D Hyper-Drive (4).
 */
export default function IntensitySlider({ className = '' }: IntensitySliderProps): JSX.Element | null {
  const { stage, setStage } = useIntensity();
  const { mode, toggleMode, isTransitioning } = useMode();

  // When entering boring mode, normalize stage to 3 (Dossier) so Stop 3 is active
  React.useEffect(() => {
    if (mode === 'boring' && stage === 4) {
      setStage(3);
    }
  }, [mode, stage, setStage]);

  // ONLY show in Boring / Recruiter mode as explicitly requested
  if (mode !== 'boring') {
    return null;
  }

  const handleStageSelect = (nextStage: IntensityStage) => {
    if (isTransitioning) return;

    playClickChime();

    if (nextStage === 4) {
      // Stage 4 triggers restoration of the full 3D Hyper-Drive portfolio
      toggleMode();
      return;
    }

    if (nextStage !== stage) {
      setStage(nextStage);
    }
  };

  const activeStageConfig = STAGES.find((s) => s.stage === stage) ?? STAGES[2];

  return (
    <aside
      className={`${styles.fixedContainer} ${className}`.trim()}
      role="region"
      aria-label="Recruiter mode presentation intensity controller"
    >
      <Magnet padding={18} magnetStrength={0.18}>
        <div className={styles.capsule}>
          <div className={styles.labelSection}>
            <Zap size={13} className={styles.lightningIcon} aria-hidden="true" />
            <span className={styles.labelText}>INTENSITY:</span>
          </div>

          <div className={styles.track} role="group" aria-label="Intensity level snap stops">
            {STAGES.map((s) => {
              const isActive = s.stage === 4 ? false : stage === s.stage;
              return (
                <button
                  key={s.stage}
                  type="button"
                  onClick={() => handleStageSelect(s.stage)}
                  onMouseEnter={playHoverBeep}
                  className={`${styles.stopBtn} ${isActive ? styles.stopActive : ''} ${s.stage === 4 ? styles.stopHyper : ''}`}
                  aria-pressed={isActive}
                  aria-label={`${s.title} (Key: ${s.stage})`}
                  title={`${s.title} [Key: ${s.stage}]`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="intensityThumb"
                      className={styles.thumbHighlight}
                      transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                    />
                  )}
                  <span className={styles.stopNumber}>
                    {s.stage === 4 ? <Zap size={11} /> : s.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className={styles.badge} aria-live="polite">
            <span className={styles.badgeText}>{activeStageConfig.badge}</span>
          </div>
        </div>
      </Magnet>
    </aside>
  );
}
