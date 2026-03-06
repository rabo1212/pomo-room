'use client';

import { memo, useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { useRoomStore } from '@/stores/roomStore';
import { THEME_COLORS } from '@/lib/constants';
import { RoomTheme } from '@/types';
import { PastelToonMaterial } from './materials/ToonMaterial';
import { GlowMaterial } from './materials/GlowMaterial';

const ROOM_SIZE = 8;
const WALL_HEIGHT = 4;
const HALF = ROOM_SIZE / 2;

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 21 || h < 6) return 'night';
  if (h >= 17) return 'evening';
  return 'day';
}

const WINDOW_COLORS = {
  night: '#2C3E6B',
  evening: '#FFD0A0',
  day: '#AED8F0',
};

export default memo(function RoomEnvironment() {
  const theme = useRoomStore((s) => s.theme) as RoomTheme;
  const colors = THEME_COLORS[theme] || THEME_COLORS.default;
  const timeOfDay = useMemo(getTimeOfDay, []);
  const windowColor = WINDOW_COLORS[timeOfDay];

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
        <PastelToonMaterial color={colors.floor} />
      </mesh>

      {/* Floor grid lines */}
      <gridHelper args={[ROOM_SIZE, 8, '#00000015', '#00000008']} position={[0, 0.005, 0]} />

      {/* Left wall */}
      <mesh position={[-HALF, WALL_HEIGHT / 2, 0]}>
        <planeGeometry args={[ROOM_SIZE, WALL_HEIGHT]} />
        <PastelToonMaterial color={colors.wallLeft[0]} />
      </mesh>
      <mesh position={[-HALF, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[ROOM_SIZE, WALL_HEIGHT]} />
        <PastelToonMaterial color={colors.wallLeft[1]} />
      </mesh>

      {/* Right wall */}
      <mesh position={[0, WALL_HEIGHT / 2, -HALF]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_SIZE, WALL_HEIGHT]} />
        <PastelToonMaterial color={colors.wallRight[0]} />
      </mesh>
      <mesh position={[0, WALL_HEIGHT / 2, -HALF]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_SIZE, WALL_HEIGHT]} />
        <PastelToonMaterial color={colors.wallRight[1]} />
      </mesh>

      {/* Baseboards - left wall */}
      <RoundedBox args={[ROOM_SIZE, 0.15, 0.08]} radius={0.02} position={[-HALF + 0.04, 0.075, 0]}>
        <PastelToonMaterial color={colors.baseboard[0]} />
      </RoundedBox>

      {/* Baseboards - right wall */}
      <RoundedBox args={[0.08, 0.15, ROOM_SIZE]} radius={0.02} position={[0, 0.075, -HALF + 0.04]}>
        <PastelToonMaterial color={colors.baseboard[0]} />
      </RoundedBox>

      {/* Window on left wall */}
      <group position={[-HALF + 0.02, 2.2, 0.5]}>
        {/* Window frame */}
        <RoundedBox args={[0.08, 1.6, 1.2]} radius={0.02}>
          <PastelToonMaterial color={colors.baseboard[0]} />
        </RoundedBox>
        {/* Window glass */}
        <mesh position={[0.01, 0, 0]}>
          <planeGeometry args={[0.02, 1.4, 1.0]} />
          <GlowMaterial color={windowColor} intensity={0.3} />
        </mesh>
        {/* Window divider */}
        <RoundedBox args={[0.1, 0.04, 1.2]} radius={0.01} position={[0.01, 0, 0]}>
          <PastelToonMaterial color={colors.baseboard[1]} />
        </RoundedBox>
        <RoundedBox args={[0.1, 1.6, 0.04]} radius={0.01} position={[0.01, 0, 0]}>
          <PastelToonMaterial color={colors.baseboard[1]} />
        </RoundedBox>
      </group>

      {/* Desk (fixed furniture at focus zone) */}
      <group position={[-0.64, 0, -1.24]}>
        {/* Desk top */}
        <RoundedBox args={[1.4, 0.08, 0.7]} radius={0.02} position={[0, 0.75, 0]}>
          <PastelToonMaterial color={colors.baseboard[0]} />
        </RoundedBox>
        {/* Desk legs */}
        {[[-0.6, 0, -0.25], [0.6, 0, -0.25], [-0.6, 0, 0.25], [0.6, 0, 0.25]].map((pos, i) => (
          <RoundedBox key={i} args={[0.06, 0.75, 0.06]} radius={0.01} position={[pos[0], 0.375, pos[2]]}>
            <PastelToonMaterial color={colors.baseboard[1]} />
          </RoundedBox>
        ))}
        {/* Monitor */}
        <group position={[0, 1.05, -0.1]}>
          {/* Screen */}
          <RoundedBox args={[0.7, 0.45, 0.04]} radius={0.02}>
            <GlowMaterial color="#1a1a2e" intensity={0.2} />
          </RoundedBox>
          {/* Screen glow (neon pop!) */}
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[0.62, 0.37]} />
            <GlowMaterial color="#7ECEC1" intensity={0.8} />
          </mesh>
          {/* Stand */}
          <RoundedBox args={[0.06, 0.2, 0.06]} radius={0.01} position={[0, -0.33, 0.05]}>
            <PastelToonMaterial color="#555" />
          </RoundedBox>
          <RoundedBox args={[0.25, 0.03, 0.15]} radius={0.01} position={[0, -0.44, 0.08]}>
            <PastelToonMaterial color="#555" />
          </RoundedBox>
        </group>
        {/* Coffee mug */}
        <group position={[0.5, 0.82, 0.15]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.05, 0.1, 8]} />
            <PastelToonMaterial color="#FF6B6B" />
          </mesh>
          {/* Handle */}
          <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.03, 0.01, 4, 8, Math.PI]} />
            <PastelToonMaterial color="#FF6B6B" />
          </mesh>
        </group>
      </group>

      {/* Chair at desk */}
      <group position={[-0.64, 0, -0.6]}>
        {/* Seat */}
        <RoundedBox args={[0.5, 0.06, 0.45]} radius={0.02} position={[0, 0.5, 0]}>
          <PastelToonMaterial color="#FF8A8A" />
        </RoundedBox>
        {/* Back */}
        <RoundedBox args={[0.5, 0.45, 0.06]} radius={0.02} position={[0, 0.75, -0.2]}>
          <PastelToonMaterial color="#FF8A8A" />
        </RoundedBox>
        {/* Base */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
          <PastelToonMaterial color="#555" />
        </mesh>
        {/* Wheel base */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 6]} />
          <PastelToonMaterial color="#444" />
        </mesh>
      </group>

      {/* Corner accent (wall intersection) */}
      <RoundedBox args={[0.04, WALL_HEIGHT, 0.04]} radius={0.01} position={[-HALF, WALL_HEIGHT / 2, -HALF]}>
        <PastelToonMaterial color={colors.corner} />
      </RoundedBox>
    </group>
  );
});
