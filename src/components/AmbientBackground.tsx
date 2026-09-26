'use client';

import React, { useEffect, useRef, useMemo, useSyncExternalStore } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMode } from '@/context/ModeContext';
import styles from './AmbientBackground.module.css';

// Filter out internal R3F Clock deprecation warning until R3F updates to THREE.Timer
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform float uScrollY;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;

// 2D Simplex Noise by Stefan Gustavson & Ian McEwan / Ashima Arts
vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,  // (3.0 - sqrt(3.0)) / 6.0
    0.366025403784439,  // 0.5 * (sqrt(3.0) - 1.0)
    -0.577350269189626, // -1.0 + 2.0 * C.x
    0.024390243902439   // 1.0 / 41.0
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                 + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // Aspect ratio correction to avoid non-uniform stretching
  float maxDim = max(uResolution.x, uResolution.y);
  vec2 aspect = vec2(uResolution.x / maxDim, uResolution.y / maxDim);

  // Vertical displacement warped by scroll progress
  vec2 scrollWarp = vec2(0.0, uScrollY * 0.75);

  // Frequency 1: Macro turbulence (low-frequency slow wave at time * 0.08)
  vec2 macroUv = (vUv * 1.8 + scrollWarp) + vec2(uTime * 0.08, uTime * 0.04);
  float macroNoise = snoise(macroUv) * 0.5 + 0.5;

  // Frequency 2: Micro grain (higher frequency granular motion at time * 0.3)
  vec2 microUv = (vUv * 6.0 + scrollWarp * 0.5) + vec2(uTime * 0.3, -uTime * 0.18);
  float microNoise = snoise(microUv) * 0.5 + 0.5;

  // Combined noise field
  float combinedNoise = macroNoise * 0.65 + microNoise * 0.35;

  // Interactive mouse focus: radial brightening at focus point (smoothstep radius ~0.5, intensity ~0.05-0.08)
  vec2 mouseOffset = (vUv - uMouse) * aspect;
  float mouseDist = length(mouseOffset);
  float mouseGlow = smoothstep(0.5, 0.0, mouseDist) * 0.065;

  // Base background color: near-black #0d0d0f (13, 13, 15)
  vec3 baseColor = vec3(0.05098, 0.05098, 0.05882);

  // Neon accent color: #ccff00 (204, 255, 0)
  vec3 neonColor = vec3(0.8, 1.0, 0.0);

  // Neon #ccff00 tinted luminance variation at 3% to 6% opacity + mouse brightening
  float neonOpacity = 0.03 + (combinedNoise * 0.03) + mouseGlow;

  vec3 finalColor = baseColor + neonColor * neonOpacity;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

/**
 * NoisePlane renders a full-screen quad driven by a custom GLSL shader
 * featuring 2D simplex noise displacement, mouse tracking, and scroll warping.
 */
function NoisePlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const targetMouse = useRef({ x: 0.5, y: 0.5 });
  const currentMouse = useRef({ x: 0.5, y: 0.5 });
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const prefersReducedMotion = useRef(false);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScrollY: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  useEffect(() => {
    // Accessibility: check motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;

    const handlePreferenceChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };

    mediaQuery.addEventListener('change', handlePreferenceChange);

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current.x = e.clientX / window.innerWidth;
      // Invert Y coordinate for WebGL (0 at bottom, 1 at top)
      targetMouse.current.y = 1.0 - e.clientY / window.innerHeight;
    };

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      targetScroll.current = scrollHeight > 0 ? Math.min(Math.max(window.scrollY / scrollHeight, 0), 1) : 0;
    };

    handleScroll();

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', handlePreferenceChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const elapsedTimeRef = useRef(0);

  useFrame(({ size }, delta) => {
    if (!materialRef.current) return;

    // Time update via frame delta (avoids deprecated THREE.Clock in Three.js r184+)
    const isOverdrive =
      typeof document !== 'undefined' &&
      document.body.classList.contains('overdriveActive');
    const speedMultiplier = prefersReducedMotion.current ? 0.05 : isOverdrive ? 3.0 : 1.0;
    elapsedTimeRef.current += delta * speedMultiplier;
    materialRef.current.uniforms.uTime.value = elapsedTimeRef.current;

    // Smooth mouse coordinates (lerp)
    currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.05;
    currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.05;
    materialRef.current.uniforms.uMouse.value.set(
      currentMouse.current.x,
      currentMouse.current.y
    );

    // Smooth scroll coordinates (lerp)
    currentScroll.current += (targetScroll.current - currentScroll.current) * 0.05;
    materialRef.current.uniforms.uScrollY.value = currentScroll.current;

    // Screen resolution
    materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * AmbientBackground component renders a high-performance WebGL ambient noise
 * displacement background layer using React Three Fiber.
 */

// Client mount subscription helper
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function AmbientBackground() {
  const { mode } = useMode();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted || mode === 'boring') {
    return null;
  }

  return (
    <div className={styles.canvasContainer} aria-hidden="true">
      <Canvas
        gl={{ antialias: false, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: 'none' }}
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
      >
        <NoisePlane />
      </Canvas>
    </div>
  );
}
