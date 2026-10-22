'use client';
import { site } from '@/data/site';
// The address as a mailto link plus a copy button. The confirmation is visible and announced
// (role="status"). If the Clipboard API is refused, the address is selected for a manual copy.
import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import styles from '../Contact.module.css';

const { label: COPY_LABEL, copied: COPIED, failed: FAILED } = site.contact.finale.copy;

type State = 'idle' | 'copied' | 'failed';

export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<State>('idle');
  const text = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    let next: State = 'copied';
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      next = 'failed';
      const sel = getSelection();
      if (sel && text.current) {
        const range = document.createRange();
        range.selectNodeContents(text.current);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    setState(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2600);
  }

  const Icon = state === 'copied' ? Check : Copy;

  return (
    <span className={styles.email} data-state={state}>
      <a className={`${styles.link} ${styles.emailLink}`} href={`mailto:${email}`}>
        <span ref={text} className={styles.linkText}>
          {email}
        </span>
      </a>
      <button type="button" className={styles.copyBtn} onClick={copy} aria-label={COPY_LABEL} title={COPY_LABEL}>
        <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <span className={styles.copyNote} role="status" aria-live="polite">
        {state === 'copied' ? COPIED : state === 'failed' ? FAILED : ''}
      </span>
    </span>
  );
}
