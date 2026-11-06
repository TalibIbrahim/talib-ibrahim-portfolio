// Shared content contract. Components only ever read these shapes; copy lives in site.ts / projects.ts.
import type { ProjectSlug } from './projects';

export type Img = {
  src: string; // absolute URL or /public path
  alt: string; // describes content and purpose, never "image of"
  width: number;
  height: number;
};

/**
 * How the home Work strip frames a cover in its slot: the focal point (0 to 1 from the top-left,
 * like CSS object-position) and an optional zoom (1 = the whole cover, cropped to the slot).
 * Art direction only: it never changes what the image shows, only where the slot looks.
 */
export type Focus = { x: number; y: number; zoom?: number };

/** A reel is either a looping muted video, or a still that the showreel animates. */
export type Media =
  | { kind: 'video'; src: string; poster: Img; focus?: Focus }
  | { kind: 'poster'; poster: Img; motion?: 'pan' | 'zoom' | 'drift'; focus?: Focus };

export type ProjectLinks = {
  live?: string;
  repo?: string;
  /** The client's own site, for client work. Not the project itself, so never used as sameAs. */
  client?: string;
};

/** Where a fact comes from when no file or page on the site already proves it. */
export type FactSource = { kind: 'owner' } | { kind: 'link'; href: string };

/**
 * A fact that no page proves on its own, kept with its source. Read as "<value> <text>"
 * ("120+ restaurants listed") or just "<text>" ("I use it every day.").
 */
export type SourcedFact = {
  value?: string; // a number, at the owner's precision: "About 40", "120+"
  text: string;
  source: FactSource;
};

type ProjectBase<S extends string = string> = {
  slug: S; // URL segment: /work/<slug>; also the MDX filename
  title: string;
  tagline: string; // one line under the title in the reel
  summary: string; // one or two sentences for the case-study lede; also the meta description unless `description` is set
  /** Meta description only, 50 to 155 chars. Set it when `summary` runs longer; use descriptionOf() to read. */
  description?: string;
  kind: string; // short category, e.g. "P2P file sharing"
  role: string | null; // null = not stated yet; never invent
  year: number | null; // null = not stated yet; never invent
  stack: string[];
  highlights: string[]; // factual bullet points
  links: ProjectLinks;
  /** Owner-reported or linked facts (users, usage). The MDX body places them with <Facts />. */
  facts?: SourcedFact[];
  /** Extra stills shown after the case-study body. */
  gallery?: Img[];
  /** One short line of real facts for the home Work strip, from `facts` or the case study. Unset = no line. */
  keyFact?: string;
  /** Optional tint for the reel's timecode and hover; defaults to the site accent. */
  accent?: string;
};

/** In the showreel: needs a cover. */
export type FeaturedProject<S extends string = string> = ProjectBase<S> & { featured: true; media: Media };
/** Only in All projects (/work), the case route and Recruiter Mode. May have no cover yet. */
export type ListedProject<S extends string = string> = ProjectBase<S> & { featured: false; media: Media | null };
/** `S` narrows `slug` to the literal slugs in projects.ts (see ProjectSlug); it defaults to string. */
export type Project<S extends string = string> = FeaturedProject<S> | ListedProject<S>;

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

/** One half of the front end / back end split. Every tool must also be listed in site.stack. */
export type LayerSide = {
  key: 'front' | 'back';
  layer: string; // small mono label above the title ("client", "server")
  top: string; // the word above END ("Front", "Back")
  tools: string[];
};

/** About's four key-word effects. Each phrase appears verbatim (same casing) in site.about. */
export type AboutFx = {
  type: string; // types itself in
  decode: string; // decodes from noise
  diff: string; // replaces a struck placeholder token
  select: string; // gets selected like shift+arrow
  /** The struck token the diff replaces, as long as `diff` at most (it is padded to fit). */
  placeholder?: string;
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
  /** Words of `tagline`, verbatim, set in Fraunces italic where the tagline is a headline. */
  taglineAccents: string[];
  about: string[]; // paragraphs, first person
  links: { github: Link; linkedin: Link; site: Link };
  education: Education[];
  experience: Experience[];
  certifications: string[];
  stack: StackGroup[];
  /** Fallback share image for pages without their own (layout, /work, projects without a cover). */
  ogImage: Img;
  /** One line per side, for the front end / back end split. */
  pitch: { frontEnd: string; backEnd: string };
  /** The front end / back end split: its labels and one entry per side. */
  layers: {
    heading: string; // sr-only section heading
    end: string; // the heavy word under each side's top word
    usedIn: string; // label over the projects that used that layer
    sides: [LayerSide & { key: 'front' }, LayerSide & { key: 'back' }];
  };
  aboutFx: AboutFx;
  /** The landing's marquee rows and the project it links to. */
  hero: {
    featured?: ProjectSlug; // defaults to the first featured project
    nameRow?: string[]; // after the first name; current facts only, no ended roles
    stackRow?: string[]; // site.stack items; the first one is what the surname decodes into
  };
  /** The /work index and the link to it from the home Work section. */
  workIndex: {
    title: string; // <title> and <h1>
    description: string; // meta description
    intro: string;
    featuredHeading: string;
    restHeading: string;
    homeLink: string; // link text at the end of the home Work section
    log: string; // the mono command chip between the home Work title words, before the count
    live: string; // link labels
    repo: string;
    client: string;
    caseStudy: string;
  };
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
  /** The framed footer (the page's last screen). Its page list is these links, then All projects and Recruiter mode. */
  footer: {
    pagesLabel: string; // small mono label over the page links
    stackLabel: string; // accessible name of the stack row (its two halves are labelled with layers.sides[].layer)
    pages: Link[]; // the home sections
    nowBuilding: string; // prefix of the live line: the most recently pushed public repo (src/lib/github.ts)
    lastCommit: string; // label before its push date
  };
  /** The first-landing boot screen: one line per real readiness check. */
  loader: {
    command: string; // the prompt line
    checks: { fonts: string; images: string; scroll: string };
    ok: string; // status when a check passed
    skip: string; // status when it ran out of time (the site goes on anyway)
    pending: string; // status while waiting
    ready: string; // the last line
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
