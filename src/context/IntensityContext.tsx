'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
} from 'react';
import type {
  IntensityStage,
  IntensityStageConfig,
  IntensityContextType,
} from '@/data/types';
import {
  STAGE_CONFIGS,
  INTENSITY_STORAGE_KEY,
  INTENSITY_TRANSITION_DURATION_MS,
  DEFAULT_INTENSITY_STAGE,
} from '@/data/intensity';

export type { IntensityStage, IntensityStageConfig, IntensityContextType };
export { STAGE_CONFIGS };

const IntensityContext = createContext<IntensityContextType | null>(null);

export interface IntensityProviderProps {
  readonly children: ReactNode;
  readonly defaultStage?: IntensityStage;
}

/**
 * Type guard verifying if a value matches a valid IntensityStage (1 | 2 | 3 | 4).
 */
function isValidIntensityStage(val: unknown): val is IntensityStage {
  return val === 1 || val === 2 || val === 3 || val === 4;
}

/**
 * Provider managing the 4-stage Intensity Slider (Blunt -> Pragmatic -> Architect -> Full-Send).
 * Handles hydration-safe client preference loading, 400ms transition state for Framer Motion,
 * and global keyboard snap shortcuts (1, 2, 3, 4).
 */
export function IntensityProvider({
  children,
  defaultStage = DEFAULT_INTENSITY_STAGE,
}: IntensityProviderProps) {
  const [stage, setStageState] = useState<IntensityStage>(defaultStage);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydration-safe client-side initialization from localStorage
  useEffect(() => {
    let resolvedStage: IntensityStage = defaultStage;

    try {
      const stored = localStorage.getItem(INTENSITY_STORAGE_KEY);
      if (stored !== null) {
        const parsed = Number(stored);
        if (isValidIntensityStage(parsed)) {
          resolvedStage = parsed;
        }
      }
    } catch {
      // In private browsing or sandboxed environments, fallback to defaultStage
    }

    queueMicrotask(() => {
      setStageState(resolvedStage);
    });
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-intensity', String(resolvedStage));
    }
  }, [defaultStage]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, []);

  const setStage = useCallback((newStage: IntensityStage) => {
    // Clear any ongoing transition timer
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }

    // Set transition active to trigger exit/enter animations
    setIsTransitioning(true);
    setStageState(newStage);

    try {
      localStorage.setItem(INTENSITY_STORAGE_KEY, String(newStage));
    } catch {
      // Storage access may fail silently in sandboxed/restricted environments
    }

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-intensity', String(newStage));
    }

    // Reset transition state after 400ms duration
    transitionTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
      transitionTimerRef.current = null;
    }, INTENSITY_TRANSITION_DURATION_MS);
  }, []);

  // Global keyboard shortcuts: Keys '1', '2', '3', '4' snap directly to stage
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing inside form inputs, textareas, selects, or editable elements
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable ||
          Boolean(target.closest?.('input, textarea, select, [contenteditable="true"]')))
      ) {
        return;
      }

      // Ignore when modifier keys (Ctrl, Cmd, Alt) are pressed
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      let targetStage: IntensityStage | null = null;
      if (event.key === '1') {
        targetStage = 1;
      } else if (event.key === '2') {
        targetStage = 2;
      } else if (event.key === '3') {
        targetStage = 3;
      } else if (event.key === '4') {
        targetStage = 4;
      }

      if (targetStage !== null) {
        event.preventDefault();
        setStage(targetStage);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setStage]);

  const value = useMemo<IntensityContextType>(
    () => ({
      stage,
      setStage,
      isTransitioning,
      stageConfigs: STAGE_CONFIGS,
    }),
    [stage, setStage, isTransitioning]
  );

  return (
    <IntensityContext.Provider value={value}>
      {children}
    </IntensityContext.Provider>
  );
}

/**
 * Access the Intensity Slider state, transition indicator, and stage controls.
 * Throws a descriptive runtime error if invoked outside of IntensityProvider.
 */
export function useIntensity(): IntensityContextType {
  const context = useContext(IntensityContext);
  if (!context) {
    throw new Error('useIntensity must be used within IntensityProvider');
  }
  return context;
}
