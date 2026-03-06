'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { uvTo3D } from '../items';

const LERP_SPEED = 0.04;

export function useLerpPosition(targetU: number, targetV: number) {
  const [tx, , tz] = uvTo3D(targetU, targetV);
  const posRef = useRef(new THREE.Vector3(tx, 0, tz));
  const isWalking = useRef(false);
  const walkFrame = useRef(0);

  useFrame(() => {
    const target = new THREE.Vector3(tx, 0, tz);
    const dist = posRef.current.distanceTo(target);

    if (dist > 0.02) {
      posRef.current.lerp(target, LERP_SPEED);
      isWalking.current = true;
      walkFrame.current += 1;
    } else {
      posRef.current.copy(target);
      isWalking.current = false;
      walkFrame.current = 0;
    }
  });

  return { posRef, isWalking, walkFrame };
}
