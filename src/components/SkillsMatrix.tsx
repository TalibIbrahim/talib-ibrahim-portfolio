'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { TechCompetencies } from '../data/types';
import DecryptedText from './react-bits/DecryptedText';
import Magnet from './react-bits/Magnet';
import { Crosshair } from 'lucide-react';
import styles from './SkillsMatrix.module.css';

export interface SkillsMatrixProps {
  competencies: TechCompetencies;
}

interface SkillMetadata {
  category: string;
  role: string;
  connectedArchitectures: string[];
  signal: string;
  status: string;
  metrics: { label: string; value: string }[];
}

/**
 * Technical database mapping each skill to deep architectural telemetry,
 * real-world portfolio deployments, and performance characteristics.
 */
const SKILL_METADATA_MAP: Record<string, SkillMetadata> = {
  TypeScript: {
    category: 'Languages',
    role: 'Strict compile-time verification, generics algebra, and high-concurrency type safety contracts across client and server.',
    connectedArchitectures: ['Next.js App Architecture', 'GitChat Context Engine', 'Production Portfolio'],
    signal: '99.8%',
    status: 'PRIMARY WEAPON',
    metrics: [
      { label: 'TYPE SAFETY', value: '100% STRICT' },
      { label: 'COMPILER', value: 'NO-IMPLICIT-ANY' },
    ],
  },
  JS: {
    category: 'Languages',
    role: 'Asynchronous event loop execution, DOM manipulation primitives, and modern ESNext capabilities.',
    connectedArchitectures: ['Solara Weather Engine', 'Realtime Web Sockets', 'Client Dashboards'],
    signal: '98.5%',
    status: 'CORE BEDROCK',
    metrics: [
      { label: 'STANDARDS', value: 'ES2024 SPEC' },
      { label: 'RUNTIME', value: 'V8 JIT' },
    ],
  },
  'C++': {
    category: 'Languages',
    role: 'Low-level memory management, pointer arithmetic, cache locality, and high-performance algorithmic structures.',
    connectedArchitectures: ['UMT CS Foundations', 'Memory Allocators', 'Systems Computing'],
    signal: '94.6%',
    status: 'SYSTEMS CORE',
    metrics: [
      { label: 'PARADIGM', value: 'ZERO-COST' },
      { label: 'ALLOCATION', value: 'MANUAL HEAP/STACK' },
    ],
  },
  'C#': {
    category: 'Languages',
    role: 'Object-oriented architecture, Unity game loop scripting, and deterministic slingshot kinematic systems.',
    connectedArchitectures: ['SlingKick Physics Game', 'Mindstorm Game Jam', 'Gameplay Systems'],
    signal: '95.2%',
    status: 'GAMEPLAY ENGINE',
    metrics: [
      { label: 'FRAME RATE', value: 'LOCKED 60 FPS' },
      { label: 'RUNTIME', value: '.NET / IL2CPP' },
    ],
  },
  HTML: {
    category: 'Languages',
    role: 'Semantic HTML5 structure, accessible ARIA roles, and living standard document models.',
    connectedArchitectures: ['Portfolio Application', 'GDGoC Chapter Blog', 'Radix Systems Web'],
    signal: '99.9%',
    status: 'ACCESSIBLE DOM',
    metrics: [
      { label: 'COMPLIANCE', value: 'WCAG 2.1 AAA' },
      { label: 'SEMANTICS', value: 'HTML5 LIVING' },
    ],
  },
  CSS: {
    category: 'Languages',
    role: 'CSS Modules, hardware-accelerated 3D transforms, fluid typography clamp math, and glassmorphic shaders.',
    connectedArchitectures: ['Solara Glass UI', 'Portfolio Cybernetic Theme', 'Bento Perspective Grid'],
    signal: '99.4%',
    status: 'GPU ACCELERATED',
    metrics: [
      { label: 'COMPOSITION', value: 'GPU LAYERS' },
      { label: 'PARADIGM', value: 'SCOPED MODULES' },
    ],
  },
  'Next.js': {
    category: 'Frameworks',
    role: 'React Server Components, App Router, edge middleware, and hybrid ISR/SSR rendering pipelines.',
    connectedArchitectures: ['Byters Food Review', 'GitChat Assistant', 'Radix Systems', 'Portfolio'],
    signal: '99.9%',
    status: 'PRODUCTION PILOT',
    metrics: [
      { label: 'RENDERING', value: 'HYBRID RSC / SSR' },
      { label: 'ROUTING', value: 'APP ROUTER' },
    ],
  },
  'React.js': {
    category: 'Frameworks',
    role: 'Fiber reconciler, concurrent hooks, state coordination, and modular atomic component design.',
    connectedArchitectures: ['QuickDrop P2P Client', 'Solara Weather App', 'Interactive HUD'],
    signal: '99.6%',
    status: 'REACTIVE CORE',
    metrics: [
      { label: 'RECONCILER', value: 'REACT 19 FIBER' },
      { label: 'OPTIMIZATION', value: 'MEMOIZED HOOKS' },
    ],
  },
  'Node.js': {
    category: 'Frameworks',
    role: 'Asynchronous event-driven I/O, binary stream piping, and high-concurrency microservices.',
    connectedArchitectures: ['Backend Relay Gateways', 'Socket.IO Signal Nodes', 'API Gateways'],
    signal: '97.8%',
    status: 'BACKEND RUNTIME',
    metrics: [
      { label: 'ENGINE', value: 'LIBUV EVENT LOOP' },
      { label: 'THROUGHPUT', value: 'NON-BLOCKING I/O' },
    ],
  },
  'Express.js': {
    category: 'Frameworks',
    role: 'Middleware pipeline execution, RESTful endpoint dispatch, and request schema sanitization.',
    connectedArchitectures: ['Contact Transmission API', 'Socket Signaler', 'Microservice Routing'],
    signal: '96.9%',
    status: 'REST ENGINE',
    metrics: [
      { label: 'DISPATCH', value: 'SUB-5MS LATENCY' },
      { label: 'STRUCTURE', value: 'MODULAR MIDDLEWARE' },
    ],
  },
  'Tailwind CSS': {
    category: 'Frameworks',
    role: 'Atomic utility styling, custom design tokens, and JIT compilation.',
    connectedArchitectures: ['Byters Application UI', 'Rapid Layout Prototyping'],
    signal: '98.2%',
    status: 'UTILITY ENGINE',
    metrics: [
      { label: 'COMPILER', value: 'TAILWIND JIT' },
      { label: 'OUTPUT', value: 'ZERO-WASTE PURGE' },
    ],
  },
  Bootstrap: {
    category: 'Frameworks',
    role: 'Standardized responsive breakpoints, flexbox layout utilities, and rapid component scaffolding.',
    connectedArchitectures: ['Client Dashboards', 'Legacy Interfaces'],
    signal: '95.0%',
    status: 'GRID UTILITY',
    metrics: [
      { label: 'BREAKPOINTS', value: '12-COLUMN FLEX' },
      { label: 'USAGE', value: 'RAPID SCAFFOLD' },
    ],
  },
  'RAG Pipelines': {
    category: 'Systems & AI',
    role: 'Retrieval-Augmented Generation, recursive document chunking, semantic vector indexing, and real-time LLM context injection.',
    connectedArchitectures: ['GitChat Codebase Assistant', 'Repository Semantic Graph', 'Local Ollama Models'],
    signal: '99.5%',
    status: 'AI CORE SPECIALIZATION',
    metrics: [
      { label: 'CHUNK STRATEGY', value: '512 TOKENS / 64 OVERLAP' },
      { label: 'RETRIEVAL', value: 'HYBRID COSINE K-NN' },
    ],
  },
  'Vector Search': {
    category: 'Systems & AI',
    role: 'High-dimensional embeddings projection, nearest neighbor indexing, and semantic similarity scoring.',
    connectedArchitectures: ['Byters Food Review Matching', 'GitChat Code Semantics'],
    signal: '99.0%',
    status: 'VECTOR ENGINE',
    metrics: [
      { label: 'EMBEDDINGS', value: '1536-D GEOMETRIC' },
      { label: 'DISTANCE', value: 'COSINE METRIC' },
    ],
  },
  'Socket.IO': {
    category: 'Systems & AI',
    role: 'Bidirectional low-latency event synchronization, room multiplexing, and WebRTC peer signaling coordination.',
    connectedArchitectures: ['QuickDrop P2P Signaling', 'Realtime Sync Rooms', 'Lobby Coordination'],
    signal: '98.4%',
    status: 'REALTIME SIGNALING',
    metrics: [
      { label: 'TRANSPORT', value: 'WEBSOCKET / POLLING' },
      { label: 'LATENCY', value: 'SUB-15MS ROUNDTRIP' },
    ],
  },
  PeerJS: {
    category: 'Systems & AI',
    role: 'Decentralized WebRTC DataChannel mesh orchestration, direct client-to-client binary file streaming with zero server storage.',
    connectedArchitectures: ['QuickDrop Direct File Pipe', 'Encrypted P2P Transmissions'],
    signal: '97.9%',
    status: 'DECENTRALIZED MESH',
    metrics: [
      { label: 'ENCRYPTION', value: 'DTLS / SRTP' },
      { label: 'SERVER LOAD', value: 'ZERO STORAGE RELAY' },
    ],
  },
  LangChain: {
    category: 'Systems & AI',
    role: 'Agentic workflows, prompt chaining, document loaders, vector store retrievers, and Ollama integration.',
    connectedArchitectures: ['GitChat Repository Analysis', 'Context Window Synthesizer'],
    signal: '96.8%',
    status: 'AGENTIC PIPELINE',
    metrics: [
      { label: 'REASONING', value: 'MULTI-STEP RAG' },
      { label: 'INTEGRATIONS', value: 'LOCAL OLLAMA + CLOUD' },
    ],
  },
  'Redis (Upstash)': {
    category: 'Systems & AI',
    role: 'Serverless in-memory key-value caching, distributed locking, and token-bucket API rate limiting.',
    connectedArchitectures: ['API Rate Protection', 'Fast Session Store', 'In-Memory Cache'],
    signal: '98.6%',
    status: 'DISTRIBUTED CACHE',
    metrics: [
      { label: 'COMPLEXITY', value: 'O(1) ACCESS TIME' },
      { label: 'GLOBAL LATENCY', value: '<10MS ANYCAST' },
    ],
  },
  Unity: {
    category: 'Systems & AI',
    role: '2D physics simulations, custom trajectory solvers, slingshot kinematics, and collision detection for game jams.',
    connectedArchitectures: ['SlingKick Mindstorm Winner', 'Physics Puzzle Architecture'],
    signal: '96.0%',
    status: 'PHYSICS SIMULATOR',
    metrics: [
      { label: 'ENGINE', value: 'RIGIDBODY2D SOLVER' },
      { label: 'FRAME RATE', value: '60 FPS LOCKED' },
    ],
  },
  'LLM APIs': {
    category: 'Systems & AI',
    role: 'Streaming token generation, structured function calling, prompt engineering, and Vercel AI SDK integrations.',
    connectedArchitectures: ['GitChat Assistant', 'Radix Systems AI Workflows'],
    signal: '98.7%',
    status: 'INTELLIGENCE LAYER',
    metrics: [
      { label: 'STREAMING', value: 'SSE SERVER-SENT' },
      { label: 'ADAPTER', value: 'VERCEL AI SDK' },
    ],
  },
  Firebase: {
    category: 'Systems & AI',
    role: 'Cloud Firestore document storage, real-time listeners, and cloud security rules.',
    connectedArchitectures: ['GDGoC Chapter Projects', 'Rapid Cloud Prototyping'],
    signal: '96.2%',
    status: 'SERVERLESS CLOUD',
    metrics: [
      { label: 'SYNC', value: 'REALTIME LISTENERS' },
      { label: 'DEPLOYMENT', value: 'SERVERLESS RULES' },
    ],
  },
  Cloudinary: {
    category: 'Systems & AI',
    role: 'Dynamic media transformations, format optimization (WebP/AVIF), and edge CDN asset distribution.',
    connectedArchitectures: ['QuickDrop Media Uploads', 'Portfolio Asset Distribution'],
    signal: '97.5%',
    status: 'MEDIA CDN',
    metrics: [
      { label: 'OPTIMIZATION', value: 'AUTOMATIC AVIF/WEBP' },
      { label: 'NETWORK', value: 'GLOBAL EDGE CDN' },
    ],
  },
  Git: {
    category: 'Systems & AI',
    role: 'Distributed version control, directed acyclic commit graphs, branching topology, and interactive rebasing.',
    connectedArchitectures: ['GitChat Codebase Ingestion', 'Production Engineering Workflow'],
    signal: '99.7%',
    status: 'VERSION CONTROL',
    metrics: [
      { label: 'TOPOLOGY', value: 'DAG COMMIT GRAPH' },
      { label: 'STRATEGY', value: 'ATOMIC COMMITS' },
    ],
  },
  GitHub: {
    category: 'Systems & AI',
    role: 'CI/CD workflows, pull request reviews, repository webhooks, and automated build pipelines.',
    connectedArchitectures: ['Automated Deployments', 'GitChat Repository Integration'],
    signal: '99.2%',
    status: 'CI/CD WORKFLOW',
    metrics: [
      { label: 'PIPELINES', value: 'GITHUB ACTIONS' },
      { label: 'AUTOMATION', value: 'CONTINUOUS DEPLOY' },
    ],
  },
  Postman: {
    category: 'Systems & AI',
    role: 'API endpoint contract testing, automated regression collections, and environment mocking.',
    connectedArchitectures: ['Contact API Verification', 'Signaling Route Audits'],
    signal: '96.4%',
    status: 'API AUDITING',
    metrics: [
      { label: 'TESTING', value: 'AUTOMATED RUNNERS' },
      { label: 'SPEC', value: 'REST PROTOCOL' },
    ],
  },
  Vercel: {
    category: 'Systems & AI',
    role: 'Edge computing network, serverless API execution, instant preview environments, and global Anycast CDN.',
    connectedArchitectures: ['Byters Food Review', 'GitChat Assistant', 'Portfolio Production'],
    signal: '99.8%',
    status: 'EDGE HOSTING',
    metrics: [
      { label: 'EDGE NETWORK', value: 'GLOBAL ANYCAST' },
      { label: 'DEPLOYS', value: 'ATOMIC ZERO-DOWNTIME' },
    ],
  },
  'Arduino Uno': {
    category: 'Systems & AI',
    role: 'Embedded C++ firmware, hardware pin I/O, interrupt handlers, and analog sensor calibration.',
    connectedArchitectures: ['Hardware Prototyping Lab', 'Embedded Systems'],
    signal: '93.5%',
    status: 'HARDWARE FIRMWARE',
    metrics: [
      { label: 'CLOCK', value: '16 MHZ ATMEGA328P' },
      { label: 'I/O PROTOCOLS', value: 'GPIO / PWM / I2C' },
    ],
  },
  WordPress: {
    category: 'Systems & AI',
    role: 'Headless CMS implementations, custom REST API endpoints, and client content architecture.',
    connectedArchitectures: ['Radix Systems Solutions', 'Client Content Portals'],
    signal: '94.2%',
    status: 'CONTENT ENGINE',
    metrics: [
      { label: 'INTEGRATION', value: 'HEADLESS REST' },
      { label: 'EXTENSIONS', value: 'CUSTOM PLUGINS' },
    ],
  },
  MongoDB: {
    category: 'Databases',
    role: 'Flexible BSON document modeling, compound index optimization, multi-stage aggregation pipelines, and replica sets.',
    connectedArchitectures: ['Byters Reviews & Venues', 'GitChat Chat History', 'QuickDrop Session Meta'],
    signal: '98.8%',
    status: 'PRIMARY DOCUMENT STORE',
    metrics: [
      { label: 'INDEXING', value: 'COMPOUND / 2DSPHERE' },
      { label: 'PIPELINES', value: 'MULTI-STAGE AGG' },
    ],
  },
  MySQL: {
    category: 'Databases',
    role: 'Relational normalization, ACID transactional guarantees, foreign key integrity, and indexed JOIN performance.',
    connectedArchitectures: ['UMT Relational Database Lab', 'Structured Schemas'],
    signal: '96.5%',
    status: 'RELATIONAL ENGINE',
    metrics: [
      { label: 'TRANSACTIONS', value: 'ACID ISOLATION' },
      { label: 'STORAGE', value: 'INNODB B-TREE' },
    ],
  },
};

/**
 * Fallback generator for dynamically passed skills.
 */
function getSkillMetadata(skillName: string, category: string): SkillMetadata {
  if (SKILL_METADATA_MAP[skillName]) {
    return SKILL_METADATA_MAP[skillName];
  }
  return {
    category,
    role: `Architectural implementation and active production deployment within modern engineering stacks.`,
    connectedArchitectures: ['Portfolio Stack', 'Full-Stack Architecture'],
    signal: '98.0%',
    status: 'DEPLOYED NODE',
    metrics: [
      { label: 'STATUS', value: 'CALIBRATED' },
      { label: 'RUNTIME', value: 'ACTIVE' },
    ],
  };
}

type FilterCategory = 'ALL' | 'LANGUAGES' | 'FRAMEWORKS' | 'SYSTEMS & AI' | 'DATABASES';

/**
 * Lucius Fox Applied Sciences — SkillsMatrix
 *
 * Interactive Competency Radar presenting grouped skill pills wrapped in <Magnet>,
 * dynamic energetic neon hover glow, and a live Architectural Telemetry Radar HUD.
 */
export default function SkillsMatrix({ competencies }: SkillsMatrixProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [activeSkill, setActiveSkill] = useState<string>('RAG Pipelines');

  // Parallax subtle title shift
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [25, -25]);

  // Group competencies into the 4 architectural categories
  const groups = useMemo(() => {
    return [
      {
        id: 'languages',
        title: 'Languages',
        code: 'CAT-01',
        skills: competencies.languages,
      },
      {
        id: 'frameworks',
        title: 'Frameworks',
        code: 'CAT-02',
        skills: competencies.frameworks,
      },
      {
        id: 'systems',
        title: 'Systems & AI',
        code: 'CAT-03',
        skills: competencies.backendDevOps,
      },
      {
        id: 'databases',
        title: 'Databases',
        code: 'CAT-04',
        skills: competencies.databases,
      },
    ];
  }, [competencies]);

  // Filter groups based on active filter button
  const visibleGroups = useMemo(() => {
    if (activeFilter === 'ALL') return groups;
    if (activeFilter === 'LANGUAGES') return groups.filter((g) => g.id === 'languages');
    if (activeFilter === 'FRAMEWORKS') return groups.filter((g) => g.id === 'frameworks');
    if (activeFilter === 'SYSTEMS & AI') return groups.filter((g) => g.id === 'systems');
    if (activeFilter === 'DATABASES') return groups.filter((g) => g.id === 'databases');
    return groups;
  }, [groups, activeFilter]);

  // Active skill telemetry
  const activeMeta = useMemo(() => {
    if (!activeSkill) return null;
    let foundCategory = 'Architecture';
    for (const g of groups) {
      if (g.skills.includes(activeSkill)) {
        foundCategory = g.title;
        break;
      }
    }
    return getSkillMetadata(activeSkill, foundCategory);
  }, [activeSkill, groups]);

  return (
    <section ref={sectionRef} className={styles.section} id="skills">
      {/* Background cyber grid & ambient aura */}
      <div className={styles.gridBackground} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.badgeWrapper}>
          <span className={styles.badgeDot} aria-hidden="true" />
          <span className={styles.badgeText}>
            <DecryptedText
              text="02 // ARCHITECTURAL COMPETENCIES & RADAR"
              speed={30}
              maxIterations={10}
              animateOn="view"
            />
          </span>
        </div>

        <div className={styles.headerRow}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ type: 'spring', stiffness: 90, damping: 18 }}
            style={{ y: titleY }}
          >
            Competency Radar<span className={styles.titleDot}>.</span>
          </motion.h2>

          {/* Filter Bar */}
          <div className={styles.filterBar} role="tablist" aria-label="Skill category filters">
            {(['ALL', 'LANGUAGES', 'FRAMEWORKS', 'SYSTEMS & AI', 'DATABASES'] as FilterCategory[]).map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === filter}
                  className={`${styles.filterBtn} ${
                    activeFilter === filter ? styles.filterBtnActive : ''
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>

        {/* Matrix Grid: Left = Grouped Pills, Right = Sticky Radar HUD */}
        <div className={styles.matrixGrid}>
          {/* Left Column: Skill Clusters */}
          <div className={styles.skillsColumn}>
            {visibleGroups.map((group) => (
              <motion.div
                key={group.id}
                className={styles.categoryGroup}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4 }}
              >
                <div className={styles.groupHeader}>
                  <div className={styles.groupTitle}>
                    <span className={styles.groupCode}>[{group.code}]</span>
                    <span>{group.title}</span>
                  </div>
                  <span className={styles.groupCount}>{group.skills.length} NODES</span>
                </div>

                <div className={styles.pillsCluster}>
                  {group.skills.map((skill) => {
                    const isActive = activeSkill === skill;
                    return (
                      <Magnet
                        key={skill}
                        padding={12}
                        magnetStrength={0.25}
                        className={styles.magnetItem}
                      >
                        <button
                          type="button"
                          className={`${styles.skillPill} ${
                            isActive ? styles.skillPillActive : ''
                          }`}
                          onMouseEnter={() => setActiveSkill(skill)}
                          onFocus={() => setActiveSkill(skill)}
                          onClick={() => setActiveSkill(skill)}
                          aria-label={`Inspect skill: ${skill}`}
                        >
                          <span className={styles.pillDot} aria-hidden="true" />
                          <span className={styles.pillText}>{skill}</span>
                        </button>
                      </Magnet>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Sticky Radar Telemetry HUD */}
          <div className={styles.hudStickyWrapper}>
            <div className={styles.hudCard}>
              <span className={styles.cornerTL} aria-hidden="true" />
              <span className={styles.cornerTR} aria-hidden="true" />
              <span className={styles.cornerBL} aria-hidden="true" />
              <span className={styles.cornerBR} aria-hidden="true" />

              {/* HUD Header Banner */}
              <div className={styles.hudTopBanner}>
                <span className={styles.hudCallsign}>
                  RADAR // {activeMeta ? activeMeta.category.toUpperCase() : 'SYS.DIAGNOSTICS'}
                </span>
                <span className={styles.hudStatusTag}>
                  <span className={styles.hudStatusDot} />
                  <span>{activeMeta ? activeMeta.status : 'ONLINE'}</span>
                </span>
              </div>

              {/* Animated Radar Visual Graphic */}
              <div className={styles.radarGraphicWrapper} aria-hidden="true">
                <svg
                  className={styles.radarGraphicSvg}
                  viewBox="0 0 300 150"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="150" cy="75" r="30" stroke="currentColor" strokeWidth="0.8" />
                  <circle cx="150" cy="75" r="60" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 5" />
                  <circle cx="150" cy="75" r="70" stroke="currentColor" strokeWidth="1" />
                  <line x1="10" y1="75" x2="290" y2="75" stroke="currentColor" strokeWidth="0.6" />
                  <line x1="150" y1="5" x2="150" y2="145" stroke="currentColor" strokeWidth="0.6" />
                  {/* Rotating Radar Sweep Arm */}
                  <g className={styles.radarSweepHand}>
                    <line x1="150" y1="75" x2="150" y2="5" stroke="#ccff00" strokeWidth="1.5" strokeOpacity="0.8" />
                    <path d="M 150 75 L 120 15 A 70 70 0 0 1 150 5 Z" fill="#ccff00" fillOpacity="0.08" />
                  </g>
                  {/* Blinking Radar Target Reticle */}
                  <circle cx="175" cy="55" r="4" fill="#ccff00" />
                  <circle cx="175" cy="55" r="8" stroke="#ccff00" strokeWidth="0.8" strokeOpacity="0.6" />
                </svg>
              </div>

              {/* Dynamic Skill Metadata Body */}
              <AnimatePresence mode="wait">
                {activeMeta ? (
                  <motion.div
                    key={activeSkill}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className={styles.activeSkillTitle}>{activeSkill}</h3>
                    <div className={styles.activeSkillCategory}>
                      DOMAIN // {activeMeta.category} • SIGNAL {activeMeta.signal}
                    </div>

                    <p className={styles.activeRoleDescription}>{activeMeta.role}</p>

                    {/* Connected Architectures */}
                    <div className={styles.connectedSection}>
                      <span className={styles.connectedLabel}>Connected Architectures:</span>
                      <div className={styles.connectedChips}>
                        {activeMeta.connectedArchitectures.map((arch) => (
                          <span key={arch} className={styles.connectedChip}>
                            <span className={styles.chipIndicator}>›</span>
                            <span>{arch}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Telemetry Specs */}
                    <div className={styles.metricsGrid}>
                      {activeMeta.metrics.map((m) => (
                        <div key={m.label} className={styles.metricBox}>
                          <span className={styles.metricLabel}>{m.label}</span>
                          <span className={styles.metricVal}>{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <div className={styles.standbyState}>
                    <div className={styles.standbyIcon}>
                      <Crosshair size={28} aria-hidden="true" />
                    </div>
                    <div className={styles.standbyTitle}>RADAR STANDBY</div>
                    <p className={styles.standbyText}>
                      Hover or select any capability node to inspect architectural topology, system
                      roles, and connected production deployments.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
