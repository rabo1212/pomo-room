'use client';

import { memo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { PastelToonMaterial } from '../materials/ToonMaterial';

interface ItemProps {
  itemId: string;
  position: [number, number, number];
}

function Bookshelf({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.6, 1.2, 0.25]} radius={0.02}>
        <PastelToonMaterial color="#C4956A" />
      </RoundedBox>
      {[0.3, 0, -0.3].map((y, i) => (
        <RoundedBox key={i} args={[0.55, 0.03, 0.22]} radius={0.01} position={[0, y, 0.02]}>
          <PastelToonMaterial color="#A67B50" />
        </RoundedBox>
      ))}
      {/* Books */}
      {[
        { pos: [-0.15, 0.4, 0.02], size: [0.08, 0.2, 0.15] as [number, number, number], color: '#FF6B6B' },
        { pos: [-0.05, 0.4, 0.02], size: [0.06, 0.18, 0.15] as [number, number, number], color: '#7ECEC1' },
        { pos: [0.05, 0.4, 0.02], size: [0.07, 0.22, 0.15] as [number, number, number], color: '#FFB347' },
        { pos: [0.15, 0.4, 0.02], size: [0.05, 0.16, 0.15] as [number, number, number], color: '#B8A9C9' },
        { pos: [-0.1, 0.1, 0.02], size: [0.1, 0.2, 0.15] as [number, number, number], color: '#6B8FAD' },
        { pos: [0.05, 0.1, 0.02], size: [0.08, 0.17, 0.15] as [number, number, number], color: '#FF8A8A' },
      ].map((book, i) => (
        <RoundedBox key={i} args={book.size} radius={0.01} position={book.pos as [number, number, number]}>
          <PastelToonMaterial color={book.color} />
        </RoundedBox>
      ))}
    </group>
  );
}

function Rug({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.6, 16]} />
        <PastelToonMaterial color="#FFB5C5" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[0.45, 16]} />
        <PastelToonMaterial color="#FFC0D0" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <PastelToonMaterial color="#FFD5E0" />
      </mesh>
    </group>
  );
}

function Poster({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.05, 0.5, 0.35]} radius={0.01}>
        <PastelToonMaterial color="#FFF8F0" />
      </RoundedBox>
      <RoundedBox args={[0.06, 0.44, 0.29]} radius={0.01} position={[0.005, 0, 0]}>
        <PastelToonMaterial color="#FFB5C5" />
      </RoundedBox>
      {/* Star decoration */}
      <mesh position={[0.03, 0.05, 0]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <PastelToonMaterial color="#FFB347" />
      </mesh>
    </group>
  );
}

function Sofa({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <RoundedBox args={[1.0, 0.35, 0.5]} radius={0.04} position={[0, 0.2, 0]}>
        <PastelToonMaterial color="#7ECEC1" />
      </RoundedBox>
      {/* Back */}
      <RoundedBox args={[1.0, 0.3, 0.1]} radius={0.03} position={[0, 0.45, -0.2]}>
        <PastelToonMaterial color="#5BB8A8" />
      </RoundedBox>
      {/* Arms */}
      <RoundedBox args={[0.1, 0.3, 0.5]} radius={0.03} position={[-0.5, 0.3, 0]}>
        <PastelToonMaterial color="#5BB8A8" />
      </RoundedBox>
      <RoundedBox args={[0.1, 0.3, 0.5]} radius={0.03} position={[0.5, 0.3, 0]}>
        <PastelToonMaterial color="#5BB8A8" />
      </RoundedBox>
      {/* Cushions */}
      <RoundedBox args={[0.2, 0.15, 0.15]} radius={0.03} position={[-0.2, 0.42, 0.08]}>
        <PastelToonMaterial color="#FFB347" />
      </RoundedBox>
      <RoundedBox args={[0.2, 0.15, 0.15]} radius={0.03} position={[0.2, 0.42, 0.08]}>
        <PastelToonMaterial color="#FF8A8A" />
      </RoundedBox>
    </group>
  );
}

function SideTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.35, 0.04, 0.35]} radius={0.01} position={[0, 0.5, 0]}>
        <PastelToonMaterial color="#C4956A" />
      </RoundedBox>
      {[[-0.12, 0, -0.12], [0.12, 0, -0.12], [-0.12, 0, 0.12], [0.12, 0, 0.12]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.25, p[2]]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
          <PastelToonMaterial color="#A67B50" />
        </mesh>
      ))}
    </group>
  );
}

function Bed({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Frame */}
      <RoundedBox args={[1.0, 0.25, 1.4]} radius={0.03} position={[0, 0.15, 0]}>
        <PastelToonMaterial color="#C4956A" />
      </RoundedBox>
      {/* Mattress */}
      <RoundedBox args={[0.9, 0.12, 1.3]} radius={0.04} position={[0, 0.33, 0]}>
        <PastelToonMaterial color="#FFF8F0" />
      </RoundedBox>
      {/* Blanket */}
      <RoundedBox args={[0.88, 0.06, 0.8]} radius={0.03} position={[0, 0.4, 0.2]}>
        <PastelToonMaterial color="#B8A9C9" />
      </RoundedBox>
      {/* Pillow */}
      <RoundedBox args={[0.35, 0.1, 0.25]} radius={0.04} position={[0, 0.42, -0.5]}>
        <PastelToonMaterial color="#FFB5C5" />
      </RoundedBox>
      {/* Headboard */}
      <RoundedBox args={[1.0, 0.5, 0.06]} radius={0.03} position={[0, 0.45, -0.7]}>
        <PastelToonMaterial color="#A67B50" />
      </RoundedBox>
    </group>
  );
}

function Chair({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.4, 0.04, 0.4]} radius={0.01} position={[0, 0.45, 0]}>
        <PastelToonMaterial color="#FFB347" />
      </RoundedBox>
      <RoundedBox args={[0.4, 0.35, 0.04]} radius={0.01} position={[0, 0.65, -0.18]}>
        <PastelToonMaterial color="#FFB347" />
      </RoundedBox>
      {[[-0.15, 0, -0.15], [0.15, 0, -0.15], [-0.15, 0, 0.15], [0.15, 0, 0.15]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.225, p[2]]}>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 4]} />
          <PastelToonMaterial color="#A67B50" />
        </mesh>
      ))}
    </group>
  );
}

function Curtain({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.06, 0.06, 1.4]} radius={0.02} position={[0, 0.5, 0]}>
        <PastelToonMaterial color="#A67B50" />
      </RoundedBox>
      <RoundedBox args={[0.03, 1.0, 0.5]} radius={0.01} position={[0, -0.05, -0.4]}>
        <PastelToonMaterial color="#FFB5C5" transparent opacity={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.03, 1.0, 0.5]} radius={0.01} position={[0, -0.05, 0.4]}>
        <PastelToonMaterial color="#FFB5C5" transparent opacity={0.7} />
      </RoundedBox>
    </group>
  );
}

function LargeBookshelf({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.3, 2.0, 1.0]} radius={0.02}>
        <PastelToonMaterial color="#C4956A" />
      </RoundedBox>
      {[-0.6, -0.2, 0.2, 0.6].map((y, i) => (
        <RoundedBox key={i} args={[0.28, 0.03, 0.95]} radius={0.01} position={[0.02, y, 0]}>
          <PastelToonMaterial color="#A67B50" />
        </RoundedBox>
      ))}
      {/* Books on shelves */}
      {[0.7, 0.3, -0.1, -0.5].map((y, row) =>
        [0, 1, 2].map((col) => (
          <RoundedBox key={`${row}-${col}`} args={[0.15, 0.18, 0.08]} radius={0.01}
            position={[0.05, y, -0.3 + col * 0.25]}>
            <PastelToonMaterial color={['#FF6B6B', '#7ECEC1', '#FFB347', '#B8A9C9'][row]} />
          </RoundedBox>
        ))
      )}
    </group>
  );
}

function DeskLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.03, 8]} />
        <PastelToonMaterial color="#555" />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.3, 4]} />
        <PastelToonMaterial color="#555" />
      </mesh>
      <mesh position={[0, 0.35, 0.03]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.08, 0.1, 8, 1, true]} />
        <PastelToonMaterial color="#FFB347" />
      </mesh>
      <pointLight position={[0, 0.3, 0.05]} intensity={0.3} color="#FFE4B5" distance={2} />
    </group>
  );
}

const FURNITURE_MAP: Record<string, React.FC<{ position: [number, number, number] }>> = {
  furniture_01: Bookshelf,
  furniture_02: Rug,
  furniture_03: Poster,
  furniture_04: Sofa,
  furniture_05: SideTable,
  furniture_06: Bed,
  furniture_07: Chair,
  furniture_08: Curtain,
  furniture_09: LargeBookshelf,
  furniture_10: DeskLamp,
};

export const FurnitureItem = memo(function FurnitureItem({ itemId, position }: ItemProps) {
  const Component = FURNITURE_MAP[itemId];
  if (!Component) return null;
  return <Component position={position} />;
});
