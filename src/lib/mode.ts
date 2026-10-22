// Fun / Recruiter mode. The source of truth is <html data-mode>, set before first paint by
// MODE_SCRIPT (layout head) from localStorage, defaulting to "recruiter" under reduced motion.
// The recruiter "sell" level (0..3) lives on <html data-sell> the same way.
// React reads it through useMode(); nothing else should write it except setMode().
import { useSyncExternalStore } from 'react';

import { MODE_KEY, SELL_KEY, type Mode } from './mode-script';

export { MODE_KEY, MODE_SCRIPT, SELL_KEY, type Mode } from './mode-script';

const listeners = new Set<() => void>();

export function getMode(): Mode {
  return document.documentElement.dataset.mode === 'recruiter' ? 'recruiter' : 'fun';
}

export function setMode(mode: Mode) {
  document.documentElement.dataset.mode = mode;
  try {
    localStorage.setItem(MODE_KEY, mode);
  } catch {
    /* private mode: the choice just won't persist */
  }
  listeners.forEach((l) => l());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useMode(): Mode {
  return useSyncExternalStore(subscribe, getMode, () => 'fun');
}

// ---------------------------------------------------------------- sell level (0 = least, 3 = hard)
export type Sell = 0 | 1 | 2 | 3;
const sellListeners = new Set<() => void>();
export function getSell(): Sell {
  const v = Number(document.documentElement.dataset.sell ?? 3);
  return (v >= 0 && v <= 3 ? v : 3) as Sell;
}
export function setSell(v: Sell) {
  document.documentElement.dataset.sell = String(v);
  try {
    localStorage.setItem(SELL_KEY, String(v));
  } catch {
    /* private mode */
  }
  sellListeners.forEach((l) => l());
}
function subscribeSell(fn: () => void) {
  sellListeners.add(fn);
  return () => {
    sellListeners.delete(fn);
  };
}
/** Server render = hard sell (the default, and the full content for crawlers). */
export function useSell(): Sell {
  return useSyncExternalStore(subscribeSell, getSell, () => 3 as Sell);
}
