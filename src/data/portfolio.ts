import { PortfolioData } from './types';

export const portfolioData: PortfolioData = {
  hero: {
    headline: "Muhammad Talib Ibrahim",
    subheadline: "Software Engineer specializing in modern web development, real-time systems, and AI-powered tools. BS Computer Science at University of Management & Technology.",
    currentStatusBadge: "Lahore, Pakistan", 
    tickerStrings: [
      "Next.js & React.js",
      "Full-Stack Engineering",
      "RAG Pipelines & LLM APIs",
      "Real-time Systems",
      "Game Development"
    ],
    imageUrl: "https://res.cloudinary.com/dk5pnej6r/image/upload/v1776193796/Radix%20Systems/560f78c9-952a-43c9-967b-f925b4431e78.png"
  },
  projects: [
    {
      id: "byters",
      title: "Byters Food Review App",
      description: "AI-powered restaurant discovery platform featuring vector embeddings and group decision capabilities.",
      thumbnailUrl: "https://res.cloudinary.com/dk5pnej6r/image/upload/v1776194008/Radix%20Systems/cfaca28d-245a-47d2-b658-879a9d8d3c4c.png",
      techTags: ["Next.js", "MongoDB", "Redux", "Tailwind CSS", "Vercel"],
      liveLink: "https://byters.vercel.app",
      architectureHighlights: [
        "Implemented AI-powered restaurant discovery using vector embeddings.", 
        "Engineered a group decision feature to facilitate collaborative choices."
      ]
    },
    {
      id: "quickdrop",
      title: "QuickDrop",
      description: "Privacy-first P2P file sharing application utilizing TURN/open relay servers and automated deletion.",
      thumbnailUrl: "https://res.cloudinary.com/dk5pnej6r/image/upload/v1776193606/Radix%20Systems/b37e4ed6-e19b-4811-8c42-2a645463ec5b.png",
      techTags: ["React.js", "MongoDB", "Cloudinary", "Socket.IO", "PeerJS"],
      liveLink: "https://quickdrop-file.vercel.app",
      architectureHighlights: [
        "Built P2P file sharing architecture utilizing TURN/open relay servers.", 
        "Implemented strict auto-deletion logic to ensure user privacy and security." 
      ]
    },
    {
      id: "gitchat",
      title: "GitChat",
      description: "An AI Codebase Assistant leveraging RAG pipelines, semantic retrieval, and text chunking for interactive repository analysis.",
      thumbnailUrl: "https://res.cloudinary.com/dk5pnej6r/image/upload/v1776235651/Radix%20Systems/1f830205-26ac-4a5e-941e-410d1e9e7d44.png",
      techTags: ["Next.js", "Vercel AI SDK", "MongoDB", "LangChain", "Ollama"],
      githubLink: "https://github.com/TalibIbrahim/GitChat",
      architectureHighlights: [
        "Constructed a RAG pipeline utilizing semantic retrieval and document chunking.", 
        "Integrated the Vercel AI SDK and LangChain to interface with local Ollama models." 
      ]
    },
    {
      id: "radix",
      title: "Radix Systems",
      description: "A software agency offering AI automation, n8n workflows, custom chatbots, scalable web services, and reliable hosting solutions.",
      thumbnailUrl: "https://res.cloudinary.com/dk5pnej6r/image/upload/v1776946438/1e37c573-c5d4-49bd-9ed4-308b66204527.png",
      techTags: ["Next.js", "AI Automation", "n8n", "Web Services"],
      liveLink: "https://www.radixsystems.online/",
      architectureHighlights: [
        "Developed scalable web services and reliable hosting solutions.",
        "Integrated custom chatbots and n8n workflows for AI automation."
      ]
    },
    {
      id: "solara",
      title: "Solara",
      description: "A simple glass UI weather app featuring current as well as daily weather using the Open-Meteo API.",
      thumbnailUrl: "https://res.cloudinary.com/dk5pnej6r/image/upload/v1776193664/Radix%20Systems/000fdd6f-9cea-485e-9f75-dc2ec186d8a4.png",
      techTags: ["React.js", "Open-Meteo API", "CSS"],
      liveLink: "https://talibibrahim.github.io/Solara/",
      architectureHighlights: [
        "Implemented glass UI components for a modern aesthetic.",
        "Integrated the Open-Meteo API for real-time weather data fetching."
      ]
    },
    {
      id: "slingkick",
      title: "SlingKick",
      description: "A 2D slingshot mechanic puzzle game made for the Mindstorm Studios game jam.",
      thumbnailUrl: "https://res.cloudinary.com/dk5pnej6r/image/upload/v1776193971/Radix%20Systems/85a9cf36-676b-45c9-9270-93f309f101b2.png",
      techTags: ["Unity", "C#", "2D Physics"],
      architectureHighlights: [
        "Engineered custom 2D slingshot physics using Unity.",
        "Developed within a high-pressure game jam environment."
      ]
    }
  ],
  experience: [
    {
      id: "gdgoc",
      role: "Core Web Dev Team Member",
      company: "Google Developer Group (GDGoC) UMT",
      duration: "Nov 2024 – August 2025",
      achievements: [
        "Engineered secure user auth system for chapter blog.",
        "Facilitated technical workshops on Modern Web Dev and React.js."
      ]
    },
    {
      id: "mindstorm",
      role: "Game Development Intern",
      company: "Mindstorm Studios",
      duration: "June 2024 – August 2024",
      achievements: [
        "Developed physics-based puzzle game with drag-and-release mechanics, portals, and obstacles.",
        "Scripted complex object behaviors and level logic in C#."
      ]
    }
  ],
  competencies: {
    languages: ["JS", "TypeScript", "C++", "C#", "HTML", "CSS"],
    frameworks: ["Next.js", "React.js", "Node.js", "Express.js", "Tailwind CSS", "Bootstrap"],
    backendDevOps: ["Socket.IO", "PeerJS", "Firebase", "Cloudinary", "Redis (Upstash)", "LangChain", "RAG Pipelines", "Vector Search", "LLM APIs", "Git", "GitHub", "Postman", "Unity", "WordPress", "Vercel", "Arduino Uno"],
    databases: ["MongoDB", "MySQL"]
  },
  socials: [
    {
      platform: "GitHub",
      url: "https://github.com/TalibIbrahim",
      iconIdentifier: "github"
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/muhammad-talib-ibrahim",
      iconIdentifier: "linkedin"
    },
    {
      platform: "Email",
      url: "mailto:talibibrahim04@gmail.com",
      iconIdentifier: "email"
    }
  ]
} as const;
