// Server-safe half of lib/mode: constants and the pre-paint script, no React imports,
// so the root layout (a Server Component) can inline MODE_SCRIPT.
export type Mode = 'fun' | 'recruiter';
export const MODE_KEY = 'mti:mode';
export const SELL_KEY = 'mti:sell';

/** Inline, runs before paint. Keep it tiny and dependency-free. A stored "boring" (the old name)
 *  counts as recruiter. Reduced motion defaults to Recruiter Mode. */
export const MODE_SCRIPT = `(function(){var d=document.documentElement,r=matchMedia('(prefers-reduced-motion: reduce)').matches,m=null,s=null;d.classList.add('js');try{m=localStorage.getItem('${MODE_KEY}');s=localStorage.getItem('${SELL_KEY}')}catch(e){}if(m==='boring')m='recruiter';if(m!=='fun'&&m!=='recruiter')m=r?'recruiter':'fun';d.dataset.mode=m;d.dataset.sell=/^[0-3]$/.test(s||'')?s:'3';if(m==='fun'&&!r)d.classList.add('motion')})()`;
