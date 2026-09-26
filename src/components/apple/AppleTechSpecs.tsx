'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './AppleTheme.module.css';

const appleScrollTransition = {
  duration: 0.7,
  ease: [0.16, 1, 0.3, 1] as const,
};

const SPEC_SECTIONS = [
  {
    category: 'Core Languages',
    items: ['TypeScript', 'JavaScript (ES6+)', 'C++', 'C#', 'HTML5', 'CSS3 / CSS Modules'],
  },
  {
    category: 'Frontend Architecture',
    items: ['Next.js (App Router)', 'React.js', 'Redux Toolkit', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    category: 'Backend & Networking',
    items: ['Node.js', 'Express.js', 'Socket.IO', 'WebRTC DataChannels', 'PeerJS', 'LangChain', 'Vercel AI SDK'],
  },
  {
    category: 'Data & Persistence',
    items: ['MongoDB Atlas', 'Atlas Vector Search', 'MySQL', 'Firebase', 'Redis (Upstash)', 'Cloudinary'],
  },
  {
    category: 'Academic Credentials',
    items: ['BS Computer Science — UMT Lahore (3.6 GPA)', 'Graduating May 2027', 'Merit Scholar'],
  },
  {
    category: 'Professional Certifications',
    items: [
      'Maximilian Schwarzmüller: The MERN Fullstack Guide',
      'React — The Complete Guide (Next.js & Redux)',
      'Google AI Fundamentals',
      'Mindstorm Studios Summer Game Jam 2024',
    ],
  },
];

export default function AppleTechSpecs() {
  return (
    <section id="specs" className={styles.techSpecsSection}>
      <motion.div
        className={styles.specsHeader}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={appleScrollTransition}
      >
        <h2 className={styles.specsTitle}>Technical Specifications.</h2>
        <p className={styles.specsSub}>
          Comprehensive competencies, engineering tools, and verified academic record.
        </p>
      </motion.div>

      <div className={styles.specsTable}>
        {SPEC_SECTIONS.map((sec, idx) => (
          <motion.div
            key={sec.category}
            className={styles.specsRow}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: idx * 0.06 }}
          >
            <div className={styles.specCategory}>{sec.category}</div>
            <div className={styles.specDetails}>
              <div className={styles.specTagList}>
                {sec.items.map((item) => (
                  <span key={item} className={styles.appleTag}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
