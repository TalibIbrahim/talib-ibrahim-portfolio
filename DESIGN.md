# muhammad-talib.dev — DESIGN

Source of truth for every build pass. Read before touching code.

## Brief
- Subject: Muhammad Talib Ibrahim, full-stack developer, BS CS at UMT Lahore (expected July 2027, GPA 3.6/4.0), co-founder of Radix Systems.
- Audience: recruiters and engineering leads, then other developers.
- Job: get hired / get contacted. Boring Mode is the recruiter and accessibility view.
- Content rule: only facts in `src/data`. Nothing invented (no awards, no metrics).

## Concept card
```
Idea:        The site is a pen. You meet the person first; then the page collapses into a single
             ink dot and the signature writes itself from it. Every section after is something
             else a pen does, and you never know which one comes next.
Metaphor:    Ink on a dark desk: touch down, write, bleed, zoom into a loop, turn the page, strike through.
Signature:   The landing's portrait card shrinks into the ink dot; the camera dives into that dot and
             follows the nib of a glossy 3D ink pipe (OGL) as it writes the signature, then the ink
             bleeds into paper. One WebGL scene (pipe + bleed in one canvas). Flat SVG fallback.
Emotion:     First 3 seconds: a real person, a big name. Then: "wait, where did he go?"
Motion verb: "flow like ink": long out-expo settles, strokes that lead and trail.
Screenshot:  The half-written 3D signature with the ballpoint tip mid-stroke.
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
- Display: **Clash Display** (Fontshare, `--font-clash`), 500/600/700. Tracking -0.035em mega, -0.03em xl, -0.02em l.
- Text: **General Sans** (Fontshare, `--font-general`), 400/500/600 (+400 italic). Body 16–18 px / 1.55.
- Mono (labels, timecodes, counters only): **Azeret Mono** (`--f-mono`), uppercase +0.04–0.06em.
- Never: Inter, Roboto, Space Grotesk. (Boska + mono body was the first pass; the owner preferred Clash + General Sans.)

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
- Idle: the hero nib glint orbits slowly; the showreel posters drift. Paused off-screen, off under reduced motion.
- No loader. The landing (portrait + name, real HTML and an eager <img>) is the LCP; its intro plays in ~1.4 s.

## Section timeline (each boundary uses a different transition, never repeated)
| # | Section | Desktop | Phone |
|---|---|---|---|
| 1 | Landing (sticky, 230svh) | intro: card opens, photo rises, "Talib" (behind photo) / "Ibrahim" (in front) settle in; scroll: name pulls apart, photo fades, card **collapses into the ink dot** | 180svh |
| 2 | Signature (sticky 300svh, starts under the landing's last screen) | handoff on the dot; camera dives in and grazes the 3D pipe's nib, pulls back as it writes (smoothed path + damped camera); i-dots; statement; then **WebGL ink bleed** to paper | 220svh, dpr 1.5 |
| 3 | About | masked line reveal + word ink-fill (muted→ink) scrubbed | same, no pin |
| 4 | About→Work | **zoom-through**: the counter of an "o" scales into the reel frame | shorter |
| 5 | Work showreel (sticky) | full-bleed reels, frame .56→1 + rotateX 24→0, film-advance with timecode | stacked reels, autoplay in view |
| 6 | Work→Stack | **rotate**: section turns in from -8° around its top-left corner | rotate only |
| 7 | Stack (pinned horizontal) | 4 groups on a type strip; cards arrive from different directions/eases | native scroll-snap row |
| 8 | Stack→Experience | **diagonal clip-path wipe** (a strike-through) | same |
| 9 | Experience + Education | parallax depth, entries from left/right/below at 3 speeds | single column |
| 10 | Contact (finale) | **reveal from underneath**: Timeline slides off while Contact is held beneath, scaling .92→1 and un-dimming; "Email me" per-char; form | scale .96→1, no hold |

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
- Radius 0 everywhere except the follower dot and the reel frame (animated 18px→0).
- 12 cols desktop, 4 cols phone, gutter `--gutter`. Hang text from col 1, col 5, col 9.
