'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { useMode } from '@/context/ModeContext';

/**
 * SmoothScroll component using Lenis
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { mode } = useMode();

  useEffect(() => {
    // Disable Lenis in Boring / Recruiter mode or if user prefers reduced motion
    if (mode === 'boring' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Easing function approximating cubic-bezier(0.65, 0.05, 0, 1)
    const easing = (t: number) => 1 - Math.pow(1 - t, 4);

    const lenis = new Lenis({
      duration: 0.75, // 750ms
      easing: easing,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [mode]);

  return <>{children}</>;
}
