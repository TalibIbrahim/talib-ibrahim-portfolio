'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useMode } from '@/context/ModeContext';
import styles from './ScrollLine.module.css';

export default function ScrollLine() {
  const { mode } = useMode();
  const { scrollYProgress } = useScroll();
  
  // Add heavy inertia to the scroll scrub to match the Lusion liquid feel
  // Instead of an instant 1:1 map, it pulls like a rubber band as you scroll
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    mass: 1.2
  });

  if (mode === 'boring') {
    return null;
  }

  return (
    <div className={styles.container} aria-hidden="true">
      <svg 
        viewBox="0 0 100 1000" 
        preserveAspectRatio="none" 
        className={styles.svg}
      >
        {/* Faint Background Track */}
        <path 
          d="M 50 0 L 50 150 L 10 190 L 10 400 L 90 480 L 90 750 L 50 790 L 50 1000" 
          className={styles.track} 
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Outer Neon Glow - Scrubbed by scroll */}
        <motion.path 
          d="M 50 0 L 50 150 L 10 190 L 10 400 L 90 480 L 90 750 L 50 790 L 50 1000" 
          className={styles.glowLine} 
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: springProgress }}
        />
        
        {/* Inner Bright Core - Scrubbed by scroll */}
        <motion.path 
          d="M 50 0 L 50 150 L 10 190 L 10 400 L 90 480 L 90 750 L 50 790 L 50 1000" 
          className={styles.coreLine} 
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: springProgress }}
        />
      </svg>
    </div>
  );
}
