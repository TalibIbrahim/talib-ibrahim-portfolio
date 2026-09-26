'use client';

import { Experience } from '../data/types';
import styles from './ExperienceTimeline.module.css';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import DecryptedText from './react-bits/DecryptedText';
import { useRef } from 'react';

export interface ExperienceTimelineProps {
  experiences: readonly Experience[];
}

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Multi-speed parallax on title (preserved)
  const { scrollYProgress: scrollOverallProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const titleY = useTransform(scrollOverallProgress, [0, 1], [30, -30]);

  // Camera Transition: Pan-left entry (BentoShowcase -> ExperienceTimeline)
  const { scrollYProgress: scrollEnterProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 30%"],
  });
  const enterX = useTransform(scrollEnterProgress, [0, 1], [120, 0], { clamp: true });
  const springX = useSpring(enterX, { stiffness: 90, damping: 20, mass: 1 });

  // Camera Transition: Compress upward exit into Footer (ExperienceTimeline -> Footer)
  const { scrollYProgress: scrollExitProgress } = useScroll({
    target: sectionRef,
    offset: ["end 80%", "end 20%"],
  });
  const exitY = useTransform(scrollExitProgress, [0, 1], [0, -30], { clamp: true });

  return (
    <section ref={sectionRef} className={styles.section}>
      <motion.div 
        className={styles.container}
        style={{ x: springX, y: exitY }}
      >
        <div className={styles.badgeWrapper}>
          <span className={styles.badgeDot} aria-hidden="true" />
          <span className={styles.badgeText}>
            <DecryptedText
              text="03 // CAREER TIMELINE & TECHNICAL RECORD"
              speed={30}
              maxIterations={10}
              animateOn="view"
            />
          </span>
        </div>

        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          style={{ y: titleY }}
        >
          Experience
        </motion.h2>

        <div className={styles.timeline}>
          {experiences.map((exp, idx) => (
            <motion.div 
              key={exp.id}
              className={styles.item}
              initial={{ opacity: 0, x: -60, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: false, margin: '-15%' }}
              transition={{ 
                type: "spring", 
                stiffness: 60, 
                damping: 18, 
                mass: 1.2, 
                delay: idx * 0.1 
              }}
            >
              <div className={styles.durationWrapper}>
                <motion.span 
                  className={styles.duration}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, margin: '-15%' }}
                  transition={{ type: "spring", stiffness: 100, damping: 15, delay: idx * 0.1 + 0.1 }}
                >
                  {exp.duration}
                </motion.span>
                <div className={styles.line}></div>
                <motion.div 
                  className={styles.dot}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: false, margin: '-15%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: idx * 0.1 + 0.05 }}
                />
              </div>

              <div className={styles.content}>
                <motion.h3 
                  className={styles.role}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: '-15%' }}
                  transition={{ type: "spring", stiffness: 80, damping: 18, delay: idx * 0.1 + 0.15 }}
                >
                  {exp.role}
                </motion.h3>
                <motion.h4 
                  className={styles.company}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: '-15%' }}
                  transition={{ type: "spring", stiffness: 80, damping: 18, delay: idx * 0.1 + 0.2 }}
                >
                  {exp.company}
                </motion.h4>
                <ul className={styles.achievements}>
                  {exp.achievements.map((ach, i) => (
                    <motion.li 
                      key={i} 
                      className={styles.achievementItem}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, margin: '-10%' }}
                      transition={{ type: "spring", stiffness: 80, damping: 18, delay: idx * 0.1 + 0.25 + i * 0.08 }}
                    >
                      <span className={styles.bullet}></span>
                      {ach}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
