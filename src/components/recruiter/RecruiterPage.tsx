'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './RecruiterPage.module.css';

type IntensityLevel = 0 | 1 | 2 | 3;

interface IntensityMeta {
  readonly level: IntensityLevel;
  readonly label: string;
  readonly badge: string;
}

const INTENSITY_METAS: readonly IntensityMeta[] = [
  { level: 0, label: '0', badge: '0 // PURE TEXT' },
  { level: 1, label: '1', badge: '1 // SUMMARY' },
  { level: 2, label: '2', badge: '2 // DOSSIER' },
  { level: 3, label: '3', badge: '3 // FULL SPEC' },
];

const fadeTransition = {
  duration: 0.25,
  ease: [0.16, 1, 0.3, 1] as const,
};

export default function RecruiterPage() {
  const [level, setLevel] = useState<IntensityLevel>(1);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'minimal');
    document.documentElement.setAttribute('data-mode', 'dark');
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;

    setContactStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: 'Recruiter Outreach',
          message: contactMsg,
        }),
      });

      if (res.ok) {
        setContactStatus('success');
        setContactName('');
        setContactEmail('');
        setContactMsg('');
      } else {
        setContactStatus('error');
      }
    } catch {
      setContactStatus('error');
    }
  };

  return (
    <div className={styles.recruiterWrapper}>
      <header className={styles.topNav}>
        <div className={styles.brandText}>MUHAMMAD TALIB IBRAHIM</div>
        <div className={styles.modeIndicator}>
          RECRUITER MODE // INTENSITY: LEVEL {level}
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {/* ════ LEVEL 0: PURE MINIMAL TEXT (LEAST INTENSITY) ════ */}
          {level === 0 && (
            <motion.div
              key="intensity-level-0"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={fadeTransition}
              className={styles.levelZeroContainer}
            >
              <div className={styles.levelZeroBlunt}>
                <p className={styles.bluntLine}>
                  Muhammad Talib Ibrahim — Software Engineer (BS Computer Science, UMT Lahore, 3.60 GPA).
                </p>
                <p className={styles.bluntLine}>
                  Specializing in high-concurrency Full-Stack TypeScript systems, real-time WebSockets/WebRTC networking, and AI-powered vector search (Byters, QuickDrop, GitChat).
                </p>
                <p className={styles.bluntLine}>
                  Open to software engineering roles. Contact:{' '}
                  <a href="mailto:talibibrahim04@gmail.com" className={styles.inlineLink}>
                    talibibrahim04@gmail.com
                  </a>{' '}
                  | +92 3134447171 |{' '}
                  <a
                    href="https://github.com/TalibIbrahim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.inlineLink}
                  >
                    GitHub
                  </a>{' '}
                  |{' '}
                  <a
                    href="https://linkedin.com/in/muhammad-talib-ibrahim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.inlineLink}
                  >
                    LinkedIn
                  </a>
                </p>
              </div>

              <div className={styles.pureTextActions}>
                <a href="mailto:talibibrahim04@gmail.com" className={styles.simpleLink}>
                  talibibrahim04@gmail.com
                </a>
                <a
                  href="https://github.com/TalibIbrahim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.simpleLink}
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/muhammad-talib-ibrahim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.simpleLink}
                >
                  LinkedIn
                </a>
                <button
                  type="button"
                  onClick={() => setLevel(3)}
                  className={styles.simpleLink}
                  style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
                >
                  Request Official Resume
                </button>
              </div>
            </motion.div>
          )}

          {/* ════ LEVEL 1: EXECUTIVE SUMMARY ════ */}
          {level === 1 && (
            <motion.div
              key="intensity-level-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={fadeTransition}
              className={styles.levelOneContainer}
            >
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>Candidate Record</div>
                <div className={styles.factsGrid}>
                  <div className={styles.factRow}>
                    <span className={styles.factLabel}>Degree &amp; GPA</span>
                    <span className={styles.factValue}>BS Computer Science (3.60 GPA, Merit Scholar)</span>
                  </div>
                  <div className={styles.factRow}>
                    <span className={styles.factLabel}>Institution</span>
                    <span className={styles.factValue}>UMT Lahore (Expected Grad: 2027)</span>
                  </div>
                  <div className={styles.factRow}>
                    <span className={styles.factLabel}>Core Languages</span>
                    <span className={styles.factValue}>TypeScript, JavaScript (ES6+), C++, C#</span>
                  </div>
                  <div className={styles.factRow}>
                    <span className={styles.factLabel}>Availability</span>
                    <span className={styles.factValue}>Immediate / Full-Time Software Engineer</span>
                  </div>
                </div>
              </div>

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>Top 3 Engineering Highlights</div>
                
                <div className={styles.projectListItem}>
                  <div className={styles.projectListTitle}>
                    <span>1. Byters — AI Food Discovery &amp; Group Cart Engine</span>
                    <span style={{ fontSize: '0.75rem', color: '#888888' }}>Flagship</span>
                  </div>
                  <p className={styles.projectListDesc}>
                    Full-stack multi-vendor food platform with MongoDB Atlas Vector Search embeddings for semantic culinary recommendation, and Socket.IO WebSockets for multi-device concurrent group cart coordination and live checkout tracking.
                  </p>
                  <div className={styles.projectLinksRow}>
                    <a href="https://byters.vercel.app" target="_blank" rel="noopener noreferrer" className={styles.simpleLink}>
                      Live App
                    </a>
                    <a href="https://github.com/TalibIbrahim" target="_blank" rel="noopener noreferrer" className={styles.simpleLink}>
                      Inspect Source Code
                    </a>
                  </div>
                </div>

                <div className={styles.projectListItem}>
                  <div className={styles.projectListTitle}>
                    <span>2. QuickDrop — WebRTC Peer-to-Peer Transfer</span>
                    <span style={{ fontSize: '0.75rem', color: '#888888' }}>Networking</span>
                  </div>
                  <p className={styles.projectListDesc}>
                    Direct browser-to-browser file transfer pipeline. Bypasses intermediate storage servers using WebRTC DataChannels and PeerJS for encrypted chunked binary streams with instant QR pairing.
                  </p>
                  <div className={styles.projectLinksRow}>
                    <a href="https://quickdrop-file.vercel.app" target="_blank" rel="noopener noreferrer" className={styles.simpleLink}>
                      Live App
                    </a>
                    <a href="https://github.com/TalibIbrahim" target="_blank" rel="noopener noreferrer" className={styles.simpleLink}>
                      Inspect Source Code
                    </a>
                  </div>
                </div>

                <div className={styles.projectListItem}>
                  <div className={styles.projectListTitle}>
                    <span>3. GitChat — AST Vector Codebase RAG Assistant</span>
                    <span style={{ fontSize: '0.75rem', color: '#888888' }}>Applied AI</span>
                  </div>
                  <p className={styles.projectListDesc}>
                    Retrieval-Augmented Generation agent for GitHub codebases. Ingests source trees into an AST vector store to deliver context-anchored reasoning across large multi-file architectures.
                  </p>
                  <div className={styles.projectLinksRow}>
                    <a href="https://github.com/TalibIbrahim/GitChat" target="_blank" rel="noopener noreferrer" className={styles.simpleLink}>
                      Inspect Source Code
                    </a>
                  </div>
                </div>
              </div>

              <div className={styles.pureTextActions}>
                <a href="mailto:talibibrahim04@gmail.com" className={styles.simpleLink}>
                  Email: talibibrahim04@gmail.com
                </a>
                <a href="https://github.com/TalibIbrahim" target="_blank" rel="noopener noreferrer" className={styles.simpleLink}>
                  GitHub
                </a>
                <a href="https://linkedin.com/in/muhammad-talib-ibrahim" target="_blank" rel="noopener noreferrer" className={styles.simpleLink}>
                  LinkedIn
                </a>
              </div>
            </motion.div>
          )}

          {/* ════ LEVEL 2: STRUCTURED DOSSIER ════ */}
          {level === 2 && (
            <motion.div
              key="intensity-level-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={fadeTransition}
              className={styles.levelTwoContainer}
            >
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>Comprehensive Engineering Spec</div>
                <div className={styles.specTable}>
                  <div className={styles.specCol}>
                    <div className={styles.specCategoryTitle}>Frontend Architecture</div>
                    <div className={styles.specItemList}>
                      Next.js 14 (App Router, Server Components, Streaming SSR), React.js 18, TypeScript (Strict Mode), Redux Toolkit, Tailwind CSS, Framer Motion.
                    </div>
                  </div>
                  <div className={styles.specCol}>
                    <div className={styles.specCategoryTitle}>Backend &amp; Networking</div>
                    <div className={styles.specItemList}>
                      Node.js, Express.js, Socket.IO (WebSocket rooms), WebRTC (DataChannels, PeerJS), LangChain RAG pipelines, RESTful APIs, Vercel AI SDK.
                    </div>
                  </div>
                  <div className={styles.specCol}>
                    <div className={styles.specCategoryTitle}>Databases &amp; Storage</div>
                    <div className={styles.specItemList}>
                      MongoDB Atlas, Atlas Vector Search (KNN indexing), MySQL, Redis (Upstash caching), Firebase Auth, Cloudinary CDN.
                    </div>
                  </div>
                  <div className={styles.specCol}>
                    <div className={styles.specCategoryTitle}>Credentials &amp; Honors</div>
                    <div className={styles.specItemList}>
                      BS Computer Science (3.60 GPA, Merit Scholar), The MERN Fullstack Guide (Schwarzmüller), React Complete Guide, Google AI Fundamentals.
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>Selected Works &amp; Architecture Records</div>

                <div className={styles.dossierProjectCard}>
                  <div className={styles.dossierProjectHeader}>
                    <div className={styles.dossierTitle}>BYTERS (Flagship)</div>
                    <div className={styles.dossierTag}>Full-Stack AI Culinary Platform</div>
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#cccccc' }}>
                    Engineered an AI-driven multi-vendor culinary ordering engine with real-time room synchronization.
                  </p>
                  <div style={{ fontSize: '0.85rem', color: '#a0a0a0', lineHeight: 1.6 }}>
                    • Vector Search: MongoDB Atlas Vector Search with OpenAI text-embedding-3 embeddings for dietary meal recommendations.
                    <br />
                    • WebSocket Rooms: Socket.IO multi-device joint cart synchronization with host approvals and live price recalculations.
                    <br />
                    • Dispatch Telemetry: Multi-stage order tracking state machine and delivery window estimation.
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                    <a href="https://byters.vercel.app" target="_blank" rel="noopener noreferrer" className={styles.simpleLink}>
                      Live App <ExternalLink size={11} style={{ display: 'inline' }} />
                    </a>
                    <a href="https://github.com/TalibIbrahim" target="_blank" rel="noopener noreferrer" className={styles.simpleLink}>
                      GitHub Repository <ExternalLink size={11} style={{ display: 'inline' }} />
                    </a>
                  </div>
                </div>

                <div className={styles.dossierProjectCard}>
                  <div className={styles.dossierProjectHeader}>
                    <div className={styles.dossierTitle}>QUICKDROP</div>
                    <div className={styles.dossierTag}>Peer-to-Peer Data Engine</div>
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#cccccc' }}>
                    High-throughput browser-to-browser file transfer bypassing intermediary cloud storage servers.
                  </p>
                  <div style={{ fontSize: '0.85rem', color: '#a0a0a0', lineHeight: 1.6 }}>
                    • WebRTC DataChannels: Direct P2P pipe with end-to-end encrypted chunked byte streams.
                    <br />
                    • Signaling: Lightweight PeerJS signaling server used solely for handshake initiation.
                    <br />
                    • Device Pairing: Instant connection via QR code or session pairing code.
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                    <a href="https://quickdrop-file.vercel.app" target="_blank" rel="noopener noreferrer" className={styles.simpleLink}>
                      Live App <ExternalLink size={11} style={{ display: 'inline' }} />
                    </a>
                    <a href="https://github.com/TalibIbrahim" target="_blank" rel="noopener noreferrer" className={styles.simpleLink}>
                      GitHub Repository <ExternalLink size={11} style={{ display: 'inline' }} />
                    </a>
                  </div>
                </div>

                <div className={styles.dossierProjectCard}>
                  <div className={styles.dossierProjectHeader}>
                    <div className={styles.dossierTitle}>GITCHAT</div>
                    <div className={styles.dossierTag}>AST Codebase RAG Agent</div>
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#cccccc' }}>
                    Retrieval-Augmented Generation assistant for large multi-file GitHub repositories.
                  </p>
                  <div style={{ fontSize: '0.85rem', color: '#a0a0a0', lineHeight: 1.6 }}>
                    • Code Tokenization: Ingests repositories and tokenizes source trees into an AST vector store.
                    <br />
                    • Source Attribution: Every answer is anchored to exact file and line references.
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                    <a href="https://github.com/TalibIbrahim/GitChat" target="_blank" rel="noopener noreferrer" className={styles.simpleLink}>
                      GitHub Repository <ExternalLink size={11} style={{ display: 'inline' }} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════ LEVEL 3: FULL SPEC & CONTACT FORM ════ */}
          {level === 3 && (
            <motion.div
              key="intensity-level-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={fadeTransition}
              className={styles.levelThreeContainer}
            >
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>Key Engineering Metrics &amp; Credentials</div>
                <div className={styles.metricsGrid}>
                  <div className={styles.metricCard}>
                    <div className={styles.metricValue}>3.60 GPA</div>
                    <div className={styles.metricLabel}>BS Computer Science</div>
                    <div className={styles.metricSub}>UMT Lahore · Dean&apos;s Honor Roll · Merit Scholar</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricValue}>Zero-Hop P2P</div>
                    <div className={styles.metricLabel}>WebRTC Mesh DataChannels</div>
                    <div className={styles.metricSub}>QuickDrop · Encrypted chunked binary pipe</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricValue}>1536-Dim RAG</div>
                    <div className={styles.metricLabel}>Vector Search &amp; AST Analysis</div>
                    <div className={styles.metricSub}>Atlas Vector Search + LangChain (Byters, GitChat)</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricValue}>Full-Stack TS</div>
                    <div className={styles.metricLabel}>End-to-End Strict Architecture</div>
                    <div className={styles.metricSub}>Next.js 14 App Router · Socket.IO · Node.js</div>
                  </div>
                </div>
              </div>

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>Full Architecture &amp; Technology Stack</div>
                <div className={styles.specTable}>
                  <div className={styles.specCol}>
                    <div className={styles.specCategoryTitle}>Frontend Architecture</div>
                    <div className={styles.specItemList}>
                      Next.js 14 (App Router, Server Components, Streaming SSR), React 18, TypeScript (Strict Mode), Redux Toolkit, CSS Modules, Framer Motion.
                    </div>
                  </div>
                  <div className={styles.specCol}>
                    <div className={styles.specCategoryTitle}>Backend &amp; Networking</div>
                    <div className={styles.specItemList}>
                      Node.js, Express.js, Socket.IO (WebSocket rooms), WebRTC (DataChannels, PeerJS), LangChain RAG pipelines, RESTful APIs, Vercel AI SDK.
                    </div>
                  </div>
                  <div className={styles.specCol}>
                    <div className={styles.specCategoryTitle}>Databases &amp; Storage</div>
                    <div className={styles.specItemList}>
                      MongoDB Atlas, Atlas Vector Search (KNN indexing), MySQL, Redis (Upstash caching), Firebase Auth, Cloudinary CDN.
                    </div>
                  </div>
                  <div className={styles.specCol}>
                    <div className={styles.specCategoryTitle}>Credentials &amp; Honors</div>
                    <div className={styles.specItemList}>
                      BS Computer Science (3.60 GPA, Merit Scholar), The MERN Fullstack Guide, React Complete Guide, Google AI Fundamentals.
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>Career &amp; Engineering Timeline</div>

                <div className={styles.timelineItem}>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>Full-Stack Systems Engineer &amp; Consultant</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#888888' }}>2024 — Present · Lahore, PK</div>
                  <p style={{ fontSize: '0.9rem', color: '#a0a0a0', marginTop: '0.25rem' }}>
                    Architected production web applications, WebSockets room architectures, and vector AI search pipelines. Built Byters, QuickDrop, and GitChat.
                  </p>
                </div>

                <div className={styles.timelineItem}>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>BS in Computer Science — UMT Lahore</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#888888' }}>2023 — 2027 (Expected)</div>
                  <p style={{ fontSize: '0.9rem', color: '#a0a0a0', marginTop: '0.25rem' }}>
                    Cumulative 3.60 GPA with consistent Dean&apos;s Honor Roll. Core focus on distributed systems, data structures, network protocols, and artificial intelligence.
                  </p>
                </div>

                <div className={styles.timelineItem}>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>Mindstorm Studios Summer Game Jam</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#888888' }}>July 2024</div>
                  <p style={{ fontSize: '0.9rem', color: '#a0a0a0', marginTop: '0.25rem' }}>
                    Built SlingKick (physics-based 2D puzzle platformer in Unity/C#). Shipped complete game loop under strict 48-hour time constraint.
                  </p>
                </div>
              </div>

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>Direct Recruiter Uplink &amp; Resume Request</div>
                <p style={{ fontSize: '0.92rem', color: '#a0a0a0' }}>
                  Send a message directly to Muhammad Talib Ibrahim to receive the formal PDF resume, schedule an interview, or discuss open engineering roles.
                </p>

                {contactStatus === 'success' ? (
                  <div style={{ padding: '1rem', border: '1px solid #333333', background: '#0a0a0a', color: '#ffffff', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <CheckCircle2 size={16} />
                      <strong>Transmission Delivered</strong>
                    </div>
                    <div>Your message has been sent to talibibrahim04@gmail.com. Response window: &lt;24 hours.</div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className={styles.simpleForm}>
                    {contactStatus === 'error' && (
                      <div style={{ padding: '0.65rem', border: '1px solid #772222', color: '#ff8888', fontSize: '0.8rem' }}>
                        <AlertCircle size={14} style={{ display: 'inline', marginRight: 4 }} />
                        Failed to send. Please email directly at talibibrahim04@gmail.com
                      </div>
                    )}

                    <div className={styles.formField}>
                      <label htmlFor="rec-name" className={styles.formLabel}>
                        Recruiter / Company Name
                      </label>
                      <input
                        id="rec-name"
                        type="text"
                        required
                        placeholder="e.g. Sarah Jenkins (Tech Corp)"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label htmlFor="rec-email" className={styles.formLabel}>
                        Work Email
                      </label>
                      <input
                        id="rec-email"
                        type="email"
                        required
                        placeholder="s.jenkins@company.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label htmlFor="rec-msg" className={styles.formLabel}>
                        Message / Role Description
                      </label>
                      <textarea
                        id="rec-msg"
                        required
                        rows={4}
                        placeholder="State role title, team, salary range, or request resume..."
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        className={styles.formTextarea}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactStatus === 'sending'}
                      className={styles.formSubmitBtn}
                    >
                      {contactStatus === 'sending' ? 'Transmitting...' : 'Send Message / Request Resume'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ════ FIXED BOTTOM INTENSITY SLIDER (LEVEL 0 TO 3) ════ */}
      <aside className={styles.fixedSliderDock} aria-label="Recruiter Intensity Slider">
        <div className={styles.sliderSubtitle}>
          INTENSITY: ADJUST DETAIL LEVEL (0 = Blunt Text, 3 = Full Spec)
        </div>

        <div className={styles.sliderControlRow}>
          <span className={styles.sliderLabel}>INTENSITY:</span>

          <div className={styles.snapGroup}>
            {INTENSITY_METAS.map((m) => {
              const isActive = level === m.level;
              return (
                <button
                  key={m.level}
                  type="button"
                  onClick={() => setLevel(m.level)}
                  className={`${styles.snapBtn} ${isActive ? styles.snapBtnActive : ''}`}
                  aria-label={`Switch to intensity level ${m.level}`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          <span className={styles.currentBadge}>
            {INTENSITY_METAS[level].badge}
          </span>
        </div>
      </aside>
    </div>
  );
}
