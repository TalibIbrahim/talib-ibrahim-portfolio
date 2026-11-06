// The hero's survey sheet: contour lines from drifting 3D simplex noise (marching squares on a 2D
// canvas), a faint grid on the site's columns, and a few mono spot heights that read the live terrain.
// No loop of its own: HeroMotion calls draw() from the GSAP ticker (30 fps, only while the hero shows);
// under reduced motion it is drawn once.

const GRAD = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1],
  [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];
const PERM = (() => {
  const p = [...Array(256).keys()];
  let s = 7;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  const out = new Uint8Array(512);
  for (let i = 0; i < 512; i++) out[i] = p[i & 255];
  return out;
})();

/** Gustavson's 3D simplex noise, roughly -1..1. */
function noise3(x: number, y: number, z: number) {
  const F3 = 1 / 3, G3 = 1 / 6;
  const t = (x + y + z) * F3;
  const i = Math.floor(x + t), j = Math.floor(y + t), k = Math.floor(z + t);
  const t0 = (i + j + k) * G3;
  const x0 = x - i + t0, y0 = y - j + t0, z0 = z - k + t0;
  let i1, j1, k1, i2, j2, k2;
  if (x0 >= y0) {
    if (y0 >= z0) [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 1, 0];
    else if (x0 >= z0) [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 0, 1];
    else [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 1, 0, 1];
  } else if (y0 < z0) [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 0, 1, 1];
  else if (x0 < z0) [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 0, 1, 1];
  else [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 1, 1, 0];
  const corners = [
    [x0, y0, z0, 0, 0, 0],
    [x0 - i1 + G3, y0 - j1 + G3, z0 - k1 + G3, i1, j1, k1],
    [x0 - i2 + 2 * G3, y0 - j2 + 2 * G3, z0 - k2 + 2 * G3, i2, j2, k2],
    [x0 - 1 + 3 * G3, y0 - 1 + 3 * G3, z0 - 1 + 3 * G3, 1, 1, 1],
  ];
  const ii = i & 255, jj = j & 255, kk = k & 255;
  let n = 0;
  for (const [a, b, d, di, dj, dk] of corners) {
    let tt = 0.6 - a * a - b * b - d * d;
    if (tt < 0) continue;
    const g = GRAD[PERM[ii + di + PERM[jj + dj + PERM[kk + dk]]] % 12];
    tt *= tt;
    n += tt * tt * (g[0] * a + g[1] * b + g[2] * d);
  }
  return 32 * n;
}

export type Contours = {
  state: { t: number; scroll: number; labels: boolean };
  size: () => void;
  draw: () => void;
};

const LO = -0.78;

export function makeContours(canvas: HTMLCanvasElement): Contours {
  const ctx = canvas.getContext('2d');
  const state = { t: 0, scroll: 0, labels: true };
  let W = 0, H = 0, dpr = 1, cell = 16, cols = 0, rows = 0, phone = false, LEVELS = 26, STEP = 1.56 / 26;
  let field = new Float32Array(0);
  let font = '10px monospace';

  function size() {
    const r = canvas.getBoundingClientRect();
    W = r.width;
    H = r.height;
    phone = W < 768;
    // faint 1px lines: DPR 1 on phones and at most 1.5 elsewhere; coarser field and fewer levels on phones
    dpr = Math.min(devicePixelRatio || 1, phone ? 1 : 1.5);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    cell = phone ? 20 : 18;
    LEVELS = phone ? 18 : 24;
    STEP = 1.56 / LEVELS;
    cols = Math.ceil(W / cell) + 1;
    rows = Math.ceil(H / cell) + 1;
    field = new Float32Array(cols * rows);
    const fam = getComputedStyle(document.documentElement).getPropertyValue('--f-mono').trim() || 'monospace';
    font = `500 ${10 * dpr}px ${fam}`;
  }

  function sample() {
    const sc = 1 / 520, z = state.t, oy = state.scroll;
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const x = i * cell * sc + z * 0.35, y = (j * cell + oy) * sc;
        field[j * cols + i] = noise3(x, y, z) * 0.78 + noise3(x * 2.1 + 9, y * 2.1, z * 1.3) * 0.22;
      }
  }

  /** The site grid (12 columns, 4 on phones), gutter-inset, so the sheet lines up with the type. */
  function grid() {
    const gut = Math.min(40, Math.max(16, 0.6 * 16 + 0.016 * W));
    return { gut, pitch: (W - 2 * gut) / (phone ? 4 : 12) };
  }

  function draw() {
    if (!ctx || !W) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sample();
    const { gut, pitch } = grid();

    // 1. survey grid
    ctx.beginPath();
    for (let x = gut; x <= W - gut + 0.5; x += pitch) {
      ctx.moveTo(x * dpr, 0);
      ctx.lineTo(x * dpr, H * dpr);
    }
    for (let y = (H / 2) % pitch; y < H; y += pitch) {
      ctx.moveTo(0, y * dpr);
      ctx.lineTo(W * dpr, y * dpr);
    }
    ctx.strokeStyle = 'rgba(236,232,223,.028)';
    ctx.lineWidth = dpr;
    ctx.stroke();

    // 2. isolines (two passes: plain, then every 5th as an index contour); per cell only the
    //    levels between its corner min and max are tested
    ctx.lineJoin = 'round';
    for (let pass = 0; pass < 2; pass++) {
      ctx.beginPath();
      for (let j = 0; j < rows - 1; j++)
        for (let i = 0; i < cols - 1; i++) {
          const a = field[j * cols + i], b = field[j * cols + i + 1];
          const c = field[(j + 1) * cols + i + 1], d = field[(j + 1) * cols + i];
          const mn = Math.min(a, b, c, d), mx = Math.max(a, b, c, d);
          const l0 = Math.max(0, Math.ceil((mn - LO) / STEP)), l1 = Math.min(LEVELS, Math.floor((mx - LO) / STEP));
          for (let l = l0; l <= l1; l++) {
            if ((l % 5 === 0) !== (pass === 1)) continue;
            const L = LO + l * STEP;
            const idx = (a > L ? 1 : 0) | (b > L ? 2 : 0) | (c > L ? 4 : 0) | (d > L ? 8 : 0);
            if (idx === 0 || idx === 15) continue;
            const x = i * cell, y = j * cell;
            const T = [x + (cell * (L - a)) / (b - a), y];
            const R = [x + cell, y + (cell * (L - b)) / (c - b)];
            const B = [x + (cell * (L - d)) / (c - d), y + cell];
            const Lf = [x, y + (cell * (L - a)) / (d - a)];
            const seg = (p: number[], q: number[]) => {
              ctx.moveTo(p[0] * dpr, p[1] * dpr);
              ctx.lineTo(q[0] * dpr, q[1] * dpr);
            };
            switch (idx) {
              case 1: case 14: seg(Lf, T); break;
              case 2: case 13: seg(T, R); break;
              case 3: case 12: seg(Lf, R); break;
              case 4: case 11: seg(R, B); break;
              case 5: seg(Lf, T); seg(R, B); break;
              case 10: seg(T, R); seg(B, Lf); break;
              case 6: case 9: seg(T, B); break;
              case 7: case 8: seg(Lf, B); break;
            }
          }
        }
      ctx.lineWidth = (pass ? 1.25 : 0.75) * dpr;
      ctx.strokeStyle = pass ? 'rgba(236,232,223,.10)' : 'rgba(236,232,223,.05)';
      ctx.stroke();
    }

    // 3. spot heights on grid intersections (desktop only; never under the nav or the corner UI)
    if (phone || !state.labels) return;
    ctx.font = font;
    ctx.textBaseline = 'middle';
    for (const [ci, ri] of [[1, 1], [10, 1], [2, 4], [9, 5], [4, 6], [11, 3]]) {
      const x = gut + ci * pitch, y = ((H / 2) % pitch) + ri * pitch;
      if (y < 96 || y > H - 110) continue;
      const i = Math.min(cols - 1, Math.round(x / cell)), j = Math.min(rows - 1, Math.round(y / cell));
      const v = Math.round(field[j * cols + i] * 400 + 400);
      ctx.strokeStyle = 'rgba(236,232,223,.22)';
      ctx.lineWidth = dpr;
      ctx.beginPath();
      ctx.moveTo((x - 3) * dpr, (y - 3) * dpr);
      ctx.lineTo((x + 3) * dpr, (y + 3) * dpr);
      ctx.moveTo((x + 3) * dpr, (y - 3) * dpr);
      ctx.lineTo((x - 3) * dpr, (y + 3) * dpr);
      ctx.stroke();
      ctx.fillStyle = 'rgba(236,232,223,.26)';
      ctx.fillText(String(v).padStart(3, '0'), (x + 7) * dpr, y * dpr);
    }
  }

  size();
  return { state, size, draw };
}
