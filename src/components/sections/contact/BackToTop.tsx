'use client';
// Back to top through the engine (Lenis when running, native scroll otherwise), then focus moves
// to <main> so keyboard and screen reader users land at the top too.
import { ArrowUp } from 'lucide-react';
import { scrollToTarget } from '@/engine';
import { RollText } from '@/components/chrome/RollText';
import styles from '../Contact.module.css';

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      className={styles.top}
      onClick={() => {
        scrollToTarget(0);
        document.getElementById('main')?.focus({ preventScroll: true });
      }}
    >
      <RollText>{label}</RollText>
      <ArrowUp className={styles.topIcon} size={16} strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}
