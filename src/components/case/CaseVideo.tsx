'use client';
// Hero loop for video case studies. The poster is the LCP; the loop only plays in fun mode with
// motion allowed (usePage never runs in Recruiter Mode), and pauses when the page leaves.
import { useRef } from 'react';
import type { Img } from '@/data/types';
import { prefersReducedMotion } from '@/engine';
import { usePage } from '@/engine/next';

export function CaseVideo({ src, poster, className }: { src: string; poster: Img; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  usePage(() => {
    const v = ref.current;
    if (!v || prefersReducedMotion()) return;
    v.preload = 'auto';
    v.play().catch(() => {});
    return () => v.pause();
  });
  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster.src}
      width={poster.width}
      height={poster.height}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={poster.alt}
    />
  );
}
