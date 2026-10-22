'use client';
// Recruiter Mode (home): the same facts as the full site, in the site's own type and palette, with
// no scroll theatre. A slider at the bottom sets how hard the page sells, after getcoleman.com:
//   3 Hard sell (default): everything     2 Firm: projects + roles, no bullet points
//   1 Soft: short bio, a few projects     0 Barely selling: one paragraph and an email address
// Server render = hard sell, so crawlers and no-JS visitors get every fact. The heading is a
// role="heading" div so the document keeps a single <h1> element (the full site's).
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import { site } from '@/data/site';
import { getProjects } from '@/data/projects';
import { useSell } from '@/lib/mode';
import { BackToFun } from './BackToFun';
import { SellSlider } from './SellSlider';
import styles from './Recruiter.module.css';

const bare = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
const fade = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

/** min = lowest sell level the section appears at. The same rule is mirrored in CSS on
 *  <html data-sell> (set before paint), so a stored level never flashes the hard-sell page first. */
function Section({ label, min, children }: { label: string; min: number; children: React.ReactNode }) {
  return (
    <motion.section {...fade} style={{ overflow: 'clip' }} data-min={min}>
      <div className={styles.section}>
        <h2 className={styles.label}>{label}</h2>
        <div className={styles.content}>{children}</div>
      </div>
    </motion.section>
  );
}

export function RecruiterHome() {
  const sell = useSell();
  const projects = getProjects();
  const shown = sell >= 2 ? projects : projects.slice(0, 3);
  const edu = site.education;

  return (
    <div className={`${styles.page} recruiter-only`} data-recruiter-root>
      <header className={styles.top}>
        <div>
          <p className={styles.kicker}>{site.recruiter.toggle}</p>
          <div role="heading" aria-level={1} tabIndex={-1} className={styles.name} data-recruiter-focus>
            {site.name}
          </div>
          <p className={styles.role}>
            {site.role}, {site.location}
          </p>
          <ul className={styles.contacts}>
            <li>
              <a className={`${styles.pill} ${styles.pillAccent}`} href={`mailto:${site.email}`}>
                <Mail aria-hidden="true" size={16} strokeWidth={1.5} />
                {site.email}
              </a>
            </li>
            {sell >= 1 &&
              [site.links.github, site.links.linkedin].map((l) => (
                <li key={l.href}>
                  <a className={styles.pill} href={l.href} target="_blank" rel="noreferrer">
                    {l.label}
                    <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.5} />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
          </ul>
        </div>
        <BackToFun />
      </header>

      <AnimatePresence initial={false}>
        {sell === 0 && (
          <Section key="brief" min={0} label="In short">
            <p className={styles.brief}>{site.recruiter.brief}</p>
          </Section>
        )}

        {sell >= 1 && (
          <Section key="about" min={1} label="About">
            {sell >= 2 && <p className={styles.lead}>{site.tagline}</p>}
            {(sell === 3 ? site.about : site.about.slice(0, 1)).map((p) => (
              <p key={p} className={styles.text}>
                {p}
              </p>
            ))}
          </Section>
        )}

        {sell >= 1 && (
          <Section key="work" min={1} label={sell >= 2 ? `Projects (${projects.length})` : 'Selected projects'}>
            {shown.map((p) => (
              <article key={p.slug} className={styles.item}>
                <div className={styles.itemHead}>
                  <h3 className={styles.itemTitle}>
                    <Link href={`/work/${p.slug}`} data-no-transition>
                      {p.title}
                    </Link>
                  </h3>
                  <span className={styles.meta}>
                    {p.kind}
                    {p.year !== null && ` / ${p.year}`}
                    {p.role && ` / ${p.role}`}
                  </span>
                </div>
                <p className={styles.text}>{sell === 3 ? p.summary : p.tagline}</p>
                {sell === 3 && (
                  <ul className={styles.points}>
                    {p.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
                {sell >= 2 && (
                  <ul className={styles.chips} aria-label={`${p.title} stack`}>
                    {p.stack.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                )}
                {sell >= 2 && (p.links.live || p.links.repo) && (
                  <p className={styles.links}>
                    {p.links.live && (
                      <a className={styles.link} href={p.links.live} target="_blank" rel="noreferrer">
                        Live: {bare(p.links.live)}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                    {p.links.repo && (
                      <a className={styles.link} href={p.links.repo} target="_blank" rel="noreferrer">
                        Code: {bare(p.links.repo)}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                  </p>
                )}
              </article>
            ))}
          </Section>
        )}

        {sell >= 2 && (
          <Section key="experience" min={2} label="Experience">
            {site.experience.map((e) => (
              <article key={e.org + e.start} className={styles.item}>
                <div className={styles.itemHead}>
                  <h3 className={styles.itemTitle}>
                    {e.role}, {e.org}
                  </h3>
                  <span className={styles.meta}>
                    {e.start} to {e.end} / {e.place}
                  </span>
                </div>
                {sell === 3 && (
                  <ul className={styles.points}>
                    {e.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </Section>
        )}

        {sell >= 1 && (
          <Section key="education" min={1} label="Education">
            {edu.map((e) => (
              <article key={e.school} className={styles.item}>
                <div className={styles.itemHead}>
                  <h3 className={styles.itemTitle}>
                    {e.degree}, {e.school}
                  </h3>
                  <span className={styles.meta}>
                    {e.start} to {e.end}
                    {e.gpa && ` / GPA ${e.gpa}`}
                  </span>
                </div>
              </article>
            ))}
          </Section>
        )}

        {sell >= 2 && (
          <Section key="stack" min={2} label="Stack">
            <div className={styles.groups}>
              {site.stack.map((g) => (
                <div key={g.name} className={styles.group}>
                  <h3 className={styles.groupName}>{g.name}</h3>
                  <ul className={styles.chips}>
                    {g.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        {sell === 3 && (
          <Section key="certs" min={3} label="Certifications">
            <ul className={styles.points}>
              {site.certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Section>
        )}

        {sell >= 1 && (
          <Section key="contact" min={1} label="Contact">
            <p className={styles.text}>{site.contact.body}</p>
          </Section>
        )}
      </AnimatePresence>

      <p className={styles.footer}>
        &copy; {new Date().getFullYear()} {site.name}
      </p>
      <SellSlider />
    </div>
  );
}
