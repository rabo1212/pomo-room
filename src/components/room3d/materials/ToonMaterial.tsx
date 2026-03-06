'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// 3-step gradient texture for cel-shading
function useGradientMap() {
  return useMemo(() => {
    const colors = new Uint8Array([80, 160, 255]);
    const tex = new THREE.DataTexture(colors, 3, 1, THREE.RedFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

interface PastelToonProps {
  color: string;
  transparent?: boolean;
  opacity?: number;
}

export function PastelToonMaterial({ color, transparent, opacity }: PastelToonProps) {
  const gradientMap = useGradientMap();
  return (
    <meshToonMaterial
      color={color}
      gradientMap={gradientMap}
      transparent={transparent}
      opacity={opacity}
    />
  );
}

export function PastelStandardMaterial({ color, transparent, opacity }: PastelToonProps) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.8}
      metalness={0}
      transparent={transparent}
      opacity={opacity}
    />
  );
}
