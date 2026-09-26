'use client';

import React, { useRef, useState, useCallback, type JSX } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import {
  Terminal,
  Zap,
  Gauge,
  Grid,
  Laptop,
  Briefcase,
  Sun,
  Moon,
  type LucideIcon,
} from 'lucide-react';
import { useDockRoutes } from '@/hooks/useDockRoutes';
import { useColorMode } from '@/hooks/useColorMode';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';
import type { DockRouteItem } from '@/data/types';
import { playHoverBeep, playClickChime } from '@/utils/audioSynth';
import styles from './UnifiedDock.module.css';

export interface UnifiedDockProps {
  readonly className?: string;
}

type DockThemeVariant = 'apple' | 'neon' | 'msport' | 'nothing' | 'minimal';

/**
 * Lucide icon mapping matching Alfred's iconIdentifier metadata.
 */
const ROUTE_ICONS: Record<string, LucideIcon> = {
  terminal: Terminal,
  zap: Zap,
  gauge: Gauge,
  grid: Grid,
  laptop: Laptop,
  briefcase: Briefcase,
};

/**
 * Resolves the visual theme variant based on the current pathname.
 */
function resolveThemeVariant(pathname: string | null | undefined): DockThemeVariant {
  if (!pathname) return 'minimal';
  if (pathname.startsWith('/apple')) return 'apple';
  if (pathname.startsWith('/neon')) return 'neon';
  if (pathname.startsWith('/m-sport')) return 'msport';
  if (pathname.startsWith('/nothing')) return 'nothing';
  return 'minimal';
}

interface DockItemProps {
  readonly route: DockRouteItem;
  readonly isActive: boolean;
  readonly mouseX: MotionValue<number>;
  readonly onClick?: () => void;
}

/**
 * Single Dock Navigation Item with macOS magnification physics and animated indicator.
 */
function DockItem({ route, isActive, mouseX, onClick }: DockItemProps): JSX.Element {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Compute distance from mouse to item center
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = itemRef.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // macOS Magnification: resting 40px, scaling up to 60px, neighbors proportional to ~48px
  const sizeTransform = useTransform(distance, [-130, 0, 130], [40, 60, 40]);
  const size = useSpring(sizeTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const iconScale = useTransform(size, [40, 60], [1, 1.35]);

  const IconComponent = ROUTE_ICONS[route.iconIdentifier] ?? Terminal;

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    playHoverBeep();
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback(() => {
    playClickChime();
    onClick?.();
  }, [onClick]);

  return (
    <motion.div
      ref={itemRef}
      style={{ width: size, height: size }}
      className={styles.dockItemWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tooltip on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={styles.tooltip}
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <span className={styles.tooltipTitle}>
              {route.name}
              {route.shortcutKey ? ` [${route.shortcutKey}]` : ''}
            </span>
            <span className={styles.tooltipSubtitle}>{route.description}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        href={route.path}
        onClick={handleClick}
        className={styles.dockItemLink}
        aria-label={`${route.name}${route.shortcutKey ? ` [${route.shortcutKey}]` : ''} route: ${route.description}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Subtle Keyboard Shortcut Badge Chip */}
        {route.shortcutKey && (
          <span className={styles.shortcutChip} aria-hidden="true">
            [{route.shortcutKey}]
          </span>
        )}
        {/* Animated Sliding Backdrop Indicator */}
        {isActive && (
          <motion.div
            layoutId="activeDockBackdrop"
            className={styles.activeBackdrop}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          />
        )}

        {/* Scaled Icon */}
        <motion.div style={{ scale: iconScale }} className={styles.iconCenter}>
          <IconComponent size={18} strokeWidth={2} />
        </motion.div>

        {/* Animated Pip Indicator */}
        {isActive && (
          <motion.span
            layoutId="activeDockPip"
            className={styles.activePip}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          />
        )}
      </Link>
    </motion.div>
  );
}

interface DockModeToggleProps {
  readonly mode: 'dark' | 'light';
  readonly onToggle: () => void;
  readonly mouseX: MotionValue<number>;
}

/**
 * Tactile Dark/Light Mode Toggle Button participating in macOS dock magnification.
 */
function DockModeToggle({ mode, onToggle, mouseX }: DockModeToggleProps): JSX.Element {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = itemRef.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeTransform = useTransform(distance, [-130, 0, 130], [40, 60, 40]);
  const size = useSpring(sizeTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const iconScale = useTransform(size, [40, 60], [1, 1.35]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    playHoverBeep();
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback(() => {
    playClickChime();
    onToggle();
  }, [onToggle]);

  const isDark = mode === 'dark';
  const tooltipText = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return (
    <motion.div
      ref={itemRef}
      style={{ width: size, height: size }}
      className={styles.dockItemWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={styles.tooltip}
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <span className={styles.tooltipTitle}>{tooltipText}</span>
            <span className={styles.tooltipSubtitle}>Universal Appearance</span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={handleClick}
        className={styles.modeToggleButton}
        aria-label={tooltipText}
        title={tooltipText}
      >
        <motion.div style={{ scale: iconScale }} className={styles.iconCenter}>
          {isDark ? (
            <Sun size={18} strokeWidth={2} />
          ) : (
            <Moon size={18} strokeWidth={2} />
          )}
        </motion.div>
      </button>
    </motion.div>
  );
}

/**
 * Unified Floating Dock
 *
 * Fixed at bottom-center across all portfolio routes.
 * Replaces RouteSwitcher to provide seamless macOS magnification physics,
 * sliding spring active route indicators, tactile Dark/Light mode toggle,
 * and 5 distinct visual theme variants (Apple, Neon, M Sport, Nothing, Minimal).
 */
export default function UnifiedDock({ className = '' }: UnifiedDockProps): JSX.Element {
  // Global keyboard shortcuts (press 'B' or 'R' to navigate to /recruiter)
  useGlobalShortcuts();

  const pathname = usePathname();
  const { routes, isActive } = useDockRoutes();
  const { mode, toggleMode } = useColorMode();
  const mouseX = useMotionValue(Infinity);

  const themeVariant = resolveThemeVariant(pathname);

  const variantClass =
    themeVariant === 'apple'
      ? styles.variantApple
      : themeVariant === 'neon'
      ? styles.variantNeon
      : themeVariant === 'msport'
      ? styles.variantMsport
      : themeVariant === 'nothing'
      ? styles.variantNothing
      : styles.variantMinimal;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseX.set(e.clientX);
    },
    [mouseX]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(Infinity);
  }, [mouseX]);

  return (
    <aside className={`${styles.dockFixedWrapper} ${className}`} aria-label="Portfolio theme dock">
      <nav
        className={`${styles.dockNav} ${variantClass}`}
        data-mode={mode}
        data-theme={themeVariant}
      >
        {/* M Sport Signature 3-Stripe Accent Bar */}
        {themeVariant === 'msport' && (
          <div className={styles.msportStripeHeader} aria-hidden="true">
            <span className={styles.msportStripeLightBlue} />
            <span className={styles.msportStripeDarkBlue} />
            <span className={styles.msportStripeRed} />
          </div>
        )}

        {/* Dock Items Container with macOS Magnification Physics */}
        <div
          className={styles.dockContainer}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          role="toolbar"
          aria-label="Route and appearance controls"
        >
          {routes.map((route) => (
            <DockItem
              key={route.path}
              route={route}
              isActive={isActive(route.path)}
              mouseX={mouseX}
            />
          ))}

          {/* Separator Divider */}
          <span className={styles.dockDivider} aria-hidden="true" />

          {/* Universal Dark / Light Mode Toggle Button */}
          <DockModeToggle mode={mode} onToggle={toggleMode} mouseX={mouseX} />
        </div>
      </nav>
    </aside>
  );
}
