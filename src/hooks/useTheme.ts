'use client';

import { useColorMode } from './useColorMode';
import type { ColorMode } from '@/data/types';

/**
 * Backward-compatible hook for minimal theme toggle in existing components (e.g. Navbar.tsx).
 * Delegates state and DOM mutations directly to the universal useColorMode hook.
 *
 * @returns {{ theme: ColorMode, toggleTheme: () => void, setTheme: (mode: ColorMode) => void }}
 */
export function useTheme(): {
  readonly theme: ColorMode;
  readonly toggleTheme: () => void;
  readonly setTheme: (mode: ColorMode) => void;
} {
  const { mode, toggleMode, setMode } = useColorMode();

  return {
    theme: mode,
    toggleTheme: toggleMode,
    setTheme: setMode,
  };
}
