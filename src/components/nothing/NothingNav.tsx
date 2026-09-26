'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import styles from './NothingTheme.module.css';

export default function NothingNav() {
  return (
    <>
      <div className={styles.topGridLine} />
      <header className={styles.navContainer}>
        <div className={styles.navInner}>
          <div className={styles.brandCluster}>
            <Link href="/nothing" className={styles.brandDotMatrix}>
              (TALIB)
            </Link>
            <span className={styles.brandRevision}>OS 2.5 // REV 4</span>
            <div className={styles.liveIndicator}>
              <span className={styles.redDot} />
              <span>LIVE</span>
            </div>
          </div>

          <nav className={styles.navLinks} aria-label="Hardware Navigation">
            <a href="#system" className={styles.navLink}>
              (01) SYSTEM
            </a>
            <a href="#projects" className={styles.navLink}>
              (02) MODULES
            </a>
            <a href="#hardware" className={styles.navLink}>
              (03) HARDWARE
            </a>
            <a href="#contact" className={styles.navLink}>
              (04) TRANSMIT
            </a>
          </nav>

          <a href="#contact" className={styles.navCta}>
            <span>CONTACT</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </header>
    </>
  );
}
