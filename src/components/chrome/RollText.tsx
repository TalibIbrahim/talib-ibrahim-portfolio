import { Fragment } from 'react';
import styles from './RollText.module.css';

/** Letter-roll hover for primary targets: the label slides up inside a clipped line and a copy
 *  rolls in from below. Per-letter inline-blocks would be read letter by letter, so assistive tech
 *  gets one plain copy (sr-only) and both animated lines are aria-hidden. */
function Letters({ text }: { text: string }) {
  return (
    <>
      {[...text].map((ch, i) =>
        ch === ' ' ? (
          <Fragment key={i}> </Fragment>
        ) : (
          <span key={i} className={styles.ch} style={{ '--i': i } as React.CSSProperties}>
            {ch}
          </span>
        ),
      )}
    </>
  );
}

export function RollText({ children }: { children: string }) {
  return (
    <span className={styles.roll}>
      <span className="sr-only">{children}</span>
      <span className={styles.line} aria-hidden="true">
        <Letters text={children} />
      </span>
      <span className={`${styles.line} ${styles.copy}`} aria-hidden="true">
        <Letters text={children} />
      </span>
    </span>
  );
}
