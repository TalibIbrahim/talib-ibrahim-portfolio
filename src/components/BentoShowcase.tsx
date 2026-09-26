'use client';

import { Project } from '../data/types';
import styles from './BentoShowcase.module.css';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import GlassSurface from './GlassSurface';
import DecryptedText from './react-bits/DecryptedText';
import SpotlightCard from './react-bits/SpotlightCard';
import Magnet from './react-bits/Magnet';
import { useRef, useCallback } from 'react';

export interface BentoShowcaseProps {
  projects: readonly Project[];
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isLarge = index % 3 === 0;

  // Cursor-follow tilt values
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Map cursor offset from center to ±8 degrees
    const maxTilt = 8;
    const tiltX = -((e.clientY - centerY) / (rect.height / 2)) * maxTilt;
    const tiltY = ((e.clientX - centerX) / (rect.width / 2)) * maxTilt;
    rotateX.set(tiltX);
    rotateY.set(tiltY);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    // Perspective wrapper — perspective MUST be on parent, not on the transformed element
    <div 
      className={`${styles.cardPerspective} ${isLarge ? styles.cardLarge : styles.cardSmall}`}
    >
      <SpotlightCard
        spotlightColor="rgba(204, 255, 0, 0.14)"
        className={styles.spotlightCard}
      >
        <motion.article 
          ref={cardRef}
          className={styles.card}
          initial={{ 
            opacity: 0, 
            clipPath: "inset(40% 20% 40% 20% round 2rem)", 
            filter: "blur(8px)",
            scale: 0.85,
          }}
          whileInView={{ 
            opacity: 1, 
            clipPath: "inset(0% 0% 0% 0% round 1.5rem)",
            filter: "blur(0px)",
            scale: 1,
          }}
          viewport={{ once: false, margin: '-10%' }}
          transition={{ type: "spring", stiffness: 60, damping: 18, mass: 1.2, delay: (index % 3) * 0.12 }}
          style={{ 
            rotateX: springRotateX,
            rotateY: springRotateY,
            cursor: "pointer",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={(e: React.MouseEvent) => {
            if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) return;
            const url = project.liveLink || project.githubLink;
            if (url) window.open(url, '_blank', 'noopener,noreferrer');
          }}
        >
          <div 
            className={styles.cardBackground}
            style={{ backgroundImage: `url(${project.thumbnailUrl})` }}
          />
          <div className={styles.cardOverlay} />
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <h3 className={styles.title}>{project.title}</h3>
              <div className={styles.links}>
                {project.githubLink && (
                  <Magnet padding={20} magnetStrength={0.3}>
                    <a href={project.githubLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }} aria-label="GitHub">
                      <GlassSurface width={60} height={35} borderRadius={12} className={styles.link} backgroundOpacity={0.1}>
                        <span>GH</span>
                      </GlassSurface>
                    </a>
                  </Magnet>
                )}
                {project.liveLink && (
                  <Magnet padding={20} magnetStrength={0.3}>
                    <a href={project.liveLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }} aria-label="Live Site">
                      <GlassSurface width={70} height={35} borderRadius={12} className={styles.link} backgroundOpacity={0.1}>
                        <span>LIVE</span>
                      </GlassSurface>
                    </a>
                  </Magnet>
                )}
              </div>
            </div>
            
            <p className={styles.description}>{project.description}</p>
            
            <div className={styles.tags}>
              {project.techTags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        </motion.article>
      </SpotlightCard>
    </div>
  );
}

export default function BentoShowcase({ projects }: BentoShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Multi-speed parallax on title (preserved)
  const { scrollYProgress: scrollOverallProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const titleY = useTransform(scrollOverallProgress, [0, 1], [30, -30]);

  // Camera Transition: Dolly-in entry (Hero -> BentoShowcase)
  const { scrollYProgress: scrollEnterProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });
  const containerScale = useTransform(scrollEnterProgress, [0, 0.5], [1.08, 1.0], { clamp: true });

  // Camera Transition: Pan-left exit (BentoShowcase -> ExperienceTimeline)
  const { scrollYProgress: scrollExitProgress } = useScroll({
    target: sectionRef,
    offset: ["end 80%", "end 20%"],
  });
  const containerX = useTransform(scrollExitProgress, [0, 1], [0, -40], { clamp: true });

  return (
    <section ref={sectionRef} className={styles.section}>
      <motion.div 
        className={styles.container}
        style={{ scale: containerScale, x: containerX }}
      >
        <div className={styles.badgeWrapper}>
          <span className={styles.badgeDot} aria-hidden="true" />
          <span className={styles.badgeText}>
            <DecryptedText
              text="01 // ARCHITECTURE & SELECTED WORKS"
              speed={30}
              maxIterations={10}
              animateOn="view"
            />
          </span>
        </div>

        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          style={{ y: titleY }}
        >
          Selected Works
        </motion.h2>
        <div className={styles.bentoGrid}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
