// Case study (fun tree). Server component: everything is real HTML, motion comes from the engine's
// data attributes (intro: title chars, meta, hero scale; scroll: body lines, finale frame).
// Layers that GSAP transforms ([data-reveal], [data-parallax], split lines) never carry data-drop;
// the Recruiter Mode furniture is always the plain wrapper around them.
import type { ComponentPropsWithoutRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { MDXComponents } from 'mdx/types';
import type { Project } from '@/data/types';
import { getProjects } from '@/data/projects';
import type { CaseStudyBody } from '@/lib/mdx';
import { RollText } from '@/components/chrome/RollText';
import { CaseVideo } from './CaseVideo';
import styles from './CaseStudy.module.css';

// Interface labels (not project content; project copy comes from src/data and the MDX file).
const UI = {
  kind: 'Kind',
  role: 'Role',
  year: 'Year',
  stack: 'Stack',
  live: 'Visit the live site',
  repo: 'Read the code',
  newTab: '(opens in a new tab)',
  highlights: 'Highlights',
  next: 'Next project',
};

type Props = {
  project: Project;
  next: Project;
  Body: CaseStudyBody | null;
};

const pad = (n: number) => String(n).padStart(2, '0');

function BodyLink({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  const external = /^https?:\/\//.test(href);
  if (!external && href.startsWith('/')) {
    return (
      <Link href={href} className={styles.inlineLink} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={styles.inlineLink}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
      {external && <span className="sr-only"> {UI.newTab}</span>}
    </a>
  );
}

const mdx: MDXComponents = {
  h2: (props) => <h2 className={styles.h2} data-split="lines" {...props} />,
  h3: (props) => <h3 className={styles.h3} data-split="lines" {...props} />,
  p: (props) => <p className={styles.p} data-split="lines" {...props} />,
  ul: (props) => <ul className={styles.ul} data-reveal="up" {...props} />,
  ol: (props) => <ol className={`${styles.ul} ${styles.ol}`} data-reveal="up" {...props} />,
  li: (props) => <li className={styles.li} {...props} />,
  a: BodyLink,
  code: (props) => <code className={styles.code} {...props} />,
  strong: (props) => <strong className={styles.strong} {...props} />,
};

export function CaseStudy({ project: p, next, Body }: Props) {
  const list = getProjects();
  const index = list.findIndex((x) => x.slug === p.slug);
  const nextIndex = list.findIndex((x) => x.slug === next.slug);
  const total = list.length;
  const { media } = p;
  const poster = media.poster;
  const hasLinks = Boolean(p.links.live || p.links.repo);

  return (
    <div className="fun-only" data-fun-root data-stage>
      <article className={styles.page} aria-labelledby="case-title">
        <header className={styles.head} data-drop>
          <p className={styles.eyebrow}>
            <span className={styles.index}>
              {pad(index + 1)} / {pad(total)}
            </span>
          </p>
          <h1 id="case-title" className={styles.title} data-split="chars" data-intro>
            {p.title}
          </h1>
          <p className={styles.tagline} data-split="lines" data-intro data-delay="0.15">
            {p.tagline}
          </p>
        </header>

        <div className={styles.facts} data-drop>
          <dl className={styles.meta} data-reveal="up" data-intro data-delay="0.2">
            <div className={styles.metaItem}>
              <dt>{UI.kind}</dt>
              <dd>{p.kind}</dd>
            </div>
            {p.role && (
              <div className={styles.metaItem}>
                <dt>{UI.role}</dt>
                <dd>{p.role}</dd>
              </div>
            )}
            {p.year !== null && (
              <div className={styles.metaItem}>
                <dt>{UI.year}</dt>
                <dd>{p.year}</dd>
              </div>
            )}
            <div className={`${styles.metaItem} ${styles.metaStack}`}>
              <dt>{UI.stack}</dt>
              <dd>
                <ul className={styles.stackList}>
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          {hasLinks && (
            <ul className={styles.ctas} data-reveal="up" data-intro data-delay="0.3">
              {p.links.live && (
                <li>
                  <a className={styles.cta} href={p.links.live} target="_blank" rel="noopener noreferrer">
                    <RollText>{UI.live}</RollText>
                    <span className="sr-only"> {UI.newTab}</span>
                    <ArrowUpRight className={styles.ctaArrow} aria-hidden="true" strokeWidth={1.25} />
                  </a>
                </li>
              )}
              {p.links.repo && (
                <li>
                  <a className={styles.cta} href={p.links.repo} target="_blank" rel="noopener noreferrer">
                    <RollText>{UI.repo}</RollText>
                    <span className="sr-only"> {UI.newTab}</span>
                    <ArrowUpRight className={styles.ctaArrow} aria-hidden="true" strokeWidth={1.25} />
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>

        <figure className={styles.hero} data-drop>
          <div className={styles.heroFrame}>{/* no hidden-until-revealed: this image is the LCP */}
            <div className={styles.heroMedia} data-parallax="0.04">
              {media.kind === 'video' ? (
                <CaseVideo className={styles.heroImg} src={media.src} poster={poster} />
              ) : (
                <Image
                  className={styles.heroImg}
                  src={poster.src}
                  alt={poster.alt}
                  fill
                  sizes="100vw"
                  loading="eager"
                  fetchPriority="high"
                />
              )}
            </div>
          </div>
        </figure>

        <div className={styles.body} data-drop>
          {!Body && (
            <p className={styles.lede} data-split="lines">
              {p.summary}
            </p>
          )}
          {Body ? (
            <Body components={mdx} />
          ) : (
            <>
              <h2 className={styles.h2} data-split="lines">
                {UI.highlights}
              </h2>
              <ul className={styles.ul} data-reveal="up">
                {p.highlights.map((h) => (
                  <li key={h} className={styles.li}>
                    {h}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <nav className={styles.next} aria-label={UI.next} data-drop>
          <Link
            href={`/work/${next.slug}`}
            className={styles.nextLink}
            data-cursor="view"
            data-cursor-label="Next"
          >
            <span className={styles.nextLabel}>
              <span className={styles.index}>
                {pad(nextIndex + 1)} / {pad(total)}
              </span>
              <span>{UI.next}</span>
            </span>
            <span className={styles.nextTitle}>
              <span className={styles.nextTitleText}>{next.title}</span>
              <ArrowUpRight className={styles.nextArrow} aria-hidden="true" strokeWidth={1.1} />
            </span>
            <span className={styles.nextFrame} aria-hidden="true">
              <span className={styles.nextMedia}>
                <span className={styles.nextPoster} data-parallax="0.06">
                  <Image
                    className={styles.nextImg}
                    src={next.media.poster.src}
                    alt=""
                    fill
                    sizes="100vw"
                  />
                </span>
              </span>
            </span>
          </Link>
        </nav>
      </article>
    </div>
  );
}
