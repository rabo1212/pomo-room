import { TimerSettings, ShopItem, ItemCategory } from '@/types';

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
  // === 식물 (7) ===
  { id: 'plant_01', name: '작은 선인장', description: '책상 위 귀여운 선인장', category: 'plant', price: 1, rarity: 'common', preview_data: null, sort_order: 1 },
  { id: 'plant_02', name: '몬스테라', description: '잎이 큰 몬스테라 화분', category: 'plant', price: 2, rarity: 'common', preview_data: null, sort_order: 2 },
  { id: 'plant_03', name: '벚꽃 나무', description: '미니 벚꽃 분재', category: 'plant', price: 5, rarity: 'rare', preview_data: null, sort_order: 3 },
  { id: 'plant_04', name: '꽃 화분', description: '알록달록 튤립 화분', category: 'plant', price: 2, rarity: 'common', preview_data: null, sort_order: 4 },
  { id: 'plant_05', name: '큰 나무', description: '잎이 무성한 미니 나무', category: 'plant', price: 6, rarity: 'rare', preview_data: null, sort_order: 5 },
  { id: 'plant_06', name: '수족관', description: '물고기가 헤엄치는 수족관', category: 'plant', price: 10, rarity: 'legendary', preview_data: null, sort_order: 6 },
  { id: 'plant_07', name: '행잉 플랜트', description: '늘어지는 덩굴 화분', category: 'plant', price: 4, rarity: 'rare', preview_data: null, sort_order: 7 },

  // === 동물 (7) ===
  { id: 'cat_01', name: '치즈 고양이', description: '졸린 주황 고양이', category: 'pet', price: 3, rarity: 'common', preview_data: null, sort_order: 10 },
  { id: 'cat_02', name: '검은 고양이', description: '신비로운 검은 고양이', category: 'pet', price: 3, rarity: 'common', preview_data: null, sort_order: 11 },
  { id: 'cat_03', name: '삼색 고양이', description: '장난꾸러기 삼색이', category: 'pet', price: 5, rarity: 'rare', preview_data: null, sort_order: 12 },
  { id: 'pet_01', name: '강아지', description: '꼬리 흔드는 강아지', category: 'pet', price: 5, rarity: 'rare', preview_data: null, sort_order: 13 },
  { id: 'pet_02', name: '햄스터', description: '볼 가득 먹는 햄스터', category: 'pet', price: 3, rarity: 'common', preview_data: null, sort_order: 14 },
  { id: 'pet_03', name: '앵무새', description: '알록달록 앵무새', category: 'pet', price: 6, rarity: 'rare', preview_data: null, sort_order: 15 },
  { id: 'pet_04', name: '어항', description: '금붕어가 든 어항', category: 'pet', price: 4, rarity: 'common', preview_data: null, sort_order: 16 },

  // === 조명 (6) ===
  { id: 'light_01', name: '플로어 스탠드', description: '따뜻한 조명 스탠드', category: 'lighting', price: 2, rarity: 'common', preview_data: null, sort_order: 20 },
  { id: 'light_02', name: '요정 조명', description: '감성 줄조명', category: 'lighting', price: 5, rarity: 'rare', preview_data: null, sort_order: 21 },
  { id: 'light_03', name: '네온 사인', description: '귀여운 네온 글씨', category: 'lighting', price: 8, rarity: 'rare', preview_data: null, sort_order: 22 },
  { id: 'light_04', name: '양초', description: '은은한 촛불 분위기', category: 'lighting', price: 2, rarity: 'common', preview_data: null, sort_order: 23 },
  { id: 'light_05', name: '크리스마스 조명', description: '반짝반짝 크리스마스', category: 'lighting', price: 6, rarity: 'rare', preview_data: null, sort_order: 24 },
  { id: 'light_06', name: '라바 램프', description: '몽글몽글 라바 램프', category: 'lighting', price: 8, rarity: 'legendary', preview_data: null, sort_order: 25 },

  // === 테마 (3) ===
  { id: 'theme_cozy', name: '아늑한 방', description: '따뜻한 나무 인테리어', category: 'theme', price: 10, rarity: 'legendary', preview_data: null, sort_order: 30 },
  { id: 'theme_nature', name: '숲속 방', description: '초록빛 자연 테마', category: 'theme', price: 10, rarity: 'legendary', preview_data: null, sort_order: 31 },
  { id: 'theme_space', name: '우주 방', description: '별빛 가득한 우주 테마', category: 'theme', price: 15, rarity: 'legendary', preview_data: null, sort_order: 32 },

  // === 가구 (10) ===
  { id: 'furniture_01', name: '책꽂이', description: '아담한 미니 책꽂이', category: 'furniture', price: 4, rarity: 'common', preview_data: null, sort_order: 40 },
  { id: 'furniture_02', name: '러그', description: '동그란 귀여운 러그', category: 'furniture', price: 3, rarity: 'common', preview_data: null, sort_order: 41 },
  { id: 'furniture_03', name: '포스터', description: '힘이 나는 포스터', category: 'furniture', price: 2, rarity: 'common', preview_data: null, sort_order: 42 },
  { id: 'furniture_04', name: '소파', description: '푹신한 미니 소파', category: 'furniture', price: 5, rarity: 'rare', preview_data: null, sort_order: 43 },
  { id: 'furniture_05', name: '사이드 테이블', description: '작은 보조 테이블', category: 'furniture', price: 3, rarity: 'common', preview_data: null, sort_order: 44 },
  { id: 'furniture_06', name: '침대', description: '포근한 싱글 침대', category: 'furniture', price: 8, rarity: 'rare', preview_data: null, sort_order: 45 },
  { id: 'furniture_07', name: '의자', description: '편한 사무 의자', category: 'furniture', price: 3, rarity: 'common', preview_data: null, sort_order: 46 },
  { id: 'furniture_08', name: '커튼', description: '예쁜 창가 커튼', category: 'furniture', price: 4, rarity: 'common', preview_data: null, sort_order: 47 },
  { id: 'furniture_09', name: '대형 책장', description: '책이 가득한 대형 책장', category: 'furniture', price: 6, rarity: 'rare', preview_data: null, sort_order: 48 },
  { id: 'furniture_10', name: '책상 램프', description: '귀여운 미니 램프', category: 'furniture', price: 2, rarity: 'common', preview_data: null, sort_order: 49 },

  // === 전자기기 (4) ===
  { id: 'electronics_01', name: '게이밍 모니터', description: 'RGB 빛나는 모니터', category: 'electronics', price: 8, rarity: 'rare', preview_data: null, sort_order: 50 },
  { id: 'electronics_02', name: '노트북', description: '슬림한 노트북', category: 'electronics', price: 5, rarity: 'common', preview_data: null, sort_order: 51 },
  { id: 'electronics_03', name: '게임 콘솔', description: '레트로 게임기', category: 'electronics', price: 6, rarity: 'rare', preview_data: null, sort_order: 52 },
  { id: 'electronics_04', name: '스피커', description: '쿵쿵 블루투스 스피커', category: 'electronics', price: 4, rarity: 'common', preview_data: null, sort_order: 53 },

  // === 장식 (5) ===
  { id: 'decor_01', name: '벽시계', description: '똑딱똑딱 벽시계', category: 'decor', price: 3, rarity: 'common', preview_data: null, sort_order: 60 },
  { id: 'decor_02', name: '거울', description: '예쁜 원형 거울', category: 'decor', price: 4, rarity: 'common', preview_data: null, sort_order: 61 },
  { id: 'decor_03', name: '트로피', description: '집중왕 트로피', category: 'decor', price: 10, rarity: 'legendary', preview_data: null, sort_order: 62 },
  { id: 'decor_04', name: '사진 액자', description: '추억이 담긴 액자', category: 'decor', price: 2, rarity: 'common', preview_data: null, sort_order: 63 },
  { id: 'decor_05', name: '지구본', description: '빙글빙글 지구본', category: 'decor', price: 5, rarity: 'rare', preview_data: null, sort_order: 64 },
];

// 아이템 ID → 카테고리 매핑 (빠른 조회)
const itemCategoryMap = new Map(SHOP_ITEMS.map(item => [item.id, item.category]));

export function getItemCategory(itemId: string): ItemCategory | undefined {
  return itemCategoryMap.get(itemId);
}

// 배타적 카테고리: 한 카테고리에서 하나만 활성화
export const EXCLUSIVE_CATEGORIES = new Set<ItemCategory>(['plant', 'pet', 'lighting']);

export function findActiveByCategory(activeItemIds: string[], category: ItemCategory): string | undefined {
  return activeItemIds.find(id => getItemCategory(id) === category);
}

export function findAllActiveByCategory(activeItemIds: string[], category: ItemCategory): string[] {
  return activeItemIds.filter(id => getItemCategory(id) === category);
}

// 테마별 방 색상
export const THEME_COLORS = {
  default: {
    wallLeft: ['#D5C8B8', '#E5D9CB'],
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
