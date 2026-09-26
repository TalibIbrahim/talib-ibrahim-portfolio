'use client';

import React, { useState, useEffect, useCallback, type JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Zap,
  Gauge,
  Grid,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  FileText,
  Mail,
  ArrowUpRight,
  ExternalLink,
  Sliders,
  Layers,
  Sparkles,
} from 'lucide-react';
import Magnet from './react-bits/Magnet';
import { useMode } from '@/context/ModeContext';
import { useThemeSystem, type VisualTheme } from '@/hooks/useThemeSystem';
import { useAudio } from '@/hooks/useAudio';
import {
  playClickChime,
  playHoverBeep,
  playMotorsportChime,
  playNothingChime,
} from '@/utils/audioSynth';
import styles from './StaggeredMenu.module.css';

export interface StaggeredMenuProps {
  readonly className?: string;
}

interface NavSectionItem {
  readonly index: string;
  readonly label: string;
  readonly href: string;
  readonly category: string;
}

const NAV_ITEMS: readonly NavSectionItem[] = [
  { index: '01', label: 'HERO & OVERVIEW', href: '#hero', category: 'ORIGIN' },
  { index: '02', label: 'IDENTITY CHAMBER', href: '#signature', category: 'CHOREOGRAPHY' },
  { index: '03', label: 'SELECTED WORKS', href: '#projects', category: 'PRODUCTION' },
  { index: '04', label: 'TECHNICAL RADAR', href: '#skills', category: 'COMPETENCIES' },
  { index: '05', label: 'CAREER RECORD', href: '#experience', category: 'CHRONOLOGY' },
  { index: '06', label: 'TRANSMISSION PROTOCOL', href: '#contact', category: 'COMMUNICATION' },
];

const THEME_OPTIONS: readonly { id: VisualTheme; name: string; icon: typeof Zap; desc: string }[] = [
  { id: 'neon', name: 'Neon', icon: Zap, desc: 'Fluid Cyberpunk Glow' },
  { id: 'msport', name: 'M Sport', icon: Gauge, desc: 'Motorsport Telemetry' },
  { id: 'nothing', name: 'Nothing', icon: Grid, desc: 'Dot-Matrix Hardware' },
];

/**
 * React Bits - Staggered Menu Component.
 * Features multi-layered staggered curtain panels, kinetic editorial section navigation,
 * and a complete hardware & theme command center (Mode toggle, Themes, Light/Dark, SFX, Resume).
 */
export default function StaggeredMenu({ className = '' }: StaggeredMenuProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mode, toggleMode } = useMode();
  const { theme, mode: colorMode, setTheme, toggleMode: toggleColorMode } = useThemeSystem();
  const { isMuted, toggleMute } = useAudio();

  const isHyper = mode === 'hyper';

  // Toggle open/close state
  const handleToggle = useCallback(() => {
    playClickChime();
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    playClickChime();
    setIsOpen(false);
  }, []);

  // Keyboard shortcut: Escape closes menu, 'M' or 'm' toggles menu when not in inputs
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

      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Listen for system menu custom events dispatched from bottom dock or other controls
  useEffect(() => {
    const handleToggleEvent = () => setIsOpen((prev) => !prev);
    const handleOpenEvent = () => setIsOpen(true);
    const handleCloseEvent = () => setIsOpen(false);

    window.addEventListener('portfolio-toggle-menu', handleToggleEvent);
    window.addEventListener('portfolio-open-menu', handleOpenEvent);
    window.addEventListener('portfolio-close-menu', handleCloseEvent);

    return () => {
      window.removeEventListener('portfolio-toggle-menu', handleToggleEvent);
      window.removeEventListener('portfolio-open-menu', handleOpenEvent);
      window.removeEventListener('portfolio-close-menu', handleCloseEvent);
    };
  }, []);

  // Lock body scroll when menu is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle section navigation
  const handleNavClick = (href: string) => {
    playClickChime();
    setIsOpen(false);

    // If currently in boring mode and trying to view a 3D section, restore hyper mode first
    if (!isHyper) {
      toggleMode();
    }

    setTimeout(() => {
      const targetEl = document.querySelector(href);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // Theme change handler
  const handleThemeChange = (newTheme: VisualTheme) => {
    if (newTheme === 'msport') {
      playMotorsportChime();
    } else if (newTheme === 'nothing') {
      playNothingChime();
    } else {
      playClickChime();
    }
    if (newTheme !== theme) {
      setTheme(newTheme);
    }
  };

  // Mode toggle handler
  const handleModeToggle = () => {
    playClickChime();
    toggleMode();
  };

  // Color mode toggle handler
  const handleColorModeToggle = () => {
    playClickChime();
    toggleColorMode();
  };

  // SFX toggle handler
  const handleSfxToggle = () => {
    toggleMute();
  };

  return (
    <div className={`${styles.menuRoot} ${className}`.trim()}>
      {/* Floating Magnetized Trigger Button */}
      <div className={styles.triggerWrapper}>
        <Magnet padding={16} magnetStrength={0.25}>
          <button
            type="button"
            onClick={handleToggle}
            onMouseEnter={playHoverBeep}
            className={`${styles.triggerBtn} ${isOpen ? styles.triggerBtnOpen : ''}`}
            aria-label={isOpen ? 'Close navigation and settings menu' : 'Open navigation and settings menu'}
            aria-expanded={isOpen}
            title={isOpen ? 'Close Menu [ESC]' : 'System Menu & Settings'}
          >
            <div className={styles.hamburgerIcon} aria-hidden="true">
              <span className={`${styles.iconLine} ${styles.lineTop}`} />
              <span className={`${styles.iconLine} ${styles.lineBottom}`} />
            </div>
            <span className={styles.triggerLabel}>
              {isOpen ? 'CLOSE' : 'MENU'}
            </span>
            <span className={styles.triggerBadge} aria-hidden="true">
              {isHyper ? <Zap size={11} /> : <FileText size={11} />}
            </span>
          </button>
        </Magnet>
      </div>

      {/* React Bits Multi-Layered Staggered Curtain Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className={styles.overlayContainer} role="dialog" aria-modal="true" aria-label="System navigation and control panel">
            {/* Layer 1: Staggered Accent Underlay */}
            <motion.div
              className={styles.staggerLayer1}
              initial={{ y: '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Layer 2: Staggered Frosted Glass Underlay */}
            <motion.div
              className={styles.staggerLayer2}
              initial={{ y: '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Layer 3: Main Menu Panel */}
            <motion.div
              className={styles.staggerLayer3}
              initial={{ y: '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.55, delay: 0.09, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header Bar inside Panel */}
              <div className={styles.panelHeader}>
                <div className={styles.brandBadge}>
                  <span className={styles.brandDot} aria-hidden="true" />
                  <span className={styles.brandTitle}>MUHAMMAD TALIB IBRAHIM</span>
                  <span className={styles.brandDivider}>/</span>
                  <span className={styles.brandMeta}>SYSTEM DIRECTORY &amp; HARDWARE CONFIG</span>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  onMouseEnter={playHoverBeep}
                  className={styles.closeBtn}
                  aria-label="Close menu"
                >
                  <span className={styles.closeKeyTag}>[ESC]</span>
                  <X size={16} aria-hidden="true" />
                </button>
              </div>

              {/* Two-Column Interior Grid */}
              <div className={styles.interiorGrid}>
                {/* Column 1: Editorial Section Navigation */}
                <nav className={styles.navColumn} aria-label="Primary portfolio sections">
                  <div className={styles.columnHeader}>
                    <Layers size={13} className={styles.columnIcon} aria-hidden="true" />
                    <span>01 // DIRECT SECTION ACCESS</span>
                  </div>

                  <ul className={styles.navList}>
                    {NAV_ITEMS.map((item, idx) => (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: 0.18 + idx * 0.045,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(item.href);
                          }}
                          onMouseEnter={playHoverBeep}
                          className={styles.navLink}
                        >
                          <span className={styles.navIndex}>{item.index}</span>
                          <span className={styles.navLabel}>{item.label}</span>
                          <span className={styles.navCategory}>[{item.category}]</span>
                          <ArrowUpRight size={16} className={styles.navArrow} aria-hidden="true" />
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Column 2: System Settings Command Center */}
                <aside className={styles.settingsColumn} aria-label="System configuration panel">
                  <div className={styles.columnHeader}>
                    <Sliders size={13} className={styles.columnIcon} aria-hidden="true" />
                    <span>02 // HARDWARE &amp; THEME TELEMETRY</span>
                  </div>

                  <div className={styles.settingsDeck}>
                    {/* Setting 1: Portfolio Presentation Mode */}
                    <div className={styles.settingCard}>
                      <div className={styles.settingMeta}>
                        <span className={styles.settingLabel}>PRESENTATION ENGINE</span>
                        <span className={styles.settingValue}>
                          {isHyper ? 'HYPER-DRIVE (3D/WEBGL)' : 'BORING / RECRUITER'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleModeToggle}
                        onMouseEnter={playHoverBeep}
                        className={`${styles.modeSwitchBtn} ${isHyper ? styles.btnHyper : styles.btnBoring}`}
                        aria-label={`Switch to ${isHyper ? 'Boring' : 'Hyper'} mode`}
                      >
                        {isHyper ? (
                          <>
                            <FileText size={14} aria-hidden="true" />
                            <span>SWITCH TO RECRUITER MODE</span>
                          </>
                        ) : (
                          <>
                            <Zap size={14} aria-hidden="true" />
                            <span>RESTORE 3D HYPER-DRIVE</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Setting 2: Multi-Theme Switcher */}
                    <div className={styles.settingCard}>
                      <div className={styles.settingMeta}>
                        <span className={styles.settingLabel}>VISUAL THEME ARCHITECTURE</span>
                        <span className={styles.settingValue}>ACTIVE: {theme.toUpperCase()}</span>
                      </div>
                      <div className={styles.themeButtonGroup} role="radiogroup" aria-label="Theme selector">
                        {THEME_OPTIONS.map((t) => {
                          const isActive = theme === t.id;
                          const Icon = t.icon;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              role="radio"
                              aria-checked={isActive}
                              onClick={() => handleThemeChange(t.id)}
                              onMouseEnter={playHoverBeep}
                              className={`${styles.themeOptionBtn} ${isActive ? styles.themeOptionActive : ''}`}
                              title={t.desc}
                            >
                              <Icon size={14} className={styles.themeOptionIcon} aria-hidden="true" />
                              <span className={styles.themeOptionName}>{t.name}</span>
                              {isActive && <span className={styles.activeDot} aria-hidden="true" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Setting 3: Appearance Mode (Light / Dark) */}
                    <div className={styles.settingCard}>
                      <div className={styles.settingMeta}>
                        <span className={styles.settingLabel}>COLOR APPEARANCE</span>
                        <span className={styles.settingValue}>{colorMode.toUpperCase()} MODE</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleColorModeToggle}
                        onMouseEnter={playHoverBeep}
                        className={styles.actionToggleBtn}
                        aria-label={`Switch to ${colorMode === 'dark' ? 'Light' : 'Dark'} mode`}
                      >
                        {colorMode === 'dark' ? (
                          <>
                            <Sun size={14} aria-hidden="true" />
                            <span>SWITCH TO LIGHT MODE</span>
                          </>
                        ) : (
                          <>
                            <Moon size={14} aria-hidden="true" />
                            <span>SWITCH TO DARK MODE</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Setting 4: Audio Synthesizer Toggle */}
                    <div className={styles.settingCard}>
                      <div className={styles.settingMeta}>
                        <span className={styles.settingLabel}>SYNTHETIC AUDIO (SFX)</span>
                        <span className={styles.settingValue}>{isMuted ? 'MUTED' : 'ACTIVE'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleSfxToggle}
                        onMouseEnter={playHoverBeep}
                        className={styles.actionToggleBtn}
                        aria-label={`Turn audio ${isMuted ? 'ON' : 'OFF'}`}
                      >
                        {isMuted ? (
                          <>
                            <VolumeX size={14} aria-hidden="true" />
                            <span>ENABLE SFX SOUND ENGINE</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={14} aria-hidden="true" />
                            <span className={styles.audioActiveSpan}>
                              <span>SFX ACTIVE</span>
                              <span className={styles.audioWaveBars} aria-hidden="true">
                                <span className={styles.waveBar} />
                                <span className={styles.waveBar} />
                                <span className={styles.waveBar} />
                              </span>
                            </span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Setting 5: Verified Resume Dispatch */}
                    <div className={styles.settingCardSpecial}>
                      <div className={styles.resumeHeader}>
                        <Sparkles size={14} className={styles.resumeIcon} aria-hidden="true" />
                        <span className={styles.resumeTitle}>VERIFIED RESUME PROTOCOL</span>
                      </div>
                      <p className={styles.resumeDesc}>
                        Private document delivered on-demand. Bypasses public indexing.
                      </p>
                      <a
                        href="#contact"
                        onClick={() => {
                          playClickChime();
                          setIsOpen(false);
                        }}
                        onMouseEnter={playHoverBeep}
                        className={styles.resumeDispatchBtn}
                      >
                        <FileText size={13} aria-hidden="true" />
                        <span>REQUEST OFFICIAL RESUME</span>
                      </a>
                    </div>
                  </div>
                </aside>
              </div>

              {/* Panel Footer */}
              <div className={styles.panelFooter}>
                <div className={styles.footerCoordinates}>
                  <span>COORDINATES: LAHORE, PK (UTC+5)</span>
                  <span className={styles.footerSep}>•</span>
                  <span>STATUS: AVAILABLE FOR HIGH-IMPACT ROLES</span>
                </div>

                <div className={styles.footerSocials}>
                  <a
                    href="https://github.com/TalibIbrahim"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playHoverBeep}
                    className={styles.socialLink}
                  >
                    <span>GITHUB</span>
                    <ExternalLink size={11} aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/muhammad-talib-ibrahim"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playHoverBeep}
                    className={styles.socialLink}
                  >
                    <span>LINKEDIN</span>
                    <ExternalLink size={11} aria-hidden="true" />
                  </a>
                  <a
                    href="mailto:talibibrahim04@gmail.com"
                    onMouseEnter={playHoverBeep}
                    className={styles.socialLink}
                  >
                    <Mail size={12} aria-hidden="true" />
                    <span>DIRECT INBOX</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
