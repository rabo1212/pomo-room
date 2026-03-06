'use client';

import { memo } from 'react';
import { useRoomStore } from '@/stores/roomStore';
import { uvTo3D, WALL_ITEMS } from './items';
import { PlaceholderItem } from './items/PlaceholderItem';
import { PlantItem } from './items/PlantItems';
import { FurnitureItem } from './items/FurnitureItems';
import { ElectronicsItem } from './items/ElectronicsItems';
import { PetItem } from './items/PetItems';
import { LightingItem } from './items/LightingItems';
import { DecorItem } from './items/DecorItems';
import DraggableItem from './DraggableItem';

function getItemComponent(itemId: string) {
  if (itemId.startsWith('plant_')) return PlantItem;
  if (itemId.startsWith('furniture_')) return FurnitureItem;
  if (itemId.startsWith('electronics_')) return ElectronicsItem;
  if (itemId.startsWith('cat_') || itemId.startsWith('pet_')) return PetItem;
  if (itemId.startsWith('light_')) return LightingItem;
  if (itemId.startsWith('decor_')) return DecorItem;
  return PlaceholderItem;
}

// Default wall positions (for wall items that don't have floor positions)
const WALL_POSITIONS: Record<string, [number, number, number]> = {
  // Left wall items (x = -3.9)
  'light_02': [-3.9, 2.5, 1.5],    // fairy lights
  'light_03': [-3.9, 2.2, -1.0],   // neon sign
  'light_05': [-3.9, 2.8, 0],      // christmas lights
  'plant_07': [-3.9, 2.5, -2.5],   // hanging plant
  'furniture_03': [-3.9, 2.0, 2.0], // poster
  'furniture_08': [-3.9, 2.0, 1.0], // curtain

  // Right wall items (z = -3.9)
  'furniture_01': [1.5, 1.0, -3.9], // bookshelf
  'furniture_09': [-1.5, 1.5, -3.9], // large bookshelf
  'decor_01': [2.5, 2.5, -3.9],    // wall clock
  'decor_02': [0, 2.2, -3.9],      // mirror
  'decor_04': [-2.5, 2.0, -3.9],   // photo frame
};

export const RoomItems = memo(function RoomItems() {
  const activeItemIds = useRoomStore((s) => s.activeItemIds);
  const itemPositions = useRoomStore((s) => s.itemPositions);

  return (
    <group>
      {activeItemIds.map((itemId) => {
        // Skip theme items
        if (itemId.startsWith('theme_')) return null;

        let position: [number, number, number];

        if (WALL_ITEMS.has(itemId)) {
          position = WALL_POSITIONS[itemId] || [-3.9, 2, 0];
        } else {
          const pos = itemPositions[itemId];
          if (pos) {
            position = uvTo3D(pos[0], pos[1]);
          } else {
            position = uvTo3D(0.5, 0.5);
          }
        }

        const Component = getItemComponent(itemId);
        const isWall = WALL_ITEMS.has(itemId);

        if (isWall) {
          return <Component key={itemId} itemId={itemId} position={position} />;
        }

        return (
          <DraggableItem key={itemId} itemId={itemId} position={position}>
            <Component itemId={itemId} position={[0, 0, 0]} />
          </DraggableItem>
        );
      })}
    </group>
  );
});
