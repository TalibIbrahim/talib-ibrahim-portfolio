import type { MetadataRoute } from 'next';
import { getProjects } from '@/data/projects';
import { site } from '@/data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/recruiter`, changeFrequency: 'monthly', priority: 0.8 },
    ...getProjects().map((p) => ({
      url: `${site.url}/work/${p.slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
