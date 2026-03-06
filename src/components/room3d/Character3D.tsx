'use client';

import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import { useTimerStore } from '@/stores/timerStore';
import { PastelToonMaterial } from './materials/ToonMaterial';
import { useLerpPosition } from './hooks/useLerpPosition';
import { ZONE_POSITIONS, ZONE_BUBBLES } from '@/components/room/renderers/zones';
import { TimerStatus } from '@/types';
import * as THREE from 'three';

const BODY_COLORS: Record<TimerStatus, string> = {
  idle: '#B8A9C9',
  focus: '#7ECEC1',
  short_break: '#FFB347',
  long_break: '#FFB347',
  complete: '#FF8A8A',
};

export default memo(function Character3D() {
  const status = useTimerStore((s) => s.status) as TimerStatus;
  const target = ZONE_POSITIONS[status] || ZONE_POSITIONS.idle;
  const { posRef, isWalking, walkFrame } = useLerpPosition(target[0], target[1]);

  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Group>(null);

  const bodyColor = BODY_COLORS[status];
  const bubble = ZONE_BUBBLES[status];

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Update position from LERP
    groupRef.current.position.copy(posRef.current);

    const t = walkFrame.current * 0.15;
    const walking = isWalking.current;

    // Walking animation
    if (walking) {
      // Arm swing
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t) * 0.5;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(t) * 0.5;
      // Leg swing
      if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.sin(t) * 0.4;
      if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(t) * 0.4;
      // Body bounce
      if (bodyRef.current) bodyRef.current.position.y = Math.abs(Math.sin(t * 2)) * 0.05;
    } else {
      // Idle animation
      if (leftArmRef.current) leftArmRef.current.rotation.x *= 0.9;
      if (rightArmRef.current) rightArmRef.current.rotation.x *= 0.9;
      if (leftLegRef.current) leftLegRef.current.rotation.x *= 0.9;
      if (rightLegRef.current) rightLegRef.current.rotation.x *= 0.9;

      // Status-specific idle
      if (bodyRef.current) {
        if (status === 'focus') {
          // Typing bob
          bodyRef.current.position.y = Math.sin(Date.now() * 0.008) * 0.015;
        } else if (status === 'complete') {
          // Celebration bounce
          bodyRef.current.position.y = Math.abs(Math.sin(Date.now() * 0.005)) * 0.1;
        } else {
          // Gentle float
          bodyRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.02;
        }
      }
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={bodyRef}>
        {/* Speech bubble */}
        <Html position={[0, 2.2, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div className="game-hud-pill text-xs whitespace-nowrap">
            {bubble}
          </div>
        </Html>

        {/* Head */}
        <RoundedBox args={[0.4, 0.4, 0.38]} radius={0.08} position={[0, 1.55, 0]}>
          <PastelToonMaterial color="#FFD5C2" />
        </RoundedBox>

        {/* Hair */}
        <RoundedBox args={[0.44, 0.22, 0.42]} radius={0.06} position={[0, 1.78, -0.02]}>
          <PastelToonMaterial color="#8B6F47" />
        </RoundedBox>

        {/* Eyes */}
        <group position={[0, 1.55, 0.2]}>
          {status === 'focus' ? (
            // Focused eyes (small dots)
            <>
              <mesh position={[-0.08, 0, 0]}>
                <sphereGeometry args={[0.025, 6, 6]} />
                <meshBasicMaterial color="#333" />
              </mesh>
              <mesh position={[0.08, 0, 0]}>
                <sphereGeometry args={[0.025, 6, 6]} />
                <meshBasicMaterial color="#333" />
              </mesh>
            </>
          ) : status === 'complete' ? (
            // Star eyes (bigger, brighter)
            <>
              <mesh position={[-0.08, 0, 0]}>
                <sphereGeometry args={[0.035, 6, 6]} />
                <meshBasicMaterial color="#FFB347" />
              </mesh>
              <mesh position={[0.08, 0, 0]}>
                <sphereGeometry args={[0.035, 6, 6]} />
                <meshBasicMaterial color="#FFB347" />
              </mesh>
            </>
          ) : (status === 'short_break' || status === 'long_break') ? (
            // Happy curved eyes
            <>
              <mesh position={[-0.08, 0, 0]} rotation={[0, 0, 0.2]}>
                <capsuleGeometry args={[0.015, 0.04, 2, 4]} />
                <meshBasicMaterial color="#333" />
              </mesh>
              <mesh position={[0.08, 0, 0]} rotation={[0, 0, -0.2]}>
                <capsuleGeometry args={[0.015, 0.04, 2, 4]} />
                <meshBasicMaterial color="#333" />
              </mesh>
            </>
          ) : (
            // Normal eyes
            <>
              <mesh position={[-0.08, 0, 0]}>
                <sphereGeometry args={[0.03, 6, 6]} />
                <meshBasicMaterial color="#333" />
              </mesh>
              <mesh position={[0.08, 0, 0]}>
                <sphereGeometry args={[0.03, 6, 6]} />
                <meshBasicMaterial color="#333" />
              </mesh>
            </>
          )}
        </group>

        {/* Mouth */}
        <mesh position={[0, 1.45, 0.2]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color={status === 'complete' ? '#FF6B6B' : '#E88B8B'} />
        </mesh>

        {/* Cheek blush */}
        <mesh position={[-0.14, 1.48, 0.16]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshBasicMaterial color="#FFB5B5" transparent opacity={0.4} />
        </mesh>
        <mesh position={[0.14, 1.48, 0.16]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshBasicMaterial color="#FFB5B5" transparent opacity={0.4} />
        </mesh>

        {/* Body */}
        <RoundedBox args={[0.38, 0.45, 0.28]} radius={0.06} position={[0, 1.1, 0]}>
          <PastelToonMaterial color={bodyColor} />
        </RoundedBox>

        {/* Arms */}
        <mesh ref={leftArmRef} position={[-0.26, 1.15, 0]}>
          <capsuleGeometry args={[0.06, 0.3, 4, 6]} />
          <PastelToonMaterial color="#FFD5C2" />
        </mesh>
        <mesh ref={rightArmRef} position={[0.26, 1.15, 0]}>
          <capsuleGeometry args={[0.06, 0.3, 4, 6]} />
          <PastelToonMaterial color="#FFD5C2" />
        </mesh>

        {/* Legs */}
        <mesh ref={leftLegRef} position={[-0.1, 0.6, 0]}>
          <capsuleGeometry args={[0.06, 0.35, 4, 6]} />
          <PastelToonMaterial color="#6B8FAD" />
        </mesh>
        <mesh ref={rightLegRef} position={[0.1, 0.6, 0]}>
          <capsuleGeometry args={[0.06, 0.35, 4, 6]} />
          <PastelToonMaterial color="#6B8FAD" />
        </mesh>

        {/* Shoes */}
        <RoundedBox args={[0.12, 0.06, 0.16]} radius={0.02} position={[-0.1, 0.35, 0.02]}>
          <PastelToonMaterial color="#FF6B6B" />
        </RoundedBox>
        <RoundedBox args={[0.12, 0.06, 0.16]} radius={0.02} position={[0.1, 0.35, 0.02]}>
          <PastelToonMaterial color="#FF6B6B" />
        </RoundedBox>
      </group>
    </group>
  );
});
