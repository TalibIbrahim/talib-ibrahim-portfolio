// The footer's ground: small off-white polka dots on a loose jittered grid, radii 1 to 3.5px, at
// .06 to .14 opacity. No loop of its own: FooterMotion calls draw() from the GSAP ticker while the
// footer is in view (and only while the visitor moves), so it drifts and the dots breathe; under
// reduced motion and on phones it is drawn once. One fill per frame, ~1 arc per 50x50px.

export type Dots = { state: { t: number }; size: () => void; draw: () => void };

const PITCH = 46; // px between grid points
const DRIFT = { x: 9, y: -5 }; // px per unit of t

/** Seeded hash, 0..1, so the layout is the same on every load. */
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export function makeDots(canvas: HTMLCanvasElement): Dots {
  const ctx = canvas.getContext('2d');
  const state = { t: 0 };
  let W = 0;
  let H = 0;
  let dpr = 1;
  let cols = 0;
  let rows = 0;
  // per dot: jitter x, jitter y, base radius, alpha, breathing phase, breathing speed
  let seed = new Float32Array(0);

  function size() {
    const r = canvas.getBoundingClientRect();
    W = r.width;
    H = r.height;
    dpr = Math.min(devicePixelRatio || 1, W < 768 ? 1.5 : 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    cols = Math.ceil(W / PITCH) + 2; // one spare column/row each side for the drift wrap
    rows = Math.ceil(H / PITCH) + 2;
    const n = cols * rows;
    seed = new Float32Array(n * 6);
    for (let i = 0; i < n; i++) {
      const o = i * 6;
      seed[o] = (hash(i) - 0.5) * PITCH * 0.7;
      seed[o + 1] = (hash(i + 0.37) - 0.5) * PITCH * 0.7;
      seed[o + 2] = 1 + Math.pow(hash(i + 0.71), 2.2) * 2.5; // mostly small, a few up to 3.5px
      seed[o + 3] = 0.06 + hash(i + 0.13) * 0.08;
      seed[o + 4] = hash(i + 0.53) * Math.PI * 2;
      seed[o + 5] = 0.35 + hash(i + 0.91) * 0.5;
    }
  }

  function draw() {
    if (!ctx || !W) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const t = state.t;
    const spanX = cols * PITCH;
    const spanY = rows * PITCH;
    const ox = ((DRIFT.x * t) % spanX + spanX) % spanX;
    const oy = ((DRIFT.y * t) % spanY + spanY) % spanY;
    // alpha is bucketed into 3 fills so a frame is three paths, not one per dot
    for (let band = 0; band < 3; band++) {
      ctx.beginPath();
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const o = (j * cols + i) * 6;
          const a = seed[o + 3];
          if (Math.min(2, Math.floor(((a - 0.06) / 0.08) * 3)) !== band) continue;
          let x = i * PITCH + seed[o] + ox;
          let y = j * PITCH + seed[o + 1] + oy;
          x = (((x % spanX) + spanX) % spanX) - PITCH;
          y = (((y % spanY) + spanY) % spanY) - PITCH;
          if (x < -4 || y < -4 || x > W + 4 || y > H + 4) continue;
          // low-frequency breathing: two slow sines per dot, never below 70% of its size
          const b = 0.85 + 0.15 * Math.sin(t * seed[o + 5] + seed[o + 4]) * Math.cos(t * 0.23 + seed[o + 4] * 0.5);
          const r = seed[o + 2] * b;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      ctx.fillStyle = `rgba(236,232,223,${(0.07 + band * 0.03).toFixed(2)})`;
      ctx.fill();
    }
  }

  size();
  return { state, size, draw };
}
