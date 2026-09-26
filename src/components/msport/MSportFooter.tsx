'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import styles from './MSportTheme.module.css';

export default function MSportFooter() {
  return (
    <footer className={styles.paddockFooter}>
      <div className={styles.footerInner}>
        <div className={styles.footerCopy}>
          <div>MUHAMMAD TALIB IBRAHIM // M-SPORT THEME SPEC 3.8</div>
          <div style={{ color: '#555b6a', marginTop: '0.25rem' }}>
            ENGINEERED WITH NEXT.JS 14, FRAMER MOTION & JETBRAINS TELEMETRY
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
            <ExternalLink size={12} style={{ display: 'inline', marginLeft: 4 }} />
          </a>
          <a
            href="https://linkedin.com/in/muhammad-talib-ibrahim"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            <span>LINKEDIN</span>
            <ExternalLink size={12} style={{ display: 'inline', marginLeft: 4 }} />
          </a>
          <a
            href="mailto:talibibrahim04@gmail.com"
            className={styles.footerLink}
          >
            <span>DIRECT UPLINK</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
