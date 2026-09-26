'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { HyperspeedOptions } from '@/components/react-bits/hyperspeed/Hyperspeed';
import styles from './MSportBackground.module.css';

// Client-only dynamic import to ensure zero SSR hydration issues with ThreeJS/WebGL
const Hyperspeed = dynamic(
  () => import('@/components/react-bits/hyperspeed/Hyperspeed'),
  { ssr: false }
);

/**
 * Official BMW M Sport Motorsport Palette & High-Velocity Tuning Configuration
 * - Light Blue: 0x008ac9
 * - Dark Violet: 0x2b115a
 * - BMW M Red / Red-Orange: 0xf11a22, 0xe0001b, 0xff2233
 */
const mSportOptions: Partial<HyperspeedOptions> = {
  distortion: 'turbulentDistortion',
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [80, 120],
  movingCloserSpeed: [-120, -180],
  carLightsLength: [400 * 0.05, 400 * 0.25],
  carLightsRadius: [0.06, 0.16],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0x07080a,
    islandColor: 0x090b10,
    background: 0x050608,
    shoulderLines: 0x151a24,
    brokenLines: 0x2b115a,
    leftCars: [0x008ac9, 0x0066b1, 0x2b115a],
    rightCars: [0xf11a22, 0xe0001b, 0xff2233],
    sticks: 0x008ac9
  }
};

export interface MSportBackgroundProps {
  className?: string;
  effectOptions?: Partial<HyperspeedOptions>;
}

export default function MSportBackground({ className, effectOptions }: MSportBackgroundProps) {
  const mergedOptions = useMemo(() => {
    if (!effectOptions) return mSportOptions;
    return {
      ...mSportOptions,
      ...effectOptions,
      colors: {
        ...mSportOptions.colors!,
        ...(effectOptions.colors || {})
      }
    };
  }, [effectOptions]);

  return (
    <div
      className={`${styles.backgroundContainer} ${className || ''}`}
      aria-hidden="true"
    >
      <div className={styles.canvasLayer}>
        <Hyperspeed effectOptions={mergedOptions} />
      </div>
      <div className={styles.vignetteOverlay} />
      <div className={styles.speedScanline} />
    </div>
  );
}
