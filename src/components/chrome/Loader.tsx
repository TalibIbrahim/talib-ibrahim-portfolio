// The first-landing boot screen. Server-rendered but display:none unless the pre-paint boot script
// flagged html.loading (first landing of the session, JS on, not /recruiter), so no-JS visitors and
// later navigations never see it. The page (hero HTML, its eager <img>) renders and loads underneath.
// src/motion/loader.ts ticks each line off a real readiness check and hands over to the hero intro.
// Its text sits in data-final (drawn by CSS until loader.ts copies it in), so the server HTML's text
// starts with the page itself: scrapers, ATS tools and AI readers never see the boot lines.
import { site } from '@/data/site';

type TProps = { text: string; className?: string; [data: `data-${string}`]: true | undefined };
const T = ({ text, ...rest }: TProps) => (
  <span data-final={text} {...rest} />
);

export function Loader() {
  const L = site.loader;
  const checks = [
    { key: 'fonts', label: L.checks.fonts },
    { key: 'images', label: L.checks.images },
    { key: 'scroll', label: L.checks.scroll },
  ];
  return (
    <div id="loader" aria-hidden="true">
      <div className="loader__term">
        <p className="loader__line loader__cmd" data-boot-line>
          <T text={L.command} data-boot-text />
        </p>
        {checks.map((c) => (
          <p key={c.key} className="loader__line" data-boot-line data-check={c.key}>
            <span className="loader__status">
              <T text="[" />
              <T text={L.pending} data-boot-status />
              <T text="]" />
            </span>{' '}
            <T text={c.label} data-boot-text />
          </p>
        ))}
        <p className="loader__line loader__ready" data-boot-line data-boot-ready>
          <T text=">" className="loader__prompt" /> <T text={L.ready} data-boot-text />
          <span className="loader__caret" />
        </p>
      </div>
    </div>
  );
}
