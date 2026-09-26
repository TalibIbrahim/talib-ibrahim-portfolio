'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sliders, X } from 'lucide-react';
import { useAssistantPrompt } from '@/hooks/useAssistantPrompt';
import styles from './AssistantPrompt.module.css';

const emptySubscribe = () => () => {};

function subscribeStorage(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getRecruiterDismissedSnapshot(): boolean {
  try {
    return sessionStorage.getItem('portfolio_assistant_recruiter_dismissed') === 'true';
  } catch {
    return false;
  }
}

function getClientMountedSnapshot(): boolean {
  return true;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Assistant Concierge Prompt Component
 *
 * Positioned as a non-obtrusive, floating frosted glass capsule.
 * - On standard routes: prompts the user with "Prefer something simple? Tap here for Recruiter Mode"
 * - On /recruiter route: guides the user with "You can adjust detail intensity using the slider below."
 * - Persists dismissal states across browser sessions.
 */
export default function AssistantPrompt(): React.JSX.Element | null {
  const { isVisible, dismiss, isRecruiterPage } = useAssistantPrompt();
  const mounted = useSyncExternalStore(emptySubscribe, getClientMountedSnapshot, getServerSnapshot);
  const storedDismissed = useSyncExternalStore(
    subscribeStorage,
    getRecruiterDismissedSnapshot,
    getServerSnapshot
  );
  const [locallyDismissed, setLocallyDismissed] = useState<boolean>(false);

  const recruiterDismissed = storedDismissed || locallyDismissed;

  const handleDismissRecruiter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLocallyDismissed(true);
    try {
      sessionStorage.setItem('portfolio_assistant_recruiter_dismissed', 'true');
    } catch {
      // Ignore sessionStorage write errors
    }
  };

  const handleDismissStandard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dismiss();
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {/* ── Recruiter Route Assistant Tip ── */}
      {isRecruiterPage && !recruiterDismissed && (
        <aside className={`${styles.assistantWrapper} ${isRecruiterPage ? styles.assistantWrapperRecruiter : ''}`} aria-label="Recruiter intensity guidance tip">
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={styles.glassCapsule}
          >
            <div className={styles.infoContent}>
              <span className={styles.iconBadge} aria-hidden="true">
                <Sliders size={15} />
              </span>
              <span className={styles.promptText}>
                You can adjust detail intensity using the slider below.
              </span>
            </div>

            <button
              type="button"
              onClick={handleDismissRecruiter}
              className={styles.dismissBtn}
              aria-label="Dismiss guide tip"
              title="Dismiss"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </motion.div>
        </aside>
      )}

      {/* ── Standard Route Concierge Prompt ── */}
      {!isRecruiterPage && isVisible && (
        <aside className={styles.assistantWrapper} aria-label="Portfolio navigation assistant prompt">
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={styles.glassCapsule}
          >
            <Link
              href="/recruiter"
              className={styles.interactiveContent}
              aria-label="Navigate to Recruiter Mode"
            >
              <span className={styles.iconBadge} aria-hidden="true">
                <Sparkles size={15} />
              </span>
              <span className={styles.promptText}>
                Prefer something simple? Tap here for Recruiter Mode
              </span>
            </Link>

            <button
              type="button"
              onClick={handleDismissStandard}
              className={styles.dismissBtn}
              aria-label="Dismiss prompt for this session"
              title="Dismiss for this session"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </motion.div>
        </aside>
      )}
    </AnimatePresence>
  );
}
