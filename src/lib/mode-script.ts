// Pre-paint boot script (no React imports, so the root layout, a Server Component, can inline it).
// Flags <html> with .js and, unless reduced motion is on, .motion (hidden-until-revealed styles
// are gated on it), and restores the Recruiter page's sell level so its first paint is right.
export const SELL_KEY = 'mti:sell';

export const BOOT_SCRIPT = `(function(){var d=document.documentElement,s=null;d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion');try{s=localStorage.getItem('${SELL_KEY}')}catch(e){}d.dataset.sell=/^[0-3]$/.test(s||'')?s:'3'})()`;
