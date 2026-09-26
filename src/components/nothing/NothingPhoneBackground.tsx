'use client';

import React from 'react';
import styles from './NothingPhoneBackground.module.css';

interface NothingPhoneBackgroundProps {
  readonly className?: string;
}

/**
 * High-fidelity responsive vector background recreating the transparent back panel
 * of the Nothing Phone (Phone 1/2) on a light hardware substrate (#F5F5F7).
 * Features non-scaling mechanical strokes, etched wireless charging coil,
 * camera C-channel glyph, diagonal diagnostics slash, glowing red tally dot,
 * lower exclamation mark charging gauge, and a 16-point micro Torx fastener grid.
 */
export default function NothingPhoneBackground({ className }: NothingPhoneBackgroundProps = {}) {
  // Generate 18 concentric etched wireless charging coil rings
  const coilRings = Array.from({ length: 18 }, (_, i) => 95 + i * 10);

  // 16 Realistically placed Torx screw coordinates across the chassis
  const torxScrews = [
    { x: 170, y: 130 },
    { x: 500, y: 120 },
    { x: 830, y: 130 },
    { x: 380, y: 160 },
    { x: 170, y: 535 },
    { x: 380, y: 535 },
    { x: 520, y: 190 },
    { x: 760, y: 420 },
    { x: 200, y: 780 },
    { x: 800, y: 780 },
    { x: 200, y: 1220 },
    { x: 800, y: 1220 },
    { x: 440, y: 1420 },
    { x: 560, y: 1420 },
    { x: 200, y: 1740 },
    { x: 800, y: 1740 },
  ];

  return (
    <div className={`${styles.backgroundWrapper} ${className || ''}`} aria-hidden="true">
      <svg
        className={styles.svgChassis}
        viewBox="0 0 1000 2000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Micro Torx Fastener Definition */}
          <g id="torx-screw">
            <circle
              cx="0"
              cy="0"
              r="10"
              fill="#FFFFFF"
              stroke="rgba(0, 0, 0, 0.18)"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="0"
              cy="0"
              r="7"
              fill="rgba(0, 0, 0, 0.05)"
              stroke="rgba(0, 0, 0, 0.25)"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx="0" cy="0" r="4.2" fill="#2A2A30" />
            {/* 6-point Torx star driver slot */}
            <path
              d="M 0 -3.6 L 0 3.6 M -3.12 -1.8 L 3.12 1.8 M -3.12 1.8 L 3.12 -1.8"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx="0" cy="0" r="1.2" fill="#2A2A30" />
          </g>

          {/* SMT Via Test Point */}
          <g id="smt-via">
            <circle
              cx="0"
              cy="0"
              r="3.5"
              fill="#FFFFFF"
              stroke="rgba(0, 0, 0, 0.22)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx="0" cy="0" r="1.5" fill="#2A2A30" />
          </g>

          {/* Internal Shield Dot-Matrix Texture */}
          <pattern
            id="dot-matrix-plate"
            x="0"
            y="0"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="6" cy="6" r="0.8" fill="rgba(0, 0, 0, 0.08)" />
          </pattern>

          {/* Diagonal Hatch for Heat Spreader */}
          <pattern
            id="diagonal-hatch"
            width="8"
            height="8"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="rgba(0, 0, 0, 0.04)"
              strokeWidth="1.2"
            />
          </pattern>

          {/* Optical Lens Arc Gradient Highlight */}
          <linearGradient id="lens-reflex" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>

          {/* Red Tally Ambient Glow Filter */}
          <filter id="tally-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 0: EXTERNAL CARTESIAN ALIGNMENT & SYSTEM GRID MARKS
            ═══════════════════════════════════════════════════════════════ */}
        <g opacity="0.45">
          {/* Four Corner Registration Crosshairs */}
          <path
            d="M 50 40 L 50 60 M 40 50 L 60 50"
            stroke="rgba(0, 0, 0, 0.25)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 950 40 L 950 60 M 940 50 L 960 50"
            stroke="rgba(0, 0, 0, 0.25)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 50 1940 L 50 1960 M 40 1950 L 60 1950"
            stroke="rgba(0, 0, 0, 0.25)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 950 1940 L 950 1960 M 940 1950 L 960 1950"
            stroke="rgba(0, 0, 0, 0.25)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          {/* Technical Edge Callouts */}
          <text
            x="40"
            y="980"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="9"
            fill="rgba(0, 0, 0, 0.3)"
            letterSpacing="2"
            transform="rotate(-90 40 980)"
          >
            NOTHING ARCHITECTURE // PHONE (2) // TRANSPARENT BACKGLASS
          </text>
          <text
            x="960"
            y="1020"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="9"
            fill="rgba(0, 0, 0, 0.3)"
            letterSpacing="2"
            transform="rotate(90 960 1020)"
          >
            SYS-CHASSIS-SPEC // REV-4.2 // DEV-TALIB-PK
          </text>
        </g>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 1: MAIN PHONE CHASSIS & GLASS SUBSTRATE (900 x 1840)
            ═══════════════════════════════════════════════════════════════ */}
        {/* Outer Aluminum Frame Edge */}
        <rect
          x="120"
          y="80"
          width="760"
          height="1840"
          rx="90"
          ry="90"
          fill="rgba(255, 255, 255, 0.75)"
          stroke="rgba(0, 0, 0, 0.24)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Inner Glass Chamfer Bevel */}
        <rect
          x="132"
          y="92"
          width="736"
          height="1816"
          rx="78"
          ry="78"
          fill="none"
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Frame Antenna Insulation Notches */}
        <line
          x1="120"
          y1="240"
          x2="132"
          y2="240"
          stroke="#2A2A30"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="868"
          y1="240"
          x2="880"
          y2="240"
          stroke="#2A2A30"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="120"
          y1="1760"
          x2="132"
          y2="1760"
          stroke="#2A2A30"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="868"
          y1="1760"
          x2="880"
          y2="1760"
          stroke="#2A2A30"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 2: INTERNAL COMPONENT PLATES & TEXTURED ZONES
            ═══════════════════════════════════════════════════════════════ */}
        {/* Motherboard Upper Shield Plate */}
        <path
          d="M 160 140
             H 840
             A 30 30 0 0 1 870 170
             V 640
             L 810 700
             H 190
             L 160 670
             Z"
          fill="rgba(255, 255, 255, 0.92)"
          stroke="rgba(0, 0, 0, 0.14)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Battery Protective Cover (Left mid-section with dot-matrix plate) */}
        <rect
          x="160"
          y="720"
          width="280"
          height="620"
          rx="18"
          ry="18"
          fill="#FFFFFF"
          stroke="rgba(0, 0, 0, 0.14)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        <rect
          x="168"
          y="728"
          width="264"
          height="604"
          rx="12"
          ry="12"
          fill="url(#dot-matrix-plate)"
        />

        {/* Lower Sub-Board Shield Plate */}
        <rect
          x="160"
          y="1360"
          width="680"
          height="480"
          rx="32"
          ry="32"
          fill="rgba(255, 255, 255, 0.9)"
          stroke="rgba(0, 0, 0, 0.14)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Haptic Linear Resonator Cavity */}
        <rect
          x="200"
          y="1600"
          width="130"
          height="80"
          rx="12"
          ry="12"
          fill="rgba(0, 0, 0, 0.04)"
          stroke="rgba(0, 0, 0, 0.2)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <text
          x="265"
          y="1646"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="9"
          fontWeight="600"
          fill="rgba(0, 0, 0, 0.45)"
          textAnchor="middle"
          letterSpacing="1"
        >
          HAPTIC-ENGINE
        </text>

        {/* Acoustic Speaker Chamber Grille (Bottom Right) */}
        <g opacity="0.6">
          {Array.from({ length: 7 }, (_, i) => (
            <rect
              key={`spk-${i}`}
              x={670 + i * 22}
              y="1720"
              width="14"
              height="30"
              rx="7"
              ry="7"
              fill="rgba(0, 0, 0, 0.12)"
              stroke="rgba(0, 0, 0, 0.2)"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 3: UPPER-LEFT CAMERA MODULE & C-CHANNEL GLYPH
            ═══════════════════════════════════════════════════════════════ */}
        {/* Camera Pill Housing (Stadium shape) */}
        <rect
          x="190"
          y="170"
          width="170"
          height="340"
          rx="85"
          ry="85"
          fill="#FFFFFF"
          stroke="rgba(0, 0, 0, 0.28)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* Surrounding Camera Glyph C-Channel Contour */}
        <path
          d="M 370 185
             A 98 98 0 0 0 175 255
             V 425
             A 98 98 0 0 0 350 525"
          fill="none"
          stroke="rgba(255, 255, 255, 0.98)"
          strokeWidth="13"
          strokeLinecap="round"
          className={styles.glyphStrip}
        />
        <path
          d="M 370 185
             A 98 98 0 0 0 175 255
             V 425
             A 98 98 0 0 0 350 525"
          fill="none"
          stroke="rgba(0, 0, 0, 0.22)"
          strokeWidth="1.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Lens 1: Upper 50MP Main Camera (OIS) */}
        <g id="camera-main">
          {/* Outer Metal Bezel */}
          <circle
            cx="275"
            cy="255"
            r="60"
            fill="#FFFFFF"
            stroke="rgba(0, 0, 0, 0.3)"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
          {/* Stepped Sensor Ring */}
          <circle
            cx="275"
            cy="255"
            r="50"
            fill="rgba(0, 0, 0, 0.05)"
            stroke="rgba(0, 0, 0, 0.25)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {/* Aperture Inner Barrel */}
          <circle
            cx="275"
            cy="255"
            r="38"
            fill="#18181C"
            stroke="rgba(0, 0, 0, 0.45)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {/* Optical Glass Lens Core */}
          <circle cx="275" cy="255" r="24" fill="#0A0A0E" />
          {/* Optical Reflection Arc */}
          <path
            d="M 260 240 A 18 18 0 0 1 290 240"
            stroke="url(#lens-reflex)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Micro Aperture Tick Marks */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 275 + Math.cos(angle) * 44;
            const y1 = 255 + Math.sin(angle) * 44;
            const x2 = 275 + Math.cos(angle) * 48;
            const y2 = 255 + Math.sin(angle) * 48;
            return (
              <line
                key={`main-tick-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(0, 0, 0, 0.25)"
                strokeWidth="0.8"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>

        {/* Lens 2: Lower 50MP Ultra-Wide Camera */}
        <g id="camera-ultrawide">
          <circle
            cx="275"
            cy="425"
            r="60"
            fill="#FFFFFF"
            stroke="rgba(0, 0, 0, 0.3)"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="275"
            cy="425"
            r="50"
            fill="rgba(0, 0, 0, 0.05)"
            stroke="rgba(0, 0, 0, 0.25)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="275"
            cy="425"
            r="38"
            fill="#18181C"
            stroke="rgba(0, 0, 0, 0.45)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="275" cy="425" r="24" fill="#0A0A0E" />
          <path
            d="M 260 410 A 18 18 0 0 1 290 410"
            stroke="url(#lens-reflex)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* Dual-Tone LED Flash Capsule & Mic */}
        <rect
          x="385"
          y="205"
          width="34"
          height="62"
          rx="17"
          ry="17"
          fill="#FFFFFF"
          stroke="rgba(0, 0, 0, 0.22)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        {/* Warm & Cool Flash Emitters */}
        <circle cx="402" cy="222" r="7" fill="#F8E5BA" stroke="rgba(0, 0, 0, 0.15)" />
        <circle cx="402" cy="250" r="7" fill="#EAF3FF" stroke="rgba(0, 0, 0, 0.15)" />
        {/* Rear Audio Mic Pinhole */}
        <circle cx="402" cy="285" r="3.5" fill="#1A1A1E" />
        <circle
          cx="402"
          cy="285"
          r="6"
          fill="none"
          stroke="rgba(0, 0, 0, 0.2)"
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
        />

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 4: UPPER-RIGHT DIAGNOSTICS & SURGICAL RED TALLY
            ═══════════════════════════════════════════════════════════════ */}
        {/* 45° Diagonal Ribbon Bed */}
        <path
          d="M 500 160
             L 760 420
             L 720 460
             L 460 200
             Z"
          fill="rgba(255, 255, 255, 0.9)"
          stroke="rgba(0, 0, 0, 0.14)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />

        {/* 4 Parallel 45° Copper Bus Traces */}
        {[-12, -4, 4, 12].map((offset, idx) => (
          <line
            key={`diag-trace-${idx}`}
            x1={480 + offset}
            y1={180 - offset}
            x2={740 + offset}
            y2={440 - offset}
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* 45° Diagonal Glyph Light Slash */}
        <line
          x1="620"
          y1="190"
          x2="780"
          y2="350"
          stroke="rgba(255, 255, 255, 0.98)"
          strokeWidth="12"
          strokeLinecap="round"
          className={styles.glyphStrip}
        />
        <line
          x1="620"
          y1="190"
          x2="780"
          y2="350"
          stroke="rgba(0, 0, 0, 0.2)"
          strokeWidth="1.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Diagnostics Module Housing Plate */}
        <rect
          x="630"
          y="280"
          width="135"
          height="80"
          rx="10"
          ry="10"
          fill="#FFFFFF"
          stroke="rgba(0, 0, 0, 0.22)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />

        {/* GLOWING SURGICAL RED TALLY INDICATOR */}
        <g id="surgical-red-tally">
          <circle
            cx="665"
            cy="320"
            r="16"
            fill="rgba(215, 25, 33, 0.08)"
            stroke="rgba(215, 25, 33, 0.35)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="665"
            cy="320"
            r="11"
            fill="#FFFFFF"
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {/* Active Red Core with Ambient Glow */}
          <circle
            cx="665"
            cy="320"
            r="6.5"
            fill="#D71921"
            className={styles.redTallyDot}
            filter="url(#tally-glow)"
          />
        </g>

        {/* Tally & Diagnostics Silkscreen Text */}
        <text
          x="690"
          y="314"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="8.5"
          fontWeight="700"
          fill="#0A0A0C"
          letterSpacing="0.8"
        >
          REC TALLY
        </text>
        <text
          x="690"
          y="327"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="7.5"
          fontWeight="600"
          fill="#D71921"
          letterSpacing="0.6"
        >
          ACTIVE // NT-01
        </text>
        <text
          x="642"
          y="350"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="7"
          fill="#5A5A62"
          letterSpacing="0.5"
        >
          INPUT: 11V=4.1A (45W MAX)
        </text>

        {/* Miniature Barcode Representation */}
        <g opacity="0.45">
          {[0, 3, 7, 12, 14, 18, 22, 25, 30, 34, 38, 41, 45].map((pos, i) => (
            <line
              key={`barcode-${i}`}
              x1={715 + pos}
              y1={290}
              x2={715 + pos}
              y2={302}
              stroke="#0A0A0C"
              strokeWidth={i % 3 === 0 ? 1.8 : 0.9}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 5: CENTRAL WIRELESS CHARGING COIL & GLYPH RING
            ═══════════════════════════════════════════════════════════════ */}
        {/* Coil Substrate Disc */}
        <circle
          cx="500"
          cy="1000"
          r="275"
          fill="rgba(255, 255, 255, 0.92)"
          stroke="rgba(0, 0, 0, 0.16)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Concentric Etched Copper Coil Rings (18 Rings, non-scaling stroke) */}
        <g id="wireless-coil-grooves">
          {coilRings.map((radius, idx) => (
            <circle
              key={`coil-ring-${idx}`}
              cx="500"
              cy="1000"
              r={radius}
              fill="none"
              stroke={idx % 4 === 0 ? 'rgba(0, 0, 0, 0.26)' : 'rgba(0, 0, 0, 0.15)'}
              strokeWidth={idx % 4 === 0 ? '1.2' : '0.9'}
              strokeDasharray={idx % 3 === 0 ? '28, 4' : undefined}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* Surrounding Segmented Central Glyph Halo (Phone 2 multi-segment design) */}
        <g id="central-glyph-ring" className={styles.glyphStrip}>
          {/* Segment 1: Upper-Right Arc */}
          <path
            d="M 540 715 A 288 288 0 0 1 785 960"
            fill="none"
            stroke="rgba(255, 255, 255, 0.98)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 540 715 A 288 288 0 0 1 785 960"
            fill="none"
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="1.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Segment 2: Lower-Right Arc */}
          <path
            d="M 785 1040 A 288 288 0 0 1 540 1285"
            fill="none"
            stroke="rgba(255, 255, 255, 0.98)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 785 1040 A 288 288 0 0 1 540 1285"
            fill="none"
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="1.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Segment 3: Lower-Left Arc */}
          <path
            d="M 460 1285 A 288 288 0 0 1 215 1040"
            fill="none"
            stroke="rgba(255, 255, 255, 0.98)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 460 1285 A 288 288 0 0 1 215 1040"
            fill="none"
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="1.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Segment 4: Upper-Left Arc */}
          <path
            d="M 215 960 A 288 288 0 0 1 460 715"
            fill="none"
            stroke="rgba(255, 255, 255, 0.98)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 215 960 A 288 288 0 0 1 460 715"
            fill="none"
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="1.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Coil Inner Aperture Void with 45° Angular Breakout Notch */}
        <path
          d="M 500 915
             A 85 85 0 0 0 440 940
             A 85 85 0 1 0 560 940
             L 590 910
             L 570 890
             L 540 920
             A 85 85 0 0 0 500 915
             Z"
          fill="#FFFFFF"
          stroke="rgba(0, 0, 0, 0.25)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Coil Lead Termination Contacts (Gold/Copper pads) */}
        <rect
          x="575"
          y="895"
          width="12"
          height="18"
          rx="2"
          transform="rotate(45 575 895)"
          fill="#D89D42"
          stroke="rgba(0, 0, 0, 0.3)"
          strokeWidth="0.8"
        />
        <rect
          x="590"
          y="910"
          width="12"
          height="18"
          rx="2"
          transform="rotate(45 590 910)"
          fill="#D89D42"
          stroke="rgba(0, 0, 0, 0.3)"
          strokeWidth="0.8"
        />

        {/* Central Qi Inductive Core Annotation */}
        <text
          x="500"
          y="996"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="9.5"
          fontWeight="700"
          fill="#0A0A0C"
          textAnchor="middle"
          letterSpacing="1"
        >
          15W QI INDUCTIVE COIL
        </text>
        <text
          x="500"
          y="1010"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="8"
          fontWeight="600"
          fill="#5A5A62"
          textAnchor="middle"
          letterSpacing="0.8"
        >
          5W REVERSE WIRELESS TX
        </text>
        <text
          x="500"
          y="1022"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="7.5"
          fill="#767680"
          textAnchor="middle"
          letterSpacing="0.6"
        >
          L: 0.38mH // 110-205kHz
        </text>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 6: COMPONENT RIBBON TRACES (VIGNELLI 0° / 90° / 45°)
            ═══════════════════════════════════════════════════════════════ */}
        {/* Bus Trace Set 1: Main Power FPC from Battery to Logic Board */}
        <g id="ribbon-bus-main">
          {[-6, -2, 2, 6].map((offset, idx) => (
            <path
              key={`bus1-${idx}`}
              d={`M ${300 + offset} 720
                  V 640
                  L ${360 + offset} 580
                  H ${560 + offset}
                  V 470`}
              fill="none"
              stroke="rgba(0, 0, 0, 0.22)"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* FPC Connector Header at Motherboard Junction */}
          <rect
            x="545"
            y="450"
            width="32"
            height="22"
            rx="3"
            fill="#FFFFFF"
            stroke="rgba(0, 0, 0, 0.32)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
          {Array.from({ length: 6 }, (_, i) => (
            <line
              key={`pin-${i}`}
              x1={549 + i * 5}
              y1="454"
              x2={549 + i * 5}
              y2="468"
              stroke="#2A2A30"
              strokeWidth="1.4"
            />
          ))}
          <text
            x="590"
            y="464"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fontWeight="600"
            fill="#5A5A62"
            letterSpacing="0.6"
          >
            FPC-CONN-01
          </text>
        </g>

        {/* Bus Trace Set 2: Right Perimeter Sensor Bus */}
        <g id="ribbon-bus-sensors">
          <path
            d="M 760 420
               V 620
               L 820 680
               V 1350
               L 760 1410
               H 680"
            fill="none"
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 768 428
               V 624
               L 828 684
               V 1346
               L 768 1406
               H 680"
            fill="none"
            stroke="rgba(0, 0, 0, 0.16)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* SMT Via Arrays & Test Points */}
        <g id="test-points">
          <use href="#smt-via" x="330" y="550" />
          <use href="#smt-via" x="345" y="550" />
          <use href="#smt-via" x="360" y="550" />
          <text
            x="320"
            y="540"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="6.5"
            fill="#5A5A62"
          >
            TP_VCC
          </text>

          <use href="#smt-via" x="720" y="560" />
          <use href="#smt-via" x="735" y="560" />
          <text
            x="715"
            y="550"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="6.5"
            fill="#5A5A62"
          >
            TP_GND
          </text>

          <use href="#smt-via" x="480" y="1320" />
          <use href="#smt-via" x="520" y="1320" />
        </g>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 7: LOWER EXCLAMATION MARK (`!`) & CHARGING GAUGE
            ═══════════════════════════════════════════════════════════════ */}
        {/* Vertical Linear Bar Stadium Channel */}
        <g id="exclamation-bar">
          <rect
            x="486"
            y="1380"
            width="28"
            height="230"
            rx="14"
            ry="14"
            fill="rgba(255, 255, 255, 0.96)"
            stroke="rgba(0, 0, 0, 0.24)"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />

          {/* Glowing White Inner Diffuser Core */}
          <rect
            x="492"
            y="1386"
            width="16"
            height="218"
            rx="8"
            ry="8"
            fill="#FFFFFF"
            className={styles.glyphStrip}
          />

          {/* Battery / Charging Level Gauge Hash Marks */}
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={`gauge-hash-${i}`}
              x1="490"
              y1={1405 + i * 22}
              x2="510"
              y2={1405 + i * 22}
              stroke="rgba(0, 0, 0, 0.22)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Gauge Telemetry Silkscreen Labels */}
          <text
            x="524"
            y="1408"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fontWeight="600"
            fill="#5A5A62"
          >
            [ 0% ]
          </text>
          <text
            x="524"
            y="1496"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fontWeight="600"
            fill="#5A5A62"
          >
            [ 50% ]
          </text>
          <text
            x="524"
            y="1584"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fontWeight="600"
            fill="#D71921"
          >
            [ 100% ]
          </text>
        </g>

        {/* Circular Anchor Dot of the Exclamation Mark */}
        <g id="exclamation-dot">
          <circle
            cx="500"
            cy="1660"
            r="22"
            fill="rgba(255, 255, 255, 0.96)"
            stroke="rgba(0, 0, 0, 0.24)"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="500"
            cy="1660"
            r="14"
            fill="#FFFFFF"
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="1"
            className={styles.glyphStrip}
          />
          <circle cx="500" cy="1660" r="6" fill="rgba(0, 0, 0, 0.1)" />

          {/* Ground Trace extending down to USB-C sub-board */}
          <line
            x1="500"
            y1="1682"
            x2="500"
            y2="1830"
            stroke="rgba(0, 0, 0, 0.22)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* USB-C Connector Port Grounding Bracket */}
        <rect
          x="440"
          y="1830"
          width="120"
          height="50"
          rx="10"
          ry="10"
          fill="#FFFFFF"
          stroke="rgba(0, 0, 0, 0.26)"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
        <rect
          x="465"
          y="1845"
          width="70"
          height="20"
          rx="6"
          ry="6"
          fill="rgba(0, 0, 0, 0.08)"
          stroke="rgba(0, 0, 0, 0.3)"
          strokeWidth="1"
        />
        <text
          x="500"
          y="1859"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="7.5"
          fontWeight="600"
          fill="#2A2A30"
          textAnchor="middle"
          letterSpacing="0.8"
        >
          USB-C // 45W PPS
        </text>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 8: 16-POINT TORX FASTENER GRID
            ═══════════════════════════════════════════════════════════════ */}
        <g id="torx-fastener-grid">
          {torxScrews.map((pos, idx) => (
            <use
              key={`torx-${idx}`}
              href="#torx-screw"
              x={pos.x}
              y={pos.y}
            />
          ))}
        </g>

        {/* ═══════════════════════════════════════════════════════════════
            LAYER 9: AUTHENTIC SILKSCREEN INDUSTRIAL MARKINGS
            ═══════════════════════════════════════════════════════════════ */}
        <g id="silkscreen-branding" opacity="0.65">
          {/* Top Brand Tag */}
          <text
            x="500"
            y="155"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="8.5"
            fontWeight="700"
            fill="#0A0A0C"
            textAnchor="middle"
            letterSpacing="1.2"
          >
            NOTHING (R) TECHNOLOGY LIMITED
          </text>
          <text
            x="500"
            y="170"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fill="#5A5A62"
            textAnchor="middle"
            letterSpacing="0.8"
          >
            MODEL: A065 // DESIGNED IN LONDON
          </text>

          {/* Battery Specification Text (Battery Shield) */}
          <text
            x="180"
            y="760"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="8"
            fontWeight="700"
            fill="#0A0A0C"
            letterSpacing="0.8"
          >
            LI-ION RECHARGEABLE CELL
          </text>
          <text
            x="180"
            y="774"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7.5"
            fill="#5A5A62"
            letterSpacing="0.5"
          >
            CAPACITY: 4700mAh / 18.2Wh
          </text>
          <text
            x="180"
            y="788"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fill="#767680"
            letterSpacing="0.5"
          >
            NOMINAL: 3.87V == CHARGE: 4.45V
          </text>

          {/* Bottom Compliance Markings */}
          <text
            x="760"
            y="1630"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="8.5"
            fontWeight="700"
            fill="#0A0A0C"
            letterSpacing="1"
          >
            CE 0700
          </text>
          <text
            x="760"
            y="1644"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fill="#5A5A62"
            letterSpacing="0.6"
          >
            IP54 WATER RESISTANT
          </text>
        </g>
      </svg>
    </div>
  );
}
