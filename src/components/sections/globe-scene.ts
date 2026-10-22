// About's ink-dot globe: land as pen-blue dots on a Fibonacci sphere (baked in globe-dots.ts),
// drawn by OGL as GL_POINTS. One canvas, one geometry, two passes per frame:
//   back pass   the far hemisphere in deep ink, small and faint (seen through the empty oceans),
//               plus a dotted limb ring around the sphere
//   front pass  the near hemisphere, shaded towards deep ink at the limb, sized by depth
// Every dot is pushed away from the pointer in screen space (gaussian falloff). Rotation, scale,
// push and reveal are uniforms; the caller drives them on gsap.ticker.
import { Geometry, Mesh, Program, Renderer } from 'ogl';
import { GLOBE_LAND, GLOBE_N, GLOBE_RADIUS, LAHORE } from './globe-dots';

export type GlobeInput = {
  time: number; // seconds, idle breath
  lng: number; // degrees: the globe's centre faces (lng, lat)
  lat: number;
  scale: number;
  reveal: number; // 0..1 ink spreads out from Lahore
  pointer: [number, number]; // canvas css px, origin bottom-left
  push: number; // 0..1
};

export type GlobeScene = {
  render: (s: GlobeInput) => void;
  resize: () => void;
  /** Lahore's projection for a pose: canvas css px from the top-left, and depth (1 = facing). */
  project: (lng: number, lat: number, scale: number) => { x: number; y: number; z: number };
  size: () => { w: number; h: number; r: number };
  destroy: () => void;
};

const D = Math.PI / 180;
const LIMB = 220; // dots on the limb ring

/** Column-major mat3 for q = Rx(lat) * Ry(-lng) * p (same convention as scripts/gen-globe-dots.mjs). */
export function rotation(lng: number, lat: number) {
  const s = Math.sin(-lng * D);
  const c = Math.cos(-lng * D);
  const sb = Math.sin(lat * D);
  const cb = Math.cos(lat * D);
  // rows: [c, 0, s], [sb*s, cb, -sb*c], [-cb*s, sb, cb*c]
  return [c, sb * s, -cb * s, 0, cb, sb, s, -sb * c, cb * c];
}

export function latLngVec(lat: number, lng: number): [number, number, number] {
  return [Math.cos(lat * D) * Math.sin(lng * D), Math.sin(lat * D), Math.cos(lat * D) * Math.cos(lng * D)];
}

function landPoints() {
  const bin = atob(GLOBE_LAND);
  const ga = Math.PI * (3 - Math.sqrt(5));
  const pts: number[] = [];
  for (let i = 0; i < GLOBE_N; i++) {
    if (!((bin.charCodeAt(i >> 3) >> (i & 7)) & 1)) continue;
    const y = 1 - (2 * (i + 0.5)) / GLOBE_N;
    const r = Math.sqrt(1 - y * y);
    const t = i * ga;
    pts.push(Math.cos(t) * r, y, Math.sin(t) * r);
  }
  return pts;
}

const VERT = /* glsl */ `
attribute vec3 position;
attribute float kind; // 0 land, 1 limb ring (position.xy already on the screen circle)
uniform mat3 uRot;
uniform vec2 uRes;      // canvas css px
uniform float uR;       // sphere radius, css px
uniform float uScale;
uniform float uDpr;
uniform float uSize;    // front-centre dot diameter, css px
uniform float uSide;    // 1 front pass, -1 back pass
uniform float uTime;
uniform float uReveal;
uniform vec3 uPin;      // Lahore, unrotated
uniform vec2 uPointer;
uniform float uPush;
uniform float uRadius;
uniform float uAmp;
varying float vZ;
varying float vKind;
varying float vPx;

void main() {
  vec3 q = kind > 0.5 ? vec3(position.xy, 0.0) : uRot * position;
  bool keep = kind > 0.5 ? uSide < 0.0 : q.z * uSide >= 0.0;
  vZ = q.z;
  vKind = kind;
  vec2 s = uRes * 0.5 + q.xy * uR * uScale;
  // Pointer: push the dot away in screen space. The far side moves less: it is "under" the paper.
  vec2 d = s - uPointer;
  float r = length(d) + 1e-4;
  float k = uAmp * uPush * exp(-(r * r) / (uRadius * uRadius)) * (q.z < 0.0 && kind < 0.5 ? 0.45 : 1.0);
  s += d / r * k;
  // Reveal: ink spreads from Lahore across the sphere.
  float ang = acos(clamp(dot(position, uPin), -1.0, 1.0)) / 3.14159265;
  float rv = kind > 0.5 ? uReveal : clamp(uReveal * 1.7 - ang, 0.0, 1.0);
  rv = 1.0 - pow(1.0 - rv, 3.0);
  float breath = 1.0 + 0.08 * sin(uTime * 0.8 + position.y * 7.0 + position.x * 3.0);
  float size = kind > 0.5 ? uSize * 0.55
    : q.z >= 0.0 ? uSize * (0.5 + 0.5 * q.z) : uSize * (0.42 + 0.18 * -q.z);
  // A pushed dot shrinks a touch, like ink thinned by the drag.
  size *= breath * rv * (1.0 - 0.3 * k / max(uAmp, 1.0)) * mix(0.9, 1.0, uScale);
  vPx = size * uDpr;
  gl_PointSize = keep ? max(vPx, 0.0) : 0.0;
  gl_Position = keep ? vec4(s / uRes * 2.0 - 1.0, 0.0, 1.0) : vec4(2.0, 2.0, 2.0, 1.0);
}`;

const FRAG = /* glsl */ `
precision highp float;
uniform vec3 uInk;
uniform vec3 uDeep;
varying float vZ;
varying float vKind;
varying float vPx;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float aa = 2.0 / max(vPx, 1.0);
  float a = 1.0 - smoothstep(1.0 - aa, 1.0, d);
  vec3 col;
  if (vKind > 0.5) {
    col = uInk; a *= 0.32;
  } else if (vZ >= 0.0) {
    col = mix(uInk, uDeep, pow(1.0 - vZ, 2.0) * 0.7);
  } else {
    col = uDeep; a *= 0.12 + 0.16 * -vZ; // the far side, faint through the oceans
  }
  if (a <= 0.003) discard;
  gl_FragColor = vec4(col * a, a); // premultiplied
}`;

export function createGlobeScene(
  host: HTMLElement,
  opts: { mobile: boolean; ink: string; deep: string; pad: number; onLost?: () => void },
): GlobeScene | null {
  let renderer: Renderer;
  try {
    renderer = new Renderer({
      dpr: Math.min(devicePixelRatio, opts.mobile ? 1.5 : 2),
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      depth: false,
    });
  } catch {
    return null;
  }
  const gl = renderer.gl;
  if (!gl) return null;
  gl.canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(gl.canvas);
  gl.clearColor(0, 0, 0, 0);
  const lost = (e: Event) => {
    e.preventDefault();
    opts.onLost?.();
  };
  gl.canvas.addEventListener('webglcontextlost', lost);

  const land = landPoints();
  const nLand = land.length / 3;
  const pos = new Float32Array((nLand + LIMB) * 3);
  const kind = new Float32Array(nLand + LIMB);
  pos.set(land);
  for (let i = 0; i < LIMB; i++) {
    const t = (i / LIMB) * Math.PI * 2;
    pos.set([Math.cos(t), Math.sin(t), 0], (nLand + i) * 3);
    kind[nLand + i] = 1;
  }
  const geometry = new Geometry(gl, {
    position: { size: 3, data: pos },
    kind: { size: 1, data: kind },
  });

  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uRot: { value: rotation(0, 0) },
      uRes: { value: [1, 1] },
      uR: { value: 100 },
      uScale: { value: 1 },
      uDpr: { value: renderer.dpr },
      uSize: { value: 3 },
      uSide: { value: 1 },
      uTime: { value: 0 },
      uReveal: { value: 1 },
      uPin: { value: latLngVec(LAHORE.lat, LAHORE.lng) },
      uPointer: { value: [-1e4, -1e4] },
      uPush: { value: 0 },
      uRadius: { value: 60 },
      uAmp: { value: 30 },
      uInk: { value: hex(opts.ink) },
      uDeep: { value: hex(opts.deep) },
    },
  });
  program.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });

  const dim = { w: 1, h: 1, r: 1 };
  function resize() {
    const W = host.clientWidth || 1;
    const H = host.clientHeight || 1;
    renderer.setSize(W, H);
    const frame = W / (1 + 2 * opts.pad); // the canvas overhangs the frame by `pad` per side
    dim.w = W;
    dim.h = H;
    dim.r = frame * GLOBE_RADIUS;
    const u = program.uniforms;
    u.uRes.value = [W, H];
    u.uR.value = dim.r;
    // Fibonacci spacing on the unit sphere is ~sqrt(4pi/N) rad; a dot fills ~80% of it.
    u.uSize.value = Math.max(1.6, dim.r * Math.sqrt((4 * Math.PI) / GLOBE_N) * 0.8);
    u.uRadius.value = dim.r * (opts.mobile ? 0.42 : 0.34);
    u.uAmp.value = u.uRadius.value * 0.55;
  }
  resize();

  const pin = latLngVec(LAHORE.lat, LAHORE.lng);
  function project(lng: number, lat: number, scale: number) {
    const m = rotation(lng, lat);
    const x = m[0] * pin[0] + m[3] * pin[1] + m[6] * pin[2];
    const y = m[1] * pin[0] + m[4] * pin[1] + m[7] * pin[2];
    const z = m[2] * pin[0] + m[5] * pin[1] + m[8] * pin[2];
    return { x: dim.w / 2 + x * dim.r * scale, y: dim.h / 2 - y * dim.r * scale, z };
  }

  function render(s: GlobeInput) {
    const u = program.uniforms;
    u.uRot.value = rotation(s.lng, s.lat);
    u.uScale.value = s.scale;
    u.uTime.value = s.time;
    u.uReveal.value = s.reveal;
    u.uPointer.value = s.pointer;
    u.uPush.value = s.push;
    u.uSide.value = -1;
    renderer.render({ scene: mesh });
    u.uSide.value = 1;
    renderer.render({ scene: mesh, clear: false });
  }

  return {
    render,
    resize,
    project,
    size: () => dim,
    destroy() {
      gl.canvas.removeEventListener('webglcontextlost', lost);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      gl.canvas.remove();
    },
  };
}
