'use client';
// Contact form. POSTs JSON to /api/contact ({ name, email, subject, message, company }).
// Without JS the form still works: it falls back to a mailto: submission.
// Validation is inline (on blur once touched, and on submit); status lives in an aria-live region.
import { useId, useRef, useState, type FormEvent } from 'react';
import { AlertCircle, Check, ChevronDown, LoaderCircle, Send } from 'lucide-react';
import { site } from '@/data/site';
import { RollText } from '@/components/chrome/RollText';
import styles from './ContactForm.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Field = 'name' | 'email' | 'message';
type Values = { name: string; email: string; subject: string; message: string; company: string };
type Errors = Partial<Record<Field, string>>;

const MAX = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORDER: Field[] = ['name', 'email', 'message'];

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = 'Please tell me your name.';
  if (!v.email.trim()) e.email = 'I need an email address to reply to.';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'That email address does not look right.';
  if (!v.message.trim()) e.message = 'Write a message first.';
  else if (v.message.trim().length > MAX) e.message = `Keep it under ${MAX} characters.`;
  return e;
}

const empty = (): Values => ({
  name: '',
  email: '',
  subject: site.contact.subjects[0]?.value ?? '',
  message: '',
  company: '',
});

const BUTTON: Record<Status, string> = {
  idle: 'Send message',
  sending: 'Sending',
  sent: 'Sent',
  error: 'Try again',
};

export function ContactForm() {
  const id = useId();
  const [values, setValues] = useState<Values>(empty);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [note, setNote] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const errors = validate(values);
  const shown = (f: Field) => (submitted || touched[f] ? errors[f] : undefined);

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (status === 'sent' || status === 'error') {
      setStatus('idle');
      setNote('');
    }
  };
  const blur = (f: Field) => () => setTouched((t) => ({ ...t, [f]: true }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    setSubmitted(true);
    const errs = validate(values);
    const first = ORDER.find((f) => errs[f]);
    if (first) {
      setStatus('idle');
      const n = Object.keys(errs).length;
      setNote(n === 1 ? 'One field needs a fix.' : `${n} fields need a fix.`);
      ({ name: nameRef, email: emailRef, message: messageRef })[first].current?.focus();
      return;
    }

    setStatus('sending');
    setNote('Sending your message.');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject,
          message: values.message.trim(),
          company: values.company,
        }),
      });
      const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
      if (!res.ok || !data?.success) throw new Error('send failed');
      setStatus('sent');
      setNote(`Thanks, your message is on its way. I will reply to ${values.email.trim()}.`);
      setValues(empty());
      setTouched({});
      setSubmitted(false);
    } catch {
      setStatus('error');
      setNote(`That did not go through. Try again, or email me at ${site.email}.`);
    }
  }

  const fid = (f: string) => `${id}-${f}`;
  const describe = (f: Field, extra?: string) =>
    [shown(f) ? fid(`${f}-error`) : null, extra].filter(Boolean).join(' ') || undefined;
  const Icon = status === 'sending' ? LoaderCircle : status === 'sent' ? Check : status === 'error' ? AlertCircle : Send;

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
      noValidate
      // No-JS fallback: hand the fields to the visitor's mail app.
      action={`mailto:${site.email}`}
      method="post"
      encType="text/plain"
      data-status={status}
    >
      <div className={styles.row}>
        <div className={styles.field} data-invalid={shown('name') ? '' : undefined}>
          <label className={styles.label} htmlFor={fid('name')}>
            Name
          </label>
          <input
            ref={nameRef}
            id={fid('name')}
            name="name"
            className={styles.input}
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={set('name')}
            onBlur={blur('name')}
            aria-invalid={shown('name') ? true : undefined}
            aria-describedby={describe('name')}
            data-cursor="text"
          />
          <FieldError id={fid('name-error')} message={shown('name')} />
        </div>

        <div className={styles.field} data-invalid={shown('email') ? '' : undefined}>
          <label className={styles.label} htmlFor={fid('email')}>
            Email
          </label>
          <input
            ref={emailRef}
            id={fid('email')}
            name="email"
            className={styles.input}
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            required
            value={values.email}
            onChange={set('email')}
            onBlur={blur('email')}
            aria-invalid={shown('email') ? true : undefined}
            aria-describedby={describe('email')}
            data-cursor="text"
          />
          <FieldError id={fid('email-error')} message={shown('email')} />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={fid('subject')}>
          Subject
        </label>
        <div className={styles.selectWrap}>
          <select
            id={fid('subject')}
            name="subject"
            className={`${styles.input} ${styles.select}`}
            value={values.subject}
            onChange={set('subject')}
          >
            {site.contact.subjects.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className={styles.chevron} size={18} strokeWidth={1.5} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.field} data-invalid={shown('message') ? '' : undefined}>
        <label className={styles.label} htmlFor={fid('message')}>
          Message
        </label>
        <textarea
          ref={messageRef}
          id={fid('message')}
          name="message"
          className={`${styles.input} ${styles.textarea}`}
          rows={6}
          maxLength={MAX}
          required
          value={values.message}
          onChange={set('message')}
          onBlur={blur('message')}
          aria-invalid={shown('message') ? true : undefined}
          aria-describedby={describe('message', fid('message-count'))}
          data-cursor="text"
        />
        <div className={styles.under}>
          <FieldError id={fid('message-error')} message={shown('message')} />
          <p id={fid('message-count')} className={styles.count}>
            {values.message.length} / {MAX}
            <span className="sr-only"> characters</span>
          </p>
        </div>
      </div>

      {/* Honeypot: off-screen, out of the tab order and hidden from assistive tech. */}
      <div className={styles.hp} aria-hidden="true">
        <label htmlFor={fid('company')}>Company</label>
        <input
          id={fid('company')}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={set('company')}
        />
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submit}
          aria-disabled={status === 'sending' ? true : undefined}
          data-state={status}
        >
          <RollText key={status}>{BUTTON[status]}</RollText>
          <Icon className={styles.icon} size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <p className={styles.status} role="status" aria-live="polite" data-state={status}>
          {status === 'idle' && submitted && !Object.keys(errors).length ? '' : note}
        </p>
      </div>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className={styles.error}>
      <AlertCircle size={15} strokeWidth={1.75} aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}
