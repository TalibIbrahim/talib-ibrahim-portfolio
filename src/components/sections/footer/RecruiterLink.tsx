'use client';
// The footer's way into Recruiter Mode: the same exit as the fixed toggle (the page falls away, then
// /recruiter loads). A real link, so it works without JS and opens in a new tab.
import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dropAway } from '@/motion/recruiter';

export function RecruiterLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <Link
      href={href}
      className={className}
      data-no-transition
      aria-disabled={busy || undefined}
      onMouseEnter={() => router.prefetch(href)}
      onClick={async (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        await dropAway();
        router.push(href);
        setBusy(false);
      }}
    >
      {children}
    </Link>
  );
}
