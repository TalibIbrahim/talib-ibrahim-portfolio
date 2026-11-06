// All projects: every entry in src/data/projects.ts, featured first. Static server component.
// Each row is a two-column spread: the text hangs from col 1, the cover takes the right ~55%.
// The cover is also a link to the case study (named, out of the tab order: the title link is the stop); hover or focus anywhere in the row
// draws the title's underline in and lets the cover settle from 1.04 to 1 inside its frame.
// Projects without a cover get a typographic plate (title + kind) on the same frame.
// Numbering is the project's position in getProjects(), the same scheme as the case pages.
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/types";
import { coverOf, getFeatured, getProjects, getRest } from "@/data/projects";
import { site } from "@/data/site";
import { alternates, ldScript, workLd } from "@/lib/agents";
import styles from "./page.module.css";

const copy = site.workIndex;
const og = site.ogImage;

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: alternates('/work'),
  openGraph: {
    type: "website",
    url: `${site.url}/work`,
    siteName: site.name,
    title: `${copy.title} | ${site.name}`,
    description: copy.description,
    images: [{ url: og.src, width: og.width, height: og.height, alt: og.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${copy.title} | ${site.name}`,
    description: copy.description,
    images: [og.src],
  },
};

const pad = (n: number) => String(n).padStart(2, "0");

function ProjectRow({
  p,
  n,
  total,
  eager,
}: {
  p: Project;
  n: number;
  total: number;
  eager: boolean;
}) {
  const id = `project-${p.slug}`;
  const cover = coverOf(p);
  const focus = p.media?.focus;
  return (
    <li className={styles.row}>
      <article aria-labelledby={id} className={styles.card}>
        <Link
          href={`/work/${p.slug}`}
          className={styles.cover}
          tabIndex={-1}
          aria-label={`${copy.caseStudy}: ${p.title}`}
          data-cursor="view"
          data-cursor-label={copy.caseStudy}
        >
          {cover ? (
            <Image
              className={styles.img}
              src={cover.src}
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, 55vw"
              loading={eager ? "eager" : "lazy"}
              style={
                focus
                  ? { objectPosition: `${focus.x * 100}% ${focus.y * 100}%` }
                  : undefined
              }
            />
          ) : (
            <span className={styles.plate}>
              <span className={styles.plateTitle}>{p.title}</span>
              <span className={styles.plateKind}>{p.kind}</span>
            </span>
          )}
        </Link>
        <div className={styles.body}>
          <p className={styles.index}>
            {pad(n)} / {pad(total)}
          </p>
          <h3 id={id} className={styles.title}>
            <Link href={`/work/${p.slug}`} className={styles.titleLink}>
              <span className={styles.titleText}>{p.title}</span>
              <ArrowUpRight
                className={styles.arrow}
                aria-hidden="true"
                strokeWidth={1.5}
              />
            </Link>
          </h3>
          <p className={styles.meta}>
            {p.kind}
            {p.year !== null && <> · {p.year}</>}
          </p>
          <p className={styles.tagline}>{p.tagline}</p>
          <ul className={styles.stack} aria-label={`${p.title} stack`}>
            {p.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <ul className={styles.links}>
            <li>
              <Link
                href={`/work/${p.slug}`}
                aria-label={`${copy.caseStudy}: ${p.title}`}
              >
                {copy.caseStudy}
                <ArrowRight className={styles.linkArrow} size={14} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </li>
            {p.links.live && (
              <li>
                <a
                  href={p.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {copy.live}
                  <span className="sr-only">
                    : {p.title} (opens in a new tab)
                  </span>
                </a>
              </li>
            )}
            {p.links.repo && (
              <li>
                <a
                  href={p.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {copy.repo}
                  <span className="sr-only">
                    : {p.title} (opens in a new tab)
                  </span>
                </a>
              </li>
            )}
            {p.links.client && (
              <li>
                <a
                  href={p.links.client}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {copy.client}
                  <span className="sr-only">
                    : {p.title} (opens in a new tab)
                  </span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </article>
    </li>
  );
}

export default function WorkIndexPage() {
  const groups = [
    { id: "featured", heading: copy.featuredHeading, items: getFeatured() },
    { id: "more", heading: copy.restHeading, items: getRest() },
  ].filter((g) => g.items.length);
  const all = getProjects();

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.h1}>{copy.title}</h1>
        <p className={styles.intro}>{copy.intro}</p>
      </header>
      {groups.map((g) => (
        <section
          key={g.id}
          className={styles.group}
          aria-labelledby={`work-${g.id}`}
        >
          <h2 id={`work-${g.id}`} className={styles.h2}>
            {g.heading}
          </h2>
          <ol className={styles.list}>
            {g.items.map((p) => {
              const n = all.indexOf(p) + 1;
              return (
                <ProjectRow
                  key={p.slug}
                  p={p}
                  n={n}
                  total={all.length}
                  eager={n === 1}
                />
              );
            })}
          </ol>
        </section>
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldScript(workLd()) }}
      />
    </div>
  );
}
