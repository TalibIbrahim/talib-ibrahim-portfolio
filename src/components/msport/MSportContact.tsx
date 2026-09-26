'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './MSportTheme.module.css';

export default function MSportContact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('project');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus('transmitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className={styles.paddockSection}>
      <motion.div
        className={styles.paddockCard}
        initial={{ opacity: 0, y: 90, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className={styles.paddockStripe} />

        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>PADDOCK COMMUNICATIONS // UPLINK</div>
          <h2 className={styles.sectionTitle}>
            INITIATE <span className={styles.heroTitleHighlight}>TRANSMISSION</span>
          </h2>
        </div>

        {status === 'success' ? (
          <div className={styles.statusMessage}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#008ac9' }}>
              <CheckCircle2 size={18} />
              <strong>TRANSMISSION LOGGED TO TELEMETRY SERVER</strong>
            </div>
            <p>
              Your payload was delivered to Muhammad Talib Ibrahim. Expect a response window within 24 operational hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.paddockForm}>
            {status === 'error' && (
              <div style={{ padding: '0.75rem', background: 'rgba(241, 26, 34, 0.15)', borderLeft: '3px solid #f11a22', color: '#ffffff', fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={14} color="#f11a22" />
                  <span>TRANSMISSION FAILED: DIRECT UPLINK TO talibibrahim04@gmail.com</span>
                </div>
              </div>
            )}

            <div className={styles.formRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor="paddock-name" className={styles.fieldLabel}>
                  CALLSIGN / SENDER NAME
                </label>
                <input
                  id="paddock-name"
                  type="text"
                  required
                  placeholder="e.g. Alex Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.fieldInput}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="paddock-email" className={styles.fieldLabel}>
                  RETURN TRANSMISSION ADDRESS
                </label>
                <input
                  id="paddock-email"
                  type="email"
                  required
                  placeholder="alex@team.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.fieldInput}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="paddock-subject" className={styles.fieldLabel}>
                TELEMETRY PACKET INTENT
              </label>
              <select
                id="paddock-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={styles.fieldSelect}
              >
                <option value="project">New Full-Stack Build / Production System</option>
                <option value="resume">Request Official Resume & Academic Dossier</option>
                <option value="fulltime">Full-Time Engineering Role / Recruiter Uplink</option>
                <option value="consulting">High-Concurrency Architecture Consulting</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="paddock-message" className={styles.fieldLabel}>
                PAYLOAD SPECIFICATION / BRIEF
              </label>
              <textarea
                id="paddock-message"
                required
                rows={4}
                placeholder="State project scope, stack requirements, or role requirements..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.fieldTextarea}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'transmitting'}
              className={styles.submitBtn}
            >
              <span>{status === 'transmitting' ? 'DISPATCHING...' : 'DISPATCH TRANSMISSION'}</span>
              <Send size={15} />
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
