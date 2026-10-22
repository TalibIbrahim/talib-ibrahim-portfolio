'use client';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { site } from '@/data/site';
import { toFun } from '@/motion/recruiter';
import styles from './Recruiter.module.css';

/** Leaves Recruiter Mode: the full site (and its scroll story) rises back into place. */
export function BackToFun() {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className={`${styles.pill} ${styles.back}`}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await toFun();
        setBusy(false);
        document.getElementById('main')?.focus();
      }}
    >
      <Sparkles aria-hidden="true" size={16} strokeWidth={1.5} />
      {site.recruiter.back}
    </button>
  );
}
