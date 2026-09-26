'use client';

import React, { useRef, useState, useCallback } from 'react';
import styles from './SpotlightCard.module.css';

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}

/**
 * SpotlightCard creates a dynamic cursor-tracking radial illumination
 * over a dark carbon card, highlighting borders and interactive contents.
 */
export default function SpotlightCard({
  children,
  spotlightColor = 'rgba(204, 255, 0, 0.12)',
  className = '',
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...restProps
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      if (onMouseMove) {
        onMouseMove(e);
      }
    },
    [onMouseMove]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setOpacity(1);
      if (onMouseEnter) {
        onMouseEnter(e);
      }
    },
    [onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setOpacity(0);
      if (onMouseLeave) {
        onMouseLeave(e);
      }
    },
    [onMouseLeave]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      setOpacity(1);
      if (onFocus) {
        onFocus(e);
      }
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      setOpacity(0);
      if (onBlur) {
        onBlur(e);
      }
    },
    [onBlur]
  );

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${className}`.trim()}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...restProps}
    >
      <div
        className={styles.spotlight}
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 75%)`,
        }}
        aria-hidden="true"
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
