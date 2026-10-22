import type { Project } from './types';

/*
 * How to add a project
 * --------------------
 * 1. Add ONE entry to the `projects` array below. `slug` becomes the URL (/work/<slug>)
 *    and the MDX filename. Keep `role` and `year` null unless they are actually known.
 * 2. Put media in public/work/<slug>/ (or use a remote URL from an allowed host in
 *    next.config.ts). Always give the poster its real pixel width/height and a descriptive alt.
 * 3. Optional: write src/content/projects/<slug>.mdx (plain markdown, `##` headings) for the
 *    case-study body. Without it the case page still renders from the fields here.
 * The showreel, case route, sitemap, Recruiter Mode list and metadata all map over this array,
 * so nothing else needs to change.
 */

const CDN = 'https://res.cloudinary.com/dk5pnej6r/image/upload';

export const projects: Project[] = [
  {
    slug: 'byters',
    title: 'Byters',
    tagline: 'Rate restaurants, write reviews, decide together.',
    summary:
      'A full-stack review platform where users rate restaurants, write reviews, and manage dynamic profiles with secure authentication.',
    kind: 'Food review platform',
    role: null,
    year: null,
    stack: ['Next.js', 'MongoDB', 'Redux', 'Tailwind CSS', 'Vercel'],
    highlights: [
      'Implemented AI-powered restaurant discovery using vector embeddings.',
      'Engineered a group decision feature to facilitate collaborative choices.',
    ],
    links: { live: 'https://byters.vercel.app/' },
    media: {
      kind: 'poster',
      motion: 'pan',
      poster: {
        src: `${CDN}/v1776194008/Radix%20Systems/cfaca28d-245a-47d2-b658-879a9d8d3c4c.png`,
        alt: 'Byters home page: a restaurant search bar over a dark close-up of a grilled sandwich, above a filterable grid of restaurant cards with ratings, price levels and locations.',
        width: 1665,
        height: 896,
      },
    },
    featured: true,
  },
  {
    slug: 'quickdrop',
    title: 'QuickDrop',
    tagline: 'Privacy-first, peer-to-peer file sharing.',
    summary:
      'Privacy-first file sharing with peer-to-peer transfer using WebRTC, featuring auto-deletion, lossless uploads, and QR code device pairing.',
    kind: 'P2P file sharing',
    role: null,
    year: null,
    stack: ['React.js', 'MongoDB', 'Cloudinary', 'Socket.IO', 'PeerJS'],
    highlights: [
      'Built P2P file sharing architecture utilizing TURN/open relay servers.',
      'Implemented strict auto-deletion logic to ensure user privacy and security.',
    ],
    links: { live: 'https://quickdrop-file.vercel.app/' },
    media: {
      kind: 'poster',
      motion: 'zoom',
      poster: {
        src: `${CDN}/v1776193606/Radix%20Systems/b37e4ed6-e19b-4811-8c42-2a645463ec5b.png`,
        alt: 'QuickDrop landing page: the QuickDrop wordmark with a paper plane logo over a blue and violet light wave, with Upload File and Download File buttons below.',
        width: 1668,
        height: 888,
      },
    },
    featured: true,
  },
  {
    slug: 'gitchat',
    title: 'GitChat',
    tagline: 'A RAG-powered assistant for GitHub repositories.',
    summary:
      'A RAG-powered assistant that streams AI reasoning from local LLMs, with MongoDB Atlas Vector Search for semantic retrieval of GitHub repositories.',
    kind: 'AI codebase assistant',
    role: null,
    year: null,
    stack: ['Next.js', 'Vercel AI SDK', 'LangChain', 'MongoDB', 'Ollama'],
    highlights: [
      'Constructed a RAG pipeline utilizing semantic retrieval and document chunking.',
      'Integrated the Vercel AI SDK and LangChain to interface with local Ollama models.',
    ],
    links: { repo: 'https://github.com/TalibIbrahim/GitChat' },
    media: {
      kind: 'poster',
      motion: 'drift',
      poster: {
        src: `${CDN}/v1776235651/Radix%20Systems/1f830205-26ac-4a5e-941e-410d1e9e7d44.png`,
        alt: 'GitChat AI start screen on black: the headline "Talk to your codebase" above a field for pasting a public GitHub repository link.',
        width: 1680,
        height: 894,
      },
    },
    featured: true,
  },
  {
    slug: 'radix-systems',
    title: 'Radix Systems',
    tagline: 'A software agency for AI automation and web services.',
    summary:
      'A software agency offering AI automation, n8n workflows, custom chatbots, scalable web services, and reliable hosting solutions.',
    kind: 'Software agency',
    role: 'Co-founder',
    year: 2026,
    stack: ['Next.js', 'AI Automation', 'n8n', 'Web Services'],
    highlights: [
      'Developed scalable web services and reliable hosting solutions.',
      'Integrated custom chatbots and n8n workflows for AI automation.',
    ],
    links: { live: 'https://www.radixsystems.online/' },
    media: {
      kind: 'poster',
      motion: 'pan',
      poster: {
        src: `${CDN}/v1776946438/1e37c573-c5d4-49bd-9ed4-308b66204527.png`,
        alt: 'Radix Systems home page: the lowercase "radix systems" wordmark on a purple gradient, with an email field, a quote button and a row of stat tiles.',
        width: 1666,
        height: 894,
      },
    },
    featured: true,
  },
  {
    slug: 'solara',
    title: 'Solara',
    tagline: 'A glass UI weather app.',
    summary:
      'A simple glass UI weather app featuring current as well as daily weather using the Open-Meteo API.',
    kind: 'Weather app',
    role: null,
    year: null,
    stack: ['React.js', 'Open-Meteo API', 'CSS'],
    highlights: [
      'Implemented glass UI components for a modern aesthetic.',
      'Integrated the Open-Meteo API for real-time weather data fetching.',
    ],
    links: { live: 'https://talibibrahim.github.io/Solara/' },
    media: {
      kind: 'poster',
      motion: 'zoom',
      poster: {
        src: `${CDN}/v1776193664/Radix%20Systems/000fdd6f-9cea-485e-9f75-dc2ec186d8a4.png`,
        alt: 'Solara weather dashboard on a violet gradient: the current temperature for San Francisco in a large glass tile, smaller tiles for wind, humidity and rain, and a daily forecast list.',
        width: 1667,
        height: 896,
      },
    },
    featured: true,
  },
  {
    slug: 'slingkick',
    title: 'SlingKick',
    tagline: 'A slingshot puzzle game made for a game jam.',
    summary: 'A 2D slingshot mechanic puzzle game made for the Mindstorm Studios game jam.',
    kind: '2D puzzle game',
    role: null,
    year: null,
    stack: ['Unity', 'C#', '2D Physics'],
    highlights: [
      'Engineered custom 2D slingshot physics using Unity.',
      'Developed within a high-pressure game jam environment.',
    ],
    links: {},
    media: {
      kind: 'poster',
      motion: 'drift',
      poster: {
        src: `${CDN}/v1776193971/Radix%20Systems/85a9cf36-676b-45c9-9270-93f309f101b2.png`,
        alt: 'SlingKick title screen: a cartoon logo with a flying football over a blue patterned background, with yellow Play and Levels buttons.',
        width: 1680,
        height: 949,
      },
    },
    featured: true,
  },
];

/** All projects: explicit `order` first (ascending), then the rest in array order. */
export function getProjects(): Project[] {
  return projects
    .map((p, i) => ({ p, i }))
    .sort((a, b) => {
      const ao = a.p.order ?? Number.POSITIVE_INFINITY;
      const bo = b.p.order ?? Number.POSITIVE_INFINITY;
      return ao === bo ? a.i - b.i : ao - bo;
    })
    .map(({ p }) => p);
}

/** Projects shown in the showreel (everything not explicitly `featured: false`). */
export function getFeatured(): Project[] {
  return getProjects().filter((p) => p.featured !== false);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** The project after `slug` in display order, wrapping to the first. */
export function getNext(slug: string): Project {
  const list = getProjects();
  const i = list.findIndex((p) => p.slug === slug);
  return list[(i + 1) % list.length];
}
