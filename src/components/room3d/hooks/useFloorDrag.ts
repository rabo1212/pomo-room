'use client';

import { useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { worldToUV } from '../items';
import { useRoomStore } from '@/stores/roomStore';

const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const intersection = new THREE.Vector3();

export function useFloorDrag(itemId: string) {
  const setItemPosition = useRoomStore((s) => s.setItemPosition);
  const { raycaster, camera, gl } = useThree();
  const dragging = useRef(false);
  const liftY = useRef(0);

  const onPointerDown = useCallback((e: THREE.Event & { stopPropagation: () => void }) => {
    e.stopPropagation();
    dragging.current = true;
    liftY.current = 0.3;
    (gl.domElement as HTMLElement).style.cursor = 'grabbing';
  }, [gl]);

  const onPointerMove = useCallback((e: THREE.Event & { point?: THREE.Vector3 }) => {
    if (!dragging.current) return;
    // Use raycaster to find floor intersection
    raycaster.ray.intersectPlane(floorPlane, intersection);
    const [u, v] = worldToUV(intersection.x, intersection.z);
    setItemPosition(itemId, u, v);
  }, [raycaster, itemId, setItemPosition]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    liftY.current = 0;
    (gl.domElement as HTMLElement).style.cursor = 'auto';
  }, [gl]);

  return { onPointerDown, onPointerMove, onPointerUp, dragging, liftY };
}
