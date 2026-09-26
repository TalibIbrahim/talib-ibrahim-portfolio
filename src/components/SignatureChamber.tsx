'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useThemeSystem } from '@/hooks/useThemeSystem';
import styles from './SignatureChamber.module.css';

export interface SignatureChamberProps {
  className?: string;
}

/**
 * Lucius Fox Applied Sciences — SignatureChamber
 *
 * Pinned scroll-driven zoom-out section positioned between Hero and BentoShowcase.
 * Adapts with complete structural and stylistic independence to Neon, M Sport, and Nothing themes:
 * - M Sport: Aerodynamic wind-tunnel streamlines, 115° M-stripe telemetry guideway, tachometer arcs, chamfered cards.
 * - Nothing: Minimalist Cartesian dot-matrix coordinate grid, dimension callouts, surgical #D71921 pips.
 * - Neon: Glowing cybernetic rotating radial radar with concentric scanning rings and lime aura.
 * - Non-overlapping quadrant telemetry cards engineered to fit all screen sizes with zero collision.
 */
export default function SignatureChamber({ className = '' }: SignatureChamberProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { theme, mode: colorMode } = useThemeSystem();

  const isLight = colorMode === 'light';

  // Dynamic stroke color for the signature paths
  const sigStrokeColor =
    theme === 'msport'
      ? isLight
        ? '#008AC9'
        : '#81C4FF'
      : theme === 'nothing'
        ? isLight
          ? '#000000'
          : '#ffffff'
        : isLight
          ? '#7fa600'
          : '#ccff00';

  // Dynamic tittle dots on the two 'i's in "Talib Ibrahim"
  const iDotColor =
    theme === 'msport'
      ? '#F11A22' // Official M Warm Red pop!
      : theme === 'nothing'
        ? '#D71921' // Nothing Red
        : isLight
          ? '#7fa600'
          : '#ccff00';

  // Chamber badge text tailored per theme
  const chamberBadgeText =
    theme === 'msport'
      ? '/// M-PERFORMANCE // IDENTITY CHAMBER'
      : theme === 'nothing'
        ? 'FIG. 00 // IDENTITY EMBLEM'
        : 'IDENTITY CHAMBER // APPLIED SCIENCES';

  // Track scroll throughout the 180vh pinned chamber
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Background zoom-out scale: 1.3 down to 1.0
  const bgScaleRaw = useTransform(scrollYProgress, [0, 1], [1.3, 1.0]);
  const bgScale = useSpring(bgScaleRaw, { stiffness: 90, damping: 22 });

  // Rotating radial radar grid lines (Neon only)
  const radarRotateRaw = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const radarRotate = useSpring(radarRotateRaw, { stiffness: 70, damping: 20 });

  // Vector SVG cursive path drawing dynamically mapped across [0.1, 0.7] -> [0, 1]
  const rawPathLength = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);
  const pathLength = useSpring(rawPathLength, { stiffness: 90, damping: 20, restDelta: 0.001 });

  // Overall signature opacity fade-in
  const signatureOpacity = useTransform(scrollYProgress, [0.05, 0.15], [0.25, 1.0]);

  // Telemetry Metric 1: 01 // 3.6 GPA CS — UMT LAHORE (stagger window ~0.16 - 0.32)
  const m1Raw = useTransform(scrollYProgress, [0.16, 0.32], [0, 1]);
  const m1Spring = useSpring(m1Raw, { stiffness: 120, damping: 18 });
  const m1Y = useTransform(m1Spring, [0, 1], [24, 0]);
  const m1Scale = useTransform(m1Spring, [0, 1], [0.9, 1]);

  // Telemetry Metric 2: 02 // AI VECTOR RAG PIPELINES (stagger window ~0.26 - 0.42)
  const m2Raw = useTransform(scrollYProgress, [0.26, 0.42], [0, 1]);
  const m2Spring = useSpring(m2Raw, { stiffness: 120, damping: 18 });
  const m2Y = useTransform(m2Spring, [0, 1], [24, 0]);
  const m2Scale = useTransform(m2Spring, [0, 1], [0.9, 1]);

  // Telemetry Metric 3: 03 // PEER-TO-PEER WEBRTC ENGINE (stagger window ~0.36 - 0.52)
  const m3Raw = useTransform(scrollYProgress, [0.36, 0.52], [0, 1]);
  const m3Spring = useSpring(m3Raw, { stiffness: 120, damping: 18 });
  const m3Y = useTransform(m3Spring, [0, 1], [24, 0]);
  const m3Scale = useTransform(m3Spring, [0, 1], [0.9, 1]);

  // Telemetry Metric 4: 04 // PHYSICS-BASED GAME MECHANICS (stagger window ~0.46 - 0.62)
  const m4Raw = useTransform(scrollYProgress, [0.46, 0.62], [0, 1]);
  const m4Spring = useSpring(m4Raw, { stiffness: 120, damping: 18 });
  const m4Y = useTransform(m4Spring, [0, 1], [24, 0]);
  const m4Scale = useTransform(m4Spring, [0, 1], [0.9, 1]);

  // Scroll cue visibility (fades as user progresses through chamber)
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.15, 0.75, 0.9], [1, 0.85, 0.3, 0]);

  return (
    <section
      ref={containerRef}
      className={`${styles.chamberContainer} ${className}`.trim()}
      aria-label="Signature Chamber and Identity Telemetry"
    >
      <div className={styles.stickyChamber}>
        {/* Background Zoom-Out Scale Container with Structural Theme Identity */}
        <motion.div
          className={styles.bgLayer}
          style={{
            scale: bgScale,
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className={styles.ambientGlow} aria-hidden="true" />

          {/* Theme-Specific Structural Background Visuals */}
          {theme === 'msport' ? (
            /* ════ BMW M SPORT: AERODYNAMIC WIND-TUNNEL & SPEED TELEMETRY GRID ════ */
            <svg
              className={styles.msportTelemetrySvg}
              viewBox="0 0 1400 900"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Wind tunnel horizontal velocity streamlines */}
              <g opacity={isLight ? 0.25 : 0.18}>
                <line x1="40" y1="140" x2="1360" y2="140" stroke={isLight ? '#008AC9' : '#81C4FF'} strokeWidth="1" strokeDasharray="16 20" />
                <line x1="80" y1="280" x2="1320" y2="280" stroke={isLight ? '#008AC9' : '#81C4FF'} strokeWidth="0.8" strokeDasharray="8 28" />
                <line x1="120" y1="620" x2="1280" y2="620" stroke={isLight ? '#008AC9' : '#81C4FF'} strokeWidth="0.8" strokeDasharray="8 28" />
                <line x1="40" y1="760" x2="1360" y2="760" stroke={isLight ? '#008AC9' : '#81C4FF'} strokeWidth="1" strokeDasharray="16 20" />
              </g>

              {/* 115° Canted BMW M Tri-Color Telemetry Guideway */}
              <g opacity={isLight ? 0.35 : 0.28}>
                <line x1="480" y1="40" x2="380" y2="860" stroke="#008AC9" strokeWidth="2.5" strokeDasharray="10 8" />
                <line x1="510" y1="40" x2="410" y2="860" stroke="#2B115A" strokeWidth="2.5" strokeDasharray="10 8" />
                <line x1="540" y1="40" x2="440" y2="860" stroke="#F11A22" strokeWidth="2.5" strokeDasharray="10 8" />
              </g>

              {/* Dynamic Tachometer Dynamics Curve */}
              <path
                d="M 180 470 Q 700 390 1220 470"
                stroke={isLight ? '#008AC9' : '#81C4FF'}
                strokeWidth="1.2"
                strokeDasharray="5 10"
                opacity={isLight ? 0.3 : 0.22}
              />

              {/* Telemetry Precision Markers & Callouts */}
              <g
                opacity={isLight ? 0.65 : 0.5}
                fill={isLight ? '#008AC9' : '#81C4FF'}
                fontFamily="var(--font-rajdhani), sans-serif"
                fontSize="11"
                fontWeight="700"
                letterSpacing="0.12em"
              >
                <text x="140" y="75">{'/// M-POWER // TELEMETRY CALIBRATION'}</text>
                <text x="1260" y="75" textAnchor="end">{'LATERAL G: 1.42G // CHASSIS BALANCED'}</text>
                <text x="140" y="835">{'AERODYNAMICS: ACTIVE DOWNFORCE // 240 KM/H'}</text>
                <text x="1260" y="835" textAnchor="end">{'LAP TIME DELTA: -0.428s'}</text>
              </g>
            </svg>
          ) : theme === 'nothing' ? (
            /* ════ NOTHING THEME: CARTESIAN DOT-MATRIX & CROSSHAIR GRID ════ */
            <svg
              className={styles.nothingGridSvg}
              viewBox="0 0 1400 900"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <g opacity={isLight ? 0.25 : 0.16} stroke={isLight ? '#000000' : '#ffffff'} strokeWidth="0.8">
                <line x1="160" y1="90" x2="1240" y2="90" strokeDasharray="3 14" />
                <line x1="160" y1="450" x2="1240" y2="450" strokeDasharray="3 14" />
                <line x1="160" y1="810" x2="1240" y2="810" strokeDasharray="3 14" />
                <line x1="160" y1="90" x2="160" y2="810" strokeDasharray="3 14" />
                <line x1="700" y1="90" x2="700" y2="810" strokeDasharray="3 14" />
                <line x1="1240" y1="90" x2="1240" y2="810" strokeDasharray="3 14" />
              </g>

              {/* Coordinate Crosshairs */}
              <g stroke={isLight ? '#000000' : '#ffffff'} strokeWidth="1" opacity={isLight ? 0.5 : 0.35}>
                <path d="M 690 450 H 710 M 700 440 V 460" />
                <path d="M 150 90 H 170 M 160 80 V 100" />
                <path d="M 1230 90 H 1250 M 1240 80 V 100" />
                <path d="M 150 810 H 170 M 160 800 V 820" />
                <path d="M 1230 810 H 1250 M 1240 800 V 820" />
              </g>

              {/* Surgical Nothing Red Pips */}
              <circle cx="700" cy="450" r="3.5" fill="#D71921" />
              <circle cx="160" cy="90" r="2.5" fill="#D71921" />
              <circle cx="1240" cy="810" r="2.5" fill="#D71921" />

              {/* Dot-matrix labels */}
              <g
                fill={isLight ? '#000000' : '#ffffff'}
                opacity={isLight ? 0.6 : 0.4}
                fontFamily="var(--font-dot-matrix), monospace"
                fontSize="10"
                letterSpacing="0.08em"
              >
                <text x="180" y="85">{'FIG. 00-A // CHASSIS BOUNDS'}</text>
                <text x="1220" y="85" textAnchor="end">{'SCALE: 1:1 // MONOCHROME'}</text>
                <text x="180" y="805">{'HARDWARE REVISION: 2.4.0'}</text>
                <text x="1220" y="805" textAnchor="end">{'SYS.REF // 0x4E4F5448'}</text>
              </g>
            </svg>
          ) : (
            /* ════ NEON THEME: ROTATING CYBERPUNK RADAR DISH ════ */
            <motion.svg
              className={styles.radarSvg}
              viewBox="0 0 1200 1200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ rotate: radarRotate }}
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="radarRadialGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ccff00" stopOpacity="0.12" />
                  <stop offset="60%" stopColor="#ccff00" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#ccff00" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Radar ambient fill */}
              <circle cx="600" cy="600" r="540" fill="url(#radarRadialGlow)" />

              {/* Concentric Radar Rings */}
              <circle cx="600" cy="600" r="120" stroke="currentColor" strokeWidth="1" />
              <circle cx="600" cy="600" r="220" stroke="currentColor" strokeWidth="1" />
              <circle cx="600" cy="600" r="320" stroke="currentColor" strokeWidth="1" strokeDasharray="6 8" />
              <circle cx="600" cy="600" r="420" stroke="currentColor" strokeWidth="1" />
              <circle cx="600" cy="600" r="520" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 9" />
              <circle cx="600" cy="600" r="570" stroke="currentColor" strokeWidth="0.8" />

              {/* Primary Crosshairs */}
              <line x1="60" y1="600" x2="1140" y2="600" stroke="currentColor" strokeWidth="1" />
              <line x1="600" y1="60" x2="600" y2="1140" stroke="currentColor" strokeWidth="1" />

              {/* Diagonal Telemetry Spokes */}
              <line x1="218" y1="218" x2="982" y2="982" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 6" />
              <line x1="982" y1="218" x2="218" y2="982" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 6" />

              {/* Cardinal Degree Callouts */}
              <text x="600" y="45" fill="currentColor" fontSize="12" fontFamily="monospace" textAnchor="middle" letterSpacing="0.2em">{'000° // NORTH'}</text>
              <text x="1165" y="605" fill="currentColor" fontSize="12" fontFamily="monospace" textAnchor="start" letterSpacing="0.2em">{'090° // EAST'}</text>
              <text x="600" y="1175" fill="currentColor" fontSize="12" fontFamily="monospace" textAnchor="middle" letterSpacing="0.2em">{'180° // SOUTH'}</text>
              <text x="35" y="605" fill="currentColor" fontSize="12" fontFamily="monospace" textAnchor="end" letterSpacing="0.2em">{'270° // WEST'}</text>

              {/* Precision Grid Crosses */}
              <path d="M 590 600 H 610 M 600 590 V 610" stroke="#ccff00" strokeWidth="1.5" strokeOpacity="0.4" />
              <path d="M 370 380 H 390 M 380 370 V 390" stroke="currentColor" strokeWidth="1" />
              <path d="M 810 380 H 830 M 820 370 V 390" stroke="currentColor" strokeWidth="1" />
              <path d="M 370 820 H 390 M 380 810 V 830" stroke="currentColor" strokeWidth="1" />
              <path d="M 810 820 H 830 M 820 810 V 830" stroke="currentColor" strokeWidth="1" />
            </motion.svg>
          )}
        </motion.div>

        {/* Central Stage: Giant Vector SVG Handwritten Signature & Identity Emblem */}
        <motion.div
          className={styles.signatureWrapper}
          style={{ opacity: signatureOpacity }}
        >
          {/* Chamber Header Badge */}
          <div className={styles.chamberBadge}>
            <span className={styles.chamberBadgeDot} aria-hidden="true" />
            <span>{chamberBadgeText}</span>
          </div>

          {/* SVG Vector Signature "Talib Ibrahim" */}
          <svg
            className={styles.signatureSvg}
            viewBox="0 0 1100 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Handwritten signature of Talib Ibrahim"
          >
            {/* Identity Crest: Theme-Specific Monogram Emblem behind signature */}
            {theme === 'msport' ? (
              /* BMW M Sport: 115° Canted Aerodynamic Tri-Color Insignia */
              <motion.g
                style={{ pathLength, opacity: pathLength }}
                className={styles.signatureEmblemPath}
              >
                <polygon
                  points="510,35 640,35 610,205 480,205"
                  stroke={isLight ? 'rgba(0, 138, 201, 0.4)' : 'rgba(129, 196, 255, 0.45)'}
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                />
                {/* Authentic ///M Triple Stripes at 115° angle */}
                <line x1="535" y1="65" x2="515" y2="175" stroke="#008AC9" strokeWidth="6" strokeLinecap="round" />
                <line x1="555" y1="65" x2="535" y2="175" stroke="#2B115A" strokeWidth="6" strokeLinecap="round" />
                <line x1="575" y1="65" x2="555" y2="175" stroke="#F11A22" strokeWidth="6" strokeLinecap="round" />
              </motion.g>
            ) : theme === 'nothing' ? (
              /* Nothing Theme: Minimalist 0px Coordinate Module */
              <motion.g
                style={{ pathLength, opacity: pathLength }}
                className={styles.signatureEmblemPath}
              >
                <rect
                  x="475"
                  y="45"
                  width="150"
                  height="150"
                  stroke={isLight ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)'}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <circle cx="550" cy="120" r="45" stroke={isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'} strokeWidth="1" />
                <circle cx="550" cy="120" r="4" fill="#D71921" />
              </motion.g>
            ) : (
              /* Neon Theme: Hexagonal Telemetry Crest */
              <motion.g
                style={{ pathLength, opacity: pathLength }}
                className={styles.signatureEmblemPath}
              >
                <polygon
                  points="550,25 615,55 645,120 615,185 550,215 485,185 455,120 485,55"
                  stroke="rgba(204, 255, 0, 0.3)"
                  strokeWidth="1.2"
                  strokeDasharray="4 6"
                />
                <circle cx="550" cy="120" r="50" stroke="rgba(204, 255, 0, 0.25)" strokeWidth="1" />
                <path d="M 522 98 H 578 M 550 98 V 144 M 538 144 H 562" stroke="rgba(204, 255, 0, 0.5)" strokeWidth="1.5" />
              </motion.g>
            )}

            {/* Glowing Underlying Aura Paths */}
            {/* 1. "Talib" */}
            <motion.path
              d="M 130 115 C 160 88 250 82 320 98 C 335 102 325 118 300 120 C 255 124 225 142 240 185 C 252 220 248 248 228 258 C 214 265 200 252 210 232 C 220 212 240 202 260 205 C 275 188 300 190 308 208 C 314 222 302 242 284 242 C 270 242 268 225 280 212 C 292 200 310 202 318 230 C 324 248 334 235 342 198 C 352 138 365 116 372 122 C 378 130 372 158 364 198 C 358 232 362 245 375 245 C 388 245 396 226 404 212 C 412 202 418 218 416 238 C 416 245 424 248 432 242 C 442 235 452 168 462 132 C 468 128 474 140 468 172 C 462 206 458 242 476 245 C 490 248 502 230 496 212 C 490 196 478 202 494 210"
              style={{ pathLength }}
              stroke={sigStrokeColor}
              className={styles.signatureGlowPath}
            />
            {/* 2. "Ibrahim" */}
            <motion.path
              d="M 520 235 C 540 218 560 152 575 92 C 586 48 614 52 602 102 C 590 152 550 226 540 264 C 532 286 555 278 576 246 C 590 226 602 148 614 145 C 622 142 624 160 616 192 C 610 225 610 245 628 245 C 640 245 650 228 642 212 C 635 198 624 205 640 210 C 650 212 658 192 670 195 C 680 198 678 222 674 242 C 678 246 688 238 695 222 C 702 205 718 198 726 210 C 734 220 726 242 714 246 C 702 250 695 238 702 222 C 710 208 726 212 736 232 C 742 245 752 212 762 132 C 768 128 772 142 768 176 C 762 212 760 245 775 245 C 785 245 798 212 808 215 C 815 218 812 238 818 245 C 825 245 832 222 840 215 C 848 210 852 230 850 245 C 858 215 868 215 872 245 C 880 212 892 215 898 245"
              style={{ pathLength }}
              stroke={sigStrokeColor}
              className={styles.signatureGlowPath}
            />
            {/* 3. Underline flourish */}
            <motion.path
              d="M 900 245 C 925 252 950 262 970 248 C 982 236 960 228 910 235 C 800 252 590 280 370 282 C 210 285 100 276 75 262 C 58 250 80 240 130 242 C 230 248 470 252 710 255 C 850 258 1010 248 1055 236"
              style={{ pathLength }}
              stroke={sigStrokeColor}
              className={styles.signatureGlowPath}
            />

            {/* Core Foreground Signature Paths */}
            {/* 1. "Talib" */}
            <motion.path
              d="M 130 115 C 160 88 250 82 320 98 C 335 102 325 118 300 120 C 255 124 225 142 240 185 C 252 220 248 248 228 258 C 214 265 200 252 210 232 C 220 212 240 202 260 205 C 275 188 300 190 308 208 C 314 222 302 242 284 242 C 270 242 268 225 280 212 C 292 200 310 202 318 230 C 324 248 334 235 342 198 C 352 138 365 116 372 122 C 378 130 372 158 364 198 C 358 232 362 245 375 245 C 388 245 396 226 404 212 C 412 202 418 218 416 238 C 416 245 424 248 432 242 C 442 235 452 168 462 132 C 468 128 474 140 468 172 C 462 206 458 242 476 245 C 490 248 502 230 496 212 C 490 196 478 202 494 210"
              style={{ pathLength }}
              stroke={sigStrokeColor}
              className={styles.signaturePath}
            />
            {/* Tittle dot on first i */}
            <motion.circle
              cx="411"
              cy="180"
              r="3.5"
              fill={iDotColor}
              style={{ pathLength, opacity: pathLength }}
            />

            {/* 2. "Ibrahim" */}
            <motion.path
              d="M 520 235 C 540 218 560 152 575 92 C 586 48 614 52 602 102 C 590 152 550 226 540 264 C 532 286 555 278 576 246 C 590 226 602 148 614 145 C 622 142 624 160 616 192 C 610 225 610 245 628 245 C 640 245 650 228 642 212 C 635 198 624 205 640 210 C 650 212 658 192 670 195 C 680 198 678 222 674 242 C 678 246 688 238 695 222 C 702 205 718 198 726 210 C 734 220 726 242 714 246 C 702 250 695 238 702 222 C 710 208 726 212 736 232 C 742 245 752 212 762 132 C 768 128 772 142 768 176 C 762 212 760 245 775 245 C 785 245 798 212 808 215 C 815 218 812 238 818 245 C 825 245 832 222 840 215 C 848 210 852 230 850 245 C 858 215 868 215 872 245 C 880 212 892 215 898 245"
              style={{ pathLength }}
              stroke={sigStrokeColor}
              className={styles.signaturePath}
            />
            {/* Tittle dot on second i */}
            <motion.circle
              cx="812"
              cy="180"
              r="3.5"
              fill={iDotColor}
              style={{ pathLength, opacity: pathLength }}
            />

            {/* 3. Underline flourish */}
            <motion.path
              d="M 900 245 C 925 252 950 262 970 248 C 982 236 960 228 910 235 C 800 252 590 280 370 282 C 210 285 100 276 75 262 C 58 250 80 240 130 242 C 230 248 470 252 710 255 C 850 258 1010 248 1055 236"
              style={{ pathLength }}
              stroke={sigStrokeColor}
              className={styles.signaturePath}
            />
          </svg>

          {/* Technical Metadata Bar below signature */}
          <div className={styles.signatureMetaBar}>
            {theme === 'msport' ? (
              <>
                <div className={styles.signatureMetaItem}>
                  <span>SPEC:</span>
                  <span className={styles.signatureMetaAccent}>MOTORSPORT TELEMETRY // 115° CANT</span>
                </div>
                <div className={styles.signatureMetaItem}>
                  <span>CHASSIS:</span>
                  <span className={styles.signatureMetaAccent}>M-PERFORMANCE ACTIVE</span>
                </div>
                <div className={styles.signatureMetaItem}>
                  <span>CIRCUIT:</span>
                  <span className={styles.signatureMetaAccent}>LAHORE, PK</span>
                </div>
              </>
            ) : theme === 'nothing' ? (
              <>
                <div className={styles.signatureMetaItem}>
                  <span>ENCODING:</span>
                  <span className={styles.signatureMetaAccent}>RAW SVG // 0x4E4F</span>
                </div>
                <div className={styles.signatureMetaItem}>
                  <span>GRID:</span>
                  <span className={styles.signatureMetaAccent}>1:1 MONOCHROME</span>
                </div>
                <div className={styles.signatureMetaItem}>
                  <span>LOC:</span>
                  <span className={styles.signatureMetaAccent}>31.5204° N, 74.3587° E</span>
                </div>
              </>
            ) : (
              <>
                <div className={styles.signatureMetaItem}>
                  <span>ENCODING:</span>
                  <span className={styles.signatureMetaAccent}>VECTOR SVG // BEZIER INTERPOLATION</span>
                </div>
                <div className={styles.signatureMetaItem}>
                  <span>CALIBRATION:</span>
                  <span className={styles.signatureMetaAccent}>SPRING-DAMPED</span>
                </div>
                <div className={styles.signatureMetaItem}>
                  <span>ORIGIN:</span>
                  <span className={styles.signatureMetaAccent}>LAHORE, PK</span>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Telemetry Quadrant Overlay: 4 Metrics popping in with staggered springs */}
        <div className={styles.telemetryOverlay}>
          {/* 01 // 3.6 GPA CS — UMT LAHORE */}
          <motion.div
            className={`${styles.telemetryCard} ${styles.metric1}`}
            style={{
              opacity: m1Spring,
              y: m1Y,
              scale: m1Scale,
            }}
          >
            <span className={styles.cardCornerTL} aria-hidden="true" />
            <span className={styles.cardCornerTR} aria-hidden="true" />
            <span className={styles.cardCornerBL} aria-hidden="true" />
            <span className={styles.cardCornerBR} aria-hidden="true" />

            <div className={styles.cardHeader}>
              <span className={styles.cardIndex}>01 // ACADEMIC RECORD</span>
              <span className={styles.cardStatus}>
                <span className={styles.cardStatusDot} />
                <span>MERIT.TOP</span>
              </span>
            </div>
            <h3 className={styles.cardTitle}>3.6 GPA CS — UMT LAHORE</h3>
            <p className={styles.cardSub}>
              BS Computer Science. Rigorous foundations in data structures, algorithms, and systems engineering.
            </p>
            <div className={styles.cardFooter}>
              <span>DISCIPLINE // CS</span>
              <span>GRADE // 3.6 / 4.0</span>
            </div>
          </motion.div>

          {/* 02 // AI VECTOR RAG PIPELINES */}
          <motion.div
            className={`${styles.telemetryCard} ${styles.metric2}`}
            style={{
              opacity: m2Spring,
              y: m2Y,
              scale: m2Scale,
            }}
          >
            <span className={styles.cardCornerTL} aria-hidden="true" />
            <span className={styles.cardCornerTR} aria-hidden="true" />
            <span className={styles.cardCornerBL} aria-hidden="true" />
            <span className={styles.cardCornerBR} aria-hidden="true" />

            <div className={styles.cardHeader}>
              <span className={styles.cardIndex}>02 // INTELLIGENCE STACK</span>
              <span className={styles.cardStatus}>
                <span className={styles.cardStatusDot} />
                <span>ACTIVE.RAG</span>
              </span>
            </div>
            <h3 className={styles.cardTitle}>AI VECTOR RAG PIPELINES</h3>
            <p className={styles.cardSub}>
              Semantic retrieval, recursive document chunking, and LLM context injection deployed in GitChat and Byters.
            </p>
            <div className={styles.cardFooter}>
              <span>EMBEDDINGS // 1536-DIM</span>
              <span>SEARCH // COSINE K-NN</span>
            </div>
          </motion.div>

          {/* 03 // PEER-TO-PEER WEBRTC ENGINE */}
          <motion.div
            className={`${styles.telemetryCard} ${styles.metric3}`}
            style={{
              opacity: m3Spring,
              y: m3Y,
              scale: m3Scale,
            }}
          >
            <span className={styles.cardCornerTL} aria-hidden="true" />
            <span className={styles.cardCornerTR} aria-hidden="true" />
            <span className={styles.cardCornerBL} aria-hidden="true" />
            <span className={styles.cardCornerBR} aria-hidden="true" />

            <div className={styles.cardHeader}>
              <span className={styles.cardIndex}>03 // DISTRIBUTED MESH</span>
              <span className={styles.cardStatus}>
                <span className={styles.cardStatusDot} />
                <span>P2P.SYNCED</span>
              </span>
            </div>
            <h3 className={styles.cardTitle}>PEER-TO-PEER WEBRTC ENGINE</h3>
            <p className={styles.cardSub}>
              Zero-storage, encrypted browser DataChannel mesh with low-latency Socket.IO signaling in QuickDrop.
            </p>
            <div className={styles.cardFooter}>
              <span>TRANSPORT // WEBRTC</span>
              <span>LATENCY // SUB-15MS</span>
            </div>
          </motion.div>

          {/* 04 // PHYSICS-BASED GAME MECHANICS */}
          <motion.div
            className={`${styles.telemetryCard} ${styles.metric4}`}
            style={{
              opacity: m4Spring,
              y: m4Y,
              scale: m4Scale,
            }}
          >
            <span className={styles.cardCornerTL} aria-hidden="true" />
            <span className={styles.cardCornerTR} aria-hidden="true" />
            <span className={styles.cardCornerBL} aria-hidden="true" />
            <span className={styles.cardCornerBR} aria-hidden="true" />

            <div className={styles.cardHeader}>
              <span className={styles.cardIndex}>04 // SIMULATION ENGINE</span>
              <span className={styles.cardStatus}>
                <span className={styles.cardStatusDot} />
                <span>60FPS.LOCKED</span>
              </span>
            </div>
            <h3 className={styles.cardTitle}>PHYSICS-BASED GAME MECHANICS</h3>
            <p className={styles.cardSub}>
              Custom 2D slingshot kinematics, trajectory solvers, and collision responses built in Unity &amp; C# for SlingKick.
            </p>
            <div className={styles.cardFooter}>
              <span>ENGINE // UNITY C#</span>
              <span>SOLVER // RIGIDBODY2D</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll Cue Indicator */}
        <motion.div className={styles.scrollCue} style={{ opacity: scrollCueOpacity }}>
          <span>SYSTEM CALIBRATION IN PROGRESS</span>
          <span className={styles.scrollBracket}>[ SCROLL TO EXPAND CHAMBER ]</span>
        </motion.div>
      </div>
    </section>
  );
}
