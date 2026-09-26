'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import Image from 'next/image';
import { HeroData } from '../data/types';
import styles from './Hero.module.css';
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useScroll,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import DecryptedText from './react-bits/DecryptedText';
import Magnet from './react-bits/Magnet';
import { useThemeSystem } from '@/hooks/useThemeSystem';

export interface HeroProps {
  data: HeroData;
}

export default function Hero({ data }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { theme } = useThemeSystem();
  
  const [isVariantA, setIsVariantA] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Live Clock for Nothing Theme
  const [currentTime, setCurrentTime] = useState<string>('00:00:00');
  const [currentDate, setCurrentDate] = useState<string>('26.09.26');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
      const d = String(now.getDate()).padStart(2, '0');
      const mon = String(now.getMonth() + 1).padStart(2, '0');
      const y = String(now.getFullYear()).slice(-2);
      setCurrentDate(`${d}.${mon}.${y}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsVariantA(Math.random() > 0.5);
    setHasMounted(true);
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // --- Cursor tracking (desktop) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const maskSize = useMotionValue(0);
  const springMaskSize = useSpring(maskSize, { damping: 20, stiffness: 150 });

  // --- Scroll-based reveal for touch/mobile ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  // Map scroll 0-0.3 to mask size 0-800px (reveal as user starts scrolling)
  const scrollMaskSize = useTransform(scrollYProgress, [0, 0.3], [0, 800]);
  const springScrollMask = useSpring(scrollMaskSize, { damping: 30, stiffness: 100 });

  // --- Velocity-reactive Marquee Skew ---
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const tickerSkewX = useTransform(smoothVelocity, [-2000, 2000], [-8, 8]);

  // --- Multi-speed Parallax (Mid depth 0) ---
  // Portrait drifts upward at 0.4× as page scrolls past hero
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  // Hero text container drifts with a subtle y offset (0.6× speed)
  const textY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  // --- Camera Transition: Dolly-in exit (Hero -> BentoShowcase) ---
  // Scale down slightly on exit as user approaches the bottom of Hero
  const heroScale = useTransform(scrollYProgress, [0.7, 1.0], [1.0, 0.96], { clamp: true });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || isTouchDevice) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [isTouchDevice, mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    if (isTouchDevice) return;
    maskSize.set(500);
  }, [isTouchDevice, maskSize]);

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    maskSize.set(0);
  }, [isTouchDevice, maskSize]);

  // Desktop: cursor-following radial mask
  const desktopMask = useMotionTemplate`radial-gradient(${springMaskSize}px circle at ${springX}px ${springY}px, black 70%, transparent 100%)`;
  
  // Mobile/touch: scroll-driven centered radial mask
  const mobileMask = useMotionTemplate`radial-gradient(${springScrollMask}px circle at 50% 50%, black 70%, transparent 100%)`;

  const renderContent = (isRevealLayer: boolean) => {
    const isNeonMode = isVariantA ? isRevealLayer : !isRevealLayer;
    const layerModeClass = isNeonMode ? styles.neonMode : styles.grayscaleMode;

    return (
      <div className={`${styles.layerContent} ${layerModeClass}`}>
        {/* ── NOTHING THEME STRUCTURAL PRIMITIVES ── */}
        {theme === 'nothing' && (
          <>
            {/* Live Nothing Circular Clock Widget */}
            <div className={styles.nothingClockWidget} aria-label="Nothing clinical clock widget">
              <span className={styles.nothingClockTime}>{currentTime}</span>
              <span className={styles.nothingClockDate}>{`${currentDate} // LHR`}</span>
              <div className={styles.nothingClockPip} />
              <span className={styles.crosshairTL}>+</span>
              <span className={styles.crosshairBR}>+</span>
            </div>

            {/* Abstract Geometric Shapes with Soft Grain Fill & Crosshairs & Single Red Pop */}
            <div className={styles.nothingAbstractMotif} aria-hidden="true">
              <div className={styles.nothingBlockModule}>
                <span className={styles.nothingBlockLabel}>{'FIG. 01 // ARCHITECTURE'}</span>
                <span className={styles.crosshairTL}>+</span>
                <span className={styles.crosshairTR}>+</span>
                <span className={styles.crosshairBL}>+</span>
                <span className={styles.crosshairBR}>+</span>
              </div>

              <div className={styles.nothingCapsuleShape}>
                <span className={styles.nothingCapsuleDot} />
                <span className={styles.nothingCapsuleDot} />
              </div>

              <div className={styles.nothingRedHalfCircle} />
            </div>
          </>
        )}

        {/* ── BMW M SPORT STRUCTURAL PRIMITIVES ── */}
        {theme === 'msport' && (
          <div className={styles.msportHeaderBar} aria-label="BMW M Sport Telemetry">
            <div className={styles.msportInsigniaGroup}>
              <div className={styles.msportStripeIcon}>
                <span className={styles.mBlue} />
                <span className={styles.mDarkBlue} />
                <span className={styles.mRed} />
              </div>
              <span className={styles.msportTitleText}>{'/// M-PERFORMANCE TELEMETRY // SECTOR 01'}</span>
            </div>
            <div className={styles.msportTachometer}>
              <span className={styles.msportTachoLabel}>RPM</span>
              <div className={styles.msportTachoLeds}>
                <span className={`${styles.tachoLed} ${styles.ledGreen}`} />
                <span className={`${styles.tachoLed} ${styles.ledGreen}`} />
                <span className={`${styles.tachoLed} ${styles.ledGreen}`} />
                <span className={`${styles.tachoLed} ${styles.ledYellow}`} />
                <span className={`${styles.tachoLed} ${styles.ledYellow}`} />
                <span className={`${styles.tachoLed} ${styles.ledRed}`} />
                <span className={`${styles.tachoLed} ${styles.ledRed}`} />
                <span className={`${styles.tachoLed} ${styles.ledBlue}`} />
              </div>
              <span className={styles.msportTachoValue}>8,250</span>
            </div>
          </div>
        )}

        <motion.div 
          className={styles.helmetImageWrapper}
          style={{ y: portraitY }}
        >
          <Image 
            src="/talib.png"
            alt="Muhammad Talib Ibrahim"
            width={700}
            height={900}
            className={styles.helmetImage}
            priority
          />
        </motion.div>

        <motion.div 
          className={styles.container}
          style={{ y: textY }}
        >
          <Magnet padding={30} magnetStrength={0.25}>
            <div className={styles.statusBadgeWrapper}>
              <span className={styles.statusBadgeDot}></span>
              <span className={styles.statusBadgeText}>
                {theme === 'nothing' ? (
                  '00 // LAHORE, PK — (NOTHING OS 2.5)'
                ) : theme === 'msport' ? (
                  '/// M-SPORT // LAHORE, PK — TRACK READY'
                ) : (
                  <DecryptedText
                    text="00 // LAHORE, PK — ACTIVE DISPATCH"
                    speed={40}
                    maxIterations={12}
                    animateOn="view"
                  />
                )}
              </span>
            </div>
          </Magnet>
          
          <h1 className={styles.headline}>
            {data.headline.split(' ').map((word, i) => (
              <span key={i} className={styles.headlineWord}>{word}</span>
            ))}
          </h1>
          
          <p className={styles.subheadline}>
            {data.subheadline}
          </p>
        </motion.div>

        <div className={styles.tickerContainer}>
          <motion.div 
            className={styles.tickerTrack}
            style={{ skewX: prefersReducedMotion ? 0 : tickerSkewX }}
          >
            {[...data.tickerStrings, ...data.tickerStrings, ...data.tickerStrings, ...data.tickerStrings].map((str, idx) => (
              <span key={idx} className={styles.tickerItem}>
                {str}
                <span className={styles.tickerSeparator}>{"//"}</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    );
  };

  if (!hasMounted) {
    return <section className={styles.heroSection} style={{ minHeight: '100vh', backgroundColor: '#0d0d0f' }} />;
  }

  // If user prefers reduced motion, show neon mode statically
  if (prefersReducedMotion) {
    return (
      <section ref={containerRef} className={styles.heroSection}>
        <div className={styles.baseLayer}>
          {renderContent(false)}
        </div>
      </section>
    );
  }

  const activeMask = isTouchDevice ? mobileMask : desktopMask;

  return (
    <motion.section 
      ref={containerRef}
      className={styles.heroSection}
      style={{ scale: heroScale }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.baseLayer}>
        {renderContent(false)}
      </div>

      <motion.div 
        className={styles.revealLayer}
        style={{
          WebkitMaskImage: activeMask,
          maskImage: activeMask,
        }}
      >
        {renderContent(true)}
      </motion.div>
    </motion.section>
  );
}
