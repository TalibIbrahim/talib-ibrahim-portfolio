'use client';

import React from 'react';
import { useMode } from '@/context/ModeContext';
import { useIntensity } from '@/hooks/useIntensity';
import type { IntensityStage } from '@/data/types';
import AmbientBackground from './AmbientBackground';
import ScrollLine from './ScrollLine';

export interface HyperBackgroundEffectsProps {
  readonly stage?: IntensityStage;
}

/**
 * HyperBackgroundEffects conditionally mounts high-performance WebGL ambient noise
 * and the kinetic SVG scroll scrub line based on Portfolio Mode and Intensity Stage.
 * When in Boring mode, unmounts all 3D canvas and scroll scrub instances.
 * WebGL only runs at stages 3 & 4 (Architect and Full-Send) for maximum performance and focus.
 */
export default function HyperBackgroundEffects({ stage: propStage }: HyperBackgroundEffectsProps) {
  const { mode } = useMode();
  const { stage: contextStage } = useIntensity();
  const activeStage = propStage ?? contextStage;

  if (mode === 'boring') {
    return null;
  }

  // WebGL liquid ambient shaders run strictly at Stages 3 & 4
  const enableWebGL = activeStage >= 3;

  return (
    <>
      {enableWebGL && <AmbientBackground />}
      <div className="grain" aria-hidden="true" />
      {activeStage >= 3 && <ScrollLine />}
    </>
  );
}
