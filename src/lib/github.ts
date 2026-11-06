// "Now building": the most recently pushed public repo (not a fork, not this site), read at build
// time and revalidated daily (ISR, so the home route stays static). Any failure (network, rate limit,
// odd payload) returns null and the footer simply leaves the line out. Never fetched on the client.
import { getProjects } from '@/data/projects';
import { site } from '@/data/site';

export type NowBuilding = { name: string; href: string; date: string; dateTime: string };

type Repo = { name: string; html_url: string; fork: boolean; pushed_at: string | null; homepage?: string | null };

const USER = site.links.github.href.replace(/\/+$/, '').split('/').pop() ?? '';
const SELF = new URL(site.url).hostname.replace(/^www\./, '').toLowerCase(); // repos named after the site

export async function getNowBuilding(): Promise<NowBuilding | null> {
  if (!USER) return null;
  try {
    const res = await fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=10`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const repos = (await res.json()) as Repo[];
    if (!Array.isArray(repos)) return null;
    const isSelf = (r: Repo) => {
      const n = r.name.toLowerCase();
      return n.includes('portfolio') || n === SELF || n === `${USER.toLowerCase()}.github.io`;
    };
    const repo = repos
      .filter((r) => r && !r.fork && r.pushed_at && !isSelf(r))
      .sort((a, b) => Date.parse(b.pushed_at!) - Date.parse(a.pushed_at!))[0];
    if (!repo?.pushed_at) return null;

    const key = repo.name.toLowerCase();
    const project = getProjects().find(
      (p) => p.slug.toLowerCase() === key || p.links.repo?.replace(/\/+$/, '').split('/').pop()?.toLowerCase() === key,
    );
    const pushed = new Date(repo.pushed_at);
    if (Number.isNaN(pushed.getTime())) return null;
    return {
      name: project?.title ?? repo.name,
      href: project ? `/work/${project.slug}` : repo.html_url,
      // absolute, so a static page never goes stale ("Nov 3", plus the year when it is not this one)
      date: pushed.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        ...(pushed.getUTCFullYear() !== new Date().getUTCFullYear() ? { year: 'numeric' } : {}),
        timeZone: 'UTC',
      }),
      dateTime: pushed.toISOString(),
    };
  } catch {
    return null;
  }
}
