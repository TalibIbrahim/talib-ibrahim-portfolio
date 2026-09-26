'use client';

import React, { useEffect, useCallback } from 'react';
import { useAudio } from '@/hooks/useAudio';
import { useMode } from '@/context/ModeContext';
import Magnet from './react-bits/Magnet';
import { VolumeX, Volume2 } from 'lucide-react';
import styles from './AudioToggle.module.css';

export interface AudioToggleProps {
  readonly className?: string;
}

/**
 * AudioToggle controls global Web Audio synthetic sound effects.
 * Docked fixed at bottom-left with carbon capsule design, dynamic equalizer bars,
 * magnetic physics attraction, and keyboard shortcut [M].
 * Adapts to brutalist styling and disables magnetic springs when in Boring Mode.
 */
export default function AudioToggle({ className = '' }: AudioToggleProps) {
  const { isMuted, toggleMute, playClickChime, playHoverBeep } = useAudio();
  const { mode } = useMode();
  const isHyper = mode === 'hyper';

  const handleToggle = useCallback(() => {
    const wasMuted = isMuted;
    toggleMute();
    if (wasMuted) {
      // Audio is being unmuted; play resonant feedback chime
      playClickChime();
    }
  }, [isMuted, toggleMute, playClickChime]);

  // Keyboard shortcut listener: [M] toggles sound effects
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      if (event.code === 'KeyM') {
        event.preventDefault();
        handleToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleToggle]);

  const buttonStyleClass = isHyper
    ? isMuted
      ? styles.hyperMuted
      : styles.hyperActive
    : isMuted
      ? styles.boringMuted
      : styles.boringActive;

  return (
    <div
      className={`${styles.fixedContainer} ${className}`.trim()}
      role="region"
      aria-label="Sound effects controller"
    >
      <Magnet padding={15} magnetStrength={0.25} disabled={!isHyper}>
        <button
          type="button"
          onClick={handleToggle}
          onMouseEnter={playHoverBeep}
          className={`${styles.toggleBtn} ${buttonStyleClass}`}
          aria-label={
            isMuted
              ? 'Unmute sound effects (Keyboard shortcut: M)'
              : 'Mute sound effects (Keyboard shortcut: M)'
          }
          aria-pressed={!isMuted}
          title={`Toggle SFX [M] — sound is currently ${isMuted ? 'OFF' : 'ACTIVE'}`}
        >
          {isMuted ? (
            <>
              <span className={styles.speakerIcon} aria-hidden="true">
                <VolumeX size={14} />
              </span>
              <span className={styles.statusLabel}>[ SFX: OFF ]</span>
              <span className={styles.keyBadge}>[M] MUTE</span>
            </>
          ) : (
            <>
              <span className={styles.speakerIcon} aria-hidden="true">
                <Volume2 size={14} />
              </span>
              <span className={styles.statusLabel}>[ SFX: ACTIVE ]</span>
              {isHyper && (
                <span className={styles.equalizer} aria-hidden="true">
                  <span className={styles.eqBar} />
                  <span className={styles.eqBar} />
                  <span className={styles.eqBar} />
                </span>
              )}
              <span className={styles.keyBadge}>[M] ACTIVE</span>
            </>
          )}
        </button>
      </Magnet>
    </div>
  );
}
