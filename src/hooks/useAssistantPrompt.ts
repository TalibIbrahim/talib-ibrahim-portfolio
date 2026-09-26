'use client';

import { useState, useCallback, useMemo, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import type { UseAssistantPromptReturn } from '@/data/types';

export type { UseAssistantPromptReturn };

export const ASSISTANT_DISMISSED_STORAGE_KEY = 'portfolio_assistant_dismissed';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getDismissedSnapshot(): boolean {
  try {
    return sessionStorage.getItem(ASSISTANT_DISMISSED_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

const emptySubscribe = () => () => {};

/**
 * Hook managing the visibility, dismissal state, and route context of the Assistant Prompt.
 *
 * Persists dismissal state across the user's browser session via sessionStorage.
 * Automatically suppresses visibility on recruiter / boring routes and during initial SSR hydration.
 *
 * @returns {UseAssistantPromptReturn} An object containing:
 * - `isVisible`: Boolean indicating if the assistant prompt should be displayed.
 * - `dismiss`: Function to dismiss the prompt for the current session.
 * - `isRecruiterPage`: Boolean indicating if the active route is /recruiter or /boring.
 */
export function useAssistantPrompt(): UseAssistantPromptReturn {
  const pathname = usePathname();
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isDismissedStored = useSyncExternalStore(subscribe, getDismissedSnapshot, getServerSnapshot);
  const [localDismissed, setLocalDismissed] = useState<boolean>(false);

  const dismiss = useCallback(() => {
    setLocalDismissed(true);
    try {
      sessionStorage.setItem(ASSISTANT_DISMISSED_STORAGE_KEY, 'true');
      window.dispatchEvent(new Event('storage'));
    } catch {
      // Ignore sessionStorage write errors
    }
  }, []);

  const isRecruiterPage = useMemo<boolean>(() => {
    if (!pathname) return false;
    return (
      pathname.startsWith('/recruiter') ||
      pathname.startsWith('/boring')
    );
  }, [pathname]);

  const isVisible = isClient && !isDismissedStored && !localDismissed && !isRecruiterPage;

  return {
    isVisible,
    dismiss,
    isRecruiterPage,
  };
}
