# muhammad-talib.dev — DESIGN

Source of truth for every build pass. Read before touching code.

## Brief
- Subject: Muhammad Talib Ibrahim, full-stack developer, BS CS at UMT Lahore (expected July 2027, GPA 3.6/4.0); co-founded Radix Systems (2026, ended).
- Audience: recruiters and engineering leads, then other developers.
- Job: get hired / get contacted. Boring Mode is the recruiter and accessibility view.
- Content rule: only facts in `src/data`. Nothing invented (no awards, no metrics).

## Concept card
```
Idea:        A developer signs his work. The landing (a real person, a big name) closes into a card,
             the name runs off into the code behind it, and he signs the card like a commit.
Metaphor:    A pen on a dark desk, crossed with a commit log: ink strokes, and text that resolves
             from noise the way code compiles.
Signature:   The hero morph (one scrubbed timeline, src/components/sections/hero/HeroMotion.tsx):
             the cream card lifts into a centred frame, "Talib" and "Ibrahim" shrink into the heads
             of two marquee rows ("Ibrahim" decodes into the stack), the portrait turns black and
             white, a tilted signature writes over the card in the only full-strength blue, and the
             header reads "// MUHAMMAD TALIB IBRAHIM  SIGNED <hash>" (the SHA-1 of the strokes).
             Then the signed card grows to full bleed and becomes the About paper.
Emotion:     First 3 seconds: a real person, a big name, the role and one project. Then: "he signed it
             like a commit".
Motion verb: "flow like ink, resolve like code": long out-expo settles, strokes that lead and trail,
             text that decodes instead of fading.
Screenshot:  The signed card mid-stroke, black-and-white portrait, the rows dimmed behind it,
             SIGNED c3ed5a4 above.
```

## Palette (tokens in src/app/globals.css)
| Role | Value | Note |
|---|---|---|
| ground `--c-bg` | `#0B0B0C` | desk black |
| ink `--c-fg` | `#ECE8DF` | off-white paper ink |
| muted `--c-muted` | `#8F8A80` | AA on ground (5.7:1) |
| line `--c-line` | `rgb(236 232 223 / 0.12)` | hairlines |
| accent `--c-accent` | `#4D6BFF` | fountain-pen blue. Large text, strokes, focus. Small text uses `--c-accent-text` `#8094FF` (6.6:1) |
| curtain `--c-curtain` | `#4D6BFF` | page transitions are an ink wash |

Why blue and not acid green/vermilion (skill "AI tell" #2): it is ink. Boring Mode turns the
accent into the browser default link blue `#0000EE`: the identity collapses into the most
boring version of itself.

## Type
Every face has one job (src/app/fonts.ts, all self-hosted woff2):
- Display: **Clash Display** (`--f-display`), 500/600/700. Tracking -0.035em mega, -0.03em xl, -0.02em l.
- Text: **General Sans** (`--f-body`), 400/500/600 (+400 italic). Body 16-18 px / 1.55.
- Code details: **JetBrains Mono** (`--f-mono`), 400/500: labels, eyebrows, chips, key words, timecodes,
  the hero's card header. Replaced Azeret Mono.
- Hero rows only: **Departure Mono** (`--f-pixel`), the pixel row behind the signed card. Home page only.
- Headline accents only: **Fraunces** italic (`--f-serif`, opsz 144, ~400), the 2-3 `site.taglineAccents`
  words inside the tagline, which is About's headline (its only placement), in accent blue. Home page only.
  (The owner overrode the earlier "no serif" rule for this.)
- Departure and Fraunces are not preloaded; their tokens live on `[data-fun-root]` with their variables.
- Never: Inter, Roboto, Space Grotesk.

## Key words (text animation, one effect per idea, at most four per screen)
- About's lead and body, phrases from `site.aboutFx` (src/components/sections/about/fx.tsx): decode
  (glyph noise resolves, <= 0.4 s), type-in (caret leading), diff (a struck `-{TODO_specialty}` token
  leaves, the real phrase rises into the same slot), select (shift+arrow, ends desk black on blue).
- Rule: proper nouns are never scrambled; they type in or get selected. Only common phrases decode.
- Every key word sits in a slot as wide as its final text (mono, `ch`), so nothing reflows. Each fires
  when its line passes 72% of the viewport and is finished before mid-screen. Reduced motion and no JS
  show the final text. On paper the key words use `--c-accent-ink` `#3048D6` (5.6:1).
- One reveal voice per block: the About headline (tagline) prints under blue blocks scrubbed per line
  (85% to 65%); the lead and body rise line by line out of masks that open once each line is home.

## Motion language
- Eases (`src/engine/env.ts`, mirrored as CSS vars):
  - `ease.out` = `expo-out` `cubic-bezier(0.19,1,0.22,1)` reveals, ink settles
  - `ease.soft` = `quint-out` `cubic-bezier(0.22,1,0.36,1)` UI, hovers
  - `ease.wipe` = `sharp` `cubic-bezier(0.625,0.05,0,1)` clip-path wipes, curtain
  - `ease.inOut` = `hard` `cubic-bezier(0.6,0,0,1)` big transforms (zoom, rotate)
- Lenis lerp 0.1 on the GSAP ticker. One clock, no own rAF/scroll listeners.
- Velocity-aware: fast scrolling shortens non-scrubbed transitions (min 0.25 s).
- Hover per role: nav/CTA = letter roll inside a clipped line; project links = frame tightens + cursor "Case study";
  utility links = underline draws. Focus ring = 2px accent.
- Cursor: native always visible. Follower dot (fine pointer only), `data-cursor` states:
  `link` (grows), `view` (label "View"), `play` (label "Play"), `drag` (label "Drag"), `text` (shrinks to a caret),
  `pressed` (squash).
- Idle: the hero's two marquee rows drift; the certifications line under Experience drifts. The Work strip is still at rest (a decision: its line, focus and captions answer scroll; hovers carry the rest). The survey sheet (contour lines
  from noise, canvas on the GSAP ticker, 20 fps) drifts only while the visitor scrolls or moves the
  pointer and eases to a stop ~2.5 s after, so the first screen rests as a still poster (a decision:
  the hero's first frame is still at rest). Phones draw the sheet once. Paused off-screen, static
  under reduced motion.
- Fixed corner UI: the Recruiter mode button steps aside while scrolling down (back on scroll up),
  hides while the contact form is on screen, and on phones while the landing is (its first screen
  carries the role and a project). The nav pills are near-opaque so text never shows through on paper.
- Boot screen (owner decision, replaces the old "no loader" rule): first landing of a session only (sessionStorage `mti:booted`; never on client navigations or /recruiter; never without JS). A terminal boot in JetBrains Mono, bottom-left: `$ talib boot`, then one line per real readiness check, each printed with ScrambleText and ticked `[ok]` when it resolves: fonts (`document.fonts.ready`), the hero images decoded (`img.decode()`), the engine's first ScrollTrigger refresh; then `> ready` with a block caret. At least 0.8 s, never past 2.5 s (a check that is late reads `[skip]` and the site goes on); the boot script also fades it out by itself at 3.2 s if the app never takes over. Exit: the screen wipes up (clip-path, ease.wipe, .5 s), and only then the hero's CSS intro and the engine's first intro play (src/motion/loader.ts, engine `holdIntro`). Reduced motion: static lines, a .25 s fade. The landing (portrait + name, real HTML and an eager <img>) still renders and loads underneath and stays the LCP; its CSS intro plays in ~1.4 s once the screen is gone.
- Accent discipline in the hero: the signature is the only full-strength blue; the pixel row is
  `--c-accent-text` at .8 and steps back to .45 with the name row once the pen comes down.

## Section timeline (each boundary uses a different transition, never repeated)
| # | Section | Desktop | Phone |
|---|---|---|---|
| 1 | Landing (sticky, 460svh) | first frame = portrait on its cream card, giant "Talib" / "Ibrahim", role + featured project (18px, ink). Scroll: card closes into a centred frame, name shrinks into two marquee rows (Clash name row, Departure pixel row that decodes "ibrahim" into the stack), portrait turns B&W, tilted signature writes, header types `SIGNED <hash>`, role + project under the card | 400svh; rows above and below the frame; caption under the name |
| 2 | Landing to About | **card expand**: the signed cream card grows to full bleed and IS the About paper | same |
| 3 | About | tagline headline (Fraunces accents) prints under blue blocks per line; lead and body lines rise, key words resolve per line (decode / type-in / diff / select). **Pen line**: a commit node beside the tagline and one blue stroke (`clamp(3px,.35vw,6px)`) down the left margin (half a gutter in), DrawSVG scrubbed with its head on the 72% viewport line (about/line.ts); fully drawn under reduced motion | same, no pin; no pen line |
| 4 | About to Work | **bent card**: About's paper runs on into the Work stage, and so does the pen line: the git-graph line now starts at the stage's top edge at the same x, comes down (head still on the 72% line) and turns into project 01's node as the card lands, so About and Work read as one line; project 01's cover waits as a small tilted duotone card under "SELECTED WORK". Once the stage sticks (80svh of scrub) it pulls flat into its slot as one OGL plane, top-left corner leading, the sheet sagging, colour arriving with it; the paper fades to ink, the title rises and parts around a mono `git log --featured · 05` chip, and decodes as the card lands. The About globe pauses while the plane draws. No GL: the same card as a DOM FLIP | no GL: the title on paper, project 01 full bleed across the paper/ink edge, un-skewing from a polygon as its colour comes in |
| 5 | Work strip (sticky, sideways) | the five covers, always whole (each slot at its cover's own aspect; the scatter is height, anchoring, offset and wide gaps of 21-23svh), travel sideways, 1.5 px per px of scroll. Entrance and travel are ONE scrubbed driver (the card always lands before the track moves). Descriptions at 18-20px General Sans in full ink (36ch) rise by masked lines (SplitText, stagger .06, ease.out) and a mono key-fact line (`keyFact`, accent text, only where the data has one) types in, once, as each project reaches the focus band. A focus band at .4vw drives scale .86 to 1 and duotone to colour; captions (`01 · 2024 · NEXT.JS`) type in behind a block caret; a blue git-graph line runs just under the captions through a commit node at each (filled at the focused one), curving through the gaps and never over a cover, and branches into "All projects" | stacked, alternating right/left, a rail with nodes down the left; each cover fades duotone to colour at mid-screen |
| 6 | Work to Front end / back end | **seam**: the section opens outwards from its centre line, the seam hairline drawing first | no seam line, no wipe |
| 7 | Front end / back end | two halves: mono top word over a heavy END, "used in" projects in the outer columns (links), pitch from `site.pitch`, stack chips. Hover or focus-within writes a marker tag (DrawSVG), the other half dims | one column; tags write on scroll-in |
| 8 | Split to Stack | **rotate**: the paper panel turns in from -8deg around its top-left corner | rotate only |
| 9 | Stack (pinned horizontal) | 4 groups on a type strip; cards arrive from different directions/eases | native scroll-snap row |
| 10 | Stack to Experience | **diagonal clip-path wipe** (a strike-through) | same |
| 11 | Experience + Education | parallax depth, entries from left/right at 2 speeds; certifications as one slim mono line drifting left on the GSAP ticker (faster while scrolling; a plain wrapped line under reduced motion) | single column |
| 12 | Contact (finale) | **reveal from underneath**: Timeline slides off while Contact is held beneath, scaling .92 to 1 and un-dimming; "Email me" per-char; form; Ink breakout | scale .96 to 1, no hold |
| 13 | Contact to Footer | **frame lock**: the footer's desk panel arrives full bleed (scale 1.08) and settles to 1 as its top reaches the viewport top (scrubbed, ease.inOut), so the blue frame closes in from the screen edges and its tabs cut in: the bookend of boundary 2, where the card grew to full bleed | scale 1.05 to 1, ends at 30% |
| 14 | Footer (the last screen) | a pen-blue frame (section ground) around the desk panel (clip-path, 45deg chamfers, radius 0): a tab dips into the top edge between the header chips (the domain, desk black), two tabs rise into the bottom corners (copyright, back to top). Ground: small off-white polka dots (radii 1-3.5px, .06-.14 opacity, jittered grid; footer/dots.ts) that drift and breathe on the GSAP ticker only while the footer is in view and the visitor moves, easing to rest; drawn once on phones and under reduced motion. Inside: the name as the two-line statement (no slogan: owner decision), "Talib" in front and "Ibrahim" behind the portrait, whose head rises into it (the hero's layering rule), the hero's signature written over it after the lines rise (DrawSVG, once, at 25%), a mono `// now building: <project> · last commit <date>` line (the latest pushed public repo, fetched at build time and revalidated daily, src/lib/github.ts; absent if the fetch fails), page links left (Work, About, Contact, All projects, Recruiter mode; letter roll), Elsewhere right (GitHub, LinkedIn) with the colophon under them, the B&W cut-out portrait at the bottom centre (parallax yPercent 12 to 0), `// client` tools left and server tools `// server` right of the "Email me" block. The Recruiter mode button hides while it is on screen | stacked: name, portrait with Email me on its chest, pages and Elsewhere side by side, the two tool rows, colophon; the bottom tabs become one full band; the top tab is a small notch with no text |

The old Signature section (ink-dot collapse + 3D OGL pen) was removed at the owner's request: the hero's
drawn signature is now the signature moment. Its stroke data (signature-paths.ts) feeds the hero.

## Recruiter Mode (replaced Boring Mode at the owner's request)
- A persistent "Recruiter mode" button on the full site. One click: the furniture shrinks, greys and
  falls (gravity drop), the engine suspends, and the recruiter view appears.
- The recruiter view keeps the site's palette and type (it is NOT unstyled): a calm, scannable page.
- After getcoleman.com: a fixed slider at the bottom, "Less hard sell" to "Hard sell", 4 stops.
  3 Hard sell (default): everything. 2 Firm: projects + roles, no bullets. 1 Soft: short bio, 3 projects,
  education, contact. 0 Barely selling: one paragraph (site.recruiter.brief) + email.
  Native range input; level on <html data-sell>, persisted in localStorage 'mti:sell'.
- "Back to the full site" reverses it. Mode persisted in 'mti:mode' (old value "boring" migrates).
  Reduced motion defaults to Recruiter Mode. Both trees are server-rendered (hard sell for crawlers).

## Extensibility
Projects = `src/data/projects.ts` only. Case-study body = optional `src/content/projects/<slug>.mdx`
(compiled at build with @mdx-js/mdx). Media in `public/work/<slug>/`. Showreel, case route, sitemap,
Boring Mode list and metadata all map over the array.

## Shape & grid
- Radius 0 everywhere except the follower dot and the commit nodes (dots on the git-graph line, and the pen line's first node beside About's tagline). The footer's notches are 45deg chamfers, never curves.
- 12 cols desktop, 4 cols phone, gutter `--gutter`. Hang text from col 1, col 5, col 9.
