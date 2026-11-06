// About's four key words, one effect each (DESIGN.md "Key words"): type-in, decode, diff, select.
// The phrases come from site.aboutFx (each appears verbatim in site.about).
// Each slot reserves its final width in ch (mono), so no effect ever reflows the paragraph.
// The phrase is real text once (sr-only); the visual layers draw it from data-text by CSS until
// about/text.ts copies it in, and the struck placeholder exists only client-side. So the server HTML
// reads each phrase exactly once, as scrapers, ATS tools and AI readers should see it.
import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { site } from '@/data/site';
import styles from '../About.module.css';

export type FxKind = 'type' | 'decode' | 'diff' | 'select';
type Fx = { kind: FxKind; phrase: string };

const { placeholder, ...phrases } = site.aboutFx;
// Rule: proper nouns are never scrambled. If the data puts a capitalised name on "decode" and a common
// phrase on "type", the two effects trade phrases (the name types in, the phrase decodes).
const proper = (s: string) => /^[A-Z]/.test(s) || /[a-z][A-Z]|\.[a-z]/.test(s);
const swap = proper(phrases.decode) && !proper(phrases.type);
export const FX: Fx[] = (['type', 'decode', 'diff', 'select'] as const).map((kind) => ({
  kind,
  phrase: swap && kind === 'type' ? phrases.decode : swap && kind === 'decode' ? phrases.type : phrases[kind],
}));

/** The struck placeholder in the diff, fitted to exactly the length of the phrase it gives way to. */
export function diffToken(n: number) {
  if (!placeholder) return '_'.repeat(n);
  const base = placeholder.slice(0, -1); // keep the closing character for the end
  const close = placeholder.slice(-1);
  return (base.length + 1 > n ? base.slice(0, Math.max(2, n - 1)) : base.padEnd(n - 1, '_')) + close;
}

function Slot({ fx }: { fx: Fx }) {
  const style = { '--n': fx.phrase.length } as CSSProperties;
  const cls = `${styles.fx} ${styles[`fx_${fx.kind}`] ?? ''}`;
  if (fx.kind === 'diff') {
    return (
      <span className={cls} style={style} data-fx="diff">
        <span className="sr-only">{fx.phrase}</span>
        <span className={styles.ghost} aria-hidden="true" data-text={fx.phrase} />
        <span className={styles.del} aria-hidden="true" data-del>
          <span data-vis />
          <span className={styles.strike} data-strike />
        </span>
        <span className={styles.ins} aria-hidden="true" data-ins data-text={fx.phrase} />
      </span>
    );
  }
  return (
    <span className={cls} style={style} data-fx={fx.kind} data-phrase={fx.phrase}>
      {fx.kind === 'select' && <span className={styles.selBg} data-selbg />}
      <span className="sr-only">{fx.phrase}</span>
      <span className={styles.vis} aria-hidden="true" data-vis data-text={fx.phrase} />
      {fx.kind === 'type' && <span className={styles.caret} aria-hidden="true" data-caret />}
    </span>
  );
}

/** The paragraph with its key words in effect slots (each phrase is used once, first occurrence). */
export function withFx(text: string): ReactNode {
  const hits = FX.map((fx) => ({ fx, at: text.indexOf(fx.phrase) }))
    .filter((h) => h.at >= 0)
    .sort((a, b) => a.at - b.at);
  if (!hits.length) return text;
  const out: ReactNode[] = [];
  let i = 0;
  hits.forEach(({ fx, at }) => {
    if (at < i) return;
    // the slot and the punctuation glued to it travel as one unit, so line splitting never
    // separates (or rebuilds) them: "Next.js," stays one piece
    const end = at + fx.phrase.length;
    const glue = text.slice(end).match(/^[^\s]*/)?.[0] ?? '';
    out.push(
      text.slice(i, at),
      <span key={fx.kind} className={styles.fxUnit} data-fx-unit>
        <Slot fx={fx} />
        {glue}
      </span>,
    );
    i = end + glue.length;
  });
  out.push(text.slice(i));
  return out.map((n, k) => <Fragment key={k}>{n}</Fragment>);
}
