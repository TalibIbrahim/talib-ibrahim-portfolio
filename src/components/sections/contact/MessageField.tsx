'use client';
// The message box, with templates. Picking a subject that has a template (site.contact.templates)
// types a ready-made message in; its [BLANKS] get a pen-blue highlighter stroke and a small
// marker glides to the first one, swipes over it and selects it, so typing replaces it.
//
// A textarea cannot style its own text, so the highlights live in a mirror layer behind it: same
// box, font, padding and wrapping, the text transparent, each blank wrapped in a <mark>. The
// textarea is transparent on top and stays the real, editable control.
//
// Motion (all on the GSAP ticker): typing is one linear tween over a precomputed schedule
// (~47-69 chars/sec, jitter, short pauses after punctuation and line breaks); the marker glide,
// swipe and check flourish animate transform/opacity; the highlight swipes in on background-size.
// Never clobbers the visitor's own text: if the box holds anything but an untouched template, a
// "Use the ... template" button is offered instead. Typing is interrupted by a click or a key in
// the box. Reduced motion: the template is inserted at once and the marker just appears.
// Touch: the marker is smaller and the automatic selection does not focus the box (no surprise
// keyboard); "Next blank" focuses and selects on tap.
import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import { flushSync } from 'react-dom';
import { gsap } from 'gsap';
import { ArrowRight, Highlighter } from 'lucide-react';
import { site } from '@/data/site';
import { ease, isTouch, prefersReducedMotion } from '@/engine';
import { fill, findBlanks, type Blank } from './blanks';
import styles from './ContactForm.module.css';

const TEMPLATES = site.contact.templates;
const UI = site.contact.templateUi;
const ALL = Object.values(TEMPLATES).filter((t): t is string => !!t);
const subjectLabel = (v: string) => site.contact.subjects.find((s) => s.value === v)?.label ?? v;

// The marker drawing is 28 units square; its chisel tip touches the paper at (TIP_X, TIP_Y).
const ART = 28;
const TIP_X = 5;
const TIP_Y = 22;

export type MessageFieldApi = { pick: (subject: string) => void };

type Props = {
  api: Ref<MessageFieldApi>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  id: string;
  value: string;
  onValue: (v: string) => void;
  onBlur: () => void;
  max: number;
  invalid: boolean;
  describedBy?: string;
};

type Els = { wrap: HTMLDivElement; mirror: HTMLDivElement; ta: HTMLTextAreaElement; marker: SVGSVGElement };
type Spot = { mark: HTMLElement; x0: number; x1: number; y: number; w: number };

/** Typing schedule: optional fast erase of the old template, then the new one char by char. */
function plan(from: string, to: string) {
  const steps: { t: number; text: string }[] = [];
  let t = 0;
  if (from) {
    const per = Math.min(0.008, 0.3 / from.length);
    for (let n = from.length - 1; n >= 0; n--) {
      t += per;
      steps.push({ t, text: from.slice(0, n) });
    }
    t += 0.14;
  }
  for (let n = 1; n <= to.length; n++) {
    steps.push({ t, text: to.slice(0, n) });
    const ch = to[n - 1];
    t += 1 / (58 + (Math.random() - 0.5) * 22);
    if (ch === '\n') t += 0.06 + Math.random() * 0.05;
    else if ('.,:?!'.includes(ch)) t += 0.05 + Math.random() * 0.06;
    else if (ch === ']') t += 0.04;
  }
  return { steps, duration: t + 0.02 };
}

/** Where blank k sits, in the field wrapper's own (unscaled) pixels. */
function measure(els: Els, k: number, reveal: boolean): Spot | null {
  const { wrap, mirror, ta, marker } = els;
  const mark = mirror.querySelectorAll<HTMLElement>('mark')[k];
  if (!mark) return null;
  if (reveal) {
    const top = mark.offsetTop;
    const bottom = top + mark.offsetHeight;
    if (top < ta.scrollTop || bottom > ta.scrollTop + ta.clientHeight) {
      ta.scrollTop = Math.max(0, top - ta.clientHeight / 3);
    }
  }
  mirror.scrollTop = ta.scrollTop;
  const w = wrap.getBoundingClientRect();
  const s = w.width / wrap.offsetWidth || 1; // the section can be mid-scale (ContactMotion)
  const r = mark.getClientRects()[0] ?? mark.getBoundingClientRect();
  const u = marker.getBoundingClientRect().width / s / ART || 1;
  const left = (r.left - w.left) / s;
  const width = r.width / s;
  return {
    mark,
    x0: left - TIP_X * u,
    x1: left + width - TIP_X * u,
    y: (r.top - w.top) / s + (r.height / s) * 0.86 - TIP_Y * u,
    w: width,
  };
}

export function MessageField({ api, textareaRef, id, value, onValue, onBlur, max, invalid, describedBy }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<SVGSVGElement>(null);
  const valueRef = useRef(value);
  const typing = useRef<{ tween: gsap.core.Tween; tpl: string } | null>(null);
  const markerTl = useRef<gsap.core.Timeline | null>(null);
  const later = useRef<gsap.core.Tween | null>(null);
  const shown = useRef(false); // marker visible
  const target = useRef(-1); // blank index the marker rests on
  const [isTyping, setIsTyping] = useState(false);
  const [offer, setOffer] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [selEnd, setSelEnd] = useState(0);
  const [live, setLive] = useState('');

  const els = (): Els | null => {
    const wrap = wrapRef.current;
    const mirror = mirrorRef.current;
    const ta = textareaRef.current;
    const marker = markerRef.current;
    return wrap && mirror && ta && marker ? { wrap, mirror, ta, marker } : null;
  };

  // Outside changes (the form resets after sending): keep the ref current, drop the marker.
  useEffect(() => {
    valueRef.current = value;
    if (!value && markerRef.current) {
      gsap.set(markerRef.current, { autoAlpha: 0 });
      shown.current = false;
    }
  }, [value]);

  // Re-pin the resting marker when the field rewraps (resize, font load).
  useEffect(() => {
    const wrap = wrapRef.current;
    const mirror = mirrorRef.current;
    const ta = textareaRef.current;
    const marker = markerRef.current;
    if (!wrap || !mirror || !ta || !marker) return;
    const ro = new ResizeObserver(() => {
      if (!shown.current || target.current < 0 || markerTl.current?.isActive()) return;
      const m = measure({ wrap, mirror, ta, marker }, target.current, false);
      if (m) gsap.set(marker, { x: m.x1, y: m.y });
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [textareaRef]);

  useEffect(
    () => () => {
      typing.current?.tween.kill();
      markerTl.current?.kill();
      later.current?.kill();
    },
    [],
  );

  const put = (v: string) => {
    valueRef.current = v;
    onValue(v);
  };
  const announce = (s: string) => setLive((p) => (p === s ? `${s} ` : s));

  const select = (b: Blank) => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus({ preventScroll: true });
    ta.setSelectionRange(b.start, b.end);
    setSelEnd(b.end);
  };

  const hideMarker = () => {
    const marker = markerRef.current;
    markerTl.current?.kill();
    target.current = -1;
    if (!marker || !shown.current) return;
    shown.current = false;
    gsap.to(marker, { autoAlpha: 0, duration: 0.2, ease: ease.soft });
  };

  /** Glide the marker to blank k and swipe over it. how: select after the swipe, now, or not at all. */
  const glide = (k: number, how: 'after' | 'now' | 'none') => {
    const list = findBlanks(valueRef.current);
    const e = els();
    if (!list.length || !e) return;
    const i = ((k % list.length) + list.length) % list.length;
    const b = list[i];
    if (how === 'now') select(b);
    const m = measure(e, i, true);
    target.current = i;
    markerTl.current?.kill();
    if (!m) {
      if (how === 'after') select(b);
      return;
    }
    const { marker } = e;
    const wasShown = shown.current;
    shown.current = true;
    if (prefersReducedMotion()) {
      gsap.set(marker, { x: m.x1, y: m.y, rotate: 0, autoAlpha: 1 });
      if (how === 'after') select(b);
      return;
    }
    const swipe = gsap.utils.clamp(0.22, 0.5, m.w / 320);
    const tl = gsap.timeline();
    if (!wasShown) tl.set(marker, { x: m.x0 + 26, y: m.y - 30, rotate: 14, autoAlpha: 0 });
    tl.to(marker, { x: m.x0, y: m.y, rotate: 0, autoAlpha: 1, duration: wasShown ? 0.45 : 0.6, ease: ease.soft })
      .to(marker, { x: m.x1, duration: swipe, ease: ease.wipe })
      // Its own tween, so a glide cut short (Next blank, Enter) never leaves a half-drawn stroke.
      .add(
        () =>
          gsap.fromTo(
            m.mark,
            { backgroundSize: '0% 100%' },
            { backgroundSize: '100% 100%', duration: swipe, ease: ease.wipe, clearProps: 'backgroundSize' },
          ),
        '<',
      )
      .to(marker, { y: m.y - 4, rotate: -6, duration: 0.3, ease: ease.out });
    if (how === 'after') tl.call(() => select(b));
    markerTl.current = tl;
  };

  /** No blanks left: a tiny check stroke, then the marker lifts off. */
  const flourish = () => {
    const marker = markerRef.current;
    target.current = -1;
    if (!marker || !shown.current) return;
    shown.current = false;
    markerTl.current?.kill();
    if (prefersReducedMotion()) {
      gsap.set(marker, { autoAlpha: 0 });
      return;
    }
    markerTl.current = gsap
      .timeline()
      .to(marker, { x: '+=6', y: '+=7', rotate: 0, duration: 0.16, ease: ease.soft })
      .to(marker, { x: '+=13', y: '-=17', duration: 0.24, ease: ease.out })
      .to(marker, { y: '-=10', autoAlpha: 0, duration: 0.35, ease: ease.soft }, '-=0.06');
  };

  const canAutoFocus = () => {
    if (isTouch()) return false;
    const a = document.activeElement as HTMLElement | null;
    return !a || a === document.body || a.tagName === 'SELECT' || a === textareaRef.current || !!a.closest('[data-msg-tools]');
  };

  const done = (tpl: string, auto: boolean) => {
    setIsTyping(false);
    const n = findBlanks(tpl).length;
    if (!n) return;
    announce(n === 1 ? UI.addedOne : fill(UI.added, { total: n }));
    later.current?.kill();
    later.current = gsap.delayedCall(0.2, () => glide(0, auto && canAutoFocus() ? 'after' : 'none'));
  };

  const type = (tpl: string) => {
    typing.current?.tween.kill();
    typing.current = null;
    later.current?.kill();
    hideMarker();
    setOffer(null);
    setActive(true);
    const from = valueRef.current;
    if (prefersReducedMotion()) {
      put(tpl);
      done(tpl, true);
      return;
    }
    const { steps, duration } = plan(from, tpl);
    const proxy = { t: 0 };
    let last = -1;
    setIsTyping(true);
    const tween = gsap.to(proxy, {
      t: duration,
      duration,
      ease: 'none',
      onUpdate: () => {
        let i = last;
        while (i + 1 < steps.length && steps[i + 1].t <= proxy.t) i++;
        if (i !== last) {
          last = i;
          put(steps[i].text);
        }
      },
      onComplete: () => {
        typing.current = null;
        put(tpl);
        done(tpl, true);
      },
    });
    typing.current = { tween, tpl };
  };

  /** Interrupt: the visitor reached into the box, so the template lands at once. */
  const finishNow = () => {
    const t = typing.current;
    if (!t) return;
    t.tween.kill();
    typing.current = null;
    flushSync(() => put(t.tpl));
    done(t.tpl, false);
  };

  const pick = (subject: string) => {
    const tpl = TEMPLATES[subject];
    if (!tpl) {
      finishNow();
      setOffer(null);
      return;
    }
    const cur = valueRef.current;
    if (cur === tpl && !typing.current) {
      setOffer(null);
      return;
    }
    if (!cur.trim() || typing.current || ALL.includes(cur)) type(tpl);
    else setOffer(subject);
  };

  useImperativeHandle(api, () => ({ pick }));

  const goNext = (k: number) => {
    const list = findBlanks(valueRef.current);
    if (!list.length) return;
    const i = ((k % list.length) + list.length) % list.length;
    later.current?.kill();
    glide(i, 'now');
    announce(fill(UI.blank, { n: i + 1, total: list.length, name: list[i].name }));
  };

  const nextFrom = (list: Blank[], caret: number) => {
    const i = list.findIndex((b) => b.start >= caret);
    return i < 0 ? 0 : i;
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    put(v);
    setSelEnd(e.target.selectionEnd);
    if (!active) return;
    later.current?.kill();
    if (!findBlanks(v).length) {
      flourish();
      setActive(false);
      announce(UI.done);
      return;
    }
    // The visitor filled (or is filling) a blank: the marker waits at the next one.
    later.current = gsap.delayedCall(0.5, () => {
      const ta = textareaRef.current;
      const list = findBlanks(valueRef.current);
      if (!ta || !list.length) return;
      glide(nextFrom(list, ta.selectionEnd), 'none');
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (typing.current && !['Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) finishNow();
    if (e.key !== 'Enter' || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.nativeEvent.isComposing) return;
    const ta = e.currentTarget;
    const list = findBlanks(ta.value);
    const i = list.findIndex((b) => b.start === ta.selectionStart && b.end === ta.selectionEnd);
    if (i >= 0 && list.length > 1) {
      e.preventDefault();
      goNext(i + 1);
    }
  };

  const onScroll = () => {
    const e = els();
    if (!e) return;
    e.mirror.scrollTop = e.ta.scrollTop;
    if (shown.current && target.current >= 0 && !markerTl.current?.isActive()) {
      const m = measure(e, target.current, false);
      if (m) gsap.set(e.marker, { x: m.x1, y: m.y });
    }
  };

  // Mirror content: the same text, blanks wrapped in highlighter marks, the typing caret at the end.
  const list = findBlanks(value);
  const parts: ReactNode[] = [];
  let last = 0;
  list.forEach((b, i) => {
    parts.push(value.slice(last, b.start));
    parts.push(
      <mark key={i} className={styles.hl}>
        {value.slice(b.start, b.end)}
      </mark>,
    );
    last = b.end;
  });
  parts.push(value.slice(last));

  const showNext = active && !isTyping && list.length > 0;
  const nextIdx = nextFrom(list, selEnd);

  return (
    <>
      <div ref={wrapRef} className={styles.msg} data-typing={isTyping ? '' : undefined}>
        <div ref={mirrorRef} className={`${styles.input} ${styles.textarea} ${styles.mirror}`} aria-hidden="true">
          {parts}
          {isTyping && <span className={styles.typeCaret} />}
          {'​'}
        </div>
        <textarea
          ref={textareaRef}
          id={id}
          name="message"
          className={`${styles.input} ${styles.textarea}`}
          rows={6}
          maxLength={max}
          required
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onPointerDown={finishNow}
          onSelect={(e) => setSelEnd(e.currentTarget.selectionEnd)}
          onScroll={onScroll}
          onBlur={onBlur}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={describedBy}
          data-cursor="text"
        />
        <svg ref={markerRef} className={styles.marker} viewBox="0 0 28 28" aria-hidden="true" focusable="false">
          <g transform="rotate(45 14 14)">
            <rect x="9.5" y="0.5" width="9" height="15.5" rx="1.6" fill="currentColor" />
            <rect className={styles.markerShade} x="9.5" y="3" width="9" height="2" opacity="0.22" />
            <rect className={styles.markerShade} x="10.25" y="16" width="7.5" height="3.6" opacity="0.82" />
            <path d="M11.4 19.6h5.2l-0.6 4.4-4.1 2.4z" fill="currentColor" />
          </g>
        </svg>
      </div>

      {(showNext || offer) && (
        <div className={styles.tools} data-msg-tools>
          {showNext && (
            <button type="button" className={styles.tool} onClick={() => goNext(nextIdx)}>
              <span>{UI.next}</span>
              <span className={styles.toolCount}>{fill(UI.of, { n: nextIdx + 1, total: list.length })}</span>
              <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
            </button>
          )}
          {offer && (
            <button
              type="button"
              className={styles.tool}
              onClick={() => {
                const t = TEMPLATES[offer];
                if (t) type(t);
              }}
            >
              <Highlighter size={14} strokeWidth={1.75} aria-hidden="true" />
              <span>{fill(UI.use, { subject: subjectLabel(offer) })}</span>
            </button>
          )}
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {live}
      </p>
    </>
  );
}
