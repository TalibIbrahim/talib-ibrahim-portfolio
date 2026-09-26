'use client';

import React, { useEffect, useCallback } from 'react';
import AppleDynamicIsland from '@/components/apple/AppleDynamicIsland';
import AppleNav from '@/components/apple/AppleNav';
import AppleHero from '@/components/apple/AppleHero';
import AppleProductShowcase from '@/components/apple/AppleProductShowcase';
import AppleTechSpecs from '@/components/apple/AppleTechSpecs';
import AppleContact from '@/components/apple/AppleContact';
import AppleFooter from '@/components/apple/AppleFooter';
import { useColorMode } from '@/hooks/useColorMode';
import styles from '@/components/apple/AppleTheme.module.css';

/**
 * /apple Route: Apple Keynote & Product Launch Showcase
 * Restrained elegance, genuine frosted glass surfaces (blur + saturation boost),
 * generous whitespace, keynote typography, and Apple cubic-bezier easing curves.
 * Defaults to Light mode with seamless Dark mode support.
 */
export default function AppleRoute() {
  const { mode, toggleMode, setMode } = useColorMode();
  const isDark = mode === 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'apple');

    const applePref = localStorage.getItem('apple_mode_preference');
    if (applePref === 'dark') {
      if (mode !== 'dark') {
        setMode('dark');
      }
    } else {
      // If no mode preference is stored, or if apple_mode_preference !== 'dark', default to 'light'
      if (mode !== 'light') {
        setMode('light');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleTheme = useCallback(() => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('apple_mode_preference', nextMode);
    } catch {
      // Restricted or private browsing mode
    }
    toggleMode();
  }, [mode, toggleMode]);

  return (
    <div
      className={`${styles.appleWrapper} ${isDark ? styles.appleWrapperDark : ''}`}
      data-theme="apple"
      data-mode={mode}
    >
      <AppleDynamicIsland />
      <AppleNav isDark={isDark} onToggleTheme={handleToggleTheme} />
      <main>
        <AppleHero />
        <AppleProductShowcase />
        <AppleTechSpecs />
        <AppleContact />
      </main>
      <AppleFooter />
    </div>
  );
}
