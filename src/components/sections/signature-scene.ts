// The site's one WebGL moment: the signature as a lit 3D ink pipe, plus the ink-to-paper bleed,
// rendered in a single OGL canvas. The path is resampled and smoothed so the tube (and the camera
// that follows the pen) glide instead of twitching through every tight turn.
import { Camera, Geometry, Mesh, Program, Renderer, Sphere, Transform, Triangle, Vec3 } from 'ogl';
import { FRAG as BLEED_FRAG, VERT as BLEED_VERT } from './ink-shader';

export type Pt = { x: number; y: number };
export type SceneInput = {
  draw: number; // 0..1 along all strokes, by length
  dots: number; // 0..1 tittles
  shot: number; // 0..1, the single tracking shot (eased by the caller): close on the first stroke → whole signature
  look: [number, number]; // pointer, -0.5..0.5 (only applied once the shot has landed)
  glint: number | null; // 0..1 along the signature, null = rides the nib
  bleed: number; // 0..1
  time: number;
};

const SCALE = 1 / 100; // svg units → world
const CX = 550;
const CY = 183;
const toWorld = (p: Pt, z = 0) => new Vec3((p.x - CX) * SCALE, -(p.y - CY) * SCALE, z);

/** Moving-average smoothing, endpoints pinned. */
function smooth(pts: Pt[], radius: number, passes: number) {
  let a = pts;
  for (let k = 0; k < passes; k++) {
    const b = a.map((p, i) => {
      if (i === 0 || i === a.length - 1) return p;
      let sx = 0, sy = 0, n = 0;
      for (let j = Math.max(0, i - radius); j <= Math.min(a.length - 1, i + radius); j++) {
        sx += a[j].x; sy += a[j].y; n++;
      }
      return { x: sx / n, y: sy / n };
    });
    a = b;
  }
  return a;
}

/** Resample an "M x y C ..." path (the signature only uses cubic Beziers) every `step` svg units.
 *  Pure maths: SVGPathElement.getPointAtLength is O(path) per call and cost ~1.6 s of main thread
 *  for a few thousand samples, so it is not used here. */
export function samplePathD(d: string, step = 2): Pt[] {
  const n = d.match(/-?\d*\.?\d+/g)!.map(Number);
  // Flatten each cubic finely, then walk the polyline at a constant arc length.
  const fine: Pt[] = [{ x: n[0], y: n[1] }];
  for (let i = 2; i + 5 < n.length; i += 6) {
    const p0 = fine[fine.length - 1];
    const [x1, y1, x2, y2, x3, y3] = n.slice(i, i + 6);
    for (let k = 1; k <= 24; k++) {
      const t = k / 24, u = 1 - t;
      fine.push({
        x: u * u * u * p0.x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
        y: u * u * u * p0.y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
      });
    }
  }
  const out: Pt[] = [fine[0]];
  let carry = 0;
  for (let i = 1; i < fine.length; i++) {
    const a0 = fine[i - 1], a1 = fine[i];
    const seg = Math.hypot(a1.x - a0.x, a1.y - a0.y);
    let pos = step - carry;
    while (pos <= seg) {
      const t = pos / seg;
      out.push({ x: a0.x + (a1.x - a0.x) * t, y: a0.y + (a1.y - a0.y) * t });
      pos += step;
    }
    carry = seg - (pos - step);
  }
  const last = fine[fine.length - 1];
  if (out[out.length - 1] !== last) out.push(last);
  return out;
}

const RADIAL = 18;

/** Tube along a planar polyline. Radius follows a 45° broad nib (thick across, thin along),
 *  tapers at both ends. `aLen` is the global 0..1 position, used for the travelling glint. */
function tube(gl: Renderer['gl'], pts: Pt[], z: number, len0: number, lenTotal: number) {
  const n = pts.length;
  const pos = new Float32Array(n * RADIAL * 3);
  const nor = new Float32Array(n * RADIAL * 3);
  const al = new Float32Array(n * RADIAL);
  const idx = new Uint16Array((n - 1) * RADIAL * 6); // < 65k vertices per stroke
  const P = pts.map((p) => toWorld(p, z));
  // Arc length for the glint attribute and the taper.
  const s = [0];
  for (let i = 1; i < n; i++) s.push(s[i - 1] + P[i].distance(P[i - 1]));
  const L = s[n - 1];
  const radii: number[] = [];
  // Nib radius, smoothed so it never jumps.
  let rad = P.map((_, i) => {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)];
    const ang = Math.atan2(b.y - a.y, b.x - a.x);
    return 0.62 + 0.55 * Math.abs(Math.sin(ang - Math.PI / 4));
  });
  rad = smooth(rad.map((r) => ({ x: r, y: 0 })), 6, 2).map((p) => p.x);
  for (let i = 0; i < n; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)];
    const t = new Vec3().sub(b, a).normalize();
    const N = new Vec3(-t.y, t.x, 0);
    const B = new Vec3(0, 0, 1);
    const u = s[i] / L;
    const taper = Math.min(1, u / 0.025, (1 - u) / 0.025);
    const r = 0.042 * rad[i] * (0.08 + 0.92 * Math.sqrt(Math.max(0, taper))); // rounded, closed ends
    radii.push(r);
    for (let j = 0; j < RADIAL; j++) {
      const th = (j / RADIAL) * Math.PI * 2;
      const nx = Math.cos(th) * N.x + Math.sin(th) * B.x;
      const ny = Math.cos(th) * N.y + Math.sin(th) * B.y;
      const nz = Math.cos(th) * N.z + Math.sin(th) * B.z;
      const k = (i * RADIAL + j) * 3;
      pos[k] = P[i].x + nx * r; pos[k + 1] = P[i].y + ny * r; pos[k + 2] = P[i].z + nz * r;
      nor[k] = nx; nor[k + 1] = ny; nor[k + 2] = nz;
      al[i * RADIAL + j] = (len0 + s[i]) / lenTotal;
    }
  }
  let q = 0;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < RADIAL; j++) {
      const a = i * RADIAL + j, b = i * RADIAL + ((j + 1) % RADIAL);
      const c = a + RADIAL, d = b + RADIAL;
      idx[q++] = a; idx[q++] = c; idx[q++] = b;
      idx[q++] = b; idx[q++] = c; idx[q++] = d;
    }
  }
  const geometry = new Geometry(gl, {
    position: { size: 3, data: pos },
    normal: { size: 3, data: nor },
    aLen: { size: 1, data: al },
    index: { data: idx },
  });
  return { geometry, count: idx.length, length: L, points: P, radii };
}

const TUBE_VERT = /* glsl */ `
attribute vec3 position;
attribute vec3 normal;
attribute float aLen;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
varying vec3 vN;
varying vec3 vV;
varying float vLen;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = -mv.xyz;
  vLen = aLen;
  gl_Position = projectionMatrix * mv;
}`;

const TUBE_FRAG = /* glsl */ `
precision highp float;
varying vec3 vN;
varying vec3 vV;
varying float vLen;
uniform vec3 uInk;
uniform float uGlint;
uniform float uGlintAmt;
void main() {
  vec3 n = normalize(vN);
  vec3 v = normalize(vV);
  vec3 l = normalize(vec3(0.35, 0.65, 0.7));
  float diff = max(dot(n, l), 0.0);
  float wrap = max(dot(n, l) * 0.5 + 0.5, 0.0);
  float spec = pow(max(dot(reflect(-l, n), v), 0.0), 60.0);
  float spec2 = pow(max(dot(reflect(-normalize(vec3(-0.6, -0.2, 0.8)), n), v), 0.0), 24.0);
  float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  // Glossy wet ink: deep core, bright key highlight, cool rim.
  vec3 col = uInk * (0.12 + 0.55 * wrap * wrap + 0.35 * diff) + vec3(1.0) * spec * 1.1 + vec3(0.8, 0.85, 1.0) * spec2 * 0.25 + vec3(0.55, 0.65, 1.0) * rim * 0.7;
  float g = exp(-pow((vLen - uGlint) / 0.0018, 2.0)) * uGlintAmt;
  col += vec3(1.0) * g * 0.9;
  gl_FragColor = vec4(col, 1.0);
}`;

export type SignatureScene = {
  render: (s: SceneInput) => void;
  resize: () => void;
  destroy: () => void;
};

export function createSignatureScene(
  host: HTMLElement,
  strokes: Pt[][],
  dots: Pt[],
  opts: { mobile: boolean; ink: string; paper: string; onLost?: () => void },
): SignatureScene | null {
  let renderer: Renderer;
  try {
    renderer = new Renderer({ dpr: Math.min(devicePixelRatio, opts.mobile ? 1.5 : 2), alpha: true, antialias: true, premultipliedAlpha: false });
  } catch {
    return null;
  }
  const gl = renderer.gl;
  if (!gl) return null;
  gl.canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(gl.canvas);
  gl.clearColor(0, 0, 0, 0);
  // GPU reset or memory pressure: hand back to the flat SVG instead of leaving a blank canvas.
  const lost = (e: Event) => { e.preventDefault(); opts.onLost?.(); };
  gl.canvas.addEventListener('webglcontextlost', lost);

  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const ink = hex(opts.ink);

  // Smooth the handwriting: relaxes the tight kinks without changing the letterforms.
  const smoothed = strokes.map((s) => smooth(s, 4, 3));
  const z = [0, 0.004, -0.02];
  let total = 0;
  const lens = smoothed.map((s) => {
    let l = 0;
    for (let i = 1; i < s.length; i++) l += Math.hypot(s[i].x - s[i - 1].x, s[i].y - s[i - 1].y);
    return l * SCALE;
  });
  lens.forEach((l) => (total += l));

  const scene = new Transform();
  const program = new Program(gl, {
    vertex: TUBE_VERT,
    fragment: TUBE_FRAG,
    uniforms: { uInk: { value: ink }, uGlint: { value: 0 }, uGlintAmt: { value: 0 } },
    cullFace: gl.BACK,
  });
  let acc = 0;
  const tubes = smoothed.map((s, i) => {
    const t = tube(gl, s, z[i] ?? 0, acc, total);
    acc += lens[i];
    const mesh = new Mesh(gl, { geometry: t.geometry, program });
    mesh.setParent(scene);
    t.geometry.setDrawRange(0, 0);
    return { ...t, mesh };
  });

  // Tittles.
  const sphere = new Sphere(gl, { radius: 0.055, widthSegments: 20, heightSegments: 14 });
  // The shared program reads aLen; tittles sit outside the glint's range.
  sphere.addAttribute('aLen', { size: 1, data: new Float32Array(sphere.attributes.position.count ?? 0).fill(-1) });
  const dotMeshes = dots.map((d) => {
    const m = new Mesh(gl, { geometry: sphere, program });
    const p = toWorld(d, 0.01);
    m.position.copy(p);
    m.scale.set(0);
    m.setParent(scene);
    return m;
  });

  // A rounded cap rides the growing tip (otherwise the open ring shows the inside of the pipe),
  // and an ink drop marks the touchdown, matching the landing's final dot.
  const unit = new Sphere(gl, { radius: 1, widthSegments: 24, heightSegments: 16 });
  unit.addAttribute('aLen', { size: 1, data: new Float32Array(unit.attributes.position.count ?? 0).fill(-1) });
  const tip = new Mesh(gl, { geometry: unit, program });
  tip.setParent(scene);
  const drop = new Mesh(gl, { geometry: unit, program });
  drop.position.copy(tubes[0].points[0]);
  drop.scale.set(0.028); // ~ the landing's dot at the opening distance
  drop.setParent(scene);

  // One tracking shot, a pure function of scroll: no chasing the nib, no per-frame smoothing.
  // From the touchdown (the first stroke's start) it glides right while pulling back and levelling off.
  const camera = new Camera(gl, { fov: 32, near: 0.01, far: 100 });
  const start = new Vec3().copy(tubes[0].points[0]);
  const settled = new Vec3(0, -0.15, 0);
  const look = new Vec3();
  const TILT0 = (16 * Math.PI) / 180;

  // Bleed: a full-screen pass behind the tube.
  const bleedProgram = new Program(gl, {
    vertex: BLEED_VERT,
    fragment: BLEED_FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uP: { value: 0 },
      uTime: { value: 0 },
      uRes: { value: [1, 1] },
      uOrigin: { value: [0.5, opts.mobile ? 0.62 : 0.6] },
      uPaper: { value: hex(opts.paper) },
      uInk: { value: ink },
    },
  });
  const bleed = new Mesh(gl, { geometry: new Triangle(gl), program: bleedProgram });

  let aspect = 1;
  function resize() {
    const w = host.clientWidth || innerWidth;
    const h = host.clientHeight || innerHeight;
    renderer.setSize(w, h);
    aspect = w / h;
    camera.perspective({ aspect });
    bleedProgram.uniforms.uRes.value = [w, h];
  }
  resize();

  // Distance at which the whole signature (11 units wide) fills 80% (92% on phones) of the width.
  const frameDist = () => {
    const width = 11 / (opts.mobile ? 0.9 : 0.78);
    const hfov = 2 * Math.atan(Math.tan(((32 * Math.PI) / 180) / 2) * aspect);
    return width / 2 / Math.tan(hfov / 2);
  };

  function render(s: SceneInput) {
    // Strokes draw in writing order, by length.
    let l = s.draw * total;
    tip.visible = false;
    tubes.forEach((t, i) => {
      const f = Math.min(1, Math.max(0, l / lens[i]));
      l -= lens[i];
      const rings = Math.floor(f * (t.points.length - 1));
      t.geometry.setDrawRange(0, rings * RADIAL * 6);
      if (f > 0 && f < 1) {
        tip.visible = true;
        tip.position.copy(t.points[rings]);
        tip.scale.set(t.radii[rings]);
      }
    });
    dotMeshes.forEach((m, i) => {
      const k = Math.min(1, Math.max(0, (s.dots - i * 0.35) / 0.65));
      const e = k === 0 ? 0 : 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2); // back-out
      m.scale.set(Math.max(0, e));
    });

    // Camera: every term below is monotonic in s.shot, so the move never reverses.
    const t = s.shot;
    const D1 = frameDist();
    const D0 = D1 * 0.35;
    const dist = D0 + (D1 - D0) * t;
    const landed = Math.max(0, (t - 0.9) / 0.1); // pointer parallax only once the shot is done
    const tilt = TILT0 * (1 - t) - s.look[1] * 0.05 * landed;
    const yaw = s.look[0] * 0.07 * landed;
    look.copy(start).lerp(settled, 1 - (1 - t) * (1 - t)); // the pan leads (ease-out) so the nib never outruns the frame
    look.y -= t * dist * (opts.mobile ? 0.08 : 0.046); // settled signature sits above centre, statement below
    // The page tilts back toward face-on (the camera itself only glides), so no axis ever reverses.
    scene.rotation.x = -tilt;
    camera.position.set(look.x + Math.sin(yaw) * dist, look.y, Math.cos(yaw) * dist);
    camera.lookAt(look);

    program.uniforms.uGlint.value = s.glint ?? s.draw;
    // The glint is a pin-point: faded out while the camera is right at the nib.
    program.uniforms.uGlintAmt.value = (s.glint === null ? (s.draw > 0 && s.draw < 1 ? 0.9 : 0) : 0.7) * Math.min(1, 0.4 + t);

    bleedProgram.uniforms.uP.value = s.bleed;
    bleedProgram.uniforms.uTime.value = s.time;
    renderer.render({ scene: bleed, clear: true });
    renderer.render({ scene, camera, clear: false });
  }

  return {
    render,
    resize,
    destroy() {
      gl.canvas.removeEventListener('webglcontextlost', lost);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      gl.canvas.remove();
    },
  };
}

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
