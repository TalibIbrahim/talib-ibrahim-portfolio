'use client';

import React, { useEffect, useCallback, type JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Gauge,
  Grid,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  FileText,
  Sliders,
  type LucideIcon,
} from 'lucide-react';
import Magnet from './react-bits/Magnet';
import { useMode } from '@/context/ModeContext';
import { useThemeSystem, type VisualTheme } from '@/hooks/useThemeSystem';
import { useIntensity, type IntensityStage } from '@/hooks/useIntensity';
import { useAudio } from '@/hooks/useAudio';
import {
  playClickChime,
  playHoverBeep,
  playMotorsportChime,
  playNothingChime,
} from '@/utils/audioSynth';
import styles from './ThemeDock.module.css';

export interface ThemeDockProps {
  readonly className?: string;
}

interface ThemeConfig {
  readonly id: VisualTheme;
  readonly name: string;
  readonly icon: LucideIcon;
  readonly description: string;
}

const THEMES: readonly ThemeConfig[] = [
  { id: 'neon', name: 'Neon', icon: Zap, description: 'Cyberpunk Fluid Glow' },
  { id: 'msport', name: 'M Sport', icon: Gauge, description: 'Motorsport Telemetry' },
  { id: 'nothing', name: 'Nothing', icon: Grid, description: 'Carl Pei Hardware OS' },
];

const AVAILABLE_THEMES: readonly VisualTheme[] = ['neon', 'msport', 'nothing'];

interface RecruiterStageStop {
  readonly stage: IntensityStage;
  readonly label: string;
  readonly badge: string;
  readonly description: string;
}

const RECRUITER_STAGES: readonly RecruiterStageStop[] = [
  { stage: 1, label: '1', badge: '01 // BLUNT', description: 'Single blunt honest line. Zero fluff.' },
  { stage: 2, label: '2', badge: '02 // PRAGMATIC', description: 'Fact-first credentials & selected works.' },
  { stage: 3, label: '3', badge: '03 // DOSSIER', description: 'Full spreadsheet-grade recruiter spec.' },
];

/**
 * Unified Bottom Control Dock.
 * Consolidates ALL system controls into a single, cohesive, floating dock pinned at the bottom center:
 * - SFX Synthesizer audio toggle
 * - Visual Theme Selector (Neon, M Sport, Nothing) in Hyper mode
 * - Dark / Light appearance toggle in Hyper mode
 * - Presentation mode switch (Hyper <-> Recruiter / Boring mode)
 * - Recruiter presentation intensity snap controller (Stages 1-3) in Boring mode
 * - System Staggered Menu trigger
 * - Complete keyboard accessibility ([B] mode, [T] theme, [L]/[D] appearance, [M] audio, [1-3] intensity)
 */
export default function ThemeDock({ className = '' }: ThemeDockProps): JSX.Element {
  const { mode: portfolioMode, toggleMode: togglePortfolioMode, isTransitioning: isModeTransitioning } = useMode();
  const { theme, mode: colorMode, setTheme, toggleMode: toggleColorMode } = useThemeSystem();
  const { stage: intensityStage, setStage: setIntensityStage } = useIntensity();
  const { isMuted, toggleMute } = useAudio();

  const isHyper = portfolioMode === 'hyper';

  // SFX handler
  const handleSfxToggle = useCallback(() => {
    toggleMute();
  }, [toggleMute]);

  // Theme selection handler
  const handleThemeSelect = useCallback(
    (selectedTheme: VisualTheme) => {
      if (selectedTheme === 'msport') {
        playMotorsportChime();
      } else if (selectedTheme === 'nothing') {
        playNothingChime();
      } else {
        playClickChime();
      }
      if (selectedTheme !== theme) {
        setTheme(selectedTheme);
      }
    },
    [theme, setTheme]
  );

  // Appearance toggle (Dark / Light)
  const handleColorModeToggle = useCallback(() => {
    playClickChime();
    toggleColorMode();
  }, [toggleColorMode]);

  // Portfolio presentation mode toggle (Hyper <-> Boring)
  const handlePortfolioModeToggle = useCallback(() => {
    if (isModeTransitioning) return;
    playClickChime();
    togglePortfolioMode();
  }, [isModeTransitioning, togglePortfolioMode]);

  // Recruiter intensity stage selection
  const handleIntensitySelect = useCallback(
    (stage: IntensityStage) => {
      if (isModeTransitioning) return;
      playClickChime();
      setIntensityStage(stage);
    },
    [isModeTransitioning, setIntensityStage]
  );

  // Open Staggered Menu
  const handleOpenMenu = useCallback(() => {
    playClickChime();
    window.dispatchEvent(new CustomEvent('portfolio-toggle-menu'));
  }, []);

  const handleMouseEnter = useCallback(() => {
    playHoverBeep();
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable ||
          Boolean(target.closest?.('input, textarea, select, [contenteditable="true"]')))
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleSfxToggle();
      } else if (e.key === 't' || e.key === 'T') {
        if (isHyper) {
          e.preventDefault();
          const currentIndex = AVAILABLE_THEMES.indexOf(theme);
          const nextIndex = (currentIndex + 1) % AVAILABLE_THEMES.length;
          handleThemeSelect(AVAILABLE_THEMES[nextIndex]);
        }
      } else if (e.key === 'l' || e.key === 'L' || e.key === 'd' || e.key === 'D') {
        if (isHyper) {
          e.preventDefault();
          handleColorModeToggle();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHyper, theme, handleSfxToggle, handleThemeSelect, handleColorModeToggle]);

  const activeRecruiterConfig =
    RECRUITER_STAGES.find((s) => s.stage === intensityStage) ?? RECRUITER_STAGES[2];

  return (
    <nav
      className={`${styles.dockWrapper} ${className}`.trim()}
      role="region"
      aria-label="Unified system controls dock"
    >
      <Magnet padding={18} magnetStrength={0.16}>
        <div className={styles.dock}>
          {/* 1. SFX Audio Synthesizer Control */}
          <button
            type="button"
            onClick={handleSfxToggle}
            onMouseEnter={handleMouseEnter}
            className={`${styles.dockBtn} ${styles.sfxButton} ${!isMuted ? styles.sfxActive : ''}`}
            aria-label={`Toggle audio effects. Currently ${isMuted ? 'muted' : 'active'}. (Key: [M])`}
            title={`Toggle sound effects [M] — currently ${isMuted ? 'OFF' : 'ON'}`}
          >
            {isMuted ? (
              <VolumeX size={14} className={styles.icon} aria-hidden="true" />
            ) : (
              <span className={styles.sfxActiveGroup}>
                <Volume2 size={14} className={styles.icon} aria-hidden="true" />
                <span className={styles.sfxWaveBars} aria-hidden="true">
                  <span className={styles.waveBar} />
                  <span className={styles.waveBar} />
                  <span className={styles.waveBar} />
                </span>
              </span>
            )}
            <span className={styles.sfxLabel}>SFX</span>
          </button>

          <div className={styles.divider} aria-hidden="true" />

          {/* 2. Mode-Specific Controls */}
          {isHyper ? (
            /* ═══ HYPER-DRIVE 3D MODE: Theme Switcher + Dark/Light + Recruiter Switch ═══ */
            <>
              {/* Visual Theme Radiogroup */}
              <div
                className={styles.themeGroup}
                role="radiogroup"
                aria-label="Visual design theme"
              >
                {THEMES.map((t) => {
                  const isActive = theme === t.id;
                  const Icon = t.icon;

                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      aria-label={`${t.name} visual theme${isActive ? ' (currently active)' : ''}`}
                      title={`${t.name}: ${t.description} (Key: [T])`}
                      onClick={() => handleThemeSelect(t.id)}
                      onMouseEnter={handleMouseEnter}
                      className={`${styles.themeButton} ${isActive ? styles.activeThemeBtn : ''}`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="themeDockActivePill"
                          className={styles.activePill}
                          transition={{
                            type: 'spring',
                            stiffness: 440,
                            damping: 32,
                          }}
                        />
                      )}
                      <span className={styles.buttonInner}>
                        <Icon size={14} className={styles.icon} aria-hidden="true" />
                        <span className={styles.themeLabel}>{t.name}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className={styles.divider} aria-hidden="true" />

              {/* Color Mode Toggle (Dark / Light) */}
              <button
                type="button"
                onClick={handleColorModeToggle}
                onMouseEnter={handleMouseEnter}
                className={`${styles.dockBtn} ${styles.modeButton}`}
                aria-label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode (currently in ${colorMode} mode)`}
                title={`Switch appearance: [L] or [D] — currently ${colorMode.toUpperCase()}`}
              >
                <span className={styles.buttonInner}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={colorMode}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className={styles.modeIconWrapper}
                    >
                      {colorMode === 'dark' ? (
                        <Moon size={14} className={styles.icon} aria-hidden="true" />
                      ) : (
                        <Sun size={14} className={styles.icon} aria-hidden="true" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                  <span className={styles.modeLabel}>
                    {colorMode === 'dark' ? 'Dark' : 'Light'}
                  </span>
                </span>
              </button>

              <div className={styles.divider} aria-hidden="true" />

              {/* Switch to Recruiter / Boring Mode */}
              <button
                type="button"
                onClick={handlePortfolioModeToggle}
                onMouseEnter={handleMouseEnter}
                disabled={isModeTransitioning}
                className={`${styles.dockBtn} ${styles.recruiterModeBtn}`}
                aria-label="Switch to Boring / Recruiter Mode (Keyboard shortcut: B)"
                title="Switch to Recruiter Mode [B] — Zero 3D, high clarity"
              >
                <FileText size={13} className={styles.icon} aria-hidden="true" />
                <span className={styles.recruiterText}>RECRUITER</span>
                <span className={styles.keyBadge}>[B]</span>
              </button>
            </>
          ) : (
            /* ═══ BORING / RECRUITER MODE: Recruiter Intensity Slider + Restore 3D ═══ */
            <>
              {/* Recruiter Intensity Snap Track */}
              <div className={styles.intensitySection} role="group" aria-label="Recruiter presentation intensity stops">
                <div className={styles.intensityTitleGroup}>
                  <Zap size={12} className={styles.intensityIcon} aria-hidden="true" />
                  <span className={styles.intensityLabel}>INTENSITY:</span>
                </div>

                <div className={styles.intensityTrack}>
                  {RECRUITER_STAGES.map((s) => {
                    const isActive = intensityStage === s.stage;

                    return (
                      <button
                        key={s.stage}
                        type="button"
                        onClick={() => handleIntensitySelect(s.stage)}
                        onMouseEnter={handleMouseEnter}
                        className={`${styles.intensityStopBtn} ${isActive ? styles.intensityStopActive : ''}`}
                        aria-pressed={isActive}
                        aria-label={`${s.description} (Key: ${s.stage})`}
                        title={`${s.description} [Key: ${s.stage}]`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="intensityThumb"
                            className={styles.intensityThumb}
                            transition={{ type: 'spring', stiffness: 480, damping: 34 }}
                          />
                        )}
                        <span className={styles.intensityStopLabel}>{s.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className={styles.intensityBadge} aria-live="polite">
                  <span>{activeRecruiterConfig.badge}</span>
                </div>
              </div>

              <div className={styles.divider} aria-hidden="true" />

              {/* Restore Full 3D Hyper-Drive Mode */}
              <button
                type="button"
                onClick={handlePortfolioModeToggle}
                onMouseEnter={handleMouseEnter}
                disabled={isModeTransitioning}
                className={`${styles.dockBtn} ${styles.restore3dBtn}`}
                aria-label="Restore 3D Hyper-Drive Mode (Keyboard shortcut: B)"
                title="Restore 3D Hyper-Drive Mode [B]"
              >
                <Zap size={13} className={styles.icon} aria-hidden="true" />
                <span className={styles.restoreText}>RESTORE 3D</span>
                <span className={styles.keyBadge}>[B]</span>
              </button>
            </>
          )}

          <div className={styles.divider} aria-hidden="true" />

          {/* 3. System Menu Trigger Button */}
          <button
            type="button"
            onClick={handleOpenMenu}
            onMouseEnter={handleMouseEnter}
            className={`${styles.dockBtn} ${styles.menuButton}`}
            aria-label="Open system directory and settings menu"
            title="System Directory & Navigation Menu"
          >
            <Sliders size={13} className={styles.icon} aria-hidden="true" />
            <span className={styles.menuLabel}>MENU</span>
          </button>
        </div>
      </Magnet>
    </nav>
  );
}
