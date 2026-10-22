// Server-only: compiles src/content/projects/<slug>.mdx at build time (routes are fully static).
// Not importing 'server-only' because the package is not installed; node:fs keeps this off the client anyway.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ComponentType } from 'react';
import * as runtime from 'react/jsx-runtime';
import { evaluate } from '@mdx-js/mdx';
import type { MDXComponents } from 'mdx/types';

export type CaseStudyBody = ComponentType<{ components?: MDXComponents }>;

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'projects');
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Returns the compiled case-study body for `slug`, or null when there is no MDX file. */
export async function loadCaseStudy(slug: string): Promise<CaseStudyBody | null> {
  if (!SLUG_RE.test(slug)) return null;

  let source: string;
  try {
    source = await readFile(path.join(CONTENT_DIR, `${slug}.mdx`), 'utf8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }

  const mod = await evaluate(source, {
    ...runtime,
    baseUrl: import.meta.url,
  });
  return mod.default as CaseStudyBody;
}
