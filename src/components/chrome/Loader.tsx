// The first-landing boot screen. Shown only when the pre-paint boot script flagged html.loading (first
// landing of the session, on the home page, JS on); everywhere else the inline script right after it
// takes it out of the DOM before first paint, so no-JS visitors, other pages and later visits never
// carry it. The markup is set as inner HTML (React does not own it), so removing it never upsets
// hydration. The page (hero HTML, its eager <img>) renders and loads underneath.
// src/motion/loader.ts ticks each line off a real readiness check and hands over to the hero intro.
import { site } from '@/data/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function markup() {
  const L = site.loader;
  const checks = [
    ['fonts', L.checks.fonts],
    ['images', L.checks.images],
    ['scroll', L.checks.scroll],
  ];
  return (
    '<div id="loader" aria-hidden="true"><div class="loader__term">' +
    `<p class="loader__line loader__cmd" data-boot-line><span data-boot-text>${esc(L.command)}</span></p>` +
    checks
      .map(
        ([k, label]) =>
          `<p class="loader__line" data-boot-line data-check="${k}"><span class="loader__status">[<span data-boot-status>${esc(L.pending)}</span>]</span> <span data-boot-text>${esc(label)}</span></p>`,
      )
      .join('') +
    `<p class="loader__line loader__ready" data-boot-line data-boot-ready><span class="loader__prompt">&gt;</span> <span data-boot-text>${esc(L.ready)}</span><span class="loader__caret"></span></p>` +
    '</div></div>'
  );
}

const PRUNE =
  "(function(){if(!document.documentElement.classList.contains('loading')){var l=document.getElementById('loader');if(l)l.remove()}})()";

export function Loader() {
  return (
    <>
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: markup() }} />
      <script dangerouslySetInnerHTML={{ __html: PRUNE }} />
    </>
  );
}
