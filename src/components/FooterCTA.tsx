'use client';

import { SocialLink } from '../data/types';
import styles from './FooterCTA.module.css';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import GlassSurface from './GlassSurface';
import Magnet from './react-bits/Magnet';

export interface FooterCTAProps {
  socials: readonly SocialLink[];
}

export default function FooterCTA({ socials }: FooterCTAProps) {
  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const containerScale = useTransform(scrollYProgress, [0, 1], [0.92, 1.0], { clamp: true });

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.glowEffect}></div>
      <motion.div 
        className={styles.container}
        style={{ scale: containerScale }}
      >
        <div className={styles.content}>
          <h2 className={styles.heading}>Let&apos;s build something together.</h2>
          <p className={styles.subtext}>Open for new opportunities and collaborations.</p>
          
          <div className={styles.socialsContainer}>
            {socials.map((social) => (
              <Magnet key={social.platform} padding={25} magnetStrength={0.35}>
                <a 
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none' }}
                  aria-label={`Visit ${social.platform}`}
                >
                  <GlassSurface 
                    width={150} 
                    height={50} 
                    borderRadius={25}
                    backgroundOpacity={0.05}
                    blur={15}
                    className={styles.socialLink}
                  >
                    <span>{social.platform}</span>
                  </GlassSurface>
                </a>
              </Magnet>
            ))}
          </div>
        </div>
        
        <div className={styles.bottomBar}>
          <p>&copy; {new Date().getFullYear()} Talib Ibrahim. All Rights Reserved.</p>
        </div>
      </motion.div>
    </footer>
  );
}
