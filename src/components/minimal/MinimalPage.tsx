'use client';

import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';
import Contact from './Contact';
import Footer from './Footer';
import styles from './MinimalPage.module.css';

/**
 * MinimalPage: Exact Byte-For-Byte Restoration of Original Production
 * Pinned to Commit 7269015.
 * Monochromatic elegance, zero WebGL shaders, zero parallax distortions,
 * authentic film grain overlay, and standard responsive typography.
 */
export default function MinimalPage() {
  useEffect(() => {
    const stored = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', 'minimal');
    document.documentElement.setAttribute('data-mode', stored);
    document.documentElement.setAttribute('data-theme-variant', `minimal-${stored}`);
  }, []);

  return (
    <div className={styles.minimalWrapper} data-theme="minimal">
      <div className={styles.grainOverlay} aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
