'use client';
// Site header: two frosted chips (name, nav) that stay legible over the desk, the paper and the
// reels. A highlight pill glides to the hovered/focused link; an accent dot marks the section in view.
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/data/site';
import { RollText } from './RollText';
import styles from './Header.module.css';

const NAV = [
  { label: 'Work', href: '/#work', id: 'work' },
  { label: 'About', href: '/#about', id: 'about' },
  { label: 'Contact', href: '/#contact', id: 'contact' },
];

export function Header() {
  const pathname = usePathname();
  const onCase = pathname.startsWith('/work/');
  const [active, setActive] = useState<string | null>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  // Which section is in view (home only).
  useEffect(() => {
    if (pathname !== '/') return;
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const seen = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        let best: string | null = null;
        let max = 0;
        seen.forEach((r, id) => {
          if (r > max) { max = r; best = id; }
        });
        setActive(max > 0 ? best : null);
      },
      { threshold: [0, 0.15, 0.35, 0.6] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  if (pathname.startsWith('/recruiter')) return null;

  const current = onCase ? 'work' : active;

  // Moves the highlight pill under a link (pointer or keyboard focus).
  const point = (el: HTMLElement | null) => {
    const pill = pillRef.current;
    if (!pill) return;
    if (!el) {
      pill.style.opacity = '0';
      return;
    }
    pill.style.opacity = '1';
    pill.style.setProperty('--x', `${el.offsetLeft}px`);
    pill.style.setProperty('--w', `${el.offsetWidth}px`);
  };

  return (
    <header className={styles.header} data-drop>
      <Link href="/" className={`${styles.chip} ${styles.name}`} aria-current={pathname === '/' ? 'page' : undefined}>
        <RollText>{site.shortName}</RollText>
      </Link>
      <nav aria-label="Primary" className={`${styles.chip} ${styles.track}`} onPointerLeave={() => point(null)}>
        <span ref={pillRef} className={styles.pill} aria-hidden="true" />
        <ul className={styles.nav}>
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.link}
                aria-current={current === item.id ? 'true' : undefined}
                onPointerEnter={(e) => point(e.currentTarget)}
                onFocus={(e) => point(e.currentTarget)}
                onBlur={() => point(null)}
              >
                <span className={styles.dot} aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
