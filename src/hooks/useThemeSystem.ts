'use client';

/**
 * Hook for consuming Multi-Theme System context.
 * Re-exports useThemeSystem from ThemeSystemContext for hook directory consistency.
 */
export {
  useThemeSystem,
  type VisualTheme,
  type ColorMode,
  type ThemeMeta,
  type ThemeSystemContextType,
  THEME_REGISTRY,
} from '@/context/ThemeSystemContext';
