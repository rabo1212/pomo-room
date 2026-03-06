'use client';

import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { PastelToonMaterial } from '../materials/ToonMaterial';
import * as THREE from 'three';

interface ItemProps {
  itemId: string;
  position: [number, number, number];
}

function CatBase({ position, bodyColor, stripeColor }: {
  position: [number, number, number];
  bodyColor: string;
  stripeColor?: string;
}) {
  const tailRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(Date.now() * 0.003) * 0.3;
    }
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.01;
    }
  });

  return (
    <group position={position}>
      <group ref={bodyRef}>
        {/* Body */}
        <RoundedBox args={[0.25, 0.18, 0.35]} radius={0.06} position={[0, 0.15, 0]}>
          <PastelToonMaterial color={bodyColor} />
        </RoundedBox>
        {/* Head */}
        <RoundedBox args={[0.22, 0.2, 0.2]} radius={0.06} position={[0, 0.28, 0.12]}>
          <PastelToonMaterial color={bodyColor} />
        </RoundedBox>
        {/* Ears */}
        <mesh position={[-0.08, 0.4, 0.12]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.04, 0.08, 4]} />
          <PastelToonMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0.08, 0.4, 0.12]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.04, 0.08, 4]} />
          <PastelToonMaterial color={bodyColor} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.05, 0.3, 0.22]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#333" />
        </mesh>
        <mesh position={[0.05, 0.3, 0.22]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#333" />
        </mesh>
        {/* Nose */}
        <mesh position={[0, 0.26, 0.23]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <PastelToonMaterial color="#FFB5B5" />
        </mesh>
        {/* Tail */}
        <mesh ref={tailRef} position={[0, 0.2, -0.2]}>
          <capsuleGeometry args={[0.025, 0.2, 4, 6]} />
          <PastelToonMaterial color={bodyColor} />
        </mesh>
        {/* Paws */}
        {[[-0.08, 0, 0.1], [0.08, 0, 0.1], [-0.08, 0, -0.08], [0.08, 0, -0.08]].map((p, i) => (
          <mesh key={i} position={[p[0], 0.03, p[2]]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <PastelToonMaterial color="#FFF8F0" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Dog({ position }: { position: [number, number, number] }) {
  const tailRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(Date.now() * 0.008) * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Body */}
      <RoundedBox args={[0.25, 0.2, 0.4]} radius={0.06} position={[0, 0.18, 0]}>
        <PastelToonMaterial color="#C4956A" />
      </RoundedBox>
      {/* Head */}
      <RoundedBox args={[0.22, 0.22, 0.2]} radius={0.06} position={[0, 0.32, 0.15]}>
        <PastelToonMaterial color="#C4956A" />
      </RoundedBox>
      {/* Snout */}
      <RoundedBox args={[0.12, 0.1, 0.1]} radius={0.03} position={[0, 0.27, 0.25]}>
        <PastelToonMaterial color="#E8D5C0" />
      </RoundedBox>
      {/* Nose */}
      <mesh position={[0, 0.3, 0.3]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshBasicMaterial color="#333" />
      </mesh>
      {/* Floppy ears */}
      <RoundedBox args={[0.06, 0.12, 0.08]} radius={0.02} position={[-0.12, 0.35, 0.12]}>
        <PastelToonMaterial color="#A67B50" />
      </RoundedBox>
      <RoundedBox args={[0.06, 0.12, 0.08]} radius={0.02} position={[0.12, 0.35, 0.12]}>
        <PastelToonMaterial color="#A67B50" />
      </RoundedBox>
      {/* Eyes */}
      <mesh position={[-0.05, 0.35, 0.24]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshBasicMaterial color="#333" />
      </mesh>
      <mesh position={[0.05, 0.35, 0.24]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshBasicMaterial color="#333" />
      </mesh>
      {/* Tail - wagging */}
      <mesh ref={tailRef} position={[0, 0.28, -0.22]}>
        <capsuleGeometry args={[0.025, 0.15, 4, 6]} />
        <PastelToonMaterial color="#C4956A" />
      </mesh>
      {/* Legs */}
      {[[-0.08, 0, 0.1], [0.08, 0, 0.1], [-0.08, 0, -0.1], [0.08, 0, -0.1]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.08, p[2]]}>
          <capsuleGeometry args={[0.03, 0.1, 4, 6]} />
          <PastelToonMaterial color="#C4956A" />
        </mesh>
      ))}
    </group>
  );
}

function Hamster({ position }: { position: [number, number, number] }) {
  const bodyRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(Date.now() * 0.004) * 0.01;
    }
  });

  return (
    <group position={position}>
      <group ref={bodyRef}>
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <PastelToonMaterial color="#FFE4B5" />
        </mesh>
        {/* Cheeks */}
        <mesh position={[-0.08, 0.1, 0.08]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <PastelToonMaterial color="#FFD5C2" />
        </mesh>
        <mesh position={[0.08, 0.1, 0.08]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <PastelToonMaterial color="#FFD5C2" />
        </mesh>
        {/* Ears */}
        <mesh position={[-0.06, 0.22, 0]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <PastelToonMaterial color="#FFB5B5" />
        </mesh>
        <mesh position={[0.06, 0.22, 0]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <PastelToonMaterial color="#FFB5B5" />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.04, 0.14, 0.1]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshBasicMaterial color="#333" />
        </mesh>
        <mesh position={[0.04, 0.14, 0.1]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshBasicMaterial color="#333" />
        </mesh>
        <mesh position={[0, 0.11, 0.12]}>
          <sphereGeometry args={[0.01, 6, 6]} />
          <PastelToonMaterial color="#FFB5B5" />
        </mesh>
      </group>
    </group>
  );
}

function Parrot({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Perch */}
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
        <PastelToonMaterial color="#C4956A" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.3, 0]}>
        <capsuleGeometry args={[0.06, 0.15, 4, 8]} />
        <PastelToonMaterial color="#4CAF50" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.45, 0.02]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <PastelToonMaterial color="#66BB6A" />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0.43, 0.08]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.02, 0.04, 4]} />
        <PastelToonMaterial color="#FFB347" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.03, 0.46, 0.05]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshBasicMaterial color="#333" />
      </mesh>
      <mesh position={[0.03, 0.46, 0.05]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshBasicMaterial color="#333" />
      </mesh>
      {/* Wing */}
      <mesh position={[-0.08, 0.32, -0.02]} rotation={[0, 0.2, -0.3]}>
        <capsuleGeometry args={[0.03, 0.08, 4, 6]} />
        <PastelToonMaterial color="#FF6B6B" />
      </mesh>
      <mesh position={[0.08, 0.32, -0.02]} rotation={[0, -0.2, 0.3]}>
        <capsuleGeometry args={[0.03, 0.08, 4, 6]} />
        <PastelToonMaterial color="#FFB347" />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 0.18, -0.05]}>
        <capsuleGeometry args={[0.02, 0.1, 4, 6]} />
        <PastelToonMaterial color="#7ECEC1" />
      </mesh>
    </group>
  );
}

function FishBowl({ position }: { position: [number, number, number] }) {
  const fishRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (fishRef.current) {
      fishRef.current.position.x = Math.sin(Date.now() * 0.003) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#AED8F0" transparent opacity={0.35} roughness={0.05} />
      </mesh>
      <mesh ref={fishRef} position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <PastelToonMaterial color="#FFB347" />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.03, 8]} />
        <PastelToonMaterial color="#90CAF9" />
      </mesh>
    </group>
  );
}

const PET_MAP: Record<string, React.FC<{ position: [number, number, number] }>> = {
  cat_01: (props) => <CatBase {...props} bodyColor="#FFB347" />,
  cat_02: (props) => <CatBase {...props} bodyColor="#333333" />,
  cat_03: (props) => <CatBase {...props} bodyColor="#FFF8F0" stripeColor="#FFB347" />,
  pet_01: Dog,
  pet_02: Hamster,
  pet_03: Parrot,
  pet_04: FishBowl,
};

export const PetItem = memo(function PetItem({ itemId, position }: ItemProps) {
  const Component = PET_MAP[itemId];
  if (!Component) return null;
  return <Component position={position} />;
});
