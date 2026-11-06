// Landing. Server-rendered: the base layout IS the first frame (portrait on its cream card, the giant
// name, role and a featured project), real HTML + an eager <img>, readable with no JS.
// html.motion: HeroMotion scrubs one timeline over a sticky stage:
//   1. the card lifts off the bottom edge and closes into a centred frame; the portrait drops into it
//   2. "Talib" and "Ibrahim" shrink into the heads of two marquee rows that run behind the card
//      ("Ibrahim" hands over to a pixel-mono row and decodes into the stack)
//   3. the portrait turns black and white while a tilted signature writes over the card; the header
//      reads "// MUHAMMAD TALIB IBRAHIM  SIGNED <hash>" (the hash is the real SHA-1 of the strokes)
//   4. the signed card grows to full bleed and becomes the paper the About section is printed on.
// Colour rule for the giant words (no blend modes): cream on the desk, desk-ink where a word crosses
// the cream card, cream again over the person. Three stacked copies: the h1 (cream), a copy clipped
// to the card (ink), a copy masked to the cut-out (cream). Only the h1 is in the accessibility tree.
// Every decorative copy (the copies, rows, header, end caption) draws its text from data-deco by CSS,
// so the server HTML's text reads the name, role and project once: clean for scrapers and ATS tools.
import { createHash } from 'node:crypto';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { site } from '@/data/site';
import { getFeatured, getProject } from '@/data/projects';
import { DOTS, SIGNATURE_VIEWBOX, STROKES } from './signature-paths';
import { HeroMotion } from './hero/HeroMotion';
import styles from './Hero.module.css';

const PHOTO = { src: '/headshot-cutout.png', mask: '/headshot-mask.png', width: 476, height: 820 };
/** The broad-nib second pass: the same stroke, offset, so downstrokes read heavier than hairlines. */
const NIB = 'translate(5 1.4)';

const first = site.shortName.split(' ')[0];
const last = site.name.split(' ').at(-1) ?? '';
const given = site.name.split(' ')[0];
const hash = createHash('sha1').update(STROKES.map((s) => s.d).join('|')).digest('hex').slice(0, 7);

/** Row text, from site.hero. The stack row is set lower-case. */
const nameRow = site.hero.nameRow ?? [];
const stackRow = (site.hero.stackRow ?? []).map((t) => t.toLowerCase());
const stackHead = stackRow[0] ?? '';
/** The pixel row's head starts as the surname and decodes into the first tool (equal width, mono). */
const width = Math.max(stackHead.length, last.length);
const headFrom = last.toLowerCase().padStart(width);
const headTo = stackHead.padStart(width);

function Word({ which, deco }: { which: 'first' | 'last'; deco?: boolean }) {
  const text = which === 'first' ? first : last;
  return (
    <span className={`${styles.word} ${which === 'first' ? styles.first : styles.last}`} data-word={which}>
      {deco ? (
        <span className={which === 'first' ? styles.rise : styles.drop} data-deco={text} />
      ) : (
        <span className={which === 'first' ? styles.rise : styles.drop}>{text}</span>
      )}
    </span>
  );
}

const chars = (s: string, cls?: string) =>
  [...s].map((c, i) => <span key={i} className={cls} data-ch data-deco={c} />);

export function Hero() {
  const project = (site.hero.featured && getProject(site.hero.featured)) || getFeatured()[0];
  const sig = {
    '--sig-w': SIGNATURE_VIEWBOX.w,
    '--sig-h': SIGNATURE_VIEWBOX.h,
  } as CSSProperties;

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-name" data-hero>
      <div className={styles.stage} data-hero-stage>
        <canvas className={styles.bg} aria-hidden="true" data-bg />

        <div className={styles.rows} aria-hidden="true" data-drop>
          <div className={`${styles.row} ${styles.rowName}`} data-row="name">
            <div className={styles.track} data-track>
              {[0, 1, 2].map((i) => (
                <span key={i} className={styles.copy} data-copy-n>
                  <span data-head={i === 1 ? 'name' : undefined} data-deco={first} />
                  {nameRow.map((t) => (
                    <span key={t}>
                      <i data-deco=" · " />
                      <span data-deco={t} />
                    </span>
                  ))}
                  <i data-deco=" · " />
                </span>
              ))}
            </div>
          </div>
          <div className={`${styles.row} ${styles.rowStack}`} data-row="stack">
            <div className={styles.track} data-track>
              {[0, 1, 2].map((i) => (
                <span key={i} className={styles.copy} data-copy-s>
                  {i === 2 ? (
                    // HeroMotion writes this head's text (it decodes); until then CSS draws data-deco
                    <span data-head="stack" data-from={headFrom} data-to={headTo} data-deco={headFrom} />
                  ) : (
                    <span data-deco={headTo} />
                  )}
                  {stackRow.slice(1).map((t) => (
                    <span key={t}>
                      <i data-deco=" / " />
                      <span data-deco={t} />
                    </span>
                  ))}
                  <i data-deco=" / " />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.card} data-card data-drop />

        <h1 id="hero-name" className={styles.name} data-drop>
          <span className={styles.given} data-given>
            {given}
          </span>{' '}
          <Word which="first" /> <Word which="last" />
        </h1>
        {/* the colour rule: ink where the name crosses the card */}
        <div className={`${styles.name} ${styles.inkCopy}`} aria-hidden="true" data-copy="card" data-drop>
          <Word which="first" deco />
          <Word which="last" deco />
        </div>

        <div className={styles.photoLayer} data-photo-layer data-drop>
          <div className={styles.photo} data-photo>
            <Image
              src={PHOTO.src}
              alt={`Portrait of ${site.name} in a dark suit`}
              width={PHOTO.width}
              height={PHOTO.height}
              sizes="(max-width: 767px) 86vw, 32vw"
              loading="eager"
              fetchPriority="high"
              className={styles.img}
            />
            {/* black and white while the signature writes: a static filter on a copy, crossfaded */}
            <Image
              src={PHOTO.src}
              alt=""
              aria-hidden="true"
              width={PHOTO.width}
              height={PHOTO.height}
              sizes="(max-width: 767px) 86vw, 32vw"
              className={`${styles.img} ${styles.bw}`}
              data-bw
            />
          </div>
        </div>
        {/* the colour rule: cream again over the person */}
        <div
          className={`${styles.name} ${styles.creamCopy}`}
          aria-hidden="true"
          data-copy="photo"
          data-drop
          style={{ '--mask': `url(${PHOTO.mask})` } as CSSProperties}
        >
          <Word which="first" deco />
          <Word which="last" deco />
        </div>

        <p className={styles.header} aria-hidden="true" data-header>
          <span className={styles.label}>
            <span className={styles.slash}>{chars('// ')}</span>
            <span data-core data-deco={given} />
            {chars(` ${first} ${last}`)}
          </span>
          <span className={styles.signed}>
            {chars('signed ')}
            <span className={styles.hash}>{chars(hash)}</span>
          </span>
        </p>

        <svg
          className={styles.sig}
          viewBox={`0 0 ${SIGNATURE_VIEWBOX.w} ${SIGNATURE_VIEWBOX.h}`}
          style={sig}
          aria-hidden="true"
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

        {/* first frame: the recruiter test (who, what, where, one piece of work) */}
        <div className={styles.meta} data-caption="start" data-drop>
          <p className={styles.role}>
            <span>{site.role}</span>
            <span>{site.location}</span>
          </p>
          {project && (
            <Link href={`/work/${project.slug}`} className={styles.work} data-transition-title={project.title}>
              <span className={styles.path}>
                work/{project.slug}
                <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.75} />
              </span>
              <span className={styles.tagline}>{project.tagline}</span>
            </Link>
          )}
        </div>
        <p className={styles.cue} aria-hidden="true" data-cue>
          Scroll <ArrowDown size={14} strokeWidth={1.5} />
        </p>

        {/* the signed card: one line under the frame, then the same project */}
        <div className={styles.end} data-caption="end">
          <p className={styles.endRole} aria-hidden="true" data-deco={`${site.role} · ${site.location}`} />
          {project && (
            <Link href={`/work/${project.slug}`} className={styles.work} data-transition-title={project.title}>
              <span className={styles.path}>
                work/{project.slug}
                <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.75} />
              </span>
              <span className={styles.tagline}>{project.tagline}</span>
            </Link>
          )}
        </div>
      </div>
      <HeroMotion />
    </section>
  );
}
