// Machine-readable views of the site for crawlers and AI agents: schema.org JSON-LD and the
// llms.txt markdown. Built from src/data only, so they can never say more than the pages do.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { SourcedFact, Project } from '@/data/types';
import { coverOf, getProjects } from '@/data/projects';
import { site } from '@/data/site';

const PERSON_ID = `${site.url}/#person`;
const caseUrl = (p: Project) => `${site.url}/work/${p.slug}`;
const absolute = (src: string) => (src.startsWith('/') ? `${site.url}${src}` : src);

/** "About 40 users, grown organically through Reddit (self-reported)" */
const factLine = (m: SourcedFact) =>
  `${m.value ? `${m.value} ` : ''}${m.text} (${m.source.kind === 'owner' ? 'self-reported' : m.source.href})`;

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
/** "Apr 2026" / "July 2027 (expected)" -> "2026-04" / "2027-07"; anything else (e.g. "Present") -> undefined. */
const isoMonth = (d: string) => {
  const m = d.match(/^([A-Za-z]{3})[a-z]*\.? (\d{4})/);
  const i = m ? MONTHS.indexOf(m[1].toLowerCase()) : -1;
  return m && i >= 0 ? `${m[2]}-${String(i + 1).padStart(2, '0')}` : undefined;
};

export function personLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    alternateName: site.shortName,
    jobTitle: site.role,
    description: site.description,
    url: site.url,
    email: `mailto:${site.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Lahore', addressCountry: 'PK' },
    alumniOf: site.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
    hasCredential: site.education.map((e) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: e.degree,
      description: `${e.degree}, ${e.school}, ${e.start} to ${e.end}${e.gpa ? `, GPA ${e.gpa}` : ''}`,
      recognizedBy: { '@type': 'CollegeOrUniversity', name: e.school },
    })),
    // the schema.org Role pattern: each position with its dates (an endDate marks it as past)
    worksFor: site.experience.map((e) => ({
      '@type': 'EmployeeRole',
      roleName: e.role,
      startDate: isoMonth(e.start),
      endDate: isoMonth(e.end),
      worksFor: { '@type': 'Organization', name: e.org, address: e.place },
    })),
    hasOccupation: site.experience.map((e) => ({
      '@type': 'Occupation',
      name: e.role,
      description: `${e.role}, ${e.org}, ${e.start} to ${e.end}. ${e.points.join(' ')}`,
    })),
    knowsAbout: site.stack.flatMap((g) => g.items),
    sameAs: [site.links.github.href, site.links.linkedin.href],
  };
}

/** /work: every project as an ItemList, in display order. */
export function workLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: site.workIndex.title,
    description: site.workIndex.description,
    url: `${site.url}/work`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: getProjects().map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: caseUrl(p),
        name: p.title,
      })),
    },
  };
}

export function projectLd(p: Project) {
  const links = [p.links.live, p.links.repo].filter(Boolean);
  const cover = coverOf(p);
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    headline: `${p.title}: ${p.kind}`,
    description: p.summary,
    genre: p.kind,
    url: caseUrl(p),
    ...(cover ? { image: absolute(cover.src) } : {}),
    keywords: p.stack.join(', '),
    ...(p.year ? { dateCreated: String(p.year) } : {}),
    ...(links.length ? { sameAs: links } : {}),
    creator: { '@type': 'Person', '@id': PERSON_ID, name: site.name, url: site.url },
  };
}

/** A page's alternates: its canonical plus the markdown views, so every page links them in its head
 *  (a page that sets `alternates` replaces the layout's, so each one goes through this). */
export const alternates = (canonical: string) => ({
  canonical,
  types: {
    'text/markdown': [
      { url: '/llms.txt', title: 'llms.txt' },
      { url: '/llms-full.txt', title: 'Full text' },
    ],
  },
});

/** Safe to inline in a <script type="application/ld+json">. */
export const ldScript = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');

async function caseBody(slug: string): Promise<string | null> {
  try {
    const src = await readFile(path.join(process.cwd(), 'src', 'content', 'projects', `${slug}.mdx`), 'utf8');
    // Demote the MDX `##` headings one level so they nest under the project's own heading, and
    // drop <Facts /> (the project listing above the body already prints them from data).
    return src
      .trim()
      .replace(/^(#+) /gm, '#$1 ')
      .replace(/^<Facts\s*\/>\r?\n?/gm, '');
  } catch {
    return null;
  }
}

function projectLinks(p: Project) {
  return [p.links.live && `Live: ${p.links.live}`, p.links.repo && `Code: ${p.links.repo}`, p.links.client && `Client: ${p.links.client}`].filter(Boolean);
}

/** llms.txt (https://llmstxt.org): a summary with links. `full` inlines every case study. */
export async function llmsTxt({ full = false } = {}): Promise<string> {
  const out: string[] = [];
  const push = (...lines: string[]) => out.push(...lines);

  push(`# ${site.name}`, '', `> ${site.description}`, '');
  push(...site.about.flatMap((para) => [para, '']));
  push(
    `- Role: ${site.role}`,
    `- Location: ${site.location}`,
    `- Email: ${site.email}`,
    `- Contact form: ${site.url}/#contact`,
    `- GitHub: ${site.links.github.href}`,
    `- LinkedIn: ${site.links.linkedin.href}`,
    '',
  );

  push('## Pages', '');
  push(`- [Home](${site.url}/): about, selected work, stack, experience and contact`);
  push(`- [${site.workIndex.title}](${site.url}/work): every project with its stack, year and links`);
  push(`- [Recruiter mode](${site.url}/recruiter): projects, experience, education and stack on one page`);
  if (!full) push(`- [Full text](${site.url}/llms-full.txt): this file with every case study inlined`);
  push('');

  push('## Projects', '');
  for (const p of getProjects()) {
    if (!full) {
      push(`- [${p.title}](${caseUrl(p)}): ${p.kind}. ${p.summary}`);
      continue;
    }
    push(`### ${p.title}`, '', `${p.kind}. ${p.summary}`, '');
    if (p.role) push(`- Role: ${p.role}`);
    if (p.year) push(`- Year: ${p.year}`);
    push(`- Stack: ${p.stack.join(', ')}`, `- Case study: ${caseUrl(p)}`, ...projectLinks(p).map((l) => `- ${l}`), '');
    push(...p.highlights.map((h) => `- ${h}`), ...(p.facts ?? []).map((m) => `- ${factLine(m)}`), '');
    const body = await caseBody(p.slug);
    if (body) push(body, '');
  }
  if (!full) push('');

  push('## Experience', '');
  for (const e of site.experience) {
    push(`- ${e.role}, ${e.org} (${e.place}), ${e.start} to ${e.end}`);
    if (full) push(...e.points.map((pt) => `  - ${pt}`));
  }
  push('');

  push('## Education', '');
  for (const e of site.education) {
    push(`- ${e.degree}, ${e.school}, ${e.start} to ${e.end}${e.gpa ? `, GPA ${e.gpa}` : ''}`);
  }
  push('');

  push('## Stack', '');
  push(...site.stack.map((g) => `- ${g.name}: ${g.items.join(', ')}`), '');

  if (full) push('## Certifications', '', ...site.certifications.map((c) => `- ${c}`), '');

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}
