// One WebGL capability probe for the whole site (the About globe uses it).
let support: boolean | null = null;

/** Probed once per session: each probe costs a WebGL context, and browsers cap those. */
export function webglOK() {
  if (support !== null) return support;
  try {
    const c = document.createElement('canvas');
    const ctx = c.getContext('webgl2') || c.getContext('webgl');
    support = !!ctx;
    (ctx as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    support = false;
  }
  return support;
}
