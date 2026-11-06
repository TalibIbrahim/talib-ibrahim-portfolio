// Pre-paint boot script (no React imports, so the root layout, a Server Component, can inline it).
// Flags <html> with .js and, unless reduced motion is on, .motion (hidden-until-revealed styles
// are gated on it), restores the Recruiter page's sell level so its first paint is right, and flags the
// first landing of a session for the boot screen.
export const SELL_KEY = 'mti:sell';

export const BOOT_KEY = 'mti:booted';

// First landing of a session, on the home page only (it hands over to the hero): .loading shows the boot
// screen (src/components/chrome/Loader.tsx, run by src/motion/loader.ts) and holds the hero's CSS intro.
// Hard cap, timed from navigation start (performance.now), not from when this script ran: the screen
// is gone by 1.5 s on desktop and 1.2 s on phones (fade included) whatever the checks say, so a slow
// hydrate on a throttled phone never holds it. On phones it also leaves once the hero image has loaded
// and decoded (not before 0.6 s). If the page itself arrived so late that the screen could show for
// under ~0.5 s, it is skipped: a flash of boot text is worse than none. Either way the session is
// marked booted. No JS: no class, no screen.
export const BOOT_SCRIPT = `(function(){var d=document.documentElement,s=null,l=0;d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion');try{s=localStorage.getItem('${SELL_KEY}')}catch(e){}d.dataset.sell=/^[0-3]$/.test(s||'')?s:'3';try{l=!sessionStorage.getItem('${BOOT_KEY}')&&location.pathname==='/'}catch(e){}var p=matchMedia('(max-width: 767px), (pointer: coarse)').matches,c=p?1200:1500;if(l&&performance.now()>c-700){l=0;try{sessionStorage.setItem('${BOOT_KEY}','1')}catch(e){}}if(l){d.classList.add('loading');var f=250,o=0,g=function(){if(o||!d.classList.contains('loading'))return;o=1;d.classList.add('loaded');setTimeout(function(){d.classList.remove('loading','loaded');var x=document.getElementById('loader');if(x)x.remove();try{sessionStorage.setItem('${BOOT_KEY}','1')}catch(e){}},f)};setTimeout(g,Math.max(0,c-f-performance.now()));if(p)document.addEventListener('load',function(e){var i=e.target;if(i&&i.tagName==='IMG'&&i.closest('[data-hero]')){var r=function(){setTimeout(g,Math.max(0,600-performance.now()))};i.decode?i.decode().then(r,r):r()}},true)}})()`;
