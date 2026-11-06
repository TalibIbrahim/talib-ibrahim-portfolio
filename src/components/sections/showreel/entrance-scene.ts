// The Work entrance: project 01's cover as one OGL plane (32 x 24) that pulls from the small tilted
// card into its slot. Every vertex lerps from the card to the slot with its own delay, so the
// top-left corner leads and the bottom-right trails, and the sheet sags while it travels:
//   d = (u^1.5 + (1 - v)^1.5) / 2        0 at the top-left, 1 at the bottom-right
//   k = smoothstep(.3d, .7 + .3d, p)      this vertex's progress
//   y += (1 - cos 2pi k) / 2 * .06 H      the sag (down, then back up as it lands)
// Colour arrives the same way: the luma map (desk black -> pen blue -> paper, the same table as the
// DOM's #ink-duo filter) mixes into the real cover by k. One draw call; drawn only when p changes.
// Coordinates are stage css px; the canvas covers only the box the card travels through.
import { Mesh, Plane, Program, Renderer, Texture } from 'ogl';

export type Rect = { cx: number; cy: number; w: number; h: number };
export type Pose = { from: Rect; rot: number; to: Rect; focus: [number, number, number] };

export type EntranceScene = {
  setPose: (pose: Pose) => void;
  /** The canvas covers the box (x, y, w, h) of the stage, in stage px. */
  resize: (x: number, y: number, w: number, h: number) => void;
  render: (p: number) => void;
  destroy: () => void;
};

const VERT = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;
uniform vec4 uFrom;   // centre xy, size wh (stage px)
uniform vec4 uTo;
uniform float uRot;   // radians, css sense (y down)
uniform vec2 uRes;
uniform vec2 uOrigin; // the canvas' top-left in stage px (it only covers the card's path)
uniform float uP;
varying vec2 vUv;
varying float vK;
void main() {
  float d = (pow(uv.x, 1.5) + pow(1.0 - uv.y, 1.5)) * 0.5;
  float k = smoothstep(d * 0.3, 0.7 + d * 0.3, uP);
  vec2 l = vec2(uv.x - 0.5, 0.5 - uv.y);
  vec2 lf = l * uFrom.zw;
  float c = cos(uRot);
  float s = sin(uRot);
  vec2 a = uFrom.xy + vec2(lf.x * c - lf.y * s, lf.x * s + lf.y * c);
  vec2 b = uTo.xy + l * uTo.zw;
  vec2 q = mix(a, b, k) - uOrigin;
  q.y += (1.0 - cos(k * 6.2831853)) * 0.5 * 0.06 * uTo.w;
  vUv = uv;
  vK = k;
  gl_Position = vec4(q.x / uRes.x * 2.0 - 1.0, 1.0 - q.y / uRes.y * 2.0, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uTexSize;
uniform vec2 uPlane;   // slot w, h
uniform vec3 uFocus;   // object-position x, y (0..1 from top-left), zoom
varying vec2 vUv;
varying float vK;
const vec3 A = vec3(0.043, 0.043, 0.047);
const vec3 B = vec3(0.302, 0.420, 1.0);
const vec3 C = vec3(0.925, 0.910, 0.875);
void main() {
  // object-fit: cover + object-position + scale(zoom) about the focus point, as the DOM img does
  float pa = uPlane.x / uPlane.y;
  float ta = uTexSize.x / uTexSize.y;
  vec2 sc = pa > ta ? vec2(1.0, ta / pa) : vec2(pa / ta, 1.0);
  vec2 f = uFocus.xy;
  vec2 q = vec2(vUv.x, 1.0 - vUv.y);
  q = f + (q - f) / uFocus.z;
  vec2 t = (1.0 - sc) * f + q * sc;
  vec3 c = texture2D(uTex, vec2(t.x, 1.0 - t.y)).rgb;
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  vec3 duo = l < 0.5 ? mix(A, B, l * 2.0) : mix(B, C, l * 2.0 - 1.0);
  gl_FragColor = vec4(mix(duo, c, vK), 1.0);
}`;

export function createEntranceScene(
  host: HTMLElement,
  image: HTMLImageElement,
  opts: { onLost?: () => void } = {},
): EntranceScene | null {
  let renderer: Renderer;
  try {
    renderer = new Renderer({
      // No MSAA: the edges are smoothed by the DPR on dense screens, and the canvas is cleared
      // and drawn only while the card is moving.
      dpr: Math.min(devicePixelRatio, 1.75),
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

  const texture = new Texture(gl, { image, generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR });
  const geometry = new Plane(gl, { width: 1, height: 1, widthSegments: 32, heightSegments: 24 });
  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    depthTest: false,
    depthWrite: false,
    cullFace: false,
    uniforms: {
      uTex: { value: texture },
      uTexSize: { value: [image.naturalWidth || 1, image.naturalHeight || 1] },
      uPlane: { value: [16, 9] },
      uFocus: { value: [0.5, 0.5, 1] },
      uFrom: { value: [0, 0, 1, 1] },
      uTo: { value: [0, 0, 1, 1] },
      uRot: { value: 0 },
      uRes: { value: [1, 1] },
      uOrigin: { value: [0, 0] },
      uP: { value: 0 },
    },
  });
  const mesh = new Mesh(gl, { geometry, program });
  const u = program.uniforms;

  return {
    setPose({ from, rot, to, focus }) {
      u.uFrom.value = [from.cx, from.cy, from.w, from.h];
      u.uTo.value = [to.cx, to.cy, to.w, to.h];
      u.uRot.value = rot;
      u.uPlane.value = [to.w, to.h];
      u.uFocus.value = focus;
    },
    resize(x, y, w, h) {
      renderer.setSize(w, h);
      u.uRes.value = [w, h];
      u.uOrigin.value = [x, y];
    },
    render(p) {
      u.uP.value = p;
      renderer.render({ scene: mesh });
    },
    destroy() {
      gl.canvas.removeEventListener('webglcontextlost', lost);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      gl.canvas.remove();
    },
  };
}
