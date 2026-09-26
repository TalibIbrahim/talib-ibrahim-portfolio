/* eslint-disable react-hooks/set-state-in-effect */
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
import type { PortfolioMode, ModeContextType } from '@/data/types';

export type { PortfolioMode, ModeContextType };

const ModeContext = createContext<ModeContextType | null>(null);

const STORAGE_KEY = 'portfolio_mode';
const TRANSITION_DURATION_MS = 1200;
const TRANSITION_MIDPOINT_MS = 600;

export interface ModeProviderProps {
  readonly children: ReactNode;
  readonly defaultMode?: PortfolioMode;
}

/**
 * Provider managing "Hyper Mode" (full WebGL/motion) vs "Boring / Recruiter Mode" (minimal text mode).
 * Handles hydration-safe preference loading, CRT transition timing, and global keyboard shortcuts.
 */
export function ModeProvider({
  children,
  defaultMode = 'hyper',
}: ModeProviderProps) {
  const [mode, setModeState] = useState<PortfolioMode>(defaultMode);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const midpointTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTransitioningRef = useRef<boolean>(false);

  // Hydration-safe client-side initialization
  useEffect(() => {
    let resolvedMode: PortfolioMode = defaultMode;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'hyper' || stored === 'boring') {
        resolvedMode = stored;
      } else if (
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        resolvedMode = 'boring';
      }
    } catch {
      // In private browsing or restricted environments, fallback to default
    }

    setModeState(resolvedMode);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-portfolio-mode', resolvedMode);
    }
  }, [defaultMode]);

  const clearTimers = useCallback(() => {
    if (midpointTimerRef.current) {
      clearTimeout(midpointTimerRef.current);
      midpointTimerRef.current = null;
    }
    if (endTimerRef.current) {
      clearTimeout(endTimerRef.current);
      endTimerRef.current = null;
    }
    isTransitioningRef.current = false;
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const setMode = useCallback(
    (newMode: PortfolioMode) => {
      clearTimers();
      setIsTransitioning(false);
      isTransitioningRef.current = false;

      setModeState(newMode);
      try {
        localStorage.setItem(STORAGE_KEY, newMode);
      } catch {
        // Storage access may fail silently in sandboxed iframes/private tabs
      }
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-portfolio-mode', newMode);
      }
    },
    [clearTimers]
  );

  const toggleMode = useCallback(() => {
    if (isTransitioningRef.current) {
      return;
    }

    setIsTransitioning(true);
    isTransitioningRef.current = true;

    // Midpoint at 600ms: swap mode and persist to localStorage
    midpointTimerRef.current = setTimeout(() => {
      setModeState((prev) => {
        const next: PortfolioMode = prev === 'hyper' ? 'boring' : 'hyper';
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // Ignore storage write failure
        }
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-mode', next);
        }
        return next;
      });
    }, TRANSITION_MIDPOINT_MS);

    // End at 1200ms: reset transition state
    endTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
      isTransitioningRef.current = false;
    }, TRANSITION_DURATION_MS);
  }, []);

  // Global keyboard listener: KeyB toggles mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing inside form inputs, text areas, or editable elements
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Ignore when modifier keys (Ctrl, Cmd, Alt) are held
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      if (event.code === 'KeyB') {
        event.preventDefault();
        toggleMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleMode]);

  const value = useMemo<ModeContextType>(
    () => ({
      mode,
      isTransitioning,
      toggleMode,
      setMode,
    }),
    [mode, isTransitioning, toggleMode, setMode]
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

/**
 * Access the current portfolio mode context.
 * Throws an error if invoked outside of ModeProvider.
 */
export function useMode(): ModeContextType {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within ModeProvider');
  }
  return context;
}
