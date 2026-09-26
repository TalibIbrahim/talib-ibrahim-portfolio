'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { useMode } from '@/context/ModeContext';
import { playOverdriveChime } from '@/utils/audioSynth';
import { Zap } from 'lucide-react';
import styles from './GravitationalCursor.module.css';

export interface GravitationalCursorProps {
  readonly className?: string;
}

interface ShockwaveRipple {
  readonly id: number;
  readonly x: number;
  readonly y: number;
}

// Hydration-safe touch device subscription
const subscribeTouch = () => () => {};
const getTouchSnapshot = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    Boolean(window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
  );
};
const getServerTouchSnapshot = (): boolean => false;

/**
 * GravitationalCursor renders a dual-element sci-fi cursor:
 * 1. Center precision dot moving 1:1 with cursor pointer.
 * 2. Outer spring-lagged gravitational lens ring that dynamically responds to clicks & interactive elements.
 * 3. Overdrive Turbo Mode easter egg engaged via [O] or typing 'turbo'.
 */
export default function GravitationalCursor({
  className = '',
}: GravitationalCursorProps) {
  const { mode } = useMode();
  const prefersReducedMotion = useReducedMotion();
  const isTouchDevice = useSyncExternalStore(
    subscribeTouch,
    getTouchSnapshot,
    getServerTouchSnapshot
  );

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [isTextInput, setIsTextInput] = useState<boolean>(false);
  const [isOverdrive, setIsOverdrive] = useState<boolean>(false);
  const [ripples, setRipples] = useState<readonly ShockwaveRipple[]>([]);

  const keySequenceRef = useRef<string>('');

  // 1:1 pointer motion coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Gravitational lens spring lag coordinates
  const springConfig = { stiffness: 350, damping: 25, mass: 0.2 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  const isDisabled = isTouchDevice || Boolean(prefersReducedMotion) || mode === 'boring';
  const isOverdriveActive = isOverdrive && mode !== 'boring';

  // Toggle custom cursor class on HTML root for cursor hiding
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isDisabled) {
      document.documentElement.classList.remove('has-custom-cursor');
      return;
    }

    document.documentElement.classList.add('has-custom-cursor');
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [isDisabled]);

  // Synchronize overdrive body class
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isOverdriveActive) {
      document.body.classList.add('overdriveActive');
    } else {
      document.body.classList.remove('overdriveActive');
    }

    return () => {
      document.body.classList.remove('overdriveActive');
    };
  }, [isOverdriveActive]);

  const toggleOverdrive = useCallback(() => {
    setIsOverdrive((prev) => {
      const next = !prev;
      if (next) {
        playOverdriveChime();
      }
      return next;
    });
  }, []);

  // Keyboard listener: 'O' or typing 'turbo' engages Overdrive Turbo Mode
  useEffect(() => {
    if (mode === 'boring') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      // Single key 'O' toggles overdrive
      if (event.code === 'KeyO') {
        event.preventDefault();
        toggleOverdrive();
        return;
      }

      // String sequence 'turbo' detection
      const key = event.key.toLowerCase();
      if (key.length === 1 && /[a-z]/.test(key)) {
        keySequenceRef.current = (keySequenceRef.current + key).slice(-10);
        if (keySequenceRef.current.endsWith('turbo')) {
          keySequenceRef.current = '';
          setIsOverdrive((prev) => {
            if (!prev) {
              playOverdriveChime();
              return true;
            }
            return prev;
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode, toggleOverdrive]);

  // Pointer position and interaction event tracking
  useEffect(() => {
    if (isDisabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest(
            'a, button, [role="button"], input[type="submit"], input[type="button"], label, [data-cursor-hover]'
          )
        );
        setIsHovered(isInteractive);

        const isTextControl = Boolean(
          target.closest(
            'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]'
          )
        );
        setIsTextInput(isTextControl);
      }
    };

    const handleMouseDown = () => {
      setIsMouseDown(true);
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsMouseDown(false);
      // Generate transient shockwave ripple
      const newRipple: ShockwaveRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isDisabled, mouseX, mouseY]);

  // Clean shockwave ripple callback
  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  if (isDisabled) {
    return null;
  }

  // Ring dimension calculations
  // Default: 36px | Hovering interactive element: 64px | MouseDown kinetic compression: 20px
  let ringSize = 36;
  if (isHovered) {
    ringSize = 64;
  }
  if (isMouseDown) {
    ringSize = 20;
  }

  const cursorOpacity = isVisible && !isTextInput ? 1 : 0;

  return (
    <>
      {/* Precision Center Dot (1:1 with pointer) */}
      <motion.div
        className={`${styles.centerDot} ${isOverdriveActive ? styles.centerDotOverdrive : ''} ${className}`.trim()}
        style={{
          x: mouseX,
          y: mouseY,
          opacity: cursorOpacity,
        }}
        aria-hidden="true"
      />

      {/* Outer Gravitational Lens Ring (spring lagged) */}
      <motion.div
        className={styles.ringAnchor}
        style={{
          x: ringX,
          y: ringY,
          opacity: cursorOpacity,
        }}
        aria-hidden="true"
      >
        <motion.div
          className={`${styles.lensRing} ${isHovered ? styles.lensRingHovered : ''} ${
            isOverdriveActive ? styles.lensRingOverdrive : ''
          }`}
          animate={{
            width: ringSize,
            height: ringSize,
            x: -ringSize / 2,
            y: -ringSize / 2,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 26,
            mass: 0.15,
          }}
        />
      </motion.div>

      {/* Transient Shockwave Ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className={styles.shockwave}
            style={{ left: ripple.x, top: ripple.y }}
            initial={{
              width: 20,
              height: 20,
              opacity: 0.85,
              x: '-50%',
              y: '-50%',
            }}
            animate={{
              width: 100,
              height: 100,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            onAnimationComplete={() => removeRipple(ripple.id)}
            aria-hidden="true"
          />
        ))}
      </AnimatePresence>

      {/* Overdrive Turbo Telemetry HUD Bar */}
      <AnimatePresence>
        {isOverdriveActive && (
          <motion.div
            className={styles.overdriveHud}
            initial={{ y: -45, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -45, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
          >
            <div className={styles.hudContent}>
              <div className={styles.hudLeft}>
                <span className={styles.hudGlitchDot} aria-hidden="true" />
                <span className={styles.hudText}>
                  [ <Zap size={13} aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> OVERDRIVE ENGAGED // TURBO BOOST ACTIVE // HYPER VELOCITY ]
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOverdrive(false)}
                className={styles.hudDismissBtn}
                aria-label="Disengage Overdrive Turbo Mode"
                title="Press O or click to disengage"
              >
                [O] DISENGAGE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
