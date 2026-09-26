'use client';

import { useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import {
  DOCK_ROUTES,
  getActiveDockRoute,
  isDockRouteActive,
  type DockRouteItem,
} from '@/data/dockRoutes';
import type { UseDockRoutesReturn } from '@/data/types';

export type { DockRouteItem, UseDockRoutesReturn };

/**
 * Universal hook for detecting the active portfolio dock route and matching states.
 * Works seamlessly across all route variants (/minimal, /neon, /m-sport, /nothing, /apple, /recruiter).
 *
 * Matching Rules:
 * - '/' and '/minimal' -> Minimal
 * - '/recruiter' and '/boring' -> Recruiter
 * - '/neon' -> Neon
 * - '/m-sport' -> M Sport
 * - '/nothing' -> Nothing
 * - '/apple' -> Apple
 *
 * @returns {UseDockRoutesReturn} An object containing:
 * - `routes`: The static array of all 6 dock route definitions.
 * - `activeRoute`: The resolved DockRouteItem for the current URL pathname.
 * - `isActive(path)`: Function returning boolean whether given path matches the current route.
 */
export function useDockRoutes(): UseDockRoutesReturn {
  const pathname = usePathname();

  const activeRoute = useMemo<DockRouteItem>(() => {
    return getActiveDockRoute(pathname);
  }, [pathname]);

  const isActive = useCallback(
    (targetPath: string): boolean => {
      return isDockRouteActive(targetPath, pathname);
    },
    [pathname]
  );

  return useMemo(
    () => ({
      routes: DOCK_ROUTES,
      activeRoute,
      isActive,
    }),
    [activeRoute, isActive]
  );
}
