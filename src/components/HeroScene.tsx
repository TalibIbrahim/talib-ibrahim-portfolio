"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function FloatingIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const geo = useMemo(() => new THREE.IcosahedronGeometry(1.8, 1), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.08 + mouseRef.current.y * 0.3;
    meshRef.current.rotation.y = t * 0.12 + mouseRef.current.x * 0.3;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.15;
  });

  const handlePointerMove = (e: THREE.Event) => {
    const event = e as unknown as { point: THREE.Vector3 };
    mouseRef.current.x = (event.point.x / viewport.width) * 2;
    mouseRef.current.y = (event.point.y / viewport.height) * 2;
  };

  return (
    <mesh ref={meshRef} geometry={geo} onPointerMove={handlePointerMove}>
      <meshBasicMaterial wireframe color="#ffffff" transparent opacity={0.12} />
    </mesh>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 120;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    ref.current.rotation.x = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#ffffff" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "auto",
        zIndex: 0,
      }}
      gl={{ antialias: true, alpha: true }}
    >
      <FloatingIcosahedron />
      <Particles />
    </Canvas>
  );
}
