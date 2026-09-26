'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import styles from './NothingTheme.module.css';

export default function NothingContact() {
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
    <section id="contact" className={styles.transmitSection}>
      <motion.div
        className={styles.transmitCard}
        initial={{ opacity: 0, y: 80, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      >
        <div className={styles.sectionHeader}>
          <div className={styles.sectionFig}>(FIG. 05) // TRANSMISSION CHANNEL</div>
          <h2 className={styles.sectionTitle}>TRANSMIT DISPATCH</h2>
        </div>

        {status === 'success' ? (
          <div className={styles.statusMessage}>
            <div className={styles.statusSuccessHeader}>
              ● DISPATCH CONFIRMED // PACKET RECEIVED
            </div>
            <p>
              Your transmission has been logged to Talib Ibrahim&apos;s queue. Response window: &lt;24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.transmitForm}>
            {status === 'error' && (
              <div className={styles.statusErrorBox}>
                TRANSMISSION FAILED. DIRECT CHANNEL: talibibrahim04@gmail.com
              </div>
            )}

            <div className={styles.formRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor="nothing-name" className={styles.fieldLabel}>
                  INPUT: CALLSIGN / NAME
                </label>
                <input
                  id="nothing-name"
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.fieldInput}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="nothing-email" className={styles.fieldLabel}>
                  INPUT: FREQUENCY / EMAIL
                </label>
                <input
                  id="nothing-email"
                  type="email"
                  required
                  placeholder="alex@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.fieldInput}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="nothing-subject" className={styles.fieldLabel}>
                INPUT: DISPATCH TYPE
              </label>
              <select
                id="nothing-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={styles.fieldSelect}
              >
                <option value="project">New Engineering Build / Architecture</option>
                <option value="resume">Request Candidate Dossier & Resume</option>
                <option value="fulltime">Full-Time Engineering Role / Recruiter</option>
                <option value="consulting">Distributed Systems Consultation</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="nothing-message" className={styles.fieldLabel}>
                INPUT: PAYLOAD / MESSAGE
              </label>
              <textarea
                id="nothing-message"
                required
                rows={4}
                placeholder="State technical requirements or position specifications..."
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
              <ArrowUpRight size={14} />
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
