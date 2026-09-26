'use client';

import { useSyncExternalStore, useCallback } from 'react';
import {
  getMuted,
  setMuted as setAudioMuted,
  toggleMute as toggleAudioMute,
  playHoverBeep,
  playClickChime,
  playModeSwitchSound,
  playOverdriveChime,
} from '@/utils/audioSynth';
import type { AudioSynthController } from '@/data/types';

export interface UseAudioReturn extends AudioSynthController {
  readonly isMuted: boolean;
}

/**
 * Subscribes external store listeners to audio mute changes and cross-tab storage events.
 */
function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener('portfolio:sound-change', onStoreChange);
  window.addEventListener('storage', onStoreChange);

  return () => {
    window.removeEventListener('portfolio:sound-change', onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

function getSnapshot(): boolean {
  return getMuted();
}

function getServerSnapshot(): boolean {
  return true; // Strict SSR default: muted
}

/**
 * Custom React hook for consuming and controlling the Web Audio synthesizer engine.
 * Employs React's useSyncExternalStore for hydration safety and zero-cascading-render reactivity.
 */
export function useAudio(): UseAudioReturn {
  const isMuted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleMute = useCallback((): boolean => {
    return toggleAudioMute();
  }, []);

  const setMuted = useCallback((muted: boolean): void => {
    setAudioMuted(muted);
  }, []);

  return {
    isMuted,
    toggleMute,
    getMuted,
    setMuted,
    playHoverBeep,
    playClickChime,
    playModeSwitchSound,
    playOverdriveChime,
  };
}
