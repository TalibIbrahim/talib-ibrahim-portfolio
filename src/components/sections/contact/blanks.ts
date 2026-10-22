// Template blanks: an [UPPERCASE RUN] in the message box. Shared by MessageField and ContactForm.
export type Blank = { start: number; end: number; name: string };

const BLANK = /\[[A-Z ]+\]/g;

export function findBlanks(text: string): Blank[] {
  const out: Blank[] = [];
  for (const m of text.matchAll(BLANK)) {
    const start = m.index ?? 0;
    out.push({ start, end: start + m[0].length, name: m[0].slice(1, -1) });
  }
  return out;
}

export const hasBlanks = (text: string) => /\[[A-Z ]+\]/.test(text);

/** Fill {key} slots in a copy string from src/data. */
export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));
