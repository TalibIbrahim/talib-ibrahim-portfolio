'use client';

import React, { useState, useCallback, useId, type FormEvent, type ChangeEvent } from 'react';
import { portfolioData } from '@/data/portfolio';
import { useMode } from '@/context/ModeContext';
import type { ContactFormData, ContactApiResponse } from '@/data/types';
import { Zap, FileText, Mail } from 'lucide-react';
import styles from './BoringView.module.css';

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface FeedbackState {
  type: 'success' | 'error';
  message: string;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * BoringView renders the brutalist, high-density, deadpan recruiter presentation layer.
 * Purges all Three.js render loops, particles, and physics springs to provide raw data
 * designed for a rapid 30-second scan.
 */
export default function BoringView() {
  const { toggleMode, isTransitioning } = useMode();
  const formId = useId();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: 'Recruiter Quick Outreach',
    message: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const validateField = useCallback((field: keyof ContactFormData, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name field is required.';
        break;
      case 'email':
        if (!value.trim()) return 'Email address is required.';
        if (!isValidEmail(value)) return 'Please enter a valid email address.';
        break;
      case 'message':
        if (!value.trim()) return 'Message body cannot be empty.';
        break;
      default:
        break;
    }
    return undefined;
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

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
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name as keyof ContactFormData, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField]
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nameError = validateField('name', formData.name);
    const emailError = validateField('email', formData.email);
    const messageError = validateField('message', formData.message);

    const validationErrors: FieldErrors = {};
    if (nameError) validationErrors.name = nameError;
    if (emailError) validationErrors.email = emailError;
    if (messageError) validationErrors.message = messageError;

    setTouched({ name: true, email: true, message: true });
    setErrors(validationErrors);

    if (nameError || emailError || messageError) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          message: '[OK] TRANSMISSION DELIVERED TO TALIB IBRAHIM. I WILL RESPOND SHORTLY.',
        });
        setFormData({
          name: '',
          email: '',
          subject: 'Recruiter Quick Outreach',
          message: '',
        });
        setTouched({});
        setErrors({});
      } else {
        setFeedback({
          type: 'error',
          message: `[!] TRANSMISSION FAILED: ${data.error || data.message || 'Server rejected payload.'}`,
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: '[!] NETWORK ERROR: Failed to reach contact endpoint. Please email directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className={styles.boringContainer}>
      {/* Notice Banner */}
      <aside className={styles.noticeBanner} aria-label="Simple mode notification">
        <div className={styles.noticeLeft}>
          <span className={styles.noticeBadge}>BORING MODE</span>
          <span>{`// RECRUITER 30-SECOND SCAN SPECIFICATION`}</span>
        </div>
        <div className={styles.noticeStats}>
          <span className={styles.statItem}>GPU USAGE: 0.0%</span>
          <span className={styles.statItem}>WEBGL SHADERS: 0</span>
          <span className={styles.statItem}>KEYBOARD: [B] RESTORES 3D</span>
        </div>
      </aside>

      {/* Main Content Layout */}
      <main className={styles.innerWrapper}>
        {/* Hero Section */}
        <header className={styles.heroSection}>
          <div className={styles.heroHeaderMeta}>
            <span className={styles.heroTag}>{`ENGINEERING DOSSIER // REVISION 2026`}</span>
            <span className={styles.heroStatus}>STATUS: READY FOR OPPORTUNITIES</span>
          </div>

          <h1 className={styles.heroTitle}>{portfolioData.hero.headline}</h1>

          <div className={styles.heroRole}>
            <span>SOFTWARE ENGINEER</span>
            <span className={styles.heroDivider}>/</span>
            <span>FULL-STACK & REAL-TIME SYSTEMS</span>
            <span className={styles.heroDivider}>/</span>
            <span>{portfolioData.hero.currentStatusBadge}</span>
          </div>

          <blockquote className={styles.deadpanCallout}>
            <span className={styles.calloutPrefix}>[NOTE FOR RECRUITERS]:</span>
            You triggered Boring Mode. All WebGL shaders, particle sparks, and physics springs
            have been completely killed. Here is the raw, no-nonsense data for your 30-second glance.
          </blockquote>

          <div className={styles.heroActions}>
            <button
              type="button"
              onClick={toggleMode}
              disabled={isTransitioning}
              className={styles.restoreButton}
              aria-label="Restore 3D Hyper-Drive Mode"
            >
              <Zap size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }} aria-hidden="true" />
              RESTORE OVER-ENGINEERED 3D VERSION
            </button>

            <a
              href="#contact"
              className={styles.actionButton}
              title="Request full engineering resume via verified email dispatch"
            >
              <FileText size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }} aria-hidden="true" />
              REQUEST RESUME (ON DEMAND)
            </a>

            <a href="#contact" className={styles.actionButton}>
              <Mail size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }} aria-hidden="true" />
              FAST TRANSMIT
            </a>
          </div>
        </header>

        {/* Sticky Brutalist Anchor Navigation */}
        <nav className={styles.stickyNav} aria-label="Section navigation">
          <div className={styles.navInner}>
            <a href="#projects" className={styles.navLink}>
              [01. PROJECTS]
            </a>
            <a href="#experience" className={styles.navLink}>
              [02. EXPERIENCE]
            </a>
            <a href="#skills" className={styles.navLink}>
              [03. SKILLS]
            </a>
            <a href="#contact" className={styles.navLink}>
              [04. CONTACT]
            </a>
            <a
              href="#contact"
              className={`${styles.navLink} ${styles.navLinkSpecial}`}
            >
              [REQUEST RESUME]
            </a>
          </div>
        </nav>

        {/* Section 01: Projects */}
        <section id="projects" className={styles.section} aria-labelledby="heading-projects">
          <header className={styles.sectionHeader}>
            <h2 id="heading-projects" className={styles.sectionTitle}>
              {`01 // FEATURED PROJECTS`}
            </h2>
            <span className={styles.sectionCount}>
              [{portfolioData.projects.length} PRODUCTION REPOSITORIES]
            </span>
          </header>

          <div className={styles.projectsGrid}>
            {portfolioData.projects.map((project, idx) => (
              <article key={project.id} className={styles.projectCard}>
                <header className={styles.projectHeader}>
                  <div>
                    <span className={styles.projectIndex}>
                      PROJECT [0{idx + 1} / 0{portfolioData.projects.length}]
                    </span>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                  </div>

                  <div className={styles.projectLinks}>
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.projectLink}
                      >
                        ↗ LIVE SYSTEM
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.projectLink}
                      >
                        ⌥ SOURCE CODE
                      </a>
                    )}
                  </div>
                </header>

                <p className={styles.projectDesc}>{project.description}</p>

                <ul className={styles.highlightsList} aria-label="Architecture highlights">
                  {project.architectureHighlights.map((highlight) => (
                    <li key={highlight} className={styles.highlightItem}>
                      <span className={styles.bullet} aria-hidden="true">
                        ▸
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.techTagList} aria-label="Technologies used">
                  {project.techTags.map((tag) => (
                    <span key={tag} className={styles.techTag}>
                      [{tag}]
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section 02: Experience */}
        <section id="experience" className={styles.section} aria-labelledby="heading-experience">
          <header className={styles.sectionHeader}>
            <h2 id="heading-experience" className={styles.sectionTitle}>
              {`02 // PROFESSIONAL EXPERIENCE`}
            </h2>
            <span className={styles.sectionCount}>
              [{portfolioData.experience.length} ROLES RECORDED]
            </span>
          </header>

          <div className={styles.experienceList}>
            {portfolioData.experience.map((exp) => (
              <article key={exp.id} className={styles.experienceCard}>
                <div className={styles.experienceHeader}>
                  <div>
                    <h3 className={styles.roleTitle}>{exp.role}</h3>
                    <div className={styles.companyName}>{exp.company}</div>
                  </div>
                  <span className={styles.experienceDuration}>{exp.duration}</span>
                </div>

                <ul className={styles.achievementsList} aria-label="Key achievements">
                  {exp.achievements.map((item) => (
                    <li key={item} className={styles.achievementItem}>
                      <span className={styles.bullet} aria-hidden="true">
                        ▸
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Section 03: Skills & Competencies */}
        <section id="skills" className={styles.section} aria-labelledby="heading-skills">
          <header className={styles.sectionHeader}>
            <h2 id="heading-skills" className={styles.sectionTitle}>
              {`03 // TECHNICAL COMPETENCIES`}
            </h2>
            <span className={styles.sectionCount}>[VERIFIED ARRAYS]</span>
          </header>

          <div className={styles.competenciesGrid}>
            <div className={styles.competencyCategory}>
              <h3 className={styles.categoryTitle}>Languages</h3>
              <div className={styles.skillBadges}>
                {portfolioData.competencies.languages.map((skill) => (
                  <span key={skill} className={styles.skillBadge}>
                    [{skill}]
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.competencyCategory}>
              <h3 className={styles.categoryTitle}>Frameworks & Libraries</h3>
              <div className={styles.skillBadges}>
                {portfolioData.competencies.frameworks.map((skill) => (
                  <span key={skill} className={styles.skillBadge}>
                    [{skill}]
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.competencyCategory}>
              <h3 className={styles.categoryTitle}>Backend, DevOps & AI</h3>
              <div className={styles.skillBadges}>
                {portfolioData.competencies.backendDevOps.map((skill) => (
                  <span key={skill} className={styles.skillBadge}>
                    [{skill}]
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.competencyCategory}>
              <h3 className={styles.categoryTitle}>Databases</h3>
              <div className={styles.skillBadges}>
                {portfolioData.competencies.databases.map((skill) => (
                  <span key={skill} className={styles.skillBadge}>
                    [{skill}]
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 04: Minimal Contact Form */}
        <section id="contact" className={styles.section} aria-labelledby="heading-contact">
          <header className={styles.sectionHeader}>
            <h2 id="heading-contact" className={styles.sectionTitle}>
              {`04 // DIRECT INQUIRY & DISPATCH`}
            </h2>
            <span className={styles.sectionCount}>[FAST-PATH PROTOCOL]</span>
          </header>

          <div className={styles.contactCard}>
            <p className={styles.contactDescription}>
              Bypasses graphic transitions and dispatches straight to Talib&apos;s personal inbox.
              Fill out the form below or connect directly via social coordinates.
            </p>

            {feedback && (
              <div
                className={`${styles.feedbackBanner} ${
                  feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError
                }`}
                role="alert"
              >
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className={styles.contactForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${formId}-name`} className={styles.fieldLabel}>
                    YOUR NAME <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <input
                    id={`${formId}-name`}
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Sarah Connor"
                    disabled={isSubmitting}
                    className={styles.textInput}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${formId}-email`} className={styles.fieldLabel}>
                    COMMUNICATION ADDRESS <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <input
                    id={`${formId}-email`}
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="s.connor@cyberdyne.org"
                    disabled={isSubmitting}
                    className={styles.textInput}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={`${formId}-subject`} className={styles.fieldLabel}>
                  INQUIRY TYPE
                </label>
                <select
                  id={`${formId}-subject`}
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={styles.selectInput}
                >
                  <option value="Recruiter Quick Outreach">Recruiter Quick Outreach</option>
                  <option value="Full-Time Engineering Role">Full-Time Engineering Role</option>
                  <option value="Freelance / Contract Project">Freelance / Contract Project</option>
                  <option value="General Technical Question">General Technical Question</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={`${formId}-message`} className={styles.fieldLabel}>
                  MESSAGE PAYLOAD <span className={styles.requiredAsterisk}>*</span>
                </label>
                <textarea
                  id={`${formId}-message`}
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Detail your role parameters, compensation band, or engineering scope..."
                  disabled={isSubmitting}
                  className={styles.textArea}
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message && <span className={styles.fieldError}>{errors.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitBtn}
                aria-label="Transmit inquiry message"
              >
                {isSubmitting ? 'TRANSMITTING INQUIRY...' : '[ TRANSMIT INQUIRY ]'}
              </button>
            </form>

            <div className={styles.socialsBar}>
              <span className={styles.socialsLabel}>DIRECT COORDINATES:</span>
              <div className={styles.socialsList}>
                {portfolioData.socials.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    ↗ {social.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Editorial Footer */}
      <footer className={styles.editorialFooter}>
        <div className={styles.footerInner}>
          <div className={styles.footerLeft}>
            <span className={styles.footerBrand}>
              MUHAMMAD TALIB IBRAHIM — SOFTWARE ENGINEER
            </span>
            <span className={styles.footerSub}>
              {`RAW DATA DOSSIER // 0 CANVAS LOOPS // 100% SPREADSHEET-GRADE COMPLIANCE`}
            </span>
          </div>

          <div className={styles.footerRight}>
            <button
              type="button"
              onClick={toggleMode}
              disabled={isTransitioning}
              className={styles.restoreButton}
            >
              <Zap size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }} aria-hidden="true" />
              RESTORE 3D HYPER-DRIVE
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
