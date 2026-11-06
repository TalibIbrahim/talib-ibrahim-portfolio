import { LEDGER_CLIENT_NAME } from './clients';
import type { FeaturedProject, Project } from './types';

/*
 * How to add a project
 * --------------------
 * 1. Add ONE entry to the `projects` array below. `slug` becomes the URL (/work/<slug>)
 *    and the MDX filename. Keep `role` and `year` null unless they are actually known
 *    (year = the GitHub repo's created_at, or the first commit for a repo that is not public).
 *    `featured: true` puts it in the home showreel and needs a cover; `featured: false` lists it
 *    under All projects (/work) and may have `media: null` until screenshots exist.
 * 2. Put media in public/work/<slug>/ (or use a remote URL from an allowed host in
 *    next.config.ts). Always give the poster its real pixel width/height and a descriptive alt.
 * 3. Optional: write src/content/projects/<slug>.mdx (plain markdown, `##` headings) for the
 *    case-study body. Without it the case page still renders from the fields here. If the
 *    project has `metrics`, put <Metrics /> in the MDX where they should appear.
 * Display order is array order, featured projects first. The showreel, /work, case route,
 * sitemap, llms.txt, Recruiter Mode list and metadata all map over this array, so nothing else
 * needs to change.
 */

const CDN = 'https://res.cloudinary.com/dk5pnej6r/image/upload';

/** LedgerERP's client, named with the owner's OK. */
const LEDGER_CLIENT = `${LEDGER_CLIENT_NAME}, a transmission company in Lahore`;

/** Keeps each `slug` as a literal so ProjectSlug can name exactly the slugs below. */
const define = <S extends string>(list: Project<S>[]) => list;

const list = define([
  // ---------- Featured (home showreel), in this order ----------
  {
    slug: 'byters',
    title: 'Byters',
    tagline: 'Rate restaurants, write reviews, decide together.',
    summary:
      'A full-stack review platform where users rate restaurants, write reviews, and manage dynamic profiles with secure authentication.',
    kind: 'Food review platform',
    role: 'Lead developer, team of 3',
    year: 2024, // first commit of the (private) repo: 2024-10-24
    stack: ['Next.js', 'MongoDB', 'Redux', 'Tailwind CSS', 'Vercel'],
    highlights: [
      'Implemented AI-powered restaurant discovery using vector embeddings.',
      'Engineered a group decision feature to facilitate collaborative choices.',
    ],
    links: { live: 'https://www.byters.site/' },
    facts: [
      { value: 'About 40', text: 'users, grown organically through Reddit', source: { kind: 'owner' } },
      { value: '120+', text: 'restaurants listed', source: { kind: 'owner' } },
      { value: '100+', text: 'reviews written', source: { kind: 'owner' } },
    ],
    keyFact: '~40 users · 120+ restaurants · 100+ reviews', // from the owner facts above
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
  },  {
    slug: 'lumos',
    title: 'Lumos',
    tagline: 'Local control for Tuya smart lights, with Apple HomeKit built in.',
    summary:
      'A Windows desktop app that controls Tuya and Smart Life Wi-Fi lights directly over the local network, with no cloud at runtime, and publishes them to Apple HomeKit. Effects follow the screen, music, album art and game events.',
    description:
      'A Windows app that controls Tuya and Smart Life Wi-Fi lights over the local network, with no cloud at runtime, and publishes them to Apple HomeKit.',
    kind: 'Smart-light desktop app',
    role: 'Solo',
    year: 2026,
    stack: ['Electron', 'React', 'TypeScript', 'Tailwind CSS', 'HAP-NodeJS', 'TuyAPI', 'C#'],
    highlights: [
      'Sends commands to the bulbs over the local network with the Tuya protocol, so a command reaches a light in tens of milliseconds and nothing goes through a server.',
      'Publishes the lights as an Apple HomeKit bridge for Siri, the Home app and automations.',
      'Screen Sync, music and album colour effects, plus game effects for Rocket League, Counter-Strike 2 and League of Legends.',
      'A small native C# helper reads the Windows media session, album art thumbnail and output level for the effects; track titles never leave it, only a hash.',
      'About 0.01% CPU when hidden in the tray; the install archive went from 55 MB to 15 MB.',
      'Ships as a Windows installer that checks GitHub Releases for updates.',
    ],
    facts: [{ text: 'I use it every day.', source: { kind: 'owner' } }],
    keyFact: 'Used daily · v2.1.9', // the owner fact above; the version is in the case study (lumos.mdx)
    gallery: [
      {
        src: '/work/lumos/light-detail.webp',
        alt: 'Lumos light detail sheet for a desk lamp at 100 percent: a tall brightness slider, a Temperature tab with a Kelvin spectrum slider at 4250K, and presets from Candlelight to Cool Sky.',
        width: 1080,
        height: 740,
      },
      {
        src: '/work/lumos/effects.webp',
        alt: 'Lumos Effects page: cards for Screen Sync, Music, Album color, Away dimming and Games, with Rocket League, Counter-Strike 2 and League of Legends listed under Games, all switched off.',
        width: 1080,
        height: 740,
      },
    ],
    links: {
      repo: 'https://github.com/TalibIbrahim/Lumos',
      // no live site: it is a desktop app; the installer is on the repo's Releases page
    },
    media: {
      kind: 'poster',
      motion: 'drift',
      focus: { x: 0.74, y: 0.3, zoom: 1.3 }, // the glowing light tiles, not the empty lower half
      poster: {
        src: '/work/lumos/cover.webp',
        alt: 'Lumos home screen with demo data: a sidebar of rooms, scenes, automations, effects and energy, scene buttons for Reading, Relax, Focus and Night, and five glowing light tiles at 100 percent neutral white.',
        width: 1080,
        height: 740,
      },
    },
    featured: true,
  },
  {
    slug: 'orbit',
    title: 'Orbit',
    tagline: 'A self-hosted dashboard that keeps a photo library in more than one place.',
    summary:
      'A self-hosted storage and server dashboard, delivered as a mobile-first PWA, that keeps an Immich photo library replicated with Syncthing and shows usage, replication health, backups and failover in one place.',
    description:
      'A self-hosted dashboard, delivered as a mobile-first PWA, that keeps an Immich photo library replicated with Syncthing and shows its health and backups.',
    kind: 'Self-hosted dashboard',
    role: 'Solo',
    year: 2026,
    stack: ['Next.js', 'TypeScript', 'Node.js', 'SQLite', 'Syncthing', 'Docker', 'Tailscale'],
    highlights: [
      'A hub polls an agent on every device every 60 seconds and caches the last good answer in SQLite, so an offline device shows when it was last seen.',
      'Checks every phone upload against the files on each copy before it calls the phone safe to free up.',
      'One button starts Immich on an Oracle Cloud standby from the newest database dump.',
      'Nothing is exposed publicly: the hub, the agents and Immich bind to Tailscale.',
    ],
    links: { repo: 'https://github.com/TalibIbrahim/Orbit' },
    media: {
      kind: 'poster',
      motion: 'drift',
      focus: { x: 1, y: 0.8, zoom: 1.3 }, // owner-chosen cover; the portrait slot frames the phone mockup and the desktop cards beside it
      poster: {
        src: '/work/orbit/hero.webp',
        alt: 'Orbit on a desktop browser and a phone, with demo data: the overview dashboard and the phone offload screen, beside the headline "Every photo. Three places. Proven."',
        width: 2000,
        height: 1125,
      },
    },
    gallery: [
      {
        src: '/work/orbit/cover.webp',
        alt: 'Orbit overview screen with demo data: a sync card listing four devices, a phone backup card marked safe to offload with every copy verified, and CPU, RAM and disk tiles for an Oracle Cloud standby.',
        width: 2000,
        height: 1250,
      },
    ],
    featured: true,
  },
  {
    slug: 'quickdrop',
    title: 'QuickDrop',
    tagline: 'Privacy-first, peer-to-peer file sharing.',
    summary:
      'Privacy-first file sharing with peer-to-peer transfer using WebRTC, featuring auto-deletion, lossless uploads, and QR code device pairing.',
    kind: 'P2P file sharing',
    role: 'Solo',
    year: 2025,
    stack: ['React.js', 'MongoDB', 'Cloudinary', 'Socket.IO', 'PeerJS'],
    highlights: [
      'Built P2P file sharing architecture utilizing TURN/open relay servers.',
      'Implemented strict auto-deletion logic to ensure user privacy and security.',
    ],
    links: {
      live: 'https://quickdrop-file.vercel.app/',
      repo: 'https://github.com/TalibIbrahim/quickdrop',
    },
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
    slug: 'jarvis',
    title: 'JARVIS',
    tagline: 'Hand-gesture PC control with a Dynamic Island overlay for Windows.',
    summary:
      'A Windows app for controlling the PC with hand gestures tracked from the webcam by MediaPipe, with a voice assistant and a Dynamic Island overlay that shows media, calendar, weather and hardware cards.',
    description:
      'A Windows app for controlling the PC with hand gestures tracked from the webcam by MediaPipe, with a voice assistant and a Dynamic Island overlay.',
    kind: 'Desktop assistant',
    role: 'Solo',
    year: 2026,
    stack: ['Python', 'MediaPipe', 'OpenCV', 'PySide6', 'openWakeWord', 'Groq API', 'WinRT'],
    highlights: [
      'Hand tracking runs locally with MediaPipe; speech recognition and the assistant use the Groq API.',
      'The Dynamic Island is native PySide6 at 60 FPS, click-through when idle, and never takes focus.',
      'Gestures include one-handed zoom, a listen gesture and fast flicks to switch windows.',
      'Crashed or stalled camera and voice workers restart on their own.',
    ],
    links: { repo: 'https://github.com/TalibIbrahim/JARVIS' },
    gallery: [
      {
        src: '/work/jarvis/settings.webp',
        alt: 'JARVIS settings window, Display page: appearance, glass style, a transparency slider at 60 percent, a mini hand skeleton toggle and Reduce Motion, with a sidebar for gestures, pointer, voice and AI.',
        width: 968,
        height: 696,
      },
    ],
    media: {
      kind: 'poster',
      motion: 'pan',
      poster: {
        src: '/work/jarvis/cover.webp',
        alt: 'JARVIS Dynamic Island cards on a slate background: a compact pill playing a song, a media player card, a September 2026 calendar, a weather card and a hardware strip with FPS, CPU, RAM, GPU and disk.',
        width: 1600,
        height: 900,
      },
    },
    featured: true,
  },

  // ---------- All projects (not in the showreel), in this order ----------
  {
    slug: 'peekaboo',
    title: 'Peekaboo',
    tagline: 'Webcam head tracking that turns a monitor into a window onto 3D worlds.',
    summary:
      'A browser app that tracks your head through the webcam and recomputes an off-axis projection every frame, so the screen behaves like a window into four interactive 3D scenes.',
    description:
      'A browser app that tracks your head through the webcam and recomputes an off-axis projection every frame, so the screen acts as a window into 3D scenes.',
    kind: '3D web experiment',
    role: 'Solo',
    year: 2026,
    stack: ['JavaScript', 'Three.js', 'MediaPipe', 'WebGL', 'GLSL'],
    highlights: [
      'An off-axis (asymmetric frustum) projection locks the view to the four edges of the physical display.',
      'GPGPU boids drive a school of 576 to 2,304 fish that scatter when you lean in.',
      'Starfall runs a curl-noise river of 147,000 to 590,000 particles.',
      'An auto quality tier drops a level when the frame rate falls below 48 FPS.',
    ],
    links: {
      live: 'https://talibibrahim.github.io/peekaboo-3d-parallax-window/',
      repo: 'https://github.com/TalibIbrahim/peekaboo-3d-parallax-window',
    },
    media: {
      kind: 'poster',
      motion: 'zoom',
      poster: {
        src: '/work/peekaboo/cover.webp',
        alt: 'Peekaboo Starfall scene, captured from the live site in mouse mode: a banded purple and gold gas giant with wide striped rings, a glowing comet trail curving across it and a field of stars.',
        width: 1600,
        height: 900,
      },
    },
    gallery: [
      {
        src: '/work/peekaboo/abyss.webp',
        alt: 'Peekaboo Abyss scene, captured from the live site in mouse mode: an underwater reef cave with a school of fish, glowing jellyfish, kelp and a manta ray silhouette.',
        width: 1600,
        height: 900,
      },
    ],
    featured: false,
  },
  {
    slug: 'gitchat',
    title: 'GitChat',
    tagline: 'A RAG-powered assistant for GitHub repositories.',
    summary:
      'A RAG-powered assistant that streams AI reasoning from local LLMs, with MongoDB Atlas Vector Search for semantic retrieval of GitHub repositories.',
    kind: 'AI codebase assistant',
    role: 'Solo',
    year: 2026,
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
    featured: false,
  },
  {
    slug: 'beacon',
    title: 'Beacon',
    tagline: 'A private control panel for a friends-only Minecraft server.',
    summary:
      "A password-protected control panel for a friends-only Minecraft server on an Oracle Cloud VM: see whether it is up, copy the join address, start or stop the VM and download the world save. It runs on Cloudflare's free tier.",
    description:
      "A password-protected control panel for a friends-only Minecraft server on an Oracle Cloud VM, running on Cloudflare's free tier.",
    kind: 'Server dashboard',
    role: 'Solo',
    year: 2026,
    stack: ['React', 'Vite', 'Tailwind CSS', 'Cloudflare Workers', 'Cloudflare D1', 'Cloudflare KV', 'Oracle Cloud'],
    highlights: [
      'Signs Oracle Cloud API requests from a Cloudflare Worker with Web Crypto alone, without Node APIs or crypto packages.',
      'A PBKDF2 password hash checked in constant time, HMAC-signed session cookies, CSRF checks, a strict CSP and brute-force lockouts.',
      'An always-on ARM VM backs the world up every 30 minutes, and a cron Worker stops the server after 30 minutes with nobody online.',
      'Splits storage between KV and D1 to stay inside free-tier write limits.',
    ],
    links: {
      live: 'https://beacon.talibibrahim04.workers.dev/',
      repo: 'https://github.com/TalibIbrahim/Beacon',
    },
    media: {
      kind: 'poster',
      motion: 'pan',
      poster: {
        src: '/work/beacon/cover.webp',
        alt: 'Beacon dashboard with made-up data, in a dark pixel-art style: a Minecraft server marked Online with its join address and a four-step boot track, world save and backup cards, three players and a recent activity log.',
        width: 1440,
        height: 1060,
      },
    },
    gallery: [
      {
        src: '/work/beacon/phone.webp',
        alt: 'Beacon on a phone with made-up data while the server starts: the boot track has reached the World step and the join address waits for the server to come online.',
        width: 780,
        height: 1688,
      },
    ],
    featured: false,
  },
  {
    slug: 'splitr',
    title: 'Splitr',
    tagline: 'Restaurant bills, split properly.',
    summary:
      'A mobile app for splitting restaurant bills: scan the receipt on the device, assign items to people, and get per-person totals that account for discounts, tax and service charges. Local-only and single-user, in beta.',
    description:
      'A mobile app for splitting restaurant bills: scan the receipt on the device, assign items to people and get per-person totals with tax and service charges.',
    kind: 'Mobile bill splitter',
    role: 'Solo',
    year: 2026,
    stack: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'ML Kit', 'Zod', 'Turborepo'],
    highlights: [
      'Reads receipts on the device with ML Kit OCR, with no server and no API keys.',
      'A receipt parser for Pakistani receipts, tested against transcribed real receipts.',
      'A directory of 39 Lahore card dining offers taken from official bank sources.',
      'CI builds an Android APK and an unsigned iOS IPA into GitHub Releases.',
    ],
    links: { repo: 'https://github.com/TalibIbrahim/Splitr' },
    // Portrait phone shots (390x844 at 2x) from the Expo web build, with a made-up receipt.
    media: {
      kind: 'poster',
      poster: {
        src: '/work/splitr/cover.webp',
        alt: 'Splitr split screen on a phone with sample data: a Rs 5,500 bill at Sample Cafe marked as matching the receipt, with per-person totals for You, Alex, Jo and Maya and a picker for who paid.',
        width: 780,
        height: 1688,
      },
    },
    gallery: [
      {
        src: '/work/splitr/items.webp',
        alt: 'Splitr items screen with sample data: six dishes such as Margherita pizza and Chicken pasta typed in by hand, adding up to a Rs 5,000 subtotal.',
        width: 780,
        height: 1688,
      },
      {
        src: '/work/splitr/assign.webp',
        alt: 'Splitr assign screen with sample data: four people with running totals across the top, and items showing who shares them, such as a pizza split three ways at Rs 600 each.',
        width: 780,
        height: 1688,
      },
      {
        src: '/work/splitr/home.webp',
        alt: 'Splitr home screen with sample data: what you owe, and the Sample Cafe bill under Lately.',
        width: 780,
        height: 1688,
      },
    ],
    featured: false,
  },
  {
    slug: 'ledgererp',
    title: 'LedgerERP',
    tagline: `An inventory and ledger desktop app built through Radix Systems for ${LEDGER_CLIENT}.`,
    summary:
      `A desktop inventory and ledger app for Windows and macOS, built through Radix Systems for ${LEDGER_CLIENT}. It keeps data in a local database and syncs it to MongoDB in the cloud.`,
    description: `An inventory and ledger app for Windows and macOS, built through Radix Systems for ${LEDGER_CLIENT}.`,
    kind: 'Inventory desktop app',
    role: 'Solo',
    year: 2026,
    stack: ['Electron', 'React', 'TypeScript', 'Vite', 'Tailwind CSS', 'NeDB', 'MongoDB'],
    highlights: [
      'Purchase and sales vouchers with drafts, search, keyboard shortcuts and stock validation.',
      'Customer accounts, a credit ledger, payment tracking and monthly sales reports.',
      'Local-first data with cloud sync to MongoDB, plus Trash and backups.',
      'Ships as a Windows installer and a macOS DMG, with auto-updates published by a GitHub Actions release workflow.',
    ],
    facts: [{ text: 'Still maintained: I ship updates to the client.', source: { kind: 'owner' } }],
    links: {
      repo: 'https://github.com/TalibIbrahim/Inventory-Ledger-Management-System',
      client: 'https://paktransdrive.com/',
    },
    // Captured from the app's own renderer with a generic sample dataset, never client data.
    media: {
      kind: 'poster',
      poster: {
        src: '/work/ledgererp/cover.webp',
        alt: 'LedgerERP monthly sales report for October 2026 with sample data: totals for gross sales, cash collected, payment due, units dispatched and gross profit, above a daily bar chart of cash collected and payment due.',
        width: 2000,
        height: 1250,
      },
    },
    gallery: [
      {
        src: '/work/ledgererp/stock-balance.webp',
        alt: 'LedgerERP inventory balance with sample data: total stock, asset valuation and low-stock counts, then a table of sample products such as Coolant 1L and Spark plug with reorder levels, remaining stock and valuation.',
        width: 2000,
        height: 1250,
      },
      {
        src: '/work/ledgererp/stock-ledger.webp',
        alt: 'LedgerERP stock ledger with sample data: dated sale-out entries per product and warehouse, each with the quantity out and the company and warehouse running balances.',
        width: 2000,
        height: 1250,
      },
      {
        src: '/work/ledgererp/sale-voucher.webp',
        alt: 'LedgerERP sale voucher form filled with sample data: customer, warehouse, a line item with on-hand stock, quantity and rate, and a choice between paid in cash and payment due.',
        width: 1200,
        height: 1344,
      },
    ],
    featured: false,
  },
  {
    slug: 'solara',
    title: 'Solara',
    tagline: 'A glass UI weather app.',
    summary:
      'A simple glass UI weather app featuring current as well as daily weather using the Open-Meteo API.',
    kind: 'Weather app',
    role: 'Solo',
    year: 2024,
    stack: ['React.js', 'Open-Meteo API', 'CSS'],
    highlights: [
      'Implemented glass UI components for a modern aesthetic.',
      'Integrated the Open-Meteo API for real-time weather data fetching.',
    ],
    links: { live: 'https://talibibrahim.github.io/Solara/', repo: 'https://github.com/TalibIbrahim/Solara' },
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
    featured: false,
  },
  {
    slug: 'slingkick',
    title: 'SlingKick',
    tagline: 'A slingshot puzzle game made for a game jam.',
    summary: 'A 2D slingshot mechanic puzzle game made for the Mindstorm Studios game jam.',
    kind: '2D puzzle game',
    role: 'Solo',
    year: 2024,
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
    featured: false,
  },
]);

/** Every project slug, as a type: site.ts can only point at a project that exists. */
export type ProjectSlug = (typeof list)[number]['slug'];
export const projects: Project[] = list;

const isFeatured = (p: Project): p is FeaturedProject => p.featured;

/** All projects in display order: featured first, then the rest, each in array order. */
export function getProjects(): Project[] {
  return [...projects.filter(isFeatured), ...projects.filter((p) => !p.featured)];
}

/** Projects shown in the showreel. */
export function getFeatured(): FeaturedProject[] {
  return projects.filter(isFeatured);
}

/** Projects listed only on /work. */
export function getRest(): Project[] {
  return projects.filter((p) => !p.featured);
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

/** The meta description: the short `description` when set, otherwise the summary. */
export const descriptionOf = (p: Project) => p.description ?? p.summary;

/** The project's cover, if it has one. */
export const coverOf = (p: Project) => p.media?.poster ?? null;
