import type { IntensityStage, IntensityStageConfig } from './types';

export const INTENSITY_STORAGE_KEY = 'portfolio_intensity';
export const INTENSITY_TRANSITION_DURATION_MS = 400;
export const DEFAULT_INTENSITY_STAGE: IntensityStage = 4;

/**
 * Metadata and copy definitions for each Intensity Slider stage.
 * Defines the progression from brutalist minimalist text to maximum WebGL immersion.
 */
export const STAGE_CONFIGS: Readonly<Record<IntensityStage, IntensityStageConfig>> = {
  1: {
    stage: 1,
    label: '01 // BLUNT',
    shortName: 'Blunt',
    description: 'Single honest line. No animation. Zero fluff.',
  },
  2: {
    stage: 2,
    label: '02 // PRAGMATIC',
    shortName: 'Pragmatic',
    description: 'Fact-first engineering record & selected works.',
  },
  3: {
    stage: 3,
    label: '03 // ARCHITECT',
    shortName: 'Architect',
    description: 'Systems radar, technical telemetry, full architecture.',
  },
  4: {
    stage: 4,
    label: '04 // FULL-SEND',
    shortName: 'Full-Send',
    description: 'WebGL liquid shaders, scroll choreography, maximum personality.',
  },
} as const;
