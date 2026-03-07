'use client';

import { useMemo } from 'react';
import { OrthographicCamera, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import RoomEnvironment from './RoomEnvironment';
import Character3D from './Character3D';
import { RoomItems } from './RoomItems';
import { ZoneSystem } from './ZoneSystem';

function getTimeOfDayLighting() {
  const h = new Date().getHours();
  if (h >= 21 || h < 6) return { color: '#8890B0', intensity: 0.5 };
  if (h >= 17) return { color: '#FFD0A0', intensity: 0.7 };
  return { color: '#FFFFFF', intensity: 0.8 };
}

export default function RoomScene() {
  const sunlight = useMemo(getTimeOfDayLighting, []);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const zoom = useMemo(() => {
    if (typeof window === 'undefined') return 40;
    const w = window.innerWidth;
    if (w < 480) return 28;
    if (w < 768) return 34;
    return 40;
  }, []);

  return (
    <>
      <color attach="background" args={['#FFF5E8']} />

      {/* Camera: isometric view */}
      <OrthographicCamera
        makeDefault
        zoom={zoom}
        position={[10, 10, 10]}
        near={0.1}
        far={100}
      />

      {/* Lighting */}
      <ambientLight intensity={0.6} color="#FFF5E8" />
      <directionalLight
        position={[-5, 8, -3]}
        intensity={sunlight.intensity}
        color={sunlight.color}
        castShadow={false}
      />
      <directionalLight
        position={[3, 5, 5]}
        intensity={0.3}
        color="#E8D5F0"
      />

      {/* Contact shadows on floor */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.35}
        scale={10}
        blur={2}
        far={4}
        resolution={isMobile ? 128 : 256}
      />

      {/* Room structure */}
      <RoomEnvironment />

      {/* Character */}
      <Character3D />

      {/* Zone props & markers */}
      <ZoneSystem />

      {/* Active items */}
      <RoomItems />

      {/* Neon pop bloom effect (desktop only) */}
      {!isMobile && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.8}
            luminanceSmoothing={0.3}
            intensity={0.5}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}
