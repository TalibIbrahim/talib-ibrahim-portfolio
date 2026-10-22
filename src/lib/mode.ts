// The Recruiter page's "sell" level (0 = least, 3 = hard sell, the default). Source of truth is
// <html data-sell>, set before first paint by BOOT_SCRIPT from localStorage.
import { useSyncExternalStore } from 'react';
import { SELL_KEY } from './mode-script';

export type Sell = 0 | 1 | 2 | 3;
const listeners = new Set<() => void>();

export function getSell(): Sell {
  const v = Number(document.documentElement.dataset.sell ?? 3);
  return (v >= 0 && v <= 3 ? v : 3) as Sell;
}

export function setSell(v: Sell) {
  document.documentElement.dataset.sell = String(v);
  try {
    localStorage.setItem(SELL_KEY, String(v));
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

/** Server render = hard sell (the default, and the full content for crawlers). */
export function useSell(): Sell {
  return useSyncExternalStore(subscribe, getSell, () => 3 as Sell);
}
