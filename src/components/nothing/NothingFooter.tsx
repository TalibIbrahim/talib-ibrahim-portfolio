'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import styles from './NothingTheme.module.css';

export default function NothingFooter() {
  return (
    <footer className={styles.hardwareFooter}>
      <div className={styles.footerInner}>
        <div className={styles.footerChassis}>
          <div>TALIB IBRAHIM // CHASSIS REV 4.2 // LAHORE, PK</div>
          <div className={styles.footerSub}>
            ALL CIRCUITS OPERATIONAL. HARDWARE &amp; SOFTWARE INTERFACE STABLE.
          </div>
        </div>

        <div className={styles.footerLinks}>
          <a
            href="https://github.com/TalibIbrahim"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            <span>GITHUB</span>
            <ArrowUpRight size={12} className={styles.footerIcon} />
          </a>
          <a
            href="https://linkedin.com/in/muhammad-talib-ibrahim"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            <span>LINKEDIN</span>
            <ArrowUpRight size={12} className={styles.footerIcon} />
          </a>
          <a
            href="mailto:talibibrahim04@gmail.com"
            className={styles.footerLink}
          >
            <span>UPLINK</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
