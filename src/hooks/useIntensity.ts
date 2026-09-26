'use client';

/**
 * Custom hook for consuming the Intensity Slider context (Stage 1 Blunt through Stage 4 Full-Send).
 * Re-exports useIntensity and associated types from IntensityContext for consistent hook imports.
 */
export {
  useIntensity,
  type IntensityStage,
  type IntensityStageConfig,
  type IntensityContextType,
} from '@/context/IntensityContext';
