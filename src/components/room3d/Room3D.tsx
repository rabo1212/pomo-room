'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import RoomScene from './RoomScene';

export default function Room3D() {
  return (
    <div className="room3d-canvas w-full h-full">
      <Canvas
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <RoomScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
