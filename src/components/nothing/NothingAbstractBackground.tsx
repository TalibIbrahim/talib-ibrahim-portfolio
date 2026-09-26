'use client';

import React from 'react';
import { useColorMode } from '@/hooks/useColorMode';
import styles from './NothingAbstractBackground.module.css';

export interface NothingAbstractBackgroundProps {
  readonly className?: string;
}

/**
 * NothingAbstractBackground
 *
 * Replaces the literal phone chassis outline with an architectural, abstract
 * geometric composition inspired by the Nothing Phone (2), Phone (2a), and Phone (2a Plus).
 *
 * Core Features:
 * 1. Top-left camera "eyes" (dual optical apertures) & concentric antenna nexus with radial tick markings.
 * 2. Massimo Vignelli subway map-style circuit ribbon conduits (parallel hairline traces with 90° filleted turns and 45° doglegs).
 * 3. Segmented glyph light conduits and concentric arcs.
 * 4. Technical registration crosshairs (+, corner crop marks, coordinate legends like [NFC // 13.56 MHz], REV.2A+).
 * 5. Micro-Torx screw pairs with 45° crosshair slots at structural plate anchor points.
 * 6. Solitary surgical red (#D71921) tally square/dot anchor with ambient breathing pulse.
 * 7. Translucent cutout plates with micro-perforations (vent hole matrix) and heat spreader diagonal fins.
 * 8. Full support for Dark Mode (data-mode="dark") and Light Mode (data-mode="light") with non-scaling hairline linework.
 */
export default function NothingAbstractBackground({
  className = '',
}: NothingAbstractBackgroundProps) {
  const { mode } = useColorMode();

  // 36 Radial compass azimuth ticks around the central nexus (every 10 deg)
  const radialTicks = Array.from({ length: 36 }, (_, i) => {
    const angleDeg = i * 10;
    const angleRad = (angleDeg * Math.PI) / 180;
    const isMajor = i % 3 === 0;
    const r1 = 175;
    const r2 = isMajor ? 193 : 185;
    const x1 = 360 + Math.cos(angleRad) * r1;
    const y1 = 320 + Math.sin(angleRad) * r1;
    const x2 = 360 + Math.cos(angleRad) * r2;
    const y2 = 320 + Math.sin(angleRad) * r2;
    return { id: `tick-${i}`, x1, y1, x2, y2, isMajor, angleDeg };
  });

  // Concentric antenna & coil rings around the nexus
  const antennaRings = [55, 95, 138, 205, 255, 305, 345];

  // Micro-Torx screw pairs (x, y)
  const torxPairs = [
    { x1: 210, y1: 100, x2: 236, y2: 100 },
    { x1: 660, y1: 490, x2: 686, y2: 490 },
    { x1: 1420, y1: 490, x2: 1446, y2: 490 },
    { x1: 660, y1: 1030, x2: 686, y2: 1030 },
    { x1: 1420, y1: 1030, x2: 1446, y2: 1030 },
    { x1: 1420, y1: 100, x2: 1446, y2: 100 },
  ];

  // SMT Via Test Points
  const vias = [
    { cx: 480, cy: 110 },
    { cx: 1120, cy: 110 },
    { cx: 1280, cy: 270 },
    { cx: 1280, cy: 680 },
    { cx: 1560, cy: 680 },
    { cx: 360, cy: 630 },
    { cx: 580, cy: 1000 },
    { cx: 1380, cy: 1000 },
    { cx: 180, cy: 320 },
    { cx: 180, cy: 840 },
    { cx: 320, cy: 980 },
    { cx: 800, cy: 490 },
    { cx: 1020, cy: 490 },
  ];

  return (
    <div
      className={`${styles.backgroundWrapper} ${className}`}
      data-mode={mode}
      aria-hidden="true"
    >
      <svg
        className={styles.svgAbstract}
        viewBox="0 0 1600 1200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Micro Torx Screw Symbol (45-degree crosshair slot) */}
          <g id="torx-fastener">
            <circle
              cx="0"
              cy="0"
              r="7"
              fill="var(--sub-torx-head)"
              stroke="var(--sub-stroke-primary)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="0"
              cy="0"
              r="4.8"
              fill="var(--sub-fill-plate-subtle)"
              stroke="var(--sub-stroke-secondary)"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
            />
            {/* 45° Torx Crosshair Slot */}
            <path
              d="M -2.8 -2.8 L 2.8 2.8 M -2.8 2.8 L 2.8 -2.8"
              stroke="var(--sub-torx-slot)"
              strokeWidth="0.9"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx="0" cy="0" r="1.1" fill="var(--sub-torx-slot)" />
          </g>

          {/* SMT Via Test Point */}
          <g id="smt-via-node">
            <circle
              cx="0"
              cy="0"
              r="3.5"
              fill="var(--sub-fill-plate)"
              stroke="var(--sub-stroke-primary)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx="0" cy="0" r="1.4" fill="var(--sub-stroke-primary)" />
          </g>

          {/* Vent Hole Micro-Perforations Matrix */}
          <pattern
            id="vent-hole-pattern"
            x="0"
            y="0"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="6" cy="6" r="1.3" fill="var(--sub-perf)" />
          </pattern>

          {/* Diagonal Cooling Fin Vents */}
          <pattern
            id="cooling-fin-pattern"
            width="10"
            height="10"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="10"
              stroke="var(--sub-hatch)"
              strokeWidth="1.2"
            />
          </pattern>

          {/* Optical Lens Arc Reflex Gradient */}
          <linearGradient id="lens-reflex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 0: REGISTRATION CROSSHAIRS, CROP MARKS & COORDINATE LEGENDS
            ═══════════════════════════════════════════════════════════════ */}
        <g id="registration-marks">
          {/* Corner Crop Marks (L-shaped tick pairs) */}
          <path
            d="M 60 75 V 50 H 85 M 1540 75 V 50 H 1515 M 60 1125 V 1150 H 85 M 1540 1125 V 1150 H 1515"
            stroke="var(--sub-stroke-primary)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          {/* Technical Center & Cardinal Crosshairs (+) */}
          {[
            { x: 80, y: 60 },
            { x: 800, y: 60 },
            { x: 1520, y: 60 },
            { x: 80, y: 1140 },
            { x: 800, y: 1140 },
            { x: 1520, y: 1140 },
            { x: 360, y: 60 },
            { x: 1280, y: 1140 },
          ].map((pt, i) => (
            <path
              key={`crosshair-${i}`}
              d={`M ${pt.x - 7} ${pt.y} H ${pt.x + 7} M ${pt.x} ${pt.y - 7} V ${pt.y + 7}`}
              stroke="var(--sub-stroke-primary)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Technical Typography Legends */}
          <text
            x="95"
            y="55"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="8.5"
            fontWeight="600"
            letterSpacing="1.2"
            fill="var(--sub-text-primary)"
          >
            REV.2A+ // ABSTRACT-GEOMETRY-SPEC // SEC_SYS_01
          </text>

          <text
            x="815"
            y="55"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="8.5"
            letterSpacing="1.5"
            fill="var(--sub-text-muted)"
          >
            [NFC // 13.56 MHz // COIL-V4]
          </text>

          <text
            x="95"
            y="1145"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="8.5"
            letterSpacing="1.2"
            fill="var(--sub-text-muted)"
          >
            MASSIMO VIGNELLI ROUTING // 6-CH BUS // TOLERANCE ±0.05mm
          </text>

          <text
            x="1300"
            y="1145"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="8.5"
            letterSpacing="1.2"
            fill="var(--sub-text-primary)"
          >
            CHASSIS-GEO-2026 // NT-SYS-DEV
          </text>

          {/* Vertical Coordinate Stamp */}
          <text
            x="45"
            y="600"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="8"
            letterSpacing="1.8"
            fill="var(--sub-text-muted)"
            transform="rotate(-90 45 600)"
          >
            NOTHING OS // GEOMETRIC BACKPANEL // NO-BEZEL // TALIB-IBRAHIM
          </text>
        </g>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 1: TRANSLUCENT CUTOUT PLATES & MICRO-PERFORATION MATRICES
            ═══════════════════════════════════════════════════════════════ */}
        <g id="cutout-plates">
          {/* Upper Motherboard Translucent Carrier Plate */}
          <path
            d="M 160 85
               H 1440
               A 20 20 0 0 1 1460 105
               V 440
               A 20 20 0 0 1 1440 460
               H 640
               L 590 410
               H 160
               A 20 20 0 0 1 140 390
               V 105
               A 20 20 0 0 1 160 85
               Z"
            fill="var(--sub-fill-plate)"
            stroke="var(--sub-stroke-secondary)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Mid-Right Battery / Power Shield Plate with Vent Hole Matrix */}
          <rect
            x="660"
            y="490"
            width="800"
            height="540"
            rx="24"
            ry="24"
            fill="var(--sub-fill-plate)"
            stroke="var(--sub-stroke-secondary)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="672"
            y="502"
            width="776"
            height="516"
            rx="16"
            ry="16"
            fill="url(#vent-hole-pattern)"
          />

          {/* Diagonal Cooling Fin Cutout Window */}
          <rect
            x="700"
            y="530"
            width="280"
            height="140"
            rx="12"
            ry="12"
            fill="var(--sub-fill-plate-subtle)"
            stroke="var(--sub-stroke-secondary)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="706"
            y="536"
            width="268"
            height="128"
            rx="8"
            ry="8"
            fill="url(#cooling-fin-pattern)"
          />
          <text
            x="720"
            y="556"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="8"
            fontWeight="700"
            letterSpacing="1"
            fill="var(--sub-text-primary)"
          >
            HEAT-DISSIPATION-MATRIX // REV.2A+
          </text>

          {/* Lower Sub-board Logic Island Plate */}
          <path
            d="M 160 860
               H 540
               A 20 20 0 0 1 560 880
               V 1080
               A 20 20 0 0 1 540 1100
               H 160
               A 20 20 0 0 1 140 1080
               V 880
               A 20 20 0 0 1 160 860
               Z"
            fill="var(--sub-fill-plate)"
            stroke="var(--sub-stroke-secondary)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
          <text
            x="170"
            y="885"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="8"
            fontWeight="600"
            letterSpacing="1"
            fill="var(--sub-text-muted)"
          >
            SUB-BOARD-IO // LOGIC-CARRIER
          </text>
        </g>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 2: MASSIMO VIGNELLI SUBWAY MAP-STYLE CIRCUIT RIBBONS
            ═══════════════════════════════════════════════════════════════ */}
        <g id="vignelli-circuit-ribbons">
          {/* Trunk Ribbon Alpha (5 Parallel Hairline Traces with 90° Fillets & 45° Doglegs) */}
          {[0, 8, 16, 24, 32].map((offset, i) => (
            <path
              key={`ribbon-a-${i}`}
              d={`M ${480} ${110 + offset}
                  H ${1120 - offset}
                  A ${24 + offset} ${24 + offset} 0 0 1 ${1144} ${134 + offset}
                  L ${1280 - offset} ${270}
                  V ${680 - offset}
                  A ${20 + offset} ${20 + offset} 0 0 0 ${1300} ${700}
                  H ${1560}`}
              fill="none"
              stroke="var(--sub-stroke-primary)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Trunk Ribbon Beta (4 Parallel Hairlines from Nexus Down to Right Base) */}
          {[0, 8, 16, 24].map((offset, i) => (
            <path
              key={`ribbon-b-${i}`}
              d={`M ${360 + offset} ${630}
                  V ${780 - offset}
                  L ${580 + offset} ${1000}
                  H ${1380 - offset}
                  A ${20 + offset} ${20 + offset} 0 0 1 ${1400} ${1020 + offset}
                  V 1180`}
              fill="none"
              stroke="var(--sub-stroke-primary)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Flank Ribbon Gamma (3 Parallel Traces along Left Flank) */}
          {[0, 8, 16].map((offset, i) => (
            <path
              key={`ribbon-c-${i}`}
              d={`M 80 ${320 + offset}
                  H ${180 - offset}
                  A ${16 + offset} ${16 + offset} 0 0 1 ${196} ${336 + offset}
                  V ${840 - offset}
                  L ${320} ${964 + offset}
                  H 520`}
              fill="none"
              stroke="var(--sub-stroke-primary)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* SMT Integrated Circuit Component Footprints along Bus Paths */}
          <rect
            x="1264"
            y="380"
            width="32"
            height="64"
            rx="4"
            ry="4"
            fill="var(--sub-fill-chip)"
            stroke="var(--sub-stroke-primary)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {/* IC Pin Landing Array */}
          {Array.from({ length: 6 }, (_, i) => (
            <g key={`ic-pins-${i}`}>
              <line
                x1="1256"
                y1={390 + i * 9}
                x2="1264"
                y2={390 + i * 9}
                stroke="var(--sub-stroke-primary)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="1296"
                y1={390 + i * 9}
                x2="1304"
                y2={390 + i * 9}
                stroke="var(--sub-stroke-primary)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
          <text
            x="1280"
            y="415"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="6.5"
            fill="var(--sub-text-primary)"
            textAnchor="middle"
            transform="rotate(-90 1280 415)"
          >
            IC-BUS-01
          </text>
        </g>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 3: CONCENTRIC ANTENNA NEXUS & RADIAL TICK MARKINGS
            ═══════════════════════════════════════════════════════════════ */}
        <g id="antenna-nexus">
          {/* Concentric Etched Antenna Rings */}
          {antennaRings.map((radius, idx) => (
            <circle
              key={`antenna-ring-${idx}`}
              cx="360"
              cy="320"
              r={radius}
              fill="none"
              stroke={idx % 2 === 0 ? 'var(--sub-stroke-primary)' : 'var(--sub-stroke-secondary)'}
              strokeWidth={idx % 2 === 0 ? '1.2' : '0.8'}
              strokeDasharray={idx === 2 ? '14 4' : idx === 4 ? '28 6' : undefined}
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Radial Azimuth Tick Ring */}
          <g className={styles.compassDriftRing}>
            {radialTicks.map((tick) => (
              <line
                key={tick.id}
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke={tick.isMajor ? 'var(--sub-stroke-primary)' : 'var(--sub-stroke-secondary)'}
                strokeWidth={tick.isMajor ? '1.2' : '0.8'}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          {/* Degree Callout at Cardinal 0° / 90° / 180° / 270° */}
          <text
            x="565"
            y="323"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fontWeight="600"
            fill="var(--sub-text-muted)"
          >
            090°
          </text>
          <text
            x="360"
            y="115"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fontWeight="600"
            fill="var(--sub-text-muted)"
            textAnchor="middle"
          >
            000° [N]
          </text>
          <text
            x="145"
            y="323"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fontWeight="600"
            fill="var(--sub-text-muted)"
            textAnchor="end"
          >
            270°
          </text>
          <text
            x="360"
            y="525"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fontWeight="600"
            fill="var(--sub-text-muted)"
            textAnchor="middle"
          >
            180° [S]
          </text>
        </g>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 4: TOP-LEFT CAMERA MODULE "EYES" (NOTHING PHONE 2A PAIR)
            ═══════════════════════════════════════════════════════════════ */}
        <g id="camera-module-eyes">
          {/* Horizontal Stadium Capsule Enclosing Dual Optical Eyes */}
          <rect
            x="240"
            y="262"
            width="240"
            height="116"
            rx="58"
            ry="58"
            fill="var(--sub-fill-plate)"
            stroke="var(--sub-stroke-primary)"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="248"
            y="270"
            width="224"
            height="100"
            rx="50"
            ry="50"
            fill="none"
            stroke="var(--sub-stroke-secondary)"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
          />

          {/* Left Camera Eye (50MP Wide OIS) */}
          <g id="camera-eye-left">
            <circle
              cx="300"
              cy="320"
              r="40"
              fill="var(--sub-camera-ring)"
              stroke="var(--sub-stroke-primary)"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="300"
              cy="320"
              r="30"
              fill="var(--sub-camera-lens)"
              stroke="var(--sub-stroke-primary)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx="300" cy="320" r="18" fill="#020204" />
            {/* Optical Glass Reflex Arc */}
            <path
              d="M 288 308 A 14 14 0 0 1 312 308"
              stroke="url(#lens-reflex-grad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          {/* Right Camera Eye (50MP Ultra-Wide) */}
          <g id="camera-eye-right">
            <circle
              cx="420"
              cy="320"
              r="40"
              fill="var(--sub-camera-ring)"
              stroke="var(--sub-stroke-primary)"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="420"
              cy="320"
              r="30"
              fill="var(--sub-camera-lens)"
              stroke="var(--sub-stroke-primary)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx="420" cy="320" r="18" fill="#020204" />
            {/* Optical Glass Reflex Arc */}
            <path
              d="M 408 308 A 14 14 0 0 1 432 308"
              stroke="url(#lens-reflex-grad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          {/* Inter-Lens Microphone Pinhole & Telemetry Callout */}
          <circle cx="360" cy="320" r="3" fill="var(--sub-stroke-primary)" />
          <circle
            cx="360"
            cy="320"
            r="6"
            fill="none"
            stroke="var(--sub-stroke-secondary)"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
          />
          <text
            x="360"
            y="350"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fontWeight="700"
            letterSpacing="0.8"
            fill="var(--sub-text-primary)"
            textAnchor="middle"
          >
            50MP DUAL // OIS
          </text>
        </g>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 5: SEGMENTED GLYPH LIGHT CONDUITS & CONCENTRIC ARCS
            ═══════════════════════════════════════════════════════════════ */}
        <g id="glyph-light-conduits" className={styles.glyphConduit}>
          {/* Glyph Segment 1: Upper Nexus Arc (315° to 35°) */}
          <path
            d="M 490 200 A 240 240 0 0 1 580 320"
            fill="none"
            stroke="var(--sub-glyph-fill)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 490 200 A 240 240 0 0 1 580 320"
            fill="none"
            stroke="var(--sub-glyph-stroke)"
            strokeWidth="1.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Glyph Segment 2: Lower-Right Nexus Arc (55° to 125°) */}
          <path
            d="M 580 365 A 240 240 0 0 1 470 495"
            fill="none"
            stroke="var(--sub-glyph-fill)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 580 365 A 240 240 0 0 1 470 495"
            fill="none"
            stroke="var(--sub-glyph-stroke)"
            strokeWidth="1.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Glyph Segment 3: Bottom-Left Arc (145° to 215°) */}
          <path
            d="M 400 535 A 240 240 0 0 1 205 440"
            fill="none"
            stroke="var(--sub-glyph-fill)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 400 535 A 240 240 0 0 1 205 440"
            fill="none"
            stroke="var(--sub-glyph-stroke)"
            strokeWidth="1.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Glyph Segment 4: 45° Diagonal Slash Bar (Phone 2 Diagnostic Slash) */}
          <line
            x1="660"
            y1="180"
            x2="800"
            y2="320"
            stroke="var(--sub-glyph-fill)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <line
            x1="660"
            y1="180"
            x2="800"
            y2="320"
            stroke="var(--sub-glyph-stroke)"
            strokeWidth="1.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Glyph Segment 5: Lower Exclamation Mark (Phone 2 Progress Bar) */}
          <line
            x1="360"
            y1="670"
            x2="360"
            y2="760"
            stroke="var(--sub-glyph-fill)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="360"
            y1="670"
            x2="360"
            y2="760"
            stroke="var(--sub-glyph-stroke)"
            strokeWidth="1"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Exclamation Dot Indicator */}
          <circle
            cx="360"
            cy="790"
            r="4.5"
            fill="var(--sub-glyph-fill)"
            stroke="var(--sub-glyph-stroke)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 6: SURGICAL RED (#D71921) TALLY ANCHOR & REC INDICATOR
            ═══════════════════════════════════════════════════════════════ */}
        <g id="surgical-red-tally" className={styles.redTallyAnchor}>
          {/* Bracket Registration Bounds [ ] */}
          <path
            d="M 700 226 H 692 V 246 H 700 M 724 226 H 732 V 246 H 724"
            stroke="var(--sub-stroke-primary)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          {/* Outer Halo */}
          <circle
            cx="712"
            cy="236"
            r="14"
            fill="rgba(215, 25, 33, 0.08)"
            stroke="rgba(215, 25, 33, 0.35)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          {/* Solitary Surgical Red Tally Square / Dot */}
          <rect
            x="706"
            y="230"
            width="12"
            height="12"
            rx="2.5"
            ry="2.5"
            fill="#D71921"
          />
        </g>

        {/* Silkscreen Callout for Surgical Red Anchor */}
        <text
          x="745"
          y="234"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="8.5"
          fontWeight="700"
          fill="var(--sub-text-primary)"
          letterSpacing="0.8"
        >
          REC TALLY // NT-02A
        </text>
        <text
          x="745"
          y="245"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="7"
          fontWeight="600"
          fill="#D71921"
          letterSpacing="0.6"
        >
          ACTIVE // SURGICAL-RED // #D71921
        </text>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 7: MICRO-TORX SCREW PAIRS & SMT VIA TEST POINTS
            ═══════════════════════════════════════════════════════════════ */}
        <g id="torx-screw-pairs">
          {torxPairs.map((pair, idx) => (
            <g key={`torx-pair-${idx}`}>
              <use href="#torx-fastener" x={pair.x1} y={pair.y1} />
              <use href="#torx-fastener" x={pair.x2} y={pair.y2} />
              {/* Connecting Fastener Tension Line */}
              <line
                x1={pair.x1 + 7}
                y1={pair.y1}
                x2={pair.x2 - 7}
                y2={pair.y2}
                stroke="var(--sub-stroke-secondary)"
                strokeWidth="0.8"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </g>

        {/* SMT Via Junction Nodes */}
        <g id="smt-via-nodes">
          {vias.map((v, i) => (
            <use key={`via-${i}`} href="#smt-via-node" x={v.cx} y={v.cy} />
          ))}
        </g>
      </svg>
    </div>
  );
}
