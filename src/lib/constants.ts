import { TimerSettings, ShopItem } from '@/types';

export const DEFAULT_TIMER: TimerSettings = {
  focusDuration: 25 * 60, // 25 minutes
  shortBreakDuration: 5 * 60, // 5 minutes
  longBreakDuration: 15 * 60, // 15 minutes
};

export const SESSIONS_PER_SET = 4;

export const COLORS = {
  cream: '#FFF8F0',
  coral: '#FF6B6B',
  mint: '#7ECEC1',
  lavender: '#B8A9C9',
  gold: '#FFB347',
} as const;

export const COINS_PER_POMODORO = 1;

// Default shop items (used for local mode and seeding)
export const SHOP_ITEMS: ShopItem[] = [
  { id: 'plant_01', name: '작은 선인장', description: '책상 위 귀여운 선인장', category: 'plant', price: 1, rarity: 'common', preview_data: null, sort_order: 1 },
  { id: 'plant_02', name: '몬스테라', description: '잎이 큰 몬스테라 화분', category: 'plant', price: 2, rarity: 'common', preview_data: null, sort_order: 2 },
  { id: 'plant_03', name: '벚꽃 나무', description: '미니 벚꽃 분재', category: 'plant', price: 5, rarity: 'rare', preview_data: null, sort_order: 3 },
  { id: 'cat_01', name: '치즈 고양이', description: '졸린 주황 고양이', category: 'pet', price: 3, rarity: 'common', preview_data: null, sort_order: 10 },
  { id: 'cat_02', name: '검은 고양이', description: '신비로운 검은 고양이', category: 'pet', price: 3, rarity: 'common', preview_data: null, sort_order: 11 },
  { id: 'cat_03', name: '삼색 고양이', description: '장난꾸러기 삼색이', category: 'pet', price: 5, rarity: 'rare', preview_data: null, sort_order: 12 },
  { id: 'light_01', name: '책상 스탠드', description: '따뜻한 책상 조명', category: 'lighting', price: 2, rarity: 'common', preview_data: null, sort_order: 20 },
  { id: 'light_02', name: '요정 조명', description: '감성 줄조명', category: 'lighting', price: 5, rarity: 'rare', preview_data: null, sort_order: 21 },
  { id: 'light_03', name: '네온 사인', description: '귀여운 네온 글씨', category: 'lighting', price: 8, rarity: 'rare', preview_data: null, sort_order: 22 },
  { id: 'theme_cozy', name: '아늑한 방', description: '따뜻한 나무 인테리어', category: 'theme', price: 10, rarity: 'legendary', preview_data: null, sort_order: 30 },
  { id: 'theme_nature', name: '숲속 방', description: '초록빛 자연 테마', category: 'theme', price: 10, rarity: 'legendary', preview_data: null, sort_order: 31 },
  { id: 'theme_space', name: '우주 방', description: '별빛 가득한 우주 테마', category: 'theme', price: 15, rarity: 'legendary', preview_data: null, sort_order: 32 },
  { id: 'furniture_01', name: '책꽂이', description: '아담한 미니 책꽂이', category: 'furniture', price: 4, rarity: 'common', preview_data: null, sort_order: 40 },
  { id: 'furniture_02', name: '러그', description: '동그란 귀여운 러그', category: 'furniture', price: 3, rarity: 'common', preview_data: null, sort_order: 41 },
  { id: 'furniture_03', name: '포스터', description: '힘이 나는 포스터', category: 'furniture', price: 2, rarity: 'common', preview_data: null, sort_order: 42 },
];

// 테마별 방 색상
export const THEME_COLORS = {
  default: {
    wallLeft: ['#D5C8B8', '#E5D9CB'],  // gradient stops
    wallRight: ['#DDD1C3', '#CFC2B2'],
    baseboard: ['#C4A882', '#B89E78'],
    floor: '#D4A574',
    floorGrain: '#C89A65',
    corner: '#C0B3A3',
  },
  cozy: {
    wallLeft: ['#E8D5C0', '#F0E0CC'],
    wallRight: ['#ECD9C4', '#DFC8B0'],
    baseboard: ['#C4956A', '#B88555'],
    floor: '#C4956A',
    floorGrain: '#B88555',
    corner: '#BFA88E',
  },
  nature: {
    wallLeft: ['#C5D9C0', '#D5E5CF'],
    wallRight: ['#CDDEC7', '#BAD0B2'],
    baseboard: ['#8BAF7E', '#7A9E6E'],
    floor: '#B8C9A0',
    floorGrain: '#A5B88D',
    corner: '#9AB88A',
  },
  space: {
    wallLeft: ['#2A2D4E', '#363A60'],
    wallRight: ['#313565', '#282C50'],
    baseboard: ['#1E2040', '#1A1C38'],
    floor: '#252848',
    floorGrain: '#1E2040',
    corner: '#404570',
  },
} as const;

const VALID_THEMES = new Set<string>(['default', 'cozy', 'nature', 'space']);

/** 테마 문자열을 검증하여 유효한 RoomTheme 반환 */
export function validateTheme(theme: unknown): 'default' | 'cozy' | 'nature' | 'space' {
  if (typeof theme === 'string' && VALID_THEMES.has(theme)) {
    return theme as 'default' | 'cozy' | 'nature' | 'space';
  }
  return 'default';
}
