'use client';

import { memo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { PastelToonMaterial } from '../materials/ToonMaterial';
import { CATEGORY_COLORS } from './index';
import { getItemCategory } from '@/lib/constants';

interface PlaceholderItemProps {
  itemId: string;
  position: [number, number, number];
}

export const PlaceholderItem = memo(function PlaceholderItem({ itemId, position }: PlaceholderItemProps) {
  const category = getItemCategory(itemId) || 'decor';
  const color = CATEGORY_COLORS[category] || '#B8A9C9';

  return (
    <group position={position}>
      <RoundedBox args={[0.4, 0.4, 0.4]} radius={0.06} position={[0, 0.2, 0]}>
        <PastelToonMaterial color={color} />
      </RoundedBox>
    </group>
  );
});
