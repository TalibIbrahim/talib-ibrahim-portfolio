'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import styles from './AppleTheme.module.css';

export interface AppleNavProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function AppleNav({ isDark, onToggleTheme }: AppleNavProps) {
  return (
    <header className={styles.navHeader} role="banner">
      <div className={styles.navContainer}>
        <Link href="/apple" className={styles.navBrand}>
          <span>Talib Ibrahim</span>
        </Link>

        <nav className={styles.navLinks} aria-label="Apple Keynote navigation">
          <a href="#overview" className={styles.navLink}>Overview</a>
          <a href="#byters" className={styles.navLink}>Byters</a>
          <a href="#quickdrop" className={styles.navLink}>QuickDrop</a>
          <span className={styles.islandNotchSpacer} aria-hidden="true" />
          <a href="#gitchat" className={styles.navLink}>GitChat</a>
          <a href="#specs" className={styles.navLink}>Tech Specs</a>
          <a href="#contact" className={styles.navLink}>Contact</a>
        </nav>

        <div className={styles.navActions}>
          <button
            type="button"
            onClick={onToggleTheme}
            className={styles.themeToggleBtn}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <a href="#contact" className={styles.navCta}>
            Get in touch
          </a>
        </div>
      </div>
    </header>
  );
}
