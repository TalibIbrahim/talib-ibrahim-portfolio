import { LEDGER_CLIENT_NAME } from './clients';
import type { Education, Site } from './types';

// All site copy. Facts only: every line here traces back to the previous portfolio or the owner.

const name = 'Muhammad Talib Ibrahim';
const role = 'Full-stack developer';
const location = 'Lahore, Pakistan';
const umt: Education = {
  school: 'University of Management & Technology (UMT)',
  degree: 'BS Computer Science',
  start: 'Oct 2023',
  end: 'July 2027 (expected)',
  gpa: '3.6/4.0',
};

export const site: Site = {
  name,
  shortName: 'Talib Ibrahim',
  role,
  url: 'https://www.muhammad-talib.dev',
  description:
    'Muhammad Talib Ibrahim, full-stack developer in Lahore. Scalable web apps, real-time systems and AI-powered tools with the MERN stack and Next.js.',
  location,
  globe: { caption: 'Globe showing Lahore, Pakistan', timeCaption: 'local time' },
  email: 'talibibrahim04@gmail.com',
  tagline:
    'I build scalable web applications with modern JavaScript, from real-time systems to AI-powered tools.',
  taglineAccents: ['scalable', 'real-time', 'AI-powered'],
  about: [
    "I'm a full-stack developer studying Computer Science at UMT in Lahore. I specialize in the MERN stack and Next.js, and I build everything from food review platforms to AI-powered codebase assistants, with a soft spot for real-time systems.",
    `I also co-founded Radix Systems, where I built LedgerERP for ${LEDGER_CLIENT_NAME}. Before that I spent a summer at Mindstorm Studios scripting portals, obstacles and drag-and-release physics in C#.`,
  ],
  links: {
    github: { label: 'GitHub', href: 'https://github.com/TalibIbrahim' },
    linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammad-talib-ibrahim' },
    site: { label: 'muhammad-talib.dev', href: 'https://www.muhammad-talib.dev' },
  },
  education: [umt],
  experience: [
    {
      role: 'Co-founder',
      org: 'Radix Systems',
      place: 'Lahore, Pakistan',
      start: 'Apr 2026',
      end: 'Oct 2026', // owner, 2026-11-04
      points: [
        `Co-founded Radix Systems and built LedgerERP, an inventory and ledger desktop app, for ${LEDGER_CLIENT_NAME}.`,
        'Shipped LedgerERP as a Windows installer and a macOS DMG, with auto-updates published by a GitHub Actions release workflow. I still ship updates to the client.',
      ],
    },
    {
      role: 'Core web development team member',
      org: 'Google Developer Group (GDGoC) UMT',
      place: 'Lahore, Pakistan',
      start: 'Nov 2024',
      end: 'Aug 2025',
      points: [
        "Built user authentication for the chapter's official blog.",
        'Ran workshops for university students on modern web development and React.js.',
      ],
    },
    {
      role: 'Game development intern',
      org: 'Mindstorm Studios',
      place: 'Lahore, Pakistan',
      start: 'Jun 2024',
      end: 'Aug 2024',
      // The game was built in Unity (owner, 2026-11-04); Experience has no tools field, so it is not shown here.
      points: [
        'Developed a physics-based puzzle game featuring custom drag-and-release mechanics, portals, and dynamic environmental obstacles.',
        'Scripted the portals, obstacles and drag-and-release physics in C#.',
      ],
    },
  ],
  certifications: [
    'The Web Developer Bootcamp 2020',
    'Summer Game Jam 2024',
    'React, NodeJS, Express & MongoDB: The MERN Fullstack Guide',
    'React: The Complete Guide 2024 by Maximilian Schwarzmüller',
    'Google AI Fundamentals',
  ],
  stack: [
    {
      name: 'Languages',
      items: ['JavaScript', 'TypeScript', 'C++', 'C#', 'HTML', 'CSS'],
    },
    {
      name: 'Frameworks',
      items: ['Next.js', 'React.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'Bootstrap'],
    },
    {
      name: 'Backend & tools',
      items: [
        'Socket.IO',
        'PeerJS',
        'Cloudinary',
        'Redis (Upstash)',
        'LangChain',
        'RAG pipelines',
        'Vector search',
        'LLM APIs',
        'Git',
        'GitHub',
        'Postman',
        'Vercel',
        'WordPress',
        'Unity',
        'Arduino Uno',
      ],
    },
    {
      name: 'Databases',
      items: ['MongoDB', 'MySQL', 'Firebase'],
    },
  ],
  ogImage: {
    src: '/og.png',
    alt: `${name}, ${role}`,
    width: 1200,
    height: 630,
  },
  pitch: {
    frontEnd: "React and Next.js interfaces, from Byters' restaurant search to Orbit's phone PWA.",
    backEnd: 'WebRTC transfers in QuickDrop; a RAG pipeline over repos in GitChat.',
  },
  layers: {
    heading: 'Front end and back end',
    end: 'End',
    usedIn: 'used in',
    sides: [
      { key: 'front', layer: 'client', top: 'Front', tools: ['React.js', 'Next.js', 'Tailwind CSS'] },
      { key: 'back', layer: 'server', top: 'Back', tools: ['Node.js', 'Express.js', 'MongoDB'] },
    ],
  },
  // Key words in site.about, verbatim, one effect each.
  aboutFx: {
    type: 'full-stack developer',
    decode: 'Next.js',
    diff: 'real-time systems',
    select: 'Radix Systems', // past tense in the copy ("co-founded"), so it is not a current role
    placeholder: '-{TODO_specialty}',
  },
  hero: {
    featured: 'byters',
    // Current facts only. Radix Systems ended (Oct 2026), so it stays out.
    nameRow: [role, location, umt.degree],
    stackRow: ['Next.js', 'React.js', 'Node.js', 'Express.js', 'Bootstrap', 'Socket.IO', 'PeerJS'],
  },
  workIndex: {
    title: 'All projects',
    description:
      `Every project by ${name}, ${role.toLowerCase()} in Lahore, with its stack, year and links to the live site, the code and the case study.`,
    intro: 'Selected work first, then everything else.',
    featuredHeading: 'Selected work',
    restHeading: 'More projects',
    homeLink: 'All projects',
    log: 'git log --featured',
    live: 'Live site',
    repo: 'Code',
    client: "Client's site",
    caseStudy: 'Case study',
  },
  contact: {
    heading: 'Email me',
    body: "I'm looking for full-stack roles working with React, Next.js and Node.js. Send me the role, or a project you want built, and I'll reply.",
    subjects: [
      { value: 'Website Inquiry', label: 'General inquiry' },
      { value: 'Requesting your Resume', label: 'Ask for my resume' },
      { value: 'Project Idea', label: 'Project idea' },
    ],
    // Ready-made messages typed into the form when that subject is picked. [BRACKETS] are blanks.
    templates: {
      'Requesting your Resume':
        "Hi Talib,\n\nI'm [YOUR NAME], [YOUR ROLE] at [COMPANY]. We're hiring for [POSITION] and I'd love to see your latest resume.\n\nBest,\n[YOUR NAME]",
      'Project Idea':
        "Hi Talib,\n\nI'm [YOUR NAME] from [COMPANY]. I have a project in mind: [ONE LINE ABOUT IT].\n\nTimeline: [WHEN]\nBudget: [RANGE]\n\nCould we talk this week?\n\n[YOUR NAME]",
    },
    templateUi: {
      use: 'Use the {subject} template',
      next: 'Next blank',
      of: '{n} of {total}',
      added: 'Template added. {total} blanks to fill.',
      addedOne: 'Template added. 1 blank to fill.',
      blank: 'Blank {n} of {total}: {name}',
      done: 'All blanks filled.',
      pending: 'Some blanks are still in brackets',
    },
    finale: {
      inkLabel: 'Leave your mark',
      inkHintPointer: 'Move the pointer to draw',
      inkHintTouch: 'Draw here with a finger',
      detailsTitle: 'Details',
      emailLabel: 'Email',
      elsewhereLabel: 'Elsewhere',
      basedLabel: 'Based in',
      timeLabel: 'Local time',
      timeZone: 'Asia/Karachi',
      timeZoneLabel: 'GMT+5',
      writeTitle: 'Or write it here',
      writeNote: 'Every field except the subject is required.',
      backToTop: 'Back to top',
      colophon: 'Set in Clash Display and General Sans, with JetBrains Mono, Departure Mono and Fraunces. Built with Next.js, GSAP, Lenis and OGL.',
      copy: { label: 'Copy email address', copied: 'Copied', failed: 'Selected, press Ctrl+C' },
    },
    // The ending: breakout with an ink drop and a pen; the bricks are the site.stack items.
    // {n} {total} {lives} are filled in.
    breakout: {
      label: 'Clear my stack',
      invite: 'Thanks for reading all the way down. One last thing: knock my whole stack off the page.',
      hintPointer: 'Move the pointer to steer the pen. Click or press Space to play.',
      hintTouch: 'Drag on the board to steer the pen. Tap to play.',
      launchPointer: 'Click or press Space to launch',
      launchTouch: 'Tap to launch',
      play: 'Play',
      pause: 'Pause',
      resume: 'Resume',
      retry: 'Try again',
      again: 'Play again',
      paused: 'Paused',
      over: 'Out of ink',
      winLead: "You'd be great at this job too.",
      winCta: 'Email me',
      gameLabel: 'Ink breakout',
      description:
        'A breakout game. An ink drop bounces off a pen at the bottom of the board, and every brick is one tool from my stack. Left and Right arrows, or A and D, move the pen. Space or Enter launches the drop. Escape pauses. You have {lives} drops.',
      announce: {
        start: 'Game on. {total} bricks, {lives} drops. Press Space to launch.',
        cleared: '{n} of {total} cleared.',
        missed: 'Missed. {lives} drops left. Press Space to launch.',
        missedOne: 'Missed. 1 drop left. Press Space to launch.',
        paused: 'Paused.',
        over: 'Out of ink. {n} of {total} cleared.',
        won: "All {total} cleared. You'd be great at this job too. Email me.",
      },
    },
  },
  recruiter: {
    toggle: 'Recruiter mode',
    back: 'Back to the full site',
    less: 'Less hard sell',
    more: 'Hard sell',
    levels: ['Barely selling', 'Soft sell', 'Firm sell', 'Hard sell'],
    brief:
      "I'm Talib, a full-stack developer in Lahore studying Computer Science at UMT. I build web apps with the MERN stack and Next.js, and I co-founded Radix Systems, where I built LedgerERP.",
  },
};
