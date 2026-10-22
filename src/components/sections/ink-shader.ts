// The site's only WebGL: the signature's ink bleeds out and floods the page with paper.
// uP 0→1 is scroll progress; the front is a noisy threshold whose leading edge is saturated
// with pen-blue, like wet ink spreading through fibres.
export const VERT = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

export const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uP;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uOrigin;
uniform vec3 uPaper;
uniform vec3 uInk;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
  vec2 p = (vUv - uOrigin) * aspect;
  float d = length(p);
  // Fibres: stretched noise so the bleed creeps unevenly, like ink in paper.
  float n = fbm(vUv * aspect * 3.2 + vec2(uTime * 0.015, -uTime * 0.01));
  float fib = fbm(vec2(vUv.x * 18.0, vUv.y * 2.5) * aspect + n);
  float field = d + (n - 0.5) * 0.55 + (fib - 0.5) * 0.12;
  float r = mix(-0.35, 1.9, uP);
  float soak = smoothstep(r, r - 0.025, field);
  float edge = smoothstep(r - 0.16, r - 0.02, field) * soak;
  // Transparent outside the ink, so the dark desk (the page itself) shows through.
  vec3 col = mix(uPaper, uInk, edge * 0.85);
  // A little paper tooth so the flood never looks like a flat fill.
  col -= (hash(vUv * uRes) - 0.5) * 0.025;
  gl_FragColor = vec4(col, soak);
}`;
