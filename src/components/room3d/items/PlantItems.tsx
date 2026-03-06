'use client';

import { memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { PastelToonMaterial } from '../materials/ToonMaterial';
import { GlowMaterial } from '../materials/GlowMaterial';
import { useRef } from 'react';
import * as THREE from 'three';

interface ItemProps {
  itemId: string;
  position: [number, number, number];
}

function Cactus({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.3, 8]} />
        <PastelToonMaterial color="#C4956A" />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <capsuleGeometry args={[0.09, 0.4, 4, 8]} />
        <PastelToonMaterial color="#7DD88A" />
      </mesh>
      <mesh position={[-0.12, 0.7, 0]}>
        <capsuleGeometry args={[0.05, 0.15, 4, 6]} />
        <PastelToonMaterial color="#6BC87A" />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <PastelToonMaterial color="#FF8A8A" />
      </mesh>
    </group>
  );
}

function Monstera({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.16, 0.13, 0.3, 8]} />
        <PastelToonMaterial color="#C4956A" />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 4]} />
        <PastelToonMaterial color="#4CAF50" />
      </mesh>
      {[0, 1.2, 2.4, 3.6, 5].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.15, 0.55 + i * 0.06, Math.sin(angle) * 0.15]} rotation={[0.3, angle, 0.2]}>
          <sphereGeometry args={[0.12, 6, 6]} />
          <PastelToonMaterial color={i % 2 === 0 ? '#4CAF50' : '#66BB6A'} />
        </mesh>
      ))}
    </group>
  );
}

function SakuraTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.35, 8]} />
        <PastelToonMaterial color="#C4956A" />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.4, 4]} />
        <PastelToonMaterial color="#8B6F47" />
      </mesh>
      {[[-0.1, 0.85, 0], [0.1, 0.9, -0.08], [0, 0.95, 0.08], [-0.08, 0.75, -0.1], [0.12, 0.8, 0.05]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <PastelToonMaterial color={i % 2 === 0 ? '#FFB5C5' : '#FFC0D0'} />
        </mesh>
      ))}
    </group>
  );
}

function FlowerPot({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.14, 0.1, 0.25, 8]} />
        <PastelToonMaterial color="#FFB347" />
      </mesh>
      {[[-0.05, 0.4, 0], [0.05, 0.45, 0.03], [0, 0.42, -0.04]].map((p, i) => (
        <group key={i} position={p as [number, number, number]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.15, 3]} />
            <PastelToonMaterial color="#4CAF50" />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <PastelToonMaterial color={['#FF6B6B', '#FFB347', '#B8A9C9'][i]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BigTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.2, 0.16, 0.35, 8]} />
        <PastelToonMaterial color="#C4956A" />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.35, 4]} />
        <PastelToonMaterial color="#8B6F47" />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <PastelToonMaterial color="#4CAF50" />
      </mesh>
      <mesh position={[0.1, 1.05, 0.05]}>
        <sphereGeometry args={[0.15, 6, 6]} />
        <PastelToonMaterial color="#66BB6A" />
      </mesh>
    </group>
  );
}

function Aquarium({ position }: { position: [number, number, number] }) {
  const fishRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (fishRef.current) {
      fishRef.current.position.x = Math.sin(Date.now() * 0.002) * 0.1;
      fishRef.current.position.y = 0.35 + Math.sin(Date.now() * 0.003) * 0.03;
    }
  });

  return (
    <group position={position}>
      <RoundedBox args={[0.5, 0.4, 0.3]} radius={0.02} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#AED8F0" transparent opacity={0.4} roughness={0.1} />
      </RoundedBox>
      <mesh ref={fishRef} position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <PastelToonMaterial color="#FF6B6B" />
      </mesh>
      <mesh position={[0.08, 0.25, 0]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <PastelToonMaterial color="#FFB347" />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.45, 0.04, 0.25]} />
        <PastelToonMaterial color="#90CAF9" />
      </mesh>
    </group>
  );
}

function HangingPlant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.15, 8]} />
        <PastelToonMaterial color="#C4956A" />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[Math.cos(i * 1.5) * 0.08, -0.15 - i * 0.08, Math.sin(i * 1.5) * 0.08]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <PastelToonMaterial color={i % 2 === 0 ? '#4CAF50' : '#81C784'} />
        </mesh>
      ))}
    </group>
  );
}

const PLANT_MAP: Record<string, React.FC<{ position: [number, number, number] }>> = {
  plant_01: Cactus,
  plant_02: Monstera,
  plant_03: SakuraTree,
  plant_04: FlowerPot,
  plant_05: BigTree,
  plant_06: Aquarium,
  plant_07: HangingPlant,
};

export const PlantItem = memo(function PlantItem({ itemId, position }: ItemProps) {
  const Component = PLANT_MAP[itemId];
  if (!Component) return null;
  return <Component position={position} />;
});
