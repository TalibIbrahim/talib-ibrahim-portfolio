'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import styles from './Magnet.module.css';

export interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  className?: string;
}

/**
 * Magnet magnetically pulls wrapped children towards the user's cursor
 * within a specified padding perimeter, damped by a responsive spring.
 */
export default function Magnet({
  children,
  padding = 40,
  disabled = false,
  magnetStrength = 0.3,
  className = '',
}: MagnetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isDisabled = disabled || Boolean(shouldReduceMotion);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 14, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    if (isDisabled) {
      x.set(0);
      y.set(0);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const distX = Math.abs(deltaX);
      const distY = Math.abs(deltaY);

      if (distX < rect.width / 2 + padding && distY < rect.height / 2 + padding) {
        x.set(deltaX * magnetStrength);
        y.set(deltaY * magnetStrength);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const handleReset = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleReset);
    window.addEventListener('blur', handleReset);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleReset);
      window.removeEventListener('blur', handleReset);
    };
  }, [isDisabled, padding, magnetStrength, x, y]);

  return (
    <div ref={containerRef} className={`${styles.magnetContainer} ${className}`.trim()}>
      <motion.div
        className={styles.magnetInner}
        style={isDisabled ? undefined : { x: springX, y: springY }}
      >
        {children}
      </motion.div>
    </div>
  );
}
