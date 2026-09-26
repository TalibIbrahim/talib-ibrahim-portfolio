'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import styles from './DecryptedText.module.css';

export interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'hover';
}

const DEFAULT_CHARACTERS = '!<>-_\\/[]{}—=+*^?#0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Computes reveal sequence index order for 'center' reveal direction.
 */
function getCenterOrder(len: number): number[] {
  const order: number[] = [];
  const mid = Math.floor(len / 2);
  order.push(mid);
  let left = mid - 1;
  let right = mid + 1;
  while (left >= 0 || right < len) {
    if (right < len) {
      order.push(right);
      right++;
    }
    if (left >= 0) {
      order.push(left);
      left--;
    }
  }
  return order;
}

/**
 * Computes the reveal sequence index order based on direction.
 */
function getRevealOrder(len: number, direction: 'start' | 'end' | 'center'): number[] {
  if (len <= 0) return [];
  if (direction === 'end') {
    return Array.from({ length: len }, (_, i) => len - 1 - i);
  }
  if (direction === 'center') {
    return getCenterOrder(len);
  }
  return Array.from({ length: len }, (_, i) => i);
}

/**
 * DecryptedText component progressively decodes scrambled glyphs into readable text
 * with cyberpunk/creative engineering neon aesthetics.
 */
export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  characters = DEFAULT_CHARACTERS,
  className = '',
  encryptedClassName = '',
  parentClassName = '',
  animateOn = 'hover',
}: DecryptedTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true });

  const [scrambledText, setScrambledText] = useState<string>(text);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  const getRandomChar = useCallback(() => {
    return characters[Math.floor(Math.random() * characters.length)];
  }, [characters]);

  const clearIntervalTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const triggerAnimation = useCallback(() => {
    if (shouldReduceMotion) return;
    clearIntervalTimer();

    const len = text.length;
    if (len === 0) return;

    setIsAnimating(true);

    if (sequential) {
      const order = getRevealOrder(len, revealDirection);
      let step = 0;
      const currentRevealed = new Set<number>();

      intervalRef.current = setInterval(() => {
        if (step < order.length) {
          currentRevealed.add(order[step]);
          setRevealedIndices(new Set(currentRevealed));

          const nextChars = text.split('').map((char, idx) => {
            if (char === ' ' || char === '\n') return char;
            if (currentRevealed.has(idx)) return text[idx];
            return getRandomChar();
          });

          setScrambledText(nextChars.join(''));
          step++;
        } else {
          clearIntervalTimer();
          setScrambledText(text);
          setRevealedIndices(new Set(order));
          setIsAnimating(false);
        }
      }, speed);
    } else {
      let iteration = 0;
      const currentRevealed = new Set<number>();

      intervalRef.current = setInterval(() => {
        iteration++;

        if (iteration >= maxIterations) {
          clearIntervalTimer();
          setScrambledText(text);
          setRevealedIndices(new Set(Array.from({ length: len }, (_, i) => i)));
          setIsAnimating(false);
          return;
        }

        // Progressively lock characters based on iteration ratio
        const revealThreshold = iteration / maxIterations;
        for (let i = 0; i < len; i++) {
          if (Math.random() < revealThreshold) {
            currentRevealed.add(i);
          }
        }
        setRevealedIndices(new Set(currentRevealed));

        const nextChars = text.split('').map((char, idx) => {
          if (char === ' ' || char === '\n') return char;
          if (currentRevealed.has(idx)) return text[idx];
          return getRandomChar();
        });

        setScrambledText(nextChars.join(''));
      }, speed);
    }
  }, [
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    getRandomChar,
    clearIntervalTimer,
    shouldReduceMotion,
  ]);

  // Handle animateOn="view"
  useEffect(() => {
    if (animateOn === 'view' && isInView && !hasAnimatedRef.current && !shouldReduceMotion) {
      hasAnimatedRef.current = true;
      triggerAnimation();
    }
  }, [animateOn, isInView, triggerAnimation, shouldReduceMotion]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      clearIntervalTimer();
    };
  }, [clearIntervalTimer]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover' && !isAnimating) {
      triggerAnimation();
    }
  };

  // Immediate accessible return for reduced motion preference
  if (shouldReduceMotion) {
    return (
      <span className={`${styles.wrapper} ${parentClassName}`.trim()}>
        <span className={className || styles.revealed}>{text}</span>
      </span>
    );
  }

  const revealedClass = className || styles.revealed;
  const encryptedClass = encryptedClassName
    ? `${styles.encrypted} ${encryptedClassName}`
    : styles.encrypted;

  const currentDisplayText = isAnimating ? scrambledText : text;

  return (
    <span
      ref={containerRef}
      className={`${styles.wrapper} ${parentClassName}`.trim()}
      onMouseEnter={handleMouseEnter}
    >
      {/* Screen reader accessible element */}
      <span className={styles.srOnly}>{text}</span>

      {/* Visual decoded/scrambled elements */}
      <span aria-hidden="true">
        {currentDisplayText.split('').map((char, index) => {
          const isRevealed = !isAnimating || revealedIndices.has(index);
          return (
            <span key={index} className={isRevealed ? revealedClass : encryptedClass}>
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
