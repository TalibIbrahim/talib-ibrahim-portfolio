'use client';

import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useMode } from '@/context/ModeContext';
import styles from './ClickSpark.module.css';

export interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  children?: React.ReactNode;
  className?: string;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

/**
 * ClickSpark spawns an interactive radial burst of acid neon sparks
 * with friction-decelerated physics upon click.
 */
export default function ClickSpark({
  sparkColor = '#ccff00',
  sparkSize = 10,
  sparkRadius = 25,
  sparkCount = 8,
  duration = 400,
  children,
  className = '',
}: ClickSparkProps) {
  const { mode } = useMode();
  const isBoring = mode === 'boring';

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const isAnimatingRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const drawLoopRef = useRef<((timestamp: number) => void) | null>(null);

  const shouldReduceMotion = useReducedMotion();

  // Resize canvas to match viewport dimensions with devicePixelRatio scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  // Animation frame drawing logic
  useEffect(() => {
    function draw(timestamp: number) {
      const canvas = canvasRef.current;
      if (!canvas) {
        isAnimatingRef.current = false;
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        isAnimatingRef.current = false;
        return;
      }

      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const cssWidth = canvas.width / dpr;
      const cssHeight = canvas.height / dpr;

      // Filter active sparks
      sparksRef.current = sparksRef.current.filter((spark) => {
        return timestamp - spark.startTime < duration;
      });

      // Clear the canvas
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      if (sparksRef.current.length === 0) {
        // Stop animation loop when idle
        isAnimatingRef.current = false;
        return;
      }

      let resolvedColor = sparkColor;
      if (sparkColor.startsWith('var(') && typeof window !== 'undefined') {
        const match = sparkColor.match(/var\((--[^,\)]+)(?:,\s*([^)]+))?\)/);
        if (match) {
          const varName = match[1];
          const fallback = match[2] || '#ccff00';
          const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
          resolvedColor = computed || fallback;
        }
      }

      for (const spark of sparksRef.current) {
        const elapsed = timestamp - spark.startTime;
        const progress = Math.min(Math.max(elapsed / duration, 0), 1);

        // Cubic ease-out friction curve
        const eased = 1 - Math.pow(1 - progress, 3);
        const distance = eased * sparkRadius;
        const currentLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + currentLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + currentLength) * Math.sin(spark.angle);

        ctx.save();
        ctx.strokeStyle = resolvedColor;
        ctx.lineWidth = 1.75;
        ctx.lineCap = 'round';
        ctx.globalAlpha = Math.max(0, 1 - progress);
        ctx.shadowColor = resolvedColor;
        ctx.shadowBlur = 6;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    }

    drawLoopRef.current = draw;
  }, [duration, sparkColor, sparkRadius, sparkSize]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Accessibility: skip sparks if user prefers reduced motion or boring mode
    if (shouldReduceMotion || isBoring) return;

    const clickX = e.clientX;
    const clickY = e.clientY;

    const now = performance.now();
    const newSparks: Spark[] = [];

    const angleStep = (2 * Math.PI) / sparkCount;
    for (let i = 0; i < sparkCount; i++) {
      newSparks.push({
        x: clickX,
        y: clickY,
        angle: i * angleStep,
        startTime: now,
      });
    }

    sparksRef.current.push(...newSparks);

    if (!isAnimatingRef.current && drawLoopRef.current) {
      isAnimatingRef.current = true;
      animationFrameRef.current = requestAnimationFrame(drawLoopRef.current);
    }
  };

  if (isBoring) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.sparkContainer} ${className}`.trim()}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      {children}
    </div>
  );
}
