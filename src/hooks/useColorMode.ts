'use client';

import { useSyncExternalStore, useCallback, useEffect } from 'react';
import type { ColorMode, UseColorModeReturn } from '@/data/types';

export type { ColorMode, UseColorModeReturn };

export const COLOR_MODE_STORAGE_KEY = 'portfolio_color_mode';
export const APPLE_MODE_STORAGE_KEY = 'apple_mode_preference';
export const COLOR_MODE_EVENT = 'portfolio-color-mode-change';
const COMPAT_KEYS = ['portfolio-theme', 'apple_mode_preference'] as const;

let currentMode: ColorMode = 'dark';
let isClientInitialized = false;
const listeners = new Set<() => void>();

/**
 * Safely reads a value from localStorage with sessionStorage fallback.
 */
function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem(key);
    if (val !== null) return val;
  } catch {
    // LocalStorage restricted or disabled
  }
  try {
    const val = sessionStorage.getItem(key);
    if (val !== null) return val;
  } catch {
    // SessionStorage restricted or disabled
  }
  return null;
}

/**
 * Safely writes a value to both localStorage and sessionStorage.
 */
function safeSetItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // LocalStorage restricted or quota exceeded
  }
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // SessionStorage restricted or quota exceeded
  }
}

/**
 * Safely reads the user's stored color mode from localStorage or sessionStorage.
 * On '/apple' route, checks 'apple_mode_preference' with highest priority,
 * followed by primary 'portfolio_color_mode' and legacy compatibility keys.
 */
function readStoredMode(): ColorMode | null {
  if (typeof window === 'undefined') return null;
  try {
    const isApple = typeof window.location !== 'undefined' && window.location.pathname.startsWith('/apple');
    if (isApple) {
      const applePref = safeGetItem(APPLE_MODE_STORAGE_KEY);
      if (applePref === 'dark' || applePref === 'light') return applePref;
    }

    const primary = safeGetItem(COLOR_MODE_STORAGE_KEY);
    if (primary === 'dark' || primary === 'light') return primary;

    for (const key of COMPAT_KEYS) {
      const legacy = safeGetItem(key);
      if (legacy === 'dark' || legacy === 'light') return legacy;
    }
  } catch {
    // Restricted or private browsing mode
  }
  return null;
}

/**
 * Reads any existing data-mode attribute already applied to the document root.
 */
function readDomMode(): ColorMode | null {
  if (typeof document === 'undefined') return null;
  const attr = document.documentElement.getAttribute('data-mode');
  return attr === 'dark' || attr === 'light' ? attr : null;
}

/**
 * Inspects system prefers-color-scheme media query.
 */
function readSystemPreference(): ColorMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch {
    // Media query parsing failed or unsupported
  }
  return 'dark';
}

/**
 * Resolves the effective color mode using hierarchical fallbacks:
 * 1. Pre-existing DOM attribute (authoritatively set by layout.tsx inline head script or SSR)
 * 2. Stored user preference (checking route-specific keys like apple_mode_preference on /apple)
 * 3. Route context fallback: '/apple' defaults to 'light', other routes default to 'dark'
 * 4. System preference (prefers-color-scheme)
 * 5. Default fallback: 'dark'
 */
export function resolveColorMode(): ColorMode {
  // 1. Authoritative pre-existing DOM attribute
  const dom = readDomMode();
  if (dom) return dom;

  // 2. Stored user preference (checking apple_mode_preference first on /apple)
  const stored = readStoredMode();
  if (stored) return stored;

  // 3. Route context fallback: /apple defaults to 'light'
  if (typeof window !== 'undefined' && window.location?.pathname?.startsWith('/apple')) {
    return 'light';
  }

  // 4. System preference fallback
  return readSystemPreference();
}

/**
 * Synchronizes DOM attributes with the active color mode.
 * Updates:
 * - document.documentElement 'data-mode'
 * - document.documentElement 'data-theme-variant' (compound attribute: '{theme}-{mode}')
 */
function applyDomAttributes(mode: ColorMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (root.getAttribute('data-mode') !== mode) {
    root.setAttribute('data-mode', mode);
  }

  let currentTheme = root.getAttribute('data-theme');
  if (!currentTheme && typeof window !== 'undefined' && window.location?.pathname?.startsWith('/apple')) {
    currentTheme = 'apple';
    root.setAttribute('data-theme', 'apple');
  }

  if (currentTheme) {
    const expectedVariant = `${currentTheme}-${mode}`;
    if (root.getAttribute('data-theme-variant') !== expectedVariant) {
      root.setAttribute('data-theme-variant', expectedVariant);
    }
  }
}

/**
 * Emits a color mode change to the internal store, localStorage, sessionStorage, DOM, and event listeners.
 *
 * @param nextMode 'dark' | 'light'
 * @param persist Whether to write to localStorage/sessionStorage and dispatch custom event.
 */
function emitChange(nextMode: ColorMode, persist: boolean): void {
  if (currentMode === nextMode && isClientInitialized && !persist) return;

  currentMode = nextMode;
  isClientInitialized = true;

  if (persist && typeof window !== 'undefined') {
    safeSetItem(COLOR_MODE_STORAGE_KEY, nextMode);
    safeSetItem(APPLE_MODE_STORAGE_KEY, nextMode);
    for (const key of COMPAT_KEYS) {
      safeSetItem(key, nextMode);
    }
  }

  applyDomAttributes(nextMode);

  if (persist && typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(COLOR_MODE_EVENT, {
        detail: { mode: nextMode },
      })
    );
  }

  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Ignore subscriber exception
    }
  });
}

let listenersAttached = false;

/**
 * Configures global event listeners for multi-tab storage events, custom in-app events,
 * DOM mutation observer, route history changes, and OS preference changes.
 */
function setupClientListenersOnce(): void {
  if (typeof window === 'undefined' || listenersAttached) return;
  listenersAttached = true;

  // Hydrate initial mode safely
  const initial = resolveColorMode();
  currentMode = initial;
  isClientInitialized = true;
  applyDomAttributes(initial);

  // 1. Cross-tab synchronization via storage event
  window.addEventListener('storage', (e: StorageEvent) => {
    if (
      e.key === COLOR_MODE_STORAGE_KEY ||
      e.key === 'portfolio-theme' ||
      e.key === APPLE_MODE_STORAGE_KEY
    ) {
      const val = e.newValue;
      if (val === 'dark' || val === 'light') {
        emitChange(val, false);
      }
    }
  });

  // 2. Intra-window custom event synchronization
  window.addEventListener(COLOR_MODE_EVENT, (e: Event) => {
    const custom = e as CustomEvent<{ mode?: ColorMode }>;
    const val = custom.detail?.mode;
    if ((val === 'dark' || val === 'light') && val !== currentMode) {
      emitChange(val, false);
    }
  });

  // 3. Same-tab localStorage interception for apple_mode_preference and portfolio_color_mode
  try {
    const originalSetItem = window.localStorage.setItem.bind(window.localStorage);
    window.localStorage.setItem = (key: string, value: string): void => {
      originalSetItem(key, value);
      if (
        (key === APPLE_MODE_STORAGE_KEY || key === COLOR_MODE_STORAGE_KEY) &&
        (value === 'dark' || value === 'light') &&
        value !== currentMode
      ) {
        emitChange(value, false);
      }
    };
  } catch {
    // LocalStorage proxying restricted in some environments
  }

  // 4. MutationObserver on document.documentElement for data-mode attribute changes
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-mode') {
          const domVal = document.documentElement.getAttribute('data-mode');
          if ((domVal === 'dark' || domVal === 'light') && domVal !== currentMode) {
            emitChange(domVal, false);
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mode'],
    });
  }

  // 5. Client navigation synchronization
  const syncWithRouteOrDom = (): void => {
    const dom = readDomMode();
    if (dom && dom !== currentMode) {
      emitChange(dom, false);
      return;
    }

    const isApple = typeof window !== 'undefined' && window.location?.pathname?.startsWith('/apple');
    if (isApple) {
      const applePref = safeGetItem(APPLE_MODE_STORAGE_KEY);
      if (applePref === 'dark' || applePref === 'light') {
        if (applePref !== currentMode) {
          emitChange(applePref, false);
        }
      } else {
        const generalPref = safeGetItem(COLOR_MODE_STORAGE_KEY);
        const resolvedAppleMode: ColorMode =
          generalPref === 'dark' || generalPref === 'light' ? generalPref : 'light';
        if (resolvedAppleMode !== currentMode) {
          emitChange(resolvedAppleMode, false);
        }
      }
    }
  };

  window.addEventListener('popstate', syncWithRouteOrDom);

  try {
    const originalPushState = window.history.pushState.bind(window.history);
    window.history.pushState = function (...args: Parameters<typeof window.history.pushState>): void {
      originalPushState(...args);
      setTimeout(syncWithRouteOrDom, 0);
    };

    const originalReplaceState = window.history.replaceState.bind(window.history);
    window.history.replaceState = function (...args: Parameters<typeof window.history.replaceState>): void {
      originalReplaceState(...args);
      setTimeout(syncWithRouteOrDom, 0);
    };
  } catch {
    // History proxying restricted
  }

  // 6. System prefers-color-scheme media query listener
  if (window.matchMedia) {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user has not explicitly stored a preference
      if (!readStoredMode()) {
        emitChange(e.matches ? 'dark' : 'light', false);
      }
    };

    if (mql.addEventListener) {
      mql.addEventListener('change', handleSystemChange);
    } else {
      mql.addListener(handleSystemChange);
    }
  }
}

// Initial bootstrap in browser environment
if (typeof window !== 'undefined') {
  setupClientListenersOnce();
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): ColorMode {
  return currentMode;
}

function getServerSnapshot(): ColorMode {
  return 'dark';
}

/**
 * Universal, route-agnostic Dark/Light mode management hook.
 *
 * Reliably synchronizes color mode across ALL routes (/minimal, /neon, /m-sport, /nothing, /apple, /recruiter),
 * persisting to localStorage ('portfolio_color_mode' & 'apple_mode_preference') and keeping the DOM attribute
 * data-mode="dark" | "light" strictly in sync.
 *
 * @returns {UseColorModeReturn} An object containing:
 * - `mode`: Active color mode ('dark' | 'light').
 * - `toggleMode`: Function toggling between 'dark' and 'light'.
 * - `setMode`: Function explicitly setting 'dark' or 'light'.
 */
export function useColorMode(): UseColorModeReturn {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    setupClientListenersOnce();
    const dom = readDomMode();
    if (dom && dom !== currentMode) {
      emitChange(dom, false);
    } else {
      applyDomAttributes(currentMode);
    }
  }, []);

  const setMode = useCallback((nextMode: ColorMode) => {
    if (nextMode !== 'dark' && nextMode !== 'light') return;
    emitChange(nextMode, true);
  }, []);

  const toggleMode = useCallback(() => {
    const nextMode: ColorMode = currentMode === 'dark' ? 'light' : 'dark';
    emitChange(nextMode, true);
  }, []);

  return {
    mode,
    toggleMode,
    setMode,
  };
}
