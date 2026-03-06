'use client';

interface GlowProps {
  color: string;
  intensity?: number;
}

export function GlowMaterial({ color, intensity = 1.5 }: GlowProps) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={intensity}
      roughness={0.3}
      metalness={0.1}
    />
  );
}
