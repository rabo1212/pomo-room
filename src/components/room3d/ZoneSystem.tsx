'use client';

import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import { uvTo3D } from './items';
import { ZONE_POSITIONS, ZONE_LABELS } from '@/components/room/renderers/zones';
import { useTimerStore } from '@/stores/timerStore';
import { TimerStatus } from '@/types';
import * as THREE from 'three';

// Zone floor marker colors (subtle)
const ZONE_COLORS: Record<TimerStatus, string> = {
  idle: '#B8A9C9',
  focus: '#FF6B6B',
  short_break: '#7ECEC1',
  long_break: '#8BC34A',
  complete: '#FFB347',
};

/** Lobby zone (idle) - Door + umbrella stand */
function LobbyZone() {
  const [x, , z] = uvTo3D(0.15, 0.15);
  return (
    <group position={[x, 0, z]}>
      {/* Door frame */}
      <group position={[-0.8, 0, -0.3]}>
        <RoundedBox args={[0.6, 1.8, 0.1]} radius={0.02} position={[0, 0.9, 0]}>
          <meshToonMaterial color="#8B6F47" />
        </RoundedBox>
        {/* Door handle */}
        <mesh position={[0.2, 0.9, 0.06]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      {/* Umbrella stand */}
      <group position={[0.5, 0, 0.2]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.4, 8]} />
          <meshToonMaterial color="#666666" />
        </mesh>
        {/* Umbrellas */}
        <mesh position={[-0.03, 0.5, 0]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.015, 0.015, 0.4, 4]} />
          <meshToonMaterial color="#FF6B6B" />
        </mesh>
        <mesh position={[0.03, 0.45, 0]} rotation={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 4]} />
          <meshToonMaterial color="#7ECEC1" />
        </mesh>
      </group>
      {/* Welcome mat */}
      <RoundedBox args={[0.8, 0.03, 0.5]} radius={0.01} position={[0, 0.015, 0.4]}>
        <meshToonMaterial color="#C4956A" />
      </RoundedBox>
    </group>
  );
}

/** Break room zone (short_break) - Sofa + vending machine */
function BreakRoomZone() {
  const [x, , z] = uvTo3D(0.78, 0.18);
  return (
    <group position={[x, 0, z]}>
      {/* Sofa */}
      <group position={[0, 0, 0]}>
        {/* Seat */}
        <RoundedBox args={[1.2, 0.3, 0.5]} radius={0.05} position={[0, 0.25, 0]}>
          <meshToonMaterial color="#7ECEC1" />
        </RoundedBox>
        {/* Back */}
        <RoundedBox args={[1.2, 0.4, 0.1]} radius={0.05} position={[0, 0.5, -0.2]}>
          <meshToonMaterial color="#5BB8A8" />
        </RoundedBox>
        {/* Armrests */}
        <RoundedBox args={[0.1, 0.35, 0.5]} radius={0.03} position={[-0.6, 0.35, 0]}>
          <meshToonMaterial color="#5BB8A8" />
        </RoundedBox>
        <RoundedBox args={[0.1, 0.35, 0.5]} radius={0.03} position={[0.6, 0.35, 0]}>
          <meshToonMaterial color="#5BB8A8" />
        </RoundedBox>
        {/* Cushions */}
        <RoundedBox args={[0.25, 0.18, 0.08]} radius={0.04} position={[-0.25, 0.45, -0.1]}>
          <meshToonMaterial color="#FFB347" />
        </RoundedBox>
        <RoundedBox args={[0.25, 0.18, 0.08]} radius={0.04} position={[0.25, 0.45, -0.1]}>
          <meshToonMaterial color="#FF8A8A" />
        </RoundedBox>
      </group>
      {/* Vending machine */}
      <group position={[1.2, 0, -0.8]}>
        <RoundedBox args={[0.5, 1.2, 0.4]} radius={0.03} position={[0, 0.6, 0]}>
          <meshToonMaterial color="#4A90D9" />
        </RoundedBox>
        {/* Display window */}
        <RoundedBox args={[0.35, 0.4, 0.02]} radius={0.02} position={[0, 0.8, 0.2]}>
          <meshStandardMaterial color="#BBDEFB" transparent opacity={0.5} />
        </RoundedBox>
        {/* Drinks */}
        {[-0.08, 0, 0.08].map((dx, i) => (
          <mesh key={i} position={[dx, 0.8, 0.18]}>
            <cylinderGeometry args={[0.03, 0.03, 0.12, 6]} />
            <meshToonMaterial color={['#FF6B6B', '#7ECEC1', '#FFB347'][i]} />
          </mesh>
        ))}
      </group>
      {/* Coffee table */}
      <group position={[0, 0, 0.6]}>
        <RoundedBox args={[0.5, 0.05, 0.3]} radius={0.02} position={[0, 0.3, 0]}>
          <meshToonMaterial color="#C4956A" />
        </RoundedBox>
        {/* Legs */}
        {[[-0.2, 0, -0.1], [0.2, 0, -0.1], [-0.2, 0, 0.1], [0.2, 0, 0.1]].map(([lx, , lz], i) => (
          <mesh key={i} position={[lx, 0.15, lz]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 4]} />
            <meshToonMaterial color="#8B6F47" />
          </mesh>
        ))}
        {/* Coffee cup */}
        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 0.08, 8]} />
          <meshToonMaterial color="#FFFFFF" />
        </mesh>
      </group>
    </group>
  );
}

/** Rooftop garden zone (long_break) - Bench + plants + fountain */
function RooftopGardenZone() {
  const [x, , z] = uvTo3D(0.50, 0.72);
  const fountainRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (fountainRef.current) {
      fountainRef.current.position.y = 0.6 + Math.sin(Date.now() * 0.003) * 0.08;
    }
  });

  return (
    <group position={[x, 0, z]}>
      {/* Grass patch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[1.8, 16]} />
        <meshToonMaterial color="#A5D6A7" />
      </mesh>

      {/* Bench */}
      <group position={[-0.8, 0, 0]}>
        {/* Seat */}
        <RoundedBox args={[1.0, 0.06, 0.3]} radius={0.02} position={[0, 0.4, 0]}>
          <meshToonMaterial color="#8B6F47" />
        </RoundedBox>
        {/* Back */}
        <RoundedBox args={[1.0, 0.4, 0.04]} radius={0.02} position={[0, 0.6, -0.13]}>
          <meshToonMaterial color="#8B6F47" />
        </RoundedBox>
        {/* Legs */}
        <mesh position={[-0.4, 0.2, 0]}>
          <boxGeometry args={[0.05, 0.4, 0.25]} />
          <meshToonMaterial color="#6B5237" />
        </mesh>
        <mesh position={[0.4, 0.2, 0]}>
          <boxGeometry args={[0.05, 0.4, 0.25]} />
          <meshToonMaterial color="#6B5237" />
        </mesh>
      </group>

      {/* Potted plant */}
      <group position={[0.8, 0, 0.5]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.15, 0.12, 0.3, 8]} />
          <meshToonMaterial color="#C4956A" />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshToonMaterial color="#66BB6A" />
        </mesh>
        {/* Flowers */}
        <mesh position={[0.1, 0.55, 0.05]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshToonMaterial color="#FF8A8A" />
        </mesh>
        <mesh position={[-0.08, 0.5, -0.08]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshToonMaterial color="#FFB347" />
        </mesh>
      </group>

      {/* Fountain */}
      <group position={[0.3, 0, -0.6]}>
        {/* Basin */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.35, 0.3, 0.3, 12]} />
          <meshToonMaterial color="#B0BEC5" />
        </mesh>
        {/* Water */}
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 12]} />
          <meshStandardMaterial color="#90CAF9" transparent opacity={0.7} />
        </mesh>
        {/* Water spout */}
        <mesh ref={fountainRef} position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#64B5F6" transparent opacity={0.6} />
        </mesh>
        {/* Center pillar */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.3, 6]} />
          <meshToonMaterial color="#B0BEC5" />
        </mesh>
      </group>
    </group>
  );
}

/** Server room zone (complete) - Server racks with blinking LEDs */
function ServerRoomZone() {
  const [x, , z] = uvTo3D(0.82, 0.62);
  const ledsRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ledsRef.current) return;
    ledsRef.current.children.forEach((led, i) => {
      const mat = (led as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (mat.emissive) {
        const t = Date.now() * 0.001 + i * 1.5;
        mat.emissiveIntensity = 0.5 + Math.sin(t) * 0.5;
      }
    });
  });

  return (
    <group position={[x, 0, z]}>
      {/* Server rack 1 */}
      <group position={[0, 0, -0.3]}>
        <RoundedBox args={[0.5, 1.4, 0.35]} radius={0.02} position={[0, 0.7, 0]}>
          <meshToonMaterial color="#2C2C2C" />
        </RoundedBox>
        {/* Server slots */}
        {[0, 1, 2, 3].map(i => (
          <RoundedBox key={i} args={[0.4, 0.2, 0.02]} radius={0.01} position={[0, 0.3 + i * 0.28, 0.17]}>
            <meshToonMaterial color="#3A3A3A" />
          </RoundedBox>
        ))}
        {/* LEDs */}
        <group ref={ledsRef}>
          {[0, 1, 2, 3].map(i => (
            <mesh key={i} position={[0.15, 0.3 + i * 0.28, 0.19]}>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshStandardMaterial
                color={i < 2 ? '#4CAF50' : '#FFB347'}
                emissive={i < 2 ? '#4CAF50' : '#FFB347'}
                emissiveIntensity={1}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Server rack 2 */}
      <group position={[-0.7, 0, 0.2]}>
        <RoundedBox args={[0.4, 1.1, 0.3]} radius={0.02} position={[0, 0.55, 0]}>
          <meshToonMaterial color="#333333" />
        </RoundedBox>
        {[0, 1, 2].map(i => (
          <RoundedBox key={i} args={[0.3, 0.2, 0.02]} radius={0.01} position={[0, 0.25 + i * 0.28, 0.15]}>
            <meshToonMaterial color="#3A3A3A" />
          </RoundedBox>
        ))}
      </group>

      {/* Cables between racks */}
      <mesh position={[-0.35, 0.7, -0.05]}>
        <torusGeometry args={[0.25, 0.01, 4, 12, Math.PI]} />
        <meshToonMaterial color="#FFB347" />
      </mesh>
      <mesh position={[-0.35, 0.5, -0.05]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.2, 0.01, 4, 12, Math.PI]} />
        <meshToonMaterial color="#7ECEC1" />
      </mesh>
    </group>
  );
}

/** Zone floor markers - subtle circles showing zone boundaries */
function ZoneMarkers() {
  const status = useTimerStore((s) => s.status) as TimerStatus;

  return (
    <group>
      {(Object.keys(ZONE_POSITIONS) as TimerStatus[]).map((zone) => {
        const [u, v] = ZONE_POSITIONS[zone];
        const [x, , z] = uvTo3D(u, v);
        const isActive = zone === status;
        const color = ZONE_COLORS[zone];

        return (
          <group key={zone} position={[x, 0.01, z]}>
            {/* Zone circle marker */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.6, 0.65, 16]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={isActive ? 0.4 : 0.1}
              />
            </mesh>
            {/* Zone label */}
            {isActive && (
              <Html
                position={[0, 0.1, 0.9]}
                center
                style={{ pointerEvents: 'none' }}
              >
                <div className="text-[10px] font-bold opacity-50 font-[family-name:var(--font-fredoka)] whitespace-nowrap">
                  {ZONE_LABELS[zone]}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export const ZoneSystem = memo(function ZoneSystem() {
  return (
    <group>
      <ZoneMarkers />
      <LobbyZone />
      <BreakRoomZone />
      <RooftopGardenZone />
      <ServerRoomZone />
    </group>
  );
});
