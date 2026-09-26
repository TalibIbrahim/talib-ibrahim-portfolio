'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal } from 'lucide-react';
import styles from './MSportTheme.module.css';

export default function MSportNav() {
  return (
    <>
      <div className={styles.mStripeBar} />
      <header className={styles.navContainer}>
        <div className={styles.navInner}>
          <Link href="/m-sport" className={styles.brandCluster}>
            <div className={styles.mInsignia} aria-label="BMW M Insignia">
              <span className={styles.stripeBlue} />
              <span className={styles.stripeViolet} />
              <span className={styles.stripeRed} />
              <span className={styles.mLetter}>M</span>
            </div>
            <div>
              <div className={styles.brandLabel}>TALIB IBRAHIM</div>
              <div className={styles.brandSub}>TELEMETRY VER 3.8 // M-SPORT</div>
            </div>
          </Link>

          <nav className={styles.navLinks} aria-label="Motorsport Navigation">
            <a href="#overview" className={styles.navLink}>
              01. OVERVIEW
            </a>
            <a href="#projects" className={styles.navLink}>
              02. PROJECTS
            </a>
            <a href="#benchmarks" className={styles.navLink}>
              03. BENCHMARKS
            </a>
            <a href="#contact" className={styles.navLink}>
              04. PADDOCK
            </a>
          </nav>

          <a href="#contact" className={styles.navPaddockBtn}>
            <Terminal size={14} />
            <span>REQ_DATA_PACKET</span>
          </a>
        </div>
      </header>
    </>
  );
}
