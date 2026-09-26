'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Mail } from 'lucide-react';
import styles from './AppleTheme.module.css';

export default function AppleContact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus('submitting');
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
    <section id="contact" className={styles.contactSection}>
      <motion.div
        className={styles.contactCard}
        initial={{ opacity: 0, y: 90, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className={styles.contactTitle}>Start a conversation.</h2>
        <p className={styles.contactSub}>
          Available for high-impact software engineering roles, full-stack architecture, and technical consulting.
        </p>

        {status === 'success' ? (
          <div className={styles.successBox} style={{ textAlign: 'center', padding: '2rem 0' }}>
            <Check size={28} color="#0071e3" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Message dispatched.
            </h3>
            <p style={{ color: 'var(--apple-text-secondary)', fontSize: '0.9rem' }}>
              Thank you. I will review your transmission and get back to you promptly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.contactForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="apple-name" className={styles.inputLabel}>Name</label>
              <input
                id="apple-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Johnny Appleseed"
                className={styles.appleInput}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="apple-email" className={styles.inputLabel}>Email</label>
              <input
                id="apple-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johnny@apple.com"
                className={styles.appleInput}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="apple-subject" className={styles.inputLabel}>Subject</label>
              <select
                id="apple-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={styles.appleInput}
              >
                <option value="general">Engineering Role / Opportunity</option>
                <option value="resume">Request Official Resume (PDF)</option>
                <option value="consulting">Architecture Consulting</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="apple-message" className={styles.inputLabel}>Message</label>
              <textarea
                id="apple-message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about what you are building..."
                className={styles.appleInput}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className={styles.submitBtn}
            >
              <Mail size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }} />
              <span>{status === 'submitting' ? 'Dispatching...' : 'Send Message'}</span>
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
