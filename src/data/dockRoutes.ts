import type { DockRouteItem } from './types';

export type { DockRouteItem };

/**
 * Canonical route definitions for the Unified Floating Dock navigation.
 * Spans all 6 dedicated portfolio architecture builds.
 */
export const DOCK_ROUTES: readonly DockRouteItem[] = [
  {
    path: '/',
    name: 'Minimal',
    shortName: 'Min',
    iconIdentifier: 'terminal',
    description: 'Clean monochrome editorial layout',
    accentColor: '#ffffff',
  },
  {
    path: '/neon',
    name: 'Neon',
    shortName: 'Neon',
    iconIdentifier: 'zap',
    description: 'Cyberpunk WebGL fluid glow',
    accentColor: '#ccff00',
  },
  {
    path: '/m-sport',
    name: 'M Sport',
    shortName: '///M',
    iconIdentifier: 'gauge',
    description: 'High-velocity motorsport telemetry',
    accentColor: '#81C4FF',
  },
  {
    path: '/nothing',
    name: 'Nothing',
    shortName: 'Nothing',
    iconIdentifier: 'grid',
    description: 'Clinical dot-matrix hardware OS',
    accentColor: '#D71921',
  },
  {
    path: '/apple',
    name: 'Apple',
    shortName: 'Apple',
    iconIdentifier: 'laptop',
    description: 'Keynote frosted glass product showcase',
    accentColor: '#0071e3',
  },
  {
    path: '/recruiter',
    name: 'Recruiter',
    shortName: 'Recruiter',
    iconIdentifier: 'briefcase',
    description: 'Spreadsheet-grade executive dossier',
    accentColor: '#10b981',
    shortcutKey: 'B',
  },
] as const;

/**
 * Normalizes a URL pathname by stripping search parameters, hash fragments,
 * and trailing slashes (except the root slash '/').
 *
 * @param pathname The raw pathname string.
 * @returns Clean normalized path.
 */
export function normalizeDockPath(pathname: string | null | undefined): string {
  if (!pathname) return '/';
  const clean = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
}

/**
 * Checks whether a given target dock route is active against the current pathname.
 * Implements robust matching rules:
 * - '/' and '/minimal' -> Minimal
 * - '/recruiter' and '/boring' -> Recruiter
 * - Dedicated routes match exact path or subpaths.
 *
 * @param targetPath The route path to test (e.g. '/', '/neon', '/recruiter').
 * @param currentPathname The active browser pathname.
 * @returns True if the target route is considered active.
 */
export function isDockRouteActive(
  targetPath: string,
  currentPathname: string | null | undefined
): boolean {
  const normCurrent = normalizeDockPath(currentPathname);
  const normTarget = normalizeDockPath(targetPath);

  // Alias group: Minimal ('/' and '/minimal')
  if (normTarget === '/' || normTarget === '/minimal') {
    return normCurrent === '/' || normCurrent === '/minimal' || normCurrent.startsWith('/minimal/');
  }

  // Alias group: Recruiter ('/recruiter' and '/boring')
  if (normTarget === '/recruiter' || normTarget === '/boring') {
    return (
      normCurrent === '/recruiter' ||
      normCurrent === '/boring' ||
      normCurrent.startsWith('/recruiter/') ||
      normCurrent.startsWith('/boring/')
    );
  }

  // Standard route matching (exact or subpath)
  return normCurrent === normTarget || normCurrent.startsWith(`${normTarget}/`);
}

/**
 * Resolves the active DockRouteItem given the current browser pathname.
 * Maps:
 * - '/' and '/minimal' -> Minimal
 * - '/recruiter' and '/boring' -> Recruiter
 * - '/neon' -> Neon
 * - '/m-sport' -> M Sport
 * - '/nothing' -> Nothing
 * - '/apple' -> Apple
 *
 * @param currentPathname The active browser pathname.
 * @returns The matched DockRouteItem, defaulting to Minimal if unmatched.
 */
export function getActiveDockRoute(currentPathname: string | null | undefined): DockRouteItem {
  const normCurrent = normalizeDockPath(currentPathname);

  // 1. Minimal alias check ('/' or '/minimal')
  if (normCurrent === '/' || normCurrent === '/minimal' || normCurrent.startsWith('/minimal/')) {
    return DOCK_ROUTES[0];
  }

  // 2. Recruiter alias check ('/recruiter' or '/boring')
  if (
    normCurrent === '/recruiter' ||
    normCurrent === '/boring' ||
    normCurrent.startsWith('/recruiter/') ||
    normCurrent.startsWith('/boring/')
  ) {
    const recruiterRoute = DOCK_ROUTES.find((r) => r.path === '/recruiter');
    return recruiterRoute ?? DOCK_ROUTES[5];
  }

  // 3. Exact or prefix match for remaining dedicated routes
  const matched = DOCK_ROUTES.find((r) => {
    if (r.path === '/' || r.path === '/recruiter') return false;
    return normCurrent === r.path || normCurrent.startsWith(`${r.path}/`);
  });

  return matched ?? DOCK_ROUTES[0];
}
