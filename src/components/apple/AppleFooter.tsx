'use client';

import React from 'react';
import styles from './AppleTheme.module.css';

export default function AppleFooter() {
  return (
    <footer className={styles.appleFooter} role="contentinfo">
      <div className={styles.footerContainer}>
        <div className={styles.footerNotes}>
          <p>
            1. Byters Food Review platform architecture incorporates 1536-dimensional vector embeddings and collaborative group synchronization algorithms.
          </p>
          <p>
            2. QuickDrop peer-to-peer file transfer runs directly over WebRTC DataChannel protocols with ephemeral memory caching.
          </p>
          <p>
            3. GitChat utilizes recursive document chunking with local Ollama inference pipelines.
          </p>
        </div>

        <div className={styles.footerBottom}>
          <div>
            Copyright © {new Date().getFullYear()} Muhammad Talib Ibrahim. All rights reserved. Lahore, Pakistan.
          </div>

          <div className={styles.footerSocials}>
            <a
              href="https://github.com/TalibIbrahim"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerSocialLink}
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/muhammad-talib-ibrahim"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerSocialLink}
            >
              LinkedIn
            </a>
            <a
              href="mailto:talibibrahim04@gmail.com"
              className={styles.footerSocialLink}
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
