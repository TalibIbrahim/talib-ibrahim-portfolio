// Pre-paint boot script (no React imports, so the root layout, a Server Component, can inline it).
// Flags <html> with .js and, unless reduced motion is on, .motion (hidden-until-revealed styles
// are gated on it), restores the Recruiter page's sell level so its first paint is right, and flags the
// first landing of a session for the boot screen.
export const SELL_KEY = 'mti:sell';

export const BOOT_KEY = 'mti:booted';

// First landing of a session, on the home page only (it hands over to the hero): .loading shows the boot
// screen (src/components/chrome/Loader.tsx, run by src/motion/loader.ts) and holds the hero's CSS intro.
// Hard cap: the screen is gone by 1.5 s whatever the checks say (this timer fades it out by itself if
// the app has not taken over by 1.25 s). No JS: no class, no screen.
export const BOOT_SCRIPT = `(function(){var d=document.documentElement,s=null,l=0;d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion');try{s=localStorage.getItem('${SELL_KEY}')}catch(e){}d.dataset.sell=/^[0-3]$/.test(s||'')?s:'3';try{l=!sessionStorage.getItem('${BOOT_KEY}')&&location.pathname==='/'}catch(e){}if(l){d.classList.add('loading');setTimeout(function(){if(d.classList.contains('loading')){d.classList.add('loaded');setTimeout(function(){d.classList.remove('loading','loaded');var l=document.getElementById('loader');if(l)l.remove()},250)}},1250)}})()`;
