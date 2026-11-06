# muhammad-talib.dev

The portfolio of **Muhammad Talib Ibrahim**, a full-stack developer in Lahore (BS Computer Science, UMT).

**→ [www.muhammad-talib.dev](https://www.muhammad-talib.dev)**

Recruiter? Hit **Recruiter mode** on the site for the quick, scannable version.

## What's in it

- A hero where the name compiles into my stack and gets signed (`SIGNED <hash>` is a real SHA-1 of the signature's paths).
- About copy with code-flavoured key words: they type in, decode, diff and select.
- A horizontal Work strip. A WebGL card flattens into place, and a git-graph line runs through the projects.
- Case studies for 12 projects, from Byters (live, real users) to Lumos (which I use every day).
- A stack you can play: Breakout, where the bricks are the tools I use.
- A footer that reads my latest GitHub push at build time.
- Recruiter Mode, with a sell slider from "Barely selling" to "Hard sell".
- Reduced-motion and no-JS versions of everything, plus `llms.txt` and JSON-LD so AI tools and résumé scanners can read it cleanly.

## Built with

Next.js 16 · React 19 · TypeScript · GSAP (ScrollTrigger, SplitText, ScrambleText, DrawSVG) · Lenis · OGL (WebGL) · MDX · Upstash (contact rate limiting) · Vercel

Type: Clash Display, General Sans, JetBrains Mono, Departure Mono and Fraunces.

## Notes to self

- All copy and facts live in `src/data/`. Adding a project takes one entry in `src/data/projects.ts`, its images in `public/work/<slug>/`, and an optional `src/content/projects/<slug>.mdx`.
- The design system and section timeline are in `DESIGN.md`.
- `npm run dev` to run locally, `npm run build` to check before pushing.

© Muhammad Talib Ibrahim. The code is here for reading; please don't redeploy it as your own portfolio.
