import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { site } from '@/data/site';
import type { Project } from '@/data/types';
import type { CaseStudyBody } from '@/lib/mdx';
import { BackToFun } from './BackToFun';
import styles from './Recruiter.module.css';

// Recruiter Mode case study: the facts in the site's type and palette, no scroll theatre.
// Rendered next to the full case study; CSS shows one. role="heading" keeps a single <h1>.
export function RecruiterCase({ project: p, next, Body }: { project: Project; next: Project; Body: CaseStudyBody | null }) {
  const bare = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const meta = [p.kind, p.role, p.year !== null ? String(p.year) : null].filter(Boolean).join(' / ');
  return (
    <div className={`${styles.page} recruiter-only`} data-recruiter-root>
      <header className={styles.top}>
        <div>
          <p className={styles.kicker}>
            <Link href="/" className={styles.link} data-no-transition>
              <ArrowLeft aria-hidden="true" size={12} strokeWidth={1.5} style={{ display: 'inline', verticalAlign: '-1px' }} /> All
              projects
            </Link>
          </p>
          <div role="heading" aria-level={1} tabIndex={-1} className={styles.name} data-recruiter-focus>
            {p.title}
          </div>
          <p className={styles.role}>{p.tagline}</p>
          {(p.links.live || p.links.repo) && (
            <ul className={styles.contacts}>
              {p.links.live && (
                <li>
                  <a className={`${styles.pill} ${styles.pillAccent}`} href={p.links.live} target="_blank" rel="noreferrer">
                    {bare(p.links.live)}
                    <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.5} />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              )}
              {p.links.repo && (
                <li>
                  <a className={styles.pill} href={p.links.repo} target="_blank" rel="noreferrer">
                    Code on GitHub
                    <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.5} />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
        <BackToFun />
      </header>

      <section className={styles.section}>
        <h2 className={styles.label}>Overview</h2>
        <div className={styles.content}>
          <p className={styles.meta}>{meta}</p>
          {Body ? (
            <div className={styles.prose}>
              <Body />
            </div>
          ) : (
            <p className={styles.text}>{p.summary}</p>
          )}
        </div>
      </section>

      {!Body && (
        <section className={styles.section}>
          <h2 className={styles.label}>Highlights</h2>
          <div className={styles.content}>
            <ul className={styles.points}>
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.label}>Stack</h2>
        <div className={styles.content}>
          <ul className={styles.chips}>
            {p.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>Next project</h2>
        <div className={styles.content}>
          <article className={styles.item}>
            <h3 className={styles.itemTitle}>
              <Link href={`/work/${next.slug}`} data-no-transition>
                {next.title}
              </Link>
            </h3>
            <p className={styles.text}>{next.tagline}</p>
          </article>
        </div>
      </section>

      <p className={styles.footer}>
        &copy; {new Date().getFullYear()} {site.name}. Email{' '}
        <a className={styles.link} href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </p>
    </div>
  );
}
