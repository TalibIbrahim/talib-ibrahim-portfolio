'use client';
// The persistent "Recruiter mode" button on the full site. The page falls away (motion/recruiter.ts),
// then /recruiter loads. It's a real link, so it also works without JS and can be opened in a new tab.
import { useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase } from 'lucide-react';
import { site } from '@/data/site';
import { dropAway } from '@/motion/recruiter';
import { usePage } from '@/engine/next';
import { RollText } from './RollText';
import styles from './RecruiterToggle.module.css';

export function RecruiterToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  // Never on top of content that needs the corner: hidden while the contact form is on screen, and on
  // phones while the landing is (its first screen already carries the role and a project).
  usePage(() => {
    const el = ref.current;
    if (!el) return;
    const zones: ScrollTrigger[] = [];
    const sync = () => {
      const on = zones.some((z) => z.isActive);
      if (on) el.dataset.hide = '';
      else delete el.dataset.hide;
    };
    const contact = document.getElementById('contact');
    if (contact) zones.push(ScrollTrigger.create({ trigger: contact, start: 'top 85%', end: 'bottom top', onToggle: sync }));
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    if (hero && matchMedia('(max-width: 767px)').matches)
      zones.push(ScrollTrigger.create({ trigger: hero, start: 'top bottom', end: 'bottom 85%', onToggle: sync }));
    sync();
    return () => {
      zones.forEach((z) => z.kill());
      delete el.dataset.hide;
    };
  });

  if (pathname.startsWith('/recruiter')) return null;

  return (
    <Link
      ref={ref}
      href="/recruiter"
      aria-label={site.recruiter.toggle}
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
