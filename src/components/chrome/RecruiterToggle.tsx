'use client';
// The persistent "Recruiter mode" button on the full site. One click: the page falls away and the
// recruiter view takes over (motion/recruiter.ts).
import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { site } from '@/data/site';
import { toRecruiter } from '@/motion/recruiter';
import { RollText } from './RollText';
import styles from './RecruiterToggle.module.css';

export function RecruiterToggle() {
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    await toRecruiter();
    setBusy(false);
    // Land keyboard users at the top of the recruiter view.
    document.querySelector<HTMLElement>('.recruiter-only[data-recruiter-root] [data-recruiter-focus]')?.focus();
  }

  return (
    <div className="fun-only">
      <button type="button" className={styles.toggle} onClick={go} disabled={busy} data-drop>
        <Briefcase aria-hidden="true" size={16} strokeWidth={1.5} />
        <span className={styles.label}>
          <RollText>{site.recruiter.toggle}</RollText>
        </span>
      </button>
    </div>
  );
}
