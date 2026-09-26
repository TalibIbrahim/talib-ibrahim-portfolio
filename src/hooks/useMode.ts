'use client';

/**
 * Hook for consuming Portfolio Mode context (Hyper vs Boring mode).
 * Re-exports useMode from ModeContext for hook directory consistency.
 */
export { useMode, type PortfolioMode, type ModeContextType } from '@/context/ModeContext';
