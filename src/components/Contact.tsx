'use client';

import { useState, useCallback, useId, useRef, type FormEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ContactFormData, ContactApiResponse } from '../data/types';
import styles from './Contact.module.css';
import DecryptedText from './react-bits/DecryptedText';
import Magnet from './react-bits/Magnet';

export interface ContactProps {
  readonly id?: string;
  readonly className?: string;
}

const SUBJECT_OPTIONS = [
  'Project Inquiry',
  'Job Opportunity',
  'Requesting Resume',
  'General Inquiry',
] as const;

type SubjectOption = (typeof SUBJECT_OPTIONS)[number];

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface FeedbackState {
  type: 'success' | 'error';
  message: string;
}

/**
 * Validates email structure using standard RFC-compliant pattern.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Lucius Fox Applied Sciences — Client-Side Contact Form UI
 *
 * Implements a premier, glassmorphic contact terminal with deep carbon palette,
 * neon lime (#ccff00) cybernetic accents, kinetic submission button,
 * and validated dispatch to `/api/contact`.
 */
export default function Contact({ id = 'contact', className = '' }: ContactProps) {
  const uniqueId = useId();
  const nameId = `contact-name-${uniqueId}`;
  const emailId = `contact-email-${uniqueId}`;
  const messageId = `contact-message-${uniqueId}`;

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: SUBJECT_OPTIONS[0],
    message: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  // Validate a single field
  const validateField = useCallback((field: keyof ContactFormData, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) {
          return 'Operator name is required.';
        }
        break;
      case 'email':
        if (!value.trim()) {
          return 'Comm address is required.';
        }
        if (!isValidEmail(value)) {
          return 'Invalid comm address: Please enter a valid email format.';
        }
        break;
      case 'message':
        if (!value.trim()) {
          return 'Transmission payload cannot be empty.';
        }
        break;
      default:
        break;
    }
    return undefined;
  }, []);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If the field was already touched, immediately clear or update its error
    if (touched[name]) {
      setErrors((prev) => {
        const error = validateField(name as keyof ContactFormData, value);
        if (!error) {
          const next = { ...prev };
          delete next[name as keyof FieldErrors];
          return next;
        }
        return { ...prev, [name]: error };
      });
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof ContactFormData, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, [validateField]);

  const handleSubjectSelect = useCallback((subject: SubjectOption) => {
    if (isSubmitting) return;
    setFormData((prev) => ({ ...prev, subject }));
  }, [isSubmitting]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all as touched
    const newTouched = { name: true, email: true, message: true };
    setTouched(newTouched);

    // Validate all fields
    const nameError = validateField('name', formData.name);
    const emailError = validateField('email', formData.email);
    const messageError = validateField('message', formData.message);

    const validationErrors: FieldErrors = {};
    if (nameError) validationErrors.name = nameError;
    if (emailError) validationErrors.email = emailError;
    if (messageError) validationErrors.message = messageError;

    setErrors(validationErrors);

    // If validation fails, focus the first erroneous input
    if (nameError) {
      nameInputRef.current?.focus();
      return;
    }
    if (emailError) {
      emailInputRef.current?.focus();
      return;
    }
    if (messageError) {
      messageInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
        }),
      });

      const data = (await response.json()) as ContactApiResponse;

      if (response.ok && data.success) {
        setFeedback({
          type: 'success',
          message: 'Message transmitted successfully // Will reply shortly',
        });
        // Reset form inputs upon confirmed transmission
        setFormData({
          name: '',
          email: '',
          subject: SUBJECT_OPTIONS[0],
          message: '',
        });
        setTouched({});
        setErrors({});
      } else {
        setFeedback({
          type: 'error',
          message: data.error || data.message || 'Transmission failed. Server rejected payload.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Network anomaly detected. Relays unresponsive. Please verify connection and retry.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id={id} className={`${styles.section} ${className}`.trim()} aria-labelledby="contact-heading">
      {/* Background radial ambient glow */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ type: 'spring', stiffness: 90, damping: 20, mass: 0.8 }}
      >
        {/* Section Header */}
        <header className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeText}>
              <DecryptedText
                text="04 // TRANSMISSION PROTOCOL & INBOX"
                speed={30}
                maxIterations={10}
                animateOn="view"
              />
            </span>
          </div>
          <h2 id="contact-heading" className={styles.title}>
            Initiate Transmission<span className={styles.titleAccent}>.</span>
          </h2>
          <p className={styles.description}>
            Have an ambitious project, an engineering opportunity, or wish to review my resume?
            Transmit your coordinates below.
          </p>
        </header>

        {/* Glassmorphic Form Card */}
        <div className={styles.formCard}>
          {/* Cybernetic Corner Accents */}
          <div className={`${styles.cornerAccent} ${styles.cornerTopLeft}`} aria-hidden="true" />
          <div className={`${styles.cornerAccent} ${styles.cornerTopRight}`} aria-hidden="true" />
          <div className={`${styles.cornerAccent} ${styles.cornerBottomLeft}`} aria-hidden="true" />
          <div className={`${styles.cornerAccent} ${styles.cornerBottomRight}`} aria-hidden="true" />

          {/* Feedback Status Banner */}
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div
                key={feedback.type + feedback.message}
                initial={{ opacity: 0, y: -16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className={`${styles.feedbackBanner} ${
                  feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError
                }`}
                role="alert"
                aria-live="polite"
              >
                <div className={styles.feedbackIconWrapper} aria-hidden="true">
                  {feedback.type === 'success' ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                </div>
                <div className={styles.feedbackContent}>
                  <div className={styles.feedbackHeader}>
                    {feedback.type === 'success' ? 'SYSTEM // DISPATCH CONFIRMED' : 'SYSTEM // TRANSMISSION FAILED'}
                  </div>
                  <div className={styles.feedbackMessage}>{feedback.message}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setFeedback(null)}
                  className={styles.feedbackClose}
                  aria-label="Dismiss notification"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            {/* Operator Name & Comm Address (2-column on desktop, stacked on mobile) */}
            <div className={styles.inputRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor={nameId} className={styles.fieldLabel}>
                  <span className={styles.labelPrefix}>{'//'}</span> OPERATOR NAME{' '}
                  <span className={styles.requiredMark}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    ref={nameInputRef}
                    id={nameId}
                    name="name"
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Bruce Wayne"
                    autoComplete="name"
                    aria-required="true"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${nameId}-error` : undefined}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  />
                </div>
                {errors.name && (
                  <motion.p
                    id={`${nameId}-error`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.fieldError}
                    role="alert"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor={emailId} className={styles.fieldLabel}>
                  <span className={styles.labelPrefix}>{'//'}</span> COMM ADDRESS{' '}
                  <span className={styles.requiredMark}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    ref={emailInputRef}
                    id={emailId}
                    name="email"
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="operator@domain.com"
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? `${emailId}-error` : undefined}
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    id={`${emailId}-error`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.fieldError}
                    role="alert"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Subject Selector (Interactive Pills) */}
            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel} id="subject-group-label">
                <span className={styles.labelPrefix}>{'//'}</span> SELECT INQUIRY VECTOR
              </div>
              <div
                className={styles.subjectGrid}
                role="radiogroup"
                aria-labelledby="subject-group-label"
              >
                {SUBJECT_OPTIONS.map((option) => {
                  const isSelected = formData.subject === option;
                  return (
                    <Magnet
                      key={option}
                      padding={15}
                      magnetStrength={0.2}
                      className={styles.pillMagnet}
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={isSubmitting}
                        className={`${styles.subjectPill} ${isSelected ? styles.subjectPillActive : ''}`}
                        onClick={() => handleSubjectSelect(option)}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="activeSubjectPill"
                            className={styles.pillActiveIndicator}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        <span className={styles.pillContent}>
                          <span
                            className={`${styles.pillRadio} ${isSelected ? styles.pillRadioActive : ''}`}
                            aria-hidden="true"
                          />
                          <span className={styles.pillText}>{option}</span>
                        </span>
                      </button>
                    </Magnet>
                  );
                })}
              </div>
            </div>

            {/* Transmission Payload (Message) */}
            <div className={styles.fieldGroup}>
              <label htmlFor={messageId} className={styles.fieldLabel}>
                <span className={styles.labelPrefix}>{'//'}</span> TRANSMISSION PAYLOAD{' '}
                <span className={styles.requiredMark}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <textarea
                  ref={messageInputRef}
                  id={messageId}
                  name="message"
                  required
                  rows={5}
                  disabled={isSubmitting}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Detail your operational parameters, timelines, and technical requirements..."
                  aria-required="true"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? `${messageId}-error` : undefined}
                  className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                />
              </div>
              {errors.message && (
                <motion.p
                  id={`${messageId}-error`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.fieldError}
                  role="alert"
                >
                  {errors.message}
                </motion.p>
              )}
            </div>

            {/* Kinetic Submit Button & Security Protocol Indicator */}
            <div className={styles.submitRow}>
              <Magnet padding={15} magnetStrength={0.2} className={styles.submitMagnet}>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                  whileHover={
                    !isSubmitting
                      ? { scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }
                      : undefined
                  }
                  whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
                >
                  <span className={styles.submitContent}>
                    {isSubmitting ? (
                      <>
                        <svg
                          className={styles.spinner}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <circle
                            className={styles.spinnerTrack}
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                          <path
                            className={styles.spinnerHead}
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span className={styles.submitText}>TRANSMITTING...</span>
                      </>
                    ) : (
                      <>
                        <span className={styles.submitText}>TRANSMIT MESSAGE</span>
                        <svg
                          className={styles.submitIcon}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )}
                  </span>
                </motion.button>
              </Magnet>

              <div className={styles.securityNotice}>
                <span className={styles.securityDot} aria-hidden="true" />
                <span>DIRECT ENCRYPTED RELAY // 256-BIT PROTOCOL</span>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
