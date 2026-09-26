'use client';

import React, { useEffect } from 'react';
import NothingAbstractBackground from '@/components/nothing/NothingAbstractBackground';
import NothingNav from '@/components/nothing/NothingNav';
import NothingHero from '@/components/nothing/NothingHero';
import NothingProjects from '@/components/nothing/NothingProjects';
import NothingHardwareSpecs from '@/components/nothing/NothingHardwareSpecs';
import NothingContact from '@/components/nothing/NothingContact';
import NothingFooter from '@/components/nothing/NothingFooter';
import { useColorMode } from '@/hooks/useColorMode';
import styles from '@/components/nothing/NothingTheme.module.css';

/**
 * /nothing Route: Dedicated Nothing OS Hardware & Dot-Matrix Architecture
 * Abstract geometric vector substrate inspired by Nothing Phone (2/2a/2a Plus).
 * Features non-scaling circuit ribbon conduits, dual camera nexus,
 * Doto dot-matrix typography, surgical Nothing Red (#D71921) accents,
 * and unified Dark Mode / Light Mode reactivity.
 */
export default function NothingPage() {
  const { mode } = useColorMode();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'nothing');
  }, []);

  return (
    <div className={styles.nothingPage} data-theme="nothing" data-mode={mode}>
      <NothingAbstractBackground />
      <NothingNav />
      <main>
        <NothingHero />
        <NothingProjects />
        <NothingHardwareSpecs />
        <NothingContact />
      </main>
      <NothingFooter />
    </div>
  );
}
