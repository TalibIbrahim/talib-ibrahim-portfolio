'use client';

import React, { useEffect } from 'react';
import MSportBackground from '@/components/msport/MSportBackground';
import MSportNav from '@/components/msport/MSportNav';
import MSportHero from '@/components/msport/MSportHero';
import MSportProjects from '@/components/msport/MSportProjects';
import MSportTelemetrySpecs from '@/components/msport/MSportTelemetrySpecs';
import MSportContact from '@/components/msport/MSportContact';
import MSportFooter from '@/components/msport/MSportFooter';
import styles from '@/components/msport/MSportTheme.module.css';

/**
 * /m-sport Route: Dedicated BMW M Sport Motorsport Architecture
 * 115° canted angle motifs, authentic BMW M tri-color stripes (#008AC9, #2B115A, #F11A22),
 * chamfered polygon geometry, Rajdhani motorsport typography, 0-60 telemetry stat blocks,
 * and high-density engineering benchmarks.
 */
export default function MSportPage() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'msport');
    document.documentElement.setAttribute('data-mode', 'dark');
  }, []);

  return (
    <div className={styles.msportPage} data-theme="msport">
      <MSportBackground />
      <MSportNav />
      <main>
        <MSportHero />
        <MSportProjects />
        <MSportTelemetrySpecs />
        <MSportContact />
      </main>
      <MSportFooter />
    </div>
  );
}
