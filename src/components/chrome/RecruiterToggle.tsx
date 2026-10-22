'use client';
// The persistent "Recruiter mode" button on the full site. The page falls away (motion/recruiter.ts),
// then /recruiter loads. It's a real link, so it also works without JS and can be opened in a new tab.
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase } from 'lucide-react';
import { site } from '@/data/site';
import { dropAway } from '@/motion/recruiter';
import { RollText } from './RollText';
import styles from './RecruiterToggle.module.css';

export function RecruiterToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  if (pathname.startsWith('/recruiter')) return null;

  return (
    <Link
      href="/recruiter"
      className={styles.toggle}
      data-no-transition
      data-drop
      aria-disabled={busy || undefined}
      onMouseEnter={() => router.prefetch('/recruiter')}
      onClick={async (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // new tab etc.
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        router.prefetch('/recruiter');
        await dropAway();
        router.push('/recruiter');
        setBusy(false);
      }}
    >
      <Briefcase aria-hidden="true" size={16} strokeWidth={1.5} />
      <span className={styles.label}>
        <RollText>{site.recruiter.toggle}</RollText>
      </span>
    </Link>
  );
}
