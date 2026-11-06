// The first-landing boot screen. Server-rendered but display:none unless the pre-paint boot script
// flagged html.loading (first landing of the session, JS on, not /recruiter), so no-JS visitors and
// later navigations never see it. The page (hero HTML, its eager <img>) renders and loads underneath.
// src/motion/loader.ts ticks each line off a real readiness check and hands over to the hero intro.
import { site } from '@/data/site';

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
          <span data-boot-text>{L.command}</span>
        </p>
        {checks.map((c) => (
          <p key={c.key} className="loader__line" data-boot-line data-check={c.key}>
            <span className="loader__status">
              [<span data-boot-status>{L.pending}</span>]
            </span>{' '}
            <span data-boot-text>{c.label}</span>
          </p>
        ))}
        <p className="loader__line loader__ready" data-boot-line data-boot-ready>
          <span className="loader__prompt">&gt;</span> <span data-boot-text>{L.ready}</span>
          <span className="loader__caret" />
        </p>
      </div>
    </div>
  );
}
