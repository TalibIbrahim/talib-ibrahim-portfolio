// Shared content contract. Components only ever read these shapes; copy lives in site.ts / projects.ts.

export type Img = {
  src: string; // absolute URL or /public path
  alt: string; // describes content and purpose, never "image of"
  width: number;
  height: number;
};

/** A reel is either a looping muted video, or a still that the showreel animates. */
export type Media =
  | { kind: 'video'; src: string; poster: Img }
  | { kind: 'poster'; poster: Img; motion?: 'pan' | 'zoom' | 'drift' };

export type ProjectLinks = {
  live?: string;
  repo?: string;
};

export type Project = {
  slug: string; // URL segment: /work/<slug>; also the MDX filename
  title: string;
  tagline: string; // one line under the title in the reel
  summary: string; // one or two sentences for the case-study lede and meta description
  kind: string; // short category, e.g. "P2P file sharing"
  role: string | null; // null = not stated yet; never invent
  year: number | null; // null = not stated yet; never invent
  stack: string[];
  highlights: string[]; // factual bullet points
  links: ProjectLinks;
  media: Media;
  /** Optional tint for the reel's timecode and hover; defaults to the site accent. */
  accent?: string;
  /** Lower comes first. Projects without an order follow in array order. */
  order?: number;
  /** false hides the project from the showreel (still gets a case page and Recruiter Mode entry). */
  featured?: boolean;
};

export type Link = { label: string; href: string };

export type Experience = {
  role: string;
  org: string;
  place: string;
  start: string; // display string, e.g. "Nov 2024"
  end: string; // display string or "Present"
  points: string[];
};

export type Education = {
  school: string;
  degree: string;
  start: string;
  end: string; // display string, e.g. "July 2027 (expected)"
  gpa?: string;
};

export type StackGroup = {
  name: string;
  items: string[];
};

export type Site = {
  name: string;
  shortName: string;
  role: string;
  url: string; // production URL, no trailing slash
  description: string; // 120 to 160 chars, meta description
  location: string;
  globe: { caption: string; timeCaption: string }; // About's globe, read by screen readers
  email: string;
  phone?: string;
  tagline: string;
  about: string[]; // paragraphs, first person
  links: { github: Link; linkedin: Link; site: Link };
  education: Education[];
  experience: Experience[];
  certifications: string[];
  stack: StackGroup[];
  contact: {
    heading: string;
    body: string;
    subjects: { value: string; label: string }[];
    /** Message templates keyed by subject value; [UPPERCASE] runs are blanks to fill. */
    templates: Partial<Record<string, string>>;
    /** Template UI copy; {subject} {n} {total} {name} are filled in. */
    templateUi: {
      use: string;
      next: string;
      of: string;
      added: string;
      addedOne: string;
      blank: string;
      done: string;
      pending: string;
    };
    finale: {
      inkLabel: string;
      inkHintPointer: string;
      inkHintTouch: string;
      detailsTitle: string;
      emailLabel: string;
      elsewhereLabel: string;
      basedLabel: string;
      timeLabel: string;
      timeZone: string; // IANA zone for the live clock
      timeZoneLabel: string;
      writeTitle: string;
      writeNote: string;
      backToTop: string;
      colophon: string;
      copy: { label: string; copied: string; failed: string };
    };
    /** The ending game (bricks are the stack items). {n} {total} {lives} are filled in. */
    breakout: {
      label: string; // small mono label
      invite: string; // the one line inviting play
      hintPointer: string;
      hintTouch: string;
      launchPointer: string;
      launchTouch: string;
      play: string;
      pause: string;
      resume: string;
      retry: string;
      again: string;
      paused: string;
      over: string;
      winLead: string;
      winCta: string;
      gameLabel: string;
      description: string; // text alternative for the canvas
      announce: {
        start: string;
        cleared: string;
        missed: string;
        missedOne: string;
        paused: string;
        over: string;
        won: string;
      };
    };
  };
  recruiter: {
    toggle: string; // the persistent button on the full site
    back: string; // returns to the full site
    less: string; // slider end labels
    more: string;
    levels: [string, string, string, string]; // 0 = least sell … 3 = hard sell (default)
    brief: string; // the whole pitch at the lowest level
  };
};
