'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './NothingTheme.module.css';

const SPEC_SECTIONS = [
  {
    category: 'LANGUAGES & RUNTIMES',
    qty: '06 UNITS',
    items: ['TypeScript (Strict Mode)', 'JavaScript (ES6+)', 'Node.js Runtime', 'C++ / Systems', 'C# / OOP', 'HTML5 / CSS3'],
  },
  {
    category: 'FRAMEWORKS & WEB',
    qty: '05 UNITS',
    items: ['Next.js 14 (App Router)', 'React.js 18', 'Redux Toolkit', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    category: 'NETWORKING & AI',
    qty: '06 UNITS',
    items: ['WebRTC DataChannels', 'Socket.IO WebSockets', 'LangChain Framework', 'Atlas Vector Search', 'RESTful Endpoints', 'Vercel AI SDK'],
  },
  {
    category: 'STORAGE & PERSISTENCE',
    qty: '05 UNITS',
    items: ['MongoDB Atlas', 'MySQL Relational', 'Redis Key-Value', 'Firebase Auth', 'Cloudinary CDN'],
  },
  {
    category: 'ACADEMIC CREDENTIALS',
    qty: '03 UNITS',
    items: ['BS Computer Science — UMT Lahore', 'Cumulative 3.60 GPA (Honors)', 'Expected Graduation: May 2027'],
  },
  {
    category: 'CERTIFICATIONS',
    qty: '04 UNITS',
    items: ['MERN Fullstack Guide (Schwarzmüller)', 'React Complete Guide (Next.js & Redux)', 'Google AI Fundamentals', 'Mindstorm Game Jam 2024'],
  },
];

export default function NothingHardwareSpecs() {
  return (
    <section id="hardware" className={styles.hardwareSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionFig}>(FIG. 04) // SPECIFICATIONS</div>
        <h2 className={styles.sectionTitle}>HARDWARE & SYSTEM SPEC</h2>
      </div>

      <div className={styles.specsGrid}>
        {SPEC_SECTIONS.map((sec, idx) => (
          <motion.div
            key={sec.category}
            className={styles.specCard}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', stiffness: 200, damping: 22, delay: idx * 0.08 }}
          >
            <div className={styles.specCardHeader}>
              <span className={styles.specCategory}>{sec.category}</span>
              <span className={styles.specQty}>{sec.qty}</span>
            </div>

            <div className={styles.specItemsList}>
              {sec.items.map((item) => (
                <div key={item} className={styles.specItemRow}>
                  <span className={styles.specItemDot} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
