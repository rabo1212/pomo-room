'use client';

import { useRef, useState, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { worldToUV } from './items';
import { useRoomStore } from '@/stores/roomStore';

const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const intersectPoint = new THREE.Vector3();

interface DraggableItemProps {
  itemId: string;
  position: [number, number, number];
  children: React.ReactNode;
}

export default function DraggableItem({ itemId, position, children }: DraggableItemProps) {
  const setItemPosition = useRoomStore((s) => s.setItemPosition);
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const liftY = useRef(0);
  const { gl, invalidate } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    // Smooth lift animation
    const targetLift = isDragging ? 0.3 : 0;
    liftY.current += (targetLift - liftY.current) * 0.15;
    groupRef.current.position.y = position[1] + liftY.current;
  });

  const handlePointerDown = useCallback((e: THREE.Event & { stopPropagation: () => void }) => {
    e.stopPropagation();
    setIsDragging(true);
    (gl.domElement as HTMLElement).style.cursor = 'grabbing';
  }, [gl]);

  const handlePointerMove = useCallback((e: THREE.Event & { ray?: THREE.Ray }) => {
    if (!isDragging || !e.ray) return;
    e.ray.intersectPlane(floorPlane, intersectPoint);
    const [u, v] = worldToUV(intersectPoint.x, intersectPoint.z);
    setItemPosition(itemId, u, v);
    invalidate();
  }, [isDragging, itemId, setItemPosition, invalidate]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    (gl.domElement as HTMLElement).style.cursor = 'auto';
    invalidate();
  }, [gl, invalidate]);

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerOver={() => { if (!isDragging) (gl.domElement as HTMLElement).style.cursor = 'grab'; }}
      onPointerOut={() => { if (!isDragging) (gl.domElement as HTMLElement).style.cursor = 'auto'; }}
    >
      {children}
      {/* Shadow circle when dragging */}
      {isDragging && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -liftY.current + 0.02, 0]}>
          <circleGeometry args={[0.3, 12]} />
          <meshBasicMaterial color="#000" transparent opacity={0.15} />
        </mesh>
      )}
    </group>
  );
}
