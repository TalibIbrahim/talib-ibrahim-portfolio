'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/data/site';
import { RollText } from './RollText';
import styles from './Header.module.css';

const NAV = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export function Header() {
  const pathname = usePathname();
  const onCase = pathname.startsWith('/work/');
  return (
    <header className={`${styles.header} fun-only`} data-drop>
      <Link href="/" className={styles.name} aria-current={pathname === '/' ? 'page' : undefined}>
        <RollText>{site.shortName}</RollText>
      </Link>
      <nav aria-label="Primary">
        <ul className={styles.nav}>
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.link}
                aria-current={onCase && item.label === 'Work' ? 'true' : undefined}
              >
                <RollText>{item.label}</RollText>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
