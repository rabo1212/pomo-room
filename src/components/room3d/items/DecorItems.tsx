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

function WallClock({ position }: { position: [number, number, number] }) {
  const handRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (handRef.current) {
      handRef.current.rotation.y = -Date.now() * 0.001;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
        <PastelToonMaterial color="#FFF8F0" />
      </mesh>
      <mesh position={[0, 0, 0.025]}>
        <circleGeometry args={[0.18, 16]} />
        <PastelToonMaterial color="#FFF8F0" />
      </mesh>
      {/* Hour marks */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(angle) * 0.15, Math.cos(angle) * 0.15, 0.03]}>
            <sphereGeometry args={[0.01, 4, 4]} />
            <PastelToonMaterial color="#C4956A" />
          </mesh>
        );
      })}
      {/* Hands */}
      <mesh ref={handRef} position={[0, 0, 0.035]}>
        <boxGeometry args={[0.01, 0.12, 0.005]} />
        <PastelToonMaterial color="#333" />
      </mesh>
      {/* Frame ring */}
      <mesh>
        <torusGeometry args={[0.2, 0.015, 6, 24]} />
        <PastelToonMaterial color="#C4956A" />
      </mesh>
    </group>
  );
}

function Mirror({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Frame */}
      <mesh>
        <torusGeometry args={[0.22, 0.025, 6, 24]} />
        <PastelToonMaterial color="#FFB347" />
      </mesh>
      {/* Mirror surface */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial color="#E0E8F0" metalness={0.8} roughness={0.1} />
      </mesh>
    </group>
  );
}

function Trophy({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <RoundedBox args={[0.15, 0.04, 0.15]} radius={0.01} position={[0, 0.02, 0]}>
        <PastelToonMaterial color="#333" />
      </RoundedBox>
      {/* Stem */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.02, 0.04, 0.15, 6]} />
        <GlowMaterial color="#FFB347" intensity={0.8} />
      </mesh>
      {/* Cup */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.08, 0.04, 0.12, 8]} />
        <GlowMaterial color="#FFB347" intensity={1.0} />
      </mesh>
      {/* Handles */}
      <mesh position={[-0.1, 0.25, 0]} rotation={[0, 0, 0.3]}>
        <torusGeometry args={[0.03, 0.008, 4, 8, Math.PI]} />
        <GlowMaterial color="#FFB347" intensity={0.8} />
      </mesh>
      <mesh position={[0.1, 0.25, 0]} rotation={[0, 0, -0.3]}>
        <torusGeometry args={[0.03, 0.008, 4, 8, Math.PI]} />
        <GlowMaterial color="#FFB347" intensity={0.8} />
      </mesh>
      {/* Star on top */}
      <mesh position={[0, 0.34, 0]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <GlowMaterial color="#FFE066" intensity={2.0} />
      </mesh>
    </group>
  );
}

function PhotoFrame({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.04, 0.3, 0.25]} radius={0.01}>
        <PastelToonMaterial color="#C4956A" />
      </RoundedBox>
      <mesh position={[0.025, 0, 0]}>
        <planeGeometry args={[0.01, 0.24, 0.19]} />
        <PastelToonMaterial color="#FFE4B5" />
      </mesh>
      {/* Photo content (abstract) */}
      <mesh position={[0.026, 0.03, 0]}>
        <circleGeometry args={[0.04, 8]} />
        <PastelToonMaterial color="#FF8A8A" />
      </mesh>
      <mesh position={[0.026, -0.04, 0.02]}>
        <circleGeometry args={[0.03, 8]} />
        <PastelToonMaterial color="#7ECEC1" />
      </mesh>
    </group>
  );
}

function Globe({ position }: { position: [number, number, number] }) {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.04, 8]} />
        <PastelToonMaterial color="#C4956A" />
      </mesh>
      {/* Stand */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.15, 4]} />
        <PastelToonMaterial color="#A67B50" />
      </mesh>
      {/* Globe */}
      <mesh ref={globeRef} position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <PastelToonMaterial color="#7ECEC1" />
      </mesh>
      {/* Continents (abstract) */}
      <mesh position={[0.05, 0.28, 0.08]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <PastelToonMaterial color="#81C784" />
      </mesh>
    </group>
  );
}

const DECOR_MAP: Record<string, React.FC<{ position: [number, number, number] }>> = {
  decor_01: WallClock,
  decor_02: Mirror,
  decor_03: Trophy,
  decor_04: PhotoFrame,
  decor_05: Globe,
};

export const DecorItem = memo(function DecorItem({ itemId, position }: ItemProps) {
  const Component = DECOR_MAP[itemId];
  if (!Component) return null;
  return <Component position={position} />;
});
