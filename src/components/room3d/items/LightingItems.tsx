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

function FloorLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.03, 8]} />
        <PastelToonMaterial color="#555" />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.3, 4]} />
        <PastelToonMaterial color="#555" />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <coneGeometry args={[0.15, 0.2, 8, 1, true]} />
        <PastelToonMaterial color="#FFE4B5" />
      </mesh>
      <mesh position={[0, 1.28, 0]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <GlowMaterial color="#FFE4B5" intensity={1.5} />
      </mesh>
      <pointLight position={[0, 1.3, 0]} intensity={0.5} color="#FFE4B5" distance={3} />
    </group>
  );
}

function FairyLights({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* String */}
      {Array.from({ length: 8 }, (_, i) => {
        const t = i / 7;
        const x = t * 2.5 - 1.25;
        const y = Math.sin(t * Math.PI) * -0.15;
        const colors = ['#FF6B6B', '#FFB347', '#7ECEC1', '#B8A9C9', '#FFE066', '#FF8A8A', '#7DD88A', '#FF6BFF'];
        return (
          <group key={i} position={[0, y, x]}>
            <mesh>
              <sphereGeometry args={[0.025, 6, 6]} />
              <GlowMaterial color={colors[i]} intensity={1.8} />
            </mesh>
            <pointLight intensity={0.1} color={colors[i]} distance={0.5} />
          </group>
        );
      })}
    </group>
  );
}

function NeonSign({ position }: { position: [number, number, number] }) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.5 + Math.sin(Date.now() * 0.003) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Back board */}
      <RoundedBox args={[0.04, 0.3, 0.5]} radius={0.01}>
        <PastelToonMaterial color="#2C2C2C" />
      </RoundedBox>
      {/* Neon text "FOCUS" - represented as glowing bar */}
      <mesh ref={glowRef} position={[0.03, 0, 0]}>
        <boxGeometry args={[0.02, 0.12, 0.35]} />
        <GlowMaterial color="#FF6BFF" intensity={2.0} />
      </mesh>
      {/* Secondary glow line */}
      <mesh position={[0.03, -0.08, 0]}>
        <boxGeometry args={[0.02, 0.03, 0.25]} />
        <GlowMaterial color="#7ECEC1" intensity={1.5} />
      </mesh>
      <pointLight position={[0.1, 0, 0]} intensity={0.4} color="#FF6BFF" distance={2} />
    </group>
  );
}

function Candle({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (flameRef.current) {
      const s = 1 + Math.sin(Date.now() * 0.01) * 0.15;
      flameRef.current.scale.set(s, s + Math.random() * 0.1, s);
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.15, 6]} />
        <PastelToonMaterial color="#FFF8F0" />
      </mesh>
      <mesh ref={flameRef} position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <GlowMaterial color="#FFB347" intensity={2.0} />
      </mesh>
      <pointLight position={[0, 0.22, 0]} intensity={0.2} color="#FFB347" distance={1.5} />
    </group>
  );
}

function ChristmasLights({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {Array.from({ length: 10 }, (_, i) => {
        const t = i / 9;
        const z = t * 3 - 1.5;
        const y = Math.sin(t * Math.PI * 2) * 0.1;
        const colors = ['#FF0000', '#00FF00', '#FFB347', '#FF6B6B', '#7ECEC1', '#FF0000', '#FFE066', '#00FF00', '#FF8A8A', '#B8A9C9'];
        return (
          <group key={i} position={[0, y, z]}>
            <mesh>
              <sphereGeometry args={[0.03, 6, 6]} />
              <GlowMaterial color={colors[i]} intensity={1.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function LavaLamp({ position }: { position: [number, number, number] }) {
  const blob1Ref = useRef<THREE.Mesh>(null);
  const blob2Ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const t = Date.now() * 0.001;
    if (blob1Ref.current) {
      blob1Ref.current.position.y = 0.2 + Math.sin(t * 0.5) * 0.12;
    }
    if (blob2Ref.current) {
      blob2Ref.current.position.y = 0.35 + Math.sin(t * 0.5 + 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.06, 8]} />
        <PastelToonMaterial color="#555" />
      </mesh>
      {/* Glass body */}
      <mesh position={[0, 0.25, 0]}>
        <capsuleGeometry args={[0.05, 0.3, 8, 12]} />
        <meshStandardMaterial color="#B8A9C9" transparent opacity={0.3} roughness={0.05} />
      </mesh>
      {/* Lava blobs - neon glow */}
      <mesh ref={blob1Ref} position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <GlowMaterial color="#FF6BFF" intensity={2.0} />
      </mesh>
      <mesh ref={blob2Ref} position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <GlowMaterial color="#FF6BFF" intensity={1.5} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 0.43, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.04, 8]} />
        <PastelToonMaterial color="#555" />
      </mesh>
      <pointLight position={[0, 0.25, 0]} intensity={0.2} color="#FF6BFF" distance={1.5} />
    </group>
  );
}

const LIGHTING_MAP: Record<string, React.FC<{ position: [number, number, number] }>> = {
  light_01: FloorLamp,
  light_02: FairyLights,
  light_03: NeonSign,
  light_04: Candle,
  light_05: ChristmasLights,
  light_06: LavaLamp,
};

export const LightingItem = memo(function LightingItem({ itemId, position }: ItemProps) {
  const Component = LIGHTING_MAP[itemId];
  if (!Component) return null;
  return <Component position={position} />;
});
