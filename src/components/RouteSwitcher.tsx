'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Briefcase,
  Zap,
  Gauge,
  Grid,
  Laptop,
  ChevronUp,
  type LucideIcon,
} from 'lucide-react';
import styles from './RouteSwitcher.module.css';

interface RouteOption {
  readonly path: string;
  readonly name: string;
  readonly shortName: string;
  readonly icon: LucideIcon;
  readonly desc: string;
}

const ROUTES: readonly RouteOption[] = [
  { path: '/', name: 'Minimal', shortName: 'Min', icon: Code2, desc: 'Original Production' },
  { path: '/recruiter', name: 'Recruiter', shortName: 'Recruiter', icon: Briefcase, desc: 'Simple Text // Intensity 0-3' },
  { path: '/neon', name: 'Neon', shortName: 'Neon', icon: Zap, desc: 'Cyberpunk WebGL' },
  { path: '/m-sport', name: 'M Sport', shortName: '///M', icon: Gauge, desc: 'Motorsport Telemetry' },
  { path: '/nothing', name: 'Nothing', shortName: 'Nothing', icon: Grid, desc: 'Carl Pei Dot-Matrix' },
  { path: '/apple', name: 'Apple', shortName: 'Apple', icon: Laptop, desc: 'Keynote Frosted Glass' },
];

/**
 * Universal Cross-Route Switcher
 * Pinned neatly in the bottom-right corner across all five routes.
 * Enables instant switching between Minimal, Neon, M Sport, Nothing, and Apple themes.
 */
export default function RouteSwitcher() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  // Normalize pathname to identify current route
  const currentRoute =
    ROUTES.find((r) => {
      if (r.path === '/') return pathname === '/' || pathname === '/minimal';
      if (r.path === '/recruiter') return pathname === '/recruiter' || pathname === '/boring';
      return pathname.startsWith(r.path);
    }) ?? ROUTES[0];

  return (
    <aside
      className={styles.switcherWrapper}
      aria-label="Portfolio theme routes"
    >
      <div className={styles.capsuleContainer}>
        {/* Expanded Navigation Drawer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className={styles.drawer}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <div className={styles.drawerHeader}>
                <span className={styles.drawerTitle}>SWITCH THEME ROUTE</span>
                <span className={styles.drawerMeta}>6 BUILDS</span>
              </div>

              <div className={styles.routeGrid}>
                {ROUTES.map((r) => {
                  const isActive =
                    r.path === '/'
                      ? pathname === '/' || pathname === '/minimal'
                      : r.path === '/recruiter'
                      ? pathname === '/recruiter' || pathname === '/boring'
                      : pathname.startsWith(r.path);
                  const Icon = r.icon;

                  return (
                    <Link
                      key={r.path}
                      href={r.path}
                      onClick={() => setIsExpanded(false)}
                      className={`${styles.routeItem} ${isActive ? styles.routeItemActive : ''}`}
                    >
                      <span className={styles.routeIconWrapper}>
                        <Icon size={14} className={styles.routeIcon} />
                      </span>
                      <div className={styles.routeInfo}>
                        <div className={styles.routeTopLine}>
                          <span className={styles.routeName}>{r.name}</span>
                          {isActive && <span className={styles.activePip} />}
                        </div>
                        <span className={styles.routeDesc}>{r.desc}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Persistent Compact Pill / Trigger */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className={`${styles.triggerPill} ${isExpanded ? styles.triggerPillOpen : ''}`}
          aria-expanded={isExpanded}
          aria-label="Toggle theme route switcher menu"
        >
          <span className={styles.triggerInner}>
            <currentRoute.icon size={13} className={styles.currentIcon} />
            <span className={styles.currentName}>{currentRoute.name}</span>
            <span className={styles.triggerBadge}>ROUTE</span>
            <ChevronUp
              size={13}
              className={`${styles.chevron} ${isExpanded ? styles.chevronRotated : ''}`}
            />
          </span>
        </button>
      </div>
    </aside>
  );
}
