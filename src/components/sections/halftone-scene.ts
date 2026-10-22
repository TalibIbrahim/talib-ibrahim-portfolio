// About's halftone ink portrait: the owner's cutout printed as a 45deg screen of pen-blue dots.
// One OGL canvas, one full-screen triangle, everything in the fragment shader:
//   pixel -> rotated grid cell -> sample the photo at each nearby cell centre -> dot radius from
//   darkness (area-proportional), alpha gates it -> centre pushed away from the pointer -> circle SDF.
// The search runs around the *inverse-warped* pixel, so dots keep their round shape even when the
// push is several cells wide. Only uniforms change per frame; the caller drives them on gsap.ticker.
import { Program, Mesh, Renderer, Texture, Triangle } from 'ogl';

export type HalftoneInput = {
  time: number; // seconds, for the idle breathing
  scroll: number; // 0..1 as the frame passes through the viewport
  reveal: number; // 0..1 dots grow in, top to bottom
  pointer: [number, number]; // canvas css px, origin bottom-left
  push: number; // 0..1 pointer strength (eased by the caller)
};

export type HalftoneScene = {
  render: (s: HalftoneInput) => void;
  resize: () => void;
  destroy: () => void;
};

const VERT = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// N = neighbour search radius in cells (1 -> 3x3, 2 -> 5x5).
const FRAG = (n: number) => /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D tMap;
uniform vec2 uRes;      // canvas css px
uniform vec4 uImg;      // image rect in canvas css px: x, y (bottom-left), w, h
uniform float uCell;    // grid pitch, css px
uniform float uTime;
uniform float uScroll;
uniform float uReveal;
uniform vec2 uPointer;  // css px, bottom-left origin
uniform float uPush;
uniform float uRadius;  // push falloff radius, css px
uniform float uAmp;     // max push distance, css px
uniform vec3 uInk;
uniform vec3 uDeep;

const float C = 0.70710678; // cos/sin 45deg
vec2 toGrid(vec2 p) { return vec2(C * p.x + C * p.y, -C * p.x + C * p.y) / uCell; }
vec2 toPx(vec2 g) { g *= uCell; return vec2(C * g.x - C * g.y, C * g.x + C * g.y); }

// Radial push with a gaussian falloff. r -> r + A * exp(-(r/R)^2) stays monotonic while A < 1.16 R.
vec2 push(vec2 c) {
  vec2 d = c - uPointer;
  float r = length(d) + 1e-4;
  float k = uAmp * uPush * exp(-(r * r) / (uRadius * uRadius));
  return c + d / r * k;
}
// Inverse of push (fixed-point): where did the dot now under p come from?
vec2 unpush(vec2 p) {
  vec2 q = p;
  for (int i = 0; i < 4; i++) q = p - (push(q) - q);
  return q;
}

void main() {
  vec2 p = vUv * uRes;
  vec2 g0 = floor(toGrid(unpush(p)));
  float aa = 0.75; // css px of edge softness
  float cov = 0.0;
  float tone = 0.0;
  for (int j = -${n}; j <= ${n}; j++) {
    for (int i = -${n}; i <= ${n}; i++) {
      vec2 cg = g0 + vec2(float(i), float(j)) + 0.5;
      vec2 c = toPx(cg);
      vec2 uv = (c - uImg.xy) / uImg.zw;
      if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) continue;
      vec4 t = texture2D(tMap, uv);
      float a = smoothstep(0.35, 0.75, t.a);
      if (a <= 0.0) continue;
      float lum = dot(t.rgb, vec3(0.299, 0.587, 0.114));
      float dark = clamp(1.0 - lum, 0.0, 1.0);
      dark = smoothstep(0.12, 0.88, dark); // a print curve: lifts the face's midtones
      // Area-proportional radius; a floor so the lightest skin still prints a pin dot.
      float r = (0.08 + 0.92 * sqrt(dark)) * 0.62 * uCell * a;
      // Idle: a slow wave of breath across the sheet. Scroll: a touch larger mid-viewport.
      float breath = 1.0 + 0.07 * sin(uTime * 0.55 + (cg.x + cg.y) * 0.09);
      float pass = 0.9 + 0.14 * sin(3.14159265 * clamp(uScroll, 0.0, 1.0));
      // Reveal: rows grow in from the top, each with a short overlap.
      float rv = clamp(uReveal * 1.6 - (1.0 - uv.y) * 0.6, 0.0, 1.0);
      rv = 1.0 - pow(1.0 - rv, 3.0);
      vec2 cp = push(c);
      float moved = length(cp - c) / max(uAmp, 1.0);
      r *= breath * pass * rv * (1.0 - 0.25 * moved);
      float d = length(p - cp) - r;
      float k = 1.0 - smoothstep(-aa, aa, d);
      if (k > cov) { cov = k; tone = dark; }
    }
  }
  vec3 col = mix(uInk, uDeep, smoothstep(0.55, 1.0, tone) * 0.75);
  gl_FragColor = vec4(col * cov, cov); // premultiplied
}`;

export function createHalftoneScene(
  host: HTMLElement,
  image: HTMLImageElement,
  opts: { mobile: boolean; ink: string; deep: string; pad: number; onLost?: () => void },
): HalftoneScene | null {
  let renderer: Renderer;
  try {
    renderer = new Renderer({
      dpr: Math.min(devicePixelRatio, opts.mobile ? 1.5 : 2),
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
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

  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const texture = new Texture(gl, { image, generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR });

  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG(opts.mobile ? 1 : 2),
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      tMap: { value: texture },
      uRes: { value: [1, 1] },
      uImg: { value: [0, 0, 1, 1] },
      uCell: { value: 7 },
      uTime: { value: 0 },
      uScroll: { value: 0.5 },
      uReveal: { value: 0 },
      uPointer: { value: [-1e4, -1e4] },
      uPush: { value: 0 },
      uRadius: { value: 90 },
      uAmp: { value: 40 },
      uInk: { value: hex(opts.ink) },
      uDeep: { value: hex(opts.deep) },
    },
  });
  // Blend premultiplied output.
  program.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  function resize() {
    const W = host.clientWidth || 1;
    const H = host.clientHeight || 1;
    renderer.setSize(W, H);
    const u = program.uniforms;
    // The canvas overhangs the image by `pad` on every side so pushed dots are not clipped.
    const px = opts.pad * W / (1 + 2 * opts.pad);
    const py = opts.pad * H / (1 + 2 * opts.pad);
    const iw = W - 2 * px;
    const ih = H - 2 * py;
    u.uRes.value = [W, H];
    u.uImg.value = [px, py, iw, ih];
    // ~84 dots across on desktop, ~62 on phones: fine enough to read a face, coarse enough to read as print.
    u.uCell.value = Math.max(3.6, iw / (opts.mobile ? 62 : 84));
    u.uRadius.value = iw * (opts.mobile ? 0.17 : 0.14);
    u.uAmp.value = u.uRadius.value * 0.5;
  }
  resize();

  function render(s: HalftoneInput) {
    const u = program.uniforms;
    u.uTime.value = s.time;
    u.uScroll.value = s.scroll;
    u.uReveal.value = s.reveal;
    u.uPointer.value = s.pointer;
    u.uPush.value = s.push;
    renderer.render({ scene: mesh });
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
