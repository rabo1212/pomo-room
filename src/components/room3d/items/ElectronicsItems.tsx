'use client';

import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { PastelToonMaterial } from '../materials/ToonMaterial';
import { GlowMaterial } from '../materials/GlowMaterial';
import * as THREE from 'three';

interface ItemProps {
  itemId: string;
  position: [number, number, number];
}

function GamingMonitor({ position }: { position: [number, number, number] }) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      const t = Date.now() * 0.001;
      const r = Math.sin(t) * 0.5 + 0.5;
      const g = Math.sin(t + 2) * 0.5 + 0.5;
      const b = Math.sin(t + 4) * 0.5 + 0.5;
      mat.emissive.setRGB(r, g, b);
    }
  });

  return (
    <group position={position}>
      {/* Screen frame */}
      <RoundedBox args={[0.7, 0.45, 0.04]} radius={0.02} position={[0, 0.55, 0]}>
        <PastelToonMaterial color="#1a1a2e" />
      </RoundedBox>
      {/* Screen - RGB neon glow! */}
      <mesh ref={glowRef} position={[0, 0.55, 0.025]}>
        <planeGeometry args={[0.62, 0.37]} />
        <GlowMaterial color="#7ECEC1" intensity={1.2} />
      </mesh>
      {/* RGB strip at bottom - neon pop */}
      <mesh position={[0, 0.3, 0.025]}>
        <boxGeometry args={[0.7, 0.02, 0.01]} />
        <GlowMaterial color="#FF6BFF" intensity={2.0} />
      </mesh>
      {/* Stand */}
      <mesh position={[0, 0.2, 0.05]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 6]} />
        <PastelToonMaterial color="#333" />
      </mesh>
      <RoundedBox args={[0.2, 0.02, 0.12]} radius={0.01} position={[0, 0.1, 0.05]}>
        <PastelToonMaterial color="#333" />
      </RoundedBox>
    </group>
  );
}

function Laptop({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base/keyboard */}
      <RoundedBox args={[0.4, 0.02, 0.28]} radius={0.01} position={[0, 0.05, 0]}>
        <PastelToonMaterial color="#888" />
      </RoundedBox>
      {/* Screen */}
      <RoundedBox args={[0.4, 0.28, 0.02]} radius={0.01}
        position={[0, 0.19, -0.13]} rotation={[-0.15, 0, 0]}>
        <PastelToonMaterial color="#666" />
      </RoundedBox>
      {/* Screen glow */}
      <mesh position={[0, 0.19, -0.115]} rotation={[-0.15, 0, 0]}>
        <planeGeometry args={[0.35, 0.22]} />
        <GlowMaterial color="#AED8F0" intensity={0.6} />
      </mesh>
    </group>
  );
}

function GameConsole({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Console body */}
      <RoundedBox args={[0.25, 0.06, 0.18]} radius={0.02} position={[0, 0.05, 0]}>
        <PastelToonMaterial color="#2C2C2C" />
      </RoundedBox>
      {/* Power light - neon */}
      <mesh position={[0.1, 0.09, 0.08]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <GlowMaterial color="#4CAF50" intensity={2.0} />
      </mesh>
      {/* Controller */}
      <RoundedBox args={[0.15, 0.03, 0.1]} radius={0.01} position={[0.2, 0.02, 0.15]}>
        <PastelToonMaterial color="#444" />
      </RoundedBox>
      {/* Controller buttons */}
      <mesh position={[0.24, 0.04, 0.15]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <GlowMaterial color="#FF6B6B" intensity={1.5} />
      </mesh>
      <mesh position={[0.22, 0.04, 0.13]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <GlowMaterial color="#7ECEC1" intensity={1.5} />
      </mesh>
    </group>
  );
}

function Speaker({ position }: { position: [number, number, number] }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ringRef.current) {
      const s = 1 + Math.sin(Date.now() * 0.005) * 0.1;
      ringRef.current.scale.set(s, s, 1);
    }
  });

  return (
    <group position={position}>
      <RoundedBox args={[0.2, 0.3, 0.2]} radius={0.03} position={[0, 0.18, 0]}>
        <PastelToonMaterial color="#333" />
      </RoundedBox>
      {/* Speaker cone */}
      <mesh position={[0, 0.22, 0.11]}>
        <circleGeometry args={[0.06, 12]} />
        <PastelToonMaterial color="#555" />
      </mesh>
      {/* Sound ring - pulsing neon */}
      <mesh ref={ringRef} position={[0, 0.22, 0.12]}>
        <ringGeometry args={[0.065, 0.075, 12]} />
        <GlowMaterial color="#FF6BFF" intensity={1.0} />
      </mesh>
      {/* Power LED */}
      <mesh position={[0, 0.08, 0.11]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <GlowMaterial color="#7ECEC1" intensity={2.0} />
      </mesh>
    </group>
  );
}

const ELECTRONICS_MAP: Record<string, React.FC<{ position: [number, number, number] }>> = {
  electronics_01: GamingMonitor,
  electronics_02: Laptop,
  electronics_03: GameConsole,
  electronics_04: Speaker,
};

export const ElectronicsItem = memo(function ElectronicsItem({ itemId, position }: ItemProps) {
  const Component = ELECTRONICS_MAP[itemId];
  if (!Component) return null;
  return <Component position={position} />;
});
