// Contact: the finale and the page footer. Server-rendered and complete without JS.
// Boundary 10 is a reveal from underneath: the Timeline sheet slides off while this section waits
// beneath it (ContactMotion holds it in place, scales it .92 -> 1 and lifts the dim).
// The finale is a sheet of paper you can write on (InkPad: pointer = draw anywhere, touch = the
// pad block), and the page ends the way a letter does: the owner signs it (ContactMotion).
import type { CSSProperties } from 'react';
import { ArrowUpRight, PenLine } from 'lucide-react';
import { site } from '@/data/site';
import { DOTS, NIB_OFFSETS, STROKES } from './signature-paths';
import { ContactForm } from './contact/ContactForm';
import { ContactMotion } from './contact/ContactMotion';
import { InkPad } from './contact/InkPad';
import { CopyEmail } from './contact/CopyEmail';
import { LocalTime } from './contact/LocalTime';
import { BackToTop } from './contact/BackToTop';
import styles from './Contact.module.css';

const FINALE_COPY = site.contact.finale;

// The signature's ink sits inside this box of the 1100 x 340 drawing.
const SIGN_VIEWBOX = '50 40 1020 260';

export function Contact() {
  const { contact, email, links, name, shortName, location } = site;
  const C = FINALE_COPY;
  const words = contact.heading.split(' ');
  let n = 0; // running character index for the hover stagger

  const elsewhere = [links.github, links.linkedin];
  const footerLinks = [
    { label: links.github.label, href: links.github.href, external: true },
    { label: links.linkedin.label, href: links.linkedin.href, external: true },
    { label: 'Email', href: `mailto:${email}`, external: false },
  ];

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title" data-contact>
      <div className={styles.under} data-under>
        <InkPad />

        <div className={styles.lead}>
          <p className={`${styles.hint} ${styles.hintPointer}`} aria-hidden="true">
            <PenLine size={14} strokeWidth={1.5} />
            <span>{C.inkLabel}</span>
            <span className={styles.hintSep} />
            <span>{C.inkHintPointer}</span>
          </p>

          <h2 id="contact-title" className={styles.heading} data-drop>
            <a className={styles.mail} href={`mailto:${email}`} data-mail>
              {/* Per-letter spans would be read letter by letter: one plain copy for assistive tech. */}
              <span className="sr-only">{contact.heading}</span>
              <span aria-hidden="true">
                {words.map((w, wi) => (
                  <span key={wi}>
                    <span className={styles.word}>
                      {[...w].map((ch) => {
                        const i = n++;
                        return (
                          <span key={i} className={styles.cm}>
                            <span className={styles.cr} data-char>
                              <span className={styles.cl} style={{ '--i': i } as CSSProperties}>
                                <span className={styles.ca}>{ch}</span>
                                <span className={styles.cb}>{ch}</span>
                              </span>
                            </span>
                          </span>
                        );
                      })}
                      {wi === words.length - 1 && (
                        <span className={`${styles.cm} ${styles.arrowMask}`}>
                          <span className={styles.cr} data-char>
                            <ArrowUpRight className={styles.arrow} strokeWidth={1.25} />
                          </span>
                        </span>
                      )}
                    </span>
                    {wi < words.length - 1 ? ' ' : null}
                  </span>
                ))}
                {/* The pen underline: wiped in with clip-path on hover / focus. */}
                <svg className={styles.pen} viewBox="0 0 1000 40" preserveAspectRatio="none">
                  <path d="M6 26 C 120 14 220 30 340 22 S 560 12 690 20 S 900 30 994 14" />
                </svg>
              </span>
            </a>
          </h2>

          <div className={styles.leadRow} data-drop>
            <p className={styles.body}>{contact.body}</p>

            <dl className={styles.details}>
              <div className={styles.detail}>
                <dt className={styles.dt}>{C.emailLabel}</dt>
                <dd className={styles.dd}>
                  <CopyEmail email={email} />
                </dd>
              </div>
              <div className={styles.detail}>
                <dt className={styles.dt}>{C.elsewhereLabel}</dt>
                <dd className={`${styles.dd} ${styles.ddLinks}`}>
                  {elsewhere.map((l) => (
                    <a key={l.label} className={styles.link} href={l.href} target="_blank" rel="noopener noreferrer">
                      <span className={styles.linkText}>{l.label}</span>
                      <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ))}
                </dd>
              </div>
              <div className={styles.detail}>
                <dt className={styles.dt}>{C.basedLabel}</dt>
                <dd className={styles.dd}>{location}</dd>
              </div>
              <div className={styles.detail}>
                <dt className={styles.dt}>{C.timeLabel}</dt>
                <dd className={styles.dd}>
                  <LocalTime timeZone={C.timeZone} zoneLabel={C.timeZoneLabel} city={location.split(',')[0]} />
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Touch devices: a bounded pad (touch-action: none) so drawing never fights page scroll. */}
        <div className={styles.pad} data-ink-pad aria-hidden="true">
          <span className={styles.padCorner} />
          <span className={styles.padCorner} />
          <span className={styles.padCorner} />
          <span className={styles.padCorner} />
          <p className={styles.padHint}>
            <PenLine size={14} strokeWidth={1.5} />
            <span>{C.inkLabel}</span>
          </p>
          <p className={styles.padSub}>{C.inkHintTouch}</p>
        </div>

        <div className={styles.write} data-drop>
          <div className={styles.writeHead}>
            <h3 className={styles.writeTitle}>{C.writeTitle}</h3>
            <p className={styles.writeNote}>{C.writeNote}</p>
          </div>
          <div className={styles.formCol} data-ink-off>
            <ContactForm />
          </div>
        </div>

        <footer className={styles.foot}>
          <div className={styles.signoff} data-drop>
            <p className={styles.signLabel}>
              <span>{C.signoffLabel}</span>
              <span className={styles.signNote}>{C.signoffNote}</span>
            </p>
            <svg
              className={styles.sign}
              viewBox={SIGN_VIEWBOX}
              role="img"
              aria-label={`Handwritten signature: ${shortName}`}
              data-sign
            >
              {NIB_OFFSETS.map(([dx, dy], i) => (
                <g key={i} transform={`translate(${dx} ${dy})`}>
                  {STROKES.map((s) => (
                    <path
                      key={s.id}
                      d={s.d}
                      data-stroke={s.id}
                      data-base={dx === 0 ? '1' : undefined}
                      pathLength={1}
                      className={styles.signStroke}
                    />
                  ))}
                </g>
              ))}
              {DOTS.map(([x, y]) => (
                <circle key={x} data-dot cx={x} cy={y} r="4.2" className={styles.signDot} />
              ))}
              <circle data-nib cx="0" cy="0" r="7" className={styles.signNib} />
            </svg>
          </div>

          <div className={styles.footRow} data-drop>
            <p className={styles.copy}>
              <span aria-hidden="true">&copy;</span>
              <span className="sr-only">Copyright</span> {new Date().getFullYear()} {name}
            </p>
            <ul className={styles.links} role="list">
              {footerLinks.map((l) => (
                <li key={l.label}>
                  <a
                    className={styles.link}
                    href={l.href}
                    {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <span className={styles.linkText}>{l.label}</span>
                    {l.external && <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />}
                    {l.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
            <div className={styles.topCol}>
              <BackToTop label={C.backToTop} />
            </div>
            <p className={styles.colophon}>{C.colophon}</p>
          </div>
        </footer>

        <div className={styles.dim} aria-hidden="true" data-dim />
      </div>

      <ContactMotion />
    </section>
  );
}
