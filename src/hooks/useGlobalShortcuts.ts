'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { playClickChime } from '@/utils/audioSynth';

/**
 * Global keyboard shortcuts hook for portfolio navigation.
 *
 * Listens for 'B' or 'R' key presses to instantly navigate to the /recruiter dossier view.
 * Guards against execution when typing into form elements, modifier key presses,
 * or when the user is already on the recruiter page.
 */
export function useGlobalShortcuts(): void {
  const router = useRouter();
  const pathname = usePathname();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 1. Guard against typing inside form controls or editable elements
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

      // 2. Ignore when modifier keys (Ctrl, Cmd, Alt) are pressed
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      // 3. Match 'B' or 'R' keys
      const key = event.key.toLowerCase();
      const code = event.code;
      if (key === 'b' || key === 'r' || code === 'KeyB' || code === 'KeyR') {
        event.preventDefault();

        // Tactile sound effect feedback
        try {
          playClickChime();
        } catch {
          // Audio context might be restricted before user gesture
        }

        // Navigate to /recruiter if not already on it
        if (pathname !== '/recruiter' && pathname !== '/boring') {
          router.push('/recruiter');
        }
      }
    },
    [router, pathname]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
