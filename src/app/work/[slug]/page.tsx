import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudy } from '@/components/case/CaseStudy';
import { getNext, getProject, getProjects } from '@/data/projects';
import { site } from '@/data/site';
import { loadCaseStudy } from '@/lib/mdx';

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProject(slug);
  if (!p) return {};

  const poster = p.media.poster;
  const path = `/work/${p.slug}`;
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: `${site.url}${path}`,
      siteName: site.name,
      title: `${p.title}: ${p.kind}`,
      description: p.summary,
      images: [{ url: poster.src, width: poster.width, height: poster.height, alt: poster.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${p.title}: ${p.kind}`,
      description: p.summary,
      images: [poster.src],
    },
  };
}

export default async function WorkPage(props: PageProps<'/work/[slug]'>) {
  const { slug } = await props.params;
  const p = getProject(slug);
  if (!p) notFound();

  const next = getNext(p.slug);
  const Body = await loadCaseStudy(p.slug);
  return (
    <>
      <CaseStudy project={p} next={next} Body={Body} />
    </>
  );
}
