// 벽에 붙은 아이템 (드래그 불가)
export const WALL_ITEMS = new Set([
  'light_02', 'light_03', 'light_05',           // 줄조명, 네온, 크리스마스
  'furniture_01', 'furniture_03', 'furniture_08', 'furniture_09', // 책꽂이, 포스터, 커튼, 대형책장
  'plant_07',                                     // 행잉 플랜트
  'decor_01', 'decor_02', 'decor_04',            // 벽시계, 거울, 사진액자
]);

export function isFloorItem(id: string): boolean {
  return !WALL_ITEMS.has(id) && !id.startsWith('theme_');
}

export function iso(u: number, v: number): [number, number] {
  return [250 + u * 190 - v * 190, 320 - u * 95 - v * 95];
}

export function isoInverse(x: number, y: number): [number, number] {
  const u = ((x - 250) / 190 + (320 - y) / 95) / 2;
  const v = ((320 - y) / 95 - (x - 250) / 190) / 2;
  return [Math.max(0.05, Math.min(0.95, u)), Math.max(0.05, Math.min(0.95, v))];
}
