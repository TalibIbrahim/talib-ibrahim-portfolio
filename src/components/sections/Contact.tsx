// Contact: the finale and the page footer. Server-rendered and complete without JS.
// Boundary 10 is a reveal from underneath: the Timeline sheet slides off while this section waits
// beneath it (ContactMotion holds it in place, scales it .92 -> 1 and lifts the dim).
import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { site } from '@/data/site';
import { ContactForm } from './contact/ContactForm';
import { ContactMotion } from './contact/ContactMotion';
import styles from './Contact.module.css';

const COLOPHON = 'Set in Boska and Azeret Mono. Built with Next.js, GSAP and Lenis.';

export function Contact() {
  const { contact, email, links, name } = site;
  const words = contact.heading.split(' ');
  let n = 0; // running character index for the roll stagger

  const footerLinks = [
    { label: links.github.label, href: links.github.href, external: true },
    { label: links.linkedin.label, href: links.linkedin.href, external: true },
    { label: 'Email', href: `mailto:${email}`, external: false },
  ];

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title" data-contact>
      <div className={styles.under} data-under>
        <div className={styles.lead}>
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
                            <span className={styles.ca} style={{ '--i': i } as CSSProperties}>
                              {ch}
                            </span>
                            <span className={styles.cb} style={{ '--i': i } as CSSProperties} aria-hidden="true">
                              {ch}
                            </span>
                          </span>
                        </span>
                      );
                    })}
                    {wi === words.length - 1 && (
                      <span className={`${styles.cm} ${styles.arrowMask}`} aria-hidden="true">
                        <span className={styles.cr} data-char>
                          <ArrowUpRight className={styles.arrow} strokeWidth={1.25} />
                        </span>
                      </span>
                    )}
                  </span>
                  {wi < words.length - 1 ? ' ' : null}
                </span>
              ))}
              </span>
            </a>
          </h2>

          <div className={styles.leadRow} data-drop>
            <p className={styles.body}>{contact.body}</p>
            <p className={styles.address}>
              <span className={styles.addressLabel}>Inbox</span>
              <span className={styles.addressValue}>{email}</span>
            </p>
          </div>
        </div>

        <div className={styles.write}>
          <div className={styles.writeHead} data-drop>
            <h3 className={styles.writeTitle}>Or write it here</h3>
            <p className={styles.writeNote}>Every field except the subject is required.</p>
          </div>
          <div className={styles.formCol} data-drop>
            <ContactForm />
          </div>
        </div>

        <footer className={styles.foot} data-drop>
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
          <p className={styles.colophon}>{COLOPHON}</p>
        </footer>

        <div className={styles.dim} aria-hidden="true" data-dim />
      </div>

      <ContactMotion />
    </section>
  );
}
