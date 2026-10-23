// Machine-readable views of the site for crawlers and AI agents: schema.org JSON-LD and the
// llms.txt markdown. Built from src/data only, so they can never say more than the pages do.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Project } from '@/data/types';
import { getProjects } from '@/data/projects';
import { site } from '@/data/site';

const PERSON_ID = `${site.url}/#person`;
const caseUrl = (p: Project) => `${site.url}/work/${p.slug}`;

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
    knowsAbout: site.stack.flatMap((g) => g.items),
    sameAs: [site.links.github.href, site.links.linkedin.href],
  };
}

export function projectLd(p: Project) {
  const links = [p.links.live, p.links.repo].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    headline: `${p.title}: ${p.kind}`,
    description: p.summary,
    genre: p.kind,
    url: caseUrl(p),
    image: p.media.poster.src,
    keywords: p.stack.join(', '),
    ...(p.year ? { dateCreated: String(p.year) } : {}),
    ...(links.length ? { sameAs: links } : {}),
    creator: { '@type': 'Person', '@id': PERSON_ID, name: site.name, url: site.url },
  };
}

/** Safe to inline in a <script type="application/ld+json">. */
export const ldScript = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');

async function caseBody(slug: string): Promise<string | null> {
  try {
    const src = await readFile(path.join(process.cwd(), 'src', 'content', 'projects', `${slug}.mdx`), 'utf8');
    // Demote the MDX `##` headings one level so they nest under the project's own heading.
    return src.trim().replace(/^(#+) /gm, '#$1 ');
  } catch {
    return null;
  }
}

function projectLinks(p: Project) {
  return [p.links.live && `Live: ${p.links.live}`, p.links.repo && `Code: ${p.links.repo}`].filter(Boolean);
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
    `- GitHub: ${site.links.github.href}`,
    `- LinkedIn: ${site.links.linkedin.href}`,
    '',
  );

  push('## Pages', '');
  push(`- [Home](${site.url}/): about, selected work, stack, experience and contact`);
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
    push(...p.highlights.map((h) => `- ${h}`), '');
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
