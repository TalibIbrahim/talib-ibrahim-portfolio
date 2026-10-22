import type { Site } from './types';

// All site copy. Facts only: every line here traces back to the previous portfolio or the owner.

export const site: Site = {
  name: 'Muhammad Talib Ibrahim',
  shortName: 'Talib Ibrahim',
  role: 'Full-stack developer',
  url: 'https://muhammad-talib.dev',
  description:
    'Muhammad Talib Ibrahim, full-stack developer in Lahore. Scalable web apps, real-time systems and AI-powered tools with the MERN stack and Next.js.',
  location: 'Lahore, Pakistan',
  email: 'talibibrahim04@gmail.com',
  tagline:
    'I build scalable web applications with modern JavaScript, from real-time systems to AI-powered tools.',
  about: [
    "I'm a full-stack developer studying Computer Science at UMT in Lahore. I specialize in the MERN stack and Next.js, and I build everything from food review platforms to AI-powered codebase assistants, with a soft spot for real-time systems.",
    'I also co-founded Radix Systems, where I lead technical development and architecture. Before that I spent a summer at Mindstorm Studios scripting portals, obstacles and drag-and-release physics in C#.',
  ],
  links: {
    github: { label: 'GitHub', href: 'https://github.com/TalibIbrahim' },
    linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammad-talib-ibrahim' },
    site: { label: 'muhammad-talib.dev', href: 'https://muhammad-talib.dev' },
  },
  education: [
    {
      school: 'University of Management & Technology (UMT)',
      degree: 'BS Computer Science',
      start: 'Oct 2023',
      end: 'July 2027 (expected)',
      gpa: '3.6/4.0',
    },
  ],
  experience: [
    {
      role: 'Co-founder',
      org: 'Radix Systems',
      place: 'Lahore, Pakistan',
      start: 'Apr 2026',
      end: 'Present',
      points: [
        'Co-founded Radix Systems to deliver high-quality web applications and software solutions.',
        'Leading technical development and architecture using modern technologies like Next.js and React.',
      ],
    },
    {
      role: 'Core web development team member',
      org: 'Google Developer Group (GDGoC) UMT',
      place: 'Lahore, Pakistan',
      start: 'Nov 2024',
      end: 'Aug 2025',
      points: [
        "Engineered and integrated a secure user authentication system for the chapter's official blog website.",
        'Facilitated technical workshops on Modern Web Development and React.js to upskill university students.',
      ],
    },
    {
      role: 'Game development intern',
      org: 'Mindstorm Studios',
      place: 'Lahore, Pakistan',
      start: 'Jun 2024',
      end: 'Aug 2024',
      points: [
        'Developed a physics-based puzzle game featuring custom drag-and-release mechanics, portals, and dynamic environmental obstacles.',
        'Scripted complex object behaviors and level logic in C#, optimizing physics calculations for smooth gameplay performance.',
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
  contact: {
    heading: 'Email me',
    body: "I'm currently open to new opportunities and collaborations. Whether you have a question, a project idea, or just want to say hi, my inbox is always open.",
    subjects: [
      { value: 'Website Inquiry', label: 'General inquiry' },
      { value: 'Requesting your Resume', label: 'Ask for my resume' },
      { value: 'Project Idea', label: 'Project idea' },
    ],
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
      signoffLabel: 'Signed',
      signoffNote: 'Thanks for reading all the way down.',
      backToTop: 'Back to top',
      colophon: 'Set in Clash Display and General Sans. Built with Next.js, GSAP, Lenis and OGL.',
      copy: { label: 'Copy email address', copied: 'Copied', failed: 'Selected, press Ctrl+C' },
    },
  },
  recruiter: {
    toggle: 'Recruiter mode',
    back: 'Back to the full site',
    less: 'Less hard sell',
    more: 'Hard sell',
    levels: ['Barely selling', 'Soft sell', 'Firm sell', 'Hard sell'],
    brief:
      "I'm Talib, a full-stack developer in Lahore studying Computer Science at UMT. I build web apps with the MERN stack and Next.js, and I co-founded Radix Systems.",
  },
};
