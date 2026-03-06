import { WALL_ITEMS } from '@/components/room/renderers';

export { WALL_ITEMS };

export function isFloorItem3D(id: string): boolean {
  return !WALL_ITEMS.has(id) && !id.startsWith('theme_');
}

/** Convert roomStore (u,v) in [0,1] to 3D world coordinates */
export function uvTo3D(u: number, v: number): [number, number, number] {
  return [u * 8 - 4, 0, v * 8 - 4];
}

/** Convert 3D world coordinates back to (u,v) in [0,1] */
export function worldToUV(x: number, z: number): [number, number] {
  const u = (x + 4) / 8;
  const v = (z + 4) / 8;
  return [
    Math.max(0.05, Math.min(0.95, u)),
    Math.max(0.05, Math.min(0.95, v)),
  ];
}

/** Category-based placeholder colors */
export const CATEGORY_COLORS: Record<string, string> = {
  plant: '#7DD88A',
  pet: '#FFB347',
  lighting: '#FFE066',
  furniture: '#C4956A',
  electronics: '#7ECEC1',
  decor: '#B8A9C9',
};
