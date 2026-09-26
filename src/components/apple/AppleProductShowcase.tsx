'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import styles from './AppleTheme.module.css';

const appleEase = [0.16, 1, 0.3, 1] as const;

const appleScrollTransition = {
  duration: 0.75,
  ease: appleEase,
};

export default function AppleProductShowcase() {
  return (
    <div className={styles.showcaseRoot}>
      {/* ════ KEYNOTE SLIDE 1: BYTERS (FLAGSHIP #1) ════ */}
      <section id="byters" className={styles.productSlide}>
        <motion.p
          className={styles.slideEyebrow}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={appleScrollTransition}
        >
          Flagship Architecture
        </motion.p>

        <motion.h2
          className={styles.slideTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ ...appleScrollTransition, delay: 0.1 }}
        >
          Byters. Pro food discovery. Down to the vector.
        </motion.h2>

        <motion.p
          className={styles.slideTagline}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ ...appleScrollTransition, delay: 0.15 }}
        >
          An AI-powered restaurant discovery platform featuring vector embeddings and collaborative group decision rooms. Dense with production engineering.
        </motion.p>

        <motion.div
          className={styles.productDisplayCard}
          initial={{ opacity: 0, y: 100, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.85, ease: appleEase }}
        >
          <div className={styles.productMockupWrapper}>
            <Image
              src="https://res.cloudinary.com/dk5pnej6r/image/upload/v1776194008/Radix%20Systems/cfaca28d-245a-47d2-b658-879a9d8d3c4c.png"
              alt="Byters Food Review Platform"
              width={1200}
              height={675}
              className={styles.productImage}
            />
          </div>

          <div className={styles.specsCalloutGrid}>
            <motion.div
              className={styles.specCalloutItem}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: appleEase, delay: 0.15 }}
            >
              <span className={styles.specMetric}>1536-DIM</span>
              <span className={styles.specLabel}>Vector Embeddings</span>
              <p className={styles.specDescription}>
                Semantic search understanding dietary preferences, atmosphere, and dish nuance.
              </p>
            </motion.div>

            <motion.div
              className={styles.specCalloutItem}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: appleEase, delay: 0.25 }}
            >
              <span className={styles.specMetric}>SYNC</span>
              <span className={styles.specLabel}>Group Decision Rooms</span>
              <p className={styles.specDescription}>
                Collaborative decision-making rooms powered by real-time state synchronization.
              </p>
            </motion.div>

            <motion.div
              className={styles.specCalloutItem}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: appleEase, delay: 0.35 }}
            >
              <span className={styles.specMetric}>STACK</span>
              <span className={styles.specLabel}>Next.js &amp; Redux</span>
              <p className={styles.specDescription}>
                Architected with MongoDB, Next.js App Router, and scalable edge deployment.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className={styles.productLinksBar}>
          <a
            href="https://byters.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryPillBtn}
          >
            <span>Launch Live App</span>
            <ExternalLink size={13} style={{ display: 'inline-block', marginLeft: '6px' }} />
          </a>
        </div>
      </section>

      {/* ════ KEYNOTE SLIDE 2: QUICKDROP (TOP #2) ════ */}
      <section id="quickdrop" className={styles.productSlide}>
        <motion.p
          className={styles.slideEyebrow}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={appleScrollTransition}
        >
          Distributed Networks
        </motion.p>

        <motion.h2
          className={styles.slideTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ ...appleScrollTransition, delay: 0.1 }}
        >
          QuickDrop. AirDrop for every browser.
        </motion.h2>

        <motion.p
          className={styles.slideTagline}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ ...appleScrollTransition, delay: 0.15 }}
        >
          Privacy-first peer-to-peer file sharing with WebRTC DataChannels. Direct browser-to-browser encryption with zero intermediate cloud storage.
        </motion.p>

        <motion.div
          className={styles.productDisplayCard}
          initial={{ opacity: 0, y: 100, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.85, ease: appleEase }}
        >
          <div className={styles.productMockupWrapper}>
            <Image
              src="https://res.cloudinary.com/dk5pnej6r/image/upload/v1776193606/Radix%20Systems/b37e4ed6-e19b-4811-8c42-2a645463ec5b.png"
              alt="QuickDrop P2P File Sharing"
              width={1200}
              height={675}
              className={styles.productImage}
            />
          </div>

          <div className={styles.specsCalloutGrid}>
            <motion.div
              className={styles.specCalloutItem}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: appleEase, delay: 0.15 }}
            >
              <span className={styles.specMetric}>0 SEC</span>
              <span className={styles.specLabel}>Storage Retention</span>
              <p className={styles.specDescription}>
                Files never touch a central server. Chunks stream directly memory-to-memory.
              </p>
            </motion.div>

            <motion.div
              className={styles.specCalloutItem}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: appleEase, delay: 0.25 }}
            >
              <span className={styles.specMetric}>WEBRTC</span>
              <span className={styles.specLabel}>DataChannel Mesh</span>
              <p className={styles.specDescription}>
                PeerJS network with TURN relay fallbacks for strict symmetric NAT networks.
              </p>
            </motion.div>

            <motion.div
              className={styles.specCalloutItem}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: appleEase, delay: 0.35 }}
            >
              <span className={styles.specMetric}>&lt; 15MS</span>
              <span className={styles.specLabel}>Socket.IO Signaling</span>
              <p className={styles.specDescription}>
                Rapid handshake connection with QR code camera pairing across desktop and mobile.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className={styles.productLinksBar}>
          <a
            href="https://quickdrop-file.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryPillBtn}
          >
            <span>Launch QuickDrop</span>
            <ExternalLink size={13} style={{ display: 'inline-block', marginLeft: '6px' }} />
          </a>
        </div>
      </section>

      {/* ════ KEYNOTE SLIDE 3: GITCHAT (TOP #3) ════ */}
      <section id="gitchat" className={styles.productSlide}>
        <motion.p
          className={styles.slideEyebrow}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={appleScrollTransition}
        >
          Applied Intelligence
        </motion.p>

        <motion.h2
          className={styles.slideTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ ...appleScrollTransition, delay: 0.1 }}
        >
          GitChat. Intelligence for entire codebases.
        </motion.h2>

        <motion.p
          className={styles.slideTagline}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ ...appleScrollTransition, delay: 0.15 }}
        >
          A RAG-powered developer assistant that streams semantic reasoning from local LLMs, indexed with MongoDB Atlas Vector Search.
        </motion.p>

        <motion.div
          className={styles.productDisplayCard}
          initial={{ opacity: 0, y: 100, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.85, ease: appleEase }}
        >
          <div className={styles.productMockupWrapper}>
            <Image
              src="https://res.cloudinary.com/dk5pnej6r/image/upload/v1776235651/Radix%20Systems/1f830205-26ac-4a5e-941e-410d1e9e7d44.png"
              alt="GitChat AI Codebase Assistant"
              width={1200}
              height={675}
              className={styles.productImage}
            />
          </div>

          <div className={styles.specsCalloutGrid}>
            <motion.div
              className={styles.specCalloutItem}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: appleEase, delay: 0.15 }}
            >
              <span className={styles.specMetric}>RAG</span>
              <span className={styles.specLabel}>Vector Retrieval</span>
              <p className={styles.specDescription}>
                Hierarchical AST parsing and recursive chunking for comprehensive context retrieval.
              </p>
            </motion.div>

            <motion.div
              className={styles.specCalloutItem}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: appleEase, delay: 0.25 }}
            >
              <span className={styles.specMetric}>LOCAL</span>
              <span className={styles.specLabel}>Ollama &amp; Vercel AI SDK</span>
              <p className={styles.specDescription}>
                Run private open-weights models locally or route to cloud inference endpoints.
              </p>
            </motion.div>

            <motion.div
              className={styles.specCalloutItem}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: appleEase, delay: 0.35 }}
            >
              <span className={styles.specMetric}>ATLAS</span>
              <span className={styles.specLabel}>Cosine K-NN Search</span>
              <p className={styles.specDescription}>
                Sub-millisecond semantic code search over thousands of files and commit diffs.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className={styles.productLinksBar}>
          <a
            href="https://github.com/TalibIbrahim/GitChat"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryPillBtn}
          >
            <span>View Source on GitHub</span>
            <ExternalLink size={13} style={{ display: 'inline-block', marginLeft: '6px' }} />
          </a>
        </div>
      </section>
    </div>
  );
}
