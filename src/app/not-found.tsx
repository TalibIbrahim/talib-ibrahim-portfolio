import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { RollText } from '@/components/chrome/RollText';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

// The unfinished stroke: the ink stops partway, the dotted guide shows where it was meant to go.
const STROKE =
  'M24 150 C52 96 78 38 104 44 C132 50 102 132 84 146 C66 160 70 112 112 100 C150 88 162 132 186 128 ' +
  'C214 124 214 82 238 86 C262 90 248 140 274 136 C300 132 316 70 340 74 C364 78 346 136 372 134 ' +
  'C404 132 420 92 452 94 C488 96 500 128 536 122 C560 118 576 104 592 100';

export default function NotFound() {
  return (
    <>
      <div data-fun-root data-stage>
        <section className={styles.page} aria-labelledby="nf-title">
          <div className={styles.sign} data-drop aria-hidden="true">
            <svg className={styles.svg} viewBox="0 0 616 190" fill="none">
              <path className={styles.guide} d={STROKE} pathLength={100} />
              <path className={styles.ink} d={STROKE} pathLength={100} />
              <g className={styles.cross}>
                <path d="M26 174 L40 160 M26 160 L40 174" />
              </g>
              <path className={styles.line} d="M54 172 H600" pathLength={100} />
            </svg>
          </div>

          <div className={styles.copy} data-drop>
            <p className={styles.code}>404</p>
            <h1 id="nf-title" className={styles.title} data-split="chars" data-intro>
              This page was never signed.
            </h1>
            <p className={styles.text}>
              The address you followed exists only as a dotted line. Everything finished starts back at the signature.
            </p>
            <Link href="/" className={styles.cta} data-reveal="up" data-intro data-delay="0.4">
              <RollText>Back to the signature</RollText>
              <ArrowUpRight className={styles.arrow} aria-hidden="true" strokeWidth={1.25} />
            </Link>
          </div>
        </section>
      </div>

    </>
  );
}
