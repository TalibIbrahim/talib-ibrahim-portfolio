// The framed footer: the page's last screen. Server-rendered and complete without JS.
// A pen-blue frame on the desk with a tab cut into its top edge (the domain) and two tabs rising
// into its bottom corners (copyright, back to top). Inside: the closing statement with the signature
// written over it, the page links left, the elsewhere links right, the portrait at the bottom centre,
// and the stack split either side of it (client tools left, server tools right) around "Email me".
// Boundary 12 (frame lock): the panel arrives full bleed and settles into the frame as the section
// reaches the top; then the name rises and the signature writes over it (footer/FooterMotion.tsx).
// Reduced motion / no JS / Recruiter Mode: the same frame, everything in place, the signature drawn.
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { site } from '@/data/site';
import { getNowBuilding } from '@/lib/github';
import { RollText } from '@/components/chrome/RollText';
import { DOTS, SIGNATURE_VIEWBOX, STROKES } from './signature-paths';
import { BackToTop } from './footer/BackToTop';
import { RecruiterLink } from './footer/RecruiterLink';
import { FooterMotion } from './footer/FooterMotion';
import styles from './Footer.module.css';

const PHOTO = { src: '/headshot-cutout.png', width: 476, height: 820 };
const NIB = 'translate(5 1.4)'; // the broad-nib second pass, as in the hero

export async function Footer() {
  const { footer, links, email, name, contact, layers, workIndex, recruiter } = site;
  const [first, ...rest] = site.shortName.split(' ');
  const closing = [first, rest.join(' ')]; // the name, set like the printed name under a signature
  const now = await getNowBuilding();
  const pages = [
    ...footer.pages,
    { label: workIndex.homeLink, href: '/work' },
    { label: recruiter.toggle, href: '/recruiter' },
  ];
  const elsewhere = [links.github, links.linkedin];
  const [client, server] = layers.sides;
  const sig = { '--sig-ar': SIGNATURE_VIEWBOX.w / SIGNATURE_VIEWBOX.h } as CSSProperties;

  return (
    <footer className={styles.footer} aria-labelledby="footer-title" data-footer>
      <div className={styles.panel} data-panel>
        {/* the ground: small polka dots that drift and breathe while you move (footer/dots.ts) */}
        <canvas className={styles.bg} aria-hidden="true" data-bg />
        <div className={styles.statement} data-drop>
          <h2 id="footer-title" className={styles.title}>
            {closing.map((l) => (
              <span key={l} className={styles.mask}>
                <span className={styles.rise} data-rise>
                  {l}
                </span>
              </span>
            ))}
          </h2>
          <svg
            className={styles.sig}
            viewBox={`0 0 ${SIGNATURE_VIEWBOX.w} ${SIGNATURE_VIEWBOX.h}`}
            style={sig}
            aria-hidden="true"
            focusable="false"
            data-sig
          >
            {STROKES.map((s) => (
              <g key={s.id}>
                <path d={s.d} data-stroke />
                <path d={s.d} transform={NIB} data-nib />
              </g>
            ))}
            {DOTS.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={6} data-dot />
            ))}
          </svg>
        </div>

        <div className={styles.portrait} aria-hidden="true">
          <div className={styles.photo} data-portrait>
            <Image src={PHOTO.src} alt="" width={PHOTO.width} height={PHOTO.height} sizes="(max-width: 767px) 70vw, 36vh" />
          </div>
        </div>

        <nav className={styles.pages} aria-labelledby="footer-pages" data-drop>
          <p id="footer-pages" className={styles.label}>
            <span className={styles.slash} aria-hidden="true">
              {'// '}
            </span>
            {footer.pagesLabel}
          </p>
          <ul className={styles.list} role="list">
            {pages.map((p) => (
              <li key={p.href}>
                {p.href === '/recruiter' ? (
                  <RecruiterLink href={p.href} className={styles.page}>
                    <RollText>{p.label}</RollText>
                  </RecruiterLink>
                ) : (
                  <Link href={p.href} className={styles.page}>
                    <RollText>{p.label}</RollText>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.social} data-drop>
          <p id="footer-elsewhere" className={styles.label}>
            <span className={styles.slash} aria-hidden="true">
              {'// '}
            </span>
            {contact.finale.elsewhereLabel}
          </p>
          <ul className={styles.list} role="list" aria-labelledby="footer-elsewhere">
            {elsewhere.map((l) => (
              <li key={l.href}>
                <a className={styles.page} href={l.href} target="_blank" rel="noopener noreferrer">
                  <RollText>{l.label}</RollText>
                  <ArrowUpRight className={styles.out} aria-hidden="true" strokeWidth={1.5} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {now && (
          <p className={styles.now}>
            <span className={styles.slash}>{footer.nowBuilding}</span>{' '}
            {now.href.startsWith('/') ? (
              <Link href={now.href} className={styles.nowLink}>
                {now.name}
              </Link>
            ) : (
              <a href={now.href} className={styles.nowLink} target="_blank" rel="noopener noreferrer">
                {now.name}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            <span aria-hidden="true"> · </span>
            {footer.lastCommit} <time dateTime={now.dateTime}>{now.date}</time>
          </p>
        )}

        <p className={styles.colophon}>{contact.finale.colophon}</p>

        <ul className={`${styles.stack} ${styles.stackL}`} role="list" aria-label={`${footer.stackLabel}: ${client.layer}`}>
          <li className={styles.layer} aria-hidden="true">
            {`// ${client.layer}`}
          </li>
          {client.tools.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <a className={styles.cta} href={`mailto:${email}`} data-drop>
          <RollText>{contact.heading}</RollText>
          <ArrowUpRight className={styles.ctaIcon} aria-hidden="true" size={16} strokeWidth={1.75} />
        </a>

        <ul className={`${styles.stack} ${styles.stackR}`} role="list" aria-label={`${footer.stackLabel}: ${server.layer}`}>
          {server.tools.map((t) => (
            <li key={t}>{t}</li>
          ))}
          <li className={styles.layer} aria-hidden="true">
            {`// ${server.layer}`}
          </li>
        </ul>
      </div>

      <p className={styles.tab} aria-hidden="true">
        {links.site.label}
      </p>
      <div className={styles.band}>
        <p className={styles.copy}>
          <span aria-hidden="true">&copy;</span>
          <span className="sr-only">Copyright</span> {new Date().getFullYear()} {name}
        </p>
        <div className={styles.toTop}>
          <BackToTop label={contact.finale.backToTop} />
        </div>
      </div>

      <FooterMotion />
    </footer>
  );
}
