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

export type VisualTheme = 'neon' | 'msport' | 'nothing';
export type ColorMode = 'dark' | 'light';

export interface ThemeMeta {
  readonly id: VisualTheme;
  readonly name: string;
  readonly subtitle: string;
  readonly primaryAccent: string;
  readonly darkBg: string;
  readonly lightBg: string;
}

export const THEME_REGISTRY: Record<VisualTheme, ThemeMeta> = {
  neon: {
    id: 'neon',
    name: 'Neon',
    subtitle: 'Cyber-Luxe Tech',
    primaryAccent: '#ccff00',
    darkBg: '#0d0d0f',
    lightBg: '#f6f8fa',
  },
  msport: {
    id: 'msport',
    name: 'M Sport',
    subtitle: 'High Velocity Motorsport',
    primaryAccent: '#81C4FF',
    darkBg: '#0a0b0e',
    lightBg: '#f4f6fa',
  },
  nothing: {
    id: 'nothing',
    name: 'Nothing',
    subtitle: 'Clinical Dot-Matrix',
    primaryAccent: '#D71921',
    darkBg: '#000000',
    lightBg: '#ffffff',
  },
};

export interface ThemeSystemContextType {
  readonly theme: VisualTheme;
  readonly mode: ColorMode;
  readonly setTheme: (theme: VisualTheme) => void;
  readonly setMode: (mode: ColorMode) => void;
  readonly toggleMode: () => void;
  readonly isThemeTransitioning: boolean;
  readonly themeVariant: string;
}

const ThemeSystemContext = createContext<ThemeSystemContextType | null>(null);

const STORAGE_THEME_KEY = 'portfolio_visual_theme';
const STORAGE_MODE_KEY = 'portfolio_color_mode';
const THEME_TRANSITION_MS = 450;

import { usePathname } from 'next/navigation';

export interface ThemeSystemProviderProps {
  readonly children: ReactNode;
  readonly defaultTheme?: VisualTheme;
  readonly defaultMode?: ColorMode;
}

/**
 * Multi-Theme System Provider.
 * Supports 3 distinctive design systems (Neon, M Sport, Nothing) with Dark and Light variants (6 combinations).
 */
export function ThemeSystemProvider({
  children,
  defaultTheme = 'neon',
  defaultMode = 'dark',
}: ThemeSystemProviderProps) {
  const pathname = usePathname();
  const [theme, setThemeState] = useState<VisualTheme>(defaultTheme);
  const [mode, setModeState] = useState<ColorMode>(defaultMode);
  const [isThemeTransitioning, setIsThemeTransitioning] = useState<boolean>(false);

  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync DOM attributes with active theme and mode
  const applyDomAttributes = useCallback((t: VisualTheme, m: ColorMode) => {
    if (typeof document === 'undefined') return;
    if (
      pathname === '/' ||
      pathname === '/minimal' ||
      pathname?.startsWith('/apple') ||
      pathname?.startsWith('/recruiter') ||
      pathname?.startsWith('/boring')
    ) {
      return;
    }
    const root = document.documentElement;
    root.setAttribute('data-theme', t);
    root.setAttribute('data-mode', m);
    root.setAttribute('data-theme-variant', `${t}-${m}`);
  }, [pathname]);

  // Hydration-safe initial preference load
  useEffect(() => {
    if (
      pathname === '/' ||
      pathname === '/minimal' ||
      pathname?.startsWith('/apple') ||
      pathname?.startsWith('/recruiter') ||
      pathname?.startsWith('/boring')
    ) {
      return;
    }
    try {
      const storedTheme = localStorage.getItem(STORAGE_THEME_KEY) as VisualTheme | null;
      const storedMode = localStorage.getItem(STORAGE_MODE_KEY) as ColorMode | null;

      const resolvedTheme: VisualTheme =
        storedTheme === 'neon' || storedTheme === 'msport' || storedTheme === 'nothing'
          ? storedTheme
          : defaultTheme;

      const resolvedMode: ColorMode =
        storedMode === 'dark' || storedMode === 'light' ? storedMode : defaultMode;

      queueMicrotask(() => {
        setThemeState(resolvedTheme);
        setModeState(resolvedMode);
      });
      applyDomAttributes(resolvedTheme, resolvedMode);
    } catch {
      applyDomAttributes(defaultTheme, defaultMode);
    }
  }, [pathname, defaultTheme, defaultMode, applyDomAttributes]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const triggerTransition = useCallback(() => {
    setIsThemeTransitioning(true);
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    transitionTimerRef.current = setTimeout(() => {
      setIsThemeTransitioning(false);
    }, THEME_TRANSITION_MS);
  }, []);

  const setTheme = useCallback(
    (newTheme: VisualTheme) => {
      if (newTheme === theme) return;
      triggerTransition();
      setThemeState(newTheme);
      applyDomAttributes(newTheme, mode);
      try {
        localStorage.setItem(STORAGE_THEME_KEY, newTheme);
      } catch {
        // Ignore
      }
    },
    [theme, mode, triggerTransition, applyDomAttributes]
  );

  const setMode = useCallback(
    (newMode: ColorMode) => {
      if (newMode === mode) return;
      triggerTransition();
      setModeState(newMode);
      applyDomAttributes(theme, newMode);
      try {
        localStorage.setItem(STORAGE_MODE_KEY, newMode);
      } catch {
        // Ignore
      }
    },
    [theme, mode, triggerTransition, applyDomAttributes]
  );

  const toggleMode = useCallback(() => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
  }, [mode, setMode]);

  const value = useMemo<ThemeSystemContextType>(
    () => ({
      theme,
      mode,
      setTheme,
      setMode,
      toggleMode,
      isThemeTransitioning,
      themeVariant: `${theme}-${mode}`,
    }),
    [theme, mode, setTheme, setMode, toggleMode, isThemeTransitioning]
  );

  return (
    <ThemeSystemContext.Provider value={value}>
      {children}
    </ThemeSystemContext.Provider>
  );
}

/**
 * Access multi-theme system state.
 */
export function useThemeSystem(): ThemeSystemContextType {
  const context = useContext(ThemeSystemContext);
  if (!context) {
    throw new Error('useThemeSystem must be used within ThemeSystemProvider');
  }
  return context;
}
